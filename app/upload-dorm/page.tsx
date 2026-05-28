"use client"

import { useState } from "react"
import Link from "next/link"

const CHECKLIST_TEXT = `Want to send in your dorm room? Please email me the photos and videos with the following:

📸 Media
- Photo of plaque
- Photos and videos of room
- Photos and videos of bathroom
- Photos and videos of kitchen

🏫 Room Info
- School Name
- Dorm / Building / Residence Hall
- Floor
- Room Number/Letter (e.g. 404B or 405)
- Shared area room/suite number, if applicable (e.g. 404)
- Occupants Count (e.g. 2 — people in your specific room)
- Student Email (to verify as a student — no AI)`

export default function UploadDormPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CHECKLIST_TEXT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-5 py-12">

        {/* Heading */}
        <h1 className="text-[28px] font-bold text-black tracking-tight leading-snug mb-2">
          Send in your dorm room
        </h1>
        <p className="text-[16px] text-gray-500 mb-8">
          Email me the photos and videos. Please include the following:
        </p>

        {/* Checklist card */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 mb-6">
          <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
            What to include
          </p>

          <div className="mb-5">
            <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
              📸 Media
            </p>
            <ul className="space-y-2">
              {[
                "Photo of plaque",
                "Photos and videos of room",
                "Photos and videos of bathroom",
                "Photos and videos of kitchen",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[15px] text-gray-700">
                  <span className="mt-[3px] w-4 h-4 flex-shrink-0 rounded-full border-2 border-gray-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
              🏫 Room info
            </p>
            <ul className="space-y-3">
              {[
                { label: "School Name", required: true },
                { label: "Dorm / Building / Residence Hall", required: true },
                { label: "Floor", required: true },
                { label: "Room Number/Letter", required: true, hint: "e.g. 404B or 405" },
                { label: "Shared area room/suite number", required: false, hint: "e.g. 404 (if applicable)" },
                { label: "Occupants Count", required: true, hint: "e.g. 2 — people in your specific room" },
                { label: "Student Email", required: true, hint: "To verify as a student — no AI" },
              ].map(({ label, required, hint }) => (
                <li key={label} className="flex items-start gap-2 text-[15px] text-gray-700">
                  <span className="mt-[3px] w-4 h-4 flex-shrink-0 rounded-full border-2 border-gray-300" />
                  <span>
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                    {hint && (
                      <span className="block text-[13px] text-gray-400 mt-0.5">{hint}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="w-full mb-4 flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 text-[15px] font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy and Paste
            </>
          )}
        </button>

        {/* Contact buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <a
            href="mailto:4wallsdorms@gmail.com"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-semibold text-white transition-colors"
            style={{ background: "#5e18a4" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Email Us
          </a>
          <a
            href="https://www.instagram.com/4wallsdorms/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
            Instagram
          </a>
        </div>

        {/* Help spread the word */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#f5f0ff", border: "1.5px solid #d8c5f5" }}>
          <p className="text-[22px] mb-1" aria-hidden>🏠</p>
          <p className="text-[17px] font-bold text-[#3b0e6e] leading-snug mb-2">
            Help a student out.
          </p>
          <p className="text-[15px] text-[#5e3a8a] leading-relaxed">
            This is a side project for me — I just want to help. Send this page to your friends and get them to post their rooms.
          </p>
        </div>

        {/* Looking for help */}
        <div className="rounded-2xl p-6" style={{ background: "#fff8e6", border: "1.5px solid #f5d87a" }}>
          <p className="text-[22px] mb-1" aria-hidden>👋</p>
          <p className="text-[17px] font-bold text-[#7a4f00] leading-snug mb-2">
            Looking for help.
          </p>
          <p className="text-[15px] text-[#9a6400] leading-relaxed">
            I&rsquo;m looking for <strong>coders</strong> and <strong>social media help</strong> to grow this. If that&rsquo;s you, reach out.
          </p>
        </div>

      </div>
    </div>
  )
}
