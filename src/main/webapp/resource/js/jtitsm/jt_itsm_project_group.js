document.write("<script language='javascript' src='/resource/js/ChoiceDialog.js' ></script>");
document.write("<script language='javascript' src='/resource/js/Common.js' ></script>");
function addGroupStaff(grid) {
	var rootOrgId=getCurrentStaffOrg();
	var currentRegionId=getCurrentUserInfo("region_id");
	if(rootOrgId=='0'||rootOrgId=='82'||rootOrgId=='325'){
		rootOrgId="";
	}else{
		var pRoot=queryAllData("SELECT o.org_id FROM ORGANIZATION o WHERE o.org_name IN(SELECT m.region_name||'-֧�ų���' FROM  Manage_Region m WHERE m.region_id="+currentRegionId+")");
		rootOrgId=pRoot[0].ORG_ID;
	}
	var oReturnStaff = choiceStaff(true, rootOrgId, null, false, null, null, null, true);
	if (oReturnStaff != null) {
		var vurl = '../../../../servlet/projectGroupServlet?&groupId=1364'+'&staffIds=' + oReturnStaff.id+'&tag=41&pos=4';
		var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		oXMLHTTP.onreadystatechange = function(){	//�첽
		if(oXMLHTTP.readyState==4){		//��ȡ��������Ӧ����
		    if(oXMLHTTP.status==200){	// ����˷�������ȷ����
		      	alert('��Ա��ӳɹ�');
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
		alert("�鳤������ɾ����");
		return;
	}
	if(row.length>1){
		alert("��ѡ��һ��Ҫɾ���ļ�¼");
		return;
	}
	if(row){
		regionId=row.get("REGION_ID");
		if(",9,0,-1,1,".indexOf(","+currentRegionId+",")<0){
			if(",0,-1,1,9,0,".indexOf(","+regionId+",")>0){
				alert("������Ա������ɾ����");
				return;
			}
		}
		if(!confirm('ȷ��Ҫ�� '+row.get("STAFF_NAME") +' ����Ŀ����ɾ��?'))return;
		var vurl = '../../../../servlet/projectGroupServlet?&groupId=1364'+'&staffId=' + row.get("STAFF_ID")+'&tag=42';
		var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		oXMLHTTP.onreadystatechange = function(){	//�첽
		if(oXMLHTTP.readyState==4){		//��ȡ��������Ӧ����
		    if(oXMLHTTP.status==200){	// ����˷�������ȷ����
		      	alert('��Աɾ���ɹ�')
		      	if(grid){
					grid.store.reload();
				}
		    }
		}
	}
	oXMLHTTP.open("GET",vurl,true);
	oXMLHTTP.send();
	}else{
		alert("��ѡ��һ����¼��");
	}
}
//���ó���ͨ��Ա
function setGroupStaffPT(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row.length>1){
		alert("��ѡ��һ���޸ĵļ�¼");
		return;
	}
	var regionId=row.get("REGION_ID");
	if(",0,-1,1,9,0,".indexOf(","+regionId+",")>0){
		alert("���޸ı�ʡ��Ա��Ϣ��");
		return;
	}
	var url = "../../../../servlet/projectGroupServlet?";
	var staffId = row.get("STAFF_ID");
    var vurl = url + '&groupId=1364';
    vurl += '&staffId=' + staffId+'&pos=4&tag=43';
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		oXMLHTTP.onreadystatechange = function(){	//�첽
		if(oXMLHTTP.readyState==4){		//��ȡ��������Ӧ����
		    if(oXMLHTTP.status==200){	// ����˷�������ȷ����
		      	alert('ְλ���óɹ�');
		      	if(grid){
					grid.store.reload();
				}
		    }
		}
	}
	oXMLHTTP.open("GET",vurl,true);
	oXMLHTTP.send();
}
//���óɽӿ���
function setGroupStaffJKR(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row.length>1){
		alert("��ѡ��һ���޸ĵļ�¼");
		return;
	}
	var regionId=row.get("REGION_ID");
	if(",0,-1,1,9,0,".indexOf(","+regionId+",")>0){
		alert("���޸ı�ʡ��Ա��Ϣ��");
		return;
	}
	var url = "../../../../servlet/projectGroupServlet?";
	var staffId = row.get("STAFF_ID");
    var vurl = url + '&groupId=1364';
     vurl += '&staffId=' + staffId+'&pos=41&tag=43';
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		oXMLHTTP.onreadystatechange = function(){	//�첽
		if(oXMLHTTP.readyState==4){		//��ȡ��������Ӧ����
		    if(oXMLHTTP.status==200){	// ����˷�������ȷ����
		      	alert('ְλ���óɹ�');
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
		alert("��ѡ��һ���޸ĵļ�¼");
		return;
	}
	regionId=row.get("REGION_ID");
	if(",0,-1,1,9,0,".indexOf(","+regionId+",")>0){
		alert("���޸ı�ʡ��Ա��Ϣ��");
		return;
	}
	var staffId = row.get("STAFF_ID");
    var bsql = 'select a.ORG_NAME from staff b, organization  a where a.org_id=b.org_id and b.staff_id='+staffId
    var orgName = queryAllData(bsql)[0].ORG_NAME;
    params = new Array(1,staffId,orgName,'0', true);
    var retVal=window.showModalDialog("/workshop/user/staffinfo.jsp",window,"dialogWidth=500px;dialogHeight=566px;help=0;scroll=0;status=0;");
    if(retVal){
	    alert('��Ա�޸ĳɹ�');
		if(grid){
			grid.store.reload();
		}
	}
}