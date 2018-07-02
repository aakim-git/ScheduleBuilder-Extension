
var config = { attributes: true, childList: true, characterData: true };

var target = document.querySelector("#FinalExamsDisplayContainer");
var observer = new MutationObserver(function () { getTimes();  color(); });
observer.observe(target, config);

var target2 = document.querySelector("#inlineCourseResultsDiv");
var observer2 = new MutationObserver(function () { color(); } );
observer2.observe(target2, config);


//____________________________________________________________
 //



var times = {
    "M": [],
    "T": [],
    "W": [],
    "R": [],
    "F": [],
};

window.addEventListener('load', function () { getTimes(); }, false);

function Class(start, end) {
    this.start = start;
    this.end = end;
}


function color() {
    var query = document.querySelector('#inlineCourseResultsContainer');
    query = query.querySelectorAll(".data-item");

    // loop through each class in the result list
    for (var i = 0 ; i < query.length ; i++) {
        meeting_data = query[i].querySelector(".meetings").querySelectorAll(".data-column");
        if (meeting_data == undefined || meeting_data.length == 0) { continue; }
        var conflict = false;
        
        // check the lecture times. 
        if (meeting_data[1] != undefined && meeting_data[1].innerText != "") {
            if (check_times(meeting_data[1].innerText, meeting_data[2].innerText) == false) { conflict = true; }
        }
        
        // check discussion times
        if (meeting_data[6] != undefined && meeting_data[6].innerText != "") {
            if (check_times(meeting_data[6].innerText, meeting_data[7].innerText) == false) { conflict = true; }
        }
        
        // color red if conflict exists
        if (conflict == true) {
            query[i].style.backgroundColor = "#ffb5c2"; // light red
        }
        
    } // end for
}

// updates the -times array.
function getTimes() {
    times = { "M": [], "T": [], "W": [], "R": [], "F": []};
    var query = document.querySelectorAll('.data.meeting-times.hide');

    // for each class
    for (var i = 0 ; i < query.length ; i++) {
        var data = query[i].querySelectorAll('.float-left.height-justified');
        if (data[3].innerText == "TBA") { continue; }

        // for every day of the week
        for (var j = 0 ; j < data[2].innerText.length ; j++) {
            times[data[2].innerText[j]].push(getClassTimes(data[1].innerText));
        }

        for (var j = 0 ; j < data[6].innerText.length ; j++) {
            times[data[6].innerText[j]].push(getClassTimes(data[5].innerText));
        }
       
    }
}


// converts string of class times to a Class object
function getClassTimes(classTime){
    var time = classTime.replace(/:/g, '.');
    var start = time.split(" - ")[0];
    var end = time.split(" - ")[1];

    var cur_class = new Class(parseFloat(start), parseFloat(end));
    if (start.substr(start.length - 2, 2) == "PM" && Math.floor(cur_class.start) != 12) { cur_class.start += 12; }
    if (end.substr(end.length - 2, 2) == "PM" && Math.floor(cur_class.end) != 12) { cur_class.end += 12; }

    return cur_class;
}


// checks if a time conflicts with currently registered classes
function check_times(hours, days) {
    var meeting_days = days.replace(/,/g, '');
    var meeting_hours = hours.replace(/:/g, '.');
    var start = meeting_hours.split(" - ")[0];
    var end = meeting_hours.split(" - ")[1];

    var class_hours = new Class(parseFloat(start), parseFloat(end));
    if (start.substr(start.length - 2, 2) == "PM" && Math.floor(class_hours.start) != 12) { class_hours.start += 12; }
    if (end.substr(end.length - 2, 2) == "PM" && Math.floor(class_hours.end) != 12) { class_hours.end += 12; }

    for (var i = 0 ; i < meeting_days.length ; i++) {
        for (var j = 0 ; j < times[meeting_days[i]].length ; j++) {
            if (class_hours.start >= times[meeting_days[i]][j].start && class_hours.start <= times[meeting_days[i]][j].end) {
                return false;
            }
            if (class_hours.end >= times[meeting_days[i]][j].start && class_hours.end <= times[meeting_days[i]][j].end) {
                return false;
            }
        }
    }

    return true;

}