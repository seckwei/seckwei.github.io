//alert("Hello");

function add_flip(num){
	$("[data-order='"+ num +"']").css("display", "inline-block");
}

add_flip(1);
$("[data-order='1'] > #flip-right").one("animationend webkitAnimationEnd", function (){		
	add_flip(2);
});
$("[data-order='2'] > #flip-right").one("animationend webkitAnimationEnd", function (){		
	add_flip(3);
});
$("[data-order='3'] > #flip-down").one("animationend webkitAnimationEnd", function (){		
	add_flip(4);
});
$("[data-order='4'] > #flip-left").one("animationend webkitAnimationEnd", function (){		
	add_flip(5);
});
$("[data-order='5'] > #flip-left").one("animationend webkitAnimationEnd", function (){		
	add_flip(6);
});
$("[data-order='6'] > #flip-down").one("animationend webkitAnimationEnd", function (){		
	add_flip(7);
});
$("[data-order='7'] > #flip-right").one("animationend webkitAnimationEnd", function (){		
	add_flip(8);
});
$("[data-order='8'] > #flip-right").one("animationend webkitAnimationEnd", function (){		
	add_flip(9);
});