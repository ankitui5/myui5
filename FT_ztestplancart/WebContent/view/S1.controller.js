jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.model.Sorter");
var that;

sap.ui.controller("com.acute.ztestplancart.view.S1", {


onInit: function(){
	sap.ui.core.UIComponent.getRouterFor(this).getRoute(
	"S1").attachMatched(this._onRoute, this);
},
_onRoute: function(){
	
	this.bindCartListSet();
},
bindCartListSet: function(){
	debugger
	var oViewObj = this.getView();
	var CartListSetJModel = oViewObj.getModel("CartListSetJModel");
	if (!CartListSetJModel) {
		CartListSetJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(CartListSetJModel, "CartListSetJModel");
	}
	var filters = [];
	debugger
	var sPathCartListSet = "/GetTestPlanCartSet?$filter= Uname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
	var frameworkODataModel = this.getOwnerComponent().getModel();
	var oParamsCartListSet = {};
	oParamsCartListSet.context = "";
	oParamsCartListSet.urlParameters = "";
	oParamsCartListSet.success = function(oData, oResponse) { // success handler

		CartListSetJModel.setData(oData.results);
	};
	oParamsCartListSet.error = function(oError) { // error handler 
		jQuery.sap.log.error("read publishing group data failed");
		sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
	};
	frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
	frameworkODataModel.attachRequestCompleted(function() {
		//oViewObj.setModel(monthListSetJModel, "monthListSetJModel");
		that.onAfterRendering();
	});
},

OnPrint : function(e){
	debugger
	var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
	var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
	var planguid  = data.TestPlanGuid;
	var planrevno = data.PlanRevNo;
	
	sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/TestPlanOutputFormSet(PlanGuid='"+planguid+"',RevNo='"+planrevno+"')/$value", true);
	
},	

//change sumit
displayRequest: function(e){
	var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
	var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
	//var ReqGuid = data.TestRequestGuid;
	debugger
	var planguid  = data.TestPlanGuid;
	var planrevno = data.PlanRevNo;
	var planno    = data.TestPlanNumber;
	
	var reqguid    = data.TestRequestGuid;
	var reqrevno   = data.ReqRevNo;
	var reqno      = data.TestRequestNumber;
	var plandate   = data.TestPlanDate;
	
	var selectedData={};
	selectedData.planguid = planguid;
	selectedData.planrevno = planrevno;
	selectedData.planno = planno;
	
	selectedData.reqguid = reqguid;
	selectedData.reqrevno = reqrevno;
	selectedData.reqno = reqno;
	selectedData.plandate = plandate;
	
	
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g, "@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("S2",{"entity":JSON.stringify(jsonstring)});
},

});
