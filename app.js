var express = require('express');
var app = express();

var MatiereController = require('./matiere/MatiereController');
app.use('/matieres', MatiereController);

module.exports = app;