/*!
 * \Language Javascript
 * \
 */

import { Bracket } from './bracket.js';
import { GameTree } from './bracket.js';

import { ProcessRound } from './bracket.js';
import { Mongo } from 'meteor/mongo';

import { _ } from 'underscore';

export class BracketsCollection extends Mongo.Collection {
  /*
    Insert with a doc with the following fields:

    doc = {
      title: TITLE OF BRACKET,
      description: Description of bracket
      creatorID: CREATOR OF BRACKET,
      num_teams : NUMBER OF TEAMS,
      private : IS THE BRACKET PRIVATE?,
      entries: 
      [
             
      ]
    }

    Inserts the following into the Bracket collection:
    insertDoc = {
      _id,
      title,
      creatorID,
      num_teams,
      private,
      entries = [ List of entries in format {seed, title, description, votesFor} ],
      ord_entries = viewable listing of list above
    }
  */
  insert(doc, callback) {
    var gt = new GameTree(doc['entries']);

    doc.ord_entries = gt.orderedEntries();

    doc.gt_struct = gt;
    doc.brac_round = 0;
    doc.usersVoted = [];

    console.log('****INFO****');
    console.log('Bracket creation process information');
    console.log(doc);

    const result = super.insert(doc, callback);
    return result;
  }

  /* 
    Record a vote. 

    selector - Selector for ids to record vote for. More than likely, it should be {_id : id}

    votedFor - Dictionary of matchup id's to the seed value for the user's choice. This does not need to
    have an entry for every possible value.

    userId - The voter's user ID
  */
  recordVote(selector, votedFor, userId) {
    /*
      Asynchronous call to Brackets database
    */
    const brac = Brackets.findOne(selector);
    const old_entries = brac['ord_entries'];

    if(old_entries === null){
      throw new Meteor.Error('Vote not recorded for unfound bracket');
      return;
    }
    if(brac['usersVoted'].indexOf(userId) != -1){
      throw new Meteor.Error('Users may only vote on a bracket once per round!!');
    }

    var new_entries = [];
    for(var i = 0, len = old_entries.length; i < len; i++){
      var entry = old_entries[i];
      var pushed = false;
      for(matchup in votedFor){
        var seedVotedFor = votedFor[matchup];
        if(seedVotedFor == entry['seed'] && matchup == entry['matchup']){
          entry['numVotes']++;
          new_entries.push(entry);
          pushed = true;
        }
      }
      if(!pushed){
        new_entries.push(entry);
      }
    }

    var newUsersVoted = brac['usersVoted'];
    newUsersVoted.push(userId);

    Brackets.update(selector, 
      {$set : { ord_entries : new_entries, usersVoted : newUsersVoted } } );
  }

  /*
    Next Round 

    Meteor Collection Method for updating all of the brackets found by selector
  */
  nextRound(selector){
    const original_entries = Brackets.findOne(selector)['ord_entries'];

    // process_func(original_entries);

    var ret_arr = ProcessRound(original_entries);

    var end_of_bracket = true;
    for(var i = 0; i < ret_arr.length; i++){
      if(ret_arr[i]['entry'] === undefined){
        end_of_bracket = false
      }
    }

    if(original_entries != null){
      Brackets.update(selector, 
        {$set : 
          { ord_entries : ret_arr,
            usersVoted : [],
            winnerFound : end_of_bracket },
        $inc :
          { brac_round : 1}
        }
      );
    } else {
      throw new Meteor.Error('Warning: unable to process round');
    }
  }

  /*
    Update will take the following parameters:
      doc {
        _id : id,
        voter_id : id of user,
        games : 
        update_round : true if the round should process after this (only can be called if owner is user)
      }
  */
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }

  remove(selector) {
    const result = super.remove(selector);
    return result;
  }

  find(selector) {
    const result = super.find(selector);
    return result;
  }
}


export class EntriesCollection extends Mongo.Collection {
  insert(doc, callback){
    var title = doc['entry_title'];
    const ent = Entries.findOne({entry_title : title});
    if (ent != undefined) {
      throw new Meteor.Error('Entry already exists!');
      return null;
    }
    const result = super.insert(doc, callback);
    return result;
  }
}

export const Brackets = new BracketsCollection('brackets');
export const Entries = new EntriesCollection('entries');

if(Meteor.isServer){
  console.log('******INFO*******');
  console.log('Bracket Information\n');
  console.log('Count : ' + Brackets.find({}).count());
  console.log('**************');

  console.log('******INFO*******');
  console.log('Entries Information\n');
  console.log('Count : ' + Entries.find({}).count());
  console.log('**************');
}

