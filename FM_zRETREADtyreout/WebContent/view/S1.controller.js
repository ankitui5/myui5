jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("zretreadtyreout.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.Dialog");

sap.ui.define([ 
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
	],
function(JSONModel,MessageBox) {
"use strict";

var that, initialFlag, kunnr, RetreadTyreOutJModel;

sap.ui.core.mvc.Controller.extend("zretreadtyreout.view.S1",{
onInit : function() {
	debugger
		that = this;
		initialFlag = true;
		this.newBusy = new sap.m.BusyDialog();
		// this.newBusy.open();
		this.model = this.getOwnerComponent().getModel();
		that = this;
		
		var oView = this.getView();
		
		var today = new Date();
		this.getView().byId("idTime").setText(today.toDateString());
		
		RetreadTyreOutJModel = new sap.ui.model.json.JSONModel();
		this.getView().byId("idRetreadTyreOut1").setModel(RetreadTyreOutJModel, "RetreadTyreOutJModel");
		
		var obj={
				busy:false,
				delay:0
				};
		var oPageModel=new sap.ui.model.json.JSONModel(obj);
		this.getView().setModel(oPageModel,"oPageModel");
		this.getFleetData();
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onAfterRendering : function(){
	debugger
	if(initialFlag){
			if (!this._Dialog) {
				this._Dialog = sap.ui.xmlfragment(
				"zretreadtyreout.view.Initial", this);
				this.getView().addDependent(this._Dialog);}
			this._Dialog.open();
	}			
		
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onCancleBtn : function() {
	debugger
	window.history.back();
},
//////////////////////////////////////////////////////////////////////////////////////////////////	
onSelect:function(oEvt){
	debugger
	var selected = oEvt.getSource().getSelected();
	var tbl = this.getView().byId("idRetreadTyreOut1");
	var lngth = tbl.getItems().length;
	for(var i=0; i<lngth; i++){
		if(selected){
			tbl.getItems()[i].getCells()[0].setSelected(true);
		}else{
			tbl.getItems()[i].getCells()[0].setSelected(false);
		}
		
	}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
getFleetData:function(){
	debugger
	var oPageModel=this.getView().getModel("oPageModel");
	oPageModel.setProperty("/busy",true);
	var sServicePath = "/sap/opu/odata/sap/ZFLEET_SRV/"; 
	var sPathSet = "/User_Fleet_DetialsSet?$filter=CUname eq '"+ sap.ushell.Container.getService("UserInfo").getId() + "'";
	var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServicePath);
	var oParamsCartListSet = {};
		oParamsCartListSet.success = function(oData, oResponse) { // success handler
			debugger
			oPageModel.setProperty("/busy",false);
			oPageModel.setProperty("/F4FleetData",oData.results);
		};
		oParamsCartListSet.error = function(oError) { // error handler
		};
		frameworkODataModel.read(sPathSet, oParamsCartListSet);
},

onFleetFragment:function(oEvent){
	debugger
	this.oVal=oEvent.getSource();
	this._FleetHelpDialog = sap.ui.xmlfragment("zretreadtyreout.view.FleetDialog", this);
	this.getView().addDependent(this._FleetHelpDialog);
	var abc = this._FleetHelpDialog.open();
},

_handleFleetF4Confirm:function(oEvent){
	debugger
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		this.oVal.setValue(oSelectedItem.getTitle());
		this.fromKunnr = oSelectedItem.getBindingContext("oPageModel").getProperty().Kunnr;
		sap.ui.getCore().byId("idHub").setEnabled(true);
		sap.ui.getCore().byId("idHub").setValue();
	}
},

_handleValueHelpFleetSearch:function(oEvent){
	debugger
	var sValue = oEvent.getParameter("value");
	var oFilter = new sap.ui.model.Filter("FleetName", sap.ui.model.FilterOperator.Contains, sValue);
	var oFilter3 = new sap.ui.model.Filter([oFilter],false)
	oEvent.getSource().getBinding("items").filter([oFilter3]);
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onClickHub : function() {
	debugger
	var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_User_Fleet_HubSet?$filter=CUname eq '"
				+sap.ushell.Container.getService("UserInfo").getId()+ "'and CKunnr eq '"+this.fromKunnr+"'";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false,false, null);
	if (jModel.getData().d.results.length) {
		var _valueHelpHubelectDialog = new sap.m.SelectDialog(
				{
					title : "Select Hub",
					 items : {
	                      path : "/d/results",
	                      template : new sap.m.StandardListItem(
	                          {
	                            title : "{HubName}",
	                            customData : [ new sap.ui.core.CustomData(
	                                {
	                                  key : "Key",
	                                  value : "{HubName}"
	                                }) ],

	                          }),
	                    },
					liveChange : function(oEvent) {
						var sValue = oEvent.getParameter("value");

						var oFilter = new sap.ui.model.Filter("HubName",sap.ui.model.FilterOperator.Contains,sValue);
						oEvent.getSource().getBinding("items").filter([ oFilter ]);
					},
					confirm : [ this._handleHubClose, this ],
					cancel : [ this._handleHubClose, this ]
				});
		_valueHelpHubelectDialog.setModel(jModel);
		_valueHelpHubelectDialog.open();
	} else {
		sap.m.MessageToast.show("You are not authorised for any Hub in Fleet "+ sap.ui.getCore().byId("idFleet").getValue());
	}
},

_handleHubClose : function(oEvent) {
	debugger
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		sap.ui.getCore().byId("idHub").setValue(oSelectedItem.getTitle());
		this.hubCode = oSelectedItem.getBindingContext().getObject().HubCode;
	}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onDealer: function(){
	debugger
	var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/CasingDealerSet?$filter=App eq '' and HubCode eq ''";
	 var jModel = new sap.ui.model.json.JSONModel();
	      jModel.loadData(sPath, null, false,"GET",false, false, null);
	  var _valueHelpDealerSelectDialog = new sap.m.SelectDialog({
				title : "Select Dealer",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
						title : "{Dealer}",
						description: "{Name}",
						customData : [ new sap.ui.core.CustomData({
							key : "{Dealer}",
							value : "{Name}"
						})],
					}),
				},
		liveChange : function(oEvent) {
			debugger
			 var sValue = oEvent.getParameter("value");
		     var oFilter = new sap.ui.model.Filter("Dealer",sap.ui.model.FilterOperator.Contains,sValue);
		     var oFilter1 = new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,sValue);
		     var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
				 oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
		},
		
			confirm : [ this._handleDealerClose, this ],
			cancel : [ this._handleDealerClose, this ]
		});
	  
	  	_valueHelpDealerSelectDialog.setModel(jModel);
	  	_valueHelpDealerSelectDialog.open();
	},
	_handleDealerClose : function(oEvent) {
		debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			this.getView().byId("idDealer").setValue(oSelectedItem.getBindingContext().getObject().Dealer);
			this.getView().byId("idDealerName").setText(oSelectedItem.getBindingContext().getObject().Name);
			this.Dealer= oSelectedItem.getBindingContext().getObject().Dealer;
			this.getView().byId("idDealer").setValueState("None");
			
				this.getView().byId("addressToolbar").setVisible(true);
				this.getView().byId("idPhone1").setText(oSelectedItem.getBindingContext().getObject().Tele);
				this.getView().byId("idAddress1").setText(oSelectedItem.getBindingContext().getObject().Add1);

		}
	},

