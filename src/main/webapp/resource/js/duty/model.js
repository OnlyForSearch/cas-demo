Ext.onReady(initExt);

function initExt() {
	var panel = new Ext.Panel({
		iconCls		: 'icon-grid',
		title		: "ֵ��ģ�����",
		renderTo	: modelDiv,
		width		: modelDiv.clientWidth,
		height		: modelDiv.clientHeight,
		tbar		: [{
	            text:'����Ӧ��',
	            tooltip:'����Ӧ��',
	            iconCls:'icon-add',
	            handler:addApply
	        }, '-', {
	            text:'�޸�Ӧ��',
	            tooltip:'�޸�Ӧ��',
	            iconCls:'icon-text',
	            handler:editApply
	        },'-',{
	            text:'ɾ��Ӧ��',
	            tooltip:'ɾ��Ӧ��',
	            iconCls:'icon-del',
	            handler:delApply
	        },'->',{
	        	text:'����ģ��',
	        	tooltip:'����ģ��',
	        	handler:addModel
	        },'-',{
	        	text:'�༭ģ��',
	        	tooltip:'�༭ģ��',
	        	handler:editModel
	        },'-',{
	        	text:'ɾ��ģ��',
	        	tooltip:'ɾ��ģ��',
	        	handler:delModel
	        }],
	   html			: '<IE:treeGrid id="modelGrid" skin="../../resource/js/duty/treeGrid.css" style="height:100%"></IE:treeGrid>'
	});
	
	
	var fn = function()
	{
		modelGrid.initXML = loadFieldXML();
	}
	
	fn.defer(500);
	
	modelGrid.onExpandNode = function()
	{
		var oRow = event.srcRow;
		var data = oRow.data
		var oGrid = event.grid;
		
		var oXml = new ActiveXObject("Microsoft.XMLDOM");
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.open("POST","../../servlet/DutyAction?action=34&id=" + data["DUTY_ARRANG_MODEL_ID"],false);
		xmlhttp.send();
		
		if(isSuccess(xmlhttp)) {
			oGrid.loadChild(oRow, xmlhttp.responseXML);
		}
	};
	return panel;
}

function loadFieldXML() {
	var xml = new ActiveXObject("Microsoft.XMLDOM");
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST","../../servlet/DutyAction?action=33&id=" + $request("dutyId"),false);
	xmlhttp.send();
	
	if(isSuccess(xmlhttp)) {
		xml = xmlhttp.responseXML;
	}

	return xml;
}

function addApply() {
	var row = modelGrid.getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ��Ԫ��");
		return;
	}
	
	var params = {
		action:0,
		modelId:row.data["DUTY_ARRANG_MODEL_ID"],
		modelApplyId:row.data["DUTY_ARRANG_MODEL_APPLY_ID"]
	}
	
	window.showModalDialog("modelApplyInfo.html",params,'dialogWidth=600px;dialogHeight=480px;help=0;status=0;');
	refreshModel();
}

function editApply() {
	var row = modelGrid.getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ��Ԫ��");
		return;
	}
	if(!row.data["DUTY_ARRANG_MODEL_APPLY_ID"]) {
		Ext.MessageBox.alert("��ʾ","��ѡ����Ӧ��Ӧ��");
		return;
	}
	
	var params = {
		action:1,
		modelId:row.data["DUTY_ARRANG_MODEL_ID"],
		modelApplyId:row.data["DUTY_ARRANG_MODEL_APPLY_ID"]
	}
	
	window.showModalDialog("modelApplyInfo.html",params,'dialogWidth=600px;dialogHeight=480px;help=0;status=0;');
	refreshModel();
}

function delApply() {
	var row = modelGrid.getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ��Ԫ��");
		return;
	}
	if(!row.data["DUTY_ARRANG_MODEL_APPLY_ID"]) {
		Ext.MessageBox.alert("��ʾ","��ѡ����Ӧ��Ӧ��");
		return;
	}
	
	Ext.MessageBox.confirm('ȷ��', 'ȷ��ɾ��?', function(btn) {
		if(btn == "yes") {
			Ext.Ajax.request({
				url : "../../servlet/DutyAction?",
				success : function() {
					refreshModel();
					Ext.MessageBox.alert("�ɹ�","ɾ��ģ��Ӧ�óɹ�");
				},
				params : {action:11, id : row.data["DUTY_ARRANG_MODEL_APPLY_ID"]}
			})
		}
	});
}

function refreshModel() {
	modelGrid.initXML = loadFieldXML();
}

function addModel() {
	var params = {
		dutyId:$request("dutyId")
	}
	var returnValue = window.showModalDialog("addModel.html",params,'dialogWidth=400px;dialogHeight=180px;help=0;status=0;');
	if(returnValue) {
		refreshModel();
	}
}

function editModel() {
	var row = modelGrid.getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ��Ԫ��");
		return;
	}
	if(row.data["DUTY_ARRANG_MODEL_APPLY_ID"]) {
		Ext.MessageBox.alert("��ʾ","��ѡ����Ӧ��ģ��");
		return;
	}
	
	window.open("dutyModelCustInfo.html?modelId=" + row.data["DUTY_ARRANG_MODEL_ID"],"_blank","resizable=yes,scrollbars=yes,left=0,top=0,width="+screen.availWidth+"px,height="+screen.height+"px,status=0");
}

function delModel() {
	var row = modelGrid.getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ��Ԫ��");
		return;
	}
	if(row.data["IS_PARENT"]) {
		Ext.MessageBox.alert("��ʾ","��ģ����Ӧ�ã�������ɾ��");
		return;
	}
	
	Ext.MessageBox.confirm('ȷ��', 'ȷ��ɾ��?', function(btn) {
		if(btn == "yes") {
			Ext.Ajax.request({
				url : "../../servlet/DutyAction?",
				success : function() {
					refreshModel();
					Ext.MessageBox.alert("�ɹ�","ɾ��ģ��ɹ�");
				},
				params : {action:35, id : row.data["DUTY_ARRANG_MODEL_ID"]}
			})
		}
	});
}