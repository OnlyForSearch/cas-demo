var formRelaCmdb = (function(){
	
	var vGrid = null;
	var vFormContext = null;
	var vReqId = "";
	var getData = function(grid,vRequestId){
		var store = grid.getStore();
		var datas = store.data;
		var pRequestIds = "00";
		for(var i=0;i<datas.length;i++){
			var pRequestId = store.getAt(i).data["REQUEST_ID"];
			if(pRequestId!=vRequestId) pRequestIds = pRequestIds + pRequestId + ",";
		}
		return pRequestIds.substring(0,pRequestIds.length);
	};
	
	
	return {
		callbackFn:null,
		open : function(grid){
			var pRequestId = "";
			var store = grid.getStore();
			var datas = store.data;
			for(var i=0;i<datas.length;i++){
				pRequestId = pRequestId + store.getAt(i).data["REQUEST_ID"] + ",";
			}
			var sPara='dialogwidth:1000px;dialogheight:500px;status:no;help:no;resizable:yes;scroll:yes';
			var sHref="/workshop/cmdb/main.html??ishiddle=0&gRequestId="+pRequestId.substring(0,pRequestId.length);
			var oReturnValue = window.showModalDialog(sHref,window,sPara);
			if(oReturnValue) grid.search({REQUEST_ID:oReturnValue});
		},
		
		
		delData : function(grid){
			var row = grid.getSelectionModel().getSelected();
			if(typeof(row)=='undefined'){
			   EMsg("请选择要删除的记录!");
			   return;
			}
			var vRequestId = row.get("REQUEST_ID");
			if(vRequestId==""){
			   EMsg("至少要有一条记录!");
			   return;
			}	
			var pRequestId = getData(grid,vRequestId);
			grid.search({REQUEST_ID:pRequestId});
		},
		
		getSaveData : function(){
			var store = vGrid.getStore();
			var datas = store.data;
			var pRequestIds = "";
			for(var i=0;i<datas.length;i++){
				var pRequestId = store.getAt(i).data["REQUEST_ID"];
				pRequestIds = pRequestIds+pRequestId + ",";
			}
			return pRequestIds;
		},
		getReqId : function (){
			return vReqId;
		},
		showCmdb : function(grid){
			formRelaCmdb.callbackFn = formRelaCmdb.refresh.callback([grid]);
			var row = grid.getSelectionModel().getSelected();
			var gFlowId = vFormContext.FLOW.FLOW_ID;
			if(row){	    
				doWindow_open("/workshop/form/index.jsp?callback=window.opener.formRelaCmdb.callbackFn()&classId="+row.get("CLASSID")+"&requestId="+row.get("REQUEST_ID")+"&flowId="+gFlowId+"&hiddenToolBar=y",undefined,undefined,'_blank');	
			}else
			{
				MMsg("请选择一项！");
				return;
			}
		},
		
		editCmdb : function(grid){
			formRelaCmdb.callbackFn = formRelaCmdb.refresh.callback([grid]);
			var row = grid.getSelectionModel().getSelected();
			var gFlowId = vFormContext.FLOW.FLOW_ID;
			if(row){	    
				doWindow_open("/workshop/form/index.jsp?callback=window.opener.formRelaCmdb.callbackFn()&classId="+row.get("CLASSID")+"&requestId="+row.get("REQUEST_ID")+"&flowId="+gFlowId,undefined,undefined,'_blank');	
			}else
			{
				MMsg("请选择一项！");
				return;
			}
		},
		
		showList : function(oFm,reqId,eldiv,get_value_cfg_id,param){
			 var e = document.body;
			 Ext.QuickTips.init();
			 vFormContext = oFm;
			 vReqId = reqId;
			 vGrid = new Ext.data.ResultGrid({
					result : get_value_cfg_id,
					//resultParam : {M_REQUEST_ID:reqId,M_FLOW_ID:oFm.FLOW.FLOW_ID},
					isAddParamTbar : false,
					iconCls : 'icon-grid',
					width : e.clientWidth-100,
					style:'margin:10,0,10,10',
					autoHeight : true,
					renderTo :eldiv
				});	
			 vGrid.rowcontextmenu="return false";
			 vGrid.tbarFuncMenu.executeRule([vGrid.getTopToolbar()]); 
			 vGrid.search(Ext.apply({M_REQUEST_ID:reqId,FLOW_ID:oFm.FLOW.FLOW_ID},param));
		},
	
		refresh : function(grid)
		{
			var pRequestId = getData(grid,vRequestId);
			grid.search({REQUEST_ID:pRequestId});
		},
		
		hasPri : function(pFlowMod,pTchMod,pStaffId){

			var flowMod = vFormContext.FLOW.FLOW_MOD;
			var tchMod = vFormContext.FLOW.TCH_MOD;
			if((","+pFlowMod+",").indexOf(","+flowMod+",")<=-1){
				return false;
			}
			if(pTchMod&&(","+pTchMod+",").indexOf(","+tchMod+",")<=-1){
				return false;
			}
			return true;
		}
	}
})();
		
		
