const api = {
  key: API_KEY,
  base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', function (evt) {
  if (evt.key === "Enter") {
    getResults(searchbox.value);
  }
});

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        showError("City not found. Please try again.");
        return;
      }
      displayResults(data);
    })
    .catch(() => showError("Something went wrong while fetching weather."));

  fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== "200") {
        return;
      }
      displayForecast(data);
    })
    .catch(() => { });
}

function showError(message) {
  document.getElementById('placeholder').style.display = 'block';
  document.getElementById('weather-section').style.display = 'none';
  document.getElementById('weather-section-2').style.display = 'none';
  document.getElementById('forecast-section').style.display = 'none';

  const placeholder = document.getElementById('placeholder');
  placeholder.querySelector('.placeholder-text').innerText = message;
}


function displayResults(weather) {
  document.getElementById('placeholder').style.display = 'none';
  document.getElementById('weather-section').style.display = 'block';
  document.getElementById('weather-section-2').style.display = 'block';
  document.getElementById('forecast-section').style.display = 'block';

  document.querySelector('.location .city').innerText = `${weather.name}, ${weather.sys.country}`;
  document.querySelector('.location .date').innerText = dateBuilder(new Date());
  document.querySelector('.current .temp').innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
  document.querySelector('.current .weather').innerText = weather.weather[0].main;
  document.querySelector('.hi-low').innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

  document.querySelector('.humidity').innerText = `Humidity: ${weather.main.humidity}%`;
  document.querySelector('.wind').innerText = `Wind Speed: ${weather.wind.speed} m/s`;

  const iconCode = weather.weather[0].icon;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}


function displayForecast(forecast) {
  const container = document.querySelector('.forecast-container');
  container.innerHTML = "";

  const filtered = forecast.list.filter(item => item.dt_txt.includes("12:00:00"));
  filtered.forEach(item => {
    const day = new Date(item.dt_txt).toDateString().split(' ').slice(0, 3).join(' ');
    const temp = Math.round(item.main.temp);
    const weather = item.weather[0].main;

    const div = document.createElement('div');
    div.className = 'forecast-day';
    div.innerHTML = `
      <p>${day}</p>
      <p>${temp}°C</p>
      <p>${weather}</p>
    `;
    container.appendChild(div);
  });
}

function dateBuilder(d) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
