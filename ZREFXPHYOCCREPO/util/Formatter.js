sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/type/Date"
	//"sap/ca/ui/model/format/DateFormat"
], function (Element, DateFormat, Date) {
	"use strict";
   //jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
	var Formatter = Element.extend("com.phyOccuReport.util.Formatter");

	/**
	 * Returns date in String format in a mentioned pattern 
	 * @param {type} oDate
	 * @returns {String}
	 */
	Formatter.formatDate = function (value) {
		var oDateFormat = DateFormat.getDateTimeInstance({
			pattern: "yyyy-MM-dd"
		});
		if (value) {
			var formatDt = oDateFormat.format(value);
			return formatDt;
		} else {
			return value;
		}
	};
	
	Formatter.formatDate1 = function (value) {
		if (value) {
       var year = value.substring(0,4);
       var month = value.substring(5,7);
       var date = value.substring(10,8);
        return date +"-"+month+"-"+year ;
		} else {
			return "";
		}

	};
	
	Formatter.Timeformate = function (val) {
            if (val) {
              val = val.replace(/^PT/, '').replace(/S$/, '');
              val = val.replace('H', ':').replace('M', ':');

              var multipler = 60 * 60;
              var result = 0;
              val.split(':').forEach(function(token) {
                result += token * multipler;
                multipler = multipler/ 60;
              });
              var timeinmiliseconds = result * 1000;

              var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
               pattern: "HH:mm:ss a"
              });
              var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
              return timeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
            }
            return null;  
          };
          
    Formatter.retrunStatusColor = function(value) {

			if (value === "Submitted") {
				return "Success";
			} else if (value === "Saved") {
				return "Warning";
			} else if (value === "New") {
				return "Information";
			}
	};      
	


	return Formatter;
});