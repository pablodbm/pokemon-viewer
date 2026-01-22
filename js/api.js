const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export async function fetchAllPokemonNames() {
    try {
        const response = await fetch(`${BASE_URL}?limit=1302`); 
        const data = await response.json();
        return data.results;
    } catch (error) {
        throw new Error('Błąd pobierania listy Pokemonów');
    }
}

export async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Błąd');
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function fetchPokemonById(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Nie znaleziono szczegółów');
        return await response.json();
    } catch (error) {
        throw error;
    }
}