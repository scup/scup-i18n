#!/usr/bin/env node

module.exports = (function(){
	'use Strict'



  var arguments = process.argv;
  var serializedArguments = {};

  for (var i = 0; i <= arguments.length-1; i++) {
    if (arguments[i].substr(0,1).indexOf('-') == 0){
      serializedArguments[arguments[i].replace(/\-\-/,'')] = arguments[i+1]
    }else{
    }
  };

  
	var transifex = new require("transifexjs");
	var inquirer = require('inquirer');
	var Ordine = require('ordine');
	var questions = [];

  questions.push({
    type:'input',
    name:'username',
    message:'Transifex Username'
  })

  questions.push({
    type:'password',
    name:'password',
    message:'Transifex Password'
  })

  questions.push({
    type:'checkbox',
    name:'resources',
    message:'Select the resources :',
  })

  questions.push({
    type:'checkbox',
    name:'languages',
    message:'Select the language :',
  })


  var I18N = this;
  var flush = new Ordine(function(){console.log('fim')})
  flush.enqueue(function(){
    inquirer.prompt(questions[0],function(username){
      I18N.username = username['username'];
      flush.next()
    })
  })

  flush.enqueue(function(){
    inquirer.prompt(questions[1],function(password){
      I18N.password = password['password'];
      authenticate()
    })
  },true)





  flush.enqueue(function(){
    langs()
  },true)


  flush.enqueue(function(){
    resources()
  },true)


  flush.enqueue(function(){
    translations()
  },true)



  if (serializedArguments.hasOwnProperty('usr')){
    console.log('defined usr')
    I18N.username = serializedArguments['usr'];
  }

  if (serializedArguments.hasOwnProperty('pass')){
    console.log('defined pass')
    I18N.password = serializedArguments['pass'];
  }




  function authenticate(){
    transifex = transifex.login(I18N.username,I18N.password)
    .setProject('site-5');
    flush.next();
  }

  function resources(){
    transifex.resources(function(x){
      x = JSON.parse(x)
      questions[2].choices = [];
      x.forEach(function(option,i){
          questions[2].choices.push(option.slug)
      })
      inquirer.prompt(questions[2],function(resources){
        transifex.setResource(resources['resources'][0]);
        flush.next();
      })
    })
  }

  var langs = function(){
    transifex.languages(function(x){
      questions[3].choices =  []
      JSON.parse(x).forEach(function(choice,i){
        questions[3].choices.push(choice.language_code);
      })
      inquirer.prompt(questions[3],function(languages){
        I18N.languages = languages;
        transifex.setLang(languages['languages'][0])
        flush.next();
      })
    })
  }


  var translations = function(){
    transifex.translation(function(x){
      x = JSON.parse(JSON.parse(x)['content']);

      require('fs').writeFile("teste.json", JSON.stringify(x), function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log("The file was saved!");
          }
      }); 

      flush.next();
    })
  }


  this.applyTranslations = function(){



  }

	return {
		start : function(){
      console.log('run');
      flush.run()
    }
  }
})()