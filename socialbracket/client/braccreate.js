import { Session } from 'meteor/session';

import { Entries } from '../lib/collection.js';
import { Brackets } from '../lib/collection.js';
import { $ } from 'meteor/jquery';

entry_id_array = [];

Session.set('entriesselect', entry_id_array);
Session.set('numteams', 0);
Session.set('randomize', false);
//const Entries = new Mongo.Collection('entries');

Template.createbracket.onCreated(function createBracketOnCreated(){
	Meteor.subscribe('brackets');
	Meteor.subscribe('entries');

	this.wrong_num_teams = false;

}
);

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

Template.createbracket.events({
	'click #back'(event,instance){
		entry_id_array = [];
		Session.set('entriesselect', []);
		Session.set('numteams', 0);
		Session.set('randomize', false);
		Session.set('errorMessage', '');
		BlazeLayout.render('createbracket');
	},
	'click .next'(event, instance){
		var title = $('#bracket_title').val();
		var description = $('#bracket_description').val();
		var numteams = $('#numteams').val();
		var random = $('#randomize').val() == 'on';

		var int_numteams = 0;
		if(numteams === 'four'){
			int_numteams = 4;
		} else if(numteams === 'eight'){
			int_numteams = 8;
		}else if(numteams === 'sixteen'){
			int_numteams = 16;
		}else{
			Session.set('errorMessage', 'You managed to provide a very strange value, you hacker you');
		}

		Session.set('numteams', int_numteams);
		Session.set('title', title);
		Session.set('description', description);
		Session.set('randomize', random);

		var isPrivate = $('#private').val();

		BlazeLayout.render('createbracket', {privateBracket : isPrivate});
	},
	'click .create_entry'(event, instance){
		Session.set('errorMessage', '');
		var entry_title = $('#newEntryTitle').val();
		var numteams = $('#numteams').val();

		var entryid = Math.random().toString(36).substring(7);
		
		entry_id_array = Session.get('entriesselect');

		/* 
			Shuffle the brackets
		*/

		var doRandom = Session.get
		if($('#randomize').val() === 'on'){
			entry_id_array = shuffle(entry_id_array);
		}
		entry_id_array = shuffle(entry_id_array);

		for(var seed = 1; seed <= entry_id_array.length; seed++){
			entry_id_array[seed - 1]['seed'] = seed;
		}

		// An image can either be selected in the logo or ented through custom Image URL
		var image_url = $('#' + Session.get('id_selected')).prop('src');

		if(image_url === undefined){
			var custom_image_url = $('#customImageURL').val();
			if(custom_image_url.match(/\.(jpeg|jpg|gif|png)$/) != null){
				image_url = custom_image_url;
			} else if(image_url != '') {
				Session.set('errorMessage', custom_image_url + ' not a valid URL');
				return;
			}
		}

		// If still undefined, we will set 
		if(image_url === undefined){
			Session.set('errorMessage', entry_title + ' was created, but no image was selected');
		}

		var entry_json = { 
			entry_id : entryid, 
			entry_title : entry_title, 
			seed : entry_id_array.length + 1,
			image_url : image_url,
			num_bracs : 0
		}

		Meteor.call('entries.insert', entry_json, function(error, result){
			console.log(error);
			if(error){
				Session.set('errorMessage', error['error']);
			} else {
				entry_id_array = Session.get('entriesselect');
				entry_id_array.push(entry_json);
				Session.set('entriesselect', entry_id_array);
				$('#' + Session.get('id_selected')).css('border', '');
				Session.set('id_selected', null);
				BlazeLayout.render('createbracket', {title : FlowRouter.getParam('title'), description : FlowRouter.getParam('description'), privateBracket : FlowRouter.getParam('privateBracket') });
			}
		});	
	},
	'click #submit_bracket'(event, instance){
		Session.set('errorMessage', '');
		var a = Session.get('entriesselect');

		if(Session.get('numteams') != a.length){
			Session.set('errorMessage', 'Make sure you have ' + Session.get('numteams') + ' teams!')
			BlazeLayout.render('createbracket',  {title : FlowRouter.getParam('title'), description : FlowRouter.getParam('description'), privateBracket : FlowRouter.getParam('privateBracket') });
			return;
		}

		// This should become a unique id for the bracket making it sharable 
		var bracid = Math.random().toString(36).substring(10);

		var username = 'Anon';
		if(Meteor.user() != null ){
			username = Meteor.user()['emails']['address'];
		}

		var bracket = {
			bracid : bracid,
			title : Session.get('title'), 
			description : Session.get('description'), 
			entries : a, 
			owner : Meteor.userId(), 
			username : username, 
			privateBracket : FlowRouter.getParam('privateBracket') === 'on' 
		}

		Meteor.call('brackets.insert', bracket, function(error, result){
			if(error){
				console.log(error);
				Session.set('errorMessage', error['error']);
			} else {
				var bracid = Brackets.findOne({title : Session.get('title'), description : Session.get('description')})['_id'];
				Session.set('entriesselect', []);
				Session.set('numteams', 0);
				Session.set('randomize', false);
				Session.set('errorMessage', '');
				Session.set('bracid', bracid);

				// Update the new entries
				entry_id_array = Session.get('entriesselect');
				for(var i = 0; i < entry_id_array.length; i++){
					Meteor.call('entries.addOne', entry_id_array[i]);
				}
				FlowRouter.go('bracket', {bracid : bracid});
			}
		});
	}
});

