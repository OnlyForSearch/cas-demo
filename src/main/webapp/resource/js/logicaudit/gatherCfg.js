function showGatherCfg(adnshow){
	var sAdvance=$getSysVar('LOGIC_DATA_GATHER_SHOW_ADVANCE');
	if(sAdvance!=null && sAdvance=='1'){
  	showAdvanceOption(true);
  //	colGen.style.visibility='hidden';
  }
  else{
  	showAdvanceOption(false);
  	//colAdn.style.visibility='hidden';
  }
  
  if(adnshow!=null) {
		if(adnshow=="1" || adnshow==''){
				showAdvanceOption(true);
				colGen.style.visibility ='hidden';
		}else{
				showAdvanceOption(false);
				colAdn.style.visibility ='hidden';
		}
	}
}
function showAdvanceOption(advance){
	if(advance){
			document.getElementById("oAdvanced0").style.display='block';
			document.getElementById("oAdvanced1").style.display='block';
			document.getElementById("oSimple0").style.display='none';
			document.getElementById("oSimple1").style.display='none';
			C_SHOW_ADVANCE_CFG.value ="1";
	}
	else{
			document.getElementById("oAdvanced0").style.display='none';
			document.getElementById("oAdvanced1").style.display='none';
			document.getElementById("oSimple0").style.display='block';
			document.getElementById("oSimple1").style.display='block';
			C_SHOW_ADVANCE_CFG.value ="0";
	}
}

function insertSysvar(str){
	  var obj = document.getElementById("C_COLUMNGENERAL_PLSQL");
		if(document.getElementById("oAdvanced1").style.display=='block'){
				  obj = document.getElementById("C_COLUMNGATHER_PLSQL");
		}
    var ubbubbLength=obj.value.length;  
    obj.focus();  
    if(typeof document.selection !="undefined"){  
        document.selection.createRange().text=str;  
    }
    else{
        obj.value=obj.value.substr(0,obj.selectionStart)+str+
        obj.value.substring(obj.selectionStart,ubbLength);  
    }  
}

function cfgFieldDesc(neId,regionId,gatherTitle,gatherId,drId){
	 var logic_data_gather_id = LOGIC_DATA_GATHER.XMLDocument.selectSingleNode("/Msg/LOGIC_DATA_GATHER_ID").text ;
	 if(logic_data_gather_id==''){logic_data_gather_id =gatherId; }
	 
	 var field_desc_id =  C_FIELD_DESC_ID.value;
	  if(field_desc_id!="" && field_desc_id!=null){
        modifyTaFieldDesc(field_desc_id,"LOGIC_DATA_GATHER","LOGIC_DATA_GATHER_ID",
        	logic_data_gather_id,window.dialogArguments[1],window,neId,regionId,gatherTitle,gatherId);
     }
     if(field_desc_id==""){
       addTaFieldDesc("LOGIC_DATA_GATHER","LOGIC_DATA_GATHER_ID",logic_data_gather_id,
       	window.dialogArguments[1],window,neId,regionId,gatherTitle,gatherId,drId);
     }
}

function generalReportSQL(){
		if(C_SHOW_ADVANCE_CFG.value=="0"){
		  var genSql = C_COLUMNGENERAL_PLSQL.value;
		  if(genSql!=''){
		  			if(genSql.substr(genSql.length-1,1)!=';'){
		  				genSql = genSql+";";
		  			}
		  	  	var qXML = new ActiveXObject("Microsoft.XMLDOM");
	  				qXML.loadXML("<root><query><![CDATA["+genSql+"]]></query></root>");
			   	  xmlhttp.Open("POST",url+"&tag=10",false);
			   	  xmlhttp.send(qXML);
			   	  if(isSuccess(xmlhttp)){
			   	  	 var _value = xmlhttp.responseXML.selectSingleNode('/root/result').text;
			   	  	  _value = _value.replace('#GATHER_TITLE',C_SUBJECT.value);
			   	  	 genColumnSQL = _value;
			   	  	 C_COLUMNGATHER_PLSQL.value = _value;
			   	  	 LOGIC_DATA_GATHER.XMLDocument.selectSingleNode("/Msg/COLUMNGATHER_PLSQL").text = C_COLUMNGATHER_PLSQL.value;
	        		 LOGIC_DATA_GATHER.XMLDocument.selectSingleNode("/Msg/COLUMNGENERAL_PLSQL").text = C_COLUMNGENERAL_PLSQL.value;
			   	  	 return true;
			   	  }
			   	  else{
			   	  	return false;
			   	  }
		  }
	}
	 return true;
}

function changeSQLCfg(){
	 if(C_SHOW_ADVANCE_CFG.value =="1"){
	 			showAdvanceOption(true);
				colGen.style.visibility ='visible';
	 }
	 else{
	 	 showAdvanceOption(false);
				colAdn.style.visibility ='visible';
	 }
}