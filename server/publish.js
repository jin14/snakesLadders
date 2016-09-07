Meteor.publish('players',function(){
	return PlayerList.find({}, {limit:4});
});
