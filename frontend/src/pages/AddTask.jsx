import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import axios from 'axios';

const AddTask = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageUploading, setImageUploading] = useState(false);
    const [taskImageUrl, setTaskImageUrl] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [originalCost, setOriginalCost] = useState(0);
    const [formValues, setFormValues] = useState({
        task_title: '',
        task_detail: '',
        required_workers: 10,
        payable_amount: 5,
        completion_date: '',
        submission_info: ''
    });

    const totalCost = useMemo(() => {
        const requiredWorkers = Number(formValues.required_workers) || 0;
        const payableAmount = Number(formValues.payable_amount) || 0;
        return requiredWorkers * payableAmount;
    }, [formValues.required_workers, formValues.payable_amount]);

    useEffect(() => {
        const editId = searchParams.get('edit');
        if (!editId) return;
        setEditingTaskId(editId);
        const fetchTask = async () => {
            setInitialLoading(true);
            try {
                const response = await taskService.getTask(editId);
                const task = response.data.task;
                setFormValues({
                    task_title: task.title || '',
                    task_detail: task.description || '',
                    required_workers: task.required_workers || 1,
                    payable_amount: task.payable_amount || 1,
                    completion_date: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
                    submission_info: task.submission_info || ''
                });
                setTaskImageUrl(task.task_image_url || '');
                setOriginalCost((task.required_workers || 0) * (task.payable_amount || 0));
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load task details');
            } finally {
                setInitialLoading(false);
            }
        };
        fetchTask();
    }, [searchParams]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageUploading(true);
        setError('');

        const imgData = new FormData();
        imgData.append('image', file);

        try {
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                imgData
            );
            if (response.data.success) {
                setTaskImageUrl(response.data.data.url);
            }
        } catch (err) {
            console.error('Image upload failed:', err);
            setError('Image upload failed. Make sure your ImgBB API key is correct.');
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (imageUploading) {
            setError('Please wait for the image to finish uploading.');
            return;
        }

        const required_workers = Number(formValues.required_workers);
        const payable_amount = Number(formValues.payable_amount);
        const totalPayable = required_workers * payable_amount;
        const costDifference = editingTaskId ? totalPayable - originalCost : totalPayable;

        if (costDifference > user.coins) {
            toast.error('Not available Coin. Purchase Coin');
            navigate('/buyer/purchase-coin');
            return;
        }

        setLoading(true);
        const taskData = {
            title: formValues.task_title,
            description: formValues.task_detail,
            required_workers,
            payable_amount,
            deadline: formValues.completion_date,
            submission_info: formValues.submission_info,
            task_image_url: taskImageUrl
        };

        try {
            if (editingTaskId) {
                await taskService.updateTask(editingTaskId, taskData);
                toast.success('Task updated successfully!');
                updateUser({ ...user, coins: user.coins - costDifference });
            } else {
                await taskService.createTask(taskData);
                toast.success('Task created successfully!');
                updateUser({ ...user, coins: user.coins - totalPayable });
            }
            navigate('/buyer/my-tasks');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    if (initialLoading) {
        return (
            <DashboardLayout>
                <LoadingSpinner text="Loading task details..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <title>Add Task | Buyer</title>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '800', marginBottom: '8px' }}>
                        {editingTaskId ? 'Edit Task' : 'Create New Task'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {editingTaskId ? 'Update the details of your task.' : 'Fill in the details to post a new job for workers.'}
                    </p>
                </div>

                {error && (
                    <div className="error" style={{ marginBottom: '24px' }}>{error}</div>
                )}

                <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="input-group">
                        <label>Task Title</label>
                        <input
                            name="task_title"
                            required
                            placeholder="e.g. Watch my YouTube video and make a comment"
                            style={{ width: '100%' }}
                            value={formValues.task_title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Task Details</label>
                        <textarea
                            name="task_detail"
                            required
                            rows="4"
                            placeholder="Describe exactly what workers need to do..."
                            style={{ width: '100%' }}
                            value={formValues.task_detail}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="grid grid-2" style={{ gap: '24px' }}>
                        <div className="input-group">
                            <label>Required Workers</label>
                            <input
                                type="number"
                                name="required_workers"
                                min="1"
                                required
                                style={{ width: '100%' }}
                                value={formValues.required_workers}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Payable Amount (per worker)</label>
                            <input
                                type="number"
                                name="payable_amount"
                                min="1"
                                required
                                style={{ width: '100%' }}
                                value={formValues.payable_amount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-2" style={{ gap: '24px' }}>
                        <div className="input-group">
                            <label>Completion Date</label>
                            <input
                                type="date"
                                name="completion_date"
                                required
                                style={{ width: '100%' }}
                                value={formValues.completion_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Task Image</label>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ width: '100%' }}
                                />
                                {taskImageUrl && (
                                    <img
                                        src={taskImageUrl}
                                        alt="Preview"
                                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                            {imageUploading && <p style={{ fontSize: '12px', color: 'var(--primary-color)', marginTop: '4px' }}>Uploading image...</p>}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Submission Info (Proof required)</label>
                        <textarea
                            name="submission_info"
                            required
                            rows="2"
                            placeholder="e.g. Send screenshot of your comment and channel name"
                            style={{ width: '100%' }}
                            value={formValues.submission_info}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div style={{
                        padding: '20px',
                        background: 'rgba(99, 102, 241, 0.05)',
                        borderRadius: '12px',
                        border: '1px dashed var(--primary-color)',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Total Cost: <strong><span id="total-cost">{totalCost}</span> coins</strong>
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ height: '56px', fontSize: '18px', justifyContent: 'center' }}
                    >
                        {loading ? (editingTaskId ? 'Updating Task...' : 'Creating Task...') : (editingTaskId ? '✅ Save Changes' : '🚀 Post Task Now')}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default AddTask;
