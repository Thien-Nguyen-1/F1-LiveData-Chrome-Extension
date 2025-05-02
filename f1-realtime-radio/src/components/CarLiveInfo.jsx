import { useState, useEffect , useRef} from 'react'
import { GetCarData } from '../services/data-api';
const CarLiveInfo = (props) => {

    if(!props){return(<></>)}

    // const driverNum = props.driverNumber;
    const [car, setCar] = useState({});
    const queueRef = useRef([]);
    
    const DELAY = 400; //in milliseconds

    const animationFrame = useRef(null);
    const lastTime = useRef(Date.now());
    


    const loop = () => {

        
        const timeNow = Date.now();
        const delta = timeNow - lastTime.current;

        if(delta > DELAY) {

            if(queueRef.current.length > 0) {
                const nextDataObj = queueRef.current.shift();
                
                console.log("CAR OBJECT IS ", nextDataObj)

                if(nextDataObj){
                    setCar(nextDataObj);
                }
            }

            lastTime.current = timeNow
        }
        animationFrame.current = requestAnimationFrame(loop)
    }



    useEffect( () => {
        
        
         animationFrame.current = requestAnimationFrame(loop)
        

        return () => {cancelAnimationFrame(animationFrame.current)}
    }, [])
    
    useEffect( () => {
        console.log("Car Data UPDATED")
       
        if (Array.isArray(props.carData)) {
            console.log("CAR DATA RECEIVED ", props.carData[0].driver_number)
            if(animationFrame.current){
                console.log("CANCELLING ANIMATION FRAME")
                cancelAnimationFrame(animationFrame.current)
            }

            queueRef.current = [...props.carData]
            animationFrame.current = requestAnimationFrame(loop)
          }
        

    }, [props.carData])


   return (
    <>
    <div className='venu-weather-container mt-5 '>
        <div className='venu-weather-detail'>
             <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-speedtest"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5.636 19.364a9 9 0 1 1 12.728 0" /><path d="M16 9l-4 4" /></svg>

             <h3>    {car.speed} km/h</h3>

        </div>

        <div className='venu-weather-detail'>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-engine"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 10v6" /><path d="M12 5v3" /><path d="M10 5h4" /><path d="M5 13h-2" /><path d="M6 10h2l2 -2h3.382a1 1 0 0 1 .894 .553l1.448 2.894a1 1 0 0 0 .894 .553h1.382v-2h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2v-2h-3v2a1 1 0 0 1 -1 1h-3.465a1 1 0 0 1 -.832 -.445l-1.703 -2.555h-2v-6z" /></svg>
            
             <h3>   {car.rpm} rpm</h3>

        </div>

        <div className='venu-weather-detail'>
            <h3> DRS </h3>

            <h3> {car.drs >= 10 ? "Enabled" : "Disabled"} </h3>

        </div>




    </div>
       
       
    </>
   )




}

export default CarLiveInfo