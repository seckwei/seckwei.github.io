//alert("Hello");

var tiling = {
	
	play: function(text){
		
		if(text == "Play"){
			$(".cw2 .cw-title .play").html("Reset");
			tiling.director(1);
		}
		
		if(text == "Reset"){
			$(".cw2 .cw-title .play").html("Play");
			$(".sq2#static").each(function(){
				$(this).css("display", "none");
			});
		}
	},
	
	add_flip: function(num){
		$(".cw2 :not(.first) [data-order='"+ num +"']").css("display", "inline-block");
	},
	
	director: function(order){
		console.log(order);
		if (order != 9){
			var dir;
			if (order % 3 == 0) 
				dir = "down";
			else if (order == 1 || order == 2 || order == 7 || order == 8)
				dir = "right";
			else
				dir = "left";
			
			if(order == 1) tiling.add_flip(1);
			tiling.actor(order, dir);
		}	
	},
	
	actor: function(order, dir){
		$("[data-order='"+order+"'] > #flip-"+dir).one("animationend webkitAnimationEnd", function (){		
			order++;
			tiling.add_flip(order);
			tiling.director(order);
		});
	}
}