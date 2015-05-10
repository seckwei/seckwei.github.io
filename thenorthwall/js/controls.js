var gui

window.onload = function(){

	/* 
		HEMISLIGHT CONTROLS 
	*/
	gui = new dat.GUI();

	var fL = gui.addFolder('Position');
	fL.open();

	fL.add(light.position, 'x', -1500, 1500).listen().onChange(function(pos){
		lightBall.position.x = pos;
	});
	fL.add(light.position, 'y', -1500, 1500).listen().onChange(function(pos){
		lightBall.position.y = pos;
	});
	fL.add(light.position, 'z', -1500, 1500).listen().onChange(function(pos){
		lightBall.position.z = pos;
	});

}