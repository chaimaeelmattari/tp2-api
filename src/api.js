import { createHash } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    // exo 3
    const timestamp = Date.now();
    const publicKey = process.env.PUBKEY;
    const privateKey = process.env.PRIKEY;

    const hash = await getHash(publicKey, privateKey, timestamp);

    const apiUrl = `${url}?apikey=${publicKey}&ts=${timestamp}&hash=${hash}&offset=100`;

    try {
        const response = await fetch(apiUrl);
        const datas = await response.json();

        const resultsWithThumbnail = datas.data.results.filter(character =>
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