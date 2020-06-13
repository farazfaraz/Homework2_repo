"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];
var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId= 11;
var neckId = 12;
var treeID=13;
var branchTreeID1=14;
var branchTreeID2=15;
var branchTreeID3=16;
var branchTreeID4=17;
var branchTreeID5=18;
var branchTreeID6=19;

var torsoHeight = 4.0;
var torsoWidth = 8.0;
var upperArmHeight = 0.5;
var lowerArmHeight = 1.0;
var upperArmWidth  = 1.0;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 1.0;
var lowerLegHeight = 0.5;
var upperLegHeight = 1.0;
var headHeight = 1.5;
var headWidth = 2.0;
var tailHeight = 1.0;
var tailWidth = 0.5;
var neckHeight = 1.0;
var neckWidth = 0.9;
var treeWidth=2.0;
var treeHeight=7.0;
var branchTreeWidth1=0.5;
var branchTreeHeight1=2;
var branchTreeWidth2=0.5;
var branchTreeHeight2=2;
var branchTreeWidth3=0.5;
var branchTreeHeight3=2;
var branchTreeWidth4=0.5;
var branchTreeHeight4=2;
var branchTreeWidth5=0.5;
var branchTreeHeight5=2;
var branchTreeWidth6=0.5;
var branchTreeHeight6=2;

//defining variables for animation
var animateTorso = 0;
var moveLeg1 = 2.0;
var moveLeg2 = -2.0;
var movefoot1 = 3.0;
var movefoot2 = 3.0;
var a1 = 0;
var a2 = 0;
var a3 = 0;
var a4 = 0;
var b1 = 0;
var b2 = 0;
var b3 = 0;
var b4 = 0;
var x = 0;
var y = 0;
var run = false;
var runScratch = false;
var TI=180;
var reset=1;
var standUP=0;
var standTranslate=0;
var s1=0;
var s2 =0;
var sc =0;
var ang=0;
var h=4.2;
var w=-0.35;

var numNodes = 21;
var numAngles = 11;
var angle = 0;

var theta = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0, 120,0,0,0,0,0,0,0,0];

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];
//   Exercise2 (Add texture to each part of the bear instead of the head)
var texture1, texture2;
var c;
var texSize = 256;
var numChecks = 8;
var texCoordsArray = [];
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
var differentTexture=0;
var image1 = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            var patchx = Math.floor(i/(texSize/numChecks));
            var patchy = Math.floor(j/(texSize/numChecks));
            if(patchx%2 ^ patchy%2) c = 255;
            else c = 0;
            image1[4*i*texSize+4*j] = c;
            image1[4*i*texSize+4*j+1] = c;
            image1[4*i*texSize+4*j+2] = c;
            image1[4*i*texSize+4*j+3] = 255;
        }
    }
    var image3 = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            var patchx = Math.floor(i/(texSize/numChecks));
            var patchy = Math.floor(j/(texSize/numChecks));
            if(patchx%2 ^ patchy%2) c = 255;
            else c = 0;
            image3[10*i*texSize+4*j] = c;
            image3[4*i*texSize+4*j+1] = c;
            image3[8*i*texSize+4*j+2] = c;
            image3[4*i*texSize+4*j+3] = 255;
        }
    }
    //making a pattern with decrease in intensity
var image2 = new Uint8Array(4*texSize*texSize);

    
    for ( var i = texSize; i >-1; i-- ) {
        for ( var j = texSize; j >0; j--) {
            image2[4*i*texSize+4*j] = i;
            image2[4*i*texSize+4*j+1] = i;
            image2[4*i*texSize+4*j+2] = i;
            image2[4*i*texSize+4*j+3] = 255;
        }
    }
function configureTexture() {
    texture1 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);    
    texture2 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
    function configureTexture1() {
        texture1 = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_2D, texture1 );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image3);
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);    
        texture2 = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_2D, texture2 );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
    

//-------------------------------------------

