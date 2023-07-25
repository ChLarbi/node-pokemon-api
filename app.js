const express = require("express");
const morgan = require('morgan');
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize")
const { succes, getUniqueId } = require("./helper")
let pokemons = require('./mock-pokemon');
const { log } = require("console");

const app = express();
const port = 3000;

const sequelize = new Sequelize('pokedex', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: false
  })

sequelize.authenticate()
.then(_ => console.log("La connexion à la base de données a bien été établie."))
.catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))

app
.use(morgan('dev'))
.use(bodyParser.json())


app.get("/", (req,res) => res.send("Hello, Express 4 ! "));

app.get('/api/pokemons', (req, res) => { 
    const message = "La liste des pokémons a bien été récupérée"
    res.json(succes(message, pokemons));
})

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find(pokemon => pokemon.id === id);
    const message = "Un pokemon à été trouvé"
    res.json(succes(message, pokemon));
});

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons);
    const pokemonCreated = {...req.body, ...{id: id, created: new Date()}};
    pokemons.push(pokemonCreated);
    const message = `Le pokemon ${pokemonCreated.name} à bien été crée`;
    res.json(succes(message, pokemonCreated));
})

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonUpdated = { ...req.body, id: id}
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })

    const message = `Le pokemon ${pokemonUpdated.name} a bien été modifié`
    res.json(succes(message, pokemonUpdated))
});

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id);
    const message = `Le pokemon ${pokemonDeleted.name} a bien été supprimé`
    pokemons = pokemons.filter(pokemon => pokemon.id !== id);
    res.json(succes(message, pokemonDeleted))
})

app.listen(port, () => console.log(`L'application Node est démarrée sur : http://localhost:${port}`));
