
const express = require("express");
const { v4: uuid } = require("uuid");
const router = express.Router();
const fs = require("fs");
const cors = require("cors");
const multer = require("multer")

router.use(cors())
router.use(express.json())

// if add anything after the / then it will be part of the url
router.get("/", (request, response) => {
    const videosData = readVideos();

    const strippedData = videosData.map((video) => {
        return {
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image

        };
    });
    response.status(200).json(strippedData);
});


router.get("/:id", (request, response) => {

    const videoId = request.params.id
    // find the video from the videos data that matches the param Id and return it
    const videosData = readVideos();
    const selectedVideo = videosData.find(video =>  video.id === videoId)
    if (selectedVideo) {
        response.status(200).json(selectedVideo);
    } else {
        response.status(404).send("Video not found")
    }
});


router.post("/", (request, response) => {

    const body = request.body;
    const videosData = readVideos();
    const newVideo = {
        id: uuid(),
        title: body.title,
        channel: "channel1",
        description: body.description,
        timestamp: Date.now(),
        image: "http://localhost:9000/images/Upload-video-preview.jpg",
        comments: [
          
        ],

        likes: 0,
        views: 0,
        // TODO generate a random time
        duration: "4:30"

    }


    videosData.push(newVideo);

    // ----------
    writeVideos(videosData)
    // ----------
    response.status(201).send(videosData);

})

function readVideos () {
    const videosFile = fs.readFileSync("./data/videos.json")
    const videosData = JSON.parse(videosFile);
    return videosData;
}

function writeVideos (data) {
    // const 
    fs.writeFile(
        `./data/videos.json`,
        // TODO change to actual json file
        JSON.stringify(data),
        (err) => {
          if (err) {
            console.log(err);
            return;
          } else {
            console.log("file written successfully");
          }
        }
      );
}

// upload images to json using multer ----------------------------------------------------------
// const storage = multer.diskStorage({
//     destination: function(req, file, callback) {
//       callback(null, '/public/images');
//     },
//     filename: function (req, file, callback) {
//       callback(null, file.fieldname);
//     }
// });

// router.post('/', upload.single('file'), (req, res) => {
//     if (!req.file) {
//       console.log("No file received");
//       return res.send({
//         success: false
//       });
  
//     } else {
//       console.log('file received');
//       return res.send({
//         success: true
//       })
//     }
//   });
  // end upload  -----------------------------------------------------------

router.post("/:videoId/comments", (request, response) => {
        const videoId = request.params.videoId;
        // find the video from the videos data that matches the param Id and return it
        const videosData = readVideos();
        // get the video with the matching id
        const body = request.body;

        const selectedVideo = videosData.find(video => video.id === videoId )


        const videoComments = selectedVideo.comments


        videoComments.push({
            name: "anonymous",
            id: uuid(),
            comment: body.comment,
            timestamp: Date.now(),
            likes: 0
        })


        writeVideos(videosData)

        if (selectedVideo) {
            response.status(201).send(videoComments)
        } else {
            response.status(404).send("cannot post video")
        }
})


router.put("/:videoId/likes", (request, response) => {

    const vidId = request.params.videoId
    const videosData = readVideos()

    // get the selected video
    const selectedVideo = videosData.find(video => vidId === video.id)
    
    // access the likes for the selected video
    let vidLikes = selectedVideo.likes
    // increment the counter
    vidLikes++;
    selectedVideo.likes = vidLikes;

 
    writeVideos(videosData)
    response.status(201).send(selectedVideo);

})


router.delete("/:videoId/comments/:commentId", (request, response) => {

    const videoId = request.params.videoId;
    const commentId = request.params.commentId;
    // find the video from the videos data that matches the param Id and return it
    const videosData = readVideos();
    //const body = request.body;

    // get the current video using the params
    const selectedVideo = videosData.find( video => video.id === videoId)
    // // get the selected comment (one that is clicked on to be deleted)
    const commentsToKeep = selectedVideo.comments.filter(comment => comment.id !== commentId);
    selectedVideo.comments = commentsToKeep

    writeVideos(videosData)


    response.status(201).send("Comment deleted")

})



module.exports = router;