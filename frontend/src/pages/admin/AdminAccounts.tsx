import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Administrador } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import Input from '../../components/Input';

const AdminAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Administrador[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await adminService.createAccount(formData);
      setFormData({ email: '', password: '' });
      setShowModal(false);
      fetchAccounts();
    } catch (err: any) {
      setError(err.response?.data || 'Error al crear la cuenta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta cuenta?')) return;
    try {
      await adminService.deleteAccount(id);
      fetchAccounts();
    } catch (error: any) {
      alert(error.response?.data || 'Error al eliminar la cuenta');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Administradores</h1>
        <Button onClick={() => setShowModal(true)}>Crear Administrador</Button>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => (
          <Card key={account.idUsuario} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{account.email}</p>
                <p className="text-sm text-gray-500">ID: {account.idUsuario}</p>
              </div>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(account.idUsuario)}
              >
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Crear Administrador"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Creando...' : 'Crear'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
          )}
          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Contraseña"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
};

export default AdminAccounts;
