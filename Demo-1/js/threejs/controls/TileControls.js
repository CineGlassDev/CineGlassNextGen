/** @namespace */
var CG = CG || {};

CG.TileControls = function (options, camera, renderFunction, swipeAreaContainer, moveDuration, hammer) {

    var _this = this;

    var _options = options;
    var _originalY = camera.position.y;
    var _originalZ = camera.position.z;
    var _camera = camera;
    var _renderFunction = renderFunction;
    var _swipeAreaContainer = swipeAreaContainer;
    var _moveDuration = moveDuration;
    var _hammer = hammer;
    
    this.disabled = false;
    this.is3D = options.is3D;


    //
    // private event functions
    //

    function onSwipeUp(event) {

        event.gesture.preventDefault();
        handleSwipe(true, event.gesture.distance, event.gesture.velocityY);
        event.gesture.stopDetect();

    }

    function onSwipeDown(event) {

        event.gesture.preventDefault();
        handleSwipe(false, event.gesture.distance, event.gesture.velocityY);
        event.gesture.stopDetect();

    }

    function onSwipeLeft(event) {

        event.gesture.preventDefault();
        handleSwipe(false, event.gesture.distance, event.gesture.velocityX);
        event.gesture.stopDetect();

    }

    function onSwipeRight(event) {

        event.gesture.preventDefault();
        handleSwipe(true, event.gesture.distance, event.gesture.velocityX);
        event.gesture.stopDetect();

    }

    function initialize() {

        //
        // bind swipe events
        //

        _hammer.on('swipeup', _swipeAreaContainer, onSwipeUp);
        _hammer.on('swipedown', _swipeAreaContainer, onSwipeDown);
        _hammer.on('swipeleft', _swipeAreaContainer, onSwipeLeft);
        _hammer.on('swiperight', _swipeAreaContainer, onSwipeRight);

    }


    function handle3dSwipe(isUp, distance, velocity) {

        if (_this.disabled === true) {

            return;

        }

        var adjustmentZ;
        var adjustmentY;


        // bump up the velocity for a snappier interface
        velocity = velocity * 2;

        if (isUp === true) {

            adjustmentZ = _options.offsetZ * velocity;
            adjustmentY = _options.rise3d * -1 * velocity;

        } else {

            adjustmentZ = _options.offsetZ * -1 * velocity;
            adjustmentY = _options.rise3d * velocity;

        }

        var newY = _camera.position.y + adjustmentY;
        var newZ = _camera.position.z + adjustmentZ;


        if (newZ != _camera.position.z) {

            TWEEN.removeAll();

            new TWEEN.Tween(_camera.position)
                .to({ z: newZ, y: newY }, _moveDuration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();

            new TWEEN.Tween(this)
                .to({}, _moveDuration)
                .onUpdate(_renderFunction)
                .onComplete(function () {
                    _this.disabled = false;
                })
                .start();

        }

    }

    function handle2dSwipe(isRight, distance, velocity) {

        if (_this.disabled === true) {

            return;

        }

        var adjustmentZ;

        // bump up the velocity for a snappier interface
        velocity = velocity * 2;

        var adjustmentX = _options.rise3d * velocity * 1.5;

        if (isRight === true) {

            adjustmentX = adjustmentX * -1;

        }

        var newX = _camera.position.x + adjustmentX;

        if (newX != _camera.position.x) {

            TWEEN.removeAll();

            new TWEEN.Tween(_camera.position)
                .to({ x: newX }, _moveDuration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();

            new TWEEN.Tween(this)
                .to({}, _moveDuration)
                .onUpdate(_renderFunction)
                .onComplete(function () {
                    _this.disabled = false;
                })
                .start();

        }

    }

    function handleSwipe(isUp, distance, velocity) {

        if (_this.disabled === true) {

            return;

        }

        if (_this.is3D === true) {

            handle3dSwipe(isUp, distance, velocity);

        } else {

            handle2dSwipe(isUp, distance, velocity);

        }




        //var adjustmentZ;
        //var adjustmentY;
        //var newZ;
        //var newY;

        //// bump up the velocity for a snappier interface
        //velocity = velocity * 2;

        //if (isUp === true) {                        
            
        //    adjustmentZ = _options.offsetZ * velocity;
        //    adjustmentY = _options.rise3d * -1 * velocity;

        //} else {            

        //    adjustmentZ = _options.offsetZ * -1 * velocity;
        //    adjustmentY = _options.rise3d * velocity;

        //}        

        //if (_this.is3D === true) {

        //    newY = _camera.position.y + adjustmentY;
        //    newZ = _camera.position.z + adjustmentZ;

        //} else {

        //    newY = _camera.position.y + (adjustmentY * 1.5); // bump up 2D Y move to make it snappier
        //    newZ = _camera.position.z;

        //}

        ////console.log({ 'newY': newY, 'newZ': newZ });
 
        //if ((_this.is3D === true && newZ != _camera.position.z) ||
        //    (_this.is3D === false && newY != _camera.position.y)) {
            
        //    TWEEN.removeAll();

        //    if (_this.is3D === true) {

        //        new TWEEN.Tween(_camera.position)
        //            .to({ z: newZ, y: newY }, _moveDuration)
        //            .easing(TWEEN.Easing.Cubic.Out)
        //            .start();

        //    } else {

        //        new TWEEN.Tween(_camera.position)
        //            .to({ z: newZ, x: newY }, _moveDuration)
        //            .easing(TWEEN.Easing.Cubic.Out)
        //            .start();

        //    }
                     
        //    new TWEEN.Tween(this)
        //        .to({}, _moveDuration)
        //        .onUpdate(_renderFunction)
        //        .onComplete(function() {
        //            _this.disabled = false;
        //        })
        //        .start();

        //}


    }


    this.reset = function (options, camera, renderFunction, swipeAreaContainer, moveDuration, hammer) {

        //
        // destroy current event bindings
        //

        _hammer.off('swipeup', _swipeAreaContainer, onSwipeUp);
        _hammer.off('swipedown', _swipeAreaContainer, onSwipeDown);
        _hammer.off('swipeleft', _swipeAreaContainer, onSwipeLeft);
        _hammer.off('swiperight', _swipeAreaContainer, onSwipeRight);

        _options = options;
        _originalY = camera.position.y;
        _originalZ = camera.position.z;
        _camera = camera;
        _renderFunction = renderFunction;
        _swipeAreaContainer = swipeAreaContainer;
        _moveDuration = moveDuration;
        _hammer = hammer;

        this.disabled = false;
        this.is3D = options.is3D;

        initialize();
    }

    initialize();

}