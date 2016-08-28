	Ext.namespace("company.assetModel");
	Ext.BLANK_IMAGE_URL = '../../resource/js/ext-2.0.2/resources/images/default/s.gif';
	var anyObj={};
	var itemText ;
	var itemValue ;
	var comboBox ;
	var tree ;
	window.onbeforeunload = isClose;
	function isClose() 
		{
			if (!anyObj.editorGrid.isNull() || anyObj.editorGrid.isEdit()) {
				return '���ݻ�δ����';
				
			}
		}
	Ext.onReady(function () 
	{
		Ext.QuickTips.init();
	    var arguments = window.dialogArguments;
	    var comid=arguments[0];
	    var comName=arguments[1];
	    itemText = arguments[2];//cmdb�ʲ��е�����selectѡ�е�text��
	    itemValue = arguments[3];//cmdb�ʲ��е�����select��value��
		var atWin = Ext.getCmp(comid+ 'company');
		var flag = (typeof atWin == "undefined") ? true : false;
		if (!flag) {
			return false;
		}
		comboBox = new Ext.form.ComboBox({
			id : 'categoryCmb',
			hiddenName : '',
			editable : false,
			typeAhead : true,
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.SimpleStore({fields:[],data:[[]]}),
			valueField : 'value',
			displayField : 'text',
			listClass : 'x-combo-list-small',
			tpl:new Ext.Template('<tpl for="."><div style="height:250px"><div id="category_tree"></div></div></tpl>'),
    		onSelect:Ext.emptyFn   
		})
		tree = new Ext.tree.TreePanel({
			rootVisible: false,
			lines : false,
			border : false,
			autoScroll : true,
			animCollapse : false,
			animate : false,
			iconCls : 'icon-accordian',
			singleExpand :true,
			root : new Ext.tree.XmlTreeNode({
						dataUrl : '../../../servlet/cmdbCtrl.do?method=getCimCategoryTree'
					}),
			listeners : {
				'click' : {
					fn : treeNodeClick
				}
			}
		})
		
		function treeNodeClick(node) {
			if(node.leaf){
				comboBox.setValue(node.id);
		        comboBox.collapse();
			}
		}
		
		comboBox.on('expand',function(){   
			tree.render('category_tree');   
			//tree.expandAll();  
		});
		anyObj.editorGrid = new company.assetModel.editorGrid(comid);
		var winShow = new Ext.Window({
					id :  comid+'company',
					title :  comName+"&nbsp;�ʲ��ͺ�",
					//y : 20,
					height : 400,
					//modal:true,
					closable:false,
					resizable : false,
					draggable:false,
					autoScroll : true,
					width : 630,
					items : [anyObj.editorGrid]
				});
		winShow.show();
	})
	company.assetModel.editorGrid = function(config) 
	{
		this.config = config;
		AssetMod = Ext.data.Record.create([{
					name : 'MODELID',
					type : 'string'
				}, {
					name : 'MODEL',
					type : 'string'
				},{
					name : 'CATEGORY_ID',
					type : 'string'
				},{
					name : 'CATEGORY_NAME',
					type : 'string'
				},{
					name : 'CODE',
					type : 'int'
				}, {
					name : 'SORTID',
					type : 'int'
				}]);
		this.dstore = new Ext.data.Store({
					pruneModifiedRecords : true,
					id : 'hds',
					proxy : new Ext.data.HttpProxy({
								url : '../../servlet/companyservlet?tag=8&companyid='
										+ this.config
							}),
					reader : new Ext.data.JsonReader({
								root : 'rows'
	
							}, AssetMod),
					remoteSort : true
	
				});
	
		this.dstore.load({
					params : {
						start : 0,
						limit : 5
					}
				});
		this.colModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
		        {
					header : '�ͺ�',
					dataIndex : 'MODEL',
					menuDisabled : true,
					width : 220,
					editor : new Ext.form.TextField({
								allowBlank : false,
								blankText : '�ͺŲ���Ϊ��'
							})
				}, {
					header : "����ID",
					dataIndex : 'CATEGORY_ID',
					hidden:true
				}, {
					header : "�豸����",
					dataIndex : 'CATEGORY_NAME',
					width : 200,
					editor : comboBox
				},{
					header : '����',
					dataIndex : 'CODE',
					menuDisabled : true,
					width : 80,
					editor : new Ext.form.NumberField({
			              allowDecimals: false,
			              allowNegative: false
					})
	
				}, 
				{
					header : '����',
					dataIndex : 'SORTID',
					menuDisabled : true,
					width : 70,
					editor : new Ext.form.NumberField({
								allowBlank : false,
								blankText : '��Ų���Ϊ��'
							})
	
				}
	
		]);
	
		company.assetModel.editorGrid.superclass.constructor.call(this, 
		 {
					id : 'grid' + this.config,
					//margins : '5',
					width : 605,
					height : 300,
					cm : this.colModel,
					autoHeight : true,
					selModel : new Ext.grid.RowSelectionModel({
								singleSelect : false
							}),
					sm : new Ext.grid.RowSelectionModel({
								singleSelect : true,
								listeners :
								 {
									rowselect : this.rowselec,
									scope : this
								 }
							}),
					listeners : {
						afteredit : {
							fn : function(e)
							{
								var items = this.topToolbar.items;
								items.item("btn_undo").setDisabled(false);
								if (!this.isNull()) {
									items.item("btn_save").setDisabled(true);
								} else {
									items.item("btn_save").setDisabled(false);
								}
								
								var record = e.record;
								var category_id = record.get("CATEGORY_NAME");
								var node = tree.getNodeById(category_id);
								if(node){
									record.set("CATEGORY_ID",node.id);
									record.set("CATEGORY_NAME",node.text);
								}
	
							},
							scope : this
	
						}
					},
	
					store : this.dstore,
					clicksToEdit : 1,
					deleteRows : [],
					loadMask : {
						msg : '����������...'
					},
					tbar : [{
								text : '����',
								margins : '0,0,5,0',
								handler : this.addRow,
								iconCls : 'icon-add',
								scope : this
								//pressed : true
							}, '&nbsp;&nbsp;', 
							{
								text : 'ɾ��',
								margins : '0,0,5,0',
								handler : this.delRow,
								iconCls : 'icon-del',
								disabled : true,
								id : 'btn_del',
								scope : this
								//pressed : true
							}, '&nbsp;&nbsp;',
							{
								text : '��ԭ',
								id : 'btn_undo',
								margins : '0,0,5,0',
								iconCls : 'icon-undo',
								//pressed : true,
								disabled : true,
								handler : this.refresh,
								scope : this
							}, '&nbsp;&nbsp;',
							{
								text : '����',
								margins : '0,0,5,0',
								handler : this.saveModel,
								disabled : true,
								iconCls : 'icon-save ',
								id : 'btn_save',
								scope : this
								//pressed : true
							}]
				});
	}
	
	Ext.extend(company.assetModel.editorGrid, Ext.grid.EditorGridPanel, 
	 {
		findSelf : function(o)
		 {
			return o == this;
		 },
		FilterModelFn : function(o)
		 {
			return (o.get("MODEL") == this.get("MODEL") && o != this);
		 },
		FilterCodeFn : function(o)
		 {
			return (o.get("CODE") == this.get("CODE") && o != this);
		 },
		refresh : function() 
		 {
			this.dstore.load(this.dstore.lastOptions);
			this.deleteRows = [];
			this.setSendState(false);
		 },
		rowselec : function(sm, row, rec) 
		 {
			var items = this.topToolbar.items;
			items.item("btn_del").setDisabled(false);
	
		 },
		setRecordEdit : function setRecordEdit(r, col)
		 {
			this.startEditing(this.dstore.findBy(this.findSelf, r), col);
		 },
		saveModel : function()
	   	 {
			if (this.isEdit()) {
				for (var i = this.dstore.getCount()-1; i >=0; i--) {
					var r = this.dstore.getAt(i);
					if (!this.validateValue(r))
					 {
						return false;
					 }
			   	}
			   	
			   	if(!this.validateCode()){
			   		return false;
			   	}
			   	
				var sendXml = this.sendXml();
				if (sendXml) 
				 {
					var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
					sendRequest.open("post",
							'../../servlet/companyservlet?tag=9&companyid='
									+ this.config, false);
					sendRequest.send(sendXml);
					if (sendRequest.readyState == 4 && sendRequest.status == 200) 
					 {
						var responseRoot = Ext.util.JSON
								.decode(sendRequest.responseText);
						if (responseRoot.success == true) 
						 {
							this.refresh();
							MMsg('���ݱ���ɹ�!');
						 } else {
							EMsg('���ݱ���ʧ��!');
						}
					 }
				}
			}
		},
		sendXml : function()
		{
			var sendXml = new ActiveXObject("Microsoft.XMLDOM");
			var root = sendXml.createElement("root");
			sendXml.appendChild(root);
			var addRoot = sendXml.createElement("add");
			var editRoot = sendXml.createElement("edit");
			var delRoot = sendXml.createElement("del");
			root.appendChild(addRoot);
			root.appendChild(editRoot);
			root.appendChild(delRoot);
			var record = this.store.getModifiedRecords();
			for (var i = 0, r, el, p; r = record[i]; i++)
			 {
	
				if (r.del != true)
				 {
	
					el = sendXml.createElement("model");
					p = (r.isAdd === true) ? addRoot : editRoot;
					for (var c in r.data) {
							el.setAttribute(c, r.data[c]);
					}
					p.appendChild(el);
	
				}
			 }
			for (var i = 0, r, el; r = this.deleteRows[i]; i++) 
			 {
				el = sendXml.createElement("model");
				el.text = r.get("MODELID");
				delRoot.appendChild(el);
			 }
			return sendXml;
		},
		validateCode : function()
		{	/*
			*	�ж�Code�Ƿ������е�Code�ظ��� --add by syj 20110918
			*	��validateValue���Ѿ��жϹ���ǰҳ���еķǿ�Code���о����޸ĵģ����ظ����൱�ڱ�����ⲿ�ֵ�Code�Ѿ����ظ��ˣ�
			*	�����ڷ������󵽷�����жϵ�ʱ���ⲿ�ֱ��޸���ɾ���ļ�¼��Ҫ���˵�����������˵�������������ִ�����жϣ�
			*	1��ҳ���CODE�Ѿ����ĵ������ǿ��л���δ���ĵģ����ܻ��ظ��������Ǵ�ġ�
			*	2��ҳ���е�CODE�Ѿ�ɾ���������ǿ��л�δɾ��Ҳ�п��ܻ��ظ�����Ҳ�Ǵ�ġ�
			*/
			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			var codes = "";
			var modelIds = "";
			var records = this.store.getModifiedRecords();//�õ��ļ�¼������ɾ����
			for (var i = 0,r; r = records[i]; i++) {
				if (!r.del) {
					var code = r.data["CODE"]
					if(code != "")
						codes += code + ",";
				}
				//�ռ����޸ģ���������������MODEL��ID
				if(!r.isAdd){
					modelIds += r.data["MODELID"] + ",";
				}
			}
			//�ռ���ɾ����MODEL��ID
			for (var i = 0,r; r = this.deleteRows[i]; i++) {
				modelIds += r.data["MODELID"] + ",";
			}
			if(codes != "")
				codes = codes.substring(0,codes.length-1);
			if(modelIds != "")
				modelIds = modelIds.substring(0,modelIds.length-1);
			
			if(codes != ""){
				var sql = "select distinct t.code,t.category_id from asset_model t where t.code in ("+codes+") and t.markasdeleted='0BF' ";
				if(modelIds != "")
					sql += " and t.asset_model_id not in ("+modelIds+")";
				xmlhttp.Open("POST","/servlet/commonservlet?tag=201&paramValue="+getAESEncode(encodeURIComponent(sql)),false);
				xmlhttp.send();
				var dataXML=xmlhttp.responseXML
				var oRows = dataXML.selectNodes("/root/rowSet");
				if(oRows.length > 0){
					var repeatCodes = new Array();
					for(var j=0,row;row=oRows[j];j++){
						for (var i = 0,r; r = records[i]; i++) {
							//�����жϲ�ͬ����֮�䣬��������벻��ͬʱ�ظ�������validateValue���ж�ͬ�����̵ı��벻���ظ�
							if (!r.del) {
								var code = r.data["CODE"];
								if(code == "") continue;
								var category_id = r.data["CATEGORY_ID"];
								
								if(code==row.selectSingleNode("CODE").text && category_id==row.selectSingleNode("CATEGORY_ID").text){
									repeatCodes.push(code);
								}
							}
							
						}
					}
					if(repeatCodes.length>0){
						EMsg("����ʧ�ܣ����롾" + repeatCodes.join(",") + "���ѱ�ʹ�ã������ظ���");
						return false;
					}
				}
			}
			return true;
		},
		addRow : function()
	   	{
			var count = this.dstore.getCount();
			var ascode = new AssetMod({
						MODELID : '',
						MODEL : '',
						CATEGORY_ID: itemValue||'',
						CATEGORY_NAME: itemText||'',
						CODE:'',
						SORTID : count + 1
					});
			ascode.isAdd = true;
			this.stopEditing();
			this.dstore.insert(count, ascode);
			this.startEditing(count, 1);
			var items = this.topToolbar.items;
			items.item("btn_undo").setDisabled(false);
			items.item("btn_del").setDisabled(false);
			if (!this.isNull())
			 {
				items.item("btn_save").setDisabled(true);
			 } else 
			    {
				 items.item("btn_save").setDisabled(false);
			    }
			this.getSelectionModel().selectLastRow();
		},
		delRow : function() 
		{
			var sm = this.getSelectionModel();
			var records = sm.getSelections();
			for (var i = 0, r; r = records[i]; i++)
             {
				r.del = true;
				if (r.isAdd !== true) {
					this.deleteRows.push(r);
	
				}
				this.dstore.remove(r);
	
			 }
			var items = this.topToolbar.items;
			items.item("btn_undo").setDisabled(false);
			if (!this.isNull() || this.isEdit())
			 {
				items.item("btn_save").setDisabled(false);
			 }else{
				items.item("btn_save").setDisabled(true);
			 }
			
		},
		validateValue : function(r)
		{
			var model = r.get("MODEL");
			var sortid = r.get("SORTID");
			var code = r.get("CODE");
			if (!model) 
			 {
				EMsg('��¼���ͺŲ���Ϊ��!');
				this.setRecordEdit(r, 1);
				return false;
			 }
			if (!sortid) 
			 {
				EMsg('��¼����Ų���Ϊ��!');
				this.setRecordEdit(r, 5);
				return false;
			 }
			//�ж�ͬ�����̵��ʲ��ͺŵı��벻���ظ���������validateCode���жϲ�ͬ����֮�䣬��������벻��ͬʱ�ظ�
			var index = this.dstore.findBy(this.FilterModelFn, r)
			if (index != -1) {
					EMsg('��¼���ͺ��ظ�!');
					this.setRecordEdit(r, 1);
					return false;
			}
			if(code != "") {
				index = this.dstore.findBy(this.FilterCodeFn, r)
				if (index != -1) {
						EMsg('��¼�ı����ظ�!');
						this.setRecordEdit(r, 4);
						return false;
				}
			}
			return true;
		},
		setSendState : function(v) 
		 {
			var isSend = (typeof v == "undefined") ? this.isEdit() : v;
			var items = this.topToolbar.items;
			items.item("btn_undo").setDisabled(!isSend);
			items.item("btn_save").setDisabled(!isSend);
			items.item("btn_del").setDisabled(!isSend);
		 },
		isEdit : function()
		 {
			return (this.deleteRows.length > 0 || this.dstore.getModifiedRecords().length > 0);
		 },
		isNull : function()
		 {
			for (var i = 0; i < this.dstore.getCount(); i++)
			{
				var r = this.dstore.getAt(i);
				if (!r.get("MODEL"))
				 {
					return false;
					break;
				 }
			}
			return true;
		 }
	
	});
