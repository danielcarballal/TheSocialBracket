import { Meteor } from 'meteor/meteor';

var main = require("./main.js");

// const Brackets = new Mongo.Collection('brackets');

Template.bracket.onCreated(function bracketOnCreated(){
	Meteor.subscribe('brackets');
	this.brac = Brackets.findOne({_id : FlowRouter.getQueryParam('bracid')});
	console.log(FlowRouter.getQueryParam('bracid'));
	if(this.brac === undefined){
		console.log('Warning: no bracket with id ' + FlowRouter.getQueryParam('bracid') + ' found')
	}
});

Template.bracket.helpers({
	'all_brac':function(){
		console.log(Brackets.find().fetch());
	},
	'title' : function(){
		return Brackets.findOne({_id : FlowRouter.getQueryParam('bracid')});
	},
	'all_entries' : function(){
		return Brackets.findOne({_id : FlowRouter.getQueryParam('bracid')})['entries'];
	},
	'my_id' : function(){
		return FlowRouter.getParam("bracid");
	},
	'all_entries_basic' : function(){
		console.log(FlowRouter.getQueryParam('bracid'));
		return Brackets.findOne({_id : FlowRouter.getQueryParam('bracid')})['entries'];
	}
});