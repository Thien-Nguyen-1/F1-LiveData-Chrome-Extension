import React from 'react';
import axios from 'axios'
import { AssemblyAI } from 'assemblyai';



const radioInstance = axios.create({
    // baseURL: 'https://api.openf1.org/v1/',
     baseURL: import.meta.env.VITE_F1_API_BASE_URL,
})

const ttsClient = new AssemblyAI({
    apiKey: import.meta.env.VITE_ASSEMBLY_AI_API || ""
})


// console.log(radioInstance.baseURL)
export const GetDriverDetail = async (number) => {
    // console.log("Drive number is ", number)
    if(!number){return;}

    try {
        // Constructing the correct URL with params
        const response = await radioInstance.get('drivers', {
            params: {
                driver_number: number,
                session_key: 'latest', // Use 'latest' to fetch data for the current session
            }
        });
        // console.log("Fetched")
        if (response.data && response.data.length > 0) {
            // console.log(response.data);
            const driverObj = {
                full_name: response.data[0].full_name,  // Accessing data inside response.data
                headshot_url: response.data[0].headshot_url,
                driver_number: response.data[0].driver_number,
                team_name: response.data[0].team_name,
                team_colour: response.data[0].team_colour,
            }; 

            return driverObj;
        } else {
            return "invalid-driver";
        }

    } catch(error){
        return "invalid-driver";
    }
}

export const GetAllDriverDetails = async() => {
    try {
        const response = await radioInstance.get('drivers',{
            params: {
                session_key:'latest',
            }
        })

        return response.data
    }catch(error){
        return "invalid-driver";
    }

}


export const GetSpechToText = async (file_url) => {
    try {
        const data = {
            audio: file_url
        };

        const transcript = await ttsClient.transcripts.transcribe(data);
        return transcript.text;

    }catch {
        return "";
    }
}

export const GetDriverLiveData = async (num) => {
    try {

        const response = await radioInstance.get(
            'laps',
            {params: {
                driver_number: num,
                session_key: 'latest', // Use 'latest' to fetch data for the current session
            }}
        )

        return response.data


    } catch(error) {
        return "invalid-driver-number"
    }


}

export const GetDriverInterval = async(num) => {
    try {

        const response = await radioInstance.get(
            'intervals',
            {params: {
                driver_number: num,
                session_key: 'latest'

            }}

        )

        return response.data.slice(-1)[0]; //return only the latest interval
    }catch(error){
        return "invalid-driver-number"


    }

}

export const GetDriverPosition = async(objDetails = {}) => {
    //objDetails should consist of either: driver_number or position (assuming to be valid)
    const objSend = Object.assign({session_key: 'latest'}, objDetails);

   

    try {
        const response = await radioInstance.get(
            'position',
            {params: objSend}
        )
        
        console.log("OBJ DETAILS ARE ", objDetails)

        if(Object.keys(objDetails).length == 0){
            console.log("Returning all")
            return response.data
        }
        return response.data.slice(-1)[0]; //returns an object containing driver_number and position

    } catch(error){
        return "invalid-driver-position"
    }

}



export const GetVenueDetails = async(objDetails = {}) => {
    const objSend = Object.assign({session_key: 'latest'}, objDetails);

    try {  
        const response = await radioInstance.get(
            'sessions',
            {params: objSend}
        )

        return response.data[0];

    } catch(error){
        return "invalid-venue-detail"
    }

}

export const GetWeatherDetails = async(objDetails = {}) => {
    const objSend = Object.assign({session_key: 'latest'}, objDetails);

    try {
        const response = await radioInstance.get(
            'weather',
            {params: objSend}
        )

        return response.data.splice(-1)[0];

    } catch(error){
        return "invalid-weather-detail"
    }
}


export const GetCarData = async(objDetails = {}) => {
    const objSend = Object.assign({session_key: 'latest'}, objDetails);

    try {
        const response = await radioInstance.get(
            'car_data',
            {params: objSend}
        )

        return response.data.splice(-1)[0];
    } catch(error){
        return null
    }



}