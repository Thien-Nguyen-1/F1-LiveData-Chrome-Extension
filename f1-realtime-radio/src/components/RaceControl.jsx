
import {speak} from 'google-translate-api-x';
import { useState, useEffect , useRef} from 'react'
import * as StringParser from '../services/string-parser.js'

const RaceControlContainer = (props) => {

    if(!props){return (<></>)}

    const raceControlObj = props.raceControlObj;
    const lastMessage = useRef(null)


    const TestSpeaker = async () => {
        StringParser.ConvertDriverNames("")


        const base64Audio =  await speak( StringParser.ConvertDriverNames(raceControlObj.message), {to: 'en', forceTo: true}); // => Base64 encoded mp3

         //const base64Audio =  await speak( StringParser.ConvertDriverNames("track limits deleted for  (VER) and (HAM) on turn 18"), {to: 'en', forceTo: true}); // => Base64 encoded mp3
     
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.playbackRate = 1.2;
      
        audio.play(); 

    }

    useEffect( ()=> {
        if(raceControlObj.message !== lastMessage.current){
            lastMessage.current = raceControlObj.message;

            const run = async () => {
                await TestSpeaker()
            }
             run()
        }
    })
    
    


    return (
       <div className='race-control-container mt-20 mb-20'>
            <h1 style={{fontFamily: 'F1FontBold'  ,fontSize:'1.5rem'}}> Race Control Live Feed </h1>
            {lastMessage.current && raceControlObj &&
                ( <h2 style={{fontFamily: 'F1FontNormal', fontSize:'1rem'}}>  { StringParser.AddEmoji(raceControlObj) + " " + lastMessage.current} </h2>)
            }
           

       </div>
    )


}

export default RaceControlContainer