package cn.feng.web.ssm.ffcs.controllers;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Controller
@RequestMapping("/ffcs")
public class FfcsController {


	@ResponseBody
	@RequestMapping("/loadTaskListTest")
	public String loadTaskListTest(HttpServletRequest request) {

        JSONObject data = JSONObject.parseObject(request.getParameter("data"));


/*{draw=1, startIndex=0, fuzzy=, fuzzySearch=true, pageSize=10}
*  size = 5
* */

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


    /*
    *
    * {
    "draw": 6,

    "order": [
        {
            "column": 3,
            "dir": "asc"
        }
    ],
    "start": 50,
    "length": 25,

}
    *
    * */
/*
	@ResponseBody
	@RequestMapping("/loadTaskListTest2")
	public String loadTaskListTest2(@RequestBody JSONObject reqJson) {

        //数据起始位置
        int start = reqJson.getIntValue("start");
        //数据长度
        int length = reqJson.getIntValue("length");

        //定义列名
        String[] cols = {"name", "position", "salary", "start_date", "office", "extn", "status", "role"};



        System.out.println(reqJson);
        Map<Object, Object> info = new HashMap<Object, Object>();

        List<Map<String, String>> uses = new ArrayList<Map<String, String>>();
        for (int i = 0; i < 10; i++) {
            Map<String, String> infos = new HashMap<String, String>();
            infos.put("a","1"+i);
            infos.put("b","2"+i);
            infos.put("c","3"+i);
            infos.put("d","4"+i);
            infos.put("e","5"+i);
            infos.put("f","6"+i);

             uses.add(infos);

        }

        info.put("pageData", uses);
        info.put("total", 40);
        info.put("draw", reqJson.getString("draw"));
        String json = JSON.toJSONString(info);
        return json;
    }*/


    @ResponseBody
    @RequestMapping("/loadTaskListTest2")
    public String loadTaskListTest2(@RequestBody com.alibaba.fastjson.JSONObject reqJson) {

        //数据起始位置
        int start = reqJson.getIntValue("start");
        //数据长度
        int length = reqJson.getIntValue("length");

        //定义列名
        String[] cols = {"name", "position", "salary", "start_date", "office", "extn", "status", "role"};


        System.out.println(reqJson);
        Map<Object, Object> info = new HashMap<Object, Object>();

       // , TASK_NAME, TASK_ID, TASK_APPLY_MAN, TASK_STATE, TASK_BEGIN_TIME, TASK_END_TIME, UNDO_NUMS, DO_NUMS, TASK_SUMIT_TIME


        List<Map<String, String>> uses = new ArrayList<Map<String, String>>();
        for (int i = 0; i < 10; i++) {
            Map<String, String> infos = new HashMap<String, String>();
            infos.put("TASK_NAME", "测试JOINTTAST_20160514_0003 _1" );
            infos.put("TASK_ID", "JOINTTAST_20160608_0001　" );
            infos.put("TASK_APPLY_MAN", "admin　" );

            String[] states=new String[]{
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",

            };
            infos.put("TASK_STATE",states[new Random().nextInt(5)]);
            infos.put("TASK_BEGIN_TIME", "2016-06-08　" );
            infos.put("TASK_END_TIME", "2016-06-21　" );
            Integer[] integers = new Integer[]{

                    0,1232,1232,332

            };

            infos.put("TASK_SUMIT_TIME", "2016-06-08 10:07:20 " );
            infos.put("UNDO_NUMS",integers[new Random().nextInt(4)].toString() );
            infos.put("DO_NUMS", integers[new Random().nextInt(4)].toString());

            uses.add(infos);

        }

        info.put("pageData", uses);
        info.put("total", 40);
        info.put("draw", reqJson.getString("draw"));
        String json = com.alibaba.fastjson.JSON.toJSONString(info);
        return json;
    }


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
