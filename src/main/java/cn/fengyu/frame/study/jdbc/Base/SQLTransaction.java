package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;
import org.junit.Test;

import java.sql.*;

/**　数据库事务

 　　谈到数据库开发，事务是一个不可回避的话题，JDBC默认情况下，是每一步都自动提交的，我们可以通过设置connection.setAutoCommit(false)的方式来强制关闭自动提交，然后通过connection.commit()和connection.rollback()来实现事务提交和回滚。
 * Created by fengyu on 2016-08-25.
 */
public class SQLTransaction {

    /**
     *
     * 　简单的数据库事务

     　　下面是一个简单的数据库事务的示例：
     第一次调用时，操作成功，事务提交，
     向user表中插入了一条记录；第二次调用时，发生主键冲突异常，事务回滚。
     * */
    @Test
    public void testSimplaTransaction() throws SQLException {


        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        try {
            conn = JdbcUtils.getConnection();
            conn.setAutoCommit(false);
            st = conn.createStatement();
            st.executeQuery("INSERT INTO user(id,name) VALUES(11, 'Xiao Li')");
            conn.commit();



        } catch (Exception e) {
            e.printStackTrace();
             conn.rollback();
        } finally {
            conn.setAutoCommit(true);

            showUser(st);
            JdbcUtils.free(rs, st, conn);
        }




    }


    //带有SavePoint的事务示例

    /**
     * 　　可以看到最终事务报出了主键冲突异常，事务回滚，但是依然向数据库中插入了ID为13和14的记录。

     　　另外，在确定SavePoint后，ID为15的记录并没有被插入，它是通过事务进行了回滚。
     * @throws SQLException
     */
    @Test
    public  void transactionTest2() throws SQLException
    {

        Connection conn=null;
        Statement st = null;
        Savepoint svpt = null;
        try
        {
            conn = JdbcUtils.getConnection();
            st = conn.createStatement();
            //取消自动提交
            conn.setAutoCommit(false);
            st.executeUpdate("insert into user(id,name) values(13, 'Xiao Li')");
            st.executeUpdate("insert into user(id,name) values(14, 'Xiao Wang')");
            svpt = conn.setSavepoint("roll back to here");
            st.executeUpdate("insert into user(id,name) values(15, 'Xiao Zhao')");
            st.executeUpdate("insert into user(id,name) values(13, 'Xiao Li')");
            //提交后设置自动提交
            conn.commit();
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
            //出现异常则回滚操作
            conn.rollback(svpt);
        }
        finally
        {
            /** 下面这句要加上因为可能没执行到而异常
             *
                     */
            //，然后设置自动提交
            conn.setAutoCommit(true);
            showUser(st);
           JdbcUtils.free(null,st,conn);
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
