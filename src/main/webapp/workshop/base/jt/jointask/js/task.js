
$("document").ready(function(){
	
	TaskForm.init();
	TaskJob.init();
	
	$("body").on("click", function(event){
		TaskJob.cases.addCase(event);
	});
	
	
});

/**
 * ȫ�ֱ���
 */
var MyGlobal = {
		
	isBulidRelate: { isSelect:false, isBulid: false, isSave: false},	//�Ƿ�����ʡ��������ϵ
	
	isAddCase : 0,	//�Ƿ�������case������д��	
	
	isPublic: 0, 	//�Ƿ񷢲�����  0:�༭״̬��1:����״̬��2:���񷢲�״̬
	 	
};


/**
 * ������
 * ע�����
 * 1.����ȷ���˿���ѡ����
 * 2.
 */
var TaskForm = {
	
	check:function() {
		if($("#task-name").val() == "") {
			alert("����д������������");
			return false;
		}else if($("#task-check-people-id").val() == "") {
			alert("����д����ȷ���ˣ�");
			return false;
		}else if($("#task-start-time").val() == "") {
			alert("����д��ʼʱ�䣡");
			return false;
		}else if($("#task-end-time").val() == "") {
			alert("����д����ʱ�䣡");
			return false;
		}else if(new Date($("#task-end-time").val().replace(/-/g,"/")) - new Date($("#task-start-time").val().replace(/-/g,"/")) <= 0) {
			alert("��������Ľ���ʱ�������ڿ�ʼʱ�䣡");
			return false;
		}else if($("#task-desc").val() == "") {
			alert("����д��������������");
			return false;
		}
		return true;
	},
	
	initEvent:function() {
		
		/*��ʼ��ʱ��ؼ�*/
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
			
			/*�����ʱ��CUST_JT_JOIN_PROVINCES_RELATE��ʡ���ϵ*/
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
							alert("��������ʧ�ܣ�");
						}
					},
					error: function() {
						alert("��������ʧ�ܣ�");
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
			$(this).val() == "3" ? $(".capability-th").html("ҵ������") :  $(".capability-th").html("��������");
			
			
			$("#task-province-id, #task-province-name, #task-province-start-id, #task-province-start-name, #task-province-end-id, #task-province-end-name").val("");
			$("#task-province-list-div").hide();
			$("#task-case-list-div").show();
			$("#task-province-list").find(":checkbox").prop("checked", false);
			
			/*��հ�������������*/
			$("#task-case-list > tbody").html("");
			$("#case-sum").html("0");
			
			/*���ʡ����������*/
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
							alert("�������񷢲�ʧ�ܣ�");
						}else {
							alert("�������񱣴�ʧ�ܣ�");
						}
						return ;
					}else if(data.ispublic == 1) {
						alert("���񷢲��ɹ���");
						window.close();
					}else if(data.issave == 1) {
						alert("�������񱣴�ɹ���");
					}else {
						alert("������������ʧ�ܣ�");
					}
				},
				error:function(){
					alert("������������ʧ�ܣ�");
				}
			});
		});
			
		$("#btn-task-exit").on("click", function(){
			if(MyGlobal.isBulidRelate.isSave == false) {
				if(confirm("����δ�������ݣ� �˳��󽫶�ʧ��")) {
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
		
		/*������ֵ*/
		if(taskType != null) {
			var $rows = $(taskType).find("rowSet");
			$rows.each(function(i, el) {
				$("#task-type").append("<option value=" + $(el).find("VALUE").text()+">" + $(el).find("TEXT").text() + "</option>");
			});
		}
		
		/*��ȡ����ID��*/
		$.ajax({
			type: "GET",
			url: "/CustJtJoinTaskAction.do?method=loadTaskInitInfo",
			dataType: "json",
			cache : false,
			asyc: true,
			success : function(data) {
				if(data == "" || data == null) {
					alert("��ȡ������ʼ����Ϣʧ�ܣ�");
					return ;
				} 
				
				$("#task-id").html(data.taskId);
				$("#task-submit-info").html(data.org + '-' + data.staffName + "(" + data.mobile + ", " + data.email + ")");
				$("#task-apply-man").val(data.staffId);
				$("#task-apply-mail").val(data.email);
				$("#task-apply-tel").val(data.mobile);
			},
			error: function() {
				alert("��ȡ������ʼ����Ϣʧ�ܣ�");
			}
		});
		
	}
}

/**
 * ��������
 */
var TaskJob = {
	
	check: function() {
		if($("#task-type").val() == 2) {
			if($("#task-province-start-id").val() == ""){
				alert("����ʡ�ݲ�Ϊ�գ�");
				return false;
			}else if($("#task-province-end-id").val() == "") {
				alert("Ŀ��ʡ�ݲ�Ϊ�գ�");
				return false;
			}else if($("#task-test-provinces").html() == ""){
				alert("û�д���ʡ��������");
				return ;
			}
		}else {
			if($("#task-province-id").val() == "") {
				alert("����ʡ�ݲ�Ϊ�գ�");
				return false;
			}
		}
		
		if($("#task-case-list > tbody > tr").length <= 0) {
			alert("����Ӳ��԰�����");
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
						alert("��ȡ������Աʧ�ܣ�");
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
		
		/*������ϸʡ���ϵ*/
		/*��ȡ���ʡ�ݵ�λ�� �� ��ʾ��ϸ�Բ�ʡ������*/
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
						alert("��ȡ��ϸ�Բ�ʡ��ʧ�ܣ�");
						return ;
					}else if(data[0].success == 0) {
						alert("������ϸ��Ϣ��");
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
					alert("��ȡ��ϸ�Բ�ʡ��ʧ�ܣ�");
				}
			});
		},
		
		/*ɾ��ʡ�����������ϵ*/
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
							alert("ɾ��ʡ�������ϵʧ�ܣ�");
							return ;
						}
						
						if(data[0].total != null && data.length == 2) {
							$("#province_" + applyId).html("(" + data[0].total + "ʡ)");
							$(target).parent().parent().remove();
						}else {
							$("#province_" + applyId).html("(0ʡ)");
							$("#test-provinces-detail-div").hide();
						}
					},
					
					error: function() {
						alert("ɾ��ʡ�������ϵʧ�ܣ�");
					}
				});
				
				//��ֹ�ظ����
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
						alert("�������л�ȡʧ�ܣ�");
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
					alert("�������л�ȡʧ�ܣ�");
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
					alert("����д��������!");
					$("#task-case-list input[name='case-name-input']").focus();
				}else if(ne_name == "" && $("#task-type").val() != 2){
					alert("����д��Ԫ����!");
					$("#task-case-list input[name='ne-name-input']").focus();
					return ;
				}else if(ne_name_apply == "" && $("#task-type").val() == 2){
					alert("����д������Ԫ����!");
					$("#task-case-list input[name='ne-name-input-apply']").focus();
					return ;
				}else if(ne_name_target == "" && $("#task-type").val() == 2){
					alert("����дĿ����Ԫ����!");
					$("#task-case-list input[name='ne-name-input-target']").focus();
					return ;
				}else if(test_type == "") {
					alert("����д��������!");
					$("#task-case-list input[name='test-type-input']").focus();
				}else if(capability_name == "") {
					alert("����д��������!");
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
				task_province_name = data[1] + '��' + task_province_name;
				
			});
			
			if(task_province_select.length == $("#task-province-list input[name='task-provice-select']").length) {
				$("#task-province-list input[name='task-select-all']").attr("checked", true);
			}else {
				$("#task-province-list input[name='task-select-all']").attr("checked", false);
			}
			
			$("#" + task_province_ele.substr(0, task_province_ele.length - 4) + "id" ).val(task_province_id.substring(0, task_province_id.length - 1));
			$("#" + task_province_ele).val(task_province_name.substring(0, task_province_name.length - 1));
			
		});
		
		/*���ɶԲ�ʡ��*/
		$("#btn-test-provice").on("click", function() {
			var applyProvinces = $("#task-province-start-id").val() ? $("#task-province-start-id").val() : "",
				targetProvinces =  $("#task-province-end-id").val() ? $("#task-province-end-id").val() : ""; 
			
			if(applyProvinces == "") {
				alert("��ѡ����ʡ�ݣ�");
				return ;
			}else if(targetProvinces == "") {
				alert("��ѡ��Ŀ��ʡ�ݣ�");
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
						alert("����ʡ������������ϵʧ��!");
						return ;
					}
					
					var listProvinces = "";
					
					$(data).each(function(i) {
						listProvinces = listProvinces +
									  "<li onclick='TaskJob.provinces.loadDetailPro(this," + this.task_apply_province + ")'><span>" + this.task_apply_province_name + "</span><span id='province_" + this.task_apply_province +"' >(" + this.total + "ʡ)</span></li>"
					});
					
					$("#task-test-provinces").html(listProvinces);
					
					MyGlobal.isBulidRelate.isBulid = true;
					
					$("#task-test-provinces-div, #task_test_label").show();
				},
				error: function() {
					alert("����ʡ������������ϵʧ��!");
				}
			});
			
		});
		
		
		/*��Ӱ�������*/
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
						alert("�������л�ȡʧ�ܣ�");
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
					alert("�������л�ȡʧ�ܣ�");
					return false;
				}
			});

			
		});
		
		/*�س������¼�*/
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
					alert("����д��������!");
					$("#task-case-list input[name='case-name-input']").focus();
					return ;
				}else if(ne_name == "" && $("#task-type").val() != 2){
					alert("����д��Ԫ����!");
					$("#task-case-list input[name='ne-name-input']").focus();
					return ;
				}else if(ne_name_apply == "" && $("#task-type").val() == 2){
					alert("����д������Ԫ����!");
					$("#task-case-list input[name='ne-name-input-apply']").focus();
					return ;
				}else if(ne_name_target == "" && $("#task-type").val() == 2){
					alert("����дĿ����Ԫ����!");
					$("#task-case-list input[name='ne-name-input-target']").focus();
					return ;
				}else if(test_type == "") {
					alert("����д��������!");
					$("#task-case-list input[name='test-type-input']").focus();
					return ;
				}else if(capability_name == "") {
					alert("����д��������!");
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
		
		/*д����*/
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
				"sProcessing":   "������...",
				"sLengthMenu":   "��ʾ _MENU_ ����",
				"sZeroRecords":  "û��ƥ����",
				"sInfo":         "��ʾ�� _START_ �� _END_ �������� _TOTAL_ ��",
				"sInfoEmpty":    "��ʾ�� 0 �� 0 �������� 0 ��",
				"sInfoFiltered": "(�� _MAX_ ��������)",
				"sInfoPostFix":  "",
				"sSearch":       "����:",
				"sUrl":          "",
				"sEmptyTable":     "��������Ϊ��",
				"sLoadingRecords": "������...",
				"sInfoThousands":  ",",
				"oPaginate": {
					"sFirst":    "��ҳ",
					"sPrevious": "��ҳ",
					"sNext":     "��ҳ",
					"sLast":     "ĩҳ"
				},
				"oAria": {
					"sSortAscending":  ": ���������д���",
					"sSortDescending": ": �Խ������д���"
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
 * ��������
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
            title: 'Excel����',
            layout: 'form',
            width: 550,
            closeAction: 'close',
            draggable: false,
            items: [importExcelForm],
            modal: true,
            buttons: [{
                id: 'isSaveAsAttach',
                boxLabel: '����Ϊ����&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
                xtype: 'checkbox'
            }, {
                text: '����',
                handler: function() {
                    //�ж��ļ�����Ϊ.xls
                    var isSave = Ext.getCmp('isSaveAsAttach').getValue();
                    var filePath = Ext.getCmp('importExcelFile').getValue();
                    var fileName = filePath.substring(filePath.lastIndexOf('\\') + 1, filePath.length);
                    var fileSuffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
                    if (fileSuffix != 'xls' && fileSuffix != 'xlsx') {
                        Ext.Msg.alert('��ʾ', '�����ļ���׺����Ϊ.xls��.xlsx');
                        return;
                    }
                    //�ύ����
                    importExcelForm.getForm().submit({
                        waitMsg: '������, ���Ժ�......',
                        waitTitle: 'Waiting.......',
                        method: 'post',
                        url:  "/CustJtJoinTaskAction/xlsCasesImport.do",
                        success: function(form, action) {
                            callback && callback(action.result.data);
                            importExcelWin.close();
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('��ʾ', action.result.response);
                        }
                    });
                }
            }, {
                text: '�ر�',
                handler: function() {
                    importExcelWin.close();
                }
            }]
        });
        Ext.getCmp('isSaveAsAttach').hide();
        importExcelWin.show();
    }
};
