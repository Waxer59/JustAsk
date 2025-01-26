export const getUserMicrophone = async (): Promise<MediaStream | null> => {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia({
        audio: true
      })
    }
  } catch (e) {
    console.log(e)
  }

  return null
}
