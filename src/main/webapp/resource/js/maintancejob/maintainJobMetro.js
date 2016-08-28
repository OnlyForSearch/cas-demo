function obxConvertBoolean(_value){
	return _value=="0BT" ? true : false;
}
function booleanConvert0BX(_value){
	return _value==true ? "0BT" : "0BF";
}
function initRefAlarmCfg(){
	KPI_CYCLE.value = topCycle; //job_cycle;
	if(typeof MAINT_JOB_ITEM_ID !="undefined" ){
		var oItemId = MAINT_JOB_ITEM_ID.value ;
		if(oItemId==""){ 
			//BGN_EX_CURR_TIME
			begin_curr_day.setTime("00:00:00");
			//BGN_EX_PREI_TIME
			begin_peri_day.setTime("00:00:00");
			//END_EX_CURR_TIME
			end_curr_day.setTime("00:00:00");
			//END_EX_PREI_TIME
			end_peri_day.setTime("00:00:00");
			begin_peri_day.setEnable(true);
			end_curr_day.setEnable(true);
			end_peri_day.setEnable(true);
			
			return ;
		}
		xmlhttp.open("get",url+"tag=37&itemid="+oItemId,false);
		xmlhttp.send();
		if(isSuccess(xmlhttp)){
			var oXml = xmlhttp.responseXML;
			var row = oXml.selectSingleNode("/root/rowSet");
			if (!row) return ;
			//var job_cycle = oXml.selectSingleNode("/root/rowSet/JOB_CYCLE").text;
			var if_bgn_ex_curr = oXml.selectSingleNode("/root/rowSet/IF_BGN_EX_CURR").text;
			var bgn_ex_curr_time = oXml.selectSingleNode("/root/rowSet/BGN_EX_CURR_TIME").text;
			var if_bgn_ex_prei = oXml.selectSingleNode("/root/rowSet/IF_BGN_EX_PREI").text;
			var bgn_ex_prei_time = oXml.selectSingleNode("/root/rowSet/BGN_EX_PREI_TIME").text;
			var if_end_ex_curr = oXml.selectSingleNode("/root/rowSet/IF_END_EX_CURR").text;
			var end_ex_curr_time = oXml.selectSingleNode("/root/rowSet/END_EX_CURR_TIME").text;
			var if_end_ex_prei = oXml.selectSingleNode("/root/rowSet/IF_END_EX_PREI").text;
			var end_ex_prei_time = oXml.selectSingleNode("/root/rowSet/END_EX_PREI_TIME").text;
			var if_end_job_submit_kt = oXml.selectSingleNode("/root/rowSet/IF_END_JOB_SUBMIT_KT").text;
			var if_bgn_prei_job_submit_kt = oXml.selectSingleNode("/root/rowSet/IF_BGN_PREI_JOB_SUBMIT_KT").text;
			var bgn_before_ex_day = oXml.selectSingleNode("/root/rowSet/BGN_BEFORE_EX_DAY").text;
			
		
			if(document.getElementById("otherCycle").style.display!='none'){
				oIF_END_JOB_SUBMIT_KT.checked = true;
				oIF_BGN_EX_CURR.checked  =  obxConvertBoolean(if_bgn_ex_curr);
				if(if_bgn_prei_job_submit_kt=='0BF' && bgn_before_ex_day==""){
					oIF_BGN_EX_CURR.checked = true;
				}
			}
		
			IF_BGN_EX_CURR.checked = obxConvertBoolean(if_bgn_ex_curr);
			begin_curr_day.setTime( bgn_ex_curr_time );
			IF_BGN_EX_PREI.checked = obxConvertBoolean(if_bgn_ex_prei);
			begin_peri_day.setTime( bgn_ex_prei_time );
			IF_END_EX_CURR.checked = obxConvertBoolean(if_end_ex_curr)
			end_curr_day.setTime( end_ex_curr_time );
			IF_END_EX_PREI.checked = obxConvertBoolean(if_end_ex_prei)
			end_peri_day.setTime( end_ex_prei_time );
			IF_END_JOB_SUBMIT_KT.checked = obxConvertBoolean(if_end_job_submit_kt);
			oIF_END_JOB_SUBMIT_KT.checked = obxConvertBoolean(if_end_job_submit_kt);
			IF_BGN_PREI_JOB_SUBMIT_KT.checked = obxConvertBoolean(if_bgn_prei_job_submit_kt);
			BGN_BEFORE_EX_DAY.value = bgn_before_ex_day;
			if(bgn_before_ex_day!=""){
				oBGN_BEFORE_EX_DAY.checked = true;
			}
			else{
				oBGN_BEFORE_EX_DAY.checked = false;
			}
		}
	}
	else{
		document.getElementById("refAlarmCfg").style.display='none';
	}
}	

