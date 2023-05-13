jQuery.sap.declare("com.acute.ticketZSC.Component");
jQuery.sap.require("com.acute.ticketZSC.MyRouter");
jQuery.sap.require("sap.ui.core.util.MockServer");
sap.ui.core.UIComponent.extend("com.acute.ticketZSC.Component", {
  metadata : {
    name : "com.acute.ticketZSC",
    version : "1.0",
    includes : ["css/style.css"],
    dependencies : {
      libs : ["sap.m", "sap.ui.layout","sap.ushell"],
      components : []
    },
    rootView : "com.acute.ticketZSC.view.App",
    config : {
      resourceBundle : "i18n/messageBundle.properties",
      serviceConfig : {
        name: "",
      //serviceUrl: "../com.acute.ticketZSC/proxy/sap/opu/odata/sap/ZCS_TICKET_SRV?saml2=disabled"
    	serviceUrl:"/sap/opu/odata/sap/ZCS_TICKET_SRV"
      }
    },
    routing : {
        config: {
            routerClass: "com.acute.ticketZSC.MyRouter",
            viewType: "XML",
            viewPath: "com.acute.ticketZSC.view",
            targetAggregation: "detailPages",
            clearTarget: false
          },
          routes: [{
            pattern: "",
            name: "main",
            view: "Master",
            targetAggregation: "masterPages",
            targetControl: "idAppControl",
            subroutes: [{
            	pattern: "Detail/{contextPath}",
              name: "Detail",
              view: "Detail"
            }]
          }, {
            name: "catchallMaster",
            view: "Master",
            targetAggregation: "masterPages",
            targetControl: "idAppControl",
            subroutes: [{
              pattern: "NotFound",
              name: "NotFound",
              view: "NotFound",
              transition: "show"
            }]
          }]}
  },


      init : function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        var sRootPath = jQuery.sap.getModulePath("com.acute.ticketZSC");
        var oServiceConfig = this.getMetadata().getConfig().serviceConfig;
        var sServiceUrl = oServiceConfig.serviceUrl;
        var mConfig = this.getMetadata().getConfig();
        var oDataModel=new sap.ui.model.odata.ODataModel(sServiceUrl,true);
        this.setModel(oDataModel);
        this._routeMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter(), this._bRouterCloseDialogs);
        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl : [ sRootPath, mConfig.resourceBundle ].join("/")
        });
        this.setModel(i18nModel, "i18n");
        this.getRouter().initialize();
    },

    exit : function() {
        this._routeMatchedHandler.destroy();
    },
    
    setRouterSetCloseDialogs : function(bCloseDialogs) {
        this._bRouterCloseDialogs = bCloseDialogs;
        if (this._routeMatchedHandler) {
            this._routeMatchedHandler.setCloseDialogs(bCloseDialogs);
        }
    },
});