function auditAlarm(grid) {
	var selectionModel = grid.getSelectionModel(); 
	if(selectionModel.getSelected()){
		var selections = selectionModel.getSelections();
		var alarmid = "";
		var type_ = "G";
		for(var i=0;i<selections.length;i++){
			alarmid += selections[i].get("对象ID") + ",";
		}
		type_ = selections[0].get("审核类型");
		
		
		var arr = new Array();
		arr.push(alarmid);
		arr.push(type_);
		window.showModalDialog("/workshop/alarmManage/alarmAuditSubmit.html",arr,"resizable=yes;dialogWidth=560px;dialogHeight=300px;help=0;scroll=0;status=0;");
		grid.search();
	}else{
		Ext.Msg.getDialog().setWidth(500);
		Ext.MessageBox.alert("提示","请至少选中一条记录，谢谢！");
	}
}
var obj = new Array();

function runFlow(grid) {
	var selectionModel = grid.getSelectionModel(); 
	if(selectionModel.getSelected()){
		obj.alarmid = "";
		obj.type_ = "G";
		var status_ = "";
		var selections = selectionModel.getSelections();
		for(var i=0;i<selections.length;i++){
			obj.alarmid += selections[i].get("对象ID") + ",";
			status_ = selections[i].get("审核状态");
			
			if(status_=='待双中心审核'){
			   Ext.MessageBox.alert("提示","选中的记录中有没有进行审批的记录，请进行审批");
			   return;
			}
		}
		obj.type_ = selections[0].get("审核类型");
		window.showModalDialog("/workshop/form/index.jsp?flowMod=4537",obj,"dialogWidth=1024px;dialogHeight=768px;help=0;scroll=1;status=0;resizable=yes;");
	}else{
		Ext.Msg.getDialog().setWidth(500);
		Ext.MessageBox.alert("提示","请至少选中一条记录，谢谢！");
	}
}

function inportExcel(grid)
{
	window.showModalDialog("/workshop/alarmManage/eva_ImportExcel.html?",parent.flow_id,"resizable=yes;dialogWidth=700px;dialogHeight=100px;help=0;scroll=0;status=0;");
	grid.search();
}