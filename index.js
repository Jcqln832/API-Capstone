'use strict';

// const SEARCH_RADIUS = 16000;
const API_KEY_STORMGLASS = "7f249d00-4b47-11e9-869f-0242ac130004-7f249e0e-4b47-11e9-869f-0242ac130004";
const API_KEY_NP = "Zr0S27a7DvoEnaDaAY30QC6Lehvz1lg7YITO8OKf";
// const LOCATION = "";


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
      // console.log(response);
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
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

// Get the coordinates from the National Parks API data
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
    // console.log(lng);
  getWeather(lat, lng);
 }

// Fetch Weather data based on selected park coordinates
function getWeather(lat,lng) {

  const params = 'airTemperature,cloudCover,precipitation';

  const options = {
    headers: new Headers({
      "Authorization": API_KEY_STORMGLASS })
  };
  
// let nowTime = Date.time();
let d = new Date();
let t =  d.setUTCHours(12);
  // const queryString = formatQueryParams(params)
  // const url = searchURL + '?' + queryString;
  const url = 
`https://api.stormglass.io/point?lat=${lat}&lng=${lng}&params=${params}&source=noaa&start=${t}&end=${t}`;
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


// Add content to Page

function displayResults(responseJson) {
  console.log(responseJson);

  // if there are previous results, remove them
  $('li').remove();

  // iterate through the response data array
  // for (let i = 1; i < responseJson.data.length; i++){

  //   $('#results-list').append(
  //     `<li><h3>${responseJson.data[i].fullName}</h3>
  //     <p>${responseJson.data[i].description}</p>
  //     <a href=${responseJson.data[i].url}>${responseJson.data[i].url}</a>
  //     </li>`
  //   )};
};

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