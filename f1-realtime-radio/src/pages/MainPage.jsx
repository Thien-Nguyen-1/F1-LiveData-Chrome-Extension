import DriverMessage from "../components/DriverMessage"
import RaceControlContainer from "../components/RaceControl"
import DriverLiveInfo from "../components/DriverLiveInfo"

const MainPage = (props) => {
    if(!props){return <></>}

    const StartFetchCarData = (driverNum) => {
        console.log("FIRING CAR NUMBER")
        props.StartFetchCarData(driverNum)
    }

    return (
        <div className="main-page-container">  

            <button onClick={() => props.SetPage('venue')}> Click Test </button>
            <DriverMessage driverObj={props.driverObj}/>
            <RaceControlContainer raceControlObj={props.raceControlObj} />
            <DriverLiveInfo 
                StartFetchCarData={StartFetchCarData}/>

        </div>

    )


}
export default MainPage