//Aqui es donde vamos a crear la funcion mdlink(path,options
//Desde este archivo debes exportar una función (mdLinks)
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

//Array en donde se va almacenar los links del archivo markdown
let links = [];

//-----------------------------------------------------------------------------------------FUNCION PARA CONVETIR UN RUTA RELATIVA A ABSOLUTA
const convertRelativeAbsolute = fileName => {
  if (path.isAbsolute(fileName)) {
    return fileName = fileName.toString();
  } else {
    return fileName = path.resolve(fileName);
  }
}
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
       /*  console.log(links) */
      }
    }
  });
}

//----------------------------------------------------------------FUNCIÓN PARA VALIDAR LOS LINKS
const validateLinks = (arrLinks, callback) => {
  let linksValidate = [];
  arrLinks.forEach(element => {
    fetch(element.href)
      .then((response) => linksValidate.push({
        ...element,
        status: response.status,
        statusText: response.statusText,

      }))
      .catch(error => linksValidate.push({
        ...element,
        status: 404,
        statusText: 'fail',

      }))
  });
  // tomanos un tiempo de 2 segundos para esperar las promesas
  setTimeout(() => callback(linksValidate), 2000);
};
//----------------------------------------------------------------------FUNCIÓN PARA PODER VALIDAR LOS REPETIDOS
const linkStats = (arrLinks) => {
  deleteLinkDuplicate = (arr) => {
    return arr.filter((value, index) => {
      return arr.indexOf(value) === index;
    });
  };
  const urlLink = arrLinks.map(element => element.href);
  return {
    total: arrLinks.length,
    uniques: deleteLinkDuplicate(urlLink).length
  }
};
//--------------------------------------------------------------------FUNCIÓN PARA PODER EJECUTAR TODAS LOS LINKS
const mdLinks = (path, options) => new Promise((resolve, reject) => {
  const pathAbsolute = convertRelativeAbsolute(path);
  if (fs.existsSync(pathAbsolute)) {
    checkIfFileOrFolder(pathAbsolute);
    setTimeout(() => {
      if (options.stats && !options.validate) {
        resolve(linkStats(links))
      } else if (options.stats && options.validate) {
        const linkresol = linkStats(links);
        validateLinks(links, arrLinksValidate => {
          linkresol.broken = arrLinksValidate.filter(link => link.statusText === 'fail').length;
          resolve(linkresol);
        });
      } else if (options.validate && !options.stats) {
        validateLinks(links, resolve);
      } else {
        resolve(links);
      }
    },
      5000);
  } else {
    reject(`La ruta no existe o es incorrecta`);
  }
})
module.exports = mdLinks;