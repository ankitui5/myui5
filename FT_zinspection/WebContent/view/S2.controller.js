sap.ui.define([ "sap/ui/model/json/JSONModel", "sap/m/UploadCollectionParameter" ],
function( JSONModel,UploadCollectionParameter) {
//    "use strict";

var that, TestPlanNumber, RegNo, TestMethod;
var FitmentDetailsJModel;
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("zinspection.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.core.mvc.Controller.extend("zinspection.view.S2",{

	onInit:function(){
		 sap.ui.core.UIComponent.getRouterFor(this).getRoute("S2").attachMatched(this._onRoute, this);
		 	
		    that=this;
			/*
			var fitmentTb1JModel = new sap.ui.model.json.JSONModel();
			fitmentTb1JModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			*/

			//this.bindGetTestRequest();
			this.bindStateSet();
			this.bindCustomerSet();
			this.bindMechanicalReasonSet();
			this.bindVehicleMakeSet();
			this.bindConfigurationSet();
			this.bindVehicleRegSet();
//			this.onVehicleMakeHelp();
			this.bindTyrePositionSet();
			this.ValidateFields();
//			this.bindMaterialSet();
			var idRouteTable = this.getView().byId("idRouteTable");

			debugger

			// create a JModel					
			this.FitmentDetails=[];
			FitmentDetailsJModel = new sap.ui.model.json.JSONModel();
			this.getView().byId("idFitmentDetailsTable2").setModel(FitmentDetailsJModel,"FitmentDetailsJModel");					
			FitmentDetailsJModel.setData(this.FitmentDetails);
			
			var vehicleEnableJModel = this.getView().getModel("vehicleEnableJModel");
			if (!vehicleEnableJModel) {
				vehicleEnableJModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(vehicleEnableJModel, "vehicleEnableJModel");
			}
			var enable = false;	
			vehicleEnableJModel.setData(enable);
			
			var fitmentTableModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(fitmentTableModel,"fitmentTableModel");
			this.fitArr = [];
			
			var data = {
					testMethod  : "",
					testMethodKey  :"",
					VehicleNo  : "",
					planNo : ""
			}
			var headersModel = new sap.ui.model.json.JSONModel();
			headersModel.setData(data);
			this.getView().setModel(headersModel,"headersModel");
			
			 // start of document upload
			var attachmentModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(attachmentModel,"attachmentModel");
			attachmentModel.setData([]);
			
			var oUploadModel = new sap.ui.model.json.JSONModel({
				items : []
			});
			
			this.getView().setModel(oUploadModel,"oUploadModel");
			// end of document upload
			
			//Set fitment Date to current date
//			var dt = new Date();
//			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd-MM-yyyy" });   
//			var dateFormatted = dateFormat.format(dt);
//			this.getView().byId("FFitmentDateEdit").setValue(dateFormatted);
			
	},
	
//validate fields//2-06-2019
	ValidateFields : function(){
		this.getView().byId("ChasisNoID").setEnabled(false);
		this.getView().byId("EngineNooID").setEnabled(false);
		this.getView().byId("FAvgRunningSpeedEdit").setEnabled(false);
		this.getView().byId("FLoopDistanceEdit").setEnabled(false);
		this.getView().byId("idEarApp1").setEnabled(false);
		this.getView().byId("idEarPSI").setEnabled(false);
		this.getView().byId("FGoodsCarriedEdit").setEnabled(false);
		this.getView().byId("FLWeatherIDMaxEdit").setEnabled(false);
		this.getView().byId("FLWeatherIDMinEdit").setEnabled(false);
		this.getView().byId("FRoadConditionEdit").setEnabled(false);
		this.getView().byId("FOFFRoadConditionEdit").setEnabled(false);
		this.getView().byId("FPrecipitationPercentageEdit").setEnabled(false);
		this.getView().byId("FRouteConditionEdit").setEnabled(false);
		this.getView().byId("FPreTyreDetailsEdit").setEnabled(false);
	//	this.getView().byId("idStateFrom").setEnabled(false);
	//	this.getView().byId("idStateTo").setEnabled(false);
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	_onRoute : function(e){
		debugger
		var that 				= this;
		var tempjsonString  	= e.getParameter("arguments").entity;
		var jsonstring 			= tempjsonString.replace(/@/g, "/");
		var tempSelectedData 	= JSON.parse(jsonstring);
		this.SelectedData  		= JSON.parse(tempSelectedData);
		TestPlanNumber = this.SelectedData.TestPlanNumber;
		RegNo = this.SelectedData.VehicleNo;
		TestMethod = this.SelectedData.TestMethodology;
		table = this.SelectedData.table;
		FitmentDetailsJModel.setData(table);
		
		this.getView().byId("idTestMethodology").setText(TestMethod);
		this.getView().byId("idHeaderLabel1").setText(TestPlanNumber);
		this.getView().byId("idVehicleNo").setText(RegNo);
		this.getView().byId("idHeaderLabel2").setText(TestPlanNumber);
	},
	
//////////////////////////////////////////////////////////////////////////////////////////////////
onVehicleDetails: function(){
	debugger
	var oView = this.getView();
	var regNo = oView.byId("FVehicleNoEdit").getValue();
	
	//for last 4 digits numeric-06-02-2019
	for(var i=regNo.length -1; i>regNo.length -4; i--){
	var j = regNo.charAt(i);
	if(isNaN(parseInt(j))){
	sap.m.MessageToast.show("Last four digits should be Numeric");
	return;
	} 
	}
	/////////
	
	var vehicleDetailsSetJModel = oView.getModel("vehicleDetailsSetJModel");
	if (!vehicleDetailsSetJModel) {
		vehicleDetailsSetJModel = new sap.ui.model.json.JSONModel();
		oView.setModel(vehicleDetailsSetJModel, "vehicleDetailsSetJModel");
	}
	var vehicleEnableJModel = oView.getModel("vehicleEnableJModel");
	if (!vehicleEnableJModel) {
		vehicleEnableJModel = new sap.ui.model.json.JSONModel();
		oView.setModel(vehicleEnableJModel, "vehicleEnableJModel");
	}
	var sPathVehicleDetailsSet = "/FitmentVehicleSet(RegNo='" + regNo + "')";
	var frameworkODataModel = this.getOwnerComponent().getModel();
	var oParamsVehicleDetailsSet = {};
	oParamsVehicleDetailsSet.context = "";
	oParamsVehicleDetailsSet.urlParameters = "";
	
	oParamsVehicleDetailsSet.success = function(oData, oResponse) {
		oData["MiloWork"]="";
		oData["MiloReading"]="";
		if(oData.Error == ""){
		var enable = false;	
		vehicleEnableJModel.setData(enable);
		}else{
		var enable = true;
		vehicleEnableJModel.setData(enable);
		}
		/*if(oData.StateFrom !== ""){
		that.onFromStateChange();
		}
		if(oData.StateTo !== ""){
		that.onToStateChange();
		}*/
		if(oData.MechCond !== ""){
		if(oData.MechCond == "N"){
		that.getView().byId("idReason").setVisible(true);
		that.getView().byId("idReasonLbl").setVisible(true);
		}else{
		that.getView().byId("idReason").setVisible(false);
		that.getView().byId("idReasonLbl").setVisible(false);
		}
		}
		vehicleDetailsSetJModel.setData(oData);
		
	};
	oParamsVehicleDetailsSet.error = function(oError) {
		jQuery.sap.log.error("No Data Found.");
		this.getView().byId("VehicleMakeID").setSelectedKey();
	}.bind(this);

	frameworkODataModel.read(sPathVehicleDetailsSet, oParamsVehicleDetailsSet);
	frameworkODataModel.attachRequestCompleted(function(){});
	
	this.setEnablefields();
},
//////////////////////////////////////////////////////////////////////////////////////////////////
	setEnablefields : function(){
	this.getView().byId("ChasisNoID").setEnabled(true);
	this.getView().byId("EngineNooID").setEnabled(true);
	this.getView().byId("FAvgRunningSpeedEdit").setEnabled(true);
	this.getView().byId("FLoopDistanceEdit").setEnabled(true);
	this.getView().byId("idEarApp1").setEnabled(true);
	this.getView().byId("idEarPSI").setEnabled(true);
	this.getView().byId("FGoodsCarriedEdit").setEnabled(true);
	this.getView().byId("FLWeatherIDMaxEdit").setEnabled(true);
	this.getView().byId("FLWeatherIDMinEdit").setEnabled(true);
	this.getView().byId("FRoadConditionEdit").setEnabled(true);
	this.getView().byId("FOFFRoadConditionEdit").setEnabled(true);
	this.getView().byId("FPrecipitationPercentageEdit").setEnabled(true);
	this.getView().byId("FRouteConditionEdit").setEnabled(true);
	this.getView().byId("FPreTyreDetailsEdit").setEnabled(true);
	this.getView().byId("idStateFrom").setEnabled(true);
	this.getView().byId("idStateTo").setEnabled(true);
	},

//////////////////////////////////////////////////////////////////////////////////////////////////
charNum: function(oEvent){
	debugger
	
	var text = oEvent.getSource().getValue();
	var code = text.charCodeAt(text.length-1);
	
	if ( !(code > 47 && code < 58) && // numeric (0-9)
	!(code > 64 && code < 91) && // upper alpha (A-Z)
	!(code > 96 && code < 123) )  // lower alpha (a-z)
	{
	text = text.substring( 0 , text.length - 1 );
	}			    
	this.getView().byId("FVehicleNoEdit").setValue(text.toUpperCase());
	},

//////////////////////////////////////////////////////////////////////////////////////////////////
//Changed by Ankit on 23 Jan 2019
	onCustomerName:function(){
	debugger
	that = this;
	var CartListSetJModel = new sap.ui.model.json.JSONModel();
	this._EntriesHelpDialog = sap.ui.xmlfragment("zinspection.view.Customer",this);
	this.getView().addDependent(this._entriesHelpDialog);
	this._EntriesHelpDialog.setModel(CartListSetJModel, "CartListSetJModel");
	this._EntriesHelpDialog.open();
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
onSearch:function(){
	debugger
	var phone = sap.ui.getCore().byId("idPhone1").getValue();
	var name  = sap.ui.getCore().byId("idInpCustomer").getValue();
	var type  = sap.ui.getCore().byId("idCustomerType").getSelectedKey();
	
	var that = this;
	
	var CartListSetJModel = this._EntriesHelpDialog.getModel("CartListSetJModel");			
	
	var sPathCartListSet = "/CustomerSet?$filter=Mobile1 eq '"+phone+"' and Name eq '"+name+"' and State eq '' and Type eq '"+type+"'";
							
	var frameworkODataModel = this.getOwnerComponent().getModel();
	var oParamsCartListSet = {};
	oParamsCartListSet.context = "";
	oParamsCartListSet.urlParameters = "";
	
	oParamsCartListSet.success = function(oData, oResponse) {
		CartListSetJModel.setData(oData.results);
	};
	
	oParamsCartListSet.error = function(oError) {
		jQuery.sap.log.error("Read/Publishing Group Data Failed.");
		sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
	};
	
	frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
	frameworkODataModel.attachRequestCompleted(function() {});
	
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
onCustomerfrgClose: function(evt){
	this._EntriesHelpDialog.close();
	this._EntriesHelpDialog.destroy(true);
},
	
displayRequest: function(e){
	var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
	var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
	
	this.getView().byId("idCustType").setSelectedKey(data.Type);
	this.getView().byId("idCustomerName").setValue(data.Name);
	this.getView().byId("idMobile1").setValue(data.Mobile1);
	this.getView().byId("idState").setValue(data.State);
	this.getView().byId("idLocation").setValue(data.Location);
	
	this.onCustomerfrgClose();
},

//////////////////////////////////////////////////////////////////////////////////////////////////
	bindVehicleMakeSet: function(){
		debugger
		var oView = this.getView();
		var VehicleMakeJModel = oView.getModel("VehicleMakeJModel");
		if (!VehicleMakeJModel) {
			VehicleMakeJModel = new sap.ui.model.json.JSONModel();
			oView.setModel(VehicleMakeJModel, "VehicleMakeJModel");
		}
		
		var sServiceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV";
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var sPathGetRouteSet = "/F4VehicleMakeSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsGetRouteSet = {};
		oParamsGetRouteSet.context = "";
		oParamsGetRouteSet.urlParameters = "";
		oParamsGetRouteSet.success = function(oData, oResponse) { // success handler
				
			VehicleMakeJModel.setData(oData.results);
			
		};
		oParamsGetRouteSet.error = function(oError) { // error handler 		
			jQuery.sap.log.error("Read/Publishing Group Data Failed.");
		}.bind(this);
		oReadModel.read(sPathGetRouteSet, oParamsGetRouteSet);
		oReadModel.attachRequestCompleted(function() {
			
		});
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	bindConfigurationSet: function(){
		debugger
		var oView = this.getView();
		var ConfigurationJModel = oView.getModel("ConfigurationJModel");
		if (!ConfigurationJModel) {
			ConfigurationJModel = new sap.ui.model.json.JSONModel();
			oView.setModel(ConfigurationJModel, "ConfigurationJModel");
		}
		var sPathGetRouteSet = "/F4VehicleConfigSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsGetRouteSet = {};
		oParamsGetRouteSet.context = "";
		oParamsGetRouteSet.urlParameters = "";
		oParamsGetRouteSet.success = function(oData, oResponse) { // success handler
				
			ConfigurationJModel.setData(oData.results);
			
		};
		oParamsGetRouteSet.error = function(oError) { // error handler 		
			jQuery.sap.log.error("Read/Publishing Group Data Failed.");
		}.bind(this);
		frameworkODataModel.read(sPathGetRouteSet, oParamsGetRouteSet);
		frameworkODataModel.attachRequestCompleted(function() {
			
		});
	},

//////////////////////////////////////////////////////////////////////////////////////////////////
		bindVehicleRegSet: function(){
		debugger
		var oView = this.getView();
		var GetVehicleRegSetJModel = oView.getModel("GetVehicleRegSetJModel");
		if (!GetVehicleRegSetJModel) {
		GetVehicleRegSetJModel = new sap.ui.model.json.JSONModel();
		oView.setModel(GetVehicleRegSetJModel, "GetVehicleRegSetJModel");
		}
		
		var sPathGetRouteSet = "/FitmentVehicleSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsGetRouteSet = {};
		oParamsGetRouteSet.context = "";
		oParamsGetRouteSet.urlParameters = "";
		oParamsGetRouteSet.success = function(oData, oResponse) { // success handler
		
		GetVehicleRegSetJModel.setData(oData.results);
		
		};
		oParamsGetRouteSet.error = function(oError) { // error handler 		
		jQuery.sap.log.error("Read/Publishing Group Data Failed.");
		}.bind(this);
		frameworkODataModel.read(sPathGetRouteSet, oParamsGetRouteSet);
		frameworkODataModel.attachRequestCompleted(function() {
		
		});
		
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
bindMechanicalReasonSet: function(){
			debugger
			var oView = this.getView();
			var mechanicalSetJModel = oView.getModel("mechanicalSetJModel");
			if (!mechanicalSetJModel) {
				mechanicalSetJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(mechanicalSetJModel, "mechanicalSetJModel");
			}
			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
			var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			var sPathGetRouteSet = "/F4_Mechanical_ReasonSet";
			var oParamsGetRouteSet = {};
			oParamsGetRouteSet.context = "";
			oParamsGetRouteSet.urlParameters = "";
			oParamsGetRouteSet.success = function(oData, oResponse) { // success handler
					
				mechanicalSetJModel.setData(oData.results);
				
			};
			oParamsGetRouteSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			oReadModel.read(sPathGetRouteSet, oParamsGetRouteSet);
			oReadModel.attachRequestCompleted(function() {
				
			});
		},
			
		
//////////////////////////////////////////////////////////////////////////////////////////////////
	bindCustomerSet: function(){
		debugger
		var oView = this.getView();
		var customerSetJModel = oView.getModel("customerSetJModel");
		if (!customerSetJModel) {
		customerSetJModel = new sap.ui.model.json.JSONModel();
		oView.setModel(customerSetJModel, "customerSetJModel");
		}
		var sPathGetRouteSet = "/CustomerSet?$filter= Mobile1 eq '' and Name eq '' and State eq '' and Type eq '' ";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsGetRouteSet = {};
		oParamsGetRouteSet.context = "";
		oParamsGetRouteSet.urlParameters = "";
		oParamsGetRouteSet.success = function(oData, oResponse) { // success handler
		
		customerSetJModel.setData(oData.results);				
		};
		oParamsGetRouteSet.error = function(oError) { // error handler 		
		jQuery.sap.log.error("Read/Publishing Group Data Failed.");
		}.bind(this);
		frameworkODataModel.read(sPathGetRouteSet, oParamsGetRouteSet);
		frameworkODataModel.attachRequestCompleted(function() {
		
		});
		},

//////////////////////////////////////////////////////////////////////////////////////////////////
bindStateSet: function(){
		debugger
		var oView = this.getView();
		var GetStateSetJModel = oView.getModel("GetStateSetJModel");
		if (!GetStateSetJModel) {
		GetStateSetJModel = new sap.ui.model.json.JSONModel();
		oView.setModel(GetStateSetJModel, "GetStateSetJModel");
		}
		
		var sPathGetRouteSet = "/F4RouteStateSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsGetRouteSet = {};
		oParamsGetRouteSet.context = "";
		oParamsGetRouteSet.urlParameters = "";
		oParamsGetRouteSet.success = function(oData, oResponse) { // success handler
		
		GetStateSetJModel.setData(oData.results);
		
		};
		oParamsGetRouteSet.error = function(oError) { // error handler 		
		jQuery.sap.log.error("Read/Publishing Group Data Failed.");
		}.bind(this);
		frameworkODataModel.read(sPathGetRouteSet, oParamsGetRouteSet);
		frameworkODataModel.attachRequestCompleted(function() {
		
		});
		
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////
		handleIconTabBarSelect: function(oEvent){
		debugger

			var key = oEvent.getSource().getSelectedKey();
			//var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
			//var length = idFitmentPlanTable.getSelectedItems().length;
			//var mandt = this.checkMandtVehicle();
			
			var vehNo = this.getView().byId("FVehicleNoEdit").getValue();
			var mechCond = this.getView().byId("idmccon").getSelectedKey();
			var miloWork = this.getView().byId("idEarPSI").getSelectedKey();
			var config = this.getView().byId("ConfigurationIDID").getSelectedKey();
			this.bindTyrePositionSet(config,vehNo);
					
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		bindTyrePositionSet: function(configCode, vehicleNo){
				var oView = this.getView();
				var TyrePositionJModel = oView.getModel("TyrePositionJModel");
				if (!TyrePositionJModel) {
					TyrePositionJModel = new sap.ui.model.json.JSONModel();
					oView.setModel(TyrePositionJModel, "TyrePositionJModel");
				}
				var sPathTyrePositionSet = "/TyrePositionsSet";
				var frameworkODataModel = this.getOwnerComponent().getModel();
				var filters = [];
				filters.push(new sap.ui.model.Filter("ConfigCode", sap.ui.model.FilterOperator.EQ, configCode));
				filters.push(new sap.ui.model.Filter("RegNo", sap.ui.model.FilterOperator.EQ, vehicleNo));
				
				var oParamsTyrePositionSet = {};
				oParamsTyrePositionSet.context = "";
				oParamsTyrePositionSet.filters = filters;
				oParamsTyrePositionSet.urlParameters = "";
				oParamsTyrePositionSet.success = function(oData, oResponse) {
				
					TyrePositionJModel.setData(oData.results);
				
				};
				oParamsTyrePositionSet.error = function(oError) {
					Query.sap.log.error("Read/Publishing Group Data Failed.");
				}.bind(this);
				
				frameworkODataModel.read(sPathTyrePositionSet, oParamsTyrePositionSet);
				frameworkODataModel.attachRequestCompleted(function() {
				
				});
			},
				
////////////////////////////////////////////////////////////////////////////////////////////////
				bindMaterialSet: function(tmpData, type){
					var getRequestDataJModel = this.getView().getModel("getRequestDataJModel");
					var requestData = getRequestDataJModel.getData();
					var materialJson = new sap.ui.model.json.JSONModel();
					var data = requestData.RequestHeadtoItemNvg.results;
					var matArr=[];
					for(var i=0;i<data.length;i++){
						if(data[i].Group == tmpData.TestGroup){
							var mat={};
							mat.Group=data[i].Group;
							mat.GroupDesc = data[i].GroupDesc;
							mat.Material = data[i].Maktx;
							if(type == "01"){
								mat.enabled = false;
							}else{
								mat.enabled = true;
							}
							matArr.push(mat);
						}
						if(tmpData.TestGroup !== tmpData.BmGroup){
							if(data[i].Group == tmpData.BmGroup){
								var mat={};
								mat.Group=data[i].Group;
								mat.GroupDesc = data[i].GroupDesc;
								mat.Material = data[i].Maktx;
								if(type == "01"){
									mat.enabled = false;
								}else{
									mat.enabled = true;
								}
								matArr.push(mat);
							}
						}
						
					}
					materialJson.setData(matArr);
					this.getView().setModel(materialJson,"materialJson");
//					var testKey = this.getView().getModel("headersModel").getData().testMethodKey;
//					var selectedModel = new sap.ui.model.json.JSONModel();
//					this.getView().setModel(selectedModel,"selectedModel");
//					var obj = {
//							selected : "",
//							enabled : true
//					}
//					if(testKey == "01"){
//						
//						obj.selected = matArr[0].Group;
//						obj.enabled = false;		
//					}
//					this.getView().getModel("selectedModel").setData(obj);
//					this.getView().getModel("selectedModel").refresh();
				},
//				onVehicleNoChange: function(oEvent){
//					var value = oEvent.getSource().getValue();
//					var headersModel = this.getView().getModel("headersModel");
//					var data1 = headersModel.getData();
//					data1.VehicleNo = value;
//					headersModel.refresh();
//				},
/////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////			
onFromStateChange:function(){
	debugger
	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'  ";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var valueHelpStateFormDialog = new sap.m.SelectDialog({
				title : "State",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
								title : "{Region}",
								customData : [ new sap.ui.core.CustomData({
											key : "RegionCode",
											value : "{Region}"
												
										}) ],
							}),
				},
	liveChange : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("Region",sap.ui.model.FilterOperator.Contains,sValue);
		oEvent.getSource().getBinding("items").filter([ oFilter ]);
	},
		
	confirm : [ this._handleStateHelpFrom, this ],
	cancel : [ this._handleStateHelpFrom, this ]
	});
	
	valueHelpStateFormDialog.setModel(jModel);
	valueHelpStateFormDialog.open();
},

_handleStateHelpFrom : function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
        	this.ClaimValue = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		    this.ClaimKey = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
	        this.getView().byId("idStateFrom").setValue(oSelectedItem.getTitle());
	        this.getView().byId("idDistrictFrom").setValue();
	        var obj = oSelectedItem.getBindingContext().getObject();
	        statefrom = obj.RegionCode;
	       
	   this.getView().byId("idDistrictFrom").setEnabled(true);
         }
 },
 
 
 onFromDistrictChange:function(){	    	 
	 var sPath="/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '"+statefrom+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var valueHelpDistrictHelpFrom = new sap.m.SelectDialog({
			
			title: "District",
			items: {
				path: "/d/results",
				template: new sap.m.StandardListItem({
					title: "{District}",
					customData: [new sap.ui.core.CustomData({
						key: "Key",
						value: "{District}"
					})]
				})
			},
			
			liveChange : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("District",sap.ui.model.FilterOperator.Contains,sValue);
				oEvent.getSource().getBinding("items").filter([ oFilter ]);
			},
				
			confirm : [ this._handleDistrictForm, this ],
			cancel : [ this._handleDistrictForm, this ]
			});
		
		valueHelpDistrictHelpFrom.setModel(jModel);
		valueHelpDistrictHelpFrom.open();	
	},
	_handleDistrictForm : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
	        if (oSelectedItem) {
	        	this.ClaimValue = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			    this.ClaimKey = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
		        this.getView().byId("idDistrictFrom").setValue(oSelectedItem.getTitle());
		        
	         }

 },

 onToStateChange: function(){
	 debugger
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'  ";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var valueHelpStateToDialog = new sap.m.SelectDialog({
					title : "State",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem({
									title : "{Region}",
									customData : [ new sap.ui.core.CustomData({
												key : "RegionCode",
												value : "{Region}"
													
											}) ],
								}),
					},
		liveChange : function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("Region",sap.ui.model.FilterOperator.Contains,sValue);
			oEvent.getSource().getBinding("items").filter([ oFilter ]);
		},
			
		confirm : [ this._handleStateToHelp, this ],
		cancel : [ this._handleStateToHelp, this ]
		});
		
		valueHelpStateToDialog.setModel(jModel);
		valueHelpStateToDialog.open();
	},
	
	_handleStateToHelp : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
	        if (oSelectedItem) {
	        	this.ClaimValue = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			    this.ClaimKey = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
		        this.getView().byId("idStateTo").setValue(oSelectedItem.getTitle());
		        this.getView().byId("idDistrictTo").setValue();
		        var obj = oSelectedItem.getBindingContext().getObject();
		        stateto = obj.RegionCode;
		       
		   this.getView().byId("idDistrictTo").setEnabled(true);
	         }
 },
 

 
