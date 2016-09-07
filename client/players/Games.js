// Meteor.subscribe('game');
Meteor.subscribe('players');

randomInt=function(xmin,xmax) {
    // random integer in range {min, max}, including min and max
    return Math.floor( Math.random() * (xmax + 1 - xmin) + xmin ); 
};

isPrime=function(number){
    var start = 2;
    while (start<= Math.sqrt(number)){
        if(number %  start++ < 1) return false;
    }
    return number >10;
};

isTens=function(number){
    if ((number%10)==0){
        return true;
    }
    return false;
};

Template.Games.helpers({
    count:()=> {
        if(PlayerList.find({}).count()==4){
            return false;
        }
        else{
            return true;
        }
    },
});

Template.Players.onCreated(function PlayersOnCreated() {
  // counter starts at 0
});

Template.Players.helpers({
	players:()=> {
		return PlayerList.find({});
	},
    id:function(){
        return this._id;
    },

    // IDS:function(){
    //     var ids = [];
    //     for (var k=0; k<PlayerList.find({}).count(); k++){
    //         ids.push(PlayerList.find({}).fetch()[k]._id);
    //     };
    //     return ids;
    // },
});



Template.Players.events({
	'click .btn-primary'(event, instance){


        //array of ids
        var ids = [];
        //array of points
        var pointsArr = [];

        for (var k=0; k<PlayerList.find({}).count(); k++){
            ids.push(PlayerList.find({}).fetch()[k]._id);
        };

        var number = randomInt(1,6);
        var data = PlayerList.find({_id: this._id}).fetch()[0];
        var final = data.points + number;
        var index = ids.indexOf(this._id);
        var total = PlayerList.find({}).count();
        var next = index==total-1 ? 0 : index+1 ;


        //enabling of roll buttons for next player
        for (var i=0; i<total; i++){
            if(i==next){
                $('#'+ids[i]).prop('disabled',false);
                PlayerList.update({_id: ids[i]}, {$set:{turn: "Your Turn"}});   
            }
            else{
                $('#'+ids[i]).prop('disabled',true);
                PlayerList.update({_id: ids[i]}, {$set:{turn: "N"}});  
            }
        };


        for (var k=0; k<PlayerList.find({}).count(); k++){
            pointsArr.push(PlayerList.find({}).fetch()[k].points);
        };
        console.log(pointsArr);
        if( (data.points + number) != 100 ){
            
            if (final > 100){
                var diff = final - 100;
                final = 100 - diff;
                PlayerList.update({_id: this._id}, {$set:{points: final, message: "Previous: " + data.points + " Rolled: " + number + " Grid: " + final }});
            } else if (pointsArr.indexOf(final)!=-1){
                PlayerList.update({_id: this._id}, {$set:{points: 0, 
                    message:"Previous: " + data.points + " Rolled: " + number + " Grid " + final + " has already been taken up! Back to 0! Bad luck" }});
            } else if (isPrime(final)){
                final = final - 5;
                if (pointsArr.indexOf(final)!=-1 && pointsArr.indexOf(final)!=index){
                    PlayerList.update({_id: this._id}, {$set:{points: 0, 
                    message:"Previous: " + data.points + " Rolled: " + number + " !\nBut you hit a snake! Go back by 5!"+ " Grid: " + final + " has already been taken up! Back to 0! Bad luck" }});
                } else {
                    PlayerList.update({_id: this._id}, {$set:{points: final, 
                    message:"Previous: " + data.points + " Rolled: " + number + " Grid: " + final + " !\nBut you hit a snake! Go back by 5!"}});
                }
            } else if (isTens(final)){
                final = final + 4;
                if (pointsArr.indexOf(final)!=-1 && pointsArr.indexOf(final)!=index) {
                    PlayerList.update({_id: this._id}, {$set:{points: 0, 
                    message:"Previous: " + data.points + " Rolled: " + number + " Grid: 0" + " !\nAnd you hit a ladder! Go forward by 4!" + " Grid: " + final + " has already been taken up! Back to 0! Bad luck" }});

                } else{
                PlayerList.update({_id: this._id}, {$set:{points: final, message: 
                    "Previous: " + data.points + " Rolled: " + number + " Grid: " + final + " !\nAnd you hit a ladder! Go forward by 4!"}});
                }
            } else {
                PlayerList.update({_id: this._id}, {$set:{points: final, message: "Previous: " + data.points + " Rolled: " + number + " Grid: " + final}});
            }
        } else {
            for (var i=0; i<total ; i++){
                $('#'+ids[i]).prop('disabled',true);
                if(ids[i]!=this._id){
                    PlayerList.update({_id: ids[i]}, {$set:{turn: "Game Over", message:"Bad Luck. You've lost!"}});
                } else {
                    PlayerList.update({_id: this._id}, {$set:{turn: "You've Won!", message:"Congrats! You've won!"}});
                }
            }
            PlayerList.update({_id: this._id}, {$set:{points: final}});
        }

    },

    'click .btn-danger'(event, instance){
        PlayerList.remove(this._id);
        for(i=0; i<PlayerList.find({}).count(); i++){
            $('#'+ PlayerList.find({}).fetch()[i]._id).prop('disabled',true);    
        }
    },
});

Template.Games.events({
    'click .btn-warning'(event,instance){
        var data = PlayerList.find({}).fetch();
        if (PlayerList.find({}).count()==4){
            for(i=0; i<PlayerList.find({}).count(); i++){
                PlayerList.update({_id: data[i]._id},{$set:{points:0, turn: "N", message: "Welcome!"}});
                $('#'+data[i]._id).prop('disabled',false);    
            }
        }
    }
});
