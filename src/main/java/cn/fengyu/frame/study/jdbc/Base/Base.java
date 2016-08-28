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
     * �������jdbc��ʾ
     *
     * @throws SQLException
     */
    @Test//��ʾ
    public void test() throws SQLException, ClassNotFoundException {
        // 1.ע������(3�ַ�ʽ)
        DriverManager.registerDriver(new com.mysql.jdbc.Driver());
        System.setProperty("jdbc.drivers", "com.mysql.jdbc.Driver");

      /*
      * ����JDBC��������
    ���������ݿ�֮ǰ������Ҫ������Ҫ���ӵ����ݿ��������JVM��Java���������
    ��ͨ��java.lang.Class��ľ�̬����forName(String  className)ʵ�֡�
    ���磺
      * */
        Class.forName("com.mysql.jdbc.Driver");// �Ƽ���ʽ

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
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc", "root", "root");


        //3�������
        //        Ҫִ��SQL��䣬������java.sql.Statementʵ����Statementʵ����Ϊ����3
        //        �����ͣ�
        //        1��ִ�о�̬SQL��䡣ͨ��ͨ��Statementʵ��ʵ�֡�    Statement stmt = con.createStatement() ;
        //        2��ִ�ж�̬SQL��䡣ͨ��ͨ��PreparedStatementʵ��ʵ�֡�PreparedStatement pstmt = con.prepareStatement(sql) ;
        //        3��ִ�����ݿ�洢���̡�ͨ��ͨ��CallableStatementʵ��ʵ�֡�CallableStatement cstmt =      con.prepareCall("{CALL demoSp(? , ?)}") ;

        // 3.�������
        Statement st = conn.createStatement();

        // 4.ִ�����
        //        ִ��SQL���
        //        Statement�ӿ��ṩ������ִ��SQL���ķ�����executeQuery ��executeUpdate
        //                ��execute
        //        1��ResultSet executeQuery(String sqlString)��ִ�в�ѯ���ݿ��SQL���
        //        ������һ���������ResultSet������ ResultSet rs = stmt.executeQuery("SELECT * FROM ...") ;

        //        2��int executeUpdate(String sqlString)������ִ��INSERT��UPDATE��
        //        DELETE����Լ�SQL DDL��䣬�磺CREATE TABLE��DROP TABLE�� int rows = stmt.executeUpdate("INSERT INTO ...") ;

        //        3��execute(sqlString):����ִ�з��ض���������������¼����������ϵ�
        //        ��䡣boolean flag = stmt.execute(String sql)
        //        ����ʵ�ֵĴ��룺

        ResultSet rs = st.executeQuery("SELECT * FROM user");

        // 5.������
        //        1��ִ�и��·��ص��Ǳ��β���Ӱ�쵽�ļ�¼����
        //        2��ִ�в�ѯ���صĽ����һ��ResultSet����
        // ResultSet��������SQL����������������У�������ͨ��һ��get�����ṩ�˶���Щ
        //        �������ݵķ��ʡ�
        //ʹ�ý������ResultSet������ķ��ʷ�����ȡ���ݣ�
        while (rs.next()) {
//

        //String name = rs.getString("name") ;
        //String pass = rs.getString(1) ; // �˷����Ƚϸ�Ч
            System.out.println(rs.getObject(1) + "\t"//��ȡ��һ��
                    + rs.getObject(2) + "\t"//��ȡ�ڶ���
                    + rs.getObject(3) + "\t"//��ȡ��3��
            );
        }


        //        7���ر�JDBC����
        //        ��������Ժ�Ҫ������ʹ�õ�JDBC����ȫ���رգ����ͷ�JDBC��Դ���ر�˳�����
        //        ��˳���෴��
        //        1���رռ�¼��
        //        2���ر�����
        //        3���ر����Ӷ���
        // 6.�ͷ���Դ
        rs.close();//  // �رռ�¼��
        st.close();//// �ر�����
        conn.close();// // �ر����Ӷ���


    }


    @Test
    public void test2() throws SQLException, ClassNotFoundException {
        // 1.ע������(3�ַ�ʽ)
        DriverManager.registerDriver(new com.mysql.jdbc.Driver());
        System.setProperty("jdbc.drivers", "com.mysql.jdbc.Driver");
        Class.forName("com.mysql.jdbc.Driver");// �Ƽ���ʽ

        //2��������
        String url = "jdbc:mysql://localhost:3306/jdbc";
        String user = "root";
        String password = "root";
        Connection conn = DriverManager.getConnection(url, user, password);


        //3�������
        // 3.�������
        Statement st = conn.createStatement();

        // 4.ִ�����
        ResultSet rs = st.executeQuery("SELECT * FROM user");

        // 5.������

        while (rs.next()) {
            System.out.println(rs.getObject(1) + "\t"//��ȡ��һ��
                    + rs.getObject(2) + "\t"//��ȡ�ڶ���
                    + rs.getObject(3) + "\t"//��ȡ��3��
            );
        }

        // 6.�ͷ���Դ
        rs.close();
        st.close();
        conn.close();


    }

    /**
     * ���� ͨ��ģ��ģ��
     *
     * @throws Exception
     */
    @Test
    public void testTemplate() throws Exception {


        //2��������
        String url = "jdbc:mysql://localhost:3306/jdbc";
        String user = "root";
        String password = "root";

        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            //2��������

            conn = DriverManager.getConnection(url, user, password);

            //3�������
            // 3.�������
            st = conn.createStatement();

            // 4.ִ�����
            rs = st.executeQuery("SELECT * FROM user");

            // 5.������

            while (rs.next()) {
                System.out.println(rs.getObject(1) + "\t"//��ȡ��һ��
                        + rs.getObject(2) + "\t"//��ȡ�ڶ���
                        + rs.getObject(3) + "\t"//��ȡ��3��
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
