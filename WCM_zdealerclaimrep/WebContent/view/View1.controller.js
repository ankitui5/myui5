sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
	//"zdealerclaimrep/util/Formatter"
	
	
], function(MessageBox,Fragment,Controller, JSONModel,MessageToast) {
	"use strict";
		var that
return sap.ui.controller("zdealerclaimrep.view.View1", {
	
				    onInit: function() {
				    	
					that= this;	
					if (!jQuery.support.touch){
				    this.getView().addStyleClass("sapUiSizeCompact");
				    var iOriginalBusyDelay,
					oViewJModel = new sap.ui.model.json.JSONModel({
						busy: false,
						delay: 0
					});
				this.getView().setModel(oViewJModel, "oViewJModel");	
						}
		
					/*var tableid = this.getView().byId("idTable");
					var ListSetJModel = tableid.getModel();
					
					if(!ListSetJModel){
						ListSetJModel = new sap.ui.model.json.JSONModel();
						//tableid.setModel(ListSetJModel).bindRows("/");
						tableid.setModel(ListSetJModel)
					}*/
					
	 
	},
	/*****************************/	
	
	
	
	//******************************
	/*payLoadDate: function(SDateValue) {
		debugger
		var str = "T00:00:00";
		var currentTime = new Date(SDateValue);
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();
		var date = year + "-" + month + "-" + day + str;
		return date;
		},*/	
	
	//number validation
	NumberValid : function(oEvent)
	{
		var val = oEvent.getSource().getValue();
		if(val){
			if(isNaN(val)){
				val = val.substring(0, val.length - 1);
				oEvent.getSource().setValue(val);
				
			}
		}
	},
	
	/*****************************/
	/***********Using f4 *****************/
					onTicketNoHelp : function(evt) 

					{
                   var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpTicketSet";
                   var jModel = new sap.ui.model.json.JSONModel();
                   jModel.loadData(sPath, null, false, "GET", false, false, null);
                   var _valueHelpticketnoSelectDialog = new sap.m.SelectDialog({
                   title : "Select Ticket",
                   items : 
                   {
                    path : "/d/results",
                    template : new sap.m.StandardListItem({
                    title : "{TicketNo}",
                    customData : [ new sap.ui.core.CustomData({
                     key : "{Key}",
                     value : "{TicketNo}"
                     }) ]
                     })
                   },
                   liveChange : function(oEvent) 
                   {
                         var sValue = oEvent.getParameter("value");
                         var oFilter = new sap.ui.model.Filter("TicketNo", sap.ui.model.FilterOperator.Contains, sValue);
                       /*  var oFilter2 = new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue);*/
                         var oFilter1 = new sap.ui.model.Filter([oFilter],false);
                         oEvent.getSource().getBinding("items").filter([oFilter1]);    
                   },                   
                   confirm : [ this._handleticketClose, this ],
                   cancel : [ this._handleticketClose, this ]
            });
                   _valueHelpticketnoSelectDialog.setModel(jModel);
                   _valueHelpticketnoSelectDialog.open();
     },
     				_handleticketClose : function(oEvent) 
     				{
     				var oSelectedItem = oEvent.getParameter("selectedItem");
     				if (oSelectedItem) 
     				{
                                      
                   this.getView().byId("inpTicketNo").setValue(oSelectedItem.getTitle());
                   this.ticket = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
                   this.ticketno = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
                  // this.onEnter();
            }
     },
     
							onStatus : function(evt) 
							{
					       var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TicketStatusSet";
					       var jModel = new sap.ui.model.json.JSONModel();
					       jModel.loadData(sPath, null, false, "GET", false, false, null);
					       var _valueHelpOnStatusSelectDialog = new sap.m.SelectDialog({
					       title : "Status",
					       items : 
					       {
					        path : "/d/results",
					        template : new sap.m.StandardListItem({
					        title : "{Description}",
					        customData : [ new sap.ui.core.CustomData({
					         key : "{Status}",
					         value : "{Description}"
					         }) ]
					         })
					       },
					       liveChange : function(oEvent) 
					       {
					             var sValue = oEvent.getParameter("value");
					             var oFilter = new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue);
					          //   var oFilter2 = new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue);
					             var oFilter1 = new sap.ui.model.Filter([oFilter],false);
					             oEvent.getSource().getBinding("items").filter([oFilter1]);    
					       },                   
					       confirm : [ this._handleStatusClose, this ],
					       cancel : [ this._handleStatusClose, this ]
					});
					       _valueHelpOnStatusSelectDialog.setModel(jModel);
					       _valueHelpOnStatusSelectDialog.open();
					},
								_handleStatusClose : function(oEvent) 
								{
								var oSelectedItem = oEvent.getParameter("selectedItem");
								if (oSelectedItem) 
								{
					                          
					       this.getView().byId("idStatus").setValue(oSelectedItem.getTitle());
					       this.tickets = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
					       this.ticketstatusKey = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
					      // this.onEnter();
					}
					},

					onServiceHelp : function(evt) 
					{
					var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/ListServiceEngineerSet";
					var jModel = new sap.ui.model.json.JSONModel();
					jModel.loadData(sPath, null, false, "GET", false, false, null);
					var _valueHelpOnServiceSelectDialog = new sap.m.SelectDialog({
					title : "Service Engineers",
					items : 
					{
					path : "/d/results",
					template : new sap.m.StandardListItem({
					title : "{SeName}",
					customData : [ new sap.ui.core.CustomData({
					 key : "{ServEngg}",
					 value : "{SeName}"
					 }) ]
					 })
					},
					liveChange : function(oEvent) 
					{
					     var sValue = oEvent.getParameter("value");
					     var oFilter = new sap.ui.model.Filter("SeName", sap.ui.model.FilterOperator.Contains, sValue);
					  //   var oFilter2 = new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue);
					     var oFilter1 = new sap.ui.model.Filter([oFilter],false);
					     oEvent.getSource().getBinding("items").filter([oFilter1]);    
					},                   
					confirm : [ this._handleServiceClose, this ],
					cancel : [ this._handleServiceClose, this ]
					});
					_valueHelpOnServiceSelectDialog.setModel(jModel);
					_valueHelpOnServiceSelectDialog.open();
					},

					_handleServiceClose : function(oEvent) 
					{
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) 
					{
				                          
				       this.getView().byId("idSE").setValue(oSelectedItem.getTitle());
				       this.SrEnggValue = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
				       this.SrEnggKey = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
				       
		}
		},
		
		onClaimF4 : function() {
			
			var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimSet";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false,
					false, null);
			var _valueHelpClaimSelectDialog = new sap.m.SelectDialog(
					{
						title : "Select Claim No",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem(
									{
										title : "{IClaimNo}",
										customData : [ new sap.ui.core.CustomData(
												{
													key : "Key",
													value : "{IClaimNo}"
												}) ],
									}),
						},
			liveChange : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("IClaimNo",sap.ui.model.FilterOperator.Contains,sValue);
				oEvent.getSource().getBinding("items").filter([ oFilter ]);
			},
				
			confirm : [ this._handleClaimClose, this ],
			cancel : [ this._handleClaimClose, this ]
			});
			
			_valueHelpClaimSelectDialog.setModel(jModel);
			_valueHelpClaimSelectDialog.open();
			},
			
			_handleClaimClose : function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
			        if (oSelectedItem) {
			        	this.ClaimValue = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
					    this.ClaimKey = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
				        this.getView().byId("idClaimno").setValue(oSelectedItem.getTitle());
				        //this.getView().byId("idEdit").setVisible(true);
				        //this.onEnter();
			         }
             },
	
     //for busy inicator
             hideBusyIndicator : function() {
                 sap.ui.core.BusyIndicator.hide();
          },
          
          showBusyIndicator : function (iDuration, iDelay) {
                 sap.ui.core.BusyIndicator.show(iDelay);

                 if (iDuration && iDuration > 0) {
                        if (this._sTimeoutId) {
                              jQuery.sap.clearDelayedCall(this._sTimeoutId);
                              this._sTimeoutId = null;
                        }

                        this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function() {
                              this.hideBusyIndicator();
                        });
                 }
          },
        
             
    /************End F4****************/
	onSearch : function() {                                              
		debugger
		
		var check = false;
		var that = this;
		
		var custtelfno = this.getView().byId("idCustomerno").getValue();
		//var dateVal = this.getView().byId("idDateRange").getValue();
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });   
		var datefrm1 = this.getView().byId("idDateRange").getFrom();
		var dateVal = dateFormat1.format(datefrm1)+"T00:00:00";
		var dateto2 = this.getView().byId("idDateRange").getTo();
		var dateVal2 = dateFormat1.format(dateto2)+"T00:00:00";
			
		if(dateVal == "T00:00:00"){
			dateVal = ""
		} else {
			dateVal;
		}

		if(dateVal2 == "T00:00:00"){
			dateVal2 = ""
		} else {
			dateVal2;
		}
		
		var varticket; 
		 if(this.ticket){
		   varticket = this.ticket;
		 }else{
		  varticket = "";
		}  
			             
		 var senginer;
		 if(this.SrEnggKey){
		    senginer = this.SrEnggKey;
		}else{
		   senginer = "";
		} 
			
		var ClaimNumber; 
		 if(this.ClaimValue){
			 ClaimNumber = this.ClaimValue;
		 } else {
			 ClaimNumber = "";
		 }
		 
		var TStatus;
		if(this.ticketstatusKey){
		   TStatus = this.ticketstatusKey;
		}else{
		   TStatus = "";
		} 
			             
	    var tableid = this.getView().byId("idTable");      
		 var ListSetJModel = tableid.getModel();         
		 
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
				}
		    
		 /*var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		        pattern : "dd-MM-yyyy"
			});
			
			var dateVal = VarPlnDate.split("-");
			var fromDate = dateSplit[0].trim();
			var fromSplit = fromDate.split(".");
			var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
			var dateFrom = fValue+"T00:00:00";
			
			var toDate = dateSplit[1].trim();
			var toSplit = toDate.split(".");
			var tValue = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
			var dateTo = tValue+"T00:00:00";*/
	       
	       if(ClaimNumber == "" && dateVal == "" && varticket == "" && custtelfno == "" && senginer == "" && TStatus == ""){
	    	   sap.m.MessageBox.alert(
	    			   "Enter atleast one field.", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
						}
					);
	    	   return false;
	       }else{
	    	   var oViewObj = this.getView();
				var oViewJModel = oViewObj.getModel("oViewJModel");
				oViewJModel.setProperty("/delay", 0);
				oViewJModel.setProperty("/busy", true);
				oViewJModel.refresh(true);
	       }
	       
	       var oView = this.getView();
			var ListSetJModel = oView.getModel("ListSetJModel");
			if (!ListSetJModel) {
				ListSetJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(ListSetJModel, "ListSetJModel");
			}
	       
	       
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_WCM_SRV/";
	    var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			 oReadModel.setHeaders({"Content-Type" : "application/json"});
			                           
		var fncSuccess = function(oData, oResponse){
			
			var oViewObj = that.getView();
			var oViewJModel = oViewObj.getModel("oViewJModel");
			oViewJModel.setProperty("/delay", 0);
			oViewJModel.setProperty("/busy", false);
			oViewJModel.refresh(true);
			//var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd/MM/yyyy" });   
			
			   ListSetJModel.setData(oData.results);

			 }
			                           
		 var fncError = function(oError) { // error callback
			 var oViewObj = that.getView();
				var oViewJModel = oViewObj.getModel("oViewJModel");
				oViewJModel.setProperty("/delay", 0);
				oViewJModel.setProperty("/busy", false);
				oViewJModel.refresh(true);
			        
		 }
			                    
		 //var path = "/WCMReportSet?$filter=TicketNo eq '"+varticket+"' and ServEngg eq '"+senginer+"' and TicketStatus eq '"+TStatus+"'" ;
		if(dateFrom){
			var path = "WCMReportSet?$filter=ClaimNo eq '"+ClaimNumber
 			+"' and DateFrom eq datetime'"+dateFrom
 			+"' and DateTo eq datetime'"+dateTo
 			+"' and TicketNo eq '"+varticket
 			+"' and CustomerTelf1 eq '"+custtelfno
 			+"' and ServEngg eq '"+senginer
 			+"' and TicketStatus eq '"+TStatus+"'";
			
		}else{
			var path = "WCMReportSet?$filter=ClaimNo eq '"+ClaimNumber
 			+"' and DateFrom eq "+null
 			+" and DateTo eq "+null
 			+" and TicketNo eq '"+varticket
 			+"' and CustomerTelf1 eq '"+custtelfno
 			+"' and ServEngg eq '"+senginer
 			+"' and TicketStatus eq '"+TStatus+"'";
		}
		 
		
		 
		 oReadModel.read(path, {
			  success : fncSuccess,
			   error : fncError
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
	
	
	
	
	
	displayTicket : function(evt){
		
		var path = evt.getSource().getBindingContext("ListSetJModel").getPath().split('/')[1]
		var data = evt.getSource().getBindingContext("ListSetJModel").getModel().getData()[path];
		var VarTicketNo  = data.TicketNo;
		//this.onEnter();
		var selectedData={};
		selectedData.VarTicketNo = VarTicketNo;
		var tempjsonString = JSON.stringify(selectedData);
		var jsonstring = tempjsonString.replace(/\//g, "@");
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("View2",{"entity":JSON.stringify(jsonstring)});
	},
	
	displayClaim :function(evt){
		
		var path = evt.getSource().getBindingContext("ListSetJModel").getPath().split('/')[1]
		var data = evt.getSource().getBindingContext("ListSetJModel").getModel().getData()[path];
		var VarClaimNo  = data.ClaimNo;
		var selectedData={};
		selectedData.VarClaimNo = VarClaimNo;
		var tempjsonString = JSON.stringify(selectedData);
		var jsonstring = tempjsonString.replace(/\//g, "@");
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("ClaimView",{"entity":JSON.stringify(jsonstring)});
	},
	
	displayInspection :function(evt){
		
		var path = evt.getSource().getBindingContext("ListSetJModel").getPath().split('/')[1]
		var data = evt.getSource().getBindingContext("ListSetJModel").getModel().getData()[path];
		var VarInspNo  = data.InspNo;
		var selectedData={};
		selectedData.VarInspNo = VarInspNo;
		var tempjsonString = JSON.stringify(selectedData);
		var jsonstring = tempjsonString.replace(/\//g, "@");
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("Inspection",{"entity":JSON.stringify(jsonstring)});
	},
					

					
	 onClear : function()
	  {
		  
		  var tableid = this.getView().byId("idTable");
			var ListSetJModel = tableid.getModel("ListSetJModel");
			ListSetJModel.setData([]);
			ListSetJModel.refresh();
		    this.ticket = "";
	        this.getView().byId("inpTicketNo").setValue("");
	        this.getView().byId("idCustomerno").setValue("");
	        this.SrEnggKey = "";
	        this.getView().byId("idSE").setValue("");
	        this.ticketstatusKey = "";
	        this.getView().byId("idStatus").setValue("");
	        this.ClaimValue = "";
	        this.getView().byId("idClaimno").setValue("");
	        this.getView().byId("idDateRange").setValue("");
	        sap.m.MessageToast.show("Data Removed");
	   },
						/****************************/			
	
})


});