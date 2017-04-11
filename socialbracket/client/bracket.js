import { Meteor } from 'meteor/meteor';


var brackets = new Mongo.Collection('brackets');
// const users = new Mongo.Collection('users');
var entries = new Mongo.Collection('entries');


Template.bracket.helpers({
	'title' : function(){
		return 'What is the best party University in Illinois?';
	},
	'num_teams' : function(){
		return 4;
	},
	'all_brackets' : function(){
		console.log('********');
		console.log(brackets.find({brac_id : 1}).fetch());
		return brackets.find({brac_id : 1}).fetch();
	},
	'all_entries' : function(){
		console.log(brackets.findOne({brac_id : 1}));
		return brackets.findOne({brac_id : 1})['entries'];
	}
});

/*
The Bracket Class

A class to store and update a bracket. A bracket consists of a number of
entries

@Parameters:
brac_id = Unique int id of bracket
brac_title = String title of the bracket, usually giving the user a clue about what attribute
they should consider the entries on
entries = Array of Entry objects, with a power of 2 of entries. The order denotes the first
round of games, with the first entry playing the last entry, the second with the second-to-last
and so on.
date_endings: Array of Dates that signify when each round should end

*/ 
function Bracket(brac_id, brac_title, entries, date_endings) {
	this.brac_id = brac_id;
	this.brac_title = brac_title;
	this.num_teams = entries.length;
	num_rounds = Math.log(this.num_teams)/Math.log(2);
	cur_round = 0;

	/*
		The number of rounds must match the number of entries in date_ending
	*/
	if(num_rounds != date_endings.length) {
		console.log("Warning: Improperly formatted Bracket entry");
		return null;
	};

	/*
		Array of Game objects representing the results of the games so far.
	*/
	this.games_started = [];
	this.games_completed = [];

	/*
		Initialize the array based on the first_round entries
	*/
	this.first_round = function() {
		for(var i = 0; i < this.num_teams / 2; i++){
			var game = new Game(entries[i].entry_id, entries[this.num_teams - (i + 1)].entry_id);
			console.log(game);
			this.games_started.push(game);
		}
	};

	this.first_round();

	/*
		Prints the bracket to the returned string
	*/
	this.printbracket = function() {
		var ret = '';
		var n = this.num_teams;
		var i = 0;
		ret += this.brac_title + '\n';
		while(n >= 0 && i < this.games_completed.length){
			ret += 'In round ' + (i + 1) + '\n';
			ret += this.games_completed[i].get_entry1() + ' is playing ' + this.games_completed[i].entry2 + '\n';
			i++;
		}
		i = 0;
		while(i < this.games_started.length){
			ret += 'Right now\n';
			ret += this.games_started[i].get_entry1() + ' is playing ' + this.games_started[i].entry2 + '\n';
			i++;
		}
		return ret;
	};

	/*
		When a user votes, we will update the games in that bracket with their votes. The votes array will
		determine the votes for the games of the current round. It must be the same length as the number
		of 

		Votes of index i can be three values: 0 for no choice, 1 for entry 1, and 2 for entry 2 for game i.

		@Parameters
		user_id: Id of the user
		votes_array: Array of vote tallies

		@Returns String with the log of the votes recorded. Empty if no votes recorded
	*/
	this.record_user_votes = function(user_id, votes_array){
		var ret = "";
		if(votes_array.length != this.games_started.length){
			return "";
		}

		var game_index = 0;
		for(game in this.games_started){
			// 0 denotes non-vote
			if(votes_array[game_index] != 0){
				this.games_started[game_index].add_vote(votes_array[game_index] == 1, user_id);
				ret += "Voter " + user_id + " voted in game " + game_index + ' for ' + votes_array[game_index] + ' \n';
			}
			game_index++;
		}
		return ret;
	}

	
	/*
		Process a round. We will check for the winner of each of the games.

		@ Return: string of a log of the round processed.
	*/
	this.process_round = function() {
		var log = "";
		for(var game in this.games_started){
			this.games_completed.push(game);
		}

		this.games_started = []

		var num_games = this.games_completed.length;
		var num_teams_left = this.num_teams - this.games_completed.length;

		for(var i = this.num_teams_left - 1; i > 0; i += 2){
			var team1_id = games_completed[num_games - i].winner();
			var team2_id = games_completed[num_games - i + 1].winner();

			log += team1_id + ' has won and will face ' + team2_id + ' in the next round \n';

			var g = new Game(team1_id, team2_id);
			print(g);
			this.games_started.push(g);
		}
		console.log(this.games_started);
		return log;
	};

	/*
		Saves an entry in the following form:

			{game_id, seed, round_num, title, description, image_url, can_vote}

		If an entry has not been determined yet, then game_id=-1
	*/
	this.save_entry = function(entry, seed){

	}

	/*
		Save a bracket to the database in the following schema:

		brac_id: Unique id of a bracket 

		entries: Ordered entries on where they appear on the tree

		brackets.insert(
				{brac_id : 1,
				entries : [ {game_id : 1, seed : 1, round_num : 1, title : 'First', description : '', image_url: '', can_vote:false},
							{game_id : 2, seed : 1, round_num : 2, title : 'First', description : '', image_url:'', can_vote:true},
							{game_id : 3, seed : 2, round_num : 1, title : 'Second', description : '', image_url:'',can_vote: false} ],
				num_teams : 2,
				date_endings: [ 1, 2, 3 ]
				}
				)
	*/
	this.save_bracket = function() {
		brackets.update(
			{brac_id : this.brac_id},
			{
				brac_id : this.brac_id,

			},
			{upsert : true}
			)
	}
}

