
let songs;
let currfolder;
let currentsong = new Audio();




function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`https://sheladiyakishan.github.io/spotify-5/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    console.log(div);

    let as = div.getElementsByTagName("a");
    songs = []
    
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
        <img src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", ' ').replaceAll('%26', ' ')}</div>
            <div>song Artist</div>

        </div>
        <div class="playnow">
            <span>play now</span>
            <img src="play.svg" alt="">
        </div>
    </li>`;
    }



    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
                
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            
            play.src = "play.svg"


        })

    });

    
        return songs;


}


const playmusic = (track) => {
    console.log(track);
    
    currentsong.src = `/${currfolder}/` + track;
    
    currentsong.play();
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

let default1 = 'ncs'

async function displayalbum() {
    let a = await fetch(`${folder}`)
    console.log(a);
    
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".cardcontainer");

    let array = Array.from(anchors)
    
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        console.log(e);
        



        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-1)[0];
            console.log(folder);
            
            let a = await fetch(`/${folder}/info.json`)
            console.log(folder);
            
            let response = await a.json();

            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}"  class="card">

            <div class="play">

                <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="25" fill="#1ed760" />
                    <g transform="translate(13, 13)">
                        <path
                            d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"
                            fill="#000000"></path>
                    </g>
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="">
            <p class="p1">${response.title}</p>
            <p class="p2">${response.description}</p>
            </div>`




        }

    }
}

async function main() {


    // get the list of all the songs 
    await getsongs("ncs");

    // display all the albums on the page 
    await displayalbum();



    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "play.svg"
        }
        else {
            currentsong.pause()
            play.src = "pause.svg"
        }
    })


    currentsong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`


        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";


    })


    document.querySelector(".seekbar").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        document.querySelector(".circle").style.left = percent + "%";

        currentsong.currentTime = ((currentsong.duration) * percent / 100)

    })

    document.querySelector(".hamberger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-150%";
    })


    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        
         play.src = "play.svg"
        if ((index - 1) >= 0) {
            
            playmusic(songs[index - 1])
            
        }
        else {
            playmusic(songs[index])

        }

    })


    next.addEventListener("click", () => {

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        play.src = "play.svg"
        
        if ((index + 1) < songs.length) {

            playmusic(songs[index + 1])
        }
        else {
            playmusic(songs[index])
        }

    })


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currentsong.volume = parseInt(e.target.value) / 100
      
        if (currentsong.volume >0){
            console.log( document.querySelector(".volume>img").src);
            
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
            
        }

    })



    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {

          songs=  await getsongs(`songs/${item.currentTarget.dataset.folder}`);
          console.log(songs);
          
            playmusic(songs[0])
            play.src = "play.svg"

        })
    })

    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target.src);
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src = "volume.svg";
            currentsong.volume = 0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 70;

        }
    })


}

main()















