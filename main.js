'use strict';

let userCity = document.querySelector('.form__input-city');
let	userCountry = document.querySelector('.form__input-country');
let	button = document.querySelector('.form__button');
let	errorMessage = document.querySelector('.error__container > p');
let map = document.querySelector('#map');
let weatherCity = document.querySelector('.weather__city');
let weatherCountry = document.querySelector('.weather__country');
let weatherTemperature = document.querySelector('.weather__temperature > p');
let weatherFeels = document.querySelector('.weather__feels > p');
let weatherWindSpeed = document.querySelector('.weather__wind-speed > p');
let weatherWindDir = document.querySelector('.weather__wind-direction > p');
let weatherPressure = document.querySelector('.weather__pressure > p');
let weatherTime = document.querySelector('.weather__time > p');
let	iconOfWeather;

locationiq.key = 'pk.cbad561504a1df430bf6fe7c1f4c0c9a';

button.addEventListener('click', (event) => {
	event.preventDefault();
	
	let userCityValue = userCity.value;
	let userCountryValue = userCountry.value;

	if (userCityValue && userCountryValue) {
		errorMessage.innerHTML = '';
		getWeather(userCityValue, userCountryValue);
	} else {
		errorMessage.innerHTML = 'Please fill in both fields for getting weather information.';
	}
    
})

function getWeather(city, country) {
	let dataObject = {};
	return fetch(`http://api.weatherstack.com/current?access_key=4e0e136f5b5896a2d130050ae0bcdef4&query=${city},${country}`)
        .then(responce => responce.json())
        .then(responce => {
            let {
                location: {name, country, localtime, lat, lon}, 
                current: {temperature, weather_icons, feelslike, pressure, wind_dir, wind_speed},
            } = responce;
            dataObject.city = name;
            dataObject.country = country;
            dataObject.temperature = temperature;
            dataObject.feelsLike = feelslike;
            dataObject.pressure = pressure;
            dataObject.latitude = lat;
            dataObject.longitude = lon;
            dataObject.weatherIcon = weather_icons;
            dataObject.windDir = wind_dir; 
            dataObject.windSpeed = wind_speed; 
            dataObject.localtime = localtime;
    
            showInfo(dataObject);
        })
}

function showInfo(obj) {
	if (iconOfWeather) {
		clearContent();
	} 

	showContent(obj);
}

function showContent(obj) {
	let localtime = new Date(obj.localtime).toLocaleTimeString().slice(0,-3);

    let weatherInfo = document.querySelector('.weather__info');
 
    console.log(obj.latitude, obj.longitude);
    weatherInfo.innerHTML = `
        <div class="wrap-left">
            <div class="weather__location">
                <h1 class="weather__city">${obj.city}&#160;</h1>
                <p class="weather__country">${obj.country}</p>
            </div>
            <div class="weather__icon">
                <img src="${obj.weatherIcon[0]}" alt="Weather">
            </div>
            <div class="weather__temperature">
                <p>${obj.temperature}°C</p>
            </div>
        </div> 
        
        <div class="wrap-right">
            <div class="weather__qual">
                <div class="weather__feels">
                    <p>Feels like: ${obj.feelsLike}°C</p>
                </div>
                <div class="weather__wind-speed">
                    <p>Wind speed: ${obj.windSpeed} km/h</p>
                </div>
                <div class="weather__wind-direction">
                    <p>Wind direction: ${obj.windDir}</p>
                </div>
                <div class="weather__pressure">
                    <p>Pressure: ${obj.pressure} MB</p>
                </div>
                <div class="weather__time">
                    <p>Time: ${localtime}</p>
                </div>
            </div>
        </div>
        <div id="map"></div>`
   
	// =========== map library 
	let map = new mapboxgl.Map({
		container: 'map',
		attributionControl: false, //need this to show a compact attribution icon (i) instead of the whole text
		zoom: 10,
		center: [obj.longitude, obj.latitude]
	});

	//Define layers you want to add to the layer controls; the first element will be the default layer
	let layerStyles = {
		"Streets": "streets/vector",
		"Satellite": "earth/raster",
		"Hybrid": "hybrid/vector",
		"Dark": "dark/vector",
		"Light": "light/vector"
	};

	map.addControl(new locationiqLayerControl({
		key: locationiq.key,
		layerStyles: layerStyles
	}), 'top-left');
}

function clearContent() {
	iconOfWeather.innerHTML = '';
	map.innerHTML = '';
	weatherIcon.innerHTML = '';
	weatherCity.innerHTML = '';
	weatherCountry.innerHTML = '';
	weatherTemperature.innerHTML = '';
	weatherFeels.innerHTML = '';
	weatherWindSpeed.innerHTML = '';
	weatherWindDir.innerHTML = '';
	weatherPressure.innerHTML = '';
	wea.innerHTML = '';
}

function addValidators(value) {
	value.addEventListener('input', (event) => {
		event.target.value = event.target.value.replace(/\d/, '');
	})
}

addValidators(userCity);
addValidators(userCountry);



