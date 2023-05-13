jQuery.sap.require("ZTRUCKWHEEL.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.Dialog");
jQuery.sap.require("sap.m.TextArea");
var that;
sap.ui.controller("ZTRUCKWHEEL.view.View1", {
	raceType:"",
	Displaymodel:"",

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.View1
*/
	onInit : function() {
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {

		}
		
		that = this;
		this.model = this.getOwnerComponent().getModel();
		var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(
				sServiceUrl);
		oReadModel.setHeaders({
			"Content-Type" : "application/json"
		});
		var fncSuccess = function(oData, oResponse){
			debugger
			if(oData.results.length==0 ){
				sap.m.MessageBox.show("Your not Registered to any Fleet", {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					onClose:function(){
						window.history.back();
					}
					});	
			}else if(oData.results.length==1)
				{
				debugger;
				that.Customer = oData.results[0].Kunnr;
				that.getView().byId("HeaderIdTit").setText(oData.results[0].FleetName);
				that._onRoute();
				}
			else{
				that.FleetData=oData;
				if (!that._FleetDialog) {
				that._FleetDialog = sap.ui.xmlfragment(
						"ZTRUCKWHEEL.view.Intial", that);
					that.getView().addDependent(that._FleetDialog);}
				that._FleetDialog.open();
						
			}
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
		oReadModel.read("/User_Fleet_DetialsSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'", {
			success : fncSuccess,
			error : fncError
		});
		
//		sap.ui.core.UIComponent.getRouterFor(this).getRoute("page1").attachMatched(
//				this._onRoute, this);

	},
	
	onFleetCloseButton:function(){
//		var that = this;
		if(sap.ui.getCore().byId("idFleet").getValue()!=""){
			this.getView().byId("HeaderIdTit").setText(sap.ui.getCore().byId("idFleet").getValue());
		that._FleetDialog.close();
		that._onRoute();
		}else{
			sap.m.messageToast.show("Select Fleet")
		}
		
	},
	onFleetCloseCancle:function(){
		window.history.back();
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
			this.Customer = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
			debugger;
			this.CustomerValue.setValue(oSelectedItem.getTitle());
		}

	},

	_onRoute : function() {
		
		var UserId = sap.ushell.Container.getService("UserInfo").getId();
		var List = this.getView().byId("listId");
		var loFilter = new Array();
		var filter1 = new sap.ui.model.Filter("CUname",sap.ui.model.FilterOperator.EQ,UserId);
		loFilter.push(filter1);
		var filter2 = new sap.ui.model.Filter("Kunnr",sap.ui.model.FilterOperator.EQ,this.Customer);
		loFilter.push(filter2);
		var path = "/TruckWheelApprovalListSet?$filter= CUname eq '"
			+ UserId + "' and Kunnr eq'" + this.Customer + "'";
		var _self = this;
		var loListTemplate = "";
		var oModel  = this.getView().getModel("Model");
		oModel.read(path, null , null , false, function(OData, oResponse) {
			var that = _self;
			var reqdata = OData.results;
			var lnth = OData.results.length;
			
		    	var tempModel = new sap.ui.model.json.JSONModel({ "VehicleMasterSet" :  reqdata});
				loListTemplate = new sap.m.ObjectListItem(
						{
							type : "Active",
							intro : "{RegNo}",
							title : "{TruckWheelName}",
							number : "{EstimatedCost}",
							numberUnit : "INR",
							attributes : [
									new sap.m.ObjectAttribute(
											{
												text : "{RequestDate}"
											}),
//									new sap.m.ObjectAttribute(
//											{
//												visible : false,
//												text : "{main>WiId}"
//											}),
//									new sap.m.ObjectAttribute(
//											{
//												visible : false,
//												text : "{main>ZwfPosition}"
//											}) 
									],
//							firstStatus : new sap.m.ObjectStatus(
//									{
//										text : "{main>Werks}"
//									}),
						});
				List.unbindAggregation("items");
				List.setModel(tempModel);
				tempModel.setSizeLimit(tempModel.oData.VehicleMasterSet.length);
				List.bindAggregation("items", "/VehicleMasterSet", loListTemplate);
			
			
		});
		
//		List
//		.bindAggregation(
//				"items",
//				{
//					path : "Model>/TruckWheelApprovalListSet",
//					filters : loFilter,
//					template : new sap.m.ObjectListItem(
//							{
//								type : "Active",
//								intro : "{Model>RegNo}",
//								title : "{Model>TruckWheelName}",
//								number : "{Model>EstimatedCost}",
//								numberUnit : "INR",
//								attributes : [
//										new sap.m.ObjectAttribute(
//												{
//													text : "{Model>RequestDate}"
//												}),
////										new sap.m.ObjectAttribute(
////												{
////													visible : false,
////													text : "{main>WiId}"
////												}),
////										new sap.m.ObjectAttribute(
////												{
////													visible : false,
////													text : "{main>ZwfPosition}"
////												}) 
//										],
////								firstStatus : new sap.m.ObjectStatus(
////										{
////											text : "{main>Werks}"
////										}),
//							})
//				});
		
	},
	
	onSearch : function(evt)
	{
		var list = this.getView().byId("listId");
		var binding = list.getBinding("items");
		var sValue = evt.getSource().getValue();
		var oFilter = new sap.ui.model.Filter("RegNo", sap.ui.model.FilterOperator.Contains, sValue);
		binding.filter([oFilter]);
	},


	onPressBack : function() {

		this.getSplitAppObj().backDetail();

	},

	onUpdateFinished : function() {

		var firstItem = this.getView()
				.byId("listId").getItems()[0];

		if (firstItem === undefined) {
			
			
		} else {
			
			this.getView().byId("listId").setSelectedItem(	firstItem,true);
			this.SelectItem();
		}

	},

	SelectItem : function(e) {
		
		var list = this.getView().byId(
		'listId');
		var vecNo = list.getSelectedItem().getIntro();
		
		
//			var that = this;
			
			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(
					sServiceUrl);
			oReadModel.setHeaders({
				"Content-Type" : "application/json"
			});
			var fncSuccess = function(oData, oResponse) // sucess
														// function
			{
			that.data=oData;

			
			if(oData.Error=="X"){
			sap.m.MessageBox.show(oData.Message, {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
				onClose:function(){
					that.getView().byId("FVehicleNoEdit").setValue();	
				}
			});	
		
			this.getView().byId("FVehicleNoEdit").setValue();
			}else{

			}
			
//			if(hubCode){
//				that.data.HubCode=hubCode;
//			}else{
//				that.data.HubCode=sap.ui.getCore().byId("idHub").getName();
//			}
			
			oData.InspType = "04";
			var FitModel = new sap.ui.model.json.JSONModel(oData);
			that.getView().setModel(FitModel,"Fitments")

			if(that.data.LastMeterStatus=="N"){
//				that.getView().byId("idMulReading").setEnabled(true);
			}else{
//				that.getView().byId("idMulReading").setEnabled(false);
			}
			if(that.data.ContractType=="CPKM"){
				that.flg=0;
				that.getView().byId("Panel1").setVisible(true);
				that.getView().byId("Panel2").setVisible(false);
				var tab=that.getView().byId("tblDetail");
				var temp = new sap.m.ColumnListItem({
					cells : [
					        // new sap.m.Text({text:""}),
					         new sap.m.Text({text:"{Zposition}"}),
					         new sap.m.VBox({items:[new sap.m.Select({selectedKey:"{Owner}",enabled:"{path:'Zposition',formatter:'com.acute.srv.sheet.create.util.Formatter.StpEnable'}",
					        	 change:[that.owner,that],enabled:false,forceSelection:false ,items:[new sap.ui.core.Item({text:"JK Tyre",key:"01"}),new sap.ui.core.Item({text:"Fleet Tyre",key:"02"})]}), that.nonjkSelect]}),
						     new sap.m.Text({text:"{ItemDesc}"}),
					         new sap.m.Text({text:"{StnclNumber}"}),
					         new sap.m.Select({selectedKey:"{RemoveOk}",change:[that.onAction,that],items:[new sap.ui.core.Item({text:"Yes",key:"O"}),new sap.ui.core.Item({text:"No",key:"R"})],forceSelection:false,width:"100%"}),
					         new sap.m.Button({text:"",press:[that.onSerSheet,that],icon:"sap-icon://activity-2",type:"Emphasized",enabled:true}),

					         ]
				});
				tab.setModel(FitModel);
				tab.bindAggregation("items" , "/RegnoToItemNvg/results", temp );
			}else if(that.data.ContractType=="SC"){
				that.flg=1;
				that.getView().byId("Panel1").setVisible(false);
				that.getView().byId("Panel2").setVisible(true);
				var tab=that.getView().byId("tblDetail1");
				var temp = new sap.m.ColumnListItem({
					cells : [
					        // new sap.m.Text({text:""}),
					         new sap.m.Text({text:"{Zposition}"}),
					         new sap.m.Text({text:"{RotationPosNew}"}),
					         new sap.m.Text({text:"{NonJkCompany}"}),
					         new sap.m.Text({text:"{ItemDesc}"}),
					         new sap.m.Text({text:"{StnclNumber}"}),
					         new sap.m.Text({text:"{}"}),
					         new sap.m.Button({text:"",press:[that.onSerSheet,that],icon:"sap-icon://activity-2",type:"Emphasized",enabled:true}),

					         ]
				});
				tab.setModel(FitModel);
				tab.bindAggregation("items" , "/RegnoToItemNvg/results", temp);
				
			}
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
			//oReadModel.read("/VehicleDetailsSet(RegNo='"+vecNo+"',ConfigCode='')?$expand=VehicleToItemNvg", {
			//Type = 'T' changed to 'A'
				oReadModel.read("/VehicleRegNoSet(RegNo='"+vecNo+"',Type='A')?$expand=RegnoToItemNvg/VitemToServiceNvg/IservToSubservNvg,RegnoToServiceNvg/VServToSubservNvg", {
				success : fncSuccess,
				error : fncError
			});

		
	
		
	},

	selectedTab : function(c) {
		var t = c.getSource()
				.getSelectedKey();
		if (t === "Attachments") {
			this.attachmentsTabSelected();
		}
		if(t === "history"){
			this.getView().byId("tableLineItem").setVisible(false);
		}else{
			this.getView().byId("tableLineItem").setVisible(true);
		}
	},
	
	onSerSheetVech:function(evt){
//		var that = this;
		that.onServiceButton=evt.getSource();
		

			
				if (!that._SheetHelpDialog) {
					that._SheetHelpDialog = sap.ui.xmlfragment(
						"ZTRUCKWHEEL.view.ServiceSheet", that);
					that.getView().addDependent(that._SheetHelpDialog);}
					
//				
				
			//that.data=oData;
			var ShetModel = new sap.ui.model.json.JSONModel(that.data);
//			var ShetModel = new sap.ui.model.json.JSONModel(evt.getSource().getBindingContext().getObject());
			sap.ui.getCore().byId("IdObj1").setTitle("Vehicle Reg. Number");
			sap.ui.getCore().byId("IdObj1").setText(that.data.RegNo);
			sap.ui.getCore().byId("IdObj").setVisible(false);
			//sap.ui.getCore().byId("IdObj").setText(evt.getSource().getBindingContext().getObject().StnclNumber);
			sap.ui.getCore().byId("IdObj5").setVisible(false);
			//sap.ui.getCore().byId("IdObj5").setText(evt.getSource().getBindingContext().getObject().Zposition+" ("+evt.getSource().getBindingContext().getObject().PositionDesc+")");
			var tab=sap.ui.getCore().byId("Servicetbl");
			tab.setModel(ShetModel)
			var temp;
			for(var i=0; i<tab.getModel().getData().RegnoToServiceNvg.results.length; i++){
				if(tab.getModel().getData().RegnoToServiceNvg.results[i].ServiceSelect === "X"){
					temp = new sap.m.ColumnListItem({
						cells : [
						         
									new sap.m.Text({text:tab.getModel().getData().RegnoToServiceNvg.results[i].ServiceDesc}),
									new sap.m.Text({text:tab.getModel().getData().RegnoToServiceNvg.results[i].ServiceRate}),
									new sap.m.Input({value:tab.getModel().getData().RegnoToServiceNvg.results[i].ServicePRate, textAlign:"End", enabled:false, width:"30%", liveChange:[that.NumberValid2,that]})		       

						         
						        // new sap.m.Text({text:""}),
//						         new sap.m.Text({text:"{ServiceDesc}"}),
//						         new sap.m.Text({text:"{ServiceRate}"}),
//						         new sap.m.Input({value:"{path:'ServicePRate',formatter:'com.acute.srv.sheet.create.util.Formatter.trimData'}", textAlign:"End", enabled:false, width:"30%", liveChange:[that.NumberValid2,that]})		       
						        
						         ],selected:"{path:'ServiceSelect',formatter:'ZTRUCKWHEEL.util.Formatter.SelecFlg'}"
					})
					tab.addItem(temp);
				}
				
			}
			//var oFilter = new sap.ui.model.Filter("Level", sap.ui.model.FilterOperator.EQ, "TYRE");
//			tab.bindAggregation("items" ,{ path : "/RegnoToServiceNvg/results",template : temp});
			that._SheetHelpDialog.open();
		
		
	},
	
	NumberValid2: function(oEvent){
		var val = oEvent.getSource().getValue();
//		var num = parseFloat($(this).val());
//	    var cleanNum = num.toFixed(2);
//	    $(this).val(cleanNum);
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
	
	onSerSheet:function(evt){
//		var that=this;
		that.onServiceButton=evt.getSource();	
//var that = this;
			
//			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
//			var oReadModel = new sap.ui.model.odata.ODataModel(
//					sServiceUrl);
//			oReadModel.setHeaders({
//				"Content-Type" : "application/json"
//			});
//			var fncSuccess = function(oData, oResponse) // sucess
//														// function
//			{
				if (!that._SheetHelpDialog) {
					that._SheetHelpDialog = sap.ui.xmlfragment(
						"ZTRUCKWHEEL.view.ServiceSheet", that);
					that.getView().addDependent(that._SheetHelpDialog);}
					
//				
				
			//that.data=oData;
			var ShetModel = new sap.ui.model.json.JSONModel(evt.getSource().getBindingContext().getObject());
			sap.ui.getCore().byId("IdObj1").setTitle("Vehicle Reg. Number");
			sap.ui.getCore().byId("IdObj1").setText(that.data.RegNo);
			sap.ui.getCore().byId("IdObj").setTitle("Stencil No");
			sap.ui.getCore().byId("IdObj").setText(evt.getSource().getBindingContext().getObject().StnclNumber);
			sap.ui.getCore().byId("IdObj5").setTitle("Position");
			sap.ui.getCore().byId("IdObj5").setText(evt.getSource().getBindingContext().getObject().Zposition+" ("+evt.getSource().getBindingContext().getObject().PositionDesc+")");
			var tab=sap.ui.getCore().byId("Servicetbl");
			tab.setModel(ShetModel);
			var temp;
			for(var i=0; i<tab.getModel().getData().VitemToServiceNvg.results.length; i++){
				if(tab.getModel().getData().VitemToServiceNvg.results[i].ServiceSelect === "X"){
					temp = new sap.m.ColumnListItem({
						cells : [
						         
									new sap.m.Text({text:tab.getModel().getData().VitemToServiceNvg.results[i].ServiceDesc}),
									new sap.m.Text({text:tab.getModel().getData().VitemToServiceNvg.results[i].ServiceRate}),
									new sap.m.Input({value:tab.getModel().getData().VitemToServiceNvg.results[i].ServicePRate, textAlign:"End", enabled:false, width:"30%", liveChange:[that.NumberValid2,that]})		       

						         
						        // new sap.m.Text({text:""}),
//						         new sap.m.Text({text:"{ServiceDesc}"}),
//						         new sap.m.Text({text:"{ServiceRate}"}),
//						         new sap.m.Input({value:"{path:'ServicePRate',formatter:'com.acute.srv.sheet.create.util.Formatter.trimData'}", textAlign:"End", enabled:false, width:"30%", liveChange:[that.NumberValid2,that]})		       
						        
						         ],selected:"{path:'ServiceSelect',formatter:'ZTRUCKWHEEL.util.Formatter.SelecFlg'}"
					})
					tab.addItem(temp);
				}
				
			}
			//var oFilter = new sap.ui.model.Filter("Level", sap.ui.model.FilterOperator.EQ, "TYRE");
//			tab.bindAggregation("items" ,{ path : "/VitemToServiceNvg/results",template : temp});
			that._SheetHelpDialog.open();
		
	},
	
	onTabelServiceOK:function(){
		var items=sap.ui.getCore().byId("Servicetbl").getSelectedItems();	
//		if(items.length==0){
//			sap.m.MessageToast.show("Select the Service needed to tyre");
//		}
//		else{
//			this.onServiceButton.setType("Accept");
			this._SheetHelpDialog.close();
			this._SheetHelpDialog.destroy();
			this._SheetHelpDialog=undefined;
//		}
		},



	getSplitAppObj : function() {
		var result = this
				.byId("SplitAppDemo");
		if (!result) {
			jQuery.sap.log
					.info("SplitApp object can't be found");
		}
		return result;
	},



	onBackNav : function() {

		this.getSplitAppObj().backMaster();

	},

	onApprove: function(){
		that.onButtonClick("A");
	},
	
	onReject: function(){
		var dialog = new sap.m.Dialog({
			title: 'Remarks',
			type: 'Message',
			content: [
			        new sap.m.TextArea('submitDialogTextarea', {
					liveChange: function(oEvent) {
						var sText = oEvent.getParameter('value');
						var parent = oEvent.getSource().getParent();

						parent.getBeginButton().setEnabled(sText.length > 0);
					},
					width: '100%',
					placeholder: 'Add Remarks (required)'
				})
			],
			beginButton: new sap.m.Button({
				text: 'Submit',
				enabled: false,
				press: function () {
					var sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
					if(sText.length > 0){
						that.onButtonClick("R");
						dialog.close();
					}
						
				}
			}),
			endButton: new sap.m.Button({
				text: 'Cancel',
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});

		dialog.open();
	},
	
	onEdit: function(){
		var dialog = new sap.m.Dialog({
			title: 'Remarks',
			type: 'Message',
			content: [
			        new sap.m.TextArea('submitDialogTextarea', {
					liveChange: function(oEvent) {
						var sText = oEvent.getParameter('value');
						var parent = oEvent.getSource().getParent();

						parent.getBeginButton().setEnabled(sText.length > 0);
					},
					width: '100%',
					placeholder: 'Add Remarks (required)'
				})
			],
			beginButton: new sap.m.Button({
				text: 'Submit',
				enabled: false,
				press: function () {
					var sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
					if(sText.length > 0){
						that.onButtonClick("E");
						dialog.close();
					}
						
				}
			}),
			endButton: new sap.m.Button({
				text: 'Cancel',
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});

		dialog.open();
		
	},	
	onButtonClick: function(status){
		if(that.data.ContractType === "CPKM"){
			var tableId = "tblDetail";
		}else{
			var tableId = "tblDetail1";
		}
		var table = this.getView().byId(tableId);
		var loItems = this.getView().byId(tableId).getItems();
		
		for ( var i in loItems) {
			var laCells = loItems[i].getCells();
			if(tableId === "tblDetail1"){
//				var owner = this.getView().byId(tableId).getItems()[i].getCells()[2].getSelectedKey();
				var owner = this.getView().byId(tableId).getItems()[i].getCells()[2].getProperty("text");
			}else{
//				var owner = this.getView().byId(tableId).getItems()[i].getCells()[2].getItems()[i].getSelectedKey();
				var owner = this.getView().byId(tableId).getItems()[i].getCells()[1].getItems()[0].getSelectedItem().getProperty("text");
			}	
			var itemCode = this.getView().byId(tableId).getItems()[i].getCells()[3].getProperty("text");
			if(tableId === "tblDetail1"){
				var stencilNo = this.getView().byId(tableId).getItems()[i].getCells()[4].getProperty("text");
			}else{
				var stencilNo = this.getView().byId(tableId).getItems()[i].getCells()[3].getProperty("text");
			}
//			var action = this.getView().byId(tableId).getItems()[i].getCells()[5].getSelectedKey();
//			var actionEnabled = this.getView().byId(tableId).getItems()[i].getCells()[5].getEnabled();
			//var readings = this.getView().byId("tblDetail1").getItems()[i].getCells()[7].getType();

			if (owner == "" || itemCode == "" || stencilNo == ""){
//					|| stencilNo == "" || readings == "Emphasized") {
				sap.m.MessageBox
						.show(
								"Please fill mandatory fields of table and make sure to add readings.",
								{
									icon : sap.m.MessageBox.Icon.ERROR,
									title : "ERROR",
									actions : [ "OK" ],
									onClose : function(a) {
										if (a == "OK") {
										}
									},
								});
				return false;
			}
			
//			if(actionEnabled == true){
//				
//				if(action == ""){
//					sap.m.MessageBox
//					.show(
//							"Please select Service Required for each Tyre.",
//							{
//								icon : sap.m.MessageBox.Icon.ERROR,
//								title : "ERROR",
//								actions : [ "OK" ],
//								onClose : function(a) {
//									if (a == "OK") {
//									}
//								},
//							});
//			return false;
//					
//				}
//				
//			}
			
			
		}
		
		
		// end
		var valid=true;
		if(valid){
		var Data=$.extend( true, {}, that.data );;
		delete Data.__metadata;
		delete Data.__proto__;
		Data.InspType = "04";
		Data.ApprovalStatus=status;
		Data.TruckKunnr = that.data.TruckKunnr;
//		Data.TruckHub = hubCode;
		if(Data.MeterReading==""){
			Data.MeterReading="0.0";
		}
		if(Data.KmCovered==""){
			Data.KmCovered="0.0";
		}
//SS							
//		Data.InspectionDate=that.DateNew(that.getView().byId("FFitmentDateEdit").getDateValue());
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
//			sap.m.MessageBox.show("Ticket:"+oData.ETicketNo+" Updated", {
//		        title: "Success",
//		        icon:sap.m.MessageBox.Icon.SUCCESS,
//		        onClose:function(){
//		        	window.history.back();
//		        	
//		    			
//		        }
//		    });
			//oData.InspType = "02";
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
		}
	}

		
			

});