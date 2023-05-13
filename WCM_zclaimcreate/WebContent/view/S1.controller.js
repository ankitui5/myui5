jQuery.sap.require("sap.ui.core.mvc.Controller");
// jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("com.acute.ticketClaim.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
var DataArticles, that;
sap.ui.core.mvc.Controller
		.extend(
				"com.acute.ticketClaim.view.S1",
				{

					onInit : function() {
						this.newBusy = new sap.m.BusyDialog();
//						**************added by Hans (for adding tyre detail table)***********
						this.tyreTable=[];
						var tyreDetailsJModel= new sap.ui.model.json.JSONModel();
						this.getView().setModel(tyreDetailsJModel,"tyreDetailsJModel");
						
//						*************************************
						
//						**************added by Hans (for adding tube detail table)***********
						this.tubeTable=[];
						var tubeDetailsJModel= new sap.ui.model.json.JSONModel();
						this.getView().setModel(tubeDetailsJModel,"tubeDetailsJModel");
						
//						*************************************
//						**************added by Hans (for adding flap detail table)***********
						this.flapTable=[];
						var flapDetailsJModel= new sap.ui.model.json.JSONModel();
						this.getView().setModel(flapDetailsJModel,"flapDetailsJModel");
						
//						*************************************
						

						// this.newBusy.open();
						this.model = this.getOwnerComponent().getModel();

						that = this;

						if (!jQuery.support.touch) {
							this.getView().addStyleClass("sapUiSizeCompact");
						}
						if (sap.ui.Device.system.desktop) {

						}
						if (!this.IntialFrag) {
							this.IntialFrag = sap.ui.xmlfragment(
								"com.acute.ticketClaim.view.Intial", this);
							this.getView().addDependent(this.IntialFrag);
						}
						
						var docDate = new Date()
						 var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
					            pattern : "dd.MM.yyyy"
							});
						 var currentdate =  oDateFormat.format(docDate);
						 this.getView().byId("idClaimDate").setValue(currentdate);
						 
						 // open value help dialog
						this.IntialFrag.open();
						this.onTypeofCustomer();
						this.onTyreFitMent();						
						this.onTicketSource();						
					},
					
					onTicketCancelButton:function(){
						window.history.back();
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
					onTicket : function() {
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpTicketSet";
				        var jModel = new sap.ui.model.json.JSONModel();
				            jModel.loadData(sPath, null, false,"GET",false, false, null);
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
							debugger
							sap.ui.getCore().byId("idTno").setValue(oSelectedItem.getTitle());
							sap.ui.getCore().byId("idTno").setValueState("None");
							that.onEnter();
						}
					},
					
					
					onTypeofClaim : function() {
						debugger
						var Select=sap.ui.getCore().byId("RD3").getSelected();
						if(Select){
						 var flag = 'W';	
						}else {
						var flag = 'N';
						 } 		

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
						this.getView().byId("idClaim").setValue(oSelectedItem.getTitle());
						this.ClaimType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
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
//							this.getView().byId("idIconTabBarStretchContent").setVisible(true);
							this.getView().byId("idDelar").setEnabled(true);
				/*			this.getView().byId("Id_bt1").setVisible(true);		*/					
						}
					},					
		
					
					onTicketCloseButton:function(){
						var TicketGrp = this.IntialFrag.getContent()[0].getContent()[0].getContent()[0].getSelectedIndex();
			        	var claimTYpe = this.getView().byId("idClaim");
			        	var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
				            pattern : "dd.MM.yyyy"
						});
			        	var idTkDate = this.getView().byId("idTkDate");
			        	if(idTkDate.getValue() !== ""){
						 idTkDate.setValue(oDateFormat.format(new Date(idTkDate.getValue())));
			        	}
						if(TicketGrp === 0){
				        	var v = sap.ui.getCore().byId("idTno").getValue();
				        	if(v == ""){
				        		sap.m.MessageBox.show("Please enter Ticket Number", {
									title : "Error",
									icon : sap.m.MessageBox.Icon.ERROR,
									onClose : function() {
										
									}
								});
				        		sap.ui.getCore().byId("idTno").setValueState("Error");
				        		return;
				        	}else{
				        		sap.ui.getCore().byId("idTno").setValueState("None");
				        	}
				        	
			        	}
						debugger 
						
						var rd3=sap.ui.getCore().byId("RD3").getSelected();
			        	if(rd3){
			        		this.ClaimType = "WR10";
			        		claimTYpe.setValue("Warranty Replacement Sales Claims (WR10)");
			        	}
						
						var rd4=sap.ui.getCore().byId("RD4").getSelected();
						if(rd4){
							this.ClaimType = "ND10";
			        		claimTYpe.setValue("New Defective Replacement Sales Claims (ND10)");
			        	}
			        	
						
						var Select=sap.ui.getCore().byId("RD1").getSelected();
						if(Select){
							this.getView().byId("idTicketSource").setEnabled(false);
							this.getView().byId("idPNo").setEnabled(false);
						}
						
						var Select=sap.ui.getCore().byId("RD2").getSelected();
						if(Select){
							debugger
							var docDate = new Date();
							 var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
						            pattern : "dd.MM.yyyy"
								});
							 var currentdate =  oDateFormat.format(docDate);
							 this.getView().byId("idTkDate").setValue(currentdate);
						}
						
						var Select=sap.ui.getCore().byId("RD2").getSelected();
						if(Select){
							that.getView().byId("idPhone1").setEnabled(true);
							that.getView().byId("idAltNo").setEnabled(true);							
							that.getView().byId("idFname").setEnabled(true);
							that.getView().byId("idLname").setEnabled(true);
							that.getView().byId("idAdd1").setEnabled(true);
							that.getView().byId("idAdd2").setEnabled(true);
							that.getView().byId("idCountry").setEnabled(false);
							that.getView().byId("idState").setEnabled(true);
							that.getView().byId("idDistrict").setEnabled(true);
							that.getView().byId("idCity").setEnabled(true);							
							that.getView().byId("idEmail").setEnabled(true);
						}	

						this.IntialFrag.close();	
					},
					
				
					onEnter : function() {
						debugger
						var that = this;						
						var ticket = sap.ui.getCore().byId("idTno").getValue();
						
						var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
						var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
						oReadModel.setHeaders({
							"Content-Type" : "application/atom+xml"
						});
						var fncSuccess = function(oData, oResponse) // sucess
																	// function
						{
							if(oData.TicketStatus!="07" ){
							var ary = {
								"d" : oData
							}
							
					        var jModel = new sap.ui.model.json.JSONModel(ary);
					        debugger
					        that.getView().setModel(jModel , "jModel");
					        that.data = jModel.getData();

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
							} else {}
 
							that.Dealer = that.data.d.DealerCode;
							that.State = that.data.d.CustomerRegion;
							
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
						oReadModel.read("/GetTicketDataSet(ITicketNo='"
								+ ticket + "')", {
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
					var _self = this;
					var Table=this.getView().byId("tblDetail");
					var arr=[];
					if(Table.getItems().length > 0){
					var length = Table.getItems().length-1;
					var data = Table.getItems()[length].getCells();
						for(var i = 0; i<data.length-1;i++){
							if(i !== 1 && i !== 4){
								arr[i] = data[i].getValue();
							}else{
								arr[i] = data[i].getText();
							}
						}
					}else{
						for(var i = 0; i<Table.getItems().length;i++){
							arr[i] = "";
						}
					}
					var templete= new sap.m.ColumnListItem({
        	            cells: [ new sap.m.Input({
        	                valueHelpRequest:[that.IteamCodeTyre,that],
        	                valueHelpOnly:true,
        	                showValueHelp:true,
        	                value : arr[0]
        	            }), new sap.m.Text({
        	            	if(data){
        	                	text : arr[1];
        	                }        	                
        	            }),new sap.m.Input({maxLength:11,
        	            	
        	                value : arr[2],
        	            	change:function()
        	            	{
        	            		debugger;
        	            		var stencilNumber = this.getValue();
        	            		var itemCode = this.getParent().mAggregations.cells[0].getValue();
        	            		var depoValue = _self.getView().byId("iddepo").getValue();
        	            		var depoSplit = depoValue.split("(");
        	            		var depoNumber = depoSplit[1].substr(0,4);
        	            		var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
        						var oReadModel = new sap.ui.model.odata.ODataModel(
        								sServiceUrl);
        						oReadModel.setHeaders({
        							"Content-Type" : "application/atom+xml"
        						});
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
        						var fncSuccess = function(oData, oResponse){
        							var _self1 = _self;
        							if (oData.Message != "") {
        								that.stencilFlag = "";
        								sap.m.MessageBox.show(oData.Message, {
        									title : "Error",
        									icon : sap.m.MessageBox.Icon.ERROR,
        									onClose : function() {
        									//	_self1.getView().byId("idTyreStn").setValue("");
        									}
        								});
        							}
        							else{
        								that.stencilFlag = "X";
        							}
        						}
        						oReadModel.read("ValidateStencilNumberSet(ClaimRecDepo='"+depoNumber+"',ItemCode='"+itemCode+"',StencilNo='"+stencilNumber+"')",
        								{
        							success : fncSuccess,
        							error : fncError
        						});
        	            	}
        	            }),new sap.m.Input({
        	            		value : arr[3]        	               
        	            }),
        	            new sap.m.Text({	        	            	
        	                	value : arr[4]        	              
        	            }),new sap.m.Input({maxLength:30,	        	            	
        	                	value : arr[5]        	               
        	            }),new sap.m.Input({maxLength:30,        	            	
        	                	value : arr[6]        	                
        	            }),new sap.m.Input({maxLength:30,	        	            
        	                	value : arr[7]
        	            }),new sap.m.Input({maxLength:30,	        	            
    	                	value : arr[8]
        	            }),new sap.m.Input({maxLength:30,	        	            
    	                	value : arr[9]
        	            }),new sap.m.Input({maxLength:30,	        	            
    	                	value : arr[10]
        	            }),new sap.m.Input({maxLength:30,	        	            
    	                	value : arr[11]
        	            }),new sap.m.Input({maxLength:30,	        	            
    	                	value : arr[12]
        	             	             
        	            }),new sap.m.Button({press:[that.onDelete,that],type:"Reject",icon:"sap-icon://delete"})],
        	        	
        	        });
					Table.addItem(templete);
				},
				
				
				handleButtonPress1:function(){
					var Table=this.getView().byId("tblDetail1");
//					var arr=[];
//					if(Table.getItems().length > 0){
//						var length = Table.getItems().length-1;
//						var data = Table.getItems()[length].getCells();
//						arr[0] = data[0].getValue();
//						arr[1] = data[1].getText();
//					}else{
//						arr[0] = "";
//						arr[1] = "";
//					}
					
					var arr=[];
					if(Table.getItems().length > 0){
					var length = Table.getItems().length-1;
					var data = Table.getItems()[length].getCells();
						for(var i = 0; i<data.length-1;i++){
							
								arr[i] = data[i].getValue();
							
						}
					}else{
						for(var i = 0; i<Table.getItems().length;i++){
							arr[i] = "";
						}
					}
					var templete= new sap.m.ColumnListItem({
        	            cells: [ new sap.m.Input({
        	                valueHelpRequest:[that.IteamCodeFlap,that],
        	                valueHelpOnly:true,
        	                showValueHelp:true,
        	                value:arr[0]
        	                
        	            }), new sap.m.Input({
        	            	value:arr[1]
        	                
        	            }), new sap.m.Input({
        	            	value:arr[2]
        	                
        	            }), new sap.m.Input({
        	            	value:arr[3]
        	                
        	            }),new sap.m.Button({press:[that.onDelete,that],type:"Reject",icon:"sap-icon://delete"}) ],
        	        	
        	        });
					Table.addItem(templete);
				},
				onDelete:function(evt){
					evt.getSource().getParent().getParent().removeItem(evt.getSource().getParent());
				},
				
				handleButtonPress2:function(){
					var Table=this.getView().byId("tblDetail2");
//					var arr=[];
//					if(Table.getItems().length > 0){
//						var length = Table.getItems().length-1;
//						var data = Table.getItems()[length].getCells();
//						arr[0] = data[0].getValue();
//						arr[1] = data[1].getText();
//					}else{
//						arr[0] = "";
//						arr[1] = "";
//					}
					var arr=[];
					if(Table.getItems().length > 0){
					var length = Table.getItems().length-1;
					var data = Table.getItems()[length].getCells();
						for(var i = 0; i<data.length-1;i++){
							
								arr[i] = data[i].getValue();
							
						}
					}else{
						for(var i = 0; i<Table.getItems().length;i++){
							arr[i] = "";
						}
					}
					var templete= new sap.m.ColumnListItem({
        	            cells: [ new sap.m.Input({
        	                valueHelpRequest:[that.IteamCodeTube,that],
        	                valueHelpOnly:true,
        	                showValueHelp:true,
        	                value: arr[0]
        	                
        	            }), new sap.m.Input({
        	            	value: arr[1]
        	                
        	            }), new sap.m.Input({
        	            	value: arr[2]
        	                
        	            }), new sap.m.Input({
        	            	value: arr[3]
        	                
        	            }),new sap.m.Button({press:[that.onDelete,that],type:"Reject",icon:"sap-icon://delete"}) ],
        	        	
        	        });
					Table.addItem(templete);
				},
				
				
			IteamCodeTyre:function(evt){
					this.TyreTypeCode=evt.getSource().getId();
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
												 customData: [{ 
													 Type:"sap.ui.core.CustomData",
													    key:"Key",
													    value:"{ItemCode}" 
													   },
													   {
												    Type:"sap.ui.core.CustomData",
													    key:"PrdDesc",
													    value:"{PrdtCatDesc}"  
												     }]	 
												
												
									/*			customData : [ new sap.ui.core.CustomData(
														{
															key : "Key",
															value : "{ItemCode}"
														}) ],*/

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
					var TyreTypeCode = sap.ui.getCore().byId(this.TyreTypeCode);
					if (oSelectedItem) {
						TyreTypeCode.setValue(
								oSelectedItem.getDescription());
						
						TyreTypeCode.getParent().getCells()[1].setValue(oSelectedItem.getTitle());
						
						var prddesc = oSelectedItem.getCustomData()[1].getValue();
						TyreTypeCode.getParent().getCells()[12].setValue(prddesc);
						
						
//						debugger
//						var obj=oSelectedItem.getBindingContext().getObject();
//						this.TyreTypeCode.getCells()[1].setText(obj.ItemDescr);
//						//this.TyreTypeCode.getCells()[4].setText(obj.PrdtCat);
//						this.TyreTypeCode.getCells()[12].setText(obj.PrdtCatDesc);
						
						//this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
						
					}

				},

/*					IteamCodeTube:function(evt){
						this.TubeTypeCode=evt.getSource().getId();
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq 'TUBE' and IClaimType eq '"+this.ClaimType+"' and IRecvDepo eq '"+this.RecDepoType+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTubeSelectDialog = new sap.m.SelectDialog(
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
						_valueHelpTubeSelectDialog.setModel(jModel);
						_valueHelpTubeSelectDialog.open();
					},
					_handleTubeJKDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						var TubeTypeCode = sap.ui.getCOre().byId(this.TubeTypeCode);
						
						if (oSelectedItem) {
							TubeTypeCode.setValue(
									oSelectedItem.getDescription());
							TubeTypeCode.getParent().getCells()[1].setValue(oSelectedItem.getTitle());
							debugger
//							var obj=oSelectedItem.getBindingContext().getObject();
//							this.TubeTypeCode.getCells()[1].setText(obj.ItemDescr);
							//this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
						}
					},*/
					
					IteamCodeTube:function(evt){
						debugger
						this.TubeTypeCode=evt.getSource().getId();
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq 'TUBE' and IClaimType eq '"+this.ClaimType+"' and IRecvDepo eq '"+this.RecDepoType+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTubeSelectDialog = new sap.m.SelectDialog(
								{
									title : "Select Tube Code",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem({
											 title : "{ItemDescr}",
											 description:"{ItemCode}",
										/*	customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{ItemCode}"
															}) ],*/
											 customData: [{ 
												 Type:"sap.ui.core.CustomData",
												    key:"Key",
												    value:"{ItemCode}" 
												   },
												   {
											    Type:"sap.ui.core.CustomData",
												    key:"PrdDesc",
												    value:"{PrdtCatDesc}"  
											     }]	 
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
						_valueHelpTubeSelectDialog.setModel(jModel);
						_valueHelpTubeSelectDialog.open();
					},
					_handleTubeJKDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						var TubeTypeCode = sap.ui.getCore().byId(this.TubeTypeCode);
						if (oSelectedItem) {
							TubeTypeCode.setValue(
									oSelectedItem.getDescription());
							TubeTypeCode.getParent().getCells()[1].setValue(oSelectedItem.getTitle());
							
							debugger
							var prddesc = oSelectedItem.getCustomData()[1].getValue();
							TubeTypeCode.getParent().getCells()[3].setValue(prddesc);
						}
					},					
					
					IteamCodeFlap:function(evt){
						debugger
						this.FlapTypeCode=evt.getSource().getId();
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq 'FLAP' and IClaimType eq '"+this.ClaimType+"' and IRecvDepo eq '"+this.RecDepoType+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpFlapSelectDialog = new sap.m.SelectDialog(
								{
									title : "Select Flap Code",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem({
											 title : "{ItemDescr}",
											 description:"{ItemCode}",
										/*	customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{ItemCode}"
															}) ],*/
											 customData: [{ 
												 Type:"sap.ui.core.CustomData",
												    key:"Key",
												    value:"{ItemCode}" 
												   },
												   {
											    Type:"sap.ui.core.CustomData",
												    key:"PrdDesc",
												    value:"{PrdtCatDesc}"  
											     }]	 
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
									confirm : [ this._handleFlapJKDealClose, this ],
									cancel : [ this._handleFlapJKDealClose, this ]
								});
						_valueHelpFlapSelectDialog.setModel(jModel);
						_valueHelpFlapSelectDialog.open();
					},
					_handleFlapJKDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						var FlapTypeCode = sap.ui.getCore().byId(this.FlapTypeCode);
						if (oSelectedItem) {
							FlapTypeCode.setValue(
									oSelectedItem.getDescription());
							FlapTypeCode.getParent().getCells()[1].setValue(oSelectedItem.getTitle());
							
							debugger
							var prddesc = oSelectedItem.getCustomData()[1].getValue();
							FlapTypeCode.getParent().getCells()[3].setValue(prddesc);
						}
					},
					
					onTabSelected: function(evt)
					{
						var selectedKey = evt.getSource().getSelectedKey();
						that.itemType = selectedKey;
						if(selectedKey == "TYRE")
						{
//						this.getView().byId("tblDetail1").removeAllItems();
//						this.getView().byId("tblDetail2").removeAllItems();
						}
					else if(selectedKey == "FLAP")
						{
//						this.getView().byId("tblDetail").removeAllItems();
//						this.getView().byId("tblDetail2").removeAllItems();
						}
					else
						{
//						this.getView().byId("tblDetail1").removeAllItems();
//						this.getView().byId("tblDetail").removeAllItems();
						}
					},
		
		onClaimCreate:function(){			

			var check = false;			
						debugger						
                        
						var ClaimType = this.ClaimType;							
						var TicketNo  = this.getView().byId("idTicketNo").getValue();	 
						var CustType  = this.getView().byId("idCustomer").getSelectedKey();
						var Source 	  = this.getView().byId("idTicketSource").getSelectedKey();
						var ClaimDepo = this.RecDepoType;						
						var TicketDate= this.getView().byId("idTkDate").getValue();
						var FitType   = this.getView().byId("idFitment").getSelectedKey();
						var NoProd    = this.getView().byId("idPNo").getValue();
						var RefNo 	  = this.getView().byId("inpLetterRefNo").getValue();
						var RefDt     = this.getView().byId("inpLetterRefDt").getValue();
						var VechMonth = this.getView().byId("idMonth").getSelectedKey();
						var VechYear  = this.getView().byId("idYear").getValue();						
						
						
						var CustmMobile   = this.getView().byId("idPhone1").getValue();
						var CustAlt		  = this.getView().byId("idAltNo").getValue();  						
						var CustomerFname = this.getView().byId("idFname").getValue();
						var CustomerLname = this.getView().byId("idLname").getValue();
						var CustomerAddr1 = this.getView().byId("idAdd1").getValue();
						var CustomerAddr2 = this.getView().byId("idAdd2").getValue();						
						var CustomerLand1 = this.getView().byId("idCountry").getSelectedKey();
						var CustomerRegion = this.State;
						var CustomerCity2 = this.getView().byId("idDistrict").getValue();
						var CustomerCity1 = this.getView().byId("idCity").getValue();
						var CustomerEmail = this.getView().byId("idEmail").getValue();
						
						var Dealar=this.DelarCodeType;
						
						var FranhiseName 	= this.getView().byId("idFNameInput").getValue();
						var FranhisePName 	= this.getView().byId("idFPNameInput").getValue();						
						var FranhiseEmail 	= this.getView().byId("idFEmailInput").getValue();
						var FranhiseContact = this.getView().byId("idFPNoInput").getValue();
						var FranhiseLoc 	= this.getView().byId("idFLocationInput").getValue();						
						
						var idTyreDetailsTable= this.getView().byId("idTyreDetailsTable");
						var idTubeDetailsTable= this.getView().byId("idTubeDetailsTable");
						var idflapDetailsTable= this.getView().byId("idflapDetailsTable");
						
						// Validations
						var dt = new Date();
						var mo = dt.getMonth();
						var yr = dt.getFullYear();
						var mn = VechMonth;
						mn.replace(/^0+/, '');
						if(VechYear == yr && mn > mo){ 
						 sap.m.MessageToast.show("Purchase Date can not greater than current date");				 
						this.getView().byId("idMonth").addStyleClass("myStateError");
						return (false)
						}
						else {
						this.getView().byId("idMonth").removeStyleClass("myStateError");
						}
						
						if(VechMonth == "00" && VechYear != "")
						{
						sap.m.MessageToast.show("Please input Purchase Month");						
						this.getView().byId("idMonth").addStyleClass("myStateError");
						return (false)
						}
						else {
							this.getView().byId("idMonth").removeStyleClass("myStateError");	
						}
						
						if(VechMonth != "00" && VechYear == "")
						{
						sap.m.MessageToast.show("Please input Purchase Year");						
						this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.Error);
						return (false)
						}
						else {
						this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.None);	
						}							

						if(CustAlt.length < 10 && CustAlt.length != 0){
							sap.m.MessageToast.show("Phone No. can not be less than 10 digits"); 
							this.getView().byId("idAltNo").setValueState(sap.ui.core.ValueState.Error);
							return (false)
						}
						else {
							this.getView().byId("idAltNo").setValueState(sap.ui.core.ValueState.None);
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
						
						debugger
					  						
						// Mandatory  						
						if(ClaimType == "")
						{
					    check = true;
						this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
						this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.None);			
						}
						
						if(ClaimDepo == "" || ClaimDepo == undefined)
						{
					    check = true;
						this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
						this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.None);			
						}
						
						if(CustType == "")
						{
					    check = true;
						this.getView().byId("idCustomer").addStyleClass("myStateError");
						}
						else {
						this.getView().byId("idCustomer").removeStyleClass("myStateError");			
						}
						
						if(FitType == "")
						{
						check = true;
						this.getView().byId("idFitment").addStyleClass("myStateError");       
						}
						else {
						this.getView().byId("idFitment").removeStyleClass("myStateError");			
						}
						 
					    debugger	
						if(Source == "")
						{
							check = true;				
						this.getView().byId("idTicketSource").addStyleClass("myStateError");
						}
						else {
						this.getView().byId("idTicketSource").removeStyleClass("myStateError");			
						}
					    
						if(RefNo == "")
						{
							check = true;				
						this.getView().byId("inpLetterRefNo").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
						this.getView().byId("inpLetterRefNo").setValueState(sap.ui.core.ValueState.None);		
						}
						
						debugger
						if(RefDt == "")
						{
							check = true;				
						this.getView().byId("inpLetterRefDt").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
						this.getView().byId("inpLetterRefDt").setValueState(sap.ui.core.ValueState.None);		
						}
						
						if(FitType != "REP" && VechMonth == "00" && FitType != "")
						{
							check = true;
						this.getView().byId("idMonth").addStyleClass("myStateError");
						}
						else {
						this.getView().byId("idMonth").removeStyleClass("myStateError");				
						}				
						
						if(FitType != "REP" && VechYear == "" && FitType != "")
						{
							check = true;
						this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
							this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.None);
						}												
						
						if(NoProd == "")
						{
							check = true;
						this.getView().byId("idPNo").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
							this.getView().byId("idPNo").setValueState(sap.ui.core.ValueState.None);
						}	
						
						
						if(CustmMobile == "")
						{
							check = true;
						this.getView().byId("idPhone1").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
						this.getView().byId("idPhone1").setValueState(sap.ui.core.ValueState.None);				
						}	
						
						if(CustomerFname == "")
						{
							check = true;
						this.getView().byId("idFname").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
						this.getView().byId("idFname").setValueState(sap.ui.core.ValueState.None);				
						}	
						
						if(CustomerAddr1 == "")
						{
							check = true;
						this.getView().byId("idAdd1").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
						this.getView().byId("idAdd1").setValueState(sap.ui.core.ValueState.None);				
						}	
						
						if(CustomerRegion == "" || CustomerRegion == undefined)
						{
						check = true;
						this.getView().byId("idState").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
						this.getView().byId("idState").setValueState(sap.ui.core.ValueState.None);			
						}	
						
						if(CustomerCity2 == "")
						{
						check = true;
						this.getView().byId("idDistrict").setValueState(sap.ui.core.ValueState.Error);	
						}
						else {
						this.getView().byId("idDistrict").setValueState(sap.ui.core.ValueState.None);				
						}	
						
						if(CustomerCity1 == "")
						{
						check = true;
						this.getView().byId("idCity").setValueState(sap.ui.core.ValueState.Error);	
						}
						else {
						this.getView().byId("idCity").setValueState(sap.ui.core.ValueState.None);				
						}	
												
						
						if(Dealar == "" || Dealar == undefined)
						{
							check = true;
						this.getView().byId("idDelar").setValueState(sap.ui.core.ValueState.Error);
						}
						else {
							this.getView().byId("idDelar").setValueState(sap.ui.core.ValueState.None);
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
						
						
//						(CHeck Table is empty or not)*************************
						if(idTyreDetailsTable.getRows().length <= 0 && idTubeDetailsTable.getRows().length <= 0 && idflapDetailsTable.getRows().length <= 0){
							sap.m.MessageBox.alert("No Item Exists");
							return false;
						}						
						
//Check Table mandatory fields
						var icontab = this.getView().byId("idIconTabBarStretchContent");	
						var Select=sap.ui.getCore().byId("RD4").getSelected();
						
						var tyreTable = idTyreDetailsTable.getModel("tyreDetailsJModel").getData();
						for(var t=0; t<tyreTable.length;t++){
							
							if(tyreTable[t].ItemCode== ""){
								icontab.setSelectedKey("TYRE");
								idTyreDetailsTable.getRows()[t].getCells()[0].setValueState("Error");								
								check = true;
							}
							else {
								idTyreDetailsTable.getRows()[t].getCells()[0].setValueState("None");			
							}
							
							if(tyreTable[t].StencilNo == ""){
								icontab.setSelectedKey("TYRE");
								idTyreDetailsTable.getRows()[t].getCells()[2].setValueState("Error");								
								check = true;
							}
							else {
								idTyreDetailsTable.getRows()[t].getCells()[2].setValueState("None");			
							}
							
							if(tyreTable[t].MouldNo == ""){
								icontab.setSelectedKey("TYRE");
								idTyreDetailsTable.getRows()[t].getCells()[3].setValueState("Error");								
								check = true;
							}
							else {
								idTyreDetailsTable.getRows()[t].getCells()[3].setValueState("None");			
							}
							
							if(Select && tyreTable[t].Batch == ""){
								icontab.setSelectedKey("TYRE");
								idTyreDetailsTable.getRows()[t].getCells()[4].setValueState("Error");								
								check = true;
							}
							else {
								idTyreDetailsTable.getRows()[t].getCells()[4].setValueState("None");			
							}
							
							if(tyreTable[t].VehicleType == ""){
								icontab.setSelectedKey("TYRE");
								idTyreDetailsTable.getRows()[t].getCells()[5].setValueState("Error");								
								check = true;
							}
							else {
								idTyreDetailsTable.getRows()[t].getCells()[5].setValueState("None");			
							}
							
							if(FitType != "REP" && tyreTable[t].VehicleMake == ""){
								icontab.setSelectedKey("TYRE");
								idTyreDetailsTable.getRows()[t].getCells()[6].setValueState("Error");								
								check = true;
							}
							else {
								idTyreDetailsTable.getRows()[t].getCells()[6].setValueState("None");			
							}
							
							if(FitType != "REP" && tyreTable[t].VehicleModel == ""){
								icontab.setSelectedKey("TYRE");
								idTyreDetailsTable.getRows()[t].getCells()[7].setValueState("Error");								
								check = true;
							}
							else {
								idTyreDetailsTable.getRows()[t].getCells()[7].setValueState("None");			
							}
							
							if(FitType != "REP" && tyreTable[t].VehicleVariant == ""){
								icontab.setSelectedKey("TYRE");
								idTyreDetailsTable.getRows()[t].getCells()[8].setValueState("Error");								
								check = true;
							}
							else {
								idTyreDetailsTable.getRows()[t].getCells()[8].setValueState("None");			
							}
							
							if(FitType != "REP" && tyreTable[t].RegisterNo == ""){
								icontab.setSelectedKey("TYRE");
								idTyreDetailsTable.getRows()[t].getCells()[9].setValueState("Error");								
								check = true;
							}
							else {
								idTyreDetailsTable.getRows()[t].getCells()[9].setValueState("None");			
							}
							
							if(FitType != "REP" && tyreTable[t].KmCovered == ""){
								icontab.setSelectedKey("TYRE");
								idTyreDetailsTable.getRows()[t].getCells()[11].setValueState("Error");								
								check = true;
							}
							else {
								idTyreDetailsTable.getRows()[t].getCells()[11].setValueState("None");			
							}
						}
						
						var tubeTable = idTubeDetailsTable.getModel("tubeDetailsJModel").getData();
						for(var t=0; t<tubeTable.length;t++){
							idTubeDetailsTable.getRows()[t].getCells()[0].setValueState("None");
							if(tubeTable[t].ItemCode== ""){
								icontab.setSelectedKey("TUBE");
								idTubeDetailsTable.getRows()[t].getCells()[0].setValueState("Error");									
								//sap.m.MessageBox.alert("Required Fields missing at row number : "+ parseInt(t+1) + " in Tube Details Table");
								check = true;
							}
							else {
								idTubeDetailsTable.getRows()[t].getCells()[0].setValueState("None");				
							}
							if(Select && tubeTable[t].Batch== ""){
								icontab.setSelectedKey("TUBE");
								idTubeDetailsTable.getRows()[t].getCells()[2].setValueState("Error");	
								check = true;
							}
							else {
								idTubeDetailsTable.getRows()[t].getCells()[2].setValueState("None");				
							}
						}
						
						var flapTable = idflapDetailsTable.getModel("flapDetailsJModel").getData();
						for(var t=0; t<flapTable.length;t++){
							if(flapTable[t].ItemCode== ""){
								icontab.setSelectedKey("FLAP");
								idflapDetailsTable.getRows()[t].getCells()[0].setValueState("Error");
								//sap.m.MessageBox.alert("Required Fields missing at row number : "+ parseInt(t+1) + " in Flap Details Table");
								check = true;
							}
							else {
								idflapDetailsTable.getRows()[t].getCells()[0].setValueState("None");				
							}
							if(Select && flapTable[t].Batch== ""){
								icontab.setSelectedKey("FLAP");
								idflapDetailsTable.getRows()[t].getCells()[2].setValueState("Error");	
								check = true;
							}
							else {
								idflapDetailsTable.getRows()[t].getCells()[2].setValueState("None");				
							}
						}
//						**********************************************************************		
														
						if (check == true){
							sap.m.MessageBox.show("Please fill all Required Fields.", {
			              title: "ERROR",
			              icon:sap.m.MessageBox.Icon.ERROR,
							});
							return;
						}
						
						debugger
						
				var Data={};
				Data.EMessage="";
				Data.ClaimRecDepo=ClaimDepo;
				Data.ClaimTyp=ClaimType;				
				Data.ClaimDate=this.DateNew(null);
				Data.TicketNo=TicketNo;
				Data.FitType=FitType;
				Data.CustType=CustType;
				Data.TicketSource=Source;
				Data.DefectiveTyres=NoProd;
				Data.VechPurcMonth=VechMonth;
				Data.VechPurcYear=VechYear;  

				if(TicketDate!=null){
				TicketDate=TicketDate.split(".");
				Data.TicketDate = TicketDate[2] + "-" + TicketDate[1] + "-" + TicketDate[0] + "T00:00:00";		
			    }else{
			    Data.TicketDate=null;
				}
				
				Data.LetterRefNo=RefNo;		
				
				if(RefDt!=null){
				RefDt=RefDt.split(".");
				Data.LetterRefDt = RefDt[2] + "-" + RefDt[1] + "-" + RefDt[0] + "T00:00:00";		
			    }else{
			    Data.LetterRefDt=null;
				}
				
				Data.CustomerTelf1=CustmMobile;
				Data.CustomerTelf2=CustAlt;
				Data.CustomerFname=CustomerFname;
				Data.CustomerLname=CustomerLname;
				Data.CustomerEmail=CustomerEmail;
				Data.CustomerAddr1=CustomerAddr1;
				Data.CustomerAddr2=CustomerAddr2;
				Data.CustomerCity1=CustomerCity1;
				Data.CustomerCity2=CustomerCity2;
				Data.CustomerRegion=CustomerRegion;
				Data.CustomerLand1=CustomerLand1;
				
				Data.DealerCode=Dealar;
				
				Data.FranhiseName=FranhiseName;
				Data.FranhisePName=FranhisePName;
				Data.FranhiseEmail=FranhiseEmail;
				Data.FranhiseLoc=FranhiseLoc;
				Data.FranhiseContact=FranhiseContact;
				
				Data.ClaimStatus="02";
				
				debugger
				
				Data.RcptToTyreNvg=[];
				Data.RcptToTubeNvg=[];
				Data.RcptToFlapNvg=[];
				var tabel1=this.getView().byId("idTyreDetailsTable");
				var tabel2=this.getView().byId("idTubeDetailsTable");
				var tabel3=this.getView().byId("idflapDetailsTable");
				
	
				var tbl1_Length = tabel1.getModel("tyreDetailsJModel").getData().length;
				var tbl1_data = tabel1.getModel("tyreDetailsJModel").getData();
				if(tbl1_Length >0)
					{
				for( var i = 0 ; i < tbl1_Length; i++ ){
					var obj={};
					obj.ClaimNo="";
					obj.ItemCode=tbl1_data[i].ItemCode;
					obj.StnclNumber=tbl1_data[i].StencilNo;
					obj.MouldNo=tbl1_data[i].MouldNo;
					obj.Batch=tbl1_data[i].Batch;
					obj.VehType=tbl1_data[i].VehicleType;
					obj.VehMake=tbl1_data[i].VehicleMake;
					obj.VehModel=tbl1_data[i].VehicleModel;
					obj.VehVariant=tbl1_data[i].VehicleVariant;
					obj.RegNo=tbl1_data[i].RegisterNo;
					obj.ChassisNo=tbl1_data[i].ChasisNo;
					obj.KMCovered=tbl1_data[i].KmCovered;	
					
					Data.RcptToTyreNvg.push(obj);
				 }
				}
				
				var tbl2_Length = tabel1.getModel("tubeDetailsJModel").getData().length;
				var tbl2_data = tabel1.getModel("tubeDetailsJModel").getData();
				if(tbl2_Length > 0)
					{
				for( var i = 0 ; i < tbl2_Length; i++ ){
					var obj={};
					obj.ClaimNo="";
					obj.ItemCode=tbl2_data[i].ItemCode;
					obj.Batch=tbl2_data[i].Batch;	
					Data.RcptToTubeNvg.push(obj);
				     }
					}
				
				var tbl3_Length = tabel1.getModel("flapDetailsJModel").getData().length;
				var tbl3_data = tabel1.getModel("flapDetailsJModel").getData();
				if(tbl3_Length > 0)
					{
				for( var i = 0 ; i < tbl3_Length; i++ ){
					var obj={};
					obj.ClaimNo="";
					obj.ItemCode=tbl3_data[i].ItemCode;
					obj.Batch=tbl3_data[i].Batch;	
					Data.RcptToFlapNvg.push(obj);
				     }
					}
				
				if(Data.RcptToTyreNvg.length==0){
					delete Data.RcptToTyreNvg
				}
				if(Data.RcptToTubeNvg==0){
					delete Data.RcptToTubeNvg
				}
				if(Data.RcptToFlapNvg==0){
				delete 	Data.RcptToFlapNvg
				}
				
				var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
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
					sap.m.MessageBox.show(oData.EMessage, {
				        title: "Success",
				        icon:sap.m.MessageBox.Icon.SUCCESS,
				        onClose:function(){
				        	sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_CLAIM_SRV/ClaimOutputFormSet(ClaimNo='',TicketNo='"+oData.TicketNo+"')/$value", true);
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
				oCreateModel1.create("/ModifyReceiptNoSet", Data, {
					success: fncSuccess,
					error: fncError
				});
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
/*************************/
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
			    	
/********************************/					        
			        selectRefrToTicket : function(e){			        	
			        	var TicketGrp = this.IntialFrag.getContent()[0].getContent()[0].getContent()[0].getSelectedIndex();
			        	if(TicketGrp === 0){
			        		sap.ui.getCore().byId("idTnolbl").setVisible(true);
				        	sap.ui.getCore().byId("idTno").setVisible(true);
			        	}else{
			        		sap.ui.getCore().byId("idTnolbl").setVisible(false);
				        	sap.ui.getCore().byId("idTno").setVisible(false);
			        	}			        	
			        },
			        
//***************************Added by Hans on 23/10/2018 (Tyre Details Table)***********************
			        getTyreTable1Object: function(){			    		
			    		var obj={			    				
			    				ItemCode: "",
			    				Desc: "",
			    				StencilNo: "",
			    				MouldNo:"",
			    				Batch:"",
			    				VehicleType:"",
			    				VehicleMake:"",
			    				VehicleModel:"",
			    				VehicleVariant:"",
			    				RegisterNo:"",
			    				ChasisNo:"",
			    				KmCovered:"",
			    				ProdCat:""
			    			};
			    		this.tyreTable.push(obj);
			    		
			    		var idTyreDetailsTable= this.getView().byId("idTyreDetailsTable");
			    		idTyreDetailsTable.getModel("tyreDetailsJModel").setData(this.tyreTable);
			    		idTyreDetailsTable.getModel("tyreDetailsJModel").refresh();
			    		var tyreTableCount = idTyreDetailsTable.getModel("tyreDetailsJModel").getData().length;
			    		idTyreDetailsTable.setVisibleRowCount(tyreTableCount);			    	
			    	},
			    	
			    	addTyreDtlTableDetail: function(){
			    		var idTyreDtlAddBtn = this.getView().byId("idTyreDtlAddBtn");
						var idClaim = this.getView().byId("idClaim");
						var iddepo = this.getView().byId("iddepo");
						var idFitment = this.getView().byId("idFitment");						
						
						if(idClaim.getValue() == "" || iddepo.getValue() == "" || idFitment.getSelectedKey() == ""){
							if(idClaim.getValue() == ""){
							 this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.Error);
							}else{
							 this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.None);	
							}
							
							if(iddepo.getValue() == ""){
								 this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.Error);
								}else{
								 this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.None);	
								}
							
							if(idFitment.getSelectedKey() == ""){
								this.getView().byId("idFitment").addStyleClass("myStat	eError"); 
								}else{
									this.getView().byId("idFitment").removeStyleClass("myStat	eError"); 
								}
							
							sap.m.MessageBox.alert("Select Mandatory Fields (Type of Claim , Claim Receiving Depot, Fitment Type)");
							return false;
						}else{
							this.getTyreTable1Object();
						}
			    		
			    	},
			    	onRemoveTyreDetail: function(oEvent){
			    		var tbl=this.getView().byId("idTyreDetailsTable"); 
			    		var idx=oEvent.getSource().getParent()._getBindingContext("tyreDetailsJModel").getPath().split('/')[1];
			    	     if (idx !== -1) {
			    	    	 tbl.getModel("tyreDetailsJModel").getData().splice(idx,1);
			    	    	 tbl.getModel("tyreDetailsJModel").refresh();
			    			var UsageTyreDetailTableCount = tbl.getModel("tyreDetailsJModel").getData().length;
			    			tbl.setVisibleRowCount(UsageTyreDetailTableCount);
			    	       
			    	       
			    	     }
			    	},
			    	/************SEARCH HELPS BEGIN*********/
					/*Vehicle Type Search Help Begin*/
							_onVehicleTypeHelp: function(oController) {
								//method for vehicle type value help
								// create value help dialog using fragment
								if (!this._onVehicleTypeHelpDialog) {
									this._onVehicleTypeHelpDialog = sap.ui.xmlfragment(
										"com.acute.ticketClaim.view.VehicleType", this);
									this.getView().addDependent(this._onVehicleTypeHelpDialog);
								}
								// open value help dialog
								this._onVehicleTypeHelpDialog.open();
							}, //end of onVehicleTypeHelp method
							_VehicleTypeClose: function(evt) {
								//get the selected vehicle type
								var oSelectedItem = evt.getParameter("selectedItem");
								var vehicleTypeId = sap.ui.getCore().byId(this.vehicleTypeId);
								if (oSelectedItem) {
									//Fetching the selected value
									var sType = oSelectedItem.getTitle();
									
									vehicleTypeId.setValue(sType);
									vehicleTypeId.setTooltip(sType);
									
//									set vehicle make, model, variant enabled and blank
									var cells = vehicleTypeId.getParent().getAggregation("cells");
									cells[6].setValue("");
									cells[7].setValue("");
									cells[8].setValue("");
									cells[6].setEnabled(true);
									cells[7].setEnabled(false);
									cells[8].setEnabled(false);
					
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
								this.vehicleTypeId = oEvt.getSource().getId();
								this.VehicleType = new sap.ui.model.json.JSONModel();
								var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleTypeSet";
								this.VehicleType.loadData(oUri, null, false, "GET", false, false, null);
								this.getView().setModel(this.VehicleType, "VehicleType");
								this._onVehicleTypeHelp();
							}, //end of onVehicleType Method
							/*Vehicle Make Search Help Begin*/
							_onVehicleMakeHelp: function(oController) {
								//method for vehicle make value help
								// create value help dialog using fragment
								if (!this._onVehicleMakeHelpDialog) {
									this._onVehicleMakeHelpDialog = sap.ui.xmlfragment(
										"com.acute.ticketClaim.view.VehicleMake", this);
									this.getView().addDependent(this._onVehicleMakeHelpDialog);
								}
								// open value help dialog
								this._onVehicleMakeHelpDialog.open();
							}, //end of onVehicleMakeHelp method
							_VehicleMakeClose: function(evt) {
								//get the selected vehicle make
								var oSelectedItem = evt.getParameter("selectedItem");
								var VehicleMake = sap.ui.getCore().byId(this.vehicleMakeId);
								if (oSelectedItem) {
									//Fetching the selected value
									var sType = oSelectedItem.getTitle();
									VehicleMake.setValue(sType);
									VehicleMake.setTooltip(sType);
//									this.getView().byId("idModel").setEnabled(true);
									
//									set vehicle make, model, variant enabled and blank
									var cells = VehicleMake.getParent().getAggregation("cells");
									cells[7].setValue("");
									cells[8].setValue("");
									cells[7].setEnabled(true);
									cells[8].setEnabled(false);
									
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
								this.vehicleMakeId = oEvt.getSource().getId();
								//Method for setting the model for vehicle type
								this.VehicleMake = new sap.ui.model.json.JSONModel();
								var idVehicleMake = sap.ui.getCore().byId(this.vehicleMakeId);
								var tyreType = idVehicleMake.getParent().getAggregation("cells")[5].getValue();
								var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleMakeSet?$filter=Type eq '" + tyreType + "'";
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
										"com.acute.ticketClaim.view.VehicleModel", this);
									this.getView().addDependent(this._onVehicleModelHelpDialog);
								}
								// open value help dialog
								this._onVehicleModelHelpDialog.open();
							}, //end of onVehicleModelHelp method
							_VehicleModelClose: function(evt) {
								var vehicleModelId = sap.ui.getCore().byId(this.vehicleModelId);
								//get the selected vehicle model
								var oSelectedItem = evt.getParameter("selectedItem");
								if (oSelectedItem) {
									//Fetching the selected value
									var sType = oSelectedItem.getTitle();
									vehicleModelId.setValue(sType);
									vehicleModelId.setTooltip(sType);
									
//									set vehicle  model, variant enabled and blank
									var cells = vehicleModelId.getParent().getAggregation("cells");
									cells[8].setValue("");
									cells[8].setEnabled(true);
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
								this.vehicleModelId = oEvt.getSource().getId();
								//Method for setting the model for vehicle type
								var idVehicleModel = sap.ui.getCore().byId(this.vehicleModelId);
								var tyreType = idVehicleModel.getParent().getAggregation("cells")[5].getValue();
								var tyreMake = idVehicleModel.getParent().getAggregation("cells")[6].getValue();
								//Method for setting the model for vehicle type
								this.VehicleModel = new sap.ui.model.json.JSONModel();
//								this.make = this.getView().byId("idVehicleMake").getValue();
								var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleModelSet?$filter=Type eq '" + tyreType + "' and Make eq '" + tyreMake + "'";
								this.VehicleModel.loadData(oUri, null, false, "GET", false, false, null);
								this.getView().setModel(this.VehicleModel, "VehicleModel");
								this._onVehicleModelHelp();
							}, //end of onVehicleModel Method

							/*Vehicle Variant Search Help Begin*/
							_onVehicleVariantHelp: function(oController) {
								//method for vehicle variant value help
								// create value help dialog using fragment
								if (!this._onVehicleVariantHelpDialog) {
									this._onVehicleVariantHelpDialog = sap.ui.xmlfragment(
										"com.acute.ticketClaim.view.VehicleVariant", this);
									this.getView().addDependent(this._onVehicleVariantHelpDialog);
								}
								// open value help dialog
								this._onVehicleVariantHelpDialog.open();
							}, //end of onVehicleVariantHelp method
							_VehicleVariantClose: function(evt) {
								var idVehicleVariant = sap.ui.getCore().byId(this.vehicleVariantId);
								//get the selected vehicle variant
								var oSelectedItem = evt.getParameter("selectedItem");
								if (oSelectedItem) {
									//Fetching the selected value
									var sType = oSelectedItem.getTitle();
									idVehicleVariant.setValue(sType);
									idVehicleVariant.setTooltip(sType);
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
								this.vehicleVariantId = oEvt.getSource().getId();
								//Method for setting the model for vehicle type
								var idVehicleVariant = sap.ui.getCore().byId(this.vehicleVariantId);
								var tyreType = idVehicleVariant.getParent().getAggregation("cells")[5].getValue();
								var tyreMake = idVehicleVariant.getParent().getAggregation("cells")[6].getValue();
								var tyreModel = idVehicleVariant.getParent().getAggregation("cells")[7].getValue();
								//Method for setting the model for vehicle variant
								this.VehicleVariant = new sap.ui.model.json.JSONModel();
//								this.model = this.getView().byId("idModel").getValue();
								var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleVariantSet?$filter=Type eq '" + tyreType + "' and Make eq '" + tyreMake + "' and Model eq '" + tyreModel + "'";
								this.VehicleVariant.loadData(oUri, null, false, "GET", false, false, null);
								this.getView().setModel(this.VehicleVariant, "VehicleVariant");
								this._onVehicleVariantHelp();
							}, //end of onVehicleVariant Method
					/*Vehicle Variant Search Help End*/
							
							
//***************************Added by Hans on 23/10/2018 (Tube Details Table)***********************
					        getTubeTable1Object: function(){					    		
					    		var obj={					    				
					    				ItemCode: "",
					    				Desc: "",
					    				Batch:"",
					    				ProdCat:""
					    			};
					    		this.tubeTable.push(obj);
					    		
					    		var idTubeDetailsTable= this.getView().byId("idTubeDetailsTable");
					    		idTubeDetailsTable.getModel("tubeDetailsJModel").setData(this.tubeTable);
					    		idTubeDetailsTable.getModel("tubeDetailsJModel").refresh();
					    		var tubeTableCount = idTubeDetailsTable.getModel("tubeDetailsJModel").getData().length;
					    		idTubeDetailsTable.setVisibleRowCount(tubeTableCount);					    	
					    	},
					    	
					    	addTubeDtlTableDetail: function(){
					    		var idTubeDtlAddBtn = this.getView().byId("idTubeDtlAddBtn");
								var idClaim = this.getView().byId("idClaim");
								var iddepo = this.getView().byId("iddepo");
								var idFitment = this.getView().byId("idFitment");
								if(idClaim.getValue() == "" || iddepo.getValue() == "" || idFitment.getSelectedKey() == ""){
									sap.m.MessageBox.alert("Select Mandatory Fields (Type of Claim , Claim Receiving Depot, Fitment Type)");
									
									if(idClaim.getValue() == ""){
										 this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.Error);
										}else{
										 this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.None);	
										}
										
										if(iddepo.getValue() == ""){
											 this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.Error);
											}else{
											 this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.None);	
											}
										
										if(idFitment.getSelectedKey() == ""){
											this.getView().byId("idFitment").addStyleClass("myStat	eError"); 
											}else{
												this.getView().byId("idFitment").removeStyleClass("myStat	eError"); 
											}	
									
									return false;
								}else{
									this.getTubeTable1Object();
								}
					    		
					    	},
					    	onRemoveTubeDetail: function(oEvent){
					    		var tbl=this.getView().byId("idTubeDetailsTable"); 
					    		var idx=oEvent.getSource().getParent()._getBindingContext("tubeDetailsJModel").getPath().split('/')[1];
					    	     if (idx !== -1) {
					    	    	 tbl.getModel("tubeDetailsJModel").getData().splice(idx,1);
					    	    	 tbl.getModel("tubeDetailsJModel").refresh();
					    			var UsageTubeDetailTableCount = tbl.getModel("tubeDetailsJModel").getData().length;
					    			tbl.setVisibleRowCount(UsageTubeDetailTableCount);
					    	       
					    	       
					    	     }
					    	},				
