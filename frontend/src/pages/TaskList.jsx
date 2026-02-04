import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { Coins, User, Calendar, Users, Search } from 'lucide-react';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await taskService.getAllTasks();
                setTasks(response.data.tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) return <DashboardLayout><LoadingSpinner text="Fetching available tasks..." /></DashboardLayout>;

    return (
        <DashboardLayout>
            <title>Available Tasks</title>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '800', marginBottom: '8px' }}>Available Tasks</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Choose a task and start earning coins.</p>
            </div>

            <div className="grid grid-3" style={{ gap: '24px' }}>
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task._id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{
                                height: '200px',
                                backgroundImage: `url(${task.task_image_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }} />

                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{task.title}</h3>
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 12px',
                                        background: 'rgba(52, 211, 153, 0.1)',
                                        color: '#34d399',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        fontWeight: '700'
                                    }}>
                                        <Coins size={14} /> {task.payable_amount}
                                    </span>
                                </div>

                                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={14} /> Buyer: <strong>{task.buyer?.name}</strong>
                                    </div>
                                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Calendar size={14} /> Deadline: {new Date(task.deadline).toLocaleDateString()}
                                    </div>
                                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Users size={14} /> Required: {task.available_workers} slots left
                                    </div>
                                </div>

                                <Link to={`/worker/task/${task._id}`} className="btn btn-primary" style={{ textAlign: 'center', marginTop: 'auto' }}>
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '64px', marginBottom: '24px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'center' }}>
                            <Search size={64} />
                        </div>
                        <h3>No tasks available at the moment.</h3>
                        <p>Check back later for new opportunities!</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TaskList;