/*function scale4(a, b, c) {
   var result = mat4();
   result[0] = a;
   result[5] = b;
   result[10] = c;
   return result;
}*/
function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
 }

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function initNodes(Id) {
    var m = mat4();

    switch(Id) {

    case torsoId:

    m = rotate(theta[torsoId], vec3(0, 1, 0) );
    m = mult(m, translate(animateTorso, 0, 0));
    //m = mult(m,rotate(-180, 0, 0, 1));
    m = mult(m,rotate(0, 180, 0, 1));
    m = mult(m,rotate(standUP, 0, 0, 1));
    m = mult(m, translate(standTranslate, 0, 0));
    m = mult(m, rotate(x,1,0,0));
    m = mult(m, translate(0, 0, y));
    m = mult(m, translate( -3, 0, 0));
    //m = mult(m,rotate(30,0,0,1))
    figure[torsoId] = createNode( m, torso, treeID, neckId );
    break;
    case treeID:
              
        m = mult(m,rotate(-180, 0, 0, 1));
        m=mult(m, translate(-9.0, -0.8*treeHeight, 0.0));
        figure[treeID] = createNode(m, treeBody, null,branchTreeID1);
    break;
    case branchTreeID1:              
        m = mult(m,rotate(-180, 0, 0, 1));
        m = mult(m,rotate(-40, 0, 0, 1));
        m=mult(m, translate(-1.1, -0.01*branchTreeHeight1, 0.0));
        figure[branchTreeID1] = createNode(m, branch1, null,branchTreeID2);
    break;
    case branchTreeID2:              
        m = mult(m,rotate(-180, 0, 0, 1));
        m = mult(m,rotate(-160, 0, 0, 1));
        m=mult(m, translate(-0.4, -0.01*branchTreeHeight2+3.0*branchTreeWidth2, 0.0));
        figure[branchTreeID2] = createNode(m, branch2, null,branchTreeID3);
    break;
    case branchTreeID3:              
        m = mult(m,rotate(-180, 0, 0, 1));
        m = mult(m,rotate(-160, 0, 0, 1));
        m=mult(m, translate(-0.4, -0.01*branchTreeHeight3+3.0*branchTreeWidth3, 0.0));
        figure[branchTreeID3] = createNode(m, branch3, null,branchTreeID4);
    break;
    case branchTreeID4:              
        m = mult(m,rotate(-180, 0, 0, 1));
        m = mult(m,rotate(-40, 0, 0, 1));
        m=mult(m, translate(-1.0, -0.1*branchTreeHeight4+3.0*branchTreeWidth3, 0.0));
        figure[branchTreeID4] = createNode(m, branch4, null,branchTreeID5);
    break;
    case branchTreeID5:              
        m = mult(m,rotate(-180, 0, 0, 1));
        m = mult(m,rotate(-100, 0, 0, 1));
        m=mult(m, translate(-0.4, -0.3*branchTreeHeight5-1.9*branchTreeWidth5, 0.0));
        figure[branchTreeID5] = createNode(m, branch5, null,branchTreeID6);
    break;
    case branchTreeID6:              
        m = mult(m,rotate(-180, 0, 0, 1));
        m = mult(m,rotate(-70, 0, 0, 1));
        m=mult(m, translate(-0.4, 0.3*branchTreeHeight6-1.9*branchTreeWidth6, 0.0));
        figure[branchTreeID6] = createNode(m, branch6, null,null);
    break;
    case neckId:
    m = translate(3.6, torsoHeight - neckHeight + 1.5, 0.0);
    m = mult(m, rotate(theta[neckId], 1, 0, 0))
    m = mult(m, rotate(theta[head2Id], 0, 1, 0));
    m = mult(m, translate(0.0, -1 * neckHeight, 0.0));
    figure[neckId] = createNode(m, neck, leftUpperArmId, headId);
    break;

    case headId:
    case head1Id:
    case head2Id:

    m = translate(0.55, torsoHeight-1.5*headHeight, 0.0);
	  m = mult(m, rotate(theta[head1Id], vec3(1, 0, 0)))
	  m = mult(m, rotate(theta[head2Id], vec3(0, 1, 0)));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, null, null);
    break;

    case leftUpperArmId:

    m = translate(-(torsoWidth-4.5*upperArmWidth), -0.35*torsoHeight, 0.0);
    m = mult(m, rotate(theta[leftUpperArmId], vec3(1, 0, 0)));
    m = mult(m, rotate(a1, 1, 0, 0));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:

    m = translate(torsoWidth-h*upperArmWidth, w*torsoHeight, 0.0);   
    /*  if(sc==1 && s1<-2.8 && s2<-0.05 )
    {
        s1+=0.1;
        s2-=0.011;
        m = translate(-torsoWidth-s1*upperArmWidth, -s2*torsoHeight, 0.0);         
        m = mult(m, rotate(theta[rightUpperArmId], vec3(1, 0, 0)));
        
        //m=mult(m, rotate(0, 50, 0, 1));
    }*/
    m=mult(m, rotate(ang, 0, 0, 1));
    //m=mult(m, rotate(ang, ang, ang, 1));
    m = mult(m, rotate(theta[rightUpperArmId], vec3(1, 0, 0)));
    m = mult(m, rotate(a3, 1, 0, 0));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:

    m = translate(-(0.2*torsoWidth+upperLegWidth), 0.1*upperLegHeight, 0.0);
    m = mult(m , rotate(theta[leftUpperLegId], vec3(1, 0, 0)));
    m = mult(m, rotate(a4, 1, 0, 0));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:

    m = translate(0.2*torsoWidth+upperLegWidth, 0.1*upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightUpperLegId], vec3(1, 0, 0)));
    m = mult(m, rotate(a2, 1, 0, 0));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, tailId, rightLowerLegId );
    break;

    case leftLowerArmId:

    m = translate(-0.2, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId], vec3(1, 0, 0)));
    m = mult(m, rotate(b1, 1, 0, 0));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:

    m = translate(-0.2, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId], vec3(1, 0, 0)));
    m = mult(m, rotate(b3, 1, 0, 0));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:

    m = translate(0.2, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId],vec3(1, 0, 0)));
    m = mult(m, rotate(b4, 1, 0, 0));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:

    m = translate(0.2, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], vec3(1, 0, 0)));
    m = mult(m, rotate(b2, 1, 0, 0));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;

    case tailId:
        m = translate(-3.5,-torsoHeight+ 8.5, 0.0);
        m = mult(m, rotate(theta[tailId], vec3(1, 0, 0)));
        figure[tailId] = createNode( m, tail, null, null );
    break;
    }
}
function addTexture(){
    if(differentTexture==0)
    configureTexture();
    else
    configureTexture1();
    //texture on the body
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

    gl.activeTexture( gl.TEXTURE1 );
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    gl.deleteTexture(texture1);
}
function traverse(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}
function torso() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    addTexture();
}
function head() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    differentTexture=1;
    addTexture();
    differentTexture=0;
}
function leftUpperArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    addTexture();
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftLowerArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    addTexture();
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightUpperArm() {
    instanceMatrix = mult(modelViewMatrix, translate(s1, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    addTexture();
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightLowerArm() {
    instanceMatrix = mult(modelViewMatrix, translate(s2, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    addTexture();
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function  leftUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    addTexture();
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    addTexture();
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    addTexture();
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    addTexture();
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function tail(){    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(tailWidth, tailHeight, tailWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    addTexture();
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function neck() {    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * neckHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(neckWidth, neckHeight, neckWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    addTexture();
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
  }
  function treeBody(){
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * treeHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(treeWidth, treeHeight, treeWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    addTexture();
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
function branch1(){
    
        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * branchTreeHeight1, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(branchTreeWidth1, branchTreeHeight1, branchTreeWidth1) );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
        addTexture();
        //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);        
    }
    function branch2(){
    
        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * branchTreeHeight2, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(branchTreeWidth2, branchTreeHeight2, branchTreeWidth2) );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
        addTexture();
        //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);        
    }
    function branch3(){    
        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * branchTreeHeight3, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(branchTreeWidth3, branchTreeHeight3, branchTreeWidth3) );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
        addTexture();
        //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);        
    }
    function branch4(){    
        instanceMatrix = mult(modelViewMatrix, translate(0.5, 0.5 * branchTreeHeight4, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(branchTreeWidth4, branchTreeHeight4, branchTreeWidth4) );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
        addTexture();
        //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);        
    }
    function branch5(){    
        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * branchTreeHeight5, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(branchTreeWidth5, branchTreeHeight5, branchTreeWidth5) );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
        addTexture();
        //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);        
    }
    function branch6(){    
        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * branchTreeHeight6, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(branchTreeWidth6, branchTreeHeight6, branchTreeWidth6) );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
        addTexture();
        //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);        
    }

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     texCoordsArray.push(texCoord[0]);//exercise 2
     pointsArray.push(vertices[b]);
     texCoordsArray.push(texCoord[1]);//exercise 2
     pointsArray.push(vertices[c]);
     texCoordsArray.push(texCoord[2]);//exercise 2
     pointsArray.push(vertices[d]);
     texCoordsArray.push(texCoord[3]);//exercise 2
}
function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix)  );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix)  );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    //Exercise 2
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
    ////////////////////////////////////////////////////
    for(i=0; i<numNodes; i++) initNodes(i);

    document.getElementById("move").onclick = function(event) {
        if(reset==2){
        standUP=0;
        standTranslate=0;
        animateTorso = 0;
        theta[headId] = 90;
         a1=0;
         a2=0;
         a3=0;
         a4=0;
         b1=0;
         b2=0;
         b3=0;
         b4=0;
        moveLeg1 = 2.0;
        moveLeg2 = -2.0;
        movefoot1 = 3.0;
        movefoot2 = 3.0;
        x=0;
        y=0;
        reset=0;
    }
    reset+=1;
        run = !run;
        document.getElementById("txt").value=theta[torsoId];
    };
    document.getElementById("scratch").onclick = function(event) {
        animateTorso = 0;
        theta[headId] = 90;
        sc=0;
         a1=0;
         a2=0;
         a3=0;
         a4=0;
         b1=0;
         b2=0;
         b3=0;
         b4=0;
        moveLeg1 = 2.0;
        moveLeg2 = -2.0;
        movefoot1 = 3.0;
        movefoot2 = 3.0;
        x=0;
        y=0;
        runScratch = !runScratch;
        document.getElementById("txt").value=standUP;
    };
    render();
}
//for scratching
function animateScratch() {
    if(animateTorso > 5.0 && animateTorso < 5.3) 
    {
        //standUP=0;
        sc=1;

        sc=0;
        x=0;
        y=0;
        a1=0;
        a2=0;
        a3=0;
        a4=0;
        b1=0;
        b2=0;
        b3=0;
        b4=0;
        moveLeg1 = 2.0;
        moveLeg2 = -2.0;
        movefoot1 = 3.0;
        movefoot2 = 3.0;
        if(theta[torsoId]<180 && theta[torsoId]>-180){
        theta[torsoId]-=1;
        for(i=0; i<numNodes; i++) initNodes(i);
    }else{
        for(i=0; i<numNodes; i++) initNodes(i);
        scratchingPart();}
}else{
    movementPart();    
}
}
function scratchingPart(){
    //for(i=0; i<numNodes; i++) initNodes(i);

    if (standUP>-90) {
        movementPartForStanding(); 
        standUP -= 1.0; 
        standTranslate+=0.07;    
    }
    }

function animateBear() {
    if(animateTorso > 5.0 && animateTorso < 5.3) 
   {
            standUP=0;
            standTranslate=0;
            x=0;
            y=0;
            a1=0;
            a2=0;
            a3=0;
            a4=0;
            b1=0;
            b2=0;
            b3=0;
            b4=0;
            moveLeg1 = 2.0;
            moveLeg2 = -2.0;
            movefoot1 = 3.0;
            movefoot2 = 3.0;
            if(theta[torsoId]<180 && theta[torsoId]>-180){
            theta[torsoId]-=1;
            for(i=0; i<numNodes; i++) initNodes(i);
        }else{
            movementPart()}
    }else{
        movementPart();    
}    
   }
function movementPart(){
    for(i=0; i<numNodes; i++) initNodes(i);
    //translate the body
    animateTorso += 0.06;    
    // rotate head when it starts to run
    if (theta[headId] < 100) theta[headId] += 1.0;    
    // front right leg and back left leg animation
    a1 += moveLeg1;
    a2 += moveLeg1;
    if (a1 > 20 && a2 > 20){
        moveLeg1 = -moveLeg1;
    }
    if (a1 < -20 && a2 < -20){
        moveLeg1 = -moveLeg1;
    }    
    //front  left leg and back right leg animation
    a3 += moveLeg2;
    a4 += moveLeg2;
    if (a3 > 20 && a4 > 20)
    {
        moveLeg2 = -moveLeg2;
    }
    if (a3 < -20 && a4 < -20){
        moveLeg2 = -moveLeg2;
    }    
    // lower legs animation
    if (a1 >= 0 && a1 < 20 && a2 >= 0 && a2 < 20)
    {
        b1 += movefoot1;
        b2 += movefoot1;

        if ((b2 >= 40 && b1 >= 40) || ( b1 <= 0 && b2 <= 0))
        {
            movefoot1 = -movefoot1;
        }
    }    
    if (a4 >= 0 && a4 < 20 && a3 >= 0 && a3 < 20)
    {
        b3 += movefoot2;
        b4 += movefoot2;

        if ((b3 >= 40 && b4 >= 40) || (b3 <= 0 && b4 <= 0)){
            movefoot2 = -movefoot2;
        }}
}
function movementPartForStanding(){
    for(i=0; i<numNodes; i++) initNodes(i);
    if( ang>-90 )
    {
        s1+=0.18;
        s2+=0.18;
        ang-=3;
        rightUpperArm();
        rightLowerArm();
        document.getElementById("txt").value=s1;
    }
    if( ang==-90)
    {
        ang=-95; 
        h-=2;
        rightUpperArm();
        rightLowerArm();
    }}
var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //    gl.clear( gl.COLOR_BUFFER_BIT );
    if (runScratch) animateScratch();
    if (run) animateBear();
    traverse(torsoId);
    requestAnimationFrame(render);
}
