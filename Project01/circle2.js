/*
Group 42:
Jose Pena Revelo 89152599
Marieke Gutter-Spence (43435445)
This program will create and run a Webgl game linked to circle2.html
*/
var canvas;
var gl;
var program;

//variable defining the increment every interval
var step = 0.0015;

//variables to create circles and threshold
var radius = 0.8;
var circleVertices = 100;
var triangleVertices = circleVertices * 3;
var vertices = [];
var colors = [];
var bacteriaNumber = Math.floor(Math.random() * 8) + 2;
var centerPoint = [];
var increment = 0.0;
var threshold = radius * Math.tan(Math.PI/12);

var centerPointB = [];
var distancesB = [];


var centerPointP = [];
var distancesP = [];
var startIncrementP = [];

var pointSteps = threshold / step;
var point = 100 / pointSteps;

//function to initate 2d graphics
window.onload = function init()
{
  canvas = document.getElementById( "gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  var min = Math.min(screenWidth, screenHeight);
  document.getElementById('bodyStyle').style.width = "auto"; //min + "px";
  document.getElementById('bodyStyle').style.height = "auto"; //min + "px";
  document.getElementById('bodyStyle').style.margin = "auto";
  document.getElementById('gl-canvas').style.float = "left";
  document.getElementById('gl-canvas').style.width =  min - 30 + "px";
  document.getElementById('gl-canvas').style.height = min- 30 + "px";
  document.getElementById('resetB').style.width =  10 + "px";
  document.getElementById('resetB').style.height = 10 + "px";


  //Initialize all vertices in center circle
  for(var i = 0; i < triangleVertices; i++){
    vertices[i] = i;
    centerPoint[i] = vec3(0.0, 0.0, 0.0);
    colors[i] = vec4(1.0, 1.0, 1.0, 1.0);
  }

//Initialize all vertices for bacterias
  for(var i = 0; i < bacteriaNumber; i++){
    var randomVertex = Math.floor(Math.random() * (circleVertices - 1));
    // alert(randomVertex);
    var angleRatio = randomVertex / circleVertices;
    // alert(angleRatio);
    var triangleAngle = angleRatio * Math.PI * 2.0;
    // alert(triangleAngle);
    var bacteriaCenter = vec3(Math.cos(triangleAngle) * radius, Math.sin(triangleAngle) * radius, 0.0);
    centerPointB[i] = bacteriaCenter;

    // alert("Center bac: " + bacteriaCenter);
    var rand = [Math.random(), Math.random(), Math.random()];
    //create the bacteria
    for(var j = triangleVertices * (i + 1); j< ((i + 2) * triangleVertices); j++){
      vertices[j] = j;
      centerPoint[j] = bacteriaCenter;
      colors[j] = vec4(rand[0], rand[1], rand[2], 1.0);
    }
  }
  bacteriaDistances();

  //Configure WebGL
  gl.viewport( 0, 0,  canvas.width, canvas.height );
  gl.clearColor( 0.0, 0.0, 0.0, 1.0);


  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  bufferNewData();
  window.requestAnimFrame(render);

  //Everytime the user clicks
  canvas.onmousedown = function(e, canvas){clickPoison(e, "gl-canvas");};
};

// function to buffer data before rendering
function bufferNewData()
{
  var vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );

  var vPosition = gl.getAttribLocation( program, "vertex" );
  gl.vertexAttribPointer( vPosition, 1, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  var vNumber = gl.getUniformLocation(program, 'verticesNumber');
  gl.uniform1f(vNumber, triangleVertices);

  var centerRadius = gl.getUniformLocation(program, 'radiusLength');
  gl.uniform1f(centerRadius, radius);

  var circleV = gl.getUniformLocation(program, 'circleVertices');
  gl.uniform1f(circleV, circleVertices);

  radiusIncrement = gl.getUniformLocation(program, 'increment');
  gl.uniform1f(radiusIncrement, increment);

  //buffer for circle center point
  var vCBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vCBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(centerPoint), gl.STATIC_DRAW );

  var vCPosition = gl.getAttribLocation( program, "centerPoint" );
  gl.vertexAttribPointer( vCPosition, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vCPosition );

    //buffer for color
  var cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );
};

