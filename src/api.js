import fetch from 'node-fetch';
import crypto from 'crypto';

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    // A Compléter exo 3
    const timestamp = Math.floor(Date.now() / 1000);
    const publicKey = "507b26042b7eb8fd48ac4281919811e1";
    const privateKey = "f7a9610f5aae980370e8375c5a40f3d4f587af91";
    const hash = await getHash(publicKey, privateKey, timestamp);

    const apiUrl = `${url}&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Effectuer la sélection des résultats qui possèdent une image thumbnail valide
        const resultsWithThumbnail = data.data.results.filter(character =>
            character.thumbnail && character.thumbnail.path !== "image_not_available"
        );

        // Constituer un tableau de Personnage contenant pour le champ imageUrl la destination de la
        // version portrait_xlarge de l’image.
        const characters = resultsWithThumbnail.map(character => ({
            name: character.name,
            description: character.description,
            imageUrl: `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`
        }));

        return characters;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    // A compléter exo 3
    const hash = crypto.createHash('md5');
    hash.update(timestamp + privateKey + publicKey);
    return hash.digest('hex');
}

