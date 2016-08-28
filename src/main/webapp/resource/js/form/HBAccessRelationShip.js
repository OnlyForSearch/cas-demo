/**
 * @author linzhzh 2011-09-19 关联CI信息
 */
Ext.ns("bosswg.flow");
var flowId;
bosswg.flow.SearchWin = function(config) {
	this.config = config || {};
	this.searchGd = new Ext.data.ResultGrid({
		id : "grid",
		result : this.config.GET_VALUE_CFG_ID_RELATE,
		iconCls : 'icon-grid',
		pageSize:15,

		buttonAlign : 'top',
		buttons : [{
							text : '新增',
							iconCls : 'icon-add',
							handler : function(){
								var aIdType = document.getElementById('aIdType').value;//账号类型号
								callbackFn = refresh.callback([this.searchGd]);
								var result = isRelationAccessHb(aIdType);
								if(result){
									var strs = result.split(",");//拆分 分类 子类 条目
									doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId=CIM_ACCOUNT&flowId="+flowId+"&CATEGORY="+strs[0]+"&TYPE="+strs[1]+"&ITEM="+strs[2]);		
								}else{
									doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId=CIM_ACCOUNT&flowId="+flowId);	
								}						
							},
							scope : this
						}, {
							text : '删除',
							iconCls : 'icon-del',
							handler : function() {
								var sm = this.searchGd.getSelectionModel();
								var records = sm.getSelections();
								if (records.length < 1) {
									alert('请选择一条记录修改!');
									return false;
								}else{
									var row = this.searchGd.getSelectionModel().getSelected();
									if(row)
									{
								  		if(QMsg("确认删除所选择记录？")==MSG_YES)
								  		{
								  			var sRequestId=row.get("REQUEST_ID");
								  			var formId = row.get("FORM_ID");
								  			var delByClassIdUrl="../../../servlet/formDispatch?OperType=15&classId=CIM_ACCOUNT&requestId="+sRequestId;								
										    xmlhttp.Open("POST",delByClassIdUrl,false);
										    xmlhttp.send();
										    if(isSuccess(xmlhttp))
										    {
										        MMsg("删除成功！");
										        this.searchGd.search();
										    } 
								  		}
									}else
									{
										MMsg("请选择一项！");
										return;
									}
								}
							},
							scope : this
						}, {
							text : '修改',
							iconCls : 'icon-exit',
							handler : function() {
									if(!this.searchGd || (typeof this.searchGd.getSelectionModel != 'function'))
									{
										this.searchGd = this;
									}
									callbackFn = refresh.callback([this.searchGd]);
									var row = this.searchGd.getSelectionModel().getSelected();
									if(row)
										doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId=CIM_ACCOUNT&flowId="+flowId+"&requestId="+row.get("REQUEST_ID"),undefined,undefined,'_blank');
									else
									{
										MMsg("请选择一项！");
										return;
									}
							},
							scope : this
						}],
		
		autoScroll:true,
		// TBNAME
		resultParam : {
			TBNAME : this.config.TABLE_NAME_MAIN,
			REQUEST_ID : this.config.REQUESTID
		},
		isAddParamTbar : true,		
		listeners : {
			"rowdblclick" : {
				fn : function(grid, rowIndex, e) {
					var data = grid.getStore().getAt(rowIndex).data;
					var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
					window.open('/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId=CIM_ACCOUNT&flowId='+flowId+'&requestId='
								+ data.REQUEST_ID, null, sFeatures);
				}
			}
		}
	});
	
	bosswg.flow.SearchWin.superclass.constructor.call(this, {
				title : "关联【" + this.config.TABLE_NAME_SUBCN + "】查询",
				layout : 'fit',
				collapsible : false,
				closable : true,
				closeAction : 'close',
				iconCls : 'icon-grid ',
				modal : true,
				draggable : true,
				layout : 'fit',
				resizable : false,
				y : document.body.clientHeight+document.body.scrollTop-380-150,
				width : 900,
				height : 380,
				// constrain : true,
				items : [this.searchGd],
				buttonAlign : 'right',
				buttons : [
						{
							text : '创建关联',
							iconCls : 'icon-save',
							handler : this.createRelationsshipFn,
							scope : this
						},{
							text : '退出',
							iconCls : 'icon-exit',
							handler : function() {
								this.close()
							},
							scope : this
						}]
			});
	this.show();
	this.searchGd.search();
}
Ext.extend(bosswg.flow.SearchWin, Ext.Window, {
			createRelationsshipFn : function() {
				// REQUEST_ID
				var sm = this.searchGd.getSelectionModel();
				var records = sm.getSelections();
				if (records.length < 1) {
					alert('请选择一条记录修改!');
					return false;
				}
				if (this.config.TABLE_NAME_SUBCN == "0") {
					if (records.length > 1) {
						alert('只能选择一个!' + this.config.TABLE_NAME_SUBCN);
						return false;
					}
				}

				var sendXml = new ActiveXObject("Microsoft.XMLDOM");
				var root = sendXml.createElement("root");
				sendXml.appendChild(root);
				var createRoot = sendXml.createElement("create");
				root.appendChild(createRoot);
				for (var i = 0, n; n = records[i]; i++) {
					el = sendXml.createElement("model");
					el.setAttribute('MAIN_REQUEST_ID', this.config.REQUESTID);
					el.setAttribute('SCOND_REQUEST_ID', n.get('REQUEST_ID'));
					el.setAttribute('SCOND_TABLE', this.config.TABLE_NAME_SUB);
					el.setAttribute('MAIN_TABLE', this.config.TABLE_NAME_MAIN);
					createRoot.appendChild(el);
				}
				var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
				sendRequest.open("post",'/servlet/flowRelationshipAction.do?method=createRelationship',false);
				sendRequest.send(sendXml);
				if (sendRequest.readyState == 4 && sendRequest.status == 200) {
					var responseRoot = Ext.util.JSON.decode(sendRequest.responseText);
					if (responseRoot.success == true) {
						alert('关联关系已经创建!');
						this.close();
						this.config.stLoader.reload();
						//if(sucessLater){
							//sucessLater();
						//}
					} else {
						alert('关联关系已经创建失败!');
					}
				}
				// records[0].data.MEDIA_ID;
			}
		})
