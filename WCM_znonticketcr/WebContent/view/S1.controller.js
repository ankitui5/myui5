		var vehicleType,vehicleMake,vehicleModel,vehicleVarient,vehicleTyp,ComplaintReportNo;
		
		var  CustType,FitType ,TicketSource,CustomerTelf1,CustomerTelf2,CustomerFname,
		CustomerLname,CustomerAddr1,CustomerAddr2, CustomerLand1, CustomerRegion,
		CustomerCity2,Location,CustomerEmail,Tele,compTicket,check;
		
		jQuery.sap.require("sap.ui.core.mvc.Controller");
		jQuery.sap.require("com.acute.nonptktcr.util.Formatter");
		jQuery.sap.require("sap.m.MessageBox");
		/*jquert.sap.require("sap.m.library")*/
		
		var DataArticles, that ,ComplaintReportNo;
		sap.ui.core.mvc.Controller.extend(
		"com.acute.nonptktcr.view.S1",
		{
		
			_data : {
				"date" : new Date()  
					},
					
			onInit : function() {
				that = this;
			
		var oDateModel = new sap.ui.model.json.JSONModel(this._data);
		this.getView().setModel(oDateModel);
		this.newBusy = new sap.m.BusyDialog();
		this.model = this.getOwnerComponent().getModel();
		if (!jQuery.support.touch) {
		this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {
		}
		this.selectedTabKey = "Product";
		this.onTypeofCustomer();
		this.onFitmentType();
	//	this.onTyreCondition();
		this.onTicketSource();
	//	this.onTypeofCustomer();
		this.onComplaintAg();
		this.onComplaintRel();
		this.onComplaintType();
	
	//	this.onComplaintRep();
	//	this.onProductCategory();
		
		this.onPaymentMode();
		this.onEmiCheck();
		this.onBankDropDown();
		this.onNonElgResnDropDown();
		debugger
		this.onOprNatureDropDown();
		this.onTypeofBusiness();
		this.onTyreDealershipDropDown();
		this.onLineOfBusDropDown();
		this.onPanTinDropDown();
		this.onTyreRelatedDropDown();
		this.onRetailPropertyTypeDropDown();
		this.onQuerySourceDropDown();
		this.onInvestTimelineDropDown();
		this.onJKPrdCatDropDown();
	
	//	this.onConditionMatchDropDown();
		
		this.onWarrantyTyreFitMent();
		this.onCallOutcome();
		this.onQueryStatus();
		this.onQueryOn();
		
	/*	this.onTyreCondition();*/
		 var oDatePicker = this.getView().byId("inpPrfrdDay");
			oDatePicker.addEventDelegate({
				onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#'+oID).attr("disabled", "disabled"); 
				}},oDatePicker);
	
		},
		
/************************************************************************************************/
		/*Vehicle Type f4 starts*/
		onVehicleType : function()
		{ debugger
		var selectedTab= this.selectedTabKey;
		if(selectedTab == "warranty" || selectedTab == "Product" || selectedTab =="prdEnquiry")
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleTypeSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpSelectDialog = new sap.m.SelectDialog({
		
		title: "Vehicle Type",
		items: {
		path: "/d/results",
		template: new sap.m.StandardListItem({
		title: "{Type}",
		customData: [new sap.ui.core.CustomData({
		key: "{Type}",
		value: "{Type}"
		})]
		
		})
		},
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleVehicleTypeClose, this],
		cancel: [this._handleVehicleTypeClose, this]
		});
		_valueHelpSelectDialog.setModel(jModel);
		_valueHelpSelectDialog.open();
		},
		_handleVehicleTypeClose:function(oEvent)
		{debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		this.VehicleModel = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		var selectedTab= this.selectedTabKey;
		if(selectedTab == "warranty"){
		vehicleTyp =	 this.getView().byId("idWrntyVehicleType").setValue(oSelectedItem.getTitle());
		this.getView().byId("inpWarrantyVehicleMake").setEnabled(true).setValue();
		this.getView().byId("inpWarrantyModel").setValue();
		
		}
		else if(selectedTab == "Product"){
		vehicleTyp =	this.getView().byId("idVehicle").setValue(oSelectedItem.getTitle());
		this.getView().byId("idVehicleMake").setEnabled(true);
		this.getView().byId("idVehicleMake").setValue();
		this.getView().byId("idModel").setValue().setEnabled(false);
		this.getView().byId("idVariant").setValue().setEnabled(false);
		this.onTyreCondition();
		
		}
		else if(selectedTab == "prdEnquiry"){
			vehicleTyp =	this.getView().byId("idVehiclePE").setValue(oSelectedItem.getTitle());
			this.getView().byId("inpVehicleMakePE").setEnabled(true).setValue();
			this.getView().byId("inpModelPE").setValue().setEnabled(false);
			this.getView().byId("inpVariantPE").setValue().setEnabled(false);
		}
		}
		},
		/*Vehicle Type f4 ends*/
		
		/*Vehicle Make f4 starts(bhushan)*/
		onVehicleMakeHelp : function()
		{
			debugger
		var selectedTab= this.selectedTabKey;
		if(selectedTab == "warranty"){
		vehicleTyp = this.getView().byId("idWrntyVehicleType").getValue();
		}
		else if(selectedTab == "Product")
		{
		vehicleTyp = this.getView().byId("idVehicle").getValue();
		}
		else
		{
		vehicleTyp = this.getView().byId("idVehiclePE").getValue();
		}
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleMakeSet?$filter=Type eq '"+vehicleTyp+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpSelectDialog = new sap.m.SelectDialog({
		
		title: "Vehicle Make",
		items: {
		path: "/d/results",
		template: new sap.m.StandardListItem({
		title: "{Make}",
		customData: [new sap.ui.core.CustomData({
		key: "{Make}",
		value: "{Make}"
		})]
		
		})
		},
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("Make", sap.ui.model.FilterOperator.Contains, sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleVehicleMakeClose, this],
		cancel: [this._handleVehicleMakeClose, this]
		});
		_valueHelpSelectDialog.setModel(jModel);
		_valueHelpSelectDialog.open();
		},
		_handleVehicleMakeClose:function(oEvent)
		{debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		
		this.VehicleMake = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		var selectedTab= this.selectedTabKey;
		if(selectedTab == "warranty"){
		 vehicleMake = this.getView().byId("inpWarrantyVehicleMake").setValue(oSelectedItem.getTitle());
		this.getView().byId("inpWarrantyModel").setEnabled(true).setValue();
		
		}
		else if(selectedTab == "Product")
		{
		this.getView().byId("idVehicleMake").setValue(oSelectedItem.getTitle());
		this.getView().byId("idModel").setEnabled(true);
		this.getView().byId("idVariant").setValue().setEnabled(false);
		this.getView().byId("idModel").setValue();
		}
		else  if(selectedTab == "prdEnquiry") {
			this.getView().byId("idVariant").setValue().setEnabled(false);
			this.getView().byId("inpVehicleMakePE").setValue(oSelectedItem.getTitle());
			this.getView().byId("inpModelPE").setEnabled(true).setValue();
			this.getView().byId("inpVariantPE").setValue().setEnabled(false);
		}
		
		}
		},
		/*Vehicle Make f4 ends*/
		
		/*Vehicle Model F4 Starts (Bhushan)	*/
		onModelHelp : function()
		{
		debugger
		var selectedTab= this.selectedTabKey;
		if(selectedTab == "warranty"){
		vehicleType = this.getView().byId("idWrntyVehicleType").getValue();
		vehicleMake = this.getView().byId("inpWarrantyVehicleMake").getValue();}
		else if(selectedTab == "Product"){
		vehicleType = this.getView().byId("idVehicle").getValue();
		vehicleMake = this.getView().byId("idVehicleMake").getValue();
		}
		else{
		vehicleType = this.getView().byId("idVehiclePE").getValue();
		vehicleMake = this.getView().byId("inpVehicleMakePE").getValue();
		}
		
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleModelSet?$filter=Type eq '"+vehicleType+"'and Make eq '"+vehicleMake+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpSelectDialog = new sap.m.SelectDialog({
		
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
		_valueHelpSelectDialog.setModel(jModel);
		_valueHelpSelectDialog.open();
		},
		_handleVehicleModelClose:function(oEvent)
		{
		debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		this.VehicleModel = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		var selectedTab= this.selectedTabKey;
		if(selectedTab == "warranty"){
		vehicleModel = this.getView().byId("inpWarrantyModel").setValue(oSelectedItem.getTitle());
		this.getView().byId("idWarrantyVariant").setEnabled(true);
		this.getView().byId("inpWarrantyTyrePatternSize").setEnabled(true);
		this.getView().byId("inpWarrantyTyrePatternSize").setValue();
		}
		else if(selectedTab == "Product"){
		this.getView().byId("idModel").setValue(oSelectedItem.getTitle());
		this.getView().byId("idVariant").setEnabled(true);
		this.getView().byId("idVariant").setValue();
		}
		else{
		this.getView().byId("inpModelPE").setValue(oSelectedItem.getTitle());
		this.getView().byId("inpVariantPE").setEnabled(true);
		this.getView().byId("inpVariantPE").setValue();
		}
		
		}
		},
		/*Vehicle Model F4 ends (Bhushan)	*/
		
		/*Vehicle Varient F4 Starts (Bhushan)	*/
		onVariantHelp:function()
		{
		debugger
		var selectedTab= this.selectedTabKey;
		if(selectedTab == "warranty"){
		vehicleType = this.getView().byId("idWrntyVehicleType").getValue();
		vehicleMake = this.getView().byId("inpWarrantyVehicleMake").getValue();
		vehicleModel = this.getView().byId("inpWarrantyModel").getValue();}
		else if(selectedTab == "Product"){
		vehicleType = this.getView().byId("idVehicle").getValue();
		vehicleMake = this.getView().byId("idVehicleMake").getValue();
		vehicleModel = this.getView().byId("idModel").getValue();
		}
		else{
		vehicleType = this.getView().byId("idVehiclePE").getValue();
		vehicleMake = this.getView().byId("inpVehicleMakePE").getValue();
		vehicleModel = this.getView().byId("inpModelPE").getValue();
		}
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleVariantSet?$filter=Type eq '"+vehicleType+"'and Make eq '"+vehicleMake+"' and Model eq '"+vehicleModel+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpSelectDialog = new sap.m.SelectDialog({
		
		title: "Variant",
		items: {
		path: "/d/results",
		template: new sap.m.StandardListItem({
		title: "{Variant}",
		customData: [new sap.ui.core.CustomData({
		key: "{Variant}",
		value: "{Variant}"
		})]
		
		})
		},
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("Variant", sap.ui.model.FilterOperator.Contains, sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleVariantClose, this],
		cancel: [this._handleVariantClose, this]
		});
		_valueHelpSelectDialog.setModel(jModel);
		_valueHelpSelectDialog.open();
		},
		_handleVariantClose:function(oEvent)
		{debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		this.VehicleVariant = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		var selectedTab= this.selectedTabKey;
		if(selectedTab == "Product")
		this.getView().byId("idVariant").setValue(oSelectedItem.getTitle());
		else
		this.getView().byId("inpVariantPE").setValue(oSelectedItem.getTitle());
		}
		},
		/*Vehicle Varient F4 ends (Bhushan)	*/
		
		
		/********************************Warranty variant************************/
		onVehicleVariant : function(){
			var vehtype = this.getView().byId("idWrntyVehicleType").getValue();
			var vehMake = this.getView().byId("inpWarrantyVehicleMake").getValue();
			var vehModel = this.getView().byId("inpWarrantyModel").getValue();
			var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleVariantSet?$filter=Type eq '"+vehtype+"' and Make eq '"+vehMake+"' and Model eq '"+vehModel+"'";
		 	var jModel = new sap.ui.model.json.JSONModel();
		 	jModel.loadData(sPath, null, false,"GET",false, false, null);
		    var _valueVariantHelpSelectDialog = new sap.m.SelectDialog({
		    	
		        title: "Vehicle Variant",
		        items: {
		            path: "/d/results",
		            template: new sap.m.StandardListItem({
		                title: "{Variant}",
		                customData: [new sap.ui.core.CustomData({
		                    key  : "{Variant}",
		                    value: "{Variant}"
		                })],    	               
		            }),
		        },
		        liveChange: function(oEvent) {
		            var sValue  = oEvent.getParameter("value");
		            var oFilter = new sap.ui.model.Filter("Variant",sap.ui.model.FilterOperator.Contains,sValue);
		            oEvent.getSource().getBinding("items").filter([oFilter]);
		        },
		        confirm: [this._handleVechVariantClose, this],
		        cancel : [this._handleVechVariantClose, this]
		    });
		    _valueVariantHelpSelectDialog.setModel(jModel);
		    _valueVariantHelpSelectDialog.open();
		},

		_handleVechVariantClose: function(oEvent) {
		    var oSelectedItem = oEvent.getParameter("selectedItem");
		    if (oSelectedItem) {
		        this.getView().byId("idWarrantyVariant").setValue(oSelectedItem.getTitle());
		    }      
			
		},
		
		
		/***********************PRoduct dealer f4 *************************************************************************/
		onDelarCodeType:function(){
		debugger
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpDealerSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var _valueHelpDealertDialog = new sap.m.SelectDialog({
		
		title: "Dealer Code",
		items: {
		path: "/d/results",
		template: new sap.m.StandardListItem({
		title: "{name1}",
		description : "{kunnr}",
		customData: [new sap.ui.core.CustomData({
		key: "Key",
		value: "{kunnr}"
		})],
		
		}),
		},
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("name1",sap.ui.model.FilterOperator.Contains,sValue);
		var oFilter2 = new sap.ui.model.Filter("kunnr",sap.ui.model.FilterOperator.Contains,sValue);
		
		var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
		oEvent.getSource().getBinding("items").filter([oFilter1]);
		},
		confirm: [this._handleDealerClose, this],
		cancel: [this._handleDealerClose, this]
		});
		_valueHelpDealertDialog.setModel(jModel);
		_valueHelpDealertDialog.open();
		},
		_handleDealerClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		this.Dealer = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		this.getView().byId("idDealCodeInput").setValue(oSelectedItem.getDescription());
		this.getView().byId("idDealDescInput").setValue(oSelectedItem.getTitle());
		}
		},
		
		/***********************************************************************************************/
		onTyreCondition:function(){
		debugger
		 var tyre = this.getView().byId("idVehicle").getValue();
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TyreConditionSet?$filter=Type eq '"+tyre+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var  loc= this.getView().byId("idCondition");
		loc.unbindAggregation("items");
		
		loc.setModel(jModel);
		loc.bindAggregation("items", {
		path : "/d/results",
		template : new sap.ui.core.Item({
		key : "{Condition}",
		text : "{Description}"
		})
		});
		},
		
	
	/************************************************Stencil validation*********************************************************/	
		
	
		ValidateStencil : function(oEvent){
			debugger
			var text1 = this.getView().byId("inpTyreSerialNo1").getValue();
			var text2 = this.getView().byId("inpTyreSerialNo2").getValue();
			var text3 = this.getView().byId("inpTyreSerialNo3").getValue();
			var text4 = this.getView().byId("inpTyreSerialNo4").getValue();
			var text5 = this.getView().byId("inpTyreSerialNo5").getValue();
			
			if(oEvent.getSource().getValue().length == 5 || oEvent.getSource().getValue().length == 9 || oEvent.getSource().getValue().length == 11){
				debugger
				if(oEvent.getSource().getId() != "__xmlview1--inpTyreSerialNo1" && oEvent.getSource().getValue() == text1 && oEvent.getSource().getValue() !=""){
					sap.m.MessageToast.show("Duplicate Stencil Entered.");
					oEvent.getSource().setValue();
					return false;
				}
				else if(oEvent.getSource().getId() != "__xmlview1--inpTyreSerialNo2" && oEvent.getSource().getValue() == text2 && oEvent.getSource().getValue() !=""){
					sap.m.MessageToast.show("Duplicate Stencil Entered.");
					oEvent.getSource().setValue();
					return false;
				}
				else if(oEvent.getSource().getId() != "__xmlview1--inpTyreSerialNo3" && oEvent.getSource().getValue() == text3 && oEvent.getSource().getValue() !=""){
					sap.m.MessageToast.show("Duplicate Stencil Entered.");
					oEvent.getSource().setValue();
					return false;
				}
				else if(oEvent.getSource().getId() != "__xmlview1--inpTyreSerialNo4" && oEvent.getSource().getValue() == text4 && oEvent.getSource().getValue() !=""){
					sap.m.MessageToast.show("Duplicate Stencil Entered.");
					oEvent.getSource().setValue();
					return false;
				}
				else if(oEvent.getSource().getId() != "__xmlview1--inpTyreSerialNo5" && oEvent.getSource().getValue() == text5 && oEvent.getSource().getValue() !=""){
					sap.m.MessageToast.show("Duplicate Stencil Entered.");
					oEvent.getSource().setValue();
					return false;
				}
			}	
	
			
			text = oEvent.getSource().getValue();
			oEvent.getSource().setValue(text.toUpperCase());
		    
		   // this.event = text;
		      this.event = oEvent.getSource();
			
			var stencilNumber = oEvent.getSource().getValue()
			/*var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(
					sServiceUrl);
			oReadModel.setHeaders({
				"Content-Type" : "application/atom+xml"
			});*/
			/*var fncError = function(oError) { // error callback
				var parser = new DOMParser();
				var message = parser.parseFromString(
						oError.response.body, "text/xml")
						.getElementsByTagName("message")[0].innerHTML
						sap.m.MessageBox.show(message, {
							title : "Error",
							icon : sap.m.MessageBox.Icon.ERROR,
						});
			}*/
			/*var fncSuccess = function(oData, oResponse){
				
				if (oData.Message != "") {
					that.stencilFlag = "";
					sap.m.MessageBox.show(oData.Message, {
						title : "Error",
						icon : sap.m.MessageBox.Icon.ERROR,
						onClose : function() {
							that.event.setValue("");
							that.event.setValueState("Error");
							return false;
						}
					});
				}
				else{
					that.stencilFlag = "X";
				}
			}*/
			/*oReadModel.read("ValidateStencilNumberSet(ClaimRecDepo='"+DepoCode+"',ItemCode='"+ItmCode+"',StencilNo='"+stencilNumber+"')",
					{
				success : fncSuccess,
				error : fncError
			});*/
			
		},
		
		/*******************************************************************************************************/	
		onNoTyreChange:function(){
		debugger
		var noOfTyre = this.getView().byId("inpNoTyrePurchased").getSelectedKey();
		if(noOfTyre == "1"){
		this.getView().byId("inpTyreSerialNo1").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo2").setVisible(false);
		this.getView().byId("inpTyreSerialNo3").setVisible(false);
		this.getView().byId("inpTyreSerialNo4").setVisible(false);
		this.getView().byId("inpTyreSerialNo5").setVisible(false);
		
		}else if(noOfTyre == "2"){
		this.getView().byId("inpTyreSerialNo1").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo2").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo3").setVisible(false);
		this.getView().byId("inpTyreSerialNo4").setVisible(false);
		this.getView().byId("inpTyreSerialNo5").setVisible(false);
		}else if(noOfTyre == "3"){
		this.getView().byId("inpTyreSerialNo1").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo2").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo3").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo4").setVisible(false);
		this.getView().byId("inpTyreSerialNo5").setVisible(false);
		}else if(noOfTyre == "4"){
		this.getView().byId("inpTyreSerialNo1").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo2").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo3").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo4").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo5").setVisible(false);
		}else if(noOfTyre == "5"){
		this.getView().byId("inpTyreSerialNo1").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo2").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo3").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo4").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo5").setVisible(true).setRequired(true).setValue("").setValueState(sap.ui.core.ValueState.None);
		}
		},
		
		/********************This method called from onInit() **********************************************/
		onTabSelected:function(oEvent){
		this.selectedTabKey = oEvent.getSource().getSelectedKey();
		},
		
		/***********************************On Save Button**************************************************************************************/
		
		onSave : function(){
		debugger
		check = false;
		this.OnValidation();
		if(check!=false){
			return;
		}
		
		if(this.selectedTabKey == "Product"){
		this.OnPrdctVehDtl();
		}
		else if(this.selectedTabKey == "nonProduct"){
		this.onNonProductCreate();
		}
		else if(this.selectedTabKey == "prdEnquiry"){
		this.onPrdEnquiryCreate();
		}
		else if(this.selectedTabKey == "dealEnquiry"){
		this.onDealEnquiryCreate();
		}
		else if(this.selectedTabKey == "genEnquiry"){
		this.onGenEnqCreate();
		}
		else if(this.selectedTabKey == "warranty"){
		this.onWarrantyCreate();
		}
		},
		
		
		/******************************************On validation for all icon tabbar************************************************************************/
		OnValidation : function(){
		debugger
		CustType		= this.getView().byId("idCustomer").getSelectedKey();
		FitType 		= this.getView().byId("idFitment").getSelectedKey();
		TicketSource 	= this.getView().byId("idTicketSource").getSelectedKey();
		CustomerTelf1 	= this.getView().byId("idPhone1").getValue();
		CustomerTelf2 	= this.getView().byId("idPhone2").getValue();
		CustomerFname 	= this.getView().byId("idFname").getValue();
		CustomerLname 	= this.getView().byId("idLname").getValue();
		CustomerAddr1 	= this.getView().byId("idAdd1").getValue();
		CustomerAddr2 	= this.getView().byId("idAdd2").getValue();
		CustomerLand1 	= this.getView().byId("idCountry").getSelectedKey();
		CustomerRegion 	= this.State;
		CustomerCity2 	= this.getView().byId("idDistrict").getValue();
		Location	 	= this.getView().byId("idCity").getValue();
		CustomerEmail 	= this.getView().byId("idEmail").getValue();
		
		this.getView().byId("idCity").setValueState("None");
		this.getView().byId("idDistrict").setValueState("None");		
		this.getView().byId("idState").setValueState("None");
		this.getView().byId("idAdd1").setValueState("None");
		this.getView().byId("idFname").setValueState("None");
		this.getView().byId("idPhone1").setValueState("None");
		this.getView().byId("idTicketSource").setValueState("None");
		this.getView().byId("idFitment").setValueState("None");
		this.getView().byId("idCustomer").setValueState("None");
		
		if(CustomerEmail.length != 0){
			var e= this.getView().byId("idEmail").getValue();
			var atindex= e.indexOf('@');
			var dotindex=e.lastIndexOf('.');
			if(atindex<1 || dotindex>=e.length-2 || dotindex-atindex<3){
			sap.m.MessageToast.show("Invalid Email");
			this.getView().byId("idEmail").setValueState("Error");
			check = true;
			return
			}
			else {
			this.getView().byId("idEmail").setValueState("None");
			}
		}
		
		if(CustomerTelf1.length < 10 && CustomerTelf1.length != 0)
		{
		sap.m.MessageToast.show("Phone No. can not be less than 10 digits");
		this.getView().byId("idPhone1").setValueState("Error");
		check = true;
		return
		}
		else {
		this.getView().byId("idPhone1").setValueState("None");
		}	
		
		if(CustomerTelf2.length < 10 && CustomerTelf2.length != 0)
		{
		sap.m.MessageToast.show("Phone No. can not be less than 10 digits");
		this.getView().byId("idPhone2").setValueState("Error");
		check = true;
		return
		}
		else {
		this.getView().byId("idPhone2").setValueState("None");
		}			
		
		if(CustType == "")
		{
		check = true;
		this.getView().byId("idCustomer").setValueState("Error");
		}
		
		if(FitType == "")
		{
		check = true;
		this.getView().byId("idFitment").setValueState("Error");
		}
		
		if(TicketSource == "")
		{
		check = true;
		this.getView().byId("idTicketSource").setValueState("Error");
		}
		
		if(CustomerTelf1 == ""){
		check = true;
		this.getView().byId("idPhone1").setValueState("Error");
		}	
	
		if(CustomerFname == "")
		{
		check = true;
		this.getView().byId("idFname").setValueState("Error");
		}
		
		if(CustomerAddr1 == "")
		{
		check = true;
		this.getView().byId("idAdd1").setValueState("Error");
		}
		
		if(CustomerRegion == "" || CustomerRegion == undefined )
		{
		check = true;
		this.getView().byId("idState").setValueState("Error");
		}
		
		if(CustomerCity2 == "")
		{
		check = true;
		this.getView().byId("idDistrict").setValueState("Error");
		}
		
		if(Location == "")
		{
		check = true;
		this.getView().byId("idCity").setValueState("Error");
		}
		
		if(check==true){
		sap.m.MessageBox.show("Please fill required fields", {
			title : "Error",
			icon : sap.m.MessageBox.Icon.ERROR,
			});
		}
		
		},
		

		/****************************************Product validation on vehicle********************************************/
		OnPrdctVehDtl : function()
		{ debugger
		var oFinal = {};
		oFinal.ICreate = true;
		oFinal.TicketNo = "";
		oFinal.TicketDate = null;
		oFinal.ServEngg = "";
		var check = false;
		
		debugger
		var VehicleType 		= this.getView().byId("idVehicle").getValue();
		var VehicleMake 		= this.getView().byId("idVehicleMake").getValue();
		var VehicleModel 		= this.getView().byId("idModel").getValue();
		var VehicleVariant 		= this.getView().byId("idVariant").getValue();
		var RegNo 				= this.getView().byId("idvehicleInput").getValue();
		var ChassisNo 			= this.getView().byId("idchassisInput").getValue();
		var KmsDone 			= this.getView().byId("idHours").getValue()!=""? parseInt(this.getView().byId("idHours").getValue()):0;
		var VechPurcMonth 		= this.getView().byId("idMonth").getSelectedKey();
		var VechPurcYear 		= this.getView().byId("idYear").getValue();
		var DealerCode 			= this.Dealer;
		var FranhiseName 	    = this.getView().byId("idFNameInput").getValue();
		var FranhiseContact 	= this.getView().byId("idFPNoInput").getValue();
		var FranhiseEmail 		= this.getView().byId("idFEmailInput").getValue();
		var FranhisePName 		= this.getView().byId("idFPNameInput").getValue();
		var FranhiseLoc 		= this.getView().byId("idFLocationInput").getValue();
		var NoOfTyres 			= this.getView().byId("idTyreInput").getValue()!=""? parseInt(this.getView().byId("idTyreInput").getValue()):0;
		var DefectiveTyres 		= this.getView().byId("idTyreInvolve").getValue()!=""? parseInt(this.getView().byId("idTyreInvolve").getValue()):0;
		var TyreDesrc 			= this.getView().byId("idText").getValue();
		var ComplDescr 			= this.getView().byId("idDescComp").getValue();
		var TyreCond 			= this.getView().byId("idCondition").getSelectedKey();
		var Remarks 			= this.getView().byId("idRemarks").getValue();
		
		
		
		if(VehicleType == "")
		{
		check = true;
		this.getView().byId("idVehicle").setValueState("Error");
		}
		else {
		this.getView().byId("idVehicle").setValueState("None");
		}
		
		if( FitType != "REP" && FitType !="" && VehicleMake == "")
		{
		check = true;
		this.getView().byId("idVehicleMake").setValueState("Error");
		}
		else {
		this.getView().byId("idVehicleMake").setValueState("None");
		}
		
		if(FitType != "REP" && FitType !="" && VehicleModel == "")
		{
		check = true;
		this.getView().byId("idModel").setValueState("Error");
		}
		else {
		this.getView().byId("idModel").setValueState("None");
		}
		
		if( FitType != "REP" && FitType !="" &&  VehicleVariant == "")
		{
		check = true;
		this.getView().byId("idVariant").setValueState("Error");
		}
		else {
		this.getView().byId("idVariant").setValueState("None");
		}
		
		if(FitType != "REP" && FitType !="" &&  RegNo == "")
		{
		check = true;
		this.getView().byId("idvehicleInput").setValueState("Error");
		}
		else {
		this.getView().byId("idvehicleInput").setValueState("None");
		}
		
		if(FitType != "REP" && FitType !="" && KmsDone == "")
		{
		check = true;
		this.getView().byId("idHours").setValueState("Error");
		}
		else {
		this.getView().byId("idHours").setValueState("None");
		}
		
		if(FitType == "OEM" && VechPurcMonth == "00" && FitType != "")
		{
		check = true;
		this.getView().byId("idMonth").setValueState("Error");
		}
		else {
		this.getView().byId("idMonth").setValueState("None");
		}
		
		if(FitType == "OEM" && VechPurcYear == "" && FitType != "")
		{
		check = true;
		this.getView().byId("idYear").setValueState("Error");
		}
		else {
		this.getView().byId("idYear").setValueState("None");
		}
		
		
		if(FitType == "OEM" && FranhiseName == "")
		{
		check = true;
		this.getView().byId("idFNameInput").setValueState("Error");
		}
		else {
		this.getView().byId("idFNameInput").setValueState("None");
		}
		
		if(FitType == "OEM" && FranhiseLoc == "")
		{
		check = true;
		this.getView().byId("idFLocationInput").setValueState("Error");
		}
		else {
		this.getView().byId("idFLocationInput").setValueState("None");
		}
		
	/*	if(FitType == "OEM" && FranhisePName == "" && CustType == "03")
		{
		check = true;
		this.getView().byId("idFPNameInput").setValueState("Error");
		}
		else {
		this.getView().byId("idFPNameInput").setValueState("None");
		}
		
		if(FitType == "OEM" && FranhiseContact == "" && CustType == "03")
		{
		check = true;
		this.getView().byId("idFPNoInput").setValueState("Error");
		}
		else {
		this.getView().byId("idFPNoInput").setValueState("None");
		}*/
		
		if(DefectiveTyres == "0")
		{
		check = true;
		this.getView().byId("idTyreInvolve").setValueState("Error");
		}
		else {
		this.getView().byId("idTyreInvolve").setValueState("None");
		}
		
		/*********************Franhise code validation*********************************/
		
		if (check == true){
		sap.m.MessageBox.show("Please fill all Required Fields.", {
		title: "ERROR",
		icon:sap.m.MessageBox.Icon.ERROR,
		});
		return;
		}
		
		debugger
		if(this.getView().byId("idDtTyreInput").getDateValue()!=null){
			var s = this.getView().byId("idDtTyreInput").getValue();
			s=s.split(".");
			var TyrePurcDate = s[2] + "-" + s[1] + "-" + s[0] + "T00:00:00";
			}else{
			var TyrePurcDate=null;
			}
			
			var dt = new Date();
			var mo = dt.getMonth();
			var yr = dt.getFullYear();
			if(VechPurcYear == yr && VechPurcMonth > mo){
			sap.m.MessageToast.show("Purchase Date can not greater than current date");
			this.getView().byId("idMonth").setValueState("Error");
			return (false)
			}
			else {
			this.getView().byId("idMonth").setValueState("None")
			}
		
		if(FranhiseContact.length < 10 && FranhiseContact.length != 0){
			sap.m.MessageToast.show("Phone No. can not be less than 10 digits");
			this.getView().byId("idFPNoInput").setValueState("Error");
			return
			}
			else {
			this.getView().byId("idFPNoInput").setValueState("None");
			}
		
		if(NoOfTyres < DefectiveTyres && NoOfTyres != 0){
		this.getView().byId("idTyreInvolve").setValueState("Error");
		sap.m.MessageToast.show("No of Tyres less than Defective tyres", {
		duration: 3000,                  // default
		width: "15em",                   // default
		animationTimingFunction: "ease", // default
		animationDuration: 1000,         // default
		closeOnBrowserNavigation: true   // default
		});
		return
		}
		else {
		this.getView().byId("idTyreInvolve").setValueState("None");
		}

		
		oFinal.CustType       = CustType;
		oFinal.FitType		  = FitType;
		//	oFinal.TicketDate	  = TicketDate
		oFinal.TicketSource	  = TicketSource;
		oFinal.CustomerTelf1  = CustomerTelf1
		oFinal.CustomerTelf2  = CustomerTelf2;
		oFinal.CustomerFname  = CustomerFname
		oFinal.CustomerLname  = CustomerLname
		oFinal.CustomerAddr1  = CustomerAddr1
		oFinal.CustomerAddr2  = CustomerAddr2
		oFinal.CustomerLand1  = CustomerLand1;
		oFinal.CustomerRegion = CustomerRegion;
		oFinal.CustomerCity2  = CustomerCity2 ;
		oFinal.CustomerCity1  = Location;
		oFinal.CustomerEmail  = CustomerEmail;
		oFinal.VehicleType 	  = VehicleType ;
		oFinal.VehicleMake 	  = VehicleMake ;
		oFinal.VehicleModel   = VehicleModel;
		oFinal.VehicleVariant = VehicleVariant;
		oFinal.RegNo 		  = RegNo;
		oFinal.ChassisNo 	  = ChassisNo;
		oFinal.KmsDone 		  = KmsDone;
		oFinal.VechPurcMonth  = VechPurcMonth;
		oFinal.VechPurcYear   = VechPurcYear;
		oFinal.DealerCode  	  = DealerCode;
		oFinal.FranhiseName   = FranhiseName;
		oFinal.FranhiseContact 	= FranhiseContact;
		oFinal.FranhiseEmail  = FranhiseEmail;
		oFinal.FranhisePName  = FranhisePName;
		oFinal.FranhiseLoc 	  = FranhiseLoc;
		oFinal.NoOfTyres   	  = NoOfTyres;
		oFinal.DefectiveTyres = DefectiveTyres;
		oFinal.TyreDesrc   	  = TyreDesrc;
		oFinal.ComplDescr 	  = ComplDescr;
		oFinal.TyreCond 	  = TyreCond;
		oFinal.Remarks 		  = Remarks;
		oFinal.TyrePurcDate  = TyrePurcDate ;
		
		
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
		var oCreateModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel.setHeaders({
		"Content-Type": "application/atom+xml"
		});
		var fncSuccess = function(oData, oResponse) //sucess function
		{
		sap.m.MessageBox.show("Ticket:"+oData.ETicketNo+" Created", {
		title: "Success",
		icon:sap.m.MessageBox.Icon.SUCCESS,
		onClose:function(){
		window.history.back();
		}
		});
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
		debugger
		oCreateModel.create("/ModifyTicketSet", oFinal, {
		success: fncSuccess,
		error: fncError
		});
		},	
		
		/****************************************************Non product() start********************************************************************/
		//var OfficDesg 		= this.getView().byId("IdOff").getValue();
		//var ComplaintReportNo	= this.getView().byId("IdCompRep").getValue();
		
		onNonProductCreate:function(){
		debugger
		var check 				= false;
		var Data = {};
		//var TicketRef 			= this.getView().byId("IDTickRef").getValue();
		var ComplAgainst 		= this.getView().byId("IDCompletAg").getSelectedKey();
		
		var OemDealerName		= this.getView().byId("idChPat").getValue();		
		var PartyName			= this.getView().byId("IdOff").getValue();
		
		var Designation 		= this.getView().byId("IdDesignation").getValue();
		var NonProductLoc		= this.getView().byId("IdLOc").getValue();
		var PartyTelf1			= this.getView().byId("idCont").getValue();
		
		var ComplRelated		= this.getView().byId("IdCompRel").getSelectedKey();	
		var ComplType           = this.getView().byId("IdCompRep").getSelectedKey();
		
		var ComplDescr			= this.getView().byId("IdDesc").getValue();
		var ComplRemarks		= this.getView().byId("IdRemark").getValue();
		
		if(ComplAgainst == "")
		{
		check = true;
		this.getView().byId("IDCompletAg").setValueState("Error");
		}
		else {
		this.getView().byId("IDCompletAg").setValueState("None");
		}
		
		if(ComplAgainst =="01")
			{
			if(OemDealerName == ""){
			check = true;
			this.getView().byId("idChPat").setValueState("Error");
			}
			else {
			this.getView().byId("idChPat").setValueState("None");
			}
			}
		
		else if(ComplAgainst =="02")
			{
			if(PartyName == ""){
				check = true;
				this.getView().byId("IdOff").setValueState("Error");
				}
				else {
				this.getView().byId("IdOff").setValueState("None");
				}
			
				if(Designation == ""){
					this.getView().byId("IdDesignation").setValueState("Error");
				}else{
					this.getView().byId("IdDesignation").setValueState("None");
				}
			}
		
		if(NonProductLoc == ""){
			this.getView().byId("IdLOc").setValueState("Error");
		}else{
			this.getView().byId("IdLOc").setValueState("None");
		}
		
		if(PartyTelf1 == ""){
			this.getView().byId("idCont").setValueState("Error");	
		}
		else if(PartyTelf1.length < 10 && PartyTelf1.length != 0)
		{
			sap.m.MessageToast.show("Contact No. can not be less than 10 digits");
			this.getView().byId("idCont").setValueState("Error");
			return
			}
			else {
			this.getView().byId("idCont").setValueState("None");
			}		
		
		
		if(ComplType == "")
		{
		check = true;
		this.getView().byId("IdCompRep").setValueState("Error");
		}
		else {
		this.getView().byId("IdCompRep").setValueState("None");
		}
		
		if(ComplDescr == ""){
		check = true;
		this.getView().byId("IdDesc").setValueState("Error");
		}
		else {
		this.getView().byId("IdDesc").setValueState("None");
		}
		
		if (check == true){
		sap.m.MessageBox.show("Please fill all Required Fields.", {
		title: "ERROR",
		icon:sap.m.MessageBox.Icon.ERROR,
		});
		return;
		}

		var Data={};
		Data.CustType           = CustType;		
		Data.FitType			= FitType;
		Data.TicketSource 	    = TicketSource;
		Data.CustomerTelf1	    = CustomerTelf1;
		Data.CustomerTelf2	    = CustomerTelf2;
		Data.CustomerFname	    = CustomerFname;
		Data.CustomerLname	    = CustomerLname;
		Data.CustomerEmail	    = CustomerEmail;
		Data.CustomerAddr1	    = CustomerAddr1;
		Data.CustomerAddr2	    = CustomerAddr2;
		Data.CustomerCity1	    = Location;
		Data.CustomerCity2	    = this.District;
		Data.CustomerRegion	    = this.State;
		Data.CustomerLand1	    ='IN';
		
		//Data.TicketRef 			= TicketRef;
		Data.ComplAgainst 		= ComplAgainst;
		
		if(Data.ComplAgainst == "01"){
			Data.ComplAgainstName		= OemDealerName;
		}
		else if(ComplAgainst == "02")
			{
			Data.ComplAgainstDesig  = Designation;
			Data.ComplAgainstName 	= PartyName;
		}
		Data.ComplAgainstCity1  = NonProductLoc;
		Data.ComplAgainstTelf1  = PartyTelf1;
		Data.ComplRelated		= ComplRelated;
		Data.ComplType			= ComplType;
		Data.ComplDescr			= ComplDescr;
		Data.ComplRemarks		= ComplRemarks;
		
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_NON_PROD_COMPLAINT_SRV/";
		var oCreateModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel.setHeaders({
		"Content-Type": "application/atom+xml"
		});
		var fncSuccess = function(oData, oResponse) //sucess function
		{
		if(oData.Error=="X"){
		sap.m.MessageBox.show(oData.Message, {
		title: "Error",
		icon:sap.m.MessageBox.Icon.ERROR,
		onClose:function(){
		}
		});
		}
		else{
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
		
		oCreateModel.create("/NonProductComplaintSet", Data, {
		success: fncSuccess,
		error: fncError
		});
		},
		
		/**********************************************************product enquiry start******************************************************************/
		onPrdEnquiryCreate : function()
		{
			debugger
		var check 			= false;
		var productCategory = this.getView().byId("idVehiclePE").getValue();
		var vehicleModel 	= this.getView().byId("inpModelPE").getValue();
		var vehicleVariant 	= this.getView().byId("inpVariantPE").getValue();
		var monthlyKms 		= this.getView().byId("inpVehicleRunKms").getValue();
		var currentReading 	= this.getView().byId("inpOdoReadingKms").getValue();
		var TyreSize		= this.getView().byId("inpTyreSize").getValue();
		var TyrePattern		= this.getView().byId("idPattren").getValue(); 
		var expPurchDate 	= this.getView().byId("dpExpectedPurchase").getValue();
		if(expPurchDate !="")
		expPurchDate = expPurchDate+"T00:00:00";
		var paymentMode 	= this.getView().byId("selectPaymentMode").getSelectedKey();
		var emiCheck 		= this.getView().byId("selectEmiCheck").getSelectedKey();
		var BankCard 		= this.getView().byId("selectCreditDebit").getSelectedKey();
		if(bankCard !="" && bankCard!=undefined)
		var BankName 		= this.getView().byId("selectCreditDebit").getSelectedKey();
		var EmiReason 		= this.getView().byId("selectResnNonEmi").getSelectedKey();
		var EmiDetails 		= this.getView().byId("inpNonEligibleDetails").getValue();
		//var dealerName 		= this.getView().byId("inpDealerName").getValue();
	//	var dealerStreet 	= this.dealerStreet;
	//	var dealerTlf 		= this.getView().byId("inpMobileNo").getValue();
		var depot 			= this.Depo;
		var depotStreet 	= this.depotStreet;
		var depotName 		= this.getView().byId("inpNetworkDetails").getValue();
		var PersonName 		= this.getView().byId("inpConcernedPerson").getValue();
		var PersonMob		= this.getView().byId("inpMobileNo").getValue();  
		var depotTlf 		= this.getView().byId("inpLandlineNo").getValue();
		var remarks 		= this.getView().byId("txtRemarks").getValue();
		if(productCategory == "")
		{
		check = true;
		this.getView().byId("idVehiclePE").addStyleClass("myStateError");
		}
		else {
		this.getView().byId("idVehiclePE").removeStyleClass("myStateError");
		}
		
		if(vehicleMake == ""){
		check = true;
		this.getView().byId("inpVehicleMakePE").setValueState(sap.ui.core.ValueState.Error);
		}
		else {
		this.getView().byId("inpVehicleMakePE").setValueState(sap.ui.core.ValueState.None);
		}
		
		if(vehicleModel == ""){
		check = true;
		this.getView().byId("inpModelPE").setValueState(sap.ui.core.ValueState.Error);
		}
		else {
		this.getView().byId("inpModelPE").setValueState(sap.ui.core.ValueState.None);
		}
		
		if(vehicleVariant == ""){
		check = true;
		this.getView().byId("inpVariantPE").setValueState(sap.ui.core.ValueState.Error);
		}
		else {
		this.getView().byId("inpVariantPE").setValueState(sap.ui.core.ValueState.None);
		}
		
		if (check == true){
		sap.m.MessageBox.show("Please fill all Required Fields.", {
		title: "ERROR",
		icon:sap.m.MessageBox.Icon.ERROR,
		});
		return;
		}
		// mandatory end
		var Data 			= {};
		Data.CustType       = CustType;
		Data.FitType 		= FitType;
		Data.TicketSource 	= TicketSource;
		Data.CustomerTelf1	= CustomerTelf1;
		Data.CustomerTelf2	= CustomerTelf2;
		Data.CustomerFname	= CustomerFname;
		Data.CustomerLname	= CustomerLname;
		Data.CustomerEmail	= CustomerEmail;
		Data.CustomerAddr1	= CustomerAddr1;
		Data.CustomerAddr2	= CustomerAddr2;
		Data.CustomerCity1	= Location;
		Data.CustomerCity2	= this.District;
		Data.CustomerRegion	= this.State;
		Data.CustomerLand1	='IN';
		Data.VehicleType 	= productCategory;
		Data.VehicleMake 	= vehicleMake;
		Data.VehicleModel 	= vehicleModel;
		Data.VehicleVariant = vehicleVariant;
		Data.TyreSize		= TyreSize;

		Data.TyrePattern 	= TyrePattern;
		Data.MonthlyKms 	= monthlyKms;
		Data.CurrentReading = currentReading;
		if(expPurchDate!="" && expPurchDate!=undefined)
		Data.ExpPurchDate 	= expPurchDate;
		Data.PaymentMode 	= paymentMode;
		Data.EmiCheck 		= emiCheck;
		Data.BankCard 		= bankCard;
	
	//	Data.BankName 		= BankName;
		Data.EmiReason 		= EmiReason;
		Data.EmiDetails 	= EmiDetails;
		Data.DealerCode 	= this.Dealer;
		Data.PersonMob		= PersonMob;
		Data.PersonName		= PersonName;
	//	Data.DealerName 	= dealerName;
		//Data.DealerStreet 	= dealerStreet;
	//	Data.DealerTelf1 	= "+91"+dealerTlf;
		Data.Depot 			= depot;
	//	Data.DepotName 		= depotName;
	//	Data.DepotStreet 	= depotStreet;
	//	Data.DepotTelf1 	= depotTlf;
		Data.Remarks 		= remarks;
		var sServiceUrl 	= "/sap/opu/odata/sap/ZCS_PROD_ENQUIRY_SRV/";
		var oCreateModel1 	= new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
		"Content-Type": "application/atom+xml"
		});
		var fncSuccess 		= function(oData, oResponse) //sucess function
		{
		if(oData.Error=="X"){
		sap.m.MessageBox.show(oData.Message, {
		title: "Error",
		icon:sap.m.MessageBox.Icon.ERROR,
		onClose:function(){
		}
		});
		}
		else{
		sap.m.MessageBox.show(oData.Message, {
		title: "Success",
		icon:sap.m.MessageBox.Icon.SUCCESS,
		onClose:function(){
		window.history.back();
		}
		});
		}
		}
		var fncError 	= function(oError) { //error callback function
		var parser 		= new DOMParser();
		var message		=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
		sap.m.MessageBox.show(message, {
		title: "Error",
		icon:sap.m.MessageBox.Icon.ERROR,
		});
		}
		//Create Method for final Save
		debugger
		oCreateModel1.create("/ProdEnquirySet", Data, {
		success: fncSuccess,
		error: fncError
		});
		},
		/*********************************************************Dealer icontabbar ***********************************/
		
	/*********************************************************Dealer icontabbar ***********************************/
		onchangeDate : function(oEvent){
			debugger
			var date = oEvent.getSource().getDateValue();
			var today=new Date();
			
			today.setHours(00,00,00);
			if(date.getTime()>today.getTime()){
				sap.m.MessageToast.show("Date Cannot Be A Future Date.");
				oEvent.getSource().setDateValue(null);
				return
			}
		},
		
		 payLoadDate: function(SDateValue) 
			{
				var str = "T00:00:00";
				var currentTime = new Date(SDateValue);
				var month = currentTime.getMonth() + 1;
					if(month.toString().length == 1){
						month = "0" + month;										
					}
				var day = currentTime.getDate();
					if(day.toString().length == 1){
						day = "0" + day;										
					}
				var year = currentTime.getFullYear();
				var date = year + "-" + month + "-" + day + str;
				return date;
			},
			
			
		onDealEnquiryCreate : function()
		{
		debugger
		var check = false;
		var Occupation 			= this.getView().byId("selectOprNature").getSelectedKey();
		
		 if( Occupation == "01" ||  Occupation == "03" ||   Occupation == "04"){
			
				var IntrJkTyre 				= this.getView().byId("selectIntDeal").getSelectedKey(); 
				var IntrJkProd 	 			= this.getView().byId("selectIntPrdCat").getSelectedKey();
				var RetailPropertyType 	 	= this.getView().byId("selectRtlPropType").getSelectedKey();
				var RetailDetails 		  	= this.getView().byId("inpRtlSpaceDetails").getValue();
				var InvestmentAmt 		  	= this.getView().byId("inpInvestmentAmt").getValue();
				var InvestmentTimeline 	  	= this.getView().byId("selectInvestTimeline").getSelectedKey();
				var FollowUpDate			= this.payLoadDate(this.getView().byId("inpPrfrdDay").getDateValue());
		 }
		if(Occupation !="" && Occupation!=undefined)
		
	
		var JKTyreDealership 	= this.getView().byId("selectIntDeal").getSelectedKey();
		if(JKTyreDealership !="" && JKTyreDealership!=undefined)
		var JKTyreDealershipdesc = this.getView().byId("selectIntDeal").getSelectedItem().getText();
		var JkProductCategory 	 = this.getView().byId("selectIntPrdCat").getSelectedKey();
		
		if(JkProductCategory !="" && JkProductCategory!=undefined)
		var JkProductCategory 	 = this.getView().byId("selectIntPrdCat").getSelectedItem().getText();
		var RetailPropertyType 	 = this.getView().byId("selectRtlPropType").getSelectedKey();
		
		if(RetailPropertyType !="" && RetailPropertyType!=undefined)
		var RetailPropertyType 	 = this.getView().byId("selectRtlPropType").getSelectedItem().getText();
		var FirmName			 = this.getView().byId("inpFirmName").getValue();
		var BusinessNature 		 = this.getView().byId("selectPrsntBusLine").getSelectedKey();
		
		if(BusinessNature !="" && BusinessNature!=undefined)
		var PanTin 				 = this.getView().byId("selectPanTin").getSelectedKey();
		
		if(PanTin !="" && PanTin!=undefined)
		var BusinessYrs 		 = this.getView().byId("inpNoBusYrs").getValue();
		var BusinessType 		 = this.getView().byId("selectBusType").getSelectedKey();
		
		if(BusinessType !="" && BusinessType!=undefined)
		var ParentCompName		 = this.getView().byId("inpParentComp").getValue();
		var RelatedTyre 		 = this.getView().byId("selectTyreRltd").getSelectedKey();
		
		if(RelatedTyre !="" && RelatedTyre!=undefined)
		var IntrJkTyre 			 = this.getView().byId("selectIntDeal").getSelectedKey();
		
		if(IntrJkTyre !="" && IntrJkTyre!=undefined)
	    var IntrJkProd 			  = this.getView().byId("selectIntPrdCat").getSelectedKey();
		
		if(IntrJkProd !="" && IntrJkProd!=undefined)
		var RetailProperty 		  = this.getView().byId("selectRtlPropType").getSelectedKey();
		
		if(RetailProperty !="" && RetailProperty!=undefined)
		var RetailDetails 		  = this.getView().byId("inpRtlSpaceDetails").getValue();
		var InvestmentAmt 		  = this.getView().byId("inpInvestmentAmt").getValue();
		var InvestmentTimeline 	  = this.getView().byId("selectInvestTimeline").getSelectedKey();
		
		if(InvestmentTimeline !="" && InvestmentTimeline!=undefined)
		var FollowUpDate			=  this.payLoadDate(this.getView().byId("inpPrfrdDay").getDateValue());
		var QuerySource 		    = this.getView().byId("selectQuerySrc").getSelectedKey();
		
		if(QuerySource !="" && QuerySource!=undefined)
		var SourceDetails 			= this.getView().byId("txtSrcDetails").getValue();
		var Remarks 				= this.getView().byId("txtDealershipRemarks").getValue();
		
		if(Occupation == "")
		{
		check = true;
		this.getView().byId("selectOprNature").addStyleClass("myStateError");
		}
		else {
		this.getView().byId("selectOprNature").removeStyleClass("myStateError");
		}
		
		if(JKTyreDealership == "")
		{
		check = true;
		this.getView().byId("selectIntDeal").addStyleClass("myStateError");
		}
		else {
		this.getView().byId("selectIntDeal").removeStyleClass("myStateError");
		}
		
		if(JkProductCategory == "")
		{
		check = true;
		this.getView().byId("selectIntPrdCat").addStyleClass("myStateError");
		}
		else {
		this.getView().byId("selectIntPrdCat").removeStyleClass("myStateError");
		}
		
		if(RetailPropertyType == "")
		{
		check = true;
		this.getView().byId("selectRtlPropType").addStyleClass("myStateError");
		}
		else {
		this.getView().byId("selectRtlPropType").removeStyleClass("myStateError");
		}
		if (check == true){
		sap.m.MessageBox.show("Please fill all Required Fields.", {
		title: "ERROR",
		icon:sap.m.MessageBox.Icon.ERROR,
		});
		return;
		}
		
		var Data={};
			Data.CustType			= CustType;
			Data.FitType			= FitType;
			Data.TicketSource		= TicketSource;
			Data.CustomerTelf1		= CustomerTelf1;
			Data.CustomerTelf2		= CustomerTelf2;
			Data.CustomerFname		= CustomerFname;
			Data.CustomerLname		= CustomerLname;
			Data.CustomerEmail		= CustomerEmail;
			Data.CustomerAddr1		= CustomerAddr1;
			Data.CustomerAddr2		= CustomerAddr2;
			Data.CustomerCity1		= Location;
			Data.CustomerCity2		= this.District;
			Data.CustomerRegion		= this.State;
			Data.CustomerLand1		= 'IN';
			
			Data.Occupation 		= Occupation;
		if(Data.Occupation == "01" || Data.Occupation =="03"  ||Data.Occupation == "04"){
			
			Data.IntrJkTyre 		= IntrJkTyre;
			Data.IntrJkProd 		= IntrJkProd;
			Data.RetailProperty 	= RetailPropertyType;
			Data.RetailDetails 		= RetailDetails;
			Data.InvestmentAmt 		= InvestmentAmt;
			Data.InvestmentTimeline = InvestmentTimeline;
			Data.FollowUpDate 			= FollowUpDate;
		}
			Data.FirmName 			= FirmName;
			Data.BusinessNature 	= BusinessNature;
			Data.PanTin 			= PanTin;
			if(BusinessYrs!="" && BusinessYrs!=undefined)
			Data.Byears 			= BusinessYrs;
			Data.BusinessType 		= BusinessType;
			Data.ParentCompName 	= ParentCompName;
			Data.RelatedTyre 		= RelatedTyre;
			Data.IntrJkTyre 		= IntrJkTyre;
			Data.IntrJkProd 		= IntrJkProd;
			Data.RetailProperty 	= RetailProperty;
			Data.RetailDetails 		= RetailDetails;
			
			if(InvestmentAmt!=""&& InvestmentAmt!=undefined)
			Data.InvestmentAmt 		= InvestmentAmt;
			Data.InvestmentTimeline = InvestmentTimeline;
			Data.FollowUpDate 		= FollowUpDate;
			Data.QuerySource 		= QuerySource;
			Data.SourceDetails 		= SourceDetails;
			Data.Remarks 			= Remarks;
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_DEALER_ENQUIRY_SRV/";
		var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
		"Content-Type": "application/atom+xml"
		});
		var fncSuccess = function(oData, oResponse) //sucess function
		{
		
		if(oData.Error=="X"){
		sap.m.MessageBox.show(oData.Message, {
		title: "Error",
		icon:sap.m.MessageBox.Icon.ERROR,
		onClose:function(){
		}
		});
		}
		else{
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
		debugger
		oCreateModel1.create("/DealerEnquirySet", Data, {
		success: fncSuccess,
		error: fncError
		});
		},
		
		/*****************************************tab -5 general enquiry	**********************************************************************/
		
		onGenEnqCreate : function()
		{
		debugger;
		var check 					= false;
		var CallOutCome 			= this.getView().byId("selectCallOutcome").getSelectedKey();
		var QueryOn 				= this.getView().byId("selectQueryOn").getSelectedKey();
		var QueryStatus 			= this.getView().byId("selectQueryStatus").getSelectedKey();
		var QueryDetails 			= this.getView().byId("txtQueryDescription").getValue();
		var QueryRemarks 			= this.getView().byId("txtGenEnqRemarks").getValue();
		var PartyName  				= this.getView().byId("inpGenEnqDealerDetails").getValue();
		if(QueryOn == "")
		{
		
		check = true;
		this.getView().byId("selectQueryOn").addStyleClass("myStateError");
		}
		else {
		this.getView().byId("selectQueryOn").removeStyleClass("myStateError");
		}
		
		if(QueryStatus == "")
		{
		check = true;
		this.getView().byId("selectQueryStatus").addStyleClass("myStateError");
		}
		else {
		this.getView().byId("selectQueryStatus").removeStyleClass("myStateError");
		}
		
		if(QueryDetails == "")
		{
		check = true;
		this.getView().byId("txtQueryDescription").setValueState(sap.ui.core.ValueState.Error);
		}
		else {
		this.getView().byId("txtQueryDescription").setValueState(sap.ui.core.ValueState.None);
		}
		
		if(QueryRemarks == "")
		{
		check = true;
		this.getView().byId("txtGenEnqRemarks").setValueState(sap.ui.core.ValueState.Error);
		}
		else {
		this.getView().byId("txtGenEnqRemarks").setValueState(sap.ui.core.ValueState.None);
		}
		
		if (check == true){
		sap.m.MessageBox.show("Please fill all Required Fields.", {
		title: "ERROR",
		icon:sap.m.MessageBox.Icon.ERROR,
		});
		return;
		}
		//End mandatory field
		var Data={};
		Data.CustType       		= CustType;
		Data.FitType 				= FitType;
		Data.TicketSource 			= TicketSource;
		Data.CustomerTelf1			= CustomerTelf1;
		Data.CustomerTelf2 			= CustomerTelf2;
		Data.CustomerFname			= CustomerFname;
		Data.CustomerLname			= CustomerLname;
		Data.CustomerEmail			= CustomerEmail;
		Data.CustomerAddr1			= CustomerAddr1;
		Data.CustomerAddr2			= CustomerAddr2;
		Data.CustomerCity1			= Location;
		Data.CustomerCity2 			= this.District;
		Data.CustomerRegion			= this.State;
		Data.CustomerLand1			= 'IN';
		Data.QueryOn 				= QueryOn;
		Data.QueryStatus			= QueryStatus;
		Data.PartyName 				= PartyName;
		Data.QueryDetails 			= QueryDetails;
		Data.QueryRemarks 			= QueryRemarks;
		Data.CallOutcome	 		= CallOutCome;
		
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_GENERAL_QUERY_SRV/";
		var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
		"Content-Type": "application/atom+xml"
		});
		var fncSuccess = function(oData, oResponse) //sucess function
		{
		
		if(oData.Error=="X"){
		sap.m.MessageBox.show(oData.Message, {
		title: "Error",
		icon:sap.m.MessageBox.Icon.ERROR,
		onClose:function(){
		}
		});
		}
		else{
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
		
		debugger
		oCreateModel1.create("/GeneralQuerySet", Data, {
		success: fncSuccess,
		error: fncError
		});
		},
		
		/*******************************************************Warranty tab -6********************************************************************/
		
		onWarrantyCreate : function()
		{
		var check = false;
		var DealerName 		= this.getView().byId("inpWarrantyDealerDetails").getValue().split("-")[0];
		var DealerRegion 	= this.getView().byId("idState1").getValue();
		
		var DealerDistrict	= this.getView().byId("idDistrict1").getValue();
		var VehicleType 	= this.getView().byId("idWrntyVehicleType").getValue();
		var VehicleMake 	= this.getView().byId("inpWarrantyVehicleMake").getValue();
		var Model 			= this.getView().byId("inpWarrantyModel").getValue();
		var VehicleVariant 	= this.getView().byId("idWarrantyVariant").getValue(); 
		var TyreSize		= this.getView().byId("inpWarrantyTyreSize").getValue();
		var TyrePattern		= this.getView().byId("inpWarrantyTyrePatternSize").getValue();
		
		
		var WarrantyTyerSize = this.getView().byId("inpWarrantyTyrePatternSize").getValue();
		var expPurchDate 	= this.getView().byId("dpPurchaseDate").getValue();
		if(expPurchDate !="")
		expPurchDate = expPurchDate+"T00:00:00";
		var TyresNo 		= this.getView().byId("inpNoTyrePurchased").getSelectedKey();
		var TyreSerial1 	= this.getView().byId("inpTyreSerialNo1").getValue();
		var TyreSerial2 	= this.getView().byId("inpTyreSerialNo2").getValue();
		var TyreSerial3 	= this.getView().byId("inpTyreSerialNo3").getValue();
		var TyreSerial4 	= this.getView().byId("inpTyreSerialNo4").getValue();
		var TyreSerial5 	= this.getView().byId("inpTyreSerialNo5").getValue();
		var RegNo 			= this.getView().byId("inpWarrantyRegNo").getValue();
		/*	var ConditionMatched = this.getView().byId("selectConditionsMatched").getSelectedKey();*/
		var Remarks 		= this.getView().byId("txtWarrantyRemarks").getValue();
		debugger
		
		
		if(TyresNo =="1"){
		check = true;
		if(TyreSerial1 == ""){
		this.getView().byId("inpTyreSerialNo1").setValueState(sap.ui.core.ValueState.Error);
		} else {
		this.getView().byId("inpTyreSerialNo1").setValueState(sap.ui.core.ValueState.None);
		}
		} else if(TyresNo =="2"){
		if(TyreSerial1=="" && TyreSerial2==""){
		this.getView().byId("inpTyreSerialNo1").setValueState(sap.ui.core.ValueState.Error);
		this.getView().byId("inpTyreSerialNo2").setValueState(sap.ui.core.ValueState.Error);
		}else {
		this.getView().byId("inpTyreSerialNo1").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo2").setValueState(sap.ui.core.ValueState.None);
		}
		
		}else if(TyresNo =="3"){
		if(TyreSerial1=="" && TyreSerial2=="" && TyreSerial3=="" ){
		this.getView().byId("inpTyreSerialNo1").setValueState(sap.ui.core.ValueState.Error);
		this.getView().byId("inpTyreSerialNo2").setValueState(sap.ui.core.ValueState.Error);
		this.getView().byId("inpTyreSerialNo3").setValueState(sap.ui.core.ValueState.Error);
		}else {
		this.getView().byId("inpTyreSerialNo1").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo2").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo3").setValueState(sap.ui.core.ValueState.None);
		}
		}else if(TyresNo =="4"){
		if(TyreSerial1=="" && TyreSerial2=="" && TyreSerial3=="" && TyreSerial4==""  ){
		this.getView().byId("inpTyreSerialNo1").setValueState(sap.ui.core.ValueState.Error);
		this.getView().byId("inpTyreSerialNo2").setValueState(sap.ui.core.ValueState.Error);
		this.getView().byId("inpTyreSerialNo3").setValueState(sap.ui.core.ValueState.Error);
		this.getView().byId("inpTyreSerialNo4").setValueState(sap.ui.core.ValueState.Error);
		}else {
		this.getView().byId("inpTyreSerialNo1").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo2").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo3").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo4").setValueState(sap.ui.core.ValueState.None);
		}
		}else if(TyresNo =="5"){
		if(TyreSerial1=="" && TyreSerial2=="" && TyreSerial3=="" && TyreSerial4==""  && TyreSerial5=="" ){
		this.getView().byId("inpTyreSerialNo1").setValueState(sap.ui.core.ValueState.Error);
		this.getView().byId("inpTyreSerialNo2").setValueState(sap.ui.core.ValueState.Error);
		this.getView().byId("inpTyreSerialNo3").setValueState(sap.ui.core.ValueState.Error);
		this.getView().byId("inpTyreSerialNo4").setValueState(sap.ui.core.ValueState.Error);
		this.getView().byId("inpTyreSerialNo5").setValueState(sap.ui.core.ValueState.Error);
		}else {
		this.getView().byId("inpTyreSerialNo1").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo2").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo3").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo4").setValueState(sap.ui.core.ValueState.None);
		this.getView().byId("inpTyreSerialNo5").setValueState(sap.ui.core.ValueState.None);
		}
		}
		
		
		if(DealerName  == ""){
		check = true;
		this.getView().byId("inpWarrantyDealerDetails").setValueState(sap.ui.core.ValueState.Error);
		}
		else {
		this.getView().byId("inpWarrantyDealerDetails").setValueState(sap.ui.core.ValueState.None);
		}
		
		if(VehicleType == "")
		{
		check = true;
		this.getView().byId("idWrntyVehicleType").setValueState(sap.ui.core.ValueState.Error);
		}
		else {
		this.getView().byId("idWrntyVehicleType").setValueState(sap.ui.core.ValueState.None);
		}
		
		if(VehicleMake  == ""){
		check = true;
		this.getView().byId("inpWarrantyVehicleMake").setValueState(sap.ui.core.ValueState.Error);
		}
		else {
		this.getView().byId("inpWarrantyVehicleMake").setValueState(sap.ui.core.ValueState.None);
		}
		
		if(Model  == ""){
		check = true;
		this.getView().byId("inpWarrantyModel").setValueState(sap.ui.core.ValueState.Error);
		}
		else {
		this.getView().byId("inpWarrantyModel").setValueState(sap.ui.core.ValueState.None);
		}
		
		/*	if(WarrantyTyerSize  == ""){
		check = true;
		this.getView().byId("inpWarrantyTyrePatternSize").setValueState(sap.ui.core.ValueState.Error);
		}
		else {
		this.getView().byId("inpWarrantyTyrePatternSize").setValueState(sap.ui.core.ValueState.None);
		}
		*/
		if(expPurchDate  == ""){
		check = true;
		this.getView().byId("dpPurchaseDate").setValueState(sap.ui.core.ValueState.Error);
		}
		else {
		this.getView().byId("dpPurchaseDate").setValueState(sap.ui.core.ValueState.None);
		}
		
		if(TyresNo  == ""){
		check = true;
		this.getView().byId("inpNoTyrePurchased").setValueState(sap.ui.core.ValueState.Error);
		sap.m.MessageBox.error("Please select no. of tyres");
		return check;
		}
		else {
		this.getView().byId("inpNoTyrePurchased").setValueState(sap.ui.core.ValueState.None);
		}
		var Data	={};
		debugger
		//Data.ICreate 			= true;
		Data.TicketDate 		= this.DateCheck(new Date());
		Data.CustType			= CustType;
		Data.FitType 			= FitType;
		Data.TicketSource 		= TicketSource;
		
		Data.CustomerTelf1		= CustomerTelf1;
		Data.CustomerTelf2		= CustomerTelf2;
		Data.CustomerFname		= CustomerFname;
		Data.CustomerLname		= CustomerLname;
		Data.CustomerEmail 		= CustomerEmail;
		Data.CustomerAddr1		= CustomerAddr1;
		Data.CustomerAddr2		= CustomerAddr2;
		Data.CustomerCity1		= Location;
		Data.CustomerCity2		=this.District;
		Data.CustomerRegion		=this.State;
		Data.CustomerLand1		='IN';
	//	Data.CustomerPstlz      =CustomerPstlz;
		Data.FitType 			= FitType;
	//  Data.FitTypeDescr	 	= "";
		Data.DealerCode 		= this.Dealer;
		Data.DealerName 		= DealerName;
		Data.DealerStreet 		= this.dealerStreet;
		Data.DealerTelf1 		= this.dealerTelf;
		Data.DealerRegion		= this.State1;
		Data.DealerDistrict		= this.District1;
		Data.VehicleType 		= VehicleType;
		Data.VehicleMake 		= this.VehicleMake;
		Data.VehicleModel	    = this.VehicleModel;
		Data.VehicleVariant     = VehicleVariant;
		/*Data.TyreSize 			= this.TyreSize;
		Data.TyrePattern 		= this.TyrePattern;
		*/
		Data.TyreSize 			= TyreSize;
		Data.TyrePattern 		= TyrePattern;
		if(expPurchDate!="" && expPurchDate!=undefined)
		
		Data.TyrePurcDate		 = expPurchDate;
		Data.NoOfTyres 			 = TyresNo;
		Data.StnclNumber1 		 = TyreSerial1;
		Data.StnclNumber2  		 = TyreSerial2;
		Data.StnclNumber3 		 = TyreSerial3;
		Data.StnclNumber4 		 = TyreSerial4;
		Data.StnclNumber5 		 = TyreSerial5;
		Data.RegNo				 = RegNo;
	//Data.ConditionMatched 	 = ConditionMatched;
	//Data.ConditionMatchedDescr = FitType;
		Data.Remarks			 = Remarks;
		
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_WARRANTY_SRV/";
		var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
		"Content-Type": "application/atom+xml"
		});
		var fncSuccess = function(oData, oResponse) //sucess function
		{
		
		if(oData.Error=="X"){
		sap.m.MessageBox.show(oData.Message, {
		title: "Error",
		icon:sap.m.MessageBox.Icon.ERROR,
		onClose:function(){
		}
		});
		}
		else{
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
		debugger
		oCreateModel1.create("/WarrantyRegistrationSet", Data, {
		success: fncSuccess,
		error: fncError
		});
		},
		
		
		/**************************************************************************************************************************/

		handleChange: function (oEvent) {
			debugger
			var oText = this.byId("textResult");
			var oDTP = oEvent.getSource();
			var sValue = oEvent.getParameter("value");
			var bValid = oEvent.getParameter("valid");
			this._iEvent++;
			oText.setText("Change - Event " + this._iEvent + ": DateTimePicker " + oDTP.getId() + ":" + sValue);

			if (bValid) {
				oDTP.setValueState(sap.ui.core.ValueState.None);
			} else {
				oDTP.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		/**********************************************************************************************************************/
		
		
		onFranch:function(){
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FranchiseCompanyNameSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({
		
		title: "Company Name",
		items: {
		path: "/d/results",
		template: new sap.m.StandardListItem({
		title: "{CompanyName}",
		customData: [new sap.ui.core.CustomData({
		key: "Key",
		value: "{CompanyName}"
		})],
		
		}),
		},
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("CompanyName",sap.ui.model.FilterOperator.Contains,sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handlefranchClose, this],
		cancel: [this._handlefranchClose, this]
		});
		_valueHelpFranchSelectDialog.setModel(jModel);
		_valueHelpFranchSelectDialog.open();
		},
		_handlefranchClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		this.getView().byId("idFCNameInput").setValue(oSelectedItem.getTitle());
		}
		},
		/**********************Tyre Pattern/Size Method**********************************************************/
		onTyreSizeHelp : function()
		{
		debugger
		var selectedTab= this.selectedTabKey;
		if(selectedTab == "warranty"){
			var vehType = this.getView().byId("idWrntyVehicleType").getValue();
			var vehMake = this.getView().byId("inpWarrantyVehicleMake").getValue();
			var vehModel = this.getView().byId("inpWarrantyModel").getValue();
			var variant =  this.getView().byId("idWarrantyVariant").getValue();
			var sPath = "/sap/opu/odata/sap/ZCS_PROD_ENQUIRY_SRV/VehiclePatternSizeSet?$filter=Type eq '"+vehType+"'and Make eq '"+vehMake+"' and Model eq '"+vehModel+"' and Variant eq '"+variant+"'";
		}
		else{
		var vehicleType = this.getView().byId("idVehiclePE").getValue();
		var vehicleMake = this.getView().byId("inpVehicleMakePE").getValue();
		var vehicleModel = this.getView().byId("inpModelPE").getValue();
		var variant = this.getView().byId("inpVariantPE").getValue();
		var sPath = "/sap/opu/odata/sap/ZCS_PROD_ENQUIRY_SRV/VehiclePatternSizeSet?$filter=Type eq '"+vehicleType+"'and Make eq '"+vehicleMake+"' and Model eq '"+vehicleModel+"' and Variant eq '"+variant+"'";
			}
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		
		var _valueHelpPatternSelectDialog = new sap.m.SelectDialog({
			title : "Tyre Size",
			items : {
				path : "/d/results",
				template : new sap.m.StandardListItem({
					title : "{Size}",
					customData : [ new sap.ui.core.CustomData({
						key : "{Size}",
						value : "{Pattern}"
					})],
				}),
			},
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("Size", sap.ui.model.FilterOperator.Contains, sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleTyrePatternClose, this],
		cancel: [this._handleTyrePatternClose, this]
		});
		_valueHelpPatternSelectDialog.setModel(jModel);
		_valueHelpPatternSelectDialog.open();
		},
		_handleTyrePatternClose:function(oEvent)
		{
		debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		this.TyrePattern = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		this.TyreSize = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
		var selectedTab= this.selectedTabKey;
		if(selectedTab == "warranty")
		this.getView().byId("inpWarrantyTyreSize").setValue(oSelectedItem.getTitle());
		else
			this.getView().byId("inpTyreSize").setValue(oSelectedItem.getTitle());
			this.getView().byId("idPattren").setEnabled(true).setValue();
		}
		},
		
		onPatternHelp: function(){
			debugger
			var selectedTab= this.selectedTabKey;
			var vehicleType = this.getView().byId("idVehiclePE").getValue();
			var vehicleMake = this.getView().byId("inpVehicleMakePE").getValue();
			var vehicleModel = this.getView().byId("inpModelPE").getValue();
			var variant = this.getView().byId("inpVariantPE").getValue();
			var Size  = this.getView().byId("idPattren").getValue();
			var sPath = "/sap/opu/odata/sap/ZCS_PROD_ENQUIRY_SRV/VehiclePatternSet?$filter=Type eq '"+vehicleType+"'and Make eq '"+vehicleMake+"' and Model eq '"+vehicleModel+"' and Variant eq '"+variant+"' and Size eq '"+Size+"'";
			  var jModel = new sap.ui.model.json.JSONModel();
		      jModel.loadData(sPath, null, false,"GET",false, false, null);
		      var _valueHelpPatternSelectDialog = new sap.m.SelectDialog({
					title : "Pattern",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem({
							title : "{Pattern}",
							customData : [ new sap.ui.core.CustomData({
								key : "{Pattern}",
								value : "{Pattern}"
							})],
						}),
					},
			liveChange : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Pattern", sap.ui.model.FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
				confirm : [ this._handlePatternClose, this ],
				cancel : [ this._handlePatternClose, this ]
			});
		  _valueHelpPatternSelectDialog.setModel(jModel);
		  _valueHelpPatternSelectDialog.open();
		},	
		_handlePatternClose:function(oEvent)
			{
			debugger
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
			this.TyrePattern = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			this.TyreSize = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
			var selectedTab= this.selectedTabKey;
			this.getView().byId("idPattren").setValue(oSelectedItem.getTitle());
			}
		},
		/*************************Tyre Pattern / Size Ends ***************************************************/
		onPatternHelp1 : function(){
			var selectedTab= this.selectedTabKey;
			var vehicleType = this.getView().byId("idWrntyVehicleType").getValue();
			var vehicleMake = this.getView().byId("inpWarrantyVehicleMake").getValue();
			var vehicleModel = this.getView().byId("inpWarrantyModel").getValue();
			var variant ="";
			var Size  = this.getView().byId("inpWarrantyTyreSize").getValue();
			var sPath = "/sap/opu/odata/sap/ZCS_PROD_ENQUIRY_SRV/VehiclePatternSet?$filter=Type eq '"+vehicleType+"'and Make eq '"+vehicleMake+"' and Model eq '"+vehicleModel+"' and Variant eq '"+variant+"' and Size eq '"+Size+"'";
			  var jModel = new sap.ui.model.json.JSONModel();
		      jModel.loadData(sPath, null, false,"GET",false, false, null);
		      var _valueHelpPatternSelectDialog = new sap.m.SelectDialog({
					title : "Pattern",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem({
							title : "{Pattern}",
							customData : [ new sap.ui.core.CustomData({
								key : "{Pattern}",
								value : "{Pattern}"
							})],
						}),
					},
			liveChange : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Pattern", sap.ui.model.FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
				confirm : [ this._handlePatternClose, this ],
				cancel : [ this._handlePatternClose, this ]
			});
		  _valueHelpPatternSelectDialog.setModel(jModel);
		  _valueHelpPatternSelectDialog.open();
		},	
		_handlePatternClose:function(oEvent)
			{
			debugger
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
			this.TyrePattern = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			this.TyreSize = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
			var selectedTab= this.selectedTabKey;
			this.getView().byId("inpWarrantyTyrePatternSize").setValue(oSelectedItem.getTitle());
			}
		},
		
