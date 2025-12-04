import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { adminService } from '../../services/adminService';
import { Torneo } from '../../types';

interface TournamentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tournament?: Torneo | null;
}

const TournamentFormModal: React.FC<TournamentFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  tournament,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tournament) {
      setFormData({
        nombre: tournament.nombre,
        descripcion: tournament.descripcion,
        fechaInicio: tournament.fechaInicio,
        fechaFin: tournament.fechaFin,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
      });
    }
  }, [tournament, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tournament) {
        await adminService.updateTournament(tournament.idTorneo, formData);
      } else {
        await adminService.createTournament(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el torneo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tournament ? 'Editar Torneo' : 'Crear Torneo'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}
        <Input
          label="Nombre del Torneo"
          required
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
        </div>
        <Input
          label="Fecha de Inicio"
          type="date"
          required
          value={formData.fechaInicio}
          onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
        />
        <Input
          label="Fecha de Fin"
          type="date"
          required
          value={formData.fechaFin}
          onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
        />
      </form>
    </Modal>
  );
};

export default TournamentFormModal;
