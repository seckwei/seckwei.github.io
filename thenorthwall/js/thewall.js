var scene, camera, controls, renderer;
var ground, wall, castle, nose;
var light, lightBall;

var wallGeo;

var wallPlane, wallPlaneGeo, wallBlockGeo;
var longBeam, zBeam;

var wallBlock;
//var wallPlaneZ;

var wallConfig = {
	width  : 400*2,
	height : 219,
	depth  : 50
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
	var FAR = 10000;

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
	
	camera.position.x = 80;
	camera.position.y = 80;
	camera.position.z = 1000;
	
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

	var groundGeo = new THREE.BoxGeometry( 1200, 10, 300 );


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
		wallConfig.depth 
	);

	wall = new THREE.Mesh(wallGeo, wallMat);
	wall.position.y = wallConfig.height/2 + 0.1;

	scene.add(wall);


	/*
		Big Nose
	*/
	var height = 100;
	var width  = 100/2;
	var depth  = 50/2;

	var noseMat = new THREE.MeshLambertMaterial({
		color: 0xFFFFFF,
		shading : THREE.FlatShading
	});

	var noseGeo = noseGeometry(width, height, depth);
	nose = new THREE.Mesh(noseGeo, noseMat);
	nose.position.y = wallConfig.height - height;
	nose.position.z = wallConfig.depth/2;
	nose.position.x = -(wallConfig.width/2) + width;

	//scene.add(nose);


	/*
		Front Wall Terrain
	*/
	var wallPlaneMat = new THREE.MeshLambertMaterial({ 
		color: 0xFFFFFF, 
		shading: THREE.FlatShading,
		side: THREE.DoubleSide,
		wireframe: false
	});

	var wallPlaneConfig = {
		wSegment : 120,
		hSegment : 10
	};

	wallPlaneGeo = new THREE.PlaneGeometry(
		wallConfig.width, wallConfig.height, 
		wallPlaneConfig.wSegment, wallPlaneConfig.hSegment
	);

	/*var even_hSegment = 0;*/
	for (var i = 0; i < wallPlaneGeo.vertices.length; i++) {

		/*var current_hSegment = Math.floor(i / (wallPlaneConfig.wSegment+1));
		even_hSegment = (current_hSegment % 3 == 0)? current_hSegment : even_hSegment;

		wallPlaneGeo.vertices[i].z = (Math.random() * 3 + 1) + even_hSegment*1.3;
		wallPlaneZ.push(wallPlaneGeo.vertices[i].z);*/

		wallPlaneGeo.vertices[i].z = wallPlaneZ[i];
	};

	wallPlaneGeo.computeFaceNormals();
	wallPlaneGeo.computeVertexNormals();

	wallPlane = new THREE.Mesh(wallPlaneGeo, wallPlaneMat);

	wallPlane.position.y = wallConfig.height/2;
	wallPlane.position.z = wallConfig.depth/2;

	scene.add(wallPlane);

	/*
		Back Wall Terrain
	*/
	wallPlaneGeo = new THREE.PlaneGeometry(
		wallConfig.width, wallConfig.height,
		wallPlaneConfig.wSegment, wallPlaneConfig.hSegment
	);

	for (var i = 0; i < wallPlaneGeo.vertices.length; i++) {
		wallPlaneGeo.vertices[i].z = wallPlaneZ2[i];
	};

	wallPlaneGeo.computeFaceNormals();
	wallPlaneGeo.computeVertexNormals();

	wallPlane = new THREE.Mesh(wallPlaneGeo, wallPlaneMat);

	wallPlane.position.y = wallConfig.height/2;
	wallPlane.position.z = -wallConfig.depth/2;

	wallPlane.rotation.y = 180 * Math.PI/180;

	scene.add(wallPlane);
};

