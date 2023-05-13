 var StnclSrchModel,getModelData,getSelectedStncl,stnclDetails;
sap.ui.define([
       "sap/m/MessageToast",
       "sap/m/SelectDialog",
       "sap/m/Toolbar",
       'sap/ui/core/Fragment', 
       "sap/ui/core/mvc/Controller",
       "sap/ui/model/json/JSONModel",
       "sap/m/MessageToast",   
       "jquery.sap.global",
       "jquery.sap.script",
     	"sap/ui/core/mvc/Controller",
	   	"sap/ui/model/json/JSONModel",
	   	"zstencil/util/Formatter"
 
], function(Controller, JSONModel ,MessageToast,Formatter) {
       "use strict";
return sap.ui.controller("zstencil.view.View1", {
                                  
onInit: function() {},

stnclChange:function(oEvent)
{
debugger
var text     = oEvent.getSource().getValue();
var uppertext = text.toUpperCase();
var reg      = /^[0-9A-Z]+$/;
if( !uppertext.match(reg) ){
	if( !isNaN( uppertext.charAt(0)) || !uppertext.charAt(0).match(reg)){
		uppertext = uppertext.substring( 1 , uppertext.length );
	}else if( !isNaN( uppertext.charAt( uppertext.length - 1 )) || !uppertext.charAt(uppertext.length - 1).match(reg)){
		uppertext = uppertext.substring( 0 , uppertext.length - 1 );
	}else{
		for( var i = 0 ; i < uppertext.length; i++ ){
			if( !isNaN( uppertext.charAt(i) ) || !uppertext.charAt(i).match(reg)){
				uppertext = uppertext.split( uppertext.charAt(i) )[0] + uppertext.split( uppertext.charAt(i) )[1];
				
			}
		}
	}
	oEvent.getSource().setValue( uppertext );  
}else{
	oEvent.getSource().setValue( uppertext );
//	oEvent.getSource().setValueState( "None" );
}       

      /* var alpha = getStnclId.charCodeAt(getStnclId.length-1);
       
       if (!(alpha>64 && alpha<91) && !(alpha>96 && alpha<123) && !(alpha==32)){
    	   getStnclId = getStnclId.substring(0,getStnclId.length-1);
             this.getView().byId("idstncl").setValue(getStnclId);
       }
             else if((alpha>64 && alpha<91) && (alpha>96 && alpha<123)){
                    this.getView().byId("idstncl").setValue();
             }*/
},


/*************** Stencil Search *********************/
	onstnclsrch : function()
	{
	debugger
    var that = this;
    var oView = this.getView();
   
    stnclDetails = oView.getModel("stnclDetails");
    if (!stnclDetails) {  
    	 stnclDetails = new sap.ui.model.json.JSONModel();
    	oView.setModel(stnclDetails, "stnclDetails");
    }
    StnclSrchModel = oView.getModel("StnclSrchModel");
    if (!StnclSrchModel) {
    	StnclSrchModel = new sap.ui.model.json.JSONModel();  
           oView.setModel(StnclSrchModel, "StnclSrchModel");
    }
    var getSelectedStncl= oView.byId("idstncl").getValue();
	  if(getSelectedStncl =="")
		  {
		  oView.byId("idstncl").setValueState("Error");
		  oView.byId("idstncl").setValue();
		  }
	  else
		  {
		  oView.byId("idstncl").setValueState("None");
    var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
    var sPathStncl = "StencilSearchSet?$filter=StnclNumber eq '"+getSelectedStncl+"'";
    var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
    var oParamsStnclSrch = {};
    oParamsStnclSrch.context = "";
    oParamsStnclSrch.urlParameters = "";
    oParamsStnclSrch.success = function(oData, oResponse) { // success handler
     debugger
    	if(oData.results.length==0)
    		{
    		sap.m.MessageToast.show("No Data Found");
    		}
           StnclSrchModel.setData(oData.results);
           stnclDetails.setData(oData.results[oData.results.length-1]);
    
    };
    oParamsStnclSrch.error = function(oError) { // error handler            
           jQuery.sap.log.error("Error");
    }.bind(this);
    frameworkODataModel.read(sPathStncl, oParamsStnclSrch);
    frameworkODataModel.attachRequestCompleted(function() {
    });
		  }
},

onclearstncl:function()
{
	debugger
    this.getView().byId("idstncl").setValue();
	StnclSrchModel.setData();
	stnclDetails.setData();
	}
	

})
})

