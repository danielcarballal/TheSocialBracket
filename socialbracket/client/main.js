import './main.html';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor';

// var Brackets = new Mongo.Collection('brackets');


Template.sidebar.onCreated(function sidebarOnCreated(){
	Meteor.subscribe('users');
});

Template.sidebar.helpers({
	'username' : function(){
		if(Template.instance.user.get() == null){
			return "No user";
		}
		return Template.instance.user.get().username;
	}
});

Template.bracketlist.onCreated(function bracketlistCreated(){
	$(document).ready(function() {
	    $(".link_to_brac").click(function(event) {
	        // this.append wouldn't work
	        console.log('JQUERY');
	    });
	});
})
Template.bracketlist.helpers({
	'allBrackets' : function(){
		return Brackets.find();
	}
});

Template.bracketlist.events({
	'click .link_to_brac'(event, instance){
		event.preventDefault();
		//console.log('localhost:3000/bracket/' + event['target'].id);
    	//window.open('localhost:3000/bracket/' + event['target'].id, '_blank' );
		BlazeLayout.render('bracket', { bracid  : event['target'].id }) ;
	}
})

/*
		ROUTING INFORMATION

	In general, we want the following structure:

*/


FlowRouter.route('/bracket/:bracid', {
    name: 'bracket',
    action: function(params) {
    	const id_num = params.bracid;
    	console.log(id_num);
    	console.log(Brackets.findOne({_id : id_num} ));
        BlazeLayout.render('bracket', { bracid : id_num }) ;
    }
});

FlowRouter.route('/all_brackets', {
	name : 'bracket_list',
	action: function(params){
		BlazeLayout.render('bracketlist');
	}
});

FlowRouter.route('/createbracket', {
	name : 'create_bracket',
	action: function(params, queryParams){
		console.log(queryParams['bracket_title']);
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

