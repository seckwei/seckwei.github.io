/*
	THE NORTH WALL - GAME OF THRONES
	Seck Wei, Lim - 2015

	Using 
	- @mrdoob's THREE.JS & Orbit Controls
	- Google's Chrome Experiment DAT.GUI
*/


/**************************************
	
		CONFIGURATION VARIABLES

***************************************/
var camConfig = {
	posX : 0,
	posY : 1000,
	posZ : 3000
}

var groundConfig = {
	width : 20000,
	height: 100,
	depth : 20000
};

var wallConfig = {
	// 800 is initial width
	// x10 to scale
	// x2 to extend
	// +100 to accomodate for top of wall blocks
	width  : 800*10*2 + 100,
	height : 220*10,
	depth  : 50*10
}

var wallBlockConfig = {
	width  : 305,
	height : 50,
	depth  : 200
}
wallBlockConfig.posY = wallConfig.height + wallBlockConfig.height/2;
wallBlockConfig.posZ = wallConfig.depth/2 - wallBlockConfig.depth/2;

var elevatorConfig = {
	width	: 50,
	height	: 20,
	depth	: 30,
	posY	: groundConfig.height/2 + 10,
	thickness	: 2
}
elevatorConfig.posZ = wallConfig.depth/2 + 50 + Math.tan(0.092528)*(wallConfig.height - elevatorConfig.posY);

var longBeamConfig = {
	width	: 10,
	height	: wallConfig.height + 100,
	depth	: 40,
	posX	: elevatorConfig.width/2 + 10,
	posY	: wallConfig.height/2 + 50,
	posZ	: wallConfig.depth/2 + 140,
	rotX	: -0.092528
}


/**************************************
	
			OBJECT MATERIALS

***************************************/
/* Beam Material */
var beamMat = new THREE.MeshLambertMaterial({
	color   : 0x645242,
	shading : THREE.FlatShading
});

/* Grill Material */
var grillMat = new THREE.MeshLambertMaterial({
	color   : 0x323839,
	shading : THREE.FlatShading,
	side: THREE.DoubleSide
});

/* Wall Material */
var wallMat = new THREE.MeshLambertMaterial({
	color : 0xFFFFFF,
	shading : THREE.FlatShading,
	wireframe : false
});


