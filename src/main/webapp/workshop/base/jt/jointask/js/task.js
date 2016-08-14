
$("document").ready(function(){
	
	TaskForm.init();
	TaskJob.init();
	
	$("body").on("click", function(event){
		TaskJob.cases.addCase(event);
	});
	
	
});

/**
 * 全局变量
 */
var MyGlobal = {
		
	isBulidRelate: { isSelect:false, isBulid: false, isSave: false},	//是否建立了省间联调关系
	
	isAddCase : 0,	//是否新增了case案例填写框	
	
	isPublic: 0, 	//是否发布任务  0:编辑状态；1:保存状态；2:任务发布状态
	 	
};


/**
 * 表单内容
 * 注意事项：
 * 1.联调确认人可以选择多个
 * 2.
 */
var TaskForm = {
	
	check:function() {
		if($("#task-name").val() == "") {
			alert("请填写联调任务名！");
			return false;
		}else if($("#task-check-people-id").val() == "") {
			alert("请填写联调确认人！");
			return false;
		}else if($("#task-start-time").val() == "") {
			alert("请填写开始时间！");
			return false;
		}else if($("#task-end-time").val() == "") {
			alert("请填写结束时间！");
			return false;
		}else if(new Date($("#task-end-time").val().replace(/-/g,"/")) - new Date($("#task-start-time").val().replace(/-/g,"/")) <= 0) {
			alert("联调任务的结束时间必须大于开始时间！");
			return false;
		}else if($("#task-desc").val() == "") {
			alert("请填写联调内容描述！");
			return false;
		}
		return true;
	},
	
	initEvent:function() {
		
		/*初始化时间控件*/
		$(".form_datetime_start").datetimepicker({
			format: 'yyyy-mm-dd hh:ii',
			todayBtn: 1,
			linkField: "task-start-time",
	        linkFormat: "yyyy-mm-dd hh:ii"});
		
		$(".form_datetime_end").datetimepicker({
			format: 'yyyy-mm-dd hh:ii',
			todayBtn: 1,
			linkField: "task-end-time",
	        linkFormat: "yyyy-mm-dd hh:ii"});
		
		$("#task-type").change(function(){
			
			/*清空临时表CUST_JT_JOIN_PROVINCES_RELATE的省间关系*/
			if(MyGlobal.isBulidRelate.isSelect && MyGlobal.isBulidRelate.isBulid) {
				var jsonData = {
						"isDel"		 : '1',
						"joinTaskId" : $("#task-id").html()
				};
				
 				$.ajax({
					type: "POST",
					data: {data: JSON.stringify(jsonData)},
					url:  "/CustJtJoinTaskAction.do?method=buildProvincesRelate",
					success: function(data) {
						if(data) {
							alert(data);
						}else{
							alert("联调任务失败！");
						}
					},
					error: function() {
						alert("联调任务失败！");
					} 
				});
			}
			
			if($(this).val() == "2") {
				$("#task-both-province-div,#task-test-province-div,#btn-test-provice").show();
				$("#task-province-div").hide();
				$("#task-test-province-div").css({"padding-bottom": "20px"});
				MyGlobal.isBulidRelate.isSelect = true;
				
				$("#task-case-list .ci_host_single").hide();
				$("#task-case-list .ci_host_double").show();
				
			}else{
				$("#task-province-div").show();
				$("#task-both-province-div, #task-test-province-div").hide();
				MyGlobal.isBulidRelate.isSelect = false;
				MyGlobal.isBulidRelate.isBulid = false;
				
				$("#task-case-list .ci_host_single").show();
				$("#task-case-list .ci_host_double").hide();
				
			}
			$(this).val() == "3" ? $(".capability-th").html("业务类型") :  $(".capability-th").html("能力名称");
			
			
			$("#task-province-id, #task-province-name, #task-province-start-id, #task-province-start-name, #task-province-end-id, #task-province-end-name").val("");
			$("#task-province-list-div").hide();
			$("#task-case-list-div").show();
			$("#task-province-list").find(":checkbox").prop("checked", false);
			
			/*清空案例表申请内容*/
			$("#task-case-list > tbody").html("");
			$("#case-sum").html("0");
			
			/*清空省间联调数据*/
			$("#task-test-provinces").html("");
		});
		
		$("#btn-task-check-people").on("click", function(){
			var oReturnStaff = choiceStaff(true, null, null, null, null, null, null, null, null, null);
			if(oReturnStaff != null) {
				$("#task-check-people-id").val(oReturnStaff.id);
				$("#task-check-people-name").val(oReturnStaff.name);
			}else {
				$("#task-check-people-id").val("");
				$("#task-check-people-name").val("");
			}
		});
		
		$("#btn-task-public, #btn-task-save").on("click", function(){ 
			
			if(!TaskForm.check()) {
				return ;
			}else if(!TaskJob.check()) {
				return ;
			}
			
			var formData ,
			    caseData = [],
			    provinceData,
			    self = this;
			
			formData = {
					taskId: $("#task-id").html(),
					taskName: $("#task-name").val(), 
					taskApplyMan : $("#task-apply-man").val(),
					taskApplyMail: $("#task-apply-mail").val(),
					taskApplyTel: $("#task-apply-tel").val(),	
					taskCheckId: $("#task-check-people-id").val(),
					taskStartTime: $("#task-start-time").val(),
					taskEndTime: $("#task-end-time").val(),
					taskAuto: $("input[name='task-isauto-exam']:checked").val(),
					taskType: $("#task-type").val(),
					taskDesc: $("#task-desc").val(),
					taskApplyProvince: $("#task-type").val() != 2 ? $("#task-province-id").val() : $("#task-province-start-id").val(),
					taskTargetProvince: $("#task-type").val() != 2 ? "" : $("#task-province-end-id").val(),
					taskState: $(self).attr("id") == "btn-task-public" ? 2 : 1
			};
			
			$("#task-case-list > tbody > tr").each(function(){
				var self = this;
				
				if($(this).find("td").length > 1) {
					if($("#task-type").val() != 2) {
						caseData.push({
							caseId : $(self).attr("id"),
							testCaseSeq: $(this).find("td:eq(0)").html(),
							caseName : $(this).find("td:eq(1) > span").html(),
							neName : $(this).find("td:eq(2) > span").html(),
							testType : $(this).find("td:eq(3) > span").html(),
							capabilityName : $(this).find("td:eq(4) > span").html()
						});
					}else {
						caseData.push({
							caseId : $(self).attr("id"),
							testCaseSeq: $(this).find("td:eq(0)").html(),
							caseName : $(this).find("td:eq(1) > span").html(),
							neNameApply : $(this).find("td:eq(2) > span").html(),
							neNameTarget : $(this).find("td:eq(3) > span").html(),
							testType : $(this).find("td:eq(4) > span").html(),
							capabilityName : $(this).find("td:eq(5) > span").html()
						});
					}
				}
			});
			
			$.ajax({
				type:"POST",
				dataType:"json",
				asyc : true,
				cache : false,
				data: {data : JSON.stringify({"formData" : formData, "caseData" : caseData})},
				url: "/CustJtJoinTaskAction.do?method=addJoinTask&type=" + $("#task-type").val(),
				success: function(data){
					if(data == null || data == "") {
						if($(self).attr("id") == "btn-task-public") {
							alert("联调任务发布失败！");
						}else {
							alert("联调任务保存失败！");
						}
						return ;
					}else if(data.ispublic == 1) {
						alert("任务发布成功！");
						window.close();
					}else if(data.issave == 1) {
						alert("联调任务保存成功！");
					}else {
						alert("创建联调任务失败！");
					}
				},
				error:function(){
					alert("创建联调任务失败！");
				}
			});
		});
			
		$("#btn-task-exit").on("click", function(){
			if(MyGlobal.isBulidRelate.isSave == false) {
				if(confirm("您还未保存数据， 退出后将丢失！")) {
					window.opener = null;
					window.open(' ', '_self', ' '); 
					window.close();
				}
			}else{
				window.opener = null;
				window.open(' ', '_self', ' '); 
				window.close();
			}
		});
	},
	
	init:function() {
		var taskType = getXmlFromHtmlData("task-type");
		
		this.initEvent();
		
		/*联调赋值*/
		if(taskType != null) {
			var $rows = $(taskType).find("rowSet");
			$rows.each(function(i, el) {
				$("#task-type").append("<option value=" + $(el).find("VALUE").text()+">" + $(el).find("TEXT").text() + "</option>");
			});
		}
		
		/*获取联调ID号*/
		$.ajax({
			type: "GET",
			url: "/CustJtJoinTaskAction.do?method=loadTaskInitInfo",
			dataType: "json",
			cache : false,
			asyc: true,
			success : function(data) {
				if(data == "" || data == null) {
					alert("获取联调初始化信息失败！");
					return ;
				} 
				
				$("#task-id").html(data.taskId);
				$("#task-submit-info").html(data.org + '-' + data.staffName + "(" + data.mobile + ", " + data.email + ")");
				$("#task-apply-man").val(data.staffId);
				$("#task-apply-mail").val(data.email);
				$("#task-apply-tel").val(data.mobile);
			},
			error: function() {
				alert("获取联调初始化信息失败！");
			}
		});
		
	}
}

