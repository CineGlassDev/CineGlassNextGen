/*
 * ItemViewerTouch 0.1 - jQuery plugin to manage the touch capabilities for the CineGlass item viewer
 * 
 * Copyright (c) 2013 Technicolor
 *
 * Authored by Ryan Howard
 *
 */

(function($) {

    var _settings;
    var _startPosition = { top: 0, left: 0 };
       
    var methods = {

        init: function (options) {

            if (this.length == 0) {
                return;
            }

            _settings = $.extend({
                'enablePan': true,
                'enableZoom': true
            }, options);


            this.each(function () {
                
                var $this = $(this);

                if (_settings.enablePan === true) {

                    $this.hammer({ drag_min_distance: 0 }).on('drag', function (event) {

                        event.gesture.preventDefault();

                        var newX = px(_startPosition.left + event.gesture.deltaX);
                        var newY = px(_startPosition.top + event.gesture.deltaY);
                                            
                        var translate3d = 'translate3d(' + newX + ',' + newY + ',0)';

                        $(this).css({
                            '-webkit-transform': translate3d,
                            '-moz-transform': translate3d,
                            '-o-transform': translate3d,
                            '-ms-transform': translate3d,
                            'transform': translate3d
                        });

                    });

                    $this.hammer({ drag_min_distance: 0 }).on('dragend', function (event) {

                        _startPosition.left = _startPosition.left + event.gesture.deltaX;
                        _startPosition.top = _startPosition.top + event.gesture.deltaY;

                    });

                }

                if (_settings.enableZoom === true) {

                    $this.hammer().on('pinch', function (event) {

                        event.gesture.preventDefault();

                        var scale3d = 'scale3d(' + event.gesture.scale + ',' + event.gesture.scale + ',1)';

                        $(this).css({
                            '-webkit-transform': scale3d,
                            '-moz-transform': scale3d,
                            '-o-transform': scale3d,
                            '-ms-transform': scale3d,
                            'transform': scale3d
                        });

                    });

                }

            });

            return this;
        },

        reset: function () {
            _startPosition = { top: 0, left: 0 };

            var translate3d = 'translate3d(0px,0px,0px)';

            $(this).css({
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-o-transform': translate3d,
                '-ms-transform': translate3d,
                'transform': translate3d
            });


        }

    };

    $.fn.itemViewerTouch = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jquery.cg.itemViewerTouch');
        }

    };

    function px(val) {
        return val + 'px';
    }

})(jQuery);