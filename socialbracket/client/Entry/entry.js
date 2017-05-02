import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import { Brackets } from '../../lib/collection.js';
import { Entries } from '../../lib/collection.js';

Template.entry.helpers({
	'haschoice' : function(){ 
		return (FlowRouter.getParam('gameid') === 7);
	},
	'entry_title' : function(){
		const entry = Entries.findOne({entry_id : this.entryid})['entry'];
		console.log(entry);
		if(entry)
			return entry['title'];
		else
			return ' None ';
	},
	'numVotes' : function(){
		return this.numVotes;
	}
});