import { fetchPokemonById } from './api.js';
import { FavoritesManager } from './storage.js';

const detailsContainer = document.getElementById('details-container');
const formsSection = document.getElementById('forms-section');
const formsGrid = document.getElementById('forms-grid');
const loader = document.getElementById('loader');

const params = new URLSearchParams(window.location.search);
const pokemonId = params.get('id');

async function initDetails() {
    if (!pokemonId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const pokemon = await fetchPokemonById(pokemonId);
        
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();

        renderDetails(pokemon, speciesData);

        await loadVarieties(pokemon, speciesData);

    } catch (error) {
        loader.textContent = "Błąd pobierania danych. Spróbuj odświeżyć stronę.";
        console.error(error);
    } finally {
        loader.classList.add('hidden');
    }
}

function renderDetails(pokemon, speciesData) {
    detailsContainer.classList.remove('hidden');

    const imageSrc = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

    const isFav = FavoritesManager.isFavorite(pokemon.id);
    const activeClass = isFav ? 'active' : '';

    const typesHtml = pokemon.types.map(t => 
        `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`
    ).join('');

    const statsHtml = pokemon.stats.map(s => {
        const statName = s.stat.name.replace('-', ' ');
        const statValue = s.base_stat;
        const width = Math.min((statValue / 200) * 100, 100); 
        
        return `
            <div class="stat-row">
                <span class="stat-name">${statName}</span>
                <span class="stat-val">${statValue}</span>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${width}%"></div>
                </div>
            </div>
        `;
    }).join('');

    const weight = (pokemon.weight / 10).toFixed(1) + ' kg';
    const height = (pokemon.height / 10).toFixed(1) + ' m';

    const flavorEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
    const description = flavorEntry 
        ? flavorEntry.flavor_text.replace(/\f/g, ' ')
        : 'Brak opisu dla tego Pokemona.';


    detailsContainer.innerHTML = `
        <button id="detail-fav-btn" class="favorite-btn ${activeClass}" style="top: 20px; right: 20px;">
            <i class="fas fa-star"></i>
        </button>

        <div class="details-header">
            <img src="${imageSrc}" alt="${pokemon.name}" class="detail-image">
            
            <div class="detail-info">
                <span class="detail-id">#${pokemon.id}</span>
                <h2 class="detail-name">${pokemon.name}</h2>
                <div class="types mb-2">${typesHtml}</div>
                
                <p style="color: #555; font-style: italic; margin-bottom: 1.5rem; line-height: 1.4;">
                    "${description}"
                </p>

                <div class="measurements">
                    <div class="measure-box">
                        <i class="fas fa-weight-hanging"></i>
                        <p>${weight}</p>
                        <span>Waga</span>
                    </div>
                    <div class="measure-box">
                        <i class="fas fa-ruler-vertical"></i>
                        <p>${height}</p>
                        <span>Wzrost</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="stats-container">
            <h3>Statystyki</h3>
            ${statsHtml}
        </div>
    `;

    const favBtn = document.getElementById('detail-fav-btn');
    favBtn.addEventListener('click', () => {
        const isNowFav = FavoritesManager.toggle(pokemon);
        if (isNowFav) {
            favBtn.classList.add('active');
        } else {
            favBtn.classList.remove('active');
        }
    });
}

async function loadVarieties(currentPokemon, speciesData) {
    try {
        const varieties = speciesData.varieties.filter(v => v.pokemon.name !== currentPokemon.name);

        if (varieties.length === 0) return;

        formsSection.classList.remove('hidden');

        const varietiesPromises = varieties.map(v => fetch(v.pokemon.url).then(res => res.json()));
        const varietiesDetails = await Promise.all(varietiesPromises);

        varietiesDetails.forEach(pokemon => createMiniCard(pokemon));

    } catch (error) {
        console.error("Błąd ładowania odmian:", error);
    }
}

function createMiniCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.style.cursor = 'pointer';

    card.addEventListener('click', () => {
        window.location.href = `details.html?id=${pokemon.id}`;
    });

    const imageSrc = pokemon.sprites.other['official-artwork'].front_default 
                  || pokemon.sprites.front_default 
                  || 'https://via.placeholder.com/150';

    const typesHtml = pokemon.types.map(t => 
        `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`
    ).join('');

    card.innerHTML = `
        <p class="pokemon-id">#${pokemon.id}</p>
        <img src="${imageSrc}" alt="${pokemon.name}" class="pokemon-image">
        <h2 class="pokemon-name" style="font-size: 1.2rem;">${pokemon.name.replace('-', ' ')}</h2>
        <div class="types">${typesHtml}</div>
    `;

    formsGrid.appendChild(card);
}

initDetails();