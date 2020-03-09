const isCordovaApp = Boolean(typeof window !== 'undefined' && window.Cordova)

if (isCordovaApp) {
  console.log(window.plugins)
  const { biometric } = window.plugins
  // type returned to success callback: 'face' on iPhone X, 'touch' on other devices
  biometric.isAvailable(
    type => {
      biometric.verifyBiometric(
        'Scan your biometric please', // this will be shown in the native scanner popup
        msg => alert('ok: ' + msg), // success handler: biometric accepted
        msg => alert('not ok: ' + JSON.stringify(msg)) // error handler with errorcode and localised reason
      )
    },
    msg => alert('not available, message: ' + msg) // error handler: no TouchID available
  )

  // navigator.camera.getPicture((a, b, c) => {
  //   console.log('success: ', a, b, c)
  // }, () => {
  //   console.log('error: ', a, b, c)
  // })
}
