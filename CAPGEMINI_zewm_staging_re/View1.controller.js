sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"com/safran/ewm/zewm_staging_re/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
], function (Controller, MessageBox, formatter,MessageToast,JSONModel) {
	"use strict";
	var _self, oTimeout;
	return Controller.extend("com.safran.ewm.zewm_staging_re.controller.View1", {
		formatter: formatter,
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("View1").attachPatternMatched(this._onObjectMatched, this);
		},
		onBeforeExport:function(oEvent){
			var mExcelSettings = oEvent.getParameter("exportSettings");
			
			for(var i=0 ; i<mExcelSettings.workbook.columns.length ; i++){
				if(mExcelSettings.workbook.columns[i].label.toLowerCase() =='confirmed date' || mExcelSettings.workbook.columns[i].label.toLowerCase() =='date de confirmation'){
					mExcelSettings.workbook.columns[i].type = sap.ui.export.EdmType.Date;
				}
				if(mExcelSettings.workbook.columns[i].label.toLowerCase() =='requirement date' || mExcelSettings.workbook.columns[i].label.toLowerCase() =='date de besoin'){
					mExcelSettings.workbook.columns[i].type = sap.ui.export.EdmType.Date;
				}
				if(mExcelSettings.workbook.columns[i].label.toLowerCase() =='required start date' || mExcelSettings.workbook.columns[i].label.toLowerCase() =='date de début du besoin'){
					mExcelSettings.workbook.columns[i].type = sap.ui.export.EdmType.Date;
				}
			}
			// Due to the use of built-in formats, Date is displayed based on the user's locale in the operating system. 
			// This can lead to different representations for different users.
			
			//mExcelSettings.workbook.columns[0].inputFormat = "dd/mm/yyyy";
			if(mExcelSettings.url){
				return;
			}
		},
		onExit: function () {
			// Stop the interval on exit or navigation to different page. 
			clearInterval(oTimeout);
			oTimeout = null;
		},
		onSwitchChange: function (oEvent) {
			if (this.getView().byId("idSwitch").getState()) {
				_self = this;
				oTimeout = setInterval(function () {
					_self.getView().byId("smartTableID").rebindTable(true);
				}, 30000);
			} else if (!this.getView().byId("idSwitch").getState()) {
				this.onExit();
			}
		},
		_onObjectMatched: function (oEvent) {
			this.fnEditButtonValidation();
		},
		fnEditButtonValidation:function(){
			var that = this;
			var sServiceUrl = "/sap/opu/odata/sap/ZLEWM_PMR_PROD_STAGING_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oReadModel.setHeaders({
				"Content-Type": "application/json"
			});
			var fncSuccess = function (oData, oResponse) {
				that.getView().byId("smartFilterBar").setShowMessages(true);
				if(parseInt(oData.results[0].AuthStatus)==1){
					that.getView().byId("idEditButton").setVisible(true);
				}
				else{
					that.getView().byId("idEditButton").setVisible(false);
				}
			};
			var fncError = function (oError) {
				that.getView().byId("idEditButton").setVisible(false);
			};
			var path = "EditAuthorizationSet";
			oReadModel.read(path, {
				success: fncSuccess,
				error: fncError
			});
		},
		onFilterBarInitialise: function () {
			this.getView().byId("smartFilterBar").getControlByKey("Plant").setValueHelpOnly(true);
			this.getView().byId("smartFilterBar").getControlByKey("Plant").attachChange(this.onPlantTokenChange, this);
			//this.getView().byId("smartFilterBar").getControlByKey("Plant").attachTokenChange(this.fnTokenChange,this);
			this.getView().byId("smartFilterBar").getControlByKey("Cei").setEnabled(false);
			this.getView().byId("smartFilterBar").getControlByKey("Ui").setEnabled(false);
			this.getView().byId("smartFilterBar").getControlByKey("Exceptindicator3").setEnabled(false);
			this.getView().byId("smartFilterBar").getControlByKey("Uap").setEnabled(false);
			this.getView().byId("smartFilterBar").getControlByKey("Ligneprod").setEnabled(false);
			this.getView().byId("smartFilterBar").getControlByKey("Product").setEnabled(false);
		},
		onPlantTokenChange: function (oEvent) {
			if (oEvent.getSource().getValue() == "" || oEvent.getSource().getValue() == "NULL") {
				oEvent.getSource().setValue("");
				this.getView().byId("smartFilterBar").getControlByKey("Cei").setEnabled(false).removeAllTokens();
				this.getView().byId("smartFilterBar").getControlByKey("Ui").setEnabled(false).removeAllTokens();
				this.getView().byId("smartFilterBar").getControlByKey("Exceptindicator3").setEnabled(false).removeAllTokens();
				this.getView().byId("smartFilterBar").getControlByKey("Uap").setEnabled(false).removeAllTokens();
				this.getView().byId("smartFilterBar").getControlByKey("Ligneprod").setEnabled(false).removeAllTokens();
				this.getView().byId("smartFilterBar").getControlByKey("Product").setEnabled(false).removeAllTokens();
			} else {
				this.getView().byId("smartFilterBar").getControlByKey("Cei").setEnabled(true);
				this.getView().byId("smartFilterBar").getControlByKey("Ui").setEnabled(true);
				this.getView().byId("smartFilterBar").getControlByKey("Exceptindicator3").setEnabled(true);
				this.getView().byId("smartFilterBar").getControlByKey("Uap").setEnabled(true);
				this.getView().byId("smartFilterBar").getControlByKey("Ligneprod").setEnabled(true);
				this.getView().byId("smartFilterBar").getControlByKey("Product").setEnabled(true);
			}
		},
		onEdit: function (oEvent) {
			var oObject;
			if (this.getView().byId("idInnerTable").getSelectedItem() === null) {
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("ModifyRowData"));
			} else {
				oObject = this.getView().byId("idInnerTable").getSelectedItem().getBindingContext().getObject();
				this._EditDialog = sap.ui.xmlfragment("com.safran.ewm.zewm_staging_re.view.fragments.EditValue", this);
				this.getView().addDependent(this._EditDialog);
				this._EditDialog.open();
				if (oObject.Confirmeddate != "") {
					sap.ui.getCore().byId("idNewConfirmedDate").setDateValue(oObject.Confirmeddate);
				}
				sap.ui.getCore().byId("idNewComments").setValue(oObject.Comments);
			}
		},
		onSave: function () {
			var that = this;
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var oObject = this.getView().byId("idInnerTable").getSelectedItem().getBindingContext().getObject();
			oObject.Confirmeddate = sap.ui.getCore().byId("idNewConfirmedDate").getDateValue();
			oObject.Confirmeddate = dateFormat.format(new Date(oObject.Confirmeddate));
			oObject.Confirmeddate = oObject.Confirmeddate + "T00:00:00";
			oObject.Comments = sap.ui.getCore().byId("idNewComments").getValue();
			var oCreateModel = this.getOwnerComponent().getModel();
			sap.ui.core.BusyIndicator.show();
			oCreateModel.create("/TableEntitySet", oObject, {
				method: "PUT",
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					MessageBox.success(that.getView().getModel("i18n").getResourceBundle().getText("SaveMsg"));
					that._EditDialog.close();
					that._EditDialog.destroy();
					that.getView().byId("smartFilterBar").fireSearch();
				},
				error: function (oResponse) {
					sap.ui.core.BusyIndicator.hide();
					that._EditDialog.close();
					that._EditDialog.destroy();
					MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("SaveErrorMsg"));
					that.getView().byId("smartFilterBar").fireSearch();
				}
			});
		},
		onClose: function () {
			this._EditDialog.close();
			this._EditDialog.destroy();
		},
		onDisplay: function (oEvent) {
			var oObject;
			if (this.getView().byId("idInnerTable").getSelectedItem() === null) {
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("SelectRowData"));
			} else {
				oObject = this.getView().byId("idInnerTable").getSelectedItem().getBindingContext().getObject();
				var selectedData = oObject;
				var tempjsonString = JSON.stringify(selectedData);
				var jsonstring = tempjsonString.replace(/\//g, "@");
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("View2", {
					"entity": JSON.stringify(jsonstring)
				});
			}
		},
	});
});