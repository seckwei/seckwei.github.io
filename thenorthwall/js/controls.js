var gui

window.onload = function(){

	/* 
		HEMISLIGHT CONTROLS 
	*/
	gui = new dat.GUI();

	var fL = gui.addFolder('Position');
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

	/*var fU = gui.addFolder('Uneven Position');

	fU.add(pyramid.position, 'x', 0, 1000).step(0.1);
	fU.add(pyramid.position, 'y', 0, 1000).step(0.1);
	fU.add(pyramid.position, 'z', 0, 100).step(0.1);*/

}