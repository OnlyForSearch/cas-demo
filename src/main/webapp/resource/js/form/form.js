var formLang;
if("undefined" != typeof(ItmLang)  && ItmLang.flow)
{
	formLang = ItmLang.flow;
}
else
{
	formLang = 
	{
			found_no_binding_form :"没有找到绑定的表单！",
			flow_form_context_failure: "获取流程表单的上下文失败！",
			cannot_find_form_fields:"无法找到表单域",
			attach_not_been_uploaded : "附件尚未上传完毕,请稍候!",
			not_allow_null : "不允许为空",
			only_for_digital:"只能为数字",
			only_for_float:"只能为浮点值",
			length_cannot_more_than_byte:"'{0}'的长度不能超过{1}字节!",
			length_cannot_more_than_bit:"'{0}'的长度不能超过{1}位!",
			precision_length_cannot_more_than:"'{0}'的精度不能超过{1}位!",
			save_succ:"保存成功!", //form.js引用
			not_find_corre_file:"没有找到对应的文件",
			del_succ:"删除成功", //form.js引用
			not_match_module:"无法匹配模块,绑定不成功!",
			default_val_error_nested_call:"默认值嵌套调用错误!",
			flow_proc:"流程流转过程", //form.js
			exec_staff:"执行者", //form.js
			tache_context:"环节内容", //flowForm.js,form.js
			execute_result:"执行结果", //flowForm.js,form.js
			tch_doc:"文档", //flowForm.js,form.js
			finish_time : "完成时间", //flowForm.js,form.js,
			exp_all:"全部展开",
			collapse:"收缩"
	};
}

