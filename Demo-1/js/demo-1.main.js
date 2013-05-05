/** @namespaces */
var CG = CG || {};
CG.Demo1 = CG.Demo1 || {};

CG.Demo1.Views = {
    None: 0,
    Catalog: 1,
    Departments: 2,
    Assets: 3,
    SubAssets: 4
};

CG.Demo1.StartApp = function () {

    var DEFAULT_CAMERA_X = 0;
    var DEFAULT_CAMERA_Y = 0;
    var DEFAULT_CAMERA_Z = 2100;

    var _active3dObject = null;
    var _navBackTo = CG.Demo1.Views.none;
    var _worldCamera;
    var _worldControls;
    var _worldRenderer;
    var _worldScene;

    var _tileObjects = {
        studio: '',
        logo: '',
        budgetUri: '',
        movieObjects: []
    };

    var _tileVectors = {};

    var _optionsForMovieVectors = {
        offsetX: 15,
        offsetY: 15,
        offsetZ: 300,
        rise3d: 150
    };

    var _optionsForDepartmentVectors = {
        offsetX: 15,
        offsetY: 15,
        offsetZ: 300,
        rise3d: 150
    };

    var _optionsForAssetVectors = {
        offsetX: 15,
        offsetY: 15,
        offsetZ: 300,
        rise3d: 150
    };

    var _controlsOptions;
    var _isCurrentView3D = true;
    var _currentVectorKey = null;
    var _currentTileObjects = null;


    //
    // jQuery cache variables
    //

    $vieport = $('#viewport');
    $backNav = $('#backNav');



    //////////////////////////////////
    //////////////////////////////////
    /////  START OF FUNCTIONS  ///////
    //////////////////////////////////
    //////////////////////////////////


    function initialize() {

        // initialize scene
        _worldScene = new THREE.Scene();

        //
        // intialize camera
        //
        _worldCamera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, -5000, 5000);
        _worldCamera.position.x = DEFAULT_CAMERA_X;
        _worldCamera.position.y = DEFAULT_CAMERA_Y;
        _worldCamera.position.z = DEFAULT_CAMERA_Z;

        //
        // initialize the CSS3 renderer
        //
        _worldRenderer = new THREE.CSS3DRenderer();
        _worldRenderer.setSize(window.innerWidth, window.innerHeight);
        _worldRenderer.domElement.style.position = 'absolute';
        $vieport.append(_worldRenderer.domElement);

        // initialize all objects required for 3D rendering
        initializeTilesAndVectors();

        //
        // initialize default tile controls options
        //
        _controlsOptions = {
        	camera: _worldCamera,
        	renderFunction: render,
        	swipeAreaContainer: $('#viewport'),
        	moveDuration: 1000,
        	deltaY: 200,
        	deltaZ: 900, 
        	is3D: true
        };

        //
        // initialize tile controls
        //			
        _worldControls = new CG.TileControls(_controlsOptions);

        // kick off the 3D movies by default
        transform(_tileObjects.movieObjects, 'catalog', 2000);

        console.log(_tileObjects);
        console.log(_tileVectors);

    }

    function initializeTilesAndVectors() {

        var studioData = CG.Demo1.DemoData();

        //
        // cache catalog studio info
        //
        _tileObjects.studio = studioData.name;
        _tileObjects.budgetUri = studioData.budgetUri;
        _tileObjects.logo = studioData.logo;

        // change page background to use studio's logo
        $(document).css('background-image', 'url("' + studioData.logo + '")');

        var catalog = studioData.catalog;
        var movieCount = catalog.length;

        //
        // initialize movie tiles
        //
        for (var index = 0; index < movieCount; index++) {

            var movieData = catalog[index];

            //
            // create a tile for the movie
            //
            var tile = document.createElement('div');
            tile.className = 'movie-tile';
            tile.title = movieData.name;
            tile.movieData = movieData;


            //
            // create phase swatch element
            //
            var swatch = document.createElement('div');
            swatch.className = 'movie-tile phase-swatch ' + movieData.currentPhase.toLowerCase();
            tile.appendChild(swatch);

            //
            // create release date element
            //
            var releaseDate = document.createElement('div');
            releaseDate.className = 'movie-tile release-date';
            releaseDate.textContent = movieData.releaseDate;
            tile.appendChild(releaseDate);

            //
            // create one sheet element
            //
            var oneSheet = document.createElement('div');
            oneSheet.className = 'movie-tile one-sheet';
            oneSheet.style.backgroundImage = "url('" + movieData.oneSheet + "')";
            tile.appendChild(oneSheet);

            //
            // wire-up tap event handler for movie tile
            //
            $(tile).hammer().on('tap', function (event) {

                if (this.movieData.phases != null) {

                    // change page background to one-sheet
                    $(document).css('background-image', 'url("' + this.movieData.oneSheet + '")');

                    // set back nav
                    setBackNav(CG.Views.Catalog, 'Catalog');

                    // TODO:
                    // ---- movie info at top of page
                    // ---- budget button at top of page for movie
                    // ---- transform to department tiles in main area 

                } else {

                    // TODO: Let the user know that there's no phase/department info for this movie

                }

                return false;

            });

            //
            // create a CSS3D object for this movie tile
            // and initialize with a random vector
            //
            var css3dObject = new THREE.CSS3DObject(tile);
            css3dObject.position.x = Math.random() * 4000 - 2000;
            css3dObject.position.y = Math.random() * 4000 - 2000;
            css3dObject.position.z = Math.random() * 4000 - 2000;
            css3dObject.departmentObjects = [];
            _worldScene.add(css3dObject);

            // initialize phase department tiles (this will initialize all downstream tiles as well)
            initializeDepartmentTiles(css3dObject.departmentObjects, movieData.phases);

            // cache CSS3D object on movie tile
            tile.parentObject = css3dObject;

            // cache CSS3D object on master movie array
            _tileObjects.movieObjects.push(css3dObject);
            
        }

        // initialize movie vectors
        var vectorCache = _tileVectors['catalog'] = { twoD: [], threeD: [] };
        var movieDims = getDimsFromCss('.movie-tile');
        initializeVectors(movieCount, vectorCache, _optionsForMovieVectors, movieDims);

    }

    function initializeDepartmentTiles(departmentObjects, phases) {

        if (phases != null) {

            // Development Phase
            initializePhaseDepartmentTiles(departmentObjects, phases.development);

            // Pre-Production Phase
            initializePhaseDepartmentTiles(departmentObjects, phases.preProduction);

            // Production Phase
            initializePhaseDepartmentTiles(departmentObjects, phases.production);

            // Post-Production Phase
            initializePhaseDepartmentTiles(departmentObjects, phases.postProduction);

            // Distribution Phase
            initializePhaseDepartmentTiles(departmentObjects, phases.distribution);

        }

    }

    function initializePhaseDepartmentTiles(departmentObjects, phase) {

        var depts = phase.departments;
        var length = depts.length;

        for (var index = 0; index < length; index++) {

            var dept = depts[index];

            initializePhaseDepartmentTile(
                departmentObjects,
                phase,
                dept);
        }

        // initialize department vectors
        var vectorCache = _tileVectors[phase.name] = { twoD: [], threeD: [] };
        var deptDims = getDimsFromCss('.department-tile');
        initializeVectors(length, vectorCache, _optionsForDepartmentVectors, deptDims);

    }

    function initializePhaseDepartmentTile(departmentObjects, phase, dept) {

        //
        // create a tile for the department
        //
        var tile = document.createElement('div');
        tile.className = 'department-tile';
        tile.title = dept.name;
        tile.assets = dept.assets;

        //
        // create phase swatch element
        //
        var swatch = document.createElement('div');
        swatch.className = 'department-tile phase-swatch ' + phase.name;
        tile.appendChild(swatch);

        //
        // create department name element
        //
        var departmentName = document.createElement('div');
        departmentName.className = 'department-tile name';
        departmentName.textContent = dept.name;
        tile.appendChild(departmentName);

        //
        // create logo element
        //
        var logo = document.createElement('div');
        logo.className = 'department-tile logo';
        logo.style.backgroundImage = "url('" + dept.iconUri + "')";
        tile.appendChild(logo);

        //
        // wire-up tap event handler for department tile
        //
        $(tile).hammer().on('tap', function (event) {

            // set back nav
            setBackNav(CG.Views.Departments, 'Departments');

            // TODO:
            // ---- phase, department name, logo at top of page
            // ---- budget button at top of page for respective phase (if applicable)...incorporate swatch line at top of button
            // ---- transform to asset tiles in main area

            return false;

        });

        //
        // create a CSS3D object for this movie tile
        // and initialize with a random Z vector
        //
        var css3dObject = new THREE.CSS3DObject(tile);
        css3dObject.position.x = 0;
        css3dObject.position.y = 0;
        css3dObject.position.z = Math.random() * 4000 - 2000;
        css3dObject.assetObjects = [];
        _worldScene.add(css3dObject);

        // initialize tiles for this phase department's assets
        initializeAssetTiles(css3dObject.assetObjects, phase, dept);

        // add department object to array
        departmentObjects.push(css3dObject);

        // cache department element on department tile
        tile.parentObject = css3dObject;

    }

    function initializeAssetTiles(assetObjects, phase, dept) {

        var deptName = dept.name;
        var assets = dept.assets;
        var assetsLength = assets.length;
        var categories = {};

        var assetVectorCount = 0;

        for (var index = 0; index < assetsLength; index++) {

            var asset = assets[index];

            if (asset.category.length > 0) {

                if (!categories.hasOwnProperty(asset.category)) {

                    //
                    // create a tile for the asset category
                    //
                    var categoryTile = document.createElement('div');
                    categoryTile.className = 'asset-tile';
                    categoryTile.title = asset.category;

                    //
                    // create phase swatch element
                    //
                    var swatch = document.createElement('div');
                    swatch.className = 'asset-tile phase-swatch ' + phase.name;
                    categoryTile.appendChild(swatch);

                    //
                    // create asset name element
                    //
                    var assetName = document.createElement('div');
                    assetName.className = 'asset-tile name';
                    assetName.textContent = asset.category;
                    categoryTile.appendChild(assetName);

                    var logo = document.createElement('div');
                    logo.className = 'asset-tile logo';
                    logo.style.backgroundImage = getAssetIconUrl('folder');
                    categoryTile.appendChild(logo);

                    //
                    // wire-up tap event handler for category tile
                    //
                    $(categoryTile).hammer().on('tap', function (event) {

                        // set back nav
                        setBackNav(CG.Views.Assets, phase.name + ' - ' + dept.name + ' - ' + this.title);

                        // TODO:
                        // ---- transform to sub-asset tiles in main area        

                        return false;

                    });

                    //
                    // create a CSS3D object for this movie tile
                    // and initialize with a random vector
                    //
                    var css3dObject = new THREE.CSS3DObject(categoryTile);
                    css3dObject.position.x = 0;
                    css3dObject.position.y = 0;
                    css3dObject.position.z = Math.random() * 4000 - 2000;
                    css3dObject.subAssetObjects = [];
                    _worldScene.add(css3dObject);

                    // add category object to array
                    assetObjects.push(css3dObject);

                    // cache category object on category tile
                    categoryTile.parentObject = css3dObject;

                    // temporarily cache categoryTile object
                    categories[asset.category] = css3dObject;

                    // one asset vector needs to be counted
                    // for each unique category
                    assetVectorCount++;
                }

                //
                // create a tile for the sub-asset
                //
                var tile = document.createElement('div');
                tile.className = 'asset-tile';
                tile.title = asset.name;
                tile.asset = asset;

                //
                // create phase swatch element
                //
                var swatch = document.createElement('div');
                swatch.className = 'asset-tile phase-swatch ' + phase.name;
                tile.appendChild(swatch);

                //
                // create asset name element
                //
                var assetName = document.createElement('div');
                assetName.className = 'asset-tile name';
                assetName.textContent = asset.name;
                tile.appendChild(assetName);

                var logo = document.createElement('div');
                logo.className = 'asset-tile logo';
                logo.style.backgroundImage = getAssetIconUrl(asset.type);
                tile.appendChild(logo);

                //
                // wire-up tap event handler for department tile
                //
                $(tile).hammer().on('tap', function (event) {

                    // set back nav
                    setBackNav(CG.Views.Assets, phase.name + ' - ' + dept.name);

                    // TODO:
                    // ---- display dialog with asset name and asset preview
                    // create logo element
                    //                    

                    return false;

                });

                //
                // create a CSS3D object for this movie tile
                // and initialize with a random vector
                //
                var css3dObject = new THREE.CSS3DObject(tile);
                css3dObject.position.x = 0;
                css3dObject.position.y = 0;
                css3dObject.position.z = Math.random() * 4000 - 2000;
                _worldScene.add(css3dObject);

                // add sub-asset object to array
                categories[asset.category].subAssetObjects.push(tile);

                // cache asset object on asset tile
                tile.parentObject = css3dObject;

            } else {

                //
                // create a tile for the asset
                //
                var tile = document.createElement('div');
                tile.className = 'asset-tile';
                tile.title = asset.name;
                tile.asset = asset;

                //
                // create phase swatch element
                //
                var swatch = document.createElement('div');
                swatch.className = 'asset-tile phase-swatch ' + phase.name;
                tile.appendChild(swatch);

                //
                // create asset name element
                //
                var assetName = document.createElement('div');
                assetName.className = 'asset-tile name';
                assetName.textContent = asset.name;
                tile.appendChild(assetName);

                var logo = document.createElement('div');
                logo.className = 'asset-tile logo';
                logo.style.backgroundImage = getAssetIconUrl(asset.type);
                tile.appendChild(logo);

                //
                // wire-up tap event handler for department tile
                //
                $(tile).hammer().on('tap', function (event) {

                    // set back nav
                    setBackNav(CG.Views.Assets, phase.name + ' - ' + dept.name);

                    // TODO:
                    // ---- display dialog with asset name and asset preview
                    // create logo element
                    //                    

                    return false;

                });

                //
                // create a CSS3D object for this movie tile
                // and initialize with a random vector
                //
                var css3dObject = new THREE.CSS3DObject(tile);
                css3dObject.position.x = 0;
                css3dObject.position.y = 0;
                css3dObject.position.z = Math.random() * 4000 - 2000;
                _worldScene.add(css3dObject);

                // add asset object to array
                assetObjects.push(css3dObject);

                // cache asset object on asset tile
                tile.parentObject = css3dObject;

                assetVectorCount++;
            }

            // initialize asset vectors
            var assetVectorCache = _tileVectors[phase.name + '|' + deptName] = { twoD: [], threeD: [] };
            var assetDims = getDimsFromCss('.asset-tile');
            initializeVectors(assetVectorCount, assetVectorCache, _optionsForAssetVectors, assetDims);

            //
            // initialize sub-asset vectors for ALL categories
            //
            $.each(categories, function (category, categoryObject) {
                
                var subAssetCount = categoryObject.subAssetObjects.length;

                // initialize sub-asset vectors
                var subAssetVectorCache = _tileVectors[phase.name + '|' + deptName + '|' + category] = { twoD: [], threeD: [] };
                initializeVectors(subAssetCount, subAssetVectorCache, _optionsForAssetVectors, assetDims);

            });

        }

        function setBackNav(view, caption) {

            _navBackTo = view;

            $backNav.attr('title', caption);

            if (view == CG.Demo1.Views.None) {
                $backNav.css('display', 'none');
            } else {
                $backNav.css('display', 'block');
            }

        }

        function navBack() {

            // TODO: Finish implementing

            switch (_navBackTo) {

                case CG.Demo1.Views.Catalog:

                    break;
                case CG.Demo1.Views.Departments:

                    break;
                case CG.Demo1.Views.Assets:

                    break;
                case CG.Demo1.Views.SubAssets:

                    break;
            }

        }

        function getAssetIconUrl(assetType) {
            return ("url('img/icons/" + assetType.toLowerCase() + ".png')");
        }
    }
        
    function initializeVectors(vectorCount, vectorCache, vectorOptions, objectDims) {

        var vectorsPerRow = calculateVectorsPerRow(vectorCount);
        var rowCount = Math.ceil(vectorCount / vectorsPerRow);

        var objectCounter = 0;

        for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {

            if (vectorCount == objectCounter) {
                break;
            }

            var y3d = ((rowIndex % rowCount) * (vectorOptions.offsetY + vectorOptions.rise3d)) - ((vectorOptions.offsetY + vectorOptions.rise3d) * 2);
            var z3d = (vectorOptions.offsetZ * rowIndex) * -1;
            var y2d = ((objectDims.height + vectorOptions.offsetY) * Math.floor(rowCount / 2)) - ((rowIndex % rowCount) * (objectDims.height + vectorOptions.offsetY));

            for (var objectIndex = 0; objectIndex < vectorsPerRow; objectIndex++) {

                //
                // 3D vectors
                //
                var vector3D = new THREE.Object3D();
                vector3D.position.x = ((objectIndex % vectorsPerRow) * (objectDims.width + vectorOptions.offsetX)) - ((objectDims.width + vectorOptions.offsetX) * (vectorsPerRow / 2));
                vector3D.position.y = y3d;
                vector3D.position.z = z3d;
                vectorCache.threeD.push(vector3D);


                //
                // 2D vectors
                //
                var vector2D = new THREE.Object3D();
                vector2D.position.x = ((objectIndex % vectorsPerRow) * (vectorOptions.width + vectorOptions.offsetX)) - ((vectorOptions.width + vectorOptions.offsetX) * (vectorsPerRow / 2));
                vector2D.position.y = y2d;
                vector2D.position.z = 0;
                vectorCache.twoD.push(vector2D);

                objectCounter++;
            }
        }
    }
    
    function toggle2D3D(isTo3D, duration) {

        if (isTo3D && _isCurrentView3D) {
            // erroneous request
            return;
        }

        if (TWEEN.getAll().length > 0) {
            // another transform is in-progress, so try again later...
            setTimeout(function () {
                toggle2D3D(areTogglingTo3D);
            }, 200);

            return;
        }

        _worldControls.disabled = true;

        TWEEN.removeAll();

        var toVectors;
        
        if (isTo3D) {

            toVectors = _tileVectors[_currentVectorKey].threeD;

        } else {

            toVectors = _tileVectors[_currentVectorKey].twoD;

        }

        //
        // tween all of the current tiles to
        // their other dimensions, accordingly
        //

        var vectorLength = toVectors.length;
        for (var index = 0; index < vectorLength; index++) {

            var fromObject = _currentTileObjects[index];
            var toVector = toVectors[index];
            
            new TWEEN.Tween(fromObject.position)
                .to({ x: toVector.position.x, y: toVector.position.y, z: toVector.position.z }, duration)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        }

        new TWEEN.Tween(this)
			.to({}, duration)
			.onUpdate(render)
			.onComplete(function () {

			    _isCurrentView3D = isTo3D;
			    _worldControls.disabled = false;			    

			})
            .start();

    }

    function transform(toTileObjects, toVectorKey, duration) {
        
        if (TWEEN.getAll().length > 0) {
            // another transform is in-progress, so try again later...
            setTimeout(function () {
                transform(toTileObjects, toVectorKey, duration);
            }, 200);

            return;
        }

        _worldControls.disabled = true;

        TWEEN.removeAll();

        if (_currentTileObjects != null) {

            //
            // tween the current tileObjects to vector 0,0,DEFAULT_CAMERA_Z * 2
            //
            var fromLength = _currentTileObjects.length;
            for (var index = 0; index < fromLength; index++) {

                var fromObject = _currentTileObjects[index];

                new TWEEN.Tween(fromObject.position)
                    .to({ x: 0, y: 0, z: DEFAULT_CAMERA_Z * 2 }, duration)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .start();
            }

        }

        //
        // tween the TO tileObjects to their last known vectors
        //
        var toLength = toTileObjects.length;
        for (var index = 0; index < toLength; index++) {

            var toObject = toTileObjects[index];
            var toVector;

            if (_isCurrentView3D) {
                toVector = _tileVectors[toVectorKey].threeD[index];
            } else {
                toVector = _tileVectors[toVectorKey].twoD[index];
            }

            new TWEEN.Tween(toObject.position)
                .to({ x: toVector.position.x, y: toVector.position.y, z: toVector.position.z }, duration)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        }

        new TWEEN.Tween(this)
			.to({}, duration)
			.onUpdate(render)
			.onComplete(function () {

			    _currentVectorKey = toVectorKey;
			    _currentTileObjects = toTileObjects;
			    _worldControls.disabled = false;

			})
            .start();

    }

    function animate() {

        TWEEN.update();
        requestAnimationFrame(animate);
    }

    function render() {

        _worldRenderer.render(_worldScene, _worldCamera);

    }

    function resetCamera() {

        if (_worldCamera.position.x != DEFAULT_CAMERA_X ||
            _worldCamera.position.y != DEFAULT_CAMERA_Y ||
            _worldCamera.position.z != DEFAULT_CAMERA_Z) {

            $('#modalscreen').css('visibility', 'hidden');

            _worldControls.disabled = true;

            $viewport.itemViewer('hide');

            new TWEEN.Tween(_worldCamera.position)
                .to({ x: DEFAULT_CAMERA_X, y: DEFAULT_CAMERA_Y, z: DEFAULT_CAMERA_Z }, 1500)
                .easing(TWEEN.Easing.Exponential.Out)
                .onUpdate(render)
                .onComplete(function () {
                    _worldControls.disabled = false;
                })
                .start();

        }

    }
    
    function disableEvent(event) {

        event.preventDefault();

    }
      
    function calculateVectorsPerRow(vectorCount) {
        if (vectorCount > 15) {
            return 5;
        } else {
            return 3;
        }
    }

    function getDimsFromCss(cssSelector) {

        var width = parseInt($(cssSelector).css('width'), 10);
        var height = parseInt($(cssSelector).css('height'), 10);
        var dims = { 'width': width, 'height': height };
        return dims;

    }

    function onWindowResize() {

        $('#modalscreen').css({
            width: window.innerWidth + 'px', height: window.innerHeight + 'px'
        });

    	_worldCamera.aspect = window.innerWidth / window.innerHeight;

    	_worldCamera.updateProjectionMatrix();

    	_worldRenderer.setSize(window.innerWidth, window.innerHeight);

    	render();
    }

    $(document).on('selectstart', function (event) {
        //
        // cancel selection/highlighting
        //
        return false;
    });

    $(window).on('resize', function (event) {
        onWindowResize();
    });

    $(document).hammer().on('tap', function (event) {

        if (_worldControls.disabled === true) {
            return;
        }

        //
        // if user taps outside tiles, etc. then
        // reset the _worldCamera to its default settings
        //				    

        resetCamera();

    });


    initialize();

}

$(document).ready(function () {
    CG.Demo1.StartApp();
});








//xlsx(URL)
//pdf(EMBED)
//ale(EMBED)
//mp4(EMBED)
//docx(URL)
//eml(URL)


// http://jbk404.site50.net/css3/scrollingmodalwindow/
// http://jbkflex.wordpress.com/2012/07/20/cooler-modal-popup-window-with-fade-effect-gradient-colors-border-drop-shadow-and-center-position/
// http://www.alessioatzeni.com/blog/login-box-modal-dialog-window-with-css-and-jquery/
// http://www.alessioatzeni.com/wp-content/tutorials/jquery/login-box-modal-dialog-window/index.html

// http://jbkflex.wordpress.com/2012/04/21/a-look-at-iscroll-native-way-of-scrolling-content-in-mobile-webkit/