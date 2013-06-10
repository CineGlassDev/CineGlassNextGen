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

CG.Demo1.Toggles = {
    Toggle2D: 1,
    Toggle3D: 2,
    ToggleSchedule: 3
}

CG.Demo1.NotificationCategories = {
    Critical: 1,
    Warning: 2,
    Informational: 3,
    DevelopmentPhase: 4,
    PreProductionPhase: 5,
    ProductionPhase: 6,
    PostProductionPhase: 7,
    DistributionPhase: 8
};


CG.Demo1.StartApp = function () {

    var DEFAULT_CAMERA_X = 0;
    var DEFAULT_CAMERA_Y = 0;
    var DEFAULT_CAMERA_Z = 2100;

    var CATALOG_LABEL = 'Production Portfolio';

    var LS_LAST_NOTIFICATION_UPDATE_KEY = 'last-notification-update';
    var LS_NOTIFICATIONS_KEY = 'notifications';

    var _active3dObject = null;
    var _navBackTo = CG.Demo1.Views.none;
    var camera;
    var tileControls;
    var renderer;
    var scene;

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
        offsetZ: 600,
        rise3d: 250,

        initial3dCameraX: 0,
        initial3dCameraY: -321,
        initial3dCameraZ: 1971,
        initial2dCameraX: 0,
        initial2dCameraY: 0,
        initial2dCameraZ: 2300,
        is3D: true,

        columnCountFor3D: 5,
        rowCountFor2D: 2
    };

    var _optionsForDepartmentVectors = {
        offsetX: 15,
        offsetY: 15,
        offsetZ: 500,
        rise3d: 250,

        initial3dCameraX: 0,
        initial3dCameraY: -321,
        initial3dCameraZ: 1971,
        initial2dCameraX: 0,
        initial2dCameraY: 0,
        initial2dCameraZ: 2300,
        is3D: true,

        columnCountFor3D: 3,
        rowCountFor2D: 2

    };

    var _optionsForAssetVectors = {
        offsetX: 15,
        offsetY: 15,
        offsetZ: 500,
        rise3d: 250,

        initial3dCameraX: 0,
        initial3dCameraY: -321,
        initial3dCameraZ: 1971,
        initial2dCameraX: 0,
        initial2dCameraY: 0,
        initial2dCameraZ: 2300,
        is3D: true,

        columnCountFor3D: 3,
        rowCountFor2D: 2

        //offsetX: 15,
        //offsetY: 15,
        //offsetZ: 550,
        //rise3d: 225,

        //initial3dCameraX: 0,
        //initial3dCameraY: -196,
        //initial3dCameraZ: 2278,
        //initial2dCameraX: 0,
        //initial2dCameraY: 0,
        //initial2dCameraZ: 3300,        
        //is3D: true
    };

    var _transformOptions;
    var _currentVectorKey = null;
    var _currentTileObjects = null;
    var _currentView = CG.Demo1.Views.Catalog;
    var _currentToggle = CG.Demo1.Toggles.Toggle3D;

    var _lastMovieTile;
    var _lastDepartmentTile;
    var _lastAssetTile;
    var _studioData;
    var _itemsToPreload = [];
    var _timeline;
    var _wasLastTileView3D = true;
    var _lastTileView;    
    var _movieSliderSlideDistance = 150;

    // initialize hammer touch event manager
    var _hammer = $(document).hammer({
        swipe_velocity: 0.1
    });

    //
    // jQuery cache variables
    //

    $viewport = $('#viewport');
    $backNav = $('#backNav');
    $details = $('#details-container-inner');
    $timelineContainer = $('#timeline-container');
    $movieSliderThumbnailContainer = $('#movie-slider-thumbnailcontainer');
    $movieSlider = $('#movie-slider');
    $popupBox = $('#popup-box');
    $notificationPanel = $('#notification-panel');

    //////////////////////////////////
    //////////////////////////////////
    /////  START OF FUNCTIONS  ///////
    //////////////////////////////////
    //////////////////////////////////


    function initialize() {

        if (isIDevice() === true) {
            $('#item-viewer-content').css({
                'overflow': 'scroll',
                '-webkit-overflow-scrolling': 'touch'
            });
        } else {
            $('#item-viewer-content').css('overflow', 'hidden');
        }

        // initialize scene
        scene = new THREE.Scene();

        //
        // intialize camera
        //
        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, -5000, 5000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 0;
        

        //
        // initialize the CSS3 renderer
        //
        renderer = new THREE.CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        $viewport.append(renderer.domElement);

        // initialize all objects required for 3D rendering
        initializeTilesAndVectors();
        
        // initialize controls, defaulting to catalog controls
        setTransformOptions(CG.Demo1.Views.Catalog, (_currentToggle == CG.Demo1.Toggles.Toggle3D));
        var options = getTransformOptions();
        tileControls = new CG.TileControls(options, camera, render, $('#viewport'), 1000, _hammer);

        // intialize message panel
        $notificationPanel = $('#notification-panel');
        $notificationPanel.css('top', ($notificationPanel.height() * -1 + 7) + 'px');
        pullNotifications();
        
        // initialize event handlers
        initializeEventHandlers();

        // initialize movie slider
        initializeMovieSlider();

        $('*').cineGlassPreLoader({
            barColor: 'rgba(0,0,0,0.75)',
            percentageColor: 'rgba(255,255,255,0.75)',
            backgroundColor: 'rbga(0,0,0,0.25)',
            percentage: true,
            barHeight: 30,
            completeAnimation: 'grow',
            studioData: _studioData,
            getAssetIconUrlFunction: getAssetIconUrl,
            onComplete: function () {

                //
                // kick off the 3D movies by default
                //     
                showMovieTiles();
                
                $('#product-logo').show();
                $('#details-container').show();
                $('#toggle-menu').show();
                $notificationPanel.show();
                $('#release-notes').show();

                renderDetailsContext(_currentView);

            }
        });       
              
    }

    function initializeTilesAndVectors() {

        var studioData = _studioData = CG.Demo1.DemoData();

        //
        // sort movies by release dates
        //
        studioData.catalog.sort(function (movie1, movie2) {
            if (movie1.releaseDate < movie2.releaseDate) {
                return -1;
            } else if (movie1.releaseDate > movie2.releaseDate) {
                return 1;
            } else {
                return 0;
            }
        });

        //
        // cache catalog studio info
        //
        _tileObjects.studio = studioData.name;
        _tileObjects.budgetUri = studioData.budgetUri;
        _tileObjects.logo = studioData.logo;       

        var catalog = studioData.catalog;
        var movieCount = catalog.length;

        //
        // initialize movie tiles
        //
        for (var index = 0; index < movieCount; index++) {

            var movieData = catalog[index];

            var movieName = movieData.name;

            //
            // create a tile for the movie
            //
            var tile = document.createElement('div');
            tile.className = 'movie-tile';
            tile.title = movieName;
            tile.movieData = movieData;

            //
            // create phase swatch element
            //
            var swatch = document.createElement('div');
            swatch.className = 'phase-swatch ' + movieData.currentPhase.toLowerCase();
            swatch.textContent = movieData.currentPhase;
            tile.appendChild(swatch);

            //
            // create release date element
            //
            var releaseDate = document.createElement('div');
            releaseDate.className = 'movie-tile release-date';
            releaseDate.textContent = formatDate(movieData.releaseDate);
            tile.appendChild(releaseDate);

            //
            // create one sheet element
            //
            var oneSheet = document.createElement('div');
            oneSheet.className = 'movie-tile one-sheet';
            oneSheet.style.backgroundImage = "url('" + movieData.oneSheet + "')";
            tile.appendChild(oneSheet);

            //
            // create a CSS3D object for this movie tile
            // and initialize with a random vector
            //
            var css3dObject = new THREE.CSS3DObject(tile);
            css3dObject.position.x = 0;
            css3dObject.position.y = 0;
            css3dObject.position.z = -10000;
            css3dObject.departmentObjects = [];
            scene.add(css3dObject);

            // initialize phase department tiles (this will initialize all downstream tiles as well)
            initializeDepartmentTiles(movieName, css3dObject.departmentObjects, movieData.phases);

            // cache CSS3D object on movie tile
            tile.parentObject = css3dObject;

            // cache CSS3D object on master movie array
            _tileObjects.movieObjects.push(css3dObject);
            
        }

        // initialize movie vectors
        var vectorCache = _tileVectors['catalog'] = { twoD: [], threeD: [] };
        var movieDims = getDimsFromCss('movie-tile');
        initializeVectors(movieCount, vectorCache, _optionsForMovieVectors, movieDims);

    }

    function initializeDepartmentTiles(movieName, departmentObjects, phases) {

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

            //
            // initialize department vectors
            //
            var vectorLength = (phases.development.departments.length +
                                phases.preProduction.departments.length +
                                phases.production.departments.length +
                                phases.postProduction.departments.length +
                                phases.distribution.departments.length);            
            var vectorCache = _tileVectors[movieName] = { twoD: [], threeD: [] };
            var deptDims = getDimsFromCss('department-tile');
            initializeVectors(vectorLength, vectorCache, _optionsForDepartmentVectors, deptDims);

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

    }

    function initializePhaseDepartmentTile(departmentObjects, phase, dept) {

        //
        // create a tile for the department
        //
        var tile = document.createElement('div');
        tile.className = 'department-tile';
        tile.title = dept.name;
        tile.assets = dept.assets;
        tile.departmentName = dept.name;
        tile.start = dept.start;
        tile.end = dept.end;
        tile.phaseName = phase.name;
        tile.budget = dept.budget;
        tile.costToDate = dept.costToDate;
        tile.efc = dept.efc;

        //
        // create phase swatch element
        //
        var swatch = document.createElement('div');
        swatch.className = 'phase-swatch ' + phase.name.toLowerCase();
        swatch.textContent = phase.name;
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
        logo.style.backgroundImage = "url('" + (typeof dept.iconUri == 'undefined' ? phase.iconUri : dept.iconUri) + "')";

        tile.appendChild(logo);

        //
        // create a CSS3D object for this movie tile
        // and initialize with a random Z vector
        //
        var css3dObject = new THREE.CSS3DObject(tile);
        css3dObject.position.x = 0;
        css3dObject.position.y = 0;
        css3dObject.position.z = -10000;
        css3dObject.assetObjects = [];
        scene.add(css3dObject);

        // initialize tiles for this phase department's assets
        initializeAssetTiles(css3dObject.assetObjects, phase, dept);

        // add department object to array
        departmentObjects.push(css3dObject);

        // cache department element on department tile
        tile.parentObject = css3dObject;

        $(tile).hide();

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
                    categoryTile.className = 'asset-tile category';
                    categoryTile.phaseName = phase.name;
                    categoryTile.departmentName = dept.name;
                    categoryTile.categoryName = asset.category;
                    categoryTile.title = asset.category;

                    //
                    // create phase swatch element
                    //
                    var swatch = document.createElement('div');
                    swatch.className = 'phase-swatch ' + phase.name.toLowerCase();
                    swatch.textContent = phase.name;
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
                    logo.style.backgroundImage = getAssetIconUrl(null);
                    categoryTile.appendChild(logo);

                    //
                    // create a CSS3D object for this movie tile
                    // and initialize with a random vector
                    //
                    var css3dObject = new THREE.CSS3DObject(categoryTile);
                    css3dObject.position.x = 0;
                    css3dObject.position.y = 0;
                    css3dObject.position.z = -10000;
                    css3dObject.subAssetObjects = [];
                    scene.add(css3dObject);

                    // add category object to array
                    assetObjects.push(css3dObject);

                    // cache category object on category tile
                    categoryTile.parentObject = css3dObject;

                    // temporarily cache categoryTile object
                    categories[asset.category] = css3dObject;

                    // one asset vector needs to be counted
                    // for each unique category
                    assetVectorCount++;

                    $(categoryTile).hide();
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
                swatch.className = 'phase-swatch ' + phase.name.toLowerCase();
                swatch.textContent = phase.name;
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
                logo.style.backgroundImage = getAssetIconUrl(asset);

                tile.appendChild(logo);

                //
                // create a CSS3D object for this movie tile
                // and initialize with a random vector
                //
                var css3dObject = new THREE.CSS3DObject(tile);
                css3dObject.position.x = 0;
                css3dObject.position.y = 0;
                css3dObject.position.z = -10000;
                scene.add(css3dObject);

                // add sub-asset object to array
                categories[asset.category].subAssetObjects.push(css3dObject);

                // cache asset object on asset tile
                tile.parentObject = css3dObject;

                $(tile).hide();

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
                swatch.className = 'phase-swatch ' + phase.name.toLowerCase();
                swatch.textContent = phase.name;
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
                logo.style.backgroundImage = getAssetIconUrl(asset);
                tile.appendChild(logo);

                //
                // create a CSS3D object for this movie tile
                // and initialize with a random vector
                //
                var css3dObject = new THREE.CSS3DObject(tile);
                css3dObject.position.x = 0;
                css3dObject.position.y = 0;
                css3dObject.position.z = -10000;
                scene.add(css3dObject);

                // add asset object to array
                assetObjects.push(css3dObject);

                // cache asset object on asset tile
                tile.parentObject = css3dObject;
                tile.phaseName = phase.name;
                tile.departmentName = deptName;

                assetVectorCount++;

                $(tile).hide();

            }

            // initialize asset vectors
            var assetVectorCache = _tileVectors[phase.name + '|' + deptName] = { twoD: [], threeD: [] };
            var assetDims = getDimsFromCss('asset-tile');
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
    }

    function initialize3dVectors(vectorCount, vectorCache, vectorOptions, objectDims) {

        var tileOffsetWidth = (objectDims.width + vectorOptions.offsetX);
        var rowCount = Math.ceil(vectorCount / vectorOptions.columnCountFor3D);
        var finalRowCount = vectorCount % vectorOptions.columnCountFor3D;
        var vectorCounter = 0;

        var firstLeft;

        if (vectorCount === 1) {

            firstLeft = 0;

        } else if (vectorCount === 2) {

            firstLeft = tileOffsetWidth / 2 * -1;

        } else if (vectorOptions.columnCountFor3D % 2 === 0) {

            firstLeft = (Math.floor(vectorOptions.columnCountFor3D / 2) * tileOffsetWidth - (tileOffsetWidth / 2)) * -1;

        } else {

            firstLeft = Math.floor(vectorOptions.columnCountFor3D / 2) * tileOffsetWidth * -1;

        }

        for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {

            var y = ((rowIndex % rowCount) * (vectorOptions.offsetY + vectorOptions.rise3d)) - ((vectorOptions.offsetY + vectorOptions.rise3d) * 2);
            var z = (vectorOptions.offsetZ * rowIndex) * -1;

            var x = firstLeft;

            for (var objectIndex = 0; objectIndex < vectorOptions.columnCountFor3D; objectIndex++) {

                if (vectorCounter == vectorCount) {
                    break;
                }


                var vector = new THREE.Object3D();
                vector.position.x = x;
                vector.position.y = y;
                vector.position.z = z;
                vectorCache.threeD.push(vector);

                x += tileOffsetWidth;

                vectorCounter++;
            }
        }
    }

    function initialize2dVectors(vectorCount, vectorCache, vectorOptions, objectDims) {

        var tileOffsetHeight = (objectDims.height + vectorOptions.offsetY);
        var tileOffsetWidth = (objectDims.width + vectorOptions.offsetX);

        var colCount = Math.ceil(vectorCount / vectorOptions.rowCountFor2D);
        var finalColCount = vectorCount % vectorOptions.rowCountFor2D;

        var vectorCounter = 0;

        var firstTop;

        if (vectorCount <= vectorOptions.rowCountFor2D) {

            firstTop = tileOffsetHeight / 2;

        } else {

            firstTop = tileOffsetHeight * ((vectorOptions.rowCountFor2D - 1) / 2);

        }

        var nextLeft = tileOffsetWidth * ((colCount - 1) / 2) * -1;

        var y = firstTop;        

        for (var objectIndex = 0; objectIndex < vectorOptions.rowCountFor2D; objectIndex++) {

            var x = nextLeft

            if (vectorCounter == vectorCount) {
                break;
            }

            for (var colIndex = 0; colIndex < colCount; colIndex++) {

                if (vectorCounter == vectorCount) {
                    break;
                }                

                var vector = new THREE.Object3D();
                vector.position.x = x;
                vector.position.y = y;
                vector.position.z = 0;
                vectorCache.twoD.push(vector);

                vectorCounter++;

                x += tileOffsetWidth;

            }

            y -= tileOffsetHeight;


        }
    }
    
    function initializeVectors(vectorCount, vectorCache, vectorOptions, objectDims) {

        initialize3dVectors(vectorCount, vectorCache, vectorOptions, objectDims);
        initialize2dVectors(vectorCount, vectorCache, vectorOptions, objectDims);

    }
    
    function initializeEventHandlers() {
        
        $(document).on('selectstart', function (event) {
            //
            // cancel selection/highlighting
            //
            event.preventDefault();
            return false;
        });

        $(window).on('resize orientationchange', function (event) {
            onWindowResize();            
        });       

        //
        // wire-up tap event handler for movie tile
        //
        _hammer.on('tap', '.movie-tile', function (event) {

            event.gesture.preventDefault();

            if (tileControls.disabled === true) {
                return;
            }

            var tile;

            if (event.gesture.target.parentObject) {
                tile = event.gesture.target;
            } else {
                tile = event.gesture.target.parentElement;
            }

            showDepartments(tile);

            return false;

        });

        //
        // wire-up tap event handler for department tile
        //
        _hammer.on('tap', '.department-tile', function (event) {

            event.gesture.preventDefault();

            if (tileControls.disabled === true) {
                return;
            }

            var tile;

            if (event.gesture.target.parentObject) {
                tile = event.gesture.target;
            } else {
                tile = event.gesture.target.parentElement;
            }

            showAssets(tile);

            return false;

        });

        //
        // wire-up tap event handler for category tile
        //
        _hammer.on('tap', '.asset-tile.category', function (event) {

            event.gesture.preventDefault();

            if (tileControls.disabled === true) {
                return;
            }

            var tile;

            if (event.gesture.target.parentObject) {
                tile = event.gesture.target;
            } else {
                tile = event.gesture.target.parentElement;
            }

            showSubAssets(tile);

        });

        //
        // wire-up tap event handler for department tile
        //
        _hammer.on('tap', '.asset-tile', function (event) {

            if (tileControls.disabled === true) {
                return;
            }

            var tile;

            if (event.gesture.target.parentObject) {
                tile = event.gesture.target;
            } else {
                tile = event.gesture.target.parentElement;
            }

            var asset = tile.asset;

            if (typeof asset != 'undefined') {
                showItemViewer(asset.name, asset.assetUri, asset.type);
                event.gesture.preventDefault();
            }

        });

        _hammer.on('tap', '#tiles3d', function (event) {

            event.gesture.preventDefault();

            if (tileControls.disabled === false) {
                toggleView(CG.Demo1.Toggles.Toggle3D, 800);
            }

        });

        _hammer.on('tap', '#tiles2d', function (event) {

            event.gesture.preventDefault();

            if (tileControls.disabled === false) {
                toggleView(CG.Demo1.Toggles.Toggle2D, 800);
            }

        });

        _hammer.on('tap', '#schedule2d', function (event) {

            event.gesture.preventDefault();

            if (tileControls.disabled === false) {
                toggleView(CG.Demo1.Toggles.ToggleSchedule, 800);
            }

        });

        _hammer.on('tap', '#item-viewer-close', function (event) {

            event.gesture.preventDefault();

            hideItemViewer();

            return false;

        });

        _hammer.on('tap', '#details-expand-collapse', function (event) {

            event.gesture.preventDefault();

            if (typeof (Storage) !== "undefined") {

                localStorage.setItem('detailsIsExpanded-' + _currentView, !$('#details-context-wrapper').is(':visible'));
            }

            renderDetailsContext(_currentView);

            return false;

        });

        _hammer.on('tap', '#backNav', function (event) {

            event.gesture.preventDefault();
            navBack();

        });

        _hammer.on('tap', '#release-notes', function (event) {
            event.gesture.preventDefault();
            showItemViewer('CineGlass Release Notes', '../release-notes.txt', 'txt');
        });

        _hammer.on('tap', '#mini-timeline-container', function (event) {
            event.gesture.preventDefault();
            toggleView(CG.Demo1.Toggles.ToggleSchedule, 800);
        });        

        _hammer.on('swipeleft', '#movie-slider-thumbnailcontainer', function (event) {

            event.gesture.preventDefault();
            event.stopPropagation();
            event.gesture.stopPropagation();
            event.gesture.stopDetect();

            console.log('swipeleft');

            var moveDistance = _movieSliderSlideDistance * event.gesture.velocityX;

            var startLeft = $movieSliderThumbnailContainer.position().left;

            new TWEEN.Tween({ x: startLeft })
               .to({ x: startLeft - moveDistance }, 1500)
               .easing(TWEEN.Easing.Exponential.Out)
               .onUpdate(function () {
                   $movieSliderThumbnailContainer.css('transform', 'translateX(' + this.x + 'px)');
               })
               .start();

        });

        _hammer.on('swiperight', '#movie-slider-thumbnailcontainer', function (event) {

            event.gesture.preventDefault();
            event.stopPropagation();
            event.gesture.stopPropagation();
            event.gesture.stopDetect();

            var moveDistance = _movieSliderSlideDistance * event.gesture.velocityX;

            var startLeft = $movieSliderThumbnailContainer.position().left;

            new TWEEN.Tween({ x: startLeft })
               .to({ x: startLeft + moveDistance }, 1500)
               .easing(TWEEN.Easing.Exponential.Out)
               .onUpdate(function () {
                   $movieSliderThumbnailContainer.css('transform', 'translateX(' + this.x + 'px)');
               })
               .start();

        });

        _hammer.on('tap', '#movie-slider-thumbnailcontainer .movie-slider-thumbnail', function (event) {

            event.gesture.preventDefault();

            var thumbnail = event.gesture.target;

            var movieName = thumbnail.getAttribute('movie-name');
            var movieTile = getMovieTile(movieName); 
            var navBackView = (_currentToggle == CG.Demo1.Toggles.ToggleSchedule ? CG.Demo1.Views.CatalogSchedule : CG.Demo1.Views.Catalog);
            
            if (_currentToggle == CG.Demo1.Toggles.ToggleSchedule &&
                movieTile.movieData.phases != null) {

                showDepartments(movieTile, true);
                toggleView(CG.Demo1.Toggles.ToggleSchedule, 800);

            } else {

                showDepartments(movieTile, false);

                if (movieTile.movieData.phases == null) {

                    if (_wasLastTileView3D === true) {
                        _currentToggle = CG.Demo1.Toggles.Toggle3D;
                        toggleView(CG.Demo1.Toggles.Toggle3D, 800);
                    } else {
                        _currentToggle = CG.Demo1.Toggles.Toggle2D;
                        toggleView(CG.Demo1.Toggles.Toggle2D, 800);
                    }

                }

            }

            setBackNav(navBackView, CATALOG_LABEL);
            
        });

        _hammer.on('tap', '#movie-slider', function (event) {

            event.gesture.preventDefault();

            var sliderBottom = window.innerHeight - $movieSlider.position().top - $movieSlider.height();

            if (sliderBottom < 0) {

                new TWEEN.Tween({ x: sliderBottom })
                  .to({ x: 0 }, 800)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .onUpdate(function () {
                      $movieSlider.css('bottom', this.x + 'px');
                  })
                  .start();

            } else {

                new TWEEN.Tween({ x: sliderBottom })
                  .to({ x: -55 }, 800)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .onUpdate(function () {
                      $movieSlider.css('bottom', this.x + 'px');
                  })
                  .start();
            }

        });

        _hammer.on('hold', '.timeline-event-range', function (event) {

            var budgetBars = null;

            if (_lastTileView == CG.Demo1.Views.Catalog) {

                var movieTile = getMovieTile(event.gesture.target.textContent);

                if (movieTile != null) {

                    budgetBars = buildMovieBudgetBars(movieTile.movieData);

                }

            } else {

                // show department budget bars
                console.log('show department budget bars');

                var deptTile = getDepartmentTile(event.gesture.target.textContent);
                
                if (deptTile != null) {

                    budgetBars = buildMovieBudgetBars(deptTile.parentObject.element);

                }                

            }

            var popupWidth;
            var popupHeight;
            
            if (budgetBars != null) {

                budgetBars.style.marginTop = '0px';
                popupHeight = 90;
                popupWidth = 400;

            } else {

                budgetBars = document.createElement('div');
                budgetBars.className = 'no-budget-data';
                budgetBars.textContent = 'No Financial Data Available';
                popupHeight = 20;
                popupWidth = 190;

            }

            showPopUpBox(
                event.gesture.center.pageX,
                event.gesture.center.pageY,
                popupWidth,
                popupHeight,
                budgetBars);

        });

        _hammer.on('release dragstart', '.timeline-event-range', function (event) {

            hidePopUpBox();

        });

        _hammer.on('tap', '#notification-panel-grip', function (event) {
            event.gesture.preventDefault();
            handleNotificationPanelShellTap();
        });
                
    }

    function showMovieTiles(isScheduleView) {
        
        // change page background to use studio's logo

        //$viewport.css('background-image', 'url("' + _tileObjects.logo + '")');

        changeBackgroundImage(_tileObjects.logo, true);

        // hide movie countdown clock
        hideReleaseCountdown();
        hideMovieSlider();

        $details.empty();

        var caption = document.createElement('div');
        caption.id = 'details-caption';
        caption.textContent = _studioData.name;
        $details.append(caption);

        var contextWrapper = document.createElement('div');
        contextWrapper.id = 'details-context-wrapper';
        $details.append(contextWrapper);

        var context = document.createElement('div');
        context.className = 'details-item-info';
        context.textContent = CATALOG_LABEL;
        contextWrapper.appendChild(context);

        var budgetContainer = document.createElement('div');
        budgetContainer.id = 'budget-container';
        contextWrapper.appendChild(budgetContainer);

        var budgetIcon = document.createElement('div');        
        budgetIcon.title = 'Studio Budget';
        budgetIcon.className = 'studio-budget-icon';
        budgetContainer.appendChild(budgetIcon);


        if (_studioData.budgetUri.length > 0) {
            
            budgetIcon.itemSource = _studioData.budgetUri;
            budgetIcon.itemType = _studioData.budgetType;

        } else {

            $(budgetIcon).addClass('icon-disabled');
            budgetIcon.disabled = true;

        }

        $(budgetIcon).hammer().on('tap', function (event) {

            // show studio budget
            showItemViewer(this.title, this.itemSource, this.itemType);

        });

        var budgetLabel = document.createElement('div');
        budgetLabel.className = 'studio-budget-label';
        budgetLabel.textContent = 'Studio Budget';
        budgetContainer.appendChild(budgetLabel);

        //if (!isScheduleView) {

            // set options for rendering
            setTransformOptions(CG.Demo1.Views.Catalog, (_currentToggle == CG.Demo1.Toggles.Toggle3D));
            var options = getTransformOptions();

            // initialize controls
            tileControls.reset(options, camera, render, $('#viewport'), 1000, _hammer);

            // start transformation rendering
            transform(_tileObjects.movieObjects, 'catalog', 500);            
                       
        //}

        // set back nav button
        setBackNav(CG.Demo1.Views.None, '');

        _currentView = CG.Demo1.Views.Catalog;
        _lastTileView = CG.Demo1.Views.Catalog;

        renderDetailsContext(_currentView);
    }

    function showDepartments(movieTile, isScheduleView) {

        _lastMovieTile = movieTile;

        // change page background to one-sheet
        //$viewport.css('background-image', 'url("' + getFileDirectory(movieTile.movieData.oneSheet) + '/original-size/' + getFileName(movieTile.movieData.oneSheet) + '")');
        var imgUrl = getFileDirectory(movieTile.movieData.oneSheet) + '/original-size/' + getFileName(movieTile.movieData.oneSheet);
        changeBackgroundImage(imgUrl, true);

        // show countdown clock for this movie
        showReleaseCountdown(movieTile.movieData.releaseDate, movieTile.movieData.releaseCountry);

        // show the movie slider
        showMovieSlider();

        // create expander box for movie details
        renderMovieDetails(movieTile);

        if (!isScheduleView) {

            // set options for rendering
            setTransformOptions(CG.Demo1.Views.Departments, (_currentToggle == CG.Demo1.Toggles.Toggle3D));
            var options = getTransformOptions();

            // initialize the controls
            tileControls.reset(options, camera, render, $('#viewport'), 1000, _hammer);

            // start transformation rendering
            transform(movieTile.parentObject.departmentObjects, movieTile.movieData.name, 500);

            // set back nav button
            setBackNav(CG.Demo1.Views.Catalog, CATALOG_LABEL);
            

        } else {

            // set back nav button
            setBackNav(CG.Demo1.Views.CatalogSchedule, CATALOG_LABEL);

        }

        _currentView = CG.Demo1.Views.Departments;
        _lastTileView = CG.Demo1.Views.Departments;

        renderDetailsContext(_currentView);
    }

    function renderMovieDetails(movieTile) {

        $details.empty();

        var caption = document.createElement('div');
        caption.id = 'details-caption';
        caption.textContent = movieTile.movieData.name;
        $details.append(caption);

        var phaseCaption = document.createElement('div');
        phaseCaption.className = 'details-item-phase ' + movieTile.movieData.currentPhase.toLowerCase();
        phaseCaption.textContent = 'In ' + movieTile.movieData.currentPhase;
        $details.append(phaseCaption);

        if (movieTile.movieData.trailerUrl != null) {

            // add button to play trailer
            var trailerButton = document.createElement('div');
            trailerButton.id = 'details-trailer-button';
            trailerButton.title = '"' + movieTile.movieData.name + '" Trailer';
            trailerButton.itemSource = movieTile.movieData.trailerUrl;
            trailerButton.itemType = 'mov';
            $details.append(trailerButton);

            $(trailerButton).hammer().on('tap', function (event) {

                // show post budget
                showItemViewer(this.title, this.itemSource, this.itemType);

            });
            

        }

        var contextWrapper = document.createElement('div');
        contextWrapper.id = 'details-context-wrapper';
        $details.append(contextWrapper);

        //
        // build mini-timeline
        //
        var miniTimeline = buildMovieMiniTimeline(movieTile.movieData);
        if (miniTimeline != null) {
            contextWrapper.appendChild(miniTimeline);
        }

        var context = document.createElement('div');
        context.className = 'details-item-info';
        context.textContent = movieTile.movieData.genre + '  -  ' + formatDate(movieTile.movieData.releaseDate) + ' (' + movieTile.movieData.releaseCountry + ')';
        contextWrapper.appendChild(context);

        var directorsDiv = document.createElement('div');
        directorsDiv.className = 'details-item-cast';
        contextWrapper.appendChild(directorsDiv);
        var directorsLabel = document.createElement('span');
        directorsLabel.className = 'label';
        directorsLabel.textContent = 'Directors:';
        directorsDiv.appendChild(directorsLabel);
        var directorsValue = document.createElement('span');
        directorsValue.className = 'value';
        directorsValue.textContent = movieTile.movieData.topCredits.directors;
        directorsDiv.appendChild(directorsValue);

        var writersDiv = document.createElement('div');
        writersDiv.className = 'details-item-cast';
        contextWrapper.appendChild(writersDiv);
        var writersLabel = document.createElement('span');
        writersLabel.className = 'label';
        writersLabel.textContent = 'Writers:';
        writersDiv.appendChild(writersLabel);
        var writersValue = document.createElement('span');
        writersValue.className = 'value';
        writersValue.textContent = movieTile.movieData.topCredits.writers;
        writersDiv.appendChild(writersValue);

        var starsDiv = document.createElement('div');
        starsDiv.className = 'details-item-cast';
        contextWrapper.appendChild(starsDiv);
        var starsLabel = document.createElement('span');
        starsLabel.className = 'label';
        starsLabel.textContent = 'Stars:';
        starsDiv.appendChild(starsLabel);
        var starsValue = document.createElement('span');
        starsValue.className = 'value';
        starsValue.textContent = movieTile.movieData.topCredits.stars;
        starsDiv.appendChild(starsValue);

        var budgetContainer = document.createElement('div');
        budgetContainer.id = 'budget-container';
        contextWrapper.appendChild(budgetContainer);

        var movieBudgetItem = document.createElement('div');
        movieBudgetItem.className = 'budget-item';
        budgetContainer.appendChild(movieBudgetItem);

        var movieBudgetIcon = document.createElement('div');
        movieBudgetIcon.title = 'Movie Budget';
        movieBudgetIcon.className = 'icon';
        movieBudgetItem.appendChild(movieBudgetIcon);

        if (movieTile.movieData.budgetUri.length > 0) {

            movieBudgetIcon.itemSource = movieTile.movieData.budgetUri;
            movieBudgetIcon.itemType = movieTile.movieData.budgetType;

        } else {

            $(movieBudgetIcon).addClass('icon-disabled');
            movieBudgetIcon.disabled = true;

        }

        $(movieBudgetIcon).hammer().on('tap', function (event) {

            // show movie budget
            showItemViewer(this.title, this.itemSource, this.itemType);

        });

        var movieBudgetLabel = document.createElement('div');
        movieBudgetLabel.className = 'label';
        movieBudgetLabel.textContent = 'Movie Budget';
        movieBudgetItem.appendChild(movieBudgetLabel);

        var prodBudgetItem = document.createElement('div');
        prodBudgetItem.className = 'budget-item';
        budgetContainer.appendChild(prodBudgetItem);

        var prodBudgetIcon = document.createElement('div');
        prodBudgetIcon.title = 'Prod Budget';
        prodBudgetIcon.className = 'icon';
        prodBudgetItem.appendChild(prodBudgetIcon);

        if (movieTile.movieData.phases &&
            movieTile.movieData.phases.production.budgetUri.length > 0) {

            prodBudgetIcon.itemSource = movieTile.movieData.phases.production.budgetUri;
            prodBudgetIcon.itemType = movieTile.movieData.phases.production.budgetType;

        } else {

            $(prodBudgetIcon).addClass('icon-disabled');
            prodBudgetIcon.disabled = true;

        }

        $(prodBudgetIcon).hammer().on('tap', function (event) {

            // show prod budget
            showItemViewer(this.title, this.itemSource, this.itemType);

        });

        var prodBudgetLabel = document.createElement('div');
        prodBudgetLabel.className = 'label';
        prodBudgetLabel.textContent = 'Prod Budget';
        prodBudgetItem.appendChild(prodBudgetLabel);


        var postBudgetItem = document.createElement('div');
        postBudgetItem.className = 'budget-item';
        budgetContainer.appendChild(postBudgetItem);

        var postBudgetIcon = document.createElement('div');
        postBudgetIcon.title = 'Post Budget';
        postBudgetIcon.className = 'icon';
        postBudgetItem.appendChild(postBudgetIcon);

        if (movieTile.movieData.phases && movieTile.movieData.phases.postProduction.budgetUri.length > 0) {

            postBudgetIcon.itemSource = movieTile.movieData.phases.postProduction.budgetUri;
            postBudgetIcon.itemType = movieTile.movieData.phases.postProduction.budgetType;

        } else {

            $(postBudgetIcon).addClass('icon-disabled');
            postBudgetIcon.disabled = true;

        }

        $(postBudgetIcon).hammer().on('tap', function (event) {

            // show post budget
            showItemViewer(this.title, this.itemSource, this.itemType);

        });

        var postBudgetLabel = document.createElement('div');
        postBudgetLabel.className = 'label';
        postBudgetLabel.textContent = 'Post Budget';
        postBudgetItem.appendChild(postBudgetLabel);

        var budgetBars = buildMovieBudgetBars(movieTile.movieData);
        if (budgetBars != null) {
            contextWrapper.appendChild(budgetBars);
        }

    }

    function showAssets(departmentTile) {

        $timelineContainer.fadeOut('slow');
        $viewport.fadeIn('slow');

        _lastDepartmentTile = departmentTile;
        

        $details.empty();

        var phaseCaption = document.createElement('div');
        phaseCaption.className = 'details-item-phase ' + departmentTile.phaseName.toLowerCase();
        phaseCaption.textContent = departmentTile.phaseName;
        $details.append(phaseCaption);

        var caption = document.createElement('div');
        caption.id = 'details-caption';
        caption.textContent = departmentTile.departmentName;
        $details.append(caption);

        var contextWrapper = document.createElement('div');
        contextWrapper.id = 'details-context-wrapper';
        $details.append(contextWrapper);

        var dates = document.createElement('div');
        dates.className = 'details-item-info';
        dates.textContent = formatDate(departmentTile.start) + ' thru ' + formatDate(departmentTile.end);
        contextWrapper.appendChild(dates);
     
        // set options for rendering
        setTransformOptions(CG.Demo1.Views.Assets, (_currentToggle == CG.Demo1.Toggles.Toggle3D));
        var options = getTransformOptions();

        // initialize the controls
        tileControls.reset(options, camera, render, $('#viewport'), 1000, _hammer);

        // start transformation rendering
        transform(departmentTile.parentObject.assetObjects, departmentTile.phaseName + '|' + departmentTile.departmentName, 500);

        // set back nav button
        setBackNav(CG.Demo1.Views.Departments, 'Departments');

        _currentView = CG.Demo1.Views.Assets;
        _lastTileView = CG.Demo1.Views.Assets;

        renderDetailsContext(_currentView);

    }

    function showSubAssets(assetTile) {

        $timelineContainer.fadeOut('slow');
        $viewport.fadeIn('slow');

        _lastAssetTile = assetTile;

        // set options for rendering
        setTransformOptions(CG.Demo1.Views.Assets, (_currentToggle == CG.Demo1.Toggles.Toggle3D));
        var options = getTransformOptions();

        // initialize the controls
        tileControls.reset(options, camera, render, $('#viewport'), 1000, _hammer);

        // start transformation rendering
        transform(assetTile.parentObject.subAssetObjects, assetTile.phaseName + '|' + assetTile.departmentName + '|' + assetTile.categoryName, 500);

        // set back nav button
        setBackNav(CG.Demo1.Views.Assets, assetTile.phaseName + ' - ' + assetTile.departmentName);
    }

    function setBackNav(view, caption) {

        _navBackTo = view;

        $backNav.attr('title', caption);

        var backNav = $backNav.get(0);

        if (view == CG.Demo1.Views.None) {

            if ($backNav.css('display') !== 'none') {
                new TWEEN.FadeOut(backNav, 200);
            }
        } else {
            new TWEEN.FadeIn(backNav, 1000);
        }

    }

    function navBack() {

        if (tileControls.disabled === true) {
            return;
        }

        switch (_navBackTo) {

            case CG.Demo1.Views.Catalog:
                showMovieTiles();
                break;
            case CG.Demo1.Views.Departments:
                showDepartments(_lastMovieTile);
                break;
            case CG.Demo1.Views.Assets:
                showAssets(_lastDepartmentTile);
                break;
            case CG.Demo1.Views.SubAssets:
                showSubAssets(_lastAssetTile);
                break;
            case CG.Demo1.Views.CatalogSchedule:
                showMovieTiles(true);
                toggleView(CG.Demo1.Toggles.ToggleSchedule, 800);
                break;
        }

    }

    function getAssetIconUrl(asset) {
        if (asset === null) {
            return ("url('img/icons/folder.png')");
        } else if (asset.type.toLowerCase() === 'img') {
            return "url('" + getFileDirectory(asset.assetUri) + '/small/' + getFileName(asset.assetUri) + "')";
        } else {
            return ("url('img/icons/" + asset.type.toLowerCase() + ".png')");
        }
    }

    function getEncoding(itemType) {

        switch (itemType.toLowerCase()) {
            case 'mov': return 'video/mpeg';
            case 'doc': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'eml': return 'message/rfc822';
            case 'pdf': return 'application/pdf';
            case 'img': return 'image/png';
            case 'xls': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            case 'txt': return 'text/plain';
            default: return ''
        }

    }

    function getFileDirectory(filePath) {
        if (filePath.indexOf("/") == -1) { // windows
            return filePath.substring(0, filePath.lastIndexOf('\\'));
        }
        else { // unix
            return filePath.substring(0, filePath.lastIndexOf('/'));
        }
    }

    function getFileName(filePath) {
        if (filePath.indexOf("/") == -1) { // windows
            return filePath.substring(filePath.lastIndexOf('\\') + 1);
        }
        else { // unix
            return filePath.substring(filePath.lastIndexOf('/') + 1);
        }
    }    
   
    function toggleView(toggle, duration) {

        if (!_tileVectors[_currentVectorKey]) {
            return;
        }

        var previousToggle = _currentToggle;
        _currentToggle = toggle;

        if (toggle == CG.Demo1.Toggles.ToggleSchedule) {
                       
            hide2D3DView();
            showScheduleView(800);
            
        } else {

            hideScheduleView();

            if (previousToggle == CG.Demo1.Toggles.ToggleSchedule) {
                //
                // need to ensure proper tile level is set
                //

                if (_lastTileView == CG.Demo1.Views.Catalog) {
                    showMovieTiles(false);
                } else {
                    showDepartments(_lastMovieTile, false);
                }
            } else {

                tileControls.disabled = true;

                TWEEN.removeAll();

                var toVectors;

                if (toggle == CG.Demo1.Toggles.Toggle3D) {

                    _wasLastTileView3D = true;
                    tileControls.is3D = true;
                    toVectors = _tileVectors[_currentVectorKey].threeD;

                } else {

                    _wasLastTileView3D = false;
                    tileControls.is3D = false;
                    toVectors = _tileVectors[_currentVectorKey].twoD;

                }

                var maxDuration = 0;
                var initialPosition = getInitialCameraPosition((toggle == CG.Demo1.Toggles.Toggle3D));

                //
                // reset controls
                // 
                setTransformOptions(CG.Demo1.Views.Catalog, (toggle == CG.Demo1.Toggles.Toggle3D));
                var options = getTransformOptions();                
                tileControls.reset(options, camera, render, $('#viewport'), 1000, _hammer);

                if (camera.position.x != initialPosition.x ||
                    camera.position.y != initialPosition.y ||
                    camera.position.z != initialPosition.z) {

                    //
                    // tween camera to it's original position
                    //

                    var cameraDuration = Math.random() * duration + duration;
                    maxDuration = Math.max(maxDuration, cameraDuration);

                    new TWEEN.Tween(camera.position)
                        .to({ x: initialPosition.x, y: initialPosition.y, z: initialPosition.z }, cameraDuration)
                        .easing(TWEEN.Easing.Exponential.Out)
                        .start();
                }

                //
                // tween all of the current tiles to
                // their other dimensions, accordingly
                //

                var vectorLength = toVectors.length;
                for (var index = 0; index < vectorLength; index++) {

                    var tileDuration = Math.random() * duration + duration;
                    maxDuration = Math.max(maxDuration, tileDuration);

                    var fromObject = _currentTileObjects[index];
                    var toVector = toVectors[index];

                    new TWEEN.Tween(fromObject.position)
                        .to({ x: toVector.position.x, y: toVector.position.y, z: toVector.position.z }, tileDuration)
                        .easing(TWEEN.Easing.Exponential.Out)
                        .start();
                }

                new TWEEN.Tween(this)
                    .to({}, maxDuration)
                    .onUpdate(render)
                    .onComplete(function () {

                        camera.updateProjectionMatrix();
                        tileControls.disabled = false;

                    })
                    .start();

            }

        }

    }

    function transform(toTileObjects, toVectorKey, duration) {

        if (tileControls.disabled === true) {
            return;
        }

        tileControls.disabled = true;

        TWEEN.removeAll();

        if (_currentTileObjects != null) {

            //
            // tween the current tileObjects to a vanishing vector
            //
            var fromLength = _currentTileObjects.length;

            for (var index = 0; index < fromLength; index++) {

                var fromObject = _currentTileObjects[index];

                fromObject.position.x = 0;
                fromObject.position.y = 0;
                fromObject.position.z = -10000;

                $(fromObject.element).hide();                
                 
            }

        }

        var maxDuration = 0;
        var initialPosition = getInitialCameraPosition((_currentToggle == CG.Demo1.Toggles.Toggle3D));

        if (camera.position.x != initialPosition.x ||
            camera.position.y != initialPosition.y ||
            camera.position.z != initialPosition.z) {

            //
            // tween camera to it's original position
            //

            var cameraDuration = Math.random() * duration + duration;
            maxDuration = Math.max(maxDuration, cameraDuration);

            new TWEEN.Tween(camera.position)
                .to({ x: initialPosition.x, y: initialPosition.y, z: initialPosition.z }, cameraDuration)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        }

        //
        // tween the TO tileObjects to their last known vectors
        //        
        var toLength = toTileObjects.length;
        for (var index = 0; index < toLength; index++) {

            var toObject = toTileObjects[index];
            var toVector;

            if ((_currentToggle == CG.Demo1.Toggles.Toggle3D)) {
                toVector = _tileVectors[toVectorKey].threeD[index];
            } else {
                toVector = _tileVectors[toVectorKey].twoD[index];
            }

            var tileDuration = Math.random() * duration + duration;
            maxDuration = Math.max(maxDuration, tileDuration);

            new TWEEN.FadeIn(toObject.element, tileDuration);

            new TWEEN.Tween(toObject.position)
                .to({ x: toVector.position.x, y: toVector.position.y, z: toVector.position.z }, tileDuration)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();

        }

        new TWEEN.Tween(this)
			.to({}, maxDuration)
			.onUpdate(render)
			.onComplete(function () {

			    _currentVectorKey = toVectorKey;
			    _currentTileObjects = toTileObjects;

			    camera.updateProjectionMatrix();
			    tileControls.disabled = false;

			})
            .start();

    }

    function animate() {

        requestAnimationFrame(animate);
        TWEEN.update();        

    }

    function render() {
        
        renderer.render(scene, camera);

    }

    function resetCamera() {

        var initialPosition = getInitialCameraPosition((_currentToggle == CG.Demo1.Toggles.Toggle3D));

        if (camera.position.x != initialPosition.x ||
            camera.position.y != initialPosition.y ||
            camera.position.z != initialPosition.z) {

            tileControls.disabled = true;

            $viewport.itemViewer('hide');

            new TWEEN.Tween(camera.position)
                .to({ x: initialPosition.x, y: initialPosition.y, z: initialPosition.z }, 1500)
                .easing(TWEEN.Easing.Exponential.Out)
                .onUpdate(render)
                .onComplete(function () {
                    camera.updateProjectionMatrix();
                    tileControls.disabled = false;
                })
                .start();

        }

    }
    
    function disableEvent(event) {

        event.preventDefault();

    }
      
    function getDimsFromCss(cssClass) {

        var $temp = $("<div class='" + cssClass + "'></div>").hide().appendTo("body");

        var width = parseInt($temp.css('width'), 10);
        var height = parseInt($temp.css('height'), 10);

        $temp.remove();

        var dims = { 'width': width, 'height': height };

        return dims;

    }

    function setTransformOptions(view, is3D) {
        switch (view) {
            case CG.Demo1.Views.Catalog:
                _transformOptions = _optionsForMovieVectors;
                break;
            case CG.Demo1.Views.Departments:
                _transformOptions = _optionsForDepartmentVectors;
                break;
            case CG.Demo1.Views.Assets:
                _transformOptions = _optionsForAssetVectors;
                break;
        }

        _transformOptions.is3D = is3D;

    }

    function getTransformOptions() {
        return _transformOptions;
    }

    function getInitialCameraPosition(is3D) {

        var position = {};
        
        if (is3D) {
            position.x = _transformOptions.initial3dCameraX;
            position.y = _transformOptions.initial3dCameraY;
            position.z = _transformOptions.initial3dCameraZ;
        } else {
            position.x = _transformOptions.initial2dCameraX;
            position.y = _transformOptions.initial2dCameraY;
            position.z = _transformOptions.initial2dCameraZ;
        }

        return position;
    }

    function formatDate(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }

    function formatDateTime(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.toTimeString();
    }

    function onWindowResize() {

        resizeItemViewer();
        redrawTimeline();

    	camera.aspect = window.innerWidth / window.innerHeight;
    	camera.updateProjectionMatrix();

    	renderer.setSize(window.innerWidth, window.innerHeight);

    	render();
    }

    function showItemViewer(caption, itemSrc, itemType) {

        itemType = itemType.toLowerCase();

        var isIpad = isIDevice();

        var useItemViewer = (itemType == 'img' || itemType == 'mov' || itemType == '5th' || itemType == 'content');

        if (useItemViewer) {

            resizeItemViewer();

            $('#item-viewer-header').text(caption);

            var $itemViewer = $('#itemViewer');
            var $videoPlayer = $('#videoPlayer');

            if (itemType == 'img' || itemType == '5th') {

                $videoPlayer.hide();
                $itemViewer.css('background-image', 'url("' + itemSrc + '")');
                $itemViewer.show();

            } else if (itemType == 'content') {

                $videoPlayer.hide();
                $itemViewer.empty();
                $itemViewer.css('background-image', 'none');                
                $itemViewer.append(itemSrc);
                $itemViewer.show();

            } else {

                $itemViewer.hide();
                
                $videoPlayer.attr({
                    poster: 'img/icons/mov.png',
                    src: itemSrc
                });
               
                $videoPlayer.show();
            }            

            $('#item-viewer-dialog').fadeIn(300);

            // add the mask to body
            $('body').append('<div id="item-viewer-mask"></div>');
            $('#item-viewer-mask').fadeIn(300);

        } else {

            window.open(itemSrc, caption);

        }

    }

    function hideItemViewer() {

        // clear the viewer's contents
        $('#itemViewer').attr({
            src: 'about:blank'
        });
        $('#videoPlayer').attr({
            src: ''
        });

        $('#item-viewer-mask, #item-viewer-dialog').fadeOut(300, function () {
            $('#item-viewer-mask').remove();
        });

    }

    function resizeItemViewer() {

        var MARGIN = 24;

        var $dialog = $('#item-viewer-dialog');
        var $header = $('#item-viewer-header');

        var dialogWidth = Math.round(window.innerWidth * 0.85);
        var dialogHeight = Math.round(window.innerHeight * 0.85);

        $dialog.css({
            width: dialogWidth + 'px',
            height: dialogHeight + 'px'
        });

        var contentHeight = dialogHeight - $header.height() - (MARGIN * 2);

        $('#item-viewer-content').css({
            'width': dialogWidth + 'px',
            'height': contentHeight + 'px',
            'line-height': contentHeight + 'px'
        });

        // center align
        var viewerMarginTop = (dialogHeight + MARGIN) / 2;
        var viewerMarginLeft = (dialogWidth + MARGIN) / 2;

        $dialog.css({
            'margin-top': -viewerMarginTop,
            'margin-left': -viewerMarginLeft
        });

    }

    function isIDevice() {

        var isIDevice = navigator.userAgent.match(/iPad/i) != null;

        if (!isIDevice) {

            isIDevice = (
                //Detect iPhone
                (navigator.platform.indexOf("iPhone") != -1) ||
                //Detect iPod
                (navigator.platform.indexOf("iPod") != -1)
            );
        }

        return isIDevice;

    }

    function sortMovieDepartments(movieData, byStart) {
        sortDepartments(movieData.phases.development.departments, byStart);
        sortDepartments(movieData.phases.preProduction.departments, byStart);
        sortDepartments(movieData.phases.production.departments, byStart);
        sortDepartments(movieData.phases.postProduction.departments, byStart);
        sortDepartments(movieData.phases.distribution.departments, byStart);
    }

    function sortDepartments(depts, byStart) {

        if (byStart === true) {
            depts.sort(function (dept1, dept2) {
                if (dept1.start < dept2.start) {
                    return -1;
                } else if (dept1.start > dept2.start) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else {
            depts.sort(function (dept1, dept2) {
                if (dept1.end < dept2.end) {
                    return -1;
                } else if (dept1.end > dept2.end) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }

    }

    function buildMovieMiniTimeline(movieData) {

        if (movieData.phases != null) {

            var phaseSlugs = [];
            var timelineEnd = movieData.releaseDate;
                        
            //
            //
            // determine start date
            //
            //

            // sort all departments by start date
            sortMovieDepartments(movieData, true);
                                    
            var timelineStart = null;
            if (movieData.phases.development.departments.length > 0) {
                
                timelineStart = movieData.phases.development.departments[0].start;

                // sort departments by end date
                sortDepartments(movieData.phases.development.departments, false);

                var phaseEnd = movieData.phases.development.departments[movieData.phases.development.departments.length - 1].end;

                var slug = {
                    phase: 'Development',
                    start: timelineStart,
                    end: phaseEnd
                };

                phaseSlugs.push(slug);

                timelineEnd = (phaseEnd > timelineEnd ? phaseEnd : timelineEnd);

            }
            if (movieData.phases.preProduction.departments.length > 0) {
                
                if (timelineStart == null) {
                    timelineStart = movieData.phases.preProduction.departments[0].start;
                }

                var phaseStart = movieData.phases.preProduction.departments[0].start;
                
                // sort departments by end date
                sortDepartments(movieData.phases.preProduction.departments, false);

                var phaseEnd = movieData.phases.preProduction.departments[movieData.phases.preProduction.departments.length - 1].end;

                var slug = {
                    phase: 'Pre-Production',
                    start: phaseStart,
                    end: phaseEnd
                };

                phaseSlugs.push(slug);

                timelineEnd = (phaseEnd > timelineEnd ? phaseEnd : timelineEnd);

            }
            if (movieData.phases.production.departments.length > 0) {
                
                if (timelineStart == null) {
                    timelineStart = movieData.phases.production.departments[0].start;
                }

                var phaseStart = movieData.phases.production.departments[0].start;

                // sort departments by end date
                sortDepartments(movieData.phases.production.departments, false);

                var phaseEnd = movieData.phases.production.departments[movieData.phases.production.departments.length - 1].end;
                               
                var slug = {
                    phase: 'Production',
                    start: phaseStart,
                    end: phaseEnd
                };

                phaseSlugs.push(slug);

                timelineEnd = (phaseEnd > timelineEnd ? phaseEnd : timelineEnd);

            }
            if (movieData.phases.postProduction.departments.length > 0) {
                
                if (timelineStart == null) {
                    timelineStart = movieData.phases.postProduction.departments[0].start;
                }

                var phaseStart = movieData.phases.postProduction.departments[0].start;

                // sort departments by end date
                sortDepartments(movieData.phases.postProduction.departments, false);

                var phaseEnd = movieData.phases.postProduction.departments[movieData.phases.postProduction.departments.length - 1].end;

                var slug = {
                    phase: 'Post-Production',
                    start: phaseStart,
                    end: phaseEnd
                };

                phaseSlugs.push(slug);

                timelineEnd = (phaseEnd > timelineEnd ? phaseEnd : timelineEnd);

            }
            if (movieData.phases.distribution.departments.length > 0) {

                if (timelineStart == null) {
                    // don't even bother
                    return;
                }

                var phaseStart = movieData.phases.distribution.departments[0].start;

                // sort departments by end date
                sortDepartments(movieData.phases.distribution.departments, false);

                var phaseEnd = movieData.phases.distribution.departments[movieData.phases.distribution.departments.length - 1].end;

                var slug = {
                    phase: 'Distribution',
                    start: phaseStart,
                    end: phaseEnd
                };

                phaseSlugs.push(slug);

                timelineEnd = (phaseEnd > timelineEnd ? phaseEnd : timelineEnd);

            }

            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            //
            // we now have all the data required to build the timeline...so do it!
            //

            var timelineContainer = document.createElement('div');
            timelineContainer.id = 'mini-timeline-container';                        

            var labelStart = document.createElement('div');
            labelStart.id = 'mini-timeline-label-start';
            labelStart.innerHTML = monthNames[timelineStart.getMonth()] + '<br />' + timelineStart.getFullYear();
            timelineContainer.appendChild(labelStart);

            var labelEnd = document.createElement('div');
            labelEnd.id = 'mini-timeline-label-end';
            labelEnd.innerHTML = monthNames[timelineEnd.getMonth()] + '<br />' + timelineEnd.getFullYear();
            timelineContainer.appendChild(labelEnd);

            var markerStart = document.createElement('div');
            markerStart.id = 'mini-timeline-marker-start';
            timelineContainer.appendChild(markerStart);

            var markerMiddle = document.createElement('div');
            markerMiddle.id = 'mini-timeline-marker-middle';
            timelineContainer.appendChild(markerMiddle);

            var markerEnd = document.createElement('div');
            markerEnd.id = 'mini-timeline-marker-end';
            timelineContainer.appendChild(markerEnd);

            var movieTicks = (timelineEnd.getTime() - timelineStart.getTime());
            var phaseSlugLength = phaseSlugs.length;
            var middleMarkerWidth = 356;
            var nextLeft = 22;
            var widthTally = 0;

            for (var index = 0; index < phaseSlugLength; index++) {

                var phaseSlug = phaseSlugs[index];

                //
                // calculate phase width based on its scale
                // in relation to the entire movie start/end dates
                //
                var phaseTicks = (phaseSlug.end.getTime() - phaseSlug.start.getTime());

                var width;

                if (index < (phaseSlugLength - 1)) {
                    width = Math.round(middleMarkerWidth * (phaseTicks / movieTicks));
                    widthTally += width;
                } else {
                    width = middleMarkerWidth - widthTally;
                }                 
                
                var slug = document.createElement('div');
                slug.className = 'mini-timeline-phase timeline-' + phaseSlug.phase.toLowerCase();
                slug.title = phaseSlug.phase;
                slug.style.left = nextLeft + 'px';
                slug.style.width = width + 'px';
                
                timelineContainer.appendChild(slug);
                
                nextLeft += width;

            }
            
            var todayMarker = document.createElement('div');
            todayMarker.id = 'mini-timeline-marker-today';
            var todayTicks = (new Date().getTime() - timelineStart.getTime());
            var todayLeft = Math.round(middleMarkerWidth * (todayTicks / movieTicks));
            todayMarker.style.left = todayLeft + 'px';

            timelineContainer.appendChild(todayMarker);

            var todayLabel = document.createElement('div');
            todayLabel.id = 'mini-timeline-label-today';
            todayLabel.textContent = 'Today';
            todayLabel.style.left = (todayLeft - 13) + 'px';

            timelineContainer.appendChild(todayLabel);

            var releaseMarker = document.createElement('div');
            releaseMarker.id = 'mini-timeline-marker-release';
            var releaseTicks = (movieData.releaseDate.getTime() - timelineStart.getTime());
            var releaseLeft = Math.round(middleMarkerWidth * (releaseTicks / movieTicks));
            releaseMarker.style.left = releaseLeft + 'px';

            timelineContainer.appendChild(releaseMarker);

            var releaseLabel = document.createElement('div');
            releaseLabel.id = 'mini-timeline-label-release';
            releaseLabel.textContent = movieData.releaseCountry + ' Release ' + formatDate(movieData.releaseDate);
            releaseLabel.style.left = (releaseLeft - 29) + 'px';

            timelineContainer.appendChild(releaseLabel);

            return timelineContainer;

        } else {
            return null;
        }

    }

    function buildMovieBudgetBars(movieData) {

        var maxBarWidth = 275;

        if (movieData.budget == null) {
            return null;
        }

        if (movieData.costToDate == null) {
            movieData.costToDate = 0;
        }

        if (movieData.efc == null) {
            movieData.efc = 0;
        }
        
        var barContainer = document.createElement('div');
        barContainer.id = 'budget-bar-container';

        //
        // nested function to create bar row
        //
        var addBarRow = function (container, barName, width, amount) {

            if (width > 0) {

                var barRow = document.createElement('div');
                barRow.className = 'budget-bar-row';
                container.appendChild(barRow);

                var labelLeft = document.createElement('div');
                labelLeft.className = 'budget-bar-label budget-bar-label-left';
                labelLeft.textContent = barName.toUpperCase() + ' : ';
                barRow.appendChild(labelLeft);

                var bar = document.createElement('div');
                bar.id = 'budget-bar-' + barName.toLowerCase();
                bar.className = 'budget-bar';
                bar.style.width = width + 'px';
                barRow.appendChild(bar);

                var labelRight = document.createElement('div');
                labelRight.className = 'budget-bar-label budget-bar-label-right';
                labelRight.textContent = formatDollarsInMillions(amount);
                barRow.appendChild(labelRight);

            }

        }

        //
        // calculate bar lengths
        //

        var budgetBar;
        var ctdBar;
        var efcBar;

        if (movieData.budget > movieData.costToDate &&
            movieData.budget > movieData.efc) {
           
            //
            // budget drives bar length
            //

            budgetBar = maxBarWidth;
            ctdBar = Math.round(maxBarWidth * (movieData.costToDate / movieData.budget));
            efcBar = Math.round(maxBarWidth * (movieData.efc / movieData.budget));


        } else if (movieData.costToDate > movieData.budget &&
                   movieData.costToDate > movieData.efc) {

            //
            // ctd drives bar length
            //

            budgetBar = Math.round(maxBarWidth * (movieData.budget / movieData.costToDate));
            ctdBar = maxBarWidth;
            efcBar = Math.round(maxBarWidth * (movieData.efc / movieData.costToDate));

        } else {

            //
            // efc drives bar length
            //

            budgetBar = Math.round(maxBarWidth * (movieData.budget / movieData.efc));
            ctdBar = Math.round(maxBarWidth * (movieData.costToDate / movieData.efc));
            efcBar = maxBarWidth;            

        } 

        //
        // create/add bar rows
        //
        addBarRow(barContainer, 'bud', budgetBar, movieData.budget);
        addBarRow(barContainer, 'ctd', ctdBar, movieData.costToDate);
        addBarRow(barContainer, 'efc', efcBar, movieData.efc);

        return barContainer;
        
    }

    function formatDollarsInMillions(number) {

        var preciseRound = function (value){
            var decPlaces = 2;
            var val = value * Math.pow(10, decPlaces);
            var fraction = (Math.round((val-parseInt(val))*10)/10);
                        
            if (fraction == -0.5) {

                // enssure proper rounding
                fraction = -0.6;

            }

            val = Math.round(parseInt(val) + fraction) / Math.pow(10, decPlaces);

            return val;
        }

        var millions = preciseRound(number / 1000000);

        if (millions % 1 == 0) {

            // don't show decimals if decimal value is .00
            millions = Math.round(millions);

        }

        return '$' + millions + 'M';

    }

    function renderDetailsContext(view) {

        var $container = $('#details-container');
        var $icon = $('#details-expand-collapse');
        var $context = $('#details-context-wrapper');

        var isExpanded = true;

        if (typeof (Storage) !== "undefined") {
            isExpanded =(localStorage.getItem('detailsIsExpanded-' + view) == 'true');
        }

        if (isExpanded) {
            $container.css('height', 'auto');
            $icon.css('background-image', 'url("../img/icons/collapse.png")');
            $context.show();
        } else {
            $container.css('height', $('#details-caption').height() + $('.details-item-phase').height() + 'px');
            $icon.css('background-image', 'url("../img/icons/expand.png")');
            $context.hide();
        }
    }

    function showReleaseCountdown(releaseDate, releaseCountry) {

        $('#countdown-clock .label').text(releaseCountry.toUpperCase() + ' THEATRICAL RELEASE IN');
        
        $('#countdown-clock').css('opacity', 1);

        $('#countdown-clock').fadeIn('fast');

        $('#countdown-clock').countdown(releaseDate, function (event) {
            $this = $(this);
            switch (event.type) {
                case "days":
                    $this.find('.daysLeft').html(event.value + ' <span class="unit">DAYS</span>');
                    break;
                case "finished":
                    $this.fadeTo('slow', .5);
                    break;
            }
        });

    }

    function hideReleaseCountdown() {

        $('#countdown-clock').fadeOut('fast');

    }

    function getTimelineDataForCatalog(studioData) {

        var timelineData = [];

        var catalogLength = studioData.catalog.length;

        for (var movieIndex = 0; movieIndex < catalogLength; movieIndex++) {

            var movie = studioData.catalog[movieIndex];

            var item = {};
            item['content'] = movie.name;
            item['tooltip'] = movie.name;
            item['terminator'] = getTerminatorUri(movie.status);
            item['className'] = 'timeline-item timeline-' + movie.currentPhase.toLowerCase();

            if (movie.phases) {

                var phaseData = getPhases(movie);
                item['start'] = phaseData[0].start; // first start date in first phase

            } else {

                var start = new Date(movie.releaseDate).setDate(movie.releaseDate.getDate() - 540);
                item['start'] = new Date(start); // releaseDate minus 540 days

            }

            var end = new Date(movie.releaseDate).setDate(movie.releaseDate.getDate() + 90);
            item['end'] = new Date(end); // releaseDate plus 90 days

            timelineData.push(item);
        }

        return timelineData;

    }

    function getTimelineDataForMovie(movie) {

        var timelineData = [];

        //
        // create milestone items
        //
        var milestoneCount = (typeof movie.milestones != 'undefined' ? movie.milestones.length : 0);
        for (var index = 0; index < milestoneCount; index++) {

            var milestoneData = movie.milestones[index];

            var milestone = {};
            milestone['content'] = milestoneData.text;
            milestone['tooltip'] = milestoneData.text;
            milestone['terminator'] = null;
            milestone['className'] = 'future';
            milestone['start'] = milestoneData.date;
            timelineData.push(milestone);

        }

        if (movie.phases) {

            var addItem = function (dept, phase) {

                var item = {};
                item['content'] = dept.name;
                item['tooltip'] = dept.name;
                item['terminator'] = getTerminatorUri(dept.status);
                item['className'] = 'timeline-item timeline-' + phase.toLowerCase();
                item['start'] = dept.start;
                item['end'] = dept.end;

                timelineData.push(item);
            }

            //
            // Development phase departments
            //
            var deptLength = movie.phases.development.departments.length;
            for (var deptIndex = 0; deptIndex < deptLength; deptIndex++) {

                var dept = movie.phases.development.departments[deptIndex];
                addItem(dept, 'development');

            }

            //
            // Pre-Production phase departments
            //
            deptLength = movie.phases.preProduction.departments.length;
            for (var deptIndex = 0; deptIndex < deptLength; deptIndex++) {

                var dept = movie.phases.preProduction.departments[deptIndex];
                addItem(dept, 'pre-production');

            }

            //
            // Production phase departments
            //
            deptLength = movie.phases.production.departments.length;
            for (var deptIndex = 0; deptIndex < deptLength; deptIndex++) {

                var dept = movie.phases.production.departments[deptIndex];
                addItem(dept, 'production');

            }

            //
            // Post-Production phase departments
            //
            deptLength = movie.phases.postProduction.departments.length;
            for (var deptIndex = 0; deptIndex < deptLength; deptIndex++) {

                var dept = movie.phases.postProduction.departments[deptIndex];
                addItem(dept, 'post-production');

            }

            //
            // Distribution phase departments
            //
            deptLength = movie.phases.distribution.departments.length;
            for (var deptIndex = 0; deptIndex < deptLength; deptIndex++) {

                var dept = movie.phases.distribution.departments[deptIndex];
                addItem(dept, 'distribution');

            }

        }

        return timelineData;

    }

    function redrawTimeline() {
        if (typeof _timeline != 'undefined') {
            var range = _timeline.getVisibleChartRange();
            _timeline.setVisibleChartRange(range.start, range.end);

            if (_timeline.dom.contentTimelines.clientHeight == 0) {
                setTimeout(redrawTimeline, 100);
            }
        }
    }

    function getPhases(movieData, min, max) {

        if (movieData.phases != null) {

            var phaseSlugs = [];

            //
            //
            // determine start date
            //
            //

            // sort all departments by start date
            sortMovieDepartments(movieData, true);

            var timelineStart = null;
            if (movieData.phases.development.departments.length > 0) {

                timelineStart = movieData.phases.development.departments[0].start;

                // sort departments by end date
                sortDepartments(movieData.phases.development.departments, false);

                var phaseEnd = movieData.phases.development.departments[movieData.phases.development.departments.length - 1].end;

                var slug = {
                    phase: 'Development',
                    start: timelineStart,
                    end: phaseEnd
                };

                phaseSlugs.push(slug);

            }
            if (movieData.phases.preProduction.departments.length > 0) {

                if (timelineStart == null) {
                    timelineStart = movieData.phases.preProduction.departments[0].start;
                }

                var phaseStart = movieData.phases.preProduction.departments[0].start;

                // sort departments by end date
                sortDepartments(movieData.phases.preProduction.departments, false);

                var phaseEnd = movieData.phases.preProduction.departments[movieData.phases.preProduction.departments.length - 1].end;

                var slug = {
                    phase: 'Pre-Production',
                    start: phaseStart,
                    end: phaseEnd
                };

                phaseSlugs.push(slug);

            }
            if (movieData.phases.production.departments.length > 0) {

                if (timelineStart == null) {
                    timelineStart = movieData.phases.production.departments[0].start;
                }

                var phaseStart = movieData.phases.production.departments[0].start;

                // sort departments by end date
                sortDepartments(movieData.phases.production.departments, false);

                var phaseEnd = movieData.phases.production.departments[movieData.phases.production.departments.length - 1].end;

                var slug = {
                    phase: 'Production',
                    start: phaseStart,
                    end: phaseEnd
                };

                phaseSlugs.push(slug);

            }
            if (movieData.phases.postProduction.departments.length > 0) {

                if (timelineStart == null) {
                    timelineStart = movieData.phases.postProduction.departments[0].start;
                }

                var phaseStart = movieData.phases.postProduction.departments[0].start;

                // sort departments by end date
                sortDepartments(movieData.phases.postProduction.departments, false);

                var phaseEnd = movieData.phases.postProduction.departments[movieData.phases.postProduction.departments.length - 1].end;

                var slug = {
                    phase: 'Post-Production',
                    start: phaseStart,
                    end: phaseEnd
                };

                phaseSlugs.push(slug);

            }
            if (movieData.phases.distribution.departments.length > 0) {

                if (timelineStart == null) {
                    // don't even bother
                    return;
                }

                var phaseStart = movieData.phases.distribution.departments[0].start;

                // sort departments by end date
                sortDepartments(movieData.phases.distribution.departments, false);

                var phaseEnd = movieData.phases.distribution.departments[movieData.phases.distribution.departments.length - 1].end;

                var slug = {
                    phase: 'Distribution',
                    start: phaseStart,
                    end: phaseEnd
                };

                phaseSlugs.push(slug);
            }

            //
            // if applicable, adjust first and last phases so 
            // their start/end dates match timeline
            //
            if (min) {
                phaseSlugs[0].start = min;
            }
            if (max) {
                phaseSlugs[phaseSlugs.length - 1].end = max;
            }

            return phaseSlugs;

        } else {
            return null;
        }

    }

    function getTerminatorUri(status) {

        switch (status) {
            case 'pending':
                return '/img/icons/square-blue.png';
            case 'critical':
                return '/img/icons/diamond-red.png';
            case 'warning':
                return '/img/icons/triangle-yellow.png';
            case 'okay':
                return '/img/icons/circle-green.png';
            case 'inactive':
            default:
                return null;
        }

    }

    function showScheduleView(duration) {

        var timelineOptions = {
            height: "100%",
            axisOnTop: true,
            showPhases: false,
            animate: false,
            animateZoom: false,
            selectable: true,
            editable: false,
            moveable: true,
            showMajorMarker: false
        };

        var timelineData;
        var minDate;
        var maxDate;
        var timelineMin;
        var timelineMax;
        var renderTimeline = true;
               

        if (_currentView == CG.Demo1.Views.Catalog) {

            // show catalog schedule
            timelineData = getTimelineDataForCatalog(_studioData);

            if (timelineData.length > 0) {

                setBackNav(CG.Demo1.Views.None, '');

                _timeline = new links.Timeline(document.getElementById('timeline-container'));

                minDate = new Date(timelineData[0].start).setDate(timelineData[0].start.getDate() - 60);
                maxDate = new Date(timelineData[timelineData.length - 1].end).setDate(timelineData[timelineData.length - 1].end.getDate() + 60);

                timelineMin = new Date(minDate);
                timelineMax = new Date(maxDate);

                _hammer.off('tap', '.timeline-event', onTimelineDepartmentClick);
                _hammer.on('tap', '.timeline-event', onTimelineMovieClick);

            } else {

                renderTimeline = false;

            }            
        } else {

            var milestoneCount = (typeof _lastMovieTile.movieData.milestones != 'undefined' ? _lastMovieTile.movieData.milestones.length : 0);

            // show movie schedule
            timelineData = getTimelineDataForMovie(_lastMovieTile.movieData);

            //
            // check > 3 because three records will be there
            // for the automatic movie milestones
            //
            if (timelineData.length > milestoneCount) {

                setBackNav(CG.Demo1.Views.CatalogSchedule, CATALOG_LABEL);

                _timeline = new links.Timeline(document.getElementById('timeline-container'));

                _hammer.off('tap', '.timeline-event', onTimelineMovieClick);
                _hammer.on('tap', '.timeline-event', onTimelineDepartmentClick);

                renderMovieDetails(_lastMovieTile);
                renderDetailsContext(1);                

                minDate = new Date(timelineData[milestoneCount].start).setDate(timelineData[milestoneCount].start.getDate() - 60); // start at Nth element to allow for milestones
                maxDate = new Date(timelineData[timelineData.length - 1].end).setDate(timelineData[timelineData.length - 1].end.getDate() + 60);
                var releasePlus30 = new Date(_lastMovieTile.movieData.releaseDate).setDate(_lastMovieTile.movieData.releaseDate.getDate() + 60);
                maxDate = (maxDate > releasePlus30 ? maxDate : releasePlus30);

                timelineMin = new Date(minDate);
                timelineMax = new Date(maxDate);

                timelineOptions.phases = getPhases(_lastMovieTile.movieData, timelineMin, timelineMax);
                timelineOptions.showPhases = true;

            } else {

                renderTimeline = false;

            }
        }

        if (renderTimeline) {

            timelineOptions.min = timelineMin;
            timelineOptions.max = timelineMax;
            timelineOptions.start = timelineMin;
            timelineOptions.end = timelineMax;

            _timeline.draw(timelineData, timelineOptions);

            redrawTimeline();

        } else {

            $timelineContainer.hide();

        }
    }

    function hideScheduleView() {

        if ($timelineContainer.css('display') != 'none') {

            $timelineContainer.fadeOut('slow');

        }

        if ($viewport.css('display') == 'none') {

            $viewport.fadeIn('slow');

        }

    }

    function hide2D3DView() {

        if ($viewport.css('display') != 'none') {

            $viewport.fadeOut('slow');            

        }

        if ($timelineContainer.css('display') == 'none') {

            $timelineContainer.fadeIn('slow');

        }


    }

    function onTimelineMovieClick(event) {

        event.gesture.preventDefault();

        var movieName = event.gesture.target.textContent;
        var movieTile = getMovieTile(movieName);
        showDepartments(movieTile, true);
        toggleView(CG.Demo1.Toggles.ToggleSchedule, 800);

    }

    function onTimelineDepartmentClick(event) {

        event.gesture.preventDefault();

        var deptName = event.gesture.target.textContent;
        var deptTile = getDepartmentTile(deptName);

        if (deptTile != null) {            
            var toggle = (_wasLastTileView3D == true ? CG.Demo1.Toggles.Toggle3D : CG.Demo1.Toggles.Toggle2D);
            toggleView(toggle, 800);
            setBackNav(CG.Demo1.Views.Departments, 'Departments');
            showAssets(deptTile);
        }

    }

    function getMovieTile(movieName) {

        var movieTile = null;
        var movieLength = _tileObjects.movieObjects.length;

        for (var movieObjectIndex = 0; movieObjectIndex < movieLength; movieObjectIndex++) {

            var movieObject = _tileObjects.movieObjects[movieObjectIndex];
            var tile = movieObject.element;

            if (tile.movieData.name === movieName) {

                //
                // found the right movie
                //

                movieTile = tile;

                break;
            }

        }

        return movieTile;
    }

    function getDepartmentTile(departmentName) {

        var departmentTile = null;
        var tileLength = _currentTileObjects.length;

        for (var tileIndex = 0; tileIndex < tileLength; tileIndex++) {
            var tile = _currentTileObjects[tileIndex].element;

            if (tile.departmentName) {
                if (tile.departmentName == departmentName) {
                    departmentTile = tile;
                    break;
                }
            } else {
                break;
            }
        }

        if (departmentTile == null) {
            //
            // this probably means that the schedule view was
            // toggled from an asset view...so we've got
            // to do this the hard way
            //

            var movieLength = _tileObjects.movieObjects.length;

            for (var movieObjectIndex = 0; movieObjectIndex < movieLength; movieObjectIndex++) {

                var movieObject = _tileObjects.movieObjects[movieObjectIndex];
                var movieTile = movieObject.element;

                if (movieTile.movieData.name === _lastMovieTile.movieData.name) {

                    //
                    // found the right movie, so now find the right department
                    //

                    if (movieObject.departmentObjects && movieObject.departmentObjects.length > 0) {

                        var deptLength = movieObject.departmentObjects.length;

                        for (var deptIndex = 0; deptIndex < deptLength; deptIndex++) {

                            var deptTile = movieObject.departmentObjects[deptIndex].element;

                            if (deptTile.departmentName == departmentName) {
                                departmentTile = deptTile;
                                break;
                            }

                        }
                    }

                    break;

                }

            }

        }

        return departmentTile;

    }

    function initializeMovieSlider() {

        var container = document.getElementById('movie-slider-thumbnailcontainer');
        var catalog = _studioData.catalog;
        var movieCount = catalog.length;

        //
        // initialize movie tiles
        //
        for (var index = 0; index < movieCount; index++) {

            var movieData = catalog[index];

            var movieName = movieData.name;

            //
            // create a tile for the movie
            //
            var thumbnail = document.createElement('div');
            thumbnail.className = 'movie-slider-thumbnail';
            thumbnail.title = movieName;
            thumbnail.setAttribute('movie-name', movieName);
            thumbnail.style.backgroundImage = "url('" + movieData.oneSheet + "')";

            container.appendChild(thumbnail);
        }
    }

    function showMovieSlider() {
        $movieSlider.show();
    }

    function hideMovieSlider() {
        $movieSlider.hide();
        $movieSlider.css('bottom', '-55px');
    }

    function showPopUpBox(mouseX, mouseY, width, height, contentElement) {

        var BUBBLE_POINT_HEIGHT = 16;
        var VERTICAL_PADDING = 20;

        var showBelow = (mouseY <= (window.innerHeight / 2));

        var left;
        var top;

        if (showBelow === true) {

            $popupBox.removeClass('above');
            $popupBox.addClass('below');
            top = mouseY + BUBBLE_POINT_HEIGHT;
            left = mouseX - (width / 2) - (BUBBLE_POINT_HEIGHT / 2);

        } else {

            $popupBox.removeClass('below');
            $popupBox.addClass('above');
            top = mouseY - BUBBLE_POINT_HEIGHT - VERTICAL_PADDING - height;
            left = mouseX - (width / 2) - (BUBBLE_POINT_HEIGHT / 2);

        }

        $popupBox.empty();
        $popupBox.append(contentElement);
        $popupBox.css({
            'left': left + 'px',
            'top': top + 'px',
            'width': width + 'px',
            'height': height + 'px'
        });
        $popupBox.fadeIn(500);
    }

    function hidePopUpBox() {

        $popupBox.fadeOut(500);

    }

    function changeBackgroundImage(imgUrl, convertToGrayscale) {

        // change page background to use given url
        var $background = $('#pageBackground');
        $background.css('background-image', 'url("' + imgUrl + '")');

        if (convertToGrayscale === true) {

            $background.addClass('grayscale');


        } else {

            $background.removeClass('grayscale');

        }

    }

    function pushNotifications(notifications) {

        // THIS IS THE SOCKET-BASED METHOD OF RECEIVING PUSH NOTIFICATIONS

        // go ahead and determine next last updated timestamp
        // here, so we're sure not to have any window of error
        // for missing future notifications
        var newLastUpdated = new Date();

        // store the incoming notifications
        storeNotifications(newLastUpdated, notifications);

    }

    function pullNotifications() {

        // TODO:
        // 1. Retrieve last notification update timestamp from local storage
        // 2. Pull notifications from server using last notification update timestamp
        // 3. Update last notification update timestamp in local storage
        // 4. Store notifications in local storage
        // 5. if notifications were returned, then show new message indicator on notification bar

        if (typeof (Storage) !== "undefined") {

            // retrieve last notification update timestamp from local storage
            var lastUpdated = localStorage.getItem(LS_LAST_NOTIFICATION_UPDATE_KEY);

            if (typeof lastUpdated == 'undefined') {
                lastUpdated = new Date('1/1/1970');
            }

            // go ahead and determine next last updated timestamp
            // here, so we're sure not to have any window of error
            // for missing future notifications
            var newLastUpdated = new Date();


            //
            // TODO: call server to get latest notifications since last update
            //


            //
            // THIS IS TEMPORARY FOR TESTING
            //
            var notifications = [
                {
                    id: '1',
                    issueDate: new Date('6/6/2014 08:00'),
                    category: CG.Demo1.NotificationCategories.Critical,
                    caption: 'Shoot schedule slipped...',
                    message: 'The shoot schedule has slipped by two weeks because of contract complications and union concerns.  The new shoot date is 10/17/2013.'
                },
                {
                    id: '2',
                    issueDate: new Date('6/6/2014 08:00'),
                    category: CG.Demo1.NotificationCategories.DevelopmentPhase,
                    caption: 'Script Revision #9...',
                    message: 'Script Revision #9 changes include making inciding incident more believable while still hooking the audience.'
                },
                {
                    id: '3',
                    issueDate: new Date('6/7/2014 14:35'),
                    category: CG.Demo1.NotificationCategories.DevelopmentPhase,
                    caption: 'John Smith brought on as co-writer...',
                    message: 'John Smith has been brought on to focus primarily on spicing up the story\'s turning points.'
                }
            ];

            // store the notifications
            storeNotifications(newLastUpdated, notifications);
        }

    }

    function storeNotifications(newTimestamp, notifications) {

        if (notifications != null && notifications.length > 0) {

            // FUTURE: Pull this from server and don't use local storage.

            localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify(notifications));

            // TODO: Set some kind of visual indicator so user knows there's new alerts

        }

        localStorage.setItem(LS_LAST_NOTIFICATION_UPDATE_KEY, newTimestamp.toUTCString());

    }

    function deleteNotificationsByCategory(category) {

        // FUTURE: Perform delete on the server and not from local storage

        var notifications = JSON.parse(localStorage.getItem(LS_NOTIFICATIONS_KEY));

        var originalCount = notifications.length;

        notifications = $.grep(notifications, function (n, i) {

            return (n.category != category);

        });


        if (notifications.length != originalCount) {

            var notificationsSerialized = JSON.stringify(notifications);
            localStorage.setItem(LS_NOTIFICATIONS_KEY, notificationsSerialized);

            showNotificationPanel(true);

        }

    }

    function deleteNotification(notificationId) {

        // FUTURE: Perform delete on the server and not from local storage

        var notifications = JSON.parse(localStorage.getItem(LS_NOTIFICATIONS_KEY));

        var wasDeleted = false;
        var notificationCount = notifications.length;
        for (var index = 0; index < notificationCount; index++) {

            if (notifications[index].id === notificationId) {

                // remove this notification
                notifications.splice(index, 1);

                wasDeleted = true;

                break;

            }

        }

        if (wasDeleted) {
            var notificationsSerialized = JSON.stringify(notifications);
            localStorage.setItem(LS_NOTIFICATIONS_KEY, notificationsSerialized);

            showNotificationPanel(true);
        }

    }

    function hideNotificationPanel() {

        $notificationPanel.animate({
            'top': ($notificationPanel.height() * -1 + 7) + 'px'
        });

    }

    function showNotificationPanel(isAlreadyShowing) {

        // FUTURE: Pull this from server and don't use local storage
        var notifications = JSON.parse(localStorage.getItem(LS_NOTIFICATIONS_KEY));

        var $content = $('#notification-panel-content');

        $content.empty();

        var caption = document.createElement('div');
        caption.id = 'notification-panel-caption';
        caption.textContent = 'CineGlass Notifications';
        $(caption).hammer().on('tap', function (event) {
            event.gesture.preventDefault();
            handleNotificationPanelShellTap();
        });
        $content.append(caption);

        notifications.sort(function (notification1, notification2) {
            if (notification1.category < notification2.category) {
                return -1;
            } else if (notification1.category > notification2.category) {
                return 1;
            } else {
                return 0;
            }
        });

        var lastCategory = -1;
        var notificationsCount = notifications.length;
        for (var index = 0; index < notificationsCount; index++) {

            var notification = notifications[index];

            if (notification.category != lastCategory) {

                var category = document.createElement('div');
                var categoryContent = getNotificationCategoryContent(notification.category);
                category.className = categoryContent.className;
                category.textContent = categoryContent.categoryName;
                $content.append(category);

                var categoryDeleteInitial = document.createElement('img');
                categoryDeleteInitial.className = 'notification-delete-initial';
                categoryDeleteInitial.src = '/img/icons/notification-delete-initial.png';
                category.appendChild(categoryDeleteInitial);
                $(categoryDeleteInitial).hammer().on('tap', function (event) {

                    event.gesture.preventDefault();

                    //
                    // hide initial close and show confirm close
                    //
                    $(event.gesture.target).css('display', 'none');
                    $(event.gesture.target).siblings(0).css('display', 'block');

                });

                var categoryDeleteConfirm = document.createElement('div');
                categoryDeleteConfirm.className = 'notification-delete-confirm';
                categoryDeleteConfirm.category = notification.category;
                categoryDeleteConfirm.textContent = 'Confirm';
                category.appendChild(categoryDeleteConfirm);
                $(categoryDeleteConfirm).hammer().on('tap', function (event) {

                    event.gesture.preventDefault();

                    // delete all messages in this category
                    deleteNotificationsByCategory(event.gesture.target.category);


                });

                lastCategory = notification.category;
            }

            var headline = document.createElement('div');
            headline.className = 'notification-panel-headline';
            headline.textContent = notification.caption;
            headline.notification = notification;
            $content.append(headline);

            var messageDeleteInitial = document.createElement('img');
            messageDeleteInitial.className = 'notification-delete-initial';
            messageDeleteInitial.style.top = '0px';
            messageDeleteInitial.style.right = '8px';
            messageDeleteInitial.src = '/img/icons/notification-delete-initial.png';
            headline.appendChild(messageDeleteInitial);
            $(messageDeleteInitial).hammer().on('tap', function (event) {

                event.gesture.preventDefault();

                //
                // hide initial close and show confirm close
                //
                $(event.gesture.target).css('display', 'none');
                $(event.gesture.target).siblings(0).css('display', 'block');

            });

            var messageDeleteConfirm = document.createElement('div');
            messageDeleteConfirm.className = 'notification-delete-confirm';
            messageDeleteConfirm.textContent = 'Confirm';
            messageDeleteConfirm.messageId = notification.id;
            headline.appendChild(messageDeleteConfirm);
            $(messageDeleteConfirm).hammer().on('tap', function (event) {

                event.gesture.preventDefault();

                // delete message
                deleteNotification(event.gesture.target.messageId);                

            });

            $(headline).hammer().on('tap', function (event) {

                event.gesture.preventDefault();

                if (event.gesture.target.className == 'notification-panel-headline') {

                    var notification = event.gesture.target.notification;
                    var messageContent = buildMessageContent(notification);
                    showItemViewer(notification.caption, messageContent, 'content');

                }

            });

        }

        if (typeof isAlreadyShowing == 'undefined' || isAlreadyShowing == false) {

            $notificationPanel.animate({
                'top': '0px'
            });

        }

    }

    function buildMessageContent(notification) {

        var contentWrapper = document.createElement('div');
        contentWrapper.id = 'notification-message-content';

        var categoryLabel = document.createElement('div');
        categoryLabel.className = 'notification-message-label';
        categoryLabel.textContent = 'Category:';
        contentWrapper.appendChild(categoryLabel);

        var categoryValue = document.createElement('div');
        categoryValue.className = 'notification-message-value';
        var categoryContent = getNotificationCategoryContent(notification.category);
        categoryValue.textContent = categoryContent.categoryName;
        contentWrapper.appendChild(categoryValue);

        var messageDateLabel = document.createElement('div');
        messageDateLabel.className = 'notification-message-label';
        messageDateLabel.textContent = 'Message Date:';
        contentWrapper.appendChild(messageDateLabel);

        var messageDateValue = document.createElement('div');
        messageDateValue.className = 'notification-message-value';
        messageDateValue.textContent = formatDateTime(new Date(notification.issueDate));
        contentWrapper.appendChild(messageDateValue);

        var messageLabel = document.createElement('div');
        messageLabel.className = 'notification-message-label';
        messageLabel.textContent = 'Message:';
        contentWrapper.appendChild(messageLabel);

        var messageValue = document.createElement('div');
        messageValue.className = 'notification-message-value';
        messageValue.textContent = notification.message;
        contentWrapper.appendChild(messageValue);

        var deleteButton = document.createElement('div');
        deleteButton.id = 'notification-message-delete-button';
        deleteButton.className = 'notification-message-button';
        deleteButton.textContent = 'Delete Message';
        $(deleteButton).hammer().on('tap', function (event) {

            event.gesture.preventDefault();

            //
            // hide delete and show confirm
            //
            $(event.gesture.target).css('display', 'none');
            $(event.gesture.target).siblings(0).css('display', 'block');

        });
        contentWrapper.appendChild(deleteButton);

        var confirmButton = document.createElement('div');
        confirmButton.id = 'notification-message-delete-button-confirm';
        confirmButton.className = 'notification-message-button';
        confirmButton.textContent = 'Confirm';
        confirmButton.messageId = notification.id;
        $(confirmButton).hammer().on('tap', function (event) {

            event.gesture.preventDefault();

            // delete message
            deleteNotification(event.gesture.target.messageId);

            hideItemViewer();            

        });
        contentWrapper.appendChild(confirmButton);

        return contentWrapper;

    }

    function getNotificationCategoryContent(notificationCategory) {

        var content = {
            className: '',
            categoryName: ''
        };

        switch (notificationCategory) {

            case CG.Demo1.NotificationCategories.Informational:
                content.categoryName = 'Informational';
                break;
            case CG.Demo1.NotificationCategories.Warning:
                content.categoryName = 'Warning';
                break;
            case CG.Demo1.NotificationCategories.Critical:
                content.categoryName = 'Critical';
                content.className = 'notification-panel-category critical';
                break;
            case CG.Demo1.NotificationCategories.DevelopmentPhase:
                content.categoryName = 'Development';
                content.className = 'phase-swatch development notification-panel-category';
                break;
            case CG.Demo1.NotificationCategories.PreProductionPhase:
                content.categoryName = 'Pre-Production';
                content.className = 'phase-swatch pre-production notification-panel-category';
                break;
            case CG.Demo1.NotificationCategories.ProductionPhase:
                content.categoryName = 'Production';
                content.className = 'phase-swatch production notification-panel-category';
                break;
            case CG.Demo1.NotificationCategories.PostProductionPhase:
                content.categoryName = 'Post-Production';
                content.className = 'phase-swatch post-production notification-panel-category';
                break;
            case CG.Demo1.NotificationCategories.DistributionPhase:
                content.categoryName = 'Distribution';
                content.className = 'phase-swatch distribution notification-panel-category';
                break;

        }

        return content;
    }

    function handleNotificationPanelShellTap() {

        if ($notificationPanel.position().top == 0) {

            hideNotificationPanel();

        } else {

            showNotificationPanel();

        }

    }
    
    initialize();
    resizeItemViewer();
    animate();


}
