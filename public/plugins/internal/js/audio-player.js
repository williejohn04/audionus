let playlistTrack = [], playedTrack, firstTrackNumber, audioProgress;

function updatePlayedTrack() {
    $(document).find('#audio-player-cover').attr('src', playedTrack.cover);
    $(document).find('#audio-player-title').text(playedTrack.title);
    $(document).find('#audio-player-artist').text(playedTrack.artist);
}

function playAudio() {
    $.ajax({
        method: 'get' ,
        url: '/api/playback/getVideoId',
        data: {title: playedTrack.title, artist: playedTrack.artist},
        success: function (data) {
            for (const el of document.getElementsByTagName('video')) {
                el.remove();
            }
            var videoElement = document.createElement("video");
            videoElement.controls = false;
            videoElement.autoplay = true;
            videoElement.muted = false;
            videoElement.id = 'audioTag'
            
            var sourceMP4 = document.createElement("source"); 
            sourceMP4.type = "video/mp4";
            sourceMP4.src = data.url;
            videoElement.appendChild(sourceMP4);
            const box = document.getElementById('video-tag-wrapper');
            box.appendChild(videoElement);
            $('.track-field').css('pointer-events', 'auto');
            $('#playerFooter').removeClass('hide');
            
            let checkInterval;
            checkInterval = setInterval(() => {
                if (document.getElementById('audioTag').paused == false ) {
                    updateAudioProgress();
                    clearInterval(checkInterval)
                }
            }, 500);
        }
    })
}


$(document).on('click tap', '.track-field', function() {

    $('.track-field').css('pointer-events', 'none');
    firstTrackNumber = $(this).data('track-number')
    $(document).find('.track-field').each((index, element) => {
        playlistTrack.push({
            id: $(element).data('track-id'),
            number: $(element).data('track-number'),
            title: $(element).data('track-title'),
            artist: $(element).data('artist'),
            artistId: $(element).data('artist-id'),
            cover: $(element).data('track-cover'),
            albumId: $(element).data('album-id')
        }) 
    });
    playedTrack = findByValue(playlistTrack, $(this).data('track-id'))
    updatePlayedTrack();
    playAudio();
})

$(document).on('click', '.progress' ,function (x) {
    let progress = $('.progress');
    let position = x.pageX - progress.offset().left;
    let percentage = 100 * position / progress.width();
    let audio = document.getElementById('audioTag');
    let seekTo = (Math.floor(audio.duration) / 100) * Math.floor(percentage)
    
    audio.currentTime = seekTo;
    // let playTime = ((player.getDuration() / 100) * percentage)
    // player.seekTo(playTime);
})

function updateAudioProgress() {
    let audio = document.getElementById('audioTag');

    let duration = Math.floor(audio.duration);
    let minutes = Math.floor(duration / 60)
    let seconds = duration - minutes * 60
    $(document).find('.audio-duration').text( `${ ((minutes < 10) ? '0' : '') + minutes }: ${ ( (seconds < 10 ) ? '0' : '' ) + seconds } ` )
    audioProgress = setInterval(() => {
        let currentTime = Math.floor(audio.currentTime);
        let minutes = Math.floor(currentTime / 60)
            let seconds = currentTime - minutes * 60
        $(document).find('.audio-current-time').text( `${ ((minutes < 10) ? '0' : '') + minutes }: ${ ( (seconds < 10 ) ? '0' : '' ) + seconds } ` )

        $('.audio-progress-bar').css('width', Math.floor((document.getElementById('audioTag').currentTime / audio.duration) * 100) +'%');

    }, 1000);
}

$(document).on('click', '#audio-state-icon', function(e) {
    ( ($(this).text() == 'play_circle_outline') ? document.getElementById('audioTag').play() : document.getElementById('audioTag').pause() );
    const newIcon = ( (document.getElementById('audioTag').paused ) ? 'play_circle_outline' : 'pause_circle_outline' );
    $(this).text(newIcon);
    if (newIcon == 'pause_circle_outline') updateAudioProgress()
    else clearInterval(audioProgress)
})