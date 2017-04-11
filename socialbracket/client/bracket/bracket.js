
// const brackets = new Mongo.Collection('brackets');

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
	this.cur_round = 1;

	/*
		The number of rounds must match the number of entries in date_ending
	*/
	if(num_rounds != date_endings.length) {
		console.log("Warning: Improperly formatted Bracket entry: Make sure that 2**(the number of date_endings) = (number of entries)");
		return null;
	};

	/*
		Array of Game objects representing the results of the games so far.
	*/
	this.games_array = [];
	this.games_finished = []

	/*
		Initialize the array based on the first_round entries
	*/
	this.first_round = function() {
		for(var i = 0; i < this.num_teams / 2; i++){
			var game = new Game(entries[i].entry_id, entries[this.num_teams - (i + 1)].entry_id);
			this.games_array.push(game);
		}
		for(var i = 0; i < this.num_teams / 2 - 1; i++){
			this.games_array.push(null);
		}
	};

	this.first_round();

	/*
		Prints the bracket to the returned string
	*/
	this.printbracket = function() {
		ret = '';
		var n = this.num_teams;
		var i = 0;
		ret += this.brac_title + '\n';
		ret += 'Round ' + this.cur_round + '\n';
		console.log(this.games_array);
		while(i < this.games_array.length){
			if(this.games_array[i] != null){
				ret += 'In game ' + (i + 1) + ' : ';
				ret += entries[this.games_array[i]['entry1']].title + ' is playing ' + this.games_array[i]['entry2'] + '.\n';
			}
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
		var i = 0;

		for(var index in this.games_array){
			var game = this.games_array[index];
			if(game != null && game.finished === false){
				if(votes_array[i] != 0){
					game.add_vote(votes_array[i] === 1, user_id);
					ret += 'Voter ' + user_id + ' voted for ' + votes_array[i];
				}
				i++;
			}
		}
		return ret;
	}

	
	/*
		Process a round. We will check for the winner of each of the games.

		@ Return: string of a log of the round processed.
	*/
	this.process_round = function() {
		var log = "";

		var team1_id = null;
		var new_games = {};

		for(var i in this.games_array){
			var game = this.games_array[i];
			if(game != null){
				if(game.finished === false){
					var team_id = game.winner();
					if(team1_id === null){
						team1_id = team_id;
						log += team1_id + '\n';
					} else {
						var g = new Game(team1_id, team_id);
						log += 'New game added ' + team1_id + ' , ' + team_id;
						var i = 0;
						while(this.games_array[i] != null){
							i++;
						}
						if(i === this.games_array.length){
							log += "\n The bracket has finished";
							return log;
						}
						new_games[i] = g;
						team1_id = null;
					}
					game.finished = true;
				}
			}
		}
		for(i in new_games){
			this.games_array[i] = new_games[i];
		}
		this.cur_round += 1;
		return log;
	};
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

	this.finished = false;

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
		if (this.entry1_votes.size > this.entry2_votes.size ){
			return this['entry1'];
		} else if (this.entry1_votes.size < this.entry2_votes.size ){
			return this['entry2'];
		}
		return this['entry1'];
	}

	/*
		Returns the entry that is currently winning.

		TODO: Account for some sort of tiebreaker
	*/
	this.loser = function(){
		if (this.votes_1() > this.votes_2()){
			return this['entry2_id'];
		} else if (this.votes_1() < this.votes_2()){
			return this['entry1_id'];
		}
		return this['entry2_id'];
	}
}


entries = {}

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
	entries[entry_id] = this;

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