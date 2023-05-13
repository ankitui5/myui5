jQuery.sap.declare("com.acute.spinsp.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("com.acute.spinsp.MyRouter");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
sap.ui.core.UIComponent.extend("com.acute.spinsp.Component", {
       metadata : {
              "name" : "com.acute.spinsp",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "com.acute.spinsp",
              "includes" : ["css/style.css"],
              "dependencies" : {
                     "libs" : [ "sap.m", "sap.ui.layout" ],
                     "components" : []
              },
              "config" : {
                     resourceBundle : "i18n/messageBundle.properties",
                     serviceConfig : {
                       name: "",
                      //serviceUrl: "../com.acute.spinsp/proxy/sap/opu/odata/sap/ZCS_TICKET_SRV/?saml2=disabled"
                       serviceUrl: "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/"   
                     }
              },
              routing : {
                     config : {
                    	 routerClass: com.acute.spinsp.MyRouter,
                           viewType : "XML",
                           viewPath : "com.acute.spinsp.view",
                           targetControl : "fioriContent",
                           targetAggregation : "pages",
                           clearTarget : false
                     },
                     routes : [

                               {
                                     pattern : "",
                                     name : "S1",
                                     view : "S1"
                               },
                               {
               					name : "S2",
               					view : "S2",
               					pattern : "S2"
               				},
                     ]
              }
       },
       createContent : function() {
          var oViewData = { component : this };
          return sap.ui.view({
             viewName : "com.acute.spinsp.view.Main",
             type : sap.ui.core.mvc.ViewType.XML,
             viewData : oViewData
          });
       },
       init : function() {
           sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
           var mConfig = this.getMetadata().getConfig();
           var sServiceUrl = mConfig.serviceConfig.serviceUrl;
           var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true);
           oModel.setDefaultCountMode((sap.ui.model.odata.CountMode.None));
           oModel.attachMetadataFailed(function(){
                  this.getEventBus().publish("Component", "MetadataFailed");
           },this);
           this.setModel(oModel);
           var deviceModel = new sap.ui.model.json.JSONModel({
                  isTouch : sap.ui.Device.support.touch,
                  isNoTouch : !sap.ui.Device.support.touch,
                  isPhone : sap.ui.Device.system.phone,
                  isNoPhone : !sap.ui.Device.system.phone,
                  listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
                               listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
           });
           deviceModel.setDefaultBindingMode("OneWay");  
           
           var oRootPath = jQuery.sap.getModulePath("com.acute.spinsp");   
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