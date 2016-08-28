/**
 * [����ͼ��ײ�ѡ����]
 * @author KingDomPan
 */
var ColorGet = (function() {
    var colors = ['#ff9460', '#aae46c', '#5b97cf', '#5dc0be', '#db8fd9',
        '#f2c545', '#fd7f82', '#55d5da', '#c1d749', '#6279db'
    ];
    var len = colors.length;

    return function(index) {
        return colors[index % len];
    };
})();

/**
 * [init����, �̳иú�������, ������ķ�����ȫ������]
 * @author KingDomPan
 */
function init() {
    for (var func in this) {
        if (typeof this[func] === 'function' && this.hasOwnProperty(func)) {
            this[func]();
        }
    }
}

/**
 * [���ݻ�ȡ��ʼ��]
 * @author KingDomPan
 */
function Get() {};

Get.prototype.init = init;

/**
 * [App Const]
 * @author KingDomPan
 */
var Const = {
    level3ItemNum: 3, // �����˵�Ĭ��չʾ����
    singleRowItemNum: 5 // ÿ��Ĭ��չʾ5��
};

/**
 * [�����򹤾���]
 * @author KingDomPan
 */
var SearchValueUtil = {
    $v : $('#searchInput'),
    getValue: function() {
        var value = this.getSearch().val();
        if (!value) {
            return '';
        }
        return value;
    },

    hasSearchValue: function() {
        return this.getValue() == '' ? false : true;
    },
    getSearch: function() {
        if (!this.ele) {
            this.ele = this.$v;
        }
        return this.ele;
    }

};

/**
 * [�ؼ���װ�λƵװ���]
 * @author KingDomPan
 */
String.prototype.wrapHighLight = function(searchValue) {
    if (!this) return '';
    if (!searchValue) return this.toString();
    var replace = '<span style="color: red; background-color: yellow;">' + searchValue + '</span>';
    return this.replace(searchValue, replace);
};

Get.prototype.dataUtil = {
    // ��һ���˵����(���й���ֵ��ʱ��ʹ��)
    onlyHasLevel1ItemByFilter: function($data) {
        var $notLevel1ServiceDirectory = $data.find('rowSet').filter(function() {
            return $(this).find('SLEVEL').text() != '1';
        });
        return $notLevel1ServiceDirectory.length == 0 ? true : false;
    }
};