/**************************************
	
			INITIALISATION

***************************************/
var scene, camera, controls, renderer;
var init = function(){

	// WINDOW SIZE
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;

	// DEFAULT CAM ATTRIBUTE
	var VIEW_ANGLE = 45;
	var ASPECT = WIDTH / HEIGHT;
	var NEAR = 0.1;
	var FAR = 100000;

	// Get DOM Element
	var $container = $('#container');

	// RENDERER
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setClearColor(0x000000, 0.5); //CDCDCD

	// CAMERA
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	
	camera.position.x = camConfig.posX;
	camera.position.y = camConfig.posY;
	camera.position.z = camConfig.posZ;
	
	// ORBIT CONTROLS
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	// SCENE
	scene = new THREE.Scene();
	scene.add(camera);

	// Attach Renderer
	$container.append(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
};


/**************************************
	
		OBJECTS CREATION & PLACMENT

***************************************/
var light, lightBall;
var placeLight = function(){

	/*
		Directional Light 1
	*/
	var x = 300;
	var y = 500;
	var z = 500;

	light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
	light.position.set( x, y, z );

	scene.add(light);

	// Light ball 1
	var lightBallMat = new THREE.MeshBasicMaterial( { color: 0xFFFF } );
	var lightBallGeo = new THREE.SphereGeometry( 10, 16, 16 );
	lightBall = new THREE.Mesh(lightBallGeo, lightBallMat);
	lightBall.position.x = x;
	lightBall.position.y = y;
	lightBall.position.z = z;

	scene.add(lightBall);

	/*
		Directional Light 2
	*/
	x = -300;
	y =  200;
	z = -1000;

	light = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
	light.position.set( x, y, z );

	scene.add(light);

	// Light ball 2
	lightBall = new THREE.Mesh(lightBallGeo, lightBallMat);
	lightBall.position.x = x;
	lightBall.position.y = y;
	lightBall.position.z = z;

	scene.add(lightBall);
};

var ground;
var placeGround = function(){

	var groundMat = new THREE.MeshLambertMaterial({
		color : 0xFFFFFF,
		shading: THREE.FlatShading,
		side  : THREE.DoubleSide,
		wireframe : false
	});

	var groundGeo = new THREE.BoxGeometry( 
		groundConfig.width, 
		groundConfig.height, 
		groundConfig.depth,
		100, 1, 100
	);

	groundGeo.vertices = groundVertexY;

	computeNormals(groundGeo);

	ground = new THREE.Mesh(groundGeo, groundMat);
	ground.position.y = -groundConfig.height/2;

	scene.add(ground);
};

var wall, wallGeo;
var placeWall = function(){

	/*
		Base Wall
	*/
	wallGeo = new THREE.BoxGeometry( 
		wallConfig.width, 
		wallConfig.height, 
		wallConfig.depth,
		200, 10
	);

	wallGeo.vertices = wallVertexZ10;

	computeNormals(wallGeo);

	wall = new THREE.Mesh(wallGeo, wallMat);
	wall.position.y = wallConfig.height/2 + 0.1;

	scene.add(wall);
};

var wallBlock, wallBlockGeo;
var placeTopWall = function(){

	/*
		Wall Block Top View
		 ___________
	  S	|			| S
	  i	|   Height	| i
	  d	|   Points	| d
	  e	|			| e
	  s	|___________| s
			Front
	*/
	
	/* 
		Generating the wall blocks for top of wall 
	*/
	for(var x = -(wallConfig.width/2 - wallBlockConfig.width/2); 
		x < (wallConfig.width-100)/2; 
		x+=wallBlockConfig.width+100 // Space between wall blocks = 100
	){

		/* South Facing Wall Block */
		wallBlockGeo = new THREE.BoxGeometry(
			wallBlockConfig.width, 
			wallBlockConfig.height, 
			wallBlockConfig.depth,
			4, 1, 2
		);

		// Random Generate the surface of the blocks
		for(var i = 0; i < wallBlockGeo.vertices.length; i++){
			// Random height points 
			if(wallBlockGeo.vertices[i].y > 0){
				wallBlockGeo.vertices[i].y = Math.random()*5;
			}

			// Random side bumps
			if(wallBlockGeo.vertices[i].x >= wallBlockConfig.width/2){
				wallBlockGeo.vertices[i].x += Math.random()*10;
			}
			else if(wallBlockGeo.vertices[i].x <= -(wallBlockConfig.width/2)){
				wallBlockGeo.vertices[i].x -= Math.random()*10;
			}

			// Random front facing points
			if(wallBlockGeo.vertices[i].z > 0){
				wallBlockGeo.vertices[i].z += Math.random()*20 + 5;
			}
		}

		computeNormals(wallBlockGeo);

		wallBlock = new THREE.Mesh(wallBlockGeo, wallMat);
		
		wallBlock.position.x = x;
		wallBlock.position.y = wallBlockConfig.posY;
		wallBlock.position.z = wallBlockConfig.posZ;

		scene.add(wallBlock);

		/* North Facing Wall Block */
		wallBlockGeo = new THREE.BoxGeometry(
			wallBlockConfig.width, 
			wallBlockConfig.height, 
			wallBlockConfig.depth,
			4, 1, 2
		);
		// Random Generate the surface of the blocks
		for(var i = 0; i < wallBlockGeo.vertices.length; i++){
			// Random height points  
			if(wallBlockGeo.vertices[i].y > 0){
				wallBlockGeo.vertices[i].y = Math.random()*5;
			}

			// Random side bumps
			if(wallBlockGeo.vertices[i].x >= wallBlockConfig.width/2){
				wallBlockGeo.vertices[i].x += Math.random()*10;
			}
			else if(wallBlockGeo.vertices[i].x <= -(wallBlockConfig.width/2)){
				wallBlockGeo.vertices[i].x -= Math.random()*10;
			}

			// Random front facing points
			// (subtract because it is facing away from Z)
			if(wallBlockGeo.vertices[i].z < 0){
				wallBlockGeo.vertices[i].z -= Math.random()*20 + 5;
			}
		}

		computeNormals(wallBlockGeo);

		wallBlock = new THREE.Mesh(wallBlockGeo, wallMat);
		
		wallBlock.position.x = x;
		wallBlock.position.y = wallBlockConfig.posY;
		wallBlock.position.z = -wallBlockConfig.posZ;

		scene.add(wallBlock);
	}

	/* X Support Beam */
	var xSupBeamGeo = new THREE.BoxGeometry( wallConfig.width, 2.5, 2.5 );

	var y = wallConfig.height + wallBlockConfig.height - 25;
	var z = 50;

	for (var i = 0; i < 2; i++) {
		var mult = (i%2)? -1 : 1;

		var xSupBeam = new THREE.Mesh(xSupBeamGeo, beamMat);
		xSupBeam.position.y = y - 1;
		xSupBeam.position.z = z*mult;

		scene.add(xSupBeam);
	}

	/* Z, Y Beams & Wooden Platform */
	var zSupBeamGeo = new THREE.BoxGeometry( 2.5, 2.5, wallConfig.depth );
	var ySupBeamGeo = new THREE.BoxGeometry( 5, 40, 5 );

	var placeYSupBeam = function(x, y, z){
		var ySupBeam = new THREE.Mesh(ySupBeamGeo, beamMat);
		ySupBeam.position.y = y;
		ySupBeam.position.x = x;
		ySupBeam.position.z = z;
		scene.add(ySupBeam);
	};

	var xOff = 40;
	var zOff1 = 120;
	var zOff2 = 170;

	var arr = [-6480, -5265, -4860, -4455, -3240, -2835, -2430, -1620, -405, 0, 405, 810, 1620, 2430, 2835, 3240, 3645, 4455, 4860, 5670, 6075, 6480, 7695];
	var start = 0;
	var	end = arr.length-1;

	for (var x = -(wallConfig.width/2 - wallBlockConfig.width - 50); x < wallConfig.width/2; x += wallBlockConfig.width+100) {
		/* Z Support Beam */
		for (var i = 0; i < 2; i++) {
			var mult = (i%2)? -1 : 1;

			var zSupBeam = new THREE.Mesh(zSupBeamGeo, beamMat);
			zSupBeam.position.y = y;
			zSupBeam.position.x = x + 40*mult;
			scene.add(zSupBeam);	
		}

		/* Y Support Beam 
			
			X(4)       X(2)


			X(3)       X(1) 

		*/

		// Along the X Axis
		// X(1)
		placeYSupBeam(x+50, y-10,  48);
		// X(2)
		placeYSupBeam(x+50, y-10, -48);
		// X(3)
		placeYSupBeam(x-50, y-10,  48);
		// X(4)
		placeYSupBeam(x-50, y-10, -48);

		scene.add(placeTorchHolders(x+50, y-10,  43.5, 180));
		scene.add(placeTorchHolders(x+50, y-10, -43.5, 0));
		scene.add(placeTorchHolders(x-50, y-10,  43.5, 180));
		scene.add(placeTorchHolders(x-50, y-10, -43.5, 0));
		
		// Along the Z Axis (Top)
		placeYSupBeam(x+xOff, y-10, zOff1);
		placeYSupBeam(x+xOff, y-10, zOff2);
		placeYSupBeam(x-xOff, y-10, zOff1);
		placeYSupBeam(x-xOff, y-10, zOff2);

		scene.add(placeTorchHolders(x+xOff-4.5, y-10, zOff1, -90));
		scene.add(placeTorchHolders(x-xOff+4.5, y-10, zOff1, 90));

		// Along the Z Axis (Bot)
		placeYSupBeam(x+xOff, y-10, -zOff1);
		placeYSupBeam(x+xOff, y-10, -zOff2);
		placeYSupBeam(x-xOff, y-10, -zOff1);
		placeYSupBeam(x-xOff, y-10, -zOff2);

		scene.add(placeTorchHolders(x+xOff-4.5, y-10, -zOff1, -90));
		scene.add(placeTorchHolders(x-xOff+4.5, y-10, -zOff1, 90));

		/* Place Wooden Platforms */
		if(binSearch(arr, x, start, end)){
			placeWoodenPlatforms(x);	
		}
	};
	//console.log(arr);
};

var placeWoodenPlatforms = function(_x){

	var platformGroup = new THREE.Group();
	/* 
		Wooden Platforms (facing North) 
	*/
	var wPlatConfig = {
		width : 80,
		height: 80,
		depth : 50,
		thickness: 2
	}
	var woodPlankGeo = new THREE.BoxGeometry(wPlatConfig.width, wPlatConfig.thickness, wPlatConfig.depth/4 - 5);

	/*
		Base of Platform
	*/
	// X Planks 
	for(var z = -wPlatConfig.depth; z < wPlatConfig.depth; z+= wPlatConfig.depth/6){

		var woodPlank = new THREE.Mesh(woodPlankGeo, beamMat);
		woodPlank.position.x = 0;
		woodPlank.position.y = 0;
		woodPlank.position.z = z;

		platformGroup.add(woodPlank);
	}

	// Z Support Beams 
	var wBeamConfig = {
		width : wPlatConfig.thickness*2,
		height: wPlatConfig.thickness*4
	}

	var woodBeamGeo = new THREE.BoxGeometry(wBeamConfig.width, wBeamConfig.height, wPlatConfig.depth*2);

	for(var x = -(wPlatConfig.width - wBeamConfig.width)/2; 
		x <= (wPlatConfig.width/2 - wBeamConfig.width/2);
		x += (wPlatConfig.width - wBeamConfig.width)/4)
	{

		var woodBeam = new THREE.Mesh(woodBeamGeo, beamMat);
		woodBeam.position.x = x;
		woodBeam.position.y = -(wBeamConfig.height + wPlatConfig.thickness)/2;
		woodBeam.position.z = 0;

		platformGroup.add(woodBeam);
	}

	// Rotated X Support Beam 
	var xWoodBeamConfig = {
		width : wPlatConfig.width + 30,
		rotX  : deg2rad(25)
	}
	var woodBeamGeo = new THREE.BoxGeometry(xWoodBeamConfig.width, wBeamConfig.height, wBeamConfig.height/2);
	var xWoodBeam = new THREE.Mesh(woodBeamGeo, beamMat);

	xWoodBeam.position.x = 0;
	xWoodBeam.position.y = -(wPlatConfig.thickness + wBeamConfig.height)/2 - wBeamConfig.height;
	xWoodBeam.position.z = wPlatConfig.depth/2 + wPlatConfig.depth/4;

	xWoodBeam.rotation.x = xWoodBeamConfig.rotX;

	platformGroup.add(xWoodBeam);

	/*
		Y Beams
	*/
	// Inclined Long Y Support Beam 
	var woodBeamGeo = new THREE.BoxGeometry(wBeamConfig.width*2, wPlatConfig.height*2.5, wBeamConfig.width*2);

	for (var i = 0; i < 2; i++) {
		var mult = (i%2)? -1 : 1;

		var woodBeam = new THREE.Mesh(woodBeamGeo, beamMat);

		woodBeam.position.x = (wPlatConfig.width/2 + wBeamConfig.width) * mult;
		woodBeam.position.y = xWoodBeam.position.y - 20;
		woodBeam.position.z = xWoodBeam.position.z - 3;

		woodBeam.rotation.x = xWoodBeamConfig.rotX;

		platformGroup.add(woodBeam);

	};

	// Y Support Beam 
	var woodBeamGeo = new THREE.BoxGeometry(wBeamConfig.width*2, wPlatConfig.height, wBeamConfig.width*2);

	for (var i = 0; i < 2; i++) {
		var mult = (i%2)? 1 : -1;

		var woodBeam = new THREE.Mesh(woodBeamGeo, beamMat);

		woodBeam.position.x = (wPlatConfig.width/2 + wBeamConfig.width) * mult;
		woodBeam.position.y = wPlatConfig.height/2 - 20;
		woodBeam.position.z = -wPlatConfig.depth/4;

		platformGroup.add(woodBeam);

		platformGroup.add(
			placeTorchHolders(
				woodBeam.position.x - 6*mult, 
				woodBeam.position.y + 15, 
				woodBeam.position.z, 
				90*-mult
			)
		);
	};

	// Inclined Short Y Support Beam 
	var woodBeamGeo = new THREE.BoxGeometry(wBeamConfig.width*2, wPlatConfig.height + 5, wBeamConfig.width*2);

	for (var i = 0; i < 2; i++) {
		var mult = (i%2)? -1 : 1;

		var woodBeam = new THREE.Mesh(woodBeamGeo, beamMat);

		woodBeam.position.x = (wPlatConfig.width/2 + wBeamConfig.width*3) * mult;
		woodBeam.position.y = xWoodBeam.position.y + wPlatConfig.height/5;
		woodBeam.position.z = wPlatConfig.depth/4;

		woodBeam.rotation.x = -(xWoodBeamConfig.rotX + deg2rad(15));

		platformGroup.add(woodBeam);

	};

	/*
		Roof of Platform 
	*/
	// Top X Beam 
	var woodBeamGeo = new THREE.BoxGeometry(wPlatConfig.width, wBeamConfig.height, wBeamConfig.height);
	var woodBeam = new THREE.Mesh(woodBeamGeo, beamMat);

	woodBeam.position.x = 0;
	woodBeam.position.y = wPlatConfig.height - wBeamConfig.height/2 - 20;
	woodBeam.position.z = -wPlatConfig.depth/4;

	platformGroup.add(woodBeam);


	// Rotated X Roof Plank 
	var woodBeamGeo = new THREE.BoxGeometry(wPlatConfig.width + 10, wBeamConfig.height*1.5, wBeamConfig.height/2);
	var xWoodBeam = new THREE.Mesh(woodBeamGeo, beamMat);

	xWoodBeam.position.x = 0;
	xWoodBeam.position.y = wPlatConfig.height - wBeamConfig.height/2 - 15 - wBeamConfig.height/2;
	xWoodBeam.position.z = wPlatConfig.depth*1.5;

	xWoodBeam.rotation.x = xWoodBeamConfig.rotX - deg2rad(10);

	platformGroup.add(xWoodBeam);

	// Roof Z Beams 
	var woodBeamGeo = new THREE.BoxGeometry(wBeamConfig.width, wBeamConfig.height, wPlatConfig.depth*2 + 5);

	for(var x = -(wPlatConfig.width - wBeamConfig.width)/2; 
		x <= (wPlatConfig.width/2 - wBeamConfig.width/2);
		x += (wPlatConfig.width - wBeamConfig.width)/3)
	{

		var woodBeam = new THREE.Mesh(woodBeamGeo, beamMat);
		woodBeam.position.x = x;
		woodBeam.position.y = wPlatConfig.height - wBeamConfig.height/2 - 17 + wBeamConfig.height/2;
		woodBeam.position.z = wPlatConfig.depth*4/6 + 5;

		platformGroup.add(woodBeam);
	}

	// Roof X Planks 
	for(var z = -wPlatConfig.depth; z < wPlatConfig.depth; z+= wPlatConfig.depth/6){

		var woodPlank = new THREE.Mesh(woodPlankGeo, beamMat);
		woodPlank.position.x = 0;
		woodPlank.position.y = wPlatConfig.height - wBeamConfig.height/2 - 17 + wBeamConfig.height;
		woodPlank.position.z = z + wPlatConfig.depth*4/6;

		platformGroup.add(woodPlank);
	}

	platformGroup.position.x = _x;
	platformGroup.position.y += wallConfig.height + 5;
	platformGroup.position.z -= wallConfig.depth/2 + wPlatConfig.depth/2;

	platformGroup.rotation.y = deg2rad(180);

	platformGroup.scale.x = 0.6;
	platformGroup.scale.y = 0.6;
	platformGroup.scale.z = 0.6;

	scene.add(platformGroup);
}

var placeTorchHolders = function(_x, _y, _z, _ry){

	var torch = new THREE.Object3D();

	var extrudeSettings = { amount: 0.5, bevelEnabled: false, steps: 2 };

	// Torch Rings
	for(var i = 0; i < 3; i++){

		
		var ringShape = new THREE.Shape();
		ringShape.absarc( 10, 10, 2, 0, Math.PI*2, true );

		var holePath = new THREE.Path();
		holePath.absarc( 10, 10, 1.9, 0, Math.PI*2, true );
		ringShape.holes.push( holePath );

		var ringGeo = new THREE.ExtrudeGeometry( ringShape, extrudeSettings );

		var ring = new THREE.Mesh( ringGeo, grillMat );
		ring.rotation.x = deg2rad(90);

		ring.position.set(-10, i * 1.1, -10);
		torch.add(ring);
	}

	// Torch side supports
	var num = 5;
	for(var i = 0; i < num; i++){
		var supGroup = new THREE.Object3D();
		
		var supGeo = new THREE.BoxGeometry(0.5, 3.5, 0.1);

		var sup = new THREE.Mesh(supGeo, grillMat);
		sup.position.z = 2;
		sup.position.y += 0.5;

		supGroup.add(sup);

		supGroup.rotation.y = deg2rad(i/num * 360);
		torch.add(supGroup);
	}

	// Torch Bowl
	var segments = 16;
	var phiStart = 10;
	var phiLength = 2 * Math.PI;
	    
    var points = [];
    var count = 1.8;
    for (var i = 0; i < count; i+=0.2) {
        points.push(new THREE.Vector3((Math.cos(i * 1.1) + 1), 0, ( i - count ) + count));
    }

    var latheGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    var latheMesh = new THREE.Mesh(latheGeometry, grillMat);
    latheMesh.rotation.x = deg2rad(90);
    latheMesh.position.y -= 1;

    torch.add(latheMesh);

    // Torch Handle
    var handleGeo = new THREE.CylinderGeometry(0.7, 0.6, 7, 16);
    var handle = new THREE.Mesh(handleGeo, grillMat);

    handle.position.y -= 6;
    torch.add(handle);

    torch.rotation.z = deg2rad(-20);

    /*
    	Torch Holder Brackets
    */
    var torchHolder = new THREE.Object3D();

    // Top Hortizontal
    var holderGeo = new THREE.BoxGeometry(4, 0.2, 3);
    var holder = new THREE.Mesh(holderGeo, grillMat);
    holder.position.y -= 4;
    holder.position.x -= 2;
    torchHolder.add(holder); 

    // Bot Horizontal
    holder = new THREE.Mesh(holderGeo, grillMat);
    holder.position.y -= 7;
    holder.position.x -= 2;
    torchHolder.add(holder);

    // Vertical
    holder = new THREE.Mesh(holderGeo, grillMat);

    holder.rotation.z = deg2rad(90);
    holder.position.y -= 5 + 0.1;
    holder.position.x -= 4;
    torchHolder.add(holder);

    torchHolder.add(torch)

    _x = _x || 0;
    _y = _y || 0;
    _z = _z || 0;
    _ry = _ry || 0;

    torchHolder.position.set(_x, _y, _z);
    torchHolder.rotation.y = deg2rad(-90);

    torchHolder.rotation.y += deg2rad(_ry);

    var scale = 0.5;
    torchHolder.scale.set(scale,scale,scale);

	return torchHolder;
}

var castle;
var placeCastle = function(){

	/*
		Castle Black
	*/
	var width = 400;
	var height = 100;
	var depth = 200;

	var castleMat = new THREE.MeshLambertMaterial({
		color : 0x000000
	});

	var castleGeo = new THREE.BoxGeometry( width, height, depth );

	castle = new THREE.Mesh(castleGeo, castleMat);
	castle.position.x += 50;
	castle.position.y = height/2;
	castle.position.z = wallConfig.depth + 80;

	scene.add(castle);
};

var longBeam, zBeam;
var placeElevatorBeams = function(){
	/*
		Elevator Beams
	*/
	
	var longBeamGeo = new THREE.BoxGeometry(longBeamConfig.width, longBeamConfig.height, longBeamConfig.depth);

	/* Long Beam Left & Right */
	for (var i = 0; i < 2; i++) {
		var mult = (i%2)? -1 : 1;

		longBeam = new THREE.Mesh(longBeamGeo, beamMat);

		longBeam.position.x = longBeamConfig.posX * mult;
		longBeam.position.y = longBeamConfig.posY;
		longBeam.position.z = longBeamConfig.posZ;

		longBeam.rotation.x = longBeamConfig.rotX;
		scene.add(longBeam);
	}

	/* 
		Z Beams 
	*/
	var zBeamConfig = {
		width	: 13,
		height	: 13,
		depth	: 250,
		posX	: longBeamConfig.posX + 15,
		rotY	: deg2rad(6)
	};
	var zBeamGeo = new THREE.BoxGeometry(zBeamConfig.width, zBeamConfig.height, zBeamConfig.depth);
	
	for(var y = 200; y < longBeamConfig.height; y+=150){

		// Skewing the Z position according to Long Beam's X Rotation
		var z = (longBeamConfig.height - y) * Math.sin(-longBeamConfig.rotX) + longBeamConfig.posZ - 200;

		/* Left Right Z Beams */
		for (var i = 0; i < 2; i++) {
			var mult = (i%2)? -1 : 1;

			zBeam = new THREE.Mesh(zBeamGeo, beamMat);
			zBeam.position.x = zBeamConfig.posX * mult;
			zBeam.position.z = z;
			zBeam.position.y = y;
			zBeam.rotation.y = -zBeamConfig.rotY * mult;

			scene.add(zBeam);
		}
	}

	/*
		X Beams
	*/
	var xBeamConfig = {
		width	: longBeamConfig.posX * 2 + 20,
		height	: 5,
		depth	: 5
	};
	var xBeamGeo = new THREE.BoxGeometry(xBeamConfig.width, xBeamConfig.height, xBeamConfig.depth);

	for(var y = 195; y < longBeamConfig.height; y+=150){

		// Skewing the Z position according to Long Beam's X Rotation
		var z = (longBeamConfig.height - y) * Math.sin(-longBeamConfig.rotX) + longBeamConfig.posZ - 85;

		/* Left Z Beams */
		xBeam = new THREE.Mesh(xBeamGeo, beamMat);
		xBeam.position.z = z;
		xBeam.position.y = y;

		scene.add(xBeam);
	}
};

var elevator;
var placeElevator = function(){

	elevator = new THREE.Group();
	var elevatorMat = beamMat;

	/* 
		Base 
	*/
	var elevatorBaseConfig = {
		posY : groundConfig.height/2 + elevatorConfig.posY
	}
	var elevatorBaseGeo = new THREE.BoxGeometry(elevatorConfig.width, elevatorConfig.thickness, elevatorConfig.depth);

	var elevatorBase = new THREE.Mesh(elevatorBaseGeo, elevatorMat);
	elevatorBase.position.x = 0;
	elevatorBase.position.y = elevatorConfig.posY + elevatorConfig.thickness/2;
	elevatorBase.position.z = elevatorConfig.posZ;

	elevator.add(elevatorBase);

	/* 
		Front Wall (ground floor door) 
	*/
	var fWallConfig = {
		width 	: elevatorConfig.width /3,
		height	: elevatorConfig.height/3
	}
	fWallConfig.posX = (elevatorConfig.width - fWallConfig.width)/2
	fWallConfig.posY = elevatorBase.position.y + fWallConfig.height/2;
	fWallConfig.posZ = elevatorConfig.posZ + elevatorConfig.depth/2 - elevatorConfig.thickness/2;


	var fWallGeo = new THREE.BoxGeometry(fWallConfig.width, fWallConfig.height, elevatorConfig.thickness-1);

	/* 
		Front Wall Handles 
	*/
	var fwhConfig = Object.create(fWallConfig);

	fwhConfig.height = elevatorConfig.thickness;
	fwhConfig.depth  = elevatorConfig.thickness;
	fwhConfig.posY  += (fWallConfig.height/2);

	var fwhGeo = new THREE.BoxGeometry(fwhConfig.width, fwhConfig.height, fwhConfig.depth);

	/* Adding Front Wall Objects */
	for (var i = 0; i < 2; i++) {
		var mult = (i%2)? 1 : -1;
		
		var fWall = new THREE.Mesh(fWallGeo, elevatorMat);
		fWall.position.x = fWallConfig.posX * mult;
		fWall.position.y = fWallConfig.posY;
		fWall.position.z = fWallConfig.posZ;

		elevator.add(fWall);

		var fwh = new THREE.Mesh(fwhGeo, elevatorMat);
		fwh.position.x = fwhConfig.posX * mult;
		fwh.position.y = fwhConfig.posY;
		fwh.position.z = fwhConfig.posZ;

		elevator.add(fwh);
	};

	/* Adding Back Wall Objects */
	for (var i = 0; i < 2; i++) {
		var mult = (i%2)? 1 : -1;
		
		var bWall = new THREE.Mesh(fWallGeo, elevatorMat);
		bWall.position.x = fWallConfig.posX * mult;
		bWall.position.y = fWallConfig.posY;
		bWall.position.z = fWallConfig.posZ - elevatorConfig.depth + elevatorConfig.thickness;

		elevator.add(bWall);

		var bwh = new THREE.Mesh(fwhGeo, elevatorMat);
		bwh.position.x = fwhConfig.posX * mult;
		bwh.position.y = fwhConfig.posY;
		bwh.position.z = fwhConfig.posZ - elevatorConfig.depth + elevatorConfig.thickness;

		elevator.add(bwh);
	};

	/* 
		Side Wall
	*/
	var sWallConfig = {
		posX	: elevatorConfig.width/2 - elevatorConfig.thickness/2,
		posY	: fWallConfig.posY,
		posZ	: elevatorConfig.posZ
	};

	var sWallLeftGeo = new THREE.BoxGeometry(elevatorConfig.thickness/2, fWallConfig.height, elevatorConfig.depth - elevatorConfig.thickness);

	/*
		Side Wall Handles
	*/
	var swhGeo = new THREE.BoxGeometry(elevatorConfig.thickness, elevatorConfig.thickness, elevatorConfig.depth - elevatorConfig.thickness);

	/* Adding Side Wall Objects */
	for (var i = 0; i < 2; i++) {
		var mult = (i%2)? 1 : -1;

		var sWallLeft = new THREE.Mesh(sWallLeftGeo, elevatorMat);
		sWallLeft.position.x = sWallConfig.posX * mult;
		sWallLeft.position.y = sWallConfig.posY;
		sWallLeft.position.z = sWallConfig.posZ;

		elevator.add(sWallLeft);

		var swh = new THREE.Mesh(swhGeo, elevatorMat);
		swh.position.x = sWallConfig.posX * mult;
		swh.position.y = fwhConfig.posY;
		swh.position.z = sWallConfig.posZ;

		elevator.add(swh);
	}


	/*
		Y Beams (Front)
	*/
	var yBeamConfig = {
		height	  : elevatorConfig.height,
		thickness : elevatorConfig.thickness
	}

	yBeamConfig.posX = -(elevatorConfig.width/2 - yBeamConfig.thickness/2);
	yBeamConfig.posY = elevatorBase.position.y + yBeamConfig.height/2;
	yBeamConfig.posZ = fWallConfig.posZ;

	var yBeamGeo = new THREE.BoxGeometry(yBeamConfig.thickness, yBeamConfig.height, yBeamConfig.thickness);

	var yBeam;
	for (var x = yBeamConfig.posX;
			x < elevatorConfig.width/2;
			x += (fWallConfig.width - yBeamConfig.thickness/3)
		) {
		yBeam = new THREE.Mesh(yBeamGeo, elevatorMat);
		yBeam.position.x = x;
		yBeam.position.y = yBeamConfig.posY;
		yBeam.position.z = yBeamConfig.posZ;

		elevator.add(yBeam);
	};

	/*
		Y Beams (Back)
	*/
	for (var x = yBeamConfig.posX; 
			x < elevatorConfig.width/2;
			x += (fWallConfig.width - yBeamConfig.thickness/3)
		) {
		yBeam = new THREE.Mesh(yBeamGeo, elevatorMat);
		yBeam.position.x = x;
		yBeam.position.y = yBeamConfig.posY;
		yBeam.position.z = yBeamConfig.posZ - elevatorConfig.depth + elevatorConfig.thickness;

		elevator.add(yBeam);
	};

	/*
		Y Beams (Middle, Left & Right)
	*/
	for (var i = 0; i < 2; i++) {
		var mult = (i%2)? 1 : -1;

		yBeam = new THREE.Mesh(yBeamGeo, elevatorMat);
		yBeam.position.x = (elevatorConfig.width/2 - elevatorConfig.thickness/2) * mult;
		yBeam.position.y = yBeamConfig.posY;
		yBeam.position.z = yBeamConfig.posZ + elevatorConfig.thickness/2 - elevatorConfig.depth/2;

		elevator.add(yBeam);
	}

	/*
		Top X Beam
	*/
	var topXBeamGeo = new THREE.BoxGeometry(elevatorConfig.width, elevatorConfig.thickness, elevatorConfig.thickness);

	var topXBeamConfig = {
		posX : 0,
		posY : yBeamConfig.posY + yBeamConfig.height/2 + elevatorConfig.thickness/2
	}

	var topXBeam;
	for (var z = yBeamConfig.posZ; z >= yBeamConfig.posZ - elevatorConfig.depth + elevatorConfig.thickness; z -= (elevatorConfig.depth/2 - elevatorConfig.thickness/2)) {
		topXBeam = new THREE.Mesh(topXBeamGeo, elevatorMat);
		topXBeam.position.x = topXBeamConfig.posX;
		topXBeam.position.y = topXBeamConfig.posY;
		topXBeam.position.z = z;

		elevator.add(topXBeam);
	};

	/*
		Top Z Beam
	*/
	for (var i = 0; i < 2; i++) {
		var mult = (i%2)? 1 : -1;
	
		var topZBeam = new THREE.Mesh(swhGeo, elevatorMat);
		topZBeam.position.x = sWallConfig.posX * mult;
		topZBeam.position.y = topXBeamConfig.posY;
		topZBeam.position.z = sWallConfig.posZ;

		elevator.add(topZBeam);

	}

	/*
		Top Metal Beam
	*/
	var metalBeamConfig = {
		radius	: elevatorConfig.thickness/2 * 1.50,
		rotZ	: deg2rad(90)
	}

	var metalBeamGeo = new THREE.CylinderGeometry(
		metalBeamConfig.radius, 
		metalBeamConfig.radius, 
		elevatorConfig.width + 10,
		16, 16);

	var metalBeam = new THREE.Mesh(metalBeamGeo, grillMat);
	metalBeam.rotation.z = metalBeamConfig.rotZ;

	metalBeam.position.x = 0;
	metalBeam.position.y = topXBeamConfig.posY + metalBeamConfig.radius + 2;
	metalBeam.position.z = yBeamConfig.posZ + elevatorConfig.thickness/2 - elevatorConfig.depth/2;;

	elevator.add(metalBeam);

	/*
		Roof
	*/
	var eleRoofBeamConfig = {
		posX	: yBeamConfig.posX,
		rotX	: deg2rad(15)
	}

	var eleRoofBeamGeo = new THREE.BoxGeometry(elevatorConfig.thickness, elevatorConfig.thickness, elevatorConfig.depth/2 + 1.5);

	var eleRoofBeam;
	for (var x = eleRoofBeamConfig.posX;
			x < elevatorConfig.width/2;
			x += (fWallConfig.width - yBeamConfig.thickness/3)
		) {

		/* Front Facing Roof Beam */
		eleRoofBeam = new THREE.Mesh(eleRoofBeamGeo, elevatorMat);
		eleRoofBeam.rotation.x = eleRoofBeamConfig.rotX;

		eleRoofBeam.position.x = x;
		eleRoofBeam.position.y = metalBeam.position.y + metalBeamConfig.radius/2 - 0.5;
		eleRoofBeam.position.z = yBeamConfig.posZ + elevatorConfig.thickness - elevatorConfig.depth/3 + 1.5;

		elevator.add(eleRoofBeam);

		/* Back Facing Roof Beam */
		eleRoofBeam = new THREE.Mesh(eleRoofBeamGeo, elevatorMat);
		eleRoofBeam.rotation.x = -eleRoofBeamConfig.rotX;

		eleRoofBeam.position.x = x;
		eleRoofBeam.position.y = metalBeam.position.y + metalBeamConfig.radius/2 - 0.5;
		eleRoofBeam.position.z = yBeamConfig.posZ + elevatorConfig.thickness - (elevatorConfig.depth/3)*2 - 3.5;

		elevator.add(eleRoofBeam);
	}
	

	/* FB Grills */
	var fbGrillConfig = {
		width : elevatorConfig.width/3 - 3.5,
		height: elevatorConfig.height/3*2 - 2.5
	}

	var lrGrillConfig = {
		width : elevatorConfig.depth - 5
	}

	var grillGeo;
	var grillGroup;
	var grillObj = function(w, h, wSeg, hSeg, xOff, yOff, zOff, rotY){

		wSeg = wSeg || 1;
		hSeg = hSeg || 1;
		xOff = xOff || 0;
		yOff = yOff || 0
		zOff = zOff || 0;
		rotY = rotY || 0;

		grillGeo = new THREE.CylinderGeometry(0.1, 0.1, h, 16, 16);
		grillGroup = new THREE.Group();
		/* Y Grill */
		for (var x = -w/2; x <= w/2 ; x+= w/wSeg) {
			var grill = new THREE.Mesh(grillGeo, grillMat);

			grill.position.x = x + 0;
			grill.position.y = 0;
			grill.position.z = 0;

			grillGroup.add(grill)
		};

		/* Top & Bottom */
		grillGeo = new THREE.CylinderGeometry(0.1, 0.1, w, 16, 16);

		for (var y = -h/2; y <= h/2 ; y += h/hSeg) {
			var grill = new THREE.Mesh(grillGeo, grillMat);

			grill.rotation.z = deg2rad(90);

			grill.position.x = 0;
			grill.position.y = y + 0;
			grill.position.z = 0;

			grillGroup.add(grill)
		}

		grillGroup.position.x += xOff;
		grillGroup.position.y += yOff;
		grillGroup.position.z += zOff;
		grillGroup.rotateY(deg2rad(rotY));

		return grillGroup;
	}

	/* Front Wall Grill (Left) */
	elevator.add(
		grillObj(
			fbGrillConfig.width,
			fbGrillConfig.height,
			4, 6,
			-(fWallConfig.posX - 0.75),
			fWallConfig.posY + fWallConfig.height + 3.75,
			yBeamConfig.posZ
		)
	);
	
	/* Front Wall Grill (Right) */
	elevator.add(
		grillObj(
			fbGrillConfig.width,
			fbGrillConfig.height,
			4, 6,
			fWallConfig.posX - 0.75,
			fWallConfig.posY + fWallConfig.height + 3.75,
			yBeamConfig.posZ
		)
	);


	/* Back Wall Grill (Left) */
	elevator.add(
		grillObj(
			fbGrillConfig.width,
			fbGrillConfig.height,
			4, 6,
			-(fWallConfig.posX - 0.75),
			fWallConfig.posY + fWallConfig.height + 3.75,
			yBeamConfig.posZ + elevatorConfig.thickness - elevatorConfig.depth,
			0
		)
	);

	/* Back Wall Grill (Right) */
	elevator.add(
		grillObj(
			fbGrillConfig.width,
			fbGrillConfig.height,
			4, 6,
			fWallConfig.posX - 0.75,
			fWallConfig.posY + fWallConfig.height + 3.75,
			yBeamConfig.posZ + elevatorConfig.thickness - elevatorConfig.depth
		)
	);

	/* Side Wall Grills */
	for (var i = 0; i < 2; i++) {
		var mult = (i%2)? 1 : -1;
		grillObj(
			lrGrillConfig.width,
			fbGrillConfig.height,
			4, 6,
			sWallConfig.posX * mult,
			sWallConfig.posY + fWallConfig.height + 3.75,
			sWallConfig.posZ,
			90
		);
	};

	/*
		Ground Floor Door
	*/
	var doorConfig = {
		width : elevatorConfig.width/3 - elevatorConfig.thickness*2.5,
		height: yBeamConfig.height - elevatorConfig.thickness
	}

	var doorGrillConfig = {
		width : doorConfig.width - elevatorConfig.thickness,
		height: doorConfig.height- elevatorConfig.thickness
	}

	var doorFrameGeo, doorFrame, doorGrill;
	var frontDoorGroup = new THREE.Group();
	var backDoorGroup = new THREE.Group();
	
	var doorFrameObject = function(group){
		for (var i = 0; i < 2; i++) {
			var mult = (i%2)? 1 : -1;

			/* Y Frame Beam */
			doorFrameGeo = new THREE.BoxGeometry(elevatorConfig.thickness/2, doorConfig.height, elevatorConfig.thickness);
			doorFrame = new THREE.Mesh(doorFrameGeo, elevatorMat);
			doorFrame.position.x = doorConfig.width/2 * mult;
			doorFrame.position.y = 0;
			doorFrame.position.z = 0;

			group.add(doorFrame);

			/* X Frame Beam */
			doorFrameGeo = new THREE.BoxGeometry(doorConfig.width, elevatorConfig.thickness/2, elevatorConfig.thickness);
			doorFrame = new THREE.Mesh(doorFrameGeo, elevatorMat);
			doorFrame.position.x = 0;
			doorFrame.position.y = (doorConfig.height/2 - elevatorConfig.thickness/4) * mult;
			doorFrame.position.z = 0;

			group.add(doorFrame);

			/* Door Grill */
			doorGrill = grillObj(doorGrillConfig.width, doorGrillConfig.height, 3, 6);

			group.add(doorGrill);
		}

		group.position.x += 0;
		group.position.y  = yBeamConfig.posY + 0.5;
		group.position.z += elevatorConfig.posZ + elevatorConfig.depth/2 - elevatorConfig.thickness/2;
	}

	doorFrameObject(frontDoorGroup);
	doorFrameObject(backDoorGroup);

	backDoorGroup.position.z =  frontDoorGroup.position.z - (elevatorConfig.depth - elevatorConfig.thickness);

	elevator.add(frontDoorGroup);
	elevator.add(backDoorGroup);
	
	/* Place Elevator */
	scene.add(elevator);
};

/**************************************
	
			ANIMATIONS

***************************************/
var reachedTop = false, reachedBot = true;
var runElevator = function(){
	// Going Up
	if(!reachedTop){
		if(elevator.position.y < wallConfig.height - elevatorConfig.height/2){
			elevator.position.y++;
			elevator.position.z = Math.tan(0.092528) * (wallConfig.height - elevator.position.y) - 220;
		}

		if(elevator.position.y == (wallConfig.height - elevatorConfig.height/2)){
			reachedTop = true;
			reachedBot = false;
		}
	}

	// Going down
	if(!reachedBot){
		if(elevator.position.y > elevatorConfig.posY){
			elevator.position.y--;
			elevator.position.z = Math.tan(0.092528) * (wallConfig.height - elevator.position.y) - 220;
		}

		if(elevator.position.y == elevatorConfig.posY){
			reachedTop = false;
			reachedBot = true;
		}
	}
};

var animate = function(t){

	runElevator();

	renderer.render(scene, camera);
	controls.update();
	window.requestAnimationFrame(animate, renderer.domElement);
};

/**************************************
	
			MISC FUNCTIONS

***************************************/
var onWindowResize = function(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

var computeNormals = function(obj){
	obj.computeVertexNormals();
	obj.computeFaceNormals();
}

var binSearch = function(arr, val, start, end){

	var mid = Math.round((start+end)/2);

	if(start > end){
		return false;
	}
	else{
		
		if(val == arr[mid]){
			return true;
		}
		else if(val > arr[mid]){
			return binSearch(arr, val, mid+1, end);
		}
		else if(val < arr[mid]){
			return binSearch(arr, val, start, mid-1);
		}
	}	
}

var deg2rad = function(angle){
	return angle * Math.PI/180;
}


init();

placeLight();
placeWall();
placeTopWall();
placeGround();
placeElevatorBeams();
placeElevator();
//placeCastle();

animate(new Date().getTime());