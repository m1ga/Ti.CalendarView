var mcv = require("/calendar-android");

var calView = mcv.getView({
	//mode: "week", // week or month
	arrowColor: "#AAAAAA",
	topbarVisible: true,
	selectionColor: "#ff6052",
	highlightColor: "#0000FF"
});

calView.addEventListener("changed", onChangeDate);

// set dots below date:
var d = [];
d.push(new Date(2017, 5, 14).getTime())
mcv.setEvents(d);

d = [];
d.push(new Date(2017, 5, 12).getTime())
d.push(new Date(2017, 5, 9).getTime())
mcv.setHighlights(d);

// select today
mcv.gotoToday();

function onChangeDate(date) {
	console.log(date);
}

$.index.add(calView);
$.index.open();
