import { useState, useEffect, useRef } from 'react';
import CommentIcon from '@atlaskit/icon/core/comment';
import CrossIcon from '@atlaskit/icon/core/cross';
import SendIcon from '@atlaskit/icon/core/send';
import RetryIcon from '@atlaskit/icon/core/retry';
import DeleteIcon from '@atlaskit/icon/core/delete';

// ─── Trello config (injected at build time via .env.local / Netlify env vars) ───
const TRELLO_KEY = import.meta.env.VITE_TRELLO_KEY as string;
const TRELLO_TOKEN = import.meta.env.VITE_TRELLO_TOKEN as string;
const TRELLO_LIST_ID = import.meta.env.VITE_TRELLO_LIST_ID as string;
const ADMIN_PASSWORD = 'rovo';

// ─── Trello helpers ──────────────────────────────────────────────────────────────

function trelloUrl(path: string, params: Record<string, string> = {}) {
    const base = `https://api.trello.com/1${path}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const extra = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return extra ? `${base}&${extra}` : base;
}

/** Encode comment metadata into the Trello card description */
function encodeDesc(slideIndex: number, author: string, body: string, createdAt: string) {
    return `SLIDE:${slideIndex}\nAUTHOR:${author}\nAT:${createdAt}\n---\n${body}`;
}

/** Parse a Trello card back into a Comment */
function parseCard(card: { id: string; name: string; desc: string }): Comment | null {
    const lines = card.desc.split('\n');
    const get = (prefix: string) => {
        const line = lines.find(l => l.startsWith(prefix));
        return line ? line.slice(prefix.length) : null;
    };
    const slideRaw = get('SLIDE:');
    if (slideRaw === null) return null; // not our card
    const bodyStart = lines.findIndex(l => l === '---');
    return {
        id: card.id,
        slide_index: parseInt(slideRaw, 10),
        author_name: get('AUTHOR:') || 'Anonymous',
        body: bodyStart !== -1 ? lines.slice(bodyStart + 1).join('\n') : '',
        created_at: get('AT:') || new Date().toISOString(),
    };
}

// ─── Types ───────────────────────────────────────────────────────────────────────

export interface Comment {
    id: string;          // Trello card ID
    slide_index: number;
    author_name: string;
    body: string;
    created_at: string;
}

// ─── Component ───────────────────────────────────────────────────────────────────

export function CommentPanel({
    slideIndex,
    isOpen,
    onClose,
    onCountChange,
    preloadedComments = [],
}: {
    slideIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onCountChange?: (count: number) => void;
    preloadedComments?: Comment[];
}) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [authorName, setAuthorName] = useState('');
    const [body, setBody] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [backdropVisible, setBackdropVisible] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);

    // Backdrop fade
    useEffect(() => {
        if (isOpen) {
            const t = setTimeout(() => setBackdropVisible(true), 10);
            return () => clearTimeout(t);
        } else {
            setBackdropVisible(false);
        }
    }, [isOpen]);

    // Fetch comments for current slide from Trello.
    // If preloadedComments are available (from App-level on-mount fetch), use them
    // and skip the network call. Fall back to fetching if panel is opened cold.
    useEffect(() => {
        if (!isOpen) return;
        // Use preloaded data immediately if available
        if (preloadedComments.length > 0) {
            setComments(preloadedComments);
            setLoading(false);
            return;
        }
        const fetchComments = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(trelloUrl(`/lists/${TRELLO_LIST_ID}/cards`, { fields: 'id,name,desc' }));
                if (!res.ok) throw new Error('Failed to fetch');
                const cards: { id: string; name: string; desc: string }[] = await res.json();
                const parsed = cards
                    .map(parseCard)
                    .filter((c): c is Comment => c !== null && c.slide_index === slideIndex)
                    .sort((a, b) => a.created_at.localeCompare(b.created_at));
                setComments(parsed);
            } catch (err) {
                setError('Could not load comments.');
                console.error(err);
            }
            setLoading(false);
        };
        fetchComments();
    }, [slideIndex, isOpen, preloadedComments]);

    // Scroll to bottom + notify parent of count
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
        onCountChange?.(comments.length);
    }, [comments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!body.trim()) return;

        setSubmitting(true);
        setError(null);

        const authorDisplay = authorName.trim() || 'Anonymous';
        const now = new Date().toISOString();
        const cardName = `💬 Slide ${slideIndex + 1} — ${authorDisplay}: ${body.trim().slice(0, 60)}${body.trim().length > 60 ? '…' : ''}`;
        const cardDesc = encodeDesc(slideIndex, authorDisplay, body.trim(), now);

        try {
            const res = await fetch(trelloUrl('/cards'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idList: TRELLO_LIST_ID, name: cardName, desc: cardDesc }),
            });
            if (!res.ok) throw new Error(await res.text());
            const card = await res.json();
            const newComment: Comment = {
                id: card.id,
                slide_index: slideIndex,
                author_name: authorDisplay,
                body: body.trim(),
                created_at: now,
            };
            setComments(prev => [...prev, newComment]);
            setBody('');
        } catch (err) {
            setError('Could not post comment. Please try again.');
            console.error(err);
        }
        setSubmitting(false);
    };

    const handleDelete = async (commentId: string) => {
        const funPrompts = [
            "Oops, made a boo boo? We've all been there. Password please:",
            "Deploying the 'Undo' button. What's the secret code?",
            "Deleting history like a pro. Password, my good admin?",
            "Mistakes happen. That's why we have passwords. What's yours?",
            "Let's sweep this under the rug. Password needed:"
        ];
        const pwd = window.prompt(funPrompts[Math.floor(Math.random() * funPrompts.length)]);
        if (!pwd) return;
        if (pwd !== ADMIN_PASSWORD) {
            setError('Incorrect admin password.');
            return;
        }

        setDeletingId(commentId);
        setError(null);

        try {
            const res = await fetch(trelloUrl(`/cards/${commentId}`), { method: 'DELETE' });
            if (!res.ok) throw new Error(await res.text());
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            setError('Could not delete comment.');
            console.error(err);
        }
        setDeletingId(null);
    };

    const formatTime = (iso: string) => {
        const d = new Date(iso);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr}h ago`;
        return `${Math.floor(diffHr / 24)}d ago`;
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${backdropVisible ? 'opacity-100' : 'opacity-0'}`}
                    onClick={onClose}
                />
            )}

            {/* Panel */}
            <div
                className={`
          fixed top-0 right-0 h-full w-full max-w-md bg-white border-l-2 border-ink z-50
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b-2 border-ink shrink-0">
                    <div className="flex items-center gap-3">
                        <CommentIcon label="Comments" size="small" />
                        <span className="font-serif text-lg font-bold tracking-tight">
                            Comments
                        </span>
                        <span className="font-mono text-xs tracking-widest text-ink-soft uppercase">
                            Slide {slideIndex + 1}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-ink hover:text-white transition-colors"
                        aria-label="Close comments"
                    >
                        <CrossIcon label="Close" size="small" />
                    </button>
                </div>

                {/* Comment list */}
                <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
                    {loading && (
                        <div className="flex items-center justify-center py-12 text-ink-soft">
                            <span className="animate-spin mr-2 flex items-center justify-center">
                                <RetryIcon label="Loading" size="small" />
                            </span>
                            <span className="font-mono text-xs tracking-widest uppercase">Loading</span>
                        </div>
                    )}

                    {!loading && comments.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-ink-soft">
                            <CommentIcon label="No comments" size="medium" />
                            <p className="font-mono text-xs tracking-widest uppercase">No comments yet</p>
                            <p className="font-sans text-sm mt-2 text-ink-soft/70">Be the first to share your thoughts.</p>
                        </div>
                    )}

                    {comments.map((c) => (
                        <div key={c.id} className="group border-b border-line pb-3 last:border-b-0 relative">
                            <div className="flex items-baseline justify-between mb-1">
                                <span className="font-sans text-sm font-bold tracking-tight">
                                    {c.author_name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] tracking-widest text-ink-soft uppercase">
                                        {formatTime(c.created_at)}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        disabled={deletingId === c.id}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-soft hover:text-red-600 ml-1 p-1 disabled:opacity-50"
                                        aria-label="Delete comment"
                                        title="Delete comment (Admin only)"
                                    >
                                        {deletingId === c.id ? (
                                            <span className="animate-spin flex items-center justify-center">
                                                <RetryIcon label="Deleting" size="small" />
                                            </span>
                                        ) : (
                                            <DeleteIcon label="Delete" size="small" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <p className="font-sans text-sm leading-relaxed text-ink-soft pr-6">
                                {c.body}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="px-6 py-2 bg-ink text-white font-mono text-xs tracking-widest uppercase shrink-0">
                        {error}
                    </div>
                )}

                {/* Submit form — textarea first, name below */}
                <form onSubmit={handleSubmit} className="border-t-2 border-ink px-6 py-4 shrink-0 space-y-3 bg-white">
                    <div className="flex items-end gap-2">
                        <textarea
                            placeholder="Leave a comment..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={2}
                            className="flex-1 bg-transparent border border-line py-2 px-3 font-sans text-sm placeholder:text-ink-soft/50 focus:outline-none focus:border-ink transition-colors resize-none"
                            maxLength={1000}
                        />
                        <button
                            type="submit"
                            disabled={submitting || !body.trim()}
                            className={`
                p-3 border-2 border-ink transition-colors shrink-0
                ${submitting || !body.trim()
                                    ? 'text-ink-soft/30 border-line cursor-not-allowed'
                                    : 'hover:bg-ink hover:text-white'
                                }
              `}
                            aria-label="Submit comment"
                        >
                            {submitting ? (
                                <span className="animate-spin flex items-center justify-center">
                                    <RetryIcon label="Submitting" size="small" />
                                </span>
                            ) : (
                                <SendIcon label="Send" size="small" />
                            )}
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full bg-transparent border-b border-line py-1.5 font-sans text-xs text-ink-soft placeholder:text-ink-soft/40 focus:outline-none focus:border-ink transition-colors"
                        maxLength={50}
                    />
                </form>
            </div>
        </>
    );
}
