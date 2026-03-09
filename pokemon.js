const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  // convert to json
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    displayRandomPokemon();
  });

function displayRandomPokemon() {
  listWrapper.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    let randomPokemonId = Math.floor(Math.random() * MAX_POKEMON);
    const pokemon = allPokemons[randomPokemonId];
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
    <div class="img-wrap">
      <img class="pokemon-img-wrap" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${randomPokemonId + 1}.svg" alt="${pokemon.name}" />
    </div>
  `;
    listWrapper.appendChild(listItem);
  }
}
