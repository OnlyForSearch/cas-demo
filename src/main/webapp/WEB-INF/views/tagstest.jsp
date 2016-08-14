<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%><!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!--1.要使用Spring MVC提供的表单标签，首先需要在视图页面添加：  -->
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%><html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>（11） 之 表单标签</title>
</head>
<body>

	<pre> 2.form标签：modelAttribute属性指定该form绑定的是哪个Model，当指定了对应的Model后就可以在form标签内部其它表单标签上通过为path指定Model属性的名称来绑定Model中的数据了，method属性指定form的提交方式如GET、POST等。</pre>
	<form:form modelAttribute="contentModel" method="post">

		<pre>3.input标签:会生成一个type为text的Html input标签，通过path属性来指定要绑定的Model中的值。 </pre>
        input 标签：<form:input path="username" />
		<br />
		<pre>4.password标签：会生成一个type为password的Html input标签，通过path属性来指定要绑定的Model中的值。</pre>
        password 标签：<form:password path="password" />
		<br />

		<pre>5.checkbox标签：会生成一个type为checkbox的Html input标签，支持绑定boolean、数组、List或Set类型的数据。

绑定boolean数据会生成一个复选框，当boolean为true该复选框为选定状态，false为不选定状态。</pre>
        绑定boolean的checkbox 标签：<br />
		<form:checkbox path="testBoolean" />
		<br />

		<pre>5.checkbox标签：绑定数组、List或Set类型的数据（以数组作为演示）如果绑定的数据中有对应checkbox指定的value时则为选定状态，反之为不选定状态：</pre>
        绑定Array的checkbox 标签：<br />
		<form:checkbox path="testArray" value="arrayItem 路人甲" />arrayItem 路人甲        <form:checkbox
			path="testArray" value="arrayItem 路人乙" />arrayItem 路人乙        <form:checkbox
			path="testArray" value="arrayItem 路人丙" />arrayItem 路人丙        <form:checkbox
			path="testArray" value="arrayItem 路人丁" />arrayItem 路人丁<br />
        绑定Array的checkboxs 标签：<br />
		<form:checkboxes path="selectArray" items="${contentModel.testArray}" />
		<br />
        绑定Map的checkboxs 标签：<br />
		<form:checkboxes path="selectIds" items="${contentModel.testMap}" />
		<br />


		<pre>8.radiobuttons标签：会根据绑定的items数据生成一组对应的type为radio的Html input标签，绑定的items数据可以是数组、集合或Map，其中radiobuttons的path属性也必指定，当path的值和items中的某条数据值相同的时候对应的radio为选定状态，反之为不选定状态，用法和checkboxs很相似。但要注意的是：checkboxs的path绑定的是集合radiobuttons的path绑定的是单个值：</pre>
        绑定Integer的radiobutton 标签：<br />
		<form:radiobutton path="radiobuttonId" value="0" />0     
		   <form:radiobutton path="radiobuttonId" value="1" />1        
			<form:radiobutton path="radiobuttonId" value="2" />2<br />
        绑定Map的radiobuttons 标签：<br />
		<form:radiobuttons path="selectId" items="${contentModel.testMap}" />
		<br />

		<pre>9.select标签：会生成一个Html select标签，绑定的items数据可以是数组、集合或Map会根据items的内容生成select里面的option选项，当path的值和items中的某条数据值相同的时候对应的option为选定状态，反之为不选定状态，用法与radiobuttons很相似：</pre>
        绑定Map的select 标签：<br />
		<form:select path="selectId" items="${contentModel.testMap}" />
		<!-- 上面的是根据指定的items自动生成的option选项，但我们也可以不指定items手动添加select的option选项 -->
		<br />
        不绑定items数据直接在form:option添加的select 标签：<br />
		<form:select path="selectId">
			<option>请选择人员</option>
			<!-- 其中添加<option>请选择人员</option> 可以让在没有进行选择的情况下不指定任何默认值。 -->
			<form:option value="1">路人甲</form:option>
			<form:option value="2">路人乙</form:option>
			<form:option value="3">路人丙</form:option>
		</form:select>
		<br />
		<br />
		
        不绑定items数据直接在html的option添加的select 标签：<br />
		<form:select path="selectId">
			<option>请选择人员</option>
			<option value="1">路人甲</option>
			<option value="2">路人乙</option>
			<option value="3">路人丙</option>
		</form:select>
		<br />
        用form:option绑定items的select 标签：<br />
		<form:select path="selectId">
			<option />请选择人员            <form:options
				items="${contentModel.testMap}" />
		</form:select>
		
		
		<pre>form:option 正确选择了path中指定的selectId而option没有，说明form:option有数据绑定功能option没有。

另外我们也可以不为select指定items，而把items指定到form:option 上这两种效果基本是一样的，一点区别就是为select指定items再在select里面添加option是不起作用的会被items生成的option覆盖掉，而把items指定到form:option 上则可以再在select里面添加option：
	</pre>	<hr />

		<br />
        textarea 标签：        <form:textarea path="remark" />
		<br />

		<input type="submit" value="Submit" />

	</form:form>
</body>
</html>