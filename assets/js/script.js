const cityInputEl = $("#city-input");
const historyEl = $("#history");
const cityNameEl = $("#city-name");
const weatherIconEl = $("#weather-icon");
const dateEl = $("#date");
const timeEl = $("#time");
const temperatureEl = $("#temperature");
const humidityEl = $("#humidity");
const windSpeedEl = $("#wind-speed");
const indexUVEl = $("#UV-index");
const futureForecast = $("#five-day-forecast-boxes");

// Links to the buttons 
const searchBtn = $("#search-button");
const clearBtn = $("#clear-history-button");

// unique API key for the OpenWeather API. Please don't use :)
const apiKey = "1291db61f641ff72ce7519899878bf5a";

// creating variables to store an interval counter and user's searched cities
let setDateTime = null;
let savedCities = JSON.parse(localStorage.getItem("city-search-history")) || [];

// will bring the weather information based on the user input
const mainCity = (event) => {

    // stops the form from refreshing the page
    event.preventDefault();

    // store the user's input in a variable, then use it for the queryURL
    const city = cityInputEl.val().trim();
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;

    // if no input, an alert pops up on the page, and function exits
    if (!city) {
        window.alert("Please enter the name of a city");
        return;
    }

    // requests Open Weather for weather information for the city the user inputted
    fetch(weatherURL)
        .then(function (response) {

            //if there's a 400s level status, page outputs an alert
            if (response.status >= 400 && response.status < 500) {
                window.alert("Could not find that city. Please try again!");
                return;
            }
            // extracts the JSON data from the response
            return response.json();
        })
        .then(function (data) {

            // calls renderWeather function which interprets the data and prints it to the page
            renderWeather(data);
            
            // extract and store the city and country from the response
            const city = data.name;
            const country = data.sys.country;

            // calls saveHistory which starts the process of saving the user's search
            saveHistory(city, country);

        });

};

