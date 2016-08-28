package cn.fengyu.frame.study.jdbc.Base.service;

import cn.fengyu.frame.study.jdbc.Base.dao.DaoException;
import cn.fengyu.frame.study.jdbc.Base.dao.UserDao;
import cn.fengyu.frame.study.jdbc.Base.domain.User;

/**
 * Created by fengyu on 2016-08-25.
 */
public class UserService {
    private UserDao userDao;

    public void regist(User user) throws DaoException {
        this.userDao.addUser(user);
    }



}
