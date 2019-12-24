const hbs = require ('hbs');
const funciones = require('./funciones')

/*Mostrar lista de cursos (solo los disponiles)*/
hbs.registerHelper('ver-cursos-disponibles', (cursos)=>{
  let texto = '<table class: "table table-striped table-hover" width=700px>'+
               '<thead class= "thead black">'+
               '<th>id</th>'+
               '<th>nombre</th>'+
               '<th>valor</th>'+
               '<th>descripcion</th>'+
               '<th>modalidad</th>'+
               '<th>intensidad</th>'+
               '<th>docente asignado</th>'+
               '</thead>'+
               '<tbody>';

   cursos.forEach(curso => {
     if(curso.estado=='disponible'){
     texto = texto +
     '<tr>'+
     '<td>'+curso.id+'</td>'+
     '<td>'+curso.nombre+'</td>'+
     '<td>'+curso.valor+'</td>'+
     '<td>'+curso.descripcion+'</td>'+
     '<td>'+curso.modalidad+'</td>'+
     '<td>'+curso.intensidad+'</td>'+
     '<td>'+curso.docente_encargado_nombre+'</td>'+
     '</tr>';
   }
 });

   texto = texto + '</tbody> </table>';
   return texto;
});


hbs.registerHelper('mis-cursos-listar', ( cursos_est, cursos)=>{

  let texto = '<table class: "table table-striped table-hover" width=700px>'+
               '<thead class= "thead black">'+
               '<th>id</th>'+
               '<th>nombre</th>'+
               '<th>valor</th>'+
               '<th>descripcion</th>'+
               '<th>modalidad</th>'+
               '<th>intensidad</th>'+
               '<th>docente asignado</th>'+
               '<th>Opciones</th>'+
               '</thead>'+
               '<tbody>';
   cursos_est.forEach(ce => {

     let curso = cursos.find( c =>(c.id== ce.id_curso));
     texto = texto +
     '<tr>'+
     '<td>'+curso.id+'</td>'+
     '<td>'+curso.nombre+'</td>'+
     '<td>'+curso.valor+'</td>'+
     '<td>'+curso.descripcion+'</td>'+
     '<td>'+curso.modalidad+'</td>'+
     '<td>'+curso.intensidad+'</td>'+
     '<td>'+curso.docente_encargado_nombre+'</td>'+
     '<td><a href="/entorno-de-trabajo?curso='+curso.id+'">Entrar al curso</a></td>'+
     '</tr>';

  });

   texto = texto + '</tbody> </table>';
   return texto;


});


hbs.registerHelper('ver-todos-los-cursos', (cursos)=>{
  let texto = '<table class: "table table-striped table-hover" width=700px>'+
               '<thead class= "thead black" >'+
               '<th>id</th>'+
               '<th>nombre</th>'+
               '<th>valor</th>'+
               '<th>descripcion</th>'+
               '<th>modalidad</th>'+
               '<th>intensidad</th>'+
               '<th>estado</th>'+
               '<th>docente asignado</th>'+
               '</thead>'+
               '<tbody>';

   cursos.forEach(curso => {
     texto = texto +
     '<tr>'+
     '<td>'+curso.id+'</td>'+
     '<td>'+curso.nombre+'</td>'+
     '<td>'+curso.valor+'</td>'+
     '<td>'+curso.descripcion+'</td>'+
     '<td>'+curso.modalidad+'</td>'+
     '<td>'+curso.intensidad+'</td>'+
     '<td>'+curso.estado+'</td>'+
     '<td>'+curso.docente_encargado_nombre+'</td>';

     texto = texto + '</tr>';
   });

   texto = texto + '</tbody> </table>';
   return texto;
});

hbs.registerHelper('ver-inscritos', (cursos, usuarios, usuarios_curso)=>{ //ver inscritos a los cursos

  let texto = '';
  if(!usuarios_curso.length)texto = 'No hay Estudiantes Registrados en los Cursos';
  else{
  cursos.forEach(curso=>{

    if(curso.estado=='disponible'){
    let usuarios_act = usuarios_curso.filter(user => (user.id_curso == curso.id));
    if(usuarios_act.length>0){

      texto = texto + '<h3>Para el curso "'+curso.nombre+'"</h3><br>';
      usuarios_act.forEach(user=>{ //recorrer cada usuario
      let usuario_aux = usuarios.find( user2 =>(user2.documento == user.id_est));
      texto = texto + '<p><strong>Nombre del Usuario</strong>: '+ usuario_aux.nombre +
              '  <a href="/eliminar-user-curso?documento='+usuario_aux.documento+
              '&id_curso='+curso.id+'">(Eliminar de este curso)</a>'+'</p><br>';  //dar de baja a un estudiante
      });
      texto = texto+ '<br><br>';
    }
  }
  });

}

  return texto;
});

hbs.registerHelper('listar-estudiantes-select', (usuarios)=>{ //ver usuarios
  let texto ='';
  usuarios.forEach(user=>{
    texto = texto + '<option value="'+user.documento+'">'+user.nombre+' ('+user.rol+')</option>';
  });

  return texto;
});

hbs.registerHelper('nombres-de-los-cursos', (cursos)=>{ //ver usuarios
  let texto ='';
  cursos.forEach(curso=>{
    if(curso.estado=='disponible'){
    texto = texto + '<option value="'+curso.id+'">'+curso.nombre+'</option>';
  }
  });

  return texto;
});

hbs.registerHelper('nombre-docentes', (docentes)=>{ //ver usuarios
  let texto ='';
  docentes.forEach(user=>{
    texto = texto + '<option value="'+user.nombre+'">'+user.nombre+'</option>';
  });

  return texto;
});

hbs.registerHelper('ver-cursos-del-docente', (cursos, usuarios, usuarios_curso)=>{ //ver inscritos a los cursos

  let texto = '';
  if(!cursos.length)texto = 'El docente no tiene cursos encargados';
  else{
  cursos.forEach(curso=>{
    texto = texto + '<h3>Para el curso "'+curso.nombre+'"</h3><br>';
    texto = texto +'<p><strong>Curso id: </strong>'+curso.id+
    '<br> <strong>valor del curso: </strong>'+curso.valor+
    '<br> <strong>descripcion: </strong>'+curso.descripcion+
    '<br> <strong>modalidad: </strong>'+curso.modalidad+
    '<br> <strong>intensidad: </strong>'+curso.intensidad+
    '<br> <a href="/entorno-de-trabajo?curso='+curso.id+'">Entrar al curso</a>'+
    '</p>';
    let usuarios_act = usuarios_curso.filter(user => (user.id_curso == curso.id));
    if(usuarios_act.length>0){
      texto = texto + '<h5>Estudiantes Inscritos:</h5><br>';
      texto = texto + '<table class: "table table-striped table-hover" width=700px>'+
                   '<thead class= "thead black" >'+
                   '<th>Nombre del Usuario</th>'+
                   '<th>Correo</th>'+
                   '<th>Telefono</th>'+
                   '</thead>'+
                   '<tbody>';
      usuarios_act.forEach(user=>{ //recorrer cada usuario
      let usuario_aux = usuarios.find( user2 =>(user2.documento == user.id_est));
      texto = texto + '<tr>'+
      '<td>'+usuario_aux.nombre+'</td>'+
      '<td>'+usuario_aux.correo+'</td>'+
      '<td>'+usuario_aux.telefono+'</td>'+
      '</tr>';
      });
      texto = texto+ '</tbody> </table><br>';
    }
  });

}

  return texto;
});
