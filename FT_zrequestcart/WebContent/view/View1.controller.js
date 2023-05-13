jQuery.sap.require("zRequestCart.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
var that;
sap.ui.controller("zRequestCart.view.View1", {
	F4LocationSet : "",
	locationKey : "",

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.View1
*/
	onInit: function() {
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {

		}
		jQuery.sap
		.includeStyleSheet(jQuery.sap
				.getModulePath(
						"zRequestCart.css.style",
						".css"));
		sap.ui.core.UIComponent.getRouterFor(this).getRoute(
		"page1").attachMatched(this._onRoute, this);
	},
	
	_onRoute : function(e){
		var that = this;
//		var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4LocationSet";
//		var ModelF4LocationSet = new sap.ui.model.json.JSONModel(); 
//		ModelF4LocationSet.loadData(sPath, null, false, "GET", false,
//				false, null);
//		var oItemSelectTemplate = new sap.ui.core.Item({
//            key : "{Location}",
//            text : "{Location}"
//        });
//		
//		this.F4LocationSet = new sap.m.Select({ width:"100%", items:"",
//		change:[that.setLocation,that],forceSelection:false ,items:[]}).bindAggregation("items","/d/results",oItemSelectTemplate); //bind aggregation, item to Select element with the template selected above
//
//		this.F4LocationSet.setModel(ModelF4LocationSet)
		
	},
	
	onChangeMarket : function(e){
		var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4ProductCatSet?$filter=Market eq '01'";
		var jModel = new sap.ui.model.json.JSONModel(); 
		jModel.loadData(sPath, null, false, "GET", false,
				false, null);
		//initialise your model from a JSON file
//		  sap.ui.getCore().setModel(mModel, "your_data_model"); //set model with a name to use later
		  var oItemSelectTemplate = new sap.ui.core.Item({
		            key : "{ProdCat}",
		            text : "{ProdDesc}"
		        }); //Define the template for items, which will be inserted inside a select element
		 var mySelectMenu = this.getView().byId("selectProductCat"); //Get a reference to the UI element, Select to bind data
		 mySelectMenu.setEnabled(true);
		 mySelectMenu.setModel(jModel);// set model your_data_model to Select element
		mySelectMenu.bindAggregation("items","/d/results",oItemSelectTemplate); //bind aggregation, item to Select element with the template selected above

	},
	
	onChangeProdCate : function(e){
		var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4WidthSizeSet?$filter=ProdCat eq '12'";
		var jModel = new sap.ui.model.json.JSONModel(); 
		jModel.loadData(sPath, null, false, "GET", false,
				false, null);
		//initialise your model from a JSON file
//		  sap.ui.getCore().setModel(mModel, "your_data_model"); //set model with a name to use later
		  var oItemSelectTemplate = new sap.ui.core.Item({
		            key : "{ProdSize}",
		            text : "{ProdSize}"
		        }); //Define the template for items, which will be inserted inside a select element
		 var mySelectMenu = this.getView().byId("selectNominal"); //Get a reference to the UI element, Select to bind data
		 mySelectMenu.setEnabled(true);
		 mySelectMenu.setModel(jModel);// set model your_data_model to Select element
		mySelectMenu.bindAggregation("items","/d/results",oItemSelectTemplate); //bind aggregation, item to Select element with the template selected above

	},
	
	addNewItem : function()
	{
		var self = this;
		var l = this.getView().byId("tableVehicle").getItems().length;
		var size = this.getView().byId("selectNominal").getSelectedKey();
		var testcat = this.getView().byId("selectTestcat").getSelectedKey();
		
		this._EntriesHelpDialog = sap.ui.xmlfragment(
				"zRequestCart.view.tyredetail", this);
			this.getView().addDependent(this._EntriesHelpDialog);
			this._EntriesHelpDialog.getContent()[0]._aElements[3].setValue(size);
			if(testcat == "05"){
				this._EntriesHelpDialog.getContent()[0]._aElements[53].setVisible(true);
				this._EntriesHelpDialog.getContent()[0]._aElements[54].setVisible(true);
				this._EntriesHelpDialog.getContent()[0]._aElements[55].setVisible(true);
				this._EntriesHelpDialog.getContent()[0]._aElements[56].setVisible(true);
			}else{
				this._EntriesHelpDialog.getContent()[0]._aElements[53].setVisible(false);
				this._EntriesHelpDialog.getContent()[0]._aElements[54].setVisible(false);
				this._EntriesHelpDialog.getContent()[0]._aElements[55].setVisible(false);
				this._EntriesHelpDialog.getContent()[0]._aElements[56].setVisible(false);
			}
			if(l === 0){
				this._EntriesHelpDialog.getContent()[0]._aElements[1].setSelectedKey("01");
				this._EntriesHelpDialog.getContent()[0]._aElements[7].setShowValueHelp(true);
				this._EntriesHelpDialog.getContent()[0]._aElements[1].setEnabled(false);
			}else{
				var data = this._EntriesHelpDialog.getContent()[0]._aElements;
				this._EntriesHelpDialog.getContent()[0]._aElements[1].setEnabled(true);
				this._EntriesHelpDialog.getContent()[0]._aElements[7].setShowValueHelp(false);
//				 data[1].setSelectedItem().setText(this.tstType);
				 data[1].setSelectedKey(this.tstTypeKey);
				 data[3].setValue(this.tyresize);
				 data[5].setValue(this.groupDesc);
				 data[7].setValue(this.mat);
//				 data[9].setSelectedItem().setText(this.ply);
				 data[9].setSelectedKey(this.plyKey);
//				 data[11].setSelectedItem().setText(this.load);
				 data[11].setSelectedKey(this.loadKey);
//				 data[13].setSelectedItem().setText(this.speed);
				 data[13].setSelectedKey(this.speedKey);
				 data[15].setValue(this.noOfTyre);
				 data[17].setValue(this.Dis);
//				 data[19].setSelectedItem().setText(this.plant);
				 data[19].setSelectedKey(this.plantKey);
				 data[20].setSelected(this.inflatedNsd);
				
				 data[22].setValue(this.nsd);
				 data[24].setSelectedKey(this.groove);
				 data[26].setValue(this.g1);
				 data[28].setValue(this.g2);
				 data[30].setValue(this.g3);
				 data[32].setValue(this.g4);
				 data[34].setValue(this.g5);
				 data[36].setValue(this.g6);
				 data[38].setValue(this.diameter);
				 data[40].setValue(this.section);
				 data[42].setValue(this.tread);
				 data[44].setValue(this.weight);
				 data[46].setValue(this.treadWidth);
				 data[48].setValue(this.Additionalcomments);
				
				 data[50].setValue(this.setencilFrom);
				 data[52].setValue(this.stencilTo);
				 data[54].setValue(this.PtQty);
				 data[54].setValue(this.FtQty);
				
			}
			this._EntriesHelpDialog.open();
	},
	
	grooveChange: function(e){
		var data = this._EntriesHelpDialog.getContent()[0]._aElements;
		var v = e.getSource().getSelectedKey();
		v = parseInt(v);
		switch(v) {
		
	    
	    case 1:
	        break;
	    case 2:
	    	data[28].setEnabled(true);
	        break;
	    case 3:
	    	data[28].setEnabled(true);
	    	data[30].setEnabled(true);
	        break;
	    case 4:
	    	data[28].setEnabled(true);
	    	data[30].setEnabled(true);
	    	data[32].setEnabled(true);
	        break;
	    case 5:
	    	data[28].setEnabled(true);
	    	data[30].setEnabled(true);
	    	data[32].setEnabled(true);
	    	data[34].setEnabled(true);
	        break;
	    case 6:
	    	data[28].setEnabled(true);
	    	data[30].setEnabled(true);
	    	data[32].setEnabled(true);
	    	data[34].setEnabled(true);
	    	data[36].setEnabled(true);
	        break;
	   
	}
	},
	
	onTabelEntrieOk : function(evt)
	{
		var that = this;
		var l = this.getView().byId("tableVehicle").getItems().length
		if(l == 0){
			var deleteItem = false;
		}else{
			var deleteItem = true;
			}
		switch(l) {
				
			    case 0:
			        l = "A";
			        break;
			    case 1:
			        l = "B";
			        break;
			    case 2:
			        l = "C";
			        break;
			    case 3:
			        l = "D";
			        break;
			    case 4:
			        l = "E";
			        break;
			    case 5:
			        l = "F";
			        break;
			    case 6:
			        l = "G";
			        break;
			    case 7:
			        l = "H";
			        break;
			    case 8:
			        l = "I";
			        break;
			    case 9:
			        l = "J";
			        break;
			   
			}
		
		debugger;

		var data = evt.getSource().getParent().getContent()[0]._aElements;
		if(data[1].getSelectedItem() == null){
			sap.m.MessageBox.show("Please select Test Type", {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
			});
			return;
				}
		if(data[9].getSelectedItem() == null){
			sap.m.MessageBox.show("Please select Ply Rating", {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
			});
			return;
				}
		if(data[11].getSelectedItem() == null){
			sap.m.MessageBox.show("Please select Load Index", {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
			});
			return;
				}
		if(data[13].getSelectedItem() == null){
			sap.m.MessageBox.show("Please select Speed Rating", {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
			});
		}
		this.tstType = data[1].getSelectedItem().getText();
		this.tstTypeKey = data[1].getSelectedItem().getKey();
		this.tyresize = data[3].getValue();
		this.groupDesc = data[5].getValue();
		this.mat = data[7].getValue();
		this.ply = data[9].getSelectedItem().getText();
		this.plyKey = data[9].getSelectedItem().getKey();
		this.load = data[11].getSelectedItem().getText();
		this.loadKey = data[11].getSelectedItem().getKey();
		this.speed = data[13].getSelectedItem().getText();
		this.speedKey = data[13].getSelectedItem().getKey();
		this.noOfTyre = data[15].getValue();
		this.Dis = data[17].getValue();
		this.plant = data[19].getSelectedItem().getText();
		this.plantKey = data[19].getSelectedItem().getKey();
		this.inflatedNsd = data[20].getSelected();
		
		this.nsd = data[22].getValue();
		this.groove = data[24].getSelectedKey();
		this.g1 = data[26].getValue();
		this.g2 = data[28].getValue();
		this.g3 = data[30].getValue();
		this.g4 = data[32].getValue();
		this.g5 = data[34].getValue();
		this.g6 = data[36].getValue();
		this.diameter = data[38].getValue();
		this.section = data[40].getValue();
		this.tread = data[42].getValue();
		this.weight = data[44].getValue();
		this.treadWidth = data[46].getValue();
		this.Additionalcomments = data[48].getValue();
		
		this.setencilFrom = data[50].getValue();
		this.stencilTo = data[52].getValue();
		this.PtQty = data[54].getValue();
		this.FtQty = data[54].getValue();
		var tab = this.getView().byId("tableVehicle");
		

		
		that.colListItem = new sap.m.ColumnListItem({
			cells:[

			       new sap.m.Text({
			    	   text:that.tstType
			       }),
			       new sap.m.Text({
			    	   text:that.tyresize
			       }),
			       new sap.m.Text({
			    	   text: l
			       }),
			       new sap.m.Text({
			    	   text: that.groupDesc
			       }),
			       new sap.m.Text({
			    	   text: that.mat
			       }),
			       new sap.m.Button({press:[that.onDelete,that],enabled:deleteItem ,visible:true,type:"Reject",icon:"sap-icon://delete"}),
			       new sap.m.Text({
			    	   text:that.ply,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.load ,
			    	   visible:false
			       }),
			      
			       new sap.m.Text({
			    	   text:that.speed ,
			    	   visible:false
			       }),
			       
			       new sap.m.Text({
			    	   text:that.noOfTyre ,
			    	   visible:false
			       }),
			      
			       new sap.m.Text({
			    	   text:that.Dis  ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.nsd ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.groove ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.g1 ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.g2 ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.g3 ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.g4 ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.g5 ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.g6 ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.diameter ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.section  ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.tread  ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.weight  ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.treadWidth  ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.Additionalcomments  ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.tstTypeKey   ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text: that.plyKey,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.loadKey   ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.speedKey   ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.plant   ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.plantKey   ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.inflatedNsd   ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.setencilFrom   ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.stencilTo   ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.PtQty   ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:that.FtQty   ,
			    	   visible:false
			       }),
			       ]
		})
		tab.addItem(that.colListItem);
		that._EntriesHelpDialog.close();
	
		
	},
	
	onTabelEntriesClose: function(evt)
	{
		this._EntriesHelpDialog.close();
	},
	
	addCallBack : function(){

		var self = this;
		var tableVehicle = this.getView().byId("tableVehicle");
		var length = this.getView().byId("tableVehicle").getItems().length;
		var Materialmodel = new sap.ui.model.json.JSONModel();
		var MatF4=[];
		for(var i=0; i<length; i++){
			var Group = this.getView().byId("tableVehicle").getItems()[i].getCells()[2].getText();
			var GroupDesc = this.getView().byId("tableVehicle").getItems()[i].getCells()[3].getText();
			var Material = this.getView().byId("tableVehicle").getItems()[i].getCells()[4].getText();
			
			MatF4.push({
				Group:Group,
				GroupDesc:GroupDesc,
				Material:Material
			})
		}
		Materialmodel.setData(MatF4);
		
		  var oItemSelectTemplate = new sap.ui.core.ListItem({
	            key : "{Group}",
	            text : "{Material} - {GroupDesc} - {Group}"
	        }); //Define the template for items, which will be inserted inside a select element
		  
		  // bind Staging
		  var testReq = new sap.ui.model.json.JSONModel();
			var testReqF4=[];	
			var v = this.getView().byId("selectTestreq").getSelectedKey();
			v = parseInt(v);
			switch(v) {
			
		    
		    case 01:
		    	var TestReq = "01"
				var TestReqDesc = "ITM";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
		        break;
		    case 02:
		    	var TestReq = "01"
				var TestReqDesc = "ITM";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
				var TestReq = "01"
				var TestReqDesc = "Initial life with retread status";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
		        break;
		    case 03:
		    	var TestReq = "01"
				var TestReqDesc = "ITM";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
				var TestReq = "02"
				var TestReqDesc = "Initial life with retread status";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
				var TestReq = "03"
				var TestReqDesc = "End of 1st RT";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
		        break;
		    case 04:
		    	var TestReq = "01"
					var TestReqDesc = "ITM";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
				var TestReq = "02"
				var TestReqDesc = "Initial life with retread status";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
				var TestReq = "03"
				var TestReqDesc = "End of 1st RT";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
				var TestReq = "04"
				var TestReqDesc = "End of 2nd RT";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
				break;
		    case 05:
		    	var TestReq = "01"
				var TestReqDesc = "ITM";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
				var TestReq = "02"
				var TestReqDesc = "Initial life with retread status";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
				var TestReq = "03"
				var TestReqDesc = "End of 1st RT";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
				var TestReq = "04"
				var TestReqDesc = "End of 2nd RT";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
				var TestReq = "05"
				var TestReqDesc = "End till casing is scrapped";
		    	testReqF4.push({
					TestReq:TestReq,
					TestReqDesc:TestReqDesc
				})
		        break;
		   
		}
			
			
			testReq.setData(testReqF4);
			
			  var ostageTemplate = new sap.ui.core.ListItem({
		            key : "{TestReq}",
		            text : "{TestReqDesc}"
		        }); //Define the template for items, which will be inserted inside a select element
		
	
		this._callBackHelpDialog = sap.ui.xmlfragment(
				"zRequestCart.view.CallBack", this);
			this.getView().addDependent(this._callBackHelpDialog);
			
			 var mySelectMat = this._callBackHelpDialog.getContent()[0]._aElements[3] //Get a reference to the UI element, Select to bind data
			 var mySelectStage = this._callBackHelpDialog.getContent()[0]._aElements[11] //Get a reference to the UI element, Select to bind data
			 
			 mySelectStage.setModel(testReq);// set model your_data_model to Select element
			 mySelectStage.bindAggregation("items","/",ostageTemplate); //bind aggregation, item to Select element with the template selected above

			 mySelectMat.setModel(Materialmodel);// set model your_data_model to Select element
			 mySelectMat.bindAggregation("items","/",oItemSelectTemplate); //bind aggregation, item to Select element with the template selected above


			this._callBackHelpDialog.open();
	
	},
	
	onCallTabelEntriesClose: function(evt)
	{
		this._callBackHelpDialog.close();
	},
	
	addNewItemVehicle : function(evt) {
		var that = this;
		
		
		
		
		debugger;

		var data = evt.getSource().getParent().getContent()[0]._aElements;
		var loaction = data[1].getSelectedItem().getText();
		var loactionKey = data[1].getSelectedItem().getKey();
		var mat = data[3].getSelectedItem().getText();
		var matKey = data[3].getSelectedItem().getKey();
		var type = data[5].getValue();
		var wear = data[7].getValue();
		var analysis = data[9].getSelectedItem().getText();
		var analysisKey = data[9].getSelectedItem().getKey();
		var stage = data[11].getSelectedItem().getText();
		var stageKey = data[11].getSelectedItem().getKey();
		var reason = data[13].getValue();
	
		var tab = this.getView().byId("CALLBACKDetail");

		
		that.colListItem = new sap.m.ColumnListItem({
			cells:[

			       new sap.m.Text({
			    	   text:loaction
			       }),
			       new sap.m.Text({
			    	   text:mat
			       }),
			       new sap.m.Text({
			    	   text: type
			       }),
			       new sap.m.Text({
			    	   text: wear
			       }),
			       new sap.m.Text({
			    	   text: analysis
			       }),
			       new sap.m.Text({
			    	   text: stage
			       }),
			       new sap.m.Text({
			    	   text: reason
			       }),
			       new sap.m.Button({press:[that.onDelete,that],visible:true,type:"Reject",icon:"sap-icon://delete"}),
			       new sap.m.Text({
			    	   text:loactionKey,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text: matKey,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:analysisKey ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text: stageKey ,
			    	   visible:false
			       }),
			      
			       ]
		})
		tab.addItem(that.colListItem);
		that._callBackHelpDialog.close();
	
		
	},
	
	setLocation : function(e){

   	 if(e.getParameters().selectedItem == null){
   		e.getSource().setSelectedKey(this.locationKey);
   	 }else{
   		this.locationKey = e.getParameters().selectedItem.getKey()
   		 e.getSource().setSelectedKey(this.locationKey);
   	 }
   	
    
	},
	
	onDelete : function(evt) {
		evt.getSource().getParent().getParent().removeItem(
				evt.getSource().getParent());
	},
	
	addNewVehicleDetail: function(evt){
		
		var self = this;
		
		
		this._usagekHelpDialog = sap.ui.xmlfragment(
				"zRequestCart.view.usage", this);
			this.getView().addDependent(this._usagekHelpDialog);

			this._usagekHelpDialog.open();
	},
	
	onVehicleDetailClose: function(evt){
		
		this._usagekHelpDialog.close();
	},
	
	addVehicleDetail: function(evt){
		var that = this;
		debugger;

		var data = evt.getSource().getParent().getContent()[0]._aElements;
		var VMake = data[1].getSelectedItem().getText();
		var VMakeKey = data[1].getSelectedItem().getKey();
		var VModel = data[3].getValue();
		var ConfigKey = data[5].getSelectedItem().getKey();
		var Config = data[5].getSelectedItem().getText();
		var TestingAxleKey = data[7].getSelectedItem().getKey();
		var TestingAxle = data[7].getSelectedItem().getText();
		var ApplicationKey = data[9].getSelectedItem().getKey();
		var Application = data[9].getSelectedItem().getText();
		var FitmentKey = data[11].getSelectedItem().getKey();
		var Fitment = data[11].getSelectedItem().getText();
		var DualSpacing = data[13].getValue();
		var AdditionalComments = data[15].getValue();
	
		var tab = this.getView().byId("vehiclDetail");

		
		that.colListItem = new sap.m.ColumnListItem({
			cells:[

			       new sap.m.Text({
			    	   text:VMake
			       }),
			       new sap.m.Text({
			    	   text:VModel
			       }),
			       new sap.m.Text({
			    	   text: Config
			       }),
			       new sap.m.Text({
			    	   text: TestingAxle
			       }),
			       new sap.m.Text({
			    	   text: Application
			       }),
			       new sap.m.Text({
			    	   text: Fitment
			       }),
			       new sap.m.Text({
			    	   text: DualSpacing
			       }),
			       new sap.m.Button({press:[that.onDelete,that],visible:true,type:"Reject",icon:"sap-icon://delete"}),
			       
			       new sap.m.Text({
			    	   text: AdditionalComments ,
			    	   visible:false
			       }),
			       
			       new sap.m.Text({
			    	   text:VMakeKey,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text: ConfigKey,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text:TestingAxleKey ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text: ApplicationKey ,
			    	   visible:false
			       }),
			       new sap.m.Text({
			    	   text: FitmentKey ,
			    	   visible:false
			       }),
			      
			       ]
		})
		tab.addItem(that.colListItem);
		that._usagekHelpDialog.close();
	
		
	
	},
	
	onCreate: function(e){
		var _self = this;
		var svMode=e.getSource().mProperties.text;
		if(svMode == "Create Order"){
			svMode = "S"
		}else{
			svMode = "E"
		}
		
		// header details
		var Market = this.getView().byId("selectMarket").getSelectedKey();
		var MarketText = this.getView().byId("selectMarket")._getSelectedItemText();
		var PorodCat = this.getView().byId("selectProductCat").getSelectedKey();
		var PorodCatText = this.getView().byId("selectProductCat")._getSelectedItemText();
		var NominalSec = this.getView().byId("selectNominal").getSelectedKey();
		var NominalSecText = this.getView().byId("selectNominal")._getSelectedItemText();
		var testCat = this.getView().byId("selectTestcat").getSelectedKey();
		var testCatText = this.getView().byId("selectTestcat")._getSelectedItemText();
		var testReq = this.getView().byId("selectTestreq").getSelectedKey();
		var testReqText = this.getView().byId("selectTestreq")._getSelectedItemText();
		var testObj = this.getView().byId("selectTestObj").getSelectedKey();
		var testObjText = this.getView().byId("selectTestObj")._getSelectedItemText();
		var testMeth = this.getView().byId("selectTestMethod").getSelectedKey();
		var testMethText = this.getView().byId("selectTestMethod")._getSelectedItemText();
		var testType = this.getView().byId("selectTesttype").getSelectedKey();
		var testTypeText = this.getView().byId("selectTesttype")._getSelectedItemText();
		var Modification = this.getView().byId("longTxt").getValue();
		
		if(Market == "" || PorodCat == "" || NominalSec == "" || testCat == "" || testReq == "" || testObj == "" ||
				testMeth == "" || testType == "" || Modification == ""){
			
			sap.m.MessageBox.show("Please fill all the mendatory fields in Test Requirements.", {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
			});
			return;
			
		}
		
		//Tyre Detail
		var loItems = this.getView().byId("tableVehicle").getItems();
		var TyreDetail = [];
		
		for ( var i in loItems) {
			var laCells = loItems[i]
					.getCells();
			
			var tstType = laCells[0].getText();
			var tyresize = laCells[1].getText();
			var Group = laCells[2].getText();
			var groupDesc = laCells[3].getText();
			var mat = laCells[4].getText();
			var ply = laCells[6].getText();
			var load = laCells[7].getText();
			var speed = laCells[8].getText();
			var noOfTyre = laCells[9].getText();
			var Dis = laCells[10].getText();
			var nsd = laCells[11].getText();
			var groove = laCells[12].getText();
			var g1 = laCells[13].getText();
			var g2 = laCells[14].getText();
			if(g2 == ""){
				g2 = "0"
			}
			var g3 = laCells[15].getText();
			if(g3 == ""){
				g3 = "0"
			}
			var g4 = laCells[16].getText();
			if(g4 == ""){
				g4 = "0"
			}
			var g5 = laCells[17].getText();
			if(g5 == ""){
				g5 = "0"
			}
			var g6 = laCells[18].getText();
			if(g6 == ""){
				g6 = "0"
			}
			var diameter = laCells[19].getText();
			var section = laCells[20].getText();
			var tread = laCells[21].getText();
			var weight = laCells[22].getText();
			var treadWidth = laCells[23].getText();
			var Additionalcomments = laCells[24].getText();
			var tstTypeKey = laCells[25].getText();
			var plyKey = laCells[26].getText();
			var loadKey = laCells[27].getText();
			var speedKey = laCells[28].getText();

			TyreDetail
					.push({
						  CompanyCode : tstTypeKey,
			              TyreSize : tyresize,
			              Group : Group,
			              GroupDesc : groupDesc,
			              Pattern : 01,
			              Material : mat,
			              PlyRating : plyKey,
			              LoadIndex : loadKey,
			              SpeedRating : speedKey,
			              NoOfTyres : noOfTyre,
			              Discount : Dis,
			              Plant : "",
			              NSD : nsd,
			              G1 : g1,
			              G2 : g2,
			              G3 : g3,
			              G4 : g4,
			              G5 : g5,
			              G6 : g6,
			              GrooveNumbers : groove,
			              OverallDiameter : diameter,
			              SectionWidth : section,
			              TreadArcWidth : tread,
			              Weight : weight,
			              TreadWidth : treadWidth,
			              StencilFrom : "",
			              StencilTo : "",
			              PTQuantity : "0",
			              AdditionalComments : Additionalcomments
					});
		}
		
		
		// usage Details
		var usageDetailForm = [];
		var loadSeg = this.getView().byId("loadsegment").getSelectedKeys()[0];
		var psi = this.getView().byId("recPsi").getValue();
		var fRimR = this.getView().byId("fitmntRim").getValue();
		var fRimA = this.getView().byId("FitmentAlt").getValue();
		usageDetailForm
		.push({
			LoadSegment : loadSeg,
			IpPsi : psi,
			FitmentRimRecommended : fRimR,
			FitmentRimAlternate : fRimA,
              Remarks : ""
		});
		
		var loItemsUsage = this.getView().byId("vehiclDetail").getItems();
		var usageDetail = [];
		
		for ( var i in loItemsUsage	) {
			var laCells = loItemsUsage[i]
					.getCells();
			
			var vehMake = laCells[9].getText();
			var vehModel = laCells[1].getText();
			var Config = laCells[10].getText();
			var testingAxle = laCells[11].getText();
			var app = laCells[12].getText();
			var fitmentAxle = laCells[13].getText();
			var dualSpac = laCells[6].getText();
			var AdCom = laCells[8].getText();

			usageDetail
					.push({
			              ItemNumber : "0001",
			              VehicleMake : vehMake,
			              VehicleModel : vehModel,
			              VehicleConfig : Config,	
			              TestingAxle : testingAxle,
			              VehicleApplication : app,
			              FitmentAxle : fitmentAxle,
			              DualSpacing : dualSpac,
			              Remarks : AdCom
					});
		}
		
		// Tyre Avail Details
		
		var testProdDate = this.getView().byId("tyreProdDateInp").getValue();
		var projctStatus = this.getView().byId("selectProjctStatus").getSelectedKey();
		var projctStatusDate = this.getView().byId("projctstatusInp").getValue();
		var plantDate = this.getView().byId("expectedPlantDateInp").getValue();
		var dispatchDate = this.getView().byId("dispatchDateInp").getValue();
		var availDate = this.getView().byId("availabilityDateInp").getValue();
		var comensDate = this.getView().byId("commencementDateInp").getValue();
		var spclCom = this.getView().byId("longTxt2").getValue();
		
		var s = testProdDate.split(".");
		testProdDate = s[2] + "-" + s[1] + "-"+ s[0] + "T00:00:00";
		
		var t = projctStatusDate.split(".");
		projctStatusDate = t[2] + "-" + t[1] + "-"+ t[0] + "T00:00:00";
		
		var u = dispatchDate.split(".");
		dispatchDate = u[2] + "-" + u[1] + "-"+ u[0] + "T00:00:00";
		
		var v = availDate.split(".");
		availDate = v[2] + "-" + v[1] + "-"+ v[0] + "T00:00:00";
		
		var w = comensDate.split(".");
		comensDate = w[2] + "-" + w[1] + "-"+ w[0] + "T00:00:00";
		
		var r = plantDate.split(".");
		plantDate = r[2] + "-" + r[1] + "-"+ r[0] + "T00:00:00";
		
		var docDate = new Date()
		 var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
	            pattern : "dd.MM.yyyy"
			});
		 var currentdate =  oDateFormat.format(docDate);
		 var g = currentdate.split(".");
		 currentdate = g[2] + "-" + g[1] + "-"+ g[0] + "T00:00:00";
		
		
		//call back requirement
		var loItems = this.getView().byId("CALLBACKDetail").getItems();
		var callBack = [];
		
		for ( var i in loItems) {
			var laCells = loItems[i]
					.getCells();
			
			var loaction = laCells[0].getText();
			var mat = laCells[1].getText();
			var tyre = laCells[2].getText();
			var wear = laCells[3].getText();
			var analysis = laCells[4].getText();
			var stage = laCells[5].getText();
			var reason = laCells[6].getText();
			var loactionKey = laCells[8].getText();
			var matKey = laCells[9].getText();
			var analysisKey = laCells[10].getText();
			var stageKey = laCells[11].getText();

			callBack
					.push({
						MaterialDesc : mat,
						CompanyCode : loactionKey,
						ItemNumber : "0010",
						Location : loaction,
						Material : matKey,
						NoOfTyres : tyre,
						PercentageWear : wear,
						Plant : analysisKey,
//						reason : reason
						
					});
		}
		

		
		// create
		var user = sap.ushell.Container.getService("UserInfo").getId();
		var oEntry={};
		oEntry.TestRequestNumber = "FT_TR_DUMMY";
		oEntry.SaveMode = svMode;
		oEntry.Market = Market;
		oEntry.ProductCategory = PorodCat;
		oEntry.ProductSize = NominalSec;
		oEntry.TestCategory = testCat ;
		oEntry.TestRequirement = testReq;
		oEntry.TestObjective = testObj;
		oEntry.TestMethodology = testMeth;
		oEntry.TestType = testType;
		oEntry.Modifications = Modification;
		oEntry.CreatedOn = currentdate;
		oEntry.CreatedBy = user;
		oEntry.ProductionDate = testProdDate;
		oEntry.ProjectStatus = projctStatus;
		oEntry.ProjectStatusDate = projctStatusDate;
		oEntry.PlantDate = plantDate;
		oEntry.DispatchDate = dispatchDate;
		oEntry.AvailabilityDate = availDate;
		oEntry.TestCommencementDate = comensDate;
		oEntry.SpecialComments = spclCom;
		oEntry.TestRequestStatus = "";
		oEntry.MarketDesc = MarketText ;
		oEntry.ProductCategoryDesc = PorodCatText ;
		oEntry.CategoryDescription = testCatText ;
		oEntry.TestRequirementDesc = testReqText ;
		oEntry.TestObjectiveDesc = testObjText ;
		oEntry.TestMethodologyDesc = testMethText ;
		oEntry.TestTypeDesc = testTypeText ;
		oEntry.ProjectStatusDesc = "";
		
		oEntry.NavToRequestItems = TyreDetail;
		oEntry.NavToRequestCallBack = callBack;
		oEntry.NavToRequestUsage = usageDetailForm;
		oEntry.NavToRequestVehicle = usageDetail;
		
		
		var sServiceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/";
		var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
			"Content-Type": "application/atom+xml"
			});
		
