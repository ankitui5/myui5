//jQuery.sap.require("sap.ui.core.mvc.Controller");
// jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("com.acute.spinsp.util.Formatter");
//jQuery.sap.require("sap.m.MessageBox");

			sap.ui.define([
           	"sap/m/MessageBox",
           	"sap/ui/core/mvc/Controller",
           	"sap/ui/model/json/JSONModel",
           	"sap/m/MessageToast",
           	"sap/m/UploadCollectionParameter",
           	"jquery.sap.global",
           	"sap/ui/Device"
            ]
			, function(MessageBox,Controller, JSONModel) {
           	"use strict";
            var DataArticles, that_S2, S1_Mod;
            sap.ui.controller(
            		
            		"com.acute.spinsp.view.S2",
            		{
            		onInit : function() {
            		this.newBusy = new sap.m.BusyDialog();
            		debugger
            		
                 /*   var jModel = new sap.ui.model.json.JSONModel(ary);*/
              /*      this.S1 = sap.ui.getCore().getModel("JModel");*/
            
            // this.newBusy.open();s
            
            		this.model = this.getOwnerComponent().getModel();
            		this.getRouter().attachRouteMatched(this.onRouteMatched, this);
            		that_S2 = this;
            		

            		if (!jQuery.support.touch) {
            			this.getView().addStyleClass("sapUiSizeCompact");
            			}
            		if (sap.ui.Device.system.desktop) {
            		}
            		that.loEarlyFailure =false;
            		},
          
            		onRouteMatched: function(oEvent) {
            			//;
            			// based on the flag rebindg the data
            			debugger;
            			var ctype  = that.ClaimType; 
            			if (oEvent.getParameter("name") === "S2") {
		                this.onRejMode();
		          /*      this.onAppMode();*/
		                this.onAwardMode();
		                this.onAdjusmentMode(ctype);
		                this.onDesposSesion(ctype);
		                that_S2.getView().byId("idVbox").setVisible(true);
		                that_S2.getView().byId("IdPanelDefect").setVisible(true);
		                that_S2.getView().byId("IdPanelFinal").setVisible(true);
		
		                //               
		                //var ary = {
//                    "d" : that.Data
//                  }
//                  var jModel = new sap.ui.model.json.JSONModel(ary);//
//                  that_S2.getView().setModel(jModel, "jModel");
              
		                that_S2.onEnter();
            			}
            		},
             
             getRouter: function() {
                   return new sap.ui.core.UIComponent.getRouterFor(this);
               },
             /*onPressBackView : function(evt)
            {
              this.getRouter().navTo("S1");
            },*/
           
 //**************************************************************************************************                             
               onDesposSesion:function(key){
                   debugger            	   
            	   //Method for setting the model for vehicle type
            	   var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownDisposalDecisionSet?$filter=ClaimTyp eq '"+key+"'";
            	   var jModel = new sap.ui.model.json.JSONModel();
            	   jModel.loadData(sPath, null, false,"GET",false, false, null);
            	   var loc= this.getView().byId("idInsDD");
            	   loc.unbindAggregation("items");
            	   //var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
            	   loc.setModel(jModel);
            	   loc.bindAggregation("items", {
            		   path : "/d/results",
            		   template : new sap.ui.core.Item({
            			   key : "{DisposalDecision}",
            			   text : "{DisposalDecisionText}"
					})
				});
			},
          
 //*************************************************************************************************         			
			onAdjusmentMode:function(key){
				//Method for setting the model for vehicle type
	            var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownAdjustmentModeSet?$filter=ClaimTyp eq '"+key+"'";
		 		var jModel = new sap.ui.model.json.JSONModel();
		 		jModel.loadData(sPath, null, false,"GET",false, false, null);
		 		var  loc= this.getView().byId("idInsAdjm");
				loc.unbindAggregation("items");
				//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
				loc.setModel(jModel);
				loc.bindAggregation("items", {
					path : "/d/results",
					template : new sap.ui.core.Item({
						key : "{AdjustmentMode}",
						text : "{AdjustmentModeTxt}"
					})
				});
			},
//********************************************************************************************************          			
			onAwardMode:function(key){
                 
				debugger
				//Method for setting the model for vehicle type
	            var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownAwardModeSet?$filter=ClaimTyp eq '"+key+"'";
		 		var jModel = new sap.ui.model.json.JSONModel();
		 		jModel.loadData(sPath, null, false,"GET",false, false, null);
		 		var  loc= this.getView().byId("idInsAwdm");
				loc.unbindAggregation("items");
				//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
				loc.setModel(jModel);
				loc.bindAggregation("items", {
					path : "/d/results",
					template : new sap.ui.core.Item({
						key : "{AwardMode}",
						text : "{AwardModeTxt}"
					})
				});
			},
			
//******************************************************************************************************			
/*			onAppMode:function(key){

				//Method for setting the model for vehicle type
	            var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownApprovalReasonSet?$filter=ClaimTyp eq '"+key+"'";
		 		var jModel = new sap.ui.model.json.JSONModel();
		 		jModel.loadData(sPath, null, false,"GET",false, false, null);
		 		var  loc= this.getView().byId("idInsAppRsen");
				loc.unbindAggregation("items");
				//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
				loc.setModel(jModel);
				loc.bindAggregation("items", {
					path : "/d/results",
					template : new sap.ui.core.Item({
						key : "{AprrovalReason}",
						text : "{ApprovalReasonTxt}"
					})
				});
			},	*/
          
//************************************************************************************************          
          onRejMode:function(key){

				//Method for setting the model for vehicle type
	            var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownRejectionReasonSet?$filter=ClaimTyp eq '"+key+"'";
		 		var jModel = new sap.ui.model.json.JSONModel();
		 		jModel.loadData(sPath, null, false,"GET",false, false, null);
		 		var  loc= this.getView().byId("idInsRegRes");
				loc.unbindAggregation("items");
				//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
				loc.setModel(jModel);
				loc.bindAggregation("items", {
					path : "/d/results",
					template : new sap.ui.core.Item({
						key : "{RejectionReason}",
						text : "{RejectionReasonTxt}"
					})
				});
			},
          
//**************************************************************************************************
          
/*          onCustSelect:function(evt){
            var key=evt.getSource().getSelectedKey();
            this.onTyreFitMent(key);
            this.getView().byId("idFitment").setEnabled(true);
          },
*/
					onTicket : function() {
						var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpTicketSet";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,false, null);
						var _valueHelpTicketSelectDialog = new sap.m.SelectDialog(
								{
									title : "Select Ticket",
									items : {
									path : "/d/results",
									template : new sap.m.StandardListItem(
											{
											title : "{TicketNo}",
											customData : [ new sap.ui.core.CustomData(
											{
											key : "Key",
											value : "{TicketNo}"
                              }) ],

                        }),
                  },
                  liveChange : function(oEvent) {
                    var sValue = oEvent
                        .getParameter("value");
                    var oFilter = new sap.ui.model.Filter(
                        "TicketNo",
                        sap.ui.model.FilterOperator.Contains,
                        sValue);
                    oEvent.getSource().getBinding("items")
                        .filter([ oFilter ]);
                  },
                  confirm : [ this._handleTicketClose, this ],
                  cancel : [ this._handleTicketClose, this ]
                });
            _valueHelpTicketSelectDialog.setModel(jModel);
            _valueHelpTicketSelectDialog.open();
          },
          _handleTicketClose : function(oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
              this.getView().byId("idTno").setValue(
                  oSelectedItem.getTitle());
              that_S2.onEnter();
            }
          },
          
          onClaimF4 : function() {
            var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimSet";
            var jModel = new sap.ui.model.json.JSONModel();
            jModel.loadData(sPath, null, false, "GET", false,
                false, null);
            var _valueHelpTicketSelectDialog = new sap.m.SelectDialog(
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
                    var sValue = oEvent
                        .getParameter("value");
                    var oFilter = new sap.ui.model.Filter(
                        "IClaimNo",
                        sap.ui.model.FilterOperator.Contains,
                        sValue);
                    oEvent.getSource().getBinding("items")
                        .filter([ oFilter ]);
                  },
                  confirm : [ this._handleClaimClose, this ],
                  cancel : [ this._handleClaimClose, this ]
                });
            _valueHelpTicketSelectDialog.setModel(jModel);
            _valueHelpTicketSelectDialog.open();
          },
          _handleClaimClose : function(oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
              this.getView().byId("idClaimno").setValue(
                  oSelectedItem.getTitle());
              that_S2.onEnter();
            }
          },
          
          
          //Application
          EarAppHelp : function() {
              var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/F4ApplicationSet";
              var jModel = new sap.ui.model.json.JSONModel();
              jModel.loadData(sPath, null, false, "GET", false,
                  false, null);
              var _valueHelpAppSelectDialog = new sap.m.SelectDialog(
                  {

                    title : "Select Application",
                    items : {
                      path : "/d/results",
                      template : new sap.m.StandardListItem(
                          {
                            title : "{Application}",
                            customData : [ new sap.ui.core.CustomData(
                                {
                                  /*key : "Key",*/
                                  value : "{Application}"
                                }) ],

                          }),
                    },
                    liveChange : function(oEvent) {
                      var sValue = oEvent.getParameter("value");
                      var oFilter = new sap.ui.model.Filter("Application",
                          sap.ui.model.FilterOperator.Contains,sValue);
                      oEvent.getSource().getBinding("items").filter([ oFilter ]);
                    },
                    confirm : [ this._handleAppClose, this ],
                    cancel : [ this._handleAppClose, this ]
                  });
              _valueHelpAppSelectDialog.setModel(jModel);
              _valueHelpAppSelectDialog.open();
            },
            _handleAppClose : function(oEvent) {
            	debugger
              var oSelectedItem = oEvent.getParameter("selectedItem");
              if (oSelectedItem) {
            	  sap.ui.getCore().byId("idEarApp").setValue(oSelectedItem.getTitle());
                }
            },      
          
          
            //Route
            RouteHelp : function() {
                var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/F4RouteSet";
                var jModel = new sap.ui.model.json.JSONModel();
                jModel.loadData(sPath, null, false, "GET", false,
                    false, null);
                var _valueHelpRouteSelectDialog = new sap.m.SelectDialog(
                    {

                      title : "Select Route",
                      items : {
                        path : "/d/results",
                        template : new sap.m.StandardListItem(
                            {
                              title : "{Route}",
                              customData : [ new sap.ui.core.CustomData(
                                  {
                                    /*key : "Key",*/
                                    value : "{Route}"
                                  }) ],

                            }),
                      },
                      liveChange : function(oEvent) {
                        var sValue = oEvent.getParameter("value");
                        var oFilter = new sap.ui.model.Filter("Route",
                            sap.ui.model.FilterOperator.Contains,sValue);
                        oEvent.getSource().getBinding("items").filter([ oFilter ]);
                      },
                      confirm : [ this._handleRouteClose, this ],
                      cancel : [ this._handleRouteClose, this ]
                    });
                _valueHelpRouteSelectDialog.setModel(jModel);
                _valueHelpRouteSelectDialog.open();
              },
              _handleRouteClose : function(oEvent) {
              	debugger
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
              	  sap.ui.getCore().byId("idEarRou").setValue(oSelectedItem.getTitle());
                  }
              },     
              
              //RimProfile
              RimHelp : function() {
                  var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/F4RimProfileSet";
                  var jModel = new sap.ui.model.json.JSONModel();
                  jModel.loadData(sPath, null, false, "GET", false,
                      false, null);
                  var _valueHelpRimSelectDialog = new sap.m.SelectDialog(
                      {

                        title : "Select Rim Profile",
                        items : {
                          path : "/d/results",
                          template : new sap.m.StandardListItem(
                              {
                                title : "{RimProfile}",
                                customData : [ new sap.ui.core.CustomData(
                                    {
                                      /*key : "Key",*/
                                      value : "{RimProfile}"
                                    }) ],

                              }),
                        },
                        liveChange : function(oEvent) {
                          var sValue = oEvent.getParameter("value");
                          var oFilter = new sap.ui.model.Filter("RimProfile",
                              sap.ui.model.FilterOperator.Contains,sValue);
                          oEvent.getSource().getBinding("items").filter([ oFilter ]);
                        },
                        confirm : [ this._handleRimClose, this ],
                        cancel : [ this._handleRimClose, this ]
                      });
                  _valueHelpRimSelectDialog.setModel(jModel);
                  _valueHelpRimSelectDialog.open();
                },
                _handleRimClose : function(oEvent) {
                	debugger
                  var oSelectedItem = oEvent.getParameter("selectedItem");
                  if (oSelectedItem) {
                	  sap.ui.getCore().byId("idEarRim").setValue(oSelectedItem.getTitle());
                    }
                },    
              
          
          
          onStencilNumberChange : function(evt)
          {
            var _self=this;
            
            debugger
            var csten = this.getView().byId("idTyreStn").getValue();  
            var flag = 0;
            var len   = csten.length;
            	len = len - 1;
/*            for(var i=len;i>=len-4;i--){
            	var val = evt.getSource().getValue()[i];
					if(val){
						if(isNaN(val)){
							val = val.substring(0, val.length - 1);
							evt.getSource().setValue(val);
							flag = 1;
							sap.m.MessageToast.show("Last 4 digits of Stencil number must be Numeric");
							
						}else if(val.indexOf(".")!="-1"){
							val = val.substring(0, val.length - 1);
							evt.getSource().setValue(val);
						}
					}
            }*/
            
            if(flag === 1){
            	csten = this.getView().byId("idTyreStn").getValue();
            }
           // var citem = this.getView().byId("idItemCodeTyre").getValue();
            var citem = this.ItemCode;
          	var cdepo = S1_Mod.getData().ClaimDepo; 	 
            
            debugger;
//            var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/ValidateStencilNumberSet(ClaimRecDepo='"+depoValue+"',ItemCode='"+itemCode+"',StencilNo='"+stencilValue+"')";
            var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
            var oReadModel = new sap.ui.model.odata.ODataModel(
                sServiceUrl);
            oReadModel.setHeaders({
              "Content-Type" : "application/atom+xml"
            });
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
            var fncSuccess = function(oData, oResponse){
              var _self1 = _self;
              debugger
              if (oData.Message != "") {
                sap.m.MessageBox.show(oData.Message, {
                  title : "Error",
                  icon : sap.m.MessageBox.Icon.ERROR,
                  onClose : function() {
                    _self1.getView().byId("idTyreStn").setValue("");
                    _self.getView().byId("idTyreTally").setValue("");                
                    _self.getView().byId("idTyreMfP").setValue("");
                    _self.getView().byId("idPdMon").setValue("");
                    _self.getView().byId("idProdYear").setValue("");
                    _self.getView().byId("idProdWeek").setValue("");
                    _self.getView().byId("idSalesDepot").setValue("");
                    _self.getView().byId("idSalesInvno").setValue("");
                    _self.getView().byId("idSoldTo").setValue("");
                    _self.getView().byId("idSalesInvDt").setValue("");

                  }
                });
              }
              else{
                _self.getView().byId("idTyreTally").setValue(oData.TallyFlag);                
                _self.getView().byId("idTyreMfP").setValue(oData.ManfPlant);
                _self.getView().byId("idPdMon").setValue(oData.PrdMonth);
                _self.getView().byId("idProdYear").setValue(oData.PrdYear);
                _self.getView().byId("idProdWeek").setValue(oData.PrdWeek);
                _self.getView().byId("idSalesDepot").setValue(oData.SalesDepotName);
                _self.getView().byId("idSalesInvno").setValue(oData.SalesInv);
                _self.getView().byId("idSoldTo").setValue(oData.SoldName);
                _self.getView().byId("idSalesInvDt").setValue(oData.SalesDate);   
               

              }
            }
            oReadModel.read("ValidateStencilNumberSet(ClaimRecDepo='"+cdepo+"',ItemCode='"+citem+"',StencilNo='"+csten+"')",
                {
              success : fncSuccess,
              error : fncError
            });

          },

          
          // on enter 
          	onEnter : function() {
          		debugger
          	  var that_S2 = this;
          	  var ary = {"d" : that.Data }    
          					
              debugger
              
            var s1Model = sap.ui.getCore().getModel("s1Model"); 
          	S1_Mod = sap.ui.getCore().getModel("s1Model"); 
      		var tktno2 = s1Model.getData().tktno2;
      		var tkDt   = s1Model.getData().tkDt;
      		var citem  = that.itemType;
      		
      		if (citem == "TYRE")
      		{
      		var dlcode = s1Model.getData().Dealar;
      		var dlname = s1Model.getData().DlName;
      		that_S2.getView().byId("idDealerCode").setValue(dlcode)
      		that_S2.getView().byId("idDealerName").setValue(dlname)
      		
      		}
      		
         /*     that_S2.getView().setModel(jModel, "jModel");*/
              that_S2.getView().byId("idTno1").setValue(tktno2)
              that_S2.getView().byId("idTkDate").setValue(tkDt)

              debugger
              that_S2.getView().byId("idVbox").setVisible(true);
              that_S2.getView().byId("IdPanelDefect").setVisible(true);
              that_S2.getView().byId("IdPanelFinal").setVisible(true);
              
              var i = window.tempItemTYpe;
              
//              var Tyre = sap.ui.getCore().byId("RD1").getSelected();
//              var Tube = sap.ui.getCore().byId("RD2").getSelected();
//              var Flap = sap.ui.getCore().byId("RD3").getSelected();

              if(i == "TYRE"){
                that_S2.getView().byId("IdPanel").setVisible(true);
                that_S2.getView().byId("IdPanel11").setVisible(true);
                that_S2.getView().byId("IdPanel1").setVisible(false);
                that_S2.getView().byId("IdPanel2").setVisible(false);
              }
              else if(i == "TUBE"){                
                that_S2.getView().byId("idHeaderTube").setText("Tube Details");
                that_S2.getView().byId("idDetailsTube").setText("Tube Inspection Details");                
                that_S2.getView().byId("IdPanel").setVisible(false);
                that_S2.getView().byId("IdPanel11").setVisible(false);
                that_S2.getView().byId("IdPanel1").setVisible(true);  
                that_S2.getView().byId("IdPanel2").setVisible(true);
                that_S2.getView().byId("idVbox").setVisible(false);
                }
              else if(i == "FLAP"){
                  that_S2.getView().byId("idHeaderTube").setText("Flap Details");
                  that_S2.getView().byId("idDetailsTube").setText("Flap Inspection Details");                  
                  that_S2.getView().byId("IdPanel").setVisible(false);
                  that_S2.getView().byId("IdPanel11").setVisible(false);
                  that_S2.getView().byId("IdPanel1").setVisible(true);
                  that_S2.getView().byId("IdPanel2").setVisible(true);
                  that_S2.getView().byId("idVbox").setVisible(false);
                }
               },
         
               onStateHelp: function() {

            var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'";
            var jModel = new sap.ui.model.json.JSONModel();
            jModel.loadData(sPath, null, false, "GET", false, false, null);
            var _valueHelpSelectDialog = new sap.m.SelectDialog({

              title: "State",
              items: {
                path: "/d/results",
                template: new sap.m.StandardListItem({
                  title: "{Region}",
                  customData: [new sap.ui.core.CustomData({
                    key: "Key",
                    value: "{RegionCode}"
                  })]

                })
              },
              liveChange: function(oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.Contains, sValue);
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
              this.getView().byId("idState").setValue(oSelectedItem.getTitle());
            }

          },
          
          	onDistrictHelp: function() {
            var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '" + this.State + "'";
            var jModel = new sap.ui.model.json.JSONModel();
            jModel.loadData(sPath, null, false, "GET", false, false, null);
            var _valueHelpDistrictDialog = new sap.m.SelectDialog({
              title: "District",
              items: {
                path: "/d/results",
                template: new sap.m.StandardListItem({
                  title: "{District}",
                  customData: [new sap.ui.core.CustomData({
                    key: "Key",
                    value: "{District}"
                  })]

                })
              },
              liveChange: function(oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new sap.ui.model.Filter("District", sap.ui.model.FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
              },
              confirm: [this._handleDistrictClose, this],
              cancel: [this._handleDistrictClose, this]
            });
            _valueHelpDistrictDialog.setModel(jModel);
            _valueHelpDistrictDialog.open();
          },

          _handleDistrictClose: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
              //this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
              this.District = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
              this.getView().byId("idDistrict").setValue(oSelectedItem.getTitle());
            }

          },
          onTypeJkDelar:function(){
          var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpDealerSet?$filter=ClaimType eq '"+this.ClaimType+"' and ClaimRecvDepo eq '"+this.RecDepoType+"'";
          var jModel = new sap.ui.model.json.JSONModel();
          jModel.loadData(sPath, null, false, "GET", false,
              false, null);
          var _valueHelprJKDealSelectDialog = new sap.m.SelectDialog(
              {

                title : "Select Delar Code",
                items : {
                  path : "/d/results",
                  template : new sap.m.StandardListItem(
                      {
                        title : "{Name1}"+" ("+"{Kunnr}"+")",
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

                   var oFilter = new sap.ui.model.Filter("Name1",sap.ui.model.FilterOperator.Contains,sValue);
                       var oFilter2 = new sap.ui.model.Filter("Kunnr",sap.ui.model.FilterOperator.Contains,sValue);
                       
                       var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
                  oEvent.getSource().getBinding("items")
                      .filter([ oFilter1 ]);
                },
                confirm : [ this._handleTypeJKDealClose, this ],
                cancel : [ this._handleTypeJKDealClose, this ]
              });
          _valueHelprJKDealSelectDialog.setModel(jModel);
          _valueHelprJKDealSelectDialog.open();
        },
        _handleTypeJKDealClose : function(oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem");
          if (oSelectedItem) {
            this.getView().byId("idDelar").setValue(
                oSelectedItem.getTitle());
            debugger
            var obj=oSelectedItem.getBindingContext().getObject();
            this.getView().byId("idStreet").setValue(obj.Street);
            this.getView().byId("iddelCity").setValue(obj.City1);
            this.getView().byId("iddelDist").setValue(obj.City2);
            this.getView().byId("idDealPos").setValue(obj.Post_code1);
            this.getView().byId("idDealMobil").setValue(obj.Tel_number);
            this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();

          }

        },
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
        
        validateCharacter : function( oEvent ){
          var text     = oEvent.getSource().getValue();
          var reg      = /^[a-zA-Z]+$/;
          if( !text.match(reg) ){
            if( !isNaN( text.charAt(0)) || !text.charAt(0).match(reg)){
              text = text.substring( 1 , text.length );
            }else if( !isNaN( text.charAt( text.length - 1 )) || !text.charAt(text.length - 1).match(reg)){
              text = text.substring( 0 , text.length - 1 );
            }else{
              for( var i = 0 ; i < text.length; i++ ){
                if( !isNaN( text.charAt(i) ) || !text.charAt(i).match(reg)){
                  text = text.split( text.charAt(i) )[0] + text.split( text.charAt(i) )[1];
                }
              }
            }
            oEvent.getSource().setValue( text );  
          }else{
            oEvent.getSource().setValueState( "None" );
          }       
        },
        
        ItemCodeTube:function(evt){
        	  debugger  
        	var ctype  = S1_Mod.getData().ClaimType;  
        	var cdepo  = S1_Mod.getData().ClaimDepo;  
        	  
            var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq '"+that.itemType+"' and IClaimType eq '"+ctype+"' and IRecvDepo eq '"+cdepo+"'";
            var jModel = new sap.ui.model.json.JSONModel();
            jModel.loadData(sPath, null, false, "GET", false,
                false, null);
            var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
                {
                  title : "Select Item Code",
                  items : {
                    path : "/d/results",
                    template : new sap.m.StandardListItem(
                        {
                          title : "{ItemCode}" ,
                          description :"{ItemDescr}",                          
                          customData : [ new sap.ui.core.CustomData(
                              {
                                key : "Key",
                                value : "{ItemCode}"
                              }) ],
                        }),
                  },
                  liveChange : function(oEvent) {
                    var sValue = oEvent.getParameter("value");
               	 var oFilter = new sap.ui.model.Filter("ItemCode",sap.ui.model.FilterOperator.Contains,sValue);
                 var oFilter2 = new sap.ui.model.Filter("ItemDescr",sap.ui.model.FilterOperator.Contains,sValue);
                 
                 var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);									
            	
            	oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
 
                  },
                  confirm : [ this._handleTyreCodeClose, this ],
                  cancel : [ this._handleTyreCodeClose, this ]
                });
            _valueHelpTyreSelectDialog.setModel(jModel);
            _valueHelpTyreSelectDialog.open();
          },
          _handleTyreCodeClose : function(oEvent) {
  			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				debugger
				var obj=oSelectedItem.getBindingContext().getObject();
				this.getView().byId("idTubeCode").setValue(oSelectedItem.getDescription());
				this.getView().byId("idTyreMfPCat").setValue(obj.PrdtCatDesc);
				this.ItemCode = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
				
				//this.RecDepoType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
				//this.getView().byId("idTubeCode").setValue(oSelectedItem.getTitle());
			}
          },
          
 //********************************************************************************************************
          OnIteamCodeTyre:function(evt){
        	  debugger
           
        	var ctype  = S1_Mod.getData().ClaimType;  
          	var cdepo  = S1_Mod.getData().ClaimDepo; 	  
        	  
            var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq 'TYRE' and IClaimType eq '"+ctype+"' and IRecvDepo eq '"+cdepo+"'";
            var jModel = new sap.ui.model.json.JSONModel();
            jModel.loadData(sPath, null, false, "GET", false,
                false, null);
            var _valueHelpTSelectDialog = new sap.m.SelectDialog(
                {
                  title : "Select Item Code",
                  items : {
                    path : "/d/results",
                    template : new sap.m.StandardListItem(
                        {
                          title : "{ItemCode}" ,
                          description :"{ItemDescr}",                          
                          customData : [ new sap.ui.core.CustomData(
                              {
                                key : "Key",
                                value : "{ItemCode}"
                              }) ],
                        }),
                  },
                  liveChange : function(oEvent) {
                    var sValue = oEvent.getParameter("value");
               	 var oFilter = new sap.ui.model.Filter("ItemCode",sap.ui.model.FilterOperator.Contains,sValue);
                 var oFilter2 = new sap.ui.model.Filter("ItemDescr",sap.ui.model.FilterOperator.Contains,sValue);
                 
                 var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);									
            	
            	oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
 
                  },
                  confirm : [ this._handleTCodeClose, this ],
                  cancel : [ this._handleTCodeClose, this ]
                });
            _valueHelpTSelectDialog.setModel(jModel);
            _valueHelpTSelectDialog.open();
          },
          _handleTCodeClose : function(oEvent) {
  			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				debugger
				var obj=oSelectedItem.getBindingContext().getObject();
				this.getView().byId("idItemCodeTyre").setValue(oSelectedItem.getDescription());
				this.getView().byId("idTyrePdc").setValue(obj.PrdtCatDesc);		
				this.getView().byId("idTyreTNSD").setValue(obj.Totnsd);						
				this.ItemCode = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
				debugger				
				this.prdcat = obj.PrdtCat;
			}
          },
          
          
          //********************************************************************************/
          
          //chage sumit
          
      	InsGpCodeHelp:function(evt){
      		debugger
  	  
      		var ctype  = S1_Mod.getData().ClaimType;      		
      		var citem  = this.ItemCode;
			var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspCodeGroupSet?$filter=ItemCode eq '"+citem+"' and ClaimItemType eq '"+that.itemType+"'and ClaimTyp eq '"+ctype+"'";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false,
					false, null);
			var _valueHelpCodeGroupDialog = new sap.m.SelectDialog(
					{

						title : "Select Group Code",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem(
									{
										title : "{CodeGrpTxt}",
										description:"{CodeGrp}",
										customData : [ new sap.ui.core.CustomData(
												{
													key : "Key",
													value : "{CodeGrp}"
												}) ],

									}),
						},
						liveChange : function(oEvent) {
							var sValue = oEvent
									.getParameter("value");
							var oFilter = new sap.ui.model.Filter(
									"CodeGrpTxt",
									sap.ui.model.FilterOperator.Contains,
									sValue);
							oEvent.getSource().getBinding("items")
									.filter([ oFilter ]);
						},
						confirm : [ this._handleCodeGroupClose, this ],
						cancel : [ this._handleCodeGroupClose, this ]
					});
			_valueHelpCodeGroupDialog.setModel(jModel);
			_valueHelpCodeGroupDialog.open();
		},
		_handleCodeGroupClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				that_S2.MajGrp = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
				that_S2.getView().byId("idinsMjCdGp").setValue(oSelectedItem.getTitle());
				that_S2.getView().byId("idinsMjDc").setEnabled(true).setValue();	
				that_S2.getView().byId("idinsMjDc").setValue();
				this.MjCode = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			}
		},
		
		
		InsMjDefectHelp:function(evt){
			var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspDefectSet?$filter=CodeGrp eq '"+that_S2.MajGrp+"'";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false,
					false, null);
			var _valueHelpMjDefectSelectDialog = new sap.m.SelectDialog(
					{

						title : "Select Defect Code",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem(
									{
										title : "{DefectTxt}",
										description:"{Defect}",
										customData : [ new sap.ui.core.CustomData(
												{
													key : "Key",
													value : "{Defect}"
												}) ],

									}),
						},
						liveChange : function(oEvent) {
							var sValue = oEvent
									.getParameter("value");
							var oFilter = new sap.ui.model.Filter(
									"Defect",
									sap.ui.model.FilterOperator.Contains,
									sValue);
							oEvent.getSource().getBinding("items")
									.filter([ oFilter ]);
						},
						confirm : [ this._handleMjDefectClose, this ],
						cancel : [ this._handleMjDefectClose, this ]
					});
			_valueHelpMjDefectSelectDialog.setModel(jModel);
			_valueHelpMjDefectSelectDialog.open();
		},
		_handleMjDefectClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				that_S2.MajDef = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
				that_S2.getView().byId("idinsMjDc").setValue(oSelectedItem.getTitle());
				this.MjDef = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			}
		},

      	InsMinorGpCodeHelp:function(evt){
      		debugger  	  
      		var ctype  = S1_Mod.getData().ClaimType;    
      		var citem  = this.ItemCode;
      		
			var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspCodeGroupSet?$filter=ItemCode eq '"+citem+"' and ClaimItemType eq '"+that.itemType+"'and ClaimTyp eq '"+ctype+"'";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false,
					false, null);
			var _valueHelpMinorCodeGroupDialog = new sap.m.SelectDialog(
					{

						title : "Select Group Code",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem(
									{
										title : "{CodeGrpTxt}",
										description:"{CodeGrp}",
										customData : [ new sap.ui.core.CustomData(
												{
													key : "Key",
													value : "{CodeGrp}"
												}) ],

									}),
						},
						liveChange : function(oEvent) {
							var sValue = oEvent
									.getParameter("value");
							var oFilter = new sap.ui.model.Filter(
									"CodeGrpTxt",
									sap.ui.model.FilterOperator.Contains,
									sValue);
							oEvent.getSource().getBinding("items")
									.filter([ oFilter ]);
						},
						confirm : [ this._handleMinorCodeGroupClose, this ],
						cancel : [ this._handleMinorCodeGroupClose, this ]
					});
			_valueHelpMinorCodeGroupDialog.setModel(jModel);
			_valueHelpMinorCodeGroupDialog.open();
		},
		_handleMinorCodeGroupClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				that_S2.MinorGrp = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
				that_S2.getView().byId("idinsMnCdGp").setValue(oSelectedItem.getTitle());
				that_S2.getView().byId("idinsMnDc").setEnabled(true).setValue();	
				that_S2.getView().byId("idinsMnDc").setValue();
				this.MnCode = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			}
		},
		
		
		InsMinorDefectHelp:function(evt){
			var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspDefectSet?$filter=CodeGrp eq '"+that_S2.MinorGrp+"'";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false,
					false, null);
			var _valueHelpMinorDefectSelectDialog = new sap.m.SelectDialog(
					{

						title : "Select Defect Code",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem(
									{
										title : "{DefectTxt}",
										description:"{Defect}",
										customData : [ new sap.ui.core.CustomData(
												{
													key : "Key",
													value : "{Defect}"
												}) ],

									}),
						},
						liveChange : function(oEvent) {
							var sValue = oEvent
									.getParameter("value");
							var oFilter = new sap.ui.model.Filter(
									"Defect",
									sap.ui.model.FilterOperator.Contains,
									sValue);
							oEvent.getSource().getBinding("items")
									.filter([ oFilter ]);
						},
						confirm : [ this._handleMinorDefectClose, this ],
						cancel : [ this._handleMinorDefectClose, this ]
					});
			_valueHelpMinorDefectSelectDialog.setModel(jModel);
			_valueHelpMinorDefectSelectDialog.open();
		},
		_handleMinorDefectClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				that_S2.MinorDef = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
				that_S2.getView().byId("idinsMnDc").setValue(oSelectedItem.getTitle());
				this.MnDef = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			}
		},		
          
		YearValid : function(oEvent)
		{ 
			debugger
			var val = oEvent.getSource().getValue();
			if(val){
				if(isNaN(val)){
					val = val.substring(0, val.length - 1);
					oEvent.getSource().setValue(val);					
				}else if(!(isNaN(val)) && val.length == 4){
					var d = new Date();
					var y = d.getFullYear();
						if(val < 2000){
						sap.m.MessageToast.show("Year cannot be less than 2000");
						oEvent.getSource().setValue();				
						}else if(val > y){
						sap.m.MessageToast.show("Year cannot be future year");
						oEvent.getSource().setValue();
						}	
						
			       var MouldNo     = that_S2.getView().byId("idTubeMDNo").getValue();
			       var PrdMonth    = that_S2.getView().byId("idMonth").getSelectedKey();
			       var PrdYear     = that_S2.getView().byId("idYear").getValue();
			       var StnclNumber = that_S2.vendorcc + "-" + MouldNo + "-" + PrdMonth + "-" + PrdYear.substring(2,4);
			       that_S2.getView().byId("idTyreStnTube").setValue(StnclNumber);  	
					}
				else
				{					
				}
			}
		},		
		
		addstencil : function()
		{    	 
		 debugger 	    	 
       	 var MouldNo     = that_S2.getView().byId("idTubeMDNo").getValue();
    	 var PrdMonth    = that_S2.getView().byId("idMonth").getSelectedKey();
    	 var PrdYear     = that_S2.getView().byId("idYear").getValue();
    	 var StnclNumber = that_S2.vendorcc + "-" + MouldNo + "-" + PrdMonth + "-" + PrdYear.substring(2,4);
    	 that_S2.getView().byId("idTyreStnTube").setValue(StnclNumber);      	 
		},
       
          onPolicyDoc : function()
          {
            var docNumber = this.getView().byId("idPolicyDoc").getValue();
            sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DisplayDMSDocumentSet(DocNo='"+docNumber+"')/$value", true);
          },
          
          
