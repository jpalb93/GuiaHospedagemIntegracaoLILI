import React from 'react';
import ReactDOM from 'react-dom';
import { Plane, X, Download } from 'lucide-react';
import { analytics } from '../../../utils/analytics';

interface CouponBoardingPassProps {
    isOpen: boolean;
    onClose: () => void;
    guestName?: string;
}

const CouponBoardingPass: React.FC<CouponBoardingPassProps> = ({
    isOpen,
    onClose,
    guestName = 'Hóspede',
}) => {
    if (!isOpen) return null;

    // Generate unique coupon code
    const firstName = guestName.split(' ')[0].toUpperCase();
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const couponCode = `LILI2024-${firstName}`;
    const ticketNumber = `#${randomCode}`;

    // Calculate 1 year validity
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const validityText = expiryDate.toLocaleDateString('pt-BR');

    // Track coupon generation
    React.useEffect(() => {
        if (isOpen) {
            analytics.trackCouponGenerated({
                guestName,
                couponCode,
            });
        }
    }, [isOpen, guestName, couponCode]);

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn" style={{ isolation: 'isolate' }}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scaleIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                    aria-label="Fechar"
                >
                    <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>

                {/* Title */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-heading">
                        🎫 Seu Cupom Está Pronto!
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tire um print desta tela e guarde para sua próxima estadia
                    </p>
                </div>

                {/* Boarding Pass Ticket */}
                <div className="relative mb-6">
                    {/* Main Ticket */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl overflow-hidden border-2 border-dashed border-orange-300 dark:border-orange-700 shadow-lg">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Plane size={20} className="rotate-45" />
                                <span className="font-bold text-sm uppercase tracking-wider">
                                    Boarding Pass
                                </span>
                            </div>
                            <span className="text-xs font-mono opacity-90">
                                {ticketNumber}
                            </span>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-4">
                            {/* Passenger */}
                            <div>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold mb-1">
                                    Passageiro
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                                    {guestName}
                                </p>
                            </div>

                            {/* Destination */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold mb-1">
                                        Destino
                                    </p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        Flat da Lili
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold mb-1">
                                        Desconto
                                    </p>
                                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                                        5% OFF
                                    </p>
                                </div>
                            </div>

                            {/* Coupon Code */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold mb-2 text-center">
                                    Código do Cupom
                                </p>
                                <p className="text-2xl font-mono font-bold text-center text-orange-600 dark:text-orange-400 tracking-wider">
                                    {couponCode}
                                </p>
                            </div>

                            {/* Validity */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 dark:text-gray-400">
                                    Validade:
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {validityText} (1 ano)
                                </span>
                            </div>

                            {/* Separator */}
                            <div className="border-t-2 border-dashed border-orange-300 dark:border-orange-700 my-4" />

                            {/* Instructions */}
                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                                <p className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1">
                                    ⚠️ IMPORTANTE:
                                </p>
                                <ul className="text-xs text-amber-800 dark:text-amber-400 space-y-1.5 leading-relaxed">
                                    <li>• Envie este cupom na sua próxima estadia</li>
                                    <li>• Via WhatsApp na próxima reserva</li>
                                </ul>
                            </div>

                            {/* Thank you */}
                            <div className="text-center pt-2">
                                <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                                    Obrigado pela avaliação! ⭐⭐⭐⭐⭐
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Barcode Effect (decorative) */}
                    <div className="mt-2 flex gap-[2px] justify-center opacity-50">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-1 bg-gray-800 dark:bg-gray-600"
                                style={{
                                    height: `${Math.random() * 20 + 10}px`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Fechar
                    </button>
                    <button
                        onClick={() => {
                            // Take screenshot hint
                            alert('📸 Tire um print desta tela agora!\n\nPressione o botão de print screen do seu celular.');
                        }}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        Salvar Cupom
                    </button>
                </div>

                {/* Bottom reminder */}
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                    💡 Guarde este cupom para apresentar na próxima reserva
                </p>
            </div>
        </div>
    );

    // Render modal using React Portal to ensure it's at document root
    return ReactDOM.createPortal(modalContent, document.body);
};

export default CouponBoardingPass;
