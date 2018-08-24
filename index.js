//Aqui es donde vamos a crear la funcion mdlink(path,options
//Desde este archivo debes exportar una función (mdLinks)
const fs = require('fs');
const path = require('path');
const util = require('util');
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
const checkIfFileOrFolder = path => {
  fs.stat(path, (error, stats) => {
    if (error) {
      console.log(error);
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
              checkIfFileOrFolder(path + '/' + element);
            }
          }
        })
      } else if (stats.isFile() && path.indexOf('.md', -3) >= 0) {
        links = links.concat(readFileMarkdown(path));
      }
    }
  });
}

const miPrimeraPromise = new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(links);
    }, 1000);
  });

  miPrimeraPromise.then((successMessage) => {
    console.log(successMessage);

  });

  checkIfFileOrFolder('./example');


//---------------------------------------------------------------FUNCION PARA VALIDAR UN LINK CALLBACK
/* const  validateLinkOk=(url,callback)=> {
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
 */