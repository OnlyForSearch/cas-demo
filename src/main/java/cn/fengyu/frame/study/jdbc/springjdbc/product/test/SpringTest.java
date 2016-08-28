package cn.fengyu.frame.study.jdbc.springjdbc.product.test;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.sql.DataSource;
import java.sql.SQLException;

/**
 * ����Spring������Դ
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"/product/product-beans.xml"})
public class SpringTest {

    // �����Ƿ�ȡ�����ݿ�����
    @Test
    public void testDataSource() throws SQLException {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("/product/product-beans.xml");
        DataSource dataSource = (DataSource) ctx.getBean("dataSource");
        System.out.println(dataSource.getConnection());
    }
}