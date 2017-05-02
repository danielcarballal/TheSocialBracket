import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Bracket } from '../lib/bracket.js';
import { Entry } from '../lib/bracket.js';

import { Entries } from '../lib/main.js';
import { Brackets } from '../lib/main.js';

// import Brackets from 'db';
/*
var Brackets = new Mongo.Collection('brackets', {
  transform: (doc) => new Bracket(doc)
});*/
// const users = new Mongo.Collection('users');
//Brackets = new Mongo.Collection('brackets');
// Entries = new Mongo.Collection('entries');


/**


AppCache solution to image problems 

Meteor.AppCache.config({onlineOnly: ['/online/']});

Meteor.AppCache.config({
  onlineOnly: [
      '/bigimage.jpg',
      '/largedata.json'
  ]
});

**/
/**

AJAX solution to image problems

var express =   require("express");
var multer  =   require('multer');
var app         =   express();

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage : storage}).single('userPhoto');

app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});


S3 solution


meteor add lepozepo:s3
**/