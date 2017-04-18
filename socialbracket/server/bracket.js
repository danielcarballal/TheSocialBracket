
/*
	Class for an entry participating in a bracket.

	@Parameters:
	entry_id : unique ID of some entry
	title: Title of the entry
	description: Seriously, pretty easy
	image_url: Contains the answer to life, love and everything.

*/
exports.Entry = function(entry_id, title, description, image_url){
	this.entry_id = entry_id;
	this.title = title;
	this.description = description;
	this.image_url = image_url;
	this.num_votes = 0;

	this.get_entry_id = function(){
		return this.entry_id;
	}

	this.get_title = function(){
		return this.title;
	};
}

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
exports.Bracket = function(brac_id, brac_title, brac_entries, date_endings) {
	this.brac_id = brac_id;
	this.brac_title = brac_title;
	this.num_teams = brac_entries.length;
	num_rounds = Math.log(this.num_teams)/Math.log(2);
	this.cur_round = 1;

	this.num_games_this_round = this.num_teams / 2;
	this.num_games_finished = 0;

	this.entries = {}

	/*
		Initialize this.entries to map entry id's to 
	*/
	for(var i = 0; i < brac_entries.length; i++){
		this.entries[brac_entries[i]['entry_id']] = brac_entries[i];
	}

	/*
		The number of rounds must match the number of entries in date_ending
	*/
	if(num_rounds != date_endings.length) {
		console.log("Warning: Improperly formatted Bracket entry: Make sure that 2**(the number of date_endings) = (number of entries)");
		return null;
	};

	/*
		Array of Game objects representing the results of the games so far. Will start with many null games, should never need to grow after initizialization
	*/
	this.games_array = [];

	/*
		Initialize the array based on the first_round entries
	*/
	this.first_round = function() {
		for(var i = 0; i < this.num_teams / 2; i++){
			var game = new Game(brac_entries[i], brac_entries[this.num_teams - i - 1]);
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
				if(entries[this.games_array[i]['entry2']] != null){
					ret += entries[this.games_array[i]['entry1']].title + ' is playing ' + entries[this.games_array[i]['entry2']].title + '.\n';
			}	}
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
					if(votes_array[i] === 1){
						game.add_vote(true, user_id);
						ret += 'Voter ' + user_id + ' voted for ' + getEntry(game['entry1']).get_title() + '\n';
					} else {
						game.add_vote(false, user_id);
						ret += 'Voter ' + user_id + ' voted for ' + getEntry(game['entry2']).get_title() + '\n';
					}
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

		//this.num_teams / (this.cur_round  + 1) represents the number of games this round
		var games_this_round = this.num_teams / Math.pow(this.cur_round,2);

		for(var game_ind = this.num_games_finished; game_ind < this.num_games_finished + games_this_round; game_ind++){
			var game = this.games_array[game_ind];
			if(game != null){
				console.log(game);
				if(game.finished === false){
					var team_id = game.winner();
					if(team1_id === null){
						team1_id = team_id;
						var entry1 = game.entry1;
					} else {
						var i = game_ind;
						while(this.games_array[i] != null || new_games[i] != null){
							i++;
						}
						console.log(log);
						if(i >= this.games_array.length){
							log += "\n The bracket has finished";
							return log;
						}
						var g = new Game(team1_id, team_id);
						log += 'New game ' + i + ' added between ' + team1_id + ' ' + team_id + '\n';
						new_games[i] = g;
						team1_id = null;
					}
					console.log(log);
					game.finished = true;
				}
			}
		}
		this.num_games_finished += games_this_round;


		if(team1_id != null){
			return "ERROR: There were an odd number of teams found";
		}

		for(i in new_games){
			this.games_array[i] = new_games[i];
		}
		this.cur_round += 1;
		return log;
	};

	this.load_entries = function(){

	}

	/*
		Saves an entry in the following form:

			{game_id, seed, round_num, title, description, image_url, can_vote}

		If an entry has not been determined yet, then game_id=-1

		will save to the MongoDB
	*/
	this.save_entry = function(entry, seed){

	}

	/* Returns list of ordered entries ready for printing */
	this.ordered_entries = function(){
		
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
function Game(entry1, entry2){

	this.entry1 = entry1['entry_id'];
	this.entry2 = entry2['entry_id'];

	console.log('Game created ' + this.entry1 + ' vs ' +this.entry2);

	this.bracket_entry_1 = entry1;
	this.bracket_entry_2 = entry1;

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
		this.entry1.votes++;
		this.entry2.votes++;
	}

	/* Returns a string describirng the state of this game */
	this.matchup = function(){
		if(this.winner() === this.entry1){
			return bracket_entry_1['title'] + ' is leading ' + bracket_entry_2['title'] + 
				' by ' + Math.abs(this.entry1_votes.size - this.entry2_votes.size) + ' votes\n'; 
		} else {
			return bracket_entry_2['title'] + ' is leading ' + bracket_entry_1['title'] + 
				' by ' + Math.abs(this.entry1_votes.size - this.entry2_votes.size) + ' votes\n'; 
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
		if (this.entry1_votes.size < this.entry2_votes.size ){
			return this['entry1'];
		} else if (this.entry1_votes.size > this.entry2_votes.size ){
			return this['entry2'];
		}
		return this['entry1'];
	}
}