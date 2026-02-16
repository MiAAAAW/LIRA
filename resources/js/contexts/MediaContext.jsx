import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// MEDIA CONTEXT - Coordina que solo 1 media (video O audio) se reproduzca a la vez
// ═══════════════════════════════════════════════════════════════════════════════

const MediaContext = React.createContext({
  activeMediaId: null,
  activeMediaType: null, // 'video' | 'audio'
  isAudible: false, // true when active media has sound (audio always, video when unmuted)
  setActiveMedia: () => {},
  modalOpen: false,
  setModalOpen: () => {},
});

export const MediaProvider = ({ children }) => {
  const [activeMediaId, setActiveMediaId] = React.useState(null);
  const [activeMediaType, setActiveMediaType] = React.useState(null);
  const [isAudible, setIsAudible] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  const setActiveMedia = React.useCallback((id, type, audible = false) => {
    setActiveMediaId(id);
    setActiveMediaType(type);
    setIsAudible(id !== null && audible);
  }, []);

  const value = React.useMemo(() => ({
    activeMediaId,
    activeMediaType,
    isAudible,
    setActiveMedia,
    modalOpen,
    setModalOpen,
  }), [activeMediaId, activeMediaType, isAudible, setActiveMedia, modalOpen]);

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMediaContext = () => React.useContext(MediaContext);

// Hook para videos - pausa cuando ANY media está activo
export const useVideoContext = () => {
  const ctx = useMediaContext();
  return {
    // Return actual activeMediaId so videos know when ANY media is playing (including audio)
    activeVideoId: ctx.activeMediaId,
    // But track if THIS is a video
    isVideoActive: ctx.activeMediaType === 'video',
    setActiveVideo: (id, audible = false) => ctx.setActiveMedia(id, 'video', audible),
    modalOpen: ctx.modalOpen,
    setModalOpen: ctx.setModalOpen,
    // Expose raw context for advanced checks
    activeMediaType: ctx.activeMediaType,
  };
};
