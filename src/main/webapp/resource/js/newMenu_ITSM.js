/** **************************************************************************************************************************** *
 ** ********************************************      �������˵�   ������͸������  **************************************** *
 ** **************************************************************************************************************************** */
var isIe=(document.all)?true:false; 
/*��������������*/
function testMessageBox(privilegeId){
    var curPriId = privilegeId;
    //���ڶ�λ
    var objPos = winPosition();    
    //������
    showMessageBox(objPos); 
    //չʾһ���˵�
    showOneLevelIco(curPriId);
} 

//���ڶ�λλ��
function winPosition(){ 
    return {x:188, y:80};
} 

//�������� 
function showMessageBox(pos){
    closeWindow();  
    //��������bgDiv
    var bgDiv=document.createElement("div"); 
    bgDiv.id="bgDiv"; 
    var styleStr="width:100%;height:100%;position:absolute; top: 0px; left: 0px; right: 0px;background: #FCFCFC;filter:alpha(opacity=0);";
    bgDiv.style.cssText=styleStr; 
    document.body.appendChild(bgDiv); 
    showBackground(bgDiv,50); 
    
    //��ʾ�Ĵ���
    var menuW=document.createElement("div"); 
    menuW.id="menuWindow"; 
    menuW.className="menuWindow"; 
    menuW.innerHTML="<div id='menuWinTop' class='menuWindowTop' onmousedown='moveWin(event)'>"+//�˵���
                    "   <div class='backHome' title='�ر�' onClick='closeWindow();' onmousemove='this.className=\"backHome_on\";' onmouseout='this.className=\"backHome\"'>" +
                    "       <a class='backHomeIco'></a></div>"+                
                    //"       <div class='mainMenuTo'></div>"+
                    //"       <div class='backHome' title='�ر�' onClick='closeWindow();' onmousemove='this.className=\"backHome_on\";' onmouseout='this.className=\"backHome\"'>" +
                    //"              <a class='backHomeIco'></a></div>"+
                    //"       <div class='mainMenuMid'></div> "+
                    "</div>"+ 
                    "<div class='menuWindowContent' onmousedown='moveWin(event)' id='menuWindowContent'></div>"; 
    styleStr="left:"+pos.x+"px;top:"+pos.y+"px;";
    menuW.style.cssText=styleStr;         
    //menuW.onmousedown = moveWin();
    document.body.appendChild(menuW);  
    document.body.style.overflow = 'hidden';//ҳ�����������
} 

//�رմ��� 
function closeWindow(){
    if(document.getElementById('bgDiv')!=null){
        document.getElementById('bgDiv').parentNode.removeChild(document.getElementById('bgDiv'));
    }
    if(document.getElementById('menuWindow')!=null){
        document.getElementById('menuWindow').parentNode.removeChild(document.getElementById('menuWindow'));
    } 
    document.body.style.overflow = 'auto';//ҳ�������
    isOpen = false;//�����˵�Ĭ�Ϲر�
}  

//�ñ��������䰵 
function showBackground(obj,endInt){
    if(isIe){
        obj.filters.alpha.opacity+=10;
        if(obj.filters.alpha.opacity<endInt){
            setTimeout(function(){showBackground(obj,endInt)},5); 
        } 
    }else{
        var al=parseFloat(obj.style.opacity);al+=0.01;
        obj.style.opacity=al;
        if(al<(endInt/100)){
            setTimeout(function(){showBackground(obj,endInt)},5);
        }
    } 
} 
 
//�϶�Ч��
var IsMousedown, LEFT, TOP, S;
function moveWin(e){
	S = document.getElementById("menuWindow");
    IsMousedown = true;
	e = e||event;
	LEFT = e.clientX - parseInt(S.style.left);
	TOP = e.clientY - parseInt(S.style.top);
	document.body.onmousemove = function(e) {
        e = e||event;
        if (IsMousedown) {
            S.style.left = e.clientX - LEFT + "px";
             S.style.top = e.clientY - TOP + "px";
        }
    }
    document.onmouseup=function(){IsMousedown=false;}
}

