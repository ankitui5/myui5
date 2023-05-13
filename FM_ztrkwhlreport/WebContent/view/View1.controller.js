var that, RegNo, DataArticles, that, kunnr, twkunnr, twname, kunnrname, hubName, 
	TwcWheel, EnrolMode, hubCode, firstDay, currentdate, fromDate, toDate, dateVal, dateVal2;

sap.ui.define([
	"ztrkwhlreport/util/Formatter",
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"jquery.sap.global",
	"sap/ui/Device"
], function(Formatter, MessageBox, Controller, JSONModel) {
	"use strict";
	
sap.ui.controller("ztrkwhlreport.view.View1", {
			
	onInit: function() {
				this.newBusy = new sap.m.BusyDialog();

			// this.newBusy.open();
			this.model = this.getOwnerComponent().getModel();

			that = this;

			if (!jQuery.support.touch) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}
			if (sap.ui.Device.system.desktop) {

			}
			
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
	            pattern : "dd.MM.yyyy"
			});
			var date = new Date(), y = date.getFullYear(), m = date.getMonth();
			var firstDay = new Date(y, m, 1);
			
			var currentdate = new Date();
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
			this.fromDate = dateFormat.format(firstDay)+"T00:00:00";
			this.toDate = dateFormat.format(currentdate)+"T00:00:00";
			
			currentdate =  oDateFormat.format(currentdate);
			firstDay =  oDateFormat.format(firstDay);
			
			var initialDateValue = firstDay + " - " + currentdate;
			
			this.getView().byId("idSearchDate").setValue(initialDateValue);
			
			
			//this.onMechanicalCon();
			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(
					sServiceUrl);
			oReadModel.setHeaders({
				"Content-Type" : "application/json"
			});
			var fncSuccess = function(oData, oResponse){
				
				
				if(oData.results.length==0 ){
					sap.m.MessageBox.show("You are not registered to any fleet.", {
						title : "Error",
						icon : sap.m.MessageBox.Icon.ERROR,
						onClose:function(){
							window.history.back();
						}
						});	
				}else{
					that.FleetData=oData;
					
					var jModel;
					var headerText;
					if(that.FleetData.results.length == "1"){
						
						kunnr = that.FleetData.results[0].Kunnr;
						EnrolMode = that.FleetData.results[0].EnrolMode;
						headerText = that.getView().byId("HeaderIdTit").setText(that.FleetData.results[0].FleetName);
						kunnrname = that.FleetData.results[0].FleetName;
						var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_User_Fleet_HubSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'and CKunnr  eq '"+that.FleetData.results[0].Kunnr+"'";
						jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);					
						/*hubCode = jModel.getData().d.results[0].HubCode;*/
						
					}else{
						debugger
						if (!that._FleetDialog) {
							that._FleetDialog = sap.ui.xmlfragment(
									"ztrkwhlreport.view.Intial", that);
								that.getView().addDependent(that._FleetDialog);
								}
							that._FleetDialog.open();
					}
		
					}
			}
			
			var fncSuccess1 = function(oData, oResponse){
				
				//new sap.m.Select({selectedKey:"{RemoveOk}",change:[that.onAction,that],items:[new sap.ui.core.Item({text:"OK",key:"O"}),new sap.ui.core.Item({text:"Remove",key:"R"})],forceSelection:false}),
				that.nonjkSelect=new sap.m.Select({change:[that.onCompanyChange,that],forceSelection:false,visible:false,enabled:false});
				that.nonjkSelect1=new sap.m.Select({change:[that.onCompanyChange1,that],forceSelection:false ,visible:true});
				var jModel = new sap.ui.model.json.JSONModel(oData.results);
				
				
				that.nonjkSelect.unbindAggregation("items");
				that.nonjkSelect1.unbindAggregation("items");
				//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
				that.nonjkSelect.setModel(jModel);
				that.nonjkSelect1.setModel(jModel);
				that.nonjkSelect.bindAggregation("items", {
						path: "/",
						template: new sap.ui.core.Item({
							key: "{NonJkCompany}",
							text: "{Text}"
						})
					});
				that.nonjkSelect1.bindAggregation("items", {
					path: "/",
					template: new sap.ui.core.Item({
						key: "{NonJkCompany}",
						text: "{Text}"
					})
				});
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
			oReadModel.read("/User_Fleet_DetialsSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'", {
				success : fncSuccess,
				error : fncError
			});
			
			oReadModel.read("/F4_NonJK_Tyre_CompanySet", {
				success : fncSuccess1,
				error : fncError
			});
			//that.getView().byId("FFitmentDateEdit").setDateValue(new Date());
			
			
			
		},
//////////////////////////////////////////////////////////////////////////////////////////////////	
		onFleetCloseCancle:function(){
			window.history.back();
		},
		
		
		onFleetFragment:function(){
			var jModel = new sap.ui.model.json.JSONModel(that.FleetData);
			var _valueHelpFleetDialog = new sap.m.SelectDialog(
					{

						title : "Select Fleet",
						items : {
							path : "/results",
							template : new sap.m.StandardListItem(
									{
										title : "{FleetName}",
										customData : [ new sap.ui.core.CustomData(
												{
													key : "Key",
													value : "{Kunnr}"
												}) ],

									}),
						},
						liveChange : function(oEvent) {
							var sValue = oEvent
									.getParameter("value");

var oFilter = new sap.ui.model.Filter("FleetName",sap.ui.model.FilterOperator.Contains,sValue);

							oEvent.getSource().getBinding("items")
									.filter([ oFilter ]);
						},
						confirm : [ this._handleFleetClose, this ],
						cancel : [ this._handleFleetClose, this ]
					});
			_valueHelpFleetDialog.setModel(jModel);
			_valueHelpFleetDialog.open();
		},
		_handleFleetClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {

				sap.ui.getCore().byId("idFleet").setValue(oSelectedItem.getTitle());
				kunnrname = oSelectedItem.getTitle();
			 that.getView().byId("HeaderIdTit").setText(oSelectedItem.getTitle());
			 sap.ui.getCore().byId("idFleet").setName(oSelectedItem.getBindingContext().getObject().Kunnr);
			 kunnr = oSelectedItem.getBindingContext().getObject().Kunnr;
			}

		},
		
		onFleetOkButton:function(){
			debugger
			
			if(sap.ui.getCore().byId("idFleet").getValue()!=""){	
			that._FleetDialog.close();
			}else{
				sap.m.MessageBox.show("Select Fleet", {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
				} 
				 )
			}
		},
		
		onFleetCloseCancel:function(){
			window.history.back();
		},
		
		
	onClear : function(){
		this.getView().byId("idSearchDate").setValue("");
		this.getView().byId("idTruckWheel").setValue("");
		this.getView().byId("idSearchVehicle").setValue("");
		this.getView().byId("idSearchStatus").setSelectedKey();
	},
	
	handleDateChange: function(oEvent){
		debugger
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
		var from = oEvent.getSource().getProperty("dateValue");
		var to = oEvent.getSource().getProperty("secondDateValue");
		var dateVal = oEvent.getSource().getProperty("value");
		
		
		if(from !== null){
			this.fromDate = dateFormat.format(from)+"T00:00:00";
		}else{
			if(dateVal !== ""){
				var dateSplit = dateVal.split("-");
				var fromDate = dateSplit[0].trim();
				var fromSplit = fromDate.split(".");
				var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
				this.fromDate = fValue+"T00:00:00";
			}else{
				this.fromDate = null;
			}
			
		}
		if(to !== null){
			this.toDate = dateFormat.format(to)+"T00:00:00";
		}else{
			if(dateVal !== ""){
				var dateSplit = dateVal.split("-");
				var toDate = dateSplit[1].trim();
				var toSplit = toDate.split(".");
				var tValue = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
				this.toDate = tValue+"T00:00:00";
			}else{
				this.toDate = null;
			}	
		}
	},

	onSearch : function(){
		debugger
	
		var check = false;
		var that = this;
		/*var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });   
		var datefrm1 = this.getView().byId("idSearchDate").getFrom();
		var dateVal = dateFormat1.format(datefrm1)+"T00:00:00";
		var dateto2 = this.getView().byId("idSearchDate").getTo();
		var dateVal2 = dateFormat1.format(dateto2)+"T00:00:00";*/
	 
		var vartruck  = this.getView().byId("idTruckWheel").getValue(); 	
		var varVehiNo = this.getView().byId("idSearchVehicle").getValue();
		var varstatus = this.getView().byId("idSearchStatus").getSelectedKey();
		
		if (TwcWheel == undefined){
			TwcWheel= "";	
		}
		
/*	    if(dateVal =="T00:00:00"){
    	this.getView().byId("idSearchDate").setValueState("Error");
    	return false;
	    }

		 if(dateVal!=null){
			 var dateFrom = this.payLoadDate(dateVal);
				 if (dateFrom == "NaN-NaN-NaNT00:00:00"){
				 	dateFrom = "";
				 	}
			    }else{
			    	var dateFrom=null;
				}
	 			
		 if(dateVal2!=null){
			 var dateTo = this.payLoadDate(dateVal2);
				 	if (dateTo == "NaN-NaN-NaNT00:00:00"){
				 	dateFrom = "";
				 	}
			 	
			    }else{
			    	var dateTo=null;
				}*/

		if(this.fromDate == "" || this.fromDate == null){
			sap.m.MessageToast.show("Please select Date Range")
			return;	
		}
		
		if(this.fromDate !=null){
		    }else{
		    	this.fromDate=null;
			}	
	    
		 if(this.toDate!=null){
		    }else{
		    	this.toDate = null;
			}	
		
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
            pattern : "dd-MM-yyyy"
		});
		
		var oViewObj = this.getView();
		var that = this;
		var CartListSetJModel = oViewObj.getModel("CartListSetJModel");
		if (!CartListSetJModel) {
			CartListSetJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(CartListSetJModel, "CartListSetJModel");
		}
		
		var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({
			"Content-Type" : "application/json"
		});
		var fncSuccess = function(oData, oResponse) 									// success function
													
		{
			CartListSetJModel.setData(oData.results);
		}
		var fncError = function(oError) { 												// error handler
			jQuery.sap.log.error("Read Publishing Group Data Failed.");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		oReadModel.read("/ServiceRequestForFleetSet?$filter=Kunnr eq '"+kunnr+"' and TwKunnr eq '"+TwcWheel+"' and Datefrom eq datetime'"
				+this.fromDate+"' and Dateto eq datetime'"+this.toDate+"' and Status eq '"+varstatus+"' and RegNo eq '"+varVehiNo+"'",                                                                                            
				 {
			success : fncSuccess,
			error   : fncError
		});      
	},
	
	payLoadDate: function(SDateValue) {
		debugger
		var str = "T00:00:00";
		var currentTime = new Date(SDateValue);
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();
		var date = year + "-" + month + "-" + day + str;
		return date;
		},
	
	
