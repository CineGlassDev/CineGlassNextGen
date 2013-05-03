

TWEEN.FadeIn = function (object, duration) {

    object['opacity'] = 0;

    $(object[0]).css({ display: 'block', opacity: 0 });

    TWEEN.Tween.call(this, object);

    this.to({ opacity: 1 }, duration)
        .onUpdate(function (value) {
            $(this[0]).css('opacity', value);
        })
        .start();

}

TWEEN.FadeOut = function (object, duration) {

    object['opacity'] = 1;

    $(object[0]).css({ display: 'block', opacity: 1 });

    TWEEN.Tween.call(this, object);

    this.to({ opacity: 0 }, duration)
        .onUpdate(function(value) {
            $(this[0]).css('opacity', value);
        })
        .onComplete(function () {
            $(this[0]).css('display', 'none');
        })
        .start();

}

TWEEN.FadeIn.prototype = Object.create(TWEEN.Tween.prototype);
TWEEN.FadeOut.prototype = Object.create(TWEEN.Tween.prototype);