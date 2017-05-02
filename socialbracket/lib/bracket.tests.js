import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Brackets } from './collection.js';
import { Entries } from './collection.js';

import { ProcessRound } from './bracket.js';

import { Bracket } from './bracket.js';

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

  // Game tree test 

  // Bracket test
  describe('Brackets', () => {
    describe('methods', () => {
      const userId = Random.id();

      beforeEach(() => {
      	Brackets.remove({});
        Brackets.insert({
          entries : [null, null, null, null],
          brac_id : 1,
          title : 'default title',
          description: 'default description',
          createdAt: new Date(),
          owner: userId,
          username: 'dcarballal',
        });
      });

      it('Insert Basic Bracket', () =>{
      	const initial_entries = ['Steve', 'Cameron', 'Joe', 'Mike'];
      	const b = new Bracket({entries : initial_entries});

        assert(b.num_teams, 4);
        assert(b.gt.orderedEntries(), 4);

      });

      it('Insert Bracket and Process Round', () =>{
      	const initial_entries = ['Steve', 'Cameron', 'Joe', 'Mike'];
      	const b = new Bracket({entries : initial_entries});
        //b.gt.ProcessRound();
        assert(b['num_teams'], 4);

      })
    });
  });
}