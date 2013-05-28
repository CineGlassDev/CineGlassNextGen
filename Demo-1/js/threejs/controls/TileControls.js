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

    function initialize() {

        //
        // bind swipe events
        //

        _hammer.on('swipeup', _swipeAreaContainer, onSwipeUp);
        _hammer.on('swipedown', _swipeAreaContainer, onSwipeDown);

    }

    function handleSwipe(isUp, distance, velocity) {
        
        if (_this.disabled === true) {

            return;

        }

        var adjustmentZ;
        var adjustmentY;
        var newZ;
        var newY;

        // bump up the velocity for a snappier interface
        velocity = velocity * 2;

        if (isUp === true) {                        
            
            adjustmentZ = _options.offsetZ * velocity;
            adjustmentY = _options.rise3d * -1 * velocity;

        } else {            

            adjustmentZ = _options.offsetZ * -1 * velocity;
            adjustmentY = _options.rise3d * velocity;

        }        

        if (_this.is3D === true) {

            newY = _camera.position.y + adjustmentY;
            newZ = _camera.position.z + adjustmentZ;

        } else {

            newY = _camera.position.y + (adjustmentY * 1.5); // bump up 2D Y move to make it snappier
            newZ = _camera.position.z;

        }

        //console.log({ 'newY': newY, 'newZ': newZ });
 
        if ((_this.is3D === true && newZ != _camera.position.z) ||
            (_this.is3D === false && newY != _camera.position.y)) {
            
            TWEEN.removeAll();

            new TWEEN.Tween(_camera.position)
                    .to({ z: newZ, y: newY }, _moveDuration)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

            new TWEEN.Tween(this)
                .to({}, _moveDuration)
                .onUpdate(_renderFunction)
                .onComplete(function() {
                    _this.disabled = false;
                })
                .start();

        }


    }


    this.reset = function (options, camera, renderFunction, swipeAreaContainer, moveDuration, hammer) {

        //
        // destroy current event bindings
        //
        _hammer.off('swipeup', _swipeAreaContainer, onSwipeUp);
        _hammer.off('swipedown', _swipeAreaContainer, onSwipeDown);

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