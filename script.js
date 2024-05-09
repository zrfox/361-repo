
document.addEventListener("DOMContentLoaded", function(){
const formInput = document.querySelector(".form");
const cityInput = document.querySelector(".city");
const inputContainer = document.querySelector(".inputContainer");
const weatherParent = document.querySelector(".weatherParent");
const apiKey = "42f3594fee81c9422641e286d4a222e7";




formInput.addEventListener("submit", async event => {

    event.preventDefault();
    const cityName = cityInput.value;

    if(cityName){
        try{
            const weatherData = await getWeather(cityName);

            displayWeather(weatherData);
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
    
    const {name: city, main: {temp}, wind: {speed}}= data;

    //inputContainer.display = "none";
    weatherParent.textContent = "";
    weatherParent.style.display = "flex";
    //weatherParent.

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