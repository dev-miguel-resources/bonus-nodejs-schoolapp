const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tareas_Schema = new Schema({
  id : {
    type : String,
    require : true
  },
  nombre : {
    type : String,
    require : true
  },
  descripcion : {
    type : String,
    require : true
  },
  fecha_limite : {
    type : Date,
    require : true
  },
  id_curso : { //curso al que pertenece la tarea
    type : Date,
    require : true
  },
  id_docente : { //docente que crea la tarea
    type : Date,
    require : true
  }
});

const Tareas = mongoose.model('Tarea', tareas_Schema);

module.exports = Tareas
