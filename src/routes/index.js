const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const bcrypt = require('bcrypt')
const funciones = require('./../funciones')
const sgMail = require('@sendgrid/mail');

//importando modelos
const Usuario = require('./../models/usuarios');
const Curso = require('./../models/listado-de-cursos');
const Curso_est = require('./../models/registrados-curso');
const Tareas = require('./../models/tareas');
const Tareas_est = require('./../models/tarea_est');

const dir_views = path.join(__dirname, '../../views');
const directorio_partials = path.join(__dirname, '../../partials');

app.set('view engine', 'hbs');
app.set('views', dir_views);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
hbs.registerPartials(directorio_partials);
require('./../helpers')

const aja = () => {
    return req.session.documento;
}

app.get('/', (req, res) => {

    if (req.session.documento) {
        res.redirect('/principal');
    }
    res.render('index');
});

app.get('/mis-cursos', (req, res) => {
    Curso_est.find({ //listar cursos del estudiante
        id_est: req.session.documento
    }).exec(function(err, res1) {
        if (err) {
            console.log(err);
        }

        Curso.find({}).exec(function(err, res2) {
            if (err) {
                console.log(err);
            }
            res.render('aspirante/mis-cursos', {
                cursos_est: res1,
                cursos: res2
            });
        });

    });
});

app.post('/dar_baja_curso', (req, res) => {
    let id_curso = req.body.id;
    curs = [];
    Curso_est.find({ //validar que se encuentra inscrito
        id_est: req.session.documento,
        id_curso: id_curso
    }).exec(function(err, res1) {
        if (err) {
            console.log(err);
        }
        if (!res1.length) {
            Curso_est.find({ //listar cursos del estudiante
                id_est: req.session.documento
            }).exec(function(err, res1) {
                if (err) {
                    console.log(err);
                }

                res1.forEach(curso => {
                    Curso.find({ //listar cursos del estudiante
                        id: curso.id_curso,
                    }).exec(function(err, res2) {
                        if (err) {
                            console.log(err);
                        }
                        curs.push(res2[0]);
                    });
                });
                res.render('aspirante/mis-cursos', {
                    cursos: curs,
                    error: "no estás registrado en este curso"
                });
            });
        } else {
            Curso_est.findOneAndDelete({ id_curso: id_curso, id_est: req.session.documento }, req.body, (err, resultados) => {
                if (err) {
                    return console.log(err);
                }
                Curso_est.find({ //listar cursos del estudiante
                    id_est: req.session.documento
                }).exec(function(err, res1) {
                    if (err) {
                        console.log(err);
                    }

                    res1.forEach(curso => {
                        Curso.find({ //listar cursos del estudiante
                            id: curso.id_curso,
                        }).exec(function(err, res2) {
                            if (err) {
                                console.log(err);
                            }
                            console.log("hola " + res2[0]);
                            curs.push(res2[0]);
                        });
                    });
                    res.render('aspirante/mis-cursos', {
                        cursos: curs,
                        success: "cancelacion de curso exitosa"
                    });
                });
            });
        }
    });

});

app.post('/relacionar-curso', (req, res) => {

    let id = req.body.id;
    console.log(id);
    Curso_est.find({ id_curso: id, id_est: req.session.documento }).exec((err, val) => { //si el estudiante no se había registrado antes
        if (err) {
            return console.log(err);
        }
        if (val.length) {
            res.render('aspirante/inscribir-curso', {
                error: "Ya se registró antes a este curso"
            });
        } else {

            Curso.find({ id: id }).exec((err, validar) => { //si el curso existe
                if (err) {
                    return console.log(err);
                }
                if (!validar.length) {
                    res.render('aspirante/inscribir-curso', {
                        error: "El curso no existe"
                    });
                } else {

                    //registrarse
                    let nuevo = new Curso_est({
                        id_est: req.session.documento,
                        id_curso: id,
                    });

                    nuevo.save((err, resultado) => {
                        if (err) return false;
                        res.render('aspirante/inscribir-curso', {
                            success: "Registro de Curso exitoso"
                        });
                    });

                }
            });
        }
    });
});

