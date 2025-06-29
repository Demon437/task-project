// ✅ Final updated Dashboard.js using REACT_APP_API_URL
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', status: 'Pending', deadline: '' });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_URL;

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/tasks`, {
                headers: { Authorization: token }
            });
            setTasks(res.data);
        } catch {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        document.body.className = darkMode ? 'bg-dark text-light' : 'bg-light text-dark';
    }, [darkMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.patch(`${API_URL}/api/tasks/${editingId}`, form, {
                    headers: { Authorization: token }
                });
                toast.success('Task updated!');
            } else {
                await axios.post(`${API_URL}/api/tasks`, form, {
                    headers: { Authorization: token }
                });
                toast.success('Task added!');
            }

            setForm({ title: '', description: '', status: 'Pending', deadline: '' });
            setEditingId(null);
            setShowForm(false);
            fetchTasks();
        } catch {
            toast.error('Error saving task');
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/tasks/${id}`, {
                headers: { Authorization: token }
            });
            toast.success('Task deleted!');
            fetchTasks();
        } catch {
            toast.error('Delete failed');
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`${API_URL}/api/tasks/${id}`, { status: newStatus }, {
                headers: { Authorization: token }
            });
            toast.success('Status updated');
            fetchTasks();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const startEdit = (task) => {
        setForm({
            title: task.title,
            description: task.description,
            status: task.status,
            deadline: task.deadline?.split("T")[0] || ""
        });
        setEditingId(task._id);
        setShowForm(true);
    };

    const getBadgeClass = (status) => {
        switch (status) {
            case 'Pending': return 'bg-warning text-dark';
            case 'In Progress': return 'bg-info text-dark';
            case 'Completed': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    const getCardClass = (status) => {
        switch (status) {
            case 'Pending': return 'border-warning bg-warning-subtle';
            case 'In Progress': return 'border-info bg-info-subtle';
            case 'Completed': return 'border-success bg-success-subtle';
            default: return '';
        }
    };

    const getDeadlineStatus = (deadline) => {
        const today = new Date().toLocaleDateString('en-CA');
        if (!deadline) return null;
        if (deadline < today) return 'overdue';
        if (deadline === today) return 'dueToday';
        return null;
    };

    const filteredTasks = tasks
        .filter(t => (filter ? t.status === filter : true))
        .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className={`container py-5 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            {/* UI CODE REMAINS SAME */}
            {/* ... Remainder of code is unchanged, it's just API URLs updated to use environment variable */}
        </div>
    );
};

export default Dashboard;
