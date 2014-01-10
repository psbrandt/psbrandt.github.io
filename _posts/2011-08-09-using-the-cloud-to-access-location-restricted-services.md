---
layout: post
title: !binary |-
  VXNpbmcgVGhlIENsb3VkIFRvIEFjY2VzcyBMb2NhdGlvbiBSZXN0cmljdGVk
  IFNlcnZpY2Vz
created: 1312895263
---
Many cool services such as <a href="http://www.pandora.com/">Pandora</a>, <a href="http://www.spotify.com/">Spotify</a>, <a href="http://www.bbc.co.uk/iplayer">BBC iPlayer</a> and <a href="http://www.netflix.com/">Netflix</a> are restricted to users in the US or UK.

There are a number of ways to get around this problem, the most reliable of which is probably to pay for a US/UK based proxy or VPN server. There is at least one free (for a while) way to access such services, which I will describe here.

The method I'm going to describe involves setting up a machine in the cloud, installing a proxy server on the machine and setting up your local machine to use the proxy.

<h2>AWS Instance Setup</h2>

Sign up for an <a href="https://console.aws.amazon.com/ec2/home">Amazon Web Services</a> account (you will need a valid credit card and telephone number). Read about the conditions of the <a href="http://aws.amazon.com/free/">free usage tier</a>.

Once you've signed up and verified your identity (telephone number), log into the <a href="https://console.aws.amazon.com/ec2/home">AWS console</a>. At this point you'll have to choose whether you want a US or an EU based instance. Select your desired location from the <strong>Region</strong> drop down menu in the top left corner.

Select the <strong>Instances</strong> page from the menu on the left and hit the <strong>Launch Instance</strong> button. I'll describe how to set up an <a href="https://help.ubuntu.com/community/EC2StartersGuide">Ubuntu</a> instance, since this is what I did. Select the <strong>Community AMIs</strong> tab. You'll need to search for the appropriate AMI as defined on <a href="http://uec-images.ubuntu.com/releases/11.04/release/">this</a> page (i.e. <code>ami-379ea943</code> for EU or <code>ami-1aad5273</code> for US-East). Make sure whatever AMI you choose is eligible for the free usage tier. Click the <strong>Select</strong> button next to the AMI. Make sure that the <strong>Instance Type</strong> is <strong>Micro</strong> and click <strong>Continue</strong>. Click <strong>Continue</strong> again, then give your instance a name and <strong>Continue</strong>.