app.post('/iniciar', (req, res) => {
    let nombre = req.body.nombre;
    let rol = req.body.rol;
    let pass = bcrypt.hashSync(req.body.contrase, 10);
    Usuario.findOne({
        nombre: nombre,
        rol: rol
    }).exec(function(err, validar_repetido) {
        if (err) {
            console.log(err);
        }
        if (!validar_repetido) {
            res.render('index', {
                error: "El usuario no existe"
            });
        } else {
            if (!bcrypt.compareSync(req.body.contrase, validar_repetido.password)) {
                res.render('index', {
                    error: "Contraseña incorrecta"
                });
            } else {

                req.session.nombre = validar_repetido.nombre;
                req.session.documento = validar_repetido.documento;
                req.session.correo = validar_repetido.correo;
                req.session.telefono = validar_repetido.telefono;
                req.session.rol = validar_repetido.rol;
                res.redirect('/principal');
            }
        }
    });
});

app.post('/registrar-curso', (req, res) => {
    let id_curso = req.body.id_curso;
    let nombre = req.body.nombre;
    let valor = req.body.valor;
    let descripcion = req.body.descripcion;
    let modalidad = req.body.modalidad;
    let intensidad = req.body.intensidad;

    //validar existencia
    Curso.find({
        id: id_curso
    }).exec(function(err, resultado) {
        if (err) {
            console.log(err);
        }

        if (resultado.length) {
            res.render('index', {
                error: "El curso ya existe"
            });
        } else {

            funciones.registrar_nuevo_curso(id_curso, nombre, valor, descripcion, modalidad, intensidad);
            res.render('coordinador/crear-curso', {
                success: "Curso registrado con exito"
            });
        }

    });
});

app.post('/registrar-user', (req, res) => {

    let documento = req.body.documento;
    let correo = req.body.correo;
    let nombre = req.body.nombre;
    let telefono = req.body.telefono;
    let pass = bcrypt.hashSync(req.body.contra, 10);
    Usuario.find({
        documento: documento
    }).exec(function(err, resultado) {
        if (err) {
            console.log(err);
        }

        if (resultado.length) {
            res.render('index', {
                error: "Ya existe este usuario"
            });
        } else {

            funciones.registrar_usuario(documento, correo, nombre, telefono, pass);

            req.session.documento = documento;
            req.session.nombre = nombre;
            req.session.correo = correo;
            req.session.telefono = telefono;
            req.session.rol = 'aspirante';

            //enviar correo para el Registro
            const msg = {
                to: correo,
                from: 'ingenieromiguelch@gmail.com',
                subject: 'Bienvenido',
                text: 'Bienvenido a la Plataforma de Educación Contínua :D'
            };
            sgMail.send(msg);

            res.redirect('/principal');
        }

    });

});

app.get('/principal', (req, res) => {
    if (req.session.rol == 'aspirante') {
        res.render('aspirante/index-aspirante', {
            nombre: req.session.nombre
        });
    } else if (req.session.rol == 'coordinador') {
        res.render('coordinador/index-coordinador', {
            nombre: req.session.nombre
        });
    } else {
        //cargar info de los cursos del docente y estudiante inscritos
        Curso.find({ docente_encargado_nombre: req.session.nombre }).exec((err, respuesta1) => {
            if (err) {
                return console.log(err);
            }

            Usuario.find({}).exec((err, respuesta2) => {
                if (err) {
                    return console.log(err);
                }

                Curso_est.find({}).exec((err, respuesta3) => {
                    if (err) {
                        return console.log(err);
                    }

                    res.render('docente/index-docente', {
                        cursos: respuesta1,
                        usuarios: respuesta2,
                        cursos_est: respuesta3
                    });
                });
            });

        });
    }

});

app.get('/inscribir-curso', (req, res) => { //cargar vista registrar curso
    res.render('aspirante/inscribir-curso');
});

