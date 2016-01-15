angular.module("proton.filters",[])

.filter('delay', function ($translate) {
    return function (input) {
        // get the current moment
        var now = moment();
        var then = moment.unix(input);

        if(then.isAfter(now)) {
            // get the difference from now to then in ms
            var ms = then.diff(now, 'milliseconds', true);

            // update the duration in ms
            ms = then.diff(now, 'milliseconds', true);
            days = Math.floor(moment.duration(ms).asDays());

            then = then.subtract(days, 'days');
            // update the duration in ms
            ms = then.diff(now, 'milliseconds', true);
            hours = Math.floor(moment.duration(ms).asHours());

            then = then.subtract(hours,'hours');
            // update the duration in ms
            ms = then.diff(now, 'milliseconds', true);
            minutes = Math.floor(moment.duration(ms).asMinutes());

            then = then.subtract(minutes, 'minutes');
            // update the duration in ms
            ms = then.diff(now, 'milliseconds', true);
            seconds = Math.floor(moment.duration(ms).asSeconds());

            // concatonate the variables
            return days + ' ' + $translate.instant('DAYS') + ' ' + hours + ' ' + $translate.instant('HOURS') + ' ' + minutes + ' ' + $translate.instant('MINUTES') + ' ' + seconds + ' ' + $translate.instant('SECONDS');
        } else {
            return '';
        }
    };
})

.filter("capitalize", function() {
    return function(value) {

        if (value) {
            return angular.uppercase(value).substring(0, 1) + angular.lowercase(value).substring(1);
        } else {
            return value;
        }
    };
})

.filter('number', function () {
    return function (input, places) {
        if (isNaN(input)) {
            return input;
        }
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");

        return Math.round(input * factor) / factor;
    };
})

.filter('labels', function(authentication) {
    return function(labels) {
        var labelsFiltered = [];
        var currentLabels = _.map(authentication.user.Labels, function(label) {
            return label.ID;
        });

        _.each(labels, function(label) {
            var value;

            if(angular.isObject(label)) {
                value = label.ID;
            } else if(angular.isString(label)) {
                value = label;
            }

            if(currentLabels.indexOf(value) !== -1) {
                labelsFiltered.push(label);
            }
        });

        return labelsFiltered;
    };
})

/* Returns boolean */
.filter('showLabels', function(authentication) {
    return function(labels) {
        var labelsFiltered = [];
        var currentLabels = _.map(authentication.user.Labels, function(label) {
            return label.ID;
        });

        _.each(labels, function(label) {
            var value = label;

            if(angular.isObject(label)) {
                value = label.ID;
            }

            if(currentLabels.indexOf(value) !== -1) {
                labelsFiltered.push(label);
            }
        });

        return labelsFiltered.length > 0 ? 1 : 0;
    };
})

.filter('currency', function() {
    return function(amount, currency) {
        var result;

        switch(currency) {
            case 'EUR':
                result = amount + ' €';
                break;
            case 'CHF':
                result = amount + ' CHF';
                break;
            case 'USD':
                result = '$' + amount;
                break;
        }

        return result;
    };
})

.filter('readableTime', function() {
    return function(time) {
        var m = moment.unix(time);

        if (m.isSame(moment(), 'day')) {
            return m.format('h:mm a');
        } else {
            return m.format('ll');
        }
    };
})

.filter('utcReadableTime', function() {
    return function(time) {
        var m = moment.unix(time);

        return m.utc().format('LL h:mm a');
    };
})

.filter('localReadableTime', function() {
    return function(time) {
        var m = moment.unix(time);

        return m.format('LL h:mm a');
    };
})

.filter('longReadableTime', function() {
    return function(time) {
        var m = moment.unix(time);

        if (m.isSame(moment(), 'day')) {
            if (m.isSame(moment(), 'hour')) {
                return m.fromNow();
            } else {
                return m.format('h:mm a');
            }
        } else {
            return m.format('l');
        }
    };
})

