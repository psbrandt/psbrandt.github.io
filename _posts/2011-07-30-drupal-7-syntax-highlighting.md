---
layout: post
title: !binary |-
  RHJ1cGFsIDcgU3ludGF4IEhpZ2hsaWdodGluZw==
created: 1312033789
---
It seems like the <a href="http://drupal.org/project/geshifilter">GeSHi Filter</a> is the most popular Drupal 7.x module for syntax highlighting. To get it up and running, first install the dependent <a href="http://drupal.org/project/libraries">Libraries API</a> (2.x-dev) and download the required <a href="http://sourceforge.net/projects/geshi/files/geshi/">GeSHi PHP Library</a> (1.0.x), then install the <a href="http://drupal.org/project/geshifilter">GeSHi Filter</a> module. As per the GeSHi Filter README, extract the GeSHi Library to <code>/sites/all/modules/geshifilter</code> and then enable the module via the Drupal admin interface. If the <a href="http://drupal.org/node/1148540">library isn&#39;t detected</a>, try <a href="http://stackoverflow.com/questions/1230261/how-do-i-empty-drupal-cache-without-devel">clearing the cache</a>.

Once the GeSHi module is running, you have to enable the filter on your preferred text format (e.g. Filtered HTML). You do this on the <code>Admin >> Configuration >> Text Formats</code> page. I also had to put GeSHi at the bottom of the processing order to get it to work. If you're using a WYSIWYG editor (like <a href="http://drupal.org/project/ckeditor">CKEditor</a>) for creating content, make sure it's not escaping special characters like '>'.

Once you get the module fully functional, you should be able to highlight a wide variety of languages, as illustrated in the following examples.

Java class example.

{% highlight java %}
/**
 * Dummy Java class to illustrate GeSHi 
 *
 * @author Pascal Brandt
 */
public class Dummy {
    
    // Constants
    public static final DUMMY_STRING = "Dummy";

    // Members
    protected int dummyInt;
    protected List<Integer> dummyList;

    // Contructor
    public Dummy(int dInt, List<Integer> dList) {
        dummyInt = dInt;
        dummyList = dList;
    }
}
{% endhighlight java %}

PHP example from <a href="http://www.mediawiki.org/">MediaWiki</a>'s LocalSettings.php config file.

{% highlight php startinline %}
$wgUploadPath       = "$wgScriptPath/uploads";      ## Wiki 1.5 defaults to /images, but allows more than just images
$wgUploadDirectory  = "$IP/uploads";                ## Wiki 1.5 defaults to /images, but allows more than just images

## To enable image uploads, make sure the above '$wgUploadPath' directory is writable by Apache User or group.
## ''(i.e.  chmod og+w uploads images)''  then the following should be true:
$wgEnableUploads       = true;
 
$wgUseImageResize      = true;
$wgUseImageMagick      = true;
$wgImageMagickConvertCommand = "/usr/bin/convert";
 
## If you want to use image uploads under safe mode, create the directories images/archive, images/thumb and
## images/temp, and make them all writable. Then uncomment this, if it's not already uncommented:
$wgHashedUploadDirectory = false;
{% endhighlight php %}

Python list comprehension example.

{% highlight python %}
new_range = [i * i for i in range(5) if i % 2 == 0]
{% endhighlight python %}

MySQL create table example.

{% highlight mysql %}
CREATE TABLE client_firms (
    id   INT,
    name VARCHAR(35)
)
PARTITION BY LIST (id) (
    PARTITION r0 VALUES IN (1, 5, 9, 13, 17, 21),
    PARTITION r1 VALUES IN (2, 6, 10, 14, 18, 22),
    PARTITION r2 VALUES IN (3, 7, 11, 15, 19, 23),
    PARTITION r3 VALUES IN (4, 8, 12, 16, 20, 24)
);
{% endhighlight mysql %}

In theory, inline code snippets like {% highlight php nowrap startinline %}$var = 35{% endhighlight php %} should also work.

**EDIT:** Since I migrated to [Jekyll](http://jekyllrb.com/), the above code is actually highlighted using [Pygments](http://pygments.org/).

