import express from "express";
import { PORT } from "./config.js"

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hola como te va</h1>')
})







app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
})

