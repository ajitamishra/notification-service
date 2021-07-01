
      let notificationWindows=[];
      let queue=[];
      let activeNotifications=[];
      let notificationType=null;
      let notification={};
      const {ipcMain}=require('electron').remote;
      const {app,BrowserWindow}=require('electron').remote;
      const path=require('path');
      const url=require('url')
      const electron=require('electron')
 

    function CustomNotificationService( customNotificationWrapper,title ,Message) {
           const { width, height } = electron.remote.screen.getPrimaryDisplay().workAreaSize;
           let yy= 0;
           notificationType=null;
           
          
           let windowOptions={
            width: 400,
            height: 200,
            x: width - Math.ceil(width * 0.20),
            y: 0,
            resizable: true,
            alwaysOnTop:true,
            minimizable: true,
            maximizable: true,
            frame:false,
            webPreferences: {
              nodeIntegration: true,
              contextIsolation:false,
              devTools:false
          }   
          }
          const notificationWindow = new BrowserWindow(windowOptions);
          queue.push({
            window:notificationWindow,
            title:title,
            Message:Message,
            customNotificationWrapper:customNotificationWrapper
          });
          showNext();
          return notificationWindow;
        }
        const showNext=()=>{
          if (queue.length === 0) {
            return;
            
          }
          const { width, height } = electron.remote.screen.getPrimaryDisplay().workAreaSize;
          const notification = queue.shift();
          const title = notification.title;
          const Message = notification.Message;
          let notificationWindow = notification.window;
          var notificationY = 0;
          for(var i = 0; i < activeNotifications.length ; i++) {
            var item = activeNotifications[i];
            notificationY += item.window.getBounds().height
          }
          

          activeNotifications.push(notification);
          
          let notificationWindowURL;
        
        // Set the notification window URL
        
          notificationWindowURL = url.format({
            pathname: path.join(__dirname, 'notification.html'),
            protocol: 'file:',
            slashes: true
          });
          notificationWindow.loadURL(notificationWindowURL);
          notificationWindow.webContents.on('did-finish-load', () => {
            let notificationObj={title,Message,winId:notificationWindow.id}
            notificationWindow.webContents.openDevTools();
            notificationWindow.show();
            notificationWindows.push(notificationWindow)
          notificationWindow.webContents.send('notify', notificationObj);
          })
          const timeout = setTimeout(() => {
            if (!notificationWindow.isDestroyed()) {
              notificationWindows.shift()
              notificationWindow.close()
              activeNotifications.shift();
            }
            let yy=0;
            notificationWindows.forEach((item,i)=>{
           
            const { y ,x,height,width} = item.getBounds();
            yy=Math.ceil(height + i*(height+10));
            item.setBounds({
              width,
              height,
              x,
              y:(yy-180)})
          })
         
          },  10000);
          let nextY=0;
          for(var i = 0; i < activeNotifications.length ; i++) {
            var item = activeNotifications[i];
            
            var canMove = true;
            try {
              item.window.getPosition();
            } catch(e) {
              canMove = false;
            }
            if(canMove) {
             
              const size = electron.remote.screen.getPrimaryDisplay().workAreaSize
              // TODO - do a pretty slide up/down to collapse list
              item.window.setPosition(
                item.window.getPosition()[0],
               nextY  ,
                true /* TODO : this is electron "animate" param - it's not working on windows */
              );
              var itemHeight = item.window.getBounds().height;
              
              nextY += i==0?(itemHeight + 30):itemHeight+ i;
              
            }
          }
   
            ipcMain.on('manuallycloseNotificationWindow', (event,winId) => { 
          notificationWindows.forEach((item,i)=>{
          
          if(item.id===winId)
          {
          notificationWindows[i].close();
          notificationWindows.splice(i,1);
          }
          
        })
        let yy=0;
            notificationWindows.forEach((item,i)=>{
           
            const { y ,x,height,width} = item.getBounds();
            yy=Math.ceil(height + i*(height+10));
            item.setBounds({
              width,
              height,
              x,
              y:(yy-180)})
          })
       })

       ipcMain.on('viewNotification',(e,arg)=>{
            
            notificationType=arg.notificationType;
           
            if(notificationType)
            {
              notification.customNotificationWrapper(notificationType)
            }
          });
        
        }     
    module.exports= {CustomNotificationService};
    