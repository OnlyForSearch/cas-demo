package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;
import org.junit.Test;

import java.sql.*;

/**
 * Created by fengyu on 2016-08-24.
 */
public class CRUD {

    /**
     * 创建表并插入数据
     */
    @Test
    public void testCreateTable() {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            conn = JdbcUtils.getConnection();
            st = conn.createStatement();
            //执行查询语句，另外也可以用execute()，代表执行任何SQL语句
            st.execute("CREATE TABLE foo(ID INT NOT NULL, NAME VARCHAR(30))");//创建表
            st.executeUpdate("INSERT INTO foo(ID,NAME) VALUES(1, 'Zhang San')");//更新语句
            rs = st.executeQuery("SELECT ID,NAME FROM foo");

            while (rs.next()) {
                int id = rs.getInt(1);
                System.out.println("id = " + id);
                String name = rs.getString(2);
                System.out.println("name = " + name);

            }

        } catch (Exception e) {
            e.printStackTrace();
        }


    }


    /**
     * 插入数据 C
     */
    @Test
    public void testCreate() throws SQLException {


        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            //2建立连接

            conn = JdbcUtils.getConnection();

            //3创建语句
            // 3.创建语句
            st = conn.createStatement();

            // 4.执行语句
            String sql = "INSERT INTO  user (name,birthday,money) VALUES ('name2','2016-08-24','333')";
            int i = st.executeUpdate(sql);//返回一个数字,说明插入了多少条数据
            System.out.println("i = " + i);


        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }

    /**
     * 读取数据 R
     */
    @Test
    public void testRead() throws SQLException {

        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            //2建立连接

            conn = JdbcUtils.getConnection();

            //3创建语句
            // 3.创建语句
            st = conn.createStatement();

            // 4.执行语句
            rs = st.executeQuery("SELECT id,name,money,birthday FROM user");//建议按照列名进行操作,防止出错

            // 5.处理结果

            while (rs.next()) {
                System.out.println(rs.getObject("id") + "\t"//获取第一列
                        + rs.getObject("name") + "\t"//获取第二列
                        + rs.getObject("money") + "\t"//获取第3列
                        + rs.getObject("birthday") + "\t"//获取第4列
                );
            }

        } finally {
            JdbcUtils.free(rs, st, conn);

        }

    }

    /**
     * 修改
     */

    @Test
    public void testUpdate() throws SQLException {


        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            //2建立连接

            conn = JdbcUtils.getConnection();

            // 3.创建语句
            st = conn.createStatement();

            // 4.执行语句
            String sql = "UPDATE user SET money=money+200";
            int i = st.executeUpdate(sql);//返回一个数字,说明插入了多少条数据
            System.out.println("修改影响:i = " + i);


        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }

    /**
     * 删除
     */

    @Test
    public void testDelete() throws SQLException {


        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            //2建立连接

            conn = JdbcUtils.getConnection();

            //3创建语句
            // 3.创建语句
            st = conn.createStatement();

            // 4.执行语句
            String sql = "DELETE FROM user WHERE id>=3";
            int i = st.executeUpdate(sql);//返回一个数字,说明插入了多少条数据
            System.out.println("i = " + i);


        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }

    /**
     * 我们可以使用CallableStatement来调用存储过程：
     * 存储过程是做数据库开发时经常使用的技术，它可以通过节省编译时间的方式来提升系统性能，我们这里的示例使用MySQL数据库。
     　　如何调用不带参数的存储过程
     */
    @Test
    public void testExecStoredProdureTest() {

        Connection conn = null;
        CallableStatement cst = null;
        ResultSet rs = null;
        try {
            conn = JdbcUtils.getConnection();
            cst=  conn.prepareCall("CALL  GetUser()");
            rs = cst.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("ID");
                String name = rs.getString("NAME");
                System.out.println("ID:" + id + "; NAME=" + name);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
 /**
     * 我们可以使用CallableStatement来调用存储过程：
      　MySQL的存储过程中的参数分为三种：in/out/inout，我们可以把in看做入力参数，out看做出力参数，JDBC对这两种类型的参数设置方式不同：
  　　1）in， JDBC使用类似于cst.set(1, 10)的方式来设置
  　　2）out，JDBC使用类似于cst.registerOutParameter(2, Types.VARCHAR);的方式来设置
  　　我们来看一个in参数的示例，假设我们希望返回ID为特定值的user信息，存储过程如下：
     */
    @Test
    public void testExecStoredProdureTest2() {
        int idArg=1;
        Connection conn = null;
        CallableStatement cst = null;
        ResultSet rs = null;
        try {
            conn = JdbcUtils.getConnection();
            cst=  conn.prepareCall("CALL  GetUserByID(?)");
            cst.setInt(1,idArg);
            rs = cst.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("ID");
                String name = rs.getString("NAME");
                System.out.println("ID:" + id + "; NAME=" + name);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