app.get('/ver-cursos', (req, res) => {

    Curso.find({}).exec((err, respuesta) => {
        if (err) {
            return console.log(err);
        }

        if (!req.session.rol) {
            res.render('ver-cursos', {
                cursos: respuesta
            });
        } else if (req.session.rol == 'aspirante') {
            res.render('aspirante/ver-cursos', {
                cursos: respuesta
            });
        } else {
            Usuario.find({ rol: 'docente' }).exec((err, respuesta2) => {
                if (err) {
                    return console.log(err);
                }
                res.render('coordinador/ver-cursos', {
                    cursos: respuesta,
                    docentes: respuesta2
                });
            });
        }

    });
});

app.post('/cerrarCurso', (req, res) => { //cerrar un curso que está disponible; recibe una url tipo (http://localhost:3000/cerrarCurso?id_curso=4)

    let id_curso = req.body.id_curso;
    let id_doc = req.body.id_doc;
    console.log(id_curso + " " + id_doc);
    Curso.findOneAndUpdate({ id: id_curso }, { $set: { estado: 'cancelado', docente_encargado_nombre: id_doc } }, { new: true }, (err, resultados) => {
        if (err) {
            return console.log(err);
        }
        res.render('coordinador/index-coordinador', {
            success: "El curso se ha cancelado",
            nombre: req.session.nombre
        });
    });
});

app.get('/eliminar-user-curso', (req, res) => {
    let documento = req.query.documento;
    let id_curso = req.query.id_curso;

    Curso_est.findOneAndDelete({ id_curso: id_curso, id_est: documento }, req.body, (err, resultados) => {
        if (err) {
            return console.log(err);
        }
        res.render('coordinador/index-coordinador', {
            success: "Se ha liberado un cupo"
        });
    });
});

app.get('/registrarse', (req, res) => { //cargar vista registrarse
    res.render('registrarse');
});

app.get('/ini', (req, res) => {
    res.render('ini');
});

app.get('/crear-curso', (req, res) => {
    res.render('coordinador/crear-curso');
});

app.get('/inscritos', (req, res) => {

    Curso.find({}).exec((err, respuesta1) => {
        if (err) {
            return console.log(err);
        }

        Usuario.find({}).exec((err, respuesta2) => {
            if (err) {
                return console.log(err);
            }

            Curso_est.find({}).exec((err, respuesta3) => {
                if (err) {
                    return console.log(err);
                }

                res.render('coordinador/inscritos', {
                    cursos: respuesta1,
                    usuarios: respuesta2,
                    cursos_est: respuesta3
                });
            });
        });

    });

});

app.get('/cambiar-rol', (req, res) => {

    Usuario.find({}).exec((err, respuesta) => {
        if (err) {
            return console.log(err);
        }
        res.render('coordinador/roles', {
            usuarios: respuesta
        });
    });

});

app.post('/cambiar-rol-user', (req, res) => {
    let documento = req.body.documento;
    let rol = req.body.rol;
    if (req.session.documento == documento) {
        res.render('coordinador/index-coordinador', {
            error: 'Tu no puedes cambiar de rol'
        })
    } else {
        funciones.cambiar_rol(documento, rol);
        res.render('coordinador/index-coordinador', {
            success: 'El usuario ha sido cambiado de rol exitosamente'
        })
    }

});

app.get('/entorno-de-trabajo', (req, res) => {


    let id_curso = req.query.curso;
    Curso.findOne({ id: id_curso }).exec((err, respuesta) => {
        if (err) {
            return console.log(err);
        }
        if (req.session.rol == 'aspirante') {
            res.render('aspirante/entorno-de-trabajo', {
                nombrecurso: respuesta.nombre,
                idcurso: respuesta.id
            });
        } else { //como docente
            res.render('docente/entorno-de-trabajo', {
                nombrecurso: respuesta.nombre,
                idcurso: respuesta.id
            });
        }
    });

});


app.get('/cerrar', (req, res) => {
    req.session.documento = null;
    req.session.nombre = null;
    req.session.correo = null;
    req.session.telefono = null;
    req.session.rol = null
    res.redirect('/');
});

app.get('*', (req, res) => {
    res.render('errors', {
        estudiante: 'error'
    })
});


module.exports = app