Get.prototype.render = function(data) {

    var $data = $(data);
    var self = this;

    var $level1ServiceDirectory = $data.find('rowSet:has(PARENT_CATALOG_ID:empty)').filter(function() {
        return $(this).find('SLEVEL').text() == '1'; // ֻ����һ��Ŀ¼
    }); // ����һ�����Ŀ¼
	
    var fg = document.createDocumentFragment();
    //������ȡ��ѭ����
    var $containerTemplateModel = $('div.templtae .containerTemplate');
    var $rowTemplate4Level1TitleModel = $('div.templtae .rowTemplate4Level1Title');
    var $navMenuLiTemplateModel = $('div.templtae .navMenuLi');
    for (var i = 0; i < $level1ServiceDirectory.length; i++) {

    	var $level1Item = $level1ServiceDirectory.eq(i);
    	
        if (SearchValueUtil.hasSearchValue() && self.dataUtil.onlyHasLevel1ItemByFilter($data)) {
            // ֱ�ӷ���һ���˵�����, ����Ⱦ����
        	self.get920001510($level1Item.find('CATALOG_ID').text());
            continue;
        }

        // ��������Ԫ��
        var SHORT_DESCRIPTION = $level1Item.find('SHORT_DESCRIPTION').text();
        var CATALOG_ID = $level1Item.find('CATALOG_ID').text();
        var REMARK = $level1Item.find('REMARK').text();

        var $containerTemplate = $containerTemplateModel.clone();

        var $rowTemplate4Level1Title = $rowTemplate4Level1TitleModel.clone();
        $rowTemplate4Level1Title.find('.level1title').html(SHORT_DESCRIPTION.wrapHighLight(SearchValueUtil.getValue()));

        // ���һ��Ŀ¼������
        //$containerTemplate.append($rowTemplate4Level1Title);
        
        
        //���һ��Ŀ¼�˵���
        var $navMenuLiTemplate =$navMenuLiTemplateModel.clone();
        $navMenuLiTemplate.find('.game_hover').html(SHORT_DESCRIPTION);
        $navMenuLiTemplate.find('.hover_cont').attr({
            id: 'sysMenu_'+i
        }).css('left','-'+(55+(i+1)*90)+'px');
        $('#navMenuUl')[0].appendChild($navMenuLiTemplate[0]);
        
        

        // ���Ҷ������Ŀ¼
        var $level2ServiceDirectory = $data.find('rowSet').filter(function() {
            return $(this).find('PARENT_CATALOG_ID').text() == CATALOG_ID;
        });
        //������ȡ��ѭ����
        var $rowTemplate4Level2BlockModel = $('div.templtae .rowTemplate4Level2Block');
        var $level2directoryTemplateMOdel = $('div.templtae .level2directoryTemplate');
        for (var j = 0; j < $level2ServiceDirectory.length; j++) {
            var index = j % Const.singleRowItemNum;
            if (index == 0) {
                // ��������Ŀ¼��
                var $rowTemplate4Level2Block = $rowTemplate4Level2BlockModel.clone();
                $containerTemplate.append($rowTemplate4Level2Block);
            }
            var $level2Item = $level2ServiceDirectory.eq(j);
            var SHORT_DESCRIPTION_2 = $level2Item.find('SHORT_DESCRIPTION').text();
            var CATALOG_ID_2 = $level2Item.find('CATALOG_ID').text();
            var ICON_2 = $level2Item.find('ICON').text();
            var SERVER_URL_NAME = $level2Item.find('SERVER_URL_NAME').text().startWithAbsPath();
			var func = (function() {
				var url = SERVER_URL_NAME;
				return function() {
					url && window.open(url);
				};
			})();
            // ��������Ŀ¼��
            var $level2directoryTemplate = $level2directoryTemplateMOdel.clone();

            // ����$level2directoryTemplate��data����, ����Catalog_Id, ׼����ȡ�����˵�
            $level2directoryTemplate.data('CATALOG_ID_2', CATALOG_ID_2);
            $level2directoryTemplate.data('SHORT_DESCRIPTION_2', SHORT_DESCRIPTION_2);
            $level2directoryTemplate.data('REMARK_2', $level2Item.find('REMARK').text());
            $level2directoryTemplate.data('SHORT_DESCRIPTION', SHORT_DESCRIPTION);
            $level2directoryTemplate.data('REMARK', REMARK);

            $level2directoryTemplate.find('.level2titleText')
                .html(SHORT_DESCRIPTION_2.wrapHighLight(SearchValueUtil.getValue()))
                .bind('click', func);
            if(!SERVER_URL_NAME){
            	$level2directoryTemplate.find('.level2titleText').css("color","#343434");
            }
            $level2directoryTemplate.find('.level2png > img').attr({
                src: ICON_2,
                alt: SHORT_DESCRIPTION_2
            }).css('background-color', ColorGet(j));
            // ��λ����Ŀ¼��λ��
            var rowPosition = Math.floor(j / Const.singleRowItemNum); // �ö���Ŀ¼�����е�λ��
            var colPosition = index; // �ö���Ŀ¼�����е�λ��
            var $rowBlock = $containerTemplate.find('.rowTemplate4Level2Block').eq(rowPosition);
            var $colBlock = $rowBlock.find('.col-md-2point4.col-md-2point4-bg').eq(colPosition);

            // �ڶ���Ŀ¼������Ӷ���Ŀ¼��
            $colBlock.append($level2directoryTemplate);

        }
        // ��ӵ������ֽ���
        fg.appendChild($containerTemplate[0]);
        $('#sysMenu_'+i)[0].appendChild(fg);
    }
};

