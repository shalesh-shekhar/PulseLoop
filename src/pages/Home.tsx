import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function Home() {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 bg-[#111111] text-[#FAFAF8] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center max-w-md w-full relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-display font-medium mb-4">
          Feedback Platform
        </h1>
        <p className="text-[#FAFAF8]/60 text-lg mb-10 leading-relaxed font-light">
          Multi-tenant QR feedback system currently under development.
        </p>

        <Link
          to="/rating"
          className="group relative px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <span className="font-medium tracking-wide uppercase text-sm text-[#FAFAF8]/90 group-hover:text-gold transition-colors">
            View Feedback Demo
          </span>
        </Link>
      </motion.div>

      {/* Decorative ambient background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] blur-[120px] bg-gold rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] -right-[20%] w-[50%] h-[50%] blur-[100px] bg-orange rounded-full mix-blend-screen" />
      </div>
    </div>
  );
}