<strong>Create a new Key Pair</strong> and make sure to download it (let's call it <code>key_pair.pem</code>), then <strong>Create a new Security Group</strong> and make sure that you specify a port (lets call it the <code>http_port</code>) for the proxy server to listen on. You could use a port commonly used for something else to avoid any suspicion if someone scans your instance. They aren't likely to suspect that you have a proxy running on port <code>8080</code> for example. You're also going to need to open port <code>22</code> for <code>ssh</code> access. To open these ports, simply enter the port number in the <strong>Port range</strong> text box and click <strong>Add Rule</strong>.

Finally, review your configuration and click <strong>Launch</strong>. After a few seconds your instance will be up and running. Select your instance and take note of the <code>public_dns</code> in the <strong>Description</strong> pane below. You'll use this URL to connect to your instance.

<h2>Squid Configuration</h2>

Connect to your instance from the command line as follows.
<bash>
ssh -i /path/to/key_pair.pem ubuntu@public_dns
</bash>
You may need to set the permissions on your key file (i.e. <code>chmod 600 key_pair.pem</code>).

By default, the normal Ubuntu software repositories aren't enabled, so you'll have to edit <code>/etc/apt/sources.list</code> and uncomment all the repositories and then do a <code>sudo apt-get update</code>.

We'll use <a href="http://www.squid-cache.org/">Squid</a> as our proxy server. Install it as follows.
<bash>
sudo apt-get install squid
</bash>
As mentioned <a href="https://help.ubuntu.com/11.04/serverguide/C/squid.html">here</a>, well need to configure the port on which squid listens. We do all the squid configuration in the config file located at <code>/etc/squid/squid.conf</code>.

Change the listening port by setting the <code>http_port</code> directive in the config file (the default is 3128) to the <code>http_port</code> security rule you created during your instance configuration.

<h4>Squid Access Control</h4>

It's unlikely that you want your instance to be a public proxy for all client hosts and destination servers, so you'll want to implement some kind of access control. This can be done in many ways, but basically you can limit access by <code>src</code> IP, destination domain (<code>dstdomain</code>) or by requiring username/password authentication (e.g. by using <code>ncsa_auth</code> as described <a href="http://beginlinux.com/server_training/proxy-server/1049-squid-proxy-authentication">here</a>).

If you're using an application like <a href="http://www.boxee.tv/">Boxee</a> or <a href="http://www.xbmc.org">XBMC</a>, which don't support proxy authentication, then you'll probably want to limit access by <code>src</code> or <code>dstdomain</code>.

As an example, if you want all of your friends to be able to use your proxy, but only for, say, Spotify and Pandora, then you can add the following at the <strong>bottom</strong> of the <strong>ACL</strong> section of the config file.
<code>
acl RADIO dstdomain .spotify.com .pandora.com
</code>
and then add
<code>
http_access allow RADIO
</code>
to the <strong>top</strong> of the <strong>http_access</strong> section of the config file.

By default, Squid forwards our client IPs to the destination hosts, so we'll need to disable this to mask our location. We do this (as described <a href="http://www.cyberciti.biz/faq/squid-proxy-is-not-hiding-client-ip-address/">here</a>) by setting the <code>forwarded_for</code> directive to <code>off</code> in the config file.

Lastly, remember to restart Squid as follows to ensure your new configuration becomes active.
<bash>
sudo /etc/init.d/squid restart
</bash>
You should now have a proxy server, based in the US or EU, listening on a port of your choosing with some measure of access control implemented.

<h2>Client Configuration</h2>

All that is left to do is to tell your client application (I'll use Firefox as an example) to connect through the proxy server.

By default, Firefox has the ability to connect through a proxy, but the control isn't very fine grained. You can either connect to all sites through the proxy, or not use the proxy at all.

In order to have more control over which sites actually connect via the proxy server, I recommend installing the <a href="https://addons.mozilla.org/en-US/firefox/addon/foxyproxy-standard/">FoxyProxy Standard</a> addon for Firefox.

Once you've installed the addon and restarted Firefox, go to <strong>Tools >> FoxyProxy Standard >> Options</strong> and select <strong>Add New Proxy</strong>. Give the proxy server a name and enter the <code>public_dns</code> and <code>http_port</code>. Then go to the <strong>URL Patterns</strong> tab and <strong>Add New Pattern</strong>. Give it a name (e.g. Spotify) and specify the pattern (e.g. <code>*spotify.com*</code>).

Make sure that <strong>Use proxies based on their pre-defined patterns and priorities</strong> is chosen for the <strong>Select mode</strong> drop down on the main FoxyProxy options pane.

Now you should be able to sign up on Pandora or request an invite on Spotify (assuming you have configured Squid to allow access and have specified the proxy and URL patterns in FoxyProxy).

<h2>Service Notes</h2>
If you're connecting through a US based proxy, you can sign up for Pandora and listen as long as you always connect via the proxy. With Spotify (which has recently been launched in the US), you can't directly sign up for an account. You can, however, find some invitation codes <a href="http://www.reddit.com/r/spotifyinvites">here</a> and then use them <a href="http://www.spotify.com/invitation/">here</a> to sign up. Once you sign up for Spotify and download the client, you can listen without connecting through the proxy!

Netflix seems to employ some kind of proxy detection software, so I haven't been able to get that working yet. I haven't tried BBC iPlayer.

<h2>Caveats</h2>

While this method is free for a while (a year, or until you use up your free bandwidth), it's definitely not a permanent solution.

<h2>Further Work</h2>

There are a few things I need to try to get Netflix to work, namely, I need to see what headers Squid is sending and disable the ones which could potentially reveal the fact that it's a proxy. Also, I still need to try out iPlayer.
