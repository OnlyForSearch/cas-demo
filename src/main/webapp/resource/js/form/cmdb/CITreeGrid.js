var Global = {
	treeGrid      :  undefined,
	searhGrid     :  undefined,
	store         :  undefined,
	urlParam      :  {},
	searchParm    :  undefined,
	myMask        :  undefined,
	ServletUrl    :  "/servlet/CmdbServlet?",
	handler		  :  {},
	config		  :  {}
}

Ext.LoadMask.prototype.msg = "加载数据中,请稍后...";
	
function createTreeGrid(){
	Global.config.instanceId = INSTANCE_ID.value;
	Global.config.systemClassId = getThisCiClassId();
	Global.config.systemName = NAME.value;
	Global.config.destClassId = '138';
	Global.config.relaName = "APPLICATION_SYSTEM_HIERARCHY";
	Global.config.destStatus = "13";
	Global.config.isMultiple = "true";
	Global.config.isSource = "true";
	Global.config.dataSetId = "6";
	Global.config.destDataSetIds = "6";
	Global.config.selectResult = "100002096";
	

	Global.urlParam.INSTANCE_ID = INSTANCE_ID.value;//表单中的INSTANCE_ID
	Global.urlParam.VIEW_TYPE = viewType;			//CIAction.js中的变量
	
    Global.myMask = new Ext.LoadMask(Ext.getBody(), {msg:Ext.LoadMask.prototype.msg});
    Global.myMask.show();
    
    // create the data store		
   	var record = Ext.data.Record.create([
   		{name: 'RELE_INSTANCE_ID',type:'string'},
   		{name: 'INSTANCE_ID',type:'string'},
   		{name: 'CLASS_ID',type:'string'},
   		{name: 'REQUEST_ID',type:'string'},
     	{name: 'DATASET_ID',type:'string'},
     	{name: 'SHORT_DESCRIPTION',type:'string'},
     	
     	{name: '_id', type: 'string'},
     	{name: '_parent', type: 'string'},     	
     	{name: '_level', type: 'int'},
     	{name: '_is_leaf', type: 'bool'}
   	]);
    
    var sendUrl = Global.ServletUrl + 'tag=31&INSTANCE_ID=' + 
		Global.urlParam.INSTANCE_ID + "&VIEW_TYPE="+Global.urlParam.VIEW_TYPE;
    Global.store = new Ext.ux.maximgb.tg.AdjacencyListStore({
    	autoLoad : true,
    	reader: new Ext.data.JsonReader({id: '_id'}, record),
    	proxy: new Ext.data.HttpProxy({url:sendUrl,timeout:300000})
    });
    
    Global.treeGrid = new Ext.ux.maximgb.tg.GridPanel({
	  renderTo : 'ci_application_module',
      store: Global.store,
	  width : '100%',
	  height : 250,
	  collapsible		: true,
	  collapsed		: false,
	  isAllowOnlyRead : false,
	  titleCollapse	: true,
      master_column_id : 'SHORT_DESCRIPTION',
      columns: [
      	{header: "RELE_INSTANCE_ID", dataIndex: 'RELE_INSTANCE_ID', hidden:true},
      	{header: "INSTANCE_ID", dataIndex: 'INSTANCE_ID', hidden:true},
      	{header: "CLASS_ID", dataIndex: 'CLASS_ID', hidden:true},
      	{header: "REQUEST_ID", dataIndex: 'REQUEST_ID', hidden:true},
      	{header: "DATASET_ID", dataIndex: 'DATASET_ID', hidden:true},
      	
		{id:"SHORT_DESCRIPTION",header: "模块名称", width: 250, dataIndex: 'SHORT_DESCRIPTION'}
      ],
      sm:new Ext.grid.RowSelectionModel({
					singleSelect : false
				}),      
      stripeRows: true,
      autoExpandColumn: 'SHORT_DESCRIPTION',
      title: '系统模块',
      tbar:[{
         text:'新增',
         tooltip:'新增',
         iconCls:'x-btn-text',
         icon :'/resource/image/ico/add.gif',
         id: 'templateUseSearch',
         handler:Global.handler.addConfigItem
         
      },{
         text:'修改',
         tooltip:'修改',
         iconCls:'x-btn-text',
         icon :'/resource/image/ico/edit.gif',
         handler:Global.handler.modifyConfigItem
      },{
         text:'删除CI',
         tooltip:'删除',
         iconCls:'x-btn-text',
         icon :'/resource/image/ico/del3.gif',
         handler:Global.handler.CIDelete
      },{
         text:'配置权限',
         tooltip:'配置权限',
         iconCls:'x-btn-text',
         icon :'/resource/image/ico/grant.png',
         id:'setPrivilege',
         disabled:false,
         handler:Global.handler.ciGrant
      },'-',{
                text : '刷新',
                iconCls : 'x-btn-text',
                icon : '/resource/image/ico/refresh.gif',
                handler : function() {
                        Global.store.reload();
                    }
            }],
	  config : Global.config,
	  search : function (){
	  	Global.store.reload();
	  }
      /*
      root_title: 'Companies', 
      plugins: expander,     
      viewConfig : {
      	enableRowBody : true
      },
      */
    });
    
    Global.treeGrid.on("rowdblclick",function(grid,rowIndex,EventObject){
    	var data = grid.getStore().getAt(rowIndex).data;
    	if(data.INSTANCE_ID){
    		CIModifyDbClick(grid);
    	}
    });
    //初始化操作
    Global.store.on("load",function(store,records,obj){
    	/*var selectModel = Global.treeGrid.getSelectionModel();
    	var selectArr = [];
    	for(var i=0;i<records.length;i++){
    		var data = records[i].data;    		
    		if(data._parent == ""){  	
    			if(Global.urlParam.historyCount > 1 && data.isclash == '<span class="noClash">无冲突</span>'){
    				selectArr.push(i);
    			}
    		}
    	}    	
    	selectModel.selectRows(selectArr);*/
    	Global.myMask.hide();
    });
    Global.store.on("exception",function(proxy,type,action){
    	Global.myMask.hide();	    	    	
    	Ext.Msg.alert("系统提示","获取数据出错 "+type +":" + action);
    });
    if($getSysVar('IS_PRIVATE_CFG') == '0'){//屏蔽权限配置按钮
    	document.getElementById("setPrivilege").disabled = true;
    }
    //grid.getSelectionModel().selectFirstRow();
}

