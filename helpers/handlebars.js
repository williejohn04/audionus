
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
        let hours = ~~(time / 3600);
        let minute = ~~((time % 3600) / 60);
        let second = ~~time % 60;

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
    getContributors: function (rawData) {
        let result = '';
        rawData.forEach((contributor, index) => {

            if (index !== rawData.length - 1) {
                result += `
          <a class="grey-text lighten-5 hide-on-med-and-down" href="/artist/${contributor.id}">${contributor.name}, </a>
        `
            }
            else {
                result += `
          <a class="grey-text lighten-5 hide-on-med-and-down" href="/artist/${contributor.id}">${contributor.name}</a>
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