/*formApp 类*/ 
function formApp()
{
    var oForm=null;
    var globalXML= (function()
    {
        return formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=1');
    })();    
    this.appContext=null;    
    this.getForm=function (){return null;};
    this.formUrl=null;
    this.load=function()
    {  
       oForm=this.getForm();
       if(oForm && this.formUrl)
       {
           this.loadForm(this.formUrl,oForm);
           oForm.load(globalXML,this.appContext);
           oForm.App=formApp;
       }
       return oForm;
    }
    this.loadForm=function(sURL,oForm)
    {
         var xmlDoc=formApp.syncAjaxRequest(sURL);
         var oCommands=[
                         {command:"setFormId",attr:"FORM_ID"},
                         {command:"setFormName",attr:"FORM_NAME"},
                         {command:"setFilePath",attr:"FILE_PATH"},
                         {command:"setFormProp",attr:"FORM_PROP"},
                         {command:"setFormPrintFile",attr:"FILE_PRINT_PATH"},
                         {command:"setFormBahavior",attr:"FORM_ACTION"},
                         {command:"setFormType",attr:"FORM_TYPE"},
                         {command:"setFormPdfFile",attr:"FILE_PDF_PATH"},
                         {command:"setHisType",attr:"HISTORY_TYPE"},
                         {command:"setStaticCfg",attr:"STATIC_CFG"}                         
                       ]
           var iLen=oCommands.length;
           for(var i=0;i<iLen;i++)
           {
              var oCommand=oCommands[i];
              var sAttrValue=xmlDoc.selectSingleNode("/root/rowSet/"+oCommand.attr);
              if(!sAttrValue)
              {
		        EMsg(formLang.found_no_binding_form);
		        window.close();
		        return;
              }
              oForm[oCommand.command](sAttrValue.text);
           }
    };
    this.save=function(){oForm.save()};
}
formApp.factory=function(request)
{
   var sClassId=request("classId");
   var formId=request("formId");
   var dataSetId=request("dataSetId");
   if(formId!="")
   {
       return new normalApp();
   }
   else if(sClassId=="")
   {
       return new flowApp();
   }
   else
   {
   	   if(dataSetId=="") return new CIApp();
   	   return new NCIApp();
   }
}
formApp.ajaxRequest=function(url,oParam)
{
        var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
        var oParam=oParam||{}
        if(oParam.async)
        {
            oXMLHTTP.onreadystatechange= function(){oParam.onStateChange(oXMLHTTP)};
        }
        oXMLHTTP.open(oParam.method||"POST",url,oParam.async||false);
        var sXML=(oParam.xml)?oParam.xml.xml:"";
        oXMLHTTP.send(sXML);
        if(!oParam.async)
        {
            return oXMLHTTP;
        }
}
formApp.syncAjaxRequest=function(url,oXML)
{
     var oXMLHTTP=formApp.ajaxRequest(url,{xml:(oXML||null)});
     var xmlDoc=null;
     if(isSuccess(oXMLHTTP))
     {
        xmlDoc=oXMLHTTP.responseXML;
     }
     return xmlDoc;
}
/*flowApp类*/
function flowApp()
{
     formApp.call(this);
     var flowRequest=(function ()
     {
          var getInfoByFlowId=function(flowId,flowMod,flowNum)
		  {
			    var flowInfo = {};
			    var xmlDoc=formApp.syncAjaxRequest('../../servlet/flowOper?OperType=8&flowId='
			                                     +flowId+'&flowMod='+flowMod+'&flowNum='+flowNum);
				var tchId=xmlDoc.selectSingleNode("/root/rowSet/TCH_ID").text;
				var flowMod=xmlDoc.selectSingleNode("/root/rowSet/FLOW_MOD").text;
				flowInfo["tchId"]=tchId;
				flowInfo["flowMod"]=flowMod;	
				return flowInfo;
		  };
          var iFlowMod=$request("flowMod")||0;
          var iTchId=$request("tchId")||0;
          var iFlowId=$request("flowId")||0;
          var iFlowNum=$request("flowNum");
          var from=$request("from");
          if(iFlowId!=0||iFlowNum!="")
          {
               var flowInfo=getInfoByFlowId(iFlowId,iFlowMod,iFlowNum);        
               iTchId=flowInfo.tchId;
               iFlowMod=flowInfo.flowMod;
          }    
          return {flowMod:iFlowMod,tchId:iTchId,flowId:iFlowId,from:from};
     })();
     this.appContext=(function()
     {
		   
           var iFlowMod=flowRequest.flowMod;
           var iTchId=flowRequest.tchId;
           var iFlowId=flowRequest.flowId;           
           var xmlDoc=formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=11&flowMod='
                                            +iFlowMod+'&tchId='+iTchId+'&flowId='+iFlowId);
           if(!xmlDoc)
           {
               throw(new Error(-1,formLang.flow_form_context_failure));
           }
           return {appName:"FLOW",xmlDoc:xmlDoc};
      })();
    this.formUrl='../../servlet/formDispatch?OperType=12&flowMod='
                      +flowRequest.flowMod+"&tchId="+flowRequest.tchId+'&flowId='+flowRequest.flowId;
    this.getForm=function()
    {
         var oForm=new flowForm(flowRequest);        
         oForm.setToolbar({src:"toolBar.jsp?tchId="+flowRequest.tchId,height:28});
         return oForm;
    };    
}
/*normalApp 类*/
function normalApp()
{
     formApp.call(this);
     var request=(function ()
     {
          var sFormId=$request("formId")||"";
          var sRequestId=$request("requestId")||"0";
          return {formId:sFormId,requestId:sRequestId};
     }
     )();
    this.formUrl='../../servlet/formDispatch?OperType=12&formId='+request.formId+"&requestId="+request.requestId;
    this.getForm=function()
     {
         var oForm=new normalForm(request);
         oForm.setToolbar({src:"toolBar.jsp",height:28});                                                     
         return oForm;
     }
}
/*CIApp类*/
function CIApp()
{
    formApp.call(this);
    var CIRequest=(function ()
    {
         var sClassId=$request("classId")||"0";
         var sRequestId=$request("requestId")||"0";
         return {classId:sClassId,requestId:sRequestId};
    })();
    this.appContext=(function()
    {
         var xmlDoc=formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=18&classId='+CIRequest.classId);
         return {appName:"CI",xmlDoc:xmlDoc};
    })();
    this.formUrl='../../servlet/formDispatch?OperType=12&classId='+CIRequest.classId+"&requestId="+CIRequest.requestId;
    this.getForm=function()
    {
         var oForm=new CIForm(CIRequest);
         oForm.setToolbar({src:"toolBar.jsp",height:28});                                                     
         return oForm;
    }
}
/*新 CMDB CIApp类*/
function NCIApp()
{
     formApp.call(this);
     var CIRequest=(function()
     {
         var sClassId=$request("classId")||"0";
         var sRequestId=$request("requestId")||"0";
         var sDataSetId=$request("dataSetId")||"0";
         return {classId:sClassId,requestId:sRequestId,dataSetId:sDataSetId};
     })();
    this.appContext=(function()
    {
         var xmlDoc=formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=18&classId='
                                              +CIRequest.classId+'&dataSetId='+CIRequest.dataSetId);
         return {appName:"CI",xmlDoc:xmlDoc};
    })();
    this.formUrl='../../servlet/formDispatch?OperType=12&classId='+CIRequest.classId
                 +"&requestId="+CIRequest.requestId+'&dataSetId='+CIRequest.dataSetId;
    this.getForm=function()
     {
         var oForm=new NCIForm(CIRequest);
         oForm.setToolbar({src:"toolBar.jsp",height:28});                                                     
         return oForm;
     }
}
/*form 类*/
function form(appReqeust)
{
   var formId;
   var formName;
   var filePath;
   var printFilePath;
   var formDesc;
   var formProp;
   var formBahavior;
   var formType;
   var oFormXML;
   var oDataXML;
   var formPdfFile;
   var printType;
   var historyType;
   var isAfterSave;
   var oFormCfg;
   var staticCfg;
   var toolBar={src:'about:blank',height:0};   
   var oFrame={
                main:document.getElementsByName("fstMain")[0],
                form:document.getElementsByName("fraForm")[0],
                print:document.getElementsByName("fraPrint")[0],
                toolbar:document.getElementsByName("fraToolBar")[0]
              };
   toolBar.setHeight=function(iHeight)
   {
   	  this.height=iHeight;
      oFrame.main.rows=iHeight+",*,0";
   };
   var oWin={self:window,
             form:oFrame.form.contentWindow,
             toolbar:oFrame.toolbar.contentWindow,
             print:oFrame.print.contentWindow};
   var appName=null;
   this.isFlow=function(){return false};
   this.GLOBAL_VAR={};
   this.globalVar={};
   this.TABLE={};
   this.apendElement=[];
   this.App;
   this.getWin = function() {return oWin};
   this.getFormId = function() { return formId; };
   this.setFormId = function(pFormId){formId=pFormId;};
   this.getFormName = function() { return formName; };
   this.setFormName = function(pFormName){formName=pFormName;};   
   this.getFilePath = function() { return filePath; };
   this.setFilePath = function(pFilePath){filePath=pFilePath;};   
   this.getFormName = function() { return formName; };
   this.setFormName = function(pFormName){formName=pFormName;};   
   this.getFormDesc = function() { return formDesc; };
   this.setFormDesc = function(pFormDesc){formDesc=pFormDesc;};   
   this.getFormProp = function() { return formProp; };
   this.setFormProp = function(pFormProp){formProp=pFormProp;};
   this.getHisType = function() { return historyType; };
   this.setHisType = function(pHisType){historyType=pHisType;};
   this.getFormPrintFile = function() { return printFilePath; };
   this.setFormPrintFile = function(pPrintFile){printFilePath=pPrintFile;};
   this.getFormPdfFile = function() { return formPdfFile; };
   this.setFormPdfFile = function(pFormPdfFile){formPdfFile=pFormPdfFile;};
   this.getFormBahavior = function() { return formBahavior; };
   this.setFormBahavior = function(pFormBahavior){formBahavior=pFormBahavior;};   
   this.getToolbar = function() { return toolBar; };
   this.setToolbar = function(pToolbar){flow.Expr.copyObjFrom(pToolbar,toolBar);};
   this.getAppName= function(){return appName};
   this.getFormType= function(){return formType};
   this.setFormType= function(pFormType){formType=pFormType};
   this.getoFormXML= function(){return oFormXML};
   this.getoDataXML= function(){return oDataXML};
   this.setIsAfterSave = function(pIsAfterSave){isAfterSave=pIsAfterSave};
   this.getIsAfterSave= function(){return isAfterSave};
   this.getFormCfg = function(){return oFormCfg};
   this.setStaticCfg=function(pStaticCfg){staticCfg=pStaticCfg;};
   this.getStaticCfg=function(){return staticCfg;};
   var loadDefine= function(oForm)
   {
   	    var oRightXML;
        if(isAfterSave)
        {
        	oForm.reloadGlobalVar();
        	oDataXML=oForm.loadData(isAfterSave);
		 	visitFormXML(oFormXML,[setElementData,initElement,setTable]); 
		 	return;
        }
       
        oFrame.form.onreadystatechange=function()
        {
        	 if(oFrame.form.readyState!="complete") return;
        	 if(oWin.form.onFormInit){oWin.form.onFormInit(oForm);};
             oFormXML=(formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=2&formId='
			                    +formId+"&prop="+formProp+'&action='+formBahavior)); 
			 if(formProp==form.property.auto)
			 {
			    oRightXML=oForm.loadRightData();
			    if(formBahavior!=form.action.create)
			    {
			         oDataXML=oForm.loadData();
			    }
			 }      
	         visitFormXML(oFormXML,[setElementRight,setFiledAttr,setElementData,
	                                setDefaultValue,initElement,setTable,setElementCust]);
	         setFormCfg(oFormXML); 
		     if(oForm.request("from")=="KN")
		     {
		         parent.setDataSourceEditHTML(oForm.getPrintHTML());
		     }
		     else
		     {
                oFrame.toolbar.src=toolBar.src;
                loadToolBarContext(oForm);
             } 
             oFrame.form.onreadystatechange= function(){};
	     }
	 
	     function setFiledAttr(aCollection)
	     {
	        var oFieldNode=aCollection.field;
	        var sBindType=oFieldNode.getAttribute("BIND_TYPE");
	        var isReadOnly=(oFieldNode.getAttribute("IS_READONLY")=="T");
	        var isBindBack=(sBindType==form.elementBindType.background);
	        var sValue="",sValueType="";
	        if(isBindBack && !isReadOnly)
	        {
	            sValue=oFieldNode.getAttribute("DEFAULT_VALUE");
	            sValueType=oFieldNode.getAttribute("DEFAULT_VALUE_TYPE");
	            oFieldNode.setAttribute("DEFAULT_VALUE","");
	            oFieldNode.setAttribute("DEFAULT_VALUE_TYPE","");
	        }
	        oFieldNode.setAttribute("BACK_VALUE",sValue);
	        oFieldNode.setAttribute("BACK_VALUE_TYPE",sValueType);	        
	     };
	     function setElementRight(aCollection)
         {          
            var oFieldNode=aCollection.field;
	        if(oRightXML)
	        {
	           var sFieldId=oFieldNode.getAttribute("FIELD_ID");
	           var sPath="//rowSet[@FIELD_ID='"+sFieldId+"']";
	           var oRightNode=oRightXML.selectSingleNode(sPath);
	           if(oRightNode)
	           {
	           	   var isAppend=oRightNode.getAttribute("IS_APPEND");
	           	   var isShow=(isAppend=='T')?'F':oRightNode.getAttribute("IS_SHOW");
	               oFieldNode.setAttribute("IS_SHOW",isShow);
	               oFieldNode.setAttribute("IS_READONLY",oRightNode.getAttribute("IS_READONLY"));
	               oFieldNode.setAttribute("IS_REQUIRE",oRightNode.getAttribute("IS_REQUIRE"));
	               oFieldNode.setAttribute("IS_APPEND",isAppend);
	           }
	           else
	           {	          
	               var isReadOnly=(formBahavior==form.action.readOnly)?"T":"F";
	               oFieldNode.setAttribute("IS_READONLY",isReadOnly)
	           }
	        }
	        if($request("readOnly")=='y')
	        {
	            oFieldNode.setAttribute("IS_READONLY","T");
	        }
        };
        function setElementData(aCollection)
	    {	   	  
	       var oFieldNode=aCollection.field;   
	       if(oDataXML)
	       {
	           var sFieldName=oFieldNode.nodeName;
	           var sTableName=aCollection.table.getAttribute("NAME");
	           var oDataField=oDataXML.selectSingleNode("//TABLE[@NAME='"+sTableName+"']/"+sFieldName);
	           if(oDataField)
	           {
	           	  var sValue=getDataText(oFieldNode,oDataField);
	              oFieldNode.setAttribute("DEFAULT_VALUE",sValue);
	              oFieldNode.setAttribute("DEFAULT_VALUE_TYPE",form.elementValueType.constant);
	           }
	       }
	       function getDataText(oFieldNode,oDataField)
	       {
	           var sDataFormat=oFieldNode.getAttribute("FIELD_FORMAT")||"";
	           sDataFormat=sDataFormat.trimall();
	           var sFiledType=oFieldNode.getAttribute("FIELD_TYPE");
	           var sValue=oDataField.text;
	           if(sFiledType=="DATE" && sDataFormat.length<=10) //由于oracle jdbc无法区分date类型是否有时间，在客户端判断
	           {
	               sValue=sValue.substr(0,10);
	           }
	           return sValue;
	       }
	    };
	    function initElement(aCollection)
	    {
	        var oFieldNode=aCollection.field;
	        var sElementType=oFieldNode.getAttribute("ELEMENT_TYPE"); 
	        var oElementType=form.elementFactory.getElementType(sElementType);
	        var oElement=aCollection.element;
	        if(!oElement) return;
	        if(oFieldNode.getAttribute("IS_APPEND")=='T')
	            aCollection.form.apendElement.push(oElement);
	        oElementType.init(oElement,aCollection.field,oForm);
	    };
	    function setDefaultValue(aCollection)
	    {
	       var oFieldNode=aCollection.field;
	       var sBindType=oFieldNode.getAttribute("BIND_TYPE")||form.elementBindType.foreground;
	       var sValueType=oFieldNode.getAttribute("DEFAULT_VALUE_TYPE")||form.elementValueType.constant;
	       if(sBindType==form.elementBindType.foreground && sValueType!=form.elementValueType.constant)
	       {
	             var oValueType=form.valueTypeFactory.getValueType(aCollection.field,sValueType);
	             if(oValueType)
	             {
	                oValueType.setValue(oFieldNode,oForm,aCollection.xml);
	             }
	       }
	    };
		function setTable(aCollection)
	    {
	       var sTableName=aCollection.table.getAttribute("NAME");           
	       var sType=aCollection.table.getAttribute("TYPE");
	       var oFieldNode=aCollection.field;
	       var sElementType=oFieldNode.getAttribute("ELEMENT_TYPE");           
	       var oElementType=form.elementFactory.getElementType(sElementType);
	       var oElement=aCollection.element;
	       if(!oForm.TABLE[sTableName])
	       {
	           oForm.TABLE[sTableName]={};
	           oForm.TABLE[sTableName]["TYPE"]=sType;
	           oForm.TABLE[sTableName]["NAME"]=sTableName;
	       }
	       oForm.TABLE[sTableName][oFieldNode.tagName]=getTableField(oFieldNode,oElementType,oElement);
	       function getTableField(oFieldNode,oElementType,oElement)
	       {
	          var aField={};
	          var aAttr=["FIELD_ID","FIELD_TYPE","FIELD_LENGTH","FIELD_SCALE","FIELD_FORMAT"
	                    ,"ELEMENT_NAME","ELEMENT_NAME_CN","BACK_VALUE","BACK_VALUE_TYPE"
	                    ,"BIND_TYPE","IS_READONLY","DEFAULT_VALUE","REF_REQUEST_ID","ELEMENT_TYPE"];
	          var isEmpty=oFieldNode.getAttribute("IS_EMPTY");
	          var isRequire=oFieldNode.getAttribute("IS_REQUIRE");
	          var keyFieldName=aCollection.table.getAttribute("KEY_FIELD");
	          var iLen=aAttr.length;
	          for(var i=0;i<iLen;i++)
	          {
	              var sAttr=aAttr[i];
	              aField[sAttr]=oFieldNode.getAttribute(sAttr)||"";
	          }
	          var isKey=(keyFieldName==oFieldNode.tagName);
	          aField["isRequireXMLEncode"]=oElementType.isRequireXMLEncode();
	          aField["IS_KEY"]=(isKey)?"T":"F";
	          if(isKey && formBahavior!=form.action.create)
	          {
	              aField["IS_READONLY"]="T";
	          }
	          aField["IS_REQUIRE"]=(isEmpty=="F" || isRequire=="T")?"T":"F";
	          aField["VALUE"]=function()
	          {                                      
	              return oElementType.getValue(oElement,aCollection.form);
	          };
	          aField["TEXT"]=function()
	          {                            
	              return oElementType.getText(oElement,aCollection.form);
	          };
	          aField["REF_REQUEST_ID"]=function()
	          {                            
	              return oFieldNode.getAttribute("REF_REQUEST_ID");
	          };
	          aField["SET_VALUE"]=function(pValue)
	          {
	              return oElementType.setValue(oElement,oFieldNode,pValue,oDataXML,aCollection.form);
	          };
	          aField["SET_STATIC"]=function()
	          {
	              oElementType.staticElement(oElement,aCollection.form.getWin().form.document,
	                     oElementType.getStaticCfg(oFieldNode,aCollection.form),
                         oElementType.getText(oElement));
	          };
	          aField["SET_HIDDEN"]=function()
	          {
	              oElement.style.display='none';
	              if(oElement.refStaticElement)
	                oElement.refStaticElement.style.display="none";  
	          };
	          return aField;
	       }
	    };
	    
	    function setElementCust(aCollection)
	    {
	         var oElement=aCollection.element;
	         var oFieldNode=aCollection.field;         
	         oElement.reInit=function()
             {
                 var sElementType=oFieldNode.getAttribute("ELEMENT_TYPE");           
                 var oElementType=form.elementFactory.getElementType(sElementType);
                 var oToField=getFieldXML().selectSingleNode("/root/"+oFieldNode.tagName);
                 var sValue=oElementType.getValue(oElement);
                 if(oToField)
                 {
                     copyNodeAttr(oFieldNode,oToField)
                 }
                 oToField.setAttribute("DEFAULT_VALUE",sValue);
                 oElementType.init(oElement,oToField,oForm);
             };	         
	         function getFieldXML()
	         {
	             var sFieldId=oFieldNode.getAttribute("FIELD_ID");
	             var sTableName=aCollection.table.getAttribute("NAME");
	             var oReturnXML=formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=16&formId='+
	                                            oForm.getFormId()+"&tableName="+sTableName+'&fieldId='+sFieldId);
			     return oReturnXML;
	         };	         
	         function copyNodeAttr(oFormNode,oToNode)
	         {
	             var attributes=oFormNode.attributes;
				 var iAttiLen=attributes.length;
				 for(var j=0;j<iAttiLen;j++)
				 {
				     oToNode.setAttribute(attributes[j].name,attributes[j].value);
				 }
	         }
	    };
	    function visitFormXML(oFormXML,visitors)
	    {
	       var oTableNodes=oFormXML.selectNodes("//TABLE");
		   var iLen=oTableNodes.length;		   
		   var iVisitorLen=visitors.length;
		   for(var i=0;i<iLen;i++)
		   {
		       var oTableNode=oTableNodes[i];
		       var oFieldNodes=oTableNode.childNodes;
		       var iFieldNum=oFieldNodes.length;
		       for(var j=0;j<iFieldNum;j++)
		       {
		           var oFieldNode=oFieldNodes[j];
		           var sElementName=oFieldNode.getAttribute("ELEMENT_NAME");
		           var oElement=getElement(sElementName);
		           if(!oElement) return;		           
		           for(var k=0;k<iVisitorLen;k++)
		           {
		               visitors[k].call(this,{xml:oFormXML,table:oTableNode,
		                                      field:oFieldNode,form:oForm,element:oElement});
		           }
		       }
		   }
	    };
	    function setFormCfg(oFormXML)
	    {
	    	var oFormCfgNodes=oFormXML.selectSingleNode("//FORM_CFG").childNodes;
	    	var iLen=oFormCfgNodes.length;
	    	oFormCfg = {};
	    	for(var i=0;i<iLen;i++)
		    {
		    	var oFormCfgNode=oFormCfgNodes[i];
		    	var attrName = oFormCfgNode.nodeName;
		    	var attrType = oFormCfgNode.getAttribute("TYPE");;
		    	var attrValue = oFormCfgNode.text;
		    	if(attrName=='onAfterInit')
		    	{
		    		flow.Expr.exec(attrValue,{action:"",selTch:"",selStaff:"",funcType:attrType,isForm:"0BF"});
		    	}
		    	else
		    	{
			    	oFormCfg[attrName+i]=flow.Expr.copyObj(attrValue);
			    	oFormCfg[attrName+i].name=attrName;
			    	oFormCfg[attrName+i].type=attrType;
			    	oFormCfg[attrName+i].value=attrValue;
			        oFormCfg[attrName+i].getExecXML=function(oType,oAttrName,oAttrValue)
			        {
			         	return flow.Expr.getExecXML(oType,oAttrName,oAttrValue
			                   ,{action:"",selTch:"",selStaff:"",funcType:oType});
			        }
		    	}
		    }
	    }
   };   
              
   var loadToolBarContext=function(oForm)
   {
       oFrame.toolbar.onreadystatechange=function()
   	   {
	       if(oFrame.toolbar.readyState=="complete")
	       {  
	            if(oWin.toolbar.onFormReady)
	            	oWin.toolbar.onFormReady(oForm);
	            if($request("hiddenToolBar")=='y')
                   oFrame.main.rows="0,*,0";
                else           
        	       oFrame.main.rows=toolBar.height+",*,0";
	            setTimeout(function(){if(oWin.form.onFormReady){oWin.form.onFormReady(oForm);}});
	            setTimeout(function(){if(oWin.print.onPrintReady){oWin.print.onPrintReady(oForm);}})
	       }
       }
   };
   
   var getElement=function(sElementName)
   {
      var oElement;
      if(sElementName.indexOf(".")!=-1)
      {
          var aElementName=sElementName.split(".");
          var iLen=aElementName.length;
		  for(var i=0;i<iLen;i++)
          {
			  if(i==0)
			  {
				 oElement=oWin.form.document.getElementById(aElementName[i]);
		      }
			  else
		      {
			     oElement=(oElement)?oElement.contentWindow.document.getElementById(aElementName[i]):null;
			  }
		 }
      }
      else
      {
          oElement=oWin.form.document.getElementById(sElementName);
      }
      if(!oElement)
      {
          EMsg(formLang.cannot_find_form_fields + "'" + sElementName + "'");
      }
      return oElement;
   }   
   
   this.loadData=function()
   {
       return null;
   }
   this.loadRightData=function()
   {
       return null;
   }
   this.doAfterSave=function(){
		//if(this.getFormBahavior()==form.action.create){
	    	this.setFormBahavior(form.action.edit);
	    	this.setIsAfterSave(true);
	    	loadDefine(this);
    	//}
    }
   this.load=function(globalXML,appContext)
   {
         oFrame.form.src=filePath;
         this.GLOBAL_VAR=getXMLVar(globalXML);
         this.globalVar=this.GLOBAL_VAR;         
         if(appContext)
         {
            appName=appContext.appName;
            this[appName]=getXMLVar(appContext.xmlDoc);
         }    
         loadDefine(this);      
   };
   
   this.reloadGlobalVar=function()
   {
      var globalXML=formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=1');
      this.GLOBAL_VAR=getXMLVar(globalXML);
   }   
   this.setTableData=function(sTableName,oKey)
   {
       var oTableDataXML=getTableDataXML();
       if(!oTableDataXML) return;
       var oTableNode=getTableNode(oTableDataXML);
       if(oTableNode)
       {
           var oFieldNodes=oTableNode.childNodes;
           var iFieldNum=oFieldNodes.length;
           for(var j=0;j<iFieldNum;j++)
		   {
		       var oFieldNode=oFieldNodes[j];
		       var sElementType=oFieldNode.getAttribute("ELEMENT_TYPE");
		       var oElementType=form.elementFactory.getElementType(sElementType);
		       var sElementName=oFieldNode.getAttribute("ELEMENT_NAME");
		       var oElement=getElement(sElementName);
               if(!oElement) return;
	           var oDataField=oTableDataXML.selectSingleNode("//"+oFieldNode.tagName);
	           if(oDataField)
	           {
	              var sValue=oDataField.text;
	              oElementType.setValue(oElement,oFieldNode,sValue,oTableDataXML);
	           }	           
		   }		   
       }
       function getTableDataXML()
       {
          var keyName=oKey.name||"REQUEST_ID";
          var keyValue=oKey.value||"";
          var keyType=oKey.type||"number";
          var tableXML=formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=14&tableName='
			                    +sTableName+"&keyName="+keyName+'&keyValue='+keyValue
			                    +"&keyType="+keyType);
	      return tableXML;                      
       };
       function getTableNode(oTableDataXML)
       {
           var oTableNode=null;
	       var tableName="";
	       var oTableDataNode=oTableDataXML.selectSingleNode("/root/TABLE");
	       if(oTableDataNode)
	       {
	           tableName=oTableDataNode.getAttribute("NAME");
	       }
	       if(tableName)
	       {
	          oTableNode=oFormXML.selectSingleNode("//TABLE[@NAME='"+tableName+"']");
	       }
	       return oTableNode;
       }             
   }
   this.request=function(param)
   {
       return $request(param);
   }
   this.callback=function()
   {
       var callback=this.request("callback");
       var oWin=this.getWin().self;
       if(!callback) return;
       try
	   {
	       eval("oWin."+callback);
	   }
	   catch(e)
	   {}
   }
   
   this.closeWin=function()
   {
       this.getWin().self.opener = null;  
       this.getWin().self.open('','_self','');
       this.getWin().self.close();
   }
   
   this.flowSubmit=function(oParams)
   {
	    oParams = oParams || {};
   	    if(oWin.form.onFlowSubmit)
		{
		    return oWin.form.onFlowSubmit(this, oParams);
		}
		return true;
   }
   /**
    * add by chenzw 增加下一环节信息参数
    * @params oParams:{nextTch:下一环节信息对象->flowFormMenu.js的flow.NextTch对象}
    */
   this.onClickBeforeEvent=function(oParams)
   {
	    oParams = oParams || {};
        if(oWin.form.onClickBefore)
		{
		    return oWin.form.onClickBefore(this, oParams);
		}
        return true;
   }
   this.onCancelReceiveBeforeEvent=function()
   {
        if(oWin.form.onCancelReceiveBefore)
		{
		    return oWin.form.onCancelReceiveBefore(this);
		}
        return true;
   } 
   this.onCancelReceiveAfterEvent=function()
   {
        if(oWin.form.onCancelReceiveAfter)
		{
		    return oWin.form.onCancelReceiveAfter(this);
		}
        return true;
   }  
   this.validate=function()
   {
   	    if(oWin.form.onFormBeforeValid)
		{
		     oWin.form.onFormBeforeValid(this);
		}
        if(!visitTable(this.TABLE,[checkEmpty,checkFieldType,checkFieldLen,checkAttachUploaded])) return false;
        if(oWin.form.onFormSubmit)
		{
		    return oWin.form.onFormSubmit(this);
		}
		return true;
		function checkAttachUploaded(aCollection)
		{
		    var oField = aCollection.field;
		    if(oField.FIELD_TYPE=="ATTACH")
		    {
		        var oAttach = getElement(oField);
		        if(!oAttach.isUploadFinish())
		        {
		            EMsg('"'+oField.ELEMENT_NAME_CN+'"'+formLang.attach_not_been_uploaded);
		            return false;
		        }
		    }
		    return true;
		}
        function checkEmpty(aCollection)
		{
		    var oField = aCollection.field;
		    if(oField.IS_REQUIRE=="T")
		    {
		         if(oField.VALUE()=="")
		         {
		            EMsg('"'+oField.ELEMENT_NAME_CN+'"'+formLang.not_allow_null);
		            var nValueEmt = getElement(oField);
		            if(nValueEmt!=null)
		            {
		            	try{nValueEmt.focus();} catch(e){}
		            }
		            return false;
		         }
		     }
		     return true;
		}
		function checkFieldType(aCollection)
		{
		     var oField=aCollection.field;
		     var sValue=oField.VALUE()+"";
		     var sFieldType=oField.FIELD_TYPE;
		     var sFieldScale=oField.FIELD_SCALE;
		     var iScale = (sFieldScale == "") ? 0 : parseInt(sFieldScale);
		     var nValueEmt = getElement(oField);
		     
		     if(oField.FIELD_TYPE=="NUMBER")
		     {
		         if(iScale==0)
		         {
			         if(!sValue.is_num())
			         {
			             EMsg('"' + oField.ELEMENT_NAME_CN + '"' + formLang.only_for_digital);
			             //错误提示后自动获得控件焦点
			             if (nValueEmt != null) {
			                 try { nValueEmt.focus(); } catch (e) { }
			             }
			             return false;
			         }
			     }
			     else
			     {
			         if(sValue.trimall()!="" && !sValue.is_float())
			         {
			             EMsg('"' + oField.ELEMENT_NAME_CN + '"' + formLang.only_for_float);
			             //错误提示后自动获得控件焦点
			             if (nValueEmt != null) {
			                 try { nValueEmt.focus(); } catch (e) { }
			             }
			             return false;
			         }
			     }
		     }
		     return true;
		}
		function checkFieldLen(aCollection)
		{
		     var oField=aCollection.field;
		     var sFieldLen=oField.FIELD_LENGTH;
		     var sFieldScale=oField.FIELD_SCALE;
		     var iScale=(sFieldScale=="")?0:parseInt(sFieldScale);
		     var iFieldLen=parseInt(sFieldLen);
		     var sElementValue=oField.VALUE()+"";
		     var sElementName = oField.ELEMENT_NAME_CN
		     var nValueEmt = getElement(oField);
		     if(typeof(sElementValue)!="undefined")
		     {
		         if(iScale==0)
		         {
				     if(sElementValue.Tlength()>iFieldLen)
					 {
				    	 	 var langMsg = formatResource(formLang.length_cannot_more_than_byte,sElementName,iFieldLen);
					         EMsg(langMsg);
					         //错误提示后自动获得控件焦点
					         if (nValueEmt != null) {
					             try { nValueEmt.focus(); } catch (e) { }
					         }
					         return false;
					 }
			     }
			     else
			     {
			         var aValue=sElementValue.split(".");
			         var iLen=aValue[0];
			         var iPrecision=(aValue.length>1)?aValue[1]:"";
			         if(iLen.length>iFieldLen)
			         {
			        	 	 var langMsg = formatResource(formLang.length_cannot_more_than_bit,sElementName,iFieldLen);
			                 EMsg(langMsg);
			                 //错误提示后自动获得控件焦点
			                 if (nValueEmt != null) {
			                     try { nValueEmt.focus(); } catch (e) { }
			                 }
					         return false;	         
			         }
			         if(iPrecision.length>iScale)
			         {
			        	 	 var langMsg = formatResource(formLang.precision_length_cannot_more_than,sElementName,iScale);
			                 EMsg(langMsg);
			                 //错误提示后自动获得控件焦点
			                 if (nValueEmt != null) {
			                     try { nValueEmt.focus(); } catch (e) { }
			                 }
					         return false;	         
			         }
			     }
			 }
		     return true;
		};
		function getElement(oField)
		{
			 return oWin.form.document.getElementById(oField.ELEMENT_NAME);
		}
		function visitTable(oTable,visitors)
		{
		    var iVistorLen=visitors.length;
		    for(tableName in oTable)
		    {
		        for(fieldName in oTable[tableName])
		        {
		           var oField=oTable[tableName][fieldName];
		           if(typeof(oField)!="object") continue;
		           if(oField.BIND_TYPE==form.elementBindType.background) continue;		           
		           for(var k=0;k<iVistorLen;k++)
		           {
		              var bReturn=visitors[k].call(this,{table:oTable[tableName],field:oField});
		              if(bReturn===false)
		              {
		                  return false;
		              }
		           }
		        }
		    }
		    return true;
		};		
   }

   this.save = function(noValidate,noShowSaveSucceed) 
   	{
       if (!noValidate && !this.validate()) return false;
       var xmlDoc = this.getSendXML();
       var oXMLHTTP = formApp.ajaxRequest('../../servlet/formDispatch?OperType=13&formId=' + formId + '&formHistoryId=' + this.GLOBAL_VAR["FORM_HISTORY_ID"], { xml: xmlDoc });
       var isOK = isSuccess(oXMLHTTP);
       var isHookOK = true;
       if (oWin.form.onAfterSave)
       {
           isHookOK = oWin.form.onAfterSave(this, isOK);
       }
       if (isOK && isHookOK) 
       {
           if(!noShowSaveSucceed) MMsg(formLang.save_succ);
           return true;
       }
       return false;
   };
   
   this.appendPrintHTML=function(oPrintWin){};
   //加载打印文件
   this.loadPrint = function(aPrintType,formContext,printForm,aPrintParam,isSub){
   		var printfile;
   		if(aPrintType=="pdf"){
   			printfile = formPdfFile;
   		}else if(aPrintType=="doc"){
   			printfile = printFilePath;
   		}
   		//aPrintType="rtf";
   		if(printfile==""){
 			EMsg(formLang.not_find_corre_file);
 			return;
 		}
		if(printType!=aPrintType){
 			oFrame.print.src = printfile;
 			printType = aPrintType;
 		}
		doAfterLoadPrint(aPrintParam,formContext,printForm,aPrintType,isSub);
   }
   var doAfterLoadPrint = function(aPrintParam,formContext,printForm,aPrintType,isSub){
   		if(oFrame.print.readyState=="complete"){
 			if (oWin.print.onPrintReady){
		    	oWin.print.onPrintReady(formContext);
		    }
		    if (oWin.print.onPrintWord){
                oWin.print.onPrintWord(formContext,printForm,aPrintParam);
		    }else if(isSub=='T'){
			    var oReg2=/(\s+\w+=)('|")?(.*?)('|")?(?=\s+\w+=|\s*>|\s*\/>)/gi;
			    var content = formContext.getPrintHTML(aPrintParam);
			    	content = content.replace(oReg2,"$1\"$3\"");
			    	content = content.replace(/<SCRIPT [^>]*>[\s\S]*?<\/SCRIPT>/ig,"");		    	
			    var oReg1 = /(<META){1}[^>]+[>]{1}[\r\n]+/g;
			    	content = content.replace(oReg1,"");
			    printForm.fileType.value=aPrintType;
			    printForm.fileName.value=(formContext.getFormName().indexOf("."+aPrintType)>=0)?formContext.getFormName():(formContext.getFormName() + "."+aPrintType);
			    printForm.content.value=content;
			    printForm.submit();
		    }else{
		    	eval("oWin.toolbar."+isSub);
		    }
		    
		}else{
			setTimeout(function(){doAfterLoadPrint(aPrintParam,formContext,printForm,aPrintType,isSub)},1);
		}
   }
   this.getPrintHTML = function(aPrintParam) 
   {
       var oTable = this.TABLE;
       for (tableName in oTable) 
       {
           for (fieldName in oTable[tableName]) 
           {
               var oField = oTable[tableName][fieldName];
               if (typeof (oField) != "object") continue;
               var sElementId = oField["ELEMENT_NAME"];
               var oPrintElement = oWin.print.document.getElementById(sElementId);
               if (oPrintElement) 
               {
               	   var sText = oField.TEXT();
                   oPrintElement.innerHTML = sText;
               }
           }
       }
       this.appendPrintHTML(oWin.print,aPrintParam);
       var content = oWin.print.document.documentElement.outerHTML;
       return content;
   }
   this.doPrint=function(aPrintParam)
   {
        var printWin=oWin.print;
	    this.getPrintHTML(aPrintParam);
	    printWin.focus();
        printWin.print();
   }
	
   this.disable=function()
   {
       var oMainTable=oFormXML.selectSingleNode("//TABLE[0]");
       if(oMainTable)
       {
           var oRequestId=oMainTable.selectSingleNode("REQUEST_ID");
           if(oRequestId)
           {
               var sRequestId=oRequestId.getAttribute("DEFAULT_VALUE");
               if(sRequestId.is_num())
               { 
                   var oXMLHTTP=formApp.ajaxRequest("../../servlet/formDispatch?OperType=15&formId="
                                       +formId+"&requestId="+sRequestId + "&formHistoryId=" + this.GLOBAL_VAR["FORM_HISTORY_ID"]);
                   if(isSuccess(oXMLHTTP))
                   {
                       MMsg(formLang.del_succ);
                       return true;
                   }
               }               
           }
       }
       return false;
   }
   this.getFormCfg = function(){
   		var sXML = "<FORM_CFG>";
   		for(var cfg in oFormCfg) 	
   		{
   			var oFormCfgNode = oFormCfg[cfg];
   			sXML = sXML + oFormCfgNode.getExecXML(oFormCfgNode.type,oFormCfgNode.name,oFormCfgNode.value);
   		}
   		sXML = sXML+"</FORM_CFG>";
   		return sXML;
   }
   this.getSendXML = function() 
   {
       var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
       XMLDoc.preserveWhiteSpace = true;
       var sXML = '<?xml version="1.0" encoding="GBK"?>'
                + '<root>'
                + '<FORM ACTION="' + formBahavior + '" PROP="' + formProp  + '">'
                + '<GLOBAL_VAR>' + getXML(this.GLOBAL_VAR) + '</GLOBAL_VAR>';
       if (appName) 
       {
           sXML += '<APP NAME="' + this.getAppName() + '">' + getXML(this[this.getAppName()]) + '</APP>'
       }
       sXML += this.getFormCfg();
       sXML += getTableXML(this.TABLE) + '</FORM></root>';
       
       XMLDoc.loadXML(sXML);
       return XMLDoc;
       function getXML(obj) 
       {
           var aXML = [];
           for (varName in obj)
           {
               aXML[aXML.length] = "<" + varName + ">" + xmlEncode(obj[varName]) + "</" + varName + ">";
           }
           return aXML.join("");
       }
       function getTableXML(oTable)
       {
           var aXML = [];
           var aAttr = ["FIELD_ID", "FIELD_TYPE", "FIELD_LENGTH", "FIELD_SCALE", "DEFAULT_VALUE",
	                   "FIELD_FORMAT", "BACK_VALUE", "BACK_VALUE_TYPE", "IS_READONLY", "IS_KEY",
	                    "ELEMENT_NAME_CN"];
           var iLen = aAttr.length;
           for (tableName in oTable)
           {
               aXML[aXML.length] = "<TABLE NAME='" + tableName + "' TYPE='" 
                                   + oTable[tableName]["TYPE"]+ "'>";
               for (fieldName in oTable[tableName]) 
               {               	   
                   var oField = oTable[tableName][fieldName];
                   if(oField.FIELD_TYPE=="HISTORY") continue;
                   if (typeof (oField) != "object") continue;
                   aXML[aXML.length] = "<" + fieldName + " ";
                   for (var i = 0; i < iLen; i++) 
                   {
                       var sAtrr = aAttr[i];
                       aXML[aXML.length] = sAtrr + '="' + xmlEncode(oField[sAtrr]) + '" ';
                   }
                   var sRefReqId=oField.REF_REQUEST_ID()||''
                   aXML[aXML.length] =' REF_REQUEST_ID="'+sRefReqId+'"';             
                   var sValue = (oField.isRequireXMLEncode) ? xmlEncode(oField.VALUE() + "") : oField.VALUE();
                   aXML[aXML.length] = ">" + sValue + "</" + fieldName + ">";
               }
               aXML[aXML.length] = "</TABLE>";
           }          
           return aXML.join("");
       }
   }
   
   function getXMLVar(oXMLDoc)
   {  
      var XMLNode=oXMLDoc.selectSingleNode("/root/rowSet");
      var ChildNodes=XMLNode.childNodes;
      var iLen=ChildNodes.length;
      var aObj={};
      for(var i=0;i<iLen;i++)
      {
         var childNode=ChildNodes[i];
         aObj[childNode.tagName]=childNode.text;
      }
      return aObj;
   }   
}

