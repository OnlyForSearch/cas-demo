//���
jQuery(function($) {
    $(document).ready( function() {
     	initData();
     	
     	//Ĭ�Ͻ������ҳ
	 	(function(){
		    $("#eventMenuId").trigger('click');
		})();
		
		//$("#rightFloatId").css("top", $(document).scrollTop()+20 );
		
		$(function(){
			//$("#rightFloatId").floatdiv({right:"0",top:"50px"});//���ø����㿿�Ҿ���Ϊ0�����Ͼ���80px
		});
    });
});

function initData() {
	initEvent();
	handlePlaceholder(searchQueryId);
}
//������
function updPws(){
	PopUpLayer.showDiv('maskDivId','showPressDivId');
	getObj("showPressDivId").style.top = '100px';
	getObj("showPressDivId").style.left = '350px';

}