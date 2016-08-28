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
         oForm.setToolbar({src:"toolBar.html",height:28});                                                     
         return oForm;
     }
}
