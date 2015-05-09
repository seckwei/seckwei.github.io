var scene, camera, renderer;
var box;

var init = function(){
	// SCENE
	var WIDTH = 800 || window.innerWidth;
	var HEIGHT = 600 || window.innerHeight;

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

	// SCENE
	scene = new THREE.Scene();
	scene.add(camera);

	camera.position.z = 300;

	// START Renderer
	renderer.setSize(WIDTH, HEIGHT);

	// Attach Renderer
	$container.append(renderer.domElement);
};

var others = function(){
	// Lighting
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 100;
	scene.add(pointLight);


	// Sphere
	var sphereMat = new THREE.MeshLambertMaterial( { color: 0x0000FF } );
	var sphereGeo = new THREE.SphereGeometry( 50, 32, 16 );
	var sphere = new THREE.Mesh(sphereGeo, sphereMat);
	//scene.add(sphere);


	// Cube
	var boxMat = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
	var boxGeo = new THREE.BoxGeometry( 1, 1, 1 );
	box = new THREE.Mesh(boxGeo, boxMat);
	box.geometry.dynamic = true;

	scene.add(box);
};

var animate = function(t){
	renderer.render(scene, camera);
	window.requestAnimationFrame(animate, renderer.domElement);
};

init();
others();
animate(new Date().getTime());