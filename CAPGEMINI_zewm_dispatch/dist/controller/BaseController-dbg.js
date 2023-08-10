sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/MessageToast',
	'sap/ui/export/Spreadsheet',
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/UIComponent",
	"sap/m/library"
], function (Controller, MessageToast, Spreadsheet, ODataModel, UIComponent, mobileLibrary) {
	"use strict";
	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("com.safran.ewm.zewm_dispatch.controller.BaseController", {
		onInit: function () {

		},

		getDialog: function (diaId, fragmentName) {
			var oView = this.getView();
			var oDialog = oView.byId(diaId);
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "com.safran.ewm.zewm_dispatch.view.fragments." + fragmentName, this);
				oView.addDependent(oDialog);
			}

			return oDialog;
		},

		onCloseDialog: function (oEvent) {
			var oSource = oEvent.getSource();
			if (oSource.getMetadata().getName() === "sap.m.Button") {
				if (oSource.getParent().getMetadata().getName() === "sap.m.Dialog") {
					oSource.getParent().close();
				}
			}
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Convenience method for getting text from i18n
		 * @param {string} key - accept key as string
		 * @param {string} args - accept args
		 * @returns {string} - return string value of key from i18n
		 * */
		getText: function (key, args) {
			return this.getResourceBundle().getText(key, args);
		},

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getModel: function (modelName) {
			return this.getView().getModel(modelName);
		},

		onExit: function () {},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		 * Adds a history entry in the FLP page history
		 * @public
		 * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		 * @param {boolean} bReset If true resets the history before the new entry is added
		 */
		addHistoryEntry: (function () {
			var aHistoryEntries = [];

			return function (oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function (oHistoryEntry) {
					return oHistoryEntry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					this.getOwnerComponent().getService("ShellUIService").then(function (oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
		})

	});
});