// <!-- Its an online website documment requires/supports an online database for fetching data -->
// <!-- Continue from 5:00:00 -->
console.log("Lets write JS")
let currsong = new Audio()
let songs
let currfold

// converts seconds into minutes:seconds format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0)
        return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currfold = folder

    // fetch is used to fetch data from any path from the disc
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    // saving the data into text or string form in the response variable
    let response = await a.text()
    // console.log(response)

    // creating a div
    let div = document.createElement("div")
    // inserting the fetched data into div
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    // console.log(as)

    // creating an empty array to store fetched songs
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // 1 represent the second part of splitted string
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // console.log(songs)




    // shows all songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""

    // adding songs into ul(list)
    for (const song of songs) {
        // songUL.innerHTML = songUL.innerHTML + `<li> ${song.replaceAll("%20", " ")} </li>`
        songUL.innerHTML = songUL.innerHTML +
            `<li>
                <img class="invert" src="img/music.svg" alt="">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Tushar</div>
                    </div>
                    <div class="playNow">
                        <span>play Now</span>
                        <img class="invert" src="img/play.svg" alt="">
                </div>
            </li>`
    }

    // Understand its working
    // attatch an event listener to each song, using an array, for selecting it
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            // trim() is used to remove unecessary spaces from begining and ending 
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}

// didn't understand clearly
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    // updating the current songs src
    currsong.src = `/${currfold}/` + track
    // audio.play()



    // issue on 2:45:00



    // insures to play the first song of playlist by default
    if (!pause) {
        currsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"



}

async function disalbum() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardcont = document.querySelector(".cardcont")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            // get the meta data of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            // let a = await fetch(`http://127.0.0.1:3000/songs/${folder}`)
            // let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json()
            // console.log(response)
            // console.log(folder)

            cardcont.innerHTML = cardcont.innerHTML +
                `<div data-folder="${folder}" class="card">
                        <!-- <div class="play"><img src="img/play.svg" alt=""></div> -->
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" fill="#000" stroke="#141B34" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                </div>`
        }
    }


    // load the folder whenever class is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e)
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            // console.log(songs)
        })
    })
}

async function main() {
    // get the list of all songs
    await getsongs("songs/cs")

    // for playing the first song
    // currsong.src = songs[0]
    playMusic(songs[0], true)

    // display all the albums in the songs folder
    disalbum()


    // attatch an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currsong.paused) {
            currsong.play()
            play.src = "img/pause.svg"
        } else {
            currsong.pause()
            play.src = "img/play.svg"
        }
    })

    // listen for time-update event to update the song time
    currsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currsong.currentTime)}/${secondsToMinutesSeconds(currsong.duration)}`
        document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration) * 100 + "%"
    })

    // add an event listener to seekbar to update time with seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currsong.currentTime = ((currsong.duration) * percent) / 100
    })

    // add an event listener on hameburger for toggling menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add an event listener on hameburger for toggling menu
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add an eventlistener to previous button 
    previous.addEventListener("click", () => {
        // currsong.pause()
        console.log("songs = ", songs)
        console.log("Previous Clicked")
        console.log("songs = ", songs.indexOf(currsong.src))

        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // add an eventlistener to next button 
    next.addEventListener("click", () => {
        // currsong.pause()
        console.log("Next Clicked")

        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // adding an eventlistener on range to control the volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/ 100")
        currsong.volume = parseInt(e.target.value) / 100

        if(currsong.volume > 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/mute.svg", "img/volume.svg")
        }
        if(currsong.volume == 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/volume.svg", "img/mute.svg")
        }
    })

    // add an event listener on volume button for mute facility
    document.querySelector(".volume>img").addEventListener("click", (e)=>{
        // console.log(e.target)

        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currsong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }else{
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currsong.volume = .1
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10

        }
    })
















    // // play the first song
    // var audio = new Audio(songs[0])
    // // audio.play()  

    // // loads the song and count the song duration
    // audio.addEventListener("loadeddata", () => {
    //     // let duration = audio.duration
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime)
    // })
}

main()