Template.createbracket.helpers({
	/*
		Conditional Template Helper 
		
		Returns true if the user still needs to select a title and description
	*/
	'hasTitle' : function(){
		if( Session.get('numteams') === 0 || FlowRouter.getParam('title') === '' )
			return true;
		return false;
	},
	'missed_form' : function(){
		return false;
	},
	'errorMessage' : function(){
		return Session.get('errorMessage');
	},
	'entries' : function(){
		return Entries.find({});
	},
	'title' : function(){
		return FlowRouter.getParam('title');
	}, 
	'description' : function(){
		return FlowRouter.getParam('description');
	},
	'numteams' : function(){
		return FlowRouter.getParam('numteams');
	},
	'privateBracket' : function(){
		return FlowRouter.getParam('privateBracket');
	} 
});

Template.entrylist.helpers({
	/*
		Finds all entries. Unused currently.
	*/ 
	'all_entries' : function(){
		return Entries.find();
	},
	/*
		Finds all entries and sorts them by 
	*/
	'all_entries_indiscriminate' : function(){
		return Entries.find({},
			{
				sort: 
					[
						['num_bracs', 'desc'],
						['entry_title', 'asc']
					]
			});
	},
	/*
		Quite possibly the most ridiculous function I've written that has no other way to do it.
	*/
	'more_than_3' : function(a){
		return a > 3;
	}
});

Template.entrylist.events({
	'click .entrylist-holder'(event, instance){
		var entryid = event['currentTarget']['id'];

		var entry_json = { 
			entry_id : entryid, 
			entry_title : $('#' + entryid).prop('title'), 
			seed : -1, // will be set later
			image_url : $('#' + entryid).attr('imageurl')
		}
		entry_id_array.push(entry_json);
		console.log(entry_id_array);
		Session.set('entriesselect', entry_id_array);

		BlazeLayout.render('createbracket', {privateBracket : FlowRouter.getParam('privateBracket')});
	}
});

// Original chosenentries function
Template.chosenentries.helpers({
	'all_entries': function(){
		return Session.get('entriesselect');
	}
});

Template.chosenentries_alt.helpers({
	'all_entries': function(){
		var a = [];
		var entriesselected = Session.get('entriesselect');
		for(var i = 0; i < entriesselected.length; i++){
			a.push(entriesselected[i]);
			a.push({entry_title : 'To be voted on'});
		}
		// The rest are null
		for(var j = entriesselected.length; i < Session.get('numteams'); i++){
			a.push({entry_title : 'Your choice'});
			a.push({entry_title : 'To be voted on'});
		}
		a.pop();
		return a;
	}
});

Template.createentry.onCreated(function onCreateEntryCreate(){
	Session.set('id_selected', null);
});

Template.createentry.helpers({
	'urls' : function(){
		var ret = [];
		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
		for(var a = 0; a < alphabet.length; a++){
			ret.push({url : 'https://raw.githubusercontent.com/eladnava/material-letter-icons/master/dist/png/' + alphabet[a] + '.png', temp_id : a})
		}
		return ret;
	}
});

Template.createentry.events({
	'click .entrylogo'(event, instance){
		$('#' + event['target']['id']).css('border', '3px black solid');
		if(this.id_selected != null){
			this.id_selected = event['target']['id'];
		}
		else{
			$('#' + Session.get('id_selected')).css('border', '');
			Session.set('id_selected', event['target']['id']);			
		}
	}
});