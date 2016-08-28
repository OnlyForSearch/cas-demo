var DUTY = new Object();

Ext.onReady(initExt);

function initExt() {
	DUTY.store  = new Ext.data.GroupingStore({
			proxy	: new Ext.data.XmlHttpProxy({
					url : "../../servlet/DutyAction?action=3"
				}),
			reader	: new Ext.data.XmlReader({
					record	: 'rowSet',
					id		: 'DUTY_ID'
				},["DUTY_ID","DUTY_NAME","REGION_NAME","STATE_TIME","IS_SERVICE","STAFF_NAME", {name: "REGION_ID", type: "int"}]),
			sortInfo : {field : 'DUTY_NAME', direction : "ASC"},
			groupField : 'REGION_ID'
		});
	
	
	Ext.QuickTips.init();

	DUTY.store.load();
	
	var e = document.getElementById("dutyDiv");
	DUTY.Panel = new Ext.grid.GridPanel({
			store : DUTY.store,
			columns : [
	            {header: "REGION_ID", sortable: true, dataIndex: 'REGION_ID',menuDisabled : true, hidden: true},
	            {header: "ֵ��������", sortable: true, dataIndex: 'DUTY_NAME',menuDisabled : true},
	            {header: "ֵ�೤", sortable: true, dataIndex: 'STAFF_NAME',menuDisabled : true},
	            {header: "ֵ������", sortable: true, dataIndex: 'IS_SERVICE',menuDisabled : true},
	            {header: "����", sortable: true, dataIndex: 'REGION_NAME',menuDisabled : true},
	            {header: "����Ű�ʱ��", sortable: true, dataIndex: 'STATE_TIME',menuDisabled : true}
			],
			view: new Ext.grid.GroupingView({
	            forceFit:true,
	            //groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
	            groupTextTpl: '����: {[values.rs[0].get("REGION_NAME")]}({[values.rs.length]} {["��"]})'
	        }),
			sm : new Ext.grid.RowSelectionModel({singleSelect:true}),
			tbar: [],
			
			width : e.clientWidth,
    		height : e.clientHeight,

			listeners: {
				"rowdblclick" : editDuty
			},
			
			title : "ֵ���߹���"
	});
	
	DUTY.Panel.topToolbar = new Ext.Panel({
		items: [
			new Ext.Toolbar({
				items: [{
					text:'����',
					tooltip:'����ֵ����',
					iconCls:'icon-add',
					handler:addDuty
				}, '-', {
					text:'�޸�',
					tooltip:'�޸�ֵ����',
					iconCls:'icon-text',
					handler:editDuty
				},'-',{
					text:'ɾ��',
					tooltip:'ɾ��ֵ����',
					iconCls:'icon-del',
					handler:delDuty
				},'-',{
					text:'ˢ��',
					tooltip:'ˢ��ֵ����',
					iconCls:'icon-refresh',
					handler:refreshDuty
				},'-',{
					text:'Ȩ�޷���',
					tooltip:'ֵ����Ȩ�޷���',
					iconCls:'icon-privilege',
					handler:setPrivilegeRule
				},'->',{
					text:'�Ű�',
					tooltip:'ֵ�����Ű�',
					handler:arrangDuty
				},'-',{
					text:'�����Ű�',
					tooltip:'��excel�����Ű�����',
					handler:importArrangDuty
				},'-',{
					text:'�Ű�ģ�����',
					tooltip:'�Ű�ģ�����',
					handler:arrangDutyModel
				},'-',{
					text:'ֵ���¼ģ�����ù���',
					tooltip:'ֵ���¼ģ�����ù���',
					handler:editDutyRecordModel
				}]
			}),
			  
			new Ext.Toolbar({
				items: [
				"ֵ��������:", {
					xtype:'textfield',
					width: 200, 
					id:'dutyName'
				},
				"-",
				"����:", {
					xtype: "treefield",
					name : "regionId",
					hiddenName : 'regionId',
					emptyText: '��ѡ��',
					treeHeight : 260,
					xmlUrl: '../../servlet/RegionTree?action=3&id=' + getUserRegionId(),
					anchor: '95%',
					width: 200, 
					allowBlank : true
				},
				"-",
				"ֵ������:", {
					xtype: "combo",
					store: new Ext.data.SimpleStore({
						data: [["","��������"],["0BT","����̨"],["0BF", "�Ƿ���̨"]],
						fields: ['value','text']
					}),
					triggerAction: 'all',
					emptyText: '��ѡ��',
					mode: 'local',
					valueField: 'value',
					displayField: 'text',
					id: 'isServiceCombo',
					hiddenName: 'isService',
					readOnly: true
				},"-",{
					text: "��ѯ",
					iconCls: "icon-search",
					handler: search
				}]
			})
		]
	});

	DUTY.Panel.render(e);
}

