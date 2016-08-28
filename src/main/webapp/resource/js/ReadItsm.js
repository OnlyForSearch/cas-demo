    var callbackFn;
    //未阅流程表单打开
    function showForm(grid)
    {
        var row = grid.getSelectionModel().getSelected();
        
        if(typeof(row)=='undefined'){
            return;
        }
        var flow_id = row.get("FLOW_ID");
        var tch_id = row.get("MSG_TCH_ID");
        if(typeof(flow_id)=='undefined'||flow_id==""){
            alert("没有找到流程ID!");
            return;
        }
        var x=(window.screen.width-780)/2;
        var y=(window.screen.height-560)/2;
        var url = "../form/index.jsp?tchId="+tch_id+"&fullscreen=yes&type=view&callback=parent.opener.callbackFn()";
        curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
    }
    
    //已阅
    function showFormNo(grid)
    {
        var row = grid.getSelectionModel().getSelected();
        
        if(typeof(row)=='undefined'){
            return;
        }
        var flow_id = row.get("FLOW_ID");
        var tch_id = row.get("MSG_TCH_ID");
        if(typeof(flow_id)=='undefined'||flow_id==""){
            alert("没有找到流程ID!");
            return;
        }
        var x=(window.screen.width-780)/2;
        var y=(window.screen.height-560)/2;
        var url = "../form/index.jsp?tchId="+tch_id+"&fullscreen=yes";
        curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
    }
    
