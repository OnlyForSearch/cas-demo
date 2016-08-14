package cn.feng.web.ssm.items.service.impl;

import cn.feng.web.ssm.items.mapper.ItemsMapper;
import cn.feng.web.ssm.items.po.ItemsCustom;
import cn.feng.web.ssm.items.po.ItemsVo;
import cn.feng.web.ssm.items.service.ItemsService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
@Service("itemsService")
public class ItemsServiceImpl implements ItemsService {

	@Resource
	private ItemsMapper itemsMapper;

	public List<ItemsCustom> findItemsList(ItemsVo itemsVo) throws Exception {
		List<ItemsCustom> list = itemsMapper.findItemsList(itemsVo);
		return list;
	}

}
