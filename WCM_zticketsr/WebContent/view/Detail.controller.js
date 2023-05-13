jQuery.sap.require("com.acute.ticketZSC.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ui.core.mvc.Controller");
var that=this;
sap.ui.core.mvc.Controller.extend("com.acute.ticketZSC.view.Detail",
{
 onInit : function() {
            that=this;
            this.onClosureReason();
            this.oView = this.getView();
            this.newBusy=new sap.m.BusyDialog();
            this.newModel=this.getOwnerComponent().getModel();
            var oPage=this.byId("detailPage");
            var fullscreenButton=this.byId("fullscreenButton");
            
             if (!jQuery.support.touch) {
                    this.getView().addStyleClass("sapUiSizeCompact");
                }
                this.oInitialLoadFinishedDeferred = jQuery.Deferred();
                if (sap.ui.Device.system.phone) {
                	this.byId("RadioSerID").setColumns(1);
                	
                	////
               	oPage.setShowNavButton(true);
               	fullscreenButton.setVisible(false);
//                   this.byId("btnCamera").setProperty("visible",true);	
                   
                  this.oInitialLoadFinishedDeferred.resolve();
                } else {
                	fullscreenButton.setVisible(true);
                	this.byId("RadioSerID").setColumns(5);
                	
                	
                	/////
                	oPage.setShowNavButton(false);
                //	 this.byId("btnCamera").setProperty("visible",false);		
                  var oEventBus = this.getEventBus();
                  oEventBus.subscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
                  oEventBus.subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
                }
                this.oModel=this.getOwnerComponent().getModel();
                this.getRouter().attachRouteMatched(this.onRouteMatched, this);
                this.onState();
          },
          onState:function(){
        	  this.newBusy.open();
  			//Method for setting the model for vehicle type
        	  var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'";
  	 		var jModel = new sap.ui.model.json.JSONModel();
  	 		jModel.loadData(sPath, null, false,"GET",false, false, null);
  	 		var  loc= this.getView().byId("idState");
  			loc.unbindAggregation("items");
  			//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
  			loc.setModel(jModel);
  			loc.bindAggregation("items", {
  				path : "/d/results",
  				template : new sap.ui.core.Item({
  					key : "{RegionCode}",
  					text : "{Region}"
  				})
  			});
  	 		
  			this.newBusy.close();
  		
  		},
          
  		onNavBack: function() {
                this.getRouter().myNavBack("main");
              },

          onMasterLoaded : function(sChannel, sEvent) {
            this.setBusy(false);
            this.oInitialLoadFinishedDeferred.resolve();
                },



          onMetadataFailed : function() {
            this.setBusy(false);
            this.oInitialLoadFinishedDeferred.resolve();
            this.showEmptyView();
                },
                
                
          getEventBus : function() {
            return sap.ui.getCore().getEventBus();
          },

          getRouter : function() {
            return sap.ui.core.UIComponent.getRouterFor(this);
          },
          
          
          onRouteMatched : function(oEvent)
          {
        	  that=this;
        	 
            if(oEvent.getParameter("name")==="Detail")
            {
//            	set selected Response feedback to JK Depot
            	this.getView().byId("RadioSerID").setSelectedIndex(0);
            	this.getView().byId("idDepotCodeLabel").setVisible(true);
    			this.getView().byId("idDepotCodeInput").setVisible(true);
    			this.getView().byId("idDepotCodeInput1").setVisible(true);
            	
            	var data=sap.ui.getCore().getModel("CustDtls");
            	var ticketNumber=oEvent.getParameters().arguments.contextPath;
            	if(data!=undefined){
            		this.newBusy.open();
            		that.getView().byId("SimpleFormToolbar1").setVisible(true);
            		that.getView().byId("SimpleFormToolbar2").setVisible(true);
            		that.getView().byId("SimpleFormToolbar3").setVisible(true);
            		that.getView().byId("RadioSerID").setVisible(true);
            		
            		//////
            		that.getView().byId("detailPage").setTitle("Ticket Number:- "+data.TicketNo);               
                 		 
            		var path="/GetTicketDataSet(ITicketNo='"+data.TicketNo+"')"
        			this.newModel.read(path, null , null , false, function(OData, oResponse) {
        		     debugger
        	     	 that.getView().byId("idPhone1").setValue(OData.CustomerTelf1);	
        	     	 that.getView().byId("idPhone2").setValue(OData.CustomerTelf2);	
            	     that.getView().byId("idFname").setValue(OData.CustomerFname);           			
        			 that.getView().byId("idLname").setValue(OData.CustomerLname);
        			 that.getView().byId("idAdd1").setValue(OData.CustomerAddr1);
           			 that.getView().byId("idAdd2").setValue(OData.CustomerAddr2);
           			 that.getView().byId("idDealer1").setValue(OData.DealerName);
           			 that.getView().byId("idState").setSelectedKey(OData.CustomerRegion);
           			 that.getView().byId("idLocation").setValue(OData.CustomerCity1);
          			 that.getView().byId("idDistrict").setValue(OData.CustomerCity2);        			 
           			 that.getView().byId("idEmail").setValue(OData.CustomerEmail);
           			 
           			 that.getView().byId("idFitType").setValue(OData.FitTypeDesc);
           			 that.getView().byId("idVehicleType").setValue(OData.VehicleType);
           			 that.getView().byId("idVehicleMake").setValue(OData.VehicleMake);
           			 that.getView().byId("idModel").setValue(OData.VehicleModel);
         			 
           			 
           			 that.newBusy.close();
            	    }, function(err) {
            	    	var errmsg = JSON.parse(err.response.body).error.message.value;
                        sap.m.MessageBox.show(errmsg, {
                            title: "Error",
                            icon:sap.m.MessageBox.Icon.ERROR
                        });
            	    });
        			
        			       			
        			var loModel = this.getView().getModel();
        			var sPath = "SEResponseSet(TicketNo='"+ticketNumber+"')";
        			loModel.read(sPath,null,null,false,function(oData,oResponse){
        				debugger;
        				that.getView().byId("idRem").setValue(oData.RespText);
        				that.getView().byId("RB3-1").setSelected(oData.JkDepot);
        				that.getView().byId("RB3-2").setSelected(oData.JkDealer);
        				that.getView().byId("RB3-3").setSelected(oData.SpotInsp);
        				that.getView().byId("RB3-4").setSelected(oData.NoResponse);
        				that.getView().byid("RB3-5").setSelected(oData.TicketClosed);        				
        			});
            	}
            	else{
            		that.getView().byId("SimpleFormToolbar1").setVisible(false);
            		that.getView().byId("SimpleFormToolbar2").setVisible(false);
            		that.getView().byId("SimpleFormToolbar3").setVisible(false);
            		that.getView().byId("RadioSerID").setVisible(false);
            		/////
            		this.getRouter().navTo("main");
            	}
            }
          },
                   
         
          onStateHelp: function() { 
 			 var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'";
 		 		var jModel = new sap.ui.model.json.JSONModel();
 		 		jModel.loadData(sPath, null, false,"GET",false, false, null);
     	    var _valueHelpSelectDialog = new sap.m.SelectDialog({
     	    	
     	        title: "State",
     	        items: {
     	            path: "/d/results",
     	            template: new sap.m.StandardListItem({
     	                title: "{Region}",
     	                customData: [new sap.ui.core.CustomData({
     	                    key: "Key",
     	                    value: "{RegionCode}"
     	                })],
     	               
     	            }),
     	        },
     	        
     	        liveChange: function(oEvent) {
     	            var sValue = oEvent.getParameter("value");
     	            var oFilter = new sap.ui.model.Filter("Region",sap.ui.model.FilterOperator.Contains,sValue);
     	            oEvent.getSource().getBinding("items").filter([oFilter]);
     	        },
     	        confirm: [this._handleClose, this],
     	        cancel: [this._handleClose, this]
     	    });
     	    _valueHelpSelectDialog.setModel(jModel);
     	    _valueHelpSelectDialog.open();
     	},
     	_handleClose: function(oEvent) {
     	    var oSelectedItem = oEvent.getParameter("selectedItem");
     	    if (oSelectedItem) {
     	        //this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
     	    	this.State = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
     	        this.getView().byId("idState").setValue(oSelectedItem.getTitle())
     	    }},          
      	
maxmin:function(e){
	  // min max the screen by showing and hising the master
    if (e.getSource().getPressed()) {
           var oSplit = e.getSource().getParent().getParent().getParent().getParent().getParent();
           oSplit.setMode(sap.m.SplitAppMode.HideMode);
           this.getView().byId("fullscreenButton").setIcon("sap-icon://exit-full-screen");
       } 
    else {
           var oSplit = e.getSource().getParent().getParent().getParent().getParent().getParent();
              oSplit.setMode(sap.m.SplitAppMode.ShowHideMode);
                 this.getView().byId("fullscreenButton").setIcon("sap-icon://full-screen");
                
       };
    
},

//radio button code sumit
	OnRadioSelect:function(evt){
		var dpCode = that.getView().byId("idDepotCodeInput");
		 var dcCode = that.getView().byId("idDealCodeInput");
		 var loc= that.getView().byId("idLocation1");
		 var apDt = that.getView().byId("DTP4");
		 var resComm = that.getView().byId("idRem");
		 var clRes = that.getView().byId("idClosureReason");
		 resComm.setValue("");
		 clRes.removeStyleClass("myStateError")
		dcCode.setValueState("None");
		loc.setValueState("None");
		dpCode.setValueState("None");
		apDt.setValueState("None");
		resComm.setValueState("None");
		
		var radio=evt.getParameter("selectedIndex"); 
		if(radio==0){
			this.getView().byId("idDepotCodeLabel").setVisible(true);
			this.getView().byId("idDepotCodeInput").setVisible(true);
			this.getView().byId("idDepotCodeInput1").setVisible(true);
			}else{
			this.getView().byId("idDepotCodeLabel").setVisible(false);
			this.getView().byId("idDepotCodeInput").setVisible(false);
			this.getView().byId("idDepotCodeInput1").setVisible(false);	
			}
			
		if(radio==1){
			this.getView().byId("idDealCodeLabel").setVisible(true);
			this.getView().byId("idDealCodeInput").setVisible(true);
			this.getView().byId("idDealerName").setVisible(true);
		//	this.getView().byId("dealercodeinput1").setVisible(true); 
			this.getView().byId("Locationlabel").setVisible(true);
			this.getView().byId("idLocation1").setVisible(true);
		}else{
			this.getView().byId("idDealCodeLabel").setVisible(false);
			this.getView().byId("idDealCodeInput").setVisible(false);
			this.getView().byId("idDealerName").setVisible(false);
		//	this.getView().byId("dealercodeinput1").setVisible(false);
			this.getView().byId("Locationlabel").setVisible(false);
			this.getView().byId("idLocation1").setVisible(false);
		}
		if(radio==2){
		   this.getView().byId("appDt").setVisible(true);
		   this.getView().byId("DTP4").setVisible(true).setDateValue(null);
		}else{
		   this.getView().byId("appDt").setVisible(false);
		   this.getView().byId("DTP4").setVisible(false).setDateValue(null);
		}

		if(radio==4){
		   this.getView().byId("ididClosureReasonLabel").setVisible(true);
		   this.getView().byId("idClosureReason").setVisible(true).setValue(null);
		}else{
		   this.getView().byId("ididClosureReasonLabel").setVisible(false);
		   this.getView().byId("idClosureReason").setVisible(false).setValue(null);
		}
			
	},


onSave:function(){
	this.checkRequired();
	if (!this.bValidationError) {
		debugger
	     that.getView().byId("idFname").getValue();
		 that.getView().byId("idLname").getValue();
		 that.getView().byId("idEmail").getValue();
		 that.getView().byId("idAdd1").getValue();
		 that.getView().byId("idAdd2").getValue();
		 that.getView().byId("idLocation").getValue();
		 that.getView().byId("idDistrict").getValue();
		 that.getView().byId("idDealCodeInput").getValue();
	/*	 that.getView().byId("idCode").getValue();*/
/*		 that.getView().byId("idPhone1").getValue();*/
//		 that.getView().byId("idPhone2").getValue();
	
		var TicketDetails=sap.ui.getCore().getModel("CustDtls");
		var depo=that.getView().byId("RadioSerID").getSelectedIndex();
		var appointDate=that.getView().byId("DTP4").getDateValue();
		var idDepot=that.getView().byId("idDepotCodeInput");
		var Remarks=that.getView().byId("idRem").getValue();
		
		this.newBusy.open();
		var data={};
			data.TicketNo=TicketDetails.TicketNo;
			data.RespDate=this.Date(null);
			data.ServEngg=sap.ushell.Container.getService("UserInfo").getId();
		    data.JkDepot=depo==0 ?true:false;
		    data.JkDealer=depo==1 ?true:false;
			data.SpotInsp=depo==2 ?true:false;
		    data.NoResponse=depo==3 ?true:false;
			data.TicketClosed=depo==4 ?true:false;
			data.AppointDate=this.Date(appointDate);
		    data.AppointTime=this.Time(appointDate);
		    data.RespText=Remarks;
		    data.DepotCode=that.getView().byId("idDepotCodeInput").getValue();
		    data.DealerCode=that.getView().byId("idDealCodeInput").getValue();
		    data.ClosureReason=that.getView().byId("idClosureReason").getSelectedKey();
		    
		    
		 this.newModel.create("/SEResponseSet", data,null,function(oData, oResponse) {
		 that.newBusy.close();
		 sap.m.MessageBox.show("Ticket saved successfully", {
		 title: "Success",
		 icon:sap.m.MessageBox.Icon.SUCCESS,
	     onClose:function(){
		 window.history.back();
	 }
	 });
	},
		function(oData, oResponse) {
			var obj = JSON.parse(oData.response.body);
			var msg = obj.error.message.value;
			sap.m.MessageBox.show( msg ,
			sap.m.MessageBox.Icon.ERROR,"Error");
	     });		
				
	}	
},
checkRequired: function () {
	//var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
	this.bValidationError = false;

	 
	 var type=that.getView().byId("RadioSerID").getSelectedIndex();
	 if(type==-1){
		 this.bValidationError = true; 
	 }

	 var dpCode = that.getView().byId("idDepotCodeInput");
	 var rc= that.getView().byId("idDepotCodeInput1");
	 var dcCode = that.getView().byId("idDealCodeInput");
	 var apDt = that.getView().byId("DTP4");
	 var resComm = that.getView().byId("idRem");
	 var idClosureReason = that.getView().byId("idClosureReason");
	 
	 
	 if(type== 0){
		 if(dpCode.getValue() == ""){
			 dpCode.setValueState("Error");
			 this.bValidationError = true;  
		 }else{
			 dpCode.setValueState("None");
			 this.bValidationError = false;
		 }
		 
	 }else if(type== 1){
		 if(dcCode.getValue() == ""){
			 dcCode.setValueState("Error");
			 this.bValidationError = true;  
		 }else{
			 dcCode.setValueState("None");
			 this.bValidationError = false;
		 }
		 
	 }
	 else if(type==2){
		 if(apDt.getDateValue()=== null){
			 apDt.setValueState("Error");
			 this.bValidationError = true;  
		 }else{
			 apDt.setValueState("None");
			 this.bValidationError = false;  
		 }
	 }
	 else if(type==4){
		 if(idClosureReason.getSelectedKey()== ""){
			 idClosureReason.addStyleClass("myStateError");
			 this.bValidationError = true;  
		 }else{
			 idClosureReason.removeStyleClass("myStateError");
			 this.bValidationError = false;  
		 }
	 }
	 if(resComm.getValue() ==""){
		 resComm.setValueState("Error");
		 this.bValidationError = true;  
	 }else{
		 resComm.setValueState("None");

	 }
	 
	 
		// output result
		if (!this.bValidationError) {
			/*MessageToast.show("The input is validated. You could now continue to the next screen");*/
		} else {
				sap.m.MessageBox.show("A validation error has occured. Complete your reuiqred input marked(*)", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					styleClass:"sapUiSizeCompact",
					actions: [sap.m.MessageBox.Action.CLOSE]
				});
		}
},
Date:function(Date1){

	if(Date1==null){
		Date1=new Date();
	}
	var month = Date1.getMonth() + 1;
	var date  = Date1.getDate();
	if (month.toString().length < 2) {
		month = "0" + month.toString();
	}
	if (date.toString().length < 2) {
		date = "0" + date.toString();
	}
	var formatDate = Date1.getFullYear()  + '-' + month + '-' + date + "T00:00:00";
	return formatDate;
	
},
Time:function(Date1){
	if(Date1==null){
		Date1=new Date();
	}
	var Hours = Date1.getHours();
	var Minit  = Date1.getMinutes();
	var Seconds  = Date1.getSeconds();
	if (Hours.toString().length < 2) {
		Hours = "0" + Hours.toString();
	}
	if (Minit.toString().length < 2) {
		Minit = "0" + Minit.toString();
	}
	if (Seconds.toString().length < 2) {
		Seconds = "0" + Seconds.toString();
	}
	var formatDate = "PT"+Hours+"H"+Minit+"M"+Seconds+"S";;
	return formatDate;	
},

/*//f4 for delar code 
		onDelarCodeType:function(){
			 var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpDealerSet";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false,"GET",false, false, null);
		var _valueHelpDealertDialog = new sap.m.SelectDialog({
			
		    title: "Dealer Code",
		    items: {
		        path: "/d/results",
		        template: new sap.m.StandardListItem({
		            title: "{name1}",
		            description : "{kunnr}",
		            customData: [new sap.ui.core.CustomData({
		                key: "Key",
		                value: "{kunnr}"
		            })],
		           
		        }),
		    },
		    liveChange: function(oEvent) {
		        var sValue = oEvent.getParameter("value");
		        var oFilter = new sap.ui.model.Filter("name1",sap.ui.model.FilterOperator.Contains,sValue);
		        var oFilter2 = new sap.ui.model.Filter("kunnr",sap.ui.model.FilterOperator.Contains,sValue);
		        
		        var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false AND);
		        oEvent.getSource().getBinding("items").filter([oFilter1]);
		    },
		    confirm: [this._handleDealerClose, this],
		    cancel: [this._handleDealerClose, this]
		});
		_valueHelpDealertDialog.setModel(jModel);
		_valueHelpDealertDialog.open();	
				},
				_handleDealerClose: function(oEvent) {
		   	    var oSelectedItem = oEvent.getParameter("selectedItem");
		   	    if (oSelectedItem) {
		   	    	debugger
			   	    this.Dealer = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		   	        this.getView().byId("idDealCodeInput").setValue(oSelectedItem.getDescrption());
		   	       this.getView().byId("idDealerName").setValue(oSelectedItem.getTitle());
		   	    this.getView().byId("idLocation1").setValue(oSelectedItem.getTitle());
		   	        
		   	    }
		     
		   	},*/
	
		//for Dealer
			onDelarCodeType:function(){
			debugger
			 var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpDealerSet";
			 var jModel = new sap.ui.model.json.JSONModel();
			 jModel.loadData(sPath, null, false,"GET",false, false, null);
			 var _valueHelpDealertDialog = new sap.m.SelectDialog({
		          title: "Dealer Code",
		          items: {
		          path: "/d/results",
		       template: new sap.m.StandardListItem({
		             title: "{name1}",
		             description : "{kunnr}",
		           
		           customData: [new sap.ui.core.CustomData({
		                key: "Key",
		                value: "{DealerLoc}",
		                	
		            })],	           
		         }),
		    },
		    liveChange: function(oEvent) {
		        var sValue = oEvent.getParameter("value");
		        var oFilter = new sap.ui.model.Filter("kunnr",sap.ui.model.FilterOperator.Contains,sValue);
		        var oFilter2 = new sap.ui.model.Filter("name1",sap.ui.model.FilterOperator.Contains,sValue);
		        var oFilter3 = new sap.ui.model.Filter("DealerLoc",sap.ui.model.FilterOperator.Contains,sValue);
		        var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2,oFilter3], false /*AND*/);
		        oEvent.getSource().getBinding("items").filter([oFilter1]); 
		    },
		        confirm: [this._handleDealerClose, this],
		        cancel: [this._handleDealerClose, this]
		});
		        _valueHelpDealertDialog.setModel(jModel);
		        _valueHelpDealertDialog.open();	
		},
		_handleDealerClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			debugger
			this.DealerCode = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			this.DlLocation = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		    this.getView().byId("idDealCodeInput").setValue(oSelectedItem.getDescription());
		    this.getView().byId("idDealerName").setValue(oSelectedItem.getTitle());
			//this.getView().byId("idLocation1").setValueState("None");
		    this.getView().byId("idLocation1").setValue(this.DlLocation);
	
		}
		},

