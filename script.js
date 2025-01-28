    let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    locationBtn = document.getElementById('locationBtn'),
    api_key = '681b45cb415365cab9ca972bd397c291',
    currentWeatherCard = document.querySelectorAll('.weer-linker .kaart')[0],
    fiveDaysForecastContainer = document.querySelector('.dag-voorspelling'),
    aqiCard = document.querySelectorAll('.highlights .kaart')[0],
    sunriseCard = document.querySelectorAll('.highlights .kaart')[1],
    neerslagkans = document.getElementById('neerslagkans'),
    luchtdruk = document.getElementById('luchtdruk'),
    zicht = document.getElementById('zicht'),
    snelheid = document.getElementById('snelheid'),
    windsnelheid = document.getElementById('windsnelheid'),

    aqiList = ['Goed', 'Prima', 'Oke', 'Slecht', 'Heel slecht'];

function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,

        days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],
        months = ['Jan', 'Feb', 'Mar', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

        fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
            let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
            aqiCard.innerHTML = 
            `  <div class="kaart-hoofd">
                <p>Luchtkwaliteit</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x"></i>
                <div class="item">
                    <p>PM2.5</p>
                    <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                    <p>PM10</p>
                    <h2>${pm10}</h2>
                </div>
                <div class="item">
                    <p>SO2</p>
                    <h2>${so2}</h2>
                </div>
                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>
                <div class="item">
                    <p>NO</p>
                    <h2>${no}</h2>
                </div>
                <div class="item">
                    <p>NO2</p>
                    <h2>${no2}</h2>
                </div>
                <div class="item">
                    <p>NH3</p>
                    <h2>${nh3}</h2>
                </div>
                <div class="item">
                    <p>O3</p>
                    <h2>${o3}</h2>
            </div>
        </div>
    </div>`
        }).catch(() => {
            alert('kan weer niet laten zien')
        })

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            let date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="nu-weer">
                    <div class="details">
                        <p>Nu</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weer-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weer icoon">
                    </div>
                </div>
                <hr>
                <div class="kaart-footer">
                    <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
                </div>`;
                let {sunrise, sunset} = data.sys,
                 {timezone , visibility} = data,
                 {humidity, pressure, feels_like} = data.main,
                 {speed} = data.wind,
                sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
                sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A')
                sunriseCard.innerHTML = `
                  <div class="kaart-hoofd">
                           <p>Zondsopgang en Zondsondergang</p>
                    </div>
                    <div class="zondsopgang-ondergang">
                        <div class="item">
                            <div class="icon">
                                <i class="fa-light fa-sunrise fa-4x"></i>
                            </div>
                            <div>
                                <p>Zondsopgang</p>
                                <h2>${sRiseTime}</h2>
                            </div>
                        </div>
                        <div class="item">
                            <div class="icon">
                                <i class="fa-light fa-sunset fa-4x"></i>
                            </div>
                            <div>
                                <p>Zondsondergang</p>
                                <h2>${sSetTime}</h2>
                            </div>
                        </div>
                    </div>
                        `;
                    neerslagkans.innerHTML = `${neerslagkans}%`;
                    luchtdruk.innerHTML = `${luchtdruk}hPa`;
                    zicht.innerHTML = `${zicht / 1000}km`;
                    snelheid.innerHTML = `${snelheid}m/s`;
                    windsnelheid.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        })
        .catch(() => {
           //alert('Gefaald om het huidige weer weer te geven');
        });

    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            console.log(data.list);
            let uniqueForecastDays = [];
            let fiveDaysForecast = data.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            fiveDaysForecastContainer.innerHTML = ''; // Container legen
            for (let i = 1; i < fiveDaysForecast.length; i++) {
                let date = new Date(fiveDaysForecast[i].dt_txt);
                fiveDaysForecastContainer.innerHTML += `
                    <div class="dag-voorspelling">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}@2x.png" alt="Weer icoon">
                            <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>`;
            }
        })
        .catch(() => {
            alert('Gefaald om de vijfdaagse voorspelling te laden');
        });
}

function getCityCoordinates() {
    let cityname = cityInput.value.trim();
    cityInput.value = '';
    if (!cityname) return;
    let GEOCODING_API_URL_ = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL_)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                alert(`Geen resultaten gevonden voor ${cityname}`);
                return;
            }
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(() => {
            alert(`Gefaald om de locatiegegevens van ${cityname} te laden`);
        });
}

function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
    let {latitude, longitude} = position.coords;
    let REVERSE_GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/reverse?lat={latitude}&lon=${longitude}&limit=1&appid={api_key}';
    fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
        let{name, country, state} = data[0];
        getWeatherDetails(name, latitude, longitude, country, state);
    }).catch(() => {
        alert('niet gelukt')
    });
}, error => {
    if(error.code === error.PERMISSION_DENIED){
        alert('toegankelijkheid geweigerd')
    }
});
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinatesetUse);