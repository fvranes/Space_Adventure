function menu(st, w, h){
	this.stage = st;
	this.width = w;
	this.height = h; ///import the stage, width and height values for the menu class
	this.txt = new Text("SPACE ADVENTURE", "36px Copperplate Gothic Bold", "#FFF"); //creates a text object for the game title
	this.txt.x = (this.width / 2) - (this.txt.getMeasuredWidth() / 2);//x position of this.txt
	this.txt.y = 100;///y position of this.txt


	this.guide = new Text("Press ENTER to start Game", "20px Copperplate Gothic Bold", "#FFF"); //creates a text object for instructions for starting the game
	this.guide.x = (this.width / 2) - (this.guide.getMeasuredWidth() / 2);//x position of this.guide
	this.guide.y = this.txt.y+50;//y position of this.guide

	this.credits = new Text("A game by Filip and Stan", "20px Copperplate Gothic Bold", "#FFF");///creates a text object for game credits
	this.credits.x = (this.width / 2) - (this.credits.getMeasuredWidth() / 2);///x position of this.credits
	this.credits.y = this.txt.y+550;///y position of this.credits
	
	this.image = new Bitmap("assets/images/spaceship/center/med_boost.gif");///create a bitmap of the spaceship for our menu
	this.image.scaleX = 4;//image width multiplied by 4 - image is essentially stretched
	this.image.scaleY = 4;//image height multiplied by 4 - image is essentially stretched
	this.image.x = this.width/2-80; //x position of this.image
	this.image.y = this.height/2+100;//y position of this.image
	
	this.score;//initialize the score variable

	this.start = function(){//when game starts, this function will be running

		this.stage.addChild(this.txt);//display title text
		this.stage.addChild(this.guide);//display game entry instructions text
		this.stage.addChild(this.credits);// display credits text
		this.stage.addChild(this.image);///display stretched image
	}
	this.gameOver = function(sc){ ///when the player runs out of lives, this function will be running
		this.stage.removeChild(this.score);//remove current score in the corner of the canvas
		this.stage.addChild(this.txt);//display title text again
		this.stage.addChild(this.guide);//display game entry instructions text again
		this.stage.addChild(this.credits);//display credits text again
		this.stage.addChild(this.image);//display stretched image again
		this.score = new Text("Score: "+sc, "20px Copperplate Gothic Bold", "#FFF");//creates a text object for the final score
		this.score.x = (this.width / 2) - (this.score.getMeasuredWidth() / 2);//x position of final score
		this.score.y = 300;//y position of final score
		this.stage.addChild(this.score);//display final score
		
	}
	this.clear = function(){///function that clears all text objects and images from the menu
		this.stage.removeChild(this.txt);
		this.stage.removeChild(this.guide);
		this.stage.removeChild(this.credits);
		this.stage.removeChild(this.image);
		this.stage.removeChild(this.score);
	}
	this.showScore = function(sc){//function for displaying the current score in the corner of the canvas - score value, sc, is the parameter for this function
		this.stage.removeChild(this.score);//remove current score from screen temporarily
		this.score = new Text("Score: "+sc, "20px Copperplate Gothic Bold", "#FFF");//create a text object for current score
		this.score.x = 20;//x postion of current score
		this.score.y = 20;//y position of current score
		this.stage.addChild(this.score);//display updated current score
	}
}
