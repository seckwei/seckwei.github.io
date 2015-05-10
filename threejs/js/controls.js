var gui

window.onload = function(){

	/* 
		BOX CONTROLS 
	*/
	gui = new dat.GUI();
	gui.addFolder('_____________ Box _____________');

	// DIMENSION
	var fDimension = gui.addFolder('Dimension');
	//f1.open();

	fDimension.add(box.scale, "x", 0, 3).step(0.01).listen();
	fDimension.add(box.scale, "y", 0, 3).step(0.01).listen();
	fDimension.add(box.scale, "z", 0, 3).step(0.01).listen();


	// ROTATION
	var fRotation = gui.addFolder('Rotation');
	//f2.open();

	fRotation.add(box.rotation, "x", -3.14, 3.14).listen();
	fRotation.add(box.rotation, "y", -3.14, 3.14).listen();
	fRotation.add(box.rotation, "z", -3.14, 3.14).listen();

	// LOCATION
	var fPosition = gui.addFolder('Position');
	//f3.open();

	fPosition.add(box.position, "x", -50, 50).listen();
	fPosition.add(box.position, "y", -50, 50).listen();
	fPosition.add(box.position, "z", -50, 50).listen();

	// COLOUR
	var fColour = gui.addFolder('Colour');

	var temp = { color : "#FF0000" };

	fColour.addColor(temp, "color").listen().onChange(function(value){
		box.material.color = new THREE.Color(value);
	});

	// Reset Button
	gui.add(box, "reset").name('Reset');


	/* 
		POINT LIGHT & 
		LIGHT BALL CONTROLS 
	*/
	gui = new dat.GUI();
	gui.addFolder('__________ Point Light __________');

	// LOCATION
	var f1 = gui.addFolder('Position');
	f1.open();


	f1.add(pointLight.position, "x", -500, 500).step(0.5).listen().onChange(function(pos){
		lightBall.position.x = pos;
	});
	f1.add(pointLight.position, "y", -500, 500).step(0.5).listen().onChange(function(pos){
		lightBall.position.y = pos;
	});
	f1.add(pointLight.position, "z", -500, 500).step(0.5).listen().onChange(function(pos){
		lightBall.position.z = pos;
	});
};