onToDistrictChange: function(){
	// var sPath = "/sap/opu/odata/sap/YAPSDIGITEST_SRV/F4StateDistHelpSet?$filter=StateCode eq '"+statefrom+"'";
	 var sPath="/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '"+stateto+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var valueHelpDistrictToHelp = new sap.m.SelectDialog({
			
			title: "District",
			items: {
				path: "/d/results",
				template: new sap.m.StandardListItem({
					title: "{District}",
					customData: [new sap.ui.core.CustomData({
						//key: "Key",
						value: "{District}"
					})]
				})
			},
			
			liveChange : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("District",sap.ui.model.FilterOperator.Contains,sValue);
				oEvent.getSource().getBinding("items").filter([ oFilter ]);
			},
				
			confirm : [ this._handleDistrictTo, this ],
			cancel : [ this._handleDistrictTo, this ]
			});
		
		valueHelpDistrictToHelp.setModel(jModel);
		valueHelpDistrictToHelp.open();	
	},
	_handleDistrictTo : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
	        if (oSelectedItem) {
	        	this.ClaimValue = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			    this.ClaimKey = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
		        this.getView().byId("idDistrictTo").setValue(oSelectedItem.getTitle());
		        
	         }
},

//////////////////////////////////////////////////////////////////////////////////////////////////
onMiloMeter:function(evt){
	var key=evt.getSource().getSelectedKey();
	if(key=="Y"){
		this.getView().byId("idMilReading").setVisible(true);
	}else{
		this.getView().byId("idMilReading").setVisible(false).setValue("");
	}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
			vehicleTabSaveValidation: function(){
			var valid = true; 
			var mechCond = this.getView().byId("idmccon").getSelectedKey();
			var miloWork = this.getView().byId("idEarPSI").getSelectedKey();
			var idReason = this.getView().byId("idReason").getSelectedKey();
			var miloRead = this.getView().byId("idMilReading").getValue();
			var FitDate = this.getView().byId("FFitmentDateEdit").getDateValue();
			
			if(FitDate==null){
			valid = false;
			this.getView().byId("FFitmentDateEdit").setValueState("Error");
			}else{
			this.getView().byId("FFitmentDateEdit").setValueState("None");
			}
			
			var inputs = [			
			this.getView().byId("idCustomerName"),
			this.getView().byId("VehicleModelID"),
			this.getView().byId("FVehicleNoEdit"),
			this.getView().byId("FRegistrationYearEdit"),
			this.getView().byId("FVehicleCCEdit"),
			];
			jQuery.each(inputs, function(i, input) {
			if(input.getValue() == ""){
			valid = false;
			input.setValueState("Error");
			}else{
			input.setValueState("None");
			}
			});
			
			var selects = [			
			this.getView().byId("VehicleMakeID"),
			this.getView().byId("ConfigurationIDID"),
			this.getView().byId("idmccon"),
			this.getView().byId("idEarPSI"),
			];
			jQuery.each(selects, function(i, select) {
			if(select.getSelectedKey() == ""){
			valid = false;
			select.addStyleClass("myStateError");
			}else{
			select.removeStyleClass("myStateError");
			}
			});
			
			if(mechCond == "2"){
			if(idReason == ""){
			valid = false;
			this.getView().byId("idReason").addStyleClass("myStateError");
			}else{
			this.getView().byId("idReason").removeStyleClass("myStateError");
			}
			}
			if(miloWork == "Y"){
			if(miloRead == ""){
			valid = false;
			this.getView().byId("idMilReading").setValueState("Error");
			}else{
			this.getView().byId("idMilReading").setValueState("None");
			}
			}			
			return valid;
			},
			
			
//////////////////////////////////////////////////////////////////////////////////////////////////
			validateroute : function(){
			debugger
			var tbl = 	this.getView().byId("idRouteTable");
			var tblrow = tbl.getItems();
			var len = tblrow.length;
			var chk = true;
			for(var i=0; i<len; i++){
			
			for(var j=0; j<4; j++){	
			var ValAns = tblrow[i].getCells()[j].getValue();
			if(ValAns == ""){
			tblrow[i].getCells()[j].setValueState("Error");
			chk = false;
			}else{
			tblrow[i].getCells()[j].setValueState("None");
			}	
			}	
			}
			return chk;
			},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onReviewAndSave: function(){
			debugger
			var valid = this.vehicleTabSaveValidation();
			var chk   = this.validateroute();
			    if(!chk){
			    	return false
			    }
			var validFit = this.fitmentTabSaveValidation();
			var headerData = this.getView().getModel("headersModel").getData();
			var idFitmentDetailsTable2 = this.getView().byId("idFitmentDetailsTable2");
			var arr= [];
			
			if(headerData.testMethodKey == "02"){
				var items = idFitmentDetailsTable2.getItems();
				for(var i = 0; i<items.length ; i++){
					arr.push(items[i].getCells()[1].getSelectedKey());
				}
				
				var calc = arr.reduce(function (acc, curr) {
					  if (typeof acc[curr] == 'undefined') {
					    acc[curr] = 1;
					  } else {
					    acc[curr] += 1;
					  }
					  return acc;
					}, {});				
			}
			
			if(valid && validFit && chk){
				var payload = this.createPayload();
				this.onCreateFitmentSet(payload);
			}else{
				sap.m.MessageBox.alert(
						"Enter All Mandatory Fields", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
				});
				debugger
				if(!valid){
					this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("D");
					return false;
				}else if(!validFit){
					this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
					return false;
				}else if(!chk){
					this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("D");
					return false;	
				}
			}
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////
		createPayload: function(){
			var vehicleData   = this.getView().getModel("vehicleDetailsSetJModel").getData();
			var vehicleroute  = this.getView().byId("idRouteTable");
			var regNo = this.getView().byId("FVehicleNoEdit");
	
			var fitmentDate   = this.getView().byId("FFitmentDateEdit");
			var miloWorking   = this.getView().byId("idEarPSI");
			var idMilReading  = this.getView().byId("idMilReading");
			var makedesc      = this.getView().byId("idMilReading");
			var mobile        = this.getView().byId("idMobile1");
			
			var routeitem     = vehicleroute.getItems()[0];
			
			var fitmentDate = fitmentDate.getDateValue();
			if( fitmentDate !=null){
				fitmentDate = this.payLoadDate(fitmentDate);		
			 } 
			
			var vehCC= 0;
			if(vehicleData.VechCc !==""){
				vehCC = parseInt(vehicleData.VechCc);
			}else{
				vehCC= 0;
			}
			
			var fitVehicleArr = [];
			var fitVehicle = {
					RegNo : regNo.getValue(),
					LastMeterStatus : vehicleData.LastMeterStatus,
					Mobile1 : vehicleData.Mobile1,
					Name : vehicleData.Name,
					Type : vehicleData.Type,
					TypeDesc : vehicleData.TypeDesc,
					VehicleSeq : vehicleData.VehicleSeq,
					MakeDesc : vehicleData.MakeDesc,
					VehicleModel : vehicleData.VehicleModel,
					TotKmCovered : vehicleData.TotKmCovered,
					ConfigCode : vehicleData.ConfigCode,
					ConfigDesc : vehicleData.ConfigDesc,
					ChassisNo : vehicleData.ChassisNo,
					EngineNo : vehicleData.EngineNo,
					RegYear : vehicleData.RegYear,
					VechCc : vehCC,
					AvgSpeed : parseInt(vehicleData.AvgSpeed),
					LoopDist : parseInt(vehicleData.LoopDist),
					Gvw : parseInt(vehicleData.Gvw),
					MaxTemp : parseInt(vehicleData.MaxTemp),
					MinTemp : parseInt(vehicleData.MinTemp),
					OnRoad : parseInt(vehicleData.OnRoad),
					OffRoad : parseInt(vehicleData.OffRoad),
					Pricit : parseInt(vehicleData.Pricit),
					Terrain : vehicleData.Terrain,
					GoodsCarried : vehicleData.GoodsCarried,
					TyreDetails : vehicleData.TyreDetails,
					StateFrom : statefrom,
					DistrictFrom : routeitem.getCells()[1].getValue(),
					StateTo : stateto,
					DistrictTo : routeitem.getCells()[3].getValue(),
					MechCond : vehicleData.MechCond,
					MechCondReason : vehicleData.MechCondReason,
					MeterReading : vehicleData.MeterReading,
					
			}
			fitVehicleArr.push(fitVehicle);
			debugger
			var fitmentData= [];
			var fitmentDetailTable = this.getView().byId("idFitmentDetailsTable2").getModel("fitmentTableModel");
			fitmentData = this.createFitmentSaveObject(regNo.getValue(), fitmentDetailTable, fitmentData);
			//var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
			//var itemno = idFitmentPlanTable.getSelectedItems()[0].getCells()[9].getText();
			
			debugger
			var payload = {					
					PlanGuid : this.PlanGuid,
					PlanRevno : this.PlanRev,
					/*PlanItemNo : itemno,*/
					RegNo : regNo.getValue(),
					FitmentNo : "",
					InspNo : "",
					InspDt : null,
					FitmentDt : fitmentDate,
					MeterStatus : miloWorking.getSelectedKey(),
					MeterReading : parseInt(idMilReading.getValue()),
					KmCovered : 0,
					NavtoFitmentVehicle : fitVehicleArr,
					SaveMode : "F"
				}
			payload.NavtoFitmentDetail = fitmentData;
			return payload;
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onCreateFitmentSet: function(payload){
			    debugger
				var oView = this.getView();
				var sPathFitmentHeaderSet = "/FitmentHeaderSet";
				var frameworkODataModel = this.getOwnerComponent().getModel();
				var oParamsFitmentHeaderSet = {};
				oParamsFitmentHeaderSet.context = "";
				oParamsFitmentHeaderSet.urlParameters = "";
				
				oParamsFitmentHeaderSet.success = function(oData, oResponse) {					// success handler
					sap.m.MessageBox.show( "Fitment successfully created", {
					          icon: sap.m.MessageBox.Icon.INFORMATION,
					          title: "Information",
					          actions: [sap.m.MessageBox.Action.OK],
					          onClose: function(oAction) { 
					        	  window.history.go(-1);
					          }
					      });
	/*	*/		 
			    debugger		
				that.saveUploadedDocs(oResponse.data.PlanGuid,oResponse.data.FitmentNo,
										oResponse.data.PlanRevno,oResponse.data.RegNo,
										oResponse.data.PlanItemNo);         	// document upload
			    
	/*	*/	
				};
				
				oParamsFitmentHeaderSet.error = function(oError) { // error handler 		
					jQuery.sap.log.error("Read/Publishing Group Data Failed.");
				}.bind(this);

				frameworkODataModel.create(sPathFitmentHeaderSet, payload, oParamsFitmentHeaderSet);

				frameworkODataModel.attachRequestCompleted(function() {
					
				});
			},
//////////////////////////////////////////////////////////////////////////////////////////////////
			payLoadDate: function(SDateValue) {
				var str = "T00:00:00";
				var currentTime = new Date(SDateValue);
				var month = currentTime.getMonth() + 1;
				if(month.toString().length == 1)
					month = "0" + month;
				var day = currentTime.getDate();
				if(day.toString().length == 1)
					day = "0" + day;
				var year = currentTime.getFullYear();
				var date = year + "-" + month + "-" + day + str;
				return date;
				},
//////////////////////////////////////////////////////////////////////////////////////////////////
				createFitmentSaveObject: function(vehNo, model,fitmentData ){
						var data =  model.getData();
						//var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
						//var itemno = idFitmentPlanTable.getSelectedItems()[0].getCells()[9].getText();
						var fitTbl = this.getView().byId("idFitmentDetailsTable2").getItems();
						for(var i=0;i<data.length; i++){
							var obj={}
							obj.PlanGuid = this.PlanGuid;
							obj.PlanRevno = this.PlanRev;
							//obj.PlanItemNo = itemno;
							obj.RegNo = vehNo;
							obj.TyrePosition = data[i].Position;;
							obj.RemoveOk = "O";
							obj.StnclNumber = data[i].StencilNo;
							obj.GroupType = fitTbl[i].getCells()[1].getSelectedKey();
							obj.IpCondition = data[i].IpCondition;
							obj.IpPsi = parseInt(data[i].IpPsi);
							obj.Hardness = data[i].Hardness;
							obj.OrgNsd = data[i].OrigNsd;
							
							if(data[i].G1Nsd == ""  || data[i].G1Nsd == undefined){
								obj.G1Nsd="00.0";
							}else{
								obj.G1Nsd = data[i].G1Nsd;
							}
							if(data[i].G2Nsd == "" || data[i].G2Nsd == undefined){
								obj.G2Nsd="00.0";
							}else{
								obj.G2Nsd = data[i].G2Nsd;
							}
							if(data[i].G3Nsd == "" || data[i].G3Nsd == undefined){
								obj.G3Nsd="00.0";
							}else{
								obj.G3Nsd = data[i].G3Nsd;
							}
							if(data[i].G4Nsd == "" || data[i].G4Nsd == undefined){
								obj.G4Nsd="00.0";
							}else{
								obj.G4Nsd = data[i].G4Nsd;
							}
							if(data[i].G5Nsd == "" || data[i].G5Nsd == undefined){
								obj.G5Nsd="00.0";
							}else{
								obj.G5Nsd = data[i].G5Nsd;
							}
							if(data[i].G6Nsd == "" || data[i].G6Nsd == undefined){
								obj.G6Nsd="00.0";
							}else{
								obj.G6Nsd = data[i].G6Nsd;
							}
							
							var OrigNsd = obj.OrgNsd;
							
							var diffnsd = parseFloat(OrigNsd) - parseFloat(data[i].MinimumNSD);
							var wear;
							
							Wear = ( diffnsd / ( parseFloat(OrigNsd) - 0.8)) * 100;
							
							obj.MinNsd = "" + data[i].MinimumNSD + "";
							obj.Wear = wear;
							obj.MilageProj = 0;
							obj.Remarks= data[i].Remarks;
							fitmentData.push(obj);
						}
						return fitmentData;
				},
//////////////////////////////////////////////////////////////////////////////////////////////////
		fitmentTabSaveValidation: function(){
				var validFit = true;
				var idFitmentDetailsTable2 = this.getView().byId("idFitmentDetailsTable2");
				var items = idFitmentDetailsTable2.getItems();
				if (items.length == 0){
					validFit=false;
				}
				for(var i = 0; i<items.length ; i++){
					for(var j=0;j<1;j++){
						if(j==0){
							if(items[i].getCells()[j].getSelectedKey() == ""){
								items[i].getCells()[j].addStyleClass("myStateError");
								validFit=false;
							}else{
								items[i].getCells()[j].removeStyleClass("myStateError");
							}
						}
						if(j==1){
							if(items[i].getCells()[j].getValue() == ""){
								items[i].getCells()[j].addStyleClass("myStateError");
								validFit=false;
							}else{
								items[i].getCells()[j].removeStyleClass("myStateError");
							}
						}
						
						/*if(j==2){
							if(items[i].getCells()[j].getValue() == ""){
								items[i].getCells()[j].setValueState("Error");
								validFit=false;
							}else{
								items[i].getCells()[j].setValueState("None");
							}
						}*/
						
						/*if(j==3){
							if(items[i].getCells()[j].getType() != "Accept"){
								items[i].getCells()[j].setType("Reject");
								validFit=false;
							}else{
								items[i].getCells()[j].setType("Accept");	
							}
						}*/
					}
				}
				return validFit;
				
		},

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		onDeleteFitmentRow: function(oEvent){
			var path = oEvent.getSource()._getBindingContext("fitmentTableModel").getPath().split('/')[1];
			var fitmentTable=this.getView().byId("idFitmentDetailsTable2"); 

			if (path !== -1) {
				fitmentTable.getModel("fitmentTableModel").getData().splice(path,1);
				fitmentTable.getModel("fitmentTableModel").refresh();
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
materialChange: function(oEvent){
			
			debugger
			
			var idFitmentDetailsTable2 = this.getView().byId("idFitmentDetailsTable2");
			var headerData = this.getView().getModel("headersModel").getData();
			var rowModel = this.getView().getModel("rowModel");
			var length = 0;
			var tblLength = idFitmentDetailsTable2.getItems().length;
			var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
			
			var items = idFitmentDetailsTable2.getItems();
			
			var testtyre    = rowModel.getData().TestGroup;
			var testtyreqty = rowModel.getData().TestTyreRFitQty;
			var bmtyre      = rowModel.getData().BmGroup;
			var bmtyreqty   = rowModel.getData().BMTyreRFitQty;
			
			if(headerData.testMethodKey == "02"){
			var itab2 = []; 
			if (items.length > 0){
			for(var i=0;i<tblLength;i++){
			  var lv_exist = false;
			  if (itab2.length>0){
              for(var j=0;j<itab2.length;j++){
               	if (items[i].getCells()[1].getSelectedKey() == itab2[j].tyretype ){
               	  lv_exist = true;
               	  itab2[j].qty = parseInt( itab2[j].qty ) + 1; 
               	} 
              } 
              if(lv_exist == false){
            		var obj = {};  
					obj.tyretype = items[i].getCells()[1].getSelectedKey();
					obj.qty = 1;
					itab2.push(obj);
              }
		     }
			  else{
				var obj = {};  
					obj.tyretype = items[i].getCells()[1].getSelectedKey();
					obj.qty = 1;
					itab2.push(obj); 
			  } 
			}
							
			/*for(var j=0;j<itab2.length;j++){
			 if (itab2[j].tyretype == testtyre && parseInt( itab2[j].qty ) > parseInt( testtyreqty ) ){
				 sap.m.MessageToast.show("Exceeds Test Tyre fitment qty");
					return false; 
			 }	
			 if (itab2[j].bmtype == bmtyre && parseInt( itab2[j].qty ) > parseInt( bmtyreqty )){
				 sap.m.MessageToast.show("Exceeds BM Tyre fitment qty");
					return false; 
			 }	
			}*/
			for(var j=0;j<itab2.length;j++){
				 if (itab2[j].tyretype == testtyre && parseInt( itab2[j].qty ) > parseInt( testtyreqty ) ){
					sap.m.MessageToast.show("Exceeds Test Tyre fitment qty");
					oEvent.getSource().setSelectedKey("");
					return false; 
				 }	
				 if (itab2[j].tyretype == bmtyre && parseInt( itab2[j].qty ) > parseInt( bmtyreqty )){
					sap.m.MessageToast.show("Exceeds BM Tyre fitment qty");
					oEvent.getSource().setSelectedKey("");
					return false; 
				 }	
				}
			}
			}
	
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onPostionChange: function(oEvent){
			
			var headersModel =  this.getView().getModel("headersModel").getData();
			var method = headersModel.testMethodKey;

				var idFitmentDetailsTable2 = this.getView().byId("idFitmentDetailsTable2");
				var index=idFitmentDetailsTable2.getItems().indexOf(oEvent.getSource().getParent());
				var items = idFitmentDetailsTable2.getItems();
				var arr = [];
//Changed on April 23				
				for(var i=0;i<items.length;i++){
					if(items[i].getCells()[0].getSelectedKey() != ""){
						var key = items[i].getCells()[0].getSelectedKey();
						arr.push(key);
					}
				}				
//				
				let unique_array = []
			    for(let i = 0;i < arr.length; i++){
			        if(unique_array.indexOf(arr[i]) == -1){
			            unique_array.push(arr[i])
			        }
			    }
				
				if(arr.length > unique_array.length){
					sap.m.MessageToast.show("Position already selected, please select another position.");
					oEvent.getSource().setSelectedKey("");
				}
				
				//clear next field on change of position of that row
				if(items[index].getCells()[1].getEnabled()){
					items[index].getCells()[1].setSelectedKey("");
				}
				
				//items[index].getCells()[2].setValue("");

		},
//////////////////////////////////////////////////////////////////////////////////////////////////
			onF4Stencil: function(oEvent){
			debugger
			this.stencil = oEvent.getSource().getId(); 
			var sPath="/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4StencilSet";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false, false, null);
			var valueHelpF4Stencil = new sap.m.SelectDialog({
			
			title: "Stencil",
			items: {
			path: "/d/results",
			template: new sap.m.StandardListItem({
			title: "{Stencil}",
			customData: [new sap.ui.core.CustomData({
			//key: "Key",
			value: "{Stencil}"
			})]
			})
			},
			
			liveChange : function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("Stencil",sap.ui.model.FilterOperator.Contains,sValue);
			oEvent.getSource().getBinding("items").filter([ oFilter ]);
			},
			
			confirm : [ this._handleStencil, this ],
			cancel : [ this._handleStencil, this ]
			});
			
			valueHelpF4Stencil.setModel(jModel);
			valueHelpF4Stencil.open();	
			},
			_handleStencil : function(oEvent) {
				debugger
				var oSelectedItem = oEvent.getParameter("selectedItem");
				var stencilNo = sap.ui.getCore().byId(this.stencil);
				if (oSelectedItem) {
	            stencilNo.getParent().getCells()[1].setValue(oSelectedItem.getTitle());
//				stencilNo.getParent().getCells()[2].setValue(oSelectedItem.getTitle())
				}
			},
///////////////////////////////////////////fitment tab code///////////////////////////////////////////////////////
		/*********************************************Using Button Add a New Row*******************************************/
		addFitmentRow:function(){
			debugger
			var Data = {};
			var FitmentTbl  = this.getView().byId("idFitmentDetailsTable2");
			var FitmentData = FitmentTbl.getModel("FitmentDetailsJModel").getData();
			this.FitmentID = FitmentTbl.getModel("FitmentDetailsJModel").getData();
			var len = FitmentTbl.getItems().length;
			Data.Position		= "";
			Data.Material		= "";
			Data.Stencil		= "";
			var data = FitmentTbl.getModel("FitmentDetailsJModel").getData();							
			this.FitmentID.push(Data);
			FitmentTbl.getModel("FitmentDetailsJModel").setData(this.FitmentID);
			FitmentTbl.getModel("FitmentDetailsJModel").refresh()
			var UsageFTDetailTableCount = FitmentTbl.getModel("FitmentDetailsJModel").getData().length;
			},
/***************************************************************************************************************************/							
		
			onDeleteFitmentRow: function(oEvent){
				var path = oEvent.getSource()._getBindingContext("FitmentDetailsJModel").getPath().split('/')[1];
				var fitmentTable=this.getView().byId("idFitmentDetailsTable2"); 
				if (path !== -1) {
			    	 fitmentTable.getModel("FitmentDetailsJModel").getData().splice(path,1);
			    	 fitmentTable.getModel("FitmentDetailsJModel").refresh();
			     }
			},
			
////////////////////////////////////////////open reading fragment//////////////////////////////////////////////////////////////			
			onReadingPress:function(){
				that = this;
				var CartListSetJModel = new sap.ui.model.json.JSONModel();
				this._EntriesHelpDialog = sap.ui.xmlfragment("zinspection.view.Reading",this);
				this.getView().addDependent(this._entriesHelpDialog);
				this._EntriesHelpDialog.setModel(CartListSetJModel, "CartListSetJModel");
				this._EntriesHelpDialog.open();
			},
			onSaveReading:function(){
				this._EntriesHelpDialog.close();
				this._EntriesHelpDialog.destroy();
			},
			onReadingClose:function(){
				this._EntriesHelpDialog.close();
				this._EntriesHelpDialog.destroy();
			},
//////////////////////////////////////////////////////////////////////////////////////////////////
/*			onSaveReading: function(e){
				debugger
				var checkEmpty   = false;
				var checkNSD     = false;
				var readingModel = this._ReadingDialog.getModel("readingModel");
				var data = readingModel.getData();
				var fitmentTableModel = this.getView().getModel("fitmentTableModel");
				var index = fitmentTableModel.getData()[this.readingPath];			
			
				var grooveNo = parseInt(readingModel.getData().GrooveNumbers);
				var org      = sap.ui.getCore().byId("idOriNsd").getValue();			
			
				var grooves = [
					
					sap.ui.getCore().byId("idGrooveG1"),
					sap.ui.getCore().byId("idGrooveG2"),
					sap.ui.getCore().byId("idGrooveG3"),
					sap.ui.getCore().byId("idGrooveG4"),
					sap.ui.getCore().byId("idGrooveG5"),
					sap.ui.getCore().byId("idGrooveG6"),				
				];
				
				jQuery.each(grooves, function(i, input) {
					if(grooveNo > i){
						if(input.getValue() < 1){
							input.setValueState("Error");
							 checkEmpty = true;
						}else{
							input.setValueState("None");
						}
					}
				});	
				
				var garr=[];
				jQuery.each(grooves, function(i, input) {
					if(grooveNo > i){
						if(input.getValue() > 1){
							garr.push(input.getValue());
						}
					}
				});
				
				var inputs = [
					sap.ui.getCore().byId("idOriNsd"),
					sap.ui.getCore().byId("idEarCon12"),
					sap.ui.getCore().byId("idHardness")
				];
				jQuery.each(inputs, function(i, input) {
					if(input.getValue() == ""){
						input.setValueState("Error");
						 checkEmpty = true;
					}else{
						input.setValueState("None");
					}
				});
				
				var inflaPress  = sap.ui.getCore().byId("idEarSped12");
				if(inflaPress.getSelectedKey()==""){
					checkEmpty = true;
					inflaPress.addStyleClass('myStateError');
				}else{
					inflaPress.removeStyleClass('myStateError');
				}

				if(checkEmpty){
					sap.m.MessageToast.show("Please enter mandatory fields.");
					return false;}
				
				jQuery.each(grooves, function(i, input) {
					if(grooveNo > i){
						if(input.getValue() > parseFloat(org)){
							input.setValueState("Error");
							 checkNSD = true;
						}else{
							input.setValueState("None");
						}
					}				
				});	
				
				if(checkNSD){
					sap.m.MessageToast.show("Groove value can't exceed original NSD");
					return false;
				}				
			
					var g1 = sap.ui.getCore().byId("idGrooveG1");
					var g2 = sap.ui.getCore().byId("idGrooveG2");
					var g3 = sap.ui.getCore().byId("idGrooveG3");
					var g4 = sap.ui.getCore().byId("idGrooveG4");
					var g5 = sap.ui.getCore().byId("idGrooveG5");
					var g6 = sap.ui.getCore().byId("idGrooveG6");
					var infla = sap.ui.getCore().byId("idEarSped12");
					var psi = sap.ui.getCore().byId("idEarCon12");
					var hard = sap.ui.getCore().byId("idHardness");
					var min = Math.min.apply(null,garr);
					//var minNsd = sap.ui.getCore().byId("idMinNsd");
					var remarks = sap.ui.getCore().byId("idRemarks");
					var orgNsd = sap.ui.getCore().byId("idOriNsd");
					
					index.IpCondition  = infla.getSelectedKey();
					index.IpPsi = psi.getValue();
					index.Hardness = hard.getValue();
					index.OrigNsd = orgNsd.getValue();		
					index.G1Nsd = g1.getValue();
					index.G2Nsd = g2.getValue();
					index.G3Nsd = g3.getValue();
					index.G4Nsd = g4.getValue();
					index.G5Nsd = g5.getValue();
					index.G6Nsd = g6.getValue();
					index.MinimumNSD = min;
					index.Remarks = remarks.getValue();
					this._ReadingDialog.close();
				
					that.Button.setType("Accept");	
			},
			onReadingClose: function(){
				debugger
				this._ReadingDialog.close();
				
			},
			*/
			
			/*
			onReadingPress: function(oEvent){
				var that = this;
				that.Button=oEvent.getSource();
				this.readingPath = oEvent.getSource()._getBindingContext("fitmentTableModel").getPath().split('/')[1];
				var idFitmentDetailsTable2 = this.getView().byId("idFitmentDetailsTable2");
				var cells = idFitmentDetailsTable2.getItems()[this.readingPath].getCells();
				if(cells[0].getSelectedKey() == "" || cells[1].getSelectedKey() == "" ||  cells[2].getValue() == ""){
					
					if(cells[0].getSelectedKey() == ""){
						cells[0].setValueState("Error");
					}
					if(cells[1].getSelectedKey() == ""){
						cells[1].setValueState("Error");
					}
					if(cells[2].getValue() == ""){
						cells[2].setValueState("Error");
					}
					
					sap.m.MessageToast.show("Please fill all mandatory fields to enter readings.");
					return false;
				}
				
//				code added for to get Groove Data from request data set based on Group
				var requestDataSetModel = this.getView().getModel("getRequestDataJModel");
				var requestData  = requestDataSetModel.getData().RequestHeadtoItemNvg.results;
				var rowModel = this.getView().getModel("rowModel");
				var selectedGroup = cells[1].getSelectedKey();
				var headerData = this.getView().getModel("headersModel").getData();
				
				var readingModel = new sap.ui.model.json.JSONModel();
				
				if(headerData.testMethodKey == "02"){
					selectedGroup = rowModel.getData().TestGroup;
				}else if(headerData.testMethodKey == "01"){
					selectedGroup = rowModel.getData().TestGroup;
				}
				
				for(var i=0;i<requestData.length;i++){
					if(requestData[i].Group == selectedGroup){
						readingModel.setData(requestData[i]);
					}
				}
				debugger
				var grooveNo = parseInt(readingModel.getData().GrooveNumbers);	
				var infnsd   = readingModel.getData().Infnsd;			
				var orignsd  = parseFloat(readingModel.getData().OrigNsd);

				if (!this._ReadingDialog) {
					this._ReadingDialog = sap.ui.xmlfragment(
						"zfltfitcreate2.view.Reading", this);
					this.getView().addDependent(this._ReadingDialog);
					
				}
				this._ReadingDialog.setTitle("Reading Details ("+cells[0].getSelectedKey()+")");
				this._ReadingDialog.open();
				
				
				var g1 = sap.ui.getCore().byId("idGrooveG1");
				var g2 = sap.ui.getCore().byId("idGrooveG2");
				var g3 = sap.ui.getCore().byId("idGrooveG3");
				var g4 = sap.ui.getCore().byId("idGrooveG4");
				var g5 = sap.ui.getCore().byId("idGrooveG5");
				var g6 = sap.ui.getCore().byId("idGrooveG6");
				var infla = sap.ui.getCore().byId("idEarSped12");
				var psi = sap.ui.getCore().byId("idEarCon12");
				var hard = sap.ui.getCore().byId("idHardness");
				var orgNsd = sap.ui.getCore().byId("idOriNsd");
				var minNsd = sap.ui.getCore().byId("idMinNsd");
				var remarks = sap.ui.getCore().byId("idRemarks");
				
				if(parseFloat(readingModel.getData().G1Nsd) <= 0){
					g1.setValue("");
				}
				if(parseFloat(readingModel.getData().G2Nsd) <= 0){
					g2.setValue("");
				}
				if(parseFloat(readingModel.getData().G3Nsd) <= 0){
					g3.setValue("");
				}
				if(parseFloat(readingModel.getData().G4Nsd) <= 0){
					g4.setValue("");
				}
				if(parseFloat(readingModel.getData().G5Nsd) <= 0){
					g5.setValue("");
				}
				if(parseFloat(readingModel.getData().G6Nsd) <= 0){
					g6.setValue("");
				}	
							
				var rowData = this.getView().getModel("fitmentTableModel").getData()[this.readingPath];
				if(rowData.OrigNsd !== ""){
					var tdata = rowData;
					g1.setValue(tdata.G1Nsd);
					g2.setValue(tdata.G2Nsd);
					g3.setValue(tdata.G3Nsd);
					g4.setValue(tdata.G4Nsd);
					g5.setValue(tdata.G5Nsd);
					g6.setValue(tdata.G6Nsd);
					infla.setSelectedKey(tdata.IpCondition);
					psi.setValue(tdata.IpPsi);
					minNsd.setValue(tdata.MinimumNSD);
					orgNsd.setValue(tdata.OrigNsd);
					hard.setValue(tdata.Hardness);
					remarks.setValue(tdata.Remarks);
				}else{
					g1.setValue(readingModel.getData().G1Nsd);
					g2.setValue(readingModel.getData().G2Nsd);
					g3.setValue(readingModel.getData().G3Nsd);
					g4.setValue(readingModel.getData().G4Nsd);
					g5.setValue(readingModel.getData().G5Nsd);
					g6.setValue(readingModel.getData().G6Nsd);
					infla.setSelectedKey("");
					psi.setValue("");
					minNsd.setValue("");
					orgNsd.setValue(readingModel.getData().OrigNsd);
					hard.setValue("");
					remarks.setValue("");
				}
				
				
				var inputs = [
					
					sap.ui.getCore().byId("idEarCon12"),
					sap.ui.getCore().byId("idHardness"),
					sap.ui.getCore().byId("idRemarks")

				];
				jQuery.each(inputs, function(i, input) {
					
						input.setValueState("None");
			
					
				});
				
				var inputs1 = [	
					sap.ui.getCore().byId("idGrooveG1"),
					sap.ui.getCore().byId("idGrooveG2"),
					sap.ui.getCore().byId("idGrooveG3"),
					sap.ui.getCore().byId("idGrooveG4"),
					sap.ui.getCore().byId("idGrooveG5"),
					sap.ui.getCore().byId("idGrooveG6")
					
				];
				jQuery.each(inputs1, function(i, input) {
						
						if(grooveNo > i){
							input.setVisible(true);
							input.setValueState("None");
						}			
				});
				var inputsLbl = [	
					sap.ui.getCore().byId("idGrooveG1Lbl"),
					sap.ui.getCore().byId("idGrooveG2Lbl"),
					sap.ui.getCore().byId("idGrooveG3Lbl"),
					sap.ui.getCore().byId("idGrooveG4Lbl"),
					sap.ui.getCore().byId("idGrooveG5Lbl"),
					sap.ui.getCore().byId("idGrooveG6Lbl")
					
				];
				jQuery.each(inputsLbl, function(i, input) {
						
						if(grooveNo > i){
							input.setVisible(true);
						}
								
				});
				
				if (infnsd=="X"){
					sap.ui.getCore().byId("idOriNsd").setEnabled(true);
				}else
				{	
					sap.ui.getCore().byId("idOriNsd").setEnabled(false);
				}
				
				var inflaPress  = sap.ui.getCore().byId("idEarSped12");
				inflaPress.removeStyleClass('myStateError');

				var status = sap.ui.getCore().byId("idStatus");
				status.removeStyleClass('myStateError');
				
				this._ReadingDialog.setModel(readingModel , "readingModel");
				
				this.checkMaxGroove();
			},*/
		
		/*
//Added on April 25		
			addFitmentRow: function(){
			debugger
			var idFitmentDetailsTable2 = this.getView().byId("idFitmentDetailsTable2");
			var headerData = this.getView().getModel("headersModel").getData();
			var rowModel = this.getView().getModel("rowModel");
			var length = 0;
			var tblLength = idFitmentDetailsTable2.getItems().length;
			var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
			
			var items = idFitmentDetailsTable2.getItems();
			var compIndex ;
			
			if(headerData.testMethodKey == "01"){
			var testType = idFitmentPlanTable.getSelectedItem().mAggregations.cells[1].mProperties.selectedKey;
			
			if(testType == "01"){
			if(compIndex == 0){
			length = this.CompQty;
			}else{
			length = rowModel.getData().TestTyreRFitQty;
			}
			
			}else if(testType == "02"){
			
			if(compIndex == 0){
			length = this.CompQty;
			}else{
			length = rowModel.getData().BMTyreRFitQty;
			}
			}
			
			if(length <= tblLength){
			sap.m.MessageToast.show("Exceeds tyre fitment");
			return false;
			}else{
			this.getFitmentTableObject();
			}
			
			}else if(headerData.testMethodKey == "02"){
			var testtyre    = rowModel.getData().TestGroup;
			var testtyreqty = rowModel.getData().TestTyreRFitQty;
			var bmtyre      = rowModel.getData().BmGroup;
			var bmtyreqty   = rowModel.getData().BMTyreRFitQty;
			
			var qty = parseInt( testtyreqty ) + parseInt( bmtyreqty );
			if(qty <= tblLength){
			sap.m.MessageToast.show("Exceeds tyre fitment");
			return false;
			}else{
			this.getFitmentTableObject();
			}
			}
			
			
			var testKey = this.getView().getModel("headersModel").getData().testMethodKey;
			var length = idFitmentDetailsTable2.getItems().length;
			if(testKey == "01"){
			var grp = this.getView().getModel("materialJson").getData()[0].Group;
			idFitmentDetailsTable2.getItems()[length-1].getCells()[1].setSelectedKey(grp);
			idFitmentDetailsTable2.getItems()[length-1].getCells()[1].setEnabled(false);
			}
			else if(testKey == "02"){
			var grp = this.getView().getModel("materialJson").getData()[0].Group;
			idFitmentDetailsTable2.getItems()[length-1].getCells()[1].setSelectedKey("");
			idFitmentDetailsTable2.getItems()[length-1].getCells()[1].setEnabled(true);
			}
			},*/
//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	onReject:function(){
		this.openDialog("cancel");
	},
	openDialog : function(status) {
		debugger
      var labelMessage;
      if (status == 'cancel') {
        labelMessage = 'Are you sure you want to go back?';
      }

      var _that = this;
      var dialog = new sap.m.Dialog({
        title : 'Confirmation Dialog',
        type : 'Message',
        content : [ new sap.m.Label({
          text : labelMessage,
          labelFor : 'submitDialogTextarea'
        }) ],
        beginButton : new sap.m.Button({
          text : 'Yes',
          press : function() {
          if (status == 'cancel') {
            //  _that.onNavBack();
              window.history.back()
            }
            dialog.close();
          }
        }),
        endButton : new sap.m.Button({
          text : 'No',
          press : function() {
            dialog.close();
          }
        }),
        afterClose : function() {
          dialog.destroy();
        }
      });

      dialog.open();
},

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ************************************File Upload *********************	

//onInit
// start of document upload
//var attachmentModel = new sap.ui.model.json.JSONModel();
//this.getView().setModel(attachmentModel,"attachmentModel");
//attachmentModel.setData([]);

//var oUploadModel = new sap.ui.model.json.JSONModel({
//	items : []
//});

//this.getView().setModel(oUploadModel,"oUploadModel");
// end of document upload

//onCreateTestPlanSet: function
//that.saveUploadedDocs(that.SelectedData.planguid, that.SelectedData.planrevno);         	// document upload

// _onRoute
//this.getAttachmentDetails(this.SelectedData.planguid,this.SelectedData.planrevno);  		// document upload


onAttachUpload: function(oEvent){
	
	var oFileUploader = oEvent.getSource();		
	
    var _that = this;
    var csrf = that.getCSRFToken();
    
    var oUploadCollection = oEvent.getSource();
    var oCustomerHeaderToken = new UploadCollectionParameter({
	name : "x-csrf-token",
	value : that.token
    });
    oUploadCollection.addHeaderParameter(oCustomerHeaderToken);	
},

getCSRFToken: function() {	
	
	var that=this;
	$.ajax({	url: "/sap/opu/odata/sap/ZAPS_UTILITY_SRV",	type: "GET",	async: false,	
		beforeSend: function(xhr) { 
			xhr.setRequestHeader("X-CSRF-Token", "Fetch");	
		},
		complete: function(xhr) {	
			that.token = xhr.getResponseHeader("X-CSRF-Token");	
		}
	});
},		

onBeforeUploadStarts : function(oEvent) {
    var oVal = oEvent.getParameter("value");	    

    var fileName = oEvent.getParameter("fileName");
    var oSlug = fileName;

    // Header Slug
    var oCustomerHeaderSlug = new UploadCollectionParameter({
	name : "slug",
	value : oSlug
    });
    oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
},
    
onUploadComplete : function(oEvent) {
    var oUploadCollection = oEvent.getSource();
    var oResData = oEvent.getParameter("files")[0];
    if (oResData.status == "201") {
	var oData = oUploadCollection.getModel("oUploadModel").getData();
	
 	var docId = oResData.headers["doc_no"];
	
	var host = window.location.host;
	var protocol = window.location.protocol;
	var urlprefix = protocol + "//" + host;		

	var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + docId + "')/$value";

	oData.items.unshift({
	    "DocNo" : docId, // document number,
	    "FileName" : oResData.fileName,
	    "MimeType" : oResData.headers["content-mimetype"],
	    "Url" : sURL,
	});	
	
	
	var uploadDetails= {};
	uploadDetails.FileName = oResData.fileName
	uploadDetails.DocNo= docId;
	uploadDetails.UpdateFlag= "";
	uploadDetails.MimeType = oResData.headers["content-mimetype"]
	var model = that.getView().getModel("attachmentModel");
	var data = model.getData();
	data.push(uploadDetails);
	
	
	oUploadCollection.getModel("oUploadModel").refresh();

	// delay the success message for to notice onChange message
	setTimeout(function() {sap.m.MessageToast.show("Uploaded successfully");
	}, 4000);
    } else if (oEvent.getParameter("files")[0].status == "0") {
	oUploadCollection.fireUploadTerminated();
    } else {
	var errmessage = "File Upload failed : " + oEvent.getParameter("files")[0].responseRaw;
	sap.m.MessageBox.show(errmessage, sap.m.MessageBox.Icon.ERROR, "Error");
	oUploadCollection.fireUploadTerminated();
    }
},		


onTypeMissmatch: function(oEvent){
	
	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
	return false;
},


onFileDeleted : function(oEvent) {
    var oSrc = oEvent.getSource();
    var uploadModel = oSrc.getModel("oUploadModel");
    var uItems = uploadModel.getProperty("/items");
    var oItem = oEvent.getParameter("item");
    var oContext = oItem.getBindingContext("oUploadModel")
    if (!oContext) {
      uploadModel.setProperty("/items", uItems);
      return;
    }
    var sPath = oContext.getPath();
    var sIndex = sPath.split("/").pop();
    var docId = oEvent.getParameter("documentId");
    
    uItems.splice(sIndex,1);
    uploadModel.refresh();
        
    var data = that.getView().getModel("attachmentModel").getData();
    var exist;
	for(var i=0;i<data.length;i++){
	  if(data[i].DocNo==docId){
		exist = "X";  
		data[i].UpdateFlag = "D";  
	  }	
	}
	
	if(exist !== "X"){
		var obj={};
		obj.FileName = oItem.getFileName();
		obj.MimeType = oItem.getMimeType();
		obj.DocNo = docId;
		obj.UpdateFlag = "D";
		data.push(obj);
	}
  },    
  
  getAttachmentDetails: function(selectedGuId){						//document upload
		var oView = this.getView();
		var oUploadModel = this.getView().getModel("oUploadModel");
		var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
		var sPathAttachmentSet = "/ImageUploadObjectSet(ObjectID='03',ObjectName='"+selectedGuId+"')?$expand=ImageObjectToDataNvg";
		var oParamsAttachmentSet = {};
		oParamsAttachmentSet.context = "";
		oParamsAttachmentSet.urlParameters = "";
		oParamsAttachmentSet.success = function(oData, oResponse) { // success handler
			if (oData.ImageObjectToDataNvg.results.length > 0){
				
				var results = oData.ImageObjectToDataNvg.results;					
				var host = window.location.host;
				var protocol = window.location.protocol;
				var urlprefix = protocol + "//" + host;		
				
				for (var i=0;i<results.length;i++){
					var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
					results[i].Url = sURL; 
				}
				
				oUploadModel.setData({
					items:oData.ImageObjectToDataNvg.results
				});
			}
			else{
				oUploadModel.setData({items:[]});	
			}
		};
		oParamsAttachmentSet.error = function(oError) { // error handler 		
			jQuery.sap.log.error("Read/Publishing Group Data Failed.");
		}.bind(this);

		oCreateModel1.read(sPathAttachmentSet, oParamsAttachmentSet);

		oCreateModel1.attachRequestCompleted(function() {
			
		});
	},

	saveUploadedDocs: function(planguid, fitmentno,RevNo,RegNo,ItemNo){               			// document upload
		debugger
		var payload = that.createDocsPayload(planguid, fitmentno,RevNo,RegNo,ItemNo);
		var oView = this.getView();
		var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
		var sPathPOHeaderSet = "/ImageUploadObjectSet";
		var oParamsPOHeaderSet = {};
		oParamsPOHeaderSet.context = "";
		oParamsPOHeaderSet.urlParameters = "";
		oParamsPOHeaderSet.success = function(oData, oResponse) { // success handler
			
		};
		oParamsPOHeaderSet.error = function(oError) { // error handler 		
			jQuery.sap.log.error("Read/Publishing Group Data Failed.");
		}.bind(this);

		oCreateModel1.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

		oCreateModel1.attachRequestCompleted(function() {
			
		});
	},
	
	createDocsPayload: function(planguid, fitmentno,RevNo,RegNo,ItemNo){              			// document upload
		debugger
		var reg = RegNo.padStart(20,'0');
		var payload={ 
				ObjectID: "04",
				ObjectName: planguid+RevNo+ItemNo+reg+fitmentno,
				Error:"",
				Message:"",
		}
		var navArr=[];
		var data    = that.getView().getModel("attachmentModel").getData();
		var alldata = that.getView().getModel("oUploadModel").getData();
		
		for(var i=0;i<alldata.items.length;i++){
			var obj={};
			obj.FileName = alldata.items[i].FileName;
			obj.DocNo = alldata.items[i].DocNo;
			obj.UpdateFlag = alldata.items[i].UpdateFlag;
			obj.MimeType = alldata.items[i].MimeType;
			navArr.push(obj);
		}
		
		payload.ImageObjectToDataNvg = navArr;
		return payload;
	},

// **********************File upload Finish****************************	

});
});