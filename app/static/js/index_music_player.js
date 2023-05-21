$(function () {
    var playerTrack = $("#player-track"),
        bgArtwork = $("#bg-artwork"),
        bgArtworkUrl,
        albumName = $("#album-name"),
        trackName = $("#track-name"),
        albumArt = $("#album-art"),
        sArea = $("#s-area"),
        seekBar = $("#seek-bar"),
        trackTime = $("#track-time"),
        insTime = $("#ins-time"),
        sHover = $("#s-hover"),
        playPauseButton = $("#play-pause-button"),
        i = playPauseButton.find("i"),
        tProgress = $("#current-time"),
        tTime = $("#track-length"),
        seekT,
        seekLoc,
        seekBarPos,
        cM,
        ctMinutes,
        ctSeconds,
        curMinutes,
        curSeconds,
        durMinutes,
        durSeconds,
        playProgress,
        bTime,
        nTime = 0,
        buffInterval = null,
        tFlag = false,
        albums = [],
        trackNames = [],
        // albumArtworks = ["_1", "_2", "_3", "_4", "_5"],
        albumArtworks = [],
        trackUrl = [],
        playPreviousTrackButton = $("#play-previous"),
        playNextTrackButton = $("#play-next"),
        currIndex = 0;

    // 获取音频文件列表
    $.get("/api/music_files")
        .done(function (data) {
            var musicFiles = data;

            // 构造音频文件列表
            $.each(musicFiles, function (index, file) {
                var fileName = file.substring(0, file.lastIndexOf('.'));
                albums.push(fileName);
                trackNames.push(fileName);
                // albumArtworks.push("_" + (index + 1));
                albumArtworks.push(fileName);
                trackUrl.push("../static/music/" + file);
            });
            // 音频资源加载完成后初始化播放器
            initPlayer();
        })
        .fail(function (error) {
            console.error("Failed to load music files:", error);
        });

    function playPause() {
        if (audio.paused) {
            playerTrack.addClass("active");
            albumArt.addClass("active");
            checkBuffering();
            i.attr("class", "fas fa-pause");
            audio.play();
        } else {
            playerTrack.removeClass("active");
            albumArt.removeClass("active");
            clearInterval(buffInterval);
            albumArt.removeClass("buffering");
            i.attr("class", "fas fa-play");
            audio.pause();
        }
    }

    function showHover(event) {
        seekBarPos = sArea.offset();
        seekT = event.clientX - seekBarPos.left;
        seekLoc = audio.duration * (seekT / sArea.outerWidth());

        sHover.width(seekT);

        cM = seekLoc / 60;

        ctMinutes = Math.floor(cM);
        ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

        if (ctMinutes < 0 || ctSeconds < 0) return;

        if (ctMinutes < 0 || ctSeconds < 0) return;

        if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
        if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

        if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
        else insTime.text(ctMinutes + ":" + ctSeconds);

        insTime.css({left: seekT, "margin-left": "-21px"}).fadeIn(0);
    }

    function hideHover() {
        sHover.width(0);
        insTime.text("00:00").css({left: "0px", "margin-left": "0px"}).fadeOut(0);
    }

    function playFromClickedPos() {
        audio.currentTime = seekLoc;
        seekBar.width(seekT);
        hideHover();
    }

    function updateCurrTime() {
        nTime = new Date();
        nTime = nTime.getTime();

        if (!tFlag) {
            tFlag = true;
            trackTime.addClass("active");
        }

        curMinutes = Math.floor(audio.currentTime / 60);
        curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

        durMinutes = Math.floor(audio.duration / 60);
        durSeconds = Math.floor(audio.duration - durMinutes * 60);

        playProgress = (audio.currentTime / audio.duration) * 100;

        if (curMinutes < 10) curMinutes = "0" + curMinutes;
        if (curSeconds < 10) curSeconds = "0" + curSeconds;

        if (durMinutes < 10) durMinutes = "0" + durMinutes;
        if (durSeconds < 10) durSeconds = "0" + durSeconds;

        if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.text("00:00");
        else tProgress.text(curMinutes + ":" + curSeconds);

        if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.text("00:00");
        else tTime.text(durMinutes + ":" + durSeconds);

        if (
            isNaN(curMinutes) ||
            isNaN(curSeconds) ||
            isNaN(durMinutes) ||
            isNaN(durSeconds)
        )
            trackTime.removeClass("active");
        else trackTime.addClass("active");

        seekBar.width(playProgress + "%");

        if (playProgress === 100) {
            i.attr("class", "fa fa-play");
            seekBar.width(0);
            tProgress.text("00:00");
            albumArt.removeClass("buffering").removeClass("active");
            clearInterval(buffInterval);

            // 播放下一首
            selectTrack(1);
        }
    }

    function checkBuffering() {
        clearInterval(buffInterval);
        buffInterval = setInterval(function () {
            if (nTime === 0 || bTime - nTime > 1000) albumArt.addClass("buffering");
            else albumArt.removeClass("buffering");

            bTime = new Date();
            bTime = bTime.getTime();
        }, 100);
    }

    function selectTrack(flag) {
        currIndex += flag;
        if (currIndex >= trackUrl.length) {
            currIndex = 0;
        }
        if (currIndex < 0) {
            currIndex = trackUrl.length - 1;
        }

        if (currIndex > -1 && currIndex < albumArtworks.length) {
            if (flag === 0) i.attr("class", "fa fa-play");
            else {
                albumArt.removeClass("buffering");
                i.attr("class", "fa fa-pause");
            }

            seekBar.width(0);
            trackTime.removeClass("active");
            tProgress.text("00:00");
            tTime.text("00:00");

            currAlbum = albums[currIndex];
            currTrackName = trackNames[currIndex];
            currArtwork = albumArtworks.find(function (artwork) {
                return artwork.substring(0) === currTrackName;
            });

            audio.src = trackUrl[currIndex];

            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if (flag !== 0) {
                audio.play();
                playerTrack.addClass("active");
                albumArt.addClass("active");

                clearInterval(buffInterval);
                checkBuffering();
            }

            albumName.text(currAlbum);
            trackName.text(currTrackName);
            albumArt.find("img.active").removeClass("active");
            if ( !$("#auto_choose_url").hasClass("active")){
                $("#auto_choose_url").addClass("active");
            }

            bgArtworkUrl = $("#auto_choose_url").attr("src");
            bgArtworkUrl = "../" + trackUrl[currIndex].substring(0, trackUrl[currIndex].lastIndexOf("/")) + "/" + "img/" + currArtwork + ".jpg";

            bgArtwork.css({"background-image": "url(" + bgArtworkUrl + ")"});
            $("#auto_choose_url").attr("src", bgArtworkUrl);
        } else {
            if (flag === 0 || flag === 1) --currIndex;
            else ++currIndex;
        }
    }

    function initPlayer() {
        audio = new Audio();

        selectTrack(0);

        audio.loop = false;

        playPauseButton.on("click", playPause);

        sArea.mousemove(function (event) {
            showHover(event);
        });

        sArea.mouseout(hideHover);

        sArea.on("click", playFromClickedPos);

        audio.addEventListener("timeupdate", updateCurrTime);

        playPreviousTrackButton.click(function () {
            selectTrack(-1);
        });
        playNextTrackButton.click(function () {
            selectTrack(1);
        });

    }
});
