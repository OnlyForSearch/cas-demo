<%@ page language="java" import="java.util.*" pageEncoding="GBK" %>

<!DOCTYPE HTML>
<html>
<head>
    <title>��������༭</title>

    <meta http-equiv="Content-Type" content="text/html; charset=GBK">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="../../../../resource/js/tables/bootstrap-3.3.7/dist/css/bootstrap.css">
    <link rel="stylesheet"
          href="../../../../resource/js/tables/DataTables-1.10.12/media/css/dataTables.bootstrap.min.css">
    <link rel="stylesheet"
          href="../../../../resource/js/tables/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.min.css">


    <style type="text/css">
        body {
            background: #F1F1F1;
            font-family: "΢���ź� Regular", "΢���ź�";
        }

        .task-head {
            width: 100%;
            background-color: #5EACDA;
        }

        .task-head > .task-title {
            display: inline-block;
        }

        .task-title > span {
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            color: white;
            padding: 12px 30px;
        }

        /*

                .task-container {

                    background: #FFF;
                    margin: 8px 20px 20px;
                    height: 800px;
                    padding: 10px 0px;
                }
        */

        .select-container {
            margin-bottom: 5px;
        }

        .content-container {
            background: #fff;
            margin: 10px 15px;
            padding: 10px;
        }

        .select-container .select-area {
            width: 28%;
            float: left;
        }

        .select-area h3 {
            margin-top: 0px;
            font-size: 14px;
        }

        .select-area-margin {
            margin-right: 7%;
        }

        .select-container .select-area h3 {
            background: #f1f1f1;
            padding: 6px 10px;
            font-weight: 600;
        }

        .select-container .select-content {
            padding: 4px 15px;
            background-color: #fbfbfb;
            height: 100px;
        }

        .select-content .btn {
            margin-right: 10px;
            margin-top: 10px;
            /*background-color: #fbfbfb;*/
            /*padding: 4px 6px;*/
        }

        .btn-grass {
            color: #ffffff;
            background-color: #14A793;
            border-color: #14A793;
        }

        .btn-grass:hover,
        .btn-grass:focus,
        .btn-grass:active,
        .btn-grass.active,
        .open .dropdown-toggle.btn-grass {
            color: #ffffff;
            background-color: #55a799;
            border-color: #55a799;
        }

        /* .select-content .btn-grass {
             background: #14A793;
         }
 */
        .select-result {
            margin-top: 12px;
            background-color: #F2F1F6;
            /*background-color: #F2F1F6;*/
            padding-left: 10px;
            padding-bottom: 4px;
            height: 40px;
            /*  margin-left: 20px;
              margin-right: 18px;*/
        }

        .select-result > span {
            display: inline-block;
            float: left;
            padding: 12px 10px 14px
        }

        .select-result-list {
            float: left;
            margin: 7px 15px 7px;
            border: 1px solid #797979;
            font-weight: normal;
            padding: 0 8px;
            background: #fff;
        }

        .select-result-list label {
            color: #999999;
        }

        .select-result-list strong {
            color: red;
        }

        .select-content label {
            font-weight: 400;
        }

        .select-content .select-sub {
            margin-top: 10px;
        }

        .add-top-margin {
            margin-top: 10px;
        }

        .search-btn {
            position: absolute;
            top: 0;
            right: 0;
            background: #14A793;
            padding-top: 2px;
            padding-bottom: 3px
        }

        .btn-task {
            background: #14A793;
            color: #fff;
        }

        .onClose {
            font-weight: 900;
            font-size: 16px;
        }

        th {
            text-align: center;
        }

        tr {
            text-align: center;
        }

        /*.select-result .btn:hover, .btn:focus {
            color: #fff;

        }*/

        .select-result {
            list-style: none;
        }

        .select-result dd {
            border-radius: 2px;
            border: 1px solid #797979;
            background: #fff;
            display: inline-block;
            cursor: pointer;
            float: left;
            margin-top: 6px;
            margin-right: 16px;
            padding-left: 4px;
            padding-right: 10px;
        }

        .select-result dd label {
            color: #999999;
        }

        .select-result dd strong {
            color: #ff291c;
        }

        .select-result dd b {
        }

        .select-result dt {
            border-radius: 2px;
            display: inline-block;
            float: left;
            margin-top: 8px;
            padding-left: 4px;
            padding-right: 10px;
        }

        .hiddenDiv {
            display: none;
        }

        .state-end {
            color: #666666;
        }

        .state-hang-up {
            color: #ff9900;
        }

        .state-lag {
            color: #ff0000;
        }

        .state-join {
            color: #009900;
        }



        #table-user  > thead > tr > th,
        #table-user  > tbody  tr  td
        {
            border-top :0px  none;
        }

    </style>


