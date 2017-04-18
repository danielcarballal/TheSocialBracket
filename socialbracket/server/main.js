import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Bracket from './bracket.js';

// import Brackets from 'db';
/*
var Brackets = new Mongo.Collection('brackets', {
  transform: (doc) => new Bracket(doc)
});*/
// const users = new Mongo.Collection('users');
//Brackets = new Mongo.Collection('brackets');
// Entries = new Mongo.Collection('entries');

if(Meteor.isServer){

  Meteor.startup(() => {

    /*
    Brackets.remove({}); 


    Brackets.insert(
      {bracid : 1,
        title: 'Who has the best party university in Illinois?',
      entries : [ 1, 2, 1 ],
      num_teams : 2,
      date_endings: [ 1, 2, 3 ]
      }
    );

    Brackets.insert(
      {bracid : 2,
        title: 'What is the best pizza in Champaign?',
      entries : [ 3, 4, 4, 4, 7, 7, 6 ],
      num_teams : 4,
      date_endings: [ 1, 2, 3 ]
      }
    );*/

    //Entries.remove({});

    console.log(Brackets.find().fetch());

    console.log('--------------');

    console.log(Entries.find().fetch());
    /*
    S3.config = {
      key: 'danielenriquecarballal@gmail.com',
      secret: 'Cupglue1006!',
      bucket: 'thesocialbracket',
      region: 'eu-west-1' // Only needed if not "us-east-1" or "us-standard"
    }; */
  });

  // Meteor.publish(“images”, function(){ return Images.find(); });

  // Get the full data on user data in 
  Meteor.publish('userData', function userPublication() {
    if (this.userId) {
      return Meteor.users.find({ _id: this.userId }, {
        fields: { }
      });
    } else {
      this.ready();
    }
  });

  Meteor.publish('brackets', function bracketInfo(entry_id){
    return Brackets.find();
  });

  Meteor.publish("entries", function() {
  return Entries.find({});
});

  Meteor.methods({
     // A published method for inserting a new bracket
    'brackets.newBracket' (bracket_title, entry_ids, end_dates) {
      var bracket_id = Math.random().toString(36).substring(7);

      while(Entries.findOne({bracket_id : bracket_id}) != null){
        bracket_id = Math.random().toString(36).substring(7);
      }

      var b = new Bracket(bracket_id, bracket_title, entry_ids, end_dates);
    },
    'brackets.allBrackets'(){
      const a = Brackets.find();
      console.log(a);
      return a;
    },

    /*
      A Meteor method for updating the server with a new Entry.


    */
    'brackets.newEntry'(entryid, entrytitle, entrydescription){
      if (Entries.findOne({entry_id : entryid}) != null ) {
        console.log("Warning: Entry with id " + entryid + " already exists");
        return false;
      }
      else{ 
        Entries.insert({entry_id : entryid, title : entrytitle, description : entrydescription, image_url: '', votes:0});
        return true;
      }
    }
  });
}

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