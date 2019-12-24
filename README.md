# Educación Contínua
Proyecto del curso de NodeJS acerca de la dependencia de educación continua del Tecnológico de Antioquia (Sprint 3)

**Link en Heroku:** https://proyecto-node-js-ufps.herokuapp.com/

## Instalación en local
 
 Prerequisito: Instalar nodeJS, npm, MongoDB y MongoDB Compass (de preferencia).
 
 1. Clonar proyecto de este repositorio
 
 2. Para importar base de datos (desde MongoDB Compass)
    - Hacer *New Connection* (**Hostname:** localhost, **Port:** 27017)
    - Hacer *Create Database* (No es necesario llenar el campo de Collection Name)
    - Dentro de la base de datos crear 3 *collections* (curso_ests, cursos, usuarios)
    - Dentro de cada collection, en la barra de herramientas buscar *Collection -> Import Data*
    - Importar los 3 archivos *.JSON* que están en la carpeta collections de este repositorio
    
 
 3. **Instalar las dependencias:** En la consola (ubicarse en la raíz del proyecto)  
 
```
$ npm install
```
4. Ejecutar Proyecto

```
$ nodemon app -e js,hbs
```
5. En el navegador:    `localhost:3000`
