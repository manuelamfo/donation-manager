import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { FiTrash2, FiPlus, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

import { useDonations } from '../hooks/useDonations';
import { formatCurrency, formatDate, formatMonthHeader } from '../utils/formatters';

export default function DashboardPage({ onLogout }) {
  const navigate = useNavigate();
  
  const {
    groupedDonations, selectedIds, isModalOpen, setIsModalOpen, loading,
    formData, setFormData, toast, closeToast, confirmDialog, closeConfirmDialog,
    openMonths, toggleMonth, handleSelectMonthAll, isAllMonthSelected,
    handleSelectOne, confirmDelete, confirmBulkDelete, handleCreateSubmit, getTodayString
  } = useDonations();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-black antialiased relative">
      <Navbar onLogout={handleLogoutClick} />

      <Toast isVisible={toast.isVisible} message={toast.message} onClose={closeToast} />

      <ConfirmModal 
        isOpen={confirmDialog.isOpen} title={confirmDialog.title} message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm} onCancel={closeConfirmDialog} confirmText="Remover"
      />

      <main className="pt-28 max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex flex-col gap-4 items-start sm:flex-row sm:justify-between sm:items-end mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-black select-none">Doações</h1>
        </div>

        {loading ? (
          <div className="text-center py-12 font-medium text-zinc-400">Carregando dados...</div>
        ) : Object.keys(groupedDonations).length === 0 ? (
          <div className="text-center py-12 font-medium text-zinc-400 border border-zinc-200 rounded-lg">Nenhum registro encontrado.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(groupedDonations).map(([monthKey, monthDonations]) => {
              const isOpen = !!openMonths[monthKey];
              return (
                <div key={monthKey} className="border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
                  <div onClick={() => toggleMonth(monthKey)} className="w-full flex items-center justify-between bg-zinc-50 px-5 py-4 border-b border-zinc-200 cursor-pointer select-none hover:bg-zinc-100/70 transition-colors">
                    <div className="flex items-center gap-3">
                      {isOpen ? <FiChevronUp className="w-5 h-5 text-zinc-500" /> : <FiChevronDown className="w-5 h-5 text-zinc-500" />}
                      <span className="font-bold text-base text-zinc-900">{formatMonthHeader(monthKey)}</span>
                      <span className="text-xs bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-medium">{monthDonations.length} {monthDonations.length === 1 ? 'registro' : 'registros'}</span>
                    </div>
                    <div className="font-bold text-sm text-zinc-600">Total do mês: <span className="text-black font-extrabold">{formatCurrency(monthDonations.reduce((acc, d) => acc + d.amount, 0))}</span></div>
                  </div>

                  {isOpen && (
                    <div className="overflow-x-auto animate-in fade-in duration-200">
                      <table className="w-full text-left text-sm min-w-[600px]">
                        <thead className="bg-white border-b border-zinc-200 text-zinc-400 select-none">
                          <tr>
                            <th className="px-5 py-3 w-12 text-center bg-zinc-50/30">
                              <input type="checkbox" className="rounded border-zinc-300 text-black focus:ring-black cursor-pointer w-4 h-4" checked={isAllMonthSelected(monthDonations)} onChange={(e) => handleSelectMonthAll(e, monthDonations)} />
                            </th>
                            <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[10px]">Nome</th>
                            <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[10px]">E-mail</th>
                            <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[10px]">Data</th>
                            <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[10px] text-right">Valor</th>
                            <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[10px] text-center w-20">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {monthDonations.map((donation) => (
                            <tr key={donation.id} className="hover:bg-zinc-50/50 transition-colors duration-150 group cursor-default">
                              <td className="px-5 py-4 text-center">
                                <input type="checkbox" className="rounded border-zinc-300 text-black focus:ring-black cursor-pointer w-4 h-4" checked={selectedIds.includes(donation.id)} onChange={() => handleSelectOne(donation.id)} />
                              </td>
                              <td className="px-5 py-4 font-medium text-black">{donation.donor_name}</td>
                              <td className="px-5 py-4 text-zinc-600">{donation.donor_email}</td>
                              <td className="px-5 py-4 text-zinc-500 whitespace-nowrap">{formatDate(donation.date)}</td>
                              <td className="px-5 py-4 text-right font-semibold text-black">{formatCurrency(donation.amount)}</td>
                              <td className="px-5 py-4 text-center">
                                <button onClick={() => confirmDelete(donation.id)} className="text-zinc-400 hover:text-red-600 transition-colors duration-150 md:opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer p-1 rounded hover:bg-zinc-100" title="Remover"><FiTrash2 className="w-5 h-5 mx-auto" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}