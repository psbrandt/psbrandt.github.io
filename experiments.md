---
layout: page
title: Experiments
---

A few of my experiments.

<br/>
<div>
  <p>
    <a href="/experiments/dataquest/">
      <div>
        <p style="float: left;">
          <img height="64px" width="64px" src="/public/images/experiment-icons/health-service-finder.jpg" alt="Health Service Finder">
        </p>
        <p style="line-height:60px; padding-left: 74px">
          Health Service Finder
        </p>
      </div>
    </a>
  </p>
<br/>
  <p>
    <a href="/experiments/openmrs.js-logo/">
      <div>
        <p style="float: left;">
            <object style="pointer-events: none;" id="logo" data="../public/images/openmrs.js-logo.svg" type="image/svg+xml" onload="fixupSVG();"></object>
            <script>
            function fixupSVG () {
              //debugger;
                var svg = document.getElementById("logo").contentDocument.getElementsByTagName("svg")[0];
                svg.setAttribute("height", "64px");
                svg.setAttribute("viewBox", "0 0 440 397");
              }
            </script>
        </p>
        <p style="line-height:60px; padding-left: 74px">
          openmrs.js logo idea
        </p>
      </div>
    </a>
  </p>
</div>
