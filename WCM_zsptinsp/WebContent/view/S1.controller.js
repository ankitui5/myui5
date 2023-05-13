jQuery.sap.require("sap.ui.core.mvc.Controller");
// jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("com.acute.spinsp.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
var DataArticles, that;
sap.ui.controller(
				"com.acute.spinsp.view.S1",
				{

					onInit : function() {
						
						this.newBusy = new sap.m.BusyDialog();
						
						var model = new sap.ui.model.json.JSONModel();
						sap.ui.getCore().setModel(model,"JModel");						
						
						var tktno = this.getView().byId("idTno").getValue();
						if(tktno == ""){
							check = true;
							this.getView().byId("idTno").setValueState(sap.ui.core.ValueState.Error);
						}
							
					// this.newBusy.open();
						this.model = this.getOwnerComponent().getModel();

						that = this;
						this.getRouter().attachRouteMatched(this.onRouteMatched, this);
						if (!jQuery.support.touch) {
							this.getView().addStyleClass("sapUiSizeCompact");
						}
						if (sap.ui.Device.system.desktop) {

						}
						that.itemType = "";
//						if (!this.IntialFrag) {
//							this.IntialFrag = sap.ui.xmlfragment(
//								"com.acute.spinsp.view.Intial", this);
//							this.getView().addDependent(this.IntialFrag);
//						}
//						// open value help dialog
//						this.IntialFrag.open();
						this.onTicketCloseButton();
						this.onTypeofCustomer();
						this.onTyreFitMent();
						this.onTypeofClaim();
						this.onTicketSource();						
						
					},
					
					
					
					onRouteMatched: function(oEvent) {		
					},
					
			/*		onCustSelect:function(evt){
						var key=evt.getSource().getSelectedKey();
						this.onTyreFitMent(key);
						this.getView().byId("idFitment").setEnabled(true);
					},*/
					
			        //for ticket source
			        onTicketSource: function() {
			          //Method for setting the model for Ticket Source
			          var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TicketSourceSet";
			          var jModel = new sap.ui.model.json.JSONModel();
			          jModel.loadData(sPath, null, false, "GET", false, false, null);
			          var loc = this.getView().byId("idTicketSource");
			          loc.unbindAggregation("items");
			          //var Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
			          loc.setModel(jModel);
			          loc.bindAggregation("items", {
			            path: "/d/results",
			            template: new sap.ui.core.Item({
			              key: "{Code}",
			              text: "{Text}"
			            })
			          });
			        },  
			        
		
			        
					onchangeletterdt:function(){
				 		debugger
				 	 var p = this.getView().byId("inpLetterRefDt");	
				 	 var temp = p.getDateValue();
				 	 var tdate = new Date();
				 	 var tdt1 = tdate.setHours(0,0,0,0);
				 	 var tdt2 = temp.setHours(0,0,0,0);
				 	 if (tdt2 > tdt1){
				 		sap.m.MessageToast.show("Letter Ref. Date can not be greater than current date"); 
				 		p.setValue(""); 
				 		this.getView().byId("inpLetterRefDt").setValueState(sap.ui.core.ValueState.Error);
						return
				 	 }
				 	 else {
				 		this.getView().byId("inpLetterRefDt").setValueState(sap.ui.core.ValueState.None);
				 	  }
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
					onTyreFitMent: function(key) {
						debugger

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
					
					onTicket : function() {
						debugger
//						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpTicketSet?$filter=Spot eq 'X'";
						var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpSpotTicketSet";
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
							this.getView().byId("idTno").setValue(oSelectedItem.getTitle());
							this.getView().byId("iddepo").setEnabled(true);
							this.getView().byId("idCustomer").setEnabled(true);
							this.getView().byId("idClaim").setEnabled(true);
							this.getView().byId("idFitment").setEnabled(true);
							this.getView().byId("idCreatedBy").setEnabled(true);
							this.getView().byId("inpLetterRefNo").setEnabled(true);
							this.getView().byId("inpLetterRefDt").setEnabled(true);
							
							//this.getView().byId("idPhone1").setEnabled(true);
							this.getView().byId("idAltNo").setEnabled(true);
							this.getView().byId("idFname").setEnabled(true);
							this.getView().byId("idLname").setEnabled(true);
							this.getView().byId("idAdd1").setEnabled(true);
							this.getView().byId("idAdd2").setEnabled(true);
							//this.getView().byId("idState").setEnabled(true);
							//this.getView().byId("idDistrict").setEnabled(true);
							this.getView().byId("idLocation").setEnabled(true);
							this.getView().byId("idEmail").setEnabled(true);
							
							this.getView().byId("idDelar").setEnabled(true);
							
							this.getView().byId("idFNameInput").setEnabled(true);
							this.getView().byId("idFPNameInput").setEnabled(true);
							this.getView().byId("idFEmailInput").setEnabled(true);
							this.getView().byId("idFPNoInput").setEnabled(true);
							this.getView().byId("idFLocationInput").setEnabled(true);
							this.getView().byId("idClaim").setValue("Spot Inspection Replacement Claims (SP10)");
							this.ClaimType = "SP10";
							that.onEnter();
						}

					},

					onTypeofClaim : function() {
						debugger
						 var flag = 'S';	
					     var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimTypeSet?$filter=Flag eq '" + flag + "'";
							var jModel = new sap.ui.model.json.JSONModel();
							jModel.loadData(sPath, null, false, "GET", false,
									false, null);
							var _valueHelprCTypeSelectDialog = new sap.m.SelectDialog(
									{

										title : "Select Claim Type",
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
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("ClaimType",sap.ui.model.FilterOperator.Contains,sValue);
			    var oFilter2 = new sap.ui.model.Filter("Descr",sap.ui.model.FilterOperator.Contains,sValue);
	     
			    var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);									
		
			    oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
				},
					confirm : [ this._handleTypeCTypeClose, this ],
					cancel : [ this._handleTypeCTypeClose, this ]
				});
					_valueHelprCTypeSelectDialog.setModel(jModel);
					_valueHelprCTypeSelectDialog.open();
				},
					_handleTypeCTypeClose : function(oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						debugger
						this.getView().byId("idClaim").setValue(oSelectedItem.getTitle());
						this.ClaimType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
					}
						},	
		
