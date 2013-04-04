function getTitles() {
    var titles = [];

    //
    // Development
    //


    var starWarsEpisodeVII = {
        'start': new Date("01/01/2015"),
        'end': new Date("01/01/2016"),
        'content': 'Star Wars: Episode VIII',
        'tooltip': new Date("Star Wars: Episode VIII"),
        'className': 'timeline-item-pending',
        'terminator': '/cineglass/Images/square-blue.png'
    }
    titles.push(starWarsEpisodeVII);

    return titles;
}