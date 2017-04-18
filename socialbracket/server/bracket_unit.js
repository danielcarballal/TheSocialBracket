
import { check } from 'meteor/check';

var brac = require("./bracket.js");


/* Test whether each of the original games has the correct strength */
function createBracketTest(){
	var entries = [new brac.Entry(0, 'Charles', 'He is a king', 'charles.jpeg'),
							new brac.Entry(1, 'Mary', 'She is a queen', 'mary.jpeg'),
							new brac.Entry(2, 'Sir Alexander', 'He is a knight', 'siralex.jpeg'),
							new brac.Entry(3, 'McDulles', 'He is a general', 'mcdulles.jpeg'),
							new brac.Entry(4, 'Straus', 'He is a merchant', 'charles.jpeg'),
							new brac.Entry(5, 'Selia', 'She is a wizard', 'selia.jpeg'),
							new brac.Entry(6, 'George', 'He is a peasant', 'george.jpeg'),
							new brac.Entry(7, 'Smithy', 'He is a fool', 'smithy.jpeg') ];

	var b1 = new brac.Bracket(1, 'Who should rule our Kingdom?', entries, [1,2,3]);

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
}

function processRoundTest(){

}



createBracketTest();