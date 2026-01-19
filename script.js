
document.addEventListener("DOMContentLoaded", function(){
const formInput = document.querySelector(".form");
const cityInput = document.querySelector(".city");
const inputContainer = document.querySelector(".inputContainer");
const weatherParent = document.querySelector(".weatherParent");
const apiKey = "42f3594fee81c9422641e286d4a222e7";

let socket1Open = 0;
let socket2Open = 0;
let socket3Open = 0;
let socket4Open = 0;

let socket2Elements = 0;
let feelsHeader ;
let max_Header ;
let min_Header ;
let changeUnitsButton ;
let city = "";
let tempHeader;
let f_temp;
let c_temp;

let socket3Exists = 0;
let socket4Exists = 0;
    
//let icon;
//let speed;
var imgElement; // uncommented. idk why it was commented out. 
let imgExists = 0;

// weather icons ms
const socket1 = new WebSocket('ws://localhost:5555');
socket1.binaryType = 'blob';

socket1.onopen = function(event){
    socket1Open = 1;
}

// Convert units ms
const socket2 = new WebSocket('ws://localhost:8000');
socket2.onopen = function(){
    socket2Open = 1;
}

// theme changer ms
const socket3 = new WebSocket('ws://localhost:7000');
socket3.onopen = function(){
    socket3Open = 1;
}

const socket4 = new WebSocket('ws://localhost:6005');
socket4.onopen = function(){
    socket4Open = 1;
}

socket4.onmessage = function(event){
    console.log("socket4 data: ", event.data);

    data = JSON.parse(event.data);
    document.body.style.fontFamily = data.fontFamily;

}

function changeFontFunct(){
    socket4.send("send");
}

socket3.onmessage = function(event){
    console.log("socket3 data: ", event.data);





    data = JSON.parse(event.data);
    //jsonTheme.themeURL = data.themeURL; //jasonTheme.theme = data? data.theme? No, just a json object that holds theme as well. 

    /*if(socket3Element == 0)
    {
     socket3Element = 1; 
        
     changeThemeButton = document.createElement("button");
    }*/
    document.body.style.backgroundImage = "url('"+ data.themeURL +"')"; //"url('"+ jsonTheme.themeURL +"')";

    if(socket3Exists == 0)
    {

        document.getElementsByClassName('inputContainer')[0].appendChild(changeThemeButton);
    }



    changeThemeButton.addEventListener("click", changeThemeFunct);



}

function changeThemeFunct(){
    if(socket3Open)
         socket3.send(JSON.stringify(jsonTheme));

    
}

socket1.onmessage = function(event) {
    console.log("socket1 data: ", event.data);

    var reader = new FileReader();
    reader.onload = function(event) {
        var svgContent = event.target.result;
        
        // DEBUG: Print the first 500 characters of the SVG
        console.log("Original SVG:", svgContent.substring(0, 500));
        
        // svgContent = svgContent.replace(
        //     /viewBox="[^"]*"/,
        //     'viewBox="300 300 300 300"'
        // );
        
        // DEBUG: Print after replacement
        console.log("After replacement:", svgContent.substring(0, 500));
        
        svgContent = svgContent.replace(/\s*width="[^"]*"/g, '');
        svgContent = svgContent.replace(/\s*height="[^"]*"/g, '');
        
        const container = document.getElementById('svg-container');
        container.innerHTML = '';
        container.innerHTML = svgContent;
        
        const svg = container.querySelector('svg');
        if (svg) {
            svg.style.width = '350px';
            svg.style.height = '270px';
            svg.style.display = 'block';
            // padding recenters
            svg.style.paddingLeft = '75px';
        }
        
        imgExists = 1;
    };
    reader.readAsText(event.data);
};
// Convert units ms
socket2.onmessage = function(event){
    console.log("socket2 data: ", event.data)
    data = JSON.parse(event.data);
    jsonTemp = data;

    if(socket2Elements == 0)
    {
     socket2Elements = 1; 
        
     feelsHeader = document.createElement("p");
     max_Header = document.createElement("p");
     min_Header = document.createElement("p");
     changeUnitsButton = document.createElement("button");
    }

    feelsHeader.textContent = `Feels like: ${(jsonTemp.feels_like)}`;
    max_Header.textContent = `High: ${(jsonTemp.temp_max)}`;
    min_Header.textContent = `Low: ${(jsonTemp.temp_min)}`;

    weatherParent.appendChild(feelsHeader);
    weatherParent.appendChild(max_Header);
    weatherParent.appendChild(min_Header);

    changeUnitsButton.textContent = `UoM`;

    document.getElementsByClassName('inputContainer')[0].appendChild(changeUnitsButton);

    changeUnitsButton.addEventListener("click", changeUnitsFunc);

}

function changeUnitsFunc(){
    
    if(jsonTemp.city != city)
    {
        city = jsonTemp.city;
    
         var convert_tempHeader = parseInt(tempHeader.textContent);
   

        f_temp = `${(convert_tempHeader)}F`;

    
   
        c_temp = `${Math.trunc((convert_tempHeader - 32)*5/9)}C`;

    }
    
    if(jsonTemp.unit == 1){
        tempHeader.textContent = f_temp;
        jsonTemp.unit = 0;

    }
    else{
        tempHeader.textContent = c_temp;
        jsonTemp.unit = 1;
    }
    
    if(socket2Open)
         socket2.send(JSON.stringify(jsonTemp));

    

}

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

jsonTemp = {
    "feels_like": 0,
    "temp_min": 0,
    "temp_max": 0,
    "unit": 0,
    "city": "none"
}

jsonTheme = {
    "theme": "nature",
    "themeURL": ""
}


//let iconNumInt = 0;


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
            document.getElementById('svg-container').removeChild(imgElement);
            document.getElementsByClassName('inputContainer')[0].removeChild(changeUnitsButton);
            document.getElementsByClassName('inputContainer')[0].removeChild(changeThemeButton);
            document.getElementsByClassName('inputContainer')[0].removeChild(change_font_button);
            socket3Exists = 0;
            socket4Exists = 0;
        }
    }
    else{
        alert = "Please enter a city.";
        errorAlert(alert);
        document.getElementById('svg-container').removeChild(imgElement);
        document.getElementsByClassName('inputContainer')[0].removeChild(changeUnitsButton);
        document.getElementsByClassName('inputContainer')[0].removeChild(changeThemeButton);
        document.getElementsByClassName('inputContainer')[0].removeChild(change_font_button);
        socket3Exists = 0;
        socket4Exists = 0;

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
    
    const {name: city, weather, main: {temp, feels_like, temp_min, temp_max}, wind: {speed}}= data;

    //inputContainer.display = "none";
    weatherParent.textContent = "";
    weatherParent.style.display = "flex";
    //weatherParent.
    const [{ icon }] = weather;
    console.log(icon); //this will be used for getting weather icons. 

    setIconSpeed(icon, speed);

    //const weatherID = document.createElement("p");
    tempHeader = document.createElement("p");
    const cityHeader = document.createElement("p");
    const windHeader = document.createElement("p");

  


    jsonTemp.feels_like = (parseInt(feels_like) - 273.15);
    jsonTemp.temp_min = (parseInt(temp_min) - 273.15);
    jsonTemp.temp_max =  (parseInt(temp_max) - 273.15);
    jsonTemp.city = city;

    if(socket2Open){
        socket2.send(JSON.stringify(jsonTemp));

    }



    tempHeader.textContent = `${Math.trunc((temp - 273.15)*9/5+32)}F`;
    cityHeader.textContent = city;
    windHeader.textContent = `Wind Speed: ${Math.trunc((speed) * 2.23694)}MP/H`;


    weatherParent.appendChild(tempHeader);
    weatherParent.appendChild(cityHeader);
    weatherParent.appendChild(windHeader);

    if(socket3Exists == 0)
    {

    socket3Exists = 1;
    changeThemeButton = document.createElement("button");
    document.getElementsByClassName('inputContainer')[0].appendChild(changeThemeButton);
    changeThemeButton.textContent = `Theme`;
    changeThemeButton.style.marginLeft = "5px";
    //changeThemeButton.style.marginRight = "px";


    }
    changeThemeButton.addEventListener("click", changeThemeFunct);

    if(socket4Exists == 0)
    {
        socket4Exists = 1;

        change_font_button = document.createElement("button");
        document.getElementsByClassName('inputContainer')[0].appendChild(change_font_button);
        change_font_button.textContent = `Font`;
        change_font_button.style.marginLeft = "5px";
        change_font_button.style.marginRight = "5px";

    }
    change_font_button.addEventListener("click", changeFontFunct);


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