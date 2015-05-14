var gui

window.onload = function(){

	/* 
		HEMISLIGHT CONTROLS 
	*/
	gui = new dat.GUI();

	var fL = gui.addFolder('Light Position');
	//fL.open();

	fL.add(light.position, 'x', -1500, 1500).listen().onChange(function(pos){
		lightBall.position.x = pos;
	});
	fL.add(light.position, 'y', -1500, 1500).listen().onChange(function(pos){
		lightBall.position.y = pos;
	});
	fL.add(light.position, 'z', -1500, 1500).listen().onChange(function(pos){
		lightBall.position.z = pos;
	});

	/*var fP = gui.addFolder('Position');

	fP.add(zBeam.position, 'x', 0, 1000).step(0.1).listen();
	fP.add(zBeam.position, 'y', 0, 1000).step(0.1).listen();
	fP.add(zBeam.position, 'z', 0, 1000).step(0.1).listen();

	var fR = gui.addFolder('Rotation');

	fR.add(zBeam.rotation, 'x', -3.14, 3.14).listen();
	fR.add(zBeam.rotation, 'y', -3.14, 3.14).listen();
	fR.add(zBeam.rotation, 'z', -3.14, 3.14).listen();
	*/

	/*var fColour = gui.addFolder('Colour');

	var temp = { color : "#311802" };

	fColour.addColor(temp, "color").listen().onChange(function(value){
		longBeam.material.color = new THREE.Color(value);
	});*/
}