/**
 * [�����˵��ӿͻ�������]
 * @author KingDomPan
 */
Get.prototype.get920001503FromClient = function($level2directory) {
    var targetCatalogId = $level2directory.data('CATALOG_ID_2');
    var REMARK = $level2directory.data('REMARK'); // һ����ע
    var SHORT_DESCRIPTION = $level2directory.data('SHORT_DESCRIPTION'); // һ������
    var SHORT_DESCRIPTION_2 = $level2directory.data('SHORT_DESCRIPTION_2'); // ��������
    var REMARK_2 = $level2directory.data('REMARK_2'); // ������ע
	//var parentContainKey = false; // ���������Ƿ�����ؼ���, �ǵĻ�����ȫ�������˵�
    //������ȡ
    var $level2directoryremarkTemplate = $('div.templtae .level2directoryremarkTemplate').clone();
    var $level3directoryulTemplate = $('div.templtae .level3directoryulTemplate').clone();
    var hasValue = SearchValueUtil.hasSearchValue();
    var searchValue = SearchValueUtil.getValue();
    var $notlevel2Service = dataList.filter($level2directory,targetCatalogId);
    var len = $notlevel2Service ? $notlevel2Service.length : 0;
    // û�������˵�
    var $level3directoryulliTemplateModle = $('div.templtae>li.level3directoryulliTemplate');
    if (len == 0) {
    	var $level2Service = dataList.level2ServiceList[targetCatalogId];
        var remark = $level2Service ? $level2Service[0].find('REMARK').text() : '';
        $level2directoryremarkTemplate
            .html(remark.wrapHighLight(searchValue))
            .data('content', remark.wrapHighLight(searchValue));

        $level2directory.find('div.level3directory').append($level2directoryremarkTemplate);
        $level2directoryremarkTemplate.dotdotdot();
    } else {
        // ����ul��
        var fg = document.createDocumentFragment();
        
        var len2 = len >= Const.level3ItemNum ? Const.level3ItemNum : len;
        for (var i = 0; i < len2; i++) {
            var $level3Item = $notlevel2Service[i];

            if (!dataList.parentContainKey && hasValue) { // �����ؼ���
                if ($level3Item.text().indexOf(searchValue) < 0) { // �������ؼ���, pass
                    continue;
                }
            }
            // ����li��
            var $level3directoryulliTemplate = $level3directoryulliTemplateModle.clone();

            var SERVER_URL_NAME = $level3Item.find('SERVER_URL_NAME').text().startWithAbsPath();
            var func = (function() {
                var url = SERVER_URL_NAME;
                return function() {
                    url && window.open(url);
                };
            })();
            $level3directoryulliTemplate.find('span.bg4level3title')
                .html(ellipsisOverText($level3Item.find('SHORT_DESCRIPTION').text(),8))
                .data('content', $level3Item.find('REMARK').text().wrapHighLight(searchValue))
                .bind('click', func);
            fg.appendChild($level3directoryulliTemplate[0]);
            
            // $level3directoryulTemplate.append($level3directoryulliTemplate);
        }
        $level3directoryulTemplate[0].appendChild(fg);
        $level2directory.find('div.level3directory').append($level3directoryulTemplate);

    }

    // ���ø������������¼�, ���������¼
    if (len > Const.level3ItemNum) {
        // ���ñ���
        $level2directory.find('span.level3moreDirectoryHeaderTitle').text($level2directory.find('span.level2titleText').text());
        $level2directory.find('div.level3moretitle').bind('mouseover', function() {
        	var $self = $(this);
        	$self.addClass('level3moretitleover');
        	$self.find('div.px1height').show();
        	$self.find('div.level3moreDirectory').show();
        }).bind('mouseout', function() {
        	var $self = $(this);
        	$self.removeClass('level3moretitleover');
        	$self.find('div.px1height').hide();
        	$self.find('div.level3moreDirectory').hide();
        });
        var fg2 = document.createDocumentFragment();
        for (var i = Const.level3ItemNum; i < len; i++) {
            var $level3Item = $notlevel2Service[i];
            if (!dataList.parentContainKey && hasValue) { // ���ڹؼ��ֹ���
                if ($level3Item.text().indexOf(searchValue) < 0) { // �������ؼ���, pass
                    continue;
                }
            }
            // ����li��
            var $liTemplate = $level3directoryulliTemplateModle.clone();
            var SERVER_URL_NAME = $level3Item.find('SERVER_URL_NAME').text().startWithAbsPath();
            var func = (function() {
                var url = SERVER_URL_NAME;
                return function() {
                    url && window.open(url);
                };
            })();
            $liTemplate.find('span.bg4level3title')
                .html(ellipsisOverText($level3Item.find('SHORT_DESCRIPTION').text(),8))
                .data('content', $level3Item.find('REMARK').text().wrapHighLight(searchValue))
                .bind('click', func);
            fg2.appendChild($liTemplate[0]);
        }
        var $ul = $level2directory.find('ul.level3moreDirectoryBodyUl');
        $ul[0].appendChild(fg2);
    }
    
    // ���ø���
    var l = $level2directory.find('ul.level3moreDirectoryBodyUl li').length;
    len > Const.level3ItemNum && l > 0 &&
    	$level2directory
    		.find('.level3moretitleText')
    		.text('����[' + (l) + ']');
};

