package cn.fengyu.frame.study.jdbc.Base.dao.impl;

import cn.fengyu.frame.study.jdbc.Base.dao.DaoException;
import cn.fengyu.frame.study.jdbc.Base.dao.UserDao;
import cn.fengyu.frame.study.jdbc.Base.domain.User;
import cn.fengyu.frame.study.jdbc.util.JdbcUtils;

import java.sql.*;

/**
 * Created by fengyu on 2016-08-25.
 */
public class UserDaoJdbcImpl implements UserDao{
    public void addUser(User user) throws DaoException {
        Connection conn=null;
        PreparedStatement ps=null;
        ResultSet rs=null;

        try {
            conn = JdbcUtils.getConnection();
            String sql = "insert into user(name,birthday, money) values (?,?,?)";
            ps= conn.prepareStatement(sql);
            ps.setString(1,user.getName());
            ps.setDate(2,new java.sql.Date(user.getBirthday().getTime()));
            ps.setFloat(3,user.getMoney());
            ps.executeUpdate();


        } catch (SQLException e) {
            //
            //e.printStackTrace();//这样异常会被隐藏,业务层无法知道,业务逻辑层无法处理
            throw new DaoException(e.getMessage(), e);
        }finally{
            JdbcUtils.free(rs,ps,conn);
        }


    }

    public User getUser(int userId) throws DaoException {
        Connection conn=null;
        PreparedStatement ps=null;
        ResultSet rs=null;
        User user=null;
        try {
            conn=JdbcUtils.getConnection();	String sql = "select id, name, money, birthday  from user where id=?";

            ps=conn.prepareStatement(sql);
            ps.setInt(1,userId);
            rs=ps.executeQuery();
            while (rs.next()) {
                user = mappingUser(rs);
            }


        } catch (Exception e) {
            throw new DaoException(e.getMessage(), e);
        }finally {
            JdbcUtils.free(rs,ps,conn);
        }


        return user;
    }

    private User mappingUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setBirthday(rs.getDate("birthday"));
        user.setId(rs.getInt("id"));
        user.setName(rs.getString("name"));
        user.setMoney(rs.getFloat("money"));
        return user;
    }

    public User findUser(String loginName, String password) throws DaoException {
            Connection conn=null;
            PreparedStatement ps=null;
            ResultSet rs=null;
        User user=null;
        try {
            conn = JdbcUtils.getConnection();
            String sql = "select id, name, money, birthday  from user where name=?";
            ps=conn.prepareStatement(sql);
            ps.setString(1, loginName);
            rs = ps.executeQuery();
            while (rs.next()) {
                user = mappingUser(rs);
            }

        } catch (Exception e) {

            throw new DaoException(e.getMessage(), e);
        }finally {
            JdbcUtils.free(rs,ps,conn);
        }
        return user;


    }

    public void update(User user) throws DaoException {
        Connection conn=null;
        PreparedStatement ps=null;
        ResultSet rs=null;
        try {
            conn=JdbcUtils.getConnection();
            String sql = "update user set name=?, birthday=?, money=? where id=? ";
            ps=conn.prepareStatement(sql);
            ps.setString(1,user.getName());
            ps.setDate(2,new java.sql.Date(user.getBirthday().getTime()));
            ps.setFloat(3,user.getMoney());
            ps.executeUpdate();
        } catch (Exception e) {
            throw new DaoException(e.getMessage(), e);
        }finally{
            JdbcUtils.free(rs,ps,conn);
        }



    }

    public void delete(User user) throws DaoException {

        Connection conn=null;
        Statement st=null;
        ResultSet rs=null;

        try {
            conn = JdbcUtils.getConnection();
            st = conn.createStatement();
            String sql = "delete from user where id=" + user.getId();

            st.executeUpdate(sql);


        } catch (Exception e) {
            throw new DaoException(e.getMessage(), e);
        } finally{
            JdbcUtils.free(rs,st,conn);
        }


    }
}
