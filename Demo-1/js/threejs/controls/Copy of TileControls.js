/** @namespace */
var CG = CG || {};


CG.TileControls = function (options) {

    var _this = this;

    var _options = options;
    var _originalY = options.camera.position.y;
    var _originalZ = options.camera.position.z;
    var _wasSwipe = false;
    var _panY = 0;
    var _lastPanY = 0;
    var _lastPanZ = 0;
    var _panZ = 0;
    var _tileHeight = 0;

    
    this.disabled = false;

    //
    // private utility functions
    //

    function getTile(index) {
        return $(_options.tileObjects[index].element).children('.' + _options.tileSelectorClass + ':first')[0];
    };

    //
    // private event functions
    //

    function onMouseOver(event) {
        
        _wasSwipe = false;
        handleJump(event.toElement.parentElement.parent3dObject);

    }

    function onTap(event) {

        event.gesture.preventDefault();

        _wasSwipe = false;
        handleJump(event.target.parentElement.parent3dObject);

    }

    function onSwipeUp(event) {

        event.gesture.preventDefault();

        _wasSwipe = true;
        handleSwipe(true, event.gesture.distance);

    }

    function onSwipeDown(event) {

        event.gesture.preventDefault();

        _wasSwipe = true;
        handleSwipe(false, event.gesture.distance);

    }

    function initialize() {

        //
        // cache tile height
        //
        if (_options.tileObjects.length > 0) {
            var tile = getTile(0);
            _tileHeight = $(tile).height();
        }

        for (var i = 0; i < _options.tileObjects.length; i++) {

            // set flag to indicate if tile belongs to first row
            _options.tileObjects[i].isFirstRow = (i < options.tilesPerRow);

            var tile = getTile(i);

            // wire-up tile's mouse events
            $(tile).on('mouseover', onMouseOver);

            // wire-up tile's non-swipe touch events
            $(tile).hammer().on('tap', onTap);
        }

        //
        // wire up swipe events
        //
        $(_options.swipeAreaContainer).hammer().on('swipeup', onSwipeUp);
        $(_options.swipeAreaContainer).hammer().on('swipedown', onSwipeDown);

    }

    function handleJump(tileObject) {

        if (this.disabled === true) {
            return;
        }

        var tile = getTile(0);
 
        if (!tileObject.isFirstRow || (($(tile).offset().top + ($(tile).outerHeight() * 1.5)) > window.innerHeight)) {

            //_panZ = tileObject.position.z + (tileObject.position.z * 0.15);
            //_panY = (tileObject.isFirstRow ? 0 : tileObject.position.y + (tileObject.position.y * 0.05));

            _panZ = tileObject.position.z; // - 250;
            _panY = (tileObject.isFirstRow ? 0 : tileObject.position.y + 75);
            _panY = (tileObject.position.y + 0);
        }

    }

    function handleSwipe(isUp, distance) {
        
        if (this.disabled) {
            return;
        }

        var adjustmentZ;
        var adjustmentY;        

        if (isUp === true) {                        
            
            adjustmentZ = 2000;
            adjustmentY = -300;

        } else {            

            adjustmentZ = -2000;
            adjustmentY = 300;
            
        }

        var newZ = Math.min(_originalZ, _options.camera.position.z + adjustmentZ);
        var newY = Math.max(_originalY, _options.camera.position.y + adjustmentY);

        if (newZ > (_originalZ * 2 * -1)) {

            TWEEN.removeAll();

            new TWEEN.Tween(_options.camera.position)
                    .to({ z: newZ, y: newY }, _options.swipeDuration)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .start();

            new TWEEN.Tween(this)
                .to({}, _options.swipeDuration)
                .onUpdate(_options.renderFunction)
                .start();

        }



    }


    //
    // public functions
    //

    this.destroy = function() {

        for (var i = 0; i < _options.tileObjects.length; i++) {

            var tile = getTile(i);

            // un-wire tile's mouse events
            $(tile).off('mousemove', onMouseOver);

            // un-wire tile' non-swipe touch events
            $(tile).hammer().off('tap', onTap);
        }

        //
        // un-wire swipe events
        //
        $(_options.swipeAreaContainer).hammer().off('swipeup', onSwipeUp);
        $(_options.swipeAreaContainer).hammer().off('swipedown', onSwipeDown);

    }

    this.update = function() {

        if (_this.disabled || _lastPanY === _panY || _wasSwipe === true) {
            return;
        }

        var newZ;
        var newY;
        var duration;

        if (_wasSwipe === true) {
            duration = _options.swipeDuration;
        } else {
            duration = _options.jumpDuration;
        }

        if (_options.is3D === true) {

            newZ = _originalZ + _panZ + (window.innerHeight / 2);
            newY = _originalY + _panY + _tileHeight;

		
        } else {
		
            newZ = _originalZ;
            newY = _originalY + (_panY * 0.5);	
            
        }

        TWEEN.removeAll();
	
        new TWEEN.Tween(_options.camera.position)
                .to({ z: newZ, y: newY }, _options.jumpDuration)
                .easing(TWEEN.Easing.Linear.None)
                .start();			

        new TWEEN.Tween( this )
            .to({}, _options.jumpDuration)
            .onUpdate(_options.renderFunction)
            .start();
	
        _lastPanY = _panY;
        _lastPanZ = _panZ;
    }

    initialize();

}


