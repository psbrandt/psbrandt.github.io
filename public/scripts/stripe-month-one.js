'use strict';

var totalTime = 0;
var totalProductive = 0;

function buildProductivityChart() {
  var proproductivityChart = new Highcharts.Chart({
    chart: {
      type: 'area',
      renderTo: 'productivity-chart',
      style: {
        fontFamily: 'Lato'
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'Tracked Hours'
    },
    subtitle: {
      text: 'First Month At Stripe'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%e. %b',
        year: '%b',
        day: '%e %b',
        hour: "%A, %b %e",
        minute: "%A, %b %e",
        millisecond: "%A, %b %e",
        second: "%A, %b %e"
      },
      minPadding: 0,
      maxPadding: 0,
      tickPixelInterval: 110,
      plotBands: [{
        color: 'rgba(192, 192, 192, 0.2)',
        from: moment('2016-01-23').valueOf(),
        to: moment('2016-01-24').valueOf()
      },
        {
          color: 'rgba(192, 192, 192, 0.2)',
          from: moment('2016-01-30').valueOf(),
          to: moment('2016-01-31').valueOf()
        },
        {
          color: 'rgba(192, 192, 192, 0.2)',
          from: moment('2016-02-06').valueOf(),
          to: moment('2016-02-07').valueOf()
        },
        ,
        {
          color: 'rgba(192, 192, 192, 0.2)',
          from: moment('2016-02-13').valueOf(),
          to: moment('2016-02-16').valueOf(),
          label: {
            text: 'Jodi<br/>visit',
            useHTML: true,
            textAlign: 'center',
            style: {
              color: 'rgba(192, 192, 192, 0.6)'
            }
          }
        }]
    },
    yAxis: {
      title: {
        text: 'Hours'
      }
    },
    tooltip: {
      shared: true,
      valueDecimals: 2,
      valueSuffix: ' hours',
      useHTML: true,
      headerFormat: '<span class="productivity-chart-tooltip">{point.x:%A, %b %e}</span><br/><br/>'
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineColor: '#666666',
        lineWidth: 1,
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 1,
          lineWidth: 1,
          lineColor: '#666666'
        }
      }
    },
    series: productivitySeries
  });

  totalTime += productivitySeries[0].xTotal + productivitySeries[1].xTotal + productivitySeries[2].xTotal + productivitySeries[3].xTotal;
  totalProductive += productivitySeries[0].xTotal + productivitySeries[1].xTotal;

  document.getElementById('totalTime').innerHTML = totalTime.toFixed(1) + 'hrs';
  document.getElementById('totalProductive').innerHTML = totalProductive.toFixed(1) + 'hrs';
}

document.addEventListener("DOMContentLoaded", function(event) {
  buildProductivityChart();
});
