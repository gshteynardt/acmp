/*
Implement a player that accepts a list of audios with timings 
and plays them in accordance with the timings

Timeline:   0         5         10        15
            |---------|---------|---------|
Playback:    [====]  [===]  [=============]
            (0.5-3) (4.5-6)     (8-15)
*/

type AudioTrack = {
    audio: HTMLAudioElement;
    startTime: number;
    endTime: number;
};

class Player {
    tracks: AudioTrack[];
    currentIndex: number;
    timerId: number | null;
    delay: number;
    pausedTime: number;

    constructor(tracks: AudioTrack[]) {
        this.tracks = tracks;
        this.currentIndex = 0;
        this.timerId = null;
        this.delay = this.tracks[this.currentIndex].startTime * 1000;
        this.pausedTime = 0;
    }

    play() {
        if (this.currentIndex >= this.tracks.length) {
            return;
        }

        const { audio } = this.tracks[this.currentIndex];

        this.timerId = setTimeout(() => {
            if (this.pausedTime > 0) {
                audio.currentTime = this.pausedTime;
                this.pausedTime = 0;
            }

            audio.play();

            audio.addEventListener('ended', this.#handleEnded);
        }, this.delay);
    }

    pause() {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }

        if (this.currentIndex < this.tracks.length) {
            const currAudio = this.tracks[this.currentIndex].audio;
            currAudio.pause();

            this.pausedTime = currAudio.currentTime;
            this.delay = 0;
        }
    }

    #handleEnded() {
        this.currentIndex++;

        if (this.currentIndex < this.tracks.length) {
            const prev = this.tracks[this.currentIndex - 1];
            const curr = this.tracks[this.currentIndex];
            this.delay = (curr.startTime - prev.endTime) * 1000;
        } else {
            this.delay = 0;
        }

        this.play();
    }
}

const player = new Player([
    { audio: new Audio('audio1.mp3'), startTime: 0.5, endTime: 3 },
    { audio: new Audio('audio2.mp3'), startTime: 4.5, endTime: 6 },
    { audio: new Audio('audio3.mp3'), startTime: 8, endTime: 15 },
]);

player.play();

/*
  // aka HTMLAudioElement
    class Audio { 
        play()
        pause()

     // not essencial but some may ask
     currentTime; // s
        addEventListener('ended', () => {})
     paused; // boolean
}
*/
