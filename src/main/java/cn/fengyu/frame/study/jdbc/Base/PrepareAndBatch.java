package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;

import org.junit.Test;

import java.sql.*;

/**
 * ��Ԥ�����Լ�������
 * <p>
 * ����Ԥ���������������������ϵͳ���ܵķ�ʽ��һ�����������ݿ�Ļ�����ƣ�һ�����������ݿ�һ��ִ�ж������ķ�ʽ��
 * ����Ԥ����
 * <p>
 * �������ݿ���������յ�Statement��һ������Statement�������Ƿ����﷨���󡢶������ŵ�ִ�мƻ���������̿��ܻή��ϵͳ�����ܡ�һ������ݿ������������������������˻�����ƣ������ݿ���յ�ָ��ʱ������������Ѿ����ڣ���ô�Ͳ��ٽ���������ֱ�����С�
 * <p>
 * ����������ͬ��ָ����ָsql�����ȫһ����������Сд��
 * Created by fengyu on 2016-08-25.
 */
public class PrepareAndBatch {

    /**
     * JDBCʹ��PreparedStatement�����Ԥ����
     */
    @Test
    public void testPrepare() {

        Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;

        try {
            conn = JdbcUtils.getConnection();
            ////ʹ�ã��������
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
     * ������
     * <p>
     * �������������������ݿ�һ��ִ�ж������Ļ������������ܣ��������Ա����ν������Ӵ�����������ʧ��
     * <p>
     * ����������ʹ��Statement��addBatch�����ָ�ʹ��executeBatch������һ��ִ�ж���ָ�
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
     * ��Ԥ���������������

     �������ǿ��԰�Ԥ��������������������������ݿ�Ļ�����ƣ�һ��ִ�ж�����䣺
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
