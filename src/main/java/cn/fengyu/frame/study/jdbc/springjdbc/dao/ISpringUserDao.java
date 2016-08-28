package cn.fengyu.frame.study.jdbc.springjdbc.dao;

import cn.fengyu.frame.study.jdbc.springjdbc.po.SpringUser;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import java.util.List;

/**
 * Created by fengyu on 2016-08-26.
 */
public interface ISpringUserDao {
    public void save(SpringUser user);
    public List<SpringUser> query(String sql, Object[] args);

    JdbcTemplate getSpringJdbcTemplate();

    NamedParameterJdbcTemplate getSpringNameJdbcTemplate();
}
