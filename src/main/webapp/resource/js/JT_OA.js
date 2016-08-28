function showForm_DB(grid)
    {
        var row = grid.getSelectionModel().getSelected();
        
        if(typeof(row)=='undefined'){
            return;
        }
        var flow_id = row.get("FLOWID");
        var tch_id = row.get("TCH_ID");
        if(typeof(flow_id)=='undefined'||flow_id==""){
            alert("没有找到流程ID!");
            return;
        }
        var x=(window.screen.width-780)/2;
        var y=(window.screen.height-560)/2;
        var url = "../form/index.jsp?tchId="+tch_id+"&fullscreen=yes";
        curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
    }


function showForm_YB(grid)
{
    var row = grid.getSelectionModel().getSelected();
    
    if(typeof(row)=='undefined'){
        return;
    }
    var flow_id = row.get("MESSAGE_ID");
    var tch_id = row.get("TCH_ID");
    if(typeof(flow_id)=='undefined'||flow_id==""){
        alert("没有找到流程ID!");
        return;
    }
    var x=(window.screen.width-780)/2;
    var y=(window.screen.height-560)/2;
    var url = "../form/index.jsp?tchId="+tch_id+"&fullscreen=yes&type=view";
    curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
}

function delNoInstanceFlowByFlowID(grid){
	
	var row = grid.getSelectionModel().getSelected();
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    if(typeof(row)=='undefined'){
        return;
    }
    var flow_id = row.get("FLOWID");
    var url = "/servlet/JtitsmFormServlet?";
   	            var paramArray = new Array();
   	            paramArray.push("tag="+14);
   	            paramArray.push("FLOW_ID="+flow_id);
   	            xmlhttp.Open("GET",url+paramArray.join("&"),false);
   	            xmlhttp.send();
   	            isOK = isSuccess(xmlhttp);
   	            if(isOK)
   	            {
   	            	var dXML = new ActiveXObject("Microsoft.XMLDOM");
   	            	dXML.load(xmlhttp.responseXML);
   	            	val = dXML.selectSingleNode("/root/value").text;
   	            	if(val=='1')
   	            		{
   	            		EMsg("删除成功！");
   	            		grid.refresh();
   	            		}
   	            	else
   	            		{
   	            		EMsg("删除失败！");
   	            		}
   	            }
   	        
   	      
   	  else{
   	  	  EMsg("删除失败，返回的XML错误");
   	  }
}