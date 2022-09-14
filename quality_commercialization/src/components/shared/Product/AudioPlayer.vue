<template>
  <div class="audio-player">
    <div class="audio-player-top">
      <div class="audio-player-top-left" :class="{ notLoaded: !loaded }">
        <div class="play-stop" @click="playOrStop">
          <font-awesome-icon icon="play" v-if="showStopBtn" class="play-icon" />
          <font-awesome-icon class="stop-icon" icon="stop" v-else />
        </div>
        <div class="pause" @click="togglePause">
          <font-awesome-icon
            class="pause-icon"
            :class="{ highlit: paused }"
            icon="pause"
          />
        </div>
      </div>

      <!-- <div class="loading" v-if="!loaded">
        <p>Loading ..</p>
      </div> -->

      <div class="audio-player-volume" :class="{ notLoaded: !loaded }">
        <div class="vol-icon" @click="toggleMute">
          <font-awesome-icon
            icon="volume-mute"
            v-if="muted"
          /><font-awesome-icon
            icon="volume-down"
            v-else-if="!muted && volume < 0.5"
          /><font-awesome-icon icon="volume-up" v-else />
        </div>

        <div
          class="volumeBar"
          @mousedown="setVol"
          @mouseleave="setDragging('')"
          @mouseup="setDragging('')"
          @mousemove="dragVol"
        >
          <div class="volumebkg"></div>
          <div
            :class="`volume ${muted ? 'muted' : ''}`"
            :style="{
              clip: `rect(0px, ${parseInt(volume * 55)}px, 55px, 0px)`,
            }"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="audio-player-bottom"
      :class="{ notLoaded: !loaded }"
      @mouseleave="setDragging('')"
      @mouseup="setDragging('')"
    >
      <div class="audio-player-bar">
        <div
          class="audio-player-progress"
          :style="{ width: `${progressPct}%` }"
        />

        <div
          class="audio-player-mouse-handler"
          @mousedown="setProgress"
          @mousemove="dragProgress"
        ></div>
      </div>
    </div>
    <div
      class="audio-player-title-and-time"
      :class="{ notLoadedBottom: !loaded }"
    >
      <div class="audio-player-title">
        <E :h="title" t="p" />
      </div>
      <div class="audio-player-time">
        <p>{{ progressStr }} / {{ durationStr }}</p>
      </div>
      <div
        class="show-transcript-button"
        @click="showTranscriptScipt"
        :class="{ loadError: loadError }"
      >
        <p>
          <font-awesome-icon class="transcript-icon" icon="file" />Transcript
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Howl, Howler } from "howler"
import E from "@/components/editable/E.vue"
type DraggingArea = "" | "volume" | "progress"

const getXPos = (e: any) => {
  const rect = e.target.getBoundingClientRect()
  return e.clientX - rect.left
}

const roundVol = (vol: number) => {
  if (vol > 0.9) {
    return 1
  } else if (vol < 0.1) {
    return 0
  }
  return vol
}

const getTimeDisplay = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)

  const minStr = minutes < 10 ? "0" + minutes : "" + minutes
  const secStr = seconds < 10 ? "0" + seconds : "" + seconds

  return `${hours ? hours + ":" : ""}${minutes ? minStr + ":" : "00:"}${secStr}`
}

const getProgressTimeDisplay = (
  progressSeconds: number,
  durationSeconds: number
) => {
  const durationDisplay = getTimeDisplay(durationSeconds)

  const showHours = durationDisplay.split(":").length === 3
  const showMins = durationDisplay.split(":").length >= 2 // might be an "obsolete" line.. as I've changed the default 'no mins' display from just the seconds to 00:seconds (looks better)

  const hours = Math.floor(progressSeconds / 3600)
  progressSeconds %= 3600
  const minutes = Math.floor(progressSeconds / 60)
  const seconds = Math.floor(progressSeconds % 60)

  const minStr = minutes < 10 ? "0" + minutes : "" + minutes
  const secStr = seconds < 10 ? "0" + seconds : "" + seconds

  return `${showHours ? hours + ":" : ""}${
    showMins ? minStr + ":" : ":"
  }${secStr}`
}

const getProgressPct = (progressSeconds: number, durationSeconds: number) => {
  return (progressSeconds / durationSeconds) * 100
}