/******************************************************************************/          
          onInspCreate:function(){
        	debugger;
        	/*************BY RAM *************/
        	var check			 = false;       	
        	var ItemType = that.itemType;        	
        	if(ItemType == "TYRE"){
    		
        		var ItemCode    = this.ItemCode;
        		var StnclNumber = that_S2.getView().byId("idTyreStn").getValue();
        		var MouldNo     = that_S2.getView().byId("idTyreMDNo").getValue();
        		var Nsd         = that_S2.getView().byId("idTyreNsd").getValue();
        		var AbsoluteDis = that_S2.getView().byId("idTyreDis").getValue();        		
        		var TNsd        = that_S2.getView().byId("idTyreTNSD").getValue();
        		var Wear        = that_S2.getView().byId("idTyreWear").getValue();        		 
        		var PrdWeek     = that_S2.getView().byId("idProdWeek").getValue();
        		var PrdMonth    = that_S2.getView().byId("idPdMon").getValue();
        		var PrdYear     = that_S2.getView().byId("idProdYear").getValue();
        		var RevisedDis  = '0';
        		if (StnclNumber != ""){
        			that_S2.onStencilNumberChange();
        		}
        		
        		
        	}else{
        		var ItemCode    = this.ItemCode;
        		var StnclNumber = that_S2.getView().byId("idTyreStnTube").getValue();
        		var MouldNo     = that_S2.getView().byId("idTubeMDNo").getValue();
        		var VendorCode  = this.VendCode;
        		var PrdMonth    = that_S2.getView().byId("idMonth").getSelectedKey();
        		var PrdYear     = that_S2.getView().byId("idYear").getValue();
        		var RevisedDis  = that_S2.getView().byId("idInstubeDic").getValue();
        		var Nsd         = '0';
        		var AbsoluteDis = '0';       		
        		var TNsd        = '0';
        		var Wear        = '0';
        		var PrdWeek     = '0';
        	}
        	
        	var CodeGrp 	= this.MjCode;
        	var MajorDefect = this.MjDef;
        	var MinorCodeGrp= this.MnCode;
        	var MinorDefect = this.MnDef;
        	
        	
        	var DisposlDecision = that_S2.getView().byId("idInsDD").getSelectedKey();
        	var AdjustmentMode  = that_S2.getView().byId("idInsAdjm").getSelectedKey();
        	var AwardMode       = that_S2.getView().byId("idInsAwdm").getSelectedKey();
        	var RejectionReason = that_S2.getView().byId("idInsRegRes").getSelectedKey();
        	var PolicyNo        = that_S2.getView().byId("idInsPlc").getValue();      
        	var InspecComment   = that_S2.getView().byId("idInsComment").getValue(); 
        	
        	
        	if(ItemType == "TYRE"){
        	  if(ItemCode == ""){
        		 check = true;
        		 this.getView().byId("idItemCodeTyre").setValueState(sap.ui.core.ValueState.Error);
        	  }else {
        		 this.getView().byId("idItemCodeTyre").setValueState(sap.ui.core.ValueState.None);
        	  } 
        		
         	  if(StnclNumber  == ""){
         		 check = true;
         		 this.getView().byId("idTyreStn").setValueState(sap.ui.core.ValueState.Error);
         	  }else {
         		 this.getView().byId("idTyreStn").setValueState(sap.ui.core.ValueState.None);
         	  } 
        	  
         	  if(MouldNo == ""){
            		 check = true;
            		 this.getView().byId("idTyreMDNo").setValueState(sap.ui.core.ValueState.Error);
            	  }else {
            		 this.getView().byId("idTyreMDNo").setValueState(sap.ui.core.ValueState.None);
            	  } 
         	  
         	  if(Nsd == ""){
          		 check = true;
          		 this.getView().byId("idTyreNsd").setValueState(sap.ui.core.ValueState.Error);
          	  }else {
          		 this.getView().byId("idTyreNsd").setValueState(sap.ui.core.ValueState.None);
          	  } 
         	  
         	  if(AbsoluteDis == ""){
           		 check = true;
           		 this.getView().byId("idTyreDis").setValueState(sap.ui.core.ValueState.Error);
           	  }else {
           		 this.getView().byId("idTyreDis").setValueState(sap.ui.core.ValueState.None);
           	  }  
        		
        		
        	}else{
        		
          	  if(ItemCode == "" || ItemCode == undefined){
         		 check = true;
         		 this.getView().byId("idTubeCode").setValueState(sap.ui.core.ValueState.Error);
         	  }else {
         		 this.getView().byId("idTubeCode").setValueState(sap.ui.core.ValueState.None);
         	  } 	 
          	  
           	  
           	  if(RevisedDis == ""){
          		 check = true;
          		 this.getView().byId("idInstubeDic").setValueState(sap.ui.core.ValueState.Error);
          	  }else {
          		 this.getView().byId("idInstubeDic").setValueState(sap.ui.core.ValueState.None);
          	  }  
          	  
         	  if(VendorCode  == "" || VendorCode == undefined){
         		 check = true;
         		 this.getView().byId("idTube_venCode").setValueState(sap.ui.core.ValueState.Error);
         	  }else {
         		 this.getView().byId("idTube_venCode").setValueState(sap.ui.core.ValueState.None);
         	  } 
           	  
           	  if(MouldNo  == ""){
           		 check = true;
           		 this.getView().byId("idTubeMDNo").setValueState(sap.ui.core.ValueState.Error);
           	  }else {
           		 this.getView().byId("idTubeMDNo").setValueState(sap.ui.core.ValueState.None);
           	  } 
  
          	  
           	  if(PrdMonth  == "" || PrdMonth  == "00"){
         		 check = true;
         		 this.getView().byId("idMonth").addStyleClass("myStateError");
         	  }else {
         		 this.getView().byId("idMonth").removeStyleClass("myStateError");
         	  } 
           	  
           	  if(PrdYear == ""){
            		 check = true;
            		 this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.Error);
            	  }else {
            		 this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.None);
            	  } 
          	  
        	}
        		
         	  if(CodeGrp == "" || CodeGrp == undefined){
           		 check = true;
           		 this.getView().byId("idinsMjCdGp").setValueState(sap.ui.core.ValueState.Error);
           	  }else {
           		 this.getView().byId("idinsMjCdGp").setValueState(sap.ui.core.ValueState.None);
           	  } 	
        	
         	  if(MajorDefect == "" || MajorDefect == undefined){
            		 check = true;
            		 this.getView().byId("idinsMjDc").setValueState(sap.ui.core.ValueState.Error);
            	  }else {
            		 this.getView().byId("idinsMjDc").setValueState(sap.ui.core.ValueState.None);
            	 } 
         	  
        	 	  if((MinorCodeGrp == "" || MinorCodeGrp == undefined) && 
        	 		  (MinorDefect != '' && MinorDefect != undefined)){
            		 check = true;
            		 this.getView().byId("idinsMnCdGp").setValueState(sap.ui.core.ValueState.Error);
            	  }else {
            		 this.getView().byId("idinsMnCdGp").setValueState(sap.ui.core.ValueState.None);
            	  } 	
         	
          	  if((MinorDefect == "" || MinorDefect == undefined) && 
          		(MinorCodeGrp != '' && MinorCodeGrp != undefined)){
             		 check = true;
             		 this.getView().byId("idinsMnDc").setValueState(sap.ui.core.ValueState.Error);
             	  }else {
             		 this.getView().byId("idinsMnDc").setValueState(sap.ui.core.ValueState.None);
             	 }          	  
         	  

         	  if(DisposlDecision == ""){
         		 check = true;
         		 this.getView().byId("idInsDD").addStyleClass("myStateError");
         	  }else {
         		 this.getView().byId("idInsDD").removeStyleClass("myStateError");
         	 } 
         	  
         	 if(DisposlDecision=="A" && AdjustmentMode == ""){
          		 check = true;
     		 this.getView().byId("idInsAdjm").addStyleClass("myStateError");
     	  }else {
     		 this.getView().byId("idInsAdjm").removeStyleClass("myStateError");
     	 } 
         	 
         if(AdjustmentMode != "" && AwardMode == ""){
          		 check = true;
     		 this.getView().byId("idInsAwdm").addStyleClass("myStateError");
     	  }else {
     		 this.getView().byId("idInsAwdm").removeStyleClass("myStateError");
     	 }  	 
         	 
     	 if(DisposlDecision=="R" && RejectionReason == ""){
      		 check = true;
 		 this.getView().byId("idInsRegRes").addStyleClass("myStateError");
     	 }else {
 		 this.getView().byId("idInsRegRes").removeStyleClass("myStateError");
     	 }         
     	 
       	if(DisposlDecision == 'A' && (AdjustmentMode == "TEC" || AdjustmentMode == "POL"
       		 && PolicyNo == "")){
       		check = true;
       		this.getView().byId("idInsPlc").setValueState(sap.ui.core.ValueState.Error);
    	}else
    		{
    		this.getView().byId("idInsPlc").setValueState(sap.ui.core.ValueState.None);
    		}
          	
     	if (check == true){
	 		sap.m.MessageBox.show("Please fill all Required Fields.", {
	       title: "ERROR",
	       icon:sap.m.MessageBox.Icon.ERROR,
	 		});
	 		return;
     	}
          
          var Data={};
          debugger
          
          Data.ISpot = "X"; 
          Data.TicketNo =  S1_Mod.getData().tktno2 ;
        
          
          Data.FitType = S1_Mod.getData().FitType;
          Data.CustType =  S1_Mod.getData().CustType;
          Data.ClaimTyp =  S1_Mod.getData().ClaimType ;
          Data.ClaimRecDepo = S1_Mod.getData().ClaimDepo ;
          Data.Owner        = S1_Mod.getData().CreatedBy;

          Data.LetterRefNo =  S1_Mod.getData().LattrRefNo ;
          Data.LetterRefDt =  S1_Mod.getData().LattrRefDt ;
          if(Data.LetterRefDt!="" && Data.LetterRefDt!=undefined)
        	  Data.LetterRefDt = Data.LetterRefDt+"T00:00:00"  


          Data.CustomerTelf1 =  S1_Mod.getData().CustmMobile;
          Data.CustomerTelf2 =  S1_Mod.getData().CustAlt;
          Data.CustomerFname =  S1_Mod.getData().CustomerFname;
          Data.CustomerLname =  S1_Mod.getData().CustomerLname;
          Data.CustomerLand1 =  S1_Mod.getData().CustomerLand1;
          Data.CustomerAddr1 =  S1_Mod.getData().CustomerAddr1;
          Data.CustomerAddr2 =  S1_Mod.getData().CustomerAddr2;
          Data.CustomerCity1 =  S1_Mod.getData().CustomerCity1;
          Data.CustomerCity2 =  S1_Mod.getData().CustomerCity2;
          Data.CustomerRegion =  S1_Mod.getData().CustomerRegion;
          Data.CustomerEmail =  S1_Mod.getData().CustomerEmail;

          Data.VehType = S1_Mod.getData().VehType;
          Data.VehMake =  S1_Mod.getData().VehMake;
          Data.VehModel =  S1_Mod.getData().VehModel;
          Data.VehVariant = S1_Mod.getData().VehVariant;
          Data.RegNo =  S1_Mod.getData().RegNo;
          Data.ChassisNo =  S1_Mod.getData().ChassisNo;
          Data.KmCovered = S1_Mod.getData().KMDone;
          Data.VechPurcMonth =  S1_Mod.getData().PurMonth;
          Data.VechPurcYear =  S1_Mod.getData().PurYear;

          Data.FranhiseName =  S1_Mod.getData().FranhiseName;
          Data.FranhisePName =  S1_Mod.getData().FranhisePName;
          Data.FranhiseContact =  S1_Mod.getData().FranhiseContact;
          Data.FranhiseEmail =  S1_Mod.getData().FranhiseEmail;
          Data.FranhiseLoc =  S1_Mod.getData().FranhiseLoc;

          Data.DealerCode =  S1_Mod.getData().Dealar;

       				
		  Data.InspDate=that_S2.DateNew(null);
	/*	  Data.InspCode=that_S2.data.d.InspCode
		  Data.InspectName=that_S2.data.d.InspectName*/
	  
  		 Data.ItemCode = ItemCode;  
		 Data.StnclNumber = StnclNumber;
  		 Data.MouldNo = MouldNo;	 
	  	 Data.VendorCode  = VendorCode;
	  	 Data.PrdMonth    = PrdMonth;
	  	 Data.PrdYear     = PrdYear;
	  	 Data.PrdWeek     = PrdWeek ;
	  	 Data.RevisedDis  = RevisedDis;
	  	 
	  	 Data.Nsd 		  = Nsd ;
    	 Data.AbsoluteDis = AbsoluteDis ;      		
    	 Data.TotalNsd    = TNsd  ;
