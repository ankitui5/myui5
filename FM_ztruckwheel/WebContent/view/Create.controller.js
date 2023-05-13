jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui
		.controller(
				"ZTRUCKWHEEL.view.Create",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf view.Create
					 */
					onInit : function() {

						if (!jQuery.support.touch) {
							this.getView().addStyleClass("sapUiSizeCompact");
						}
						if (sap.ui.Device.system.desktop) {

						}
						sap.ui.core.UIComponent.getRouterFor(this).getRoute(
								"page2").attachMatched(this._onRoute, this);
						
						

					},

					_onRoute : function(e) {

						var self = this;
						var oBindingPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RaceInitialSet?$expand=NavToGain,NavToRaceTypes"
						var oModel = this.getView().getModel();
						this.Displaymodel = new sap.ui.model.json.JSONModel();
						this.Displaymodel.loadData(oBindingPath, null, false, "GET", false, false, null);
						this.getView().setModel(this.Displaymodel);
						
					 var docDate = new Date()
					 var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
				            pattern : "dd.MM.yyyy"
						});
					 var currentdate =  oDateFormat.format(docDate);
					 this.getView().byId("doc_DateInp").setValue(currentdate);

						oModel.setHeaders({
							"Content-Type" : "application/json"
						});
						var fncSuccess = function(oData, oResponse) {
							debugger
							if (oData.results.length !== 0) {
								// heder Details
								var DepartmentText = oData.results[0].DepartmentText;
								var FiscalYear = oData.results[0].FiscalYear;
								var PersonnelNumber = oData.results[0].PersonnelNumber;
								var Plant = oData.results[0].Plant;
								var RaceDepartment = oData.results[0].RaceDepartment;
								var DocumentDate = oData.results[0].DocumentDate;

								// set Headr Detrails
								self.getView().byId("race_departInp").setValue(
										RaceDepartment);
								self.getView().byId("fiscal_YearInp").setValue(
										FiscalYear);
								self.getView().byId("plantInp").setValue(Plant);
								self.getView().byId("brief_Desc").setValue(
										DepartmentText);
								self.getView().byId("doc_DateInp").setValue();
							} else {

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
						oModel
								.read(
										"/RaceInitialSet?$expand=NavToGain,NavToRaceTypes",
										{
											success : fncSuccess,
											error : fncError
										});

					},

					onSave : function() {

//						var _self = this;
//
//						var customer = this.getView().byId("inpCustomer")
//								.getValue();
//						var fstName = this.getView().byId("inpFirstName")
//								.getValue();
//						var lstName = this.getView().byId("inpLastname")
//								.getValue();
//						var email = this.getView().byId("inpEmail").getValue();
//
//						if (customer === "" || fstName === "" || lstName === ""
//								|| email === "") {
//
//							sap.m.MessageBox.show(
//									"Please fill all the mendatory fields", {
//										icon : sap.m.MessageBox.Icon.ERROR,
//										title : "Error",
//										actions : [ 'OK' ],
//										onClose : function(a) {
//
//										},
//									});
//							return;
//						}

						var oEntry = {};
						var fiscal_YearInp = this.getView().byId("fiscal_YearInp")
								.getValue();
						var selectRace = this.getView().byId("selectRace")
								.getSelectedKey();
						var plantInp = this.getView().byId("plantInp")
								.getValue();
						var race_departInp = this.getView().byId("race_departInp").getValue();
						var doc_DateInp = this.getView().byId("doc_DateInp")
								.getValue();
						var Race_apprvInp = this.getView().byId("Race_apprvInp")
								.getValue();
						var Race_amtInp = this.getView().byId("Race_amtInp")
								.getValue();
						var titleInp = this.getView().byId("titleInp")
								.getValue();
						var brief_DescInp = this.getView().byId("brief_DescInp").getValue();
						var Scedule_DateInp = this.getView().byId("Scedule_DateInp")
								.getValue();
						var gain_expectedInp = this.getView().byId("gain_expectedInp")
								.getValue();
						var longText = this.getView().byId("longTxt")
						.getValue();
						
						var s = doc_DateInp.split(".");
						 doc_DateInp = s[2]
								+ "-"
								+ s[1]
								+ "-"
								+ s[0]
								+ "T00:00:00";
						 
//						 var t = Race_apprvInp.split(".");
//						 Race_apprvInp = t[2]
//									+ "-"
//									+ t[1]
//									+ "-"
//									+ t[0]
//									+ "T00:00:00";

						 var u = Scedule_DateInp.split(".");
						 Scedule_DateInp = u[2]
									+ "-"
									+ u[1]
									+ "-"
									+ u[0]
									+ "T00:00:00";
						 
						 var v = gain_expectedInp.split(".");
						 gain_expectedInp = v[2]
									+ "-"
									+ v[1]
									+ "-"
									+ v[0]
									+ "T00:00:00";
						 
						 // validate
						 if (this.getView().byId("selectRace")
									.getSelectedKey() === "") {
							 
								sap.m.MessageBox.show("Please select race Type", {
									// icon
									// :
									// sap.m.MessageBox.Icon.ERROR,
									title : "Information",
									actions : [ 'OK' ],
									onClose : function(a) {

										if (status === "S") {

										}

									},
								});
							 return;
							}
					
						 
						 if (this.getView().byId("Race_amtInp")
									.getValue() === "") {
							 this.getView().byId("Race_amtInp")
										.setValueState(
												sap.ui.core.ValueState.Error);
							 var e = false;
							}else{
								
								this.getView().byId("Race_amtInp")
								.setValueState(
												sap.ui.core.ValueState.None);
								var e = true;
						}
						 
						
						 
						 if (this.getView().byId("titleInp")
									.getValue() === "") {
							 this.getView().byId("titleInp")
										.setValueState(
												sap.ui.core.ValueState.Error);	
							 var c = false;
							}else{
								
								this.getView().byId("titleInp")
								.setValueState(
												sap.ui.core.ValueState.None);
								var c = true;
						}
						 
						 if (this.getView().byId("Scedule_DateInp")
									.getValue() === "") {
							 this.getView().byId("Scedule_DateInp")
										.setValueState(
												sap.ui.core.ValueState.Error);
							 var b = false;
							}else{
								
								this.getView().byId("Scedule_DateInp")
								.setValueState(
												sap.ui.core.ValueState.None);
								var b = true;
						}
						 
						 if (this.getView().byId("gain_expectedInp")
									.getValue() === "") {
							 this.getView().byId("gain_expectedInp")
										.setValueState(
												sap.ui.core.ValueState.Error);
							 var a = false;
							}else{
								
									this.getView().byId("gain_expectedInp")
									.setValueState(
													sap.ui.core.ValueState.None);
									var a = true;
							}
						 
						 
						if(a == false || b == false || c == false || e == false){
							
							sap.m.MessageToast
							.show(
									"Please fill mendatory fields",
									{
										duration : 3000
									});
							return;
						}
						
						
				        var sch = new Date(Scedule_DateInp);
				        var gain = new Date(gain_expectedInp);
				        if ( gain > sch) { 
				        	sap.m.MessageBox.show("100% Gain expected Date should be equal or less than  Scheduled Completion Date", {
								// icon
								// :
								// sap.m.MessageBox.Icon.ERROR,
								title : "Information",
								actions : [ 'OK' ],
								onClose : function(a) {

								},
							});
						 return;
				        }
				        
				     // splitAmoount
						
						var loItemsAmnt = this.getView().byId("tableAmount").getItems();
						var NavToPlantAmounts = [];
						var totlAmt = 0;
						for ( var i in loItemsAmnt) {
							var laCells = loItemsAmnt[i]
									.getCells();
							var ammount = laCells[1]
									.getValue();
							totlAmt = totlAmt + parseFloat(ammount);
						}
						
						var rcAmnt = parseFloat(Race_amtInp)
						if(rcAmnt < totlAmt){
							sap.m.MessageBox.show("Split Amount should be equal or less than Race Amount.", {
								// icon
								// :
								// sap.m.MessageBox.Icon.ERROR,
								title : "Information",
								actions : [ 'OK' ],
								onClose : function(a) {

								},
							});
						 return;
						}

						oEntry.FiscalYear = fiscal_YearInp;
						oEntry.RaceType = selectRace;
						oEntry.Plant = plantInp;
						oEntry.RaceDepartment = race_departInp;
//						oEntry.DocumentDate = doc_DateInp;2018-10-7T00:00:00
						oEntry.DocumentDate = doc_DateInp;
//						oEntry.RaceApprovalDate = Race_apprvInp;
						oEntry.RaceAmount = Race_amtInp;
						oEntry.Title1 = titleInp;
						oEntry.BriefDescription1 = brief_DescInp;
						oEntry.ScheduledComplitionDate = Scedule_DateInp;
						oEntry.TotalGainExpectedDate = gain_expectedInp;
						
						
						
						// nav to totalCost
						var laChildCost = [];
						var landed_costInp = this.getView().byId("landed_costInp")
						.getValue();
						var other_ExpensesInp = this.getView().byId("other_ExpensesInp")
								.getValue();
						var operative_ExpensesInp = this.getView().byId("operative_ExpensesInp")
								.getValue();
						var Erection_CommissioningInp = this.getView().byId("Erection_CommissioningInp").getValue();
						var Contigency_ExpenseInp = this.getView().byId("Contigency_ExpenseInp")
								.getValue();
						
						// temp conditions
						if(landed_costInp == "" || other_ExpensesInp == "" || operative_ExpensesInp == "" || Erection_CommissioningInp == "" || Contigency_ExpenseInp == ""){
							
							sap.m.MessageBox.show("Please fill Total Cost", {
								// icon
								// :
								// sap.m.MessageBox.Icon.ERROR,
								title : "Information",
								actions : [ 'OK' ],
								onClose : function(a) {

								},
							});
						 return;
						}
						
						laChildCost
						.push({
							LandedCost : landed_costInp,
							AnyOtherExpense : other_ExpensesInp,
							PreOperativeExpense : operative_ExpensesInp,
							ErectionCommissioning : Erection_CommissioningInp,
							ContigencyExpense : Contigency_ExpenseInp
						});
						
						
						// nav to gain
						var loItems = this.getView().byId("idGainTable").getItems();
						var laChildgain = [];
						for ( var i in loItems) {
							var laCells = loItems[i]
									.getCells();

							var itemText = laCells[2]
									.getValue();
							if(itemText == ""){
								sap.m.MessageBox.show("Please fill Item text for Gain/Savings", {
									// icon
									// :
									// sap.m.MessageBox.Icon.ERROR,
									title : "Information",
									actions : [ 'OK' ],
									onClose : function(a) {

									},
								});
							 return;
							}
						}
						
						
						for ( var i in loItems) {
							var laCells = loItems[i]
									.getCells();

							var itemNo = laCells[0]
									.getValue();
							var itemDesc = laCells[1]
									.getValue();
							var itemText = laCells[2]
									.getValue();

							laChildgain
									.push({
										ItemNo : itemNo,
										ItemDescription : itemDesc,
										ItemText : itemText
									});
						}
						
						// nav to approval
						var loItems = this.getView().byId("idApproverTable").getItems();
						var laChildApprove = [];
						for ( var i in loItems) {
							var laCells = loItems[i]
									.getCells();

							var Designation = laCells[0]
									.getText();
							var Comments = laCells[1]
									.getText();
							var Ammount = laCells[2]
									.getText();

							laChildApprove
									.push({
										Pernr : Designation,
										ItemText : Comments,
										RaceApprovalAmount : Ammount
									});
						}
						
						var LtextChild = [];
						LtextChild
						.push({
							TextDescription : longText
						});
						
						// splitAmoount
					
						var loItemsAmnt = this.getView().byId("tableAmount").getItems();
						var NavToPlantAmounts = [];
						for ( var i in loItemsAmnt) {
							var laCells = loItemsAmnt[i]
									.getCells();

							var plant = laCells[0]
									.getValue();
							var ammount = laCells[1]
									.getValue();

							NavToPlantAmounts
									.push({
										Plant : plant,
										RaceAmount : ammount
									});
						}
						
						if(loItemsAmnt.length != 0){
							oEntry.NavToPlantAmounts = NavToPlantAmounts;
						}
						
						oEntry.NavToCost = laChildCost;
						oEntry.NavToGain = laChildgain;
						oEntry.NavToLText = LtextChild;
						oEntry.NavToApprove = laChildApprove;
						
						
						
						
						var sServiceUrl = "/sap/opu/odata/sap/ZMM_RACE_SRV/";
						var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
						oCreateModel1.setHeaders({
							"Content-Type": "application/atom+xml"
							});
						
						sap.ui.core.BusyIndicator.show();

						oCreateModel1.create("/RaceHeaderSet", oEntry, null,
								function(oData, oResponds) {
									debugger;
									sap.ui.core.BusyIndicator.hide();
									var rcno = oData.RaceNumber;
									sap.m.MessageBox.show("Race " + rcno + " has been Created", {
										// icon
										// :
										// sap.m.MessageBox.Icon.ERROR,
										title : "Information",
										actions : [ 'OK' ],
										onClose : function(a) {
											location.reload();
										},
									});

								}, function(oData, oResponds) {
									sap.ui.core.BusyIndicator.hide();
									sap.m.MessageBox.show("Something went wrong , Please try later.", {
										// icon
										// :
										// sap.m.MessageBox.Icon.ERROR,
										
										title : "Information",
										actions : [ 'OK' ],
										onClose : function(a) {
											
										},
									});

								})

					},
					
					onRaceChange: function(){
						
						
						var raceType = this.getView().byId("selectRace").getSelectedKey();
						var raceAmmount = this.getView().byId("Race_amtInp").getValue();
						
						if(raceType !== "" && raceAmmount !== ""){
							
							var loTableBindingPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RaceApprovalsList?RaceType='" + raceType + "'&RaceAmount=" + raceAmmount + "m";
							var loTable = this.getView().byId(
									"idApproverTable");
							
							var Tablemodel = new sap.ui.model.json.JSONModel();
							Tablemodel.loadData(loTableBindingPath, null, false, "GET", false, false, null);
							loTable.removeAllItems();
							var oData = Tablemodel.getData();
							var length = oData.d.results.length;
							for(var i=0;i<length;i++){

								
								var colListItem = new sap.m.ColumnListItem({
									cells:[
									       new sap.m.Text({
									    	   text:oData.d.results[i].Pernr
									       }),
									       new sap.m.Text({
									    	   text:oData.d.results[i].ItemText
									       }),
									       new sap.m.Text({
									    	   text:oData.d.results[i].RaceApprovalAmount
									       })
									       ]
								})
							loTable.addItem(colListItem);
								
							}

								}
					
					},
					
					liveTotalcost: function(){
						
						
						var landed_costInp = this.getView().byId("landed_costInp")
						.getValue();
						var other_ExpensesInp = this.getView().byId("other_ExpensesInp")
								.getValue();
						var operative_ExpensesInp = this.getView().byId("operative_ExpensesInp")
								.getValue();
						var Erection_CommissioningInp = this.getView().byId("Erection_CommissioningInp").getValue();
						var Contigency_ExpenseInp = this.getView().byId("Contigency_ExpenseInp")
								.getValue();
						
//						if(landed_costInp != "" && other_ExpensesInp != "" && operative_ExpensesInp != "" && Erection_CommissioningInp != "" && Contigency_ExpenseInp != ""){
//							var total= parseInt(landed_costInp) + parseInt(other_ExpensesInp) + parseInt(operative_ExpensesInp) + parseInt(Erection_CommissioningInp) + parseInt(Contigency_ExpenseInp);
//							this.getView().byId("Total_CostInp").setValue(total);
//						}else{
//							this.getView().byId("Total_CostInp").setValue();
//							
//						}
						
						if(landed_costInp == ""){
							landed_costInp = 0;
						}
						if(other_ExpensesInp == ""){
							other_ExpensesInp=0;
						}
						if(operative_ExpensesInp == ""){
							operative_ExpensesInp=0;
						}
						if(Erection_CommissioningInp == ""){
							Erection_CommissioningInp=0;
						}
						if(Contigency_ExpenseInp == ""){
							Contigency_ExpenseInp=0;
						}


					
						var total= parseFloat(landed_costInp) + parseFloat(other_ExpensesInp) + parseFloat(operative_ExpensesInp) + parseFloat(Erection_CommissioningInp) + parseFloat(Contigency_ExpenseInp);
						
						this.getView().byId("Total_CostInp").setValue(total.toFixed(2));
					
		
						
						
					},
					
					menu : function(){
						var that = this;
						
						if (!that._RaceDialog) {
							
							that._RaceDialog = sap.ui.xmlfragment(
								"ZTRUCKWHEEL.view.Intial", that);
							that.getView().addDependent(that._RaceDialog);}
						that._RaceDialog.open();
					},
					
					onRaceCloseButton: function(e){
						var that = this;
//						var display = sap.ui.getCore().byId("RBG").getSelectedIndex();
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
					
					selectedTab : function(c) {
						var _self = this;
						var t = c.getSource()
								.getSelectedKey();
						var selectRace = this.getView().byId("selectRace")
						.getSelectedKey();
				var Race_amtInp = this.getView().byId("Race_amtInp")
						.getValue();
						
						if(t == "ApprovalInfo"){
							if(selectRace == "" || Race_amtInp == ""){
								

								sap.m.MessageBox
										.show(
												"Please select Race Type and fill race ammount first",
												{
													icon : sap.m.MessageBox.Icon.ERROR,
													title : "Error",
													actions : [ 'OK' ],
													onClose : function(
															a) {
														if (a == "OK") {
															var w = "HeaderInfo";
															_self
																	.getView()
																	.byId(
																			'idheaderinfo')
																	.setSelectedKey(
																			w);
														}
													},
												});
							
							}
						}
					},
					
					addNewItem : function() {
						var _self = this;
						var that =  this;
						this.getView().byId("tableAmount").setVisible(true);
						var Table = this.getView().byId("tableAmount");
						var templete = new sap.m.ColumnListItem(
								{
									cells : [
											
													
											 new sap.m.Input({
								            	valueHelpRequest:[_self.onTyreLocationHelp,that],
								                valueHelpOnly:true,
								                showValueHelp:true
								            }),
											new sap.m.Input({
												enabled : true,
												maxLength : 16
											}),
											new sap.m.Button(
													{
														press : [
																this.onDelete,
																this ],
														visible : true,
														type : "Reject",
														icon : "sap-icon://delete"
													})
										],

								});

						Table.addItem(templete);
					},
					onDelete : function(evt) {
						evt.getSource().getParent().getParent().removeItem(
								evt.getSource().getParent());
					},
						
					onJustfifation: function(){
						this.getView().byId("longTestPanel").setVisible(true);
					},
					
					onTyreLocationHelp : function(evt)
					{
						var that = this;
				var ItemDescRow = evt.getSource();
						
						var sPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RacePlantSet";
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
													title : "{Plant}",
													description:"{Description}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "{Plant}",
																value : "{Description}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"Description",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : function(oEvent)
									{
										var that = this;
										var oSelectedItem = oEvent.getParameter("selectedItem");
										if (oSelectedItem) {
											ItemDescRow.setValue(oSelectedItem.getTitle());
										}
									},
									cancel : function(oEvent)
									{
										var that = this;
										var oSelectedItem = oEvent.getParameter("selectedItem");
										if (oSelectedItem) {
											ItemDescRow.setValue(oSelectedItem.getTitle());
										}
									}
								});
						_valueHelpTyreLocSelectDialog.setModel(jModel);
						_valueHelpTyreLocSelectDialog.open();
					},
					
					_handleTyreLocClose : function(oEvent)
					{
						var that = this;
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							ItemDescRow.setValue(oSelectedItem.geTtitle());
						}
					},

				/**
				 * Similar to onAfterRendering, but this hook is invoked before
				 * the controller's View is re-rendered (NOT before the first
				 * rendering! onInit() is used for that one!).
				 * 
				 * @memberOf view.Create
				 */
				// onBeforeRendering: function() {
				//
				// },
				/**
				 * Called when the View has been rendered (so its HTML is part
				 * of the document). Post-rendering manipulations of the HTML
				 * could be done here. This hook is the same one that SAPUI5
				 * controls get after being rendered.
				 * 
				 * @memberOf view.Create
				 */
				// onAfterRendering: function() {
				//
				// },
				/**
				 * Called when the Controller is destroyed. Use this one to free
				 * resources and finalize activities.
				 * 
				 * @memberOf view.Create
				 */
				// onExit: function() {
				//
				// }
				});