export default Vue.extend({
  name: "AudioPlayer",
  data() {
    return {
      showStopBtn: false,
      startedPlaying: false,
      draggingArea: "" as DraggingArea,
      paused: false,
      durationStr: "",
      progressStr: "",
      progressPct: 0,
      loaded: false,
      track: null as Howl | null,
      updateInterval: null as number | null,
      currentEmotion: "",
      currentTime: 0, // delete later
      loadError: false,
    }
  },
  props: ["file", "title", "id", "emotionInfo"],
  computed: {
    muted(): boolean {
      return this.$store.getters["getMuted"]
    },
    volume(): number {
      return this.$store.getters["getVolume"]
    },
  },
  mounted() {
    let file = this.file
    this.loadError = false

    this.autoStartTrack(file)
  },
  beforeDestroy() {
    this.track && this.track.stop()
    this.updateInterval ? clearInterval(this.updateInterval) : null
  },
  methods: {
    showTranscriptScipt() {
      this.$emit("transcriptClicked")
    },
    autoStartTrack(file: string) {
      let self = this
      var track = new Howl({
        src: ["./" + file],
        volume: this.volume,
        onload: () => {
          this.loaded = true
          this.track = track
          this.durationStr = getTimeDisplay(track.duration())
          this.progressStr = getProgressTimeDisplay(0, track.duration())

          if (this.muted) {
            track.mute(true)
          } else {
            track.mute(false)
          }

          track.play()

          this.currentEmotion = this.emotionInfo[0].emotion

          this.updateInterval = setInterval(() => {
            this.progressStr = getProgressTimeDisplay(
              track.seek(),
              track.duration()
            )
            // if this causes errors, make sure that this dragging area is not progress
            this.progressPct = (track.seek() / track.duration()) * 100

            this.checkEmotion()
          }, 10)
        },
        onloaderror(id, err) {
          alert(
            "Whoops! There was a network error loading the audio. You can still use the transcript button under the player to show the transcript. When finished, you should be able to still progress as normal by either clicking the remaining spakers, or the continue button if everyone is done."
          )
          console.log(`Error id: ${id}. ${err}`)
          self.loadError = true
        },
      })
    },
    checkEmotion() {
      if (this.track) {
        let currentTime = Math.floor(this.track.seek() * 1000)
        this.currentTime = currentTime
        // find the entry in emotions where current time is greater than it's "time" key
        // but less than the entry after it

        this.emotionInfo.forEach((emotionItem: any, i: number) => {
          if (currentTime >= emotionItem.time) {
            if (this.emotionInfo.length > i + 1) {
              if (this.emotionInfo[i + 1].time > currentTime) {
                this.currentEmotion = emotionItem.emotion
                return
              }
            } else {
              this.currentEmotion = emotionItem.emotion
              return
            }
          }
        })
      }
    },
    setProgress(e: any) {
      this.draggingArea = "progress"
      const x = getXPos(e)
      this.progressPct = (x / e.target.offsetWidth) * 100
      // as a finishing touch, this should probalby be debounced
      this.track!.seek((this.progressPct / 100) * this.track!.duration())

      this.checkEmotion()
    },
    dragProgress(e: any) {
      if (this.draggingArea === "progress") {
        const x = getXPos(e)
        this.progressPct = (x / e.target.offsetWidth) * 100
        // as a finishing touch, this should probalby be debounced
        this.track!.seek((this.progressPct / 100) * this.track!.duration())

        this.checkEmotion()
      }
    },

    setVol(e: any) {
      this.draggingArea = "volume"
      const x = getXPos(e)
      // this.volume = roundVol(parseFloat((x / 55).toFixed(2)))
      this.$store.dispatch("setVolume", parseFloat((x / 55).toFixed(2)))
    },
    dragVol(e: any) {
      if (this.draggingArea === "volume") {
        const x = getXPos(e)
        // this.volume = roundVol(parseFloat((x / 55).toFixed(2)))
        this.$store.dispatch("setVolume", parseFloat((x / 55).toFixed(2)))
      }
    },
    setDragging(area: DraggingArea) {
      this.draggingArea = area
    },

    playOrStop() {
      this.paused = false

      if (!this.showStopBtn) {
        // stop audio, go back to beginning
        this.startedPlaying = false
        this.track!.stop()

        this.currentEmotion = ""

        this.showStopBtn = true
      } else {
        // continue playing
        this.startedPlaying = true
        this.track!.play()

        this.checkEmotion()

        this.showStopBtn = false
      }
    },
    stop() {
      this.startedPlaying = false
      if (this.track) {
        this.startedPlaying = false
        this.track.stop()
      }

      this.currentEmotion = ""
    },
    togglePause() {
      // if (this.paused && this.startedPlaying && !this.showStopBtn) {
      //   // if we're unpausing and it's already playing, go back to stop button
      //   //this.showStopBtn = true
      // } else {
      //   //this.showStopBtn = false // show the play button if paused
      // }

      this.paused = !this.paused
      this.paused ? this.track!.pause() : this.track!.play()

      if (this.paused) {
        this.showStopBtn = true // did this get reversed somehow?
      }
    },
    toggleMute() {
      if (this.muted) {
        this.$store.dispatch("unMute")
        this.track!.mute(false)
      } else {
        this.$store.dispatch("mute")
        this.track!.mute(true)
      }
    },
  },
  components: { E },
  watch: {
    volume(newVal, oldVal) {
      this.track!.volume(newVal)
    },
    file(nv, ov) {
      this.track && this.track.stop()
      this.autoStartTrack(nv)
    },
    currentEmotion(nv, ov) {
      this.$emit("newEmotion", nv)
    },
  },
})
</script>

