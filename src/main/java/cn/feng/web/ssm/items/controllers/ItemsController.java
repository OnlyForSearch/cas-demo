package cn.feng.web.ssm.items.controllers;

import cn.feng.web.ssm.items.po.ItemsCustom;
import cn.feng.web.ssm.items.service.ItemsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

@Controller
// 为了对url进行分类管理 ，可以在这里定义根路径，最终访问url是根路径+子路径
// 比如：商品列表：/items/queryItems.action
@RequestMapping("/items")
public class ItemsController
{
    @Resource
    private ItemsService itemsService;
    private String name;


    // 商品查询github提交测试.....
    @RequestMapping(value = "/queryItems1", method = RequestMethod.GET)
    public
    @ResponseBody
    ModelAndView queryItems(HttpServletRequest request) throws Exception
    {
        // 测试forward后request是否可以共享
        System.currentTimeMillis();
        System.currentTimeMillis();
        new Date();
        /*System.out.PRINTLN();*/
        name = "";
        System.out.println("修改"+ new Date());

        System.out.println(request.getParameter("id"));

        // 调用service查找 数据库，查询商品列表
        List<ItemsCustom> itemsList =null;
       // itemsList = itemsService.findItemsList(null);

        // 返回ModelAndView

        ModelAndView modelAndView = new ModelAndView();
        // 相当 于request的setAttribut，在jsp页面中通过itemsList取数据
        modelAndView.addObject("itemsList", itemsList);

        // 指定视图
        // 下边的路径，如果在视图解析器中配置jsp路径的前缀和jsp路径的后缀，修改为
        // modelAndView.setViewName("/WEB-INF/jsp/items/itemsList.jsp");
        // 上边的路径配置可以不在程序中指定jsp路径的前缀和jsp路径的后缀
        modelAndView.setViewName("items/itemsList");

        return modelAndView;








    }
}
