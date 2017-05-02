import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Brackets } from './collection.js';
import { Entries } from './collection.js';

import { Bracket } from './bracket.js';

/*
	Testing the functionality 
*/
function createBracketTest(){
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

	return b1;
}

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

if (Meteor.isServer) {
	//Entry test
	describe('Entries', () => {
  	beforeEach(() => {
  		Entries.remove({});
  		Entries.insert({
  			title : 'Entry',
  			description : 'description'
  		});
  		}
  	);

  	it('Entry basic insert', () => {
  		assert.equal(Entries.find().count(), 1);
  	})
  });

  // Bracket test
  describe('Brackets', () => {
    describe('methods', () => {
      const userId = Random.id();

      beforeEach(() => {
      	Brackets.remove({});
        Brackets.insert({
          initial_entries : null,
          brac_id : 1,
          title : 'default title',
          description: 'default description',
          createdAt: new Date(),
          owner: userId,
          username: 'dcarballal',
        });
      });

      it('Insert Null Bracket', () => {
        // Verify that the method does what we expected
        assert.equal(Brackets.find().count(), 1);

        assert.equal(Brackets.findOne({brac_id : 1})['description'], 'default description');
      });

      it('Insert Basic Bracket', () =>{
      	const initial_entries = ['Steve', 'Cameron', 'Joe', 'Mike'];
      	const b = new Bracket({initial_entries : initial_entries});
      	Brackets.insert({
      	  brac : b,
          brac_id : 2,
          title : 'Basic Bracket',
          description: 'Choose your favorite',
          createdAt: new Date(),
          owner: userId,
          username: 'dcarballal',
        });

        assert(Brackets.findOne({brac_id : 2})['brac']['num_teams'], 4);

      });

      it('Insert Bracket and Process Round', () =>{
      	const initial_entries = ['Steve', 'Cameron', 'Joe', 'Mike'];
      	const b = new Bracket({initial_entries : initial_entries});

      	Brackets.insert({
      	  brac : b,
          brac_id : 2,
          title : 'Basic Bracket',
          description: 'Choose your favorite',
          createdAt: new Date(),
          owner: userId,
          username: 'dcarballal',
        });
        assert(Brackets.findOne({brac_id : 2})['brac']['num_teams'], 4);

      })
    });
  });
}