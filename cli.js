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

