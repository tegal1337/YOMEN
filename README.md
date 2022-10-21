

  <p align="center">
  <image src="https://hamptonlittleleague.files.wordpress.com/2022/03/youtube-logo.wine_.png" align="center"  width="400"/>
<h1 align="center"> Youtube-Auto-Commenter </h1>
Youtube Bot Auto Commenter Using Puppeter and NodeJS
    </p>
    
## Quick Links

* [Demo](https://www.youtube.com/watch?v=C7AOauxguSc)
* [Installation](#run--installation)
* [Feature](#feature)
* [Configuration](#configuration)



## Demo
 <a href="https://www.youtube.com/watch?v=C7AOauxguSc"> <image src="https://user-images.githubusercontent.com/31664438/177520285-2cecfe81-0ae4-477a-a5e6-908a05adef27.gif" align="center" width="100%" /> </a>

```bash
$ see this DEMO in here > https://www.youtube.com/watch?v=C7AOauxguSc

```

## Run / Installation
How to run ?

```bash
> git clone https://github.com/tegal1337/Youtube-Auto-Commenter/
> cd Youtube-Auto-Commenter
> npm install
> node main.js
```

dont forget to change the google username and password in ` config.js`

```javascript
module.exports = {
  keywords: "keywords",
  usernamegoogle: "username",
  passwordgoogle: "pass",
};

```
## Feature

 Feature  | Status |
| -------------:|------------- |
| Random Copy Comment | Ok|
| Comment On Trending | Ok |
| Comment based on Keyword | Ok |
| Multi Account |  Ok|

## Requirements

 - Windows / Linux
 - Google Chrome
 - a Youtube account 

## Running on android 

yes of course the bot is still works on android
see my video on here 
https://www.youtube.com/watch?v=C7AOauxguSc

but you need ubuntu installed on your android , use Termux for it!
and install ubuntu desktop with Andronix 
i prefer ubuntu 20 , cuz it's more stable than 18 

command for installing inside the ubuntu 

copy and paste one by one , don't be lazy dude 🤨

```bash
> apt instal
> apt update
> apt upgrade 
> apt install chromium-browser
> apt install npm
> npm install -g n
> n install lts
> hash -r 
> apt install curl
> curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
> echo "deb https://dl.yarnpkg.com/debian/ stable main" |  tee /etc/apt/sources.list.d/yarn.list
> apt install yarn 
```

go to directory of this project , then install the dependency

```bash
yarn
```


also you need to change `executableFilePath` in `main.js` 
you can set to /usr/bin/chromium

## Configuration 

 Config  | Info |
| -------------:|------------- |
| keyword | fill the keyword , for searching videos of course|
| comments | list of the comment |
| usernamegoogle | your username google |
| password |  your google password|
| delaycomment |  delay commenting / seconds |
| trending | Comment based on trending videos on your location|
| multiaccount |  Multiple account , loop based and not multi threaded |


## Donate

???





           

