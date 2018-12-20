function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(swRegistration => {
        console.log('SW registered!', swRegistration);
        return swRegistration;
      })
      .then(swRegistration => {
        initializeUI(swRegistration); 
      })
      .catch(err => console.log('Error!', err));
  }
}

(function(window, navigator){
  if (Notification.permission === 'default') {
    Notification.requestPermission(function(status) {
      if (status !== 'granted') {
        console.log('推播允許被拒絕了!');
      }
    }).then(() => registerSW());
  } else {
    registerSW();
  }
}(window, navigator))