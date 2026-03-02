import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { MessageSquare, X, Send, Loader2, Trash2 } from 'lucide-react';

interface Comment {
    id: number;
    slide_index: number;
    author_name: string;
    body: string;
    created_at: string;
}

export function CommentPanel({
    slideIndex,
    isOpen,
    onClose,
}: {
    slideIndex: number;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [authorName, setAuthorName] = useState('');
    const [body, setBody] = useState('');
    const [error, setError] = useState<string | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Load comments for the current slide
    useEffect(() => {
        if (!isOpen) return;

        const fetchComments = async () => {
            setLoading(true);
            setError(null);
            const { data, error: fetchError } = await supabase
                .from('comments')
                .select('*')
                .eq('slide_index', slideIndex)
                .order('created_at', { ascending: true });

            if (fetchError) {
                setError('Could not load comments.');
                console.error(fetchError);
            } else {
                setComments(data || []);
            }
            setLoading(false);
        };

        fetchComments();
    }, [slideIndex, isOpen]);

    // Scroll to bottom when new comments arrive
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [comments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!body.trim()) return;

        setSubmitting(true);
        setError(null);

        const { data, error: insertError } = await supabase
            .from('comments')
            .insert({
                slide_index: slideIndex,
                author_name: authorName.trim() || 'Anonymous',
                body: body.trim(),
            })
            .select()
            .single();

        if (insertError) {
            setError('Could not post comment. Please try again.');
            console.error(insertError);
        } else if (data) {
            setComments((prev) => [...prev, data]);
            setBody('');
        }
        setSubmitting(false);
    };

    const handleDelete = async (commentId: number) => {
        const pwd = window.prompt("Enter Admin Password to delete this comment:");
        if (!pwd) return;

        setDeletingId(commentId);
        setError(null);

        // Call the secure RPC function
        const { data, error: deleteError } = await supabase.rpc('delete_comment_secure', {
            p_comment_id: commentId,
            p_password: pwd
        });

        if (deleteError) {
            setError('Error connecting to delete comment.');
            console.error(deleteError);
        } else if (data === false) {
            setError('Incorrect admin password.');
        } else if (data === true) {
            // Delete successful, remove from local state
            setComments(comments.filter(c => c.id !== commentId));
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
        const diffDay = Math.floor(diffHr / 24);
        return `${diffDay}d ago`;
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 transition-opacity"
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
                        <MessageSquare size={18} strokeWidth={2.5} />
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
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Comment list */}
                <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
                    {loading && (
                        <div className="flex items-center justify-center py-12 text-ink-soft">
                            <Loader2 size={20} className="animate-spin mr-2" />
                            <span className="font-mono text-xs tracking-widest uppercase">Loading</span>
                        </div>
                    )}

                    {!loading && comments.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-ink-soft">
                            <MessageSquare size={32} strokeWidth={1.5} className="mb-3 opacity-30" />
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
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={12} strokeWidth={2.5} />
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

                {/* Submit form */}
                <form onSubmit={handleSubmit} className="border-t-2 border-ink px-6 py-4 shrink-0 space-y-3 bg-white">
                    <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full bg-transparent border-b border-line py-2 font-sans text-sm placeholder:text-ink-soft/50 focus:outline-none focus:border-ink transition-colors"
                        maxLength={50}
                    />
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
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Send size={16} strokeWidth={2.5} />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
