/*
	Seck Wei, Lim - Jan 2015
	CSS-Fun
	Javascript for triggering events / changing html properties / etc
*/

// Fold Over Tiling
var tiling = {
	
	// Play Function
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
	
	// Add Static and Flip Tiles
	add_flip: function(num){
		$(".cw2 :not(.first) [data-order='"+ num +"']").css("display", "inline-block");
	},
	
	// Queue the next tile
	director: function(order){
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
	
	// Call the add_flip
	actor: function(order, dir){
		$(".cw2 :not(.first) [data-order='"+order+"'] > #flip-"+dir).one("animationend webkitAnimationEnd", function (){		
			order++;
			tiling.add_flip(order);
			tiling.director(order);
		});
	}
}

// Float Up Tiling
var tiling_float = {
	
	// Play function
	play: function(text){
		if(text == "Play"){
			$(".cw3 .cw-title .play").html("Reset");
			tiling_float.director(1);
		}
		
		if(text == "Reset"){
			$(".cw3 .cw-title .play").html("Play");
			$(".sq3#hoverOff").each(function(){
				$(this).css("display", "none");
				$(this).attr("id", "float-up");
			});
		}
	},
	
	// Add a tile
	add_tile: function(num){
		$(".cw3 :not(.first) [data-order='"+num+"']").css("display", "inline-block");
	},
	
	// Change from #float-up to #hoverOff
	// so that there's transition between Hovering On and Off
	enable_hoverOff: function(num){
		$(".cw3 :not(.first) #float-up[data-order='"+num+"']").attr("id", "hoverOff");
	},
	
	// Queue the next tile
	director: function(order){
		if(order != 9){
			
			if(order == 1) tiling_float.add_tile(1);
			tiling_float.actor(order);
		}else{
			tiling_float.enable_hoverOff(9);
		}
	},
	
	// Call the add_tile
	actor: function(order){
		$(".cw3 :not(.first) [data-order='"+order+"']").one("animationend webkitAnimationEnd", function (){
			tiling_float.enable_hoverOff(order);
			order++;
			tiling_float.add_tile(order);
			tiling_float.director(order);
		});
	}
	
}

var tiling_float_3d = {
	
	// Play function
	play: function(text){
		if(text == "Play"){
			$(".cw4 .cw-title .play").html("Reset");
			tiling_float_3d.director(1);
		}
		
		if(text == "Reset"){
			$(".cw4 .cw-title .play").html("Play");
			$(".sq4#castshadow").each(function(){
				$(this).css("display", "none");
			});
		}
	},
	
	// Add a tile
	add_tile: function(num){
		$(".cw4 :not(.first) [data-order='"+num+"']").css("display", "inline-block");
	},
	
	// Queue the next tile
	director: function(order){
		if(order != 9){
			
			if(order == 1) tiling_float_3d.add_tile(1);
			tiling_float_3d.actor(order);
		}
	},
	
	// Call the add_tile
	actor: function(order){
		$(".cw4 :not(.first) [data-order='"+order+"']").one("animationend webkitAnimationEnd", function (){
			order++;
			tiling_float_3d.add_tile(order);
			tiling_float_3d.director(order);
		});
	}
	
}