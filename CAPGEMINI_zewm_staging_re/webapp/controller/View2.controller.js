sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"com/safran/ewm/zewm_staging_re/model/formatter",
], function (Controller, JSONModel, formatter) {
	"use strict";
	var oDataModel;
	var that;
	return Controller.extend("com.safran.ewm.zewm_staging_re.controller.View2", {
		formatter: formatter,
		onInit: function () {
			that=this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("View2").attachPatternMatched(this._onRouteMatched, this);
			oDataModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oDataModel, "oDataModel");
		},
		onBeforeRebind: function (oEvent) {
			var oBindingParams = oEvent.getParameter("bindingParams");
			oBindingParams.filters.push(new sap.ui.model.Filter("Manufacturingorder", "EQ", this.sManNo));
			oBindingParams.filters.push(new sap.ui.model.Filter("Operation", "EQ", this.sOperation));
		},
		onDataReceived:function(oEvent){
			that.getView().byId("idFinishedProduct").setText(oEvent.getParameters().getParameter('data').results[0].Finishedproduct);
		},

		_onRouteMatched: function (oEvent) {
			var tempjsonString = oEvent.getParameter("arguments").entity;
			var jsonstring = tempjsonString.replace(/@/g, "/");
			var tempSelectedData = JSON.parse(jsonstring);
			this.SelectedData = JSON.parse(tempSelectedData);
			oDataModel.setData(this.SelectedData);
			this.sManNo = this.SelectedData.Manufacturingorder;
			this.sOperation = this.SelectedData.Operation;
			this.getView().byId("smartTableID").rebindTable(true);
		},
	});
});