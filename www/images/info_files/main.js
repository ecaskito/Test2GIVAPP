var modern = {
    noItems: true
};
$(function() {
    // CC 3.0
    var included = {
        doTheyCount: true,
        tooltip: '',
        shade: 'light',
        className: '',
        fourLines: false
    };
    // CC 3.0 with attribution
    var others = {
        'climacons': {
            doTheyCount: false,
            tooltip: 'Climacons by @adamwhitcroft',
            shade: 'dark',
            className: 'climacons',
            fourLines: true,
            link: 'http://adamwhitcroft.com/climacons/'
        }
    };
    var count = 0;
    function load(limit, skip) {
        $.ajax({
            url: '/icons/package' + (limit == 0 ? '' : '?limit=' + limit) + (skip == 0 ? '' : '?skip=' + skip),
            dataType: "json",
            success: function (data) {
                
                for (var i = 0, c = data.length; i < c; i++) {
                    var type = included;
                    for (var partialMatch in others) {
                        var r = new RegExp(partialMatch.replace('.', '\.'), 'i');
                        if (r.test(data[i].name)) {
                            type = others[partialMatch];
                            break;
                        }
                    }
                    var li = null;
                    var totalIcons = os == 'windowsphone' ? 4 : os == 'android' ? 4 : 5;
                    var $svg = $('<svg width="76px" height="76px">' + data[i].svg + '</svg>').appendTo(
                        $('<a>').attr('title', data[i].name + ' ' + type.tooltip).powerTip({ placement: 's' }).data('name', data[i].name + ' ' + type.tooltip).appendTo(
                            li = $('<li>').appendTo('#icons').addClass(type.className)
                        ).click(function () {
                            if (modern.noItems) {
                                $('#appbarWrap').empty();
                                modern.noItems = false;
                            }
                            var iconCount = $('#appbarWrap').children().length;
                            if (iconCount != totalIcons) {
                                $('#appbar').removeClass('icon-count-1')
                                    .removeClass('icon-count-2')
                                    .removeClass('icon-count-3')
                                    .removeClass('icon-count-4')
                                    .removeClass('icon-count-5')
                                    .addClass('icon-count-' + (iconCount + 1));
                                $.ajax({
                                    url: $(this).data('appbar'),
                                    success: function (data) {
                                        var svg = data.childNodes[1];
                                        if (os == "ios") { // little lazy
                                            var xmlns = "http://www.w3.org/2000/svg";
                                            var linearGradient = document.createElementNS(xmlns, 'linearGradient');
                                            linearGradient.setAttributeNS(null, 'id', 'gradient_' + iconCount);
                                            linearGradient.setAttributeNS(null, 'gradientUnits', 'objectBoundingBox');
                                            linearGradient.setAttributeNS(null, 'x1', '0.283333');
                                            linearGradient.setAttributeNS(null, 'y1', '0.000520833');
                                            linearGradient.setAttributeNS(null, 'x2', '1.3');
                                            linearGradient.setAttributeNS(null, 'y2', '0.000520833');
                                            linearGradient.setAttributeNS(null, 'gradientTransform', 'rotate(79.611145 0.283333 0.000521)');
                                            var stops = [];
                                            if (iconCount == 0) {
                                                stops.push({ offset: '0', stopColor: '#B1D8FF' });
                                                stops.push({ offset: '0.469828', stopColor: '#8EC5FF' });
                                                stops.push({ offset: '0.482759', stopColor: '#41A5FD' });
                                                stops.push({ offset: '1', stopColor: '#46D1FA' });
                                            } else {
                                                stops.push({ offset: '0', stopColor: '#9A9A9A' });
                                                stops.push({ offset: '1', stopColor: '#656565' });
                                            }
                                            for (var i = 0, c = stops.length; i < c; i++) {
                                                var stop = document.createElementNS(xmlns, 'stop');
                                                stop.setAttribute('offset', stops[i].offset);
                                                stop.setAttribute('stop-color', stops[i].stopColor);
                                                stop.setAttribute('stop-opacity', '1');
                                                linearGradient.appendChild(stop);
                                            }
                                            svg.appendChild(linearGradient);
                                            for (var i = 0, c = svg.childNodes.length; i < c; i++) {
                                                if (svg.childNodes[i].nodeName == 'path' || svg.childNodes[i].nodeName == 'rect') {
                                                    svg.childNodes[i].setAttributeNS(null, 'fill', 'url(\'#gradient_' + iconCount + '\')');
                                                }
                                            }
                                        }
                                        $(svg).appendTo($('<a />', {
                                            'class': 'icon icon-' + (iconCount + 1)
                                        }).appendTo('#appbarWrap'));
                                    },
                                    failure: function () {
                                        // Failed to load SVG
                                    }
                                });
                            }
                            $.ajax({
                                url: $(this).data('appbar').replace('.svg', '.xaml').replace('/svg', '/xaml'),
                                dataType: 'text',
                                success: function (data) {
                                    $('#preview').text(data.replace(/\r?\n$/, ''));
                                    $('#preview').show();
                                    $('#preview').height(20);
                                    $('#preview').scrollTop(999);
                                    $('#preview').height($('#preview').scrollTop() + 30);
                                },
                                failure: function () {
                                    // Failed to load SVG
                                }
                            });
                            return false;
                        }).css({
                            backgroundImage: type.fourLines
                                ? 'url('
                                 + '/icons/'
                                 + 'svg/'
                                 + data[i].name
                                 + '.svg'
                                  + ')'
                                : ''
                        }).data({
                            'appbar': '/icons/'
                                 //+ 'dark/'
                                 + 'svg/'
                                 + data[i].name
                                 + '.svg'
                        }).addClass('inner')
                    );
                    if (type.fourLines) {
                        $('<a>').appendTo(
                            $('<div>').appendTo(li).addClass('external')
                        ).attr({ href: type.link, title: 'External Download for ' + type.tooltip });
                    }
                    if (type.doTheyCount) {
                        count++;
                    }
                }
                if (limit != 99) {
                    $('#headerIconCount').text(count);
                    $('#includedIconCount').text(count);
                }
                // Search Filter
                var location = window.location.toString().match(/q=(.+)/);
                if (location != null) {
                    $('#search').val(location[1]);
                    $('#search').trigger('keyup');
                }
                if (limit == 99) {
                    load(0, 99);
                }
            }
        });
    }
    load(99, 0);
    modern.clearAppbar = function () {
        $('#appbarWrap').empty();
        $('#appbar').removeClass('icon-count-1')
                    .removeClass('icon-count-2')
                    .removeClass('icon-count-3')
                    .removeClass('icon-count-4')
                    .removeClass('icon-count-5')
                    .addClass('icon-count-1');
        $.ajax({
            url: '/images/' + os + '-none.svg',
            success: function (data) {
                var svg = data.childNodes[1];
                $(svg).appendTo(
                    $('<a>', {
                        'class': 'icon icon-1'
                    }).appendTo('#appbarWrap')
                );
            },
            failure: function () {
                // Failed to load SVG
            }
        });
        this.noItems = true;
    };
    $('#appbar').click(function() {
        modern.clearAppbar();
        return false;
    }).mouseenter(function() {
        $('#clearMessage').show();
    }).mouseleave(function() {
        $('#clearMessage').hide();
    });
    $('#inChicago').click(function () {
        $.confirm({
            'title': 'Do you live in Chicago?',
            'message': 'If you live in Chicago click the tweet button and we\'ll get a beer; if not maybe consider donating and tweeting.',
            'buttons': {
                'Tweet': {
                    'class': 'blue',
                    'action': function () {
                        window.location = $('#inChicago').attr('href');
                    }
                },
                'Cancel': {
                    'class': 'gray',
                    'action': function () { }	// Nothing to do in this case. You can as well omit the action property.
                }
            }
        });
        return false;
    });
    $('#webfonts').click(function () {
        $.confirm({
            'title': 'Web Fonts <a class="dialog-close" href="javascript:$.confirm.hide()">X</a>',
            'message': 'Web Fonts are a great way to add iconography quickly in the web. Be sure to download the free Social font and check out others at Creative Market.'
                     + '<a class="dialog-button-download" href="/downloads/ModernUIIconsSocial.zip">'
                       + '<svg width="34" height="26">'
					     + '<path fill="#FFF" fill-opacity="1" stroke-linejoin="round" d="M 17,23L 33,23L 33,26L 17,26L 17,23 Z M 23,1.90735e-006L 27,5.72205e-006L 27,13L 32,7.50001L 32,14L 25,21L 18,14L 18,7.50001L 23,13L 23,1.90735e-006 Z "/>'
				       + '</svg>'
                       + 'Download the Free Social Icon Font</a>'
                     + '<a class="dialog-button-creativemarket" target="_blank" href="https://creativemarket.com/templarian">'
                       + '<svg width="40" height="26" class="creativemarket-icon">'
	                     + '<path fill="#7FAA42" fill-opacity="1" stroke-linejoin="round" d="M 35.3342,6.37368C 34.467,6.37368 33.7667,5.67176 33.7667,4.80639C 33.7667,3.94095 34.467,3.24063 35.3342,3.24063C 36.1964,3.24063 36.8966,3.94095 36.8966,4.80639C 36.8966,5.67176 36.1964,6.37368 35.3342,6.37368 Z M 29.6704,13.3204L 32.9815,14.8929L 31.7636,17.0719L 28.7011,15.0721C 28.6301,15.0252 28.5494,15.0011 28.4688,15.0011C 28.3978,15.0011 28.327,15.0188 28.2624,15.0558C 28.1252,15.1348 28.0462,15.2849 28.0575,15.4428L 28.3107,19.0652L 25.8594,19.0652L 25.8481,19.0652C 25.8577,19.0344 26.0496,15.4412 26.0496,15.4412C 26.0609,15.2833 25.9819,15.1332 25.8448,15.0542C 25.706,14.9751 25.5368,14.9816 25.4062,15.0703L 22.429,17.0927L 21.1,14.9785L 24.4401,13.3204C 24.5836,13.2528 24.6755,13.1075 24.6755,12.9479C 24.6755,12.7882 24.5836,12.6431 24.4401,12.5754L 21.1275,11.0028L 22.345,8.82413L 25.4062,10.8255C 25.5368,10.9126 25.706,10.9222 25.8448,10.8416C 25.9819,10.7626 26.0609,10.6126 26.0496,10.4545L 25.798,6.8322L 28.251,6.8322L 28.0575,10.4545C 28.0462,10.6126 28.1252,10.7626 28.2624,10.8416C 28.401,10.9222 28.5721,10.9126 28.7011,10.8255L 31.6783,8.80302L 33.0071,10.9175L 29.6704,12.5754C 29.5267,12.6431 29.4348,12.7882 29.4348,12.9479C 29.4348,13.1075 29.5267,13.2528 29.6704,13.3204 Z M 39.9979,10.1277C 39.9979,9.13198 39.5692,3.21202 39.5692,3.21202C 39.5692,2.2736 39.2214,1.64465 38.7847,1.21599C 38.3576,0.78089 37.7288,0.43145 36.7904,0.43145C 36.7904,0.43145 30.8703,0.00279045 29.873,0.00279045C 28.4423,0.00279045 27.4879,-0.0385208 25.6951,1.75588C 24.8233,2.62608 15.1604,12.2905 14.7523,12.697C 14.3457,13.1036 12.9706,14.7074 15.316,17.0528L 19.0272,20.764L 19.2368,20.9735L 22.9479,24.6864C 25.2949,27.0333 26.8988,25.6551 27.3053,25.2485C 27.7118,24.8418 37.3763,15.1774 38.2465,14.3072C 40.0409,12.5128 39.9979,11.56 39.9979,10.1277 Z "/>'
                       + '</svg>'
                       + 'View other Font Collections'
                         + '<svg width="74" height="26" class="creativemarket-logo">'
                           + '<path fill="#7FAA42" fill-opacity="1" stroke-width="1.33364" stroke-linejoin="round" d="M 54.3596,22.1202L 54.3596,21.3661L 58.1199,21.3661L 58.1199,22.1202L 56.6504,22.1202L 56.6504,26L 55.8291,26L 55.8291,22.1202L 54.3596,22.1202 Z M 20.3777,23.5576L 21.7877,21.3661L 22.6548,21.3661L 22.6548,26L 21.8406,26L 21.8406,22.6767L 20.3777,24.8611L 20.3509,24.8611L 18.9014,22.6905L 18.9014,26L 18.1,26L 18.1,21.3661L 18.9676,21.3661L 20.3777,23.5576 Z M 27.3751,24.1599L 28.9707,24.1599L 28.1695,22.3061L 27.3751,24.1599 Z M 27.8058,21.3328L 28.5603,21.3328L 30.5991,26L 29.7386,26L 29.2685,24.8813L 27.0777,24.8813L 26.6007,26L 25.7665,26L 27.8058,21.3328 Z M 34.5252,23.6634L 35.7167,23.6634C 36.2996,23.6634 36.67,23.3584 36.67,22.8886L 36.67,22.8759C 36.67,22.3797 36.3127,22.1075 35.7102,22.1075L 34.5252,22.1075L 34.5252,23.6634 Z M 37.4979,22.8423C 37.4979,23.6031 37.0406,24.0602 36.3988,24.2463L 37.6495,26L 36.6833,26L 35.5448,24.3854L 34.5252,24.3854L 34.5252,26L 33.7112,26L 33.7112,21.3661L 35.7761,21.3661C 36.359,21.3661 36.8157,21.5384 37.1136,21.8291C 37.3586,22.081 37.4979,22.4252 37.4979,22.8289L 37.4979,22.8423 Z M 67.0368,8.18707C 66.3535,8.18707 65.5146,10.6954 65.7411,12.4144C 67.7412,12.387 68.0993,8.18707 67.0368,8.18707 Z M 27.0654,6.09805C 26.1313,6.09805 24.7708,9.59224 25.5096,11.6371C 27.9113,9.18764 27.8609,6.09805 27.0654,6.09805 Z M 71.6375,12.9212C 72.0279,11.744 72.3929,14.2443 72.0943,14.7229C 71.7958,15.2011 70.7396,16.3401 68.6867,16.2825C 65.5243,16.1941 64.4213,14.3919 64.0858,13.4814C 62.2162,13.036 61.6329,11.6283 61.4905,10.6668C 61.3015,11.1312 61.1184,11.6598 60.966,12.2659C 60.177,15.3938 59.0652,16.9281 57.4041,15.7063C 56.6605,15.0682 55.8334,14.3823 55.4789,11.7986C 55.409,11.2952 55.331,9.49803 55.4057,8.21274C 55.2419,8.75065 54.6305,10.4014 53.9744,12.3046C 53.3184,14.2077 52.9013,16.2837 51.7992,16.2837C 49.5614,16.2837 49.2759,13.5979 49.4275,9.32559C 49.4202,9.28775 47.9966,16.3754 45.689,16.3296C 45.1825,16.3195 44.4667,16.1571 43.8883,15.4514C 43.4876,14.9644 43.1949,14.4151 42.9818,13.7758C 42.7305,14.5867 41.7959,16.2766 40.6234,16.2766C 38.9405,16.2766 38.4581,14.5942 38.3479,14.3082C 38.1961,14.5736 36.8771,16.2791 35.1581,16.2791C 33.7956,16.2791 32.6227,15.3113 32.3048,14.1346C 31.7682,15.0178 30.6947,16.362 28.4653,16.362C 26.5549,16.362 25.3371,15.5321 24.7551,14.876C 23.7087,15.7075 22.4872,16.2972 20.9554,16.2972C 18.0953,16.2972 17.768,13.6757 17.768,11.5425C 17.768,10.7665 17.8989,9.0703 18.0175,8.03778C 18.25,6.65446 17.99,6.58508 17.597,6.44754C 17.2035,6.3096 16.9417,6.24986 16.4769,6.11655C 16.4769,11.0592 14.6768,15.3147 9.94268,16.211C 9.5917,16.3039 9.21759,16.3531 8.78661,16.3548C 2.94154,16.3712 2.36366,11.8689 2.37113,9.52116C 2.38596,4.82495 5.70804,0.944212 8.17119,0.937059C 10.6343,0.929909 12.3293,1.67645 12.1299,3.40672C 11.9314,5.13701 10.3071,5.18286 10.3927,3.82226C 10.3927,-0.241417 5.18893,4.50278 5.17411,9.09427C 5.17338,9.41013 4.77655,14.8866 9.19005,14.7831L 9.19005,14.7566C 13.1626,14.3095 14.9241,10.2702 14.9241,5.78891C 12.8358,4.74964 13.0246,2.7994 14.3692,2.48942C 15.8567,2.08862 16.5145,3.65613 16.5145,4.98686C 18.1919,5.574 18.1852,5.54413 19.2033,5.87724C 20.2214,6.2116 20.8008,6.43073 20.6978,7.47335C 20.4691,9.13256 20.1954,11.8563 20.4387,13.1874C 20.8681,15.5372 22.3365,14.802 23.7462,13.4276C 23.6001,13.1142 23.502,12.8253 23.4469,12.5944C 23.3368,12.1305 23.0103,10.5613 23.2751,8.88356C 23.6588,6.461 24.9887,4.12802 27.5723,4.19953C 29.3088,4.19953 29.9665,5.7191 29.9665,7.72444C 29.9665,10.2067 27.5648,12.4762 26.3206,13.6521C 26.8858,14.5118 27.6333,15.146 28.5874,15.146C 29.5018,15.146 30.9926,15.0434 31.7682,12.5712C 31.7968,12.4669 31.9913,11.1038 32.027,10.9427C 32.6119,8.304 33.7439,6.62083 34.7407,5.61353C 36.2879,4.19279 38.0507,4.9057 37.693,5.42972C 37.4844,5.73296 37.0668,5.70521 36.2873,6.79579C 34.9003,8.93445 34.0596,11.786 34.6634,13.5954C 34.7795,13.9415 35.2578,14.41 35.7393,14.4071C 37.4234,14.4071 38.0576,7.95996 39.0507,7.95996C 39.5066,7.95996 39.2878,9.53126 39.2387,9.95815C 39.1117,11.0782 39.2611,14.0134 39.9877,14.6128C 41.3575,15.7631 42.7528,13.4696 42.5771,11.5038L 42.5795,11.4222C 42.494,9.72683 42.7126,7.57428 43.187,4.81106C 42.3504,5.07812 41.9576,5.18411 41.0924,5.50503C 40.658,5.66946 40.4451,4.99821 40.9791,4.74544C 41.3032,4.59699 41.9436,4.35934 43.3517,3.87653C 43.5117,3.0038 43.6934,2.07558 43.898,1.08384L 46.3395,0C 46.1203,1.06323 45.9256,2.09829 45.7542,3.09844C 47.7885,2.48059 49.8887,1.96076 51.0283,2.00156L 51.2749,2.02847C 52.1563,2.15339 52.6322,2.82253 52.6031,3.4513C 52.5719,4.13812 51.8059,4.68194 50.594,4.68194C 49.5548,4.66174 49.1137,3.92405 49.1411,3.23891C 48.2754,3.40672 47.0321,3.6965 45.5897,4.09563C 44.8597,8.68168 44.687,12.3189 45.2523,13.5962C 45.9784,15.2361 46.3434,14.5825 47.1337,13.3102C 48.2517,11.4235 49.3205,6.57961 49.3465,6.42988C 49.4044,6.09131 51.6069,4.86069 51.6026,5.90289C 51.5001,8.77841 51.2919,11.7915 51.6534,13.2425C 51.7277,13.5386 52.0505,14.5333 52.6311,13.1008C 52.8863,12.4707 53.6985,10.7186 54.2229,9.26084C 54.7479,7.80351 55.1452,7.23362 55.3161,6.76887C 55.4359,6.45469 57.3909,5.80069 57.4631,6.34618C 57.5494,9.58468 57.6112,12.1599 58.1987,13.568C 58.4114,14.0773 58.8003,14.7171 59.1421,13.6736C 59.3555,13.0213 59.5671,11.8504 59.7351,10.6853C 59.885,9.63977 60.1938,6.87318 62.4471,7.3476C 62.7746,7.42835 62.7664,7.63318 62.5888,8.01254L 62.5888,8.01295C 61.6889,9.81936 62.4848,11.7604 63.8033,12.2894C 63.7354,11.7936 63.7107,11.1858 63.8255,10.5575C 64.1592,8.74183 65.2178,6.37394 67.6749,6.4425C 69.347,6.4896 69.9605,7.65587 69.8711,9.04212C 69.8711,10.9348 68.5959,13.473 66.1384,13.5823C 66.7222,15.2735 68.1785,15.4173 68.8543,15.4173C 69.7092,15.4173 70.9316,14.7709 71.6375,12.9212 Z M 44.8395,21.3661L 42.9068,23.3584L 44.9258,26L 43.9329,26L 42.3504,23.9153L 41.629,24.6563L 41.629,26L 40.8146,26L 40.8146,21.3661L 41.629,21.3661L 41.629,23.6961L 43.8332,21.3661L 44.8395,21.3661 Z M 48.7522,24.0275L 48.7522,25.2719L 51.4071,25.2719L 51.4071,26L 47.9378,26L 47.9378,21.3661L 51.3737,21.3661L 51.3737,22.0946L 48.7522,22.0946L 48.7522,23.2986L 51.0761,23.2986L 51.0761,24.0275L 48.7522,24.0275 Z "/>'
                         + '</svg>'
                       + '</a>',
            'buttons': {}
        });
        return false;
    });
    modern.clearAppbar();
    $('#search').keyup(function () {
        $('#preview').hide();
        var value = $('#search').val();
        if (value == '') {
            $('#search').css({ border: '1px solid #DDD', boxShadow: 'none' });
            $('#icons').children().each(function (index) {
                $(this).show();
            });
        } else if (/^[a-zA-Z0-9\.]+$/.test(value)) {
            $('#search').css({ border: '1px solid #DDD', boxShadow: 'none' });
            var regex = new RegExp(value.replace('.', '\.'), 'i')
            $('#icons').children().each(function (index) {
                if (regex.test($(this).find('a').data('name'))) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            $('#search').css({ border: '1px solid #900', boxShadow: '0 0 4px #F00' });
        }
    });
    $('#headerName').click(function () {
        window.location = "/";
        return false;
    });
    $('#preview').hide();
    $('#preview').scrollTop(999);
    $('#preview').height($('#preview').scrollTop() + 30);
    $('.media a').powerTip({ placement: 's' });
    $('.cc').powerTip({ placement: 's' });
    $('.download').attr('title', 'Please be sure to read the license file')
                  .powerTip({ placement: 's' });
    $('.download-webfonts').attr('title', 'Modern UI Icons - Social (Free Download)')
                  .powerTip({ placement: 's' });
    $('.windowsphone').attr('title', 'Modern UI Icons for Windows')
                      .powerTip({ placement: 's' })
                      .click(function () { window.location = '/' });
    $('.android').attr('title', 'Modern UI Icons for Android')
                 .powerTip({ placement: 's' })
                 .click(function () { window.location = '/android' });
    $('.ios').attr('title', 'Modern UI Icons for iOS')
             .powerTip({ placement: 's' })
             .click(function () { window.location = '/ios' });
    if (window.location.href.match(/\/twitter\//) !== null) {
        var images = window.location.href.match(/\/twitter\/(.*)/)[1].split('/');
        var icons = [];
        for (var i = 0; i < images.length; i++) {
            if (images[i] != "") {
                icons.push('<img src="/icons/svg/appbar.' + images[i] + '.svg" title="' + images[i] + '" style="margin-right:6px;"/>');
            }
        }
        $.confirm({
            'title': 'New Icons',
            'message': 'While the icons below were just added there are hundreds more to checkout in the pack.'
                     + '<div style="padding:0 0 0 20px;">' + icons.join('') + '</div>'
                    + '<a class="dialog-button-download" href="/" style="margin: 10px 25px 0 25px;padding:10px;text-align: center;">'
                    + 'View Modern UI Icons'
                    + '</a>',
            'buttons': {}
        });
    }
});