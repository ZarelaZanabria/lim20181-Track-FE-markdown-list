//Aqui es donde vamos a crear la funcion mdlink(path,options
//Desde este archivo debes exportar una función (mdLinks)
const fs = require('fs');
const path = require('path');
const util = require('util');
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fetch = require('node-fetch');

//Array en donde se va almacenar los links del archivo markdown
let links = [];
//--------------------------------------------------------------------FUNCCION PARA OBTENER LOS LINKS DE UN ARCHIVO MARKDOWN
const readFileMarkdown = path => {
  let linksMd = [];
  const readMarkdown = fs.readFileSync(path, 'utf-8');
  const RegExpLink = /!*\[(.*)\]\((.*)\)/gi;
  let urlLinks = readMarkdown.match(RegExpLink);
  const textLink = /\[(.*)\]/gi
  const urlLink = /\]\((.*?|(https?|http?|ftp):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-]))\)/gi;;
  for (let i = 0; i < urlLinks.length; i++) {
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
       /* console.log(links)  */
    }
  }

});

const miPrimeraPromise = new Promise((resolve, reject) => {
   setTimeout(function () {
    resolve(links); 
  }, 1000);
});

miPrimeraPromise.then((successMessage) => {
    console.log(successMessage); 
 
}); 

  checkIfFileOrFolder('./example');


