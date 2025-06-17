import React, { useState } from 'react';
import { ArrowLeft, User, HelpCircle, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface PasswordRecoveryProps {
  onBack: () => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const PasswordRecovery: React.FC<PasswordRecoveryProps> = ({ onBack, onShowToast }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    securityAnswer: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { getSecurityQuestion, recoverPassword } = useAuth();

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username) {
      onShowToast('Por favor, ingrese su usuario', 'warning');
      return;
    }

    const question = getSecurityQuestion(formData.username);
    if (question) {
      setSecurityQuestion(question);
      setStep(2);
    } else {
      onShowToast('Usuario no encontrado', 'error');
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.securityAnswer || !formData.newPassword || !formData.confirmPassword) {
      onShowToast('Por favor, complete todos los campos', 'warning');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      onShowToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (formData.newPassword.length < 6) {
      onShowToast('La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await recoverPassword(formData.username, formData.securityAnswer, formData.newPassword);
      
      if (success) {
        onShowToast('Contraseña actualizada exitosamente', 'success');
        setTimeout(() => onBack(), 2000);
      } else {
        onShowToast('Respuesta de seguridad incorrecta', 'error');
      }
    } catch (error) {
      onShowToast('Error al recuperar contraseña', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h1>
        <p className="text-gray-600">
          {step === 1 ? 'Ingrese su usuario para continuar' : 'Responda la pregunta de seguridad'}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleUsernameSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ingrese su usuario"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Continuar
          </button>
        </form>
      ) : (
        <form onSubmit={handleRecoverySubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pregunta de Seguridad
            </label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <HelpCircle className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm text-gray-700">{securityQuestion}</p>
            </div>
          </div>

          <div>
            <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-700 mb-2">
              Respuesta
            </label>
            <input
              type="text"
              id="securityAnswer"
              name="securityAnswer"
              value={formData.securityAnswer}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Ingrese su respuesta"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ingrese nueva contraseña"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Confirme nueva contraseña"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PasswordRecovery;