var placeTopWall = function(){
	/*
		Top of Wall
	*/
	var wallBlockConfig = {
		width  : 30.5,
		height : 5,
		depth  : 20
	}
	
	/* Generating the wall blocks for top of wall */
	for(var x = -(wallConfig.width/2 - wallBlockConfig.width/2); x < (wallConfig.width-10)/2; x+=wallBlockConfig.width+10){

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
				wallBlockGeo.vertices[i].y = Math.random();
			}

			// Random side bumps
			if(wallBlockGeo.vertices[i].x >= wallBlockConfig.width/2){
				wallBlockGeo.vertices[i].x += Math.random();
			}
			else if(wallBlockGeo.vertices[i].x <= -(wallBlockConfig.width/2)){
				wallBlockGeo.vertices[i].x -= Math.random();
			}

			// Random front facing points
			if(wallBlockGeo.vertices[i].z > 0){
				wallBlockGeo.vertices[i].z += Math.random() + 1.5;
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
				wallBlockGeo.vertices[i].y = Math.random();
			}

			// Random side bumps
			if(wallBlockGeo.vertices[i].x >= wallBlockConfig.width/2){
				wallBlockGeo.vertices[i].x += Math.random();
			}
			else if(wallBlockGeo.vertices[i].x <= -(wallBlockConfig.width/2)){
				wallBlockGeo.vertices[i].x -= Math.random();
			}

			// Random front facing points
			// (subtract because it is facing away from Z)
			if(wallBlockGeo.vertices[i].z < 0){
				wallBlockGeo.vertices[i].z -= Math.random() + 1.5;
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
	var xSupBeamGeo = new THREE.BoxGeometry( wallConfig.width, 1, 1 );

	var y = wallConfig.height + wallBlockConfig.height - 2;

	var xSupBeam = new THREE.Mesh(xSupBeamGeo, beamMat);
	xSupBeam.position.y = y;
	xSupBeam.position.z = 5;

	scene.add(xSupBeam);

	var xSupBeam = new THREE.Mesh(xSupBeamGeo, beamMat);
	xSupBeam.position.y = y;
	xSupBeam.position.z = -5;

	scene.add(xSupBeam);


	/* Z Support Beam */
	var zSupBeamGeo = new THREE.BoxGeometry( 1, 1, wallConfig.depth );

	for (var x = -(wallConfig.width/2 - wallBlockConfig.width - 5); x < wallConfig.width/2; x += wallBlockConfig.width+10) {
		var zSupBeam = new THREE.Mesh(zSupBeamGeo, beamMat);
		zSupBeam.position.y = y - 1;
		zSupBeam.position.x = x - 4;
		scene.add(zSupBeam);

		var zSupBeam = new THREE.Mesh(zSupBeamGeo, beamMat);
		zSupBeam.position.y = y - 1;
		zSupBeam.position.x = x + 4;
		scene.add(zSupBeam);
	};

	/* Y Support Beam */
	var ySupBeamGeo = new THREE.BoxGeometry( 1, 4, 1 );

	var placeYSupBeam = function(x, y, z){
		var ySupBeam = new THREE.Mesh(ySupBeamGeo, beamMat);
		ySupBeam.position.y = y;
		ySupBeam.position.x = x;
		ySupBeam.position.z = z;
		scene.add(ySupBeam);
	};

	for (var x = -(wallConfig.width/2 - wallBlockConfig.width/2); x < (wallConfig.width-10)/2; x+=wallBlockConfig.width+10) {
		placeYSupBeam(x+5, y-1,  4.8);
		placeYSupBeam(x+5, y-1, -4.8);
		placeYSupBeam(x-5, y-1,  4.8);
		placeYSupBeam(x-5, y-1, -4.8);
	};

	var xOff = 4.5;
	var zOff1 = 12;
	var zOff2 = 17;
	for (var x = -(wallConfig.width/2 - wallBlockConfig.width - 5); x < wallConfig.width/2; x += wallBlockConfig.width+10) {
		placeYSupBeam(x+xOff, y-1, zOff1);
		placeYSupBeam(x+xOff, y-1, zOff2);
		placeYSupBeam(x-xOff, y-1, zOff1);
		placeYSupBeam(x-xOff, y-1, zOff2);

		placeYSupBeam(x+xOff, y-1, -zOff1);
		placeYSupBeam(x+xOff, y-1, -zOff2);
		placeYSupBeam(x-xOff, y-1, -zOff1);
		placeYSupBeam(x-xOff, y-1, -zOff2);
	};
}

var placeCastle = function(){

	/*
		Castle Black
	*/
	var width = 40;
	var height = 10;
	var depth = 20;

	var castleMat = new THREE.MeshLambertMaterial({
		color : 0x000000
	});

	var castleGeo = new THREE.BoxGeometry( width, height, depth );

	castle = new THREE.Mesh(castleGeo, castleMat);
	castle.position.y = height/2;
	castle.position.z = wallConfig.depth + 8;

	scene.add(castle);

	/*
		Elevator
	*/
	var longBeamConfig = {
		width	: 1,
		height	: 230,
		depth	: 4,
		posX	: 2.5,
		posY	: 230/2,
		posZ	: wallConfig.depth/2 + 13,
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
		width	: 1.7,
		height	: 1,
		depth	: 7,
		posX	: 2.5,
		posZ	: 57
	};
	var zBeamGeo = new THREE.BoxGeometry(zBeamConfig.width, zBeamConfig.height, zBeamConfig.depth);
	
	for(var y = 20; y < 224; y+=20){

		// Skewing the Z position according to Long Beam's X Rotation
		var z = (longBeamConfig.height - y) * Math.sin(-longBeamConfig.rotX) + longBeamConfig.posZ - 11;

		/* Left Z Beams */
		zBeam = new THREE.Mesh(zBeamGeo, beamMat);
		zBeam.position.x = zBeamConfig.posX;
		zBeam.position.z = z;
		zBeam.position.y = y;

		scene.add(zBeam);

		/* Right Z Beams */
		zBeam = new THREE.Mesh(zBeamGeo, beamMat);
		zBeam.position.x = -zBeamConfig.posX;
		zBeam.position.z = z;
		zBeam.position.y = y;

		scene.add(zBeam);
	}

	/*
		X Beams
	*/
	var xBeamConfig = {
		width	: longBeamConfig.posX * 2 + 1,
		height	: 0.5,
		depth	: 0.5
	};
	var xBeamGeo = new THREE.BoxGeometry(xBeamConfig.width, xBeamConfig.height, xBeamConfig.depth);

	for(var y = 19.5; y < 224; y+=20){

		// Skewing the Z position according to Long Beam's X Rotation
		var z = (longBeamConfig.height - y) * Math.sin(-longBeamConfig.rotX) + longBeamConfig.posZ - 8;

		/* Left Z Beams */
		xBeam = new THREE.Mesh(xBeamGeo, beamMat);
		xBeam.position.z = z;
		xBeam.position.y = y;

		scene.add(xBeam);
	}
};

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
placeCastle();

animate(new Date().getTime());