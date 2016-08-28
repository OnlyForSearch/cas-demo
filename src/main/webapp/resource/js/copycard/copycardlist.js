
// ����
function copycardImportExcel() {
	var imPortFile = new Ext.form.TextField({
				fieldLabel : '����Excel�ļ�',
				inputType : 'file',
				height : 20,
				name : 'uploadFile',
				width : 250
			})
	var imPortPanel = new Ext.FormPanel({
				fileUpload : true,
				items : imPortFile

			})
	var imPortwin = new Ext.Window({
		title : '��ѡ���ļ�',
		width : 400,
		height : 100,
		minimizable : false,
		maximizable : false,
		resizable : false,
		closable : true,
		modal : true,
		draggable : true,
		autoScroll : true,
		border : false,
		items : imPortPanel,
		buttonAlign : 'center',
		buttons : [{
					text : 'ȷ��',
					handler : function() {
						var filePath = imPortFile.getValue();
						var flag = checkImportExcel(filePath);
						if (flag)// �ύ
						{
							var url = "/servlet/CopyCardServlet?type=1";
							imPortPanel.url = url;
							imPortPanel.getForm().submit({
										url : url,
										success : function(f, a) {
											Ext.MessageBox.show({
														title : '��ʾ',
														msg : a.result.msg,
														autoWidth : true,
														buttons : Ext.MessageBox.OK,
														icon : Ext.MessageBox.INFO
													});
													imPortwin.close();
													refresh(Global.grid);

										},
										failure : function(f, a) {
											Ext.MessageBox.show({
														title : '��ʾ',
														msg : a.result.msg,
														autoWidth : true,
														buttons : Ext.MessageBox.OK,
														icon : Ext.MessageBox.ERROR
													});
										}
									})

						}
					}
				}, {
					text : 'ȡ��',
					handler : function() {
						imPortwin.close();
					}

				}]

	})
	imPortwin.show();
}
// ����
function copycardExportExcel() {
	exportExcel(Global.grid);
}
// ����ģ��
function copycardLoadModel() {
	window.location.href = "/workshop/copycard/excel/���ƿ�����¼��ģ��.xls";
}
function checkImportExcel(filePath) {
	var flag = false;
	if (filePath == null || filePath == '') {
		Ext.MessageBox.show({
					title : '��ʾ',
					msg : '�ļ�������Ϊ��!',
					autoWidth : true,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
	} else {
		var fileType = filePath.substring(filePath.lastIndexOf(".") + 1)
		if (fileType.toLowerCase() != 'xls') {

			Ext.MessageBox.show({
						title : '��ʾ',
						msg : '�ļ�ҪΪxls��ʽ!',
						autoWidth : true,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});

		} else {
			flag = true;
		}
	}
	return flag;
}