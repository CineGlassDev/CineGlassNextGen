/*
 * ItemViewer 0.1 - jQuery plugin to display content items in a touch-enabled viewer
 * 
 * Copyright (c) 2013 Technicolor
 *
 * Authored by Ryan Howard
 *
 */

(function($) {

    var settings;
    var $this;
    var $frames;
    var frameCount = 0;
    var activeFrame = 1;
    var $nav;
    var containerSelector = '#itemViewer-container';
    var titlebarSelector = '#itemViewer-titlebar';
    var frameSelector = '.itemViewer-frame';
    var frameWidth;
    var slideSpeed = 400;
       
    var methods = {

        init: function (options, cb) {

            if (this.length > 1) {
                $.error('The selector you provided resulted in more than one element, which jquery.itemViewer does not support.');
            } else if (this.length == 0) {
                $.error('The selector you provided did not result in an element to bind to.');
            }

            settings = $.extend({
                'caption': '',
                'slideSpeed': 400,
                'padding': 10,
                'phase': ''
            }, options);

            //
            // create container or use existing one
            //
            var container = $(containerSelector).get(0);
            if (container == null) {
                container = document.createElement('div');
                container.id = containerSelector.substr(1);
                this.append(container);
            } else {
                container.remove();
                frameCount = 0;
            }
            container.style.position = 'absolute';
            container.style.display = 'none';

            var titlebar = document.createElement('div');
            titlebar.id = titlebarSelector.substr(1);
            container.appendChild(titlebar);

            var titlebarFlood = document.createElement('div');
            titlebarFlood.textContent = settings.caption;
            titlebar.appendChild(titlebarFlood);


            if (settings.phase != null) {
                titlebarFlood.className = 'phase-' + settings.phase.toLowerCase();
            }            

            // create frames div
            var frames = document.createElement('div');
            frames.style.position = 'absolute';
            frames.style.overflow = 'hidden';
            frames.style.zIndex = 1;

            $(frames).hammer().on('swipeleft', function (event) {

                event.gesture.preventDefault();
                slideLeft();

            });

            $(frames).hammer().on('swiperight', function (event) {

                event.gesture.preventDefault();
                slideRight();

            });

            container.appendChild(frames);

            var nav = document.createElement('div');
            nav.id = 'itemViewer-navbar';
            container.appendChild(nav);

            $this = $(container);
            $frames = $(frames);
            $nav = $(nav);

            if (typeof cb === 'function') {
                cb.call(this);
            }

            return this;
        },

        addItem: function (caption, domContent) {

            //
            // make sure domContent passed in is NOT a jquery
            // object...if so, get the underlying DOM domContent
            //
            var item;
            if (domContent instanceof jQuery) {
                item = domContent.get(0);
            } else {
                item = domContent;
            }

            var frame = document.createElement('div');            
            frame.className = frameSelector.substr(1);
            frame.style.display = 'inline-block';
            frame.style.overflow = 'auto';
            frame.appendChild(item);            
            $frames.append(frame);
            frameCount++;

            var button = document.createElement('div');
            button.className = 'itemViewer-button' + (settings.phase != null ? ' ' + settings.phase.toLowerCase() : '');
            button.textContent = caption;
            var slideNumber = $frames.children().length;
            $(button).hammer().on('tap', function(event) {                
                event.gesture.preventDefault();
                slideTo(slideNumber);
                return false;
            });

            if (frameCount == 1) {
                $(button).addClass('active');
            }            

            $nav.append(button);

            return this;
        },

        clear: function () {

            if ($this) {
                $this.remove();
                frameCount = 0;
            }

            return this;            
        },

        setDims: function (dims, cb) {


            frameWidth = px(dims.width - settings.padding * 2);
            var titlebarHeight = $(titlebarSelector).height();
            var frameHeight = px(dims.height - $nav.height() - titlebarHeight - (settings.padding * 2));
            

            $this.css({ left: px(dims.left), top: px(dims.top), width: px(dims.width), height: px(dims.height) });
            $frames.css({ left: px(settings.padding), top: px(titlebarHeight + settings.padding), height: frameHeight, width: frameWidth });
            $(frameSelector).css({ width: frameWidth, height: frameHeight });

            if (typeof cb == 'function') {
                cb.call(this);
            }
            
        },

        show: function (duration, cb) {

            $this.fadeIn(duration, cb);
        },

        hide: function () {
            if ($this) {
                $this.hide();
            }
        }

    };

    $.fn.itemViewer = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jquery.itemViewer');
        }

    };

    function slideMany(count, left, duration) {

        if (count-- > 0) {

            if (left === true) {

                slideLeft(duration, function () {
                    slideMany(count, left, duration);
                });

            } else {

                slideRight(duration, function () {
                    slideMany(count, left, duration);
                });

            }
        }

    }

    function slideLeft(duration, cb) {

        if (typeof duration === 'undefined') {
            duration = settings.slideSpeed;
        }

        var firstFrame = $frames.children(frameSelector).first();

        firstFrame.animate({ marginLeft: '-=' + frameWidth }, duration, function () {
            firstFrame.appendTo($frames);
            firstFrame.css('margin-left', '0');

            if ((activeFrame + 1) <= frameCount) {
                activeFrame++;
            } else {
                activeFrame = Math.abs(frameCount - activeFrame - 1);
            }

            $('.itemViewer-button').removeClass('active');
            $('.itemViewer-button:eq(' + (activeFrame - 1) + ')').toggleClass('active');

            if (typeof cb === 'function') {
                cb.call(this);
            }

        });        

    }

    function slideRight(duration, cb) {

        if (typeof duration === 'undefined') {
            duration = settings.slideSpeed;
        }

        var lastFrame = $frames.children(frameSelector).last();
        lastFrame.prependTo($frames);
        lastFrame.css('margin-left', '-' + frameWidth);
        lastFrame.animate({ marginLeft: '0' }, duration, function () {

            if ((activeFrame - 1) >= 1) {
                activeFrame--;
            } else {
                activeFrame = frameCount - activeFrame + 1;
            }

            $('.itemViewer-button').removeClass('active');
            $('.itemViewer-button:eq(' + (activeFrame - 1) + ')').toggleClass('active');

            if (typeof cb === 'function') {
                cb.call(this);
            }

        });

    }

    function slideTo(slideNumber) {
        
        var slideCount = Math.abs(slideNumber - activeFrame);

        var duration = Math.ceil(settings.slideSpeed / slideCount);

        slideMany(slideCount, (slideNumber > activeFrame), duration);

    }

    function px(val) {
        return val + 'px';
    }

})(jQuery);