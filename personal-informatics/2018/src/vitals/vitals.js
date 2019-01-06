const BIRTH_DATETIME = "1984-04-03 02:00:00.000+02:00";

export const showAge = milliseconds => {
  window.setInterval(() => {
    document.querySelector("#age").innerHTML = moment
      .duration(moment().diff(moment(BIRTH_DATETIME)))
      .format("y[y], M[mo], d[d], h[hr], m[m], s[s]");
  }, milliseconds);
};
