import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from '/src/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '/src/services/JobService.jsx';
import JobCard from '../components/jobs/JobCard.jsx';
import CreateJob from '../components/jobs/CreateJob.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import { API_BASE_URL } from '/src/config.js';

function JobsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');

    const fetchInitialJobs = async () => {
        try {
            const response = await getJobs(1);
            if (response.success) {
                setJobs(response.jobs);
                setHasMore(response.hasMore);
                setPage(1);
            } else {
                setError(response.message || 'Failed to fetch jobs.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchInitialJobs();
    }, []);

    const fetchMoreData = async () => {
        const nextPage = page + 1;
        try {
            const response = await getJobs(nextPage);
            if (response.success) {
                setJobs(prevJobs => [...prevJobs, ...response.jobs]);
                setHasMore(response.hasMore);
                setPage(nextPage);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError(err.message);
            setHasMore(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs/delete-job/${jobId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the job.');
            }

            setJobs(jobs.filter(job => job.id !== jobId));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdateJob = (updatedJob) => {
        setJobs(jobs.map(job =>
            job.id === updatedJob.id ? { ...job, ...updatedJob } : job
        ));
    };

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <MainLayout>
            <main className="w-full min-h-screen bg-background">
                {(user.role === 'admin' || user.role === 'faculty' || user.role === 'alumni') && (
                    <CreateJob onJobPosted={fetchInitialJobs} />
                )}

                {error && (
                    <p className="text-sm text-red-500 mb-4">{error}</p>
                )}

                <InfiniteScroll
                    dataLength={jobs.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<p className="text-center py-4 text-sm">Loading…</p>}
                    endMessage={
                        <p className="text-center py-4 text-xs text-muted-foreground">
                            You have seen all job postings
                        </p>
                    }
                >
                    <div className="mx-auto max-w-2xl space-y-3">
                        {jobs.map((job, index) => (
                            <JobCard
                                key={`${job.id}-${index}`}
                                job={job}
                                onDelete={handleDeleteJob}
                                onUpdate={handleUpdateJob}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            </main>
        </MainLayout>
    );
}

export default JobsPage;
