document.addEventListener('DOMContentLoaded', () => {
    // Open-Meteo API는 무료이며 API 키가 필요하지 않습니다.
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-weather-btn');
    const currentLocationBtn = document.getElementById('current-location-btn');
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('forecast');

    const ICONS = {
        clear: 'assets/images/weather/clear.svg',
        partly: 'assets/images/weather/partly.svg',
        cloudy: 'assets/images/weather/cloudy.svg',
        rain: 'assets/images/weather/rain.svg',
        snow: 'assets/images/weather/snow.svg',
        storm: 'assets/images/weather/storm.svg',
        fog: 'assets/images/weather/fog.svg'
    };

    const weatherDescriptionMap = {
        0: '맑음',
        1: '대체로 맑음',
        2: '부분적으로 흐림',
        3: '흐림',
        45: '안개',
        48: '서리 낀 안개',
        51: '약한 이슬비',
        53: '중간 이슬비',
        55: '강한 이슬비',
        56: '약한 얼어붙는 이슬비',
        57: '강한 얼어붙는 이슬비',
        61: '약한 비',
        63: '중간 비',
        65: '강한 비',
        66: '약한 얼음비',
        67: '강한 얼음비',
        71: '약한 눈',
        73: '중간 눈',
        75: '강한 눈',
        77: '눈송이',
        80: '가벼운 소나기',
        81: '중간 소나기',
        82: '강한 소나기',
        85: '가벼운 눈 소나기',
        86: '강한 눈 소나기',
        95: '뇌우',
        96: '약한 우박을 동반한 뇌우',
        99: '강한 우박을 동반한 뇌우'
    };

    async function getWeatherByCity(city) {
        const trimmed = city.trim();
        if (!trimmed) {
            alert('도시 이름을 입력해주세요.');
            return;
        }

        currentWeatherDiv.innerHTML = '<p>날씨 정보를 불러오는 중...</p>';
        forecastDiv.innerHTML = '';

        try {
            const geoResult = await fetchGeocode(trimmed);
            if (!geoResult) {
                throw new Error('도시 정보를 찾을 수 없습니다.');
            }

            const label = geoResult.country ? `${geoResult.name}, ${geoResult.country}` : geoResult.name;
            await fetchWeatherForecast(geoResult.latitude, geoResult.longitude, label);
        } catch (error) {
            handleError(error.message);
        }
    }

    function getWeatherByCurrentLocation() {
        if (!('geolocation' in navigator)) {
            handleError('이 브라우저에서는 위치 정보 기능을 지원하지 않습니다.');
            return;
        }

        currentWeatherDiv.innerHTML = '<p>현재 위치를 확인하는 중...</p>';
        forecastDiv.innerHTML = '';

        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords;
            let label = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

            try {
                const reverseResult = await fetchReverseGeocode(latitude, longitude);
                if (reverseResult) {
                    label = reverseResult.country ? `${reverseResult.name}, ${reverseResult.country}` : reverseResult.name;
                }
            } catch (error) {
                console.error('Reverse geocoding 실패:', error);
            }

            await fetchWeatherForecast(latitude, longitude, label);
        }, () => handleError('위치 정보를 가져올 수 없습니다. 브라우저 설정을 확인해주세요.'));
    }

    async function fetchGeocode(query) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('도시 정보를 찾을 수 없습니다.');
        }
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            return null;
        }
        const result = data.results[0];
        return {
            latitude: result.latitude,
            longitude: result.longitude,
            name: result.name,
            country: result.country || ''
        };
    }

    async function fetchReverseGeocode(latitude, longitude) {
        const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`;
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            return null;
        }
        const result = data.results[0];
        return {
            name: result.name,
            country: result.country || ''
        };
    }

    async function fetchWeatherForecast(latitude, longitude, locationLabel) {
        try {
            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('날씨 정보를 가져올 수 없습니다.');
            }
            const data = await response.json();
            displayCurrentWeather(data, locationLabel);
            displayForecast(data);
        } catch (error) {
            handleError(error.message);
        }
    }

    function displayCurrentWeather(data, locationLabel) {
        if (!data.current_weather) {
            handleError('현재 날씨 정보를 찾을 수 없습니다.');
            return;
        }

        const { current_weather, timezone_abbreviation } = data;
        const details = getWeatherDetails(current_weather.weathercode);
        const localTime = current_weather.time ? `${current_weather.time.replace('T', ' ')} ${timezone_abbreviation || ''}`.trim() : '';

        currentWeatherDiv.innerHTML = `
            <div class="location-details">
                <h2>${locationLabel}</h2>
                <p>${localTime}</p>
            </div>
            <div class="weather-details">
                <img src="${details.icon}" alt="${details.description}" class="weather-icon-large">
                <p class="temperature">${current_weather.temperature}°C</p>
                <p class="condition">${details.description}</p>
            </div>
        `;
    }

    function displayForecast(data) {
        if (!data.daily || !data.daily.time) {
            forecastDiv.innerHTML = '<p class="error-message">예보 정보를 찾을 수 없습니다.</p>';
            return;
        }

        const { time, weathercode, temperature_2m_max, temperature_2m_min } = data.daily;
        let forecastHTML = '<h3>주간 예보</h3><div class="forecast-cards-container">';

        for (let i = 0; i < time.length; i += 1) {
            const details = getWeatherDetails(weathercode[i]);
            forecastHTML += `
                <div class="forecast-card">
                    <p class="forecast-date">${time[i]}</p>
                    <img src="${details.icon}" alt="${details.description}" class="weather-icon-small">
                    <p class="forecast-temp">
                        <span class="temp-max">${temperature_2m_max[i]}°</span> /
                        <span class="temp-min">${temperature_2m_min[i]}°</span>
                    </p>
                </div>
            `;
        }

        forecastHTML += '</div>';
        forecastDiv.innerHTML = forecastHTML;
    }

    function getWeatherDetails(code) {
        const icon = getIconForCode(code);
        const description = weatherDescriptionMap[code] || (code >= 95 ? '뇌우' : (code >= 80 ? '소나기' : (code >= 71 ? '눈' : (code >= 51 ? '비' : '변화무쌍한 날씨'))));
        return { icon, description };
    }

    function getIconForCode(code) {
        if (code === 0) {
            return ICONS.clear;
        }
        if (code === 1 || code === 2) {
            return ICONS.partly;
        }
        if (code === 3) {
            return ICONS.cloudy;
        }
        if (code === 45 || code === 48) {
            return ICONS.fog;
        }
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
            return ICONS.rain;
        }
        if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
            return ICONS.snow;
        }
        if (code >= 95) {
            return ICONS.storm;
        }
        return ICONS.cloudy;
    }

    function handleError(message) {
        currentWeatherDiv.innerHTML = `<p class="error-message">${message}</p>`;
        forecastDiv.innerHTML = '';
    }

    searchBtn.addEventListener('click', () => getWeatherByCity(cityInput.value));
    cityInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            getWeatherByCity(cityInput.value);
        }
    });
    currentLocationBtn.addEventListener('click', getWeatherByCurrentLocation);
});
