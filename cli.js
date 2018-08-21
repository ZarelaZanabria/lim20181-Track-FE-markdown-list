#!/usr/bin/env node
const [,, ...argvs] = process.argv;
console.log(`Helllo word ${argvs}`);
const mdLinks = require('./index');
let options = {
  validate: false,
  stats: false
}