.filter('displayName', function() {
    return function(value) {
        if(angular.isDefined(value)) {
            value = value.replace(/</g, "");
            value = value.replace(/>/g, "");
            value = value.replace(/\@/g, "");
        } else {
            value = '';
        }

        return value;
    };
})

// unused
.filter('purify', function($sce) {
    // var dirty = $sce.trustAsHtml(value);
    // var config = {
    //     ALLOWED_TAGS: ['a', 'img', 'p', 'div', 'table', 'tr', 'td', 'tbody', 'thead'],
    //     ALLOWED_ATTR: ['style', 'href'],
    //     // KEEP_CONTENT: false, // remove content from non-white-listed nodes too
    //     // RETURN_DOM: false // return a document object instead of a string
    // };
    // return function(value) {
    //     return dirty;
    //     // return DOMPurify.sanitize(dirty);
    // };
    // var c = {
    //     ALLOWED_TAGS: ['b', 'q'],
    //     ALLOWED_ATTR: ['style']
    // };
    // getTrustedHtml
    // trustAsHtml
    return function(value) {
        return $sce.trustAsHtml(value);
    };
})

.filter("humanDuration", function () {
    return function (input, units) {
        var duration = moment.duration(Math.round(input), units);
        var days = duration.days();
        var cmps = [];
        if (days === 1) {
            cmps.push("a day");
        } else if (days > 1) {
            cmps.push(days + " days");
        }

        duration.subtract(days, 'days');
        var hours = duration.hours();
        if (hours === 1) {
            cmps.push("an hour");
        } else if (hours > 1) {
            cmps.push(hours + " hours");
        }
        return cmps.join(" and ");
    };
})

.filter('contact', function(authentication) {
    return function(contact, parameter) {
        var same = contact.Address === contact.Name;
        var alone = angular.isUndefined(contact.Name) || contact.Name.length === 0;
        var found = _.findWhere(authentication.user.Contacts, {Email: contact.Address});

        if(parameter === 'Address') {
            return '<' + contact.Address + '>';
        } else if(parameter === 'Name') {
            if(angular.isDefined(found) && angular.isString(found.Name) && found.Name.length > 0) {
                return found.Name;
            } else if(angular.isDefined(contact.Name) && contact.Name.length > 0) {
                return contact.Name;
            } else {
                return contact.Address;
            }
        } else {
            if(same || alone) {
                return contact.Address;
            } else if(angular.isDefined(found) && angular.isString(found.Name) && found.Name.length > 0) {
                return found.Name + ' <' + contact.Address + '>';
            } else {
                return contact.Name + ' <' + contact.Address + '>';
            }
        }
    };
})

.filter("humanSize", function (CONSTANTS) {
    return function (input, withoutUnit) {
        var bytes;
        var unit = "";
        var kb = CONSTANTS.BASE_SIZE;
        var mb = kb*kb;
        var gb = mb*kb;

        if (_.isNumber(input)) {
            bytes = input;
        }
        else if (_.isNaN(bytes = parseInt(input))) {
            bytes = 0;
        }

        if (bytes < mb) {
            if (!!!withoutUnit) {
                unit = " KB";
            }
            return (bytes/kb).toFixed(1) + unit;
        }
        else if (bytes < gb) {
            if (!!!withoutUnit) {
                unit = " MB";
            }
            return (bytes/kb/kb).toFixed(2) + unit;
        }
        else {
            if (!!!withoutUnit) {
                unit = " GB";
            }
            return (bytes/kb/kb/kb).toFixed(2) + unit;
        }

    };
})

.filter('bytes', function() {
	return function(bytes, precision) {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
            return '-';
        } else {
            var kb = 1000;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
    			number = Math.floor(Math.log(bytes) / Math.log(kb));

    		if (typeof precision === 'undefined') {
                precision = 1;
            }

    		return (bytes / Math.pow(kb, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        }
	};
})

.filter('range', function() {
    return function(val, range) {
        range = parseInt(range);

        for (var i=1; i<range; i++) {
            val.push(i);
        }

        return val;
    };
});
