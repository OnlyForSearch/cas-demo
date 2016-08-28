var ipGrid;
function createIpGrid(config) {
	var HOSTEDIP = 'HOSTED_IP';
	var FLOATIP = 'FLOAT_IP';
	var MONITORIP = 'MONITOR_IP';
	var IPMIIP = 'IPMI_IP';
	var IP_TYPE_DS = new Ext.data.SimpleStore({ // 填充的数据
		fields : ['text', 'value'],
		data : config.occasion=="asset"?[['采集IP', MONITORIP],['物理IP', HOSTEDIP], ['浮动IP', FLOATIP],['IPMI_IP', IPMIIP]]:[['采集IP', MONITORIP], ['物理IP', HOSTEDIP], ['浮动IP', FLOATIP],['IPMI_IP', IPMIIP]]
	});
	Ext.grid.PageRowNumberer = Ext.extend(Ext.grid.RowNumberer, {
				width : 24,
				renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
					if (store.lastOptions.params != null) {
						var pageindex = store.lastOptions.params.start;
						return pageindex + rowIndex + 1;
					} else {
						return rowIndex + 1;
					}
				}
			});
	var comboBox = new Ext.form.ComboBox({
						id : 'IpTypeCmb',
						hiddenName : '',
						editable : false,
						typeAhead : true,
						triggerAction : 'all',
						mode : "local",
						store : IP_TYPE_DS,
						valueField : 'value',
						displayField : 'text',
						lazyRender : true,
						listClass : 'x-combo-list-small',
						listeners : {
							"beforeselect" : checkMonitorIp
						}
					})
	/*
	 * 保证一个主机只选一个采集IP
	 */
	function checkMonitorIp(combo,option,index){
		if(!ipGrid.isValidateIp)
			return true;
			
		var ipType = option.data.value;
		var oldIpType = combo.getValue();
		//选择了采集IP 并且 原有的值不是采集IP 
		if(ipType==MONITORIP && oldIpType!=MONITORIP){
			//原来已有采集IP
			for (var i = 0,r; r=store.getAt(i); i++) {
				if(r.get("IP_TYPE")==MONITORIP){
					EMsg("只允许配置一个采集IP！");
					return false;
				}
			}
		}
		var record = ipGrid.getSelectionModel().getSelected();
		if(record) {
			var ipId = record.get('IP_ID');
			if(ipId){
				var sql = "select pkp_cmdb_config.isReSelectIp('"+INSTANCE_ID.value+"','"+getThisCiClassId()+"','"+ipId+"','"+ipType+"') RESULT from dual";
				xmlhttp.Open("POST","/servlet/commonservlet?tag=201&paramValue="+getAESEncode(encodeURIComponent(sql)),false);
				xmlhttp.send();
				var dataXML=xmlhttp.responseXML
				var oRows = dataXML.selectNodes("/root/rowSet");
				if(oRows[0]){
					var isCanSelect=oRows[0].selectSingleNode("RESULT").text;
					if(isCanSelect=='0'){
						if(QMsg("“"+record.get('IP_NAME')+"”不能设置为“"+option.data.text+"”，如果更改类型，需要重新选择IP，是否要更改？",2)==MSG_YES){
							clearIp(record);
							return true;
						}else{
							return false;
						}
					}
				}
			}
		}
		
		if(!checkIp(record,ipType)){
			return false;
		}
		return true;
	}
	
	function checkIp(record,ipType) {
		if(!ipGrid.isValidateIp)
			return true;
		ipType = ipType || record.get("IP_TYPE");
		var index = store.indexOf(record);
		
		for (var i = 0, r; r = store.getAt(i); i++) {
			if (index != i) {
				var ipType_i = r.get("IP_TYPE");

				if (ipType == MONITORIP) {
					if (index != i && ipType_i == MONITORIP) {
						EMsg("只允许配置一个采集IP！");
						return false;
					}
				}
				if (r.get("IP_ID") == record.get("IP_ID")) {
					if (ipType == FLOATIP) {
						if (ipType_i == FLOATIP) {
							EMsg("重复的浮动IP！"); return false;
						} else if (ipType_i == MONITORIP) {
							EMsg("“" + r.get('IP_NAME') + "”不能同时设置成浮动IP与监控IP！");
							return false;
						} else if (ipType_i == HOSTEDIP) {
							EMsg("“" + r.get('IP_NAME') + "”不能同时设置成浮动IP与物理IP！");
							return false;
						}
					} else if (ipType == HOSTEDIP) {
						if (ipType_i == HOSTEDIP) {
							EMsg("重复的物理IP！"); return false;
						} else if (ipType_i == FLOATIP) {
							EMsg("“" + r.get('IP_NAME') + "”不能同时设置成浮动IP与物理IP！");
							return false;
						}
					}
				}
			}
		}
		return true;
	}
	// 列模型
	var cm = new Ext.grid.ColumnModel({columns:[new Ext.grid.PageRowNumberer(), {
		id : 'IP_TYPE',
		header : "IP类型",
		dataIndex : 'IP_TYPE',
		width : 100,
		editor : comboBox,
		renderer : function(value, cellmeta, record) {
			var displayText = value;
			var index = IP_TYPE_DS.find(Ext.getCmp('IpTypeCmb').valueField, value);
			var option = IP_TYPE_DS.getAt(index);
			if (option != null) {
				displayText = option.data.text;
			}
			return displayText;
		}
	}, {
		header : "关系ID",
		dataIndex : 'RELE_INSTANCE_ID',
		hidden : true
	}, {
		header : "IP实例ID",
		dataIndex : 'IP_ID',
		hidden : true
	}, {
		id : 'IP_NAME',
		header : "CI名称",
		dataIndex : 'IP_NAME',
		width : 300
	}, {
		id : 'IP_ADDR',
		header : "IP地址",
		dataIndex : 'IP_ADDR',
		width : 120
	}, {
		id : 'IPS_NAME',
		header : "IP段",
		dataIndex : 'IPS_NAME',
		width : 200
	}, {
		id : 'IP_PORTNUM',
		header : "端口",
		dataIndex : 'IP_PORTNUM',
		editor: new Ext.form.NumberField({
               allowBlank: false,
               allowDecimals: false,
               allowNegative: false//, maxValue: 100
           }),
		width : 100
	}, {
		header : "操作",
		dataIndex : 'OPER',
		hidden : true
	}

	]
	});
	
	cm.defaultSortable = true;

	// 定义一个用户对象,便于添加记录
	var IP = Ext.data.Record.create([{
				name : 'IP_TYPE'
			}, {
				name : 'RELE_INSTANCE_ID',
				type : 'string'
			}, {
				name : 'IP_ID',
				type : 'string'
			}, {
				name : 'IP_ADDR',
				type : 'string'
			}, {
				name : 'IP_NAME',
				type : 'string'
			}, {
				name : 'IPS_NAME',
				type : 'string'
			}, {
				name : 'IP_PORTNUM',
				type : 'string'
			}, {
				name : 'OPER',
				type : 'string'
			}]);
	var sqlStr = "";
	if(config.SOURCE_CLASS_ID=='136'){	//F5交换机的Pool的IP
		sqlStr = "select pool2ip.instance_id         RELE_INSTANCE_ID,"
    			+ "       ip.instance_id             IP_ID,"
				+ "       ip2.address                IP_ADDR,"
				+ "       ip.short_description       IP_NAME,"
				+ "       pp.communication_end_point IP_PORTNUM "
				+ "from "
				+ " ci_base_relationship pool2ip join ci_base_element ip on pool2ip.destination_instance_id=ip.instance_id " 
				+ " join ci_protocol_endpoint ip2 on ip.instance_id=ip2.instance_id "
				+ " left join ci_pool_port pp on pool2ip.instance_id=pp.instance_id "
				+ "where  pool2ip.markasdeleted=0 and ip.markasdeleted=0 and ip.class_id in (" + config.destClassId + ") "
				+ "		and pool2ip.source_instance_id = " + config.instanceId;
	}else if(config.SOURCE_CLASS_ID=='118'){//主机的IP
		sqlStr = "select host2ip.instance_id    RELE_INSTANCE_ID,"
    			+ "    host2ip.name             IP_TYPE,"
    			+ "    ip.instance_id           IP_ID,"
    			+ "    ip2.address              IP_ADDR,"
    			+ "    ip.short_description     IP_NAME,"
    			+ "    ips.short_description    IPS_NAME"
				+ " from "
				+ " ci_base_relationship host2ip join ci_base_element ip on host2ip.destination_instance_id=ip.instance_id "
				+ " join ci_protocol_endpoint ip2 on ip.instance_id=ip2.instance_id "
				+ " left join ci_base_relationship ip2ips on ip.instance_id=ip2ips.destination_instance_id and ip2ips.class_id=9 and ip2ips.markasdeleted=0 "
				+ " left join ci_base_element ips on ip2ips.source_instance_id=ips.instance_id and ips.class_id=12 and ips.markasdeleted=0 "
				+ " where ip.markasdeleted=0 and host2ip.markasdeleted=0 "
				+ "   and ip.class_id in (" + config.destClassId + ") "
				+ "   and host2ip.source_instance_id = " + config.instanceId;
	}
	var store = new Ext.data.Store({
		url : '/servlet/commonservlet?tag=201&paramValue='+getAESEncode(encodeURIComponent(sqlStr)),
		reader : new Ext.data.XmlReader({
					record : 'rowSet',
					totalRecords : '@total'
				}, IP)
	});
			
	function addRecord(){
		var n = ipGrid.getStore().getCount();
		var ip = new IP({
					IP_TYPE : config.occasion=="asset"? HOSTEDIP: MONITORIP,
					IP_NAME : '0.0.0.0',
					IP_ADDR : '0.0.0.0',
					IPS_NAME : '0.0',
					OPER : 'add',
					IP_PORTNUM : '0'
				});
		ipGrid.stopEditing();
		store.insert(n, ip);
		ipGrid.getSelectionModel().selectLastRow();
		ipGrid.startEditing(n, 1);
	}
	
	function deleteRecord(){
		var row = ipGrid.getSelectionModel().getSelected();
		if(row){
		  	if(QMsg("确认删除与当前CI的关系吗?")==MSG_YES)
		  	{
				if(row.get("RELE_INSTANCE_ID")) {//有已创建的关系的才删除，新增还没保存的，删除就不发送请求
		  			var sendUrl=Url+"tag=19&relaInstanceId="+row.get("RELE_INSTANCE_ID")+"&flowId="+getFlowId();
				    xmlhttp.Open("POST",sendUrl,false);
				    xmlhttp.send();
				    if(isSuccess(xmlhttp))
				    {
				        MMsg("删除CI关系成功！");
				    }
		  		}
				store.remove(row);
			}
		}else
		{
			MMsg("请选择一项！");
			return;
		}
	
	}						
	var toolBar = new Ext.Toolbar({
		items:[{
				text : '新增',
				iconCls : 'x-btn-text',
				icon : '/resource/image/ico/add.gif',
				handler : addRecord
			}, {
				text : '删除关系',
				iconCls : 'x-btn-text',
				icon : '/resource/image/ico/delete.gif',
				handler : deleteRecord 
			},{
				text : '刷新',
				iconCls : 'x-btn-text',
				icon : '/resource/image/ico/refresh.gif',
				handler : function() {
						store.reload();
					}
			}

		]
	});
	
	// 创建编辑器表格
	ipGrid = new Ext.grid.EditorGridPanel({
		SOURCE_CLASS_ID : config.SOURCE_CLASS_ID,//保存的时候使用
		config : config,
		store : store,
		cm : cm,
		renderTo : 'ci_ip',
		width : config.width||'100%',
		height : config.height||180,
		title : config.title,
		collapsible: true,
		collapsed:false,
		titleCollapse : true,
		frame : false,
		clicksToEdit : 1,
		selModel : new Ext.grid.RowSelectionModel({
					singleSelect : false
				}),
		tbar : toolBar,
		isValidateIp : config.SOURCE_CLASS_ID!='118'?false:true,//只有主机的IP才需要做验证
		dataSet : config.occasion=="asset"?assetAddDataSetId:monitorAddDataSetId,
		getIpArrayByType : function(ipType){
			var array = new Array();
			for (var i = 0; i < this.store.getCount(); i++) {
				var record = this.store.getAt(i);
				if(!ipType || record.get("IP_TYPE")==ipType){
					array.push( {IP_TYPE:record.get("IP_TYPE"),INSTANCE_ID:record.get("IP_ID"),SHORT_DESCRIPTION:record.get("IP_NAME"),DATASET_ID:ipGrid.dataSet});
				}
			}
			return array;
		},
		addIP:function(ipType,ipId,ipName,ipAddr,ipsName){
			var n = this.store.getCount();
			var ip = new IP({
			 			IP_ID:ipId,
						IP_TYPE : ipType,
						IP_NAME : ipName,
						IP_ADDR : ipAddr,
						IPS_NAME : ipsName,
						OPER : 'add',
						IP_PORTNUM : 0
					});
			this.stopEditing();
			this.store.insert(n, ip);
			this.getSelectionModel().selectLastRow();
		}
	});
	
	function afterEdit(e) {
		var record = e.record;
		if (record.get("OPER") != "add" && record.get("OPER") != "change")
			record.set("OPER", "edit");
		//alert(record.get("OPER"))
	};
	
	function cellDbClickFn(grid, rowIndex, columnIndex, e) {
		var colModel = grid.colModel;
		var IP_ADDR_columnIndex = colModel.findColumnIndex('IP_ADDR');
		var IP_NAME_columnIndex = colModel.findColumnIndex('IP_NAME');
		var IPS_NAME_columnIndex = colModel.findColumnIndex('IPS_NAME');
		if (columnIndex == IP_ADDR_columnIndex || columnIndex == IP_NAME_columnIndex || columnIndex == IPS_NAME_columnIndex) {
			var record = grid.getStore().getAt(rowIndex);
			var param = getCascadeSelectParam({DEST_CLASS_ID : '12',DATASET_IDS:grid.config.dataSetId,title:'IP段'},{DEST_CLASS_ID : '10',STATUS : config.status,isMultiple:'false',RELANAME:record.get('IP_TYPE'),DATASET_IDS:grid.config.dataSetId,title:'IP地址'},config.title);
			var iWidth = "1000px";
			var iHeight = "500px";
			var objArray = window.showModalDialog("CICascadeSelect.html",
					param, "resizable=yes;dialogWidth=" + iWidth + ";dialogHeight=" + iHeight + ";help=0;scroll=0;status=0;");

			if (objArray) {
				if (objArray.result == 1 && objArray.leftArray.length > 0 && objArray.rightArray.length > 0) {
					record.set("IP_ID", objArray.rightArray[0].INSTANCE_ID);
					record.set("IP_NAME", objArray.rightArray[0].SHORT_DESCRIPTION);
					record.set("IP_ADDR", objArray.rightArray[0].SHORT_DESCRIPTION);
					record.set("IPS_NAME", objArray.leftArray[0].SHORT_DESCRIPTION);
					
					if (record.get("OPER") != "add")
						record.set("OPER", "change");
					
					if(!checkIp(record)){
						clearIp(record);
					}
				}
			}
		}
	}
	function clearIp(record){
		record.set("IP_ID", '');
		record.set("IP_NAME", '0.0.0.0');
		record.set("IP_ADDR", '0.0.0.0');
		record.set("IPS_NAME",'0.0');
		if (record.get("OPER") != "add")
			record.set("OPER", "change");
	}
	//viewType与disabledFlag在CIAction.js中定义
	if(viewType == disabledFlag){
		//只读情况下
		toolBar.setDisabled(true);
		cm.isCellEditable = function(col, row) {
		    return false;
		}
	}else{
		//可编缉情况下
		ipGrid.on("celldblclick",cellDbClickFn,ipGrid);
		ipGrid.on("afteredit", afterEdit, ipGrid);
	}
	
	store.load();
	
	initIpGrid.defer(100,window,[]);
}

