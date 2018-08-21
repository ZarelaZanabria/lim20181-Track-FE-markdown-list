#!/usr/bin/env node
const [,, ...argvs] = process.argv;
console.log(`Helllo word ${argvs}`);
/* console.log("console.log output") */
const totalArgvs = argvs.length;
const path = argvs[0];
const mdLinks = require('./index');
let options = {
  validate: false,
  stats: false
}

