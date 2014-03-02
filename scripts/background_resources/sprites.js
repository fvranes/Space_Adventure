//Date: June 17, 2013
//Authors: Filip Vranes and Stan Zonov
//Project: Space Adventure
//Component: Sprite loading class
//NOTES:
//~~~~sets of many '//' will divide methods of classes for better clarity
//'this.' - designates and instance of a class  - there are many different ways of forming classes with Javascript - we chose the 'this' method
//Script in charge of loading and handling sprites in game - made separte in order to avoid having extra lines in game.js
function sprites(){//this class is for loading scripts
	//////////////////////////////////////////////////////////////
	this.spriteExplosionNormal;
	this.explosionNormal = new Image();
	this.explosionNormalAnimation;
	this.explosionNormal.src = "assets/images/projectiles/explosion_normal.png";
	this.spriteExplosionNormal = new SpriteSheet({//loading explosion script
	    images: [this.explosionNormal], 
	    frames: {width: 60, height: 60, regX: 30, regY: 30}, 
		
	    animations: {	
		    explode: [0, 25, false,1]
				
	    }
  	});
	this.explosionNormalAnimation = new BitmapAnimation(this.spriteExplosionNormal);
	this.explosionNormalAnimation.gotoAndPlay("explode");
	this.giveNormalExplosion = function(){
		return this.explosionNormalAnimation;
	}
	

	//////////////////////////////////////////////////////////////
	this.rocketImage = new Image();
	this.rocketImage.src = "assets/images/projectiles/rocket.gif";
	this.spriteRocket = new SpriteSheet({//not used but for loading rocket
	    images: [this.rocketImage], 
	    frames: {width: 6, height: 15, regX: 3, regY: 0}, 
	    animations: {	
		fly: [0, 4, "fly",7],
		boost: [5,6,"fly", 7]	
	    }

  	});
	this.rocketAnimation = new BitmapAnimation(this.spriteRocket);
	this.giveRocket = function(){
		this.rocketAnimation = new BitmapAnimation(this.spriteRocket);
		return this.rocketAnimation;
	}


	//////////////////////////////////////////////////////////////
	this.spriteGreenExplosion;
	this.explosionGreen = new Image();
	this.explosionGreenAnimation;
	this.explosionGreen.src = "assets/images/projectiles/explosion.gif";
	this.spriteGreenExplosion = new SpriteSheet({//not used but for loading green explosion
	    images: [this.explosionGreen], 
	    frames: {width: 50, height: 41, regX: 25, regY: 25}, 
		
	    animations: {	
		    explode: [0, 5, false,2]

		}
	});
	this.explosionGreenAnimation = new BitmapAnimation(this.spriteGreenExplosion);
	this.explosionGreenAnimation.gotoAndPlay("explode");
	this.giveGreenExplosion = function(){
		return this.explosionGreenAnimation;
	}

}
