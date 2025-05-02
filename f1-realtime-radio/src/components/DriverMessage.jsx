

const DriverMessage = (props) => {

    if(!props){return (<></>);}
    const driverObj = props.driverObj;

    const full_name =  driverObj.full_name;  
    const headshot_url = driverObj.headshot_url;
    const driver_number= driverObj.driver_number;
    const team_name= driverObj.team_name;
    const team_colour= driverObj.team_colour;
    const transcript = driverObj.transcript;


    return(

        <div className="mt-6">
        <h1 style={{fontFamily: 'F1FontBold'  ,fontSize:'1.5rem'}} className="mb-6"> Team Radio Messages </h1>
        
        <div style={{backgroundColor: '#212120'}}className="flex flex-col items-start space-y-2 p-4  shadow-md border border-black-900">
            <div className="flex items-center space-x-4">
                <img src={headshot_url} alt="N/A" className="w-16 h-16 rounded-full object-cover" />
                <h3 style={{fontFamily: 'F1FontBold'}}className="text-lg font-semibold  text-white">{full_name}</h3>
                
            </div>
        <p style={{fontFamily: 'F1FontNormal'}} className="text-sm  text-white">{team_name}</p>
        <i style={{fontFamily: 'F1FontNormal'}}className=" animate-typing text-sm  text-white"> "{transcript}" </i>
        </div>

        </div>



    )


}

export default DriverMessage