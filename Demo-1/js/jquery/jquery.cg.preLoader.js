
(function($) {
	/*Browser detection patch*/
	jQuery.browser = {};
	jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
	jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
	jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
	jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }

    var _items = [];
    var _isDone = 0;
    var _isDestroyed = false;

    var _itemContainer = "";
    var _itemOverlay = "";
    var _itemBar = "";
    var _itemPercentage = "";
    var _itemCounter = 0;
    var _itemStart = 0;

    var _options = {
        onComplete: function () {},
        backgroundColor: "#000",
        barColor: "#fff",
        percentageColor: "#000",
        overlayId: '_itemOverlay',
        studioData: null,
        getAssetIconUrlFunction: null,
        barHeight: 1,
        percentage: false,
        deepSearch: true,
        completeAnimation: "fade",
        minimumTime: 500,
        onLoadComplete: function () {
            if (_options.completeAnimation == "grow") {
                var animationTime = 500;
                var currentTime = new Date();
                if ((currentTime.getTime() - _itemStart) < _options.minimumTime) {
                    animationTime = (_options.minimumTime - (currentTime.getTime() - _itemStart));
                }

                $(_itemBar).stop().animate({
                    "width": "100%"
                }, animationTime, function () {
                    $(this).animate({
                        top: "0%",
                        width: "100%",
                        height: "100%"
                    }, 500, function () {
                        $('#'+_options.overlayId).fadeOut(500, function () {
                            $(this).remove();
                            _options.onComplete();
                        })
                    });
                });
            } else {
                $('#'+_options.overlayId).fadeOut(500, function () {
                    $('#'+_options.overlayId).remove();
                    _options.onComplete();
                });
            }
        }
    };

    var afterEach = function () {
        //start timer
        //_isDestroyed = false;
        var currentTime = new Date();
        _itemStart = currentTime.getTime();

        if (_items.length > 0) {
            createPreloadContainer();
            createOverlayLoader();
        } else {
            //no images == instant exit
            destroyQueryLoader();
        }
    };

    var createPreloadContainer = function() {
        _itemContainer = $("<div></div>").appendTo("body").css({
            display: "none",
            width: 0,
            height: 0,
            overflow: "hidden"
        });
        
        for (var i = 0; _items.length > i; i++) {
            $.ajax({
                url: _items[i],
                type: 'HEAD',
                complete: function (data) {
                    if (!_isDestroyed) {
                        _itemCounter++;
                        addImageForPreload(this['url']);
                    }
                }
            });
        }        	

    };

    var addImageForPreload = function(url) {
        var image = $("<img />").attr("src", url).bind("load error", function () {
            completeImageLoading();
        }).appendTo(_itemContainer);
    };

    var completeImageLoading = function () {
        _isDone++;

        var percentage = (_isDone / _itemCounter) * 100;
        $(_itemBar).stop().animate({
            width: percentage + "%",
            minWidth: percentage + "%"
        }, 200);

        if (_options.percentage == true) {
            $(_itemPercentage).text(Math.ceil(percentage) + "%");
        }

        if (_isDone == _itemCounter) {
            destroyQueryLoader();
        }
    };

    var destroyQueryLoader = function () {
        $(_itemContainer).remove();
        _options.onLoadComplete();
        _isDestroyed = true;
    };

    var createOverlayLoader = function () {
        _itemOverlay = $("<div id='"+_options.overlayId+"'></div>").css({
            width: "100%",
            height: "100%",
            backgroundColor: _options.backgroundColor,
            backgroundPosition: "fixed",
            position: "fixed",
            zIndex: 666999,
            top: 0,
            left: 0
        }).appendTo("body");
        _itemBar = $("<div id='_itemBar'></div>").css({
            height: _options.barHeight + "px",
            marginTop: "-" + (_options.barHeight / 2) + "px",
            backgroundColor: _options.barColor,
            width: "0%",
            position: "absolute",
            top: "50%"
        }).appendTo(_itemOverlay);
        if (_options.percentage == true) {
            _itemPercentage = $("<div id='_itemPercentage'></div>").text("0%").css({
                height: "40px",
                width: "100px",
                position: "absolute",
                fontSize: "3em",
                top: "50%",
                left: "50%",
                marginTop: "-" + (59 + _options.barHeight) + "px",
                textAlign: "center",
                marginLeft: "-50px",
                color: _options.percentageColor
            }).appendTo(_itemOverlay);
        }
        if ( !_items.length) {
        	destroyQueryLoader()
        }
    };

    var findItemInElement = function (element) {
        var url = "";

        if ($(element).css("background-image") != "none") {
            url = $(element).css("background-image");
        } else if (typeof($(element).attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img") {
            url = $(element).attr("src");
        }

        if (url.indexOf("gradient") == -1) {
            url = url.replace(/url\(\"/g, "");
            url = url.replace(/url\(/g, "");
            url = url.replace(/\"\)/g, "");
            url = url.replace(/\)/g, "");

            var urls = url.split(", ");

            for (var i = 0; i < urls.length; i++) {
                if (urls[i].length > 0 && _items.indexOf(urls[i]) == -1 && !urls[i].match(/^(data:)/i)) {
                    var extra = "";
                    if ($.browser.msie && $.browser.version < 9) {
                        extra = "?" + Math.floor(Math.random() * 3000);
                    }
                    _items.push(urls[i] + extra);
                }
            }
        }
    }

    var addItemsFromStudioData = function () {

        var catalog = _options.studioData.catalog;
        var movieCount = catalog.length;

        var formatUri = function (uri) {
            if (uri.indexOf('url(') > -1) {
                return uri.substring(5, uri.length - 2);
            } else {
                return uri;
            }
        }

        //
        // initialize movie tiles
        //
        for (var index = 0; index < movieCount; index++) {

            var movieData = catalog[index];

            _items.push(formatUri(movieData.oneSheet));

            if (movieData.phases != null) {

                var addItemsForPhase = function(phase) {

                    var depts = phase.departments;

                    var deptsLength = depts.length;

                    for (var index2 = 0; index2 < deptsLength; index2++) {

                        var dept = depts[index2];

                        if (typeof dept.iconUri != 'undefined') {
                            _items.push(formatUri(dept.iconUri));

                        }

                        var assets = dept.assets;
                        var assetsLength = assets.length;

                        for (var index3 = 0; index3 < assetsLength; index3++) {

                            var asset = assets[index3];

                            if (_options.getAssetIconUrlFunction != null) {
                                var iconUrl = _options.getAssetIconUrlFunction.call(this, asset);
                                _items.push(formatUri(iconUrl));
                            }

                            _items.push(formatUri(asset.assetUri));
                        }

                    }

                }

                addItemsForPhase(movieData.phases.development);
                addItemsForPhase(movieData.phases.preProduction);
                addItemsForPhase(movieData.phases.production);
                addItemsForPhase(movieData.phases.postProduction);
                addItemsForPhase(movieData.phases.distribution);

            }

        }


    }

    $.fn.cineGlassPreLoader = function(options) {

        if (options) {
            $.extend(_options, options );
        }

        this.each(function() {
            findItemInElement(this);

            if (_options.deepSearch == true) {
                $(this).find("*:not(script)").each(function() {
                    findItemInElement(this);
                });
            }
        });

        if (_options.studioData != null) {
            addItemsFromStudioData();
        }

        afterEach();

        return this;
    };

    //browser detect
    var BrowserDetect = {
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(navigator.userAgent)
                || this.searchVersion(navigator.appVersion)
                || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
        },
        searchString: function (data) {
            for (var i=0;i<data.length;i++)	{
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1)
                        return data[i].identity;
                }
                else if (dataProp)
                    return data[i].identity;
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
        },
        dataBrowser: [
            {
                string: navigator.userAgent,
                subString: "Chrome",
                identity: "Chrome"
            },
            { 	string: navigator.userAgent,
                subString: "OmniWeb",
                versionSearch: "OmniWeb/",
                identity: "OmniWeb"
            },
            {
                string: navigator.vendor,
                subString: "Apple",
                identity: "Safari",
                versionSearch: "Version"
            },
            {
                prop: window.opera,
                identity: "Opera",
                versionSearch: "Version"
            },
            {
                string: navigator.vendor,
                subString: "iCab",
                identity: "iCab"
            },
            {
                string: navigator.vendor,
                subString: "KDE",
                identity: "Konqueror"
            },
            {
                string: navigator.userAgent,
                subString: "Firefox",
                identity: "Firefox"
            },
            {
                string: navigator.vendor,
                subString: "Camino",
                identity: "Camino"
            },
            {		// for newer Netscapes (6+)
                string: navigator.userAgent,
                subString: "Netscape",
                identity: "Netscape"
            },
            {
                string: navigator.userAgent,
                subString: "MSIE",
                identity: "Explorer",
                versionSearch: "MSIE"
            },
            {
                string: navigator.userAgent,
                subString: "Gecko",
                identity: "Mozilla",
                versionSearch: "rv"
            },
            { 		// for older Netscapes (4-)
                string: navigator.userAgent,
                subString: "Mozilla",
                identity: "Netscape",
                versionSearch: "Mozilla"
            }
        ],
        dataOS : [
            {
                string: navigator.platform,
                subString: "Win",
                identity: "Windows"
            },
            {
                string: navigator.platform,
                subString: "Mac",
                identity: "Mac"
            },
            {
                string: navigator.userAgent,
                subString: "iPhone",
                identity: "iPhone/iPod"
            },
            {
                string: navigator.platform,
                subString: "Linux",
                identity: "Linux"
            }
        ]

    };
    BrowserDetect.init();
    jQuery.browser.version = BrowserDetect.version;
})(jQuery);
