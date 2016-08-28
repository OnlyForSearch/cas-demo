package cn.fengyu.frame.study.jdbc.springjdbc.product.util;

import java.util.UUID;

/**生成主键的工具类：
 * Created by fengyu on 2016-08-26.
 */
public final class ToolUtil {

    /**
     * 生成32位UUID 并去掉"-"
     */
    public static String getUUID() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

    public static void main(String[] args) {
        System.out.println(ToolUtil.getUUID());
        System.out.println(ToolUtil.getUUID().length());// 32
    }
}