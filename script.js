
const dateEl = document.getElementById('date');
const timeEl = document.getElementById('time');
const currentWeatherItemsEl = document.getElementById('current-weather-item');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const API_key = '1f22a1938affde73334f5ee72ee6498a';


const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const zone = time.getTimezoneOffset();
    const utc = time.getUTCDate();
    const hour = time.getHours();
    const hourIn12HrFormat = hour > 12 ? hour %12: hour;
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'
    
    timeEl.innerHTML = (hourIn12HrFormat < 10? '0' +hourIn12HrFormat : hourIn12HrFormat ) + ':' +(minutes < 10? '0' +minutes: minutes)+'' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day]+ ', '+date+' ' +months[month] 


}, 1000);

// Delhi Coords
getweatherData(28.6667, 77.2167)
navigator.geolocation.getCurrentPosition((success) => {
    console.log(success);
    let {latitude, longitude} = success.coords;
    getweatherData(latitude, longitude)
})
function getweatherData (latitude, longitude) {
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_key}`).then(res => res.json()).then(data => {
            
            showWeatherData(data);
        })

    }
    


function showWeatherData(data){
    let {temp, humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    let {icon, description} = data.current.weather[0];
    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+ 'E'
    
    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div class ="temp1">
            <div>Temerature</div>
            <div>${temp} °C</div>
        </div>
    </div>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="" class="icon">
    <div class="Description">
        
        <div>${description}</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} km/hr</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm')}</div>
    </div>`; 

    
    

    let otherDayForecast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src=" https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>
            `
        }else{
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src=" https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
                <div class="temp">Humidity ${day.humidity}%</div>
            </div> 
            `;
        }
    })

    weatherForecastEl.innerHTML = otherDayForecast;
 

}

function getCity(city) {
            fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&exclude=hourly,minutely&units=metric&appid=" +API_key)
            .then((response) => response.json())
            .then(data =>{
                let{lat, lon} = data.coord;
                getweatherData(lat, lon)
                
            }); 
                 
        }

        function search() {
            this.getCity(document.querySelector(".search-bar").value);
        }



document.querySelector(".search-bar").addEventListener("keyup", function(event){
    if (event.key == "Enter" ){
        search();
    }
})

document.querySelector(".search button").addEventListener("click", function(){
    search();
})

