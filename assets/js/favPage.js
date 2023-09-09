//globals
const apiKey = 'bcee2f7de4c57ec7e78727c923428c0b';
const privateKey = 'fbc7ca423155c9e2d2fe54d94475fef64a7406d7';
const baseUrl = 'https://gateway.marvel.com/v1/public/';
// const md5 = require("crypto-js/md5");

//arrays to store data
let characters_array = [];
function generateHash(ts) {
  const hash = CryptoJS.MD5(ts + privateKey + apiKey);
  return hash;
}

//fetch charchters
function fetchCharacters() {
  const ts = new Date().getTime().toString();
  const hash = generateHash(ts);

  const url = `${baseUrl}characters?apikey=${apiKey}&ts=${ts}&hash=${hash}`;
  console.log("API Request URL:", url);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("API Response:", data);
      characters_array = data.data.results;
      displayCharacters(characters_array);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

fetchCharacters();

//display fetched charachters
function displayCharacters(characters) {
  const favorites = localStorage.getItem('favorites') || '';
  const favoritesArray = favorites.split(',');

  const charactersList = document.getElementById('characters-list');
  charactersList.innerHTML = ''; // Clear previous content

  // Check if the characters array is empty
  if (characters.length === 0) {
    charactersList.textContent = 'No characters available.';
    return;
  }

  characters.forEach(character => {
    // Check if the character ID is present in the favorites array
    const isFavorite = favoritesArray.includes(character.id.toString());

    // If it's a favorite or no favorites are set, display the character card
    if (favoritesArray.length === 0 || isFavorite) {
      const characterCard = createCharacterCard(character, isFavorite);
      charactersList.appendChild(characterCard);
    }
  });
}

//create card and add in the existing html
function createCharacterCard(character, isFavorite) {
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
              <button class="btn btn-danger mr-2" data="${character.id}" id="removeFromFavBtn_${character.id}">
              Remove from Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Convert the card HTML string to a DOM element
  const characterCard = document.createRange().createContextualFragment(characterCardHTML);

  return characterCard;
}