</head>

<body>
<!--��ʼ�����ݼ������Լ�������  -->


<!--����ͷ��-->
<div class="task-head">
    <div class="task-title">
        <span>��������༭</span>
    </div>


</div>
<%--<!--�������-->--%>
<%--	<div class="clearfix"></div> --%>

<%--<!--��������-->--%>
<div class="task-container container-fluid" style="background: #f1f1f1;width: 1360px">
    <div class="content-container ">

        <div class="select-container" style="padding-left: 10px">
            <div class="select-area row  select-area-margin " style="margin-left: 10px">
                <h3>���񴴽�ʱ��</h3>

                <div class="select-content" style="position:relative;" id="task_times">

                    <button id="task_times_1" class="btn  ">���һ��</button>
                    <button id="task_times_2" class="btn  ">���һ��</button>
                    <button id="task_times_3" class="btn ">�������</button>
                    <button id="defineDate" class="btn " data-toggle="modal"
                            data-target="#myModal">�Զ���ʱ��
                    </button>


                </div>

            </div>

            <div class="select-area select-area-margin">
                <h3>����״̬</h3>

                <div class="select-content" id="task_state">

                    <%--<button id="task_state_2" class="btn  btn-grass btn-task" >������</button >--%>
                    <button id="task_state_2" class="btn  ">������</button>
                    <%--  <button id="TASK_STATE_2" class="btn   " >�����ͺ�</button >--%>
                    <button id="task_state_4" class="btn   ">�������</button>
                    <button id="task_state_3" class="btn   ">�������</button>
                    <button id="task_state_0" class="btn   ">����״̬</button>
                    <button style="display: none"></button>

                </div>
            </div>

            <div class="select-area" style="position:relative;">
                <h3>��������</h3>


                <div class="select-content">


                    <form class="form-horizontal">
                        <div class="form-group form-group-sm add-top-margin">
                            <label for="task_name" class="col-md-3 control-label">��������</label>

                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm" id="task_name">
                            </div>
                        </div>
                        <div class="form-group form-group-sm">
                            <label for="task_id" class="col-md-3 control-label">���񵥺�</label>

                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm" id="task_id">
                            </div>
                        </div>


                    </form>


                </div>
                <button id="quick_search" class="btn btn-grass search-btn ">��ѯ</button>
            </div>


        </div>

        <!--�������-->
        <div class="clearfix"></div>

        <ul class="select" style="padding-left: 20px;padding-right: 18px">


            <dl class="select-result">

                <dt>��ѡ������</dt>

                <dd class="select-no" style="display: none;">��ʱû��ѡ���������</dd>

                <dd class="selected hiddenDiv" id="task_times_select"  <%--style="width: 190px;"--%>><label
                        style="font-weight: 400;display:inline">���񴴽�ʱ��</label>
                    <strong>: ���һ��</strong>
                    <b class="onClose">&times;</b></dd>
                <dd class="selected hiddenDiv" id="task_state_select"><label style="font-weight: 400;display:inline">����״̬</label>
                    <strong>: ������</strong>
                    <b class="onClose">&times;</b></dd>

                <button class="btn btn-grass  btn-sm btn-task" id="clearBtn" style="margin-top: 6px">��&nbsp;��</button>
            </dl>


        </ul>


        <div class="row-fluid">
            <div id="div-table-container" style="padding:10px 20px">

                <table id="table-user" class="table table-striped  table-hover " cellspacing="0"
                       width="100%" style="border: 1px solid #CCC">
                    <thead>
                    <tr>
                        <th>��������</th>
                        <th>���񵥺�</th>
                        <th>�����</th>
                        <th>����״̬</th>
                        <th> ����ʼʱ��</th>
                        <th> �������ʱ��</th>
                        <th> ���񴴽�ʱ��</th>
                        <th> ʡ����������������</th>
                        <th> ������ȷ�ϰ�������</th>
                    </tr>
                    </thead>
                    <tfoot>
                    <!--<tr>
                        <th></th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                    </tr>-->
                    </tfoot>
                    <tbody></tbody>
                </table>
            </div>


        </div>


    </div>


