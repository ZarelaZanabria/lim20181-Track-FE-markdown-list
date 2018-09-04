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
  for (const i in urlLinks){
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
const checkIfFileOrFolder = paths => {
  const ext = '.md';
  const extName = path.extname(paths);
  fs.stat(paths, (error, stats) => {
    if (error) {
      console.log(error);
    }
    else {
      if (stats.isDirectory()) {
        fs.readdir(paths, 'utf8', (error, files) => {
          if (error) {
            console.log(error);
          } else {
            for (const fileName in files) {
              const element = files[fileName]
              checkIfFileOrFolder(paths + '/' + element);
            }
          }
        })
      } else if (stats.isFile() && ext===extName) {
        links = links.concat(readFileMarkdown(paths));

      }
    }
  });
}

//----------------------------------------------------------------FUNCIÓN PARA VALIDAR LOS LINKS
const validateLinks = (arrLinks, callback) => {
  let arrLink = [];
  arrLinks.forEach(element => {
    fetch(element.href)
      .then((response) => {
        if (response.status >= 200 && response.status < 400) {
          arrLink.push({
            ...element,
            status: response.status,
            statusText: response.statusText,
          })

        } else {
          arrLink.push({
            ...element,
            status: response.status,
            statusText: 'FAIL',
          })

        }
      })
      .catch(error => arrLink.push({
        ...element,
        status: 404,
        statusText: 'FAIL',
      }))
  });
  // tomanos un tiempo de 2 segundos para esperar las promesas
 setTimeout(() => callback(arrLink), 2000); 
};
//----------------------------------------------------------------------FUNCIÓN PARA PODER VALIDAR LOS REPETIDOS
const linkStats = (arrLinks) => {
  /*Creamos un funcion para poder verificar */
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
          linkresol.broken = arrLinksValidate.filter(link => (link.statusText === 'FAIL')).length;
          resolve(linkresol);
        });
      } else if (options.validate && !options.stats) {
        validateLinks(links, resolve);
      } else {
        resolve(links);
      }
    },
      2000);
  } else {
    reject(`La ruta no existe o es incorrecta`);
  }
})
module.exports = mdLinks;