const Activity = require("android.app.Activity");
const activity = new Activity(Titanium.App.Android.getTopActivity());
const Context = require("android.content.Context");
const MCV = require("com.prolificinteractive.materialcalendarview.*");
const Spans = require("com.prolificinteractive.materialcalendarview.spans.*");
const Graphics = require("android.graphics.*");
const Drawable = require("android.graphics.drawable.*");
const Shapes = require("android.graphics.drawable.shapes.*");
const LayoutParams = require("android.widget.FrameLayout.LayoutParams");
const Gravity = require("android.view.Gravity");
const ViewGroupLayoutParams = require("android.view.ViewGroup.LayoutParams");
const TypedValue = require("android.util.TypedValue");
const ArrayList = require("java.util.ArrayList");

var mcv_view = new MCV.MaterialCalendarView(activity);
var dateList = [];
var highlightDates = [];
var onChangeDate = null;
var highlightColor = "#ff0000";
var dotRadius = 3;
var dotColor = "#000";

function getDay(date) {
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
}

function pixelToDp(px) {
	return (parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
}

function dpToPixel(dp) {
	return (parseInt(dp) * (Titanium.Platform.displayCaps.dpi / 160));
}

var eventDecorator = new MCV.DayViewDecorator({
	shouldDecorate: function(calDay) {
		return (dateList.indexOf(getDay(new Date(calDay.getYear(), calDay.getMonth(), calDay.getDay()))) >= 0)
	},
	decorate: function(view) {
		var dotSpan = new Spans.DotSpan(parseFloat(dotRadius), Graphics.Color.parseColor(dotColor));
		view.addSpan(dotSpan);
		return false;
	}
});

var highlightDatesDecorator = new MCV.DayViewDecorator({
	shouldDecorate: function(calDay) {
		return (highlightDates.indexOf(getDay(new Date(calDay.getYear(), calDay.getMonth(), calDay.getDay()))) >= 0)
	},
	decorate: function(view) {
		var drawable = new Drawable.ShapeDrawable(new Shapes.OvalShape());
		drawable.getPaint().setColor(Graphics.Color.parseColor(highlightColor));
		insetDrawable = new Drawable.InsetDrawable(drawable, 0, 0, 0, 0);
		view.setBackgroundDrawable(insetDrawable);
		return false;
	}
});

exports.gotoToday = function() {
	mcv_view.clearSelection();
	mcv_view.setCurrentDate(MCV.CalendarDay.today(), true);
	mcv_view.setDateSelected(MCV.CalendarDay.today().getDate(), true);
}
exports.getView = function(obj) {
	/*
	documentation: http://prolificinteractive.github.io/material-calendarview/
	*/

	// var width = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 300, activity.getResources().getDisplayMetrics());
	// var height = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 300, activity.getResources().getDisplayMetrics());
	//var layoutParams = new LayoutParams(width, height, Gravity.CENTER);

	var calMode = MCV.CalendarMode.MONTHS;
	if (obj.mode == "week") {
		calMode = MCV.CalendarMode.WEEKS
	}

	if (obj.highlightColor) {
		highlightColor = obj.highlightColor
	}
	if (obj.dotRadius) {
		dotRadius = obj.dotRadius;
	}
	if (obj.dotColor) {
		dotColor = obj.dotColor;
	}

	mcv_view.state().edit().setCalendarDisplayMode(calMode).commit();
	mcv_view.setTopbarVisible(obj.topbarVisible || false);
	mcv_view.setArrowColor(Graphics.Color.parseColor(obj.arrowColor || "#fffff"));
	mcv_view.setShowOtherDates(MCV.MaterialCalendarView.SHOW_ALL);

	mcv_view.setDateTextAppearance(Ti.App.Android.R.style.CustomDayTextAppearance);
	mcv_view.setHeaderTextAppearance(Ti.App.Android.R.style.CustomDayTextAppearance);
	mcv_view.setWeekDayTextAppearance(Ti.App.Android.R.style.CustomDayTextAppearance);

	mcv_view.setTileHeight(132);

	mcv_view.setSelectionColor(Graphics.Color.parseColor(obj.selectionColor || "#000000"));
	mcv_view.setSelectionMode(MCV.MaterialCalendarView.SELECTION_MODE_SINGLE);
	mcv_view.setLayoutParams(new LayoutParams(ViewGroupLayoutParams.MATCH_PARENT, ViewGroupLayoutParams.MATCH_PARENT, Gravity.TOP));
	mcv_view.setOnDateChangedListener(new MCV.OnDateSelectedListener({
		onDateSelected: function(widget, date, selected) {
			if (onChangeDate) {
				onChangeDate(new Date(date.getYear(), date.getMonth(), date.getDay()));
			}
		}
	}));

	mcv_view.setDateSelected(MCV.CalendarDay.today().getDate(), true);
	mcv_view.top = 0;
	return mcv_view;
}

exports.setHighlights = function(dates) {
	highlightDates = dates;
	mcv_view.addDecorator(highlightDatesDecorator);
}
exports.getHighlights = function(dates) {
	return highlightDates;
}

exports.setDots = function(dates) {
	dateList = dates;
	mcv_view.addDecorator(eventDecorator);
}

exports.getEvents = function() {
	return dateList;
}

mcv_view.addEventListener = function(str, clb) {
	if (str == "changed") {
		onChangeDate = clb;
	}
}
