import { useState, useEffect , useRef} from 'react'
import { GetDriverDetail, GetDriverLiveData, GetDriverPosition, GetDriverInterval, GetAllDriverDetails } from '../services/data-api'
import * as StringParser from '../services/string-parser.js'
import DriverCarBox from './DriverCarBox.jsx'
import CarLiveInfo from './CarLiveInfo.jsx'


const DriverLiveInfo = (props) => {

    if(!props){return(<></>)}
    
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

            props.StartFetchCarData(num)

            setError(null)


            const GetData = async () => {
                const driverObj_ = await GetDriverDetail(num)
                driverObj.current = driverObj_
                setDriver(num)

            }

            GetData()
            
            
           
            // setDriver(num)
            
        } else {
            setError("Please enter a valid driver number")
        }

    }


    useEffect(() => {

        

        
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
            </div>

            

        </>

    )



}

export default DriverLiveInfo