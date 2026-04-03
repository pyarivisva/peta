export default function FeedbackModal({ isOpen, title, message, isConfirm, onClose, onConfirm }) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(3px)' }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '320px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', textAlign: 'center', animation: 'fadeIn 0.2s ease-in-out' }}>
        
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>
                    {isConfirm ? '⚠️' : 'ℹ️'}
                </div>
            
                <h3 style={{ marginTop: 0, color: '#333', fontSize: '20px' }}>{title}</h3>
                <p style={{ color: '#666', marginBottom: '30px', fontSize: '15px', lineHeight: '1.5' }}>{message}</p>
            
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    {isConfirm && (
                        <button onClick={onClose} style={{ padding: '10px 20px', border: 'none', background: '#f0f0f0', color: '#555', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>
                        Batal
                        </button>
                    )}
                    <button onClick={handleConfirm} style={{ padding: '10px 20px', border: 'none', background: isConfirm ? '#ff4d4f' : '#1890ff', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>
                        {isConfirm ? 'Ya, Lanjutkan' : 'Mengerti'}
                    </button>
                </div>
            </div>
        </div>
    )
}