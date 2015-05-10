var scene, camera, controls, renderer;
var box, pointLight;

var init = function(){
	// SCENE
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;

	// DEFAULT CAMM ATTR
	var VIEW_ANGLE = 45;
	var ASPECT = WIDTH / HEIGHT;
	var NEAR = 0.1;
	var FAR = 1000;

	// Get DOM Element
	var $container = $('#container');

	// RENDERER
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});

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

	// START Renderer
	renderer.setSize(WIDTH, HEIGHT);

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

	// Ground
	var groundMesh = new THREE.MeshBasicMaterial( { color: 0xC3A687, side: THREE.DoubleSide } );
	var groundGeo = new THREE.Geometry();

	groundGeo.vertices.push(
		new THREE.Vector3(  50, 0,  50),
		new THREE.Vector3(  50, 0, -50),
		new THREE.Vector3( -50, 0,  50),
		new THREE.Vector3( -50, 0, -50)
	);

	groundGeo.faces.push( new THREE.Face3( 0, 1, 2 ) );
	groundGeo.faces.push( new THREE.Face3( 2, 1, 3 ) );

	var ground = new THREE.Mesh(groundGeo, groundMesh);
	ground.position.y = -0.5;

	scene.add(ground);


	// Sphere
	var sphereMat = new THREE.MeshLambertMaterial( { color: 0x0000FF } );
	var sphereGeo = new THREE.SphereGeometry( 50, 32, 16 );
	var sphere = new THREE.Mesh(sphereGeo, sphereMat);
	//scene.add(sphere);


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