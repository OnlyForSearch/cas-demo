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
                         {command:"setAuditType",attr:"AUDIT_TYPE"},
                         {command:"setFormPdfFile",attr:"FILE_PDF_PATH"}
                       ]
           var iLen=oCommands.length;
           for(var i=0;i<iLen;i++)
           {
              var oCommand=oCommands[i];
              var sAttrValue=xmlDoc.selectSingleNode("/root/rowSet/"+oCommand.attr);
              if(!sAttrValue)
              {
		        EMsg("没有找到绑定的表单！");
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
       return new CIApp();
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
        oXMLHTTP.send(oParam.xml||"");
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
