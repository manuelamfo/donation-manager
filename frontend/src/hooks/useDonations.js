import { useState, useEffect } from 'react';
import { getDonations, createDonation, deleteDonation, sendEmail } from '../services/api';

export function useDonations() {
  const [donations, setDonations] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', amount: '', date: '' });
  
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'error' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [openMonths, setOpenMonths] = useState({});

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [newEmailInput, setNewEmailInput] = useState('');

  const showToastMsg = (message, type = 'error') => setToast({ isVisible: true, message, type });
  const closeToast = () => setToast({ isVisible: false, message: '', type: 'error' });
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
      if (monthKeys.length > 0) setOpenMonths({ [monthKeys[0]]: true });
    } catch (error) {
      showToastMsg("Falha ao buscar as doações no servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDonations();
  }, []);

  const toggleMonth = (monthKey) => setOpenMonths(prev => ({ ...prev, [monthKey]: !prev[monthKey] }));

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

  const confirmDelete = (id) => {
    setConfirmDialog({
      isOpen: true, title: 'Remover Doação', message: 'Tem certeza que deseja remover esta doação permanentemente?',
      onConfirm: async () => {
        try {
          await deleteDonation(id);
          setDonations(donations.filter(d => d.id !== id));
          setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
          closeConfirmDialog();
        } catch (error) {
          closeConfirmDialog();
          showToastMsg("Erro ao remover doação.");
        }
      }
    });
  };

  const confirmBulkDelete = () => {
    setConfirmDialog({
      isOpen: true, title: 'Remover Selecionadas', message: `Você está prestes a apagar ${selectedIds.length} doações. Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map(id => deleteDonation(id)));
          setDonations(donations.filter(d => !selectedIds.includes(d.id)));
          setSelectedIds([]);
          closeConfirmDialog();
        } catch (error) {
          closeConfirmDialog();
          showToastMsg("Erro ao remover algumas doações.");
        }
      }
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return showToastMsg("Por favor, insira um endereço de e-mail válido.");
    if (parseFloat(formData.amount) <= 0) return showToastMsg("O valor deve ser maior que zero.");
    if (formData.date > getTodayString()) return showToastMsg("A data não pode ser no futuro.");

    try {
      await createDonation({ ...formData, amount: parseFloat(formData.amount) });
      setIsModalOpen(false);
      setFormData({ name: '', email: '', amount: '', date: '' });
      fetchAllDonations();
      showToastMsg("Registro salvo com sucesso!", "success");
    } catch (error) {
      showToastMsg(error.response?.data?.detail || "Erro ao criar doação.");
    }
  };

  const openEmailModal = () => {
    const selectedDonations = donations.filter(d => selectedIds.includes(d.id));
    const uniqueEmails = [...new Set(selectedDonations.map(d => d.donor_email))];
    
    setEmailList(uniqueEmails);
    setEmailSubject('');
    setEmailBody('');
    setNewEmailInput('');
    setIsEmailModalOpen(true);
  };

  const handleAddEmailToList = () => {
    if (!newEmailInput) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmailInput)) return showToastMsg("E-mail inválido.");
    if (emailList.includes(newEmailInput)) return showToastMsg("Este e-mail já está na lista.");
    
    setEmailList([...emailList, newEmailInput]);
    setNewEmailInput('');
  };

  const handleRemoveEmailFromList = (emailToRemove) => {
    setEmailList(emailList.filter(e => e !== emailToRemove));
  };

  const handleSendEmailSubmit = async (e) => {
    e.preventDefault();
    if (emailList.length === 0) return showToastMsg("A lista de destinatários está vazia.");
    if (!emailSubject.trim()) return showToastMsg("O assunto é obrigatório.");
    if (!emailBody.trim()) return showToastMsg("A mensagem é obrigatória.");

    try {
      const message = await sendEmail({ emails: emailList, subject: emailSubject, body: emailBody });
      setIsEmailModalOpen(false);
      showToastMsg(message.message, "success");
    } catch (error) {
      showToastMsg("Erro ao tentar enviar os e-mails.");
    }
  };

  const groupedDonations = groupDonationsByMonth(donations);

  return {
    groupedDonations, selectedIds, isModalOpen, setIsModalOpen, loading, formData, setFormData,
    toast, closeToast, confirmDialog, closeConfirmDialog, openMonths, toggleMonth,
    handleSelectMonthAll, isAllMonthSelected, handleSelectOne, confirmDelete, confirmBulkDelete,
    handleCreateSubmit, getTodayString,
    
    isEmailModalOpen, setIsEmailModalOpen, emailList, emailSubject, setEmailSubject,
    emailBody, setEmailBody, newEmailInput, setNewEmailInput, openEmailModal,
    handleAddEmailToList, handleRemoveEmailFromList, handleSendEmailSubmit
  };
}