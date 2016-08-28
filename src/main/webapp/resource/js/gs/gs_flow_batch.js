var executeOpinion = '';
var store;
var tacheIdMany = "";
var tacheModId = "";
var flowModId = "";

function finishFlow(grid){

	var selectedRows = grid.getSelectionModel().getSelections();  

	
	for(var i=0;i<selectedRows.length;i++){

		flowModId = selectedRows[i].get("FLOW_ID");
		tacheModId = selectedRows[i].get("TCH_MOD");
		
		if(typeof(tacheIdMany)=='undefined'){
			Ext.Msg.show({
				title:'����',
				msg:'δ�ҵ�����ID��',
				buttons:Ext.Msg.OK,
				icon:Ext.Msg.ERROR
			});
			return;
		}else{
			tacheIdMany += selectedRows[i].get("TCH_ID");
			if(i==selectedRows.length-1){
						break;
				}
			tacheIdMany+=",";
		}
		
		
	}
	if(tacheIdMany==""){
		Ext.Msg.show({
			title:'����',
			msg:'û��ѡ���¼��',
			buttons:Ext.Msg.OK,
			icon:Ext.Msg.ERROR
		});
		return;
	}
	// 1.��һ�����б�   
	var taches = getNextTache(tacheModId);
	// 2.��ǰ���ڴ������
	getExecuteOption(tacheModId);

	var proxy=new Ext.data.MemoryProxy(taches);
	var Tache=Ext.data.Record.create([
       {name:"tacheNum",type:"int",mapping:0},
       {name:"tacheName",type:"string",mapping:1}
    ]);
	var reader=new Ext.data.ArrayReader({},Tache);
    store=new Ext.data.Store({
	     proxy:proxy,
	     reader:reader
    });
    store.load();
	
	showWindow(grid,tacheIdMany);
}


function showWindow(grid,flowIdMany){
	
	
	//���1.��һ������Ϣ  2.�����һ���ڴ�������Ϣ  3.��ñ��������õĴ������
	var resultDesc = new Ext.form.TextArea({
				name : 'resultDesc',
				id : 'resultDesc',
				height : 180,
				fieldLabel : '�������',
				msgTarget : 'side',
				disabled:Global.flag,
				labelSeparator : '��',
				//value:row.get("DISPOSITION"),
				anchor : '95%',
				allowBlank : false,
				blankText : '�����������Ϊ��',
				maxLength : 3800,
				maxLengthText : '���Ȳ��ܳ���4000',
				value:executeOpinion
			});
    var combobox=new Ext.form.ComboBox({
			    renderTo:Ext.getBody(),
			    triggerAction:"all",
			    store:store,
			    readOnly: true,  
			    displayField:"tacheName",
			    valueField:"tacheNum",
			    mode:"local",
			    emptyText:"��ѡ����һ����",
			     listeners: {  
          afterRender: function(combo) {  
									          if(store.getCount() > 0) {
													//combo.setValue(records[0].getValue('tacheName'));
												};
          
											//var firstValue = store.reader.taches[0].text;  
								 	        //combo.setValue(firstValue);//ͬʱ������Ὣ��nameΪfirstValueֵ��Ӧ�� text��ʾ   
          }    
      } 
			  	
    });
   

	var mediaForm = new Ext.FormPanel({
				labelWidth : 100,
				labelPad : 1,
				border : false,
				style : 'padding:2',
				frame : true,
				autoScroll : true,
				items : [resultDesc,{
									  width:190,
									  layout: 'column',
									  labelWidth:90,
									  fieldLabel:"��һ���ڴ�����",
									  items: [{
									 	  columnWidth : .8,
								          xtype:"textfield",//���ı���
								          name:"user",
								          id:"user",
								          width:100,
						                  disableKeyFilter:true,
							              allowBlank:false,
							              disabled: true 
									  },{
										    xtype: 'tbbutton',
									   		cls: 'x-btn-icon',
								    	    icon: '../../../resource/image/search.gif',
								    	    handler:function(){choosePersonName();}//
									  
									  }
									  ]
									},{
									  width:190,
									  layout: 'column',
									  labelWidth:90,
									  fieldLabel:"��һ����",
									  items: [combobox]
									},{
					                    name: "nextStaff",
					                    id: "nextStaff",
					                    xtype: "hidden"
									}
						]
				
						});
					
	

	var window = new Ext.Window({
		title : '��д��ת��Ϣ',
		layout : 'border',
		collapsible : false,
		closable : true,
		closeAction : 'close',
		iconCls : 'typeIco',
		modal : true,
		draggable : true,
		resizable : false,
	    x : Ext.getBody().getViewSize().width/2-270,
		y : Ext.getBody().getViewSize().height/2-170,
		layout : 'fit',
		width : 550,
		height : 350,
		constrain : true,
		items : [mediaForm],
		buttonAlign : 'right',
		buttons : [{
			text : '��ת',
			//disabled:Global.flag,
			iconCls : 'icon-save',
			handler : function() {
				if(Ext.getCmp("user").getValue()==""){
					Ext.Msg.show({
						title:'����',
						msg:'��ѡ����һ���ڴ�����!',
						width:200,
						buttons:Ext.Msg.OK,
						icon:Ext.Msg.ERROR
					});
				}else if(combobox.getValue()==""){
					Ext.Msg.show({
							title:'����',
							msg:'��ѡ����һ����!',
							width:200,
							buttons:Ext.Msg.OK,
							icon:Ext.Msg.ERROR
						});
				}else{
					var sendXml = new ActiveXObject("Microsoft.XMLDOM");
					var root = sendXml.createElement('root');
					sendXml.appendChild(root);
					
					//�������
					var result = sendXml.createElement('RESULTDESC');
					result.text=resultDesc.getValue();
					root.appendChild(result);
					//��һ���ڴ�����
					var nextExecutStaff = sendXml.createElement("NEXTSTAFF");
					nextExecutStaff.text = Ext.getCmp("nextStaff").getValue();
					root.appendChild(nextExecutStaff);
					//��һ����
					var nextTacheNum = sendXml.createElement("NEXTTACHENUM");
					nextTacheNum.text = combobox.getValue();
					root.appendChild(nextTacheNum);
					//��ǰ����id
					var currentTacheIds = sendXml.createElement("TACHEIDS");
					currentTacheIds.text = tacheIdMany;
					root.appendChild(currentTacheIds);
					//��ǰ����ģ��id
					var currentTacheMod = sendXml.createElement("TACHEMODEL");
					currentTacheMod.text = tacheModId;
					root.appendChild(currentTacheMod);
										
					var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp.Open("POST",  "/servlet/BatchFlowServlet?tag=1", false);
					xmlhttp.send(sendXml);
					if (isSuccess(xmlhttp)) {  
						oXml = xmlhttp.responseXML;
						var state = oXml.selectSingleNode("/root/error_code").text;
						if(state==0){
							Ext.Msg.show({
								title:'��ʾ��Ϣ',
								msg:'��ת�ɹ�!',
								width:160,
								buttons:Ext.Msg.OK,
								icon:Ext.Msg.INFO
							});
							window.close();
							Global.grid.search();
						}else{
							Ext.Msg.show({
								title:'��ʾ��Ϣ',
								msg:'��תʧ��!',
								width:160,
								buttons:Ext.Msg.OK,
								icon:Ext.Msg.ERROR
							});
						}	
					}
				}
			}
		}, {
			text : '�ر�',
			iconCls : 'closeWin',
			handler : function() {
				//this.ownerCt.close();
				window.close();
			}
		}]
		
	}).show();
	}
