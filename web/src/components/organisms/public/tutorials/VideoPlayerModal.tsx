'use client';

import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/atoms';

export interface PlayingVideo {
  id: string;
  title: string;
  videoUrl?: string;
}

export interface VideoPlayerModalProps {
  video: PlayingVideo | null;
  onClose: () => void;
}

/** Modal pemutar video tutorial (embed YouTube dari CMS). */
export function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  return (
    <Dialog
      open={!!video}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">{video?.title ?? 'Putar video'}</DialogTitle>
        {video?.videoUrl ? (
          <div className="w-full aspect-video bg-slate-950">
            <iframe
              key={video.id}
              src={video.videoUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="p-8 text-center text-sm text-slate-500 font-medium">
            Video untuk tutorial ini segera hadir.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default VideoPlayerModal;
