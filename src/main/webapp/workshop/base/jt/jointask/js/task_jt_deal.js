var arrayUrl=getURLSearch();
var requestId = arrayUrl.id;

$("document").ready(function(){
	toolBar.init();
	task.init();
	taskCharts.init();
});

var toolBar = {
	
	init: function(){
		
		$("#delayModal").on("show.bs.modal", function(){
			$.ajax({
				type:"GET",
				cache: false,
				url:  "/CustJtJoinTaskAction.do?method=loadJoinTaskById",
				data:{id: requestId},
				dataType: 'json',
				success:function(data){
					if(data == "" || data == null) {
						alert("��������Ϣ��ȡʧ�ܣ�");
						return ;
					}
					
					$("#task-time").html(data[0].TASK_BEGIN_TIME.substring(0, data[0].TASK_BEGIN_TIME.length - 2) + " �� " + data[0].TASK_END_TIME.substring(0, data[0].TASK_END_TIME.length - 2));
					$("#task-start-time").val(data[0].TASK_BEGIN_TIME.substring(0, data[0].TASK_BEGIN_TIME.length - 2));
					$("#task-end-time").val(data[0].TASK_END_TIME.substring(0, data[0].TASK_END_TIME.length - 2));
				},
				error: function() {
					alert("��������Ϣ��ȡʧ�ܣ�");
				}
			});
		});
		
		
		$("#btn-task-delay, #btn-task-end, #btn-task-hang").on("click", function() {
			var target = $(this).attr("id");
			if(target == "btn-task-delay") {
				$("#delayModal").modal("toggle");
			}else if(target == "btn-task-end") {
				$("#taskEndModal").modal("toggle");
			}else if(target == "btn-task-hang") {
				$("#taskHangModal").modal("toggle");
			}
		});
		
		/*��ʼ��ʱ��ؼ�*/
		$("#task-start-time").datetimepicker({
			format: 'yyyy-mm-dd hh:ii',
			todayBtn: 1,
			linkField: "task-start-time",
	        linkFormat: "yyyy-mm-dd hh:ii"});
		
		$("#task-end-time").datetimepicker({
			format: 'yyyy-mm-dd hh:ii',
			todayBtn: 1,
			linkField: "task-end-time",
	        linkFormat: "yyyy-mm-dd hh:ii"});
		
		
		$('#btn-delay-submit').on('click', function () {
			var beginTime = $("#task-start-time").val(),
				endTime = $("#task-end-time").val();
			
			if(beginTime == null || beginTime == "") {
				alert("��ѡ����������ʼʱ�䣡");
				return ;
			}else if(endTime == null || endTime == "") {
				alert("����д�����������ʱ�䣡");
				return ;
			}else if(new Date(endTime.replace(/-/g,"/")) - new Date(beginTime.replace(/-/g,"/")) <= 0) {
				alert("��������Ľ���ʱ�������ڿ�ʼʱ�䣡");
				return ;
			}
			
			$.ajax({
				type:"POST",
				dataType:'json',
				cache: false,
				url: '/CustJtJoinTaskAction/delayJoinTaskTime.do',
				/*��������*/
				data:{data:JSON.stringify({"beginTime": beginTime, "endTime": endTime, "requestId" : requestId})},
				success:function(data) {
					if(data == "" || data == null) {
						alert("��ʱ����ʧ�ܣ�");
						return ;
					} 
					
					$("#task-time").html(data.data[0].TASK_BEGIN_TIME.substring(0, data.data[0].TASK_BEGIN_TIME.length - 2) + " �� " + data.data[0].TASK_END_TIME.substring(0, data.data[0].TASK_END_TIME.length - 2));
					$("#task-start-time").val(data.data[0].TASK_BEGIN_TIME.substring(0, data.data[0].TASK_BEGIN_TIME.length - 2));
					$("#task-end-time").val(data.data[0].TASK_END_TIME.substring(0, data.data[0].TASK_END_TIME.length - 2));
					
					$('#delayModal').modal('hide');
					
					alert("��ʱ����ɹ���");
				},
				error: function() {
					alert("��ʱ����ʧ�ܣ�");
				}
			});
		});
		
		$("#btn-end-submit").on("click", function(){
			$.ajax({
				type:"GET",
				dataType:'json',
				cache: false,
				url: '/CustJtJoinTaskAction/endJoinTask.do',
				/*��������*/
				data:{"requestId" : requestId},
				success:function(data) {
					if(data == "" || data == null) {
						alert("��������ʧ�ܣ�");
						return ;
					} 
					alert("��������ɹ���");
					$('#taskEndModal').modal('hide');
				},
				error: function(){
					alert("��������ʧ�ܣ�");
				}
			});
		});
		
		
		$("#btn-hang-submit").on("click", function(){
			$.ajax({
				type:"GET",
				dataType:'json',
				cache: false,
				url: '/CustJtJoinTaskAction/hangJoinTask.do',
				/*��������*/
				data:{"requestId" : requestId},
				success:function(data) {
					if(data == "" || data == null) {
						alert("��������ʧ�ܣ�");
						return ;
					} 
					alert("��������ɹ���");
					$('#taskHangModal').modal('hide');
				},
				error: function(){
					alert("��������ʧ�ܣ�");
				}
			});
		});
	}
}

