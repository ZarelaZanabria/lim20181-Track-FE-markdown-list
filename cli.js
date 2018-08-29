#!/usr/bin/env node
const [,, ...argvs] = process.argv;
//Tengo que poner mis argumentos en un array
const totalArgvs = argvs.length;
const path = argvs[0];
const mdLinks = require('./index');
let options = {
  validate: false,
  stats: false
}

if (totalArgvs === 1) {
  mdLinks(path, options).then( (response) =>{
    return response.forEach((element)=> {
      let file = element.file,
          href = element.href,
          text = element.text;      
      return console.log(file  + ' ' + href + ' ' + text);
    });
  });
} else if (totalArgvs === 2 && argvs[1] === '--validate') {
  options.validate = true;
  mdLinks(path, options).then( (response) =>{
    return response.forEach( (element)=> {
      let file = element.file,
          href = element.href,
          text = element.text,
          status=element.status,
          statusText=element.statusText
        return console.log(file  + ' ' + href + ' ' + statusText + ' ' + status + ' ' + text);
    });
  });
} else if (totalArgvs === 2 && argvs[1] === '--stats') {
  options.stats = true;
  mdLinks(path, options).then( (response) =>{
    return console.log('Total : '+ response.total+'\n'+' Uniques : '+ response.uniques);
  });
} else if (totalArgvs === 3 && argvs[1] === '--validate' && argvs[2] === '--stats') {
  options.validate = true;
  options.stats = true;
  mdLinks(path, options).then((response) =>{
    return console.log('Total : ' +response.total + '\n' + 'Uniques : ' + response.uniques +'\n'+ 'Broken : ' + response.broken );
  });
} else {
  console.log('Comando incorrecto o invalido');
}