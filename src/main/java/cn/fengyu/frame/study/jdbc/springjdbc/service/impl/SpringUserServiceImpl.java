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
/**我们只需要在类上加上注解@Transactional，就可以指定这个类需要受Spring的事务管理。默认Spring为每个方法开启一个事务，如果方法发生运行期异常(RuntimeException)，事务会进行回滚；如果发生一般的异常（Exception），事务不进行回滚。
 * ，后台输出异常:java.lang.Exception ，查看数据库发现第一条数据插入，而第二条数据没有插入，说明事务没有进行了回滚。
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

    /**第一个测试方法，后台输出异常:java.lang.RuntimeException，查看数据库发现数据没有插入，说明事务进行了回滚
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
//当发生RuntimeException时，可以不让它进行事务回滚 ，只需要加上一个@Transactional(noRollbackFor=RuntimeException.class)
    @Transactional(propagation= Propagation.NOT_SUPPORTED,readOnly=true)//一种是使用Annotation注解的方式(官方推荐)
    public void findUsers() {

        List<SpringUser> query = springUserDao.query("select * from springuser where age>?", new Object[]{17});

        for (SpringUser springUser : query) {
            System.out.println("springUser = " + springUser);
        }

    }
}
