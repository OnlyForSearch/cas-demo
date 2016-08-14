package cn.feng.web.ssm.account.controllers;

/**
 * （9） 之 实现注解式权限验证
 */
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(value = "/account")
public class AccountController {

	@RequestMapping(value = "/login", method = { RequestMethod.GET })
	//@RequestMapping实现 对queryItems方法和url进行映射，一个方法对应一个url
	//一般建议将url和方法写成一样
	public String login() {
		System.out.println(" + 修改=1 232" );
		return "login";
	}

}
