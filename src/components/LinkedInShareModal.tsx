import { useState, useEffect, useRef, useCallback } from 'react';
import { Linkedin } from 'lucide-react';
import CrossIcon from '@atlaskit/icon/core/cross';
import CopyIcon from '@atlaskit/icon/core/copy';
import CheckMarkIcon from '@atlaskit/icon/core/check-mark';

const SLIDE_INSIGHTS = [
    "GenAI gives Product Marketers the power of infinite persuasion. But scaling persuasion without scaling verification is how you destroy trust. That's why we need a Hippocratic Oath for PMMs. 👇",
    "We built a Ferrari, but we put bicycle brakes on it. GenAI turns messaging into an always-on persuasion machine—but do we have a check engine light? We need a repeatable, pre-publish scaffolding to catch the bugs of infinite persuasion.",
    "The AI flywheel in Product Marketing isn't subtle. We went from 'launch in a quarter' to 'launch in a browser tab.' Battlecards in 2 hours instead of 2 weeks. It's genuine leverage—but that speed comes with a hidden cost.",
    "Accountability gap. Hallucinated authority. Erasure. These aren't edge cases of GenAI in marketing—they are default bugs. If you don't intentionally design your system to catch them, your brand will ship them.",
    "The GenAI output looked like evidence. It shipped like evidence. Until someone checked the links. If your brand publishes citations, you have to maintain them. AI-hallucinated footnotes don't reduce your liability—they amplify it.",
    "A chatbot is a salesperson who never sleeps... until it freelances your refund policy. Air Canada argued their chatbot was a 'separate legal entity'. The tribunal disagreed. If your AI can make a promise, define who signs off.",
    "You can nail every item in the style guide and still lose the customer. Coca-Cola's AI holiday ads had the colors, typography, and jingle, but people felt the gap between voice match and values match. Speed alone isn't a strategy.",
    "Policies are like gym memberships—buying one isn't the workout. Outright bans on GenAI don't scale because people route around them. Instead, we need to hold the tensions of responsible use. Just like doctors: 'First, do no harm.'",
    "When persuasion scales infinitely, we must protect trust. I propose a PMM Code of Conduct built on three pillars: Verification (I will not publish what I haven't checked), Stewardship (Simpler approach first), and Integrity (I won't let AI erase edge cases).",
    "Fast manual writing is dangerous. Raw ChatGPT output pasted into the market is a disaster. The goal of GenAI isn't unchecked speed—it's rapid, auditable generation via strict templates so we never publish what we haven't verified.",
    "If a marketing asset makes a claim that could be quoted in a contract, it needs a Claim Card. The secret? Use GenAI to draft the card. Prompt it to extract every claim, its source, scope, and harm tier—then let humans verify.",
    "A claim without evidence is just vibes with punctuation. Stop shipping copy that says 'we reduce incidents by 40%'. Ship copy that says 'Teams using [feature] can reduce incident response by 40% in [environment], based on [study].' Bounded promises build trust.",
    "I will enhance relevance, not exploit vulnerability. If you wouldn't say your targeting logic out loud to a customer, don't put it in a prompt. PMMs must run the Benefit Alignment Test: Who benefits from this personalization?",
    "Optimizing for conversion anxiety is manipulation; optimizing for customer clarity is personalization. Don't use AI to write urgency-driven nurture emails about price increases. Use it to answer the questions the prospect actually has.",
    "Tokens are not free—not to your company, and not to the planet. U.S. data center electricity is skyrocketing. We must practice stewardship: always try the simpler approach first. Don't use a frontier model for a task a simple template can handle.",
    "Using Deep Research mode to write a simple email is like using a helicopter to go to the grocery store. It's 10x more expensive and 4x slower. Match the model mode to the task: Fast templates for drafting, Deep Research only for synthesis.",
    "Will you let AI speak words your brand wouldn't stand behind? Run the 30-second Brand Signature Test: If this sentence is quoted in a lawsuit, a regulator letter, or a front-page story—do we stand by it without backpedaling?",
    "Don't claim your AI 'autonomously detects and eliminates threats so you never worry again.' That's legally indefensible. Say it 'assists detection so you respond with better context.' Your General Counsel will thank you.",
    "AI defaults to the majority persona. Regulated industries, non-technical teams, accessibility needs—they get optimized away. When you optimize purely for aggregate conversion, you smooth away the edges. That's not optimization; that's deletion.",
    "Don't just ask AI to generate '5 customer stories.' It will give you 5 identical stories about US-based tech teams. Ask it to generate stories that cover a non-profit, a regulated healthcare workflow, and an assistive technology user. Inclusive by design.",
    "Prompting 'Write in the style of [living writer]' is plagiarism with extra steps. If you borrow a living person's commercial craft, you must license or translate it into explicit constraints. The legal floor is not the ethical ceiling.",
    "Instead of named imitation ('Write like Simon Sinek'), use a Style Card. Deconstruct the style into explicit constraints: 'Tone: earnest. Structure: start with purpose. Devices: rhetorical questions.' Same creative output, zero ethical debt.",
    "Ethics without architecture is personal heroics, and personal heroics don't survive headcount changes. We need a post-GenAI decision architecture that inherently checks verification, consensus, and human review before anything ships.",
    "Responsible Product Marketing isn't about arbitrary rules; it's about holding five core tensions every time you ship. And you don't do it alone—you build a toolkit of Claim Cards, Benefit Tests, and Style Cards to automate the verification.",
    "Dropping a free template for your GenAI workflow: The Claim Card. Use this pre-publish evidence gate to force GenAI to extract and document the source, scope, and harm tier of every claim you make in market.",
    "Free template: The Benefit Alignment Test. Before shipping a personalized campaign, force your AI to answer: Who benefits? What vulnerability is targeted? Would we disclose this logic? If the answer is murky, rewrite it.",
    "Free template: The Brand Signature Test. Run your copy through this prompt to check if it's legally defensible, regulatory accurate, honest to customers, and ready for front-page scrutiny. Don't ship without it.",
    "Tools are only as good as the prompts that wield them. Here are five starter prompts to implement Claim Extraction, Benefit Alignment, Brand Signature, Coverage Review, and Style Cards into your team's workflow.",
    "HBR now asks authors if they used Generative AI. Should your team? What is your highest-risk claim in market right now, and where does verification fail in your workflow? Let's talk about how to fix it."
];

