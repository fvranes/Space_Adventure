//Date: June 17, 2013
//Authors: Filip Vranes and Stan Zonov
//Project: Space Adventure
//Component: Hero Class
//NOTES:
//~~~~sets of many '//' will divide methods of classes for better clarity
//'this.' - designates and instance of a class  - there are many different ways of forming classes with Javascript - we chose the 'this' method
function hero(st, w, h, ss, br, explosion){//'techinally' the constructor - sets the values of many of the variables - object is created in 'game.js'
	//no constructor is necessasry as varibles are defined are right away
	//hero - is a class that is used to control the spaceship on the screen - OOP

	this.stage = st;//easeljs function for adding things to the screen easily
	this.starSpeed = ss;//the speeds of the hero spaceship based on user input is relative to star speed
	this.barRatio = br;//bar ratio helps leave the bottom section of the game where the lifes are shown - empty
	this.height = h;//height of canvas
	this.width = w;//width of canvas
	this.destruct = false;//the state of player - hit or not hit///////////////////////////////////////////////////////////////

	this.explosionNormal = explosion;//an imported sprite to be used during any sort of collisions
	this.explosionSound = new Audio("assets/audio/explosion.mp3");//sound for explosion

	this.lno_boost="assets/images/spaceship/left/no_boost.gif";//sources of the spaceship images that are used to display different spaceship angles based on user input
	this.lmed_boost="assets/images/spaceship/left/med_boost.gif";
	this.lfull_boost="assets/images/spaceship/left/full_boost.gif";
	this.rno_boost="assets/images/spaceship/right/no_boost.gif";
	this.rmed_boost="assets/images/spaceship/right/med_boost.gif";
	this.rfull_boost="assets/images/spaceship/right/full_boost.gif";
	this.cno_boost="assets/images/spaceship/center/no_boost.gif";
	this.cmed_boost="assets/images/spaceship/center/med_boost.gif";
	this.cfull_boost="assets/images/spaceship/center/full_boost.gif";	

	this.shipX = this.width/2;//coordinates of the hero space ship - starts at a specific location
	this.shipY= this.height/4*3;
	this.shipHorizontalSpeed = 9;//default speed of space ship
	this.shipVerticalSpeed = 4;
	this.maxShipWidth = 40;//ship image dimensions - for collisions
	this.maxShipHeight = 44;

	this.spaceShipImage = new Image();//creating the image (OOP) and making it into a bitmap - something easeljs can then handle
	this.spaceShipImage.src = this.cmed_boost;
	this.ship = new Bitmap(this.spaceShipImage);

	this.lasers = new Array();//the array of lasers that the player shoots - in order to keep track of all of them and their coordinates
	this.weapon = new Image();//the laser used in the game
	this.bulletSpeed = 7;//bullet speed
	this.bulletRateLimit = 12;
	this.counter = this.bulletRateLimit ;//the shooting speed of the laser - related to FPS and how much the methods in this class are called
	
	this.bonusArray = new Array();	//variables involved with keeping track of all of the bonuses involved in the game
	this.bonusLength = 0;
	this.lifeArray = new Array();	

	this.deathTimeOut = 0;//when player collides - he will not be visible for a short instance
	this.rebirth = false;//when the player will reappear on the screen after death
	
	this.gameOver = false;//game state which is used to communicate with other classes - such as the menu class
	
	//following code segment is for displaying and keeping track of the player lifes - which visually displayed in the lower left corner
	this.lifeCount = 3;
	this.lifeImage1 = new Bitmap("assets/images/spaceship/center/no_boost.gif");
	this.lifeImage1.x = 5;
	this.lifeImage1.y = this.height-this.height/this.barRatio+3;

	this.lifeImage2 = new Bitmap("assets/images/spaceship/center/no_boost.gif");
	this.lifeImage2.x = this.lifeImage1.x+this.maxShipWidth+5;
	this.lifeImage2.y = this.height-this.height/this.barRatio+3;

	this.lifeImage3 = new Bitmap("assets/images/spaceship/center/no_boost.gif");
	this.lifeImage3.x = this.lifeImage2.x + this.maxShipWidth+5;
	this.lifeImage3.y = this.height-this.height/this.barRatio+3;
	
	this.lives = new Array();
	this.lives.push(this.lifeImage1);
	this.lives.push(this.lifeImage2);
	this.lives.push(this.lifeImage3);
	/////////////
	
	/////////////////////////////////////////////////////////////////////////////
	//reset function - called when game is over and all of the player data - such as lives needs to be reset
	this.heroReset = function(){//method within a class - OOP
		this.lifeCount = 3;//reset the lives
		this.gameOver = false;//new game starts at this point
		this.shipX = this.width/2;//coordinates are reset to default
		this.shipY = this.height/4*3;
		for(var i = 0; i!= this.lasers.length; i++){//clear all the lasers from the screen
			this.stage.removeChild(this.lasers[i]);
		}
		this.lasers.splice(0,this.lasers.length);//empty the laser array
		this.bulletRateLimit = 12;//reset the rate of fire in the case if player died with a increase fire rate bonus
		this.bonusLength = 0;//reset the fire rate bonus duration
		if(this.bonusArray.length==1){//get rid of all increase fire rate bonuses on the screen
			this.stage.removeChild(this.bonusArray[0]);
			this.bonusArray.splice(0,1);
		}

		if(this.lifeArray.length==1){//get rid of all life bonuses on the screen
			this.stage.removeChild(this.lifeArray[0]);
			this.lifeArray.splice(0,1);
		}
	}
	/////////////////////////////////////////////////////////////////////////////
	
	/////////////////////////////////////////////////////////////////////////////
	this.shipUpdate = function(moveUp, moveDown, moveLeft, moveRight, shoot, destruct, immune){//method called in tick() of 'game.js' - basically updates everything related to the ship as game runs
		if(destruct&&this.deathTimeOut==0){//destruct is imported from enemy class - where collisions are kept track of
			//if collision happens the shipDestruct() is called (method found later on in this class)
			this.bulletRateLimit = 12;//reset the shooting limit - or basically lose the shooting bonus of fire rate of 5 if player has that bonus
			this.shipDestruct();//method for mainly displaying explosion/sound for explosion and keeping track of lives (located in this class)
		}
		else if(this.deathTimeOut==0){//deathTimeOut is almost like a boolean - it serves for the counter when the player ship goes off the screen after a collision with asteroid and explosion goes on
			//the value is changed to 1 on impact in shipDestruct method so that then the game logic can go to the 'else{}'
			this.checkMovement(moveUp, moveDown, moveLeft, moveRight);//adjust the user ship coordinates based on user keyboards inputs
			this.withinBounds();//readjust if ship is about to go out of game screen
			this.shipRelocate();//reupdate the ship visually on the screen
			this.fireBonus();//method for displaying and keeping track of bonuses that increase fire rates
			this.lifeBonus();//method for diplaying and keeping track of life bonuses
			
		}
		else{
			this.deathTimeOut +=1;//if the ship did in fact just collide - there is a timer set - that is based on tick() - which makes the ship dissapear and lets the explosion animation do its thing
			if(this.deathTimeOut ==30){//once the time out is complete - the player is added back to the screen - but this time he is in 'rebirth mode' which makes the ship invulrnable for a short period of time
				this.deathTimeOut = 0;
				this.rebirth = true;
				this.destruct = false;
			}
		}
		if(immune%3==0&&immune!=0){//this is for making the image of the ship to flash when the player is immune
			this.stage.removeChild(this.ship);
		}
		if(shoot){//if the player is holding the space bar
			this.doFire();
		}
		else{
			this.counter =this.bulletRateLimit ;
		}
		this.updateBullets();
		this.updateLives(this.lifeCount);
				
	}
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////
	this.distance = function(item1, item2){//calculates distance between objects
    		var deltax = item1.x - item2.x;  
    		var deltay =item1.y - item2.y;    
			var d = Math.sqrt( (deltax*deltax) + (deltay*deltay) );
    		return d; 
	}
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////
	this.lifeBonus = function(){//keeps track of additional life points
		var luck = Math.floor(Math.random()*400)+1;
		if(luck == 1&&this.lifeArray.length==0){//creates life if no life already exists
			var bon = new Bitmap("assets/images/projectiles/life.gif");
			bon.x = Math.floor(Math.random()*(this.width-40))+20;
			bon .y = 0;
			this.stage.addChild(bon);
			this.lifeArray.push(bon);
		}
		
		for(var i = 0; i != this.lifeArray.length; i++){
			this.stage.removeChild(this.lifeArray[i]);
			this.lifeArray[i].y += this.starSpeed;
			if(this.lifeArray[i].y>this.height){//remove if out of bonds
				this.lifeArray.splice(i,1);
				i--;
			}
			else if(this.distance(this.lifeArray[i], this.ship)<25){//remove and update if player picks up power up
				if(this.lifeCount<3){
					this.lifeCount +=1;
				}
				this.lifeArray.splice(i,1);
				i--;
				this.bonusLength = 1;
			}
			else{
				this.stage.addChild(this.lifeArray[i]);	
			}
		}

	}
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////
	this.fireBonus = function(){//analogous to this.lifeBonus() - method
		var luck = Math.floor(Math.random()*300)+1;
		if(luck == 1&&this.bonusArray.length==0){
			var bon = new Bitmap("assets/images/projectiles/bonus.png");
			bon.x = Math.floor(Math.random()*(this.width-40))+20;
			bon .y = 0;
			this.stage.addChild(bon);
			this.bonusArray.push(bon);
		}
		
		for(var i = 0; i != this.bonusArray.length; i++){
			this.stage.removeChild(this.bonusArray[i]);
			this.bonusArray[i].y += this.starSpeed;
			if(this.bonusArray[i].y>this.height){
				this.bonusArray.splice(i,1);
				i--;
			}
			else if(this.distance(this.bonusArray[i], this.ship)<40){
				this.bulletRateLimit = 5;
				this.bonusArray.splice(i,1);
				i--;
				this.bonusLength = 1;
			}
			else{
				this.stage.addChild(this.bonusArray[i]);	
			}
		}
		if(this.bonusLength>=1){
			this.bonusLength +=1;
			if(this.bonusLength>400){
				this.bonusLength = 0;
				this.bulletRateLimit = 12;
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////
	
	/////////////////////////////////////////////////////////////////////////////	
	this.updateLives = function(lifeLeft){//reupdate lives so that other elements on canvas do not go over the lives
		for(var i = 0; i != lifeLeft; i++){
			this.stage.removeChild(this.lives[i]);
			this.stage.addChild(this.lives[i]);
		}
	}
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////
	this.doFire = function(){//method called when player pressed space
		if(this.destruct == false&&this.counter == this.bulletRateLimit ){
			var laserSound = new Audio("assets/audio/laser.mp3");//shooting noise
			laserSound.play();
			this.weapon.src = "assets/images/projectiles/blue_laser_big.gif";//image of the laser
			var bullet = new Bitmap(this.weapon);
			var bullet2 = new Bitmap(this.weapon);
			this.lasers.push(bullet);//keep bullets in an array
			this.lasers.push(bullet2);
			bullet.x = this.shipX-this.maxShipWidth/4-2;
			bullet.y = this.shipY;
			bullet2.x = this.shipX+this.maxShipWidth/4-1;
			bullet2.y = this.shipY;
			this.stage.addChild(bullet);//add the image of laser
			this.stage.addChild(bullet2);
			this.counter =0;
		}
		this.counter +=1;
	}
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////
	this.updateBullets = function(){//keep the bullets updated - and their coordinates on the screen
		for(var i = 0; i!= this.lasers.length; i+=2){
			this.stage.removeChild(this.lasers[i]);
			this.stage.removeChild(this.lasers[i+1]);
			this.lasers[i].y-=this.bulletSpeed;
			this.lasers[i+1].y-=this.bulletSpeed;
			if(this.lasers[i].y<0){//if out of bounce - then get rid of the lasers
				this.lasers.splice(i,2);
			}
			else{
				this.stage.addChild(this.lasers[i]);
				this.stage.addChild(this.lasers[i+1]);
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////
	this.shipDestruct = function(){//method for displaying the explosion/sound when ship collides
		this.deathTimeOut+=1;
		this.stage.removeChild(this.explosionNormal);//remove previous explosion
		this.stage.removeChild(this.ship);//remove ship (since it exploded)
		this.explosionNormal.gotoAndPlay("explode");
		this.explosionNormal.x = this.shipX;//explosion settings
		this.explosionNormal.y = this.shipY;
		this.lifeCount-=1;
		if(this.lifeCount==0){//when no lives left and game over == true, then you get a big explosion
			this.explosionNormal.scaleX = 15;
			this.explosionNormal.scaleY = 15;
		}
		else{
			this.explosionNormal.scaleX = 3;
			this.explosionNormal.scaleY = 3;
		}
		
		this.explosionNormal.currentFrame = 0;
		
		this.shipX = this.width/2;///reset ship coordinates
		this.shipY = this.height/4*3;

		this.destruct = true;
		this.explosionNormal.gotoAndPlay("explode");
		this.stage.addChild(this.explosionNormal);
		
		this.stage.removeChild(this.lives[this.lifeCount]);//remove one more life in the bottom left of screen
		if(this.lifeCount == 0){
			this.gameOver = true;/////////////////////////////////////
		}
		this.explosionSound.play();//play explosion noise
	}
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////	
	this.shipRelocate = function(){//redraw the ship with new coordinates method
		this.stage.removeChild(this.ship);
		this.ship.regX = this.ship.image.width * 0.5;
		this.ship.regY = this.ship.image.height * 0.5;
		this.ship.x  = this.shipX;
		this.ship.y = this.shipY;
		this.stage.addChild(this.ship);
	}
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////
	this.checkMovement = function (moveUp, moveDown, moveLeft, moveRight){//adjust coordinates of ship based on user input
		if(moveLeft)
		{
			if(moveUp){
				this.spaceShipImage.src  = this.lfull_boost;
				this.shipY -=this.shipVerticalSpeed;
			}		
			else if(moveDown){
				this.spaceShipImage.src  = this.lno_boost;
				this.shipY +=this.starSpeed*1.7;//speed is dependent on star speed
			}
			else{
				this.spaceShipImage.src  = this.lmed_boost;
			
			}
		
		this.shipX-=this.shipHorizontalSpeed;	

		
		}
		else if(moveRight)
		{	
			if(moveUp){
				this.spaceShipImage.src  = this.rfull_boost;
				this.shipY -=this.shipVerticalSpeed;
			}		
			else if(moveDown){
				this.spaceShipImage.src  = this.rno_boost;
				this.shipY +=this.starSpeed*1.7;///////////import
			}
			else{
				this.spaceShipImage.src  = this.rmed_boost;
			}
			this.shipX+=this.shipHorizontalSpeed;		
		}
					
		else if(moveUp)
		{	
			this.spaceShipImage.src  = this.cfull_boost;

			this.shipY -=this.shipVerticalSpeed;
		
		
		}
		else if(moveDown){	
			this.spaceShipImage.src  =  this.cno_boost;
			this.shipY +=this.starSpeed*1.7;///////////import
		}
		else{
			this.spaceShipImage.src  = this.cmed_boost;
		}
	}

	/////////////////////////////////////////////////////////////////////////////
	this.withinBounds = function(){
		if(this.shipX>this.width-this.maxShipWidth*0.5){
			this.shipX = this.width - this.maxShipWidth*0.5;
		}
		else if(this.shipX<this.maxShipWidth*0.5){
			this.shipX = this.maxShipWidth*0.5;
		}
	
		if(this.shipY+this.maxShipHeight*0.5>this.height-this.height/this.barRatio){//////import
			this.shipY = this.height - this.maxShipHeight*0.5-this.height/this.barRatio;////iimport
		}
		else if(this.shipY<this.maxShipHeight*0.5){
			this.shipY = this.maxShipHeight*0.5;
		}
	}

	//following methods are accessors and mutators 
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////
	this.returnLasers = function(){//returns the array with bullets for bullet to enemy collision testing in enemy class
		return this.lasers;
	}
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////
	this.returnShip = function(){//same as previous method for collision testing
		return this.ship;
	}
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////
	this.isTimeOutComplete = function(){//method for communicating the immunity state of player for the flashy image of player during 
		if(this.rebirth){
			this.rebirth = false;
			return true;
		}
		else{
			return false;
		}
	}
	/////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////
	this.getGameState = function(){//for the game method for starting the main menu
		return this.gameOver;
	}
	/////////////////////////////////////////////////////////////////////////////
}
