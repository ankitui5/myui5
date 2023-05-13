jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.model.Sorter");
jQuery.sap.require("ztestplanedit.util.Formatte");
var that;

sap.ui.controller("ztestplanedit.view.S1", {


onInit: function(){
		sap.ui.core.UIComponent.getRouterFor(this).getRoute(
		"S1").attachMatched(this._onRoute, this);
		jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("ztestplanedit.css.style", ".css"));
		
		//set initial date in input field
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyyy"});
		
		var date = new Date(), y = date.getFullYear(), m=date.getMonth();
		var firstDay = new Date(y,m,1);
		var currentDate = new Date;
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
		this.fromDate = dateFormat.format(firstDay)+"T00:00:00";
		this.toDate = dateFormat.format(currentDate)+"T00:00:00";
		currentDate = oDateFormat.format(currentDate);
		firstDay = oDateFormat.format(firstDay);
		
		var initialDateValue = firstDay + " - "  + currentDate;
		/*this.getView().byId("idPlnDate").setValue(initialDateValue);*/
		//changed by bhushan(16-sep-2019)
		this.getView().byId("fromDate").setValue().setMaxDate(new Date());
		this.getView().byId("toDate").setValue().setMaxDate(new Date());
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
					oViewObj.byId("idPlanStatus").setSelectedKey("PAPP");
				}
				else if(oData.PDC=="X"){
					oViewObj.byId("idPlanStatus").setSelectedKey("PAPR");
				}
				else{
					oViewObj.byId("idPlanStatus").setSelectedKey("APPR");
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
	////////////////////////////////////////////////////////////////////////////////////////////
	onClear : function()
	{
		debugger
		this.getView().byId("fromDate").setValue();
		this.getView().byId("toDate").setValue();
		this.getView().byId("idPlanStatus").setSelectedKey();
		this.getView().getModel("CartListSetJModel").setData();
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////

_onRoute: function(){
		//this.bindCartListSet();
},


				onSearch : function(){
				debugger;
				/*var VarPlnDate = this.getView().byId("idPlnDate").getValue();*/
				var status = this.getView().byId("idPlanStatus").getSelectedKey();
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
				
				var oViewObj = this.getView();
				var CartListSetJModel = oViewObj.getModel("CartListSetJModel");
				if (!CartListSetJModel) {
					CartListSetJModel = new sap.ui.model.json.JSONModel();
					oViewObj.setModel(CartListSetJModel, "CartListSetJModel");
				}
				
			
				if(dateFrom == "undefined-undefined-T00:00:00"){	
					var sPathCartListSet = "/GetTestPlanEditSet?$filter=Status eq '"+status+"' and  DateFrom  eq "+null+" and DateTo eq "+null+" and Uname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
					
					} else if(dateTo == "undefined-undefined-T00:00:00") {
						var sPathCartListSet = "/GetTestPlanEditSet?$filter=Status eq '"+status+"' and  DateFrom  eq datetime'"
						+dateFrom+"' and DateTo eq datetime'"+dateFrom+"' and Uname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
					}
					else{
						var sPathCartListSet = "/GetTestPlanEditSet?$filter=Status eq '"+status+"' and  DateFrom  eq datetime'"
						+dateFrom+"' and DateTo eq datetime'"+dateTo+"' and Uname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
						}
				
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
						//that_WL.onAfterRendering();
					});
				
},

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
			var status 	   = data.Status;
			
			var selectedData={};
			selectedData.planguid = planguid;
			selectedData.planrevno = planrevno;
			selectedData.planno = planno;
			selectedData.status = status;
			
			selectedData.reqguid = reqguid;
			selectedData.reqrevno = reqrevno;
			selectedData.reqno = reqno;
			selectedData.plandate = plandate;
			
			if (selectedData.status=='CLSD' || selectedData.status=='SHCL'){
				  sap.m.MessageToast.show("Request is already Closed");
				  return false
			}
			if (selectedData.status=='HOLD'){
				  sap.m.MessageToast.show("Request is on Hold");
				  return false
			}
			
			if( selectedData.status == 'HSUB')
			{
				sap.m.MessageToast.show("Subsequent Test Request is under approval");
				return false
			}	
			
			if (selectedData.status=='APPR'){
				  sap.m.MessageToast.show("Request is already Approved");
				  return false
			}		
			if (selectedData.status=='PAPR'){
				  sap.m.MessageToast.show("Request is already Approved");
				  return false
			}	
			
			
			var tempjsonString = JSON.stringify(selectedData);
			var jsonstring = tempjsonString.replace(/\//g, "@");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("S2",{"entity":JSON.stringify(jsonstring)});
},

OnPrint : function(e){
			debugger
			var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
			var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
			var planguid  = data.TestPlanGuid;
			var planrevno = data.PlanRevNo;
			
			sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/TestPlanOutputFormSet(PlanGuid='"+planguid+"',RevNo='"+planrevno+"')/$value", true);
			
},	
});