/**
 * 联调任务
 */
var TaskJob = {
	
	check: function() {
		if($("#task-type").val() == 2) {
			if($("#task-province-start-id").val() == ""){
				alert("发起省份不为空！");
				return false;
			}else if($("#task-province-end-id").val() == "") {
				alert("目的省份不为空！");
				return false;
			}else if($("#task-test-provinces").html() == ""){
				alert("没有创建省间联调！");
				return ;
			}
		}else {
			if($("#task-province-id").val() == "") {
				alert("联调省份不为空！");
				return false;
			}
		}
		
		if($("#task-case-list > tbody > tr").length <= 0) {
			alert("请添加测试案例！");
			return false;
		}
		return true;
	},
	
	selectPerson: {
		
		init: function(target) {
			if($("#task-province-list > tbody").html() == "") {
				$.ajax({
					type: "GET",
					url: "/CustJtJoinTaskAction.do?method=loadTaskPersonData",
					dataType: "json",
					cache: false,
					success : function(data) {
						var rows = "";
						$(data).each(function(i, msg){
							rows = "<tr> "
								 + "  		<td scope= 'row'> "
								 + "		    <label> "
								 + "		      <input type='checkbox' name='task-provice-select' id='province_id_" + msg.REGION_ID + "' value='" + msg.REGION_ID + "_" + msg.REGION_NAME +"' > " 
								 + "		    </label> " 
								 + "		</td> "
								 + "		<td>" + msg.REGION_NAME + "</td> " 
								 + "		<td>" + msg.STAFF_NAME + "</td> " 
								 + "		<td>" + (msg.MOBILE == undefined ? "" : msg.MOBILE)  + "</td> " 
								 + "</tr>" + rows;
						});
						
						$("#task-province-list>tbody").html(rows);
					},
					error: function() {
						alert("获取联调人员失败！");
					}
				});
			}else {
				var value = $("#" + target.substring(0, target.length - 4) + "id").val();
				
				if(value != null && value != "" && $("#task-province-list").is(":hidden")) {
					$.each(value.split(","), function(){
						$("#province_id_" + this).attr("checked", true);
					});
				}
				
				if($("#task-province-list input[name='task-provice-select']:checked").length == $("#task-province-list input[name='task-provice-select']").length) {
					$("#task-province-list input[name='task-select-all']").attr("checked", true);
				}
			}
		}
	},
	
	provinces: {
		
		clickTag : true,
		
		/*创建详细省间关系*/
		/*获取点击省份的位置 ， 显示详细对测省份内容*/
		loadDetailPro: function(target, applyId) {
			
			if($("#test-provinces-detail-div").is(":visible") && $("#test-provinces-detail-div").val() == applyId) {
				$("#test-provinces-detail-div").hide();
				return ;
			}
	 		
			$.ajax({
				type:"POST",
				dataType: "json",
				url: "/CustJtJoinTaskAction.do?method=loadProvincesRelate",
				asyc: true,
				cache: false,
				data: {data : JSON.stringify({"taskId" : $("#task-id").html(), "applyProvince" : applyId})},
				success: function(data) {
					var detail = "";
					
					if(data == null || data == "") {
						alert("获取详细对测省份失败！");
						return ;
					}else if(data[0].success == 0) {
						alert("暂无详细信息！");
						return ;
					} 
					
					$(data).each(function() {
						if(this.task_apply_province_name != "" && this.task_apply_province_name != null) {
							detail = "<li> "
								+ "	 	<div> "
								+ "		<span>" + this.task_apply_province_name + "-" + this.task_target_province_name + "</span> " 
								+ "		<img src='img/task-provinces-del.png' onclick='TaskJob.provinces.deleteProvinces(this, " + this.id +"," + applyId + ")'> "
								+ "		</div> "
								+ "</li> "
								+ detail ;
						}
					});
					$("#test-provinces-detail-div").val(applyId);
					$("#test-provinces-detail").html(detail);
					$("#test-provinces-detail-div").css("top", $(target).position().top + 30);
					$("#test-provinces-detail-div").show();
				},
				error: function(){
					alert("获取详细对测省份失败！");
				}
			});
		},
		
		/*删除省间关联操作关系*/
		deleteProvinces: function(target, targetId, applyId) {
			var self = this;
			
			if(self.clickTag) {
				
				$.ajax({
					type:"POST",
					dataType: "json",
					data: {data : JSON.stringify({"taskId" : $("#task-id").html(), "id" : targetId, "applyProvince" : applyId})},
					url: "/CustJtJoinTaskAction.do?method=delProvincesById",
					success:function(data) {
						if(data == null || data == "") {
							alert("删除省间关联关系失败！");
							return ;
						}
						
						if(data[0].total != null && data.length == 2) {
							$("#province_" + applyId).html("(" + data[0].total + "省)");
							$(target).parent().parent().remove();
						}else {
							$("#province_" + applyId).html("(0省)");
							$("#test-provinces-detail-div").hide();
						}
					},
					
					error: function() {
						alert("删除省间关联关系失败！");
					}
				});
				
				//防止重复点击
				self.clickTag = false;
				setTimeout(function(){
					self.clickTag = true;
				}, 800);
			}
			
		}
	},
	
	cases : {
		copy : function(target) {
			if($("#task-case-list input[name='case-name-input']").length > 0) {
				return false;
			}
			
			$.ajax({
				type: "get",
				dataType:"json",
				cache : false,
				url: "/CustJtJoinTaskAction.do?method=loadCaseSeq",
				success: function(data) {
					if(data == "" || data == null) {
						alert("案例序列获取失败！");
						return false;
					}
					
					var text = "";
					$.each($("<tr>" + $(target).parent().parent().parent().html() + "</tr>").find("td"), function(i){
						if(i == 0) {
								text = "<td scope='row'>" + data[0].test_case_seq + "</td>" + text;
						}else {
							text = text + this.outerHTML;
						}
					});
					
					$("#task-case-list > tbody").append("<tr ondblclick='TaskJob.cases.dbClick(this)' id='" + data[0].case_id + "'>" + text + "</tr>");
				},
				error: function() {
					alert("案例序列获取失败！");
					return false;
				}
			});
			
		},
		
		del : function(target) {
			MyGlobal.isAddCase = 0;
			$(target).parent().parent().remove();
			this.sums();
		},
		
		addCase : function(event) {
			
			if(event.target.name == "case-name-input" ||
			   event.target.name == "ne-name-input" ||
			   event.target.name == "ne-name-input-apply" ||
			   event.target.name == "ne-name-input-target" ||
			   event.target.name == "test-type-input" || 
			   event.target.name == "capability-name-input" ||
			   ((event.target.id == "btn-task-case-add-img" || event.target.id =="btn-task-case-add") && MyGlobal.isAddCase == 1) ||
			   $("#task-case-list input[name='case-name-input']").length == 0) {
				return ;
			}else {
				MyGlobal.isAddCase ++;
			}
			
			var case_name = $("#task-case-list input[name='case-name-input']").val(),
				ne_name = "",
				ne_name_apply = "",
				ne_name_target = "",
				test_type = $("#task-case-list input[name='test-type-input']").val(),
				capability_name = $("#task-case-list input[name='capability-name-input']").val();
			
			if($("#task-type").val() == 2) {
				ne_name_apply = $("#task-case-list input[name='ne-name-input-apply']").val();
				ne_name_target =$("#task-case-list input[name='ne-name-input-target']").val();
			}else {
				ne_name = $("#task-case-list input[name='ne-name-input']").val()
			}
			
			if(case_name != "" && test_type != "" && capability_name != "" && (($("#task-type").val() != 2 && ne_name != "") || ($("#task-type").val() == 2 && ne_name_apply != "" && ne_name_target != ""))) {
				 $("#task-case-list input[name='case-name-input']").replaceWith("<span name='case-name-span'>" + case_name + "</span>");
				 $("#task-case-list input[name='test-type-input']").replaceWith("<span name='test-type-span'>" + test_type + "</span>");
				 $("#task-case-list input[name='capability-name-input']").replaceWith("<span name='capability-name-span'>" + capability_name + "</span>");

				 if($("#task-type").val() == 2) {
					$("#task-case-list input[name='ne-name-input-apply']").replaceWith("<span name='ne-name-apply'>" + ne_name_apply + "</span>");
					$("#task-case-list input[name='ne-name-input-target']").replaceWith("<span name='ne-name-target'>" + ne_name_target + "</span>");
				 } else {
					$("#task-case-list input[name='ne-name-input']").replaceWith("<span name='ne-name-span'>" + ne_name + "</span>");
				 }

				 
				 MyGlobal.isAddCase = 0;
				 this.sums();
				 
			}else {
				if(case_name == "") {
					alert("请填写案例名称!");
					$("#task-case-list input[name='case-name-input']").focus();
				}else if(ne_name == "" && $("#task-type").val() != 2){
					alert("请填写网元名称!");
					$("#task-case-list input[name='ne-name-input']").focus();
					return ;
				}else if(ne_name_apply == "" && $("#task-type").val() == 2){
					alert("请填写发起网元名称!");
					$("#task-case-list input[name='ne-name-input-apply']").focus();
					return ;
				}else if(ne_name_target == "" && $("#task-type").val() == 2){
					alert("请填写目的网元名称!");
					$("#task-case-list input[name='ne-name-input-target']").focus();
					return ;
				}else if(test_type == "") {
					alert("请填写测试类型!");
					$("#task-case-list input[name='test-type-input']").focus();
				}else if(capability_name == "") {
					alert("请填写能力名称!");
					$("#task-case-list input[name='capability-name-input']").focus();
				}
			}
		},
		
		dbClick: function(target) {
			$(target).find("span[name='case-name-span']").replaceWith("<input type='text' name='case-name-input' value=" + ($(target).find("span[name='case-name-span']").html()) + ">");
			$(target).find("span[name='test-type-span']").replaceWith("<input type='text' name='test-type-input' value=" + ($(target).find("span[name='test-type-span']").html()) + ">");
			$(target).find("span[name='capability-name-span']").replaceWith("<input type='text' name='capability-name-input' value=" + ($(target).find("span[name='capability-name-span']").html()) + ">");
			
			
			 if($("#task-type").val() == "2") {
				$(target).find("span[name='ne-name-apply']").replaceWith("<input type='text' name='ne-name-input-apply' value=" + ($(target).find("span[name='ne-name-apply']").html()) + ">");
				$(target).find("span[name='ne-name-target']").replaceWith("<input type='text' name='ne-name-input-target' value=" + ($(target).find("span[name='ne-name-target']").html()) + ">");
			 } else {
				 $(target).find("span[name='ne-name-span']").replaceWith("<input type='text' name='ne-name-input' value=" + ($(target).find("span[name='ne-name-span']").html()) + ">");
			 }
		
		},
		
		sums: function(){
			$("#case-sum").html($("#task-case-list > tbody > tr").length);
		}
	},
	
	initEvent: function() {
		var self = this,
			task_province_list = $("#task-province-list");
		
		$("#btn-province-select, #btn-province-start-select, #btn-province-end-select").on("click", function() {
			
			if($(this).attr("id") == "btn-province-select") {
				$("#task-province-list-div").val("task-province-name");
			}else if($(this).attr("id") == "btn-province-start-select") {
				$("#task-province-list-div").val("task-province-start-name");
				$("#task-province-end-div").toggle();
			}else if($(this).attr("id") == "btn-province-end-select") {
				$("#task-province-list-div").val("task-province-end-name");
				$("#task-province-start-div").toggle();
			}
			
			task_province_list.find(":checkbox").prop("checked", false);
			self.selectPerson.init($("#task-province-list-div").val());
			
			$("#task-province-list-div").toggle();
			if(!$("#task-province-list-div").is(":hidden")) {
				$("#btn-test-provice").hide();
				$("#task-test-province-div").css({"padding-bottom": "0px"});
			}else{
				$("#btn-test-provice").show();
				$("#task-test-province-div").css({"padding-bottom": "20px"});
			}
			
		});
		
		task_province_list.on("click", "input[name='task-select-all'], input[name='task-provice-select']",function(){

			if($(this).attr("name") == 'task-select-all') {
				task_province_list.find("input[name='task-provice-select']").prop("checked", $(this).is(":checked"));
			}
			
			var task_province_id = "",
				task_province_name = "",
				task_province_ele= $("#task-province-list-div").val(),
				task_province_select = task_province_list.find("input[name='task-provice-select']:checked");
			
			task_province_select.each(function(){
				var data = $(this).val().split("_");
				task_province_id = data[0] + ',' + task_province_id;
				task_province_name = data[1] + '、' + task_province_name;
				
			});
			
			if(task_province_select.length == $("#task-province-list input[name='task-provice-select']").length) {
				$("#task-province-list input[name='task-select-all']").attr("checked", true);
			}else {
				$("#task-province-list input[name='task-select-all']").attr("checked", false);
			}
			
			$("#" + task_province_ele.substr(0, task_province_ele.length - 4) + "id" ).val(task_province_id.substring(0, task_province_id.length - 1));
			$("#" + task_province_ele).val(task_province_name.substring(0, task_province_name.length - 1));
			
		});
		
		/*生成对测省份*/
		$("#btn-test-provice").on("click", function() {
			var applyProvinces = $("#task-province-start-id").val() ? $("#task-province-start-id").val() : "",
				targetProvinces =  $("#task-province-end-id").val() ? $("#task-province-end-id").val() : ""; 
			
			if(applyProvinces == "") {
				alert("请选择发起省份！");
				return ;
			}else if(targetProvinces == "") {
				alert("请选择目的省份！");
				return ;
			}
			
			var jsonData = {
					"isDel"		 : '0',
			        "applyProvinces" : applyProvinces,
			        "targetProvinces": targetProvinces,
			        "joinTaskId" 	 : $("#task-id").html()
			};
			
			
			$.ajax({
				type: "POST",
				dataType:"json",
				cache : false,
				url: "/CustJtJoinTaskAction.do?method=buildProvincesRelate",
				data: {data:JSON.stringify(jsonData)},
				success: function(data) {
					if(data == null || data =="") {
						alert("创建省间联调关联关系失败!");
						return ;
					}
					
					var listProvinces = "";
					
					$(data).each(function(i) {
						listProvinces = listProvinces +
									  "<li onclick='TaskJob.provinces.loadDetailPro(this," + this.task_apply_province + ")'><span>" + this.task_apply_province_name + "</span><span id='province_" + this.task_apply_province +"' >(" + this.total + "省)</span></li>"
					});
					
					$("#task-test-provinces").html(listProvinces);
					
					MyGlobal.isBulidRelate.isBulid = true;
					
					$("#task-test-provinces-div, #task_test_label").show();
				},
				error: function() {
					alert("创建省间联调关联关系失败!");
				}
			});
			
		});
		
		
		/*添加案例操作*/
		$("#btn-task-case-add").on("click", function() {
			MyGlobal.isAddCase ++ ;
			if($("#task-case-list input[name='case-name-input']").length > 0) 
				return ;
			
			$.ajax({
				type: "get",
				dataType:"json",
				cache : false,
				url: "/CustJtJoinTaskAction.do?method=loadCaseSeq",
				success: function(data) {
					if(data == "" || data == null) {
						alert("案例序列获取失败！");
						return false;
					}
					
					var html = "";
					
					if($("#task-type").val() == "2"){
						html =  "<tr ondblclick='TaskJob.cases.dbClick(this)' id='" + data[0].case_id +"'> "
						     +  " <td scope=\"row\">" + data[0].test_case_seq + "</td> "
						     +  " <td name='case-name'><input type='text' name='case-name-input'></td> "
						     +  " <td name='ne-name'><input type='text' name='ne-name-input-apply' ></td> " 
						     +  " <td name='ne-name'><input type='text' name='ne-name-input-target' ></td> "
						     +  " <td name='test-type'><input type='text' name='test-type-input' ></td> "
						     +  " <td name='capability-name'><input type='text' name='capability-name-input'></td> "
						     +  " <td><span><img src='img/task-case-copy.png' onclick='TaskJob.cases.copy(this)'></span><img src='img/task-case-del.png' onclick='TaskJob.cases.del(this)'></span></td> "
						     +  "</tr>";
					}else {
						html =  "<tr ondblclick='TaskJob.cases.dbClick(this)' id='" + data[0].case_id +"'> "
							 +  " <td scope=\"row\">" + data[0].test_case_seq + "</td> "
							 +  " <td name='case-name'><input type='text' name='case-name-input'></td> "
							 +  " <td name='ne-name'><input type='text' name='ne-name-input' ></td> "
							 +  " <td name='test-type'><input type='text' name='test-type-input' ></td> "
							 +  " <td name='capability-name'><input type='text' name='capability-name-input'></td> "
							 +  " <td><span><img src='img/task-case-copy.png' onclick='TaskJob.cases.copy(this)'></span><img src='img/task-case-del.png' onclick='TaskJob.cases.del(this)'></span></td> "
							 +  "</tr>";
					}
					$("#task-case-list > tbody").append(html);
					
				},
				error: function() {
					alert("案例序列获取失败！");
					return false;
				}
			});

			
		});
		
		/*回车触发事件*/
		$("#task-case-list").on("keyup", "input", function(e){
			if(e.keyCode == 13){
				var case_name = $("#task-case-list input[name='case-name-input']").val(),
					
					ne_name = "",
					ne_name_apply = "",
					ne_name_target = "",
					
					test_type = $("#task-case-list input[name='test-type-input']").val(),
					capability_name = $("#task-case-list input[name='capability-name-input']").val();
				
				if($("#task-type").val() == 2) {
					ne_name_apply = $("#task-case-list input[name='ne-name-input-apply']").val();
					ne_name_target =$("#task-case-list input[name='ne-name-input-target']").val();
				}else {
					ne_name = $("#task-case-list input[name='ne-name-input']").val()
				}
				
				
				if(case_name == "") {
					alert("请填写案例名称!");
					$("#task-case-list input[name='case-name-input']").focus();
					return ;
				}else if(ne_name == "" && $("#task-type").val() != 2){
					alert("请填写网元名称!");
					$("#task-case-list input[name='ne-name-input']").focus();
					return ;
				}else if(ne_name_apply == "" && $("#task-type").val() == 2){
					alert("请填写发起网元名称!");
					$("#task-case-list input[name='ne-name-input-apply']").focus();
					return ;
				}else if(ne_name_target == "" && $("#task-type").val() == 2){
					alert("请填写目的网元名称!");
					$("#task-case-list input[name='ne-name-input-target']").focus();
					return ;
				}else if(test_type == "") {
					alert("请填写测试类型!");
					$("#task-case-list input[name='test-type-input']").focus();
					return ;
				}else if(capability_name == "") {
					alert("请填写能力名称!");
					$("#task-case-list input[name='capability-name-input']").focus();
					return ;
				}else {
					if($("#task-type").val() == 2) {
						$("#task-case-list input[name='ne-name-input-apply']").replaceWith("<span name='ne-name-apply'>" + ne_name_apply + "</span>");
						$("#task-case-list input[name='ne-name-input-target']").replaceWith("<span name='ne-name-target'>" + ne_name_target + "</span>");
					} else {
						$("#task-case-list input[name='ne-name-input']").replaceWith("<span name='ne-name-span'>" + ne_name + "</span>");
					}

					 $("#task-case-list input[name='test-type-input']").replaceWith("<span name='test-type-span'>" + test_type + "</span>");
					 $("#task-case-list input[name='capability-name-input']").replaceWith("<span name='capability-name-span'>" + capability_name + "</span>");
					 $("#task-case-list input[name='case-name-input']").replaceWith("<span name='case-name-span'>" + case_name + "</span>");
					 MyGlobal.isAddCase = 0;
					 self.cases.sums();
				}
				
			}
		});
		
		/*写测试*/
		$("#btn-import-xls").on("click", function(){
			AttachOper.openImportWin(function(data){
				var html = "",
					result = $.parseJSON(data);
				
				$(result).each(function(){
					if($("#task-type").val() == "2"){
						html +=  "<tr ondblclick='TaskJob.cases.dbClick(this)' id='" + this[6] +"'> "
						     +  " <td scope=\"row\">" + this[5] + "</td> "
						     +  " <td name='case-name'><span name='case-name-span'>" + this[0] + "</span></td> "
						     +  " <td name='ne-name'><span name='ne-name-apply'>" + this[1] + "</span></td> " 
						     +  " <td name='ne-name'><span name='ne-name-target'>" + this[2] + "</span></td> "
						     +  " <td name='test-type'><span name='test-type-span'>" + this[3] + "</span></td> "
						     +  " <td name='capability-name'><span name='capability-name-span'>" + this[4] + "</span></td> "
						     +  " <td><span><img src='img/task-case-copy.png' onclick='TaskJob.cases.copy(this)'></span><img src='img/task-case-del.png' onclick='TaskJob.cases.del(this)'></span></td> "
						     +  "</tr>";
					}else {
						html +=  "<tr ondblclick='TaskJob.cases.dbClick(this)' id='" + this[5] +"'> "
							 +  " <td scope=\"row\">" + this[4] + "</td> "
							 +  " <td name='case-name'><span name='case-name-span'>" + this[0] + "</span></td> "
						     +  " <td name='ne-name'><span name='ne-name-span'>" + this[1] + "</span></td> " 
						     +  " <td name='test-type'><span name='test-type-span'>" + this[2] + "</span></td> "
						     +  " <td name='capability-name'><span name='capability-name-span'>" + this[3] + "</span></td> "
							 +  " <td><span><img src='img/task-case-copy.png' onclick='TaskJob.cases.copy(this)'></span><img src='img/task-case-del.png' onclick='TaskJob.cases.del(this)'></span></td> "
							 +  "</tr>";
					}
					
				});
				
				$("#task-case-list > tbody").append($("#task-case-list > tbody").html() + html);
				$("#case-sum").html($(result).length);
			});
		});
	},
	
	init: function() {
		$("#task-both-province-div").hide();
		this.initEvent();
		/*
		$.extend($.fn.dataTable.defaults, {
			language: {
				"sProcessing":   "处理中...",
				"sLengthMenu":   "显示 _MENU_ 项结果",
				"sZeroRecords":  "没有匹配结果",
				"sInfo":         "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
				"sInfoEmpty":    "显示第 0 至 0 项结果，共 0 项",
				"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
				"sInfoPostFix":  "",
				"sSearch":       "搜索:",
				"sUrl":          "",
				"sEmptyTable":     "表中数据为空",
				"sLoadingRecords": "载入中...",
				"sInfoThousands":  ",",
				"oPaginate": {
					"sFirst":    "首页",
					"sPrevious": "上页",
					"sNext":     "下页",
					"sLast":     "末页"
				},
				"oAria": {
					"sSortAscending":  ": 以升序排列此列",
					"sSortDescending": ": 以降序排列此列"
				}
			}
		});
		
		var dataSet = [
		               ['Trident','Internet Explorer 4.0','Win 95+','4','X'],
		               ['Trident','Internet Explorer 5.0','Win 95+','5','C'],
		               ['Trident','Internet Explorer 5.5','Win 95+','5.5','A'],
		               ['Trident','Internet Explorer 6','Win 98+','6','A'],
		               ['Trident','Internet Explorer 7','Win XP SP2+','7','A'],
		               ['Trident','AOL browser (AOL desktop)','Win XP','6','A'],
		               ['Gecko','Firefox 1.0','Win 98+ / OSX.2+','1.7','A'],
		               ['Gecko','Firefox 1.5','Win 98+ / OSX.2+','1.8','A'],
		               ['Gecko','Firefox 2.0','Win 98+ / OSX.2+','1.8','A'],
		               ['Gecko','Firefox 3.0','Win 2k+ / OSX.3+','1.9','A'],
		               ['Gecko','Camino 1.0','OSX.2+','1.8','A'],
		               ['Gecko','Camino 1.5','OSX.3+','1.8','A'],
		               ['Gecko','Netscape 7.2','Win 95+ / Mac OS 8.6-9.2','1.7','A'],
		               ['Gecko','Netscape Browser 8','Win 98SE+','1.7','A'],
		               ['Gecko','Netscape Navigator 9','Win 98+ / OSX.2+','1.8','A'],
		               ['Gecko','Mozilla 1.0','Win 95+ / OSX.1+',1,'A'],
		               ['Gecko','Mozilla 1.1','Win 95+ / OSX.1+',1.1,'A'],
		               ['Gecko','Mozilla 1.2','Win 95+ / OSX.1+',1.2,'A'],
		               ['Gecko','Mozilla 1.3','Win 95+ / OSX.1+',1.3,'A'],
		               ['Gecko','Mozilla 1.4','Win 95+ / OSX.1+',1.4,'A'],
		               ['Gecko','Mozilla 1.5','Win 95+ / OSX.1+',1.5,'A'],
		               ['Gecko','Mozilla 1.6','Win 95+ / OSX.1+',1.6,'A'],
		               ['Gecko','Mozilla 1.7','Win 98+ / OSX.1+',1.7,'A'],
		               ['Gecko','Mozilla 1.8','Win 98+ / OSX.1+',1.8,'A'],
		               ['Gecko','Seamonkey 1.1','Win 98+ / OSX.2+','1.8','A'],
		               ['Gecko','Epiphany 2.20','Gnome','1.8','A'],
		               ['Webkit','Safari 1.2','OSX.3','125.5','A'],
		               ['Webkit','Safari 1.3','OSX.3','312.8','A'],
		               ['Webkit','Safari 2.0','OSX.4+','419.3','A'],
		               ['Webkit','Safari 3.0','OSX.4+','522.1','A'],
		               ['Webkit','OmniWeb 5.5','OSX.4+','420','A'],
		               ['Webkit','iPod Touch / iPhone','iPod','420.1','A'],
		               ['Webkit','S60','S60','413','A'],
		               ['Presto','Opera 7.0','Win 95+ / OSX.1+','-','A'],
		               ['Presto','Opera 7.5','Win 95+ / OSX.2+','-','A'],
		               ['Presto','Opera 8.0','Win 95+ / OSX.2+','-','A'],
		               ['Presto','Opera 8.5','Win 95+ / OSX.2+','-','A'],
		               ['Presto','Opera 9.0','Win 95+ / OSX.3+','-','A'],
		               ['Presto','Opera 9.2','Win 88+ / OSX.3+','-','A'],
		               ['Presto','Opera 9.5','Win 88+ / OSX.3+','-','A'],
		               ['Presto','Opera for Wii','Wii','-','A'],
		               ['Presto','Nokia N800','N800','-','A'],
		               ['Presto','Nintendo DS browser','Nintendo DS','8.5','C/A<sup>1</sup>'],
		               ['KHTML','Konqureror 3.1','KDE 3.1','3.1','C'],
		               ['KHTML','Konqureror 3.3','KDE 3.3','3.3','A'],
		               ['KHTML','Konqureror 3.5','KDE 3.5','3.5','A'],
		               ['Tasman','Internet Explorer 4.5','Mac OS 8-9','-','X'],
		               ['Tasman','Internet Explorer 5.1','Mac OS 7.6-9','1','C'],
		               ['Tasman','Internet Explorer 5.2','Mac OS 8-X','1','C'],
		               ['Misc','NetFront 3.1','Embedded devices','-','C'],
		               ['Misc','NetFront 3.4','Embedded devices','-','A'],
		               ['Misc','Dillo 0.8','Embedded devices','-','X'],
		               ['Misc','Links','Text only','-','X'],
		               ['Misc','Lynx','Text only','-','X'],
		               ['Misc','IE Mobile','Windows Mobile 6','-','C'],
		               ['Misc','PSP browser','PSP','-','C'],
		               ['Other browsers','All others','-','-','U']
		           ];
		            
	     
	        $('#task-case-list-test').dataTable( {
	        	"searching": false,
	        	"lengthChange": false,
	            "data": dataSet,
	            "columns": [
	                { "title": "Engine" },
	                { "title": "Browser" },
	                { "title": "Platform" },
	                { "title": "Version", "class": "center" },
	                { "title": "Grade", "class": "center" }
	            ]
	        } );
	        
	       
	        $('#task-case-list-test > tbody').on("dblclick","tr", function(){
	        	 $('#task-case-list-test > tbody').append("<tr>" + $(this).html() + "</tr>");
	        }); */
	        
    
	}
};

