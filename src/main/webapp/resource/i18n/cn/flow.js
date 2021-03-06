ItmLang.flow = {
		//flog.htc start
		template_id_is_empty:"传入模板号为空！",
		template_id_is_error:"传入模板号错误！", //fdg.htc
		error_info:"错误信息:", //fdg.htc
		tache_create_init_state:"环节创建时初始状态",
		tache_executeing_state:"环节正在执行过程中状态。",
		tache_executed_just:"环节已经执行完毕，但还未创建后继环节（路径）",
		tache_executed_completed:"环节已经执行完毕，并且后继环节创建成功",
		child_flow_name:"子流程名称",
		parent_flow_name:"父环节名称",
		you_not_query_privilege:"您无查询权限",
		you_not_privilege:"你无权限",
		tache_name:"环节名称", //flowFormMenu.js引用、fdg.htc
		receive_staff:"接收任务员工",
		actually_execute_staff:"实际执行员工",
		execute_staff_dept_name:"执行员工所在部门",
		tache_context_desc:"环节内容描述",
		tch_doc:"文档", //flowForm.js,form.js
		tache_execute_val:"环节执行信息",
		execute_result_desc:"执行结果描述",
		form_info:"表单信息",
		tache_late_reason:"影响本环节执行原因",
		rela_flow:"关联流程",
		sla_date:"环节考核时点",
		sla_time:"环节考核历时",
		tache_created_date:"环节创建时刻",
		tache_finish_date:"环节状态时刻",
		tache_current_state:"当前环节状态",
		tache_id:"环节Id",
		child_flow_id:"子流程Id",
		need_q_notify:"需要消息通知",
		need:"需要", //fdg.htc
		no_need:"不需要", //fdg.htc
		tache_info_query:"环节信息查询",
		tache_sub_flow_query:"环节子流程查询",
		tache_parent_flow_query:"流程父环节查询",
		exec_or_stat_change:"执行或状态更改",
		create_next_tache:"创建后续环节",
		cancel_next_tache:"撤销后续环节",
		receive_staff_change:"接收任务员工更改",
		form_info_query:"表单信息查询",
		error_code:"错误代码",
		func_callback:"函数返回",
		no_privilege:"无权限",
		e_surfing:"天翼",
		phone:"固话",
		other_mobile_phone:"其他手机",
		state:"状态",
		execute_staff:"执行员工",
		curr_task_staff:"当前任务员工",
		tache_context:"环节内容", //flowForm.js,form.js
		execute_result:"执行结果", //flowForm.js,form.js
		sla_time_x:"考核时间",
		start_time : "开始时间",
		finish_time : "完成时间", //flowForm.js,form.js
		actually_used_time:"实际用时",
		confirm : "确 定",
		close : "关 闭",
		please_select_view_flow_info:"请选择查看的流程信息",
		please_select_view_info:"请选择显示信息",
		expedient:"催办",
		no_privilege_view_tache_info:"无权限查看该环节信息",
		please_select_expedient_obj:"请至少选中一个催办对象",
		expedient_success:"催办成功",
		//flog.htc end
		//flowExpr.js start
		invain_cust_method_call:"无效的自定义方法调用",
		invain_form_element:"无效的表单元素", //flowFormMenu.js引用
		//flowExpr.js end
		//flowFormMenu.js start
		curr_tache:"当前环节", //flowOpinion.html引用
		receive_success:"接收成功",
		tache_cc:"环节传阅",
		submitting_wait:"正在提交中,请稍候",
		submit_succ:"提交成功",
		please_input_review:"请填写{0}的审阅意见！",
		review_size_exceed_4000:"{0}的审阅意见不能超过4000个字节！",
		send_staff:"发送人",
		transaction_staff:"办理人",
		after_reading:"阅毕",
		call_method_err:"调用{0}方法出错",
		task_submit_succ:"任务提交成功",
		opt_fail:"操作失败",
		get_back_succ:"取回成功",
		get_back_fail:"取回失败",
		del_flow_confirm:"删除流程会使流程中正在处理的事务无法继续进行，是否确认删除该流程？",
		cancel_flow_confirm:"删除流程会使流程中正在处理的事务无法继续进行，是否确认删除该流程？",
		del_succ:"删除成功", //form.js引用
		flow_exist_data:"该单子存在子单数据，无法删除！",
		find_next_tch:"找不到后续环节不能继续流转！",
		turn_up_tache:"流转到上面{0}个环节",
		turn_more_tache:"流转到更多环节",
		not_found_tache:"找不到对应的环节",
		submit_info_confirm:"确认要提交信息？",
		if_need:"是否要{0}？", //"是否要"+oService.context.getEndTaskTitle()+"？",
		signature_type:"会签方式",
		parallel:"并行",
		serial:"串行",
		window:"窗口",
		background_err_code:"后台程序出现异常![错误代码:{0}]",
		xml_doc_err:"xml文档格式错误!",
		processing_confirm_close:"系统正在处理中，关闭或刷新窗口可能导致提交失败，确定要关闭窗口吗？",
		go_forward:"前进",
		go_back:"退回",
		be_completed:"竣工",
		turn_over:"转交",
		tch_process:"环节处理",
		please_input_opinion:"请填写您的意见!",
		opinion_size_exceed_4000:"意见不能超过4000个字节!",
		please_select_next_tch:"请选择下一环节!",
		attach_uploading_wait:"有{0}个附件正在上传中，请稍候!",
		please_select_tch_staff:"请选择\"{0}\"环节的执行人!",
		not_found_next_tch:"找不到下一环节！",
		sms:'短信',
		email:'邮件',
		admin_set_tch_send_notify:"管理员已设定此环节发{0}给执行人,无法在执行时更改",
		send_notify_to_staff:"发送{0}给执行人",
		not_send_notify_to_staff:"不发送{0}给执行人",
		common_opinion_size_exceed_250:"常用意见不能超过250个字节！",
		flow_cancel_succ:"流程撤销成功！",
		flow_cancel_fail:"流程撤销失败！",
		add_focus_succ:"添加关注成功！",
        cancel_attention_succ:"取消关注成功!",
		rele_succ:"释放成功!",
		sms_and_email:"短信及邮件",
		curr_staff_inconformity_hurry:"当前办理人不符合催办条件，不能发送催办！",
		if_send_hurry:"是否要向{0}发送{1}催办？",
		hurry_succ:"催办成功",
		hurry_fail:"催办失败",
		ajax_call_fail:"异步调用失败！",
		prev_tache_name:"上一环节",
		aduit_option_fill:"您还未填写审阅意见",
		is_show_message_aduit:"是否要一起处理其他相关的阅办?",
		recommended_common_user:'推荐常用人',
		search_page_num:"第 {0}/{1} 页",
		search_help_info:"输入员工姓名、登入名、电话、邮箱、地区、组织进行查询，中间用空格隔开，如：张三 北京",
		select_other_user:"选择其他人员",
		//flowFormMenu.js end
		//flowOpinion.html start
		curr_flow:"当前流程",
		all_flow:"所有流程",
		please_apply_type:"请选择【应用范围】类型!",
		please_select_del_rec:"请选择你要删除的记录!",
		save_succ:"保存成功!", //form.js引用
		save_fail:"保存失败!",
		common_opinion_not_empty:"常用意见不能为空",
		common_opinion_empty:"没有需要保存的数据或常用意见的值为空！",
		apply_scope:"应用范围",
		combobox_not_empty:"下拉值不能为空",
		loading:"数据载入中...",
		db_click_common_opinion:"常用意见(<font color='red'>双击记录可编辑</font>)",
		del:"删除",
		refresh:"刷新",
		save:"保存",
		//flowOpinion.html end
		//fdg.htc start
		this_temp_not_query_privilege:"该模板您无查询权限！",
		not_find_flow_temp_info:"无法找到模板号为{0}的流程信息",
		flow_temp:"流程模板",
		flow_type:"流程类型",
		flow_name:"流程名称",
		parent_tache_flow:"父环节模板",
		time_type:"时间类型",
		launch_time:"启动时刻",
		admin:"管理员",
		save_time_limit:"保存时限",
		doc_1:"说明文档1",
		doc_2:"说明文档2",
		ssecrecy_level:"保密级别",
		reader_of_template_list:"模板阅读者列表",
		template_starter_list:"模板启动者列表",
		rever_process_role_list:"可撤销流程角色列表",
		remark:"备注说明",
		tache_info:"环节信息",
		not_display:"不显示",
		view_tache_temp_id:"显示环节模板ID号",
		disp_expect_begin_first:"显示预计最早开始时间",
		disp_sla_time_duration:"显示考核持续时间",
		disp_sla_time:"显示考核时间点",
		disp_allow_latest_start:"显示允许最迟开始时间",
		allow_earliest_start:"显示允许最早开始时间",
		path_info:"路径信息",
		delay_time:"延迟时间",
		unlimited_duration:"无限期",
		day:"天",
		importance:"重要",
		normal:"普通",
		busi_query_url:"业务查询URL",
		busi_dispose_url:"业务处理URL",
		opt_desc:"操作简要说明",
		opt_man_doc:"操作手册文档",
		tache_temp_id:"环节模板ID",
		tache_type:"环节类型",
		c_flow_temp:"子流程模板",
		path_judge_type:"路径判定方式",
		path_judge_func:"路径判定函数",
		staff_gen_mode:"人员生成方式",
		staff_gen_func:"人员(生成函数)",
		readers_list:"阅读者列表",
		tch_exec_mode:"环节执行方式",
		allowed_exec_judeg_func:"允许执行判定函数",
		tch_exec_func:"环节执行函数",
		runtime_produce_mulit_inst:"运行时产生多实例",
		runtime_dispatch_new:"运行时派发新流程",
		tch_para_cfg:"环节参数定义",
		tch_exec_rest_cfg:"环节执行结果定义",
		need_queue_notify:"需要队列通知",
		need_pub_msg:"需要发布消息",
		sla_time_point:"考核时点",
		sla_time_hour:"考核历时(小时)",
		least_need_time:"至少需要时间",
		up_need_time:"至多需要时间",
		expect_begin_first_time:"预计最早开始时刻",
		tch_type_list:"1,begin 环节,2,end 环节,3,执行环节,4,虚拟环节", //需按照这种格式翻译
		click_url:"点击链接",
		path_judge_type_list:"1,唯一路径,2,人工判定,3,函数判定,4,所有路径", //需按照这种格式翻译
		staff_create_type_list:"0,固定人员,1,函数生成,2,从部门树中选,3,从专项小组中选,4,从维护人员层级树中选,5,从社区经理线中选,6,从客户经理线中选,7,从渠道树中选",
		exec_method_list:"1,手工执行,2,自动执行",
		v_type_number:"数值型",
		v_type_char:"字符型",
		v_type_enum:"枚举型",
		v_type_date:"日期型",
		v_type_name_normal_doc:"普通文档",
		v_type_name_module_doc:"模板化文档",
		need_message_list:"0,不发布消息,1,创建时发布,2,执行完毕时发布,3,都发布",
		tch_attr_qry:"环节属性查询",
		tch_exec_hist_qry:"环节执行历史查询",
		c_flow_temp_qry:"子流程模板查询",
		flow_p_tch_temp_qry:"流程父环节模板查询",
		tch_dept_stf_cfg:"环节部门处理人员配置",
		all_tch_detp_def_stf:"所有环节部门默认处理人",
		no_spec_virt_tch_c_flow:"还未指定该虚拟环节的关联子流程！",
		plea_spec_oper_flow:"请指定操作的流程",
		//flowSendMsg.vm start
		tch_exec_notify:"环节(执行通知)",
		flow_thro_stf:"流程流经人员",
		plea_sele_circ_stf:"请选择传阅人员!",
		plea_sele_circ_cont:"请填写传阅主题!",
		circ_stf_not_sele_self:"传阅员工不能选自己！",
		send_succ:"发送成功！",
		//flowSendMsg.vm end
		//flowForm.js start
		flow_proc:"流程流转过程", //form.js
		exec_staff:"执行者", //form.js
		//flowForm.js end
		//form.js start
		found_no_binding_form :"没有找到绑定的表单！",
		flow_form_context_failure: "获取流程表单的上下文失败！",
		cannot_find_form_fields:"无法找到表单域",
		attach_not_been_uploaded : "附件尚未上传完毕,请稍候!",
		not_allow_null : "不允许为空",
		only_for_digital:"只能为数字",
		only_for_float:"只能为浮点值",
		length_cannot_more_than_byte:"'{0}'的长度不能超过{1}字节!",
		length_cannot_more_than_bit:"'{0}'的长度不能超过{1}位!",
		precision_length_cannot_more_than:"'{0}'的精度不能超过{1}位!",
		not_find_corre_file:"没有找到对应的文件",
		not_match_module:"无法匹配模块,绑定不成功!",
		default_val_error_nested_call:"默认值嵌套调用错误!",
		exp_all:"全部展开",
		collapse:"收缩",
		sla_date:"截止时间"
		//form.js end
};
