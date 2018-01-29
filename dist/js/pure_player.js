/**
 * @author Oleksii Svyrydenko aka Alex Slipknot
 * @copyright Oleksii Svyrydenko
 * @version 1.0
 */
'use strict';

(function () {
    Element.prototype.on = function (eventName, eventListener, useCapture) {
        this.addEventListener(eventName, eventListener, useCapture);
        return this;
    };

    HTMLElement.prototype.purePlayer = function (params) {
        var defaultParams = {
            format: 'video/mp4',
            video: {
                '': {
                    'src': this.src,
                    'subtitles': 'link_to_subtitles'
                }
            }
        };

        params = params || defaultParams;

        for (var attr in defaultParams) {
            params[attr] = typeof params[attr] !== 'undefined' ? params[attr] : defaultParams[attr];
        }

        var me = this,
            preloaderItem = document.createElement('div'),
            preloader = document.createElement('div'),
            source = document.createElement('source'),
            video = document.createElement('video'),
            player = document.createElement('div'),
            controlsBar = document.createElement('div'),
            progressWrapper = document.createElement('div'),
            hovered = document.createElement('span'),
            progressCommon = document.createElement('div'),
            progressPosition = document.createElement('div'),
            progressLoader = document.createElement('div'),
            playButton = document.createElement('div'),
            timeProgress = document.createElement('span'),
            controlButtons = document.createElement('div'),
            speedBox = document.createElement('ul'),
            selectedSpeed = document.createElement('li'),
            speedBoxHidden = document.createElement('li'),
            speed = document.createElement('ul'),
            speedItem = document.createElement('li'),
            qualityBox = document.createElement('ul'),
            selectedQuality = document.createElement('li'),
            qualityBoxHidden = document.createElement('li'),
            quality = document.createElement('ul'),
            volumeBox = document.createElement('div'),
            volumeIcon = document.createElement('div'),
            volumeBar = document.createElement('div'),
            volume = document.createElement('div'),
            fullSizeIcon = document.createElement('div'),
            hideTimer,
            fingerX = 0,
            stopRewind = true,
            rewindWorking = false;

        var fn = {
            toggleFullScreen: function () {
                if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
                    if (player.webkitEnterFullscreen) {
                        player.webkitEnterFullscreen();
                    } else if (player.requestFullscreen) {
                        player.requestFullscreen();
                    } else if (player.mozRequestFullScreen) {
                        player.mozRequestFullScreen();
                    } else if (player.webkitRequestFullscreen) {
                        player.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (player.webkitExitFullscreen) {
                        player.webkitExitFullscreen();
                    } else if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                }
            },
            convertTime: function (sec) {
                var hh = Math.floor(sec / 60 / 60).toFixed();
                var mm = Math.floor((sec - hh * 60 * 60) / 60).toFixed();
                var ss = (((sec - hh * 60 * 60) - mm * 60)).toFixed();
                if (mm < 10) {
                    mm = '0' + mm;
                }
                if (ss < 10) {
                    ss = '0' + ss;
                }
                if (hh > 0) {
                    return hh + ':' + mm + ':' + ss;
                } else {
                    return mm + ':' + ss;
                }
            },
            setVolume: function (i) {
                i = i || 0;

                if (i > 1) i = 1;
                if (i < 0) i = 0;

                if (i > 0) {
                    volumeIcon.className = 'volume-icon';
                } else {
                    volumeIcon.className = 'volume-icon volume-off';
                }

                video.volume = i;
                volume.style.width = video.volume * 100 + '%';
                document.cookie = 'volume=' + i;
            },
            volumeInc: function (i) {
                i = i || 0.2;
                fn.setVolume(video.volume + i);
            },
            volumeDec: function (i) {
                i = i || 0.2;
                fn.setVolume(video.volume - i);
            },
            toggleMute: function () {
                if (video.volume > 0) {
                    fn.setVolume(0);
                } else {
                    fn.setVolume(1);
                }
            },
            updatePosition: function () {
                progressPosition.style.width = video.currentTime / video.duration * 100 + '%';
                timeProgress.innerHTML = fn.convertTime(video.currentTime || 0) + ' / ' + fn.convertTime(video.duration || 0);

                if (video.duration - video.currentTime === 0 && typeof me.onend === 'function') {
                    me.onend();
                }
            },
            rewind: function (backward) {
                rewindWorking = true;

                if (!video.paused) {
                    video.pause();
                }

                if (!backward) {
                    video.currentTime += 10;
                } else {
                    video.currentTime -= 10;
                }

                this.updatePosition();
                this.showPanel();

                if (!stopRewind) {
                    setTimeout(function () {
                        fn.rewind(backward)
                    }, 100);
                } else {
                    rewindWorking = false;
                }
            },
            hidePanel: function () {
                controlsBar.className = 'controls-bar zero-opacity';
                document.body.style.cursor = 'none';
            },
            showPanel: function () {
                controlsBar.className = 'controls-bar';
                document.body.style.cursor = 'auto';
                clearTimeout(hideTimer);
                hideTimer = setTimeout(fn.hidePanel, 2000);
            }
        };

        preloaderItem.className = 'facebook_blockG';

        preloader.className = 'preloader';
        preloader.appendChild(preloaderItem);
        preloader.appendChild(preloaderItem.cloneNode(true));
        preloader.appendChild(preloaderItem.cloneNode(true));

        source.setAttribute('type', params.format);

        video.appendChild(source);
        video.oncontextmenu = function () {
            return false;
        };
        video.on('click', function () {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        }).on('progress', function () {
            if (this.buffered.length > 0) {
                progressLoader.style.left = this.buffered.start(0) / this.duration * 100 + '%';
                progressLoader.style.width = this.buffered.end(this.buffered.length - 1) / this.duration * 100 - parseFloat(progressLoader.style.left) + '%';
            }
        }).on('loadstart', function () {
            preloader.style.display = 'block';
        }).on('loadeddata', function () {
            volume.style.width = this.volume * 100 + '%';
            preloader.style.display = 'none';
            timeProgress.innerHTML = fn.convertTime(this.currentTime) + ' / ' + fn.convertTime(this.duration);
        }).on('pause', function () {
            playButton.className = 'play-button';

            if (typeof me.onpause === 'function') {
                me.onpause(video.currentTime);
            }
        }).on('play', function () {
            playButton.className = 'play-button pause';
            fn.setVolume(document.cookie.replace(/(?:(?:^|.*;\s*)volume\s*\=\s*([^;]*).*$)|^.*$/, "$1"));

            if (typeof me.onplay === 'function') {
                me.onplay(video.currentTime);
            }
        }).on('timeupdate', function () {
            if (this.duration) {
                fn.updatePosition();
            }
        }).on('dblclick', fn.toggleFullScreen).on('touchstart', function (e) {
            if (e.targetTouches.length === 1) {
                fingerX = e.targetTouches[0].pageX;
            }
        }).on('touchmove', function (e) {
            if (e.targetTouches.length === 1) {
                stopRewind = false;
                if (e.targetTouches[0].pageX > fingerX + 20 && !rewindWorking) {
                    fn.rewind(false)
                } else if (e.targetTouches[0].pageX < fingerX - 20 && !rewindWorking) {
                    fn.rewind(true)
                }
            }
        }).on('touchend', function () {
            stopRewind = true;
        });

        playButton.className = 'play-button';
        playButton.on('click', function () {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        hovered.className = 'hovered';

        timeProgress.className = 'time';

        progressPosition.className = 'progress-position';

        progressLoader.className = 'loader';

        controlsBar.className = 'controls-bar';

        selectedSpeed.className = 'selected-speed';
        selectedSpeed.innerText = 'x1.0';
        selectedSpeed.on('click', function (e) {
            e.stopPropagation();

            if (speedBoxHidden.style.display === 'block') {
                speedBoxHidden.style.display = 'none';
            } else {
                speedBoxHidden.style.display = 'block';
            }
        });

        selectedQuality.className = 'selected-quality';
        selectedQuality.on('click', function (e) {
            e.stopPropagation();

            if (qualityBoxHidden.style.display === 'block') {
                qualityBoxHidden.style.display = 'none';
            } else {
                qualityBoxHidden.style.display = 'block';
            }
        });

        for (var i = 0.5; i <= 2; i += 0.5) {
            var si = speedItem.cloneNode(true);
            si.dataset.v = i;
            si.innerText = 'x' + (i.toString().length === 1 ? i + '.0' : i);
            si.on('click', function () {
                var all = speed.childNodes;
                [].forEach.call(all, function (i) {
                    i.className = '';
                });

                video.playbackRate = this.dataset.v;
                this.className = 'active';
                selectedSpeed.innerHTML = this.innerText;
                speedBoxHidden.style.display = 'none';
            });
            speed.appendChild(si);
        }

        speed.className = 'speed';
        speed.querySelector('[data-v="1"]').className = 'active';

        speedBoxHidden.className = 'speed-box-hidden';
        speedBoxHidden.appendChild(speed);

        volumeIcon.className = 'volume-icon';
        volumeIcon.on('click', function () {
            fn.toggleMute();
        });

        volume.className = 'volume';

        volumeBar.className = 'volume-bar';
        volumeBar.appendChild(volume);
        volumeBar.on('click', function (e) {
            var i = e.offsetX / this.offsetWidth;
            fn.setVolume(i);
        });

        volumeBox.className = 'volume-box';
        volumeBox.appendChild(volumeIcon);
        volumeBox.appendChild(volumeBar);

        quality.className = 'quality';

        for (var q in params.video) {
            var qi = document.createElement('li');
            qi.innerText = q;
            qi.on('click', function () {
                var all = quality.childNodes,
                    isPaused = video.paused,
                    currentTime = video.currentTime;

                [].forEach.call(all, function (i) {
                    i.className = '';
                });

                this.className = 'active';
                selectedQuality.innerText = this.innerText;
                source.setAttribute('src', params.video[this.innerText].src);
                video.src = params.video[this.innerText].src;
                video.currentTime = currentTime;
                if (!isPaused) video.play();
                qualityBoxHidden.style.display = 'none';
            });
            quality.appendChild(qi);
        }

        qualityBoxHidden.className = 'quality-box-hidden';
        qualityBoxHidden.appendChild(quality);

        qualityBox.className = 'quality-box';
        qualityBox.appendChild(selectedQuality);
        qualityBox.appendChild(qualityBoxHidden);

        speedBox.className = 'speed-box';
        speedBox.appendChild(selectedSpeed);
        speedBox.appendChild(speedBoxHidden);

        fullSizeIcon.className = 'full-size-icon';
        fullSizeIcon.on('click', fn.toggleFullScreen);

        controlButtons.className = 'control-buttons';
        controlButtons.appendChild(speedBox);
        controlButtons.appendChild(qualityBox);
        controlButtons.appendChild(volumeBox);
        controlButtons.appendChild(fullSizeIcon);

        progressCommon.className = 'progress';
        progressCommon.appendChild(progressPosition);
        progressCommon.appendChild(progressLoader);

        progressWrapper.className = 'progress-wrap';
        progressWrapper.appendChild(hovered);
        progressWrapper.appendChild(progressCommon);
        progressWrapper.on('click', function (e) {
            video.currentTime = video.duration * (e.offsetX / (this.offsetWidth - e.target.offsetLeft));
        }).on('mousemove', function (e) {
            hovered.innerText = fn.convertTime((video.duration || 0) * e.offsetX / (this.offsetWidth - this.offsetLeft));
            hovered.style.left = ((e.offsetX + e.target.offsetLeft) - hovered.offsetWidth / 2) + 'px';
        });

        controlsBar.appendChild(progressWrapper);
        controlsBar.appendChild(playButton);
        controlsBar.appendChild(timeProgress);
        controlsBar.appendChild(controlButtons);

        player.className = 'pure-player';
        player.setAttribute('tabindex', '0');
        player.appendChild(preloader);
        player.appendChild(video);
        player.appendChild(controlsBar);
        player.on('mousemove', fn.showPanel).on('click', function () {
            qualityBoxHidden.style.display = 'none';
            speedBoxHidden.style.display = 'none';
        }).on('keydown', function (e) {
            e = e || window.event;
            e.preventDefault();

            switch (e.which || e.keyCode) {
                case 37:
                    if (video.currentTime - 5 > 0) {
                        video.currentTime -= 5;
                    } else {
                        video.currentTime = 0;
                    }
                    break;
                case 39:
                    if (video.currentTime + 5 < video.duration) {
                        video.currentTime += 5;
                    } else {
                        video.currentTime = video.duration;
                    }
                    break;
                case 38:
                    fn.volumeInc();
                    break;
                case 40:
                    fn.volumeDec();
                    break;
                case 32:
                    playButton.click();
                    break;
                case 77:
                    fn.toggleMute();
                    break;
                default:
                    break;
            }
            fn.showPanel();
        }).on('mousewheel', function (e) {
            e.preventDefault();

            if (e.wheelDelta < 0) {
                fn.volumeDec();
            } else {
                fn.volumeInc();
            }
        });

        this.init = function () {
            this.style.display = 'none';
            this.parentNode.insertBefore(player, this.parentNode.nextSibling);
            quality.firstChild.click();
            fn.setVolume(document.cookie.replace(/(?:(?:^|.*;\s*)volume\s*\=\s*([^;]*).*$)|^.*$/, "$1") || 1);

            if (params.autoplay) {
                video.play();
            }
        };

        this.destroy = function () {
            video.pause();
            this.parentNode.removeChild(player);
            this.style.display = '';
        };

        this.play = function () {
            video.play();
        };

        this.pause = function () {
            video.pause();
        };

        this.stop = function () {
            video.pause();
            video.currentTime = 0;
        };

        this.setPosition = function (i) {
            video.currentTime = i;
        };

        this.init();

        return this;
    };
})();