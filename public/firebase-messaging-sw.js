/* eslint-disable no-undef */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts(
    'https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js'
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
// TIP: Replace these with your actual config values if env vars don't work in SW directly
// (In standard Create React App / Vite, you might need to hardcode specific values here
// or use a build step to inject them. For now we try to read from global scope or assume config).
//
// NOTA: Service Workers não acessam import.meta.env diretamente.
// O ideal é que o build injete isso, mas como quick fix para MVP, 
// o usuário terá que configurar ou o código busca de uma rota.
// Para simplificar, vou assumir que o config será passado ou usar defaults.
//
// TODO: HARDCODED CONFIG IS NEEDED FOR SW IF NOT USING A BUILD INJECTOR
// I will create a placeholder for the user to fill or use the "onBackgroundMessage" purely via logic.

firebase.initializeApp({
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "367926221762",
    appId: "YOUR_APP_ID"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/pwa-192x192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