form.elementType={text:'1',textarea:'2',select:'3',
                 mSelect:'4',hidden:'5',radio:'6',
                 check:'7',calendar:'8',treeValue:'9',treeText:'10',
                 history:'11',singleAttach:"12",attachPool:"13",bigText:"14",
                 keyValue:"15",span:"16",button:"17",log:"18",div:'19',richText:'20'};
form.editorMenu=['fullscreen', 'undo', 'redo', 'fontname', 'fontsize', '|', 
                 'textcolor', 'bgcolor', 'bold', 'italic', 'underline', 'strikethrough',
                 'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 
                 'insertorderedlist','insertunorderedlist', 'indent', 'outdent'];
form.elementValueType={constant:'1',global:'2',seq:'3',foreign:'4',sqlExp:'5',
                       sqlFunc:'6',app:'7',urlParam:'8'};

form.elementBindType={foreground:'1',background:'0'};

form.action={create:'C',readOnly:'R',edit:'E'}; //表单行为标识 1:创建，2：只读 3:编辑

form.historyType={normal:'0',hasFlow:'1',hasFlowAndDetail:'2'};

form.property={programe:'P',auto:'A'};

form.elementState={valid:'0SA',inValid:'0SX'};

form.valueTypeFactory=function()
{
		function vValueType()
		{
		    this.setValue=function(oNode,oForm,oDefineXML){};
		    this.setConstant=function(oNode){oNode.setAttribute("DEFAULT_VALUE_TYPE",form.elementValueType.constant);}
		}
		
		function constantValue()
		{
		   vValueType.call(this);
		}
		
		function seqValue()
		{
		    vValueType.call(this);
		    this.setValue=function(oNode,oForm,oDefineXML)
		    {
		         this.setConstant(oNode);
		    }
		}
		
		function globalValue()
		{
		    vValueType.call(this);
		    this.setValue=function(oNode,oForm,oDefineXML)
		    {
		         var sDefaultValue=oNode.getAttribute("DEFAULT_VALUE");
		         var sValue=oForm.GLOBAL_VAR[sDefaultValue]||"";
				 oNode.setAttribute("DEFAULT_VALUE",sValue);
		         this.setConstant(oNode);
		    }
		}
		
		function appValue()
		{
            vValueType.call(this);
		    this.setValue=function(oNode,oForm,oDefineXML)
		    {
		         var sDefaultValue=oNode.getAttribute("DEFAULT_VALUE");
		         var sAppName=oForm.getAppName();
		         if(!sAppName)
		         {
		             EMsg(formLang.not_match_module);
		             return;
		         }
		         var sValue=oForm[sAppName][sDefaultValue]||"";
				 oNode.setAttribute("DEFAULT_VALUE",sValue);
		         this.setConstant(oNode);
		    }
		}
		
		function urlParamValue()
		{
		    vValueType.call(this);
		    this.setValue=function(oNode,oForm,oDefineXML)
		    {
		         var sDefaultValue=oNode.getAttribute("DEFAULT_VALUE");
		         var sValue=oForm.request(sDefaultValue);
				 oNode.setAttribute("DEFAULT_VALUE",sValue);
		         this.setConstant(oNode);
		    }
		}
		function foreignValue()
		{
		    vValueType.call(this);    
		    this.setValue=function(oNode,oForm,oDefineXML)
		    {
		        var sDefaultValue=oNode.getAttribute("DEFAULT_VALUE");      
		        var aDefaultValue=sDefaultValue.split('.');
			    sTableName=aDefaultValue[0];
			    sFieldName=aDefaultValue[1];
			   	var sValue=getRefNodeValue(oDefineXML,oForm,{table:sTableName,field:sFieldName});    
			    oNode.setAttribute("DEFAULT_VALUE",sValue);
			    this.setConstant(oNode);
		    }
		}
		
		function sqlValue()
		{
		    vValueType.call(this);    
		    this.setValue=function(oNode,oForm,oDefineXML)
		    {
		        var sDefaultValue=oNode.getAttribute("DEFAULT_VALUE");
		        var sSQL=parseExpr(sDefaultValue,oForm,oDefineXML); 
		        sValue=getSQLFuncReturnValue(sSQL);		        
			    oNode.setAttribute("DEFAULT_VALUE",sValue);
			    this.setConstant(oNode);
		    }
		    function parseExpr(sValue,oForm,oDefineXML)
			{
			   var reg=/\${1}\w+\.{1}\w+(\.{1}\w+)?(\.{1}\w+)?/gi;
			   var sReturnValue=sValue;
			   var aVar=sValue.match(reg);
			   if(aVar!=null)
			   {
			       for(var i=0;i<aVar.length;i++)
			       {	          
			          var sVarValue="";
			          var aVarValue=aVar[i].substr(1).split('.');
			          var sPrefix=aVarValue[0];
			          var sSecond=aVarValue[1];
			          var appName=oForm.getAppName();
			          var isGlobalVar=(sPrefix=="GLOBAL_VAR" || sPrefix=="globalVar");
			          var isAppVar=(sPrefix==appName);
			          if(isGlobalVar)
			              sVarValue=oForm.GLOBAL_VAR[sSecond]||"";
			          else if(isAppVar)
			              sVarValue=oForm[appName][sSecond]||"";
			          else
			          {
			             var sFieldName=aVarValue[2];
		                 sVarValue=getRefNodeValue(oDefineXML,oForm,{table:sSecond,field:sFieldName});
			          }
			          sVarValue=sVarValue.replace(/'/gi,"''");
			          sReturnValue=sReturnValue.replace(aVar[i],sVarValue);
			       }
			   }
			   return sReturnValue;
			}
			function getSQLFuncReturnValue(sSQLFunc)
		    {
			    var sValue="";
			    var sXML='<?xml version="1.0" encoding="gb2312"?>'
				             +  '<root><sqlFunc/>'
				             +  '</root>';
				var XMLDoc=new ActiveXObject("Microsoft.XMLDOM");
				XMLDoc.loadXML(sXML);
				XMLDoc.selectSingleNode("/root/sqlFunc").text=sSQLFunc;
				var returnXML=formApp.syncAjaxRequest("../../../servlet/util?OperType=2",XMLDoc);
			    sValue=returnXML.selectSingleNode("/root/values").text;
				return sValue;
		    }
		}
		
		function getRefNodeValue(oDefineXML,oForm,oRefField)
        {
              var sValue="";
              var sTableName=oRefField.table;
              var sFieldName=oRefField.field;
              if(sTableName && sFieldName)
			  {
			       var oRefNode=oDefineXML.selectSingleNode("/root/TABLE[@NAME='"+sTableName+"']/"+sFieldName);
			       if(oRefNode)
			       {
			            var sValueType=oRefNode.getAttribute("DEFAULT_VALUE_TYPE");
			            if(sValueType!=form.elementValueType.constant)
			            {
			                var oValueType=Factory.getValueType(oRefNode,sValueType);
			                if(oValueType)
			                   oValueType.setValue(oRefNode,oForm,oDefineXML);
			            }
			            sValue=oRefNode.getAttribute("DEFAULT_VALUE");
			       }
			  }
			  return sValue;
        }
		var Factory=
		{
		   createdNode:{},
		   getInstance:(function ()
		              {
			               var oValueType={};
					       oValueType[form.elementValueType.constant]=new constantValue();
					       oValueType[form.elementValueType.seq]= new seqValue();
					       oValueType[form.elementValueType.global]=new globalValue();
					       oValueType[form.elementValueType.foreign]=new foreignValue();
					       oValueType[form.elementValueType.sqlExp]=new sqlValue();
					       oValueType[form.elementValueType.sqlFunc]=new sqlValue();
					       oValueType[form.elementValueType.app]=new appValue();
					       oValueType[form.elementValueType.urlParam]=new urlParamValue();
					       return oValueType;
		              })(),
		   getValueType:function(node,sType)
		   {
		       var sFieldId=node.getAttribute("FIELD_ID");
		       if(sFieldId in this.createdNode)
		       {
		           EMsg(formLang.default_val_error_nested_call);
		           return null;
		       }		       
		       this.createdNode[sFieldId]=null;
		       return this.getInstance[sType];
		   }
		};
		return Factory;
}();
/*
   表单元素实现类,vElement是虚类,Factory为工厂类
*/

form.elementFactory=(function()
{
    function vElement()
    {
       this.init=function(oElement,oNode,oForm)
       {
       	   oElement.value=oNode.getAttribute("DEFAULT_VALUE");
           this.setReadOnly(oElement,oNode,oForm);
           this.setShow(oElement,oNode,oForm);		   
       };
       this.isDisabled=true;
       this.getValue=function(oElement,oForm){return oElement.value};
       this.getText=function(oElement,oForm){return this.getValue(oElement,oForm).replace(/\n/gi,"<br>")};
       this.setValue=function(oElement,oNode,sValue,oDataXML){oElement.value=sValue};
       this.isRequireXMLEncode=function(){return true;};
       this.setReadOnly=function(oElement,oNode,oForm)
       {
       	   if(oForm.getIsAfterSave()) return;
           var readOnly=oNode.getAttribute("IS_READONLY");
           if(readOnly=='T')
           {      
           	  var oStaticCfg=this.getStaticCfg(oNode,oForm);
           	  if(!oStaticCfg.renderStatic)
           	  {
                  (this.isDisabled)?(oElement.disabled=true):(oElement.readOnly=true);
                   return;
           	  }
           	  if(oNode.getAttribute("IS_SHOW")=='F') return;
           	  this.staticElement(oElement,oForm.getWin().form.document,oStaticCfg,this.getText(oElement));
           } 
       };
       this.getStaticCfg=function(oNode,oForm)
       {
            var oNodeStaticCfg=flow.Expr.parseJson(oNode.getAttribute("STATIC_CFG"))||{};
	        var oFormStaticCfg=flow.Expr.parseJson(oForm.getStaticCfg())||{};
	        flow.Expr.copyObjFrom(oNodeStaticCfg,oFormStaticCfg);
	        return oFormStaticCfg;       
       }
	   this.staticElement=function(oElement,oFormDoc,staticCfg,sText){};
       this.setShow=function(oElement,oNode,oForm)
       {
       	   if(oForm.getIsAfterSave()) return;
		   var isShow=oNode.getAttribute("IS_SHOW");
		   if(isShow=='F')
		   {
			  oElement.style.visibility="hidden";	
		   }
       };
    }
	vElement.staticElement=function(oElement,oFormDoc,staticCfg,sText,oHiddenEle,oEvent)
    {
     	 if(isHiddenEle()) return;
     	 var oStaticEle= getStaticElement();
     	 if(isStaticed())
     	 {
     	     swapElementDisplay();
     	     var realReanderElement=(oElement.contentElement)?oElement.contentElement:oElement.refStaticElement;
     	     realReanderElement.innerHTML=sText;
     	     return;
     	 }
         var contentElement=renderStaticElement();                 
		 oElement.refStaticElement=oStaticEle;
		 oElement.contentElement=contentElement;
	     oElement.insertAdjacentElement("afterEnd",oStaticEle);
		 function renderStaticElement()
		 {
		    var oEleStyle=getStyle(oElement);
		    swapElementDisplay();		    
	        var oContentDiv;		 
		    if(oEvent && oEvent.onBeforeStatic)  
		    {
		        oContentDiv=oEvent.onBeforeStatic.call(this,oStaticEle);
		    }
		    setStyle(oEleStyle,oStaticEle,staticCfg);
		    oContentDiv?oContentDiv.innerHTML=sText:oStaticEle.innerHTML=sText;
		    if(oEvent && oEvent.onAfterStatic)  
		    {
		        oEvent.onAfterStatic.call(this,oStaticEle);
		    }
		    return oContentDiv;
		 }
		 function isHiddenEle()
		 {
		    return (oElement.tagName && oElement.tagName.toUpperCase()=='INPUT'
    	                 && oElement.type=="hidden");
		 }		 
		 function isStaticed()
		 {
		    return (oElement.refStaticElement);		 
		 }
		 function swapElementDisplay()
		 {
		     (oHiddenEle)?oHiddenEle.style.display="none":oElement.style.display="none"; 
		     oStaticEle.style.display="";
		 }
		 function getStaticElement()
		 {
		 	 if(oElement.refStaticElement) return oElement.refStaticElement;
			 if(staticCfg.staticTo) return oFormDoc.getElementById(staticCfg.staticTo);
			 var tagName=staticCfg.tagName?staticCfg.tagName:'span';
			 var oStaticEle=oFormDoc.createElement(tagName);
			 return oStaticEle;
		 }
		 function setStyle(oEleStyle,oStaticEle,staticCfg)
		 {	
		 	if(staticCfg.style)
		 	   oStaticEle.style.cssText+=";"+staticCfg.style;
		 	for(var key in oEleStyle)
		 	{
		 	   if(!oStaticEle.style[key])
		          oStaticEle.style[key]=oEleStyle[key];
		 	}
		 }
		 function getStyle(oElement)
		 {
		 	 var realElement=oHiddenEle||oElement;
		 	 var styleWidth=realElement.currentStyle.width;
		 	 var styleHeight=realElement.currentStyle.height;
		 	 var sWidth=realElement.offsetWidth||styleWidth;
    	     var sHeight=realElement.offsetHeight||styleHeight;
		     var oStyle={'width':sWidth,'height':sHeight,'word-wrap':'break-word','word-break':'break-all'};
		     var oStyelAttr=['margin','float','position','clear','left','top'];		     
		     for (var i=0;i<oStyelAttr.length;i++)
		     {
		     	 var sStyleAttr=oStyelAttr[i];
		         if(oElement.style[sStyleAttr])
		            oStyle[sStyleAttr]=oElement.style[sStyleAttr];
		     }
		     return oStyle;		     
		 }
    }
    
    vElement.staticBigText=function(oElement,oFormDoc,staticCfg,sText,oHiddenEle)
    {
        staticCfg.tagName='div';
        var resizeDivHeight=25;
        vElement.staticElement(oElement,oFormDoc,staticCfg,sText,oHiddenEle,{onBeforeStatic:wapperDiv,onAfterStatic:autoSize});	    
	    function wapperDiv(oStaticEle)
	    {
	       oStaticEle.style.overflow='auto';
	       var oResizeDiv=oFormDoc.createElement('div');
	       oResizeDiv.innerText=formLang.exp_all;
	       oResizeDiv.style.display='none';
	       oResizeDiv.style.textAlign='center';
	       oResizeDiv.style.height=resizeDivHeight+'px';
	       var oContentDiv=oFormDoc.createElement('div');
	       oStaticEle.appendChild(oResizeDiv);
	       oStaticEle.appendChild(oContentDiv);
           return oContentDiv;	
	    }
	    function autoSize(oStaticEle)
	    {
	       oFormDoc.body.appendChild(oStaticEle)
	       if(!isScrollY(oStaticEle))
	       {
	          oStaticEle.style.height='auto';
	          return;
	       }
	       oStaticEle.style.overflow='hidden';
	       var oResizeDiv=oStaticEle.firstChild;
	       var oContentDiv=oResizeDiv.nextSibling;
	       var iContentDivHeight=oStaticEle.offsetHeight-resizeDivHeight;
	       oResizeDiv.style.display="";
	       oResizeDiv.style.fontFamily='宋体';
	       oResizeDiv.style.color='blue';
	       oResizeDiv.style.cursor='hand';
	       oResizeDiv.style.lineHeight=resizeDivHeight+'px';
	       oContentDiv.style.height=iContentDivHeight+'px';
	       oContentDiv.style.overflow='auto';
	       oStaticEle.style.height='auto';
	       var isFullSize=0;
	       oResizeDiv.onclick=function()
	       {
	       	   var iContentHeight=oContentDiv.scrollHeight
	           isFullSize=(isFullSize==0)?1:0;
	       	   oResizeDiv.innerHTML=(isFullSize==1)?formLang.collapse:formLang.exp_all;
	           oContentDiv.style.height=(isFullSize==1)?iContentHeight+'px':iContentDivHeight+'px';
	       }
	    }
	    
	    function isScrollY(o)
	    {
	       var st = o.scrollTop;
	       var scrollY = false;
	       o.scrollTop += (st > 0) ? -1 : 1;
	       o.scrollTop !== st && (scrollY = scrollY || true);
	       o.scrollTop = st;
	       return scrollY;
	    }
    }
	
	function textElement()
	{
	    vElement.call(this);
	    this.isDisabled=false;
		this.staticElement=function(oElement,oFormDoc,staticCfg,sText)
		{
		    vElement.staticElement(oElement,oFormDoc,staticCfg,sText);
		};
	}
	
	function textAreaElement()
	{
	    vElement.call(this);
	    this.isDisabled=false;
	    this.staticElement=function(oElement,oFormDoc,staticCfg,sText)
		{
			vElement.staticBigText(oElement,oFormDoc,staticCfg,sText);
		};
	}
	
	function hiddenElement()
	{
	    vElement.call(this);
	    this.isDisabled=false;
	}
    	
    function selectElement()
	{
	    vElement.call(this);
	    this.init=function(oElement,oNode,oForm)
	    {
		    var oParam=oNode.childNodes;
		    var sDefaultValue=oNode.getAttribute("DEFAULT_VALUE");		   
		    if(oParam.length==0) 
		    {
		       this.setValue(oElement,oNode,sDefaultValue);
		       this.setReadOnly(oElement,oNode,oForm);
		       return;
		    }
		    var isEmpty=oNode.getAttribute("IS_EMPTY");		    
            for(var i=oElement.length-1;i>=0;i--)
	        {
			    oElement.options.remove(i);
		    }	  
		    if(isEmpty!="F")//如果允许为空，在下拉框上面加个空的Option
		    {
               var oOption = document.createElement("OPTION");
		       oOption.value ="";
		       oOption.text ="";
		       oElement.add(oOption);
		    }
		    visitNodeParams(oNode,buildOption);
		    this.setReadOnly(oElement,oNode,oForm);
            this.setShow(oElement,oNode,oForm);
		    function buildOption(oParam)
		    {
		        var oOption = document.createElement("OPTION");
		        var sValue  = oParam.value;
		        oOption.value = sValue;
		        oOption.text  = oParam.text;
				oOption.disabled=oParam.disabled
		        if(sValue.isInArray(sDefaultValue.split(",")))
		        {
		           oOption.selected=true;
		        }
		        oElement.add(oOption);
		    }
	   };	   
	   this.getValue=function(oElement)
	   {
	       return get(oElement,"value");
	   };
	   this.getText=function(oElement)
	   {
	       return get(oElement,"text");
	   };
	   this.setValue=function(oElement,oNode,sValue,oDataXML)
	   {
            var iLen=oElement.length;
            var aValue=sValue.split(",");
			for (i=0;i<iLen;i++)
			{
			   var oOption=oElement.options[i];   
		       if (oOption.value.isInArray(aValue))
			   {
			       oOption.selected=true;
			       if(!oElement.multiple) break;
			   }
		    }
       };
       this.staticElement=function(oElement,oFormDoc,staticCfg,sText)
	   {
		   vElement.staticElement(oElement,oFormDoc,staticCfg,sText);
	   };
       function get(oElement,sSymbol)
       {
	       if(oElement.selectedIndex!=-1)
	          return oElement[oElement.selectedIndex][sSymbol];
	       else
	          return "";
       }
	}

    function mSelectElement()
    {
       selectElement.call(this);
	   this.getValue=function(oElement)
	   {
	       return get(oElement,"value");
	   };
	   this.getText=function(oElement)
	   {
	       return get(oElement,"text");
	   };
	   function get(oElement,sSymbol)
       {
	       var sValue="";
	       var iLen=oElement.length;
	       for(var i=0;i<iLen;i++)
	       {
			    var oOption=oElement.options[i];
			    if(oOption.selected==true)
			    {
			        sValue=sValue+oOption[sSymbol]+",";
			    }
		   }
		   return sValue.slice(0,-1);
       }
	}
	
	function listElement(listType)
	{
	    vElement.call(this);
	    this.init=function(oElement,oNode,oForm)
	    {
	       var oParam=oNode.childNodes;
	       var sDefaultValue=oNode.getAttribute("DEFAULT_VALUE");
		   if(oParam.length==0)
		   { 
		      this.setValue(oElement,oNode,sDefaultValue);
		      this.setReadOnly(oElement,oNode,oForm);
		      return;
		   }
	       var sListHTML="";
	       var sListName=oNode.getAttribute("ELEMENT_NAME");
	       var iColNum=oNode.getAttribute("INIT_LIST_COL_NUM");
	       var iStep=(iColNum=="")?1:iColNum;
	       visitNodeParams(oNode,buildList);
	       oElement.innerHTML=sListHTML;
	       this.setReadOnly(oElement,oNode,oForm);
           this.setShow(oElement,oNode,oForm);
	       this.setEvent(oElement,oElement.all(sListName),oForm);
	       function buildList(oParam)
		   {
		        var sValue=oParam.value;
		        var sChecked=(oParam.value).isInArray(sDefaultValue.split(","))?"checked":"";
		        var sDisabled=(oParam.disabled)?"disabled":"";		        
		        sListHTML+="<input type='"+listType
		                    +"' name='"+sListName
		                    +"' "+sChecked+" "+sDisabled+" index='"+oParam.loopNum
		                    +"' value='"+oParam.value+"'/>"
		                    +"<span>"+oParam.text+"</span>";
		        if((oParam.loopNum+1)%iStep==0)
		        {
		            sListHTML+="<br/>";
		        }
		   }		   
	    }
	    this.getValue=function(oElement)
	    {
           return get(oElement,"value");
	    };
	    this.getText=function(oElement)
	    {
           return get(oElement,"text");
	    };
	    this.setValue=function(oElement,oNode,sValue,oDataXML)
	    {
	    	var iLen=oElement.childNodes.length;
            var aValue=sValue.split(",");
			for (i=0;i<iLen;i++)
			{
			   var oChild=oElement.childNodes[i];
			   var sChildValue=oChild.value+"";		   
		       if(sChildValue.isInArray(aValue))
			   {
			       oChild.checked=true;
			       if(listType=="radio") break;
			   }
		    }
        };
        this.staticElement=function(oElement,oFormDoc,staticCfg,sText)
	    {
		    vElement.staticElement(oElement,oFormDoc,staticCfg,sText);
	    };
        function get(oElement,sSymbol)
        {
           var oChildNodes=oElement.getElementsByTagName("input");;
           var iLen=oChildNodes.length;
           var sValue="";
	       for (i=0;i<iLen;i++)
	       {
	          var oChildNode=oChildNodes[i];
              if(oChildNode.checked)
              {
                 if(sSymbol=="value")
                 {
	                sValue+=oChildNode.value+",";
	             }
	             else
	             {
	                var oChildText=oChildNode.nextSibling;	                
	                sValue+=oChildText.innerText+",";
	             }
	          }
           }
           return sValue.slice(0,-1);
        }
	}
	
	function radioElement()
    {
        listElement.call(this,"radio");
        this.setEvent=function(oElement,oChilds,oForm)
		{
	        var iLen=oChilds.length;
	        oElement.index=-1;
			for (var i=0;i<iLen;i++)
			{
			   var oChild=oChilds[i];
			   if(oChild.checked) oElement.index=i;	
			   oChild.onclick=function()
			   {
			   	   if(this.index!=oElement.index)
			   	      eval("oForm.getWin().form."+oElement.onValueChange);
			   	   oElement.index=this.index;		       
			   }
			}
	    };
	}
	
	function checkboxElement()
    {
       listElement.call(this,"checkbox");
       this.setEvent=function(oElement,oChilds,oForm)
       {
            var iLen=oChilds.length;
			for (var i=0;i<iLen;i++)
			{
			   var oChild=oChilds[i];
			   oChild.onclick=function()
			   {
			   	   eval("oForm.getWin().form."+oElement.onValueChange);       
			   }
			}
       };
	}
	
	function calendarElement()
    {
       vElement.call(this);
       this.staticElement=function(oElement,oFormDoc,staticCfg,sText)
	   {
		    vElement.staticElement(oElement,oFormDoc,staticCfg,sText);
	   };
	}
	
	function treeValueElement()
    {
       vElement.call(this);
       this.isDisabled=false;
       this.getValue=function(oElement)
       {
           return (oElement.value==null)?"":oElement.value;
       }
       this.getText=function(oElement)
       {
           return oElement.text;
       }
       this.staticElement=function(oElement,oFormDoc,staticCfg,sText)
	   {
		    vElement.staticElement(oElement,oFormDoc,staticCfg,sText);
	   };
	}
	
	function treeTextElement()
    {
       vElement.call(this);
       this.isDisabled=false;
       this.init=function(oElement,oNode,oForm)
       {
           oElement.text=oNode.getAttribute("DEFAULT_VALUE");
           this.setReadOnly(oElement,oNode,oForm);
       }
       this.getValue=function(oElement)
       {
           return (oElement.text==null)?"":oElement.text;
       }
       this.getText=function(oElement)
       {
           return oElement.text;
       }
       this.setValue=function(oElement,oNode,sValue,oDataXML)
       {
           oElement.text=sValue;
       }
	}
	
	function refElement()
	{
	    vElement.call(this);
	    this.getRequestId=function(oNode,oDataXML)
	    {
	        var iRequestId="0";
	        var oParentNode=oNode.parentNode;
	        var sTableName=oParentNode.getAttribute("NAME");
	        if(oDataXML)
	        {
		        var oRequestNode=oDataXML.selectSingleNode("//TABLE[@NAME='"+sTableName+"']/REQUEST_ID");
		        if(oRequestNode)
	            {
	                iRequestId=oRequestNode.text;
	            }
	        }
            return iRequestId;
	    }
	    this.show=function(iRequestId){};
	    this.setValue=function(oElement,oNode,sValue,oDataXML,oForm)
	    {
	        var iRequestId=this.getRequestId(oNode,oDataXML);
	        if(iRequestId.is_num())
	        {
	            this.show(iRequestId,oElement,oNode,sValue,oForm);
	        }
	    }
	}
	function historyElement()
    {
       refElement.call(this);
       this.init=function(oElement,oNode,oForm)
       {
       	   oElement.type=oForm.getHisType();
       	   oElement.doInit();
           if(oForm.getFormBahavior()!=form.action.create)
           {
               this.setValue(oElement,oNode,"",oForm.getoDataXML(),oForm);               
           }
           this.setShow(oElement,oNode,oForm);
       }
       this.getValue=function(oElement)
       {
           return "";
       };
       this.show=function(iRequestId,oElement,oNode,sValue,oForm)
       {
           oElement.value=iRequestId;
       };
       this.getText=function(oElement)
       {
           return oElement.text;
       }
	}
	
	function attachElement(attachType)
    {
       refElement.call(this);
       this.init=function(oElement,oNode,oForm)
       {
           oElement.type=attachType;
           this.setReadOnly(oElement,oNode,oForm);
           this.setShow(oElement,oNode,oForm);
           if(oForm.getIsAfterSave())
           {
           		this.setValue(oElement,oNode,"",oForm.getoDataXML(),oForm);
           }
           else
           {
	           oElement.doInit(oForm,form.resource.attach);
	           if(oForm.getFormBahavior()!=form.action.create)
	           {
	               this.setValue(oElement,oNode,"",oForm.getoDataXML(),oForm);
	           }  
	       }         
       }
       this.show=function(iRequestId,oElement,oNode,sValue,oForm)
       {
            oElement.value={requestId:iRequestId,fieldName:oNode.tagName};
       };
       this.getText=function(oElement)
       {
            return "";
       };
       this.isRequireXMLEncode=function(){return false;};
       this.isDisabled=false;
	}	
	
	function singleAttachElement()
    {
        attachElement.call(this,"1");
	}
	
	function attachPoolElement()
    {
        attachElement.call(this,"2");
	}
	
	function logElement()
    {
       refElement.call(this);
       this.init=function(oElement,oNode,oForm)
       {
       	   this.setReadOnly(oElement,oNode,oForm);
       	   this.setShow(oElement,oNode,oForm);
           if(oForm.getIsAfterSave())
           {
           		var iRequestId=this.getRequestId(oNode,oForm.getoDataXML());
		        if(iRequestId.is_num())
		        {
		            oElement.reloadChild({requestId:iRequestId,fieldName:oNode.tagName,value:""});
		        }
           }
           else
           {
           	   oElement.doInit()
	           if(oForm.getFormBahavior()!=form.action.create)
	           {
	               this.setValue(oElement,oNode,"",oForm.getoDataXML(),oForm);
	           }
	       }           
       }
       this.show=function(iRequestId,oElement,oNode,sValue,oForm)
       {
            oElement.value={requestId:iRequestId,fieldName:oNode.tagName,value:sValue};
       };
       this.getText=function(oElement)
       {
            return oElement.text;
       };
       this.isDisabled=false;
	}
	
	function bigTextElement()
	{
	   refElement.call(this);
       this.isDisabled=false;
	   this.init=function(oElement,oNode,oForm)
       {   
           setBigText(oElement,oNode,oForm,this);
           if(oForm.getIsAfterSave()) return;           
           this.setShow(oElement,oNode,oForm);
       }
       this.setValue=function(oElement,oNode,sValue,oDataXML,oForm)
       {
            oElement.value=sValue;
       }
       var setBigText=function(oElement,oNode,oForm,textElement)
	   {
           if(oForm.getFormBahavior()==form.action.create)
           {
               oElement.value=oNode.getAttribute("DEFAULT_VALUE");;
               return;
           };
           oNode.setAttribute("REF_REQUEST_ID","-1");
	       var iRequestId=textElement.getRequestId(oNode,oForm.getoDataXML());
	       if(iRequestId.is_num())
	       {
	         	 var sURL='/servlet/formDispatch?OperType=10&fieldName='+oNode.tagName+"&requestId="+iRequestId;
	         	 formApp.ajaxRequest(sURL,{async:true,onStateChange:function(oXMLHttp){getServerText(oXMLHttp,oElement,oNode)}});
	       }
	       function getServerText(oXMLHttp,oElement,oNode)
	       {
	         	if(oXMLHttp.readyState!=4) return;
			    if(isSuccess(oXMLHttp))
			    {
				    var oXML=oXMLHttp.responseXML;
			     	var oRowSet=oXML.selectSingleNode("/root/rowSet");
			      	if(oRowSet)
					{	
					    var requestId=oRowSet.getAttribute("id");							
     					oElement.value=oXML.selectSingleNode("/root/rowSet/CONTENT").text;
						oNode.setAttribute("REF_REQUEST_ID",requestId);
					}
			    }
			    textElement.setReadOnly(oElement,oNode,oForm); 
	        }
	    }
	    this.show=function(iRequestId,oElement,oNode,oForm)
        {
            var oXML=formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=10&fieldName='
			                                                 +oNode.tagName+"&requestId="+iRequestId);
			var requestId=oXML.selectSingleNode("/root/rowSet").getAttribute("id");
			var sContent=oXML.selectSingleNode("/root/rowSet/CONTENT").text;
			oElement.value=sContent;
			oNode.setAttribute("REF_REQUEST_ID",requestId);
        };
        this.staticElement=function(oElement,oFormDoc,staticCfg,sText)
		{
			vElement.staticBigText(oElement,oFormDoc,staticCfg,sText);
		};
	}
	function richTextElement()
	{
	    refElement.call(this);
	    var editor;
	    this.init=function(oElement,oNode,oForm)
        {
           if(oForm.getIsAfterSave())
           {
               setRichText(oElement,oNode,oForm,this);
               return;
           }
           var sElementName=oNode.getAttribute("ELEMENT_NAME");
           editor=oForm.getWin().form.KE;
           var richElement=this;
           if(editor)
           {
           	  editor.show({loadStyleMode:false,id :sElementName,items:form.editorMenu,
           	               afterCreate:function(id)
           	               {
           	                   setRichText(oElement,oNode,oForm,richElement);           	                   
           	                   this.afterCreate=function(id){};
				               return this.afterCreate(id);				              
				           }});
           }
           this.setShow(oElement,oNode,oForm);
        };
        var setRichText=function(oElement,oNode,oForm,richElement)
        {
             if(oForm.getFormBahavior()==form.action.create)
             {
             	  var sDefaultValue=oNode.getAttribute("DEFAULT_VALUE");
                  oForm.getWin().form.KE.html(oElement.id,sDefaultValue);
                  oForm.getWin().form.KE.sync(oElement.id);
                  return;
             };
             oNode.setAttribute("REF_REQUEST_ID","-1");
	         var iRequestId=richElement.getRequestId(oNode,oForm.getoDataXML());
	         if(iRequestId.is_num())
	         {
	         	 var sURL='/servlet/formDispatch?OperType=10&fieldName='+oNode.tagName+"&requestId="+iRequestId;
	         	 formApp.ajaxRequest(sURL,{async:true,onStateChange:function(oXMLHttp){getServerText(oXMLHttp,oElement,oNode)}});
	         }
	         function getServerText(oXMLHttp,oElement,oNode)
	         {
	         	   if(oXMLHttp.readyState!=4) return;
			       if(isSuccess(oXMLHttp))
			       {
				        var oXML=oXMLHttp.responseXML;
			         	var oRowSet=oXML.selectSingleNode("/root/rowSet");
			         	if(oRowSet)
						{	
						    var requestId=oRowSet.getAttribute("id");							
     						oForm.getWin().form.KE.html(oElement.id,oXML.selectSingleNode("/root/rowSet/CONTENT").text);
    						oForm.getWin().form.KE.sync(oElement.id);
							oNode.setAttribute("REF_REQUEST_ID",requestId);							
						}
			       }
			       richElement.setReadOnly(oElement,oNode,oForm);
	        }
        }
        
        this.setValue=function(oElement,oNode,sValue,oDataXML,oForm)
        {
            var editor=oForm.getWin().form.KE,
                sElementName = oNode.getAttribute("ELEMENT_NAME");
            editor.html(sElementName,sValue);
		    editor.sync(sElementName);
        }
        this.getValue=function(oElement,oForm)
        {
        	var editor=oForm.getWin().form.KE;
            return editor.html(oElement.id);
        };
	    this.setReadOnly=function(oElement,oNode,oForm)
        {
           if(oForm.getIsAfterSave()) return;
           var readOnly=oNode.getAttribute("IS_READONLY");
           var sElementName=oNode.getAttribute("ELEMENT_NAME");
           if(readOnly=='T')           
           { 
           	   var oStaticCfg=this.getStaticCfg(oNode,oForm);
           	   if(!oStaticCfg.renderStatic)
           	   {
	           	   if(editor)
	           	   {
		               editor.readonly(sElementName);
		               editor.toolbar.disable(sElementName, []);
		               editor.g[sElementName].newTextarea.disabled = true;
	           	   }
	           	   return;
           	   }
           	   if(oNode.getAttribute("IS_SHOW")=='F') return;
           	   vElement.staticBigText(oElement,oForm.getWin().form.document,oStaticCfg,
           	                         this.getValue(oElement,oForm),oElement.previousSibling);
           }
        };
        this.setShow=function(oElement,oNode,oForm)
        {
        	if(oForm.getIsAfterSave()) return;
		    var isShow=oNode.getAttribute("IS_SHOW");
		    if(isShow=='F')
		    {
			   oElement.style.display="none";	
		    }
        };
	}
	function keyValueElement()
	{
	   vElement.call(this);
	   this.init=function(oElement,oNode,oForm)
       {
           var sValue=oNode.getAttribute("DEFAULT_VALUE");
           if(sValue!="")
           {
                this.setValue(oElement,oNode,sValue);
           }
           this.setShow(oElement,oNode,oForm);
           this.setReadOnly(oElement,oNode,oForm);
       }
       this.setValue=function(oElement,oNode,sValue,oDataXML)
	   {
            oElement.value=sValue;
            oElement.setReturnText();
	   }
	   this.getText=function(oElement)
	   {
	        return oElement.text;
	   }
	   this.staticElement=function(oElement,oFormDoc,staticCfg,sText)
	   {
		    vElement.staticElement(oElement,oFormDoc,staticCfg,sText);
	   };
	}
	
	function spanElement()
    {
       vElement.call(this);
       this.init=function(oElement,oNode,oForm)
       {
       	  if(oNode.getAttribute("DEFAULT_VALUE"))
             oElement.innerHTML=oNode.getAttribute("DEFAULT_VALUE");
          this.setShow(oElement,oNode,oForm);
       };
       this.getValue=function(oElement){return oElement.innerText};
       this.getText=function(oElement){return this.getValue(oElement)};
       this.setValue=function(oElement,oNode,sValue,oDataXML){oElement.innerHTML=sValue};
    }
    
    function divElement()
    {
       vElement.call(this);
       this.init=function(oElement,oNode,oForm){this.setShow(oElement,oNode,oForm);};
       this.getValue=function(oElement){return ""};
       this.getText=function(oElement){return this.innerText};
       this.setValue=function(oElement,oNode,sValue,oDataXML){};
       this.setShow=function(oElement,oNode,oForm)
       {
           if(oForm.getIsAfterSave()) return;
		   var isShow=oNode.getAttribute("IS_SHOW");
		   if(isShow=='F')
		   {		   	  
			  oElement.style.display="none";	
		   }
       };
    }
    
    function buttonElement()
    {
       vElement.call(this);
       this.init=function(oElement,oNode,oForm)
       {
            this.setReadOnly(oElement,oNode,oForm);
            this.setShow(oElement,oNode,oForm);
       };
       this.getValue=function(oElement){return oElement.value};
       this.getText=function(oElement){return this.getValue(oElement)};
       this.setValue=function(oElement,oNode,sValue,oDataXML){};
       this.staticElement=function(oElement,oFormDoc,staticCfg,sText)
	   {
		    oElement.style.visibility='hidden';
	   };
    }
    
	function visitNodeParams(oNode,oVisitor)
    {
         var oParams=oNode.childNodes;
		 var iLen=oParams.length;
		 for(var i=0;i<iLen;i++)
		 {
		     var oParam=oParams[i];
			 isDisabed=(oParam.getAttribute("state")==form.elementState.inValid);
		     oVisitor.call(this,{value:oParam.getAttribute("value"),text:oParam.text,disabled:isDisabed,loopNum:i});
		}
    }    
	var Factory=
	{
	   aElementType:(function()
	                {
			            var oElementType={};
				        oElementType[form.elementType.text]=new textElement();
				        oElementType[form.elementType.textarea]= new textAreaElement();
				        oElementType[form.elementType.richText]= new richTextElement();
				        oElementType[form.elementType.select]=new selectElement();
				        oElementType[form.elementType.mSelect]=new mSelectElement();
				        oElementType[form.elementType.hidden]=new hiddenElement();
				        oElementType[form.elementType.radio]=new radioElement();
				        oElementType[form.elementType.check]=new checkboxElement();
				        oElementType[form.elementType.calendar]=new calendarElement();
				        oElementType[form.elementType.treeValue]=new treeValueElement();
				        oElementType[form.elementType.treeText]=new treeTextElement();
				        oElementType[form.elementType.history]=new historyElement();
				        oElementType[form.elementType.singleAttach]=new singleAttachElement();
				        oElementType[form.elementType.attachPool]=new attachPoolElement();
				        oElementType[form.elementType.bigText]=new bigTextElement();
				        oElementType[form.elementType.keyValue]=new keyValueElement();
				        oElementType[form.elementType.button]=new buttonElement();
				        oElementType[form.elementType.span]= new spanElement();
				        oElementType[form.elementType.log]= new logElement();
				        oElementType[form.elementType.div]= new divElement();
				        return oElementType;
	                })(),
	   getElementType:function(sType)
	   {
	       return this.aElementType[sType];
	   }
	};
	return Factory;
})();

