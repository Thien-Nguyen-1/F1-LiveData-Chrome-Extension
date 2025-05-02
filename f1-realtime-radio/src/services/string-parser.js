//custom string parser 


//https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/mercedes.png

//red-bull-racing
//williams.png
//racing-bulls.png
//kick-sauber.png
//aston-martin
//haas => driver data shows Haas F1 team => driver.data.includes(name) workaround


// DRIVER ABBREVIATIONS //
const driverCodeObj = {
    "ALB": "alex albon",
    "VER": "fraud stappen",
    "ALO": "alonso",
    "ANT": "ant toe nelly",
    "BEA": "oliver bearman",
    "BOR": "gabriel bortoleto",
    "DOO": "jack Doohan",
    "GAS": "pierre gasly",
    "HAD": "isack had a jar of pickles",
    "HAM": "lulu hamilton",
    "HUL": "nico hulken burger",
    "LAW": "liam slowson",
    "LEC": "charles le clair",
    "NOR": "lando porridge",
    "OCO": "esteban ocon",
    "PIA": "oscar pastry",
    "RUS": "george hussle and bustle",
    "SAI": "carlos sigh",
    "STR": "lance stroll",
    "TSU": "yuki poor noda",

}




//TRACK DETAILS 

const trackObj = {

    baseImg: "https://media.formula1.com/content/dam/fom-website/races/2025/race-listing/",



    "United States": {
        circuit_name: {
            "Austin": "United_States", //paste img url
            "Las Vegas": "United_States",
        }
    }

    



}





 // EMOJIS //
const emojiObj = {




    flag: {
        "GREEN" : '🟩',
        "RED": '🟥',
        "CHEQUERED": '🏁',
        "YELLOW": '🟨',
        "DOUBLE YELLOW": '🟨🟨',
        "CLEAR": '🏳️',
    },




}

const dictFormulaStr = {

    flag : {
        setEmoji: (rcObj) => {return emojiObj['flag'][rcObj.flag] || ''}
            
    },

    driverName: {
        replaceAll: (arr) => {return (arr.map( (phrase) => driverCodeObj[phrase] || phrase )).join("")}
    },

    teamName: {
        //e.g. Red Bull Racing => red-bull-racing
        replaceSpaceWithDash: (strName) => {return strName.replaceAll(" ", "-")}
    },

    all: {
        replaceSpaceWithDash: (strName) => {return strName.replaceAll(" ", "-")},
        replaceSpaceWithUnderscore: (strName) => {return strName.replaceAll(" ", "_")}
    }
    
}


// method only for adding emojis to a race control object
export const AddEmoji = (rcObj) => {

    if(!rcObj.hasOwnProperty('category')) {
        return ""
    }

    const category = rcObj.category.toLowerCase();


    if(Object.keys(dictFormulaStr).includes(category)){

        // console.log(`emoji message is ${dictFormulaStr[category].setEmoji(rcObj)}` )

        return `${dictFormulaStr[category].setEmoji(rcObj)}`
    } else {
        return "";
    }
  
}







export const ConvertDriverNames = (phrase) => {


    const pattern = /\(([\w-]+)\)/  //get all the characters enclosed inside brackets
    const re = new RegExp(pattern)

    const tempAr = phrase.split(pattern)
    const finalPhrase = dictFormulaStr.driverName.replaceAll(tempAr)

    console.log(finalPhrase)

    return finalPhrase


}

export const ReformatTeamName = (team) => {

    if(team){
        return dictFormulaStr.teamName.replaceSpaceWithDash(team)
    }
    
}


// GENERIC FUNCTIONS

export const ReformatString = (cmd, str) => {
    if(cmd){
        return dictFormulaStr.all[cmd](str);
    }
}