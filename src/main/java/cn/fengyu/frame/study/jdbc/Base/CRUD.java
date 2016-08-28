package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;
import org.junit.Test;

import java.sql.*;

/**
 * Created by fengyu on 2016-08-24.
 */
public class CRUD {

    /**
     * ��������������
     */
    @Test
    public void testCreateTable() {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            conn = JdbcUtils.getConnection();
            st = conn.createStatement();
            //ִ�в�ѯ��䣬����Ҳ������execute()������ִ���κ�SQL���
            st.execute("CREATE TABLE foo(ID INT NOT NULL, NAME VARCHAR(30))");//������
            st.executeUpdate("INSERT INTO foo(ID,NAME) VALUES(1, 'Zhang San')");//�������
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
     * �������� C
     */
    @Test
    public void testCreate() throws SQLException {


        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            //2��������

            conn = JdbcUtils.getConnection();

            //3�������
            // 3.�������
            st = conn.createStatement();

            // 4.ִ�����
            String sql = "INSERT INTO  user (name,birthday,money) VALUES ('name2','2016-08-24','333')";
            int i = st.executeUpdate(sql);//����һ������,˵�������˶���������
            System.out.println("i = " + i);


        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }

    /**
     * ��ȡ���� R
     */
    @Test
    public void testRead() throws SQLException {

        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            //2��������

            conn = JdbcUtils.getConnection();

            //3�������
            // 3.�������
            st = conn.createStatement();

            // 4.ִ�����
            rs = st.executeQuery("SELECT id,name,money,birthday FROM user");//���鰴���������в���,��ֹ����

            // 5.������

            while (rs.next()) {
                System.out.println(rs.getObject("id") + "\t"//��ȡ��һ��
                        + rs.getObject("name") + "\t"//��ȡ�ڶ���
                        + rs.getObject("money") + "\t"//��ȡ��3��
                        + rs.getObject("birthday") + "\t"//��ȡ��4��
                );
            }

        } finally {
            JdbcUtils.free(rs, st, conn);

        }

    }

    /**
     * �޸�
     */

    @Test
    public void testUpdate() throws SQLException {


        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            //2��������

            conn = JdbcUtils.getConnection();

            // 3.�������
            st = conn.createStatement();

            // 4.ִ�����
            String sql = "UPDATE user SET money=money+200";
            int i = st.executeUpdate(sql);//����һ������,˵�������˶���������
            System.out.println("�޸�Ӱ��:i = " + i);


        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }

    /**
     * ɾ��
     */

    @Test
    public void testDelete() throws SQLException {


        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            //2��������

            conn = JdbcUtils.getConnection();

            //3�������
            // 3.�������
            st = conn.createStatement();

            // 4.ִ�����
            String sql = "DELETE FROM user WHERE id>=3";
            int i = st.executeUpdate(sql);//����һ������,˵�������˶���������
            System.out.println("i = " + i);


        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }

    /**
     * ���ǿ���ʹ��CallableStatement�����ô洢���̣�
     * �洢�����������ݿ⿪��ʱ����ʹ�õļ�����������ͨ����ʡ����ʱ��ķ�ʽ������ϵͳ���ܣ����������ʾ��ʹ��MySQL���ݿ⡣
     ������ε��ò��������Ĵ洢����
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
     * ���ǿ���ʹ��CallableStatement�����ô洢���̣�
      ��MySQL�Ĵ洢�����еĲ�����Ϊ���֣�in/out/inout�����ǿ��԰�in��������������out��������������JDBC�����������͵Ĳ������÷�ʽ��ͬ��
  ����1��in�� JDBCʹ��������cst.set(1, 10)�ķ�ʽ������
  ����2��out��JDBCʹ��������cst.registerOutParameter(2, Types.VARCHAR);�ķ�ʽ������
  ������������һ��in������ʾ������������ϣ������IDΪ�ض�ֵ��user��Ϣ���洢�������£�
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
