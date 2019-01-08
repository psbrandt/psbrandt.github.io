const splitAt = (x, index) => {
  return { value: x.slice(0, index), unit: x.slice(index) };
};

const canvas = d3.select("#globe");
let countries;
let flightData;
let path, projection;
let rotation = 30;
let datetime = moment("2018-01-01 00:00:00+02:00");
let time = 0;
let flightPaths = turf.featureCollection([]);
let currentFlight;
let currentLocation = [-18.596489, 33.968906];
let zoom = 2.2;

const v = () => {
  const dims = document.getElementById("globe").getBoundingClientRect();

  const radius = dims.width > dims.height ? dims.height / 2 : dims.width / 2;
  return {
    canvas,
    context: canvas.node().getContext("2d"),
    width: dims.width,
    height: dims.height,
    radius,
    rotation
  };
};

const scale = () => {
  const width = document.getElementById("flight-map").clientWidth;
  const height = document.getElementById("flight-map").clientHeight;

  canvas.attr("width", width).attr("height", height);
};

const drawOcean = () => {
  const vars = v();

  vars.context.strokeStyle = "darkgrey";
  vars.context.lineWidth = 1.5;
  vars.context.fillStyle = "aliceblue";

  // console.log("VA", vars);

  vars.context.beginPath();
  vars.context.arc(
    vars.width / 2,
    vars.height / 2,
    vars.radius * zoom,
    0,
    2 * Math.PI
  );
  vars.context.fill();
  vars.context.stroke();
};

const drawCountries = () => {
  const vars = v();

  projection = d3
    .geoOrthographic()
    .scale(vars.radius * zoom)
    .translate([vars.width / 2, vars.height / 2]);

  // console.log(rotation);

  projection.rotate(currentLocation);
  // projection.center(currentLocation);

  path = d3.geoPath(projection, vars.context);

  // console.log(path);

  vars.context.strokeStyle = "darkgrey";
  vars.context.lineWidth = 0.35;
  vars.context.fillStyle = "mintcream";

  // console.log(countries);

  vars.context.beginPath(),
    path(countries),
    vars.context.fill(),
    vars.context.stroke();
};

const drawAirports = () => {
  const vars = v();

  const color = d3.color("steelblue");
  color.opacity = 0.25;
  vars.context.fillStyle = color;

  path.pointRadius(10);

  // const pt = [-33.968906, 18.596489];
  // const pt2 = [18.596489, -33.968906];

  // const pt3 = {
  //   type: "Point",
  //   coordinates: pt2
  // };

  // console.log("ASD", projection(pt));

  vars.context.beginPath();

  flightData.forEach(f => {
    path({
      type: "Point",
      coordinates: [f.start_airport_longitude, f.start_airport_latitude]
    });
    path({
      type: "Point",
      coordinates: [f.end_airport_longitude, f.end_airport_latitude]
    });
  });

  vars.context.fill();
};

const getLineSegment = (line, time) => {
  const speed = 100;

  const point = turf.along(line, time * speed);

  return {
    type: "LineString",
    coordinates: [line.coordinates[0], point.geometry.coordinates]
  };
};

const drawTrips = () => {
  const vars = v();

  const ls = {
    type: "LineString",
    coordinates: [[18.596489, -33.968906], [4.763385, 52.309069]]
  };

  vars.context.strokeStyle = "steelblue";
  vars.context.lineWidth = 0.7;

  vars.context.beginPath();

  // path(getLineSegment(ls, time));

  path(flightPaths);

  // flightData.forEach(f => {
  //   path({
  //     type: "LineString",
  //     coordinates: [
  //       [f.start_airport_longitude, f.start_airport_latitude],
  //       [f.end_airport_longitude, f.end_airport_latitude]
  //     ]
  //   });
  // });

  vars.context.stroke();
};

const drawDateTime = () => {
  const vars = v();

  const color = d3.color("black");
  color.opacity = 0.25;
  vars.context.fillStyle = color;

  // console.log(vars.width);

  vars.context.font = "20px serif";
  vars.context.fillText(
    datetime.format("YYYY-MM-DD HH:mm:ss"),
    vars.width - 172,
    18
  );
};

const drawCurrentPosition = () => {
  const vars = v();

  const color = d3.color("red");
  color.opacity = 0.25;
  vars.context.fillStyle = color;

  path.pointRadius(10);

  vars.context.beginPath();

  // console.log(currentLocation);

  path({
    type: "Point",
    coordinates: [-currentLocation[0], -currentLocation[1]]
  });

  vars.context.fill();
};

const render = () => {
  const vars = v();
  vars.context.clearRect(0, 0, vars.width, vars.height);
  drawOcean();
  drawCountries();
  drawAirports();
  drawTrips();
  drawDateTime();
  drawCurrentPosition();
};

