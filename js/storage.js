const STORAGE_KEY = 'pokesearch_favorites';

export const FavoritesManager = {
    getAll: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    isFavorite: (id) => {
        const favorites = FavoritesManager.getAll();
        return favorites.some(p => p.id === id);
    },

    toggle: (pokemon) => {
        let favorites = FavoritesManager.getAll();
        const exists = favorites.some(p => p.id === pokemon.id);

        if (exists) {
            favorites = favorites.filter(p => p.id !== pokemon.id);
        } else {
            const minifiedPokemon = {
                id: pokemon.id,
                name: pokemon.name,
                sprites: pokemon.sprites,
                types: pokemon.types
            };
            favorites.push(minifiedPokemon);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        return !exists;
    }
};