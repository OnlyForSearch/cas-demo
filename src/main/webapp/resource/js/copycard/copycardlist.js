
// 导入
function copycardImportExcel() {
	var imPortFile = new Ext.form.TextField({
				fieldLabel : '导入Excel文件',
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
		title : '请选择文件',
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
					text : '确定',
					handler : function() {
						var filePath = imPortFile.getValue();
						var flag = checkImportExcel(filePath);
						if (flag)// 提交
						{
							var url = "/servlet/CopyCardServlet?type=1";
							imPortPanel.url = url;
							imPortPanel.getForm().submit({
										url : url,
										success : function(f, a) {
											Ext.MessageBox.show({
														title : '提示',
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
														title : '提示',
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
					text : '取消',
					handler : function() {
						imPortwin.close();
					}

				}]

	})
	imPortwin.show();
}
// 导出
function copycardExportExcel() {
	exportExcel(Global.grid);
}
// 下载模板
function copycardLoadModel() {
	window.location.href = "/workshop/copycard/excel/复制卡号码录入模板.xls";
}
function checkImportExcel(filePath) {
	var flag = false;
	if (filePath == null || filePath == '') {
		Ext.MessageBox.show({
					title : '提示',
					msg : '文件名不能为空!',
					autoWidth : true,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
	} else {
		var fileType = filePath.substring(filePath.lastIndexOf(".") + 1)
		if (fileType.toLowerCase() != 'xls') {

			Ext.MessageBox.show({
						title : '提示',
						msg : '文件要为xls格式!',
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