</div>


<div class="modal fade" id="myModal" tabindex="-1" role="dialog"
     aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"
                        data-dismiss="modal" aria-hidden="true">
                    &times;
                </button>
                <h4 class="modal-title" id="myModalLabel">
                    �Զ���ʱ��
                </h4>
            </div>
            <div class="modal-body">


                <form class="form-horizontal">
                    <div class="form-group form-group-sm add-top-margin">
                        <label for="start_date" class="col-md-3 control-label">��ʼʱ��</label>

                        <div class="col-sm-8">
                            <input type="text" class="form-control input-md" id="start_date">
                        </div>

                    </div>
                    <div class="form-group form-group-sm">
                        <label for="end_date" class="col-md-3 control-label">����ʱ��</label>

                        <div class="col-sm-8">
                            <input type="text" class="form-control input-md" id="end_date">
                        </div>
                    </div>


                </form>


            </div>
            <div class="modal-footer">
                <button id="date_close" type="button" class="btn btn-danger"
                        data-dismiss="modal">ȡ��
                </button>
                <button id="date_choose" type="button" class="btn btn-primary">
                    ��ѯ
                </button>


            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal -->


    <script type="text/javascript" src="../../../../resource/js/Common.js"></script>
    <script type="text/javascript" src="../../../../resource/js/Dialog.js"></script>
    <script type="text/javascript" src="../../../../resource/js/ChoiceDialog.js"></script>
    <script type="text/javascript" src="../../../../resource/js/json2.js"></script>
    <script type="text/javascript" src="../../../../resource/js/tables/DataTables-1.10.12/media/js/jquery.js"></script>
    <script type="text/javascript"
            src="../../../../resource/js/tables/DataTables-1.10.12/media/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript"
            src="../../../../resource/js/tables/bootstrap-3.3.7/dist/js/bootstrap.min.js"></script>
    <script type="text/javascript"
            src="../../../../resource/js/tables/DataTables-1.10.12/media/js/dataTables.bootstrap.min.js"></script>
    <script type="text/javascript"
            src="../../../../assets/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
    <script type="text/javascript"
            src="../../../../assets/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"
            charset="UTF-8"></script>

    <!--[if lt IE 9]>

    <script type="text/javascript"
            src="../../../../resource/js/tables/bootstrap-3.3.7/dist/html5shiv-printshiv/html5shiv.min.js"></script>
    <script type="text/javascript"
            src="../../../../resource/js/tables/bootstrap-3.3.7/dist/html5shiv-printshiv/respond.min.js"></script>

    <![endif]-->


    <%--  <script type="text/javascript" src='<%=ResourceLoader.buildSrc("/resource/js/Common.js")%>' ></script >
      <script type="text/javascript" src="<%=ResourceLoader.buildSrc("/resource/js/Dialog.js")%>" ></script >
      <script type="text/javascript" src='<%=ResourceLoader.buildSrc("/resource/js/ChoiceDialog.js")%>' ></script >

      <script type="text/javascript" src="<%=ResourceLoader.buildSrc("/resource/js/json2.js")%>" ></script >

      &lt;%&ndash;<script type="text/javascript" src='<%=ResourceLoader.buildSrc("/resource/js/tables/DataTables-1.10.12/media/js/jquery.js")%>' ></script >&ndash;%&gt;
      <script type="text/javascript" src='<%=ResourceLoader.buildSrc("/resource/js/tables/DataTables-1.10.12/media/js/jquery.js")%>' ></script >
      <script type="text/javascript" src='<%=ResourceLoader.buildSrc("/resource/js/tables/DataTables-1.10.12/media/js/jquery.dataTables.min.js")%>' ></script >
      <script type="text/javascript" src='<%=ResourceLoader.buildSrc("/resource/js/tables/bootstrap-3.3.7/dist/js/bootstrap.min.js")%>' ></script >
      <script type="text/javascript" src='<%=ResourceLoader.buildSrc("/resource/js/tables/DataTables-1.10.12/media/js/dataTables.bootstrap.min.js")%>' ></script >
      <script type="text/javascript" src='<%=ResourceLoader.buildSrc("/resource/js/tables/spin-2.1.0/jquery.spin.merge.js")%>' ></script >
      &lt;%&ndash;<script type="text/javascript" src='<%=ResourceLoader.buildSrc("/resource/js/tables/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.min.js")%>' ></script >&ndash;%&gt;
      &lt;%&ndash; <script type="text/javascript" src='<%=ResourceLoader.buildSrc("/resource/js/tables/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.js")%>' ></script >
   &ndash;%&gt;
      <script type="text/javascript" src='<%=ResourceLoader.buildSrc("/assets/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js")%>' ></script >

      <script type="text/javascript" src='<%=ResourceLoader.buildSrc("/assets/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js")%>'
              charset="UTF-8" ></script >
  --%>

    <script type="text/javascript">

        function addSip($table, settings) {

        }


        function setQueryDto(idAttr, dateUtil) {
            var nowDate = new Date();
            /*
             task_state_3
             queryDto
             */

            switch (idAttr) {
                case "task_times_1":
                    "";//���һ��
                    queryDto.start_date = dateUtil.formatterDate(nowDate),
                            queryDto.end_date = dateUtil.getBeforeOneWeek(nowDate);
                    break;
                case "task_times_2":
                    "";
                    break;//���һ��
                    queryDto.start_date = dateUtil.formatterDate(nowDate),
                            queryDto.end_date = dateUtil.getBeforeOneMonth(nowDate);
                case "task_times_3":
                    queryDto.start_date = dateUtil.formatterDate(nowDate),
                            queryDto.end_date = dateUtil.getBeforeHalfYear(nowDate);
                    break;//�������

                case "task_state_0":
                    queryDto.task_state = "0";
                    break;//ȫ������

                case "task_state_1":
                    queryDto.task_state = "1";
                    "";
                    break;
                case "task_state_2":
                    queryDto.task_state = "2";
                    "";
                    break;//������
                case "task_state_3":
                    queryDto.task_state = "3";
                    break;//�������
                case "task_state_4":
                    queryDto.task_state = "4";
                    break;//�������

                default :
                    break;


            }
            queryDto.task_name = $("#task_name").val();
            queryDto.task_id = $("#task_id").val();
        }
        $(document).ready(function () {

            $("#task_times_select ,#task_state_select").hide();


            var $wrapper = $('#div-table-container');
            var $table = $('#table-user');

            var _table = $table.dataTable($.extend(true, {}, CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
                ajax: function (data, callback, settings) {

                    var param = taskListManage.getQueryCondition(data);
                    //console.log("========>" + JSON.stringify(param));

                    $.ajax({
                        type: "POST",
                        url: "/ffcs/loadTaskListTest2",
                        cache: false,	//���û���
                        data: JSON.stringify(param),
                        dataType: "json",
                        contentType: "application/json",
                        success: function (result) {

                            console.log(result);
                            var returnData = {};
                            returnData.draw = data.draw;
                            returnData.recordsTotal = result.total;
                            returnData.recordsFiltered = result.total;
                            returnData.data = result.pageData;
                            callback(returnData);


                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("��ѯʧ��");
                        }
                    });
                },
                columns: [
                    {data: "TASK_NAME"},
                    {data: "TASK_ID"},
                    {data: "TASK_APPLY_MAN"},
                    {
                        data: "TASK_STATE",
                     render: function (data, type, row, meta) {
                     console.log("ddddd" + JSON.stringify(data));
                     switch (data) {
                     case "1" :
                     return "������";
                     case "2" :
                     return "������";
                     case "3" :
                     return "�������";
                       case "4" :
                     return "�������";
                      case "5" :
                     return "�����ͺ�";
                         default :
                             return "";

                     }


                     return +(data ? "����" : "����");
                     }
                    },
                    {data: "TASK_BEGIN_TIME"},
                    {data: "TASK_END_TIME"},
                    {data: "TASK_SUMIT_TIME"},
                    {data: "UNDO_NUMS"},
                    {data: "DO_NUMS"}

                ],
                "createdRow": function (row, data, index) {
                    //����Ⱦ�ص�,��������ԶԸ���domԪ�ؽ����κβ���
                    //����ǰ�м���ʽ
                    if (data.role) {
                        $(row).addClass("info");
                    }
                    //����ǰ��ĳ�м���ʽ

                    var stateColor;

                    switch (data.TASK_STATE) {

                        case   '2':
                            stateColor = 'state-join';
                            break;
                        case   '3':
                            stateColor = 'state-end';
                            break;
                        case   '4':
                            stateColor = 'state-hang-up';
                            break;
                        case   '5':
                            stateColor = 'state-lag';
                            break;
                        default :
                            stateColor = '';
                            break;


                    }

                    console.log("stateColor:"+stateColor)





                    $('td', row).eq(3).addClass(stateColor);

                    if (data.UNDO_NUMS>0) {

                    $('td', row).eq(7).addClass("state-lag");
                    }
                    if (data.DO_NUMS>0) {
                        $('td', row).eq(8).addClass("state-lag");
                    }
                     //��ʹ��render������jquery�ĵ��������ֵ�Ԫ��


                },

                drawCallback: function (settings) {

                    var pages = $table.api().page.info().pages;
                    /*�����ҳ����*/

                    var inputPageJump = $('<input>', {
                        'type': "number",
                        'min': 1,
                        'max': pages,
                        'class': "form-control"
//                    'style':'width:50px'

                    }).on("keyup", function (event) {
                        if (event.keyCode == 13) {
                            var curr = this.value.replace(/\s|\D/g, '') | 0;
                            if (curr) {
                                var pages = pages;
                                curr = curr > pages ? pages : curr;
                                curr--;
                                api.page(curr).draw(false);
                            }
                        }
                    });


                    var btnPageJump = $('<button />', {
                        'class': "btn btn-info",
                        'aria-controls': settings.sTableId,
                        'tabindex': settings.iTabIndex
                    }).html("��ת").on("click", function () {
                        var curr = inputPageJump.val().replace(/\s|\D/g, '') | 0;
                        if (curr) {
                            var pages = $table.api().page.info().pages;
                            curr = curr > pages ? pages : curr;
                            curr--;
                            $table.api().page(curr).draw(false);
                        }
                    });


                    var aSpan = $("<span/>", {
                        'class': 'input-group-btn'
                    }).append(btnPageJump);

                    var appendDiv = $('<div/>', {

                        'class': "input-group",
                        'style': 'width:100px;margin-left:10px'


                    }).append(inputPageJump).append(aSpan);

                    $("ul.pagination").append($('<li />', {
                        'class': "paginate_button "
                    }).append(appendDiv));


                }


            })).api();


            $("#start_date").datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                pickerPosition: "bottom-left",
                language: 'zh-CN'
            }).on("click", function () {
                $(this).datetimepicker("setEndDate", $("#end_date").val());
            });
            $("#end_date").datetimepicker({
                format: 'yyyy-mm-dd',
                minView: 2,
                autoclose: true,
                todayBtn: true,
                language: 'zh-CN'
            }).on("click", function () {
                $(this).datetimepicker("setStartDate", $("#start_date").val());
            });


            /*   $('#myModal').modal({
             keyboard: false,
             });
             */

            $("#myModal button.close,#date_close ").click(function () {

                $("#end_date").val('');
                $("#start_date").val('');
                $('#myModal').modal('hide');
            });


            $("#date_choose").click(function () {

                var $curBtn = $(this);
                $curBtn.addClass("btn-grass").siblings().removeClass("btn-grass");
                var parentSelectId = $curBtn.parent().attr("id");
                /*   var splitResult = idAttr.split("_");
                 splitResult.splice(-1);
                 var resultId = splitResult.join("_");*/

                var startDate = $("#start_date").val();
                var endDate = $("#end_date").val();

                if (!endDate || !startDate) {
                    alert("��ѡ��������ʱ�䷶Χ!!");
                    return;
                }

                $("#task_times_select").children('strong').text(":" + startDate + " - " + endDate);

                $("#task_times_select").show();
                setQueryDto($curBtn.attr("id"), dateUtil);

                $('#myModal').modal('hide');
                _table.draw();

            });


            $(".select-area .select-content button:not(#defineDate)").click(function () {
                //��ǩ�����ѯ
                var $curBtn = $(this);
                $curBtn.addClass("btn-grass").siblings().removeClass("btn-grass");
                var parentSelectId = $curBtn.parent().attr("id");
                /*   var splitResult = idAttr.split("_");
                 splitResult.splice(-1);
                 var resultId = splitResult.join("_");*/
                $("#" + parentSelectId + "_select").children('strong').text(":" + $curBtn.text()).end().show();

                setQueryDto($curBtn.attr("id"), dateUtil);
                _table.draw();

            });


            $("#quick_search").click(function () {
                //���ٲ�ѯ
                setQueryDto("", dateUtil);
                _table.draw();
            });

            $("#clearBtn").click(function () {
                //�����ť
                $("div.hiddenDiv").hide();
                $("#task_times_select ,#task_state_select").hide();
                $("div.select-content button").removeClass("btn-grass");
                $("div.select-area :input").val("");

                for (var prop in queryDto) {
                    queryDto[prop] = "";

                }
                _table.draw();

            });

            $(".select-result .select").click(function () {
                //��ѡ����.������
                var $selectDiv = $(this);
                var idAttr = $selectDiv.attr("id");
                var splitResult = idAttr.split("_");
                splitResult.splice(-1);
                var resultId = splitResult.join("_");

                $("#" + resultId + " button").removeClass("btn-grass");
                switch (idAttr) {
                    case "task_times":
                        "";//���һ��
                        queryDto.start_date = "",
                                queryDto.end_date = "";
                        break;
                    case "task_state":
                        queryDto.task_state = "";
                        break;//ȫ������
                    default :
                        break;

                }


            });


        });


        var queryDto = {
            start_date: "",
            end_date: "",
            task_state: "",
            task_name: "",
            task_id: ""

        };

        var taskListManage = {


            getQueryCondition: function (data) {
                delete  data.columns;
                delete  data.search;

                var merge = this.merge(data, queryDto);

                return merge;
            },
            merge: function (o, p) {//�ϲ�
                for (prop in p) {
                    if (o.hasOwnProperty[prop]) continue;
                    if (p[prop] != "") {
                        o[prop] = p[prop];
                    }
                }
                return o;
            }

        };


        var CONSTANT = {
            DATA_TABLES: {
                DEFAULT_OPTION: { //DataTables��ʼ��ѡ��
                    language: {
                        "sProcessing": "������...",
                        "sLengthMenu": "ÿҳ _MENU_ ��",
                        "sZeroRecords": "û��ƥ����",
                        "sInfo": "��ǰ��ʾ�� _START_ �� _END_ �������� _TOTAL_ �",
                        "sInfoEmpty": "��ǰ��ʾ�� 0 �� 0 ��� 0 ��",
                        "sInfoFiltered": "(�� _MAX_ ��������)",
                        "sInfoPostFix": "",
                        "sSearch": "����:",
                        "sUrl": "",
                        "sEmptyTable": "��������",
                        "sLoadingRecords": "������...",
//                    "sLoadingRecords": "<div style=''><img src='../static/img/loader.gif'><span>������...</span></div>",
                        "sInfoThousands": ",",
                        "oPaginate": {
                            "sFirst": "��ҳ",
                            "sPrevious": "��ҳ",
                            "sNext": "��ҳ",
                            "sLast": "ĩҳ",
                            "sJump": "��ת"
                        },
                        "oAria": {
                            "sSortAscending": ": ���������д���",
                            "sSortDescending": ": �Խ������д���"
                        }
                    },
                    autoWidth: false,	//�����Զ������п�
                    stripeClasses: ["odd", "even"],//Ϊ��ż�м�����ʽ�����ݲ�֧��CSSα��ĳ���
                    order: [],			//ȡ��Ĭ�������ѯ,����ѡ��һ�л����С��ͷ
                    processing: true,	//���ؼ�����ʾ,���д���
                    serverSide: true,	//���÷������˷�ҳ
                    bSort: false,
                    bLengthChange: false,//����һҳ��ʾ���������ݵ������˵�
                    searching: false	//����ԭ������
                },
                COLUMN: {
                    CHECKBOX: {	//��ѡ��Ԫ��
                        className: "td-checkbox",
                        orderable: false,
                        width: "30px",
                        data: null,
                        render: function (data, type, row, meta) {
                            return '<input type="checkbox" class="iCheck">';
                        }
                    }
                },
                RENDER: {	//����render���Գ�ȡ������������ʱ�䡢ͷ���
                    ELLIPSIS: function (data, type, row, meta) {
                        data = data || "";
                        return '<span title="' + data + '">' + data + '</span>';
                    }
                }
            }
        };


        var dateUtil = {

            /**
             * ��ʽ�����ڣ�����ʱ�䣩
             */
            formatterDate: function (date) {
                var datetime = date.getFullYear()
                        + "-"// "��"
                        + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
                        + (date.getMonth() + 1))
                        + "-"// "��"
                        + (date.getDate() < 10 ? "0" + date.getDate() : date
                                .getDate());
                return datetime;
            },
            /**
             * ��ʽ�����ڣ���ʱ��"00:00:00"��
             */
            formatterDate2: function (date) {
                var datetime = date.getFullYear()
                        + "-"// "��"
                        + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
                        + (date.getMonth() + 1))
                        + "-"// "��"
                        + (date.getDate() < 10 ? "0" + date.getDate() : date
                                .getDate()) + " " + "00:00:00";
                return datetime;
            },
            /**
             * ��ʽ��ȥ���ڣ���ʱ�䣩
             */
            formatterDateTime: function (date) {
                var datetime = date.getFullYear()
                        + "-"// "��"
                        + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
                        + (date.getMonth() + 1))
                        + "-"// "��"
                        + (date.getDate() < 10 ? "0" + date.getDate() : date
                                .getDate())
                        + " "
                        + (date.getHours() < 10 ? "0" + date.getHours() : date
                                .getHours())
                        + ":"
                        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                                .getMinutes())
                        + ":"
                        + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                                .getSeconds());
                return datetime;
            },
            /**
             * ��ȡ����[��ʼʱ��ͽ���ʱ��ֵ]
             */
            getTodayDateTime: function () {
                var daymsTime = 24 * 60 * 60 * 1000;
                var tomorrowDatsmsTime = this.getCurrentMsTime() + daymsTime;
                var currentTime = this.longMsTimeConvertToDateTime(this.getCurrentMsTime());
                var termorrowTime = this.longMsTimeConvertToDateTime(tomorrowDatsmsTime);
                var nowDate = this.formatterDate2(new Date(currentTime));
                var tomorrowDate = this.formatterDate2(new Date(termorrowTime));
                var obj = {
                    startTime: nowDate,
                    endTime: tomorrowDate
                };
                return obj;
            },
            /**
             * ��ȡ����[��ʼʱ��ͽ���ʱ��ֵ]
             */
            getTomorrowDateTime: function () {
                var daymsTime = 24 * 60 * 60 * 1000;
                var tomorrowDatsmsTime = this.getCurrentMsTime() + daymsTime;
                var termorrowTime = this.longMsTimeConvertToDateTime(tomorrowDatsmsTime);
                var theDayAfterTomorrowDatsmsTime = this.getCurrentMsTime() + (2 * daymsTime);
                var theDayAfterTomorrowTime = this.longMsTimeConvertToDateTime(theDayAfterTomorrowDatsmsTime);
                var pastDate = this.formatterDate2(new Date(termorrowTime));
                var nowDate = this.formatterDate2(new Date(theDayAfterTomorrowTime));
                var obj = {
                    startTime: pastDate,
                    endTime: nowDate
                };
                return obj;
            },
            /**
             * ��ȡ����֮ǰ��ʱ��
             * */
            getBeforeHalfYear: function (date) {


                date.setMonth(date.getMonth() - 6);
                var newDate = this.formatterDate(date);
                return newDate;

            },

            /**
             * ��ȡһ����֮ǰ��ʱ��
             * */
            getBeforeOneMonth: function (date) {

                date.setMonth(date.getMonth() - 1);
                var newDate = this.formatterDate(date);
                return newDate;

            },

            /**
             * ��ȡһ��֮ǰ��ʱ��
             * */
            getBeforeOneWeek: function (date) {

                date.setDate(date.getDate() - 7);
                var newDate = this.formatterDate(date);
                return newDate;

            }


        };


    </script>


</body>
</html>
