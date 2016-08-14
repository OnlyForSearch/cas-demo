package cn.feng.web.ssm.user.service;

import cn.feng.web.ssm.user.po.User;

public interface UserService {

	 User getUserById(Integer id) throws Exception;
}
