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

// start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})