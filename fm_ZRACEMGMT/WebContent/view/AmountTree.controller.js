sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller,JSONModel) {
	"use strict";
var that;
	return Controller.extend("ZRACEMGMT.view.AmountTree", {
			onInit: function() {
				that=this;
//			var path = jQuery.sap.getModulePath("ZRACEMGMT");
//			var oModel = new JSONModel(path+"/data.json");
 
//            this.getView().setModel(oModel);
			this.getMasterListData();
			sap.ui.core.UIComponent.getRouterFor(this).getRoute(
			"amountPage").attachMatched(this._onRoute, this);
		},
//		onPress: function(){
//			this.getMasterListData();
//		},
		_onRoute : function(e) {
			this.path = e.getParameter("arguments").details;
			
		},
		getMasterListData: function() {
			var oViewObj = this.getView();
			var MaterialListSetJModel = oViewObj.getModel("MaterialListSetJModel");
			if (!MaterialListSetJModel) {
				MaterialListSetJModel = new sap.ui.model.json.JSONModel();
				oViewObj.setModel(MaterialListSetJModel, "MaterialListSetJModel");
			}
			
			var sPathMatListSet = "/RaceNodeSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsMatListSet = {};
			oParamsMatListSet.context = "";
			oParamsMatListSet.urlParameters = "";
			oParamsMatListSet.success = function(oData, oResponse) { // success handler

				MaterialListSetJModel.setData(oData.results);
				var deepData = that.transformTreeData(oData.results);
				that.setModelData(deepData);
			};
			oParamsMatListSet.error = function(oError) { // error handler 
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			frameworkODataModel.read(sPathMatListSet, oParamsMatListSet);
			frameworkODataModel.attachRequestCompleted(function() {});

		},
		transformTreeData: function(nodesIn) {
			var nodes = []; //'deep' object structure
			var nodeMap = {}; //'map', each node is an attribute
			if (nodesIn) {
				var nodeOut;
				var parentId;

				for (var i = 0; i < nodesIn.length; i++) {
					if(nodesIn[i].Enabled == "true"){
						nodesIn[i].Enabled = true;
					}else if(nodesIn[i].Enabled == "false"){
						nodesIn[i].Enabled = false;
					}
					if(nodesIn[i].Amount == "0 "){
						nodesIn[i].Amount = parseInt(nodesIn[i].Amount);
					}
					var nodeIn = nodesIn[i];
					
//					if(nodeIn.Id == 1){
//						nodeIn.ParentId =1;
//					}
//					if(nodeIn.Id == 9){
//						nodeIn.ParentId =9;
//					}
					nodeOut = {
						Id: nodeIn.Id,
						Name: nodeIn.Name,
						Amount: nodeIn.Amount,
						Enabled: nodeIn.Enabled,
						children: []
					};

					parentId = nodeIn.ParentId;
					if (nodeIn.ParentId === nodeIn.Id) {
						//there is no parent, must be top level
						nodes.push(nodeOut);
					} else if (parentId && parentId > 0) {

						var parent = nodeMap[nodeIn.ParentId];
						if (parent) {
							parent.children.push(nodeOut);
						}
					}
					nodeMap[nodeOut.Id] = nodeOut;
				}
			}

			return nodes;
		},
		setModelData: function(nodes) {

			//store the nodes in the JSON model, so the view can access them
			var nodesModel = new sap.ui.model.json.JSONModel();
			nodesModel.setData({
//				nodeRoot: {
					children: nodes
//				}
			});
//			this.getView().setModel(nodesModel, "nodeModel");
			this.getView().setModel(nodesModel);
		},
		onCollapseAll: function () {
            var oTreeTable = this.getView().byId("TreeTableBasic");
            oTreeTable.collapseAll();
        },
 
        onExpandFirstLevel: function () {
            var oTreeTable = this.getView().byId("TreeTableBasic");
            oTreeTable.expandToLevel(1);
        },
        onAmountChange: function(oEvent){
        	var newValue = parseInt(oEvent.getSource().getValue());
        	var lastValue = parseInt(oEvent.getSource()._lastValue);
        	if(newValue === undefined || isNaN(newValue))
        		newValue = 0;
        	if(lastValue === undefined || isNaN(lastValue))
        		lastValue = 0;
        	var changeValue = newValue-lastValue;
        	var path = oEvent.getSource().getParent().getBindingContext().getPath();
        	var model = oEvent.getSource().getParent().getBindingContext().getModel();
        	var key = "children";
        	this.changeAmount(path,model,key,changeValue);
   //     	var map = path.reduce(function(prev, cur) {
			// 	  prev[cur] = (prev[cur] || 0) + 1;
			// 	  return prev;
			// 	}, {});
			// var categoryLength = map.categories;
   //     	var category = oEvent.getSource().getParent().getModel().getData().categories[path].categories.length;
        	
        	
        	// for(var i = 0; i< categories;i++){
        		
        	// }
        	// for()
        },
        /*changeAmount:function(path,model,key,changeValue){
        	var changeKey = "/"+key;
        	var indexArray = path.split(changeKey);
        	indexArray.forEach(function(indexs,i){
        		if(i === 0){
        			return;
        		}
        		
        		if(i>1){
        			changeKey = changeKey + "/"+key;
        		}
        		changeKey = changeKey+indexs;
        		model.getProperty(changeKey).Amount += changeValue;
        		if(i === 2){
        			var abc = parseInt(indexs.replace("/",""))+1;
        			abc = 2;
        			model.getProperty("/"+key+"/"+abc).Amount = model.getProperty(changeKey).Amount;
        		}
        	}.bind(this));
        	model.refresh();
        }*/
        
        changeAmount:function(path,model,key,changeValue){
        	var changeKey = "/"+key;
        	var indexArray = path.split(changeKey);
        	indexArray.forEach(function(indexs,i){
        		if(i === 0){
        			return;
        		}
        		
        		if(i>1){
        			changeKey = changeKey + "/"+key;
        		}

        		 if(i === 2){
        			var abc = model.getProperty(changeKey).length-1;
        			model.getProperty(changeKey+"/"+abc).Amount += changeValue;
        		}
        		
        		changeKey = changeKey+indexs;
        		model.getProperty(changeKey).Amount += changeValue;
        	}.bind(this));
        	model.refresh();
        },
        onNavBack: function() {
        	var amount = 0;
        	var allData = this.getView().getModel().getData();
        	for(var i=0;i<allData.children.length ;i++){
        		amount= parseInt(amount) + parseInt(allData.children[i].Amount);
        	}
        	var router = sap.ui.core.UIComponent
			.getRouterFor(this);
        	var data = {};
        	data.path = this.path;
        	data.amount = amount;
			router
			.navTo("page2", {details : JSON.stringify(data)});
		},
	});
});