/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"com/phyOccuReport/model/ModelHandler"
], function(Controller, History, ModelHandler) {
	"use strict";

	return Controller.extend("com.phyOccuReport.controller.BaseController", {

		onInit: function() {
			/*var sSrc = jQuery.sap.getModulePath("com.phyOccuReport") + "/img/cpwd_logo_min.png";
				this.getView().byId("idImage").setSrc(sSrc);*/
		},

		/********************************************************************************************************/
		OnTilebtnpress: function(oEvt) {
			var statusvalue = "";
			if (oEvt.getSource().getHeader() === "New Allotment") {
				statusvalue = "NEW";
			} else if (oEvt.getSource().getHeader() === "Occupied") {
				statusvalue = "POST";
			} 

			var oEventBus = this.getOwnerComponent().getEventBus(); // get the EventBus
			oEventBus.publish("StatusFilter", {
				text: statusvalue
			}); // get the onPress method out of the EventBus

		},

		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {

			return this.getView().getModel(sName);

		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		}

	});

});