jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("zftplanreportmd.util.Formatter");

sap.ui.controller("zftplanreportmd.view.masterDetail", {

onInit:function() {
		
		var that = this;
		jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("zftplanreportmd.css.update",".css"));
		jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("zftplanreportmd.css.style",".css"));
		this.model = this.getOwnerComponent().getModel();
		var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({"Content-Type" : "application/json"
		});
		
		var fncSuccess = function(oData, oResponse){
			
			if(oData.results.length==0 ){
				sap.m.MessageBox.show("You are not registered to any Fleet", {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					onClose:function(){
						window.history.back();
					}
					});	
			}
			if(oData.results.length==1){
				that.Kunnr = oData.results[0].Kunnr;
				that.getView().byId("master").setTitle(oData.results[0].FleetName);
				that.bindMasterList();
			}else{
				that.FleetData=oData;
				that.EnrolMode = oData.results[0].EnrolMode;
				if (!that._FleetDialog) {
					that._FleetDialog = sap.ui.xmlfragment("zftplanreportmd.view.Intial", that);
					that.getView().addDependent(that._FleetDialog);
				}
				that._FleetDialog.open();
			}
		}
			
		var fncError = function(oError) { // error callback
			// function
						var parser = new DOMParser();
						var message = parser.parseFromString(
						oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML;
						sap.m.MessageBox.show(message, {
							title : "Error",
							icon  : sap.m.MessageBox.Icon.ERROR,
						});
			}
		
		oReadModel.read("/User_Fleet_DetialsSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'", {
			success : fncSuccess,
			error : fncError
		});
		
		sap.ui.core.UIComponent.getRouterFor(this).getRoute("page1").attachMatched(this.onRoute, this);
		var master = this;
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {
		}

	},
	
	onAfterRendering:function(){
		
	},

	onFleetCloseButton:function(){
		
		var that = this;
		if(sap.ui.getCore().byId("idFleet").getValue()!=""){
			this.getView().byId("master").setTitle(sap.ui.getCore().byId("idFleet").getValue());
			this.bindMasterList();
		that._FleetDialog.close();
		}else{
			sap.m.messageToast.show("Select Fleet")
		}
		
	},
	
	onFleetCloseCancle:function(){
		window.history.back();
	},
	
	NumberValid : function(oEvent)
	{ 
		var val = oEvent.getSource().getValue();
		if(val){
			if(isNaN(val)){
				val = val.substring(0, val.length - 1);
				oEvent.getSource().setValue(val);
			}
		}
	},
	
	onFleetFragment: function(evt) {
		
		this.CustomerValue = evt.getSource();
		var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/User_Fleet_DetialsSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpDialog = new sap.m.SelectDialog({

			title: "Fleet",
			items: {
				path: "/d/results",
				template: new sap.m.StandardListItem({
					title: "{FleetName}",
					customData: [new sap.ui.core.CustomData({
						key: "{Kunnr}",
						value: "{FleetName}"
					})]

				})
			},
			liveChange: function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("FleetName", sap.ui.model.FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
			confirm: [this._handleCustomerClose, this],
			cancel: [this._handleCustomerClose, this]
		});
		_valueHelpDialog.setModel(jModel);
		_valueHelpDialog.open();
	},

	_handleCustomerClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			this.Kunnr = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
			;
			this.CustomerValue.setValue(oSelectedItem.getTitle());
			
		}
	},
	
	onRoute: function(e)
	{
		var object = this.getView().byId("splitApp");
		object.toDetail(this.getView().byId("equipmentDetailPage"));
	},
	
	toggleFullScreen : function(oEvt) {
		
		var lo_id = oEvt.getSource().sId;
		var lo_cid = this.getView().byId(lo_id);
		var spapp = oEvt.getSource().getParent().getParent().getParent().getParent();
		if (spapp.getMode() == "ShowHideMode") 
		{
			spapp.setMode('HideMode');
			lo_cid.setIcon('sap-icon://exit-full-screen').setTooltip('Exit from full screen mode');
		} 
		else 
		{
			spapp.setMode('ShowHideMode');
			lo_cid.setIcon('sap-icon://full-screen').setTooltip('Show in full screen mode');
		}
	},
	
	bindMasterList : function()
	{
		
		var master = this;
		master.reqdata='';
		var oModel=this.getOwnerComponent().getModel();
		this.getView().setModel(oModel);
		
		var path="/F4FleetVehicleDataSet?$filter=Kunnr eq '"+this.Kunnr+"'";
		 
		var loVehicleList = this.getView().byId("vehicleList");
		var _self = this;
		var loListTemplate = "";
		oModel.read(path, null , null , false, function(OData, oResponse) {
			var that = _self;
			master.reqdata = OData.results;
			var lnth = OData.results.length;
			if(lnth !== 0){
				
				master.EnrolMode = OData.results[0].EnrolMode;
		    	var tempModel = new sap.ui.model.json.JSONModel({ "VehicleMasterSet" :  master.reqdata});
				loListTemplate = new sap.m.ObjectListItem(
						{
							type : sap.m.ListType.Active,
							title : "{RegNo}",
							intro : "{MakeShortName}",
							number : "{ConfigCodeDesc}",
							numberUnit : "{Model}",
							press : function(e) {
								that.listItemSelect(e);
							},
//							attributes : [
//									new sap.m.ObjectAttribute(
//											{
//												text : "{MakeName}"
//											})
//									 ]
						});
				loVehicleList.unbindAggregation("items");
				loVehicleList.setModel(tempModel);
				tempModel.setSizeLimit(tempModel.oData.VehicleMasterSet.length);
				loVehicleList.bindAggregation("items", "/VehicleMasterSet", loListTemplate);

			}
			
		})
//		
//		loVehicleList.bindAggregation(
//				"items",
//				{
//					path : path,
//					template : loListTemplate
//
//				})
	},
	
	bindDetailsPage : function(selectedVehicle)
	{
		var _self = this;
		if(this.EnrolMode === "F"){
			this.getView().byId("lblcType").setVisible(false);
			this.getView().byId("serviceTypeInp").setVisible(false);
			this.getView().byId("lblServiceEdit").setVisible(false);
			this.getView().byId("IdServiceContract").setVisible(false);
		}
		var oBindingPath = "Model>/VehicleRegNoSet(RegNo='"+selectedVehicle+"',Type='V',TruckKunnr='',Kunnr='')?$expand=RegnoToItemNvg/VitemToServiceNvg/IservToSubservNvg,RegnoToServiceNvg/VServToSubservNvg";
		var form = this.getView().byId("SimpleFormToolbar");
		form.bindElement(oBindingPath);
		this.getView().byId("SimpleFormToolbar").setTitle(selectedVehicle);
		this.RegNo = selectedVehicle;
	
			var obj = this.getView().byId("splitApp");
			obj.toDetail(this.getView().byId("vehicleDetailPage"));
				
			this.initialPageConditions();
	},
	
	onUpdateFinished : function(e)
	{
		if(e.getSource().getItems().length !=0)
			{
			var initialEquipment = e.getSource().getItems()[0].getTitle();
			this.RegNo = "";
			this.selectedVehicle = initialEquipment;
			this.bindDetailsPage(initialEquipment);
			var obj = this.getView().byId("splitApp");
			obj.toDetail(this.getView().byId("vehicleDetailPage"));
			}
		else
			{
			this.clearDetailsScreen();
			}
	},
	
	listItemSelect : function(e)
	{
		var _self = this;
		var selectedVehicle = e.getSource().getTitle();
		this.selectedVehicle = selectedVehicle;
		this.RegNo = "";
		this.bindDetailsPage(selectedVehicle);
		var obj = this.getView().byId("splitApp");
		obj.toDetail(this.getView().byId("vehicleDetailPage"));
		this.getView().byId("IdServiceContract").setVisible(false);
		this.getView().byId("idmccon").setVisible(false);
		this.getView().byId("lblMechCondEdit").setVisible(false);
		this.getView().byId("lblServiceEdit").setVisible(false);
		
		this.getView().byId("SimpleFormToolbar").setTitle(selectedVehicle);
		
		this.initialPageConditions();
	},
	
	clearDetailsScreen : function()
	{
		
	},
	
	onSearch : function() {

	},
	
	onBackNav:function(){
		var obj = this.getView().byId("splitApp");
		this.bindDetailsPage(this.selectedVehicle);
		obj.toDetail(this.getView().byId("vehicleDetailPage"));
		this.getView().byId("IdServiceContract").setVisible(false);
 		this.getView().byId("idmccon").setVisible(false);
		this.getView().byId("lblMechCondEdit").setVisible(false);
		this.getView().byId("lblServiceEdit").setVisible(false);
		this.getView().byId("tableVehicle").removeAllItems();
		
		this.initialPageConditions();
	},

	onEdit:function(){
		
		var error = this.getView().byId("error").getValue();
		var msg = this.getView().byId("msg").getValue();
		
		if(error=='X'){
			sap.m.MessageToast.show(msg);
			return 
		}
		
		var oItemTemplateBlank = new sap.ui.core.Item({
			key: "Blank",
			text: ""
		});
		
		var oItemTemplateNone = new sap.ui.core.Item({
			key: "NONE",
			text: "None"
		});
		
		var oItemTemplateCpkm = new sap.ui.core.Item({
			key: "CPKM",
			text: "Charge Per KM"
		});
		
		var oItemTemplateSC = new sap.ui.core.Item({
			key: "SC",
			text: "Service Contract"
		});
		
		var contractTypeValue = this.getView().byId("serviceTypeInp").getValue();
		var contractSelect = this.getView().byId("IdServiceContract");
	
	if(contractTypeValue === "Charge Per KM"){
		contractSelect.addItem(oItemTemplateNone);
		contractSelect.addItem(oItemTemplateSC);
		contractSelect.addItem(oItemTemplateBlank);
	}else if(contractTypeValue === "Service Contract"){
		contractSelect.addItem(oItemTemplateNone);
		contractSelect.addItem(oItemTemplateCpkm);
		contractSelect.addItem(oItemTemplateBlank);			
	}else if(contractTypeValue === "None"){
		contractSelect.addItem(oItemTemplateSC);
		contractSelect.addItem(oItemTemplateCpkm);
		contractSelect.addItem(oItemTemplateBlank);
	}	
		
	if(this.EnrolMode === "F"){
		contractSelect.removeItem(oItemTemplateCpkm);
	}else{
		this.getView().byId("IdServiceContract").setVisible(true);
	}
		this.getView().byId("btnSaveEdit").setVisible(true);
		this.getView().byId("btnBackEdit").setVisible(true);
		this.getView().byId("btnEdit").setVisible(false);
		
		var mech = this.getView().byId("mechCondInp").getValue();
		if(mech == "Not OK")
			{
			this.getView().byId("lblMechCondEdit").setVisible(true);
			this.getView().byId("idmccon").setVisible(true);
			this.getView().byId("idmccon").setEnabled(true);
			}
		else
			{
			this.getView().byId("lblMechCondEdit").setVisible(false);
			this.getView().byId("idmccon").setVisible(false);
			this.getView().byId("idmccon").setEnabled(false);
			}
		
		this.getView().byId("lblServiceEdit").setVisible(true);
		

		var chasisNo = this.getView().byId("ChasisNoID").getValue();
		var engineNo = this.getView().byId("EngineNooID").getValue();
		
		this.getView().byId("ChasisNoIDPage").setValue(chasisNo);
		this.getView().byId("EngineNooIDPage").setValue(engineNo);
		
		if(chasisNo == ""){
			this.getView().byId("LChasisNoEditPage").setVisible(true);
			this.getView().byId("ChasisNoIDPage").setVisible(true);
			this.getView().byId("ChasisNoID").setVisible(false);
			this.getView().byId("LChasisNoEdit").setVisible(false);
		}else{
			this.getView().byId("LChasisNoEditPage").setVisible(false);
			this.getView().byId("ChasisNoIDPage").setVisible(false);
			this.getView().byId("ChasisNoID").setVisible(true);
			this.getView().byId("LChasisNoEdit").setVisible(true);
		}
		if(engineNo == ""){
			this.getView().byId("LEngineNoEditPage").setVisible(true);
			this.getView().byId("EngineNooIDPage").setVisible(true);
			this.getView().byId("EngineNooID").setVisible(false);
			this.getView().byId("LEngineNoEdit").setVisible(false)
		}else{
			this.getView().byId("LEngineNoEditPage").setVisible(false);
			this.getView().byId("EngineNooIDPage").setVisible(false);
			this.getView().byId("EngineNooID").setVisible(true);
			this.getView().byId("LEngineNoEdit").setVisible(true);
		}
		
	},
	
	onCreateNew:function(){
		var obj = this.getView().byId("splitApp");
		obj.toDetail(this.getView().byId("createVehicle"));
		
		if(this.EnrolMode === "F"){
			this.getView().byId("tableVehicle").getColumns()[1].setVisible(false);
		}else{
			this.getView().byId("tableVehicle").getColumns()[1].setVisible(true);
		}
	},

	onVehicleMakeHelp: function(evt) {
				this.VehMakeValue = evt.getSource();
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4VehicleMakeSet";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false, false, null);
				var _valueHelpDialog = new sap.m.SelectDialog({

					title: "Vehicle Make",
					items: {
						path: "/d/results",
						template: new sap.m.StandardListItem({
							title: "{MakeShortName}",
							info :"{MakeName}",
							customData: [new sap.ui.core.CustomData({
								key: "{MakeCode}",
								value: "{MakeName}"
							})]

						})
					},
					liveChange: function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("MakeName", sap.ui.model.FilterOperator.Contains, sValue);
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
					this.VehMakeValue.setValue(oSelectedItem.getTitle());
				}

			},
			
			onSearchVehicle : function(evt)
			{
				var list = this.getView().byId("vehicleList");
				var binding = list.getBinding("items");
				var sValue = evt.getSource().getValue();
				var oFilter = new sap.ui.model.Filter("RegNo", sap.ui.model.FilterOperator.Contains, sValue);
				binding.filter([oFilter]);
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
				var that = this;
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					sap.ui.getCore().byId("idConfig").setValue("");

					this.VehicleModel = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
					this.VehModelValue.setValue(oSelectedItem.getTitle());
					
				}
			},
			
			onBodyTypeHelp: function(evt) {
				this.BodyTypeValue = evt.getSource();
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4BodyTypeSet";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false, false, null);
				var _valueHelpDialog = new sap.m.SelectDialog({

					title: "Body Type",
					items: {
						path: "/d/results",
						template: new sap.m.StandardListItem({
							title: "{TypeDesc}",
							customData: [new sap.ui.core.CustomData({
								key: "{BodyType}",
								value: "{TypeDesc}"
							})]

						})
					},
					liveChange: function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("TypeDesc", sap.ui.model.FilterOperator.Contains, sValue);
						oEvent.getSource().getBinding("items").filter([oFilter]);
					},
					confirm: [this._handleBodyTypeClose, this],
					cancel: [this._handleBodyTypeClose, this]
				});
				_valueHelpDialog.setModel(jModel);
				_valueHelpDialog.open();
			},

			_handleBodyTypeClose: function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					this.BodyType = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
					this.BodyTypeValue.setValue(oSelectedItem.getTitle());
				}

			},
			
		onProdSizeHelp: function(evt) {
				this.ProdSizeValue = evt.getSource();
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4ProdSizeSet";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false, false, null);
				var _valueHelpDialog = new sap.m.SelectDialog({

					title: "Product Size",
					items: {
						path: "/d/results",
						template: new sap.m.StandardListItem({
							title: "{ProdDesc}",
							customData: [new sap.ui.core.CustomData({
								key: "{ProdSize}",
								value: "{ProdDesc}"
							})]

						})
					},
					liveChange: function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("ProdDesc", sap.ui.model.FilterOperator.Contains, sValue);
						oEvent.getSource().getBinding("items").filter([oFilter]);
					},
					confirm: [this._handleProdSizeClose, this],
					cancel: [this._handleProdSizeClose, this]
				});
				_valueHelpDialog.setModel(jModel);
				_valueHelpDialog.open();
			},

			_handleProdSizeClose: function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					this.ProdSize = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
					this.ProdSizeValue.setValue(oSelectedItem.getTitle());
				}

			},
			
		onAppTypeHelp: function(evt) {
				this.AppTypeValue = evt.getSource();
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4AppTypeSet";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false, false, null);
				var _valueHelpDialog = new sap.m.SelectDialog({

					title: "App Type",
					items: {
						path: "/d/results",
						template: new sap.m.StandardListItem({
							title: "{AppTypeDesc}",
							customData: [new sap.ui.core.CustomData({
								key: "{AppType}",
								value: "{AppTypeDesc}"
							})]

						})
					},
					liveChange: function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("AppTypeDesc", sap.ui.model.FilterOperator.Contains, sValue);
						oEvent.getSource().getBinding("items").filter([oFilter]);
					},
					confirm: [this._handleAppTypeClose, this],
					cancel: [this._handleAppTypeClose, this]
				});
				_valueHelpDialog.setModel(jModel);
				_valueHelpDialog.open();
			},

			_handleAppTypeClose: function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					this.AppType = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
					this.AppTypeValue.setValue(oSelectedItem.getTitle());
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
				}
			},
			
			addNewItem : function()
			{
				
				var self = this;
				var customer = this.Kunnr;
				if(customer ==""||customer==undefined)
				{
				sap.m.MessageBox.show("Enter customer", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
				return;
				}
				
				this._EntriesHelpDialog = sap.ui.xmlfragment("zftplanreportmd.view.addVehicle", this);
				this.getView().addDependent(this._EntriesHelpDialog);
					
					if(this.EnrolMode === "F"){
						this._EntriesHelpDialog.getContent()[0]._aElements[2].setVisible(false);
						this._EntriesHelpDialog.getContent()[0]._aElements[3].setVisible(false);
					}else{
						this._EntriesHelpDialog.getContent()[0]._aElements[2].setVisible(true);
						this._EntriesHelpDialog.getContent()[0]._aElements[3].setVisible(true);
					}
					this._EntriesHelpDialog.open();
				},
				
		ontabClose: function(){
					
			//	this._addVehicle.close();	
			//	this._addVehicle.destroy(true);
				this._EntriesHelpDialog.close();
				this._EntriesHelpDialog.destroy(true);
		},
			
		ValidateRegNo : function(val){
				
		},
		
		onMechCondChange : function(evt)
			{
				var val = evt.getSource().getParent().getParent();
				
				var key = val.getFormElements()[2].getFields()[0].getSelectedKey();
				if(key == "N")
					{
					val.getFormElements()[3].setVisible(true);
					val.getFormElements()[3].getFields()[0].setVisible(true);
					val.getFormElements()[3].getLabel().setVisible(true);
					
					}
				else
					{
					val.getFormElements()[3].setVisible(false);
					val.getFormElements()[3].getFields()[0].setVisible(false);
					val.getFormElements()[3].getLabel().setVisible(false);
					val.getFormElements()[3].getFields()[0].setValue("");
					
					}
				
			},
			
			onEditMechCondChange : function(evt)
			{
				var key = this.getView().byId("idmccon").getSelectedKey();
				if(key == "N")
					{
					this.getView().byId("lblReason").setVisible(true);
					this.getView().byId("inpMechResn").setVisible(true);
					}
				else
					{
					this.getView().byId("lblReason").setVisible(true);
					this.getView().byId("inpMechResn").setVisible(true);
					}
				
			},
			
			onEditBackNav : function()
			{
				this.getView().byId("btnSaveEdit").setVisible(false);
				this.getView().byId("btnBackEdit").setVisible(false);
				this.getView().byId("btnEdit").setVisible(true);
				this.getView().byId("IdServiceContract").setVisible(false);
				this.getView().byId("idmccon").setVisible(false);
				this.getView().byId("lblMechCondEdit").setVisible(false);
				this.getView().byId("lblServiceEdit").setVisible(false);
				this.bindDetailsPage(this.selectedVehicle);
			},
			
			onReasonFragment:function(evt)
			{
				this.ReasonValue = evt.getSource();
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Mechanical_ReasonSet";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false,false, null);
				var _valueHelpReasonSelectDialog = new sap.m.SelectDialog(
						{

							title : "Select Reason",
							items : {
								path : "/d/results",
								template : new sap.m.StandardListItem(
										{
											title : "{Desc}",
											customData : [ new sap.ui.core.CustomData(
													{
														key : "{CondReason}",
														value : "{Desc}"
													}) ],

										}),
							},
							liveChange : function(oEvent) {
								var sValue = oEvent.getParameter("value");

								var oFilter = new sap.ui.model.Filter("Desc",sap.ui.model.FilterOperator.Contains,sValue);
								oEvent.getSource().getBinding("items").filter([ oFilter ]);
							},
							confirm : [ this._handleReasonClose, this ],
							cancel : [ this._handleReasonClose, this ]
						});
				_valueHelpReasonSelectDialog.setModel(jModel);
				_valueHelpReasonSelectDialog.open();
			},
			_handleReasonClose : function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					this.ReasonValue.setValue(oSelectedItem.getTitle());
					this.Reason = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
				}

			},
			
			/************************Check registration No Last 4 digits************************************************/             
       
		onRegno:function(oEvent)
        {
		debugger
           var text = oEvent.getSource().getValue();

   				if(text!="")
   				{
   		            for(var i = text.length-1; i>=text.length -4; i--)
   		            {
   		    			var j = text.charAt(i);
   		    			if(isNaN(parseInt(j)))
   		    			{
   		    				sap.m.MessageBox.error("Invalid Registration No.");
   		    				oEvent.getSource().setValue();
   		    				return; 
   		    		   }
   		     		 }
   		     	   }
           
   			for(var i=0;i<text.length;i++)
   			{
   	           var code = text.charCodeAt(i);
	           if ( !(code > 47 && code < 58) && !(code > 64 && code < 91) && !(code > 96 && code < 123) )
	           {
	        	   		sap.m.MessageBox.error("Invalid Registration No.");
	    				oEvent.getSource().setValue();
	    				return; 
	           }
   			}
           oEvent.getSource().setValue(text.toUpperCase());
      },
      
      changeupper:function(oEvent){
    	  
    	  var val = oEvent.getParameter("value");
  		val = val.replace(/ +/g, "");
  		if(val.length > 0){
  			sap.ui.getCore().byId("idChassis").setValue(val.toUpperCase());
  		}	
      },	
      
      changeupper1:function(oEvent){
    	  
    	  var val = oEvent.getParameter("value");
  		val = val.replace(/ +/g, "");
  		if(val.length > 0){
  			sap.ui.getCore().byId("idEngine").setValue(val.toUpperCase());	
  		}
  			
      },	
      
	onTabelEntrieOk : function(evt)  
			{
				;
				var that = this;
				
				var getVal = sap.ui.getCore().byId("idReg").getValue();
				var lastFive = getVal.substr(getVal.length - 4);

					if(isNaN(lastFive)){
						sap.m.MessageToast.show("Last four digits should be number");
						sap.ui.getCore().byId("idReg").setValue();
						return false;
					}
				
				
				var data = evt.getSource().getParent().getContent()[0]._aElements;
//				var Customer = data[1].getValue();
//				var HubCode = data[3].getValue();
				var VehicleRegNo = data[1].getValue().toUpperCase();
				var ContractType = data[3].getSelectedKey();
				var mechCond = data[5].getSelectedKey();
				var mechReason = data[7].getValue();
				var VehicleMake = data[9].getValue();
				var VehicleModel = data[11].getValue();
//				var ConfigCode = data[13].getValue(); 
				var ConfigCode = this.ConfigCode;
				var ProdSize = this.ProdSize;
				var ChassisNo = data[17].getValue().toUpperCase();
				var EngineNo = data[19].getValue().toUpperCase();
				var BodyType = this.BodyType;
				var AppType = this.AppType;
				var VehicleMakeCode = this.VehicleMake;
				var tab = this.getView().byId("tableVehicle");
				
				
				if(VehicleRegNo ==""||VehicleRegNo==undefined)
				{
				sap.m.MessageBox.show("Enter Vehicle Registeration Number", {
									        title: "Error",
									        icon:sap.m.MessageBox.Icon.ERROR,
									    });
				return;
				}
				
				// condition

				if(this.EnrolMode !== "F"){
					if(ContractType ==""||ContractType==undefined)
					{
					sap.m.MessageBox.show("Select Contract Type", {
										        title: "Error",
										        icon:sap.m.MessageBox.Icon.ERROR,
										    });
					return;
					}
				}
				
				//2
				if(mechCond==""||mechCond==undefined)
				{
					sap.m.MessageBox.show("Select Mechanical Condition", {
										        title: "Error",
										        icon:sap.m.MessageBox.Icon.ERROR,
										    });
					return;
					}
					if(mechCond =="N")
					{
						if(mechReason==undefined||mechReason==""){
							sap.m.MessageBox.show("Enter Mechanical Condition Reason", {
						        title: "Error",
						        icon:sap.m.MessageBox.Icon.ERROR,
						    });
							return;
						}
					
					}
					
					//3
					
					if(VehicleMake ==""||VehicleMake==undefined)
					{
					sap.m.MessageBox.show("Enter Vehicle Make", {
										        title: "Error",
										        icon:sap.m.MessageBox.Icon.ERROR,
										    });
					return;
					}
					//4
					if(VehicleModel ==""||VehicleModel==undefined)
					{
					sap.m.MessageBox.show("Enter Vehicle Model", {
										        title: "Error",
										        icon:sap.m.MessageBox.Icon.ERROR,
										    });
					return;
					}
					//5
					if(ConfigCode ==""||ConfigCode==undefined)
					{
					sap.m.MessageBox.show("Enter Configuration Code", {
										        title: "Error",
										        icon:sap.m.MessageBox.Icon.ERROR,
										    });
					return;
					}
					//6
					if(ProdSize ==""||ProdSize==undefined)
					{
					sap.m.MessageBox.show("Enter Product Size", {
										        title: "Error",
										        icon:sap.m.MessageBox.Icon.ERROR,
										    });
					return;
					}
					
					
				var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
				var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oReadModel.setHeaders({
					"Content-Type" : "application/json"
				});
				var fncSuccess = function(oData, oResponse){
					
					if(oData.Error=="X" ){
						that.Flag = "X";
						sap.m.MessageBox.show("This Vehicle is already Registered", {
							title : "Error",
							icon : sap.m.MessageBox.Icon.ERROR,
							onClose:function(){
							
							}
							});	
						return;
					}else{
						that.colListItem = new sap.m.ColumnListItem({
							cells:[

							       new sap.m.Text({
							    	   text:VehicleRegNo
							       }),
							       new sap.m.Text({
							    	   text:ContractType
							       }),
							       new sap.m.Text({
							    	   text: VehicleMake
							       }),
							       new sap.m.Text({
							    	   text:VehicleModel
							       }),
							       new sap.m.Text({
							    	   text: ConfigCode
							       }),
							       new sap.m.Button({press:[that.onDelete,that],visible:true,type:"Reject",icon:"sap-icon://delete"}),
							       new sap.m.Text({
							    	   text:ProdSize,
							    	   visible:false
							       }),
							       new sap.m.Text({
							    	   text: ChassisNo,
							    	   visible:false
							       }),
							       new sap.m.Text({
							    	   text:EngineNo,
							    	   visible:false
							       }),
							       new sap.m.Text({
							    	   text: BodyType,
							    	   visible:false
							       }),
							       new sap.m.Text({
							    	   text:AppType,
							    	   visible:false
							       }),
							       new sap.m.Text({
							    	   text:VehicleMakeCode,
							    	   visible:false
							       }),
							       new sap.m.Text({
							    	   text:mechCond,
							    	   visible:false
							       }),
							       new sap.m.Text({
							    	   text:mechReason,
							    	   visible:false
							       }),
							       ]
						})
						tab.addItem(that.colListItem);
						that._EntriesHelpDialog.close();
					}
				}
					
				var fncError = function(oError) { // error callback
					// function
						var parser = new DOMParser();
						var message = parser.parseFromString(
						oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML;
						sap.m.MessageBox.show(message, {
						title : "Error",
						icon : sap.m.MessageBox.Icon.ERROR,
						});
				}
				oReadModel.read("/ValidateVehicleNumberSet(RegNo='"+VehicleRegNo+"')", {
					success : fncSuccess,
					error : fncError
				});

				if(mechCond ==""||mechCond==undefined)
				{
				sap.m.MessageBox.show("Select Mechanical Condition", {
									        title: "Error",
									        icon:sap.m.MessageBox.Icon.ERROR,
									    });
				return;
				}
				if(mechCond =="N")
				{
					if(mechReason==undefined||mechReason==""){
						sap.m.MessageBox.show("Enter Mechanical Condition Reason", {
					        title: "Error",
					        icon:sap.m.MessageBox.Icon.ERROR,
					    });
						return;
					}
				
				}
				if(ProdSize ==""||ProdSize==undefined)
				{
				sap.m.MessageBox.show("Enter Product Size", {
									        title: "Error",
									        icon:sap.m.MessageBox.Icon.ERROR,
									    });
				return;
				}
				if(VehicleRegNo ==""||VehicleRegNo==undefined)
				{
				sap.m.MessageBox.show("Enter Vehicle Registeration Number", {
									        title: "Error",
									        icon:sap.m.MessageBox.Icon.ERROR,
									    });
				return;
				}
				if(that.EnrolMode !== "F"){
					if(ContractType ==""||ContractType==undefined)
					{
					sap.m.MessageBox.show("Select Contract Type", {
										        title: "Error",
										        icon:sap.m.MessageBox.Icon.ERROR,
										    });
					return;
					}
				}else{
					ContractType = "SC";
				}
				if(VehicleMake ==""||VehicleMake==undefined)
				{
				sap.m.MessageBox.show("Enter Vehicle Make", {
									        title: "Error",
									        icon:sap.m.MessageBox.Icon.ERROR,
									    });
				return;
				}
				if(VehicleModel ==""||VehicleModel==undefined)
				{
				sap.m.MessageBox.show("Enter Vehicle Model", {
									        title: "Error",
									        icon:sap.m.MessageBox.Icon.ERROR,
									    });
				return;
				}
				if(ConfigCode ==""||ConfigCode==undefined)
				{
				sap.m.MessageBox.show("Enter Configuration Code", {
									        title: "Error",
									        icon:sap.m.MessageBox.Icon.ERROR,
									    });
				return;
				}
				
				this._EntriesHelpDialog.close();
				this._EntriesHelpDialog.destroy(true);
			},
			
			onDelete:function(evt){
				evt.getSource().getParent().getParent().removeItem(evt.getSource().getParent());
			},
			
			onTabelEntriesClose: function(evt)
			{
				this._EntriesHelpDialog.close();
			},
			
			onSave : function()
			{	
				
				var _self=this;
				var tab = this.getView().byId("tableVehicle");
				var length = tab.getItems().length;
				var obj = [];
				for(var i=0;i<length;i++)
					{
					var RegNo = tab.getItems()[i].getCells()[0].getText();
					var ContractType = tab.getItems()[i].getCells()[1].getText();
					var VehMake = tab.getItems()[i].getCells()[11].getText();
					var VehModel = tab.getItems()[i].getCells()[3].getText();
					var ConfigCode = tab.getItems()[i].getCells()[4].getText();
					var ProdSize = tab.getItems()[i].getCells()[6].getText().split("-")[0];
					var ChasisNo = tab.getItems()[i].getCells()[7].getText();
					var EngineNo = tab.getItems()[i].getCells()[8].getText();
					var BodyType = tab.getItems()[i].getCells()[9].getText().split("-")[0];
					var AppType = tab.getItems()[i].getCells()[10].getText().split("-")[0];
					var mechCond = tab.getItems()[i].getCells()[12].getText();
					var mechReason = this.Reason;
					if(_self.EnrolMode === "F"){
						ContractType = "SC";
					}
					obj.push({
						RegNo : RegNo,
						ContractType : ContractType,
						MakeCode : VehMake,
						Model : VehModel,
						ConfigCode : ConfigCode,
						ProdSize : ProdSize,
						ChassisNo : ChasisNo,
						EngineNo : EngineNo,
						BodyType : BodyType,
						AppType : AppType,
						MechCond: mechCond,
						MechCondReason : mechReason
					});
					}
				var Data = {};
				Data.Kunnr = this.Kunnr;
//				Data.HubCode = this.HubCode;
				Data.VhclRegisHeadToItemNvg = obj;
				var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
				var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oCreateModel1.setHeaders({
					"Content-Type": "application/atom+xml"
					});
				var _self=this;
				var fncSuccess = function(oData){
					;
					var that = _self;
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
				        	var object = that.getView().byId("splitApp");
				    		object.toDetail(that.getView().byId("vehicleDetailPage"));
				    		
				    		_self.initialPageConditions();
				    		location.reload();
				    			
				        }
				    });
					}
				}
				var fncError = function(oError) { //error callback function
					;
					var parser = new DOMParser();
					var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
					sap.m.MessageBox.show(message, {
				        title: "Error",
				        icon:sap.m.MessageBox.Icon.ERROR,
				    });
				}
				//Create Method for final Save
				oCreateModel1.create("/SaveVehicleRegistrationHeadSet", Data, {
					success: fncSuccess,
					error: fncError
				});
			},
			
			onVehicalDetails:function(){
				debugger
				var vecNo=this.RegNo;
				this.getView().byId("inpRegNo").setValue(vecNo)
					var that = this;
					
					var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
					var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
					oReadModel.setHeaders({
						"Content-Type" : "application/json"
					});
					var fncSuccess = function(oData, oResponse) // success
					{
						var hubCode = oData.HubCode;
						var vehicleMake = oData.MakeCode;
						var vehicleMakeDesc = oData.MakeName;
						var vehicleModel = oData.Model;
						var configCode = oData.ConfigCode;
						var configCodeDesc = oData.ConfigCodeDesc;
						var prodSize = oData.TyreSize;
						var chassisNo = oData.ChassisNo;
						var engineNo = oData.EngineNo;
						var bodyType = oData.BodyType;
						var appType = oData.AppType;
						var contractType = oData.ContractType;
						var mechCond = oData.MechCond;
						
//						that.getView().byId("inpHubCode").setValue(hubCode);
						that.getView().byId("inpVehicleMake").setValue(vehicleMakeDesc);
						that.getView().byId("inpVehModel").setValue(vehicleModel);
						that.getView().byId("inpConfigCode").setValue(configCodeDesc);
						that.getView().byId("inpProdSize").setValue(prodSize);
						that.getView().byId("inpChassisNo").setValue(chassisNo);
						that.getView().byId("inpEngineNo").setValue(engineNo);
//						that.getView().byId("inpBodyType").setValue(bodyType);
//						that.getView().byId("inpAppType").setValue(appType);
						if(contractType!=""&&contractType!=undefined)
						that.getView().byId("selectContractType").setSelectedKey(contractType);
						if(mechCond!=""&&mechCond!=undefined)
						that.getView().byId("selectMechCond").setSelectedKey();
						
						
					}
					var fncError = function(oError) { // error callback
														// function
						var parser = new DOMParser();
						var message = parser.parseFromString(
								oError.response.body, "text/xml")
								.getElementsByTagName("message")[0].innerHTML
						sap.m.MessageBox.show(message, {
							title : "Error",
							icon : sap.m.MessageBox.Icon.ERROR,
						});
					}
					// Create Method for final Save
						oReadModel.read("/VehicleRegNoSet(RegNo='"+vecNo+"',Type='V')?$expand=RegnoToItemNvg/VitemToServiceNvg/IservToSubservNvg,RegnoToServiceNvg/VServToSubservNvg ", {
						success : fncSuccess,
						error : fncError
					});

			},
			
			onSaveEdit : function()
			{	
				
				var reason;
				var _self = this;
				var kunnr = this.Kunnr;
				var regNo = this.RegNo;
				var CN = this.getView().byId("ChasisNoIDPage").getValue();
				var EN = this.getView().byId("EngineNooIDPage").getValue();
				var contractType = this.getView().byId("serviceTypeInp").getValue();
				 if(contractType == "Service Contract"){
					 contractType = "SC";
				 }else if(contractType == "Charge Per KM"){
						 contractType = "CPKM"
				 }else if(contractType == "None"){
					 contractType = "NONE"
				 }
				 
				var newContractType = this.getView().byId("IdServiceContract").getSelectedKey();// changes by amit on 05-08-2019
				var oldmechCond = this.getView().byId("mechCondInp").getValue();
				 if(oldmechCond == "Not OK"){
					 oldmechCond = "N"
				  }else{
					  if(oldmechCond == "OK"){
						  oldmechCond = "Y";
					  }else{
						  oldmechCond = "";
					  }
				  }
				var mechCond = this.getView().byId("idmccon").getSelectedKey();
				if(mechCond == "N")
					reason = this.Reason;
				else
					reason = "";
				
				if(kunnr ==""||kunnr==undefined)
				{
				sap.m.MessageBox.show("Select Fleet", {
									        title: "Error",
									        icon:sap.m.MessageBox.Icon.ERROR,
									    });
				return;
				}
				if(regNo ==""||regNo==undefined)
				{
				sap.m.MessageBox.show("Enter Vehicle Registeration Number", {
									        title: "Error",
									        icon:sap.m.MessageBox.Icon.ERROR,
									    });
				return;
				}
				
				if(this.getView().byId("serviceTypeInp").getVisible == true && newContractType == ""){
					sap.m.MessageBox.show("Select Contract Type", {
				        title: "Error",
				        icon:sap.m.MessageBox.Icon.ERROR,
				    });
					return;
				}
				
				var Data = {};
				Data.Kunnr = kunnr;
				Data.RegNo = regNo;
				Data.ContractType = contractType;
				Data.ContractTypeNew = newContractType;
				Data.MechCond = oldmechCond;
				Data.MechCondNew = mechCond;
				Data.ChassisNo = CN;
				Data.EngineNo = EN;
				var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
				var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oCreateModel1.setHeaders({
					"Content-Type": "application/atom+xml"
					});
				var _self=this;
				var fncSuccess = function(oData){
					;
					var that = _self;
					if(oData.Error=="X"){
						sap.m.MessageBox.show(oData.Message, {
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
				        	var object = that.getView().byId("splitApp");
				    		object.toDetail(that.getView().byId("vehicleDetailPage"));
//				        	_self.bindMasterList();
				        	location.reload();
				    				
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
				oCreateModel1.create("/UpdateVehicleRegistrationSet", Data, {
					success: fncSuccess,
					error: fncError
				});
			},
			
		onDeselect:function(){
		  this.getView().byId('equipmentList').removeSelections(true);
		  this.getView().byId('btnDeselect').setVisible(false);
		  this.getView().byId('btnSelect').setVisible(true);
		 },

		 initialPageConditions: function(){
			 
			 	this.getView().byId("btnSaveEdit").setVisible(false);
				this.getView().byId("btnBackEdit").setVisible(false);
				this.getView().byId("btnEdit").setVisible(true);
			 
			 	this.getView().byId("LChasisNoEditPage").setVisible(false);
				this.getView().byId("ChasisNoIDPage").setVisible(false);
				this.getView().byId("ChasisNoID").setVisible(true);
				this.getView().byId("LChasisNoEdit").setVisible(true);
				this.getView().byId("LEngineNoEditPage").setVisible(false);
				this.getView().byId("EngineNooIDPage").setVisible(false);
				this.getView().byId("EngineNooID").setVisible(true);
				this.getView().byId("LEngineNoEdit").setVisible(true);

				this.getView().byId("IdServiceContract").setVisible(false);
				this.getView().byId("IdServiceContract").setSelectedKey();
				this.getView().byId("idmccon").setVisible(false);
				this.getView().byId("idmccon").setSelectedKey();
				
				var contractSelect = this.getView().byId("IdServiceContract");
				contractSelect.removeAllItems();
		 }
});