bosswg.flow.RelationshipGrid = function(config) {
	this.config = config || {};
	bosswg.flow.RelationshipGrid.superclass.constructor.call(this, {
				title : '关联【'+config.TABLE_NAME_SUBCN+'】',
				id : Math.random(10000000000000) + "grid",
				result : config.GET_VALUE_CFG_ID,
				//autoScroll:true,
				style:'margin:10,0,30,35',
				pageSize:10,
				renderTo : config.elDiv,
				resultParam : {
					REQUEST_ID : this.config.REQUESTID
				},
				// style : "padding:5 5 5 5",
				iconCls : 'icon-grid',
				tbar : [{
							text : '创建关联',
							iconCls : 'icon-add',
							handler : this.createRelationship,
							scope : this
						}, '-', {
							text : '删除',
							iconCls:'icon-del',
							handler : this.deleteRelationFn,
							scope : this
						}, '-', {
							text : '刷新',
							iconCls:'icon-refresh',
							handler : this.myRefresh,
							scope : this
						}],
						listeners : {
						"rowdblclick" : {
							fn : function(grid, rowIndex, e) {
								var data = grid.getStore().getAt(rowIndex).data;
								var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
								window.open('/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId=CIM_ACCOUNT&flowId='+flowId+'&requestId='
											+ data.REQUEST_ID, null, sFeatures);
							}
						}
					},
				width : config.wh,
				height : config.ht
			});
};
Ext.extend(bosswg.flow.RelationshipGrid, Ext.data.ResultGrid, {
			createRelationship : function() {
				if(this.config.flowState == "F"){
						Ext.MessageBox.alert('系统提示','流程已结束，不能创建关联！');
				}else{
						if (this.config.CORRESPONDING == "0") {
							if (this.store.getCount() > 0) {
								alert('不能再创建，只能关联一个' + this.config.TABLE_NAME_SUBCN);
							} else {
								this.config.stLoader = this.store;
								new bosswg.flow.SearchWin(this.config);
							}
						} else {
							this.config.stLoader = this.store;
							new bosswg.flow.SearchWin(this.config);
						}
				}
			},
			deleteRelationFn : function() {
				if(this.config.flowState == "F"){
						Ext.MessageBox.alert('系统提示','流程已结束，不能删除关联！');
				}else{
					var sm = this.getSelectionModel();
					var records = sm.getSelections();
					if (records.length < 1) {
						alert('请选择一条记录修改!');
						return false;
					}
					var sendDelXml = new ActiveXObject("Microsoft.XMLDOM");
					var root = sendDelXml.createElement("root");
					sendDelXml.appendChild(root);
					var delRoot = sendDelXml.createElement("del");
					root.appendChild(delRoot);
					for (var p = 0, d; d = records[p]; p++) {
						el = sendDelXml.createElement("model");
						
						el.setAttribute('MAIN_REQUEST_ID', this.config.REQUESTID);
						el.setAttribute('SECOND_REQUEST_ID', d.get('REQUEST_ID'));
						
						delRoot.appendChild(el);
					}
					var sendDelRequest = new ActiveXObject("Microsoft.XMLHTTP");
					sendDelRequest
							.open(
									"post",
									'/servlet/flowRelationshipAction.do?method=deleteRelationship',
									false);
					sendDelRequest.send(sendDelXml);
					if (sendDelRequest.readyState == 4 && sendDelRequest.status == 200) {
						var delText = Ext.util.JSON
								.decode(sendDelRequest.responseText);
						if (delText.success == true) {
							alert('关联关系已经删除!');
							this.search();
						} else {
							alert('关联关系删除失败!');
						}
					}
				}
			},
			myRefresh : function() {
				this.search();
			}
		});
		
