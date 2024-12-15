const apiKey = 'a930ffdec61aced3a1f6847f35c0a26b';
const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');
const leftInfo = document.querySelector('.left-info'); // Seleciona a secção de fundo

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// Mapping of weather condition codes to icon class names
const weatherIconMap = {
    '01d': 'sun', // Clear sky (day)
    '01n': 'moon', // Clear sky (night)
    '02d': 'cloud', // Few clouds (day)
    '02n': 'cloud', // Few clouds (night)
    '03d': 'cloud', // Scattered clouds
    '03n': 'cloud',
    '04d': 'cloud', // Broken clouds
    '04n': 'cloud',
    '09d': 'cloud-rain', // Shower rain
    '09n': 'cloud-rain',
    '10d': 'cloud-drizzle', // Rain (day)
    '10n': 'cloud-drizzle', // Rain (night)
    '11d': 'cloud-lightning', // Thunderstorm
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow', // Snow
    '13n': 'cloud-snow',
    '50d': 'cloud-fog', // Mist
    '50n': 'cloud-fog',
};

// Mapping of weather condition codes to background images
const weatherBackgroundMap = {
    '01d': 'sunny.png',
    '01n': 'moon.png',
    '02d': 'partly-cloudy.png',
    '02n': 'partly-cloudy-night.png',
    '03d': 'cloudy.png',
    '03n': 'cloudy.png',
    '04d': 'overcast.png',
    '04n': 'overcast.png',
    '09d': 'rainy.png',
    '09n': 'rainy.png',
    '10d': 'rainy.png',
    '10n': 'rainy.png',
    '11d': 'stormy.png',
    '11n': 'stormy.png',
    '13d': 'snowy.png',
    '13n': 'snowy.png',
    '50d': 'foggy.png',
    '50n': 'foggy.png',
};

function fetchWeatherData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&lang=pt`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            // Update today's info
            const todayWeather = data.list[0].weather[0].description;
            const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
            const todayWeatherIconCode = data.list[0].weather[0].icon;

            todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('pt', {
                weekday: 'long',
            });
            todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('pt', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
            todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
            todayTemp.textContent = todayTemperature;

            // Update location and weather description in the "left-info" section
            const locationElement = document.querySelector('.today-info > div > span');
            locationElement.textContent = `${data.city.name}, ${data.city.country}`;

            const weatherDescriptionElement = document.querySelector('.today-weather > h3');
            weatherDescriptionElement.textContent = todayWeather;

            // Change the background of "left-info" based on weather condition
            const backgroundImage = weatherBackgroundMap[todayWeatherIconCode];
            if (backgroundImage) {
                leftInfo.style.backgroundImage = `url('./images/${backgroundImage}')`;
                leftInfo.style.backgroundSize = 'cover';
                leftInfo.style.backgroundPosition = 'center';
            }

            // Update today's info in the "day-info" section
            const todayPrecipitation = `${Math.round(data.list[0].pop * 100)}%`;
            const todayHumidity = `${data.list[0].main.humidity}%`;
            const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

            const dayInfoContainer = document.querySelector('.day-info');
            dayInfoContainer.innerHTML = `
                <div>
                    <span class="title">PRECIPITAÇÃO</span>
                    <span class="value">${todayPrecipitation}</span><br>
                </div>
                <div>
                    <span class="title">HUMIDADE</span>
                    <span class="value">${todayHumidity}</span><br>
                </div>
                <div>
                    <span class="title">VELOCIDADE VENTO</span>
                    <span class="value">${todayWindSpeed}</span><br>
                </div>
            `;

            // Update next 4 days weather
            const today = new Date();
            const nextDaysData = data.list.slice(1);

            const uniqueDays = new Set();
            let count = 0;
            daysList.innerHTML = '';
            for (const dayData of nextDaysData) {
                const forecastDate = new Date(dayData.dt_txt);
                const dayAbbreviation = forecastDate.toLocaleDateString('pt', { weekday: 'short' });
                const dayTemp = `${Math.round(dayData.main.temp)}°C`;
                const iconCode = dayData.weather[0].icon;

                if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
                    uniqueDays.add(dayAbbreviation);
                    daysList.innerHTML += `
                        <li>
                            <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                            <span>${dayAbbreviation}</span>
                            <span class="day-temp">${dayTemp}</span>
                        </li>
                    `;
                    count++;
                }

                if (count === 4) break;
            }
        })
        .catch((error) => {
            alert(`ERRO!: ${error} (Api Error)`);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Portugal';
    fetchWeatherData(defaultLocation);
});

locButton.addEventListener('click', () => {
    const location = prompt('Procurar uma cidade:');
    if (!location) return;

    fetchWeatherData(location);
});
