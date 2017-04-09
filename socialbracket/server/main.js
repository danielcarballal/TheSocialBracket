import { Meteor } from 'meteor/meteor';

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