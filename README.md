# Hyperloop calendar module for Android

used library: https://github.com/prolificinteractive/material-calendarview

```javascript
var mcv = require("/calendar-android");

var calView = mcv.getView({
	mode: "week", // week or month
	arrowColor: "#AAAAAA",
	topbarVisible: true,
	selectionColor: "#ff6052"
});

calView.addEventListener("changed", onChangeDate);

// set dots below date:
var d = [];
d.push(new Date())
mcv.addEvents(d);

// select today
mcv.gotoToday();

function onChangeDate(date) {
	console.log(date);
}

$.index.add(calView);
$.index.open();
```
