var target = document.querySelector("#inlineCourseResultsDiv");
var config = { attributes: true, childList: true, characterData: true };
var observer = new MutationObserver(reload);
observer.observe(target, config);


function reload(mutations) {
    var found_prof;
    var query = document.querySelectorAll('#inlineCourseResultsContainer a[href^="mailto"]');

    // loop through each teacher in the result list
    for (var i = 0 ; i < query.length ; i = i + 3) {
        if (query[i].innerHTML === "TBA") { continue; }
        var firstName = query[i].innerHTML.substring(0, 1);
        var lastName = query[i].innerHTML.substring(3, query[i].innerHTML.length);

        // do the ajax call
        if (lastName < "M") {
            for (var page = 1 ; (found_prof == undefined || found_prof.tLname != lastName) && page < 215 ; page++) {
                found_prof = searchPage(page, firstName, lastName);
                /*if (found_prof.tLname > lastName) {
                    found_prof == undefined;
                    break;
                }*/
            }
        }
        else {
            for (var page = 214 ; (found_prof == undefined || found_prof.tLname != lastName) && page > 0 ; page--) {
                found_prof = searchPage(page, firstName, lastName);
                /*if (found_prof.tLname < lastName) {
                    found_prof == undefined;
                    break;
                }*/
            }
        }

        // output results
        if (found_prof == undefined) {
            query[i].title = "Teacher is not currently in Rate My Professor ( probably new )";
            query[i].href = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=" + 0;
        }
        else {
            query[i].title = "Dept: " + found_prof.tDept + "\nOverall Rating: " + found_prof.overall_rating + "\nNum of Ratings: " + found_prof.tNumRatings;
            query[i].href = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=" + found_prof.tid;
        }

    }
}


function searchPage(page, firstName, lastName) {
    // use hash table to improve performance
    console.log("2 : " + lastName);
    var found_prof;
    //var found = false;
    var j;
    var request = new XMLHttpRequest();
    request.open('GET', 'https://www.ratemyprofessors.com/filter/professor/?department=&institution=University+Of+California%2C+Davis&page=' + page + '&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=1073', false);
    request.onreadystatechange = function (oEvent) {
        if (request.readyState === 4 && request.status === 200) {
            var data = JSON.parse(request.responseText);
            for (var j = 0 ; j < 20 ; j++) {
                if (data.professors[j].tLname === lastName && data.professors[j].tFname.substring(0, 1) === firstName) {
                    found_prof = data.professors[j];
                   // found = true;
                    break;
                }
            }
            /*if (found == false) {
                found_prof = data.professors[j];
            }*/
        }
    };
    request.send();
    return found_prof;
}