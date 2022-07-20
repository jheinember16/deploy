const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('genre', {
    // UUID - "5sx5-asd5-q89e-asd5"
    name: {
        type: DataTypes.STRING,
        unique: true,
      },
    });
  };