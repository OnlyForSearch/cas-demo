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
	            {header: "值班线名称", sortable: true, dataIndex: 'DUTY_NAME',menuDisabled : true},
	            {header: "值班长", sortable: true, dataIndex: 'STAFF_NAME',menuDisabled : true},
	            {header: "值班类型", sortable: true, dataIndex: 'IS_SERVICE',menuDisabled : true},
	            {header: "区域", sortable: true, dataIndex: 'REGION_NAME',menuDisabled : true},
	            {header: "最后排班时间", sortable: true, dataIndex: 'STATE_TIME',menuDisabled : true}
			],
			view: new Ext.grid.GroupingView({
	            forceFit:true,
	            //groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
	            groupTextTpl: '区域: {[values.rs[0].get("REGION_NAME")]}({[values.rs.length]} {["项"]})'
	        }),
			sm : new Ext.grid.RowSelectionModel({singleSelect:true}),
			tbar: [],
			
			width : e.clientWidth,
    		height : e.clientHeight,

			listeners: {
				"rowdblclick" : editDuty
			},
			
			title : "值班线管理"
	});
	
	DUTY.Panel.topToolbar = new Ext.Panel({
		items: [
			new Ext.Toolbar({
				items: [{
					text:'新增',
					tooltip:'新增值班线',
					iconCls:'icon-add',
					handler:addDuty
				}, '-', {
					text:'修改',
					tooltip:'修改值班线',
					iconCls:'icon-text',
					handler:editDuty
				},'-',{
					text:'删除',
					tooltip:'删除值班线',
					iconCls:'icon-del',
					handler:delDuty
				},'-',{
					text:'刷新',
					tooltip:'刷新值班线',
					iconCls:'icon-refresh',
					handler:refreshDuty
				},'-',{
					text:'权限分配',
					tooltip:'值班线权限分配',
					iconCls:'icon-privilege',
					handler:setPrivilegeRule
				},'->',{
					text:'排班',
					tooltip:'值班线排班',
					handler:arrangDuty
				},'-',{
					text:'导入排班',
					tooltip:'从excel导入排班数据',
					handler:importArrangDuty
				},'-',{
					text:'排班模板管理',
					tooltip:'排班模板管理',
					handler:arrangDutyModel
				},'-',{
					text:'值班记录模板配置管理',
					tooltip:'值班记录模板配置管理',
					handler:editDutyRecordModel
				}]
			}),
			  
			new Ext.Toolbar({
				items: [
				"值班线名称:", {
					xtype:'textfield',
					width: 200, 
					id:'dutyName'
				},
				"-",
				"区域:", {
					xtype: "treefield",
					name : "regionId",
					hiddenName : 'regionId',
					emptyText: '请选择',
					treeHeight : 260,
					xmlUrl: '../../servlet/RegionTree?action=3&id=' + getUserRegionId(),
					anchor: '95%',
					width: 200, 
					allowBlank : true
				},
				"-",
				"值班类型:", {
					xtype: "combo",
					store: new Ext.data.SimpleStore({
						data: [["","所有类型"],["0BT","服务台"],["0BF", "非服务台"]],
						fields: ['value','text']
					}),
					triggerAction: 'all',
					emptyText: '请选择',
					mode: 'local',
					valueField: 'value',
					displayField: 'text',
					id: 'isServiceCombo',
					hiddenName: 'isService',
					readOnly: true
				},"-",{
					text: "查询",
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
		Ext.MessageBox.alert("提示","没有选中记录");
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
				Ext.MessageBox.alert("成功","删除值班线成功");
			},
			params : {action:4, id : row.get("DUTY_ID")}
		});
	}else if(this=='no'){
		var params = {
			dutyId : row.get("DUTY_ID"),
			dutyName : row.get("DUTY_NAME")
		}
		
		//此处要取得子对话框中，返回的处理结果
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
		Ext.MessageBox.alert("提示","没有选中记录");
		return;
	}
	
	
	var isService = row.get('IS_SERVICE');
	if(!checkPrivilege(row.get("DUTY_ID"),'DEL')){
		Ext.Msg.alert('系统提示', '无该值班线的删除权限!');
		return false;
	}
	if(isService=='服务台'){
		Ext.MessageBox.show(
			{
				title:'系统提示',
				msg:'您确认要删除该值班线吗？',
				buttons: {ok:"确认",cancel:"取消"},
				fn:function(btn){
					delRemove.call(btn,row);
				}
			}
		);
		
	}else if(isService=='非服务台'){
		Ext.MessageBox.show(
			{
				title:'系统提示',
				msg:'请选择您要进行的删除操作',
				buttons: {ok:"删除",no:"替换并删除",cancel:"取消"},
				fn:function(btn){
					delRemove.call(btn,row);
				}
			}
		);
	}

	
}

// 查询
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
		Ext.MessageBox.alert("提示","没有选中记录");
		return;
	}
//	if(!checkPrivilege(row.get("DUTY_ID"),'ARRANG')){
//		Ext.Msg.alert('系统提示', '无该值班线的排班权限!');
//		return false;
//	}
	window.open("dutyArrange.html?dutyId="+row.get("DUTY_ID"),"_blank","resizable=yes,left=0,top=0,width="+screen.availWidth+"px,height="+screen.height+"px,status=0");
}

