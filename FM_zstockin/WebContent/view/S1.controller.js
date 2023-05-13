jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

var that, kunnr, hubName, EnrolMode, Mjahr, plant, oDate;

sap.ui.controller("com.acute.stock.in.view.S1",
{

	onInit : function() {
						window.msgToast = sap.m.MessageToast;
						this.model = this.getOwnerComponent().getModel();
						if (!jQuery.support.touch) {
							this.getView().addStyleClass("sapUiSizeCompact");
						}
						if (sap.ui.Device.system.desktop) {

						}
						jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("com.acute.stock.in.css.style",".css"));
						var that = this;
						var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
						var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
						oReadModel.setHeaders({
							"Content-Type" : "application/json"
						});
						var fncSuccess = function(oData, oResponse) {

							if (!that._FleetDialog) {
									that._FleetDialog = sap.ui.xmlfragment("com.acute.stock.in.view.Intial", that);
									that.getView().addDependent(that._FleetDialog);
								}
							
							if(oData.results.length==0 ){
								sap.m.MessageBox.show("You are not Registered to any Fleet", {
									title : "Error",
									icon : sap.m.MessageBox.Icon.ERROR,
									onClose:function(){
										window.history.back();
									}
									});
							}else{
								that.FleetData=oData;
								
								var jModel;
								var headerText;
								var owner;
								if(that.FleetData.results.length == "1"){
									kunnr = that.FleetData.results[0].Kunnr;
									that.fromKunnr = kunnr;
									EnrolMode = that.FleetData.results[0].EnrolMode;
									if(EnrolMode == "F"){
										sap.ui.getCore().byId("idOwner").setEnabled(false);
										sap.ui.getCore().byId("idOwner").setVisible(false);
										owner = sap.ui.getCore().byId("idOwner").setSelectedKey("02");
									}else{
										sap.ui.getCore().byId("idOwner").setEnabled(true);
										sap.ui.getCore().byId("idOwner").setVisible(true);
										owner = sap.ui.getCore().byId("idOwner").setSelectedKey("");
									}
									if (owner === "01") {
										that.getView().byId("tableStock").setVisible(false);
										that.getView().byId("tableStencils").setVisible(true);
										that.getView().byId("btnStencilSave").setVisible(true);
										that.getView().byId("btnSave").setVisible(false);
									} else {
										that.getView().byId("tableStock").setVisible(true);
										that.getView().byId("tableStencils").setVisible(false);
										that.getView().byId("btnStencilSave").setVisible(false);
										that.getView().byId("btnSave").setVisible(true);
									}
									headerText = that.getView().byId("gatEntry").setText(that.FleetData.results[0].FleetName);
									var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_User_Fleet_HubSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'and CKunnr  eq '"+that.FleetData.results[0].Kunnr+"'";
									jModel = new sap.ui.model.json.JSONModel();
									jModel.loadData(sPath, null, false, "GET", false,
											false, null);
								}else{
									if (!that._FleetDialog) {
										that._FleetDialog = sap.ui.xmlfragment("com.acute.stock.in.view.Intial", that);
										that.getView().addDependent(that._FleetDialog);
									}
										that._FleetDialog.open();
								}
								if(jModel.getData().d.results.length != "1"){	
								if (!that._FleetDialog) {
									that._FleetDialog = sap.ui.xmlfragment("com.acute.stock.in.view.Intial", that);
									that.getView().addDependent(that._FleetDialog);
								}
								that._FleetDialog.open();
								}else{
									if(EnrolMode == "M"){
										if (!that._FleetDialog) {
											that._FleetDialog = sap.ui.xmlfragment("com.acute.stock.in.view.Intial", that);
											that.getView().addDependent(that._FleetDialog);
										}
											that._FleetDialog.open();
									}else{
										hubName = jModel.getData().d.results[0].HubName;
										that.fromHubCode = jModel.getData().d.results[0].HubCode;
										var finalHeaderText = that.getView().byId("gatEntry").getText() + " - " + hubName; 
										that.getView().byId("gatEntry").setText(finalHeaderText);
									}
									
								}
								
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
						oReadModel.read(
								"/User_Fleet_DetialsSet?$filter=CUname eq '"
										+ sap.ushell.Container.getService(
												"UserInfo").getId() + "'", {
									success : fncSuccess,
									error : fncError
								});

					},

					onFleetFragment : function() {
						that = this;
						var jModel = new sap.ui.model.json.JSONModel(that.FleetData);
						var _valueHelpFleetDialog = new sap.m.SelectDialog({

							title : "Select Fleet",
							items : {
								path : "/results",
								template : new sap.m.StandardListItem({
									title : "{FleetName}",
									customData : [ new sap.ui.core.CustomData({
										key : "Key",
										value : "{Kunnr}"
									}) ],

								}),
							},
							liveChange : function(oEvent) {
								var sValue = oEvent.getParameter("value");

								var oFilter = new sap.ui.model.Filter("FleetName",
																		sap.ui.model.FilterOperator.Contains,
																		sValue);
								oEvent.getSource().getBinding("items").filter([ oFilter ]);
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
							this.EnrolMode = oEvent.getParameter("selectedItem").getBindingContext().getObject().EnrolMode;
							if(this.EnrolMode == "F"){
								sap.ui.getCore().byId("idOwner").setEnabled(false);
								sap.ui.getCore().byId("idOwner").setVisible(false);
								sap.ui.getCore().byId("idOwner").setSelectedKey("02");
							}else{
								sap.ui.getCore().byId("idOwner").setEnabled(true);
								sap.ui.getCore().byId("idOwner").setVisible(true);
								sap.ui.getCore().byId("idOwner").setSelectedKey("");
							}

							var from = sap.ui.getCore().byId("idFleet").getValue();

							that.getView().byId("tableText").setText(oSelectedItem.getTitle());
							sap.ui.getCore().byId("idHub").setEnabled(true).setValue();
							sap.ui.getCore().byId("idFleet").setValue(oSelectedItem.getTitle());
							sap.ui.getCore().byId("idFleet").setName(oSelectedItem.getBindingContext().getObject().Kunnr);
							this.fromKunnr = oSelectedItem.getBindingContext().getObject().Kunnr;

						}

					},
					onHubFragment : function() {
						if(kunnr){
							var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_User_Fleet_HubSet?$filter=CUname eq '"
										+ sap.ushell.Container.getService("UserInfo").getId()
										+ "'and CKunnr  eq '"
										+ kunnr + "'";
						}else{
							var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_User_Fleet_HubSet?$filter=CUname eq '"
										+ sap.ushell.Container.getService("UserInfo").getId()
										+ "'and CKunnr  eq '"
										+ this.fromKunnr + "'";
						}
						
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,false, null);
						if (jModel.getData().d.results.length) {
							var _valueHelpHubelectDialog = new sap.m.SelectDialog(
									{

										title : "Select Hub",
										items : {
											path : "/d/results",
											template : new sap.m.StandardListItem(
													{
														title : "{HubName}",
													// description:"{HubCode}",

													}),
										},
										liveChange : function(oEvent) {
											var sValue = oEvent
													.getParameter("value");

											var oFilter = new sap.ui.model.Filter(
																					"HubName",
																					sap.ui.model.FilterOperator.Contains,
																					sValue);
											oEvent.getSource().getBinding("items").filter([ oFilter ]);
										},
										confirm : [ this._handleHubClose, this ],
										cancel : [ this._handleHubClose, this ]
									});
							_valueHelpHubelectDialog.setModel(jModel);
							_valueHelpHubelectDialog.open();
						} else {
							sap.m.MessageToast.show("Your not authorised for any Hub in Fleet "+ sap.ui.getCore().byId("idFleet").getValue())
						}
					},
					_handleHubClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {

							var from = sap.ui.getCore().byId("idHub").getValue();
							if (from != "" && from != undefined) {
								sap.ui.getCore().byId("idHub").setValue(oSelectedItem.getTitle());
								sap.ui.getCore().byId("idHub").setName(oSelectedItem.getBindingContext().getObject().HubCode);
								this.toHubCode = oSelectedItem.getBindingContext().getObject().HubCode;
							} else {
								var value = that.getView().byId("tableText").getText()+ " (" + oSelectedItem.getTitle() + ")";
								that.getView().byId("tableText").setText(value);
								sap.ui.getCore().byId("idHub").setValue(oSelectedItem.getTitle());
								sap.ui.getCore().byId("idHub").setName(oSelectedItem.getBindingContext().getObject().HubCode);
								this.fromHubCode = oSelectedItem.getBindingContext().getObject().HubCode;
							}

						}

					},
					onFleetCloseButton : function() {
						if (sap.ui.getCore().byId("idFleet").getValue() != ""
								&& sap.ui.getCore().byId("idHub").getValue() != ""
									&& sap.ui.getCore().byId("idOwner").getSelectedKey() != "") {
							var owner = sap.ui.getCore().byId("idOwner").getSelectedKey();

							var title = sap.ui.getCore().byId("idFleet").getValue()+ " - "+ sap.ui.getCore().byId("idHub").getValue();

							this.getView().byId("gatEntry").setText(title)

							if (owner === "01") {
								this.getView().byId("tableStock").setVisible(false);
								this.getView().byId("tableStencils").setVisible(true);
								this.getView().byId("btnStencilSave").setVisible(true);
								this.getView().byId("btnSave").setVisible(false);
							} else {
								this.getView().byId("tableStock").setVisible(true);
								this.getView().byId("tableStencils").setVisible(false);
								this.getView().byId("btnStencilSave").setVisible(false);
								this.getView().byId("btnSave").setVisible(true);
							}
							that._FleetDialog.close();
						} else {
							window.msgToast.show("Select Fleet and Hub and Owner")
						}

					},
					onFleetCloseCancle : function() {
						window.history.back();
					},
					
					onOwnerChange : function(evt) {
						var loc = evt.getSource().getParent().getCells()[1];
						var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
						var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
						oReadModel.setHeaders({
							"Content-Type" : "application/json"
						});
						var fncSuccess1 = function(oData, oResponse) {

							var jModel = new sap.ui.model.json.JSONModel(oData.results);
							loc.unbindAggregation("items");
							loc.setModel(jModel);
							loc.bindAggregation("items", {
								path : "/",
								template : new sap.ui.core.Item({
									key : "{NonJkCompany}",
									text : "{Text}"
								})
							});
						}
						var fncError = function(oError) { // error callback

							var parser = new DOMParser();
							var message = parser.parseFromString(
									oError.response.body, "text/xml")
									.getElementsByTagName("message")[0].innerHTML
							sap.m.MessageBox.show(message, {
								title : "Error",
								icon : sap.m.MessageBox.Icon.ERROR,
							});
						}
						oReadModel.read("/F4_NonJK_Tyre_CompanySet", {
							success : fncSuccess1,
							error : fncError
						});
						var key = evt.getSource().getSelectedKey();
						that.selectedCompanyKey = key;
						if (key == "01") {
							loc.setSelectedKey("JK");
							evt.getSource().getParent().getCells()[2].setShowValueHelp(true).setValue();
							evt.getSource().getParent().getCells()[3].setValue();
							evt.getSource().getParent().getCells()[4].setValue();
							evt.getSource().getParent().getCells()[5].setValue();
						} else {
							loc.setSelectedKey()
							evt.getSource().getParent().getCells()[3].setValue();
							evt.getSource().getParent().getCells()[4].setValue();
							evt.getSource().getParent().getCells()[5].setValue();
						}
					},
					
					onCompanyChange : function(evt) {
						var key = evt.getSource().getSelectedKey();
						evt.getSource().getParent().getCells()[2].setShowValueHelp(true).setValue();
					},
					
					onStencilHelp : function(evt) {
						that.ItemDescRow = evt.getSource();

						var kunnr = this.fromKunnr;
						var hubCode = this.fromHubCode;
						var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/StockMovementStencilSet?$filter=Kunnr  eq '"
								+ kunnr + "' and HubCode eq '" + hubCode + "'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,false, null);
						var _valueHelpStencilSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Stencil",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{StnclNumber}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "{StnclNumber}",
																value : "{StnclNumber}"
															}) ],
												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"StnclNumber",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items").filter([ oFilter ]);
									},
									confirm : [ this._handleStencilClose, this ],
									cancel : [ this._handleStencilClose, this ]
								});
						_valueHelpStencilSelectDialog.setModel(jModel);
						_valueHelpStencilSelectDialog.open();
					},
					_handleStencilClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.Stencil = oSelectedItem.getBindingContext().getObject().StnclNumber;
							this.TyreLoc = oSelectedItem.getBindingContext().getObject().TyreLoc;
							this.TyreType = oSelectedItem.getBindingContext().getObject().TyreType;

							that.ItemDescRow.setValue(oSelectedItem.getTitle());
							that.ItemDescRow.getParent().getCells()[1].setValue(oSelectedItem.getBindingContext().getObject().TypeDesc);
							that.ItemDescRow.getParent().getCells()[2].setValue(oSelectedItem.getBindingContext().getObject().LocDesc);
							that.ItemDescRow.getParent().getCells()[3].setShowValueHelp(true).setValue();
							that.ItemDescRow.getParent().getCells()[6].setValue(this.TyreType);
							that.ItemDescRow.getParent().getCells()[7].setValue(this.TyreLoc);
						}
					},
					
					onTyreTypeHelp : function(evt) {
						that.ItemDescRow = evt.getSource();

						var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/StockMovementTyreTypeSet?$filter=StencilNumber eq '"+ this.Stencil + "'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,false, null);
						var _valueHelpTyreTypeSelectDialog = new sap.m.SelectDialog(
								{
									title : "Select Tyre Type",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{TyreType}",
													description : "{Description}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "{TyreType}",
																value : "{Description}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"TyreType",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items").filter([ oFilter ]);
									},
									confirm : [ this._handleTyreTypeClose, this ],
									cancel : [ this._handleTyreTypeClose, this ]
								});
						_valueHelpTyreTypeSelectDialog.setModel(jModel);
						_valueHelpTyreTypeSelectDialog.open();
					},
					_handleTyreTypeClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.TyreType = oSelectedItem.getBindingContext().getObject().TyreType;
							this.getView().byId("idTyreType").setValue(oSelectedItem.getTitle());
							this.getView().byId("idTyreLoc").setEnabled(true);
						}
					},
					onTyreLocationHelp : function(evt) {
						that.ItemDescRow = evt.getSource();

						var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/StockMovementTyreLocationSet?$filter=StencilNumber eq '"
								+ this.Stencil
								+ "' and TyreType eq '"
								+ this.TyreType + "'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTyreLocSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Tyre Location",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{TyreLoc}",
													description : "{Description}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "{TyreLoc}",
																value : "{Description}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"TyreLoc",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items").filter([ oFilter ]);
									},
									confirm : [ this._handleTyreLocClose, this ],
									cancel : [ this._handleTyreLocClose, this ]
								});
						_valueHelpTyreLocSelectDialog.setModel(jModel);
						_valueHelpTyreLocSelectDialog.open();
					},
					_handleTyreLocClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.TyreLoc = oSelectedItem.getBindingContext()
									.getObject().TyreLoc;
							// that.ItemDescRow.setValue(oSelectedItem.getTitle());
							this.getView().byId("idTyreLoc").setValue(
									oSelectedItem.getTitle());
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
					
					
					
					addNewItem : function() {
						var _self = this;

						var url = "/sap/opu/odata/sap/ZFLEET_SRV/";
						var StancilModel = new sap.ui.model.odata.ODataModel(
								url, true);
						this.getView().setModel(StancilModel);
						var Table = this.getView().byId("tableStock");
						var templete = new sap.m.ColumnListItem(
								{
									cells : [
											new sap.m.Input(
													{   showValueHelp : true,
														valueHelpOnly : true,
														valueHelpRequest : function(e) {

															var x = _self;
															var inputSource = e.oSource;
															var company = e
																	.getSource()
																	.getParent()
																	.getCells()[7];

															_self.tyre = new sap.ui.xmlfragment(
																	"com.acute.stock.in.view.tyreCompany",
																	this);
															_self
																	.getView()
																	.addDependent(
																			_self.tyre);
															_self.tyre
																	.attachConfirm(function(e) {

																		x.tyreCompany(e,inputSource,company);
																	});
															_self.tyre.attachSearch(function(e) {
																		var sValue = e.getParameter("value");
																		var oFilter = new sap.ui.model.Filter("Input",sap.ui.model.FilterOperator.EQ,sValue);
																		e.getSource().getBinding("items").filter([ oFilter ]);

																	});
															_self.tyre
																	._getCancelButton().mProperties.text = "Close";
															_self.tyre.open();

														},
													}),
													
													new sap.m.Input({
														enabled : true,
														visible : false,
														maxLength : 11
													}),
													
											new sap.m.Input({
												enabled : true,
												change : function(e){
													var input = e.getSource();
													var that = this;
													var sN = e.getSource().getValue();
													var url = "/sap/opu/odata/sap/ZFLEET_SRV/";
													var StancilModel = new sap.ui.model.odata.ODataModel(
															url, true);
													StancilModel.read(
															"/ValidateStencilGRNSet(StencilNumber='" + sN + "')", {
																success : function(oData) {
																	var eMSG = oData.EMessage;
																	if(eMSG != ""){
																		input.setValue("");
																		sap.m.MessageBox.show(eMSG, {
																			title : "Error",
																			icon : sap.m.MessageBox.Icon.ERROR,
																		});
																		
																	}
																},
																error : function(oData) {
																	var b = 1;
																}
															});
												},
												maxLength : 16,
											}),
											
											
											new sap.m.Input(
													{
														// For f4 icon

														showValueHelp : true,

														// For directly opening
														// f4 without typing

														valueHelpOnly : true,
														valueHelpRequest : function(e) {


															var x = _self;
															var inputSource = e.oSource;
															var prodCode = e
																	.getSource()
																	.getParent()
																	.getCells()[5];

															_self.f4ProdNo = new sap.ui.xmlfragment(
																	"com.acute.stock.in.view.Prod",
																	this);
															_self
																	.getView()
																	.addDependent(
																			_self.f4ProdNo);
															_self.f4ProdNo
																	.attachConfirm(function(
																			e) {

																		x
																				.setprod(
																						e,
																						inputSource,
																						prodCode);
																	});
															_self.f4ProdNo
																	.attachSearch(function(
																			e) {

																		var sValue = e
																				.getParameter("value");
																		var oFilter = new sap.ui.model.Filter(
																				"Input",
																				sap.ui.model.FilterOperator.EQ,
																				sValue);
																		e
																				.getSource()
																				.getBinding(
																						"items")
																				.filter(
																						[ oFilter ]);

																	});
															_self.f4ProdNo
																	._getCancelButton().mProperties.text = "Close";
															_self.f4ProdNo
																	.open();

														},
													}),

											new sap.m.Input({
												valueHelpRequest:[_self.onitmDesc,_self],
								                valueHelpOnly:true,
								                showValueHelp:true,
								                enabled : false,
								                maxLength:40
											}),

											

											new sap.m.Input({
												enabled : true,
												visible : false
											}),

											new sap.m.Button(
													{
														press : [
//																that.onDelete,that 
																this.onDelete,this 
																],
														visible : true,
														type : "Reject",
														icon : "sap-icon://delete"
													}), 
													
											new sap.m.Input({
												visible : false
											}), 
											
											new sap.m.Input({
												visible : false
											}),
											
											new sap.m.Input({
												visible : false
											})],

								});

						Table.addItem(templete);
					},
					onDelete : function(evt) {
						evt.getSource().getParent().getParent().removeItem(
								evt.getSource().getParent());
					},
					
					
					
					ValidateFields : function(){
						
						var table = this.getView().byId("tableStock");
						var tblrow = table.getItems();
						var len = tblrow.length;
						var chk = true;
						
						for(var i=0;i<len;i++)
							{
							if(table.getItems()[i].getCells()[0].getValue()=="")
								{
								table.getItems()[i].getCells()[0].setValueState("Error");
								chk = false;
								}
							else{
								table.getItems()[i].getCells()[0].setValueState("None");	
							}
							
							if(table.getItems()[i].getCells()[2].getValue()=="")
							{
							table.getItems()[i].getCells()[2].setValueState("Error");
							chk = false;
							}
						else{
							table.getItems()[i].getCells()[2].setValueState("None");	
						}
							
							if(table.getItems()[i].getCells()[3].getValue()=="")
							{
							table.getItems()[i].getCells()[3].setValueState("Error");
							chk = false;
							}
						else{
							table.getItems()[i].getCells()[3].setValueState("None");	
						}
							
							if(table.getItems()[i].getCells()[4].getValue()=="")
							{
							table.getItems()[i].getCells()[4].setValueState("Error");
							chk = false;
							}
						else{
							table.getItems()[i].getCells()[4].setValueState("None");	
						}
							
								}
						if(chk == false)
							return false
						},
					
