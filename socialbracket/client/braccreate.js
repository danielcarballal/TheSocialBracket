import { Session } from 'meteor/session';

import { Entries } from '../lib/collection.js';
import { Brackets } from '../lib/collection.js';
import { $ } from 'meteor/jquery';

entry_id_array = [];

Session.set('entriesselect', entry_id_array);
Session.set('numteams', 0);
//const Entries = new Mongo.Collection('entries');

Template.createbracket.onCreated(function createBracketOnCreated(){
	Meteor.subscribe('brackets');
	Meteor.subscribe('entries');

	this.wrong_num_teams = false;

}
);

Template.createbracket.events({
	'click #back'(event,instance){
		entry_id_array = [];
		Session.set('entriesselect', []);
		Session.set('numteams', 0);
		Session.set('errorMessage', '');
		BlazeLayout.render('createbracket');
	},
	'click .next'(event, instance){
		var title = $('#bracket_title').val();
		var description = $('#bracket_description').val();
		var numteams = $('#numteams').val();

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
		Session.set('description', description)

		var isPrivate = $('#private').val();

		BlazeLayout.render('createbracket', {privateBracket : isPrivate});
	},
	'click .create_entry'(event, instance){
		var entry_title = $('#newEntryTitle').val();
		var numteams = $('#numteams').val();

		var entryid = Math.random().toString(36).substring(7);
		
		entry_id_array = Session.get('entriesselect');

		var entry_json = { 
			entry_id : entryid, 
			entry_title : entry_title, 
			seed : entry_id_array.length + 1,
			image_url : $('#' + Session.get('id_selected')).prop('src')
		}

		Meteor.call('entries.insert', entry_json, function(error, result){
			console.log(error);
			if(error){
				Session.set('errorMessage', error['error']);
			} else {
				entry_id_array.push(entry_json);
				Session.set('entriesselect', entry_id_array);
				$('#' + Session.get('id_selected')).css('border', '');
				Session.set('id_selected', null);
				BlazeLayout.render('createbracket', {title : FlowRouter.getParam('title'), description : FlowRouter.getParam('description'), privateBracket : FlowRouter.getParam('privateBracket') });
			}
		});	
		console.log(entry_id_array);
		// entries_react.set(entry_id_array);
		//Session.set('entriesselect', entry_id_array);
	},
	'click #submit_bracket'(event, instance){
		// Meteor.call('brackets.newBracket', this.title, this.description, entries_react.get() );

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
				console.log(bracid);
				Session.set('numteams', 0);
				Session.set('bracid', bracid);
				FlowRouter.go('bracket', {bracid : bracid});
			}
		});
	}
});

Template.createbracket.helpers({
	'hasTitle' : function(){
		if( Session.get('numteams') === 0)
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
		console.log(Entries.find({}));
		return Entries.find({});
	},
	'title' : function(){
		return Session.get('title');
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
	'all_entries' : function(){
		console.log(Entries.find({}).fetch());
		return Entries.find({});
	}
});

Template.entrylist.events({
	'click .entrylist-holder'(event, instance){
		var entryid = event['target']['id'];
		var entry_json = { 
			entry_id : entryid, 
			entry_title : $('#' + entryid).prop('title'), 
			seed : entry_id_array.length + 1,
			image_url : $('#' + entryid).attr('imageurl')
		}

		entry_id_array.push(entry_json);
		console.log(entry_id_array);
		Session.set('entriesselect', entry_id_array);

		BlazeLayout.render('createbracket', {privateBracket : FlowRouter.getParam('privateBracket')});
	}
})

Template.chosenentries.helpers({
	'all_entries': function(){
		return Session.get('entriesselect');
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
		var url = event['target']['src'];
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