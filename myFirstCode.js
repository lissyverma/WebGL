"use strict";
var canvas;
var canvas0;
var gl;
var points = [];
var subdivisions = 10;
var theta = 0;
var thetaLoc;

window.onload = function init()
{
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }
		
		var vertices = [
        vec2( 0, 1 ),
        vec2( -0.8660254, -0.5),
        vec2( 0.8660254, -0.5)
    ];
	tesselate(vertices[0], vertices[1], vertices[2], subdivisions);
		
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 0.25);
	
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram(program);
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
	
	var vposition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vposition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vposition);
	
	thetaLoc = gl.getUniformLocation( program, "theta" );

    document.getElementById("Button1").onclick = function(){theta += 1;};
    document.getElementById("Button2").onclick = function(){theta -= 1;};
	
	render();
};

function triangle(a, b, c)
{
	points.push(a, b, c);
}
function tesselate(a, b, c, n)
{
	if(n===0)
	{
		triangle(a,b,c);
	}
	else
	{
		var ab = mix( a, b, 0.5 );
		var bc = mix( b, c, 0.5 );
        var ac = mix( a, c, 0.5 );
		
		--n;
		
		tesselate(a, ab, ac, n);
		tesselate(ab, b, bc, n);
		tesselate(ac, bc, c, n);
		tesselate(ac, ab, bc, n);
	}
}

function render()
{
	gl.uniform1f(thetaLoc, theta);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLES, 0, points.length);
	setTimeout(
        function (){requestAnimFrame(render);}, 1);
}	
	