function saveRefAlarmCfg(){
	window.parent.isRefAlarmCfg = false;
	var maint_job_item_id = MAINT_JOB_ITEM_ID.value;
	if(document.getElementById("tab3").display=='none'){
		//如果不要,删除掉
		xmlhttp.open("get",url+"tag=39&itemid="+maint_job_item_id,false);
		xmlhttp.send();
		return true;
	}
	var errInfo = "自动判断->关联告警配置->时间段有误：【开始时间】必须小于【结束时间】";
	//开始选执行当日，结束选执行前日
	if(IF_BGN_EX_CURR.checked && IF_END_EX_PREI.checked){
		alert (errInfo);
		return false;
	}
	var job_cycle = topCycle;
	var if_bgn_ex_curr = booleanConvert0BX(IF_BGN_EX_CURR.checked);
	var bgn_ex_curr_time = begin_curr_day.getTime();
	var if_bgn_ex_prei = booleanConvert0BX(IF_BGN_EX_PREI.checked);
	var bgn_ex_prei_time = begin_peri_day.getTime();
	var if_end_ex_curr = booleanConvert0BX(IF_END_EX_CURR.checked);
	var end_ex_curr_time = end_curr_day.getTime();
	var if_end_ex_prei = booleanConvert0BX(IF_END_EX_PREI.checked);
	var end_ex_prei_time = end_peri_day.getTime();
	var if_end_job_submit_kt = booleanConvert0BX(IF_END_JOB_SUBMIT_KT.checked);
	if(document.getElementById("otherCycle").style.display!='none'){
		if_bgn_ex_curr =  booleanConvert0BX(oIF_BGN_EX_CURR.checked);
		if_end_job_submit_kt = booleanConvert0BX(oIF_END_JOB_SUBMIT_KT.checked);
	}
	
	var if_bgn_prei_job_submit_kt = booleanConvert0BX(IF_BGN_PREI_JOB_SUBMIT_KT.checked);
	var bgn_before_ex_day = BGN_BEFORE_EX_DAY.value;
	if(oBGN_BEFORE_EX_DAY.checked==false){
		bgn_before_ex_day = "";
	}
	else{
		if(BGN_BEFORE_EX_DAY.value.replace(/ /ig,'')==""){
			alert ("请输入提前天数");
			return false;
		}
	}

	//同时选执行当日
	if(IF_BGN_EX_CURR.checked && IF_END_EX_CURR.checked){
		if(bgn_ex_curr_time.replace(/:/ig,"")>end_ex_curr_time.replace(/:/ig,"")){
			alert (errInfo);
			return false;
		}
	}
	//同时选执行前日
	if(IF_BGN_EX_PREI.checked && IF_END_EX_PREI.checked){
		if(bgn_ex_prei_time.replace(/:/ig,"")>end_ex_prei_time.replace(/:/ig,"")){
			alert (errInfo);
			return false;
		}
	}
	
	 var doc = new ActiveXObject("Microsoft.XMLDOM");
	 doc.loadXML('<?xml version="1.0" encoding="GBK"?>'+
		 '<root><job_cycle>'+job_cycle+'</job_cycle>'+
		 '<if_bgn_ex_curr>'+if_bgn_ex_curr+'</if_bgn_ex_curr>'+
		 '<bgn_ex_curr_time>'+bgn_ex_curr_time+'</bgn_ex_curr_time>'+
		 '<if_bgn_ex_prei>'+if_bgn_ex_prei+'</if_bgn_ex_prei>'+
		 '<bgn_ex_prei_time>'+bgn_ex_prei_time+'</bgn_ex_prei_time>'+
		 '<if_end_ex_curr>'+if_end_ex_curr+'</if_end_ex_curr>'+
		 '<end_ex_curr_time>'+end_ex_curr_time+'</end_ex_curr_time>'+
		 '<if_end_ex_prei>'+if_end_ex_prei+'</if_end_ex_prei>'+
		 '<end_ex_prei_time>'+end_ex_prei_time+'</end_ex_prei_time>'+
		 '<if_end_job_submit_kt>'+if_end_job_submit_kt+'</if_end_job_submit_kt>'+
		 '<if_bgn_prei_job_submit_kt>'+if_bgn_prei_job_submit_kt+'</if_bgn_prei_job_submit_kt>'+
		 '<bgn_before_ex_day>'+bgn_before_ex_day+'</bgn_before_ex_day>'+
		 '<maint_job_item_id>'+maint_job_item_id+'</maint_job_item_id>'+
		 '</root>');
	 
	 xmlhttp.open("post",url+"tag=38",false);
	 xmlhttp.send(doc);
	 if(isSuccess(xmlhttp)){
		return true;
	 }
}