function GetDataMaker() {

    // ����ITSM-����Ŀ¼-һ����Ŀ¼����
    this.get920001502 = function(param) {
        param = param || {};
        var self = this;
        ResultQueryFactory.getQuery({
            id: 920001502,
            key: 920001502
        }, param, function(data, textStatus, xhr) {
            // ��Ⱦһ�����˵�������
            self.render(data);
        }, function() {
            var $level2directorys = $('div.container div.level2directory');
            $level2directorys.each(function(index, e) {
                self.get920001503FromClient($(this));
            });
            
            setMainNav();
        });
    };
    
    // ����ITSM-��ҳ��������Ŀ¼����
    //this.get20150905();
    
};


//����ITSM-��ҳ��������Ŀ¼����
//Get.prototype.get20150905 = function() {
function get20150905() {
	
	var self = this;

    ResultQueryFactory.getQuery({
        id: 20150905,
        key: 20150905
    }, {
        "V_CURRENT_STAFF_ID": getCurrentStaffId()
    }, function(data, textStatus, xhr) {

        var $data = $(data);
        var fg = document.createDocumentFragment();
        var $containerTemplate = $('div.templtae .containerTemplate').clone();
        
        // ���Ҷ������Ŀ¼
        var $level2ServiceDirectory = $data.find('rowSet').filter(function() {
        	return $(this).find('SLEVEL').text() == '2';
        });

        for (var j = 0; j < $level2ServiceDirectory.length; j++) {
            var index = j % Const.singleRowItemNum;
            if (index == 0) {
                // ��������Ŀ¼��
                var $rowTemplate4Level2Block = $('div.templtae .rowTemplate4Level2Block').clone();
                $containerTemplate.append($rowTemplate4Level2Block);
            }
            var $level2Item = $level2ServiceDirectory.eq(j);
            var SHORT_DESCRIPTION_2 = $level2Item.find('SHORT_DESCRIPTION').text();
            var CATALOG_ID_2 = $level2Item.find('CATALOG_ID').text();
            var ICON_2 = $level2Item.find('ICON').text();
            var REMARK_2 = $level2Item.find('REMARK').text();
            var SERVER_URL_NAME = $level2Item.find('SERVER_URL_NAME').text().startWithAbsPath();
			var func = (function() {
				var url = SERVER_URL_NAME;
				return function() {
					url && window.open(url);
				};
			})();
            // ��������Ŀ¼��
            var $level2directoryTemplate = $('div.templtae .level2directoryTemplate').clone();

            // ����$level2directoryTemplate��data����, ����Catalog_Id, ׼����ȡ�����˵�
            $level2directoryTemplate.data('CATALOG_ID_2', CATALOG_ID_2);
            $level2directoryTemplate.data('SHORT_DESCRIPTION_2', SHORT_DESCRIPTION_2);
            $level2directoryTemplate.data('REMARK_2', $level2Item.find('REMARK').text());

            $level2directoryTemplate.find('.level2titleText')
                .html(SHORT_DESCRIPTION_2.wrapHighLight(SearchValueUtil.getValue()))
                .bind('click', func);
            if(!SERVER_URL_NAME){
            	$level2directoryTemplate.find('.level2titleText').css("color","#343434");
            }
            $level2directoryTemplate.find('.level2png > img').attr({
                src: ICON_2,
                alt: SHORT_DESCRIPTION_2
            }).css('background-color', ColorGet(j));
            // ��λ����Ŀ¼��λ��
            var rowPosition = Math.floor(j / Const.singleRowItemNum); // �ö���Ŀ¼�����е�λ��
            var colPosition = index; // �ö���Ŀ¼�����е�λ��
            var $rowBlock = $containerTemplate.find('.rowTemplate4Level2Block').eq(rowPosition);
            var $colBlock = $rowBlock.find('.col-md-2point4.col-md-2point4-bg').eq(colPosition);

            // �ڶ���Ŀ¼������Ӷ���Ŀ¼��
            $colBlock.append($level2directoryTemplate);
           
            //����Ŀ¼
            var $notlevel2Service = $data.find('rowSet').filter(function() {
            	return $(this).find('PARENT_CATALOG_ID').text() == CATALOG_ID_2;
            });
        
            var len = $notlevel2Service.length;
            // û�������˵�
            if (len == 0) {
                var $level2directoryremarkTemplate = $('div.templtae .level2directoryremarkTemplate').clone();
                var $level2Service = $data.find('rowSet').filter(function() {
                    return (
                    	$(this).find('SERVER_URL_NAME').text() == '' 
                    	&& $(this).find('CATALOG_ID').text() == CATALOG_ID_2
                    	&& $(this).find('SORT_ID').text() == '-1' );
                });
                
                $level2directoryremarkTemplate
                    .html(REMARK_2)
                    .data('content', REMARK_2);

                $level2directoryTemplate.find('.level3directory').append($level2directoryremarkTemplate);
                $level2directoryremarkTemplate.dotdotdot();
            } else {
                // ����ul��

                var $level3directoryulTemplate = $('div.templtae .level3directoryulTemplate').clone();
                
                var fg3 = document.createDocumentFragment();
                
                var len2 = len >= Const.level3ItemNum ? Const.level3ItemNum : len;
                for (var i = 0; i < len2; i++) {
                    var $level3Item = $notlevel2Service.eq(i);

                    // ����li��
                    var $level3directoryulliTemplate = $('div.templtae .level3directoryulliTemplate').clone();
                    
                    var SHORT_DESCRIPTION_3 = $level3Item.find('SHORT_DESCRIPTION').text();
                    var CATALOG_ID_3 = $level3Item.find('CATALOG_ID').text();
                    var REMARK_3 = $level3Item.find('REMARK').text();
                    var SERVER_URL_NAME_3 = $level3Item.find('SERVER_URL_NAME').text().startWithAbsPath();
                    var func_2 = (function() {
                        var url = SERVER_URL_NAME_3;
                        return function() {
                            url && window.open(url);
                        };
                    })();
                    $level3directoryulliTemplate.find('.bg4level3title')
                        .html(ellipsisOverText(SHORT_DESCRIPTION_3,8))
                        .data('content', REMARK_3)
                        .bind('click', func_2);
                    fg3.appendChild($level3directoryulliTemplate[0]);
                    
                    // $level3directoryulTemplate.append($level3directoryulliTemplate);
                }
                $level3directoryulTemplate[0].appendChild(fg3);
                $level2directoryTemplate.find('.level3directory').append($level3directoryulTemplate);

            }

            // ���ø������������¼�, ���������¼
            if (len > Const.level3ItemNum) {
                // ���ñ���
            	$level2directoryTemplate.find('.level3moreDirectoryHeaderTitle').text($level2directoryTemplate.find('.level2titleText').text());
            	$level2directoryTemplate.find('.level3moretitle').bind('mouseover', function() {
                    $(this).addClass('level3moretitleover');
                    $(this).find('.px1height').show();
                    $(this).find('.level3moreDirectory').show();
                }).bind('mouseout', function() {
                    $(this).removeClass('level3moretitleover');
                    $(this).find('.px1height').hide();
                    $(this).find('.level3moreDirectory').hide();
                });
                var fg2 = document.createDocumentFragment();
                for (var i = Const.level3ItemNum; i < len; i++) {
                    var $level3Item = $notlevel2Service.eq(i);
                    
                    // ����li��
                    var $liTemplate = $('div.templtae .level3directoryulliTemplate').clone();
                    
                    var SHORT_DESCRIPTION_3 = $level3Item.find('SHORT_DESCRIPTION').text();
                    var CATALOG_ID_3 = $level3Item.find('CATALOG_ID').text();
                    var REMARK_3 = $level3Item.find('REMARK').text();
                    var SERVER_URL_NAME_3 = $level3Item.find('SERVER_URL_NAME').text().startWithAbsPath();
                    var func_2 = (function() {
                        var url = SERVER_URL_NAME_3;
                        return function() {
                            url && window.open(url);
                        };
                    })();
                    $liTemplate.find('.bg4level3title')
                        .html(ellipsisOverText(SHORT_DESCRIPTION_3,8))
                        .data('content', REMARK_3)
                        .bind('click', func_2);
                    fg2.appendChild($liTemplate[0]);
                }
                var $ul = $level2directoryTemplate.find('.level3moreDirectoryBodyUl');
                $ul[0].appendChild(fg2);
            }
            
            // ���ø���
            var l = $level2directoryTemplate.find('.level3moreDirectoryBodyUl li').length;
            len > Const.level3ItemNum && l > 0 &&
            $level2directoryTemplate
            		.find('.level3moretitleText')
            		.text('����[' + (l) + ']');

        }
        // ��ӵ������ֽ���
        fg.appendChild($containerTemplate[0]);
        $('#main_navigation')[0].appendChild(fg);
    });
};