function isSelected(){
	var rows = Global.treeGrid.getSelectionModel().getSelections();
	if(rows.length==0){
		MMsg("请选择一项！");
		return false;
	}else{
		if(!rows[0].get("INSTANCE_ID")){
			MMsg("当前选择项不能执行此操作！");
			return false;
		}else{
			return true;
		}
	}
}
Global.handler.addConfigItem = function(){
	addConfigItem(Global.treeGrid);
}
Global.handler.modifyConfigItem = function(){
	if(isSelected())
		modifyConfigItem(Global.treeGrid);
}
Global.handler.CIDelete = function(){
	if(isSelected()){
		Ext.MessageBox.show({
		     msg	:	"<div style='padding:10px;'>是否同时删除下层节点？<div>",
		     buttons:	{yes:'是',no:'否',cancel:'取消'},
		     fn 	:	function(e) {
							if (e == "yes") {
								cascadeDeleteModule(Global.treeGrid);
							}else if(e == "no"){
								CIDelete(Global.treeGrid);
							}
						},
		     width	:	250,
		     icon	:	Ext.MessageBox.QUESTION
		});
	}
}
Global.handler.ciGrant = function(){
	if(isSelected())
		ciGrant(Global.treeGrid);
}
//Ext.onReady(Controller.init);

