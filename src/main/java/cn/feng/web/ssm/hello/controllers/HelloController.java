package cn.feng.web.ssm.hello.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import cn.feng.web.auth.AuthPassport;

//由于我们之前配置了：<mvc:view-controller path="/" view-name="forward:/helloworld/index"/> 所以直接可以看到结果：

//注解把该class指定为controller
@Controller
// 注解的 value值指定该controller所映射的请求。
@RequestMapping(value = "/helloworld")
public class HelloController {
	// 注解指定该方法为一个action，value 值指定该action所映射的请求，method
	// 中的RequestMethod.GET指定该action只接受get请求。
	// @RequestMapping(value="/*", method = {RequestMethod.GET,
	// RequestMethod.POST})表示该action可以接受get或post请求，不过更简单的是不对method做配置则默认支持所有请求方式。

	// http://localhost:8888/springmvc/helloworld/index
/*	@RequestMapping(value = "/index", method = RequestMethod.GET)
	public ModelAndView index() {
		ModelAndView view = new ModelAndView();
		view.addObject("message", "Hellow world");
		view.setViewName("index");
		return view;// 解析视图时会在springservlet-config.xml文件指定的视图文件夹中寻找对应的视图index。
	}
*/
	// 自定义注解AuthPassport：
	// 1.1.对一个action配置多个URL映射：这表示对该action配置了/index和/hello两个映射
	@AuthPassport
	@RequestMapping(value = { "/index", "/hello" }, method = RequestMethod.GET)
	public ModelAndView index2() {
		ModelAndView view = new ModelAndView();
		view.addObject("message", "Hellow world");
		view.setViewName("jsonTest");
		return view;// 解析视图时会在springservlet-config.xml文件指定的视图文件夹中寻找对应的视图index。
	}

	// 1.2. {id}为占位符表示可以映射请求为/detail/xxxx 的URL如：/detail/123等。
	// 方法的参数@PathVariable(value="id") Integer id
	// 用于将URL中占位符所对应变量映射到参数id上，@PathVariable(value="id")
	// 中value的值要和占位符/{id}大括号中的值一致。
	// http://localhost:8888/springmvc/helloworld/detail/123
	@RequestMapping(value = "/detail/{id}", method = { RequestMethod.GET })
	public ModelAndView getDetail(@PathVariable(value = "id") Integer id) {

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("id", id);
		modelAndView.setViewName("detail");
		return modelAndView;
	}

	/*
	 * 1.3.URL通配符映射：
	 * 
	 * 我们还可以通过通配符对URL映射进行配置，通配符有“？”和“*”两个字符。其中“？”表示1个字符，“*”表示匹配多个字符，“**”表示匹配0个或多个路径
	 * 。
	 * 
	 * 例如：
	 * 
	 * “/helloworld/index?”可以匹配“/helloworld/indexA”、“/helloworld/indexB”，但不能匹配“/
	 * helloworld/index”也不能匹配“/helloworld/indexAA”；
	 * 
	 * “/helloworld/index*”可以匹配“/helloworld/index”、“/helloworld/indexA”、“/helloworld
	 * /indexAA”但不能匹配“/helloworld/index/A”；
	 * 
	 * “/helloworld/index/*”可以匹配“/helloworld/index/”、“/helloworld/index/A”、“/
	 * helloworld/index/AA”、“/helloworld/index/AB”但不能匹配
	 * “/helloworld/index”、“/helloworld/index/A/B”;
	 * 
	 * “/helloworld/index/**”可以匹配“/helloworld/index/”下的多有子路径，比如：“/helloworld/index
	 * /A/B/C/D”;
	 * 
	 * 如果现在有“/helloworld/index”和“/helloworld/*”，如果请求地址为“/helloworld/index”
	 * 那么将如何匹配？Spring MVC会按照最长匹配优先原则（即和映射配置中哪个匹配的最多）来匹配，所以会匹配“/helloworld/index”
	 */
	// http://localhost:8888/springmvc/helloworld/AAA
	@RequestMapping(value = "/*", method = { RequestMethod.GET })
	public ModelAndView urlTest() {

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("urltest");
		return modelAndView;
	}

	// 1.4.1URL正则表达式映射：
	// http://localhost:8888/springmvc/helloworld/reg/Hanmeimei-18
	@RequestMapping(value = "/reg/{name:\\w+}-{age:\\d+}", method = { RequestMethod.GET })
	public ModelAndView regUrlTest(@PathVariable(value = "name") String name,
			@PathVariable(value = "age") Integer age) {

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("name", name);
		modelAndView.addObject("age", age);
		modelAndView.setViewName("regurltest");
		return modelAndView;
	}

	// 3.限制action所接受请求的参数：
	// 我们可以为某个action指定映射的请求中必须包含某参数，或必须不包含某参数，或者某参数必须等于某个值，或者某参数必须不等于某个值这些限制。
	// 3.1.指定映射请求必须包含某参数：
	// http://localhost:8888/springmvc/helloworld/paramstest
	// 指定映射请求必须包含某参数：
	@RequestMapping(value = "/paramstest", params = "example", method = { RequestMethod.GET })
	public ModelAndView paramsTest() {

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("paramstest");
		return modelAndView;
	}
	// 3.2.指定映射请求必须不包含某参数：
	// @RequestMapping(value="/paramstest", params="!example", method =
	// {RequestMethod.GET})
	// 3.3.指定映射请求中或者某参数必须等于某个值：
	// @RequestMapping(value="/paramstest", params="example=AAA", method =
	// {RequestMethod.GET})
	// 3.4.指定映射请求中或者某参数必须不等于某个值：
	// @RequestMapping(value="/paramstest", params="example!=AAA", method =
	// {RequestMethod.GET})

	// 4.限制action所接受请求头参数：同限制action所接受的请求参数一样，我们也可以为某个action指定映射的请求头中必须包含某参数，或必须不包含某参数，或者某参数必须等于某个值，或者某参数必须不等于某个值这些限制
	// 4.1.指定映射请求头必须包含某参数：
	// @RequestMapping(value="/headerTest", headers = "example")。
	// 4.2.指定映射请求头必须不包含某参数：
	// @RequestMapping(value="/headerTest", headers = "!example")。
	// 4.3.指定映射请求头中或者某参数必须等于某个值：
	// @RequestMapping(value="/headerTest", headers = "Accept=text/html")
	// 4.4.指定映射请求头中或者某参数必须不等于某个值：
	// @RequestMapping(value="/headerTest", headers = "Accept!=text/html")。
	/**
	 * 当我们为headers指定多个参数时如：headers={"example1",
	 * "example2"}，表示的是and关系，即两个参数限制必须同时满足。
	 */
}
