
sap.ui.define([
       "sap/m/MessageBox",
       "sap/m/SelectDialog",
       "sap/m/Toolbar",
       'sap/ui/core/Fragment',
       "sap/ui/core/mvc/Controller",
       "sap/ui/model/json/JSONModel", 
       "sap/m/MessageToast",
       "jquery.sap.global",
       "jquery.sap.script",
       "zexposeapprove/util/Formatter"
       
], function(MessageBox,Fragment,Controller, JSONModel,MessageToast,Dialog,Formatter) {
       "use strict";
              var that,StateKey;
       
return sap.ui.controller("zexposeapprove.view.S2", {
                                 
onInit: function(evt) {      
	debugger
	 sap.ui.core.UIComponent.getRouterFor(this).getRoute("S2").attachMatched(this._onRoute, this);      
	},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
_onRoute : function(e){
	debugger
	var tempjsonString = e.getParameter("arguments").entity;
	var jsonstring = tempjsonString.replace(/@/g, "/");
	var tempSelectedData = JSON.parse(jsonstring);
	 this.SelectedData  = JSON.parse(tempSelectedData);
	 var lvSelectedData =  this.SelectedData;
	 this.fnGetdata(lvSelectedData);
	 
	/*if(lvSelectedData.Status == ""){
		 	this.getView().byId("idAppr").setVisible(true);
		 	this.getView().byId("idRej").setVisible(true);
		 	
		 } else{
			 this.getView().byId("idAppr").setVisible(false);
			 this.getView().byId("idRej").setVisible(false);
			
		 }
     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
       pattern : "dd-MM-yyyy"
     });*/
     
    // var date = new Date(lvSelectedData.date);
     //Objnr = lvSelectedData.objNo;
     //Gjahr = lvSelectedData.varYear;
     //Pernr = lvSelectedData.empId;
     
     //this.getView().byId("idcrntDate").setText(oDateFormat.format(date));
	 //this.getView().byId("iddcid").setText(lvSelectedData.objNo);
	 
	 //this.bindEmployeeInfoDataSet(lvSelectedData);
	 //this.bindDiscountInfoDataSet(lvSelectedData);
},
/******************************************************************************************/
fnGetdata : function(lvSelectedData){
	debugger
	var oView = this.getView();
	var LineItemJModel = new sap.ui.model.json.JSONModel();
		oView.setModel(LineItemJModel, "LineItemJModel");
		LineItemJModel.setData(lvSelectedData.lv_index);
		
		var tblid =this.getView().byId("idtbl");
		var lngth=tblid.getItems().length;
		for(var i=0; i<lngth; i++){
			if(LineItemJModel.oData.results[i].Status=="A" || LineItemJModel.oData.results[i].Status=="R"){
				tblid.getItems()[i].getCells()[0].setEnabled(false);
			}else{
				tblid.getItems()[i].getCells()[0].setEnabled(true);
			}
		}
	
},

       /*var oDatePicker = this.getView().byId("idcrntdate");
       
       oDatePicker.addEventDelegate({ 

              onAfterRendering: function(){ 
              var oDateInner = this.$().find('.sapMInputBaseInner'); 
              var oID = oDateInner[0].id; 
              $('#'+oID).attr("disabled", "disabled"); 
              }},    oDatePicker); */
              
              /*this.onProductType();*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
       onBack: function(){
          	debugger
          	window.history.go(-1);
          },
       
       onReject:function(){
   		debugger
		mode = 'R';
   		var that = this;
		sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
			MessageBox.show(
				"Are you sure you want to reject?", {
					icon: MessageBox.Icon.INFORMATION,
					title: "Warning",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function(oAction){
						if(oAction === sap.m.MessageBox.Action.YES){
							if (!that._RemarkDialog) {
								that._RemarkDialog = sap.ui.xmlfragment(
										"zexposeapprove.view.Remarks", that);
									that.getView().addDependent(that._RemarkDialog);
									}
								that._RemarkDialog.open();
						}else{
							return false;
						}
					}
				}
			);
		});
       },
       
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
       
       onApprove:function(){
   		mode='A';
		var that = this;
		sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
			MessageBox.show(
				"Are you sure you want to approve?", {
					icon: MessageBox.Icon.INFORMATION,
					title: "Warning",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function(oAction){
						if(oAction === sap.m.MessageBox.Action.YES){
							if (!that._RemarkDialog) {
								that._RemarkDialog = sap.ui.xmlfragment(
										"zexposeapprove.view.Remarks", that);
									that.getView().addDependent(that._RemarkDialog);
									}
								that._RemarkDialog.open();
						}else{
							return false;
						}
					}
				}
			);
		});
       },
       
       
//////////////////////////////////////////////////////////////////////////////////////////////////
   	onRemarks : function(){
   		debugger
   		var that=this;   		
   	    that.onSave(mode);
   	},
       
       onSave:function(mode){
    	   	var that = this;
       var sServiceUrl = "/sap/opu/odata/sap/ZID_INTERNAL_DISCOUNT_SRV";
       var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
       oCreateModel1.setHeaders({"Content-Type": "application/atom+xml"});
       debugger
       
       //var Discount = this.getView().byId("idDiscount").getValue();
   	  // var remark = sap.ui.getCore().byId("idRemarks").getValue();
       
       
       debugger
       var dataPayLoad			={};
       
   	var fncSuccess = function(oData, oResponse) //sucess function 
	{
 
	if(oData.Error != "X"){
	 sap.m.MessageBox.show(oData.Message, {
            title: "Success",
            icon:sap.m.MessageBox.Icon.SUCCESS,
            onClose:function(){
            	debugger
            	/*window.history.back();*/
            	var selectedData = {};
            	var tempjsonString = JSON.stringify(selectedData);
            	var jsonstring = tempjsonString.replace(/\//g, "@");
            	var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            	oRouter.navTo("S1",{"entity":JSON.stringify(jsonstring)});
            	
            }
        });
		}
	else{
		 sap.m.MessageBox.show(oData.Message, {
	            title: "Error",
	            icon:sap.m.MessageBox.Icon.ERROR,
	            onClose:function(){
	            	debugger
	            	
	            	var selectedData = {};
	            	var tempjsonString = JSON.stringify(selectedData);
	            	var jsonstring = tempjsonString.replace(/\//g, "@");
	            	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	            	oRouter.navTo("S1",{"entity":JSON.stringify(jsonstring)});
	            }
	        });	
	}
	}

       var fncError = function(oError) { //error callback function
                     var parser = new DOMParser();
              var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
                     sap.m.MessageBox.show("Error ", {
            title: "Error",
            icon:sap.m.MessageBox.Icon.ERROR,
        });
       }

       oCreateModel1.create("/EmployeeRequestSet",dataPayLoad, {
              success: fncSuccess,
              error: fncError
       });
       
},

onPrint:function(){
	sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZID_INTERNAL_DISCOUNT_SRV/GetDiscountFormSet(Objnr='"+Objnr+"')/$value", true);
},

onSelectAll:function(evt){
	debugger
	var getSelected = evt.getSource().getSelected();
	var table = this.getView().byId("idtbl");
	var tblItems = table.getItems();
	var tbleLength = tblItems.length;
		for(var i = 0; i < tbleLength; i++){
			if(getSelected){
				table.getItems()[i].getCells()[0].setSelected(true);
			}else{
				table.getItems()[i].getCells()[0].setSelected(false);
			}
		}
		
},
		

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
 
})
});
