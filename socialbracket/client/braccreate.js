import { ReactiveVar } from 'meteor/reactive-var';

entry_id_array = [];
entries_react = new ReactiveVar([]);
//const Entries = new Mongo.Collection('entries');

Template.createbracket.onCreated(function createBracketOnCreated(){
	//console.log(params);
	Meteor.subscribe('brackets');
}
);

Template.createbracket.events({
	'click .next'(event, instance){
		var title = $('#bracket_title').val();
		var description = $('#bracket_description').val();
		var numteams = $('#numteams').val();
		var isPrivate = $('#private').val();

		BlazeLayout.render('createbracket', {title : title, description : description, numteams : numteams});
	},
	'click .create_entry'(event, instance){
		var title = $('#newEntryTitle').val();
		var description = $('#newEntryDescription').val();

		var entryid = Math.random().toString(36).substring(7);
		
		Meteor.call('brackets.newEntry', entryid, title, description);

		entry_id_array.push(title);
		entries_react.set(entry_id_array);

		console.log(entries_react.get());
	},
	'click #submit_bracket'(event, instance){
		console.log('Submitting bracket');
		Meteor.call('brackets.newBracket', this.title, this.description, entries_react, [2,3] );
	},
	'click .entrylist'(event,instance){

	}
});

Template.createbracket.helpers({
	'hasTitle' : function(){
		return this.numteams === undefined;
	},
	'missed_form' : function(){
		return this.description == "" || this.title == "";
	},
	'entries' : function(){
		console.log(entries_react.get());
		return entries_react.get();
	},
	'entry_needed' : function(){
		return [0,1];
	},
	'title' : function(){
		return FlowRouter.getParam('title');
	}
});

Template.entrylist.helpers({
	'all_entries' : function(){
		return Entries.find();
	}
});

Template.chosenentry.helpers({
	'name': function(){
		return Entries.findOne({ game_id : this.entryid });
	}
});