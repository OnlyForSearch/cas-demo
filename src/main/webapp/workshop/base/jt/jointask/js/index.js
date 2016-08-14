$("document").ready(function () {

    taskInfo.init();
});

var taskInfo = {
    constant: {
        regionId: ""
    },

    DateUtil: {
        getCurrentDate: function (str) {
            var date = (str == undefined || str == "") ? new Date() : new Date(str),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hh = date.getHours(),
                mm = date.getMinutes(),
                time = "";

            time = year + "-";

            if (month < 10)
                time += "0";

            time += month + "-";

            if (day < 10)
                time += "0";

            time += day + " ";

            if (hh < 10)
                time += "0";

            time += hh + ":";
            if (mm < 10) time += '0';
            time += mm;

            return (time);
        },

        getTime: function (str) {
            var taskBeginTime = "",
                taskEndTime = "",
                date = new Date()
            time = date.getTime();

            if (str == "1") { 		//һ����ǰ
                time = time - 24 * 3600 * 1000 * 30;
            } else if (str == "2") {//������ǰ
                time = time - 24 * 3600 * 1000 * 30 * 3;
            } else if (str == "3") {//һ��ǰ
                time = time - 24 * 3600 * 1000 * 30 * 12;
            }

            taskBeginTime = (str == "" || str == undefined) ? $("#start-time").val() : this.getCurrentDate(time);
            taskEndTime = (str == "" || str == undefined) ? $("#end-time").val() : this.getCurrentDate();

            return {
                "beginTime": taskBeginTime,
                "endTime": taskEndTime
            }
        }
    },

    list: function () {
        var self = this;

        $.ajax({
            type: "GET",
            url: "/CustJtJoinTaskAction/loadTaskList.do?type=1",
            cache: false,
            success: function (data) {
                var html = "";
                self.constant.regionId = data.regionId;

                var operatorType = data.operatorType;
                if (operatorType != 1) {//������Ա������ʡ����Ա)����
                    $("#last_operator").hide();

                }


                if (data.data.length > 0) {


                    $(data.data).each(function () {

                        var tark_href;
                        var task_operator;
                        if (operatorType == 1) {

                            tark_href = "<a href='./task_jt_deal.jsp'>" + this.TASK_NAME + '</a >';
                            task_operator= "	<td>" + this.TASK_OPER + "</td>";
                        } else {
                            tark_href = "<a href='./task_deal.jsp'>" + this.TASK_NAME + '</a >';
                            task_operator = "";
                        }

                        html += "<tr>" +
                        "	<td><div title='" + this.TASK_NAME + "'>" + tark_href + "</div></td>" +
                        "	<td><div title='" + this.TASK_STATE + "'>" + this.TASK_STATE + "</div></td>" +
                        "	<td><div title='" + this.TASK_BEGIN_TIME + "'>" + this.TASK_BEGIN_TIME + "</div></td>" +
                        "	<td><div title='" + this.TASK_END_TIME + "'>" + this.TASK_END_TIME + "</div></td>" +
                        "	<td><div title='" + this.UNDO_NUMS + "'>" + this.UNDO_NUMS + "</div></td>" +
                        "	<td><div title='" + this.DO_NUMS + "'>" + this.DO_NUMS + "</div></td>" +
                            task_operator+
                        "</tr>";
                    });

                } else {
                    html = "<tr ><td rowspan=4 colspan=7>�������ݣ�</td></tr>";
                }

                $("#task-list > tbody").html(html);

                if (data.regionId != -1 && data.regionId != 0 && data.regionId != 1 && data.regionId != 100) {
                    $("#task-list > thead > tr > th:last").hide();
                    $("#task-list > tbody  tr").find("td:last").hide();
                }
            },
            error: function () {
                alert("�����б����ʧ�ܣ�");
            }
        });

    },

    delayTask: function (requestId) {
        $("#request-id").val(requestId);
        $("#delayModal").modal("toggle");
    },

    revertTask: function (requestId) {
        $("#request-id").val(requestId);
        $("#taskRevertModal").modal("toggle");
    },

    endTask: function (requestId) {
        $("#request-id").val(requestId);
        $("#taskEndModal").modal("toggle");
    },


    hangTask: function (requestId) {
        $("#request-id").val(requestId);
        $("#taskHangModal").modal("toggle");
    },

    charts: function () {
        var self = this
        time = this.DateUtil.getTime("1");
        window.setTimeout(function () {
            self.buildPanel("fuschart", "500001040", "task-charts", "center", "0", "198", time);
        }, 3000);

    },
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

  //  self.buildPanel("fuschart", "500001040", "task-charts", "center", "0", "198", time);

buildPanel: function (panelType, vResult, vDivId, vRegion, vWidth, vHeight, searchParam) {
        if (!vResult || vResult == 0) {
            return;
        }
        searchParam = searchParam ? searchParam : {};
        searchParam.random = Math.random();
        if (panelType.toLowerCase() == "fuschart") {

            var c1 = new FusionChart({
                result: vResult,
                region: vRegion,
                height: vHeight
            });
            var panelTemp = new Ext.Panel({
                layout: "border",
                border: false,
                items: [c1],
                renderTo: document.getElementById(vDivId)
            });
            c1.search(searchParam);
            return c1;
        }
    },

    initEvent: function () {
        var self = this;

        /*��ʼ��ʱ��ؼ�*/
        $("#task-start-time").datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            todayBtn: 1,
            linkField: "task-start-time",
            linkFormat: "yyyy-mm-dd hh:ii"
        });

        $("#task-end-time").datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            todayBtn: 1,
            linkField: "task-end-time",
            linkFormat: "yyyy-mm-dd hh:ii"
        });

        $("#start-time").datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            todayBtn: 1,
            linkField: "start-time",
            linkFormat: "yyyy-mm-dd hh:ii"
        });

        $("#end-time").datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            todayBtn: 1,
            linkField: "end-time",
            linkFormat: "yyyy-mm-dd hh:ii"
        });


        $("#btn-create-task").on("click", function () {
            if (self.constant.regionId != -1 && self.constant.regionId != 0 && self.constant.regionId != 1 && self.constant.regionId != 100) {
                alert("����Ȩ�޲������޷�������������");
                return;
            }
            window.open("/workshop/base/jt/jointask/task.jsp");
        });

        $("#tab-task, #tab-task-done").on("click", function () {
            var flag = $(this).attr("id") == "tab-task-done" ? true : false;

            $(this).addClass("active");

            if (!flag) {
                $("#tab-task-done").removeClass("active");
                $(this).find("img").show();
                $("#tab-task-done").find("img").hide();
                $("#task-list").show();
                $("#task-done-list").hide();

                self.list();

            } else {
                $("#tab-task").removeClass("active");
                $(this).find("img").show();
                $("#tab-task").find("img").hide();

                $("#task-list").hide();
                $("#task-done-list").show();

                $.ajax({
                    type: "GET",
                    url: "/CustJtJoinTaskAction/loadTaskList.do?type=2",
                    cache: false,
                    success: function (data) {
                        var html = "";
                        if (data.data.length > 0) {
                            $(data.data).each(function () {
                                html += "<tr>" +
                                    "	<td>" + this.TASK_NAME + "</td>" +
                                    "	<td>" + this.TASK_STATE + "</td>" +
                                    "	<td>" + this.TASK_BEGIN_TIME + "</td>" +
                                    "	<td>" + this.TASK_END_TIME + "</td>" +
                                    "	<td>" + this.UNDO_NUMS + "</td>" +
                                    "	<td>" + this.DO_NUMS + "</td>" +
                                    "</tr>"
                            });
                        } else {
                            html = "<tr><td rowspan=4 colspan=6>�������ݣ�</td></tr>";
                        }

                        $("#task-done-list > tbody").html(html);
                    },
                    error: function () {
                        alert("��������б����ʧ�ܣ�");
                    }
                });
            }

        });


        $("#btn-home").attr("href", "/index_JT2.jsp");

        $("#delayModal").on("shown.bs.modal", function () {
            $.ajax({
                type: "GET",
                cache: false,
                url: "/CustJtJoinTaskAction.do?method=loadJoinTaskById",
                data: {id: $("#request-id").val()},
                dataType: 'json',
                success: function (data) {
                    if (data == "" || data == null) {
                        alert("��������Ϣ��ȡʧ�ܣ�");
                        return;
                    }

                    $("#task-start-time").val(data[0].TASK_BEGIN_TIME.substring(0, data[0].TASK_BEGIN_TIME.length - 2));
                    $("#task-end-time").val(data[0].TASK_END_TIME.substring(0, data[0].TASK_END_TIME.length - 2));
                },
                error: function () {
                    alert("��������Ϣ��ȡʧ�ܣ�");
                }
            });
        });

        $('#btn-delay-submit').on('click', function () {
            var beginTime = $("#task-start-time").val(),
                endTime = $("#task-end-time").val();

            if (beginTime == null || beginTime == "") {
                alert("��ѡ����������ʼʱ�䣡");
                return;
            } else if (endTime == null || endTime == "") {
                alert("����д�����������ʱ�䣡");
                return;
            } else if (new Date(endTime.replace(/-/g, "/")) - new Date(beginTime.replace(/-/g, "/")) <= 0) {
                alert("��������Ľ���ʱ�������ڿ�ʼʱ�䣡");
                return;
            }

            $.ajax({
                type: "POST",
                dataType: 'json',
                cache: false,
                url: '/CustJtJoinTaskAction/delayJoinTaskTime.do',
                /*��������*/
                data: {data: JSON.stringify({"beginTime": beginTime, "endTime": endTime, "requestId": $("#request-id").val()})},
                success: function (data) {
                    if (data == "" || data == null) {
                        alert("��ʱ����ʧ�ܣ�");
                        return;
                    }

                    $("#task-start-time").val(data.data[0].TASK_BEGIN_TIME.substring(0, data.data[0].TASK_BEGIN_TIME.length - 2));
                    $("#task-end-time").val(data.data[0].TASK_END_TIME.substring(0, data.data[0].TASK_END_TIME.length - 2));

                    $('#delayModal').modal('hide');

                    alert("��ʱ����ɹ���");

                    self.list();
                },
                error: function () {
                    alert("��ʱ����ʧ�ܣ�");
                }
            });
        });

        $("#btn-end-submit").on("click", function () {
            $.ajax({
                type: "GET",
                dataType: 'json',
                cache: false,
                url: '/CustJtJoinTaskAction/endJoinTask.do',
                /*��������*/
                data: {"requestId": $("#request-id").val()},
                success: function (data) {
                    if (data == "" || data == null) {
                        alert("��������ʧ�ܣ�");
                        return;
                    }
                    alert("��������ɹ���");
                    $('#taskEndModal').modal('hide');
                    self.list();
                },
                error: function () {
                    alert("��������ʧ�ܣ�");
                }
            });
        });

        $("#btn-hang-submit").on("click", function () {
            $.ajax({
                type: "GET",
                dataType: 'json',
                cache: false,
                url: '/CustJtJoinTaskAction/hangJoinTask.do',
                /*��������*/
                data: {"requestId": $("#request-id").val()},
                success: function (data) {
                    if (data == "" || data == null) {
                        alert("��������ʧ�ܣ�");
                        return;
                    }
                    alert("��������ɹ���");
                    $('#taskHangModal').modal('hide');
                    self.list();
                },
                error: function () {
                    alert("��������ʧ�ܣ�");
                }
            });
        });

        $("#btn-revert-submit").on("click", function () {
            $.ajax({
                type: "GET",
                dataType: 'json',
                cache: false,
                url: '/CustJtJoinTaskAction/revertJoinTask.do',
                /*��������*/
                data: {"requestId": $("#request-id").val()},
                success: function (data) {
                    if (data == "" || data == null) {
                        alert("�ָ�����ʧ�ܣ�");
                        return;
                    }
                    alert("�ָ�����ɹ���");
                    $('#taskRevertModal').modal('hide');
                    self.list();
                },
                error: function () {
                    alert("����ָ�ʧ�ܣ�");
                }
            });
        });


        $("#btn-one-month, #btn-three-month, #btn-one-year, #btn-search").on("click", function () {
            var time = "";

            if ($(this).attr("id") == "btn-one-month") {
                time = self.DateUtil.getTime("1");
            } else if ($(this).attr("id") == "btn-three-month") {
                time = self.DateUtil.getTime("2");
            } else if ($(this).attr("id") == "btn-one-year") {
                time = self.DateUtil.getTime("3");
            } else {
                time = self.DateUtil.getTime();
            }

            if (time.beginTime == "") {
                alert("������ʼʱ�䲻Ϊ�գ�");
                return false;
            } else if (time.endTime == "") {
                alert("��������ʱ�䲻Ϊ�գ�");
                return false;
            }

            $("#task-charts").empty();

            window.setTimeout(function () {
                self.buildPanel("fuschart", "500001040", "task-charts", "center", "0", "198", time);
            }, 3000);

        });
    },

    init: function () {
        this.list();
        this.charts();
        this.initEvent();
    }
};