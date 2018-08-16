let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const path = require('path');
//Aqui es donde vamos a crear la funcion mdlink(path,options
//Desde este archivo debes exportar una función (mdLinks)
const fs = require('fs');

//Solo permite la lectura de un archivo directamente 
let readMarkdown = fs.readFileSync('README.md', 'utf-8');
//--------------------------------------------------FUNCIÓN PARA VERIFICAR SI ES UN ARCHIVO O UNA CARPETA 
const directoryOrFile = () =>{
  
}

//----------------------------------------------------------------FUNCIÓN PARA OBTENER LOS LINKS DE UNA ARCHIVO MARKDOWN
const getlinksMd = (fileMd) => {
/*   i por lo que las mayúsculas serán ignoradas
  Mediante una expresión regular le decimos que extraiga los linksMd 
  que esten dentro de los corchetes y los parentesis */
  const RegExpLink = /!*\[(.*)\]\((.*)\)/gi;  

  let urlLinks = fileMd.match(RegExpLink);
  // Solo lo que se encuentre dentro de los corchetes
  /*    const textLink = /\[(\w+.+?)\]/gi ; */
  const textLink = /\[(.*)\]/gi
  // Solo lo que se encuentre dentro de los parentesis
  const urlLink = /\]\((.*?|(https?|ftp):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-]))\)/gi;; 
  //Array en donde se va almacenar los links
  const linksMd = [];

  for (let i = 0; i < urlLinks.length; i++) {
    /* console.log(urlLinks[i]) */
    //subtring permite tener una cantidad de caracteres de una posicion (1,5) hasta otra 
    /* Este codigo permite sacar los corchetes o parentesis de los link o text
     match(urlLink)[0].match(urlLink)[0].substring(1, urlLinks[i].match(urlLink)[0].length - 1);   */
    let textLinkMarkdown = urlLinks[i].match(textLink)[0].substring(1, urlLinks[i].match(textLink)[0].length - 1);

    let urlLinkMarkdown = urlLinks[i].match(urlLink)[0].match(urlLink)[0].substring(2, urlLinks[i].match(urlLink)[0].length - 1);
    //Este codigo permite agregar al array los siguientes objetos
    linksMd.push({
      text: textLinkMarkdown,
      href: urlLinkMarkdown
    });
  }
  /* console.log(linksMd); */
  return linksMd; // linksMd guardamos el array de objetos con los linksMd
}

//Esta letiable contiene todos los links del archivo markdown
const linkFileMarkdown = getlinksMd(readMarkdown);

 console.log(linkFileMarkdown)
 
//--------------------------------------------------------------------------FUNCIÓN PARA VALIDAR LOS LINKS 
const  validateLink=(url,callback)=> {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.addEventListener("load", function() {
    if (req.status >= 200 && req.status < 400) {
      callback(null, { url })
    } else {
      console.error(req.status + " " + req.statusText);
    }
  });
  req.addEventListener("error", function(){
    callback({ error: true, url })
  });
  req.send(null);
}

linkFileMarkdown.forEach(element => {
  
  validateLink(element.href, (error, respuesta) => {
    if (error) {
      console.log( error.url + '-------invalida');
      
    } else{
      console.log( respuesta.url + '-----valida');
      
    }
  }); 
   
});
