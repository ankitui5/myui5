sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("zjktyrepurorder.controller.FullScreen", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
		},

		showSplitApp: function () {
			this.getView().getParent().getParent().setMode("ShowHideMode");
			this.oRouter.navTo("Master");
		}
	});
});
