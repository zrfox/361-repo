
document.addEventListener("DOMContentLoaded", function(){
const formInput = document.querySelector(".form");
const cityInput = document.querySelector(".city");
const inputContainer = document.querySelector(".inputContainer");
const weatherParent = document.querySelector(".weatherParent");
const apiKey = "42f3594fee81c9422641e286d4a222e7";

let socket1Open = 0;
//let icon;
//let speed;
//var imgElement;
let imgExists = 0;

const socket1 = new WebSocket('ws://localhost:5555');
socket1.binaryType = 'blob';

socket1.onopen = function(event){
    socket1Open = 1;
}

socket1.onmessage = function(event) {
    console.log("Sock1 Data: ", event.data);

    // read blob and call function on load 
    var reader = new FileReader();
    reader.onload = function(event) {
        var svgContent = event.target.result;

        // make new blob for svgContent blob with correct MIME type. 
        var newBlob = new Blob([svgContent], { type: 'image/svg+xml' });

        // create blob url
        var urlSock1 = URL.createObjectURL(newBlob); //change from newBlob to event.data

        // img element created to display svg
        if(imgExists == 0)
            imgElement = document.createElement('img'); // moved code into here and this was a const value assigned just outside of if statement. Right now it's a globabl var. 
        
        imgExists = 1;
        imgElement.src = urlSock1;
        imgElement.width = 600;  
        imgElement.height = 600;  
    
        // append img element to svg-container id div in html
        document.getElementById('svg-container').appendChild(imgElement);

        // revoke url
        imgElement.onload = () => {
            URL.revokeObjectURL(urlSock1);
        };
    };
    reader.readAsText(event.data);
};

socket1.onerror = function(error) {
    console.error("WebSocket Error:", error);
};

jsonPlaceholder = {
    "sun": 0,
    "rain": 0,
    "snow": 0,
    "clouds": 0,
    "wind": 0
}


let iconNumInt = 0;


formInput.addEventListener("submit", async event => {

    event.preventDefault();
    const cityName = cityInput.value;

    if(cityName){
        try{
            const weatherData = await getWeather(cityName);


            displayWeather(weatherData);

            parseWeatherIcon();
            if(socket1Open){
                socket1.send(JSON.stringify(jsonPlaceholder));

            }
        }
        catch(err){
            console.log(err);
            errorAlert("Input is invalid.");
        }
    }
    else{
        alert = "Please enter a city.";
        errorAlert(alert);
    }
});

async function getWeather(cityInput){
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`;

    const apiData = await fetch(URL);

    if(!apiData.ok)
    {
        throw new Error("Unable to fetch data.")
    }
    
    return await apiData.json(); 
}

function displayWeather(data){
    
    const {name: city, weather, main: {temp}, wind: {speed}}= data;

    //inputContainer.display = "none";
    weatherParent.textContent = "";
    weatherParent.style.display = "flex";
    //weatherParent.
    const [{ icon }] = weather;
    console.log(icon); //this will be used for getting weather icons. 

    setIconSpeed(icon, speed);

    const weatherID = document.createElement("p");
    const tempHeader = document.createElement("p");
    const cityHeader = document.createElement("p");
    const windHeader = document.createElement("p");

    tempHeader.textContent = `${((temp - 273.15)*9/5+32).toFixed(1)}F`;
    cityHeader.textContent = city;
    windHeader.textContent = `Wind Speed: ${((speed) * 2.23694).toFixed(1)}MP/H`;



    weatherParent.appendChild(tempHeader);
    weatherParent.appendChild(cityHeader);
    weatherParent.appendChild(windHeader);
};

function errorAlert(alert){

    const errMessage = document.createElement("p");

    weatherParent.textContent = alert;
    weatherParent.style.display = "flex";
    weatherParent.appendChild(errMessage);
};
});

function parseWeatherIcon(){

    resetJSON();

    iconNumStr = icon.substring(0,2);
    iconNumInt = parseInt(iconNumStr);
    console.log(iconNumInt);

    iconSun = icon.slice(-1);
    console.log(iconSun);

    jsonPlaceholder.sun = iconSun == "d" ? 1 : 0;
    console.log(jsonPlaceholder.sun);

    if(speed > 21){

    }

    switch(iconNumInt){
        case 1:
        jsonPlaceholder.clouds = 0;
        break;

        case 2:
        jsonPlaceholder.clouds = 1;
        break;

        case 3:
        jsonPlaceholder.clouds = 2;
        break;

        case 4:
        jsonPlaceholder.clouds = 3;
        break;

        case 9:
        jsonPlaceholder.clouds = 3;
        jsonPlaceholder.rain = 1;
        break;

        case 10: 
        jsonPlaceholder.clouds = 3;
        jsonPlaceholder.rain = 2;
        break;    
    
        case 11:
        jsonPlaceholder.clouds = 3;
        jsonPlaceholder.rain = 4;
        break;

        case 13:
            jsonPlaceholder.clouds = 3;
            jsonPlaceholder.snow = 2;
            break;
        
        case 50:
            jsonPlaceholder.clouds = 3;
            break;
    }
}

function resetJSON(){
    for(let key in jsonPlaceholder){
        jsonPlaceholder[key] = 0;
    }
}

function setIconSpeed(iconVal, speedVal){
    icon = iconVal;
    speed = speedVal;
}