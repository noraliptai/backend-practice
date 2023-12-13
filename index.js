/* IMPORTS */
const express = require('express')
const path = require('path')
const fs = require('fs')
const { ok } = require('assert')

/* app néven elindítjuk az express modulunkat */
const app = express()
/* meghatározzuk a port változót */
const port = 3000

/* middleware, ami parse-olja a json-t -> ehhez a requestnél be kell állítani a headers-ben a Content-Type: application/json */
app.use(express.json())

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

app.post('/users/new-user', (req, res) => {
    /* A beérkezett adat a req.body-ban van */
    const newUserData = req.body

    /* Beolvassuk a jelenlegi users.json-t, hibakezeléssel */
    fs.readFile(path.join(__dirname, '/data/users.json'), "utf8", (err, data) => {
        if (err) {
            console.log("error reading file", err)
            res.status(500).json("error reading file")
        } else {
            /* Átalakítjuk a beolvasott stringet jsonné */
            const users = JSON.parse(data)
            /* Új user objektum létrehozása */
            const newUser = {
                id: users[users.length - 1].id + 1,
                name: newUserData.name
            }
            /* Betesszük az új usert az users arraybe */
            users.push(newUser)
            /* Beírjuk a users.json-be a kibővített users arrayt, hibakezeléssel */
            fs.writeFile(path.join(__dirname, '/data/users.json'), JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.log(`error at writing file: ${err}`)
                    res.json(`error at writing file: ${err}`)
                } else {
                    console.log("file writing was successful")
                    res.status(201).json(newUser)
                }
            })
        }
    })
})

app.delete('/users/delete/:userid', (req, res) => {
    fs.readFile(path.join(__dirname, '/data/users.json'), "utf8", (err, data) => {
        if (err) {
            console.log(`error at reading file: ${err}`)
            res.json(err)
        } else {
            const users = JSON.parse(data)
            const newUsers = users.filter(user => user.id !== req.body.id)
            const deletedUser = users.filter(user => user.id === req.body.id)

            if (deletedUser) {
                fs.writeFile(path.join(__dirname, '/data/users.json'), JSON.stringify(newUsers, null, 2), (err) => {
                    if (err) {
                      console.log(`error writing file: ${err}`)
                      res.status(500).json(err)  
                    } else {
                        console.log(`deleted user: ${deletedUser.id}, deleted data: ${JSON.stringify(deletedUser)}`)
                        res.status(200).json(`deleted user: ${deletedUser.id}, deleted data: ${JSON.stringify(deletedUser)}`)
                    }
                })
            } else {
                console.log(`user: ${req.body.id} not found`)
                res.json(`user: ${req.body.id} not found`)
            }
        }
    })
    res.json('ok')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})