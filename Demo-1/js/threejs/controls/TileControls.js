/** @namespace */
var CG = CG || {};


CG.TileControls = function (options) {

    var _this = this;

    var _options = options;
    var _originalY = options.camera.position.y;
    var _originalZ = options.camera.position.z;
    
    this.disabled = false;


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
        $(_options.swipeAreaContainer).hammer().on('swipeup', onSwipeUp);
        $(_options.swipeAreaContainer).hammer().on('swipedown', onSwipeDown);

    }

    function handleSwipe(isUp, distance, velocity) {
        
        if (_this.disabled) {
            return;
        }

        var adjustmentZ;
        var adjustmentY;
        var newZ;
        var newY;

        if (isUp === true) {                        
            
            adjustmentZ = _options.deltaZ * velocity;
            adjustmentY = _options.deltaY * -1 * velocity;

        } else {            

            adjustmentZ = _options.deltaZ * -1 * velocity;
            adjustmentY = _options.deltaY * velocity;

        }

        newY = _options.camera.position.y + adjustmentY;

        if (_options.is3D === true) {

            newZ = _options.camera.position.z + adjustmentZ;

        } else {

            newZ = _options.camera.position.z;

        }
 
        if ((_options.is3D === true && newZ != _options.camera.position.z) ||
            (_options.is3D === false && newY != _options.camera.position.y)) {
            
            TWEEN.removeAll();

            new TWEEN.Tween(_options.camera.position)
                    .to({ z: newZ, y: newY }, _options.moveDuration)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();

            new TWEEN.Tween(this)
                .to({}, _options.moveDuration)
                .onUpdate(_options.renderFunction)
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
        $(_options.swipeAreaContainer).hammer().off('swipeup', onSwipeUp);
        $(_options.swipeAreaContainer).hammer().off('swipedown', onSwipeDown);

    }

    initialize();

}