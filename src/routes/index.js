const router = require('express').Router();

const videogamesRoute = require('./videogames');
const videogameRoute = require('./videogame');
const genresRoute = require('./genres');
const postmanRoute = require('./postman')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

router.use('/videogames', videogamesRoute);
router.use('/videogame', videogameRoute);
router.use('/genres', genresRoute);
router.use('/postman', postmanRoute)

module.exports = router;
