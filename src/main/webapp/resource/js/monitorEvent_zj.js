	var callbackFn;
	
	function bgrender(val, p, r){
	if(val!=0){
		return "<span style='background:red;width:100%'>"+val+"</span>";   
	}
	return val;
}
	function bgrender_test(val, p, r){
	if(val!='N'){
		return "<span style='background:red;width:100%'>"+val+"</span>";   
	}
	return val;
}
function bgrender_jf(val, p, r){
        if(Math.abs(val)>200){
                return "<span style='background:red;width:100%'>"+val+"</span>";
        }
        return val;
}
function bgrender_jff(val, p, r){
        if(val>100000){
                return "<span style='background:red;width:100%'>"+val+"</span>";
        }
        return val;
}
	function bgrender_rizhi(val, p, r){
	if(val>0){
		return "<span style='background:red;width:100%'>"+val+"</span>";   
	}
	return val;
}
	
	
	
	function aa(record,rowIndex,rowParams,store)
{
//alert('��ȥ');
 var v1=record.get('STAFF_ID');//KPI_ID�ֶ�����Ҫ��д
//alert(v1);
 //alert('����');
 
//��ȡ�м�¼��KPI_ID�ֶε�ֵ,Ȼ����ݲ�ͬ��ֵ������CSS����Ĳ�ͬ��ʽ
 if (v1==1){
 	//alert('��ȥ');
 	//alert(v1);
 	  //rowParams.tstyle = "color:red"
    return 'x-grid-back-red';	
  }  

}
	function bb(record,rowIndex,rowParams,store)
{
//alert('��ȥ');
 var v1=record.get('B_DUISHI');//KPI_ID�ֶ�����Ҫ��д
 var v2=record.get('B_HUAJIE');
  var v3=record.get('C_HUAJIE');
   var v4=record.get('C_HUAJIE');
    var v5=record.get('D_HUAJIE');
     var v6=record.get('D_HUAJIE');
      var v7=record.get('E_HUAJIE');
       var v8=record.get('E_HUAJIE');
        var v9=record.get('F_HUAJIE');
         var v10=record.get('F_HUAJIE');
       
//alert(v1);
 //alert('����');
 
//��ȡ�м�¼��KPI_ID�ֶε�ֵ,Ȼ����ݲ�ͬ��ֵ������CSS����Ĳ�ͬ��ʽ
 if (v1!=0||v2 !=0 ||v3!=0||v4 !=0||v5!=0||v6 !=0||v7 !=0||v8 !=0||v9 !=0||v10 !=0){
 //	alert('��ȥ');
 //	alert(v1);
 	  //rowParams.tstyle = "color:red"
    return 'x-grid-back-red2';	
  }  

}
function cc(record,rowIndex,rowParams,store)
{
//alert('��ȥ');
 var v1=record.get('DIFF_MONTH_FEE');//KPI_ID�ֶ�����Ҫ��д
//alert(v1);
 //alert('����');
 
//��ȡ�м�¼��KPI_ID�ֶε�ֵ,Ȼ����ݲ�ͬ��ֵ������CSS����Ĳ�ͬ��ʽ
 if (v1!=0){
 //	alert('��ȥ');
 //	alert(v1);
 	  rowParams.tstyle = "color:red"
    return 'x-grid-back-red2';	
  }  

}
	function showForm(grid)
	{
		alert('1111');
		var row = grid.getSelectionModel()
				.getSelected();
		var	flow_id = row.get("FLOW_ID");
		var flowMod = row.get("FLOW_MOD");
		if(typeof(row)=='undefined'){
			return;
		}
		if(typeof(flow_id)=='undefined'||flow_id==""){
			alert("û���ҵ�����ID!");
			return;
		}
		if(typeof(flowMod)=='undefined'){
			flowMod = "";
		}
		var url = "/workshop/form/index.html?fullscreen=yes&flowId="+flow_id+"&flowMod="+flowMod;
		//var curr_window;
	  	//x=(window.screen.width-780)/2;
	  	//y=(window.screen.height-560)/2;
		//curr_window=window.open(url+'&system_code=G','SparePartEdit'+parseInt(1000*Math.random()),'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		doWindow_open(url);
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
		if(typeof(flow_id)=='undefined'){
			alert("û���ҵ�����ID!");
			return;
		}
		if(typeof(flowMod)=='undefined'){
			flowMod = "";
		}
		
		callbackFn = function(){dogridRefresh(grid)}
		var url = "/workshop/form/index.html?fullscreen=yes&flowId="+flow_id+"&flowMod="+flowMod+"&callback=window.opener.callbackFn()";
		doWindow_open(url);
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
			MMsg('��ȡ�б�ֵʧ��!');
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
		
			MMsg('��ȡ����ID����!');
			return;
		}
		
		if(typeof(flowMod)=='undefined'){
			flowMod = 0;
		}
		
		var sendUrl = row.get("SEND_URL");
		var serial_num = row.get("SERIAL_NUM");
		var callbackFn;
		callbackFn = function(){dogridRefresh(grid)}
		var url = "/workshop/form/index.html?callback=opener.callbackFn()&fullscreen=yes&flowId="+flow_id+"&flowMod="+flowMod;
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
			EMsg("������ѡ��һ����¼!");
			return;
		}
		
		var highIds = [];		
		for (var i = 0, row; row = rows[i]; i++)
		{
			tchId = row.get("TCH_ID");
			if(typeof(tchId)=='undefined'||tchId==''){
				EMsg("δ�ҵ�TCH_ID���ڱ�ʶ!");
				return;
			}
			highIds[i] = tchId;
		}
		Ext.Msg.show({
		   title:'��ʾ',
		   msg: 'ȷ��Ҫ������ѡ��ļ�¼��?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp.Open("POST",actionURL+"tag=12&tchId="+highIds.join(','),false);
					xmlhttp.send();
					if (isSuccess(xmlhttp))
					{
						MMsg("���ճɹ�!");
						grid.search();
					}
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});		
	}
	
	function autoDispatchTch(grid){
		checkHasCryptoJS();
		var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		
		if(rows.length < 1)
		{
			EMsg("������ѡ��һ����¼!");
			return;
		}
		
		var highIds = [];
		for (var i = 0, row; row = rows[i]; i++)
		{
			tchId = row.get("TCH_ID");
			flowId = row.get("FLOW_ID");
			if(typeof(flowId)=='undefined'||flowId==''){
				EMsg("δ�ҵ�FLOW_ID���̱�ʶ!");
				return;
			}
			if(typeof(tchId)=='undefined'||tchId==''){
				EMsg("δ�ҵ�TCH_ID���ڱ�ʶ!");
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
	    			EMsg("����"+V_SERIAL+"δ�ҵ�ϵͳ����Ӧ��ά������!");
	    			return;
	    		}else{
	    			highIds[i] = tchId;
	    		}
	    	}else{
	    		EMsg("�������ݿ�ʧ��!");
	    		return;
	    	}
		}
		Ext.Msg.show({
		   title:'��ʾ',
		   msg: 'ȷ��Ҫ�ɷ���ѡ��ļ�¼��?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(btn){
		   		if(btn=='yes'){
		   			var xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp2.Open("POST","/servlet/FlowDispatch?tag=15&tchId="+highIds.join(',')+"&nextTchMod=9835",false);
					xmlhttp2.send();
					if (isSuccess(xmlhttp2))
					{
						MMsg("�ɷ��ɹ�!");
						grid.search();
					}
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});		
	}
	
	function tip(value,p,record){
		return "<div ext:qtip='<div style=\"font-size:10pt;padding:3;\">"+value+"</div>' ext:qtitle='��ϸ��Ϣ��'>"+value+"</div>";	
	}
	
	function renderWordBreak(value,p,record){
		return "<table ><tr><td style='word-break :break-all;white-space:normal !important;'>"+value+"</td></tr></table>";
	}
	function percentRender(val, p, r) {
	var aa
	aa = val.substr(1,12)
  return aa;
  } 
	
	function openSingle(grid) {
		var row = grid.getSelectionModel().getSelected();
		if(typeof(row)=='undefined'){
			return;
		}
	   	var selectedRows = row.get("ID");
	   	var type = row.get("TASK_OR_EVENT");
	   	var event_type_id = row.get("TYPE"); //ȡ�ñ�����
	   	var content_id = row.get("CONTENT_ID");//ȡ�����̻��߻��ڱ�ʶ
	   	var isBindForm =row.get("ISBINDFORM");//ȡ���Ƿ��а󶨱�
	   	var send_url = row.get("SEND_URL"); //ȡ�ô���򿪵�����
	   	if(send_url.indexOf('/')!=0){
	   		send_url = '/'+send_url;
	   	}
	   	var curr_window;
	  	x=(window.screen.width-780)/2;
	  	y=(window.screen.height-560)/2;
	  	var thetype = row.get("THETYPE");
	  	if(thetype==01||thetype==03){
	  		//curr_window=window.open('/WorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		//�����޸�Ϊ���ֱ�Ӵ򿪱����棬������Ҳ���ȴ���ת����ͼ jiangmt 20100517
	  		if(event_type_id=="3"){//������
	  			if(isBindForm=="0")//�ޱ�����
	  				curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  			else
	  				curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}else if (event_type_id=="2"){//����
	  			if(isBindForm=="0")//�ޱ�����
	  				curr_window=window.open('/TacheExec?tch_id=' +content_id+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  			else
	  				curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  		else{
	  			curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  	}else{
	  		//curr_window=window.open('/OtherWorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		  	if(event_type_id=="0" || event_type_id=="1" || event_type_id=="2"
		  		|| event_type_id=="3" || event_type_id=="g" || event_type_id=="H"){//�⼸���������� �����ڴ�����Ѵ���������ֱ�Ӵ�����ͼ
	  			curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  		else{
	  			curr_window=window.open('/OtherWorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  	}
	  	curr_window.focus();
	}
		
function checkHasCryptoJS() {
	if(typeof CryptoJS === "undefined" ||
		(typeof window.CryptoJS !== "undefined" && typeof CryptoJS.enc === "undefined")) {
		$import("../../resource/js/encode/aes.js", "Common.js");
		$import("../../resource/js/encode/mode-ecb.js", "Common.js");
	}
}