//render function on WebGL
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(radiusIncrement, increment);
    gl.drawArrays( gl.TRIANGLES, 0, vertices.length );
};


//timer to increase bacteria and posion size
var timer = setInterval(checkThreshold, 50);

//function to check if the games continuous and results
function checkThreshold()
{
  if(increment >= threshold && centerPointB.length >= 2){
    alert("You lost!");
    clearInterval(timer);
  }else{
    if(increment >= threshold){
      alert("You Win! \nPoints: " + Math.floor((increment/step) * point));
      clearInterval(timer);
    }
    increment += step;
    updatePoisonPropagation();
    updateBacteriaCollide();
    render();
  }
  if(centerPointB.length == 0){
    render();
    alert("You Win! \nPoints: " + Math.floor((increment/step) * point));
    console.log("centerPointB.length == 0")
    clearInterval(timer);
  }
};

//distance between two 2d vertices
function distanceBetweenPoints(v1, v2)
{
    return Math.abs(Math.sqrt(Math.pow((v1[0] - v2[0]), 2) + Math.pow((v1[1] - v2[1]), 2)));
};

//distances between bacterias
//the 2d array will have an upper triangle shape
function bacteriaDistances()
{
  distancesB = [];
  for(var i = 0; i < centerPointB.length - 1; i++){
    var temp = [];
    // document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<p> Bacteria" + i +"</p>";
    for(var j = i + 1; j < centerPointB.length; j++){
      // document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<br> -Bacteria" + i +" - " + j;
      d = distanceBetweenPoints(vec2(centerPointB[i][0], centerPointB[i][1]), vec2(centerPointB[j][0], centerPointB[j][1]));
      temp.push(d);
    }
    distancesB.push(temp);
    // alert(print2DArray(distancesB));
  }
  // document.getElementById('debug').innerHTML = "<pre>" + print2DArray(distancesB) + "</pre><br>" + minDistance ;
};




//interface with the user clicks,
//check if click is inside a bacteria
//start poison popagation
function clickPoison(e, id)
{
  canvas = document.getElementById(id);
	var x = ((2 * e.clientX) / canvas.clientWidth) - 1;
	var y = ((2 * (canvas.clientHeight -  e.clientY)) / canvas.clientHeight)  - 1;

  // alert("X = " + x + "\nY=" + y);

	for (var i = 0; i < centerPointB.length; i++) {
    xB = centerPointB[i][0];
    yB = centerPointB[i][1];
      // alert("Size of array" + centerPointB.length
      //       +  "\nIteration -> " + i
      //         + "\nxB = " + xB
      //         + "\nyB = "+ yB);
		if (poisonedBacteria(x,y,xB,yB, i)) {
      propagatePoision(x, y);
      break;
		}
	}
};

//check if poison click is inside a bacteria
function poisonedBacteria(x, y, a, b, index){
  d = distanceBetweenPoints(vec2(x,y), vec2(a,b));
  // alert("Test poisonedBacteria:\n"
  //        + "Distance between point = " + d
  //         + "Current radio = " + increment);

  if(increment >= d){
    var flag = deleteBacteria(index);
    return true;
  }
};

