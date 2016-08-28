package cn.fengyu.frame.study.jdbc.util;

import java.net.URL;
import java.sql.*;

/**
 * 工具类
 */
public final class JdbcUtils {
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
    private static String url = "jdbc:mysql://localhost:3306/jdbc";
    private static String user = "root";
    private static String password = "root";




    private JdbcUtils() {//不允许实例化

    }



    static{
        try {
             /*
      * 加载JDBC驱动程序：
    在连接数据库之前，首先要加载想要连接的数据库的驱动到JVM（Java虚拟机），
    这通过java.lang.Class类的静态方法forName(String  className)实现。
    例如：
      * */
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError(e);//需要告知不能隐藏
        }
    }

    /**
     * 获取jdbc Connection
     * @return
     * @throws SQLException
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url,user,password);
    }

    public static void free(ResultSet rs, Statement st, Connection conn) {
        //        7、关闭JDBC对象
        //        操作完成以后要把所有使用的JDBC对象全都关闭，以释放JDBC资源，关闭顺序和声
        //        明顺序相反：
        //        1、关闭记录集
        //        2、关闭声明
        //        3、关闭连接对象
        try {
            if (rs != null)// 关闭记录集
                rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (st != null)// 关闭声明
                    st.close();
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                if (conn != null) // 关闭连接对象
                    try {
                        conn.close();
                        // myDataSource.free(conn);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
            }
        }
    }




}
