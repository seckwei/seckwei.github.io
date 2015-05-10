var scene, camera, controls, renderer;
var ground, wall, castle;
var light;

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
	renderer.setClearColor(0xCDCDCD, 0.5);

	// CAMERA
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	
	camera.position.x = 80;
	camera.position.y = 80;
	camera.position.z = 1000;

	camera.lookAt(new THREE.Vector3(0,0,0));
	
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
	camera.acpect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
};

var placeLight = function(){
	light = new THREE.AmbientLight ( 0xFFFFFF );
	scene.add(light);
};

var placeGround = function(){

	var groundMat = new THREE.MeshLambertMaterial({
		color : 0xFFFFFF,
		side  : THREE.DoubleSide
	});
	var groundGeo = new THREE.Geometry();
	var area = 300;

	/*
	   -x,-z(3) |    x ,-z (1)
				|
				|
		--------+---------> x
				|
				|    
	   -x, z(2) |    x , z (0)
				v
				z

	*/	
	groundGeo.vertices.push(
		new THREE.Vector3(  area*2, 0,  area ),
		new THREE.Vector3(  area*2, 0, -area ),
		new THREE.Vector3( -area*2, 0,  area ),
		new THREE.Vector3( -area*2, 0, -area )
	);

	groundGeo.faces.push(
		new THREE.Face3( 0, 1, 2 ),
		new THREE.Face3( 2, 1, 3 )
	);

	ground = new THREE.Mesh(groundGeo, groundMat);

	scene.add(ground);

};

var placeWall = function(){

	var width  = 400*2;
	var height = 224;
	var depth  = 80;

	var wallMat = new THREE.MeshLambertMaterial({
		color : 0xFEFEEFF
	});

	var wallGeo = new THREE.BoxGeometry( width, height, depth );

	wall = new THREE.Mesh(wallGeo, wallMat);
	wall.position.y = height/2 + 0.1;

	scene.add(wall);
};

var placeCastle = function(){

	var width = 40;
	var height = 10;
	var depth = 20;

	var castleMat = new THREE.MeshLambertMaterial({
		color : 0x000000
	});

	var castleGeo = new THREE.BoxGeometry( width, height, depth );

	castle = new THREE.Mesh(castleGeo, castleMat);
	castle.position.y = height/2 + 0.1;
	castle.position.z = 80/2 + depth/2;

	scene.add(castle);
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
placeCastle();

animate(new Date().getTime());