/**
 * 附件操作
 */
var AttachOper = {
	
    openImportWin: function(callback) {
        this.showImportExcelWin(function(data){
        	callback && callback(data);
        });
    },

    showImportExcelWin: function(callback) {
        var importExcelForm = new Ext.form.FormPanel({
            frame: true,
            fileUpload: true,
            defaults: {
            	hideLabel: true
            },
            items: [{
                id: 'importExcelFile',
                xtype: 'textfield',
                name: 'importExcelFile',
                inputType: 'file',
                fieldClass: 'x-form-field-default',
                anchor: '95%'
            }]
        });
        
        var importExcelWin = new Ext.Window({
            title: 'Excel导入',
            layout: 'form',
            width: 550,
            closeAction: 'close',
            draggable: false,
            items: [importExcelForm],
            modal: true,
            buttons: [{
                id: 'isSaveAsAttach',
                boxLabel: '保存为附件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
                xtype: 'checkbox'
            }, {
                text: '导入',
                handler: function() {
                    //判断文件必须为.xls
                    var isSave = Ext.getCmp('isSaveAsAttach').getValue();
                    var filePath = Ext.getCmp('importExcelFile').getValue();
                    var fileName = filePath.substring(filePath.lastIndexOf('\\') + 1, filePath.length);
                    var fileSuffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
                    if (fileSuffix != 'xls' && fileSuffix != 'xlsx') {
                        Ext.Msg.alert('提示', '导入文件后缀必须为.xls或.xlsx');
                        return;
                    }
                    //提交导入
                    importExcelForm.getForm().submit({
                        waitMsg: '导入中, 请稍候......',
                        waitTitle: 'Waiting.......',
                        method: 'post',
                        url:  "/CustJtJoinTaskAction/xlsCasesImport.do",
                        success: function(form, action) {
                            callback && callback(action.result.data);
                            importExcelWin.close();
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('提示', action.result.response);
                        }
                    });
                }
            }, {
                text: '关闭',
                handler: function() {
                    importExcelWin.close();
                }
            }]
        });
        Ext.getCmp('isSaveAsAttach').hide();
        importExcelWin.show();
    }
};
