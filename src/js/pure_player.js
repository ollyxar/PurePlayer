/**
 * @author Oleksii Svyrydenko aka Alex Slipknot
 * @copyright Oleksii Svyrydenko
 * @version 1.0
 */
'use strict';

(function () {
    var purePlayer = function (params) {
        params = params || {
                type: 'video/mp4'
            };
        this.style.display = 'none';

        var preloaderItem = document.createElement('div'),
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
            fullSizeIcon = document.createElement('div');

        preloaderItem.className = 'facebook_blockG';

        preloader.className = 'preloader';
        preloader.appendChild(preloaderItem);
        preloader.appendChild(preloaderItem.cloneNode(true));
        preloader.appendChild(preloaderItem.cloneNode(true));

        source.setAttribute('type', params.type);

        video.appendChild(source);

        playButton.className = 'play-button';

        hovered.className = 'hovered';

        timeProgress.className = 'time';

        progressPosition.className = 'progress-position';

        progressLoader.className = 'loader';

        controlsBar.className = 'controls-bar';

        selectedSpeed.className = 'selected-speed';
        selectedSpeed.innerText = 'x1.0';

        selectedQuality.className = 'selected-quality';
        selectedQuality.innerText = '360p';

        for (var i = 0.5; i <= 2; i += 0.5) {
            var si = speedItem.cloneNode(true);
            si.dataset.v = i;
            si.innerText = 'x' + (i.toString().length === 1 ? i + '.0' : i);
            si.addEventListener('click', function () {
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

        volume.className = 'volume';

        volumeBar.className = 'volume-bar';
        volumeBar.appendChild(volume);

        volumeBox.className = 'volume-box';
        volumeBox.appendChild(volumeIcon);
        volumeBox.appendChild(volumeBar);

        quality.className = 'quality';

        qualityBoxHidden.className = 'quality-box-hidden';
        qualityBoxHidden.appendChild(quality);

        qualityBox.className = 'quality-box';
        qualityBox.appendChild(selectedQuality);
        qualityBox.appendChild(qualityBoxHidden);

        speedBox.className = 'speed-box';
        speedBox.appendChild(selectedSpeed);
        speedBox.appendChild(speedBoxHidden);

        fullSizeIcon.className = 'full-size-icon';

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

        controlsBar.appendChild(progressWrapper);
        controlsBar.appendChild(playButton);
        controlsBar.appendChild(timeProgress);
        controlsBar.appendChild(controlButtons);

        player.className = 'pure-player';
        player.appendChild(preloader);
        player.appendChild(controlsBar);
        player.appendChild(video);

        this.parentNode.insertBefore(player, this.parentNode.nextSibling);
    };

    HTMLElement.prototype.purePlayer = purePlayer;
})();