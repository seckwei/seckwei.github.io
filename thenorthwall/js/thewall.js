var scene, camera, controls, renderer;
var ground, wall, castle, elevator;
var light, lightBall;

var wallGeo;

var wallPlane, wallPlaneGeo, wallBlockGeo;
var longBeam, zBeam;

var wallBlock;

var reachedTop = false;
var reachedBot = true;

var groundConfig = {
	width : 12000,
	height: 10,
	depth : 3000
};

var wallConfig = {
	width  : 400*2*10,
	height : 220*10,
	depth  : 50*10
}

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

/* Beam Material */
var beamMat = new THREE.MeshLambertMaterial({
	color   : 0x645242,
	shading : THREE.FlatShading
});

/* Grill Material */
var grillMat = new THREE.MeshLambertMaterial({
	color   : 0x323839,
	shading : THREE.FlatShading
});

/* Wall Material */
var wallMat = new THREE.MeshLambertMaterial({
	color : 0xFFFFFF,
	shading : THREE.FlatShading,
	wireframe : false
});

var init = function(){

	// WINDOW SIZE
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;

	// DEFAULT CAM ATTRIBUTE
	var VIEW_ANGLE = 45;
	var ASPECT = WIDTH / HEIGHT;
	var NEAR = 0.1;
	var FAR = 50000;

	// Get DOM Element
	var $container = $('#container');

	// RENDERER
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true,
	});
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setClearColor(0x000000, 0.5); //CDCDCD

	// CAMERA
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	
	camera.position.x = 0;
	camera.position.y = 100;
	camera.position.z = 3000;
	
	// ORBIT CONTROLS
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	// SCENE
	scene = new THREE.Scene();
	scene.add(camera);

	// Attach Renderer
	$container.append(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
};

var onWindowResize = function(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
};

var placeLight = function(){

	// Directional Light
	var x = 300;
	var y = 500;
	var z = 500;

	light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
	light.position.set( x, y, z );

	scene.add(light);

	// Light ball
	var lightBallMat = new THREE.MeshBasicMaterial( { color: 0xFFFF } );
	var lightBallGeo = new THREE.SphereGeometry( 10, 16, 16 );
	lightBall = new THREE.Mesh(lightBallGeo, lightBallMat);
	lightBall.position.x = x;
	lightBall.position.y = y;
	lightBall.position.z = z;

	scene.add(lightBall);

	// Directional Light 2
	x = -300;
	y = 200;
	z = -1000;

	light = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
	light.position.set( x, y, z );

	scene.add(light);

	// Light ball
	var lightBallMat = new THREE.MeshBasicMaterial( { color: 0xFFFF } );
	var lightBallGeo = new THREE.SphereGeometry( 10, 16, 16 );
	lightBall = new THREE.Mesh(lightBallGeo, lightBallMat);
	lightBall.position.x = x;
	lightBall.position.y = y;
	lightBall.position.z = z;

	scene.add(lightBall);
};

var placeGround = function(){

	var groundMat = new THREE.MeshLambertMaterial({
		color : 0xFFFFFF,
		side  : THREE.DoubleSide
	});

	var groundGeo = new THREE.BoxGeometry( groundConfig.width, groundConfig.height, groundConfig.depth );


	/*var groundGeo = new THREE.Geometry();
	var area = 300;

	
	   -x,-z(3) |    x ,-z (1)
				|
				|
		--------+---------> x
				|
				|    
	   -x, z(2) |    x , z (0)
				v
				z

		
	groundGeo.vertices.push(
		new THREE.Vector3(  area*2, 0,  area ),
		new THREE.Vector3(  area*2, 0, -area ),
		new THREE.Vector3( -area*2, 0,  area ),
		new THREE.Vector3( -area*2, 0, -area )
	);

	groundGeo.faces.push(
		new THREE.Face3( 0, 1, 2 ),
		new THREE.Face3( 2, 1, 3 )
	);*/

	ground = new THREE.Mesh(groundGeo, groundMat);

	scene.add(ground);
};

