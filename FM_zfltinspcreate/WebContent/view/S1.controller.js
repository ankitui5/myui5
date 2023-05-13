jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("zfltinspcreate.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

var DataArticles, that, kunnr, kunnrname, hubName, EnrolMode, hubCode;
var ProdSizeJModel;

sap.ui.core.mvc.Controller.extend("zfltinspcreate.view.S1",
{
 
onInit : function() { 
			debugger
            this.newBusy = new sap.m.BusyDialog(); 

            this.model = this.getOwnerComponent().getModel();

            that = this;
			
            if (!jQuery.support.touch) {
              this.getView().addStyleClass("sapUiSizeCompact");
            }
            if (sap.ui.Device.system.desktop) {

            }
            this.onMechanicalCon();
            var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
            var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
            oReadModel.setHeaders({"Content-Type" : "application/json"});
            
            var fncSuccess = function(oData, oResponse){
              

              if(oData.results.length==0 ){
                sap.m.MessageBox.show("You are not registered to any Fleet", {
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
                  var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_User_Fleet_HubSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'and CKunnr  eq '"+that.FleetData.results[0].Kunnr+"'";
                  jModel = new sap.ui.model.json.JSONModel();
                  jModel.loadData(sPath, null, false, "GET", false, false, null);

                }else{
                  if (!that._FleetDialog) {
                    that._FleetDialog = sap.ui.xmlfragment("zfltinspcreate.view.Intial", that);
                    that.getView().addDependent(that._FleetDialog);}
                  	
                  	var obj = that._FleetDialog.open();
					obj.setEscapeHandler(function(obj){
						obj.reject();
					});
                }

                if(jModel.getData().d.results.length != "1"){
                if (!that._FleetDialog) {
                	that._FleetDialog = sap.ui.xmlfragment("zfltinspcreate.view.Intial", that);
                	that.getView().addDependent(that._FleetDialog);}
	                
                	var obj = that._FleetDialog.open();
					obj.setEscapeHandler(function(obj){
						obj.reject();
					});
                }else{
                	hubCode = jModel.getData().d.results[0].HubCode;
                	hubName = jModel.getData().d.results[0].HubName;
                	var finalHeaderText = that.getView().byId("HeaderIdTit").getText() +" ("+hubName+")"; 
                	that.getView().byId("HeaderIdTit").setText(finalHeaderText);
                }
                }
            }

            var fncSuccess1 = function(oData, oResponse){
              
              
              that.nonjkSelect = new sap.m.Select({change:[that.onCompanyChange,that],forceSelection:false,visible:false,enabled:false});
              that.nonjkSelect1= new sap.m.Select({change:[that.onCompanyChange1,that],forceSelection:false,visible:true,});
              
              var jModel = new sap.ui.model.json.JSONModel(oData.results);

              that.nonjkSelect.unbindAggregation("items");
              that.nonjkSelect1.unbindAggregation("items");
              
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
            
            var fncSuccess2 = function(oData, oResponse){															// september 5
				
				that.tyresize = new sap.m.Select({change:[that.onTyreSizeChange,that],forceSelection:false ,visible:true});
				var jModel    = new sap.ui.model.json.JSONModel(oData.results);

				that.tyresize.unbindAggregation("items");
				that.tyresize.setModel(jModel);
				
				that.tyresize.bindAggregation("items", {
						path: "/",
						template: new sap.ui.core.Item({
							key: "{ProdSize}",
							text: "{ProdDesc}"
						})
					});
				}
			
            
            var fncError = function(oError) { // error callback

				var parser = new DOMParser();
				var message = parser.parseFromString(oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML;
				
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
            
            oReadModel.read("/F4ProdSizeSet", {
				success : fncSuccess2,
				error : fncError
			});
            
          //set date limit on fitment date picker. Also, disable manual entry.
            var date = new Date();
            this.getView().byId("FFitmentDateEdit").setMaxDate(date);

            var fitdate = this.getView().byId("FFitmentDateEdit");
            fitdate.addDelegate({
            		onAfterRendering: function() {
            		fitdate.$().find('INPUT').attr('disabled', true);
            	  }
            	}, fitdate);

          },
//////////////////////////////////////////////////////////////////////////////////////////////////

NumHyphen: function(oEvent){
            var text = oEvent.getSource().getValue();
            var code = text.charCodeAt(text.length-1);
                       
              if(text.length == 1){
                  if ( !(code > 47 && code < 58) && !(code == 45) ) 
                    {
                    text = text.substring( 0 , text.length - 1 );
                    }

              }else if(text.length > 1){
                    if ( !(code > 47 && code < 58) && !(code == 46) ){ //point
                      text = text.substring( 0 , text.length - 1 );
                    }

                    if(text.charCodeAt(text.length-3)==46 ){
                            if(text.charCodeAt(text.length-2)==46)
                                text = text.substring( 0 , text.length - 1 );

                            if(text.charCodeAt(text.length-1)==46)
                                text = text.substring( 0 , text.length - 1 );

                    }

                    if(text.charCodeAt(text.length-2)==46 ){

                        if(text.charCodeAt(text.length-1)==46)
                              text = text.substring( 0 , text.length - 1 );
                    }

                  if(text.charCodeAt(text.length-4)==46)
                          text = text.substring( 0 , text.length - 1 );
              }

                oEvent.getSource().setValue(text);

      },
//////////////////////////////////////////////////////////////////////////////////////////////////

onMecCon:function(evt){
            var key=evt.getSource().getSelectedKey();
            if(key=="Y"){
              this.getView().byId("idReason").setVisible(false);
              this.getView().byId("idReasonlbl").setVisible(false);

            }else{
              this.getView().byId("idReason").setVisible(true);
              this.getView().byId("idReasonlbl").setVisible(true);
            }
          },
//////////////////////////////////////////////////////////////////////////////////////////////////

onMechanicalCon:function(){
            var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Mechanical_ReasonSet";
            var selectreas=that.getView().byId("idReason");
            var jModel = new sap.ui.model.json.JSONModel();
            jModel.loadData(sPath, null, false, "GET", false, false, null);
            if(jModel.getData().d.results.length){
	              selectreas.unbindAggregation("items");
	
	              selectreas.setModel(jModel);
	              selectreas.bindAggregation("items", {
	                  path: "/d/results",
	                  template: new sap.ui.core.Item({
	                    key: "{CondReason}",
	                    text: "{Desc}"
	                  })
	                });

            }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
onRotationChange:function(evt){
	        debugger
            var key=evt.getSource().getSelectedKey();
            var table=that.data.ContractType=="CPKM"?that.getView().byId("tblDetail"):that.getView().byId("tblDetail1");
            var coloum=that.data.ContractType=="CPKM"?that.getView().byId("idnewPos"):that.getView().byId("idnewPos1");
            coloum.setVisible(true);
            
            if(key=="A"){
              for(var i=0;i<table.getItems().length;i++){
                if(table.getItems()[i].getBindingContext().getObject().RemoveOk != 'R'){
                	table.getItems()[i].getCells()[1].setVisible(true);
                	table.getItems()[i].getCells()[1].setEnabled(false);
                	table.getItems()[i].getCells()[1].setEditable(false).setValue(table.getItems()[i].getBindingContext().getObject().RotationPos).setShowValueHelp(false);
                  }else{	
                	  table.getItems()[i].getCells()[1].setValue(""); 
                	  table.getItems()[i].getCells()[1].setVisible(false);
                  }
                                
                if(table.getItems()[i].getBindingContext().getObject().Zposition=='STP'){
                	table.getItems()[i].getCells()[1].setValue(""); 
              	   table.getItems()[i].getCells()[1].setVisible(false);
                }                
              }
            }else if(key=="M"){
              for(var i=0;i<table.getItems().length;i++){
                if(table.getItems()[i].getBindingContext().getObject().RemoveOk != 'R'){
                  table.getItems()[i].getCells()[1].setVisible(true);
                  table.getItems()[i].getCells()[1].setEnabled(true);
                  table.getItems()[i].getCells()[1].setEditable(true).setValue().setShowValueHelp(true);
                }
                else{
              	  table.getItems()[i].getCells()[1].setValue().setVisible(false); 
                }
                
                if(table.getItems()[i].getBindingContext().getObject().Zposition=='STP'){
                	table.getItems()[i].getCells()[1].setValue(""); 
              	   table.getItems()[i].getCells()[1].setVisible(false);
                }
              }

            }else{
              coloum.setVisible(false);
            }
          },
//////////////////////////////////////////////////////////////////////////////////////////////////
validateRotation: function(pos){
          var table = that.data.ContractType=="CPKM"? that.getView().byId("tblDetail"): that.getView().byId("tblDetail1");
          var coloum= that.data.ContractType=="CPKM"? that.getView().byId("idnewPos"): that.getView().byId("idnewPos1");

          

          for(var i=0 ; i<table.getItems().length-1 ; i++){
            var val1 = table.getItems()[i].getCells()[1].getValue();
            if (val1==pos){
              sap.m.MessageToast.show("Position "+pos+" already Selected")
              table.getItems()[i].getCells()[1].setValue();
              return
            }
          }

        },
//////////////////////////////////////////////////////////////////////////////////////////////////
        onCompanyChange: function(evt){																		// september 5
		    
		    var obj = evt.getSource().getParent().getBindingContext().getObject();
			obj.NonJkCompany=evt.getParameter("selectedItem").getKey();
			
			var key=evt.getSource().getSelectedKey();
			that.selectedCompanyKey = key;						
			
			var owner = evt.getSource().getParent().getParent().getCells()[2].getItems()[0].getSelectedKey();
			evt.getSource().getParent().getParent().getCells()[2].getItems()[0].setValueState("None");
			if(owner==""){
				sap.m.MessageToast.show("Select Owner");
				evt.getSource().setSelectedKey("");
				evt.getSource().getParent().getParent().getCells()[2].getItems()[0].setValueState("Error");
				return;
			}
			
			evt.getSource().getParent().getParent().getCells()[3].setShowValueHelp(true).setValue("");
			evt.getSource().getParent().getParent().getCells()[4].setShowValueHelp(true).setValue("");
			evt.getSource().getParent().getParent().getCells()[5].setShowValueHelp(true).setValue("");
			evt.getSource().getParent().getParent().getCells()[8].setType("Reject");
			
			obj.ItemCode="";
			obj.ItemDesc="";
			obj.StnclNumber="";	
			obj.TyreType="";
			obj.TyreLoc="";
			obj.IpCondition="";
			obj.IpPsi="";
			obj.OrigNsd="";
			obj.G1Nsd="";
			obj.G2Nsd="";
			obj.G3Nsd="";
			obj.G4Nsd="";
			obj.Remarks="";
			
			var len = obj.VitemToServiceNvg.results.length;
			for(var i=0;i<len;i++){
				obj.VitemToServiceNvg.results[i].ServiceSelect = "";
			}
	
	
            },

//////////////////////////////////////////////////////////////////////////////////////////////////
			
			onTyreSizeChange:function(evt){
				var key=evt.getSource().getSelectedKey();
				var tyre_company;	
				
				evt.getSource().getParent().getBindingContext().getObject().ProdSize = key;
				
				evt.getSource().getParent().getCells()[3].setShowValueHelp(true).setValue();
				evt.getSource().getParent().getCells()[4].setShowValueHelp(true).setValue();
				
				evt.getSource().getParent().getBindingContext().getObject().ItemCode="";
				evt.getSource().getParent().getBindingContext().getObject().StnclNumber="";	
			
				
				if(that.flg==0){
					evt.getSource().getParent().getCells()[1].getItems()[0].setValueState("None");
					evt.getSource().getParent().getCells()[1].getItems()[1].setValueState("None");
					owner = evt.getSource().getParent().getCells()[1].getItems()[0].getSelectedKey();
					
					if (owner=='01'){
						tyre_company = "JK";
					}else{
						tyre_company = evt.getSource().getParent().getCells()[1].getItems()[1].getSelectedKey();
					 }	
					
					if(owner==""){
						sap.m.MessageToast.show("Select Owner");
						evt.getSource().setSelectedKey("");
						evt.getSource().getParent().getCells()[1].getItems()[0].setValueState("Error");
						return;
					}else{
						if(	owner=="02" && tyre_company==""){
							sap.m.MessageToast.show("Select Company");
							evt.getSource().setSelectedKey("");
							evt.getSource().getParent().getCells()[1].getItems()[1].setValueState("Error")
							return;
						}
					}
					
				}else{	
					owner="02";
					tyre_company = evt.getSource().getParent().getCells()[1].getSelectedKey();
					evt.getSource().getParent().getCells()[1].setValueState("None");
						if(tyre_company==""){
							sap.m.MessageToast.show("Select Company");
							evt.getSource().setSelectedKey("");
							evt.getSource().getParent().getCells()[1].setValueState("Error");
							return;
						}
				}
				
			},					
//////////////////////////////////////////////////////////////////////////////////////////////////
          onHubFragment:function(){
            var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_User_Fleet_HubSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'and CKunnr  eq '"+sap.ui.getCore().byId("idFleet").getName()+"'";
            var jModel = new sap.ui.model.json.JSONModel();
            jModel.loadData(sPath, null, false, "GET", false, false, null);
            if(jModel.getData().d.results.length){
            var _valueHelpHubelectDialog = new sap.m.SelectDialog(
                {

                  title : "Select Hub",
                  items : {
                    path : "/d/results",
                    template : new sap.m.StandardListItem(
                        {
                          title : "{HubName}",
                          Description:"{HubCode}",
                          customData : [ new sap.ui.core.CustomData(
                              {
                                key : "Key",
                                value : "{HubCode}"
                              }) ],

                        }),
                  },
                  liveChange : function(oEvent) {
                  var sValue = oEvent.getParameter("value");

                  var oFilter  = new sap.ui.model.Filter("HubName",sap.ui.model.FilterOperator.Contains,sValue);
                  var oFilter2 = new sap.ui.model.Filter("HubCode",sap.ui.model.FilterOperator.Contains,sValue);
     
                  var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
                  oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
                  },
                  confirm : [ this._handleHubClose, this ],
                  cancel : [ this._handleHubClose, this ]
                });
            _valueHelpHubelectDialog.setModel(jModel);
            _valueHelpHubelectDialog.open();
            }else{
              sap.m.MessageToast.show("Your not authorised for any Hub in Fleet "+sap.ui.getCore().byId("idFleet").getValue())
            }
          },
_handleHubClose : function(oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
              sap.ui.getCore().byId("idHub").setValue(oSelectedItem.getTitle());
              sap.ui.getCore().byId("idHub").setName(oSelectedItem.getBindingContext().getObject().HubCode);
              hubCode= oSelectedItem.getBindingContext().getObject().HubCode;
              hubName = oSelectedItem.getTitle();
              var value = kunnrname+" ("+oSelectedItem.getTitle()+")";
              that.getView().byId("HeaderIdTit").setText(value);

            }
          },
//////////////////////////////////////////////////////////////////////////////////////////////////

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
                    var sValue = oEvent.getParameter("value");

                    var oFilter = new sap.ui.model.Filter("FleetName",sap.ui.model.FilterOperator.Contains,sValue);

                    oEvent.getSource().getBinding("items").filter([ oFilter ]);
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
            var enrolMode = oSelectedItem.getBindingContext().getObject().EnrolMode;
            if(enrolMode === "F"){
              that.getView().byId("IdSer").setVisible(false);
            }else{
              that.getView().byId("IdSer").setVisible(true);
            }
              sap.ui.getCore().byId("idHub").setEnabled(true).setValue();
              sap.ui.getCore().byId("idFleet").setValue(oSelectedItem.getTitle());
              kunnrname = oSelectedItem.getTitle();
             that.getView().byId("HeaderIdTit").setText(oSelectedItem.getTitle());
             sap.ui.getCore().byId("idFleet").setName(oSelectedItem.getBindingContext().getObject().Kunnr);
             kunnr = oSelectedItem.getBindingContext().getObject().Kunnr;
            }

          },
//////////////////////////////////////////////////////////////////////////////////////////////////
          onFleetCloseButton:function(){
            if(sap.ui.getCore().byId("idFleet").getValue()!=""&& sap.ui.getCore().byId("idHub").getValue()!=""){
            that._FleetDialog.close();
            }else{
              sap.m.MessageToast.show("Select Fleet and Hub")
            }

          },
//////////////////////////////////////////////////////////////////////////////////////////////////
          onFleetCloseCancle:function(){
            window.history.back();
          },
//////////////////////////////////////////////////////////////////////////////////////////////////
          TempRex:function(evt){

            var value=evt.getSource().getValue();
            var regexp = /^\d+(\.\d{1,2})?$/;

            if(value!="-"){
            if(isNaN(value)){

              value = value.substring(0, value.length - 1);
              evt.getSource().setValue(value);
            }
            }
          },
//////////////////////////////////////////////////////////////////////////////////////////////////
          TempRex1:function(evt){
            var value=evt.getSource().getValue();
            var regexp = /^\d+(\.\d{1,2})?$/;

            if(isNaN(value)){

              value = value.substring(0, value.length - 1);
              evt.getSource().setValue(value);
            }
          },
//////////////////////////////////////////////////////////////////////////////////////////////////
          onVecRegNo:function(){
        	  
            if(kunnr){
              var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_VEHICLE_REG_NOSet?$filter=CUname eq '"+
              				sap.ushell.Container.getService("UserInfo").getId()+"'and CType eq 'I'and CKunnr  eq '"+ kunnr +"'";
            }else{
              var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_VEHICLE_REG_NOSet?$filter=CUname eq '"+
              				sap.ushell.Container.getService("UserInfo").getId()+"'and CType eq 'I'and CKunnr  eq '"+
              				sap.ui.getCore().byId("idFleet").getName()+"'";
            }

              var jModel = new sap.ui.model.json.JSONModel();
              jModel.loadData(sPath, null, false, "GET", false, false, null);
              var _valueHelpClaimSelectDialog = new sap.m.SelectDialog(
                  {

                    title : "Select Vehicle",
                    items : {
                      path : "/d/results",
                      template : new sap.m.StandardListItem(
                          {
                            title : "{RegNo}",
                            customData : [ new sap.ui.core.CustomData(
                                {
                                  key : "Key",
                                  value : "{RegNo}"
                                }) ],

                          }),
                    },
                    liveChange : function(oEvent) {
                      var sValue = oEvent.getParameter("value");

     var oFilter = new sap.ui.model.Filter("RegNo",sap.ui.model.FilterOperator.Contains,sValue);

                      oEvent.getSource().getBinding("items").filter([ oFilter ]);
                    },
                    confirm : [ this._handleTypeClaimClose, this ],
                    cancel : [ this._handleTypeClaimClose, this ]
                  });
              _valueHelpClaimSelectDialog.setModel(jModel);
              _valueHelpClaimSelectDialog.open();
            },
            _handleTypeClaimClose : function(oEvent) {
            	
              var oSelectedItem = oEvent.getParameter("selectedItem");
              if (oSelectedItem) {
                this.getView().byId("FVehicleNoEdit").setValue(oSelectedItem.getTitle());
                this.onVehicalDetails();

              }

            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            onProdSize:function(evt){														// september 5
			      
            	that.TyreSize=evt.getSource();
				var obj=that.TyreSize.getParent().getBindingContext().getObject();
				
				if(that.flg==0){
					evt.getSource().getParent().getCells()[2].getItems()[0].setValueState("None");
					evt.getSource().getParent().getCells()[2].getItems()[1].setValueState("None");
					owner = evt.getSource().getParent().getCells()[2].getItems()[0].getSelectedKey();
					
					if (owner=='01'){
						tyre_company = "JK";
					}else{
						tyre_company = evt.getSource().getParent().getCells()[2].getItems()[1].getSelectedKey();
					 }	
					
					if(owner==""){
						sap.m.MessageToast.show("Select Owner");
						evt.getSource().setSelectedKey("");
						evt.getSource().getParent().getCells()[2].getItems()[0].setValueState("Error");
						return;
					}else{
						if(	owner=="02" && tyre_company==""){
							sap.m.MessageToast.show("Select Company");
							evt.getSource().setSelectedKey("");
							evt.getSource().getParent().getCells()[2].getItems()[1].setValueState("Error")
							return;
						}
					}
					
				}else{	
					obj.Owner="02";
					tyre_company = evt.getSource().getParent().getCells()[2].getSelectedKey();
					evt.getSource().getParent().getCells()[2].setValueState("None");
						if(tyre_company==""){
							sap.m.MessageToast.show("Select Company");
							evt.getSource().setSelectedKey("");
							evt.getSource().getParent().getCells()[2].setValueState("Error");
							return;
						}
				}						
				
			
					var path = evt.getSource().getBindingContext().getPath().split('/')[3];
					var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4ProdSizeSet";
							
				
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false, false, null);
				var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
						{

							title : "Select Tyre Size",
							items : {
								path : "/d/results",
								template : new sap.m.StandardListItem(
										{
											title :"{ProdDesc}" ,
											customData : [ new sap.ui.core.CustomData(
													{
														key : "Key",
														value : "{ProdDesc}"
													}) ],

										}),
							},
							liveChange : function(oEvent) {
								var sValue = oEvent.getParameter("value");

								var oFilter = new sap.ui.model.Filter("ProdDesc",sap.ui.model.FilterOperator.Contains,sValue);

								oEvent.getSource().getBinding("items").filter([ oFilter ]);
							},
							confirm : [ this._handleTyreClose, this ],
							cancel : [ this._handleTyreClose, this ]
						});
				_valueHelpTyreSelectDialog.setModel(jModel);
				_valueHelpTyreSelectDialog.open();
			},
		_handleTyreClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				that.TyreSize.setValue(oSelectedItem.getTitle());
				that.TyreSize.getParent().getBindingContext().getObject().ProdSize = oSelectedItem.getBindingContext().getObject().ProdSize;
				that.TyreSize.getParent().getBindingContext().getObject().ItemCode="";
				that.TyreSize.getParent().getBindingContext().getObject().ItemDesc="";
				that.TyreSize.getParent().getBindingContext().getObject().StnclNumber="";	
				that.TyreSize.getParent().getBindingContext().getObject().TyreType="";
				that.TyreSize.getParent().getBindingContext().getObject().TyreLoc="";
				that.TyreSize.getParent().getBindingContext().getObject().IpCondition="";
				that.TyreSize.getParent().getBindingContext().getObject().IpPsi="";
				that.TyreSize.getParent().getBindingContext().getObject().OrigNsd="";
				that.TyreSize.getParent().getBindingContext().getObject().G1Nsd="";
				that.TyreSize.getParent().getBindingContext().getObject().G2Nsd="";
				that.TyreSize.getParent().getBindingContext().getObject().G3Nsd="";
				that.TyreSize.getParent().getBindingContext().getObject().G4Nsd="";
				that.TyreSize.getParent().getBindingContext().getObject().Remarks="";
				
				that.TyreSize.getParent().getCells()[4].setShowValueHelp(true).setValue("");
				that.TyreSize.getParent().getCells()[5].setShowValueHelp(true).setValue("");
				that.TyreSize.getParent().getCells()[8].setType("Reject");
				
				var len = that.TyreSize.getParent().getBindingContext().getObject().VitemToServiceNvg.results.length;
				for(var i=0;i<len;i++){
					that.TyreSize.getParent().getBindingContext().getObject().VitemToServiceNvg.results[i].ServiceSelect = "";
				}
			}      	

		},
//////////////////////////////////////////////////////////////////////////////////////////////////
onVehicalDetails:function(){
	
              var vecNo=this.getView().byId("FVehicleNoEdit").getValue();

                var that = this;

                var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
                var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
                oReadModel.setHeaders({"Content-Type" : "application/json"});
                
                var fncSuccess = function(oData, oResponse) 					// success
                {
                that.data=oData;

                if(oData.Error=="X"){
                sap.m.MessageBox.show(oData.Message, {
                  title : "Error",
                  icon : sap.m.MessageBox.Icon.ERROR,
                  onClose:function(){
                    that.getView().byId("FVehicleNoEdit").setValue();
                  }
                });

                this.getView().byId("FVehicleNoEdit").setValue();
                }else{
                  if(that.data.MechCond == "N"){
                    that.getView().byId("idmccon").setEnabled(false);
                    that.getView().byId("idReasonlbl").setVisible(true);
                    that.getView().byId("idReason").setVisible(true);
                    that.getView().byId("idReason").setEnabled(false);
                  }else{
                    that.getView().byId("idmccon").setEnabled(true);
                    that.getView().byId("idReasonlbl").setVisible(false);
                    that.getView().byId("idReason").setVisible(false);
                    that.getView().byId("idReason").setEnabled(true);
                  }
                }

                if(hubCode){
                  that.data.HubCode=hubCode;
                }else{
                  that.data.HubCode=sap.ui.getCore().byId("idHub").getName();
                }

                oData.InspType = "02";
                var FitModel = new sap.ui.model.json.JSONModel(oData);
                that.getView().setModel(FitModel,"Fitments")
                that.getView().byId("idrotatiob").setSelectedKey();
                
                debugger
                
                if(that.data.ContractType=="CPKM"){
                  that.flg=0;
                  that.getView().byId("Panel1").setVisible(true);
                  that.getView().byId("Panel2").setVisible(false);
                  var tab=that.getView().byId("tblDetail");
                  var temp = new sap.m.ColumnListItem({
                    cells : [

                             new sap.m.Text({text:"{Zposition}"}),

                             new sap.m.Input({value:"{RotationPosNew}",valueHelpRequest:[that.onrottateF4,that],
                                 valueHelpOnly:true, showValueHelp:false,editable:false,
                                 visible:"{path:'Zposition',formatter:'zfltinspcreate.util.Formatter.StpEnable1'}"}),

                             new sap.m.VBox({items:[new sap.m.Select({selectedKey:"{Owner}",
                                 change:[that.owner,that],forceSelection:false ,
                                 items:[new sap.ui.core.Item({text:"JK Tyre",key:"01"}),new sap.ui.core.Item({text:"Fleet Tyre",key:"02"})]}), 
                                 that.nonjkSelect]}),
                                 
                                 //enabled:"{path:'Zposition',formatter:'zfltinspcreate.util.Formatter.StpEnable'}",
                             new sap.m.Input({value:"{ProdDesc}", valueHelpRequest:[that.onProdSize,that],
								valueHelpOnly:true, showValueHelp:true,editable:false}),

                             new sap.m.Input({value:"{ItemDesc}",editable:false, valueHelpRequest:[that.onItemNo,that],
                                 valueHelpOnly:true, showValueHelp:true,editable:false}),

                             new sap.m.Input({value:"{StnclNumber}",valueHelpRequest:[that.onStncNo,that],
                                 valueHelpOnly:true, showValueHelp:true,editable:false}),

                             new sap.m.Select({selectedKey:"{RemoveOk}",change:[that.onAction,that],
                            	 items:[new sap.ui.core.Item({text:"OK",key:"O"}),new sap.ui.core.Item({text:"Remove",key:"R"})],forceSelection:true}),

                             new sap.m.Button({text:"",press:[that.onSerSheet,that],icon:"sap-icon://activity-2"}),

                             new sap.m.Button({text:"",press:[that.detaiPress,that],icon:"sap-icon://record",type:"Reject"}),

                             ]
                  });
                  tab.setModel(FitModel);
                  tab.bindAggregation("items" , "/RegnoToItemNvg/results", temp );
                  
                  
                  for(var i = 0;i<tab.getItems().length;i++){
                	  tab.getItems()[i].getCells()[2].getItems()[0].setEnabled(false);
                	  if(tab.getItems()[i].getCells()[2].getItems()[0].getSelectedKey() == '02'){
                		  tab.getItems()[i].getCells()[2].getItems()[1].setVisible(true);
                		  tab.getItems()[i].getCells()[2].getItems()[1].setVisible(true);
                	  }else{
                		tab.getItems()[i].getCells()[2].getItems()[1].setVisible(false);
                	  }
                  }

                }else if(that.data.ContractType=="SC"){
                  that.flg=1;
                  that.getView().byId("Panel1").setVisible(false);
                  that.getView().byId("Panel2").setVisible(true);
                  var tab=that.getView().byId("tblDetail1");
                  var temp = new sap.m.ColumnListItem({
                    cells : [

                             new sap.m.Text({text:"{Zposition}"}),
                             
                             new sap.m.Input({value:"{RotationPosNew}",valueHelpRequest:[that.onrottateF4,that],
                            	 valueHelpOnly:true, showValueHelp:false,editable:false,
                            	 visible:"{path:'Zposition',formatter:'zfltinspcreate.util.Formatter.StpEnable1'}"}),
                         
                             that.nonjkSelect1,
                             
                             new sap.m.Input({value:"{ProdDesc}", valueHelpRequest:[that.onProdSize,that],
									valueHelpOnly:true, showValueHelp:true,editable:false}),
					           	
                             new sap.m.Input({value:"{ItemDesc}",editable:false, valueHelpRequest:[that.onItemNo,that],
                            	 valueHelpOnly:true, showValueHelp:true,editable:false}),
                            	 
                             new sap.m.Input({value:"{StnclNumber}",valueHelpRequest:[that.onStncNo,that],
                            	 valueHelpOnly:true, showValueHelp:true,editable:false}),
                            	 
                             new sap.m.Select({selectedKey:"{RemoveOk}",change:[that.onAction,that],
                            	 items:[new sap.ui.core.Item({text:"OK",key:"O"}),new sap.ui.core.Item({text:"Remove",key:"R"})],forceSelection:true}),

                             new sap.m.Button({text:"",press:[that.onSerSheet,that],icon:"sap-icon://activity-2"}),
                             
                             new sap.m.Button({text:"",press:[that.detaiPress,that],icon:"sap-icon://record",type:"Reject"}),

                             ]
                  });
                  tab.setModel(FitModel);
                  tab.bindAggregation("items" , {path:"/RegnoToItemNvg/results", template:temp, templateShareable : true} );
                  
                  
                  for(var i = 0;i<tab.getItems().length;i++){
                	  tab.getItems()[i].getCells()[2].setEnabled(false);
                  }
                  
                }
                }

                var fncError = function(oError) { 							// error callback
	                  var parser = new DOMParser();
	                  var message = parser.parseFromString(oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML;
	                  sap.m.MessageBox.show(message, {
	                    title : "Error",
	                    icon : sap.m.MessageBox.Icon.ERROR,
	                  });
                }
                // Create Method for final Save
                
                  oReadModel.read("/VehicleRegNoSet(RegNo='"+vecNo+"',Type='I',TruckKunnr='',Kunnr='"+kunnr+"')?$expand=RegnoToItemNvg/VitemToServiceNvg/IservToSubservNvg,RegnoToServiceNvg/VServToSubservNvg", {
                  success : fncSuccess,
                  error : fncError
                });



            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            handleValueChange: function(oEvent){
              alert("Image Selected");
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            onrottateF4:function(evt){
              that.rotationitem=evt.getSource();
              var obj=evt.getSource().getParent().getBindingContext().getObject()
              var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4RotationPositionsSet?$filter=IRegNo eq '"+that.data.RegNo+"' and IPosition eq '"+obj.Zposition+"'";
              var jModel = new sap.ui.model.json.JSONModel();
              jModel.loadData(sPath, null, false, "GET", false, false, null);
              var _valueHelpRotationSelectDialog = new sap.m.SelectDialog(
                  {

                    title : "Select Position",
                    items : {
                      path : "/d/results",
                      template : new sap.m.StandardListItem(
                          {
                            title : "{Zposition}",
                            description:"{PositionDesc}",
                            customData : [ new sap.ui.core.CustomData(
                                {
                                  key : "Key",
                                  value : "{Zposition}"
                                }) ],

                          }),
                    },
                    liveChange : function(oEvent) {
                      var sValue = oEvent.getParameter("value");

                      var oFilter = new sap.ui.model.Filter("Zposition",sap.ui.model.FilterOperator.Contains,sValue);

                      oEvent.getSource().getBinding("items").filter([ oFilter ]);
                    },
                    confirm : [ this._handleRotationClose, this ],
                    cancel : [ this._handleRotationClose, this ]
                  });
              _valueHelpRotationSelectDialog.setModel(jModel);
              _valueHelpRotationSelectDialog.open();
            },
            _handleRotationClose : function(oEvent) {
              var oSelectedItem = oEvent.getParameter("selectedItem");
              if (oSelectedItem) {

                
                var item=that.rotationitem.getParent();
                var flg;
                if(that.flg==1){
                  var data=that.flg==0?that.getView().byId("" + "").getItems():that.getView().byId("tblDetail1").getItems();}
                else{
                  var data=that.flg==1?that.getView().byId("" + "").getItems():that.getView().byId("tblDetail").getItems();
                }
                var num=data.indexOf(item);
                for(i=0;i<data.length;i++){
                  if(i!=num){
                    if(data[i].getCells()[1].getValue()==oSelectedItem.getTitle()){
                      flg="X";
                    }
                  }
                }

                if(flg!="X"){
                  that.rotationitem.setValue(oSelectedItem.getTitle());
                }else{
                  sap.m.MessageToast.show("Rotation Position "+oSelectedItem.getTitle() +" already Selected")
                }
              }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
       owner:function(evt){																			// september 5
              var key=evt.getSource().getSelectedKey();
              debugger
              if(key=="01"){
                evt.getSource().getParent().getItems()[1].setVisible(false).setSelectedKey("JK");
                evt.getSource().getParent().getParent().getCells()[3].setSelectedKey();
                //evt.getSource().getParent().getParent().getBindingContext().getObject().TyreSize="";
                evt.getSource().getParent().getParent().getBindingContext().getObject().ItemCode="";
                evt.getSource().getParent().getParent().getBindingContext().getObject().ItemDesc="";
                evt.getSource().getParent().getParent().getBindingContext().getObject().StnclNumber="";
                evt.getSource().getParent().getParent().getBindingContext().getObject().NonJkCompany="JK";
              }else if(key=="02"){
                evt.getSource().getParent().getItems()[1].setVisible(true).setSelectedKey("");
                evt.getSource().getParent().getItems()[1].setEnabled(true);
                evt.getSource().getParent().getParent().getCells()[3].setSelectedKey();
                //evt.getSource().getParent().getParent().getBindingContext().getObject().TyreSize="";
                evt.getSource().getParent().getParent().getBindingContext().getObject().ItemCode="";
                evt.getSource().getParent().getParent().getBindingContext().getObject().ItemDesc="";
                evt.getSource().getParent().getParent().getBindingContext().getObject().StnclNumber="";
                evt.getSource().getParent().getParent().getBindingContext().getObject().NonJkCompany="";
              }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
      onAction:function(evt){
          
    	  debugger 
          that.actionItem=evt.getSource();
          that.actionMainItem=evt.getSource().getParent();
          if(evt.getParameter("selectedItem")==undefined){
              if(evt.getSource().getSelectedKey()=="R"){
                var table=evt.getSource().getParent().getParent();
                var index=table.getItems().indexOf(evt.getSource().getParent());

                evt.getSource().getParent().getBindingContext().getObject().RemoveOk=evt.getSource().getSelectedKey();
                var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
                var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
                oReadModel.read("/VehicleRegNoItemSet(RegNo='"+that.getView().byId("FVehicleNoEdit").getValue()+
                				"',Zposition='"+evt.getSource().getParent().getBindingContext().getObject().Zposition+
                				"')?$expand=VitemToServiceNvg/IservToSubservNvg", null, null, true, function(oData, oResponse) {
	                  
	                  oData.RemoveOk = "O";
	                  oData.RemoveAct = 'N';   //New Record
	               	                  
	                  table.getModel().getData().RegnoToItemNvg.results.splice(index+1, 0, oData);
	                  var pos = table.getModel().getData().RegnoToItemNvg.results[index].RotationPosNew;
	                  table.getModel().getData().RegnoToItemNvg.results[index+1].RotationPosNew = pos;
	                  table.getModel().getData().RegnoToItemNvg.results[index].RemoveAct = 'R';
	                  table.getModel().refresh();
	                  
                }, function(oData, oResponse) {
	                  var obj = JSON.parse(oData.response.body);
	                  var msg = obj.error.message.value;     
	                  sap.m.MessageBox.show(msg, {
	                    icon: sap.m.MessageBox.Icon.ERROR,
	                    title: "Error",
	                    actions: [sap.m.MessageBox.Action.OK]
	                  });
                	});

              }else if(evt.getSource().getSelectedKey()=="O"){
                evt.getSource().getParent().getBindingContext().getObject().RemoveOk=evt.getSource().getSelectedKey();
                var table=evt.getSource().getParent().getParent();
                var index=table.getItems().indexOf(evt.getSource().getParent());
                if(index!=table.getItems().length-1){
                if(evt.getSource().getParent().getBindingContext().getObject().Zposition==table.getItems()[index+1].getBindingContext().getObject().Zposition){
                  var pos = table.getModel().getData().RegnoToItemNvg.results[index+1].RotationPosNew;
                  table.getModel().getData().RegnoToItemNvg.results[index].RotationPosNew = pos;
                  table.getModel().getData().RegnoToItemNvg.results[index].RemLoc  = '';
                  table.getModel().getData().RegnoToItemNvg.results[index].Service = '';
                  table.getModel().getData().RegnoToItemNvg.results[index].Adjust  = '';
                  table.getModel().getData().RegnoToItemNvg.results.splice(index+1, 1);
                  table.getModel().getData().RegnoToItemNvg.results[index].RemoveAct  = 'O';
                  table.getModel().refresh();
                }
                }
              }
          }else{
                if(evt.getSource().getSelectedKey()=="R"){
                if (!that._RemovalReason) {
                  that._RemovalReason = sap.ui.xmlfragment("zfltinspcreate.view.RemoveTyreDetails", that);
                  that.getView().addDependent(that._RemovalReason);}
                  var sPath1="/sap/opu/odata/sap/ZFLEET_SRV/Tyre_Location_FromSet";

                var jModel1 = new sap.ui.model.json.JSONModel();
                jModel1.loadData(sPath1, null, false, "GET", false, false, null);
                sap.ui.getCore().byId("idTyrLoc1").unbindAggregation("items");
                sap.ui.getCore().byId("idTyrLoc1").setModel(jModel1);
                sap.ui.getCore().byId("idTyrLoc1").bindAggregation("items", {
                    path: "/d/results",
                    template: new sap.ui.core.Item({
                      key: "{TyreLocFrom}",
                      text: "{TyreLocDesc} ({TyreLocFrom})"
                    })
                  }); 

                  sap.ui.getCore().byId("idTyrLoc1").setVisible(true);
                  var rem = that._RemovalReason.open();
                  rem.setEscapeHandler(function(oEvt){
                	  oEvt.reject();
                  });

              } else if(evt.getSource().getSelectedKey()=="O"){
            	  
                var table=evt.getSource().getParent().getParent();
                var index=table.getItems().indexOf(evt.getSource().getParent());
                if(index!=table.getItems().length-1){
                if(evt.getSource().getParent().getBindingContext().getObject().Zposition==table.getItems()[index+1].getBindingContext().getObject().Zposition){

                  var pos = table.getModel().getData().RegnoToItemNvg.results[index+1].RotationPosNew;
                  table.getModel().getData().RegnoToItemNvg.results[index].RotationPosNew = pos;
                  table.getModel().getData().RegnoToItemNvg.results[index].RemoveAct = 'O';
                  table.getModel().getData().RegnoToItemNvg.results.splice(index+1, 1);
                  table.getModel().refresh();
                  
                     }
                }
                var obj = evt.getSource().getParent().getBindingContext().getObject();
            	obj.RemLoc == "";
            	obj.Service = "";
            	obj.Adjust  = "";
              }
          }

      },
//////////////////////////////////////////////////////////////////////////////////////////////////
            onMjrDft:function(){
              
              var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4ServiceAbuseSet";
              var jModel = new sap.ui.model.json.JSONModel();
              jModel.loadData(sPath, null, false, "GET", false, false, null);

              var _valueHelpMajorgrpelectDialog = new sap.m.SelectDialog(
                  {
                    title : "Select Service Abuse",
                    items : {
                      path : "/d/results",
                      template : new sap.m.StandardListItem(
                          {
                            title : "{Service}",

                            customData : [ new sap.ui.core.CustomData(
                                {
                                  key : "{AbuseKey}",
                                  value : "{Service}"
                                }) ],

                          }),
                    },
                    liveChange : function(oEvent) {
                      var sValue = oEvent.getParameter("value");

                      var oFilter = new sap.ui.model.Filter("Service",sap.ui.model.FilterOperator.Contains,sValue);

                      var oFilter1= new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
                      oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
                    },
                    confirm : [ this._handleMajorClose, this ],
                    cancel : [ this._handleMajorClose, this ]
                  });
              _valueHelpMajorgrpelectDialog.setModel(jModel);
              _valueHelpMajorgrpelectDialog.open();

            },
            _handleMajorClose : function(oEvent) {
              var oSelectedItem = oEvent.getParameter("selectedItem");
              var data = oSelectedItem.getBindingContext().getObject();
              if (oSelectedItem) {
                sap.ui.getCore().byId("idMJDefect").setValue(oSelectedItem.getTitle());
                sap.ui.getCore().byId("idMJDefectCode").setValue(data.AbuseKey);
              }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            onMnrDft:function(){
              
              var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4AdjustableDefectSet";
              var jModel = new sap.ui.model.json.JSONModel();
              jModel.loadData(sPath, null, false, "GET", false,false, null);

              var _valueHelpMnrrgrpelectDialog = new sap.m.SelectDialog(
                  {
                    title : "Select Adjustable Defect",
                    items : {
                      path : "/d/results",
                      template : new sap.m.StandardListItem(
                          {
                            title : "{Adjust}",
                            //description:"{AdjustKey}",
                            customData : [ new sap.ui.core.CustomData(
                                {
                                  key : "{AdjustKey}",
                                  value : "{Adjust}"
                                }) ],

                          }),
                    },
                    liveChange : function(oEvent) {
                      var sValue = oEvent.getParameter("value");

                      var oFilter = new sap.ui.model.Filter("Adjust",sap.ui.model.FilterOperator.Contains,sValue);
       
                      var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false);
                      oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
                    },
                    confirm : [ this._handleMNRClose, this ],
                    cancel : [ this._handleMNRClose, this ]
                  });
              _valueHelpMnrrgrpelectDialog.setModel(jModel);
              _valueHelpMnrrgrpelectDialog.open();

              },
            _handleMNRClose : function(oEvent) {
              var oSelectedItem = oEvent.getParameter("selectedItem");
              var data = oSelectedItem.getBindingContext().getObject();
              if (oSelectedItem) {
                sap.ui.getCore().byId("idMNGrp").setValue(oSelectedItem.getTitle());
                sap.ui.getCore().byId("idMNGrpCode").setValue(data.AdjustKey);
              }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
    onTyreOk1:function(){
              var TyrLoc      = sap.ui.getCore().byId("idTyrLoc1").getSelectedKey();
              var MajorDefect = sap.ui.getCore().byId("idMJDefectCode").getValue();
              var MinorDefect = sap.ui.getCore().byId("idMNGrpCode").getValue();

              if(TyrLoc==""  ){
                sap.m.MessageToast.show("Select Cause of Removal");
                return
              }
              if(MajorDefect=="" && sap.ui.getCore().byId("idMJDefect").getVisible()){
                sap.m.MessageToast.show("Select Service Abuse");
                return
              }

              var obj=that.actionMainItem.getBindingContext().getObject();
              obj.RemLoc  = TyrLoc;
              obj.Service = MajorDefect;
              obj.Adjust  = MinorDefect;

              if(obj.RemLoc == 'CTR'){
                	obj.Service = "";
                	obj.Adjust  = "";
              }
              
              that._RemovalReason.close();
              that._RemovalReason.destroy();
              that._RemovalReason=undefined;
              that.actionItem.fireEvent("change");
    },
//////////////////////////////////////////////////////////////////////////////////////////////////
    onTyreClose1: function(evt){
              if(that.flg==0){
                var table1 = this.getView().byId("tblDetail");
                var loItems1 = this.getView().byId("tblDetail").getItems();
                for(var i=0;i<loItems1.length;i++){
                	loItems1[i].getCells()[6].setSelectedKey("O");
                }										// september 5
              }else{
                var table = this.getView().byId("tblDetail1");
                var loItems = this.getView().byId("tblDetail1").getItems();
                for(var i=0;i<loItems.length;i++){
                	loItems[i].getCells()[6].setSelectedKey("O");
                }										// september 5
              }
              that._RemovalReason.close();
              that._RemovalReason.destroy();
              that._RemovalReason=undefined;
    },
//////////////////////////////////////////////////////////////////////////////////////////////////
            TyreLocChange:function(evt){
              var key=evt.getSource().getSelectedKey();
              if(key=="SRP"){
                sap.ui.getCore().byId("idMJDefect").setVisible(true);
                sap.ui.getCore().byId("idMNGrp").setVisible(true);
              }else{
                sap.ui.getCore().byId("idMJDefect").setVisible(false);
                sap.ui.getCore().byId("idMNGrp").setVisible(false);

              }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
     onAmsUpdate:function(evt){																		// september 5
          
         debugger 
         
         that=this;
   	  var key = that.getView().byId("idrotatiob").getSelectedKey();
   	  
   	  for(var i=0;i<evt.getSource().getItems().length;i++){
   		  
	   		  evt.getSource().getItems()[i].getCells()[1].setValueState("None");
	       	  evt.getSource().getItems()[i].getCells()[2].setValueState("None");
	       	  evt.getSource().getItems()[i].getCells()[3].setValueState("None");
	       	  evt.getSource().getItems()[i].getCells()[4].setValueState("None");
	       	  evt.getSource().getItems()[i].getCells()[5].setValueState("None");
	       	  
		       	 if(evt.getSource().getModel().oData.RegnoToItemNvg.results[i].NIpCondition != ""){
		       		  evt.getSource().getItems()[i].getCells()[8].setType("Accept");
		       	  }else{ evt.getSource().getItems()[i].getCells()[8].setType("Reject")};
	       	  
	       	if(evt.getSource().getItems()[i].getBindingContext().getObject().RemoveAct == 'O' ||
	    	   evt.getSource().getItems()[i].getBindingContext().getObject().RemoveAct == 'R')
	       		{
	       		 evt.getSource().getItems()[i].getCells()[2].setEnabled(false);
	       		 evt.getSource().getItems()[i].getCells()[3].setEnabled(false);
	       		 evt.getSource().getItems()[i].getCells()[4].setEnabled(false);
	       		 evt.getSource().getItems()[i].getCells()[5].setEnabled(false);	  
	       		 
	       		evt.getSource().getItems()[i].getCells()[2].setSelectedKey(evt.getSource().getItems()[i].getBindingContext().getObject().NonJkCompany)
	       	       		 
	       		 if(evt.getSource().getItems()[i].getBindingContext().getObject().RemoveAct == 'O'){
	       			evt.getSource().getItems()[i].getCells()[6].setEnabled(true).setSelectedKey("O");
	       			
	       		    if(key == "M"){
	       		    	evt.getSource().getItems()[i].getCells()[1].setVisible(true);	
	       		    	evt.getSource().getItems()[i].getCells()[1].setEditable(true).setShowValueHelp(true);
	       		    	
	       		    }else if(key == "A"){
	       		    	evt.getSource().getItems()[i].getCells()[1].setVisible(true);	
	       		    	evt.getSource().getItems()[i].getCells()[1].setEnabled(false);
	       		    }
	       			
	       		 }else if(evt.getSource().getItems()[i].getBindingContext().getObject().RemoveAct == 'R'){
	       			evt.getSource().getItems()[i].getCells()[6].setEnabled(true).setSelectedKey("R"); 
	       			
	       			if(key == "M" || key == "A"){
	       				evt.getSource().getItems()[i].getCells()[1].setVisible(false);		       		    
	       		    }
	       		 }
	       		 
	       		if(evt.getSource().getItems()[i].getBindingContext().getObject().Zposition=='STP' && key != ""){
	       			evt.getSource().getItems()[i].getCells()[1].setVisible(false);
	       		 }
	       		 
	       		}else if(evt.getSource().getItems()[i].getBindingContext().getObject().RemoveAct == 'N'){
	       			
	       			 evt.getSource().getItems()[i].getCells()[2].setEnabled(true);	
	       			 evt.getSource().getItems()[i].getCells()[3].setEditable(true);
	       			 evt.getSource().getItems()[i].getCells()[4].setEditable(true);
	       			 evt.getSource().getItems()[i].getCells()[5].setEditable(true);
	       			 evt.getSource().getItems()[i].getCells()[6].setEnabled(false);
	       			 
	       			 evt.getSource().getItems()[i].getCells()[3].setEnabled(true);
	       			 evt.getSource().getItems()[i].getCells()[4].setEnabled(true);
	       			 evt.getSource().getItems()[i].getCells()[5].setEnabled(true);
	       			 
	       			evt.getSource().getItems()[i].getCells()[2].setSelectedKey(evt.getSource().getItems()[i].getBindingContext().getObject().NonJkCompany)
	       			 
	       			 evt.getSource().getItems()[i].getCells()[6].setSelectedKey("O");	       			 
		       			       		 
		       		 	if(key == "M"){
		       		    	evt.getSource().getItems()[i].getCells()[1].setVisible(true);
		       		    	evt.getSource().getItems()[i].getCells()[1].setEditable(true).setShowValueHelp(true);
		       		    }else if(key == "A"){
		       		    	evt.getSource().getItems()[i].getCells()[1].setVisible(true);	
		       		    	evt.getSource().getItems()[i].getCells()[1].setEnabled(false);
		       		    }
		       		 	
		       		 if(evt.getSource().getItems()[i].getBindingContext().getObject().Zposition=='STP' && key != ""){
		       			evt.getSource().getItems()[i].getCells()[1].setVisible(false);
		       		 }
	       		}
   	  }
    	 
    	 /*for(var i=0;i<evt.getSource().getItems().length;i++){
        	  
																					//set all fields to non-error state
        	  evt.getSource().getItems()[i].getCells()[1].setValueState("None");
        	  evt.getSource().getItems()[i].getCells()[2].setValueState("None");
        	  evt.getSource().getItems()[i].getCells()[3].setValueState("None");
        	  evt.getSource().getItems()[i].getCells()[4].setValueState("None");
        	  evt.getSource().getItems()[i].getCells()[5].setValueState("None");
        	  
              evt.getSource().getItems()[i].getCells()[2].setSelectedKey(evt.getSource().getItems()[i].getBindingContext().getObject().NonJkCompany);
              if(evt.getSource().getModel().oData.RegnoToItemNvg.results[i].NIpCondition != ""){
        		  evt.getSource().getItems()[i].getCells()[8].setType("Accept");
        	  }else{ evt.getSource().getItems()[i].getCells()[8].setType("Reject")};
        			 
        	  if(evt.getSource().getItems()[i].getCells()[6].getSelectedKey() == "R" || evt.getSource().getItems()[i].getCells()[0].getText() == "STP" ){
        		  evt.getSource().getItems()[i].getCells()[1].setValue("").setVisible(false);  
        	  }else{
        		  evt.getSource().getItems()[i].getCells()[1].setVisible(true);  
        	  }
          }
          
          var key = that.getView().byId("idrotatiob").getSelectedKey();
          
          for(var i=1;i<evt.getSource().getItems().length;i++){
        	  if(evt.getSource().getItems()[i].getCells()[0].getText() == evt.getSource().getItems()[i-1].getCells()[0].getText()){
        		  	if(key == "M"){
        		  		evt.getSource().getItems()[i].getCells()[1].setEditable(true).setShowValueHelp(true);
        		  	}else{
        		  		evt.getSource().getItems()[i].getCells()[1].setEditable(false);
        		  	}
        		  	evt.getSource().getItems()[i].getCells()[2].setEnabled(true);
	                evt.getSource().getItems()[i].getCells()[3].setEditable(true);
	                evt.getSource().getItems()[i].getCells()[4].setEditable(true);
	                evt.getSource().getItems()[i].getCells()[5].setEditable(true);
	                evt.getSource().getItems()[i].getCells()[6].setEnabled(false).setSelectedKey("O");
        	  }else{
        		  	if(key == "A")
        		  		evt.getSource().getItems()[i].getCells()[1].setEditable(false).setShowValueHelp(true);
        		  	else if(key == "M"){
        		  		evt.getSource().getItems()[i].getCells()[1].setEditable(true).setShowValueHelp(true);
        		  	}
        		  	evt.getSource().getItems()[i].getCells()[2].setEnabled(false);
        		  	evt.getSource().getItems()[i].getCells()[3].setEditable(false);
        		  	evt.getSource().getItems()[i].getCells()[4].setEditable(false);
	                evt.getSource().getItems()[i].getCells()[5].setEditable(false);
	                evt.getSource().getItems()[i].getCells()[6].setEnabled(true);
        	  }
        	  
          }*/
              
     },
//////////////////////////////////////////////////////////////////////////////////////////////////
     onCPMKUpdate:function(evt){																	// september 5
          
    	  debugger
          that=this;
    	  var key = that.getView().byId("idrotatiob").getSelectedKey();
    	  
    	  for(var i=0;i<evt.getSource().getItems().length;i++){
    		  
	   		  evt.getSource().getItems()[i].getCells()[1].setValueState("None");
	       	  evt.getSource().getItems()[i].getCells()[2].getItems()[0].setValueState("None");
	       	  evt.getSource().getItems()[i].getCells()[2].getItems()[1].setValueState("None");
	       	  evt.getSource().getItems()[i].getCells()[3].setValueState("None");
	       	  evt.getSource().getItems()[i].getCells()[4].setValueState("None");
	       	  evt.getSource().getItems()[i].getCells()[5].setValueState("None");
	       	  
	       	 if(evt.getSource().getModel().oData.RegnoToItemNvg.results[i].NIpCondition != ""){
       		  evt.getSource().getItems()[i].getCells()[8].setType("Accept");
       	  }else{ evt.getSource().getItems()[i].getCells()[8].setType("Reject")};
	       	  
	       	if(evt.getSource().getItems()[i].getBindingContext().getObject().RemoveAct == 'O' ||
	    	   evt.getSource().getItems()[i].getBindingContext().getObject().RemoveAct == 'R')
	       		{
	       		 evt.getSource().getItems()[i].getCells()[2].getItems()[0].setEnabled(false);
	       		 evt.getSource().getItems()[i].getCells()[3].setEnabled(false);
	       		 evt.getSource().getItems()[i].getCells()[4].setEnabled(false);
	       		 evt.getSource().getItems()[i].getCells()[5].setEnabled(false);
	       		 
	       		 if(evt.getSource().getItems()[i].getCells()[2].getItems()[0].getSelectedKey() == '02'){
	       			 evt.getSource().getItems()[i].getCells()[2].getItems()[1].setEnabled(false).setVisible(true);
	       			 evt.getSource().getItems()[i].getCells()[2].getItems()[1].setSelectedKey(evt.getSource().getItems()[i].getBindingContext().getObject().NonJkCompany)
	       		 }else{
	       			 evt.getSource().getItems()[i].getCells()[2].getItems()[1].setVisible(false);
	       		 }
	       		 
	       		 if(evt.getSource().getItems()[i].getBindingContext().getObject().RemoveAct == 'O'){
	       			evt.getSource().getItems()[i].getCells()[6].setEnabled(true).setSelectedKey("O");
	       			
	       		    if(key == "M"){
	       		    	evt.getSource().getItems()[i].getCells()[1].setVisible(true);	
	       		    	evt.getSource().getItems()[i].getCells()[1].setEnabled(true);
	       		    	evt.getSource().getItems()[i].getCells()[1].setEditable(true);
	       		    	evt.getSource().getItems()[i].getCells()[1].setShowValueHelp(true);	
	       		    }else if(key == "A"){
	       		    	evt.getSource().getItems()[i].getCells()[1].setVisible(true);	
	       		    	evt.getSource().getItems()[i].getCells()[1].setEnabled(false);
	       		    }
	       			
	       		 }else if(evt.getSource().getItems()[i].getBindingContext().getObject().RemoveAct == 'R'){
	       			evt.getSource().getItems()[i].getCells()[6].setEnabled(true).setSelectedKey("R"); 
	       			
	       			if(key == "M" || key == "A"){
	       				evt.getSource().getItems()[i].getCells()[1].setVisible(false);		       		    
	       		    }
	       		 }
	       		 
	       		if(evt.getSource().getItems()[i].getBindingContext().getObject().Zposition=='STP' && key != ""){
	       			evt.getSource().getItems()[i].getCells()[1].setVisible(false);
	       		 }
	       		 
	       		}else if(evt.getSource().getItems()[i].getBindingContext().getObject().RemoveAct == 'N'){
	       			 evt.getSource().getItems()[i].getCells()[2].getItems()[0].setEnabled(true);	
	       			 evt.getSource().getItems()[i].getCells()[3].setEditable(true);
	       			 evt.getSource().getItems()[i].getCells()[4].setEditable(true);
	       			 evt.getSource().getItems()[i].getCells()[5].setEditable(true);
	       			 evt.getSource().getItems()[i].getCells()[6].setEnabled(false);
	       			 
	       			 evt.getSource().getItems()[i].getCells()[3].setEnabled(true);
	       			 evt.getSource().getItems()[i].getCells()[4].setEnabled(true);
	       			 evt.getSource().getItems()[i].getCells()[5].setEnabled(true);
	       			 
	       			 evt.getSource().getItems()[i].getCells()[6].setSelectedKey("O");
	       			 
		       		 if(evt.getSource().getItems()[i].getCells()[2].getItems()[0].getSelectedKey() == '02'){
		       /*			 evt.getSource().getItems()[i].getCells()[2].getItems()[1].setEditable(true);*/
		       			 evt.getSource().getItems()[i].getCells()[2].getItems()[1].setEnabled(true);
		       			 evt.getSource().getItems()[i].getCells()[2].getItems()[1].setVisible(true);
		       			 evt.getSource().getItems()[i].getCells()[2].getItems()[1].setSelectedKey(evt.getSource().getItems()[i].getBindingContext().getObject().NonJkCompany)
		       		 }else{
		       			 evt.getSource().getItems()[i].getCells()[2].getItems()[1].setVisible(false);
		       		 }
		       		 
		       		 	if(key == "M"){
		       		    	evt.getSource().getItems()[i].getCells()[1].setVisible(true);	
		       		    	evt.getSource().getItems()[i].getCells()[1].setEnabled(true);
		       		    	evt.getSource().getItems()[i].getCells()[1].setEditable(true);
		       		    	evt.getSource().getItems()[i].getCells()[1].setShowValueHelp(true);	
		       		    }else if(key == "A"){
		       		    	evt.getSource().getItems()[i].getCells()[1].setVisible(true);	
		       		    	evt.getSource().getItems()[i].getCells()[1].setEnabled(false);
		       		    }
		       		 	
		       		 if(evt.getSource().getItems()[i].getBindingContext().getObject().Zposition=='STP' && key != ""){
		       			evt.getSource().getItems()[i].getCells()[1].setVisible(false);
		       		 }
	       		}
    	  }
          
          
          
          
          
/*          for(var i=0;i<evt.getSource().getItems().length;i++){
        	  																	//set all fields to non-error state
        	  evt.getSource().getItems()[i].getCells()[1].setValueState("None");
        	  evt.getSource().getItems()[i].getCells()[2].getItems()[0].setValueState("None");
        	  evt.getSource().getItems()[i].getCells()[2].getItems()[1].setValueState("None");
        	  evt.getSource().getItems()[i].getCells()[3].setValueState("None");
        	  evt.getSource().getItems()[i].getCells()[4].setValueState("None");
        	  evt.getSource().getItems()[i].getCells()[5].setValueState("None");
        	  
              evt.getSource().getItems()[i].getCells()[2].getItems()[1].setSelectedKey(evt.getSource().getItems()[i].getBindingContext().getObject().NonJkCompany);
              if(evt.getSource().getModel().oData.RegnoToItemNvg.results[i].NIpCondition != ""){
        		  evt.getSource().getItems()[i].getCells()[8].setType("Accept");
        	  }else{ evt.getSource().getItems()[i].getCells()[8].setType("Reject")};
        			 
        	  if(evt.getSource().getItems()[i].getCells()[6].getSelectedKey() == "R" || evt.getSource().getItems()[i].getCells()[0].getText() == "STP" ){
        		  evt.getSource().getItems()[i].getCells()[1].setValue("").setVisible(false);  
        	  }else{
        		  evt.getSource().getItems()[i].getCells()[1].setVisible(true);  
        	  }
        	  
        	  if(evt.getSource().getItems()[i].getCells()[2].getItems()[0].getSelectedKey() == "" ){
        		  evt.getSource().getItems()[i].getCells()[2].getItems()[1].setVisible(false).setValue();
        	  }
        	  
        	  if(evt.getSource().getItems()[i].getCells()[0].getText() == "STP"){
        		  evt.getSource().getItems()[i].getCells()[2].getItems()[1].setVisible(true);
        	  }
        	  
          }
          
          var key = that.getView().byId("idrotatiob").getSelectedKey();
          
          for(var i=1;i<evt.getSource().getItems().length;i++){
        	  if(evt.getSource().getItems()[i].getCells()[0].getText() == evt.getSource().getItems()[i-1].getCells()[0].getText()){
        		  	if(key == "M"){
        		  		evt.getSource().getItems()[i].getCells()[1].setEditable(true).setShowValueHelp(true);
        		  	}else{
        		  		evt.getSource().getItems()[i].getCells()[1].setEditable(false);
        		  	}
        		  	evt.getSource().getItems()[i].getCells()[2].getItems()[0].setEnabled(true);	
        		  	evt.getSource().getItems()[i].getCells()[2].getItems()[1].setEnabled(true);
	                evt.getSource().getItems()[i].getCells()[3].setEditable(true);
	                evt.getSource().getItems()[i].getCells()[4].setEditable(true);
	                evt.getSource().getItems()[i].getCells()[5].setEditable(true);
	                evt.getSource().getItems()[i].getCells()[6].setEnabled(false).setSelectedKey("O");
	                
	                if(evt.getSource().getItems()[i].getCells()[0].getText() == "STP"){
	                	evt.getSource().getItems()[i].getCells()[2].getItems()[0].setEnabled(true);
	                	evt.getSource().getItems()[i].getCells()[2].getItems()[1].setVisible(true).setEnabled(true);
	                }
        	  }else{
        		  	if(key == "A")
        		  		evt.getSource().getItems()[i].getCells()[1].setEditable(false).setShowValueHelp(true);
        		  	else if(key == "M"){
        		  		evt.getSource().getItems()[i].getCells()[1].setEditable(true).setShowValueHelp(true);
        		  	}	
        		  	evt.getSource().getItems()[i].getCells()[2].getItems()[0].setEnabled(false); 
        		  	evt.getSource().getItems()[i].getCells()[2].getItems()[1].setEnabled(false);
        		  	evt.getSource().getItems()[i].getCells()[3].setEditable(false);
        		  	evt.getSource().getItems()[i].getCells()[4].setEditable(false);
	                evt.getSource().getItems()[i].getCells()[5].setEditable(false);
	                evt.getSource().getItems()[i].getCells()[6].setEnabled(true);
        	  
        	  }
        	  
          }*/
      
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
     onItemNo:function(evt){																		// september 5
    		that.Itemlfld=evt.getSource();
			var obj=that.Itemlfld.getParent().getBindingContext().getObject();	
			
			var tyre_company = obj.NonJkCompany;
			var owner        = obj.Owner;
			var prod_size  	 = obj.ProdSize;
			var proddesc     = that.Itemlfld.getParent().getCells()[3].getValue();
			
			obj.StnclNumber = "";
			
			;
			that.Itemlfld.getParent().getCells()[3].setValueState("None");
			if(proddesc==""){
				sap.m.MessageToast.show("Select Tyre Size");
				that.Itemlfld.getParent().getCells()[3].setValueState("Error");
				return;
			}

			if(kunnr){
				var path = evt.getSource().getBindingContext().getPath().split('/')[3];
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Item_CodeSet?$filter=CKunnr eq '"+kunnr+"' and CHub eq '"+hubCode+"' and CTyreCompany eq '"+tyre_company+"' and COwner eq '"+owner+"' and CProdSize eq '"+prod_size+"'";
						
			}
			
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false, false, null);
			var _valueHelpitemSelectDialog = new sap.m.SelectDialog(
					{

						title : "Select Description",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem(
									{
										title :"{Maktx}" ,
										customData : [ new sap.ui.core.CustomData(
												{
													key : "Key",
													value : "{Maktx}"
												}) ],

									}),
						},
						liveChange : function(oEvent) {
							var sValue = oEvent.getParameter("value");

							var oFilter = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);

							oEvent.getSource().getBinding("items").filter([ oFilter ]);
						},
						confirm : [ this._handleTypeitmClose, this ],
						cancel : [ this._handleTypeitmClose, this ]
					});
			_valueHelpitemSelectDialog.setModel(jModel);
			_valueHelpitemSelectDialog.open();
		},
		_handleTypeitmClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				that.Itemlfld.setValue(oSelectedItem.getTitle());
				that.Itemlfld.getParent().getBindingContext().getObject().ItemCode=oSelectedItem.getBindingContext().getObject().Matnr;
				that.Itemlfld.getParent().getBindingContext().getObject().StnclNumber="";
				that.Itemlfld.getParent().getBindingContext().getObject().TyreType="";
				that.Itemlfld.getParent().getBindingContext().getObject().TyreLoc="";								
				that.Itemlfld.getParent().getBindingContext().getObject().IpCondition="";
				that.Itemlfld.getParent().getBindingContext().getObject().IpPsi="";
				that.Itemlfld.getParent().getBindingContext().getObject().OrigNsd="";
				that.Itemlfld.getParent().getBindingContext().getObject().G1Nsd="";
				that.Itemlfld.getParent().getBindingContext().getObject().G2Nsd="";
				that.Itemlfld.getParent().getBindingContext().getObject().G3Nsd="";
				that.Itemlfld.getParent().getBindingContext().getObject().G4Nsd="";
				that.Itemlfld.getParent().getBindingContext().getObject().Remarks="";
				
				var len = that.Itemlfld.getParent().getBindingContext().getObject().VitemToServiceNvg.results.length;
				for(var i=0;i<len;i++){
					that.Itemlfld.getParent().getBindingContext().getObject().VitemToServiceNvg.results[i].ServiceSelect = "";
				}
				
				that.Itemlfld.getParent().getCells()[5].setShowValueHelp(true).setValue("");
				that.Itemlfld.getParent().getCells()[8].setType("Reject");
			}
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
     onSerSheetVech:function(evt){
              var that = this;
              that.onServiceButton=evt.getSource();

                if (!that._SheetHelpDialog) {
                    that._SheetHelpDialog = sap.ui.xmlfragment("zfltinspcreate.view.ServiceSheet", that);
                    that.getView().addDependent(that._SheetHelpDialog);
                }

                var ShetModel = new sap.ui.model.json.JSONModel(that.data);
                sap.ui.getCore().byId("IdObj1").setTitle("Vehicle Reg. Number");
                sap.ui.getCore().byId("IdObj1").setText(that.data.RegNo);
                sap.ui.getCore().byId("IdObj").setVisible(false);

                sap.ui.getCore().byId("IdObj5").setVisible(false);

                var tab=sap.ui.getCore().byId("Servicetbl");
                tab.setModel(ShetModel);

                var temp = new sap.m.ColumnListItem({
                  cells : [
                           new sap.m.Text({text:"{ServiceDesc}"}),
                           ],selected:"{path:'ServiceSelect',formatter:'zfltinspcreate.util.Formatter.SelecFlg'}"
                });

                tab.bindAggregation("items" ,{ path : "/RegnoToServiceNvg/results",template : temp});
                
                var obj = that._SheetHelpDialog.open();
                obj.setEscapeHandler(function(obj){
                	obj.reject();
                });

            },
//////////////////////////////////////////////////////////////////////////////////////////////////
     onSerSheet:function(evt){
              var that=this;
              if(evt.getSource().getParent().getCells()[5].getValue()!=""){
            	  evt.getSource().getParent().getCells()[5].setValueState("None");
              that.onServiceButton=evt.getSource();
              var that = this;

                  if (!that._SheetHelpDialog) {
                    that._SheetHelpDialog = sap.ui.xmlfragment("zfltinspcreate.view.ServiceSheet", that);
                    that.getView().addDependent(that._SheetHelpDialog);
                  }

                var ShetModel = new sap.ui.model.json.JSONModel(evt.getSource().getBindingContext().getObject());
                sap.ui.getCore().byId("IdObj1").setTitle("Vehicle Reg. Number");
                sap.ui.getCore().byId("IdObj1").setText(that.data.RegNo);
                sap.ui.getCore().byId("IdObj").setTitle("Stencil No");
                sap.ui.getCore().byId("IdObj").setText(evt.getSource().getBindingContext().getObject().StnclNumber);
                sap.ui.getCore().byId("IdObj5").setTitle("Position");
                sap.ui.getCore().byId("IdObj5").setText(evt.getSource().getBindingContext().getObject().Zposition+" ("+evt.getSource().getBindingContext().getObject().PositionDesc+")");
                var tab=sap.ui.getCore().byId("Servicetbl");
                tab.setModel(ShetModel)

                var temp = new sap.m.ColumnListItem({
                  cells : [
                           new sap.m.Text({text:"{ServiceDesc}"}),
                           
                           ],selected:"{path:'ServiceSelect',formatter:'zfltinspcreate.util.Formatter.SelecFlg'}"
                });

                tab.bindAggregation("items" ,{ path : "/VitemToServiceNvg/results",template : temp});
                
                var obj = that._SheetHelpDialog.open();
                obj.setEscapeHandler(function(obj){
                	obj.reject();
                });
                
              }

              else{
                sap.m.MessageToast.show("Select Stencil Number");
                evt.getSource().getParent().getCells()[5].setValueState("Error");
              }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
      detaiPress:function(evt){
            																						//19.09.2019
             
             var lmilostatus = this.getView().byId("idLastMilo").getSelectedKey();
             var cmilostatus = this.getView().byId("idEarPSI").getSelectedKey();
             var lmilo       = this.getView().byId("idLastKm").getText();
             var cmilo       = this.getView().byId("idMilReading").getValue();
             var ckm         = this.getView().byId("idMulReading").getValue();
             
             this.getView().byId("idEarPSI").setValueState("None");	
             this.getView().byId("idMilReading").setValueState("None");
             this.getView().byId("idMulReading").setValueState("None");
             evt.getSource().getParent().getCells()[5].setValueState("None");
             
             if(cmilostatus==""){
            	 this.getView().byId("idEarPSI").setValueState("Error");	 
            	 sap.m.MessageToast.show("Enter Milometer Status");
            	 return;              
             }
             
             if(lmilostatus == "Y" && cmilostatus == "Y" && (parseInt(cmilo) < 1 || cmilo =="")){
            	 this.getView().byId("idMilReading").setValueState("Error");		 
            	 sap.m.MessageToast.show("Enter Milometer Reading");
            	 return;
             }
             
             if(lmilostatus == "Y" && cmilostatus == "Y" && parseInt(lmilo) > parseInt(cmilo)){
            	 this.getView().byId("idMilReading").setValueState("Error");
            	 sap.m.MessageToast.show("Milometer Reading cannot be less than Last Milometer Reading");
            	 return;
            }            
             
             if(lmilostatus == "Y" && cmilostatus == "N" && (parseInt(ckm) < 1 || ckm =="")){
            	 this.getView().byId("idMulReading").setValueState("Error");
            	 sap.m.MessageToast.show("Enter KM Covered");
            	 return;
            }

            if(lmilostatus == "N" && cmilostatus == "Y" && (parseInt(cmilo) < 1 || cmilo =="")){
            	this.getView().byId("idMilReading").setValueState("Error");
            	sap.m.MessageToast.show("Enter Milometer Reading");
            	return;
            }              
             
             if(lmilostatus == "N" && cmilostatus == "Y" && (parseInt(ckm) < 1 || ckm =="")){
            	 this.getView().byId("idMulReading").setValueState("Error");
            	 sap.m.MessageToast.show("Enter KM Covered");
            	 return;
            }              

            if(lmilostatus == "N" && cmilostatus == "N" && (parseInt(ckm) < 1 || ckm =="")){
            	this.getView().byId("idMulReading").setValueState("Error");
            	sap.m.MessageToast.show("Enter KM Covered");
            	return;
            }

              that.EntreItem=evt.getSource().getParent();


              var dataModel = new sap.ui.model.json.JSONModel(that.EntreItem.getBindingContext().getObject());
              var G1NsdVal = dataModel.getData().G1Nsd;
               

              if(evt.getSource().getParent().getCells()[6].getSelectedKey() === ""){
                sap.m.MessageToast.show("Select Action");
              }
              else{
              
              if(evt.getSource().getParent().getCells()[5].getValue()!=""){
                that.entriesbutton=evt.getSource();
                if(G1NsdVal > 0)
                  {
                  if (!this._EntriesHelpDialog) {
                    this._EntriesHelpDialog = sap.ui.xmlfragment("zfltinspcreate.view.Entries", this);
                  }
                    this.getView().addDependent(this._EntriesHelpDialog);
                    this.dialogFlag = "O";
                    sap.ui.getCore().byId("IdObjN1").setTitle("Vehicle Reg. Number");
                    sap.ui.getCore().byId("IdObjN1").setText(that.data.RegNo);
                    sap.ui.getCore().byId("IdObjN2").setTitle("Stencil No");
                    sap.ui.getCore().byId("IdObjN2").setText(evt.getSource().getBindingContext().getObject().StnclNumber);
                    sap.ui.getCore().byId("IdObjN3").setTitle("Position");
                    sap.ui.getCore().byId("IdObjN3").setText(evt.getSource().getBindingContext().getObject().Zposition+" ("+evt.getSource().getBindingContext().getObject().PositionDesc+")");
                  }
                else
                  {
                  if (!this._EntriesHelpDialog) {
                    this._EntriesHelpDialog = sap.ui.xmlfragment("zfltinspcreate.view.NewEntries", this);
                  }
                    this.getView().addDependent(this._EntriesHelpDialog);
                    this.dialogFlag = "N";
                    sap.ui.getCore().byId("IdObj2").setTitle("Vehicle Reg. Number");
                    sap.ui.getCore().byId("IdObj2").setText(that.data.RegNo);
                    sap.ui.getCore().byId("IdObj3").setTitle("Stencil No");
                    sap.ui.getCore().byId("IdObj3").setText(evt.getSource().getBindingContext().getObject().StnclNumber);
                    sap.ui.getCore().byId("IdObj4").setTitle("Position");
                    sap.ui.getCore().byId("IdObj4").setText(evt.getSource().getBindingContext().getObject().Zposition+" ("+evt.getSource().getBindingContext().getObject().PositionDesc+")");
                  }

              this._EntriesHelpDialog.setModel(dataModel,"Recodings");
              var buttonType = evt.getSource().getType();
              var position = evt.getSource().getParent().getCells()[0].getText();

              if(evt.getSource().getBindingContext().getObject().Owner!="01" && evt.getSource().getBindingContext().getObject().NonJkCompany!="JK" ){
                if (this.dialogFlag == "O"){
                sap.ui.getCore().byId("idEarGvw").setVisible(false);
                }
                sap.ui.getCore().byId("idNG4").setVisible(false);

                }else{
                  if (this.dialogFlag == "O"){
                sap.ui.getCore().byId("idEarGvw").setVisible(true);
                  }
                sap.ui.getCore().byId("idNG4").setVisible(true);
              }

              
              if(evt.getSource().getBindingContext().getObject().Zposition == 'STP'){
              	sap.ui.getCore().byId("idNKm").setValue().setEnabled(false);
              }else if(evt.getSource().getBindingContext().getObject().Zposition != 'STP'){
              	sap.ui.getCore().byId("idNKm").setEnabled(true);
              }
              
                if(buttonType == "Accept")
	            {
	                var nip = that.EntreItem.getBindingContext().getObject().NIpCondition;
	                var npsi = that.EntreItem.getBindingContext().getObject().NIpPsi;
	                var nkm = that.EntreItem.getBindingContext().getObject().NKmSuspended;
	                var nkmcov = that.EntreItem.getBindingContext().getObject().NKmCovered;		//
	                var nonsd = that.EntreItem.getBindingContext().getObject().NOrigNsd;
	                var nnsd1 = that.EntreItem.getBindingContext().getObject().NG1Nsd;
	                var nnsd2 = that.EntreItem.getBindingContext().getObject().NG2Nsd;
	                var nnsd3 = that.EntreItem.getBindingContext().getObject().NG3Nsd;
	                var nnsd4 = that.EntreItem.getBindingContext().getObject().NG4Nsd;
	                var minnsd = that.EntreItem.getBindingContext().getObject().NMinNsd;
	                var nrem = that.EntreItem.getBindingContext().getObject().NRemarks;
	
	                if (this.dialogFlag == "N"){
	                  sap.ui.getCore().byId("idNOrigNsd").setValue(nonsd);
	                  }
	                if (this.dialogFlag == "O"){
	                  sap.ui.getCore().byId("idNKm").setValue(nkm);
	                }
	
	                sap.ui.getCore().byId("idNIp").setSelectedKey(nip);
	                sap.ui.getCore().byId("idNPsi").setValue(npsi);
	                sap.ui.getCore().byId("idNKMCov").setValue(nkmcov);		//
	                sap.ui.getCore().byId("idNG1").setValue(nnsd1);
	                sap.ui.getCore().byId("idNG2").setValue(nnsd2);
	                sap.ui.getCore().byId("idNG3").setValue(nnsd3);
	                sap.ui.getCore().byId("idNG4").setValue(nnsd4);
	                sap.ui.getCore().byId("idNMin").setValue(minnsd);
	                sap.ui.getCore().byId("idNRem").setValue(nrem);
	
	            } 
                else 
                	{
                	sap.ui.getCore().byId("idNKMCov").setValue(ckm);
                	
		                	if(evt.getSource().getBindingContext().getObject().Zposition == 'STP' || evt.getSource().getParent().getCells()[6].getEnabled()== false){
		                    	sap.ui.getCore().byId("idNKMCov").setValue().setValue("");
		                    	sap.ui.getCore().byId("idNKm").setValue().setEnabled(false);
		                    }else if(evt.getSource().getBindingContext().getObject().Zposition != 'STP'){
		                    	sap.ui.getCore().byId("idNKm").setEnabled(true);
		                    }
                	}

                var oPar = this._EntriesHelpDialog.open();
                oPar.setEscapeHandler(function(oPar){
                	oPar.reject();
                });

              }else{
            	evt.getSource().getParent().getCells()[5].setValueState("Error");  
                sap.m.MessageToast.show("Select Stencil Number");
              }
            }

            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            handleUploadComplete: function(oEvent){
              var sResponse = oEvent.getParameter("response");
                sResponse = sResponse.split("Added");
              if (sResponse) {
                that.actionItem=oEvent.getSource();
                that.actionMainItem=oEvent.getSource().getParent();
                var table=oEvent.getSource().getParent().getParent();
                var index=table.getItems().indexOf(oEvent.getSource().getParent());

                oEvent.getSource().getParent().getBindingContext().getObject().String=sResponse[1];
                sap.m.MessageToast.show("File Uploaded Successfully");

                      }

            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            onTabelServiceOK:function(){
            var items=sap.ui.getCore().byId("Servicetbl").getSelectedItems();
              that.onServiceButton.setType("Accept");
              that._SheetHelpDialog.close();
              that._SheetHelpDialog.destroy();
              that._SheetHelpDialog=undefined;

            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            onTabelEntriesClose:function(){
              this._EntriesHelpDialog.close();
              this._EntriesHelpDialog.destroy();
              this._EntriesHelpDialog=undefined;
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
       onTabelEntrieOk:function(){
              

              var CopyData=sap.ui.getCore().byId("iDKing").getModel("Recodings").getData();

              var arr=[];

              var ripcon = sap.ui.getCore().byId("idNIp").getSelectedKey(); 
              var rippsi = sap.ui.getCore().byId("idNPsi").getValue(); 
              var rnkm   = sap.ui.getCore().byId("idNKm").getValue();
              var rnkmcov= sap.ui.getCore().byId("idNKMCov").getValue();		//
              var rnnsd1 = sap.ui.getCore().byId("idNG1").getValue();   
              var rnnsd2 = sap.ui.getCore().byId("idNG2").getValue();   
              var rnnsd3 = sap.ui.getCore().byId("idNG3").getValue();   
              var rnnsd4 = sap.ui.getCore().byId("idNG4").getValue();  
              var rnrem  = sap.ui.getCore().byId("idNRem").getValue();   

              if(ripcon==""){
                sap.m.MessageToast.show("Select IP Condition");
                return
              }
              if(rippsi=="" || rippsi < "0"){
                sap.m.MessageToast.show("Enter IP (PSI)");
                return
              }

              if(rnnsd1==""||parseFloat(rnnsd1)==0){
                sap.m.MessageToast.show("Enter G1");
                return
              }else{
                arr.push(rnnsd1);
              }

              if(rnnsd2==""||parseFloat(rnnsd2)==0){
                sap.m.MessageToast.show("Enter G2");
                return
              }else{
                arr.push(rnnsd2);
              }

              if(rnnsd3=="" ||parseFloat(rnnsd3)==0){
                sap.m.MessageToast.show("Enter G3");
                return
              }else{
                arr.push(rnnsd3);
              }

              if(rnnsd4=="" ||parseFloat(rnnsd4)==0){
                rnnsd4 = "0.00";
              }
              else{
                arr.push(rnnsd4);
              }

              var minnsd = Math.min.apply(null,arr);
              if (minnsd==Infinity){
                minnsd = "";
              }

              if(rnrem=="" ){
                sap.m.MessageToast.show("Enter Remarks");
                return
              }

              if(parseFloat(rnnsd1)> parseFloat(CopyData.G1Nsd) && this.dialogFlag!="N"){
                sap.m.MessageToast.show("G1 can't be greater than old G1");
                return
              }
              if(parseFloat(rnnsd2)> parseFloat(CopyData.G2Nsd)&& this.dialogFlag!="N"){
                sap.m.MessageToast.show("G2 can't be greater than old G2");
                return
              }

              if(parseFloat(rnnsd3)> parseFloat(CopyData.G3Nsd)&& this.dialogFlag!="N"){
                sap.m.MessageToast.show("G3 can't be greater than old G3");
                return
              }

              if(parseFloat(rnnsd4)> parseFloat(CopyData.G4Nsd)&& this.dialogFlag!="N"){
                sap.m.MessageToast.show("G4 can't be greater than old G4");
                return
              }

              if(parseFloat(rnnsd1)<3 ||parseFloat(rnnsd2)<3 ||parseFloat(rnnsd3)<3 
                  ||parseFloat(rippsi)<100){
                if(rnrem=="" || rnrem==undefined){
                sap.m.MessageToast.show("Fill Remarks");
                return
                }
              }

              if(rnnsd4 == "" || rnnsd4 == " "){
                rnnsd4 = "0.00";
              }
              if(rnkm == "" || rnkm == " "){
                rnkm = "0.00";
              }
              rnorig = "0.00";
              
              if(rnkmcov == ''){
            	  rnkmcov = "0.00";
              }
              

              that.CopyData = CopyData;
              that.EntreItem.getBindingContext().getObject().NIpCondition=ripcon;
              that.EntreItem.getBindingContext().getObject().NIpPsi=rippsi;
              that.EntreItem.getBindingContext().getObject().NKmSuspended=rnkm;
              that.EntreItem.getBindingContext().getObject().NKmCovered=rnkmcov;		//
              that.EntreItem.getBindingContext().getObject().NOrigNsd=rnorig;
              that.EntreItem.getBindingContext().getObject().NG1Nsd=rnnsd1;
              that.EntreItem.getBindingContext().getObject().NG2Nsd=rnnsd2;
              that.EntreItem.getBindingContext().getObject().NG3Nsd=rnnsd3;
              that.EntreItem.getBindingContext().getObject().NG4Nsd=rnnsd4;
              that.EntreItem.getBindingContext().getObject().NRemarks=rnrem;
              that.EntreItem.getBindingContext().getObject().NMinNsd=minnsd;
              this.tyrePos = CopyData.Zposition;
              
              if(rippsi < 90){
					var dialog 	= new sap.m.Dialog({
				        title : 'Warning',
				        type : 'Message',
				        content : [ new sap.m.Label({
				          text : 'Low inflation - Are you sure?'
				        }) ],
				        beginButton : new sap.m.Button({
				          text : 'Yes',
				          press : function() {
				        	  dialog.close();
				        	  that.entriesbutton.setType("Accept");
				        	  that._EntriesHelpDialog.close();
				        	  that._EntriesHelpDialog.destroy();
				        	  that._EntriesHelpDialog=undefined;
				        
				          }
				        }),
				        endButton : new sap.m.Button({
				          text : 'No',
				          press : function() {
				        	  sap.ui.getCore().byId("idNPsi").setValue();
				        	  dialog.destroy();
				          }
				        }),
				        
					});
					dialog.open();
					return;
			} else if(rippsi > 180){
				
				var dialog = new sap.m.Dialog({
			        title : 'Warning',
			        type : 'Message',
			        content : [ new sap.m.Label({
			          text : 'Over inflation - Are you sure?'
			        }) ],
			        beginButton : new sap.m.Button({
			          text : 'Yes',
			          press : function() {
			        	  dialog.destroy();
			        	  that.entriesbutton.setType("Accept");
			        	  that._EntriesHelpDialog.close();
			        	  that._EntriesHelpDialog.destroy();
			        	  that._EntriesHelpDialog=undefined;
			        	
			          }
			        }),
			        endButton : new sap.m.Button({
			          text : 'No',
			          press : function() {
			        	  sap.ui.getCore().byId("idNPsi").setValue();
			        	  dialog.destroy();
			          }
			        }),
			        
				});
				dialog.open();
				return;
		} else {
			 that.entriesbutton.setType("Accept");
             this._EntriesHelpDialog.close();
             this._EntriesHelpDialog.destroy();
             this._EntriesHelpDialog=undefined;
		}
             

              this.getView().byId("idEarPSI").setEnabled(false);
              this.getView().byId("idMilReading").setEnabled(false);
              this.getView().byId("idMulReading").setEnabled(false);

            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            NumberValid : function(oEvent)
            {
              var val = oEvent.getSource().getValue();
              if(val){
                if(isNaN(val) || val.charCodeAt(val.length-1)==32){
                  val = val.substring(0, val.length - 1);
                  oEvent.getSource().setValue(val);
                }else if(val.indexOf(".")!="-1"){
                  val = val.substring(0, val.length - 1);
                  oEvent.getSource().setValue(val);
                }
              }
              
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            validSuspended : function(oEvent)														// 20.09.2019
            {
              
              var val = oEvent.getSource().getValue();
              if(val){
                if(isNaN(val) || val.charCodeAt(val.length-1)==32){
                  val = val.substring(0, val.length - 1);
                  oEvent.getSource().setValue(val);

                }else if(val.indexOf(".")!="-1"){
                  val = val.substring(0, val.length - 1);
                  oEvent.getSource().setValue(val);
                }
              };

              var km = that.getView().byId("idMulReading").getValue();
              
              if(parseInt(val) > parseInt(km) ){
                sap.m.MessageToast.show("Suspended KM cannot be greater than KM covered");
                oEvent.getSource().setValue();
                sap.ui.getCore().byId("idNKMCov").setValue(that.getView().byId("idMulReading").getValue());
                return
              };
              sap.ui.getCore().byId("idNKMCov").setValue(that.getView().byId("idMulReading").getValue() - val);
            },

//////////////////////////////////////////////////////////////////////////////////////////////////
            milovalid : function(oEvent)
            {
              var val = oEvent.getSource().getValue();
              if(val){
                if(isNaN(val) || val.charCodeAt(val.length-1)==32){
                  val = val.substring(0, val.length - 1);
                  oEvent.getSource().setValue(val);

                }else if(val.indexOf(".")!="-1"){
                  val = val.substring(0, val.length - 1);
                  oEvent.getSource().setValue(val);
                }
              }

              var lmilo = this.getView().byId("idLastKm").getText();
              var cmilo = this.getView().byId("idMilReading").getValue();

              var lm = this.getView().byId("idLastMilo").getSelectedKey();
              var m  = this.getView().byId("idEarPSI").getSelectedKey();

              if ( lm == "Y" && m == "Y" ){
                var km = parseInt(cmilo) - parseInt(lmilo);
                this.getView().byId("idMulReading").setValue(km);
              }
            },

//////////////////////////////////////////////////////////////////////////////////////////////////
            onMiloMeter:function(evt){
              var key=evt.getSource().getSelectedKey();
              var last = this.getView().byId("idLastMilo").getSelectedKey();

              this.getView().byId("idMilReading").setValue();
              this.getView().byId("idMulReading").setValue();

              if(last == "Y" && key == "Y"){
                this.getView().byId("idMilReading").setEnabled(true);
                this.getView().byId("idmilolbl").setRequired(true);
                this.getView().byId("idMulReading").setEnabled(false);
                this.getView().byId("idkmlbl").setRequired(false);

              }else if(last == "N" && key=="Y"){
                this.getView().byId("idMilReading").setEnabled(true);
                this.getView().byId("idmilolbl").setRequired(true);
                this.getView().byId("idMulReading").setEnabled(true);
                this.getView().byId("idkmlbl").setRequired(true);
              }
              else if(last == "Y"  && key=="N" ){
                this.getView().byId("idMilReading").setEnabled(false);
                this.getView().byId("idmilolbl").setRequired(false);
                this.getView().byId("idMulReading").setEnabled(true);
                this.getView().byId("idkmlbl").setRequired(true);
              } 
              else if(last == "N" && key=="N"){
                this.getView().byId("idMilReading").setEnabled(false);
                this.getView().byId("idmilolbl").setRequired(false);
                this.getView().byId("idMulReading").setEnabled(true);
                this.getView().byId("idkmlbl").setRequired(true);
              }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            onYearChange:function(evt){
              var value=evt.getSource().getValue();
              var year=new Date().getFullYear();
              if(parseInt(value)>year){
                sap.m.MessageToast.show("Select Valid Year");
                evt.getSource().setValue();
                that.data.RegYear="";
              }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            NumberValid1: function(oEvent)
            {
              var val = oEvent.getSource().getValue();
              $(this).val($(this).val().replace(/[^0-9\.]/g,''));
                    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                        event.preventDefault();
                    }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
        
            
            /* old function 
             *   NsdValid : function(oEvent)
            {
              var val = oEvent.getSource().getValue();
              if(val){
                if(isNaN(val)){
                  val = val.substring(0, val.length - 1);
                  oEvent.getSource().setValue(val);
                }
              }
              
          if(parseInt(val) > 99){
            oEvent.getSource().setValue("");
            sap.m.MessageBox.alert(
                "NSD value cannot be greater than 100", {
                  icon: sap.m.MessageBox.Icon.WARNING,
                  title: "Error"
                }
              );
          }  
              
            },
            */
            
//////////////////////////////////////////////////////////////////////////////////////////////////            
                NsdValid : function(oEvent)
                {
                  var val = oEvent.getSource().getValue();
                  if(val){
                    if(isNaN(val) || val.charCodeAt(val.length-1)==32){
                      val = val.substring(0, val.length - 1);
                      oEvent.getSource().setValue(val);
                    }
                  }
                  
              if(parseInt(val) > 99){
                oEvent.getSource().setValue("");
                sap.m.MessageBox.alert(
                    "NSD value cannot be greater than 100", {
                      icon: sap.m.MessageBox.Icon.WARNING,
                      title: "Error"
                    }
                  );
              }  
              if(val[val.length-3]==".")
              {
            	  val = val.substring(0,val.length - 1);
            	  oEvent.getSource().setValue(val);
              }
                },
//////////////////////////////////////////////////////////////////////////////////////////////////
            NumberValid2: function(oEvent){
              var val = oEvent.getSource().getValue();

               var ex = /^[0-9]+\.?[0-9]*$/;
                if(ex.test(val)==false){
                  val = val.substring(0,val.length - 1);
                  oEvent.getSource().setValue(val);
                 }else{
                   
                   var a = val.split(".");
                   var c = a[0];
                   if(a[1].length>2){
                     var d = a[1].substring(0,a[1].length - 1);
                     var e = [c,d];
                     var f = e.join(".");
                     oEvent.getSource().setValue(f);
                     sap.m.MessageToast.show("You can enter upto 2 Decimal Digits."); 
                   }
                     
                 }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            payLoadDate: function(SDateValue) 
            {
              var str = "T00:00:00";
              var currentTime = new Date(SDateValue);
              var month = currentTime.getMonth() + 1;
              if(month.toString().length == 1)
                month = "0" + month;
              var day = currentTime.getDate();
              if(day.toString().length == 1)
                day = "0" + day;
              var year = currentTime.getFullYear();
              var date = year + "-" + month + "-" + day + str;
              return date;
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
      changeFitmentDate:function(evt){
    	  	
                var date=evt.getSource().getDateValue();
                var today=new Date();

                today.setHours(00,00,00);
                if(date.getTime()>today.getTime()){
                  sap.m.MessageToast.show("Inspection Date Cannot Be A Future Date");
                  evt.getSource().setDateValue(null);
                  return
                }

                var date1 = this.payLoadDate(date);
                var fitdate = that.data.FitmentDate;
                var insdate = that.data.LastInspDate;
                var revDate = that.data.ContEnrolDate;

                if(date1 < revDate){
                    sap.m.MessageToast.show("Inspection Date Cannot Be Before Contract Enrollment Date.");
                    evt.getSource().setDateValue(null);
                    return;
                }else if(date1 < fitdate){
	                sap.m.MessageToast.show("Inspection Date Cannot Be Before Fitment Date.");
	                evt.getSource().setDateValue(null);
	                return;
                }else if(date1 < insdate && (insdate != null || insdate !="" )){
                	sap.m.MessageToast.show("Inspection Date Cannot Be Before Last Inspection Date.");
                	evt.getSource().setDateValue(null);
                	return;
                }
        },
//////////////////////////////////////////////////////////////////////////////////////////////////
      onStncNo:function(evt){
    	  ;
			that.Stcllfld=evt.getSource();
			var obj=that.Stcllfld.getParent().getBindingContext().getObject();	
			
			var tyre_company = obj.NonJkCompany;
			var owner        = obj.Owner;
			var prod_size    = obj.ProdSize;
			var matnr        = obj.ItemCode;
		
			that.Stcllfld.getParent().getCells()[4].setValueState("None");
			if(matnr==""){
				sap.m.MessageToast.show("Select Item Code");
				that.Stcllfld.getParent().getCells()[4].setValueState("Error");
				return;
			}
									
			var path = evt.getSource().getBindingContext().getPath().split('/')[3];
			var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4StencilNumberSet?$filter=CKunnr eq '"+kunnr+"' and CHubCode eq '"+hubCode+"' and CTyreCompany eq '"+tyre_company+"' and COwner eq '"+owner+"' and CProdSize eq '"+prod_size+"' and CMatnr eq '"+matnr+"' ";
				
				
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false,
					false, null);
			var _valueHelpStncSelectDialog = new sap.m.SelectDialog(
					{

						title : "Select Stencil No",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem(
									{
										title : "{StnclNumber}",
										customData : [ new sap.ui.core.CustomData(
												{
													key : "Key",
													value : "{StnclNumber}"
												}) ],

									}),
						},
						liveChange : function(oEvent) {
							var sValue = oEvent.getParameter("value");

							var oFilter = new sap.ui.model.Filter("StnclNumber",sap.ui.model.FilterOperator.Contains,sValue);

							oEvent.getSource().getBinding("items").filter([ oFilter ]);
						},
						confirm : [ this._handleTypeStncClose, this ],
						cancel : [ this._handleTypeStncClose, this ]
					});
			_valueHelpStncSelectDialog.setModel(jModel);
			_valueHelpStncSelectDialog.open();
			},
		_handleTypeStncClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var flg="";
				var item=that.Stcllfld.getParent();
				if(that.flg==0){
					var data=that.getView().byId("tblDetail").getItems();
				}else{
					var data=that.getView().byId("tblDetail1").getItems();	
				}
				var num=data.indexOf(item);
				
				for(i=0;i<data.length;i++){
					if(i!=num){
						if(data[i].getCells()[5].getValue()==oSelectedItem.getTitle()){
							flg="X";											
						}
					}
				}
				
				if(flg!="X"){
					that.Stcllfld.setValue(	oSelectedItem.getTitle());
					var CopyData=oSelectedItem.getBindingContext().getObject();
					var RecModel = new sap.ui.model.json.JSONModel(oSelectedItem.getBindingContext().getObject());
					that.Stcllfld.setModel(RecModel,"Recodings");
					
					that.Stcllfld.getParent().getBindingContext().getObject().TyreLoc=CopyData.TyreLoc;
					that.Stcllfld.getParent().getBindingContext().getObject().TyreType=CopyData.TyreType;
					
					that.Stcllfld.getParent().getCells()[8].setType("Reject");
					
					that.Stcllfld.getParent().getBindingContext().getObject().IpCondition=CopyData.IpCondition;
					that.Stcllfld.getParent().getBindingContext().getObject().TotKmCovered=CopyData.TotKmCovered;
					that.Stcllfld.getParent().getBindingContext().getObject().IpPsi=CopyData.IpPsi;
					that.Stcllfld.getParent().getBindingContext().getObject().OrigNsd=CopyData.OrigNsd;
					that.Stcllfld.getParent().getBindingContext().getObject().G1Nsd=CopyData.G1Nsd;
					that.Stcllfld.getParent().getBindingContext().getObject().G2Nsd=CopyData.G2Nsd;
					that.Stcllfld.getParent().getBindingContext().getObject().G3Nsd=CopyData.G3Nsd;
					that.Stcllfld.getParent().getBindingContext().getObject().G4Nsd=CopyData.G4Nsd;
					that.Stcllfld.getParent().getBindingContext().getObject().Remarks=CopyData.Remarks;
					
					var len = that.Stcllfld.getParent().getBindingContext().getObject().VitemToServiceNvg.results.length;
					for(var i=0;i<len;i++){
						that.Stcllfld.getParent().getBindingContext().getObject().VitemToServiceNvg.results[i].ServiceSelect = "";
					}
					
				}else{
					sap.m.MessageToast.show("Stencil No "+oSelectedItem.getTitle() +" already fitted.")
				}
			}
        },
//////////////////////////////////////////////////////////////////////////////////////////////////
     onTyreOk:function(){

              if(that.stnclfld.getParent().getCells()[2].sId.indexOf("input")!=-1){
                var item=that.stnclfld.getParent().getBindingContext().getObject().ItemCode;
                }else{
                var item="";
                }

              if(item!=""||that.stnclfld.getParent().getCells()[2].sId.indexOf("input")==-1){
                if(kunnr){
                  var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Stencil_NumberSet?$filter=CType eq 'I' and CRegNo eq '"+
                  				this.getView().byId("FVehicleNoEdit").getValue()+"'and CNonJkCompany eq '"
                  				+that.stnclfld.getParent().getBindingContext().getObject().NonJkCompany+"' and  CTyreType eq '' and CKunnr eq '"+ kunnr +
                  				"' and CTyreLoc eq ''  and CMatnr eq '"+that.stnclfld.getParent().getBindingContext().getObject().ItemCode+"' and " +
                  				"CMaktx eq '"+that.stnclfld.getParent().getBindingContext().getObject().ItemDesc+
                  				"' and COwner eq'"+that.stnclfld.getParent().getBindingContext().getObject().Owner+"'";
                }else{
                  var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Stencil_NumberSet?$filter=CType eq 'I' and CRegNo eq '"+
                  				this.getView().byId("FVehicleNoEdit").getValue()+"'and CNonJkCompany eq '"+
                  				that.stnclfld.getParent().getBindingContext().getObject().NonJkCompany+"' and  CTyreType eq '' and CKunnr eq '"+
                  				sap.ui.getCore().byId("idFleet").getName()+"' and CTyreLoc eq ''  and CMatnr eq '"+that.stnclfld.getParent().getBindingContext().getObject().ItemCode+
                  				"' and CMaktx eq '"+that.stnclfld.getParent().getBindingContext().getObject().ItemDesc+
                  				"' and COwner eq'"+that.stnclfld.getParent().getBindingContext().getObject().Owner+"'";
                }


              var jModel = new sap.ui.model.json.JSONModel();
              jModel.loadData(sPath, null, false, "GET", false,false, null);
              
              var _valueHelpStncSelectDialog = new sap.m.SelectDialog(
                  {

                    title : "Select Stencil No",
                    items : {
                      path : "/d/results",
                      template : new sap.m.StandardListItem(
                          {
                            title : "{StnclNumber}",
                            customData : [ new sap.ui.core.CustomData(
                                {
                                  key : "Key",
                                  value : "{StnclNumber}"
                                }) ],

                          }),
                    },
                    liveChange : function(oEvent) {
                      var sValue = oEvent.getParameter("value");

                      var oFilter = new sap.ui.model.Filter("StnclNumber",sap.ui.model.FilterOperator.Contains,sValue);

                      oEvent.getSource().getBinding("items").filter([ oFilter ]);
                    },
                    confirm : [ this._handleTypeStncClose, this ],
                    cancel : [ this._handleTypeStncClose, this ]
                  });
              _valueHelpStncSelectDialog.setModel(jModel);
              _valueHelpStncSelectDialog.open();

              }else{
                sap.m.MessageToast.show("Select Description")
              }

            },
//////////////////////////////////////////////////////////////////////////////////////////////////
       OnTableSelect:function(evt){
              
          if(sap.ui.getCore().byId("IdObj5").getVisible()){
            if(evt.getParameter("listItem").getSelected()){
              var Matnr=evt.getParameter("listItem").getBindingContext().getObject().ServiceCode;
              evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="X";
              if (!this._CutHelpDialog) {
                this._CutHelpDialog = sap.ui.xmlfragment("zfltinspcreate.view.Cut", this);
                this.getView().addDependent(this._CutHelpDialog);
              }
              that.evt=evt.getParameter("listItem").getBindingContext().getObject();
              that.evtItem=evt.getParameter("listItem");
              if(Matnr=="S02"){
                sap.ui.getCore().byId("IdCutPannel").setVisible(true);
                sap.ui.getCore().byId("idTypeCut").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
                sap.ui.getCore().byId("idcutwid").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[1].Value);
                sap.ui.getCore().byId("idcutsz").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[2].Value);
              this._CutHelpDialog.open();
              }
              else if(Matnr=="S04"){
                sap.ui.getCore().byId("IdNitroPanl").setVisible(true);
                sap.ui.getCore().byId("idNtPur").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
                //sap.ui.getCore().byId("idNitTP").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[1].Value);
                this._CutHelpDialog.open();
              }
              else if(Matnr=="S10"){
                sap.ui.getCore().byId("IdRotationpanl").setVisible(true);
                sap.ui.getCore().byId("idRTax").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
                sap.ui.getCore().byId("idRTWR").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[1].Value);
                this._CutHelpDialog.open();
              }
              else if(Matnr=="S14"){
                sap.ui.getCore().byId("IdAlinmntpanl").setVisible(true);
	            sap.ui.getCore().byId("ID1").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
	            sap.ui.getCore().byId("ID11").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[1].Value);
	            sap.ui.getCore().byId("ID2").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[2].Value);
	            sap.ui.getCore().byId("ID21").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[3].Value);
	            sap.ui.getCore().byId("ID3").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[4].Value);
	            sap.ui.getCore().byId("ID31").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[5].Value);
	            sap.ui.getCore().byId("ID4").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[6].Value);
                this._CutHelpDialog.open();
              }
              else if(Matnr=="S15"){
                sap.ui.getCore().byId("IdBlapanl").setVisible(true);
                sap.ui.getCore().byId("IDweig").setValue(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
                this._CutHelpDialog.open();
              }
              else if(Matnr=="S07"){
                sap.ui.getCore().byId("IdTMrem").setVisible(true);
                sap.ui.getCore().byId("idRTyCh").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
                this._CutHelpDialog.open();
              }
              else if(Matnr=="S11"){
                sap.ui.getCore().byId("IdTFW").setVisible(true);
                sap.ui.getCore().byId("idRTyCh1").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
                this._CutHelpDialog.open();
              }
              else if(Matnr=="S08"){
                sap.ui.getCore().byId("IdDeMount").setVisible(true);
                sap.ui.getCore().byId("idDeMountSelect").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
                this._CutHelpDialog.open();
              }
              else if(Matnr=="S09"){
                sap.ui.getCore().byId("IdMount").setVisible(true);
                sap.ui.getCore().byId("idMountSelect").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[0].Value);
                this._CutHelpDialog.open();
              }
            }else{
                evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="";
              }
          }else{
                if(evt.getParameter("listItem").getSelected()){
                  var Matnr=evt.getParameter("listItem").getBindingContext().getObject().ServiceCode;
                  evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="X";
                  if (!this._CutHelpDialog) {
                    this._CutHelpDialog = sap.ui.xmlfragment("zfltinspcreate.view.Cut", this);
                    this.getView().addDependent(this._CutHelpDialog);

                  }
                  that.evt=evt.getParameter("listItem").getBindingContext().getObject();
                  that.evtItem=evt.getParameter("listItem");
                  if(Matnr=="S02"){
                    sap.ui.getCore().byId("IdCutPannel").setVisible(true);
                    sap.ui.getCore().byId("idTypeCut").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
                    sap.ui.getCore().byId("idcutwid").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[1].Value);
                    sap.ui.getCore().byId("idcutsz").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[2].Value);
                  this._CutHelpDialog.open();
                  }
                  else if(Matnr=="S04"){
                    sap.ui.getCore().byId("IdNitroPanl").setVisible(true);
                    sap.ui.getCore().byId("idNtPur").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
                    //sap.ui.getCore().byId("idNitTP").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[1].Value);
                    this._CutHelpDialog.open();
                  }
                  else if(Matnr=="S10"){
                    sap.ui.getCore().byId("IdRotationpanl").setVisible(true);
                    sap.ui.getCore().byId("idRTax").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
                    sap.ui.getCore().byId("idRTWR").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[1].Value);
                    this._CutHelpDialog.open();
                  }
                  else if(Matnr=="S14"){
                    sap.ui.getCore().byId("IdAlinmntpanl").setVisible(true);
	                sap.ui.getCore().byId("ID1").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
	                sap.ui.getCore().byId("ID11").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[1].Value);
	                sap.ui.getCore().byId("ID2").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[2].Value);
	                sap.ui.getCore().byId("ID21").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[3].Value);
	                sap.ui.getCore().byId("ID3").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[4].Value);
	                sap.ui.getCore().byId("ID31").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[5].Value);
	                sap.ui.getCore().byId("ID4").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[6].Value);
                    this._CutHelpDialog.open();
                  }
                  else if(Matnr=="S15"){
                    sap.ui.getCore().byId("IdBlapanl").setVisible(true);
                    sap.ui.getCore().byId("IDweig").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
                    this._CutHelpDialog.open();
                  }
                  else if(Matnr=="S07"){
                    sap.ui.getCore().byId("IdTMrem").setVisible(true);
                    sap.ui.getCore().byId("idRTyCh").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
                    this._CutHelpDialog.open();
                  }
                  else if(Matnr=="S11"){
                    sap.ui.getCore().byId("IdTFW").setVisible(true);
                    sap.ui.getCore().byId("idRTyCh1").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
                    this._CutHelpDialog.open();
                  }
                  else if(Matnr=="S08"){
                    sap.ui.getCore().byId("IdDeMount").setVisible(true);
                    sap.ui.getCore().byId("idDeMountSelect").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
                    this._CutHelpDialog.open();
                  }
                  else if(Matnr=="S09"){
                    sap.ui.getCore().byId("IdMount").setVisible(true);
                    sap.ui.getCore().byId("idMountSelect").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
                    this._CutHelpDialog.open();
                  }
                  }else{
                    evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="";
                  }
              }

            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            onCutClose:function(){
              that.evt.ServiceSelect=""
                that.evtItem.setSelected(false);
                this._CutHelpDialog.close();
                this._CutHelpDialog.destroy();
                this._CutHelpDialog=undefined;
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
        onCutOk:function(){
              if(sap.ui.getCore().byId("IdObj5").getVisible()){
                if(sap.ui.getCore().byId("IdCutPannel").getVisible()){
                  var typeofCut=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
                  var WidthofCut=sap.ui.getCore().byId("idcutwid").getValue();
                  var patSize=sap.ui.getCore().byId("idcutsz").getValue();
                  if(typeofCut==""){
                    sap.m.MessageToast.show("Select Type of Cut");
                    return
                  }
                  if(WidthofCut==""){
                    sap.m.MessageToast.show("Enter Width of Cut");
                    return
                  }
                  if(patSize==""){
                    sap.m.MessageToast.show("Enter Patch Size");
                    return
                  }
                  that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
                  that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idcutwid").getValue();
                  that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("idcutsz").getValue();
                }
                if(sap.ui.getCore().byId("IdNitroPanl").getVisible()){
                  var nit=sap.ui.getCore().byId("idNtPur").getSelectedKey();
                  if(nit==""){
                    sap.m.MessageToast.show("Select Nitrogen Filling");
                    return
                  }

                  that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idNtPur").getSelectedKey();
                }
                if(sap.ui.getCore().byId("IdRotationpanl").getVisible()){
                  var nit=sap.ui.getCore().byId("idRTax").getSelectedKey();
                  var nittp=sap.ui.getCore().byId("idRTax").getSelectedKey();
                  if(nit==""){
                    sap.m.MessageToast.show("Select Rotation on Axles");
                    return
                  }
                  if(nittp==""){
                    sap.m.MessageToast.show("Rotation on Wheel Rim");
                    return
                  }
                  that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTax").getSelectedKey();
                  that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idRTWR").getSelectedKey()
                }
                if(sap.ui.getCore().byId("IdAlinmntpanl").getVisible()){
                  var nit=sap.ui.getCore().byId("ID1").getValue();
                  var nit1=sap.ui.getCore().byId("ID11").getValue();
                  var nit2=sap.ui.getCore().byId("ID2").getValue();
                  var nit3=sap.ui.getCore().byId("ID21").getValue();
                  var nit4=sap.ui.getCore().byId("ID3").getValue();
                  var nit5=sap.ui.getCore().byId("ID31").getValue();
                  var nit6=sap.ui.getCore().byId("ID4").getValue();

                  if(nit=="" || !(Math.abs(nit) >= 0 )){
                    sap.m.MessageToast.show("Enter Total Toe In (Before)");
                    return
                  }
                  if(nit1=="" || !(Math.abs(nit1) >= 0 )){
                    sap.m.MessageToast.show("Enter Total Toe In (After)");
                    return
                  }
                  if(nit2=="" || !(Math.abs(nit2) >= 0 )){
                    sap.m.MessageToast.show("Enter Thrust (Before)");
                    return
                  }
                  if(nit3=="" || !(Math.abs(nit3) >= 0 )){
                    sap.m.MessageToast.show("Enter Thrust (Before)");
                    return
                  }
                  if(nit4=="" || !(Math.abs(nit4) >= 0 )){
                    sap.m.MessageToast.show("Enter Scrub (Before)");
                    return
                  }
                  if(nit5=="" || !(Math.abs(nit5) >= 0 )){
                    sap.m.MessageToast.show("Enter Scrub (After)");
                    return
                  }
                  if(nit6==""){
                    sap.m.MessageToast.show("Enter Remarks");
                    return
                  }
                  that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("ID1").getValue();
                  that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("ID11").getValue();
                  that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("ID2").getValue();
                  that.evt.IservToSubservNvg.results[4].Value=sap.ui.getCore().byId("ID21").getValue();
                  that.evt.IservToSubservNvg.results[3].Value=sap.ui.getCore().byId("ID3").getValue();
                  that.evt.IservToSubservNvg.results[5].Value=sap.ui.getCore().byId("ID31").getValue();
                  that.evt.IservToSubservNvg.results[6].Value=sap.ui.getCore().byId("ID4").getValue();
                }
                if(sap.ui.getCore().byId("IdBlapanl").getVisible()){
                  var nit=sap.ui.getCore().byId("IDweig").getValue();

                  if(nit==""){
                    sap.m.MessageToast.show("Enter Weight added");
                    return
                  }
                  that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("IDweig").getValue();

                  }

                if(sap.ui.getCore().byId("IdTMrem").getVisible()){
                  var nit=sap.ui.getCore().byId("idRTyCh").getSelectedKey();

                  if(nit==""){
                    sap.m.MessageToast.show("Select Tyre Changer");
                    return
                  }

                  that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh").getSelectedKey();

                  }
                if(sap.ui.getCore().byId("IdTFW").getVisible()){
                  var nit=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
                  if(nit==""){
                    sap.m.MessageToast.show("Select Tyre Changer");
                    return
                  }
                  that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
                  }
                if(sap.ui.getCore().byId("IdDeMount").getVisible()){
                  var nit=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();
                  if(nit==""){
                    sap.m.MessageToast.show("Select Tyre Changer");
                    return
                  }
                  that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();
                  }
                if(sap.ui.getCore().byId("IdMount").getVisible()){
                  var nit=sap.ui.getCore().byId("idMountSelect").getSelectedKey();
                  if(nit==""){
                    sap.m.MessageToast.show("Select Tyre Changer");
                    return
                  }
                  that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idMountSelect").getSelectedKey();
                  }
                }else{
                  if(sap.ui.getCore().byId("IdCutPannel").getVisible()){
                    var typeofCut=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
                    var WidthofCut=sap.ui.getCore().byId("idcutwid").getValue();
                    var patSize=sap.ui.getCore().byId("idcutsz").getValue();
                    if(typeofCut==""){
                      sap.m.MessageToast.show("Select Type of Cut");
                      return
                    }
                    if(WidthofCut==""){
                      sap.m.MessageToast.show("Enter Width of Cut");
                      return
                    }
                    if(patSize==""){
                      sap.m.MessageToast.show("Enter Patch Size");
                      return
                    }
                    that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
                    that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idcutwid").getValue();
                    that.evt.VServToSubservNvg.results[2].Value=sap.ui.getCore().byId("idcutsz").getValue();
                  }
                  if(sap.ui.getCore().byId("IdNitroPanl").getVisible()){
                    var nit=sap.ui.getCore().byId("idNtPur").getSelectedKey();
//                    var nittp=sap.ui.getCore().byId("idNitTP").getSelectedKey();
                    if(nit==""){
                      sap.m.MessageToast.show("Select Nitrogen Filling");
                      return
                    }

                    that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idNtPur").getSelectedKey();
                    //that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idNitTP").getSelectedKey()
                  }
                  if(sap.ui.getCore().byId("IdRotationpanl").getVisible()){
                    var nit=sap.ui.getCore().byId("idRTax").getSelectedKey();
                    var nittp=sap.ui.getCore().byId("idRTax").getSelectedKey();
                    if(nit==""){
                      sap.m.MessageToast.show("Select Rotation on Axles");
                      return
                    }
                    if(nittp==""){
                      sap.m.MessageToast.show("Rotation on Wheel Rim");
                      return
                    }
                    that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTax").getSelectedKey();
                    that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idRTWR").getSelectedKey()
                  }
                  if(sap.ui.getCore().byId("IdAlinmntpanl").getVisible()){
                    var nit=sap.ui.getCore().byId("ID1").getValue();
                    var nit1=sap.ui.getCore().byId("ID11").getValue();
                    var nit2=sap.ui.getCore().byId("ID2").getValue();
                    var nit3=sap.ui.getCore().byId("ID21").getValue();
                    var nit4=sap.ui.getCore().byId("ID3").getValue();
                    var nit5=sap.ui.getCore().byId("ID31").getValue();
                    var nit6=sap.ui.getCore().byId("ID4").getValue();

                    if(nit=="" || !(Math.abs(nit) >= 0 )){ 
                      sap.m.MessageToast.show("Enter Total Toe In (Before)");
                      return
                    }
                    if(nit1=="" || !(Math.abs(nit1) >= 0 )){
                      sap.m.MessageToast.show("Enter Total Toe In (After)");
                      return
                    }
                    if(nit2=="" || !(Math.abs(nit2) >= 0 )){
                      sap.m.MessageToast.show("Enter Thrust (Before)");
                      return
                    }
                    if(nit3=="" || !(Math.abs(nit3) >= 0 )){
                      sap.m.MessageToast.show("Enter Thrust (After)");
                      return
                    }
                    if(nit4=="" || !(Math.abs(nit4) >= 0 )){
                      sap.m.MessageToast.show("Enter Scrub (Before)");
                      return
                    }
                    if(nit5=="" || !(Math.abs(nit5) >= 0 )){
                      sap.m.MessageToast.show("Enter Scrub (After)");
                      return
                    }
                    if(nit6==""){
                      sap.m.MessageToast.show("Enter Remarks");
                      return
                    }
                    that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("ID1").getValue();
                    that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("ID11").getValue();
                    that.evt.VServToSubservNvg.results[2].Value=sap.ui.getCore().byId("ID2").getValue();
                    that.evt.VServToSubservNvg.results[4].Value=sap.ui.getCore().byId("ID21").getValue();
                    that.evt.VServToSubservNvg.results[3].Value=sap.ui.getCore().byId("ID3").getValue();
                    that.evt.VServToSubservNvg.results[5].Value=sap.ui.getCore().byId("ID31").getValue();
                    that.evt.VServToSubservNvg.results[6].Value=sap.ui.getCore().byId("ID4").getValue();
                  }
                  if(sap.ui.getCore().byId("IdBlapanl").getVisible()){
                    var nit=sap.ui.getCore().byId("IDweig").getValue();

                    if(nit==""){
                      sap.m.MessageToast.show("Enter Weight added");
                      return
                    }
                    that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("IDweig").getValue();

                    }

                  if(sap.ui.getCore().byId("IdTMrem").getVisible()){
                    var nit=sap.ui.getCore().byId("idRTyCh").getSelectedKey();

                    if(nit==""){
                      sap.m.MessageToast.show("Select Tyre Changer");
                      return
                    }

                    that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh").getSelectedKey();

                    }
                  if(sap.ui.getCore().byId("IdTFW").getVisible()){
                    var nit=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
                    if(nit==""){
                      sap.m.MessageToast.show("Select Tyre Changer");
                      return
                    }
                    that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
                    }
                  if(sap.ui.getCore().byId("IdDeMount").getVisible()){
                    var nit=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();
                    if(nit==""){
                      sap.m.MessageToast.show("Select Tyre Changer");
                      return
                    }
                    that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();
                    }
                  if(sap.ui.getCore().byId("IdMount").getVisible()){
                    var nit=sap.ui.getCore().byId("idMountSelect").getSelectedKey();
                    if(nit==""){
                      sap.m.MessageToast.show("Select Tyre Changer");
                      return
                    }
                    that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idMountSelect").getSelectedKey();
                    }
                }
                this._CutHelpDialog.close();
                this._CutHelpDialog.destroy();
                this._CutHelpDialog=undefined;
              },
//////////////////////////////////////////////////////////////////////////////////////////////////
            onTabelServiceClose:function(){
              that._SheetHelpDialog.close();
              that._SheetHelpDialog.destroy();
              that._SheetHelpDialog=undefined;
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
/*            onIpPsiChange:function(evt){
              if(parseFloat(evt.getSource().getValue())>150){
                sap.m.MessageToast.show("Over-Inflation");
                sap.m.MessageBox.show("Over-Inflation - Are you sure?", {
                      title: "",
                      icon:"",
                  });
              }
              if(parseFloat(evt.getSource().getValue())<100){

                sap.m.MessageBox.show("Low inflation - Are you sure?", {
                    title: "",
                    icon:"",
                });
              }
            },*/
//////////////////////////////////////////////////////////////////////////////////////////////////
            DateNew:function(Date1){
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

//////////////////////////////////////////////////////////////////////////////////////////////////
          onFitmentCreate:function(){
              var check = false;
              

              if(this.getView().byId("FVehicleNoEdit").getValue()==""){
                this.getView().byId("FVehicleNoEdit").setValueState(sap.ui.core.ValueState.Error);
                check = true;
                }else
                  this.getView().byId("FVehicleNoEdit").setValueState(sap.ui.core.ValueState.None);

              if(that.getView().byId("FFitmentDateEdit").getDateValue()==null){
                this.getView().byId("FFitmentDateEdit").setValueState(sap.ui.core.ValueState.Error);
                check = true;
                }else
                  this.getView().byId("FFitmentDateEdit").setValueState(sap.ui.core.ValueState.None);

              if(this.getView().byId("idEarPSI").getSelectedKey()==""){
                this.getView().byId("idEarPSI").setValueState(sap.ui.core.ValueState.Error);
                check = true;
                }else
                  this.getView().byId("idEarPSI").setValueState(sap.ui.core.ValueState.None);

              if((that.getView().byId("idMulReading").getValue()=="" || that.getView().byId("idMulReading").getValue() < "1")){
                this.getView().byId("idMulReading").setValueState(sap.ui.core.ValueState.Error);
                check = true;
                }else 
                  this.getView().byId("idMulReading").setValueState(sap.ui.core.ValueState.None);

              if(that.getView().byId("idMilReading").getEnabled() && that.getView().byId("idMilReading").getValue()==""){
                this.getView().byId("idMilReading").setValueState(sap.ui.core.ValueState.Error);
                check = true;
                }else 
                  this.getView().byId("idMilReading").setValueState(sap.ui.core.ValueState.None);

              if(this.getView().byId("idmccon").getSelectedKey()==""){
                this.getView().byId("idmccon").setValueState(sap.ui.core.ValueState.Error);
                check = true;
                }else
                  this.getView().byId("idmccon").setValueState(sap.ui.core.ValueState.None);
              
              if(this.getView().byId("idReason").getSelectedKey()=="" && this.getView().byId("idReason").getVisible()==true ){
                  this.getView().byId("idReason").setValueState(sap.ui.core.ValueState.Error);
                  check = true;
                  }else
                    this.getView().byId("idReason").setValueState(sap.ui.core.ValueState.None);

              if(check == true)
                {
                sap.m.MessageToast.show("Please fill all the required fields.");
                return
                }

              if(that.getView().byId("FFitmentDateEdit").getDateValue()==null){
                sap.m.MessageToast.show("Select Fitment Date");
                return
              }

              var valid=that.validations();
              
              if(valid){
              var Data=$.extend( true, {}, that.data );
              delete Data.__metadata;
              delete Data.__proto__;
              Data.InspType = "02";
              
              if(Data.MeterReading==""){
                Data.MeterReading="0.0";
              }
              if(Data.KmCovered==""){
                Data.KmCovered="0.0";
              }

              Data.InspectionDate=that.DateNew(that.getView().byId("FFitmentDateEdit").getDateValue());
              Data.RegnoToItemNvg=Data.RegnoToItemNvg.results;
              for(i=0;i<Data.RegnoToItemNvg.length;i++){
                delete Data.RegnoToItemNvg[i].__metadata;
                //
				Data.RegnoToItemNvg[i].NTotKmCovered = parseInt(Data.RegnoToItemNvg[i].TotKmCovered) + parseInt(Data.RegnoToItemNvg[i].NKmCovered);
				//
                Data.RegnoToItemNvg[i].VitemToServiceNvg=Data.RegnoToItemNvg[i].VitemToServiceNvg.results;
                for(j=0;j<Data.RegnoToItemNvg[i].VitemToServiceNvg.length;j++){
                  if(Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.results.length!=0){
                    delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].__metadata;
                    Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg=Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.results;
                    for(k=0;k<Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.length;k++){
                      delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg[k].__metadata;
                    }
                  }else{
                    delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg;
                  }

                }
              }
              Data.RegnoToServiceNvg=Data.RegnoToServiceNvg.results;
              for(i=0;i<Data.RegnoToServiceNvg.length;i++){
                delete Data.RegnoToServiceNvg[i].__metadata;
                Data.RegnoToServiceNvg[i].VServToSubservNvg=Data.RegnoToServiceNvg[i].VServToSubservNvg.results;

                  if(Data.RegnoToServiceNvg[i].VServToSubservNvg.length!=0){
                    delete Data.RegnoToServiceNvg[i].VServToSubservNvg.__metadata;
                    //Data.RegnoToServiceNvg[i].VServToSubservNvg=Data.RegnoToServiceNvg[i].VServToSubservNvg.results;
                    for(j=0;j<Data.RegnoToServiceNvg[i].VServToSubservNvg.length;j++){
                      delete Data.RegnoToServiceNvg[i].VServToSubservNvg[j].__metadata;
                    }
                  }else{
                    delete Data.RegnoToServiceNvg[i].VServToSubservNvg;
                  }
              }

              console.log(Data)
              var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
              var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
              oCreateModel1.setHeaders({
                "Content-Type": "application/atom+xml"
                });
              var fncSuccess = function(oData, oResponse) 
                {

                var reg = oData.RegNo;
                var insp = oData.InspNo;
                var hub = oData.HubCode;
                var cust = oData.Kunnr;
                if(oData.Error=="X"){
                  sap.m.MessageBox.show(oData.Message, {
                        title: "Error",
                        icon:sap.m.MessageBox.Icon.ERROR,
                        onClose:function(){

                        }
                    });
                }else{
                sap.m.MessageBox.show(oData.Message, { 
                      title: "Success",
                      icon:sap.m.MessageBox.Icon.SUCCESS,
                      onClose:function(){

                     sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFLEET_SRV/InspectionOutputSmartFormSet(InspNo='" + insp + "',Kunnr='" + cust + "',HubCode='" + hub + "',RegNo='" + reg + "')/$value" ,true);
                         window.history.back();

                      }
                  });
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
              oCreateModel1.create("/VehicleRegNoSet", Data, {
                success: fncSuccess,
                error: fncError
              });console.log(Data)
              }
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
validations:function(){																				// september 5
              
              
              var rot = this.getView().byId("idrotatiob").getSelectedKey();
              var tab;
              
              if(that.flg==0){
            	  tab=this.getView().byId("tblDetail");
              }else{
            	  tab=this.getView().byId("tblDetail1"); 
              }

              for(i=0;i<tab.getItems().length;i++){
                if(tab.getItems()[i].getCells()[8].getType()!="Accept"){
                  sap.m.MessageToast.show("Fill Readings Of Every Position");
                  return false
                }

                var act = tab.getItems()[i].getCells()[6].getSelectedKey();
                var stp = tab.getItems()[i].getCells()[0].getText();
                if(rot=="M" && act =="O" && stp != 'STP' && tab.getItems()[i].getCells()[1].getValue()==""){
                	sap.m.MessageToast.show("Select Rotation Position For Every Position");
                    return false
                }    
              }     

              return true; 

            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            onCompanyChange1 : function(evt){														// september 5
				
				var obj = evt.getSource().getParent().getBindingContext().getObject();
				obj.NonJkCompany=evt.getParameter("selectedItem").getKey();
				var key=evt.getSource().getSelectedKey();
				that.selectedCompanyKey = key;
				
				evt.getSource().getParent().getCells()[3].setShowValueHelp(true).setValue("");
				evt.getSource().getParent().getCells()[4].setShowValueHelp(true).setValue("");
				evt.getSource().getParent().getCells()[4].setShowValueHelp(true).setValue("");
				evt.getSource().getParent().getCells()[8].setType("Reject");
				
				obj.ItemCode="";
				obj.ItemDesc="";
				obj.StnclNumber="";	
				obj.TyreType="";
				obj.TyreLoc="";
				obj.IpCondition="";
				obj.IpPsi="";
				obj.OrigNsd="";
				obj.G1Nsd="";
				obj.G2Nsd="";
				obj.G3Nsd="";
				obj.G4Nsd="";
				obj.Remarks="";
				
				var len = obj.VitemToServiceNvg.results.length;
				for(var i=0;i<len;i++){
					obj.VitemToServiceNvg.results[i].ServiceSelect = "";
				}
            	
            	
            	
            },
//////////////////////////////////////////////////////////////////////////////////////////////////
            onTabelEntrieOk1:function(){
              
              
              var arr=[];
              var CopyData=sap.ui.getCore().byId("iDKing").getModel("Recodings").getData();

              var ripcon   = sap.ui.getCore().byId("idNIp").getSelectedKey(); 
              var rippsi   = sap.ui.getCore().byId("idNPsi").getValue(); 
              var rorignsd = sap.ui.getCore().byId("idNOrigNsd").getValue(); 
              var rnnsd1   = sap.ui.getCore().byId("idNG1").getValue();   
              var rnnsd2   = sap.ui.getCore().byId("idNG2").getValue();   
              var rnnsd3   = sap.ui.getCore().byId("idNG3").getValue();   
              var rnnsd4   = sap.ui.getCore().byId("idNG4").getValue();  
              var rnrem    = sap.ui.getCore().byId("idNRem").getValue();  

              if(ripcon==""){
                sap.m.MessageToast.show("Select IP Condition");
                return
              }
              
              if(rippsi=="" || rippsi === "0"){
                sap.m.MessageToast.show("Enter IP (PSI)");
                return
              }

              if(parseFloat(rorignsd)<1 || rorignsd==""){
                sap.m.MessageToast.show("Enter New Tyre NSD ");
                return
              }

              if(rnnsd1==""||parseFloat(rnnsd1)==0){
                sap.m.MessageToast.show("Enter G1");
                return
              }else{
                arr.push(rnnsd1);
              }

              if(rnnsd2==""||parseFloat(rnnsd2)==0){
                sap.m.MessageToast.show("Enter G2");
                return
              }else{
                arr.push(rnnsd2);
              }

              if(rnnsd3=="" ||parseFloat(rnnsd3)==0){
                sap.m.MessageToast.show("Enter G3");
                return
              }else{
                arr.push(rnnsd3);
              }

              if(rnnsd4=="" ||parseFloat(rnnsd4)==0){
                rnnsd4 = "0.00";
              }else{
                arr.push(rnnsd4);
              }

              var minnsd = Math.min.apply(null,arr);
              if (minnsd==Infinity){
                minnsd = "";
              }

              if(parseFloat(rnnsd1) > parseFloat(rorignsd)){
                sap.m.MessageToast.show("G1 NSD cannot be greater than Orignal NSD.");
                return
              }

              if(parseFloat(rnnsd2) > parseFloat(rorignsd)){
                sap.m.MessageToast.show("G2 NSD cannot be greater than Orignal NSD.");
                return
              }
              
              if( parseFloat(rnnsd3) > parseFloat(rorignsd)){
                sap.m.MessageToast.show("G3 NSD cannot be greater than Orignal NSD.");
                return
              }

              if(parseFloat(rnnsd4) > parseFloat(rorignsd)){
                sap.m.MessageToast.show("G4 NSD cannot be greater than Orignal NSD.");
                return
              }

              if(parseFloat(rnnsd1)<3 || parseFloat(rnnsd2)<3 || parseFloat(rnnsd3)<3 || parseFloat(rippsi)<100){
                if(rnrem=="" || rnrem==undefined){
                sap.m.MessageToast.show("Fill Remarks");
                return
                }
              }

              if(rnnsd4 == "" || rnnsd4 == " "){
                rnnsd4 = "0.00";
              }

              rnkm = "0.00";

              that.CopyData = CopyData;

              that.EntreItem.getBindingContext().getObject().NIpCondition=ripcon;
              that.EntreItem.getBindingContext().getObject().NIpPsi=rippsi;
              that.EntreItem.getBindingContext().getObject().NOrigNsd=rorignsd;
              that.EntreItem.getBindingContext().getObject().NKmSuspended=rnkm;
              that.EntreItem.getBindingContext().getObject().NG1Nsd=rnnsd1;
              that.EntreItem.getBindingContext().getObject().NG2Nsd=rnnsd2;
              that.EntreItem.getBindingContext().getObject().NG3Nsd=rnnsd3;
              that.EntreItem.getBindingContext().getObject().NG4Nsd=rnnsd4;
              that.EntreItem.getBindingContext().getObject().NMinNsd=minnsd;
              that.EntreItem.getBindingContext().getObject().NRemarks=rnrem;
              
              that.EntreItem.getBindingContext().getObject().IpCondition="";
              that.EntreItem.getBindingContext().getObject().IpPsi="0";
              that.EntreItem.getBindingContext().getObject().OrigNsd="0";
              that.EntreItem.getBindingContext().getObject().KmSuspended="0";
              that.EntreItem.getBindingContext().getObject().G1Nsd="0";
              that.EntreItem.getBindingContext().getObject().G2Nsd="0";
              that.EntreItem.getBindingContext().getObject().G3Nsd="0";
              that.EntreItem.getBindingContext().getObject().G4Nsd="0";
              that.EntreItem.getBindingContext().getObject().MinNsd="0";
              that.EntreItem.getBindingContext().getObject().Remarks="";

              this.tyrePos = CopyData.Zposition;
              
/*              that.entriesbutton.setType("Accept");
              this._EntriesHelpDialog.close();
              this._EntriesHelpDialog.destroy();
              this._EntriesHelpDialog=undefined;*/
              
              
              if(rippsi < 90){
					var dialog 	= new sap.m.Dialog({
				        title : 'Warning',
				        type : 'Message',
				        content : [ new sap.m.Label({
				          text : 'Low inflation - Are you sure?'
				        }) ],
				        beginButton : new sap.m.Button({
				          text : 'Yes',
				          press : function() {
				        	  dialog.close();
				        	  that.entriesbutton.setType("Accept");
				        	  that._EntriesHelpDialog.close();
				        	  that._EntriesHelpDialog.destroy();
				        	  that._EntriesHelpDialog=undefined;
				        
				          }
				        }),
				        endButton : new sap.m.Button({
				          text : 'No',
				          press : function() {
				        	  sap.ui.getCore().byId("idNPsi").setValue();
				        	  dialog.destroy();
				          }
				        }),
				        
					});
					dialog.open();
					return;
			} else if(rippsi > 180){
				
				var dialog = new sap.m.Dialog({
			        title : 'Warning',
			        type : 'Message',
			        content : [ new sap.m.Label({
			          text : 'Over inflation - Are you sure?'
			        }) ],
			        beginButton : new sap.m.Button({
			          text : 'Yes',
			          press : function() {
			        	  dialog.destroy();
			        	  that.entriesbutton.setType("Accept");
			        	  that._EntriesHelpDialog.close();
			        	  that._EntriesHelpDialog.destroy();
			        	  that._EntriesHelpDialog=undefined;
			        	
			          }
			        }),
			        endButton : new sap.m.Button({
			          text : 'No',
			          press : function() {
			        	  sap.ui.getCore().byId("idNPsi").setValue();
			        	  dialog.destroy();
			          }
			        }),
			        
				});
				dialog.open();
				return;
		} else {
			 that.entriesbutton.setType("Accept");
           this._EntriesHelpDialog.close();
           this._EntriesHelpDialog.destroy();
           this._EntriesHelpDialog=undefined;
		}
              
              
              
            },
//////////////////////////////////////////////////////////////////////////////////////////////////

        });