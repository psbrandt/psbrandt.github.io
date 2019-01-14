import { showAge } from "./src/vitals/vitals.js";
import { prodChart } from "./src/work/prod.js";
import { flights } from "./src/travel/travel.js";

const init = () => {
  showAge(1000);
  prodChart();
  flights();
};

document.addEventListener("DOMContentLoaded", init);