/*    	 Application
    	 Route
    	 LeadKms
    	 Speed
    	 Mfg
    	 Gvw
    	 FitmentPos
    	 RimProfile
    	 Psi
    	 Payload*/


    /*		var Wear        = '0';*/
	  	 
  
  	
	  	 Data.CodeGrp 	= CodeGrp;
	  	 Data.MajorDefect = MajorDefect;
	  	 Data.MinorCodeGrp= MinorCodeGrp;
	  	 Data.MinorDefect = MinorDefect;
  	
	  	 Data.DisposlDecision = DisposlDecision;
	  	 Data.AdjustmentMode  = AdjustmentMode;
	  	 Data.AwardMode       = AwardMode;
	  	 Data.RejectionReason = RejectionReason;
	  	 Data.PolicyNo        = PolicyNo;
	  	 Data.ItemType        = that.itemType;
	  	 Data.InspectComments = InspecComment;
	  	 Data.SubmNo          = '1';
					

					var sServiceUrl = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV";
					var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
					//oCreateModel1.setHeaders({
					//  "Content-Type": "application/atom+xml"
					//  });
					var fncSuccess = function(oData, oResponse) //sucess function 
					  {
					//  sap.m.MessageBox.show("Ticket:"+oData.ETicketNo+" Updated", {
					//        title: "Success",
					//        icon:sap.m.MessageBox.Icon.SUCCESS,
					//        onClose:function(){
					//          window.history.back();
					//
					//
					//        }
					//    });
					  var _self = that;
					  if(oData.EError=="X"){
					sap.m.MessageBox.show(oData.EMessage, {
					      title: "Error",
					      icon:sap.m.MessageBox.Icon.ERROR,
					          onClose:function(){
					          }
					      });
					  }else{
					    if(that.loEarlyFailure)
					    {
					      var loInspecNumber = oData.InspNo;
					      var loEMessage = oData.EMessage;
					
					    var loImageDialogue = new sap.m.Dialog({
					      title:'Confirm',
					      type:'Message',
					      content:[
			               new sap.m.Label({
			                 text:"Do you want to attach images?"
			               })
			               ],
			               beginButton: new sap.m.Button({
			                 text:'Yes',
			                 enabled:true,
			                 press:function()
			                 {
			                  var _self1 = _self;
			                  var loItemTemplate = new sap.m.UploadCollectionItem({
			                       visibleEdit:false,
			                       visibleDelete:false
			                     });
			                   var loAttachmentDialogue = new sap.m.Dialog({
			                  title:'Confirm',
			                  type:'Message',
			                  content:[
                              new sap.m.UploadCollection("fileUpload",{
                             showSeperators:'All',
                             maximumFileNameLength:'50',
                             multiple:false,
                            visibleEdit:false,
                             visibleDelete:false,
                             fileType:["jpeg","jpg"],
                             noDataText:'No Data',
                             uploadUrl:'/sap/opu/odata/sap/ZCS_INSPECTION_SRV/EarlyFailureImageUploadSet',
                             change:function(e){
                          var m = _self1.getView().getModel();
                              var u = e.getSource();
                              var f = e
                                .getParameter("mParameters").files[0];
                              var t = _self1.sToken
                                || m.getSecurityToken();
                              u.removeAllHeaderParameters();
                              if(e.oSource.aItems.length == 0)
                              var n = loInspecNumber+"@1";
                              else if(e.oSource.aItems.length == 1)
                              var n = loInspecNumber+"@2";
                              else
                                var n = loInspecNumber+"@3";
							    var c = new sap.m.UploadCollectionParameter(
							      {
							       name : "slug",
							       value : n
							      });
							    u.addHeaderParameter(c);
							     var C = new
							     sap.m.UploadCollectionParameter({
							     name : "x-csrf-token",
							     value : t
							     });
							    u.addHeaderParameter(C);
							    var o = new sap.m.UploadCollectionParameter(
							      {
							       name : "content-type",
							       value : "image/jpeg"
							      });
							    u.addHeaderParameter(o);
							                             },
		                             uploadComplete:function(e){
                               var loUpload = sap.ui.getCore().byId("fileUpload");
                               loUpload.aItems[0].setVisibleEdit(false);
                              loUpload.aItems[0].setVisibleDelete(false);
                             var m = _self1.getView().getModel();
 
                             
                             var p = "/EarlyFailureImageUploadSet";
      
                             var t = _self1.getView();
							    m.read(
							        p,
							        null,
							        false,
							        function(b, r) {
							         var d = {
							          Attachments : []
							         };
							         var l = r.data.results.length;
							         for (var i = 0; i < l; i++) {
							          var v = r.data.results[i];
							          var U = v.__metadata.media_src; 
							          var m = U
							            .match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
							          var Url = m[5];
							          var o = {
							           name : v.Filename1,
							           url : Url,
							           fileId : v.Filename,
							          };
							          d.Attachments
							            .unshift(o);
							         }
							         t
							           .byId(
							             'fileupload')
							           .setModel(
							             new sap.ui.model.json.JSONModel(
							               d));
							
							        }, 
					        function(b, r) {
					         if(r.statusText === "OK"){
					             var d = {
					              Attachments : []
					             };
					             var l = r.data.results.length;
					             for (var i = 0; i < l; i++) {
					              var v = r.data.results[i];
					              var U = v.__metadata.media_src;
					              var m = U
					                .match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
					              var Url = m[5];
					              var o = {
					               name : v.Filename1,
					               url : Url,
					               fileId : v.Filename,
					              };
					              d.Attachments
					                .unshift(o);
					             }
					             t
					               .byId(
					                 'fileupload')
					               .setModel(
					                 new sap.ui.model.json.JSONModel(
					                   d));
					        }
					            }
					        );
                             },

                           }),
                           
                           ],
                           beginButton: new sap.m.Button({
                             text:'Ok',
                             enabled:true,
                             press:function()
                             {
                               var_self = _self1;
                              loAttachmentDialogue.close();
                              sap.m.MessageBox.show(loEMessage, {
                                    title: "Success",
                                    icon:sap.m.MessageBox.Icon.SUCCESS,
                                    onClose:function(){
                                      if(oData.DisposlDecision=="A" && oData.SalesOrderFlg=="X"){
                                        sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspOutputFormSet(InspNo='"+loInspecNumber+"')/$value", true);
                                      }
//                                      window.history.back();
                                      var router = sap.ui.core.UIComponent
                                       .getRouterFor(_self1);
                                     var oCrossAppNavigator = sap.ushell.Container
                                       .getService("CrossApplicationNavigation");
                                     oCrossAppNavigator.toExternal({
                                      target : {
                                       shellHash : ""
                                      }
                                     });


                                    }
                                });

                             }
                           }),
                           endButton: new sap.m.Button({
                             text:'Cancel',
                             enabled:true,
                             press:function()
                             {
                               var _self1 = _self;
                              loAttachmentDialogue.close();
                              sap.m.MessageBox.show(loEMessage, {
                                    title: "Success",
                                    icon:sap.m.MessageBox.Icon.SUCCESS,
                                    onClose:function(){
                                      if(oData.DisposlDecision=="A" && oData.SalesOrderFlg=="X"){
                                        sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspOutputFormSet(InspNo='"+loInspecNumber+"')/$value", true);
                                      }
//                                      window.history.back();
                                      var router = sap.ui.core.UIComponent
                                       .getRouterFor(_self);
                                     var oCrossAppNavigator = sap.ushell.Container
                                       .getService("CrossApplicationNavigation");
                                     oCrossAppNavigator.toExternal({
                                      target : {
                                       shellHash : ""
                                      }
                                     });


                                    }
                                });
                             }
                           }),
                           afterClose:function()
                           {
                            loAttachmentDialogue.destroy();
                           }
                })
                loAttachmentDialogue.open();
                   loImageDialogue.close();
                 }
               }),
               endButton: new sap.m.Button({
                 text:'No',
                 enabled:true,
                 press:function()
                 {
                   var _self1 = _self;
                   loImageDialogue.close();
                   sap.m.MessageBox.show(oData.EMessage, {
                      title: "Success",
                      icon:sap.m.MessageBox.Icon.SUCCESS,
                      onClose:function(){
                        if(oData.DisposlDecision=="A" && oData.SalesOrderFlg=="X"){
                          sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspOutputFormSet(InspNo='"+oData.InspNo+"')/$value", true);
                        }
//                        window.history.back();
                        var router = sap.ui.core.UIComponent
                           .getRouterFor(_self1);
                         var oCrossAppNavigator = sap.ushell.Container
                           .getService("CrossApplicationNavigation");
                         oCrossAppNavigator.toExternal({
                          target : {
                           shellHash : ""
                          }
                         });


                      }
                  });
                 }
               }),
               afterClose:function()
               {
                loImageDialogue.destroy();
               }
    })
    loImageDialogue.open();
    that.loEarlyFailure = false;
    }
    else
      {
      sap.m.MessageBox.show(oData.EMessage, {
            title: "Success",
            icon:sap.m.MessageBox.Icon.SUCCESS,
            onClose:function(){
              var _self1 = _self;
              if(oData.DisposlDecision=="A" && oData.SalesOrderFlg=="X"){
                sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspOutputFormSet(InspNo='"+oData.InspNo+"')/$value", true);
              }
//              window.history.back();
              var router = sap.ui.core.UIComponent
                 .getRouterFor(_self1);
               var oCrossAppNavigator = sap.ushell.Container
                 .getService("CrossApplicationNavigation");
               oCrossAppNavigator.toExternal({
                target : {
                 shellHash : ""
                }
               });


            }
        });
      }

  }
  }
