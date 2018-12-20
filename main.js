const pushButton = document.querySelector('.js-push-btn');
let isSubscribed = false;
let swRegistration = null;
// subscribeButtonDOM.addEventListener('click');

const applicationServerPublicKey =
  'BEtUR4TZz5UlAInzSKpPDn9sBm-OJD_x2GEzB4LeZbH_Ff36T1Vvmgj06MgEln-KskAzxK7YgmB8ldNKLP9wFgs';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  // subscribe
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    .then(function(subscription) {
      console.log('User is subscribed:', subscription);

      updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      updateBtn(isSubscribed);
    })
    .catch(function(err) {
      console.log('Failed to subscribe the user: ', err);
      updateBtn(isSubscribed);
    });
}

function updateSubscriptionOnServer(subscription) {
  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails = document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

function unsubscribeUser() {
  swRegistration.pushManager
    .getSubscription()
    .then(function(subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function(error) {
      console.log('Error unsubscribing', error);
    })
    .then(function() {
      updateSubscriptionOnServer(null);

      console.log('User is unsubscribed.');
      isSubscribed = false;

      updateBtn();
    });
}

function updateBtn(isSubscribed) {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  } 
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }
  pushButton.disabled = false;
}

function initializeUI(swReg) {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });
  swRegistration = swReg;
  swRegistration.pushManager.getSubscription().then(subscription => {
    isSubscribed = !(subscription === null);
    updateSubscriptionOnServer(subscription);
    if (isSubscribed) {
      console.log('User is subscribed.');
    } else {
      console.log('User is not subscribed.');
    }
    updateBtn();
  });
}
