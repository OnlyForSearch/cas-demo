package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;

import org.junit.Test;

import java.sql.*;

/**
 * 　预处理以及批处理
 * <p>
 * 　　预处理和批处理都是用来提升系统性能的方式，一种是利用数据库的缓存机制，一种是利用数据库一次执行多条语句的方式。
 * 　　预处理
 * <p>
 * 　　数据库服务器接收到Statement后，一般会解析Statement、分析是否有语法错误、定制最优的执行计划，这个过程可能会降低系统的性能。一般的数据库服务器都这对这种情况，设计了缓存机制，当数据库接收到指令时，如果缓存中已经存在，那么就不再解析，而是直接运行。
 * <p>
 * 　　这里相同的指令是指sql语句完全一样，包括大小写。
 * Created by fengyu on 2016-08-25.
 */
public class PrepareAndBatch {

    /**
     * JDBC使用PreparedStatement来完成预处理：
     */
    @Test
    public void testPrepare() {

        Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;

        try {
            conn = JdbcUtils.getConnection();
            ////使用？代替变量
            st = conn.prepareStatement("INSERT INTO user(name) VALUES(?)");

            st.setString(1, "Fengyu");
            st.executeUpdate();
            showUser(st);


        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            JdbcUtils.free(rs, st, conn);
        }

    }

    /**
     * 批处理
     * <p>
     * 　　批处理是利用数据库一次执行多条语句的机制来提升性能，这样可以避免多次建立连接带来的性能损失。
     * <p>
     * 　　批处理使用Statement的addBatch来添加指令，使用executeBatch方法来一次执行多条指令：
     */
    @Test
    public void testBatch() {

        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        try {
            conn = JdbcUtils.getConnection();
            st=conn.createStatement();
            st.addBatch("INSERT INTO user(id,name) VALUES(6,'fengyu6')");
            st.addBatch("INSERT INTO user(id,name) VALUES(7,'fengyu7')");
            st.addBatch("INSERT INTO user(id,name) VALUES(8,'fengyu18')");
            st.executeBatch();
            showUser(st);


        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            JdbcUtils.free(rs, st, conn);
        }

    }

    /**
     * 　预处理和批处理相结合

     　　我们可以把预处理和批处理结合起来，利用数据库的缓存机制，一次执行多条语句：
     */
    @Test
    public void testPrepareAndBatch() {

        Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;

        try {
            conn = JdbcUtils.getConnection();
             st = conn.prepareStatement("insert into user(id,name) values(?,?)");
                st.setInt(1, 9);
                st.setString(2, "feng 9");
                st.addBatch();
                 st.setInt(1, 10);
                 st.setString(2, "feng 10");
                 st.addBatch();
                 st.setInt(1, 11);
                 st.setString(2, "feng 11");
                 st.addBatch();
                 st.executeBatch();
                 showUser(st);


        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            JdbcUtils.free(rs, st, conn);
        }

    }


    private static void showUser(Statement st) throws SQLException {
        ResultSet rs = st.executeQuery("SELECT ID, NAME FROM user");
        while (rs.next()) {
            int id = rs.getInt("ID");
            String name = rs.getString("NAME");
            System.out.println("ID:" + id + "; NAME=" + name);
        }
        rs.close();
    }
}
