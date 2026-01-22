import { FavoritesManager } from './storage.js';
import { createPokemonCard, displayError } from './ui.js';

const favorites = FavoritesManager.getAll();

if (favorites.length === 0) {
    displayError("Nie masz jeszcze żadnych ulubionych Pokemonów. Dodaj je klikając gwiazdkę na stronie głównej!");
} else {
    favorites.sort((a, b) => a.id - b.id);
    
    favorites.forEach(pokemon => {
        createPokemonCard(pokemon);
    });
}