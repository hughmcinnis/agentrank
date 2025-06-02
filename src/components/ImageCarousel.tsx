'use client';

import { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import { useModal } from '@/contexts/ModalContext';

interface CarouselItem {
    type: 'image' | 'video';
    url: string;  // For images or fallback video URL
    alt: string;
    videoUid?: string;  // Make videoUid optional since some videos use direct URLs
}

interface ImageCarouselProps {
    items: CarouselItem[];
}

export default function ImageCarousel({ items }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { setIsModalOpen } = useModal();
    const [showLocalModal, setShowLocalModal] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [videoError, setVideoError] = useState<string | null>(null);

    // Remove unused refs
    // const videoRef = useRef<HTMLVideoElement>(null);
    // const modalVideoRef = useRef<HTMLVideoElement>(null);

    const getVideoUrl = (item: CarouselItem, isModal: boolean = false) => {
        if (item.videoUid) {
            const baseUrl = `https://customer-7w6ectfrlaic6wci.cloudflarestream.com/${item.videoUid}/iframe?autoplay=true&muted=true&preload=auto&defaultQuality=1080p&quality=1080p&preloadVideo=true&fit=cover&loop=true&controls=${isModal}`;

            // Special handling for CodeRabbit video
            if (item.videoUid === "50544c4c229e1e84586d10ae2db14c7d") {
                return `${baseUrl}&aspectratio=1.78:1`;
            }

            return baseUrl;
        }
        return item.url;
    };

    const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement | HTMLIFrameElement, Event>) => {
        console.error('Video error:', e);
        const target = e.target as HTMLVideoElement | HTMLIFrameElement;
        const currentItem = items[currentIndex];

        console.error('Video error details:', {
            src: target.src,
            readyState: target instanceof HTMLVideoElement ? target.readyState : 'iframe',
            error: target instanceof HTMLVideoElement ? target.error : 'iframe error',
            videoUid: currentItem.videoUid,
            type: currentItem.type,
            url: currentItem.url
        });

        setVideoError('Error loading video. Please try again later.');
        setIsVideoLoading(false);
        setIsVideoPlaying(false);
    };

    const VideoPlayer = ({ item }: { item: CarouselItem }) => {
        if (item.videoUid) {
            return (
                <div className="relative w-full">
                    <iframe
                        src={getVideoUrl(item, false)}
                        className="w-full aspect-video max-h-[350px] rounded-xl"
                        style={{ border: 'none' }}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                        onLoad={() => {
                            console.log('Video iframe loaded successfully:', {
                                videoUid: item.videoUid,
                                url: getVideoUrl(item)
                            });
                            setIsVideoLoading(false);
                            setIsVideoPlaying(true);
                            setVideoError(null);
                        }}
                        onError={(e) => {
                            console.error('Video iframe error:', {
                                videoUid: item.videoUid,
                                error: e,
                                url: getVideoUrl(item)
                            });
                            handleVideoError(e);
                        }}
                    />
                </div>
            );
        }

        return (
            <video
                src={getVideoUrl(item)}
                className="w-full aspect-video max-h-[350px] rounded-xl object-contain"
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={() => {
                    console.log('Video loaded successfully:', {
                        url: getVideoUrl(item)
                    });
                    setIsVideoLoading(false);
                    setIsVideoPlaying(true);
                    setVideoError(null);
                }}
                onError={handleVideoError}
                controls={false}
            />
        );
    };

    const ModalVideoPlayer = ({ item }: { item: CarouselItem }) => {
        if (item.videoUid) {
            return (
                <div className="relative w-full h-full">
                    <iframe
                        src={getVideoUrl(item, true)}
                        className="w-full h-full rounded-lg"
                        style={{ border: 'none' }}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                        onLoad={() => {
                            console.log('Modal iframe loaded:', {
                                videoUid: item.videoUid,
                                url: getVideoUrl(item, true)
                            });
                            setIsVideoLoading(false);
                            setIsVideoPlaying(true);
                            setVideoError(null);
                        }}
                        onError={(e) => {
                            console.error('Modal iframe error:', {
                                videoUid: item.videoUid,
                                error: e,
                                url: getVideoUrl(item, true)
                            });
                            handleVideoError(e);
                        }}
                    />
                </div>
            );
        }

        return (
            <video
                src={getVideoUrl(item)}
                className="w-full h-full rounded-lg"
                autoPlay
                controls
                playsInline
                onLoadedData={() => {
                    console.log('Modal video loaded:', {
                        url: getVideoUrl(item)
                    });
                    setIsVideoLoading(false);
                    setIsVideoPlaying(true);
                    setVideoError(null);
                }}
                onError={handleVideoError}
            />
        );
    };

    // Reset video states when changing slides
    useEffect(() => {
        if (items[currentIndex]?.type === 'video') {
            setIsVideoLoading(true);
            setIsVideoPlaying(false);
            setVideoError(null);
        }
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        if (items[(currentIndex + 1) % items.length].type === 'video') {
            setIsVideoLoading(true);
            setIsVideoPlaying(false);
        }
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
        if (items[(currentIndex - 1 + items.length) % items.length].type === 'video') {
            setIsVideoLoading(true);
            setIsVideoPlaying(false);
        }
    };

    const handleOpenModal = () => {
        setShowLocalModal(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setShowLocalModal(false);
        setIsModalOpen(false);
    };

    // Add effect to handle initial video state
    useEffect(() => {
        if (items[currentIndex]?.type === 'video') {
            setIsVideoLoading(true);
            setIsVideoPlaying(false);
            setVideoError(null);
        }
    }, [currentIndex]);

    if (!items.length) return null;

    const currentItem = items[currentIndex];

    return (
        <>
            <div className="relative w-full h-auto min-h-[200px] sm:h-[400px] rounded-[2rem] overflow-hidden border border-white/10 bg-gray-900/50 backdrop-blur-xl">
                {/* Main Content */}
                <div className="w-full h-full flex items-center justify-center p-3 sm:px-8 sm:py-6">
                    {currentItem.type === 'video' ? (
                        <div className="relative flex items-center justify-center w-full">
                            <div className="w-full rounded-[1.75rem] overflow-hidden bg-gray-900/50 backdrop-blur-xl">
                                {isVideoLoading && !isVideoPlaying && !videoError && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-white"></div>
                                    </div>
                                )}
                                {videoError && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                                        <p className="text-xs sm:text-sm text-red-400">{videoError}</p>
                                    </div>
                                )}
                                <VideoPlayer item={currentItem} />
                            </div>
                            <div
                                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 active:opacity-100 transition-opacity"
                                role="button"
                                onClick={handleOpenModal}
                                aria-label="Expand video"
                            >
                                <div className="absolute inset-0 bg-black/30 rounded-[1.75rem]" />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-8 h-8 sm:w-12 sm:h-12 text-white z-10"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                </svg>
                            </div>
                        </div>
                    ) : (
                        <img
                            src={currentItem.url}
                            alt={currentItem.alt}
                            className="max-w-full max-h-full object-contain rounded-[1.75rem]"
                        />
                    )}
                </div>

                {/* Navigation Buttons */}
                {items.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 active:bg-black/90 text-white rounded-full p-1.5 sm:p-2 transition-all touch-manipulation"
                            aria-label="Previous item"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 active:bg-black/90 text-white rounded-full p-1.5 sm:p-2 transition-all touch-manipulation"
                            aria-label="Next item"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Dots Indicator */}
                {items.length > 1 && (
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                                aria-label={`Go to item ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for expanded video */}
            <Modal isOpen={showLocalModal} onClose={handleCloseModal}>
                {currentItem.type === 'video' && (
                    <div className="relative w-full aspect-video">
                        <ModalVideoPlayer item={currentItem} />
                    </div>
                )}
            </Modal>
        </>
    );
} 