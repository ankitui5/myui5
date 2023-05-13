sap.ui.define(function () {
	"use strict";

	var Formatter = {
		formatDate: function (val) {
			if (val !== undefined) {
				val = val.split("T")[0].split("-");
				return val[2] + "-" + val[1] + "-" + val[0];
			}
		},
		trrBtnVisibility: function (oEvt) {
			if (oEvt === "sap-icon://cart-4" || oEvt === "sap-icon://cart-approval") {
				return true;
			} else {
				return false;
			}
		},

		getIcon: function (oEvt) {
			if (oEvt === "N-AVL") {
				return "sap-icon://decline";
			} else if (oEvt === "AVL.") {
				return "sap-icon://accept";
			} else {
				return "";
			}
		},

		getColor: function (oEvt) {
			if (oEvt === "N-AVL") {
				return "red";
			} else {
				return "green";
			}
		},
	};
	return Formatter;
}, true);