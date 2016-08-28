package cn.fengyu.frame.study.jdbc.springjdbc.service;

/**
 * Created by fengyu on 2016-08-26.
 */
public interface ISpringUserService {
    void saveUser();
    void saveUserThrowException() throws Exception;
    void saveUserThrowRuntimeException() throws RuntimeException;
    void findUsers();

}
