#!/usr/bin/env node

var I18N = require('./index'),
  Ordine = require('ordine'),
  inquirer = require('inquirer'),
  questions = {};

questions.project = {
  type:'input',
  name:'project',
  message:'Project name'
};

questions.user = {
  type:'input',
  name:'username',
  message:'Transifex Username'
};

questions.password = {
  type:'password',
  name:'password',
  message:'Transifex Password'
};

questions.language = {
  type:'checkbox',
  name:'languages',
  message:'Select the language :',
};

questions.resource = {
  type:'checkbox',
  name:'resources',
  message:'Select the resources :',
};


var flush = new Ordine(function(){});
var user, pass, proj;

flush.enqueue(function(){
  inquirer.prompt(questions.project,function(data){
    proj = data.project;
    flush.next()
  });
});

flush.enqueue(function(){
  inquirer.prompt(questions.user,function(data){
    user = data.username;
    flush.next()
  });
},true);

flush.enqueue(function(){
  inquirer.prompt(questions.password,function(data){
    pass = data.password;
    I18N.authenticate(user, pass, proj);
    flush.next();
  });
},true);


flush.enqueue(function() {
  questions.language.choices =  []
  I18N.getLangs(function(data) {
    
    data.forEach(function(choice,i) {
      questions.language.choices.push(choice.language_code);
    });

    inquirer.prompt(questions.language, function(data){
      I18N.setLangs(data.languages);
      flush.next();
    });

  });
},true);

flush.enqueue(function(){

  I18N.getResources(function (data) {
    questions.resource.choices = [];
    data.forEach(function(option,i){
      questions.resource.choices.push(option.slug)
    });
    inquirer.prompt(questions.resource,function(data){
      I18N.setResources(data.resources);
      flush.next();
    });
  });

},true);

flush.enqueue(function(){
  I18N.translations('teste.json', function () {
    flush.next();
  });
},true);

flush.run();
