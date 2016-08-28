var pageFilterConfArr = new Array();

function readFilterConf(arr,suburl,filterCode){
	var url = window.location.pathname;
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var submitURL = "../../servlet/pagefilterconfigservlet?tag=1&url=&filterCode="+filterCode;
	if(suburl!="" && suburl!=null){
		submitURL = suburl;
	}
	if(arr!=null && arr!=""){
		arr = new Array();
	}else{
		pageFilterConfArr = new Array();
	}
	xmlhttp.Open("POST",submitURL,false);
  	xmlhttp.send();

	var isOk = isSuccess(xmlhttp);
	if(isOk){
		//alert(xmlhttp.responseXML.xml)
		var element = xmlhttp.responseXML.selectSingleNode("/root/rowSet");
		while(element!=null && element.tagName == "rowSet"){
			var fieldId = element.selectSingleNode("FIELD_ID").text;
			var attributeName = element.selectSingleNode("ATTRIBUTE").text;
			var attributeValue = element.selectSingleNode("REAL_VALUE").text;
			
			var conf = new PageFilterConfig();
			conf.PAGE_FILTER_INST_ID = element.selectSingleNode("PAGE_FILTER_INST_ID").text;
			conf.PAGE_FILTER_CONFIG_ID = element.selectSingleNode("PAGE_FILTER_CONFIG_ID").text;
			conf.FIELD_ID = element.selectSingleNode("FIELD_ID").text;
			conf.ATTRIBUTE = element.selectSingleNode("ATTRIBUTE").text;
			conf.ATTRIBUTE_VALUE = element.selectSingleNode("ATTRIBUTE_VALUE").text;
			conf.ATTR_VALUE_TYPE = element.selectSingleNode("ATTR_VALUE_TYPE").text;
			conf.REMARK = element.selectSingleNode("REMARK").text;
			conf.REAL_VALUE = element.selectSingleNode("REAL_VALUE").text;
			if(arr!=null && arr!=""){
				arr.push(conf);
			}else{
				pageFilterConfArr.push(conf);
			}
			if(document.getElementById(fieldId)){			
				var obj = eval("document.all."+fieldId);
				//alert("document.all."+fieldId);
				if(obj!=null){
					try{
						if(eval(fieldId+"."+attributeName)=='undefind'){
							obj.setAttribute(attributeName,attributeValue);
						}else{
							eval(fieldId+"."+attributeName+"='"+attributeValue+"'");
						}
					}catch(e){
						alert("对象："+fieldId+"，属性："+attributeName+"，值："+attributeValue+"，初始化异常！");
					}
				}
			}
			element = element.nextSibling;
		}
	}
}