/*******************************************************************************
 *  չʾ���õ�һ���˵�ICO
 * ******************************************************************************/
function showOneLevelIco(curPriId){
    var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
    
    xmlRequest.onreadystatechange=function(){
        if(xmlRequest.readyState==4){
            var innerHTMLone = loadOneLevelIco(xmlRequest);
            document.getElementById("menuWindowContent").innerHTML = innerHTMLone;
        }
    }
    xmlRequest.open("POST","servlet/MainPageAction?action=5&LINK_TYPE=E&privilegId="+curPriId,true);
    xmlRequest.send("");
                
}

function loadOneLevelIco(xmlRequest){
    var oneLevelMenuIcoHTML = "";
    if(isSuccess(xmlRequest)){
        var LinkIds = xmlRequest.responseXML.selectNodes("/root/rowSet");
        if(LinkIds.length <=0){
                return oneLevelMenuIcoHTML;  
        }else{
            for(var i=0;i<LinkIds.length;i++) {
                linkVal = getNodeValue(LinkIds[i],'LINK_VALUE');
                linkImg = getNodeValue(LinkIds[i],'LINK_IMG');
                linkTitle = getNodeValue(LinkIds[i],'LINK_TITLE');
                linkId = getNodeValue(LinkIds[i],'LINK_ID');
                
                oneLevelMenuIcoHTML += '<div id="'+linkId+'" onmousemove="this.className=\'oneLevelItem_on\'" onmouseout="this.className=\'oneLevelItem\';" onclick="'+linkVal+'" class="oneLevelItem">' +
                                       '    <a class="menuContent_a" style="background-image:url('+linkImg+');" > ' +
				                       '        <br style="line-height:65px;"/>'+linkTitle+
				                       '    </a></div>';
            }
        }
       return oneLevelMenuIcoHTML;
    }
}
 

/*���һ���˵� չ�������˵�*/
function clickOneLevel(obj,ev){
    //alert(obj.outerHTML);
    var newItem = obj.innerHTML;
    var newItemLeft = obj.offsetParent.offsetLeft+obj.offsetLeft;//obj.offsetLeft;

    var midDiv = document.getElementById('midDiv');
    if(isOpen){//����Ѿ�չ��
        foldANDunflod();
        midDiv.removeNode();
        return false;
    }
    var parentLinkId = obj.id;
    //alert(obj.offsetParent.offsetLeft+'||'+obj.offsetLeft+'||'+obj.offsetWidth);
    var left = newItemLeft+obj.offsetWidth;//obj.offsetLeft+obj.offsetWidth;
    var top = obj.offsetTop+35;
    var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
    
    xmlRequest.onreadystatechange=function(){
        if(xmlRequest.readyState==4){
            var innerHTMLtwo =loadTwoLevelIco(xmlRequest);
            showTwoLevelMenu(innerHTMLtwo,left,top,newItem,newItemLeft);
            foldANDunflod();
        }
    }
    
    xmlRequest.open("POST","servlet/MainPageAction?action=6&parentLinkId="+parentLinkId,false);
    xmlRequest.send("");
}

function showTwoLevelMenu(innerStr,left,top,newItem,newItemLeft){
    /**�����˵�����**/
    var wHeight=parseInt(document.getElementById('menuWindow').style.height)-25; 

    var twoLevelDiv=document.createElement("div"); 
    twoLevelDiv.id="twoLevelDiv"; 
    twoLevelDiv.className="twoLevelDiv";  
    
    twoLevelDiv.innerHTML=innerStr;
    
    styleStr="left:"+left+"px;top:"+top+"px;display:none;filter:alpha(opacity=0);"; 
    twoLevelDiv.style.cssText=styleStr;  
    document.getElementById('menuWindowContent').appendChild(twoLevelDiv);   
    //�м�����
    var midDiv=document.createElement("div"); 
    midDiv.id="midDiv"; 
    midDiv.onclick = closeMidDiv;
    midDiv.className="midDiv";  
    midDiv.innerHTML = "<div style='position:absolute;left:"+newItemLeft+"px;top:"+top+"px;z-index:4;float:left;width:109px;height:109px;font-size:13px;text-align:center;'>" + newItem + "</div>";
    document.getElementById('menuWindow').appendChild(midDiv); 
}

