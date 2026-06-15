import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      // tiny tail so the fade feels intentional
      window.setTimeout(() => setShow(false), 200);
    };

    const waitForVideo = () => {
      const video = document.querySelector<HTMLVideoElement>("section video");
      if (!video) {
        // No hero video on this page — just wait for window.load
        if (document.readyState === "complete") finish();
        else window.addEventListener("load", finish, { once: true });
        return;
      }
      // Ready states: 3 = HAVE_FUTURE_DATA, 4 = HAVE_ENOUGH_DATA
      if (video.readyState >= 3) {
        finish();
        return;
      }
      const onReady = () => finish();
      video.addEventListener("canplay", onReady, { once: true });
      video.addEventListener("playing", onReady, { once: true });
      video.addEventListener("loadeddata", onReady, { once: true });
    };

    if (document.readyState === "complete") {
      waitForVideo();
    } else {
      window.addEventListener("load", waitForVideo, { once: true });
    }

    // Hard fallback so it never sticks
    const fallback = window.setTimeout(finish, 3500);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!show) document.body.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070A] text-white"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_50%,rgba(183,226,109,0.12),transparent_70%)]" />
          <div className="relative flex flex-col items-center gap-6">
            <motion.img
              src="/logo_lohix.png"
              alt=""
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-10 w-auto"
            />
            <div className="relative h-[2px] w-44 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-lohix-lime to-transparent"
              />
            </div>
            <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
              Powering up
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
