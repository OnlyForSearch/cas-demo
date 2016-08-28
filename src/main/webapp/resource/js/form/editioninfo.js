
function createFormPanel(grid) {
	var hostform = new Ext.FormPanel({
		labelWidth : 40,
		labelAlign : 'right',
		url : 'saveHost',
		border : false,
		baseCls : 'x-plain',
		bodyStyle : 'padding:5px 5px 0',
		anchor : '100%',
		defaults : {
			width : 300,
			msgTarget : 'side'
		},
		defaultType : 'textarea',
		tbar : [{
			id : 'btnSave',
			text : '����',
			iconCls : 'icon-add',
			handler : function() {
				var EDITION_ID = encodeURIComponent(hostform.getForm().findField("EDITION_ID").getValue());
				var REMARK = encodeURIComponent(hostform.getForm().findField("REMARK").getValue());
				hostform.form.submit({
						/*params : {
							a : 'a'
						},*/
						// clientValidation : true,// ���пͻ�����֤
						// waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
						// waitTitle : '��ʾ',// ����
						url : '/servlet/editionservlet?tag=1&EDITION_ID='+EDITION_ID+'&REMARK='+REMARK,// �����url��ַ
						method : 'POST',// ����ʽ
						success : function(form, action) {// ���سɹ��Ĵ�����
							window_host.hide();
							// updateBookList(action.result.bookTypeId);
							refresh(grid);
							Ext.Msg.alert('��ʾ', '����ɹ�');
						},
						failure : function(form, action) {// ����ʧ�ܵĴ�����
							Ext.Msg.alert('��ʾ', '����ʧ��');
						}
					});
			}
		} /*{
			id : 'btnReset',
			text : '����',
			iconCls : 'icon-plugin',// ͼƬ
			handler : function() {
				hostform.getForm().reset();
			}
		}, {
			id : 'btnClose',
			text : '�ر�',
			iconCls : 'icon-exit',
			handler : function() {
				hostform.getForm().reset();
				window_host.hide();
			}
		}*/],
		items : [{
					xtype : 'hidden',
					name : 'EDITION_ID'
				}, {
					fieldLabel : '��ע',
					name : 'REMARK',
					//allowBlank : false,
					height:120,
					maxLength : 1000
				}]
	});

	var window_host = new Ext.Window({
				width : 400,
				height : 340,
				resizable : false,
				autoHeight : true,
				modal : true,
				closeAction : 'hide',
				items : [hostform]
			});
	return {
		'window' : window_host,
		'form' : hostform
	};
}

function RelaModify(grid) {
	var record = grid.getSelectionModel().getSelected();
	var o = createFormPanel(grid);
	winHost = o.window;
	frmHost = o.form;
	winHost.setTitle('�汾��Ϣ����');
	winHost.show();
	//frmHost.findField("EDITION_NUMBER").getValue();
	//alert(record.getCount());
	//alert(record.data['F1']);
	frmHost.getForm().findField('REMARK').setValue(record.data['F3']);
	frmHost.getForm().findField('EDITION_ID').setValue(record.data['F1']);
	
	/*for (var id in record.data) {
		if (typeof record.data[id] != 'function'
				&& (field = frmHost.getForm().findField(id))) {
			field.setValue(record.data[id]);
		}
	}*/
}

