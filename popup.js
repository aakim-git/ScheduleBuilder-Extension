
chrome.storage.local.get(['key'], function (result) {
    document.getElementById('status').textContent = 'Last Updated: ' + result.key; 
});

document.getElementById('Update').addEventListener('click', function () {
    document.getElementById('status').textContent = "Updating..."
    update(function () {
        crawl();
    })
});

function update(callback) {
    callback();
    document.getElementById('status').textContent = "Updated!";
    chrome.storage.local.set({ key : Date() });
}
   
function crawl() {
    //var last_page = false;
    chrome.storage.local.clear();

    var request = new XMLHttpRequest();
    for (var page = 1 ; page < 225 ; page++) {
        request.open('GET', 'https://www.ratemyprofessors.com/filter/professor/?department=&institution=University+Of+California%2C+Davis&page=' + page + '&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=1073', false);
        request.onreadystatechange = function (oEvent) {
            if (request.readyState === 4 && request.status === 200) {
                var data = JSON.parse(request.responseText);
                for (var j = 0 ; j < 20 ; j++) {
                    chrome.storage.local.set({ [data.professors[j].tLname]: data.professors[j] });
                }
            }
        };
        request.send();
    }
}