sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("zjktyrepurorder.controller.secondMaster", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("secondMaster").attachPatternMatched(this.onProductMatched, this);
		},

		onProductMatched: function (oEvt) {
			var itemsJSONModel = this.getOwnerComponent().getModel("itemsJSONModel");
			itemsJSONModel.setProperty("/title", sap.ui.getCore().title);
			this.getView().setModel(itemsJSONModel, "itemsJSONModel");
		},

		onAfterRendering: function () {
			var oSplitApp = this.getView().byId("secondMasterPage");
			// oSplitApp.getAggregation("_navMaster").addStyleClass("masterStyle");
			oSplitApp.getParent().getParent().setWidth("30.1rem");
		},

		navigateDetail: function (oEvt) {
			var link = oEvt.getSource().getParent().getItems()[0].getItems()[0].getText();
			var text = oEvt.getSource().getParent().getItems()[0].getItems()[1].getText();
			sap.ui.getCore().selRoute = this.oRouter.oHashChanger.hash;

			var data = {
				"masterDetails": link,
				"quantity": "1",
				"basicValue": "3450 ",
				"depotStock": "Available",
				"basicPrice": "100 ",
				"currency":"INR"
			};
			if (JSON.stringify(this.getOwnerComponent().getModel("tableDetailsJSONModel").getData()) === '{}') {
				var tableDetailsJSONModel = this.getOwnerComponent().getModel("tableDetailsJSONModel");
				tableDetailsJSONModel.setData({
					"Data": [data]
				});
				this.getOwnerComponent().setModel(tableDetailsJSONModel, "tableDetailsJSONModel");
			} else {
				var tableDetailsJSONModel = this.getOwnerComponent().getModel("tableDetailsJSONModel");
				var recentOrders = tableDetailsJSONModel.getData().Data.push(data);
				tableDetailsJSONModel.setData(tableDetailsJSONModel.getData());
				this.getOwnerComponent().setModel(tableDetailsJSONModel, "tableDetailsJSONModel");
			}

			this.oRouter.navTo("Detail");
		},

		handleConfirm: function () {
			alert("confirmed Filter");
		},

		allFilters: function () {
			if (!this.filterDialog) {
				this.filterDialog = sap.ui.xmlfragment("System Group", "zjktyrepurorder/view/filterFragment", this);
				this.getView().addDependent(this.filterDialog);
			}
			this.filterDialog.open();
		},

		back: function (oEvt) {
			this.oRouter.navTo("Master");
		}
	});
});