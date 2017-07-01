var s;
var scl =20;
var food;
var w=1;
var m=0;
var n=0;
var o=0;
var t;
var score=0;
var on=false;

function setup()
{createCanvas(700,700);
	frameRate(10);
s= new snake();

// var cols= floor( width/scl);
// 	var rows = floor(height/scl);
// food = createVector(floor(random(cols)), floor(random(rows)));
// food.mult(scl);
// // food =
pickLocation();

}


function pickLocation(){
	var cols= floor( width/scl);
	var rows = floor(height/scl);
food = createVector(floor(random(cols)), floor(random(rows)));
food.mult(scl);
}

function changeB() {
	m=random(0,255)
	n=random(0,255)
	o=random(0,255)
}
function draw(){
	t=millis();
if (keyIsPressed) {
if ((key == 'c'))
	w*=-1;
else if(key=='b')
	changeB();
else if(key=='w')
	s.dir(0,-1);
else if(key=='s')
	s.dir(0,1);
else if(key=='a')
	s.dir(-1,0);
else if(key=='d')
	s.dir(1,0);
}


// if(s.tail.length%5==0 &&s.tail.length!=0 ){
// 	var t=start;

// 	changeB();
// 	}

if(t%20000<6000 && t>5000)
	{changeB();
		on=true;
		if(t%2000 < 100 )pickLocation();
		//textSize(30+sin(t/50)*20);
		// text(score, 100,200);
	}
else on= false;

background(m,n,o); 
s.update();
s.show();


if(s.eat(food)){
pickLocation();
if(on) score+=20;
else score++;
}

fill(255,0,100);
rect(food.x,food.y,scl,scl);
if(w!=-1)
{stroke(255,0,0)
	line(1,1,width,1)
	line(1,1,1,height)
	line(width-3,1,width-3,height)
	line(1,height-3,width,height-3)}
}

function die(){
	if(w==1)
		{
			rect(0,0,1000,1000);
	fill(0,255,0);
	textSize(64);
	textAlign(CENTER);
	text(s.total,200,200);
	s.tail.length=0;}
	
}


function keyPressed(){
	
	if(keyCode == UP_ARROW){
		s.dir(0,-1);
	}
	else if(keyCode == DOWN_ARROW){
		s.dir(0,1);
	}

	else if(keyCode == LEFT_ARROW){
		s.dir(-1,0);
	}

	else if(keyCode == RIGHT_ARROW){
		s.dir(1,0);
	}

	
}

function snake(){
	this.x =0;
	this.y =0;
	this.xspeed =1;
	this.yspeed =0;
	this.tail= [];
	this.total= 0;

	this.eat = function(pos) {
	var d=	dist(this.x,this.y,pos.x,pos.y);
	if(d< 4)
		{this.total++;
		return true;}
	else {return false;}

	}


	this.update = function() {
		for(var i=0 ;i<this.tail.length -1; i++){
			this.tail[i]= this.tail[i+1];
		}
		this.tail[this.total-1]= createVector(this.x,this.y)
		this.x = this.x + this.xspeed*scl;
		this.y = this.y + this.yspeed*scl;

		for(var i=0 ;i<this.tail.length ; i++){
			var d=	dist(this.x,this.y,this.tail[i].x,this.tail[i].y)
			if(d<4)
				die();
		}

		// this.x =constrain( this.x,0,width-scl)
		// this.y =constrain( this.y,0,height-scl)
		if(this.x >width-scl)
			{if(w==-1)this.x=-scl;
				else die();}
		else if(this.x <0)
			{if(w==-1)this.x= width-scl;
				else die();}
		if(this.y >height-scl)
			{if(w==-1)this.y=-scl;
				else die();}
		else if(this.y<0)
			{if(w==-1)this.y= height-scl;
				else die();}

	}

	this.show = function(){
		fill(255);
		for(var i =0 ; i< this.total; i++){
			rect(this.tail[i].x,this.tail[i].y,scl,scl);
		}
		fill(0,250,250);
		rect(this.x, this.y, scl, scl);
		text(score, 10, 10);
		if(w==-1) text("GOD MODE",30,10)
	}

	this.dir =function(x,y) {
		this.xspeed=x;
		this.yspeed=y;
	}
}