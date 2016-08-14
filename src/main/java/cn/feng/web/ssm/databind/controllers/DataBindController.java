package cn.feng.web.ssm.databind.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import cn.feng.web.ssm.account.po.AccountModel;

@Controller
@RequestMapping(value = "/databind")
public class DataBindController {
	/**
	 * 首先看一下都有哪些绑定数据的注解：
	 * 
	 * 1.@RequestParam，绑定单个请求数据，可以是URL中的数据，表单提交的数据或上传的文件；
	 * 2.@PathVariable，绑定URL模板变量值； 3.@CookieValue，绑定Cookie数据；
	 * 4.@RequestHeader，绑定请求头数据； 5.@ModelAttribute，绑定数据到Model；
	 * 6.@SessionAttributes，绑定数据到Session；
	 * 7.@RequestBody，用来处理Content-Type不是application
	 * /x-www-form-urlencoded编码的内容，例如application/json, application/xml等；
	 * 8.@RequestPart，绑定“multipart/data”数据，并可以根据数据类型进项对象转换；
	 * 
	 * */

	// http://localhost:8888/springmvc/databind/parambind
	//@RequestMapping实现 对queryItems方法和url进行映射，一个方法对应一个url
	//一般建议将url和方法写成一样
	@RequestMapping(value = "/parambind", method = { RequestMethod.GET })
	public ModelAndView paramBind() {

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("parambind");
		return modelAndView;
	}

	// http://localhost:8888/springmvc/databind/parambind
	@RequestMapping(value = "/parambind", method = { RequestMethod.POST })
	public ModelAndView paramBind(HttpServletRequest request,
			@RequestParam("urlParam") String urlParam,
			@RequestParam("formParam") String formParam,
			@RequestParam("formFile") MultipartFile formFile) {
		// 如果不用注解自动绑定，我们还可以像下面一样手动获取数据
		String urlParam1 = ServletRequestUtils.getStringParameter(request,
				"urlParam", null);
		String formParam1 = ServletRequestUtils.getStringParameter(request,
				"formParam", null);
		MultipartFile formFile1 = ((MultipartHttpServletRequest) request)
				.getFile("formFile");

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("urlParam", urlParam);
		modelAndView.addObject("formParam", formParam);
		modelAndView.addObject("formFileName", formFile.getOriginalFilename());

		modelAndView.addObject("urlParam1", urlParam1);
		modelAndView.addObject("formParam1", formParam1);
		modelAndView
				.addObject("formFileName1", formFile1.getOriginalFilename());
		modelAndView.setViewName("parambindresult");
		return modelAndView;
	}

	// http://localhost:8888/springmvc/databind/modelautobind
	@RequestMapping(value = "/modelautobind", method = { RequestMethod.GET })
	public String modelAutoBind(HttpServletRequest request, Model model) {

		model.addAttribute("accountmodel", new AccountModel());
		return "modelautobind";
	}

	// http://localhost:8888/springmvc/databind/modelautobind
	@RequestMapping(value = "/modelautobind", method = { RequestMethod.POST })
	public String modelAutoBind(HttpServletRequest request, Model model,
			AccountModel accountModel) {

		model.addAttribute("accountmodel", accountModel);
		return "modelautobindresult";
	}

	// 注：

	/*
	 * 1.关于@RequestParam的参数，这是一个@RequestParam的完整写法@RequestParam(value="username",
	 * required=true, defaultValue="AAA")。value表示要绑定请求中参数的名字；
	 * required表示请求中是否必须有这个参数，默认为true这是如果请求中没有要绑定的参数则返回404；
	 * defaultValue表示如果请求中指定的参数值为空时的默认值；
	 * 要绑定的参数如果是值类型必须要有值否则抛异常，如果是引用类型则默认为null（Boolean除外，默认为false）；
	 * 2.在刚才添加的2个action中可以看到返回类型和以前的不一样了由ModelAndView变成了String，这是由于Spring MVC
	 * 提供Model
	 * 、ModelMap、Map让我们可以直接添加渲染视图需要的模型数据，在返回时直接指定对应视图名称就可以了。同时Map是继承于ModelMap的
	 * ，而Model和ModelMap是继承于ExtendedModelMap的。
	 * 3.在刚才添加的视图modelautobind.jsp中可以看到<form:form、<form:input 等标签，这是Spring
	 * MVC提供的表单标签，借助于这些标签我们可以很方便的把模型数据绑定到表单上面（当然你也可以选择继续使用原生的HTML表单标签），要使用Spring
	 * MVC只要在视图中添加引用 <%@ taglib prefix="form"
	 * uri="http://www.springframework.org/tags/form" %>即可，关于Spring
	 * MVC表单标签的具体内容会在以后的文章中作介绍。
	 */

	/****************************************************/

	// 1.@PathVariable 用来绑定URL模板变量值，这个我们已经在系列（3）中介绍了使用方法，这里不在赘述。
	// 2.@CookieValue 用来绑定Cookie中的数据。
	// @CookieValue 与@RequestParam 一样也有3个参数，其含义与的@RequestParam 参数含义相同。
	// @CookieValue Test
	// http://localhost:8888/springmvc/databind/cookiebind
	@RequestMapping(value = "/cookiebind", method = { RequestMethod.GET })
	public String cookieBind(
			HttpServletRequest request,
			Model model,
			@CookieValue(value = "JSESSIONID", defaultValue = "") String jsessionId) {

		model.addAttribute("jsessionId", jsessionId);
		return "cookiebindresult";
	}

