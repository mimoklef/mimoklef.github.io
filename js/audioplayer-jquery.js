$("#volume").slider({
    min: 0,
    max: 100,
    value: volume*100,
    range: "min",
    slide: function(event, ui) {
    volume = ui.value / 100;
    setVolume(ui.value / 100);
    }
    });
    $('#audioplayer').hide();
    function hidebyId(id) {
    if (document.getElementById) {
    var divid = document.getElementById(id);
    $(divid).fadeOut("slow");
    }
    return false;
    }
    function showbyId(id) {
    var divid = document.getElementById(id);
    $(divid).fadeIn("slow");
    return true;
    }
    