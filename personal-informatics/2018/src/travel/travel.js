const splitAt = (x, index) => {
  return { value: x.slice(0, index), unit: x.slice(index) };
};

export const flights = async () => {
  const flights = await d3.json("/data/travel/flights.json");

  let distance = 0;
  const time = moment.duration();

  flights.forEach(f => {
    distance += parseInt(f.distance.replace(/\D/g, ""));

    const durations = f.duration.replace(/\s/g, "").split(",");

    durations.forEach(d => {
      const duration = splitAt(d, d.match(/\D/).index);

      time.add(parseInt(duration.value), duration.unit);
    });
  });

  document.querySelector("#totalFlights").innerHTML = flights.length;
  document.querySelector("#totalDistance").innerHTML = `${distance}km`;
  document.querySelector("#totalDuration").innerHTML = time.format(
    "y[y], M[mo], d[d], h[hr], m[m], s[s]"
  );
};