<style scoped lang="scss">
.audio-player-top {
  display: flex;
  height: 30%;
  align-items: center;
  justify-content: space-between;
  .play-stop,
  .pause {
    margin-right: 8px;
    cursor: pointer;
    font-size: 1.2em;
    color: $mediumGray;
  }
  .play-icon,
  .stop-icon,
  .pause-icon {
    transition: $very-fast-transition;
    &.highlit {
      color: $phaseGreen;
    }
    &:hover {
      color: $phaseGreen;
    }
  }

  .loading {
    p {
      font-weight: bold;
      font-size: $text-size-normal;
    }
  }

  .audio-player-top-left {
    display: flex;
    margin-left: 8px;
  }
}

.audio-player-bottom {
  display: flex;
  height: 20px;
  //background: brown;
  cursor: pointer;
  align-items: center;
  width: 103%;
  position: relative;
  .audio-player-mouse-handler {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .audio-player-bar {
    height: 8px;
    background: $lightGray;
    position: relative;
    width: 97%;
    left: 5px;
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;
  }
  .audio-player-progress {
    background: $phaseGreen;
    position: absolute;
    top: 0;
    left: 0;
    // width: 50%;
    height: 100%;
    border-radius: 3px;
  }
}
.audio-player-volume {
  display: flex;
  .vol-icon {
    cursor: pointer;
    font-size: 1.4em;
    margin-right: 10px;
    align-self: baseline;
    color: $mediumGray;
  }
  // http://jsfiddle.net/onigetoc/j010vxc0/
  .volumeBar {
    display: block;
    height: 23px;

    background-color: none;
    z-index: 100;
    width: 55px;
    cursor: pointer;
    position: relative;
    bottom: 5px;
  }
  .volume {
    /*background-color:#888;*/
    position: absolute;
    // clip: rect(0px, 27px, 55px, 0px);
    width: 55px;
    height: 0;
    border-style: solid;
    border-width: 0 0 28px 55px;
    border-color: transparent transparent $green transparent;
    line-height: 0px;
    &.muted {
      border-color: transparent transparent $lightGray transparent;
    }
  }
  .volumebkg {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 28px 55px;
    border-color: transparent transparent $lightGray transparent;
    line-height: 0px;
  }
}

.audio-player-title-and-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding: 5px;
  padding-left: 5px;
  color: $mediumGray;
  .audio-player-title {
    flex: 1;
    p {
      margin: 0;
      padding: 0;
      font-weight: bold;
      font-size: $text-size-normal;
    }
  }
  .audio-player-time {
    p {
      margin: 0;
      padding: 0;
      font-size: $text-size-small;
      font-weight: bold;
    }
    margin-right: 30px;
  }
  .show-transcript-button {
    p {
      margin: 0;
      padding: 0;
      font-size: 0.9em;
      font-weight: bold;
      .transcript-icon {
        margin-right: 5px;
      }
      &:hover {
        cursor: pointer;
        color: black;
      }
    }
  }
  &.notLoadedBottom {
    .audio-player-time {
      display: none;
    }
    .audio-player-title {
      opacity: 0.3;
    }
    .show-transcript-button {
      opacity: 0.3;
      &.loadError {
        opacity: 1;
      }
    }
  }
}
.notLoaded {
  pointer-events: none;
  opacity: 0.3;
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .audio-player-title {
  p {
    margin: 0;
    padding: 0;
    font-weight: bold;
    font-size: 20px;
  }
}
</style>
