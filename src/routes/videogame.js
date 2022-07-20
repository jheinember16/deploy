const { Router } = require("express");
const router = Router();
const { Videogame, Genre } = require("../db.js");


router.post("/", async (req, res) => {
  // recibir los datos y separarlos
    const { 
            name,
            description,
            released,
            rating,
            image,
            platforms,
            genres, 
          } = req.body;

    if (!name || !description || !platforms)
      res.status(400).json({ msg: "Faltan datos" });
      
    const videogameCreated = await Videogame.create({
      name,
      description,
      released,
      rating,
      image,
      platforms,
    });

    const genreDb = await Genre.findAll({
      where: { name : genres}
    });
    
    videogameCreated.addGenre(genreDb)
    res.status(200).send("Videojuego Creado Exitosamente !!")
    
 
  
});

        
module.exports = router;