//////////////////////////////////////////////////////////////////////////////////////////////////
		onMoveStock : function() {
						
						this.ValidateFields();
						var tbl = this.getView().byId("tableStock");
						
						var length = tbl.getItems().length;

						var loItems = this.getView().byId("tableStock")
								.getItems();
						var kunnr = this.fromKunnr;
						var hubCode = this.fromHubCode;
						var owner = sap.ui.getCore().byId("idOwner").getSelectedKey();

						for (var i = 0; i < length; i++) {
							var laCells = loItems[i].getCells();
							var stncil = laCells[2].getValue();
							var k = i + 1;
							for (var j = k; j < length; j++) {
								var laCells = loItems[j].getCells();
								var stncilNew = laCells[2].getValue();
								if (stncil == stncilNew) {
									sap.m.MessageBox.show(
													"Duplicate Stencil Number",
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
							}
						}

						// validation for branding number

						for (var i = 0; i < length; i++) {
							var laCells = loItems[i].getCells();
							var brand = laCells[1].getValue();
							var k = i + 1;
							for (var j = k; j < length; j++) {
								var laCells = loItems[j].getCells();
								var brandNew = laCells[1].getValue();
								if (brand == brandNew && brandNew != "") {

									sap.m.MessageBox.show(
													"Duplicate Branding Number",
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
							}
						}

						for ( var i in loItems) {
							var laCells = loItems[i].getCells();
							var stncil = laCells[2].getValue();
							var Companytyp = laCells[0].getValue();
							var ItmDesc = laCells[4].getValue();
							var ItemCode = laCells[9].getValue();
							var prod = laCells[3].getValue();

							if (stncil == "" || Companytyp == ""
									|| ItmDesc == "" || prod == "") {
								sap.m.MessageBox.show(
												"Stencil Number/Prod Size/Company/Item Description can not be blank",
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
						}

						var oEntry = {};
						var obj = [];

						oEntry.Kunnr = kunnr;
						oEntry.HubCode = hubCode;
						oEntry.Owner = owner;

						for ( var i in loItems) {
							var laCells = loItems[i].getCells();
							var SN = laCells[2].getValue();
							var BN = laCells[1].getValue();
							var TC = laCells[7].getValue();
							var ICD = laCells[4].getValue();
							var PS = laCells[5].getValue();
							var ItemCode = laCells[9].getValue();

							obj.push({
								StencilNumber : SN,
								BrandingNo : BN,
								TyreCompany : TC,
								Maktx : ICD,
								Matnr : ItemCode,
								ProdSize : PS
							});
						}

						oEntry.SaveStencilGateEntryNvg = obj;
						var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
						var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
						oCreateModel1.setHeaders({
							"Content-Type" : "application/atom+xml"
						});
						var fncSuccess = function(oData) {
							;
							if (oData.EError == "true") {
								sap.m.MessageBox.show(oData.EMessage, {
									title : "Error",
									icon : sap.m.MessageBox.Icon.ERROR,
									onClose : function() {

									}
								});
							} else {
								sap.m.MessageBox.show(oData.Message, {
									title : "Success",
									icon : sap.m.MessageBox.Icon.SUCCESS,
									onClose : function() {
										window.history.back();

									}
								});
							}
						}
						var fncError = function(oError) { // error callback

							var parser = new DOMParser();

							sap.m.MessageBox.show(message, {
								title : "Error",
								icon : sap.m.MessageBox.Icon.ERROR,
							});
						}
						oCreateModel1.create("/SaveStencilGateEntryHeadSet",
								oEntry, {
									success : fncSuccess,
									error : fncError
								});
					},
//////////////////////////////////////////////////////////////////////////////////////////////////
			enterGrm : function() {
						var grmNo = this.getView().byId("inpGrm").getValue();
						var url = "/sap/opu/odata/sap/ZFLEET_SRV/";
						var StancilModel = new sap.ui.model.odata.ODataModel(
								url, true);
						StancilModel.read(
								"/F4StencilGateEntrySet?$filter=Mblnr eq '"
										+ grmNo + "'", {
									success : function(oData) {
										var a = 1;
									},
									error : function(oData) {
										var b = 1;
									}
								});
						this.BindTable();
					},
//////////////////////////////////////////////////////////////////////////////////////////////////
					//Validate Number
					NumberValid: function(oEvent){
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
					
//////////////////////////////////////////////////////////////////////////////////////////////////
			BindTable : function() {
						debugger
						var _self = this;
						var url = "/sap/opu/odata/sap/ZFLEET_SRV/";
						var StancilModel = new sap.ui.model.odata.ODataModel(url, true);
						this.getView().setModel(StancilModel);

						this.getView().byId("tableStencils").setModel(StancilModel);
						var grmNo = this.getView().byId("inpGrm").getValue();
						var loFilter = [];
						var filter1 = new sap.ui.model.Filter("Mblnr",sap.ui.model.FilterOperator.EQ, grmNo);
						loFilter.push(filter1);
						var loTable = this.getView().byId("tableStencils");
						loTable.bindItems({
									path : "/F4StencilGateEntrySet",
									filters : loFilter,
									template : new sap.m.ColumnListItem(
											{
												cells : [
													new sap.m.Input(
															{
																value : "{Zeile}",
																enabled : false,
															}),
														new sap.m.Input(
																{
																	value : "{StencilNumber}",
																	enabled : false,
																}),
														new sap.m.Input({
															maxLength : 10,
															value : ""
														}),
														new sap.m.Input({
															value : "{Maktx}",
															enabled : false
														}),
														new sap.m.Input(
																{
																	showValueHelp : false,
																	enabled : false,
																	value : "{ProdDesc}",
																	valueHelpOnly : true,
																	valueHelpRequest : function(e) 
																					{
																		var x = _self;
																		var inputSource = e.oSource;
																		var prodCode = e.getSource().getParent().getCells()[5];

																		_self.f4ProdNo = new sap.ui.xmlfragment("com.acute.stock.in.view.Prod",this);
																		_self.getView().addDependent(_self.f4ProdNo);
																		_self.f4ProdNo.attachConfirm(function(e) {
																						x.setprod(e,inputSource,prodCode);
																					});
																		_self.f4ProdNo.attachSearch(function(e) {
																					var sValue = e.getParameter("value");
																					var oFilter = new sap.ui.model.Filter(
																							"Input",
																							sap.ui.model.FilterOperator.EQ,
																							sValue);
																					e.getSource().getBinding("items").filter([ oFilter ]);
																				});
																		_self.f4ProdNo._getCancelButton().mProperties.text = "Close";
																		_self.f4ProdNo.open();
																	},
																}),
																new sap.m.Text({
																	text : "{Ndp}",
																	visible : false
																}),
																new sap.m.Text({
																	text : "{NetPrice}",
																	visible : false
																}),

														new sap.m.RadioButtonGroup(
																{
																	columns : 2,
																	buttons : [

																			new sap.m.RadioButton(
																					{
																						text : "Reject",
																					}),

																			new sap.m.RadioButton(
																					{
																						text : "Accept"
																					})
																			]
																}),

														new sap.m.Input(
																{
																	value : "{ProdSize}",
																	visible : false
																}),

														new sap.m.Input({
															maxLength : 40,
															value : "",
															visible : true
														}), new sap.m.Input({
															value : "{Matnr}",
															visible : false
														}), ]

											})
								});

					},
//////////////////////////////////////////////////////////////////////////////////////////////////
					setprod : function(x, y, z) {

						y.setValue(x.getParameter("selectedItem").getTitle());
						z.setValue(x.getParameter("selectedItem").getDescription());

							y.getParent().getCells()[4].setEnabled(true);
							y.getParent().getCells()[4].setShowValueHelp(true);
							y.getParent().getCells()[4].setValueHelpOnly(true);
							y.getParent().getCells()[4].setValue("");

					},
//////////////////////////////////////////////////////////////////////////////////////////////////
					tyreCompany : function(x, y, z) {

						y.setValue(x.getParameter("selectedItem").getTitle());
						z.setValue(x.getParameter("selectedItem").getDescription());
						y.getParent().getCells()[4].setShowValueHelp(true);
						y.getParent().getCells()[4].setValueHelpOnly(true);
						y.getParent().getCells()[3].setValue("");
						y.getParent().getCells()[2].setValue("");
						y.getParent().getCells()[4].setValue("");

					},
//////////////////////////////////////////////////////////////////////////////////////////////////
//Since adding Item Number "Zeile" on first position, every index is increased by one
	onconfirmStencil : function() {
						debugger
						var check = true;
						var _self = this;
						var Grm = this.getView().byId("inpGrm").getValue();
						var loItems = this.getView().byId("tableStencils").getItems();
						var kunnr = this.fromKunnr;
						var hubCode = this.fromHubCode;
						var length = this.getView().byId("tableStencils").getItems().length;

						for ( var i in loItems) {
							var laCells = loItems[i].getCells();
							var itemNo = laCells[10].getValue();
							var prod = laCells[4].getValue();

							if (itemNo == "" || prod == "") {
								sap.m.MessageBox.show(
												"Item Number/Product Size cannot be blank",
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
						}

						for (var i = 0; i < length; i++) {
							var laCells = loItems[i].getCells();
							var brand = laCells[2].getValue();
							var k = i + 1;
							for (var j = k; j < length; j++) {
								var laCells = loItems[j].getCells();
								var brandNew = laCells[2].getValue();
								if (brand == brandNew && brandNew != "") {

									sap.m.MessageBox.show(
													"Duplicate Branding Number",
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
							}
						}

						var oEntry = {};
						var obj = [];

						oEntry.Kunnr = kunnr;
						oEntry.HubCode = hubCode;
						oEntry.Mblnr = Grm;
						oEntry.Owner = "01";
						oEntry.Mjahr = Mjahr;

						for ( var i in loItems) {
							var laCells 	= loItems[i].getCells();
							var Zeile		= laCells[0].getValue();
							var SN 			= laCells[1].getValue();
							var BN 			= laCells[2].getValue();
							var IN 			= laCells[10].getValue();
							var PS 			= laCells[8].getValue();
							var ndp 		= laCells[5].getText();
							var netPrice 	= laCells[6].getText();
							var Status 		= laCells[7].getSelectedIndex();
						//change sumit 
							var remarks = laCells[9].getValue();

							if (Status === 0) {
								var a = "X";
								var b = ""	
								if (remarks == ""){	
								laCells[9].setValueState("Error");
								check = false;	
								}else laCells[9].setValueState("None");
							} else {
								var a = "";
								var b = "X";
								laCells[9].setValueState("None");								
							}

							obj.push({
								Zeile			: Zeile,
								StencilNumber 	: SN,
								BrandingNo 		: BN,
								Matnr 			: IN,
								ProdSize 		: PS,
								Accept 			: b,
								Reject 			: a,
								Remarks 		: remarks,
								Ndp 			: ndp,
								NetPrice 		: netPrice
							});
						}

						if(check == false){
							sap.m.MessageBox.show("Please Enter Remarks",
									{
										icon    : sap.m.MessageBox.Icon.ERROR,
										title   : "Warning",
										actions : [ "OK" ],
										onClose : function(a) {
											if (a == "OK") {
											}
										},
									});
						return false;
						}

						oEntry.SaveStencilGateEntryNvg = obj;
						var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
						var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
						oCreateModel1.setHeaders({
							"Content-Type" : "application/atom+xml"
						});
						// Create Method for final Save
						oCreateModel1.create(
										"/SaveStencilGateEntryHeadSet",
										oEntry,
										{
										success : function(oData) {
											if (oData.EError == "true") {
												sap.m.MessageBox.show(
													oData.EMessage,
															{
														title : "Error",
														icon : sap.m.MessageBox.Icon.ERROR,
														onClose : function() {
														}
																	});
												} else {
													sap.m.MessageBox.show(
																	oData.Message,
																	{
																		title : "Success",
																		icon : sap.m.MessageBox.Icon.SUCCESS,
																		onClose : function() {
																			_self.getView().byId("tableStencils").removeAllItems();
																			_self.getView().byId("inpGrm").setValue();
																		}
																	});
												}
											},
											error : function(oData) {
												var b = 1;
											}
										});
					},
//////////////////////////////////////////////////////////////////////////////////////////////////
		showMaterialF4 : function(oEvt) {
						var _self = this;
						this.VehMakeValue = oEvt.getSource();
						var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4MaterialDocumentNumberSet?$filter=Kunnr eq '"
								+ this.fromKunnr
								+ "' and HubCode eq '"
								+ this.fromHubCode + "'";

						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,false, null);
						var _valueHelpDialog = new sap.m.SelectDialog(
								{
									title : "GRN",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{Mblnr}",
													description: "{PlantName} {Budat}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "{Mblnr}",
																value : "{Mblnr}^SPLIT^{PlantName}^SPLIT^{Budat}^SPLIT^{Mjahr}"
															}) ]
												})
									},
									liveChange : function(oEvent) {
										var sValue = oEvent.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"Mblnr",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items").filter([ oFilter ]);
									},
									confirm : [ this._handleValueHelpClose,this ],
									cancel : [ this._handleValueHelpClose, this ]
								});
						_valueHelpDialog.setModel(jModel);
						_valueHelpDialog.open();

					},

					_handleValueHelpClose : function(e) {

						var oSelectedItem = e.getParameter("selectedItem");
						//var value = e.getParameter("selectedItem").getCustomData()[0].getValue().split("^SPLIT^");

						if (oSelectedItem) {
							var obj = oSelectedItem.getBindingContext().getObject();
							plant = obj.Mblnr;
							oDate = obj.Budat;
							Mjahr = obj.Mjahr;
							
							this.getView().byId("date").setText("(" + " " + oDate + " " + ")");

							this.getView().byId("lblPlant").setVisible(true);
							this.getView().byId("plantName").setText("(" + " " + plant + " " + ") ");
							
							var num = oSelectedItem.getTitle();
							this.getView().byId("inpGrm").setValue(num);
							this.enterGrm();
						}
						//this.showDate(oDate);
					},
					
					_handleValueHelpSearch : function(e) {
						var sValue = e.getParameter("value");
						var oFilter = new sap.ui.model.Filter("Mblnr",sap.ui.model.FilterOperator.Contains, sValue);
						e.getSource().getBinding("items").filter([ oFilter ]);
					},
//////////////////////////////////////////////////////////////////////////////////////////////////
					showDate : function(oDate) {
						this.getView().byId("date").setText("(" + " " + oDate + " " + ")");
					},
//////////////////////////////////////////////////////////////////////////////////////////////////
			onitmDesc : function(evt){
						var that = this;
						that.ItemDescRow = evt.getSource();
						var prodCode = evt.getSource().getParent().getCells()[5].getValue();
						var TComp    = evt.getSource().getParent().getCells()[7].getValue();
						var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4MaterialDescriptionSet?$filter=ProdSize eq '" + prodCode + "' and TyreCompany eq '" + TComp + "'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						if(jModel.getData().d.results.length){
						var _valueHelpitmDescDialog = new sap.m.SelectDialog(
								{

									title : "Select Item Description",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{Maktx}",
													description : "{Matnr}",
												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent.getParameter("value");

				var oFilter = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleItmDescClose, this ],
									cancel : [ this._handleItmDescClose, this ]
								});
						_valueHelpitmDescDialog.setModel(jModel);
						_valueHelpitmDescDialog.open();
						}
					
					},
					
					_handleItmDescClose : function(oEvent) {
						var that = this;
						var ItemCode = that.ItemDescRow.getParent().getCells()[9];
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
								that.ItemDescRow.setValue(oSelectedItem.getTitle());
								ItemCode.setValue(oSelectedItem.getDescription())
								
						}

					},

				});