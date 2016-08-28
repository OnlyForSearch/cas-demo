package cn.fengyu.frame.study.jdbc.springjdbc.product.test;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import cn.fengyu.frame.study.jdbc.springjdbc.product.dao.ProductDao;
import cn.fengyu.frame.study.jdbc.springjdbc.product.domain.Product;
import cn.fengyu.frame.study.jdbc.springjdbc.product.util.QueryResult;
import cn.fengyu.frame.study.jdbc.springjdbc.product.util.ToolUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
/**.测试Dao
 * Created by fengyu on 2016-08-26.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "/product/product-beans.xml" })
public class BaseDaoTest {

    @Autowired
    private ProductDao dao;

    @Test
    public void testSave() throws Exception {
        Product product = new Product();
        product.setId(ToolUtil.getUUID());
        product.setName("aaa");
        product.setAuthor("bbb");
        product.setPrice(111);
        product.setQuantity(9);
        product.setDescription("ccc");
        dao.save(product);
    }

    @Test
    public void testUpdate() throws Exception {
        Product product = new Product();
        product.setId("4d6db57db2f44b0fab73f5d1433fde2a");
        product.setName("a");
        product.setAuthor("b");
        product.setPrice(444);
        product.setQuantity(44);
        product.setDescription("c");
        dao.update(product);
    }

    @Test
    public void testDelete1() {
        Product product = new Product();
        product.setId("4d6db57db2f44b0fab73f5d1433fde2a");
        dao.delete(product);
    }

    @Test
    public void testDelete2() {
        dao.delete("4d6db57db2f44b0fab73f5d1433fde2a");
    }

    @Test
    public void testDeleteAll() {
        dao.deleteAll();
    }

    // 插入一些测试数据
    @Test
    public void insertTestData() {
        for (int i = 1; i <= 100; i++) {
            Product product = new Product();
            product.setId(ToolUtil.getUUID());
            product.setName("springJdbc" + i);
            product.setAuthor("monday" + i);
            product.setPrice((double) Math.random() * 100);
            product.setQuantity((int) (Math.random() * 100));
            product.setDescription("介绍SpringJdbc" + i);
            dao.save(product);
        }
    }

    // 未完成
    @Test
    public void testBatchSave() {
    }

    // 未完成
    @Test
    public void testBatchUpdate() {
    }

    // 未完成
    @Test
    public void testBatchDelete() {
    }

    @Test
    public void testFindById() {
        System.out.println(dao.findById("0bc2e990c80245019fea47beb28961e9"));
    }

    @Test
    public void testFindAll() {
        System.out.println(dao.findAll());
    }

    // 分页
    @Test
    public void testFindByPage1() {
        int pageNo = 1;
        int pageSize = 10;
        QueryResult<Product> queryResult = dao.findByPage(pageNo, pageSize);
        for (Product p : queryResult.getList()) {
            System.out.println(p.getAuthor());
        }
    }

    // 分页+条件
    @Test
    public void testFindByPage2() {
        int pageNo = 1;
        int pageSize = 10;
        Map<String, String> where = new HashMap<String, String>();
        where.put("author", "like '%monday1%'");
        where.put("price", "<90");
        QueryResult<Product> queryResult = dao.findByPage(pageNo, pageSize, where);
        for (Product p : queryResult.getList()) {
            System.out.println(p.getAuthor());
        }
    }

    // 分页+排序
    @Test
    public void testFindByPage3() {
        int pageNo = 1;
        int pageSize = 10;
        LinkedHashMap<String, String> orderby = new LinkedHashMap<String, String>();
        orderby.put("price", "desc");
        orderby.put("author", "asc");
        QueryResult<Product> queryResult = dao.findByPage(pageNo, pageSize, orderby);
        for (Product p : queryResult.getList()) {
            System.out.println(p.getAuthor());
        }
    }

    // 分页+条件+排序
    @Test
    public void testFindByPage4() {
        int pageNo = 1;
        int pageSize = 10;
        Map<String, String> where = new HashMap<String, String>();
        where.put("author", "like '%monday1%'");
        where.put("price", "<90");
        LinkedHashMap<String, String> orderby = new LinkedHashMap<String, String>();
        orderby.put("price", "desc");
        orderby.put("author", "asc");
        QueryResult<Product> queryResult = dao.findByPage(pageNo, pageSize, where, orderby);
        for (Product p : queryResult.getList()) {
            System.out.println(p.getAuthor());
        }
    }
}
