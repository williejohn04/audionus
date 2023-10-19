$(window).on('load', function() {
    M.AutoInit();
    $('.track-dropdown-trigger').dropdown({
        coverTrigger: false,
        constrainWidth: false
    });
    $('body').addClass('loaded')
})

function findByValue(arr, value) {
    var o;
    
    for (var i=0, iLen=arr.length; i<iLen; i++) {
        o = arr[i];
    
        for (var p in o) {
        if (o.hasOwnProperty(p) && o[p] == value) {
            return o;
        }
        }
    }
}