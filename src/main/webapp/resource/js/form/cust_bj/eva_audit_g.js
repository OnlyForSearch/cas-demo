function auditAlarm(grid) {
	var selectionModel = grid.getSelectionModel(); 
	if(selectionModel.getSelected()){
		var selections = selectionModel.getSelections();
		var alarmid = "";
		var type_ = "G";
		for(var i=0;i<selections.length;i++){
			alarmid += selections[i].get("����ID") + ",";
		}
		type_ = selections[0].get("�������");
		
		
		var arr = new Array();
		arr.push(alarmid);
		arr.push(type_);
		window.showModalDialog("/workshop/alarmManage/alarmAuditSubmit.html",arr,"resizable=yes;dialogWidth=560px;dialogHeight=300px;help=0;scroll=0;status=0;");
		grid.search();
	}else{
		Ext.Msg.getDialog().setWidth(500);
		Ext.MessageBox.alert("��ʾ","������ѡ��һ����¼��лл��");
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
			obj.alarmid += selections[i].get("����ID") + ",";
			status_ = selections[i].get("���״̬");
			
			if(status_=='��˫�������'){
			   Ext.MessageBox.alert("��ʾ","ѡ�еļ�¼����û�н��������ļ�¼�����������");
			   return;
			}
		}
		obj.type_ = selections[0].get("�������");
		window.showModalDialog("/workshop/form/index.jsp?flowMod=4537",obj,"dialogWidth=1024px;dialogHeight=768px;help=0;scroll=1;status=0;resizable=yes;");
	}else{
		Ext.Msg.getDialog().setWidth(500);
		Ext.MessageBox.alert("��ʾ","������ѡ��һ����¼��лл��");
	}
}

function inportExcel(grid)
{
	window.showModalDialog("/workshop/alarmManage/eva_ImportExcel.html?",parent.flow_id,"resizable=yes;dialogWidth=700px;dialogHeight=100px;help=0;scroll=0;status=0;");
	grid.search();
}