# PurePlayer
HTML5 Javascript player

![PurePlayer](https://i.imgur.com/Z1dhwuQ.jpg)

With this player you can add video in different quality. You can see basic usage in the example folder.

Basic usage:

`document.querySelector('video.my-player').purePlayer();`

Advanced usage:

    .purePlayer({
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
            },
            '240': {
                'src': '../example/video/240.mp4'
            }
        }
    });