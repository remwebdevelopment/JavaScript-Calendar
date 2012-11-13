## About

A javascript calendar that can be styled and allows for 'highlighted' dates to incorporated (such as events that cause a date to appear highlighted on the calendar).

## Notes

The calendar is using jQuery solely for it's event handling, but this can easily be replaced by another library, or by standard JavaScript.

## Usage

### When calling createCalendar(), you pass in an object as the param. Here are the properties of the param object:
 
	target: The HTML element that will contain the calendar

	highlightedDates: An object whose key is a date string ("12/31/2012"). 
	When the calendar redraws itself, it will check the highlightedDates, and if it finds a match for the month is its drawing, will apply the 'hightlighted' style to the cell.
	While the object's key must be a properly formatted date string, the value can be anything.
	ex: 	var highlightedDates = {};
	highlightedDates['12/31/2012'] = {some object};
	or
	highlightedDates['1/1/2013'] = "Happy New Year";

	prevButtonText: You can pass in the text to be used for the buttons that scroll from month to month. Or you can pass in spaces, and use a background image to style the buttons.

	nextButtonText

	onDateSelected (optional): You can pass in a function that gets called when a date on the calendar is selected.

### The calendar has only one public method, which is setMonth().
You pass in an object as the param, here are the properties of the param object:

	date: A Date object whose month will be rendered in the calendar
	highlightedDates(optional): You add/replace the highlighted dates when calling setMonth()
