import React, { useState, useEffect } from 'react';

export const MobileOverlay: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const checkState = () => {
            // Basic mobile check: touch capable and small screen
            const hasTouch = navigator.maxTouchPoints > 0 || (window.matchMedia && window.matchMedia("(any-pointer: coarse)").matches);
            const isSmall = window.innerWidth <= 1024;

            setIsMobile(hasTouch && isSmall);

            // Determine portrait based on screen orientation or dimensions
            const orientation = (window.screen.orientation || {}).type;
            if (orientation) {
                setIsPortrait(orientation.startsWith('portrait'));
            } else {
                setIsPortrait(window.innerHeight > window.innerWidth);
            }

            setIsFullscreen(!!document.fullscreenElement);
        };

        checkState();
        window.addEventListener('resize', checkState);
        window.addEventListener('orientationchange', checkState);
        document.addEventListener('fullscreenchange', checkState);

        return () => {
            window.removeEventListener('resize', checkState);
            window.removeEventListener('orientationchange', checkState);
            document.removeEventListener('fullscreenchange', checkState);
        };
    }, []);

    const handleEnterPlatform = async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if ((document.documentElement as any).webkitRequestFullscreen) {
                await (document.documentElement as any).webkitRequestFullscreen();
            }
        } catch (err) {
            console.warn("Fullscreen API not supported or denied.");
        }
        setDismissed(true);
    };

    if (!isMobile) return null;

    // If dismissed, hide entirely so they aren't trapped
    if (dismissed) return null;

    // We are on mobile. If it's landscape and fullscreen, hide naturally.
    if (!isPortrait && isFullscreen) return null;

    // Otherwise, show the prompt.
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6 overscroll-none touch-none">
            <div className="max-w-md w-full text-center flex flex-col items-center space-y-8">
                {isPortrait ? (
                    <>
                        <svg className="w-20 h-20 text-zinc-400 rotate-90 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div className="space-y-3 lg:space-y-4">
                            <h2 className="text-2xl tracking-wide uppercase text-zinc-200">Rotate Device</h2>
                            <p className="text-zinc-400 font-light text-sm leading-relaxed max-w-[280px] mx-auto">
                                Please rotate your device to landscape mode for the intended presentation experience.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <svg className="w-20 h-20 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <div className="space-y-3 lg:space-y-4">
                            <h2 className="text-2xl tracking-wide uppercase text-zinc-200">Full Screen</h2>
                            <p className="text-zinc-400 font-light text-sm leading-relaxed max-w-[280px] mx-auto">
                                For the best experience, view this presentation in full screen.
                            </p>
                        </div>
                    </>
                )}

                <button
                    onClick={handleEnterPlatform}
                    className="mt-8 px-8 py-4 border border-zinc-700 text-sm tracking-widest uppercase hover:bg-zinc-900 transition-colors w-full"
                >
                    {isPortrait ? "Dismiss & View Anyway" : "Enter Full Screen"}
                </button>
            </div>
        </div>
    );
};