function mTimepicker(name,dateObj,showUID){
    this.name = name;
    this.dateObj = dateObj;
    this.hh = "";
    this.mm = "";
    this.ss = "";
    this.showUID = showUID;
    if(dateObj!=""){
  	  this.outputstr = '<table width="267" height="16"  border="0" cellpadding="0" cellspacing="0">'+
		  '<tr>'+
		    '<td height="16" nowrap><input style="border: 1px solid #999999; " maxlength="2" onKeyUp="return _checkdate13(0,23);"  id="h_'+this.name+'" type="text" size="2">&nbsp;时&nbsp;'+
 		    '<input style="border: 1px solid #999999; " maxlength="2" onKeyUp="return _checkdate13(0,59);" name="textfield2" id="m_'+this.name+'"  type="text" size="2">&nbsp;分&nbsp;'+
 		    '<input style="border: 1px solid #999999; " maxlength="2" onKeyUp="return _checkdate13(0,59);" name="textfield3" id="s_'+this.name+'"  type="text" size="2">&nbsp;秒&nbsp;'+
 		    '<img src="../../resource/image/line_schema.gif" style="width:10" title="清空时间" class="imgButton" onClick=resetTime("'+this.name+'")></td>'+
 		 '</tr>'+
	   '</table>';
    }
    if(showUID=="" || showUID==null){
      document.write(this.outputstr);
    }
    this.ini = function(){
    	document.getElementById(showUID).innerHTML = this.outputstr;
    }

    this.getTime = function(){
      var returnstr = "";
	  this.hh = document.getElementById("h_"+this.name).value==""?"00":document.getElementById("h_"+this.name).value;
	  this.mm = document.getElementById("m_"+this.name).value==""?"00":document.getElementById("m_"+this.name).value;
	  this.ss = document.getElementById("s_"+this.name).value==""?"00":document.getElementById("s_"+this.name).value;
	  //补0
	  if(this.hh.length<=1){
		this.hh = this.hh.length==0 ? "00" : "0"+this.hh;
	  }
	  if(this.mm.length<=1){
		this.mm =  this.mm.length==0 ? "00" : "0"+this.mm;
	  }
	  if(this.ss.length<=1){
		this.ss =  this.ss.length==0 ? "00" : "0"+this.ss;
	  }
	  
	  returnstr = this.hh;
	  returnstr = returnstr + ":" + this.mm;
	  returnstr = returnstr + ":" + this.ss;
	  
      return returnstr;
    }
    this.checkDate=function(){
      if(this.getTime()=="") return "";
          var returnstr = "";
          if(this.hh<0 || this.hh>23 ){
            alert("小时必须在0到23之间");
            returnstr = "false";
          }
          if( this.mm<0 || this.mm>59){
            alert("分钟必须在0到59之间");
            returnstr = "false";
          }
          if(this.ss<0 || this.ss>59){
            alert("秒钟必须在0到59之间");
            returnstr = "false";
          }
          return returnstr;
    }
	
	this.setTime = function(time){
		var arr = time.split(":");
		if(time==""){
			arr = ["","",""];
		}
		document.getElementById("h_"+this.name).value = arr[0];
		document.getElementById("m_"+this.name).value = arr[1];
		document.getElementById("s_"+this.name).value = arr[2];
	}

	this.setEnable = function(bValue){
		document.getElementById("h_"+this.name).disabled=bValue;
		document.getElementById("m_"+this.name).disabled=bValue;
		document.getElementById("s_"+this.name).disabled=bValue;
	}
	this.isNumber = function(){
		if(!isNumber(document.getElementById("h_"+this.name).value)){
			alert("您输入的时间不对！");
			document.getElementById("h_"+this.name).focus();
			document.getElementById("h_"+this.name).select();
			return false;
		}
		if(!isNumber(document.getElementById("m_"+this.name).value)){
			alert("您输入的时间不对！");
			document.getElementById("m_"+this.name).focus();
			document.getElementById("m_"+this.name).select();
			return false;
		}
		if(!isNumber(document.getElementById("s_"+this.name).value)){
			alert("您输入的时间不对！");
			document.getElementById("s_"+this.name).focus();
			document.getElementById("s_"+this.name).select();
			return false;
		}
		return true;
	}
}

/**
 * 清除日期
 */
function resetTime(obj){
	document.getElementById("h_"+obj).value = "";
	document.getElementById("m_"+obj).value = "";
	document.getElementById("s_"+obj).value = "";
}

function _checkdate13(min,max) {
	var regu = "^([0-9]{1,10})?$";
	var re = new RegExp(regu);
	if (!re.test(event.srcElement.value)){
		alert("只能输入数字");
		event.srcElement.value = "";
		return false;
	}else{
		if(parseInt(event.srcElement.value,10)<min || parseInt(event.srcElement.value,10)>max){
		  alert("输入的数字只能是"+min+"到"+max+"范围内！");		
          event.srcElement.value = "";
        }
	}		
	return true;
}

