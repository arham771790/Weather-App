// Selecting all necessary DOM elements
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfo = document.querySelector(".user-info-container");

const notFound=document.querySelector('.error-container');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');


let currentTab = userTab; // Set default tab to "Your Weather" tab
const API_KEY = "3212d1e96d8d5aa45586bf319aa914c9"; // OpenWeather API key
currentTab.classList.add("current-tab"); // Highlight the default tab

// Add event listeners for switching between tabs
userTab.addEventListener("click", () => {
  switchTab(userTab); // Switch to "Your Weather" tab
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab); // Switch to "Search Weather" tab
});

// Check if user location data is stored in session storage and display weather info accordingly
getfromSessionStorage();

/**
 * Switch between "Your Weather" and "Search Weather" tabs
 * @param {HTMLElement} clickedTab - The tab that was clicked
 */
function switchTab(clickedTab) {
  if (clickedTab !== currentTab) {
    // Remove highlight from the current tab and apply it to the clicked tab
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    // Show or hide search form or location-based weather data based on the active tab
    if (!searchForm.classList.contains("active")) {
      userInfo.classList.remove("active"); // Hide weather info
      grantAccessContainer.classList.remove("active"); // Hide grant location container
      searchForm.classList.add("active"); // Show search form
    } else {
      // If switching to "Your Weather", hide the search form and display location-based weather data
      searchForm.classList.remove("active");
      userInfo.classList.remove("active"); // Hide any previous search results
      getfromSessionStorage(); // Fetch weather data using location if available
    }
  }
}

/**
 * Check if coordinates are already saved in session storage.
 * If found, fetch the weather info for the saved coordinates.
 * If not found, show the location access request container.
 */
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");

  if (!localCoordinates) {
    // If no coordinates are found, ask the user to grant location access
    grantAccessContainer.classList.add("active");
  } else {
    // If coordinates are found, fetch and display the weather data
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

/**
 * Fetch the weather information using user's latitude and longitude.
 * @param {Object} coordinates - The user's latitude and longitude.
 */
async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;

  // Hide the location access container and show the loading screen
  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  try {
    // Make an API request to get weather data for the user's coordinates
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    // Hide the loading screen and display the fetched weather information
    loadingScreen.classList.remove("active");
    userInfo.classList.add("active");
    renderWeatherInfo(data); // Display the weather data
  } catch (err) {
    loadingScreen.classList.remove('active');
    userInfo.classList.remove('active');
    notFound.classList.add('active');
    errorImage.style.display = 'none';
    errorText.innerText = `Error: ${err?.message}`;
    errorBtn.style.display = 'block';
    errorBtn.addEventListener("click", fetchUserWeatherInfo);
}
}

/**
 * Display the weather information on the page.
 * @param {Object} data - The weather data from the API.
 */
function renderWeatherInfo(data) {
  // Select elements where weather data will be displayed
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudyness = document.querySelector("[data-Cloudyness]");

  // Populate the UI with the fetched weather data
  cityName.innerText = data?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`; // Fetch the country flag
  desc.innerText = data?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`; // Fetch the weather icon
  temp.innerText = `${data?.main?.temp}°C`;
  windspeed.innerText = `${data?.wind?.speed} m/s`;
  humidity.innerText = `${data?.main?.humidity}%`;
  cloudyness.innerText = `${data?.clouds?.all}%`;
}

// Handle location access when the user grants permission
const grantBtn = document.querySelector("[data-grantAccess]");
grantBtn.addEventListener("click", getLocation);

/**
 * Request the user's geolocation using the browser's geolocation API.
 */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition); // Fetch user's coordinates if geolocation is supported
  } else {
    alert('No geolocation support available'); // Show error if geolocation is not supported
  }
}

/**
 * Save user's coordinates in session storage and fetch weather information for that location.
 * @param {Object} position - The position object returned from the geolocation API.
 */
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates)); // Save the coordinates in session storage
  fetchUserWeatherInfo(userCoordinates); // Fetch weather data for the user's location
}

// Handle weather search functionality
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission and page reload
  let cityName = searchInput.value.trim(); // Get and sanitize the user's input

  if (cityName === "") return; // Do nothing if input is empty
  fetchSearchWeatherInfo(cityName); // Fetch weather info for the input city
});

/**
 * Fetch weather information for the city entered by the user.
 * @param {string} city - The name of the city to search for.
 */
async function fetchSearchWeatherInfo(city) {
  userInfo.classList.remove("active"); // Hide any previous weather data
  grantAccessContainer.classList.remove("active"); // Hide location access container if visible
  notFound.classList.remove("active");
  loadingScreen.classList.add("active"); // Show loading screen while fetching data
  
  
  try {
    // Make an API request to get weather data for the searched city
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    if (!data.sys) {
      throw data;
  }
    // Hide the loading screen and display the fetched weather information
    loadingScreen.classList.remove("active");
    userInfo.classList.add("active");
    renderWeatherInfo(data); // Display the weather data
  } catch (err) {
    loadingScreen.classList.remove('active');
    userInfo.classList.remove('active');
    notFound.classList.add('active');
    errorText.innerText = `${err?.message}`;
    errorBtn.style.display = "none";
}
}
