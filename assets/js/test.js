const apiKey = 'bcee2f7de4c57ec7e78727c923428c0b';
const privateKey = 'fbc7ca423155c9e2d2fe54d94475fef64a7406d7';
const baseUrl = 'https://gateway.marvel.com/v1/public/';
// const md5 = require("crypto-js/md5");


//arrays to store data
let characters_array = [];

//for hash genration
function generateHash(ts) {
  const hash = CryptoJS.MD5(ts + privateKey + apiKey);
  return hash;
}

//for fetching charachters
function fetchCharacters() {
  const ts = new Date().getTime().toString();
  const hash = generateHash(ts);

  //url string is genrated
  const url = `${baseUrl}characters?apikey=${apiKey}&ts=${ts}&hash=${hash}`;
  console.log("API Request URL:", url);

  //fetch from the url that has been genrated
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("API Response:", data);
      //if there is data call display function
      displayCharacters(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
fetchCharacters();

//for displaying charachters
function displayCharacters(data) {
  characters_array = data.data.results;
  const charactersList = document.getElementById('characters-list');

  // Check if the API request was successful
  if (data && data.data && data.data.results) {
    const characters = data.data.results;
    characters.forEach(character => {
      //for each charachter call create charachter card and pass the charachter as a parameter
      const characterCard = createCharacterCard(character);
      charactersList.appendChild(characterCard);
    });
  } else {
    charactersList.textContent = 'Error fetching characters.';
  }
}
//create card for charachter
function createCharacterCard(character) {
  const characterCardHTML = `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div class="card h-100" >
        <img onclick="storeId(${character.id})" src="${character.thumbnail.path}.${character.thumbnail.extension}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${character.name}</h5>
          <button class="btn btn-success mr-2 " data="${character.id}" id="addToFavBtn_${character.id}">
          <img src="./assets/favimage.png" alt="Add to Favorites" style="width:20px; height:20px; position:relative;top:-2px;textalign:center;":> Add to Favorites
          </button>
          <button class="btn btn-dark mr-2" data="${character.id}" id="removeFromFavBtn_${character.id}">
            Remove from Favorites
          </button>
        </div>
      </div>
    </div>
  `;

  // Convert the card HTML string to a DOM element
  const characterCard = document.createRange().createContextualFragment(characterCardHTML);

  // Attach event listeners to the buttons if needed
  const addToFavButton = characterCard.querySelector(`#addToFavBtn_${character.id}`);
  const removeFromFavButton = characterCard.querySelector(`#removeFromFavBtn_${character.id}`);


  //check if charachter is in the fav 
  const isFavorite = localStorage.getItem('favorites')?.includes(character.id);

  // Show/hide the buttons based on favorites
  if (isFavorite) {
    addToFavButton.style.display = 'none';
    removeFromFavButton.style.display = 'inline-block';
  } else {
    removeFromFavButton.style.display = 'none';
    addToFavButton.style.display = 'inline-block';
  }


  //functions for adding in fav
  addToFavButton.addEventListener('click', () => {
    //it assigns an empty string ('') to the variable favorites as default
    const favorites = localStorage.getItem('favorites') || '';
    localStorage.setItem('favorites', `${favorites},${character.id}`);
    addToFavButton.style.display = 'none';
    //set display inline so that after adding the button to remove should appear
    removeFromFavButton.style.display = 'inline-block';
  });

  //function for removing from fav
  removeFromFavButton.addEventListener('click', () => {
    const favorites = localStorage.getItem('favorites') || '';
    localStorage.setItem('favorites', favorites.replace(`,${character.id}`, ''));
    removeFromFavButton.style.display = 'none';
    //set display inline so that after removing the button to add should appear
    addToFavButton.style.display = 'inline-block';
  });

  return characterCard;
}


//for searching throgh the charachters
function searchCharacters() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  const charactersList = document.getElementById('characters-list');
  //empty the div
  charactersList.innerHTML = '';

  // Filter the characters based on the search input
  const filteredCharacters = characters_array.filter((character) =>
    character.name.toLowerCase().includes(searchInput)
  );

  //if there are charachters
  if (filteredCharacters.length > 0) {
    filteredCharacters.forEach((character) => {
      const card = `
          <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4 mb-4" onclick="storeId(${character.id})">
            <div class="card h-100 custom-card">
              <img src="${character.thumbnail.path}.${character.thumbnail.extension}" class="card-img-top">
              <div class="card-body">
                <h5 class="card-title">${character.name}</h5>
                ${character.description ? `<p class="card-text">${character.description}</p>` : '<p class="card-text">No description available.</p>'}
                <button class="btn btn-primary mr-2" id="addToFavBtn_${character.id}">
                  Add to Favorites
                </button>
                <button class="btn btn-danger d-none mr-2" id="removeFromFavBtn_${character.id}">
                  Remove from Favorites
                </button>
              </div>
            </div>
          </div>
        `;
      charactersList.insertAdjacentHTML('beforeend', card);
    });
  } else {
    //there are no charchters like that
    charactersList.innerHTML = 'No matching characters found.';
  }
}

// Add an event listener to the search input for real time search
document.getElementById('search-input').addEventListener('input', searchCharacters);

//to store charachter id and redirect so that description can be shown
function storeId(id) {
  localStorage.setItem('charId', id);
  window.location.href = './Superhero Page.html';
}

