sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/core/format/DateFormat"
], function (Element, DateFormat) {
	"use strict";

	var Formatter = Element.extend("com.phyOccuReport.model.formatter");

	/**
	 * Returns date in String format in a mentioned pattern 
	 * @param {type} oDate
	 * @returns {String}
	 */
	Formatter.formatDate = function (value) {
		var oDateFormat = DateFormat.getDateTimeInstance({
			pattern: "dd-MM-yyyy"
		});
		if (value) {
			var formatDt = oDateFormat.format(value);
			return formatDt;
		} else {
			return value;
		}
	};
	Formatter.returnVisibleForUnblock = function (value) {
		if (value == "03") {
			return true;
		} else {
			return false;
		}
	};

	Formatter.formatNewStatus = function (value) {
		var a = value.length;
		var sStrng = "Exit";
		value = value.substring(3, a);

		if (value.includes("Reject-Left Over Qty closure")) {
			return sStrng;
		} else {
			return value;
		}
	};

	Formatter.formatDateCustomerAlloc = function (value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyyMMdd"
			});
			return oDateFormat.format(new Date(value));
		} else {
			return "";
		}
	};

	Formatter.formatCreateAllocation = function (value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "MM/dd/yyyy"
			});
			return oDateFormat.format(new Date(value));
		} else {
			return "";
		}

	};

	Formatter.returnOverviewDate = function (value) {
		var year = value.slice(0, 4);
		var day = value.slice(6, 8);
		var month = value.slice(4, 6);
		var d = new Date(year, month - 1, day);
		var modDate = Formatter.formatDateReview(d);
		return modDate;

	};
	Formatter.returnFormatedDate = function (value) {
		if (value === null)
			return;
		var year = value.slice(0, 4);
		var day = value.slice(6, 8);
		var month = value.slice(4, 6);
		var d = new Date(year, month - 1, day);
		var modDate = Formatter.formatedDateReview(d);
		return modDate;

	};
	
 
	Formatter.returnFormatedDates = function (value) {
		if (value === null)
			return;
		var year = value.slice(0, 4);
		var day = value.slice(6, 8);
		var month = value.slice(4, 6);
		var d = new Date(year, month - 1, day);
		var modDate = Formatter.formatedDateReviews(d);
		return modDate;

	};
	
		Formatter.formatedDateReviews = function (value) {
		var oDateFormat = DateFormat.getDateTimeInstance({
			pattern: "MM-dd-yyyy"
		});
		if (value) {
			var formatDt = oDateFormat.format(value);
			return formatDt;
		} else {
			return value;
		}
	};
	
	
	Formatter.formatedDateReview = function (value) {
		var oDateFormat = DateFormat.getDateTimeInstance({
			pattern: "dd-MM-yyyy"
		});
		if (value) {
			var formatDt = oDateFormat.format(value);
			return formatDt;
		} else {
			return value;
		}
	};

	Formatter.formatMsrCommentDateTime = function (isDeleted, auditDate, deletionDate) {
		var oDateFormat = DateFormat.getDateTimeInstance({
			pattern: "yyyy-MM-dd"
		});

		if (isDeleted === 1) {
			// if(deletionDate !== undefined ) {
			var formatDt = oDateFormat.format(deletionDate);
			var hours = deletionDate.getHours();
			var minutes = deletionDate.getMinutes();
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm;
			return formatDt + " " + strTime;
			// } else {
			// 	return "Date not coming";
			// }

		} else {
			var formatDt = oDateFormat.format(auditDate);
			var hours = auditDate.getHours();
			var minutes = auditDate.getMinutes();
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm;
			return formatDt + " " + strTime;
		}

	};
	Formatter.formatRating = function (value) {
		return parseInt(value);
	};
	Formatter.formatRatingUndefined = function (value) {
		if (value === null) {
			return 0;
		} else {
			return parseInt(value);
		}
	};
	Formatter.formatYear = function (value) {
		return value;
	};
	Formatter.formatCommentDeleted = function (value) {
		if (value === "Comment Deleted") {
			return true;
		} else {
			return false;
		}
	};
	Formatter.formatMsrCommentDeleted = function (value) {
		if (value !== null && value !== undefined) {
			if (value.indexOf("Comment Deleted for") >= 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}

	};
	Formatter.formatCommentDeletedOldValue = function (value) {
		if (value !== null && value !== undefined) {
			if (value === "Comment Deleted" || value.indexOf("Comment Deleted for") >= 0) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	};
	Formatter.formatDateReview = function (value) {
		var oDateFormat = DateFormat.getDateTimeInstance({
			pattern: "MM dd yyyy"
		});
		if (value) {
			var formatDt = oDateFormat.format(value);
			return formatDt;
		} else {
			return value;
		}
	};
	Formatter.formatUnitType = function (value) {
		if (value === "PERCENT") {
			return "%";
		} else {
			return "#";
		}
	};
	Formatter.formatDateTime = function (value) {
		var oDateFormat = DateFormat.getDateTimeInstance({
			pattern: "yyyy-MM-dd"
		});
		var formatDt = oDateFormat.format(value);
		var hours = value.getHours();
		var minutes = value.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return formatDt + " " + strTime;
	};
	Formatter.formatPlanFor = function (value) {
		if (value === undefined) {
			return "";
		} else {
			return value;
		}
	};
	Formatter.formatReviewButtonText = function (date, status) {
		var currentDate = new Date();
		if (currentDate > date) {
			switch (status) {
			case "DRAFT":
				return this.getModel("i18n").getProperty("START_TEXT");
				break;
			case "IN_PROGRESS":
				return this.getModel("i18n").getProperty("IN_PROGRESS_TEXT");
				break;
			case "REVIEW_COMPLETE":
				return this.getModel("i18n").getProperty("COMPLETED_TEXT");
				break;
			}
		} else {
			return "Not Started";
		}
	};
	Formatter.formatReviewTooltip = function (status) {
		switch (status) {
		case "DRAFT":
			return "";
			break;
		case "IN_PROGRESS":
			return this.getModel("i18n").getProperty("REVIEW_IN_PROGRESS_TEXT");
			break;
		case "REVIEW_COMPLETE":
			return this.getModel("i18n").getProperty("REVIEW_COMPLETED_TEXT");
			break;
		}
	};

	Formatter.formatReviewButtonEnable = function (value, buttonEnable) {
		var currentDate = new Date();
		if ((currentDate > value) && buttonEnable) {
			return true;
		} else {
			return false;
		}
	};
	Formatter.formatPresentViewEnable = function (value, enablePresentView) {
		// var currentDate = new Date();
		if (enablePresentView) {
			return true;
		} else {
			return false;
		}
	};
	Formatter.formatStatus = function (value) {
		var oStatus = "";
		switch (value) {
		case "DRAFT":
			oStatus = this.getModel("i18n").getProperty("PLAN_DRAFT_TEXT");
			break;
		case "VAL_PENDING_CLU_MGR":
			oStatus = this.getModel("i18n").getProperty("PLAN_PENDING_WITH_CLUSTER_MANAGER_TEXT");
			break;
		case "VAL_PENDING_CTY_MGR":
			oStatus = this.getModel("i18n").getProperty("PLAN_PENDING_WITH_COUNTRY_MANAGER_TEXT");
			break;
		case "REVIEW_IN_PROGRESS":
			oStatus = this.getModel("i18n").getProperty("REVIEW_IN_PROGRESS_TEXT");
			break;
		case "REVIEW_COMPLETE":
			oStatus = this.getModel("i18n").getProperty("REVIEW_COMPLETED_TEXT");
			break;
		case "VALIDATION_COMPLETED":
			oStatus = this.getModel("i18n").getProperty("PLAN_ACTIVE");
			break;
		case "IN_PROGRESS":
			oStatus = this.getModel("i18n").getProperty("IN_PROGRESS_TEXT");
			break;
		default:
			oStatus = this.getModel("i18n").getProperty("COMPLETED_TEXT");
		}
		return oStatus;
	};
	Formatter.formatPlanStatus = function (oValue) {
		return oValue.split("(")[0];
	};
	Formatter.formatObtainedOfAchieved = function (value, unitType, frequency) {
		/*		if (!$.isEmptyObject(value) && value != 0) {
					var a = Math.floor(value);
					return a;
				} else if (value === 0 || value === null || value === undefined) {
					return value;
				} else {
					return "";
				}*/
		var i = 0;
		var flagZero = true;
		for (var q = 0; q < value.length; q++) {
			if (value[q].obtained !== null) {
				i = i + parseInt(value[q].obtained);
				flagZero = false;
			}
		}
		if (unitType === "NUMBER") {
			if (i !== 0) {
				return i.toString();
			} else {
				if (frequency === "YEARLY") {
					return value[0].obtained;
				} else if (!flagZero) {
					return i.toString();
				} else {
					return "";
				}
			}
		} else if (frequency === "MONTHLY") {
			if (i !== 0) {
				return Math.floor(i / 12).toString();
			} else if (!flagZero) {
				return i.toString();
			} else {
				return "";
			}
		} else if (frequency === "QUARTERLY") {
			if (i !== 0) {
				return Math.floor(i / 4).toString();
			} else if (!flagZero) {
				return i.toString();
			} else {
				return "";
			}
		} else {
			if (i !== 0) {
				return i.toString();
			} else if (!flagZero) {
				return i.toString();
			} else {
				return "";
			}
		}
	};
	/*	Formatter.formatObtainedOfTarget (function (value1, value2, measurementScorePercent) {
			// var percentage = Math.floor((value1/value2)*100);
			var a = Math.floor(value1);
			return a + " of " + value2 + " ( " + Math.floor(measurementScorePercent) + " %)";
		};*/
	Formatter.formatObtained = function (value) {
		var newValue = Math.floor(value);
		if (parseInt(newValue) > 100) {
			return 100;
		} else {
			return parseInt(newValue);
		}
	};

	Formatter.formatMeasurementType = function (value, measurementId, kpiId, oInputValueArray) {
		if (value === "MANDATORY") {
			return true;
		} else {
			if (oInputValueArray !== undefined) {
				if (oInputValueArray.length !== 0) {
					for (var i = 0; i < oInputValueArray.length; i++) {
						if (oInputValueArray[i].kpiMeasurementId === measurementId && oInputValueArray[i].kpiId === kpiId) {
							return true;
							break;
						}
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	};
	Formatter.formatStringCase = function (sValue) {
		if (sValue === "AUTOMATIC") {
			var sValue = sValue.substring(0, 4);
			return "(" + sValue.charAt(0).toUpperCase() + sValue.slice(1).toLowerCase() + ")";
		} else {
			return "(" + sValue.charAt(0).toUpperCase() + sValue.slice(1).toLowerCase() + ")";
		}
	};
	Formatter.formatStringCaseFrequency = function (sValue) {
		return sValue.charAt(0).toUpperCase() + sValue.slice(1).toLowerCase();
	};
	Formatter.isFormatReviewProgress = function (value) {
		if (value === "IN_PROGRESS" || value === "REVIEW_COMPLETE") {
			return false;
		} else {
			return true;
		}
	};
	Formatter.formatCommentIconShow = function (captureType) {
		if (captureType === "AUTOMATIC") {
			return false;
		} else {
			return true;
		}
	};
	Formatter.isFormatYearEndPeriodText = function (value) {
		if (value == 0) {
			return false;
		} else {
			return true;
		}
	};
	Formatter.formatOldValue = function (value) {
		if (value === null) {
			return 0;
		} else {
			return value;
		}
	};
	// Formatter.isFormatReviewStatus = function(status) {
	// 	if (status === "DRAFT") {
	// 		return "None";
	// 	} else if (status === "IN_PROGRESS") {
	// 		return "Warning";
	// 	} else if (status === "REVIEW_COMPLETED") {
	// 		return "Success";
	// 	}
	// };
	Formatter.formatPlanTooltip = function (status, cluId, ctyId) {
		if (status === "COMPLETED") {
			return this.getModel("i18n").getProperty("PLAN_CLOSED_TEXT");
		} else if (status === "VALIDATION_COMPLETED") {
			return this.getModel("i18n").getProperty("PLAN_ACTIVE_FOR_REVIEW__TEXT");
		} else if (status === "IN_PROGRESS" && cluId === null && ctyId === null) {
			return this.getModel("i18n").getProperty("PLAN_PENDING_BOTH_TEXT");
		} else if (status === "IN_PROGRESS" && cluId !== null && ctyId === null) {
			return this.getModel("i18n").getProperty("PLAN_PENDING_COUNTRY_TEXT");
		} else if (status === "IN_PROGRESS" && cluId === null && ctyId !== null) {
			return this.getModel("i18n").getProperty("PLAN_PENDING_CLUSTER_TEXT");
		}
	};
	Formatter.formatMsrCommentStrikeOut = function (isDeleted) {
		if (isDeleted) {
			return true;
		} else {
			return false;
		}
	};
	Formatter.formatMsrComment = function (isDeleted) {
		if (!isDeleted) {
			return true;
		} else {
			return false;
		}
	};
	Formatter.formatMeasurementValue = function (measurementId, kpiId, targetArray) {
		if (targetArray !== undefined) {
			if (targetArray.length !== 0) {
				for (var i = 0; i < targetArray.length; i++) {
					if (targetArray[i].kpiMeasurementId === measurementId && targetArray[i].kpiId === kpiId) {
						return targetArray[i].target;
					}
				}
			} else {
				return "";
			}
		} else {
			return "";
		}
	};

	// Formatter.formatEnableDisableValue = function ( targetArray) {
	// 	if (targetArray !== undefined) {
	// 		if (targetArray.length !== 0) {
	// 			for (var i = 0; i < targetArray.length; i++) {
	// 				if (targetArray[i].kpiMeasurementId === measurementId && targetArray[i].kpiId === kpiId) {
	// 					return targetArray[i].target;
	// 				}
	// 			}
	// 		} else {
	// 			return "";
	// 		}
	// 	} else {
	// 		return "";
	// 	}
	// };

	Formatter.formatEnableDisableValue = function (measurementType, targetArray1, measurementId, kpiId, targetArray) {
		/*		if (targetArray1 !== undefined && measurementType !== undefined) {
					if (measurementType === "OPTIONAL" && targetArray1.status === "REVIEW_IN_PROGRESS") {
						return false;
					} else {
						return true;
					}
				} else {
					return true;
				}*/

		if (targetArray !== undefined) {
			if (targetArray.length !== 0) {
				var isfound = false;
				for (var i = 0; i < targetArray.length; i++) {
					if (targetArray[i].kpiMeasurementId === measurementId && targetArray[i].kpiId === kpiId) {
						isfound = true;
						if (targetArray1 !== undefined && measurementType !== undefined) {
							if (measurementType === "OPTIONAL" && targetArray1.status === "REVIEW_IN_PROGRESS") {
								if (targetArray[i].target !== null && targetArray[i].target !== "") {
									return true;
								} else {
									return false;
								}
							} else {
								return true;
							}
						} else {
							return true;
						}
					}
				}
				if (!isfound && measurementType === "OPTIONAL" && targetArray1.status === "REVIEW_IN_PROGRESS") {
					return false;
				}
			} else {
				return true;
			}
		} else {
			return true;
		}
	};
	Formatter.formatVisibleSaveButton = function (targetArray, businessRole) {
		if (businessRole === "FarmsNescafeHQOpsMgr" || businessRole === "FarmsNescafeOpsMgr") {
			if (targetArray !== undefined && targetArray !== null) {
				if (targetArray.status === "REVIEW_IN_PROGRESS") {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		} else {
			return false;
		}
	};
	Formatter.showHideBasedOnBusinessRole = function (businessRole) {
		if (businessRole === "FarmsNescafeHQOpsMgr" || businessRole === "FarmsNescafeOpsMgr") {
			return true;
		} else {
			return false;
		}
	};
	Formatter.formatVisibleReviewButton = function (targetArray) {
		if (targetArray !== undefined && targetArray !== null) {
			if (targetArray.status === "REVIEW_COMPLETE") {
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	};
	Formatter.formatMeasurementShow = function (measurementId, kpiId, targetArray, planDetails) {
		var flag = false;
		if (targetArray !== undefined && planDetails.status === "VALIDATION_COMPLETED") {
			if (targetArray.length !== 0) {
				for (var i = 0; i < targetArray.length; i++) {
					if (targetArray[i].kpiMeasurementId === measurementId && targetArray[i].kpiId === kpiId) {
						flag = true;
					}
				}
				if (flag) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		} else {
			return true;
		}
	};
	Formatter.formatTargetShow = function (status) {
		if (status === "ACTIVE") {
			return true;
		} else {
			return false;
		}
	};

	Formatter.formatMeasurementCaptureType = function (value, frequency, planStatus) {
		if (planStatus === "REVIEW_COMPLETE") {
			return false;
		} else {
			if (value === "MANUAL" && frequency === "YEARLY") {
				return true;
			} else {
				return false;
			}
		}
	};
	Formatter.formatVisibleplanReviewAudit = function (planStatus) {
		if (planStatus === "REVIEW_COMPLETE") {
			return true;
		} else {
			return false;
		}
	};
	Formatter.formatReviewComment = function (value) {
		return "";
	};

	Formatter.formatDeleteButton = function (value1, value2) {
		if (value1 === value2) {
			return true;
		} else {
			return false;
		}
	};
	Formatter.formatDeleteMsrCmmntButton = function (isdeleted, value1, value2) {
		if (value1 === value2 && isdeleted === 0) {
			return true;
		} else {
			return false;
		}
	};
	Formatter.formatValidatedByName = function (clusId, ctyId, ctyName, cluName) {
		if (clusId !== null && ctyId !== null) {
			return "";
		} else if (clusId !== null) {
			return "(" + this.getModel("i18n").getProperty("VALIDATED_BY") + " " + cluName + ")";
		} else if (ctyId !== null) {
			return "(" + this.getModel("i18n").getProperty("VALIDATED_BY") + " " + ctyName + ")";
		} else if (clusId === null && ctyId === null) {
			return this.getModel("i18n").getProperty("VALIDATION_PENDING");
		} else {
			return "";
		}
	};
	Formatter.formatHideKpiScore = function (value1, value2) {
		if (value1 === 1 && value2 === true) {
			return true;
		} else {
			return false;
		}
	};
	Formatter.formatHideScore = function (value) {
		if (value === 1) {
			return true;
		} else {
			return false;
		}
	};

	Formatter.formatHideScoreColumn = function (value) {
		if (value) {
			return true;
		} else {
			return false;
		}
	};
	Formatter.sortByProperty = function (property) {
		'use strict';
		return function (a, b) {
			var sortStatus = 0;

			if (a[property] > b[property]) {
				sortStatus = -1;
			} else if (a[property] < b[property]) {
				sortStatus = 1;
			}
			return sortStatus;
		};
	};
	Formatter.formatObtainedEnabled = function (captureType, planStatus) {
		if (planStatus === "REVIEW_COMPLETE") {
			return false;
		} else {
			if (captureType === "AUTOMATIC") {
				return false;
			} else {
				return true;
			}
		}
	};
	Formatter.formatfrequencyShow = function (frequency) {
		if (frequency === "YEARLY") {
			return false;
		} else {
			return true;
		}
	};
	Formatter.formatAuditShow = function (oldValue, newValue) {
		if (oldValue === newValue) {
			return false;
		} else {
			return true;
		}
	};

	Formatter.returnEnabledProperty = function (openAllocation) {
		if (openAllocation === "Y") {
			return false;
		} else {
			return true;
		}
	};

	Formatter.isBlockReasonVisibile = function (Status) {
		if (Status == "Z1:Reject-Delivery Date Expired" || Status == "Z1:Reject-Left Over Qty closure" ||  Status == "Z1:In Process") {
			return false;
		} else {
			return true;
		}
	};

	return Formatter;
});