	function btnSure(grid)	{
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1)
		{
			EMsg("请至少选择一条记录!");
			return;
		}
		
		var codeStr = "";	
		var nameStr = ""	
		for (var i = 0, row; row = rows[i]; i++){
			codeStr = codeStr + row.get("CODE") + ",";
			nameStr = nameStr + row.get("NAME") + ",";
		}
		
		codeStr = codeStr.substr(0,codeStr.length-1);
		nameStr = nameStr.substr(0,nameStr.length-1);
		var result = {CODE:codeStr,NAME:nameStr};
		window.returnValue = result;
		window.close();
	}
	
	function btnCancel(){
		window.close();
	}