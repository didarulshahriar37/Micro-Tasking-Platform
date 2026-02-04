import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService, submissionService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await taskService.getTask(id);
                setTask(response.data.task);
            } catch (error) {
                console.error('Error fetching task:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const submission_details = e.target.submission_details.value;

        try {
            await submissionService.submitTask({
                taskId: id,
                submission_details
            });
            toast.success('Submission successful! Under review.');
            navigate('/worker/my-submissions');
        } catch (error) {
            alert(error.response?.data?.error || 'Submission failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <DashboardLayout><LoadingSpinner text="Loading task details..." /></DashboardLayout>;
    if (!task) return <DashboardLayout><div className="error">Task not found.</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <title>Task Details</title>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '800', marginBottom: '8px' }}>Task Details</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Read the instructions carefully before submitting.</p>
            </div>

            <style>{`
                @media (max-width: 1024px) {
                    .task-details-container { grid-template-columns: 1fr !important; gap: 24px !important; }
                    .task-info-card-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
                    .task-info-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .task-image { height: 250px !important; }
                    .task-content { padding: 24px !important; }
                    .sticky-form { position: static !important; }
                }
                @media (max-width: 480px) {
                    .task-info-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            <div className="grid grid-3 task-details-container" style={{ gap: '48px', alignItems: 'start' }}>
                {/* Task Information */}
                <div className="col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card"
                        style={{ padding: 0, overflow: 'hidden' }}
                    >
                        <img
                            src={task.task_image_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200'}
                            alt={task.title}
                            className="task-image"
                            style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                        />
                        <div className="task-content" style={{ padding: '40px' }}>
                            <div className="task-info-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: '800' }}>{task.title}</h2>
                                <span style={{
                                    padding: '8px 20px',
                                    background: 'rgba(52, 211, 153, 0.1)',
                                    color: '#34d399',
                                    borderRadius: '30px',
                                    fontSize: '18px',
                                    fontWeight: '800'
                                }}>
                                    💰 {task.payable_amount} Coins
                                </span>
                            </div>

                            <div className="task-info-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '20px',
                                padding: '24px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '16px',
                                border: '1px solid var(--border-color)',
                                marginBottom: '32px'
                            }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Category</div>
                                    <div style={{ fontWeight: '700', color: 'var(--primary-color)', textTransform: 'capitalize' }}>{task.category}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Available Slots</div>
                                    <div style={{ fontWeight: '700' }}>{task.available_workers}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Deadline</div>
                                    <div style={{ fontWeight: '700' }}>{new Date(task.deadline).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Buyer</div>
                                    <div style={{ fontWeight: '700' }}>{task.buyer?.name}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Description</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>{task.description}</p>
                            </div>

                            <div style={{
                                padding: '24px',
                                background: 'rgba(99, 102, 241, 0.05)',
                                borderRadius: '16px',
                                border: '1px dashed var(--primary-color)'
                            }}>
                                <h4 style={{ color: 'var(--primary-color)', fontWeight: '700', marginBottom: '8px' }}>Submission Requirements:</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{task.submission_info || 'Provide details of your completed work in the form.'}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Submission Form */}
                <div className="col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card sticky-form"
                        style={{ position: 'sticky', top: '100px' }}
                    >
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Submit Work</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ fontWeight: '700', marginBottom: '8px' }}>Your Submission Details</label>
                                <textarea
                                    name="submission_details"
                                    required
                                    rows="12"
                                    placeholder="Explain how you completed the task or provide required proof..."
                                    style={{ width: '100%', borderRadius: '12px' }}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                                style={{ height: '56px', fontSize: '18px', display: 'flex', justifyContent: 'center' }}
                            >
                                {submitting ? '🚀 Submitting...' : '✅ Finish & Submit'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TaskDetails;
