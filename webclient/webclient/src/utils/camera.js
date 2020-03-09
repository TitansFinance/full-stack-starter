/*
 * Access Camera
**/

export async function getMedia(pc) {
  navigator.permissions.query({name: 'camera'})
    .then((permissionObj) => {
      console.log(permissionObj.state)
    })
    .catch((error) => {
      console.log('Got error :', error)
    })

  navigator.getMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  )

  try {
    console.log(navigator.mediaDevices)
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    /* use the stream */
    return { stream, error: null }
  } catch(error) {
    /* handle the error */
    console.error(error)
    return { stream: null,  error }
  }
}