function generateLinkedInCopy(slideNumber: number): string {
    // Array is 0-indexed, slideNumber is 1-indexed
    const insightIndex = Math.min(Math.max(slideNumber - 1, 0), SLIDE_INSIGHTS.length - 1);
    const insight = SLIDE_INSIGHTS[insightIndex];

    const footer = [
        `\nFor the full deck, visit: https://pmm.sidc.ai`,
        '#ProductMarketing #GenAI #ResponsibleAI #MarketingLeadership #PMM',
    ].join('\n');

    return [
        insight,
        footer,
    ].filter(l => l !== undefined && l !== '').join('\n').trim();
}

interface LinkedInShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    slideNumber: number;
    capturedUrl: string | null;
}

// ─── Component ──────────────────────────────────────────────────────────────
export function LinkedInShareModal({
    isOpen,
    onClose,
    slideNumber,
    capturedUrl,
}: LinkedInShareModalProps) {
    const [screenshotBlob, setScreenshotBlob] = useState<Blob | null>(null);
    const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
    const [textCopied, setTextCopied] = useState(false);
    const [linkedinCopy, setLinkedinCopy] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Generate copy when slide changes
    useEffect(() => {
        setLinkedinCopy(generateLinkedInCopy(slideNumber));
    }, [slideNumber]);

    // Convert data URL to Blob for copying
    useEffect(() => {
        if (!isOpen || !capturedUrl) return;
        setCopyState('idle');

        fetch(capturedUrl)
            .then(res => res.blob())
            .then(blob => setScreenshotBlob(blob))
            .catch(err => console.error('Failed to convert screenshot to blob:', err));
    }, [isOpen, capturedUrl]);

    const handleCopyImage = useCallback(async () => {
        if (!screenshotBlob) return;
        setCopyState('copying');
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': screenshotBlob }),
            ]);
            setCopyState('copied');
            setTimeout(() => setCopyState('idle'), 2500);
        } catch {
            // Fallback: trigger download
            setCopyState('error');
            if (capturedUrl) {
                const a = document.createElement('a');
                a.href = capturedUrl;
                a.download = `pmm-slide-${slideNumber}.png`;
                a.click();
            }
            setTimeout(() => setCopyState('idle'), 2500);
        }
    }, [screenshotBlob, capturedUrl, slideNumber]);

    // Copy text to clipboard
    const handleCopyText = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(linkedinCopy);
            setTextCopied(true);
            setTimeout(() => setTextCopied(false), 2000);
        } catch {
            textareaRef.current?.select();
        }
    }, [linkedinCopy]);

    // Open LinkedIn with pre-filled text
    const handleOpenLinkedIn = useCallback(() => {
        const encodedText = encodeURIComponent(linkedinCopy);
        const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }, [linkedinCopy]);

    if (!isOpen) return null;

    const imageLabel = {
        idle: 'Copy Image',
        copying: 'Copying…',
        copied: 'Copied!',
        error: 'Saved to Downloads',
    }[copyState];

    return (
        <div
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center print:hidden"
            onClick={onClose}
        >
            <div
                className="bg-white border-2 border-ink w-full max-w-2xl mx-4 relative flex flex-col max-h-[90dvh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-line shrink-0">
                    <div className="flex items-center gap-3">
                        <svg viewBox="0 0 24 24" fill="#0A66C2" className="w-5 h-5">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <h2 className="font-serif text-lg font-bold text-ink">Share to LinkedIn</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-ink hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <CrossIcon label="Close" size="small" />
                    </button>
                </div>

                {/* Content: two-column */}
                <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-auto">
                    {/* Left: Screenshot */}
                    <div className="md:w-[45%] shrink-0 border-b md:border-b-0 md:border-r border-line p-4 flex flex-col gap-3">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft/60">Step 1 — Copy slide image</p>

                        <div className="aspect-[16/9] bg-line/30 border border-line flex items-center justify-center overflow-hidden relative">
                            {capturedUrl && (
                                <img
                                    src={capturedUrl}
                                    alt={`Slide ${slideNumber} preview`}
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>

                        <button
                            onClick={handleCopyImage}
                            disabled={!screenshotBlob || copyState === 'copying'}
                            className={`
                                flex items-center justify-center gap-2 w-full py-2.5 font-mono text-xs uppercase tracking-widest font-bold border-2 transition-all
                                ${copyState === 'copied'
                                    ? 'border-forest text-forest bg-forest/5'
                                    : copyState === 'error'
                                        ? 'border-vermillion text-vermillion'
                                        : 'border-ink text-ink hover:bg-ink hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
                                }
                            `}
                        >
                            {copyState === 'copied'
                                ? <CheckMarkIcon label="Copied" size="small" />
                                : <CopyIcon label="Copy" size="small" />
                            }
                            {imageLabel}
                        </button>

                        {copyState === 'error' && (
                            <p className="text-[10px] text-ink-soft/60 font-mono leading-tight">
                                Clipboard not available — image downloaded instead.
                            </p>
                        )}
                    </div>

                    {/* Right: Copy */}
                    <div className="flex-1 p-4 flex flex-col gap-3">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft/60">Step 2 — Edit copy, then open LinkedIn</p>

                        <textarea
                            ref={textareaRef}
                            value={linkedinCopy}
                            onChange={e => setLinkedinCopy(e.target.value)}
                            className="flex-1 min-h-[200px] w-full border border-line p-3 font-sans text-sm text-ink leading-relaxed resize-none focus:outline-none focus:border-ink transition-colors"
                            placeholder="Generating copy…"
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={handleCopyText}
                                className="flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-widest border border-line hover:border-ink text-ink-soft hover:text-ink transition-colors"
                            >
                                {textCopied ? <CheckMarkIcon label="Copied" size="small" /> : <CopyIcon label="Copy" size="small" />}
                                {textCopied ? 'Copied' : 'Copy text'}
                            </button>

                            <button
                                onClick={handleOpenLinkedIn}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 font-mono text-xs uppercase tracking-widest font-bold bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-colors border-2 border-[#0A66C2]"
                            >
                                <Linkedin size={14} strokeWidth={2} />
                                Open LinkedIn Draft
                            </button>
                        </div>

                        <p className="text-[10px] text-ink-soft/50 font-mono leading-tight">
                            LinkedIn will open with text pre-filled. Paste the copied image into the post.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
