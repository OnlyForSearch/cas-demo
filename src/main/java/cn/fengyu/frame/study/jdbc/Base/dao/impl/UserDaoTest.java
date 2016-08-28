package cn.fengyu.frame.study.jdbc.Base.dao.impl;

import cn.fengyu.frame.study.jdbc.Base.dao.UserDao;
import cn.fengyu.frame.study.jdbc.Base.dao.factory.DaoFactory;
import cn.fengyu.frame.study.jdbc.Base.domain.User;
import org.junit.Test;

import javax.enterprise.inject.New;
import java.io.InputStream;
import java.util.Date;

import static org.junit.Assert.*;

/**
 * Created by fengyu on 2016-08-25.
 */
public class UserDaoTest {

    private static UserDao userDao=new UserDaoJdbcImpl();
//    private static UserDao userDao= DaoFactory.getInstance().getUserDao();//通过工厂模式获取

    @Test
    public void addUser() throws Exception {

        User user = new User();
         user.setBirthday(new Date());
         user.setName("dao name1");
         user.setMoney(1000.0f);
        userDao.addUser(user);



    }

    @Test
    public void getUser() throws Exception {

        User user = userDao.getUser(2);
        System.out.println(user);

    }

    @Test
    public void findUser() throws Exception {
        User user = userDao.findUser("dao name1", null);
        System.out.println("user = " + user);
        //user = User{id=4, name='dao name1', birthday=2016-08-25, money=1000.0}
    }

    @Test
    public void update() throws Exception {
        User user = userDao.getUser(4);
        user.setMoney(user.getMoney()+2000f);
        userDao.update(user);

    }

    @Test
    public void delete() throws Exception {
        User user = userDao.getUser(7);
        userDao.delete(user);

    }


    @Test
    public void testClassLoad() {

        ClassLoader classLoader = DaoFactory.class.getClassLoader();
        System.out.println(classLoader);
        InputStream resourceAsStream = classLoader.getResourceAsStream("daoconfig.properties");
        System.out.println(resourceAsStream);
    }

}