
/*
	Class for an entry participating in a bracket.

	@Parameters:
	entry_id : unique ID of some entry
	title: Title of the entry
	description: Seriously, pretty easy
	image_url: Contains the answer to life, love and everything.

*/
export const Entry = function (entry_id, title, description, image_url){
	this.entry_id = entry_id;
	this.title = title;
	this.description = description;
	this.image_url = image_url;
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
export const Bracket = function (brac_dict) {

	// Bracket ID. Not strictly necessary for data manipulation, but nice to have for debugging.
	this.brac_id = brac_dict['brac_id'];

	//Title of bracket
	this.brac_title = brac_dict['title'];
	this.brac_desc = brac_dict['description'];
	brac_entries = brac_dict['entries'];

	this.gt = new GameTree(brac_entries);

	this.num_teams = brac_entries.length;

	num_rounds = Math.log(this.num_teams)/Math.log(2);
	this.cur_round = 1;

	/*
		Process a round. We will check for the winner of each of the games.

		@ Return: string of a log of the round processed.
	*/
	this.processRound = function() {
		this.gt.processRound();
	};

	/* Returns list of ordered entries ready for printing */
	this.orderedEntries = function(){
		return this.gt.orderedEntries();
	}
}

/*
	Representation of a tree of games. Can return the entries with their corresponding round.
*/
export const GameTree = function(initial_entries){
	numTeams = initial_entries.length;

	this.numTeamsLeft = initial_entries.length;

	this.brac_round = 1;

	var champion = {votesFor : 0, decided : false};

	var round = [champion];
	while(round.length < numTeams / 2 && round.length != 0){
		//var cur_round = [];
		var temp_round = [];
		for(game_index in round){
			var game = round[game_index];

			var child1 = {votesFor : 0, decided : false};
			var child2 = {votesFor : 0, decided : false};

			game.child1 = child1;
			game.child2 = child2;

			var entry_func = function() { 
				if(!decided){
					return 'Undecided';
				}
				if(child1.votesFor > child2.votesFor){
					return child1.entry();
				}
				return child2.entry();
			}
			game.entry = entry_func;

			temp_round.push(child1);
			temp_round.push(child2);

			//cur_round.push(game);
		}
		round = temp_round;
	}

	var seed1 = 1;
	/* Generate the leaf nodes: the entries themselves */
	for(game_index in round){

		seed2 = numTeams - seed1 + 1;

		seed1_func = {
						numVotes : 0, 
						seed : seed1, 
						matchup: game_index,
						round : 1,
						entry: initial_entries[seed1 - 1], 
					};
		seed2_func = {
						numVotes : 0, 
						seed : seed2, 
						matchup: game_index,
						entry: initial_entries[seed2 - 1], 
					};

		var entry1 = {
						decided: true, 
						entry: seed1_func
					};

		var entry2 = {
						decided: true, 
						entry: seed2_func
					};

		var game = round[game_index];
		game.child1 = entry1;
		game.child2 = entry2;

		var entry_func = function() { 
			if(child1.votesFor > child2.votesFor){
				return child1.entry();
			}
			return child2.entry();
		}

		game.entry = entry_func;

		seed1++;
	}

	this.headNode = champion;

	/* Recursive function to process a bracket round. Start at root, and if a node
	has its children decided  */
	this.processRoundWrapped = function(node){

		if(node == undefined){
			console.log("Warning : Misformatted bracket");
			return;
		}
		// Don't mess with my leaf nodes!
		if(node.child1 != null){
			//last round was processed 
			if(node.child1.decided){
				console.log('******');
			} else {
				node.child1 = this.processRoundWrapped(node.child1);
				node.child2 = this.processRoundWrapped(node.child2);
			}
		}
		return node;
	}

	this.processRound = function(){
		this.headNode = this.processRoundWrapped(this.headNode);
	}

	/* Prints the bracket */ 
	this.orderedEntriesWrapped = function(node, retOrdered){
		// Is leaf node, definetly print
		if(node == null){ return undefined; }
		this.orderedEntriesWrapped(node.child1,retOrdered);
		if(node.child1 === undefined){
			var entry_push = node['entry'];
			entry_push.round = 0;
			retOrdered.push(entry_push);
		}
		else if(node.child1.decided){
			console.log('~~~~~~~~');
			console.log(node.child1);
			console.log(node.child1['entry']);
			var entry_pushed = {matchup : node.child1['entry']['matchup']};
			retOrdered.push(entry_pushed);
		}else{
			retOrdered.push(' Undecided!!');
		}
		this.orderedEntriesWrapped(node.child2, retOrdered);
		return retOrdered;
	}

	this.orderedEntries = function(){
		retOrdered = [];
		this.orderedEntriesWrapped(this.headNode, retOrdered);
		return retOrdered;
	}

	this.recordVoteWrapped = function(node, matchup, seed_id){
		if(node == null) return false;

		// Currently has an entry, so is play and we should not have to check the children
		if(node['entry'] != null ){
			if(node['entry']['matchup'] == matchup){
				console.log('(((((((((((');
				console.log(node['entry']);
			}
		}
	}

	this.recordVote = function(matchup, seed){
		console.log('Recording vote');
		const a = this.recordVoteWrapped(this.headNode, matchup, seed);
		return a;
	}
};

export const GameTreePlayed = function(initial_entries, games_so_far){
	console.log('OTHER GAME TREE');	
}