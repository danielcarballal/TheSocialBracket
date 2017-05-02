import { Bracket } from './bracket.js';

import { Entry } from './bracket.js';
import { Meteor } from 'meteor/meteor';

import { Brackets } from './collection.js';
import { Entries } from './collection.js';

import { check } from 'meteor/check';

if(Meteor.isServer){

	// Brackets.remove({});
	// Entries.remove({});

	Meteor.publish('brackets', function userPublication() {
		return Brackets.find({});
	});

	Meteor.publish('entries', function entryPublication() {
		return Entries.find({});
	});

	Meteor.publish('singleBrac', function (bracid){
		//check(bracid, String);
		this.bracid = bracid;
		return Brackets.find({ _id : bracid});
	} );

	Meteor.methods({
		// Inserting a bracket requires a transformation 
		'brackets.insert'(doc){
			if (! this.userId) {
		      throw new Meteor.Error('You must be logged in to create a bracket.');
		    }

			Brackets.insert({
				title : doc['title'],
				description : doc['description'],
				entries : doc['entries'],
				createdAt: new Date(),
		      	owner: doc['owner'],
		      	username: Meteor.users.findOne(this.userId).username,
		      	round : 0
			});
		},
		'brackets.remove'(brac_id){
			const bracket = Brackets.findOne({_id : brac_id});
		},
		'brackets.nextRound'(brac_id){
			const b = Brackets.findOne(brac_id);
			var bracket = b.brac;
			bracket.processRound();
			b.update(brac_id, { $set : {brac : bracket} });
		},
		'entries.insert'(doc){
			Entries.insert(doc);
		},
		'singleBrac.vote'(bracid, user_id, votes_cast){
			console.log('VOTE:');
			console.log(bracid);
			console.log(user_id);
			console.log(votes_cast);
			Brackets.recordVote({_id : bracid},
					votes_cast);

			return true;
		},
		'singleBrac.nextRound'(bracid){
			console.log(bracid);
			console.log(Meteor.userId());
			Brackets.nextRound({_id : bracid});
		}
	})

}
