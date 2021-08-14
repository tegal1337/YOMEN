# Youtube-Auto-Commenter
Youtube Bot Auto Commenter Using Puppeter and NodeJS

see this DEMO in here  (https://www.youtube.com/watch?v=P2KkjYFLc3A)
## Demo
[![Alt text](https://img.youtube.com/vi/P2KkjYFLc3A/hqdefault.jpg)](https://www.youtube.com/watch?v=P2KkjYFLc3A)

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

## Requirements

 - Windows / Linux
 - Google Chrome
 - a Youtube account 

## Custom 

` You can custom your comment in main.js file `

in line 98

```javascript

 document.querySelector("div[id='contenteditable-root']").innerHTML =
           "Hello Subscribe my channel";
          
````
           

## Donating me 

https://saweria.co/fdciabdul
