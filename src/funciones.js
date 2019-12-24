const Usuario = require('./models/usuarios');
const Curso = require('./models/listado-de-cursos');
const Curso_est = require('./models/registrados-curso');


const validar_existencia_curso = (id) =>{
  listando_cursos();
  let duplicado = lista_cursos.find( curso =>(curso.id == id));
  return duplicado;
}

const registrar_nuevo_c
urso = (id_curso, nombre, valor, descripcion, modalidad, intensidad) =>{

  let nuevo_curso = new Curso({
    id:id_curso,
    nombre:nombre,
    valor:valor,
    descripcion:descripcion,
    modalidad:modalidad,
    intensidad:intensidad,
    estado:'disponible'
  });

  nuevo_curso.save((err, resultado) => {
    if(err)console.log(err);
  });
}

const registrar_usuario = (documento, correo, nombre, telefono, pass) =>{
  let aspirante = new Usuario({
    documento : documento,
    telefono : telefono,
    correo : correo,
    nombre : nombre,
    rol : 'aspirante',
    password : pass
  });
  aspirante.save((err, resultado) => {
    if(err)return false;
    //console.log(resultado);
  });
}


const cambiar_rol=(documento, rol) =>{

  Usuario.update(
  {documento:documento},
  {rol:rol}
  ).then((rawResponse) => {
   return true;
  })
  .catch((err) => {
      return console.log(err);
  });
}

module.exports = {
  registrar_usuario,
  validar_existencia_curso,
  cambiar_rol
};
