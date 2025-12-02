import React, { useState } from 'react';
import { X, Copy, CheckCircle, Loader2, QrCode } from 'lucide-react';
import { saveReservation, updateReservation } from '../../services/firebase';
import { Reservation } from '../../types';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    startDate: Date | null;
    endDate: Date | null;
    totalPrice: number; // You might need to calculate this in the parent or here
}

interface BookingForm {
    firstName: string;
    lastName: string;
    email: string;
    cpf: string;
    whatsapp: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, startDate, endDate, totalPrice }) => {
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Form, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<BookingForm>({
        firstName: '',
        lastName: '',
        email: '',
        cpf: '',
        whatsapp: ''
    });
    const [paymentData, setPaymentData] = useState<{ qr_code: string; qr_code_base64: string } | null>(null);
    const [reservationId, setReservationId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreatePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Reservation in Firebase (Pending)
            if (!startDate || !endDate) return;

            const newReservation: Reservation = {
                guestName: `${formData.firstName} ${formData.lastName}`,
                guestPhone: formData.whatsapp,
                propertyId: 'lili',
                checkInDate: startDate.toISOString().split('T')[0],
                checkoutDate: endDate.toISOString().split('T')[0],
                checkInTime: '14:00', // Default
                checkOutTime: '11:00', // Default
                guestCount: 1, // Default for now
                paymentMethod: 'pix',
                status: 'pending',
                createdAt: new Date().toISOString(),
                email: formData.email,
                adminNotes: `Email: ${formData.email} | CPF: ${formData.cpf}`,
                welcomeMessage: '',
                lockCode: '',
                wifiSSID: '',
                wifiPass: '',
                safeCode: '',
                guestAlertActive: false,
                guestAlertText: ''
            };

            let id = reservationId;
            if (!id) {
                try {
                    id = await saveReservation(newReservation);
                    setReservationId(id);
                } catch (dbError) {
                    console.error('Error saving reservation:', dbError);
                    alert('Erro ao salvar reserva no banco de dados. Tente novamente.');
                    setLoading(false);
                    return;
                }
            }

            // 2. Generate Payment
            try {
                const response = await fetch('/api/create-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        transaction_amount: 0.01, // VALOR SIMBÓLICO PARA TESTE (R$ 0,01)
                        description: `Reserva Flat Lili - ${startDate?.toLocaleDateString()} a ${endDate?.toLocaleDateString()}`,
                        payer: {
                            email: formData.email,
                            first_name: formData.firstName,
                            last_name: formData.lastName,
                            identification: {
                                number: formData.cpf.replace(/\D/g, ''), // Remove non-digits
                            },
                        },
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setPaymentData(data);
                    setStep(2);
                } else {
                    alert('Erro ao gerar pagamento: ' + (data.error || 'Desconhecido'));
                }
            } catch (apiError) {
                console.error('Error creating payment API:', apiError);
                alert('Erro de conexão com o servidor de pagamentos.');
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('Erro inesperado.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (paymentData?.qr_code) {
            navigator.clipboard.writeText(paymentData.qr_code);
            alert('Código PIX copiado!');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-amber-700 p-4 flex justify-between items-center text-white">
                    <h3 className="font-serif font-bold text-lg">
                        {step === 1 && 'Confirmar Reserva'}
                        {step === 2 && 'Pagamento via PIX'}
                        {step === 3 && 'Reserva Confirmada!'}
                    </h3>
                    <button onClick={onClose} className="hover:bg-amber-800 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">

                    {/* STEP 1: FORM */}
                    {step === 1 && (
                        <form onSubmit={handleCreatePayment} className="space-y-4">
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <p className="text-sm text-gray-600">Resumo da Reserva:</p>
                                <div className="flex justify-between font-bold text-gray-900 mt-1">
                                    <span>{startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}</span>
                                    <span>R$ {totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
                                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="João" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Sobrenome</label>
                                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Silva" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">CPF</label>
                                <input required name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="000.000.000-00" />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="joao@email.com" />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp</label>
                                <input required name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="(00) 00000-0000" />
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-amber-700 text-white py-3 rounded-xl font-bold hover:bg-amber-800 transition-all shadow-lg flex justify-center items-center gap-2 mt-4">
                                {loading ? <Loader2 className="animate-spin" /> : 'Gerar Pagamento PIX'}
                            </button>
                        </form>
                    )}

                    {/* STEP 2: PAYMENT */}
                    {step === 2 && paymentData && (
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="bg-green-50 text-green-800 p-4 rounded-lg w-full">
                                <p className="font-bold">Reserva Pré-Confirmada!</p>
                                <p className="text-sm">Realize o pagamento para garantir suas datas.</p>
                            </div>

                            <div className="border-4 border-gray-900 rounded-xl p-2">
                                {/* Display Base64 Image if available, otherwise just icon */}
                                {paymentData.qr_code_base64 ? (
                                    <img src={`data:image/png;base64,${paymentData.qr_code_base64}`} alt="QR Code PIX" className="w-48 h-48 object-contain" />
                                ) : (
                                    <QrCode size={150} className="text-gray-900" />
                                )}
                            </div>

                            <div className="w-full">
                                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Código Copia e Cola</p>
                                <div className="flex gap-2">
                                    <input readOnly value={paymentData.qr_code} className="flex-1 bg-gray-100 border border-gray-200 rounded-lg p-2 text-xs font-mono text-gray-600 truncate" />
                                    <button onClick={copyToClipboard} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800 transition-colors">
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>

                            <button onClick={async () => {
                                if (reservationId) {
                                    await updateReservation(reservationId, { status: 'active' });
                                }
                                setStep(3);
                            }} className="text-amber-700 font-bold text-sm hover:underline">
                                Já realizei o pagamento
                            </button>
                        </div>
                    )}

                    {/* STEP 3: SUCCESS (Simulation) */}
                    {step === 3 && (
                        <div className="flex flex-col items-center text-center py-8 animate-fadeIn">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                                <CheckCircle size={48} />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Recebido!</h4>
                            <p className="text-gray-600 mb-8">Sua reserva está confirmada. Enviamos os detalhes para o seu email e WhatsApp.</p>

                            <button onClick={onClose} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg">
                                Fechar
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default BookingModal;
