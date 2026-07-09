import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Scale, ScrollText } from 'lucide-react';

const TermsOfService = () => {
    const navigate = useNavigate();
    const date = new Date();
    return (
        <div className="min-h-svh bg-background flex flex-col items-center px-4 py-8 md:py-12">
            <div className="w-full max-w-2xl mb-8 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Terms of Service</h1>
            </div>

            <div className="w-full max-w-3xl space-y-6">
                
                <div className="rounded-xl bg-card p-6 shadow-sm border border-border sm:p-8">
                    <div className="flex items-center gap-3 mb-6 text-foreground">
                        <Scale className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-semibold">Terms of Service</h2>
                    </div>
                    
                    <div className="space-y-4 text-sm text-muted leading-relaxed">
                        <section>
                            <h3 className="font-medium text-foreground">1.1 Eligibility</h3>
                            <p>GradNet is exclusively for students, faculty, and alumni of AITM. Use of a valid University Serial Number (USN) or institutional affiliation is required for access.</p>
                        </section>

                        <section>
                            <h3 className="font-medium text-foreground">1.2 Professional Conduct</h3>
                            <p>Users must maintain professional standards. Harassment, hate speech, or the distribution of unauthorized academic materials will result in immediate account suspension.</p>
                        </section>

                        <section>
                            <h3 className="font-medium text-foreground">1.3 Mentorship & Networking</h3>
                            <p>Connections made through the platform are professional in nature. GradNet is not liable for private agreements or outcomes resulting from mentorship or job applications.</p>
                        </section>
                    </div>
                </div>

                <div className="rounded-xl bg-card p-6 shadow-sm border border-border sm:p-8">
                    <div className="flex items-center gap-3 mb-6 text-foreground">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <h2 className="text-xl font-semibold">Privacy Policy</h2>
                    </div>
                    
                    <div className="space-y-4 text-sm text-muted leading-relaxed">
                        <section>
                            <h3 className="font-medium text-foreground">2.1 Data Collection</h3>
                            <p>We collect your USN, name, and email via Google OAuth to verify your identity within the AITM community.</p>
                        </section>

                        <section>
                            <h3 className="font-medium text-foreground">2.2 Data Usage</h3>
                            <p>Your profile data is visible to other verified GradNet users to facilitate networking. We do not sell your personal information to third-party advertisers.</p>
                        </section>

                        <section>
                            <h3 className="font-medium text-foreground">2.3 Account Deletion</h3>
                            <p>Users may request complete account and data deletion by contacting the CSE Department administration.</p>
                        </section>
                    </div>
                </div>

                <button 
                    onClick={() => navigate(-1)}
                    className="btn btn-solid w-full mt-8"
                >
                    I Understand
                </button>
            </div>

            <footer className="mt-12 text-center text-xs text-neutral-500">
                <p>© {date.getFullYear()} GradNet • CSE Department, AITM</p>
            </footer>
        </div>
    );
};

export default TermsOfService;