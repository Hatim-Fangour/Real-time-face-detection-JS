const video = document.getElementById("video")

const container = document.getElementById("container")




const MODEL_URL = "/models";

const options = {
    scoreThreshold: .3
}

const showBox = () => {
    const canvas = faceapi.createCanvasFromMedia(video)  
    container.appendChild(canvas)


    setInterval(async () => {
        
        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)


        const detections = await faceapi
                .detectAllFaces(video,new faceapi.TinyFaceDetectorOptions(options))
                // .withFaceLandmarks()

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawDetections(canvas, resizedDetections)

// custom your boundingBox
        detections.map((dtc) => {
            console.log(dtc)
            
            const box = { x: dtc._box.x, y: dtc._box.y, width: dtc._box.width, height: dtc._box.height }
            
            const drawOptions = {
                
                label: dtc.score.toFixed(2),
                lineWidth: 1,
                boxColor: "rgb(0,255,0)",
                
                drawLabelOptions: {
                    backgroundColor: "#efefef",
                    fontColor: "#000",
                    fontSize: 16,
                    padding: 5
                }
            }
            

            const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
            drawBox.draw(canvas)
            
        })

    }, 1)
}


const startWebCam = () => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })
        .then((stream) => {
            video.srcObject = stream
            
        })
        .catch((err) => {
            console.log(err)
        })
}






Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
]).then(startWebCam);



video.addEventListener("play", showBox)
