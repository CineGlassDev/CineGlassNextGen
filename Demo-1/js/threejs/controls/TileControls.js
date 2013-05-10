/** @namespace */
var CG = CG || {};

CG.TileControls = function (options, camera, renderFunction, swipeAreaContainer, moveDuration) {

    var _this = this;

    var _options = options;
    var _originalY = camera.position.y;
    var _originalZ = camera.position.z;
    var _camera = camera;
    var _renderFunction = renderFunction;
    var _swipeAreaContainer = swipeAreaContainer;
    var _moveDuration = moveDuration;
    
    this.disabled = false;
    this.is3D = options.is3D;


    //
    // private event functions
    //

    function onSwipeUp(event) {

        event.gesture.preventDefault();
        handleSwipe(true, event.gesture.distance, event.gesture.velocityY);

    }

    function onSwipeDown(event) {

        event.gesture.preventDefault();
        handleSwipe(false, event.gesture.distance, event.gesture.velocityY);

    }

    function initialize() {

        //
        // bind swipe events
        //
        $(_swipeAreaContainer).hammer().on('swipeup', onSwipeUp);
        $(_swipeAreaContainer).hammer().on('swipedown', onSwipeDown);

    }

    function handleSwipe(isUp, distance, velocity) {
        
        if (_this.disabled === true) {
            return;
        }

        _this.disabled = true;

        var adjustmentZ;
        var adjustmentY;
        var newZ;
        var newY;

        if (isUp === true) {                        
            
            adjustmentZ = _options.offsetZ * velocity;
            adjustmentY = _options.rise3d * -1 * velocity;

        } else {            

            adjustmentZ = _options.offsetZ * -1 * velocity;
            adjustmentY = _options.rise3d * velocity;

        }

        newY = _camera.position.y + adjustmentY;

        if (_this.is3D === true) {

            newZ = _camera.position.z + adjustmentZ;

        } else {

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


    //
    // public functions
    //

    this.destroy = function () {

        //
        // unbind swipe events
        //
        $(_swipeAreaContainer).hammer().off('swipeup', onSwipeUp);
        $(_swipeAreaContainer).hammer().off('swipedown', onSwipeDown);

    }

    initialize();

}