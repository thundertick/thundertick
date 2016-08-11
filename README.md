#<img src = "http://i.imgur.com/o4UeJuw.png" style="height:60px"/>     

Thundertick is the super-powertool for google chrome and firefox.   

<img src = "http://imgur.com/download/ispI4xx"> 
##Installation   
You can install thundertick from the [Chrome Webstore](https://chrome.google.com/webstore/detail/fjlfmlponipgmabidmcmijicbbfnbnnj/).   
You can install thundertick from the [Mozilla Add-on Store](https://addons.mozilla.org/en-GB/firefox/addon/thundertick/).   

   
You can get the latest unreleased versions by loading an unpacked extension by [building the code in the repository manually.](#Build)

##Usage   
To launch thundertick on any open tab you can either click the thundertick browser-action(the icon in your toolbar) or you can tap on the ```backtick``` key on your keyboard.   

<img src = "http://thundertick.com/images/keyboard.png" alt = "thundertick keyboard" style="width:600px"/> 

##Build   
After cloning this repository, run ```npm install``` in the root directory to install the dependencies. As soon as all of them are installed, you will have to install and run ```webpack``` to bundle all the scripts and styles correctly for use, you then will have to use
gulp, to select the correct version of manifest for your respective browser. i.e ```npm run manifest:chrome``` or ```npm run manifest:firefox`   

You can then load the extension into chrome by using the developer feature, "Load unpacked extension", or into firefox by visiting ```about:debugging```.

##Help 

If you need help with anything regarding this extension, you can contact me via the github issues page, or by sending me an email - manak [at] thundertick[dot]com

##Social

You can keep up to date with the latest updates about thundertick by liking our [Facebook Page](https://www.facebook.com/thundertick).