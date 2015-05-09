window.onload = function(){
	var gui = new dat.GUI();

	gui.add(box, "Reset");

	var f1 = gui.addFolder('Dimension');
	f1.open();

	f1.add(box.scale, "x", 0, 3).step(0.01).listen();
	f1.add(box.scale, "y", 0, 3).step(0.01).listen();
	f1.add(box.scale, "z", 0, 3).step(0.01).listen();


	var f2 = gui.addFolder('Rotation');
	f2.open();

	var rotation = {
		rotateX : 0,
		rotateY : 0,
		rotateZ : 0
	};

	f2.add(rotation, "rotateX", -3.14, 3.14).listen().onChange(function(angle){
		box.rotation.x = angle;
	});
	f2.add(rotation, "rotateY", -3.14, 3.14).listen().onChange(function(angle){
		box.rotation.y = angle;
	});
	f2.add(rotation, "rotateZ", -3.14, 3.14).listen().onChange(function(angle){
		box.rotation.z = angle;
	});
};