function savePageFilterConfig(arr,suburl){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	if(arr==null || arr==""){
		arr = pageFilterConfArr;
	}
	var sendXML='<?xml version="1.0" encoding="gb2312"?>';
	sendXML += '<root>';
	sendXML += '	<instanceSet>';
	for(var i=0;i<pageFilterConfArr.length;i++){
		var conf = pageFilterConfArr[i];
		var obj = document.getElementById(conf.FIELD_ID);
		if(obj){
			var AttributeValue = "";
			try{
				if(eval(conf.FIELD_ID+"."+conf.ATTRIBUTE)!="undefind" && eval(conf.FIELD_ID+"."+conf.ATTRIBUTE)!=null){
					AttributeValue = eval(conf.FIELD_ID+"."+conf.ATTRIBUTE);
				}else{
					AttributeValue = obj.getAttribute(conf.ATTRIBUTE);
				}
			}catch(e){
				//alert(eval(conf.FIELD_ID+"."+conf.ATTRIBUTE)!=null && eval(conf.FIELD_ID+"."+conf.ATTRIBUTE)!="");
				alert("保存异常！"+e.description+"\n"+conf.FIELD_ID+"."+conf.ATTRIBUTE+"="+eval(conf.FIELD_ID+"."+conf.ATTRIBUTE)+"\n"+conf.FIELD_ID+"."+conf.ATTRIBUTE+"="+eval(conf.FIELD_ID+"."+conf.ATTRIBUTE));
			}
			if(AttributeValue!=conf.ATTRIBUTE_VALUE && conf.ATTR_VALUE_TYPE=="1"){
				sendXML += '<rowSet>';
				sendXML += '	<PAGE_FILTER_INST_ID>'+conf.PAGE_FILTER_INST_ID+'</PAGE_FILTER_INST_ID>';
				sendXML += '	<PAGE_FILTER_CONFIG_ID>'+conf.PAGE_FILTER_CONFIG_ID+'</PAGE_FILTER_CONFIG_ID>';
				sendXML += '	<FIELD_ID>'+conf.FIELD_ID+'</FIELD_ID>';
				sendXML += '	<ATTRIBUTE>'+conf.ATTRIBUTE+'</ATTRIBUTE>';
				sendXML += '	<ATTRIBUTE_VALUE>'+AttributeValue+'</ATTRIBUTE_VALUE>';
				sendXML += '	<ATTR_VALUE_TYPE>'+conf.ATTR_VALUE_TYPE+'</ATTR_VALUE_TYPE>';
				sendXML += '	<REMARK>'+conf.REMARK+'</REMARK>';
				sendXML += '</rowSet>';
				
				conf.ATTRIBUTE_VALUE = AttributeValue;
			}
			else if(AttributeValue!=conf.ATTRIBUTE_VALUE && conf.ATTR_VALUE_TYPE=="2" && (conf.FIELD_ID=="CREATE_TIME1"||conf.FIELD_ID=="CREATE_TIME2"||conf.FIELD_ID=="LAST_SEND_TIME1"||conf.FIELD_ID=="LAST_SEND_TIME2"||conf.FIELD_ID=="gatherBeginDate1"||conf.FIELD_ID=="gatherBeginDate2"||conf.FIELD_ID=="sourceBeginDate1"||conf.FIELD_ID=="sourceBeginDate2"||conf.FIELD_ID=="analyzeBeginDate2"||conf.FIELD_ID=="analyzeBeginDate1"||conf.FIELD_ID=="reportMakeDate1"||conf.FIELD_ID=="reportMakeDate2"))
			{
				if(AttributeValue!=null && AttributeValue!="")
				{
					xmlhttp.Open("POST","../../servlet/pagefilterconfigservlet?tag=3&date="+AttributeValue,false);
					xmlhttp.send();
					if(isSuccess(xmlhttp)){
						var dayCount=xmlhttp.responseXML.selectSingleNode("/root/dayCount").text;
						AttributeValue="to_char(sysdate+("+dayCount+"),'yyyy-mm-dd')";
							
					}
				}
				sendXML += '<rowSet>';
				sendXML += '	<PAGE_FILTER_INST_ID>'+conf.PAGE_FILTER_INST_ID+'</PAGE_FILTER_INST_ID>';
				sendXML += '	<PAGE_FILTER_CONFIG_ID>'+conf.PAGE_FILTER_CONFIG_ID+'</PAGE_FILTER_CONFIG_ID>';
				sendXML += '	<FIELD_ID>'+conf.FIELD_ID+'</FIELD_ID>';
				sendXML += '	<ATTRIBUTE>'+conf.ATTRIBUTE+'</ATTRIBUTE>';
				sendXML += '	<ATTRIBUTE_VALUE>'+AttributeValue+'</ATTRIBUTE_VALUE>';
				sendXML += '	<ATTR_VALUE_TYPE>'+conf.ATTR_VALUE_TYPE+'</ATTR_VALUE_TYPE>';
				sendXML += '	<REMARK>'+conf.REMARK+'</REMARK>';
				sendXML += '</rowSet>';
				
				conf.ATTRIBUTE_VALUE = AttributeValue;
			}
		}
	}
	sendXML += '	</instanceSet>';
	sendXML += '</root>';
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.loadXML(sendXML);
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var submitURL = "../../servlet/pagefilterconfigservlet?tag=2";
	if(suburl!="" && suburl!=null){
		submitURL = suburl;
	}
		
	xmlhttp.Open("POST",submitURL,false);
  	xmlhttp.send(dXML);
  	
	var isOk = isSuccess(xmlhttp);
	if(isOk){
		MMsg("保存成功！");
	}
}

function resetPageFilterConfig(arr,filterCode){
	if(filterCode==null || filterCode==""){
		loadDefaultMultiSelection(oState,OPRT_STATE_LABEL,OPRT_STATE,"");
		loadDefaultMultiSelection(oAlarmState,ALARM_STATE_LABEL,ALARM_STATE,"");
		loadDefaultMultiSelection(oLevel, ALARM_LEVEL_LABEL, ALARM_LEVEL,"");
		loadDefaultMultiSelection(oAlarmClass, ALARM_CLASS_LABEL, ALARM_CLASS,"");
	}
	for(var i=0;i<pageFilterConfArr.length;i++){
		var conf = pageFilterConfArr[i];
		var obj = document.getElementById(conf.FIELD_ID);
		var AttributeValue = "";
		try{
			if(obj){
				if(eval(conf.FIELD_ID+"."+conf.ATTRIBUTE)=='undefind'){
					obj.setAttribute(conf.ATTRIBUTE,"");
				}else{
					eval(conf.FIELD_ID+"."+conf.ATTRIBUTE+"=''");
				}
			}
		}catch(e){
			alert(conf.FIELD_ID+"."+conf.ATTRIBUTE+"置空异常！");
		}
	}
}

function PageFilterConfig(){

	this.PAGE_FILTER_INST_ID = "";
	
	this.PAGE_FILTER_CONFIG_ID = "";
	
	this.FIELD_ID = "";

	this.ATTRIBUTE = "";
	
	this.ATTRIBUTE_VALUE = "";
	
	this.ATTR_VALUE_TYPE = "";
	
	this.REMARK = "";
	
	this.REAL_VALUE = "";
	
}