function fireResize()
{
	var e = document.body;
	Global.grid.setSize(e.clientWidth, e.clientHeight);
}

function getNextTache(tacheMod){

	//��һ������Ϣ
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",  "/servlet/BatchFlowServlet?tag=2&tacheMod="+tacheMod, false);
	xmlhttp.send("")	
    var doc = new ActiveXObject("MSxml2.DOMDocument");
	doc.loadXML(xmlhttp.responseText);
    var nodes = doc.getElementsByTagName("tache");
    var taches=new Array(); 
    for(var i=0;i<nodes.length;i++){
        taches[i]=new Array();    
    	var tacheName=nodes.item(i).childNodes.item(0).text ; 
    	taches[i][1] = tacheName;
    	var tacheNum=nodes.item(i).childNodes.item(1).text;
    	taches[i][0] = tacheNum;
    }
  	return taches;  
}

	function getExecuteOption(tacheMod){
		//��ǰ���ڴ�����Ϣ
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST",  "/servlet/BatchFlowServlet?tag=3&tacheMod="+tacheMod, false);
		xmlhttp.send("");
		if(isSuccess(xmlhttp)){
			var dataXML = new ActiveXObject("Microsoft.XMLDOM");
		 	var opinion = xmlhttp.responseXML.selectSingleNode("/root/OPINION");
		 	if(opinion.text==""||opinion.text==null){
		 		executeOpinion = "1.ȷ����������Ƿ���������Ƿ����ڸ߶���թ��\n��\n\n2.�ֹ�˾���յ����ɷ���ǰ�Ƿ��ѷ�������쳣����ͼƷ��������ʱ���֡�����������Σ�\n��:\n\n3.�˸߶��û���ȡ���ִ�ʩ�������Ժ�����������⣬������ЩԤ��������\n��\n";
		 	}else{
		 		executeOpinion = "���������Ϊ��";
		 	}
		}
}

