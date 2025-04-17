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

function App() {
  
  const isPlaying = useRef(false)
  const [driverObj, setDriver] = useState({})
  const [raceControlObj, setRC] = useState({})

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
    setRC(data)
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
    

    port.onMessage.addListener((data)=> {
      // console.log(data)
       switch(data.cmd){
          case "show-recording":
            GetMessage(data.data)
            break;

          case "show-race-control":
            ShowRaceControl(data.data)
            break;



       }


      
    })

    return () => {
      port.disconnect();
    }

  }, [])
  

  return (
    <>
     
      <div>
          <DriverMessage driverObj={driverObj}/>
      </div>

      <RaceControlContainer raceControlObj={raceControlObj} />

      <DriverLiveInfo />
    </>
  )
}

export default App
