const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tarea_est_Schema = new Schema({
  id_tarea : {
    type : String,
    require : true
  },
  id_est : {
    type : String,
    require : true
  },
  archivo : {
    type : String,
    require : true,
    default : "sin subir"
  }
});

const Tareas_est = mongoose.model('Tarea_est', tarea_est_Schema);

module.exports = Tareas_est
