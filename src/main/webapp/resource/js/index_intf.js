/*
      ��ҳά����ҵ��֪ʶ��js�ӿڷ���
      zhengqch
*/


// ��ѯ֪ʶ�����·���
function queryKnowledges(){    
   var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var ret = []
    xmlhttp.Open("GET", "/servlet/KnowledgeManager?tag=35", false);
    xmlhttp.send();
    if (isSuccess(xmlhttp)){
        var dXML = new ActiveXObject("Microsoft.XMLDOM");
        dXML.load(xmlhttp.responseXML);
        var element = dXML.selectSingleNode("/root/rowSet");
        while (element != null) {
            // ��ȡ����Ԫ�����Ӧֵ
            var childs = element.childNodes;
            var obj = {};
            for (var i = 0; i < childs.length; i++) {
                var e = childs[i];
                var toel = 'obj.' + e.nodeName + '="' + e.text + '"';
                toel = toel.replace(/\n/g, '<br/>');
                try{
                    eval(toel)
                }catch(ex){
                    // �쳣, ��ֵ���õ���������
                    var errKey = "err" + i
                    obj[errKey] = e.text
                }
            }
            ret.push(obj)
            element = element.nextSibling;
        } 
    }
    
    // ����
    map(ret, function(e){
        var tp = '/workshop/knowledge/knowledgeRead.html?kId=$KID&state=4SA&configName=KNOWLEDGES&IS_PRI_UPDATE=true&IS_PRI_DELETE=true&IS_PRI_AUDIT=true&IS_PRI_STORAGE=true'
        e.LINK = tp.replace(/\$KID/g, e.KNOWLEDGE_ID)
    })
    return ret
}
 

// ����ȡֵӳ�亯��
function map(arr, func){
       var ret = []
      for(var i=0;i<arr.length; i++){
          ret.push(func(arr[i]))
      }
      return ret
}


/* ��ѯ���ո���ά����ҵ����
 * �����ݷ��ؿ��ַ���''
*/
function queryJobs(){
    var jobData  = getJobs(cur_StaffId)
    if(jobData.length == 0  ){
        return ''
    }
    return jobData;// jobs;
}


//ά����ҵ����
function getJobs(staffId){
    var url = "/servlet/tempJobServlet?action=1&STAFF_ID="+staffId;//+'&CUR_DATE='+curDate
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var retVal = []
    xmlhttp.Open("GET", url, false);
    xmlhttp.send();//sendXML);
    if (!isSuccess(xmlhttp))
        return
    var dXML = new ActiveXObject("Microsoft.XMLDOM");
    dXML.load(xmlhttp.responseXML);
    var element = dXML.selectSingleNode("/root/rowSet");
    while (element != null) {
        // ��ȡ����Ԫ�����Ӧֵ
        var childs = element.childNodes
        var obj = {}
        for (var i = 0; i < childs.length; i++) {
            var e = childs[i]
            var toel = 'obj.' + e.nodeName + '="' + e.text + '"';
            toel = toel.replace(/\n/g, '<br/>')
            try{
                eval(toel)
            }catch(ex){ 
                // �쳣, ��ֵ���õ���������
                var errKey = "err" + i
                obj[errKey] = e.text
            }
        }
        retVal.push(obj)
        element = element.nextSibling;
    }
    return retVal
}
