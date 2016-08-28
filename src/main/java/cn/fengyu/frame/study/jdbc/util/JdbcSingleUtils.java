package cn.fengyu.frame.study.jdbc.util;

import java.sql.*;

/**
 * �����൥��ģʽ
 */
public final class JdbcSingleUtils {
    private static String url = "jdbc:mysql://localhost:3306/jdbc";
    private static String user = "root";
    private static String password = "root";


    private JdbcSingleUtils jdbcSingleUtils = new JdbcSingleUtils();

    private JdbcSingleUtils() {//������ʵ����

    }

    public JdbcSingleUtils getInstance() {
        if (jdbcSingleUtils == null) {
            synchronized (JdbcSingleUtils.class) {
                if (jdbcSingleUtils==null)//��ֹ���߳�,ͬʱ��������ʵ��
                    jdbcSingleUtils = new JdbcSingleUtils();
            }
        }

        return jdbcSingleUtils;
    }



    static{
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError(e);//��Ҫ��֪��������
        }
    }

    /**
     * ��ȡjdbc Connection
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
