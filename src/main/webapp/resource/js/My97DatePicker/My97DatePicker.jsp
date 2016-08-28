<%@ page language="java" import="java.util.*" pageEncoding="GBK"%>
<%@ page import="com.bsnnms.bean.common.resource.ResourceLoader"%>
<html>
<head>
<meta http-equiv="content-type" content="text/xml; charset=utf-8" />
<title>My97DatePicker</title>
</head>
<body leftmargin="0" topmargin="0" onload="$c.autoSize()" tabindex=0>
</body>
</html>
<script src='<%=ResourceLoader.buildSrc("/resource/js/My97DatePicker/config.js")%>'></script>
<script>
if(parent==window)
	location.href = 'http://www.my97.net';
var $d, $dp, $pdp = parent.$dp, $dt, $tdt, $sdt, $IE=$pdp.ie, $FF = $pdp.ff,$OPERA=$pdp.opera, $ny, $cMark = false;
if ($pdp.eCont) {
	$dp = {};
	for (var p in $pdp) {
		$dp[p] = $pdp[p];
	}
}
else
	$dp = $pdp;
	
$dp.getLangIndex = function(name){
	var arr = langList;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].name == name) {
			return i;
		}
	}
	return -1;
}

$dp.getLang = function(name){
	var index = $dp.getLangIndex(name);
	if (index == -1) {
		index = 0;
	}
	return langList[index];
}
 
$dp.realLang = $dp.getLang($dp.lang);
document.write("<script src='lang/v@1_" + $dp.realLang.name + ".js' charset='" + $dp.realLang.charset + "'><\/script>");

for (var i = 0; i < skinList.length; i++) {
    document.write('<link rel="stylesheet" type="text/css" href="skin/' + skinList[i].name + '/v@1_datepicker.css" title="' + skinList[i].name + '" charset="' + skinList[i].charset + '" disabled="true"/>');
}
</script>
<script src='<%=ResourceLoader.buildSrc("/resource/js/My97DatePicker/calendar.js")%>'></script>
<script>new My97DP();</script>