var args=[]
function loadCIRelationship(oFm,reqId,relationPage,eldiv,isLoad){	
	if(oFm.FLOW.TCH_ID!=0){
		var tName="";
		for(c in oFm.TABLE){
			tName=c;
		}
		var e = document.body;		
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    xmlhttp.Open("POST","/servlet/flowRelationshipAction.do?method=getRelationshipConfig&param="+tName,false);
	 	xmlhttp.send();
	 	var drpXML = new ActiveXObject("Microsoft.XMLDOM");
	 	drpXML.load(xmlhttp.responseXML);	
	    var drpRows = drpXML.selectNodes("/root/rowSet");
	    if(drpRows.length>0){
	    	relationPage.display="";
		}
	    for(r=0;r<drpRows.length;r++){
	        var config={};
	        config.TABLE_NAME_MAIN=drpRows[r].selectSingleNode("TABLE_NAME_MAIN").text;//关联主表名
	        config.TABLE_NAME_SUB=drpRows[r].selectSingleNode("TABLE_NAME_SUB").text;//关联从表名
	        config.TABLE_NAME_SUBCN=drpRows[r].selectSingleNode("TABLE_NAME_CN").text;
	        config.GET_VALUE_CFG_ID=drpRows[r].selectSingleNode("GET_VALUE_CFG_ID").text;
	        config.GET_VALUE_CFG_ID_RELATE=drpRows[r].selectSingleNode("GET_VALUE_CFG_ID_RELATE").text;
	        config.CORRESPONDING=drpRows[r].selectSingleNode("CORRESPONDING").text;
	        config.elDiv=eldiv;
	        config.wh=e.clientWidth-150;
	        config.ht=200;
	        config.REQUESTID=reqId||0;
	        flowId = oFm.FLOW.FLOW_ID;
	        config.flowState = oFm.FLOW.FLOW_STATUS;//流程执行状态 F:执行结束
	       
	        var ff=new bosswg.flow.RelationshipGrid(config);  
	        ff.search();
	        if(isLoad){
	        	args.push(ff)
	        }else{
	        	ff.search();
	        }
	  	    
	  	    if(!ff.title){
	  	    	   ff.title='关联【'+config.TABLE_NAME_SUBCN+'】'
	  	        }
	        }
		}	  
}

function deferLoad(){
	Ext.each(args,function(it){
		  it.search()
	     })
}

//CMDB与接入流账号类型关联
function isRelationAccessHb(idTypeId)
{
	if(idTypeId != '' && idTypeId != null)
	{
		xmlhttp.Open("POST",Url+"tag=11&idTypeId="+idTypeId,false);
		xmlhttp.send();
		var result = xmlhttp.responseText;	
		return result;	
	}else 
		return false;
}