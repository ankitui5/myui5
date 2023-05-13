jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
var that;

sap.ui.controller("ztyreRmvlRep.view.S1", {

	onInit: function() {
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		
		jQuery.sap
		.includeStyleSheet(jQuery.sap
				.getModulePath(
						"ztyreRmvlRep.css.style",
						".css"));
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
		
		//var initialDateValue = firstDay + " - " + currentdate;
		//this.getView().byId("idDateRange").setValue(initialDateValue);
		
		this.getView().byId("fromDate").setValue(firstDay);
		this.getView().byId("toDate").setValue(currentdate);
		
		var that = this;
		this.model = this.getOwnerComponent().getModel();
		var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		
		oReadModel.setHeaders({
			"Content-Type" : "application/json"
		});
		var fncSuccess = function(oData, oResponse){
			debugger
			if(oData.results.length==0 ){
				sap.m.MessageBox.show("You are not registered to any Fleet", {
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
				}
			else{
				that.FleetData=oData;
				if (!that._FleetDialog) {
				that._FleetDialog = sap.ui.xmlfragment(
						"ztyreRmvlRep.view.Intial", that);
					that.getView().addDependent(that._FleetDialog);}
				that._FleetDialog.open();
						
			}
		}
			
		var fncError = function(oError) { // error callback function
			var parser = new DOMParser();
			var message = parser.parseFromString(
			oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML;
				sap.m.MessageBox.show(message, {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
			});
		}
		oReadModel.read("/User_Fleet_DetialsSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'", {
			success : fncSuccess,
			error : fncError
		});
		
		var from = this.getView().byId("fromDate");
		from.addDelegate({
			  onAfterRendering: function() {
			    from.$().find('INPUT').attr('disabled', true).css('color', '#555');
			  }
			}, from);
		
		var to = this.getView().byId("toDate");
		to.addDelegate({
			  onAfterRendering: function() {
			    to.$().find('INPUT').attr('disabled', true).css('color', '#555');
			  }
			}, to);
		
	},
	
//////////////////////////////////////////////////////////////////////////////////////////////////
	handledatefrom: function(oEvent){
	    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
	    var from = oEvent.getSource().getProperty("dateValue");
	 //   var to = oEvent.getSource().getProperty("secondDateValue");
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
	},
	
	handledateto: function(oEvent){
	    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
	    var from = oEvent.getSource().getProperty("dateValue");
	 //   var to = oEvent.getSource().getProperty("secondDateValue");
	    var dateVal = oEvent.getSource().getProperty("value");
	    if(from !== null){
	      this.toDate = dateFormat.format(from)+"T00:00:00";
	    }else{
	      if(dateVal !== ""){
	        var dateSplit = dateVal.split("-");
	        var fromDate = dateSplit[0].trim();
	        var fromSplit = fromDate.split(".");
	        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
	        this.toDate = fValue+"T00:00:00";
	      }else{
	        this.toDate = null;
	      }
	    }
	},	
//////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////
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
		}

	},
//////////////////////////////////////////////////////////////////////////////////////////////////
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
	onClear : function()
		{
			this.getView().byId("fromDate").setValue();
			this.getView().byId("toDate").setValue();
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onSearch : function()
	{	
		debugger
		this.getView().byId("fromDate").setValueState("None");
		//this.getView().byId("toDate").setValueState("None");
		
		var scroll = this.getView().byId("idScroll");
		var oFooter = this.getView().byId("idFooter");
		var footerHeight = window.innerHeight - oFooter.getDomRef().getBoundingClientRect().top;
		var height = window.innerHeight - footerHeight - scroll.getDomRef().getBoundingClientRect().top - 40;
		var scrollHeight = height + "px";
		scroll.setHeight(scrollHeight);	
		
		
		this.getView().byId("tableVehicle1").setVisible(true);
		this.getView().byId("tableVehicleF1").setVisible(true);
//		this.getView().byId("tableVehicle").setVisible(true);
		var kunnr = this.Customer;
		//var dateVal = this.getView().byId("idDateRange").getValue();
//		var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });   
//		var datefrm1 = this.getView().byId("idDateRange").getFrom();
//		var dateVal = dateFormat1.format(datefrm1)+"T00:00:00";
//		
//		var dateto2 = this.getView().byId("idDateRange").getTo();
//		var dateVal2 = dateFormat1.format(dateto2)+"T00:00:00";
		
		if(this.getView().byId("fromDate").getValue() == "" || this.getView().byId("fromDate").getValue() == null){
			this.getView().byId("fromDate").setValueState("Error");
			//this.getView().byId("toDate").setValueState("Error");
			sap.m.MessageToast.show("Please Input Date")	
			return;	
		}
		
		/*var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
            pattern : "dd-MM-yyyy"
		});*/
		
		if(this.fromDate !=null){
//			 var dateFrom = this.payLoadDate(dateVal);
		    }else{
		    	this.fromDate=null;
			}	
	    
		 if(this.toDate!=null){
//			 var dateTo = this.payLoadDate(dateVal2);
		    }else{
		    	this.toDate = null;
			}	
	    
		/*var dateSplit = dateVal.split("-");
		var fromDate = dateSplit[0].trim();
		var fromSplit = fromDate.split(".");
		var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		var dateFrom = fValue+"T00:00:00";
		
		var toDate = dateSplit[1].trim();
		var toSplit = toDate.split(".");
		var tValue = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
		var dateTo = tValue+"T00:00:00";*/
		
		
//		var tab = this.getView().byId("tableVehicle");
		var tab = this.getView().byId("tableVehicleF1");
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
			var length = oData.results.length;
			if(length == 0){
				sap.m.MessageToast.show("No Data Found for selected Date Range");
			}else{
			for(var i=0;i<length;i++)
				{
//				var InspDate = oData.results[i].InspDate.substr(0,10);
//				var lastInspDate = oData.results[i].LastInspDate.substr(0,10);
//				var sDate = new Date(InspDate);
//				InspDate =  oDateFormat.format(sDate);
//				var tDate = new Date(lastInspDate);
//				lastInspDate =  oDateFormat.format(sDate);
				var contractType = oData.results[i].ContractType;
				if(contractType == "CPKM"){
					var typeC ="sap-icon://inventory";
					var Color="#1C4C98";
				}else{
					if(contractType == "SC"){
						var typeC ="sap-icon://settings";
						var Color="#031E48";
					}else{
						var typeC ="";
					}
					
				}
				
				var isA = true;
				if(oData.results[i].RemoveOk === "A"){
					isA = false;
				}
				
				that.colListItem = new sap.m.ColumnListItem({
					cells:[
					       
					       new sap.m.Text({
								   text:  oData.results[i].RemovalDate,visible:isA
							}),
					       new sap.m.Text({
					    	   text:  oData.results[i].RegNo,visible:isA
					       }),
					       new sap.m.Text({
					    	   text:  oData.results[i].HubName,visible:isA
					       }),
					       new sap.m.Text({
					    	   text:  oData.results[i].Position,visible:isA
					       }),
					       new sap.m.Text({
					    	   text:oData.results[i].RemoveOk
					       }),

					       new sap.m.Text({
					    	   text:oData.results[i].StnclNumber
					       }),

					       new sap.m.Text({
					    	   text: oData.results[i].ItemDesc
					       }),
					       new sap.m.Text({
					    	   text: oData.results[i].TyreSize
					       }),

					       new sap.m.Text({
					    	   text: oData.results[i].TyreLocDesc
					       }),

					       new sap.m.Text({
					    	   text: oData.results[i].Nsd
					       }),

					       ]
				})
				tab.addItem(that.colListItem);
				}}
				
		}
		
		var fncError = function(oError) { // error callback
			// function
			var parser = new DOMParser();
			var message = parser.parseFromString(
			oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML
			sap.m.MessageBox.show(message, {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
			});
		}
		oReadModel.read("/ReportTyreRemovalSet?$filter=Kunnr eq '"+kunnr+"' and  DateFrom  eq datetime'"+this.fromDate+"' and DateTo eq datetime'"+this.toDate+"'", {
			success : fncSuccess,
			error : fncError
		});
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
// Download Excel Code Starts
	
	onDownload: function(oEvent) {
		var oTable = this.getView().byId("tableVehicle1");
		var columns = oTable.getColumns();
		var oTable1 = this.getView().byId("tableVehicleF1");
   		var items = oTable1.getItems();
   		var rows = [];
		var cols = [];
		var b = [];
		for(var i = 0 ; i < items.length;i++){
   			var row = {};
   			for(var j = 0 ; j < columns.length; j++){
   				var propname = columns[j].getHeader().getProperty("text");
   				row[propname+""] = items[i].getCells()[j].getProperty("text");
   			}
   			rows.push(row);
   		}
   		var data = {};
   		data.columns = cols;
   		data.rows = rows;
   		var oModel = new sap.ui.model.json.JSONModel(data);
   		
   		//Start of Set Current Date and Time
   		
   		var today = new Date();
   		var dd = today.getDate();
   		var mm = today.getMonth()+1; //January is 0!
   		var yyyy = today.getFullYear();

   		if(dd<10) {
   		    dd = '0'+dd
   		} 

   		if(mm<10) {
   		    mm = '0'+mm
   		}
   		
   		var h = today.getHours();
   		var m = today.getMinutes();
   		var s = today.getSeconds();
   		
   		m = this.checkTime(m);
   		s = this.checkTime(s);
   		
   		today = dd + "/" + mm + "/" + yyyy + "_" + h + ":" + m + ":" + s;
   		
   		var filename = "TyreRemovalReport_" + today;
   		
   		//End of Set Current Date and Time

   		this.JSONToCSVConvertor1(oModel, filename);
	},
	
	checkTime: function(i) {
		  if (i < 10) {
		    i = "0" + i;
		  }
		  return i;
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


});