const updateTime = () => {
  // Update time more quickly when not flying
  if (currentFlight) {
    datetime.add(5, "m");
  } else {
    time = time + 1;
    datetime.add(2, "h");
  }

  if (datetime.isAfter(moment("2019-01-01"))) {
    time = 0;
    datetime = moment("2018-01-01");
    flightPaths = turf.featureCollection([]);
  }
};

const getInProgressFlight = () => {
  return flightData.find(f => {
    return (
      moment(f.start_time).isBefore(datetime) &&
      moment(f.end_time).isAfter(datetime)
    );
  });
};

const getFlightName = flight => {
  return `${flight.start_time.slice(0, 9)}-${flight.start_airport_code}-${
    flight.end_airport_code
  }`;
};

const getFlightCompletedFraction = flight => {
  // get total flight duration (seconds)
  const duration = moment.duration(
    moment(flight.end_time).diff(moment(flight.start_time))
  );

  // console.log(duration);

  // get time since flight started (seconds)
  const timeSinceStart = moment.duration(
    moment(datetime).diff(moment(flight.start_time))
  );

  // console.log(timeSinceStart);

  // console.log(timeSinceStart.asSeconds());

  return timeSinceStart.asSeconds() / duration.asSeconds();
};

const getFlightLineString = flight => {
  const line = turf.helpers.lineString([
    [
      parseFloat(flight.start_airport_longitude),
      parseFloat(flight.start_airport_latitude)
    ],
    [
      parseFloat(flight.end_airport_longitude),
      parseFloat(flight.end_airport_latitude)
    ]
  ]);

  // debugger;

  return line;
};

const getFlightDistance = flight => {
  return turf.length(getFlightLineString(flight), { unit: "kilometers" });
};

const getCompletedSegment = flight => {
  const flightLine = getFlightLineString(flight);

  // get endpoint of currently completed
  const completedFraction = getFlightCompletedFraction(flight);

  // // just snap to the end
  // if (completedFraction > 0.97) {
  //   return flightLine;
  // }

  const distance = getFlightDistance(flight);
  const endpoint = turf.along(flightLine, distance * completedFraction, {
    unit: "kilometers"
  });

  currentLocation = [
    // endpoint.geometry.coordinates[1],

    -endpoint.geometry.coordinates[0],
    -endpoint.geometry.coordinates[1],
    0
  ];

  // console.log(currentLocation);

  // create line from start to point
  return turf.helpers.lineString(
    [flightLine.geometry.coordinates[0], endpoint.geometry.coordinates],
    { name: getFlightName(flight) }
  );
};

const insertOrReplaceSegment = segment => {
  const name = segment.properties.name;

  const idx = flightPaths.features.findIndex(f => {
    return f.properties.name === name;
  });

  if (idx > -1) {
    flightPaths.features[idx] = segment;
  } else {
    flightPaths.features.push(segment);
  }
};

const updateFlightPaths = () => {
  currentFlight = getInProgressFlight();

  if (currentFlight) {
    // console.log(getFlightCompletedFraction(currentFlight));

    const segment = getCompletedSegment(currentFlight);

    insertOrReplaceSegment(segment);

    // console.log(flightPaths);
  }
};

const tick = () => {
  render();
  // rotation = (rotation + 0.5) % 360;

  updateTime();
  updateFlightPaths();

  window.requestAnimationFrame(tick);
};

const plotGlobe = async () => {
  await loadData();
  scale();
  render();

  // setInterval(() => {
  //   rotation = (rotation + 10) % 360;
  // }, 1000);

  tick();

  console.log(countries);
};

const loadData = async () => {
  const countryData = await d3.json("../2018/data/travel/countries-110m.json");
  countries = topojson.feature(countryData, countryData.objects.countries);
};

export const flights = async () => {
  flightData = await d3.json("../2018/data/travel/flights.json");

  console.log(flightData);

  let distance = 0;
  const time = moment.duration();

  flightData.forEach(f => {
    distance += parseInt(f.distance.replace(/\D/g, ""));

    const durations = f.duration.replace(/\s/g, "").split(",");

    durations.forEach(d => {
      const duration = splitAt(d, d.match(/\D/).index);

      time.add(parseInt(duration.value), duration.unit);
    });
  });

  document.querySelector("#totalFlights").innerHTML = flightData.length;
  document.querySelector("#totalDistance").innerHTML = `${distance}km`;
  document.querySelector("#totalDuration").innerHTML = time.format(
    "y[y], M[mo], d[d], h[hr], m[m], s[s]"
  );

  plotGlobe();
};
