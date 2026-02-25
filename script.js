// script.js - Complete weather application logic

// ============================================
// CONFIGURATION
// ============================================

// Your API key from OpenWeatherMap
// 🔑 REPLACE THIS WITH YOUR ACTUAL API KEY
const API_KEY = '213b2dc540f3a38650df0e66ed14d8f5'; 

// Base URL for OpenWeatherMap API
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Units: metric = Celsius, imperial = Fahrenheit
const UNITS = 'metric';

// ============================================
// DOM ELEMENTS - Get references to HTML elements
// ============================================

const citySelect = document.getElementById('city-select');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResult = document.getElementById('weather-result');
const loading = document.getElementById('loading');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const tempValue = document.getElementById('temp-value');
const weatherDesc = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// ============================================
// EVENT LISTENERS - What happens when user interacts
// ============================================

// When user selects a city from dropdown
citySelect.addEventListener('change', function() {
    const selectedCity = citySelect.value;
    if (selectedCity) {
        fetchWeatherByCity(selectedCity);
    }
});

// When user clicks search button for custom city
searchBtn.addEventListener('click', function() {
    const customCity = cityInput.value.trim();
    if (customCity) {
        fetchWeatherByCity(customCity);
    } else {
        showError('Please enter a city name');
    }
});

// Allow pressing Enter in input field
cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const customCity = cityInput.value.trim();
        if (customCity) {
            fetchWeatherByCity(customCity);
        } else {
            showError('Please enter a city name');
        }
    }
});

// ============================================
// MAIN FUNCTION: Fetch weather data from API
// ============================================

/**
 * Fetches weather data for a given city
 * @param {string} city - Name of the city to get weather for
 * 
 * This is an ASYNC function because it uses await
 * The 'async' keyword tells JavaScript this function contains asynchronous operations
 */
async function fetchWeatherByCity(city) {
    
    // Show loading indicator, hide previous results and errors
    showLoading();
    
    try {
        // ============================================
        // STEP 1: Build the API URL
        // ============================================
        // Template literal with backticks allows us to embed variables directly
        // Example: if city = "Nairobi", API_KEY = "abc123", units = "metric"
        // Result: https://api.openweathermap.org/data/2.5/weather?q=Nairobi&appid=abc123&units=metric
        // ============================================
        
        const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=${UNITS}`;
        
        console.log('Fetching weather from:', url); // Helpful for debugging
        
        // ============================================
        // STEP 2: Make the API request with fetch()
        // ============================================
        // fetch() returns a Promise - it doesn't have the data immediately
        // 'await' pauses this function until fetch() completes
        // This is NON-BLOCKING - other code can run while we wait
        // ============================================
        
        const response = await fetch(url);
        
        // ============================================
        // STEP 3: Check if request was successful
        // ============================================
        // response.ok is true for status codes 200-299
        // If city not found, API returns 404 (not ok)
        // ============================================
        
        if (!response.ok) {
            // Throw an error that will be caught by our catch block
            throw new Error(`City not found: ${city}`);
        }
        
        // ============================================
        // STEP 4: Parse the JSON response
        // ============================================
        // response.json() also returns a Promise
        // 'await' again - wait for parsing to complete
        // ============================================
        
        const data = await response.json();
        
        // For learning: log the data to see its structure
        console.log('Weather data received:', data);
        
        // ============================================
        // STEP 5: Extract and display weather data
        // ============================================
        // The data object has this structure:
        // data.name: city name
        // data.weather[0].description: "clear sky", "light rain", etc.
        // data.weather[0].icon: icon code (like "10d")
        // data.main.temp: temperature
        // data.main.humidity: humidity percentage
        // data.wind.speed: wind speed
        // ============================================
        
        displayWeatherData(data);
        
    } catch (error) {
        // ============================================
        // ERROR HANDLING
        // ============================================
        // This block runs if ANY error occurs in the try block
        // Network errors, city not found, JSON parsing errors, etc.
        // ============================================
        
        console.error('Error fetching weather:', error);
        showError(error.message);
    }
}

// ============================================
// HELPER FUNCTION: Display weather data on page
// ============================================

/**
 * Updates the UI with weather data
 * @param {Object} data - Weather data from API
 */
function displayWeatherData(data) {
    
    // Hide loading indicator
    hideLoading();
    
    // Show weather result container
    weatherResult.style.display = 'block';
    weatherInfo.style.display = 'block';
    errorMessage.style.display = 'none';
    
    // ============================================
    // Update text content for each element
    // ============================================
    
    // City name (API returns city name in data.name)
    cityName.textContent = data.name;
    
    // Temperature (rounded to 1 decimal place)
    tempValue.textContent = data.main.temp.toFixed(1);
    
    // Weather description (capitalize first letter)
    const description = data.weather[0].description;
    weatherDesc.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    
    // Humidity
    humidity.textContent = `${data.main.humidity}%`;
    
    // Wind speed
    windSpeed.textContent = `${data.wind.speed} m/s`;
    
    // ============================================
    // Weather icon
    // ============================================
    // OpenWeatherMap provides icons at specific URLs
    // Icon code comes from data.weather[0].icon
    // Example: "10d" for rain during day
    // ============================================
    
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = description;
    
    // ============================================
    // Dynamic background based on temperature
    // ============================================
    // Remove existing temperature classes
    weatherResult.classList.remove('hot', 'cold', 'moderate');
    
    // Add appropriate class based on temperature
    const temp = data.main.temp;
    if (temp >= 25) {
        weatherResult.classList.add('hot'); // Hot weather (≥25°C)
    } else if (temp <= 15) {
        weatherResult.classList.add('cold'); // Cold weather (≤15°C)
    } else {
        weatherResult.classList.add('moderate'); // Moderate weather (16-24°C)
    }
}

// ============================================
// HELPER FUNCTIONS: UI State Management
// ============================================

/**
 * Shows loading indicator, hides weather info and errors
 */
function showLoading() {
    weatherResult.style.display = 'block';
    loading.style.display = 'block';
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'none';
}

/**
 * Hides loading indicator
 */
function hideLoading() {
    loading.style.display = 'none';
}

/**
 * Shows error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    weatherResult.style.display = 'block';
    loading.style.display = 'none';
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'block';
    errorMessage.textContent = `❌ Error: ${message}`;
}

// ============================================
// OPTIONAL: Load default city on page load
// ============================================

// Uncomment the line below if you want Nairobi weather to load automatically
// window.addEventListener('load', () => fetchWeatherByCity('Nairobi'));

// ============================================
// UNDERSTANDING ASYNC/AWAIT
// ============================================

/*
WHAT WE LEARNED:

1. ASYNC FUNCTIONS:
   - Functions marked with 'async' always return a Promise
   - They allow using 'await' inside them
   
2. AWAIT KEYWORD:
   - Pauses execution until the Promise resolves
   - Can only be used inside async functions
   - Makes async code look like synchronous code
   
3. TRY/CATCH:
   - try block: code that might fail
   - catch block: handles any errors from try block
   - Prevents crashes and allows graceful error messages
   
4. FETCH API:
   - fetch(url) - makes HTTP request, returns Promise
   - response.ok - checks if request succeeded
   - response.json() - parses JSON response, returns Promise
   
5. PROMISES (behind the scenes):
   - fetch() returns a Promise
   - await waits for Promise to resolve
   - If Promise rejects, error goes to catch block
*/
