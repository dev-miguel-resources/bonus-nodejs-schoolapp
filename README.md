
## Instalación en local
  
 2. Para importar base de datos (desde MongoDB con Robo 3T)
    - Hacer *New Connection* (**Hostname:** localhost, **Port:** 27017)
    - Hacer *Create Database* (proyecto-node)
    - Dentro de la base de datos crear 3 *collections* (curso_ests, cursos, usuarios)
    - Dentro de cada collection, en la barra de herramientas buscar *Collection -> copiar la data de los json del proyecto en dichas colecciones
    
 
` 3. **Instalar las dependencias:** En la consola (ubicarse en la raíz del proyecto)  
 
```
$ npm install
```
4. Ejecutar Proyecto

```
$ nodemon app -e js,hbs
```
5. En el navegador:    `localhost:3000
