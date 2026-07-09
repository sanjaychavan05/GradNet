import React, { useState, useEffect, useRef } from 'react';
import {
    User,
    GraduationCap,
    ChevronDown,
    Calendar,
    Award,
    Send,
    ExternalLink,
    Users,
    MoreVertical,
    Pencil,
    Trash2,
    Bookmark,
    BookmarkCheck
} from 'lucide-react';
import { API_BASE_URL } from '/src/config.js';
import { useAuth } from '/src/context/AuthContext.jsx';
import { addBookmark, deleteBookmark } from '/src/services/bookmarksService.jsx';
import DeletePostModal from '../posts/DeletePostModal.jsx';
import EditMentorshipModal from './EditMentorshipModal.jsx';

const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};

export default function MentorshipCard({ mentorship, onApply, onDelete = () => console.error("onDelete prop missing"), onUpdate, onBookmarkToggle }) {
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(mentorship.is_bookmarked);
    const [isBookmarkPending, setIsBookmarkPending] = useState(false);

    const menuRef = useRef(null);
    const canModify = user?.id === mentorship.mentor_id || user?.role === 'admin';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBookmarkClick = async (e) => {
        e.stopPropagation();
        if (isBookmarkPending) return;
        setIsBookmarkPending(true);
        try {
            if (isBookmarked) {
                await deleteBookmark(mentorship.id, 'mentorship');
                setIsBookmarked(false);
            } else {
                await addBookmark(mentorship.id, 'mentorship');
                setIsBookmarked(true);
            }
            if (onBookmarkToggle) onBookmarkToggle(mentorship.id, 'mentorship');
        } catch (err) {
            console.error("Bookmark toggle failed:", err);
        } finally {
            setIsBookmarkPending(false);
        }
    };

    return (
        <div className="w-full bg-card sm:border border-border sm:rounded-2xl transition-all sm:shadow-sm sm:hover:shadow-md overflow-hidden">
            <div className="p-4 sm:p-5">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-md">
                                {mentorship.category}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground truncate">
                            {mentorship.guidance_on}
                        </h3>

                        <div className="flex items-center gap-2 mt-2 text-muted">
                            <div className="w-5 h-5 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                                {mentorship.mentor_avatar ? (
                                    <img src={getFullUrl(mentorship.mentor_avatar)} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <User size={12} className="text-primary" />
                                )}
                            </div>
                            <span className="text-sm font-medium text-foreground/80">{mentorship.mentor_name}</span>
                        </div>
                    </div>

                    {/* Action Area (Bookmark & Menu) */}
                    <div className="flex items-center gap-1 ml-4" ref={menuRef}>
                        {/* <button
                            onClick={handleBookmarkClick}
                            disabled={isBookmarkPending}
                            className={`p-2 rounded-full transition-all ${isBookmarked ? 'text-primary' : 'text-muted hover:bg-foreground/5'}`}
                        >
                            {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                        </button> */}

                        {canModify && (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="p-2 rounded-full text-muted hover:bg-foreground/5 transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {menuOpen && (

                                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in zoom-in-95 duration-100">

                                        {user?.id === mentorship.mentor_id && (<button
                                            onClick={() => { setEditModalOpen(true); setMenuOpen(false); }}
                                            className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-foreground/5"
                                        >
                                            <Pencil size={16} /> Edit Mentorship
                                        </button>)}
                                        <button
                                            onClick={() => { setDeleteModalOpen(true); setMenuOpen(false); }}
                                            className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 text-red-500 hover:bg-red-500/5"
                                        >
                                            <Trash2 size={16} /> Remove Listing
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* <p className={`mt-4 text-sm text-foreground/80 leading-relaxed ${!expanded && 'line-clamp-2'}`}>
                    {mentorship.description}
                </p> */}

                <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden space-y-4">
                        <div className="h-px bg-border/50 w-full" />

                        <section>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                                <Award size={14} /> Program Details
                            </h4>
                            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                {mentorship.description}
                            </p>
                        </section>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 text-xs text-muted">
                                <Calendar size={14} />
                                <span>Listed on {new Date(mentorship.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted">
                                <Users size={14} />
                                <span>Up to {mentorship.max_mentees} mentees</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                            {mentorship.external_link && (
                                <a
                                    href={mentorship.external_link.startsWith('http') ? mentorship.external_link : `https://${mentorship.external_link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border text-foreground font-bold rounded-xl hover:bg-foreground/5 transition-colors text-sm"
                                >
                                    Resources <ExternalLink size={16} />
                                </a>
                            )}

                            {user?.id !== mentorship.mentor_id && (
                                <button
                                    onClick={() => onApply(mentorship)}
                                    className="flex-2 flex items-center justify-center gap-2 py-2.5 bg-primary text-background font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
                                >
                                    Apply for Mentorship <Send size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1 text-xs font-bold text-primary hover:underline uppercase tracking-tight"
                    >
                        {expanded ? 'Show less' : 'View Full Details'}
                        <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                    </button>

                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-foreground/5">
                        <GraduationCap size={14} className="text-primary" />
                        <span className="text-[10px] font-bold text-muted uppercase tracking-tight">Mentorship</span>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <DeletePostModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => { onDelete(mentorship.id); setDeleteModalOpen(false); }}
                type="Mentorship"
                section="Mentorship section"
            />

            <EditMentorshipModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                mentorship={mentorship}
                onSave={onUpdate}
            />

        </div>
    );
}