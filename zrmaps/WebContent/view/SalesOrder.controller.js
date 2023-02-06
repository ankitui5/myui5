sap.ui.define([
	"sap/m/MessageBox",
	],
	
function(jQuery, MessageBox, Controller) {
	
return sap.ui.controller("zrmaps.view.SalesOrder", {
	
	onInit : function() {
		debugger
				
	},
	
/*	onOrderType:function(){
		debugger
		var sPath  = "/sap/opu/odata/sap/Y1_01_SRV/GetSalesOrderTypeSet";
		var jModel = new sap.ui.model.json.JSONModel();
		    jModel.loadData(sPath, null, false, "Get", false, false, null);
	
		var _valueHelpOrderTypeDialog = new sap.m.SelectDialog({

				title: "Sales Order",
				items: {
					path: "/d/results",
					template: new sap.m.StandardListItem({
						title: "{OrderType}",
						description: "{OrderTypeDesc}",
						customData: [new sap.ui.core.CustomData({
							key: "{OrderType}",
							value: "{OrderType}"
						})]

					})
				}, 
				liveChange: function(oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("OrderType", sap.ui.model.FilterOperator.Contains, sValue);
					var oFilter1 = new sap.ui.model.Filter("OrderTypeDesc", sap.ui.model.FilterOperator.Contains, sValue);
					var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
					
					oEvent.getSource().getBinding("items").filter([oFilter2]);
				},
				
				confirm: [this._handleOrderTypeClose, this],
				cancel: [this._handleOrderTypeClose, this]
			});
		_valueHelpOrderTypeDialog.setModel(jModel);
		_valueHelpOrderTypeDialog.open();
	},
	_handleOrderTypeClose:function(oEvent){
		debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		    if(oSelectedItem){
		    	this.getView().byId("idordertype").setValue(oSelectedItem.getTitle());
		    }
	},*/
	


	
	

	
});

});