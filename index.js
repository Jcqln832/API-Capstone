'use strict';

const API_KEY_NP = "Zr0S27a7DvoEnaDaAY30QC6Lehvz1lg7YITO8OKf";
const API_KEY_STORMGLASS = "7f249d00-4b47-11e9-869f-0242ac130004-7f249e0e-4b47-11e9-869f-0242ac130004";

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

// Fetch park data from National Parks API
function getPark(searchTerm) {

  const params = {
    q: searchTerm,
    api_key:  API_KEY_NP
  }

  const parksUrl = `https://developer.nps.gov/api/v1/parks?${formatQueryParams(params)}`;

  fetch(parksUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    // make sure results contain only the named park
    .then(responseJson => {
      const park = responseJson.data.find(item => item.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      console.log(park)
      return park;
      })
    .then(park => getPoint(park))
    .catch(err => {
      console.error(err);
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
  }

// Get park coordinates and weather summary from the National Parks API data. Then call functions to  (1)display the summary and (2)get current weather data from StormGlass API using coordinates

 function getPoint(park){
  let parkCoords= park.latLong.split(",");
    // console.log(parkCoords);
  let cords = parkCoords.map(function(item){
    return item.split(":")
  });
    // console.log(cords);
  let lat = cords[0][1];
    // console.log(lat);
  let lng = cords[1][1];
    // console.log(lng)
  let summary = park.weatherInfo;
  displaySummary(summary);
  getWeather(lat, lng);
 }

 function displaySummary(summary) {
   $('#summary').append(
      `<p>${summary}</p>`);
 }

// Fetch weather data with selected park's coordinates
function getWeather(lat,lng) {

  const params = 'airTemperature,cloudCover';

  const options = {
    headers: new Headers({
      "Authorization": API_KEY_STORMGLASS })
  };
  
let dateTime = new Date();
dateTime.setMinutes(0);
dateTime.setSeconds(0);
dateTime.setMilliseconds(0);

let startTime =  dateTime.toISOString();
console.log("Start Time: " + startTime);

let dateTime2 = new Date();
// let tzo2 = dateTime2.getTimezoneOffset();
dateTime2.setMinutes(0);
dateTime2.setSeconds(0);
dateTime2.setMilliseconds(0);
let endTime = dateTime2.toISOString();
console.log("End Time:" + endTime);
  // const queryString = formatQueryParams(params)
  // const url = searchURL + '?' + queryString;
  const url = 
`https://api.stormglass.io/point?lat=${lat}&lng=${lng}&params=${params}&source=noaa&start=${startTime}&end=${endTime}`;
  console.log(url);

  fetch(url, options)
    .then(response => {
      console.log(response);
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function toFahrenheit(celsius) {
    let fahrenheit = Math.round((celsius * (9/5)) + 32);
    return fahrenheit;
}

// Add content to Page

function displayResults(responseJson) {
  console.log(responseJson);

  // if there are previous results, remove them
  $('li').remove();

  let celsius = responseJson.hours[0].airTemperature[0].value;
  let degreesFar = toFahrenheit(celsius);

  // iterate through the response data array
  // for (let i = 1; i < responseJson.length; i++){

    $('#results-list').append(
      `<li><p>Temperature: ${degreesFar} ^F</p></li>
      <li><p>Cloud Cover: ${responseJson.hours[0].cloudCover[0].value}%</p></li>
      `
    );
};
// };

// Event Listeners
  // get the park name from input field
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    getPark(searchTerm);
  });
}

$(watchForm);