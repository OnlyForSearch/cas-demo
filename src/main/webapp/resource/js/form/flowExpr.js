var flowExprLang;
if("undefined" != typeof(ItmLang) && ItmLang.flow)
{
	flowExprLang = ItmLang.flow;
}
else
{
	flowExprLang = 
	{
		invain_cust_method_call:"无效的自定义方法调用",
		invain_form_element:"无效的表单元素"
	};
}

flow={};
flow.constant={
	             actionImg: {run:"forward.gif","return":"sendWork.gif",
	                         end:"045631417.gif",transfer:"organ_top.gif"},
	             actionType:{all:"all",run:"run",back:"return",end:"end",transfer:"transfer"},
	             aBoolean:  {True:'0BT',False:'0BF'},
	             staffCreateType:{fixedStaff:'0',func:'1',deptTree:'2',groupTree:'3',dutyTree:'4',fixedDep:'7'},
	             scriptType:{js:"js",sqlProc:"sqlProc",sqlFunc:"sqlFunc",java:"java"},
	             operType:{single:'single',more:'more',endTask:'endTask',directFlow:'directFlow'},
	             serialState:{none:"none",inProgress:"inProgress",finish:"finish"}
              }
flow.Expr={};
flow.Expr.parseJson=function(jsonText)
{
   if(!jsonText) return "";
   return (new Function("return " + jsonText))();
}
flow.Expr.copyObj=function(oCopy)
{
    var o={};
    for(key in oCopy)
      o[key]=oCopy[key];
    return o;
}
flow.Expr.copyObjFrom=function(oCopyFrom,oCopyTo)
{
    for(key in oCopyFrom)
      oCopyTo[key]=oCopyFrom[key];
}
flow.Expr.exec=function(sExpr,aParam)
{
	var sFunc=flow.Expr.getExecScript(sExpr,aParam);
    if(aParam.funcType==flow.constant.scriptType.js)
        return flow.Expr.execCustomJs(sFunc,aParam.isForm);
    if(aParam.funcType==flow.constant.scriptType.sqlProc)
        return execSQL(sFunc);
    function execSQL(sSQL)
	{
		var sXML='<?xml version="1.0" encoding="gb2312"?><root><sqlProc/></root>';
		var XMLDoc=new ActiveXObject("Microsoft.XMLDOM");
		XMLDoc.loadXML(sXML);
		XMLDoc.selectSingleNode("/root/sqlProc").text=sSQL;
		var returnXML=formContext.App.syncAjaxRequest("../../servlet/util?OperType=3",XMLDoc);
		return (returnXML)?true:false;
	}
}
flow.Expr.execCustomJs=function(sFunc,isForm)
{
   
   if(isForm=='0BF')
   {
	   try{return eval(sFunc);}
	   catch(e){EMsg(flowExprLang.invain_cust_method_call + "!");};
   }
   else
   {
	   try{return eval("formContext.getWin().form."+sFunc);}
	   catch(e){EMsg(flowExprLang.invain_cust_method_call + "!");};
   }
	
}
flow.Expr.getExecScript=function(sExpr,aParam)
{
    return flow.Expr.parse("mix",sExpr,aParam);
}
flow.Expr.getExecXML=function(sType,sTagName,sExpr,aParam)
{
    if(sType==flow.constant.scriptType.sqlProc)
    {
       var execScript=flow.Expr.getExecScript(sExpr,aParam);
       if(!execScript) return "";
       return "<"+sTagName+" type='"+flow.constant.scriptType.sqlProc+"'>" +
       		 xmlEncode(execScript)+"</"+sTagName+">";
    }
    if(sType==flow.constant.scriptType.java)
    {
       var oJava=flow.Expr.parse(flow.constant.scriptType.java,sExpr,aParam);
       if(!oJava) return "";
       var sXML="<"+sTagName+" type='"+flow.constant.scriptType.java+"'>";
       sXML+="<java class='"+oJava.className+"' method='"+oJava.methodName+"'>";
       for(var i=0;i<oJava.params.length;i++)
       {
          sXML+="<param>"+xmlEncode(oJava.params[i])+"</param>"
       }
       sXML+="</java></"+sTagName+">";
       return sXML;
    }
    return "";
}
flow.Expr.parse=function(sType,sValue,aParam)
{
   var sReturn="";
   if(sType!="" && sValue!="")
   {
	   var aExecuter={fix:getFixValue,form:getFormValue,mix:parseMix,
	                  sqlFunc:getSqlRetValue,js:getJsValue,java:getJavaValue};
	   sReturn=aExecuter[sType].call(this,sValue,aParam);
   }
   return sReturn;
   function getFixValue(sValue,aParam)
   {
	  return sValue;
   }
   function getFormValue(sValue,aParam)
   {
	  return parseMix(sValue,{});
   }
   function getSqlRetValue(sValue,aParam)
   {
	   var sReturnValue="";
	   aParam.funcType=flow.constant.scriptType.sqlFunc;
	   var sSQL=parseMix(sValue,aParam);
	   sReturnValue=getSQLFuncReturnValue(sSQL);
	   return sReturnValue;
   }
   function getJsValue(sValue,aParam)
   {
	   aParam.funcType=flow.constant.scriptType.js;
	   var sJsValue=parseMix(sValue,aParam);
	   return flow.Expr.execCustomJs(sJsValue)+"";
   }
   function getJavaValue(sJavaExpr,aParam)
   {
	    var sJavaDefine=sJavaExpr.substr(0,sJavaExpr.indexOf('(')).trimall();
		var sClassName=sJavaDefine.substr(0,sJavaDefine.lastIndexOf("."));
		var sMethodName=sJavaDefine.substring(sJavaDefine.lastIndexOf(".")+1,sJavaDefine.length+1);
		var sParam=sJavaExpr.substr(sJavaExpr.indexOf('(')+1,sJavaExpr.length-sJavaExpr.indexOf('('));
		var oJava={className:sClassName.trimall(),methodName:sMethodName.trimall(),params:[]};
	    var reg=/"{1}[^"]*"{1} *(\)|,){1}/gi;
		var aVar=sValue.match(reg);
		if(aVar!=null)
		{
		   for(var i=0;i<aVar.length;i++)
		   {
			  var sVar=aVar[i].slice(1,-2).trimall();
			  sVar=parseMix(sVar,aParam);
			  oJava.params.push(sVar);
		   }
		}
		return oJava;
   }
   
   function getFormAttr(sFormExpr,aParam)
   {
       var sFromAttr=sFormExpr.substr(1);
       var oParamReplace={"TACHE.TCH_MOD":aParam.selTch||""
                         ,"TACHE.STAFF_ID":aParam.selStaff||""
                         ,"TACHE.ACTION":aParam.action||""
                         ,"TACHE.TCH_NUM":aParam.selTchNum||""};
       if(sFromAttr in oParamReplace) return oParamReplace[sFromAttr];
       var isGetValue=(sFromAttr.lastIndexOf(".VALUE")==sFromAttr.length-6);
       if(isGetValue) sFromAttr=sFromAttr+"()";
       try{return eval("formContext."+sFromAttr);}
       catch(e){EMsg(flowExprLang.invain_form_element+"!"+sFromAttr);};
   }	
   function parseForm(str,aParam)
   {
   	   if(str=="") return "";
       var regForm=/(\${1}\w+\.{1}\w+(\.{1}\w+)?(\.{1}\w+)?)|(\${1}\w+\({1}([^)])*\){1})/gi;
   	   var sReturnStr="",arrForm;
   	   var iPrevHead=0;
   	   while ((arrForm = regForm.exec(str)) != null)
   	   {
   	   	   sReturnStr=sReturnStr.concat(str.substring(iPrevHead,arrForm.index));
   	   	   var sFormAttr=getFormAttr(arrForm[0],aParam);
   	   	   sFormAttr=escapeStr(aParam.funcType,sFormAttr);
	       sReturnStr=sReturnStr.concat(sFormAttr);
   	   	   iPrevHead=arrForm.lastIndex;
   	   }
   	   return sReturnStr.concat(str.substring(iPrevHead,str.length)); 
   }
   
   function parseMix(str,aParam)
   {
   	  if(str=="") return "";
      var regJs=/\{{1}[^}]+}{1}/gi;
      var sReturnStr="",arrJs;
      var iPrevHead=0;
      var aTempParam=flow.Expr.copyObj(aParam);
      aTempParam.funcType=flow.constant.scriptType.js;
      while ((arrJs = regJs.exec(str)) != null)
      {
          var sPrevStr=str.substring(iPrevHead,arrJs.index);
          sPrevStr=parseForm(sPrevStr,aParam);
          var sJs=parseForm(arrJs[0].slice(1,-1),aTempParam);
          var sJsReturn=flow.Expr.execCustomJs(sJs)+"";          
          sJsReturn=escapeStr(aParam.funcType,sJsReturn);
          sReturnStr=sReturnStr.concat(sPrevStr).concat(sJsReturn);
          iPrevHead=arrJs.lastIndex;
      }
      var sLastStr=parseForm(str.substring(iPrevHead,str.length),aParam);
      return sReturnStr.concat(sLastStr);
   }   
   function escapeStr(funcType,str)
   {
   	  if(!str) return "";
      if(funcType==flow.constant.scriptType.sqlFunc ||funcType==flow.constant.scriptType.sqlProc)                 
	     return str.replace(/'/g,"''");
	  if(funcType==flow.constant.scriptType.js)
	  {
	     str=str.replace(/\\/g,'\\\\');
	     str=str.replace(/\r\n/g,'\\n');
	     str=str.replace(/"/g,'\\"');
	     return str.replace(/'/g,"\\'");
	  }	     
	  return str;
   } 
   function getSQLFuncReturnValue(sSQLFunc)
	{
	    var sValue="";
	    var sXML='<?xml version="1.0" encoding="gb2312"?><root><sqlFunc/></root>';
		var XMLDoc=new ActiveXObject("Microsoft.XMLDOM");
		XMLDoc.loadXML(sXML);
		XMLDoc.selectSingleNode("/root/sqlFunc").text=sSQLFunc;
		var returnXML=formContext.App.syncAjaxRequest("../../servlet/util?OperType=2",XMLDoc);
	    sValue=(returnXML)?returnXML.selectSingleNode("/root/values").text:"";
		return sValue;
	}
}