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
	var days = ["","Maanantai","Tiistai","Keskiviikko","Torstai","Perjantai"];
	var times = ["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

	var doc = document.getElementById("calendar");

	// create headers
	var headerRow = document.createElement("div");
		headerRow.className = "headerRow";
		
	for (var d = 0; d < days.length; d++) {
		var header = document.createElement("div");
			header.className = "day";
			header.innerText = days[d];
			headerRow.appendChild(header);
	}
	doc.appendChild(headerRow);
	
	// create columns
	for (var j = 0; j < 6; j++) {
		var col = document.createElement("div");
			col.className = "column";
		// create cells
		for(var i = 0; i < 13; i++) {
			var cell = document.createElement("div");
				cell.className = "cell";
			//	cell.innerText = j;
			
			if (j  == 0) {
				cell.innerHTML = times[i];
				cell.className = "time";
			}
			col.appendChild(cell);
		}
		doc.appendChild(col);
	}
	
	getJSON();
}

function createEvents(data) {
	var doc = document.getElementById("calendar");
	//Loop data
	for(var d = 0; d < data.length; d++) {
	var ev = document.createElement("div");
		ev.className = "event";
    	var stmz = [];
    	var etmz = [];
		// Loop schedule
		for (var s = 0; s < data[d].Time.length; s++) {
			var cont = data[d].Id + "<br>" + data[d].Name + "<br>" + data[d].Time[s].substring(5, 10) + " - " + data[d].Time[s].substring(11, 16);
			console.log(cont);
			ev.innerHTML = cont;
			ev.style.top =  getPosition(data[d].Time[s].substring(5, 10)) + "px";
			ev.style.left = getDay(data[d].Time[s].substring(1,4)) + "px";
            ev.style.height = getDuration(data[d].Time[s].substring(5, 10), data[d].Time[s].substring(11, 16)) + "px";
		}
	}
	doc.appendChild(ev);
}

function getPosition(startTime) {
	var jsonTime = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
	var tableTime = ["5","68","2","3","4","5","6","7","8","9","10","11","12"];

    for (var i = 0; i < jsonTime.length; i++) {
        var s = startTime.split(':');
        if (s[1] > 00 && s[i] < 30) {
            startTime = s[0] + ":" + "00";
        } else if (s[1] >= 30 && s[i] <= 59) {
            startTime = (s[0] + 1) + ":" + "00";
        }
		if(startTime == jsonTime[i]) {
			var result = tableTime[i];
			return result;
		}
	}
	return;
}

function getDay(day) {
	if (day == "Mon") {
		return 320;
	} else if (day == "Tue") {
		return 420;
	} else if (day == "Wed") {
		return 520;
	} else if (day == "Thu") {
		return 620;
	} else if (day == "Fri") {
		return 720;
	} else {
		return;
	}
}

function getDuration(startTime, endTime) {
    var h = 34;
	// start time
    var sDate = new Date();
    var s = startTime.split(':');
    sDate.setHours(s[0]);
    sDate.setMinutes(s[1]);
    // end time
    var eDate = new Date();
    var e = endTime.split(':');
    eDate.setHours(e[0]);
    eDate.setMinutes(e[1]);

    var elapsed = eDate - sDate; // time in milliseconds
    var difference = new Date(elapsed);
    var diff_hours = difference.getHours();
    var diff_mins = difference.getMinutes();

    var duration = diff_hours;
    return duration * h;
}
