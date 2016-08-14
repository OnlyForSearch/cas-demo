$(function (){
	var $wrapper = $('#div-table-container');
	var $table = $('#table-user');

	var _table = $table.dataTable($.extend(true,{},CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
		ajax : function(data, callback, settings) {//ajax配置为function,手动调用异步查询
			//手动控制遮罩
			$wrapper.spinModal();
			//封装请求参数
			var param = userManage.getQueryCondition(data);
			console.log("param"+JSON.stringify(param));
			console.log(param);
			var data2={};
			data2.datas=param;
			console.log(data2);

/*
			$.ajax({
				url: "/user/loadTaskListTest2",
				// data:param,
				data:JSON.stringify(param),
				dataType: "json",
				type:"POST",
				contentType:"application/json",
				success:function(data){
					if(data.success === "false"){
						$("#COMPARE_RESULT").html(data.message);
						$("#COMPARE_RESULT").css("color","red");
					}
					else if(data.success === "true"){
						var htmlStr = "<span>新增行数："+data.NEW_CODE_ROWS+"</span>"
							+"<span>COPY行数："+data.COPY_CODE_ROWS+"</span>";

						$("#COMPARE_RESULT").html(htmlStr);
						$("#COMPARE_RESULT").css("color","black");
					}
				},
				error:function(data){

				}
			});
*/



			$.ajax({
				type: "post",

				url: "/user/loadTaskListTest2",
				cache : false,	//禁用缓存
				// data: {data: JSON.stringify(param)},	//传入已封装的参数
				data: JSON.stringify(param),	//传入已封装的参数
				dataType: "json",
				contentType:"application/json",
				success: function(result) {
					//setTimeout仅为测试遮罩效果
					setTimeout(function(){
						//异常判断与处理
						if (result.errorCode) {
							$.dialog.alert("查询失败。错误码："+result.errorCode);
							return;
						}

						//封装返回数据，这里仅演示了修改属性名
						var returnData = {};
						returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
						returnData.recordsTotal = result.total;
						// returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
						returnData.data = result.pageData;
						//关闭遮罩
						$wrapper.spinModal(false);
						//调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
						//此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
						callback(returnData);
					},100);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$.dialog.alert(textStatus);

					$.dialog.alert("查询失败111");
					$wrapper.spinModal(false);
				}
			});
		},
		columns: [
			/*CONSTANT.DATA_TABLES.COLUMN.CHECKBOX,
			{
				className : "ellipsis",	//文字过长时用省略号显示，CSS实现
				data: "name",
				render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
			},*/
			{
				className : "ellipsis",
				data: "position",
				render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
				//固定列宽，但至少留下一个活动列不要固定宽度，让表格自行调整。不要将所有列都指定列宽，否则页面伸缩时所有列都会随之按比例伸缩。
				//切记设置table样式为table-layout:fixed; 否则列宽不会强制为指定宽度，也不会出现省略号。
				width : "80px"
			},
			{
				data : "status",
				width : "80px",
				render : function(data,type, row, meta) {
					return '<i class="fa fa-male"></i> '+(data?"在线":"离线");
				}
			},
			{
				data : "start_date",
				width : "80px"
			},
			{
				className : "td-operation",
				data: null,
				defaultContent:"",
				orderable : false,
				width : "120px"
			}
		],
		"createdRow": function ( row, data, index ) {
			//行渲染回调,在这里可以对该行dom元素进行任何操作
			//给当前行加样式
			/*	if (data.role) {
			 $(row).addClass("info");
			 }*/
			//给当前行某列加样式
			$('td', row).eq(3).addClass(data.status?"text-success":"text-error");
			//不使用render，改用jquery文档操作呈现单元格
			var $btnEdit = $('<button type="button" class="btn btn-small btn-primary btn-edit">修改</button>');
			var $btnDel = $('<button type="button" class="btn btn-small btn-danger btn-del">删除</button>');
			$('td', row).eq(5).append($btnEdit).append($btnDel);

		},
		"drawCallback": function( settings ) {
			//渲染完毕后的回调
			//清空全选状态
			$(":checkbox[name='cb-check-all']",$wrapper).prop('checked', false);
			//默认选中第一行
			$("tbody tr",$table).eq(0).click();
		}
	})).api();//此处需调用api()方法,否则返回的是JQuery对象而不是DataTables的API对象



});

var userManage = {
	currentItem : null,
	fuzzySearch : true,
	getQueryCondition : function(data) {
		var param = {};
		//组装排序参数
		if (data.order&&data.order.length&&data.order[0]) {
			switch (data.order[0].column) {
				case 1:
					param.orderColumn = "name";
					break;
				case 2:
					param.orderColumn = "position";
					break;
				case 3:
					param.orderColumn = "status";
					break;
				case 4:
					param.orderColumn = "start_date";
					break;
				default:
					param.orderColumn = "name";
					break;
			}
			param.orderDir = data.order[0].dir;
		}
		//组装查询参数
		param.fuzzySearch = userManage.fuzzySearch;
		if (userManage.fuzzySearch) {
			param.fuzzy = $("#fuzzy-search").val();
		}else{
			param.name = $("#name-search").val();
			param.position = $("#position-search").val();
			param.office = $("#office-search").val();
			param.extn = $("#extn-search").val();
			param.status = $("#status-search").val();
			param.role = $("#role-search").val();
		}
		//组装分页参数
		param.startIndex = data.start;
		param.pageSize = data.length;

		param.draw = data.draw;

		return param;
	},

};

/*
var CONSTANT = {
	DATA_TABLES : {
		DEFAULT_OPTION : { //DataTables初始化选项
			language: {
				"sProcessing":   "处理中...",
				"sLengthMenu":   "每页 _MENU_ 项",
				"sZeroRecords":  "没有匹配结果",
				"sInfo":         "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
				"sInfoEmpty":    "当前显示第 0 至 0 项，共 0 项",
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
					"sLast":     "末页",
					"sJump":     "跳转"
				},
				"oAria": {
					"sSortAscending":  ": 以升序排列此列",
					"sSortDescending": ": 以降序排列此列"
				}
			},
			autoWidth: false,	//禁用自动调整列宽
			stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
			order: [],			//取消默认排序查询,否则复选框一列会出现小箭头
			processing: false,	//隐藏加载提示,自行处理
			serverSide: true,	//启用服务器端分页
			searching: false,	//禁用原生搜索
			bLengthChange: false
		},
		COLUMN: {
			CHECKBOX: {	//复选框单元格
				className: "td-checkbox",
				orderable: false,
				width: "30px",
				data: null,
				render: function (data, type, row, meta) {
					return '<input type="checkbox" class="iCheck">';
				}
			}
		},
		RENDER: {	//常用render可以抽取出来，如日期时间、头像等
			ELLIPSIS: function (data, type, row, meta) {

				console.log("data::"+data);

				data = data||"";
				return '<span title="' + data + '">' + data + '</span>';
			}
		}
	}
};*/
