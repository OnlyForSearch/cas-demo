package cn.feng.web.ssm.items.mapper;

import cn.feng.web.ssm.items.po.ItemsCustom;
import cn.feng.web.ssm.items.po.ItemsVo;

import java.util.List;

public interface ItemsMapper {

  public  List<ItemsCustom> findItemsList(ItemsVo itemsVo)throws Exception;


}