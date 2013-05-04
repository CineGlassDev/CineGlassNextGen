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
    
    var _worldElements = {
        catalog: { studio: '', logo: '', budgetUri: '', movies: [] },
        departments: [], // {  movie: 'Jupiter Ascending', phase: 'Pre-Production', department: [CACHE DATA] }
        assets: [], // { movie: 'Jupiter Ascending', phase: 'Pre-Production', department: 'VFX', assets: [CACHE DATA] }
        subAssets: [] // { movie: 'Jupiter Ascending', phase: 'Pre-Production', department: 'VFX', category: 'Sound Report', assets: [CACHE DATA] }
    };

    var _worldVectors = {
        catalogs: [], // { studio: 'Warner Brothers', movies2D: [], movies3D: [] }
        departments: [], // { movie: 'Jupiter Ascending', phase: 'Pre-Production', departments2D: [], departments3D: [] }
        assets: [], // { movie: 'Jupiter Ascending', phase: 'Pre-Production', department: 'VFX', assets2D: [], assets3D: [] }
        subAssets: [] // { movie: 'Jupiter Ascending', phase: 'Pre-Production', department: 'VFX', category: 'Sound Report', assets2D: [], assets3D: [] }
    };


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

        // initialize the world CSS elements
        initializeWorldElements();
        
        // TODO: initialize vectors
    }

    function initializeWorldElements() {

        var studioData = CG.Demo1.DemoData();
        initializeCatalogTiles(studioData);
        initializeDepartmentTiles(studioData);
        initializeAssetTiles(studioData);
        initializeSubAssetTiles(studioData);

    }

    function initializeCatalogTiles(studioData) {

        //
        // cache catalog studio info
        //
        _worldElements.catalog.studio = studioData.name;
        _worldElements.catalog.budgetUri = studioData.budgetUri;
        _worldElements.catalog.logo = studioData.logo;

        // change page background to use studio's logo
        $(document).css('background-image', 'url("' + studioData.logo + '")');

        var movieCount = studioData.catalog.length;

        for (var index = 0; index < movieCount; index++) {

            var movie = studioData.catalog[index];

            //
            // create a tile for the movie
            //
            var tile = document.createElement('div');
            tile.className = 'movie-tile';
            tile.title = movie.name;
            tile.movie = movie;

            //
            // create phase swatch element
            //
            var swatch = document.createElement('div');
            swatch.className = 'movie-tile phase-swatch ' + movie.currentPhase.toLowerCase();
            tile.appendChild(swatch);

            //
            // create release date element
            //
            var releaseDate = document.createElement('div');
            releaseDate.className = 'movie-tile release-date';
            releaseDate.textContent = movie.releaseDate;
            tile.appendChild(releaseDate);

            //
            // create one sheet element
            //
            var oneSheet = document.createElement('div');
            oneSheet.className = 'movie-tile one-sheet';
            oneSheet.style.backgroundImage = "url('" + movie.oneSheet + "')";
            tile.appendChild(oneSheet);

            //
            // wire-up tap event handler for movie tile
            //
            $(tile).hammer().on('tap', function (event) {

                if (this.movie.phases != null) {

                    // change page background to one-sheet
                    $(document).css('background-image', 'url("' + this.movie.oneSheet + '")');

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
            _worldScene.add(css3dObject);

            // add CSS3D object to array
            _worldElements.catalog.movies.push(css3dObject);
            
            // cache CSS3D object on movie tile
            tile.parentObject = css3dObject;

        }

    }

    function initializeDepartmentTiles(studioData) {

        var movieCount = studioData.catalog.length;

        for (var index = 0; index < movieCount; index++) {

            var movie = studioData.catalog[index];

            console.log(movie);

            console.log('has phases? ' + (movie.phases != null ? true : false));

            // TODO: Debug and figure out why below goes into endless loop

            continue;

            if (movie.phases != null) {

                //
                // Development Phase
                //

                var departmentsLength = movie.phases.development.departments.length;

                for (var index = 0; index < departmentsLength; index++) {

                    var dept = movie.phases.development.departments[index];

                    cacheDepartmentElement(
                        dept,
                        movie.name,
                        'Development',
                        movie.phases.development.iconUri,
                        movie.phases.development.budgetUri);

                }

                //
                // Pre-Production Phase
                //

                departmentsLength = movie.phases.preProduction.departments.length;

                for (var index = 0; index < departmentsLength; index++) {

                    var dept = movie.phases.preProduction.departments[index];

                    cacheDepartmentElement(
                        dept,
                        movie.name,
                        'Pre-Production',
                        movie.phases.preProduction.iconUri,
                        movie.phases.preProduction.budgetUri);

                }

                //
                // Production Phase
                //

                departmentsLength = movie.phases.production.departments.length;

                for (var index = 0; index < departmentsLength; index++) {

                    var dept = movie.phases.production.departments[index];

                    cacheDepartmentElement(
                        dept,
                        movie.name,
                        'Production',
                        movie.phases.production.iconUri,
                        movie.phases.production.budgetUri);

                }

                //
                // Post-Production Phase
                //

                departmentsLength = movie.phases.postProduction.departments.length;

                for (var index = 0; index < departmentsLength; index++) {

                    var dept = movie.phases.postProduction.departments[index];

                    cacheDepartmentElement(
                        dept,
                        movie.name,
                        'Post-Production',
                        movie.phases.postProduction.iconUri,
                        movie.phases.postProduction.budgetUri);

                }

                //
                // Distribution Phase
                //

                departmentsLength = movie.phases.distribution.departments.length;

                for (var index = 0; index < departmentsLength; index++) {

                    var dept = movie.phases.distribution.departments[index];

                    cacheDepartmentElement(
                        dept,
                        movie.name,
                        'Distribution',
                        movie.phases.distribution.iconUri,
                        movie.phases.distribution.budgetUri);

                }
   
            }

        }

    }

    function cacheDepartmentElement(deptData, movieName, phase, deptIconUri, budgetUri) {

        //
        // create a tile for the department
        //
        var tile = document.createElement('div');
        tile.className = 'department-tile';
        tile.title = deptData.name;
        tile.assets = deptData.assets;

        //
        // create phase swatch element
        //
        var swatch = document.createElement('div');
        swatch.className = 'department-tile phase-swatch ' + phase;
        tile.appendChild(swatch);

        //
        // create department name element
        //
        var departmentName = document.createElement('div');
        departmentName.className = 'department-tile name';
        departmentName.textContent = deptData.name;
        tile.appendChild(departmentName);

        //
        // create logo element
        //
        var logo = document.createElement('div');
        logo.className = 'department-tile logo';
        logo.style.backgroundImage = "url('" + deptIconUri + "')";
        tile.appendChild(logo);

        //
        // wire-up tap event handler for department tile
        //
        $(tile).hammer().on('tap', function (event) {

            // set back nav
            setBackNav(CG.Views.Departments, movieName);

            // TODO:
            // ---- phase, department name, logo at top of page
            // ---- budget button at top of page for respective phase (if applicable)...incorporate swatch line at top of button
            // ---- transform to asset tiles in main area

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
        _worldScene.add(css3dObject);

        var departmentElement = {
            movie: movieName,
            phase: phase,
            department: css3dObject
        };

        // add department element to array
        _worldElements.departments.push(departmentElement);

        // cache department element on department tile
        tile.parentObject = departmentElement;

    }

    function initializeAssetTiles(studioData) {

        // TODO: Implement
        
    }

    function initializeSubAssetTiles(studioData) {

        // TODO: Implement

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


    initialize();



    










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


}