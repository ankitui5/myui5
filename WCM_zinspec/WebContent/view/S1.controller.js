jQuery.sap.require("sap.ui.core.mvc.Controller");
// jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("com.acute.insp.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
var DataArticles, that;

sap.ui.define([
           	"sap/m/MessageBox",
           	"sap/ui/core/mvc/Controller",
           	"sap/ui/model/json/JSONModel",
           	"sap/m/MessageToast"
           ], function(MessageBox,Controller, JSONModel) {
           	"use strict";

sap.ui.core.mvc.Controller
		.extend(
				"com.acute.insp.view.S1",
				{

					onInit : function() {
						this.newBusy = new sap.m.BusyDialog();

						// this.newBusy.open();
						this.model = this.getOwnerComponent().getModel();
						
						

						that = this;

						if (!jQuery.support.touch) {
							this.getView().addStyleClass("sapUiSizeCompact");
						}
						if (sap.ui.Device.system.desktop) {

						}
						
						var date = new Date();
						var oModel = new JSONModel(this._data);
						this.getView().setModel(oModel);
//						this.onRejMode();
//						this.onAppMode();
//						this.onAwardMode();
						//this.onAdjusmentMode();
//						this.onDesposSesion();
						that.loEarlyFailure =false;
						this.onTyreFitMent();
					},
					
				
					//for date
					_data : {
						"date" : new Date()
							},
/********************************************************/
		onTyreFitMent: function() {	
			var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FitmentTypeSet";
			var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false, false, null);
			var loc = this.getView().byId("idFitment");
				loc.unbindAggregation("items");
			//var Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
				loc.setModel(jModel);
				loc.bindAggregation("items", {
					path: "/d/results",
					template: new sap.ui.core.Item({
						key: "{Type}",
						text: "{Description}"
					})
				});
		 },
/*************************************************************/
					
					onDesposSesion:function(key){

						//Method for setting the model for vehicle type
			            var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownDisposalDecisionSet?$filter=ClaimTyp eq '"+key+"'";
				 		var jModel = new sap.ui.model.json.JSONModel();
				 		jModel.loadData(sPath, null, false,"GET",false, false, null);
				 		var  loc= this.getView().byId("idInsDD");
						loc.unbindAggregation("items");
						//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
						loc.setModel(jModel);
						loc.bindAggregation("items", {
							path : "/d/results",
							template : new sap.ui.core.Item({
								key : "{DisposalDecision}",
								text : "{DisposalDecisionText}"
							})
						});
					},
					onAdjusmentMode:function(key){

						//Method for setting the model for vehicle type
			            var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownAdjustmentModeSet?$filter=ClaimTyp eq '"+key+"'";
				 		var jModel = new sap.ui.model.json.JSONModel();
				 		jModel.loadData(sPath, null, false,"GET",false, false, null);
				 		var  loc= this.getView().byId("idInsAdjm");
						loc.unbindAggregation("items");
						//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
						loc.setModel(jModel);
						loc.bindAggregation("items", {
							path : "/d/results",
							template : new sap.ui.core.Item({
								key : "{AdjustmentMode}",
								text : "{AdjustmentModeTxt}"
							})
						});
					},
					onAwardMode:function(key){

						//Method for setting the model for vehicle type
			            var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownAwardModeSet?$filter=ClaimTyp eq '"+key+"'";
				 		var jModel = new sap.ui.model.json.JSONModel();
				 		jModel.loadData(sPath, null, false,"GET",false, false, null);
				 		var  loc= this.getView().byId("idInsAwdm");
						loc.unbindAggregation("items");
						//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
						loc.setModel(jModel);
						loc.bindAggregation("items", {
							path : "/d/results",
							template : new sap.ui.core.Item({
								key : "{AwardMode}",
								text : "{AwardModeTxt}"
							})
						});
					},
					onAppMode:function(key){

						//Method for setting the model for vehicle type
			            var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownApprovalReasonSet?$filter=ClaimTyp eq '"+key+"'";
				 		var jModel = new sap.ui.model.json.JSONModel();
				 		jModel.loadData(sPath, null, false,"GET",false, false, null);
				 		var  loc= this.getView().byId("idInsAppRsen");
						loc.unbindAggregation("items");
						//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
						loc.setModel(jModel);
						loc.bindAggregation("items", {
							path : "/d/results",
							template : new sap.ui.core.Item({
								key : "{AprrovalReason}",
								text : "{ApprovalReasonTxt}"
							})
						});
					},
					onRejMode:function(key){

						//Method for setting the model for vehicle type
			            var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownRejectionReasonSet?$filter=ClaimTyp eq '"+key+"'";
				 		var jModel = new sap.ui.model.json.JSONModel();
				 		jModel.loadData(sPath, null, false,"GET",false, false, null);
				 		var  loc= this.getView().byId("idInsRegRes");
						loc.unbindAggregation("items");
						//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
						loc.setModel(jModel);
						loc.bindAggregation("items", {
							path : "/d/results",
							template : new sap.ui.core.Item({
								key : "{RejectionReason}",
								text : "{RejectionReasonTxt}"
							})
						});
					},
					onCustSelect:function(evt){
						var key=evt.getSource().getSelectedKey();
						this.onTyreFitMent(key);
						this.getView().byId("idFitment").setEnabled(true);
					},
					
					onTypeofDepo : function() {
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimRecvDepoSet";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelprDepoSelectDialog = new sap.m.SelectDialog(
						{
							title : "Select Receving Depo",
								items : {
									path : "/d/results",
									template : new sap.m.StandardListItem(
										{
										title : "{Name1}"+" ("+"{Werks}"+")",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{Werks}"
															}) ],
												}),
									},
					liveChange : function(oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("Werks",sap.ui.model.FilterOperator.Contains,sValue);
				     var oFilter2 = new sap.ui.model.Filter("Name1",sap.ui.model.FilterOperator.Contains,sValue);  
				     var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);	
					oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
									},
									confirm : [ this._handleTypeDepoClose, this ],
									cancel : [ this._handleTypeDepoClose, this ]
								});
						_valueHelprDepoSelectDialog.setModel(jModel);
						_valueHelprDepoSelectDialog.open();
					},
					_handleTypeDepoClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.getView().byId("iddepo").setValue(
									oSelectedItem.getTitle());
							this.RecDepoType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
						}
					},	
					
					
					onTicket : function() {
						var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpTicketSet";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTicketSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Ticket",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{TicketNo}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{TicketNo}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"TicketNo",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleTicketClose, this ],
									cancel : [ this._handleTicketClose, this ]
								});
						_valueHelpTicketSelectDialog.setModel(jModel);
						_valueHelpTicketSelectDialog.open();
					},
					_handleTicketClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.getView().byId("idTno").setValue(
									oSelectedItem.getTitle());
							that.onEnter();
						}

					},
					onClaimF4 : function() {
						debugger;
						var claimDepot = this.getView().byId("iddepo").getValue();
							claimDepot = claimDepot.split("(");
						var claimDepotNew = claimDepot[1].split(")");
							claimDepotNew = claimDepotNew[0];
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimSet?$filter=Werks eq '" +claimDepotNew+ "'" ;
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTicketSelectDialog = new sap.m.SelectDialog(
								{	
									title : "Select Claim No",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{IClaimNo}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{IClaimNo}"
															}) ],
												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"IClaimNo",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleClaimClose, this ],
									cancel : [ this._handleClaimClose, this ]
								});
						_valueHelpTicketSelectDialog.setModel(jModel);
						_valueHelpTicketSelectDialog.open();
					},
					_handleClaimClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.getView().byId("idClaimno").setValue(oSelectedItem.getTitle());
							that.onEnter();
						}
					},
					
					
					onTypeofClaim : function() {
						debugger;
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimTypeSet";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpClaimSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Ticket",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{Descr}"+" ("+"{ClaimType}"+")",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{ClaimType}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
	
	 var oFilter = new sap.ui.model.Filter("ClaimType",sap.ui.model.FilterOperator.Contains,sValue);
     var oFilter2 = new sap.ui.model.Filter("Descr",sap.ui.model.FilterOperator.Contains,sValue);
     
     var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter1 ]);
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
							this.getView().byId("idClaim").setValue(
									oSelectedItem.getTitle());
							this.getView().byId("iddepo").setEnabled(true);
							this.ClaimType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							that.onTypeofCustomer(this.ClaimType);
							this.getView().byId("idCustomer").setEnabled(true);
						}

					},
					
					onTypeofDepo : function() {
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimRecvDepoSet";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false, false, null);
						var _valueHelprDepoSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Receving Depo",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{Name1}"+" ("+"{Werks}"+")",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{Werks}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
	var sValue = oEvent.getParameter("value");
	 var oFilter = new sap.ui.model.Filter("Name1",sap.ui.model.FilterOperator.Contains,sValue);
     var oFilter2 = new sap.ui.model.Filter("Werks",sap.ui.model.FilterOperator.Contains,sValue);
     
     var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);									
	
	oEvent.getSource().getBinding("items")
												.filter([ oFilter1 ]);
									},
									confirm : [ this._handleTypeDepoClose, this ],
									cancel : [ this._handleTypeDepoClose, this ]
								});
						_valueHelprDepoSelectDialog.setModel(jModel);
						_valueHelprDepoSelectDialog.open();
					},
					_handleTypeDepoClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.getView().byId("iddepo").setValue(
									oSelectedItem.getTitle());
							this.RecDepoType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							this.getView().byId("idClaimno").setEnabled(true);
