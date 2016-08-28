Ext.namespace('Ext.ux.SVGPlayer');
Ext.ux.SVGPlayer.Control = Ext.extend(Ext.Toolbar, {
    task : null,
    elRuntime : null,
    playButton : null,
    stopButton : null,
    previousButton : null,
    nextButton : null,
    sliderField : null,
    isAdjusting : false,
    _onError : function(errorCode)
    {
        this.player.stopScene();
        Ext.Msg.alert('Error', 'The video you requested could not be played. Error code '+errorCode);
    },
    _onSeekPosition : function()
    {
        this.player.seekTo(this.sliderField.getValue());
    },
    _onPlay : function(button)
    {
        var state = this.player.getPlayerState();
        if (state == 'playing') {
            this.player.pauseScene();
        } else if (state == 'paused') {
            this.player.playScene();
        } else if (state == 'ended') {
            this.player.RunPlayModel(this.player.Model);
        }
    },
    _onStop : function(button)
    {
        this.player.stopScene();
        this.player.seekTo(0);
        this._updateVideoInfo.defer(100, this, [true]);
    },
    _onPrev : function(button)
    {
        this.player.prevTo();
    },
    _onNext : function(button)
    {
        this.player.nextTo();
    },
    initComponent : function()
    {
        var tb = Ext.Toolbar.Button;
        this.playButton = new tb({
            iconCls : 'play',
            disabled : false
        });
        this.stopButton = new tb({
            iconCls : 'stop',
            disabled : true
        });
        this.previousButton = new tb({
            iconCls : 'start',
            disabled : true
        });
        this.nextButton = new tb({
            iconCls : 'end',
            disabled : true
        });
        this.sliderField = new Ext.Slider({
            minValue   : 0,
            maxValue   : 1000,
            disabled   : true,
            value      : 0,
            plugins    : Ext.ux.SliderFill
        });
        this.elRuntime = new Ext.Toolbar.TextItem({text:"00:00"});
        Ext.apply(this, {
            cls   : 'ext-ux-youtubeplayer-control',
            items : [
                this.playButton,
                this.stopButton,
                this.previousButton,
                this.nextButton,
                ' ',
                this.sliderField,
                ' ',
                this.elRuntime,
                new Ext.Toolbar.Spacer()
            ]
        });
        Ext.ux.SVGPlayer.Control.superclass.initComponent.call(this);
        this.on('beforerender', this._initListeners, this);
    },
    _initListeners : function()
    {
        this.on('afterlayout', function() {
            this.getLayout().onLayout = this.getLayout().onLayout.createInterceptor(function() {
                this.container.sliderField.el.dom.parentNode.style.width ="1px";
            });
            this.getLayout().onLayout = this.getLayout().onLayout.createSequence(function() {
                this.container.sliderField.el.dom.parentNode.style.width ='100%';
            });
        }, this, {single : true});
        this.playButton.on('click', this._onPlay, this);
        this.stopButton.on('click', this._onStop, this);
        this.previousButton.on('click', this._onPrev, this);
        this.nextButton.on('click', this._onNext, this);
        this.on('hide', this._onHide, this);
        this.on('destroy', this._onDestroy, this);
        var c = this;
        this.player.on('error', this._onError, this);        
        this.player.on('stateChange', function(state, player, model){c._processPlayerEvents.defer(1, c, [state, player, model]);}, this);
        this.sliderField.on('dragstart', function(){this.isAdjusting = true;}, this);
        this.sliderField.on('drag', this._onSeekPosition, this);
        this.sliderField.on('dragend', function(){this.isAdjusting = false;}, this);
    },
    _onDestroy : function()
    {
        if (this.task) {
            Ext.TaskMgr.stop(this.task);
            this.task = null;
        }
    },
    _updateVideoInfo : function(ignorePaused)
    {   	
        if (this.player.getPlayerState() == 'ended') {
            this._processPlayerEvents('ended', this.player, null);
            return;
        }
        var player = this.player;
        var slider = this.sliderField;
        if (ignorePaused !== true && player.getPlayerState() == 'paused') {
            return;
        }
        var currentTime = Math.max(0, player.getCurrentTime());
        var totalTime   = Math.max(0, player.getTotalTime());
        if (totalTime != 0) {
            var rem = Math.floor(currentTime); 
            var minutes = Math.max(0, Math.floor(rem / 60));
            var seconds = Math.max(0, (rem%60));
            this.elRuntime.setText((minutes < 10 ? '0'+minutes : minutes)+':'+(seconds < 10 ? '0'+seconds : seconds));
            this.sliderField.maxValue = totalTime;
            if (!this.isAdjusting) {
                this.sliderField.setValue(currentTime, false);
            }
        }
    },
    _processPlayerEvents : function(state, player, model)
    {
        switch (state) {
            case 'ended':
                if (this.task) {
                    Ext.TaskMgr.stop(this.task);
                    this.task = null;
                }
                this.playButton.setIconClass('play');
                this.sliderField.setValue(0);
                this.sliderField.setDisabled(true);
                this.previousButton.setDisabled(true);
                this.nextButton.setDisabled(true);
                this.elRuntime.setText("00:00");
                this.stopButton.setDisabled(true);
            break;
            case 'playing':
                if (!this.task) {
                    var c = this;
                    this.task = {
                        run: function(){
                           c._updateVideoInfo();
                        },
                        interval: 500
                    };
                    Ext.TaskMgr.start(this.task);
                }
                this.sliderField.setDisabled(false);
                this.playButton.setIconClass('pause');
                this.playButton.setDisabled(false);
                this.previousButton.setDisabled(false);
                this.nextButton.setDisabled(false);                
                this.stopButton.setDisabled(false);
            break;
            case 'paused':
                this.playButton.setIconClass('play');
            break;
            case 'unknown':
            break;
        }
    }
});