//////////////////////////////////////////////////////////////////////////////////////////////////
onOKButton : function(){
	debugger
	this.newBusy.open();
	var that = this;
	var fleet = sap.ui.getCore().byId("idFleet").getValue();
	var hub = sap.ui.getCore().byId("idHub").getValue();
	
	if( fleet == "" || fleet == undefined || hub == "" || hub == undefined){
		sap.m.MessageToast.show("Please select a Fleet and Hub.");
		return false;
	}
	
	var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
	var sPath = "CasingRetraidHeadSet(HubCode='"+this.hubCode+"')?$expand=CasingHeadItemNvg";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({"Content-Type" : "application/json"});
	
	var fnSuccess = function(oData, oResponse){
		that.newBusy.close();
		if(oData.CasingHeadItemNvg.results.length == 0){
			MessageBox.warning("No Tyres for Casing Out.", {
				actions: [MessageBox.Action.OK],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					
					var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
					oCrossAppNavigator.toExternal({
							target: { semanticObject : "#"}
					});

				}
			});
		}
		
		RetreadTyreOutJModel.setData(oData.CasingHeadItemNvg.results);
		
	}
	var fncError = function(){
		that.newBusy.close();
	}
		oReadModel.read(sPath,{
			success:fnSuccess,
			error:fncError
		})
	
	this.getView().byId("idPage").setTitle(""+fleet+" ("+hub+")");
	this._Dialog.close();
},

