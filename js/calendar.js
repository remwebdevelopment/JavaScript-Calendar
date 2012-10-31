var REM = {};
REM.ui = {};
REM.ui.calendars = {};
	
REM.ui.calendars.createCalendar = function(params){
		var self,
			target = params.target,
			highlightedDates = params.highlightedDates || {},
			prevButtonText = params.prevButtonText || "",
			nextButtonText = params.nextButtonText || "",
			onDateSelected = params.onDateSelected;
		
		_setupHandlers();
		
		//return the public members of the module
		self = {
			setMonth	:setMonth
		};
	
		return self;
		
		/////////////////////////////////////
		// public methods
		/////////////////////////////////////
		function setMonth(params){
			if(params.highlightedDates){
				// a new set of highlighted dates have been passed in for this month
				highlightedDates = params.highlightedDates;
			}
			_drawMonth(params);
		}
		
		/////////////////////////////////////
		// private methods
		/////////////////////////////////////
		function _drawMonth(params){
			//params..
			var date = params.date;
						
			//zero out the hr,min,sec,ms of the date, and set day to first of month
			date.setDate(1);
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
			
			//local vars...
			var	month = date.getMonth(),
				year = date.getFullYear(),
				rowHeight = params.rowHeight || false,
				arOutput = [];
				
			arOutput.push('<table width="100%" cellpadding="0" cellspacing="0" class="calendar"><thead>');
			arOutput.push(_getHeaderRow({date:date}));
			arOutput.push('</thead><tbody>');
			
			var args = {
				dayNumber	:1,
				date		:date
			};
			arOutput.push(_getCalendarRows(args));
			
			arOutput.push('</tbody></table>');
			target.innerHTML = arOutput.join("");				
		
		}
		
		function _getHeaderRow(params){
			//params
			var date = params.date;
		
			var arDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
				arOutput = [],
				arMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
				monthName = arMonths[date.getMonth()],
				prevMonth = new Date(date),
				nextMonth = new Date(date);
				
			// adjust prev month by subtracting one month
			prevMonth.setMonth(prevMonth.getMonth() - 1);
			// adjust next month by adding one month
			nextMonth.setMonth(nextMonth.getMonth() + 1);
			
			// create the main header/controlbar (shows the buttons to navigate to prev/next month and diplays the month and year
			arOutput.push('<tr class="mainHeader"><td colspan="7" align="center"><span class="gotoPrevMonth" date="' +  _getDateString(prevMonth) + '">' + prevButtonText + '</span><span class="mainHeaderText">&nbsp;' + monthName + " " + date.getFullYear() + '&nbsp;</span><span class="gotoNextMonth" date="' +  _getDateString(nextMonth) + '">' + nextButtonText + '</span></td></tr>'); 
			
			// create the column headers (that display the day names)...
			var thPercentWidth;
			arOutput.push('<tr class="daysHeader">');
			for(var x = 0, len = arDays.length; x < len; x++){
				//the first and last columns will get a width of 15%, all other cols will get 14%
				thPercentWidth = (x == 0 || x == len - 1) ? 15 : 14;
				arOutput.push('<th align="center" width="' + thPercentWidth + '%">' + arDays[x] + '</th>');
			}
			arOutput.push("</tr>");
			
			return arOutput.join("");
		}
		
		function _getCalendarRows(params){
			// params...
			var dayNumber = params.dayNumber,
				date = params.date,
				totalDaysInMonth = params.totalDaysInMonth || false,
				firstDayNumber = params.firstDayNumber || false;
			
			var arOutput = [];
			
			// if totalDaysInMonth or firstDayNumber have not yet been calculated, then do it now
			// note: the first call to _getCalendarRows will not pass in totalDaysInMonth or firstDayNumber
			// but the recursive calls will pass them in
			if(!totalDaysInMonth || !firstDayNumber){
				// note that firstDayNumber will be a number 0-6 with 0 representing Sunday
				var tmp = new Date(date);
								
				// set tmp date to be the first of the month
				tmp.setDate(1);
				
				// get the dayNumber of the first day of the month
				//this will be 0-6 depending on which day the first of the month falls
				firstDayNumber = tmp.getDay();
				
				// to calculate the number of days in a month, set the tmp date to the first day of NEXT month and then subtract a day
				tmp.setMonth(tmp.getMonth()+1);
				tmp.setDate(tmp.getDate() - 1);
				totalDaysInMonth = tmp.getDate();
					
			}		
			
			// start creating the row of days
			arOutput.push('<tr>');
			for(var x=0; x < 7; x++){
				
				var divClass = "";
				//this is the last column in the row, needs special css class applied
				if(x == 6){
					divClass = ' class="last"';
				}
				
				if(dayNumber <= 7 && firstDayNumber > x){
					//if the dayNumber is still within the first week
					//then we might need to have some empty cells
					//ex: if the fisrt day of the month falls on a fri, 
					//then mon-thu will be empty for the first week
					arOutput.push('<td align="center"><div' + divClass + '>&nbsp;</div></td>');
					continue;
				}else if(dayNumber > totalDaysInMonth){
					//if the dayNumber is greater than the total number of days in the month,
					//we still need to finish creating the row, but the cells will be empty
					arOutput.push('<td align="center"><div' + divClass + '>&nbsp;</div></td>');
					continue;
				}else{
					
					date.setDate(dayNumber);
					var dateStr = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear(),
						highlightedClass = "";						
						
					//check to see if this date is one of the highlightedDates
					if(highlightedDates[dateStr]){
						highlightedClass = ' class="highlighted"';
					}
										
					//write the day number into the cell and add some attributes...
					arOutput.push('<td align="center" data-date="' + dateStr + '" ' + highlightedClass + '><div' + divClass + '>'+ dayNumber + '</div></td>');
					dayNumber++;
					//once we have started writing days, we can cancel out firstDayNumber, we no longer need it
					//because we have already written the first day (this means the first block in this if/else if/else statement will never run
					firstDayNumber = -1;
				}
			}
			arOutput.push('</tr>');
			
			//now check to see if we need to add another row of days
			if(dayNumber < totalDaysInMonth){
				arOutput.push(_getCalendarRows({dayNumber:dayNumber,date:date,totalDaysInMonth:totalDaysInMonth,firstDayNumber:firstDayNumber}));
			}
			
			return arOutput.join("");
		}
		
		
		function _getDateString(date){
			// takes a date obj and returns it as a string like mm/dd/yyy
			if(date instanceof Date){
				return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
			}else{
				throw "Invalid date passed to _getDateString()";
			}
		}

		
		function _setupHandlers(){
			//////////////////////////////				
			//handlers for calendar
			//////////////////////////////
						
			var $calendarTarget = $(target);
								
			//gotoPrev/NextMonth click handler...
			$calendarTarget.on("click",".gotoPrevMonth, .gotoNextMonth",function(){
				//get the timeStamp attr of the .gotoPrevMonth element that was just clicked
				var dateStr = $(this).attr("date"),
					date = new Date(dateStr);
								
				//redraw the month...
				self.setMonth({date:date});
				
			});
			
			//handler for clicks on a td in the calendar that has a date in it...
			$calendarTarget.on("click","td[data-date]",function(){
				var $this = $(this),
					dateStr = $this.attr("data-date"),
					date = new Date();
				
				if(onDateSelected){
					onDateSelected({dateString:dateStr,target:target});
				}
			});
		}
};