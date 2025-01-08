let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    api_key = '681b45cb415365cab9ca972bd397c291',
    currentWeatherCard = document.querySelectorAll('.weer-links .kaart')[0];

function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        days = [
            'Maandag',
            'Dinsdag',
            'Woensdag',
            'Donderdag',
            'Vrijdag',
            'Zaterdag',
            'Zondag'
        ],
        months = [
            'Jan',
            'Feb',
            'Mar',
            'Mei',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Dec'
        ];

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
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="kaart-footer">
                <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
            </div>`;
        })
        .catch(() => {
            alert('Gevaald voor de komende weer te laten zien');
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
            alert(`Gevaaldt om de weer te zien van ${cityname}`);
        });
}

searchBtn.addEventListener('click', getCityCoordinates);
