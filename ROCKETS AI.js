var rocket;
var population;
var lifespan=500;
var lifeP;
var count=0;
var target;
var maxforce=0.2;

var rx=450;
var ry=350;
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
	lifeP.html(count);
	count++;
	if(count==lifespan){
		// population= new Population();
		population.evaluate();
		population.selection();
		count=0;
	}
	rect(rx,ry,rw,rh)
	ellipse(target.x,target.y,16,16)
}


function Population(){
	this.rockets= [];
	this.popsize=30;
	this.matingpool = [];

	for(var i=0; i<this.popsize; i++){
		this.rockets[i]=new Rocket();
	}

	this.run= function(){
		for(var i=0; i<this.popsize; i++){
		this.rockets[i].update();
		this.rockets[i].show();
		
	}
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

		createP(maxfit + '  total  :  ' + totalFitness)
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
			if(random(1)<0.001)
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
	if(dna) this.dna= dna;
	else this.dna= new DNA();
	
	this.fitness=0;
	

	this.applyForce = function(force){
		this.acc.add(force);
	}

	this.update =function (){
		var d= dist(this.pos.x, this.pos.y,target.x,target.y);
		if(d<18){
			this.completed= true;
			this.pos= target.copy();
		}

		if(this.pos.x>rx && this.pos.x<rx+rw && this.pos.y >ry && this.pos.y<ry+ rh)
			{this.crashed=true;}

		if(this.pos.x> width && this.pos.x<0)
			{this.crashed=true;}
		if(this.pos.y> height && this.pos.y<0)
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
		fill(255,150)
		translate(this.pos.x,this.pos.y);
		rotate(this.vel.heading())
		rectMode(CENTER);
		rect(0,0, 25,5);
		pop();
	}


	this.calcFitness = function(){
		var d= dist(this.pos.x,this.pos.y,target.x,target.y);
		this.fitness=map(d,0,width, width,0);
		if(this.completed)
			this.fitness*=20;
		if(this.crashed)
			this.fitness/=5;
	}
}