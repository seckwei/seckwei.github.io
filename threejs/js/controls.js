window.onload = function(){
	var gui = new dat.GUI();

	gui.add(box.scale, "x", 0, 100).onFinishChange(function(){
		console.log(box.scale.x);
	});
	gui.add(box.scale, "y", 0, 100);
	gui.add(box.scale, "z", 0, 100);
};