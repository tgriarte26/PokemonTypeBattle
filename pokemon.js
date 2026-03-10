const MAX_POKEMON = 151;
const selectedPokemonWrapper = document.querySelector(".selected-pokemon-wrapper");
const listWrapper = document.querySelector(".list-wrapper");
const computerPokemonWrapper = document.querySelector(".computer-pokemon-wrapper");
let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  // convert to json
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    displayRandomPokemon();
  });

async function displayRandomPokemon() {
  listWrapper.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    let randomPokemonId = Math.floor(Math.random() * MAX_POKEMON);
    const pokemon = allPokemons[randomPokemonId];

    const response = await fetch(pokemon.url);
    const pokemonData = await response.json();

    const listItem = document.createElement("div");
    listItem.className = "list-item";

    listItem.innerHTML = `
    <div class="name-wrap">
      <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
    </div>
    <div class="img-wrap">
      <button class="button-wrap" onclick="chosenPokemon(${randomPokemonId}); displayComputerPokemon()">
        <img class="pokemon-img-wrap" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${randomPokemonId + 1}.svg" alt="${pokemon.name}"/>
      </button>
    </div>
    <div class="type-wrap">
      ${pokemonData.types.map(type => `<p>${type.type.name}</p>`).join("")}
    </div>
  `;
    listWrapper.appendChild(listItem);
  }
}

async function chosenPokemon(id) {
  const pokemon = allPokemons[id];
  const response = await fetch(pokemon.url);
  const pokemonData = await response.json();
  listWrapper.style.display = "none";
  document.querySelector(".select-your-pokemon").style.display = "none";
  console.log(pokemon.name);
  selectedPokemonWrapper.innerHTML = "";
  const selectedPokemon = document.createElement("div");
  selectedPokemon.className = "selected-pokemon"
  selectedPokemon.innerHTML = `
    <div class="name-wrap">
      <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
    </div>
    <div class="pokemon-wrap">
      <button class="button-wrap" onclick="chosenPokemon(${id})">
        <img class="pokemon-img-wrap" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id + 1}.svg" alt="${pokemon.name}"/>
      </button>
    </div>
    <div class="type-wrap">
      ${pokemonData.types.map(type => `<p>${type.type.name}</p>`).join("")}
    </div>
  `;

  selectedPokemonWrapper.appendChild(selectedPokemon);
}

async function displayComputerPokemon() {
  computerPokemonWrapper.innerHTML = "";
  let randomComputerPokemonId = Math.floor(Math.random() * MAX_POKEMON);
  const pokemon = allPokemons[randomComputerPokemonId];
  const response = await fetch(pokemon.url);
  const pokemonData = await response.json();
  const computerPokemonItem = document.createElement("div");
  computerPokemonItem.className = "computer-pokemon-item"
  computerPokemonItem.innerHTML = `
    <div class="name-wrap">
      <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
    </div>
    <div class="pokemon-wrap">
      <button class="button-wrap" onclick="chosenPokemon(${randomComputerPokemonId})">
        <img class="pokemon-img-wrap" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${randomComputerPokemonId + 1}.svg" alt="${pokemon.name}"/>
      </button>
    </div>
    <div class="type-wrap">
      ${pokemonData.types.map(type => `<p>${type.type.name}</p>`).join("")}
    </div>
  `
  computerPokemonWrapper.appendChild(computerPokemonItem);
}