function addDuty() {
	var params = {
		action:"0"
	}
	window.showModalDialog("dutyInfo.jsp",params,'dialogWidth=600px;dialogHeight=480px;help=0;status=0;');
	refreshDuty();
}

function editDuty() {
	var row = DUTY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ�м�¼");
		return;
	}	
	
	var params = {
		action:"1",
		dutyId:row.get("DUTY_ID")
	}
	window.showModalDialog("dutyInfo.jsp",params,'dialogWidth=600px;dialogHeight=480px;help=0;status=0;');

	rowNum = DUTY.store.indexOf(row);
	refreshDuty();
	DUTY.Panel.getView().focusRow(rowNum);
}

function delRemove(row){
	
	if(this == "ok") {
		Ext.Ajax.request({
			url : "../../servlet/DutyAction?",
			success : function() {
				DUTY.store.remove(DUTY.store.getById(row.get("DUTY_ID")));
				Ext.MessageBox.alert("�ɹ�","ɾ��ֵ���߳ɹ�");
			},
			params : {action:4, id : row.get("DUTY_ID")}
		});
	}else if(this=='no'){
		var params = {
			dutyId : row.get("DUTY_ID"),
			dutyName : row.get("DUTY_NAME")
		}
		
		//�˴�Ҫȡ���ӶԻ����У����صĴ�����
		var rsType = window.showModalDialog("dutyTrun.html",params,'dialogWidth=400px;dialogHeight=220px;help=0;status=0;');
		
		if(rsType==1){
			DUTY.store.remove(DUTY.store.getById(row.get("DUTY_ID")));
		}
		
	}else if(this=='cancel'){
		//window.alert('cancel');
	}
}

function delDuty() {
	var row = DUTY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ�м�¼");
		return;
	}
	
	
	var isService = row.get('IS_SERVICE');
	if(!checkPrivilege(row.get("DUTY_ID"),'DEL')){
		Ext.Msg.alert('ϵͳ��ʾ', '�޸�ֵ���ߵ�ɾ��Ȩ��!');
		return false;
	}
	if(isService=='����̨'){
		Ext.MessageBox.show(
			{
				title:'ϵͳ��ʾ',
				msg:'��ȷ��Ҫɾ����ֵ������',
				buttons: {ok:"ȷ��",cancel:"ȡ��"},
				fn:function(btn){
					delRemove.call(btn,row);
				}
			}
		);
		
	}else if(isService=='�Ƿ���̨'){
		Ext.MessageBox.show(
			{
				title:'ϵͳ��ʾ',
				msg:'��ѡ����Ҫ���е�ɾ������',
				buttons: {ok:"ɾ��",no:"�滻��ɾ��",cancel:"ȡ��"},
				fn:function(btn){
					delRemove.call(btn,row);
				}
			}
		);
	}

	
}

// ��ѯ
function search() {
	var url = "../../servlet/DutyAction?action=3&isQuery=true";
	var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlHttp.open("POST", url, false);
   	xmlHttp.setRequestHeader("charset", "utf-8");	
	xmlHttp.send(getParamXml());

	if (isSuccess(xmlHttp)) {
		var xmlData = xmlHttp.responseXML; 	
		DUTY.store.loadData(xmlData);
	}
}

