var target = document.querySelector("#inlineCourseResultsDiv");
var config = { attributes: true, childList: true, characterData: true };
var observer = new MutationObserver(reload);
observer.observe(target, config);

function reload(mutations) {
    // query = list of teachers from the search. 
    var query = document.querySelectorAll('#inlineCourseResultsContainer a[href^="mailto"]');

    // loop through each teacher in the result list
	chrome.storage.local.get(function(items){
		for (var i = 0 ; i < query.length ; i = i + 3) {
			if (query[i].innerHTML === "TBA") { continue; }
			var lastName = query[i].innerHTML.substring(3, query[i].innerHTML.length);
			if(items[lastName] == undefined){
				console.log("couldn't find " + lastName);
				query[i].title = "Teacher is not currently in Rate My Professor ( probably new )";
				query[i].href = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=" + 0;
				query[i].target = "_blank";
			}
			else{
			    console.log("found " + items[lastName].tLname);
				query[i].title = "Dept: " + items[lastName].tDept + "\nOverall Rating: " + items[lastName].overall_rating + "\nNum of Ratings: " + items[lastName].tNumRatings;
				query[i].href = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=" + items[lastName].tid;
                query[i].target = "_blank";
			}
		}
	});
}


