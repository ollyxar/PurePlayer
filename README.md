# PurePlayer

[![Build Status](https://travis-ci.org/ollyxar/PurePlayer.svg?branch=master)](https://travis-ci.org/ollyxar/PurePlayer)
![Version](https://img.shields.io/npm/v/pure_player.svg)
![License](https://img.shields.io/npm/l/pure_player.svg)

HTML5 Javascript player

![PurePlayer](https://i.imgur.com/Z1dhwuQ.jpg)

With this player you can add video in different quality. You can see basic usage in the example folder.

#### Basic usage:

`document.querySelector('video.my-player').purePlayer();`

#### Advanced usage:

    var myPlayer = document.getElementById('player').purePlayer({
        autoplay: false,
        format: 'video/mp4',
        video: {
            '720': {
                'src': '../example/video/720.mp4'
            },
            '480': {
                'src': '../example/video/480.mp4'
            },
            '360': {
                'src': '../example/video/360.mp4'
            }
        }
    });
    
#### Available methods:
|Method           |Description                           |
|-----------------|--------------------------------------|
|`.play()`        |Play the video                        |
|`.pause()`       |Pause the video                       |
|`.stop()`        |Stop playing and set position to start|
|`.setPosition(5)`|Set current position (in seconds)     |
|`.destroy()`     |Remove current player                 |
|`.init()`        |Initiate player after removing        |

#### Available events:
##### onplay
|||
|---|---|
|`.onplay`|Call when video start playing. You can specify parameter to get position (in seconds) of current video.|
Example:

    myPlayer.onplay = function (currentPosition) {
        console.log('Play video from ', currentPosition);
    }
##### onpause
|||
|---|---|
|`.onpause`|Call when video pause playing. You can specify parameter to get position (in seconds) of current video.| 
Example:

    myPlayer.onpause = function (currentPosition) {
        console.log('Pause video from ', currentPosition);
    }
    
##### onend
|||
|---|---|
|`.onend`|Call when video finished.| 
Example:

    myPlayer.onend = function () {
        console.log('The end!');
    }