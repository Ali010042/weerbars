let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    api_key = '681b45cb415365cab9ca972bd397c291',
    currentWeatherCard = document.querySelectorAll('.weer-linker





        .kaart')[0],
    fiveDaysForecastContainer = document.querySelector('.dag-voorspelling');

function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],
        months = ['Jan', 'Feb', 'Mar', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];


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

searchBtn.addEventListener('click', getCityCoordinates);
