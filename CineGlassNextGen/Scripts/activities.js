function getActivities() {
    var activities = [];

    //
    // Development
    //
    var studioOptionedProperty = {
        'start': new Date("03/13/2011"),
        'content': 'Studio Optioned Property',
        'className': 'past',
        'tooltip': new Date("3/13/2011")
    }
    activities.push(studioOptionedProperty);

    var producerAttached = {
        'start': new Date("03/11/2011"),
        'content': 'Producer Attached',
        'className': 'past',
        'tooltip': new Date("3/11/2011")
    };
    activities.push(producerAttached);

    var finishedScript = {
        'start': new Date("04/26/2011"),
        'content': 'Finished Script',
        'className': 'past',
        'tooltip': new Date("4/26/2011")
    };
    activities.push(finishedScript);

    var directorAnnounced = {
        'start': new Date("08/19/2011"),
        'content': 'Director Announced',
        'className': 'past',
        'tooltip': new Date("08/19/2011")
    };
    activities.push(directorAnnounced);
    
    //
    // Pre-Production
    //

    var prepForProduction = {
        'start': new Date("09/29/2011"),
        'end': new Date("11/7/2011"),
        'content': 'Prep for Production Start',
        'tooltip': 'Prep for Production Start',
        'className': 'timeline-item-inactive'
    };
    activities.push(prepForProduction);

    var preVisualization = {
        'start': new Date("09/29/2011"),
        'end': new Date("05/19/2012"),
        'content': 'Pre-Visualization',
        'tooltip': 'Pre-Visualization',
        'className': 'timeline-item-inactive'
    };
    activities.push(preVisualization);

    var vfxStoryboards = {
        'start': new Date("09/29/2011"),
        'end': new Date("05/19/2012"),
        'content': 'VFX Storyboards',
        'tooltip': 'VFX Storyboards',
        'className': 'timeline-item-inactive'
    };
    activities.push(vfxStoryboards);

    //
    // Production
    //

    var preProduction = {
        'start': new Date("11/7/2011"),
        'end': new Date("3/19/2012"),
        'content': 'Pre-Production',
        'tooltip': 'Pre-Production',
        'className': 'timeline-item-inactive'
    };
    activities.push(preProduction);

    var onSetDailies = {
        'start': new Date("04/30/2012"),
        'end': new Date("11/9/2012"),
        'content': 'On Set Dailies',
        'tooltip': 'On Set Dailies',
        'className': 'timeline-item-inactive'
    };
    activities.push(onSetDailies);

    //
    // Post-Production
    //

    var editorial = {
        'start': new Date("11/9/2012"),
        'end': new Date("4/28/2013"),
        'content': 'Picture Editorial',
        'tooltip': 'Picture Editorial',
        'className': 'timeline-item-critical',
        'terminator': '/cineglass/Images/diamond-red.png'
    }
    activities.push(editorial);

    var previewSchedule = {
        'start': new Date("12/18/2012"),
        'end': new Date("4/17/2013"),
        'content': 'Preview Schedule',
        'tooltip': 'Preview Schedule',
        'className': 'timeline-item-okay',
        'terminator': '/cineglass/Images/circle-green.png'
    }
    activities.push(previewSchedule);
    
    var previewStudioRun = {
        'start': new Date("12/18/2012"),
        'content': 'Preview Studio Run',
        'className': 'past',
        'tooltip': new Date("12/18/2012")
    }
    activities.push(previewStudioRun);

    var finalPictureLock = {
        'start': new Date("3/28/2013"),
        'content': 'Final Picture Lock',
        'className': 'past',
        'tooltip': new Date("3/28/2013")
    }
    activities.push(finalPictureLock);

    var firstScreening = {
        'start': new Date("4/17/2013"),
        'content': '1st Screening Available',
        'className': 'future',
        'tooltip': new Date("4/17/2013")
    }
    activities.push(firstScreening);

    var theatricalMarketing = {
        'start': new Date("3/11/2013"),
        'end': new Date("3/26/2013"),
        'content': 'Theatrical Marketing',
        'tooltip': 'Theatrical Marketing',
        'className': 'timeline-item-inactive'
    }
    activities.push(theatricalMarketing);
    
    var lockCreativeCut = {
        'start': new Date("3/11/2013"),
        'content': 'Lock Creative Cut',
        'className': 'past',
        'tooltip': new Date("3/11/2013")
    }
    activities.push(lockCreativeCut);

    var trailerDue = {
        'start': new Date("3/26/2013"),
        'content': 'Trailer Due "THURSDAY MORNING"',
        'className': 'past',
        'tooltip': new Date("3/26/2013")
    }
    activities.push(trailerDue);

    var soundMix = {
        'start': new Date("1/11/2013"),
        'end': new Date("3/30/2013"),
        'content': 'Sound Mix',
        'tooltip': 'Sound Mix',
        'className': 'timeline-item-inactive'
    }
    activities.push(soundMix);

    var digitalIntermediate = {
        'start': new Date("10/2/2012"),
        'end': new Date("4/19/2013"),
        'content': 'Digital Intermediate',
        'tooltip': 'Digital Intermediate',
        'className': 'timeline-item-warning',
        'terminator': '/cineglass/Images/triangle-yellow.png'
    };
    activities.push(digitalIntermediate);
    
    var digitalCinema = {
        'start': new Date("3/26/2013"),
        'end': new Date("4/19/2013"),
        'content': 'Digital Cinema',
        'tooltip': 'Digital Cinema',
        'className': 'timeline-item-okay',
        'terminator': '/cineglass/Images/circle-green.png'
    }
    activities.push(digitalCinema);

    //
    // Distribution
    //
    var distributionPlan = {
        'start': new Date("4/24/2013"),
        'end': new Date("1/8/2014"),
        'content': 'Distribution Plan',
        'tooltip': 'Distribution Plan',
        'className': 'timeline-item-pending',
        'terminator': '/cineglass/Images/square-blue.png'
    }
    activities.push(distributionPlan);


    return activities;
}

function getProductionItems() {

}

function getPostProductionItems() {

}

function getDistributionItems() {

}