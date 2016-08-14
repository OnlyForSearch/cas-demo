package cn.feng.web.exception;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

/**
 * 在项目中如何处理出现的异常，在每个可能出现异常的地方都写代码捕捉异常？这显然是不合理的，当项目越来越大是也是不可维护的。
 * 那么如何保证我们处理异常的代码精简且便于维护呢？这就是本篇要讲的内容—>异常处理。
 * 
 * 在Spring MVC中我们可以通过以下2中途径来对异常进行集中处理：
 * 
 * 一.继承HandlerExceptionResolver接口实现自己的处理方法
 */
public class MyHandlerExceptionResolver implements HandlerExceptionResolver {

	public ModelAndView resolveException(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex) {

		// 添加自己的异常处理逻辑，如日志记录等

		// TODO Auto-generated method stub
		return new ModelAndView("exception");
	}

}