//////////////////////////////////////////////////////////////////////////////////////////////////	
	
	onTruckWheelHelp : function(oEvt)
 	 {  
		var sPath  = "/sap/opu/odata/sap/ZFLEET_SRV/F4UserTruckWheelFleetSet?$filter=Kunnr eq '"+kunnr+"'";
	 	var jModel = new sap.ui.model.json.JSONModel();
	 	jModel.loadData(sPath, null, false,"GET",false, false, null);
	    var _valueHelpSelectDialog = new sap.m.SelectDialog({
	    	
	        title: "Truck Wheel",
	        items: {
	            path: "/d/results",
	            template: new sap.m.StandardListItem({
	                title: "{Name}",
	                Description  : "{TWKunnr}",
	                customData: [new sap.ui.core.CustomData({
	                    key  : "{TWKunnr}",
	                    value: "{Name}"
	                })],    	               
	            }),
	        },
	        liveChange: function(oEvent) {
	            var sValue  = oEvent.getParameter("value");
	            var oFilter = new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,sValue);
	            oEvent.getSource().getBinding("items").filter([oFilter]);
	        },
	        confirm: [this._handleCenterClose, this],
	        cancel : [this._handleCenterClose, this]
	    });
	    _valueHelpSelectDialog.setModel(jModel);
	    _valueHelpSelectDialog.open();
	},
	
	_handleCenterClose: function(oEvent) {
	    var oSelectedItem = oEvent.getParameter("selectedItem");
	    if (oSelectedItem) {
	    	debugger
	    	TwcWheel = oSelectedItem.getCustomData()[0].getKey();
	        this.getView().byId("idTruckWheel").setValue(oSelectedItem.getTitle());
	    }      
	},
	
