
jQuery.sap.require("zreqedit.util.Formatter");
var that;
sap.ui.controller("zreqedit.view.S1", {


	onInit: function() {
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {

		}
		jQuery.sap
		.includeStyleSheet(jQuery.sap
				.getModulePath(
						"zreqedit.css.style",
						".css"));
		sap.ui.core.UIComponent.getRouterFor(this).getRoute(
		"page1").attachMatched(this._onRoute, this);
		
		that = this;
			//set initial date in input field
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyyy"});
		debugger
		var date = new Date(), y = date.getFullYear(), m=date.getMonth();
		var firstDay = new Date(y,m,1);
		var currentDate = new Date;
		// change by bhushan(25-sep-2019)
		this.getView().byId("fromDate").setMaxDate(currentDate);
		this.getView().byId("toDate").setMaxDate(currentDate);
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
		this.fromDate = dateFormat.format(firstDay)+"T00:00:00";
		this.toDate = dateFormat.format(currentDate)+"T00:00:00";
		currentDate = oDateFormat.format(currentDate);
		firstDay = oDateFormat.format(firstDay);
		
		var initialDateValue = firstDay + " - "  + currentDate;
		//changed by bhushan(16-sep-2019)
		this.getView().byId("fromDate").setValue();
		this.getView().byId("toDate").setValue();
		/*this.getView().byId("fromDate").setValue(firstDay);
		this.getView().byId("toDate").setValue(currentDate);*/
		this.onCheckReqStatus();
		
		
		
		
	},
	/////////////////////////////////////////////////////////////////////////////////////////////
	onCheckReqStatus : function(){
		debugger
		var that = this;
		 var user = new sap.ushell.services.UserInfo();
		 var uid = user.getId();
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
	_onRoute: function(){
		
	/*	this.bindCartListSet();*/
	},

	bindCartListSet: function(){
		var oViewObj = this.getView();
		var CartListSetJModel = oViewObj.getModel("CartListSetJModel");
		if (!CartListSetJModel) {
			CartListSetJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(CartListSetJModel, "CartListSetJModel");
		}
		var sPathCartListSet = "/GetTestRequestCartSet";
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
//			that_WL.onAfterRendering();
		});
	},
	
	displayRequest: function(e){
		var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
		var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
		var guid = data.TestGuid;
		var revno = data.RevNo;
		var status = data.Status;
		var reqId = data.TestRequestNumber;
		var selectedData={};
		selectedData.gUid = guid;
		selectedData.reqId = reqId;
		selectedData.revno = revno;
		selectedData.status = status;
		
		if (selectedData.status=='CLSD' || status === "SHCL"){
			  sap.m.MessageToast.show("Request is already Closed");
			  return false
		}
		if (selectedData.status=='HOLD'){
			  sap.m.MessageToast.show("Request is on Hold");
			  return false
		}
		
	
		if (selectedData.status=='APPR'){
			  sap.m.MessageToast.show("Request is already Approved");
			  return false
		}		
		if (selectedData.status=='PAPR'){
			  sap.m.MessageToast.show("Request is already Accepted");
			  return false
		}
		
		var tempjsonString = JSON.stringify(selectedData);
		var jsonstring = tempjsonString.replace(/\//g, "@");
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("page2",{"entity":JSON.stringify(jsonstring)});
	},
	
	
	bindMaterialListSet: function() {
		var oViewObj = this.getView();
		var Market = this.getView().byId("selectMarket").getSelectedKey();
		var PorodCat = this.getView().byId("selectProductCat").getSelectedKey();
	},
	
	
	validateHeaderDetails: function(){
		var valid = false;
		var Market = this.getView().byId("selectMarket");
		var testCat = this.getView().byId("selectTestcat");
	},
	
	
	onChangeTestCat: function(e){
		e.getSource().removeStyleClass("myStateError");
		var cat =  e.getSource().getSelectedKey();
		var ptqty = this.getView().byId("ptQtyCol");
		var ftqty = this.getView().byId("ftQtyCol");
		// Enable FT Quantity and PT Quantity in table (tyre details tab)
		if(cat == "05"){
			ptqty.setVisible(true);
			ftqty.setVisible(true);
		}else{
			ptqty.setVisible(false);
			ftqty.setVisible(false);
		}

	},

	///////////////////////////////////////
	onClear : function()
	{
		debugger
		this.getView().byId("fromDate").setValue();
		this.getView().byId("toDate").setValue();
		this.getView().byId("selectTestcat").setSelectedKey();
		this.getView().byId("idStatus").setSelectedKey();
		this.getView().byId("selectMarket").setSelectedKey();
		this.getView().getModel("CartListSetJModel").setData();
		
	},
	////////////////////////////////////////////

		handledatefrom: function(oEvent){
			
		    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
		    var from = oEvent.getSource().getProperty("dateValue");
		 //   var to = oEvent.getSource().getProperty("secondDateValue");
		    var dateVal = oEvent.getSource().getProperty("value");
		    if(from !== null){
		      this.dateFrom = dateFormat.format(from)+"T00:00:00";
		    }else{
		      if(dateVal !== ""){
		        var dateSplit = dateVal.split("-");
		        var fromDate = dateSplit[0].trim();
		        var fromSplit = fromDate.split(".");
		        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		        this.dateFrom = fValue+"T00:00:00";
		      }else{
		        this.dateFrom = null;
		      }
		    }
		},

				handledateto: function(oEvent){
			
		    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
		    var from = oEvent.getSource().getProperty("dateValue");
		 //   var to = oEvent.getSource().getProperty("secondDateValue");
		    var dateVal = oEvent.getSource().getProperty("value");
		    if(from !== null){
		      this.dateTo = dateFormat.format(from)+"T00:00:00";
		    }else{
		      if(dateVal !== ""){
		        var dateSplit = dateVal.split("-");
		        var fromDate = dateSplit[0].trim();
		        var fromSplit = fromDate.split(".");
		        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		        this.dateTo = fValue+"T00:00:00";
		      }else{
		        this.dateTo = null;
		      }
		    }
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
			
			
			
			
			/*if(fromDate > toDate){
				sap.m.MessageToast.show("From-date cannot be greater than To-date.");
				this.getView().byId("fromDate").setValueState("Error");
				//this.getView().byId("toDate").setValueState("Error");
				return false
				} else {
				this.getView().byId("fromDate").setValueState("None");
				//this.getView().byId("toDate").setValueState("None");
				}
			*/
			
			
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
		
			var oViewObj = this.getView();
			var CartListSetJModel = oViewObj.getModel("CartListSetJModel");
			if (!CartListSetJModel) {
				CartListSetJModel = new sap.ui.model.json.JSONModel();
				oViewObj.setModel(CartListSetJModel, "CartListSetJModel");
			}

			if(dateFrom == "undefined-undefined-T00:00:00"){	
				var sPathCartListSet = "/GetTestRequestEditSet?$filter=Market eq '"+market+"' and  DateFrom  eq "+null+" and DateTo eq "+null+" and TestCategory eq '"+ testcat + 
						"' and Status eq '" +status+ "' and Uname eq '" +sap.ushell.Container.getService("UserInfo").getId()+ "'";
				} else if(dateTo == "undefined-undefined-T00:00:00") {
				
					var sPathCartListSet = "/GetTestRequestEditSet?$filter=Market eq '"+market+"' and  DateFrom  eq datetime'"
					+dateFrom+"' and DateTo eq datetime'"+dateFrom+"' and TestCategory eq '"+ testcat + 
					"' and Status eq '" +status+ "' and Uname eq '" +sap.ushell.Container.getService("UserInfo").getId()+ "'";
				} else{	
				var sPathCartListSet = "/GetTestRequestEditSet?$filter=Market eq '"+market+"' and  DateFrom  eq datetime'"
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

	
				/*onClear : function()
					{
				  debugger;
					var oViewObj = this.getView();
					var CartListSetJModel = oViewObj.getModel("CartListSetJModel");
					if (!CartListSetJModel) {
						CartListSetJModel = new sap.ui.model.json.JSONModel();
						oViewObj.setModel(CartListSetJModel, "CartListSetJModel");
					}
					var sPathCartListSet = "/GetTestRequestCartSet";
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

					});
				 
			 },*/
//////////////////////////////////////////////////////////////////////////////////////////////////
			 
	OnPrint : function(e){
		debugger
		var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
		var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
		var guid = data.TestGuid;
		var revno = data.RevNo;
		var reqId = data.TestRequestNumber;
		
		sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/TestRequestOutputFormSet(ReqGuid='"+guid+"',RevNo='"+revno+"')/$value", true);
		
	},	

});