/**���ض����˵�**/
function loadTwoLevelIco(xmlRequest){
    var oneLevelMenuIcoHTML = "";
    if(isSuccess(xmlRequest)){
        var LinkIds = xmlRequest.responseXML.selectNodes("/root/rowSet");
        if(LinkIds.length <=0){
                return oneLevelMenuIcoHTML;  
        }else{
            for(var i=0;i<LinkIds.length;i++) {
                linkVal = getNodeValue(LinkIds[i],'LINK_VALUE');
                linkImg = getNodeValue(LinkIds[i],'LINK_IMG');
                linkTitle = getNodeValue(LinkIds[i],'LINK_TITLE');
                linkId = getNodeValue(LinkIds[i],'LINK_ID');
                if(i==0){
                    oneLevelMenuIcoHTML = '<div id="'+linkId+'" onclick="'+linkVal+'" class="twoMenuTop">' +   
		                                  '     <div class="twoMenuIco" style="background-image:url('+linkImg+');"></div>' +
		                                  '     <div class="twoMenuTitle" style="padding-top:8px;" onmousemove="this.style.backgroundColor=\'#E5E5E5\';" onmouseout="this.style.backgroundColor=\'\';">'+ linkTitle+'</div>' +
		                                  '</div>';
                }else{
                    oneLevelMenuIcoHTML += '<div id="'+linkId+'" onclick="'+linkVal+'" class="twoMenuMiddle">' +
                                           '    <div class="twoMenuIco" style="background-image:url('+linkImg+');"></div>' +
                                           '    <div class="twoMenuTitle" style="padding-top:8px;" onmousemove="this.style.backgroundColor=\'#E5E5E5\';" onmouseout="this.style.backgroundColor=\'\';">'+ linkTitle+'</div>' +
                                           '</div>';
                }
            }
           oneLevelMenuIcoHTML += "<div class='twoMenuBottom'></div>";
        }
       return oneLevelMenuIcoHTML;
    }
}


/*����չ��/����*/
var timer = 5;   //��ʱ��ʱ��
var WidthEnd = 270;//Div���
var aNum = 90;   //�����ٶ�
var isOpen = false;//��״̬ false�ر� true��
function foldANDunflod(){//չ��
    setTimeout("extend()",66);
}

//չ��/�ر�
function extend(){
    var obj = document.getElementById('twoLevelDiv');
    var tWidth = parseInt(obj.style.width);
    if(!isOpen){//����ǹرգ���չ��
        obj.style.display="block";
        if(tWidth<WidthEnd){
	       obj.style.width=(tWidth+aNum)+"px";
           obj.filters.alpha.opacity+=8;
	       setTimeout("extend()",timer);
	   }else{
	       isOpen=true;//��״̬
	       obj.filters.alpha.opacity=100;
	   }
	}else{//�����չ������ر�
	   if((tWidth-aNum)>0){
	       obj.style.width=(tWidth-aNum)+"px";
	       obj.filters.alpha.opacity-=8;
	       setTimeout("extend()",timer);
	   }else{
	       isOpen=false; //�ر�״̬
	       obj.filters.alpha.opacity=2;
           obj.innerHTML = "";
           obj.removeNode();
	   }
	}
}

/**����**/
function closeMidDiv(){
    foldANDunflod();
    var midDiv = document.getElementById('midDiv');
    midDiv.innerHTML = "";
    midDiv.removeNode();
}

/*��� �����˵�*/
function clickTwoLevel(){
    alert('TwoLevel');
}

