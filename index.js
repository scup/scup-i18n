#!/usr/bin/env node

var _args = require('simple-args'),
  transifex = new require('transifexjs');

module.exports = (function(){
  'use Strict'

  return {
    authenticate: function(user, pass, proj) {
      transifex = transifex.login(user,pass)
      .setProject(proj);
    },
    getResources: function (cb) {
      transifex.resources(function(x){
        if( typeof cb === 'function' ) {
          cb(JSON.parse(x));
        }
      });
    },
    
    setResources: transifex.setResource,

    getLangs: function(cb) {
      transifex.languages(function(x){
        if( typeof cb === 'function' ) {
          cb(JSON.parse(x));
        }
      });
    },

    setLangs: transifex.setLang,

    translations: function(path, cb) {
      if(!path || typeof path !== 'string') {
        throw new Error('Path undefined;');
        return;
      }

      transifex.translation(function(x){
        x = JSON.parse(JSON.parse(x)['content']);

        require('fs').writeFile(path, JSON.stringify(x), function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("The file was saved!");
          }
        }); 
        if (typeof cb === 'function')
          cb();
      })
    }
  };

})();