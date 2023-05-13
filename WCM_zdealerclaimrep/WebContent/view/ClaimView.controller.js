jQuery.sap.require("sap.ui.core.mvc.Controller");
// jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("zdealerclaimrep.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
var DataArticles, that;
 
sap.ui.core.mvc.Controller.extend("zdealerclaimrep.view.ClaimView",{

					onInit : function() {
						debugger;
						this.newBusy = new sap.m.BusyDialog();

						// this.newBusy.open();
						this.model = this.getOwnerComponent().getModel();

						that = this;

						if (!jQuery.support.touch) {
							this.getView().addStyleClass("sapUiSizeCompact");
						}
						if (sap.ui.Device.system.desktop) {

						}
						
						this.onTypeofCustomer();
						this.onTypeofCustomer2();
					this.onTyreFitMent();
					sap.ui.core.UIComponent.getRouterFor(this).getRoute(
					"ClaimView").attachMatched(this._onRoute, this);	
					},
					
					
					_onRoute : function(e){
				    	debugger
				    	var tempjsonString = e.getParameter("arguments").entity;
						var jsonstring = tempjsonString.replace(/@/g, "/");
						var tempSelectedData = JSON.parse(jsonstring);
						this.SelectedData  = JSON.parse(tempSelectedData);
						this.onEnter(this.SelectedData.VarClaimNo);
				    },
					
					
					onCustSelect:function(evt){
						var key=evt.getSource().getSelectedKey();
						this.onTyreFitMent(key);
						this.getView().byId("idFitment").setEnabled(true);
					},
					onTypeofCustomer: function(key) {

						//Method for setting the model for vehicle type
						if(key==undefined){
						var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TypeOfCustomerSet";
						}else{
							var sPath ="/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpCustomerTypeSet?$filter=IClaimTyp eq '"+key+"'"
						}
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false, false, null);
						var loc = this.getView().byId("idCustomer");
						loc.unbindAggregation("items");
						//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
						loc.setModel(jModel);
						loc.unbindAggregation("items");
						if(key==undefined){
							loc.bindAggregation("items", {
								path: "/d/results",
								template: new sap.ui.core.Item({
									key: "{Type}",
									text: "{Description}"
								})
							});
							
							}else{
								loc.bindAggregation("items", {
									path: "/d/results",
									template: new sap.ui.core.Item({
										key: "{CustType}",
										text: "{CustTypeDesc}"
									})
								});
								loc.setSelectedKey();
								}
						

					},
					
					onTypeofCustomer2: function(key) {

						//Method for setting the model for vehicle type
						if(key==undefined){
						var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TypeOfCustomerSet";
						}else{
							var sPath ="/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpCustomerTypeSet?$filter=IClaimTyp eq '"+key+"'"
						}
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false, false, null);
						var loc = this.getView().byId("idTypeCust");
						loc.unbindAggregation("items");
						//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
						loc.setModel(jModel);
						loc.unbindAggregation("items");
						if(key==undefined){
							loc.bindAggregation("items", {
								path: "/d/results",
								template: new sap.ui.core.Item({
									key: "{Type}",
									text: "{Description}"
								})
							});
							
							}else{
								loc.bindAggregation("items", {
									path: "/d/results",
									template: new sap.ui.core.Item({
										key: "{CustType}",
										text: "{CustTypeDesc}"
									})
								});
								loc.setSelectedKey();
								}
						

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
						loc.unbindAggregation("items");
						loc.setModel(jModel);
						if(key==undefined){
							loc.bindAggregation("items", {
								path: "/d/results",
								template: new sap.ui.core.Item({
									key: "{Type}",
									text: "{Description}"
								})
							});
							
							}else{
								loc.bindAggregation("items", {
									path: "/d/results",
									template: new sap.ui.core.Item({
										key: "{FitType}",
										text: "{FitTypeDesc}"
									})
								});
								loc.setSelectedKey();
								}
						//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
						
						
					},
					/*onTicket : function() {
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

					},*/
					
				/*	onClaimF4 : function() {
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimSet";
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
							this.getView().byId("idClaimno").setValue(
									oSelectedItem.getTitle());
							that.getView().byId("idEdit").setVisible(true);
							that.onEnter();
						}

					},*/
					onTypeofClaim : function() {
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
							this.getView().byId("idIconTabBarStretchContent").setVisible(true);
							this.getView().byId("idDelar").setEnabled(true);
							this.getView().byId("Id_bt1").setVisible(true);
							
						}

					},
					
					onEnter : function(VarClaimNo) {
						debugger
						var that = this;
						//var ticket = this.getView().byId("idClaimno").getValue();

						// var sPath =
						// "/sap/opu/odata/sap/ZCS_TICKET_SRV/GetTicketDataSet(ITicketNo='"
						// + ticket + "')";
						var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
						var oReadModel = new sap.ui.model.odata.ODataModel(
								sServiceUrl);
						oReadModel.setHeaders({
							"Content-Type" : "application/atom+xml"
						});
						var fncSuccess = function(oData, oResponse) // sucess
																	// function
						{
							
							var ary = {
								"d" : oData
							}
							var jModel = new sap.ui.model.json.JSONModel(ary);

							that.getView().setModel(jModel, "jModel");
							that.data = jModel.getData();
							jModel = setData(d);

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
							
							if(oData.ClaimNoTyre!="" && oData.ClaimNoTube=="" && oData.ClaimNoFlap==""){
								that.getView().byId("IdPanel").setVisible(true);
								that.getView().byId("IdPanel1").setVisible(false);
								that.getView().byId("IdPanel2").setVisible(false);
							}
if(oData.ClaimNoTyre=="" && oData.ClaimNoTube!="" && oData.ClaimNoFlap==""){
	that.getView().byId("IdPanel").setVisible(false);
	that.getView().byId("IdPanel1").setVisible(true);
	that.getView().byId("IdPanel2").setVisible(false);
							}
if(oData.ClaimNoTyre=="" && oData.ClaimNoTube=="" && oData.ClaimNoFlap!=""){
	that.getView().byId("IdPanel").setVisible(false);
	that.getView().byId("IdPanel1").setVisible(false);
	that.getView().byId("IdPanel2").setVisible(true);	
}
that.getView().byId("idPhone1").setEnabled(false);
that.getView().byId("idFname").setEnabled(false);
that.getView().byId("idLname").setEnabled(false);
that.getView().byId("idEmail").setEnabled(false);
that.getView().byId("idAdd1").setEnabled(false);
that.getView().byId("idAdd2").setEnabled(false);
that.getView().byId("idCity").setEnabled(false);
that.getView().byId("idDistrict").setEnabled(false);
that.getView().byId("idState").setEnabled(false);
that.getView().byId("idCountry").setEnabled(false);
that.getView().byId("idCode").setEnabled(false);
//that.getView().byId("idFCNameInput").setEnabled(true);
//that.getView().byId("idFNameInput").setEnabled(true);
//that.getView().byId("idFPNoInput").setEnabled(true);	
if(that.getView().byId("IdPanel").getVisible()){
	that.getView().byId("idTyreCode").setEnabled(false);
	that.getView().byId("idTyreStn").setEnabled(false);
	that.getView().byId("idTyreMDNo").setEnabled(false);
	that.getView().byId("idTyreVmodel").setEnabled(false);
	that.getView().byId("idTyreRgNo").setEnabled(false);
	
	that.getView().byId("idTubeCode").setEnabled(false);
	that.getView().byId("idFlapCode").setEnabled(false);
						
}
if(that.getView().byId("IdPanel1").getVisible()){
	that.getView().byId("idTyreCode").setEnabled(false);
	that.getView().byId("idTyreStn").setEnabled(false);
	that.getView().byId("idTyreMDNo").setEnabled(false);
	that.getView().byId("idTyreVmodel").setEnabled(false);
	that.getView().byId("idTyreRgNo").setEnabled(false);
	
	that.getView().byId("idTubeCode").setEnabled(false);
	that.getView().byId("idFlapCode").setEnabled(false);
						}
if(that.getView().byId("IdPanel2").getVisible()){
	that.getView().byId("idTyreCode").setEnabled(false);
	that.getView().byId("idTyreStn").setEnabled(false);
	that.getView().byId("idTyreMDNo").setEnabled(false);
	that.getView().byId("idTyreVmodel").setEnabled(false);
	that.getView().byId("idTyreRgNo").setEnabled(false);
	
	that.getView().byId("idTubeCode").setEnabled(false);
	that.getView().byId("idFlapCode").setEnabled(false);	
}

that.getView().byId("idDelar").setEnabled(false);
that.getView().byId("Id_bt1").setVisible(false);
							
that.getView().byId("idEdit").setVisible(true);
that.getView().byId("idPrint").setVisible(true);
						
							
							
							
							
							
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
						oReadModel.read("/DisplayClaimDataSet(IClaimNo='"+ VarClaimNo + "')", {
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
					handleButtonPress:function(){
						var Table=this.getView().byId("tblDetail");
						var templete= new sap.m.ColumnListItem({
	        	            cells: [ new sap.m.Input({
	        	                valueHelpRequest:[that.IteamCodeTyre,that],
	        	                valueHelpOnly:true,
	        	                showValueHelp:true
	        	                
	        	            }), new sap.m.Text({
	        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),new sap.m.Text({        	                
	        	            }),
	        	            new sap.m.Text({	        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),new sap.m.Input({	        	                
	        	            })],
	        	        	
	        	        });
						Table.addItem(templete);
					},
					handleButtonPress1:function(){
						var Table=this.getView().byId("tblDetail2");
						var templete= new sap.m.ColumnListItem({
	        	            cells: [ new sap.m.Input({
	        	                valueHelpRequest:[that.IteamCodeFlap,that],
	        	                valueHelpOnly:true,
	        	                showValueHelp:true
	        	                
	        	            }), new sap.m.Text({
	        	                
	        	            }) ],
	        	        	
	        	        });
						Table.addItem(templete);
					},
					handleButtonPress2:function(){
						var Table=this.getView().byId("tblDetail1");
						var templete= new sap.m.ColumnListItem({
	        	            cells: [ new sap.m.Input({
	        	                valueHelpRequest:[that.IteamCodeTube,that],
	        	                valueHelpOnly:true,
	        	                showValueHelp:true
	        	                
	        	            }), new sap.m.Text({
	        	                
	        	            }) ],
	        	        	
	        	        });
						Table.addItem(templete);
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
					IteamCodeFlap:function(evt){
						//this.TyreTypeCode=evt.getSource().getParent();
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq 'FLAP' and IClaimType eq '"+this.ClaimType+"' and IRecvDepo eq '"+this.RecDepoType+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Flap Code",
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
									confirm : [ this._handleFLAPJKDealClose, this ],
									cancel : [ this._handleFLAPJKDealClose, this ]
								});
						_valueHelpTyreSelectDialog.setModel(jModel);
						_valueHelpTyreSelectDialog.open();
					},
					_handleFLAPJKDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							that.getView().byId("idFlapCode").setValue(
									oSelectedItem.getDescription());
							debugger
							var obj=oSelectedItem.getBindingContext().getObject();
							that.getView().byId("idFlapPdc").setValue(obj.ItemDescr);
							
							
							//this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							
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
					onFitmentChange: function(oEvent) {
						var key = oEvent.mParameters.selectedItem.getKey();
						if (key === "OEM") {
							that.getView().byId("idFCNameInput").setEnabled(true);
							that.getView().byId("idFNameInput").setEnabled(true);
//							that.getView().byId("idDVPInput").setEnabled(true);
							that.getView().byId("idFPNoInput").setEnabled(true);
							that.getView().byId("idFCNameLabel").setRequired(true);
							

						} else {
							that.getView().byId("idFCNameInput").setEnabled(false);
							that.getView().byId("idFNameInput").setEnabled(false);
//							that.getView().byId("idDVPInput").setEnabled(true);
							that.getView().byId("idFPNoInput").setEnabled(false);
							that.getView().byId("idFCNameLabel").setRequired(false);

							
						}
					},
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
			    
	onItemDetails : function(){
		debugger
		var jModel = this.getView().getModel("jModel");
		var itmData = jModel.getData();
		var itmtyp = itmData.d.ItemType;
		if(itmtyp == "TYRE"){
			this.getView().byId("IdPanel").setVisible(true);
		} else if(itmtyp == "TUBE"){
			this.getView().byId("IdPanel1").setVisible(true);
		} else {
			this.getView().byId("IdPanel2").setVisible(true);
		}
		this.getView().byId("idTypeCust").setVisible(true);
		this.getView().byId("idDlName").setVisible(true);
		this.getView().byId("idClmStatus").setVisible(true);
		this.getView().byId("idDlLocation").setVisible(true);
		this.getView().byId("idCustomer").setVisible(false);
		this.getView().byId("idTicketSource").setVisible(false);
		this.getView().byId("idNoPr").setVisible(false);
		this.getView().byId("idlttno").setVisible(false);
		this.getView().byId("idlttdt").setVisible(false);
		this.getView().byId("idMonth").setVisible(false);
		this.getView().byId("idYear").setVisible(false);
		
		
		
		
		this.getView().byId("idVbox1").setVisible(false);
	},		    	
			    	
	onBack: function(){
		
		this.getView().byId("idTypeCust").setVisible(false);
		this.getView().byId("idDlName").setVisible(false);
		this.getView().byId("idClmStatus").setVisible(false);
		this.getView().byId("idDlLocation").setVisible(false);
		this.getView().byId("idCustomer").setVisible(true);
		this.getView().byId("idTicketSource").setVisible(true);
		this.getView().byId("idNoPr").setVisible(true);
		this.getView().byId("idlttno").setVisible(true);
		this.getView().byId("idlttdt").setVisible(true);
		this.getView().byId("idMonth").setVisible(true);
		this.getView().byId("idYear").setVisible(true);
		
		this.getView().byId("IdPanel").setVisible(false);
		this.getView().byId("IdPanel1").setVisible(false);
		this.getView().byId("IdPanel2").setVisible(false);
		this.getView().byId("idVbox1").setVisible(true);
		
		
		
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("View1");
	},
			    	OnPrint:function(){
			    		
			    		sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_CLAIM_SRV/ClaimOutputFormSet(ClaimNo='',TicketNo='"+that.data.d.TicketNo+"')/$value", true);
			        		
			    	},

				});