//////////////////////////////////////////////////////////////////////////////////////////////////
	
	onVehicleHelp : function(oEvt) 
	 {  
		 debugger 
		 var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_VEHICLE_REG_NOSet?$filter=CType eq 'C' and CUname eq 'ABAPFBD1' and CKunnr eq '"+kunnr+"'";
		 var jModel = new sap.ui.model.json.JSONModel();
		 jModel.loadData(sPath, null, false,"GET",false, false, null);
		 var _valueHelpSelectDialog = new sap.m.SelectDialog({
	    	
	        title: "Vehicle",
	        items: {
	            path: "/d/results",
	            template: new sap.m.StandardListItem({
	                title: "{RegNo}",
	                customData: [new sap.ui.core.CustomData({
	                    key: "RegNo",
	                    value: "{RegNo}"
	                })],    	               
	            }),
	        },
	        liveChange: function(oEvent) {
	            var sValue = oEvent.getParameter("value");
	            var oFilter = new sap.ui.model.Filter("RegNo",sap.ui.model.FilterOperator.Contains,sValue);
	            oEvent.getSource().getBinding("items").filter([oFilter]);
	        },
	        confirm: [this._handleVehicleClose, this],
	        cancel: [this._handleVehicleClose, this]
	    });
	    _valueHelpSelectDialog.setModel(jModel);
	    _valueHelpSelectDialog.open();
	},
	
	_handleVehicleClose: function(oEvent) {
	    var oSelectedItem = oEvent.getParameter("selectedItem");
	    if (oSelectedItem) {
	        this.getView().byId("idSearchVehicle").setValue(oSelectedItem.getTitle());
	    }      
	},
	
