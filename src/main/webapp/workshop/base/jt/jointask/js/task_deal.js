var arrayUrl=getURLSearch(), 
	requestId = arrayUrl.id,
	regionId = arrayUrl.region;

$("document").ready(function(){
	task.init();
});

var task = {
	
	list: {
		init: function() {
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
			
			this.els = {
					table : $("#task-list")
			},
			
			this.initTable();
			this.sums();
			
			$("#tag-list").height($("#task-content-list").height());
		},
		
		initTable: function(){
			var checkAllHtml = '<div class="checkbox checkbox-info"><input id="allNeCheck" name="allNeCheck" class="styled" type="checkbox"><label for="allNeCheck"></label></div>',
				cssStyle =  $("#task-type").val() == "2" ? "" : "width:254px;",
				TPL = {
				
				testCase : "<div style='font-weight:bold;'> " +
						   "	{TEST_CASE_SEQ}-{TEST_CASE_NAME} " +
						   "</div> " + 
						   "<div> " +
						   "	测试能力: {CAPABILITY_NAME} " +
						   "</div> " + 
						   "<div>  " + 
						   ($("#task-type").val() == 2 ? "<span>测试类型: {CASE_TEST_TYPE}</span><br><span>对测省份：{TASK_APPLY_PROVINCE_NAME}({APPLY_CI_HOST})-{TASK_TARGET_PROVINCE_NAME}({TARGET_CI_HOST})</span>" : "<span>网元名称: {APPLY_CI_HOST}</span><br><span>测试类型: {CASE_TEST_TYPE}</span>" ) +
						   "</div>",	
				
				inputCase: " <input type='text' class='form-control' style='"+ cssStyle + ($("#task-type").val() == "3" ? "display:none;" : "display:block;") + "' placeholder='请输入联调所用的session_id' title='请输入联调所用的session_id' onchange='task.list.change(this)'> " +
					   " <input type='text' class='form-control' style='" + cssStyle + "' placeholder='请输入业务数据' title='请输入业务数据' onchange='task.list.change(this)'  >" ,
				 
				inputPeople:  " <input type='text' class='form-control' style='" + cssStyle + "' placeholder='请输入联调人员姓名' title='请输入联调人员姓名' onchange='task.list.change(this)'><br> " +
				   " <input type='text' class='form-control' style='" + cssStyle + "' placeholder='请输入联调人员联系方式' title='请输入联调人员联系方式' onchange='task.list.change(this)'>" ,
				   
				textCase : "<span class='form-data' title='SESSION-ID' style='" + ($("#task-type").val() == "3" ? "display:none;" : "display:block;") + "'>{TASK_SESSION_ID}</span>" + ($("#task-type").val() == "3" ? "" : "<br>") + "<span class='form-data' titile='业务数据' style='display:none;'>{TASK_BUSINESS_DATA}</span>",
				
				textApplyPeople : "<span class='form-data' title='联调人员'>{TASK_APPLY_MAN}</span><br><span class='form-data' title='联调人员联系方式'>{TASK_APPLY_TEL}</span>",
				
				textTargetPeople : "<span class='form-data'>{TASK_TARGET_MAN}</span><br><span class='form-data'>{TASK_TARGET_TEL}</span>",
					   
				select : "<select id={TASK_DETAIL_ID} value={TASK_PROVINCE_RESULT} style='text-align:center;' onchange='task.list.change(this)'>",
				
				textProResult: "<input id='CHECK_{TASK_DETAIL_ID}' value='{TASK_PROVINCE_RESULT}' type='hidden'>{TASK_PROVINCE_RESULT_MEAN}",
				
				checkResult: "<span class='taskProResult' style='display:none;'>{TASK_PROVINCE_RESULT}</span><input id='CHECK_{TASK_DETAIL_ID}' class='checkResult' type='hidden' value='{TASK_JT_CHECK_RESULT}'>{TASK_JT_CHECK_RESULT_MEAN} <br>",
				
				businessData : "<a href='#' data-container='body' data-toggle='popover' data-placement='bottom' data-content='{TASK_BUSINESS_DATA}' >查看业务数据 </a>",
				
				//设置弹出框的内容
 	    	    reason : "	<a href='#' data-container='body' data-toggle='popover' data-placement='bottom' data-content='{TASK_JT_CHECK_REASON}' >{TASK_JT_CHECK_RESULT_MEAN}原因 </a>" 
			};
			
			var taskProvinceData = getXmlFromHtmlData("task-pro-result");
			if(taskProvinceData != null) {
				var $rows = $(taskProvinceData).find("rowSet");
				$rows.each(function(i, el) {
					TPL.select = TPL.select + "<option value=" + $(el).find("VALUE").text()+">" + $(el).find("TEXT").text() + "</option>";
				});
				
				TPL.select = TPL.select + "</select>";
			}

			this.table = this.els.table.DataTable({
				searching: false,
				serverSide: true,
				ordering: true,
				lengthChange : false, // 隐藏每页显示记录数下拉框
				pageLength:5,
				responsive: true,
				ajax:function(data, callback, settings){
					
					var params = {
						page: data.start / data.length,
						size: data.length ,
						type: $("#task-type-list").val(), 
						requestId: requestId,
						regionId : regionId,
						listType: 1  //省份列表
					};
					
					
					$.ajax({
						type:"POST",
						dataType:"json",
						data:{data:JSON.stringify(params)},
						url: '/CustJtJoinTaskAction.do?method=loadTaskList',
					}).done(function(data){
						
						if(data == "" || data == null) {
							alert("联调列表数据获取失败！");
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
					        	title:'测试案例',
					        	sWidth : "28%",
					        	render:function(data, type, row){
					        		return templateUtil.getStr(TPL.testCase, row);
					        	}
				           },
				           {
				        	    title:'实际联调案例',
				        	    render: function(data, type, row) {
				        	    	if(row.TASK_SESSION_ID == 'null' && row.TASK_BUSINESS_DATA == 'null') {
				        	    		return TPL.inputCase;
				        	    	}else {
				        	    		return templateUtil.getStr(TPL.textCase + TPL.businessData, row);
				        	    	}
				        	    }
				           },
				           {	
				        	   title:'联调人',
				        	   render: function(data, type, row){
				        		   if(row.TASK_APPLY_MAN == 'null' && row.TASK_APPLY_TEL == 'null') {
				        			   return TPL.inputPeople;
				        	    	}else {
				        	    	   return templateUtil.getStr(TPL.textApplyPeople, row);
				        	    	} 
				        	   }
				           },
				           
				           {	
				        	   title:'发起省联调人',
				        	   render: function(data, type, row){
				        		   if(row.TASK_APPLY_MAN == 'null' && row.TASK_APPLY_TEL == 'null') {
				        			   return TPL.inputPeople;
				        	    	}else {
				        	    	   return templateUtil.getStr(TPL.textApplyPeople, row);
				        	    	} 
				        	   }
				           },
				           
				           {	
				        	   title:'目的省联调人',
				        	   render: function(data, type, row){
				        		   if(row.TASK_TARGET_MAN == 'null' && row.TASK_TARGET_TEL == 'null') {
				        			   return TPL.inputPeople;
				        	    	}else {
				        	    	   return templateUtil.getStr(TPL.textTargetPeople, row);
				        	    	} 
				        	   }
				           },
				           
				           {
				        	   title:'联调结果',
				        	   sWidth : '80px',
				        	   render: function(data, type, row) {
				        		   if(row.TASK_JT_CHECK_RESULT != "0" && row.TASK_JT_CHECK_RESULT != undefined) {
				        			   if(row.TASK_JT_CHECK_REASON == 'null')
				        				   return templateUtil.getStr(TPL.checkResult, row);
				        			   else
				        				   return templateUtil.getStr(TPL.checkResult + TPL.reason, row);
				        		   }else {
				        			   if(row.TASK_PROVINCE_RESULT == 'null' || (row.TASK_PROVINCE_RESULT == 0 && row.TASK_APPLY_MAN == 'null')) {
					        			   return templateUtil.getStr(TPL.select, row);
					        		   }else {
					        	    	   return templateUtil.getStr(TPL.textProResult, row);
					        	       } 
				        		   }
				        	   }
				           }
				        ]
			});
			
			
			if($("#task-type").val() == 2) {
				this.table.column(2).visible(false);
			}else{
				this.table.column([3,4]).visible(false);
			}
			
			//设置弹出层
			$("#task-list tbody").on("mouseover", "tr a", function(e){
				$(this).popover('show');
			}).on("mouseout", "tr a", function(){
				$(this).popover('hide');
			});
			
			$("#task-list tbody").on("dblclick", "tr", function(e){
				var data = $(this).find(".form-data")
					checkValue = $(this).find(".checkResult").attr("id") == null ? "" : $(this).find(".checkResult").attr("id").split("_")[1];//审核结果
				
				if(data == null || data == "" || data.length == 0 || checkValue == 1 || checkValue == 3)
					return ;
				
				var taskSessionId =  $("#task-type").val() == 3 ? "" : $(data[0]).html(),
					taskBussinessData = $(data[1]).html(),
					taskApplyMan = $(data[2]).html(),
					taskApplyTel = $(data[3]).html(),
					
					taskTargetMan = $("#task-type").val() == 2 ? $(data[4]).html() : "",
					taskTargetTel = $("#task-type").val() == 2 ? $(data[5]).html() : "",
					
					detailId = $(this).find("td:last-child > input").attr("id").split("_")[1],
					taskProResult = $("#task-type").val() == 2 && checkValue != "" ? $(this).find("td:last-child span").html() : $(this).find("td:last-child > input").val(),
					
					selectHtml = "<select id='" + detailId + "' value='" + taskProResult + "' style='text-align:center;' onchange='task.list.change(this)'>";
				
				if(detailId == undefined || taskProResult == undefined) {
					alert("该数据有误， 无法编辑！");
					return ;
				}
				
				if(taskProvinceData != null) {
					var $rows = $(taskProvinceData).find("rowSet");
					$rows.each(function(i, el) {
						selectHtml = selectHtml + "<option value='" + $(el).find("VALUE").text() + "' " + ($(el).find("VALUE").text() == taskProResult ? "selected" : "")　 + " >" + $(el).find("TEXT").text() + "</option>";
					});
					
					selectHtml = selectHtml + "</select>";
				}
				
				if($("#task-type").val() == 2) {
					$(this).find("td:eq(2)").html(" <input type='text' class='form-control' style='' placeholder='请输入联调人员姓名' title='请输入联调人员姓名' onchange='task.list.change(this)' value='" + taskApplyMan +"'> " +
							   " <input type='text' class='form-control' style='' placeholder='请输入联调人员联系方式' title='请输入联调人员联系方式' onchange='task.list.change(this)' value='" + taskApplyTel + "'>" );
					$(this).find("td:eq(3)").html(" <input type='text' class='form-control' style='' placeholder='请输入联调人员姓名' title='请输入联调人员姓名' onchange='task.list.change(this)' value='" + taskTargetMan +"'> " +
							   " <input type='text' class='form-control' style='' placeholder='请输入联调人员联系方式' title='请输入联调人员联系方式' onchange='task.list.change(this)' value='" + taskTargetTel + "'>" );

				}else{
					$(this).find("td:eq(2)").html(" <input type='text' class='form-control' style='"+ cssStyle + "' placeholder='请输入联调人员姓名' title='请输入联调人员姓名' onchange='task.list.change(this)' value='" + taskApplyMan +"'> " +
							   " <input type='text' class='form-control' style='"+ cssStyle + "' placeholder='请输入联调人员联系方式' title='请输入联调人员联系方式' onchange='task.list.change(this)' value='" + taskApplyTel + "'>" );
				}
				
				$(this).find("td:eq(1)").html(" <input type='text' class='form-control' style='" + cssStyle +  ($("#task-type").val() == "3" ? "display:none;" : "display:block;") + "' placeholder='请输入联调所用的session_id' title='请输入联调所用的session_id' onchange='task.list.change(this)' value='" + taskSessionId + "'> " +
						   " <input type='text' class='form-control' style='" + cssStyle + "' placeholder='请输入业务数据' title='请输入业务数据' onblur='task.list.change(this)'  value='" + taskBussinessData + "'>");
				
				$(this).find("td:last-child").html(selectHtml);
			});
			
		},
		
		exportExls: function(){
			
		},
		
		importExls: function(){
			AttachOper.openImportWin();
		},
		
		checkEqual: function(target) {
			var pattern=/[`~!@#\$%\^\&\*\(\)_\+<>\?:\[\]]/im; 
			if(pattern.test($(target).val())) {
				alert("输入的内容不合法！");
				$(target).val($(target).val().substring(0, $(target).val().length - 1));
				return false;
			}
			
		},
		
		sums:function() {
			$.ajax({
				type:"GET",
				cache: false,
				url:  "/CustJtJoinTaskAction.do?method=loadTaskListSums",
				dataType: 'json',
				data:{data: JSON.stringify({"requestId": requestId, "listType": 1, "regionId" : regionId})},
				success:function(data){
					if(data == "" || data == null) {
						alert("联调列表统计数据获取失败！");
						return ;
					}
					
					$("#task-list-sum").html(data.data[0].sums_all);
					$("#task-unjoined-sum").html(data.data[0].sums_un_join);
					$("#task-joined-sum").html(data.data[0].sums_has_join);
				},
				error: function() {
					alert("联调列表统计数据获取失败！");
				}
			});
		},
		
		change: function(target, event){
			
			var self = this,
				$rowsData = $(target).parent().parent(),
				data = $rowsData.find(".form-control"), 
				
				sessionId = $(data[0]).val() == null || $("#task-type").val() == 3 ? "" : $(data[0]).val(),
				businessData = $(data[1]).val() == null ? "" : $(data[1]).val(),
				taskApplyMan = $(data[2]).val() == null ? "" : $(data[2]).val(),
				taskApplyTel = $(data[3]).val() == null ? "" : $(data[3]).val(),
			    
			    taskTargetMan = $("#task-type").val() == 2 ? ($(data[4]).val() == null ? "" : $(data[4]).val()) : "",
			    taskTargetTel = $("#task-type").val() == 2 ? ($(data[5]).val() == null ? "" : $(data[5]).val()) : "",
						
				taskProResult = $rowsData.find("select").val() == null ? "" : $rowsData.find("select").val(),
				taskDetailId = $rowsData.find("select").attr("id") == null ? "" : $rowsData.find("select").attr("id");
			    
			if((sessionId == "" || businessData == "" || taskApplyMan == "" || taskApplyTel == "" || taskTargetMan =="" || taskTargetTel =="") && taskProResult == 0) {
				return ;
			} 
			    
			if(sessionId == "" && $("#task-type").val() != "3") {
				alert("请输入联调所用的session_id!");
				$(data[0]).focus();
				return ;
			}else if(businessData == "") {
				alert("请输入业务数据!");
				$(data[1]).focus();
				return ;
			}else if(taskApplyMan == "") {
				alert("请输入联调人员姓名!");
				$(data[2]).focus();
				return ;
			}else if(taskApplyTel == "") {
				alert("请输入联调人员联系方式!");
				$(data[3]).focus();
				return ;
			}else if($("#task-type").val() == 2 && taskTargetMan == "") {
				alert("请输入联调人员姓名！");
				$(data[4]).focus();
				return ;
			}else if($("#task-type").val() == 2 && taskTargetTel == "") {
				alert("请输入联调人员联系方式！");
				$(data[5]).focus();
				return ;
			}else if(taskProResult == 0) {
				return ;
			}
			
			$.ajax({
				type:"GET",
				url:  "/CustJtJoinTaskAction.do?method=updateJoinTask",
				cache: false,
				dataType: 'json',	
				data:{data : JSON.stringify({"sessionId":sessionId, "businessData" : businessData, "taskApplyMan" : taskApplyMan, "taskApplyTel" : taskApplyTel, "taskTargetMan": taskTargetMan, "taskTargetTel":taskTargetTel, "taskProResult" : taskProResult, "id" : taskDetailId})},
				success:function(data){
					if(data == "" || data == null) {
						alert("联调数据更新失败！");
						return ;
					}
					
					self.table.ajax.reload();
				},
				error:function(){
					alert("联调数据更新失败！");
				}
			});
		}
	},	
	
	initEvent: function() {
		var self = this;	
		
		$("#btn-import-xls").on("click", function(){
			self.list.importExls();
		});
		
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
			
			$("#btn-export-xls").attr("href", "/CustJtJoinTaskAction/exportXls.do?requestId=" + requestId + "&type=" + $("#task-type").val() + "&regionId=" + regionId + "&taskType=" + $("#task-type").val() + "&listType=" + ($("#task-type-list").val() == null || $("#task-type-list").val() == "" ? "1" : $("#task-type-list").val()));
			self.list.table.ajax.reload();
		});
		
		$("#btn-task-exit").on("click", function(){
			if(confirm("您的数据确定保存了嘛?")) {
				window.opener = null;
				window.open(' ', '_self', ' '); 
				window.close();
			}
		});
		
		$("#menu-tag-list > li").on("click", function(){
			$("#menu-tag-list li > a").attr("class", "menu-item");
			$(this).find("a").attr("class", "cur-menu-item");
		});
	},
	
	init:function(){
		var self = this;
		$.ajax({
			type:"GET",
			cache: false,
			url:  "/CustJtJoinTaskAction.do?method=loadJoinTaskById",
			data:{id: requestId},
			dataType: 'json',
			success:function(data){
				if(data == "" || data == null) {
					alert("联调表单信息获取失败！");
					return ;
				}
				$("#task-id").html(data[0].TASK_ID);
				$("#task-submit-info").html(data[0].ORG_NAME + "-" + data[0].STAFF_NAME + "(" + data[0].TASK_APPLY_TEL + ", " + data[0].TASK_APPLY_MAIL + ")");
				$("#task-type-name").html(data[0].TASK_TYPE_NAME);
				$("#task-type").val(data[0].TASK_TYPE);
				$("#task-name").html(data[0].TASK_NAME);
				$("#task-time").html(data[0].TASK_BEGIN_TIME.substring(0, data[0].TASK_BEGIN_TIME.length - 2) + " 到 " + data[0].TASK_END_TIME.substring(0, data[0].TASK_END_TIME.length - 2));
				
				//替换文本的内容
				var innerHtml=data[0].TASK_DESC.replace(/\n/g,'<br/>');
				innerHtml=innerHtml.replace(new RegExp(' ', 'g'), '&nbsp;');
				$("#task-desc").html(innerHtml);
				
				self.list.init();
				
				$("#btn-export-xls").attr("href", "/CustJtJoinTaskAction/exportXls.do?requestId=" + requestId + "&type=" + $("#task-type").val() + "&regionId=" + regionId + "&taskType=" + $("#task-type").val() + "&listType=" + ($("#task-type-list").val() == null || $("#task-type-list").val() == "" ? "1" : $("#task-type-list").val()));
			},
			error: function() {
				alert("联调表单信息获取失败！");
			}
		});
		
		this.initEvent();
	}
};

/**
 * 附件操作
 */
var AttachOper = {
	
    openImportWin: function() {
        this.showImportExcelWin(function(){
        	task.list.table.ajax.reload();
//        	task.list.sums();
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
                    
                    var taskType = "";
                    
                    if($("#task-type").val() == "2") {
                    	taskType = "com.base.project.jt.util.assetImportUtil.Template_Province_JoinTask";
                    }else if($("#task-type").val() == "3") {
                    	taskType = "com.base.project.jt.util.assetImportUtil.Template_File_JoinTask";
                    }else {
                    	taskType = "com.base.project.jt.util.assetImportUtil.Template_Jt_JoinTask";
                    }
                    
                    //提交导入
                    importExcelForm.getForm().submit({
                        waitMsg: '导入中, 请稍候......',
                        waitTitle: 'Waiting.......',
                        method: 'post',
                        url:  "/CustJtJoinTaskAction.do?method=xlsImport&taskType=" + taskType + "&type=" + $("#task-type").val(),
                        success: function(form, action) {
                            var importFileInfo, execStatement;
                            var resultXml = action.result.response;
                            var dataXML = new ActiveXObject("Microsoft.XMLDOM");

                            callback && callback();
                            
                            //无需添加至附件
                            if (resultXml == 'null') { 
                                importExcelWin.close();
                                return;
                            }
                            resultXml = AttachOper.rebuildImportResultXml(resultXml); //替换返回结果信息
                            dataXML.loadXML(resultXml); //加载返回结果信息为XML对象
                            importFileInfo = dataXML.selectSingleNode("/root/rowSet"); //获取导入文件信息
                            execStatement = '' + attachPool.uniqueID + '' + '.attach.add(importFileInfo, "C")';
                            eval(execStatement);
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
    },

    rebuildImportResultXml: function(resultXml) {
        if (!resultXml) {
            alert('导入文件时返回结果失败!!!');
            return null;
        }
        resultXml = resultXml.replaceAll("target=download", "target=\"download\"");
        resultXml = resultXml.replaceAll("<ROOT>", "<root>");
        resultXml = resultXml.replaceAll("</ROOT>", "</root>");
        resultXml = resultXml.replaceAll("<ERROR_CODE>", "<error_code>");
        resultXml = resultXml.replaceAll("</ERROR_CODE>", "</error_code>");
        resultXml = resultXml.replaceAll("<ROWSET", "<rowSet");
        resultXml = resultXml.replaceAll("</ROWSET>", "</rowSet>");
        resultXml = resultXml.replaceAll("<NAME>", "<name>");
        resultXml = resultXml.replaceAll("</NAME>", "</name>");
        resultXml = resultXml.replaceAll("<A", "<a");
        resultXml = resultXml.replaceAll("</A>", "</a>");
        resultXml = resultXml.replaceAll("<SIZE>", "<size>");
        resultXml = resultXml.replaceAll("</SIZE>", "</size>");
        resultXml = resultXml.replaceAll("<STAFFNAME>", "<staffName>");
        resultXml = resultXml.replaceAll("</STAFFNAME>", "</staffName>");
        resultXml = resultXml.replaceAll("<UPLOADTIME>", "<uploadTime>");
        resultXml = resultXml.replaceAll("</UPLOADTIME>", "</uploadTime>");

        return resultXml;
    }
};