/*
	Representation of a single game in a bracket

	@Parameters
	entry1_id: int representing the unique entry id of the first entry
	entry2_id: int representing the unique entry id of the first entry
*/
function Game(entry1_id, entry2_id){

	this.entry1 = entry1_id;
	this.entry2 = entry2_id;

	this.get_entry1 = function(){ 
		return entry1_id
	};

	this.entry2 = entry2_id;

	/**
		Sets representing the voter id's who voted for a given side.
	*/
	this.entry1_votes = new Set();
	this.entry2_votes = new Set();

	/*
		Method for adding a vote to a game by voter with voter_id

		@Parameters
		is_entry_1: boolean. True represents a vote for entry 1, False represents
		a vote for entry 2.
		voter_id: 

		
		Returns whether the vote was recorded accuretly.
	*/
	this.add_vote = function(is_entry_1, voter_id){
		if (voter_id == null){
			return false;
		}
		if (is_entry_1){
			if (this.entry2_votes.has(voter_id)){
				this.entry2_votes.delete(voter_id);
			} else if (this.entry1_votes.has(voter_id)){
				return false;
			}
			this.entry1_votes.add(voter_id);
			return true;
		} else {
			if (this.entry1_votes.has(voter_id)){
				this.entry1_votes.delete(voter_id);
			} else if (this.entry2_votes.has(voter_id)){
				return false;
			}
			this.entry2_votes.add(voter_id);
			return true;
		}
	}

	/*
		Returns the entry that is currently winning.

		TODO: Account for some sort of tiebreaker
	*/
	this.winner = function(){
		if (this.entry1_votes > this.entry2_votes){
			return this.entry1_id;
		} else if (this.entry1_votes < this.entry2_votes){
			return this.entry1_id;
		}
		return 
	}
}

/*
	Class for an entry participating in a bracket.

	@Parameters:
	entry_id : unique ID of some entry
	title: Title of the entry
	description: Seriously, pretty easy
	image_url: Contains the answer to life, love and everything.

*/
function Entry(entry_id, title, description, image_url){
	this.entry_id = entry_id;
	this.title = title;
	this.description = description;
	this.image_url = image_url;

	this.get_entry_id = function(){return this.entry_id;};
	this.get_title = function(){return this.title;};
}

/*
	Function for retrieving the entry from entries with entry id eid
*/
function getEntry(eid, entries){
	for(entry in entries){
		if(entry.get_entry_id == eid) return entry;
	}
}