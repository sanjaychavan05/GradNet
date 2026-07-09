import React, { useState, useEffect, useRef, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout.jsx';
import MentorshipCard from '../components/mentorship/MentorshipCard.jsx';
import ApplyMentorshipModal from '../components/mentorship/ApplyMentorshipModal.jsx';
import CreateMentorshipModal from '../components/mentorship/CreateMentorshipModal.jsx';
import { browseMentorships, deleteMentorship } from '../services/mentorService.jsx';
import { Search, GraduationCap, Loader2, Plus } from 'lucide-react';
import { useAuth } from '/src/context/AuthContext.jsx';

export default function MentorshipPage() {
    const [mentorships, setMentorships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({ category: '', search: '' });
    const { user } = useAuth();
    const [error, setError] = useState('');
    const [selectedMentorship, setSelectedMentorship] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const canCreateProgram = user && ['admin', 'faculty', 'alumni'].includes(user.role);

    const observer = useRef();
    const categories = ['General', 'Placement', 'Higher Studies', 'Web Dev', 'Data Science', 'Core Engineering'];

    useEffect(() => {
        fetchMentorships(1, true);
    }, [filters]);

    const fetchMentorships = async (pageNum, isNewFilter = false) => {
        if (isNewFilter) {
            setLoading(true);
            setPage(1);
        } else {
            setLoadingMore(true);
        }

        try {
            const response = await browseMentorships(filters.category, filters.search, pageNum);
            const newData = response.data;
            setMentorships(prev => isNewFilter ? newData : [...prev, ...newData]);
            setHasMore(newData.length === 10);
        } catch (error) {
            console.error("Failed to fetch mentorships:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };
    const handleDeleteMentorship = async (m_id) => {
        try {
            const response = await deleteMentorship(m_id);
            if (!response.ok) {
                throw new Error('Failed to delete the mentorship.');
            }

            setMentorships(mentorships.filter(mentorship => mentorship.id !== m_id));
        } catch (error) {
            setError(error.message);
        }
    }
    const lastElementRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => {
                    const nextPage = prevPage + 1;
                    fetchMentorships(nextPage);
                    return nextPage;
                });
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto py-6 px-4 sm:px-0">
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <GraduationCap className="text-primary" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Mentorships</h1>
                            <p className="text-sm text-muted font-medium">Connect with Alumni and Faculty</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search by topic..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                            />
                        </div>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="pl-4 pr-10 py-3 bg-card border border-border rounded-2xl text-sm font-bold text-foreground outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>

                {/* Results List */}
                <div className="space-y-4 pb-24">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
                    ) : mentorships.length > 0 ? (
                        <>
                            {mentorships.map((m, index) => (
                                <div ref={mentorships.length === index + 1 ? lastElementRef : null} key={m.id}>
                                    <MentorshipCard 
                                        mentorship={m} 
                                        onApply={() => { setSelectedMentorship(m); setIsApplyModalOpen(true); }} 
                                        onUpdate={() => fetchMentorships(1, true)}
                                        onDelete={handleDeleteMentorship}
                                    />
                                </div>
                            ))}
                            {loadingMore && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary/50" size={24} /></div>}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-card border border-border rounded-3xl">
                            <p className="text-muted font-bold italic">No results found.</p>
                        </div>
                    )}
                </div>
            </div>

            {canCreateProgram && (
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="fixed bottom-6 right-6 z-10 md:z-999 flex items-center gap-2 px-5 py-3.5 bg-primary text-background rounded-2xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all md:bottom-10 md:right-10"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>Create Program</span>
                </button>
            )}
            {canCreateProgram && (
                <CreateMentorshipModal 
                    open={isCreateModalOpen} 
                    onClose={() => setIsCreateModalOpen(false)} 
                    onSuccess={() => fetchMentorships(1, true)}
                />
            )}

            <ApplyMentorshipModal 
                open={isApplyModalOpen} 
                onClose={() => setIsApplyModalOpen(false)} 
                mentorship={selectedMentorship} 
                onSuccess={() => fetchMentorships(1, true)} 
            />
        </MainLayout>
    );
}