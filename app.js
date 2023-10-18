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

// update a recipe by its ID
app.put('/recipes/:id', (req, res) => {
    const { id } = req.params;
    const { name, ingredients, instructions } = req.body;

    // update the recipe in the 'recipes' table using the provided data and the recipe's ID
    db.run('UPDATE recipes SET name = ?, ingredients = ?, instructions = ? WHERE id = ?', [name, ingredients, instructions, id], (err) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json({message: 'Recipe updated'})
    })
})

// delete a recipe by its ID
app.delete('/recipes/:id', (req, res) => {
    const { id } = req.params;

    //delete the recipe from the 'recipes' table by its ID
    db.run('DELETE FROM recipes WHERE id = ?', id, (err) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json({message: 'Recipe deleted'});
    })
})

// start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})