var AlarmGridHandler = (function()
{
	var alarmManageUrl = "../alarmManage/";
	var defaultFeatures = "dialogWidth=40;dialogHeight=35;help=0;scroll=0;status=0;";
	var alarm_no_work =10;    // 状态：未派单 -- 未确认、未清除
	var alarm_clean = 40;     // 状态：清 除 -- 未确认、已清除
	var alarm_ack = 32;       // 状态：确 认 -- 已确认、未清除
	var alarm_end=31;         // 状态：竣 工 -- 已确认、已清除
	var alarm_process_wait=30;// 状态：待处理
	
	
	var alarm_state_no_clear = 0  ; // 告警状态：未清除
	var alarm_state_clear    = 1  ; // 告警状态：已清除
	
	var oprt_state_no_oprt   = 10 ; // 操作状态：未操作
	var oprt_state_ack       = 20 ; // 操作状态：确认
	var oprt_state_clear     = 30 ; // 操作状态：清除
	var oprt_state_del       = 40 ; // 操作状态：删除

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
							MMsg("所选告警记录包含已经被清除或删除的告警，请重新选择..!");
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
							MMsg("所选告警记录包含已经被清除或被删除的告警，请重新选择..!");
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
							MMsg("所选告警记录包含已经被删除的告警，请重新选择..!");
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
							MMsg("所选告警包含最高级别告警，不能再进行告警升级操作..!");
							return;
						}
						if (hasInArray(state, [oprt_state_clear, oprt_state_del]))
						{
							MMsg("告警已经被清除或删除，不能进行告警升级操作..!");
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