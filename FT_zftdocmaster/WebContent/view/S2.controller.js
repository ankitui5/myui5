/*sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"zftdocmaster/util/Formatter",
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
//	"sap/suite/ui/commons/imageeditor/ImageEditor",
//	"sap/suite/ui/commons/imageeditor/ImageEditorContainer"
	],

function(Controller, JSONModel,Spreadsheet, MessageBox,  Formatter,  Device, Dialog, Button, ImageEditor, ImageEditorContainer) {
"use strict";	
var race, testPlan, testRequest, fitmentInspection, claimInspection,selectedGuId,TestRequest;

return sap.ui.controller("zftdocmaster.view.S2", {
	
onInit: function(){
	 sap.ui.core.UIComponent.getRouterFor(this).getRoute("S2").attachMatched(this._onRoute, this);
},
  
_onRoute : function(e){
	debugger
	var that 				= this;
	var tempjsonString  	= e.getParameter("arguments").entity;
	var jsonstring 			= tempjsonString.replace(/@/g, "/");
	var tempSelectedData 	= JSON.parse(jsonstring);
	this.SelectedData  		= JSON.parse(tempSelectedData);
	var allSelectedData 	= this.SelectedData;
	//this.onEnter(allSelectedData);
},

	 getAttachmentDetails: function(evt){   
		 debugger
		 var varPath = evt.getSource().getBindingContext("getImageJModel").getPath().split('/results/')[1];
		 var varData = evt.getSource().getBindingContext("getImageJModel").getModel().getData()["results"][varPath];
		// window.location.assign(encodeURI("/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='"+varData.ObjectName+ "')/$value"));
		sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='"+varData.ObjectName+ "')/$value",true);
		 
		 
		},

});
});
*/

sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"zftdocmaster/util/Formatter",
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
//	"sap/suite/ui/commons/imageeditor/ImageEditor",
//	"sap/suite/ui/commons/imageeditor/ImageEditorContainer"
	],

function(Controller, JSONModel,Spreadsheet, MessageBox,  Formatter,  Device, Dialog, Button, ImageEditor, ImageEditorContainer) {
"use strict";	
var race, testPlan, testRequest, fitmentInspection, claimInspection,selectedGuId,TestRequest,ObjectName;

return sap.ui.controller("zftdocmaster.view.S2", {
	
onInit: function(){
	 sap.ui.core.UIComponent.getRouterFor(this).getRoute("S2").attachMatched(this._onRoute, this);
},
  
_onRoute : function(e){
	debugger
	var that 				= this;
	var tempjsonString  	= e.getParameter("arguments").entity;
	var jsonstring 			= tempjsonString.replace(/@/g, "/");
	var tempSelectedData 	= JSON.parse(jsonstring);
	this.SelectedData  		= JSON.parse(tempSelectedData);
	var allSelectedData 	= this.SelectedData;
//	ObjectName = allSelectedData.ObjectName;
	ObjectName =allSelectedData.PlanToImagesNvg.results[0].ObjectName;

	this.getAttachmentDetails();

},


getAttachmentDetails: function(){   
	 debugger
	var oView = this.getView();  
    var ImageInfo = oView.getModel("ImageInfo");
    if (!ImageInfo) {
   	 ImageInfo = new sap.ui.model.json.JSONModel();
   	 oView.setModel(ImageInfo, "ImageInfo");
    }
    var sServiceUrl = "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/";
    var sPathImageInfo = "/ImageDisplaySet(DocNo='"+ObjectName+"')/$value";
    var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
    var oParamsImageInfo = {};
    oParamsImageInfo.context = "";
    oParamsImageInfo.urlParameters = "";
    oParamsImageInfo.success = function(oData, oResponse) { // success handler
    debugger
    oView.byId("img1").setSrc(oResponse.requestUri).addStyleClass("myimage");
 //   oView.byId("img2").setSrc(oResponse.requestUri).addStyleClass("myimage");
 //   ImageInfo.setData(oData);
   };
    oParamsImageInfo.error = function(oError) { // error handler            
           jQuery.sap.log.error("read publishing group data failed");
    }.bind(this);
    frameworkODataModel.read(sPathImageInfo, oParamsImageInfo);
    frameworkODataModel.attachRequestCompleted(function() {
    });
//	 window.open(encodeURI("/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='40000001595')/$value"));
	},

	onDownload	:function(){
		$(function() {
			$('a[data-auto-download]').each(function(){
			var $this = $(this);
			setTimeout(function() {
			window.location = $this.attr('href');
			}, 2000);
			});
			});
	},
	
	
});
});



