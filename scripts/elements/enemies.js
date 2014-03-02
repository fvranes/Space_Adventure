function enemyControl(st, w, h,ss,ex){

	this.scoreArray = new Array();//create an array for the scores earned from destroying enemies
	this.scoreArrayTime = new Array();///create an array for score display time

	this.explosionSound = new Audio("assets/audio/explosion.mp3");//create an audio object for explosion sounds
	this.stage = st;
	this.height = h;
	this.width = w;
	this.enemySpeed = ss;//import stage, height, width and enemySpeed values from the client that can be used in the enemyControl class

	this.explosion = ex;//import explosions from client
	this.immune = 1;///immune time initialized to 1
	this.startImmunity = true;//boolean variable for immunity set to true
	
	this.enemyLimit = 8;//maximum # of enemies at one point will be 8 to start
	this.enemies = new Array();//enemies and their characteristics stored into an array
	this.speed = new Array();//enemy speeds also stored into an array, so that each enemy has a unique speed

	this.enemyFireRate = 36;//rate at which enemies shoot their rockets
	this.enemyRockets = new Array();//store enemy rockets fired into an array
	this.s;//initialize the image of the enemies
	this.enemyShip = new Array();//store the enemy ships in an array that is separate from the asteroids

	this.destruct = false;	///boolean variable for hero ship destructing set to false
	
	this.difficultyTime =1;///timer for increasing the this.difficulty value
	this.difficulty = 1;//difficulty value that increases number of shooting enemy spaceships as well as maximum number of enemies at any given time

	this.killCount = 0;	///tracks the number of asteroids destroyed
	this.killCountShip = 0;//tracks the number of enemy spaceships destroyed

	this.regX;////////////////////////////////////////centetering the coordinate of enemy ship 
	this.regY;
	
	this.resetEnemy = function(){//funtion called at beginning of game to clear all enemies from screen before new game starts
		this.difficultyTime = 0;
		this.difficulty = 1;
		this.destruct = false;///difficulty and destruct states reset
		for(var i = 0; i!= this.scoreArray.length; i++){
			this.stage.removeChild(this.scoreArray[i]);//removes all pop-up scores from screen
			this.scoreArrayTime.splice(i,1);///removes all score times
			this.scoreArray.splice(i,1);///removes all pop-up score values from array
			i--;
		}
		for(var i = 0; i!= this.enemies.length; i++){
			this.stage.removeChild(this.enemies[i]);//removes all asteroids from screen
		}
		for(var j = 0; j!= this.enemyShip.length; j++){
			this.stage.removeChild(this.enemyShip[j]);//removes all enemy ships from screen
		}
		for(var k = 0; k!= this.enemyRockets.length; k++){
			this.stage.removeChild(this.enemyRockets[k]);//removes all enemy rockets from screen
		}
		this.enemyShip.splice(0,this.enemyShip.length);///clears enemyShip array
		this.enemies.splice(0,this.enemies.length);///clears enemies array
		this.enemyRockets.splice(0,this.enemyRockets.length);///clears enemyRockets array
		
	}
	
	this.updateEnemy = function(ship, lasers, doneDying){//updates enemy characteristics, collisions, player destruction, scores and game difficulty

		this.difficultyTime +=1;//difficulty time increasing by 1 every time game frame updates
		
		if(this.destruct&&doneDying){
			this.destruct = false;///once player has died, make this.destruct = false instead of true
		}
		this.createEnemy();//creates the enemy characteristics and makes enemies spawn
		this.enemyMovement();///updates movement of enemies
		if(this.startImmunity==false){
			this.playerCollision(ship);//if player is not in the immunity state, check if ship collides with any enemies
		}
		else{
			this.immune+=1;
			if(this.immune>150){///if player is in immunity mode, start the timer of how long the hero ship is invulerable for
				this.startImmunity = false;//change startImmunity state back to false
				this.immune = 0;///reset immunity timer for next time hero ship destructs
			}
		}
		this.enemyFire();	///creates enemy rockets
		this.updateEnemyFire();	///updates position of enemy rockets
		this.weaponCollision(lasers);///checks if hero ship's lasers collide with any enemy bodies
		this.updateScore();///update the pop-up scores
		

	}
	
	this.createEnemy = function(){///method that creates the enemies and their characteristics
		var chance = Math.floor(Math.random()*10)+1;///we don't want enemies being created after every frame update... so they now have a 20% chance of being created
    		if(chance>8 && this.enemies.length < this.enemyLimit+this.difficulty) {  
				this.speed.push((Math.random()*1.05)+1);//a random speed from 1 - 1.05 so that enemies are moving at unique speeds across screen
				if(this.difficultyTime%50==0&&this.difficulty<10){
					
					this.difficulty +=1;///at certain frame updates, the difficulty will increase by 1, making more enemy spaceships spawn as well as maximum number of enemies increasing
				}
				var enemychance = Math.floor(Math.random()*(12-this.difficulty))+1;///enemy spaceships start off by having a 1/12 chance of spawning, but can ultimately have a 1/2 chance as difficulty increases OMG!!!
				if (enemychance==1) {
						this.s = new Bitmap("assets/images/spaceship/enemy.png");///create a bitmap for enemy space ship when conditions are met
						this.enemyShip.push(this.s);  ///push enemy space ship into the array
				}
				else {
						this.s = new Bitmap("assets/images/projectiles/asteroid.gif");//create a bitmap for enemy asteroids
						this.enemies.push(this.s);///push asteroid characteristics into the array
				}     
        				this.s.x = Math.floor(Math.random()*(this.width-(2*this.s.image.width)+1)+this.s.image.width); //x position of enemy that is randomly generated 
					this.regX = this.s.width/2;
					this.regY = this.s.height/2;
        				this.s.y = -(Math.floor(Math.random()*10)+(this.s.image.height)); //y position of enemy that is randomly generated        
        				this.stage.addChild(this.s);        		
    		}  
	}
	this.enemyMovement = function(){//method that updates enemy movement
		 for (var j = 0; j < this.enemyShip.length; j++) {
  		 	this.enemyShip[j].y += this.enemySpeed*this.speed[j];///y position increases at a constant value * speed factor after every frame update
  		 	if (this.enemyShip[j].y > this.height) {  ///if y position of enemy goes out of screen, then remove enemy from array and screen                   
           			this.stage.removeChild(this.enemyShip[j]);  
           			this.enemyShip.splice(j, 1); 			
       		} 
  		 }
		 for(var i = 0; i < this.enemies.length; i++) { 
        		this.enemies[i].y += this.enemySpeed*this.speed[i];  ///y position increases at a constant value * speed factor after every frame update
        		if (this.enemies[i].y > this.height) {      ///if y position of enemy goes out of screen, then remove enemy from array and screen                
           			this.stage.removeChild(this.enemies[i]);  
           			this.enemies.splice(i, 1); 
	    			this.speed.splice(i, 1);			
       		}  		
  		 }
	}

	this.enemyFire = function() {///creates enemy rockets based on current enemy positions
		for (var k = 0; k !=this.enemyShip.length; k++) {
			if (this.enemyFireRate==36) {///fire rate is set to 36 so that there is a slight delay between each rocket fired
				var enemyBullet = new Bitmap("assets/images/projectiles/rocketSingle.gif");///create a bitmap for rockets
				this.enemyRockets.push(enemyBullet);//push enemy rockets into an array
				enemyBullet.x = this.enemyShip[k].x + 34;///x position of rocket is dependent on ship's x position
				enemyBullet.y = this.enemyShip[k].y + 68;//y position of rocket is dependent on ship's y position
				this.stage.addChild(enemyBullet);//display enemy rockets on screen
				this.enemyFireRate = 0;///reset fire rate to 0 so that delay still occurs
			}
			else {
				this.enemyFireRate+=1;///if enemyFireRate hasn't reached 36, then add 1 until it == 36
			}
		}
	}

	this.updateEnemyFire = function(){//keep the enemy rockets updated
		for(var i = 0; i!= this.enemyRockets.length; i++){
			this.stage.removeChild(this.enemyRockets[i]);//temporarily removes enemy rockets from screen
			this.enemyRockets[i].y+=this.enemySpeed*2;///rocket's y position will move twice as fast as the enemy space ship's y position
			if(this.enemyRockets[i].y>this.height){///if rockets go beyond screen, remove it from array and do not addChild
				this.enemyRockets.splice(i,1);	
			}
			else{
				this.stage.addChild(this.enemyRockets[i]);//if y position is within canvas, then display enemy rocket
			}
		}
	}
	
	
	this.distance = function(enemy, item){//a method for calculating the distance between an enemy and the hero spacehip/lasers
    		var deltax = item.x - enemy.x;  
    		var deltay = item.y - enemy.y;   
			var d = Math.sqrt( (deltax*deltax) + (deltay*deltay) );///distance is calculated using Pythagorean Theorem
    		return d; //hypotenuse is returned when this.distance() is called
	}

	this.playerCollision = function(ship){//checks if hero space ship is very close to enemy bodies/rockets       
  		for (var i = 0; i!=this.enemies.length; i++) {    
   			 if(this.distance(this.enemies[i], ship) < 50) {   ///uses distance method to find distance between ship and enemy bodies and if <50 then begin enemy destruction and immunity
				this.destruct = true;
				this.startImmunity = true;
				this.explosionSound.play();//play explosion sound effect when hero hits enemy
				break;//break out of loop as we no longer need to check for collisions since hero has already hit an enemy
   			 }
		}
		for (var k = 0; k!=this.enemyRockets.length; k++) {    ///uses distance method to find distance between ship and rockets and if <25 then begin enemy destruction and immunity
   			 if(this.distance(this.enemyRockets[k], ship) < 25) {  	 
				this.destruct = true;
				this.startImmunity = true;
				enemyRockets.splice(k,1);///destroy rocket too
				this.explosionSound.play();//play explosion sound effect when hero hits rocket
				break;
   			 }
		}
		for (var j = 0; j!=this.enemyShip.length; j++) {    ///same case as enemies loop above but now we're dealing with the enemy ships
   			 if(this.distance(this.enemyShip[j], ship) < 50) {   
				this.destruct = true;
				this.startImmunity = true;
				this.explosionSound.play();
				break;
   			 }
		}
	}
	
	this.updateScore = function(){//updates pop-up scores on the screen when destroying enemies
		for(var i = 0; i!= this.scoreArray.length; i++){
			this.scoreArrayTime[i]+=1;//increase the timer by 1 after every frame update
			if(this.scoreArrayTime[i]>30){//once timer is > 30 then remove pop-up from screen
				this.stage.removeChild(this.scoreArray[i]);
				this.scoreArrayTime.splice(i,1);
				this.scoreArray.splice(i,1);///remove pop-up score and timer from array too
				i--;
				
			}
		}

	}

	this.weaponCollision = function(lasers){///method checks if lasers collide with enemies
		for (var i = 0; i!=this.enemies.length; i++) { 
			for (var j = 0; j!=lasers.length; j+=2) {    ///loop increments by 2 since 2 lasers are being fired simuntaneously              
       				if(this.distance(this.enemies[i], lasers[j]) < 25 || this.distance(this.enemies[i], lasers[j+1]) < 25){//if either laster is <25 units away from enemy[i]  			
					this.stage.removeChild(this.explosion);///remove any current explosions on screen
        				this.stage.removeChild(this.enemies[i]);///remove enemy from screen  
        				this.stage.removeChild(lasers[j]);
					this.stage.removeChild(lasers[j+1]);  ///remove both lasers from screen 
					this.explosion.gotoAndPlay("explode");///creates the explosion animation
					this.explosion.scaleX = 1;
					this.explosion.scaleY = 1;///explosion isn't being stretched in this case
					this.explosion.x = this.enemies[i].x;
					this.explosion.y = this.enemies[i].y;///explosion position is dependent on the position of the enemy being destroyed
					this.explosion.currentFrame = 0;
					this.stage.addChild(this.explosion);//display explosion animation
        				this.enemies.splice(i, 1);  //remove enemies from array
        				lasers.splice(j,2);     /////remove lasers from array
					var text = new Text("100", "10px Arial", "#FFF");//create pop-up score Text object for destroying asteroid
					text.x = this.explosion.x;
					text.y = this.explosion.y;//once again text position is dependent on the position of the enemy being destroyed
					this.stage.addChild(text);///display pop-up score
					this.scoreArray.push(text);//push score into array
					this.scoreArrayTime.push(0);//push score timer into array as well
					this.explosionSound.play();///play explosion sound effect
					this.killCount +=1; //increase kill count of asteroids to keep track of total score
						    
     				}  	
			}
		}
	
		for (var k = 0; k!=this.enemyShip.length; k++) { ///same for loop as above, but now with enemyShip
			for (var l = 0; l!=lasers.length; l+=2) { //once again, l is going up by 2 because of 2 lasers being fired at once                 
       				if(this.distance(this.enemyShip[k], lasers[l]) < 25 || this.distance(this.enemyShip[k], lasers[l+1]) < 25){  			
						this.stage.removeChild(this.explosion);
        				this.stage.removeChild(this.enemyShip[k]);  
        				this.stage.removeChild(lasers[l]);
						this.stage.removeChild(lasers[l+1]);   
						this.explosion.gotoAndPlay("explode");
						this.explosion.scaleX = 1;
						this.explosion.scaleY = 1;
						this.explosion.x = this.enemyShip[k].x;
						this.explosion.y = this.enemyShip[k].y;
						this.explosion.currentFrame = 0;
						this.stage.addChild(this.explosion);
        				this.enemyShip.splice(k, 1); 
						var text = new Text("500", "10px Arial", "#FFF");///500 points are now earned this time, instead of 100
						text.x = this.explosion.x;
						text.y = this.explosion.y;
						this.stage.addChild(text);
						this.scoreArray.push(text);
						this.scoreArrayTime.push(0); 
        				lasers.splice(l,2);     /////export the bullets 
						this.killCountShip +=1; ///track the kill count of enemy ships so that total score can be increased accordingly
						this.explosionSound.play();	    
     				}  	
			}
		}
	}

	this.isDestruct = function(){//boolean accessor method that checks the ship's state of destruction - either true or false
		return this.destruct;
	}

	this.getImmuneCount = function(){//boolean accessor method that checks the ship's length of immunity
		return this.immune;
	}

	this.getKillCount = function(){///accessor method thatreturns the number of asteroids destroyed
		return this.killCount;
	}

	this.getKillCountShip = function(){///accessor method that returns number of enemy ships destroyed
		return this.killCountShip;
	}

	this.setKillCount = function(value){///mutator method that sets killCounts to any value being passed via value variable
		this.killCount = value;
		this.killCountShip = value;
		
	}
}
