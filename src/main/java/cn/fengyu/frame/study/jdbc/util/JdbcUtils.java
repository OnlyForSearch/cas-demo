package cn.fengyu.frame.study.jdbc.util;

import java.net.URL;
import java.sql.*;

/**
 * ������
 */
public final class JdbcUtils {
    //2��������
    //        * ����URL�������������ݿ�ʱ��Э�顢��Э�顢����Դ��ʶ��
    //    ?��д��ʽ��Э�飺��Э�飺����Դ��ʶ
    //    Э�飺��JDBC��������jdbc��ʼ
    //    ��Э�飺�������ӵ���������������ݿ����ϵͳ���ơ�
    //    ����Դ��ʶ������ҵ����ݿ���Դ�ĵ�ַ�����Ӷ˿ڡ�
    //      useUnicode=true����ʾʹ��Unicode�ַ��������characterEncoding����Ϊ
    //   gb2312��GBK����������������Ϊtrue ��characterEncoding=gbk���ַ����뷽ʽ��
    //        *
        /*Ҫ�������ݿ⣬��Ҫ��java.sql.DriverManager���󲢻��Connection����   */
    // �ö���ʹ���һ�����ݿ�����ӡ�
    private static String url = "jdbc:mysql://localhost:3306/jdbc";
    private static String user = "root";
    private static String password = "root";




    private JdbcUtils() {//������ʵ����

    }



    static{
        try {
             /*
      * ����JDBC��������
    ���������ݿ�֮ǰ������Ҫ������Ҫ���ӵ����ݿ��������JVM��Java���������
    ��ͨ��java.lang.Class��ľ�̬����forName(String  className)ʵ�֡�
    ���磺
      * */
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
        //        7���ر�JDBC����
        //        ��������Ժ�Ҫ������ʹ�õ�JDBC����ȫ���رգ����ͷ�JDBC��Դ���ر�˳�����
        //        ��˳���෴��
        //        1���رռ�¼��
        //        2���ر�����
        //        3���ر����Ӷ���
        try {
            if (rs != null)// �رռ�¼��
                rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (st != null)// �ر�����
                    st.close();
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                if (conn != null) // �ر����Ӷ���
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
