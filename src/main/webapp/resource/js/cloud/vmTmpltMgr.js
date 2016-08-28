var paramObj = window.dialogArguments;
var oldCatalog;
var taskEnd = false;
var hasClickedDel = false;
function initPage() {
	loadData();
	
	if(paramObj.isDel) {
		saveBtn.style.display = "none";
		catalogBtn.style.display = "none";
		scriptBtn.style.display = "none";
		delBtn.style.display = "";
		hasClickedDel = true;
		delBtn.click();
	}
}

function loadData() {
	vmTmpltName.value = paramObj.instanceName;

	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("GET","/servlet/VMResDispatchAction?action=33&instanceId="+paramObj.instanceId,false);
	xmlhttp.send();
	
	if(isSuccess(xmlhttp)) {
		vmTmpltCatalog.value = xmlhttp.responseXML.selectSingleNode("/root/result/CATALOG_ID").text;
		oldCatalog = vmTmpltCatalog.value;
		vmScript.value = xmlhttp.responseXML.selectSingleNode("/root/result/SCRIPT_ID").text;
		vmScriptName.value = xmlhttp.responseXML.selectSingleNode("/root/result/SCRIPT_NAME").text;
		vmDescription.value = xmlhttp.responseXML.selectSingleNode("/root/result/DESCRIPTION").text;
	}
}

function saveAction() {
	var paramArray = new Array();
	paramArray.push("action="+34);
	paramArray.push("instanceId=" + paramObj.instanceId);
	paramArray.push("catalogId=" + vmTmpltCatalog.value);
	paramArray.push("scriptId=" + vmScript.value);
	paramArray.push("description=" + encodeURIComponent(vmDescription.value))
	
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("GET","/servlet/VMResDispatchAction?"+paramArray.join("&"),false);
	xmlhttp.send();
	
	if(isSuccess(xmlhttp)) {
		MMsg("保存成功！");
		if(oldCatalog != vmTmpltCatalog.value) {//如果分类改变了，需要刷新列表
			window.returnValue = "OK";
		}
		window.close();
	}
}

function delAction() {
	delBtn.disabled = true;
	if(QMsg("确认删除该虚机模板吗？")==MSG_YES) {
		var paramArray = new Array();
		paramArray.push("action=" + 12);
		paramArray.push("instanceId=" + paramObj.instanceId);
		paramArray.push("vmname=" + encodeURIComponent(paramObj.instanceName));
		
	    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.onreadystatechange = function() {
			if(xmlhttp.readyState == 4) {
				cloudTask.hiddenWait();
			    if(isSuccess(xmlhttp)) {
				    var taskId = xmlhttp.responseXML.selectSingleNode("root/result").text;
				    var task = new cloudTask.TaskLoader(taskId,delLocal,onError);
			    } else {
			    	taskEnd = true;
			    }
	    	}
		};
		xmlhttp.open("GET","/servlet/VMHostControl?" + paramArray.join("&"),true);
		xmlhttp.send();
		
		cloudTask.showWait();
	}
}

function delLocal() {
	taskEnd = true;
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var paramArray = new Array();
	paramArray.push("action="+32);
	paramArray.push("instanceId="+paramObj.instanceId);
	
	xmlhttp.open("GET","/servlet/VMHostControl?" + paramArray.join("&"),false);
	xmlhttp.send();
	
	if(isSuccess(xmlhttp)) {
		MMsg("删除成功!");
		window.returnValue = "OK";
		window.close();
	}
}

function onError() {
	taskEnd = true;
	EMsg("调用VC执行虚拟机转成模板操作失败，错误信息见详细信息或联系云管理员!");
}

window.onbeforeunload = function()  {
    //如果已经点击保存且任务尚未结束，提示不能关闭
    if (hasClickedDel && !taskEnd) {
        window.event.returnValue = "任务未完成不能关闭窗口，您确定要关闭么？";
    }
}