GetDataMaker.prototype = new Get();

/**
 * [�¼��󶨳�ʼ��]
 * @author KingDomPan
 */
function EventM() {};

EventM.prototype.init = init;

function EventMaker() {
    this.initLevel2directoryBg = function() {
        $('.level2directory').live('mouseover', function(e) {
            $(this).addClass('level2directorybgchange');
        }).live('mouseout', function(e) {
            $(this).removeClass('level2directorybgchange');
        });
    };

    this.initUlLiTooltip = function() {
        $('.level3directory span.bg4level3title, .level3moreDirectoryBodyUl span.bg4level3title').live('mouseover', function(e) {
        	var $self = $(this);
        	$self.popover({html: true}).popover('show');
        	$self.addClass('bg4level3titlehover');
        	$self.prev().addClass('bg4level3titlesquarehover');
        }).live('mouseout', function(e) {
        	var $self = $(this);
        	$self.popover('destroy');
        	$self.removeClass('bg4level3titlehover');
        	$self.prev().removeClass('bg4level3titlesquarehover');
        });
    };

    this.initRemarkTooptip = function() {
        $('.level3directory p.level2directoryremark').live('mouseover', function(e) {
            $(this).popover({html: true}).popover('show');
        }).live('mouseout', function(e) {
            $(this).popover('destroy');
        });
    };

    this.initTuCaoBtn = function() {
    	$('#TuCaoBtn').bind('click', function() {
    		window.open('/workshop/form/index.jsp?flowMod=11104&source=servicedirectory');
    	});
    };
}

