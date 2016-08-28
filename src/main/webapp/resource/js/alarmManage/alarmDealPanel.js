var AlarmGridHandler = (function()
{
	var alarmManageUrl = "../alarmManage/";
	var defaultFeatures = "dialogWidth=40;dialogHeight=35;help=0;scroll=0;status=0;";
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

	function hasInArray(val, arr)
	{
		var is;
		for (var i = 0, len = arr.length; (is = (val != arr[i])) && i < len; i++);
		return !is;
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
						window.showModalDialog(ACKWindowCfg.singleUrl, [ids[0],
								ifWorker], ACKWindowCfg.features);
					}
					else
					{
						window.showModalDialog(ACKWindowCfg.allUrl,
								[ids, ifWorker], ACKWindowCfg.features);
					}
					grid.search(Global.urlParam,{comp:Global.mainPanel.paramByToolbar});
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
						window.showModalDialog(CLRAlarmWinCfg.singleUrl, [ids[0],
								ifWorker], CLRAlarmWinCfg.features);
					}
					else
					{
						window.showModalDialog(CLRAlarmWinCfg.allUrl, [ids,
								ifWorker], CLRAlarmWinCfg.features);
					}
					grid.search(Global.urlParam,{comp:Global.mainPanel.paramByToolbar});
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
						window.showModalDialog(DELAlarmWinCfg.singleUrl, [ids[0],
								ifWorker], DELAlarmWinCfg.features);
					}
					else
					{
						window.showModalDialog(DELAlarmWinCfg.allUrl, [ids,
								ifWorker], DELAlarmWinCfg.features);
					}
					grid.search(Global.urlParam,{comp:Global.mainPanel.paramByToolbar});
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
								UPGAlarmWinCfg.singleUrl + levels[0], [ids[0],
										ifWorker], UPGAlarmWinCfg.features);
					}
					else
					{
						window.showModalDialog(UPGAlarmWinCfg.allUrl, [ids,
								ifWorker], UPGAlarmWinCfg.features);
					}
					grid.search(Global.urlParam,{comp:Global.mainPanel.paramByToolbar});
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
		}
	}
})();