/*flowForm类*/
function flowForm(flowRequest)
{
   form.call(this,flowRequest);
   var serialing=false;
   var paralleling=false;
   this.setSerialing=function(pSerialing){serialing=pSerialing;};
   this.isSerialing=function(){return serialing;};
   this.setParalleling=function(pParalleling){paralleling=pParalleling;};
   this.isParalleling=function(){return paralleling;};
   this.isFlow=function(){return true};
   this.loadData=function(isAfterSave)
   {
       var iFlowMod=flowRequest.flowMod;
       var iTchId=flowRequest.tchId;
       var iFlowId=flowRequest.flowId;
       if(isAfterSave)
       {
       		iFlowId = this.FLOW.TOP_FLOW_ID;
       		if(iTchId==0) iTchId = -1;
       }
       return formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=3&tchId='
                                     +iTchId+'&form_Id='+this.getFormId()
                                     +'&flowId='+iFlowId);      
   }
   this.loadRightData=function()
   {
       return formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=4&tchId='+flowRequest.tchId
                                       +'&flowMod='+flowRequest.flowMod); 
   }
   this.appendPrintHTML=function(oPrintWin,aPrintParam)
   {
   	   if(aPrintParam && aPrintParam.withoutFlowProc=='T') return;
       if(oPrintWin.document.getElementById("flow_"+this.getFormId())==null)
	   {
		   var sFlowHTML=getFlowProcHTML(this);
		   oPrintWin.document.body.insertAdjacentHTML("beforeEnd",sFlowHTML);
	   }
   }
   this.getHisType = function() { return form.historyType.normal;};  
   function getFlowProcHTML(oForm)
   {
	    var sTable='<div style="visibility:hidden;"><p style="page-break-after:always;"></p></div>'
	               +'<br><div style="width:96%;text-align:center;font-weight:bold;font-size:15pt">'
	               + formLang.flow_proc
	               + '</div><br>'
	               +'<div style="width:100%;" id="flow_'+oForm.getFormId()+'">'
	               +   '<table border="1"  align="center" style="width:96%;BORDER-COLLAPSE: collapse;table-layout:fixed;"'
	               +        ' bordercolor="#111111"	cellpadding="2">'
	               +       '<tr height="25" style="font-weight:bold;">'
	               +         '<TD width="16%">'+formLang.exec_staff+'</TD><TD width="21%">' +formLang.tache_context+ '</TD>'
	               +         '<TD width="32%">'+formLang.execute_result+'</TD><TD width="15%">'+formLang.tch_doc+'</TD><TD width="16%">'+formLang.finish_time+'</TD>'
	               +       '</tr>'
		var xmlDom=formApp.syncAjaxRequest("../../servlet/flowOper?OperType=3&flowId="+oForm.FLOW.TOP_FLOW_ID+"&tchId=0");
		var oRows=xmlDom.selectNodes("//rowSet");
		var iLen=oRows.length;
		for (var i=0;i<iLen;i++)
		{
		     var oRow=oRows[i];
		     var sReg=/\.\.\/\.\.\//gi;
		     var sDoc=oRow.selectSingleNode("DOC").text;
		     var iLevel=parseInt(oRow.getAttribute("level"),10);
		     var iMargin=iLevel*20;
		     var sStaffName=oRow.selectSingleNode("STAFF_NAME").text;
		     if(sStaffName=="") sStaffName=oRow.selectSingleNode("RECEIVER").text;
		     sTable+='<tr>'
		           +   '<td style="margin-left:'+iMargin+'px">'+sStaffName+'</Td>'
		           +   '<td>'+oRow.selectSingleNode("TCH_CONT_DESC").text+'</Td>'
		           +   '<td>'+oRow.selectSingleNode("RESULT_DESC").text+'</Td>'
		           +   '<td>'+sDoc.replace(sReg,"../../../")+'</Td>'
		           +   '<td>'+oRow.selectSingleNode("FINISH_DATE").text+'</Td>'
		           + '</tr>';
		}
	 	sTable+='</table></div>';
	 	return sTable;
	}
	this.execFlowUIHook=function(){this.getWin().toolbar.tache.Service.rebuildAll();}
	this.flowTo=function(aParam){this.getWin().toolbar.flow.Service.flowTo(aParam);}
	this.flowToNext=function(aParam){this.getWin().toolbar.flow.Service.flowToNext(aParam);}
	this.flowToDefault=function(aParam){this.getWin().toolbar.flow.Service.flowToDefault(aParam);}
	this.closePopup=function(){this.getWin().toolbar.tache.Service.closeLayer();}
	this.getTchOpinion=function()
	{
		var oLayer=this.getWin().toolbar.tache.Service.layer;
	    if(oLayer)
	    {
	        return oLayer.$("FL_EGN_OPINION_INPUT").value;
	    }
	    return "";
	}	
}
/*CIForm 类*/
function CIForm(CIRequest)
{
   form.call(this,CIRequest);
   this.loadData=function(isAfterSave)
   {
       if(isAfterSave)
       {
       		var oTable = this.TABLE;
       		for(var o in oTable)
       		{
       			if(oTable[o]["REQUEST_ID"]) CIRequest.requestId = oTable[o]["REQUEST_ID"].VALUE();
       			break;
       		}
       }
       return formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=3&classId='+CIRequest.classId
                                     +"&requestId="+CIRequest.requestId);      
   }
   this.loadRightData=function()
   {
       return null;
   }
}
/*新CMDB CIForm 类*/
function NCIForm(CIRequest)
{
   form.call(this,CIRequest);
   this.loadData=function(isAfterSave)
   {
       if(isAfterSave)
       {
       		var oTable = this.TABLE;
       		for(var o in oTable)
       		{
       			if(oTable[o]["REQUEST_ID"]) CIRequest.requestId = oTable[o]["REQUEST_ID"].VALUE();
       			break;
       		}
       }
       return formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=3&classId='+CIRequest.classId
                                     +"&requestId="+CIRequest.requestId+"&dataSetId="+CIRequest.dataSetId);      
   }
   this.loadRightData=function()
   {
       return null;
   }
}
/*normalForm 类*/
function normalForm(request)
{
   form.call(this,request);
   this.loadData=function()
   {
       return formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=3&formId='+request.formId
                                     +"&requestId="+request.requestId);       
   }
   this.loadRightData=function()
   {
       return null;
   }
   this.getHisType = function() { return form.historyType.normal;}; 
}