$import("monitorEvent.js", "monitorOperUtil.js");
var actionFlag = "edit";
var ruleType = ["alarmShieldRule","alarmTitleRule","alarmRepeatRule","alarmUpgradeRule","alarmDispatchRule","alarmNotifyRule","alarmSendRule","alarmRelevanceShieldRule","prefThresholdRule","alarmRootCauseRule","alarmTriggerRule"];
//事件派发函数   由点击的单元格的fieldName决定打开哪个窗口
//自定义报表必须提供以下字段：SERVICE_ID、LOGIC_DATA_GATHER_ID、AUDIT_FORMULA_ID、SHIELD_RULE_ID、NOTIFY_RULE_ID、DISPATCH_RULE_ID
function eventDispatcher(grid, rowIndex, columnIndex, e){
    var record = grid.getStore().getAt(rowIndex);
    var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
    var params = new Array();
    //参数from表示请求来自业务监控运维
    params.push("reqFrom=operInterface");
    if(fieldName.toUpperCase()=='SERVICE_NAME')//点击"采集任务名称"弹出JDBC采集配置窗口
    {
    	params.push("serviceId=" + record.get('SERVICE_ID'));
    	params.push("logObjName=" + record.get('SERVICE_NAME'));
    	params.push("username=admin");
    	window.showModelessDialog('http://134.96.93.182:7001/ah_flow_entrance_jdbc2.jsp?' + params.join("&"), '', 'dialogWidth=778px;dialogHeight=500px;help=0;scroll=1;status=0');
    }
    else if(fieldName.toUpperCase()=='SUBJECT')//点击"稽核报表名称"弹出业务逻辑分析数据采集信息窗口
    {
    	params.pop();
      	params.push('logicdatagatherid='+record.get('LOGIC_DATA_GATHER_ID'));
      	params.push('logObjName='+record.get('SUBJECT'));
      	params.push("reqFrom=operInterface");
    	window.showModalDialog('/workshop/logicaudit/updatelogicdatagather.jsp?' + params.join("&"),params,'resizable=yes;dialogWidth=778px;dialogHeight=620px;help=0;scroll=0;status=0;');
    }
    else if(fieldName.toUpperCase()=='FORMULA_DESC')//点击"稽核公式"弹出业务逻辑分析规则窗口
    {
    	params.push('ruleId='+record.get('AUDIT_FORMULA_ID'));
    	params.push('logObjName='+record.get('SUBJECT'));
    	window.showModalDialog('/workshop/logicaudit/auditAnalyzeInfo.jsp?' + params.join("&"),'','dialogwidth:650px;dialogheight:480px;status:no;help:no;resizable:yes;scroll=0;');
    }
    else if(fieldName.toUpperCase()=='DISPATCH_STAFF') //点击"工单接收人"弹出派单规则窗口
    {
    	params.push('ruleType=' + ruleType[4]);
    	params.push('ruleId=' + record.get('DISPATCH_RULE_ID'));
    	params.push('logObjName='+record.get('SUBJECT'));
    	window.showModalDialog('/workshop/operInterface/alarmRuleMain.html?' + params.join("&"),'','dialogwidth:950px;dialogheight:450px;status:no;help:no;resizable:yes;scroll=0;');
    }
    else if(fieldName.toUpperCase()=='NOTIFY_STAFF') //点击"短信接收人"弹出通知规则窗口
    {
    	params.push('ruleType=' + ruleType[5]);
    	params.push('ruleId=' + record.get('NOTIFY_RULE_ID'));
    	params.push('logObjName='+record.get('SUBJECT'));
    	window.showModalDialog('/workshop/operInterface/alarmRuleMain.html?' + params.join("&"),'','dialogwidth:950px;dialogheight:450px;status:no;help:no;resizable:yes;scroll=0;');
    }
    else if(fieldName.toUpperCase()=='IS_SHIELD') //点击"是否屏蔽"弹出告警屏蔽规则窗口
    {
    	params.push('ruleType=' + ruleType[0]);
    	params.push('ruleId=' + record.get('SHIELD_RULE_ID'));
    	params.push('logObjName='+record.get('SUBJECT'));
    	window.showModalDialog('/workshop/operInterface/alarmRuleMain.html?' + params.join("&"),'','dialogwidth:950px;dialogheight:450px;status:no;help:no;resizable:yes;scroll=0;');
    }
}