function choosePersonName(){
   	var obj = choiceStaff();
	if(obj!=null){
		Ext.getCmp("user").setValue(obj.name);
		Ext.getCmp("nextStaff").setValue(obj.id);
	}
}


	function showForm(grid)
	{
		var row = grid.getSelectionModel().getSelections();
		var	flow_id = row[0].get("FLOW_ID");
		var flowMod = row[0].get("FLOW_MOD");
		if(typeof(row[0])=='undefined'){
			return;
		}
		if(typeof(flow_id)=='undefined'){
			alert("û���ҵ�����ID!");
			return;
		}
		if(typeof(flowMod)=='undefined'){
			flowMod = "";
		}
		var url = "/workshop/form/index.html?fullscreen=yes&flowId="+flow_id+"&flowMod="+flowMod;
		doWindow_open(url);
	}
	
	function showFormRefresh(grid)
	{
		var row = grid.getSelectionModel().getSelections();
		if(typeof(row[0])=='undefined'){
			return;
		}
		var	flow_id = row[0].get("FLOW_ID");
		var flowMod = row[0].get("FLOW_MOD");
		if(typeof(flow_id)=='undefined'){
			alert("û���ҵ�����ID!");
			return;
		}
		if(typeof(flowMod)=='undefined'){
			flowMod = "";
		}
		var callbackFn;
		callbackFn = function(){dogridRefresh(grid)}
		var url = "/workshop/form/index.html?fullscreen=yes&flowId="+flow_id+"&flowMod="+flowMod+"&callback=window.opener.callbackFn()";
		doWindow_open(url);
	}
	
	function dogridRefresh(grid){
		grid.search();
	}
	
	function getFirstDay(){
		var d = new Date();
		d.setDate(1);
		var year = d.getYear();
		var month = d.getMonth()+1;
		var day = d.getDate();
		
		return year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);
	}
	
	function getEndDay(){
		var d = new Date();
		var year = d.getYear();
		var month = d.getMonth()+1;
		var day = d.getDate();
		d = new Date(year,month,day);
		d.setDate(0);
		year = d.getYear();
		month = d.getMonth()+1;
		day = d.getDate();
		return year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);
	}
	
	function getForwordDay(fDay){
		if(typeof(fDay)=='undefined'||fDay==''){
			fDay = -1;
		}
		var d = new Date();
		d.setDate(d.getDate() + fDay)
		var year = d.getYear();
		var month = d.getMonth()+1;
		var day = d.getDate();
		return year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);
	}
	
	function getDynamicDay(fDay){
		if(typeof(fDay)=='undefined'||fDay==''){
			fDay = -1;
		}
		var d = new Date();
		d.setDate(d.getDate() + fDay)
		var year = d.getYear();
		var month = d.getMonth()+1;
		var day = d.getDate();
		return year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);
	}
	
	function showJobPlan(grid){
		var row = grid.getSelectionModel().getSelections();
		if(typeof(row[0])=='undefined'){
			return;
		}
		var sendUrl = row[0].get("SEND_URL");
		var serial_num = row[0].get("SERIAL_NUM");
		var event_id = row[0].get("ET_ID");
		if(typeof(sendUrl)=='undefined'||typeof(serial_num)=='undefined'){
			MMsg('��ȡ�б�ֵʧ��!');
			return;
		}
		sendUrl = sendUrl.replace("serialnum",serial_num);
		sendUrl = "/WorkAccept?id="+event_id+"&type=event";
		doWindow_open(sendUrl);
	}
	
	function showTache(grid)
	{
		
		var row = grid.getSelectionModel().getSelections();
		if(typeof(row[0])=='undefined'){
			return;
		}
		var	flow_id = row[0].get("FLOW_ID");
		var flowMod = row[0].get("FLOW_MOD");
		var	isBindForm = row[0].get("ISBINDFORM");
		if(typeof(flow_id)=='undefined'){
		
			MMsg('��ȡ����ID����!');
			return;
		}
		
		if(typeof(flowMod)=='undefined'){
			flowMod = 0;
		}
		
		var sendUrl = row[0].get("SEND_URL");
		var serial_num = row[0].get("SERIAL_NUM");
		var callbackFn;
		callbackFn = function(){dogridRefresh(grid)}
		var url = "/workshop/form/index.html?callback=opener.callbackFn()&fullscreen=yes&flowId="+flow_id+"&flowMod="+flowMod;
		if(typeof(sendUrl)=='undefined'||typeof(serial_num)=='undefined'){
			sendUrl = url;
		}else{
			sendUrl = sendUrl.replace("0000",serial_num);
			//sendUrl = sendUrl.replace(".","");
			sendUrl = sendUrl + "&callback=opener.callbackFn()";
		}	
		doWindow_open(sendUrl);
	}
	
	function tip(value,p,record){
		return "<div ext:qtip='<div style=\"font-size:10pt;padding:3;\">"+value+"</div>' ext:qtitle='��ϸ��Ϣ��'>"+value+"</div>";	
	}


 