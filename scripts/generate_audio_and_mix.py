#!/usr/bin/env python3
"""
CollabTrust Demo Video Audio & Voiceover Generator
Uses edge-tts to synthesize neural narration and mixes with background music using ffmpeg.
"""

import sys
import os
import asyncio
import subprocess

# Ensure user site-packages are accessible
USER_SITE = "/Users/fiftyfivetech/Library/Python/3.9/lib/python/site-packages"
if os.path.exists(USER_SITE) and USER_SITE not in sys.path:
    sys.path.insert(0, USER_SITE)

import edge_tts

DEMO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../demo-video"))
VOICE = "en-US-ChristopherNeural"

# Scene timing and narration copy
SCENES = [
    {
        "id": "seg_01_intro",
        "delay_ms": 800,       # Starts at 0.8s (Slide 1: Title)
        "text": "Welcome to CollabTrust, the explainable brand-creator collaboration engine featuring observational trust signals and automated milestone verification."
    },
    {
        "id": "seg_02_problem",
        "delay_ms": 10800,     # Starts at 10.8s (Slide 2: Problem & Solution)
        "text": "Creator marketing today suffers from fragmented discovery, opaque reputation scores, and high dispute rates. CollabTrust bridges this gap with AI brief extraction, transparent multi-factor matching, and contract-grade milestone state machines."
    },
    {
        "id": "seg_03_brand_dash",
        "delay_ms": 22000,     # Starts at 22.0s (Live App: Brand Dashboard & Tour)
        "text": "Entering the Brand Workspace, EcoGlow Organics monitors campaign metrics, active partnerships, and pending pitches. The evaluator quick tour provides instant orientation across every core feature."
    },
    {
        "id": "seg_04_ai_brief",
        "delay_ms": 34000,     # Starts at 34.0s (Live App: AI Brief Structuring)
        "text": "Creating a campaign is instantaneous. Brands input raw notes or pick a preset, and our AI Brief Structuring Agent parses unstructured text into verified deliverables, timelines, audience goals, and brand requirements."
    },
    {
        "id": "seg_05_matches",
        "delay_ms": 50000,     # Starts at 50.0s (Live App: Explainable Matching)
        "text": "Upon publishing, our explainable matching engine evaluates creators with clear sub-factor scores for niche and audience fit, backed by objective, observational trust indicators without subjective algorithmic bias."
    },
    {
        "id": "seg_06_guardrails",
        "delay_ms": 64000,     # Starts at 64.0s (Slide 3: Architecture & Ethical Guardrails)
        "text": "CollabTrust is built on strict ethical AI guardrails: autonomous agents assist with structure and analysis, while final collaboration decisions and trust evaluations remain strictly human-driven."
    },
    {
        "id": "seg_07_creator_view",
        "delay_ms": 75000,     # Starts at 75.0s (Live App: Creator View & Marketplace)
        "text": "With one click, we switch to the Creator Workspace. Alex Rivera views matched opportunities, custom match explanations, and browses open campaigns with real-time keyword filtering."
    },
    {
        "id": "seg_08_state_machine",
        "delay_ms": 89000,     # Starts at 89.0s (Slide 4: Human State Machine)
        "text": "Every partnership is governed by an explicit state machine: Invited, Accepted, In Progress, and Completed. Milestone gates ensure deliverable alignment and clear conflict boundaries."
    },
    {
        "id": "seg_09_collab_hub",
        "delay_ms": 100000,    # Starts at 100.0s (Live App: Collab Hub & Slide 5 Tech Architecture)
        "text": "In the Collaboration Hub, partners check off deliverables and message in real time. Backed by React, Express, Gemini AI, and seventy-six passing integration tests, this is CollabTrust."
    }
]

async def generate_speech():
    print(f"=== 1. Synthesizing {len(SCENES)} Voiceover Segments with edge-tts ({VOICE}) ===")
    os.makedirs(DEMO_DIR, exist_ok=True)
    
    for idx, scene in enumerate(SCENES, 1):
        output_file = os.path.join(DEMO_DIR, f"{scene['id']}.mp3")
        print(f"[{idx}/{len(SCENES)}] Synthesizing: {scene['id']} ...")
        communicate = edge_tts.Communicate(scene["text"], VOICE, rate="+3%")
        await communicate.save(output_file)
        
        # Check duration
        probe = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", output_file],
            capture_output=True, text=True
        )
        duration = float(probe.stdout.strip()) if probe.stdout.strip() else 0.0
        print(f"       -> Saved ({duration:.2f}s) -> Start delay: {scene['delay_ms']/1000:.1f}s")
        scene["file"] = output_file
        scene["duration"] = duration

def mix_and_produce_final_video():
    print("\n=== 2. Assembling Audio and Mixing with Background Music ===")
    raw_video = os.path.join(DEMO_DIR, "collabtrust_demo_walkthrough.mp4")
    bg_music = os.path.join(DEMO_DIR, "bg_music.ogg")
    final_video = os.path.join(DEMO_DIR, "collabtrust_final_demo.mp4")

    if not os.path.exists(raw_video):
        raise FileNotFoundError(f"Video file not found: {raw_video}")
    if not os.path.exists(bg_music):
        raise FileNotFoundError(f"Background music not found: {bg_music}")

    # Build ffmpeg command:
    # 0: raw_video
    # 1: bg_music (trimmed to start at 3s for immediate upbeat melody)
    # 2..10: voiceover segments
    inputs = [
        "-y",
        "-i", raw_video,
        "-ss", "3", "-i", bg_music,
    ]
    for scene in SCENES:
        inputs.extend(["-i", scene["file"]])

    filter_parts = []
    amix_vo_inputs = []

    # Voiceover segment delay filters
    for idx, scene in enumerate(SCENES, 2):  # inputs 2..10
        delay = scene["delay_ms"]
        filter_parts.append(f"[{idx}:a]adelay={delay}|{delay}[v{idx}]")
        amix_vo_inputs.append(f"[v{idx}]")

    # Combine all voiceover segments
    num_scenes = len(SCENES)
    filter_parts.append(f"{''.join(amix_vo_inputs)}amix=inputs={num_scenes}:dropout_transition=0:normalize=0[vo_mix]")
    filter_parts.append("[vo_mix]volume=1.22[vo_clean]")

    # Background music: clearly audible at 22% volume, instant 0.5s fade-in, smooth 3.2s fade-out at end
    filter_parts.append("[1:a]volume=0.22,afade=t=in:ss=0:d=0.5,afade=t=out:st=106:d=3.2[bg_clean]")

    # Mix bg_music (continuous base) with voiceover (cleanly overlaid)
    # Using bg_clean as first input guarantees continuous background music without dropouts during dialogue pauses
    filter_parts.append("[bg_clean][vo_clean]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[final_audio]")

    filter_complex = "; ".join(filter_parts)

    cmd = [
        "ffmpeg",
        *inputs,
        "-filter_complex", filter_complex,
        "-map", "0:v",
        "-map", "[final_audio]",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        final_video
    ]

    print("\nRunning FFmpeg mastering pipeline with continuous background music...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("FFmpeg STDERR:", result.stderr)
        raise RuntimeError("FFmpeg mixing failed!")

    print(f"\nSUCCESS! Mastered final video with clear background music created at:\n{final_video}")

    # Inspect final video
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration,size,bit_rate", "-of", "default=noprint_wrappers=1", final_video],
        capture_output=True, text=True
    )
    print("\nFinal Video Specs:")
    print(probe.stdout)

async def main():
    await generate_speech()
    mix_and_produce_final_video()

if __name__ == "__main__":
    asyncio.run(main())