function getParamXml() {
	var sendXML='<?xml version="1.0" encoding="utf-8"?>'
		 +  '<root>'
		 +		'<param name="dutyName">' + document.getElementById("dutyName").value + '</param>'
		 +		'<param name="regionId">' + document.getElementById("regionId").value + '</param>'
		 +		'<param name="isService">' + document.getElementById("isService").value + '</param>'
		 +  '</root>';
	return sendXML;
}


function refreshDuty() {
	//DUTY.store.load();
	search();
}

function arrangDuty() {
	var row = DUTY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ�м�¼");
		return;
	}
//	if(!checkPrivilege(row.get("DUTY_ID"),'ARRANG')){
//		Ext.Msg.alert('ϵͳ��ʾ', '�޸�ֵ���ߵ��Ű�Ȩ��!');
//		return false;
//	}
	window.open("dutyArrange.html?dutyId="+row.get("DUTY_ID"),"_blank","resizable=yes,left=0,top=0,width="+screen.availWidth+"px,height="+screen.height+"px,status=0");
}

// �� excel �����Ű�����
function importArrangDuty() {
	var row = DUTY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ�м�¼");
		return;
	}
	if(!checkPrivilege(row.get("DUTY_ID"),'IMPORT_ARRANG')){
		Ext.Msg.alert('ϵͳ��ʾ', '�޸�ֵ���ߵĵ����Ű�Ȩ��!');
		return false;
	}

	var confitId = 1;
	var params = {"DUTY_ID": row.get("DUTY_ID")};
	var tip = "���ݽ�������[" + row.get("DUTY_NAME") + "]ֵ����";

	openExcelImporter(confitId, params, tip);
}

function arrangDutyModel() {
	var row = DUTY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ�м�¼");
		return;
	}
	if(!checkPrivilege(row.get("DUTY_ID"),'ARRANG_MODEL')){
		Ext.Msg.alert('ϵͳ��ʾ', '�޸�ֵ���ߵ��Ű�ģ�����Ȩ��!');
		return false;
	}
	window.open("dutyModelList.html?dutyId="+row.get("DUTY_ID"),"_blank","resizable=yes,left=0,top=0,width="+screen.availWidth+"px,height="+screen.height+"px,status=0");
}

function editDutyRecordModel() {
	var row = DUTY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ�м�¼");
		return;
	}
	if(!checkPrivilege(row.get("DUTY_ID"),'EDIT_DUTY_RECORD')){
		Ext.Msg.alert('ϵͳ��ʾ', '�޸�ֵ���ߵ�ֵ���¼ģ�����ù���Ȩ��!');
		return false;
	}
	
	window.open("dutyRecordConfig.html?dutyId="+row.get("DUTY_ID"),"_blank","resizable=yes,width=650px,height=300px,status=0");
}

// ��ȡ��ǰ��¼�û��� ����id
function getUserRegionId() {
	var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlHttp.open("POST", "../../servlet/util?OperType=6", false);
    xmlHttp.send();
    if (isSuccess(xmlHttp)) {
        return xmlHttp.responseXML.selectSingleNode("/root/region_id").text;
    }
}

//Ȩ�޷���
function setPrivilegeRule(){
	var row = DUTY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("��ʾ","û��ѡ�м�¼");
		return;
	}
	var dutyId = row.get("DUTY_ID");
	if(checkPrivilege(dutyId,'GRANT') == false && getCurrentUserInfo("staff_id")!=1){		
		Ext.Msg.alert('ϵͳ��ʾ', '��û�и�ֵ���ߵķ���Ȩ��');		
	}else{
		configTreePri('DUTY',dutyId);
	}	
}
//��֤�û��Ƿ��й����Ȩ��
function checkPrivilege(dutyId,action){	
	return hasPrivilege('DUTY',dutyId,action);	
}
