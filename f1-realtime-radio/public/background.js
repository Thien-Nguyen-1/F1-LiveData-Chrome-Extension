chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

    SetUpInitalizers()
})

// documentation on ports for 2-way communication: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/Port#sender

const connections = {};
const poller = {id:null};
const baseULR = 'https://api.openf1.org/v1/team_radio';
const raceControlURL = 'https://api.openf1.org/v1/race_control?session_key=latest';
const searchArgs = {
    session_key: 'latest', //or use 'latest', british gp: 9558
}
const chatHistory = {lastMessage: [{recording_url: ""}]};
const raceControlHistory = {lastMessage: {}}

const returnObj = {
    cmd: "",
    data: null,
};


function SetUpInitalizers() {

    chrome.runtime.onConnect.addListener((port) => {
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
}




async function StartPolling(port) {
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
                    console.log("Nothing new")
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