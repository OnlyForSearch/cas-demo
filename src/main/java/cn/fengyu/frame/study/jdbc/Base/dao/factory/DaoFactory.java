package cn.fengyu.frame.study.jdbc.Base.dao.factory;

import cn.fengyu.frame.study.jdbc.Base.dao.UserDao;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * ¹¤³§
 * Created by fengyu on 2016-08-25.
 */
public class DaoFactory {


    private UserDao userDao=null;
    private static DaoFactory instance = new DaoFactory();

    private DaoFactory() {
        try {
        Properties properties = new Properties();
        InputStream inputStream =  DaoFactory.class.getClassLoader()
                .getResourceAsStream("daoconfig.properties");
            properties.load(inputStream);
            String userDaoClass = properties.getProperty("userDaoClass");
            Class<?> clazz = Class.forName(userDaoClass);
            userDao= (UserDao) clazz.newInstance();

        } catch (Throwable e) {
            throw new ExceptionInInitializerError(e);
        }

    }



    public static DaoFactory getInstance() {
        return  instance;

    }

    public UserDao getUserDao() {
        return userDao;
    }


}