EventMaker.prototype = new EventM();

new EventMaker().init();

/**
 * [jQuery��ں���]
 * @author KingDomPan
 */
var $rowSet;
//����index_ITSM3.jsp���
function navJTITSM() {	
	$(document).ready(function() {
	    if ($.browser.msie && $.browser.version < 9) {//���ie�汾����9������ת������ITSM�ɰ���ҳ
	    	location.replace("/indexLead.jsp");
	    }
	    $(document.body).ajaxStart(function() {
	        WaitLoading.showWaitITSM();
	    }).ajaxSuccess(function() {
	    	WaitLoading.hideWaitITSM();
	    });
	    $rowSet = $(getHtmlData("LEVEL_3_ITEMS")).find('rowSet');
	    //����ITSM��ҳ�ͻ�������
	    $("#itnmAppPoint").bind('mousemove', function() {
			var $this = $(this);
			$this[0].style.color='#0089ff';
			document.getElementById('XXX').style.display = 'inline';
		}).bind('mouseout', function() {
			var $this = $(this);
			$this[0].style.color='#808e9c';
			document.getElementById('XXX').style.display = 'none';
		});
	    
	    //���ؼ���ITSM��ҳ�˵���������Ŀ¼��
	    dataList.init();
	    new GetDataMaker().init();
	    
	    //����ITSM-��ҳ��������Ŀ¼����
	    window.setTimeout('get20150905()',5000);	    
	});
}

