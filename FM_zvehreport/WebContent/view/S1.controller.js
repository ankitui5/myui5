jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
var that;
sap.ui.controller("com.acute.vehicleReport.view.S1", {


  onInit: function() {
    if (!jQuery.support.touch) {
      this.getView().addStyleClass("sapUiSizeCompact");
    }
    jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("com.acute.vehicleReport.css.style",".css"));
    var that = this;
    this.model = this.getOwnerComponent().getModel();
    var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
    var oReadModel = new sap.ui.model.odata.ODataModel(
        sServiceUrl);
    oReadModel.setHeaders({
      "Content-Type" : "application/json"
    });
    var fncSuccess = function(oData, oResponse){
      debugger
      if(oData.results.length==0 ){
        sap.m.MessageBox.show("You are not Registered to any Fleet", {
          title : "Error",
          icon : sap.m.MessageBox.Icon.ERROR,
          onClose:function(){
            window.history.back();
          }
          });
      }else if(oData.results.length==1)
        {
        debugger;
        that.Customer = oData.results[0].Kunnr;
        that.getView().byId("lblFleet").setText(oData.results[0].FleetName);
        that.EnrolMode = oData.results[0].EnrolMode;
        if(that.EnrolMode == "F")
        {
          that.getView().byId("Panel2").setVisible(false);
          that.getView().byId("Panel1").setVisible(true);
          this.getView().byId("selectContractType").setVisible(false);
        }
        else
          {
          that.getView().byId("Panel2").setVisible(true);
          that.getView().byId("Panel1").setVisible(false);
          this.getView().byId("selectContractType").setVisible(true);
          }
        }
      else{
        that.FleetData=oData;
        if (!that._FleetDialog) {
        that._FleetDialog = sap.ui.xmlfragment(
            "com.acute.vehicleReport.view.Intial", that);
          that.getView().addDependent(that._FleetDialog);}
        that._FleetDialog.open();

      }
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
  },
  onFleetCloseButton:function(){
    var that = this;
    if(sap.ui.getCore().byId("idFleet").getValue()!=""){
      this.getView().byId("lblFleet").setText(sap.ui.getCore().byId("idFleet").getValue());
    that._FleetDialog.close();
    }else{
      sap.m.messageToast.show("Select Fleet")
    }

  },
  onFleetCloseCancle:function(){
    window.history.back();
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
  onFleetFragment: function(evt) {

    this.CustomerValue = evt.getSource();
    var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/User_Fleet_DetialsSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
    var jModel = new sap.ui.model.json.JSONModel();
    jModel.loadData(sPath, null, false, "GET", false, false, null);
    var _valueHelpDialog = new sap.m.SelectDialog({

      title: "Fleet",
      items: {
        path: "/d/results",
        template: new sap.m.StandardListItem({
          title: "{FleetName}",
          customData: [new sap.ui.core.CustomData({
            key: "{Kunnr}",
            value: "{FleetName}"
          })]

        })
      },
      liveChange: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("FleetName", sap.ui.model.FilterOperator.Contains, sValue);
        oEvent.getSource().getBinding("items").filter([oFilter]);
      },
      confirm: [this._handleCustomerClose, this],
      cancel: [this._handleCustomerClose, this]
    });
    _valueHelpDialog.setModel(jModel);
    _valueHelpDialog.open();
  },

  _handleCustomerClose: function(oEvent) {
    var oSelectedItem = oEvent.getParameter("selectedItem");
    if (oSelectedItem) {
      this.Customer = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
      debugger;
      this.CustomerValue.setValue(oSelectedItem.getTitle());
      this.EnrolMode = oEvent.getParameter("selectedItem").getBindingContext().getObject().EnrolMode;
      if(this.EnrolMode == "F")
      {
        this.getView().byId("Panel2").setVisible(false);
        this.getView().byId("Panel1").setVisible(true);
        this.getView().byId("selectContractType").setVisible(false);
      }
      else
        {
        this.getView().byId("Panel2").setVisible(true);
        this.getView().byId("Panel1").setVisible(false);
        this.getView().byId("selectContractType").setVisible(true);
        }
    }

  },


// Download Excel Code Starts

  onDownload: function(oEvent) {

    var oTable, columns, oTable1, items;

    if(this.EnrolMode === "F"){
      oTable = this.getView().byId("tableVehicleF");
      columns = oTable.getColumns();
      oTable1 = this.getView().byId("tableVehicleF1");
        items = oTable1.getItems();
    }else{
      oTable = this.getView().byId("tableVehicle");
      columns = oTable.getColumns();
      oTable1 = this.getView().byId("tableVehicle1");
        items = oTable1.getItems();
    }

      var rows = [];
    var cols = [];
    var b = [];
    for(var i = 0 ; i < items.length;i++){
        var row = {};
        for(var j = 0 ; j < columns.length; j++){
          var elmnt = "text";
          var propname = columns[j].getHeader().getProperty("text");
          if(items[i].getCells()[j].mProperties.text === undefined)
          elmnt = "alt";
          row[propname+""] = items[i].getCells()[j].getProperty(elmnt);

        }
        rows.push(row);
      }
      var data = {};
      data.columns = cols;
      data.rows = rows;
      var oModel = new sap.ui.model.json.JSONModel(data);

      this.JSONToCSVConvertor1(oModel, "ExcelData");
  },

    JSONToCSVConvertor1: function(arrayData, FileName) {
    var columns = arrayData.getData().columns,rows = arrayData.getData().rows,csvRows = "";
    if (rows.length === undefined) {
      return true;
    }
    var CSV = "\r\n";

    for (var rowindex in rows) {
      var row = rows[rowindex];
      var rowkeys = Object.keys(row);
      var csvRow = "";
      for(var i = 0 ; i < rowkeys.length ; i++){
        csvRow += row[rowkeys[i]];
        if(i+1 !== rowkeys.length){
          csvRow += ","; 
        }
      }

      CSV += csvRow + "\r\n";
      console.log(csvRow);
    }

    if (CSV == "") {
      sap.m.MessageToast.show("Invalid data");
      return;
    }
    // Start code for column header
    for(var i = rowkeys.length - 1; i >=0 ; i--){
      var e = rowkeys[i];
      CSV = e +"," +CSV;
    }

    // End code for column header
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = FileName + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  //Download Excel Code Ends

  onVehicleRegNoHelp: function(evt) {
    this.VehRegNoValue = evt.getSource();
    var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4FleetVehicleDataSet?$filter=Kunnr eq '"+this.Customer+"'";
    var jModel = new sap.ui.model.json.JSONModel();
    jModel.loadData(sPath, null, false, "GET", false, false, null);
    var _valueHelpDialog = new sap.m.SelectDialog({

      title: "Vehicle Registration Number",
      items: {
        path: "/d/results",
        template: new sap.m.StandardListItem({
          title: "{RegNo}",
          customData: [new sap.ui.core.CustomData({
            key: "{RegNo}",
            value: "{RegNo}"
          })]

        })
      },
      liveChange: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("RegNo", sap.ui.model.FilterOperator.Contains, sValue);
        oEvent.getSource().getBinding("items").filter([oFilter]);
      },
      confirm: [this._handleVehRegNoClose, this],
      cancel: [this._handleVehRegNoClose, this]
    });
    _valueHelpDialog.setModel(jModel);
    _valueHelpDialog.open();
  },

  _handleVehRegNoClose: function(oEvent) {
    var oSelectedItem = oEvent.getParameter("selectedItem");
    if (oSelectedItem) {
      this.RegNo = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
      this.VehRegNoValue.setValue(oSelectedItem.getTitle());
    }

  },
  onVehicleMakeHelp: function(evt) {
    this.VehMakeValue = evt.getSource();
    var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4VehicleMakeSet";
    var jModel = new sap.ui.model.json.JSONModel();
    jModel.loadData(sPath, null, false, "GET", false, false, null);
    var _valueHelpDialog = new sap.m.SelectDialog({

      title: "Vehicle Make",
      items: {
        path: "/d/results",
        template: new sap.m.StandardListItem({
          title: "{MakeShortName}",
          info :"{MakeName}",
          customData: [new sap.ui.core.CustomData({
            key: "{MakeCode}",
            value: "{MakeName}"
          })]

        })
      },
      liveChange: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("MakeName", sap.ui.model.FilterOperator.Contains, sValue);
        oEvent.getSource().getBinding("items").filter([oFilter]);
      },
      confirm: [this._handleVehicleMakeClose, this],
      cancel: [this._handleVehicleMakeClose, this]
    });
    _valueHelpDialog.setModel(jModel);
    _valueHelpDialog.open();
  },

  _handleVehicleMakeClose: function(oEvent) {
    var oSelectedItem = oEvent.getParameter("selectedItem");
    if (oSelectedItem) {
      this.VehicleMake = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
      this.VehMakeValue.setValue(oSelectedItem.getTitle());
    }

  },
  onVehicleModelHelp: function(evt) {
    this.VehModelValue = evt.getSource();
    var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4VehicleModelSet";
    var jModel = new sap.ui.model.json.JSONModel();
    jModel.loadData(sPath, null, false, "GET", false, false, null);
    var _valueHelpDialog = new sap.m.SelectDialog({

      title: "Vehicle Model",
      items: {
        path: "/d/results",
        template: new sap.m.StandardListItem({
          title: "{Model}",
          customData: [new sap.ui.core.CustomData({
            key: "{Model}",
            value: "{Model}"
          })]

        })
      },
      liveChange: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.Contains, sValue);
        oEvent.getSource().getBinding("items").filter([oFilter]);
      },
      confirm: [this._handleVehicleModelClose, this],
      cancel: [this._handleVehicleModelClose, this]
    });
    _valueHelpDialog.setModel(jModel);
    _valueHelpDialog.open();
  },

  _handleVehicleModelClose: function(oEvent) {
    var oSelectedItem = oEvent.getParameter("selectedItem");
    if (oSelectedItem) {
      this.VehicleModel = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
      this.VehModelValue.setValue(oSelectedItem.getTitle());
    }

  },
