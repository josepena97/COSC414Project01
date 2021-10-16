

var canvas;
var gl;
var triangleSize = 60;
var bacteriaSize = 10;
var angleIncrement = (2 * Math.PI) / triangleSize;
var angleIncrementB = (2 * Math.PI) / bacteriaSize;

var radius = 0.75;
var vertices;
var colors;
var bacteriaVertices;
var bacteriaColors;
var r = 0.1;

window.onload = window.onresize = function init()
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

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the vertices of our 3D gasket
    // Four vertices on unit circle
    // Intial tetrahedron with equal length sides
    vertices = [];
    bacteriaVertices = [];
    colors = [];
    bacteriaColors = [];

    var angle = 0;
    var x = Math.cos(angle) * radius;
    var y = Math.sin(angle) * radius;
    var low = vec3(x, y, 0);

    var i = 0;
    divideCircle(low, angle, i);

    randomBacterias = Math.floor(Math.random() * (10 - 2)) + 2;
    randomVertices = [];
    for(var i = 0; i < randomBacterias; i++){
      rand = (3* (Math.floor(Math.random() * 59))) + Math.floor(Math.random() * (1)) + 1;
      randomVertices[i] = vertices[rand];
    }
    for(var i = 0; i < randomBacterias; i++){

      var xc = randomVertices[i][0];
      var yc = randomVertices[i][1];

      var randc = Math.random();
      // alert("Bacteria " + i + " - Color " + randc + "\nXC = " + xc + "\nYC = " + yc);

      var angle = 0;
      var x = (Math.cos(angle) * r) + xc;
      var y = (Math.sin(angle) * r) + yc;
      var low = vec3(x, y, 0);
      var j = 0;
      divideBacteria(low, angle, j, r, xc, yc, randc);
      // function divideBacteria(low, angle, i, r, xc, yc, randc){

    }


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0);

    // enable hidden-surface removal

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    render(vertices.length);


    //buffer for bacterias
    var cbBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cbBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(bacteriaColors), gl.STATIC_DRAW );

    var vbColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vbColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vbColor );

    var vbBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(bacteriaVertices), gl.STATIC_DRAW );

    var vbPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );



    // debug();
    render(bacteriaVertices.length);
};

function divideCircle(low, angle, i)
{
  if(i == triangleSize){
    return;
  }

  colors.push(vec4(1.0, 1.0, 1.0, 1.0));
  colors.push(vec4(1.0, 1.0, 1.0, 1.0));
  colors.push(vec4(1.0, 1.0, 1.0, 1.0));

  vertices.push(vec3(0.0, 0.0, 0.0));
  vertices.push(low)
  angle += angleIncrement;
  var x =  Math.cos(angle) * radius;
  var y  = Math.sin(angle) * radius;
  var high = vec3(x, y, 0);
  vertices.push(high);
  i++;
  divideCircle(high, angle, i);
}

function divideBacteria(low, angle, i, radiusB, xc, yc, randc){
  if(i == bacteriaSize){
    return;
  }

  bacteriaColors.push(vec4(randc, randc, randc, 1.0));
  bacteriaColors.push(vec4(randc, randc, randc, 1.0));
  bacteriaColors.push(vec4(randc, randc, randc, 1.0));

  bacteriaVertices.push(vec3(xc, yc, 0.0));
  bacteriaVertices.push(low)
  angle += angleIncrementB;
  var x = (Math.cos(angle) * radiusB) + xc;
  var y = (Math.sin(angle) * radiusB) + yc;
  // alert("XC = " + xc
  //       + "\nYC = " + yc
  //       + "\nvertexX = " + x
  //       + "\nvertexY = " + y);
  var high = vec3(x, y, 0);
  bacteriaVertices.push(high);
  i++;
  divideBacteria(high, angle, i, radiusB, xc, yc, randc);
}

function render(size)
{
    //gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLES, 0, size );
}

// function debug(){
//   document.getElementById("debug").innerHTML =
//       "SIZE OF VERTICES: " + vertices.length
//       + "SIZE OF COLORS: " + colors.length;
//           //JSON.stringify(vertices, null, 2);
// }
