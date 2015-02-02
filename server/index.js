Sites = new Meteor.Collection("sites");

Meteor.publish("site", function(){
	return Sites.find({"url": this.connection.httpHeaders.host.split(":").shift()});
});

Meteor.methods({
	getHeaders: function(){
		return this.connection.httpHeaders;
	},

	hostName: function(){
		return this.connection.httpHeaders.host.split(":").shift();
	}
});

Sites.allow({
	update: function(userId, doc, fieldNames, modifier) {
		return true;
	}
});