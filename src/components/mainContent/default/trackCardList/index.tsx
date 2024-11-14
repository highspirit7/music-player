import { useState, useRef } from 'react'

import { genres } from '@/lib/const'
import { Track } from '@/lib/types'
import { createPlayingTrack } from '@/lib/utils'
import { usePlayerStore } from '@/store/usePlayerStore'
import TrackCard from './track-card'
import ScrollButton from './scroll-button'

export default function TrackCardList({
  tracks,
  genre,
}: {
  tracks: Track[]
  genre: (typeof genres)[number]
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const isPlaying = usePlayerStore(state => state.isPlaying)
  const currentPlayingList = usePlayerStore(state => state.currentPlayingList)
  const setCurrentPlayingList = usePlayerStore(state => state.setCurrentPlayingList)
  const setCurrentPlayingTrack = usePlayerStore(state => state.setCurrentPlayingTrack)
  const setCurrentPlayTime = usePlayerStore(state => state.setCurrentPlayTime)
  const setHowlInstance = usePlayerStore(state => state.setHowlInstance)
  const playTrack = usePlayerStore(state => state.playTrack)
  const pauseTrack = usePlayerStore(state => state.pauseTrack)

  const handleClickArrowButton = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (container) {
      const cardWidth = 192 + 16 // div tag width + gap width
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
    }
  }

  const handleNewTrackClick = (clickedTrack: Track, index: number) => {
    if (isPlaying) pauseTrack()

    setCurrentPlayTime(0)
    setCurrentPlayingTrack(createPlayingTrack(clickedTrack, index))

    const isClickedTrackInSelectedList = currentPlayingList.some(
      track => track.id === clickedTrack.id,
    )
    if (!isClickedTrackInSelectedList) setCurrentPlayingList(tracks)

    setHowlInstance(clickedTrack.audiodownload)
    playTrack()
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{genre}</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <ScrollButton
            direction="left"
            onClick={() => handleClickArrowButton('left')}
            disabled={!canScrollLeft}
          />
          <ScrollButton
            direction="right"
            onClick={() => handleClickArrowButton('right')}
            disabled={!canScrollRight}
          />
        </div>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-1 space-x-4 scrollbar-hide hover:scrollbar-default"
          onScroll={handleScroll}
        >
          {tracks.map((track, index) => (
            <TrackCard
              key={track.id}
              data={track}
              onNewTrackClick={() => handleNewTrackClick(track, index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
