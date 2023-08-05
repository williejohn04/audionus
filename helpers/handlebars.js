
const helpers = {
    getCardText: function (data, key) {
        return data[key]
    },
    increaseNumber: function (value, increaseBy) {
        return value + increaseBy
    },
    object: function({hash}) {
        return hash
    },
    array: function () {
        return Array.from(arguments).slice(0, arguments.length-1)
    },
    compareValues: function (v1, v2, type, options) {
        if(v1 === v2 && type == 'equal') return options.fn(this);
        else if (v1 > v2 && type == 'greater') return options.fn(this);
        else if (v1 < v2 && type == 'lower') return options.fn(this);
        else if (v1 !== v2 && type == 'notequal') return options.fn(this);
        
        return options.inverse(this);
    },
    formatNumberWithSeperator: function(number) {
        return number.toLocaleString()
    },
    fixDuration: function (time, type = 'track') {
        const hours = ~~(time / 3600);
        const minute = ~~((time % 3600) / 60);
        const second = ~~time % 60;

        if (time >= 3600) {
            return `${hours} h ${minute} mins`
        } else {
            if (type == 'album') return `${minute} mins`
            else return `${minute}:${second}`
        }

    },
    changeDateFormat: function (date) {
        date = date.split('-');
        return `${date[2]}/${date[1]}/${date[0]}`
    },
    getLinks: function (rawData, type) {
        let result = '';
        rawData.forEach((i, index) => {

            if (index !== rawData.length - 1) {
                result += `
          <a class="grey-text lighten-5" href="/${type}/${i.id}">${i.name}, </a>
        `
            }
            else {
                result += `
          <a class="grey-text lighten-5" href="/${type}/${i.id}">${i.name}</a>
        `
            }

        })

        return result;

    },
    getInitialNames: function (name) {
        return name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
    }
}

module.exports = helpers;