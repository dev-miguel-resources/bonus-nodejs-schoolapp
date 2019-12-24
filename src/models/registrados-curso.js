const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const curso_estSchema = new Schema({
  id_est : {
    type : String,
    require : true
  },
  id_curso : {
    type : String,
    require : true
  }
});

const Curso_est = mongoose.model('Curso_est', curso_estSchema);

module.exports = Curso_est
