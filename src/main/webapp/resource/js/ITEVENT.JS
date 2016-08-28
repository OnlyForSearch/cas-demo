//新增区域
	var callbackFn;
	function showFormRegionInc(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261002&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	



//新增专业
	function showFormRegionSys(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261003&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	

//新增系统
	function showFormRegionPhe(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261004&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	

//新增事件来源
	function showFormRegionEve(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261005&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	
//新增优先级
	function showFormRegionUrg(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261006&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
//新增所处环节
	function showFormRegionTch(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261007&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	
//解决区域
	function showFormRegionTch2(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261008&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	
//解决专业
	function showFormRegionSys2(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261009&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	
//解决系统
	function showFormRegionPhe2(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261010&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	
	
//解决事件来源
	function showFormRegionEve2(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261011&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}

	
//解决优先级
	function showFormRegionUrg2(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261012&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}




//在途区域
	var callbackFn;
	function showFormRegionInc3(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261013&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	



//在途专业
	function showFormRegionSys3(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261014&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	

//在途系统
	function showFormRegionPhe3(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261015&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	
	

//在途事件来源
	function showFormRegionEve3(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261016&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
	

//在途所处环节
	function showFormRegionTch3(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261017&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	

	
//业务需求分析--区域
	function showFormRegionInc4(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261018&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
	
	
	
//业务需求分析--需求类型
	function showFormRegionType(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261019&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
		
		
//业务需求分析--部门
	function showFormRegionDept(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261020&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
		
		
		
//业务需求分析--所处环节
	function showFormRegionTch4(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261021&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
					
					
					
					
//业务需求分析--解决-区域
	function showFormRegionInc5(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261022&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
							
							
							
							
							
//业务需求分析--解决-需求类型
	function showFormRegionType2(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261023&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
	
	
	
	
//业务需求分析--解决-部门
	function showFormRegionDept2(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261024&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
							
	
	
	
	
	
//业务需求分析--在途-区域
	function showFormRegionInc6(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261026&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
			
			
			
			
			
			
//业务需求分析--在途-需求类型
	function showFormRegionType3(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261027&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
			
			

//业务需求分析--在途-部门
	function showFormRegionDept3(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261028&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
						
	
	
//IT需求分析--完成-区域
	function showFormRegionInc7(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261034&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
		
		
//IT需求分析--完成-专业
	function showFormRegionSys4(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261035&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
		
		
		
		
//IT需求分析--完成-系统
	function showFormRegionPhe4(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261036&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
		
		
		
		
//IT需求分析--完成-需求类型
	function showFormRegionType4(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261037&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
		
		
		
//IT需求分析--完成-支撑厂商
	function showFormRegionDept4(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	sdate = row.get("STARTDATE");
		var	edate = row.get("ENDDATE");
		var regionid = row.get("REGIONID");
		
		if(typeof(sdate)=='undefined'||sdate==""){
			alert("NO sdate选择时间!");
			return;
		}
		if(typeof(edate)=='undefined'||edate==""){
			alert("NO edate 选择时间!");
			return;
		}
		var x=(window.screen.width-780)/2;
	  	var y=(window.screen.height-560)/2;
	  	var isBindForm  = row.get("ISBINDFORM");
		var url = "/workshop/queryTemplate/mainFrame.html?result=5261038&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;
		if(isBindForm=="0")//无表单流程
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}	
					
					
					
					
					
//IT需求-新增-区域

	function showFormRegionIT(grid)

	{

		var row = grid.getSelectionModel()

				.getSelected();

		

		if(typeof(row)=='undefined'){

			return;

		}

		var	sdate = row.get("STARTDATE");

		var	edate = row.get("ENDDATE");

		var regionid = row.get("REGIONID");

		

		if(typeof(sdate)=='undefined'||sdate==""){

			alert("NO sdate选择时间!");

			return;

		}

		if(typeof(edate)=='undefined'||edate==""){

			alert("NO edate 选择时间!");

			return;

		}

		var x=(window.screen.width-780)/2;

	  	var y=(window.screen.height-560)/2;

	  	var isBindForm  = row.get("ISBINDFORM");

		var url = "/workshop/queryTemplate/mainFrame.html?result=5261025&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;

		if(isBindForm=="0")//无表单流程

			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

		else

			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

	}	

//IT需求-新增- 专业

	function showFormRegionIT1(grid)

	{

		var row = grid.getSelectionModel()

				.getSelected();

		

		if(typeof(row)=='undefined'){

			return;

		}

		var	sdate = row.get("STARTDATE");

		var	edate = row.get("ENDDATE");

		var regionid = row.get("REGIONID");

		

		if(typeof(sdate)=='undefined'||sdate==""){

			alert("NO sdate选择时间!");

			return;

		}

		if(typeof(edate)=='undefined'||edate==""){

			alert("NO edate 选择时间!");

			return;

		}

		var x=(window.screen.width-780)/2;

	  	var y=(window.screen.height-560)/2;

	  	var isBindForm  = row.get("ISBINDFORM");

		var url = "/workshop/queryTemplate/mainFrame.html?result=5261029&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;

		if(isBindForm=="0")//无表单流程

			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

		else

			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

	}	
	
	
//IT需求-新增- 系统

	function showFormRegionIT2(grid)

	{

		var row = grid.getSelectionModel()

				.getSelected();

		

		if(typeof(row)=='undefined'){

			return;

		}

		var	sdate = row.get("STARTDATE");

		var	edate = row.get("ENDDATE");

		var regionid = row.get("REGIONID");

		

		if(typeof(sdate)=='undefined'||sdate==""){

			alert("NO sdate选择时间!");

			return;

		}

		if(typeof(edate)=='undefined'||edate==""){

			alert("NO edate 选择时间!");

			return;

		}

		var x=(window.screen.width-780)/2;

	  	var y=(window.screen.height-560)/2;

	  	var isBindForm  = row.get("ISBINDFORM");

		var url = "/workshop/queryTemplate/mainFrame.html?result=5261030&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;

		if(isBindForm=="0")//无表单流程

			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

		else

			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

	}	
	
	
//IT需求-新增- 类型

	function showFormRegionIT3(grid)

	{

		var row = grid.getSelectionModel()

				.getSelected();

		

		if(typeof(row)=='undefined'){

			return;

		}

		var	sdate = row.get("STARTDATE");

		var	edate = row.get("ENDDATE");

		var regionid = row.get("REGIONID");

		

		if(typeof(sdate)=='undefined'||sdate==""){

			alert("NO sdate选择时间!");

			return;

		}

		if(typeof(edate)=='undefined'||edate==""){

			alert("NO edate 选择时间!");

			return;

		}

		var x=(window.screen.width-780)/2;

	  	var y=(window.screen.height-560)/2;

	  	var isBindForm  = row.get("ISBINDFORM");

		var url = "/workshop/queryTemplate/mainFrame.html?result=5261031&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;

		if(isBindForm=="0")//无表单流程

			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

		else

			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

	}	
	
		
//IT需求-新增- 环节

	function showFormRegionIT4(grid)

	{

		var row = grid.getSelectionModel()

				.getSelected();

		

		if(typeof(row)=='undefined'){

			return;

		}

		var	sdate = row.get("STARTDATE");

		var	edate = row.get("ENDDATE");

		var regionid = row.get("REGIONID");

		

		if(typeof(sdate)=='undefined'||sdate==""){

			alert("NO sdate选择时间!");

			return;

		}

		if(typeof(edate)=='undefined'||edate==""){

			alert("NO edate 选择时间!");

			return;

		}

		var x=(window.screen.width-780)/2;

	  	var y=(window.screen.height-560)/2;

	  	var isBindForm  = row.get("ISBINDFORM");

		var url = "/workshop/queryTemplate/mainFrame.html?result=5261032&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;

		if(isBindForm=="0")//无表单流程

			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

		else

			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

	}	
	
			
//IT需求-新增- 厂商

	function showFormRegionIT5(grid)

	{

		var row = grid.getSelectionModel()

				.getSelected();

		

		if(typeof(row)=='undefined'){

			return;

		}

		var	sdate = row.get("STARTDATE");

		var	edate = row.get("ENDDATE");

		var regionid = row.get("REGIONID");

		

		if(typeof(sdate)=='undefined'||sdate==""){

			alert("NO sdate选择时间!");

			return;

		}

		if(typeof(edate)=='undefined'||edate==""){

			alert("NO edate 选择时间!");

			return;

		}

		var x=(window.screen.width-780)/2;

	  	var y=(window.screen.height-560)/2;

	  	var isBindForm  = row.get("ISBINDFORM");

		var url = "/workshop/queryTemplate/mainFrame.html?result=5261033&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;

		if(isBindForm=="0")//无表单流程

			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

		else

			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

	}	
	
	
			
//IT需求-在途- 区域

	function showFormRegionITOnTheWay(grid)

	{

		var row = grid.getSelectionModel()

				.getSelected();

		

		if(typeof(row)=='undefined'){

			return;

		}

		var	sdate = row.get("STARTDATE");

		var	edate = row.get("ENDDATE");

		var regionid = row.get("REGIONID");

		

		if(typeof(sdate)=='undefined'||sdate==""){

			alert("NO sdate选择时间!");

			return;

		}

		if(typeof(edate)=='undefined'||edate==""){

			alert("NO edate 选择时间!");

			return;

		}

		var x=(window.screen.width-780)/2;

	  	var y=(window.screen.height-560)/2;

	  	var isBindForm  = row.get("ISBINDFORM");

		var url = "/workshop/queryTemplate/mainFrame.html?result=5261040&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;

		if(isBindForm=="0")//无表单流程

			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

		else

			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

	}	
	
				
//IT需求-在途- 专业

	function showFormRegionITOnTheWay1(grid)

	{

		var row = grid.getSelectionModel()

				.getSelected();

		

		if(typeof(row)=='undefined'){

			return;

		}

		var	sdate = row.get("STARTDATE");

		var	edate = row.get("ENDDATE");

		var regionid = row.get("REGIONID");

		

		if(typeof(sdate)=='undefined'||sdate==""){

			alert("NO sdate选择时间!");

			return;

		}

		if(typeof(edate)=='undefined'||edate==""){

			alert("NO edate 选择时间!");

			return;

		}

		var x=(window.screen.width-780)/2;

	  	var y=(window.screen.height-560)/2;

	  	var isBindForm  = row.get("ISBINDFORM");

		var url = "/workshop/queryTemplate/mainFrame.html?result=5261041&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;

		if(isBindForm=="0")//无表单流程

			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

		else

			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

	}	
				
//IT需求-在途- 系统

	function showFormRegionITOnTheWay2(grid)

	{

		var row = grid.getSelectionModel()

				.getSelected();

		

		if(typeof(row)=='undefined'){

			return;

		}

		var	sdate = row.get("STARTDATE");

		var	edate = row.get("ENDDATE");

		var regionid = row.get("REGIONID");

		

		if(typeof(sdate)=='undefined'||sdate==""){

			alert("NO sdate选择时间!");

			return;

		}

		if(typeof(edate)=='undefined'||edate==""){

			alert("NO edate 选择时间!");

			return;

		}

		var x=(window.screen.width-780)/2;

	  	var y=(window.screen.height-560)/2;

	  	var isBindForm  = row.get("ISBINDFORM");

		var url = "/workshop/queryTemplate/mainFrame.html?result=5261042&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;

		if(isBindForm=="0")//无表单流程

			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

		else

			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

	}	
				
//IT需求-在途- 类型

	function showFormRegionITOnTheWay3(grid)

	{

		var row = grid.getSelectionModel()

				.getSelected();

		

		if(typeof(row)=='undefined'){

			return;

		}

		var	sdate = row.get("STARTDATE");

		var	edate = row.get("ENDDATE");

		var regionid = row.get("REGIONID");

		

		if(typeof(sdate)=='undefined'||sdate==""){

			alert("NO sdate选择时间!");

			return;

		}

		if(typeof(edate)=='undefined'||edate==""){

			alert("NO edate 选择时间!");

			return;

		}

		var x=(window.screen.width-780)/2;

	  	var y=(window.screen.height-560)/2;

	  	var isBindForm  = row.get("ISBINDFORM");

		var url = "/workshop/queryTemplate/mainFrame.html?result=5261043&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;

		if(isBindForm=="0")//无表单流程

			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

		else

			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

	}	
				
//IT需求-在途-  厂商

	function showFormRegionITOnTheWay4(grid)

	{

		var row = grid.getSelectionModel()

				.getSelected();

		

		if(typeof(row)=='undefined'){

			return;

		}

		var	sdate = row.get("STARTDATE");

		var	edate = row.get("ENDDATE");

		var regionid = row.get("REGIONID");

		

		if(typeof(sdate)=='undefined'||sdate==""){

			alert("NO sdate选择时间!");

			return;

		}

		if(typeof(edate)=='undefined'||edate==""){

			alert("NO edate 选择时间!");

			return;

		}

		var x=(window.screen.width-780)/2;

	  	var y=(window.screen.height-560)/2;

	  	var isBindForm  = row.get("ISBINDFORM");

		var url = "/workshop/queryTemplate/mainFrame.html?result=5261044&STARTDATE="+sdate+"&ENDDATE="+edate+"&REGIONID="+regionid;

		if(isBindForm=="0")//无表单流程

			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

		else

			curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

	}			
	
	
	
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
			alert("记录是老版格式数据，请到ITSM老系统查询!");
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
			curr_window=window.open('/TacheExec?tch_id=' +serial_num+'&system_code=G','_blank','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		else
			curr_window=window.open(url,'_blank','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	}
				