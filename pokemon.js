const MAX_POKEMON = 151;
const selectedPokemonWrapper = document.querySelector(".selected-pokemon-wrapper");
const listWrapper = document.querySelector(".list-wrapper");
const computerPokemonWrapper = document.querySelector(".computer-pokemon-wrapper");
const battleResult = document.querySelector(".battle-result");
let allPokemons = [];
let playerPokemonData = null;
let computerPokemonData = null;

const typeChart = {
  normal: { strong: [], weak: ["rock", "steel"], immune: ["ghost"] },

  fire: { strong: ["grass", "ice", "bug", "steel"], weak: ["fire", "water", "rock", "dragon"] },

  water: { strong: ["fire", "ground", "rock"], weak: ["water", "grass", "dragon"] },

  electric: { strong: ["water", "flying"], weak: ["electric", "grass", "dragon"], immune: ["ground"] },

  grass: { strong: ["water", "ground", "rock"], weak: ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"] },

  ice: { strong: ["grass", "ground", "flying", "dragon"], weak: ["fire", "water", "ice", "steel"] },

  fighting: { strong: ["normal", "rock", "steel", "ice", "dark"], weak: ["poison", "flying", "psychic", "bug", "fairy"], immune: ["ghost"] },

  poison: { strong: ["grass", "fairy"], weak: ["poison", "ground", "rock", "ghost"], immune: ["steel"] },

  ground: { strong: ["fire", "electric", "poison", "rock", "steel"], weak: ["grass", "bug"], immune: ["flying"] },

  flying: { strong: ["grass", "fighting", "bug"], weak: ["electric", "rock", "steel"] },

  psychic: { strong: ["fighting", "poison"], weak: ["psychic", "steel"], immune: ["dark"] },

  bug: { strong: ["grass", "psychic", "dark"], weak: ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"] },

  rock: { strong: ["fire", "ice", "flying", "bug"], weak: ["fighting", "ground", "steel"] },

  ghost: { strong: ["psychic", "ghost"], weak: ["dark"], immune: ["normal"] },

  dragon: { strong: ["dragon"], weak: ["steel"], immune: ["fairy"] },

  dark: { strong: ["psychic", "ghost"], weak: ["fighting", "dark", "fairy"] },

  steel: { strong: ["ice", "rock", "fairy"], weak: ["fire", "water", "electric", "steel"] },

  fairy: { strong: ["fighting", "dragon", "dark"], weak: ["fire", "poison", "steel"] }
};

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
    <div class="pokemon-card-wrap">
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
    </div>
  `;
    listWrapper.appendChild(listItem);
  }
}

async function chosenPokemon(id) {
  const pokemon = allPokemons[id];
  const response = await fetch(pokemon.url);
  const pokemonData = await response.json();

  playerPokemonData = pokemonData;

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

  computerPokemonData = pokemonData;

  const computerPokemonItem = document.createElement("div");
  computerPokemonItem.className = "computer-pokemon-item"
  computerPokemonItem.innerHTML = `
    <div class="name-wrap">
      <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
    </div>
    <div class="pokemon-wrap">
      <button class="button-wrap">
        <img class="pokemon-img-wrap" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${randomComputerPokemonId + 1}.svg" alt="${pokemon.name}"/>
      </button>
    </div>
    <div class="type-wrap">
      ${pokemonData.types.map(type => `<p>${type.type.name}</p>`).join("")}
    </div>
  `
  computerPokemonWrapper.appendChild(computerPokemonItem);
  runBattle();
}

function getTypeMultiplier(attackerType, defenderTypes) {
  let multiplier = 1;

  defenderTypes.forEach(defType => {
    const chart = typeChart[attackerType]

    if(chart.immune?.includes(defType)) {
      multiplier *= 0;
    } else if (chart.strong?.includes(defType)) {
      multiplier *= 2;
    } else if (chart.weak?.includes(defType)) {
      multiplier *= 0.5;
    } 
  })

  return multiplier;
}

function decideWinner(playerTypes, computerTypes) {
  const playerDamageMultiplier = getTypeMultiplier(playerTypes[0], computerTypes);
  
  const computerDamageMultiplier = getTypeMultiplier(computerTypes[0], playerTypes);

  if (playerDamageMultiplier > computerDamageMultiplier) {
    return "Player wins!"
  }
  if (computerDamageMultiplier > playerDamageMultiplier) {
    return "Computer wins!"
  }
  return "Tie!"
}

function runBattle() {
  if(!playerPokemonData || !computerPokemonData) {
    return;
  }

  const playerTypes = playerPokemonData.types.map(t => t.type.name);
  const computerTypes = computerPokemonData.types.map(t => t.type.name);

  const result = decideWinner(playerTypes, computerTypes);

  battleResult.innerText = result;
}