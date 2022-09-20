const video = document.getElementById("video");


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models'),
]).then(loadVideo)


async function loadVideo() {
    let stream = null || {};
    try {
        stream = await navigator.mediaDevices.getUserMedia({video:true,audio:false})
        video.srcObject = stream
    } catch (error) {
        alert("unable to connect device..!")
        console.log(error);
    } 
}

video.addEventListener(()=>{
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const dim = {width:video.width,height:video.height}
    faceapi.matchDimensions(canvas,dim)

    setInterval(async () => {
     const detections =  await faceapi.detectAllFaces(video,new faceapi.tinyFaceDetectorOptions()).withFacelandMarks().withFaceExpressions()
     const resizedDetection = faceapi.resizeResults(detections,dim)
     canvas.getContect("2d").clearRect(0,0,canvas.height,canvas.width)
     faceapi.draw.drawDetections(canvas,resizedDetection) 
    }, 100);
},[])