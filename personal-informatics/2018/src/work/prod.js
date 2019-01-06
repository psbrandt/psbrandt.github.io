const opts = {
  chart: {
    type: "area",
    renderTo: "productivity-chart"
    // style: {
    //   fontFamily: "Lato"
    // }
  },
  credits: {
    enabled: false
  },
  title: {
    text: "Productivity"
  },
  xAxis: {
    type: "datetime",
    // dateTimeLabelFormats: {
    //   month: "%e. %b",
    //   year: "%b",
    //   day: "%e %b",
    //   hour: "%A, %b %e",
    //   minute: "%A, %b %e",
    //   millisecond: "%A, %b %e",
    //   second: "%A, %b %e"
    // },
    minPadding: 0,
    maxPadding: 0,
    tickPixelInterval: 110,
    plotBands: [
      {
        color: "rgba(192, 192, 192, 0.2)",
        from: moment("2018-07-8").valueOf(),
        to: moment("2018-07-24").valueOf(),
        label: {
          text: "Mom's<br/>Birthday<br/>US Trip",
          useHTML: true,
          textAlign: "center",
          style: {
            color: "rgba(192, 192, 192, 0.6)"
          }
        }
      },
      {
        color: "rgba(192, 192, 192, 0.2)",
        from: moment("2018-12-07").valueOf(),
        to: moment("2018-12-18").valueOf(),
        label: {
          text: "Flu<br/>+<br/>SoCal",
          useHTML: true,
          textAlign: "center",
          align: "center",
          style: {
            color: "rgba(192, 192, 192, 0.6)"
          }
        }
      }
    ]
  },
  yAxis: {
    title: {
      text: "Hours"
    }
  },
  tooltip: {
    shared: true,
    valueDecimals: 2,
    valueSuffix: " hours",
    useHTML: true,
    headerFormat:
      '<span class="productivity-chart-tooltip">{point.x:%A, %b %e}</span><br/><br/>'
  },
  plotOptions: {
    area: {
      stacking: "normal",
      lineColor: "#666666",
      lineWidth: 1,
      marker: {
        enabled: false,
        symbol: "circle",
        radius: 1,
        lineWidth: 1,
        lineColor: "#666666"
      }
    },
    series: {
      pointStart: Date.UTC(2018, 0, 1),
      pointInterval: 24 * 3600 * 1000 // one day
    }
  }
  // series: productivitySeries
};

const plot = data => {
  const char = new Highcharts.Chart({
    series: data,
    ...opts
  });
};

const DATE_IDX = 0;
const TIME_IDX = 1;
const PROD_IDX = 3;

const toHours = seconds => seconds / 60 / 60;
const toHoursDisplay = seconds => parseFloat(seconds / 60 / 60).toFixed(2);

const formatDuration = seconds =>
  moment
    .duration(seconds, "seconds")
    .format("y [years], M [months], d [days], h [hrs], m [min], s [sec]");

const prepData = async () => {
  const days = await d3.json("/data/days.json");

  const raw = await d3.json("/data/work/productivity.json");

  const groups = [
    {
      key: 2,
      name: "Very Productive",
      color: "rgba(71, 144, 48,1)",
      total: 0
    },
    {
      key: 1,
      name: "Productive",
      color: "rgba(119, 208, 91,1)",
      total: 0
    },
    {
      key: 0,
      name: "Neutral",
      color: "rgba(74, 102, 65,1)",
      total: 0
    },
    {
      key: -2,
      name: "Very Distracting",
      color: "rgba(57, 60, 56,1)",
      total: 0
    }
  ];

  const data = groups.map(group => {
    const filtered = raw.rows.filter(e => e[PROD_IDX] === group.key);

    const series = days.map(e => {
      // find value for the day
      const val = filtered.find(d => d[DATE_IDX] === e);
      const time = val ? val[TIME_IDX] : 0;

      group.total += time;

      return [moment(e).valueOf(), toHours(time)];
    });

    return {
      name: group.name,
      color: group.color,
      data: series,
      total: group.total
    };
  });

  document.querySelector("#totalProductive").innerHTML = `${toHoursDisplay(
    data[0].total + data[1].total
  )}hrs`;

  document.querySelector("#totalTime").innerHTML = `${toHoursDisplay(
    data[0].total + data[1].total + data[2].total + data[3].total
  )}hrs`;

  return data;
};

export const prodChart = async () => {
  const data = await prepData();
  plot(data);
};