//delete bacteria produce by click, culture colide, or poison propagation
function deleteBacteria(index){
  // alert("Delete:\n"
  //     + "verticesSize = " + vertices.length
  //     + "centerPointSize = " + centerPoint.length
  //     + "colorsSize = " + colors.length
  //   );
  for(var k = 0; k < centerPointP.length; k++){
    distancesP[k].splice(index, 1);
  }
  for(k = 0; k < index; k++){
    distancesB[k].splice(index - 1 - k, 1);
  }
  distancesB.splice(index, 1);

  centerPointB.splice(index, 1);
  vertices.splice((index+1) * triangleVertices, triangleVertices);
  centerPoint.splice((index+1) * triangleVertices, triangleVertices);
  colors.splice((index+1) * triangleVertices, triangleVertices);
  // console.log("Delete Bacteria: " + index + "\centerPointB.length = " + centerPointB.length);

  // alert("Delete:\n"
  //     + "verticesSize = " + vertices.length
  //     + "centerPointSize = " + centerPoint.length
  //     + "colorsSize = " + colors.length
  //   );
  bufferNewData();
  render();
  return true;
};


//function to calculate distances between bacterias and posion propagation
//the 2d array will have a square shape
function updatePoisonDistance()
{
  distancesP = [];
  var temp = [];
  for(var i = 0; i < centerPointP.length; i++){
    for(var j = 0; j < centerPointB.length; j++){
      temp[j] = distanceBetweenPoints(vec2(centerPointP[i][0], centerPointP[i][1]), vec2(centerPointB[j][0], centerPointB[j][1]));
    }
    distancesP.push(temp);
  }
};

//function will initialize the poison propagation
function propagatePoision(x, y)
{
  centerPointP.push(vec2(x,y));
  var start = vertices.length;
  var end = vertices.length + triangleVertices;
  // alert("PROPAGATE"
  //       + "\nstart = " + start
  //       + "\nend = " + end
  //       + "\ngap = " + (end - start)
  //     );
  for(var i = start; i < end; i++)
  {
    vertices[i] = i;
    centerPoint[i] = vec3(x, y, increment);
    colors[i] = vec4(0.0, 0.0, 1.0, 0.1);
  }

  var temp = [];
  for(var i = 0; i < centerPointB.length; i++){
    temp[i] = distanceBetweenPoints(vec2(x,y), vec2(centerPointB[i][0], centerPointB[i][1]));
  }

  distancesP.push(temp);
  // alert("Distances = " + print2DArray(distancesP));
  startIncrementP.push(increment);

  bufferNewData();
  render();
};

//depending on the increment, the function
//will compare distances of poison and bacterias
//and delete in contact
function updatePoisonPropagation(){
  var poisoned = [];

  for(var i = 0; i < centerPointP.length; i++){
    for(var j = 0; j < centerPointB.length; j++){
      // alert("SI=" + startIncrementP[i]);
      var pRadius = increment - startIncrementP[i];
      var totalRadius = increment + pRadius;
      var distanceRP = distancesP[i][j];

      if(totalRadius >= distanceRP){
        // alert("Delete bacteria [ " + j + " ]");
        deleteBacteria(j)
        // alert("POST:\n" + print2DArray(distancesP));
        break;
      }
    }
  }
};
//depending on the increment, the function
//will compare distances of  bacterias
//and delete in contact

function updateBacteriaCollide(){
  // alert(print2DArray(distancesB));
  for(var i = 0; i < distancesB.length; i++){
    for(var j = 0; j < distancesB[i].length; j++){
      var d = distancesB[i][j];
      var totalRadius = increment * 2;
      if(totalRadius >= d){
        // alert(print2DArray(distancesB));
        deleteBacteria(i + j + 1);
        // alert(print2DArray(distancesB));
      }
    }
  }
}


//debugging purposes
function print2DArray(arr)
{
  let str = "\n";
    for (var i = 0; i < arr.length; i++) {
      str = str + "Row[" + i + "]: ";
      for(var j = 0; j < arr[i].length; j++){
        str = str + "[" + j + "]:" + arr[i][j] + ", ";
      }
      str += "\n\n";
    }
    return str;
};

function printArray(arr){
  let str = "\n";
  var i = 0;
  for(let element of arr){
    str = str + element +", ";
  }

  return str;
}
