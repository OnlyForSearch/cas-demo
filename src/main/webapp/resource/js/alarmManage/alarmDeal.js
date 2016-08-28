var AlarmGridHandler = (function()
{
	var alarmManageUrl = "/workshop/alarmManage/";
	var defaultFeatures = "dialogWidth=40;dialogHeight=60;help=0;scroll=0;status=0;";
	var alarm_no_work =10;    // ״̬��δ�ɵ� -- δȷ�ϡ�δ���
	var alarm_clean = 40;     // ״̬���� �� -- δȷ�ϡ������
	var alarm_ack = 32;       // ״̬��ȷ �� -- ��ȷ�ϡ�δ���
	var alarm_end=31;         // ״̬���� �� -- ��ȷ�ϡ������
	var alarm_process_wait=30;// ״̬��������
	
	
	var alarm_state_no_clear = 0  ; // �澯״̬��δ���
	var alarm_state_clear    = 1  ; // �澯״̬�������
	
	var oprt_state_no_oprt   = 10 ; // ����״̬��δ����
	var oprt_state_ack       = 20 ; // ����״̬��ȷ��
	var oprt_state_clear     = 30 ; // ����״̬�����
	var oprt_state_del       = 40 ; // ����״̬��ɾ��

	var ACKWindowCfg = {
		singleUrl	: alarmManageUrl + "ACKAlarm.htm",
		allUrl		: alarmManageUrl + "ACKAlarmAll.htm",
		features	: defaultFeatures
	}

	var CLRAlarmWinCfg = {
		singleUrl	: alarmManageUrl + "CLRAlarm.jsp",
		allUrl		: alarmManageUrl + "CLRAlarmAll.jsp",
		features	: defaultFeatures
	}

	var DELAlarmWinCfg = {
		singleUrl	: alarmManageUrl + "DELAlarm.jsp",
		allUrl		: alarmManageUrl + "DELAlarmAll.jsp?flag=",
		features	: defaultFeatures
	}

	var UPGAlarmWinCfg = {
		singleUrl	: alarmManageUrl + "upgradeAlarm.htm?alarmLevel=",
		allUrl		: alarmManageUrl + "upgradeAlarmAll.htm",
		features	: defaultFeatures
	}

	var edAlarmRgWinCfg = {
		url			: alarmManageUrl + "editAlarmRegion.htm",
		features	: "dialogWidth=29;dialogHeight=15;help=0;scroll=1;status=0;"
	}

	var viewAlarmWinCfg = {
		url			: alarmManageUrl + "viewAlarmInfo.htm?flag=0&alarmId=",
		target		: "_blank",
		features	: "resizable=1,scrollbars=1,top=0,left=0,help=0,status=0"
	}

	var searchWinCfg = {
		url	: "../searchEngine/search_entrance_result.htm?indexDirectory=publish_index_directory&module=&category=&queryString="
	}

	var oriAlarmWinCfg = {
		url			: alarmManageUrl + "oriAlarmMsgQry.htm",
		features	: "dialogWidth=50;dialogHeight=29;help=0;scroll=1;status=0;"
	}

	var sendAlarmTransWinCfg = {
		url				: alarmManageUrl + "AlarmDealResult.htm",
		alarmMergeUrl	: "../../servlet/alarmMergeServlet?",//�澯�鲢
		features		: "dialogWidth=40;dialogHeight=20;help=0;scroll=0;status=0;"
	}
	
	var SPDAlarmWinCfg = {
		singleUrl	: alarmManageUrl + "SPDAlarm.htm",
		allUrl		: alarmManageUrl + "SPDAlarmAll.htm",
		features	: defaultFeatures
	}

	function hasInArray(val, arr)
	{
		var is;
		for (var i = 0, len = arr.length; (is = (val != arr[i])) && i < len; i++);
		return !is;
	}
	
	function addNewNode(infoNode, nodeName, nodeValue, attrNameArr,
			attrValueArr) {
		if (nodeName == null)
			return;

		var dXML = infoNode.ownerDocument;
		var itemNode = dXML.createElement(nodeName);
		if (nodeValue != "")
			itemNode.text = nodeValue;

		if (attrNameArr != null) {
			for (var i = 0; i < attrNameArr.length; i++) {
				itemNode.setAttribute(attrNameArr[i], attrValueArr[i]);
			}
		}
		infoNode.appendChild(itemNode);
		return itemNode;
	}

	return {
		popupACKWindow		: function(grid,rowindex,e)
		{
			if(grid)
			{
				var isInfoPage = false;
				var ifWorker = 1;
	
				var rows = grid.getSelectionModel().getSelections();
				var ids = [], states = [];
				for (var i = 0, row; row = rows[i]; i++)
				{
					ids[i] = row.id;
					states[i] = row.get("OPRT_STATE");
				}
				var len = ids.length;
				if (len > 0)
				{
					for (var i = 0, val; val = states[i]; i++)
					{
						if (hasInArray(val, [oprt_state_clear, oprt_state_del]))
						{
							MMsg("��ѡ�澯��¼�����Ѿ��������ɾ���ĸ澯��������ѡ��..!");
							return;
						}
					}
					if (len == 1)
					{
						window.showModalDialog(ACKWindowCfg.singleUrl, {alarmId:ids[0],
							ifWorker:ifWorker}, ACKWindowCfg.features);
					}
					else
					{
						window.showModalDialog(ACKWindowCfg.allUrl,
								{alarmId:ids.join(","),
							ifWorker:ifWorker}, ACKWindowCfg.features);
					}
					grid.search();
				}
			}
		},
		popupCLRWindow		: function(grid,rowindex,e)		
		{
			if(grid)
			{
				var isInfoPage = false;
				var ifWorker = 1;
				var rows = grid.getSelectionModel().getSelections();
				var ids = [], states = [];
				for (var i = 0, row; row = rows[i]; i++)
				{
					ids[i] = row.id;
					states[i] = row.get("OPRT_STATE");
				}
				var len = ids.length;
				if (len > 0)
				{
					for (var i = 0, val; val = states[i]; i++)
					{
						if (hasInArray(val, [oprt_state_clear, oprt_state_del]))
						{
							MMsg("��ѡ�澯��¼�����Ѿ��������ɾ���ĸ澯��������ѡ��..!");
							return;
						}
					}					
					if (len == 1)
					{						
						window.showModalDialog(CLRAlarmWinCfg.singleUrl, {alarmId:ids[0],
							ifWorker:ifWorker}, CLRAlarmWinCfg.features);
					}
					else
					{
						window.showModalDialog(CLRAlarmWinCfg.allUrl, {alarmId:ids.join(","),
							ifWorker:ifWorker}, CLRAlarmWinCfg.features);
					}
					grid.search();
				}
			}
		},
		popupDELWindow		: function(grid,rowindex,e)
		{
			if(grid)
			{
				var isInfoPage = false;
				var ifWorker = 1;
	
				var rows = grid.getSelectionModel().getSelections();
				var ids = [], states = [];
				for (var i = 0, row; row = rows[i]; i++)
				{
					ids[i] = row.id;
					states[i] = row.get("OPRT_STATE");
				}
				var len = ids.length;
				if (len > 0)
				{
					for (var i = 0, val; val = states[i]; i++)
					{
						if (val == oprt_state_del)
						{
							MMsg("��ѡ�澯��¼�����Ѿ���ɾ���ĸ澯��������ѡ��..!");
							return;
						}
					}
					if (len == 1)
					{
						window.showModalDialog(DELAlarmWinCfg.singleUrl, {alarmId:ids[0],
							ifWorker:ifWorker}, DELAlarmWinCfg.features);
					}
					else
					{
						window.showModalDialog(DELAlarmWinCfg.allUrl, {alarmId:ids.join(","),
							ifWorker:ifWorker}, DELAlarmWinCfg.features);
					}
					grid.search();
				}
			}
		},
		popupUpgradeWindow	: function(grid,rowindex,e)
		{
			if(grid)
			{
				var isInfoPage = false;
				var ifWorker = 1;
	
				var rows = grid.getSelectionModel().getSelections();
				var ids = [], states = [], levels = [];
				for (var i = 0, row; row = rows[i]; i++)
				{
					ids[i] = row.id;
					states[i] = row.get("OPRT_STATE");
					levels[i] = row.get("ALARM_LEVEL");
	
				}
	
				var len = ids.length;
				if (len > 0)
				{
					for (var i = 0; i < len; i++)
					{
						var level = levels[i];
						var state = states[i];
						if (level == 1)
						{
							MMsg("��ѡ�澯������߼���澯�������ٽ��и澯��������..!");
							return;
						}
						if (hasInArray(state, [oprt_state_clear, oprt_state_del]))
						{
							MMsg("�澯�Ѿ��������ɾ�������ܽ��и澯��������..!");
							return;
						}
					}
					if (len == 1)
					{
						window.showModalDialog(
								UPGAlarmWinCfg.singleUrl + levels[0], {alarmId:ids[0],
									ifWorker:ifWorker}, UPGAlarmWinCfg.features);
					}
					else
					{
						window.showModalDialog(UPGAlarmWinCfg.allUrl, {alarmId:ids.join(","),
							ifWorker:ifWorker}, UPGAlarmWinCfg.features);
					}
					grid.search();
				}
			}
		},
		editAlarmRegion		: function(grid,rowindex,e)
		{
			if(grid)
			{
				var rows = grid.getSelectionModel().getSelections();
				for (var i = 0, row; row = rows[i]; i++)
				{
					window.showModalDialog(edAlarmRgWinCfg.url, row.id,
							edAlarmRgWinCfg.features);
				}
			}
		},
		oriAlarmMsgQry		: function(grid,rowindex,e)
		{
			if(grid)
			{
				var rows = grid.getSelectionModel().getSelections();
				for (var i = 0, row; row = rows[i]; i++)
				{
					window.showModalDialog(oriAlarmWinCfg.url, row.id,
							oriAlarmWinCfg.features);
				}
			}
		},
		openSearchEngine	: function(grid,rowindex,e)
		{
			if(grid)
			{
				var rows = grid.getSelectionModel().getSelections();
				for (var i = 0, row; row = rows[i]; i++)
				{
					var kpiName = row.get("KPI_NAME");
					doWindow_open(searchWinCfg.url + kpiName);
				}
			}
		},
		alarmDesc			: function(grid,rowindex,e)
		{
			if(grid)
			{
				var rows = grid.getSelectionModel().getSelections();
				for (var i = 0, row; row = rows[i]; i++)
				{
					window.open(viewAlarmWinCfg.url + row.id,
							viewAlarmWinCfg.target, viewAlarmWinCfg.features);
				}
			}
		},
		// �澯����
		sendAlarmTrans		: function(grid,rowindex,e)
		{
			if(grid)
			{
				var rows = grid.getSelectionModel().getSelections();
				var ids = [], states = [];
				for (var i = 0, row; row = rows[i]; i++)
				{
					ids[i] = row.id;
					states[i] = row.get("OPRT_STATE");
				}

				var len = ids.length;
				if (len > 0)
				{
					for (var i = 0, val; val = states[i]; i++)
					{
						if (hasInArray(val, [oprt_state_ack, oprt_state_clear, oprt_state_del]))
						{
							MMsg("��ѡ�澯��¼����\"��ȷ�ϡ����������ɾ��\"״̬�ĸ澯��������ѡ��..!");
							return;
						}
					}

					if(confirm("��ȷ��Ҫ�澯���Ͳ�����..?(�澯�����������º�̨����ʱ�佫�п����Գ��������ĵȴ�...)")) {
						var sendXML='<?xml version="1.0" encoding="gb2312"?>'
							   +  '<root>'
							   +     '<alarmId>' + ids.join(",") + '</alarmId>'
							   +     '<flowId></flowId>'
							   +     '<ifWorker>'+0+'</ifWorker>'
							   +  '</root>';
						var dom = new ActiveXObject("Microsoft.XMLDOM");
						var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
						dom.loadXML(sendXML);
						xmlhttp.Open("POST",  sendAlarmTransWinCfg.alarmMergeUrl + "tag=37", false);
						xmlhttp.send(dom);

						if (isSuccess(xmlhttp)) {
							dom.loadXML(xmlhttp.responseXML.xml);
							var alarmNums = dom.selectSingleNode("/root/alarmNum").text;
							var dealNums = dom.selectSingleNode("/root/dealNum").text;
							errorNums += (Number(alarmNums) - Number(dealNums));
							sumDealNums += Number(dealNums);
							if (alarmNums == dealNums) {
								MMsg("���ͳɹ���");
							} else {
								var params ={};
								params['errorXML'] = xmlhttp.responseXML.selectSingleNode("/root").xml;
								params['sumDealNums'] = sumDealNums;
								params.errorNums = errorNums;
								window.showModalDialog(sendAlarmTransWinCfg.url, params, sendAlarmTransWinCfg.features);
							}
						}
						
						grid.search();
					}
				}
			}
		},
		popupSPDWindow		: function(grid,rowindex,e)		
		{
			if(grid)
			{
				var isInfoPage = false;
				var ifWorker = 1;
				var rows = grid.getSelectionModel().getSelections();
				var ids = [], states = [];
				for (var i = 0, row; row = rows[i]; i++)
				{
					ids[i] = row.id;
					states[i] = row.get("OPRT_STATE");
				}
				var len = ids.length;
				if (len > 0)
				{
					for (var i = 0, val; val = states[i]; i++)
					{
						if (hasInArray(val, [oprt_state_clear, oprt_state_del]))
						{
							MMsg("��ѡ�澯��¼�����Ѿ��������ɾ���ĸ澯��������ѡ��..!");
							return;
						}
					}					
					if (len == 1)
					{						
						window.showModalDialog(SPDAlarmWinCfg.singleUrl, {alarmId:ids[0],
							ifWorker:ifWorker}, SPDAlarmWinCfg.features);
					}
					else
					{
						window.showModalDialog(SPDAlarmWinCfg.allUrl, {alarmId:ids.join(","),
							ifWorker:ifWorker}, SPDAlarmWinCfg.features);
					}
					grid.search();
				}
			}
		},
		
		//�澯��������
		alarmRuleConfig 	:function(grid,rowindex,e)
		{
			if(grid)
			{
				var row = grid.getSelectionModel().getSelected();
				if(row)
				{
					var params = new Array();
					params.push("viewId=-1");
					params.push("id="+row.get("NE_ID"));
					params.push("ruleType="+3);//�澯���ι���					
					var maxWidth = screen.availWidth - 10;
					var maxHeight = screen.availHeight - 30;
					var sFeatures = new Array();
					sFeatures.push("width="+maxWidth);
					sFeatures.push("height="+maxHeight);
					sFeatures.push("top="+0);
					sFeatures.push("left="+0);
					sFeatures.push("location="+0);
					sFeatures.push("menubar="+0);
					sFeatures.push("resizable="+1);
					sFeatures.push("scrollbars="+1);
					sFeatures.push("status="+0);
					sFeatures.push("titlebar="+0);
					sFeatures.push("toolbar="+0);
					window.open("/workshop/rules/alarmRuleMain.html?"+params.join("&"),"alarmRuleMain",sFeatures.join(","));
				}
			}
		},
		
		locateNet   :function(grid,rowindex,e)
		{
			if(grid)
			{
				var row = grid.getSelectionModel().getSelected();
				if(row)
				{
					parent.frames["fraMidFrame"].locateNet(row.get("NE_ID"));
				}
			}
		},
		
		hatenAlarm		: function(grid,rowindex,e)		
		{
			if(grid)
			{
				var isInfoPage = false;
				var ifWorker = 1;
				var rows = grid.getSelectionModel().getSelections();
				var ids = [], states = [];
				for (var i = 0, row; row = rows[i]; i++)
				{
					ids[i] = row.id;
					states[i] = row.get("OPRT_STATE");
				}
				var len = ids.length;
				if (len > 0)
				{
					for (var i = 0, val; val = states[i]; i++)
					{
						if (hasInArray(val, [oprt_state_clear, oprt_state_del]))
						{
							MMsg("��ѡ�澯��¼�����Ѿ��������ɾ���ĸ澯��������ѡ��..!");
							return;
						}
					}					
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp.Open("POST","../../servlet/alarmMergeServlet?tag=48&alarmIds="+ids.join(","),false);
					xmlhttp.send();
					if (isSuccess(xmlhttp)){
						MMsg("�߰�ɹ�");
					}
				}
			}
		},
		
		reGather : function(grid, rowindex, e) {
			if (grid) {
				var rows = grid.getSelectionModel().getSelections();
				if (rows.length > 1) {
					MMsg("һ��ֻ��ѡ��һ���澯!");
					return;
				}
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				xmlhttp.Open("POST","../../servlet/alarmMergeServlet?tag=49&alarmId="+ rows[0].id, false);
				xmlhttp.send();
				if (isSuccess(xmlhttp)) {
					var rows = xmlhttp.responseXML.selectNodes("/root/rowSet");
					if (rows.length < 1) {
						MMsg("δ�ҵ��ø澯��Ӧ�Ĳɼ�����!");
						return;
					}
					var dXML = new ActiveXObject("Microsoft.XMLDOM");
					dXML.loadXML('<?xml version="1.0" encoding="gb2312"?><root></root>');
					var rootNode = dXML.selectSingleNode("root");
					var configItemNode = null;
					var task_config_id, ne_id, script_type;
					var sCtrlMsgId = new Array();
					var sTaskConfigId = new Array();
					for (var i = 0, row; row = rows[i]; i++) {
						task_config_id = row.selectSingleNode("//NE_TASK_CONFIG_ID").text;
						ne_id = row.selectSingleNode("//NE_ID").text;
						script_type = row.selectSingleNode("//SCRIPT_TYPE").text;
						configItemNode = addNewNode(rootNode, "NE_TASK_CONFIG","");
						addNewNode(configItemNode, "NE_TASK_CONFIG_ID",task_config_id);
						addNewNode(configItemNode, "NE_ID", ne_id);
						sTaskConfigId[i] = task_config_id;
					}
					xmlhttp.open("POST","/servlet/taskConfigServlet?tag=10&state=0SA&script="+ script_type, false);
					xmlhttp.send(dXML);
					if (isSuccess(xmlhttp)) {
						x = xmlhttp.ResponseXML.selectSingleNode("/root").childNodes;
						for (i = 0; i < x.length; i++) {
							if ((x[i].nodeType == 1) && (x[i].nodeName == "id")) {
								sCtrlMsgId.push(x[i].childNodes[0].nodeValue);
							}
						}
						if (sCtrlMsgId != null && sCtrlMsgId.length > 0) {
							sCtrlMsgId.join(",");
							// ����/���ϲ������ɹ�����ʾ������������
							var sHref = "/workshop/topo/neCtrl.html?dialogType=neTask&ctrlMsgId="
									+ sCtrlMsgId
									+ "&taskConfigId="
									+ sTaskConfigId;
							var sPara = 'dialogwidth:23;dialogheight:15;status:no;help:no;resizable:yes';
							window.showModelessDialog(sHref, '', sPara);
						} else {
							MMsg("���²ɼ��ɹ�!");
						}
					}
				}
			}

		}
	}
})();

