function deploy(grid){	
	var records = grid.getSelectionModel().getSelections();
	if( records.length > 0 ){
		var myMask = new Ext.LoadMask(Ext.getBody(), {msg:'生成文件中,请稍等...'});
		myMask.show();
		var instanceIds = [];
		for(var i = 0; i<records.length; i++){
			instanceIds.push(records[i].data.INSTANCE_ID);
		}	
		var agentForm = document.getElementById("agentForm");
		if(!agentForm){
			var form = document.createElement("form");
			form.id = "agentForm";			
			form.action = "/servlet/agentGeneration.do";
			form.method = "post";
			var hid = document.createElement("input");
			hid.type = "hidden";
			hid.name = "agentHid";
			hid.id = "agentHiddenId";
			hid.value = instanceIds.join(",");
			form.appendChild(hid);
			document.body.appendChild(form);
			document.getElementById("agentForm").submit();
		}else{
			document.getElementById("agentHiddenId").value = instanceIds.join(",");
			agentForm.submit();
		}
		myMask.hide();	
	}else{
		Ext.Msg.alert("系统提示","请选择最少一台agent进行生成配置文件!")   
	}
}