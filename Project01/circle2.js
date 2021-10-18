
var canvas;
var gl;

var radius = 0.8;
var circleVertices = 40;
var triangleVertices = circleVertices * 3;
var bacteriaNumber = Math.floor(Math.random() * 8) + 2;
var vertices = new Float32Array(triangleVertices * (bacteriaNumber+1));
var colors = [];
var centerPoint = [];
var radiusIncrement;
var increment = 0.01;
var threshold = 2*radius * Math.sin((Math.PI/6)/2)
window.onload = window.onresize = function starter(){
  init();
  // initBacteria();
}
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

    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

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
      var bacteriaCenter = vec2(Math.cos(triangleAngle) * radius, Math.sin(triangleAngle) * radius) ;
      // alert("Center bac: " + bacteriaCenter);
      var rand = [Math.random(), Math.random(), Math.random()];
      for(var j = triangleVertices * (i + 1); j< ((i + 2) * triangleVertices); j++){
        vertices[j] = j;
        centerPoint[j] = bacteriaCenter;
        colors[j] = vec4(rand[0], rand[1], rand[2], 1.0);
      }
    }
    //
    //  Configure WebGL
    //
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

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    increment += 0.001;
    gl.uniform1f(radiusIncrement, increment);
    gl.drawArrays( gl.TRIANGLES, 0, vertices.length );
};
var timer = setInterval(checkThreshold, 10);
function checkThreshold(){
  if(increment > threshold && vertices.length >= triangleVertices * 3){
    alert("You lost!");
    clearInterval(timer);
  }else{
    window.requestAnimFrame(render, canvas);

  }
}
/*ONCLICK WE WILL NEED TO CALCULATE THE DISTANCES
BETWEEN THE CLICK AND THE CENTER OF bacterias
THAT ARE THE SAME BETWEEN triangleVertices
*/
