# Weather Dashboard

**[Live Demo](https://weather-dashboard-ah.vercel.app)** &nbsp;|&nbsp; **[GitHub](https://github.com/ahenderson316/weather-dashboard)**

A real-time weather dashboard built with **vanilla JavaScript** that fetches live data from the OpenWeatherMap API.

## Features

- Live current weather conditions (temperature, humidity, wind, pressure, visibility)
- 5-day forecast
- Recent search history (saved to localStorage)
- Loads last searched city automatically on startup
- Clean, dark-themed responsive UI

## Tech Stack

- HTML5, CSS3, JavaScript (ES6+)
- [OpenWeatherMap API](https://openweathermap.org/api)

## Getting Started

### 1. Get a free API key

Sign up at [openweathermap.org](https://openweathermap.org/api) and get a free API key (takes ~2 minutes).

### 2. Add your API key

Open `app.js` and replace the placeholder at the top:

```js
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
```

### 3. Open the app

Open `index.html` directly in a browser — no server needed.

> **Note:** If you get a CORS error, serve the files with a simple local server:
> ```bash
> npx serve .
> ```

## Project Structure

```
weather-dashboard/
├── index.html
├── style.css
├── app.js
└── README.md
```

## License

MIT
