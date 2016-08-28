package cn.fengyu.frame.study.jdbc.springjdbc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

/**实现前面的注释配置的效果：
 * 以MySQL数据库为例，开始简单的数据源配置：
 * Created by fengyu on 2016-08-26.
 */
@Configuration
@ComponentScan("cn.fengyu.frame.study.jdbc.springjdbc")
public class SpringJdbcConfig {

    @Bean
    public DataSource mysqlDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/jdbc");
        dataSource.setUsername("root");
        dataSource.setPassword("root");


        return dataSource;
    }

}


