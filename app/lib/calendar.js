var Activity = require('android.app.Activity');
var Context = require("android.content.Context");
var activity = new Activity(Titanium.App.Android.getTopActivity());
var MaterialCalendarView = require("com.prolificinteractive.materialcalendarview.MaterialCalendarView");
var OnDateSelectedListener = require("com.prolificinteractive.materialcalendarview.OnDateSelectedListener");
var Color = require('android.graphics.Color');
var LayoutParams = require('android.widget.FrameLayout.LayoutParams');
var Gravity = require('android.view.Gravity');
var ViewGroupLayoutParams = require('android.view.ViewGroup.LayoutParams');
var TypedValue = require('android.util.TypedValue');
var CalendarDay = require('com.prolificinteractive.materialcalendarview.CalendarDay');
var CalendarMode = require('com.prolificinteractive.materialcalendarview.CalendarMode');
var DayViewDecorator = require('com.prolificinteractive.materialcalendarview.DayViewDecorator');
var ArrayList = require('java.util.ArrayList');
var DotSpan = require('com.prolificinteractive.materialcalendarview.spans.DotSpan');
var mcv = new MaterialCalendarView(activity);
var dateList = [];

function getDay(date) {
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
}

var eventDecorator = new DayViewDecorator({
	shouldDecorate: function(calDay) {
		return (dateList.indexOf(getDay(new Date(calDay.getYear(), calDay.getMonth(), calDay.getDay()))) >= 0)
	},
	decorate: function(view) {
		dotSpan = new DotSpan();
		view.addSpan(dotSpan);
		return false;
	}
});

exports.gotoToday = function() {
	mcv.clearSelection();
	mcv.setCurrentDate(CalendarDay.today(), true);
	mcv.setDateSelected(CalendarDay.today().getDate(), true);
}
exports.getView = function(obj) {
	var onChangeDate = null;
	if (obj.onChangeDate) {
		onChangeDate = obj.onChangeDate;
	}
	/*
	documentation: http://prolificinteractive.github.io/material-calendarview/
	*/

	// var width = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 300, activity.getResources().getDisplayMetrics());
	// var height = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 300, activity.getResources().getDisplayMetrics());
	//var layoutParams = new LayoutParams(width, height, Gravity.CENTER);

	var calMode = CalendarMode.MONTH;
	if (obj.mode == "week") {
		calMode = CalendarMode.WEEKS
	} else {

	}

	var arrowColor = obj.arrowColor || "#fffff";

	mcv.state().edit().setCalendarDisplayMode(calMode).commit();
	mcv.setTopbarVisible(obj.topbarVisible || false);
	mcv.setArrowColor(Color.parseColor(arrowColor));
	mcv.setShowOtherDates(MaterialCalendarView.SHOW_ALL);

	mcv.setDateTextAppearance(Ti.App.Android.R.style.CustomDayTextAppearance);
	mcv.setHeaderTextAppearance(Ti.App.Android.R.style.CustomDayTextAppearance);
	mcv.setWeekDayTextAppearance(Ti.App.Android.R.style.CustomDayTextAppearance);

	mcv.setSelectionColor(Color.parseColor(obj.selectionColor || "#000000"));
	mcv.setSelectionMode(MaterialCalendarView.SELECTION_MODE_SINGLE);
	mcv.setLayoutParams(new LayoutParams(ViewGroupLayoutParams.MATCH_PARENT, ViewGroupLayoutParams.MATCH_PARENT, Gravity.TOP));
	mcv.setOnDateChangedListener(new OnDateSelectedListener({
		onDateSelected: function(widget, date, selected) {
			if (onChangeDate) {
				onChangeDate(new Date(date.getYear(), date.getMonth(), date.getDay()));
			}
		}
	}));

	mcv.setDateSelected(CalendarDay.today().getDate(), true);
	mcv.top = 0;
	return mcv;
}

exports.addEvents = function(dates) {
	dateList = dates;
	mcv.addDecorator(eventDecorator);
}