/**************************************This Fitment Type Used In Warranty IconTabBar & Its Visivle = false in View*****************************************************/		
		onFitmentType:function(){
		//Method for setting the model for Fitment Type
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FitmentTypeSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var  loc= this.getView().byId("idFitment");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		loc.bindAggregation("items", {
		path : "/d/results",
		template : new sap.ui.core.Item({
		key : "{Type}",
		text : "{Description}"
		})
		});
		},
/*********************************************************/	
		onTicketSource:function(){
		//Method for setting the model for ticket source
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TicketSourceSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var  loc= this.getView().byId("idTicketSource");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		loc.bindAggregation("items", {
		path : "/d/results",
		template : new sap.ui.core.Item({
		key : "{Code}",
		text : "{Text}"
		})
		});
		},
/*********************************************************/	
		
		
		onCustSelect:function(evt){
		var key=evt.getSource().getSelectedKey();
		//this.onTyreFitMent(key);
		if(key=="03" ||key=="06"){
		
		this.getView().byId("Panel1").setVisible(false);
		this.getView().byId("Panel2").setVisible(true);
		this.getView().byId("Panel3").setVisible(false);
		}else if(key=="02"||key=="04"){
		this.getView().byId("Panel1").setVisible(true);
		this.getView().byId("Panel2").setVisible(false);
		this.getView().byId("Panel3").setVisible(false);
		}else if(key=="01"){
		this.getView().byId("Panel1").setVisible(false);
		this.getView().byId("Panel2").setVisible(false);
		this.getView().byId("Panel3").setVisible(false);
		}else {
		this.getView().byId("Panel1").setVisible(false);
		this.getView().byId("Panel2").setVisible(false);
		this.getView().byId("Panel3").setVisible(true);
		}
		
		},
		/*********************************************************/
		onRepoChange:function(evt){
			debugger
		var key=evt.getSource().getSelectedKey();
		if(key=="01"){
		this.getView().byId("idChPat").setVisible(true).setValue();
		this.getView().byId("IdDesignation").setVisible(false);
		this.getView().byId("idDesignationlbl").setVisible(false);
		this.getView().byId("idChPatLbl").setVisible(true);
		this.getView().byId("IdOffLbl").setVisible(false);
		this.getView().byId("IdOff").setVisible(false).setValue();
		this.getView().byId("IdLOcLbl").setVisible(true);
		this.getView().byId("IdLOc").setVisible(true).setValue();
		this.getView().byId("idContlbl").setVisible(true);
		this.getView().byId("idCont").setVisible(true).setValue();
		}else{
		this.getView().byId("idChPat").setVisible(false).setValue();
		this.getView().byId("IdDesignation").setVisible(true);
		this.getView().byId("idDesignationlbl").setVisible(true);
		this.getView().byId("idChPatLbl").setVisible(false);
		this.getView().byId("IdOffLbl").setVisible(true);
		this.getView().byId("IdOff").setVisible(true).setValue();
		this.getView().byId("IdLOcLbl").setVisible(true);
		this.getView().byId("IdLOc").setVisible(true).setValue();
		this.getView().byId("idContlbl").setVisible(true);
		this.getView().byId("idCont").setVisible(true).setValue();
		}
		},
		/*********************************************************/
		onTypeofCustomer: function(key) {
		
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TypeOfCustomerSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("idCustomer");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{Type}",
		text: "{Description}"
		})
		});
		},
		
		onOprNatureDropDown: function(key) {
		debugger
		var sPath = "/sap/opu/odata/sap/ZCS_DEALER_ENQUIRY_SRV/OccupationNatureSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectOprNature");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{Occupation}",
		text: "{OccupationDescr}"
		})
		});
		},
		onLineOfBusDropDown: function(key) {
		debugger
		var sPath = "/sap/opu/odata/sap/ZCS_DEALER_ENQUIRY_SRV/BusinessNatureSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectPrsntBusLine");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{Business}",
		text: "{BusinessDescr}"
		})
		});
		},
		/*********************************************************/
		futDate : function(oEvent)
		{
			debugger
				var date = oEvent.getSource().getDateValue();
				var today = new Date();
				
				if(date > today){
					sap.m.MessageToast.show("Expected Date of Purchase Cannot Be A Future Date.");
					oEvent.getSource().setValueState("Error").setDateValue(null);
					return
				}
				else
					oEvent.getSource().setValueState("None");
				},
		/*********************************************************/
		onTyreDealershipDropDown: function(key) {
		
		var sPath = "/sap/opu/odata/sap/ZCS_DEALER_ENQUIRY_SRV/JKTyreDealershipSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectIntDeal");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{JKDealership}",
		text: "{JKDealershipDescr}"
		})
		});
		},
		/*********************************************************/
		onPanTinDropDown: function(key) {
		
		var sPath = "/sap/opu/odata/sap/ZCS_DEALER_ENQUIRY_SRV/PanTinSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectPanTin");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{PanNTin}",
		text: "{PanNTinDescr}"
		})
		});
		},
		/*********************************************************/
		onInvestTimelineDropDown: function(key) {
		
		var sPath = "/sap/opu/odata/sap/ZCS_DEALER_ENQUIRY_SRV/TimlineForInvestmentSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectInvestTimeline");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{InvestmentTimeline}",
		text: "{InvestmentTimelineDescr}"
		})
		});
		},
		/*********************************************************/
		onQuerySourceDropDown: function(key) {
		
		var sPath = "/sap/opu/odata/sap/ZCS_DEALER_ENQUIRY_SRV/SourceOfQuerySet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectQuerySrc");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{QuerySource}",
		text: "{QuerySourceDescr}"
		})
		});
		},
		/*********************************************************/
		onRetailPropertyTypeDropDown: function(key) {
		
		var sPath = "/sap/opu/odata/sap/ZCS_DEALER_ENQUIRY_SRV/RetailPropertyTypeSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectRtlPropType");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{RetailProperty}",
		text: "{RetailPropertyDescr}"
		})
		});
		},
		/*********************************************************/
		onTyreRelatedDropDown: function(key) {
		
		var sPath = "/sap/opu/odata/sap/ZCS_DEALER_ENQUIRY_SRV/RelatedToTyreSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectTyreRltd");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{RelatedTyre}",
		text: "{RelatedTyreDescr}"
		})
		});
		},
		/*********************************************************/
		onTypeofBusiness: function(key) {
		
		var sPath = "/sap/opu/odata/sap/ZCS_DEALER_ENQUIRY_SRV/BusinessTypeSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectBusType");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{BusinessTyp}",
		text: "{BusinessTypDescr}"
		})
		});
		},
		/*********************************************************/
		onJKPrdCatDropDown: function(key) {
		
		var sPath = "/sap/opu/odata/sap/ZCS_DEALER_ENQUIRY_SRV/JKProductCategorySet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectIntPrdCat");
		
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{JKProdCat}",
		text: "{JKProdCatDescr}"
		})
		});
		
		},
		/*********************************************************/
		onOprNatureChange:function(oEvent)
		{
		var key = this.getView().byId("selectOprNature").getSelectedKey();
		if(key == "02")
		{
		this.getView().byId("lblFirmName").setVisible(true);
		this.getView().byId("inpFirmName").setVisible(true);
		this.getView().byId("lblPrsntBusLine").setVisible(true);
		this.getView().byId("selectPrsntBusLine").setVisible(true);
		this.getView().byId("lblPanTin").setVisible(true);
		this.getView().byId("selectPanTin").setVisible(true);
		this.getView().byId("lblNoBusYrs").setVisible(true);
		this.getView().byId("inpNoBusYrs").setVisible(true);
		this.getView().byId("lblParentComp").setVisible(true);
		this.getView().byId("inpParentComp").setVisible(true);
		this.getView().byId("lblTyreRltd").setVisible(true);
		this.getView().byId("selectTyreRltd").setVisible(true);
		this.getView().byId("lblBusType").setVisible(true);
		this.getView().byId("selectBusType").setVisible(true);
		}
		else
		{
		this.getView().byId("lblFirmName").setVisible(false);
		this.getView().byId("inpFirmName").setVisible(false);
		this.getView().byId("lblPrsntBusLine").setVisible(false);
		this.getView().byId("selectPrsntBusLine").setVisible(false);
		this.getView().byId("lblPanTin").setVisible(false);
		this.getView().byId("selectPanTin").setVisible(false);
		this.getView().byId("lblNoBusYrs").setVisible(false);
		this.getView().byId("inpNoBusYrs").setVisible(false);
		this.getView().byId("lblBusType").setVisible(false);
		this.getView().byId("selectBusType").setVisible(false);
		this.getView().byId("lblParentComp").setVisible(false);
		this.getView().byId("inpParentComp").setVisible(false);
		this.getView().byId("lblTyreRltd").setVisible(false);
		this.getView().byId("selectTyreRltd").setVisible(false);
		}
		},
		/*********************************************************/
		onBusLineChange:function(oEvent)
		{
		var key = this.getView().byId("selectPrsntBusLine").getSelectedKey();
		if(key == "01")
		{
		this.getView().byId("lblBusType").setVisible(true);
		this.getView().byId("selectBusType").setVisible(true);
		this.getView().byId("lblParentComp").setVisible(true);
		this.getView().byId("inpParentComp").setVisible(true);
		this.getView().byId("lblTyreRltd").setVisible(true);
		this.getView().byId("selectTyreRltd").setVisible(true);
		
		}
		else
		{
		this.getView().byId("lblBusType").setVisible(false);
		this.getView().byId("selectBusType").setVisible(false);
		this.getView().byId("lblParentComp").setVisible(false);
		this.getView().byId("inpParentComp").setVisible(false);
		this.getView().byId("lblTyreRltd").setVisible(false);
		this.getView().byId("selectTyreRltd").setVisible(false);
		}
		},
		onPaymentMode: function() {
		
		var sPath = "/sap/opu/odata/sap/ZCS_PROD_ENQUIRY_SRV/DropDownPaymentModeSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectPaymentMode");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{PaymentMode}",
		text: "{PaymentModeDescr}"
		})
		});
		},
		onPaymentModeChange:function(oEvent)
		{
		var key = this.getView().byId("selectPaymentMode").getSelectedKey();
		if(key == "02")
		{
		this.getView().byId("lblEmiEligibility").setVisible(true);
		this.getView().byId("lblCreditDebit").setVisible(true);
		this.getView().byId("lblResnNonEmi").setVisible(true);
		this.getView().byId("selectEmiCheck").setVisible(true);
		this.getView().byId("selectCreditDebit").setVisible(true);
		this.getView().byId("selectResnNonEmi").setVisible(true);
		this.getView().byId("lblNeDetails").setVisible(true);
		this.getView().byId("inpNonEligibleDetails").setVisible(true);
		}
		else
		{
		this.getView().byId("lblEmiEligibility").setVisible(false);
		this.getView().byId("lblCreditDebit").setVisible(false);
		this.getView().byId("lblResnNonEmi").setVisible(false);
		this.getView().byId("selectEmiCheck").setVisible(false);
		this.getView().byId("selectCreditDebit").setVisible(false);
		this.getView().byId("selectResnNonEmi").setVisible(false);
		this.getView().byId("lblNeDetails").setVisible(false);
		this.getView().byId("inpNonEligibleDetails").setVisible(false);
		}
		},
		onEmiCheck: function() {
		
		var sPath = "/sap/opu/odata/sap/ZCS_PROD_ENQUIRY_SRV/DropDownEMICheckSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectEmiCheck");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{EMICheck}",
		text: "{EMICheckDescr}"
		})
		});
		},
		onBankDropDown: function() {
		
		var sPath = "/sap/opu/odata/sap/ZCS_PROD_ENQUIRY_SRV/DropDownBankSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectCreditDebit");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{BankCode}",
		text: "{BankName}"
		})
		});
		},
		onNonElgResnDropDown: function() {
		
		var sPath = "/sap/opu/odata/sap/ZCS_PROD_ENQUIRY_SRV/DropDownNonElgReasonSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectResnNonEmi");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{NonElgReason}",
		text: "{NonElgReasonDescr}"
		})
		});
		},
		
		/*Tyre size/pattern f4 starts (bhushan)*/
		
		
		
		
		onComplaintAg: function(key) {
		debugger
		var sPath = "/sap/opu/odata/sap/ZCS_NON_PROD_COMPLAINT_SRV/DropDownComplAgainstSet";
		
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("IDCompletAg");
		
		//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{ComplaintAgainst}",
		text: "{ComplaintAgainstDescr}"
		})
		});
		
		},
		
		/********************************* change sumit add a f4 complaint related ***************************************************************/
	/*	OncomplaintRelated:function(){
		debugger
		var sPath = "/sap/opu/odata/sap/ZCS_NON_PROD_COMPLAINT_SRV/DropDownComplTypeSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var _valueHelpComplaintSelectDialog = new sap.m.SelectDialog({
		title : "Complaint Report No",
		items : {
		path : "/d/results",
		template : new sap.m.StandardListItem({
		title : "{ComplaintTypeDescr}",
		//description: "{ComplaintTypeDescr}",
		customData : [ new sap.ui.core.CustomData({
		key : "{ComplaintType}",
		value : "{ComplaintTypeDescr}"
		})],
		}),
		},
		
		liveChange : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("ComplaintType",sap.ui.model.FilterOperator.Contains,sValue);
		var oFilter1 = new sap.ui.model.Filter("ComplaintTypeDescr",sap.ui.model.FilterOperator.Contains,sValue);
		var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
		oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
		},
		confirm : [ this._handleComplaintRelatedClose, this ],
		cancel : [ this._handleComplaintRelatedClose, this ]
		});
		_valueHelpComplaintSelectDialog.setModel(jModel);
		_valueHelpComplaintSelectDialog.open();
		},
		_handleComplaintRelatedClose : function(oEvent) {
			debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		var obj = oSelectedItem.getBindingContext().getObject();
		if (oSelectedItem) {
		//	this.getView().byId("IdCompRep").setValue(oSelectedItem.getTitle());
		ComplaintReportNo	 = obj.ComplaintType;
		this.getView().byId("IdCompRep").setValue(obj.ComplaintTypeDescr);
		}
		},*/
		
		
		/*	onComplaintRep: function(key) {
		var sPath = "/sap/opu/odata/sap/ZCS_NON_PROD_COMPLAINT_SRV/DropDownComplTypeSet";
		
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("IdCompRep");
		
		//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{ComplaintType}",
		text: "{ComplaintTypeDescr}"
		})
		});
		
		},
		*/
		
		
		
		
		
		onCallOutcome: function(key) {
		var sPath = "/sap/opu/odata/sap/ZCS_GENERAL_QUERY_SRV/DropDownCallOutcomeSet";
		
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectCallOutcome");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{CallOutcome}",
		text: "{CallOutcomeDescr}"
		})
		});
		
		},
		onQueryOn: function(key) {
		var sPath = "/sap/opu/odata/sap/ZCS_GENERAL_QUERY_SRV/DropDownQueryOnSet";
		
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectQueryOn");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{QueryOn}",
		text: "{QueryOnDescr}"
		})
		});
		
		},
		onQueryStatus: function(key) {
		var sPath = "/sap/opu/odata/sap/ZCS_GENERAL_QUERY_SRV/DropDownQueryStatusSet";
		
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectQueryStatus");
		
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{QueryStatus}",
		text: "{QueryStatusDescr}"
		})
		});
		
		},
		
		onComplaintRel: function(key) {
		var sPath = "/sap/opu/odata/sap/ZCS_NON_PROD_COMPLAINT_SRV/DropDownComplRelatedSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("IdCompRel");
		//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{ComplaintRelated}",
		text: "{ComplaintRelatedDescr}"
		})
		});
		
		},
		
		onComplaintType: function(key) {
			var sPath = "/sap/opu/odata/sap/ZCS_NON_PROD_COMPLAINT_SRV/DropDownComplTypeSet";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false, false, null);
			var loc = this.getView().byId("IdCompRep");
			loc.setModel(jModel);
			loc.unbindAggregation("items");
			loc.bindAggregation("items", {
			path: "/d/results",
			template: new sap.ui.core.Item({
			key: "{ComplaintType}",
			text: "{ComplaintTypeDescr}"
			})
			});
			
			},		
		
		
		/*onConditionMatchDropDown: function(key) {
		var sPath = "/sap/opu/odata/sap/ZCS_WARRANTY_SRV/ConditionsMatchedSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectConditionsMatched");
		//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
		loc.setModel(jModel);
		loc.unbindAggregation("items");
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{ConditionMatched}",
		text: "{ConditionMatchedDescr}"
		})
		});
		},*/
		
		onDepoHelp : function()
		{
		var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimRecvDepoSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpSelectDialog = new sap.m.SelectDialog({
		
		title: "Depot",
		items: {
		path: "/d/results",
		template: new sap.m.StandardListItem({
		title: "{Name1} - {Werks}",
		customData: [new sap.ui.core.CustomData({
		key: "{Werks}",
		value: "{Name1}"
		})]
		
		})
		},
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleDepoClose, this],
		cancel: [this._handleDepoClose, this]
		});
		_valueHelpSelectDialog.setModel(jModel);
		_valueHelpSelectDialog.open();
		},
		_handleDepoClose:function(oEvent)
		{
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		this.Depo = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
		this.getView().byId("inpNetworkDetails").setValue(oSelectedItem.getTitle());
		var sPath = "/sap/opu/odata/sap/ZCS_PROD_ENQUIRY_SRV/GetDepotDetailsSet(Werks='"+this.Depo+"')";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var data = jModel.getData();
		this.getView().byId("inpOfficeAddress").setValue(data.d.Name1);
		this.getView().byId("inpOfficeAddress").setValue(data.d.City1+" , "+data.d.City2+" , "+data.d.PostCode);
		this.getView().byId("inpOfficeAddress").setEnabled(false);
		this.getView().byId("inpLandlineNo").setEnabled(false);
		this.getView().byId("inpLandlineNo").setValue(data.d.TelNumber);
		this.depotStreet = data.d.Street;
		}
		},
		
		onchangepurdt:function(){
		debugger
		var p = this.getView().byId("idDtTyreInput");
		var temp = p.getDateValue();
		var tdate = new Date();
		var tdt1 = tdate.setHours(0,0,0,0);
		var tdt2 = temp.setHours(0,0,0,0);
		if (tdt2 > tdt1){
		sap.m.MessageToast.show("Purcahse Date can not be greater than current date");
		p.setValue("");
		this.getView().byId("idDtTyreInput").setValueState(sap.ui.core.ValueState.Error);
		return
		}
		else {
		this.getView().byId("idDtTyreInput").setValueState(sap.ui.core.ValueState.None);
		}
		},
		
		onFitmentChange: function(oEvent) {
		var key = oEvent.mParameters.selectedItem.getKey();
		if ((key === "REP" || key === "STU" || key === "DEF")) {
		
		this.getView().byId("idVboxRep").setVisible(true);
		this.getView().byId("idVboxOem").setVisible(false);
		
		} else {
		this.getView().byId("idVboxRep").setVisible(false);
		this.getView().byId("idVboxOem").setVisible(true);
		
		}
		debugger
		if(key != "REP")
		{
		this.getView().byId("lblVehicleMake").setRequired(true);
		this.getView().byId("idvehicleLabel").setRequired(true);
		this.getView().byId("lblVehModel").setRequired(true);
		this.getView().byId("lblVehVariant").setRequired(true);
		this.getView().byId("lblVehKmsDone").setRequired(true);
		this.getView().byId("idpurchaseLabell").setRequired(false);
		}
		if(key == "REP")
		{
		this.getView().byId("lblVehicleMake").setRequired(false);
		this.getView().byId("idvehicleLabel").setRequired(false);
		this.getView().byId("lblVehModel").setRequired(false);
		this.getView().byId("lblVehVariant").setRequired(false);
		this.getView().byId("lblVehKmsDone").setRequired(false);
		this.getView().byId("idpurchaseLabell").setRequired(false);
		}
		if(key == "OEM"){
			this.getView().byId("idpurchaseLabell").setRequired(true);
		}
		},
		
		
		
		onWarrantyTyreFitMent: function() {
		
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FitmentTypeSet";
		
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("selectTyreFitmentType")
		var loc1 = this.getView().byId("idFitment");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{Type}",
		text: "{Description}"
		})
		});
		loc.setSelectedKey();
		// 								loc1.unbindAggregation("items");
		// 								loc1.setModel(jModel);
		
		// 										loc1.bindAggregation("items", {
		// 											path: "/d/results",
		// 											template: new sap.ui.core.Item({
		// 												key: "{Type}",
		// 												text: "{Description}"
		// 											})
		// 										});
		// 										loc1.setSelectedKey();
		},
		onTyreFitMent: function(key) {
		
		//Method for setting the model for vehicle type
		if(key==undefined){
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FitmentTypeSet";
		}else{
		var sPath ="/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpFitmentTypeSet?$filter=IClaimTyp eq '"+this.ClaimType+"' and ICustType eq '"+key+"'"
		}
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("idFitment");
		//						var locWarranty = this.getView().byId("selectTyreFitmentType")
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		
		loc.bindAggregation("items", {
		path: "/d/results",
		template: new sap.ui.core.Item({
		key: "{FitType}",
		text: "{FitTypeDesc}"
		})
		});
		loc.setSelectedKey();
		//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
		},
		
		/***********************************f4 State help ****************************************/
		onStateHelp: function() {
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpSelectDialog = new sap.m.SelectDialog({
		
		title: "State",
		items: {
		path: "/d/results",
		template: new sap.m.StandardListItem({
		title: "{Region}",
		customData: [new sap.ui.core.CustomData({
		key: "Key",
		value: "{RegionCode}"
		})]
		
		})
		},
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.Contains, sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleClose, this],
		cancel: [this._handleClose, this]
		});
		_valueHelpSelectDialog.setModel(jModel);
		_valueHelpSelectDialog.open();
		},
		
		_handleClose: function(oEvent) {
			debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		//this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
		this.State  = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		
		this.getView().byId("idState").setValue(oSelectedItem.getTitle());
		if(this.State1=="" || this.State1==undefined){
			this.getView().byId("idState1").setValue(oSelectedItem.getTitle());
			this.State1 = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();			
		}
		
		this.getView().byId("idDistrict").setValue();
		this.getView().byId("idDistrict").setEnabled(true);
		}
	
			
		},
		
		/***********************************f4 District help ****************************************/
		onDistrictHelp: function() {
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '" + this.State + "'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpDistrictDialog = new sap.m.SelectDialog({
		
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
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("District", sap.ui.model.FilterOperator.Contains, sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleDistrictClose, this],
		cancel: [this._handleDistrictClose, this]
		});
		_valueHelpDistrictDialog.setModel(jModel);
		_valueHelpDistrictDialog.open();
		},
		
		_handleDistrictClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		//this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
		this.District = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		if(this.State1=="" || this.State1==undefined){
		this.District1 = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		this.getView().byId("idDistrict1").setValue(oSelectedItem.getTitle());
		}
		this.getView().byId("idDistrict").setValue(oSelectedItem.getTitle());
		
		}
		
		},
		
		/***********************************f4 State help ****************************************/
		//http://jkwgdev.jkti.com:8000/sap/opu/odata/sap/ZCS_WARRANTY_SRV/SearchDealerStateDistrictSet?$filter=State eq'DL' and District eq'ALIPUR'
		onDealerHelp : function()
		{
		debugger
		var selectedTab= this.selectedTabKey;
		if(selectedTab =="prdEnquiry"){
		var sPath = "/sap/opu/odata/sap/ZCS_WARRANTY_SRV/SearchDealerStateDistrictSet?$filter= State eq '"+this.State+"' and District eq'"+this.District+"'";
		}else if(selectedTab == "warranty"){
		var sPath = "/sap/opu/odata/sap/ZCS_WARRANTY_SRV/SearchDealerStateDistrictSet?$filter= State eq '"+this.State1+"' and District eq'"+this.District1+"'";
		}
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _DealervalueHelpSelectDialog = new sap.m.SelectDialog({
		//title: "Dealer",
		title:"DealerLoc",
		items: {
		path: "/d/results",
		template: new sap.m.StandardListItem({
		title: "{name1} - {kunnr}",
		customData: [new sap.ui.core.CustomData({
		key: "{kunnr}",
		value: "{name1}"
		})]
		
		})
		},
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleDealerloctionClose, this],
		cancel: [this._handleDealerloctionClose, this]
		});
		_DealervalueHelpSelectDialog.setModel(jModel);
		_DealervalueHelpSelectDialog.open();
		},
		_handleDealerloctionClose:function(oEvent)
		{
		debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		this.Dealer = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
		var sPath = "/sap/opu/odata/sap/ZCS_PROD_ENQUIRY_SRV/GetDealerDetailsSet(Kunnr='"+this.Dealer+"')";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var data = jModel.getData();
		var selectedTab= this.selectedTabKey;
		if(selectedTab == "warranty")
		{
		this.getView().byId("inpWarrantyDealerDetails").setValue(oSelectedItem.getTitle());
		this.getView().byId("inpSapDealerCode").setValue(data.d.Kunnr);
		this.getView().byId("inpDealerLocContNo").setValue(data.d.City1+" , "+data.d.City2+" , "+data.d.PostCode+"-"+data.d.TelNumber);
		this.getView().byId("inpSapDealerCode").setEnabled(false);
		this.getView().byId("inpDealerLocContNo").setEnabled(false);
		}
		else if(selectedTab == "genEnquiry")
		{
		this.getView().byId("inpGenEnqDealerDetails").setValue(oSelectedItem.getTitle());
		}
		else if(selectedTab == "Product")
		{
		this.Dealer = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		this.getView().byId("idDealCodeInput").setValue(oSelectedItem.getDescription());
		this.getView().byId("idDealDescInput").setValue(oSelectedItem.getTitle());
		}
		else
		{
		this.getView().byId("inpDealerDetails").setValue(oSelectedItem.getTitle());
		this.getView().byId("inpDealerName").setValue(data.d.Name1);
		this.getView().byId("inpDealerAddress").setValue(data.d.City1+" , "+data.d.City2+" , "+data.d.PostCode);
		this.getView().byId("inpDealerName").setEnabled(false);
		this.getView().byId("inpDealerAddress").setEnabled(false);
		this.getView().byId("inpMobileNo").setEnabled(true);// change sumit monday 100719
		this.getView().byId("inpMobileNo").setValue(data.d.TelNumber);
		}
		/*this.dealerTelf = data.d.TelNumber;
		this.dealerStreet = data.d.Street;*/
		}
		},
		
		
		onStateHelp1: function() {
		debugger
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpSelectDialog1 = new sap.m.SelectDialog({
		
		title: "State",
		items: {
		path: "/d/results",
		template: new sap.m.StandardListItem({
		title: "{Region}",
		customData: [new sap.ui.core.CustomData({
		key: "Key",
		value: "{RegionCode}"
		})]
		
		})
		},
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.Contains, sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleClose1, this],
		cancel: [this._handleClose1, this]
		});
		_valueHelpSelectDialog1.setModel(jModel);
		_valueHelpSelectDialog1.open();
		},
		
		_handleClose1: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		//this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
		this.State1 = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		this.getView().byId("idState1").setValue(oSelectedItem.getTitle());
		//ELSE REMOVED BY BHUSHAN
		this.getView().byId("idDistrict1").setValue().setEnabled(true);
		this.getView().byId("inpWarrantyDealerDetails").setValue();
		this.getView().byId("inpSapDealerCode").setValue();
		this.getView().byId("inpDealerLocContNo").setValue();
			}
		},
		
		/***********************************f4 District second help ****************************************/
		onDistrictHelp1: function() {
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '" + this.State1 + "'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpDistrictDialog1 = new sap.m.SelectDialog({
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
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("District", sap.ui.model.FilterOperator.Contains, sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleDistrictClose1, this],
		cancel: [this._handleDistrictClose1, this]
		});
		_valueHelpDistrictDialog1.setModel(jModel);
		_valueHelpDistrictDialog1.open();
		},
		
		_handleDistrictClose1: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		//this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
		this.District1 = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		this.getView().byId("idDistrict1").setValue(oSelectedItem.getTitle());
		}
		this.getView().byId("inpWarrantyDealerDetails").setEnabled(true);
		this.getView().byId("inpWarrantyDealerDetails").setValue();
		this.getView().byId("inpSapDealerCode").setValue();
		this.getView().byId("inpDealerLocContNo").setValue();
		},
		
		/************************************************************************************************************************/

		onComplaintRepNo:function(){ 
			debugger 
		   var sPath = "/sap/opu/odata/sap/ZCS_NON_PROD_COMPLAINT_SRV/GetOldComplaintNumberSet?$filter=Tele eq '"+Tele+"'"; 
			var jModel = new sap.ui.model.json.JSONModel(); 
			jModel.loadData(sPath, null, false,"GET",false, false, null); 
			var _valueHelpComplaintSelectDialog = new sap.m.SelectDialog({ 

			title: "TicketNo", 
			items: { 
			path: "/d/results", 
			template: new sap.m.StandardListItem({ 
			title: "{TicketNo}", 
			customData: [new sap.ui.core.CustomData({ 
			key: "{TicketNo}", 
			value: "{TicketNo}" 
			})], 

			}), 
			}, 
			liveChange: function(oEvent) { 
			var sValue = oEvent.getParameter("value"); 
			var oFilter = new sap.ui.model.Filter("TicketNo",sap.ui.model.FilterOperator.Contains,sValue); 
			oEvent.getSource().getBinding("items").filter([oFilter]); 
			}, 
			confirm: [this._handleComplaintClose, this], 
			cancel: [this._handleComplaintClose, this] 
			}); 
			_valueHelpComplaintSelectDialog.setModel(jModel); 
			_valueHelpComplaintSelectDialog.open(); 
			}, 
			_handleComplaintClose: function(oEvent) { 
			var oSelectedItem = oEvent.getParameter("selectedItem"); 
			if (oSelectedItem) { 
			this.getView().byId("IDTickRef").setValue(oSelectedItem.getTitle()); 
			} 
			}, 

		/********************************************************************************************************************************/
		onFranch:function(){
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FranchiseCompanyNameSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({
		
		title: "Company Name",
		items: {
		path: "/d/results",
		template: new sap.m.StandardListItem({
		title: "{CompanyName}",
		customData: [new sap.ui.core.CustomData({
		key: "Key",
		value: "{CompanyName}"
		})],
		
		}),
		},
		liveChange: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("CompanyName",sap.ui.model.FilterOperator.Contains,sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handlefranchClose, this],
		cancel: [this._handlefranchClose, this]
		});
		_valueHelpFranchSelectDialog.setModel(jModel);
		_valueHelpFranchSelectDialog.open();
		},
		_handlefranchClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
		this.getView().byId("idFCNameInput").setValue(oSelectedItem.getTitle());
		}
		},
		
		
		
		NumberValidOpenTicket : function(oEvent)
		{
		debugger
		var that=this;
		var val = oEvent.getSource().getValue();
		
		if(val){
		if(isNaN(val)){
		val = val.substring(0, val.length - 1);
		oEvent.getSource().setValue(val);
		}
		}
		if (val.length == '10'){
		debugger
		Tele 	= val;
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_NON_PROD_COMPLAINT_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel( sServiceUrl);
		oReadModel.setHeaders({
		"Content-Type": "application/atom+xml"
		});
		var fncSuccess = function(oData, oResponse) //success function
		{
			
		
		//compTicket = oData.TicketNo;
		debugger
		if(oData.results.length==1){
		/*sap.m.MessageBox.show(oData.Message, {
		title: "Last Ticket Detail", 
		icon:sap.m.MessageBox.Icon.SUCCESS,*/
		
	/*	onClose:function(){*/
	/*	that.getView().byId("idPhone2").setValue(oData.ITelf2);
		that.getView().byId("idFname").setValue(oData.Fname);
		that.getView().byId("idLname").setValue(oData.Lname);
		that.getView().byId("idAdd1").setValue(oData.Addr1);
		that.getView().byId("idAdd2").setValue(oData.Addr2);
		that.getView().byId("idState").setValue(oData.Bezei);
		that.getView().byId("idState1").setValue(oData.Bezei);
		that.State  = oData.Region;
		that.State1 = oData.Region;
		that.getView().byId("idDistrict").setValue(oData.City2);
		that.getView().byId("idDistrict1").setValue(oData.City2);
		that.getView().byId("idDistrict").setEnabled(true);
		that.getView().byId("idDistrict1").setEnabled(true);
		that.getView().byId("idCity").setEnabled(true);
		that.getView().byId("idCity").setValue(oData.City1);
		that.getView().byId("idEmail").setValue(oData.Email);*/		
		that.getView().byId("IDTickRef").setValue(oData.results[0].TicketNo).setShowValueHelp(false).setEnabled(false);
		
//		}
		/*});*/
		}
		}		
			
		var fncError = function(oError) {} //error callback function
		oReadModel.read("/GetOldComplaintNumberSet?$filter=Tele eq '"+val+"'", {
		success: fncSuccess,
		error: fncError
		});
		}
		},
		
	/*	onChangeComplaint:function(){
			debugger
			if(compTicket == ""){
				that.getView().byId("IDTickRef").setValue(oData.TicketNo).setShowValueHelp(true);	
			}
		},
		*/
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
		
		YearValid : function(oEvent)
		{
		debugger
		var val = oEvent.getSource().getValue();
		if(val){
		if(isNaN(val)){
		val = val.substring(0, val.length - 1);
		oEvent.getSource().setValue(val);
		}else if(!(isNaN(val)) && val.length == 4){
		var d = new Date();
		var y = d.getFullYear();
		if(val < 2000){
		sap.m.MessageToast.show("Year cannot be less than 2000");
		oEvent.getSource().setValue();
		}else if(val > y){
		sap.m.MessageToast.show("Year cannot be future year");
		oEvent.getSource().setValue();
		}
		}
		else
		{
		}
		}
		},
		
		DateCheck:function(Date1){
		if(Date1==null){
		var formatDate = "0000-00-00T00:00:00";
		return formatDate;
		}else{
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
		}
		},
		
		// use in  fname , lname
		
		validateCharacter : function( oEvent ){
		var text     = oEvent.getSource().getValue();
		var reg      = /^[a-z A-Z]+$/;
		if( !text.match(reg) ){
		if( !isNaN( text.charAt(0)) || !text.charAt(0).match(reg)){
		text = text.substring( 1 , text.length );
		}else if( !isNaN( text.charAt( text.length - 1 )) || !text.charAt(text.length - 1).match(reg)){
		text = text.substring( 0 , text.length - 1 );
		}else{
		for( var i = 0 ; i < text.length; i++ ){
		if( !isNaN( text.charAt(i) ) || !text.charAt(i).match(reg)){
		text = text.split( text.charAt(i) )[0] + text.split( text.charAt(i) )[1];
		}
		}
		}
		oEvent.getSource().setValue( text );
		}else{
		oEvent.getSource().setValueState( "None" );
		}
		},
		
		validateCharacter1 : function( oEvent ){
		var text     = oEvent.getSource().getValue();
		var reg      = /^[a-zA-Z]+$/;
		if( !text.match(reg) ){
		if( !isNaN( text.charAt(0)) || !text.charAt(0).match(reg)){
		text = text.substring( 1 , text.length );
		}else if( !isNaN( text.charAt( text.length - 1 )) || !text.charAt(text.length - 1).match(reg)){
		text = text.substring( 0 , text.length - 1 );
		}else{
		for( var i = 0 ; i < text.length; i++ ){
		if( !isNaN( text.charAt(i) ) || !text.charAt(i).match(reg)){
		text = text.split( text.charAt(i) )[0] + text.split( text.charAt(i) )[1];
		}
		}
		}
		oEvent.getSource().setValue( text );
		}else{
		oEvent.getSource().setValueState( "None" );
		}
		},
		
		
		validateCharacterloction : function( oEvent ){
		var text     = oEvent.getSource().getValue();
		var reg      = /^[a-z A-Z 0-9]+$/;
		if( !text.match(reg) ){
		if( !isNaN( text.charAt(0)) || !text.charAt(0).match(reg)){
		text = text.substring( 1 , text.length );
		}else if( !isNaN( text.charAt( text.length - 1 )) || !text.charAt(text.length - 1).match(reg)){
		text = text.substring( 0 , text.length - 1 );
		}else{
		for( var i = 0 ; i < text.length; i++ ){
		if( !isNaN( text.charAt(i) ) || !text.charAt(i).match(reg)){
		text = text.split( text.charAt(i) )[0] + text.split( text.charAt(i) )[1];
		}
		}
		}
		oEvent.getSource().setValue( text );
		}else{
		oEvent.getSource().setValueState( "None" );
		}
		},
		
		DateNew:function(Date1){
		if(Date1===null){
		Date1=new Date();
		}
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
		
		});
		