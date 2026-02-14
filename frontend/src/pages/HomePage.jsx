import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HomePage() {
  return (
    <div className="min-h-screen bg-animated-gradient relative overflow-hidden">
      {/* Glowing Orbs Background */}
      <div className="glowing-orb glowing-orb-purple w-96 h-96 top-20 left-10 opacity-40" />
      <div className="glowing-orb glowing-orb-blue w-80 h-80 top-60 right-20 opacity-30" />
      <div className="glowing-orb glowing-orb-purple w-64 h-64 bottom-40 left-1/3 opacity-25" />

      {/* HERO SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-purple-500/30">
              <ZapIcon className="size-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Real-time Collaboration</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="gradient-text-purple-blue">
                Code Together,
              </span>
              <br />
              <span className="text-white">Learn Together</span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
              The ultimate platform for collaborative coding interviews and pair programming.
              Connect face-to-face, code in real-time, and ace your technical interviews.
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-full glass-card border-purple-500/20">
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-green-400" />
                  <span className="text-sm text-gray-300">Live Video Chat</span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-full glass-card border-blue-500/20">
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-green-400" />
                  <span className="text-sm text-gray-300">Code Editor</span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-full glass-card border-purple-500/20">
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-green-400" />
                  <span className="text-sm text-gray-300">Multi-Language</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <SignInButton mode="modal">
                <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-bold text-lg glow-purple-blue hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  Start Coding Now
                  <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>

              <button className="px-8 py-4 glass-card rounded-xl text-white font-semibold text-lg hover-glow-blue hover:scale-105 transition-all duration-300 flex items-center gap-2 border-purple-500/30">
                <VideoIcon className="size-5" />
                Watch Demo
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="glass-card p-4 rounded-xl border-purple-500/20 hover-glow-purple transition-all duration-300">
                <div className="text-3xl font-black gradient-text-purple-blue">10K+</div>
                <div className="text-sm text-gray-400 mt-1">Active Users</div>
              </div>
              <div className="glass-card p-4 rounded-xl border-blue-500/20 hover-glow-blue transition-all duration-300">
                <div className="text-3xl font-black gradient-text-purple-blue">50K+</div>
                <div className="text-sm text-gray-400 mt-1">Sessions</div>
              </div>
              <div className="glass-card p-4 rounded-xl border-purple-500/20 hover-glow-purple transition-all duration-300">
                <div className="text-3xl font-black gradient-text-purple-blue">99.9%</div>
                <div className="text-sm text-gray-400 mt-1">Uptime</div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="glass-card p-4 rounded-3xl border-purple-500/30 glow-purple-blue">
              <img
                src="/hero.png"
                alt="InstructCode Platform"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to <span className="gradient-text-purple-blue font-mono">Succeed</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-card p-8 rounded-2xl border-purple-500/20 hover-glow-purple transition-all duration-300 hover:scale-105">
            <div className="size-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 glow-purple">
              <VideoIcon className="size-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">HD Video Call</h3>
            <p className="text-gray-400">
              Crystal clear video and audio for seamless communication during interviews
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-8 rounded-2xl border-blue-500/20 hover-glow-blue transition-all duration-300 hover:scale-105">
            <div className="size-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 glow-blue">
              <Code2Icon className="size-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Live Code Editor</h3>
            <p className="text-gray-400">
              Collaborate in real-time with syntax highlighting and multiple language support
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-8 rounded-2xl border-purple-500/20 hover-glow-purple transition-all duration-300 hover:scale-105">
            <div className="size-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 glow-purple">
              <UsersIcon className="size-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Easy Collaboration</h3>
            <p className="text-gray-400">
              Share your screen, discuss solutions, and learn from each other in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Footer Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </div>
  );
}
export default HomePage;
