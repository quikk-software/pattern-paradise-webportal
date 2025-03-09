importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDZK-s64gEzXF8dsTP42w3T2rlD3OKgWpI',
  authDomain: 'pattern-paradise.firebaseapp.com',
  projectId: 'pattern-paradise',
  storageBucket: 'pattern-paradise.firebasestorage.app',
  messagingSenderId: '608358089878',
  appId: '1:608358089878:web:3acc6039e99f44d86aeeb7',
  measurementId: 'G-DYG4Q4N3JJ',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  if (typeof window !== 'undefined') {
    if (Notification.permission === 'granted') {
      if (navigator.serviceWorker)
        navigator.serviceWorker.getRegistration().then(async function (reg) {
          if (reg)
            await reg.showNotification(payload.notification.title, {
              body: payload.notification.body,
            });
        });
    }
  }
});