var fncError = function(oError) { //error callback function
  var parser = new DOMParser();
  var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
  sap.m.MessageBox.show(message, {
        title: "Error",
        icon:sap.m.MessageBox.Icon.ERROR,
    });
}

//Create Method for final Save
oCreateModel1.create("/SaveInspectionSet", Data, {
  success: fncSuccess,
  error: fncError
});

          },
          
//********************************************************************************************************//*          
          onDecisionChange:function(evt){
        	  debugger
        	  
      //   Check for mandate items
        	var check			 = false;       	
          	var ItemType = that.itemType;        	
          	if(ItemType == "TYRE"){
      		
          		var ItemCode    = this.ItemCode;
          		var StnclNumber = that_S2.getView().byId("idTyreStn").getValue();
          		var MouldNo     = that_S2.getView().byId("idTyreMDNo").getValue();
          		var Nsd         = that_S2.getView().byId("idTyreNsd").getValue();
          		var AbsoluteDis = that_S2.getView().byId("idTyreDis").getValue();        		
          		var TNsd        = that_S2.getView().byId("idTyreTNSD").getValue();
          		var Wear        = that_S2.getView().byId("idTyreWear").getValue();
          		var RevisedDis  = '0';
          		if (StnclNumber != ""){
          			that_S2.onStencilNumberChange();
          		}
          		
          		
          	}else{
          		var ItemCode    = this.ItemCode;
          		var StnclNumber = that_S2.getView().byId("idTyreStnTube").getValue();
          		var MouldNo     = that_S2.getView().byId("idTubeMDNo").getValue();
          		var VendorCode  = this.VendCode;
          		var PrdMonth    = that_S2.getView().byId("idMonth").getSelectedKey();
          		var PrdYear     = that_S2.getView().byId("idYear").getValue();
          		var RevisedDis  = that_S2.getView().byId("idInstubeDic").getValue();
          		var Nsd         = '0';
          		var AbsoluteDis = '0';       		
          		var TNsd        = '0';
          		var Wear        = '0';
          	}
          	
          	var CodeGrp 	= this.MjCode;
          	var MajorDefect = this.MjDef; 
          	
          	if(ItemType == "TYRE"){
          	  if(ItemCode == ""){
          		 check = true;
          		 this.getView().byId("idItemCodeTyre").setValueState(sap.ui.core.ValueState.Error);
          	  }else {
          		 this.getView().byId("idItemCodeTyre").setValueState(sap.ui.core.ValueState.None);
          	  } 
          		
           	  if(StnclNumber  == ""){
           		 check = true;
           		 this.getView().byId("idTyreStn").setValueState(sap.ui.core.ValueState.Error);
           	  }else {
           		 this.getView().byId("idTyreStn").setValueState(sap.ui.core.ValueState.None);
           	  } 
          	  
           	  if(MouldNo == ""){
              		 check = true;
              		 this.getView().byId("idTyreMDNo").setValueState(sap.ui.core.ValueState.Error);
              	  }else {
              		 this.getView().byId("idTyreMDNo").setValueState(sap.ui.core.ValueState.None);
              	  } 
           	  
           	  if(Nsd == ""){
            		 check = true;
            		 this.getView().byId("idTyreNsd").setValueState(sap.ui.core.ValueState.Error);
            	  }else {
            		 this.getView().byId("idTyreNsd").setValueState(sap.ui.core.ValueState.None);
            	  } 
           	  
           	  if(AbsoluteDis == ""){
             		 check = true;
             		 this.getView().byId("idTyreDis").setValueState(sap.ui.core.ValueState.Error);
             	  }else {
             		 this.getView().byId("idTyreDis").setValueState(sap.ui.core.ValueState.None);
             	  }  
          	}else{          		
            if(ItemCode == "" || ItemCode == undefined){
           		 check = true;
           		 this.getView().byId("idTubeCode").setValueState(sap.ui.core.ValueState.Error);
           	  }else {
           		 this.getView().byId("idTubeCode").setValueState(sap.ui.core.ValueState.None);
           	  } 	 
            	               	  
             	 if(RevisedDis == ""){
            		 check = true;
            		 this.getView().byId("idInstubeDic").setValueState(sap.ui.core.ValueState.Error);
            	  }else {
            		 this.getView().byId("idInstubeDic").setValueState(sap.ui.core.ValueState.None);
            	  }  
            	  
           	  if(VendorCode  == "" || VendorCode == undefined){
           		 check = true;
           		 this.getView().byId("idTube_venCode").setValueState(sap.ui.core.ValueState.Error);
           	  }else {
           		 this.getView().byId("idTube_venCode").setValueState(sap.ui.core.ValueState.None);
           	  } 
             	  
             	  if(MouldNo  == ""){
             		 check = true;
             		 this.getView().byId("idTubeMDNo").setValueState(sap.ui.core.ValueState.Error);
             	  }else {
             		 this.getView().byId("idTubeMDNo").setValueState(sap.ui.core.ValueState.None);
             	  } 
    
            	  
             if(PrdMonth  == "" || PrdMonth  == "00"){
           		 check = true;
           		 this.getView().byId("idMonth").addStyleClass("myStateError");
           	  }else {
           		 this.getView().byId("idMonth").removeStyleClass("myStateError");
           	  } 
             	  
             	  if(PrdYear == ""){
              		 check = true;
              		 this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.Error);
              	  }else {
              		 this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.None);
              	  } 
            	  
          	}
          		
           	  if(CodeGrp == "" || CodeGrp == undefined){
             		 check = true;
             		 this.getView().byId("idinsMjCdGp").setValueState(sap.ui.core.ValueState.Error);
             	  }else {
             		 this.getView().byId("idinsMjCdGp").setValueState(sap.ui.core.ValueState.None);
             	  } 	
          	
           	  if(MajorDefect == "" || MajorDefect == undefined){
              		 check = true;
              		 this.getView().byId("idinsMjDc").setValueState(sap.ui.core.ValueState.Error);
              	  }else {
              		 this.getView().byId("idinsMjDc").setValueState(sap.ui.core.ValueState.None);
              	 } 
          
            	
       	if (check == true){
  	 /*		sap.m.MessageBox.show("Please fill all Required Fields.", {
  	       title: "ERROR",
  	       icon:sap.m.MessageBox.Icon.ERROR,
  	 		});*/
  	 		that_S2.getView().byId("idInsDD").setSelectedKey();
  	 		return;
       	}      
      // 	End of mandate check
        	  
        	  
        	if(this.getView().byId("idTyreWear").getValue() < 25){
        		this.getView().byId("Id_EntButton").setEnabled(true);
        	}else{
        		this.getView().byId("Id_EntButton").setEnabled(false);
        	}
            var key=evt.getSource().getSelectedKey();
            
            if(key=="A"){
            	
              that_S2.getView().byId("lbladj").setRequired(true);
              that_S2.getView().byId("lbladj").setVisible(true);
              that_S2.getView().byId("idInsAdjm").setVisible(true);
              that_S2.getView().byId("idInsAdjm").setEnabled(true).setSelectedKey();              
              that_S2.getView().byId("lblrej").setVisible(false).setRequired(false);
              that_S2.getView().byId("idInsRegRes").setVisible(false);
              that_S2.getView().byId("idInsRegRes").setEnabled(false).setSelectedKey();

              
            }else if(key=="R"){
            	
              that_S2.getView().byId("lbladj").setRequired(false);
              that_S2.getView().byId("lbladj").setVisible(false);
              that_S2.getView().byId("idInsAdjm").setVisible(false);
              that_S2.getView().byId("idInsAdjm").setEnabled(false).setSelectedKey();
              that_S2.getView().byId("lblaw").setVisible(false);
              that_S2.getView().byId("idInsAwdm").setVisible(false);
              that_S2.getView().byId("idInsAwdm").setEnabled(false).setSelectedKey();
              that_S2.getView().byId("lblrej").setVisible(true).setRequired(true);
              that_S2.getView().byId("idInsRegRes").setVisible(true);
              that_S2.getView().byId("idInsRegRes").setEnabled(true).setSelectedKey();

              
              if (this.MjCode == "Z2WADDEF" || this.MjCode == "ZBTADDEF" || this.MjCode == "ZRTADDEF")
            	 {
            	  sap.m.MessageBox.show("Adjustable Defect cannot be Rejected.", {
            		  title : "Error",
                      icon : sap.m.MessageBox.Icon.ERROR,
            	  });
            	  that_S2.getView().byId("idInsDD").setSelectedKey();
            	 }
            }
          },
          
          onAwardChange:function(evt){
            var key=evt.getSource().getSelectedKey();
            if(key){
            	that_S2.getView().byId("lblaw").setVisible(true);
            	that_S2.getView().byId("idInsAwdm").setVisible(true);
                that_S2.getView().byId("idInsAwdm").setEnabled(true).setSelectedKey();
            }
            
            // ********** addition calidation *********//
            if(this.MjCode == "ZFNADDEF" || this.MjCode == "ZNANDDEF" || this.MjCode == "ZNANDDEF" 
            	|| this.MjCode == "ZTNADDEF" || this.MjCode == "Z2WNADEF"
            	|| this.MjCode == "ZBRNADEF" || this.MjCode == "ZNANDDEF"){
            	if(key=="TEC"){
            		 sap.m.MessageToast.show("Adjustment mode can not be Technical");
            		this.getView().byId("idInsAdjm").setSelectedKey();
            		return;
            	}            	
            }
            
            if(key=="POL" ||key=="TEC" && that.itemType == 'TYRE'){
            	that_S2.getView().byId("lblpol").setVisible(true);
                that_S2.getView().byId("idInsPlc").setVisible(true).setEnabled(true).setShowValueHelp(true);
            }
            else{
            	that_S2.getView().byId("lblpol").setVisible(false);
                that_S2.getView().byId("idInsPlc").setVisible(false).setShowValueHelp(false).setEnabled(false);
            }
            
            
         // ********** end addition calidation *********//
            
     /*       if(key=="POL" ||key=="TEC"){
              if(that_S2.data.d.ItemType=="TYRE"){
                if(that_S2.claimTyp!="ND"){
                that_S2.getView().byId("idInsPlc").setShowValueHelp(true);
                that_S2.getView().byId("idInsPlc").setEnabled(true)
                }
              }else{
                that_S2.getView().byId("idInsPlc").setShowValueHelp(false);
              }
            }else {
              that_S2.getView().byId("idInsPlc").setEnabled(false)
            }*/
          },
          
          //start Policy No f4
          InsPolicyHelp:function(){
          
          var Item 	= this.ItemCode;
          var Cgrp 	= this.MjCode;
          var Cdef 	= this.MjDef;
          var Wear 	= that_S2.getView().byId("idTyreWear").getValue();
          var Ftyp 	= S1_Mod.getData().FitType;
          var Ctyp 	= S1_Mod.getData().ClaimType ;
          var Cdep 	= S1_Mod.getData().ClaimDepo ;
          var Deal  = S1_Mod.getData().Dealar ;
          var Awad 		= that_S2.getView().byId("idInsAwdm").getSelectedKey(); 
          var Pweek 	= that_S2.getView().byId("idProdWeek").getValue();
          var Pyear 	= that_S2.getView().byId("idProdYear").getValue();
          var Pmonth 	= that_S2.getView().byId("idPdMon").getValue();
          var PCat 		= this.prdcat;
          var SaleDate  = S1_Mod.getData().SaleDate;
           if(SaleDate!="" && SaleDate!=undefined){
        	  SaleDate = SaleDate+"T00:00:00"  
           }
           else{
        	  var Date1 = new Date();
              var month = Date1.getMonth() + 1;
              var date  = Date1.getDate();
              if (month.toString().length < 2) {
                month = "0" + month.toString();
              }
              if (date.toString().length < 2) {
                date = "0" + date.toString();
              }
              var SaleDate = Date1.getFullYear()  + '-' + month + '-' + date + "T00:00:00";              
            }     	  
        	  
          debugger
          var url="/sap/opu/odata/sap/ZCS_INSPECTION_SRV/GetPolicyMasterSet?$filter=IClaimRecDepo eq '"+Cdep+"' and IClaimTyp eq '"+Ctyp+"' and ICodeGrp eq '"+Cgrp+"' and IDealerCode  eq '"+Deal+"' and IItemCode eq '"+Item+"' and IMajorDefect eq '"+Cdef+"' and IFitType eq '"+Ftyp+"' and AwardMode eq '"+Awad+"' and ProdCat eq '"+PCat+"' and ProdWeek eq '"+Pweek+"' and ProdYear eq '"+Pyear+"' and ProdMonth eq '"+Pmonth+"' and SaleInvDt eq datetime'"+SaleDate+"' and IWear eq '"+Wear+"'";
         
      var jModel = new sap.ui.model.json.JSONModel();
          jModel.loadData(url, null, false,"GET",false, false, null);
      
      var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({
            title: "Policy No",
            items: {
            path: "/d/results",
            template: new sap.m.StandardListItem({
            title: "Policy No: {PolicyNo}",
            description:"Document: {PolicyDocument}",
            customData: [new sap.ui.core.CustomData({
            key: "key",
            value: "{ReplaceItemCode}"
            })],
            }),
            },
            liveChange: function(oEvent) {
                var sValue  = oEvent.getParameter("value");
                var oFilter = new sap.ui.model.Filter("Nsd",sap.ui.model.FilterOperator.Contains,sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            confirm: [this._handlepolClose, this],
            cancel:  [this._handlepolClose, this]
        });
     
       _valueHelpFranchSelectDialog.setModel(jModel);
       _valueHelpFranchSelectDialog.open();
        },
    
        //end Policy No f4
     
        
        _handlepolClose: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                
                this.getView().byId("idInsPlc").setValue(oSelectedItem.getBindingContext().getObject().PolicyNo);
                this.getView().byId("idInsPlcDis").setValue(oSelectedItem.getBindingContext().getObject().Discount);
                this.getView().byId("idInsRepItm").setValue(oSelectedItem.getBindingContext().getObject().ReplaceItemCode);
                this.getView().byId("idInsWar").setSelected(oSelectedItem.getBindingContext().getObject().WrntReqFlag);
                this.getView().byId("idPolicyDoc").setValue(oSelectedItem.getBindingContext().getObject().PolicyDocument);
            }
        
        },

          DateNew:function(Date1){
        	if(Date1===null){
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

 //****************************************************************************************************************         
            onFranch:function(){
               var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpNsdTyreSet?$filter=ItemCode eq '"+that_S2.data.d.ItemCode+"' and PrdtCat eq '"+that_S2.data.d.PrdtCat+"'";
              var jModel = new sap.ui.model.json.JSONModel();
              jModel.loadData(sPath, null, false,"GET",false, false, null);
            var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({

                title: "NSD",
                items: {
                    path: "/d/results",
                    template: new sap.m.StandardListItem({
                        title: "NSD: {Nsd}",
                       description:"% Wear:{PercentageWear}",
                        customData: [new sap.ui.core.CustomData({
                            key: "Key",
                            value: "{PercentageWear}"
                        })],
                       
                    }),
                },
                liveChange: function(oEvent) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new sap.ui.model.Filter("Nsd",sap.ui.model.FilterOperator.Contains,sValue);
                    oEvent.getSource().getBinding("items").filter([oFilter]);
                },
                confirm: [this._handlefranchClose, this],
                cancel: [this._handlefranchClose, this]
            });
            _valueHelpFranchSelectDialog.setModel(jModel);
           _valueHelpFranchSelectDialog.open();
            },
            _handlefranchClose: function(oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    
                    this.getView().byId("idTyreNsd").setValue(oSelectedItem.getBindingContext().getObject().Nsd);
                    this.getView().byId("idTyreWear").setValue(oSelectedItem.getBindingContext().getObject().PercentageWear);
                    this.getView().byId("idTyreTNSD").setValue(oSelectedItem.getBindingContext().getObject().TotNsd);
                    this.getView().byId("idTyreDis").setValue(100-oSelectedItem.getBindingContext().getObject().PercentageWear);
                    this.getView().byId("idInsFDis").setValue(100-oSelectedItem.getBindingContext().getObject().PercentageWear);
                    if(parseFloat(oSelectedItem.getBindingContext().getObject().PercentageWear)<25){
                      that_S2.getView().byId("Id_EntButton").setVisible(true);
                      that.loEarlyFailure = true;
                    }else{
                      that_S2.getView().byId("Id_EntButton").setVisible(false);
                    }
                }
            
            },
            
 //******************************************************************************************************           
            onVend:function(){
               var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpVendorTubeFlapSet";
              var jModel = new sap.ui.model.json.JSONModel();
              jModel.loadData(sPath, null, false,"GET",false, false, null);
            var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({

                title: "Vendor",
                items: {
                    path: "/d/results",
                    template: new sap.m.StandardListItem({
                        title: "{VendorName}",
                       description:"{VendorCode}",
                        customData: [new sap.ui.core.CustomData({
                            key: "Key",
                            value: "{VendorCode}"
                        })],
                       
                    }),
                },
                liveChange: function(oEvent) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new sap.ui.model.Filter("VendorName",sap.ui.model.FilterOperator.Contains,sValue);
                    oEvent.getSource().getBinding("items").filter([oFilter]);
                },
                confirm: [this._handlefranchClose1, this],
                cancel: [this._handlefranchClose1, this]
            });
            _valueHelpFranchSelectDialog.setModel(jModel);
           _valueHelpFranchSelectDialog.open();
            },
            _handlefranchClose1: function(oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    
                this.getView().byId("idTube_venCode").setValue(oSelectedItem.getTitle()+" ("+oSelectedItem.getDescription()+")");
                that_S2.vendorcc=oSelectedItem.getDescription();
                that_S2.vendorName=oSelectedItem.getTitle();
               // this.getView().byId("idTube_venCode").setValue(oSelectedItem.getTitle()); 
//                this.getView().byId("idTube_venCode").setValue(oSelectedItem.getDescription()); 
             /*   var stencile= that_S2.vendorcc+that_S2.getView().byId("idMDNo").getValue()+that_S2.getView().byId("idPdMonTubeinsp").getValue();
                that_S2.getView().byId("idTyreStnTube").setValue(stencile);*/
                
           	 var MouldNo     = that_S2.getView().byId("idTubeMDNo").getValue();
        	 var PrdMonth    = that_S2.getView().byId("idMonth").getSelectedKey();
        	 var PrdYear     = that_S2.getView().byId("idYear").getValue();
        	 var StnclNumber = that_S2.vendorcc + "-" + MouldNo + "-" + PrdMonth + "-" + PrdYear.substring(2,2);
        	 that_S2.getView().byId("idTyreStnTube").setValue(StnclNumber);  
        	 this.VendCode = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();   
                }
            
            },
            
