manyTableForm = {

	oFormXML : null,
	oForm : null,
	oTableName : null,
	oTemplate : null,
	oPlace : null,
	oTable : null,
	oCount : 0,
	requestId : 0,
	oDataXML : null,
	oCondition : null,
	oShowWhere : "afterEnd",
	oRowsIndex : new Array(),
	oDeletedID : new Array(),
	// oRequestName : null,//request_id 名称
	oMajorKey : null,// 主键--与主表相关联的主键要设置为空以免冲突
	oIsConNotCurUser : null, // 用户权限点
	oStaffIdObj : null,// 权限点对应的子表单字段名如“STAFF_ID”
	init : function(aForm, aTableName, aTemplate, aPlace, aCondition,
			aShowWhere, aMajorKey, aIsConNotCurUser, aStaffIdObj) {
		this.oForm = aForm;
		this.oTableName = aTableName;
		this.oTemplate = aTemplate;
		this.oPlace = aPlace;
		this.oCondition = aCondition;
		this.oMajorKey = aMajorKey;
		this.oIsConNotCurUser = aIsConNotCurUser;
		this.oStaffIdObj = aStaffIdObj;
		if (aShowWhere) {
			this.oShowWhere = aShowWhere
		}
		oTable = aForm.TABLE[aTableName];
		for ( var tableName in aForm.TABLE) {
			this.requestId = aForm.TABLE[tableName]["REQUEST_ID"].VALUE();
			break;
		}
		if (aForm.getFormBahavior() != 'C') {
			this.oDataXML = this.loadData();
			this.load();
		}
	},
	load : function() {
		var oTableNodes = this.oDataXML.selectNodes("//TABLE");
		var iLen = oTableNodes.length;
		for ( var i = 0; i < iLen; i++) {
			this.add();
			var staffIdObj = null;
			if (this.oStaffIdObj) {
				staffIdObj = oTableNodes[i].selectSingleNode(this.oStaffIdObj);
			}

			var isDisabled = false;
			if (staffIdObj && this.oIsConNotCurUser
					&& staffIdObj.text != this.oForm.globalVar.STAFF_ID) {
				isDisabled = true;
			}
			for ( var fieldName in oTable) {
				var oField = oTable[fieldName];
				if (typeof (oField) != "object")
					continue;
				var sElement = document.getElementById(oField.ELEMENT_NAME
						+ "_" + i);
				var oDataField = oTableNodes[i].selectSingleNode(fieldName);
				if (isDisabled) {
					if (oField.FIELD_TYPE == "ATTACH"
							|| sElement.nodeName == 'multiSelect') {
						sElement.readOnly = true;
					} else {
						sElement.disabled = true;
					}
				}
				if (oDataField) {
					if (sElement.tagName == "SPAN") {
						sElement.innerHTML = oDataField.text;
					} else {
						sElement.value = oDataField.text;
					}
					sElement.index = i;
				}
				sElement.action = "E";
			}
		}

	},
	add : function() {
		var sTemplate = document.getElementById(this.oTemplate).innerHTML;
		for ( var fieldName in oTable) {
			var field = oTable[fieldName];
			if (typeof (field) != "object")
				continue;
			sTemplate = sTemplate.replace(
					eval('/' + field.ELEMENT_NAME + '/g'), field.ELEMENT_NAME
							+ "_" + this.oCount);
		}

		document.getElementById(this.oPlace).insertAdjacentHTML(
				this.oShowWhere, sTemplate);
		for ( var fieldName in oTable) {
			var field = oTable[fieldName];
			if (typeof (field) != "object")
				continue;
			var sElement = document.getElementById(field.ELEMENT_NAME + "_"
					+ this.oCount);
			var soElement = document.getElementById(field.ELEMENT_NAME);
			
			if(sElement.nodeName == 'multiSelect'){
			     sElement.readOnly = soElement.readOnly;
			}
			if (sElement.tagName == "SPAN") {
				sElement.innerHTML = '';
			}else if(sElement.tagName.toUpperCase() == "TREE")
			{
				sElement.readOnly = soElement.readOnly;
			}
			 else {
				sElement.value = '';
			}
			sElement.nodeindex = this.oCount;
		}
		this.oRowsIndex.push(this.oCount);
		this.oCount = this.oCount + 1;
		return this.oCount - 1;
	},
	del : function(obj, index) {
		if (document.getElementById(this.oMajorKey + '_'
				+ this.oRowsIndex[index]).value) {
			this.oDeletedID.push(document.getElementById(this.oMajorKey + '_'
					+ this.oRowsIndex[index]).value);
		}
		document.getElementById(this.oPlace).removeChild(obj);

		this.delPageIndex(index);
	},
	delPageIndex : function(index) {
		if (isNaN(index) || index > this.oRowsIndex.length) {
			return false;
		}
		for ( var i = 0, n = 0; i < this.oRowsIndex.length; i++) {
			if (i != index) {
				this.oRowsIndex[n++] = this.oRowsIndex[i]
			}
		}
		this.oRowsIndex.length -= 1
	},
	loadData : function() {
		if (this.oCondition) {
			return this
					.syncAjaxRequest('/servlet/FormTurnServlet?tag=29&tableName='
							+ this.oTableName
							+ "&requestId="
							+ this.requestId
							+ "&isCurStaff=" + this.oCondition);
		} else {
			return this
					.syncAjaxRequest('/servlet/FormTurnServlet?tag=29&tableName='
							+ this.oTableName + "&requestId=" + this.requestId);
		}
	},
	emptyData : function() {
		for ( var fieldName in oTable) {
			var field = oTable[fieldName];
			if (typeof (field) != "object")
				continue;
			field.SET_VALUE(field.BACK_VALUE);
		}
	},

	ajaxRequest : function(url, oParam) {
		var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		var oParam = oParam || {}
		if (oParam.async) {
			oXMLHTTP.onreadystatechange = function() {
				oParam.onStateChange(oXMLHTTP)
			};
		}
		oXMLHTTP.open(oParam.method || "POST", url, oParam.async || false);
		oXMLHTTP.send(oParam.xml || "");
		if (!oParam.async) {
			return oXMLHTTP;
		}
	},
	syncAjaxRequest : function(url, oXML) {
		var oXMLHTTP = this.ajaxRequest(url, {
			xml : (oXML || null)
		});
		var xmlDoc = null;
		if (isSuccess(oXMLHTTP)) {
			xmlDoc = oXMLHTTP.responseXML;
		}
		return xmlDoc;
	},
	checkEmpty : function() {
		for ( var count = this.oRowsIndex.length - 1; count >= 0; count--) {
			var temp_staff_ele = this.oStaffIdObj ? document
					.getElementById(oTable[this.oStaffIdObj].ELEMENT_NAME + "_"
							+ this.oRowsIndex[count]) : null;
			if ((this.oIsConNotCurUser && temp_staff_ele && temp_staff_ele.value == this.oForm.globalVar.STAFF_ID)
					|| !this.oIsConNotCurUser || !this.oStaffIdObj) {
				for (fieldName in oTable) {
					var oField = oTable[fieldName];
					if (typeof (oField) != "object")
						continue;
					var sElement = document.getElementById(oField.ELEMENT_NAME
							+ "_" + this.oRowsIndex[count]);
					var sValue;
					if (sElement) {
						if (sElement.tagName == "SPAN") {
							sValue = sElement.innerHTML;
						} else {
							sValue = sElement.value;
						}
						// alert(oField.IS_REQUIRE);
						oAction = sElement.action;
					}
					// 是否要验证必填
					if (oField.IS_REQUIRE == 'T' && sElement.tagName != "SPAN") {
						if (sValue == "") {
							EMsg('"' + oField.ELEMENT_NAME_CN + '_'
									+ (count + 1) + '"不允许为空!');

							if (sElement != null) {
								try {
									sElement.focus();
								} catch (e) {
								}
							}
							return false;
						}
					}
				}
			}
		}
		return true;
	},
	getTableXML : function(isCheck) {
		var aXML = [];
		var aAttr = [ "FIELD_ID", "FIELD_TYPE", "FIELD_LENGTH", "FIELD_SCALE",
				"FIELD_FORMAT", "BACK_VALUE", "BACK_VALUE_TYPE", 
				"IS_KEY", "AUDIT_TYPE", "ELEMENT_NAME_CN"];
		var iLen = aAttr.length;
		for ( var count = this.oRowsIndex.length - 1; count >= 0; count--) {
			aXML[aXML.length] = "<TABLE NAME='" + this.oTableName + "' TYPE='"
					+ oTable["TYPE"] + "' AUDIT_TYPE='" + oTable["AUDIT_TYPE"]
					+ "'>";
			var oAction = "";
			for (fieldName in oTable) {
				var oField = oTable[fieldName];
				if (typeof (oField) != "object")
					continue;
				aXML[aXML.length] = "<" + fieldName + " ";
				for ( var i = 0; i < iLen; i++) {
					var sAtrr = aAttr[i];
					aXML[aXML.length] = sAtrr + '="' + xmlEncode(oField[sAtrr])
							+ '" ';
				}
				
				
				var sElement = document.getElementById(oField.ELEMENT_NAME
						+ "_" + this.oRowsIndex[count]);
				var sValue;
				if (sElement) {
					if (sElement.tagName == "SPAN") {
						sValue = sElement.innerHTML;
					} else {
						sValue = sElement.value;
					}
					// alert(oField.IS_REQUIRE);
					oAction = sElement.action;
				}
				// 是否要验证必填
				var temp_staff_ele = this.oStaffIdObj ? document
						.getElementById(oTable[this.oStaffIdObj].ELEMENT_NAME
								+ "_" + this.oRowsIndex[count]) : null;
				if ((this.oIsConNotCurUser && temp_staff_ele && temp_staff_ele.value == this.oForm.globalVar.STAFF_ID)
						|| !this.oIsConNotCurUser || !this.oStaffIdObj) {
					if (isCheck && oField.IS_REQUIRE == 'T') {
						if (sValue == "") {
							EMsg('"' + oField.ELEMENT_NAME_CN + '_'
									+ (count + 1) + '"不允许为空!');

							if (sElement != null) {
								try {
									sElement.focus();
								} catch (e) {
								}
							}
							return false;
						}
					}
				}

				if (this.oStaffIdObj && fieldName == this.oStaffIdObj
						&& sValue == '')
					sValue = this.oForm.globalVar.STAFF_ID;
				if (fieldName == 'REQUEST_ID'){
					sValue = this.requestId;
					oAction = sElement.action;
				}
				if (fieldName == 'FLOW_ID')
					sValue = "0";
				sValue = (oField.isRequireXMLEncode) ? xmlEncode(sValue + "")
						: sValue;
						
				if(oField["IS_KEY"]=='T'&&oAction!='E'){
					aXML[aXML.length] = 'IS_READONLY="F"'
				}else{
					aXML[aXML.length] = 'IS_READONLY="'+oField["IS_READONLY"]+'"';
				}		
				aXML[aXML.length] = " ACTION='" + oAction + "'>" + sValue
						+ "</" + fieldName + ">";
			}

			aXML[aXML.length] = "</TABLE>";
		}

		return aXML.join("");
	},
	getSaveXml : function(isCheck) {
		var tableXML = this.getTableXML(isCheck);
		if (tableXML != false || tableXML == '') {
			var sXML = '<?xml version="1.0" encoding="GBK"?>' + '<root>'
					+ '<FORM ACTION="C" PROP="A" AUDIT_TYPE="none">'
			sXML += tableXML + '</FORM>';
			if (this.oMajorKey) {
				sXML += '<DELETE>';
				sXML += '<TABLE_NAME>';
				sXML += this.oTableName;
				sXML += '</TABLE_NAME>';
				sXML += '<TABLE_FIELD>';
				var field = '';
				for ( var fieldName in oTable) {
					var field = oTable[fieldName];
					if (oTable[fieldName].ELEMENT_NAME == this.oMajorKey) {
						field = fieldName;
						break;
					}
				}
				sXML += field;
				sXML += '</TABLE_FIELD>';
				sXML += '<VALUE>';
				sXML += this.oDeletedID.join(',');
				sXML += '</VALUE>';
				sXML += '</DELETE>';
			}
			sXML += '</root>';
			return sXML;
		} else {
			return false;
		}

	},
	getSendXml : function(isCheck) {
		var saveXML = this.getSaveXml(isCheck);
		if (saveXML) {
			var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
			XMLDoc.preserveWhiteSpace = true;

			XMLDoc.loadXML(saveXML);
			return XMLDoc;
		} else {
			return false;
		}
	},
	save : function(isCheck) {

		var xmlDoc = this.getSendXml(isCheck);
		if (xmlDoc) {
			var oXMLHTTP = this.ajaxRequest(
					'/servlet/FormTurnServlet?tag=28&formId=0', {
						xml : xmlDoc
					});
			var isOK = isSuccess(oXMLHTTP);
			if (isOK) {
				// alert("保存成功");
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};
