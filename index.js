'use strict';

const SEARCH_RADIUS = 16000;
const API_KEY_YELP = "37y8J9ZVE_whz33fD-R2jp82UYhPFn9XY-GXmWOaPFyq4bcV2ZxV5g3VP8ay6hh15B2-kf-WgrTMjoi5LlQyZjUfaR2XBNMeFeH9TMZtqLHWZMvmQP8ly_cG6rmLXHYx";
const API_KEY_NP = "Zr0S27a7DvoEnaDaAY30QC6Lehvz1lg7YITO8OKf";
const LOCATION = "";


// Fetch park data from National Parks API
function getPark(searchTerm) {

 const parksUrl = `https://developer.nps.gov/api/v1/parks?q=${searchTerm}
&fields=addresses`;
}

const options = {
    headers: new Headers({
      X-Api-Key: API_KEY_NP})
  };

// function formatQueryParams(params) {
//   const queryItems = Object.keys(params)
//     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
//   return queryItems.join('&');
// }

fetch(parksUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => getAddress(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

// Get the address from the National Parks API data
funciton getAddress(){

}

// Fetch Yelp data based on selected park location
function getBusinesses(park) {
  
  // const params = {
  //   location: query
  // };

  const options = {
    headers: new Headers({
      Authorization: Bearer API_KEY_YELP})
  };

  // const queryString = formatQueryParams(params)
  // const url = searchURL + '?' + queryString;
  const url = 
`https://api.yelp.com/v3/businesses/search?location=${park}&radius=${SEARCH_RADIUS}&categories=restaurants,food,hotels&sort_by=rating&limit=10`;
  console.log(yelpUrl);

  fetch(url, options)
    .then(response => {
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
  for (let i = 1; i < responseJson.data.length; i++){

    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href=${responseJson.data[i].url}>${responseJson.data[i].url}</a>
      </li>`
    )};
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