	/****************************************************/
	// @RequestHeader Test
	// http://localhost:8888/springmvc/databind/requestheaderbind
	// ：@RequestHeader 与@RequestParam 一样也有3个参数，其含义与的@RequestParam 参数含义相同。
	@RequestMapping(value = "/requestheaderbind", method = { RequestMethod.GET })
	public String requestHeaderBind(
			HttpServletRequest request,
			Model model,
			@RequestHeader(value = "User-Agent", defaultValue = "") String userAgent) {

		model.addAttribute("userAgent", userAgent);
		return "requestheaderbindresult";
	}

	/****************************************************/
	// 4.@ModelAttribute 绑定数据到模型中。在系列（4）的modelAutoBind action中我们将表单提交的数据添加到
	//
/*	@RequestMapping(value = "/modelautobind", method = { RequestMethod.POST })
	public String modelAutoBind(HttpServletRequest request,
			@ModelAttribute("accountmodel") AccountModel accountModel) {
		return "modelautobindresult";
	}*/

	/****************************************************/
	// 5.Model中的数据作用域是Request级别的，也就是说在一个Request请求中是获取不到其它Request请求的Model的数据的。但我们可以用@SessionAttributes
	// 把数据存储到session中，来保持多次请求间数据，这样就可以来实现比如分步骤提交表单等需求。
	/****************************************************/
	// @SessionAttributes Test
	@ModelAttribute("sessionaccountmodel")
	public AccountModel initAccountModel() {
		return new AccountModel();
	}

	// http://localhost:8888/springmvc/databind/usernamebind
	@RequestMapping(value = "/usernamebind", method = { RequestMethod.GET })
	public String userNameBind(Model model, AccountModel accountModel) {

		model.addAttribute("sessionaccountmodel", new AccountModel());
		return "usernamebind";
	}

	// http://localhost:8888/springmvc/databind/usernamebind
	@RequestMapping(value = "/usernamebind", method = { RequestMethod.POST })
	public String userNameBindPost(
			@ModelAttribute("sessionaccountmodel") AccountModel accountModel) {
		// 重定向到密码绑定测试
		return "redirect:passwordbind";
	}

	// http://localhost:8888/springmvc/databind/passwordbind
	@RequestMapping(value = "/passwordbind", method = { RequestMethod.GET })
	public String passwordBind(
			@ModelAttribute("sessionaccountmodel") AccountModel accountModel) {
		return "passwordbind";
	}

	// http://localhost:8888/springmvc/databind/passwordbind
	@RequestMapping(value = "/passwordbind", method = { RequestMethod.POST })
	public String passwordBindPost(
			@ModelAttribute("sessionaccountmodel") AccountModel accountModel,
			SessionStatus status) {
		// 销毁@SessionAttributes存储的对象 status.setComplete(); //显示绑定结果
		return "sessionmodelbindresult";
	}

	// 由于我们在controller上指定了@SessionAttributes，所以在@ModelAttribute(“xxx”)注解的参数会直接在@SessionAttributes中查找名为”xxx”的对象，如果没有找到则调用@ModelAttribute(“xxx”)注解的方法返回对象并存入@SessionAttributes（如果没有找到且没有@ModelAttribute(“xxx”)注解的方法就会抛出HttpSessionRequiredException）。当执行到最后一步就可以调用SessionStatus
	// .setComplete()方法把@SessionAttributes中保存对象销毁了（不会清除HttpSession中的数据）。
	// @SessionAttributes有value和types两个参数其中value指明要对象的名称，types指定要绑定对象的类型，如@SessionAttributes(value
	// = "sessionaccountmodel",
	// types=AccountModel.class)两者是and关系，需要同时满足。也可以同时指定多个value和types
	// 如：@SessionAttributes(value = {"aa", "aa"} , types={XXX.class, YYY.class})
	// 。

	/****************************************************/
	// 6.@RequestBody
	// 调用合适的MessageConvert来把非application/x-www-form-urlencoded请求中的内容转换为指定的对象它通常与@ResponseBody合用，@ResponseBody与.@RequestBody刚好相反，他把指定的对象转换为合适的内容（请求头为Accept:application/json
	// 则返回json数据）并返回。这里我们用一个ajax请求做演示：修改AccountModel让其继承Serializable接口，并添加一个空的构造函数（为了Jackson做转换）。
	// @RequestBody Test
	// // http://localhost:8888/springmvc/databind/requestbodybind
	@RequestMapping(value = "/requestbodybind", method = { RequestMethod.GET })
	public String requestBodyBind(Model model) {

		model.addAttribute("accountmodel", new AccountModel());
		return "requestbodybind";
	}

	// // http://localhost:8888/springmvc/databind/requestbodybind
	@RequestMapping(value = "/requestbodybind", method = { RequestMethod.POST })
	public @ResponseBody
	AccountModel requestBodyBind(@RequestBody AccountModel accountModel) {
		return accountModel;
	}
	/****************************************************/
	// 7.@RequestPart
	// 绑定“multipart/form-data“类型数据，支持javax.servlet.http.Part文件上传，并可可以进行类型转换

	/****************************************************/
	/****************************************************/
	/****************************************************/
	/****************************************************/

}