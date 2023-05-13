jQuery.sap.require("com.acute.ticketZSC.util.Formatter");
jQuery.sap.require("sap.ui.core.mvc.Controller");

sap.ui.core.mvc.Controller.extend("com.acute.ticketZSC.view.Master",
        {

          onInit : function() {
        	  master=this;
              var oList=this.getView().byId("lstDetails");      
              this.newBusy=new sap.m.BusyDialog();
             
              oModel = this.getOwnerComponent().getModel();
              if (!jQuery.support.touch) {
                this.getView().addStyleClass("sapUiSizeCompact");
              }
              if (sap.ui.Device.system.phone) {
                oList.removeSelections();
              }
              this.oInitialLoadFinishedDeferred = jQuery.Deferred();
             this.bindList();
              //this.getOwnerComponent().getEventBus().subscribe("com.acute.ticketZSC", "PRMasterRefresh", this._handleActionCallBack, this);
              this.getRouter().attachRouteMatched(this.onRouteMatched, this);
              var bReplace = jQuery.device.is.phone ? false : true;
//              this.getRouter().navTo("Detail", {
//                  from: "master",
//                  contextPath :"124",
//                }, bReplace);
          },

          onBeforeRendering:function()
          {
        	 
          },

          _handleActionCallBack: function(channelId, eventId, data) {
        	    if (eventId === "PRMasterRefresh") {
        	      this.bindList();
        	    }
        	  },
        	  
         
bindList:function()
        {
	debugger
	//this.getView().byId("RstFilt").setEnabled(false);
	master.reqdata=''
          var oList=this.byId("lstDetails");
          var oModel=this.getOwnerComponent().getModel();
         
          
          var path="/SETicketAssignedSet?$filter=TicketNo eq '' and ServEngg eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
          oModel.read(path, null , null , false, function(OData, oResponse) {
        	 
    	    	master.reqdata = OData.results;
    	    	var tempModel = new sap.ui.model.json.JSONModel({ "ManagerMasterSet" :  master.reqdata});
    			var oTemp = new sap.m.ObjectListItem({
    				type:"{device>/listItemType}" ,
    				title:"{TicketNo}",   
//    				numberUnit:"", 
//    				numberState:"Success",
    				attributes:[
    				            
    				            //new sap.m.ObjectAttribute({text:"Ticket No:"+" {TicketNo}"}),
    				            new sap.m.ObjectAttribute({text:"Customer Name:"+" {CustomerFname}"}),
    				            new sap.m.ObjectAttribute({text:"Ticket Date:"+"{path:'TicketDate',formatter:'com.acute.ticketZSC.util.Formatter.date'}",}),
    				            new sap.m.ObjectAttribute({text:"City:"+"{CustomerCity1}",})
    				            
    				            // new sap.m.ObjectAttribute({text:"Customer lname:"+"{CustomerLname}",}),
    				            
    				            ]
    			});
    			oList.unbindAggregation("items");
    			oList.setModel(tempModel);
    			tempModel.setSizeLimit(tempModel.oData.ManagerMasterSet.length);
    			oList.bindAggregation("items", "/ManagerMasterSet", oTemp);
          
          },function(err) {
  	    	var errmsg = JSON.parse(err.response.body).error.message.value;
            sap.m.MessageBox.show(errmsg, {
                title: "Error",
                icon:sap.m.MessageBox.Icon.ERROR
            });
	    });
          
          
        },

          getEventBus : function() {
            return sap.ui.getCore().getEventBus();
          },


          getRouter : function() {
            return sap.ui.core.UIComponent.getRouterFor(this);
          },

          onRouteMatched : function(oEvent)
          {
        	 
            var sName = oEvent.getParameter("name");
            if (sName !== "main") {
              if(sap.ui.Device.system.phone)
              {
                this.byId("lstDetails").removeSelections();
              }
            return;
          }
//          this.loadDetailView();
//          this.waitForInitialListLoading(function() {
//
//          });
          },


          loadDetailView : function() {
            this.getRouter().myNavToWithoutHash(
                    {
                      currentView : this.getView(),
                      targetViewName : "com.acute.ticketZSC.view.Detail",
                      targetViewType : "XML"
                    });
          },

          waitForInitialListLoading : function(fnToExecute) {
            jQuery.when(this.oInitialLoadFinishedDeferred).then(
                jQuery.proxy(fnToExecute, this));
          },


          onNotFound : function() {
            this.getView().byId("lstDetails").removeSelections();
          },

          onDetailTabChanged : function(sChanel, sEvent, oData) {
            this.sTab = oData.sTabKey;
          },



          onListUpdated : function(oEvent) {
        	  var oList = this.getView().byId("lstDetails");
        	  var Carrid= oList.getItems()[0].getTitle();
        	  var bReplace = jQuery.device.is.phone ? false : true;
              var data=oList.oModels.undefined.oData.ManagerMasterSet[0];
              sap.ui.getCore().setModel(data,"CustDtls");
              var oCarrid = parseFloat(Carrid);
              this.getRouter().navTo("Detail", {
                  from: "main",
                  contextPath :Carrid,
                }, bReplace);
            
            var oPage = this.getView().byId("masterPage");
            oPage.setTitle("Ticket Numbers (" + oList.getItems().length + ")");
            if (sap.ui.Device.system.phone) {
              oEvent.getSource().removeSelections();
            }
//            if (!sap.ui.Device.system.phone) {
//              this.selectFirstItem();
//            }
            if (oEvent.getSource().getItems().length === 0) {
             // this.getRouter().navTo("NotFound");
            }
          },

          selectFirstItem: function() {

            var oList = this.getView().byId("lstDetails");
            var aItems = oList.getItems();
            if (aItems.length) {
              oList.setSelectedItem(aItems[0], true);
              this.loadDetailView();
              oList.fireSelect({
                "listItem": aItems[0]
              });
            }
            else {
                this.getRouter().myNavToWithoutHash({
                    currentView: master.getView(),
                    targetViewName: "com.acute.ticketZSC.view.NotFound",
                    targetViewType: "XML"
                });
            }
          },


          liveSearch : function(oEvent) {
        	  debugger
        	  var list = this.getView().byId("lstDetails");
        	  var binding = list.getBinding("items");
        	  var sValue = oEvent.oSource.mProperties.value.toLowerCase();
        	  var oFilter = new sap.ui.model.Filter("TicketNo",sap.ui.model.FilterOperator.Contains,sValue);
        	  binding.filter([oFilter]);
        	  
        	 /* var aFilters=[];*/

              	
        	 
     	        
     	     //   var date2 = new sap.ui.model.Filter("CustomerFname",sap.ui.model.FilterOperator.Contains,sValue);
    	   //    var date3 = new sap.ui.model.Filter("CustomerCity1",sap.ui.model.FilterOperator.Contains,sValue);
     	 //     var date4 = new sap.ui.model.Filter("Status",sap.ui.model.FilterOperator.Contains,sValue);
//     	        
     	     //   var oFilter1=new sap.ui.model.Filter([date1, date2,date3], false /*AND*/);
     	  /*      aFilters.push(oFilter1);
     	       binding = list.getBinding("items");*/
     	     //aFilters
              
   	        
          },

            onDetailChanged : function(sChanel, sEvent, oData) {
              var sEntityPath = oData.sEntityPath;
              this.waitForInitialListLoading(function() {
                    var oList = this.getView().byId(
                        "lstDetails");
                    var oSelectedItem = oList.getSelectedItem();
                    if (oSelectedItem
                        && oSelectedItem
                            .getBindingContext()
                            .getPath() === sEntityPath) {
                      return;
                    }
                    var aItems = oList.getItems();
                    for (var i = 0; i < aItems.length; i++) {
                      if (aItems[i].getBindingContext()
                          .getPath() === sEntityPath) {
                        oList.setSelectedItem(aItems[i],
                            true);
                        break;
                      }
                    }
                  });
            },

            onSelect : function(oEvent) {
            
              var bReplace = jQuery.device.is.phone ? false : true;
              var Carrid=oEvent.getParameter("listItem").getTitle();
              var data=oEvent.getParameter("listItem").getBindingContext().getObject();
              sap.ui.getCore().setModel(data,"CustDtls");
              var oCarrid = parseFloat(Carrid);
              this.getRouter().navTo("Detail", {
                  from: "main",
                  contextPath :Carrid,
                }, bReplace);
            },

            onExit: function() {
              var oEventBus = this.getEventBus();
              oEventBus.unsubscribe("Detail", "TabChanged", this.onDetailTabChanged, this);
              oEventBus.unsubscribe("Detail", "Changed", this.onDetailChanged, this);
              oEventBus.unsubscribe("Detail", "NotFound", this.onNotFound, this);
            },
          
        	onResqstEnter: function() {
        		  //  checking whether the entere input is number or not
        		    var ResqstEnter = sap.ui.getCore().byId("id").getValue();
        		    if (isNaN(ResqstEnter)) {
        		        sap.m.MessageBox.show("Enter Numbers Only",{title:"Error",icon: sap.m.MessageBox.Icon.ERROR});
        		        sap.ui.getCore().byId("id").setValue("");
        		        return;
        		    }
        		    if(ResqstEnter.length > 4){
        		    	ResqstEnter = ResqstEnter.slice(0, -1);
        		    	sap.ui.getCore().byId("id").setValue(ResqstEnter);
        		    }
        		},
        		
        		
    });