sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/Element",
	"sap/m/MessageToast"
], function(MessageBox, Element, MessageToast) {
	"use strict";

		var busyDialog = new sap.m.BusyDialog();	
		
		var Utility = Element.extend("com.phyOccuReport.model.Utility");
		
		/**
		 * To show response message in sapui5 message box 
		 * @param {String} i18n Text
		 * @param {String} type:(error/information/alert/success/warning)
		 * @returns {undefined}
		 */
		Utility.showMessage = function(text, type, e) {
			if ($.isEmptyObject(type)) {
				type = "error";
			}
			if ($.isEmptyObject(e)) {
				switch (type) {
					case "error":
						MessageBox.error(text);
						break;
					case "information":
						MessageBox.information(text,{
							styleClass: "nes-confirm-box"
						});
						break;
					case "alert":
						MessageBox.alert(text);
						break;
					case "confirm":
						MessageBox.confirm(text);
						break;
					case "warning":
						MessageBox.warning(text);
						break;
					case "success":
						MessageBox.success(text);
						break;
				}
			}
			else{
				MessageBox.show(text, {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					actions: [MessageBox.Action.OK],
					defaultAction: MessageBox.Action.OK,
					details: JSON.stringify(e)
				});
			}
		};
		
		/**
		 * To show sap.m busy dialog
		 * @returns {undefined}
		 */
		Utility.showBusyDialog = function() {
			busyDialog.open();
		};
		
		/**
		 * To hide sap.m busy dialog
		 * @returns {undefined}
		 */
		Utility.hideBusyDialog = function() {
			busyDialog.close();
		};	
		
		/**
		 * To set dialog text for sp.m busy dialog
		 * @returns {undefined}
		 */		
		Utility.setBusyDialogText = function(text) {
			busyDialog.setText(text);
		};
		
		/**
		 * To set dialog title for sap.m busy dialog
		 * @returns {undefined}
		 */		
		Utility.setBusyDialogTitle = function(title) {
			busyDialog.setTitle(title);
		};
	      
	    /**
	     * To display error message in MessageBox alert
	     * @param {String} errMsg
	     * @param {String} title
	     * @returns {undefined}
	     */			
		Utility.displayError= function(errMsg, title) {
	        sap.m.MessageBox.alert(errMsg, {
	          styleClass: "sapUiSizeCompact",
	          icon: sap.m.MessageBox.Icon.ERROR,
	          title: title
	        });
		};
		
		Utility.showMessageToast = function(valueStateText) {
			MessageToast.show(valueStateText, {
				duration: 3000, // default
				width: "15em", // default
				my: "center bottom", // default
				at: "center center", // default
				of: window, // default
				offset: "0 0", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: false // default
			});
		};		
	
		return Utility;
});