
import { check } from 'meteor/check';

import { Bracket } from '../lib/bracket.js';
import { Entry } from '../lib/bracket.js';


/* Test whether each of the original games has the correct strength */
function createBracketTest(){
	var entries = [new Entry(0, 'Charles', 'He is a king', 'charles.jpeg'),
							new Entry(1, 'Mary', 'She is a queen', 'mary.jpeg'),
							new Entry(2, 'Sir Alexander', 'He is a knight', 'siralex.jpeg'),
							new Entry(3, 'McDulles', 'He is a general', 'mcdulles.jpeg'),
							new Entry(4, 'Straus', 'He is a merchant', 'charles.jpeg'),
							new Entry(5, 'Selia', 'She is a wizard', 'selia.jpeg'),
							new Entry(6, 'George', 'He is a peasant', 'george.jpeg'),
							new Entry(7, 'Smithy', 'He is a fool', 'smithy.jpeg') ];

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

	return b1;
}

/* Tests whether the users can vote a votes process. */
function processRoundTest(bracket){
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

}

// createBracketTest();

// processRoundTest();