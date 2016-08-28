package cn.fengyu.frame.study.jdbc.springjdbc.product.base;

import cn.fengyu.frame.study.jdbc.springjdbc.product.util.QueryResult;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by fengyu on 2016-08-26.
 */
public interface BaseDao<T> {
    void save(T entity);

    void update(T entity);

    void delete(T entity);

    void delete(Serializable id);

    void deleteAll();

    void batchSave(List<T> list);

    void batchUpdate(List<T> list);

    void batchDelete(List<T> list);

    T findById(Serializable id);

    List<T> findAll();

    QueryResult<T> findByPage(int pageNo, int pageSize);

    QueryResult<T> findByPage(int pageNo, int pageSize, Map<String, String> where);

    QueryResult<T> findByPage(int pageNo, int pageSize, LinkedHashMap<String, String> orderby);

    QueryResult<T> findByPage(int pageNo, int pageSize, Map<String, String> where,
                              LinkedHashMap<String, String> orderby);
}
