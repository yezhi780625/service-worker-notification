(function(window, navigator){
  if (Notification.permission !== 'granted') {
    Notification.requestPermission(function(status) {
      console.log('User Choice', status);
      if (status !== 'granted') {
        console.log('推播允許被拒絕了!');
      }
    });
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(swRegistration => {
        console.log('SW registered!', swRegistration);
        return swRegistration;
      })
      .then(swRegistration => {
        if (Notification.permission === 'granted') {
          initializeUI(swRegistration);
        }
      })
      .catch(err => console.log('Error!', err));
  }
}(window, navigator))