import fastify from 'fastify';
import fastifyView from '@fastify/view';
import handlebars from 'handlebars';
import { getData } from './api.js';

const server = fastify();

server.register(fastifyView, {
    engine: {
        handlebars: handlebars
    },
    options: {
        partials: {
            header: '/templates/header.hbs',
            footer: '/templates/footer.hbs'
        }
    }
});

server.get('/', async (req, res) => {
    const characters = await getData("https://gateway.marvel.com/v1/public/characters");
    console.log(characters);
    return res.view('/templates/index.hbs', {characters: characters})

})

server.listen({ port: 3000});
