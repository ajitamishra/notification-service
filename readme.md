## Desktop Notifications

A node module for sending notifications in electron applications.

![screenshot](notif.png)

## Dependencies

It requires electron environment.

~~~
npm install --save electron
~~~

## Installation

~~~
npm install --save notify-v1
~~~

## Quick Usage

~~~ javascript
const notifier = require('notify-v1')


const title="Test Notification";
const Message= "Appointment is scheduled in next 10 minutes."
const customNotificationWrapper=(value)=>{
   alert(value)
    console.log('clicked',value);
}


notifier.CustomNotificationService(customNotificationWrapper,title,Message);

~~~



## About

When you create a new notification, your notification is stacked one below another,
Each notification is a [BrowserWindow](browserwindow)instance, 
so it's completely cross platform.