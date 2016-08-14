package cn.feng.web.ssm.items.service;

import cn.feng.web.ssm.items.po.ItemsCustom;
import cn.feng.web.ssm.items.po.ItemsVo;

import java.util.List;

public interface ItemsService {
	public List<ItemsCustom> findItemsList(ItemsVo itemsVo) throws Exception;

}
