package cn.feng.web.ssm.global.controllers;

/**(8) 之 国际化
 * @author Administrator
 *
 */
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import org.springframework.web.servlet.support.RequestContext;

import cn.feng.web.ssm.global.po.FormatModel;

@Controller
@RequestMapping(value = "/global")
public class GlobalController {

	@RequestMapping(value = "/test", method = { RequestMethod.GET })
	public String test(HttpServletRequest request, Model model) {
		if (!model.containsAttribute("contentModel")) {
			// 从后台代码获取国际化信息
			RequestContext requestContext = new RequestContext(request);
			model.addAttribute("money", requestContext.getMessage("money"));
			model.addAttribute("date", requestContext.getMessage("date"));

			FormatModel formatModel = new FormatModel();

			formatModel.setMoney(12345.678);
			formatModel.setDate(new Date());

			model.addAttribute("contentModel", formatModel);
		}
		return "globaltest";
	}

	// <!--基于Session的国际化实现： -->
	@RequestMapping(value = "/test2", method = { RequestMethod.GET })
	public String test(
			HttpServletRequest request,
			Model model,
			@RequestParam(value = "langType", defaultValue = "zh") String langType) {
		if (!model.containsAttribute("contentModel")) {
			if (langType.equals("zh")) {
				Locale locale = new Locale("zh", "CN");
				request.getSession().setAttribute(
						SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME,
						locale);
			} else if (langType.equals("en")) {
				Locale locale = new Locale("en", "US");
				request.getSession().setAttribute(
						SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME,
						locale);
			} else
				request.getSession().setAttribute(
						SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME,
						LocaleContextHolder.getLocale());
			// 从后台代码获取国际化信息
			RequestContext requestContext = new RequestContext(request);
			model.addAttribute("money", requestContext.getMessage("money"));
			model.addAttribute("date", requestContext.getMessage("date"));

			FormatModel formatModel = new FormatModel();

			formatModel.setMoney(12345.678);
			formatModel.setDate(new Date());

			model.addAttribute("contentModel", formatModel);
		}
		return "globaltest";
	}

	 //三.基于Cookie的国际化实现：
    @RequestMapping(value="/test3", method = {RequestMethod.GET})    
    public String test(HttpServletRequest request, HttpServletResponse response, Model model, @RequestParam(value="langType", defaultValue="zh") String langType){        if(!model.containsAttribute("contentModel")){            
            /*if(langType.equals("zh")){
                Locale locale = new Locale("zh", "CN"); 
                request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME,locale); 
            }
            else if(langType.equals("en")){
                Locale locale = new Locale("en", "US"); 
                request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME,locale);
            }
            else 
                request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME,LocaleContextHolder.getLocale());*/
            
            if(langType.equals("zh")){
                Locale locale = new Locale("zh", "CN"); 
                //request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME,locale);
                (new CookieLocaleResolver()).setLocale (request, response, locale);
            }            else if(langType.equals("en")){
                Locale locale = new Locale("en", "US"); 
                //request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME,locale);
                (new CookieLocaleResolver()).setLocale (request, response, locale);
            }            else 
                //request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME,LocaleContextHolder.getLocale());
                (new CookieLocaleResolver()).setLocale (request, response, LocaleContextHolder.getLocale());            
            //从后台代码获取国际化信息
            RequestContext requestContext = new RequestContext(request);
            model.addAttribute("money", requestContext.getMessage("money"));
            model.addAttribute("date", requestContext.getMessage("date"));

            
            FormatModel formatModel=new FormatModel();

            formatModel.setMoney(12345.678);
            formatModel.setDate(new Date());
            
            model.addAttribute("contentModel", formatModel);
        }        return "globaltest";
    }
	
}
