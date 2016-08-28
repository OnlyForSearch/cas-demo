var CALLBACK_RULE_APPLY = new Object();
var CALLBACK_RESULT	= new Object();

function initExt() {
	CALLBACK_RULE_APPLY.store  = new Ext.data.GroupingStore({
			proxy	: new Ext.data.XmlHttpProxy({
					url : "../../../servlet/EvaluationAction?action=116" + "&batchId=" + document.getElementById("oBatchId").value
				}),
			reader	: new Ext.data.XmlReader({
					record	: 'rowSet',
					id		: 'CALLBACK_RULE_APPLY_ID'
				},["CALLBACK_RULE_APPLY_ID","RULE_NAME","REGION_NAME","BUSI_NAME","TIME_RANGE"]),
			sortInfo : {field : 'CALLBACK_RULE_APPLY_ID', direction : "ASC"},
			groupField:'RULE_NAME'
		});
		
	CALLBACK_RULE_APPLY.store.on('load', function() {
	    CALLBACK_RULE_APPLY.Panel.el.select("table[class=x-grid3-row-table]").each(function(x) {
	        x.addClass('x-grid3-cell-text-visible');
	    });
	});	
	
	Ext.QuickTips.init();
	
	var e = document.getElementById("callbackRuleApplyDiv");
	CALLBACK_RULE_APPLY.Panel = new Ext.grid.GridPanel({
			store : CALLBACK_RULE_APPLY.store,
			columns : [
	            {header: "规则名称", sortable: true, dataIndex: 'RULE_NAME',menuDisabled : true,width:150},
	            {header: "区域", sortable: true, dataIndex: 'REGION_NAME',menuDisabled : true,width:150},
	            {header: "业务", sortable: true, dataIndex: 'BUSI_NAME',menuDisabled : true,width:300},
	            {id:'timeRange',header: "时间段", sortable: true, dataIndex: 'TIME_RANGE',menuDisabled : true}
			],
			sm : new Ext.grid.RowSelectionModel({singleSelect:true}),
			tbar:[{
	            text:'新增',
	            tooltip:'新增回调规则应用',
	            iconCls:'icon-add',
	            handler:addRule
	        }, '-', {
	            text:'修改',
	            tooltip:'修改回调规则应用',
	            iconCls:'icon-text',
	            handler:editRule
	        },'-',{
	            text:'删除',
	            tooltip:'删除回调规则应用',
	            iconCls:'icon-del',
	            handler:delRule
	        },'-',{
	            text:'刷新',
	            tooltip:'刷新回调规则应用',
	            iconCls:'icon-refresh',
	            handler:refreshRule
	        },'->',{
	        	text:'预览回调结果',
	        	tooltip:'预览规则',
	        	handler:previewRule
	        },'-',{
	        	text:'应用回调结果',
	        	tooltip:'应用规则',
	        	handler:applyRule
	        }],
	        view: new Ext.grid.GroupingView({
	            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
	        }),
			autoExpandColumn: 'timeRange',
			width : e.clientWidth,
    		height : e.clientHeight,
			title : "考核分数回调规则应用管理",
			renderTo: e
	});
	
	CALLBACK_RULE_APPLY.store.load();
}

function addRule() {
	var params = {
		action : "0",
		batchId : document.getElementById("oBatchId").value,
		month : getCallbackMonth()
	}
	if(params.month) {
		window.showModalDialog("../../evaluation/applyCallbackRule.html",params,'dialogWidth=650px;dialogHeight=600px;help=0;status=0;');
		refreshRule();
	}
}

function editRule() {
	var row = CALLBACK_RULE_APPLY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("提示","没有选中记录");
		return;
	}
	
	var params = {
		action:"1",
		applyId:row.get("CALLBACK_RULE_APPLY_ID"),
		month : getCallbackMonth()
	}
	if(params.month) {
		window.showModalDialog("../../evaluation/applyCallbackRule.html",params,'dialogWidth=650px;dialogHeight=600px;help=0;status=0;');
		refreshRule();
	}
}

function getCallbackMonth() {
	var month = document.getElementById("oCallbackMonth").value;
	if(month == "") {
		Ext.MessageBox.alert("提示","请先选择要回调的月份");
		oCallbackMonth.focus();
		return;
	}
	
	return month;
}