//////////////////////////////////////////////////////////////////////////////////////////////////
			
	displayRequest : function(e){
		debugger
		var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
		var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
	
	
	    var selectedData={};
		selectedData.regno = data.RegNo;
		selectedData.kunnr = data.Kunnr;
		selectedData.kunnrName = kunnrname;
		selectedData.twkunnr = data.TwKunnr;
		selectedData.revNo = data.RevNo
		selectedData.srvNo = data.SeriveNo
		
		
		if (data.Status == 'A'){
			sap.m.MessageToast.show("Job Card is Approved")		
			return; 	
		}
		if (data.Status == 'C'){
			sap.m.MessageToast.show("Job Card is Completed")		
			return; 	
		}
		if (data.Status == 'R'){
			sap.m.MessageToast.show("Job Card is Rejected")		
			return; 	
		}
		if (data.Status == 'E'){
			sap.m.MessageToast.show("Job Card is Send for Modifications")		
			return; 	
		}
		if (data.Status == 'X'){
			sap.m.MessageToast.show("Job Card is Cancelled")		
			return; 	
		}
		
		var tempjsonString = JSON.stringify(selectedData);
		var jsonstring = tempjsonString.replace(/\//g, "@");
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("page2",{"entity":JSON.stringify(jsonstring)});

	},
	
	
//////////////////////////////////////////////////////////////////////////////////////////////////
	OnPrint : function(e){
	debugger
	var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
	var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];

	 var selectedData={};
		selectedData.regno = data.RegNo;
		selectedData.kunnr = data.Kunnr;
		selectedData.kunnrName = kunnrname;
		selectedData.twkunnr = data.TwKunnr;
		selectedData.revNo = data.RevNo
		selectedData.srvNo = data.SeriveNo
	
		sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFLEET_SRV/TruckWheelOutputFormSet(TWKunnr='"+selectedData.twkunnr+"',RevNo='"+selectedData.revNo+"',ServiceNo='"+selectedData.srvNo+"')/$value", true);
	
},	
	//ZSF_FM_INSPECTION_FLEET_TWC
/*****************************************************************************************************************/

});

});