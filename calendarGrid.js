function getJSON() {
	var jqxhr = $.getJSON( "data.json", function() {
	})
  .success(function(response) {
	createEvents(response);
  })
  .fail(function() {
    console.log( "error" );
	return;
  })
}

function createGrid() {
	// list for weekdays
	var days = ["","Maanantai","Tiistai","Keskiviikko","Torstai","Perjantai"];
	// list for times
	var times = ["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

	var doc = document.getElementById("calendar");
	doc.className = "clearfix";

	// create headers
	var headerRow = document.createElement("div");
		headerRow.className = "headerRow clearfix";
	
	// create and add header rows with days
	for (var d = 0; d < days.length; d++) {
		var header = document.createElement("div");
			header.className = "day";
			header.innerText = days[d];
			headerRow.appendChild(header);
	}
	doc.appendChild(headerRow);
	
	var canvas = document.createElement("div");
	canvas.className = "canvas";
	canvas.id = "canvas";

	// create columns
	for (var j = 0; j < 6; j++) {
		var col = document.createElement("div");
			col.className = j == 0 ? "column column--time clearfix" : "column clearfix";
		// create cells
		for(var i = 0; i < 13; i++) {
			var cell = document.createElement("div");
				cell.className = "cell";
			// add times to calendar
			if (j  == 0) {
				cell.innerHTML = times[i];
				cell.className = "time";
			}
			col.appendChild(cell);
		}
		j == 0 ? doc.appendChild(col) : canvas.appendChild(col);
	}

	doc.appendChild(canvas);
	// get calendar data
	getJSON();
}

function createEvents(data) {
	var doc = document.getElementById("canvas");
	//Loop data
	for(var d = 0; d < data.length; d++) {
			if(data[d].Str != "") {
				var strDiv = document.createElement("div");
					strDiv.className = "strDiv";
				var strcont = "<p>" + data[d].Id + "</p><p>" + data[d].Name + "</p><br><i>"+ data[d].Str +"</i>";
				strDiv.innerHTML = strcont;
				doc.appendChild(strDiv);
				console.log(data[d].Str);				
			}
		var stmz = [];
    	var etmz = [];
		// Loop schedule
		for (var s = 0; s < data[d].Time.length; s++) {
			var ev = document.createElement("div");
			ev.className = "event";
			// text content for each event
			var cont = "<i>" + data[d].Id + "</i><p>" + data[d].Name + "</p>" + data[d].Time[s].substring(5, 10) + " - " + data[d].Time[s].substring(11, 16);
			// add content to event div
			ev.innerHTML = cont;
			// get starting position
			ev.style.top =  getPosition(data[d].Time[s].substring(5, 10)) + "px";
			// get horizontal position of day
			ev.style.left = getDay(data[d].Time[s].substring(1,4)) + "%";
			// get event height
            ev.style.height = getDuration(data[d].Time[s].substring(5, 10), data[d].Time[s].substring(11, 16)) + "px";
			// add event to the grid
			doc.appendChild(ev);
		}
	}
}

function getPosition(startTime) {
	// at 08:00 vertical position is 0
	var begin = 0;
	var beginDate = new Date();
	beginDate.setHours(8);
	beginDate.setMinutes(00);
	// 34px is height of one hour. Dividing it for minutes.
	var addMinutes = 34 / 60;
	var sDate = new Date();
    var s = startTime.split(':');
    sDate.setHours(s[0]);
    sDate.setMinutes(s[1]);
	
	// calculate difference between starting time and 08:00
	var elapsed = sDate - beginDate; // time in milliseconds
	// convert result to minutes
    var difference = new Date(Math.floor(elapsed / 60000));

	// calculate event's vertical starting position
	var startPosition = begin + (difference * addMinutes);
	return startPosition;
}

function getDay(day) {
	// get event horizontal starting position in % for each day
	if (day == "Mon") {
		return 1;
	} else if (day == "Tue") {
		return 21;
	} else if (day == "Wed") {
		return 41;
	} else if (day == "Thu") {
		return 61;
	} else if (day == "Fri") {
		return 81;
	} else {
		return;
	}
}

function getDuration(startTime, endTime) {
	// height of one cell divided to minutes
    var h = 33 / 60;
	// convert start time to Date()
    var sDate = new Date();
    var s = startTime.split(':');
    sDate.setHours(s[0]);
    sDate.setMinutes(s[1]);
    // same with end time
    var eDate = new Date();
    var e = endTime.split(':');
    eDate.setHours(e[0]);
    eDate.setMinutes(e[1]);

	// calculate time difference in milliseconds
    var elapsed = eDate - sDate; // time in milliseconds
	// convert milliseconds to minutes
    var difference = new Date(Math.floor(elapsed / 60000));
	// multiply minutes by cell height and you get event height
    var duration = difference * h;

    return duration;
}
