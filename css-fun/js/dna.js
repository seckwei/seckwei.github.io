/*
	Seck Wei, Lim - Jan 2015
	CSS-Fun - dna.js
	Javascript for triggering events / changing html properties / etc
*/

var dna = {
	
	count : 0,
	height: 0,

	/* Print right side bases */
	print_opposite: function(){	
		
		var base_right = new Array(); // Contains the right bases in sequence
		
		// Assigning right bases according to left's
		$(".dna-base.left").each(function(){
			switch($(this).attr("id")){
				case "a" : base_right[dna.count] = "t"; break;
				case "g" : base_right[dna.count] = "c"; break;
				case "t" : base_right[dna.count] = "a"; break;
				case "c" : base_right[dna.count] = "g"; break;
			}
			dna.count++;			
		});
		
		var base_rightHTML = "";
		for(var i = 0; i < base_right.length; i++){
			base_rightHTML += "<div class='dna-base right' id='"+ base_right[i] +"'>" + base_right[i].toUpperCase() + "</div>\r\n";
		}
		
		$(".dna-base-wrapper.right").append(base_rightHTML);
		
	},

	/* Set back bone height */
	extend_backbone: function(){
		dna.height = dna.count * ($(".dna-base").height() + 5) + 5;
		$(".dna-backbone").css("height", dna.height+"px");
	}
	
}

dna.print_opposite();
dna.extend_backbone();