/*****************/					
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
							debugger
							 this.getView().byId("idDelar").setValue();
				    		   this.getView().byId("idDelarName").setValue();
				    		   this.getView().byId("idStreet").setValue();
				    		   this.getView().byId("iddelCity").setValue();
				    		   this.getView().byId("iddelDist").setValue();
				    		   this.getView().byId("idDealPos").setValue();
				    		   this.getView().byId("idDealMobil").setValue();
				    		   this.getView().byId("idFNameInput").setValue();
				    		   this.getView().byId("idFPNameInput").setValue();
				    		   this.getView().byId("idFEmailInput").setValue();
				    		   this.getView().byId("idFPNoInput").setValue();
				    		   this.getView().byId("idFLocationInput").setValue();
							this.getView().byId("iddepo").setValue(
									oSelectedItem.getTitle());
							this.RecDepoType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							this.getView().byId("idDelar").setEnabled(true);
						}
					},
					
					onTicketCloseButton:function(){
						var Select=true;
						if(Select){
							this.getView().byId("idTnolbl").setVisible(true);
							this.getView().byId("idTno").setVisible(true);
							this.getView().byId("idTkDatelbl").setVisible(true);
							this.getView().byId("idTkDate").setVisible(true);
						}else{
							this.getView().byId("idTnolbl").setVisible(false);
							this.getView().byId("idTno").setVisible(false);
							this.getView().byId("idTkDatelbl").setVisible(false);
							this.getView().byId("idTkDate").setVisible(false);
							//that.getView().byId("idCustomer").setEnabled(true);
							that.getView().byId("idPhone1").setEnabled(true);
							that.getView().byId("idFname").setEnabled(true);
							that.getView().byId("idLname").setEnabled(true);
							that.getView().byId("idEmail").setEnabled(true);
							that.getView().byId("idAdd1").setEnabled(true);
							that.getView().byId("idAdd2").setEnabled(true);
							that.getView().byId("idCity").setEnabled(true);
							that.getView().byId("idDistrict").setEnabled(true);
							that.getView().byId("idState").setEnabled(true);
							that.getView().byId("idCountry").setEnabled(true);
							that.getView().byId("idCode").setEnabled(true);
							//that.getView().byId("idFitment").setEnabled(true);
							//that.getView().byId("idTyreInput").setEnabled(true);
							//that.getView().byId("idTyreInvolve").setEnabled(true);
//							that.getView().byId("idHours").setEnabled(true);
//							that.getView().byId("idCondition").setEnabled(true);
							
							//that.getView().byId("idDealCodeInput").setEnabled(true);
							//that.getView().byId("idDTPInput").setEnabled(true);
							that.getView().byId("idFCNameInput").setEnabled(true);
							that.getView().byId("idFNameInput").setEnabled(true);

							that.getView().byId("idFPNoInput").setEnabled(true);
							//that.getView().byId("idTyreInput").setEnabled(true)
						}					
						//this.IntialFrag.close();	
					},
					
					
					onTicketCloseButton1:function(){
						debugger
						var tyre=sap.ui.getCore().byId("RD1").getSelected();
						var tube=sap.ui.getCore().byId("RD2").getSelected();
						var flap=sap.ui.getCore().byId("RD3").getSelected();
						if(tyre){
							that.itemType = "TYRE";
						}else if(tube){
								that.itemType = "TUBE";
						}else if(flap){
								that.itemType = "FLAP";
						}
						
						window.tempItemTYpe = that.itemType;
						this.IntialFrag.close();
						this.IntialFrag.destroy();
						
						this.getRouter().navTo("S2");
					},
					
					
					onEnter : function() {
						debugger;
						this.getView().byId("Id_bt1").setVisible(true);
						var that = this;
						var ticket = this.getView().byId("idTno").getValue();
						var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
						var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
						oReadModel.setHeaders({
							"Content-Type" : "application/atom+xml"
						});
						var fncSuccess = function(oData, oResponse) // success
																	// function
						{
							if(oData.TicketStatus!="07" ){
							var ary = {
								"d" : oData
							}
							var jModel = new sap.ui.model.json.JSONModel(ary);
							that.getView().setModel(jModel,"jModel");
							that.data = jModel.getData();

							if (that.data.d.EMessage != "") {
								sap.m.MessageBox.show(that.data.d.EMessage, {
									title : "Error",
									icon : sap.m.MessageBox.Icon.ERROR,
									onClose : function() {
										// window.history.back();
										that.flag = "C";
										that.handleButtonPress();
										that.getView().byId("idSave").setEnabled(false);

									}
								});
							} else {
							}

							that.Dealer = that.data.d.DealerCode;
							that.State = that.data.d.CustomerRegion;
							this.ClaimType = "SP10";
			        		claimType.setValue("Spot Inspection Replacement Claims (SP10)");
							
							that.getView().byId("idCustomer").setSelectedKey(that.data.d.CustType);
							that.getView().byId("idFitment").setSelectedKey(that.data.d.FitType);
							
							if (that.data.d.FitType == "OEM") {
								that.getView().byId("idFCNameInput").setEnabled(true);
								that.getView().byId("idFNameInput").setEnabled(true);
								that.getView().byId("idFPNoInput").setEnabled(true);
								that.getView().byId("idFCNameLabel").setRequired(true);
							} else {
								that.getView().byId("idFCNameInput").setEnabled(false);
								that.getView().byId("idFNameInput").setEnabled(false);
								that.getView().byId("idFPNoInput").setEnabled(false);
								that.getView().byId("idFCNameLabel").setRequired(false);
							}
							
							that.getView().byId("idPhone1").setEnabled(true);
							that.getView().byId("idFname").setEnabled(true);
							that.getView().byId("idLname").setEnabled(true);
							that.getView().byId("idEmail").setEnabled(true);
							that.getView().byId("idAdd1").setEnabled(true);
							that.getView().byId("idAdd2").setEnabled(true);
							that.getView().byId("idCity").setEnabled(true);
							that.getView().byId("idDistrict").setEnabled(true);
							that.getView().byId("idState").setEnabled(true);
							that.getView().byId("idCountry").setEnabled(true);
							that.getView().byId("idCode").setEnabled(true);
							
						}else{
							if(oData.TicketStatus=="07"){
								sap.m.MessageBox.show("Ticket has already been closed", {
									title : "Error",
									icon : sap.m.MessageBox.Icon.ERROR,
								});	
							}
							that.getView().byId("idTno").setValue("");
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
						oReadModel.read("/GetTicketDataSet(ITicketNo='" + ticket + "')", {
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
					    debugger
					    var CType = this.getView().byId("idClaim").getValue();
						var CDepo = this.getView().byId("iddepo").getValue();
						this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.None);
						this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.None);
						
						if(CType == "")
						{					
						this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.Error);
						sap.m.MessageBox.show("Please fill Type of Claim.", {
			              title: "ERROR",
			              icon:sap.m.MessageBox.Icon.ERROR,
							});
							return;
						}

						
						if(CDepo == "")
						{
						this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.Error);
							sap.m.MessageBox.show("Please fill Claim Receiving Depot.", {
			              title: "ERROR",
			              icon:sap.m.MessageBox.Icon.ERROR,
							});
							return;
						}			    
					    
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpDealerSet?$filter=ClaimType eq '"+this.ClaimType+"' and ClaimRecvDepo eq '"+this.RecDepoType+"'";	
						var jModel = new sap.ui.model.json.JSONModel();
							jModel.loadData(sPath, null, false,"GET",false, false, null);
							var ln = jModel.getData().d.results.length;
							if(ln == 0)
							{
								sap.m.MessageBox.show("There is no Data for this Claim Receiving Depot", {
				              title: "ERROR",
				              icon:sap.m.MessageBox.Icon.ERROR,
								});
								return;
							}	
				       	 var _valueHelprJKDealSelectDialog = new sap.m.SelectDialog({
					 	
					     title: "Dealer Code",
					     items: {
					         path: "/d/results",
					         template: new sap.m.StandardListItem({
					             title: "{Name1}",
					             description : "{Kunnr}",
					             customData: [new sap.ui.core.CustomData({
					                 key: "Key",
					                 value: "{Kunnr}"
					             })],
					            
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
										oSelectedItem.getDescription());
								debugger
								var obj=oSelectedItem.getBindingContext().getObject();
								this.getView().byId("idDelarName").setValue(obj.Name1);
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
				
				validateChar : function( oEvent ){
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
				
					handleButtonPress:function(){
						var Table=this.getView().byId("tblDetail");
						var templete= new sap.m.ColumnListItem({
	        	            cells: [ new sap.m.Input({
	        	                valueHelpRequest:[that.IteamCodeTyre,that],
	        	                valueHelpOnly:true,
	        	                showValueHelp:true
	        	                
	        	            }), new sap.m.Text({
	        	                
	        	            }),new sap.m.Input({maxLength:11        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),
	        	            new sap.m.Text({	        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),new sap.m.Button({press:[that.onDelete,that],type:"Reject",icon:"sap-icon://delete"})],
	        	        	
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
	        	                
	        	            }),new sap.m.Button({press:[that.onDelete,that],type:"Reject",icon:"sap-icon://delete"}) ],
	        	        	
	        	        });
						Table.addItem(templete);
					},
					onDelete:function(evt){
						evt.getSource().getParent().getParent().removeItem(evt.getSource().getParent());
					},
					handleButtonPress2:function(){
						var Table=this.getView().byId("tblDetail1");
						var templete= new sap.m.ColumnListItem({
	        	            cells: [ new sap.m.Input({
	        	                valueHelpRequest:[that.IteamCodeTube,that],
	        	                valueHelpOnly:true,
	        	                showValueHelp:true
	        	                
	        	            }), new sap.m.Text({
	        	                
	        	            }),new sap.m.Button({press:[that.onDelete,that],type:"Reject",icon:"sap-icon://delete"}) ],
	        	        	
	        	        });
						Table.addItem(templete);
					},
					IteamCodeTyre:function(evt){
						this.TyreTypeCode=evt.getSource().getParent();
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
							this.TyreTypeCode.getCells()[0].setValue(
									oSelectedItem.getDescription());
							debugger
							var obj=oSelectedItem.getBindingContext().getObject();
							this.TyreTypeCode.getCells()[1].setText(obj.ItemDescr);
							//this.TyreTypeCode.getCells()[4].setText(obj.PrdtCat);
							this.TyreTypeCode.getCells()[5].setText(obj.PrdtCatDesc);
							
							//this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							
						}

					},
					IteamCodeTube:function(evt){
						this.TyreTypeCode=evt.getSource().getParent();
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
							this.TyreTypeCode.getCells()[0].setValue(
									oSelectedItem.getDescription());
							debugger
							var obj=oSelectedItem.getBindingContext().getObject();
							this.TyreTypeCode.getCells()[1].setText(obj.ItemDescr);
							
							
							//this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							
						}

					},
					IteamCodeFlap:function(evt){
						this.TyreTypeCode=evt.getSource().getParent();
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
							this.TyreTypeCode.getCells()[0].setValue(
									oSelectedItem.getDescription());
							debugger
							var obj=oSelectedItem.getBindingContext().getObject();
							this.TyreTypeCode.getCells()[1].setText(obj.ItemDescr);
							
							
							//this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							
						}

					},
					
/***************************f4 for vahicle change sumit*******************************************/

					/************SEARCH HELPS BEGIN*********/
					/*Vehicle Type Search Help Begin*/
							_onVehicleTypeHelp: function(oController) {
								//method for vehicle type value help
								// create value help dialog using fragment
								if (!this._onVehicleTypeHelpDialog) {
									this._onVehicleTypeHelpDialog = sap.ui.xmlfragment(
										"com.acute.spinsp.view.VehicleType", this);
									
									this.getView().addDependent(this._onVehicleTypeHelpDialog);
								}
								// open value help dialog
								this._onVehicleTypeHelpDialog.open();
							}, //end of onVehicleTypeHelp method
							_VehicleTypeClose: function(evt) {
								//get the selected vehicle type
								var oSelectedItem = evt.getParameter("selectedItem");
								if (oSelectedItem) {
									//Fetching the selected value
									var sType = oSelectedItem.getTitle();
									
									this.getView().byId("idVehicle").setValue(sType);
									this.getView().byId("idVehicleMake").setEnabled(true);
									this.getView().byId("idVehicleMake").setValue();
									
									this.getView().byId("idModel").setEnabled(false);
									this.getView().byId("idModel").setValue();
									
									this.getView().byId("idVariant").setEnabled(false);
									this.getView().byId("idVariant").setValue();
									/*this.onTyreCondition(sType);	*/
									
								
										debugger
										this.getView().byId("idCondition").setSelectedKey("");
										//Method for setting the model for probable condition
							            var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TyreConditionSet?$filter=Type eq '" + sType + "'";
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
											
								}
								evt.getSource().getBinding("items").filter([]);
							},
							
							_VehicleTypeSearch: function(evt) {
								//method for serach in the Vehicle type
								var sValue = evt.getParameter("value");
					            var oFilter = new sap.ui.model.Filter("Type",sap.ui.model.FilterOperator.Contains,sValue);
					            evt.getSource().getBinding("items").filter([oFilter]);
							}, //end of _VehicleTypeSearch method
							onVehicleType: function(oEvt) {
								//Method for setting the model for vehicle type
								this.VehicleType = new sap.ui.model.json.JSONModel();
								var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleTypeSet";
								this.VehicleType.loadData(oUri, null, false, "GET", false, false, null);
								this.getView().setModel(this.VehicleType, "VehicleType");
								this._onVehicleTypeHelp();
							}, //end of onVehicleType Method
					/*Vehicle Type Search Help End*/

					/*Vehicle Make Search Help Begin*/
							_onVehicleMakeHelp: function(oController) {
								//method for vehicle make value help
								// create value help dialog using fragment
								if (!this._onVehicleMakeHelpDialog) {
									this._onVehicleMakeHelpDialog = sap.ui.xmlfragment(
										"com.acute.spinsp.view.VehicleMake", this);
									this.getView().addDependent(this._onVehicleMakeHelpDialog);
								}
								// open value help dialog
								this._onVehicleMakeHelpDialog.open();
							}, //end of onVehicleMakeHelp method
							_VehicleMakeClose: function(evt) {
								//get the selected vehicle make
								var oSelectedItem = evt.getParameter("selectedItem");
								if (oSelectedItem) {
									//Fetching the selected value
									var sType = oSelectedItem.getTitle();
									this.getView().byId("idVehicleMake").setValue(sType);
									this.getView().byId("idModel").setEnabled(true);
									this.getView().byId("idModel").setValue();
									
									this.getView().byId("idVariant").setEnabled(false);
									this.getView().byId("idVariant").setValue();
									
								}
								evt.getSource().getBinding("items").filter([]);
							},
							_VehicleMakeSearch: function(evt) {
								//method for serach in the Vehicle Make
								var sValue = evt.getParameter("value");
								var oFilter = new sap.ui.model.Filter("Make",sap.ui.model.FilterOperator.Contains,sValue);
					            evt.getSource().getBinding("items").filter([oFilter]);
							}, //end of _VehicleMakeSearch method
							
							
							onVehicleMake: function(oEvt) {
								//Method for setting the model for vehicle type
								this.VehicleMake = new sap.ui.model.json.JSONModel();
								this.type = this.getView().byId("idVehicle").getValue();
								var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleMakeSet?$filter=Type eq '" + this.type + "'";
								this.VehicleMake.loadData(oUri, null, false, "GET", false, false, null);
								this.getView().setModel(this.VehicleMake, "VehicleMake");
								this._onVehicleMakeHelp();
							}, //end of onVehicleMake Method
					/*Vehicle Make Search Help End*/

					/*Vehicle Model Search Help Begin*/
							_onVehicleModelHelp: function(oController) {
								//method for vehicle model value help
								// create value help dialog using fragment
								if (!this._onVehicleModelHelpDialog) {
									this._onVehicleModelHelpDialog = sap.ui.xmlfragment(
										"com.acute.spinsp.view.VehicleModel", this);
									this.getView().addDependent(this._onVehicleModelHelpDialog);
								}
								// open value help dialog
								this._onVehicleModelHelpDialog.open();
							}, //end of onVehicleModelHelp method
							_VehicleModelClose: function(evt) {
								//get the selected vehicle model
								var oSelectedItem = evt.getParameter("selectedItem");
								if (oSelectedItem) {
									//Fetching the selected value
									var sType = oSelectedItem.getTitle();
									this.getView().byId("idModel").setValue(sType);
									this.getView().byId("idVariant").setEnabled(true);
									this.getView().byId("idVariant").setValue();
								}
								evt.getSource().getBinding("items").filter([]);
							},
							_VehicleModelSearch: function(evt) {
								//method for serach in the Vehicle Model
								var sValue = evt.getParameter("value");
								var oFilter = new sap.ui.model.Filter("Model",sap.ui.model.FilterOperator.Contains,sValue);
					            evt.getSource().getBinding("items").filter([oFilter]);
							}, //end of _VehicleModelSearch method
							onVehicleModel: function(oEvt) {
								//Method for setting the model for vehicle type
								this.VehicleModel = new sap.ui.model.json.JSONModel();
								this.make = this.getView().byId("idVehicleMake").getValue();
								var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleModelSet?$filter=Type eq '" + this.type + "' and Make eq '" + this.make + "'";
								this.VehicleModel.loadData(oUri, null, false, "GET", false, false, null);
								this.getView().setModel(this.VehicleModel, "VehicleModel");
								this._onVehicleModelHelp();
							}, //end of onVehicleModel Method
							
							vehicleModelChange : function()
							{
								var modelValue = this.getView().byId("idModel").getValue();
								if(modelValue !="" && modelValue !=undefined)
									{
									this.getView().byId("idVariant").setEnabled(true);
									}
							},
					/*Vehicle Model Search Help End*/

					/*Vehicle Variant Search Help Begin*/
							_onVehicleVariantHelp: function(oController) {
								//method for vehicle variant value help
								// create value help dialog using fragment
								if (!this._onVehicleVariantHelpDialog) {
									this._onVehicleVariantHelpDialog = sap.ui.xmlfragment(
										"com.acute.spinsp.view.VehicleVariant", this);
									this.getView().addDependent(this._onVehicleVariantHelpDialog);
								}
								// open value help dialog
								this._onVehicleVariantHelpDialog.open();
							}, //end of onVehicleVariantHelp method
							_VehicleVariantClose: function(evt) {
								//get the selected vehicle variant
								var oSelectedItem = evt.getParameter("selectedItem");
								if (oSelectedItem) {
									//Fetching the selected value
									var sType = oSelectedItem.getTitle();
									this.getView().byId("idVariant").setValue(sType);
								}
								evt.getSource().getBinding("items").filter([]);
							},
							_VehicleVariantSearch: function(evt) {
								//method for serach in the Vehicle Variant
								var sValue = evt.getParameter("value");
								var oFilter = new sap.ui.model.Filter("Variant",sap.ui.model.FilterOperator.Contains,sValue);
					            evt.getSource().getBinding("items").filter([oFilter]);
							}, //end of _VehicleVariantSearch method
							onVehicleVariant: function(oEvt) {
								//Method for setting the model for vehicle variant
								this.VehicleVariant = new sap.ui.model.json.JSONModel();
								this.model = this.getView().byId("idModel").getValue();
								var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleVariantSet?$filter=Type eq '" + this.type + "' and Make eq '" + this.make + "' and Model eq '" + this.model + "'";
								this.VehicleVariant.loadData(oUri, null, false, "GET", false, false, null);
								this.getView().setModel(this.VehicleVariant, "VehicleVariant");
								this._onVehicleVariantHelp();
							}, //end of onVehicleVariant Method
					/*Vehicle Variant Search Help End*/
					
					
					
/**************************************************************************************************/
	
	onTicketCancelButton:function(oEvent){
		debugger;
		sap.ui.getCore().byId("idfrag").destroy();
		//window.history.back();
		//this._oDialog.destroy();
		//oDialog.destroy();
	},
					
	onInspCreate1:function(){
			debugger
			
	var allData = {};			
/*****************************BY RAM************************************/
	var check = false;
	var tktno2 = this.getView().byId("idTno").getValue();
	var tkDt = this.getView().byId("idTkDate").getValue();
	var ClaimType = this.ClaimType;	
	var ClaimDepo = this.RecDepoType;
	var CustType  = this.getView().byId("idCustomer").getSelectedKey();
	var FitType = this.getView().byId("idFitment").getSelectedKey();
	debugger
	var CreatedBy = this.getView().byId("idCreatedBy").getSelectedKey();
	var LattrRefNo = this.getView().byId("inpLetterRefNo").getValue();
    var LattrRefDt = this.getView().byId("inpLetterRefDt").getValue();
   
    
	var CustmMobile   = this.getView().byId("idPhone1").getValue();
	var CustAlt		  = this.getView().byId("idAltNo").getValue();  						
	var CustomerFname = this.getView().byId("idFname").getValue();
	var CustomerLname = this.getView().byId("idLname").getValue();
	var CustomerAddr1 = this.getView().byId("idAdd1").getValue();
	var CustomerAddr2 = this.getView().byId("idAdd2").getValue();						
	var CustomerLand1 = this.getView().byId("idCountry").getSelectedKey();
	var CustomerRegion = this.State;
	var CustomerCity2 = this.getView().byId("idDistrict").getValue();
	var CustomerCity1 = this.getView().byId("idLocation").getValue();
	var CustomerEmail = this.getView().byId("idEmail").getValue();
	
	var Dealar=this.DelarCodeType;
	var DlName=this.getView().byId("idDelarName").getValue();
	
	var FranhiseName 	= this.getView().byId("idFNameInput").getValue();
	var FranhisePName 	= this.getView().byId("idFPNameInput").getValue();						
	var FranhiseEmail 	= this.getView().byId("idFEmailInput").getValue();
	var FranhiseContact = this.getView().byId("idFPNoInput").getValue();
	var FranhiseLoc 	= this.getView().byId("idFLocationInput").getValue();
	
	var InspectionType  = this.getView().byId("idInspType").getSelectedKey();
	
	var VehicleType 	= this.getView().byId("idVehicle").getValue();
	var VehicleMake  	= this.getView().byId("idVehicleMake").getValue();		
	var VehicleModel 	= this.getView().byId("idModel").getValue();			
	var VehicleVariant 	= this.getView().byId("idVariant").getValue();
	var RegNo 			= this.getView().byId("idregno").getValue();
	var ChassisNo 		= this.getView().byId("idchassisInput").getValue();
	var KmsDone 		= this.getView().byId("idHours").getValue()!=""? parseInt(this.getView().byId("idHours").getValue()):0;
	var VechPurcMonth 	= this.getView().byId("idMonth").getSelectedKey();
	var VechPurcYear 	= this.getView().byId("idYear").getValue();	
	
	//for accepting data in S2
    allData.tktno2 		= tktno2; 
    allData.tkDt		= tkDt
    allData.ClaimType 	= ClaimType;
    allData.ClaimDepo 	= ClaimDepo;
    allData.CustType 	= CustType;
    allData.FitType 	= FitType;
    debugger
    allData.CreatedBy 	= CreatedBy;
    allData.LattrRefNo 	= LattrRefNo;
    allData.LattrRefDt 	= LattrRefDt;
    
    allData.CustmMobile   = CustmMobile;
    allData.CustAlt		  = CustAlt;  						
    allData.CustomerFname = CustomerFname;
	allData.CustomerLname = CustomerLname;
	allData.CustomerAddr1 = CustomerAddr1;
	allData.CustomerAddr2 = CustomerAddr2;						
	allData.CustomerLand1 = CustomerLand1;
	allData.CustomerRegion = CustomerRegion;
	allData.CustomerCity2 = CustomerCity2;
	allData.CustomerCity1 = CustomerCity1;
	allData.CustomerEmail = CustomerEmail;    
	
	allData.Dealar = Dealar;
	allData.DlName = DlName;
	debugger
	allData.InspectionType = InspectionType;
	
	allData.VehType    	= VehicleType;
	allData.VehMake		= VehicleMake;
	allData.VehModel	= VehicleModel;
	allData.VehVariant	= VehicleVariant;
	allData.RegNo		= RegNo;
	allData.ChassisNo	= ChassisNo;
	allData.KMDone		= KmsDone;
	allData.PurMonth	= VechPurcMonth;
	allData.PurYear		= VechPurcYear;
	
	allData.FranhiseName 	= FranhiseName;
	allData.FranhisePName 	= FranhisePName;						
	allData.FranhiseEmail 	= FranhiseEmail;
	allData.FranhiseContact = FranhiseContact;
	allData.FranhiseLoc 	= FranhiseLoc;
    
	var b = sap.ui.getCore().getModel("JModel");
    b.setData(allData);
 //**************************************************
    
    // push data to s1 model
    var userModel = new sap.ui.model.json.JSONModel();
    userModel.setData(allData);
	sap.ui.getCore().setModel(userModel, "s1Model");
	
	// Validatation 
		if(CustAlt.length < 10 && CustAlt.length != 0){
			sap.m.MessageToast.show("Phone No. can not be less than 10 digits"); 
			this.getView().byId("idAltNo").setValueState(sap.ui.core.ValueState.Error);
			return (false)
		}
		else {
			this.getView().byId("idAltNo").setValueState(sap.ui.core.ValueState.None);
		}
			
		if(CustomerEmail.length != 0){
			 var e= this.getView().byId("idEmail").getValue();
			 var atindex= e.indexOf('@');
			 var dotindex=e.lastIndexOf('.');
			if(atindex<1 || dotindex>=e.length-2 || dotindex-atindex<3){
			 sap.m.MessageToast.show("Invalid Email");				 
			this.getView().byId("idEmail").setValueState(sap.ui.core.ValueState.Error);	
			return (false)
			}
			else {
				this.getView().byId("idEmail").setValueState(sap.ui.core.ValueState.None);
			}
		}		
		
		debugger
		var dt = new Date();
		var mo = dt.getMonth();
		var yr = dt.getFullYear();
		if(VechPurcYear == yr && VechPurcMonth > mo){ 
		 sap.m.MessageToast.show("Purchase Date can not greater than current date");				 
		this.getView().byId("idMonth").addStyleClass("myStateError");
		return (false)
		}
		else {
			this.getView().byId("idMonth").removeStyleClass("myStateError");
		}
		
		if(FranhiseEmail.length != 0){
			 var e= this.getView().byId("idFEmailInput").getValue();
			 var atindex= e.indexOf('@');
			 var dotindex=e.lastIndexOf('.');
			if(atindex<1 || dotindex>=e.length-2 || dotindex-atindex<3){
			 sap.m.MessageToast.show("Invalid Email");				 
			this.getView().byId("idFEmailInput").setValueState(sap.ui.core.ValueState.Error);	
			return (false)
			}
			else {
				this.getView().byId("idFEmailInput").setValueState(sap.ui.core.ValueState.None);
			}
		}	
		
		if(FranhiseContact.length < 10 && FranhiseContact.length != 0){
			sap.m.MessageToast.show("Phone No. can not be less than 10 digits"); 
			this.getView().byId("idFPNoInput").setValueState(sap.ui.core.ValueState.Error);
			return (false)
		}
		else {
			this.getView().byId("idFPNoInput").setValueState(sap.ui.core.ValueState.None);
		}		
		
	
	if(tktno2 != ""){
		this.getView().byId("idTno").setValueState(sap.ui.core.ValueState.None);			
	}
    
    if(ClaimType == "" || ClaimType==undefined){
		check = true;
		this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.Error);
	}else {
		this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.None);	
	}

	if(CustType == "")
	{
    check = true;
	this.getView().byId("idCustomer").addStyleClass("myStateError");
	}
	else {
	this.getView().byId("idCustomer").removeStyleClass("myStateError");			
	}
		 
    if(ClaimDepo == "" || ClaimDepo==undefined){
		check = true;
		this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.Error);
	}else {
		this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.None);			
	}
    
    if(FitType == ""){
		check = true;
		this.getView().byId("idFitment").addStyleClass("myStateError");
	}else {
		this.getView().byId("idFitment").removeStyleClass("myStateError");			
	}    
    
	if(CreatedBy == ""){
		check = true;
		this.getView().byId("idCreatedBy").addStyleClass("myStateError");
	}
	else {
		this.getView().byId("idCreatedBy").removeStyleClass("myStateError");			
	}	
	
	
	if(LattrRefNo == ""){
		check = true;
		this.getView().byId("inpLetterRefNo").setValueState(sap.ui.core.ValueState.Error);
	}else {
		this.getView().byId("inpLetterRefNo").setValueState(sap.ui.core.ValueState.None);			
	}
	
	if(LattrRefDt == ""){
		check = true;
		this.getView().byId("inpLetterRefDt").setValueState(sap.ui.core.ValueState.Error);
	}else {
		this.getView().byId("inpLetterRefDt").setValueState(sap.ui.core.ValueState.None);			
	}
	
	if(CustomerFname == ""){
		check = true;
		this.getView().byId("idFname").setValueState(sap.ui.core.ValueState.Error);
	}else {
		this.getView().byId("idFname").setValueState(sap.ui.core.ValueState.None);			
	}	
	
	if(CustomerAddr1 == ""){
		check = true;
		this.getView().byId("idAdd1").setValueState(sap.ui.core.ValueState.Error);
	}else {
		this.getView().byId("idAdd1").setValueState(sap.ui.core.ValueState.None);			
	}
		
	if(CustomerCity1 == ""){
		check = true;
		this.getView().byId("idLocation").setValueState(sap.ui.core.ValueState.Error);
	}else {
		this.getView().byId("idLocation").setValueState(sap.ui.core.ValueState.None);			
	}
	
	debugger
	if(InspectionType == "")
	{
		check = true;
	this.getView().byId("idInspType").addStyleClass("myStateError");
	}	
	else {
	this.getView().byId("idInspType").removeStyleClass("myStateError");			
	}
	
	 
	/**/
	
	if(VehicleType == "")
	{
		check = true;
	this.getView().byId("idVehicle").setValueState(sap.ui.core.ValueState.Error);
	}	
	else {
	this.getView().byId("idVehicle").setValueState(sap.ui.core.ValueState.None);			
	}			
	
	if(FitType != "REP" && VehicleMake == "" && FitType != "")
	{
		check = true;
	this.getView().byId("idVehicleMake").setValueState(sap.ui.core.ValueState.Error);
	}
	else {
	this.getView().byId("idVehicleMake").setValueState(sap.ui.core.ValueState.None);				
	}			

	if(FitType != "REP" && VehicleModel == "" && FitType != "")
	{
		check = true;
	this.getView().byId("idModel").setValueState(sap.ui.core.ValueState.Error);
	}
	else {
	this.getView().byId("idModel").setValueState(sap.ui.core.ValueState.None);				
	}

	if(FitType != "REP" && VehicleVariant == "" && FitType != "")
	{
		check = true;
	this.getView().byId("idVariant").setValueState(sap.ui.core.ValueState.Error);
	}
	else {
	this.getView().byId("idVariant").setValueState(sap.ui.core.ValueState.None);				
	}			

	if(FitType != "REP" && RegNo == "" && FitType != "")
	{
		check = true;
	this.getView().byId("idregno").setValueState(sap.ui.core.ValueState.Error);
	}
	else {
	this.getView().byId("idregno").setValueState(sap.ui.core.ValueState.None);				
	}							

	if(FitType != "REP" && KmsDone == "" && FitType != "")
	{
		check = true;
	this.getView().byId("idHours").setValueState(sap.ui.core.ValueState.Error);
	}
	else {
	this.getView().byId("idHours").setValueState(sap.ui.core.ValueState.None);				
	}		
	
	debugger
	if(FitType != "REP" && VechPurcMonth == "0" && FitType != "")
	{
		check = true;
	this.getView().byId("idMonth").addStyleClass("myStateError");
	}
	else {
	this.getView().byId("idMonth").removeStyleClass("myStateError");				
	}				
	
	if(FitType != "REP" && VechPurcYear == "" && FitType != "")
	{
		check = true;
	this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.Error);
	}
	else {
	this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.None);				
	}		
	
	if(Dealar == "" || Dealar ==undefined ){
		check = true;
		this.getView().byId("idDelar").setValueState(sap.ui.core.ValueState.Error);
	}else {
		this.getView().byId("idDelar").setValueState(sap.ui.core.ValueState.None);			
	}	
	
	
	if(VechPurcMonth != "0" && VechPurcYear == ""){
		check = true;
		this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.Error);
	}else{
		this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.None);
	}
	
	if(VechPurcMonth == "0" && VechPurcYear != ""){
		check = true;
		this.getView().byId("idMonth").addStyleClass("myStateError");
	}else{
		this.getView().byId("idMonth").removeStyleClass("myStateError");
	}	
	
	
	if(FitType == "OEM" && FranhiseName == "")
	{
		check = true;
	this.getView().byId("idFNameInput").setValueState(sap.ui.core.ValueState.Error);
	}
	else {
	this.getView().byId("idFNameInput").setValueState(sap.ui.core.ValueState.None);				
	}			
	
	if(FitType == "OEM" && FranhiseLoc == "")
	{
		check = true;
	this.getView().byId("idFLocationInput").setValueState(sap.ui.core.ValueState.Error);
	}
	else {
	this.getView().byId("idFLocationInput").setValueState(sap.ui.core.ValueState.None);			
	}	
	
	if(FitType == "OEM" && FranhisePName == "" && CustType == "03")
	{
		check = true;
	this.getView().byId("idFPNameInput").setValueState(sap.ui.core.ValueState.Error);
	}
	else {
	this.getView().byId("idFPNameInput").setValueState(sap.ui.core.ValueState.None);			
	}
	
	if(FitType == "OEM" && FranhiseEmail == "" && CustType == "03")
	{
		check = true;
	this.getView().byId("idFEmailInput").setValueState(sap.ui.core.ValueState.Error);
	}
	else {
	this.getView().byId("idFEmailInput").setValueState(sap.ui.core.ValueState.None);			
	}
	
	if(FitType == "OEM" && FranhiseContact == "" && CustType == "03")
	{
		check = true;
	this.getView().byId("idFPNoInput").setValueState(sap.ui.core.ValueState.Error);
	}
	else {
	this.getView().byId("idFPNoInput").setValueState(sap.ui.core.ValueState.None);			
	}	
	 
		
	if (check == true){
		sap.m.MessageBox.show("Please fill all Required Fields.", {
      title: "ERROR",
      icon:sap.m.MessageBox.Icon.ERROR, 
		});
		return;
	}
	
	debugger
