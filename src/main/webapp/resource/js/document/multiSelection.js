var isEdit=false;//�����޸�״̬�����ܽ���"����"��"����"����
//1. "���"�ؼ���
function doAdd(oText, iLen)
{
    var keywordValue = oText.value.trimall();
    if(keywordValue=="") return;
    if(iLen!=null)
    {
        var arr=keywordValue.match(/[^\x00-\xff]/ig);
        if((keywordValue.length+(arr==null?0:arr.length))>parseInt(iLen))
        {
            EMsg("���Ȳ��ܴ���"+iLen+"���ַ�!");
            return;
        }
    }
    var oOption=document.createElement("OPTION");
    oOption.text=keywordValue;
    document.getElementById("keyword").add(oOption);
    oText.value="";
    oText.focus();
}
function doKeyDown(oText, oUpdate, iLen)
{
    var enterKey=13;
    if(event.keyCode==enterKey){
        if(isEdit){
            doUpdate(oText, oUpdate, iLen);
        }else{
            doAdd(oText, iLen);
        }
    }
}

//2. "����"����
function doUp(keyword)
{
    var iIndex=keyword.selectedIndex;
    if(isEdit) return;
    if(iIndex==-1 || iIndex==0) return;
    
    var oOption=keyword.options(iIndex);
    var oSwapOption=keyword.options(iIndex-1);
    oOption.swapNode(oSwapOption);
}

//3. "����"����
function doDown(keyword)
{
    var iIndex=keyword.selectedIndex;
    var iLen=keyword.length;
    if(isEdit) return;
    if(iIndex==-1 || iIndex==iLen-1) return;
    
    var oOption=keyword.options(iIndex);
    var oSwapOption=keyword.options(iIndex+1);
    oOption.swapNode(oSwapOption);
}

//7. "ɾ��"����
function doDel(keyword)
{
    var iLen=keyword.length;
    if(isEdit) return;
    for(var i=iLen-1;i>=0;i--)
    {
        var oOption=keyword.options(i);
        if(oOption.selected==true)
           keyword.options.remove(i);
    }
    keyword.selectedIndex=0;
}

//8. "�༭"����
function doEdit(keyword,oText)
{
    isEdit=true;
    var iIndex=keyword.selectedIndex;
    if(iIndex==-1) return;
    
    oText.value=keyword.options(iIndex).text;
    oUpdate.updateIndex=iIndex;
    oAdd.style.display="none";
    oUpdate.style.display="block";
}

//9. "����"����
function doUpdate(oText,oUpdate, iLen)
{
    var keywordValue = oText.value.trimall();
    if(keywordValue=="") return;
    var iIndex=parseInt(oUpdate.updateIndex);
    if(iIndex==-1) return;
    
    if(iLen!=null)
    {
        var arr=keywordValue.match(/[^\x00-\xff]/ig);
        if((keywordValue.length+(arr==null?0:arr.length))>parseInt(iLen))
        {
            EMsg("���Ȳ��ܴ���"+iLen+"���ַ�!");
            return;
        }
    }
    
    document.getElementById("keyword").options(iIndex).text=oText.value;
    //keyword.options(iIndex).selected=true;
    document.getElementById("keyword").selectedIndex=iIndex;
    
    oAdd.style.display="block";
    oUpdate.style.display="none";
    isEdit=false;
    oUpdate.updateIndex="-1";
    oText.value="";
    oText.focus();
}