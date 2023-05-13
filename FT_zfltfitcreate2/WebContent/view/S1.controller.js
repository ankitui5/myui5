sap.ui.define([ "sap/ui/model/json/JSONModel", "sap/m/UploadCollectionParameter" ],
function( JSONModel,UploadCollectionParameter) {
//"use strict";

jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("zfltfitcreate2.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

var DataArticles, that, kunnr, hubName, EnrolMode, hubCode,statefrom,stateto,
	PlanGuid,PlanRev,ItemNumber,TestGroup;
var RereadingModel, fitmentTableModel, RefitmentTableModel;
var stpath, reFitmentArr=[];

sap.ui.core.mvc.Controller.extend("zfltfitcreate2.view.S1",{
		
	onInit: function(){
			that=this;
			
			RereadingModel = new sap.ui.model.json.JSONModel();
			
			var fitmentTb1JModel = new sap.ui.model.json.JSONModel();
			fitmentTb1JModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			var idFitmentPlanTable= this.getView().byId("idFitmentPlanTable");
			idFitmentPlanTable.setModel(fitmentTb1JModel,"fitmentTb1JModel");			
			
			//ReFitment table
			var RefitmentTb1JModel = new sap.ui.model.json.JSONModel();
			RefitmentTb1JModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			var idReFitmentPlanTable= this.getView().byId("idReFitmentPlanTable");
			idReFitmentPlanTable.setModel(RefitmentTb1JModel,"RefitmentTb1JModel");
			
			this.bindGetTestRequest();
			this.bindStateSet();
			this.bindCustomerSet();
			this.bindMechanicalReasonSet();
			this.bindVehicleMakeSet();
			this.bindConfigurationSet();
			this.bindVehicleRegSet();
			this.ValidateFields();
			
			var idRouteTable = this.getView().byId("idRouteTable");

			debugger
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
			
			var RefitmentTableModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(RefitmentTableModel,"RefitmentTableModel");
			this.RefitArr = [];
			
			
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
	},
	
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
	},
		
//		methods add blank row on add button in fitment tab table
	getFitmentTableObject: function(){
			var tabKey = this.getView().byId("id_IconTabBar_ctp_WL").getSelectedKey();
			var data = {
					StencilNo : "",
					Material : "",
					Position : "",
					IpCondition : "",
					IpPsi : "",
					Hardness : "",
					GVW : "",
					OrigNsd : "",
					G1Nsd : "",
					G2Nsd : "",
					G3Nsd : "",
					G4Nsd : "",
					G5Nsd : "",
					G6Nsd : "",
					MinimumNSD : "",
					Remarks : ""
			}
			if(tabKey == "B"){
				this.fitArr.push(data);
				var fitmentTableModel = this.getView().getModel("fitmentTableModel");
				fitmentTableModel.setData(this.fitArr);
				fitmentTableModel.refresh();
			}
		},
		
		getReFitmentTableObject: function(){
			var tabKey = this.getView().byId("id_IconTabBar_ctp_WL").getSelectedKey();
			var data = {
					StencilNo : "",
					Material : "",
					Position : "",
					IpCondition : "",
					IpPsi : "",
					Hardness : "",
					GVW : "",
					OrigNsd : "",
					G1Nsd : "",
					G2Nsd : "",
					G3Nsd : "",
					G4Nsd : "",
					G5Nsd : "",
					G6Nsd : "",
					MinimumNSD : "",
					Remarks : ""
			}
			if(tabKey == "B"){
				this.RefitArr.push(data);
				var RefitmentTableModel = this.getView().getModel("RefitmentTableModel");
				RefitmentTableModel.setData(this.RefitArr);
				RefitmentTableModel.refresh();
			}
		},		
		
		onCustomer: function(){
			window.open("http://jkwgdev.jkti.com:8000/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=100&sap-language=EN#zcustomercreate-display");
			
		},
		
		onYearChange: function(e){
			var year = this.getView().byId("FRegistrationYearEdit").getValue();
			if(year < 2000){
				this.getView().byId("FRegistrationYearEdit").setValue("");
				sap.m.MessageToast.show("Registration Year Cannot Be Less Than 2000.");
				return
			}
			
		},
		
		bindGetTestRequest: function(){
			debugger
			var oView = this.getView();
			var GetTestRequestSetJModel = oView.getModel("GetTestRequestSetJModel");
			if (!GetTestRequestSetJModel) {
				GetTestRequestSetJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(GetTestRequestSetJModel, "GetTestRequestSetJModel");
			}
			var sPathGetRequestSet = "/GetTestPlanForFitmentSet?$filter=Flag eq 'F' and Uname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsGetRequestSet = {};
			oParamsGetRequestSet.context = "";
			oParamsGetRequestSet.urlParameters = "";
			oParamsGetRequestSet.success = function(oData, oResponse) { // success handler
				
				GetTestRequestSetJModel.setData(oData.results);
				
			};
			oParamsGetRequestSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathGetRequestSet, oParamsGetRequestSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});

		},

//		method executes when changing the request number
		onChangeRequestNo: function(oEvent){	
			this.getView().byId("idFitmentPlanTable").removeSelections();
			
			this.PlanGuid = oEvent.getSource().getSelectedKey();
			this.PlanRev = oEvent.getParameters().selectedItem.getAggregation("customData")[0].getValue();
			var headersModel = this.getView().getModel("headersModel");
			var data1 = headersModel.getData();
			data1.planNo = oEvent.getSource()._getSelectedItemText();
				
			var oView = this.getView();
			var getAllDataJModel = oView.getModel("getAllDataJModel");
			if (!getAllDataJModel) {
				getAllDataJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(getAllDataJModel, "getAllDataJModel");
			}
			var sPathgetAllDataSet = "/TestPlanSet(PlanGuid='"+ this.PlanGuid +"',PlanRev='"+this.PlanRev+"',CallMode='F',Uname='"+sap.ushell.Container.getService("UserInfo").getId()+"')?$expand=PlanHeadtoCatNvg,PlanHeadtoDiscountNvg,PlanHeadtoFitmentNvg,PlanHeadCompTestTyreNvg,PlanHeadCompBMTyreNvg,PlanToReFitCatNvg";

			var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsGetAllDataSet = {};
			oParamsGetAllDataSet.context = "";
			oParamsGetAllDataSet.urlParameters = "";
			
			oParamsGetAllDataSet.success = function(oData, oResponse) { // success handler
				debugger
				getAllDataJModel.setData(oData);
				that.bindRequestData(oData.ReqGuid,oData.PlanRev);    //APS'21	
				
			};
			oParamsGetAllDataSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathgetAllDataSet, oParamsGetAllDataSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		},
		
		bindRequestData: function(reqGuid,revno){
			var oView = this.getView();
			var getRequestDataJModel = oView.getModel("getRequestDataJModel");
			if (!getRequestDataJModel) {
				getRequestDataJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(getRequestDataJModel, "getRequestDataJModel");
			}
			var sPathgetAllDataSet = "/TestRequestSet(ReqGuid='"+ reqGuid +"',Revno='"+ revno +"')?$expand=RequestHeadtoItemNvg,RequestHeadtoVehicleNvg,RequestHeadtoCallNvg,RequestHeadtoUsageNvg";
		
			var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsGetAllDataSet = {};
			oParamsGetAllDataSet.context = "";
			oParamsGetAllDataSet.urlParameters = "";
			
			oParamsGetAllDataSet.success = function(oData, oResponse) { // success handler
				debugger
				
				getRequestDataJModel.setData(oData);
				that.createDataModels();
				
			};
			oParamsGetAllDataSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathgetAllDataSet, oParamsGetAllDataSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		},
		
		 onVehicleMakeHelp: function(evt) {
				var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4VehicleMakeSet";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false, false, null);
				var _valueHelpDialog = new sap.m.SelectDialog({
					title: "Vehicle Make",
					items: {
					path: "/d/results",
					template: new sap.m.StandardListItem({
					title: "{VehicleMake}",
					description:"{VehicleSeq}",
					customData: [new sap.ui.core.CustomData({
					      key: "{VehicleSeq}", 
						 value: "{VehicleMake}"
							})]
					})
					},
					liveChange: function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("VehicleMake", sap.ui.model.FilterOperator.Contains, sValue);
						oEvent.getSource().getBinding("items").filter([oFilter]);
					},
					confirm: [this._handleVehicleMakeClose, this],
					cancel: [this._handleVehicleMakeClose, this]
					});
					_valueHelpDialog.setModel(jModel);
					_valueHelpDialog.open();
					},
					_handleVehicleMakeClose: function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.VehicleMake = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
							var data = this.getView().getModel("vehicleDetailsSetJModel").getData();
							data.VehicleSeq = oSelectedItem.getDescription();
							data.MakeDesc = oSelectedItem.getTitle();
						}
			},
					
			onVehicleModelHelp: function(evt) {
				this.VehModelValue = evt.getSource();
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4VehicleModelSet";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false, false, null);
				var _valueHelpDialog = new sap.m.SelectDialog({
					title: "Vehicle Model",
					items: {
					path: "/d/results",
					template: new sap.m.StandardListItem({
					title: "{Model}",
					customData: [new sap.ui.core.CustomData({
						   key: "{Model}",
						 value: "{Model}"
							})]
						})
					},
				liveChange: function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.Contains, sValue);
					oEvent.getSource().getBinding("items").filter([oFilter]);
					},
				confirm: [this._handleVehicleModelClose, this],
				cancel: [this._handleVehicleModelClose, this]
				});
				_valueHelpDialog.setModel(jModel);
				_valueHelpDialog.open();
				},
				
				_handleVehicleModelClose: function(oEvent) {
					debugger
				var that = this;
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					this.getView().byId("ConfigurationIDID").setSelectedKey("");
					this.VehicleModel = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
					this.VehModelValue.setValue(oSelectedItem.getTitle());
				}
				},
				
				onConfigCodeHelp: function(evt) {
					this.ConfigCodeValue = evt.getSource();
					var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4VehicleConfigCodeSet?$filter=Model eq '"+this.VehicleModel+"'";
					var jModel = new sap.ui.model.json.JSONModel();
					jModel.loadData(sPath, null, false, "GET", false, false, null);
					var _valueHelpDialog = new sap.m.SelectDialog({
						title: "Config Code",
						items: {
						 path: "/d/results",
					 template: new sap.m.StandardListItem({
						title: "{ConfigCodeDesc}",
						description:"{ConfigCode}",
		 		   customData: [new sap.ui.core.CustomData({
						  key: "{ConfigCode}",
						value: "{ConfigCode}"
								})]
					 	})
						},
						liveChange: function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("ConfigCode", sap.ui.model.FilterOperator.Contains, sValue);
							oEvent.getSource().getBinding("items").filter([oFilter]);
						},
						confirm: [this._handleConfigCodeClose, this],
						cancel: [this._handleConfigCodeClose, this]
					});
					_valueHelpDialog.setModel(jModel);
					_valueHelpDialog.open();
				   },
				   _handleConfigCodeClose: function(oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						this.ConfigCode = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
						this.ConfigCodeValue.setValue(oSelectedItem.getTitle());
						var data = this.getView().getModel("vehicleDetailsSetJModel").getData();
						data.ConfigCode = oSelectedItem.getDescription();
					}
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
	onCustomerSelect: function(oEvent){
		debugger
			var key = oEvent.getSource().getSelectedKey();
			
			var idCustType = this.getView().byId("idCustType");
			var customerSetJModel = this.getView().getModel("customerSetJModel");
			var data = customerSetJModel.getData();
				for(var i=0; i< data.length;i++){
					if(data[i].Mobile1 == key){
						idCustType.setSelectedKey(data[i].Type);
						this.getView().byId("idCustomerName").setValue(data[i].Name);
					}
				}
				this.getView().byId("FVehicleNoEdit").setEnabled(true);	
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
	onVehicleHelp: function(){
				  
				var oViewObj = this.getView();
				var GetVehicleRegSetJModel = oViewObj.getModel("GetVehicleRegSetJModel");
	    	    var _valueHelpSelectDialog = new sap.m.SelectDialog({
	    	    	
	    	        title: "Vehicle Registration Number",
	    	        items: {
	    	            path: "/d/results",
	    	            template: new sap.m.StandardListItem({
	    	                title: "{RegNo}",
	    	                customData: [new sap.ui.core.CustomData({
	    	                    key: "{RegNo}",
	    	                    value: "{RegNo}"
	    	                })],    	               
	    	            }),
	    	        },
	    	        liveChange: function(oEvent) {
	    	            var sValue = oEvent.getParameter("value");
	    	            var oFilter = new sap.ui.model.Filter("RegNo",sap.ui.model.FilterOperator.Contains,sValue);
	    	            oEvent.getSource().getBinding("items").filter([oFilter]);
	    	        },
	    	        confirm: [this._handleClose, this],
	    	        cancel: [this._handleClose, this]
	    	    });
	    	    _valueHelpSelectDialog.setModel(GetVehicleRegSetJModel);
	    	    _valueHelpSelectDialog.open();
				
			},
		_handleClose: function(oEvent) {
	    	    var oSelectedItem = oEvent.getParameter("selectedItem");
	    	    if (oSelectedItem) {	    	    	
	    	        this.getView().byId("FVehicleNoEdit").setValue(oSelectedItem.getTitle());
	    	    }      
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
			
	
		bindCompTestTyre: function(rowData, allData, id){
			var comparisonJModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(comparisonJModel,"comparisonJModel");
			var arr=[];
			if(id == "01"){
				arr=[];
				for(var i=0;i< allData.PlanHeadCompTestTyreNvg.results.length ; i++){
					var itemData = allData.PlanHeadCompTestTyreNvg.results;
					if(itemData[i].ItemNumber == rowData.ItemNumber){
						var obj = {};
						obj.CompNo = itemData[i].ACompNo;
						obj.CompQty = itemData[i].ACompQty;
						arr.push(obj);
					}
				}
			}else if(id == "02"){
				arr=[];
				for(var i=0;i< allData.PlanHeadCompBMTyreNvg.results.length ; i++){
					var itemData = allData.PlanHeadCompBMTyreNvg.results;
					if(itemData[i].ItemNumber == rowData.ItemNumber){
						var obj = {};
						obj.CompNo = itemData[i].BCompNo;
						obj.CompQty = itemData[i].BCompQty;
						arr.push(obj);
					}
				}
			}
			comparisonJModel.setData(arr);
			this.getView().getModel("comparisonJModel").refresh();
			
		},
		onRadioChangeSelect: function(oEvent){
			var idSelectComp= sap.ui.getCore().byId("idSelectComp");
			var idLabelSelectComp= sap.ui.getCore().byId("idLabelSelectComp");
			var selectedIndex = oEvent.getSource().getSelectedIndex();
			var selectedId = oEvent.getSource().getAggregation("buttons")[selectedIndex].getAggregation("customData")[0].getProperty("key");
			if(selectedId == "RB1"){
				idSelectComp.setVisible(true);
				idLabelSelectComp.setVisible(true);
			}else if(selectedId == "RB2"){
				idSelectComp.setVisible(false);
				idLabelSelectComp.setVisible(false);
			}
		},
		onTyreSelect: function(){
			this._ChooseTyreDialog.close();
			var tabKey = this.getView().byId("id_IconTabBar_ctp_WL");
			tabKey.setSelectedKey('D');
		},
		onCancel: function(){
			this._ChooseTyreDialog.close();
		},
		
		bindMaterialSet: function(tmpData, type){
			debugger
			var exist = false;
			var getRequestDataJModel = this.getView().getModel("getRequestDataJModel");
			var requestData 	= getRequestDataJModel.getData();
			var materialJson 	= new sap.ui.model.json.JSONModel();
			var RematerialJson 	= new sap.ui.model.json.JSONModel();
			
			var oldmat = materialJson.getData();
			
			var data = requestData.RequestHeadtoItemNvg.results;
			var matArr=[];
			var RematArr=[];
			for(var i=0;i<data.length;i++){
				if(data[i].Group == tmpData.TestGroup){
					var mat={};
					mat.Group=data[i].Group;
					mat.GroupDesc = data[i].GroupDesc;
					mat.Material  = data[i].Maktx;
					mat.Qty       = tmpData.TestQty;
					mat.TotQty    = tmpData.TotQty;
					if(type == "01"){
						mat.enabled = false;
					}else{
						mat.enabled = true;
					}
					matArr.push(mat);
				}
				if(tmpData.TestGroup !== tmpData.BmGroup){
					if(data[i].Group  == tmpData.BmGroup){
						var mat={};
						mat.Group     = data[i].Group;
						mat.GroupDesc = data[i].GroupDesc;
						mat.Material  = data[i].Maktx;
						mat.Qty       = tmpData.BmQty;
						mat.TotQty    = tmpData.TotQty;
						if(type == "01"){
							mat.enabled = false;
						}else{
							mat.enabled = true;
						}
						matArr.push(mat);
					}
				}
				
				
				if(data[i].Group == tmpData.ReTestGroup){
					var mat={};
					mat.Group	  = data[i].Group;
					mat.GroupDesc = data[i].GroupDesc;
					mat.Material  = data[i].Maktx;
					mat.Qty       = tmpData.ReTestQty;
					mat.TotQty    = tmpData.ReTotQty;
					if(type == "01"){
						mat.enabled = false;
					}else{
						mat.enabled = true;
					}
					RematArr.push(mat);
				}
				if(tmpData.ReTestGroup !== tmpData.ReBmGroup){
					if(data[i].Group  == tmpData.ReBmGroup){
						var mat={};
						mat.Group     = data[i].Group;
						mat.GroupDesc = data[i].GroupDesc;
						mat.Material  = data[i].Maktx;
						mat.Qty       = tmpData.ReBmQty;
						mat.TotQty    = tmpData.ReTotQty;
						if(type == "01"){
							mat.enabled = false;
						}else{
							mat.enabled = true;
						}
						RematArr.push(mat);
					}
				}				
			}
			
			materialJson.setData(matArr);
			this.getView().setModel(materialJson,"materialJson");
			
			RematerialJson.setData(RematArr);
			this.getView().setModel(RematerialJson,"RematerialJson");

		},

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
		
		
		
		onMechanicalReason: function(oEvent){
			debugger
			var key = oEvent.getSource().getSelectedKey();
			var oView = this.getView();
			var idReason = oView.byId("idReason");
			var idReasonLbl = oView.byId("idReasonLbl");
			if(key == "Y"){
				idReason.setVisible(false);
				idReasonLbl.setVisible(false);
			}
			if(key == "N"){
				idReason.setVisible(true);
				idReasonLbl.setVisible(true);
			}
		},
		
		onMiloMeter:function(evt){
			var key=evt.getSource().getSelectedKey();
			if(key=="Y"){
				this.getView().byId("idMilReading").setVisible(true);
			}else{
				this.getView().byId("idMilReading").setVisible(false).setValue("");
			}
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
			oParamsTyrePositionSet.success = function(oData, oResponse) { // success handler
					
				TyrePositionJModel.setData(oData.results);
				
			};
			oParamsTyrePositionSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathTyrePositionSet, oParamsTyrePositionSet);
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
  onF4Stencil: function(oEvent){
	  debugger
		this.stencil = oEvent.getSource().getId();
	    this.event   = oEvent.getSource();
	    
	    var Group = oEvent.getSource().getParent().getCells()[1].getSelectedKey();
	    oEvent.getSource().getParent().getCells()[1].setValueState("None");
	    
	    stpath = oEvent.getSource().getParent().getBindingContextPath().split("/")[1];
	    
	    if(Group == ""){
	    	oEvent.getSource().getParent().getCells()[1].setValueState("Error");
			sap.m.MessageToast.show("Material is required");
			return false;
	    }
	    
		var sPath="/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4StencilSet?$filter=PlanGuid eq '"+this.PlanGuid+"' and PlanRev eq '"+this.PlanRev+"' and PlanItemNo eq '"+this.planitem+"' and GroupType eq '"+Group+"'";
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
  		var oSelectedItem = oEvent.getParameter("selectedItem");
  	        if (oSelectedItem) {
				
  	        	var stencil = oSelectedItem.getBindingContext().getObject().Stencil;  	        	
				var idReFitmentDetailsTable  = this.getView().byId("idReFitmentDetailsTable");
				var items = idReFitmentDetailsTable.getItems();
				
				for(var i=0;i<items.length;i++){
					if(i != stpath){
						var value = items[i].getCells()[2].getValue();
						if(stencil.toLowerCase() == value.toLowerCase()){
							sap.m.MessageToast.show("Stencil Number cannot be repeated.");
							sap.ui.getCore().byId(this.stencil).setValue();
							return false;
						}
					}
				}  
  	        	
  	        	sap.ui.getCore().byId(this.stencil).setValue(oSelectedItem.getBindingContext().getObject().Stencil)
  	        	reFitmentArr[stpath]=oSelectedItem.getBindingContext().getObject();
  	         }
},

		onTableRowSelect: function(){
			
			debugger
			this.getView().byId("idFitmentDetailsTable2").getModel("fitmentTableModel").setData();
			this.getView().byId("idReFitmentDetailsTable").getModel("RefitmentTableModel").setData();
			this.fitArr = [];
			this.RefitArr = [];
			
		},
		
		
		ontypechange: function(){
			
			debugger
			this.getView().byId("idFitmentDetailsTable2").getModel("fitmentTableModel").setData();
			this.getView().byId("idReFitmentDetailsTable").getModel("RefitmentTableModel").setData();
			this.fitArr = [];
			this.RefitArr = [];
			
		},		
//////////////////////////////////////////////////////////////////////////////////////////////////

		createDataModels: function(){
			debugger
			var getAllDataJModel = this.getView().getModel("getAllDataJModel");
			var data = getAllDataJModel.getData();
			var getRequestDataJModel = this.getView().getModel("getRequestDataJModel");
			var requestData = getRequestDataJModel.getData();
			var idRimSizeText= this.getView().byId("idRimSizeText");
			idRimSizeText.setText(requestData.RequestHeadtoUsageNvg.FitmentRimRecommended);
			
						
//			Fitment tab Table 2 data binding
			var fitmentTb2JModel = new sap.ui.model.json.JSONModel();
			var idTyreDetailsTable = this.getView().byId("idTyreDetailsTable");			
			if(requestData.RequestHeadtoItemNvg.results){
				fitmentTb2JModel.setData(requestData.RequestHeadtoItemNvg.results);
				idTyreDetailsTable.setModel(fitmentTb2JModel,"fitmentTb2JModel");
			}
			fitmentTb2JModel.refresh();
			
//			Proposed Vehicle Table data binding
			var proposedVehicleJModel = new sap.ui.model.json.JSONModel();
			var idProposedDetailsTable = this.getView().byId("idProposedDetailsTable");			
			if(requestData.RequestHeadtoVehicleNvg.results){
				proposedVehicleJModel.setData(requestData.RequestHeadtoVehicleNvg.results);
				idProposedDetailsTable.setModel(proposedVehicleJModel,"proposedVehicleJModel");
			}
						
//			Fitment tab table data binding
			var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
			var fitmentTb1JModel = idFitmentPlanTable.getModel("fitmentTb1JModel");
			if(data.PlanHeadtoCatNvg.results){
				fitmentTb1JModel.setData(data.PlanHeadtoCatNvg.results);
				for(var i=0;i<fitmentTb1JModel.getData().length;i++){
					if(fitmentTb1JModel.getData()[i].TestMethodology == "02"){
						fitmentTb1JModel.getData()[i]["FieldVisible"] = false;
					}else if(fitmentTb1JModel.getData()[i].TestMethodology == "01"){
						fitmentTb1JModel.getData()[i]["FieldVisible"] = true;
					}
				}
				fitmentTb1JModel.refresh();
			}
			
//			ReFitment tab table data binding
			var idReFitmentPlanTable = this.getView().byId("idReFitmentPlanTable");
			var RefitmentTb1JModel = idReFitmentPlanTable.getModel("RefitmentTb1JModel");
			if(data.PlanToReFitCatNvg.results){
				RefitmentTb1JModel.setData(data.PlanToReFitCatNvg.results);
				
				for(var i=0;i<RefitmentTb1JModel.getData().length;i++){
					if(RefitmentTb1JModel.getData()[i].TestMethodology == "02"){
						RefitmentTb1JModel.getData()[i]["FieldVisible"] = false;
					}else if(RefitmentTb1JModel.getData()[i].TestMethodology == "01"){
						RefitmentTb1JModel.getData()[i]["FieldVisible"] = true;
					}
				}
				RefitmentTb1JModel.refresh();
			}

		},
		
		onReset: function(){
			this.getView().byId("idTestPlanNoSelect").setSelectedKey("");
			var getAllDataJModel = this.getView().getModel("getAllDataJModel");
			getAllDataJModel.setData([]);
			getAllDataJModel.refresh();
			var getRequestDataJModel = this.getView().getModel("getRequestDataJModel");
			getRequestDataJModel.setData([]);
			getRequestDataJModel.refresh();
			
			var idTyreDetailsTable = this.getView().byId("idTyreDetailsTable");		
			var fitmentTb2JModel  =idTyreDetailsTable.getModel("fitmentTb2JModel");
			fitmentTb2JModel.setData([]);
			fitmentTb2JModel.refresh();

			
//			Proposed Vehicle Table data binding		
			var idProposedDetailsTable = this.getView().byId("idProposedDetailsTable");		
			var proposedVehicleJModel  =idProposedDetailsTable.getModel("proposedVehicleJModel");
			proposedVehicleJModel.setData([]);
			proposedVehicleJModel.refresh();
			
			
//			Fitment tab table data binding
			var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");		
			var fitmentTb1JModel  =idFitmentPlanTable.getModel("fitmentTb1JModel");
			fitmentTb1JModel.setData([]);
			fitmentTb1JModel.refresh();
			
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////		
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
			
//			code added for to get Groove Data from request data set based on Group
			var requestDataSetModel = this.getView().getModel("getRequestDataJModel");
			var requestData  = requestDataSetModel.getData().RequestHeadtoItemNvg.results;
			var rowModel = this.getView().getModel("rowModel");
			var selectedGroup = cells[1].getSelectedKey();
			var headerData = this.getView().getModel("headersModel").getData();
			
			var readingModel = new sap.ui.model.json.JSONModel();
			
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

			/*var status = sap.ui.getCore().byId("idStatus");
			status.removeStyleClass('myStateError');*/
			
			this._ReadingDialog.setModel(readingModel , "readingModel");
			
			this.checkMaxGroove();
		},
		
		onReadingClose: function(){
			this._ReadingDialog.close();
			
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		ReonReadingPress: function(oEvent){
			var that = this;
			that.Button=oEvent.getSource();
			this.RereadingPath = oEvent.getSource()._getBindingContext("RefitmentTableModel").getPath().split('/')[1];
			var idReFitmentDetailsTable = this.getView().byId("idReFitmentDetailsTable");
			var cells = idReFitmentDetailsTable.getItems()[this.RereadingPath].getCells();
			if( cells[0].getSelectedKey() == "" || cells[1].getSelectedKey() == "" || cells[2].getValue() == "" ){
				
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
			
//			code added for to get Groove Data from request data set based on Group
			var requestDataSetModel = this.getView().getModel("getRequestDataJModel");
			var requestData  = requestDataSetModel.getData().RequestHeadtoItemNvg.results;
			var rowModel = this.getView().getModel("rowModel");
			var selectedGroup = cells[1].getSelectedKey();
			var headerData = this.getView().getModel("headersModel").getData();
			
			//var RereadingModel = new sap.ui.model.json.JSONModel();
			
			for(var i=0;i<requestData.length;i++){
				if(requestData[i].Group == selectedGroup){
					RereadingModel.setData(requestData[i]);
				}
			}
			debugger
			var grooveNo = parseInt(RereadingModel.getData().GrooveNumbers);	
			var infnsd   = RereadingModel.getData().Infnsd;			
			var orignsd  = parseFloat(RereadingModel.getData().OrigNsd);

			if (!this._ReReadingDialog) {
				this._ReReadingDialog = sap.ui.xmlfragment(
					"zfltfitcreate2.view.Re_Reading", this);
				this.getView().addDependent(this._ReReadingDialog);
				
			}
			this._ReReadingDialog.setTitle("Reading Details ("+cells[0].getSelectedKey()+")");
			this._ReReadingDialog.open();
			
			
			var g1 = sap.ui.getCore().byId("id1GrooveG1");
			var g2 = sap.ui.getCore().byId("id1GrooveG2");
			var g3 = sap.ui.getCore().byId("id1GrooveG3");
			var g4 = sap.ui.getCore().byId("id1GrooveG4");
			var g5 = sap.ui.getCore().byId("id1GrooveG5");
			var g6 = sap.ui.getCore().byId("id1GrooveG6");
			var infla = sap.ui.getCore().byId("id1EarSped12");
			var psi = sap.ui.getCore().byId("id1EarCon12");
			var hard = sap.ui.getCore().byId("id1Hardness");
			var orgNsd = sap.ui.getCore().byId("id1OriNsd");
			var minNsd = sap.ui.getCore().byId("id1MinNsd");
			var remarks = sap.ui.getCore().byId("id1Remarks");
			
					//
					var Og1 = sap.ui.getCore().byId("idGrooveG1O");
					var Og2 = sap.ui.getCore().byId("idGrooveG2O");
					var Og3 = sap.ui.getCore().byId("idGrooveG3O");
					var Og4 = sap.ui.getCore().byId("idGrooveG4O");
					var Og5 = sap.ui.getCore().byId("idGrooveG5O");
					var Og6 = sap.ui.getCore().byId("idGrooveG6O");
					var Oinfla = sap.ui.getCore().byId("idEarSped12O");
					var Opsi = sap.ui.getCore().byId("idEarCon12O");
					var Ohard = sap.ui.getCore().byId("idHardnessO");
					var OorgNsd = sap.ui.getCore().byId("idOriNsdO");
					var OminNsd = sap.ui.getCore().byId("idMinNsdO");
					var Oremarks = sap.ui.getCore().byId("idRemarksO");
					//
			
			if(parseFloat(RereadingModel.getData().G1Nsd) <= 0){
				g1.setValue("");
			}
			if(parseFloat(RereadingModel.getData().G2Nsd) <= 0){
				g2.setValue("");
			}
			if(parseFloat(RereadingModel.getData().G3Nsd) <= 0){
				g3.setValue("");
			}
			if(parseFloat(RereadingModel.getData().G4Nsd) <= 0){
				g4.setValue("");
			}
			if(parseFloat(RereadingModel.getData().G5Nsd) <= 0){
				g5.setValue("");
			}
			if(parseFloat(RereadingModel.getData().G6Nsd) <= 0){
				g6.setValue("");
			}	
						
			var rowData = this.getView().getModel("RefitmentTableModel").getData()[this.RereadingPath];
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
						//
						Og1.setValue(reFitmentArr[this.RereadingPath].G1Nsd);
						Og2.setValue(reFitmentArr[this.RereadingPath].G2Nsd);
						Og3.setValue(reFitmentArr[this.RereadingPath].G3Nsd);
						Og4.setValue(reFitmentArr[this.RereadingPath].G4Nsd);
						Og5.setValue(reFitmentArr[this.RereadingPath].G5Nsd);
						Og6.setValue(reFitmentArr[this.RereadingPath].G6Nsd);
						Oinfla.setSelectedKey(reFitmentArr[this.RereadingPath].IpCondition);
						Opsi.setValue(reFitmentArr[this.RereadingPath].IpPsi);
						OminNsd.setValue();
						OorgNsd.setValue(reFitmentArr[this.RereadingPath].OrgNsd);
						Ohard.setValue(reFitmentArr[this.RereadingPath].Hardness);
						Oremarks.setValue(reFitmentArr[this.RereadingPath].Remarks);
						//
			}else{
				//g1.setValue(RereadingModel.getData().G1Nsd);
				g1.setValue();
				g2.setValue();
				g3.setValue();
				g4.setValue();
				g5.setValue();
				g6.setValue();
				infla.setSelectedKey();
				psi.setValue();
				minNsd.setValue();
				//orgNsd.setValue(RereadingModel.getData().OrigNsd);
				orgNsd.setValue(reFitmentArr[this.RereadingPath].OrgNsd);
				hard.setValue();
				remarks.setValue();
						//
						Og1.setValue(reFitmentArr[this.RereadingPath].G1Nsd);
						Og2.setValue(reFitmentArr[this.RereadingPath].G2Nsd);
						Og3.setValue(reFitmentArr[this.RereadingPath].G3Nsd);
						Og4.setValue(reFitmentArr[this.RereadingPath].G4Nsd);
						Og5.setValue(reFitmentArr[this.RereadingPath].G5Nsd);
						Og6.setValue(reFitmentArr[this.RereadingPath].G6Nsd);
						Oinfla.setSelectedKey(reFitmentArr[this.RereadingPath].IpCondition);
						Opsi.setValue(reFitmentArr[this.RereadingPath].IpPsi);
						OminNsd.setValue();
						OorgNsd.setValue(reFitmentArr[this.RereadingPath].OrgNsd);
						Ohard.setValue(reFitmentArr[this.RereadingPath].Hardness);
						Oremarks.setValue(reFitmentArr[this.RereadingPath].Remarks);
						//
			}
			
			
			var inputs = [
				
				sap.ui.getCore().byId("id1EarCon12"),
				sap.ui.getCore().byId("id1Hardness"),
				sap.ui.getCore().byId("id1Remarks")

			];
			jQuery.each(inputs, function(i, input) {
				
					input.setValueState("None");
		
			});
			
			var inputs1 = [
				sap.ui.getCore().byId("id1GrooveG1"),
				sap.ui.getCore().byId("id1GrooveG2"),
				sap.ui.getCore().byId("id1GrooveG3"),
				sap.ui.getCore().byId("id1GrooveG4"),
				sap.ui.getCore().byId("id1GrooveG5"),
				sap.ui.getCore().byId("id1GrooveG6")
				
			];
			jQuery.each(inputs1, function(i, input) {
					if(grooveNo > i){
						input.setVisible(true);
						input.setValueState("None");
					}
			});
			
			var inputsLbl = [
				sap.ui.getCore().byId("id1GrooveG1Lbl"),
				sap.ui.getCore().byId("id1GrooveG2Lbl"),
				sap.ui.getCore().byId("id1GrooveG3Lbl"),
				sap.ui.getCore().byId("id1GrooveG4Lbl"),
				sap.ui.getCore().byId("id1GrooveG5Lbl"),
				sap.ui.getCore().byId("id1GrooveG6Lbl")
				
			];
			jQuery.each(inputsLbl, function(i, input) {
					if(grooveNo > i){
						input.setVisible(true);
					}
			});
			
					//
					var Oinputs1 = [
						sap.ui.getCore().byId("idGrooveG1O"),
						sap.ui.getCore().byId("idGrooveG2O"),
						sap.ui.getCore().byId("idGrooveG3O"),
						sap.ui.getCore().byId("idGrooveG4O"),
						sap.ui.getCore().byId("idGrooveG5O"),
						sap.ui.getCore().byId("idGrooveG6O")
					];
					jQuery.each(Oinputs1, function(i, input) {
							
							if(grooveNo > i){
								input.setVisible(true);
								input.setValueState("None");
							}
					});
					var OinputsLbl = [
						sap.ui.getCore().byId("idGrooveG1LblO"),
						sap.ui.getCore().byId("idGrooveG2LblO"),
						sap.ui.getCore().byId("idGrooveG3LblO"),
						sap.ui.getCore().byId("idGrooveG4LblO"),
						sap.ui.getCore().byId("idGrooveG5LblO"),
						sap.ui.getCore().byId("idGrooveG6LblO")
					];
					jQuery.each(OinputsLbl, function(i, input) {
							if(grooveNo > i){
								input.setVisible(true);
							}
					});
					//
			
			/*if (infnsd=="X"){
				sap.ui.getCore().byId("id1OriNsd").setEnabled(true);
			}else*/
			{
				sap.ui.getCore().byId("id1OriNsd").setEnabled(false);
			}
			
			var inflaPress = sap.ui.getCore().byId("id1EarSped12");
			inflaPress.removeStyleClass('myStateError');
		
			this._ReReadingDialog.setModel(RereadingModel , "RereadingModel");
			
			this.checkMaxGrooveRe();
		},
		
		onReReadingClose: function(){
			this._ReReadingDialog.close();
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onSaveReading: function(e){
			debugger
			var checkEmpty	 = false;
			var checkNSD	 = false;
			var readingModel = this._ReadingDialog.getModel("readingModel");
			var data = readingModel.getData();
			var fitmentTableModel = this.getView().getModel("fitmentTableModel");
			var index = fitmentTableModel.getData()[this.readingPath];
		
			var grooveNo = parseInt(readingModel.getData().GrooveNumbers);
			var org 	 = sap.ui.getCore().byId("idOriNsd").getValue();
		
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
				return false;
			}
			
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
		
		onSaveReReading: function(e){
			debugger
			var checkEmpty		= false;
			var checkNSD		= false;
			var RereadingModel  = this._ReReadingDialog.getModel("RereadingModel");
			var data = RereadingModel.getData();
			var RefitmentTableModel = this.getView().getModel("RefitmentTableModel");
			var index = RefitmentTableModel.getData()[this.RereadingPath];
		
			var grooveNo = parseInt(RereadingModel.getData().GrooveNumbers);
			var org		 = sap.ui.getCore().byId("id1OriNsd").getValue();
		
			var grooves = [
				
				sap.ui.getCore().byId("id1GrooveG1"),
				sap.ui.getCore().byId("id1GrooveG2"),
				sap.ui.getCore().byId("id1GrooveG3"),
				sap.ui.getCore().byId("id1GrooveG4"),
				sap.ui.getCore().byId("id1GrooveG5"),
				sap.ui.getCore().byId("id1GrooveG6"),
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
				sap.ui.getCore().byId("id1OriNsd"),
				sap.ui.getCore().byId("id1EarCon12"),
				sap.ui.getCore().byId("id1Hardness")
			];
			jQuery.each(inputs, function(i, input) {
				if(input.getValue() == ""){
					input.setValueState("Error");
					checkEmpty = true;
				}else{
					input.setValueState("None");
				}
			});
			
			var inflaPress  = sap.ui.getCore().byId("id1EarSped12");
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
			
			/*if(checkNSD){
				sap.m.MessageToast.show("Groove value can't exceed original NSD");
				return false;
			}
			*/
				var g1 = sap.ui.getCore().byId("id1GrooveG1");
				var g2 = sap.ui.getCore().byId("id1GrooveG2");
				var g3 = sap.ui.getCore().byId("id1GrooveG3");
				var g4 = sap.ui.getCore().byId("id1GrooveG4");
				var g5 = sap.ui.getCore().byId("id1GrooveG5");
				var g6 = sap.ui.getCore().byId("id1GrooveG6");
				var infla = sap.ui.getCore().byId("id1EarSped12");
				var psi = sap.ui.getCore().byId("id1EarCon12");
				var hard = sap.ui.getCore().byId("id1Hardness");
				var min = Math.min.apply(null,garr);
				var remarks = sap.ui.getCore().byId("id1Remarks");
				var orgNsd = sap.ui.getCore().byId("id1OriNsd");
				
						var Og1 = sap.ui.getCore().byId("idGrooveG1O");
						var Og2 = sap.ui.getCore().byId("idGrooveG2O");
						var Og3 = sap.ui.getCore().byId("idGrooveG3O");
						var Og4 = sap.ui.getCore().byId("idGrooveG4O");
						var Og5 = sap.ui.getCore().byId("idGrooveG5O");
						var Og6 = sap.ui.getCore().byId("idGrooveG6O");
						
						var checkGroove=true;
						
						if(g1.getVisible()==true && ( parseFloat(g1.getValue()) > parseFloat(Og1.getValue())) ){
							checkGroove=false;
							g1.setValueState("Error");
						}else
							g1.setValueState("None");
						
						if(g2.getVisible()==true && ( parseFloat(g2.getValue()) > parseFloat(Og2.getValue())) ){
							checkGroove=false;
							g2.setValueState("Error");
						}else
							g2.setValueState("None");
						
						if(g3.getVisible()==true && ( parseFloat(g3.getValue()) > parseFloat(Og3.getValue())) ){
							checkGroove=false;
							g3.setValueState("Error");
						}else
							g3.setValueState("None");
						
						if(g4.getVisible()==true && ( parseFloat(g4.getValue()) > parseFloat(Og4.getValue())) ){
							checkGroove=false;
							g4.setValueState("Error");
						}else
							g4.setValueState("None");
						
						if(g5.getVisible()==true && ( parseFloat(g5.getValue()) > parseFloat(Og5.getValue())) ){
							checkGroove=false;
							g5.setValueState("Error");
						}else
							g5.setValueState("None");
						
						if(g6.getVisible()==true && ( parseFloat(g6.getValue()) > parseFloat(Og6.getValue())) ){
							checkGroove=false;
							g6.setValueState("Error");
						}else
							g6.setValueState("None");
				
						if(checkGroove==false){
							sap.m.MessageToast.show("New reading cannot be greater than previous reading.");
							return false;
						}
				
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
				this._ReReadingDialog.close();
			
				that.Button.setType("Accept");
		},		
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onNumberValidChange: function(oEvent){
			var diameter = sap.ui.getCore().byId("idOriNsd").getValue();
			var diaMNo   = oEvent.getSource().getValue();
			
			if(diaMNo){
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					//diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					diaMNo = 0.00; 
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100mm");
				}
				
				if(parseFloat(diaMNo) > parseFloat(diameter)){
					//diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					diaMNo = 0.00;
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original NSD Value.");
				}
			}
			/*if( diaMNo.toString().indexOf(".") >= 0 )
			{
				diaMNo = diaMNo.toString().substring(0, nsdVal.toString().indexOf(".") + 2);
				oEvent.getSource().setValue(diaMNo);
			}*/
			if( diaMNo.toString().indexOf(".") >= 0 )
			{
				diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
				oEvent.getSource().setValue(diaMNo);
			}
		},
		
		onNumberValidChange1: function(oEvent){
			var diameter = sap.ui.getCore().byId("id1OriNsd").getValue();
			var diaMNo   = oEvent.getSource().getValue();
			
			if(diaMNo){
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = 0.00; 
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100mm");
				}
				
				if(parseFloat(diaMNo) > parseFloat(diameter)){
					diaMNo = 0.00;
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original NSD Value.");
				}
			}
			/*if( diaMNo.toString().indexOf(".") >= 0 )
			{
				diaMNo = diaMNo.toString().substring(0, nsdVal.toString().indexOf(".") + 2);
				oEvent.getSource().setValue(diaMNo);
			}*/
			if( diaMNo.toString().indexOf(".") >= 0 )
			{
				diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
				oEvent.getSource().setValue(diaMNo);
			}
		},		
		
		
		onNumberValid: function(oEvent){
			var diaMNo   = oEvent.getSource().getValue();
			
			if(diaMNo){
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);
				}
				
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = 0.00; 
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100mm");
				}	
			}
			if( diaMNo.toString().indexOf(".") >= 0 )
			{
			diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
			oEvent.getSource().setValue(diaMNo);
			}
		},
		
		
		NumberPSIValid: function(oEvent){
            var text = oEvent.getSource().getValue();
            var code = text.charCodeAt(text.length-1);  
            	if ( !(code > 47 && code < 58)){
            		text = text.substring( 0 , text.length - 1 );
            	}
            	oEvent.getSource().setValue(text);   
            },
		
            NumberHardnessValid : function(oEvent)
			{ 
				var val = oEvent.getSource().getValue();
				if(val){
					if(isNaN(val)){
						val = val.substring(0, val.length - 1);
						oEvent.getSource().setValue(val);
					}
				}
			},
    		/*NumberHardnessValid: function(oEvent){
                var text = oEvent.getSource().getValue();
                var code = text.charCodeAt(text.length-1);  
                	if ( !(code > 47 && code < 58)){
                		text = text.substring( 0 , text.length - 1 );
                	}
                	oEvent.getSource().setValue(text);   
                },*/
            
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onComparisonChange: function(oEvent){
			this.CompQty = oEvent.getParameters().selectedItem.getAggregation("customData")[0].getValue();
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
// Added on April 25		
	addFitmentRow: function(){
			debugger
			var idFitmentDetailsTable2 = this.getView().byId("idFitmentDetailsTable2");
			var headerData = this.getView().getModel("headersModel").getData();
			var tblLength = idFitmentDetailsTable2.getItems().length;
			var matnr     = this.getView().getModel("materialJson").getData();
			var tblLength = idFitmentDetailsTable2.getItems().length;
			
			if(tblLength >= matnr[0].TotQty){
				sap.m.MessageToast.show("Exceeds allowed tyres for fitment");
				return false;
			}			
			
			this.getFitmentTableObject();
			
			var testKey = this.getView().getModel("headersModel").getData().testMethodKey;
			var length = idFitmentDetailsTable2.getItems().length;
			
			if(testKey == "01"){
				var grp = matnr[0].Group;
				idFitmentDetailsTable2.getItems()[length-1].getCells()[1].setSelectedKey(grp);
				idFitmentDetailsTable2.getItems()[length-1].getCells()[1].setEnabled(false);
			}
			else if(testKey == "02"){
				var grp = matnr[0].Group;
				idFitmentDetailsTable2.getItems()[length-1].getCells()[1].setSelectedKey("");
				idFitmentDetailsTable2.getItems()[length-1].getCells()[1].setEnabled(true);
			}			
		},
		
		addReFitmentRow: function(){
			debugger
			var idReFitmentDetailsTable = this.getView().byId("idReFitmentDetailsTable");
			var headerData 	= this.getView().getModel("headersModel").getData();
			var tblLength 	= idReFitmentDetailsTable.getItems().length;
			var matnr     	= this.getView().getModel("RematerialJson").getData();
			var tblLength 	= idReFitmentDetailsTable.getItems().length;
			
			if(tblLength >= matnr[0].TotQty){
				sap.m.MessageToast.show("Exceeds allowed tyres for fitment");
				return false;
			}			
			
			this.getReFitmentTableObject();
			
			var testKey = this.getView().getModel("headersModel").getData().testMethodKey;
			var length = idReFitmentDetailsTable.getItems().length;
			
			if(testKey == "01"){
				var grp = matnr[0].Group;
				idReFitmentDetailsTable.getItems()[length-1].getCells()[1].setSelectedKey(grp);
				idReFitmentDetailsTable.getItems()[length-1].getCells()[1].setEnabled(false);
			}
			else if(testKey == "02"){
				var grp = matnr[0].Group;
				idReFitmentDetailsTable.getItems()[length-1].getCells()[1].setSelectedKey("");
				idReFitmentDetailsTable.getItems()[length-1].getCells()[1].setEnabled(true);
			}			
		},		
		
		
//////////////////////////////////////////////////////////////////////////////////////////////////		
// Added on April 25		
	materialChange: function(oEvent){
			
			debugger
			var idFitmentDetailsTable2 = this.getView().byId("idFitmentDetailsTable2");
			var items                  = idFitmentDetailsTable2.getItems();
			var headerData 			   = this.getView().getModel("headersModel").getData();
			var tblLength 			   = idFitmentDetailsTable2.getItems().length;
			var matnr     			   = this.getView().getModel("materialJson").getData();
			var tblLength              = idFitmentDetailsTable2.getItems().length;
			
            var arr = [];
            var str = {};
            str.Qty = 0;
            var lv_exist = false;            
           
			for(var i=0;i<tblLength;i++){
				lv_exist == false;
				if (arr.length > 0){
				    for(var j=0;j<arr.length;j++){
				    	if(items[i].getCells()[1].getSelectedKey() == arr[j].Group ){
				    		str.Qty = str.Qty + 1;
				    		lv_exist = true;
				    	}
					}
				    
				    if(lv_exist == false){
				    	str.Group = items[i].getCells()[1].getSelectedKey();
						str.Qty   = 1;
						arr.push(str);
				    }
				    
				}else{
				  str.Group = items[i].getCells()[1].getSelectedKey();
				  str.Qty   = 1;
				  arr.push(str);
				}
			}
			
			for(var j=0;j<arr.length;j++){
				for(var i=0;i<matnr.length;i++){
				 if( (arr[j].Group == matnr[i].Group) && (arr[j].Qty > matnr[i].Qty) ){
					 sap.m.MessageToast.show("Exceeds allowed tyres for fitment");
					 oEvent.getSource().setSelectedKey("");
					 return false;  
				 }					
				}
			}
		},
		
		
	RematerialChange: function(oEvent){
			
			debugger
			var idReFitmentDetailsTable = this.getView().byId("idReFitmentDetailsTable");
			var items                   = idReFitmentDetailsTable.getItems();
			var headerData 			    = this.getView().getModel("headersModel").getData();
			var tblLength 			    = idReFitmentDetailsTable.getItems().length;
			var matnr     			    = this.getView().getModel("RematerialJson").getData();
			var tblLength               = idReFitmentDetailsTable.getItems().length;
			
            var arr = [];
            var str = {};
            str.Qty = 0;
            var lv_exist = false;            
           
			for(var i=0;i<tblLength;i++){
				lv_exist == false;
				if (arr.length > 0){
				    for(var j=0;j<arr.length;j++){
				    	if(items[i].getCells()[1].getSelectedKey() == arr[j].Group ){
				    		str.Qty = str.Qty + 1;
				    		lv_exist = true;
				    	}
					}
				    
				    if(lv_exist == false){
				    	str.Group = items[i].getCells()[1].getSelectedKey();
						str.Qty   = 1;
						arr.push(str);
				    }
				    
				}else{
				  str.Group = items[i].getCells()[1].getSelectedKey();
				  str.Qty   = 1;
				  arr.push(str);
				}
			}
			
			for(var j=0;j<arr.length;j++){
				for(var i=0;i<matnr.length;i++){
				 if( (arr[j].Group == matnr[i].Group) && (arr[j].Qty > matnr[i].Qty) ){
					 sap.m.MessageToast.show("Exceeds allowed tyres for fitment");
					 oEvent.getSource().setSelectedKey("");
					 return false;  
				 }					
				}
			}
		},		
//////////////////////////////////////////////////////////////////////////////////////////////////		
		
		onDeleteFitmentRow: function(oEvent){
			var path = oEvent.getSource()._getBindingContext("fitmentTableModel").getPath().split('/')[1];
			var fitmentTable=this.getView().byId("idFitmentDetailsTable2"); 

		     if (path !== -1) {
		    	 fitmentTable.getModel("fitmentTableModel").getData().splice(path,1);
		    	 fitmentTable.getModel("fitmentTableModel").refresh();
		     }
		},
		
		ReonDeleteFitmentRow: function(oEvent){
			var path = oEvent.getSource()._getBindingContext("RefitmentTableModel").getPath().split('/')[1];
			var RefitmentTable = this.getView().byId("idReFitmentDetailsTable"); 

		     if (path !== -1) {
		    	 RefitmentTable.getModel("RefitmentTableModel").getData().splice(path,1);
		    	 RefitmentTable.getModel("RefitmentTableModel").refresh();
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
		fitmentTabSaveValidation: function(){
			var validFit = true;
			var idFitmentDetailsTable2 = this.getView().byId("idFitmentDetailsTable2");
			var items = idFitmentDetailsTable2.getItems();

			for(var i = 0; i<items.length ; i++){
				for(var j=0;j<4;j++){
					if(j==0 || j==1){
						if(items[i].getCells()[j].getSelectedKey() == ""){
							items[i].getCells()[j].addStyleClass("myStateError");
							validFit=false;
						}else{
							items[i].getCells()[j].removeStyleClass("myStateError");
						}	
					}
					
					if(j==2){
						if(items[i].getCells()[j].getValue() == ""){
							items[i].getCells()[j].setValueState("Error");
							validFit=false;
						}else{
							items[i].getCells()[j].setValueState("None");
						}	
					}					

					if(j==3){
						if(items[i].getCells()[j].getType() != "Accept"){
							items[i].getCells()[j].setType("Reject");
							validFit=false;
						}else{
							items[i].getCells()[j].setType("Accept");	
						}	
					}
				}				
			}
			return validFit;

		},
		
		
		RefitmentTabSaveValidation: function(){
			var validReFit = true;
			var idReFitmentDetailsTable = this.getView().byId("idReFitmentDetailsTable");
			var items = idReFitmentDetailsTable.getItems();

			for(var i = 0; i<items.length ; i++){
				for(var j=0;j<4;j++){
					if(j==0 || j==1){
						if(items[i].getCells()[j].getSelectedKey() == ""){
							items[i].getCells()[j].addStyleClass("myStateError");
							validReFit=false;
						}else{
							items[i].getCells()[j].removeStyleClass("myStateError");
						}	
					}
					
					if(j==2){
						if(items[i].getCells()[j].getValue() == ""){
							items[i].getCells()[j].setValueState("Error");
							validReFit=false;
						}else{
							items[i].getCells()[j].setValueState("None");
						}	
					}					

					if(j==3){
						if(items[i].getCells()[j].getType() != "Accept"){
							items[i].getCells()[j].setType("Reject");
							validReFit=false;
						}else{
							items[i].getCells()[j].setType("Accept");	
						}	
					}
				}				
			}
			return validReFit;

		},		
//////////////////////////////////////////////////////////////////////////////////////////////////		
//amit change 19/07/2019
		
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
		
		onReviewAndSave: function(){
			debugger
			var valid = this.vehicleTabSaveValidation();
			var chk   = this.validateroute();
			    if(!chk){
			    	return false
			    }
			    
			var validFit   = this.fitmentTabSaveValidation();
			var validReFit = this.RefitmentTabSaveValidation();
			
			var headerData = this.getView().getModel("headersModel").getData();
			var idFitmentDetailsTable2  = this.getView().byId("idFitmentDetailsTable2");
			var idReFitmentDetailsTable = this.getView().byId("idReFitmentDetailsTable");
			
			var arr= [];
			
			if (idFitmentDetailsTable2.length < 1 && idReFitmentDetailsTable < 1 ){
				sap.m.MessageToast.show("No items for saving.");
				return false;
			}
			
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
				
				
				var arr= [];
				var Reitems = idReFitmentDetailsTable.getItems();
				for(var i = 0; i<Reitems.length ; i++){
					arr.push(Reitems[i].getCells()[1].getSelectedKey());
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
			
			
			if(valid && validFit && validReFit && chk){
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
			var fitmentDetailTable   = this.getView().byId("idFitmentDetailsTable2").getModel("fitmentTableModel");
			var RefitmentDetailTable = this.getView().byId("idReFitmentDetailsTable").getModel("RefitmentTableModel");
			
			
			fitmentData = this.createFitmentSaveObject(regNo.getValue(), fitmentDetailTable, fitmentData, RefitmentDetailTable);
			
			var data =  fitmentDetailTable.getData();
			if (data != undefined){
				var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
				var itemno = idFitmentPlanTable.getSelectedItems()[0].getCells()[9].getText();
			}
			
			var redata =  RefitmentDetailTable.getData();
			if (redata != undefined){
				var idReFitmentPlanTable = this.getView().byId("idReFitmentPlanTable");
				var itemno = idReFitmentPlanTable.getSelectedItems()[0].getCells()[9].getText();
			}
			
			debugger
			var payload = {					
					PlanGuid : this.PlanGuid,
					PlanRevno : this.PlanRev,
					PlanItemNo : itemno,
					RegNo : regNo.getValue(),
					FitmentNo : "",
					InspNo : "",
					InspDt : null,
					//FitmentDt : null,
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
	createFitmentSaveObject: function(vehNo, model,fitmentData, remodel ){
		    debugger
			var data =  model.getData();
			if (data != undefined){
			
			var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");			
			var itemno = idFitmentPlanTable.getSelectedItems()[0].getCells()[9].getText();			
			var fitTbl = this.getView().byId("idFitmentDetailsTable2").getItems();
			for(var i=0;i<data.length; i++){
				var obj={}
				obj.PlanGuid = this.PlanGuid;
				obj.PlanRevno = this.PlanRev;
				obj.PlanItemNo = itemno;
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
			}
			
		 // refitment table
			var redata = remodel.getData();
			if (redata != undefined){
			var idReFitmentPlanTable = this.getView().byId("idReFitmentPlanTable");
			var itemno = idReFitmentPlanTable.getSelectedItems()[0].getCells()[9].getText();			
			var fitTbl = this.getView().byId("idReFitmentDetailsTable").getItems();
			for(var i=0;i<redata.length; i++){
				var obj={}
				obj.PlanGuid 		= this.PlanGuid;
				obj.PlanRevno 		= this.PlanRev;
				obj.PlanItemNo 		= itemno;
				obj.RegNo 			= vehNo;
				obj.TyrePosition 	= redata[i].Position;;
				obj.RemoveOk 		= "O";
				obj.StnclNumber 	= redata[i].StencilNo;
				obj.GroupType 		= fitTbl[i].getCells()[1].getSelectedKey();
				obj.IpCondition 	= redata[i].IpCondition;
				obj.IpPsi 			= parseInt(redata[i].IpPsi);
				obj.Hardness 		= redata[i].Hardness;
				obj.OrgNsd 			= redata[i].OrigNsd;
				
				if(redata[i].G1Nsd == ""  || redata[i].G1Nsd == undefined){
					obj.G1Nsd="00.0";
				}else{
					obj.G1Nsd = redata[i].G1Nsd;
				}
				if(redata[i].G2Nsd == "" || redata[i].G2Nsd == undefined){
					obj.G2Nsd="00.0";
				}else{
					obj.G2Nsd = redata[i].G2Nsd;
				}
				if(redata[i].G3Nsd == "" || redata[i].G3Nsd == undefined){
					obj.G3Nsd="00.0";
				}else{
					obj.G3Nsd = redata[i].G3Nsd;
				}
				if(redata[i].G4Nsd == "" || redata[i].G4Nsd == undefined){
					obj.G4Nsd="00.0";
				}else{
					obj.G4Nsd = redata[i].G4Nsd;
				}
				if(redata[i].G5Nsd == "" || redata[i].G5Nsd == undefined){
					obj.G5Nsd="00.0";
				}else{
					obj.G5Nsd = redata[i].G5Nsd;
				}
				if(redata[i].G6Nsd == "" || redata[i].G6Nsd == undefined){
					obj.G6Nsd="00.0";
				}else{
					obj.G6Nsd = redata[i].G6Nsd;
				}
				
				var OrigNsd = obj.OrgNsd;
				var diffnsd = parseFloat(OrigNsd) - parseFloat(redata[i].MinimumNSD);
				var wear;
				Wear = ( diffnsd / ( parseFloat(OrigNsd) - 0.8)) * 100;				
			
				obj.MinNsd = "" + redata[i].MinimumNSD + "";
				obj.Wear = wear;
				obj.MilageProj = 0;
				obj.Remarks= redata[i].Remarks;
				fitmentData.push(obj);
			}			
			}
			
			return fitmentData;
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
	onCreateFitmentSet: function(payload){
		    debugger
			var oView = this.getView();
			var sPathFitmentHeaderSet = "/FitmentHeaderSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsFitmentHeaderSet = {};
			oParamsFitmentHeaderSet.context = "";
			oParamsFitmentHeaderSet.urlParameters = "";
			
			oParamsFitmentHeaderSet.success = function(oData, oResponse) { 						// success handler
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
	handleIconTabBarSelect: function(oEvent){
		    debugger
		    
		    var fititem;
		    var Refititem;
		    var error = false;
		    
			var key = oEvent.getSource().getSelectedKey();
			var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
			var idReFitmentPlanTable = this.getView().byId("idReFitmentPlanTable");
			
			var Relength = idReFitmentPlanTable.getSelectedItems().length;			
			var length = idFitmentPlanTable.getSelectedItems().length;
			
			var mandt = this.checkMandtVehicle();
			var vehNo = this.getView().byId("FVehicleNoEdit").getValue();
			var mechCond = this.getView().byId("idmccon").getSelectedKey();
			var miloWork = this.getView().byId("idEarPSI").getSelectedKey();
			
			var headersModel = this.getView().getModel("headersModel");
			var data1 = headersModel.getData();
			
			// check if user has selected record for fitment
			if(length < 1 && Relength < 1){
				oEvent.getSource().setSelectedKey("A");
				sap.m.MessageToast.show("Please select atleast one row for Fitment.");
				return false;	
			}			
		    
			//check if both items are equal if user has selected record from both tables
			for(var i=0;i<idFitmentPlanTable.getItems().length;i++){
			 if(idFitmentPlanTable.getItems()[i].getSelected()==true){
			  idFitmentPlanTable.getItems()[i].getCells()[1].setValueState("None");
			  fititem = idFitmentPlanTable.getItems()[i].getCells()[9].getText(); 
			 }
			};
			
			for(var i=0;i<idReFitmentPlanTable.getItems().length;i++){
				 if(idReFitmentPlanTable.getItems()[i].getSelected()==true){
				  idReFitmentPlanTable.getItems()[i].getCells()[1].setValueState("None");
				  Refititem = idReFitmentPlanTable.getItems()[i].getCells()[9].getText(); 
				 }
			};	
			
			if( (length > 0 && Relength > 0) && (fititem != Refititem) ){
				oEvent.getSource().setSelectedKey("A");
				sap.m.MessageToast.show("Items selected in Fitment table and Refitment table are not identical");
				return false;
			}			
		
			if(length > 0){
				var fmethod       = idFitmentPlanTable.getSelectedItems()[0].getCells()[0].getText();
				var fSelectedKey  = idFitmentPlanTable.getSelectedItems()[0].getCells()[1].getSelectedKey();
				var fitData = this.getView().byId("idFitmentDetailsTable2").getModel("fitmentTableModel").getData();
				
				var ftyre         = idFitmentPlanTable.getSelectedItems()[0].getCells();
				this.planitem     = fititem;
				ftyre[1].setValueState("None");
			}
			
			if(Relength > 0){
				var rmethod       = idReFitmentPlanTable.getSelectedItems()[0].getCells()[0].getText();
				var rSelectedKey  = idReFitmentPlanTable.getSelectedItems()[0].getCells()[1].getSelectedKey();
				var rtyre         = idReFitmentPlanTable.getSelectedItems()[0].getCells();
				this.planitem     = Refititem;
				rtyre[1].setValueState("None");
			}		
			
			if(fmethod == "Stand Alone" && fSelectedKey == ""){
				ftyre[1].setValueState("Error");
				error = true;
			}
			if(rmethod == "Stand Alone" && rSelectedKey == ""){
				rtyre[1].setValueState("Error");
				error = true;
			}
			if(error == true){
				oEvent.getSource().setSelectedKey("A");
				sap.m.MessageToast.show("Select Tyre Type for selected row.");
				return false;
			}			
			   
			//check for qty in case of Tyre Type
			if(length > 0 && fmethod == "Stand Alone" && fSelectedKey == "01"){
				var qty = idFitmentPlanTable.getSelectedItems()[0].getCells()[7].getText();
				if(qty == "" || qty == 0)
				{
				 ftyre[1].setValueState("Error");
				 error = true;	
				}
			}
			
			if(length > 0 && fmethod == "Stand Alone" && fSelectedKey == "02"){
				var qty = idFitmentPlanTable.getSelectedItems()[0].getCells()[8].getText();
				if(qty == "" || qty == 0)
				{
				 ftyre[1].setValueState("Error");
				 error = true;	
				}
			}
			
			if(Relength > 0 && rmethod == "Stand Alone" && rSelectedKey == "01"){
				var qty = idReFitmentPlanTable.getSelectedItems()[0].getCells()[7].getText();
				if(qty == "" || qty == 0)
				{
				 rtyre[1].setValueState("Error");
				 error = true;	
				}
			}
			
			if(Relength > 0 && rmethod == "Stand Alone" && rSelectedKey == "02"){
				var qty = idReFitmentPlanTable.getSelectedItems()[0].getCells()[8].getText();
				if(qty == "" || qty == 0)
				{
				 rtyre[1].setValueState("Error");
				 error = true;	
				}
			}
			if(error == true){
				oEvent.getSource().setSelectedKey("A");
				sap.m.MessageToast.show("Qty is not available for selected Tyre Type");
				return false;
			}	
			
			//bind material model for fitment 
			var matData= {};
			var Qty;
			if(length > 0 && fmethod == "Stand Alone"){
				var type = "01";
				data1.testMethod 	= "Stand Alone";
				data1.testMethodKey = "01";
				if(fSelectedKey == "01"){
					matData.TestGroup = idFitmentPlanTable.getSelectedItems()[0].getCells()[3].getText();
					Qty   			  =	idFitmentPlanTable.getSelectedItems()[0].getCells()[7].getText();
					matData.TestQty   = parseInt(Qty);
					matData.TotQty    = parseInt(Qty);
				}else if(fSelectedKey == "02"){
					matData.BmGroup   = idFitmentPlanTable.getSelectedItems()[0].getCells()[5].getText();
					Qty               = idFitmentPlanTable.getSelectedItems()[0].getCells()[8].getText();
					matData.BmQty     = parseInt(Qty);
					matData.TotQty    = parseInt(Qty);
				}				 
			}
			
			if(length > 0 && fmethod == "Head On"){				
				var type = "02";
				data1.testMethod 	= "Head On";
				data1.testMethodKey = "02";
					matData.TestGroup = idFitmentPlanTable.getSelectedItems()[0].getCells()[3].getText();
					matData.BmGroup   = idFitmentPlanTable.getSelectedItems()[0].getCells()[5].getText();	
					
					Qty   			  =	idFitmentPlanTable.getSelectedItems()[0].getCells()[7].getText();					
					matData.TestQty   = parseInt(Qty);
					matData.TotQty    = parseInt(Qty);
					
					Qty   			  =	idFitmentPlanTable.getSelectedItems()[0].getCells()[8].getText();					
					matData.BmQty     = parseInt(Qty);
					matData.TotQty    = matData.TotQty+parseInt(Qty);
					
					matData.enabled   = false;
						 
			}			
			
			if(Relength > 0 && rmethod == "Stand Alone"){
				var type = "01";
				data1.testMethod 	= "Stand Alone";
				data1.testMethodKey = "01";
				if(rSelectedKey == "01"){
					matData.ReTestGroup = idReFitmentPlanTable.getSelectedItems()[0].getCells()[3].getText();
					Qty   			    = idReFitmentPlanTable.getSelectedItems()[0].getCells()[7].getText();
					matData.ReTestQty   = parseInt(Qty);
					matData.ReTotQty    = parseInt(Qty);
					
				}else if(rSelectedKey == "02"){
					matData.ReBmGroup = idReFitmentPlanTable.getSelectedItems()[0].getCells()[5].getText();
					Qty               = idReFitmentPlanTable.getSelectedItems()[0].getCells()[8].getText();
					matData.ReBmQty   = parseInt(Qty);
					matData.ReTotQty  = parseInt(Qty);
				}				 
			}			
			
			
			if(Relength > 0 && rmethod == "Head On"){				
				var type = "02";
				data1.testMethod 	= "Head On";
				data1.testMethodKey = "02";
				matData.ReTestGroup = idReFitmentPlanTable.getSelectedItems()[0].getCells()[3].getText();
				matData.ReBmGroup   = idReFitmentPlanTable.getSelectedItems()[0].getCells()[5].getText();	
				
				Qty   			    = idReFitmentPlanTable.getSelectedItems()[0].getCells()[7].getText();
				matData.ReTestQty   = parseInt(Qty);
				matData.ReTotQty    = parseInt(Qty);
				Qty   			    = idReFitmentPlanTable.getSelectedItems()[0].getCells()[8].getText();
				matData.ReBmQty     = parseInt(Qty);
				matData.ReTotQty    = matData.ReTotQty+parseInt(Qty);
				
				matData.enabled   = false;
						 
			}			
			
			this.bindMaterialSet(matData, type);
			headersModel.refresh();
			

			if(length > 0){
			this.getView().byId("idFitmentDetailsTable2").setVisible(true);
			}
			if(Relength > 0){
			 this.getView().byId("idReFitmentDetailsTable").setVisible(true);
			}
			
			if(key == "B" || key == "G"){
				
					if(vehNo == "" || !mandt){
						oEvent.getSource().setSelectedKey("D");
						this.vehicleTabSaveValidation();
						sap.m.MessageToast.show("Please fill all mandatory fields to proceed further.");
						return false;
					}else{
						var vehNo = this.getView().byId("FVehicleNoEdit").getValue();						
						var config = this.getView().byId("ConfigurationIDID").getSelectedKey();
						
						this.bindTyrePositionSet(config,vehNo);
						var headersModel = this.getView().getModel("headersModel");
						var data1 = headersModel.getData();
						data1.VehicleNo = vehNo;
						headersModel.refresh();
					}
					if(!this.validateroute()){
						this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("D");
						return false;
					 }	
					this.getView().byId("idReviewSaveBtn").setVisible(true);
			}
			else{
				this.getView().byId("idReviewSaveBtn").setVisible(false);
			}
			
		 
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
	checkMandtVehicle: function(){
			var valid = true; 
			var mechCond = this.getView().byId("idmccon").getSelectedKey();
			var miloWork = this.getView().byId("idEarPSI").getSelectedKey();
			var idReason = this.getView().byId("idReason").getSelectedKey();
			var miloRead = this.getView().byId("idMilReading").getValue();
			
			var inputs = [			
				this.getView().byId("idCustomerName"),
				this.getView().byId("VehicleModelID"),
				this.getView().byId("FVehicleNoEdit"),
				this.getView().byId("FFitmentDateEdit"),
				this.getView().byId("FRegistrationYearEdit"),
				this.getView().byId("FVehicleCCEdit"),
			];
			jQuery.each(inputs, function(i, input) {
					if(input.getValue() == ""){
						valid = false;
//						input.setValueState("Error");
					}else{
//						input.setValueState("None");
					}
			});
			
			var selects = [
				this.getView().byId("ConfigurationIDID"),
				this.getView().byId("VehicleMakeID"),
				this.getView().byId("idmccon"),
				this.getView().byId("idEarPSI"),
			];
			jQuery.each(selects, function(i, select) {
					if(select.getSelectedKey() == ""){
						valid = false;
//						select.addStyleClass("myStateError");
					}else{
//						select.removeStyleClass("myStateError");
					}
			});
				
			if(mechCond == "2"){
				if(idReason == ""){
					valid = false;
//					this.getView().byId("idReason").addStyleClass("myStateError");
				}else{
//					this.getView().byId("idReason").removeStyleClass("myStateError");
				}
			}
			if(miloWork == "Y"){
				if(miloRead == ""){
					valid = false;
//					this.getView().byId("idMilReading").setValueState("Error");
				}else{
//					this.getView().byId("idMilReading").setValueState("None");
				}
			}			
			return valid;
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onPostionChange: function(oEvent){
			
			debugger
			
			var headersModel =  this.getView().getModel("headersModel").getData();
			var method = headersModel.testMethodKey;

				var idFitmentDetailsTable2   = this.getView().byId("idFitmentDetailsTable2");
				var idReFitmentDetailsTable  = this.getView().byId("idReFitmentDetailsTable");
				
				var index=idFitmentDetailsTable2.getItems().indexOf(oEvent.getSource().getParent());
				
				var items   = idFitmentDetailsTable2.getItems();
				var Reitems = idReFitmentDetailsTable.getItems();
				var arr = [];
				
				for(var i=0;i<items.length;i++){
					if(items[i].getCells()[0].getSelectedKey() != ""){
						var key = items[i].getCells()[0].getSelectedKey();
						arr.push(key);
					}
				}
				
				for(var i=0;i<Reitems.length;i++){
					if(Reitems[i].getCells()[0].getSelectedKey() != ""){
						var key = Reitems[i].getCells()[0].getSelectedKey();
						arr.push(key);
					}
				}					
				
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
				items[index].getCells()[2].setValue("");
		},
		
		
		onRePostionChange: function(oEvent){
			
			var headersModel =  this.getView().getModel("headersModel").getData();
			var method = headersModel.testMethodKey;

				var idFitmentDetailsTable2   = this.getView().byId("idFitmentDetailsTable2");
				var idReFitmentDetailsTable  = this.getView().byId("idReFitmentDetailsTable");
				
				var index=idReFitmentDetailsTable.getItems().indexOf(oEvent.getSource().getParent());
				
				var items   = idFitmentDetailsTable2.getItems();
				var Reitems = idReFitmentDetailsTable.getItems();
				var arr = [];
				
				for(var i=0;i<items.length;i++){
					if(items[i].getCells()[0].getSelectedKey() != ""){
						var key = items[i].getCells()[0].getSelectedKey();
						arr.push(key);
					}
				}
				
				for(var i=0;i<Reitems.length;i++){
					if(Reitems[i].getCells()[0].getSelectedKey() != ""){
						var key = Reitems[i].getCells()[0].getSelectedKey();
						arr.push(key);
					}
				}					
				
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
				if(Reitems[index].getCells()[1].getEnabled()){
				   Reitems[index].getCells()[1].setSelectedKey("");
				}				
				Reitems[index].getCells()[2].setValue("");
		},	
		
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onStencilChange: function(oEvent){			 
			
				var value = oEvent.getSource().getValue();
			    this.event= oEvent.getSource(); 
			    this.path = parseInt(oEvent.getSource().getBindingContext("fitmentTableModel").getPath().split("/")[1]);
				
			    
			    this.stencil = oEvent.getSource().getId(); 
				var Group = oEvent.getSource().getParent().getCells()[1].getSelectedKey();
				oEvent.getSource().getParent().getCells()[1].setValueState("None");
				 
				if(Group == ""){
				 oEvent.getSource().getParent().getCells()[1].setValueState("Error");
				 sap.m.MessageToast.show("Material is required");
				 oEvent.getSource().setValue();
				 return false;
				 }	
			    			    
					debugger
					var sServiceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/";
					var sPathStencil = "/StencilValidateSet(PlanGuid='"+this.PlanGuid+"',PlanRev='"+this.PlanRev+"',PlanItemNo='"+this.planitem+"',StnclNumber='"+value+"')";
					var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
					var oParamsStencil = {};
					oParamsStencil.context = "";
					oParamsStencil.urlParameters = "";
					oParamsStencil.success = function(oData, oResponse) {
						
						if(oData.Error=="X"){
						  sap.m.MessageToast.show("Same Stencil is already fitted in another Vehcile");
						  that.event.setValue();
						  return false;
						}else{
							
							var idFitmentDetailsTable2  = that.getView().byId("idFitmentDetailsTable2");
							var items = idFitmentDetailsTable2.getItems();
							
							for(var i=0;i<items.length;i++){
								if(i !== that.path){
									var rowvalue = items[i].getCells()[2].getValue();
									if(value.toLowerCase() == rowvalue.toLowerCase()){
										that.event.setValue();
										sap.m.MessageToast.show("Stencil Number cannot be repeated.");
										return false;
									}
								}
							}
						}
					};
					oParamsStencil.error = function(oError) {
						jQuery.sap.log.error("read publishing group data failed");
					}.bind(this);
					frameworkODataModel.read(sPathStencil, oParamsStencil);
					frameworkODataModel.attachRequestCompleted(function() {
					});
		},
	
//////////////////////////////////////////////////////////////////////////////////////////////////
		checkMaxGroove: function(){
			var arr=[];
			var idGrooveG1 = sap.ui.getCore().byId("idGrooveG1").getValue();
			var idGrooveG2 = sap.ui.getCore().byId("idGrooveG2").getValue();
			var idGrooveG3 = sap.ui.getCore().byId("idGrooveG3").getValue();
			var idGrooveG4 = sap.ui.getCore().byId("idGrooveG4").getValue();
			var idGrooveG5 = sap.ui.getCore().byId("idGrooveG5").getValue();
			var idGrooveG6 = sap.ui.getCore().byId("idGrooveG6").getValue();
			var idMinNsd   = sap.ui.getCore().byId("idMinNsd");
			if(idGrooveG1 !==""){
				arr.push(idGrooveG1);
			}
			if(idGrooveG2 !==""){
				arr.push(idGrooveG2);
			}
			if(idGrooveG3 !==""){
				arr.push(idGrooveG3);
			}
			if(idGrooveG4 !==""){
				arr.push(idGrooveG4);
			}
			if(idGrooveG5 !==""){
				arr.push(idGrooveG5);
			}
			if(idGrooveG6 !==""){
				arr.push(idGrooveG6);
			}
			
			var minNsd = Math.min.apply(null,arr);
			if(minNsd == Infinity){
				idMinNsd.setValue("");
			}else{
				idMinNsd.setValue(minNsd);
			}
			
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		checkMaxGrooveRe: function(){
			var arr=[];
			var idGrooveG1 = sap.ui.getCore().byId("id1GrooveG1").getValue();
			var idGrooveG2 = sap.ui.getCore().byId("id1GrooveG2").getValue();
			var idGrooveG3 = sap.ui.getCore().byId("id1GrooveG3").getValue();
			var idGrooveG4 = sap.ui.getCore().byId("id1GrooveG4").getValue();
			var idGrooveG5 = sap.ui.getCore().byId("id1GrooveG5").getValue();
			var idGrooveG6 = sap.ui.getCore().byId("id1GrooveG6").getValue();
			var idMinNsd   = sap.ui.getCore().byId("id1MinNsd");
			if(idGrooveG1 !==""){
				arr.push(idGrooveG1);
			}
			if(idGrooveG2 !==""){
				arr.push(idGrooveG2);
			}
			if(idGrooveG3 !==""){
				arr.push(idGrooveG3);
			}
			if(idGrooveG4 !==""){
				arr.push(idGrooveG4);
			}
			if(idGrooveG5 !==""){
				arr.push(idGrooveG5);
			}
			if(idGrooveG6 !==""){
				arr.push(idGrooveG6);
			}
			
			var minNsd = Math.min.apply(null,arr);
			if(minNsd == Infinity){
				idMinNsd.setValue("");
			}else{
				idMinNsd.setValue(minNsd);
			}
			
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
//					**************Previous Code******************
		onMechanicalCon:function(){
			var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Mechanical_ReasonSet";
			var selectreas=that.getView().byId("idReason");
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false,
					false, null);
			if(jModel.getData().d.results.length){
				selectreas.unbindAggregation("items");
				//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
				selectreas.setModel(jModel);
				selectreas.bindAggregation("items", {
						path: "/d/results",
						template: new sap.ui.core.Item({
							key: "{CondReason}",
							text: "{Desc}"
						})
					});
			
			}},
		changeFitmetDate:function(evt){
			var date=evt.getSource().getDateValue();
			var today=new Date();
			today.setHours(00,00,00);
			if(date!=null){
				if(date.getTime()>today.getTime()){
					sap.m.MessageToast.show("Fitment Date Can't be Future Date");
					evt.getSource().setDateValue(null);
				}
			}
		},
		onCompanyChange:function(evt){
			evt.getSource().getParent().getBindingContext().getObject().NonJkCompany=evt.getParameter("selectedItem").getKey()
		var key=evt.getSource().getSelectedKey();
			that.selectedCompanyKey = key;
			if(key=="JK"){
				evt.getSource().getParent().getParent().getCells()[2].setShowValueHelp(true).setValue();
				evt.getSource().getParent().getParent().getCells()[3].setShowValueHelp(true).setValue();
				//evt.getSource().getParent().getParent().getCells()[2].setEditable(false);
					
				}else{
					evt.getSource().getParent().getParent().getCells()[2].setShowValueHelp(true).setValue();
					evt.getSource().getParent().getParent().getCells()[3].setShowValueHelp(true).setValue();
					//evt.getSource().getParent().getParent().getCells()[2].setEditable(false);
					
				}
		},
		onCompanyChange1:function(evt){
			evt.getSource().getParent().getBindingContext().getObject().NonJkCompany=evt.getParameter("selectedItem").getKey()
		var key=evt.getSource().getSelectedKey();
			that.selectedCompanyKey = key;
			if(key=="JK"){
				evt.getSource().getParent().getCells()[2].setShowValueHelp(true).setValue();
				evt.getSource().getParent().getCells()[3].setShowValueHelp(true).setValue();
				//evt.getSource().getParent().getParent().getCells()[2].setEditable(false);
					
				}else{
					evt.getSource().getParent().getCells()[2].setShowValueHelp(true).setValue();
					evt.getSource().getParent().getCells()[3].setShowValueHelp(true).setValue();
					//evt.getSource().getParent().getParent().getCells()[2].setEditable(false);
					
				}
		},
		
		
		
		onHubFragment:function(){
			var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_User_Fleet_HubSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'and CKunnr  eq '"+sap.ui.getCore().byId("idFleet").getName()+"'";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false,
					false, null);
			if(jModel.getData().d.results.length){
			var _valueHelpHubelectDialog = new sap.m.SelectDialog(
					{

						title : "Select Hub",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem(
									{
										title : "{HubName}",
										//description:"{HubCode}",
									

									}),
						},
						liveChange : function(oEvent) {
							var sValue = oEvent
									.getParameter("value");

 var oFilter = new sap.ui.model.Filter("HubName",sap.ui.model.FilterOperator.Contains,sValue);
							oEvent.getSource().getBinding("items")
									.filter([ oFilter ]);
						},
						confirm : [ this._handleHubClose, this ],
						cancel : [ this._handleHubClose, this ]
					});
			_valueHelpHubelectDialog.setModel(jModel);
			_valueHelpHubelectDialog.open();
			}else{
				sap.m.MessageToast.show("Your not authorised for any Hub in Fleet "+sap.ui.getCore().byId("idFleet").getValue())
			}
		},
		_handleHubClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				sap.ui.getCore().byId("idHub").setValue(
						oSelectedItem.getTitle());
				sap.ui.getCore().byId("idHub").setName(oSelectedItem.getBindingContext().getObject().HubCode);
				var value = that.getView().byId("HeaderIdTit").getText()+" ("+oSelectedItem.getTitle()+")";
				that.getView().byId("HeaderIdTit").setText(value);
				//this.onVehicalDetails();
				
			}

		},
		
		
		
		onFleetFragment:function(){
			var jModel = new sap.ui.model.json.JSONModel(that.FleetData);
			var _valueHelpFleetDialog = new sap.m.SelectDialog(
					{

						title : "Select Fleet",
						items : {
							path : "/results",
							template : new sap.m.StandardListItem(
									{
										title : "{FleetName}",
										customData : [ new sap.ui.core.CustomData(
												{
													key : "Key",
													value : "{Kunnr}"
												}) ],

									}),
						},
						liveChange : function(oEvent) {
							var sValue = oEvent
									.getParameter("value");

 var oFilter = new sap.ui.model.Filter("FleetName",sap.ui.model.FilterOperator.Contains,sValue);

							oEvent.getSource().getBinding("items")
									.filter([ oFilter ]);
						},
						confirm : [ this._handleFleetClose, this ],
						cancel : [ this._handleFleetClose, this ]
					});
			_valueHelpFleetDialog.setModel(jModel);
			_valueHelpFleetDialog.open();
		},
		_handleFleetClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var enrolMode =	oSelectedItem.getBindingContext().getObject().EnrolMode;
				if(enrolMode === "F"){
					that.getView().byId("IdSer").setVisible(false);
				}else{
					that.getView().byId("IdSer").setVisible(true);
				}
				sap.ui.getCore().byId("idHub").setEnabled(true).setValue();
				sap.ui.getCore().byId("idFleet").setValue(
						oSelectedItem.getTitle());
				that.getView().byId("HeaderIdTit").setText(oSelectedItem.getTitle());
				sap.ui.getCore().byId("idFleet").setName(oSelectedItem.getBindingContext().getObject().Kunnr);
				
			}

		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////		
		TempRex:function(evt){
			var value=evt.getSource().getValue();
			var regexp = /^\d+(\.\d{1,2})?$/;
			if(value!="-"){
				if(isNaN(value)){
					value = value.substring(0, value.length - 1);
					evt.getSource().setValue(value);
					}
				}
			var max = this.getView().byId("FLWeatherIDMaxEdit").getValue();
			
			if( max > 100)
				{
				value = value.substring(0, value.length - 1);
				evt.getSource().setValue(value);
				}
		},
		
		TempRex1:function(evt){
			var value=evt.getSource().getValue();
			var regexp = /^\d+(\.\d{1,2})?$/;
			
			if(isNaN(value)){
				value = value.substring(0, value.length - 1);
				evt.getSource().setValue(value);
				}
			var min = this.getView().byId("FLWeatherIDMinEdit").getValue();
			var max = this.getView().byId("FLWeatherIDMaxEdit").getValue();
			
			if(min > max)
				{
				value = value.substring(0, value.length - 1);
				evt.getSource().setValue(value);
				}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onVecRegNo:function(){
			
			
			if(kunnr){
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_VEHICLE_REG_NOSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'and CType eq 'F'and CKunnr  eq '"+ kunnr +"'";
			}else{
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_VEHICLE_REG_NOSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'and CType eq 'F'and CKunnr  eq '"+sap.ui.getCore().byId("idFleet").getName()+"'";
			}
				
				
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false,
						false, null);
				var _valueHelpClaimSelectDialog = new sap.m.SelectDialog(
						{

							title : "Select Vehicle",
							items : {
								path : "/d/results",
								template : new sap.m.StandardListItem(
										{
											title : "{RegNo}",
											customData : [ new sap.ui.core.CustomData(
													{
														key : "Key",
														value : "{RegNo}"
													}) ],

										}),
							},
							liveChange : function(oEvent) {
								var sValue = oEvent
										.getParameter("value");

 var oFilter = new sap.ui.model.Filter("RegNo",sap.ui.model.FilterOperator.Contains,sValue);

								oEvent.getSource().getBinding("items")
										.filter([ oFilter ]);
							},
							confirm : [ this._handleTypeClaimClose, this ],
							cancel : [ this._handleTypeClaimClose, this ]
						});
				_valueHelpClaimSelectDialog.setModel(jModel);
				_valueHelpClaimSelectDialog.open();
			},
			_handleTypeClaimClose : function(oEvent) {
				
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					this.getView().byId("FVehicleNoEdit").setValue(
							oSelectedItem.getTitle());
					this.onVehicalDetails();
					
				}

			},
//////////////////////////////////////////////////////////////////////////////////////////////////			
	onVehicalDetails:function(){
		debugger
		
		var regNo = this.getView().byId("FVehicleNoEdit").getValue();
		
		var sServiceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({"Content-Type" : "application/json"});		
	
		var fncSuccess = function(oData, oResponse) // success
		{
			debugger
        			
		that.getView().byId("VehicleMakeID").setSelectedKey(oData.VehicleSeq);
		that.getView().byId("VehicleMakeID").setEnabled(false);
		that.getView().byId("VehicleModelID").setValue(oData.VehicleModel);
		that.getView().byId("VehicleModelID").setEnabled(false);
		that.getView().byId("ConfigurationIDID").setSelectedKey(oData.ConfigCode);
		that.getView().byId("ConfigurationIDID").setEnabled(false);
		that.getView().byId("ChasisNoID").setValue(oData.ChassisNo);
		that.getView().byId("ChasisNoID").setEnabled(false);
		that.getView().byId("EngineNooID").setValue(oData.EngineNo);
		that.getView().byId("EngineNooID").setEnabled(false);
		that.getView().byId("FRegistrationYearEdit").setValue(oData.RegYear);
		that.getView().byId("FRegistrationYearEdit").setEnabled(false);
		that.getView().byId("FVehicleCCEdit").setValue(oData.VechCc);
		that.getView().byId("FVehicleCCEdit").setEnabled(false);
		that.getView().byId("FAvgRunningSpeedEdit").setValue(oData.AvgSpeed);
		that.getView().byId("FAvgRunningSpeedEdit").setEnabled(false);
		that.getView().byId("FLoopDistanceEdit").setValue(oData.LoopDist);
		that.getView().byId("FLoopDistanceEdit").setEnabled(false);
		that.getView().byId("idEarApp1").setValue(oData.Gvw);
		that.getView().byId("idEarApp1").setEnabled(false);
		}
		
		var fncError = function(oError) {
			debugger
			
		}		
		
		debugger
		oReadModel.read("/FitmentVehicleSet(RegNo='"+regNo+"')", {
		success : fncSuccess,
		error : fncError 
		});
			
		var sServiceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({"Content-Type" : "application/json"});		
	
		var fncSuccess = function(oData, oResponse) // success
		{
			debugger
        			
		that.getView().byId("VehicleMakeID").setSelectedKey(oData.VehicleSeq);
		
		}
		
		var fncError = function(oError) {
			debugger
			
		}		
		
		debugger
		oReadModel.read("/FitmentVehicleSet(RegNo='"+regNo+"')", {
		success : fncSuccess,
		error : fncError 
		});
		
		
	},
	
//////////////////////////////////////////////////////////////////////////////////////////////////	
	onVehicleDetails: function(){
		var oView = this.getView();
		var regNo = oView.byId("FVehicleNoEdit").getValue();
		debugger
		
		//for last 4 digits numeric-06-02-2019
		for(var i=regNo.length -1; i>regNo.length -4; i--){
			var j = regNo.charAt(i);
			if(isNaN(parseInt(j))){
				sap.m.MessageToast.show("Last four digits should be Numeric");
				return;
			} 
		}
		/////////////////////////
		
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
			oParamsVehicleDetailsSet.success = function(oData, oResponse) { // success handler
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
			oParamsVehicleDetailsSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("No Data Found.");
				this.getView().byId("VehicleMakeID").setSelectedKey();
			}.bind(this);
			frameworkODataModel.read(sPathVehicleDetailsSet, oParamsVehicleDetailsSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
			
			this.setEnablefields();
	},
	
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
			this._EntriesHelpDialog = sap.ui.xmlfragment("zfltfitcreate2.view.Customer",this);
			this.getView().addDependent(this._entriesHelpDialog);
			this._EntriesHelpDialog.setModel(CartListSetJModel, "CartListSetJModel");
			this._EntriesHelpDialog.open();
		},
		
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
		
		oParamsCartListSet.success = function(oData, oResponse) { // success handler
			CartListSetJModel.setData(oData.results);
		};
		
		oParamsCartListSet.error = function(oError) { // error handler&nbsp;
			jQuery.sap.log.error("Read/Publishing Group Data Failed.");
		    sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
	
		frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
		frameworkODataModel.attachRequestCompleted(function() {
		});
				
},
		  
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
	owner:function(evt){
				var key=evt.getSource().getSelectedKey();
				if(key=="01"){
					evt.getSource().getParent().getItems()[1].setVisible(false).setSelectedKey("");
					evt.getSource().getParent().getParent().getCells()[2].setShowValueHelp(true).setValue();
					evt.getSource().getParent().getParent().getBindingContext().getObject().ItemCode="";
					evt.getSource().getParent().getParent().getBindingContext().getObject().StnclNumber="";
					evt.getSource().getParent().getParent().getBindingContext().getObject().NonJkCompany="";
					//evt.getSource().getParent().getParent().getCells()[2].setEditable(false);
				}else if(key=="02"){
					evt.getSource().getParent().getItems()[1].setVisible(true).setSelectedKey("");
					evt.getSource().getParent().getParent().getCells()[2].setShowValueHelp(true).setValue();
					evt.getSource().getParent().getParent().getBindingContext().getObject().ItemCode="";
					evt.getSource().getParent().getParent().getBindingContext().getObject().StnclNumber="";
					evt.getSource().getParent().getParent().getBindingContext().getObject().NonJkCompany="";
					//evt.getSource().getParent().getParent().getCells()[2].setEditable(false);
				}
			},
			onItemNo:function(evt){
				that.Itemlfld=evt.getSource();
				var obj=that.Itemlfld.getParent().getBindingContext().getObject();
				if(that.flg==0){
					if(that.Itemlfld.getParent().getCells()[1].getItems()[0].getSelectedKey()==""){
						sap.m.MessageToast.show("Select Owner");
						return
					}else{
						if(that.Itemlfld.getParent().getCells()[1].getItems()[0].getSelectedKey()=="02"&&that.Itemlfld.getParent().getCells()[1].getItems()[1].getSelectedKey()==""){
							sap.m.MessageToast.show("Select Company");
							return	
						}
					}	
				}else{
					
						if(that.Itemlfld.getParent().getCells()[1].getSelectedKey()==""){
							sap.m.MessageToast.show("Select Company");
							return	
						}
					
				}
				if(kunnr){
					var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Item_CodeSet?$filter=CRegNo eq '"+this.getView().byId("FVehicleNoEdit").getValue()+"' and CType eq 'F' and CKunnr eq'"+kunnr+"'and COwner eq'"+obj.Owner+"'and CNonJkCompany eq'"+obj.NonJkCompany+"'";
				}else{
					var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Item_CodeSet?$filter=CRegNo eq '"+this.getView().byId("FVehicleNoEdit").getValue()+"' and CType eq 'F' and CKunnr eq'"+sap.ui.getCore().byId("idFleet").getName()+"'and COwner eq'"+obj.Owner+"'and CNonJkCompany eq'"+obj.NonJkCompany+"'";
				}
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false,
						false, null);
				var _valueHelpitemSelectDialog = new sap.m.SelectDialog(
						{

							title : "Select Description",
							items : {
								path : "/d/results",
								template : new sap.m.StandardListItem(
										{
											title :"{Maktx}" ,
											description:"{Matnr}",
											customData : [ new sap.ui.core.CustomData(
													{
														key : "Key",
														value : "{Maktx}"
													}) ],

										}),
							},
							liveChange : function(oEvent) {
								var sValue = oEvent.getParameter("value");

								var oFilter = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);

								oEvent.getSource().getBinding("items").filter([ oFilter ]);
							},
							confirm : [ this._handleTypeitmClose, this ],
							cancel : [ this._handleTypeitmClose, this ]
						});
				_valueHelpitemSelectDialog.setModel(jModel);
				_valueHelpitemSelectDialog.open();
			},
			_handleTypeitmClose : function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					
					
					that.Itemlfld.setValue(oSelectedItem.getTitle());
					that.Itemlfld.getParent().getBindingContext().getObject().ItemCode=oSelectedItem.getBindingContext().getObject().Matnr;
					that.Itemlfld.getParent().getBindingContext().getObject().StnclNumber="";
				}

			},
			onSerSheet:function(evt){
				var that=this;
				if(evt.getSource().getParent().getCells()[3].getValue()!=""){
						that.onServiceButton=evt.getSource();	
						var that = this;
							
						if (!that._SheetHelpDialog) {
							that._SheetHelpDialog = sap.ui.xmlfragment("zfltfitcreate2.view.ServiceSheet", that);
							that.getView().addDependent(that._SheetHelpDialog);}
						
					//that.data=oData;
					var ShetModel = new sap.ui.model.json.JSONModel(evt.getSource().getBindingContext().getObject());
					sap.ui.getCore().byId("IdObj1").setTitle("Vehicle Reg. Number");
					sap.ui.getCore().byId("IdObj1").setText(that.data.RegNo);
					sap.ui.getCore().byId("IdObj").setTitle("Stencil No");
					sap.ui.getCore().byId("IdObj").setText(evt.getSource().getBindingContext().getObject().StnclNumber);
					sap.ui.getCore().byId("IdObj5").setTitle("Position");
					sap.ui.getCore().byId("IdObj5").setText(evt.getSource().getBindingContext().getObject().Zposition+" ("+evt.getSource().getBindingContext().getObject().PositionDesc+")");
					var tab=sap.ui.getCore().byId("Servicetbl");
					tab.setModel(ShetModel)
					
					var temp = new sap.m.ColumnListItem({
						cells : [
						        // new sap.m.Text({text:""}),
						         new sap.m.Text({text:"{ServiceDesc}"}),
						         	        
						         ],selected:"{path:'ServiceSelect',formatter:'zfltfitcreate2.util.Formatter.SelecFlg'}"
					});
					
					tab.bindAggregation("items" ,{ path : "/VitemToServiceNvg/results",template : temp});
					that._SheetHelpDialog.open();
					}	
						
					
			// Create Method for final Save
					
				else{
					sap.m.MessageToast.show("Select Stencil No")
						}
					},
					onSerSheetVech:function(evt){
						var that=this;
						that.onServiceButton=evt.getSource();
						var that = this;
							
								if (!that._SheetHelpDialog) {
									that._SheetHelpDialog = sap.ui.xmlfragment("zfltfitcreate2.view.ServiceSheet", that);
									that.getView().addDependent(that._SheetHelpDialog);
								}
																
						
					//that.data=oData;
					var ShetModel = new sap.ui.model.json.JSONModel(that.data);
					sap.ui.getCore().byId("IdObj1").setTitle("Vehicle Reg. Number");
					sap.ui.getCore().byId("IdObj1").setText(that.data.RegNo);
					sap.ui.getCore().byId("IdObj").setVisible(false);

					sap.ui.getCore().byId("IdObj5").setVisible(false);

					var tab=sap.ui.getCore().byId("Servicetbl");
					tab.setModel(ShetModel)
					
					var temp = new sap.m.ColumnListItem({
						cells : [

						         new sap.m.Text({text:"{ServiceDesc}"}),
						        
						         ],selected:"{path:'ServiceSelect',formatter:'zfltfitcreate2.util.Formatter.SelecFlg'}"
					});
					
					//var oFilter = new sap.ui.model.Filter("Level", sap.ui.model.FilterOperator.EQ, "TYRE");
					tab.bindAggregation("items" ,{ path : "/RegnoToServiceNvg/results",template : temp});
					that._SheetHelpDialog.open();
					
						
						
					
					
					

					
				
			},
			detaiPress:function(evt){
				if(this.getView().byId("FVehicleCCEdit").getValue()==""){
					sap.m.MessageToast.show("Enter Vehicle CC ");
								return
							}

if(this.getView().byId("idEarPSI").getSelectedKey()==""){
					sap.m.MessageToast.show("Select Milometer Working");
								return
							}
if(this.getView().byId("idEarPSI").getSelectedKey()=="Y"){
if(this.getView().byId("idMilReading").getValue()==""||parseInt(this.getView().byId("idMilReading").getValue())==0){
sap.m.MessageToast.show("Enter Milometer Reading");
		return	
		
	}	
}

				if(evt.getSource().getParent().getCells()[3].getValue()!=""){
					that.entriesbutton=evt.getSource();
				if (!this._EntriesHelpDialog) {
					this._EntriesHelpDialog = sap.ui.xmlfragment(
						"zfltfitcreate2.view.Entries", this);
					this.getView().addDependent(this._EntriesHelpDialog);
					
				}
				if(evt.getSource().getBindingContext().getObject().Owner!="01" && evt.getSource().getBindingContext().getObject().NonJkCompany!="JK" ){
				sap.ui.getCore().byId("idEarGvw").setVisible(false);	
				}else{
					sap.ui.getCore().byId("idEarGvw").setVisible(true);	
				}
				that.EntreItem=evt.getSource().getParent();
				//evt.getSource().getBindingContext().getObject().KmCovered=this.getView().byId("KMovnEdit").getValue();
				sap.ui.getCore().byId("IdObj2").setTitle("Vehicle Reg. Number");
				sap.ui.getCore().byId("IdObj2").setText(that.data.RegNo);
				sap.ui.getCore().byId("IdObj3").setTitle("Stencil No");
				sap.ui.getCore().byId("IdObj3").setText(evt.getSource().getBindingContext().getObject().StnclNumber);
				sap.ui.getCore().byId("IdObj4").setTitle("Position");
				sap.ui.getCore().byId("IdObj4").setText(evt.getSource().getBindingContext().getObject().Zposition+" ("+evt.getSource().getBindingContext().getObject().PositionDesc+")");
				//evt.getSource().getParent().getCells()[3+that.flg].getModel("Recodings").getData().KmCovered=this.getView().byId("KMovnEdit").getValue();
				this._EntriesHelpDialog.setModel(evt.getSource().getParent().getCells()[3].getModel("Recodings"),"Recodings");
				var position = evt.getSource().getParent().getCells()[0].getText();
				var buttonType = evt.getSource().getType();
				if(buttonType == "Accept" && this.tyrePos == position)
					{
					sap.ui.getCore().byId("idEarSped").setSelectedKey(this.ipCond);
					sap.ui.getCore().byId("idEarCon").setValue(this.ipPSI);
					sap.ui.getCore().byId("idEarLed1").setValue(this.G1);
					sap.ui.getCore().byId("idEarSped1").setValue(this.G2);
					sap.ui.getCore().byId("idEarCon1").setValue(this.G3);
					sap.ui.getCore().byId("idEarPSI1").setValue(this.orRemarks);
					sap.ui.getCore().byId("idEarRou1").setValue(this.OrigalNsd);
					}
	    		this._EntriesHelpDialog.open();
				}else{
					sap.m.MessageToast.show("Select Stencil No")
				}
			},
			onTabelServiceOK:function(){
			var items=sap.ui.getCore().byId("Servicetbl").getSelectedItems();	
			if(items.length==0){
				//sap.m.MessageToast.show("Select the Service needed to tyre");
				that._SheetHelpDialog.close();
				that._SheetHelpDialog.destroy();
				that._SheetHelpDialog=undefined;
			}
			else{
				if(sap.ui.getCore().byId("IdObj5").getVisible()){
				that.onServiceButton.setType("Accept");
				}
				that.onServiceButton.setType("Accept");
				that._SheetHelpDialog.close();
				that._SheetHelpDialog.destroy();
				that._SheetHelpDialog=undefined;
			}
			},
			onTabelEntriesClose:function(){
				this._EntriesHelpDialog.close();
				this._EntriesHelpDialog.destroy();
				this._EntriesHelpDialog=undefined;
			},
			onTabelEntrieOk:function(){
				//that.EntreItem
				
				var CopyData=sap.ui.getCore().byId("iDKing").getModel("Recodings").getData();
				if(parseFloat(CopyData.G1Nsd)>parseFloat(CopyData.OrigNsd)){
					sap.m.MessageToast.show("G1 cant be greater than Original NSD");
					return
				}
				if(parseFloat(CopyData.G2Nsd)>parseFloat(CopyData.OrigNsd)){
					sap.m.MessageToast.show("G2 cant be greater than Original NSD");
					return
				}
				if(parseFloat(CopyData.G3Nsd)>parseFloat(CopyData.OrigNsd)){
					sap.m.MessageToast.show("G3 cant be greater than Original NSD");
					return
				}
				if(parseFloat(CopyData.G4Nsd)>parseFloat(CopyData.OrigNsd)){
					sap.m.MessageToast.show("G4 cant be greater than Original NSD");
					return
				}
				if(CopyData.IpCondition==""){
					sap.m.MessageToast.show("Select IP Condition");
					return
				}
				if(CopyData.IpPsi==""){
					sap.m.MessageToast.show("Enter IP (PSI)");
					return
				}else{
					if(CopyData.IpPsi < 100){
						sap.m.MessageToast.show("IP (PSI) cannot be less than 100");
						sap.ui.getCore().byId("idEarCon").setValue("");
						return
					}
				}
				
				if(parseFloat(CopyData.OrigNsd)<1 ||CopyData.OrigNsd==""){
					sap.m.MessageToast.show("Enter New Tyre NSD ");
					return
				}
				if(parseFloat(CopyData.G1Nsd)<1 ||CopyData.G1Nsd==""){
					sap.m.MessageToast.show("Enter G1 ");
					return
				}
				
				if(parseFloat(CopyData.G2Nsd)<1 ||CopyData.G2Nsd==""){
					sap.m.MessageToast.show("Enter G2");
					return
				}
				if(parseFloat(CopyData.G3Nsd)<1 ||CopyData.G3Nsd==""){
					sap.m.MessageToast.show("Enter G3 ");
					return
				}
				if(parseFloat(CopyData.G1Nsd)<3 ||parseFloat(CopyData.G2Nsd)<3 ||parseFloat(CopyData.G3Nsd)<3 ){
					if(CopyData.Remarks=="" || CopyData.Remarks==undefined ||parseFloat(CopyData.IpPsi)<100){
					sap.m.MessageToast.show("Fill Remarks");
					return
					}
				}
				
				that.EntreItem.getBindingContext().getObject().G1Nsd=CopyData.G1Nsd;
				that.EntreItem.getBindingContext().getObject().G2Nsd=CopyData.G2Nsd;
				that.EntreItem.getBindingContext().getObject().G3Nsd=CopyData.G3Nsd;
				that.EntreItem.getBindingContext().getObject().G4Nsd=CopyData.G4Nsd;
				//that.EntreItem.getBindingContext().getObject().Gvw=CopyData.Gvw;
				that.EntreItem.getBindingContext().getObject().IpCondition=CopyData.IpCondition;
				that.EntreItem.getBindingContext().getObject().IpPsi=CopyData.IpPsi;
				//that.EntreItem.getBindingContext().getObject().KmCovered=CopyData.KmCovered;
				that.EntreItem.getBindingContext().getObject().KmSuspended=CopyData.KmSuspended;
				that.EntreItem.getBindingContext().getObject().MilageProj=CopyData.MilageProj;
				that.EntreItem.getBindingContext().getObject().OrigNsd=CopyData.OrigNsd;
				that.EntreItem.getBindingContext().getObject().Remarks=CopyData.Remarks;
				this.ipCond = sap.ui.getCore().byId("idEarSped").getSelectedKey();
				this.ipPSI = sap.ui.getCore().byId("idEarCon").getValue();
				this.G1 = sap.ui.getCore().byId("idEarLed1").getValue();
				this.G2 = sap.ui.getCore().byId("idEarSped1").getValue();
				this.G3 = sap.ui.getCore().byId("idEarCon1").getValue();
				
				// new code
				this.OrigalNsd = CopyData.OrigNsd;
				this.orRemarks = CopyData.Remarks;
				this.tyrePos = sap.ui.getCore().byId("iDKing").getContent()[0].getItems()[1].getText().split(" ")[0];
				that.entriesbutton.setType("Accept")
				this._EntriesHelpDialog.close();
				this._EntriesHelpDialog.destroy();
				this._EntriesHelpDialog=undefined;	
			},
			
			NumberValidPercentage  : function(oEvent){
				var diaMNo =oEvent.getSource().getValue();
				if(diaMNo){
					if(isNaN(diaMNo)){
						diaMNo = diaMNo.substring(0, diaMNo.length - 1);
						oEvent.getSource().setValue(diaMNo);
						
					}else{
						if(parseInt(diaMNo) > 100){
							oEvent.getSource().setValue("");
							sap.m.MessageBox.alert(
									"Percentage can not be greater than 100", {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error"
									}
								);
						}
					}		
				}
			},
//////////////////////////////////////////////////////////////////////////////////////////////////									
			NumberValid : function(oEvent)
			{ 
				var val = oEvent.getSource().getValue();
				if(val){
					if(isNaN(val)){
						val = val.substring(0, val.length - 1);
						oEvent.getSource().setValue(val);
						
					}else if(val.indexOf(".")!="-1"){
						val = val.substring(0, val.length - 1);
						oEvent.getSource().setValue(val);
					}
				}

			},
			NumberGVWValid : function(oEvent)
			{ 
				var val = oEvent.getSource().getValue();
				if(val){
					if(isNaN(val)){
						val = val.substring(0, val.length - 1);
						oEvent.getSource().setValue(val);
					}
				}
			},
			
			/*NumberGVWValid : function(oEvent)
			{ 
				var val = oEvent.getSource().getValue();
				if(val){
					if(isNaN(val)){
						val = val.substring(0, val.length - 1);
						oEvent.getSource().setValue(val);
						
					}else if(val.indexOf(".")!="-1"){
						val = val.substring(0, val.length - 2);
						oEvent.getSource().setValue(val);
					}
				}

			},*/
			NumberValidYear : function(oEvent)
			{ 
				var val = oEvent.getSource().getValue();
				var d = new Date();
				var year = d.getFullYear();
				
				if(val){
					if(isNaN(val)){
						val = val.substring(0, val.length - 1);
						oEvent.getSource().setValue(val);
						
					}else if(val.indexOf(".")!="-1"){
						val = val.substring(0, val.length - 1);
						oEvent.getSource().setValue(val);
					}
				}
				
				if(val > year){
					oEvent.getSource().setValue("");
					sap.m.MessageToast.show("Registration Year Cannot Be More Than Current Year.");
					return
				}
			},

//////////////////////////////////////////////////////////////////////////////////////////////////			
			onPerChange:function(oEvent){
				var val = oEvent.getSource().getValue();
				if(val){
					if(parseFloat(val)>100){
						sap.m.MessageToast.show("Percentage Wear cant be more than 100");
						oEvent.getSource().setValue();
						
					}
				}	
			},
//////////////////////////////////////////////////////////////////////////////////////////////////			
			NumberValid1: function(oEvent)
			{ 
				var val = oEvent.getSource().getValue();
				$(this).val($(this).val().replace(/[^0-9\.]/g,''));
	            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
	                event.preventDefault();
	            }
	        
			},
//////////////////////////////////////////////////////////////////////////////////////////////////			
			NumberValid2: function(oEvent){
				var val = oEvent.getSource().getValue();
			    var ex = /^[0-9]+\.?[0-9]*$/;
			    if(ex.test(val)==false){
			      val = val.substring(0,val.length - 1);
			      oEvent.getSource().setValue(val);
			     }else{
			    	 
			    	 var a = val.split(".");
			    	 var c = a[0];
			    	 if(a[1].length>2){
			    		 var d = a[1].substring(0,a[1].length - 1);
			    		 var e = [c,d];
			    		 var f = e.join(".");
			    		 oEvent.getSource().setValue(f);
			    		 sap.m.MessageToast.show("You can enter upto 2 Decimal Digits"); 
			    	 }
			    		 
			     }
			},
//////////////////////////////////////////////////////////////////////////////////////////////////			
			onMecCon:function(evt){
				var key=evt.getSource().getSelectedKey();
				if(key=="Y"){
					this.getView().byId("idReason").setVisible(false);
					this.getView().byId("idReasonlbl").setVisible(false);
				}else{
					this.getView().byId("idReason").setVisible(true);
					this.getView().byId("idReasonlbl").setVisible(true);
				}	
			},
//////////////////////////////////////////////////////////////////////////////////////////////////			
			onStncNo:function(evt){
				that.stnclfld=evt.getSource();
				if(that.stnclfld.getParent().getCells()[1].sId.indexOf("input")!=-1){
				var item=that.stnclfld.getParent().getBindingContext().getObject().ItemCode;
				}else{
					var item=that.stnclfld.getParent().getBindingContext().getObject().ItemCode;
					if(that.stnclfld.getParent().getBindingContext().getObject().Owner==""){
						sap.m.MessageToast.show("Select Owner");
						return
					}
					else if(that.stnclfld.getParent().getBindingContext().getObject().ItemDesc==""){
						sap.m.MessageToast.show("Enter Description");
						return
					}
				}
				if(item!=""||that.stnclfld.getParent().getCells()[1].sId.indexOf("input")==-1){
					if(kunnr){
						var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Stencil_NumberSet?$filter=CType eq 'F' and CRegNo eq '"+this.getView().byId("FVehicleNoEdit").getValue()+"'and CNonJkCompany eq '"+that.stnclfld.getParent().getBindingContext().getObject().NonJkCompany+"' and CTyreLoc eq '' and CTyreType eq '' and CKunnr eq '"+ kunnr +"'  and CMatnr eq '"+item+"' and " +
						"CMaktx eq '"+that.stnclfld.getParent().getBindingContext().getObject().ItemDesc+"' and COwner eq'"+that.stnclfld.getParent().getBindingContext().getObject().Owner+"'";
					}else{
						var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Stencil_NumberSet?$filter=CType eq 'F' and CRegNo eq '"+this.getView().byId("FVehicleNoEdit").getValue()+"'and CNonJkCompany eq '"+that.stnclfld.getParent().getBindingContext().getObject().NonJkCompany+"' and CTyreLoc eq '' and CTyreType eq '' and CKunnr eq '"+sap.ui.getCore().byId("idFleet").getName()+"'  and CMatnr eq '"+item+"' and " +
						"CMaktx eq '"+that.stnclfld.getParent().getBindingContext().getObject().ItemDesc+"' and COwner eq'"+that.stnclfld.getParent().getBindingContext().getObject().Owner+"'";
							
					}
					
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false,
						false, null);
				var _valueHelpStncSelectDialog = new sap.m.SelectDialog(
						{

							title : "Select Stencil No",
							items : {
								path : "/d/results",
								template : new sap.m.StandardListItem(
										{
											title : "{StnclNumber}",
											customData : [ new sap.ui.core.CustomData(
													{
														key : "Key",
														value : "{StnclNumber}"
													}) ],

										}),
							},
							liveChange : function(oEvent) {
								var sValue = oEvent
										.getParameter("value");

 var oFilter = new sap.ui.model.Filter("StnclNumber",sap.ui.model.FilterOperator.Contains,sValue);

								oEvent.getSource().getBinding("items")
										.filter([ oFilter ]);
							},
							confirm : [ this._handleTypeStncClose, this ],
							cancel : [ this._handleTypeStncClose, this ]
						});
				_valueHelpStncSelectDialog.setModel(jModel);
				_valueHelpStncSelectDialog.open();
				}else{
					sap.m.MessageToast.show("Select Description")
				}
				},
			_handleTypeStncClose : function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					var flg="";
					var item=that.stnclfld.getParent();
					if(that.flg==0){
					var data=that.getView().byId("tblDetail").getItems();
					}else{
						var data=that.getView().byId("tblDetail1").getItems();	
					}
					var num=data.indexOf(item);
					for(i=0;i<data.length;i++){
						if(i!=num){
							if(data[i].getCells()[3].getValue()==oSelectedItem.getTitle()){
								flg="X";
								
							}
						}
					}
					if(flg!="X"){
					that.stnclfld.setValue(
							oSelectedItem.getTitle());

					var RecModel = new sap.ui.model.json.JSONModel(oSelectedItem.getBindingContext().getObject());
					that.stnclfld.setModel(RecModel,"Recodings")
					}else{
						sap.m.MessageToast.show("Stencil No "+oSelectedItem.getTitle() +" already Fitted")
					}
				}

			},
			OnTableSelect:function(evt){
				debugger
				if(sap.ui.getCore().byId("IdObj5").getVisible()){
				if(evt.getParameter("listItem").getSelected()){
				var Matnr=evt.getParameter("listItem").getBindingContext().getObject().ServiceCode;
				evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="X";
				if (!this._CutHelpDialog) {
					this._CutHelpDialog = sap.ui.xmlfragment(
						"zfltfitcreate2.view.Cut", this);
					this.getView().addDependent(this._CutHelpDialog);
					
				}
				that.evt=evt.getParameter("listItem").getBindingContext().getObject();
				that.evtItem=evt.getParameter("listItem");
				if(Matnr=="S02"){
					sap.ui.getCore().byId("IdCutPannel").setVisible(true);
					sap.ui.getCore().byId("idTypeCut").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
					sap.ui.getCore().byId("idcutwid").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[1].Value);
					sap.ui.getCore().byId("idcutsz").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[2].Value);
				this._CutHelpDialog.open();	
					
				}else if(Matnr=="S04"){
					sap.ui.getCore().byId("IdNitroPanl").setVisible(true);
					sap.ui.getCore().byId("idNtPur").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
					//sap.ui.getCore().byId("idNitTP").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[1].Value);
					this._CutHelpDialog.open();	
				}else if(Matnr=="S10"){
					sap.ui.getCore().byId("IdRotationpanl").setVisible(true);
					sap.ui.getCore().byId("idRTax").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
					sap.ui.getCore().byId("idRTWR").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[1].Value);
					this._CutHelpDialog.open();	
				}else if(Matnr=="S14"){
					sap.ui.getCore().byId("IdAlinmntpanl").setVisible(true);
		sap.ui.getCore().byId("ID1").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
		sap.ui.getCore().byId("ID11").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[1].Value);
		sap.ui.getCore().byId("ID2").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[2].Value);
		sap.ui.getCore().byId("ID21").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[3].Value);
		sap.ui.getCore().byId("ID3").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[4].Value);
		sap.ui.getCore().byId("ID31").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[5].Value);
		sap.ui.getCore().byId("ID4").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[6].Value);
		
					this._CutHelpDialog.open();	
				}
				else if(Matnr=="S15"){
					sap.ui.getCore().byId("IdBlapanl").setVisible(true);
					sap.ui.getCore().byId("IDweig").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
					this._CutHelpDialog.open();	
				}else if(Matnr=="S07"){
					sap.ui.getCore().byId("IdTMrem").setVisible(true);
					sap.ui.getCore().byId("idRTyCh").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
					
					this._CutHelpDialog.open();	
				}else if(Matnr=="S11"){
					sap.ui.getCore().byId("IdTFW").setVisible(true);
					sap.ui.getCore().byId("idRTyCh1").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
					
					this._CutHelpDialog.open();
				}
				}else{
					
					evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="";	
				}
				}else{
					if(evt.getParameter("listItem").getSelected()){
						var Matnr=evt.getParameter("listItem").getBindingContext().getObject().ServiceCode;
						evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="X";
						if (!this._CutHelpDialog) {
							this._CutHelpDialog = sap.ui.xmlfragment(
								"zfltfitcreate2.view.Cut", this);
							this.getView().addDependent(this._CutHelpDialog);
							
						}
						that.evt=evt.getParameter("listItem").getBindingContext().getObject();
						that.evtItem=evt.getParameter("listItem");
						if(Matnr=="S02"){
							sap.ui.getCore().byId("IdCutPannel").setVisible(true);
							sap.ui.getCore().byId("idTypeCut").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
							sap.ui.getCore().byId("idcutwid").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[1].Value);
							sap.ui.getCore().byId("idcutsz").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[2].Value);
						this._CutHelpDialog.open();	
							
						}else if(Matnr=="S04"){
							sap.ui.getCore().byId("IdNitroPanl").setVisible(true);
							sap.ui.getCore().byId("idNtPur").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);

							this._CutHelpDialog.open();	
						}else if(Matnr=="S10"){
							sap.ui.getCore().byId("IdRotationpanl").setVisible(true);
							sap.ui.getCore().byId("idRTax").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
							sap.ui.getCore().byId("idRTWR").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[1].Value);
							this._CutHelpDialog.open();	
						}else if(Matnr=="S14"){
							sap.ui.getCore().byId("IdAlinmntpanl").setVisible(true);
				sap.ui.getCore().byId("ID1").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
				sap.ui.getCore().byId("ID11").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[1].Value);
				sap.ui.getCore().byId("ID2").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[2].Value);
				sap.ui.getCore().byId("ID21").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[3].Value);
				sap.ui.getCore().byId("ID3").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[4].Value);
				sap.ui.getCore().byId("ID31").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[5].Value);
				sap.ui.getCore().byId("ID4").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[6].Value);
				
							this._CutHelpDialog.open();	
						}
						else if(Matnr=="S15"){
							sap.ui.getCore().byId("IdBlapanl").setVisible(true);
							sap.ui.getCore().byId("IDweig").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
							this._CutHelpDialog.open();	
						}else if(Matnr=="S07"){
							sap.ui.getCore().byId("IdTMrem").setVisible(true);
							sap.ui.getCore().byId("idRTyCh").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
							sap.ui.getCore().byId("idFttych").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[1].Value);
							sap.ui.getCore().byId("idRHT").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[2].Value);
							
							this._CutHelpDialog.open();	
						}else if(Matnr=="S11"){
							sap.ui.getCore().byId("IdTFW").setVisible(true);
							sap.ui.getCore().byId("idRTyCh1").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
							sap.ui.getCore().byId("idFttych1").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[1].Value);
							sap.ui.getCore().byId("idRHT1").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[2].Value);
							
							this._CutHelpDialog.open();
						}
						}else{
							
							evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="";	
						}	
				}
				
			},
			onCutClose:function(){
				that.evt.ServiceSelect=""
				that.evtItem.setSelected(false);	
				this._CutHelpDialog.close();
				this._CutHelpDialog.destroy();
				this._CutHelpDialog=undefined;
			},
			onCutOk:function(){
				if(sap.ui.getCore().byId("IdObj5").getVisible()){
					if(sap.ui.getCore().byId("IdCutPannel").getVisible()){
						var typeofCut=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
						var WidthofCut=sap.ui.getCore().byId("idcutwid").getValue();
						var patSize=sap.ui.getCore().byId("idcutsz").getValue();
						if(typeofCut==""){
							sap.m.MessageToast.show("Select Type of Cut");
							return
						}
						if(WidthofCut==""){
							sap.m.MessageToast.show("Enter Width of Cut");
							return
						}
						if(patSize==""){
							sap.m.MessageToast.show("EnterPatch Size");
							return
						}
						that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
						that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idcutwid").getValue();
						that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("idcutsz").getValue();
					}
					if(sap.ui.getCore().byId("IdNitroPanl").getVisible()){
						var nit=sap.ui.getCore().byId("idNtPur").getSelectedKey();

						if(nit==""){
							sap.m.MessageToast.show("Select Nitrogen Filling");
							return
						}
						that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idNtPur").getSelectedKey();

					}
					if(sap.ui.getCore().byId("IdRotationpanl").getVisible()){
						var nit=sap.ui.getCore().byId("idRTax").getSelectedKey();
						var nittp=sap.ui.getCore().byId("idRTax").getSelectedKey();
						if(nit==""){
							sap.m.MessageToast.show("Select Rotation on Axles");
							return
						}
						if(nittp==""){
							sap.m.MessageToast.show("Rotation on Wheel Rim");
							return
						}
						that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTax").getSelectedKey();
						that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idRTWR").getSelectedKey()
					}
					if(sap.ui.getCore().byId("IdAlinmntpanl").getVisible()){
						var nit=sap.ui.getCore().byId("ID1").getValue();
						var nit1=sap.ui.getCore().byId("ID11").getValue();
						var nit2=sap.ui.getCore().byId("ID2").getValue();
						var nit3=sap.ui.getCore().byId("ID21").getValue();
						var nit4=sap.ui.getCore().byId("ID3").getValue();
						var nit5=sap.ui.getCore().byId("ID31").getValue();
						var nit6=sap.ui.getCore().byId("ID4").getValue();
						
						if(nit==""){
							sap.m.MessageToast.show("Enter Total Toe In (Before)");
							return
						}
						if(nit1==""){
							sap.m.MessageToast.show("Enter Total Toe In (After)");
							return
						}
						if(nit2==""){
							sap.m.MessageToast.show("Enter Thrust (Before)");
							return
						}
						if(nit3==""){
							sap.m.MessageToast.show("Enter Thrust (Before)");
							return
						}
						if(nit4==""){
							sap.m.MessageToast.show("Enter Scrub (Before)");
							return
						}
						if(nit5==""){
							sap.m.MessageToast.show("Enter Scrub (After)");
							return
						}
						if(nit6==""){
							sap.m.MessageToast.show("Enter Remarks");
							return
						}
						that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("ID1").getValue();
						that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("ID11").getValue();
						that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("ID2").getValue();
						that.evt.IservToSubservNvg.results[3].Value=sap.ui.getCore().byId("ID21").getValue();
						that.evt.IservToSubservNvg.results[4].Value=sap.ui.getCore().byId("ID3").getValue();
						that.evt.IservToSubservNvg.results[5].Value=sap.ui.getCore().byId("ID31").getValue();
						that.evt.IservToSubservNvg.results[6].Value=sap.ui.getCore().byId("ID4").getValue();
					}
					if(sap.ui.getCore().byId("IdBlapanl").getVisible()){
						var nit=sap.ui.getCore().byId("IDweig").getValue();
						
						if(nit==""){
							sap.m.MessageToast.show("Enter Weight added");
							return
						}
						that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("IDweig").getValue();
						
						}
					
					if(sap.ui.getCore().byId("IdTMrem").getVisible()){
						var nit=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
						
						if(nit==""){
							sap.m.MessageToast.show("Select Tyre Changer");
							return
						}
						that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
						
						}
					if(sap.ui.getCore().byId("IdTFW").getVisible()){
						var nit=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
						
						if(nit==""){
							sap.m.MessageToast.show("Select Tyre Changer");
							return
						}
						that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
						
						}
					}else{
						if(sap.ui.getCore().byId("IdCutPannel").getVisible()){
							var typeofCut=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
							var WidthofCut=sap.ui.getCore().byId("idcutwid").getValue();
							var patSize=sap.ui.getCore().byId("idcutsz").getValue();
							if(typeofCut==""){
								sap.m.MessageToast.show("Select Type of Cut");
								return
							}
							if(WidthofCut==""){
								sap.m.MessageToast.show("Enter Width of Cut");
								return
							}
							if(patSize==""){
								sap.m.MessageToast.show("EnterPatch Size");
								return
							}
							that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
							that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idcutwid").getValue();
							that.evt.VServToSubservNvg.results[2].Value=sap.ui.getCore().byId("idcutsz").getValue();
						}
						if(sap.ui.getCore().byId("IdNitroPanl").getVisible()){
							var nit=sap.ui.getCore().byId("idNtPur").getSelectedKey();

							if(nit==""){
								sap.m.MessageToast.show("Select Nitrogen Filling");
								return
							}
							that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idNtPur").getSelectedKey();
						}
						if(sap.ui.getCore().byId("IdRotationpanl").getVisible()){
							var nit=sap.ui.getCore().byId("idRTax").getSelectedKey();
							var nittp=sap.ui.getCore().byId("idRTax").getSelectedKey();
							if(nit==""){
								sap.m.MessageToast.show("Select Rotation on Axles");
								return
							}
							if(nittp==""){
								sap.m.MessageToast.show("Rotation on Wheel Rim");
								return
							}
							that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTax").getSelectedKey();
							that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idRTWR").getSelectedKey()
						}
						if(sap.ui.getCore().byId("IdAlinmntpanl").getVisible()){
							var nit=sap.ui.getCore().byId("ID1").getValue();
							var nit1=sap.ui.getCore().byId("ID11").getValue();
							var nit2=sap.ui.getCore().byId("ID2").getValue();
							var nit3=sap.ui.getCore().byId("ID21").getValue();
							var nit4=sap.ui.getCore().byId("ID3").getValue();
							var nit5=sap.ui.getCore().byId("ID31").getValue();
							var nit6=sap.ui.getCore().byId("ID4").getValue();
							
							if(nit==""){
								sap.m.MessageToast.show("Enter Total Toe In (Before)");
								return
							}
							if(nit1==""){
								sap.m.MessageToast.show("Enter Total Toe In (After)");
								return
							}
							if(nit2==""){
								sap.m.MessageToast.show("Enter Thrust (Before)");
								return
							}
							if(nit3==""){
								sap.m.MessageToast.show("Enter Thrust (Before)");
								return
							}
							if(nit4==""){
								sap.m.MessageToast.show("Enter Scrub (Before)");
								return
							}
							if(nit5==""){
								sap.m.MessageToast.show("Enter Scrub (After)");
								return
							}
							if(nit6==""){
								sap.m.MessageToast.show("Enter Remarks");
								return
							}
							that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("ID1").getValue();
							that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("ID11").getValue();
							that.evt.VServToSubservNvg.results[2].Value=sap.ui.getCore().byId("ID2").getValue();
							that.evt.VServToSubservNvg.results[3].Value=sap.ui.getCore().byId("ID21").getValue();
							that.evt.VServToSubservNvg.results[4].Value=sap.ui.getCore().byId("ID3").getValue();
							that.evt.VServToSubservNvg.results[5].Value=sap.ui.getCore().byId("ID31").getValue();
							that.evt.VServToSubservNvg.results[6].Value=sap.ui.getCore().byId("ID4").getValue();
						}
						if(sap.ui.getCore().byId("IdBlapanl").getVisible()){
							var nit=sap.ui.getCore().byId("IDweig").getValue();
							
							if(nit==""){
								sap.m.MessageToast.show("Enter Weight added");
								return
							}
							that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("IDweig").getValue();
							
							}
						
						if(sap.ui.getCore().byId("IdTMrem").getVisible()){
							var nit=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
							
							if(nit==""){
								sap.m.MessageToast.show("Select Tyre Changer");
								return
							}
							that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
										
							}
						if(sap.ui.getCore().byId("IdTFW").getVisible()){
							var nit=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
							
							if(nit==""){
								sap.m.MessageToast.show("Select Tyre Changer");
								return
							}
							that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
							
							}
					}
					this._CutHelpDialog.close();
					this._CutHelpDialog.destroy();
					this._CutHelpDialog=undefined;
				},
			onTabelServiceClose:function(){
				sap.ui.getCore().byId("Servicetbl").removeSelections();
				that._SheetHelpDialog.close();
				that._SheetHelpDialog.destroy();
				that._SheetHelpDialog=undefined;
			},
			DateNew:function(Date1){
										var month = Date1.getMonth() + 1;
										var date  = Date1.getDate();
										if (month.toString().length < 2) {
											month = "0" + month.toString();
										}
										if (date.toString().length < 2) {
											date = "0" + date.toString();
										}
										var formatDate = Date1.getFullYear()  + '-' + month + '-' + date + "T00:00:00";
										return formatDate;
									},
			onFitmentCreate:function(){
				
				if(that.getView().byId("idmccon").getSelectedKey()==="N"){
//								that.getView().byId("idReason").setRequired(true);
						if(that.getView().byId("idReason").getSelectedKey()==""){
							sap.m.MessageToast.show("Select Reason");
							return false
						}
				}
				if(that.getView().byId("FFitmentDateEdit").getDateValue()==null){
					sap.m.MessageToast.show("Select Fitment Date");
					return false	
				}
				
				if(this.getView().byId("FVehicleNoEdit").getValue()==""){
					sap.m.MessageToast.show("Select Vehicle No");
					return
				}							
				if(this.getView().byId("FVehicleCCEdit").getValue()==""){
					sap.m.MessageToast.show("Enter Vehicle CC ");
					return
				}
				if(this.getView().byId("idEarPSI").getSelectedKey()==""){
					sap.m.MessageToast.show("Select Milometer Working");
					return
				}

				
				var valid=that.validations();
				if(valid){
				var Data=$.extend( true, {}, that.data );
				Data.OffRoad=this.getView().byId("FOFFRoadConditionEdit").getValue();
				Data.FitmentStatus="X";
				Data.InspectionDate=that.DateNew(that.getView().byId("FFitmentDateEdit").getDateValue());
				Data.FitmentDate=null;
				Data.LastInspDate=null;
				
				delete Data.__metadata;
				delete Data.__proto__;
				Data.RegnoToItemNvg=Data.RegnoToItemNvg.results;
				for(i=0;i<Data.RegnoToItemNvg.length;i++){
					delete Data.RegnoToItemNvg[i].__metadata;
					Data.RegnoToItemNvg[i].VitemToServiceNvg=Data.RegnoToItemNvg[i].VitemToServiceNvg.results;
					for(j=0;j<Data.RegnoToItemNvg[i].VitemToServiceNvg.length;j++){
						if(Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.results.length!=0){
							delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].__metadata;
							Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg=Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.results
							for(k=0;k<Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.length;k++){
								delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg[k].__metadata;
							}
						}else{
							delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg
						}
						
					}
				}
				Data.RegnoToServiceNvg=Data.RegnoToServiceNvg.results;
				for(i=0;i<Data.RegnoToServiceNvg.length;i++){
					delete Data.RegnoToServiceNvg[i].__metadata;
					Data.RegnoToServiceNvg[i].VServToSubservNvg=Data.RegnoToServiceNvg[i].VServToSubservNvg.results;
					
						if(Data.RegnoToServiceNvg[i].VServToSubservNvg.length!=0){
							delete Data.RegnoToServiceNvg[i].VServToSubservNvg.__metadata;
							//Data.RegnoToServiceNvg[i].VServToSubservNvg=Data.RegnoToServiceNvg[i].VServToSubservNvg.results
							for(j=0;j<Data.RegnoToServiceNvg[i].VServToSubservNvg.length;j++){
								delete Data.RegnoToServiceNvg[i].VServToSubservNvg[j].__metadata;
							}
						}else{
							delete Data.RegnoToServiceNvg[i].VServToSubservNvg
						}
						
				
				}
				if(Data.Gvw == ""||Data.Gvw==undefined)
				Data.Gvw = 0;
				if(Data.AvgSpeed==""||Data.AvgSpeed==undefined)
				Data.AvgSpeed = 0;
				if(Data.LoopDist==""||Data.LoopDist==undefined)
				Data.LoopDist = 0;
				if(Data.OffRoad==""||Data.OffRoad==undefined)
				Data.OffRoad = 0;
				if(Data.Pricit==""||Data.Pricit==undefined)
				Data.Pricit = 0;
				console.log(Data)
				var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
				var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oCreateModel1.setHeaders({
					"Content-Type": "application/atom+xml"
					});
				var fncSuccess = function(oData, oResponse) //success function 
					{

					if(oData.EError=="true"){
						sap.m.MessageBox.show(oData.EMessage, {
					        title: "Error",
					        icon:sap.m.MessageBox.Icon.ERROR,
					        onClose:function(){
					        }
					    });	
					}else{
					sap.m.MessageBox.show(oData.Message, {
				        title: "Success",
				        icon:sap.m.MessageBox.Icon.SUCCESS,
				        onClose:function(){
				        window.history.back();
				        }
				    });
					}
					}
				var fncError = function(oError) { //error callback function
					var parser = new DOMParser();
					var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
					sap.m.MessageBox.show(message, {
				        title: "Error",
				        icon:sap.m.MessageBox.Icon.ERROR,
				    });
				}
				//Create Method for final Save
				oCreateModel1.create("/VehicleRegNoSet", Data, {
					success: fncSuccess,
					error: fncError
				});console.log(Data)
				}
			},
			
			onIpPsiChange:function(evt){
				if(parseFloat(evt.getSource().getValue())>150){
					sap.m.MessageToast.show("IP cant be more than 150");
					evt.getSource().setValue();
					return
				}
				if(parseFloat(evt.getSource().getValue())<100){

					
				}
			},
			onFitmentSave:function(){
				
				var Data=$.extend( true, {}, that.data );
				Data.Cart="X";
				Data.FitmentStatus="X";
				delete Data.__metadata;
				delete Data.__proto__;
				Data.RegnoToItemNvg=Data.RegnoToItemNvg.results;
				for(i=0;i<Data.RegnoToItemNvg.length;i++){
					delete Data.RegnoToItemNvg[i].__metadata;
					Data.RegnoToItemNvg[i].VitemToServiceNvg=Data.RegnoToItemNvg[i].VitemToServiceNvg.results;
					for(j=0;j<Data.RegnoToItemNvg[i].VitemToServiceNvg.length;j++){
						if(Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.results.length!=0){
							delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].__metadata;
							Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg=Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.results
							for(k=0;k<Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.length;k++){
								delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg[k].__metadata;
							}
						}else{
							delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg
						}
						
					}
				}
				Data.RegnoToServiceNvg=Data.RegnoToServiceNvg.results;
				for(i=0;i<Data.RegnoToServiceNvg.length;i++){
					delete Data.RegnoToServiceNvg[i].__metadata;
					Data.RegnoToServiceNvg[i].VServToSubservNvg=Data.RegnoToServiceNvg[i].VServToSubservNvg.results;
					
						if(Data.RegnoToServiceNvg[i].VServToSubservNvg.length!=0){
							delete Data.RegnoToServiceNvg[i].VServToSubservNvg.__metadata;
							//Data.RegnoToServiceNvg[i].VServToSubservNvg=Data.RegnoToServiceNvg[i].VServToSubservNvg.results
							for(j=0;j<Data.RegnoToServiceNvg[i].VServToSubservNvg.length;j++){
								delete Data.RegnoToServiceNvg[i].VServToSubservNvg[j].__metadata;
							}
						}else{
							delete Data.RegnoToServiceNvg[i].VServToSubservNvg
						}
						
				
				}
				console.log(Data)
				var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
				var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oCreateModel1.setHeaders({
					"Content-Type": "application/atom+xml"
					});
				var fncSuccess = function(oData, oResponse) //sucess function 
					{

					if(oData.EError=="true"){
						sap.m.MessageBox.show(oData.EMessage, {
					        title: "Error",
					        icon:sap.m.MessageBox.Icon.ERROR,
					        onClose:function(){
					        	
					        	
					    			
					        }
					    });	
					}else{
					sap.m.MessageBox.show(oData.Message, {
				        title: "Success",
				        icon:sap.m.MessageBox.Icon.SUCCESS,
				        onClose:function(){
				        	//sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_CLAIM_SRV/ClaimOutputFormSet(ClaimNo='',TicketNo='"+oData.TicketNo+"')/$value", true);
				        	window.history.back();
				        	
				    			
				        }
				    });
					}
					}
				var fncError = function(oError) { //error callback function
					var parser = new DOMParser();
					var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
					sap.m.MessageBox.show(message, {
				        title: "Error",
				        icon:sap.m.MessageBox.Icon.ERROR,
				    });
				}
				//Create Method for final Save
				oCreateModel1.create("/VehicleRegNoSet", Data, {
					success: fncSuccess,
					error: fncError
				});console.log(Data)
					
			},
			validations:function(){
				if(that.flg==0){
				var tab=this.getView().byId("tblDetail");
				}else{
					var tab=this.getView().byId("tblDetail1");	
				}
				var x,y,z;
				for(i=0;i<tab.getItems().length;i++){
					if(tab.getItems()[i].getCells()[3].getValue()==""){
						x="X";
					}
					if(tab.getItems()[i].getCells()[5].getType()!="Accept"){
						z="X";
					}
				}
				if(x=="X"){
					sap.m.MessageToast.show("Select Item Code and Stencil No of every Position");
					return false
				}

				if(z=="X"){
					sap.m.MessageToast.show("Fill Recordings of every Position");
					return false
				}
				if(that.getView().byId("FFitmentDateEdit").getDateValue()==null){
					sap.m.MessageToast.show("Select Fitment Date");
					return false	
				}
				return true
			},
			
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