//�澯תITSM��----�㶫
function alarmToItsmFLow(){
    var row = parent.window.frames["alarmListFrame"].Global.grid.getSelectionModel().getSelected();
    if(row){
        if (row.length > 1) {
            MMsg("һ��ֻ��ѡ��һ���澯!");
            return;
        }
        var itsmUrl = $getSysVar("ALARM_TO_OUT_SYS_FLOW");
        if(itsmUrl == ''){
            MMsg("�ⲿϵͳ���ύ��ַδ���ã�");
            return;
        }
        window.parent.document.charset='GBK';
        var ALARM_CONTENT = row.get("MSG_REMARK")+ "\n���ʱ�䣺" + row.get("LAST_GENERATE_TIME");
        ALARM_CONTENT = ALARM_CONTENT.replace(/<[^>].*?>/g,"");       
        var vform = window.parent.document.getElementById("toItsmFLowForm");//��ȡ�澯���̱�����alarmsDeal.html��
	    window.parent.document.getElementById("ALARM_ID").value = row.get("NE_ALARM_LIST_ID");
	    window.parent.document.getElementById("ALARM_TITLE").value = row.get("ALARM_TITLE");
	    if(row.get("SCRIPT_CONTENT")!=null&&row.get("SCRIPT_CONTENT")!=''){
	    	window.parent.document.getElementById("ALARM_CONTENT").value = ALARM_CONTENT + row.get("SCRIPT_CONTENT");
	    }else {
	    	window.parent.document.getElementById("ALARM_CONTENT").value = ALARM_CONTENT;
	    }
//	    window.parent.document.getElementById("ALARM_CONTENT").value = ALARM_CONTENT;
	    window.parent.document.getElementById("SYS_ID").value = 'ITM';
	    window.parent.document.getElementById("LOGIN_ID").value = parent.oFormContext.GLOBAL_VAR.USER_NAME; //"wuzhua";
	    window.parent.document.getElementById("RESOURCE").value = 'StartFault';
//	    window.parent.document.getElementById("SCRIPT_CONTENT").value = row.get("SCRIPT_CONTENT");
/*	    
	    alert(
	    "ALARM_ID:"+window.parent.document.getElementById("ALARM_ID").value+"\n\n"+
	    "ALARM_TITLE:"+window.parent.document.getElementById("ALARM_TITLE").value+"\n\n"+
	    "ALARM_CONTENT:"+window.parent.document.getElementById("ALARM_CONTENT").value+"\n\n"+
	    "SYS_ID:"+window.parent.document.getElementById("SYS_ID").value+"\n\n"+
	    "LOGIN_ID:"+window.parent.document.getElementById("LOGIN_ID").value+"\n\n"+
	    "RESOURCE:"+window.parent.document.getElementById("RESOURCE").value
	    );
*/	    
	    vform.action=itsmUrl;
	    vform.submit();  
    }else{
        MMsg("��ѡ��һ����¼��");
        return;
    }   
}