// function that does the same thing as mainCity but is triggered from the user's saved searches
// on the page
const oldCity = (event) => {

    event.preventDefault();

    // user's searches are saved as buttons with a value. this stores the value of the button
    const city = $(event.target).val();

    // queryURL
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;

    // Query Open Weather for the city's weather data, and eventually calls renderWeather
    fetch(weatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(renderWeather);

};


// function that interprets the data returned from the above 3 functions and displays specific 
// information on the page
const renderWeather = (data) => {

    // first extract and save information from the response as variables for readability
    const cityName = data.name;
    const country = data.sys.country;
    const kelvin = data.main.temp;
    const humidity = data.main.humidity;
    const windMPS = data.wind.speed;
    const weatherDescription = data.weather[0].description;
    const weatherIcon = data.weather[0].icon;
    const timezoneOffset = data.timezone;
    const lat = data.coord.lat;
    const lon = data.coord.lon;

   // Converting the units
    const celsius = kelvinToCelsius(kelvin);
    const fahrenheit = kelvinToFahrenheit(kelvin);
    const mph = metersPerSecondToMPH(windMPS);

    // calls the dynamicDateAndTime function to dynamically update the date and time on the
    // page based on the timezone offset info provided by the response
    dynamicDateAndTime(timezoneOffset);

    // plugs the data we obtained from the response into the correct elements in the HTML
    cityNameEl.text(`${cityName}, ${country}`);
    temperatureEl.text(`Temperature: ${celsius}\xB0C (${fahrenheit}\xB0F)`);
    humidityEl.text(`Humidity: ${humidity}%`);
    windSpeedEl.text(`Wind Speed: ${windMPS} m/s (${mph} MPH)`);
    weatherIconEl.attr("src", `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
    weatherIconEl.attr("alt", weatherDescription);
    weatherIconEl.attr("title", weatherDescription);

    // call fetchUV and fetchForecast to get the UV information and 5-day forecast based on
    // the city's latitude and longitude
    fetchUV(lat, lon);
    fetchForecast(lat, lon);

};

// function that fetches a city's forecast information. one of a chain of functions called after
// the user searches for a city
const fetchForecast = (lat, lon) => {

    // same process as the other "fetch" functions. This call uses latitude and longitude data
    // obtained from renderWeather function, and ends in a call of renderForecast which 
    // extracts the data from the fetch and prints it to the page
    const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

    fetch(forecastURL)
        .then(function (response) {

            return response.json();

        })
        .then(renderForecast);
};

// extracts data
const renderForecast = (data) => {
    
    const forecastTimezoneOffset = data.timezone_offset;
    const forecastList = data.daily;

    //checks if the future elements are empty
    futureForecast.empty();

    // for future.
    for (let i = 1; i < 6; i++) {

        // extracts information and save it into variables
        const forecastTempK = forecastList[i].temp.day;
        const forecastHumidity = forecastList[i].humidity;
        const forecastWind = forecastList[i].wind_speed;
        const forecastIcon = forecastList[i].weather[0].icon;
        const forecastDescription = forecastList[i].weather[0].description;

        // call functions to calculate the data from the response into the desired units
        const forecastDate = calculateForecastDate(forecastTimezoneOffset, (24 * i));
        const forecastTempC = kelvinToCelsius(forecastTempK);
        const forecastTempF = kelvinToFahrenheit(forecastTempK);
        const forecastWindMPH = metersPerSecondToMPH(forecastWind);

        // creating the containers 
        const forecastBox = $('<div class="five-day-forecast-box pt-2 col-lg-2 bg-primary text-white m-2 rounded">');
        const dateP = $("<p>");
        const weatherIconImg = $("<img>");
        const tempP = $("<p>");
        const humidityP = $("<p>");
        const windP = $("<p>");

        // pushes the data into specific places
        dateP.text(forecastDate);
        weatherIconImg.attr("src", `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`);
        weatherIconImg.attr("alt", forecastDescription);
        weatherIconImg.attr("title", forecastDescription);
        tempP.text(`Temperature: ${forecastTempC}\xB0C (${forecastTempF}\xB0F)`);
        humidityP.text(`Humidity: ${forecastHumidity}%`);
        windP.text(`Wind Speed: ${forecastWind} m/s (${forecastWindMPH} MPH)`);

        // append the box to the forecast section of the HTML doc, then append the rest of the data
        // to the box
        futureForecast.append(forecastBox);
        forecastBox.append(dateP);
        forecastBox.append(weatherIconImg);
        forecastBox.append(tempP);
        forecastBox.append(humidityP);
        forecastBox.append(windP);
    }

};

// another fetch function that fetches the UV data for the city searched by the user, part of the
// chain of functions called after the user searches for a city
const fetchUV = (lat, lon) => {

    //uses the latitude and longitude
    const uvURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(uvURL)
        .then(function (response) {
            return response.json();
        })
        .then(uvData)

};

// render function that takes the data fetched using fetchUV function, interpets it and displays
// it on the page
const uvData = (data) => {

    // saves the uv index as a variable
    const uv = data.current.uvi;

    // create a span that will contain the uv value
    const uvValueEl = $('<span class="p-1" id="UV-value">');

    // ensures the uv index element in the HTML is empty since we'll be appending new information
    indexUVEl.empty();

    // changes the color according to the uv index
    if (uv < 3) {
        uvValueEl.addClass("bg-success text-white");
        uvValueEl.attr("title", "Low");
    } else if (uv >= 3 && uv < 6) {
        uvValueEl.addClass("bg-warning");
        uvValueEl.attr("title", "Medium");
    } else if (uv >= 6 && uv < 8) {
        uvValueEl.addClass("bg-danger text-white");
        uvValueEl.attr("title", "High");
    } else if (uv >= 8 && uv < 11) {
        uvValueEl.addClass("bg-vhigh text-white");
        uvValueEl.attr("title", "Very High");
    } else {
        uvValueEl.addClass("bg-extreme text-white");
        uvValueEl.attr("title", "Extremely High");
    }

    // plugs text into respective elements
    indexUVEl.text("UV Index: ");
    uvValueEl.text(` ${uv} `);

    // append the uv-index to the uv index <p> element in the HTML doc
    indexUVEl.append(uvValueEl);
};

// converts the temperature unit
const kelvinToFahrenheit = (K) => {
    return Number((K - 273.15) * (9/5) + 32).toFixed(2);
};

// converts the temperature units
const kelvinToCelsius = (K) => {
    return Number(K - 273.15).toFixed(2);
};

// measures wind speed
const metersPerSecondToMPH = (m) => {
    return Number(m * 2.237).toFixed(2);
};

// local time
const calculateForecastDate = (timezoneOffset, hours) => {
    
    // UTC time 
    const utc = moment.utc()
    // Local Time (based on the city)
    const utcPlusOffset = utc.add(timezoneOffset, "s");
    // hours always passed in increments of 24hrs. so adds 1 day, 2 days, 3 days, etc. depending.
    // see the call in renderForecast function, line 208
    const offsetPlusHours = utcPlusOffset.add(hours, "h");
    // The final date
    const forecastDate = offsetPlusHours.format("MMMM Do, YYYY");

    // returns the final calculated date
    return forecastDate;

};

// function that calculates the local date and time inside a counter to dynamically display the 
// local date and time on the page. Uses Moment.js
const dynamicDateAndTime = (timezoneOffset) => {

    // clear the interval each time a new city is searched to avoid additive behavior
    clearInterval(setDateTime);

    // we set the interval to a variable defined in the global scope so that it can always
    // be reset
    setDateTime = setInterval(function() {

        // utc date/time
        const utc = moment.utc()
        // local date/time
        const utcPlusOffset = utc.add(timezoneOffset, "s");
        // formatted local date
        const localDate = utcPlusOffset.format("MMMM Do, YYYY");
        // formatted local time
        const localTime = utcPlusOffset.format("h:mm:ss A");

        // plugs the local date and time to their respective element in the HTML document
        // this occurs every second
        dateEl.text(`Local Date: ${localDate}`);
        timeEl.text(`Local Time: ${localTime}`);

    }, 1000);
    
};

// function the saves a user's search history
const saveHistory = (cityName, countryName) => {

    // saves the user's search in an object. uses the city name and country from the fetch 
    // response to maintain consistency
    const newSearch = {
        city: cityName,
        country: countryName
    };

    // checks if a search has already been stored in localStorage using the preventDuplicate
    // function and stored in a variable for readability
    const duplicateSave = preventDuplicate(newSearch, savedCities);

    // if the result of the preventDuplicate function is true (city had already been saved in
    // localStorage), then function exits
    if (duplicateSave) {
        return;
    }

    // adds the new search to the savedCities array
    savedCities.push(newSearch);

    // sorts the array so that saved searches are displayed alphabetically for quality of life
    savedCities.sort((a,b) => (a.city > b.city) ? 1 : ((b.city > a.city) ? -1 : 0));

    // saves the searched cities to localStorage
    localStorage.setItem("city-search-history", JSON.stringify((savedCities)));

    // calls the renderHistory function to update the list of previously searched cities
    renderHistory();

};

// function that renders a user's saved search history in localStorage to the page as clickable
// buttons. called by init function when page loads
const renderHistory = () => {

    // first retrieves the previously searched cities from localStorage. Sorts the list, just in
    // case it wasn't sorted before for redundancy
    savedCities = JSON.parse(localStorage.getItem("city-search-history")) || [];
    savedCities.sort((a,b) => (a.city > b.city) ? 1 : ((b.city > a.city) ? -1 : 0));

    // empties the search history element in the HTML doc, because we'll be appending the entire
    // list of saved searches each time this function is called
    historyEl.empty();

    for (let i = 0; i < savedCities.length; i++) {

        // makes buttom for the history and make them clickable
        const createBtn = $(`<button class="history-btn list-group-item list-group-item-action text-center" value="${savedCities[i].city}, ${savedCities[i].country}">`);
        createBtn.text(`${savedCities[i].city}, ${savedCities[i].country}`);

        // appends each button to the page under the search history section in the HTML
        historyEl.append(createBtn);

    };

};

// function that clears localStorage and removes the previously saved searches from the page. 
// called when the user clicks the clear history button on the page
const clearHistory = () => {

    // if there aren't any saved searches, function does nothing
    if (savedCities.length === 0) {
        return;
    }

    // asks the user to confirm that they want to clear their search history
    if (window.confirm("Are you sure you want to clear the history?")) {

        // obliterates the user's saved searches from localStorage
        localStorage.removeItem("city-search-history");
        
        // calls the renderHistory function to basically clear the search history
        // buttons from the page
        renderHistory();

    }

};

// prevents duplicates
const preventDuplicate = (obj, list) => {

    for (let i = 0; i < list.length; i++) {

        // verify the search
        if (JSON.stringify(list[i]) === JSON.stringify(obj)) {

            return true;

        }

    }

    // else return false
    return false;
};

// function that is called on page load
const init = () => {

    // calls renderHistory function to print saved searches buttons to the page
    renderHistory();
    // calls fetchToronto function to fetch and print Toronto's weather data to the page
    fetchToronto();
    // highlights (and essentially autofocus) the search input on page load
    cityInputEl.select();

};

// click event listeners for the search button, clear button, and history buttons in the search
// history box and their respective function calls
searchBtn.click(mainCity);
clearBtn.click(clearHistory);
historyEl.on("click", ".history-btn", oldCity);

// call init function on page load
init();

