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

function appendQueueList() {
    let html = '';
    for (let index = 0; index < queueTrack.length; index++) {
        html += `
        <tr style="border-bottom:1px solid #212121;" class="track-field-wrapper" data-track-id="${queueTrack[index].id}" data-track-number="${index}" data-track-title="${queueTrack[index].title}" data-track-cover="${queueTrack[index].cover}" data-album-id="${queueTrack[index].albumId}" data-artist-id="${queueTrack[index].artistId}" data-artist="${queueTrack[index].artist}" id="${queueTrack[index].id}" data-album="${queueTrack[index].album}>
            <td class="c-pointer">
                <a href="javascript:void(0);"><img width="45px" height="45px" src="{{this.album.cover_small}}" class="responsive-img"> </a>
            </td>
            <td class="c-pointer">
                <a href="javascript:void(0);" class="white-text clamp-overflow">${queueTrack[index].title}</a>
                <a class="grey-text lighten-5 clamp-overflow" style="-webkit-line-clamp: 1 !important;" href="javascript:void(0);">${queueTrack[index].artist}</a>
            </td>
            <td class="c-pointer">
                <a class="grey-text lighten-5 clamp-overflow" style="-webkit-line-clamp: 2 !important;" href="javascript:void(0);">${queueTrack[index].album}</a>
            </td>
            <td class="c-pointer">
                <a href="javascript:void(0);" class="grey-text">${fixDuration(queueTrack[index].duration)}</a>
            </td>
        </tr>
        `

        if (index == queueTrack.length - 1) $(document).find('#queue-list-table').html(html)
    }
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
            changeTrack(1, 1);
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

let test;
$(document).on('click tap', '.track-field', function() {
    playlistTrack = [];
    $('.track-field').css('pointer-events', 'none');
    $(this).parent().css('background-color', '#212121');
    setTimeout(() => {
        $(this).parent().css('background-color', '');
    }, 750);
    firstTrackNumber = $(this).parent().data('track-number')
    test = $(this)
    $(document).find('.track-field-wrapper').each((index, element) => {
        playlistTrack.push({
            id: $(element).data('track-id'),
            number: $(element).data('track-number'),
            title: $(element).data('track-title'),
            artist: $(element).data('artist'),
            artistId: $(element).data('artist-id'),
            cover: $(element).data('track-cover'),
            albumId: $(element).data('album-id'),
            album: $(element).data('album'),
            duration: $(element).data('duration')
        }) 
    });
    playedTrack = findByValue(playlistTrack, $(this).parent().data('track-id'))
    clearInterval(audioProgress)
    updatePlayedTrack();
    updateQueueTrack();
    appendQueueList();
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
    if (cond) $(this).addClass('blue-text text-darken-2')
    else $(this).removeClass('blue-text text-darken-2')
})


$(document).find("#queue-modal-trigger").animatedModal({
    animatedIn: 'bounceInUp',
    animatedOut: 'bounceOutDown',
    animationDuration: '.3s',
    color: '#010101',
    beforeOpen: function() {
        $(document).find('#queue-modal-trigger i').addClass('blue-text text-darken-2').removeClass('white-text');
    },
    afterClose: function() {
        $(document).find('#queue-modal-trigger i').removeClass('blue-text text-darken-2').addClass('white-text');
    }
});

$(document).on('click', '#queue-modal-trigger', function() {
    if ($(this).data('opened')) {
        $(document).find('#btn-close-modal').trigger('click')
    }
    $(this).data('opened', !$(this).data('opened'))
})




// $(document).on('click', '.queue-modal-trigger', function() {
//     $(document).find('.modal').modal('open');
// })