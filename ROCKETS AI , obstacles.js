var rocket;
var population;
var lifespan=700;
var lifeP;
var count=0;
var target;
var maxforce=0.2;
// var minCur=1000;

var rx//+ sin(millis()/1000);
var ry//+ cos(/1000);
var rw=300;
var rh=30;
function setup()
{
	createCanvas(1200,600);
	rocket= new Rocket();
	population = new Population();
	lifeP=createP();
	target= createVector(width/2,height/3);
}

function draw(){
	background(0);
	population.run();
	population.lowest();
	lifeP.html(count);
	count++;
	if(count==lifespan){
		// population= new Population();
		population.evaluate();
		population.selection();
		count=0;
	}
	rx=450 + sin(count/10)*100;
	ry=350- cos(count/10)*20
	fill(200)
	rect(rx,ry,rw,rh)
	rect(rx/2,rx,rh,rw)
	rect(2*rx,rx,rh,rw)
	rect(rx*3/2,ry/2,rw,rh)
	
	fill(0,255,0)
	ellipse(target.x,target.y,16,16)

	
	
}


function Population(){
	this.rockets= [];
	this.popsize=30;
	this.matingpool = [];
	this.minCur=0;
	this.minD=1000;

	for(var i=0; i<this.popsize; i++){
		this.rockets[i]=new Rocket();
	}

	this.run= function(){
		for(var i=0; i<this.popsize; i++){
		
		this.rockets[i].update();
		this.rockets[i].show();
		
	}
	this.lowest();
	}

	this.lowest= function(){
		stroke(255);
		for(var i=0; i< this.popsize ; i++)
		{if(this.rockets[i].d<this.minD)
			{this.minCur=i;
			minD=this.rockets[i].d;}
		}

	line(this.rockets[this.minCur].pos.x,this.rockets[this.minCur].pos.y,target.x,target.y);


	}

	this.evaluate =function(){
		var maxfit =0;
		var totalFitness=0 
		for(var i= 0; i< this.popsize; i++)
		{
			this.rockets[i].calcFitness();
			totalFitness+=this.rockets[i].fitness;
			if(this.rockets[i].fitness>maxfit ){
				maxfit=this.rockets[i].fitness;

			}
		}

		createP(maxfit + '  total  :  ' + totalFitness + '   ' + this.minCur + ' ' +this.minD);
		// createP('t)


		for(var i= 0; i< this.popsize; i++)
		{
			this.rockets[i].fitness/=maxfit;
		}

		this.matingpool=[];

		for(var i= 0; i< this.popsize; i++)
		{	var n= this.rockets[i].fitness*100
			for(var j=0; j<n ; j++){
				this.matingpool.push(this.rockets[i]);
			}
		}
	}

	this.selection = function(){
		var newRockets= [];
		for(var i=0; i < this.rockets.length; i++){
			var parentA= random(this.matingpool).dna;
			var parentB= random(this.matingpool).dna;
			var child = parentA.crossover(parentB);
			child.mutation();
			newRockets[i] = new Rocket(child);
		}

		this.rockets= 	newRockets;
	}
}




function DNA(genes){
	if(genes){
		this.genes= genes;
	}
	else{
		this.genes=[];
		for(var i=0;i<lifespan;i++){
			this.genes[i]= p5.Vector.random2D();
			this.genes[i].setMag(maxforce);
		}
	}

	this.crossover = function(partner){
		var newgenes = [];
		var mid = floor(random(this.genes.length));
		for (var i=0; i<this.genes.length; i++){
			if(i>mid)
				newgenes[i]= this.genes[i];
			else
				newgenes[i]= partner.genes[i];

			
		}
		return new DNA(newgenes);
	}

	this.mutation = function(){
		for( var i= 0; i< this.genes.length; i++){
			if(random(3)<0.01)
				{ this.genes[i] =p5.Vector.random2D();
					this.genes[i].setMag(maxforce);}
		}
	}
}

function Rocket(dna){
	this.pos= createVector(width/2,height);
	this.vel= createVector();
	this.acc= createVector();
	this.crashed=false;
	this.completed =false;
	this.d=1800;
	this.minDr=1000;
	if(dna) this.dna= dna;
	else this.dna= new DNA();
	
	this.fitness=0;
	

	this.applyForce = function(force){
		this.acc.add(force);
	}

	this.update =function (){
		this.d= dist(this.pos.x, this.pos.y,target.x,target.y);
		if(this.d<this.minDr)
			{minDr=this.d; line(this.pos.x, this.pos.y,target.x,target.y);}
		if(this.d<18){
			this.completed= true;
			this.pos= target.copy();
		}


		if(this.pos.x>rx && this.pos.x<rx+rw && this.pos.y >ry && this.pos.y<ry+ rh)
			{this.crashed=true;this.fitness/=1000;}
//rect(rx/2,rx,rh,rw)
	//rect(2*rx,rx,rh,rw)
	//rect(rx*2/3,ry/2,rw,rh)
		else if(this.pos.x>rx/2 && this.pos.x<rx/2+rh && this.pos.y >rx && this.pos.y<rx+ rw)
			{this.crashed=true;}
		else if(this.pos.x>rx*2 && this.pos.x<rx*2+rh && this.pos.y >rx && this.pos.y<rx+ rw)
			{this.crashed=true;}
		else if(this.pos.x>rx*3/2 && this.pos.x<rx*3/2+rw && this.pos.y >ry/2 && this.pos.y<ry/2+ rh)
			{this.crashed=true;}


		else if(this.pos.x> width+50 || this.pos.x<-50)
			{this.crashed=true;}
		else if(this.pos.y> height+50 || this.pos.y<-50)
			{this.crashed=true;}

		this.applyForce(this.dna.genes[count]);
		

		if(!this.completed && !this.crashed){


		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.vel.limit(4);
		}
	}


	this.show = function(){
		push();
		noStroke();
		fill(0,250,255,200)
		translate(this.pos.x,this.pos.y);
		rotate(this.vel.heading())
		rectMode(CENTER);
		if(this.crashed) fill(255,0,0)
		rect(0,0, 25,5);
		pop();

	}


	this.calcFitness = function(){
		// var d= dist(this.pos.x,this.pos.y,target.x,target.y);
		this.fitness=map(minD,0,width, width,0);
		if(this.completed)
			this.fitness*=20;
		if(this.crashed)
			this.fitness/=5;
	}
}