function flowApp()
{
     formApp.call(this);
     var flowRequest=(function ()
     {
          var getInfoByFlowId=function(flowId,flowMod)
		  {
			    var flowInfo = {};
			    var xmlDoc=formApp.syncAjaxRequest('../../servlet/flowOper?OperType=8&flowId='
			                                     +flowId+'&flowMod='+flowMod);
				var tchId=xmlDoc.selectSingleNode("/root/rowSet/TCH_ID").text;
				var flowMod=xmlDoc.selectSingleNode("/root/rowSet/FLOW_MOD").text;
				flowInfo["tchId"]=tchId;
				flowInfo["flowMod"]=flowMod;			
				return flowInfo;
		  };
          var iFlowMod=$request("flowMod")||0;
          var iTchId=$request("tchId")||0;
          var iFlowId=$request("flowId")||0;
          var from=$request("from");
          if(iFlowId!=0)
          {
               var flowInfo=getInfoByFlowId(iFlowId,iFlowMod);        
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
               throw(new Error(-1,"获取流程表单的上下文失败！"));
           }
           return {appName:"FLOW",xmlDoc:xmlDoc};
      })();
    this.formUrl='../../servlet/formDispatch?OperType=12&flowMod='
                      +flowRequest.flowMod+"&tchId="+flowRequest.tchId+'&flowId='+flowRequest.flowId;
    this.getForm=function()
    {
         var oForm=new flowForm(flowRequest);        
         oForm.setToolbar({src:"toolBar.html?tchId="+flowRequest.tchId,height:28});
         return oForm;
    };    
}
