'use client';

import { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import { useModal } from '@/contexts/ModalContext';

interface CarouselItem {
    type: 'image' | 'video';
    url: string;
    alt: string;
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const modalVideoRef = useRef<HTMLVideoElement>(null);

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

    const handleVideoLoad = () => {
        if (videoRef.current) {
            // Check if video is already playing
            if (!videoRef.current.paused) {
                setIsVideoPlaying(true);
                setIsVideoLoading(false);
                return;
            }

            videoRef.current.play()
                .then(() => {
                    setIsVideoPlaying(true);
                    setIsVideoLoading(false);
                })
                .catch(error => {
                    console.error('Error playing video:', error);
                    setVideoError('Error playing video');
                    setIsVideoLoading(false);
                });
        }
    };

    const handleModalVideoLoad = () => {
        setIsVideoLoading(false);
        if (modalVideoRef.current) {
            modalVideoRef.current.play()
                .catch(error => {
                    console.error('Error playing modal video:', error);
                    setVideoError('Error playing video');
                });
        }
    };

    const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        console.error('Video error:', e);
        setVideoError('Error loading video');
        setIsVideoLoading(false);
        setIsVideoPlaying(false);
    };

    const handleVideoPlaying = () => {
        setIsVideoPlaying(true);
        setIsVideoLoading(false);
    };

    // Add effect to handle initial video state
    useEffect(() => {
        if (items[currentIndex]?.type === 'video' && videoRef.current) {
            // If video is already loaded and playing
            if (videoRef.current.readyState >= 3 && !videoRef.current.paused) {
                setIsVideoPlaying(true);
                setIsVideoLoading(false);
            }
        }
    }, [currentIndex, items]);

    if (!items.length) return null;

    const currentItem = items[currentIndex];

    return (
        <>
            <div className="relative w-full h-[400px] rounded-[2rem] overflow-hidden border border-white/10 bg-gray-900/50 backdrop-blur-xl">
                {/* Main Content */}
                <div className="w-full h-full flex items-center justify-center px-8 py-6">
                    {currentItem.type === 'video' ? (
                        <div className="relative flex items-center justify-center">
                            <div className="rounded-[1.75rem] overflow-hidden">
                                {isVideoLoading && !isVideoPlaying && !videoError && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                    </div>
                                )}
                                {videoError && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                                        <p className="text-red-400 text-sm">{videoError}</p>
                                    </div>
                                )}
                                <video
                                    ref={videoRef}
                                    src={currentItem.url}
                                    autoPlay
                                    muted
                                    loop
                                    preload="auto"
                                    className="max-w-full max-h-[350px] object-contain"
                                    playsInline
                                    onLoadedData={handleVideoLoad}
                                    onPlaying={handleVideoPlaying}
                                    onCanPlay={handleVideoPlaying}
                                    onError={handleVideoError}
                                >
                                    <track kind="captions" />
                                </video>
                            </div>
                            <div
                                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
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
                                    className="w-12 h-12 text-white z-10"
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
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                            aria-label="Previous item"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                            aria-label="Next item"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Dots Indicator */}
                {items.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                                aria-label={`Go to item ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for expanded video */}
            <Modal isOpen={showLocalModal} onClose={handleCloseModal}>
                {currentItem.type === 'video' && (
                    <div className="relative">
                        <video
                            ref={modalVideoRef}
                            src={currentItem.url}
                            controls
                            autoPlay
                            preload="auto"
                            className="w-full rounded-lg"
                            playsInline
                            onLoadedData={handleModalVideoLoad}
                            onError={handleVideoError}
                        >
                            <track kind="captions" />
                        </video>
                    </div>
                )}
            </Modal>
        </>
    );
} 