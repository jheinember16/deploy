const { Router } = require("express");
const router = Router();
const { Videogame} = require("../db.js");


router.post("", async (req, res) => {

    const {
        name,
        description,
        platforms
    } = req.body
    
    const videojuegoPrueba = await Videogame.create({
        name,
        description,
        platforms
    });

    res.status(200).send("videojuego creado ")
})

module.exports = router;
