jQuery.sap.declare("zstockreport.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
sap.ui.core.UIComponent.extend("zstockreport.Component", {
       metadata : { 
              "name" : "zstockreport",
//              "url":"/sap/bc/ui5_ui5/sap/zrmaps",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "zstockreport",
              "includes" : ["css/style.css"],
              "dependencies" : {
                     "libs" : [ "sap.m", "sap.ui.layout" ],
                     "components" : []
              },
              "config" : {
                     resourceBundle : "i18n/messageBundle.properties",
                     serviceConfig : {
                       name: "",
                     }
              },
               
             
              
              routing : { 
            	  
                    /* config : {
                           "viewType" : "XML",
                           "viewPath" : "zrmaps.view",
                           "targetControl" : "fioriContent",
                           "targetControl" : "rootControl",
                           "targetAggregation" : "pages",
                           "clearTarget" : false
                     },*/
            	  
            	  config : {
						"routerClass" : "sap.m.routing.Router",
						"viewPath" : "zstockreport.view",
						"controlId" : "rootControl",
						//targetControl : "fioriContent",
						"controlAggregation" : "pages",
						"transition": "slide",
						"viewType" : "XML"
					},
                     
                     routes : [

                               {
                                     pattern : "", 
                                     name : "View",
                                     view : "View"
                               },
                               
                               {
                            	   name : "View1",
                            	   pattern : "View1/{entity}",
                            	   target : "View1"
                               },
                               
                     ],
                     
                     targets : {
                    	 page1 : {
								viewName : "View",
								viewLevel : 1
			 				},
			 				View1 : {
								viewName : "View1",
								viewLevel : 2
							},
							
						}
                     
              }
       },
       
       createContent : function() {
          var oViewData = { component : this };
          return sap.ui.view({
             /*viewName : "zrmaps.view.View1",*/
        	  viewName : "zstockreport.view.App",
             type : sap.ui.core.mvc.ViewType.XML,
             viewData : oViewData
          });
       },
       
       init : function() {
           sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
           var mConfig = this.getMetadata().getConfig();
//           var sServiceUrl = mConfig.serviceConfig.serviceUrl;
//           var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true);
//           oModel.setDefaultCountMode((sap.ui.model.odata.CountMode.None));
//           oModel.attachMetadataFailed(function(){
//                  this.getEventBus().publish("Component", "MetadataFailed");
//           },this);
//           this.setModel(oModel);
           var deviceModel = new sap.ui.model.json.JSONModel({
                  isTouch : sap.ui.Device.support.touch,
                  isNoTouch : !sap.ui.Device.support.touch,
                  isPhone : sap.ui.Device.system.phone,
                  isNoPhone : !sap.ui.Device.system.phone,
                  listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
                               listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
           });
           deviceModel.setDefaultBindingMode("OneWay");  
           
           var oRootPath = jQuery.sap.getModulePath("zstockreport");   
           var i18nModel = new sap.ui.model.resource.ResourceModel({
   			 bundleUrl : [oRootPath, mConfig.resourceBundle].join("/")
   		   });    
   		   this.setModel(i18nModel, "i18n");
   		   
           this.setModel(deviceModel, "device");
           this.getRouter().initialize();
       },
       exit : function() {
          // this._routeMatchedHandler.destroy();
       },
       

   });