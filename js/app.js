import { fetchAllPokemonNames, fetchPokemonDetails } from './api.js';
import { createPokemonCard, clearContainer, showLoader, displayError, updatePaginationUI, hidePagination } from './ui.js';

let allPokemons = [];
let filteredPokemons = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 20;

const searchInput = document.getElementById('search-input');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

async function init() {
    showLoader(true);
    try {
        allPokemons = await fetchAllPokemonNames();
        filteredPokemons = allPokemons;
        await renderPage(1);
    } catch (error) {
        displayError("Nie udało się pobrać listy Pokemonów. Sprawdź połączenie.");
    } finally {
        showLoader(false);
    }
}

async function renderPage(page) {
    currentPage = page;
    clearContainer();
    showLoader(true);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    const pageItems = filteredPokemons.slice(startIndex, endIndex);

    if (pageItems.length === 0) {
        displayError("Nie znaleziono Pokemonów pasujących do wyszukiwania.");
        hidePagination();
        showLoader(false);
        return;
    }

    const detailsPromises = pageItems.map(p => fetchPokemonDetails(p.url));
    const pokemonsDetails = await Promise.all(detailsPromises);

    showLoader(false);
    
    pokemonsDetails.forEach(pokemon => createPokemonCard(pokemon));

    const totalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE);
    updatePaginationUI(currentPage, totalPages, currentPage > 1, currentPage < totalPages);
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    filteredPokemons = allPokemons.filter(pokemon => 
        pokemon.name.includes(query)
    );

    renderPage(1);
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) renderPage(currentPage - 1);
});

nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) renderPage(currentPage + 1);
});

init();