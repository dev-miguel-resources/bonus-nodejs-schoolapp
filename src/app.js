////PARA EJECUTAR   //nodemon app -e js,hbs
require ('./config/config')
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session =  require('express-session')

const directorio_publico = path.join(__dirname, '../public');

const directorio_node_modules =  path.join(__dirname, '../node_modules');

app.use(express.static(directorio_publico))
app.use(bodyParser.urlencoded({ extended : false }));

app.use(session({
  secret: 'fariseos again',
  resave: false,
  saveUninitialized: true
}))

app.use(require('./routes/index'));
//app.use((req, res, next))

/*mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resultado)=>{
  if(err){
    return console.log(err)
  }
  console.log('estás conectado')
});*/

mongoose.connect('mongodb://localhost:27017/proyecto-node', {useNewUrlParser: true}, (err, resultado)=>{
  if(err){
    return console.log(err)
  }
  console.log('Conectado a la base de datos :3')
});

app.listen(process.env.PORT, ()=>{
  console.log("Escuchando en el Puerto 3000 :3");
});
