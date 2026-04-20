export const DEFAULT_CONFIG = {
    TIMES: {
        OPEN_DEFAULT: '08:00',
        CLOSE_DEFAULT: '22:00',
        CHECKIN_DEFAULT: '14:00',
        CHECKOUT_DEFAULT: '12:00'
    },
    STATUS_OPTIONS: [
        { value: 'Open', label: 'Beroperasi (Open)' },
        { value: 'Closed', label: 'Tutup Sementara (Closed)' },
        { value: 'Under Renovation', label: 'Dalam Renovasi' }
    ],
    THEME_COLORS: {
        RESTORAN: 'blue',
        ALAM: 'green',
        ACCOMMODATION: 'indigo',
        HEALTHCARE: 'red',
        EDUCATION: 'orange'
    }
};
