import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Brackets } from '../lib/collection.js';
import { Entries } from '../lib/collection.js';

import { Session } from 'meteor/session';

import { Tracker } from 'meteor/tracker';


Tracker.autorun(() => {
  	Meteor.subscribe('singleBrac', Session.get('bracid'));
  	Session.set('errorMessage', '');
});

Template.bracket.helpers({
	'exists' : function(){
		var b_id = Session.get('bracid');
		console.log(Brackets.findOne({_id : b_id}));
		if( Brackets.findOne({_id : b_id}) == undefined){
			return false;
		}
		return true;
	},
	'title' : function(){
		var b_id = Session.get('bracid');
		return Brackets.findOne({_id : b_id})['title'];
	},
	'username': function(){
		var b_id = Session.get('bracid');
		return Brackets.findOne({_id : b_id})['username'];
	},
	'createdAt': function(){
		var b_id = Session.get('bracid');
		return Brackets.findOne({_id : b_id})['createdAt'];
	},
	'description' : function(){
		var b_id = Session.get('bracid');
		return Brackets.findOne({_id : b_id})['description'];
	},
	'brac_round' : function(){
		var b_id = Session.get('bracid');
		return Brackets.findOne({_id : b_id})['brac_round'];
	},
	'winnerFound' : function(){
		var b_id = Session.get('bracid');
		return Brackets.findOne({_id : b_id})['winnerFound'];
	},
	'all_entries' : function(){
		return this.brac['entries'];
	},
	'my_id' : function(){
		return FlowRouter.getParam("bracid");
	},
	'user_is_creator'  :function(){
		return Meteor.userId() === Brackets.findOne({_id : FlowRouter.getParam('bracid')})['owner'];
	},
	'username' : function(){
		if(Meteor.user())
			return Meteor.user().username;
		return null;
	},
	'user' : function(){
		return Meteor.userId();
	},
	'errorMessage' : function() {
		return Session.get('errorMessage');
	},
	'orderedentries' : function(){
		var b_id = Session.get('bracid');
		var bracket = Brackets.findOne({_id : b_id});
		return bracket['ord_entries'].map(function(obj){
			if(obj['entry'] === undefined){
				if(obj['matchup'] != null){
					var a = Session.get('chosenWinners');
					var m_int = Number(obj['matchup']);
					if(a[m_int] != null){
						var seed = a[m_int];
						rObj = {};
						rObj.entry = bracket['entries'][seed - 1];
						rObj.seed = seed;
						rObj.userChoice = true;
						return rObj;
					}
					return {matchup : m_int};
				}
				return null;
			}
			var rObj = obj;
			rObj.entry_title = obj['entry']['entry_title'];
			rObj.entry_id = obj['entry']['entry_id'];
			rObj.hasChoice = bracket['brac_round'] == null || bracket['brac_round'] === obj['round'];
			return rObj;
		});
	}, 
	'victorTitle' : function(){
		var b_id = Session.get('bracid');
		var ordent = Brackets.findOne({_id : b_id})['ord_entries'];
		if(ordent[(ordent.length / 2) - .5]['entry'] != null){
			var winningTitle = ordent[(ordent.length / 2) - .5]['entry']['entry_title'];
			return winningTitle;
		}
		else {
			return '';
		}
	},
	'victorImage' : function(){
		var b_id = Session.get('bracid');
		var ordent = Brackets.findOne({_id : b_id})['ord_entries'];
		if(ordent[(ordent.length / 2) - .5]['entry'] != null){

			var winningImage = ordent[(ordent.length / 2) - .5]['entry']['image_url'];
			return winningImage;
		}
		else {
			return '';
		}
	}
});

Template.bracket.events({
	'click #submitVotes'(event, instance) {
		Meteor.call('singleBrac.vote', Session.get('bracid'), Meteor.userId(), Session.get('chosenWinners'), function(error, result){
			Session.set('errorMessage','');
			if(error){
				Session.set('errorMessage', 'Unable to process votes: ' + error['error']);
				return;
			}
			Session.set('chosenWinners', {});
			FlowRouter.go('bracket', {bracid : Session.get('bracid')});
		});
	},
	'click #deleteBracket'(event, instance){
		Meteor.call('brackets.remove',  Session.get('bracid'), function(error, result){
			Session.set('errorMessage','');
			if(error){
				Session.set('errorMessage', 'Unable to delte bracket: ' + error['error']);
				return;
			}
			Session.set('chosenWinners', {});
			Session.set('bracid', id_num);
			FlowRouter.go('createbracket');
		});
	},
	'click #nextRound'(event, instance){
		Meteor.call('singleBrac.nextRound', Session.get('bracid'));
	}
});

