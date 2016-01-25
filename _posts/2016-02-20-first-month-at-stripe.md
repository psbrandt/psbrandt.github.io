---
layout: post
title: First Month At Stripe
comments: true
---

<meta name="gc:client-id" content="a11a1bda412d928fb39a">
<meta name="gc:client-secret" content="92b7cf30bc42c49d589a10372c3f9ff3bb310037">

<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.11/css/jquery.dataTables.min.css">

___
<img style="width:100%" src="/public/images/stripe.png" alt="Stripe">

___

In case you don't know, I've been participating in the <a class="section" href="https://stripe.com/blog/open-source-retreat-2016">Stripe Open-Source Retreat</a>
for about a month now. This post is a small brain dump of what I've been up to in addition
to my [usual participation in the OpenMRS commmunity](https://talk.openmrs.org/users?name=pascal&period=monthly).

As the [Stripe website](https://stripe.com/blog/open-source-retreat-2016-grantees)
says, when I started the Open-Source Retreat, I thought I had a good idea of what
needed to be done. I wanted to build a JavaScript library that would be
accepted by the [OpenMRS](http://www.openmrs.org/) community as the go-to tool for building applications using
the OpenMRS API.

## Reality Check

When I took a step back and decided what I really wanted to achieve during the
retreat, I settled on the following goal.

> Improve the development experience for developers working to build applications
on top of the OpenMRS platform.

It was evident that at least two things needed to be addressed before I could
even start thinking about the technical details of building a JavaScript library.

 1. Development Environment Setup
 2. Documentation

It seemed to make sense to put some work into addressing these two issues first.

## Development Environment

There have been a few new developers joining [eSaude](http://www.esaude.org/) (our Mozambican
implementer community) recently, so I started there. I wanted to make it as easy as possible for them to get set up with the custom
eSaude OpenMRS distribution and Point of Care application.

I created the following two sets of Docker containers (using [docker-compose](https://docs.docker.com/compose/)) to achieve this.

<p>
	<div class="gh-card">
		<div class="github-card" data-github="esaude/esaude-platform-docker" data-width="400" data-height="150" data-theme="default" data-target="_blank"></div>
	</div>

	<div class="gh-card">
		<div class="github-card" data-github="esaude/esaude-poc-docker" data-width="400" data-height="150" data-theme="default" data-target="_blank"></div>
	</div>
</p>

Once I'd completed the implementation-specific Docker container compositions, I
did the same for the OpenMRS core platform and Reference Application.

<p>
	<div class="gh-card">
		<div class="github-card" data-github="psbrandt/openmrs-platform-docker" data-width="400" data-height="150" data-theme="default" data-target="_blank"></div>
	</div>

	<div class="gh-card">
		<div class="github-card" data-github="psbrandt/openmrs-refapp-docker" data-width="400" data-height="150" data-theme="default" data-target="_blank"></div>
	</div>
</p>

<div class="metric-right">
	<div class="metric-title">Docker Compositions</div>
	<span class="metric-value">4</span>
</div>

## Documentation

OpenMRS had a GSoC student, [Zakaria Amine](https://talk.openmrs.org/users/zakaria.amine/activity), work on
the initial revision of our [Swagger](http://swagger.io/) documentation generation, but it has not actually
been officially released yet. The current mechanism is that the docs are generated dynamically
inside the OpenMRS application via a link on the admin page. I wanted the docs
available to anyone - even if they aren't running a copy of OpenMRS locally, so
I made a script to build a static site from the Swagger specification.

<div class="gh-card">
	<div class="github-card" data-github="psbrandt/openmrs-apidoc-builder" data-width="400" data-height="150" data-theme="default" data-target="_blank"></div>
</div>

GitHub is now hosting static versions of the [Platform](https://psbrandt.github.io/openmrs-platform-docker) and [Reference Application](https://psbrandt.github.io/openmrs-refapp-docker) API docs built
using the first version of the Swagger specification.

When I took a more detailed look at our Swagger specification, I realised that
there were a number of issues, so I created [tickets](https://issues.openmrs.org/browse/RESTWS-554?jql=labels%20in%20(%27swagger%27)) for
these and have been working on making sure the Swagger spec we generate
is complete, accurate and conforms to the [OpenAPI Specification](http://swagger.io/specification/).

<div class="gh-card">
<div class="github-card" data-github="openmrs/openmrs-module-webservices.rest" data-width="400" data-height="150" data-theme="default" data-target="_blank"></div>
</div>

I've opened (and then subsequently closed without merging) a few PRs for this,
but since the scope of the changes has grown, the strategy now is to submit
a bunch of improvements in a single PR which will happen in the next few days.

Generating a good Swagger spec is probably the most important thing I've been
working on, since if this is done correctly it will be possible to (dynamically)
auto-generate the basic CRUD functionality of the JavaScript library I want to
build using [swagger-js](https://github.com/swagger-api/swagger-js). It will
also be possible to generate API clients in many other languages using [swagger-codegen](https://github.com/swagger-api/swagger-codegen).

<div class="metrics-outer">
	<div class="metrics-wrapper">
		<div style="width: 50px; display: inline-block;"> </div>
		<div class="metric">
			<h2 class="metric-title">Docs Repos</h2>
			<span class="metric-value">2</span>
		</div>
		<div style="width: 50px; display: inline-block;"> </div>
		<div class="metric">
			<h2 class="metric-title">Online Docs</h2>
			<span class="metric-value">2</span>
		</div>
	</div>
</div>

## Open Web Apps

OpenMRS recently landed support for [Open Web Apps](https://developer.mozilla.org/en-US/Apps) (OWAs), again
thanks to the great work done by a GSoC student. OWAs are a really easy way for
developers to build front-end apps and upload them to OpenMRS. I wanted to make
getting up and running for OWA developers even easier, so I created a [Yeoman generator](https://www.npmjs.com/package/generator-openmrs-owa)
to scaffold OWAs for OpenMRS (including a basic build and deploy pipeline).

<div class="gh-card">
<div class="github-card" data-github="psbrandt/generator-openmrs-owa" data-width="400" data-height="150" data-theme="default" data-target="_blank"></div>
</div>

<div>
	<img class="center-image" src="https://nodei.co/npm/generator-openmrs-owa.png?downloads=true"/>
</div>

In addition I created some [development workflow documentation](https://wiki.openmrs.org/display/docs/Open+Web+App+Development+Workflow) and a [screencast](https://www.youtube.com/watch?v=sM39qNGJ4Js) that demonstrates the workflow.

Some issues came up while building the generator, so I submitted some PRs to the OpenMRS OWA Module too. Thanks to [@sunbiz](https://talk.openmrs.org/users/sunbiz/activity) for reviewing and landing the PRs!

<div class="gh-card">
<div class="github-card" data-github="openmrs/openmrs-module-owa" data-width="400" data-height="150" data-theme="default" data-target="_blank"></div>
</div>

<div class="metric-right">
	<h2 class="metric-title">OWA Repos</h2>
	<span class="metric-value">2</span>
</div>

## Badges

I got this idea into my head that OpenMRS should have badges for its repos that
show the current build status as well as latest module and required OpenMRS version if
relevant. So, I spent a few hours and built a tool that generates OpenMRS badges
using [shields.io](http://shields.io).

<div class="gh-card">
<div class="github-card" data-github="psbrandt/openmrs-contrib-shields" data-width="400" data-height="150" data-theme="default" data-target="_blank"></div>
</div>

Now we have badges for build status like: <img class="inline-shield" src="https://omrs-shields.psbrandt.io/build/TRUNK/OC2"/> <img  class="inline-shield" src="https://omrs-shields.psbrandt.io/build/LOGIC/LOGIC"/> <img  class="inline-shield" src="https://omrs-shields.psbrandt.io/plan/RESTWS/RESTWS"/>. We can also get the latest version of a module (<img class="inline-shield" src="https://omrs-shields.psbrandt.io/version/153"/>) or the required version of OpenMRS for a module (<img class="inline-shield" src="https://omrs-shields.psbrandt.io/omrsversion/153"/>).

This work definitely wasn't on the critical path for anything, but we're using the
shields in the [dev category on Talk](https://talk.openmrs.org/c/dev) now, so it's
quick to spot if any important repos are failing to build.

<div class="metric-right">
	<h2 class="metric-title">Total Repos Updated</h2>
	<span class="metric-value">9</span>
</div>

## Productivity

A while ago I started using [RescueTime](https://www.rescuetime.com) to track my
productivity. It's tool that continually runs in the background and monitors what applications you're using
and what websites you visit. You categorize various activities as productive
or distracting and it generates a nice dashboard for you.

I grabbed the data for my first month here at Stripe and plotted the following graph.

<p>
<div id="productivity-chart"></div>
</p>

Time is logged as **Very Productive** if I am doing things like actively typing into my IDE or
the terminal, using email, or if I'm on GitHub or testing an application in the browser.
**Very Distracting** time is logged when I'm chatting in IM or watching a movie or similar.
<br/><br/>

<div class="metrics-outer">
	<div class="metrics-wrapper">
		<div style="width: 50px; display: inline-block;"> </div>
		<div class="metric">
			<h2 class="metric-title">Total Productive</h2>
			<span id="totalProductive" class="metric-value"></span>
		</div>
		<div style="width: 50px; display: inline-block;"> </div>
		<div class="metric">
			<h2 class="metric-title">Total Time</h2>
			<span id="totalTime" class="metric-value"></span>
		</div>
	</div>
</div>

## Activities

It hasn't all been work. I've done some active stuff and exploring too.

## Running

Luckily many Stripes seem to be pretty active, so I've managed to do a few
runs.

<p>
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:37.5% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BBWr8ZFzNvX/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Night run up Bernal with @nikgraf and a couple of Stripes #city #night #sanfrancisco</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Pascal Brandt (@psbrandt) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-02-04T06:34:55+00:00">Feb 3, 2016 at 10:34pm PST</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>
</p>

<p>
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BBL0-j1xK15/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Going back down … such a beautiful place these woods.</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Nik Graf (@nikgraf) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-01-31T01:22:13+00:00">Jan 30, 2016 at 5:22pm PST</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>
</p>

<p>
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BBL0xA9RK1h/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">With the Stripe Running Group @ the Mt. Tam East Peak during our 17km trail run ⛰👌</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Nik Graf (@nikgraf) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-01-31T01:20:22+00:00">Jan 30, 2016 at 5:20pm PST</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>
</p>
<br/>

<div class="metrics-outer">
	<div class="metrics-wrapper">
		<div class="metric">
			<h2 class="metric-title">Run Count</h2>
			<span class="metric-value">11</span>
		</div>
		<div style="width: 50px; display: inline-block;"> </div>
		<div class="metric">
			<h2 class="metric-title">Run Distance</h2>
			<span class="metric-value">82.57km</span>
		</div>
		<div style="width: 50px; display: inline-block;"> </div>
		<div class="metric">
			<h2 class="metric-title">Run Time</h2>
			<span class="metric-value">11.1hrs</span>
		</div>
	</div>
</div>

## Climbing

My friend and fellow Open-Source Retreat grantee [@nikgraf](https://twitter.com/nikgraf) also climbs, so we've been trying to do
one or two sessions a week at our local climbing gym, [Mission Cliffs](https://touchstoneclimbing.com/mission-cliffs/).

<p>
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BBgG1FyRKwP/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">With the gym just around the corner &amp; a motivated buddy (@psbrandt) I&#39;m back to climbing for the next couple months ⛰👌</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Nik Graf (@nikgraf) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-02-07T22:23:01+00:00">Feb 7, 2016 at 2:23pm PST</time></p></div></blockquote>
</p>

<div class="metric-right">
	<h2 class="metric-title">Gym Sessions</h2>
	<span class="metric-value">13</span>
</div>

## Exploring

I was fortunate enough to have my wife Jodi come and visit for a few days from
the 13th of February, so we did a bunch of touristy things.

<p>
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BBvD2vLqqMl/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Reunited in San Francisco 😍</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Jodi Allemeier (@urbanjodi) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-02-13T17:45:38+00:00">Feb 13, 2016 at 9:45am PST</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>
</p>

<p>
<blockquote class="instagram-media" data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/BBvQq6UqqKo/" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A photo posted by Jodi Allemeier (@urbanjodi)</a> on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-02-13T19:37:37+00:00">Feb 13, 2016 at 11:37am PST</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>
</p>

<p>
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:54.0983606557% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BBv-bmFKqLm/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Haight Ashbury</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Jodi Allemeier (@urbanjodi) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-02-14T02:17:29+00:00">Feb 13, 2016 at 6:17pm PST</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>
</p>

<p>
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BB7b2KrKqIG/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">#lookup #goldengatebridge</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Jodi Allemeier (@urbanjodi) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-02-18T13:06:09+00:00">Feb 18, 2016 at 5:06am PST</time></p></div></blockquote>
</p>

<p>
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BB2mDtDKqHc/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">China town SF</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Jodi Allemeier (@urbanjodi) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-02-16T15:59:11+00:00">Feb 16, 2016 at 7:59am PST</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>
</p>

<p>
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BB7b652KqIN/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">#sanfrancisco #latergram</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Jodi Allemeier (@urbanjodi) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-02-18T13:06:48+00:00">Feb 18, 2016 at 5:06am PST</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>
</p>

<div class="metric-right">
	<h2 class="metric-title">Fun Times Had</h2>
	<span class="metric-value">LOTS</span>
</div>

## Thoughts & Feelings

> “Real men don't cry... for more than three days”  
>              - Charles Boyle, Brooklyn Nine-Nine


### Surrounded By Geniuses

During my time here at Stripe, I've been experiencing a feeling that people have tried
to make me believe is [imposter syndrome](https://en.wikipedia.org/wiki/Impostor_syndrome).
The people that work here, and the other Open-Source Retreat grantees, are overwhelmingly
exceptional. I can barely look around the office without seeing someone who:

* <span title="I also met JedWatson who has a pretty decent commit streak going.">Is the author of a project on GitHub with 1000+ stars</span>
* Has written multiple technology books
* Has invented a framework or tool used by other exceptional people
* Is an ultra-marathon runner
* Sold multiple internet companies before the age of 18
* Is a pilot (including someone who is currently building their own plane)
* Previously worked at a famous tech company that makes something *you* use every day
* Has a PhD from a top 10 university
* Speaks 5 or more languages
* Consistently writes blog posts that make it to the front page of [HN](http://news.ycombinator.com/)

I could go on, but I won't. Also, most people here are in their 20s. It's been
really great to meet these people and observe them doing amazing things, but it's
sometimes been daunting and a challenge to see my value in this context.

On the plus side, people here are very interesting in diverse ways, and are
generally well traveled. This has resulted in many great conversations and I even
got to meet a long time geek hero of mine, [@b0rk](https://twitter.com/b0rk)!

### The Cost Of Benefits

Working at Stripe is great. Stripe offers a lot of benefits and three fantastic
meals a day at the office. No really, the food is incredible.

As a result, people spend a lot of time at the office doing amazing things and socializing
with colleagues. Possibly more time than they otherwise would.

## Next Steps

I need to introduce OpenMRS to the people at Stripe and harvest some time from
the geniuses and polymaths to help improve OpenMRS. This needs to happen sooner rather than later, so that
I'm still around to show people the ways in which they can contribute.

The Swagger specification improvement task is my main technical task at the moment,
since it's the first step towards creating both useful API documentation and a useful
JavaScript library.

## Conclusion

Although I may not have made a lot of progress yet on what I originally thought
I was going to do, I think I've definitely taken some steps in the right direction.

> Thanks to Stripe for hosting me so far!

<script type="text/javascript" src="//cdn.jsdelivr.net/github-cards/latest/widget.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js"></script>
<script type="text/javascript" src="//code.highcharts.com/highcharts.js"></script>
<script type="text/javascript" src="/public/data/stripe-month-one-productivity-data.json.js"></script>
<script type="text/javascript" src="/public/scripts/stripe-month-one.js"></script>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-53335198-1', 'auto');
  ga('send', 'pageview');

</script>
