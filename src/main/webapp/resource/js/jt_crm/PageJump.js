// xlable arr
function changeTab(xlable, arr, tab) {
	var arg = parent.Ext.getCmp("crmtabpanel").getItem(tab + "crmtab").replaceSrc;
	var newarg = "";
	switch (tab) {
		case 1 :
			newarg = Ext.urlAppend(arg, "STAT_DATE=" + arr[0].split("=")[1]
							+ "-" + xlable.substring(0, 2));
			parent.Ext.getCmp("crmtabpanel").getItem(tab + "crmtab").defaultSrc = "about:blank";
			parent.Ext.getCmp("crmtabpanel").getItem(tab + "crmtab").replaceSrc = newarg;
			parent.Ext.getCmp("crmtabpanel").setActiveTab(tab + "crmtab");
			parent.Ext.getCmp("crmtabpanel").getItem(tab + "crmtab").replaceSrc = arg;
//			parent.Ext.getCmp("crmtabpanel").getItem(tab + "crmtab").defaultSrc = newarg;
//			parent.Ext.getCmp("crmtabpanel").setActiveTab(tab + "crmtab");
			break;
		case 2 :
			var provincecode = returnDefaultPROVINCE_CODE(xlable);
			var month = arr[0].split("=")[1].split("-")[0] + "-"
					+ arr[0].split("=")[1].split("-")[1];
			newarg = Ext.urlAppend(arg, "PROVINCE_CODE=" + provincecode
							+ "&STAT_MONTH=" + month);
			parent.Ext.getCmp("crmtabpanel").getItem(tab + "crmtab").defaultSrc = "about:blank";
			parent.Ext.getCmp("crmtabpanel").getItem(tab + "crmtab").replaceSrc = newarg;
			parent.Ext.getCmp("crmtabpanel").setActiveTab(tab + "crmtab");
			parent.Ext.getCmp("crmtabpanel").getItem(tab + "crmtab").replaceSrc = arg;
			break;
		case 3 :
			break;
	}

}

function getSTAT_DATE() {
	if (getUrlParam().STAT_DATE == undefined) {
		return returnDefaultSTAT_DATE();
	} else {
		return getUrlParam().STAT_DATE;
	}
}

function getSTAT_MONTH() {
	if (getUrlParam().STAT_MONTH == undefined) {
		return returnDefaultSTAT_MONTH();
	} else {
		return getUrlParam().STAT_MONTH;
	}
}

function getPROVINCE_CODE() {
	if (getUrlParam().PROVINCE_CODE == undefined) {
		return returnDefaultPROVINCE_CODE("");
	} else {
		return getUrlParam().PROVINCE_CODE;
	}
}

function returnDefaultSTAT_DATE() {
	var sqltmp = "SELECT TO_CHAR(SYSDATE - 1, 'YYYY-MM-DD') TMP FROM DUAL";
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
	sendRequest.Open("POST", "/servlet/@Deprecated/ExecServlet?action=101&paramValue="
					+ getAESEncode(encodeURIComponent(sqltmp)), false);
	sendRequest.send();
	if (isSuccess(sendRequest)) {
		var rows = sendRequest.responseXML.selectNodes("/root/rowSet");
		for (var i = 0, row; row = rows[i]; i++) {
			return row.attributes[0].value;
		}
	}
}

function returnDefaultSTAT_MONTH() {
	var sqltmp = "SELECT TO_CHAR(SYSDATE, 'YYYY-MM') TMP FROM DUAL";
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
	sendRequest.Open("POST", "/servlet/@Deprecated/ExecServlet?action=101&paramValue="
					+ getAESEncode(encodeURIComponent(sqltmp)), false);
	sendRequest.send();
	if (isSuccess(sendRequest)) {
		var rows = sendRequest.responseXML.selectNodes("/root/rowSet");
		for (var i = 0, row; row = rows[i]; i++) {
			return row.attributes[0].value;
		}
	}
}

function returnDefaultPROVINCE_CODE(tmp) {
	var sqltmp = "";
	if (tmp != "") {
		sqltmp = "SELECT CODE AS TMP FROM (SELECT CODE CODE, REMARK TEXT FROM CODELIST WHERE CODE_TYPE = 'SFM_PALTFORM_CODE' AND MEAN = 'ʡCRMϵͳ' AND CODE NOT IN (6098010001)) X WHERE TRIM(X.TEXT) ='"
				+ tmp + "'";
	} else {
		sqltmp = "SELECT '6001020001' TMP FROM DUAL";
	}
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
	sendRequest.Open("POST", "/servlet/@Deprecated/ExecServlet?action=101&paramValue="
					+ getAESEncode(encodeURIComponent(sqltmp)), false);
	sendRequest.send();
	if (isSuccess(sendRequest)) {
		var rows = sendRequest.responseXML.selectNodes("/root/rowSet");
		for (var i = 0, row; row = rows[i]; i++) {
			return row.attributes[0].value;
		}
	}
}