//������Լ��
function navFJJYH() {
	$rowSet = $(getHtmlData("LEVEL_3_ITEMS")).find('rowSet');  
   
    //���ؼ���ITSM��ҳ�˵���������Ŀ¼��
    dataList.init();
    new GetDataMaker().init();
}

var dataList = {
	//���йؼ��ֵ������˵�
	notlevel2ServiceList:[],
	level2ServiceList:[],
	parentContainKey:false,
	init:function(){
    	var self = this;
		$rowSet.each(function() {
			var $self = $(this);
			var text = $self.find('CATALOG_ID').text();
			if ($self.find('SERVER_URL_NAME').text() != '' && $self.find('SORT_ID').text() != '-1') {
				if(!self.notlevel2ServiceList[text]){
					self.notlevel2ServiceList[text] = [];
				}
				self.notlevel2ServiceList[text].push($self);
			}
			if ($self.find('SERVER_URL_NAME').text() == '' && $self.find('SORT_ID').text() == '-1') {
				if(!self.level2ServiceList[text]){
					self.level2ServiceList[text] = [];
				}
				self.level2ServiceList[text].push($self);
			}
		});
		return this;
	},
	filter:function($level2directory,targetCatalogId){
		this.parentContainKey = false;
		var hasValue = SearchValueUtil.hasSearchValue();
		var filterArr = this.notlevel2ServiceList[targetCatalogId];
    	if(hasValue && filterArr){
    		var searchValue = SearchValueUtil.getValue();
    		var REMARK = $level2directory.data('REMARK'); // һ����ע
    		var SHORT_DESCRIPTION = $level2directory.data('SHORT_DESCRIPTION'); // һ������
    		var SHORT_DESCRIPTION_2 = $level2directory.data('SHORT_DESCRIPTION_2'); // ��������
    		var REMARK_2 = $level2directory.data('REMARK_2'); // ������ע
    		var self = this;
    		$.each(filterArr,function(i,el){
	    		if(SHORT_DESCRIPTION.indexOf(searchValue) > -1 || REMARK.indexOf(searchValue) > -1 || SHORT_DESCRIPTION_2.indexOf(searchValue) > -1 || REMARK_2.indexOf(searchValue) > -1){
	    			self.parentContainKey = true;
	    		}else{
	    			if($(this).text().indexOf(searchValue) < 0){
	    				filterArr.remove(i);
	    			}
	    		}
	    	 })
    	 }
    	 return filterArr ? filterArr : [];
	}
}

Array.prototype.remove = function(el){  
	return this.splice(el,1);  
}
String.prototype.startWithAbsPath = function() {
	if(this.trim() == "") return "";
	if(this.startWith("/") || this.trim().indexOf("http") == 0) {
		return this;
	} else {
		return "/" + this;
	}
};