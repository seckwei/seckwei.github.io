var scene, camera, controls, renderer;
var ground, wall, castle, elevator;
var light, lightBall;

var wallGeo;

var wallPlane, wallPlaneGeo, wallBlockGeo;
var longBeam, zBeam;

var wallBlock;

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
	posY	: 10,
	thickness	: 2
}

/* Beam Material */
var beamMat = new THREE.MeshLambertMaterial({
	color   : 0x645242,
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
	camera.position.y = 50;
	camera.position.z = 600;
	
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
		Elevator
	*/
	var longBeamConfig = {
		width	: 10,
		height	: wallConfig.height + 100,
		depth	: 40,
		posX	: elevatorConfig.width/2 + 10,
		posY	: wallConfig.height/2 + 50,
		posZ	: wallConfig.depth/2 + 150,
		rotX	: -0.092528
	}
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
		var z = (longBeamConfig.height - y) * Math.sin(-longBeamConfig.rotX) + longBeamConfig.posZ - 80;

		/* Left Z Beams */
		xBeam = new THREE.Mesh(xBeamGeo, beamMat);
		xBeam.position.z = z;
		xBeam.position.y = y;

		scene.add(xBeam);
	}
}

var placeElevator = function(){

	var elevatorMat = beamMat;

	/* 
		Base 
	*/
	var elevatorBaseGeo = new THREE.BoxGeometry(elevatorConfig.width, elevatorConfig.thickness, elevatorConfig.depth);

	var elevatorBase = new THREE.Mesh(elevatorBaseGeo, elevatorMat);
	elevatorBase.position.x = 0;
	elevatorBase.position.y = groundConfig.height/2 + elevatorConfig.posY + elevatorConfig.thickness/2;
	elevatorBase.position.z = wallConfig.depth;

	scene.add(elevatorBase);

	/* 
		Front Wall (ground floor door) 
	*/
	var fWallConfig = {
		width 	: elevatorConfig.width /3,
		height	: elevatorConfig.height/3
	}

	fWallConfig.posX = (elevatorConfig.width - fWallConfig.width)/2
	fWallConfig.posY = groundConfig.height/2 + elevatorConfig.posY + elevatorConfig.thickness + fWallConfig.height/2;
	fWallConfig.posZ = wallConfig.depth + elevatorConfig.depth/2 - elevatorConfig.thickness/2;


	var fWallGeo = new THREE.BoxGeometry(fWallConfig.width, fWallConfig.height, elevatorConfig.thickness-1);

	var fWallLeft = new THREE.Mesh(fWallGeo, elevatorMat);
	fWallLeft.position.x = -fWallConfig.posX;
	fWallLeft.position.y = fWallConfig.posY;
	fWallLeft.position.z = fWallConfig.posZ;

	scene.add(fWallLeft);

	var fWallRight = new THREE.Mesh(fWallGeo, elevatorMat);
	fWallRight.position.x = fWallConfig.posX;
	fWallRight.position.y = fWallConfig.posY;
	fWallRight.position.z = fWallConfig.posZ;

	scene.add(fWallRight);

	/* 
		Back Wall (top floor door) 
	*/
	var bWallLeft = new THREE.Mesh(fWallGeo, elevatorMat);
	bWallLeft.position.x = -fWallConfig.posX;
	bWallLeft.position.y = fWallConfig.posY;
	bWallLeft.position.z = fWallConfig.posZ - elevatorConfig.depth + elevatorConfig.thickness;

	scene.add(bWallLeft);

	var bWallRight = new THREE.Mesh(fWallGeo, elevatorMat);
	bWallRight.position.x = fWallConfig.posX;
	bWallRight.position.y = fWallConfig.posY;
	bWallRight.position.z = fWallConfig.posZ - elevatorConfig.depth + elevatorConfig.thickness;

	scene.add(bWallRight);

	/* 
		Side Wall (Left) 
	*/
	var sWallConfig = {
		posX	: elevatorConfig.width/2 - elevatorConfig.thickness/2,
		posY	: fWallConfig.posY,
		posZ	: wallConfig.depth
	};
	var sWallLeftGeo = new THREE.BoxGeometry(elevatorConfig.thickness/2, fWallConfig.height, elevatorConfig.depth - elevatorConfig.thickness);

	var sWallLeft = new THREE.Mesh(sWallLeftGeo, elevatorMat);
	sWallLeft.position.x = -sWallConfig.posX;
	sWallLeft.position.y = sWallConfig.posY;
	sWallLeft.position.z = sWallConfig.posZ;

	scene.add(sWallLeft);

	/*
		Side Wall (Right) 
	*/
	var sWallRight = new THREE.Mesh(sWallLeftGeo, elevatorMat);
	sWallRight.position.x = sWallConfig.posX;
	sWallRight.position.y = sWallConfig.posY;
	sWallRight.position.z = sWallConfig.posZ;

	scene.add(sWallRight);

	/*
		Y Beams (Front)
	*/
	var yBeamConfig = {
		height	  : elevatorConfig.height,
		thickness : elevatorConfig.thickness
	}

	yBeamConfig.posY = groundConfig.height/2 + elevatorConfig.posY + elevatorConfig.thickness + yBeamConfig.height/2;
	yBeamConfig.posZ = fWallConfig.posZ;

	var yBeamGeo = new THREE.BoxGeometry(yBeamConfig.thickness, yBeamConfig.height, yBeamConfig.thickness);

	var yBeam;
	var xStart = -(elevatorConfig.width/2 - yBeamConfig.thickness/2);

	for (var x = xStart;
			x < elevatorConfig.width/2;
			x += (fWallConfig.width - yBeamConfig.thickness/3)
		) {
		yBeam = new THREE.Mesh(yBeamGeo, elevatorMat);
		yBeam.position.x = x;
		yBeam.position.y = yBeamConfig.posY;
		yBeam.position.z = yBeamConfig.posZ;

		scene.add(yBeam);
	};

	/*
		Y Beams (Back)
	*/
	for (var x = xStart; 
			x < elevatorConfig.width/2;
			x += (fWallConfig.width - yBeamConfig.thickness/3)
		) {
		yBeam = new THREE.Mesh(yBeamGeo, elevatorMat);
		yBeam.position.x = x;
		yBeam.position.y = yBeamConfig.posY;
		yBeam.position.z = yBeamConfig.posZ - elevatorConfig.depth + elevatorConfig.thickness;

		scene.add(yBeam);
	};

	/*
		Y Beams (Middle, Left & Right)
	*/
	yBeam = new THREE.Mesh(yBeamGeo, elevatorMat);
	yBeam.position.x = -(elevatorConfig.width/2 - elevatorConfig.thickness/2);
	yBeam.position.y = yBeamConfig.posY;
	yBeam.position.z = yBeamConfig.posZ - (elevatorConfig.depth + elevatorConfig.thickness)/2;

	scene.add(yBeam);

	yBeam = new THREE.Mesh(yBeamGeo, elevatorMat);
	yBeam.position.x = elevatorConfig.width/2 - elevatorConfig.thickness/2;
	yBeam.position.y = yBeamConfig.posY;
	yBeam.position.z = yBeamConfig.posZ - (elevatorConfig.depth + elevatorConfig.thickness)/2;

	scene.add(yBeam);
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