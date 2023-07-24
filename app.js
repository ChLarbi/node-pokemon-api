const express = require("express");
const { succes } = require("./helper")
let pokemons = require('./mock-pokemon');

const app = express();
const port = 3000;

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



app.listen(port, () => console.log(`L'application Node est démarrée sur : http://localhost:${port}`));
