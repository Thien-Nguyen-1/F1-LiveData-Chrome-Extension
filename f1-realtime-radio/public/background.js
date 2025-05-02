chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

    SetUpInitalizers()
})

// documentation on ports for 2-way communication: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/Port#sender

const connections = {};

const poller = {id:null};
const carpoller = {id:null, currentCar: null}

const baseULR = 'https://api.openf1.org/v1/team_radio';
const baseCarURL = 'https://api.openf1.org/v1/car_data';
const raceControlURL = 'https://api.openf1.org/v1/race_control?session_key=latest';
const searchArgs = {
    session_key: 'latest', //or use 'latest', british gp: 9558
}
const chatHistory = {lastMessage: [{recording_url: ""}]};
const raceControlHistory = {lastMessage: {}}

const carDataHistory = {lastData: null}







function SetUpInitalizers() {

    chrome.runtime.onConnect.addListener((port) => {
        console.log("RECEIVED INFORMATION FROM THE PORT 22")
        switch (port.name) {
            case "establish-demo-port-connection":

                console.log("STARTGIN DEMO")
                // console.log(port)
                connections[port.sender.id] = port;

                searchArgs.session_key = 9558//7763

                StartPolling(port);

                port.onDisconnect.addListener(()=>{
                    delete connections[port.sender.id]
                })
                break;
            case "establish-live-port-connection":


                console.log("STARTING LIVE")
                connections[port.sender.id] = port;

                searchArgs.session_key = 'latest'

                StartLivePolling(port);

                port.onDisconnect.addListener(()=>{
                    delete connections[port.sender.id]
                })
                break;


         
        }

    })


    chrome.runtime.onConnect.addListener((port) => {
        console.log("RECEIVED INFORMATION FROM THE PORT")


        port.onMessage.addListener((msg) => {
        switch (msg.cmd) {
            case "start-car-data":
                console.log("Starting car data ", msg.data);
                carDataHistory.lastData = null;
                
                //abort current fetches
                if(carpoller.id){
                    console.log("CLEARING INTERVAL")
                    clearInterval(carpoller.id);
                    carpoller.id = null;
                    carpoller.currentCar = null;
                    
                }

                console.log("THE INTERVAL IS ", carpoller.id)

                carpoller.currentCar = msg.data

                carpoller.id = setInterval(() => {const carNum=carpoller.currentCar; StartCarPolling(port, carNum)}, 1500)
                // StartCarPolling(port)

                break;

            // Add other message types here if needed
        }
    });
    })
}



// POLLERS //



async function StartCarPolling(port, carNum) {

    // console.log("RUNNING CAR DATA POLLING FOR CAR ", carNum)

    const returnObj = {
        cmd: "show-car-data",
        data: null,
    };

    if(port && !port.disconnected){
        try{

          
            const response = await fetch(baseCarURL+"?"+new URLSearchParams({session_key:'latest', driver_number:carNum}));
            const data = await response.json();
            
            console.log("DATA LENGTH IS ", data.length)

            if(response.ok && data.length > 0){
                
                if(!carDataHistory.lastData){
                    carDataHistory.lastData = data.slice(-1)[0];

                    returnObj.data = data.slice(-1);
                    port.postMessage(returnObj);

                    console.log("POST MESSAGING FOR CAR NUMBER", carNum)
                     //returnObj.data = data.slice(Math.ceil(data.length/2), data.length)//data; FOR TESTING ONLY
                   // port.postMessage(returnObj); //for testing, keep this. For actual usage, comment this out
                


                } else{ 
                    const lastIndex = data.findLastIndex((datObj) => datObj.date === carDataHistory.lastData.date)

                    if(lastIndex !== -1 && lastIndex !== data.length - 1){ //if it is found and not the last element 

                        const deltaData = data.slice(lastIndex, data.length); //returns array of subsection

                        returnObj.data = deltaData;   
                        
                        carDataHistory.lastData = data.slice(-1)[0];
                        
                        console.log("NEW DATA TO BE SENT IS ", deltaData)
                        port.postMessage(returnObj);


                    } else{
                        // console.log("STOP FIRING DATA")
                    }

                } 

            } 
        
        }catch(error){
          
            clearInterval(carpoller.id)
            carpoller.id = null;
            carpoller.currentCar = null;
            carDataHistory.lastData = null;
            return;
        } 

        


    } else{
        console.log("PORT dIsconnected")
        if(carpoller.id){
            
            clearInterval(carpoller.id);
            carpoller.id = null;
            carpoller.currentCar = null;
        }
    }
}



async function StartPolling(port) {

    const returnObj = {
        cmd: "",
        data: null,
    };

    if (port && !port.disconnected) {
       
        try {
            const response = await fetch(baseULR + "?" + new URLSearchParams(searchArgs).toString());
            

            if(response.ok){
                const data = await response.json()

                returnObj.cmd = "show-recording"
                returnObj.data = data

                port.postMessage(returnObj);


            }
        } catch(error) {
            throw new Error("Unable to retrieve race information")
        }
        

        poller.id = setTimeout(() => StartPolling(port), 2000);
    } else {
      
        if (poller.id) {
            console.log("CLEARING PORT")
            clearTimeout(poller.id);
            poller.id = null;
        }
    }
}




async function StartLivePolling(port) {

    const returnObj = {
        cmd: "",
        data: null,
    };


    if (port && !port.disconnected) {

         
        try {
            const response = await fetch(baseULR + "?" + new URLSearchParams(searchArgs).toString());
            const responseRC = await fetch(raceControlURL);


            if(response.ok ){
                const data = await response.json();
                const dataRC = await responseRC.json();

               // console.log("DATA RACE CONTROL: ", dataRC)
                

                const objLatest = data.slice(-1) //arr of last object length 1
                const rcObjLatest = dataRC.slice(-1)    

                // CHECK FOR RACE CONTROL EVENTS //

                if(rcObjLatest[0] != raceControlHistory.lastMessage){
                    raceControlHistory.lastMessage = rcObjLatest[0]
                    
                    // console.log("NEW RACE CONTROL OBJ ", rcObjLatest[0])
                    
                    returnObj.cmd="show-race-control";
                    returnObj.data = rcObjLatest[0];

                    port.postMessage(returnObj);
                } else {
                    console.log("No match for race control")
                }


                
                // CHECK FOR RADIO //
                
                if(objLatest[0].recording_url !== chatHistory.lastMessage[0].recording_url){
                    chatHistory.lastMessage = objLatest
                    // console.log("New item added ", chatHistory.lastMessage[0])
                    
                    returnObj.cmd = "show-recording"
                    returnObj.data = objLatest

                     port.postMessage(returnObj);
                } else {
                    // console.log("Nothing new")
                }

               

            }
        } catch(error) {
            throw new Error("Unable to retrieve race information")
        } 

        poller.id = setTimeout(() => StartLivePolling(port), 2500);

    } else {
      
        if (poller.id) {
            console.log("CLEARING PORT")
            clearTimeout(poller.id);
            poller.id = null;
        }
    }

}