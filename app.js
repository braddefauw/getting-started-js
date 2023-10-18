const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express()
const db = new sqlite3.Database('recipes.db');

app.use(bodyParser.json())

// create a table for recipes if it doesn't exist
db.serialize( () => {
    db.run("CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY, name TEXT, ingredients TEXT, instructions TEXT)")
})

// get (read) a list of all recipes
app.get('/recipes', (req, res) => {
    db.all('SELECT * FROM recipes', (err, rows) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    })
})

// create a new recipe
app.post('/recipes', (req, res) => {
    const { name, ingredients, instructions } = req.body;

    // insert the provided data into the 'recipes' table
    db.run('INSERT INTO recipes (name, ingredients, instructions) VALUES (?, ?, ?)', [name, ingredients, instructions], function(err){
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json({ id: this.lastID}) //respond with the ID of the newly created recipe
    })
})

// start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})