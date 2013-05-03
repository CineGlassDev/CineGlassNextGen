//
// declare namespace for cineglass
//
if (typeof cineglass === 'undefined') {
    // important: do not use var, as "var cineglass = {};" will overwrite 
    // an existing cineglass variable value with undefined in IE8, IE7. 
    cineglass = {};     
}

//
// Timeline Constructor
//
cineglass.Timeline = function(container) {
    if (container) {

        //
        // initialize variables
        //

        this.viewport = container;

        // zoom levels with corresponding display-days
        this.zoomLevels = {
            '3-Years': 1150,
            'Year': 383,
            'Quarter': 98,
            'Month': 34,
            'Week': 9
        };

        this.zoomDays = this.zoomLevels.Quarter;
        this.renderAs3D = true;

        //
        // default min/max dates to 45 days into past/future 
        // respectively and the centerline to today
        //
        var today = new Date();
        this.minDate = new Date().setDate(today.getDate() - 45);
        this.maxDate = new Date().setDate(today.getDate() + 45);
        this.focusDate = today;

        this.eventBarHeight = 30;
        this.eventVerticalSpacing = 5;


        //
        // Data JSON Specification:
        // name : display name for the event (required)
        // start : start date of the event (required)
        // end : end date of the event (undefined signifies a milestone)
        // tooltip : event tooltip
        // startStatus : one of the eventStatuses enum values
        // endStatus : one of the eventStatuses enum values
        //
        this.data = [];

        // event status enums
        this.eventStatuses = {
            'none': 0,
            'okay': 1,
            'pending': 2,
            'fulfilled': 3,
            'warning': 4,
            'error': 5
        };

        this.eventParams = {};
    }
}

cineglass.Timeline.prototype.buildTimelineHeaderFooter = function () {
    // create header
    var headerFooter = document.createElement('DIV');
    headerFooter.className = 'timeline-header-footer timeline-surface' + (this.renderAs3D === true ? ' perspective-3d' : '');

    var labels = document.createElement('DIV');
    labels.className = 'timeline-labels';

    // TODO: Considering zoom-level/minDate/maxDate, create all of 
    // the major/minor labels and add them to the labels div
        
    headerFooter.appendChild(labels);

    return headerFooter;
}

cineglass.Timeline.prototype.buildTimeline = function () {

    var me = this;

    // clear existing timeline items
    $(this.viewport).empty();

    if (typeof this.data !== 'undefined' && this.data.length > 0) {

        // calculate the timeline width
        var timelineWidth = Math.max(this.getDatePixels(this.maxDate), this.viewport.offsetWidth);

        // add timeline header
        var header = this.buildTimelineHeaderFooter();
        this.viewport.appendChild(header);

        // add main timeline container
        var timelineMain = document.createElement('DIV');
        timelineMain.id = 'timeline-main';
        timelineMain.className = 'timeline-surface' + (this.renderAs3D === true ? ' perspective-3d' : '');
        this.viewport.appendChild(timelineMain);

        // add events container
        var timelineEvents = document.createElement('DIV');
        timelineEvents.id = 'timeline-events';
        timelineMain.appendChild(timelineEvents);

        // sort data by start and then by name
        this.data.sort(function (a, b) {
            var compare = ((a.start < b.start) ? -1 : ((a.start > b.start) ? 1 : 0));
            if (compare == 0) {
                var aName = a.name.toLowerCase();
                var bName = b.name.toLowerCase();
                compare = ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
            }
            return compare;
        });

        var top = this.eventVerticalSpacing;

        //
        // add an event bar to the events container for every data item
        //
        $.each(this.data, function (index, event) {
            
            var eventBar = document.createElement('DIV');            
            eventBar.textContent = event.name;
            eventBar.title = (typeof event.tooltip !== 'undefined' ? event.tooltip : event.name);

            var left = me.getDatePixels(event.start);

            if (typeof event.end !== 'undefined' && event.end !== undefined) {

                eventBar.className = 'timeline-event';

                var width = me.getDatePixels(event.start, event.end);

                eventBar.style.top = top + 'px';
                eventBar.style.left = left + 'px';
                eventBar.style.width = width + 'px';

                // TODO: Read startStatus/endStatus properties and
                // draw the appropriate symbol on each end of the
                // event bar

                timelineEvents.appendChild(eventBar);

            } else {
                // TODO: Draw special milestone indicator
            }

            top += me.eventBarHeight + me.eventVerticalSpacing;

        });

        // add timeline footer
        var footer = this.buildTimelineHeaderFooter();
        this.viewport.appendChild(footer);
    }

}

