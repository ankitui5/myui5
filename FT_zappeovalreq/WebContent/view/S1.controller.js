
sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
	"zappeovalreq/util/Formatter"
	],
	
	function(MessageBox,Fragment,Controller, JSONModel,MessageToast) {

	return sap.ui.controller("zappeovalreq.view.S1", {


		onInit: function() {
			if (!jQuery.support.touch) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}
			if (sap.ui.Device.system.desktop) {

			}
			jQuery.sap
			.includeStyleSheet(jQuery.sap
					.getModulePath(
							"zappeovalreq.css.style",
							".css"));
			sap.ui.core.UIComponent.getRouterFor(this).getRoute(
			"page1").attachMatched(this._onRoute, this);
			
			//set initial date in input field
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyy"});
			
			var date = new Date(), y = date.getFullYear(), m=date.getMonth();
			var firstDay = new Date(y,m,1);
			var currentDate = new Date;
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
			this.fromDate = dateFormat.format(firstDay)+"T00:00:00";
			this.toDate = dateFormat.format(currentDate)+"T00:00:00";
			currentDate = oDateFormat.format(currentDate);
			firstDay = oDateFormat.format(firstDay);
			
			var initialDateValue = firstDay + " - "  + currentDate;
			//changed by bhushan(16-sep-2019)
			this.getView().byId("fromDate").setValue().setMaxDate(new Date());
			this.getView().byId("toDate").setValue().setMaxDate(new Date());
			this.onCheckReqStatus();
		},
		/////////////////////////////////////////////////////////////////////////////////////////////
		onCheckReqStatus : function(){
			debugger
			 var user = new sap.ushell.services.UserInfo();
			 var uid = user.getId();
			 var that = this;
				var oViewObj = this.getView();
				var CheckReqStatusJModel = oViewObj.getModel("CheckReqStatusJModel");
				if (!CheckReqStatusJModel) {
					CheckReqStatusJModel = new sap.ui.model.json.JSONModel();
					oViewObj.setModel(CheckReqStatusJModel, "CheckReqStatusJModel");
				}
				var sPathCheckReqStatus = "/GetUserInfoSet(Uname='"+uid+"')";
				var frameworkODataModel = this.getOwnerComponent().getModel();
				var oParamsCheckReqStatus = {};
				oParamsCheckReqStatus.context = "";
				oParamsCheckReqStatus.urlParameters = "";
				oParamsCheckReqStatus.success = function(oData, oResponse) { // success handler

					CheckReqStatusJModel.setData(oData);
					if(oData.PTG=="X"){
						oViewObj.byId("idStatus").setSelectedKey("PACT");
					}
					else if(oData.PDC=="X"){
						oViewObj.byId("idStatus").setSelectedKey("PAPR");
					}
					else{
						oViewObj.byId("idStatus").setSelectedKey("APPR");
					}
					that.onSearch();
				};
				oParamsCheckReqStatus.error = function(oError) { // error handler 
					jQuery.sap.log.error("read publishing group data failed");
					sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
				};
				frameworkODataModel.read(sPathCheckReqStatus, oParamsCheckReqStatus);
				frameworkODataModel.attachRequestCompleted(function() {

				});
			
			 
		},
		/////////////////////////////////////////////////////////////////////////////////////////////
		onClear : function()
		{
			debugger
			this.getView().byId("fromDate").setValue();
			this.getView().byId("toDate").setValue();
			this.getView().byId("idStatus").setSelectedKey();
			this.getView().byId("selectTestcat").setSelectedKey();
			this.getView().byId("selectMarket").setSelectedKey();
			this.getView().getModel("CartListSetJModel").setData();
		},
/////////////////////////////////////////////////////////////////////////////////////////////
		
		_onRoute: function(){
			
//			this.bindCartListSet();
		},
		
		
		handleDateChange: function(oEvent){
		    debugger
		    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
		    var from = oEvent.getSource().getProperty("dateValue");
		    var to = oEvent.getSource().getProperty("secondDateValue");
		    var dateVal = oEvent.getSource().getProperty("value");
		    
		    
		    if(from !== null){
		      this.fromDate = dateFormat.format(from)+"T00:00:00";
		    }else{
		      if(dateVal !== ""){
		        var dateSplit = dateVal.split("-");
		        var fromDate = dateSplit[0].trim();
		        var fromSplit = fromDate.split(".");
		        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		        this.fromDate = fValue+"T00:00:00";
		      }else{
		        this.fromDate = null;
		      }
		      
		    }
		    if(to !== null){
		      this.toDate = dateFormat.format(to)+"T00:00:00";
		    }else{
		      if(dateVal !== ""){
		        var dateSplit = dateVal.split("-");
		        var toDate = dateSplit[1].trim();
		        var toSplit = toDate.split(".");
		        var tValue = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
		        this.toDate = tValue+"T00:00:00";
		      }else{
		        this.toDate = null;
		      }
		      
		    }
		  
		  },		
		
		
		onPrint : function(e){
			debugger
			var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
			var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
			var guid = data.TestGuid;
			var revno = data.RevNo;
			var reqId = data.TestRequestNumber;
			
			sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/TestRequestOutputFormSet(ReqGuid='"+guid+"',RevNo='"+revno+"')/$value", true);
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
		
			var sPathCartListSet = "/GetTestRequestApproveSet?$filter=Uname eq '" +sap.ushell.Container.getService("UserInfo").getId()+ "'";
			
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
				//that.onAfterRendering();
			});
		},	
		
		displayRequest: function(e){
			var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
			var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
			var guid = data.TestGuid;
			var revno = data.RevNo;
			var status = data.Status;
			var level = data.Level;
			var reqId = data.TestRequestNumber;
			var selectedData={};
			selectedData.gUid = guid;
			selectedData.reqId = reqId;
			selectedData.revno = revno;
			selectedData.status = status;
			selectedData.level = level; 
			
			if(status == 'CLSD' || status == 'SHCL'){
				sap.m.MessageToast.show("Test Request is already closed.");
				return false
			}
			
			if(status == 'EDIT'){
				sap.m.MessageToast.show("Test Request is under modification.");
				return false
			}
			
			var tempjsonString = JSON.stringify(selectedData);
			var jsonstring = tempjsonString.replace(/\//g, "@");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("page2",{"entity":JSON.stringify(jsonstring)});
		},
		
		onSearch : function(){
			debugger
				//var dateVal = this.getView().byId("iddob2").getValue();
				var market = this.getView().byId("selectMarket").getSelectedKey();
				var testcat = this.getView().byId("selectTestcat").getSelectedKey();
				var status  = this.getView().byId("idStatus").getSelectedKey();
				var getDateFrom = this.getView().byId("fromDate").getValue();
				var getDateTo = this.getView().byId("toDate").getValue();
				var fromDate = Number(this.getView().byId("fromDate").getDateValue());
				var toDate = Number(this.getView().byId("toDate").getDateValue());
				
				if (fromDate == ""&& toDate !="")
				{
				this.getView().byId("fromDate").setValueState("Error");
				sap.m.MessageToast.show("From date can not be empty");
				return false;
				} else {
					this.getView().byId("fromDate").setValueState("None");
				}
				
				var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		            pattern : "dd-MM-yyyy"
				});
				
				var dateSplit = getDateFrom.split("-");
				var fromDate = dateSplit[0].trim();
				var fromSplit = fromDate.split(".");
				var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
				var dateFrom = fValue+"T00:00:00";
				
				var dateSplit1 = getDateTo.split("-");
				var toDate = dateSplit1[0].trim();
				var toSplit = toDate.split(".");
				var tValue = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
				var dateTo = tValue+"T00:00:00";

				var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		            pattern : "dd-MM-yyyy"
				});
				var oViewObj = this.getView();
				var CartListSetJModel = oViewObj.getModel("CartListSetJModel");
				if (!CartListSetJModel) {
					CartListSetJModel = new sap.ui.model.json.JSONModel();
					oViewObj.setModel(CartListSetJModel, "CartListSetJModel");
				}
						
		if(dateFrom == "undefined-undefined-T00:00:00"){	
		var sPathCartListSet = "/GetTestRequestApproveSet?$filter=Market eq '"+market+"' and  DateFrom  eq "+null+" and DateTo eq "+null+" and TestCategory eq '"+ testcat + 
								"' and Status eq '" +status+ "' and Uname eq '" +sap.ushell.Container.getService("UserInfo").getId()+ "'";
		} else if(dateTo == "undefined-undefined-T00:00:00") {
			var sPathCartListSet = "/GetTestRequestApproveSet?$filter=Market eq '"+market+"' and  DateFrom  eq datetime'"
			+dateFrom+"' and DateTo eq datetime'"+dateFrom+"' and TestCategory eq '"+ testcat + 
			"' and Status eq '" +status+ "' and Uname eq '" +sap.ushell.Container.getService("UserInfo").getId()+ "'";
		}
		else{
		var sPathCartListSet = "/GetTestRequestApproveSet?$filter=Market eq '"+market+"' and  DateFrom  eq datetime'"
		+dateFrom+"' and DateTo eq datetime'"+dateTo+"' and TestCategory eq '"+ testcat + 
		"' and Status eq '" +status+ "' and Uname eq '" +sap.ushell.Container.getService("UserInfo").getId()+ "'";
			}		
				var frameworkODataModel = this.getOwnerComponent().getModel(); 
				var oParamsCartListSet = {};
				oParamsCartListSet.context = "";
				oParamsCartListSet.urlParameters = "";
				oParamsCartListSet.success = function(oData, oResponse) { // success handler
					debugger;
					
					CartListSetJModel.setData(oData.results);
					
				};
				oParamsCartListSet.error = function(oError) { // error handler 
					jQuery.sap.log.error("read publishing group data failed");
					sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
				};
				frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
				frameworkODataModel.attachRequestCompleted(function() {
				});
	},

	});
});