//������������DIV 
function showSwitchDiv(){
    closeWindow2();  
    var pos = {x:450,y:180};
    //��������bgDiv
    var switchDiv=document.createElement("div"); 
    switchDiv.id="switchDiv"; 
    var styleStr="width:100%;height:100%;position:absolute; top: 0px; left: 0px; right: 0px;background: #FCFCFC;filter:alpha(opacity=0);";
    switchDiv.style.cssText=styleStr; 
    document.body.appendChild(switchDiv); 
    showBackground(switchDiv,50); 
    var testSty = 'width:100%;float: left;font-size: 14px;color: #125899;font-family: "arial", "����";font-weight: bold;line-height: 20px;' +
    		'padding: 0px 3px 0px 0px;margin: 0px;text-align: center;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;cursor:hand;';
    //��ʾ�Ĵ���
    var switchWin=document.createElement("div"); 
    switchWin.id="switchWin";  
    switchWin.innerHTML="   <div style='z-index:11; margin:2 0 0 0; height:24px; width:24px; cursor:pointer;float: right;' title='�ر�' " +
    		"onClick='closeWindow2(\"switchDiv\",\"switchWin\");' " +
    		 " <a style='height: 24px;width: 24px;float:right;background-position:top;background-repeat:no-repeat;" +
                    "background-image:url(/resource/image/newMenuIco/delete_1.png);'></a></div>"+   
                    "<table style='width:90%;align:center' border='0'><tr height='30px'><td>&nbsp;</td></tr><tr>" +
                    "<td width='40px'>&nbsp;</td>"+
                    "<td align='center'><img src='/resource/image/jtitsmImages/host.png' title='�½����������������' style='cursor:hand;width:80px' " +
                    "onClick='openitFlow(\"11325\");'/></td>" +
                    "<td align='center'><img src='/resource/image/jtitsmImages/database.png' title='�½����ݿ�����������' style='cursor:hand;width:72px' " +
                    "onClick='openitFlow(\"11324\");'/></td>" +
                    "<td align='center'><img src='/resource/image/jtitsmImages/network.png' title='�½���������������' style='cursor:hand;width:80px' " +
                    "onClick='openitFlow(\"11229\");'/></td>" +
                    "<td align='center'><img src='/resource/image/jtitsmImages/vpn.png' title='�½�VPN�����������' style='cursor:hand;width:80px' " +
                    "onClick='openitFlow(\"11223\");'/></td>" +
                    "</tr><tr>"+
                    "<td width='40px' height='20px'>&nbsp;</td>"+
                    "<td align='center'><label style='"+testSty+"' title='�½����������������' onClick='openitFlow(\"11325\");'><b>����</b></label></td>" +
                    "<td align='center'><label style='"+testSty+"' title='�½����ݿ�����������' onClick='openitFlow(\"11324\");'><b>���ݿ�</b></label></td>" +
                    "<td align='center'><label style='"+testSty+"' title='�½���������������' onClick='openitFlow(\"11229\");'><b>����</b></label></td>" +
                    "<td align='center'><label style='"+testSty+"' title='�½�VPN�����������' onClick='openitFlow(\"11223\");'><b>VPN</b></label></td>" +
                    "</tr></table>"+
                    "</div>"; 
    styleStr="z-index: 10;position: absolute;width: 480px;height: 160px;background-color: #DDEEFE;background-position: top;" +
    		"background-repeat: no-repeat;filter: alpha(opacity = 80);left:"+pos.x+"px;top:"+pos.y+"px;";
    switchWin.style.cssText=styleStr;         
    document.body.appendChild(switchWin);  
    document.body.style.overflow = 'hidden';//ҳ�����������
} 

/**
 * �رյ���DIV
 * @param {} div
 * @param {} win
 */
function closeWindow2(div,win){
    if(document.getElementById(div)!=null){
        document.getElementById(div).parentNode.removeChild(document.getElementById(div));
    }
    if(document.getElementById(win)!=null){
        document.getElementById(win).parentNode.removeChild(document.getElementById(win));
    } 
    document.body.style.overflow = 'auto';//ҳ�������
    isOpen = false;//�����˵�Ĭ�Ϲر�
}  

/**
 * ������
 * @param {} flowNum
 */
function openitFlow(flowNum){
	var sql = "select t.flow_mod text from flow_model t where t.flow_num ='" + flowNum + "'";
	var flowMod = queryData(sql);
	if(flowMod){
		closeWindow2('switchDiv','switchWin');
		window.open("/workshop/form/index.jsp?flowMod="+flowMod);
	}
}