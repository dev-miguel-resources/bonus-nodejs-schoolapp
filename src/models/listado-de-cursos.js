const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cursos_Schema = new Schema({
  id : {
    type : String,
    require : true
  },
  nombre : {
    type : String,
    require : true
  },
  valor : {
    type : String,
    require : true
  },
  descripcion : {
    type : String,
    require : true
  },
  modalidad: {
    type : String,
    require : true
  },
  intensidad : {
    type : String,
    require : true
  },
  estado : {
    type : String,
    require : true
  },
  docente_encargado_nombre : {
    type : String,
    default : "no asignado aun"
  }
});

const Cursos = mongoose.model('Curso', cursos_Schema);

module.exports = Cursos
