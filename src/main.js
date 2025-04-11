document.addEventListener('DOMContentLoaded', () => {
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-btn');
  const weatherInfo = document.getElementById('weather-info');
  

  const WEATHER_API_KEY =`${import.meta.env.VITE_WEATHER_API_KEY}`;
  const GEOCODER_API_KEY =`${import.meta.env.VITE_GEOCODER_API_KEY}`;

  const headers = {
      'X-Yandex-Weather-Key': WEATHER_API_KEY
  };

  
  searchBtn.addEventListener('click', getWeather);
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
  });

  async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    try {
      const geoResponse = await fetch(`https://geocode-maps.yandex.ru/v1/?apikey=${GEOCODER_API_KEY}&geocode=${city}&format=json`)
      const geoData = await geoResponse.json();
      
      const pos = geoData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
      const [lon, lat] = pos;
      console.log(`${lon} ${lat}`, lon, lat)

      const weatherResponse = await fetch(`https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}`, {headers});


      const weatherData = await weatherResponse.json();
      displayWeather(weatherData, city);
    } catch (error) {
      console.error('Ошибка получения данных:', error);
      alert('Ошибка получения данных. Проверьте название города.');
    }

  }

  function displayWeather(data, city) {
    weatherInfo.classList.remove('hidden');
    
    document.getElementById('city-name').textContent = city;
    document.getElementById('temp-now').textContent = data.fact.temp + '°C';
    document.getElementById('feels-like').textContent = data.fact.feels_like + '°C';
    document.getElementById('humidity').textContent = data.fact.humidity;
    document.getElementById('pressure').textContent = data.fact.pressure_mm;
    document.getElementById('wind-speed').textContent = data.fact.wind_speed;
    document.getElementById('wind-dir').textContent = getWindDirection(data.fact.wind_dir);

    const iconUrl = `https://yastatic.net/weather/i/icons/blueye/color/svg/${data.fact.icon}.svg`;
    document.getElementById('weather-icon').src = iconUrl;
  }

  function getWindDirection(dir) {
    const directions = {
      'nw': 'северо-западный',
      'n': 'северный',
      'ne': 'северо-восточный',
      'e': 'восточный',
      'se': 'юго-восточный',
      's': 'южный',
      'sw': 'юго-западный',
      'w': 'западный',
      'c': 'штиль'
    };
    return directions[dir] || dir;
  }
});