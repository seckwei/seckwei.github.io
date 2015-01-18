/*
	Seck Wei, Lim - Jan 2015
	CSS-Fun - dna.js
	Javascript for triggering events / changing html properties / etc
*/

var dna = {
	
	/* Print right side bases */
	print_opposite: function(){	
		
		var base_right = new Array(); // Contains the right bases in sequence
		
		var count = 0; // Count of left bases
		
		// Assigning right bases according to left's
		$(".dna-base.left").each(function(){
			switch($(this).attr("id")){
				case "a" : base_right[count] = "t"; break;
				case "g" : base_right[count] = "c"; break;
				case "t" : base_right[count] = "a"; break;
				case "c" : base_right[count] = "g"; break;
			}
			count++;			
		});
		
		var base_rightHTML = "";
		for(var i = 0; i < base_right.length; i++){
			base_rightHTML += "<div class='dna-base right' id='"+ base_right[i] +"'></div>\r\n";
		}
		
		$(".dna-base-wrapper.right").append(base_rightHTML);
		
	}
	
}

dna.print_opposite();

