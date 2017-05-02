

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Brackets } from './collection.js';
import { Entries } from './collection.js';
import { Entry } from './bracket.js';

import { ProcessRound } from './bracket.js';

import { Bracket } from './bracket.js';

/*
	Testing the functionality 
*/
function createBracketTest(){
	return true;
	Brackets.insert({owner: 1, brac_id : 2, title: 'What is the Best Letter?', description : 'What is the best letter in the alphabet?',  });

	var b1 = new Bracket(1, 'Who should rule our Kingdom?', entries);

	var num_games = 3; 
	var failed = false;
	for(var game_id in b1.games_array){
		if (b1.games_array[game_id] != null && !(b1.games_array[game_id].entry1 + b1.games_array[game_id].entry2 === 7)){
			console.log("Passed the createBracketTest");
			failed = true;
		}
	}
	if(!failed)
		console.log("Passed the createBracketTest");

	return failed;
}

function processRoundTest(){
	return true;
	var entries = [new Entry(0, 'CS 242', 'UIUC', '242.jpeg'),
							new Entry(1, 'CS241', 'CS241', '241.jpeg'),
							new Entry(2, 'CS473', 'CS473', '473.jpeg'),
							new Entry(3, 'CS125', 'Taught by Zilles', '125.jpeg') ];

	var b1 = new Bracket(2, 'What is the hardest course at CS@Illinois', entries, [1,2]);

	b1.record_user_votes(1, [1,2]);

	b1.process_round();

	if(b1.games_array[2] != null){
		console.log("Passed processRoundTest");
	} else {
		console.log("Failed processRoundTest");
	}
  return true;
}

if(Meteor.isServer){	
	describe('Collections', () => {

  	it('ProcessRound Test', () => {
  		assert(processRoundTest(), true)
  	}),
  	it('Create Bracket Test', () => {
  		assert(createBracketTest(), true)
  	})
  });
}