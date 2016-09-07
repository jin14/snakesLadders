// Game = new Meteor.Collection('game');
PlayerList = new Mongo.Collection('players');

// Game.allow({
// 	insert: function(userId,doc){
// 		return !!userId;
// 	}
// });

PlayersSchema = new SimpleSchema({
	name: {
		type: String,
		label: "Name"
	},

	points: {
		type: Number,
		label: "Points",
		defaultValue: 0,
		autoform: {
			type: "hidden"
		}
	},

	createdAt: {
		type: Date,
		label: "CreatedAt",
		autoValue: function(){
			return new Date()
		},
		autoform: {
			type: "hidden"
		}
	},

	turn: {
		type: String,
		label: "Turn",
		defaultValue: "N",
		autoform: {
			type: "hidden"
		}
	},

	message: {
		type: String,
		label: "Prompts",
		defaultValue: "Welcome!",
		autoform: {
			type: "hidden"
		}
	},	

	// message: {
	// 	type: String,
	// 	label: "Prompts",
	// 	defaultValue: "",
	// 	autoValue: {
	// 		type: "hidden"
	// 	}
	// }
});

// GameSchema = new SimpleSchema({
// 	players: {
// 		type: [PlayersSchema],
// 		minCount: 4,
// 		maxCount: 4
// 	},
// 	author: {
// 		type: String,
// 		label: "Author",
// 		autoValue: function(){
// 			return this.userId
// 		},
// 		autoform: {
// 			type: "hidden"
// 		}
// 	},
// 	currentTurn: {
// 		type: Number,
// 		label: "name",
// 		autoValue: function(){
// 			return 0
// 		},
// 		autoform: {
// 			type: "hidden"
// 		}
// 	}
// });

// Game.attachSchema( GameSchema );
PlayerList.attachSchema( PlayersSchema);