//CG.PanControls = function(camera, tileObjects, tilesPerRow, selectorClass, is3D) {
//	this._camera = camera;
//	this._css3dObjects = options.tileObjects;
//	this._originalY = camera.position.y;
//	this._originalZ = camera.position.z;
//	this._selectorClass = selectorClass;
//	this._is3D = is3D;
//	this._wasSwipe = false;
		
//	// parameters that you can change after initialisation	
//	this.disabled = false;

//	this._panY = 0;
//	this._lastPanY = 0;
//	this._panZ = 0;
//	this._tileHeight = 0;

//	var _this = this;
//	this._$onMouseOver = function(){ _this._onMouseOver.apply(_this, arguments); };
//	this._$onTouchMove = function () { _this._onTouchMove.apply(_this, arguments); };

//	if (this._css3dObjects.length > 0) {
//	    var panElement = $(this._css3dObjects[0].element).children('.' + selectorClass + ':first')[0];
//	    this._tileHeight = $(panElement).height();
//	}

//	for (var i = 0; i < this._css3dObjects.length; i++) {		

//	    this._css3dObjects[i].isFirstRow = (i < options.tilesPerRow);

//	    var panElement = $(this._css3dObjects[i].element).children('.' + selectorClass + ':first')[0];
//	    $(panElement).on('mouseover', this._$onMouseOver);	   
//	    $(panElement).hammer().on('release', this._$onTouchMove);
//	}
//}

//CG.PanControls.prototype.destroy = function() {
//    for (var i = 0; i < this._css3dObjects.length; i++) {

//        var panElement = $(this._css3dObjects[i].element).children('.' + this._selectorClass + ':first')[0];
//        $(panElement).off('mouseover', this._$onMouseOver);
//        $(panElement).hammer().off('release', this._$onTouchMove);
//	}	
//}

//CG.PanControls.prototype.update	= function(event) {	
	
//	if (this.disabled || this._lastPanY === this._panY) {
//		return;
//	}
	
//	TWEEN.removeAll();
	
//	var duration;
//	var newZ;
//	var newY;

//	if (this._is3D === true) {
		
//	    duration = 350;

//	    if (this._wasSwipe) {
//	        newZ = this._camera.position.z + this._panZ;
//	        newY = this._camera.position.y + this._panY;
//	    } else {
//	        newZ = this._originalZ + this._panZ + (window.innerHeight / 2);
//	        newY = this._originalY + this._panY + this._tileHeight;
//	    }
		
//	} else {
		
//		duration = 250;
//		newZ = this._originalZ;
//		newY = this._originalY + (this._panY * 0.5);
		
//	}
	
//	new TWEEN.Tween(this._camera.position)
//			.to( { z: newZ, y: newY }, Math.random() * duration + duration )
//			.easing( TWEEN.Easing.Linear.None )
//			.start();
			

//	new TWEEN.Tween( this )
//		.to( {}, duration * 2 )
//		.onUpdate( render )
//		.start();
	
//	this._lastPanY = this._panY;
//}

//CG.PanControls.prototype._setPan = function(parent3dObject) {
	
//	if (this.disabled) {
//		return;
//	}
	
//	if (!parent3dObject.isFirstRow || camera.position.y != 0) {

//	    var panElement = $(parent3dObject.element).children('.' + this._selectorClass + ':first')[0];
//		this._panZ = parent3dObject.position.z;
//		this._panY = parent3dObject.position.y;

//	}
	
//}

//CG.PanControls.prototype._setSwipePan = function (parent3dObject, direction, distance) {

//    if (this.disabled || direction == Hammer.DIRECTION_LEFT || direction == Hammer.DIRECTION_RIGHT) {
//        return;
//    }

    

//    var yDist = distance * 2;
//    var zDist = distance * 10;  // 10;

//    if (direction == Hammer.DIRECTION_UP) {
//        this._panY -= yDist;
//        this._panZ += zDist;
//    } else {
//        this._panY += yDist;
//        this._panZ -= zDist;
//    }




//        //var panElement = $(parent3dObject.element).children('.' + this._selectorClass + ':first')[0];
//        //this._panZ = parent3dObject.position.z;
//        //this._panY = parent3dObject.position.y;

    

//}

//CG.PanControls.prototype._onMouseOver = function(event) {	
	
//    this._wasSwipe = false;
//	this._setPan(event.toElement.parentElement.parent3dObject);
	
//}


//CG.PanControls.prototype._onTouchMove = function (event) {
//    //if (event.touches.length != 1) return;

//    event.gesture.preventDefault();

//    this._wasSwipe = true;
//    this._setSwipePan(event.target.parentElement.parent3dObject, event.gesture.direction, event.gesture.distance);
//}
