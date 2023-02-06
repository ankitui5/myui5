sap.ui.define([], function() {
	"use strict";
	return {
		handleRead: function(oModel, sContextPath, filter, expand, select, orderby, fnSuccess, fnFail) {
			var urlParameter = {};
			if (filter !== "" && expand !== "" && select !== "") {
				urlParameter = {
					"$filter": filter,
					"$expand": expand,
					"$select": select
				};
			}
			if (expand === "" && select === "" && filter !== "") {
				urlParameter = {
					"$filter": filter
				};
			}
			if (expand === "" && select !== "" && filter === "") {
				urlParameter = {
					"$select": select
				};
			}
			if (expand !== "" && select === "" && filter === "") {
				urlParameter = {
					"$expand": expand
				};
			}
			if (expand !== "" && select !== "" && filter === "") {
				urlParameter = {
					"$expand": expand,
					"$select": select
				};
			}
			if (expand === "" && select !== "" && filter !== "") {
				urlParameter = {
					"$filter": filter,
					"$select": select
				};
			}
			if (expand !== "" && select === "" && filter !== "") {
				urlParameter = {
					"$expand": expand,
					"$filter": filter
				};
			}

			if (orderby !== "") {
				urlParameter["$orderby"] = orderby;
			}

			oModel.read(sContextPath, {
				urlParameters: urlParameter,
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(fnFail, this)
			});
		},
		handleReadWithHeader: function(oModel, sContextPath, filter, header, expand, select, orderby, fnSuccess, fnFail) {
			var urlParameter = {};
			if (filter !== "" && expand !== "" && select !== "") {
				urlParameter = {
					"$filter": filter,
					"$expand": expand,
					"$select": select
				};
			}
			if (expand === "" && select === "" && filter !== "") {
				urlParameter = {
					"$filter": filter
				};
			}
			if (expand === "" && select !== "" && filter === "") {
				urlParameter = {
					"$select": select
				};
			}
			if (expand !== "" && select === "" && filter === "") {
				urlParameter = {
					"$expand": expand
				};
			}
			if (expand !== "" && select !== "" && filter === "") {
				urlParameter = {
					"$expand": expand,
					"$select": select
				};
			}
			if (expand === "" && select !== "" && filter !== "") {
				urlParameter = {
					"$filter": filter,
					"$select": select
				};
			}
			if (expand !== "" && select === "" && filter !== "") {
				urlParameter = {
					"$expand": expand,
					"$filter": filter
				};
			}

			if (orderby !== "") {
				urlParameter["$orderby"] = orderby;
			}
			
            if (header !== "") {
            	urlParameter["Accept-Language"] = header;
            }
            
			oModel.read(sContextPath, {
				urlParameters: urlParameter,
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(fnFail, this)
			});
		},
		handleCreate: function(oModel, sContextPath, requestData, fnSuccess, fnFail) {
			oModel.create(sContextPath, requestData, {
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(fnFail, this)
			});
		},
		handleCreateBatch: function(oModel, sContextPath, groupId, requestData, fnSuccess, fnFail) {
			oModel.create(sContextPath, requestData, {
				groupId: groupId,
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(fnFail, this)
			});
		},
		handleRemove: function(oModel, sContextPath, fnSuccess, fnFail) {
			oModel.remove(sContextPath, {
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(fnFail, this)
			});
		},
		handleRemoveNew: function(oModel, sContextPath, fnSuccess, fnFail) {
			oModel.remove(sContextPath, {
				method:"DELETE",
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(fnFail, this)
			});
		},		
		handleRemoveBatch: function(oModel, sContextPath, groupId, fnSuccess, fnFail) {
			oModel.remove(sContextPath, {
				groupId: groupId,
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(fnFail, this)
			});
		},
		handleUpdate: function(oModel, sContextPath, requestData, fnSuccess, fnFail) {
			oModel.update(sContextPath, requestData, {
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(fnFail, this)
			});
		},
		handleUpdateBatch: function(oModel, sContextPath, groupId, requestData, fnSuccess, fnFail) {
			oModel.update(sContextPath, requestData, {
				groupId: groupId,
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(fnFail, this)
			});
		},
		handleCreateBatchRollBack: function(oModel, sContextPath, groupId, changeId, requestData, fnSuccess, fnFail) {
			oModel.create(sContextPath, requestData, {
				groupId: groupId,
				changeSetId : changeId,
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(fnFail, this)
			});
		},
		handleUpdateBatchRollBack: function(oModel, sContextPath, groupId, changeId, requestData, fnSuccess, fnFail) {
			oModel.update(sContextPath, requestData, {
				groupId: groupId,
				changeSetId : changeId,
				success: jQuery.proxy(fnSuccess, this),
				error: jQuery.proxy(fnFail, this)
			});
		}
		

	};
});