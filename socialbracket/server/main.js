import { Meteor } from 'meteor/meteor';


if(Meteor.isServer){
  var brackets = new Mongo.Collection('brackets');
  // const users = new Mongo.Collection('users');
  var entries = new Mongo.Collection('entries');


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
**/

  Meteor.startup(() => {
    brackets.insert(
      {brac_id : 1,
        title: 'Who has the best party university in Illinois?',
      entries : [ {game_id : 1, seed : 1, round_num : 1, title : 'First', description : '', image_url: '', can_vote:false},
            {game_id : 2, seed : 1, round_num : 2, title : 'First', description : '', image_url:'', can_vote:true},
            {game_id : 3, seed : 2, round_num : 1, title : 'Second', description : '', image_url:'',can_vote: false} ],
      num_teams : 2,
      date_endings: [ 1, 2, 3 ]
      }
    );
  });

  // Meteor.publish(“images”, function(){ return Images.find(); });

  // Get the full data on user data in 
  Meteor.publish('userData', function () {
    if (this.userId) {
      return Meteor.users.find({ _id: this.userId }, {
        fields: { }
      });
    } else {
      this.ready();
    }
  });
}