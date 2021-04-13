console.log('loaded PushNotification')
function registerPushNotifications() {
  pushNotification = window.plugins.pushNotification;
  console.log('registerPushNotifications')
  var successHandler = (a, b, c) => console.log('success', a, b, c)
  var errorHandler = (a, b, c) => console.log('error', a, b, c)

  if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ) {
      pushNotification.register(
          successHandler,
          errorHandler,
          {
              "senderID": "12345667810",
              "ecb": "onNotification",
          }
      );
  } else if ( device.platform == 'blackberry10') {
      pushNotification.register(
          successHandler,
          errorHandler,
          {
              invokeTargetId : "replace_with_invoke_target_id",
              appId: "replace_with_app_id",
              ppgUrl: "replace_with_ppg_url", //remove for BES pushes
              ecb: "pushNotificationHandler",
              simChangeCallback: replace_with_simChange_callback,
              pushTransportReadyCallback: replace_with_pushTransportReady_callback,
              launchApplicationOnPush: true,
          }
      );
  } else {
      pushNotification.register(
          tokenHandler,
          errorHandler,
          {
              "badge": "true",
              "sound": "true",
              "alert": "true",
              "ecb": "onNotificationAPN",
          }
      );
  }
}

registerPushNotifications()

// console.log('app load')
// PushNotification.createChannel(
//   () => {
//     console.log('success')
//   },
//   () => {
//     console.log('error')
//   },
//   {
//     id: 'testchannel1',
//     description: 'My first test channel',
//     importance: 3,
//     vibration: true,
//   }
// )