function saveIP() {
	if(!ipGrid)
		return "";
	var store = ipGrid.getStore();
	var relastr = "";
	var relaName = '';
	var dynamic_sql = '';
	var staff_id = getCurrentStaffId();
	for (var i = 0; i < store.getCount(); i++) {
		var record = store.getAt(i);
		var oper = record.get("OPER");
		if (oper) {
			if(record.get("IP_ID")){
				//格式为:   源ID：目标ID：数据集：关系名：动态SQL
				if(ipGrid.SOURCE_CLASS_ID == '136'){
					/**
					 * F5交换机的Pool的IP修改处理方法(删除为即时删除)：
					 * 0、新增：正常新增
					 * 1、修改端口：用update更新端口号
					 * 2、修改IP：删除关系，重新插入关系
					 */
					if(!isNaN(record.get("IP_PORTNUM"))){
						if (oper == 'add') {
							relastr += ( INSTANCE_ID.value + ':' + record.get("IP_ID") + ':' + ipGrid.dataSet+':'+ 'DEPENDENCY=-10-');
							relastr += (":begin pkp_cmdb_config.addPool_IP("+INSTANCE_ID.value+","+record.get("IP_ID")+","+record.get("IP_PORTNUM")+"); end; |");
						} else if (oper == 'edit') {
							relastr += (":::");
							relastr += (":begin pkp_cmdb_config.updatePool_Port("+record.get("RELE_INSTANCE_ID")+","+record.get("IP_PORTNUM")+"); end; |");
						} else if ( oper == 'change') {
							relastr += ( INSTANCE_ID.value + ':' + record.get("IP_ID") + ':' + ipGrid.dataSet+':'+ 'DEPENDENCY=-10-');
							relastr += (":begin PKP_CMDB_CONFIG.updatePool_Ip("+record.get("RELE_INSTANCE_ID")+","+staff_id+","+INSTANCE_ID.value+","+record.get("IP_ID")+",'"+record.get("IP_PORTNUM")+"'); end; |") ;
						}
					} else {
						alert("端口号不正确！");
					}
				}else if(ipGrid.SOURCE_CLASS_ID == '118'){
					/**
					 * 主机IP修改的处理方法(删除为即时删除)：
					 * 0、新增：正常新增
					 * 1、无论是更改IP或者是IP类型（即关系类型），都是重新插入一条新的关系，把原来的被更改的关系逻辑删除
					 */
					if (oper == 'add') {
						relastr += ( INSTANCE_ID.value + ':' + record.get("IP_ID") + ':' + ipGrid.dataSet+':'+ record.get("IP_TYPE")+'=-10-');
						relastr += (":null|");
					} else if (oper == 'edit' || oper == 'change') {// 修改的(添加一个关系，再删除一个关系)
						relastr += ( INSTANCE_ID.value + ':' + record.get("IP_ID") + ':' + ipGrid.dataSet+':'+ record.get("IP_TYPE")+'=-10-');
						relastr += (":begin PKP_FORM_RELATION.delCiRelation('"+record.get("RELE_INSTANCE_ID")+"',"+staff_id+",'"+getFlowId()+"'); end; |");
					}
				}
			}
		}
	}
	return relastr;
}

/*IP列表缓存，在页面完全加载完成后，再展示到页面中。*/
var ipGridCacheArray = new Array();
function insertIpGridCacheArray(ipType,ipId,ipName,ipAddr,ipsName){
	ipGridCacheArray.push({"ipType":ipType,"ipId":ipId,"ipName":ipName,"ipAddr":ipAddr,"ipsName":ipsName});
}
function initIpGrid(){
	if(ipGridCacheArray.length>0 && ipGrid){
		for(var i=0;i<ipGridCacheArray.length;i++){
			var r = ipGridCacheArray[i];
			ipGrid.addIP(r.ipType,r.ipId,r.ipName,r.ipAddr,r.ipsName);
		}
	}
}