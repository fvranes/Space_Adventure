//Date: June 17, 2013
//Authors: Filip Vranes and Stan Zonov
//Project: Space Adventure
//Component: game program - in charge of connecting all of the classes
//NOTES:
//~~~~sets of many '//' will divide methods of classes for better clarity
//'this.' - designates and instance of a class  - there are many different ways of forming classes with Javascript - we chose the 'this' method

var stage;
var canvas;
var height;
var width;

var maxShipWidth = 40;
var maxShipHeight = 44;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var shooting = false;
var startGame = false;

var backgroundMusic;

var barRatio = 16;
var starSpeed = 3;//speed of stars

var info;
var back;
var hr;
var gameEnemy;
var mainMenu;
var isMainMenu = true;
var gameTime = 0;

function init() {//method that is called from html file when page loads - basically sets everything up for work
	canvas = document.getElementById("canvas");//creates a canvas on which the game images and such will be placed
	width = canvas.width;//obtaining the dimensions of the canvas - which are set in the html file
	height = canvas.height;
	stage = new Stage(canvas);//an easelJS function that allows us to add and remove stuff on canvas with ease
	Ticker.setFPS(60);//setting the frame rate
	Ticker.addListener(window);//for the tick method below
	back = new background(stage, width, height, maxShipWidth);//OOP here we come - one of our classes that is in charge of running the stars in the background
	back.makeStars();//WE ARE CALLING A METHOD to create the stars that will be used in background- OOP MAGIC (just pointing out that we used OOP) 
		
	mainMenu = new menu(stage, width, height);//method in charge of showing the score and in between game info
	mainMenu.start();//game starts of displaying a menu
	sp = new sprites();//load the sprite creating method
	hr = new hero(stage, width, height, starSpeed, barRatio, sp.giveNormalExplosion());//the hero (the user controlled spaceship) - OOP strikes again
	gameEnemy = new enemyControl(stage, width, height, starSpeed, sp.giveNormalExplosion());//the enemies - in charge of score tracking and game obstacles
	window.onkeydown = onKeyDown;//activiting the keylisteners
	window.onkeyup   = onKeyUp;
	backgroundMusic = new Audio("assets/audio/backgroundMusic.mp3");//loading the music
}

	
function tick() {//method runs continuosly over and over- run rate = FPS (60)
	backgroundMusic.addEventListener('ended', function() { //method for looping the background theme song back and forth
		this.currentTime = 0;
		this.play();
	}, false);
	backgroundMusic.play();//start playing it
	back.drawStars();//OOP - once we have created the stars in init() we can now update their coordinates
	if(hr.getGameState()){
		startGame = false;
		hr.heroReset();
		gameEnemy.resetEnemy();
		isMainMenu = true;
		mainMenu.gameOver(gameEnemy.getKillCount()*100+Math.floor(gameTime/5)+gameEnemy.getKillCountShip()*500);
		gameEnemy.setKillCount(0);
		
		gameTime = 0;
	}
	else if(isMainMenu==false){
		gameTime +=1;
		mainMenu.showScore(gameEnemy.getKillCount()*100+Math.floor(gameTime/5)+gameEnemy.getKillCountShip()*500);//show the final score on screen
		gameEnemy.updateEnemy(hr.returnShip(), hr.returnLasers(), hr.isTimeOutComplete());
		hr.shipUpdate(moveUp, moveDown, moveLeft, moveRight, shooting, gameEnemy.isDestruct(), gameEnemy.getImmuneCount());
	}
	
	stage.update();//update the graphical components on the canvas
}


function onKeyDown(e) {	//keylistener - in charge of obtaining what user is pressing on keyboard
	if(!e){ var e = window.event; }//when pressed
	switch(e.keyCode) {
		case 32:	shooting = true;gunCoolDown = 9; e.preventDefault(); break;//space key - also prevents page from scrolling
		case 38:	moveUp = true; moveDown = false; e.preventDefault(); break;//up arrow key - also prevents page from scrolling
		case 40:	moveDown = true; moveUp = false; e.preventDefault(); break;//down arrow key - also prevents page from scrolling			
		case 39:	moveRight = true; moveLeft = false; break;//right arrow keys
		case 37: 	moveLeft = true; moveRight = false; break;//left arrow key
		case 13: 	startGame = true; isMainMenu = false; mainMenu.clear(); break;//enter	
	}
}

function onKeyUp(e) {	//when key is released - really important for repetitive behaviours like shooting
	if(!e){ var e = window.event; }		
	switch(e.keyCode) {
		case 37: 	moveLeft = false;	break;			
		case 38:	moveUp = false;		break;				
		case 39:	moveRight = false;	break;
		case 40:	moveDown = false;	break;
		case 32:	shooting = false;	break;
	}
}
