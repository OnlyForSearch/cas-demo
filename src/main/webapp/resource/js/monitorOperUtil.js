$import("monitorEvent.js", "monitorOperUtil.js");
var actionFlag = "edit";
var ruleType = ["alarmShieldRule","alarmTitleRule","alarmRepeatRule","alarmUpgradeRule","alarmDispatchRule","alarmNotifyRule","alarmSendRule","alarmRelevanceShieldRule","prefThresholdRule","alarmRootCauseRule","alarmTriggerRule"];
//�¼��ɷ�����   �ɵ���ĵ�Ԫ���fieldName�������ĸ�����
//�Զ��屨������ṩ�����ֶΣ�SERVICE_ID��LOGIC_DATA_GATHER_ID��AUDIT_FORMULA_ID��SHIELD_RULE_ID��NOTIFY_RULE_ID��DISPATCH_RULE_ID
function eventDispatcher(grid, rowIndex, columnIndex, e){
    var record = grid.getStore().getAt(rowIndex);
    var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
    var params = new Array();
    //����from��ʾ��������ҵ������ά
    params.push("reqFrom=operInterface");
    if(fieldName.toUpperCase()=='SERVICE_NAME')//���"�ɼ���������"����JDBC�ɼ����ô���
    {
    	params.push("serviceId=" + record.get('SERVICE_ID'));
    	params.push("logObjName=" + record.get('SERVICE_NAME'));
    	params.push("username=admin");
    	window.showModelessDialog('http://134.96.93.182:7001/ah_flow_entrance_jdbc2.jsp?' + params.join("&"), '', 'dialogWidth=778px;dialogHeight=500px;help=0;scroll=1;status=0');
    }
    else if(fieldName.toUpperCase()=='SUBJECT')//���"���˱�������"����ҵ���߼��������ݲɼ���Ϣ����
    {
    	params.pop();
      	params.push('logicdatagatherid='+record.get('LOGIC_DATA_GATHER_ID'));
      	params.push('logObjName='+record.get('SUBJECT'));
      	params.push("reqFrom=operInterface");
    	window.showModalDialog('/workshop/logicaudit/updatelogicdatagather.jsp?' + params.join("&"),params,'resizable=yes;dialogWidth=778px;dialogHeight=620px;help=0;scroll=0;status=0;');
    }
    else if(fieldName.toUpperCase()=='FORMULA_DESC')//���"���˹�ʽ"����ҵ���߼��������򴰿�
    {
    	params.push('ruleId='+record.get('AUDIT_FORMULA_ID'));
    	params.push('logObjName='+record.get('SUBJECT'));
    	window.showModalDialog('/workshop/logicaudit/auditAnalyzeInfo.jsp?' + params.join("&"),'','dialogwidth:650px;dialogheight:480px;status:no;help:no;resizable:yes;scroll=0;');
    }
    else if(fieldName.toUpperCase()=='DISPATCH_STAFF') //���"����������"�����ɵ����򴰿�
    {
    	params.push('ruleType=' + ruleType[4]);
    	params.push('ruleId=' + record.get('DISPATCH_RULE_ID'));
    	params.push('logObjName='+record.get('SUBJECT'));
    	window.showModalDialog('/workshop/operInterface/alarmRuleMain.html?' + params.join("&"),'','dialogwidth:950px;dialogheight:450px;status:no;help:no;resizable:yes;scroll=0;');
    }
    else if(fieldName.toUpperCase()=='NOTIFY_STAFF') //���"���Ž�����"����֪ͨ���򴰿�
    {
    	params.push('ruleType=' + ruleType[5]);
    	params.push('ruleId=' + record.get('NOTIFY_RULE_ID'));
    	params.push('logObjName='+record.get('SUBJECT'));
    	window.showModalDialog('/workshop/operInterface/alarmRuleMain.html?' + params.join("&"),'','dialogwidth:950px;dialogheight:450px;status:no;help:no;resizable:yes;scroll=0;');
    }
    else if(fieldName.toUpperCase()=='IS_SHIELD') //���"�Ƿ�����"�����澯���ι��򴰿�
    {
    	params.push('ruleType=' + ruleType[0]);
    	params.push('ruleId=' + record.get('SHIELD_RULE_ID'));
    	params.push('logObjName='+record.get('SUBJECT'));
    	window.showModalDialog('/workshop/operInterface/alarmRuleMain.html?' + params.join("&"),'','dialogwidth:950px;dialogheight:450px;status:no;help:no;resizable:yes;scroll=0;');
    }
}