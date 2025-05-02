import { useState, useEffect , useRef} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GetDriverDetail, GetSpechToText } from './services/data-api'
import { ToggleTabMute } from './services/chrome-handler'
import DriverMessage from './components/DriverMessage'
import F1NotifSound from './assets/sounds/F1NotificationSound.mp3';
import RaceControlContainer from './components/RaceControl'
import DriverLiveInfo from './components/DriverLiveInfo'

import MainPage from './pages/MainPage'
import VenuePage from './pages/VenuPage'
import CarLiveInfo from './components/CarLiveInfo'


function App() {
  
  const isPlaying = useRef(false)
  const [driverObj, setDriver] = useState({}) // ONLY FOR RADIO MESSAGSE
  const [raceControlObj, setRC] = useState({})
  const [carData, setCarData] = useState({})

  const [page, setPage] = useState("main")


  const userPort = useRef(null);


  const GetMessage = async (data) => {
    if (!isPlaying.current) {
      isPlaying.current = true

      for (const record of data) {
        const driverNum = record.driver_number;

         const driverDetail = await GetDriverDetail(driverNum);
         const transcript = await GetSpechToText(record.recording_url);

        // console.log(driverDetail)

        const newDriverDetail = {...driverDetail, transcript:transcript}

        
        await ToggleTabMute();

        setDriver(newDriverDetail);
        await playAudio(F1NotifSound);
        await playAudio(record.recording_url);

        await ToggleTabMute();
        
      }

      isPlaying.current = false
    }
  };


  const ShowRaceControl = (data) => {
    setRC(data);
  }

  const ShowCarData = (data) => {
    setCarData(data);
  }

  // CAR DATA FUNCTIONALITIES //

  const StartFetchCarData = (carNum) => {
    if(userPort.current){
      console.log("FIRING PORT")
      userPort.current.postMessage({cmd:"start-car-data", data: carNum})
    } else{
      console.log("THERES NO PORT")
    }
  }



  // PAGE ROUTING //



  const SetPage = (choice) => {
    setPage(choice)
  }



  const playAudio = (url) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.play();
      audio.onended = resolve; 
    });
  };


  useEffect(() => {
    //demo or live
    const port = chrome.runtime.connect({name: "establish-live-port-connection"});
    userPort.current = port;
    
    port.onMessage.addListener((data)=> {
      // console.log(data)
       switch(data.cmd){
          case "show-recording":
            GetMessage(data.data)
            break;

          case "show-race-control":
            ShowRaceControl(data.data)
            break;

          case "show-car-data":
            console.log("SHOWING CAR REAL TIME DATA ", data.data)

            ShowCarData(data.data)
            break;

       }

      
    })

    return () => {
      port.disconnect();
    }

  }, [])
  

  return (
    <>

{/* 
      {console.log("page is ", page)} */}
    

      <div style={{display: page === 'main' ? "block" : "none"}}>
      <MainPage
        SetPage={SetPage}
        driverObj={driverObj}
        raceControlObj={raceControlObj} 
        StartFetchCarData={StartFetchCarData}/>


      <CarLiveInfo 
        carData={carData}/>


      </div>
      
      
     

      <div style={{display: page === 'venue' ? "block" : "none"}}>
        <VenuePage 
          SetPage={SetPage}/>

      </div>
        
      
     

    </>
  )
}

export default App
