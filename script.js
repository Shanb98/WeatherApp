const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='1e5996669319635c1bf3b6e0544995ae';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]

}, 1000);

function searchByCity() {
    var city = document.getElementById('input').value;
    getCoordinates(city);
}

function getCoordinates(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeatherData(lat, lon,city);
                
            } else {
                // Handle the case where no coordinates are found for the city.
                console.error('No coordinates found for the city:', city);
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}
      

function getWeatherData(latitude, longitude , city) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            console.log('Weather Data:', data); 
            showWeatherData(data,city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function showWeatherData(data , city) {
    let {uvi, temp,humidity, pressure, dew_point, visibility, wind_speed , feels_like} = data.current;
    var x = data.timezone;
    var parts = x.split('/');
    var continent = parts[0]; // "Asia"
    var Mcity = parts[1];     // "Colombo"
    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N' + data.lon+'E'
    currentWeatherItemsEl.innerHTML =
        ` 
                       
        <div class="city"><h2 id="city">${city}, ${Mcity}, ${continent}</h2></div>
        <div class="imgweather"><img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="" id="img"></div>
        <div class="temperature"><p id="temperature">${temp} °C</p></div>                   
        <div class="details">
            <span id="clouds">${data.current.weather[0].description}</span></div> 
        <div class="feel">Feels like ${feels_like} °C</div>  
        <div class="details">
            
        </div> 
        <div class="AirQuality">
            <div class="AQ">UV Index</div>
            <div class="Number">${uvi}</div>
        </div>
        <div class="Wind">
            <div class="W">Wind</div>
            <div class="Number">${wind_speed} m/s</div>
        </div>
        <div class="Humidity">
            <div class="H">Humidity</div>
            <div class="Number">${humidity} %</div>
        </div>
        <div class="Visibility">
            <div class="V">Visibility</div>
            <div class="Number">${visibility / 1000} km</div>
        </div>
        <div class="Pressure">
            <div class="P">Pressure</div>
            <div class="Number">${pressure} hPa</div>
        </div>
        <div class="DewPoint">
            <div class="DP">Dew Point</div>
            <div class="Number">${dew_point}°</div>
        </div>
    `;
    

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })
    weatherForecastEl.innerHTML = otherDayForcast;
}