cineglass.Timeline.prototype.getDatePixels = function (date1, date2) {    
    var minutesPerPixel = this.zoomDays * 1440 / this.viewport.offsetWidth;
    var totalMinutes;
    if (typeof date2 !== 'undefined' && date2 !== undefined && date2 !== null) {
        totalMinutes = this.dateDiffInMinutes(date1, date2);
    } else {
        totalMinutes = this.dateDiffInMinutes(this.minDate, date1);
    }
    return minutesPerPixel * totalMinutes;
}

cineglass.Timeline.prototype.navigateToFocusDate = function () {

    var focusX = this.getDatePixels(this.focusDate);

    $('#timeline-events, .timeline-labels').animate({
        left: focusX + 'px'
    }, 1000, function () {
        // nothing to do on completion
    });
}


////////////////////////
//  UTILITY METHODS  ///
////////////////////////

// Internet Explorer 8 and older does not support Array.indexOf,
// so we define it here in that case
// http://soledadpenades.com/2007/05/17/arrayindexof-in-internet-explorer/
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}

// Internet Explorer 8 and older does not support Array.forEach,
// so we define it here in that case
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
        for (var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope || this, this[i], i, this);
        }
    }
}

cineglass.Timeline.prototype.dateDiffInDays = function(date1, date2) {
    var MS_PER_DAY = 86400000;

    // discard time-zone information to avoid 
    // a collision with daylight savings time    
    var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

cineglass.Timeline.prototype.dateDiffInMinutes = function (date1, date2) {
    return this.dateDiffInDays(date1, date2) * 1440;
}

cineglass.Timeline.prototype.sortByStartThenName = function(a, b) {  
    var compare = ((a.start < b.start) ? -1 : ((a.start > b.start) ? 1 : 0));
    if (compare == 0) {
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();
        compare = ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    return compare;
}



///////////////////////////////
//  EVENT HANDLING METHODS  ///
///////////////////////////////


cineglass.Timeline.addEventListener = function (element, action, listener, useCapture) {
    if (element.addEventListener) {
        if (useCapture === undefined)
            useCapture = false;

        if (action === "mousewheel" && navigator.userAgent.indexOf("Firefox") >= 0) {
            action = "DOMMouseScroll";  // For Firefox
        }

        element.addEventListener(action, listener, useCapture);
    } else {
        element.attachEvent("on" + action, listener);  // IE browsers
    }
};

cineglass.Timeline.removeEventListener = function (element, action, listener, useCapture) {
    if (element.removeEventListener) {
        // non-IE browsers
        if (useCapture === undefined)
            useCapture = false;

        if (action === "mousewheel" && navigator.userAgent.indexOf("Firefox") >= 0) {
            action = "DOMMouseScroll";  // For Firefox
        }

        element.removeEventListener(action, listener, useCapture);
    } else {
        // IE browsers
        element.detachEvent("on" + action, listener);
    }
};

cineglass.Timeline.getTarget = function (event) {
    // code from http://www.quirksmode.org/js/events_properties.html
    if (!event) {
        event = window.event;
    }

    var target;

    if (event.target) {
        target = event.target;
    }
    else if (event.srcElement) {
        target = event.srcElement;
    }

    if (target.nodeType != undefined && target.nodeType == 3) {
        // defeat Safari bug
        target = target.parentNode;
    }

    return target;
};

cineglass.Timeline.stopPropagation = function (event) {
    if (!event)
        event = window.event;

    if (event.stopPropagation) {
        event.stopPropagation();  // non-IE browsers
    }
    else {
        event.cancelBubble = true;  // IE browsers
    }
};

cineglass.Timeline.preventDefault = function (event) {
    if (!event)
        event = window.event;

    if (event.preventDefault) {
        event.preventDefault();  // non-IE browsers
    }
    else {
        event.returnValue = false;  // IE browsers
    }
};


