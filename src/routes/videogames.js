const { Router } = require("express");
const {
  getTotalInfo,
  getDbInfoByPk,
  getApiInfoByPk,
  getNamedGames,
} = require("../controllers/videogameController");
require("dotenv").config();

const router = Router();

router.get("/", async (req, res) => {
  const { name } = req.query;
  try {
    const videogamesTotal = await getTotalInfo()
    const gameName = await getNamedGames(name)
    if (name) {
      const videogamesName = await gameName.filter(x =>
        // x.name nombre del videojuego
        x.name.toLowerCase().includes(name.toLowerCase()))
        videogamesName.length
        ? res.status(200).send(videogamesName)
        : res.status(404).send("No se encuentra ningun videojuego");
      
    } else {
      res.status(200).send(videogamesTotal);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (id.length > 10) {
    const dbInfo = await getDbInfoByPk(id);
    if (dbInfo) {
      res.json(dbInfo);
    } else {
      res.json("Error");
    }
  } else {
    const apiInfo = await getApiInfoByPk(id);
    if (apiInfo) {
      res.json(apiInfo);
    } else {
      res.json("Error");
    }
  }
});

module.exports = router;
