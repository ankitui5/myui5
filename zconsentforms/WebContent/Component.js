jQuery.sap.declare("imed.app.consentforms.Component");
jQuery.sap.require("imed.app.consentforms.MyRouter");
sap.ui.core.UIComponent.extend("imed.app.consentforms.Component", {
	metadata : {
		name : "Consent Forms",
		version : "1.0",
		includes : [],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},
		rootView : "imed.app.consentforms.view.App",
		config : {
			resourceBundle : "i18n/messageBundle.properties",
			serviceConfig : {
				name : "Northwind",
				serviceUrl : "/sap/opu/odata/sap/Z_MEDFORMS_SRV_SRV/"
			}
		},
		routing : {
			config : {
				routerClass : imed.app.consentforms.MyRouter,
				viewType : "XML",
				viewPath : "imed.app.consentforms.view",
				targetAggregation : "detailPages",
				clearTarget : false

			},

			routes : [
			          {
			        	  pattern : "",
			        	  name : "main",
			        	  view : "Master",
			        	  targetAggregation : "masterPages",
			        	  targetControl : "idAppControl",
			        	  viewLevel : 0,
			        	  subroutes : [
			        	               {
			        	            	   viewLevel :1,
			        	            	   pattern : "",
			        	            	   name : "general",
			        	            	   view : "Initial",
			        	            	   targetAggregation : "detailPages"
			        	               },
			        	               {
			        	            	   viewLevel :1,
			        	            	   pattern : "error",
			        	            	   name : "error",
			        	            	   view : "General",
			        	            	   targetAggregation : "detailPages"
			        	               }
			        	               ]
			          },
			          {
			        	  name : "catchallMaster",
			        	  view : "Master",
			        	  targetAggregation : "masterPages",
			        	  targetControl : "idAppControl",
			        	  subroutes : [
			        	               {
			        	            	   pattern : ":all*:",
			        	            	   name : "catchallDetail",
			        	            	   view : "NotFound",
			        	            	   transition : "show"
			        	               }
			        	               ]
			          }
			          ]
		}
	},

	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		config = 
		{

				baseURL:'/sap/opu/odata/sap/Z_MEDFORMS_SRV_SRV/',
				institution : 'MH01',
				NursingOU: 'POPPUMH1'

		};
		appError = undefined;

		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var rootPath = jQuery.sap.getModulePath("imed.app.consentforms");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [rootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		sServiceUrl = getServiceUrl(mConfig.serviceConfig.serviceUrl);

		function getServiceUrl(sServiceUrl) {
			//for local testing prefix with proxy
			//if you and your team use a special host name or IP like 127.0.0.1 for localhost please adapt the if statement below 
			if (window.location.hostname == "localhost") {
				return "proxy" + sServiceUrl;
			} else {
				return sServiceUrl;
			}
		}

		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		oModel1 = oModel;
		this.setModel(oModel);

		function getUserDetails(user) {
			var ret = -1;
			//var url = "/UserDetailsCollection('"+user+"')/UserParameterCollection";
			//user = "Kalith";
			var url = "/UserDetailsCollection(Username='"+user+"')";
			oModel1.read(url,{async:false, 
				success: function(oData, oResponse) { 
					ret = oData;
					/*if(oData.results && oData.results.length > 0)
					{
						for(var i=0; i<oData.results.length;i++){
							if(oData.results[i].Key == "EIN"){
								ret = oData.results[i].Value;
								break;
							}
						}
					}
					else{ret = -1;}*/
				}, 
				error: function(oError){  
					ret = -1;
					return;
				}  
			});
			return ret;
		}
		debugger;
		if(oUserModel.userID != ""){
			var userDetail = getUserDetails(oUserModel.userID);
			if(userDetail != undefined){
				config.institution = userDetail.Institution;
			}
		}
		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
					listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		this.setModel(deviceModel, "device");


		this.getRouter().initialize();


	},
});
