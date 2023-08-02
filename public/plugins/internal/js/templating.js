function initSplide(element, customConfigs = null) {
    Splide.defaults = {
        type: 'slide',
        perPage    : 5,
        perMove: 2,
        preloadPages: 1,
        pagination: false,
        gap: '1rem',
        lazyLoad: 'nearby',
        breakpoints: {
            640: {
                perPage: 2,
            },
            800: {
                perPage: 2,
            },
        }
    }
    
    if (customConfigs != null) {
        // override default config
        for (const [key, value] of Object.entries(customConfigs)) {
            Splide.defaults[key] = value
        }
    }
    
    new Splide(element).mount();
}

function appendCardsComponent(cardTitle, json, idName, appendTo, cardTextFrom = 'title') {
    $.ajax({
        url: '/api/get-cards-component', 
        method: 'POST',
        data: {
            json: JSON.stringify(json),
            title: cardTitle,
            idName: idName,
            cardTextFrom: cardTextFrom
        },
        dataType: 'html',
        success: function (data) {
            $(document).find(appendTo).html(data)
            initSplide('#'+idName)
        }
    })
}


$(document).on("click", "a", function(event){
    event.preventDefault();
    let link = $(this).attr('href');
    if (link != 'javascript:void(0);' || link != '#' || link != '') changePage(link);
    return;
});

const decodeEntities = (function() {
    // this prevents any overhead from creating the object each time
    let element = document.createElement('div');
  
    function decodeHTMLEntities (str) {
      if(str && typeof str === 'string') {
        // strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = '';
      }
  
      return str;
    }
  
    return decodeHTMLEntities;
})();


function changePage(url, pushState = 1) {
    invalidUrl = ['javascript:void(0);', '#', '', window.location.pathname]
    if (invalidUrl.includes(url) && pushState == 1) return;
    $('body').removeClass('loaded')
    $.ajax({
        url: (url.includes('?')) ? url+'&layout=false' : url+'?layout=false',
        dataType: 'html',
        success: function(response) {
            $('.changeable-content').html(response);
            if(pushState) history.pushState(null, null, url);
            $('body').addClass('loaded');
            M.AutoInit();
            $('.track-dropdown-trigger').dropdown({
                coverTrigger: false,
                constrainWidth: false
            });
            return document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    })
}

window.addEventListener('popstate', () => {
    return changePage(window.location.pathname, 0);
});
