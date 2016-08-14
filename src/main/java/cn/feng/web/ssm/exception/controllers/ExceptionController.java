package cn.feng.web.ssm.exception.controllers;

import java.sql.SQLException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import cn.feng.web.ssm.base.controllers.BaseController;

/**
 * （10） 之 异常处理
 */
@Controller
@RequestMapping(value = "/exception")
// 异常已经被捕捉并显示，这样只要把我们的其它的Controller全部继承于BaseController就能实现异常的集中捕捉和处理了。
public class ExceptionController extends BaseController {
	// @AuthPassport
	// http://localhost:8888/springmvc/exception/index
	@RequestMapping(value = { "/index", "/hello" })
	public ModelAndView index() throws SQLException {
		throw new SQLException("数据库异常。");
		/*
		 * ModelAndView modelAndView = new ModelAndView();
		 * modelAndView.addObject("message", "Hello World!");
		 * modelAndView.setViewName("index"); return modelAndView;
		 */}
}
