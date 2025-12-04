import React, { useState } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { adminService } from '../../services/adminService';

interface CompetitionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tournamentId: number;
}

const CompetitionFormModal: React.FC<CompetitionFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  tournamentId,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    cupo: '',
    precioBase: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminService.createCompetition(tournamentId, {
        name: formData.name,
        cupo: Number(formData.cupo),
        precioBase: Number(formData.precioBase),
      });
      setFormData({ name: '', cupo: '', precioBase: '' });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear la competencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar Competencia"
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
          label="Nombre de la Competencia"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          label="Cupo"
          type="number"
          min="1"
          required
          value={formData.cupo}
          onChange={(e) => setFormData({ ...formData, cupo: e.target.value })}
        />
        <Input
          label="Precio Base"
          type="number"
          min="0"
          step="0.01"
          required
          value={formData.precioBase}
          onChange={(e) => setFormData({ ...formData, precioBase: e.target.value })}
        />
      </form>
    </Modal>
  );
};

export default CompetitionFormModal;
