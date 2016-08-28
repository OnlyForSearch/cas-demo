function CIApp()
{
     formApp.call(this);
     var CIRequest=(function ()
     {
          var sClassId=$request("classId")||"";
          var sRequestId=$request("requestId")||"0";
          var sDataSetId=$request("dataSetId")||"0";
          return {classId:sClassId,requestId:sRequestId};
     }
     )();
    this.appContext=(function()
     {
           var xmlDoc=formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=11&classId='
                                            +CIRequest.classId+'&dataSetId='+sDataSetId);
           return {appName:"CI",xmlDoc:xmlDoc};
      })();
    this.formUrl='../../servlet/formDispatch?OperType=12&classId='+CIRequest.classId+"&requestId="+CIRequest.requestId;
    this.getForm=function()
     {
         var oForm=new CIForm(CIRequest);
         oForm.setToolbar({src:"toolBar.html",height:28});                                                     
         return oForm;
     }
}
