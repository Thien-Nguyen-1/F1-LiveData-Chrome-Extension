import { useState, useEffect , useRef} from 'react'
import { GetDriverDetail, GetDriverLiveData, GetDriverPosition, GetDriverInterval } from '../services/data-api'
import * as StringParser from '../services/string-parser.js'
import DriverCarBox from './DriverCarBox.jsx'

const DriverLiveInfo = () => {

    
    const [driverNum, setDriver] = useState(null)
    const[error, setError] = useState(null)
    const usrInput = useRef("")
    const driverObj = useRef({})
    const opponentObj = useRef({})
    
    const [interval, setInterval] = useState(-Infinity )
    const previousInterval = useRef(-Infinity)


    const UpdateDriver = (e) => {
        e.preventDefault()

        //check valid user input
        const num = Number(usrInput.current.value);

        if(!Number.isNaN(num)){
            setError(null)

            const temp = async () => {

                const response = await GetDriverLiveData(num);
                const response_2 = await GetDriverDetail(num);

                if(response_2 !== undefined){
                    driverObj.current = response_2;

                    //get the opponent details:
                    const positionObj = await GetDriverPosition({driver_number: response_2.driver_number})

                    if(positionObj.position > 1) {
                        const nextPos = positionObj.position -1;

                        const oppPositionObj = await GetDriverPosition({position: nextPos})

                        if(oppPositionObj !== 'invalid-driver-position'){

                            const oppObj = await GetDriverDetail(oppPositionObj.driver_number);
                            console.log("OPPONENT IS ", oppObj)
                            if(oppObj !== undefined){
                                console.log("RENDERING OPPONENT")
                                opponentObj.current = oppObj;
                            }

                        }

                    }

                } else {
                    driverObj.current = {};
                    opponentObj.current = {};
                }

            
                console.log("DRIVER DATA ", response_2);
                

            }

            temp()
            setDriver(num)
            
        } else {
            setError("Please enter a valid driver number")
        }

    }


    useEffect(() => {

        console.log("RERENDERING DRIVER LIVE INFO")

        if(driverNum){
            //fetch the interval

            const handleInterval = async() => {
                const intervalObj = await GetDriverInterval(driverNum);

                if(intervalObj !==  "invalid-driver-number"){

                    const intervalVal = intervalObj.interval;

                    if(previousInterval.current != intervalVal){
                        previousInterval.current = interval;
                        setInterval(intervalVal);

                    }

                }   
                
            }

            handleInterval()

        }

        
    })

   



    return (
        <>
            <h1 style={{fontFamily: 'F1FontBold'  ,fontSize:'1.5rem'}}> Driver Data Live Feed </h1>
            <p style={{fontFamily: 'F1FontNormal'  ,fontSize:'1rem'}}> (only available during races) </p>

            <form onSubmit={UpdateDriver}>
                <div class="grid gap-6 mb-6 md:grid-cols-2">
                    <div>

                        {error && (
                            <p> {error} </p>
                        )}

                        <input type="text" id="driver_number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                         placeholder="Enter driver number" required 
                         ref={usrInput}/>
                    </div>

                </div>

            </form>

            
            <div>
                 <DriverCarBox driverObj={driverObj.current}/> 
               
                {/* {opponentObj.driver_number && ( 
                    <> */}
                     <h3 style={{fontFamily: 'F1FontBold'  ,fontSize:'1rem'}} > VS </h3>
                    <DriverCarBox driverObj={opponentObj.current} />
                    {/* </>
                )} */}
            </div>

            <div>
            <h3
        style={{
            fontFamily: 'F1FontBold',
            fontSize: '1rem',
            color: interval <= previousInterval.current ? 'green' : 'red'
        }}
    >
            {`Interval +${interval}`} s
        </h3>


            </div>
            

        </>

    )



}

export default DriverLiveInfo