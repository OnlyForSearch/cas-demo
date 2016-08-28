package cn.fengyu.frame.study.jdbc.Base;

import com.mysql.jdbc.*;
import org.junit.Test;

import java.sql.*;
import java.sql.Connection;
import java.sql.Statement;

/**
 * Created by fengyu on 2016-08-24.
 */
public class Base {


    public static void main(String[] args) {


    }

    /**
     * 最基本的jdbc演示
     *
     * @throws SQLException
     */
    @Test//演示
    public void test() throws SQLException, ClassNotFoundException {
        // 1.注册驱动(3种方式)
        DriverManager.registerDriver(new com.mysql.jdbc.Driver());
        System.setProperty("jdbc.drivers", "com.mysql.jdbc.Driver");

      /*
      * 加载JDBC驱动程序：
    在连接数据库之前，首先要加载想要连接的数据库的驱动到JVM（Java虚拟机），
    这通过java.lang.Class类的静态方法forName(String  className)实现。
    例如：
      * */
        Class.forName("com.mysql.jdbc.Driver");// 推荐方式

        //2建立连接
        //        * 连接URL定义了连接数据库时的协议、子协议、数据源标识。
        //    ?书写形式：协议：子协议：数据源标识
        //    协议：在JDBC中总是以jdbc开始
        //    子协议：是桥连接的驱动程序或是数据库管理系统名称。
        //    数据源标识：标记找到数据库来源的地址与连接端口。
        //      useUnicode=true：表示使用Unicode字符集。如果characterEncoding设置为
        //   gb2312或GBK，本参数必须设置为true 。characterEncoding=gbk：字符编码方式。
        //        *
        /*要连接数据库，需要向java.sql.DriverManager请求并获得Connection对象，   */
        // 该对象就代表一个数据库的连接。
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc", "root", "root");


        //3创建语句
        //        要执行SQL语句，必须获得java.sql.Statement实例，Statement实例分为以下3
        //        种类型：
        //        1、执行静态SQL语句。通常通过Statement实例实现。    Statement stmt = con.createStatement() ;
        //        2、执行动态SQL语句。通常通过PreparedStatement实例实现。PreparedStatement pstmt = con.prepareStatement(sql) ;
        //        3、执行数据库存储过程。通常通过CallableStatement实例实现。CallableStatement cstmt =      con.prepareCall("{CALL demoSp(? , ?)}") ;

        // 3.创建语句
        Statement st = conn.createStatement();

        // 4.执行语句
        //        执行SQL语句
        //        Statement接口提供了三种执行SQL语句的方法：executeQuery 、executeUpdate
        //                和execute
        //        1、ResultSet executeQuery(String sqlString)：执行查询数据库的SQL语句
        //        ，返回一个结果集（ResultSet）对象。 ResultSet rs = stmt.executeQuery("SELECT * FROM ...") ;

        //        2、int executeUpdate(String sqlString)：用于执行INSERT、UPDATE或
        //        DELETE语句以及SQL DDL语句，如：CREATE TABLE和DROP TABLE等 int rows = stmt.executeUpdate("INSERT INTO ...") ;

        //        3、execute(sqlString):用于执行返回多个结果集、多个更新计数或二者组合的
        //        语句。boolean flag = stmt.execute(String sql)
        //        具体实现的代码：

        ResultSet rs = st.executeQuery("SELECT * FROM user");

        // 5.处理结果
        //        1、执行更新返回的是本次操作影响到的记录数。
        //        2、执行查询返回的结果是一个ResultSet对象。
        // ResultSet包含符合SQL语句中条件的所有行，并且它通过一套get方法提供了对这些
        //        行中数据的访问。
        //使用结果集（ResultSet）对象的访问方法获取数据：
        while (rs.next()) {
//

        //String name = rs.getString("name") ;
        //String pass = rs.getString(1) ; // 此方法比较高效
            System.out.println(rs.getObject(1) + "\t"//获取第一列
                    + rs.getObject(2) + "\t"//获取第二列
                    + rs.getObject(3) + "\t"//获取第3列
            );
        }


        //        7、关闭JDBC对象
        //        操作完成以后要把所有使用的JDBC对象全都关闭，以释放JDBC资源，关闭顺序和声
        //        明顺序相反：
        //        1、关闭记录集
        //        2、关闭声明
        //        3、关闭连接对象
        // 6.释放资源
        rs.close();//  // 关闭记录集
        st.close();//// 关闭声明
        conn.close();// // 关闭连接对象


    }


    @Test
    public void test2() throws SQLException, ClassNotFoundException {
        // 1.注册驱动(3种方式)
        DriverManager.registerDriver(new com.mysql.jdbc.Driver());
        System.setProperty("jdbc.drivers", "com.mysql.jdbc.Driver");
        Class.forName("com.mysql.jdbc.Driver");// 推荐方式

        //2建立连接
        String url = "jdbc:mysql://localhost:3306/jdbc";
        String user = "root";
        String password = "root";
        Connection conn = DriverManager.getConnection(url, user, password);


        //3创建语句
        // 3.创建语句
        Statement st = conn.createStatement();

        // 4.执行语句
        ResultSet rs = st.executeQuery("SELECT * FROM user");

        // 5.处理结果

        while (rs.next()) {
            System.out.println(rs.getObject(1) + "\t"//获取第一列
                    + rs.getObject(2) + "\t"//获取第二列
                    + rs.getObject(3) + "\t"//获取第3列
            );
        }

        // 6.释放资源
        rs.close();
        st.close();
        conn.close();


    }

    /**
     * 测试 通用模版模版
     *
     * @throws Exception
     */
    @Test
    public void testTemplate() throws Exception {


        //2建立连接
        String url = "jdbc:mysql://localhost:3306/jdbc";
        String user = "root";
        String password = "root";

        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            //2建立连接

            conn = DriverManager.getConnection(url, user, password);

            //3创建语句
            // 3.创建语句
            st = conn.createStatement();

            // 4.执行语句
            rs = st.executeQuery("SELECT * FROM user");

            // 5.处理结果

            while (rs.next()) {
                System.out.println(rs.getObject(1) + "\t"//获取第一列
                        + rs.getObject(2) + "\t"//获取第二列
                        + rs.getObject(3) + "\t"//获取第3列
                );
            }

        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }

            } finally {
                try {
                    if (st != null) {
                        st.close();
                    }

                } finally {
                    if (conn != null) {
                        conn.close();
                    }

                }
            }
        }

    }


}
