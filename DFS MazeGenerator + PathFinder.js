var cols, rows;
var w=20;
var grid = [];
var current;
var stack = [];
var x=0;
var presses=0;
var dest;
var found= false;
var notSet=true;
var mazeslider;
var solveslider;
var z=0;


function setup(){
  frameRate(100);
  createCanvas(700,700);
  background(51);

  cols = floor(width/w);
  rows = floor(height/w);

  for(var j= 0 ; j< rows; j++)
    for(var i = 0; i<cols; i++){
      var cell = new Cell(i,j);
      grid.push(cell);
    }

  text = createP("SET SPEEDS");
  text.position(width +10, 20);
  text.style("font-family", "monospace");
  text.style("background-color", "#FF0000");
  text.style("color", "#FFFFFF");
  text.style("font-size", "12pt");
  text.style("padding", "3px");


  mazeslider=createSlider(1,35,2,1);
  mazeslider.position(width +60, 70);

  text1 = createP("Maze");
  text1.position(width +10, 60);
  text1.style("font-family", "monospace");



  solveslider=createSlider(1,22,2,1);
  solveslider.position(width +60, 100);

  text2 = createP("Solver");
  text2.position(width +10, 90);
  text2.style("font-family", "monospace");

  button = createButton('RESET SOLVER');
  button.position(width + 20 , height-70);
  button.mousePressed(reset);

  current = grid[0];
  // setEverything();
  // background(51);
  // for(var i = 0; i < grid.length; i++){
  //  grid[i].show();
  // }
  text2 = createP("S + Click  : SET START FOR SOLVER");
  text2.position(width +10, 190);
  text2.style("font-family", "sans-serif");
  text2 = createP("E + Click  : SET END   FOR SOLVER");
  text2.position(width +10, 220);
  text2.style("font-family", "sans-serif");  

//not working
  // input = createInput();
  // input.position(width+20, 665);

  // button = createButton('RESET Maze');
  // button.position(input.x + input.width, input.y);
  // button.mousePressed(resetMaze);

}

function draw(){
  background(51);
  
  for(var i = 0; i < grid.length; i++){
    grid[i].show();
  }

  if(notSet){
    var x=0;
  while(x<mazeslider.value()){
    current.visited = true;
    current.highlight();
    var next =current.checkNeighbours();
    if(next){
      
      next.visited = true;
      stack.push(current);
      removeWalls(current,next)
      current = next;
    }
    else if(stack.length>0){
      current= stack.pop();}

  x++;}
}
  if(stack.length==0)notSet=false;

  if(mouseIsPressed && !notSet){
    if(keyIsPressed && key =='s'){
      current=grid[index(floor(mouseX/w),floor(mouseY/w))];
      current.start=true;}
    if(keyIsPressed && key =='e'){
      dest=grid[index(floor(mouseX/w),floor(mouseY/w))];

    dest.end=true;
    
    }
    //presses++;
    //current=grid[0];
  }
var x=0;
while(x<solveslider.value() && !notSet){
  if(dest){
    current.searchVisited= true;
    current.highlight();
    var next =current.searchNext()
    
    if(next && !found){
      if(next.i==dest.i && next.j==dest.j) found = true;
      next.searchVisited = true;
      stack.push(current);
      
      current = next;
    }
    else if(stack.length>0 && !found){
      current.backtraced=true;
      current= stack.pop();
    }
  }x++;
}




}

function resetMaze(){
  // reset(1);
  w=input.value();
  grid=[];
  stack=[];
  notSet=true;
  x=0;
  presses=0;
  dest;
  found= false;
  rect(0,0,width,height)
  setup();
}

function reset(z){
  while(stack.length>0)
    {stack.pop();}
  for(var i=0; i < grid.length-1; i++){
    var c=grid[i];
    c.searchVisited=false;
    c.backtraced=false;
    c.start=false;
    c.end=false;
    if(z==1){c.visited=false;
    c.walls=[true,true,true,true];}
  }
  
  current=grid[0][0];
  dest=undefined;
  found=false;
}


// function setEverything(){
//  while(x<cols*rows*2){
//    current.visited = true;
//  current.highlight();
//  var next =current.checkNeighbours();
//  if(next){
    
//    next.visited = true;
//    stack.push(current);
//    removeWalls(current,next)
//    current = next;
//  }
//  else if(stack.length>0){
//    current= stack.pop();
    
//  }x++;
//  }
// }

function index(i,j){
  
if(i<0|| j<0 || i> cols-1 || j> rows-1){
  return -1;
}
  var index = i +j*cols;
  return index;
}


function removeWalls(a,b){
  var x = a.i-b.i;
  if(x==1){
    a.walls[3]= false;
    b.walls[1]= false;
  }
  else if(x==-1){
    a.walls[1]= false;
    b.walls[3]= false;
  }

  var y = a.j-b.j;
  if(y==1){
    a.walls[0]= false;
    b.walls[2]= false;
  }
  else if(y==-1){
    a.walls[2]= false;
    b.walls[0]= false;
  }
}

function Cell(i,j){
  this.i=i;
  this.j=j;
  this.walls = [true,true,true,true]
  this.visited=false;
  this.searchVisited=false;
  this.end=false;
  this.start=false;
  this.backtraced=false;
  
  this.checkNeighbours = function(){
    var neighbours= [];
    
    var top = grid[index(i,j-1)];
    var right = grid[index(i+1,j)];
    var bottom = grid[index(i,j+1)];
    var left = grid[index(i-1,j)];

    if( top && !top.visited){
      neighbours.push(top);
    }if(right&& !right.visited){
      neighbours.push(right);
    }if(bottom && !bottom.visited){
      neighbours.push(bottom);
    }if(left && !left.visited){
      neighbours.push(left);
    }

    if(neighbours.length > 0){
      var r = floor(random(0,neighbours.length));
      return neighbours[r];}
    else{
      return undefined;
    }
  }
  
  this.searchNext = function(){
    var nexts = [];

    var top = grid[index(i,j-1)];
    var right = grid[index(i+1,j)];
    var bottom = grid[index(i,j+1)];
    var left = grid[index(i-1,j)];

    if(top && !this.walls[0] && !top.searchVisited)
      nexts.push(top);
    if(right && !this.walls[1] && !right.searchVisited)
      nexts.push(right);
    if(bottom && !this.walls[2] && !bottom.searchVisited)
      nexts.push(bottom);
    if(left && !this.walls[3] && !left.searchVisited)
      nexts.push(left);

    if(nexts.length > 0){
      var r = floor(random(0,nexts.length));
      return nexts[r];}
    else{
      return undefined;
    }

  } 

  
  this.show = function(){
    var x = this.i*w;
    var y = this.j*w;
    stroke(255);
    strokeWeight(1);
    if(this.walls[0])
    line(x,y,x+w,y)
    if(this.walls[1])
    line(x+w,y,x+w,y+ w)
    if(this.walls[2])
    line(x+w,y+w,x,y+w)
    if(this.walls[3])
    line(x,y+w,x,y)

    if(this.visited)
      {fill(0,250,250,200,200)
        if(this.searchVisited) fill(250,100,50,200,200)
        if(this.end) fill(0,0,255)
        else if(this.start)fill(250,0,0,200,200)
        else if (this.backtraced) fill(100,250,250,160,200);
        noStroke();
      rect(x,y,w,w);}

    }

  this.highlight=function(){
    var x = this.i*w;
    var y = this.j*w;
    fill(0,230,100)
    noStroke();
    
    rect(x,y,w,w);
  }

  

}