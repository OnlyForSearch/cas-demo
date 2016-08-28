		Ext.ns('heath.prt.chek');
		Ext.override(Ext.form.HtmlEditor, 
		{   
		    onDisable: function()
		       {   
		        if(this.rendered)
		        {   
		            this.wrap.mask();   
		        }   
		        Ext.form.HtmlEditor.superclass.onDisable.call(this);   
		    },   
		    onEnable: function()
		    {   
		        if(this.rendered)
		        {   
		            this.wrap.unmask();   
		        }   
		        Ext.form.HtmlEditor.superclass.onEnable.call(this);   
		    }   
	});  
		Ext.onReady(startCust);
		function startCust() 
			{
				var arrayUrl=getURLSearch();
				new heath.prt.chek.custWin(1,arrayUrl);
			}
		heath.prt.chek.custWin = function(dutyID,params)
		{
			Ext.QuickTips.init();
			Ext.form.Field.prototype.msgTarget = 'side';
			var fieldList = new Array();
			var heightY = 200;
			var whX=600;
			var heY=500;
			var  htmleE=new Ext.form.HtmlEditor({
						height : 150,
						sourceEditMode:false,
						width : 400,
						enableSourceEdit:true,
						 enableLinks :false, //这是把链接的按钮去掉. 
	                     enableLists : false, // 这是把list 排序给去掉, 
						 fontFamilies : ['宋体','隶书','黑体']//字体列表
					})
			var upTabs = new Ext.TabPanel({
						minTabWidth : 105,
						tabWidth : 105,
						deferredRender:false,
						split : true,
						border : false,
						resizeTabs:true,
						listeners : {
							tabchange  : {
								fn:personChg
							}
						},
						activeTab : 0,
					    enableTabScroll : true,
						width:whX-30,
						height:heY-100,
						frame : true
					});
			var viewPanel = new Ext.Window({
						title : params.HEALTH_INSTANCE_NAME+' 报告审核记录',
						width : whX,
						height : heY,
						autoScroll : true,
						y : 0,
						enableTabScroll : true,
						closable : false,
						buttonAlign : 'center',
					   // layout : 'fit',
						//items : [upTabs],
						draggable : false,
						buttons : [
							   {
									text : '保存',
									handler : saveCust
								}, 
								{
									text : '重置'
									
								}]
					});
			// 初始化上次值班记录数据和这次这次值班记录表单元素个数
			Ext.Ajax.request({
				url : '../../servlet/healthRptAction?action=20',
				params : {
							HEALTH_INSTANCE_ID : params.HEALTH_INSTANCE_ID
				         },
				callback : function(options, success, response)
				{
					var personAny = Ext.util.JSON.decode(response.responseText);
					if(personAny.myprts.length>0)
					{
						var myAry=personAny.myprts;
						htmleE.setValue(myAry[0].VERIFY_IDEA);
					var panl=new Ext.Panel({
						    title :myAry[0].STAFF_NAME ,
						    sid:'default1',
						    xtype : 'form',
							layout:'fit',
							border : false,
							hideLabels : true,
							bodyStyle : 'background:transparent;',
							height : 150,
							items : [htmleE]
					})
						 upTabs.add(panl);
						 upTabs.setActiveTab(panl);
					}
					if(personAny.persons.length>0)
					{
						var perAry=personAny.persons;
						for(p=0;p<perAry.length;p++){
							var strTime="";
							if(perAry[p].VERIFY_TIME!=""){
								strTime='<b>审核时间：</b>'+perAry[p].VERIFY_TIME+'<br><br>';
							}
							var idea="";
							if(perAry[p].VERIFY_IDEA=="")
							{
							    idea="<font color=red>未填写审核意见</font>";
							}else{
								idea=strTime+perAry[p].VERIFY_IDEA;
							}
							var perV=new Ext.Panel({
					           // id : perAry[p].VERIFY_PERSON,
			                    title :perAry[p].STAFF_NAME ,
								width:whX-200,
								height:heY-200,
								sid:perAry[p].VERIFY_PERSON,
								xtype : 'form',
								layout:'fit',
								border : false,
								hideLabels : true,
								bodyStyle : 'background:transparent;',
								height : 150,
								items : {
									xtype:'htmleditor',
									sourceEditMode:false,
									value:idea,
									width : 400,
									disabled:true,
									onDisable: function()
									{   
								        if(this.rendered)
								        {   
								            var roMask = this.wrap.mask();   
								            roMask.dom.style.filter = "alpha(opacity=0);"; //IE   
								            roMask.dom.style.opacity = "0"; //Mozilla   
								            roMask.dom.style.background = "white";   
								            roMask.dom.style.overflow = "scroll";   
								            //roMask.dom.innerHTML = this.getValue();     
								        }   
								        Ext.form.HtmlEditor.superclass.onDisable.call(this);   
								    }, 
									enableSourceEdit:true,
									enableLinks :false, //这是把链接的按钮去掉. 
				                    enableLists : false // 这是把list 排序给去掉, 
								}
						
		                    
					      })
				
							upTabs.add(perV);
									if(p==0&&personAny.myprts.length==0){
										upTabs.setActiveTab(perV);
									}
								//upTabs.setActiveTab(perV);
						}
					}			
				}
			});
			upTabs.doLayout();
			viewPanel.add(upTabs);
			viewPanel.show();
			function saveCust() 
			{
				if(htmleE.getValue()=='')
				{
					alert('审核意见不能为空!');
					return false;
				}
				var sendXml = new ActiveXObject("Microsoft.XMLDOM");
				var root = sendXml.createElement('root');
				sendXml.appendChild(root);
				var objects = sendXml.createElement('objects');
				var health_id = sendXml.createElement('HEALTH_INSTANCE_ID');
				health_id.text=params.HEALTH_INSTANCE_ID;
				objects.appendChild(health_id);
				var vrd = sendXml.createElement('HTML_VALUE');
				vrd.text=htmleE.getValue();
				objects.appendChild(vrd);
				root.appendChild(objects);
					Ext.Ajax.request({
								url : '../../servlet/healthRptAction?action=21',
								waitMsg : '提交数据请稍后……',
								waitTitle : '提示',
								xmlData : sendXml,
								callback : function(options, success, response) 
									{
										var responseMove = Ext.util.JSON.decode(response.responseText);
										if (responseMove.success == true) 
										{
											Ext.Msg.show({
														title : '成功提示',
														msg : '数据已经保存!',
														buttons : Ext.Msg.OK,
														icon : Ext.Msg.INFO
													});
										} else {
											Ext.Msg.show({
														title : '错误提示',
														msg : '!数据保存失败',
														buttons : Ext.Msg.OK,
														icon : Ext.Msg.ERROR
													});
										}
				                  }
							});
				
			}
			function personChg(tabpanel, panel){
				var buttons=viewPanel.buttons;
				if(panel.sid=='default1'){
					buttons[0].setDisabled(false);
					buttons[1].setDisabled(false);
				}else{
					buttons[0].setDisabled(true);
					buttons[1].setDisabled(true);
				}
				
			}
	}
