import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout.jsx';
import { getStudentDashboard } from '../services/mentorService.jsx';
import { 
    GraduationCap, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    MessageSquare, 
    User,
    ArrowRight
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};

export default function MyMentorsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyApplications();
    }, []);

    const fetchMyApplications = async () => {
        try {
            const response = await getStudentDashboard();
            setApplications(response.data);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <GraduationCap className="text-primary" size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">My Mentorships</h1>
                        <p className="text-sm text-muted font-medium">Track your applications and guidance requests</p>
                    </div>
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20 text-muted animate-pulse font-medium">
                            Loading your applications...
                        </div>
                    ) : applications.length > 0 ? (
                        applications.map((app) => (
                            <div key={app.enrollment_id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-5">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-md mb-2 inline-block">
                                                {app.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-foreground leading-tight">
                                                {app.guidance_on}
                                            </h3>
                                            
                                            <div className="flex items-center gap-2 mt-2 text-muted">
                                                <div className="w-5 h-5 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                                                    {app.mentor_avatar ? (
                                                        <img src={getFullUrl(app.mentor_avatar)} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <User size={12} className="text-primary" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-foreground/80">Mentor: {app.mentor_name}</span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            app.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                                            app.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                            'bg-amber-500/10 text-amber-500'
                                        }`}>
                                            {app.status === 'accepted' && <CheckCircle2 size={14} />}
                                            {app.status === 'rejected' && <XCircle size={14} />}
                                            {app.status === 'pending' && <Clock size={14} />}
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 bg-foreground/5 rounded-xl border border-border/50">
                                        <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Your Request:</h4>
                                        <p className="text-sm text-foreground/80 italic leading-relaxed">"{app.request_message}"</p>
                                    </div>

                                    {app.mentor_notes && (
                                        <div className="mt-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 flex items-center gap-1">
                                                <MessageSquare size={12} /> Mentor Feedback:
                                            </h4>
                                            <p className="text-sm text-foreground/90 font-medium">{app.mentor_notes}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                                        <div className="flex items-center gap-2 text-xs text-muted">
                                            <Clock size={14} />
                                            <span>Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
                                        </div>
                                        
                                        {app.status === 'accepted' && (
                                            <button
                                                onClick={() => navigate('/messages', { 
                                                    state: { 
                                                        mentor: {
                                                            id: app.mentor_id,
                                                            name: app.mentor_name,
                                                            profile_picture_url: app.mentor_avatar
                                                        } 
                                                    } 
                                                })}
                                                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                                                Message Mentor <ArrowRight size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-card border border-border rounded-3xl border-dashed">
                            <GraduationCap size={48} className="mx-auto text-muted/20 mb-4" />
                            <p className="text-muted font-bold italic">You haven't applied for any mentorships yet.</p>
                            <a href="/mentorships" className="text-primary text-sm font-bold hover:underline mt-2 inline-block">
                                Browse available opportunities
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}