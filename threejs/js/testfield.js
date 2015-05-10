var scene, camera, controls, renderer;
var box, pointLight, lightBall;

var init = function(){
	// SCENE
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;

	// DEFAULT CAMM ATTR
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
	renderer.setClearColor(0x000000, 0.8);

	// CAMERA
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	
	camera.position.x = 80;
	camera.position.y = 80;
	camera.position.z = 300;

	camera.lookAt(new THREE.Vector3(0,0,0));
	
	// Orbit Control
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	// SCENE
	scene = new THREE.Scene();
	scene.add(camera);

	// Attach Renderer
	$container.append(renderer.domElement);
};

var others = function(){

	// Lighting
	pointLight = new THREE.PointLight( 0xFFFFFF );
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 100;
	scene.add(pointLight);

	// Light ball
	var lightBallMat = new THREE.MeshBasicMaterial( { color: 0xFFFF00 } );
	var lightBallGeo = new THREE.SphereGeometry( 5, 16, 16 );
	lightBall = new THREE.Mesh(lightBallGeo, lightBallMat);
	lightBall.position.x = 10;
	lightBall.position.y = 50;
	lightBall.position.z = 100;

	scene.add(lightBall);


	// Ground
	var groundMesh = new THREE.MeshBasicMaterial({ 
		color : 0xC3A687, 
		side  : THREE.DoubleSide,
		transparent : true,
		opacity : 0.5
	});
	var groundGeo = new THREE.Geometry();

	var size = 300;

	groundGeo.vertices.push(
		new THREE.Vector3(  size, 0,  size),
		new THREE.Vector3(  size, 0, -size),
		new THREE.Vector3( -size, 0,  size),
		new THREE.Vector3( -size, 0, -size)
	);

	groundGeo.faces.push( new THREE.Face3( 0, 1, 2 ) );
	groundGeo.faces.push( new THREE.Face3( 2, 1, 3 ) );

	var ground = new THREE.Mesh(groundGeo, groundMesh);
	ground.position.y = -0.5;

	scene.add(ground);

	// Box
	var boxMat = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
	var boxGeo = new THREE.BoxGeometry( 30, 30, 30 );
	box = new THREE.Mesh(boxGeo, boxMat);
	
	box.reset = function(){
		box.scale.x = 1;
		box.scale.y = 1;
		box.scale.z = 1;

		box.rotation.x = 0;
		box.rotation.y = 0;
		box.rotation.z = 0;

		box.position.x = 30/2;
		box.position.y = 30/2;
		box.position.z = 30/2;

		box.material.color = new THREE.Color("#FF0000");
	}
	box.reset();

	scene.add(box);
};

var animate = function(t){
	renderer.render(scene, camera);
	controls.update();
	window.requestAnimationFrame(animate, renderer.domElement);
};

init();
others();
animate(new Date().getTime());