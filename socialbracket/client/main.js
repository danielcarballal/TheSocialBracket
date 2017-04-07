import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor'

import './main.html';

Template.header.onCreated(function headerOnCreated(){
});

Template.header.helpers({
	has_user(){
		return Template.instance.user.get() == null;
	},
	username(){
		if(Template.instance().user.get() == null){
			return "No user";
		}
		return Template.instance.user.get().username;
	}
});

// The spacing, in px
SPACE = 50;

Template.round.helpers({
	num_round(){
		return 0;
	},
	num_entries(){
		return 8;
	},
	spacing() {
		return SPACE;
	},
	width(){
		return 4;
	}
});

Template.round.helpers({
	num_round(){
		return 1;
	},
	num_entries(){
		return 4;
	},
	spacing() {
		return SPACE * 2;
	},
	width(){
		return 4;
	}
});
