/**
 * @author susy 2009-12-13 表单之间关联关系
 */
Ext.ns("bosswg.flow");
bosswg.flow.SearchWin = function(config) {
	this.config = config || {};
	this.searchGd = new Ext.data.ResultGrid({
		id : "grid",
		result : this.config.GET_VALUE_CFG_ID_RELATE,
		iconCls : 'icon-grid',
		pageSize:15,
		autoScroll:true,
		// TBNAME
		resultParam : {
			TBNAME : this.config.TABLE_NAME_MAIN,
			REQUEST_ID : this.config.REQUESTID,
			FLOW_ID : this.config.FLOWID
		},
		isAddParamTbar : true,
		listeners : {
			"rowdblclick" : {
				fn : function(grid, rowIndex, e) {
					var data = grid.getStore().getAt(rowIndex).data;
					var classId = data.CLASSID;
					var requestId = data.REQUEST_ID;
					var dataSetId = data.DATASETID;
					var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
					if(classId){
					    window.open('/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId='+classId
										+'&requestId='+ requestId+"&dataSetId="+dataSetId, null, sFeatures);
						
					}
				    else{
				       window.open('/workshop/form/index.jsp?fullscreen=yes&flowId='
										+ data.FLOW_ID + '&flowMod='
										+ data.FLOW_MOD, null, sFeatures);  	
				    } 
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
				buttons : [{
							text : '创建关联',
							iconCls : 'icon-save',
							handler : this.createRelationsshipFn,
							scope : this
						}, {
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
					el.setAttribute('SOURCE_FLOW_ID', this.config.FLOWID);
					el.setAttribute('SOURCE_TCH_ID', this.config.TCHID);
					el.setAttribute('MAIN_REQUEST_ID', this.config.REQUESTID);
					el.setAttribute('SCOND_REQUEST_ID', n.get('REQUEST_ID'));
					el.setAttribute('DEST_FLOW_ID', n.get('FLOW_ID'));
					el.setAttribute('SCOND_TABLE', this.config.TABLE_NAME_SUB);
					el.setAttribute('MAIN_TABLE', this.config.TABLE_NAME_MAIN);
					createRoot.appendChild(el);
				}
				var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
				sendRequest
						.open(
								"post",
								'/servlet/flowRelationshipAction.do?method=createRelationship',
								false);
				sendRequest.send(sendXml);
				if (sendRequest.readyState == 4 && sendRequest.status == 200) {
					var responseRoot = Ext.util.JSON
							.decode(sendRequest.responseText);
					if (responseRoot.success == true) {
						alert('关联关系已经创建!');
						this.close();
						this.config.stLoader.reload();
						if(window.sucessLater){
							sucessLater();
						}

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
					REQUEST_ID : this.config.REQUESTID,
					FLOW_ID : this.config.FLOWID
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
								var classId = data.CLASSID;
								var requestId = data.SECOND_REQUEST_ID;
								var dataSetId = data.DATASETID;
								var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
								if(classId){
								    window.open('/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId='+classId
													+'&requestId='+ requestId+"&dataSetId="+dataSetId, null, sFeatures);
									
								}
							    else{
							       window.open('/workshop/form/index.jsp?fullscreen=yes&flowId='
													+ data.FLOW_ID + '&flowMod='
													+ data.FLOW_MOD, null, sFeatures);  	
							    }
							}
						}
					},
				width : config.wh,
				height : config.ht
			});

};
Ext.extend(bosswg.flow.RelationshipGrid, Ext.data.ResultGrid, {
			createRelationship : function() {
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
				
			},
			deleteRelationFn : function() {

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
					el.setAttribute('MAIN_REQUEST_ID',d.get('MAIN_REQUEST_ID'));
					el.setAttribute('SECOND_REQUEST_ID', d.get('SECOND_REQUEST_ID'));
					el.setAttribute('SOURCE_FLOW_ID',d.get('SOURCE_FLOW_ID'));
					el.setAttribute('DEST_FLOW_ID',d.get('DEST_FLOW_ID'));
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
			},
			myRefresh : function() {
				this.search();
			}
		});
var args=[]


//tableName 表名
//是否使用realtionPage的长度
//看传的tableName是否存在
//isShowTitle是否显示标题
function loadRelationship(oFm,reqId,relationPage,eldiv,isLoad,tablename,isRelPageWidth,isTableNoExist,isNoShowTitle){
	
	if(oFm.FLOW.TCH_ID!=0){
		var tName=tablename;
		
		if(!tName)
		{
		for(c in oFm.TABLE){
			tName=c;
		}
		}
        if(!isTableNoExist&&!reqId){
           reqId = oFm.TABLE[tName]['REQUEST_ID'].VALUE();
        }	
        var flowId = oFm.FLOW.FLOW_ID;
        var tchId = oFm.FLOW.TCH_ID;
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
		var ewidth ;
		 if(isRelPageWidth)
	        {
	        	ewidth=relationPage.offsetWidth;
	        }
	        else
	        {
	        	ewidth=e.clientWidth-120;
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
	        config.wh=ewidth;
	        config.ht=200;
	        config.REQUESTID=reqId||0;
	        config.FLOWID=flowId;
	        config.TCHID=tchId;
	        var ff=new bosswg.flow.RelationshipGrid(config);  
	        if(isLoad){
	        	args.push(ff)
	        }else{
	        	ff.search();
	        	args.push(ff);
	        }
	  	    if(!isNoShowTitle){
	  	       if(!ff.title){
	  	    	   ff.title='关联【'+config.TABLE_NAME_SUBCN+'】'
	  	       }
	  	    }
	    }
	}	  
}

function loadRelationshipById(oFm,reqId,relationPage,eldiv,isLoad,formTurnId,isRelPageWidth,isTableNoExist,isNoShowTitle){	
	if(oFm.FLOW.TCH_ID!=0){
		var tName;
		for(c in oFm.TABLE){
			tName=c;
		}
        if(!isTableNoExist&&!reqId){
           reqId = oFm.TABLE[tName]['REQUEST_ID'].VALUE();
        }	
		var e = document.body;
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    xmlhttp.Open("POST","/servlet/flowRelationshipAction.do?method=getRelationshipConfigById&param="+formTurnId,false);
	 	xmlhttp.send();
	 	var drpXML = new ActiveXObject("Microsoft.XMLDOM");
	 	drpXML.load(xmlhttp.responseXML);	
	    var drpRows = drpXML.selectNodes("/root/rowSet");
	    if(drpRows.length>0){
	    	relationPage.display="";
		}
		var ewidth ;
		if(isRelPageWidth)
        {
        	ewidth=relationPage.offsetWidth;
        }
        else
        {
        	ewidth=e.clientWidth-120;
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
	        config.wh=ewidth;
	        config.ht=200;
	        config.REQUESTID=reqId||0;
	        var ff=new bosswg.flow.RelationshipGrid(config);  
	        if(isLoad){
	        	args.push(ff)
	        }else{
	        	ff.search();
	        	args.push(ff);
	        }
	  	    if(!isNoShowTitle){
	  	       if(!ff.title){
	  	    	   ff.title='关联【'+config.TABLE_NAME_SUBCN+'】'
	  	       }
	  	    }
	    }
	}	  
}

function refreshRelationship(){
	for(var i=0;i<args.length;i++){
		args[i].search();
	}
}

function iniPage(){
	var formContext = opener.formContext;
	loadRelationship(formContext,'','relationPage','eldiv');
}

function deferLoad(){
	Ext.each(args,function(it){
		  it.search()
	     })
}