//***************************Added by Hans on 23/10/2018 (Tube Details Table)***********************
					        getFlapTable1Object: function(){					    		
					    		var obj={					    				
					    				ItemCode: "",
					    				Desc: "",
					    				Batch:"",
					    				ProdCat:""
					    			};
					    		this.flapTable.push(obj);
					    		
					    		var idflapDetailsTable= this.getView().byId("idflapDetailsTable");
					    		idflapDetailsTable.getModel("flapDetailsJModel").setData(this.flapTable);
					    		idflapDetailsTable.getModel("flapDetailsJModel").refresh();
					    		var flapTableCount = idflapDetailsTable.getModel("flapDetailsJModel").getData().length;
					    		idflapDetailsTable.setVisibleRowCount(flapTableCount);
					    	
					    	},
					    	addFlapDtlTableDetail: function(){
					    		var idFlapDtlAddBtn = this.getView().byId("idFlapDtlAddBtn");
								var idClaim = this.getView().byId("idClaim");
								var iddepo = this.getView().byId("iddepo");
								var idFitment = this.getView().byId("idFitment");
								if(idClaim.getValue() == "" || iddepo.getValue() == "" || idFitment.getSelectedKey() == ""){
									sap.m.MessageBox.alert("Select Mandatory Fields (Type of Claim , Claim Receiving Depot, Fitment Type)");

									if(idClaim.getValue() == ""){
										 this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.Error);
										}else{
										 this.getView().byId("idClaim").setValueState(sap.ui.core.ValueState.None);	
										}
										
										if(iddepo.getValue() == ""){
											 this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.Error);
											}else{
											 this.getView().byId("iddepo").setValueState(sap.ui.core.ValueState.None);	
											}
										
										if(idFitment.getSelectedKey() == ""){
											this.getView().byId("idFitment").addStyleClass("myStat	eError"); 
											}else{
												this.getView().byId("idFitment").removeStyleClass("myStat	eError"); 
											}	
									
									return false;
								}else{
									this.getFlapTable1Object();
								}					    		
					    	},
					    	onRemoveFlapDetail: function(oEvent){
					    		var tbl=this.getView().byId("idflapDetailsTable"); 
					    		var idx=oEvent.getSource().getParent()._getBindingContext("flapDetailsJModel").getPath().split('/')[1];
					    	     if (idx !== -1) {
					    	    	 tbl.getModel("flapDetailsJModel").getData().splice(idx,1);
					    	    	 tbl.getModel("flapDetailsJModel").refresh();
					    			var UsageFlapDetailTableCount = tbl.getModel("flapDetailsJModel").getData().length;
					    			tbl.setVisibleRowCount(UsageFlapDetailTableCount);	
					    	     }
					    	},

				});