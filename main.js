'use strict'

let userCity = document.querySelector('.form__input-city'),
    userCountry = document.querySelector('.form__input-country'),
    button = document.querySelector('.form__button'),
    errorMessage = document.querySelector('.error__container > p'),
    longitude,
    latitude,
    iconOfWeather;

locationiq.key = 'pk.cbad561504a1df430bf6fe7c1f4c0c9a';

button.addEventListener('click', (event) => {
    event.preventDefault();

    let userCityValue = userCity.value;
    let userCountryValue = userCountry.value;

    if (userCityValue && userCountryValue) {
        errorMessage.innerHTML = '';
        getWeather(userCityValue, userCountryValue);
    } else {
        errorMessage.append('Please fill in both fields for getting weather information.');
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
    let arr = [];
    for (let item in obj) {
        arr.push(obj[item]);
    }

    let [city, country, temperature, feelsLike, pressure, lon, lat, weathterIcon, windDir, windSpeed, localtime] = arr;

    latitude = lat;
    longitude = lon;
    localtime = new Date(localtime).toLocaleTimeString().slice(0,-3);
    iconOfWeather = document.createElement('img');
    iconOfWeather.setAttribute('src', weathterIcon);
    iconOfWeather.setAttribute('alt', 'Weather');

    document.querySelector('.weather__icon').append(iconOfWeather);
    document.querySelector('.weather__city').innerHTML = city;
    document.querySelector('.weather__country').append(country);
    document.querySelector('.weather__temperature > p').append(`${temperature}°C`);
    document.querySelector('.weather__feels > p').append(`Feels like: ${feelsLike}°C`);
    document.querySelector('.weather__wind-speed > p').append(`Wind speed: ${windSpeed} km/h`);
    document.querySelector('.weather__wind-direction > p').append(`Wind direction: ${windDir}`);
    document.querySelector('.weather__pressure > p').append(`Pressure: ${pressure} MB`);
    document.querySelector('.weather__time > p').append(`Time: ${localtime}`);

    // =========== map library 
    let map = new mapboxgl.Map({
        container: 'map',
        attributionControl: false, //need this to show a compact attribution icon (i) instead of the whole text
        zoom: 5,
        center: [latitude, longitude]
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
    document.querySelector('#map').innerHTML = '';
    document.querySelector('.weather__icon').innerHTML = '';
    document.querySelector('.weather__city').innerHTML = '';
    document.querySelector('.weather__country').innerHTML = '';
    document.querySelector('.weather__temperature > p').innerHTML = '';
    document.querySelector('.weather__feels > p').innerHTML = '';
    document.querySelector('.weather__wind-speed > p').innerHTML = '';
    document.querySelector('.weather__wind-direction > p').innerHTML = '';
    document.querySelector('.weather__pressure > p').innerHTML = '';
    document.querySelector('.weather__time > p').innerHTML = '';
}

function addValidators(value) {
    value.addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/\d/, '');
    })
}

addValidators(userCity);
addValidators(userCountry);



