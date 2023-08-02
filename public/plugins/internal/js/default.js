$(window).on('load', function() {
    M.AutoInit();
    $('.track-dropdown-trigger').dropdown({
        coverTrigger: false,
        constrainWidth: false
    });
    $('body').addClass('loaded')
})