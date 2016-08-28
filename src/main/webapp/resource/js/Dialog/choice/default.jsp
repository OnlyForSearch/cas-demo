<%@ page language="java" contentType="text/html; charset=gb18030"%>
<%@ page import="com.bsnnms.bean.common.propertyCfg.PropertyConfig"%>
<%@ page import="com.bsnnms.bean.common.resource.ResourceLoader"%> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb18030">
<title>选择框</title>
<link rel="stylesheet" type="text/css" href="../../ext/resources/css/ext-all-notheme.css" />
<link rel="stylesheet" type="text/css" href="../../../css/default.css" />
<link rel="stylesheet" type="text/css" href="default.css" />
<script src="../../ext/adapter/ext/ext-base.js"></script>
<script src="../../ext/ext-all.js"></script>
<script src="../../Common.js"></script>
<SCRIPT src="../../Dialog.js"></SCRIPT>
<SCRIPT src="../../Error.js"></SCRIPT>
<SCRIPT src="../../XMLTree/XMLTree.js"></SCRIPT>
<SCRIPT src="../../XMLTree/XMLTreeAction.js"></SCRIPT>
<script type="text/javascript" src="<%=ResourceLoader.buildSrc("/resource/js/Dialog/choice/default.js")%>"></script> 
<script>
	var projectLabel = "<%=PropertyConfig.getValue("PROJECT_LABEL")%>";
</script>
</head>
<body onload="iniPage()">
	<div class="maskCss" id="maskDivId">
			<div >
				<input type="text" style="width:150px;">				
			</div>
			<div>
				<span style="color:#fff;">aaa</span>
				<span style="color:#fff;">aaa</span>
			</div>
		</div>
</body>
</html>