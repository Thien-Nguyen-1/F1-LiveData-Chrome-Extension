
import { useState, useEffect , useRef, useMemo} from 'react'
import { GetVenueDetails, GetWeatherDetails } from '../services/data-api'
import * as StringParser from '../services/string-parser.js'


import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";

const VenuePage = (props) => {

    const [venueDetails, setVenue] = useState(null)
    const [weatherDetails, setWeather] = useState(null)

    const backgroundBaseURL = "https://media.formula1.com/content/dam/fom-website/races/2025/race-listing/";
    const mapBaseURL = "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/"

    useEffect( () => {

    //    console.log("RE-RENDERING VENUE")
        
        const fetchData = async() => {
            const venueDetails_ = await GetVenueDetails();
            const weatherDetails_ = await GetWeatherDetails();

            // console.log("ERROR IS ", venueDetails)
            if(venueDetails_ === "invalid-venue-detail" || weatherDetails_ === "invalid-weather-detail"){
                return;
            }

            setVenue( (prev) => {
                if(JSON.stringify(prev) !== JSON.stringify(venueDetails_)){
                    // console.log("Updating value");
                    // console.log(venueDetails_)
                    return venueDetails_;
                }

                return prev;
            });


            setWeather( (prev) => {
                if(JSON.stringify(prev) !== JSON.stringify(weatherDetails_)) {
                    return weatherDetails_
                }
                return prev;
            })


        }

        fetchData()
    }

    )

    useEffect( ()=> {
        console.log("Component MOUNTED")



        return () => {
            console.log("Component UNMOUNTED")
        }
    }, [])
        


        return (
            <>
           <button onClick={() => props.SetPage('main')}>Click Test</button>
            
            { venueDetails && weatherDetails &&( <>
           <div
            style={{
                 backgroundImage: `url(${backgroundBaseURL + venueDetails.country_name.replaceAll(" ", "_")}.png)`,
              
                backgroundSize: "cover",
                backgroundPosition: "bottom right",
                backgroundRepeat: "no-repeat",
            }}
            className='venue-background-cover mb-10'
            >
            <h1 style={{ color: "white" }}> {venueDetails.country_name}</h1>
            <h3 style={{ color: "white" }}> {venueDetails.session_name}</h3>
            </div>

            <h1> Live Weather </h1>

            <div className='venu-weather-container mt-5 '>
                {/* tabler icons */}
                <div className='venu-weather-detail'>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-temperature"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 0 0 -4 0v8.5" /><path d="M10 9l4 0" /></svg>

                    <h3> {weatherDetails.air_temperature} °C</h3>

                </div>

                <div className='venu-weather-detail'>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-wind"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 8h8.5a2.5 2.5 0 1 0 -2.34 -3.24" /><path d="M3 12h15.5a2.5 2.5 0 1 1 -2.34 3.24" /><path d="M4 16h5.5a2.5 2.5 0 1 1 -2.34 3.24" /></svg>

                    <h3> {weatherDetails.wind_speed} m/s</h3>

                </div>


                <div className='venu-weather-detail'>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-down-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7l10 10" /><path d="M17 8l0 9l-9 0" /></svg>

                    <h3> {weatherDetails.wind_direction} °</h3>

                </div>

   


                <p className='mt-10'> (track temperature, wind speed and wind direction respectively)</p>

            </div>


            <div className='venu-map-container'>

                <h1 style={{ color: "white" }}> Track Layout </h1>

                <img src={`${mapBaseURL}${venueDetails.country_name}`}></img>

            </div>

            </>)}




            </>
        )


}

export default VenuePage