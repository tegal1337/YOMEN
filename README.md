
<h1 align="center"> Youtube-Auto-Commenter </h1>
  <p align="center">
  <image src="https://cdn141.picsart.com/324328493124211.png" align="center"  height="100%">

Youtube Bot Auto Commenter Using Puppeter and NodeJS
    </p>



## Demo
[![Alt text](https://img.youtube.com/vi/fyrtHIs0vnI/hqdefault.jpg)](https://youtu.be/fyrtHIs0vnI)

see this DEMO in here  (https://youtu.be/fyrtHIs0vnI)

## Run
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
| ------------- | ------------- |
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
https://youtu.be/X7FwjKFcuSQ

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

> keywords 

fill the keyword , for searching videos of course

> comments

for the comment

> usernamegoogle 

your username google

> password

your google password

> delaycomment (seconds )

> trending

if you choose true , the bot will be automatic comment in trending section 

> multiaccount

fill your account in `multiakun.js`


## Donate

???





           

