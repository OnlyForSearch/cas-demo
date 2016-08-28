package cn.fengyu.frame.study.jdbc.springjdbc.product.domain;

/**
 *
 * --创建商品表
 create table product(
 id      varchar2(255)   primary key,
 name        varchar2(255),
 author          varchar2(255),
 price       number(6,2),
 quantity    number,
 description varchar2(255)
 );
 * Created by fengyu on 2016-08-26.
 */
public class Product {

    private String id;
    private String name;
    private String author;
    private double price;
    private int quantity;
    private String description;

    public Product() {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Product{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", author='" + author + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", description='" + description + '\'' +
                '}';
    }
}
