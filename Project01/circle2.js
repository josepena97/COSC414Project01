var canvas;
var gl;
var cWidth;
var cHeight;


var radius = 0.8;
var circleVertices = 100;
var triangleVertices = circleVertices * 3;
var bacteriaNumber = Math.floor(Math.random() * 8) + 2;
var vertices = new Float32Array(triangleVertices * (bacteriaNumber+1));
var colors = [];
var centerPoint = [];
var radiusIncrement;
var increment = 0.01;
var threshold = 2*radius * Math.sin((Math.PI/6)/2);
var centerPointB = [];
var distancesB = [];
var minDistance = [];
var min;
window.onload = window.onresize = function starter()
{
  canvas = document.getElementById( "gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }
  init();
  canvas.onmousedown = function(e, canvas){click(e, gl-canvas);};

};

function init()
{
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var min = Math.min(screenWidth, screenHeight);
    document.getElementById('bodyStyle').style.width = min + "px";
    document.getElementById('bodyStyle').style.height = min + "px";
    document.getElementById('bodyStyle').style.margin = "auto";
    document.getElementById('gl-canvas').style.margin = "auto";
    document.getElementById('gl-canvas').style.width =  "80%";
    document.getElementById('gl-canvas').style.height = "80%";


    for(var i = 0; i < triangleVertices; i++){
      vertices[i] = i;
      centerPoint[i] = vec2(0.0, 0.0);
      colors[i] = vec4(1.0, 1.0, 1.0, 1.0);
    }

    for(var i = 0; i < bacteriaNumber; i++){
      var randomVertex = Math.floor(Math.random() * (circleVertices - 1));
      // alert(randomVertex);
      var angleRatio = randomVertex / circleVertices;
      // alert(angleRatio);
      var triangleAngle = angleRatio * Math.PI * 2.0;
      // alert(triangleAngle);
      var bacteriaCenter = vec2(Math.cos(triangleAngle) * radius, Math.sin(triangleAngle) * radius);
      centerPointB[i] = bacteriaCenter;

      // alert("Center bac: " + bacteriaCenter);
      var rand = [Math.random(), Math.random(), Math.random()];
      for(var j = triangleVertices * (i + 1); j< ((i + 2) * triangleVertices); j++){
        vertices[j] = j;
        centerPoint[j] = bacteriaCenter;
        colors[j] = vec4(rand[0], rand[1], rand[2], 1.0);
      }
    }

    centerDistances();
    //
    //  Configure WebGL
    //
    cWidth = canvas.width;
    cHeight = canvas.heigh;
    gl.viewport( 0, 0,  canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0);

    // enable hidden-surface removal

    // gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader


    //buffer for vertices number
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

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
    gl.vertexAttribPointer( vCPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vCPosition );


    //buffer for color
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );


    render();
};


function centerDistances()
{
  var singleDistance;
  min = Number.POSITIVE_INFINITY;
  for(var i = 0; i < bacteriaNumber - 1; i++){
    singleDistance = [];
    // document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<p> Bacteria" + i +"</p>";
    for(var j = i + 1; j < bacteriaNumber; j++){
      // document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML + "<br> -Bacteria" + i +" - " + j;
      d = distanceBetweenPoints(centerPointB[i], centerPointB[j]);
      if(min>d){
        // alert("BOOLEAN <br>" + min + " > " + d + "  =  " + (min>d));
        min = d;
        minDistance = [d, i, j];
      }
      singleDistance.push(d);
    }
    distancesB.push(singleDistance);
  }
  document.getElementById('debug').innerHTML = "<pre>" + printArr(distancesB) + "</pre><br>" + minDistance ;
};

function printArr(arr)
{
  let str = "";
    for (let item of arr) {
      if (Array.isArray(item)) str += printArr(item);
      else str += item + ", ";
    }
    return str;
};

function distanceBetweenPoints(v1, v2)
{
    return Math.abs(Math.sqrt((v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1])));
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    increment += 0.001;
    gl.uniform1f(radiusIncrement, increment);
    gl.drawArrays( gl.TRIANGLES, 0, vertices.length );
};

var timer = setInterval(checkThreshold, 10);

function checkThreshold()
{
  if(increment > threshold && vertices.length >= triangleVertices * 3){
    alert("You lost!");
    clearInterval(timer);
  }else{

    window.requestAnimFrame(render, canvas);
  }
};

function click(e, canvas) {
    alert("click");
		var x = (e.clientX / canvas.cWidth) * 2 - 1;
		var y = (1 - (e.clientY / canvas.cHeight)) * 2 - 1;
		let hit = false;

		for (var i = 0; i < centerPointB.length; i++) {

      xB = centerPointB[0];
      yB = centerPointB[1];
      alert("Mouse clicked, \nx = " + x + "\ny = " + y);

			if (clickedBacteria(x,y,xB,yB, i)) {
				//increase score by factor of time -> radius
				//the longer the amount of time the larger the points.
				//1/radius of circle since radius is bigger over time will work.
				// console.log("score before: " + score);
				// console.log("radius: " + generatedBacteria[i].r)
				// console.log("difference: " + (score + Math.round(1/generatedBacteria[i].r)));
				// score += Math.round(1/generatedBacteria[i].r);
				// console.log("score after: " + score);
				// hit = true;
				// k.delete();
				// break;
        alert("Deleted");
			}
		}
	}

function clickedBacteria(x, y, a, b, i){
  d = distanceBetweenPoints(vec2(x,y), vec2(a,b));
  if(increment >= d){
    deleteBacteria(vec2(a, b), i);
  }
};

function deleteBacteria(v, i){
  vertices.splice(i * triangleVertices, triangleVertices);
  centerPoint.splice(i * triangleVertices, triangleVertices);
  colors.splice(i * triangleVertices, triangleVertices);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

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
  gl.vertexAttribPointer( vCPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vCPosition );

    //buffer for color
  var cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );


  render();
};
