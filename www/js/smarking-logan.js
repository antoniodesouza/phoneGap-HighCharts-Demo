var myApp = new Framework7({
    modalTitle: 'Logan Admin Portal',
    animateNavBackIcon: true
});

// Expose Internal DOM library
var $$ = Framework7.$;

// Add main view
var mainView = myApp.addView('.view-main', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true
});
// Add another view, which is in right panel
var rightView = myApp.addView('.view-right', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true
});
// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function() {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function() {
    myApp.hideIndicator();
});
//document.location = 'http://google.com';
// Events for specific pages when it initialized
$$(document).on('pageInit', function(e) {
    var page = e.detail.page;
    // Handle Modals Page event when it is init
    remoteURL = '';
    type = 'occupancy';
    isPrediction = 0;

    if (page.name === 'centralWest') {
        remoteURL = 'http://smarking.net:8080/garage?garage=centralWest&';
    } else if (page.name === 'terminalB') {
        remoteURL = 'http://smarking.net:8080/garage?garage=terminalB&';
    } else if (page.name === 'terminalE') {
        remoteURL = 'http://smarking.net:8080/garage?garage=terminalE&';
    } else if (page.name === 'economyLot') {
        remoteURL = 'http://smarking.net:8080/garage?garage=economyLot&';
    }
    $.getJSON(remoteURL + 'type=' + type + '&isPrediction=' + isPrediction).done(function(data) {
        genChartByHighCharts(data, 'chart-content', type, type);
    });

    if (page.name === 'centralWest' || page.name === 'terminalB' || page.name === 'terminalE' || page.name === 'economyLot') {

        $$('.get-chart').on('click', function() {
            $.getJSON(remoteURL + 'type=' + type + '&from=' + $('.from-date').val() + '&to=' + $('.to-date').val()).done(function(data) {
                genChartByHighCharts(data, 'chart-content', type, type, '');
            });
        });

        $$('.history-selected').on('click', function() {
            isPrediction = 0;
            $.getJSON(remoteURL + 'type=' + type + '&isPrediction=' + isPrediction).done(function(data) {
                genChartByHighCharts(data, 'chart-content', type, type, '');
            });
            myApp.closePanel();
        });

        $$('.predicton-selected').on('click', function() {
            isPrediction = 1;
            console.log(isPrediction);
            $.getJSON(remoteURL + 'type=' + type + '&isPrediction=' + isPrediction).done(function(data) {
                genChartByHighCharts(data, 'chart-content', type, type, '');
            });
            myApp.closePanel();
        });

        $$('.occupancy-link').on('click', function() {
            type = 'occupancy';
            $.getJSON(remoteURL + 'type=' + type + '&isPrediction=' + isPrediction).done(function(data) {
                genChartByHighCharts(data, 'chart-content', type, type, '');
            });
        });

        $$('.entry-link').on('click', function() {
            type = 'entry';
            $.getJSON(remoteURL + 'type=' + type + '&isPrediction=' + isPrediction).done(function(data) {
                genChartByHighCharts(data, 'chart-content', type, type, '');
            });
        });

        $$('.exit-link').on('click', function() {
            type = 'exits';
            $.getJSON(remoteURL + 'type=' + type + '&isPrediction=' + isPrediction).done(function(data) {
                genChartByHighCharts(data, 'chart-content', type, type, '');
            });
        });

        $$('.duration-link').on('click', function() {
            type = 'duration';
            $.getJSON(remoteURL + 'type=' + type + '&isPrediction=' + isPrediction).done(function(data) {
                genChartByHighCharts(data, 'chart-content', type, type, 'min');
            });
        });
    }
});

// Required for demo popover
$$('.popover a').on('click', function() {
    myApp.closeModal('.popover');
});

// Change statusbar bg when panel opened/closed
$$('.panel-left').on('open', function() {
    $$('.statusbar-overlay').addClass('with-panel-left');
});
$$('.panel-right').on('open', function() {
    $$('.statusbar-overlay').addClass('with-panel-right');
});
$$('.panel-left, .panel-right').on('close', function() {
    $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
});

// Generate Content Dynamically
var dynamicPageIndex = 0;

function createContentPage() {
    mainView.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '	<div class="left"><a href="#" class="back link">Back</a></div>' +
        '	<div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-content" class="page">' +
        '	<!-- Scrollable page content-->' +
        '	<div class="page-content">' +
        '	  <div class="content-block">' +
        '		<div class="content-block-inner">' +
        '		  <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '		  <p>Go <a href="#" class="back">back</a> or generate <a href="#" class="ks-generate-page">one more page</a>.</p>' +
        '		</div>' +
        '	  </div>' +
        '	</div>' +
        '  </div>' +
        '</div>'
    );
    return;
}

function genChartByHighCharts(_chartData, _elementId, _title, _label_title, _valueSuffix) {
    $('#' + _elementId).empty();
    Highcharts.setOptions({
        global: {
            timezoneOffset: 4 * 60
        }
    });
    $('#' + _elementId).highcharts('StockChart', {

        rangeSelector: {
            selected: 1,
            inputEnabled: false, //$('#' + _elementId).width() > 480,
            buttons: [{
                type: 'day',
                count: 1,
                text: '1d'
            }, {
                type: 'week',
                count: 1,
                text: '1w'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }, {
                type: 'year',
                count: 1,
                text: '1y'
            }, {
                type: 'all',
                text: 'All'
            }],
        },

        title: {
            text: _title
        },

        series: [{
            name: _label_title,
            data: _chartData,
            tooltip: {
                valueDecimals: 2,
                valueSuffix: _valueSuffix
            }
        }],

        exporting: {
            enabled: false
        }
    });
}

$$(document).on('click', '.ks-generate-page', createContentPage);