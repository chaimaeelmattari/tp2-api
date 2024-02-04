import { getData } from './api.js';  // Assurez-vous que le chemin est correct

// Test avec les personnages
const apiUrl = 'https://gateway.marvel.com/v1/public/characters?limit=5';

(async () => {
    try {
        const charactersData = await getData(apiUrl);
        console.log('Characters Data:', charactersData);
    } catch (error) {
        console.error('Error:', error);
    }
})();
