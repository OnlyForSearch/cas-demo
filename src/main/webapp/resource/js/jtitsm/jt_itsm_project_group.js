document.write("<script language='javascript' src='/resource/js/ChoiceDialog.js' ></script>");
document.write("<script language='javascript' src='/resource/js/Common.js' ></script>");
function addGroupStaff(grid) {
	var rootOrgId=getCurrentStaffOrg();
	var currentRegionId=getCurrentUserInfo("region_id");
	if(rootOrgId=='0'||rootOrgId=='82'||rootOrgId=='325'){
		rootOrgId="";
	}else{
		var pRoot=queryAllData("SELECT o.org_id FROM ORGANIZATION o WHERE o.org_name IN(SELECT m.region_name||'-支撑厂商' FROM  Manage_Region m WHERE m.region_id="+currentRegionId+")");
		rootOrgId=pRoot[0].ORG_ID;
	}
	var oReturnStaff = choiceStaff(true, rootOrgId, null, false, null, null, null, true);
	if (oReturnStaff != null) {
		var vurl = '../../../../servlet/projectGroupServlet?&groupId=1364'+'&staffIds=' + oReturnStaff.id+'&tag=41&pos=4';
		var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		oXMLHTTP.onreadystatechange = function(){	//异步
		if(oXMLHTTP.readyState==4){		//读取服务器响应结束
		    if(oXMLHTTP.status==200){	// 服务端返回了正确数据
		      	alert('组员添加成功');
		      	if(grid){
					grid.store.reload();
				}
		    }
		}
	}
	oXMLHTTP.open("GET",vurl,true);
	oXMLHTTP.send();
	}
}

function deleteGroupStaff(grid) {
	var row = grid.getSelectionModel().getSelected();
	var currentRegionId=getCurrentUserInfo("region_id");
	var regionId;
	if(row.get("LIST_VALUE")=='1'){
		alert("组长不允许被删除！");
		return;
	}
	if(row.length>1){
		alert("请选择一条要删除的记录");
		return;
	}
	if(row){
		regionId=row.get("REGION_ID");
		if(",9,0,-1,1,".indexOf(","+currentRegionId+",")<0){
			if(",0,-1,1,9,0,".indexOf(","+regionId+",")>0){
				alert("集团人员不允许被删除！");
				return;
			}
		}
		if(!confirm('确定要将 '+row.get("STAFF_NAME") +' 从项目组中删除?'))return;
		var vurl = '../../../../servlet/projectGroupServlet?&groupId=1364'+'&staffId=' + row.get("STAFF_ID")+'&tag=42';
		var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		oXMLHTTP.onreadystatechange = function(){	//异步
		if(oXMLHTTP.readyState==4){		//读取服务器响应结束
		    if(oXMLHTTP.status==200){	// 服务端返回了正确数据
		      	alert('组员删除成功')
		      	if(grid){
					grid.store.reload();
				}
		    }
		}
	}
	oXMLHTTP.open("GET",vurl,true);
	oXMLHTTP.send();
	}else{
		alert("请选择一条记录！");
	}
}
//设置成普通组员
function setGroupStaffPT(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row.length>1){
		alert("请选择一条修改的记录");
		return;
	}
	var regionId=row.get("REGION_ID");
	if(",0,-1,1,9,0,".indexOf(","+regionId+",")>0){
		alert("请修改本省人员信息！");
		return;
	}
	var url = "../../../../servlet/projectGroupServlet?";
	var staffId = row.get("STAFF_ID");
    var vurl = url + '&groupId=1364';
    vurl += '&staffId=' + staffId+'&pos=4&tag=43';
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		oXMLHTTP.onreadystatechange = function(){	//异步
		if(oXMLHTTP.readyState==4){		//读取服务器响应结束
		    if(oXMLHTTP.status==200){	// 服务端返回了正确数据
		      	alert('职位设置成功');
		      	if(grid){
					grid.store.reload();
				}
		    }
		}
	}
	oXMLHTTP.open("GET",vurl,true);
	oXMLHTTP.send();
}
//设置成接口人
function setGroupStaffJKR(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row.length>1){
		alert("请选择一条修改的记录");
		return;
	}
	var regionId=row.get("REGION_ID");
	if(",0,-1,1,9,0,".indexOf(","+regionId+",")>0){
		alert("请修改本省人员信息！");
		return;
	}
	var url = "../../../../servlet/projectGroupServlet?";
	var staffId = row.get("STAFF_ID");
    var vurl = url + '&groupId=1364';
     vurl += '&staffId=' + staffId+'&pos=41&tag=43';
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		oXMLHTTP.onreadystatechange = function(){	//异步
		if(oXMLHTTP.readyState==4){		//读取服务器响应结束
		    if(oXMLHTTP.status==200){	// 服务端返回了正确数据
		      	alert('职位设置成功');
		      	if(grid){
					grid.store.reload();
				}
		    }
		}
	}
	oXMLHTTP.open("GET",vurl,true);
	oXMLHTTP.send();
    
}
function editUser(grid){
    var row = grid.getSelectionModel().getSelected();
    var regionId;
    if(row.length>1){
		alert("请选择一条修改的记录");
		return;
	}
	regionId=row.get("REGION_ID");
	if(",0,-1,1,9,0,".indexOf(","+regionId+",")>0){
		alert("请修改本省人员信息！");
		return;
	}
	var staffId = row.get("STAFF_ID");
    var bsql = 'select a.ORG_NAME from staff b, organization  a where a.org_id=b.org_id and b.staff_id='+staffId
    var orgName = queryAllData(bsql)[0].ORG_NAME;
    params = new Array(1,staffId,orgName,'0', true);
    var retVal=window.showModalDialog("/workshop/user/staffinfo.jsp",window,"dialogWidth=500px;dialogHeight=566px;help=0;scroll=0;status=0;");
    if(retVal){
	    alert('人员修改成功');
		if(grid){
			grid.store.reload();
		}
	}
}