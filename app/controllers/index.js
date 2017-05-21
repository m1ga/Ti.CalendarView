var mcv = require("/calendar");

var calView = mcv.getView({
	onChangeDate: onChangeDate, // event fired when date is changed
	mode: "week", // week or month
	arrowColor: "#AAAAAA",
	topbarVisible: true,
	selectionColor: "#ff6052"
});

// set dots below date:
var d = [];
d.push(new Date())
mcv.addEvents(d);

mcv.gotoToday();

function onChangeDate(date) {
	console.log(date);
}

$.index.add(calView);
$.index.open();
