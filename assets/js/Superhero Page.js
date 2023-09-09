//globals
const apiKey = 'bcee2f7de4c57ec7e78727c923428c0b';
const privateKey = 'fbc7ca423155c9e2d2fe54d94475fef64a7406d7';
const baseUrl = 'https://gateway.marvel.com/v1/public/';
// const md5 = require("crypto-js/md5");


//global var for storing charachter id that needs to be loaded
var charachterIdLoad = '';
window.onload = function () {
  // Get the selected character ID from the localStorage
  charachterIdLoad = localStorage.getItem('charId');
};

//arrays to store data
let characters_array = [];
function generateHash(ts) {
  const hash = CryptoJS.MD5(ts + privateKey + apiKey);
  return hash;
}

//fetch charachters
function fetchCharacters() {
  const ts = new Date().getTime().toString();
  const hash = generateHash(ts);

  const url = `${baseUrl}characters?apikey=${apiKey}&ts=${ts}&hash=${hash}`;
  console.log("API Request URL:", url);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("API Response:", data);
      displayCharacters(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
fetchCharacters();

//display charachters
function displayCharacters(data) {
  characters_array = data.data.results;
  const charactersList = document.getElementById('characters-list');

  // Check if the API request was successful
  if (data && data.data && data.data.results) {
    const characters = data.data.results;
    characters.forEach(character => {
      const characterCard = createCharacterCard(character);
      charactersList.appendChild(characterCard);
    });
  } else {
    charactersList.textContent = 'Error fetching characters.';
  }
}

function createCharacterCard(character) {
  if (character.id == charachterIdLoad) {
    // Create a list of comics names
    const comicsList = character.comics.items.map(comic => `<li>${comic.name}</li>`).join('');

    // Create a list of events names
    const eventsList = character.events.items.map(event => `<li>${event.name}</li>`).join('');

    // Create a list of series names
    const seriesList = character.series.items.map(series => `<li>${series.name}</li>`).join('');

    // Create a list of stories names
    const storiesList = character.stories.items.map(story => `<li>${story.name}</li>`).join('');

    const characterCardHTML = `
      <div class="col-12  mb-4">
        <div class="card h-100 custom-card">
          <div class="row no-gutters">
            <!-- Image container on the left side -->
            <div class="col-md-4">
              <img src="${character.thumbnail.path}.${character.thumbnail.extension}" class="card-img" alt="${character.name}">
            </div>
            <!-- Character description on the right side -->
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${character.name}</h5>
                ${character.description ? `<p class="card-text">${character.description}</p>` : '<p class="card-text">No description available.</p>'}
                <div>
                  <h6>Comics:</h6>
                  <ul>${comicsList}</ul>
                </div>
                <div>
                  <h6>Events:</h6>
                  <ul>${eventsList}</ul>
                </div>
                <div>
                  <h6>Series:</h6>
                  <ul>${seriesList}</ul>
                </div>
                <div>
                  <h6>Stories:</h6>
                  <ul>${storiesList}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    // Convert the card HTML string to a DOM element
    const characterCard = document.createRange().createContextualFragment(characterCardHTML);
    return characterCard;
  } else {
    const characterCard = document.createRange().createContextualFragment('');
    return characterCard;
  }
}