var placeWall = function(){

	/*
		Base Wall
	*/
	wallGeo = new THREE.BoxGeometry( 
		wallConfig.width, 
		wallConfig.height, 
		wallConfig.depth,
		100, 10
	);

	/* Uneven Wall Surfaces */
	/*var y;
	for(var i = 0; i < wallGeo.vertices.length; i++){
		y = wallGeo.vertices[i].y;
		z = wallGeo.vertices[i].z;

		if(z > 0){
			if(y <= 1100 && y >= 880){
				wallGeo.vertices[i].z += (Math.random() * 30 + 10);
			}
			else if(y == 660){
				wallGeo.vertices[i].z += (Math.random() * 30 + 10)+20*1.3;
			}
			else if(y <= 440 && y >= 0){
				wallGeo.vertices[i].z += (Math.random() * 30 + 10)+50;
			}
			else if(y <= -220 && y >= -660 ){
				wallGeo.vertices[i].z += (Math.random() * 30 + 10)+80*1.5;
			}
			else if(y == -880){
				wallGeo.vertices[i].z += (Math.random() * 30 + 10)+110*1.5;
			}
			else if(y == -1100){
				wallGeo.vertices[i].z += (Math.random() * 30 + 10)+130*1.5;
			}
		}

		if(z < 0){
			if(y <= 1100 && y >= 880){
				wallGeo.vertices[i].z -= (Math.random() * 30 + 10);
			}
			else if(y == 660){
				wallGeo.vertices[i].z -= (Math.random() * 30 + 10)+20*1.3;
			}
			else if(y <= 440 && y >= 0){
				wallGeo.vertices[i].z -= (Math.random() * 30 + 10)+50;
			}
			else if(y <= -220 && y >= -660 ){
				wallGeo.vertices[i].z -= (Math.random() * 30 + 10)+80*1.5;
			}
			else if(y == -880){
				wallGeo.vertices[i].z -= (Math.random() * 30 + 10)+110*1.5;
			}
			else if(y == -1100){
				wallGeo.vertices[i].z -= (Math.random() * 30 + 10)+130*1.5;
			}
		}
	}*/
	wallGeo.vertices = wallVertexZ10;

	wallGeo.computeFaceNormals();
	wallGeo.computeVertexNormals();

	wall = new THREE.Mesh(wallGeo, wallMat);
	wall.position.y = wallConfig.height/2 + 0.1;

	scene.add(wall);
};

var placeTopWall = function(){
	/*
		Top of Wall
	*/
	var wallBlockConfig = {
		width  : 305,
		height : 50,
		depth  : 200
	}
	
	/* Generating the wall blocks for top of wall */
	for(var x = -(wallConfig.width/2 - wallBlockConfig.width/2); x < (wallConfig.width-100)/2; x+=wallBlockConfig.width+100){

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

		wallBlockGeo.computeVertexNormals();
		wallBlockGeo.computeFaceNormals();
		
		var y = wallConfig.height + wallBlockConfig.height/2;
		var z = wallConfig.depth/2 - wallBlockConfig.depth/2;

		wallBlock = new THREE.Mesh(wallBlockGeo, wallMat);
		
		wallBlock.position.x = x;
		wallBlock.position.y = y;
		wallBlock.position.z = z;

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

		wallBlockGeo.computeVertexNormals();
		wallBlockGeo.computeFaceNormals();
		
		var y = wallConfig.height + wallBlockConfig.height/2;
		var z = wallConfig.depth/2 - wallBlockConfig.depth/2;

		wallBlock = new THREE.Mesh(wallBlockGeo, wallMat);
		
		wallBlock.position.x = x;
		wallBlock.position.y = y;
		wallBlock.position.z = -z;

		scene.add(wallBlock);
	}

	/* X Support Beam */
	var xSupBeamGeo = new THREE.BoxGeometry( wallConfig.width, 10, 10 );

	var y = wallConfig.height + wallBlockConfig.height - 25;
	var z = 50;
	var xSupBeam = new THREE.Mesh(xSupBeamGeo, beamMat);
	xSupBeam.position.y = y;
	xSupBeam.position.z = z;

	scene.add(xSupBeam);

	var xSupBeam = new THREE.Mesh(xSupBeamGeo, beamMat);
	xSupBeam.position.y = y;
	xSupBeam.position.z = -z;

	scene.add(xSupBeam);


	/* Z Support Beam */
	var zSupBeamGeo = new THREE.BoxGeometry( 10, 10, wallConfig.depth );

	for (var x = -(wallConfig.width/2 - wallBlockConfig.width - 50); x < wallConfig.width/2; x += wallBlockConfig.width+100) {
		var zSupBeam = new THREE.Mesh(zSupBeamGeo, beamMat);
		zSupBeam.position.y = y - 5;
		zSupBeam.position.x = x - 40;
		scene.add(zSupBeam);

		var zSupBeam = new THREE.Mesh(zSupBeamGeo, beamMat);
		zSupBeam.position.y = y - 5;
		zSupBeam.position.x = x + 40;
		scene.add(zSupBeam);
	};

	/* Y Support Beam */
	var ySupBeamGeo = new THREE.BoxGeometry( 10, 40, 10 );

	var placeYSupBeam = function(x, y, z){
		var ySupBeam = new THREE.Mesh(ySupBeamGeo, beamMat);
		ySupBeam.position.y = y;
		ySupBeam.position.x = x;
		ySupBeam.position.z = z;
		scene.add(ySupBeam);
	};

	for (var x = -(wallConfig.width/2 - wallBlockConfig.width/2); x < (wallConfig.width-10)/2; x+=wallBlockConfig.width+100) {
		placeYSupBeam(x+50, y-10,  48);
		placeYSupBeam(x+50, y-10, -48);
		placeYSupBeam(x-50, y-10,  48);
		placeYSupBeam(x-50, y-10, -48);
	};

	var xOff = 45;
	var zOff1 = 120;
	var zOff2 = 170;
	for (var x = -(wallConfig.width/2 - wallBlockConfig.width - 50); x < wallConfig.width/2; x += wallBlockConfig.width+100) {
		placeYSupBeam(x+xOff, y-10, zOff1);
		placeYSupBeam(x+xOff, y-10, zOff2);
		placeYSupBeam(x-xOff, y-10, zOff1);
		placeYSupBeam(x-xOff, y-10, zOff2);

		placeYSupBeam(x+xOff, y-10, -zOff1);
		placeYSupBeam(x+xOff, y-10, -zOff2);
		placeYSupBeam(x-xOff, y-10, -zOff1);
		placeYSupBeam(x-xOff, y-10, -zOff2);
	};
}

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

