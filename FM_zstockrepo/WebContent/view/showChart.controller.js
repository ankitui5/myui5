jQuery.sap.require("ZSTOCKREPO.Resources_Chart.Chart");

sap.ui
		.controller(
				"ZSTOCKREPO.view.showChart",
				{
					
					ind : true,

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf ZSTOCKREPOs.showChart
					 */
					onInit : function() {

						if (!jQuery.support.touch) {
							this.getView().addStyleClass("sapUiSizeCompact");
						}
						if (sap.ui.Device.system.desktop) {

						}
						jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(
								"ZSTOCKREPO.view.style", ".css"));

						sap.ui.core.UIComponent.getRouterFor(this).getRoute(
								"page2").attachMatched(this._onRoute, this);
					},

					_onRoute : function(e) {
						
						
						
						if(this.ind === true){
						this.getView().byId("showChartPage").setTitle(window.hubName);
						var self = this;
						self.hub = e.mParameters.arguments.hub;
						var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
						var oReadModel = new sap.ui.model.odata.ODataModel(
								sServiceUrl);
						oReadModel.setHeaders({
							"Content-Type" : "application/json"
						});
						self.jsonModel = new sap.ui.model.json.JSONModel();

						var path = "/ReportFleetHubStockHeadSet?$filter=Kunnr eq '" + window.fleetNam + "' and HubCode eq '" + self.hub + "' and Fleet eq '" + window.UniqFleet + "' and NonFleet eq '" + window.UniqNonFleet + "'&$expand=ReportFleetHubStockNvg";
						var fncSuccess = function(oData, oResponse) {
							debugger
							if (oData.results.length === 0) {
								sap.m.MessageBox.show(
										"You are not registered to any hub.", {
											title : "Error",
											icon : sap.m.MessageBox.Icon.ERROR,
											onClose : function() {
												window.history.back();
											}
										});
							} else {
								self.Data = oData;
								var arr = oData.results;
								self.jsonModel.setData(self.Data);
								window.BaseModel = self.jsonModel;
								var Count = [];
								var Name = [];

								for (i = 0; i < arr.length; i++) {

									Count.push(arr[i].Count);
									Name.push(arr[i].TyreType);

								}

								self.Chart(Count, Name)
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
						oReadModel.read(path, {
							success : fncSuccess,
							error : fncError
						});
						// this.getView().byId("table").setVisible(true);
						var router = sap.ui.core.UIComponent.getRouterFor(this);
						}

					},

					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf ZSTOCKREPOs.showChart
					 */
					// onBeforeRendering: function() {
					//
					// },
					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf ZSTOCKREPOs.showChart
					 */
				

					Chart : function(x, y) {

						var router = sap.ui.core.UIComponent.getRouterFor(this);

						var canvas = document
								.getElementsByClassName("my_chart1")[0];
						var ctx = canvas.getContext("2d");

						var myChart = new Chart(ctx, {
							type : "bar",
							data : {
								labels : y,
								datasets : [ {
									data : x,
									backgroundColor : [
											'rgba(95, 169, 242, 0.6)',
											'rgba(54, 162, 235, 0.6)',
											'rgba(255, 206, 86, 0.6)',
											'rgba(75, 192, 192, 0.6)',
											'rgba(153, 102, 255, 0.6)',
											'rgba(255, 159, 64, 0.6)' ],
									borderColor : [ 'rgba(255,99,132,5)',
											'rgba(54, 162, 235, 1)',
											'rgba(255, 206, 86, 1)',
											'rgba(75, 192, 192, 1)',
											'rgba(153, 102, 255, 1)',
											'rgba(255, 159, 64, 1)' ],
									borderWidth : 5
								} ],

								click : function(e) {
									alert("wrer");
								}
							},
							options : {
								legend: {
						            display: false,
						            labels: {
						                fontColor: 'rgb(255, 99, 132)',
						                	fontSize: 15
						            }
						        },
								onClick : function(a, b) {

									var chartLength = b.length;

									if (chartLength != 0) {

//										 router
//										 .navTo("page3");

									}

								},
								responsive : true,
								maintainAspectRatio : false,
								scales : {
									yAxes : [ {
										ticks : {
											beginAtZero : true
										}
									} ]
								}
								
							}
						});

						this.bindTable();

					},

					bindTable : function() {

						var _self = this;

						var loTableBindingPath = "/ReportFleetHubStockHeadSet?$filter=Kunnr eq '12' and HubCode eq '12'&$expand=ReportFleetHubStockNvg";
						var loTable = this.getView().byId("table").setModel(
								_self.jsonModel);

						loTable.bindItems({
							path : "/results",
							// filters : loFilter,
							template : new sap.m.ColumnListItem({
								cells : [ new sap.m.Text({
									text : "{TyreType}"
								}), new sap.m.Text({
									text : "{TypeDesc}"
								}), new sap.m.Text({
									text : "{Count}"
								}) ]

							})
						});

						loTable.bindItems({
							path : "/results",
							// filters : loFilter,
							template : new sap.m.ColumnListItem({
								type:"Active",
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

					},
					
					itemPress : function(e){
						var item = e.getParameters().listItem.getBindingContext().sPath.split("/")[2];
						var router = sap.ui.core.UIComponent.getRouterFor(this);
						
						window.TyreName = e.getParameters().listItem.getCells()[1].getText();
					
						router
						.navTo(
								"page3",
								{
									sub : item
								},
								true);
						this.ind = false;
					},
					
					onBack : function(){
						
						
						var router = sap.ui.core.UIComponent.getRouterFor(this);
						
						router
						.navTo("page1");
					}

				/**
				 * Called when the Controller is destroyed. Use this one to free
				 * resources and finalize activities.
				 * 
				 * @memberOf ZSTOCKREPOs.showChart
				 */
				// onExit: function() {
				//
				// }
				});