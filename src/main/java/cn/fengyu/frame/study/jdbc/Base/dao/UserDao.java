package cn.fengyu.frame.study.jdbc.Base.dao;

import cn.fengyu.frame.study.jdbc.Base.domain.User;

/**
 * Created by fengyu on 2016-08-25.
 */
public interface  UserDao {

    void addUser(User user) ;

    User getUser(int userId);

    User findUser(String loginName, String password);

     void update(User user);

    void delete(User user);
}
