// =============================================
// CONFIGURATION
// Get a free API key at: https://openweathermap.org/api
// Replace the empty string below with your key.
// =============================================
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMsg = document.getElementById('error-message');
const weatherCard = document.getElementById('weather-card');
const forecastEl = document.getElementById('forecast');
const forecastCards = document.getElementById('forecastCards');
const recentList = document.getElementById('recentList');

let recentSearches = JSON.parse(localStorage.getItem('weatherRecent') || '[]');

// Event listeners
searchBtn.addEventListener('click', () => search());
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') search();
});

function search() {
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeather(city);
}

async function fetchWeather(city) {
  hideError();
  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`),
      fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`)
    ]);

    if (!weatherRes.ok) {
      const err = await weatherRes.json();
      showError(err.message === 'city not found' ? `City "${city}" not found. Please try again.` : err.message);
      return;
    }

    const weather = await weatherRes.json();
    const forecast = await forecastRes.json();

    displayWeather(weather);
    displayForecast(forecast);
    addRecentSearch(city);
  } catch (err) {
    showError('Could not fetch weather data. Check your API key or internet connection.');
  }
}

function displayWeather(data) {
  document.getElementById('cityName').textContent = data.name;
  document.getElementById('countryName').textContent = data.sys.country;
  document.getElementById('dateTime').textContent = formatDate(new Date());
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°F`;
  document.getElementById('weatherIcon').src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById('weatherIcon').alt = data.weather[0].description;
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°F`;
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed)} mph`;
  document.getElementById('visibility').textContent =
    data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : 'N/A';
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

  weatherCard.classList.remove('hidden');
}

function displayForecast(data) {
  // Get one reading per day (noon) for the next 5 days
  const days = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!days[date] || item.dt_txt.includes('12:00:00')) {
      days[date] = item;
    }
  });

  const entries = Object.values(days).slice(0, 5);
  forecastCards.innerHTML = '';

  entries.forEach(item => {
    const date = new Date(item.dt * 1000);
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <div class="day">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}" />
      <div class="temp-high">${Math.round(item.main.temp_max)}°</div>
      <div class="temp-low">${Math.round(item.main.temp_min)}°</div>
    `;
    forecastCards.appendChild(card);
  });

  forecastEl.classList.remove('hidden');
}

function addRecentSearch(city) {
  const normalized = city.trim();
  recentSearches = [normalized, ...recentSearches.filter(c => c.toLowerCase() !== normalized.toLowerCase())].slice(0, 6);
  localStorage.setItem('weatherRecent', JSON.stringify(recentSearches));
  renderRecentSearches();
}

function renderRecentSearches() {
  recentList.innerHTML = '';
  recentSearches.forEach(city => {
    const chip = document.createElement('button');
    chip.className = 'recent-chip';
    chip.textContent = city;
    chip.addEventListener('click', () => {
      cityInput.value = city;
      fetchWeather(city);
    });
    recentList.appendChild(chip);
  });
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
  weatherCard.classList.add('hidden');
  forecastEl.classList.add('hidden');
}

function hideError() {
  errorMsg.classList.add('hidden');
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// Init
renderRecentSearches();

// Load last searched city on startup
if (recentSearches.length > 0) {
  fetchWeather(recentSearches[0]);
}