function delRule() {
	var row = CALLBACK_RULE_APPLY.Panel.getSelectionModel().getSelected();
	if(!row) {
		Ext.MessageBox.alert("提示","没有选中记录");
		return;
	}
	
	Ext.MessageBox.confirm('确认', '确认删除?', function(btn) {
		if(btn == "yes") {
			Ext.Ajax.request({
				url : "../../../servlet/EvaluationAction?",
				success : function() {
					CALLBACK_RULE_APPLY.store.remove(CALLBACK_RULE_APPLY.store.getById(row.get("CALLBACK_RULE_APPLY_ID")))
					Ext.MessageBox.alert("成功","删除回调规则成功");
				},
				params : {action:115, applyId : row.get("CALLBACK_RULE_APPLY_ID")}
			})
		}
	});
}

function refreshRule() {
	CALLBACK_RULE_APPLY.store.load();
}

function previewRule() {
	if(CALLBACK_RULE_APPLY.store.getTotalCount() == 0) {
		Ext.MessageBox.alert("提示","没有应用任何规则！");
		return false;
	}
	
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST","../../../servlet/EvaluationAction?action=126&batchId=" + document.getElementById("oBatchId").value, false);
	xmlhttp.send();
	
	if(isSuccess(xmlhttp)) {
		CALLBACK_RESULT.store.load();
	}
	
	return true;
}

function applyRule() {
	if(previewRule()) {
		disableToolbar();
	}
}

function loadCallbackData() {
	CALLBACK_RESULT.store.load();
	disableToolbar();
}

function disableToolbar() {
	CALLBACK_RULE_APPLY.Panel.getTopToolbar().disable();
}

function initCallbackResult() {
	CALLBACK_RESULT.store  = new Ext.data.Store({
			proxy	: new Ext.data.XmlHttpProxy({
					url : "../../../servlet/EvaluationAction?action=118" + "&batchId=" + document.getElementById("oBatchId").value
				}),
			reader	: new Ext.data.XmlReader({
					record	: 'rowSet'
				},["EVA_KPI_NAME","EVA_KPI_WEIGHT","SOURCE_BEGIN_DATE","SOURCE_END_DATE","SCORE","VALUE","EVA_FORMULA_DATA","EVA_FORMULA_DESC","SCORE_FORMULA","AUTO_CALLBACK","CALLBACK_SCORE"])
		});
		
	var e = document.getElementById("callbackResultDiv");
	CALLBACK_RESULT.Panel = new Ext.grid.GridPanel({
			store : CALLBACK_RESULT.store,
			columns : [
	            {header: "指标名称", sortable: true, dataIndex: 'EVA_KPI_NAME',menuDisabled : true},
	            {header: "权重", sortable: true, dataIndex: 'EVA_KPI_WEIGHT',menuDisabled : true},
	            {header: "回调开始时间", sortable: true, dataIndex: 'SOURCE_BEGIN_DATE',menuDisabled : true},
	            {header: "回调结束时间", sortable: true, dataIndex: 'SOURCE_END_DATE',menuDisabled : true},
	            {header: "得分", sortable: true, dataIndex: 'SCORE',menuDisabled : true},
	            {header: "考核值", sortable: true, dataIndex: 'VALUE',menuDisabled : true},
	            {header: "回调分数", sortable: true, dataIndex: 'AUTO_CALLBACK',menuDisabled : true},
	            {header: "回调后得分", sortable: true, dataIndex: 'CALLBACK_SCORE',menuDisabled : true},
	            {header: "计算公式数据构成", sortable: true, dataIndex: 'EVA_FORMULA_DATA',menuDisabled : true},
	            {header: "计算公式", sortable: true, dataIndex: 'EVA_FORMULA_DESC',menuDisabled : true},
	            {header: "得分计算公式", sortable: true, dataIndex: 'SCORE_FORMULA',menuDisabled : true}
			],
			sm : new Ext.grid.RowSelectionModel({singleSelect:true}),
	        viewConfig :{
	        	forceFit:true
	        },
			width : e.clientWidth,
    		height : e.clientHeight,
			title : "考核分数回调结果",
			renderTo: e
	});
}