import React from 'react';
import { Volume2, VolumeX, Music2, Loader2 } from 'lucide-react';
import { useMediaContext } from '@/contexts/MediaContext';
import { cn } from '@/lib/utils';

/**
 * Floating background music player.
 *
 * - Tries to auto-play as soon as audio data is fully ready
 * - If browser blocks autoplay, starts on first user gesture (click/tap/key)
 * - Auto-pauses when audible content plays (audio or unmuted video)
 * - Auto-resumes when audible content stops
 * - Button toggles on/off manually
 */
export function BackgroundMusicPlayer({ musicConfig }) {
  if (!musicConfig?.audioUrl) return null;
  return <BackgroundMusicPlayerInner musicConfig={musicConfig} />;
}

function BackgroundMusicPlayerInner({ musicConfig }) {
  const { isAudible: isAudibleContent } = useMediaContext();

  const audioRef = React.useRef(null);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [userPaused, setUserPaused] = React.useState(false);
  const [pausedByContent, setPausedByContent] = React.useState(false);

  // ── 1. Initialize Audio element ───────────────────────────────────────────
  React.useEffect(() => {
    const audio = new Audio(musicConfig.audioUrl);
    audio.loop = musicConfig.loop !== false;
    audio.volume = Math.min(Math.max((musicConfig.volume ?? 30) / 100, 0), 1);
    audio.preload = 'auto';
    audioRef.current = audio;

    // Use timeupdate to confirm audio is actually producing output
    // (more reliable than 'playing' which can fire before data is ready)
    let confirmed = false;
    const onTimeUpdate = () => {
      if (!confirmed && audio.currentTime > 0) {
        confirmed = true;
        setIsPlaying(true);
        setHasStarted(true);
      }
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onPlaying = () => setIsPlaying(true);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [musicConfig.audioUrl, musicConfig.loop, musicConfig.volume]);

  // ── 2. Auto-play + gesture fallback ──────────────────────────────────────
  // Try unmuted autoplay (works if browser MEI allows it).
  // If blocked, the first user interaction anywhere on the page starts music.
  // Uses capture phase so stopPropagation in child components can't block it.
  React.useEffect(() => {
    if (hasStarted || userPaused) return;
    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;

    const attemptPlay = () => {
      if (cancelled) return;
      audio.play().catch(() => {
        // Browser blocked — gesture listeners remain active
      });
    };

    // Try immediately + retry when fully buffered
    attemptPlay();
    if (audio.readyState < 4) {
      audio.addEventListener('canplaythrough', attemptPlay, { once: true });
    }

    // Fallback: any user gesture starts music.
    // Use CAPTURE phase so stopPropagation() in child components can't block us.
    // touchstart fires before scroll on mobile → scroll triggers music on phones/tablets.
    // wheel doesn't grant user activation in Chrome but we try anyway (harmless).
    const gestureEvents = ['click', 'touchstart', 'keydown', 'pointerdown', 'wheel'];
    const onGesture = () => {
      if (cancelled) return;
      audio.play().catch(() => {});
    };
    gestureEvents.forEach(e =>
      window.addEventListener(e, onGesture, { once: true, capture: true })
    );

    return () => {
      cancelled = true;
      audio.removeEventListener('canplaythrough', attemptPlay);
      gestureEvents.forEach(e =>
        window.removeEventListener(e, onGesture, { capture: true })
      );
    };
  }, [hasStarted, userPaused]);

  // ── 3. Auto-pause when audible content plays ─────────────────────────────
  // isAudible is true when: audio content plays OR video is unmuted
  // isAudible is false when: muted video auto-plays (no sonic conflict)
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasStarted) return;

    if (isAudibleContent) {
      if (isPlaying) {
        audio.pause();
        setPausedByContent(true);
      }
    } else if (pausedByContent && !userPaused) {
      audio.play().catch(() => {});
      setPausedByContent(false);
    }
  }, [isAudibleContent, hasStarted, isPlaying, pausedByContent, userPaused]);

  // ── 4. Manual toggle ─────────────────────────────────────────────────────
  const handleClick = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setUserPaused(true);
      setPausedByContent(false);
    } else {
      audio.play().catch(() => {});
      setUserPaused(false);
      setPausedByContent(false);
    }
  }, [isPlaying]);

  // ── 5. Visual states ─────────────────────────────────────────────────────
  let Icon, stateClass, title, iconExtra = '';
  // Show label when waiting for user gesture (autoplay blocked)
  const showLabel = !hasStarted && !userPaused && !isPlaying;

  if (isPlaying && hasStarted) {
    // Confirmed playing — audio output verified
    Icon = Volume2;
    stateClass = 'animate-pulse-glow bg-primary/20 hover:bg-primary/30 text-primary';
    title = 'Pausar música de fondo';
  } else if (isPlaying && !hasStarted) {
    // Starting up — play() resolved but audio not yet confirmed
    Icon = Loader2;
    stateClass = 'bg-primary/10 hover:bg-primary/20 text-primary';
    title = 'Iniciando música...';
    iconExtra = 'animate-spin';
  } else if (pausedByContent && !userPaused && isAudibleContent) {
    Icon = Music2;
    stateClass = 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-500';
    title = 'Música pausada temporalmente';
  } else if (!hasStarted && !userPaused) {
    Icon = Volume2;
    stateClass = 'animate-pulse-glow bg-muted/80 hover:bg-muted text-muted-foreground';
    title = 'Activar música de fondo';
  } else {
    Icon = VolumeX;
    stateClass = 'bg-muted/80 hover:bg-muted text-muted-foreground';
    title = 'Activar música de fondo';
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      aria-label={title}
      className={cn(
        'fixed bottom-6 right-6 z-50 rounded-full',
        'shadow-lg backdrop-blur-sm border border-white/10',
        'transition-all duration-300 cursor-pointer',
        showLabel ? 'pl-4 pr-3 py-2.5 flex items-center gap-2' : 'p-3',
        stateClass,
      )}
    >
      {showLabel && (
        <span className="text-xs font-medium whitespace-nowrap animate-fade-in">
          Activar música
        </span>
      )}
      <Icon className={cn('h-5 w-5', iconExtra)} />
    </button>
  );
}
