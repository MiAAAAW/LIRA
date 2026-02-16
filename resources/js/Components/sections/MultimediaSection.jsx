/**
 * @fileoverview Multimedia Section
 * @description Displays Videos and Audios from the database
 */

import { Video, Music, Play, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { MotionWrapper, StaggerContainer, StaggerItem } from '@/Components/motion/MotionWrapper';

function VideoCard({ video }) {
  const embedUrl = video.tipo_fuente === 'youtube'
    ? `https://www.youtube.com/embed/${video.video_id}`
    : video.tipo_fuente === 'vimeo'
    ? `https://player.vimeo.com/video/${video.video_id}`
    : video.url_video;

  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
      <div className="relative aspect-video bg-muted">
        {(video.thumbnail_url || video.thumbnail) ? (
          <img
            src={video.thumbnail_url || video.thumbnail}
            alt={video.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Video className="h-12 w-12 text-primary/50" />
          </div>
        )}
        <a
          href={video.playable_url || video.url_video}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </a>
        {video.duracion && (
          <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
            {video.duracion}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h4 className="font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {video.titulo}
        </h4>
        {video.descripcion && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {video.descripcion}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {video.anio && <span>{video.anio}</span>}
          {video.categoria && (
            <>
              <span>-</span>
              <Badge variant="outline" className="text-xs capitalize">
                {video.categoria}
              </Badge>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AudioCard({ audio }) {
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-lg bg-primary/10 shrink-0">
            <Music className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold line-clamp-1 mb-1">
              {audio.titulo}
            </h4>
            {audio.interprete && (
              <p className="text-sm text-primary font-medium">
                {audio.interprete}
              </p>
            )}
            {audio.compositor && (
              <p className="text-xs text-muted-foreground">
                Compositor: {audio.compositor}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {audio.duracion && (
                <Badge variant="outline" className="text-xs">
                  {audio.duracion}
                </Badge>
              )}
              {audio.tipo && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {audio.tipo}
                </Badge>
              )}
            </div>
            {(audio.playable_url || audio.url_audio) && (
              <Button variant="link" size="sm" className="mt-2 p-0 h-auto" asChild>
                <a href={audio.playable_url || audio.url_audio} target="_blank" rel="noopener noreferrer">
                  Escuchar <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MultimediaSection({ videos = [], audios = [], className }) {
  const hasContent = videos.length > 0 || audios.length > 0;

  if (!hasContent) return null;

  return (
    <section id="galeria" className={cn('py-16 md:py-24 bg-muted/30', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <MotionWrapper direction="up" className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Multimedia
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Galería Audiovisual
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Videos y audios que capturan la esencia de la Pandilla Puneña
          </p>
        </MotionWrapper>

        {/* Videos */}
        {videos.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Videos
            </h3>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <StaggerItem key={video.id}>
                  <VideoCard video={video} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* Audios */}
        {audios.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              Audios y Música
            </h3>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {audios.map((audio) => (
                <StaggerItem key={audio.id}>
                  <AudioCard audio={audio} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>
    </section>
  );
}

export default MultimediaSection;
