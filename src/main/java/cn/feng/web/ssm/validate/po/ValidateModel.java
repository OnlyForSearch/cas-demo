package cn.feng.web.ssm.validate.po;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.Range;

/**
 * （6） 之 数据验证
 * 
 * @author Administrator
 * 
 */
public class ValidateModel {

	@NotEmpty(message = "{name.not.empty}")
	private String name;
	@Range(min = 0, max = 150, message = "{age.not.inrange}")
	private String age;
	// name.not.empty等分别对应了ValidateModel.java文件中message=”xxx”中的xxx名称，//
	// 后面的内容是在输入中文是自动转换的ASCII编码，当然你也可以直接把xxx写成提示内容，而不用另建一个，//
	// 当然你也可以直接把xxx写成提示内容，而不用另建一个validatemessages.properties文件再添加，//
	// 但这是不正确的做法，因为这样硬编码的话就没有办法进行国际化了。
	@NotEmpty(message = "{email.not.empty}")
	@Email(message = "{email.not.correct}")
	private String email;

	public void setName(String name) {
		this.name = name;
	}

	public void setAge(String age) {
		this.age = age;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return this.name;
	}

	public String getAge() {
		return this.age;
	}

	public String getEmail() {
		return this.email;
	}

}
