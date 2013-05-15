/** @namespace */
var CG = CG || {};
CG.Demo1 = CG.Demo1 || {};


CG.Demo1.DemoData = function () {

    var warnerBrothers = { 
        name: 'Warner Bros. Pictures',
        logo: 'img/warner-brothers-pictures.jpg',
        budgetUri: 'assets/budget/Studio YTD Budget Analysis.pdf',
        budgetType: 'pdf',
        catalog: []
    };

    var allYouNeedIsSkill = {
        name: 'All You Need Is Kill',
        oneSheet: 'assets/one-sheets/allyouneediskill.jpg',
        genre: 'Action | Sci-Fi',
        releaseDate: new Date('3/7/2014'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'Doug Liman',
            writers: 'Hiroshi Sakurazaka, Dante Harper',
            stars: 'Tom Cruise, Emily Blunt, Bill Paxton'
        },
        currentPhase: 'Post-Production',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: null
    };
    warnerBrothers.catalog.push(allYouNeedIsSkill);

    var conjuring = {
        name: 'The Conjuring',
        oneSheet: 'assets/one-sheets/conjuring.jpg',
        genre: 'Horror | Thriller',
        releaseDate: new Date('7/19/2013'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'James Wan',
            writers: 'Chad Hayes, Carey Hayes',
            stars: ' Vera Farmiga, Lili Taylor, Patrick Wilson'
        },
        currentPhase: 'Distribution',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: null
    }
    warnerBrothers.catalog.push(conjuring);

    var godzilla = {
        name: 'Godzilla',
        oneSheet: 'assets/one-sheets/Godzillia2014.jpeg',
        genre: 'Action | Sci-Fi | Thriller',
        releaseDate: new Date('5/16/2014'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'Gareth Edwards',
            writers: 'Max Borenstein, Dave Callaham',
            stars: 'Aaron Taylor-Johnson, Bryan Cranston, Sally Hawkins'
        },
        currentPhase: 'Production',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: null
    }
    warnerBrothers.catalog.push(godzilla);

    var greatGatsby = {
        name: 'The Great Gatsby',
        oneSheet: 'assets/one-sheets/great_gatsby.jpg',
        genre: 'Drama | Romance',
        releaseDate: new Date('5/10/2013'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'Baz Luhrmann',
            writers: 'Baz Luhrmann, Craig Pearce',
            stars: 'Leonardo DiCaprio, Joel Edgerton, Tobey Maguire'
        },
        currentPhase: 'Distribution',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: null
    }
    warnerBrothers.catalog.push(greatGatsby);

    var hangover3 = {
        name: 'The Hangover Part III',
        oneSheet: 'assets/one-sheets/hangover_part_3.jpg',
        genre: 'Comedy',
        releaseDate: new Date('5/24/2013'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'Todd Phillips',
            writers: 'Todd Phillips, Craig Mazin',
            stars: 'Bradley Cooper, Zach Galifianakis, John Goodman'
        },
        currentPhase: 'Distribution',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: null
    }
    warnerBrothers.catalog.push(hangover3);

    var hobbitDesolation = {
        name: 'The Hobbit: The Desolation of Smaug',
        oneSheet: 'assets/one-sheets/Hobbit-desolation.jpg',
        genre: 'Adventure | Fantasy',
        releaseDate: new Date('12/13/2013'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'Peter Jackson',
            writers: 'Fran Walsh, Philippa Boyens',
            stars: 'Richard Armitage, Martin Freeman, Elijah Wood'
        },
        currentPhase: 'Post-Production',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: null
    }
    warnerBrothers.catalog.push(hobbitDesolation);

    var jupiterAscending = {
        name: 'Jupiter Ascending',
        oneSheet: 'assets/one-sheets/Jupiter Ascending.jpg',
        genre: 'Action | Sci-Fi',
        releaseDate: new Date('7/25/2014'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'Andy Wachowski, Lana Wachowski',
            writers: 'Andy Wachowski, Lana Wachowski',
            stars: 'Channing Tatum, Mila Kunis, Sean Bean'
        },
        currentPhase: 'Production',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: {
            development: {
                name: 'Development',
                budgetUri: '',
                budgetType: '',
                iconUri: 'img/icons/dev.png',
                departments: [
                    {
                        name: 'Script',
                        start: new Date("11/2/2012"),
                        end: new Date("11/20/2012"),
                        assets: [
                            {
                                name: 'dark-knight-rises.pdf',
                                version: '1',
                                versionDate: new Date("11/2/2012"),
                                type: 'PDF',
                                assetUri: 'assets/dev/dark-knight-rises.pdf',
                                category: ''
                            }
                        ]
                    }
                ]
            },
            preProduction: {
                name: 'Pre-Production',
                budgetUri: '',
                budgetType: '',
                iconUri: 'img/icons/pre-prod.png',
                departments: [
                    {
                        name: 'Art',
                        iconUri: 'img/icons/art.jpg',
                        start: new Date("11/20/2012"),
                        end: new Date("1/22/2013"),
                        assets: [
                            {
                                name: 'storyboard-1.jpg',
                                version: '1',
                                versionDate: new Date('1/2/2013'),
                                type: 'IMG',
                                assetUri: 'assets/pre-prod/storyboard/storyboard-1.jpg',
                                category: 'Storyboard'
                            },
                            {
                                name: 'storyboard-2.jpg',
                                version: '1',
                                versionDate: new Date('1/2/2013'),
                                type: 'IMG',
                                assetUri: 'assets/pre-prod/storyboard/storyboard-2.jpg',
                                category: 'Storyboard'
                            },
                            {
                                name: 'storyboard-3.jpg',
                                version: '1',
                                versionDate: new Date('1/2/2013'),
                                type: 'IMG',
                                iconUri: 'img/icons/img.png',
                                assetUri: 'assets/pre-prod/storyboard/storyboard-3.jpg',
                                category: 'Storyboard'
                            },
                            {
                                name: 'storyboard-4.jpg',
                                version: '1',
                                versionDate: new Date('1/2/2013'),
                                type: 'IMG',
                                assetUri: 'assets/pre-prod/storyboard/storyboard-4.jpg',
                                category: 'Storyboard'
                            },
                            {
                                name: 'storyboard-5.jpg',
                                version: '1',
                                versionDate: new Date('1/2/2013'),
                                type: 'IMG',
                                assetUri: 'assets/pre-prod/storyboard/storyboard-5.jpg',
                                category: 'Storyboard'
                            },
                            {
                                name: 'previz-1.png',
                                version: '1',
                                versionDate: new Date('1/22/2013'),
                                type: 'IMG',
                                assetUri: 'assets/pre-prod/pre-viz/previz-1.png',
                                category: 'Pre-Viz'
                            },
                            {
                                name: 'previz-2.png',
                                version: '1',
                                versionDate: new Date('1/22/2013'),
                                type: 'IMG',
                                assetUri: 'assets/pre-prod/pre-viz/previz-2.png',
                                category: 'Pre-Viz'
                            },
                            {
                                name: 'previz-3.png',
                                version: '1',
                                versionDate: new Date('1/22/2013'),
                                type: 'IMG',
                                assetUri: 'assets/pre-prod/pre-viz/previz-3.png',
                                category: 'Pre-Viz'
                            },
                            {
                                name: 'previz-4.png',
                                version: '1',
                                versionDate: new Date('1/22/2013'),
                                type: 'IMG',
                                assetUri: 'assets/pre-prod/pre-viz/previz-4.png',
                                category: 'Pre-Viz'
                            },
                            {
                                name: 'previz-5.png',
                                version: '1',
                                versionDate: new Date('1/22/2013'),
                                type: 'IMG',
                                assetUri: 'assets/pre-prod/pre-viz/previz-5.png',
                                category: 'Pre-Viz'
                            }                            
                        ]
                    }
                ]
            },
            production: {
                name: 'Production',
                budgetUri: 'assets/budget/Prod-4K_Budget.xls',
                budgetType: 'xls',
                iconUri: 'img/icons/prod.jpg',
                departments: [
                    {
                        name: 'Shoot',
                        iconUri: 'img/icons/prod.png',
                        start: new Date("1/22/2013"),
                        end: new Date("8/23/2013"),
                        assets: [
                            {
                                name: 'EDIT_DeliveryReport20130423.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/EDIT_DeliveryReport20130423.pdf',
                                category: ''
                            },
                            {
                                name: 'FACILITY_JA_EOD - Shootday_016 - 042313.eml',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'EML',
                                assetUri: 'assets/prod/FACILITY_JA_EOD - Shootday_016 - 042313.eml',
                                category: ''
                            },
                            {
                                name: 'PROD JA_CALL SHEET 18 - Thu 25 April.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/PROD JA_CALL SHEET 18 - Thu 25 April.pdf',
                                category: ''
                            }
                        ]
                    },
                    {
                        name: 'Dailies',
                        iconUri: 'img/icons/dailies.jpg',
                        start: new Date("1/22/2013"),
                        end: new Date("8/23/2013"),
                        assets: [
                            {
                                name: 'A0070.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/A0070.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'A0071.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/A0071.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'A0072.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/A0072.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'A0073.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/A0073.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'A0074.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/A0074.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'B0033.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/B0033.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'B0034.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/B0034.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'B0035.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/B0035.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'B0036.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/B0036.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'B0037.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/B0037.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'C0017.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/C0017.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'G0015.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/avid-ale/G0015.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: '042313.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/camera-report/042313.pdf',
                                category: 'Camera Report'
                            },
                            {
                                name: 'A0070.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/codex-ale/A0070.ale',
                                category: 'CODEX ALE'
                            },
                            {
                                name: 'A0071.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/codex-ale/A0071.ale',
                                category: 'CODEX ALE'
                            },
                            {
                                name: 'A0072.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/codex-ale/A0072.ale',
                                category: 'CODEX ALE'
                            },
                            {
                                name: 'A0073.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/codex-ale/A0073.ale',
                                category: 'CODEX ALE'
                            },
                            {
                                name: 'A0074.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/codex-ale/A0074.ale',
                                category: 'CODEX ALE'
                            },
                            {
                                name: 'B0033.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/codex-ale/B0033.ale',
                                category: 'CODEX ALE'
                            },
                            {
                                name: 'B0034.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/codex-ale/B0034.ale',
                                category: 'CODEX ALE'
                            },
                            {
                                name: 'B0035.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/codex-ale/B0035.ale',
                                category: 'CODEX ALE'
                            },
                            {
                                name: 'B0036.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/codex-ale/B0036.ale',
                                category: 'CODEX ALE'
                            },
                            {
                                name: 'B0037.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/codex-ale/B0037.ale',
                                category: 'CODEX ALE'
                            },
                            {
                                name: 'C0017.ale',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/dailies/codex-ale/C0017.ale',
                                category: 'CODEX ALE'
                            },
                            {
                                name: 'A0070.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/A0070.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'A0071.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/A0071.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'A0072.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/A0072.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'A0073.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/A0073.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'A0074.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/A0074.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'B0033.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/B0033.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'B0034.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/B0034.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'B0035.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/B0035.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'B0036.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/B0036.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'B0037.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/B0037.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'C0017.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/C0017.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'G0015.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/codex-report/G0015.pdf',
                                category: 'CODEX Report'
                            },
                            {
                                name: 'DeliveryReport20130423.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/framelogic-report/DeliveryReport20130423.pdf',
                                category: 'FrameLogic Report'
                            },
                            {
                                name: 'SR034.xlsx.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/sound-report/SR034.xlsx.pdf',
                                category: 'Sound Report'
                            },
                            {
                                name: 'SR035.xlsx.pdf',
                                version: '1',
                                versionDate: new Date('4/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/dailies/sound-report/SR035.xlsx.pdf',
                                category: 'Sound Report'
                            }
                        ]
                    },
                    {
                        name: 'VFX',
                        iconUri: 'img/icons/prod-vfx.jpg',
                        start: new Date("1/22/2013"),
                        end: new Date("8/23/2013"),
                        assets: [
                            {
                                name: '0089_003_A0070.1271972_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/0089_003_A0070.1271972_look.jpg',
                                category: ''
                            },
                            {
                                name: '0089_003_B0033.1272329_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/0089_003_B0033.1272329_look.jpg',
                                category: ''
                            },
                            {
                                name: '052W-005_G0015.1557529_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/052W-005_G0015.1557529_look.jpg',
                                category: ''
                            },
                            {
                                name: '089A_004_A0071.1340789_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/089A_004_A0071.1340789_look.jpg',
                                category: ''
                            },
                            {
                                name: '089B_006_A0072.1512114_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/089B_006_A0072.1512114_look.jpg',
                                category: ''
                            },
                            {
                                name: '089B_006_B0035.1511170_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/089B_006_B0035.1511170_look.jpg',
                                category: ''
                            },
                            {
                                name: '089C_005_A0073.1643595_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/089C_005_A0073.1643595_look.jpg',
                                category: ''
                            },
                            {
                                name: '089C_005_B0036.1644545_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/089C_005_B0036.1644545_look.jpg',
                                category: ''
                            },
                            {
                                name: '089D_001_B0037.1739030_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/089D_001_B0037.1739030_look.jpg',
                                category: ''
                            },
                            {
                                name: '089D_001_C0017.1739163_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/089D_001_C0017.1739163_look.jpg',
                                category: ''
                            },
                            {
                                name: '089D_002_A0074.1749004_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/089D_002_A0074.1749004_look.jpg',
                                category: ''
                            },
                            {
                                name: '089E_002_A0074.1780371_look.jpg',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/089E_002_A0074.1780371_look.jpg',
                                category: ''
                            },
                            {
                                name: '092E_001_A0032.1720472_look.png',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/092E_001_A0032.1720472_look.png',
                                category: ''
                            },
                            {
                                name: 'assets/prod/vfx/092E_001_A0032.1720473_look.png',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/092E_001_A0032.1720473_look.png',
                                category: ''
                            },
                            {
                                name: '092E_001_A0032.17204743_look.png',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/092E_001_A0032.17204743_look.png',
                                category: ''
                            },
                            {
                                name: '092E_001_A0032.17204744_look.png',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/092E_001_A0032.17204744_look.png',
                                category: ''
                            },
                            {
                                name: '092E_001_A0032.17204745_look.png',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/092E_001_A0032.17204745_look.png',
                                category: ''
                            },
                            {
                                name: '092E_001_A0032.172047465_look.png',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/092E_001_A0032.172047465_look.png',
                                category: ''
                            },
                            {
                                name: '092E_001_A0032.172047466_look.png',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/092E_001_A0032.172047466_look.png',
                                category: ''
                            },
                            {
                                name: '092E_001_A0032.172047467_look.png',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/092E_001_A0032.172047467_look.png',
                                category: ''
                            },
                            {
                                name: '092E_001_A0032.172047468_look.png',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'IMG',
                                assetUri: 'assets/prod/vfx/thumbnails/092E_001_A0032.172047468_look.png',
                                category: ''
                            },
                            {
                                name: 'A0070.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/A0070.ALE',
                                category: ''
                            },
                            {
                                name: 'A0071.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/A0071.ALE',
                                category: ''
                            },
                            {
                                name: 'A0072.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/A0072.ALE',
                                category: ''
                            },
                            {
                                name: 'A0073.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/A0073.ALE',
                                category: ''
                            },
                            {
                                name: 'A0074.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/A0074.ALE',
                                category: ''
                            },
                            {
                                name: 'B0033.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/B0033.ALE',
                                category: ''
                            },
                            {
                                name: 'B0034.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/B0034.ALE',
                                category: ''
                            },
                            {
                                name: 'B0035.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/B0035.ALE',
                                category: ''
                            },
                            {
                                name: 'B0036.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/B0036.ALE',
                                category: ''
                            },
                            {
                                name: 'B0037.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/B0037.ALE',
                                category: ''
                            },
                            {
                                name: 'C0017.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/C0017.ALE',
                                category: ''
                            },
                            {
                                name: 'G0015.ALE',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'TXT',
                                assetUri: 'assets/prod/vfx/ale/G0015.ALE',
                                category: ''
                            }
                        ]
                    },
                    {
                        name: 'Script Notes',
                        start: new Date("1/22/2013"),
                        end: new Date("5/23/2013"),
                        iconUri: 'img/icons/script-notes.png',
                        assets: [
                            {
                                name: 'JA SCENE STATUS BLUE.xlsx',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'XLS',
                                assetUri: 'assets/prod/script-notes/JA SCENE STATUS BLUE.xlsx',
                                category: ''
                            },
                            {
                                name: 'DAY 016 PRINT LOG.docx',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'DOC',
                                assetUri: 'assets/prod/script-notes/DAY 016 PRINT LOG.docx',
                                category: 'Day 042313'
                            },
                            {
                                name: 'DAY 016 WRAP REPORT.docx',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'DOC',
                                assetUri: 'assets/prod/script-notes/DAY 016 WRAP REPORT.docx',
                                category: 'Day 042313'
                            },
                            {
                                name: 'SC. 089 PAGE 59.pdf',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/script-notes/SC. 089 PAGE 59.pdf',
                                category: 'Day 042313'
                            },
                            {
                                name: 'SC. 089 PAGE 60.pdf',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/script-notes/SC. 089 PAGE 60.pdf',
                                category: 'Day 042313'
                            },
                            {
                                name: 'SC. 089 PAGE 61.pdf',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/script-notes/SC. 089 PAGE 61.pdf',
                                category: 'Day 042313'
                            },
                            {
                                name: 'SC. 089.docx',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'DOC',
                                assetUri: 'assets/prod/script-notes/SC. 089.docx',
                                category: 'Day 042313'
                            },
                            {
                                name: 'SC. 089.pdf',
                                version: '1',
                                versionDate: new Date('04/23/2013'),
                                type: 'PDF',
                                assetUri: 'assets/prod/script-notes/SC. 089.pdf',
                                category: 'Day 042313'
                            }
                        ]
                    }
                ]
            },
            postProduction: {
                name: 'Post-Production',
                budgetUri: 'assets/budget/Post Prod-4K_Budget.xls',
                budgetType: 'xls',
                iconUri: 'img/icons/post.jpg',
                departments: [
                    {
                        name: 'Deliverable Planning',
                        iconUri: 'img/icons/dist-planning.png',
                        start: new Date("5/3/2014"),
                        end: new Date("5/8/2014"),
                        assets: [
                            {
                                name: 'IM3_CG_Reel_By_Reel_Plan_20130326.pdf',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'PDF',
                                assetUri: 'assets/post/dist/IM3_CG_Reel_By_Reel_Plan_20130326.pdf',
                                category: ''
                            },
                            {
                                name: 'IM3_CG_Summary_Sheet 20130326.pdf',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'PDF',
                                assetUri: 'assets/post/dist/IM3_CG_Summary_Sheet 20130326.pdf',
                                category: ''
                            },
                            {
                                name: 'IM3_CG_TDCMastering02.28.13.xlsx',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'XLS',
                                assetUri: 'assets/post/dist/IM3_CG_TDCMastering02.28.13.xlsx',
                                category: ''
                            }
                        ]
                    },
                    {
                        name: 'VFX Delivery',
                        iconUri: 'img/icons/post-vfx.jpg',
                        start: new Date("8/23/2013"),
                        end: new Date("6/8/2014"),
                        assets: [
                            {
                                name: 'A0070.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/A0070.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'A0071.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/A0071.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'A0072.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/A0072.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'A0073.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/A0073.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'A0074.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/A0074.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'B0033.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/B0033.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'B0034.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/B0034.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'B0035.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/B0035.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'B0036.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/B0036.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'B0037.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/B0037.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'C0017.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/C0017.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'G0015.ALE',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/avid-ale/G0015.ALE',
                                category: 'AVID ALE'
                            },
                            {
                                name: 'A0070.ale',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/DIT/A0070.ale',
                                category: 'CODEX ALE - DIT'
                            },
                            {
                                name: 'A0071.ale',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/DIT/A0071.ale',
                                category: 'CODEX ALE - DIT'
                            },
                            {
                                name: 'A0072.ale',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/DIT/A0072.ale',
                                category: 'CODEX ALE - DIT'
                            },
                            {
                                name: 'A0073.ale',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/DIT/A0073.ale',
                                category: 'CODEX ALE - DIT'
                            },
                            {
                                name: 'A0074.ale',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/DIT/A0074.ale',
                                category: 'CODEX ALE - DIT'
                            },
                            {
                                name: 'B0033.ale',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/DIT/B0033.ale',
                                category: 'CODEX ALE - DIT'
                            },
                            {
                                name: 'B0034.ale',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/DIT/B0034.ale',
                                category: 'CODEX ALE - DIT'
                            },
                            {
                                name: 'B0035.ale',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/DIT/B0035.ale',
                                category: 'CODEX ALE - DIT'
                            },
                            {
                                name: 'B0036.ale',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/DIT/B0036.ale',
                                category: 'CODEX ALE - DIT'
                            },
                            {
                                name: 'B0037.ale',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/DIT/B0037.ale',
                                category: 'CODEX ALE - DIT'
                            },
                            {
                                name: 'C0017.ale',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/DIT/C0017.ale',
                                category: 'CODEX ALE - DIT'
                            },
                            {
                                name: 'A0070',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/A0070.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: 'A0071',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/A0071.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: 'A0072',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/A0072.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: 'A0073',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/A0073.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: 'A0074',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/A0074.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: 'B0033',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/B0033.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: 'B0034',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/B0034.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: 'B0035',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/B0035.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: 'B0036',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/B0036.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: 'B0037',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/B0037.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: 'C0017',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/C0017.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: 'G0015',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'TXT',
                                assetUri: 'assets/post/vfx/codex-ale/Tech/G0015.ale',
                                category: 'CODEX ALE - TECH'
                            },
                            {
                                name: '0089_003_A0070.1271972_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/0089_003_A0070.1271972_look.jpg',
                                category: ''
                            },
                            {
                                name: '0089_003_B0033.1272329_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/0089_003_B0033.1272329_look.jpg',
                                category: ''
                            },
                            {
                                name: '089A_004_A0071.1340789_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/089A_004_A0071.1340789_look.jpg',
                                category: ''
                            },
                            {
                                name: '089A_004_B0034.1340508_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/089A_004_B0034.1340508_look.jpg',
                                category: ''
                            },
                            {
                                name: '089B_006_A0072.1512114_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/089B_006_A0072.1512114_look.jpg',
                                category: ''
                            },
                            {
                                name: '089B_006_B0035.1511170_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/089B_006_B0035.1511170_look.jpg',
                                category: ''
                            },
                            {
                                name: '089C_005_A0073.1643595_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/089C_005_A0073.1643595_look.jpg',
                                category: ''
                            },
                            {
                                name: '089C_005_B0036.1644545_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/089C_005_B0036.1644545_look.jpg',
                                category: ''
                            },
                            {
                                name: '089D_001_B0037.1739030_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/089D_001_B0037.1739030_look.jpg',
                                category: ''
                            },
                            {
                                name: '089D_001_C0017.1739163_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/089D_001_C0017.1739163_look.jpg',
                                category: ''
                            },
                            {
                                name: '089D_002_A0074.1749004_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/089D_002_A0074.1749004_look.jpg',
                                category: ''
                            },
                            {
                                name: '089E_002_A0074.1780371_look.jpg',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'IMG',
                                assetUri: 'assets/post/vfx/thumbnails/089E_002_A0074.1780371_look.jpg',
                                category: ''
                            },
                            {
                                name: 'short.mp4',
                                version: '1',
                                versionDate: new Date('5/3/2013'),
                                type: 'MOV',
                                assetUri: 'assets/post/vfx/short.mp4',
                                category: ''
                            }
                        ]
                    }
                ]
            },
            distribution: {
                name: 'Distribution',
                budgetUri: '',
                budgetType: '',
                iconUri: 'img/icons/dist.png',
                departments: []
            }
        }
    }
    warnerBrothers.catalog.push(jupiterAscending);

    var manOfSteel = {
        name: 'Man of Steel',
        oneSheet: 'assets/one-sheets/man_of_steel.jpg',
        genre: 'Action | Adventure | Fantasy',
        releaseDate: new Date('6/14/2013'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'Zack Snyder',
            writers: 'David S. Goyer',
            stars: 'Henry Cavill, Michael Shannon, Amy Adams'
        },
        currentPhase: 'Distribution',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: null
    }
    warnerBrothers.catalog.push(manOfSteel);

    var pacificRim = {
        name: 'Pacific Rim',
        oneSheet: 'assets/one-sheets/pacific_rim.jpg',
        genre: 'Action | Adventure | Sci-Fi',
        releaseDate: new Date('7/12/2013'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'Guillermo del Toro',
            writers: 'Travis Beacham, Guillermo del Toro',
            stars: 'Charlie Hunnam, Idris Elba, Charlie Day'
        },
        currentPhase: 'Distribution',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: null
    }
    warnerBrothers.catalog.push(pacificRim);

    var legoMovie = {
        name: 'The Lego Movie',
        oneSheet: 'assets/one-sheets/thelegomovie.jpg',
        genre: 'Animation | Action | Comedy',
        releaseDate: new Date('2/7/2014'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'Phil Lord, Chris Miller',
            writers: 'Dan Hageman, Kevin Hageman',
            stars: 'Morgan Freeman, Elizabeth Banks, Chris Pratt'
        },
        currentPhase: 'Production',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: null
    }
    warnerBrothers.catalog.push(legoMovie);

    var seventhSon = {
        name: 'The Seventh Son',
        oneSheet: 'assets/one-sheets/theseventhson.jpg',
        genre: 'Adventure | Family | Fantasy',
        releaseDate: new Date('10/18/2013'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'Sergey Bodrov',
            writers: 'Max Borenstein, Charles Leavitt',
            stars: 'Julianne Moore, Jeff Bridges, Ben Barnes'
        },
        currentPhase: 'Post-Production',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: null
    }
    warnerBrothers.catalog.push(seventhSon);

    var threeHundred2 = {
        name: '300: Rise of an Empire',
        oneSheet: 'assets/one-sheets/three_hundred_rise_of_an_empire.jpg',
        genre: 'Action | Drama',
        releaseDate: new Date('8/2/2013'),
        releaseCountry: 'USA',
        topCredits: {
            directors: 'Noam Murro',
            writers: 'Zack Snyder, Kurt Johnstad',
            stars: 'Eva Green, Rodrigo Santoro, Sullivan Stapleton'
        },
        currentPhase: 'Production',
        budgetUri: 'assets/budget/Movie Budget__CASH_FLOW.xls',
        budgetType: 'xls',
        phases: null
    }
    warnerBrothers.catalog.push(threeHundred2);


    return warnerBrothers;

}