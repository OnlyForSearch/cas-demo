package cn.feng.web.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

/**
 * Spring MVC为我们提供的拦截器接口 HandlerInterceptorAdapter适配器是Spring
 * MVC为了方便我们使用HandlerInterceptor而对HandlerInterceptor
 * 的默认实现，里面的3个方法没有做任何处理，在preHandle方法直接返回true
 * ，这样我们继承HandlerInterceptorAdapter后只需要实现3个方法中我们需要的方法即可
 * ，而不像继承HandlerInterceptor一样不管是否需要3个方法都要实现。
 * 
 * 当然借助于HandlerInterceptor我们可以实现很多其它功能，比如日志记录、请求处理时间分析等，权限验证只是其中之一。
 */
public interface HandlerInterceptor {
	// 在执行action里面的处理逻辑之前执行，它返回的是boolean，这里如果我们返回true在接着执行
	// postHandle和afterCompletion，如果我们返回false则中断执行。
	boolean preHandle(HttpServletRequest request, HttpServletResponse response,
			Object handler) throws Exception;

	// 在执行action里面的逻辑后返回视图之前执行。
	void postHandle(HttpServletRequest request, HttpServletResponse response,
			Object handler, ModelAndView modelAndView) throws Exception;

	// 在action返回视图后执行。
	void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception;

}
