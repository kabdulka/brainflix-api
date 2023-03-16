
const express = require("express");
const { v4: uuid } = require("uuid");
const router = express.Router();
// const data = require("../data/videos2.json");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer")

// const videosData = data;

// TODO generate random numbers for video time

router.use(cors())
router.use(express.json())
// app.use(express.static('../public'));

// if add anything after the / then it will be part of the url
router.get("/", (request, response) => {
    // response.send(videosData);
    const videosData = readVideos();

    const strippedData = videosData.map((video) => {
        return {
            id: video.id,
            title: video.title,
            channel: video.channel,
            // description: video.description
            image: video.image

        };
    });
    response.status(200).json(strippedData);
});


router.get("/:id", (request, response) => {

    // console.log("request.params: ", request.params.id);
    const videoId = request.params.id
    // find the video from the videos data that matches the param Id and return it
    const videosData = readVideos();
    const selectedVideo = videosData.find(video =>  video.id === videoId)
    console.log(selectedVideo)
    if (selectedVideo) {
        response.status(200).json(selectedVideo);
    } else {
        response.status(404).send("Video not found")
    }
});


router.post("/", (request, response) => {

    const body = request.body;
    console.log(body)
    const videosData = readVideos();
    const newVideo = {

        id: uuid(),
        title: body.title,
        channel: "channel1",
        description: body.description,
        timestamp: Date.now(),
        image: "http://localhost:9000/images/Upload-video-preview.jpg",
        // comments
        // make a hard coded comment for each video
        comments: [
          
        ],

        likes: 0,
        views: 0,
        // TODO generate a random time
        duration: "4:30"

    }

    console.log("request.body: ", request.body);

    videosData.push(newVideo);

    // ----------
    writeVideos(videosData)
    // ----------
    response.status(201).send(videosData);

})

function readVideos () {
    const videosFile = fs.readFileSync("./data/videos2.json")
    const videosData = JSON.parse(videosFile);
    return videosData;
}

function writeVideos (data) {
    // const 
    fs.writeFile(
        `./data/videos2.json`,
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


// https://localhost:9000/videos/:videoId/comments

router.post("/:videoId/comments", (request, response) => {
        // console.log("request.params: ", request.params.id);
        const videoId = request.params.videoId;
        // find the video from the videos data that matches the param Id and return it
        const videosData = readVideos();
        // get the video with the matching id
        // console.log(videoId)
        const body = request.body;

        const selectedVideo = videosData.find(video => video.id === videoId )

        console.log("here")
        // console.log(selectedVideo);

        const videoComments = selectedVideo.comments
        console.log("Video comments: ")
        console.log(videoComments)

        videoComments.push({
            name: "anonymous",
            id: uuid(),
            comment: body.comment,
            timestamp: Date.now(),
            likes: 0
        })

        console.log("Video comments 22222222: ")
        console.log(videoComments)

        writeVideos(videosData)

        if (selectedVideo) {
            response.status(201).send(videoComments)
        } else {
            response.status(404).send("cannot post video")
        }
})


//     const deleteCommentUrl = `${API_URL}/${request}/${currentVideo.id}/comments/${commentId}`;
// https://localhost:9000/videos/:videoId/comments/:commentId
router.delete("/:videoId/comments/:commentId", (request, response) => {
    console.log("current comment selected is : ")

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
    // console.log("current comment selected is: ")
    console.log(commentsToKeep)
    console.log("commentsToKeep")
    console.log(selectedVideo.comments)
    // res.status(204).send();
    // error here
    // TODO
    writeVideos(videosData)


    response.status(201).send("Comment deleted")

})



module.exports = router;