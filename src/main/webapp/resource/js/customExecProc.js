function execProc(panel,item)
{
	var grid = null;	
	if(!panel.panelId){//gird
		grid = panel;
	}else{//���
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
		Ext.MessageBox.alert('��ʾ','�����get_value_show_cfg.config_script�Ƿ������ô洢��������');
		return;
	}
	var reg = /:(\w+|[\u4E00-\u9FA5]+)/g;
	var result =  execProcName.match(reg);
	var matchs = [];
	//������ȡ
	if(result){ 
	 	for(i=0;i<result.length;i++){
	 		matchs[i] = result[i].replace(':','');
	 	}
	}
	
	var selectionModel = grid.getSelectionModel();
	var rows = selectionModel.getSelections();
	if(rows.length < 1)
	{
		Ext.MessageBox.alert('��ʾ','����Ҫѡ��һ����¼');
		return;
	}
	
	var createXml = new ActiveXObject("Microsoft.XMLDOM");
	var root = createXml.createElement("root");
	createXml.appendChild(root);
	
	//��������
	var procName = createXml.createElement("execProcName");	
	procName.text = execProcName.replace(reg,'?');
	root.appendChild(procName);
	//��������
	var parms = createXml.createElement("paramNames");
	for(var j = 0;j<matchs.length;j++){		
		var xmlRow = createXml.createElement("paramName");
		xmlRow.text =  matchs[j];
		parms.appendChild(xmlRow);
	}	
	root.appendChild(parms);
	//����ֵ
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
	   title:'��ʾ',
	   msg: 'ȷ��Ҫ����ѡ���¼����'+item.text+'��?',
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