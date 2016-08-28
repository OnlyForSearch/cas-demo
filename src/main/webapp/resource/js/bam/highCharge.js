/*
*选择固网高额，然后双击一条，在弹出得页面上，双击链接到HP-SID系统页面
*/
function ViewHPSID(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{	
		var maxWidth = screen.availWidth - 10;
	 	var maxHeight = screen.availHeight - 30;
		window.open(row.get("URL"),null,'height='+maxHeight+',width='+maxWidth+',top=0,left=0,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,location=yes,status=yes');
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}
}