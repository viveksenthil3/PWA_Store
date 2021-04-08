let userRating = 0;
	
	$(".userRating i").on("mouseover", e=>{		
		$(".userRating i").css("color", "grey");
		
		for(let i=1; i<=$(e.target).attr("id").split("-")[1]; i++){
			$("#star-"+i).css("color", "#ffc61a");
		}
	});
	
	$(".userRating").on("mouseleave", e=>{
		
		$(".userRating i").css("color", "grey");		
	});
	
	$(".userRating").click(_=>{
		$(".ratingPopOuterContainer").show();
	});
	
	$(".ratingPopOuterContainer").click(e=>{
		
		if($(e.target).attr("class")==$(".ratingPopOuterContainer").attr("class"))
			$(".ratingPopOuterContainer").hide();
	});
	
	$(".userRating2 i").on("mouseover", e=>{
		
		$(".userRating2 i").css("color", "grey");
		
		for(let i=1; i<=$(e.target).attr("id").split("-")[1]; i++){
			$("#sstar-"+i).css("color", "#ffc61a");
		}
	});
	
	$(".userRating2").on("mouseleave", e=>{
		if(userRating==0)
			$(".userRating2 i").css("color", "grey");		
	});
	
	$(".userRating2 i").click(e=>{
		userRating = $(e.target).attr("id").split("-")[1];
	});
	
	$(".postRatingBtn").click(e=>{
		// console.log("hi")
		$.post("/addReview",{
			PWAId:$("#pwaId").val(),
			review: $("#userRatingMessage").val(),
			rating: userRating
		})
			// console.log("hi vivek")
			$(".ratingPopOuterContainer").hide();
			window.location.reload();
		
	});