var task = {
	
	list: {
		init: function() {
			this.els = {
					table : $("#task-list")
			},
			
			this.initTable();
			this.sums();
		},
		
		initTable: function(){
			var self = this,	
			
				checkAllHtml = '<div class="checkbox checkbox-info"><input id="allTaskCheck" name="allTaskCheck" class="styled" type="checkbox"><label for="allTaskCheck"></label></div>',

				TPL = {
					
					testCase : "<div style='font-weight:bold;'> " +
							   "	{TEST_CASE_SEQ}-{TEST_CASE_NAME} " +
							   "</div> " + 
							   "<div> " +
							   "	��������: {CAPABILITY_NAME} " +
							   "</div> " + 
							   "<div>  " + 
							   ($("#task-type").val() == 2 ? "<span>��������: {CASE_TEST_TYPE}</span><br><span>{TASK_APPLY_PROVINCE_NAME}({APPLY_CI_HOST})-{TASK_TARGET_PROVINCE_NAME}({TARGET_CI_HOST})</span>" : "<span>��Ԫ����: {APPLY_CI_HOST}</span><br><span>��������: {CASE_TEST_TYPE}</span>" ) +
							   "</div>",	
					
					textCase : "<span class='form-data' style='" + ($("#task-type").val() == "3" ? "display:none;" : "display:block;") + "'>{TASK_SESSION_ID}</span>" + ($("#task-type").val() == "3" ? "" : "<br>") + "<span class='form-data' style='display:none;'>{TASK_BUSINESS_DATA}</span>",
						
					textApplyPeople : "<span class='form-data'>{TASK_APPLY_PROVINCE}-{TASK_APPLY_MAN}</span><br><span class='form-data'>{TASK_APPLY_TEL}</span>",
					
					textTargetPeople : "<span class='form-data'>{TASK_APPLY_PROVINCE}-{TASK_TARGET_MAN}</span><br><span class='form-data'>{TASK_TARGET_TEL}</span>",

					select : "<select id={TASK_DETAIL_ID} value={TASK_JT_CHECK_RESULT} style='text-align:center;' onchange='task.list.change(this)'>" ,
					
					checkbox: '<div class="checkbox checkbox-success"><input id="task_{TASK_DETAIL_ID}" data-detailId="{TASK_DETAIL_ID}" name="taskDetailIds" class="styled" type="checkbox"><label for="task{TASK_DETAIL_ID}"></label></div>',
					
					textCheckReult : "<input id='CHECK_{TASK_DETAIL_ID}' class='checkResult' type='hidden' value='{TASK_JT_CHECK_RESULT}'>{TASK_JT_CHECK_RESULT_MEAN}<br/>" ,
     	    	   
					businessData : "<a href='#' data-container='body' data-toggle='popover' data-placement='bottom' data-content='{TASK_BUSINESS_DATA}' >�鿴ҵ������ </a>",
					
					//���õ����������
     	    	    reason : "	<a href='#' data-container='body' data-toggle='popover' data-placement='bottom' data-content='{TASK_JT_CHECK_REASON}' >{TASK_JT_CHECK_RESULT_MEAN}ԭ�� </a>" 
				},
			
				taskJtCheckData = getXmlFromHtmlData("task-jt-check-result");
			
			if(taskJtCheckData != null) {
				var $rows = $(taskJtCheckData).find("rowSet");
				$rows.each(function(i, el) {
					
					TPL.select = TPL.select + "<option value=" + $(el).find("VALUE").text()+">" + $(el).find("TEXT").text() + "</option>";
				});
				
				TPL.select = TPL.select + "</select>";
			}
			
			this.table = this.els.table.DataTable({
				searching: false,
				serverSide: true,
				ordering: true,
				lengthChange : false, // ����ÿҳ��ʾ��¼��������
				pageLength:5,
				responsive: true,
				autoWidth: true,
				ajax:function(data, callback, settings){
					
					var params = {
						
						page: data.start / data.length,
						size: data.length ,
						requestId: requestId,
						type: $("#task-type-list").val() == undefined ? "" : $("#task-type-list").val(),
						search: $("#task-search-text").val() == null ?��"" : $("#task-search-text").val(),
						listType: 2  //����ȷ�����б�
								
 					};
					
					$.ajax({
						type:"POST",
						dataType:"json",
						data:{data:JSON.stringify(params)},
						url: '/CustJtJoinTaskAction.do?method=loadTaskList',
					}).done(function(data){
						
						if(data == "" || data == null) {
							alert("�����б����ݻ�ȡʧ�ܣ�");
							return ;
						}
						
						data.recordsTotal = data.recordsFiltered;
						
						if(params.type == "" || params.type == "1") {
							$("#task-list-sum").html(data.recordsTotal);
						}else if(params.type == "2") {
							$("#task-unjoined-sum").html(data.recordsTotal);
						}else if(params.type == "3") {
							$("#task-joined-sum").html(data.recordsTotal);
						}
						
						callback(data);
					});
				},
				
				columns : [
				           {
				        	    title: checkAllHtml,
								sWidth: '33px',
								className: 'text-center',
								orderable: false,
								render: function(data, type, row) {
									return templateUtil.getStr(TPL.checkbox, row);
								}
				           },
				           
				           {
					        	title:'���԰���',
					        	sWidth : "28%",
					        	render:function(data, type, row){
					        		return templateUtil.getStr(TPL.testCase, row);
					        	}
				           },
				           {
				        	    title:'ʵ����������',
				        	    render: function(data, type, row) {
				        	    	return templateUtil.getStr(TPL.textCase + TPL.businessData, row);
				        	    }
				           },
				           {	
				        	   title:'������',
				        	   render: function(data, type, row){
					        	    //return templateUtil.getStr(TPL.textApplyPeople, row);
				        		   if(row.TASK_APPLY_MAN == 'null' && row.TASK_APPLY_TEL == 'null') {
				        			   return TPL.inputPeople;
				        	    	}else {
				        	    	   return templateUtil.getStr(TPL.textApplyPeople, row);
				        	    	} 
				        	   }
				           },
				           
				           {	
				        	   title:'����ʡ������',
				        	   render: function(data, type, row){
				        		   return templateUtil.getStr(TPL.textApplyPeople, row);
				        	   }
				           },
				           
				           {	
				        	   title:'Ŀ��ʡ������',
				        	   render: function(data, type, row){
				        		    return templateUtil.getStr(TPL.textTargetPeople, row);
				        	   }
				           },
				           
				           {
				        	   title:'��˽��',
				        	   sWidth : '80px',
				        	   render: function(data, type, row) {
				        		   if(row.TASK_JT_CHECK_RESULT == 'null' || row.TASK_JT_CHECK_RESULT == 0) {
				        			   return templateUtil.getStr(TPL.select, row);
				        		   }else {
				        			   if(row.TASK_JT_CHECK_REASON == 'null')
				        				   return templateUtil.getStr(TPL.textCheckReult, row);
				        			   else 
				        				   return templateUtil.getStr(TPL.textCheckReult + TPL.reason, row);
				        	       } 
				        		   
				        	   }
				           }
				        ]
			});
			
			
			if($("#task-type").val() == 2) {
				this.table.column(3).visible(false);
			}else{
				this.table.column([4,5]).visible(false);
			}
			
			//����˫���¼�
			$("#task-list tbody").on("dblclick", "tr", function(e){
				var data = $(this).find(".checkResult");
				
				if(data == null || data == "" || data.length == 0)
					return ;
				
				var detailId = data.attr("id") == null ? "" :��data.attr("id").split("_")[1],
					taskCheckResult = data.val(),
					
					selectHtml = "<select id='" + detailId + "' value='" + taskCheckResult + "' style='text-align:center;' onchange='task.list.change(this)'>";
				
				if(detailId == "" || taskCheckResult == undefined) {
					alert("���������� �޷��༭��");
					return ;
				}
				
				if(taskJtCheckData != null) {
					var $rows = $(taskJtCheckData).find("rowSet");
					$rows.each(function(i, el) {
						selectHtml = selectHtml + "<option value='" + $(el).find("VALUE").text() + "' " + ($(el).find("VALUE").text() == taskCheckResult ? "selected" : "")�� + " >" + $(el).find("TEXT").text() + "</option>";
					});
					
					selectHtml = selectHtml + "</select>";
				}
				
				$(this).find("td:last-child").html(selectHtml);
			});
			
			
			//���õ�����
			$("#task-list tbody").on("mouseover", "tr a", function(e){
				$(this).popover('show');
			}).on("mouseout", "tr a", function(){
				$(this).popover('hide');
			});
			
			
			$("#allTaskCheck").on("click", function(){
				$("#task-list > tbody > tr > td:first-child").find(":checkbox").prop("checked", $(this).is(":checked"));
			});
			
			$("#task-list > tbody").on("click", "input[name='taskDetailIds']", function(){
				if($("#task-list > tbody").find("input[name='taskDetailIds']").length ==  $("#task-list > tbody").find("input[name='taskDetailIds']:checked").length) {
					$("#allTaskCheck").attr("checked", true);
				}else {
					$("#allTaskCheck").attr("checked", false);
				}
			});
			
			//�������������¼�
			$("#btn-batch-deal").on("click", function() {
				var selectOptions = $("#task-list > tbody > tr > td:first-child").find("input:checked"),
					detailId = "",
					selectHtml = "";
				
				if(selectOptions.length == 0) {
					alert("����δѡ�����˵����ݣ�");
					return ;
				}
				
				if(taskJtCheckData != null) {
					var $rows = $(taskJtCheckData).find("rowSet");
					$rows.each(function(i, el) {
						selectHtml = selectHtml + "<option value='" + $(el).find("VALUE").text() + "' " + " >" + $(el).find("TEXT").text() + "</option>";
					});
				}
				
				$("#task-check-select").html(selectHtml);
				
				$('#taskCheckBatchModal').on('show.bs.modal', function () {
					$("#taskCheckResultMean, #taskCheckBatchReason").hide();
				})
				
				selectOptions.each(function(){
					detailId += $(this).data("detailid") + ",";
				});
				
				$("#task-detail-ids").val(detailId.substring(0, detailId.length - 1));
				
				$("#taskCheckBatchModal").modal('show');
			});
			
		},
		
		sums:function() {
			$.ajax({
				type:"GET",
				cache: false,
				/*�������� �������� ��������*/
				url:  "/CustJtJoinTaskAction.do?method=loadTaskListSums",
				data:{data: JSON.stringify({"requestId": requestId, "listType": 2})},
				dataType: 'json',
				success:function(data){
					if(data == "" || data == null) {
						alert("�����б�ͳ�����ݻ�ȡʧ�ܣ�");
						return ;
					}
					
					$("#task-list-sum").html(data.data.SUMS_ALL);
					$("#task-unjoined-sum").html(data.data.SUMS_UN_CHECK);
					$("#task-joined-sum").html(data.data.SUMS_HAS_CHECK);
				},
				error: function() {
					alert("�����б�ͳ�����ݻ�ȡʧ�ܣ�");
				}
			});
		},
		
		change: function(target){
			
			var self = this,
				$rowsData = $(target).parent().parent(),
				taskJtCheckResult = $rowsData.find("select").val() == null ? "" : $rowsData.find("select").val(),
				taskDetailId = $rowsData.find("select").attr("id") == null ? "" : $rowsData.find("select").attr("id");
			
			if(taskJtCheckResult == 2 || taskJtCheckResult == 4) {
				$("#taskReasonModal").on('show.bs.modal', function(){
					$("#task-detail-id").val(taskDetailId + ',' + taskJtCheckResult);
				});
				
				$("#taskReasonModal").modal('show');
				return ;
			}
 			
			$.ajax({
				type:"POST",
				url:  "/CustJtJoinTaskAction/writeJtCheckReason.do",
				cache: false,
				dataType: 'json',	
				data:{data : JSON.stringify({"requestId":taskDetailId, "reason" : "", "result": taskJtCheckResult })},
				success:function(data){
					if(data == "" || data == null) {
						alert("���������дʧ�ܣ�");
						return ;
					}
					
					self.table.ajax.reload();
				},	
				error:function(){
					alert("���������дʧ�ܣ�");
				}
			});
		}
	},	
	
	initEvent: function() {
		var self = this;	
		
		$("#btn-export-xls").attr("href", "/CustJtJoinTaskAction/exportXls.do?requestId=" + requestId + "&type=4");
		
		$("#task-type-list > li").on("click", function(){
			$("#task-type-list").find(".talbe-cur-tag-item").attr("class","table-tag-item");
			$(this).attr("class", "talbe-cur-tag-item");
			
			if($(this).attr("id") == "table-all") {
				$("#task-type-list").val("1");
			}else if($(this).attr("id") == "table-unjoin") {
				$("#task-type-list").val("2");
			}else if($(this).attr("id") == "table-joined") {
				$("#task-type-list").val("3");
			}
			
			self.list.table.ajax.reload();
		});
		
		$("#btn-task-search").on("click",function(){
			self.list.table.ajax.reload();
		});
		
		
		$("#task-search-text").keyup(function(e) {
			if(e.keyCode == 13) {
				self.list.table.ajax.reload();
			}
		});
		
		
		$("#btn-task-exit").on("click", function(){
			window.opener = null;
			window.open(' ', '_self', ' '); 
			window.close();
		});
		
		$("#menu-tag-list > li").on("click", function(){
			$("#menu-tag-list li > a").attr("class", "menu-item");
			$(this).find("a").attr("class", "cur-menu-item");
		});
		
		$("#btn-reason-submit").on("click", function(){
			var reason = $("#taskReason").val(),
				data = $("#task-detail-id").val().split(","),
				taskDetailId = data[0],
				taskCheckResult = data[1];
			
			if(reason == "") {
				alert("����дԭ��");
				return ;
			}
			
			$.ajax({
				type:"POST",
				url:  "/CustJtJoinTaskAction/writeJtCheckReason.do",
				cache: false,
				dataType: 'json',	
				data:{data : JSON.stringify({"requestId": taskDetailId, "reason" : reason, "result" : taskCheckResult})},
				success:function(data){
					if(data == "" || data == null) {
						alert("���������дʧ�ܣ�");
						return ;
					}
					
					$("#taskReason").val("");
					$("#taskReasonModal").modal("toggle");
					self.list.table.ajax.reload();
				},	
				error:function(){
					alert("���������дʧ�ܣ�");
				}
			});
		});
		
		$("#task-check-select").change(function(){
			if($(this).val() == 2 || $(this).val() == 4) {
				$("#taskCheckResultMean").html($(this).find("option:selected").text() + 'ԭ��') ;
				$("#taskCheckBatchReason,#taskCheckResultMean").show();
			}else {
				$("#taskCheckBatchReason, #taskCheckResultMean").hide();
			}
		});
		
		$("#btn-batch-submit").on("click", function(){
			var reason = $("#taskCheckBatchReason").val(),
				taskDetailId = $("#task-detail-ids").val(),
				taskCheckResult = $("#task-check-select").val();
			
			if(reason == "" && (taskCheckResult == 2 || taskCheckResult == 4)) {
				alert("����д���ɣ�");
				return ;
			}
			
			$.ajax({
				type:"POST",
				url:  "/CustJtJoinTaskAction/writeJtCheckReason.do",
				cache: false,
				dataType: 'json',	
				data:{data : JSON.stringify({"requestId": taskDetailId, "reason" : reason, "result" : taskCheckResult})},
				success:function(data){
					if(data == "" || data == null) {
						alert("���������дʧ�ܣ�");
						return ;
					}
					
					$("#taskCheckBatchReason").val("");
					$("#taskCheckBatchModal").modal("hide");
					self.list.table.ajax.reload();
				},	
				error:function(){
					alert("���������дʧ�ܣ�");
				}
			});
		});
		
		
	},
		
	
	init:function(){
		var self = this;
		
		$.extend($.fn.dataTable.defaults, {
			language: {
				"sProcessing":   "������...",
				"sLengthMenu":   "��ʾ _MENU_ ����",
				"sZeroRecords":  "û��ƥ����",
				"sInfo":         "��ʾ�� _START_ �� _END_ �������� _TOTAL_ ��",
				"sInfoEmpty":    "��ʾ�� 0 �� 0 �������� 0 ��",
				"sInfoFiltered": "(�� _MAX_ ��������)",
				"sInfoPostFix":  "",
				"sSearch":       "",
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
		
		$.ajax({
			type:"GET",
			cache: false,
			url:  "/CustJtJoinTaskAction.do?method=loadJoinTaskById",
			/*�������� �������� ��������*/
			data:{id: requestId},
			dataType: 'json',
			success:function(data){
				if(data == "" || data == null) {
					alert("��������Ϣ��ȡʧ�ܣ�");
					return ;
				}
				
				$("#task-id").html(data[0].TASK_ID);
				$("#task-submit-info").html(data[0].ORG_NAME + "-" + data[0].STAFF_NAME + "(" + data[0].TASK_APPLY_TEL + ", " + data[0].TASK_APPLY_MAIL + ")");
				$("#task-type").val(data[0].TASK_TYPE);
				$("#task-type-name").html(data[0].TASK_TYPE_NAME);
				$("#task-name").html(data[0].TASK_NAME);
				$("#task-time").html(data[0].TASK_BEGIN_TIME.substring(0, data[0].TASK_BEGIN_TIME.length - 2) + " �� " + data[0].TASK_END_TIME.substring(0, data[0].TASK_END_TIME.length - 2));
				
				//�滻�ı�������
				var innerHtml=data[0].TASK_DESC.replace(/\n/g,'<br/>');
				innerHtml=innerHtml.replace(new RegExp(' ', 'g'), '&nbsp;');
				$("#task-desc").html(innerHtml);
				
				$("#task-start-time").val(data[0].TASK_BEGIN_TIME.substring(0, data[0].TASK_BEGIN_TIME.length - 2));
				$("#task-end-time").val(data[0].TASK_END_TIME.substring(0, data[0].TASK_END_TIME.length - 2));
				
				self.list.init();
			},
			error: function() {
				alert("��������Ϣ��ȡʧ�ܣ�");
			}
		});
		
		this.initEvent();
	}
};

/**
 * �����������
 */

var taskCharts = {
	
	charts: function(){
		
		/**
		 *������ͼ
		 *@param panelType	
		 *@param vResult
		 *@param vDivId
		 *@param vRegion
		 *@param vWidth
		 *@param vHeight
		 *@param searchParam
		 *@return
		**/
		function buildPanel(panelType,vResult,vDivId,vRegion,vWidth,vHeight,searchParam){
		 	if(!vResult || vResult == 0){
		 		return ;
		 	}
		 	searchParam = searchParam ? searchParam :{};
			searchParam.random=Math.random();
		 	if(panelType.toLowerCase() == "fuschart"){
		 		
		 		var c1= new FusionChart({
					result : vResult,
					region : vRegion,
					height : vHeight
				});
				var panelTemp=new Ext.Panel({
					layout : "border",
					border : false,          
					items  : [c1],
					renderTo	: document.getElementById(vDivId)
				});			
				c1.search(searchParam);
				return c1;
		 	}
		}
		
		window.setTimeout(function(){
			buildPanel("fuschart","500000980","tasks-un-checked-charts","center","0","240",{REQUEST_ID : requestId});
			buildPanel("fuschart","500000981","task-undo-pro-charts","center","0","240",{REQUEST_ID : requestId});
		}, 3000);
		
	},
	
	lists: function() {
		$.ajax({
			type:"GET",
			cache: false,
			url:  "/CustJtJoinTaskAction/loadTaskJtCount.do",
			data:{id: requestId},
			dataType: 'json',
			success:function(data){
				if(data == "" || data == null) {
					alert("���������������б���Ϣ��ȡʧ�ܣ�");
					return ;
				}
				
				var listProvinces = "",
					count = "";
				
				$(".task-anaylis-total").find("font:eq(0)").html(data.total.TOTAL);
				$(".task-anaylis-total").find("font:eq(1)").html(data.total.UNDO_NUM);
				$("#total-unjoined-num").html(data.detailPros.length);
				
				$(data.detailCases).each(function(i, n){
					if(i < 4) {
						$(".case-total-detail-1 > ul").append("<li> " + 
												      	   	  "		<span>" + (i + 1) + ". " + this.TEST_CASE_NAME + "</span> " +
												      	   	  "  	<span>" + this.UNDONUM + "</span> " +
												      	   	  "	</li>");  
					}else if(i >=4 && i < 8) {
						$(".case-total-detail-2 > ul").append("<li> " + 
												      	   	  "		<span>" + (i + 1) + ". " + this.TEST_CASE_NAME + "</span> " +
												      	   	  "  	<span>" + this.UNDONUM + "</span> " +
												      	   	  "	</li>");  
					}
				});
				
				$(data.detailPros).each(function(){
					$("#case-undo-provinces-list > ul").append("<li> " + 
					  "	  <span>" + this.REGION_NAME + "[<font>"+ this.UNDONUM +"</font>]</span> " + 
		      	   	  "	</li>");  
				});
			},
			error: function() {
				alert("���������������б���Ϣ��ȡʧ�ܣ�");	
			}
		});
		
		$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
			  if(e.target.id == "taskTestAnalysisList") {
				  if($("#task-total-list").html() == "") {
					  this.table = $("#task-total-list").DataTable({
						  	searching: false,
							serverSide: true,
							ordering: true,
							lengthChange : false, // ����ÿҳ��ʾ��¼��������
							pageLength: 10,
							responsive: true,
							autoWidth: true,
							ajax:function(data, callback, settings){
								
								var params = {
										page: data.start / data.length,
										size: data.length ,
										requestId: requestId
				 					};
								
								$.ajax({
									type:"POST",
									dataType:"json",
									data:{data:JSON.stringify(params)},
									url:  "/CustJtJoinTaskAction/loadTaskAnalysisList.do"
								}).done(function(data){
									
									if(data == "" || data == null) {
										alert("���������б����ݻ�ȡʧ�ܣ�");
										return ;
									}
									
									data.recordsTotal = data.recordsFiltered;
									callback(data);
								});
							},
							
							columns : [
							           
							           {
								        	title:'ʡ��',
								        	render:function(data, type, row){
								        		return row.REGION_NAME;
								        	}
							           },
							           {
							        	    title:'��������',
							        	    render: function(data, type, row) {
							        	    	return row.CASE_COUNT;
							        	    }
							           },
							           {	
							        	   title:'¼������',
							        	   render: function(data, type, row){
							        		   return row.ENTRY_COUNT;
							        	   }
							           },
							           
							           {	
							        	   title:'��֤ͨ��',
							        	   render: function(data, type, row){
							        		   return row.CHECK_OK;
							        	   }
							           },
							           
							           {	
							        	   title:'��֤��ͨ��',
							        	   render: function(data, type, row){
							        		   return row.CHECK_FAIL;
							        	   }
							           },
							           
							           {	
							        	   title:'����',
							        	   render: function(data, type, row){
							        		   return row.CHECK_DOUBT;
							        	   }
							           },
							           
							           {	
							        	   title:'��������ȷ��',
							        	   render: function(data, type, row){
							        		   return row.UN_CHECK;
							        	   }
							           },
							        
							           {	
							        	   title:'��֤����',
							        	   render: function(data, type, row){
							        		   return row.CHECK_NUMS;
							        	   }
							           },
							           
							           {	
							        	   title:'δ��֤',
							        	   render: function(data, type, row){
							        		   return row.NOT_CHECK_NUMS;
							        	   }
							           }
							        ]
						}); 
				  }else{
					  this.table.ajax.reload();
				  }
				  
			  }
		});
		
	},
	
	init:function() {
		this.lists();
		this.charts();
	}	
}
