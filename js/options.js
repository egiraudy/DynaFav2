var idx = 5;
function saveOptions() {
    for (var i=0; i<idx; i++) {
        var values = new Array();
        values.push(document.getElementById( 'org'+(i+1)+'name' ).value);
        values.push(document.getElementById( 'org'+(i+1)+'host' ).value);
        values.push(document.getElementById( 'org'+(i+1)+'id' ).value);
        values.push(document.getElementById( 'org'+(i+1)+'tag' ).value);

        localStorage.setItem('org'+(i+1), values.join(';'));
    }
    localStorage.setItem('numberofsites', idx);
}

function loadOptions() {
    if (localStorage.getItem('numberofsites') && localStorage.getItem('numberofsites').length>0) {
        idx = 0 + localStorage.getItem('numberofsites');
    }
    for (var i=0; i<idx; i++) {
        var values = localStorage.getItem('org'+(i+1));
        if (values) {
            values = values.split(";");
            document.getElementById( 'org'+(i+1)+'name' ).value = values[0];
            document.getElementById( 'org'+(i+1)+'host' ).value = values[1];
            document.getElementById( 'org'+(i+1)+'id' ).value = values[2];
            document.getElementById( 'org'+(i+1)+'tag' ).value = values[3];
        }
    }
}

window.addEventListener( 'DOMContentLoaded', function() {
    loadOptions();
    document.getElementById("saveButton").addEventListener('click', saveOptions);
});
