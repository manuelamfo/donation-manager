import { useState, useEffect } from 'react';
import { getDonations, createDonation, deleteDonation } from '../services/api';

export function useDonations() {
    const [donations, setDonations] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', amount: '', date: '' });

    const [toast, setToast] = useState({ isVisible: false, message: '' });
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
    const [openMonths, setOpenMonths] = useState({});

    const showError = (message) => setToast({ isVisible: true, message });
    const closeToast = () => setToast({ isVisible: false, message: '' });
    const closeConfirmDialog = () => setConfirmDialog({ isOpen: false });

    const getTodayString = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };

    const groupDonationsByMonth = (donationsList) => {
        const groups = {};
        const sortedList = [...donationsList].sort((a, b) => b.date.localeCompare(a.date));
        sortedList.forEach((donation) => {
            const [year, month] = donation.date.split('-');
            const groupKey = `${year}-${month}`;
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(donation);
        });
        return groups;
    };

    const fetchAllDonations = async () => {
        try {
            setLoading(true);
            const data = await getDonations();
            setDonations(data);
            const grouped = groupDonationsByMonth(data);
            const monthKeys = Object.keys(grouped);
            if (monthKeys.length > 0) {
                setOpenMonths({ [monthKeys[0]]: true });
            }
        } catch (error) {
            showError("Falha ao buscar as doações no servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllDonations();
    }, []);

    const toggleMonth = (monthKey) => {
        setOpenMonths(prev => ({ ...prev, [monthKey]: !prev[monthKey] }));
    };

    const handleSelectMonthAll = (e, monthDonations) => {
        const monthIds = monthDonations.map(d => d.id);
        if (e.target.checked) {
            setSelectedIds([...selectedIds, ...monthIds.filter(id => !selectedIds.includes(id))]);
        } else {
            setSelectedIds(selectedIds.filter(id => !monthIds.includes(id)));
        }
    };

    const isAllMonthSelected = (monthDonations) => {
        if (monthDonations.length === 0) return false;
        return monthDonations.every(d => selectedIds.includes(d.id));
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const groupedDonations = groupDonationsByMonth(donations);

    return {
        groupedDonations,
        selectedIds,
        isModalOpen,
        setIsModalOpen,
        loading,
        formData,
        setFormData,
        toast,
        closeToast,
        confirmDialog,
        closeConfirmDialog,
        openMonths,
        toggleMonth,
        handleSelectMonthAll,
        isAllMonthSelected,
        handleSelectOne,
        getTodayString
    };
}