package cn.fengyu.frame.study.jdbc.springjdbc.po;

import java.io.Serializable;

/**
 * Created by fengyu on 2016-08-26.
 */
public class SpringUser implements Serializable {

    private Long id;
    private String name=null;
    private int age;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "SpringUser{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
