sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";
	return {
		setJSDate: function (sValue) {
			return new Date(sValue.toString().split("T")[0]);
		},
		parseToInt: function (sValue) {
			return parseInt(sValue);
		}
	};
});