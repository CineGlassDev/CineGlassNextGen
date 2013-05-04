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
        catalog: {
            studio: 'Warner Brothers',
            logo: null,
            budgetUri: null,
            movies: []
        },
        departments: [],
        assets: [],
        subAssets: []
    };

    var _worldVectors = {
        catalog: { studio: 'Warner Brothers', movies2D: [], movies3D: [] },
        departments: [],
        assets: [],
        subAssets: []
    };



    //
    // jQuery cache variables
    //

    $vieport = $('#viewport');






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



    }

    function initializeWorldElements() {

        var data = CG.Demo1.DemoData();
        
        //
        // cache catalog studio info
        //
        _worldElements.catalog.studio = data.name;
        _worldElements.catalog.budgetUri = data.budgetUri;
        _worldElements.catalog.logo = data.logo;


        var movieCount = data.catalog.movies.length;

        for (var index = 0; index < movieCount; index++) {

            var movie = data.catalog.movies[index];

            var tile = document.createElement('div');
            tile.className = 'movie-tile';
            tile.title = move.name;
            tile.data = movie;

            var swatch = document.createElement('div');
            swatch.className = 'movie-tile phase-swatch ' + movie.currentPhase.toLowerString();
            tile.appendChild(swatch);

            var releaseDate = document.createElement('div');
            releaseDate.className = 'movie-tile release-date';
            releaseDate.textContent = movie.releaseDate;
            tile.appendChild(releaseDate);

            var oneSheet = document.createElement('div');
            oneSheet.className = 'movie-tile one-sheet';
            oneSheet.style.backgroundImage = "url('" + movie.oneSheet + "')";
            tile.appendChild(oneSheet);


            $(tile).hammer().on('tap', function (event) {

                // TODO:
                // - Movie
                // ---- one-sheet as main area background
                // ---- catalog as back button (black color scheme)
                // ---- movie info at top of page
                // ---- budget button at top of page for movie
                // ---- department tiles in main area   



                return false;

            });









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

//    3D Vectors
//===========

//    catalog: { studio: 'Warner Bros', movies2D: [], movies3D: [] }

//    departments: [ { movie: 'Jupiter Ascending', phase: 'Pre-Production', departments2D: [], departments3D: [] }, {} ]

//    assets: [ { movie: 'Jupiter Ascending', phase: 'Pre-Production', department: 'VFX', assets2D: [], assets3D: [] } ]

//    sub-assets: [ { movie: 'Jupiter Ascending', phase: 'Pre-Production', department: 'VFX', category: 'Sound Report', assets2D: [], assets3D: [] } ]




//    CSS Elements
//    ==============

//    catalog: { studio: 'Warner Bros', movies: [CACHE DATA] }

//    departments: [ { movie: 'Jupiter Ascending', phase: 'Pre-Production', department: [CACHE DATA] } ]

//assets: [ { movie: 'Jupiter Ascending', phase: 'Pre-Production', department: 'VFX', assets: [CACHE DATA] } ]

//sub-assets: [ { movie: 'Jupiter Ascending', phase: 'Pre-Production', department: 'VFX', category: 'Sound Report', assets: [CACHE DATA] } ]





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