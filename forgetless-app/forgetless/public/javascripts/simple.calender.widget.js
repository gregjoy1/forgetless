var SimpleCalenderWidget = {

	CurrentMonthData:null,
	EventData:null,

	/**
	* A place to cache all relevant DOM elements.
	**/
	CalenderElementCache:{
		MainContainerCache:null,
		CalenderTitleBarCache:null,
		CalenderMonthContainerCache:null,
		CalenderWeekContainerCache:[],
		CalenderDayCellCache:[],
		CalenderHeaderMonth:null,
		EventDetailsContainerCache:null,
		EventDetailsTitleBarContainerCache:null,
		EventDetailsTitleBarTextCache:null
	},

	/**
	* Initializes SimpleCalenderWidget to a target container with optional eventdata
	* @param {DOM Object} targetElement Element to draw SimpleCalenderWidget to
	* @param {Object} EventData Optional event data for inserting events into the calender.
	*/
	initialise:function(targetElement, EventData){
		SimpleCalenderWidget.CalenderElementCache.MainContainerCache = targetElement;
		SimpleCalenderWidget.drawCalender();
		SimpleCalenderWidget.switchToMonth();
		if(EventData){
			SimpleCalenderWidget.setEventData(EventData);
		}
	},

	/**
	* Sets calender event data after initialization
	* @param {Object} EventData Optional event data for inserting events into the calender.
	*/
	setEventData:function(EventData){
		SimpleCalenderWidget.EventData = EventData;
		SimpleCalenderWidget.switchToMonth(
			SimpleCalenderWidget.CurrentMonthData.currentYear,
			SimpleCalenderWidget.CurrentMonthData.currentMonth + 1
		);
	},

	/**
	* Draws calender to a previously defined container
	*/
	drawCalender:function(){

		// Creates Calender title bar and all of its associated controls

        var CalenderTable = document.createElement('table');
        CalenderTable.className = 'calender_main_table';

        var CalenderTableTitleRow = document.createElement('tr');
        var CalenderTableHeaderRow = document.createElement('tr');

		var CalenderTitleControlGroupBar = document.createElement('td');
		CalenderTitleControlGroupBar.className = 'calender_title_control_group_bar';
		CalenderTitleControlGroupBar.colSpan = 7;

		var PreviousMonthButton = document.createElement('div');
		PreviousMonthButton.className = 'calender_header_button';
		PreviousMonthButton.innerHTML = '&laquo;';
		PreviousMonthButton.addEventListener('click', SimpleCalenderWidget.switchToPreviousMonth);

		var MonthTitle = document.createElement('div');
		MonthTitle.className = 'calender_header_month_title';
		SimpleCalenderWidget.CalenderElementCache.CalenderHeaderMonth = MonthTitle;

		var NextMonthButton = document.createElement('div');
		NextMonthButton.className = 'calender_header_button';
		NextMonthButton.innerHTML = '&raquo;';
		NextMonthButton.addEventListener('click', SimpleCalenderWidget.switchToNextMonth);

		CalenderTitleControlGroupBar.appendChild(PreviousMonthButton);
		CalenderTitleControlGroupBar.appendChild(MonthTitle);
		CalenderTitleControlGroupBar.appendChild(NextMonthButton);

		// Creates calender day reference
		var WeekDay = ["M", "T", "W", "T", "F", "S", "S"];
        CalenderTableHeaderRow.className = 'calender_header_container';

		for(var day = 1; day <= 7; day++)
		{
			var dayHeader = document.createElement('td');
			dayHeader.className = 'calender_header_day';
			dayHeader.innerHTML = WeekDay[day-1];
            CalenderTableHeaderRow.appendChild(dayHeader);
		}

        CalenderTableTitleRow.appendChild(CalenderTitleControlGroupBar);

        CalenderTable.appendChild(CalenderTableTitleRow);
        CalenderTable.appendChild(CalenderTableHeaderRow);

		// Creates calender week and day cell containers


		for(var week = 1; week <= 6; week++)
		{
			var weekElementCacheArray = [];
			var WeekContainer = document.createElement('tr');
			WeekContainer.className = 'calender_week_container';
			WeekContainer.id = 'week' + week;

			for(var day = 1; day <= 7; day++)
			{
				var DayCell = document.createElement('td');
				DayCell.className = 'calender_day_container';
				DayCell.id = day + '-' + week;
				DayCell.addEventListener('click', function(event){
					SimpleCalenderWidget.handleCellInput(event, this)
				});
				WeekContainer.appendChild(DayCell);
				weekElementCacheArray.push(DayCell);
			}

            CalenderTable.appendChild(WeekContainer);
			SimpleCalenderWidget.CalenderElementCache.CalenderDayCellCache.push(weekElementCacheArray);
		}

		// Creates event details container and title bar and hides it by default
		var EventDetailsContainer = document.createElement('div');
		EventDetailsContainer.className = 'event_details_container';
		EventDetailsContainer.style.display = 'none';

		var EventDetailsTitleBarContainer = document.createElement('div');
		EventDetailsTitleBarContainer.className = 'event_details_titlebar_container';

		var EventDetailsTitleBarText = document.createElement('div');
		EventDetailsTitleBarText.className = 'event_details_titlebar_text';

		var EventDetailsTitleBarExitButton = document.createElement('div');
		EventDetailsTitleBarExitButton.className = 'event_details_titlebar_exit_button';
		EventDetailsTitleBarExitButton.innerText = 'X';
		
		EventDetailsTitleBarExitButton.addEventListener('click', function(){
			SimpleCalenderWidget.manageEventDetailsContainer(false);
		});

		EventDetailsTitleBarContainer.appendChild(EventDetailsTitleBarText);
		EventDetailsTitleBarContainer.appendChild(EventDetailsTitleBarExitButton);

		SimpleCalenderWidget.CalenderElementCache.MainContainerCache.appendChild(CalenderTable);

//		SimpleCalenderWidget.CalenderElementCache.MainContainerCache.appendChild(EventDetailsContainer);
//
//		SimpleCalenderWidget.CalenderElementCache.CalenderMonthContainerCache = MonthContainer;
//		SimpleCalenderWidget.CalenderElementCache.CalenderTitleBarCache = CalenderTitleBar;
//		SimpleCalenderWidget.CalenderElementCache.EventDetailsContainerCache = EventDetailsContainer;
//		SimpleCalenderWidget.CalenderElementCache.EventDetailsTitleBarContainer = EventDetailsTitleBarContainer;
//		SimpleCalenderWidget.CalenderElementCache.EventDetailsTitleBarText = EventDetailsTitleBarText;
	},

	/**
	* Defines what happens when a day cell in the calender is clicked on.
	* @param {input event object} inputEvent EventListener event data
	* @param {DOM object} element the day cell dom object element being clicked on
	*/
	handleCellInput:function(inputEvent, element){
		if(inputEvent.type == 'click')
		{
			if(element.getAttribute('event')){
				var date = element.getAttribute('event').split('_');				
				SimpleCalenderWidget.manageEventDetailsContainer(
					SimpleCalenderWidget.getEventFromDay(date[0], date[1], date[2]),
					new Date(date[2], (date[1] - 1), date[0]).toDateString('mm dd YY')
				);
			}
		}
		return false;
	},

	/**
	* Returns all relevant month data for the specified month and year used to 
	* properly generate the calender
	* @param {string} year
	* @param {string} month
	* @return {object} month data object
	*/
	getMonthData:function(year, month){
		month--;
		
		return {
			currentMonth: new Date(year, month + 1, 0).getMonth(),
			currentYear: new Date(year, month + 1, 0).getUTCFullYear(),
			previousMonth: new Date(year, month, 0).getMonth(),
			previousYear: new Date(year, month, 0).getUTCFullYear(),
			nextMonth: new Date(year, month + 2, 0).getMonth(),
			nextYear: new Date(year, month + 2, 0).getUTCFullYear(),
			previousMonthLength: new Date(year, month, 0).getDate(),
			currentMonthStartDay: new Date(year, month, 1).getDay(),
			currentMonthLength: new Date(year, month + 1, 0).getDate(), 
			today: new Date()
		};
	},

	/**
	* Switches the calender to show the previous month
	*/
	switchToPreviousMonth:function(){
		SimpleCalenderWidget.switchToMonth(
			SimpleCalenderWidget.CurrentMonthData.previousYear,
			SimpleCalenderWidget.CurrentMonthData.previousMonth + 1
		);
	},

	/**
	* Switches the calender to show the following month
	*/
	switchToNextMonth:function(){
		SimpleCalenderWidget.switchToMonth(
			SimpleCalenderWidget.CurrentMonthData.nextYear,
			SimpleCalenderWidget.CurrentMonthData.nextMonth + 1
		);
	},

	/**
	* Switches the calender to show a defined year and month
	* @param {string} year
	* @param {string} month
	* @return {object} month data for the current month
	*/
	switchToMonth:function(year, month){

		MonthReference = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		];

		if(!(year && month)){
			year = new Date().getUTCFullYear();
			month = new Date().getMonth() + 1;
		}

		var CurrentMonthData = SimpleCalenderWidget.getMonthData(year, month);

		SimpleCalenderWidget.CurrentMonthData = CurrentMonthData;
		
		var today = SimpleCalenderWidget.CurrentMonthData.today;

		month = SimpleCalenderWidget.CurrentMonthData.currentMonth + 1;

		SimpleCalenderWidget.CalenderElementCache.CalenderHeaderMonth.innerHTML = MonthReference[month - 1] + ' ' + SimpleCalenderWidget.CurrentMonthData.currentYear;


		var dayCounter = 1;
		SimpleCalenderWidget.CalenderElementCache.CalenderDayCellCache.forEach(function(week){
			week.forEach(function(dayCell){

				dayCell.style.cursor = 'default';
				dayCell.removeAttribute('event');

				if(dayCounter < CurrentMonthData.currentMonthStartDay){
					day = (CurrentMonthData.previousMonthLength - CurrentMonthData.currentMonthStartDay) + (dayCounter + 1);
					currentMonth = false;

					if(Event = SimpleCalenderWidget.getEventFromDay(day, CurrentMonthData.previousMonth + 1, CurrentMonthData.previousYear)) {
						dayCell.style.cursor = 'pointer';
						dayCell.setAttribute(
							'event', 
							day + 
							'_' +
							(CurrentMonthData.previousMonth + 1) + 
							'_' + 
							CurrentMonthData.currentYear
						);
					}
				
				} else if(dayCounter >= (CurrentMonthData.currentMonthStartDay + CurrentMonthData.currentMonthLength)){
					day = (day > 14 ? 1 : day+1);
					currentMonth = false;

					if(Event = SimpleCalenderWidget.getEventFromDay(day, CurrentMonthData.nextMonth + 1, CurrentMonthData.nextYear)) {
						dayCell.style.cursor = 'pointer';
						dayCell.setAttribute(
							'event', 
							day + 
							'_' +
							(CurrentMonthData.nextMonth + 1) + 
							'_' + 
							CurrentMonthData.currentYear
						);
					}

				} else {
					day = dayCounter - (CurrentMonthData.currentMonthStartDay - 1);
					currentMonth = true;

					if(Event = SimpleCalenderWidget.getEventFromDay(day, CurrentMonthData.currentMonth + 1, CurrentMonthData.currentYear)) {
						dayCell.style.cursor = 'pointer';
						dayCell.setAttribute(
							'event', 
							day + 
							'_' +
							(CurrentMonthData.currentMonth + 1) + 
							'_' + 
							CurrentMonthData.currentYear
						);
					}
				}


				currentDay = today.getUTCFullYear() == year && today.getDate() == day && 
				dayCounter >= CurrentMonthData.currentMonthStartDay &&
				dayCounter <= (CurrentMonthData.currentMonthStartDay + CurrentMonthData.currentMonthLength) &&
				today.getMonth() == month -1;
				
				SimpleCalenderWidget.populateDayCell(dayCell, day, currentMonth, currentDay, Event);
				dayCounter++;
			});
		});
		return CurrentMonthData;
	},

	/**
	* Populates a day cell with the appropriate contents with the provided parameters
	* @param {DOM object} element day cell container element to draw contents into.
	* @param {int} day day in month 
	* @param {int} currentMonth month in year 
	* @param {boolean} currentDay if the currently populated day cell matches the current system date 
	* @param {boolean} containsEvents if the currently populated day cell contains any events 
	*/
	populateDayCell:function(element, day, currentMonth, currentDay, containsEvents){
		element.innerHTML = '';

		var header = document.createElement('div');
		header.className = 'calender_day_contents' + 
		(!currentMonth ? ' calender_day_inactive' : '') +
		(currentDay ? ' calender_day_today' : '');

		var contents_text = document.createElement('span');
		contents_text.className = 'calender_day_contents_text';
		contents_text.innerHTML = day;

		header.appendChild(contents_text);
		element.appendChild(header);

		if(containsEvents){
			var contents = document.createElement('div');
			contents.className = 'calender_day_event';
			element.appendChild(contents);
		}

	},

	/**
	* Handles the event details container for when it should appear or disappear
	* @param {array/boolean} eventObjectArray if array of event objects - shows eventdetails container
	* if not then hides it.
	* @param {string} date date string to be shown at the top of the event details container
	*/
	manageEventDetailsContainer:function(eventObjectArray, date){
		if(eventObjectArray){
			SimpleCalenderWidget.CalenderElementCache.CalenderTitleBarCache.style.display = 'none';
			SimpleCalenderWidget.CalenderElementCache.CalenderMonthContainerCache.style.display = 'none';
			SimpleCalenderWidget.populateEventDetailContainer(eventObjectArray, date);
			SimpleCalenderWidget.CalenderElementCache.EventDetailsContainerCache.style.display = 'block';
		} else {
			SimpleCalenderWidget.CalenderElementCache.EventDetailsContainerCache.style.display = 'none';
			SimpleCalenderWidget.CalenderElementCache.CalenderTitleBarCache.style.display = 'block';
			SimpleCalenderWidget.CalenderElementCache.CalenderMonthContainerCache.style.display = 'block';
		}
	},

	/**
	* Populates the event details container in accordance to the provided array of event objects for 
	* a specific date
	* @param {object} eventObjectArray the provided array of event objects used to populate the container
	* @param {string} date date string to be shown at the top of the event details container
	*/
	populateEventDetailContainer:function(eventObjectArray, date){
		SimpleCalenderWidget.CalenderElementCache.EventDetailsContainerCache.innerHTML = '';

		SimpleCalenderWidget.CalenderElementCache.EventDetailsTitleBarText.innerText = date;
		SimpleCalenderWidget.CalenderElementCache.EventDetailsContainerCache.appendChild(
			SimpleCalenderWidget.CalenderElementCache.EventDetailsTitleBarContainer
		);		

		for(var eventDetailObject in eventObjectArray){
			eventDetailObject = eventObjectArray[eventDetailObject];
			
			var detailContainer = document.createElement('div');
			detailContainer.className = 'detail_container';
			detailContainer.id = eventDetailObject.id;

			var detailTimeSpan = document.createElement('span');
			detailTimeSpan.className = 'detail_time_span';
			detailTimeSpan.innerText = eventDetailObject.time;

			var detailTitleSpan = document.createElement('span');
			detailTitleSpan.className = 'detail_title_span';
			detailTitleSpan.innerText = eventDetailObject.title;

			detailContainer.appendChild(detailTimeSpan);
			detailContainer.appendChild(detailTitleSpan);

			SimpleCalenderWidget.CalenderElementCache.EventDetailsContainerCache.appendChild(detailContainer);
		
		}
	},

	/**
	* Finds the array of event objects for a specified date
	* @param {int} day
	* @param {int} month
	* @param {int} year
	* @return {array/boolean} array of event objects or false if none are found
	*/
	getEventFromDay:function(day, month, year){
		for(var yearKey in SimpleCalenderWidget.EventData){
			if(yearKey == year){
				for(var monthKey in SimpleCalenderWidget.EventData[yearKey]){
					if(monthKey == month){
						for(var dayKey in SimpleCalenderWidget.EventData[year][monthKey]){
							if(dayKey == day){
								return SimpleCalenderWidget.EventData[yearKey][monthKey][dayKey];
								break;
							}
						}
						break;
					}
				}
				break;
			}
		}

		return false;
	}

};
