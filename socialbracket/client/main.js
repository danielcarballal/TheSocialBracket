import './main.html';

Template.header.onCreated(function headerOnCreated(){

});

Template.header.helpers({
	'has_user' : function(){
		return Template.instance.user.get() == null;
	},
	'username' : function(){
		return '';
		if(Template.instance.user.get() == null){
			return "No user";
		}

		return Template.instance.user.get().username;
	}
});
