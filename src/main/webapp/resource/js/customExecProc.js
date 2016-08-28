function execProc(panel,item)
{
	var grid = null;	
	if(!panel.panelId){//gird
		grid = panel;
	}else{//面板
		for(var i=0;i<panel.items.items.length;i++){
			var grid = panel.items.items[i];
			if(grid['execProc_'+item.id.split('_')[1]] || grid.execProc){
				break;
			}
		}
	}
	var execProcName  = grid['execProc_'+item.id.split('_')[1]] || grid.execProc;
	
	if(!execProcName)
	{
		Ext.MessageBox.alert('提示','请检查表get_value_show_cfg.config_script是否有配置存储过程名称');
		return;
	}
	var reg = /:(\w+|[\u4E00-\u9FA5]+)/g;
	var result =  execProcName.match(reg);
	var matchs = [];
	//参数截取
	if(result){ 
	 	for(i=0;i<result.length;i++){
	 		matchs[i] = result[i].replace(':','');
	 	}
	}
	
	var selectionModel = grid.getSelectionModel();
	var rows = selectionModel.getSelections();
	if(rows.length < 1)
	{
		Ext.MessageBox.alert('提示','至少要选择一条记录');
		return;
	}
	
	var createXml = new ActiveXObject("Microsoft.XMLDOM");
	var root = createXml.createElement("root");
	createXml.appendChild(root);
	
	//过程名称
	var procName = createXml.createElement("execProcName");	
	procName.text = execProcName.replace(reg,'?');
	root.appendChild(procName);
	//参数名称
	var parms = createXml.createElement("paramNames");
	for(var j = 0;j<matchs.length;j++){		
		var xmlRow = createXml.createElement("paramName");
		xmlRow.text =  matchs[j];
		parms.appendChild(xmlRow);
	}	
	root.appendChild(parms);
	//参数值
	var xmlRows = createXml.createElement("paramValues");	 
	for (var i = 0, row; row = rows[i]; i++){		
		var xmlRow = createXml.createElement("paramValue");
		for(var j = 0;j<matchs.length;j++){		
			xmlRow.setAttribute(matchs[j],row.get(matchs[j]) );
		}
		xmlRows.appendChild(xmlRow);
	}
	root.appendChild(xmlRows);
	
	Ext.Msg.show({
	   title:'提示',
	   msg: '确定要对你选择记录进行'+item.text+'吗?',
	   buttons: Ext.Msg.YESNO,
	   fn: function(btn){
	   		if(btn=='yes'){
	   			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				xmlhttp.Open("POST","/servlet/highMonitorServlet?action=10",false);
				xmlhttp.send(createXml);
				if (isSuccess(xmlhttp))
				{
					 grid.search();
				}
	   		}
	   },
	   icon: Ext.MessageBox.QUESTION
	});	
}