package cn.fengyu.frame.study.jdbc.util;

import java.net.URL;
import java.sql.*;

/**
 * 工具类
 */
public final class JdbcUtils {
    private static String url = "jdbc:mysql://localhost:3306/jdbc";
    private static String user = "root";
    private static String password = "root";




    private JdbcUtils() {//不允许实例化

    }



    static{
        try {
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
        try {
            if (rs != null)
                rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (st != null)
                    st.close();
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                if (conn != null)
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