//**************************************************************************************************************            
            onProdMonth:function(evt){
              var value=evt.getSource().getValue();
              if(value.length==4){
                var date =new Date();
                var month=date.getMonth()+1;
                var year=date.getYear().toString().slice(-2);
                var selMonth=value.substring(0, 2);
                var selYear=value.slice(-2);
                if(selYear>year){
                  sap.m.MessageToast.show("Cannot select Future Year");
                  evt.getSource().setValue();
                  return
                }
                if(selMonth>"12"){
                  sap.m.MessageToast.show("Cannot select Future Month");
                  evt.getSource().setValue();
                  return
                }
                if(selYear==year){
                  if(selMonth>month ||selMonth>"12"){
                    sap.m.MessageToast.show("Cannot select Future Month");
                    evt.getSource().setValue();
                    return
                  }
                  else{
                    var stencile= that_S2.vendorcc+that_S2.getView().byId("idMDNo").getValue()+value;
                    that_S2.getView().byId("idTyreStnTube").setValue(stencile);
                  that_S2.getView().byId("idPdMonTube").setValue(selMonth);
                  that_S2.getView().byId("idProdYearTube").setValue(selYear);
                  }
                }else{
                  var stencile= that_S2.vendorcc+that_S2.getView().byId("idMDNo").getValue()+value;
                  that_S2.getView().byId("idTyreStnTube").setValue(stencile);
                  that_S2.getView().byId("idPdMonTube").setValue(selMonth);
                  that_S2.getView().byId("idProdYearTube").setValue(selYear);
                }

              }else{
                sap.m.MessageToast.show("Select proper month and Dates");
                evt.getSource().setValue();
                return
              }

            },
            
            /**/
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
            /**/
        	
            onFragment:function(){
              if (!this._EntriesHelpDialog) {
              this._EntriesHelpDialog = sap.ui.xmlfragment(
                "com.acute.spinsp.view.Entries", this);
              this.getView().addDependent(this._EntriesHelpDialog);

            }
              this._EntriesHelpDialog.open();
            },
            onTabelFilterOk : function(evt)
            {
              that.loApplication = sap.ui.getCore().byId("idEarApp").getValue();
              that.loRoute 		 = sap.ui.getCore().byId("idEarRou").getValue();
              that.loLeadKms 	 = sap.ui.getCore().byId("idEarLed").getValue();
              that.loSpeed 		 = sap.ui.getCore().byId("idEarSped").getValue();
              that.loConMfg 	 = sap.ui.getCore().byId("idEarCon").getValue();
              that.loGvw   		 = sap.ui.getCore().byId("idEarGvw").getValue();
              that.loFitment 	 = sap.ui.getCore().byId("idEarFpos").getSelectedKey();
              that.loRimProfile  = sap.ui.getCore().byId("idEarRim").getValue();
              that.loPsi 		 = sap.ui.getCore().byId("idEarPSI").getValue();
              that.loPayload 	 = sap.ui.getCore().byId("idEarPay").getValue();
              this._EntriesHelpDialog.close();
            },
            
  /*          onModuleSubmit:function(){
              var stencile= that_S2.vendorcc+that_S2.getView().byId("idMDNo").getValue()+that_S2.getView().byId("idPdMonTubeinsp").getValue();;
              that_S2.getView().byId("idTyreStnTube").setValue(stencile);
            },*/
            
            onReviseDis:function(evt){
            	debugger
              var value=evt.getSource().getValue();
              if(parseFloat(value)>100){
                sap.m.MessageToast.show("Value Cannot be more than 100");
                evt.getSource().setValue()
                return
              }var finalvalue=100-parseFloat(value);
      
              that_S2.getView().byId("idWeTubeInsp").setValue(finalvalue);
              /*that_S2.getView().byId("idInsFDis").setValue(value);*/

            },getRouter: function() {
                   return new sap.ui.core.UIComponent.getRouterFor(this);
               },
               
                            
               onNSD:function(evt){
               	debugger
                 var value=evt.getSource().getValue();
                 if(parseFloat(value)>100){
                   sap.m.MessageToast.show("NSD Cannot be more than 100");
                   evt.getSource().setValue()
                   return
                 }
                 var totnsd = that_S2.getView().byId("idTyreTNSD").getValue();
                 if(parseFloat(value)>totnsd){
                     sap.m.MessageToast.show("NSD cannot be more than Total NSD");
                     evt.getSource().setValue()
                     return
                  }
                 
                 var value1 = totnsd - value;
                 var value1 = ( value1 / totnsd ) * 100;
                 var value2 = 100 - value1;
                 
                 
   /*              var wear1 = value1.split(".")[0];
                 var wear2 = value1.split(".")[1];
                 var wear3 = wear2.substring(0,2);
                 var fwear = wear1 + "." + wear3;
                 
                 var dis1 = value2.split(".")[0];
                 var dis2 = value2.split(".")[1];
                 var dis3 = dis2.substring(0,2);
                 var fdis = dis1 + "." + dis3;*/
                 
                 that_S2.getView().byId("idTyreWear").setValue(value1.toFixed(2));
                 that_S2.getView().byId("idTyreDis").setValue(value2.toFixed(2));
                 
               },getRouter: function() {
                      return new sap.ui.core.UIComponent.getRouterFor(this);
                  },               
               
/*********************By RKS**********************************/
               onPressBackView : function(evt){
            	   debugger;
          		sap.m.MessageBox.show("Are sure want to back", {
          			 icon: sap.m.MessageBox.Icon.INFORMATION,
          			 title: "Confirmation",
          			  actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
          			  onClose: function(oAction) { 
          			   if (oAction === MessageBox.Action.YES) {
          				   
          				 that_S2.getView().byId('idTubeCode').setValue("");
          				 that_S2.getView().byId('idInstubeDic').setValue("");
          				 that_S2.getView().byId('idTube_venCode').setValue("");
          				 that_S2.getView().byId('idTubeMDNo').setValue("");
//          			 that_S2.getView().byId('idPdMonTubeinsp').setValue("");
          				 that_S2.getView().byId('idinsMjCdGp').setValue("");
          				 that_S2.getView().byId('idinsMnCdGp').setValue("");
          				 that_S2.getView().byId('idInsDD').setValue("");
          				that_S2.getView().byId('idInsComment').setValue("");
          				that_S2.getRouter().navTo("S1");
          			  }
          			 }
          		 }
          	 );
          		//} 
          },               
               
/***********************************************************************************/
        });
});