function loadSearchConfig(filterCode,obj){
	var searchDiv="";
	var fieldId,fieldName;
	var isUsed="";
	var rowFlag="";
	var hideField="";
	var cnt=0;
	var forOneRow="";
	searchDiv="<table width='100%' border='0' cellspacing='0' cellpadding='0'>";
	searchDiv+="<tr><td colspan='2'>";
	searchDiv+="<table width='100%' border='0' cellspacing='0' cellpadding='0'>";
	searchDiv+="<tr><td height='8' colspan='6'><hr style='width:100%;color:#EF891B;display:none' size='1'></td></tr>";
	var submitURL = "../../servlet/pagefilterconfigservlet?tag=6&filterCode="+filterCode;
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",submitURL,false);
  	xmlhttp.send();
	var isOk = isSuccess(xmlhttp);
	if(isOk){
		var fieldXml = new ActiveXObject("Microsoft.XMLDOM");
		fieldXml.load(xmlhttp.responseXML);	
		//alert(fieldXml.xml)
		var rows = fieldXml.selectNodes("/root/rowSet");
		var rowNum=rows.length;
		for (var i=0;i<rowNum;i++){
			rowFlag=rows[i].selectSingleNode("ROW_FLAG").text;
			fieldId=rows[i].selectSingleNode("FIELD_ID").text;
			fieldName=rows[i].selectSingleNode("FIELD_NAME").text;			
			isUsed=rows[i].selectSingleNode("IS_USED").text;
			//alert(fieldName)
			//alert(isUsed)
			if(isUsed=="0BT"){
				if(rowFlag=="1"){
					forOneRow+="<tr>";
					forOneRow+="<td height='25' width='15'><IMG src='../../resource/image/arrow.gif' ></td>";
					forOneRow+="<td>"+fieldName+"</td>";
					forOneRow+="<td colspan=4>"+eval(fieldId)+"</td>";	
					forOneRow+="</tr>";			
				}else{
					cnt++;
					if(cnt%2==1){
				    	if(forOneRow!=""){
				    		searchDiv+=forOneRow;
				    		forOneRow="";
				    	}
						searchDiv+="<tr>";
						searchDiv+="<td height='25' width='15'><IMG src='../../resource/image/arrow.gif' ></td>";
						searchDiv+="<td>"+fieldName+"</td>";
						searchDiv+="<td>"+eval(fieldId)+"</td>";
					}else{
						searchDiv+="<td width='15'><IMG src='../../resource/image/arrow.gif' ></td>";
						searchDiv+="<td>"+fieldName+"</td>";
						searchDiv+="<td>"+eval(fieldId)+"</td>";
						searchDiv+="</tr>";
				    	if(forOneRow!=""){
				    		searchDiv+=forOneRow;
				    		forOneRow="";
				    	}
					}
				}
			}else{
				hideField=hideField+eval(fieldId);
			}
		}
		if(rowNum%2!=0){
			searchDiv+="<td>&nbsp;</td><td></td><td></td></tr>";
		}
	}
	searchDiv+="<tr><td colspan='6' align=right style='display:none'>"+hideField+"</td></tr></table>";
	//alert(searchDiv)
	document.getElementById(obj).innerHTML=searchDiv;
}

function loadSearchConfigNoc(filterCode,obj){
	var searchDiv="";
	var fieldId,fieldName;
	var isUsed="";
	var rowFlag="";
	var hideField="";
	var cnt=0;
	var forOneRow="";
	var submitURL = "../../servlet/pagefilterconfigservlet?tag=6&filterCode="+filterCode;
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",submitURL,false);
  	xmlhttp.send();
	var isOk = isSuccess(xmlhttp);
	if(isOk){
		var fieldXml = new ActiveXObject("Microsoft.XMLDOM");
		fieldXml.load(xmlhttp.responseXML);	
		var rows = fieldXml.selectNodes("/root/rowSet");
		var rowNum=rows.length;
		for (var i=0;i<rowNum;i++){
			rowFlag=rows[i].selectSingleNode("ROW_FLAG").text;
			fieldId=rows[i].selectSingleNode("FIELD_ID").text;
			fieldName=rows[i].selectSingleNode("FIELD_NAME").text;			
			isUsed=rows[i].selectSingleNode("IS_USED").text;
			if(isUsed=="0BT"){
				if(rowFlag=="1"){					
					searchDiv += "<div>";
					searchDiv += "	 <label for='"+fieldId+"'>"+fieldName+":</label>";
					searchDiv += "	 <span>"+eval(fieldId)+"</span>";
					searchDiv += "</div>";
				}else{
					searchDiv += "	 <label for='"+fieldId+"'>"+fieldName+":</label>";
					searchDiv += "	 <span>"+eval(fieldId)+"</span>";
				}
			}else{
				hideField=hideField+eval(fieldId);
			}
		}
	}
	document.getElementById(obj).innerHTML = searchDiv + "<div style='display:none'>"+hideField+"</div>";
}
