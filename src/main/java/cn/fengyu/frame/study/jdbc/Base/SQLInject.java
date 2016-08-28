package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;
import org.junit.Test;

import java.sql.*;

/**SQL注入
 * Created by fengyu on 2016-08-24.
 */
public class SQLInject {


    /**
     * 展现sql注入
     * 拼串的方式:存在安全隐患
     * @throws SQLException
     */
    @Test
    public void read1() throws SQLException {
        String name="'or 1 or'";
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            // 2.建立连接
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();

            // 3.创建语句
            String sql = "select id, name, money, birthday  from user where name='"
                    + name + "'";
            System.out.println(sql);
            st = conn.createStatement();
            // 4.执行语句
            rs = st.executeQuery(sql);

            // 5.处理结果
            while (rs.next()) {
                 System.out.println(rs.getObject("id") + "\t"
                 + rs.getObject("name") + "\t"
                 + rs.getObject("birthday") + "\t"
                 + rs.getObject("money"));
            }
        } finally {
            JdbcUtils.free(rs, st, conn);
        }
    }


    @Test
    public void read2() throws SQLException {
        String name="'or 1 or'";
        Connection conn = null;
        PreparedStatement st = null;//预处理可以防止SQL注入
        ResultSet rs = null;
        try {
            // 2.建立连接
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();

            // 3.创建语句
            String sql = "select id, name, money, birthday  from user where name=?";
            System.out.println(sql);
            st = conn.prepareStatement(sql);
            st.setString(1,name);
            // 4.执行语句
            rs = st.executeQuery();

            // 5.处理结果
            while (rs.next()) {
                System.out.println(rs.getObject("id") + "\t"
                        + rs.getObject("name") + "\t"
                        + rs.getObject("birthday") + "\t"
                        + rs.getObject("money"));
            }
        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }
    /**
     *
     * 返回具体的数据类型
     * */
    @Test
    public void read3() throws SQLException {
        String name="'or 1 or'";
        Connection conn = null;
        PreparedStatement st = null;//预处理可以防止SQL注入
        ResultSet rs = null;
        try {
            // 2.建立连接
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();

            // 3.创建语句
            String sql = "select id, name, money, birthday  from user where name=?";
            System.out.println(sql);
            st = conn.prepareStatement(sql);
            st.setString(1,name);
            // 4.执行语句
            rs = st.executeQuery();

            // 5.处理结果
            while (rs.next()) {
                System.out.println(rs.getInt("id") + "\t"
                        + rs.getString("name") + "\t"
                        + rs.getDate("birthday") + "\t"
                        + rs.getFloat("money"));
            }
        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }

}
