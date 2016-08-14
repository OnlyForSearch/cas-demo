package cn.feng.web.ssm.user.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import cn.feng.web.ssm.user.mapper.UserMapper;
import cn.feng.web.ssm.user.po.User;
import cn.feng.web.ssm.user.service.UserService;

@Service("userService")
public class UserServiceImpl implements UserService {

	@Resource
	private UserMapper userMapper;

	
	public User getUserById(Integer id) throws Exception {
		return userMapper.selectByPrimaryKey(1);

	}

}
