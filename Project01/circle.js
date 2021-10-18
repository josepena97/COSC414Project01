
var canvas;
var gl;
var triangleNumber = 100;
var angleIncrement = (2 * Math.PI) / triangleNumber;

var radius = 0.75;
var vertices;
var colors;
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

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the vertices of our 3D gasket
    // Four vertices on unit circle
    // Intial tetrahedron with equal length sides
    vertices = [];
    colors = [];

    var angle = 0;
    var i = 0;
    divideCircle(angle, i);

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
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices.length );
};

function divideCircle(angle, i)
{
  if(i == triangleNumber){
    return;
  }
  var x =  Math.cos(angle) * radius;
  var y  = Math.sin(angle) * radius;
  var vertex = vec3(x, y, 0);
  vertices.push(vertex);
  colors.push(vec4(1.0, 1.0, 1.0, 1.0));
  i++;
  angle += angleIncrement;
  divideCircle(angle, i);
};


var triangleNumberB = 50;
var angleIncrementB = (2 * Math.PI) / triangleNumberB;
var verticesB;
var colorsB;
var radiusB = 0.1;
var randomVertices;
var randc = [];

function initBacteria()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    verticesB = [];
    colorsB = [];
    randomVertices = [];
    randomBacterias = Math.floor(Math.random() * (10 - 2)) + 2;
    //Selection of random vertices
    for(var i = 0; i < randomBacterias; i++){
      rand = Math.floor(Math.random() * 98);
      randomVertices[i] = vertices[rand];
    }

    for(var i = 0; i < randomBacterias; i++){
      var xc = randomVertices[i][0];
      var yc = randomVertices[i][1];
      randc[i] = [Math.random(),Math.random(),Math.random()] ;

      var angle = 0;
      var x = (Math.cos(angle) * radiusB) + xc;
      var y = (Math.sin(angle) * radiusB) + yc;
      var low = vec3(x, y, 0);
      var j = 0;
      divideBacteria(low, angle, j, radiusB, xc, yc, randc[i]);
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

    //buffer for bacterias
    document.getElementById('debug').innerHTML = "Number of bacterias: " +randomBacterias
                                                  + "<br>Vertices Number: " + verticesB.length
                                                  + "\nNumber of Colors: " + colorsB.length;
    var cbBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cbBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsB), gl.STATIC_DRAW );

    var vbColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vbColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vbColor );

    var vbBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesB), gl.STATIC_DRAW );

    var vbPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vbPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vbPosition );

    // debug();
    renderB();
};
function renderB()
{
    gl.drawArrays( gl.TRIANGLES, 0, verticesB.length );
};

function divideBacteria(low, angle, i, r, xc, yc, randc){
  if(i == triangleNumberB){
    return;
  }

  colorsB.push(vec4(randc[0], randc[1], randc[2], 1.0));
  colorsB.push(vec4(randc[0], randc[1], randc[2], 1.0));
  colorsB.push(vec4(randc[0], randc[1], randc[2], 1.0));

  verticesB.push(vec3(xc, yc, 0.0));
  verticesB.push(low)
  angle += angleIncrementB;
  var x = (Math.cos(angle) * r) + xc;
  var y = (Math.sin(angle) * r) + yc;
  var high = vec3(x, y, 0);
  verticesB.push(high);
  i++;
  divideBacteria(high, angle, i, r, xc, yc, randc);
};

// var timer = setInterval( increaseRadius, 10);
// function increaseRadius(){
//   radiusB += 0.0005;
//   updateBacteria();
// };

function updateBacteria(){
  for(var i = 0; i < randomBacterias; i++){
    var xc = randomVertices[i][0];
    var yc = randomVertices[i][1];
    var angle = 0;
    var x = (Math.cos(angle) * radiusB) + xc;
    var y = (Math.sin(angle) * radiusB) + yc;
    var low = vec3(x, y, 0);
    var j = 0;
    divideBacteria(low, angle, j, radiusB, xc, yc, randc[i]);
    // function divideBacteria(low, angle, i, r, xc, yc, randc){
  }

  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  //buffer for bacterias
  var cbBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cbBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsB), gl.STATIC_DRAW );

  var vbColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vbColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vbColor );

  var vbBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vbBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesB), gl.STATIC_DRAW );

  var vbPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vbPosition, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vbPosition );

  // debug();
  renderB();
};
