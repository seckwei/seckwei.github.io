// SCENE
var WIDTH = 800;
var HEIGHT = 600;

// DEFAULT CAMM ATTR
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 0.1;
var FAR = 1000;

// Get DOM Element
var $container = $('#container');

// RENDERER
var renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: true
});

// CAMERA
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

// SCENE
var scene = new THREE.Scene();
scene.add(camera);

camera.position.z = 300;

// START Renderer
renderer.setSize(WIDTH, HEIGHT);

// Attach Renderer
$container.append(renderer.domElement);


// Lighting
var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 100;
scene.add(pointLight);


// Sphere
var sphereMat = new THREE.MeshLambertMaterial( { color: 0x0000FF } );
var sphereGeo = new THREE.SphereGeometry(50,16,16);
var sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

renderer.render(scene, camera);