/*	var claimReceiveDepo 	= this.getView().byId("iddepo").getValue();
	var fitmentType 		= this.getView().byId("idFitment").getSelectedKey();
	var createdBy 			= this.getView().byId("idCreatedBy").getSelectedKey();
	var letterRefNo 		= this.getView().byId("inpLetterRefNo").getValue();
	var letterRefDate 		= this.getView().byId("inpLetterRefDt").getValue();
	var dealerVal 			= this.getView().byId("idDelar").getValue();
	var InspectionType		= this.getView().byId("idInspType").getSelectedKey();*/
	

/*	if(claimReceiveDepo && fitmentType && createdBy && letterRefNo && letterRefDate && dealerVal){*/
	if (!this.IntialFrag) {
		this.IntialFrag = sap.ui.xmlfragment(
				"com.acute.spinsp.view.Intial", this);
			this.getView().addDependent(this.IntialFrag);
		this.IntialFrag.open();
	}
/*	}else{
		sap.m.MessageToast.show("Please fill all mandatory fields");
	}*/
		
		
/*	if (!this.IntialFrag) {
		this.IntialFrag = sap.ui.xmlfragment(
			"com.acute.spinsp.view.Intial", this);
		this.getView().addDependent(this.IntialFrag);
		this.IntialFrag.open();
	}*/
	
	
	return;
	
