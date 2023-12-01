/* IMPORTS */
const express = require('express')
const path = require('path')
const fs = require('fs')

/* app néven elindítjuk az express modulunkat */
const app = express()
/* meghatározzuk a port változót */
const port = 3000

/* a port felkeresésekor (localhost:port/ vagy 127.0.0.1:port/) elküldjük az index.html fájlt */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/index.html'))
})

/* konkrét fájl elérési útvonalának megadása */
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/static/css/style.css'))
})

/* statikus mappa publikussá tétele */
app.use('/public', express.static(path.join(__dirname, '/frontend/static')))

app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, '/data/users.json'))
})

/* válasz küldése paraméter(id) szerint */
app.get('/users/:userid', (req, res) => {
    const id = parseInt(req.params.userid)

    /* megnézzük hogy számot küldtünk-e */
    if (isNaN(id)) {
        res.status(400).json({
            error: 400,
            message: "id must be a number!"
        })
    } else {
        /* ha szám, akkor beolvassuk a fájlt */
        fs.readFile(path.join(__dirname, '/data/users.json'), 'utf8', (err, rawData) => {
            if (err) {
                /* ha nem sikerül beolvasni a fájlt */
                res.status(500).json({
                    error: 500,
                    message: "file not found"
                })
            } else {
                const data = JSON.parse(rawData)
                const chosenUser = data.find(user => user.id === id)
                
                /* megnézzük hogy létezik-e ilyen id-vel adat */
                if (chosenUser) res.json(chosenUser)
                else res.status(404).json({
                    error: 404,
                    message: "id doesn't exist"
                })
            }
        })
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})