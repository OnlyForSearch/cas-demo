package cn.feng.web.ssm.user.controllers;

import cn.feng.web.ssm.items.po.ItemsCustom;
import cn.feng.web.ssm.user.po.User;
import cn.feng.web.ssm.user.service.UserService;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/user")
public class UserController {

	@Resource
	private UserService userService;

	@RequestMapping(value = "/queryItems")
	public @ResponseBody ModelAndView getById(HttpServletRequest request) throws Exception {
		// 测试forward后request是否可以共享

		System.out.println(request.getParameter("id"));

		// 调用service查找 数据库，查询商品列表
		User itemsList = userService.getUserById(1);

		// 返回ModelAndView
		ModelAndView modelAndView = new ModelAndView();
		// 相当 于request的setAttribut，在jsp页面中通过itemsList取数据
		modelAndView.addObject("itemsList", itemsList);
		System.out.println(itemsList);
		// 指定视图
		// 下边的路径，如果在视图解析器中配置jsp路径的前缀和jsp路径的后缀，修改为
		// modelAndView.setViewName("/WEB-INF/jsp/items/itemsList.jsp");
		// 上边的路径配置可以不在程序中指定jsp路径的前缀和jsp路径的后缀
		modelAndView.setViewName("items/itemsList");

		return modelAndView;

	}
	
	@RequestMapping("/requestJson")
	public @ResponseBody ItemsCustom requestJson(@RequestBody ItemsCustom itemsCustom){
		
		//@ResponseBody将itemsCustom转成json输出
		return itemsCustom;
	}
	
	//请求key/value，输出json
	@RequestMapping("/responseJson")
	public @ResponseBody ItemsCustom responseJson(ItemsCustom itemsCustom){
		
		//@ResponseBody将itemsCustom转成json输出
		itemsCustom.setName("手机里22222");
		return itemsCustom;
	}
	private static SerializerFeature[] features = {SerializerFeature.WriteMapNullValue,//
			SerializerFeature.WriteNullNumberAsZero, //
			SerializerFeature.WriteNullStringAsEmpty,   //

	};
/*

	@ResponseBody
	@RequestMapping("/loadTaskListTest")
	public String loadTaskListTest(HttpServletRequest request) {

        JSONObject data = JSONObject.parseObject(request.getParameter("data"));


*/
/*{draw=1, startIndex=0, fuzzy=, fuzzySearch=true, pageSize=10}
*  size = 5
* *//*

        //直接返回前台
        String draw = request.getParameter("draw");
        //数据起始位置
        String startIndex = request.getParameter("startIndex");
        //数据长度
        String pageSize = request.getParameter("pageSize");

        String orderColumn = request.getParameter("orderColumn");

        //获取排序方式 默认为asc
        String orderDir = request.getParameter("orderDir");
        String fuzzy = request.getParameter("fuzzySearch");


        Map<Object, Object> info = new HashMap<Object, Object>();
        info.put("pageData", "");
        info.put("total", 1);
        info.put("draw", draw);
        String json = JSON.toJSONString(info);

        return json;
//		return JSON.toJSONString("", features);

	}
	@ResponseBody
	@RequestMapping("/loadTaskListTest2")
	public String loadTaskListTest2(@RequestBody JSONObject reqJson) {

        System.out.println(reqJson);
        Map<Object, Object> info = new HashMap<Object, Object>();
        List<cn.feng.web.ssm.user.controllers.User> users = new ArrayList<cn.feng.web.ssm.user.controllers.User>();

        cn.feng.web.ssm.user.controllers.User user = new cn.feng.web.ssm.user.controllers.User("1","1","1","2008/10/16","1","1",1,1);

        for (int i = 0; i < 20; i++) {
            users.add(user);

        }

        info.put("pageData", users);
        info.put("total", 20);
        info.put("draw", 1);
        String json = JSON.toJSONString(info);
        return json;
    }


*/

    /**
     * 获取比对结果
     * @param reqJson
     * @return
     */
    @RequestMapping(value = "compareResult")
    @ResponseBody
    public Map<String,Object> compareResult(@RequestBody JSONObject reqJson){
        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put("success", "true");

        return resultMap;
    }

}
