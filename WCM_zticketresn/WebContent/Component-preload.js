jQuery.sap.registerPreloadedModules({version:"2.0",name:"com/acute/ticketReSn/Component-preload",modules:{"com/acute/ticketReSn/Component.js":'jQuery.sap.declare("com.acute.ticketReSn.Component"),jQuery.sap.require("sap.ui.core.UIComponent"),jQuery.sap.require("sap.ui.core.routing.History"),jQuery.sap.require("sap.m.routing.RouteMatchedHandler"),sap.ui.core.UIComponent.extend("com.acute.ticketReSn.Component",{metadata:{name:"com.acute.ticketReSn",version:"1.1.0-SNAPSHOT",library:"com.acute.ticketReSn",includes:["css/style.css"],dependencies:{libs:["sap.m","sap.ui.layout"],components:[]},config:{resourceBundle:"i18n/messageBundle.properties",serviceConfig:{name:"",serviceUrl:"/sap/opu/odata/sap/ZCS_TICKET_SRV/"}},routing:{config:{viewType:"XML",viewPath:"com.acute.ticketReSn.view",targetControl:"fioriContent",targetAggregation:"pages",clearTarget:!1},routes:[{pattern:"",name:"S1",view:"S1"}]}},createContent:function(){var e={component:this};return sap.ui.view({viewName:"com.acute.ticketReSn.view.Main",type:sap.ui.core.mvc.ViewType.XML,viewData:e})},init:function(){sap.ui.core.UIComponent.prototype.init.apply(this,arguments);var e=this.getMetadata().getConfig(),t=e.serviceConfig.serviceUrl,o=new sap.ui.model.odata.ODataModel(t,!0);o.setDefaultCountMode(sap.ui.model.odata.CountMode.None),o.attachMetadataFailed(function(){this.getEventBus().publish("Component","MetadataFailed")},this),this.setModel(o);var i=new sap.ui.model.json.JSONModel({isTouch:sap.ui.Device.support.touch,isNoTouch:!sap.ui.Device.support.touch,isPhone:sap.ui.Device.system.phone,isNoPhone:!sap.ui.Device.system.phone,listMode:sap.ui.Device.system.phone?"None":"SingleSelectMaster",listItemType:sap.ui.Device.system.phone?"Active":"Inactive"});i.setDefaultBindingMode("OneWay");var a=jQuery.sap.getModulePath("com.acute.ticketReSn"),s=new sap.ui.model.resource.ResourceModel({bundleUrl:[a,e.resourceBundle].join("/")});this.setModel(s,"i18n"),this.setModel(i,"device"),this.getRouter().initialize()},exit:function(){},setRouterSetCloseDialogs:function(e){this._bRouterCloseDialogs=e,this._routeMatchedHandler&&this._routeMatchedHandler.setCloseDialogs(e)},_initODataModel:function(e){var t=new sap.ui.model.odata.ODataModel(e,!0);t.setDefaultCountMode(sap.ui.model.odata.CountMode.None),this.setModel(t)}});',"com/acute/ticketReSn/util/Formatter.js":'jQuery.sap.declare("com.acute.ticketReSn.util.Formatter"),jQuery.sap.require("sap.ca.ui.model.format.DateFormat"),com.acute.ticketReSn.util.Formatter={date1:function(e){if(e){return sap.ui.core.format.DateFormat.getInstance({pattern:"dd-MM-yyyy"}).format(new Date(e))}return""},Code:function(e,t){return""==e&&""==t?"":e+" ("+t+")"},Mobile:function(e){if(""!=e){return e.replace("+91","")}return e},date:function(e){if(null!=e&&""!=e){return new Date(e)}return null}};',"com/acute/ticketReSn/view/Main.controller.js":'sap.ui.controller("com.acute.ticketReSn.view.Main",{});',"com/acute/ticketReSn/view/S1.controller.js":'jQuery.sap.require("sap.ui.core.mvc.Controller"),jQuery.sap.require("com.acute.ticketReSn.util.Formatter"),jQuery.sap.require("sap.m.MessageBox");var DataArticles,that;sap.ui.core.mvc.Controller.extend("com.acute.ticketReSn.view.S1",{onInit:function(){this.model=this.getOwnerComponent().getModel(),that=this,jQuery.support.touch||this.getView().addStyleClass("sapUiSizeCompact"),sap.ui.Device.system.desktop,this.onComplainRaised(),this.onTicketSource(),this.onTyreFitMent()},OnSingleSelect:function(){this.getView().byId("IdSearch").setVisible(!0).setValue(),this.getView().byId("idPanel2").setVisible(!1),this.getView().byId("idPanel1").setExpanded(!0),this.getView().byId("Id_bt2").setVisible(!1)},onComplainRaised:function(){var e=new sap.ui.model.json.JSONModel;e.loadData("/sap/opu/odata/sap/ZCS_TICKET_SRV/TypeOfCustomerSet",null,!1,"GET",!1,!1,null);var t=this.getView().byId("idCustomer1");t.unbindAggregation("items"),t.setModel(e),t.bindAggregation("items",{path:"/d/results",template:new sap.ui.core.Item({key:"{Type}",text:"{Description}"})})},onTicketSource:function(){var e=new sap.ui.model.json.JSONModel;e.loadData("/sap/opu/odata/sap/ZCS_TICKET_SRV/TicketSourceSet",null,!1,"GET",!1,!1,null);var t=this.getView().byId("idTicketSource");t.unbindAggregation("items"),t.setModel(e),t.bindAggregation("items",{path:"/d/results",template:new sap.ui.core.Item({key:"{Code}",text:"{Text}"})})},onTyreFitMent:function(){var e=new sap.ui.model.json.JSONModel;e.loadData("/sap/opu/odata/sap/ZCS_TICKET_SRV/FitmentTypeSet",null,!1,"GET",!1,!1,null);var t=this.getView().byId("idFitment");t.unbindAggregation("items"),t.setModel(e),t.bindAggregation("items",{path:"/d/results",template:new sap.ui.core.Item({key:"{Type}",text:"{Description}"})})},onTicket:function(){var e=new sap.ui.model.json.JSONModel;e.loadData("/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpTicketSet",null,!1,"GET",!1,!1,null);var t=new sap.m.SelectDialog({title:"Select Ticket",items:{path:"/d/results",template:new sap.m.StandardListItem({title:"{TicketNo}",customData:[new sap.ui.core.CustomData({key:"Key",value:"{TicketNo}"})]})},liveChange:function(e){var t=e.getParameter("value"),a=new sap.ui.model.Filter("TicketNo",sap.ui.model.FilterOperator.Contains,t);e.getSource().getBinding("items").filter([a])},confirm:[this._handleTicketClose,this],cancel:[this._handleTicketClose,this]});t.setModel(e),t.open()},_handleTicketClose:function(e){var t=e.getParameter("selectedItem");t&&(this.getView().byId("IdSearch").setValue(t.getTitle()),this.onEnter(t.getTitle()),this.getView().byId("Id_bt1").setVisible(!0),this.getView().byId("idPanel3").setVisible(!0))},OnUnassigned:function(){this.getView().byId("IdSearch").setVisible(!1).setValue(),this.getView().byId("idPanel2").setVisible(!0),this.getView().byId("idPanel1").setExpanded(!1),this.getView().byId("Id_bt1").setVisible(!1),this.getView().byId("Id_bt2").setVisible(!0),this.getView().byId("idPanel3").setVisible(!1),that.model.read("/GetUnassignedTicketsSet",null,null,!1,function(e,t){var a=that.getView().byId("tblDetail"),s=new sap.ui.model.json.JSONModel(e.results);that.getView().byId("ID_Name").setText("Un-Assigned Tickets ("+e.results.length+")"),a.unbindAggregation("items"),a.setModel(s),a.bindAggregation("items",{path:"/",template:new sap.m.ColumnListItem({cells:[new sap.m.Link({text:"{TicketNo}",press:[that.UnAssignDetail,that]}),new sap.m.Text({text:"{path:\'TicketDate\',formatter:\'com.acute.ticketReSn.util.Formatter.date1\'}"}),new sap.m.Text({text:"{CustTypeDesc}"}),new sap.m.Text({text:"{CustomerTelf1}"}),new sap.m.Text({text:"{CustomerFname}    {CustomerLname}"})]})})},function(e){var t=JSON.parse(e.response.body).error.message.value;sap.m.MessageBox.show(t,{title:"Error",icon:sap.m.MessageBox.Icon.ERROR})})},UnAssignDetail:function(e){this.getView().byId("idPanel2").setExpanded(!1),this.getView().byId("idPanel3").setExpanded(!0),this.getView().byId("idPanel3").setVisible(!0),this.onEnter(e.getSource().getBindingContext().getObject().TicketNo)},onExit:function(){},OnticketSearch:function(e){var t=new sap.ui.model.json.JSONModel;t.loadData("/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpTicketSet",null,!1,"GET",!1,!1,null);var a=new sap.m.SelectDialog({title:"Select Ticket",items:{path:"/d/results",template:new sap.m.StandardListItem({title:"{TicketNo}",customData:[new sap.ui.core.CustomData({key:"Key",value:"{TicketNo}"})]})},liveChange:function(e){var t=e.getParameter("value"),a=new sap.ui.model.Filter("TicketNo",sap.ui.model.FilterOperator.Contains,t);e.getSource().getBinding("items").filter([a])},confirm:[this._handleTicketClose,this],cancel:[this._handleTicketClose,this]});a.setModel(t),a.open()},onTickets:function(){0!=that.getView().byId("tblDetail").getSelectedItems().length?that.model.read("/ListServiceEngineerSet",null,null,!1,function(e,t){var a=new sap.ui.model.json.JSONModel(e.results),s=new sap.m.SelectDialog({title:"Service Engineers",items:{path:"/",template:new sap.m.StandardListItem({title:"{SeName}",customData:[new sap.ui.core.CustomData({key:"Key",value:"{ServEngg}"})]})},liveChange:function(e){var t=e.getParameter("value"),a=new sap.ui.model.Filter("SeName",sap.ui.model.FilterOperator.Contains,t);e.getSource().getBinding("items").filter([a])},confirm:[that._handleClose,that],cancel:[that._handleClose,that]});s.setModel(a),s.open()},function(e){var t=JSON.parse(e.response.body).error.message.value;sap.m.MessageBox.show(t,{title:"Error",icon:sap.m.MessageBox.Icon.ERROR})}):sap.m.MessageBox.show("Select Ticket to Assign",{title:"Error",icon:sap.m.MessageBox.Icon.ERROR})},_handleClose:function(e){var t=e.getParameter("selectedItem");if(t){var a=e.getParameter("selectedItem").getCustomData()[0].getValue(),s=t.getTitle();that.onAssainTicketsSave(s,a)}},onTicketSingle:function(){that.model.read("/ListServiceEngineerSet",null,null,!1,function(e,t){var a=new sap.ui.model.json.JSONModel(e.results),s=new sap.m.SelectDialog({title:"Service Engineers",items:{path:"/",template:new sap.m.StandardListItem({title:"{SeName}",customData:[new sap.ui.core.CustomData({key:"Key",value:"{ServEngg}"})]})},liveChange:function(e){var t=e.getParameter("value"),a=new sap.ui.model.Filter("SeName",sap.ui.model.FilterOperator.Contains,t);e.getSource().getBinding("items").filter([a])},confirm:[that._handleClose1,that],cancel:[that._handleClose1,that]});s.setModel(a),s.open()},function(e){var t=JSON.parse(e.response.body).error.message.value;sap.m.MessageBox.show(t,{title:"Error",icon:sap.m.MessageBox.Icon.ERROR})})},_handleClose1:function(e){var t=e.getParameter("selectedItem");if(t){var a=e.getParameter("selectedItem").getCustomData()[0].getValue(),s=t.getTitle();that.onAssainTicketsSave1(s,a)}},onAssainTicketsSave:function(e,t){var a=that.getView().byId("tblDetail"),s=a.getSelectedItems(),i=[],n=new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCS_TICKET_SRV/");n.setHeaders({"Content-Type":"application/atom+xml"});for(var o=0;o<s.length;o++){var l={};l.IServEngg=t,l.ISeName=e,l.TicketNo=s[o].getCells()[0].getText(),l.EMessage="";var r={"Accept-Language":"en-US",Accept:"application/xml"};i.push(n.createBatchOperation("/SEReassignSet","POST",l,r))}n.addBatchChangeOperations(i),n.submitBatch(function(e,t){for(var a=new sap.m.Button({text:"Ok",press:function(){s.close(),that.OnUnassigned()}}),s=new sap.m.Dialog({title:"Success",type:"Message",icon:"sap-icon://message-information",beginButton:a}),i=0;i<e.__batchResponses[0].__changeResponses.length;i++){var n=t.data.__batchResponses[0].__changeResponses[i].data;s.addContent(new sap.m.ObjectStatus({text:"Ticket "+n.TicketNo+" "+n.EMessage}))}s.open()},function(e,t){var a=new DOMParser,s=a.parseFromString(e.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML;sap.m.MessageBox.show(s,{title:"Error",icon:sap.m.MessageBox.Icon.ERROR})})},onAssainTicketsSave1:function(e,t){var a=[],s={};s.IServEngg=t,s.ISeName=e,s.TicketNo=that.data.d.ITicketNo,s.EMessage="";var i={"Accept-Language":"en-US",Accept:"application/xml"},n=new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCS_TICKET_SRV/");n.setHeaders({"Content-Type":"application/atom+xml"}),a.push(n.createBatchOperation("/SEReassignSet","POST",s,i)),n.addBatchChangeOperations(a),n.submitBatch(function(e,t){var a=new sap.m.Button({text:"Ok",press:function(){s.close(),that.getView().byId("idPanel2").getVisible()?that.OnUnassigned():(that.getView().byId("RD1").setSelected(!1),that.getView().byId("idPanel3").setVisible(!1),that.getView().byId("IdSearch").setVisible(!1).setValue(),that.getView().byId("idPanel2").setVisible(!1),that.getView().byId("idPanel1").setExpanded(!0))}}),s=new sap.m.Dialog({title:"Success",type:"Message",icon:"sap-icon://message-information",beginButton:a}),i=t.data.__batchResponses[0].__changeResponses[0].data;s.addContent(new sap.m.ObjectStatus({text:"Ticket "+i.TicketNo+" "+i.EMessage})),s.open()},function(e,t){var a=new DOMParser,s=a.parseFromString(e.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML;sap.m.MessageBox.show(s,{title:"Error",icon:sap.m.MessageBox.Icon.ERROR})})},onEnter:function(e){var t=this,a=e,s=new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCS_TICKET_SRV/");s.setHeaders({"Content-Type":"application/atom+xml"});var i=function(e,a){var s={d:e},i=e.VehicleType,n="/sap/opu/odata/sap/ZCS_TICKET_SRV/TyreConditionSet?$filter=Type eq \'"+i+"\'",o=new sap.ui.model.json.JSONModel;o.loadData(n,null,!1,"GET",!1,!1,null);var l=t.getView().byId("idCondition");l.unbindAggregation("items"),l.setModel(o),l.bindAggregation("items",{path:"/d/results",template:new sap.ui.core.Item({key:"{Condition}",text:"{Description}"})});var r=new sap.ui.model.json.JSONModel(s);if(t.getView().setModel(r,"jModel"),t.data=r.getData(),""!=t.data.d.EMessage)sap.m.MessageBox.show(t.data.d.EMessage,{title:"Error",icon:sap.m.MessageBox.Icon.ERROR,onClose:function(){t.flag="C",t.handleButtonPress(),t.getView().byId("idSave").setEnabled(!1)}});else{var d=t.data.d.FitType;"REP"===d||"STU"===d||"DEF"===d?(t.getView().byId("idVboxRep").setVisible(!0),t.getView().byId("idVboxOem").setVisible(!1)):(t.getView().byId("idVboxRep").setVisible(!1),t.getView().byId("idVboxOem").setVisible(!0))}},n=function(e){var t=new DOMParser,a=t.parseFromString(e.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML;sap.m.MessageBox.show(a,{title:"Error",icon:sap.m.MessageBox.Icon.ERROR})};s.read("/GetTicketDataSet(ITicketNo=\'"+a+"\')",{success:i,error:n})}});',"com/acute/ticketReSn/view/Main.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"\r\n\t\tcontrollerName="com.acute.ticketReSn.view.Main" xmlns:html="http://www.w3.org/1999/xhtml"><App id="fioriContent"></App></core:View>',"com/acute/ticketReSn/view/S1.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\r\n\txmlns:u="sap.ui.unified" xmlns="sap.m" xmlns:f="sap.ui.layout.form"\r\n\txmlns:l="sap.ui.layout" controllerName="com.acute.ticketReSn.view.S1"\r\n\txmlns:html="http://www.w3.org/1999/xhtml"><html:style>\r\n\t.h1 .sapMIBar-CTX .sapMTitle {\r\n    color: black;\r\n    font-weight: 700;\r\n    font-size: larger;\r\n\t}\r\n\t</html:style><Page title="Ticket Re-Assign" class="sapUiSizeCompact h1"><content><Panel expandable="true" expanded="true" width="auto" id="idPanel1"><headerToolbar><Toolbar height="3rem"><Title text="Search By" id="idPT1" /><ToolbarSpacer /></Toolbar></headerToolbar><HBox  justifyContent="Center"><RadioButton groupName="GroupA" id="RD1" select="OnSingleSelect" text="Ticket Number" selected="false" /><Label width="1rem"></Label><RadioButton groupName="GroupA" id="RD2" select="OnUnassigned" text="Un-Assigned Tickets" selected="false" /></HBox><HBox  justifyContent="Center"><Input width="90%" id="IdSearch" visible="false"  search="OnticketSearch" valueHelpRequest="onTicket"  \r\n\t\t\t       valueHelpOnly="true" showValueHelp="true" placeholder="Ticket Number" /></HBox></Panel><Panel expandable="true" expanded="true" width="auto" id="idPanel2"\r\n\t\t\t\t\texpand="panelExpand" visible="false"><headerToolbar><Toolbar height="3rem"><Title text="Un-Assigned Tickets" id="ID_Name" /><ToolbarSpacer /></Toolbar></headerToolbar><Table id="tblDetail" mode="MultiSelect" select="OnTableSelect"><columns><Column minScreenWidth="Tablet" demandPopin="true"><Label design="Bold" text="Ticket Number" /></Column><Column minScreenWidth="Tablet" demandPopin="true" ><Label design="Bold" text="Date" /></Column><Column minScreenWidth="Tablet" demandPopin="true" ><Label design="Bold" text="Customer Type" /></Column><Column minScreenWidth="Tablet" demandPopin="true"><Label design="Bold" text="Phone" visible="true" /></Column><Column minScreenWidth="Tablet" demandPopin="true"><Label design="Bold" text="Customer Name" visible="true" /></Column></columns></Table></Panel><Panel expandable="true" expanded="true" width="auto" id="idPanel3"\r\n\t\t\t\t\texpand="panelExpand" visible="false"><headerToolbar><Toolbar height="3rem"><Title text="Ticket Details"   /><ToolbarSpacer /></Toolbar></headerToolbar><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar1" minWidth="1024"\r\n\t\t\t\t\t\tmaxContainerCols="5" editable="true" layout="ResponsiveGridLayout"\r\n\t\t\t\t\t\tlabelSpanL="5"\r\n\t\t\t\t\t\tlabelSpanM="5"\r\n\t\t\t\t\t\temptySpanL="0"\r\n\t\t\t\t\t\temptySpanM="0"\r\n\t\t\t\t\t\tcolumnsL="3"\r\n\t\t\t\t\t\tcolumnsM="1" class="editableForm"><f:content><core:Title text="Header"/><Label text="Ticket Number" required="false"/><Input enabled="false" id="idTno" maxLength="14" submit="onEnter" \r\n\t\t\tvalueHelpRequest="onTicket"  valueHelpOnly="true" showValueHelp="true" value="{jModel>/d/TicketNo}"\r\n\t\t\t /><Label text="Complain Raised By" required="false"/><Select selectedKey="{jModel>/d/CustType}"  forceSelection="false" \r\n\t\t\t\tenabled="false" id="idCustomer1" change="onComplainRaisedChange"></Select><Label text="Ticket Source" required="false"/><Select selectedKey="{jModel>/d/TicketSource}" forceSelection="false" \r\n\t\t\tenabled="false" visible="true"  id="idTicketSource" change="onTicketSourceChange"></Select><core:Title text=""/><Label text="Ticket Date" required="false"/><DatePicker id="idTkDate" enabled="false" placeholder="Ticket Date" \r\n\t\t\t\tvalue="{path:\'jModel>/d/TicketDate\', formatter:\'com.acute.ticketReSn.util.Formatter.date1\'}"/><Label text="Tyre Fitment Type"/><Select selectedKey="{jModel>/d/FitType}" forceSelection="false" enabled="false" \r\n\t\t\t\t\t\tid="idFitment" change="onFitmentChange"><items><core:Item text="OEM" key="OEM"/><core:Item text="Replacement" key="Replacement"/></items></Select><Label text="CTI Number"  /><Input enabled="false"  liveChange="NumberValid"  id="idCTINumber" maxLength="20" \r\n\t\t\t\t       value="{jModel>/d/CtiNumber}"/><core:Title text=""/><Label text="SE Assigned" required="false"/><Input id="idSE" enabled="false" value="{jModel>/d/SeName}"/><Label text="Status" required="false"/><Input id="idStatus" enabled="false" value="{jModel>/d/StatusDesc}"/><Label text="" /></f:content></f:SimpleForm></VBox><html:hr/><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar2" minWidth="1024"\r\n\t\t\t\t\t  maxContainerCols="5" editable="true" layout="ResponsiveGridLayout"\r\n\t\t\t\t\t  labelSpanL="4" labelSpanM="4" emptySpanL="1" emptySpanM="1" columnsL="2"\r\n\t\t\t\t\t  columnsM="1" class="editableForm"><f:content><core:Title text="Customer Details"/><Label text="Type Of Cutomer" required="true"/><Select selectedKey="{jModel>/d/CustType}" forceSelection="false" visible="false" enabled="false" id="idCustomer"><layoutData></layoutData></Select><Label text="Phone No." required="false"/><Input value="+91" enabled="false" id="idPhone" submit="onEnter"><layoutData><l:GridData span="XL2 L1 M3 S4"/></layoutData></Input><Input enabled="false" type="Tel" liveChange="NumberValid" id="idPhone1" \r\n\t\t\t\t   maxLength="10" value="{path:\'jModel>/d/CustomerTelf1\', formatter:\'.formatter.Mobile\'}"/><Label text="Alternate No."/><Input value="+91" enabled="false" id="idalter" submit="onEnter"><layoutData><l:GridData span="XL2 L1 M2 S2"/></layoutData></Input><Input enabled="false" type="Tel"  liveChange="NumberValid" id="idphone2" \r\n\t\t\t       submit="onEnter" maxLength="10" value="{path:\'jModel>/d/CustomerTelf2\', formatter:\'.formatter.Mobile\'}"/><Label text="First Name" required="false" /><Input enabled="false" id="idFname" liveChange="validateCharacter" submit="onEnter" value="{jModel>/d/CustomerFname}"/><Label text="Last Name"/><Input id="idLname"  enabled="false" liveChange="validateCharacter" value="{jModel>/d/CustomerLname}"/><Label text="Address1" required="false"/><Input id="idAdd1"  enabled="false" value="{jModel>/d/CustomerAddr1}"/><Label text="Address2"/><Input id="idAdd2"  enabled="false" value="{jModel>/d/CustomerAddr2}"/><core:Title text=""/><Label text="Country" required="false"/><Select selectedKey="IN" enabled="false" id="idCountry" forceSelection="true"><items><core:Item text="India" key="IN"/></items></Select><Label text="State" required="false"/><Input enabled="false" id="idState" valueHelpRequest="onStateHelp" valueHelpOnly="true" showValueHelp="true" value="{jModel>/d/RegionDesc}"/><Label text="District" required="false"/><Input id="idDistrict" value="{jModel>/d/CustomerCity2}" enabled="false" valueHelpRequest="onDistrictHelp" valueHelpOnly="true" showValueHelp="true"/><Label text="Location" required="false"/><Input id="idLocation"  enabled="false" value="{jModel>/d/CustomerCity1}"/><Label text="Email Id"/><Input id="idEmail"  enabled="false" value="{jModel>/d/CustomerEmail}"/></f:content></f:SimpleForm></VBox><html:hr/><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar3" minWidth="1024"\r\n\t\t\t\t  maxContainerCols="5" editable="true" layout="ResponsiveGridLayout"\r\n\t\t\t\t  labelSpanL="4" labelSpanM="4" emptySpanL="1" emptySpanM="1" columnsL="2"\r\n\t\t\t\t  columnsM="1" class="editableForm"><f:content><core:Title text="Vehicle Details"/><Label text="Vehicle Type" required="false"/><Input id="idVehicle"  enabled="false" value="{jModel>/d/VehicleType}" valueHelpRequest="onVehicleType" valueHelpOnly="true" showValueHelp="true"/><Label text="Vehicle Make" id="lblVehicleMake"/><Input id="idVehicleMake" value="{jModel>/d/VehicleMake}" valueHelpRequest="onVehicleMake" enabled="false" valueHelpOnly="true" showValueHelp="true"/><Label text="Vehicle Reg No" id="idvehicleLabel"/><Input forceSelection="false"  enabled="false" value="{jModel>/d/RegNo}" liveChange="" maxLength="25" id="idregno"/><Label text="Chassis Number"  id="idchassisLabel"/><Input enabled="false" value="{jModel>/d/ChassisNo}" liveChange="" maxLength="25" id="idchassisInput"/><Label text="Others" class="sapUiLargeMarginEnd" id="idOthersLabel"/><TextArea value="Others" width="100%" enabled="false" visible="false" id="idOthersInput"/><core:Title text=""/><Label id="lblVehModel" text="Vehicle Model"/><Input id="idModel" value="{jModel>/d/VehicleModel}"  \r\n\t\t       valueHelpRequest="onVehicleModel" change="vehicleModelChange" \r\n\t\t       valueHelpOnly="false" enabled="false" showValueHelp="true"/><Label id="lblVehVariant" text="Vehicle Variant" required="false"/><Input id="idVariant" valueHelpRequest="onVehicleVariant" valueHelpOnly="false" \r\n\t\t       value="{jModel>/d/VehicleVariant}" enabled="false" showValueHelp="true"/><Label text="KMS done/Nos. of Hours" id="lblVehKmsDone"/><Input id="idHours" enabled="false" type="Number" liveChange="onKmsMaxlength" value="{jModel>/d/KmsDone}"/><Label text="Purchase Date Month/Year"  id="idpurchaseLabell"/><Select id="idMonth" change="onMonthChange" \r\n\t\t\t\t\t\t\t\t        selectedKey="{jModel>/d/VechPurcMonth}" enabled="false" ><items><core:Item text=""    key="00"/><core:Item text="JAN" key="01" /><core:Item text="FEB" key="02" /><core:Item text="MAR" key="03" /><core:Item text="APR" key="04" /><core:Item text="MAY" key="05" /><core:Item text="JUN" key="06" /><core:Item text="JUL" key="07" /><core:Item text="AUG" key="08" /><core:Item text="SEP" key="09" /><core:Item text="OCT" key="10" /><core:Item text="NOV" key="11" /><core:Item text="DEC" key="12" /></items><layoutData><l:GridData span="XL4 L2 M4 S4"/></layoutData></Select><Input id="idYear" minLength="4" maxLength="4" liveChange="YearValid" enabled="false"\r\n\t\t\t\t\t\t\t\t           value="{jModel>/d/VechPurcYear}" ><layoutData><l:GridData span="XL4 L2 M4 S4"/></layoutData></Input></f:content></f:SimpleForm></VBox><html:hr/><VBox id ="idVboxRep" class="sapUiSmallMargin" visible="false"><f:SimpleForm id="SimpleFormToolbar5" minWidth="1024"\r\n\t\t\t              maxContainerCols="5" editable="true"  layout="ResponsiveGridLayout"\r\n\t\t\t\t\t\t  labelSpanL="4" labelSpanM="4" emptySpanL="1" emptySpanM="1" columnsL="2"\r\n\t\t\t\t\t\t  columnsM="1" class="editableForm"><f:content><core:Title text="Replacement Details" class="jhClass" /><Label text="Dealer Code" visible="true" id="idDealCodeLabel"  /><Input enabled="false" visible="true" id="idDealCodeInput" value="{parts:[{path:\'jModel>/d/DealerName\'},\r\n\t\t\t\t\t\t{path:\'jModel>/d/DealerCode\'}], formatter:\'.formatter.Code\'}" valueHelpRequest="onDelarCodeType" \r\n\t\t\t\t\t\tvalueHelpOnly="true" showValueHelp="true"/><Label text="Date of Tyre Purchase" visible="true" id="idDTPLabel"/><DatePicker id="idDtTyreInput" enabled="false" placeholder="Ticket Date" \r\n\t\t\t\tvalue="{path:\'jModel>/d/TyrePurcDate\', formatter:\'com.acute.ticketReSn.util.Formatter.date1\'}"/><Label text="County"  visible="true" id="idDealDescLabel"/><Input enabled="false" visible="true" id="idDealDescInput" value="{jModel>/d/CountyDesc}" /><core:Title text=""/></f:content></f:SimpleForm></VBox><VBox id ="idVboxOem" visible="false" class="sapUiSmallMargin" ><f:SimpleForm id="SimpleFormToolbar6" minWidth="1024" maxContainerCols="6" editable="true" \r\n\t\t\t layout="ResponsiveGridLayout" labelSpanL="4" labelSpanM="4" emptySpanL="1" emptySpanM="1"\r\n\t\t\t columnsL="2" columnsM="1" class="editableForm"><f:content><core:Title text="OEM Details" class="jhClass" /><Label text="Name" tooltip="Franchise Name" visible="true" id="idFNameLabel" required="false"/><Input enabled="false" liveChange="validateChar" visible="true" id="idFNameInput" \r\n\t\t\t\t\t       value="{jModel>/d/FranhiseName}"/><Label text="Person Name" tooltip="Franchise Person Name" visible="true" id="idFPNameLabel"/><Input enabled="false" liveChange="validateChar" visible="true" id="idFPNameInput" \r\n\t\t\t\t\tvalue="{jModel>/d/FranhisePersonName}"/><Label text="Email" tooltip="Franchise Email" visible="true" id="idFEmailLabel"/><Input enabled="false" change="validateFranchiseEmail" type="email" visible="true" \r\n\t\t\t\t\t       value="{jModel>/d/FranhiseEmail}" id="idFEmailInput"/><core:Title text=""/><Label text="Phone Number" tooltip="Franchise Phone Number" visible="true" id="idFPNoLabel"/><Input enabled="false" liveChange="NumberValid" maxLength="10" visible="true" \r\n\t\t\t\t\t       value="{jModel>/d/FranhiseContact}" id="idFPNoInput"/><Label text="Location" tooltip="Franchise Location" visible="true" id="idFLocationLabel" required="false"/><Input enabled="false"  liveChange="validateChar" visible="true" \r\n\t\t\t\t\t       value="{jModel>/d/FranhiseLocation}" id="idFLocationInput"/></f:content></f:SimpleForm></VBox><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar4" minWidth="1024" maxContainerCols="5" editable="true" \r\n\t\t\t\t\t  layout="ResponsiveGridLayout" labelSpanL="4" labelSpanM="4" emptySpanL="1" emptySpanM="1"\r\n\t\t\t          columnsL="1" columnsM="1" class="editableForm"><f:content><Label text="Nos. of Tyres Purchased(Qty)"/><Input  id="idTyreInput" type="text" enabled="false" value="{jModel>/d/NoOfTyres}" liveChange="NumberValid"><layoutData><l:GridData span="XL2 L1 M2 S2"/></layoutData></Input><Label text="Nos. of Products involved under complaint(Qty)" required="false" liveChange="NumberValid"/><Input  id="idTyreInvolve" type="text" enabled="false" value="{jModel>/d/DefectiveTyres}"><layoutData><l:GridData span="XL2 L1 M2 S2"/></layoutData></Input><Label text="Probable Condition" /><Select selectedKey="{jModel>/d/TyreCond}" forceSelection="false" enabled="false" \r\n\t\t   \t\t   id="idCondition"><layoutData><l:GridData span="XL6 L4 M2 S2"/></layoutData></Select><Label text="Tyre Description/Application"/><TextArea id="idText" enabled="false" value="{jModel>/d/TyreDesrc}"/><Label text="Description of Complaint by Customer"/><TextArea id="idDescComp" enabled="false" value="{jModel>/d/ComplDescr}"/><Label text="Remarks"/><TextArea id="idRemarks" enabled="false" value="{jModel>/d/Remarks}"/></f:content></f:SimpleForm></VBox></Panel></content><footer><Bar><contentLeft></contentLeft><contentRight><Button text="Re-Assign Ticket" press="onTicketSingle" type="Accept" id="Id_bt1" visible="false" /><Button text="Assign Tickets" press="onTickets" type="Emphasized" id="Id_bt2" visible="false" /></contentRight></Bar></footer></Page></core:View>',"com/acute/ticketReSn/i18n/messageBundle_en_US.properties":"myAppTitle=Create Purchase Requisition  \r\nSS=Supplying Site \r\nPG=Purchasing Group\r\nRS=Receiving Site  \r\nDD=Delivery Date\r\nDOD=DOC Date \r\naddnewitem=Add New Item\r\nartdet=Article Details\r\nquant=Quantity\r\nuom=UoM\r\nsv=Save\r\nrst=Reset\r\ndownload=Download\r\nnotFoundTitle=Not Found\r\nnotFoundText=The requested resource was not found\r\nmasterListNoDataText=No entities\r\nmasterSearchPlaceholder=Search\r\nmasterSearchTooltip=Search for items in the list"}});