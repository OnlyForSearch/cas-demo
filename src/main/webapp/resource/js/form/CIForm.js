function CIForm(CIRequest)
{
   form.call(this,CIRequest);
   this.loadData=function()
   {
       return formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=3&classId='+CIRequest.classId
                                     +"&requestId="+CIRequest.requestId);      
   }
   this.loadRightData=function()
   {
       return null;
   }
}