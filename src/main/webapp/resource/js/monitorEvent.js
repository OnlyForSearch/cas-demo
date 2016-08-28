	var callbackFn;
	function showForm(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	flow_id = row.get("FLOW_ID");
		var flowMod = row.get("FLOW_MOD");
		var serial_num = row.get("SERIAL_NUM");
		
		if(typeof(flow_id)=='undefined'||flow_id==""){
			alert("没有找到流程ID!");
			return;
		}
		if(typeof(flowMod)=='undefined'){
			flowMod = "";
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/form/index.jsp?fullscreen=yes&flowId="+flow_id+"&flowMod="+flowMod;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			var curr_window;
			curr_window=window.open(url+'&system_code=G','SparePartEdit'+parseInt(1000*Math.random()),'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	function newFLowModel(flowMod){
		var sWidth=window.screen.width;
	  	var sHeight=window.screen.height;
	  	callbackFn = function(){dogridRefresh(grid)}
	  	var url = "/workshop/form/index.jsp?fullscreen=yes&&flowMod="+flowMod+"&callback=window.opener.callbackFn()";
	  	window.open(url,'SparePartEdit','scrollbars=yes,width='+sWidth+',height='+sHeight+',top='+0+',left='+0+',resizable=yes');
	}
	
	function showFormRefresh(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		if(typeof(row)=='undefined'){
			return;
		}
		var	flow_id = row.get("FLOW_ID");
		var flowMod = row.get("FLOW_MOD");
		var serial_num = row.get("SERIAL_NUM");
		if(typeof(flow_id)=='undefined'){
			alert("没有找到流程ID!");
			return;
		}
		if(typeof(flowMod)=='undefined'){
			flowMod = "";
		}
		var x=0;
	  	var y=0;
	  	var sWidth=window.screen.width;
	  	var sHeight=window.screen.height;
	  	var isBindForm  = row.get("ISBINDFORM")
	 
		callbackFn = function(){dogridRefresh(grid)}
		var url = "/workshop/form/index.jsp?fullscreen=yes&flowId="+flow_id+"&flowMod="+flowMod+"&callback=window.opener.callbackFn()";
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit'+parseInt(1000*Math.random()),'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	function dogridRefresh(grid){
		grid.search();
	}
	
	function getFirstDay(){
		var d = new Date();
		d.setDate(1);
		var year = d.getYear();
		var month = d.getMonth()+1;
		var day = d.getDate();
		
		return year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);
	}
	
	function getEndDay(){
		var d = new Date();
		var year = d.getYear();
		var month = d.getMonth()+1;
		var day = d.getDate();
		d = new Date(year,month,day);
		d.setDate(0);
		year = d.getYear();
		month = d.getMonth()+1;
		day = d.getDate();
		return year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);
	}
	
	function getForwordDay(fDay){
		if(typeof(fDay)=='undefined'||fDay==''){
			fDay = -1;
		}
		var d = new Date();
		d.setDate(d.getDate() + fDay)
		var year = d.getYear();
		var month = d.getMonth()+1;
		var day = d.getDate();
		return year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);
	}
	
	function getDynamicDay(fDay){
		if(typeof(fDay)=='undefined'||fDay==''){
			fDay = -1;
		}
		var d = new Date();
		d.setDate(d.getDate() + fDay)
		var year = d.getYear();
		var month = d.getMonth()+1;
		var day = d.getDate();
		return year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);
	}
	
	function showJobPlan(grid){
		var row = grid.getSelectionModel()
				.getSelected();
		if(typeof(row)=='undefined'){
			return;
		}
		var sendUrl = row.get("SEND_URL");
		var serial_num = row.get("SERIAL_NUM");
		var event_id = row.get("ET_ID");
		if(typeof(sendUrl)=='undefined'||typeof(serial_num)=='undefined'){
			MMsg('获取列表值失败!');
			return;
		}
		sendUrl = sendUrl.replace("serialnum",serial_num);
		sendUrl = "/WorkAccept?id="+event_id+"&type=event";
		doWindow_open(sendUrl);
	}
	
	function showTache(grid)
	{
		
		var row = grid.getSelectionModel()
				.getSelected();
		if(typeof(row)=='undefined'){
			return;
		}
		var	flow_id = row.get("FLOW_ID");
		var flowMod = row.get("FLOW_MOD");
		var	isBindForm = row.get("ISBINDFORM");
		if(typeof(flow_id)=='undefined'){
		
			MMsg('获取流程ID错误!');
			return;
		}
		
		if(typeof(flowMod)=='undefined'){
			flowMod = 0;
		}
		
		var sendUrl = row.get("SEND_URL");
		var serial_num = row.get("SERIAL_NUM");
		var callbackFn;
		callbackFn = function(){dogridRefresh(grid)}
		var url = "/workshop/form/index.jsp?callback=opener.callbackFn()&fullscreen=yes&flowId="+flow_id+"&flowMod="+flowMod;
		if(typeof(sendUrl)=='undefined'||typeof(serial_num)=='undefined'){
			sendUrl = url;
		}else{
			sendUrl = sendUrl.replace("0000",serial_num);
			//sendUrl = sendUrl.replace(".","");
			sendUrl = sendUrl + "&callback=opener.callbackFn()";
		}	
		doWindow_open(sendUrl);
	}
	
	function receiveTch(grid){
		var actionURL = "/servlet/FormTurnServlet?";	
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1)
		{
			EMsg("请至少选择一条记录!");
			return;
		}
		
		var highIds = [];		
		for (var i = 0, row; row = rows[i]; i++)
		{
			tchId = row.get("TCH_ID");
			if(typeof(tchId)=='undefined'||tchId==''){
				EMsg("未找到TCH_ID环节标识!");
				return;
			}
			highIds[i] = tchId;
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定要接收你选择的记录吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp.Open("POST",actionURL+"tag=12&tchId="+highIds.join(','),false);
					xmlhttp.send();
					if (isSuccess(xmlhttp))
					{
						MMsg("接收成功!");
						grid.search();
					}
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});		
	}
	
	function urgeTch(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1)
		{
			EMsg("请至少选择一条记录!");
			return;
		}
		
		var highIds = [];		
		for (var i = 0, row; row = rows[i]; i++)
		{
			tchId = row.get("TCH_ID");
			if(typeof(tchId)=='undefined'||tchId==''){
				EMsg("未找到TCH_ID环节标识!");
				return;
			}
			highIds[i] = tchId;
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定要对您所选择的记录进行催单吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		   			xmlhttp.Open("POST","/servlet/AhFlowManagerServlet?tag=24&tchId="+highIds.join(','),false);
					xmlhttp.send();
					if (isSuccess(xmlhttp))
					{
						MMsg("催单成功!");
						grid.search();
					}
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});		
	}
	
	function EDAAlamSend(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		if(rows.length < 1){
			EMsg("请至少选择一条记录!");
			return;
		}
		var highIds = [];
		for (var i = 0, row; row = rows[i]; i++){
			NE_ALARM_LIST_ID = row.get("NE_ALARM_LIST_ID");
			if(typeof(NE_ALARM_LIST_ID)=='undefined'||NE_ALARM_LIST_ID==''){
				EMsg("未找到NE_ALARM_LIST_ID标识!");
				return;
			}
			highIds[i] = NE_ALARM_LIST_ID;
		}
		var sHref="/workshop/form/ahFormFile/eda_alarm_send.html";
		var sPara='dialogwidth:320px;dialogheight:50px;status:no;help:no;resizable:yes';
		var oDialogWin = window.showModalDialog(sHref,null,sPara);
		var v_send_type = 0;
		if(oDialogWin==''||typeof(oDialogWin)=='undefined'){
			return;
		}else{
			v_send_type = oDialogWin;
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定要通知您所选择的记录吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		   			xmlhttp.Open("POST","/servlet/AhFlowManagerServlet?tag=124&NE_ALARM_LIST_ID="+highIds.join(',')+"&send_type="+v_send_type,false);
					xmlhttp.send();
					if (isSuccess(xmlhttp)){
						MMsg("通知成功!");
						grid.search();
					}
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});
	}
	
	function breakOff(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			EMsg("请至少选择一条记录!");
			return;
		}
		
		var highIds = [];		
		for (var i = 0, row; row = rows[i]; i++){
			var v_instance_id = row.get("INSTANCE_ID");
			if(typeof(v_instance_id)=='undefined'||v_instance_id==''){
				EMsg("未找到INSTANCE_ID标识!");
				return;
			}
			highIds[i] = v_instance_id;
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定暂不关注您所选择的CI吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		   			xmlhttp.Open("POST","/servlet/AhFlowManagerServlet?tag=88&state=B&instance_id="+highIds.join(','),false);
					xmlhttp.send();
					if (isSuccess(xmlhttp)){
						MMsg("操作成功!");
						grid.search();
					}else{
						EMsg("操作失败！");
					}
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});		
	}
	
	function leach(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			EMsg("请至少选择一条记录!");
			return;
		}
		
		var highIds = [];	
		for (var i = 0, row; row = rows[i]; i++){
			var v_instance_id = row.get("INSTANCE_ID");
			if(typeof(v_instance_id)=='undefined'||v_instance_id==''){
				EMsg("未找到INSTANCE_ID标识!");
				return;
			}
			highIds[i] = v_instance_id;
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定屏蔽您所选择的CI吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		   			xmlhttp.Open("POST","/servlet/AhFlowManagerServlet?tag=89&state=C&instance_id="+highIds.join(','),false);
					xmlhttp.send();
					if (isSuccess(xmlhttp)){
						MMsg("屏蔽成功!");
						grid.search();
					}else{
						EMsg("屏蔽失败！");
					}
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});		
	}
	
	function dispatchCMDB(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			EMsg("请至少选择一条记录!");
			return;
		}
		
		var highIds = [];	
		var highIds2 = [];
		var highIds3 = [];
		for (var i = 0, row; row = rows[i]; i++){
			var v_instance_id = row.get("INSTANCE_ID");
			var v_ci_instance_id = row.get("CI_INSTANCE_ID");
			var v_batch_code = row.get("BATCH_CODE");
			if(typeof(v_instance_id)=='undefined'||v_instance_id==''){
				EMsg("未找到INSTANCE_ID标识!");
				return;
			}
			if(typeof(v_ci_instance_id)=='undefined'||v_ci_instance_id==''){
				EMsg("未找到CI_INSTANCE_ID标识!");
				return;
			}
			if(typeof(v_batch_code)=='undefined'||v_batch_code==''){
				EMsg("未找到BATCH_CODE标识!");
				return;
			}
			highIds[i] = v_instance_id;
			highIds2[i] = v_ci_instance_id;
			highIds3[i] = v_batch_code;
		}
		var orgId = '152,708,3600';
		var obj = choiceStaff(false,orgId,null,null,null,null,null,true,null);
		if(obj!=null){
			Ext.Msg.show({
			   title:'提示',
			   msg: '确定对您所选择的CI进行派单吗?',
			   buttons: Ext.Msg.YESNO,
			   fn: function(btn){
			   		if(btn=='yes'){
			   			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			   			xmlhttp.Open("POST","/servlet/AhFlowManagerServlet?tag=90&state=D&oper_staff_id="+obj.id+"&instance_id="+highIds.join(',')+"&ci_instance_id="+highIds2.join(',')+"&batch_code="+highIds3.join(','),false);
						xmlhttp.send();
						if (isSuccess(xmlhttp)){
							MMsg("派单成功!");
							grid.search();
						}else{
							EMsg("派单失败！");
						}
			   		}
			   },
			   icon: Ext.MessageBox.QUESTION
			});
		}	
	}
	
	function autoDispatchTch(grid){
		checkHasCryptoJS();
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1)
		{
			EMsg("请至少选择一条记录!");
			return;
		}
		
		var highIds = [];
		for (var i = 0, row; row = rows[i]; i++)
		{
			tchId = row.get("TCH_ID");
			flowId = row.get("FLOW_ID");
			if(typeof(flowId)=='undefined'||flowId==''){
				EMsg("未找到FLOW_ID流程标识!");
				return;
			}
			if(typeof(tchId)=='undefined'||tchId==''){
				EMsg("未找到TCH_ID环节标识!");
				return;
			}
			var sqltmp = "select a.group_code,b.serial From STHS_BIN_MAPPING_GROUP a,event_flow b,it_flow_base c where a.TYPE_KEY='SYSTEM_NAME_MAPPING_GROUP' and a.MAIN_CODE=b.system_name and b.serial=c.serial and c.flow_id="+flowId;
	    	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    	xmlhttp.Open("POST", "/servlet/@Deprecated/ExecServlet?action=101&paramValue=" + getAESEncode(encodeURIComponent(sqltmp)), false);
	    	xmlhttp.send();
	    	if(isSuccess(xmlhttp)) {
	    		var dataArr = xmlhttp.responseXML.getElementsByTagName("rowSet");
	    		var V_GROUP_CODE = dataArr[0].attributes[0].value;
	    		var V_SERIAL = dataArr[0].selectSingleNode("SERIAL").text;
	    		if(V_GROUP_CODE==""){
	    			EMsg("工单"+V_SERIAL+"未找到系统所对应的维保厂商!");
	    			return;
	    		}else{
	    			highIds[i] = tchId;
	    		}
	    	}else{
	    		EMsg("访问数据库失败!");
	    		return;
	    	}
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定要派发你选择的记录吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp2.Open("POST","/servlet/FlowDispatch?tag=15&tchId="+highIds.join(',')+"&nextTchMod=9835",false);
					xmlhttp2.send();
					if (isSuccess(xmlhttp2))
					{
						MMsg("派发成功!");
						grid.search();
					}
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});		
	}
	
	function autoNextForITSMDispatch(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			EMsg("请至少选择一张任务派发单!");
			return;
		}
		
		var highIds = [];
		for (var i = 0, row; row = rows[i]; i++)
		{
			tchId = row.get("TCH_ID");
			flowId = row.get("FLOW_ID");
			if(typeof(flowId)=='undefined'||flowId==''){
				EMsg("未找到FLOW_ID流程实例标识!");
				return;
			}
			if(typeof(tchId)=='undefined'||tchId==''){
				EMsg("未找到TCH_ID环节实例标识!");
				return;
			}
	    	highIds[i] = tchId;
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定要承接您所选择的任务派发单吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp2.Open("POST","/servlet/AhFlowManagerServlet?tag=119&tchId="+highIds.join(',')+"&nextTchMod=5014",false);
					xmlhttp2.send();
					if (isSuccess(xmlhttp2))
					{
						MMsg("承接成功!");
						grid.search();
					}
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});		
	}
	
	function createNextTchForZQGXH(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		if(rows.length < 1){
			EMsg("请至少选择一张工单!");
			return;
		}
		var v_tchId = rows[0].get("TCH_ID");
		var v_flowId = rows[0].get("FLOW_ID");
		if(typeof(v_tchId)=='undefined'||v_tchId==''){
			EMsg("未找到TCH_ID标识!");
			return;
		}
		if(typeof(v_flowId)=='undefined'||v_flowId==''){
			EMsg("未找到FLOW_ID标识!");
			return;
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定要提交您所选择的工单吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp2.Open("POST","/servlet/AhFlowManagerServlet?tag=310&p_flow_id="+v_flowId+"&p_tch_id="+v_tchId+"&p_next_tch_mod=128550&p_result_desc=completed",false);
					xmlhttp2.send();
					if (isSuccess(xmlhttp2)){
						MMsg("提交成功!");
						grid.search();
					}
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});		
	}
	
	function platChooseCI(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		if(rows.length < 1){
			EMsg("请至少选择一项!");
			return;
		}	
		var v_instance_id = rows[0].get("INSTANCE_ID");
		if(typeof(v_instance_id)=='undefined'||v_instance_id==''){
			EMsg("未找到INSTANCE_ID标识!");
			return;
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '您确定要选择此项吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			window.returnValue=v_instance_id;
		   			window.close();
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});
	}
	
	function platChooseCIForName(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		if(rows.length < 1){
			EMsg("请至少选择一项!");
			return;
		}
		var v_instance_id = rows[0].get("INSTANCE_ID");
		var v_short_desc = rows[0].get("SHORT_DESCRIPTION");
		if(typeof(v_instance_id)=='undefined'||v_instance_id==''){
			EMsg("未找到INSTANCE_ID标识!");
			return;
		}
		if(typeof(v_short_desc)=='undefined'||v_short_desc==''){
			EMsg("未找到SHORT_DESCRIPTION标识!");
			return;
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '您确定要选择此项吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var v_obj = new Object();   
   					v_obj.ID = v_instance_id;
   					v_obj.NAME = v_short_desc;
					window.returnValue=v_obj;
		   			window.close();
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});
	}
	
	function planChoosePrerequis(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			window.returnValue='';
			window.close();
			return;
		}
		
		var highIds = [];
		for (var i = 0, row; row = rows[i]; i++){
			var TASK_CODE = row.get("TASK_CODE");
			if(typeof(TASK_CODE)=='undefined'||TASK_CODE==''){
				EMsg("未找到TASK_CODE任务标识!");
				return;
			}
	    	highIds[i] = TASK_CODE;
		}
		
		window.returnValue=highIds.join(',');
		window.close();
	}
	
	function infoChooseTask(grid){
		var arry = getURLSearch();
		var V_TASK_SERIAL = arry['id'];
		var V_PROJECT_ID = arry['proid'];
		var sHref="/workshop/query/show_result.html?result="+$getSysVar('TASK_CHOOSE_PLAN_SQL_ID')+"&id="+V_PROJECT_ID+"&serial="+V_TASK_SERIAL;
		var width = screen.availWidth - 10;
    	var height = screen.availHeight - 30;
		var sPara='dialogWidth:'+width+';dialogHeight:'+height+';status:no;help:no;resizable:yes';
		var oDialogWin = window.showModalDialog(sHref,window,sPara);
		if(oDialogWin=='OK'){
			grid.search();
		}
	}
	
	function issuChooseITDemand(grid){
		var arry = getURLSearch();
		var V_ISSUANCE_REQUEST_ID = arry['id'];
		var sHref="/workshop/query/show_result.html?result="+$getSysVar('AH_RELAED_IT_DEMAND_LIST')+"&id="+V_ISSUANCE_REQUEST_ID;
		var width = screen.availWidth - 10;
    	var height = screen.availHeight - 30;
		var sPara='dialogWidth:'+width+';dialogHeight:'+height+';status:no;help:no;resizable:yes';
		var oDialogWin = window.showModalDialog(sHref,window,sPara);
		if(oDialogWin=='OK'){
			grid.search();
		}
	}
	
	function issuRelaITDemand(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			EMsg("请至少选择一张IT需求!");
			return;
		}
		
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		for (var i = 0, row; row = rows[i]; i++){
			var REQUEST_ID = row.get("REQUEST_ID");
			if(typeof(REQUEST_ID)=='undefined'||REQUEST_ID==''){
				EMsg("未找到REQUEST_ID标识!");
				return;
			}
			var V_REQUEST_ID = sendXml.createElement("REQUEST_ID"); 
			V_REQUEST_ID.text =REQUEST_ID;
			root.appendChild(V_REQUEST_ID);
		}
		
		var arry = getURLSearch();
		var V_ISSUANCE_REQUEST_ID = arry['id'];
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST","/servlet/AhFlowManagerServlet?tag=315&ISSUANCE_REQUEST_ID="+V_ISSUANCE_REQUEST_ID,false);
		xmlhttp.send(sendXml);
		if (isSuccess(xmlhttp)){
			MMsg("关联成功");
			window.returnValue="OK";
			window.close();
		}else{
			EMsg("关联失败！");
		}
	}
	
	function taskRelaPlan(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			EMsg("请至少选择一条项目计划!");
			return;
		}
		
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		for (var i = 0, row; row = rows[i]; i++){
			var TASK_CODE = row.get("TASK_CODE");
			if(typeof(TASK_CODE)=='undefined'||TASK_CODE==''){
				EMsg("未找到TASK_CODE任务标识!");
				return;
			}
			var V_TASK_CODE = sendXml.createElement("TASK_CODE"); 
			V_TASK_CODE.text =TASK_CODE;
			root.appendChild(V_TASK_CODE);
		}
		
		var arry = getURLSearch();
		var project_id = arry['id'];
		var task_serial = arry['serial'];
		var xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp2.Open("POST","/servlet/AhFlowManagerServlet?tag=157&PROID="+project_id+"&taskSerial="+task_serial,false);
		xmlhttp2.send(sendXml);
		if (isSuccess(xmlhttp2)){
			MMsg("选择成功");
			window.returnValue="OK";
			window.close();
		}else{
			EMsg("选择失败！");
		}
	}
	
	function exportExcelModelForReportWork(grid){
		var arry = getURLSearch();
		var V_TASK_SERIAL = arry['id'];
		location.href = "/servlet/AhFlowManagerServlet?tag=162&task_serial="+V_TASK_SERIAL;
	}
	
	function importReportWorkExcel(grid){
		var sHref="/workshop/projectManagement/report_work_excel_import.html";
		var sPara='dialogwidth:449px;dialogheight:80px;status:no;help:no;resizable:yes';
		var oDialogWin = window.showModalDialog(sHref,window,sPara);
		if(oDialogWin=='OK'){
			grid.search();
			top.document.execCommand("refresh");
		}
	}
	
	function projectPlanExcelImport(){
			var sHref="/workshop/projectManagement/project_plan_excel_import.html";
			var sPara='dialogwidth:449px;dialogheight:80px;status:no;help:no;resizable:yes';
			var oDialogWin = window.showModalDialog(sHref,null,sPara);
			if(oDialogWin=='OK'){
				grid.search();
			}
	}
	
	function stakeholdersExcelImport(){
			var sHref="/workshop/projectManagement/stakeholders_excel_import.html";
			var sPara='dialogwidth:449px;dialogheight:80px;status:no;help:no;resizable:yes';
			var oDialogWin = window.showModalDialog(sHref,null,sPara);
			if(oDialogWin=='OK'){
				grid.search();
			}
	}
	
	function companyStakeholdersExcelImport(){
			var sHref="/workshop/projectManagement/company_stakeholders_excel_import.html";
			var sPara='dialogwidth:449px;dialogheight:80px;status:no;help:no;resizable:yes';
			var oDialogWin = window.showModalDialog(sHref,null,sPara);
			if(oDialogWin=='OK'){
				grid.search();
			}
	}
	
	function versionChooseFunction(grid){
		var arry = getURLSearch();
		var V_REQUEST_ID = arry['V_REQUEST_ID'];
		var sHref="/workshop/form/ahFormFile/versionChooseFunction.html?id="+V_REQUEST_ID;
		var width = screen.availWidth - 10;
    	var height = screen.availHeight - 30;
		var sPara='dialogWidth:'+width+';dialogHeight:'+height+';status:no;help:no;resizable:yes';
		var oDialogWin = window.showModalDialog(sHref,window,sPara);
		if(oDialogWin=='OK'){
			grid.search();
		}
	}
	
	function dbClickITDemand(grid){
		var row = grid.getSelectionModel().getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		
		var V_REQUEST_ID = row.get("REQUEST_ID");
		if(typeof(V_REQUEST_ID)=='undefined'||V_REQUEST_ID==""){
			alert("没有找到REQUEST_ID标识!");
			return;
		}
		
		parent.functionListIFrame.location.replace("/workshop/query/show_result.html?result="+$getSysVar('FUNCTION_LIST_SQL_ID')+"&SUB_REQUEST_ID="+parent.document.getElementById("sub_request_id").value+"&V_REQUEST_ID="+V_REQUEST_ID);
	}
	
	function addVersionFunction(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			EMsg("请至少选择一个功能点!");
			return;
		}
		
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		for (var i = 0, row; row = rows[i]; i++){
			var V_MAIN_REQUEST_ID = row.get("MAIN_REQUEST_ID");
			if(typeof(V_MAIN_REQUEST_ID)=='undefined'||V_MAIN_REQUEST_ID==''){
				EMsg("未找到MAIN_REQUEST_ID标识!");
				return;
			}
			var V_SECOND_REQUEST_ID = row.get("SECOND_REQUEST_ID");
			if(typeof(V_SECOND_REQUEST_ID)=='undefined'||V_SECOND_REQUEST_ID==''){
				EMsg("未找到SECOND_REQUEST_ID标识!");
				return;
			}
			var V_REQUEST_ID_INFO = sendXml.createElement("REQUEST_ID_INFO");
			root.appendChild(V_REQUEST_ID_INFO);
			var VV_MAIN_REQUEST_ID = sendXml.createElement("MAIN_REQUEST_ID"); 
			VV_MAIN_REQUEST_ID.text =V_MAIN_REQUEST_ID;
			V_REQUEST_ID_INFO.appendChild(VV_MAIN_REQUEST_ID);
			var VV_SECOND_REQUEST_ID = sendXml.createElement("SECOND_REQUEST_ID"); 
			VV_SECOND_REQUEST_ID.text =V_SECOND_REQUEST_ID;
			V_REQUEST_ID_INFO.appendChild(VV_SECOND_REQUEST_ID);
		}
		
		var arry = getURLSearch();
		var v_sub_request_id = arry['SUB_REQUEST_ID'];
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST","/servlet/AhFlowManagerServlet?tag=165&sub_request_id="+v_sub_request_id,false);
		xmlhttp.send(sendXml);
		if (isSuccess(xmlhttp)){
			MMsg("操作成功");
			window.returnValue="OK";
			window.close();
		}else{
			EMsg("操作失败！");
		}
	}
	
	function chooseSheetNo(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		if(rows.length < 1){
			EMsg("请至少选择一张要追加的工单!");
			return;
		}	
		var v_flow_id = rows[0].get("FLOW_ID");
		if(typeof(v_flow_id)=='undefined'||v_flow_id==''){
			EMsg("未找到FLOW_ID标识!");
			return;
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '您确定要追加这张工单吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			window.returnValue=v_flow_id;
		   			window.close();
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});
	}
	
	function addAhDataCfgRelaDemand(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			EMsg("请至少选择一张需求单!");
			return;
		}
		
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		for (var i = 0, row; row = rows[i]; i++){
			var v_request_id = row.get("REQUEST_ID");
			if(typeof(v_request_id)=='undefined'||v_request_id==''){
				EMsg("未找到REQUEST_ID标识!");
				return;
			}
			var main_request_id = sendXml.createElement("MAIN_REQUEST_ID"); 
			main_request_id.text =v_request_id;
			root.appendChild(main_request_id);
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定要关联您所选择的需求单吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp2.Open("POST","/servlet/AhFlowManagerServlet?tag=145&SECOND_REQUEST_ID="+window.dialogArguments.REQUEST_ID.value+"&RELA_TYPE=5",false);
					xmlhttp2.send(sendXml);
					if (isSuccess(xmlhttp2)){
						MMsg("关联成功");
						window.returnValue="OK";
					}else{
						EMsg("关联失败！");
						window.returnValue="NO";
					}
					window.close();
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});
	}
	
	function addCustAhConfVerUpdateRela(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			EMsg("请至少选择一张事件单!");
			return;
		}
		
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		for (var i = 0, row; row = rows[i]; i++){
			var v_request_id = row.get("REQUEST_ID");
			if(typeof(v_request_id)=='undefined'||v_request_id==''){
				EMsg("未找到REQUEST_ID标识!");
				return;
			}
			var main_request_id = sendXml.createElement("MAIN_REQUEST_ID"); 
			main_request_id.text =v_request_id;
			root.appendChild(main_request_id);
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定要关联您所选择的事件单吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp2.Open("POST","/servlet/AhFlowManagerServlet?tag=145&SECOND_REQUEST_ID="+window.dialogArguments.REQUEST_ID.value+"&RELA_TYPE=3",false);
					xmlhttp2.send(sendXml);
					if (isSuccess(xmlhttp2)){
						MMsg("关联成功");
						window.returnValue="OK";
					}else{
						EMsg("关联失败！");
						window.returnValue="NO";
					}
					window.close();
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});
	}
	
	function addAhConfVerUpdateRela(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			EMsg("请至少选择一条记录!");
			return;
		}
		
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		for (var i = 0, row; row = rows[i]; i++){
			var v_request_id = row.get("REQUEST_ID");
			if(typeof(v_request_id)=='undefined'||v_request_id==''){
				EMsg("未找到REQUEST_ID标识!");
				return;
			}
			var second_request_id = sendXml.createElement("SECOND_REQUEST_ID"); 
			second_request_id.text =v_request_id;
			root.appendChild(second_request_id);
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定要关联您所选择的问题库吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp2.Open("POST","/servlet/AhFlowManagerServlet?tag=146&MAIN_REQUEST_ID="+window.dialogArguments.aheRequestId.value+"&RELA_TYPE=3",false);
					xmlhttp2.send(sendXml);
					if (isSuccess(xmlhttp2)){
						MMsg("关联成功");
						window.returnValue="OK";
					}else{
						EMsg("关联失败！");
						window.returnValue="NO";
					}
					window.close();
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});
	}
	
	function addAhConfVerUpdateRelaTop(grid){
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1){
			EMsg("请至少选择一条记录!");
			return;
		}
		
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		for (var i = 0, row; row = rows[i]; i++){
			var v_request_id = row.get("REQUEST_ID");
			if(typeof(v_request_id)=='undefined'||v_request_id==''){
				EMsg("未找到REQUEST_ID标识!");
				return;
			}
			var second_request_id = sendXml.createElement("SECOND_REQUEST_ID"); 
			second_request_id.text =v_request_id;
			root.appendChild(second_request_id);
		}
		Ext.Msg.show({
		   title:'提示',
		   msg: '确定要关联您所选择的问题库吗?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp2.Open("POST","/servlet/AhFlowManagerServlet?tag=146&MAIN_REQUEST_ID="+window.dialogArguments.REQUEST_ID.value+"&RELA_TYPE=3",false);
					xmlhttp2.send(sendXml);
					if (isSuccess(xmlhttp2)){
						MMsg("关联成功");
						window.returnValue="OK";
					}else{
						EMsg("关联失败！");
						window.returnValue="NO";
					}
					window.close();
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});
	}
	
	function tip(value,p,record){
		return "<div ext:qtip='<div style=\"font-size:10pt;padding:3;\">"+value+"</div>' ext:qtitle='详细信息：'>"+value+"</div>";	
	}
	
	function renderWordBreak(value,p,record){
		return "<table ><tr><td style='word-break :break-all;white-space:normal !important;'>"+value+"</td></tr></table>";
	}
	
	function openSingle(grid) {
		var row = grid.getSelectionModel().getSelected();
		if(typeof(row)=='undefined'){
			return;
		}
	   	var selectedRows = row.get("ID");
	   	var type = row.get("TASK_OR_EVENT");
	   	var event_type_id = row.get("TYPE"); //取得表单类型
	   	var content_id = row.get("CONTENT_ID");//取得流程或者环节标识
	   	var isBindForm =row.get("ISBINDFORM");//取得是否有绑定表单
	   	var send_url = row.get("SEND_URL"); //取得待办打开的链接
	   	if(send_url.indexOf('/')!=0){
	   		send_url = '/'+send_url;
	   	}
	   	var curr_window;
	  	x=(window.screen.width-780)/2;
	  	y=(window.screen.height-560)/2;
	  	var thetype = row.get("THETYPE");
	  	if(thetype==01||thetype==03){
	  		//curr_window=window.open('/WorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		//待办修改为点击直接打开表单界面，已启动也不先打开流转过程图 jiangmt 20100517
	  		if(event_type_id=="3"){//已启动
	  			if(isBindForm=="0")//无表单流程
	  				curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  			else
	  				curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}else if (event_type_id=="2"){//待办
	  			if(isBindForm=="0")//无表单流程
	  				curr_window=window.open('/TacheExec?tch_id=' +content_id+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  			else
	  				curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}else if(event_type_id =="F"){
	  			curr_window=window.open(send_url+'&task_id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}else{
	  			curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  	}else{
	  		//curr_window=window.open('/OtherWorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		  	if(event_type_id=="0" || event_type_id=="1" || event_type_id=="2"
		  		|| event_type_id=="3" || event_type_id=="g" || event_type_id=="H"){//这几个类型有走 流程在待办的已处理事务里直接打开流程图
	  			curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  		else{
	  			curr_window=window.open('/OtherWorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  	}
	  	curr_window.focus();
	}
	
	function percentRender(val, p, r) {
		return val + "%";
	}	

	  
	//导入数据
	function importExcel()
	{
	  window.open("/workshop/form/formFile/nx_tdistrList.html");
	}
      	
      	
     //下载Excel模板
	function downloadExcel()
	{
		
		window.open("/servlet/downloadservlet?action=2&filename=model.xls&pathname=%2Fworkshop%2Fform%2FformFile%2FnxTaskFlowMod.xls");
	
	}
	 //右键删除
	function deldata(grid)
	{   
		var row = grid.getSelectionModel().getSelected();
		if(typeof(row)=='undefined'){
			return;
		}
		var serid = row.get("FLOW_ID");
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
        sendRequest.open("post", '/servlet/FlowDispatch?tag=34&serialid='+serid,false);
        sendRequest.send();
        if (sendRequest.readyState == 4 && sendRequest.status == 200) {
 	          var retXml = sendRequest.responseXML;
 	          var errCode = retXml.selectSingleNode("/root/error_code");
 	          if (errCode.text == 0) {
 	              alert("删除成功！");
 	              window.location.reload(); 
 	              return true;
 	          }else{
 	             alert("删除失败！");
 	        	 return false;
 	          }
         }
	}
	
	function doSure(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			alert("请选择一条记录!")
			return;
		}
		
		var	sId = row.id;
		window.returnValue = sId;
		window.close();
	}	
	function afterEvent(){		
		var grid = Global.grid;		
		var store = grid.getStore(); 
		var arr = [];
		for (var i = 0; i < store.data.length; i++) { 
			var record = store.getAt(i);
			arr.push(record.data.V_STATE);
		}	
		if(store.data.length > 0 && arr.join(",").indexOf("是")!=-1){						
			var soundDom = document.getElementById("bgsound");
			if(!soundDom){
				var eb = document.createElement("EMBED");
				eb.id = "bgsound";
				eb.loop = 0;
				eb.showStatusBar = false;
				eb.autostart = false;
				eb.hidden = true;
				eb.src = "../../resource/media/highCharge.wav";						
				document.body.appendChild(eb);			
				soundDom = document.getElementById("bgsound");	
			}
			setTimeout(function(){				
				soundDom.play();	
			},2000);						
		}
	}	
	function adjustPrivi(value, cellmeta, record, rowIndex, columnIndex, store) {
	var id=record.get("ID");
	var eventtype=record.get("TASK_OR_EVENT");
	var sort_id=record.get("SORT_ID");	
	var rec = "";	
	if(sort_id=='0'){
	 rec = "<a href=\"javascript:uptop('"
			+ id+"','"+eventtype
			+ "')\"><img border=\"0\" src=\"../../resource/image/indexImage/headtopic_1.gif\" width=\"20\" height=\"16\" alt=\"置顶\"></a>"
	}else{		
			rec = "<a href=\"javascript:canceluptop('"
			+ id
			+ "','"+eventtype+"')\"><img border=\"0\" src=\"../../resource/image/indexImage/digest_1.gif\" width=\"20\" height=\"16\" alt=\"取消置顶\"></a>";
	}
	return rec;
}

	function cellClick(self, rowIndex, columnIndex, e) {
		var formUrl = "/workshop/form/index.jsp?callback=window.opener.callbackFn()";
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		var TheTestInfo="resizable=yes;dialogWidth=1260px;dialogHeight=300px;help=0;scroll=0;status=0;";
		
		var colModel = self.getColumnModel();
		var colName = colModel.getDataIndex(columnIndex);
	    var row=self.getStore().getAt(rowIndex);
	    
	    var eventId = row.get('ID');
	    var traceContent = row.get('跟踪内容');
		if(colName != "跟踪内容"){
			return false;
		}
		else
		{
			showWinForTextFieldToBigger(eventId,traceContent,self);
		}
	}
	
	function showWinForTextFieldToBigger(eventId,traceContent,grid) {
		var wmWin = new Ext.Window({
			title : '跟踪内容',
			width : 480,
			height : 270,
			border : false,
			resiable : true,
			modal : true,
			layout : 'fit',
			autoScroll : true,
			items : [{
				xtype : "textarea",
				id	  : 'trace_content',
				value : traceContent
			}],
			buttons : [{
				text : '确定',
				region : "center",
				handler : function() {
					if(Ext.getCmp('trace_content').getValue() != "" && Ext.getCmp('trace_content').getValue() != traceContent){
						writeTrace(eventId,Ext.getCmp('trace_content').getValue(),grid);
					}else if(Ext.getCmp('trace_content').getValue() == "" && traceContent != ""){
						writeTrace(eventId,Ext.getCmp('trace_content').getValue(),grid);
					}
					wmWin.close();
				}
			},{
				text : '关闭',
				region : "center",
				handler : function() {
					wmWin.close();
				}
			}]
		});
		wmWin.show();
	}
	
	function writeTrace(event_id,trace_content,grid){
	   	Ext.Ajax.request({
					url : '../../servlet/flowconfig.do',
				params : {
					method : 'writeTrace',
					id : event_id,
					content:trace_content
				},
				success : function(resp, opts) {
					var respInfo = Ext.util.JSON.decode(resp.responseText);

				if(respInfo.issucess=="true"){
					//window.location.reload()
					grid.store.reload();
					}else{
				  Ext.Msg.alert('提示', '写入失败');
			}

		},
		failure : function(resp, opts) {
			Ext.Msg.alert('提示', '写入失败');
		}

		});
	}
	
	function uptop(event_id,type){
   	Ext.Ajax.request({
				url : '../../servlet/flowconfig.do',
			params : {
				method : 'uppriority',
				id : event_id,
				type:type
			},
			success : function(resp, opts) {
				var respInfo = Ext.util.JSON.decode(resp.responseText);

			if(respInfo.issucess=="true"){
   window.location.reload()
				}else{
			  Ext.Msg.alert('提示', '置顶失败');
		}

	},
	failure : function(resp, opts) {
		Ext.Msg.alert('提示', '置顶失败');
	}

	});
}
	function canceluptop(event_id,type){
				   	Ext.Ajax.request({
								url : '../../servlet/flowconfig.do',
							params : {
								method : 'canceluppriority',
								id : event_id,
								type:type
							},
							success : function(resp, opts) {
								var respInfo = Ext.util.JSON.decode(resp.responseText);

								if(respInfo.issucess=="true"){

			    window.location.reload()
								}else{
							  Ext.Msg.alert('提示', '取消置顶失败');
						}

					},
					failure : function(resp, opts) {
						Ext.Msg.alert('提示', '取消置顶失败');
					}

				});
			}
			
function checkHasCryptoJS() {
	if(typeof CryptoJS === "undefined" ||
		(typeof window.CryptoJS !== "undefined" && typeof CryptoJS.enc === "undefined")) {
		$import("../../resource/js/encode/aes.js", "Common.js");
		$import("../../resource/js/encode/mode-ecb.js", "Common.js");
	}
}