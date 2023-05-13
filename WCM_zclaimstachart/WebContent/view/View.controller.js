jQuery.sap.require("zclaimstachart.Resources_Chart.Chart");
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
var that;

sap.ui
		.define(
				[ "sap/ui/core/mvc/Controller", 'sap/m/MessageToast' ],
				function(Controller, MessageToast) {
					"use strict";
					sap.ui
							.controller(
									"zclaimstachart.view.View",
									{
										Data : "",
										myChart : "",
										clear : false,
										o : false,
 
										/**
										 * Called when a controller is
										 * instantiated and its View controls
										 * (if available) are already created.
										 * Can be used to modify the View before
										 * it is displayed, to bind event
										 * handlers and do other one-time
										 * initialization.
										 * 
										 * @memberOf zclaimstacharts.View
										 */
										onInit : function() {
											window.singleFleet = "";
											window.UniqFleet = "";
											window.UniqNonFleet = "";
											window.EnrolMode = "";
											window.fleetNam="";
											jQuery.sap
													.includeStyleSheet(jQuery.sap
															.getModulePath(
																	"zclaimstachart.view.style",
																	".css"));

											this.model = this.getOwnerComponent().getModel();
											if (!jQuery.support.touch) {
														this.getView().addStyleClass("sapUiSizeCompact");
													}
													if (sap.ui.Device.system.desktop) {

													}
													
													sap.ui.core.UIComponent.getRouterFor(this).getRoute(
													"page1").attachMatched(this._onRoute, this);
											
													this.onDealerInfo();
													
										},
										_onRoute: function(){
											
											Chart.defaults.global.defaultFontSize = 20;
											// Define a plugin to provide data labels
											  Chart.plugins.register({
											   afterDatasetsDraw: function(chart) {
											    var ctx = chart.ctx;
											    chart.data.datasets.forEach(function(dataset, i) {
											     var meta = chart.getDatasetMeta(i);
											     if (!meta.hidden) {
											      meta.data.forEach(function(element, index) {
											       // Draw the text in black, with the specified font
											       ctx.fillStyle = 'rgb(247, 249, 247)';
											       var fontSize = 18;
											       var fontStyle = 'normal';
											       var fontFamily = 'Helvetica Neue';
											       ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
											       // Just naively convert to string for now
											       var dataString = dataset.data[index].toString();
											       // Make sure alignment settings are correct
											       ctx.textAlign = 'center';
											       ctx.textBaseline = 'middle';
											       var padding = 5;
											       var position = element.tooltipPosition();
											       ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
											      });
											     }
											    });
											   }
											  });
										},
										
										onDealerInfo : function(){
											debugger
											var that=this;
											var user = new sap.ushell.services.UserInfo();
											var uid = user.getId();
											var oViewObj = this.getView();
											var DealerInfoSetJModel = oViewObj.getModel("DealerInfoSetJModel");
											if (!DealerInfoSetJModel) { 
												
												DealerInfoSetJModel = new sap.ui.model.json.JSONModel();
												oViewObj.setModel(DealerInfoSetJModel, "DealerInfoSetJModel");
											}
											
											var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
											var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
											oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
											
											var fncSuccess = function(oData, oResponse){
												
												DealerInfoSetJModel.setData(oData);
												
												var DlrName = DealerInfoSetJModel.oData.Name1;
								
												that.getView().byId("HeaderIdTit").setTitle(DlrName);
											}	
															
											var fncError = function(oError) { // error callback	// function
												var parser = new DOMParser();
												var message = parser.parseFromString(oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML
												sap.m.MessageBox.show(message, {
													title : "Error",
													icon : sap.m.MessageBox.Icon.ERROR,
												}); 
											}
											// Create Method for final Save
											oReadModel.read("/GetDealerInfoSet(Uname='"+uid+"',Bukrs='')", {
												success : fncSuccess,
												error : fncError
											});
											
										},		
										
										onFleetFragment:function(evt){
											that = this;
											that.ItemDescRow = evt.getSource();
											var jModel = new sap.ui.model.json.JSONModel(that.FleetData);
											var _valueHelpFleetDialog = new sap.m.SelectDialog(
													{

														title : "Select Fleet",
														items : {
															path : "/results",
															template : new sap.m.StandardListItem(
																	{
																		title : "{FleetName}",
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

									var oFilter = new sap.ui.model.Filter("FleetName",sap.ui.model.FilterOperator.Contains,sValue);
															oEvent.getSource().getBinding("items")
																	.filter([ oFilter ]);
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
												window.EnrolMode = oEvent.getParameter("selectedItem").getBindingContext().getObject().EnrolMode;
												if(window.EnrolMode === "M"){
													
													sap.ui.getCore().byId("stockLbl").setVisible(true);
													sap.ui.getCore().byId("btnStock").setVisible(true);
													sap.ui.getCore().byId("btnStock1").setVisible(true);
													sap.ui.getCore().byId("btnStock2").setVisible(true);
													
												}else{
													window.UniqFleet = "X";
													window.UniqNonFleet = "";
													sap.ui.getCore().byId("stockLbl").setVisible(false);
													sap.ui.getCore().byId("btnStock").setVisible(false);
												}
												
												that.ItemDescRow.setValue(
															oSelectedItem.getTitle());
												that.ItemDescRow.setName(oSelectedItem.getBindingContext().getObject().Kunnr);
													this.fromKunnr = oSelectedItem.getBindingContext().getObject().Kunnr;
													window.fleetNam = this.fromKunnr;
													that.ItemDescRow.setValue(
					 										oSelectedItem.getTitle());
													that.fleetName = oSelectedItem.getTitle();
													//that.getView().byId("fltName").setText("Testing for Claim Status");
													that.showChart();
													
											} 
 
										},
										
										onFleetCloseButton:function(){
											debugger
											var that = this;
											/*if(window.singleFleet === true){
												if(window.EnrolMode === "M"){
													var stock = sap.ui.getCore().byId("btnStock").getSelectedIndex();
													if(stock === 0){
														window.UniqFleet = "";
														window.UniqNonFleet = "X";
													}else{
														window.UniqFleet = "X";
														window.UniqNonFleet = "";
													}
												}else{
													
													window.UniqFleet = "X";
													window.UniqNonFleet = "";
												}
												
												that._FleetDialog.close();
												
											}else{
												

												if(that.ItemDescRow.getValue()!=""&& that.ItemDescRow.getValue()!=""){
													if(that.EnrolMode === "M"){
														var stock = sap.ui.getCore().byId("btnStock").getSelectedIndex();
														if(stock === 0){
															window.UniqFleet = "";
															window.UniqNonFleet = "X";
														}else{
															window.UniqFleet = "X";
															window.UniqNonFleet = "";
														}
													}else{
														
														window.UniqFleet = "X";
														window.UniqNonFleet = "";
													}
													
												that._FleetDialog.close();
												
												}else{
													sap.m.messageToast.show("Select Fleet")
												}
											
											}*/
											
											debugger
											that._FleetDialog.close();
											//that.getView().byId("fltName").setText("Testing for Claim Status");
											that.showChart();
											
										},
										
										onFleetCloseCancle:function(){
											window.history.back();
										},

										showChart : function(e) {
											var self = this;
									//		var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
											var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
											var oReadModel = new sap.ui.model.odata.ODataModel(
													sServiceUrl);
											oReadModel.setHeaders({
												"Content-Type" : "application/json"
											});
											self.jsonModel = new sap.ui.model.json.JSONModel();
											
											//var path = "/ReportFleetStockHeadSet(Kunnr='" + window.fleetNam + "',Fleet='" + window.UniqFleet + "',NonFleet='" + window.UniqNonFleet + "')?$expand=ReportFleetStockNvg";
											var path = "/DealerClaimCountSet";
											var fncSuccess = function(oData, oResponse) {
												debugger
											//  if (oData.ReportFleetStockNvg.results.length === 0) {
												if (oData.results.length === 0) {	
//													sap.m.MessageBox.show(
//															"Your not Registered to any Fleet", {
//																title : "Error",
//																icon : sap.m.MessageBox.Icon.ERROR,
//																onClose : function() {
//																	window.history.back();
//																}
//															});
												} else {
													
												//	self.Data = oData.ReportFleetStockNvg;
													self.Data = oData.results;
													self.jsonModel.setData(self.Data);
												//	var arr  = oData.ReportFleetStockNvg.results;
													var arr  = oData.results;
													var Count = [];
													var Name = [];

													for (var i=0;i<arr.length;i++) {
													   
														  Count.push(arr[i].Count); 
														  //Name.push(arr[i].HubName);
														  Name.push(arr[i].StatusDesc);
													}
													
													self.Chart(Count , Name)
												}
												
												self.bindTable();
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
													path, {
														success : fncSuccess,
														error : fncError
													});
//											this.getView().byId("table").setVisible(true);
											var router = sap.ui.core.UIComponent
													.getRouterFor(this);

											var _self = this;

											if (this.clear === true) {

												this.myChart.destroy();

											}

										

										},

										

										Chart : function(x,y) {
											
											debugger
											var router = sap.ui.core.UIComponent
											.getRouterFor(this);
											
											var canvas = document
											.getElementsByClassName("my_chart001")[0];
									var ctx = canvas.getContext("2d");
									Chart.defaults.global.animation.duration = 4000;
									
									Chart.defaults.global.animation.easing = "easeOutBounce";

									var myChart = new Chart(
											ctx,
											{
												type : "pie",
												data : {
													labels : y,
													datasets : [ {
														label : 'Claim Analysis',
														data : x,
														backgroundColor : [
																'rgba(255, 99, 32, 0.8)',
																'rgba(54, 162, 235, 0.8)',
																'rgba(255, 206, 86, 0.8)',
																'rgba(75, 192, 192, 0.8)',
																'rgba(153, 102, 255, 0.8)',
																'rgba(255, 159, 64, 0.8)' ],
														borderColor : [
																'rgba(255,99,132,4)',
																'rgba(54, 162, 235, 4)',
																'rgba(255, 206, 86, 4)',
																'rgba(75, 192, 192, 4)',
																'rgba(153, 102, 255, 4)',
																'rgba(255, 159, 64, 4)' ],
														borderWidth : 6
													} ],

													click : function(e) {
														alert("wrer");
													}
												},
												options : {
													
													onClick : function(
															a, b) {

														var chartLength = b.length;

														if (chartLength != 0) {
//
//															router
//																	.navTo("page2");

														}

													},
													responsive : true,
													maintainAspectRatio : false,
													 legend: {
												            labels: {
												                // This more specific font property overrides the global property
												                fontColor: 'white'
												            }
												        },
													title : {
														display : true,
														text : 'Digital analysis for Claims'
													},
												}
											});
									//this.bindTable();
											
									this.clear = true;
										},

										/**
										 * Similar to onAfterRendering, but this
										 * hook is invoked before the
										 * controller's View is re-rendered (NOT
										 * before the first rendering! onInit()
										 * is used for that one!).
										 * 
										 * @memberOf zclaimstacharts.View
										 */
										// onBeforeRendering: function() {
										//
										// },
										/**
										 * Called when the View has been
										 * rendered (so its HTML is part of the
										 * document). Post-rendering
										 * manipulations of the HTML could be
										 * done here. This hook is the same one
										 * that SAPUI5 controls get after being
										 * rendered.
										 * 
										 * @memberOf zclaimstacharts.View
										 */
										onAfterRendering : function() {
											
											Chart.defaults.global.defaultFontColor = "#fff";
											
											Chart.defaults.global.animation.duration = 4000;
											
											Chart.defaults.global.animation.easing = "easeOutBounce";
											
											Chart.defaults.global.defaultFontSize = 18;
											
											
											var that = this;
											var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
											var oReadModel = new sap.ui.model.odata.ODataModel(
													sServiceUrl);
											oReadModel.setHeaders({
												"Content-Type" : "application/json"
											});
											var fncSuccess = function(oData, oResponse){
												debugger
												if(oData.results.length!=0 ){
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
													window.singleFleet = true;
													window.EnrolMode=oData.results[0].EnrolMode;
													that.Customer = oData.results[0].Kunnr;
													window.fleetNam = that.Customer;
//													that.getView().byId("lblFleet").setText(oData.results[0].FleetName);
												
													
													
													if(window.EnrolMode === "M"){
														
														that.FleetData=oData;
														if (!that._FleetDialog) {
														that._FleetDialog = sap.ui.xmlfragment(
																"zclaimstachart.view.Intial", that);
															that.getView().addDependent(that._FleetDialog);
															}
														
														sap.ui.getCore().byId("stockLbl").setVisible(true);
														sap.ui.getCore().byId("btnStock").setVisible(true);
														sap.ui.getCore().byId("btnStock1").setVisible(true);
														sap.ui.getCore().byId("btnStock2").setVisible(true);
														sap.ui.getCore().byId("fleetInput").setEnabled(false);
														sap.ui.getCore().byId("fleetInput").setValue(oData.results[0].FleetName);
														that._FleetDialog.open();
														
													}else{
														window.UniqFleet = "X";
														window.UniqNonFleet = "";
														if (!that._FleetDialog) {
															that._FleetDialog = sap.ui.xmlfragment(
																	"zclaimstachart.view.Intial", that);
																that.getView().addDependent(that._FleetDialog);
																}
//														sap.ui.getCore().byId("lblFleet").setText(oData.results[0].FleetName);
														sap.ui.getCore().byId("stockLbl").setVisible(false);
														sap.ui.getCore().byId("btnStock").setVisible(false);
														sap.ui.getCore().byId("btnStock1").setVisible(false);
														sap.ui.getCore().byId("btnStock2").setVisible(false);
														sap.ui.getCore().byId("fleetInput").setEnabled(false);
														sap.ui.getCore().byId("fleetInput").setValue(oData.results[0].FleetName);
														that._FleetDialog.open();
														
													}
													
													
													
													
													}
												else{
													window.EnrolMode="M";
													that.FleetData=oData;
													if (!that._FleetDialog) {
													that._FleetDialog = sap.ui.xmlfragment(
															"zclaimstachart.view.Intial", that);
														that.getView().addDependent(that._FleetDialog);
														}
													
													
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
											/*if(that.o === false){
												that.o = true;
											oReadModel.read("/User_Fleet_DetialsSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'", {
												success : fncSuccess,
												error : fncError
											});
											
											}*/
											
											//that.getView().byId("fltName").setText("Testing for Claim Status");											
											that.showChart();
											
											
											
											
											// Define a plugin to provide data labels
											  Chart.plugins.register({
											   afterDatasetsDraw: function(chart) {
											    var ctx = chart.ctx;
											    chart.data.datasets.forEach(function(dataset, i) {
											     var meta = chart.getDatasetMeta(i);
											     if (!meta.hidden) {
											      meta.data.forEach(function(element, index) {
											       // Draw the text in black, with the specified font
											       ctx.fillStyle = 'rgb(247, 249, 247)';
											       var fontSize = 18;
											       var fontStyle = 'normal';
											       var fontFamily = 'Helvetica Neue';
											       ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
											       // Just naively convert to string for now
											       var dataString = dataset.data[index].toString();
											       // Make sure alignment settings are correct
											       ctx.textAlign = 'center';
											       ctx.textBaseline = 'middle';
											       var padding = 5;
											       var position = element.tooltipPosition();
											       ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
											      });
											     }
											    });
											   }
											  });
											  
											
											
//
										},
										
										bindTable : function() {
                                            debugger
											var _self = this;
											

											var loTableBindingPath = "/ReportFleetHubStockHeadSet?$filter=Kunnr eq '12' and HubCode eq '12'&$expand=ReportFleetHubStockNvg";
											var loTable = this.getView().byId("table").setModel(_self.jsonModel);

											loTable.bindItems({
												path : "/",
												// filters : loFilter,
												template : new sap.m.ColumnListItem({
													cells : [ new sap.m.Text({
														visible : false,
														text : "{TyreType}"
													}), new sap.m.Text({
														text : "{TypeDesc}"
													}), new sap.m.Text({
														text : "{Count}"
													}) ]

												})
											});

											loTable.bindItems({
												path : "/",
												// filters : loFilter,
												template : new sap.m.ColumnListItem({
													type:"Active",
													cells : [ new sap.m.Text({
														visible : false,
														text : "{Status}"
													}), new sap.m.Text({
														text : "{StatusDesc}"
													}), new sap.m.Text({
														text : "{Count}"
													}) ]

												})
											});

										}, 
										
										itemPress : function(e){
											debugger 
										var router = sap.ui.core.UIComponent.getRouterFor(this);
										var hub = e.getParameters().listItem.getCells()[0].getText();
										window.hubName = e.getParameters().listItem.getCells()[1].getText();
										router.navTo("View1",{hub : hub});
										
										/*var selectedData={};
										var tempjsonString = JSON.stringify(selectedData);
										var jsonstring = tempjsonString.replace(/\//g, "@");
										var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
										oRouter.navTo("View1",{"entity":JSON.stringify(jsonstring)});*/
											
											
										/*	var a = 1;
											var router = sap.ui.core.UIComponent
											.getRouterFor(this);
											var hub = e.getParameters().listItem.getCells()[0].getText();
											window.hubName = e.getParameters().listItem.getCells()[1].getText();
											router
											.navTo(
													"page2",
													{
														hub : hub
													},
													true);*/
										}
										

									/**
									 * Called when the Controller is destroyed.
									 * Use this one to free resources and
									 * finalize activities.
									 * 
									 * @memberOf zclaimstacharts.View
									 */
									// onExit: function() {
									//
									// }
									});
				});