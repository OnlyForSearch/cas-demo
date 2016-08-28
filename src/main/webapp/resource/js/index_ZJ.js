//入口
jQuery(function($) {
    $(document).ready( function() {
     	initData();
     	
     	//默认进入待办页
	 	(function(){
		    $("#eventMenuId").trigger('click');
		})();
		
		//$("#rightFloatId").css("top", $(document).scrollTop()+20 );
		
		$(function(){
			//$("#rightFloatId").floatdiv({right:"0",top:"50px"});//设置浮动层靠右距离为0，靠上距离80px
		});
    });
});

function initData() {
	initEvent();
	handlePlaceholder(searchQueryId);
}
//弹出层
function updPws(){
	PopUpLayer.showDiv('maskDivId','showPressDivId');
	getObj("showPressDivId").style.top = '100px';
	getObj("showPressDivId").style.left = '350px';

}