//							this.getView().byId("idIconTabBarStretchContent").setVisible(true);
							this.getView().byId("idDelar").setEnabled(true);
							this.getView().byId("Id_bt1").setVisible(true);
							
						}

					},
					
					onEnter : function() {
						var that = this;
						var ticket = this.getView().byId("idClaimno").getValue();

						// var sPath =
						// "/sap/opu/odata/sap/ZCS_TICKET_SRV/GetTicketDataSet(ITicketNo='"
						// + ticket + "')";
						var sServiceUrl = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/";
						var oReadModel = new sap.ui.model.odata.ODataModel(
								sServiceUrl);
						
						var fncSuccess = function(oData, oResponse) // sucess
																	// function
						{
							
							var ary = {
								"d" : oData
							}
							var jModel = new sap.ui.model.json.JSONModel(ary);

							that.getView().setModel(jModel, "jModel");
							that.data = jModel.getData();
							that.getView().byId("idInspectionNanme").setValue(that.data.d.InspectName);
							that.onAdjusmentMode(that.data.d.ClaimTyp);
							that.onDesposSesion(that.data.d.ClaimTyp);
							that.onRejMode(that.data.d.ClaimTyp);
							that.onAppMode(that.data.d.ClaimTyp);
							that.onAwardMode(that.data.d.ClaimTyp);
							that.getView().byId("Id_EntButton").setVisible(false);

							if (that.data.d.EMessage != "") {
								sap.m.MessageBox.show(that.data.d.EMessage, {
									title : "Error",
									icon : sap.m.MessageBox.Icon.ERROR,
									onClose : function() {
										// window.history.back();
										that.flag = "C";
										that.handleButtonPress();
										that.getView().byId("idSave")
												.setEnabled(false);

									}
								});
							} else {

							}

							that.Dealer = that.data.d.DealerCode;
							that.State = that.data.d.CustomerRegion;
							that.ClaimType=that.data.d.ClaimTyp;
							that.RecDepoType=that.data.d.ClaimRecDepo;
							that.claimTyp=that.data.d.ClaimTyp.substring(0, 2);
							
							that.getView().byId("idVbox").setVisible(true);
							that.getView().byId("IdPanelDefect").setVisible(true);
							that.getView().byId("IdPanelFinal").setVisible(true);
							
							
							if(that.data.d.ItemType=="TYRE"){
								that.getView().byId("IdPanel").setVisible(false);	
								that.getView().byId("IdPanelFurtherItmDtl").setVisible(false);
								that.getView().byId("IdPanel11").setVisible(false);
								that.getView().byId("IdPanel1").setVisible(true);
								that.getView().byId("IdPanel2").setVisible(true);
								that.getView().byId("IdPanelFinal").setVisible(false);
								that.getView().byId("IdPanelFinal2").setVisible(true);
								that.getView().byId("IdPanel24").setVisible(false);
							}else{
								if(that.data.d.ItemType=="TUBE"){
								that.getView().byId("idHeaderTube").setText("Tube Details");
								that.getView().byId("idDetailsTube").setText("Tube Inspection Details");
								}else{
									that.getView().byId("idHeaderTube").setText("Flap Details");
									that.getView().byId("idDetailsTube").setText("Flap Inspection Details");	
								}
								
								that.getView().byId("IdPanel").setVisible(false);
								that.getView().byId("IdPanel11").setVisible(false);
								that.getView().byId("IdPanel1").setVisible(true);
								that.getView().byId("IdPanel2").setVisible(true);	
							}
							if(that.claimTyp=="ND"){
								
								that.getView().byId("IdPanel24").setVisible(true);	
								that.getView().byId("IdPanel11").setVisible(true);	
								that.getView().byId("idinspSkuClass").setSelectedKey("");	
								that.getView().byId("IdPanelFinal2").setVisible(false);
								that.getView().byId("IdPanelFinal").setVisible(true);
								that.getView().byId("IdPanel1").setVisible(false);
								that.getView().byId("IdPanel2").setVisible(false);
								that.getView().byId("IdPanel").setVisible(true);
								
							}else{
								that.getView().byId("IdPanel24").setVisible(false);								
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
						oReadModel.read("/GetInspDataSet(IClaimNo='"+ticket+"',IInspNo='')", {
							success : fncSuccess,
							error : fncError
						});

					},
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
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							//this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
							this.State = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							this.getView().byId("idState").setValue(oSelectedItem.getTitle());
						}

					},
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
							this.getView().byId("idDistrict").setValue(oSelectedItem.getTitle());
						}

					},
					onTypeJkDelar:function(){
					var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpDealerSet?$filter=ClaimType eq '"+this.ClaimType+"' and ClaimRecvDepo eq '"+this.RecDepoType+"'";
					var jModel = new sap.ui.model.json.JSONModel();
					jModel.loadData(sPath, null, false, "GET", false,
							false, null);
					var _valueHelprJKDealSelectDialog = new sap.m.SelectDialog(
							{

								title : "Select Delar Code",
								items : {
									path : "/d/results",
									template : new sap.m.StandardListItem(
											{
												title : "{Name1}"+" ("+"{Kunnr}"+")",
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
								
									 var oFilter = new sap.ui.model.Filter("Name1",sap.ui.model.FilterOperator.Contains,sValue);
							         var oFilter2 = new sap.ui.model.Filter("Kunnr",sap.ui.model.FilterOperator.Contains,sValue);
							         
							         var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
									oEvent.getSource().getBinding("items")
											.filter([ oFilter1 ]);
								},
								confirm : [ this._handleTypeJKDealClose, this ],
								cancel : [ this._handleTypeJKDealClose, this ]
							});
					_valueHelprJKDealSelectDialog.setModel(jModel);
					_valueHelprJKDealSelectDialog.open();
				},
				_handleTypeJKDealClose : function(oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						this.getView().byId("idDelar").setValue(
								oSelectedItem.getTitle());
						debugger
						var obj=oSelectedItem.getBindingContext().getObject();
						this.getView().byId("idStreet").setValue(obj.Street);
						this.getView().byId("iddelCity").setValue(obj.City1);
						this.getView().byId("iddelDist").setValue(obj.City2);
						this.getView().byId("idDealPos").setValue(obj.Post_code1);
						this.getView().byId("idDealMobil").setValue(obj.Tel_number);
						this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
						
					}

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
				validateCharacter : function( oEvent ){
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
					
					IteamCodeTyre:function(evt){
						//this.TyreTypeCode=evt.getSource().getParent();
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq 'TYRE' and IClaimType eq '"+this.ClaimType+"' and IRecvDepo eq '"+this.RecDepoType+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Tyre Code",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{ItemDescr}",
													description:"{ItemCode}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{ItemCode}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"ItemDescr",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleTyreJKDealClose, this ],
									cancel : [ this._handleTyreJKDealClose, this ]
								});
						_valueHelpTyreSelectDialog.setModel(jModel);
						_valueHelpTyreSelectDialog.open();
					},
					_handleTyreJKDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							that.getView().byId("idTyreCode").setValue(
									oSelectedItem.getDescription());
							debugger
							var obj=oSelectedItem.getBindingContext().getObject();
							that.getView().byId("idTyreodeDsc").setValue(obj.ItemDescr);
							that.getView().byId("idTyrePdc").setValue(obj.PrdtCat);
							that.getView().byId("idTyrePdcds").setValue(obj.PrdtCatDesc);
							
							//this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							
						}

					},
					IteamCodeTube:function(evt){
						//this.TyreTypeCode=evt.getSource().getParent();
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq 'TUBE' and IClaimType eq '"+this.ClaimType+"' and IRecvDepo eq '"+this.RecDepoType+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Tube Code",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{ItemDescr}",
													description:"{ItemCode}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{ItemCode}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"ItemDescr",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleTubeJKDealClose, this ],
									cancel : [ this._handleTubeJKDealClose, this ]
								});
						_valueHelpTyreSelectDialog.setModel(jModel);
						_valueHelpTyreSelectDialog.open();
					},
					_handleTubeJKDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							that.getView().byId("idTubeCode").setValue(
									oSelectedItem.getDescription());
							debugger
							var obj=oSelectedItem.getBindingContext().getObject();
							that.getView().byId("idTubePdc").setValue(obj.ItemDescr);
							
							
							//this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							
						}

					},
					InsGpCodeHelp:function(evt){
						//this.TyreTypeCode=evt.getSource().getParent();
						var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspCodeGroupSet?$filter=ClaimItemType eq '"+that.data.d.ItemType+"'and ClaimTyp eq '"+that.data.d.ClaimTyp+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Group Code",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{CodeGrpTxt}",
													description:"{CodeGrp}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{CodeGrp}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"CodeGrpTxt",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleFLAPJKDealClose, this ],
									cancel : [ this._handleFLAPJKDealClose, this ]
								});
						_valueHelpTyreSelectDialog.setModel(jModel);
						_valueHelpTyreSelectDialog.open();
					},
					_handleFLAPJKDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							that.getView().byId("idMajorCdGp").setValue(
									oSelectedItem.getDescription());
							that.getView().byId("idinsMjDc").setEnabled(true).setValue();
							this.CodeGrop=oSelectedItem.getDescription();
							
						}

					},
					InsGpCodeHelp1:function(evt){
						//this.TyreTypeCode=evt.getSource().getParent();
						var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspCodeGroupSet?$filter=ClaimItemType eq '"+that.data.d.ItemType+"'and ClaimTyp eq '"+that.data.d.ClaimTyp+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTyreSelectDialog1 = new sap.m.SelectDialog(
								{

									title : "Select Group Code",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{CodeGrpTxt}",
													description:"{CodeGrp}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{CodeGrp}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"CodeGrpTxt",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleFLAPJKDealClose1, this ],
									cancel : [ this._handleFLAPJKDealClose1, this ]
								});
						_valueHelpTyreSelectDialog1.setModel(jModel);
						_valueHelpTyreSelectDialog1.open();
					},
					_handleFLAPJKDealClose1 : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							that.getView().byId("idMinrGp").setValue(
									oSelectedItem.getDescription());
