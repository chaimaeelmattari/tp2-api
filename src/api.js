import { createHash } from 'crypto';

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    // exo 3
    const timestamp = Date.now();
    const publicKey = "507b26042b7eb8fd48ac4281919811e1";
    const privateKey = "f7a9610f5aae980370e8375c5a40f3d4f587af91";
    const hash = await getHash(publicKey, privateKey, timestamp);

    const apiUrl = `${url}&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const resultsWithThumbnail = data.data.results.filter(character =>
            character.thumbnail && character.thumbnail.path !== "image_not_available"
        );

        const characters = resultsWithThumbnail.map(character => ({
            name: character.name,
            description: character.description,
            thumbnail: character.thumbnail,
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
    // exo 3
    const hash = createHash('md5');
    hash.update(timestamp + privateKey + publicKey);
    return hash.digest('hex');
}