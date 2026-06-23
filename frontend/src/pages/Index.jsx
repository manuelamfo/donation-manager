import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { FiTrash2, FiPlus, FiX, FiChevronDown, FiChevronUp, FiMail } from 'react-icons/fi';

import { useDonations } from '../hooks/useDonations';
import { formatCurrency, formatDate, formatMonthHeader } from '../utils/formatters';

export default function DashboardPage({ onLogout }) {
  const navigate = useNavigate();
  
  const {
    groupedDonations, selectedIds, isModalOpen, setIsModalOpen, loading, formData, setFormData,
    toast, closeToast, confirmDialog, closeConfirmDialog, openMonths, toggleMonth,
    handleSelectMonthAll, isAllMonthSelected, handleSelectOne, confirmDelete, confirmBulkDelete, handleCreateSubmit, getTodayString,
    isEmailModalOpen, isEmailSending, setIsEmailModalOpen, emailList, emailSubject, setEmailSubject,
    emailBody, setEmailBody, newEmailInput, setNewEmailInput, openEmailModal,
    handleAddEmailToList, handleRemoveEmailFromList, handleSendEmailSubmit
  } = useDonations();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-black antialiased relative">
      <Navbar onLogout={handleLogoutClick} />

      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={closeToast} />

      <ConfirmModal 
        isOpen={confirmDialog.isOpen} title={confirmDialog.title} message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm} onCancel={closeConfirmDialog} confirmText="Remover"
      />

      <main className="pt-28 max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex flex-col gap-4 items-start sm:flex-row sm:justify-between sm:items-end mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-black select-none">Doações</h1>
          
          <div className="flex gap-3 items-center w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <button onClick={openEmailModal} className="h-10 px-4 flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 rounded-md text-sm font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap">
              <FiMail className="w-4 h-4" /> Enviar E-mail
            </button>

            {selectedIds.length > 0 && (
              <button onClick={confirmBulkDelete} className="h-10 px-4 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md text-sm font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap">
                <FiTrash2 className="w-4 h-4" /> Remover selecionadas ({selectedIds.length})
              </button>
            )}
            
            <div className="w-full sm:w-44 -mt-2">
              <Button onClick={() => setIsModalOpen(true)}>
                <span className="flex items-center justify-center gap-2 cursor-pointer"><FiPlus className="w-4 h-4" /> Nova Doação</span>
              </Button>
            </div>
          </div>
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
                      <span className="text-xs bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-medium">{monthDonations.length}</span>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-50"><FiX className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-black tracking-tight mb-8 select-none">Registrar Doação</h2>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-5">
              <Input label="Nome do Doador" placeholder="Ex: Gabriel" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <Input label="E-mail" type="email" placeholder="nome@email.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <Input label="Valor (R$)" type="number" step="0.01" min="0.01" placeholder="0,00" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
              <Input label="Data da Doação" type="date" required max={getTodayString()} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              <div className="mt-4 flex flex-col-reverse sm:flex-row gap-3 justify-end items-center border-t border-zinc-100 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-zinc-500 hover:text-black transition-colors cursor-pointer rounded-md hover:bg-zinc-50">Cancelar</button>
                <div className="w-full sm:w-40"><Button type="submit">Salvar Registro</Button></div>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 relative border border-zinc-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            {isEmailSending && (
              <div className="absolute inset-0 bg-white/50 rounded-xl flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-2"></div>
                  <p className="text-sm font-medium text-zinc-700">Enviando e-mail...</p>
                </div>
              </div>
            )}

            <button onClick={() => setIsEmailModalOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-50"><FiX className="w-6 h-6" /></button>
            
            <h2 className="text-2xl font-bold text-black tracking-tight mb-2 select-none flex items-center gap-2">
              <FiMail className="w-6 h-6 text-zinc-400" /> Comunicação
            </h2>
            <p className="text-sm text-zinc-500 mb-6">Envie um e-mail direto para os doadores selecionados.</p>
            
            <form onSubmit={handleSendEmailSubmit} className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-900 text-left">Destinatários ({emailList.length})</label>
                
                <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-md min-h-[60px] max-h-32 overflow-y-auto">
                  {emailList.length === 0 && <span className="text-zinc-400 text-sm mt-1">A lista está vazia.</span>}
                  {emailList.map(email => (
                    <span key={email} className="flex items-center gap-1.5 bg-white border border-zinc-200 shadow-sm text-zinc-700 px-2.5 py-1 rounded-md text-xs font-medium">
                      {email}
                      <button type="button" onClick={() => handleRemoveEmailFromList(email)} className="text-zinc-400 hover:text-red-500 transition-colors"><FiX className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-1">
                  <input 
                    type="email" placeholder="Adicionar outro e-mail..." 
                    className="flex-1 px-3 py-2 border border-zinc-300 rounded-md bg-white text-black text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    value={newEmailInput} onChange={(e) => setNewEmailInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddEmailToList(); } }}
                  />
                  <button type="button" onClick={handleAddEmailToList} className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-sm font-semibold rounded-md transition-colors border border-zinc-200">Adicionar</button>
                </div>
              </div>

              <Input label="Assunto" placeholder="Ex: Agradecimento pela doação" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-zinc-900 text-left">Mensagem</label>
                <textarea 
                  className="px-3 py-2 border border-zinc-300 rounded-md bg-white text-black text-sm focus:outline-none focus:ring-1 focus:ring-black min-h-[150px] resize-y" 
                  placeholder="Escreva sua mensagem aqui..."
                  value={emailBody} onChange={(e) => setEmailBody(e.target.value)}
                />
              </div>
              
              <div className="mt-2 flex flex-col-reverse sm:flex-row gap-3 justify-end items-center border-t border-zinc-100 pt-6">
                <button type="button" onClick={() => setIsEmailModalOpen(false)} className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-zinc-500 hover:text-black transition-colors cursor-pointer rounded-md hover:bg-zinc-50">Cancelar</button>
                <div className="w-full sm:w-40">
                  <Button type="submit" disabled={isEmailSending}>
                    {isEmailSending ? 'Enviando...' : 'Enviar E-mail'}
                  </Button></div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}