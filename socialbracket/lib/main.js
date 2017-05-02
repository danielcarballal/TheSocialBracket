import { Bracket } from './bracket.js';

import { Entry } from './bracket.js';
import { Meteor } from 'meteor/meteor';

import { Brackets } from './collection.js';
import { Entries } from './collection.js';

import { check } from 'meteor/check';

/*
	Meteor class: brackets
*/

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
		/*
			Meteor Method: brackets.insert

			Usage: Insertion to the main Brackets entry. We require a unique title and description or a
		    Meteor error is thrown. 
	
			Inserting a bracket requires a transformation from a data type doc of with the following attributes:

				- title : Title of the bracket
				- description : Description of the bracket
				- entries: List of entries of allowed length (4, 8, 16)
				- owner : OwnerID of the bracket.
				- username : Optional, allows for a username to be displayed
		*/
		'brackets.insert'(doc){
			if (! this.userId) {
		      throw new Meteor.Error('You must be logged in to create a bracket.');
		    }

		    if( doc['title'] == null || doc['title'] == ''){
		    	throw new Meteor.Error('You must have a title for your bracket.');
		    }

		    /*
		    	Asynchronous call to the Brackets to ensure that no bracket with the same title and description exist
		    */
		    const brac = Brackets.findOne({ title : doc['title'], description : doc['description'] })
		    if (brac != undefined ){
		    	throw new Meteor.Error('A Bracket with that title and description already exists');
		    }

			Brackets.insert({
				title : doc['title'],
				description : doc['description'],
				entries : doc['entries'],
				createdAt: new Date(),
		      	owner: doc['owner'],
		      	username: doc['username'],
		      	round : 0
			});
		},
		/*
			Meteor method to remove a bracket completely.
		*/
		'brackets.remove'(brac_id){
			const bracket = Brackets.remove({_id : brac_id});
		},
		/*
			Meteor method to insert an entry.
		*/
		'entries.insert'(doc){
			Entries.insert(doc);
		},
		/*
			Meteor method to vote on a bracket.
		*/
		'singleBrac.vote'(bracid, user_id, votes_cast){
			Brackets.recordVote({_id : bracid},
					votes_cast, Meteor.userId());

			return true;
		},
		/*
			Meteor method to move a bracket to the next round
		*/
		'singleBrac.nextRound'(bracid){
			Brackets.nextRound({_id : bracid});
		},
		'entries.addOne'(entryid){
			Entries.update({_id : entryid}, {$set : 
							          { numVotes : $numVotes + 1 } 
							        } );
		}
	})

}
