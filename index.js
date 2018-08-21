//Aqui es donde vamos a crear la funcion mdlink(path,options
//Desde este archivo debes exportar una función (mdLinks)
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); 
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//Array en donde se va almacenar los links del archivo markdown
let links = [];


//----------------------------------------------------------------FUNCIÓN PARA OBTENER LOS LINKS DE UNA ARCHIVO MARKDOWN
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
//----IMPORTANTE/* 

/*  console.log(readFileMarkdown('README.md'))  */
//Esta letiable contiene todos los links del archivo markdown
/*  const linkFileMarkdown = readFileMarkdown('D:\\Zarela Data\\Npm\\example');  */
/*   console.log (linkFileMarkdown)
 */
//--------------------------------------------------FUNCIÓN PARA VERIFICAR SI ES UN ARCHIVO O UNA CARPETA 


const checkIfFileOrFolder = path => fs.stat(path, (error, stats) => {
  if (error) {
    console.log(error);
    //https://www.tutorialspoint.com/nodejs/nodejs_process.htm 
    process.exit(1);
  }
  else {
    if (stats.isDirectory()) {
      console.log(path + " is a directory");
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
      console.log(path + " is a file markdown");
      /* Concatenamos por que vamos a obtener todos los links de 
        los archivos markdown encontrados */
      links = links.concat(readFileMarkdown(path))
         
    
    } else {
      // optionally check for BlockDevice, CharacterDevice etc
      console.log(path + " is not a file markdown or directory");
    }
  }
});
//----IMPORTANTE...
console.log(checkIfFileOrFolder('D:\\Zarela Data\\Npm\\example'));
/* const array = checkIfFileOrFolder('D:\\Zarela Data\\Npm\\example');
console.log (array) */


//--------------------------------------------------------------------------FUNCIÓN PARA VALIDAR LOS LINKS 

const validatelinks = (links, callback)=>{
  arraylinks = [];
  links.forEach(element => {
    console.log (element.href)
  });

   //Vamos a determinar un timepo de respuesta
   setTimeout(() => callback(arraylinks), 5000);

}

const  validateLink=(url,callback)=> {
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
   
});  */ 