onConfigCodeHelp: function(evt) {
    this.ConfigCodeValue = evt.getSource();
    var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4ConfigurationCodeSet";
    var jModel = new sap.ui.model.json.JSONModel();
    jModel.loadData(sPath, null, false, "GET", false, false, null);
    var _valueHelpDialog = new sap.m.SelectDialog({

      title: "Config Code",
      items: {
        path: "/d/results",
        template: new sap.m.StandardListItem({
          title: "{ConfigCodeDesc}",
          customData: [new sap.ui.core.CustomData({
            key: "{ConfigCode}",
            value: "{ConfigCode}"
          })]

        })
      },
      liveChange: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("ConfigCode", sap.ui.model.FilterOperator.Contains, sValue);
        oEvent.getSource().getBinding("items").filter([oFilter]);
      },
      confirm: [this._handleConfigCodeClose, this],
      cancel: [this._handleConfigCodeClose, this]
    });
    _valueHelpDialog.setModel(jModel);
    _valueHelpDialog.open();
  },

  _handleConfigCodeClose: function(oEvent) {
    var oSelectedItem = oEvent.getParameter("selectedItem");
    if (oSelectedItem) {
      this.ConfigCode = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
      this.ConfigCodeValue.setValue(oSelectedItem.getTitle());
    }

  },
  onClear : function()
  {
    this.getView().byId("inpRegNo").setValue("");
    this.getView().byId("inpVehMake").setValue("");
    this.getView().byId("inpVehModel").setValue("");
    this.getView().byId("inpConfigCode").setValue("");
    this.getView().byId("selectContractType").setSelectedKey();
    this.RegNo = "";
    this.VehicleModel = "";
    this.VehicleMake = "";
    this.ConfigCode = "";

  },
  onSearch : function()
  {

    if(this.EnrolMode == "F"){
      var scroll = this.getView().byId("idScroll");
      var oFooter = this.getView().byId("idFooter");
      var footerHeight = window.innerHeight - oFooter.getDomRef().getBoundingClientRect().top;
      var height = window.innerHeight - footerHeight - scroll.getDomRef().getBoundingClientRect().top - 8;
      var scrollHeight = height + "px";
      scroll.setHeight(scrollHeight);
    }else{
      var scroll1 = this.getView().byId("idScroll1");
      var oFooter1 = this.getView().byId("idFooter");
      var footerHeight1 = window.innerHeight - oFooter1.getDomRef().getBoundingClientRect().top;
      var height1 = window.innerHeight - footerHeight1 - scroll1.getDomRef().getBoundingClientRect().top - 8;
      var scrollHeight1 = height1 + "px";
      scroll1.setHeight(scrollHeight1);
    }

    var kunnr = this.Customer;

    var regNo = this.RegNo;
    if(regNo ==undefined)
      regNo="";
    var model = this.VehicleModel;
    if(model ==undefined)
      model="";
    var make = this.VehicleMake;
    if(make ==undefined)
      make="";
    var config = this.ConfigCode;
    if(config ==undefined)
      config="";
    var contract = this.getView().byId("selectContractType").getSelectedKey();
    if(contract ==undefined)
      contract="";
    var tab = this.getView().byId("tableVehicle1");
    var tabF = this.getView().byId("tableVehicleF1");
    var that = this;
    var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
    var oReadModel = new sap.ui.model.odata.ODataModel(
        sServiceUrl);
    oReadModel.setHeaders({
      "Content-Type" : "application/json"
    });

    var fncSuccess = function(oData, oResponse){
      debugger;
      tab.removeAllItems();
      tabF.removeAllItems();
      var length = oData.results.length;
      for(var i=0;i<length;i++)
        {
//        var FitmentDate, LastInspDate;
//        if(oData.results[i].FitmentDate !=""&&oData.results[i].FitmentDate !=undefined)
//          FitmentDate = oData.results[i].FitmentDate.substr(0,10);
//        else
//          FitmentDate = "";
//        if(oData.results[i].LastInspDate !="" && oData.results[i].LastInspDate !=undefined)
//         LastInspDate = oData.results[i].LastInspDate.substr(0,10);
//        else
//          LastInspDate = "";
        var contractType = oData.results[i].ContractType;
        if(contractType == "CPKM"){
          var typeC ="sap-icon://inventory";
          var Color="#1C4C98";
          var text="Charge Per KM";
        }else{
          if(contractType == "SC"){
            var typeC ="sap-icon://settings";
            var Color="#031E48";
            var text="Service Contract"
          }else{
            var typeC ="";
          }

        }
        if(that.EnrolMode == "F")
          {
          that.colListItem = new sap.m.ColumnListItem({
            cells:[
            	 new sap.m.Text({
                     text:oData.results[i].RegNo
                   }),
                   
                   new sap.m.Text({
                     text: oData.results[i].MakeName
                   }),
                   new sap.m.Text({
                     text:oData.results[i].Model
                   }),
                   new sap.m.Text({
                     text: oData.results[i].ConfigCodeDesc
                   }),
                  
                   new sap.m.Text({
                     text:oData.results[i].LastInspDate
                   }),
                   new sap.m.Text({
                     text: oData.results[i].LastInspHub
                   }),
                   new sap.ui.core.Icon({
                     src: typeC,
                     color: Color,
                     alt: text
                   }),
                   ]
          })

          tabF.addItem(that.colListItem);
          }
        else
          {
          that.colListItem = new sap.m.ColumnListItem({
            cells:[
            	
            	new sap.m.Text({
                    text:oData.results[i].RegNo
                  }),
                  
                   new sap.m.Text({
                     text: oData.results[i].MakeName
                   }),
                   new sap.m.Text({
                     text:oData.results[i].Model
                   }),
                   new sap.m.Text({
                     text: oData.results[i].ConfigCodeDesc
                   }),
                   
  /*                 new sap.m.Text({
                     text:oData.results[i].CTypeName
                   }),*/
                  
                   new sap.m.Text({
                     text: oData.results[i].FitmentDate
                   }),
                   new sap.m.Text({
                     text: oData.results[i].FitHubName
                   }),
                   new sap.m.Text({
                     text:oData.results[i].LastInspDate
                   }),
                   new sap.m.Text({
                     text: oData.results[i].LastInspHub
                   }),
                   new sap.ui.core.Icon({
                     src: typeC,
                     color: Color,
                     alt:text
                   }),
                   ]
          })
          tab.addItem(that.colListItem);
          }


        }

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
    oReadModel.read("/ReportVehicleDetailSet?$filter=Kunnr eq '"+kunnr+"' and RegNo eq '"+regNo+"' and MakeCode eq '"+make+"' and Model eq '"+model+"' and ConfigCode eq '"+config+"' and ContractType eq '"+contract+"'", {
      success : fncSuccess,
      error : fncError
    });
  },


});