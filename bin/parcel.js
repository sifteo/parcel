#!/usr/bin/env node

var program = require('commander')
  , parcel = require('../');

program.command('query <repo> <package>')
  .description('-> query package info')
  .action(function(repo, pkg, options) {
    parcel.cli.query(repo, pkg, function(err) {
      if (err) throw err;
    });
  });
  
program.command('publish <repo> <file>')
  .description('-> publish a package')
  .option('-p, --package-spec <file>', 'load package spec')
  .action(function(repo, file, options) {
    parcel.cli.publish(repo, file, options, function(err) {
      if (err) throw err;
    });
  });

program.parse(process.argv);
