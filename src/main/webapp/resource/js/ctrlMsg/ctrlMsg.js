var CiCtrlMsg = new function(){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var dom = new ActiveXObject("Microsoft.XMLDOM");
	var httpUrl = getRealPath("../../../servlet/ControlMsgAction.do?","ctrlMsg.js");
	var id="";
	
	this.sendCtrlMsg = function(v_msg){
		dom.loadXML(v_msg);
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST", httpUrl+"method=sendCtrlMsg", false);
		xmlhttp.send(dom);
        if(isSuccess(xmlhttp)){
        	id=xmlhttp.responseXML.selectSingleNode("/root/id").text;
        }
		return id;
	};
	//消息异步时调用的函数
	this.sendCtrlMsgAsync = function(v_msg,callback){
		dom.loadXML(v_msg);
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST", httpUrl+"method=sendCtrlMsg", true);
		xmlhttp.onreadystatechange= function(){callback(xmlhttp);};
		xmlhttp.send(dom);
	};
	
	this.getCtrlMsgInst = function(v_batchId){
		dom = new ActiveXObject("Microsoft.XMLDOM");
		if(v_batchId!=null && v_batchId!=""){
			xmlhttp.Open("POST", httpUrl+"method=getCtrlMsgInst&batchId="+v_batchId, false);
	        xmlhttp.send();
	        if(isSuccess(xmlhttp))
	        	dom=xmlhttp.responseXML;
		}
		return dom;
	};
	/*
	this.getBimpTaskInsId = function(v_batchId){
		var response = this.getCtrlMsgInst(v_batchId).selectSingleNode("//RESPONSE_DESC").text;
		var BimpTaskInsId="";
		var dom = new ActiveXObject("Microsoft.XMLDOM");
		var dom.loadXML(response);
		if(dom.selectSingleNode("/BIMP-Information/BIMP-Task-Instance-Id"))
			BimpTaskInsId=dom.selectSingleNode("/BIMP-Information/BIMP-Task-Instance-Id").text;
		return BimpTaskInsId;
	};
	*/
	this.getCtrlClassCol = function(v_ciCtrlClassName,v_ciId){
		dom = new ActiveXObject("Microsoft.XMLDOM");
		if(v_ciCtrlClassName!=null && v_ciCtrlClassName!="" && v_ciId!=null && v_ciId!=""){
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.Open("POST", httpUrl+"method=getCtrlClassCol&ciCtrlClassName="+v_ciCtrlClassName+"&ciId="+v_ciId, false);
	        xmlhttp.send();
	        if(isSuccess(xmlhttp)){
	        	dom=xmlhttp.responseXML;
	        }
		}
		return dom;
	};
	
	this.getCtrlMsgInstState = function(v_batchId){
		var v_state="";
		if(v_batchId!=null && v_batchId!=""){
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.Open("POST", httpUrl+"method=getCtrlMsgInstState&batchId="+v_batchId, false);
	        xmlhttp.send();
	        if(isSuccess(xmlhttp)){
	        	v_state=xmlhttp.responseXML.selectSingleNode("/root/rowSet/STATE").text;
	        }
		}
		return v_state;
	};
	
	this.getServiceContextId = function(v_ciId,v_ciCtrlColId){
		var v_serviceContextId="";
		if(v_ciId!=null && v_ciId!="" && v_ciCtrlColId!=null && v_ciCtrlColId!=""){
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.Open("POST", httpUrl+"method=getServiceContextId&ciId="+v_ciId+"&ciCtrlColId="+v_ciCtrlColId, false);
	        xmlhttp.send();
	        if(isSuccess(xmlhttp)){
	        	v_serviceContextId=xmlhttp.responseXML.selectSingleNode("/root/serviceContextId").text;
	        }
		}
		return v_serviceContextId;
	};
	
	this.packCtrlClassMsgXml = function(ctrlClassName,serviceContextId,objArray){
		var configCiId="",extendParam="";
		var ctrlMsgXml='<?xml version="1.0" encoding="GBK"?>';
		ctrlMsgXml+='<root><CI_CTRL_MSG>';
		ctrlMsgXml+='<CTRL_CLASS_NAME>'+ctrlClassName+'</CTRL_CLASS_NAME>';
		if(serviceContextId!=null && serviceContextId!="")
			ctrlMsgXml+='<SERVICE_CONTEXT_ID>'+serviceContextId+'</SERVICE_CONTEXT_ID>';
		for(var i=0;i<objArray.length;i++){
			configCiId="";
			ctrlMsgXml+='<ROWSET>';
			ctrlMsgXml+='<CI_ID>'+objArray[i].ciId+'</CI_ID>';
			ctrlMsgXml+='<CI_CTRL_COL_ID>'+objArray[i].ctrlColId+'</CI_CTRL_COL_ID>';
			if(objArray[i].configCiId)
				configCiId=objArray[i].configCiId;
			ctrlMsgXml+='<CONFIG_CI_ID>'+configCiId+'</CONFIG_CI_ID>';
			//ctrlMsgXml+='<PARAMETER><![CDATA['+objArray[i].parameter+']]></PARAMETER>';
			ctrlMsgXml+='<PARAMETER>'+xmlEncode(objArray[i].parameter)+'</PARAMETER>';
            var timeout=30;
            if(objArray[i].timeout)
                timeout=objArray[i].timeout;

            ctrlMsgXml+='<TIMEOUT>'+timeout+'</TIMEOUT>';
			if(objArray[i].extendParam)
				extendParam=objArray[i].extendParam;
			else
				extendParam="";
			ctrlMsgXml+='<EXTEND_PARAMETER>'+xmlEncode(extendParam)+'</EXTEND_PARAMETER>';
			ctrlMsgXml+='</ROWSET>';
		}
		ctrlMsgXml+='</CI_CTRL_MSG></root>';
		return ctrlMsgXml;
	};


}