/* =========================================================================

NAME:���β˵��Ľӿ���

AUTHOR:����
DATE:2006-3-1

COMMENT: ���β˵��Ľӿ���,��������ι���ʱ����̳���Ӧ�Ľӿ���

============================================================================ */

//��ʼ��ʱXML����Ľӿ�
function XMLTree_onBeforeXMLTrans_Action()
{
    /**
     * ��������˵��:��XMLת��ǰ�����޸ĸ�XML�ĵ�����
     *
     * ����˵��: oDoc ��Ҫ�޸ĵ�XML�ĵ�����
     *
     * ����ֵ:������XML�ĵ�����
     **/
    this.pretreatment = function(oDoc)
    {}
}

//��̬����ʱȡ��һ�����ݵĽӿ�
function XMLTree_onDynamicLoad_Action()
{
    /**
     * ��������˵��:�û�ִ�ж�̬����ʱȡ��XML�ĵ�����
     *
     * ����˵��:oItem --- Ŀǰѡ�ж���Ľڵ�
     *
     * ����ֵ:��Ҫ��̬�����XML�����ڵĵ�ַ
     **/
     this.dynamicLoad = function(oItem)
     {}
}

function XMLTree_AfterDynamicLoad_Action()
{
    /**
     * ��������˵��:�û�ִ�ж�̬����ʱȡ��XML�ĵ�����
     *
     * ����˵��:oItem --- Ŀǰѡ�ж���Ľڵ�
     *
     * ����ֵ:��Ҫ��̬�����XML�����ڵĵ�ַ
     **/
     this.afterDynamicLoad = function()
     {}
}

//�û������¼�ʱ����Ľӿ�
function XMLTree_onClick_Action()
{
    /**
     * ��������˵��:�û������¼�ʱ����
     *
     * ����˵��: oItem --- Ŀǰѡ�нڵ�Ķ���
     *
     * ����ֵ: ��
     **/
     this.click = function(oItem)
    {}
}

//�û�˫���¼�ʱ����Ľӿ�
function XMLTree_onDblClick_Action()
{
    /**
     * ��������˵��:�û������¼�ʱ����
     *
     * ����˵��: oItem --- Ŀǰѡ�нڵ�Ķ���
     *
     * ����ֵ: ��
     **/
     this.dblclick = function(oItem)
    {}
}

//�û��޸�����ֵ�Ĵ���ӿ�
function XMLTree_onEditItem_Action()
{
    /**
     * ��������˵��:�û��޸���ѡ������ֵ֮��Ĵ������
     *
     * ����˵��:
     *       oItem --- Ŀǰѡ�нڵ�Ķ���
     *       value --- �޸ĺ��ֵ
     *
     * ����ֵ:true(�滻Ϊ�޸ĺ��ֵ),false(����ԭֵ����)
     **/
     this.edit = function(oItem,value)
    {}
}

function XMLTree_onDragStart_Action()
{
	/**
     * ��������˵��:�û���ק�ڵ㿪ʼʱ����
     *
     * ����˵��: ��ǰҪ�϶��Ľڵ�
     *
     * ����ֵ: ture������ק false��������ק
     **/
	this.isStartDrag = function(oItem)
	{}
}

function XMLTree_onDragEnd_Action()
{
	//��ȡ���ָ��λ������ڸ��ĵ��� x ��������
	this.iX;
	//��ȡ���ָ��λ������ڸ��ĵ��� y ��������
	this.iY;
	//��ȡ���ָ��λ������ڴ��ڿͻ������ x ���꣬���пͻ����򲻰�����������Ŀؼ��͹�����
	this.iClientX;
	//��ȡ���ָ��λ������ڴ��ڿͻ������ y ���꣬���пͻ����򲻰�����������Ŀؼ��͹�����
	this.iClientY;
	/**
     * ��������˵��:�û���ק�ڵ����ʱ����
     *
     * ����˵��: ��
     *
     * ����ֵ: �Ƿ�Ҫ�ƶ��ڵ�
     **/
	this.endDrag = function(oDragItem,oOverItem)
	{}
	
	/**
	 * 
	 */
	this.endMove = function(oDragParentItem,oDragItem,oOverItem)
	{}
}

function XMLTree_oncontextmenu_Action()
{
	/**
     * ��������˵��:�û��Ҽ������¼�
     *
     * ����˵��: ��
     *
     * ����ֵ: ��
     **/
     this.rightClick = function(oItem)
     {}
}

function XMLTree_onCheckBoxClick_Action()
{
	/**
     * ��������˵��:�û�checkBox�����¼�
     *
     * ����˵��: ��
     *
     * ����ֵ: ��
     **/
     this.check = function(oCheckBox,oItem)
     {}
}

function XMLTree_onLoad_Action()
{
	/**
     * ��������˵��:����������ִ��
     *
     * ����˵��: ��
     *
     * ����ֵ: ��
     **/
	this.load = function()
	{}
}