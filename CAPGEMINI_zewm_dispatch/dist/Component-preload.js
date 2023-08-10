//@ui5-bundle com/safran/ewm/zewm_dispatch/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"com/safran/ewm/zewm_dispatch/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","com/safran/ewm/zewm_dispatch/model/models"],function(e,t,s){"use strict";return e.extend("com.safran.ewm.zewm_dispatch.Component",{metadata:{manifest:"json",config:{fullWidth:true}},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(s.createDeviceModel(),"device");this.setModel(s.oGlobalModel(),"oGlobalModel");this.setModel(s.oErrorFlagModel(),"oErrorFlagModel");this.getModel("oErrorFlagModel").setData({Flag:"false"})},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(jQuery(document.body).hasClass("sapUiSizeCozy")||jQuery(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!t.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass}})});
},
	"com/safran/ewm/zewm_dispatch/controller/App.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel"],function(e,t){"use strict";return e.extend("com.safran.ewm.zewm_dispatch.controller.App",{onInit:function(){var e,n,a=this.getView().getBusyIndicatorDelay();e=new t({busy:true,delay:0});this.setModel(e,"appView");n=function(){e.setProperty("/busy",false);e.setProperty("/delay",a)};this.getOwnerComponent().getModel().metadataLoaded().then(n);this.getOwnerComponent().getModel().attachMetadataFailed(n);this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())}})});
},
	"com/safran/ewm/zewm_dispatch/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast","sap/ui/export/Spreadsheet","sap/ui/model/odata/v2/ODataModel","sap/ui/core/UIComponent","sap/m/library"],function(e,t,n,r,o,i){"use strict";var a=i.URLHelper;return e.extend("com.safran.ewm.zewm_dispatch.controller.BaseController",{onInit:function(){},getDialog:function(e,t){var n=this.getView();var r=n.byId(e);if(!r){r=sap.ui.xmlfragment(n.getId(),"com.safran.ewm.zewm_dispatch.view.fragments."+t,this);n.addDependent(r)}return r},onCloseDialog:function(e){var t=e.getSource();if(t.getMetadata().getName()==="sap.m.Button"){if(t.getParent().getMetadata().getName()==="sap.m.Dialog"){t.getParent().close()}}},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},getText:function(e,t){return this.getResourceBundle().getText(e,t)},getRouter:function(){return this.getOwnerComponent().getRouter()},getModel:function(e){return this.getView().getModel(e)},onExit:function(){},setModel:function(e,t){return this.getView().setModel(e,t)},onShareEmailPress:function(){var e=this.getModel("objectView")||this.getModel("worklistView");a.triggerEmail(null,e.getProperty("/shareSendEmailSubject"),e.getProperty("/shareSendEmailMessage"))},addHistoryEntry:function(){var e=[];return function(t,n){if(n){e=[]}var r=e.some(function(e){return e.intent===t.intent});if(!r){e.push(t);this.getOwnerComponent().getService("ShellUIService").then(function(t){t.setHierarchy(e)})}}}})});
},
	"com/safran/ewm/zewm_dispatch/controller/View1.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","com/safran/ewm/zewm_dispatch/controller/BaseController","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/m/MessagePopover","sap/m/MessageItem"],function(e,t,o,s,a,n){"use strict";var i;var r;var d;var g;return e.extend("com.safran.ewm.zewm_dispatch.controller.View1",{onInit:function(){d=this.getOwnerComponent().getModel("oGlobalModel");g=this.getOwnerComponent().getModel("oErrorFlagModel");var e=new n({type:"{oMsgModel>type}",title:"{oMsgModel>title}",description:"{oMsgModel>description}"});i=new a({items:{path:"oMsgModel>/",template:e}});r=new s;this.getView().setModel(r,"oMsgModel");this.byId("idView1MsgBox").addDependent(i);this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());sap.ui.core.UIComponent.getRouterFor(this).getRoute("View1").attachMatched(this._onRoute,this);this.getPendingHU();this.getView().byId("idHUSource").setValueState("None")},_onRoute:function(e){g.setData({Flag:"false"});this.getView().byId("idBottomText").setText(d.getData().Message);this.getView().byId("idHUSource").setValueState("None");this.getView().byId("idHUSource").setValue()},getPendingHU:function(e){var t=this;var o="/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";var s=new sap.ui.model.odata.ODataModel(o);s.setHeaders({"Content-Type":"application/json"});var a=function(e,o){t.getView().byId("txtHUPending").setText(e.results[0].PendingHU);t.getView().byId("txtWhno").setText(e.results[0].Whno)};var n=function(e){};var i="DispatchPendingHUSet";s.read(i,{success:a,error:n})},onPage2:function(e){this.getOwnerComponent().getModel("oGlobalModel").setData();var t=e;var o=JSON.stringify(t);var s=o.replace(/\//g,"@");var a=sap.ui.core.UIComponent.getRouterFor(this);a.navTo("View2",{entity:JSON.stringify(s)})},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},getText:function(e,t){return this.getResourceBundle().getText(e,t)},onSearch:function(){var e=this.getView().byId("idHUSource").getValue();var t=this;if(e==""){this.getView().byId("idHUSource").setValueState("Error");o.warning(this.getText("enterHUError"))}else{var s="/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";var a=new sap.ui.model.odata.ODataModel(s);a.setHeaders({"Content-Type":"application/json"});var n=function(e,o){g.setData({Flag:"true"});t.onPage2(e);t.byId("idView1MsgBox").setType("Emphasized")};var i=function(e){g.setData({Flag:"false"});t.getView().setBusy(false);var o=$($.parseHTML(e.response.body)).find("message").length;var s=[];if(o==0){var a={type:"Error",title:e.message,description:""};s.push(a);t.byId("idView1MsgBox").setType("Reject")}else{for(var n=0;n<o;n++){var a={type:"Error",title:$($.parseHTML(e.response.body)).find("message")[n].innerText,description:""};s.push(a);t.byId("idView1MsgBox").setType("Reject")}}var i=[...new Map(s.map(e=>[e.title,e])).values()];r.setData(i)};var d="DispatchDetailSet(HandlingUnit='"+e+"',LogFlag='Y')";a.read(d,{success:n,error:i})}},handleMessagePopoverPress:function(e){i.toggle(e.getSource())}})});
},
	"com/safran/ewm/zewm_dispatch/controller/View2.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","com/safran/ewm/zewm_dispatch/model/formatter","sap/m/MessageBox","sap/ui/Device","sap/ui/model/json/JSONModel","sap/m/MessagePopover","sap/m/MessageItem"],function(e,t,a,s,o,i,n){"use strict";var r;var l;var d;var c;return e.extend("com.safran.ewm.zewm_dispatch.controller.View2",{formatter:t,onInit:function(){d=this.getOwnerComponent().getModel("oGlobalModel");c=this.getOwnerComponent().getModel("oErrorFlagModel");var e=new n({type:"{oMsgModel>type}",title:"{oMsgModel>title}",description:"{oMsgModel>description}"});r=new i({items:{path:"oMsgModel>/",template:e}});this.oComp=sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));this.oDataModel=this.oComp.getModel();var t=new sap.ui.model.json.JSONModel;this.getView().setModel(t,"oDataModel");var a=new sap.ui.model.json.JSONModel;this.getView().setModel(a,"oStockModel");var s=new sap.ui.model.json.JSONModel;this.getView().setModel(s,"oWarehouseModel");var o=new sap.ui.model.json.JSONModel;this.getView().setModel(o,"oMRPModel");var l=sap.ui.core.UIComponent.getRouterFor(this);l.getRoute("View2").attachPatternMatched(this._onRouteMatched,this)},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(jQuery(document.body).hasClass("sapUiSizeCozy")||jQuery(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!s.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass},_onRouteMatched:function(e){var t=c.getData();this.byId("MsgBoxId").setType("Emphasized");l=new o;this.getView().setModel(l,"oMsgModel");this.byId("MsgBoxId").addDependent(r);var a=e.getParameter("arguments").entity;var s=a.replace(/@/g,"/");var i=JSON.parse(s);this.SelectedData=JSON.parse(i);if(t.Flag=="false"){this.getView().byId("idNotFoundPage").setVisible(true);this.getView().byId("idPage2").setVisible(false)}else if(t.Flag=="true"){this.getView().byId("idNotFoundPage").setVisible(false);this.getView().byId("idPage2").setVisible(true);this.SelectedData.Quantity=parseInt(this.SelectedData.Quantity);this.SelectedData.MaximumQuantity=parseInt(this.SelectedData.MaximumQuantity);this.SelectedData.TotalPhysicalStock=parseInt(this.SelectedData.TotalPhysicalStock);this.SelectedData.TotalMrpStock=parseInt(this.SelectedData.TotalMrpStock);this.SelectedData.TotalWhTaskStock=parseInt(this.SelectedData.TotalWhTaskStock);if(this.SelectedData.Sled!==null){this.SelectedData.Sled=new Date(this.SelectedData.Sled.toString().split("T")[0])}this.getView().getModel("oDataModel").setData(this.SelectedData);this.oHU=this.SelectedData.HandlingUnit;if(this.SelectedData.DispatchCase==="CASE2"){this.getView().byId("idCase1Form").setVisible(false);this.getView().byId("idCase2Form").setVisible(true)}else{this.getView().byId("idCase1Form").setVisible(true);this.getView().byId("idCase2Form").setVisible(false)}}},onBeforeRendering:function(){},getNavData:function(e){var t=this;var a="/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";var s=new sap.ui.model.odata.ODataModel(a);s.setHeaders({"Content-Type":"application/json"});var o=function(e,a){t.getView().getModel("oStockModel").setData(e.NAV_STOCK_CARD.results);t.getView().getModel("oMRPModel").setData(e.NAV_MRP_CARD.results);t.getView().getModel("oWarehouseModel").setData(e.NAV_WHNO_TASK_CARD.results);if(e.NAV_WHNO_TASK_CARD.results.length>0){t.WarehouseTask=e.NAV_WHNO_TASK_CARD.results[0].WarehouseTask}};var i=function(e){};var n="DispatchDetailSet(HandlingUnit='"+e+"',LogFlag='N')?$expand=NAV_STOCK_CARD,NAV_MRP_CARD,NAV_WHNO_TASK_CARD";s.read(n,{success:o,error:i})},onPressDetailedLog:function(){var e=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService&&sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"ApplicationLog",action:"showList"},params:{LogObjectId:"ZLOBJ_DISPATCH",LogObjectSubId:"ZLSUBOBJ_DISPATCH",LogExternalId:this.oHU}});var a=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(a,true)},onPressPacking:function(){var e=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService&&sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"EWMWorkCenter",action:"packInternal"},params:{}});var a=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(a,true)},getDialog:function(e,t){var a=this.getView();var s=a.byId(e);if(!s){s=sap.ui.xmlfragment(a.getId(),"com.safran.ewm.zewm_dispatch.view.fragments."+t,this);a.addDependent(s)}s.addStyleClass(this.getOwnerComponent().getContentDensityClass());return s},onPressStockTile:function(){var e=this;sap.ui.core.BusyIndicator.show();var t="/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";var s=new sap.ui.model.odata.ODataModel(t);s.setHeaders({"Content-Type":"application/json"});var o=function(t,a){sap.ui.core.BusyIndicator.hide();e.getView().getModel("oStockModel").setData(t.NAV_STOCK_CARD.results);e._StockDialog=sap.ui.xmlfragment("com.safran.ewm.zewm_dispatch.view.fragments.Stock",e);e.getView().addDependent(e._StockDialog);e._StockDialog.open()};var i=function(t){sap.ui.core.BusyIndicator.hide();a.error(e.getView().getModel("i18n").getResourceBundle().getText("error"))};var n="DispatchDetailSet(HandlingUnit='"+this.oHU+"',LogFlag='N')?$expand=NAV_STOCK_CARD";s.read(n,{success:o,error:i})},onStockClose:function(){this._StockDialog.close();this._StockDialog.destroy()},onPressWarehouseTile:function(){var e=this;sap.ui.core.BusyIndicator.show();var t="/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";var s=new sap.ui.model.odata.ODataModel(t);s.setHeaders({"Content-Type":"application/json"});var o=function(t,a){sap.ui.core.BusyIndicator.hide();e.getView().getModel("oWarehouseModel").setData(t.NAV_WHNO_TASK_CARD.results);e._WarehouseDialog=sap.ui.xmlfragment("com.safran.ewm.zewm_dispatch.view.fragments.WarehouseTasks",e);e.getView().addDependent(e._WarehouseDialog);e._WarehouseDialog.open()};var i=function(t){sap.ui.core.BusyIndicator.hide();a.error(e.getView().getModel("i18n").getResourceBundle().getText("error"))};var n="DispatchDetailSet(HandlingUnit='"+this.oHU+"',LogFlag='N')?$expand=NAV_WHNO_TASK_CARD";s.read(n,{success:o,error:i})},onWarehouseClose:function(){this._WarehouseDialog.close();this._WarehouseDialog.destroy()},onPressMRPTile:function(){var e=this;sap.ui.core.BusyIndicator.show();var t="/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";var s=new sap.ui.model.odata.ODataModel(t);s.setHeaders({"Content-Type":"application/json"});var o=function(t,a){sap.ui.core.BusyIndicator.hide();e.getView().getModel("oMRPModel").setData(t.NAV_MRP_CARD.results);e._MRPDialog=sap.ui.xmlfragment("com.safran.ewm.zewm_dispatch.view.fragments.MRP",e);e.getView().addDependent(e._MRPDialog);e._MRPDialog.open()};var i=function(t){sap.ui.core.BusyIndicator.hide();a.error(e.getView().getModel("i18n").getResourceBundle().getText("error"))};var n="DispatchDetailSet(HandlingUnit='"+this.oHU+"',LogFlag='N')?$expand=NAV_MRP_CARD";s.read(n,{success:o,error:i})},onMRPClose:function(){this._MRPDialog.close();this._MRPDialog.destroy()},onClickValidationCase1:function(){var e="";this.onCreate(e)},onClickValidationCase2:function(){var e=this;this.getView().byId("idDestinationHUCase2").setValueState("None");var t=this.getView().byId("idDestinationHUCase2").getValue();var s=this.getOwnerComponent().getModel();if(t==""){this.getView().byId("idDestinationHUCase2").setValueState("Error");a.warning("{i18n>destinationInputError}")}else{s.callFunction("/FI_PackSourceHUToDestinationHU",{method:"POST",urlParameters:{SourceHU:this.oHU,DestinationHU:t,SourceStorageType:this.SelectedData.StorageType,SourceStorageBin:this.SelectedData.StorageBin,DestinationStorageType:this.SelectedData.DestinationStorageType,DestinationStorageBin:this.SelectedData.DestinationStorageBin},success:function(t,a){c.setData({Flag:"false"});e.getOwnerComponent().getModel("oGlobalModel").setData(t);var s=sap.ui.core.UIComponent.getRouterFor(e);s.navTo("View1")},error:function(t){var a=[];if(t.hasOwnProperty(t)){var s=$($.parseHTML(t.response.body)).find("message").length;for(var o=0;o<s;o++){var i={type:"Error",title:$($.parseHTML(t.response.body)).find("message")[o].innerText,description:""};a.push(i);e.byId("MsgBoxId").setType("Reject")}var n=[...new Map(a.map(e=>[e.title,e])).values()];l.setData(n)}else{var i={type:"Error",title:JSON.parse(t.responseText).error.message.value,description:""};a.push(i);e.byId("MsgBoxId").setType("Reject");var n=[...new Map(a.map(e=>[e.title,e])).values()];l.setData(n)}}})}},onChangeFragment:function(){this.getView().byId("idCase1Form").setVisible(false);this.getView().byId("idCase2Form").setVisible(true)},onCreate:function(e){var t=this;var a=this.getOwnerComponent().getModel();a.callFunction("/FI_CreateWarehouseTask",{method:"POST",urlParameters:{HandlingUnit:this.oHU,Simulation:e},success:function(e,a){c.setData({Flag:"false"});t.getOwnerComponent().getModel("oGlobalModel").setData(e);var s=sap.ui.core.UIComponent.getRouterFor(t);s.navTo("View1")},error:function(e){t.getView().setBusy(false);var a=$($.parseHTML(e.response.body)).find("message").length;var s=[];for(var o=0;o<a;o++){var i={type:"Error",title:$($.parseHTML(e.response.body)).find("message")[o].innerText,description:""};s.push(i);t.byId("MsgBoxId").setType("Reject")}const n=[...new Map(s.map(e=>[e.title,e])).values()];l.setData(n)}})},handleMessagePopoverPress:function(e){r.toggle(e.getSource())},onBackPressed:function(){var e=sap.ui.core.UIComponent.getRouterFor(this);e.navTo("View1")}})});
},
	"com/safran/ewm/zewm_dispatch/i18n/i18n.properties":'title=Dispatch Application\nappTitle=Dispatch Application\nappDescription=Dispatch Application\nnotFoundTitle=Not Found\nnotFoundText=Not Found\nback=Back\nerror=Error\n\nDispatch=Dispatch\nHUPending=HU No. Pending\nHUSource=Source HU\nenterHUError=Please input source HU\nWhno=Warehouse Number\ndestinationInputError=Please enter Destination HU\n\nValidationButton=Validation\nChangeButton=Change\nCloseButton=Close\nPackingButton=Packing\nMessageCloseButton=Close\n\nHUType=HU Type\nArticle=Article\nBatch=Batch\nQty=Qty\nSLED=SLED\nMSL=MSL\nQuantityReplenish0=Replenishment Qty\nQuantityReplenish1=Replenishment Qty\nQuantityReplenish2=Replenishment MAX Qty\n\nDestination=Destination\nDestinationHU=Destination HU\nStorageType=Storage Type\nStorageBin=Storage Bin\n\n#XMSG ----- KPI Cards/Dialogs Texts\nstockDialogTitle=Stock\nwarehouseTasksDialogTitle=Warehouse Tasks\nMRPDialogTitle=MRP\ndetailedLogTitle=Detailed Log\n\nFragmentHandlingUnit=Handling Unit\nFragmentWarehouseNumber=Warehouse Number\nFragmentWarehouseTask=Warehouse Task\nFragmentSourceStorageType=Source Storage Type\nFragmentSourceStorageBin=Source Storage Bin\nFragmentDestinationStorageType=Destination Storage Type\nFragmentDestinationStorageBin=Destination Storage Bin\nFragmentArticle=Article\nFragmentBatch=Batch\nFragmentQuantity=Quantity\nFragmentCategory=Category\nFragmentRequirementDate=Requirement Date\nFragmentRequiredQuantity=Required Quantity\nFragmentStorageType=Storage Type\nFragmentStorageBin=Storage Bin\nFragmentGrouping=Grouping\nFragmentStockType=Stock Type\nFragmentUom=Unit of Measure',
	"com/safran/ewm/zewm_dispatch/i18n/i18n_en.properties":'title=Dispatch Application\nappTitle=Dispatch Application\nappDescription=Dispatch Application\nnotFoundTitle=Not Found\nnotFoundText=Not Found\nback=Back\nerror=Error\n\nDispatch=Dispatch\nHUPending=HU No. Pending\nHUSource=Source HU\nenterHUError=Please input source HU\nWhno=Warehouse Number\ndestinationInputError=Please enter Destination HU\n\nValidationButton=Validation\nChangeButton=Change\nCloseButton=Close\nPackingButton=Packing\nMessageCloseButton=Close\n\nHUType=HU Type\nArticle=Article\nBatch=Batch\nQty=Qty\nSLED=SLED\nMSL=MSL\nQuantityReplenish0=Replenishment Qty\nQuantityReplenish1=Replenishment Qty\nQuantityReplenish2=Replenishment MAX Qty\n\nDestination=Destination\nDestinationHU=Destination HU\nStorageType=Storage Type\nStorageBin=Storage Bin\nDetailedLog=Detailed Log\n\n#XMSG ----- Stock Dialog Texts\nstockDialogTable=Stock\nwarehouseTasksDialogTitle=Warehouse Tasks\nMRPDialogTitle=MRP\ndetailedLogTitle=Detailed Log\n\nFragmentHandlingUnit=Handling Unit\nFragmentWarehouseNumber=Warehouse Number\nFragmentWarehouseTask=Warehouse Task\nFragmentSourceStorageType=Source Storage Type\nFragmentSourceStorageBin=Source Storage Bin\nFragmentDestinationStorageType=Destination Storage Type\nFragmentDestinationStorageBin=Destination Storage Bin\nFragmentArticle=Article\nFragmentBatch=Batch\nFragmentQuantity=Quantity\nFragmentCategory=Category\nFragmentRequirementDate=Requirement Date\nFragmentRequiredQuantity=Required Quantity\nFragmentStorageType=Storage Type\nFragmentStorageBin=Storage Bin\nFragmentGrouping=Grouping\nFragmentStockType=Stock Type\nFragmentUom=Unit of Measure',
	"com/safran/ewm/zewm_dispatch/i18n/i18n_fr.properties":'title=Application Dispatch\nappTitle=Application Dispatch\nappDescription=Application Dispatch\nnotFoundTitle=Pas trouv\\u00e9\nnotFoundText=Pas trouv\\u00e9\nback=Dos\nerror=erreur\n\nDispatch=Dispatch\nHUPending=Nb. d\'UM en attente\nHUSource=UM source\nenterHUError=Please input source HU\nWhno=Num\\u00e9ro de magasin\ndestinationInputError=Veuillez saisir la destination HU\n\nValidationButton=Valider\nChangeButton=Changer\nCloseButton=Close\nPackingButton=Cr\\u00e9er Emballage\nMessageCloseButton=Close\n\nHUType=Type UM\nArticle=Article\nBatch=Lot\nQty=Qt\\u00e9\nSLED=SLED\nMSL=MSL\nQuantityReplenish0=Qt\\u00e9 r\\u00e9approvisionnement\nQuantityReplenish1=Qt\\u00e9 r\\u00e9approvisionnement\nQuantityReplenish2=Qt\\u00e9 MAX r\\u00e9approvisionnement\n\nDestination=Destination\nDestinationHU=HU de regroupement\nStorageType=Type magasin\nStorageBin=Emplacement\nDetailedLog=Journal des messages\n\n#XMSG ----- Stock Dialog Texts\nstockDialogTable=Stock\nwarehouseTasksDialogTitle=T\\u00e2che magasin\nMRPDialogTitle=MRP\ndetailedLogTitle=Journal des messages\n\nFragmentHandlingUnit=Unit\\u00e9 de manutention\nFragmentWarehouseNumber=Num\\u00e9ro d\'entrep\\u00f4t\nFragmentWarehouseTask=T\\u00e2che magasin\nFragmentSourceStorageType=Type magasin c\\u00e9dant\nFragmentSourceStorageBin=Emplacement c\\u00e9dant\nFragmentDestinationStorageType=Type de magasin prenant\nFragmentDestinationStorageBin=Emplacement prenant\nFragmentArticle=Produit\nFragmentBatch=Lot\nFragmentQuantity=Quantit\\u00e9\nFragmentCategory=Type de stock\nFragmentRequirementDate=Date de besoin\nFragmentRequiredQuantity=Quantit\\u00e9 du besoin\nFragmentStorageType=Type de magasin\nFragmentStorageBin=Emplacement\nFragmentGrouping=Regroupement\nFragmentStockType=Type de stock\nFragmentUom=Unit\\u00e9 de mesure',
	"com/safran/ewm/zewm_dispatch/localService/metadata.xml":'<edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx"\n\txmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:sap="http://www.sap.com/Protocols/SAPData" Version="1.0"><edmx:DataServices m:DataServiceVersion="2.0"><Schema xmlns="http://schemas.microsoft.com/ado/2008/09/edm" Namespace="ZLEWM_DISPATCH_APP_SRV" xml:lang="en" sap:schema-version="1"><Annotation xmlns="http://docs.oasis-open.org/odata/ns/edm" Term="Core.SchemaVersion" String="1.0.0"/><EntityType Name="DispatchDetail" sap:content-version="1"><Key><PropertyRef Name="Huident"/></Key><Property Name="GuidHu" Type="Edm.Binary" Nullable="false" MaxLength="16" sap:label="HU GUID"/><Property Name="Huident" Type="Edm.String" Nullable="false" MaxLength="20" sap:label="Handling Unit"/></EntityType><EntityContainer Name="ZLEWM_DISPATCH_APP_SRV_Entities" m:IsDefaultEntityContainer="true" sap:supported-formats="atom json xlsx"><EntitySet Name="DispatchDetailSet" EntityType="ZLEWM_DISPATCH_APP_SRV.DispatchDetail" sap:content-version="1"/></EntityContainer><atom:link xmlns:atom="http://www.w3.org/2005/Atom" rel="self" href="./sap/ZLEWM_DISPATCH_APP_SRV/$metadata"/><atom:link xmlns:atom="http://www.w3.org/2005/Atom" rel="latest-version" href="./sap/ZLEWM_DISPATCH_APP_SRV/$metadata"/></Schema></edmx:DataServices></edmx:Edmx>',
	"com/safran/ewm/zewm_dispatch/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"com.safran.ewm.zewm_dispatch","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"servicecatalog.connectivityComponentForManifest","version":"0.0.0"},"dataSources":{"ZLEWM_DISPATCH_APP_SRV":{"uri":"/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/","type":"OData","settings":{"localUri":"localService/metadata.xml"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"fullWidth":true},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"com.safran.ewm.zewm_dispatch.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.65.6","libs":{"sap.ui.layout":{},"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"com.safran.ewm.zewm_dispatch.i18n.i18n"}},"":{"type":"sap.ui.model.odata.v2.ODataModel","settings":{"defaultOperationMode":"Server","defaultBindingMode":"OneWay","defaultCountMode":"Request"},"dataSource":"ZLEWM_DISPATCH_APP_SRV","preload":true},"oGlobalModel":{"type":"sap.ui.model.json.JSONModel"}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"com.safran.ewm.zewm_dispatch.view","controlAggregation":"pages","controlId":"app","transition":"slide","clearControlAggregation":false,"async":true},"routes":[{"name":"View1","pattern":"","target":["View1"]},{"name":"View2","pattern":"View2/{entity}","target":["View2"]}],"targets":{"View1":{"viewName":"View1","viewLevel":1},"View2":{"viewName":"View2","viewLevel":2}}}},"sap.platform.abap":{"uri":"/sap/bc/ui5_ui5/sap/zewm_dispatch/webapp","_version":"1.1.0"}}',
	"com/safran/ewm/zewm_dispatch/model/formatter.js":function(){sap.ui.define(["sap/ui/core/format/DateFormat"],function(t){"use strict";return{setJSDate:function(t){return new Date(t.toString().split("T")[0])},parseToInt:function(t){return parseInt(t)}}});
},
	"com/safran/ewm/zewm_dispatch/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,o){"use strict";return{createDeviceModel:function(){var d=new e(o);d.setDefaultBindingMode("OneWay");return d},oGlobalModel:function(){var o=new e;return o},oErrorFlagModel:function(){var o=new e;return o},component:null,models:[{model:"oGlobalModel"},{model:"oErrorFlagModel"},{model:"gm",data:{editMode:false,createModel:{}}},{model:"device",data:o},{model:"stockModel",data:[]},{model:"warehouseModel",data:[]},{model:"MRPModel",data:[]}],getModel:function(e){return this.component.getModel(e)}}});
},
	"com/safran/ewm/zewm_dispatch/serviceBinding.js":'function initModel(){var a="/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";var e=new sap.ui.model.odata.ODataModel(a,true);sap.ui.getCore().setModel(e)}',
	"com/safran/ewm/zewm_dispatch/view/App.view.xml":'<mvc:View\n\tcontrollerName="com.safran.ewm.zewm_dispatch.controller.App"\n\tdisplayBlock="true"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><App\n\t\tid="app"\n\t\tbusy="{appView>/busy}"\n\t\tbusyIndicatorDelay="{appView>/delay}"/></mvc:View>',
	"com/safran/ewm/zewm_dispatch/view/View1.view.xml":'<mvc:View controllerName="com.safran.ewm.zewm_dispatch.controller.View1" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><Shell id="shell" appWidthLimited="false"><App id="app"><pages><Page id="idPage1" title="{i18n>appDescription}"><content><VBox ><Toolbar ><Label text="{i18n>HUPending} : "/><Text id="txtHUPending" text="" width="10rem"></Text><Label text="{i18n>Whno} : "/><Text id="txtWhno" text="" width="10rem"></Text></Toolbar><FlexBox justifyContent="Center" alignItems="Center" height="20rem"><VBox alignItems="Center"><Label text="{i18n>HUSource}"/><HBox><Input id="idHUSource" width="15rem" maxLength="20" textAlign="Center" change="onSearch"></Input><Button icon="sap-icon://search" type="Accept" press="onSearch"/></HBox></VBox></FlexBox><FlexBox alignItems="Start" justifyContent="Start"><Text width="1rem"></Text><Text id="idBottomText" text="" class="textGreenColor"></Text></FlexBox></VBox></content><footer><OverflowToolbar><Button id="idView1MsgBox" icon="sap-icon://alert" type="Emphasized" press="handleMessagePopoverPress"/><ToolbarSpacer/></OverflowToolbar></footer></Page></pages></App></Shell></mvc:View>',
	"com/safran/ewm/zewm_dispatch/view/View2.view.xml":'<mvc:View controllerName="com.safran.ewm.zewm_dispatch.controller.View2" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"\n\txmlns:core="sap.ui.core" xmlns:f="sap.f" xmlns:card="sap.f.cards" xmlns:l="sap.ui.layout" xmlns:form="sap.ui.layout.form"\n\txmlns:uxap="sap.uxap"><Shell appWidthLimited="false"><App><pages><Page id="idPage" title="{i18n>appDescription}" class="sapUiSizeCompact"><content><VBox id="idNotFoundPage" alignItems="Center" width="100%" height="100%"><FlexBox alignItems="Center" justifyContent="Center" height="12rem" width="100%"><core:Icon src="sap-icon://document" size="10rem" color="gray"></core:Icon></FlexBox><FlexBox alignItems="Center" justifyContent="Center" height="2rem" width="100%"><Text text="{i18n>notFoundText}"/></FlexBox><FlexBox alignItems="Center" justifyContent="Center" height="2rem" width="100%"><Link id="link" text="{i18n>back}" press="onBackPressed"/></FlexBox></VBox><VBox id="idPage2" alignItems="Center" width="100%" height="100%"><FlexBox alignItems="Center" justifyContent="End" width="100%"><Toolbar width="100%" ><Text width="0rem"></Text><ToolbarSpacer ></ToolbarSpacer><Button text="{i18n>PackingButton}" type="Emphasized" press="onPressPacking"></Button></Toolbar></FlexBox><l:VerticalLayout width="100%"><l:Grid containerQuery="true" defaultSpan="XL6 L6 M6 S12" visible="true"><VBox><form:SimpleForm id="idCase1Form" editable="true" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="4" labelSpanS="4"\n\t\t\t\t\t\t\t\t\t\t\tadjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="1" columnsL="1" columnsM="1"\n\t\t\t\t\t\t\t\t\t\t\tsingleContainerFullSize="false"><form:content><Label text="{i18n>StorageType}"/><Input id="idStorageTypeCase1" value="{oDataModel>/StorageType}" enabled="false"></Input><Label text="{i18n>StorageBin}"/><Input id="idStorageBinCase1" value="{oDataModel>/StorageBin}" enabled="false" maxLength="18"></Input><Label labelFor="idQuantityReplenishCase1"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{= ${oDataModel>/QuantityDescFlag} === \'2\' ? ${i18n>QuantityReplenish2} : ${i18n>QuantityReplenish1} }"/><Input id="idQuantityReplenishCase1" value="{oDataModel>/MaximumQuantity}" enabled="false" maxLength="15" type="Number"></Input><Label></Label><HBox><Button text="{i18n>ValidationButton}" press="onClickValidationCase1" type="Emphasized"/><Text width="1rem"></Text><Button text="{i18n>ChangeButton}" press="onChangeFragment" type="Emphasized"/></HBox></form:content></form:SimpleForm><form:SimpleForm id="idCase2Form" editable="true" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="4" labelSpanS="4"\n\t\t\t\t\t\t\t\t\t\t\tadjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="1" columnsL="1" columnsM="1"\n\t\t\t\t\t\t\t\t\t\t\tsingleContainerFullSize="false" visible="false"><form:content><Label text=""></Label><Text></Text><Label text="{i18n>Destination}"></Label><Input id="idDestinationCase2" value="{oDataModel>/DestinationStorageBin}" enabled="false" maxLength="10"></Input><Label text=""></Label><Label text="{i18n>DestinationHU}"></Label><Input id="idDestinationHUCase2" value="{oDataModel>/DestinationHandlingUnit}" enabled="true" maxLength="20"></Input><Label/><Button id="idValidateButton2" text="{i18n>ValidationButton}" press="onClickValidationCase2" type="Emphasized"/><Button text="{i18n>ChangeButton}" press="onClickChangeCase2" type="Emphasized" visible="false"/></form:content></form:SimpleForm></VBox><form:SimpleForm id="idSimpleForm2" editable="true" layout="ColumnLayout" singleContainerFullSize="false" columnsL="1" columnsM="1"><form:content><Label id="lblSourceHU" text="{i18n>HUSource}"><layoutData><l:GridData span="L3 M3 S3" linebreak="true"/></layoutData></Label><Input id="idSourceHU" value="{oDataModel>/HandlingUnit}" enabled="false"><layoutData><l:GridData span="L3 M3 S3" linebreak="true"/></layoutData></Input><Label id="lblHUType" text="{i18n>HUType}"/><Input id="idHUType" value="{oDataModel>/HandlingUnitType}" enabled="false"><layoutData><l:GridData span="L3 M3 S3" linebreak="true"/></layoutData></Input><Label id="lblArticle" text="{i18n>Article}"/><Input id="idArticle" value="{oDataModel>/Article}" enabled="false"><layoutData><l:GridData span="L3 M3 S3" linebreak="true"/></layoutData></Input><Label id="lblBatch" text="{i18n>Batch}"/><Input id="idBatch" value="{oDataModel>/Batch}" enabled="false"><layoutData><l:GridData span="L3 M3 S3" linebreak="true"/></layoutData></Input><Label id="lblQty" text="{i18n>Qty}"/><Input id="idQty" value="{oDataModel>/Quantity}" enabled="false"><layoutData><l:GridData span="L3 M3 S3" linebreak="true"/></layoutData></Input><Label id="lblSLED" text="{i18n>SLED}"/><DatePicker dateValue="{oDataModel>/Sled}" valueFormat="yyyy-MM-dd" displayFormat="dd.MM.yyyy" enabled="false"/><Label id="lblMSL" text="{i18n>MSL}"/><Input id="idMSL" value="{oDataModel>/Msl}" enabled="false"><layoutData><l:GridData span="L3 M3 S3" linebreak="true"/></layoutData></Input></form:content></form:SimpleForm></l:Grid></l:VerticalLayout><FlexBox alignItems="Center" justifyContent="SpaceBetween" width="100%"><Text width="2rem"></Text><GenericTile id="idTile1" header="{i18n>stockDialogTitle}" press="onPressStockTile"><TileContent><HBox justifyContent="End"><Title id="idTileText1" text="{oDataModel>/TotalPhysicalStock}" level="H3"></Title></HBox></TileContent></GenericTile><GenericTile id="idTile2" header="{i18n>warehouseTasksDialogTitle}" press="onPressWarehouseTile"><TileContent><HBox justifyContent="End"><Title id="idTileText2" text="{oDataModel>/TotalWhTaskStock}" level="H3"></Title></HBox></TileContent></GenericTile><GenericTile id="idTile3" header="{i18n>MRPDialogTitle}" press="onPressMRPTile"><TileContent><HBox justifyContent="End"><Title id="idTileText3" text="{oDataModel>/TotalMrpStock}" level="H3"></Title></HBox></TileContent></GenericTile><GenericTile id="idTile4" header="{i18n>detailedLogTitle}" press="onPressDetailedLog"><TileContent></TileContent></GenericTile><Text width="2rem"></Text></FlexBox></VBox></content><footer><OverflowToolbar><Button id="MsgBoxId" icon="sap-icon://alert" type="Emphasized" press="handleMessagePopoverPress"/><ToolbarSpacer/></OverflowToolbar></footer></Page></pages></App></Shell></mvc:View>',
	"com/safran/ewm/zewm_dispatch/view/fragments/MRP.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" xmlns:f="sap.ui.layout.form"><Dialog id="idMRPDialog" title="{i18n>MRPDialogTitle}" contentWidth="100%" contentHeight="100%" resizable="false" draggable="false"><content><Table id="idMRPTable" items="{oMRPModel>/}" inset="false"><columns><Column hAlign="Center"><Text text="{i18n>FragmentRequirementDate}" textAlign="Center"/></Column><Column hAlign="Center"><Text text="{i18n>FragmentRequiredQuantity}" textAlign="Center"/></Column></columns><items><ColumnListItem><cells><DatePicker dateValue="{path:\'oMRPModel>RequirementDate\', formatter:\'.formatter.setJSDate\'}" valueFormat="yyyy-MM-dd" displayFormat="dd.MM.yyyy"\n\t\t\t\t\t\t\t\tenabled="false" width="auto"/></cells><cells><Text text="{path:\'oMRPModel>RequiredQuantity\', formatter:\'.formatter.parseToInt\'}" /></cells></ColumnListItem></items></Table></content><buttons><Button text="{i18n>CloseButton}" tooltip="{i18n>CloseButton}" press="onMRPClose"/></buttons></Dialog></core:FragmentDefinition>',
	"com/safran/ewm/zewm_dispatch/view/fragments/MessageView.fragment.xml":'<!DOCTYPE XML><core:FragmentDefinition xmlns="sap.m" xmlns:f="sap.ui.layout.form" xmlns:l="sap.ui.layout"\n\txmlns:app="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1" xmlns:table="sap.ui.table" xmlns:core="sap.ui.core"><Dialog id="MainDId" title="{i18n>mainDialog_label} {gm>/operationType} {gm>/createModel/HandlingUnit}" contentWidth="100%"\n\t\tcontentHeight="90%" resizable="false" draggable="false" afterOpen="afterOpenMainDialog" afterClose="afterCloseMainDialog"><content></content><buttons><Button text="{i18n>MessageCloseButton}" tooltip="{i18n>MessageCloseButton}" press="onClickMessageClose"/></buttons></Dialog></core:FragmentDefinition>',
	"com/safran/ewm/zewm_dispatch/view/fragments/Stock.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" xmlns:f="sap.ui.layout.form"><Dialog title="{i18n>stockDialogTitle}" contentWidth="100%" contentHeight="100%" resizable="false" draggable="false"><content><Table items="{oStockModel>/}" inset="false"><columns><Column ><Text text="{i18n>FragmentWarehouseNumber}"/></Column><Column ><Text text="{i18n>FragmentGrouping}"/></Column><Column ><Text text="{i18n>FragmentStorageType}"/></Column><Column ><Text text="{i18n>FragmentStorageBin}"/></Column><Column><Text text="{i18n>FragmentHandlingUnit}"/></Column><Column ><Text text="{i18n>FragmentArticle}"/></Column><Column ><Text text="{i18n>FragmentBatch}"/></Column><Column ><Text text="{i18n>FragmentQuantity}"/></Column><Column ><Text text="{i18n>FragmentUom}"/></Column><Column ><Text text="{i18n>FragmentStockType}"/></Column></columns><items><ColumnListItem><cells><Text text="{oStockModel>WarehouseNumber}"/></cells><cells><Text text="{oStockModel>Grouping}"/></cells><cells><Text text="{oStockModel>StorageType}"/></cells><cells><Text text="{oStockModel>StorageBin}"/></cells><cells><Text text="{oStockModel>HandlingUnit}"/></cells><cells><Text text="{oStockModel>Article}"/></cells><cells><Text text="{oStockModel>Batch}"/></cells><cells><Text text="{path:\'oStockModel>Quantity\', formatter:\'.formatter.parseToInt\'}"/></cells><cells><Text text="{oStockModel>Uom}"/></cells><cells><Text text="{oStockModel>StockType}"/></cells></ColumnListItem></items></Table></content><buttons><Button text="{i18n>CloseButton}" tooltip="{i18n>CloseButton}" press="onStockClose"/></buttons></Dialog></core:FragmentDefinition>',
	"com/safran/ewm/zewm_dispatch/view/fragments/WarehouseTasks.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" xmlns:f="sap.ui.layout.form"><Dialog id="idWarehouseDialog" title="{i18n>warehouseTasksDialogTitle}" contentWidth="100%" contentHeight="100%" resizable="false"\n\t\tdraggable="false"><content><Table items="{oWarehouseModel>/}" inset="false"><columns><Column ><Text text="{i18n>FragmentWarehouseNumber}"/></Column><Column><Text text="{i18n>FragmentHandlingUnit}"/></Column><Column ><Text text="{i18n>FragmentWarehouseTask}"/></Column><Column ><Text text="{i18n>FragmentCategory}"/></Column><Column ><Text text="{i18n>FragmentArticle}"/></Column><Column ><Text text="{i18n>FragmentBatch}"/></Column><Column ><Text text="{i18n>FragmentQuantity}"/></Column><Column ><Text text="{i18n>FragmentUom}"/></Column><Column ><Text text="{i18n>FragmentSourceStorageType}"/></Column><Column ><Text text="{i18n>FragmentSourceStorageBin}"/></Column><Column ><Text text="{i18n>FragmentDestinationStorageType}"/></Column><Column ><Text text="{i18n>FragmentDestinationStorageBin}"/></Column></columns><items><ColumnListItem><cells><Text text="{oWarehouseModel>WarehouseNumber}"/></cells><cells><Text text="{oWarehouseModel>HandlingUnit}"/></cells><cells><Text text="{oWarehouseModel>WarehouseTask}"/></cells><cells><Text text="{oWarehouseModel>Cat}"/></cells><cells><Text text="{oWarehouseModel>Article}"/></cells><cells><Text text="{oWarehouseModel>Batch}"/></cells><cells><Text text="{path:\'oWarehouseModel>Quan\', formatter:\'.formatter.parseToInt\'}"/></cells><cells><Text text="{oWarehouseModel>Uom}"/></cells><cells><Text text="{oWarehouseModel>SourceStorageType}"/></cells><cells><Text text="{oWarehouseModel>SourceStorageBin}"/></cells><cells><Text text="{oWarehouseModel>DestinationStorageType}"/></cells><cells><Text text="{oWarehouseModel>DestinationStorageBin}"/></cells></ColumnListItem></items></Table></content><buttons><Button text="{i18n>CloseButton}" tooltip="{i18n>CloseButton}" press="onWarehouseClose"/></buttons></Dialog></core:FragmentDefinition>'
}});