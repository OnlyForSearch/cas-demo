var Global_={
  noRelationId : undefined,
  mainTableName : undefined,
  requestId : undefined,
  gridSub : null
}

 //����ƴ�ӵĹ���
   //get_value_cfg_id_1 �ѹ���  get_value_cfg_id_2 ��û����
	var createRelation = function(oForm){
	 this.gridSub=null;
	 this.loadGrid = function(oFm,reqId,relationPage,eldiv,get_value_cfg_id_1,get_value_cfg_id_2,mTableName){
	            Global_.noRelationId = get_value_cfg_id_2;
	            Global_.requestId = reqId;
	            Global_.mainTableName = mTableName;
			    var e = document.body;
			    Ext.QuickTips.init();
			    this.gridSub = new Ext.data.ResultGrid({
					result : get_value_cfg_id_1,
					isAddParamTbar : false,// �Ƿ���ʾ��ѯ������
					style : "padding:5 5 5 5",
					iconCls : 'icon-grid',
					width : e.clientWidth-100,
					style:'margin:10,0,10,35',
					height : 204,
					renderTo :eldiv
				});	
			  this.gridSub.tbarFuncMenu.executeRule([this.gridSub.getTopToolbar()]); 
			  this.gridSub.search({REQUEST_ID:reqId});
			  Global_.gridSub = this.gridSub;
			 
	   }
	}

    Ext.ns("bosswg.cust");
    bosswg.cust.SearchWin = function() {
	this.searchGd = new Ext.data.ResultGrid({
		id : "grid",
		result : Global_.noRelationId,
		iconCls : 'icon-grid',
		pageSize:15,
		autoScroll:true,
		resultParam : {
			TBNAME : Global_.mainTableName,
			REQUEST_ID : Global_.requestId
		},
		isAddParamTbar : false,
		listeners : {
			"rowdblclick" : {
				fn : function(grid, rowIndex, e) {
					var data = grid.getStore().getAt(rowIndex).data;
					var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
					window.open('/workshop/form/index.jsp?fullscreen=yes&flowId='
									+ data.FLOW_ID + '&flowMod='
									+ data.FLOW_MOD, null, sFeatures);
				}
			}
		}
	});
	
	bosswg.cust.SearchWin.superclass.constructor.call(this, {
				title : "δ�����б��ѯ",
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
				items : [this.searchGd],
				buttonAlign : 'right',
				buttons : [{
							text : '��������',
							iconCls : 'icon-save',
							handler : this.createRelationsshipFn,
							scope : this
						}, {
							text : '�˳�',
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

Ext.extend(bosswg.cust.SearchWin, Ext.Window, {
			createRelationsshipFn : function() {
				// REQUEST_ID
				var sm = this.searchGd.getSelectionModel();
				var records = sm.getSelections();
				if (records.length < 1) {
					alert('��ѡ��һ����¼�޸�!');
					return false;
				}
				for (var i = 0, n; n = records[i]; i++) {
				     if(!getRelationshipConfig(Global_.mainTableName,n.get('SECOND_TABLE'))){
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
					el.setAttribute('MAIN_REQUEST_ID', Global_.requestId);
					el.setAttribute('SCOND_REQUEST_ID', n.get('REQUEST_ID'));
					el.setAttribute('SCOND_TABLE', n.get('SECOND_TABLE'));
					el.setAttribute('MAIN_TABLE', Global_.mainTableName);
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
						alert('������ϵ�Ѿ�����!');
						this.close();
						Global_.gridSub.search({REQUEST_ID:Global_.requestId});
						if(window.sucessLater){
							sucessLater();
						}

					} else {
						alert('������ϵ����ʧ��!');
					}
				}
			}
		});
		
   
  //����������ϵ
  function createRelationShip(grid){   
     new bosswg.cust.SearchWin();
  }
  
  //ɾ��������ϵ
  function deleteRelationShip(grid){
                var sm = grid.getSelectionModel();
				var records = sm.getSelections();
				if (records.length < 1) {
					alert('��ѡ��һ����¼!');
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
						alert('������ϵ�Ѿ�ɾ��!');
						grid.search();
					} else {
						alert('������ϵɾ��ʧ��!');
					}
				}
  }
  
  //������ϵ�жϣ�0 ֻ�ܴ���һ��������1 ���Դ������������
  function getRelationshipConfig(mainTable,secondTable){
        var table_name_sub;
        var table_name_subcn;
        var corresponding;
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    xmlhttp.Open("POST","/servlet/flowRelationshipAction.do?method=getRelationshipConfig&param="+mainTable,false);
	 	xmlhttp.send();
	 	var drpXML = new ActiveXObject("Microsoft.XMLDOM");
	 	drpXML.load(xmlhttp.responseXML);	
	    var drpRows = drpXML.selectNodes("/root/rowSet");
	    for(r=0;r<drpRows.length;r++){
	        table_name_sub=drpRows[r].selectSingleNode("TABLE_NAME_SUB").text;//�����ӱ���
	        table_name_subcn=drpRows[r].selectSingleNode("TABLE_NAME_CN").text;
	        corresponding=drpRows[r].selectSingleNode("CORRESPONDING").text;
	        if(table_name_sub == secondTable && corresponding=='0'){
	            var temp_grid = Global_.gridSub;
	            for(var i=0;i<temp_grid.getStore().getCount();i++){
	                var temp_second = temp_grid.getStore().getAt(i).get("SECOND_TABLE");
	                if(temp_second ==secondTable){
	                    alert("�����ٴ�����ֻ�ܹ���һ��"+table_name_subcn);
	                    return false;
	                }
	                 
	            }
	        }
	    }
	    return true;
  }
  //��ѯ
  function searchRelation(grid){
     Global_.gridSub.search({REQUEST_ID:Global_.requestId});
  }
  
  //ˢ�� 
  function refresh(){
     Global_.gridSub.search({REQUEST_ID:Global_.requestId});
  }
  
  //�鿴�����ı���ϸ��Ϣ
  function viewInfo(grid){
       var row = grid.getSelectionModel().getSelected();
       if(row){
     	var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
		window.open('/workshop/form/index.jsp?fullscreen=yes&flowId='
												+ row.get("FLOW_ID") + '&flowMod='
												+ row.get("FLOW_MOD"), null, sFeatures);
	  }
  }