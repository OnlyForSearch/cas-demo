	Ext.ns('duty.record.cust');
	Ext.onReady(startCust);
	function startCust() 
	{
		new duty.record.cust.custWinup($request("arrangementId"));
	}
	duty.record.cust.custWinup = function(upArrangementID)
	{
		Ext.QuickTips.init();
		var fieldList = new Array();
		var heightY = 200;
		// �ϴ�ֵ���¼���
		var upTabs = new Ext.TabPanel({
					bodyStyle : 'background:#DFE8F7',
					xtype : 'tabpanel',
					minTabWidth : 135,
					tabWidth : 135,
					split : true,
					border : false,
					// resizeTabs:true,������Զ��仯,����Ӱ��������ʾ
					activeTab : 0,
					height : 300,
					autoScroll : true,
					// enableTabScroll : true,// ����ʱ���ܹ���������
					width : 200,
					frame : true
				});
		// �����ϴ�ֵ������ֵ���¼������
		var viewPanel = new Ext.Window({
					title : '��ʷֵ���¼',
					width : 700,
					height : 650,
					autoScroll : true,
					y : 0,
					enableTabScroll : true,
					closable : false,
					layout : 'fit',
					items : [upTabs],
					draggable : false,
					buttons:[{
						text:'�ر�',
						handler: function() {
							window.close();
						}
					}]
				});
		// ��ʼ���ϴ�ֵ���¼���ݺ�������ֵ���¼��Ԫ�ظ���
		Ext.Ajax.request({
			url : '/servlet/dutyRecordConfig.do?method=showDutyUp',
			params : {
						upArrangementID : upArrangementID
			         },
			callback : function(options, success, response)
			{
				var duty = Ext.util.JSON.decode(response.responseText);
				if (duty.success == true) {
					var upList = eval(duty.dutyUp);
					for (var u = 0; u < upList.length; u++) 
						{
							var htmlContent = "<div style='background:#DFE8F7; width:100%; height:100%'><table width=100% ><tr><td colspan='2'>&nbsp;&nbsp;&nbsp;Ա��������"
									+ upList[u].STAFFNAME
									+ " &nbsp;&nbsp;&nbsp;&nbsp;��ϵ�绰��"
									+ upList[u].CONTACT
									+ "</td></tr><tr><td colspan='2'>&nbsp;&nbsp;&nbsp;��������������������������������������������������������������������������������������������������������</td></tr>";
							var custList = eval(upList[u].custJson);
							for (var c = 0; c < custList.length; c++) 
							    {
									htmlContent += "<tr><td width=65>&nbsp;&nbsp;&nbsp;"
											+ custList[c].COLNAME
											+ ":</td><td align='left'><textarea readOnly='readOnly' style='color:#808080' cols='70' rows='3'>"
											+ custList[c].COLVALUE
											+ "</textarea></td></tr>";
							   }
							htmlContent += "</table></div>";
							upTabs.add({
										title : "ֵ��Ա" + (u + 1),
										id : upList[u].STAFFID,
										html : htmlContent,
										iconCls : 'stafftop'
									});
							upTabs.setActiveTab(upList[0].STAFFID);
					}
				
				   viewPanel.show();
				} else
				     {
						Ext.Msg.show({
									title : '������ʾ',
									msg : '���س���',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								});
				   }
			}
		});
	}
