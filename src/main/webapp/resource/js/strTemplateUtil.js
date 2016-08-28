/**
 * 文本替换工具, 调用方式：templateUtil.getStr(文本模板, 文本值对象/对象列表)
 * e.g. 
 *	templateUtil.getStr('aaaa:{b} bbbbb:{c.d} yourname:{c.name} notExistParam:[{c.n}]', {b:1, c: {d: 2, name: '名字'}})
 *	结果值：aaaa:1 bbbbb:2 yourname:名字 notExistParam:[]
 *
 *	templateUtil.getStr('参数:{b} ', [{b:1}, {b:2}])
 *	结果值：参数:1 参数:2
 */
var templateUtil = (function() {
    var PATTERN = /\{[^\{]+?\}/g;
    var _templateParams = {},
        _templateArr = {};
    
    function initTemplateInfo(template) {
        if (_templateParams[template] != null)
            return;
        
        var result, 
            arr = [], 
            EMPTY = '';
        
        var paramMap = {}, key = '';
        var begin = 0, end = 0, lastPos = 0;
        
        while((result = PATTERN.exec(template)) != null) {
            begin = result.index;
            end = PATTERN.lastIndex;
            
            if (lastPos < begin) {
                arr.push(template.substring(lastPos, begin));
            }
            
            key = result[0].substring(1, result[0].length - 1);
            var values = paramMap[key] || [];
            values.push(arr.length);
            paramMap[key] = values;
            
            arr.push(EMPTY);    
        
            lastPos = end;
        }
        if (end != template.length)
        arr.push(template.substr(end));
        
        _templateParams[template] = paramMap;
        _templateArr[template] = arr;
    }
    
    function isArray(obj) {
        return (obj.constructor == Array);
    }
       
    return {
        getStr : function(template, valueObjs) {
			if (template == null)
				return '';

            initTemplateInfo(template);
            
            var arr = _templateArr[template];
            var paramMap = _templateParams[template];
            
            var objArr = valueObjs;
            if (!isArray(valueObjs))
                objArr = [valueObjs];
            
            var result = '';
            for (var i = 0; i < objArr.length; i++) {
                for (var name in paramMap) {
                    var v = null;
                    try {
                        v = eval('objArr[i]' + '.' + name);
                    } catch(e) {
                    }
                    
                    if (v == null)
                        v = '';
                    
                    var indexs = paramMap[name];
                    for (var j = 0; j < indexs.length; j++) {
                        arr[indexs[j]] = v;
                    }
                }
                
                result += arr.join('');
            }
            
            return result;
        }    
    }
})();
