import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

Template.entry.helpers({
	'entries_in_order' : function(){
		return [{val : 1}];
	},
	'entries': function(){
	    var currentUser = Meteor.userId();
	    return QuestionList.find({active: true});
	},
	'haschoice' : function(){ 
		console.log((this.gameid > 2**(this.round)) && (this.gameid <= 2**(this.round)));
		return (this.gameid > 2**(this.round)) && (this.gameid <= 2**(this.round + 1));
	}
})