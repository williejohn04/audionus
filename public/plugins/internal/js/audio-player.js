let playlistTrack = [], playedTrack, firstTrackNumber, audioProgress, shuffleState = 0, repeatState = 0, queueTrack = [], checkInterval;

function updatePlayedTrack() {
    $(document).find('#audio-state-icon').text(`pause_circle_outline`);
    $(document).find('#audio-player-cover').attr('src', playedTrack.cover);
    $(document).find('#audio-player-title').text(playedTrack.title);
    $(document).find('#audio-player-artist').text(playedTrack.artist);
}

function initAudioPlayer(url) {
    clearInterval(checkInterval); clearInterval(audioProgress);
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
    sourceMP4.src = url;
    videoElement.appendChild(sourceMP4);
    const box = document.getElementById('video-tag-wrapper');
    box.appendChild(videoElement);

    checkInterval = setInterval(() => {
        if (document.getElementById('audioTag').paused == false ) {
            runAudioProgressBar();
            clearInterval(checkInterval)
        }
    }, 500);
}

function playAudio() {
    if (playedTrack.audioUrl) {
        initAudioPlayer(playedTrack.audioUrl) 
    } else {
        $.ajax({
            method: 'get' ,
            url: '/api/playback/getVideoId',
            data: {title: playedTrack.title, artist: playedTrack.artist},
            success: function (data) {
                initAudioPlayer(data.url);
                const index = queueTrack.map( (loopVariable) => loopVariable.id).indexOf(playedTrack.id);
                queueTrack[index].audioUrl = data.url;
            }
        })
    }
    $('.track-field').css('pointer-events', 'auto');
    $('#playerFooter').removeClass('hide');
}

function changeTrack(state, ignoreRepeat = 0) {
    let currentIndex = ((playedTrack) ? queueTrack.findIndex(x => x.id == playedTrack.id ) : -1 ) 
    if (state == 1 && ignoreRepeat == 1) { 
        if (currentIndex + 1 < queueTrack.length) {
            playedTrack = queueTrack[currentIndex + 1]
        } else return;
    }
     else if (state == 0 && ignoreRepeat == 1) {
        if (currentIndex - 1 >= 0) {
            playedTrack = queueTrack[currentIndex - 1]
        }
    }
    updatePlayedTrack();
    playAudio();


}

function runAudioProgressBar() {
    let audio = document.getElementById('audioTag');

    let duration = Math.floor(audio.duration);
    let minutes = Math.floor(duration / 60)
    let seconds = duration - minutes * 60
    $(document).find('.audio-duration').text( `${ ((minutes < 10) ? '0' : '') + minutes }: ${ ( (seconds < 10 ) ? '0' : '' ) + seconds } ` )
    audioProgress = setInterval(() => {
        if (audio.ended != true) {
            let currentTime = Math.floor(audio.currentTime);
            let minutes = Math.floor(currentTime / 60)
                let seconds = currentTime - minutes * 60
            $(document).find('.audio-current-time').text( `${ ((minutes < 10) ? '0' : '') + minutes }: ${ ( (seconds < 10 ) ? '0' : '' ) + seconds } ` )
    
            $('.audio-progress-bar').css('width', (document.getElementById('audioTag').currentTime / audio.duration) * 100 +'%');
        } else {
            clearInterval(audioProgress)
            changeTrack(1);
        }

    }, 1000);
}

function shuffleTrack(array) {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = array[i];
            array[i] = array[j];
            array[j] = x;
    }
    return array;
}

function updateQueueTrack() {
    // new queue
    if (playlistTrack.length <= 0) return console.log('absolutely not!');

    queueTrack = [];

    if (shuffleState) {
        queueTrack = shuffleTrack(playlistTrack).filter((arr) => {return arr.id != playedTrack.id } );
        queueTrack.unshift(playedTrack);
    } else {
        queueTrack = playlistTrack.reduce((acc, curr) => {     
            if (curr.number > firstTrackNumber) acc.push(curr);
            return acc;
        }, []);
        queueTrack = queueTrack.sort(function(a, b) { return a.number - b.number });
        queueTrack.unshift(playedTrack);
    }
}

$(document).on('click tap', '.track-field', function() {
    playlistTrack = [];
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
    clearInterval(audioProgress)
    updatePlayedTrack();
    updateQueueTrack();
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

$(document).on('click', '#audio-state-icon', function(e) {
    ( ($(this).text() == 'play_circle_outline') ? document.getElementById('audioTag').play() : document.getElementById('audioTag').pause() );
    const newIcon = ( (document.getElementById('audioTag').paused ) ? 'play_circle_outline' : 'pause_circle_outline' );
    $(this).text(newIcon);
    if (newIcon == 'pause_circle_outline') runAudioProgressBar()
    else clearInterval(audioProgress)
})


$(document).on('click tap', '.shuffle-state-icon, .repeat-state-icon', function(e) {
    let cond;
    if ($(this).data('type') == 'shuffle') cond = shuffleState = !shuffleState;updateQueueTrack();
    if ($(this).data('type') == 'repeat') cond = repeatState = !repeatState;
    if (cond) $(this).addClass('blue-grey-text text-darken-2')
    else $(this).removeClass('blue-grey-text text-darken-2')
})