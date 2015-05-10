var gui

window.onload = function(){

	/* 
		BOX CONTROLS 
	*/
	gui = new dat.GUI();

	gui.add(box, "reset").name('Reset');

	// DIMENSION
	var f1 = gui.addFolder('Dimension');
	//f1.open();

	f1.add(box.scale, "x", 0, 3).step(0.01).listen();
	f1.add(box.scale, "y", 0, 3).step(0.01).listen();
	f1.add(box.scale, "z", 0, 3).step(0.01).listen();


	// ROTATION
	var f2 = gui.addFolder('Rotation');
	//f2.open();

	f2.add(box.rotation, "x", -3.14, 3.14).listen();
	f2.add(box.rotation, "y", -3.14, 3.14).listen();
	f2.add(box.rotation, "z", -3.14, 3.14).listen();

	// LOCATION
	var f3 = gui.addFolder('Location');
	//f3.open();

	f3.add(box.position, "x", -50, 50).listen();
	f3.add(box.position, "y", -50, 50).listen();
	f3.add(box.position, "z", -50, 50).listen();

	/* 
		POINT LIGHT CONTROLS 
	*/
	gui = new dat.GUI();

	// LOCATION
	var f1 = gui.addFolder('Location');
	f1.open();


	f1.add(pointLight.position, "x", -500, 500).step(1).listen().onChange(function(pos){
		lightBall.position.x = pos;
	});
	f1.add(pointLight.position, "y", -500, 500).step(1).listen().onChange(function(pos){
		lightBall.position.y = pos;
	});
	f1.add(pointLight.position, "z", -500, 500).step(1).listen().onChange(function(pos){
		lightBall.position.z = pos;
	});
};