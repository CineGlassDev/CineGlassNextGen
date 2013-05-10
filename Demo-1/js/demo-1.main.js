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
        initial2dCameraY: 400,
        initial2dCameraZ: 2300,
        is3D: true
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
        initial2dCameraY: 40,
        initial2dCameraZ: 2300,
        is3D: true

    };

    var _optionsForAssetVectors = {
        offsetX: 15,
        offsetY: 15,
        offsetZ: 550,
        rise3d: 225,

        initial3dCameraX: 0,
        initial3dCameraY: -196,
        initial3dCameraZ: 2278,
        initial2dCameraX: 0,
        initial2dCameraY: 40,
        initial2dCameraZ: 3300,        
        is3D: true
    };

    var _transformOptions;
    var _isCurrentView3D = true;
    var _currentVectorKey = null;
    var _currentTileObjects = null;

    var _lastMovieTile;
    var _lastDepartmentTile;
    var _lastAssetTile;
    var _studioData;

    //
    // jQuery cache variables
    //

    $viewport = $('#viewport');
    $backNav = $('#backNav');
    $details = $('#details-container');


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
        // wire-up event handler for back nav
        //
        $('#backNav').hammer().on('tap', function (event) {
            navBack();
        });

        //
        // kick off the 3D movies by default
        //     
        showMovieTiles();
              
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
            // wire-up tap event handler for movie tile
            //
            $(tile).hammer().on('tap', function (event) {
                var _this = this;

                if (tileControls.disabled === true) {
                    return;
                }

                showDepartments(this);                

                return false;

            });

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
        // wire-up tap event handler for department tile
        //
        $(tile).hammer().on('tap', function (event) {

            if (tileControls.disabled === true) {
                return;
            }

            showAssets(this);

            // TODO:
            // ---- phase, department name, logo at top of page
            // ---- budget button at top of page for respective phase (if applicable)...incorporate swatch line at top of button
            // ---- transform to asset tiles in main area




            //// set back nav
            //setBackNav(CG.Views.Departments, 'Departments');

            

            return false;

        });

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
                    categoryTile.className = 'asset-tile';
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
                    // wire-up tap event handler for category tile
                    //
                    $(categoryTile).hammer().on('tap', function (event) {

                        if (tileControls.disabled === true) {
                            return;
                        }

                        showSubAssets(this);

                        return false;

                    });

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
                // wire-up tap event handler for department tile
                //
                $(tile).hammer().on('tap', function (event) {

                    if (tileControls.disabled === true) {
                        return;
                    }

                    showItemViewer(this.asset.name, this.asset.assetUri, this.asset.type);

                    return false;

                });

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
                // wire-up tap event handler for department tile
                //
                $(tile).hammer().on('tap', function (event) {

                    if (tileControls.disabled === true) {
                        return;
                    }

                    showItemViewer(this.asset.name, this.asset.assetUri, this.asset.type);

                    return false;

                });

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
    
    function initializeVectors(vectorCount, vectorCache, vectorOptions, objectDims) {

        var vectorsPerRow = calculateVectorsPerRow(vectorCount);
        var tileOffsetWidth = (objectDims.width + vectorOptions.offsetX);
        var rowCount = Math.ceil(vectorCount / vectorsPerRow);
        var finalRowCount = vectorCount % vectorsPerRow;
        var vectorCounter = 0;

        var firstLeft;

        if (vectorCount === 1) {

            firstLeft = 0;

        } else if (vectorCount === 2) {

            firstLeft = tileOffsetWidth / 2 * -1;

        } else if (vectorsPerRow % 2 === 0) {

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

                if (vectorCounter == vectorCount) {
                    break;
                }

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

    function showMovieTiles() {
        // change page background to use studio's logo
        $viewport.css('background-image', 'url("' + _tileObjects.logo + '")');

        $details.empty();

        var caption = document.createElement('div');
        caption.id = 'details-caption';
        caption.textContent = _studioData.name;
        $details.append(caption);

        var context = document.createElement('div');
        context.className = 'details-item-info';
        context.textContent = 'Pipeline Catalog';
        $details.append(context);

        var budgetContainer = document.createElement('div');
        budgetContainer.id = 'budget-container';
        $details.append(budgetContainer);

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

        // set options for rendering
        setTransformOptions('catalog', _isCurrentView3D);
        var options = getTransformOptions();

        // initialize controls
        if (tileControls) {
            tileControls.destroy();
        }
        tileControls = new CG.TileControls(options, camera, render, $('#viewport'), 1000);

        // start transformation rendering
        transform(_tileObjects.movieObjects, 'catalog', 1000);

        // set back nav button
        setBackNav(CG.Demo1.Views.None, '');
    }

    function showDepartments(movieTile) {

        _lastMovieTile = movieTile;

        // change page background to one-sheet
        $viewport.css('background-image', 'url("' + getFileDirectory(movieTile.movieData.oneSheet) + '/original-size/' + getFileName(movieTile.movieData.oneSheet) + '")');

        $details.empty();

        var caption = document.createElement('div');
        caption.id = 'details-caption';
        caption.textContent = movieTile.movieData.name;
        $details.append(caption);

        var phaseCaption = document.createElement('div');
        phaseCaption.className = 'details-item-phase ' + movieTile.movieData.currentPhase.toLowerCase();
        phaseCaption.textContent = 'In ' + movieTile.movieData.currentPhase;
        $details.append(phaseCaption);

        var context = document.createElement('div');
        context.className = 'details-item-info';
        context.textContent = movieTile.movieData.genre + '  -  ' + formatDate(movieTile.movieData.releaseDate) + ' (' + movieTile.movieData.releaseCountry + ')';
        $details.append(context);

        var budgetContainer = document.createElement('div');
        budgetContainer.id = 'budget-container';
        $details.append(budgetContainer);

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

        // set options for rendering
        setTransformOptions('department', _isCurrentView3D);
        var options = getTransformOptions();

        // initialize the controls
        tileControls.destroy();
        tileControls = new CG.TileControls(options, camera, render, $('#viewport'), 1000);

        // start transformation rendering
        transform(movieTile.parentObject.departmentObjects, movieTile.movieData.name, 1000);

        // set back nav button
        setBackNav(CG.Demo1.Views.Catalog, 'Pipeline Catalog');

    }

    function showAssets(departmentTile) {

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

        var dates = document.createElement('div');
        dates.className = 'details-item-info';
        dates.textContent = formatDate(departmentTile.start) + ' thru ' + formatDate(departmentTile.end);
        $details.append(dates);
     
        // set options for rendering
        setTransformOptions('asset', _isCurrentView3D);
        var options = getTransformOptions();

        // initialize the controls
        tileControls.destroy();
        tileControls = new CG.TileControls(options, camera, render, $('#viewport'), 1000);

        // start transformation rendering
        transform(departmentTile.parentObject.assetObjects, departmentTile.phaseName + '|' + departmentTile.departmentName, 1000);

        // set back nav button
        setBackNav(CG.Demo1.Views.Departments, 'Departments');

    }

    function showSubAssets(assetTile) {

        _lastAssetTile = assetTile;

        // set options for rendering
        setTransformOptions('asset', _isCurrentView3D);
        var options = getTransformOptions();

        // initialize the controls
        tileControls.destroy();
        tileControls = new CG.TileControls(options, camera, render, $('#viewport'), 1000);

        // start transformation rendering
        transform(assetTile.parentObject.subAssetObjects, assetTile.phaseName + '|' + assetTile.departmentName + '|' + assetTile.categoryName, 1000);

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

        // TODO: Finish implementing

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
            case 'pdf': return 'application/pdf';
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
   
    function toggle2D3D(isTo3D, duration) {

        if (!_tileVectors[_currentVectorKey]) {
            return;
        }

        if (tileControls.disabled === true) {
            return;
        }

        if (isTo3D && _isCurrentView3D ||
            !isTo3D && !_isCurrentView3D) {
            // erroneous request
            return;
        }

        tileControls.disabled = true;
        tileControls.is3D = isTo3D;
        
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

                fromObject.position.x = 0;
                fromObject.position.y = 0;
                fromObject.position.z = -10000;

                $(fromObject.element).hide();                
                 
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

        var initialPosition = getInitialCameraPosition(_isCurrentView3D);

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
            return 5;
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

    function setTransformOptions(view, is3D) {
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

    function onWindowResize() {

        resizeItemViewer();

    	camera.aspect = window.innerWidth / window.innerHeight;

    	camera.updateProjectionMatrix();

    	renderer.setSize(window.innerWidth, window.innerHeight);

    	render();
    }

    function showItemViewer(caption, itemSrc, itemType) {

        itemType = itemType.toLowerCase();

        if (itemType == 'xls' ||
            itemType == 'doc' ||
            itemType == 'eml') {

            window.open(itemSrc, caption);

        } else {

            resizeItemViewer();

            var $dialog = $('#item-viewer-dialog');
            var $header = $('#item-viewer-header');
            var $embed = $('#item-viewer-dialog embed');
            var $imgContainer = $('#imageContainer');
            var $img = $('#item-viewer-content img');

            
            if (itemType == 'img') {
                
                $img.attr({
                    'src' : itemSrc,
                    'alt' : caption,
                    'title' : caption
                });

                $embed.hide();
                $imgContainer.show();

            } else {

                if (itemType == 'txt') {
                    $('#item-viewer-content').css('background-color', 'white');
                } else {
                    $('#item-viewer-content').css('background-color', 'inherit');
                }

                var encodingType = getEncoding(itemType);

                $embed.attr({
                    'src': itemSrc,
                    'type': encodingType
                });               

                $imgContainer.hide();
                $embed.show();

            }

            $header.text(caption);

            $dialog.fadeIn(300);

            // Add the mask to body
            $('body').append('<div id="item-viewer-mask"></div>');
            $('#item-viewer-mask').fadeIn(300);

        }

    }

    function showItemViewer2(caption, itemSrc, itemType) {

        itemType = itemType.toLowerCase();

        if (itemType == 'xls' ||
            itemType == 'doc' ||
            itemType == 'eml') {

            window.open(itemSrc, caption);

        } else {

            resizeItemViewer();

            var $dialog = $('#item-viewer-dialog');
            var $header = $('#item-viewer-header');
            var $embed = $('#item-viewer-dialog embed');
            var $img = $('#item-viewer-dialog img');

            var encodingType = getEncoding(itemType);
            $embed.attr({
                'src': itemSrc,
                'type': encodingType
            });

            $header.text(caption);

            $dialog.fadeIn(300);

            // Add the mask to body
            $('body').append('<div id="item-viewer-mask"></div>');
            $('#item-viewer-mask').fadeIn(300);

        }

    }

    function resizeItemViewer() {

        var MARGIN = 24;

        var $dialog = $('#item-viewer-dialog');
        var $header = $('#item-viewer-header');
        var $imgContainer = $('#imageContainer');
        var $embed = $('#item-viewer-dialog embed');

        var dialogWidth = Math.round(window.innerWidth * 0.85);
        var dialogHeight = Math.round(window.innerHeight * 0.85);

        $dialog.css({
            width: dialogWidth + 'px',
            height: dialogHeight + 'px'
        });

        $imgContainer.css({
            width: dialogWidth + 'px',
            height: dialogHeight - $header.height() - (MARGIN * 2) + 'px'
        });

        $embed.attr({
            'width': dialogWidth, // - (MARGIN * 2),
            'height': dialogHeight - $header.height() - (MARGIN * 2)
        });

        // center align
        var viewerMarginTop = (dialogHeight + MARGIN) / 2;
        var viewerMarginLeft = (dialogWidth + MARGIN) / 2;

        $dialog.css({
            'margin-top': -viewerMarginTop,
            'margin-left': -viewerMarginLeft
        });

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

        if (tileControls.disabled === false) {
            event.gesture.preventDefault();
            toggle2D3D(true, 800);
        }

    });

    $('#tiles2d').hammer().on('tap', function (event) {

        if (tileControls.disabled === false) {
            event.gesture.preventDefault();
            toggle2D3D(false, 800);
        }

    });

    $('#item-viewer-close').hammer().on('tap', function (event) {

        $('#item-viewer-mask, #item-viewer-dialog').fadeOut(300, function () {
            $('#item-viewer-mask').remove();
        });

        return false;

    });
    
    initialize();
    animate();


}