var placeElevatorBeams = function(){
	/*
		Elevator Beams
	*/
	
	var longBeamGeo = new THREE.BoxGeometry(longBeamConfig.width, longBeamConfig.height, longBeamConfig.depth);

	/* Long Beam Left */
	longBeam = new THREE.Mesh(longBeamGeo, beamMat);

	longBeam.position.x = -longBeamConfig.posX;
	longBeam.position.y = longBeamConfig.posY;
	longBeam.position.z = longBeamConfig.posZ;

	longBeam.rotation.x = longBeamConfig.rotX;
	scene.add(longBeam);

	/* Long Beam Right */
	longBeam = new THREE.Mesh(longBeamGeo, beamMat);

	longBeam.position.x = longBeamConfig.posX;
	longBeam.position.y = longBeamConfig.posY;
	longBeam.position.z = longBeamConfig.posZ;

	longBeam.rotation.x = longBeamConfig.rotX;
	scene.add(longBeam);

	/* 
		Z Beams 
	*/
	var zBeamConfig = {
		width	: 13,
		height	: 13,
		depth	: 250,
		posX	: longBeamConfig.posX + 15,
		rotY	: 6 * Math.PI/180
	};
	var zBeamGeo = new THREE.BoxGeometry(zBeamConfig.width, zBeamConfig.height, zBeamConfig.depth);
	
	for(var y = 200; y < longBeamConfig.height; y+=150){

		// Skewing the Z position according to Long Beam's X Rotation
		var z = (longBeamConfig.height - y) * Math.sin(-longBeamConfig.rotX) + longBeamConfig.posZ - 200;

		/* Left Z Beams */
		zBeam = new THREE.Mesh(zBeamGeo, beamMat);
		zBeam.position.x = zBeamConfig.posX;
		zBeam.position.z = z;
		zBeam.position.y = y;
		zBeam.rotation.y = -zBeamConfig.rotY;

		scene.add(zBeam);

		/* Right Z Beams */
		zBeam = new THREE.Mesh(zBeamGeo, beamMat);
		zBeam.position.x = -zBeamConfig.posX;
		zBeam.position.z = z;
		zBeam.position.y = y;
		zBeam.rotation.y = zBeamConfig.rotY;

		scene.add(zBeam);
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
}

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
		rotZ	: 90 * Math.PI/180
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
		rotX	: 15 * Math.PI/180
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

			grill.rotation.z = 90 * Math.PI/180;

			grill.position.x = 0;
			grill.position.y = y + 0;
			grill.position.z = 0;

			grillGroup.add(grill)
		}

		grillGroup.position.x += xOff;
		grillGroup.position.y += yOff;
		grillGroup.position.z += zOff;
		grillGroup.rotateY(rotY * Math.PI/180);

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
}

/*	Pyramid Geometry Function	*/
var noseGeometry = function(width, height, depth, angle){

	angle = angle || 0;

	var noseGeo = new THREE.Geometry();
	
	/*
	   (3) (2) (1)
		\   |   /
		 \  |  /
		  \ | /
		   \|/ (0)
	*/

	noseGeo.vertices.push(
		new THREE.Vector3(  	0,		 0,     0), // 0
		new THREE.Vector3( 	width,	height,	    0), // 1
		new THREE.Vector3(  	0,  height, depth), // 2 (Nose Tip)
		new THREE.Vector3( -width,  height,     0)  // 3
	);

	noseGeo.faces.push(
		new THREE.Face3(0,1,2),
		new THREE.Face3(2,1,3),
		new THREE.Face3(0,2,3)
	);

	// These are to recompute the normal of each vertex and face
	// otherwise the nose will appear black
	noseGeo.computeFaceNormals();
	noseGeo.computeVertexNormals();

	return noseGeo;
};

var animate = function(t){

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

	renderer.render(scene, camera);
	controls.update();
	window.requestAnimationFrame(animate, renderer.domElement);
};

init();
placeLight();
placeGround();
placeWall();
placeTopWall();
//placeCastle();
placeElevatorBeams();
placeElevator();

animate(new Date().getTime());