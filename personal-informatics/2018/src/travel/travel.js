/*
TOTAL FLIGHTS
41  
TOTAL DISTANCE
94082km  
TOTAL DURATION
6d, 0hrs, 6m, 0s
*/

/**
 * Various global variables (FIXME: don't do this)
 */
const canvas = d3.select("#globe");
let countries;
let flightData;
let path, projection;
let rotation = 30;
let datetime = moment("2018-01-01 00:00:00+02:00");
let time = 0;
let flightPaths = turf.featureCollection([]);
let currentFlight,
  flightsCompleted = 0,
  distanceCompleted = 0,
  durationCompleted = 0;
let currentLocation = [-18.596489, 33.968906];
let zoom = 2.2;
let animateFlights = true;

/**
 * Convenient access to various canvas attributes
 */
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

/**
 * Fit the canvas onto the screen
 */
const scale = () => {
  const width = document.getElementById("flight-map").clientWidth;
  const height = document.getElementById("flight-map").clientHeight;

  canvas.attr("width", width).attr("height", height);
};

/**
 * Draw the oceans
 */
const drawOcean = () => {
  const vars = v();

  vars.context.strokeStyle = "darkgrey";
  vars.context.lineWidth = 1.5;
  vars.context.fillStyle = "aliceblue";

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

/**
 * Draw the landmass
 */
const drawCountries = () => {
  const vars = v();

  projection = d3
    .geoOrthographic()
    .scale(vars.radius * zoom)
    .translate([vars.width / 2, vars.height / 2]);

  projection.rotate(currentLocation);
  path = d3.geoPath(projection, vars.context);

  vars.context.strokeStyle = "darkgrey";
  vars.context.lineWidth = 0.35;
  vars.context.fillStyle = "mintcream";

  vars.context.beginPath(),
    path(countries),
    vars.context.fill(),
    vars.context.stroke();
};

/**
 * Draw all airports visited
 */
const drawAirports = () => {
  const vars = v();

  const color = d3.color("steelblue");
  color.opacity = 0.25;
  vars.context.fillStyle = color;

  path.pointRadius(10);

  vars.context.beginPath();

  flightData.forEach(f => {
    path(f.calculated.start_point);
    path(f.calculated.end_point);
  });

  vars.context.fill();
};

/**
 * Draw all completed trips to date (contained in `flightData`)
 */
const drawTrips = () => {
  const vars = v();

  vars.context.strokeStyle = "steelblue";
  vars.context.lineWidth = 0.7;

  vars.context.beginPath();
  path(flightPaths);
  vars.context.stroke();
};

/**
 * Draw the current timestamp
 */
const drawDateTime = () => {
  const vars = v();

  const color = d3.color("black");
  color.opacity = 0.25;
  vars.context.fillStyle = color;

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

  path({
    type: "Point",
    coordinates: [-currentLocation[0], -currentLocation[1]]
  });

  vars.context.fill();
};

/**
 * Draw the frame
 */
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

/**
 * Reset
 */
const reset = () => {
  flightsCompleted = 0;
  distanceCompleted = 0;
  durationCompleted = 0;
  time = 0;
  datetime = moment("2018-01-01");
  flightPaths = turf.featureCollection([]);
};

const replay = () => {
  reset();
  animateFlights = true;
  document.getElementById("flight-control").innerHTML = animateFlights
    ? '<i class="fas fa-pause"></i> Pause'
    : '<i class="fas fa-play"></i> Play';

  initFlightControl();
};

/**
 * Control the time
 */
const updateTime = () => {
  // Update time more quickly when not flying
  if (currentFlight) {
    datetime.add(8, "m");
  } else {
    time = time + 1;
    datetime.add(2, "h");
  }

  // Reset at the end of the year
  if (datetime.isAfter(moment("2019-01-01"))) {
    animateFlights = false;
    document.getElementById("flight-control").onclick = replay;
    document.getElementById("flight-control").innerHTML =
      '<i class="fas fa-redo"></i> Replay';
  }
};

const updateStats = () => {
  flightsCompleted = flightPaths.features.filter(path => !!path.properties)
    .length;

  distanceCompleted = flightData
    .slice(0, flightsCompleted)
    .map(f => f.calculated.distance)
    .reduce((a, d) => a + d, 0);

  durationCompleted = flightData
    .slice(0, flightsCompleted)
    .map(f => f.calculated.duration)
    .reduce((a, d) => a.add(d), moment.duration());

  if (currentFlight) {
    distanceCompleted += getDistanceIntoCurrentFlight();
    durationCompleted.add(getTimeIntoCurrentFlight());
  }

  writeStats(flightsCompleted, distanceCompleted, durationCompleted);
};

const getInProgressFlight = () => {
  return flightData.find((f, i) => {
    return (
      f.calculated.start_datetime.isBefore(datetime) &&
      f.calculated.end_datetime.isAfter(datetime)
    );
  });
};

const getFlightName = flight => {
  return `${flight.start_time.slice(0, 9)}-${flight.start_airport_code}-${
    flight.end_airport_code
  }`;
};

const getTimeIntoCurrentFlight = () =>
  moment.duration(datetime.diff(currentFlight.calculated.start_datetime));

const getFlightCompletedFraction = flight => {
  // get total flight duration (seconds)
  const duration = flight.calculated.duration;

  // get time since flight started (seconds)
  const timeSinceStart = getTimeIntoCurrentFlight();

  // = moment.duration(
  //   moment(datetime).diff(moment(flight.start_time))
  // );

  return timeSinceStart.asSeconds() / duration.asSeconds();
};

const setCurrentPoint = point => {
  currentLocation = [
    -point.geometry.coordinates[0],
    -point.geometry.coordinates[1],
    0
  ];
};

const getDistanceIntoCurrentFlight = () => {
  const completedFraction = getFlightCompletedFraction(currentFlight);

  const distance = currentFlight.calculated.distance;

  return distance * completedFraction;
};

const getCompletedSegment = flight => {
  const flightLine = flight.calculated.flight_path;

  // get distance completed
  const completedDistance = getDistanceIntoCurrentFlight();

  const endpoint = turf.along(flightLine, completedDistance, {
    unit: "kilometers"
  });

  setCurrentPoint(endpoint);

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
  const completedFlights = flightData.filter(f =>
    f.calculated.end_datetime.isBefore(datetime)
  ).length;

  currentFlight = getInProgressFlight();

  flightPaths = turf.featureCollection(
    flightData.slice(0, completedFlights).map(f => f.calculated.flight_path)
  );

  if (flightPaths.features.length) {
    setCurrentPoint(
      flightData[flightPaths.features.length - 1].calculated.end_point
    );
  }

  if (currentFlight) {
    const segment = getCompletedSegment(currentFlight);

    flightPaths.features.push(segment);
  }
};

/**
 * Animation loop
 */
const tick = () => {
  render();

  if (animateFlights) {
    updateTime();
    updateFlightPaths();
    updateStats();
  }

  window.requestAnimationFrame(tick);
};

/**
 * Scale and draw
 */
const plotGlobe = async () => {
  scale();
  render();
  tick();
};

// Preprocess data
const preProcessFlights = () => {
  flightData.forEach((f, i) => {
    const start_point = turf.point([
      parseFloat(f.start_airport_longitude),
      parseFloat(f.start_airport_latitude)
    ]);

    const end_point = turf.point([
      parseFloat(f.end_airport_longitude),
      parseFloat(f.end_airport_latitude)
    ]);

    const flight_path = turf.lineString(
      [start_point.geometry.coordinates, end_point.geometry.coordinates],
      { name: `${f.start_airport_code}-${f.end_airport_code}` }
    );

    const start_datetime = moment(f.start_time);
    const end_datetime = moment(f.end_time);

    flightData[i].calculated = {
      index: i,
      start_datetime,
      end_datetime,
      start_point,
      end_point,
      flight_path,
      distance: turf.length(flight_path, {
        unit: "kilometers"
      }),
      duration: moment.duration(end_datetime.diff(start_datetime))
    };
  });
};

const loadData = async () => {
  const countryData = await d3.json("../2018/data/travel/countries-110m.json");

  countries = topojson.feature(countryData, countryData.objects.countries);
  flightData = await d3.json("../2018/data/travel/flights.json");
};

const toggleAnimation = () => {
  animateFlights = !animateFlights;

  document.getElementById("flight-control").innerHTML = animateFlights
    ? '<i class="fas fa-pause"></i> Pause'
    : '<i class="fas fa-play"></i> Play';
};

const initFlightControl = () => {
  document.getElementById("flight-control").onclick = toggleAnimation;
};

const writeStats = (flightCount, distance, duration) => {
  document.querySelector("#totalFlights").innerHTML = flightCount;
  document.querySelector("#totalDistance").innerHTML = `${Math.round(
    distance
  )}km`;
  document.querySelector("#totalDuration").innerHTML = duration.format(
    "d[d], hh[hr], mm[m], ss[s]"
  );
};

// Entry point
export const flights = async () => {
  await loadData();
  preProcessFlights();

  console.log(flightData);

  let total_distance = 0;
  let total_duration = moment.duration();

  flightData.forEach(f => {
    total_distance += f.calculated.distance;
    total_duration.add(f.calculated.duration);
  });

  writeStats(flightData.length, total_distance, total_duration);

  initFlightControl();

  plotGlobe();
};