//////////////////////////////////////////////////////////////////////////////////////////////////
onHome:function(){
		this.openDialog("cancel");
	},

openDialog : function(status) {
	debugger
    var labelMessage;
    if (status == 'cancel') {
      labelMessage = 'Are you sure you want to go back?';
    }

    var _that = this;
    var dialog = new sap.m.Dialog({
      title : 'Confirmation Dialog',
      type : 'Message',
      content : [ new sap.m.Label({
        text : labelMessage,
        labelFor : 'submitDialogTextarea'
      }) ],
      beginButton : new sap.m.Button({
        text : 'Yes',
        press : function() {
         if (status == 'cancel') {
            //window.history.back()
        	 var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
        	 oCrossAppNavigator.toExternal({
        	                       target: { semanticObject : "#"}
        	                      });
          }
          dialog.close();
        }
      }),
      endButton : new sap.m.Button({
        text : 'No',
        press : function() {
          dialog.close();
        }
      }),
      afterClose : function() {
        dialog.destroy();
      }
    });

    dialog.open();
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onSubmit: function (){
	debugger
	this.newBusy.open();
	
	this.getView().byId("idDealer").setValueState("None");
	if( this.getView().byId("idDealer").getValue() == "" || this.getView().byId("idDealer").getValue() == undefined ){
		sap.m.MessageToast.show("Please select a Dealer.");
		this.getView().byId("idDealer").setValueState("Error");
		this.newBusy.close();
		return false;
	}

	var Dealer = this.Dealer;
	var oTable = this.getView().byId("idRetreadTyreOut1");
	var oItems = oTable.getItems();
	var tblLength = oItems.length;
	var ModelData = RetreadTyreOutJModel.getData();
	var counter = 0;

	var Data = {};
	Data.Dealer  = this.Dealer;
	//Data.Kunnr   = this.fromKunnr;
	Data.HubCode = this.hubCode;
	Data.CasingHeadItemNvg = [];

	for (var i = 0; i < tblLength; i++) {
		if( oItems[i].getCells()[0].getSelected() == true){
			counter = 1;
			delete ModelData[i].__metadata;
			ModelData[i].Select = 'X';
			Data.CasingHeadItemNvg.push(ModelData[i]);
		}
		
	}

	if(counter == 0){
		sap.m.MessageToast.show("Please select atleast one item for dispatch.");
		this.newBusy.close();
		return false;
	}

	var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
	var sPath = "CasingRetraidHeadSet";
	var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oCreateModel1.setHeaders({
		"Content-Type": "application/atom+xml"
		});
	var fncSuccess = function(oData, oResponse) //success function 
		{
		that.newBusy.close();
		if(oData.EError=="true"){
			sap.m.MessageBox.show(oData.EMessage, {
		        title: "Error",
		        icon:sap.m.MessageBox.Icon.ERROR,
		        onClose:function(){
		        }
		    });
		}else{
			sap.m.MessageBox.show("Document " +oData.Mblnr+ " posted successfully.", {
				title: "Success",
				icon:sap.m.MessageBox.Icon.SUCCESS,
				onClose:function(){
					//window.history.back();
					var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
					oCrossAppNavigator.toExternal({
					                      target: { semanticObject : "#"}
					                     });
				}
			});
			}
		}
	var fncError = function(oError) {
		that.newBusy.close();
		var parser = new DOMParser();
		sap.m.MessageBox.show(parser, {
	        title: "Error",
	        icon:sap.m.MessageBox.Icon.ERROR,
	    });
	}
	//Create Method for final Save
	oCreateModel1.create(sPath, Data, {
		success: fncSuccess,
		error: fncError
	});
},

//////////////////////////////////////////////////////////////////////////////////////////////////
});
});



