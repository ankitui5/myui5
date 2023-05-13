jQuery.sap.registerPreloadedModules({version:"2.0",name:"com/acute/ticketZSC/Component-preload",modules:{"com/acute/ticketZSC/Component.js":'jQuery.sap.declare("com.acute.ticketZSC.Component"),jQuery.sap.require("com.acute.ticketZSC.MyRouter"),jQuery.sap.require("sap.ui.core.util.MockServer"),sap.ui.core.UIComponent.extend("com.acute.ticketZSC.Component",{metadata:{name:"com.acute.ticketZSC",version:"1.0",includes:["css/style.css"],dependencies:{libs:["sap.m","sap.ui.layout","sap.ushell"],components:[]},rootView:"com.acute.ticketZSC.view.App",config:{resourceBundle:"i18n/messageBundle.properties",serviceConfig:{name:"",serviceUrl:"/sap/opu/odata/sap/ZCS_TICKET_SRV"}},routing:{config:{routerClass:"com.acute.ticketZSC.MyRouter",viewType:"XML",viewPath:"com.acute.ticketZSC.view",targetAggregation:"detailPages",clearTarget:!1},routes:[{pattern:"",name:"main",view:"Master",targetAggregation:"masterPages",targetControl:"idAppControl",subroutes:[{pattern:"Detail/{contextPath}",name:"Detail",view:"Detail"}]},{name:"catchallMaster",view:"Master",targetAggregation:"masterPages",targetControl:"idAppControl",subroutes:[{pattern:"NotFound",name:"NotFound",view:"NotFound",transition:"show"}]}]}},init:function(){sap.ui.core.UIComponent.prototype.init.apply(this,arguments);var e=jQuery.sap.getModulePath("com.acute.ticketZSC"),t=this.getMetadata().getConfig().serviceConfig,o=t.serviceUrl,a=this.getMetadata().getConfig(),i=new sap.ui.model.odata.ODataModel(o,!0);this.setModel(i),this._routeMatchedHandler=new sap.m.routing.RouteMatchedHandler(this.getRouter(),this._bRouterCloseDialogs);var r=new sap.ui.model.resource.ResourceModel({bundleUrl:[e,a.resourceBundle].join("/")});this.setModel(r,"i18n"),this.getRouter().initialize()},exit:function(){this._routeMatchedHandler.destroy()},setRouterSetCloseDialogs:function(e){this._bRouterCloseDialogs=e,this._routeMatchedHandler&&this._routeMatchedHandler.setCloseDialogs(e)}});',"com/acute/ticketZSC/MyRouter.js":'jQuery.sap.require("sap.m.routing.RouteMatchedHandler"),jQuery.sap.require("sap.ui.core.routing.Router"),jQuery.sap.declare("com.acute.ticketZSC.MyRouter"),sap.ui.core.routing.Router.extend("com.acute.ticketZSC.MyRouter",{constructor:function(){sap.ui.core.routing.Router.apply(this,arguments),this._oRouteMatchedHandler=new sap.m.routing.RouteMatchedHandler(this)},myNavBack:function(t,e){void 0!==sap.ui.core.routing.History.getInstance().getPreviousHash()?window.history.go(-1):this.navTo(t,e,!0)},myNavToWithoutHash:function(t){var e=this._findSplitApp(t.currentView),i=this.getView(t.targetViewName,t.targetViewType);e.addPage(i,t.isMaster),e.to(i.getId(),t.transition||"show",t.data)},backWithoutHash:function(t,e){var i=e?"backMaster":"backDetail";this._findSplitApp(t)[i]()},destroy:function(){sap.ui.core.routing.Router.prototype.destroy.apply(this,arguments),this._oRouteMatchedHandler.destroy()},_findSplitApp:function(t){return t instanceof sap.ui.core.mvc.View&&t.byId("idAppControl")?t.byId("idAppControl"):t.getParent()?this._findSplitApp(t.getParent(),"idAppControl"):null}});',"com/acute/ticketZSC/util/Formatter.js":'jQuery.sap.declare("com.acute.ticketZSC.util.Formatter"),jQuery.sap.require("sap.ca.ui.model.format.DateFormat"),com.acute.ticketZSC.util.Formatter={date:function(t){return void 0==t?"":sap.ui.core.format.DateFormat.getInstance({pattern:"dd-MM-YYYY"}).format(t)},time:function(t){if(void 0==t)return"";var e=t.ms;if(void 0==e)return"";var r=new Date(e),a="";return r.getUTCHours(),a+=r.getUTCHours()+":",r.getUTCMinutes()<10?a+="0"+r.getUTCMinutes()+":":a+=r.getUTCMinutes()+":",r.getUTCSeconds()<10?a+="0"+r.getUTCSeconds():a+=r.getUTCSeconds(),a},datetemp:function(t){return sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:"dd/MM/yyyy HH:mm"}).format(t)},cat:function(t,e){if(""==t){var r=t;return r}if(""==e){var r=e;return r}var r=t+"("+e+")";return r}};',"com/acute/ticketZSC/view/App.controller.js":'sap.ui.core.mvc.Controller.extend("com.acute.ticketZSC.view.App",{});',"com/acute/ticketZSC/view/Detail.controller.js":'jQuery.sap.require("com.acute.ticketZSC.util.Formatter"),jQuery.sap.require("sap.m.MessageBox"),jQuery.sap.require("sap.m.MessageToast"),jQuery.sap.require("sap.ca.ui.dialog.factory"),jQuery.sap.require("sap.ca.ui.model.format.DateFormat"),jQuery.sap.require("sap.ui.core.mvc.Controller");var that=this;sap.ui.core.mvc.Controller.extend("com.acute.ticketZSC.view.Detail",{onInit:function(){that=this,this.onClosureReason(),this.oView=this.getView(),this.newBusy=new sap.m.BusyDialog,this.newModel=this.getOwnerComponent().getModel();var e=this.byId("detailPage"),t=this.byId("fullscreenButton");if(jQuery.support.touch||this.getView().addStyleClass("sapUiSizeCompact"),this.oInitialLoadFinishedDeferred=jQuery.Deferred(),sap.ui.Device.system.phone)this.byId("RadioSerID").setColumns(1),e.setShowNavButton(!0),t.setVisible(!1),this.oInitialLoadFinishedDeferred.resolve();else{t.setVisible(!0),this.byId("RadioSerID").setColumns(5),e.setShowNavButton(!1);var i=this.getEventBus();i.subscribe("Component","MetadataFailed",this.onMetadataFailed,this),i.subscribe("Master","InitialLoadFinished",this.onMasterLoaded,this)}this.oModel=this.getOwnerComponent().getModel(),this.getRouter().attachRouteMatched(this.onRouteMatched,this),this.onState()},onState:function(){this.newBusy.open();var e=new sap.ui.model.json.JSONModel;e.loadData("/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq \'IN\'",null,!1,"GET",!1,!1,null);var t=this.getView().byId("idState");t.unbindAggregation("items"),t.setModel(e),t.bindAggregation("items",{path:"/d/results",template:new sap.ui.core.Item({key:"{RegionCode}",text:"{Region}"})}),this.newBusy.close()},onNavBack:function(){this.getRouter().myNavBack("main")},onMasterLoaded:function(e,t){this.setBusy(!1),this.oInitialLoadFinishedDeferred.resolve()},onMetadataFailed:function(){this.setBusy(!1),this.oInitialLoadFinishedDeferred.resolve(),this.showEmptyView()},getEventBus:function(){return sap.ui.getCore().getEventBus()},getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},onRouteMatched:function(e){if(that=this,"Detail"===e.getParameter("name")){this.getView().byId("RadioSerID").setSelectedIndex(0),this.getView().byId("idDepotCodeLabel").setVisible(!0),this.getView().byId("idDepotCodeInput").setVisible(!0),this.getView().byId("idDepotCodeInput1").setVisible(!0);var t=sap.ui.getCore().getModel("CustDtls"),i=e.getParameters().arguments.contextPath;if(void 0!=t){this.newBusy.open(),that.getView().byId("SimpleFormToolbar1").setVisible(!0),that.getView().byId("SimpleFormToolbar2").setVisible(!0),that.getView().byId("SimpleFormToolbar3").setVisible(!0),that.getView().byId("RadioSerID").setVisible(!0),that.getView().byId("detailPage").setTitle("Ticket Number:- "+t.TicketNo);var a="/GetTicketDataSet(ITicketNo=\'"+t.TicketNo+"\')";this.newModel.read(a,null,null,!1,function(e,t){that.getView().byId("idPhone1").setValue(e.CustomerTelf1),that.getView().byId("idPhone2").setValue(e.CustomerTelf2),that.getView().byId("idFname").setValue(e.CustomerFname),that.getView().byId("idLname").setValue(e.CustomerLname),that.getView().byId("idAdd1").setValue(e.CustomerAddr1),that.getView().byId("idAdd2").setValue(e.CustomerAddr2),that.getView().byId("idDealer1").setValue(e.DealerName),that.getView().byId("idState").setSelectedKey(e.CustomerRegion),that.getView().byId("idLocation").setValue(e.CustomerCity1),that.getView().byId("idDistrict").setValue(e.CustomerCity2),that.getView().byId("idEmail").setValue(e.CustomerEmail),that.getView().byId("idFitType").setValue(e.FitTypeDesc),that.getView().byId("idVehicleType").setValue(e.VehicleType),that.getView().byId("idVehicleMake").setValue(e.VehicleMake),that.getView().byId("idModel").setValue(e.VehicleModel),that.newBusy.close()},function(e){var t=JSON.parse(e.response.body).error.message.value;sap.m.MessageBox.show(t,{title:"Error",icon:sap.m.MessageBox.Icon.ERROR})});var s=this.getView().getModel(),o="SEResponseSet(TicketNo=\'"+i+"\')";s.read(o,null,null,!1,function(e,t){that.getView().byId("idRem").setValue(e.RespText),that.getView().byId("RB3-1").setSelected(e.JkDepot),that.getView().byId("RB3-2").setSelected(e.JkDealer),that.getView().byId("RB3-3").setSelected(e.SpotInsp),that.getView().byId("RB3-4").setSelected(e.NoResponse),that.getView().byid("RB3-5").setSelected(e.TicketClosed)})}else that.getView().byId("SimpleFormToolbar1").setVisible(!1),that.getView().byId("SimpleFormToolbar2").setVisible(!1),that.getView().byId("SimpleFormToolbar3").setVisible(!1),that.getView().byId("RadioSerID").setVisible(!1),this.getRouter().navTo("main")}},onStateHelp:function(){var e=new sap.ui.model.json.JSONModel;e.loadData("/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq \'IN\'",null,!1,"GET",!1,!1,null);var t=new sap.m.SelectDialog({title:"State",items:{path:"/d/results",template:new sap.m.StandardListItem({title:"{Region}",customData:[new sap.ui.core.CustomData({key:"Key",value:"{RegionCode}"})]})},liveChange:function(e){var t=e.getParameter("value"),i=new sap.ui.model.Filter("Region",sap.ui.model.FilterOperator.Contains,t);e.getSource().getBinding("items").filter([i])},confirm:[this._handleClose,this],cancel:[this._handleClose,this]});t.setModel(e),t.open()},_handleClose:function(e){var t=e.getParameter("selectedItem");t&&(this.State=e.getParameter("selectedItem").getCustomData()[0].getValue(),this.getView().byId("idState").setValue(t.getTitle()))},maxmin:function(e){if(e.getSource().getPressed()){var t=e.getSource().getParent().getParent().getParent().getParent().getParent();t.setMode(sap.m.SplitAppMode.HideMode),this.getView().byId("fullscreenButton").setIcon("sap-icon://exit-full-screen")}else{var t=e.getSource().getParent().getParent().getParent().getParent().getParent();t.setMode(sap.m.SplitAppMode.ShowHideMode),this.getView().byId("fullscreenButton").setIcon("sap-icon://full-screen")}},OnRadioSelect:function(e){var t=that.getView().byId("idDepotCodeInput"),i=that.getView().byId("idDealCodeInput"),a=that.getView().byId("idLocation1"),s=that.getView().byId("DTP4"),o=that.getView().byId("idRem"),l=that.getView().byId("idClosureReason");o.setValue(""),l.removeStyleClass("myStateError"),i.setValueState("None"),a.setValueState("None"),t.setValueState("None"),s.setValueState("None"),o.setValueState("None");var n=e.getParameter("selectedIndex");0==n?(this.getView().byId("idDepotCodeLabel").setVisible(!0),this.getView().byId("idDepotCodeInput").setVisible(!0),this.getView().byId("idDepotCodeInput1").setVisible(!0)):(this.getView().byId("idDepotCodeLabel").setVisible(!1),this.getView().byId("idDepotCodeInput").setVisible(!1),this.getView().byId("idDepotCodeInput1").setVisible(!1)),1==n?(this.getView().byId("idDealCodeLabel").setVisible(!0),this.getView().byId("idDealCodeInput").setVisible(!0),this.getView().byId("idDealerName").setVisible(!0),this.getView().byId("Locationlabel").setVisible(!0),this.getView().byId("idLocation1").setVisible(!0)):(this.getView().byId("idDealCodeLabel").setVisible(!1),this.getView().byId("idDealCodeInput").setVisible(!1),this.getView().byId("idDealerName").setVisible(!1),this.getView().byId("Locationlabel").setVisible(!1),this.getView().byId("idLocation1").setVisible(!1)),2==n?(this.getView().byId("appDt").setVisible(!0),this.getView().byId("DTP4").setVisible(!0).setDateValue(null)):(this.getView().byId("appDt").setVisible(!1),this.getView().byId("DTP4").setVisible(!1).setDateValue(null)),4==n?(this.getView().byId("ididClosureReasonLabel").setVisible(!0),this.getView().byId("idClosureReason").setVisible(!0).setValue(null)):(this.getView().byId("ididClosureReasonLabel").setVisible(!1),this.getView().byId("idClosureReason").setVisible(!1).setValue(null))},onSave:function(){if(this.checkRequired(),!this.bValidationError){that.getView().byId("idFname").getValue(),that.getView().byId("idLname").getValue(),that.getView().byId("idEmail").getValue(),that.getView().byId("idAdd1").getValue(),that.getView().byId("idAdd2").getValue(),that.getView().byId("idLocation").getValue(),that.getView().byId("idDistrict").getValue(),that.getView().byId("idDealCodeInput").getValue();var e=sap.ui.getCore().getModel("CustDtls"),t=that.getView().byId("RadioSerID").getSelectedIndex(),i=that.getView().byId("DTP4").getDateValue(),a=(that.getView().byId("idDepotCodeInput"),that.getView().byId("idRem").getValue());this.newBusy.open();var s={};s.TicketNo=e.TicketNo,s.RespDate=this.Date(null),s.ServEngg=sap.ushell.Container.getService("UserInfo").getId(),s.JkDepot=0==t,s.JkDealer=1==t,s.SpotInsp=2==t,s.NoResponse=3==t,s.TicketClosed=4==t,s.AppointDate=this.Date(i),s.AppointTime=this.Time(i),s.RespText=a,s.DepotCode=that.getView().byId("idDepotCodeInput").getValue(),s.DealerCode=that.getView().byId("idDealCodeInput").getValue(),s.ClosureReason=that.getView().byId("idClosureReason").getSelectedKey(),this.newModel.create("/SEResponseSet",s,null,function(e,t){that.newBusy.close(),sap.m.MessageBox.show("Ticket saved successfully",{title:"Success",icon:sap.m.MessageBox.Icon.SUCCESS,onClose:function(){window.history.back()}})},function(e,t){var i=JSON.parse(e.response.body),a=i.error.message.value;sap.m.MessageBox.show(a,sap.m.MessageBox.Icon.ERROR,"Error")})}},checkRequired:function(){this.bValidationError=!1;var e=that.getView().byId("RadioSerID").getSelectedIndex();-1==e&&(this.bValidationError=!0);var t=that.getView().byId("idDepotCodeInput"),i=(that.getView().byId("idDepotCodeInput1"),that.getView().byId("idDealCodeInput")),a=that.getView().byId("DTP4"),s=that.getView().byId("idRem"),o=that.getView().byId("idClosureReason");0==e?""==t.getValue()?(t.setValueState("Error"),this.bValidationError=!0):(t.setValueState("None"),this.bValidationError=!1):1==e?""==i.getValue()?(i.setValueState("Error"),this.bValidationError=!0):(i.setValueState("None"),this.bValidationError=!1):2==e?null===a.getDateValue()?(a.setValueState("Error"),this.bValidationError=!0):(a.setValueState("None"),this.bValidationError=!1):4==e&&(""==o.getSelectedKey()?(o.addStyleClass("myStateError"),this.bValidationError=!0):(o.removeStyleClass("myStateError"),this.bValidationError=!1)),""==s.getValue()?(s.setValueState("Error"),this.bValidationError=!0):s.setValueState("None"),this.bValidationError&&sap.m.MessageBox.show("A validation error has occured. Complete your reuiqred input marked(*)",{icon:sap.m.MessageBox.Icon.ERROR,title:"Error",styleClass:"sapUiSizeCompact",actions:[sap.m.MessageBox.Action.CLOSE]})},Date:function(e){null==e&&(e=new Date);var t=e.getMonth()+1,i=e.getDate();return t.toString().length<2&&(t="0"+t.toString()),i.toString().length<2&&(i="0"+i.toString()),e.getFullYear()+"-"+t+"-"+i+"T00:00:00"},Time:function(e){null==e&&(e=new Date);var t=e.getHours(),i=e.getMinutes(),a=e.getSeconds();return t.toString().length<2&&(t="0"+t.toString()),i.toString().length<2&&(i="0"+i.toString()),a.toString().length<2&&(a="0"+a.toString()),"PT"+t+"H"+i+"M"+a+"S"},onDelarCodeType:function(){var e=new sap.ui.model.json.JSONModel;e.loadData("/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpDealerSet",null,!1,"GET",!1,!1,null);var t=new sap.m.SelectDialog({title:"Dealer Code",items:{path:"/d/results",template:new sap.m.StandardListItem({title:"{name1}",description:"{kunnr}",customData:[new sap.ui.core.CustomData({key:"Key",value:"{DealerLoc}"})]})},liveChange:function(e){var t=e.getParameter("value"),i=new sap.ui.model.Filter("kunnr",sap.ui.model.FilterOperator.Contains,t),a=new sap.ui.model.Filter("name1",sap.ui.model.FilterOperator.Contains,t),s=new sap.ui.model.Filter("DealerLoc",sap.ui.model.FilterOperator.Contains,t),o=new sap.ui.model.Filter([i,a,s],!1);e.getSource().getBinding("items").filter([o])},confirm:[this._handleDealerClose,this],cancel:[this._handleDealerClose,this]});t.setModel(e),t.open()},_handleDealerClose:function(e){var t=e.getParameter("selectedItem");t&&(this.DealerCode=e.getParameter("selectedItem").getCustomData()[0].getValue(),this.DlLocation=e.getParameter("selectedItem").getCustomData()[0].getValue(),this.getView().byId("idDealCodeInput").setValue(t.getDescription()),this.getView().byId("idDealerName").setValue(t.getTitle()),this.getView().byId("idLocation1").setValue(this.DlLocation))},onClosureReason:function(){var e=new sap.ui.model.json.JSONModel;e.loadData("/sap/opu/odata/sap/ZCS_TICKET_SRV/ClosureReasonSet",null,!1,"GET",!1,!1,null);var t=this.getView().byId("idClosureReason");t.unbindAggregation("items"),t.setModel(e),t.bindAggregation("items",{path:"/d/results",template:new sap.ui.core.Item({key:"{Reason}",text:"{Desc}"})})},onDepotCodeType:function(){var e=new sap.ui.model.json.JSONModel;e.loadData("/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpDepotCodeSet",null,!1,"GET",!1,!1,null);var t=new sap.m.SelectDialog({title:"Depot Code",items:{path:"/d/results",template:new sap.m.StandardListItem({title:"{Name}",description:"{DepotCode}",customData:[new sap.ui.core.CustomData({key:"Key",value:"{DepotCode}"})]})},liveChange:function(e){var t=e.getParameter("value"),i=new sap.ui.model.Filter("DepotCode",sap.ui.model.FilterOperator.Contains,t),a=new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,t),s=new sap.ui.model.Filter([i,a],!1);e.getSource().getBinding("items").filter([s])},confirm:[this._handleDepotClose,this],cancel:[this._handleDepotClose,this]});t.setModel(e),t.open()},_handleDepotClose:function(e){var t=e.getParameter("selectedItem");t&&(this.Dealer=e.getParameter("selectedItem").getCustomData()[0].getValue(),this.getView().byId("idDepotCodeInput").setValue(t.getDescription()),this.getView().byId("idDepotCodeInput1").setValue(t.getTitle()),this.getView().byId("idDepotCodeInput").setValueState("None"))},onResponseChange:function(e){e.getSource().setValueStateError("None")},handleApDtChange:function(e){var t=this.getView().byId("DTP4"),i=t.getDateValue(),a=new Date,s=a.setHours(0,0,0,0);if(i.setHours(0,0,0,0)<s)return sap.m.MessageToast.show("Appointment Date can not be less than current date"),p.setValue(""),void this.getView().byId("appDt").setValueState("Error");this.getView().byId("appDt").setValueState("None")},onCloseReasonChange:function(){this.getView().byId("idClosureReason").removeStyleClass("myStateError")}});',"com/acute/ticketZSC/view/Master.controller.js":'jQuery.sap.require("com.acute.ticketZSC.util.Formatter"),jQuery.sap.require("sap.ui.core.mvc.Controller"),sap.ui.core.mvc.Controller.extend("com.acute.ticketZSC.view.Master",{onInit:function(){master=this;var e=this.getView().byId("lstDetails");this.newBusy=new sap.m.BusyDialog,oModel=this.getOwnerComponent().getModel(),jQuery.support.touch||this.getView().addStyleClass("sapUiSizeCompact"),sap.ui.Device.system.phone&&e.removeSelections(),this.oInitialLoadFinishedDeferred=jQuery.Deferred(),this.bindList(),this.getRouter().attachRouteMatched(this.onRouteMatched,this);jQuery.device.is.phone},onBeforeRendering:function(){},_handleActionCallBack:function(e,t,i){"PRMasterRefresh"===t&&this.bindList()},bindList:function(){master.reqdata="";var e=this.byId("lstDetails"),t=this.getOwnerComponent().getModel(),i="/SETicketAssignedSet?$filter=TicketNo eq \'\' and ServEngg eq \'"+sap.ushell.Container.getService("UserInfo").getId()+"\'";t.read(i,null,null,!1,function(t,i){master.reqdata=t.results;var s=new sap.ui.model.json.JSONModel({ManagerMasterSet:master.reqdata}),a=new sap.m.ObjectListItem({type:"{device>/listItemType}",title:"{TicketNo}",attributes:[new sap.m.ObjectAttribute({text:"Customer Name: {CustomerFname}"}),new sap.m.ObjectAttribute({text:"Ticket Date:{path:\'TicketDate\',formatter:\'com.acute.ticketZSC.util.Formatter.date\'}"}),new sap.m.ObjectAttribute({text:"City:{CustomerCity1}"})]});e.unbindAggregation("items"),e.setModel(s),s.setSizeLimit(s.oData.ManagerMasterSet.length),e.bindAggregation("items","/ManagerMasterSet",a)},function(e){var t=JSON.parse(e.response.body).error.message.value;sap.m.MessageBox.show(t,{title:"Error",icon:sap.m.MessageBox.Icon.ERROR})})},getEventBus:function(){return sap.ui.getCore().getEventBus()},getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},onRouteMatched:function(e){if("main"!==e.getParameter("name"))return void(sap.ui.Device.system.phone&&this.byId("lstDetails").removeSelections())},loadDetailView:function(){this.getRouter().myNavToWithoutHash({currentView:this.getView(),targetViewName:"com.acute.ticketZSC.view.Detail",targetViewType:"XML"})},waitForInitialListLoading:function(e){jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(e,this))},onNotFound:function(){this.getView().byId("lstDetails").removeSelections()},onDetailTabChanged:function(e,t,i){this.sTab=i.sTabKey},onListUpdated:function(e){var t=this.getView().byId("lstDetails"),i=t.getItems()[0].getTitle(),s=!jQuery.device.is.phone,a=t.oModels.undefined.oData.ManagerMasterSet[0];sap.ui.getCore().setModel(a,"CustDtls");parseFloat(i);this.getRouter().navTo("Detail",{from:"main",contextPath:i},s),this.getView().byId("masterPage").setTitle("Ticket Numbers ("+t.getItems().length+")"),sap.ui.Device.system.phone&&e.getSource().removeSelections(),e.getSource().getItems().length},selectFirstItem:function(){var e=this.getView().byId("lstDetails"),t=e.getItems();t.length?(e.setSelectedItem(t[0],!0),this.loadDetailView(),e.fireSelect({listItem:t[0]})):this.getRouter().myNavToWithoutHash({currentView:master.getView(),targetViewName:"com.acute.ticketZSC.view.NotFound",targetViewType:"XML"})},liveSearch:function(e){var t=this.getView().byId("lstDetails"),i=t.getBinding("items"),s=e.oSource.mProperties.value.toLowerCase(),a=new sap.ui.model.Filter("TicketNo",sap.ui.model.FilterOperator.Contains,s);i.filter([a])},onDetailChanged:function(e,t,i){var s=i.sEntityPath;this.waitForInitialListLoading(function(){var e=this.getView().byId("lstDetails"),t=e.getSelectedItem();if(!t||t.getBindingContext().getPath()!==s)for(var i=e.getItems(),a=0;a<i.length;a++)if(i[a].getBindingContext().getPath()===s){e.setSelectedItem(i[a],!0);break}})},onSelect:function(e){var t=!jQuery.device.is.phone,i=e.getParameter("listItem").getTitle(),s=e.getParameter("listItem").getBindingContext().getObject();sap.ui.getCore().setModel(s,"CustDtls");parseFloat(i);this.getRouter().navTo("Detail",{from:"main",contextPath:i},t)},onExit:function(){var e=this.getEventBus();e.unsubscribe("Detail","TabChanged",this.onDetailTabChanged,this),e.unsubscribe("Detail","Changed",this.onDetailChanged,this),e.unsubscribe("Detail","NotFound",this.onNotFound,this)},onResqstEnter:function(){var e=sap.ui.getCore().byId("id").getValue();if(isNaN(e))return sap.m.MessageBox.show("Enter Numbers Only",{title:"Error",icon:sap.m.MessageBox.Icon.ERROR}),void sap.ui.getCore().byId("id").setValue("");e.length>4&&(e=e.slice(0,-1),sap.ui.getCore().byId("id").setValue(e))}});',"com/acute/ticketZSC/view/NotFound.controller.js":'sap.ui.controller("com.acute.ticketZSC.view.NotFound",{});',"com/acute/ticketZSC/view/App.view.xml":'<mvc:View controllerName="com.acute.ticketZSC.view.App"\r\n\txmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><SplitApp \r\n\t    id="idAppControl" /></mvc:View>\r\n',"com/acute/ticketZSC/view/Detail.view.xml":'<core:View xmlns:core="sap.ui.core" \r\n\t\t\txmlns:mvc="sap.ui.core.mvc"\r\n  \t\t\txmlns:l="sap.ui.layout" \r\n  \t\t\txmlns:ui="sap.ca.ui" \r\n  \t\t\txmlns="sap.m"\r\n  \t\t\tcontrollerName="com.acute.ticketZSC.view.Detail" \r\n  \t\t\txmlns:html="http://www.w3.org/1999/xhtml"\r\n  \t\t\txmlns:f="sap.ui.layout.form" \r\n  \t\t\txmlns:sc="sap.suite.ui.commons"><Page id="detailPage" navButtonPress="onNavBack" title="Request Details"\r\n\t\tshowNavButton="{device>/isPhone}" enableScrolling="true" ><headerContent><ToggleButton class="ClDetailPage" id="fullscreenButton" icon="sap-icon://full-screen" enabled="true" \r\n\t\t\t\t\t\t  tooltip="Switch between FullScreen and MasterDetail"  press="maxmin" /></headerContent><content><VBox class="sapUiSmallMargin "><f:SimpleForm id="SimpleFormToolbar1" editable="true" layout="ResponsiveGridLayout" \r\n                      labelSpanXL="3" labelSpanL="3" labelSpanM="3" maxContainerCols="3"\r\n\t\t\t          labelSpanS="4" adjustLabelSpan="true" emptySpanXL="2" emptySpanL="1"\r\n\t\t\t\t\t   emptySpanM="1" emptySpanS="1" columnsXL="2" columnsL="2" columnsM="2"\r\n\t\t\t\t\t   singleContainerFullSize="false" ariaLabelledBy="Title1"><f:content><core:Title text="Customer Details"  class="CustDtl" /><Label text="Phone No"  required="false"/><Input value="+91" enabled="false" id="idPhone" submit="onEnter" class="sapUiSizeCompact"><layoutData><l:GridData span="XL1 L1 M2 S1"/></layoutData></Input><Input enabled="false" id="idPhone1" submit="onEnter" maxLength="10"/><Label text="Alternate no"  required="false"/><Input value="+91" enabled="false" id="idPhones" submit="onEnter"><layoutData><l:GridData span="XL1 L1 M2 S1"/></layoutData></Input><Input enabled="false" id="idPhone2" submit="onEnter" maxLength="10"/><Label text="First Name" required="false" /><Input enabled="false" id="idFname" submit="onEnter"/><Label text="Last Name"  required="false"/><Input  id="idLname" enabled="false"/><Label text="Address1"   required="false"/><Input id="idAdd1" enabled="false"/><Label text="Address2"  required="false"/><Input id="idAdd2" enabled="false"/><core:Title text=""/><Label text="Dealer"   required="false"/><Input enabled="false" id="idDealer1"/><Label text="Country"  required="false"/><Select selectedKey="IN" enabled="false" id="idCountry" forceSelection="true"><items><core:Item text="India" key="IN"/></items></Select><Label text="State"  required="false" /><Select  id="idState"  enabled="false" /><Label text="District"  required="false" /><Input  id="idDistrict" enabled="false"/><Label text="Location"  required="false"/><Input  id="idLocation" enabled="false"/><Label text="Email Id"  required="false"/><Input  id="idEmail" enabled="false"/></f:content></f:SimpleForm></VBox><html:hr/><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar2" editable="true" layout="ResponsiveGridLayout"\r\n               labelSpanXL="3"\r\n                labelSpanL="3"\r\n                labelSpanM="3"\r\n\t\t\t\tlabelSpanS="4"\r\n\t\t\t\tadjustLabelSpan="true" \r\n\t\t\t\temptySpanXL="2" \r\n\t\t\t\temptySpanL="1" \r\n\t\t\t\temptySpanM="1" \r\n\t\t\t\temptySpanS="1" \r\n\t\t\t\tcolumnsXL="2" \r\n\t\t\t\tcolumnsL="2" \r\n\t\t\t\tmaxContainerCols="3"\r\n\t\t\t\tcolumnsM="2"\r\n\t\t\t\tsingleContainerFullSize="false" ariaLabelledBy="Title2"><f:content><core:Title text="Details" /><Label text="Fitment Type" /><Input id="idFitType" enabled="false"/><Label text="Vehicle Make"  required="false"/><Input id="idVehicleMake" enabled="false" /><core:Title text=""/><Label text="Vehicle Type"  required="false"/><Input id="idVehicleType"  enabled="false"/><Label text="Vehicle Model"  required="false"/><Input id="idModel" enabled="false"/></f:content></f:SimpleForm></VBox><html:hr/><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar3"  maxContainerCols="3" editable="true" layout="ResponsiveGridLayout" labelSpanXL="3" labelSpanL="3" labelSpanM="3"\r\n\t\t\t\t\t\t\tlabelSpanS="4" adjustLabelSpan="true" emptySpanXL="2" emptySpanL="1" emptySpanM="1" emptySpanS="1" columnsXL="1" columnsL="1" columnsM="1"\r\n\t\t\t\t\t\t\tsingleContainerFullSize="false" ariaLabelledBy="Title1"><f:content><core:Title text="Response Feedback" design="Bold"/><Panel ><content><Label></Label><RadioButtonGroup columns="4" editable="true"  selectedIndex="1" select="OnRadioSelect" id="RadioSerID" class="sapUiMediumMarginBottom"><buttons><RadioButton id="RB3-1" text="JK Depot" /><RadioButton id="RB3-2" text="JK Dealer" /><RadioButton id="RB3-3" text="Spot Inspection" /><RadioButton id="RB3-4" text="No Response"/><RadioButton id="RB3-5" text="Ticket Closed" /></buttons></RadioButtonGroup></content></Panel><Label text="Depot Code"  design="Bold" visible="false" id="idDepotCodeLabel"/><Input enabled="true" visible="false" id="idDepotCodeInput" valueHelpRequest="onDepotCodeType" valueHelpOnly="true" showValueHelp="true"><layoutData><l:GridData span="XL2 L1 M2 S2"/></layoutData></Input><Input enabled="false" visible="false" id="idDepotCodeInput1"><layoutData><l:GridData span="XL5 L5 M5 S2"/></layoutData></Input><Label text="Dealer Code" design="Bold" visible="false" id="idDealCodeLabel"/><Input enabled="true" visible="false" id="idDealCodeInput" valueHelpRequest="onDelarCodeType" \r\n\t\t\tvalueHelpOnly="true" showValueHelp="true"></Input><Input enabled="false" visible="false" id="idDealerName"  /><Label text="Location" design="Bold" required="false" id="Locationlabel" visible="false"/><Input  id="idLocation1" enabled="false" value="" visible="false"><layoutData><l:GridData span="XL4 L4 M4 S2"/></layoutData></Input><Label visible="false" design="Bold" text="Appointment Date" id="appDt" required="true"/><DateTimePicker\r\n\t\t\tid="DTP4"\r\n\t\t\tvalue="2016-02-18-10-32-30"\r\n\t\t\tvalueFormat="yyyy-MM-dd-HH-mm-ss"\r\n\t\t\tdisplayFormat="short"\r\n\t\t\tchange="handleApDtChange" visible="false"><layoutData><l:GridData span="XL4 L4 M3 S2"/></layoutData></DateTimePicker><Label text="Closure Reason" design="Bold" visible="false" id="ididClosureReasonLabel"/><Select selectedKey="" visible="false" forceSelection="false" change = "onCloseReasonChange" enabled="true" id="idClosureReason" ><layoutData><l:GridData span="XL4 L4 M3 S2"/></layoutData></Select><Label text="Response Comment" design="Bold" required="true"/><TextArea  enabled="true" id="idRem" liveChange="onResponseChange"/></f:content></f:SimpleForm></VBox></content><footer><Bar id="scopeFooterToolbar"><contentRight><Button icon="sap-icon://action-settings" type="Accept"  text="Save" id="act"  press="onSave" tooltip="Savet" /></contentRight></Bar></footer></Page></core:View>',"com/acute/ticketZSC/view/Master.view.xml":'<mvc:View controllerName="com.acute.ticketZSC.view.Master" xmlns="sap.m"\r\n  xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:html="http://www.w3.org/1999/xhtml"><Page title="Service Request" id="masterPage"\r\n   ><content><List id="lstDetails" mode="SingleSelectMaster" growing="true" updateFinished="onListUpdated"\r\n        growingThreshold="200" growingScrollToLoad="true" select="onSelect"\r\n        noDataText="No Data Found" ><headerToolbar><Toolbar class="tool"><SearchField liveChange="liveSearch" id="searchField"\r\n          width="100%" placeholder="Search"></SearchField></Toolbar></headerToolbar></List></content><footer><Bar><contentRight></contentRight></Bar></footer></Page></mvc:View>',"com/acute/ticketZSC/view/NotFound.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\r\n\txmlns="sap.m" controllerName="com.acute.ticketZSC.view.NotFound" xmlns:html="http://www.w3.org/1999/xhtml"><Page\r\n\t\t\r\n\t\ttitle="{i18n>notFoundTitle}" class="sapUiSizeCompact"><content><MessagePage showHeader="false" text="No Data Found" description=""></MessagePage></content><footer><Bar></Bar></footer></Page></core:View>',"com/acute/ticketZSC/i18n/messageBundle.properties":"masterTitle=MasterDetail\r\ndetailTitle=\r\nnotFoundTitle=Not Found\r\nnotFoundText=The requested resource was not found\r\nmasterListNoDataText=No entities\r\nmasterSearchPlaceholder=Search\r\nmasterSearchTooltip=Search for items in the list"}});