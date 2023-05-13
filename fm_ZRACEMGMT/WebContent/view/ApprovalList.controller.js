jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("ZRACEMGMT.view.ApprovalList", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.ApprovalList
*/
	onInit: function() {
		debugger
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {

		}
		sap.ui.core.UIComponent.getRouterFor(this).getRoute(
		"page3").attachMatched(this._onRoute, this);
	},
	
	_onRoute: function(){
		window.rnA = "";
	var oBindingPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/MyApprovalListSet"
	this.Displaymodel = new sap.ui.model.json.JSONModel();
	this.Displaymodel.loadData(oBindingPath, null, false, "GET", false, false, null);
	this.getView().setModel(this.Displaymodel);
	/*	if(this.Displaymodel.oData.d.results.length == "0"){
			var message = "No list found.";
			sap.m.MessageBox.show(message, {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
				onClose : function() { 
					window.location.reload();
				}
			});
		}*/
	},
	
	onAprrove: function(e){
		var self= this;
		var oEntry = {}
		
		var raceNo = e.getSource().getParent().getCells()[0].getText();
		var fY = e.getSource().getParent().getCells()[7].getValue();
		var plant = e.getSource().getParent().getCells()[2].getValue();
		var itmNo = e.getSource().getParent().getCells()[6].getValue();
		var itemtxt = e.getSource().getParent().getCells()[1].getValue();
		var rceAmt = e.getSource().getParent().getCells()[3].getValue();
		
		oEntry.RaceNumber = raceNo;
		oEntry.FiscalYear = fY;
		oEntry.Plant = plant;
		oEntry.ItemNo = itmNo;
		oEntry.ItemText = itemtxt;
		oEntry.RaceApprovalAmount = rceAmt;
		
		
//		"RaceNumber" : "JK/KHO/2019/0008",
//		"FiscalYear" : "2019",
//		"Plant" : "JKHO",
//		"ItemNo" : "0002",
//		"ItemText" : "Approved 2nd level",
//		"RaceApprovalAmount" : "2.00"
		sap.m.MessageBox
		.show(
				"Are you sure you want to approve?",
				{
					icon : sap.m.MessageBox.Icon.WARNING,
					title : "Warning",
					actions : [
							"Continue",
							"Cancel" ],
					onClose : function(
							a) {
						if (a === "Continue") {
							
							
							var sServiceUrl = "/sap/opu/odata/sap/ZMM_RACE_SRV/";
							var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
							oCreateModel1.setHeaders({
								"Content-Type": "application/atom+xml"
								});

							oCreateModel1.create("/RaceApproveSet", oEntry, null,
									function(oData, oResponds) {
										debugger;

										sap.m.MessageToast
												.show(
														"Approved",
														{
															duration : 3000
														});

//										sap.m.MessageBox.show(message, {
//											// icon
//											// :
//											// sap.m.MessageBox.Icon.ERROR,
//											title : "Information",
//											actions : [ 'OK' ],
//											onClose : function(a) {
//
//												if (status === "S") {
//
//												}
//
//											},
//										});

									}, function(oData, oResponds) {
										var a = 1;

									})
							

								
							
							self._onRoute();
						} else if (a === "Cancel") {
							sap.m.MessageBox.Action.CANCEL
						}
					},
				});
		
	},
	
	onReject: function(e){
		var self= this;
		var oEntry = {}
		
		var raceNo = e.getSource().getParent().getCells()[0].getText();
		var fY = e.getSource().getParent().getCells()[7].getValue();
		var plant = e.getSource().getParent().getCells()[2].getValue();
		var itmNo = e.getSource().getParent().getCells()[6].getValue();
		var itemtxt = e.getSource().getParent().getCells()[1].getValue();
		var rceAmt = e.getSource().getParent().getCells()[3].getValue();
		
		oEntry.RaceNumber = raceNo;
		oEntry.FiscalYear = fY;
		oEntry.Plant = plant;
		oEntry.ItemNo = itmNo;
		oEntry.ItemText = itemtxt;
		oEntry.RaceApprovalAmount = rceAmt;
		
		var dialog = new sap.m.Dialog(
				{
					title : "Are you sure you want to reject?",
					type : 'Message',
					state : 'Warning',
					content : [
							new sap.m.Label(
									{
										text : "Reason of Rejection",
										labelFor : 'submitDialogTextarea'
									}),

							new sap.m.TextArea(
									'submitDialogTextarea',
									{
										liveChange : function(
												oEvent) {
											var sText = oEvent
													.getParameter('value');
											var parent = oEvent
													.getSource()
													.getParent();

											parent
													.getBeginButton()
													.setEnabled(
															sText.length > 0);
										},
										width : '100%',
										maxLength : 250,
										height : '80px',
										placeholder : "Add Note"
									}) ],

					beginButton : new sap.m.Button(
							{
								text : "OK",
								enabled : false,
								press : function() {
									
									
									var sServiceUrl = "/sap/opu/odata/sap/ZMM_RACE_SRV/";
									var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
									oCreateModel1.setHeaders({
										"Content-Type": "application/atom+xml"
										});

									oCreateModel1.create("/RaceRejectSet", oEntry, null,
											function(oData, oResponds) {
												debugger;

												sap.m.MessageToast
														.show(
																"Rejected",
																{
																	duration : 3000
																});
												dialog
												.close();
												self._onRoute();

//												sap.m.MessageBox.show(message, {
//													// icon
//													// :
//													// sap.m.MessageBox.Icon.ERROR,
//													title : "Information",
//													actions : [ 'OK' ],
//													onClose : function(a) {
		//
//														if (status === "S") {
		//
//														}
		//
//													},
//												});

											}, function(oData, oResponds) {
												var a = 1;

											})
									
								}
							}),

					endButton : new sap.m.Button(
							{
								text : "Cancel",
								press : function() {
									dialog
											.close();
								}
							}),

					afterClose : function() {
						dialog.destroy();
					}
				}).addStyleClass("sapUiSizeCompact");
		
		dialog.open();
		
		
	},
	
	menu : function(){
		var that = this;
		
		if (!that._RaceDialog) {
			
			that._RaceDialog = sap.ui.xmlfragment(
				"ZRACEMGMT.view.Intial", that);
			that.getView().addDependent(that._RaceDialog);}
		that._RaceDialog.open();
	},
	
	onRaceCloseButton: function(e){
		var that = this;
//		var display = sap.ui.getCore().byId("RBG").getSelectedIndex();
		var display  = e.getSource().getParent().getContent()[0].getContent()[0].mAggregations.form.getFormContainers()[0].getFormElements()[0].getFields()[0].getSelectedIndex();
		// if option is for display
		if(display == 1){
			
			var router = sap.ui.core.UIComponent
			.getRouterFor(this);
			router
			.navTo("page2");
		}else{
			if(display == 2){
				var router = sap.ui.core.UIComponent
				.getRouterFor(this);
				router
				.navTo("page3");
			}else{
				if(display == 0){
					var router = sap.ui.core.UIComponent
					.getRouterFor(this);
					router
					.navTo("page1");
				}
			}
			
		}
		
			
		
		that._RaceDialog.close();
		},
	
	onRaceCloseCancle : function(e){
		var that = this;
		if (that._RaceDialog){
			that._RaceDialog.close();
		}else{
			that._RaceDialog.close();
		}
		
		},
		
		onItemPress : function(e){
			
			window.rnA = e.getSource().getText();
			var router = sap.ui.core.UIComponent
					.getRouterFor(this);
					router
					.navTo("page1");
			
		},
//*****************************************************************************************************************		
/*onBack:function(){
debugger
window.history.back();
},*/
//*****************************************************************************************************************
});