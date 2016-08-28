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
}