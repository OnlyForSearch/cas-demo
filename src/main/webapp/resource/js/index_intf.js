/*
      首页维护作业，知识库js接口方法
      zhengqch
*/


// 查询知识库最新发布
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
            // 读取所有元素与对应值
            var childs = element.childNodes;
            var obj = {};
            for (var i = 0; i < childs.length; i++) {
                var e = childs[i];
                var toel = 'obj.' + e.nodeName + '="' + e.text + '"';
                toel = toel.replace(/\n/g, '<br/>');
                try{
                    eval(toel)
                }catch(ex){
                    // 异常, 将值设置到备用属性
                    var errKey = "err" + i
                    obj[errKey] = e.text
                }
            }
            ret.push(obj)
            element = element.nextSibling;
        } 
    }
    
    // 连接
    map(ret, function(e){
        var tp = '/workshop/knowledge/knowledgeRead.html?kId=$KID&state=4SA&configName=KNOWLEDGES&IS_PRI_UPDATE=true&IS_PRI_DELETE=true&IS_PRI_AUDIT=true&IS_PRI_STORAGE=true'
        e.LINK = tp.replace(/\$KID/g, e.KNOWLEDGE_ID)
    })
    return ret
}
 

// 数组取值映射函数
function map(arr, func){
       var ret = []
      for(var i=0;i<arr.length; i++){
          ret.push(func(arr[i]))
      }
      return ret
}


/* 查询今日个人维护作业待办
 * 无数据返回空字符串''
*/
function queryJobs(){
    var jobData  = getJobs(cur_StaffId)
    if(jobData.length == 0  ){
        return ''
    }
    return jobData;// jobs;
}


//维护作业待办
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
        // 读取所有元素与对应值
        var childs = element.childNodes
        var obj = {}
        for (var i = 0; i < childs.length; i++) {
            var e = childs[i]
            var toel = 'obj.' + e.nodeName + '="' + e.text + '"';
            toel = toel.replace(/\n/g, '<br/>')
            try{
                eval(toel)
            }catch(ex){ 
                // 异常, 将值设置到备用属性
                var errKey = "err" + i
                obj[errKey] = e.text
            }
        }
        retVal.push(obj)
        element = element.nextSibling;
    }
    return retVal
}