/***********************************************************************/		
	
/*Data.EMessage="";
Data.ClaimRecDepo=this.RecDepoType;
Data.ClaimTyp=this.ClaimType;
Data.ClaimTypDescr=claimType;
Data.ClaimDate=this.DateNew(null);
if(this.getView().byId("idTkDate").getVisible()){
Data.TicketNo=TicketNO;
Data.TicketDate=this.DateNew(this.getView().byId("idTkDate").getDateValue());
}else{
	Data.TicketNo="";
	Data.TicketDate=this.DateNew(null);	
}
Data.LetterRefNo=letterRefNo;
Data.LetterRefDt=letterRefDate;
Data.FitType=FitType;
Data.CustType=custType;
Data.CustTypeDescr=custType1;
Data.CustomerTelf1=CustmMobile;
Data.CustomerFname=CustomerFname;
Data.CustomerLname=CustomerLname;
Data.CustomerEmail=CustomerEmail;
Data.CustomerAddr1=CustomerAddr1;
Data.CustomerAddr2=CustomerAddr2;
Data.CustomerCity1=CustomerCity1;
Data.CustomerCity2=this.District;
Data.CustomerRegion=this.State;
Data.CustomerLand1=CustomerLand1;
Data.CustomerPstlz=CustomerPstlz;
Data.DealerCode=this.DelarCodeType;
Data.CompanyName=CompanyName;
Data.FranhiseName=FranhiseName;
Data.FranhiseContact=FranhiseContact;
Data.ClaimStatus="01";
Data.InspectName = inspectorName;*/
//Data.InspCode = inspCode;