//							that.getView().byId("idinsMjDc").setEnabled(true).setValue();
							this.CodeGrop=oSelectedItem.getDescription();
							
						}

					},
					InsMjDCodeHelp:function(evt){
						//this.TyreTypeCode=evt.getSource().getParent();
						var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspDefectSet?$filter=CodeGrp eq '"+this.CodeGrop+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Major Defect Code",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{DefectTxt}",
													description:"{Defect}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{Defect}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"Defect",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handlemajDealClose, this ],
									cancel : [ this._handlemajDealClose, this ]
								});
						_valueHelpTyreSelectDialog.setModel(jModel);
						_valueHelpTyreSelectDialog.open();
					},
					_handlemajDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							that.getView().byId("idinsMjDc").setValue(
									oSelectedItem.getDescription());
							that.getView().byId("idinsMnDc").setEnabled(true).setValue();
							this.MajorCode=oSelectedItem.getDescription();
							
						}

					},
					InsMnDCodeHelp:function(evt){
						//this.TyreTypeCode=evt.getSource().getParent();
						var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspDefectSet?$filter=CodeGrp eq '"+this.CodeGrop+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Minar Defect Code",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{DefectTxt}",
													description:"{Defect}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{Defect}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"Defect",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handlemnDealClose, this ],
									cancel : [ this._handlemnDealClose, this ]
								});
						_valueHelpTyreSelectDialog.setModel(jModel);
						_valueHelpTyreSelectDialog.open();
					},
					_handlemnDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							that.getView().byId("idinsMnDc").setValue(
									oSelectedItem.getDescription());
							
							this.MinorCode=oSelectedItem.getDescription();
							
						}

					},

					onInspCreate:function(){
						
						debugger
						
						var check = false;
						
						var RecDepo = this.RecDepoType;
						var ClaimNo = this.getView().byId("idClaimno").getValue();
						var Owner   = this.getView().byId("idOwner").getSelectedKey();
						
						
						if(RecDepo == "" || RecDepo == undefined){
							check = true;
							this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
							this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.None);			
						}	
						
						if(ClaimNo == ""){
							check = true;
							this.getView().byId("idClaimno").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
							this.getView().byId("idClaimno").setValueState(sap.ui.core.ValueState.None);			
						}	
						
						if(Owner == ""){
							check = true;
							this.getView().byId("idOwner").addStyleClass("myStateError");
						}
						else {
							this.getView().byId("idOwner").removeStyleClass("myStateError");			
						}							
						
						
						return;
						
						var vehicleModel=that.getView().byId("idTyreVmodel").getValue();
						var RegistrationNo=that.getView().byId("idTyreRgNo").getValue();
						var ChassisNo=that.getView().byId("idTyreChNo").getValue();
						var NSD=that.getView().byId("idTyreNsd").getValue();
						var MajorDefect=that.getView().byId("idinsMjDc").getValue();
						var CodeGroup=that.getView().byId("idinsCdGp").getValue();
						var DisposalDecision=that.getView().byId("idInsDD").getSelectedKey();
						var AdjustmentMode=that.getView().byId("idInsAdjm").getSelectedKey();
						var AwardMode=that.getView().byId("idInsAwdm").getSelectedKey();
						var ApprovalReason=that.getView().byId("idInsAppRsen").getSelectedKey();
						var RejectionReason=that.getView().byId("idInsRegRes").getSelectedKey();
						var TubeVendorCode=that.getView().byId("idTube_venCode").getValue();
						var TubeModuleNo=that.getView().byId("idMDNo").getValue();
						var TubeProMonth=that.getView().byId("idPdMonTubeinsp").getValue();
						var policyDocumentNumber = this.getView().byId("idPolicyDoc").getValue();
						
						
						
						
						
						
						
						
						
					if(that.data.d.ItemType=="TYRE"){
						if(that.claimTyp!="ND"){
						if(NSD==""){sap.m.MessageBox.show("Enter NSD", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
						return
					}
						}
					}else{
						if(parseFloat(that.getView().byId("idInsDic").getValue())>0){
							
						}else{
							sap.m.MessageBox.show("Enter Revised Discount", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
							return
						}
						if(TubeVendorCode==""){
							sap.m.MessageBox.show("Enter Vendor Code", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
							return
						}
						if(TubeModuleNo==""){
							sap.m.MessageBox.show("Enter Mould No", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
							return
						}
						if(TubeProMonth==""){
							sap.m.MessageBox.show("Enter Product Month", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
							return
						}
						if(TubeProMonth.length==4){
			    			var date =new Date();
			    			var month=date.getMonth()+1;
			    			var year=date.getYear().toString().slice(-2);
			    			var selMonth=TubeProMonth.substring(0, 2);
			    			var selYear=TubeProMonth.slice(-2);
			    			if(selYear>year){
			    				sap.m.MessageToast.show("Cannot select Future Year");
			    				evt.getSource().setValue();
			    				return
			    			}
			    			if(selMonth>"12"){
		    					sap.m.MessageToast.show("Cannot select Future Month");
			    				evt.getSource().setValue();
			    				return
		    				}
			    			if(selYear==year){
			    				if(selMonth>month ||selMonth>"12"){
			    					sap.m.MessageToast.show("Cannot select Future Month");
				    				evt.getSource().setValue();
				    				return
			    				}
			    				
			    			}
			    			
			    		}else{
			    			sap.m.MessageToast.show("Invalid Production Month and Year");
		    				evt.getSource().setValue();
		    				return
			    		}
					}	
					if(CodeGroup==""){sap.m.MessageBox.show("Enter Code Group", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
					return
				}
					if(MajorDefect==""){sap.m.MessageBox.show("Enter Major Defect", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
					return
				}
					
					if(that.claimTyp=="ND"){
						if(that.getView().byId("idinspSkuClass").getSelectedKey()==""){sap.m.MessageBox.show("Select SKU Class", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
						return
					}
						if(that.getView().byId("idins_Batch").getValue()==""){sap.m.MessageBox.show("Enter Batch", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
						return
					}
						if(that.getView().byId("idinsp_furRevDis").getValue()==""){sap.m.MessageBox.show("Revised Discount", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
						return
					}
if(parseFloat(that.getView().byId("idinsp_furRevDis").getValue())>0){
							
						}else{
							sap.m.MessageBox.show("Enter Revised Discount", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
							return
						}
					}
					
					if(DisposalDecision==""){sap.m.MessageBox.show("Select Disposal Decision", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
					return
				}
					if(DisposalDecision=="A"){
					if(AdjustmentMode==""){
						sap.m.MessageBox.show("Select Adjustment Mode", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
						return
					}if(AwardMode==""){
						sap.m.MessageBox.show("Select Award Mode", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
						return
					}
				}else if(DisposalDecision=="R"){
					if(RejectionReason==""){sap.m.MessageBox.show("Select Rejection Reason", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
						return
					}
				}else if(DisposalDecision=="AP"){
					if(ApprovalReason==""){
						sap.m.MessageBox.show("Select Approval Reason", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
						return
					}
				}


var Data={};

Data.InspDate=that.DateNew(null);
Data.InspCode=that.data.d.InspCode
Data.InspectName=that.data.d.InspectName
Data.ClaimNo=that.data.d.ClaimNo
Data.ClaimTyp=that.data.d.ClaimTyp
Data.ClaimDate=that.data.d.ClaimDate 
Data.ClaimRecDepo=that.data.d.ClaimRecDepo
Data.TicketNo=that.data.d.TicketNo
Data.TicketDate=that.data.d.TicketDate 
Data.FitType=that.data.d.FitType
Data.CustType=that.data.d.CustType
Data.CustomerTelf1=that.data.d.CustomerTelf1
Data.CustomerFname=that.data.d.CustomerFname
Data.CustomerLname=that.data.d.CustomerLname
Data.DealerCode=that.data.d.DealerCode
Data.SalesInvNo=that.data.d.SalesInvNo
if(that.data.d.SalesInvDt!="" && that.data.d.SalesInvDt!=undefined)
Data.SalesInvDt=that.data.d.SalesInvDt
Data.SalesDepot=that.data.d.SalesDepot
Data.SoldToParty=that.data.d.SoldToParty
Data.CompanyName=that.data.d.CompanyName
Data.FranhiseName=that.data.d.FranhiseName
Data.FranhiseContact=that.data.d.FranhiseContact
Data.ItemType=that.data.d.ItemType
Data.ItemCode=that.data.d.ItemCode
Data.ItemDesc=that.data.d.ItemDesc
Data.StnclNumber=that.data.d.ClaimTyp=="TYRE"?"":that.getView().byId("idTyreStnTube").getValue();
Data.MouldNo=that.data.d.MouldNo
//Data.OldMatDescr=that.data.d.OldMatDescr
Data.PrdtCat=that.data.d.PrdtCat
//Data.PrdtCatDescr=that.data.d.PrdtCatDesc
//Data.SubmNor=that.data.d.SubmNo
Data.TlyFlg=that.data.d.TlyFlg
//Data.SubmReasonr=that.data.d.SubmReason
Data.ManfPlnt=that.data.d.ManfPlnt
//Data.VehMaker=that.data.d.VehMaker
Data.VehModel=that.getView().byId("idTyreVmodel").getValue();
Data.RegNo=that.getView().byId("idTyreRgNo").getValue();
Data.ChassisNo=that.getView().byId("idTyreChNo").getValue();
Data.CodeGrp=that.CodeGrop;
Data.MajorDefect=that.MajorCode;
Data.MinorDefect=that.MinorCode;
Data.SkuClass=this.getView().byId("idinspSkuClass").getSelectedKey();
Data.Charg=this.getView().byId("idins_Batch").getValue();
Data.Nsd=NSD;
Data.TotalNsd=that.getView().byId("idTyreTNSD").getValue()
Data.PercentageWear=that.data.d.PercentageWear;
Data.AbsoluteDis=that.getView().byId("idTyreDis").getValue()==""?"0.00":that.getView().byId("idTyreDis").getValue();
if(that.data.d.RevisedDis!="" && that.data.d.RevisedDis!=undefined)
Data.RevisedDis=that.data.d.RevisedDis;
Data.VendorCode=that.data.d.ItemType=="TYRE"? "":that.vendorcc;
Data.VendorName=that.data.d.ItemType=="TYRE"? "":that.vendorName;
Data.PrdMonth=that.data.d.ItemType=="TYRE"?that.data.d.PrdMonth:this.getView().byId("idPdMonTube").getValue();
Data.PrdYear=that.data.d.ItemType=="TYRE"?that.data.d.PrdYear:this.getView().byId("idProdYearTube").getValue();
Data.PrdInspMark=this.getView().byId("idins_insMrk").getValue();
Data.QltInspMark=this.getView().byId("idins_mark").getValue();
Data.BuilderMark=this.getView().byId("idinsp_bldmrk").getValue();
Data.DisposlDecision=DisposalDecision;
Data.AdjustmentMode=AdjustmentMode
Data.ApprovalReason=ApprovalReason
Data.RejectionReason=RejectionReason;
Data.AwardMode=AwardMode;
Data.Vbeln="";
Data.SalesOrderFlg="";
Data.FinalAmtDis=that.data.d.FinalAmtDis;
Data.PolicyNo=that.getView().byId("idInsPlc").getValue();
Data.PolicyDiscount=that.data.d.PolicyDiscount;
Data.PolicyDocument = policyDocumentNumber;
Data.ReplaceItemCode=that.data.d.ReplaceItemCode;
if(that.data.d.WrntReqFlag!="" && that.data.d.WrntReqFlag!=undefined)
Data.WrntReqFlag=that.data.d.WrntReqFlag;
Data.EarlyFailure=that.loEarlyFailure;
Data.Application=that.loApplication ;
Data.Route = that.loRoute;
if(that.loLeadKms!=""&&that.loLeadKms!=undefined)
Data.LeadKms = that.loLeadKms;
if(that.loSpeed!=""&&that.loSpeed!=undefined)
Data.Speed = that.loSpeed;
Data.Mfg = that.loConMfg;
Data.Gvw = that.loGvw;
Data.FitmentPos = that.loFitment;
Data.RimProfile = that.loRimProfile;
if(that.loPsi!="" && that.loPsi!=undefined)
Data.Psi = that.loPsi;
Data.Payload = that.loPayload;
//Data.InspApprover
//Data.InspApproverDt





var sServiceUrl = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/";
var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
//oCreateModel1.setHeaders({
//	"Content-Type": "application/atom+xml"
//	});
var fncSuccess = function(oData, oResponse) //sucess function 
	{
//	sap.m.MessageBox.show("Ticket:"+oData.ETicketNo+" Updated", {
//        title: "Success",
//        icon:sap.m.MessageBox.Icon.SUCCESS,
//        onClose:function(){
//        	window.history.back();
//        	
//    			
//        }
//    });
var _self = that;
	if(oData.EError=="X"){
		sap.m.MessageBox.show(oData.EMessage, {
	        title: "Error",
	        icon:sap.m.MessageBox.Icon.ERROR,
	        onClose:function(){
	        	
	        	
	    			
	        }
	    });	
	}else{
		if(that.loEarlyFailure)
			{
				var loInspecNumber = oData.InspNo;
				var loEMessage = oData.EMessage;
				
			var loImageDialogue = new sap.m.Dialog({
				title:'Confirm',
				type:'Message',
				content:[
				         new sap.m.Label({
				        	 text:"Do you want to attach images?"
				         })
				         ],
				         beginButton: new sap.m.Button({
				        	 text:'Yes',
				        	 enabled:true,
				        	 press:function()
				        	 {
				        	 	var _self1 = _self;
				        		var loItemTemplate = new sap.m.UploadCollectionItem({
	     				        	 visibleEdit:false,
	     				        	 visibleDelete:false
	     				         });
				        		 var loAttachmentDialogue = new sap.m.Dialog({
				     				title:'Confirm',
				     				type:'Message',
				     				content:[
				     				         new sap.m.UploadCollection("fileUpload",{
				     				        	 showSeperators:'All',
				     				        	 maximumFileNameLength:'50',
				     				        	 multiple:false,
				     				        	visibleEdit:false,
				     				        	 visibleDelete:false,
				     				        	 fileType:["jpeg","jpg"],
				     				        	 noDataText:'No Data',
				     				        	 uploadUrl:'/sap/opu/odata/sap/ZCS_INSPECTION_SRV/EarlyFailureImageUploadSet',
				     				        	 change:function(e){
													  var m = _self1.getView().getModel();
												        var u = e.getSource();
												        var f = e
												          .getParameter("mParameters").files[0];
												        var t = _self1.sToken
												          || m.getSecurityToken();
												        u.removeAllHeaderParameters();
												        if(e.oSource.aItems.length == 0)
												        	var n = loInspecNumber+"@1";
												        else if(e.oSource.aItems.length == 1)
													        var n = loInspecNumber+"@2";
													    else
													       	var n = loInspecNumber+"@3";
        var c = new sap.m.UploadCollectionParameter(
          {
           name : "slug",
           value : n
          });
        u.addHeaderParameter(c);
         var C = new
         sap.m.UploadCollectionParameter({
         name : "x-csrf-token",
         value : t
         });
        u.addHeaderParameter(C);
        var o = new sap.m.UploadCollectionParameter(
          {
           name : "content-type",
           value : "image/jpeg"
          });
        u.addHeaderParameter(o);
				     				        	 },
				     				        	 uploadComplete:function(e){
				     				        		 var loUpload = sap.ui.getCore().byId("fileUpload");
				     				        		 loUpload.aItems[0].setVisibleEdit(false);
				     				        		loUpload.aItems[0].setVisibleDelete(false);
													     var m = _self1.getView().getModel();
        var p = "/EarlyFailureImageUploadSet";
          
        var t = _self1.getView();
        m
          .read(
            p,
            null,
            false,
            function(b, r) {
             var d = {
              Attachments : []
             };
             var l = r.data.results.length;
             for (var i = 0; i < l; i++) {
              var v = r.data.results[i];
              var U = v.__metadata.media_src; 
              var m = U
                .match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
              var Url = m[5];
              var o = {
               name : v.Filename1,
               url : Url,
               fileId : v.Filename,
              };
              d.Attachments
                .unshift(o);
             }
             t
               .byId(
                 'fileupload')
               .setModel(
                 new sap.ui.model.json.JSONModel(
                   d));

            }, 
            function(b, r) {
             if(r.statusText === "OK"){
                 var d = {
                  Attachments : []
                 };
                 var l = r.data.results.length;
                 for (var i = 0; i < l; i++) {
                  var v = r.data.results[i];
                  var U = v.__metadata.media_src;
                  var m = U
                    .match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
                  var Url = m[5];
                  var o = {
                   name : v.Filename1,
                   url : Url,
                   fileId : v.Filename,
                  };
                  d.Attachments
                    .unshift(o);
                 }
                 t
                   .byId(
                     'fileupload')
                   .setModel(
                     new sap.ui.model.json.JSONModel(
                       d));
            }
                }
            );
				     				        	 },
				     				        	
				     				         }),
				     				         
				     				         ],
				     				         beginButton: new sap.m.Button({
				     				        	 text:'Ok',
				     				        	 enabled:true,
				     				        	 press:function()
				     				        	 {
				     				        		loAttachmentDialogue.close();
				     				        		sap.m.MessageBox.show(loEMessage, {
				     				        	        title: "Success",
				     				        	        icon:sap.m.MessageBox.Icon.SUCCESS,
				     				        	        onClose:function(){
				     				        	        	if(oData.DisposlDecision=="A" && oData.SalesOrderFlg=="X"){
				     				        	        		sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspOutputFormSet(InspNo='"+loInspecNumber+"')/$value", true);	
				     				        	        	}
				     				        	        	window.history.back();
				     				        	        	
				     				        	    			
				     				        	        }
				     				        	    });
				     				        		
				     				        	 }
				     				         }),
				     				         endButton: new sap.m.Button({
				     				        	 text:'Cancel',
				     				        	 enabled:true,
				     				        	 press:function()
				     				        	 {
				     				        		loAttachmentDialogue.close();
				     				        		sap.m.MessageBox.show(loEMessage, {
				     				        	        title: "Success",
				     				        	        icon:sap.m.MessageBox.Icon.SUCCESS,
				     				        	        onClose:function(){
				     				        	        	if(oData.DisposlDecision=="A" && oData.SalesOrderFlg=="X"){
				     				        	        		sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspOutputFormSet(InspNo='"+loInspecNumber+"')/$value", true);	
				     				        	        	}
				     				        	        	window.history.back();
				     				        	        	
				     				        	    			
				     				        	        }
				     				        	    });
				     				        	 }
				     				         }),
				     				         afterClose:function()
				        						 {
				         							loAttachmentDialogue.destroy();
				         						 }
				     			})
				     			loAttachmentDialogue.open();
				        		 loImageDialogue.close();
				        	 }
				         }),
				         endButton: new sap.m.Button({
				        	 text:'No',
				        	 enabled:true,
				        	 press:function()
				        	 {
				        		 loImageDialogue.close();
				        		 sap.m.MessageBox.show(oData.EMessage, {
				        		        title: "Success",
				        		        icon:sap.m.MessageBox.Icon.SUCCESS,
				        		        onClose:function(){
				        		        	if(oData.DisposlDecision=="A" && oData.SalesOrderFlg=="X"){
				        		        		sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspOutputFormSet(InspNo='"+oData.InspNo+"')/$value", true);	
				        		        	}
				        		        	window.history.back();
				        		        	
				        		    			
				        		        }
				        		    });
				        	 }
				         }),
				         afterClose:function()
				         {
				         	loImageDialogue.destroy();
				         }
			})
			loImageDialogue.open();
			that.loEarlyFailure = false;
			}
			else
			{
				sap.m.MessageBox.show(oData.EMessage, {
        title: "Success",
        icon:sap.m.MessageBox.Icon.SUCCESS,
        onClose:function(){
        	if(oData.DisposlDecision=="A" && oData.SalesOrderFlg=="X"){
        		sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspOutputFormSet(InspNo='"+oData.InspNo+"')/$value", true);	
        	}
        	window.history.back();
        	
    			
        }
    });
			}
	
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
oCreateModel1.create("/SaveInspectionSet", Data, {
	success: fncSuccess,
	error: fncError
});




					},
					onDecisionChange:function(evt){
						var key=evt.getSource().getSelectedKey();
						if(key=="A"){
							that.getView().byId("idInsAdjm").setEnabled(true).setSelectedKey();
							that.getView().byId("idInsAwdm").setEnabled(true).setSelectedKey();
							that.getView().byId("idInsAppRsen").setEnabled(false).setSelectedKey();
							that.getView().byId("idInsRegRes").setEnabled(false).setSelectedKey();	
						}else if(key=="R"){
							that.getView().byId("idInsAdjm").setEnabled(false).setSelectedKey();
							that.getView().byId("idInsAwdm").setEnabled(false).setSelectedKey();
							that.getView().byId("idInsAppRsen").setEnabled(false).setSelectedKey();
							that.getView().byId("idInsRegRes").setEnabled(true).setSelectedKey();
						}else if(key=="AP"){
							that.getView().byId("idInsAdjm").setEnabled(false).setSelectedKey();
							that.getView().byId("idInsAwdm").setEnabled(false).setSelectedKey();
							that.getView().byId("idInsAppRsen").setEnabled(true).setSelectedKey();
							that.getView().byId("idInsRegRes").setEnabled(false).setSelectedKey();
						}
					},
					onAwardChange:function(evt){
						var key=evt.getSource().getSelectedKey();
						if(key=="POL" ||key=="TEC"){
							if(that.data.d.ItemType=="TYRE"){
								if(that.claimTyp!="ND"){
								that.getView().byId("idInsPlc").setShowValueHelp(true);
								that.getView().byId("idInsPlc").setEnabled(true)
								}
							}else{
								that.getView().byId("idInsPlc").setShowValueHelp(false);	
							}
							
							
						}else {
							that.getView().byId("idInsPlc").setEnabled(false)
						}
					},
					InsPolicyHelp:function(){
						var prdMonth=this.getView().byId("idPdMon").getValue();
					var url="/sap/opu/odata/sap/ZCS_INSPECTION_SRV/GetPolicyMasterSet?$filter=IClaimRecDepo eq '"+that.data.d.ClaimRecDepo+"' and IClaimTyp eq '"+that.data.d.ClaimTyp+"' and ICodeGrp eq '"+that.CodeGrop+"' and IDealerCode eq '"+that.data.d.DealerCode+"' and IInspDate eq datetime'"+that.DateNew(null)+"' and IItemCode eq '"+that.data.d.ItemCode+"' and IMajorDefect eq '"+that.MajorCode+"' and IPrdtCat eq '"+that.data.d.PrdtCat+"' and IPrdMonth eq '"+prdMonth+"' and IPrdYear eq '"+that.data.d.PrdYear+"' and IWear eq "+that.getView().byId("idTyreWear").getValue()+"m"	
					var jModel = new sap.ui.model.json.JSONModel();
			 		jModel.loadData(url, null, false,"GET",false, false, null);
	 	    var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({
	 	    	
	 	        title: "Policy No",
	 	        items: {
	 	            path: "/d/results",
	 	            template: new sap.m.StandardListItem({
	 	                title: "Policy No: {PolicyNo}",
	 	               description:"Document: {PolicyDocument}",
	 	                customData: [new sap.ui.core.CustomData({
	 	                    key: "key",
	 	                    value: "{ReplaceItemCode}"
	 	                })],
	 	               
	 	            }),
	 	        },
	 	        liveChange: function(oEvent) {
	 	            var sValue = oEvent.getParameter("value");
	 	            var oFilter = new sap.ui.model.Filter("Nsd",sap.ui.model.FilterOperator.Contains,sValue);
	 	            oEvent.getSource().getBinding("items").filter([oFilter]);
	 	        },
	 	        confirm: [this._handlepolClose, this],
	 	        cancel: [this._handlepolClose, this]
	 	    });
	 	    _valueHelpFranchSelectDialog.setModel(jModel);
	 	   _valueHelpFranchSelectDialog.open();	
	    	},
	    	_handlepolClose: function(oEvent) {
	    	    var oSelectedItem = oEvent.getParameter("selectedItem");
	    	    if (oSelectedItem) {
	    	        
	    	    	this.getView().byId("idInsPlc").setValue(oSelectedItem.getBindingContext().getObject().PolicyNo);
	    	        this.getView().byId("idInsPlcDis").setValue(oSelectedItem.getBindingContext().getObject().Discount);
	    	        this.getView().byId("idInsRepItm").setValue(oSelectedItem.getBindingContext().getObject().ReplaceItemCode);
	    	        this.getView().byId("idInsWar").setSelected(oSelectedItem.getBindingContext().getObject().WrntReqFlag);
	    	        this.getView().byId("idPolicyDoc").setValue(oSelectedItem.getBindingContext().getObject().PolicyDocument);
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
					
			    	onFranch:function(){
			    		 var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpNsdTyreSet?$filter=ItemCode eq '"+that.data.d.ItemCode+"' and PrdtCat eq '"+that.data.d.PrdtCat+"'";
					 		var jModel = new sap.ui.model.json.JSONModel();
					 		jModel.loadData(sPath, null, false,"GET",false, false, null);
			 	    var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({
			 	    	
			 	        title: "NSD",
			 	        items: {
			 	            path: "/d/results",
			 	            template: new sap.m.StandardListItem({
			 	                title: "NSD: {Nsd}",
			 	               description:"% Wear:{PercentageWear}",
			 	                customData: [new sap.ui.core.CustomData({
			 	                    key: "Key",
			 	                    value: "{PercentageWear}"
			 	                })],
			 	               
			 	            }),
			 	        },
			 	        liveChange: function(oEvent) {
			 	            var sValue = oEvent.getParameter("value");
			 	            var oFilter = new sap.ui.model.Filter("Nsd",sap.ui.model.FilterOperator.Contains,sValue);
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
			    	        
			    	        this.getView().byId("idTyreNsd").setValue(oSelectedItem.getBindingContext().getObject().Nsd);
			    	        this.getView().byId("idTyreWear").setValue(oSelectedItem.getBindingContext().getObject().PercentageWear);
			    	        this.getView().byId("idTyreTNSD").setValue(oSelectedItem.getBindingContext().getObject().TotNsd);
			    	        this.getView().byId("idTyreDis").setValue(100-oSelectedItem.getBindingContext().getObject().PercentageWear);
			    	        this.getView().byId("idInsFDis").setValue(100-oSelectedItem.getBindingContext().getObject().PercentageWear);
			    	        if(parseFloat(oSelectedItem.getBindingContext().getObject().PercentageWear)<25){
			    	        	that.getView().byId("Id_EntButton").setVisible(true);
			    	        	that.loEarlyFailure = true;
			    	        }else{
			    	        	that.getView().byId("Id_EntButton").setVisible(false);
			    	        }
			    	    }
			      
			    	},
			    	onVend:function(){
			    		 var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpVendorTubeFlapSet";
					 		var jModel = new sap.ui.model.json.JSONModel();
					 		jModel.loadData(sPath, null, false,"GET",false, false, null);
			 	    var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({
			 	    	
			 	        title: "Vendor",
			 	        items: {
			 	            path: "/d/results",
			 	            template: new sap.m.StandardListItem({
			 	                title: "{VendorName}",
			 	               description:"{VendorCode}",
			 	                customData: [new sap.ui.core.CustomData({
			 	                    key: "Key",
			 	                    value: "{VendorCode}"
			 	                })],
			 	               
			 	            }),
			 	        },
			 	        liveChange: function(oEvent) {
			 	            var sValue = oEvent.getParameter("value");
			 	            var oFilter = new sap.ui.model.Filter("VendorName",sap.ui.model.FilterOperator.Contains,sValue);
			 	            oEvent.getSource().getBinding("items").filter([oFilter]);
			 	        },
			 	        confirm: [this._handlefranchClose1, this],
			 	        cancel: [this._handlefranchClose1, this]
			 	    });
			 	    _valueHelpFranchSelectDialog.setModel(jModel);
			 	   _valueHelpFranchSelectDialog.open();	
			    	},
			    	_handlefranchClose1: function(oEvent) {
			    	    var oSelectedItem = oEvent.getParameter("selectedItem");
			    	    if (oSelectedItem) {
			    	        
			    	        this.getView().byId("idTube_venCode").setValue(oSelectedItem.getTitle()+" ("+oSelectedItem.getDescription()+")");
			    	    that.vendorcc=oSelectedItem.getDescription();
			    	    that.vendorName=oSelectedItem.getTitle();
			    	    this.getView().byId("idTyreMfPTube").setValue(oSelectedItem.getTitle()); 
			    	    var stencile= that.vendorcc+that.getView().byId("idMDNo").getValue()+that.getView().byId("idPdMonTubeinsp").getValue();
	    				that.getView().byId("idTyreStnTube").setValue(stencile);
			    	    }
			      
			    	},
			    	onProdMonth:function(evt){
			    		var value=evt.getSource().getValue();
			    		if(value.length==4){
			    			var date =new Date();
			    			var month=date.getMonth()+1;
			    			var year=date.getYear().toString().slice(-2);
			    			var selMonth=value.substring(0, 2);
			    			var selYear=value.slice(-2);
			    			if(selYear>year){
			    				sap.m.MessageToast.show("Cannot select Future Year");
			    				evt.getSource().setValue();
			    				return
			    			}
			    			if(selMonth>"12"){
		    					sap.m.MessageToast.show("Cannot select Future Month");
			    				evt.getSource().setValue();
			    				return
		    				}
			    			if(selYear==year){
			    				if(selMonth>month ||selMonth>"12"){
			    					sap.m.MessageToast.show("Cannot select Future Month");
				    				evt.getSource().setValue();
				    				return
			    				}
			    				else{
			    					var stencile= that.vendorcc+that.getView().byId("idMDNo").getValue()+value;
				    				that.getView().byId("idTyreStnTube").setValue(stencile);
			    				that.getView().byId("idPdMonTube").setValue(selMonth);	
			    				that.getView().byId("idProdYearTube").setValue(selYear);	
			    				}
			    			}else{
			    				var stencile= that.vendorcc+that.getView().byId("idMDNo").getValue()+value;
			    				that.getView().byId("idTyreStnTube").setValue(stencile);
			    				that.getView().byId("idPdMonTube").setValue(selMonth);	
			    				that.getView().byId("idProdYearTube").setValue(selYear);	
			    			}
			    			
			    		}else{
			    			sap.m.MessageToast.show("Select proper month and Dates");
		    				evt.getSource().setValue();
		    				return
			    		}
			    		
			    	},
			    	onPolicyDoc : function()
					{
						var docNumber = this.getView().byId("idPolicyDoc").getValue();
						sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DisplayDMSDocumentSet(DocNo='"+docNumber+"')/$value", true);
					},
			    	onFragment:function(){
			    		if (!this._EntriesHelpDialog) {
							this._EntriesHelpDialog = sap.ui.xmlfragment(
								"com.acute.insp.view.Entries", this);
							this.getView().addDependent(this._EntriesHelpDialog);
							
						}
			    		this._EntriesHelpDialog.open();
			    	},
			    	onTabelFilterOk : function(evt)
			    	{
			    		debugger;
			    		that.loApplication = sap.ui.getCore().byId("idEarApp").getValue();
			    		that.loRoute = sap.ui.getCore().byId("idEarRou").getValue();
			    		that.loLeadKms = sap.ui.getCore().byId("idEarLed").getValue();
			    		that.loSpeed = sap.ui.getCore().byId("idEarSped").getValue();
			    		that.loConMfg = sap.ui.getCore().byId("idEarCon").getValue();
			    		that.loGvw = sap.ui.getCore().byId("idEarGvw").getValue();
			    		that.loFitment = sap.ui.getCore().byId("idEarFpos").getSelectedKey();
			    		that.loRimProfile = sap.ui.getCore().byId("idEarRim").getValue();
			    		that.loPsi = sap.ui.getCore().byId("idEarPSI").getValue();
			    		that.loPayload = sap.ui.getCore().byId("idEarPay").getValue();
			    		this._EntriesHelpDialog.close();
			    	},
			    	onModuleSubmit:function(){
			    		var stencile= that.vendorcc+that.getView().byId("idMDNo").getValue()+that.getView().byId("idPdMonTubeinsp").getValue();;
	    				that.getView().byId("idTyreStnTube").setValue(stencile);
			    	},
			    	onReviseDis:function(evt){
			    		var value=evt.getSource().getValue();
			    		if(parseFloat(value)>100){
			    			sap.m.MessageToast.show("Value Cannot be more than 100");
			    			evt.getSource().setValue()
			    			return
			    		}var finalvalue=100-parseFloat(value);
			    		that.getView().byId("idWeInsp").setValue(finalvalue);
			    		that.getView().byId("idInsFDis").setValue(value);
			    		
			    	}

				});
});