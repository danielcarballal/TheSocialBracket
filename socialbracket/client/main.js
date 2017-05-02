import './main.html';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor';

import { Brackets } from '../lib/collection.js';

import { Session } from 'meteor/session';
// var Brackets = new Mongo.Collection('brackets');


Template.sidebar.onCreated(function sidebarOnCreated(){
	Meteor.subscribe('users');
});

Template.bracketlist.events({
	'click .link_to_brac'(event, instance){
		var linkid = event['target']['id'];
		FlowRouter.go('bracket', { bracid : linkid });
	}
})

Template.bracketlist.helpers({
	'allBrackets' : function(){
		return Brackets.find({});
	}
});

Template.personalbracketlist.helpers({
	'allBrackets' : function(){
		return Brackets.find({creatorID : Meteor.userId() });
	}
});

Template.tree.events({
	'click .entry-storer'(event, instance){
		var id = event.currentTarget.id;
		var matchup = $('#' + id).attr('matchup');
		var seed = $('#' + id).attr('seed');
		curWinners = Session.get('chosenWinners');
		curWinners[matchup] = seed;
		Session.set('chosenWinners', curWinners);
		BlazeLayout.render('bracket', { _id : Session.get('bracid') }) ;
	}
});


/*
		ROUTING INFORMATION

	In general, we want the following structure:

*/


FlowRouter.route('/bracket/:bracid', {
    name: 'bracket',
    action: function(params) {
    	const id_num = params.bracid;
    	Session.set('chosenWinners', {});
    	Session.set('bracid', id_num);
        BlazeLayout.render('bracket', { _id : id_num }) ;
    }
});

FlowRouter.route('/all_brackets', {
	name : 'bracket_list',
	action: function(params){
		BlazeLayout.render('bracketlist');
	}
});

FlowRouter.route('/my_brackets', {
	name : 'personal_bracket_list',
	action: function(params){
		BlazeLayout.render('personalbracketlist');
	}
});

FlowRouter.route('/createbracket', {
	name : 'create_bracket',
	action: function(params, queryParams){
		if(queryParams['num_teams'] != undefined ){
			var var_teams = 16;
			if(queryParams['num_teams'] === 'four'){
				var_teams = 4;
			}
			if(queryParams['num_teams'] === 'eight'){
				var_teams = 8;
			}
			BlazeLayout.render('createbracket', { title : queryParams['bracket_title'], description : queryParams['description'], num_teams : var_teams});
		} else {
			BlazeLayout.render('createbracket', { });
		}
	}
});

