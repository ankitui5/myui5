sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		oGlobalModel:function(){
			var oGlobalModel = new JSONModel();
			return oGlobalModel;
		},
		oErrorFlagModel:function(){
			var oErrorFlagModel = new JSONModel();
			return oErrorFlagModel;
		},
		component: null, // set reference of Component
		models: [
		{
			model:"oGlobalModel"
		},
		{
			model:"oErrorFlagModel"
		},
		{
			model: "gm",
			data: {
				editMode: false,
				createModel : {}
			}
		},
		{
            model: "device",
            data: Device
        },
        {
			model: "stockModel",
			data: []
		},
		{
			model: "warehouseModel",
			data: []
		},{
			model: "MRPModel",
			data: []
		}
        ],
		/** Returns the model object
         * @param {string} sName - Accept model name
         * @return {sap.ui.model.json.JSONModel} - return JSON model
         * */
        getModel: function(sName) {
            return this.component.getModel(sName);
        }

	};
});