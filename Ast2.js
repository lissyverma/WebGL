var canvas;
var gl;

var ismousedown = 0;

var maxNumTriangles = 20000;  
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;

var count = 0;
var tv;
var temp = 0;

var cindex = 0;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
	var m = document.getElementById("mymenu");

    m.addEventListener("click", function() {
       cindex = m.selectedIndex;
    });
	
    canvas.addEventListener("mousedown", function(){
		ismousedown = 1;
		temp = 0;
	});
	
	canvas.addEventListener("mouseup", function(){
		ismousedown = 0;
		count = 0;
		temp = 1;
	});
	
    canvas.addEventListener("mousemove", function(event){
		if(ismousedown)
		{
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        tv = vec2(2*event.clientX/canvas.width-1, 
           2*(canvas.height-event.clientY)/canvas.height-1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(tv));
        
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        var tc = vec4(colors[(cindex)]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(tc));
		index++;
		
		console.log("point" + cindex);
		
		if(count>0)
		{
		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
		gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(tv));
		
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(tc));
        index++;
		
		console.log(" dup point" + cindex);
		}
		count++;
		}
		
		if(temp>0)
		{
			 gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        tv = vec2(2*event.clientX/canvas.width-1, 
           2*(canvas.height-event.clientY)/canvas.height-1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(tv));
        
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        var tc = vec4(colors[(cindex)]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(tc));
		index++;
		temp = 0;
		console.log("end point" + cindex);
		
		}
    } );


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();

}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	gl.lineWidth(1.0);
    gl.drawArrays( gl.LINES, 0, index );

    window.requestAnimFrame(render);

}
