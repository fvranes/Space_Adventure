function background(st, w, h){
	this.width = w;
	this.height = h;
	this.stage = st;//import stage, canvas width and height values for background class
	this.g = new Graphics(); //create a Graphics object, using the variable g
	this.stars = new Array(); //create an array for storing stars and its characteristics
	this.starCount = 100;//number of starts displayed on the canvas at any given time
	this.starSpeed = 3;//speed at which start travels down across the screen
	this.makeStars = function(){//method that creates the star's characteristics (position, shape, scale)
		this.g.beginFill(Graphics.getRGB(255,255,255));///fills the stars with a solid white colour
		this.g.drawCircle(0,0, 1);//draws the circle with a radius of 1 unit
		for(var i = 0; i < this.starCount; i++) { ///for loop starting at 0 to the current length of the starCount array (100)
			var star = new Shape(this.g);//creates a Shape object for the star, passing the Graphics object
			this.stars.push(star);//push essentially means to fill in the array's gaps, or place the item in the argument at the end of the array
			star.x = Math.floor(Math.random() * (this.width));//x position of star - random value that can range from 0 to the width of the canvas
			star.y = Math.floor(Math.random() * (this.height));//y position of star - random value that can range from 0 to the height of the canvas
			star.scaleX = Math.floor(Math.random() * (1.5)) + 0.5;//horizontal stretch factor of star - also a random value that makes the space background more realistic
			star.scaleY = star.scaleX;///star's vertical stretch factor = horizontal stretch factor
			this.stage.addChild(star);//display the star
		}
	}
	
	this.drawStars = function(){///updates the position of the star
		for(var i = 0; i < this.stars.length; i++) {//for loop that goes from 0 - # of current stars on canvas
			this.stars[i].y+=this.starSpeed;// y value increasing after each frame update by this.starSpeed units
			if(this.stars[i].y > this.height)///conditonal statement, checking if star's position is out of screen
			{
				this.stars[i].x = Math.floor(Math.random() * (this.width));//star's x position is resetted to another random value from 0 - this.width
				this.stars[i].y = 0;//star's y-value starts back up at the top of the screen
			}
		
		}
	}
	this.getStarSpeed = function(){//accessor method which allows the client to access and manipulate the this.starSpeed value
		return this.starSpeed;
		
	}
}
		

