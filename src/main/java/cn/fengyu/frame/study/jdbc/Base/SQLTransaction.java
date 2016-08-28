package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;
import org.junit.Test;

import java.sql.*;

/**�����ݿ�����

 ����̸�����ݿ⿪����������һ�����ɻرܵĻ��⣬JDBCĬ������£���ÿһ�����Զ��ύ�ģ����ǿ���ͨ������connection.setAutoCommit(false)�ķ�ʽ��ǿ�ƹر��Զ��ύ��Ȼ��ͨ��connection.commit()��connection.rollback()��ʵ�������ύ�ͻع���
 * Created by fengyu on 2016-08-25.
 */
public class SQLTransaction {

    /**
     *
     * ���򵥵����ݿ�����

     ����������һ���򵥵����ݿ������ʾ����
     ��һ�ε���ʱ�������ɹ��������ύ��
     ��user���в�����һ����¼���ڶ��ε���ʱ������������ͻ�쳣������ع���
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


    //����SavePoint������ʾ��

    /**
     * �������Կ����������񱨳���������ͻ�쳣������ع���������Ȼ�����ݿ��в�����IDΪ13��14�ļ�¼��

     �������⣬��ȷ��SavePoint��IDΪ15�ļ�¼��û�б����룬����ͨ����������˻ع���
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
            //ȡ���Զ��ύ
            conn.setAutoCommit(false);
            st.executeUpdate("insert into user(id,name) values(13, 'Xiao Li')");
            st.executeUpdate("insert into user(id,name) values(14, 'Xiao Wang')");
            svpt = conn.setSavepoint("roll back to here");
            st.executeUpdate("insert into user(id,name) values(15, 'Xiao Zhao')");
            st.executeUpdate("insert into user(id,name) values(13, 'Xiao Li')");
            //�ύ�������Զ��ύ
            conn.commit();
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
            //�����쳣��ع�����
            conn.rollback(svpt);
        }
        finally
        {
            /** �������Ҫ������Ϊ����ûִ�е����쳣
             *
                     */
            //��Ȼ�������Զ��ύ
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
