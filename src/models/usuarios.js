const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre : {
    type : String,
    require : true
  },
  documento: {
    type : String,
    require : true
  },
  telefono : {
    type : String,
    require : true
  },
  correo : {
    type : String,
    require : true,
    trim : true
  },
  rol : {
    type : String,
    require : true
  },
  password : {
    type : String,
    require : true
  }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario
