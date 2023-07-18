sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";
	return {
		setJSDate: function (sDate) {
			if (sDate == null || sDate == undefined) {
				return "";
			} else if (sDate != "") {
				var oMonth = sDate.getUTCMonth() + 1;
				if (oMonth < 10) {
					oMonth = "0" + oMonth;
				}
				return sDate.getUTCDate() + "." + oMonth + "." + sDate.getUTCFullYear();
			}
		},
		setTDateFormat: function (sDate) {
			if (sDate == null || sDate == undefined) {
				return ""
			} else if (sDate != "") {
				sDate = sDate.toString().split("T")[0];
				sDate = sDate.toString().split("-");
				return sDate[2] + "." + sDate[1] + "." + sDate[0];
			}
		},
		parseToInt: function (sValue) {
			return parseInt(sValue);
		},
		setIcon: function (sValue) {
			if(sValue=="0"){
				return "sap-icon://rhombus-milestone-2";
			}else if(sValue=="1"){
				return "sap-icon://up";
			}else if(sValue=="2"){
				return "sap-icon://border";
			}else if(sValue=="3"){
				return "sap-icon://cancel";
			}
		},
		setIconColor: function (sValue) {
			if(sValue=="0"){
				return "grey";
			}else if(sValue=="1"){
				return "yellow";
			}else if(sValue=="2"){
				return "green";
			}else if(sValue=="3"){
				return "red";
			}
		},
		setPickingStatusText: function (sValue) {
			if(sValue=="0"){
				return this.getView().getModel("i18n").getResourceBundle().getText("NotStartedText");
			}else if(sValue=="1"){
				return this.getView().getModel("i18n").getResourceBundle().getText("InProgressText");
			}else if(sValue=="2"){
				return this.getView().getModel("i18n").getResourceBundle().getText("CompleteText");
			}else if(sValue=="3"){
				return this.getView().getModel("i18n").getResourceBundle().getText("DisputeText");
			}
		},
		setIconTooltip: function (sValue) {
			if(sValue=="0"){
				return "{}";
			}else if(sValue=="1"){
				return "{}";
			}else if(sValue=="2"){
				return "{}";
			}else if(sValue=="3"){
				return "{}";
			}
		},
	};
});