that.Data=Data
/*if (!this.IntialFrag) {
this.IntialFrag = sap.ui.xmlfragment(
	"com.acute.spinsp.view.Intial", this);
this.getView().addDependent(this.IntialFrag);
this.IntialFrag.open();
}*/


// open value help dialog  //By Ram
/*if((LattrRefNo != "") && (LattrRefDt != "") && (LattrRefDt != "") && (CreatedBy != "")){
this.IntialFrag.open();
} else if
	((LattrRefNo != "") && (LattrRefDt != "") && (CreatedBy != "")){
	this.getRouter().navTo("S2");

	}*/


		},
					
/*************************************************************************************************/					
					
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
							debugger
					},
					
					onMonthChange: function(e){
						var selectedMonth = parseInt(e.getSource().getSelectedKey());
						var d = new Date();
						var m = d.getMonth() + 1;
						var y = d.getFullYear(); 
						var year = this.getView().byId("idYear").getValue();
						if(m < selectedMonth && parseInt(year) === y){
							sap.m.MessageToast.show("Month can not be greater than current month.");
							this.getView().byId("idMonth").setSelectedKey("0");
						}
						
						
					},
					
					YearValid : function(oEvent)
					{ 
						debugger
						var val = oEvent.getSource().getValue();
						if(val.length < 4){
							sap.m.MessageToast.show("Please enter 4 digit number.");
							oEvent.getSource().setValue();
						}
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
									}else if(val == y){
										var selectedMonth = parseInt(this.getView().byId("idMonth").getSelectedKey());
										var d = new Date();
										var m = d.getMonth() + 1;
										if(m < selectedMonth){
											sap.m.MessageToast.show("Month can not be greater than current month.");
											this.getView().byId("idMonth").setSelectedKey("0");
										}
									}
	 	
								}
							else
							{					
							}
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
			getRouter: function() {
			    	       return new sap.ui.core.UIComponent.getRouterFor(this);
			    	   },
			    	   
			    	   onChangeClaimRecDepot: function(e){
			    		   this.getView().byId("idDelar").setValue();
			    		   this.getView().byId("idDelarName").setValue();
			    		   this.getView().byId("idStreet").setValue();
			    		   this.getView().byId("iddelCity").setValue();
			    		   this.getView().byId("iddelDist").setValue();
			    		   this.getView().byId("idDealPos").setValue();
			    		   this.getView().byId("idDealMobil").setValue();
			    		   this.getView().byId("idFNameInput").setValue();
			    		   this.getView().byId("idFPNameInput").setValue();
			    		   this.getView().byId("idFEmailInput").setValue();
			    		   this.getView().byId("idFPNoInput").setValue();
			    		   this.getView().byId("idFLocationInput").setValue();
			    		   
			    	   }

/*************************************************************/			    	   

				});