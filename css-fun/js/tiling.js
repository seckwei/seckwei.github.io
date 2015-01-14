//alert("Hello");

function add_flip(num){
	$("[data-order='"+ num +"']").css("display", "inline-block");
}

director(1);
function director(order){
	if (order != 9){
		var dir;
		if (order % 3 == 0) 
			dir = "down";
		else if (order == 1 || order == 2 || order == 7 || order == 8)
			dir = "right";
		else
			dir = "left";
		
		if(order == 1) add_flip(1);
		actor(order, dir);
	}	
}

function actor(order, dir){
	$("[data-order='"+order+"'] > #flip-"+dir).one("animationend webkitAnimationEnd", function (){		
		order++;
		add_flip(order);
		director(order);
	});
}