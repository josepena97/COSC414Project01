"use strict";

var canvas;
var gl;
var triangleSize = 64;
var angleIncrement = (2 * Math.PI) / triangleSize;
var radius = 0.75;
var vertices = [];
var colors = [];


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the vertices of our 3D gasket
    // Four vertices on unit circle
    // Intial tetrahedron with equal length sides

    var angle = 0;
    var x = Math.cos(angle) * radius;
    var y = Math.sin(angle) * radius;
    var low = vec3(x, y, 0);

    var i = 0;
    divideCircle(low, angle, i);
    // document.getElementById("debug").innerHTML = JSON.stringify(vertices, null, 2);
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    // enable hidden-surface removal

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    // var cBuffer = gl.createBuffer();
    // gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    //
    // var vColor = gl.getAttribLocation( program, "vColor" );
    // gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    // gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function divideCircle(low, angle, i)
{
  if(i == triangleSize){
    return;
  }
  vertices.push(vec3(0.0, 0.0, 0.0, 0.0));
  vertices.push(low)
  angle += angleIncrement;
  var x =  Math.cos(angle) * radius;
  var y  = Math.sin(angle) * radius;
  var high = vec3(x, y, 0);
  vertices.push(high);
  i++;
  divideCircle(high, angle, i);
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLES, 0, vertices.length );
}
