Ext.onReady(initExt);

function initExt() {
	var panel = new Ext.Panel({
		iconCls		: 'icon-grid',
		title		: "值班模板管理",
		renderTo	: modelDiv,
		width		: modelDiv.clientWidth,
		height		: modelDiv.clientHeight,
		tbar		: [{
	            text:'新增应用',
	            tooltip:'新增应用',
	            iconCls:'icon-add',
	            handler:addApply
	        }, '-', {
	            text:'修改应用',
	            tooltip:'修改应用',
	            iconCls:'icon-text',
	            handler:editApply
	        },'-',{
	            text:'删除应用',
	            tooltip:'删除应用',
	            iconCls:'icon-del',
	            handler:delApply
	        },'->',{
	        	text:'新增模板',
	        	tooltip:'新增模板',
	        	handler:addModel
	        },'-',{
	        	text:'编辑模板',
	        	tooltip:'编辑模板',
	        	handler:editModel
	        },'-',{
	        	text:'删除模板',
	        	tooltip:'删除模板',
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
		Ext.MessageBox.alert("提示","没有选中元素");
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
		Ext.MessageBox.alert("提示","没有选中元素");
		return;
	}
	if(!row.data["DUTY_ARRANG_MODEL_APPLY_ID"]) {
		Ext.MessageBox.alert("提示","请选择相应的应用");
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
		Ext.MessageBox.alert("提示","没有选中元素");
		return;
	}
	if(!row.data["DUTY_ARRANG_MODEL_APPLY_ID"]) {
		Ext.MessageBox.alert("提示","请选择相应的应用");
		return;
	}
	
	Ext.MessageBox.confirm('确认', '确认删除?', function(btn) {
		if(btn == "yes") {
			Ext.Ajax.request({
				url : "../../servlet/DutyAction?",
				success : function() {
					refreshModel();
					Ext.MessageBox.alert("成功","删除模板应用成功");
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
		Ext.MessageBox.alert("提示","没有选中元素");
		return;
	}
	if(row.data["DUTY_ARRANG_MODEL_APPLY_ID"]) {
		Ext.MessageBox.alert("提示","请选择相应的模板");
		return;
	}
	
	window.open("dutyModelCustInfo.html?modelId=" + row.data["DUTY_ARRANG_MODEL_ID"],"_blank","resizable=yes,scrollbars=yes,left=0,top=0,width="+screen.availWidth+"px,height="+screen.height+"px,status=0");
}

function delModel() {
	var row = modelGrid.getSelected();
	if(!row) {
		Ext.MessageBox.alert("提示","没有选中元素");
		return;
	}
	if(row.data["IS_PARENT"]) {
		Ext.MessageBox.alert("提示","该模板有应用，不允许删除");
		return;
	}
	
	Ext.MessageBox.confirm('确认', '确认删除?', function(btn) {
		if(btn == "yes") {
			Ext.Ajax.request({
				url : "../../servlet/DutyAction?",
				success : function() {
					refreshModel();
					Ext.MessageBox.alert("成功","删除模板成功");
				},
				params : {action:35, id : row.data["DUTY_ARRANG_MODEL_ID"]}
			})
		}
	});
}