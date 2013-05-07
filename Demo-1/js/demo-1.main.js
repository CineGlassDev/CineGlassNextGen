﻿/** @namespaces */
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
        offsetZ: 1125,
        rise3d: 425,
        initial3dCameraX: 0,
        initial3dCameraY: -117,
        initial3dCameraZ: 5128,
        initial2dCameraX: 0,
        initial2dCameraY: 400,
        initial2dCameraZ: 6500
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

    var _transformOptions;
    var _isCurrentView3D = true;
    var _currentVectorKey = null;
    var _currentTileObjects = null;


    //
    // jQuery cache variables
    //

    $viewport = $('#viewport');
    $backNav = $('#backNav');



    //////////////////////////////////
    //////////////////////////////////
    /////  START OF FUNCTIONS  ///////
    //////////////////////////////////
    //////////////////////////////////


    function initialize() {

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

        //
        // kick off the 3D movies by default
        //        
        var controlsOptions = getControlsOptions('catalog', true);
        tileControls = new CG.TileControls(controlsOptions);
        setTransformOptions('catalog');
        transform(_tileObjects.movieObjects, 'catalog', 1500);

    }

    function initializeTilesAndVectors() {

        var studioData = CG.Demo1.DemoData();

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

        // change page background to use studio's logo
        $viewport.css('background-image', 'url("' + studioData.logo + '")');

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
        scene.add(css3dObject);

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
                scene.add(css3dObject);

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
                scene.add(css3dObject);

                // add asset object to array
                assetObjects.push(css3dObject);

                // cache asset object on asset tile
                tile.parentObject = css3dObject;

                assetVectorCount++;
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
        var tileOffsetWidth = (objectDims.width + vectorOptions.offsetX);
        var rowCount = Math.ceil(vectorCount / vectorsPerRow);
        var finalRowCount = vectorCount % vectorsPerRow;
        var vectorCounter = 0;

        var firstLeft;

        if (vectorsPerRow % 2 === 0) {

            firstLeft = (Math.floor(vectorsPerRow / 2) * tileOffsetWidth - (tileOffsetWidth / 2)) * -1;

        } else {

            firstLeft = Math.floor(vectorsPerRow / 2) * tileOffsetWidth * -1;

        }

        for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {

            var y3d = ((rowIndex % rowCount) * (vectorOptions.offsetY + vectorOptions.rise3d)) - ((vectorOptions.offsetY + vectorOptions.rise3d) * 2);
            var z3d = (vectorOptions.offsetZ * rowIndex) * -1;
            var y2d = ((objectDims.height + vectorOptions.offsetY) * Math.floor(rowCount / 2)) - ((rowIndex % rowCount) * (objectDims.height + vectorOptions.offsetY));

            var x = firstLeft;

            for (var objectIndex = 0; objectIndex < vectorsPerRow; objectIndex++) {

                //
                // 3D vectors
                //
                var vector3D = new THREE.Object3D();
                vector3D.position.x = x;
                vector3D.position.y = y3d;
                vector3D.position.z = z3d;
                vectorCache.threeD.push(vector3D);


                //
                // 2D vectors
                //
                var vector2D = new THREE.Object3D();
                vector2D.position.x = x;
                vector2D.position.y = y2d;
                vector2D.position.z = 0;
                vectorCache.twoD.push(vector2D);

                x += tileOffsetWidth;

                vectorCounter++;
            }
        }
    }
    
    function toggle2D3D(isTo3D, duration) {

        if (tileControls.disabled === true) {
            return;
        }

        if (isTo3D && _isCurrentView3D ||
            !isTo3D && !_isCurrentView3D) {
            // erroneous request
            return;
        }

        tileControls.is3D = isTo3D;
        tileControls.disabled = true;

        TWEEN.removeAll();

        var toVectors;
        
        if (isTo3D) {

            toVectors = _tileVectors[_currentVectorKey].threeD;

        } else {

            toVectors = _tileVectors[_currentVectorKey].twoD;

        }

        var maxDuration = 0;
        var initialPosition = getInitialCameraPosition(isTo3D);

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

			    _isCurrentView3D = isTo3D;
			    tileControls.disabled = false;			    

			})
            .start();

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

                new TWEEN.FadeOut(fromObject.element, duration / 2);

                new TWEEN.Tween(fromObject.position)
                    .to({ x: 0, y: 0, z: 10000 }, duration)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .start();
                 
            }

        }

        var maxDuration = 0;
        var initialPosition = getInitialCameraPosition(_isCurrentView3D);

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

            if (_isCurrentView3D) {
                toVector = _tileVectors[toVectorKey].threeD[index];
            } else {
                toVector = _tileVectors[toVectorKey].twoD[index];
            }

            var tileDuration = Math.random() * duration + duration;
            var fadeDuration = tileDuration * 1.5;
            maxDuration = Math.max(maxDuration, fadeDuration);

            new TWEEN.FadeIn(toObject.element, fadeDuration);

            new TWEEN.Tween(toObject.position)
                .to({ x: toVector.position.x, y: toVector.position.y, z: toVector.position.z }, tileDuration)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();

        }        

        new TWEEN.Tween(document.body)
			.to({}, maxDuration)
			.onUpdate(render)
			.onComplete(function () {

			    _currentVectorKey = toVectorKey;
			    _currentTileObjects = toTileObjects;
			    tileControls.disabled = false;

			    resetCamera();

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

        var initialPosition = getInitialCameraPosition(_isCurrentView3D);

        if (camera.position.x != initialPosition.x ||
            camera.position.y != initialPosition.y ||
            camera.position.z != initialPosition.z) {

            $('#modalscreen').css('visibility', 'hidden');

            tileControls.disabled = true;

            $viewport.itemViewer('hide');

            new TWEEN.Tween(camera.position)
                .to({ x: initialPosition.x, y: initialPosition.y, z: initialPosition.z }, 1500)
                .easing(TWEEN.Easing.Exponential.Out)
                .onUpdate(render)
                .onComplete(function () {
                    tileControls.disabled = false;
                })
                .start();

        }

    }
    
    function disableEvent(event) {

        event.preventDefault();

    }
      
    function calculateVectorsPerRow(vectorCount) {
        if (vectorCount > 15) {
            return 6;
        } else {
            return 3;
        }
    }

    function getDimsFromCss(cssClass) {

        var $temp = $("<div class='" + cssClass + "'></div>").hide().appendTo("body");

        var width = parseInt($temp.css('width'), 10);
        var height = parseInt($temp.css('height'), 10);

        $temp.remove();

        var dims = { 'width': width, 'height': height };

        return dims;

    }

    function setTransformOptions(view) {
        switch (view.toLowerCase()) {
            case 'catalog':
                _transformOptions = _optionsForMovieVectors;
                break;
            case 'department':
                _transformOptions = _optionsForDepartmentVectors;
                break;
            case 'asset':
                _transformOptions = _optionsForAssetVectors;
                break;
        }
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

    function getControlsOptions(view, is3D) {

        var controlsOptions = {
            camera: camera,
            renderFunction: render,
            swipeAreaContainer: $('#viewport'),
            moveDuration: 1000,
            deltaY: 200,
            deltaZ: 900,
            is3D: is3D
        };

        switch (view.toLowerCase()) {
            case 'catalog':
                controlsOptions.deltaY = 300;
                controlsOptions.detlaZ = 1200;
                break;
            case 'department':
                controlsOptions.deltaY = 200;
                controlsOptions.detlaZ = 900;
                break;
            case 'asset':
                controlsOptions.deltaY = 200;
                controlsOptions.detlaZ = 900;
                break;
        }

        return controlsOptions;
    }

    function formatDate(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }

    function onWindowResize() {

        $('#modalscreen').css({
            width: window.innerWidth + 'px', height: window.innerHeight + 'px'
        });

    	camera.aspect = window.innerWidth / window.innerHeight;

    	camera.updateProjectionMatrix();

    	renderer.setSize(window.innerWidth, window.innerHeight);

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

        render();


        if (tileControls.disabled === true) {
            return;
        }

        //
        // if user taps outside tiles, etc. then
        // reset the camera to its default settings
        //				    

        //resetCamera();

    });

    $('#tiles3d').hammer().on('tap', function (event) {

        event.gesture.preventDefault();
        toggle2D3D(true, 800);

    });

    $('#tiles2d').hammer().on('tap', function (event) {

        event.gesture.preventDefault();
        toggle2D3D(false, 800);        

    });
    
    initialize();
    animate();

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