function catalogAction() {
	var dialogsFeatures = "dialogWidth=800px;dialogHeight=600px;help=0;scroll=0;status=0;"
    //window.open("../../../cloud/vmTemplateCatalog.html")
	window.showModalDialog("/workshop/cloud/vmTemplateCatalog.html",{},dialogsFeatures);
}

function scriptAction() {
	var dialogsFeatures = "dialogWidth=800px;dialogHeight=600px;help=0;scroll=0;status=0;"
    window.showModalDialog("/workshop/execscript/exec_script_list.html?scriptType=4",null,dialogsFeatures);
}

function inArray(arr, o) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == o)
			return true
	}
	return false;
}
arrayUtil = function() {
}
arrayUtil.map = function(array, destFunction) {
	if (array == null)
		return
	this.forceBreak = false
	ret = []
	for (var i = 0; i < array.length; i++) {
		if (this.forceBreak)
			break
		ret[i] = destFunction(array[i])
	}
	return ret
}
arrayUtil.map2 = function(array, destFunction) {
	if (array == null)
		return
	this.forceBreak = false
	ret = []
	for (var i = 0; i < array.length; i++) {
		if (this.forceBreak)
			break
		ret[i] = destFunction(i, array[i])
	}
	return ret
}

function scriptMapping() {
	$('select').hide()
	var selectedValue = $('#vmScript').val() // 1,2,3...
	if(selectedValue != '' && selectedValue != null){
		selectedValue = selectedValue.split(',')
	}else{
		selectedValue = []
	}
	if(true){ // 修改bug 每次创建新对话框
		var swd   = new dlg.TwoWayDialog({
			title : '选择脚本',
			name : 'scriptSelectDiv',    // 生成控件的id, 随便输不重复就行
			selectFrom : 'scriptSelectFrom', // 生成控件的id, 随便输不重复就行
			selectTo : 'scriptSelectTo',   // 生成控件的id, 随便输不重复就行
			nameSql :  'select nvl(a.exec_name_cn,a.exec_name) text from exec_script a where a.script_type=4 order by nvl(a.exec_name_cn,a.exec_name)', 
			idSql: 'select a.exec_script_id text from exec_script a where a.script_type=4 order by nvl(a.exec_name_cn,a.exec_name)',
			onOk : function(selected){
				var names = []
				var ids = []
				arrayUtil.map(selected, function(e){
					names.push(e.name)
					ids.push(e.id)
				})
				names = names.join(',')
				ids = ids.join(',')
				vmScript.value = ids
				vmScriptName.value = names
			},
			selected : selectedValue
		})
	}
	$("#scriptSelectDiv").bind("dialogclose", function() {
		$('select').show();
	});
	// 显示对话框
	swd.open()
}

function editVMTmplt(grid) {
	var row = grid.getSelectionModel().getSelected();

	if (typeof(row) == 'undefined') {
		EMsg("请先选择一条记录!");
		return false;
	}

	var paramObj = {};
	paramObj.instanceId = row.get("INSTANCE_ID");
	paramObj.instanceName = row.get("SHORT_DESCRIPTION");
	
	var dialogsFeatures = "dialogWidth=600px;dialogHeight=200px;help=0;scroll=1;status=0;"
    var returnVal = window.showModalDialog("/workshop/cloud/vmTemplateInfo.jsp",paramObj,dialogsFeatures);
    if(returnVal == "OK") {
    	grid.search();
    }
    return false;
}

function delVMTmplt(grid) {
	
	var row = grid.getSelectionModel().getSelected();
	
	if (typeof(row) == 'undefined') {
		EMsg("请先选择一条记录!");
		return;
	} 
	var paramObj = {};
	paramObj.instanceId = row.get("INSTANCE_ID");
	paramObj.instanceName = row.get("SHORT_DESCRIPTION");
	paramObj.isDel = true;
	
	var dialogsFeatures = "dialogWidth=600px;dialogHeight=300px;help=0;scroll=1;status=0;"
	var returnVal = window.showModalDialog("/workshop/cloud/vmTemplateInfo.jsp",paramObj,dialogsFeatures);
	if(returnVal == "OK") {
		grid.search();
	}
}
