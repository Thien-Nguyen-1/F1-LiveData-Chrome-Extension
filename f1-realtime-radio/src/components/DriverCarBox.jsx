
import * as StringParser from '../services/string-parser.js'
const car_url = `https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/`

const DriverCarBox = (props) => {

    if(!props)return(<></>)


    const driverObj = props.driverObj;

    return (
        <div>
            <p  style={{fontFamily: 'F1FontNormal'  ,fontSize:'1rem'}}> {driverObj.full_name} </p>
            <img src={`${car_url}${StringParser.ReformatTeamName(driverObj.team_name)}.png`} />
        </div>
    )



}
export default DriverCarBox