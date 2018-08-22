//Aqui es donde vamos a crear la funcion mdlink(path,options
//Desde este archivo debes exportar una función (mdLinks)
const fs = require('fs');
const path = require('path');
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fetch = require('node-fetch');
//Array en donde se va almacenar los links del archivo markdown
let links = [];

//--------------------------------------------------------------------FUNCCION PARA OBTENER LOS LINKS DE UN ARCHIVO MARKDOWN
const readFileMarkdown = path => {
  let linksMd = [];
  const readMarkdown = fs.readFileSync(path, 'utf-8');
  /*   i por lo que las mayúsculas serán ignoradas
  Mediante una expresión regular le decimos que extraiga los linksMd node
  que esten dentro de los corchetes y los parentesis */
  const RegExpLink = /!*\[(.*)\]\((.*)\)/gi;
  let urlLinks = readMarkdown.match(RegExpLink);
  // Solo lo que se encuentre dentro de los corchetes
  /*    const textLink = /\[(\w+.+?)\]/gi ; */
  const textLink = /\[(.*)\]/gi
  // Solo lo que se encuentre dentro de los parentesis
  const urlLink = /\]\((.*?|(https?|http?|ftp):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-]))\)/gi;;
  for (let i = 0; i < urlLinks.length; i++) {
    /* console.log(urlLinks[i]) */
    //subtring permite tener una cantidad de caracteres de una posicion (1,5) hasta otra 
    /* Este codigo permite sacar los corchetes o parentesis de los link o text
     match(urlLink)[0].match(urlLink)[0].substring(1, urlLinks[i].match(urlLink)[0].length - 1);   */
    let textLinkMarkdown = urlLinks[i].match(textLink)[0].substring(1, urlLinks[i].match(textLink)[0].length - 1);
    let urlLinkMarkdown = urlLinks[i].match(urlLink)[0].match(urlLink)[0].substring(2, urlLinks[i].match(urlLink)[0].length - 1);
    //Este codigo permite agregar al array un objetos con las siguientes propiedades
    linksMd.push({
      text: textLinkMarkdown,
      href: urlLinkMarkdown,
      file: path

    });
  }
  return linksMd; // linksMd guardamos el array de objetos con los linksMd
}

//-----------------------------------------------------------------------------------------FUNCION PARA CONVETIR UN RUTA RELATIVA A ABSOLUTA
const convertRelativeAbsolute = fileName => {
  if (path.isAbsolute(fileName)) {
    return fileName = fileName.toString();
  } else {
    return fileName = process.cwd().toString() + fileName.substr(fileName.indexOf('/'));
  }
}
//-------------------------------------------------------------------------------------------FUNCION VERIFICA SI ES UN DIRECTORIO O CARPETA
const checkIfFileOrFolder = path => fs.stat(path, (error, stats) => {
  if (error) {
    console.log(error);
    //https://www.tutorialspoint.com/nodejs/nodejs_process.htm 
    process.exit(1);
  }
  else {
    if (stats.isDirectory()) {

      fs.readdir(path, 'utf8', (error, files) => {
        if (error) {
          console.log(error);
        } else {
          for (const fileName in files) {
            const element = files[fileName]
            /*  Si cuando recorre encuentra un directorio tiene que empezar
             de nuevo a validar  */
            checkIfFileOrFolder(path + '/' + element);
          }
        }
      })
    } else if (stats.isFile() && path.indexOf('.md', -3) >= 0) {
      /* Concatenamos por que vamos a obtener todos los links de 
        los archivos markdown encontrados */
      /* links = links.concat(readFile(path)) */
      links = links.concat(readFileMarkdown(path))
       console.log (links) 

    }
  }
});

//-----------------------------------------------------------FUNCION PARA VALIDAR LINKS ASINCRONO CON NODE-FECTH 

const validateLinks = (linksMark, callback) => {
  let linkMarkdValidate = [];

  
  linksMark.map(element => console.log (element.href));

  // esperando la respuesta de todas las promesas
  setTimeout(() => callback(linkMarkdValidate), 5000);
};

/* 
fetch('http://jsonplaceholder.typicode.com/posts/1')
.then(function(response){
    return response.json();
})
.then(function(json){
    console.log(json);
});
 */
/* module.exports = mdLinks; */

//---------------------------------------------------------------FUNCION PARA VALIDAR UN LINK CALLBACK
const  validateLinkOk=(url,callback)=> {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.addEventListener("load", () =>{
    if (req.status >= 200 && req.status < 400) {
      callback(null, { url })
    } else {
      console.error(req.status + " " + req.statusText);
    }
  });
  req.addEventListener("error", ()=>{
    callback({ error: true, url })
  });
  req.send(null);
} 



/* linkFileMarkdown.forEach(element => {  
  validateLink(element.href, (error, respuesta) => {
    if (error) {
      console.log( error.url + 'fail' );      
    } else{
      console.log( respuesta.url + ' ok  ');      
    }
  }); 
   
});*/
/* 
console.log(checkIfFileOrFolder('F:\\Zarela Data\\NPm\\example')) */
console.log(checkIfFileOrFolder('./example'))