//		sap.ui.core.BusyIndicator.show();

		oCreateModel1.create("/TestRequestSet", oEntry, null,
				function(oData, oResponds) {
					debugger;
					sap.ui.core.BusyIndicator.hide();
					var rcno = oData.TestRequestNumber;
					sap.m.MessageBox.show("Request " + rcno + " has been Created", {
						// icon
						// :
						// sap.m.MessageBox.Icon.ERROR,
						title : "Information",
						actions : [ 'OK' ],
						onClose : function(a) {
							window.history.back();
						},
					});

				}, function(oError) { // error callback
					// function
					var parser = new DOMParser();
					var message = parser.parseFromString(
						oError.response.body, "text/xml")
						.getElementsByTagName("message")[0].innerHTML
					sap.m.MessageBox.show(message, {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					});
})
		
	},
	
	Materialf4 : function(evt)
	{
		var that = this;
		var ItemDescRow = evt.getSource();
		var market = this.getView().byId("selectMarket").getSelectedKey();
		var prodCat = this.getView().byId("selectProductCat").getSelectedKey();
		var prodSize = this.getView().byId("selectNominal").getSelectedKey();
		var prodType = this.getView().byId("selectProdTyre").getSelectedKey();
		var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4MaterialNumberSet?$filter=Market eq '01' and ProdCat eq '001' and ProdSize eq '10' and ProdType eq 'R'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false,
				false, null);
		var Materialf4 = new sap.m.SelectDialog(
				{

					title : "Select Tyre Location",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem(
								{
									title : "{Maktx}",
									description:"{Matnr}",
									customData : [ new sap.ui.core.CustomData(
											{
												key : "{Matnr}",
												value : "{Maktx}"
											}) ],

								}),
					},
					liveChange : function(oEvent) {
						var sValue = oEvent
								.getParameter("value");
						var oFilter = new sap.ui.model.Filter(
								"Maktx",
								sap.ui.model.FilterOperator.Contains,
								sValue);
						oEvent.getSource().getBinding("items")
								.filter([ oFilter ]);
					},
					confirm : function(oEvent)
					{
						var that = this;
						var oSelectedItem = oEvent.getParameter("selectedItem");
						var Obj = oSelectedItem.getBindingContext().getObject();
						if (oSelectedItem) {
							ItemDescRow.setValue(oSelectedItem.getDescription());
							ItemDescRow.getParent().getParent().getFormElements()[09];
							ItemDescRow.getParent().getParent().getFormElements()[11];
							ItemDescRow.getParent().getParent().getFormElements()[13];
						}
					},
					cancel : function(oEvent)
					{
						var that = this;
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							ItemDescRow.setValue(oSelectedItem.getTitle());
						}
					}
				});
		Materialf4.setModel(jModel);
		Materialf4.open();
	},
	
	testReqChange : function(e){
		
		var self = this;
		
		
	},
	
	showCart : function(){
		var router = sap.ui.core.UIComponent
		.getRouterFor(this);
		router
		.navTo("page2");
	},
	
	onClear : function(){
		location.reload();
	},
	
	onBackNav : function(){
		var router = sap.ui.core.UIComponent
		.getRouterFor(this);
		router
		.navTo(
				"page2");
	},
	
	
	


/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.View1
*/
//	onBeforeRendering: function() {
//
//	},
	

	
	
		
	
	
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.View1
*/



/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.View1
*/
//	onExit: function() {
//
//	}
	

		
			

});