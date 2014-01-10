---
layout: post
title: !binary |-
  UmVuZGVyaW5nIE1hdGhlbWF0aWNzIGluIExhVGVYIGluIEhUTUw=
created: 1312124976
---

**EDIT:** This is going to work until I fix up a DNS issue. Current I recommend using [MathJax](http://www.mathjax.org/) now in any case.

If you plan to blog about anything scientific, especially in the mathematical sciences, there's a good chance you're going to need to render some equations. Since <img align="absmiddle" src="http://pascalbrandt.net/cgi-bin/mimetex.cgi?\LaTeX"/> is the de facto standard for typesetting mathematics, that's what you're going to want to use.

If you're using Drupal, then a module like <a href="http://drupal.org/project/drutex">DruTeX</a> is the perfect solution. That is, if you're hosting the implementation yourself or have the rights to install <img align="absmiddle" src="http://pascalbrandt.net/cgi-bin/mimetex.cgi?\LaTeX"/> on the box running Drupal. If, however, this isn't the case, then you might want to consider <a href="http://www.biostatisticien.eu/mimetex.html">mimeTeX</a>. mimeTeX is a minimal rendering engine which takes <img align="absmiddle" src="http://pascalbrandt.net/cgi-bin/mimetex.cgi?\LaTeX"/> mathematics expressions as input and generates gifs as ouput. Since mimeTeX is accessible via <a href="http://en.wikipedia.org/wiki/Common_Gateway_Interface">CGI</a>, gifs can be generated on the fly each time your page is accessed.

Everything you need to know to get mimeTeX up and running is available in the <a href="http://www.forkosh.com/mimetexmanual.html">mimeTeX manual</a>. Essentially, all you have to do is download the <a href="http://www.forkosh.com/mimetex.zip">source</a> and compile as follows.
<blockcode>
cc -DAA mimetex.c gifsave.c -lm -o mimetex.cgi
</blockcode>

There are also some precompiled binaries available <a href="http://www.biostatisticien.eu/mimetex.html">here</a> (sadly not for 64bit Linux though).

Once you've got a binary, you just need to dump it in the cgi-bin directory and then you can easily generate mathematics by invoking the mimeTeX build. For example, entering the following into your browser address bar should generate <img align="absmiddle" src="http://pascalbrandt.net/cgi-bin/mimetex.cgi?e^x=\lim_{n\to\infty}\left(1+\frac xn\right)^n"/>.
<blockcode>
pascalbrandt.net/cgi-bin/mimetex.cgi?e^x=\lim_{n\to\infty}\left(1+\frac xn\right)^n
</blockcode> 

Here are a few more examples.
<center>
<img src="http://pascalbrandt.net/cgi-bin/mimetex.cgi?x^2+y^2"/>
<img src="http://pascalbrandt.net/cgi-bin/mimetex.cgi?\Large A\ =\ \large\left(         \begin{array}{c.cccc}&1&2&\cdots&n\\         \hdash1&a_{11}&a_{12}&\cdots&a_{1n}\\         2&a_{21}&a_{22}&\cdots&a_{2n}\\         \vdots&\vdots&\vdots&\ddots&\vdots\\         n&a_{n1}&a_{n2}&\cdots&a_{nn}\end{array}\right)"/>

<img src="http://pascalbrandt.net/cgi-bin/mimetex.cgi?\Large\scr{J}^{i0}=+\frac i2         \left[\begin{array}{cc}\sigma_i&0\\0&-\sigma_i\end{array}\right]         \hspace{10}\scr{J}^{ij}=\frac12\varepsilon_{ijk}         \left[\begin{array}{cc}\sigma_k&0\\0&\sigma_k\end{array}\right]"/>

<img src="http://pascalbrandt.net/cgi-bin/mimetex.cgi?\normalsize         \left(\large\begin{array}{GC+23}         \varepsilon_x\\\varepsilon_y\\\varepsilon_z\\\gamma_{xy}\\         \gamma_{xz}\\\gamma_{yz}\end{array}\right)\ {\Large=}         \ \left[\begin{array}{CC}         \begin{array}\frac1{E_{\fs{+1}x}}         &-\frac{\nu_{xy}}{E_{\fs{+1}x}}         &-\frac{\nu_{\fs{+1}xz}}{E_{\fs{+1}x}}\\         -\frac{\nu_{yx}}{E_y}&\frac1{E_{y}}&-\frac{\nu_{yz}}{E_y}\\         -\frac{\nu_{\fs{+1}zx}}{E_{\fs{+1}z}}&         -\frac{\nu_{zy}}{E_{\fs{+1}z}}         &\frac1{E_{\fs{+1}z}}\end{array} & {\LARGE 0} \\         {\LARGE 0} & \begin{array}\frac1{G_{xy}}&&\\         &\frac1{G_{\fs{+1}xz}}&\\&&\frac1{G_{yz}}\end{array}         \end{array}\right]         \ \left(\large\begin{array}         \sigma_x\\\sigma_y\\\sigma_z\\\tau_{xy}\\\tau_{xz}\\\tau_{yz}         \end{array}\right)"/>
</center>