// 从 excel 导入排班数据
function importArrangDuty() {
	var row = DUTY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("提示","没有选中记录");
		return;
	}
	if(!checkPrivilege(row.get("DUTY_ID"),'IMPORT_ARRANG')){
		Ext.Msg.alert('系统提示', '无该值班线的导入排班权限!');
		return false;
	}

	var confitId = 1;
	var params = {"DUTY_ID": row.get("DUTY_ID")};
	var tip = "数据将导入至[" + row.get("DUTY_NAME") + "]值班线";

	openExcelImporter(confitId, params, tip);
}

function arrangDutyModel() {
	var row = DUTY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("提示","没有选中记录");
		return;
	}
	if(!checkPrivilege(row.get("DUTY_ID"),'ARRANG_MODEL')){
		Ext.Msg.alert('系统提示', '无该值班线的排班模版管理权限!');
		return false;
	}
	window.open("dutyModelList.html?dutyId="+row.get("DUTY_ID"),"_blank","resizable=yes,left=0,top=0,width="+screen.availWidth+"px,height="+screen.height+"px,status=0");
}

function editDutyRecordModel() {
	var row = DUTY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("提示","没有选中记录");
		return;
	}
	if(!checkPrivilege(row.get("DUTY_ID"),'EDIT_DUTY_RECORD')){
		Ext.Msg.alert('系统提示', '无该值班线的值班记录模板配置管理权限!');
		return false;
	}
	
	window.open("dutyRecordConfig.html?dutyId="+row.get("DUTY_ID"),"_blank","resizable=yes,width=650px,height=300px,status=0");
}

// 获取当前登录用户的 区域id
function getUserRegionId() {
	var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlHttp.open("POST", "../../servlet/util?OperType=6", false);
    xmlHttp.send();
    if (isSuccess(xmlHttp)) {
        return xmlHttp.responseXML.selectSingleNode("/root/region_id").text;
    }
}

//权限分配
function setPrivilegeRule(){
	var row = DUTY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("提示","没有选中记录");
		return;
	}
	var dutyId = row.get("DUTY_ID");
	if(checkPrivilege(dutyId,'GRANT') == false && getCurrentUserInfo("staff_id")!=1){		
		Ext.Msg.alert('系统提示', '您没有该值班线的分配权限');		
	}else{
		configTreePri('DUTY',dutyId);
	}	
}
//验证用户是否有规则的权限
function checkPrivilege(dutyId,action){	
	return hasPrivilege('DUTY',dutyId,action);	
}
