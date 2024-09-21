

# Weather App

This Weather App fetches and displays weather information for the user's current location (via geolocation) or based on a manually entered city name. The app uses the OpenWeather API to retrieve weather data.

## Features

- **Your Weather Tab**: Displays weather information for the user's current location using the browser's geolocation API.
- **Search Weather Tab**: Allows users to search for weather by entering a city name.
- **Session Storage**: Saves the user's location data in session storage to avoid re-requesting geolocation access after the initial grant.
- **Weather Details**: Shows weather details such as temperature, humidity, wind speed, cloudiness, and weather description with icons and country flags.
- **Error Handling**: Provides user-friendly error messages for issues like failed API requests, location access denial, or invalid city names.
- **Loading Screen**: A loading indicator is displayed while fetching data.

## Technologies Used

- **HTML**: Structure of the app
- **CSS**: Basic styling and layout
- **JavaScript**: Core logic of the app
  - **DOM Manipulation**: Dynamically updating the UI based on API responses.
  - **Geolocation API**: Retrieves user's location.
  - **Fetch API**: Retrieves weather data from OpenWeather API.
  - **Session Storage**: Stores user location data temporarily.
  
## How It Works

1. **Your Weather**:
   - When the user opens the app, the "Your Weather" tab is the default active tab.
   - The app checks for stored coordinates in the session storage. If found, it fetches weather information for those coordinates.
   - If no coordinates are found, the app prompts the user to grant access to their location via the browser's geolocation API.
   - Once location access is granted, the weather information for the user's location is fetched and displayed.

2. **Search Weather**:
   - Users can switch to the "Search Weather" tab and enter a city name to retrieve weather information for the specified city.
   - The app fetches and displays the weather information for the entered city.
   - If the city name is invalid or an error occurs, an error message is shown.

## Setup

To use this app, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. Open the `index.html` file in a browser to run the app.

3. To use the app with your own API key, sign up at [OpenWeather](https://openweathermap.org/) and replace the `API_KEY` in the JavaScript file with your personal API key:
   ```js
   const API_KEY = "your-openweather-api-key";
   ```

## API Reference

This app uses the **OpenWeather API** to fetch weather information. Here’s a basic overview of the endpoints:

- **Weather by Coordinates**:
  ```bash
  https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric
  ```

- **Weather by City Name**:
  ```bash
  https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric
  ```

## Error Handling

- If the user's location cannot be determined, an error message will be shown, and the user will be prompted to grant location access.
- If a city search returns no valid results (e.g., city not found), an appropriate error message will be displayed.
- Any network issues or API errors are handled by showing a user-friendly error message.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This **README** file provides a clear overview of your project, instructions on setting it up, and details about how it works. Let me know if you’d like to adjust any part of it!
