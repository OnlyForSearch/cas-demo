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
		// 上次值班记录面板
		var upTabs = new Ext.TabPanel({
					bodyStyle : 'background:#DFE8F7',
					xtype : 'tabpanel',
					minTabWidth : 135,
					tabWidth : 135,
					split : true,
					border : false,
					// resizeTabs:true,宽度能自动变化,但是影响标题的显示
					activeTab : 0,
					height : 300,
					autoScroll : true,
					// enableTabScroll : true,// 挤的时候能够滚动收缩
					width : 200,
					frame : true
				});
		// 包含上次值班和这次值班记录的容器
		var viewPanel = new Ext.Window({
					title : '历史值班记录',
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
						text:'关闭',
						handler: function() {
							window.close();
						}
					}]
				});
		// 初始化上次值班记录数据和这次这次值班记录表单元素个数
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
							var htmlContent = "<div style='background:#DFE8F7; width:100%; height:100%'><table width=100% ><tr><td colspan='2'>&nbsp;&nbsp;&nbsp;员工姓名："
									+ upList[u].STAFFNAME
									+ " &nbsp;&nbsp;&nbsp;&nbsp;联系电话："
									+ upList[u].CONTACT
									+ "</td></tr><tr><td colspan='2'>&nbsp;&nbsp;&nbsp;————————————————————————————————————————————————————</td></tr>";
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
										title : "值班员" + (u + 1),
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
									title : '错误提示',
									msg : '加载出错',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								});
				   }
			}
		});
	}
