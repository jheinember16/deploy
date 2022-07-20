require("dotenv").config();
const { Router } = require("express");
const axios = require("axios");
const { API_KEY } = process.env;
const { Videogame, Genre } = require("../db");

///////////// DATOS API ///////////////////////
const getApiInfo = async () => {
  const api = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}`);
  const segundoLlamado = await axios.get(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=2`
  );
  const tercerLlamado = await axios.get(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=3`
  );
  const cuartoLlamado = await axios.get(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=4`
  );
  const quintoLlamado = await axios.get(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=5`
  );

  const totalLlamados = [
    ...api.data.results,
    ...segundoLlamado.data.results,
    ...tercerLlamado.data.results,
    ...cuartoLlamado.data.results,
    ...quintoLlamado.data.results,
  ];
  const resultadoTotal = await Promise.all(totalLlamados);

  const formatoApi = resultadoTotal.map((x) => {
    return {
      id: x.id,
      name: x.name,
      released: x.released,
      rating: x.rating,
      image: x.background_image,
      platforms: x.platforms === null
          ? "No se encuentran plataformas disponibles para este juego"
          : x.platforms.map((x) => x.platform.name),
      genres: x.genres.map((x) => x.name),
    };
  });
  return formatoApi;
};
////// DATOS DB ////////////////
const getDbInfo = async () => {
  let videogamesDb =[]
  videogamesDb = await Videogame.findAll({
    include: [
      {
        model: Genre,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    ],
  })

  videogamesDb = videogamesDb.map(x => {
      return {
        id: x.id,
        name: x.name,
        released: x.released,
        rating: x.rating,
        description: x.description,
        image: x.image,
        platforms: x.platforms,
        genres: x.genres.map(x => x.name),
        createdInDb: x.createdInDb
      }
    }
   )
   return videogamesDb
}
const getTotalInfo = async () => {
  
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  const totalVideogames = apiInfo.concat(dbInfo);
  return totalVideogames
  
}

const getApiInfoByPk = async (id) => {
  const apiUrl = await axios.get(
    `https://api.rawg.io/api/games/${id}?key=${API_KEY}`)

  const apiInfo = apiUrl.data;
  const result = {
    id: apiInfo.id,
    name: apiInfo.name,
    description: apiInfo.description_raw,
    image: apiInfo.background_image,
    released: apiInfo.released,
    rating: apiInfo.rating,
    genres: apiInfo.genres.map((x) => x.name),
    platforms:
      apiInfo.platforms.length === 0
        ? "There are no platforms available for this game"
        : apiInfo.platforms.map((p) => p.platform.name),
  }
  return result;
}


const getDbInfoByPk = async (id) => {
  const idDB = await Videogame.findByPk(id, {include: Genre})
  const infoDBData = {
    id: idDB.id,
    name: idDB.name,
    description: idDB.description,
    image: idDB.image,
    released: idDB.released,
    rating: idDB.rating,
    genres: idDB.genres.map((x) => x.name),
    platforms: idDB.platforms
  }
  if(idDB){
    return infoDBData
  }
}

const getName = async (name) => {
    try {
        const apiReq = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`);
        const apiInfo = await apiReq.data.results.map(v => {
            return {
                id: v.id,
                name: v.name,
                released: v.released,
                rating: v.rating,
                image: v.background_image,
                genres: v.genres.map(v => v.name),
                platforms: v.platforms === null 
                ? 'There are no platforms available for this game' 
                : v.platforms.map(v => v.platform.name),
            }
        })
        return apiInfo.slice(0, 15)
    } catch (error) {
        return 'No results'
    }
}

const getNamedGames = async (name) => {
  const apiSearch = await getName(name);
  const dbInfo = await getDbInfo();
  const auxArr = await dbInfo.map(el => {
      return {
          id: el.id,
          name: el.name,
          description: el.description,
          released: el.released,
          image: el.image,
          rating: el.rating,
          genres: el.genres,
          platforms: el.platforms,
          createdInDb: el.createdInDb
      }
  })
  const allInfo = apiSearch.concat(auxArr);
  return allInfo;
}

module.exports = {
  getApiInfo,
  getDbInfo,
  getTotalInfo,
  getApiInfoByPk,
  getDbInfoByPk,
  getNamedGames,
};

