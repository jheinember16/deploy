const { Router } = require("express");
const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;
const { Genre } = require("../db");

const router = Router();

router.get("/", async (req, res) => {
  //try{  
    const genresApi = await axios.get(
        `https://api.rawg.io/api/genres?key=${API_KEY}`
    )

    const genres = await genresApi.data.results.map((x) => {
        return [x.name]
    })

    const eachGenre = genres.map(g => {
        for(let i = 0; i<genres.length; i++)
            return g[i]
    })
    
    eachGenre.forEach(x => {    
        Genre.findOrCreate({
          where: { 
            name: x 
            }
        })
    })
    const allGenres = await Genre.findAll()
    res.send(allGenres)
})

module.exports = router;
