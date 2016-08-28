package cn.fengyu.frame.study.jdbc.springjdbc.service.impl;

import cn.fengyu.frame.study.jdbc.springjdbc.dao.ISpringUserDao;
import cn.fengyu.frame.study.jdbc.springjdbc.po.SpringUser;
import cn.fengyu.frame.study.jdbc.springjdbc.service.ISpringUserService;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by fengyu on 2016-08-26.
 */

@Transactional
public class SpringUserServiceImpl implements ISpringUserService {

    private ISpringUserDao springUserDao;

    public ISpringUserDao getSpringUserDao() {
        return springUserDao;
    }

    public void setSpringUserDao(ISpringUserDao springUserDao) {
        this.springUserDao = springUserDao;
    }

    public void saveUser() {
        SpringUser springUser = new SpringUser();
        springUser.setName("springjdbc");
        springUser.setAge(26);
        springUserDao.save(springUser);


        SpringUser springUser2 = new SpringUser();
        springUser2.setName("springjdbc2");
        springUser2.setAge(22);
        springUserDao.save(springUser2);

    }
/**����ֻ��Ҫ�����ϼ���ע��@Transactional���Ϳ���ָ���������Ҫ��Spring���������Ĭ��SpringΪÿ����������һ������������������������쳣(RuntimeException)���������лع����������һ����쳣��Exception�������񲻽��лع���
 * ����̨����쳣:java.lang.Exception ���鿴���ݿⷢ�ֵ�һ�����ݲ��룬���ڶ�������û�в��룬˵������û�н����˻ع���
 * */
    public void saveUserThrowException() throws Exception {
        SpringUser springUser = new SpringUser();
        springUser.setName("springjdbc saveUserThrowException");
        springUser.setAge(26);
        springUserDao.save(springUser);
        if (2 > 1) {
            throw new RuntimeException(" Exception");
        }

        SpringUser springUser2 = new SpringUser();
        springUser2.setName("springjdbc saveUserThrowException");
        springUser2.setAge(22);
        springUserDao.save(springUser2);

    }

    /**��һ�����Է�������̨����쳣:java.lang.RuntimeException���鿴���ݿⷢ������û�в��룬˵����������˻ع�
     * */
    public void saveUserThrowRuntimeException()  {
        SpringUser springUser = new SpringUser();
        springUser.setName("springjdbc saveUserThrowRuntimeException");
        springUser.setAge(26);
        springUserDao.save(springUser);
        if (2 > 1) {
            throw new RuntimeException("Runtime Exception");
        }

        SpringUser springUser2 = new SpringUser();
        springUser2.setName("springjdbc saveUserThrowRuntimeException");
        springUser2.setAge(22);
        springUserDao.save(springUser2);

    }
//������RuntimeExceptionʱ�����Բ�������������ع� ��ֻ��Ҫ����һ��@Transactional(noRollbackFor=RuntimeException.class)
    @Transactional(propagation= Propagation.NOT_SUPPORTED,readOnly=true)//һ����ʹ��Annotationע��ķ�ʽ(�ٷ��Ƽ�)
    public void findUsers() {

        List<SpringUser> query = springUserDao.query("select * from springuser where age>?", new Object[]{17});

        for (SpringUser springUser : query) {
            System.out.println("springUser = " + springUser);
        }

    }
}
