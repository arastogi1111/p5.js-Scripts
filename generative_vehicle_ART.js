//var font;
//var points = [];
var vehicles= [];

var n= 0;
var c= 55;
var size
var an=137.5;
var zoomout=1000;

// function preload(){
//   font = loadFont('"http://localhost/ZonaProBold.otf');
// }
function setup(){
  createCanvas(1530,860);
  background(0);
  colorMode(HSB);
  angleMode(DEGREES);
  // for(var i= 0; i< 500; i++)
  //   {points[i]= createVector(i*2,200+80*sin(i/8))//+(i*pow(-1,i)));
  //     }

while(n<4000)
  {   //an=cos(n) +144.5
   // an-=0.001;
var a= n * an;

var r= c *sqrt(n) *n/zoomout
var col=a%256;    // n* sin(n)*2/200;
size=cos(n)*1.5+2.5;
var x= r * sin(a) + width/2;
var y= r * cos(a)+ height/2;

//points[n]=createVector(x,y);
//var vehicle= new Vehicle(x,y,col,size);
vehicles.push(new Vehicle(x,y,col,size));
n++;
}







  // for(var i= 0; i< points.length; i++){
  //   var pt=points[i];
  //   var vehicle= new Vehicle(pt.x,pt.y);
  //   vehicles.push(vehicle);
  //   //point(pt.x,pt.y)
  // }

}

function draw(){
  background(0);
  for(var i = 0; i<vehicles.length; i++)
    {var v= vehicles[i];
      v.behaviors();
      v.update();
      v.show();}

       if(mouseIsPressed || (keyIsPressed && key ==' '))
  {for(var i = 0; i<vehicles.length; i++)
    {var v= vehicles[i];
      v.pos= createVector(random(width)*1,random(height)*1)}
}


if(keyIsPressed )
{ if(key=='+') zoomout-=100;
  else if (key=='-') zoomout+=100;
  else if(key=='r') zoomout*=-1;  
  console.log(zoomout)



  an=137.5;
 
  for(var i = 0; i<vehicles.length; i++)
    {var v= vehicles[i];
     
      an-=0.001;
      var a=i * an;
      var r= c *sqrt(i) *i/zoomout;
      var x= r * sin(a) + width/2;
      var y= r * cos(a)+ height/2;


      v.target= createVector(x,y);}
}

}


function Vehicle(x,y,col,z) {
  this.pos= createVector(random(width)*1,random(height)*1);
  this.acc= createVector();
  this.vel= createVector();
  this.target = createVector(x,y)
  this.maxspeed=18;
  this.maxforce =20.5;
  // this.r= random(20,255);
  //  this.g= random(20,255);
  //   this.b= random(20,255);
    this.col=col;
    this.z=z;
}

Vehicle.prototype.behaviors= function(){
var arrive = this.arrive(this.target);

var mouse =  createVector(mouseX,mouseY);
var flee= this.flee(mouse);

flee.mult(5);
this.applyForce(flee);
this.applyForce(arrive)

}

Vehicle.prototype.flee = function(target){
  var desired = p5.Vector.sub(target,this.pos);
  var d= desired.mag();
  
  if(d<100){
  desired.setMag(this.maxspeed);
  desired.mult(-1);
  var steer = p5.Vector.sub(desired, this.vel)
  steer.limit(this.maxforce)

  return steer;}

  else return createVector(0,0)
}

Vehicle.prototype.arrive = function(target){
  var desired = p5.Vector.sub(target,this.pos);
  var d= desired.mag(); //dist(this.pos.x,this.pos.y,target.x,target.y)
  var speed = this.maxspeed;
  if(d<100){
    speed = map(d,0,100,0.2,this.maxspeed)
  }   
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel)
  steer.limit(this.maxforce)
  return steer;
}

Vehicle.prototype.applyForce = function(f){
this.acc.add(f);
}


Vehicle.prototype.update= function(){
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0); 

}

Vehicle.prototype.show = function(){
  fill(this.col,255,255);
  //strokeWeight(3)
  noStroke();
  ellipse(this.pos.x,this.pos.y,this.z,this.z)
}