//for Closure Reason
	onClosureReason : function(){
		
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/ClosureReasonSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET", false, false, null);
		var locvar = this.getView().byId("idClosureReason");
		locvar.unbindAggregation("items");
		locvar.setModel(jModel);
		locvar.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{Reason}",
				text : "{Desc}"
			})
		});
	},

//for Depot 
	onDepotCodeType:function(){
		debugger
		 var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpDepotCodeSet";
		 var jModel = new sap.ui.model.json.JSONModel();
		 jModel.loadData(sPath, null, false,"GET",false, false, null);
		 var _valueHelpDepotDialog = new sap.m.SelectDialog({
	          title: "Depot Code",
	          items: {
	          path: "/d/results",
	       template: new sap.m.StandardListItem({
	             title: "{Name}",
	             description : "{DepotCode}",
	           customData: [new sap.ui.core.CustomData({
	                key: "Key",
	                value: "{DepotCode}"
	            })],	           
	         }),
	    },
	    liveChange: function(oEvent) {
	        var sValue = oEvent.getParameter("value");
	        var oFilter = new sap.ui.model.Filter("DepotCode",sap.ui.model.FilterOperator.Contains,sValue);
	        var oFilter2 = new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,sValue);
	        var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
	        oEvent.getSource().getBinding("items").filter([oFilter1]);
	    },
	        confirm: [this._handleDepotClose, this],
	        cancel: [this._handleDepotClose, this]
	});
		 _valueHelpDepotDialog.setModel(jModel);
		 _valueHelpDepotDialog.open();	
},
  _handleDepotClose: function(oEvent) {
    var oSelectedItem = oEvent.getParameter("selectedItem");
   if (oSelectedItem) {
   	this.Dealer = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
       this.getView().byId("idDepotCodeInput").setValue(oSelectedItem.getDescription());
       this.getView().byId("idDepotCodeInput1").setValue(oSelectedItem.getTitle());
       this.getView().byId("idDepotCodeInput").setValueState("None");
   }
},
onResponseChange: function(e){
	e.getSource().setValueStateError("None");
},
handleApDtChange: function(oEvent){
	var DTP4 = this.getView().byId("DTP4");
	var temp = DTP4.getDateValue();
	 var tdate = new Date();
	 var tdt1 = tdate.setHours(0,0,0,0);
	 var tdt2 = temp.setHours(0,0,0,0);
	 if (tdt2 < tdt1){
		sap.m.MessageToast.show("Appointment Date can not be less than current date"); 
		p.setValue(""); 
		this.getView().byId("appDt").setValueState("Error");
		return
	 }
	 else {
		this.getView().byId("appDt").setValueState("None");
	  }
	
},
onCloseReasonChange: function(){
	this.getView().byId("idClosureReason").removeStyleClass("myStateError");
}
	
/****************************/
});