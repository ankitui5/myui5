jQuery.sap.declare("ZRACEMGMT.Component");
sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";
	return UIComponent.extend("ZRACEMGMT", {

		metadata : {
			name : "Vehicle",
			includes : ["css/style.css"],
			dependencies : {
				libs : [ "sap.m" ],
				components : []
			},
			config : {
				/* Adding the service configuration for OData URI */
				"serviceConfig" : {
					"name" : "SOTC",
					"serviceUrl" : "/sap/opu/odata/sap/ZMM_RACE_SRV" 
				}
			},
			rootView : "ZRACEMGMT.view.App",
			routing : {
				config : {
					routerClass : "sap.m.routing.Router",
					viewPath : "ZRACEMGMT.view",
					controlId : "rootControl",
					controlAggregation : "pages",
					transition : "slide",
					viewType : "XML"
				},
				
				routes : [ {
						name : "SS1",
						pattern : "",
						target : "SS1"
						},
					
					{
					name : "page1",
					// empty hash - normally the start page
					pattern : "page1/{entity}",
					target : "page1"
				}, {
					name : "page2",
					pattern : "Create",
					target : "page2"
				}, {
					name : "page3",
					pattern : "ApprovalList",
					target : "page3"
				},
				 {
					name : "amountPage",
					pattern : "amountPage/{details}",
					target : "amountPage"
				}],
				
				targets : {
					SS1 : {
						viewName : "S1",
						viewLevel : 1
	 				},
					page1 : {
						viewName : "View1",
						viewLevel : 2
					},
					page2 : {
						viewName : "Create",
						viewLevel : 3
					},
					page3 : {
						viewName : "ApprovalList",
						viewLevel : 4
					},
					amountPage : {
						viewName : "AmountTree",
						viewLevel : 5
					}
				}
			}
		},

		init : function() {
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			var mConfig = this.getMetadata().getConfig();
			var sServiceUrl = mConfig.serviceConfig.serviceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			oModel.setDefaultCountMode((sap.ui.model.odata.CountMode.None));
			oModel.attachMetadataFailed(function() {
				this.getEventBus().publish("Component", "MetadataFailed");
			}, this);
			this.setModel(oModel);
			sap.ui.getCore().setModel(oModel, "Model");
			this.setModel(oModel, "Model");
			var deviceModel = new sap.ui.model.json.JSONModel({
				isTouch : sap.ui.Device.support.touch,
				isNoTouch : !sap.ui.Device.support.touch,
				isPhone : sap.ui.Device.system.phone,
				isNoPhone : !sap.ui.Device.system.phone,
				listMode : sap.ui.Device.system.phone ? "None"
						: "SingleSelectMaster",
				listItemType : sap.ui.Device.system.phone ? "Active"
						: "Inactive"
			});
			deviceModel.setDefaultBindingMode("OneWay");

			this.setModel(deviceModel, "device");
			this.getRouter().initialize();
		},
		exit : function() {
			// this._routeMatchedHandler.destroy();
		},
		setRouterSetCloseDialogs : function(bCloseDialogs) {
			this._bRouterCloseDialogs = bCloseDialogs;
			if (this._routeMatchedHandler) {
				this._routeMatchedHandler.setCloseDialogs(bCloseDialogs);
			}
		},

		_initODataModel : function(sServiceUrl) {
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.setModel(oModel);
		}

	});
}, /* bExport= */true);