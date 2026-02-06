import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { adminService } from '../../services/adminService';
import { Torneo } from '../../types';

const todayStr = (() => {
  const d = new Date();                // reloj local del dispositivo
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;           // formato yyyy-MM-dd
})();

const parseLocalDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d); // fecha LOCAL
};


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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ini = parseLocalDate(formData.fechaInicio);
    ini.setHours(0, 0, 0, 0);

    const fin = parseLocalDate(formData.fechaFin);
    fin.setHours(0, 0, 0, 0);

    if (ini < today) {
      setError('La fecha de inicio no puede ser anterior a hoy.');
      return;
    }

    if (fin < ini) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

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
          min={todayStr}
          value={formData.fechaInicio}
          onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
        />
        <Input
          label="Fecha de Fin"
          type="date"
          required
          min={formData.fechaInicio || todayStr}
          value={formData.fechaFin}
          onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
        />
      </form>
    </Modal>
  );
};

export default TournamentFormModal;
