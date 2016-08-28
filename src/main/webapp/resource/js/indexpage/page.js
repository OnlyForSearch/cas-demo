
function OpenForm(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{                                
        var flowid = row.get("FLOW_ID");
        var width = screen.availWidth-10;
	    var height = screen.availHeight-30;
	    var top = 0;
	    var left = 0;
	    var sFeatures = new Array();
	    sFeatures.push("width="+width);
	    sFeatures.push("height="+height);
	    sFeatures.push("top="+top);
	    sFeatures.push("left="+left);
	    sFeatures.push("location="+0);
	    sFeatures.push("menubar="+0);
	    sFeatures.push("resizable="+1);
	    sFeatures.push("scrollbars="+1);
	    sFeatures.push("status="+0);
	    sFeatures.push("titlebar="+0);
	    sFeatures.push("toolbar="+0);
	    if(flowid != "" && flowid != undefined )
	    {
	    	return window.open("../../../../workshop/form/index.jsp?fullscreen=yes&flowId="+flowid, "", sFeatures.join(","));
	    }
	    if(val)
	    {
	    	grid.search();
	    }
	}
	else
	{
		MMsg("«Î—°‘Ò“ªœÓ£°");
		return;
	}
}


