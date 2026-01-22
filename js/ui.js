import { FavoritesManager } from './storage.js';

const container = document.getElementById('pokemon-container');
const errorContainer = document.getElementById('error-message');
const loader = document.getElementById('loader');
const paginationContainer = document.getElementById('pagination');
const pageInfo = document.getElementById('page-info');


export function showLoader(show) {
    if (show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
}

export function clearContainer() {
    container.innerHTML = '';
    errorContainer.classList.add('hidden');
    errorContainer.textContent = '';
}

export function displayError(message) {
    clearContainer();
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
}

export function updatePaginationUI(currentPage, totalPages, hasPrev, hasNext) {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if(!paginationContainer) return;

    paginationContainer.classList.remove('hidden');
    pageInfo.textContent = `Strona ${currentPage} z ${totalPages}`;
    prevBtn.disabled = !hasPrev;
    nextBtn.disabled = !hasNext;
}

export function hidePagination() {
    if(paginationContainer) paginationContainer.classList.add('hidden');
}


export function createPokemonCard(pokemon) {
    if (!pokemon) return;

    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.style.position = 'relative';
    
    const isFav = FavoritesManager.isFavorite(pokemon.id);

    const starBtn = document.createElement('button');
    starBtn.classList.add('favorite-btn');
    if (isFav) starBtn.classList.add('active');
    starBtn.innerHTML = '<i class="fas fa-star"></i>';

    starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        const isNowFav = FavoritesManager.toggle(pokemon);
        
        if (isNowFav) {
            starBtn.classList.add('active');
        } else {
            starBtn.classList.remove('active');
            
            if (window.location.pathname.includes('favorites.html')) {
                card.remove();
                if (container.children.length === 0) {
                    displayError("Brak ulubionych Pokemonów.");
                }
            }
        }
    });

    card.addEventListener('click', () => {
        window.location.href = `details.html?id=${pokemon.id}`;
    });
    
    const imageSrc = pokemon.sprites.other['official-artwork'].front_default 
                  || pokemon.sprites.front_default 
                  || 'https://via.placeholder.com/150';
    
    const typesHtml = pokemon.types.map(typeInfo => {
        const typeName = typeInfo.type.name;
        return `<span class="type-badge type-${typeName}">${typeName}</span>`;
    }).join('');

    card.innerHTML = `
        <p class="pokemon-id">#${pokemon.id}</p>
        <img src="${imageSrc}" alt="${pokemon.name}" class="pokemon-image" loading="lazy">
        <h2 class="pokemon-name">${pokemon.name.replace('-', ' ')}</h2>
        <div class="types">${typesHtml}</div>
    `;

    card.appendChild(starBtn);
    container.appendChild(card);
}