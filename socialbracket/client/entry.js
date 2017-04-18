import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

Template.entry.onCreated( function entryOnCreated(){
	console.log('Created entry ' + FlowRouter.getParam('gameid') );
})

Template.entry.helpers({
	'haschoice' : function(){ 
		/* To do: Connect to db */
		return (FlowRouter.getParam('gameid') === 7);
	}
});