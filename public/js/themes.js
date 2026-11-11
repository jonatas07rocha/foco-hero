// --- DEFINIÇÃO DOS TEMAS ---
// Este arquivo contém a definição de todos os temas da aplicação.
// O efeito glass foi aplicado a todos os temas.
export const themes = {
    // Região Norte
    acre_dark: {
        name: 'AC Escuro',
        '--color-primary-rgb': '0, 128, 0',
        '--color-primary-focus-rgb': '0, 100, 0',
        '--color-primary-darker-rgb': '0, 70, 0',
        '--color-primary-light-rgb': '50, 180, 50',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(31, 41, 55, 0.75)',    // Original: #1F2937
        '--color-bg-panel': 'rgba(17, 24, 39, 0.7)',     // Original: #111827
        '--color-bg-input': 'rgba(55, 65, 81, 0.7)',     // Original: #374151
        '--color-bg-input-light': 'rgba(75, 85, 99, 0.7)', // Original: #4B5563
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 0',
        '--color-break-long': '255, 0, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    alagoas_light: {
        name: 'AL Claro',
        '--color-primary-rgb': '0, 0, 139',
        '--color-primary-focus-rgb': '0, 0, 115',
        '--color-primary-darker-rgb': '0, 0, 90',
        '--color-primary-light-rgb': '50, 50, 180',
        '--color-bg-main': '#F0F8FF',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(248, 248, 255, 0.7)',  // Original: #F8F8FF
        '--color-bg-input': 'rgba(232, 240, 248, 0.7)',  // Original: #E8F0F8
        '--color-bg-input-light': 'rgba(220, 230, 240, 0.7)', // Original: #DCE6F0
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 0, 0',
        '--color-break-long': '255, 255, 255',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    amapa_dark: {
        name: 'AP Escuro',
        '--color-primary-rgb': '255, 204, 0',
        '--color-primary-focus-rgb': '230, 180, 0',
        '--color-primary-darker-rgb': '200, 150, 0',
        '--color-primary-light-rgb': '255, 220, 70',
        '--color-bg-main': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(17, 17, 17, 0.75)',    // Original: #111111
        '--color-bg-panel': 'rgba(0, 0, 0, 0.7)',        // Original: #000000
        '--color-bg-input': 'rgba(34, 34, 34, 0.7)',     // Original: #222222
        '--color-bg-input-light': 'rgba(51, 51, 51, 0.7)', // Original: #333333
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '0, 0, 139',
        '--color-break-long': '0, 128, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    amazonas_light: {
        name: 'AM Claro',
        '--color-primary-rgb': '0, 0, 139',
        '--color-primary-focus-rgb': '0, 0, 115',
        '--color-primary-darker-rgb': '0, 0, 90',
        '--color-primary-light-rgb': '50, 50, 180',
        '--color-bg-main': '#F9FAFB',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(243, 244, 246, 0.7)',  // Original: #F3F4F6
        '--color-bg-input': 'rgba(255, 255, 255, 0.7)',  // Original: #FFFFFF
        '--color-bg-input-light': 'rgba(229, 231, 235, 0.7)', // Original: #E5E7EB
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 0, 0',
        '--color-break-long': '255, 255, 255',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    bahia_dark: {
        name: 'BA Escuro',
        '--color-primary-rgb': '204, 0, 0',
        '--color-primary-focus-rgb': '170, 0, 0',
        '--color-primary-darker-rgb': '140, 0, 0',
        '--color-primary-light-rgb': '230, 30, 30',
        '--color-bg-main': 'radial-gradient(circle at center, #003366 0%, #000033 70%)',
        '--color-bg-shell': 'rgba(0, 42, 92, 0.75)',    // Original: #002A5C
        '--color-bg-panel': 'rgba(0, 26, 58, 0.7)',     // Original: #001A3A
        '--color-bg-input': 'rgba(0, 64, 128, 0.7)',    // Original: #004080
        '--color-bg-input-light': 'rgba(0, 80, 160, 0.7)', // Original: #0050A0
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 255',
        '--color-break-long': '0, 51, 102',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    brasil_dark: {
        name: 'BR Escuro',
        '--color-primary-rgb': '0, 155, 58',
        '--color-primary-focus-rgb': '0, 130, 48',
        '--color-primary-darker-rgb': '0, 100, 38',
        '--color-primary-light-rgb': '77, 184, 108',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(31, 41, 55, 0.75)',    // Original: #1F2937
        '--color-bg-panel': 'rgba(17, 24, 39, 0.7)',     // Original: #111827
        '--color-bg-input': 'rgba(55, 65, 81, 0.7)',     // Original: #374151
        '--color-bg-input-light': 'rgba(75, 85, 99, 0.7)', // Original: #4B5563
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 221, 0',
        '--color-break-long': '0, 39, 118',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    brasil_light: {
        name: 'BR Claro',
        '--color-primary-rgb': '255, 221, 0',
        '--color-primary-focus-rgb': '230, 199, 0',
        '--color-primary-darker-rgb': '200, 170, 0',
        '--color-primary-light-rgb': '255, 235, 77',
        '--color-bg-main': '#FEFCE8',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(255, 251, 235, 0.7)',  // Original: #FFFBEB
        '--color-bg-input': 'rgba(247, 250, 252, 0.7)',  // Original: #F7FAFC
        '--color-bg-input-light': 'rgba(237, 242, 247, 0.7)', // Original: #EDF2F7
        '--color-text-base': '#4A5568',
        '--color-text-header': '#1A202C',
        '--color-text-muted': '#718096',
        '--color-text-placeholder': '#A0AEC0',
        '--color-text-timer': '#1A202C',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 155, 58',
        '--color-break-long': '0, 39, 118',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    ceara_dark: {
        name: 'CE Escuro',
        '--color-primary-rgb': '0, 0, 205',
        '--color-primary-focus-rgb': '0, 0, 180',
        '--color-primary-darker-rgb': '0, 0, 150',
        '--color-primary-light-rgb': '50, 50, 255',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(31, 41, 55, 0.75)',    // Original: #1F2937
        '--color-bg-panel': 'rgba(17, 24, 39, 0.7)',     // Original: #111827
        '--color-bg-input': 'rgba(55, 65, 81, 0.7)',     // Original: #374151
        '--color-bg-input-light': 'rgba(75, 85, 99, 0.7)', // Original: #4B5563
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '0, 128, 0',
        '--color-break-long': '255, 255, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    distritofederal_dark: {
        name: 'DF Escuro',
        '--color-primary-rgb': '0, 128, 0',
        '--color-primary-focus-rgb': '0, 100, 0',
        '--color-primary-darker-rgb': '0, 70, 0',
        '--color-primary-light-rgb': '50, 180, 50',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(31, 41, 55, 0.75)',    // Original: #1F2937
        '--color-bg-panel': 'rgba(17, 24, 39, 0.7)',     // Original: #111827
        '--color-bg-input': 'rgba(55, 65, 81, 0.7)',     // Original: #374151
        '--color-bg-input-light': 'rgba(75, 85, 99, 0.7)', // Original: #4B5563
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 0',
        '--color-break-long': '255, 255, 255',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    espiritosanto_light: {
        name: 'ES Claro',
        '--color-primary-rgb': '255, 105, 180',
        '--color-primary-focus-rgb': '230, 80, 150',
        '--color-primary-darker-rgb': '200, 60, 120',
        '--color-primary-light-rgb': '255, 130, 200',
        '--color-bg-main': '#F0F8FF',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(248, 248, 255, 0.7)',  // Original: #F8F8FF
        '--color-bg-input': 'rgba(232, 240, 248, 0.7)',  // Original: #E8F0F8
        '--color-bg-input-light': 'rgba(220, 230, 240, 0.7)', // Original: #DCE6F0
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 255, 255',
        '--color-break-long': '0, 0, 255',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    goias_light: {
        name: 'GO Claro',
        '--color-primary-rgb': '255, 255, 0',
        '--color-primary-focus-rgb': '230, 230, 0',
        '--color-primary-darker-rgb': '200, 200, 0',
        '--color-primary-light-rgb': '255, 255, 77',
        '--color-bg-main': '#F9FAFB',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(243, 244, 246, 0.7)',  // Original: #F3F4F6
        '--color-bg-input': 'rgba(255, 255, 255, 0.7)',  // Original: #FFFFFF
        '--color-bg-input-light': 'rgba(229, 231, 235, 0.7)', // Original: #E5E7EB
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 128, 0',
        '--color-break-long': '255, 255, 255',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    maranhao_dark: {
        name: 'MA Escuro',
        '--color-primary-rgb': '220, 20, 60',
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '240, 50, 90',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(31, 41, 55, 0.75)',    // Original: #1F2937
        '--color-bg-panel': 'rgba(17, 24, 39, 0.7)',     // Original: #111827
        '--color-bg-input': 'rgba(55, 65, 81, 0.7)',     // Original: #374151
        '--color-bg-input-light': 'rgba(75, 85, 99, 0.7)', // Original: #4B5563
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 255',
        '--color-break-long': '0, 0, 139',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    matogrosso_dark: {
        name: 'MT Escuro',
        '--color-primary-rgb': '255, 204, 0',
        '--color-primary-focus-rgb': '230, 180, 0',
        '--color-primary-darker-rgb': '200, 150, 0',
        '--color-primary-light-rgb': '255, 220, 70',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(31, 41, 55, 0.75)',    // Original: #1F2937
        '--color-bg-panel': 'rgba(17, 24, 39, 0.7)',     // Original: #111827
        '--color-bg-input': 'rgba(55, 65, 81, 0.7)',     // Original: #374151
        '--color-bg-input-light': 'rgba(75, 85, 99, 0.7)', // Original: #4B5563
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '0, 128, 0',
        '--color-break-long': '0, 0, 139',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    matogrossodosul_light: {
        name: 'MS Claro',
        '--color-primary-rgb': '0, 0, 139',
        '--color-primary-focus-rgb': '0, 0, 115',
        '--color-primary-darker-rgb': '0, 0, 90',
        '--color-primary-light-rgb': '50, 50, 180',
        '--color-bg-main': '#F0F8FF',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(248, 248, 255, 0.7)',  // Original: #F8F8FF
        '--color-bg-input': 'rgba(232, 240, 248, 0.7)',  // Original: #E8F0F8
        '--color-bg-input-light': 'rgba(220, 230, 240, 0.7)', // Original: #DCE6F0
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 128, 0',
        '--color-break-long': '255, 255, 255',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    minasgerais_light: {
        name: 'MG Claro',
        '--color-primary-rgb': '200, 16, 46',
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '220, 40, 70',
        '--color-bg-main': '#F9FAFB',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(243, 244, 246, 0.7)',  // Original: #F3F4F6
        '--color-bg-input': 'rgba(255, 255, 255, 0.7)',  // Original: #FFFFFF
        '--color-bg-input-light': 'rgba(229, 231, 235, 0.7)', // Original: #E5E7EB
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '10, 185, 129',
        '--color-break-long': '139, 92, 246',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    para_dark: {
        name: 'PA Escuro',
        '--color-primary-rgb': '220, 20, 60',
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '240, 50, 90',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(31, 41, 55, 0.75)',    // Original: #1F2937
        '--color-bg-panel': 'rgba(17, 24, 39, 0.7)',     // Original: #111827
        '--color-bg-input': 'rgba(55, 65, 81, 0.7)',     // Original: #374151
        '--color-bg-input-light': 'rgba(75, 85, 99, 0.7)', // Original: #4B5563
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 255',
        '--color-break-long': '0, 0, 139',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    paraiba_dark: {
        name: 'PB Escuro',
        '--color-primary-rgb': '200, 16, 46',
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '220, 40, 70',
        '--color-bg-main': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(17, 17, 17, 0.75)',    // Original: #111111
        '--color-bg-panel': 'rgba(0, 0, 0, 0.7)',        // Original: #000000
        '--color-bg-input': 'rgba(34, 34, 34, 0.7)',     // Original: #222222
        '--color-bg-input-light': 'rgba(51, 51, 51, 0.7)', // Original: #333333
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '0, 0, 0',
        '--color-break-long': '255, 255, 255',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    parana_dark: {
        name: 'PR Escuro',
        '--color-primary-rgb': '0, 0, 205',
        '--color-primary-focus-rgb': '0, 0, 180',
        '--color-primary-darker-rgb': '0, 0, 150',
        '--color-primary-light-rgb': '50, 50, 255',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(31, 41, 55, 0.75)',    // Original: #1F2937
        '--color-bg-panel': 'rgba(17, 24, 39, 0.7)',     // Original: #111827
        '--color-bg-input': 'rgba(55, 65, 81, 0.7)',     // Original: #374151
        '--color-bg-input-light': 'rgba(75, 85, 99, 0.7)', // Original: #4B5563
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 255',
        '--color-break-long': '0, 128, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    pernambuco_light: {
        name: 'PE Claro',
        '--color-primary-rgb': '255, 255, 0',
        '--color-primary-focus-rgb': '230, 230, 0',
        '--color-primary-darker-rgb': '200, 200, 0',
        '--color-primary-light-rgb': '255, 255, 77',
        '--color-bg-main': '#F0F8FF',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(248, 248, 255, 0.7)',  // Original: #F8F8FF
        '--color-bg-input': 'rgba(232, 240, 248, 0.7)',  // Original: #E8F0F8
        '--color-bg-input-light': 'rgba(220, 230, 240, 0.7)', // Original: #DCE6F0
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 0, 0',
        '--color-break-long': '0, 0, 205',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    piaui_light: {
        name: 'PI Claro',
        '--color-primary-rgb': '255, 255, 0',
        '--color-primary-focus-rgb': '230, 230, 0',
        '--color-primary-darker-rgb': '200, 200, 0',
        '--color-primary-light-rgb': '255, 255, 77',
        '--color-bg-main': '#F9FAFB',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(243, 244, 246, 0.7)',  // Original: #F3F4F6
        '--color-bg-input': 'rgba(255, 255, 255, 0.7)',  // Original: #FFFFFF
        '--color-bg-input-light': 'rgba(229, 231, 235, 0.7)', // Original: #E5E7EB
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 128, 0',
        '--color-break-long': '0, 0, 255',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    riodejaneiro_light: {
        name: 'RJ Claro',
        '--color-primary-rgb': '0, 42, 140',
        '--color-primary-focus-rgb': '0, 35, 115',
        '--color-primary-darker-rgb': '0, 28, 90',
        '--color-primary-light-rgb': '50, 80, 180',
        '--color-bg-main': '#F0F8FF',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(248, 248, 255, 0.7)',  // Original: #F8F8FF
        '--color-bg-input': 'rgba(232, 240, 248, 0.7)',  // Original: #E8F0F8
        '--color-bg-input-light': 'rgba(220, 230, 240, 0.7)', // Original: #DCE6F0
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 221, 0',
        '--color-break-long': '200, 16, 46',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    riograndedonorte_light: {
        name: 'RN Claro',
        '--color-primary-rgb': '255, 221, 0',
        '--color-primary-focus-rgb': '230, 199, 0',
        '--color-primary-darker-rgb': '200, 170, 0',
        '--color-primary-light-rgb': '255, 235, 77',
        '--color-bg-main': '#F9FAFB',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(243, 244, 246, 0.7)',  // Original: #F3F4F6
        '--color-bg-input': 'rgba(255, 255, 255, 0.7)',  // Original: #FFFFFF
        '--color-bg-input-light': 'rgba(229, 231, 235, 0.7)', // Original: #E5E7EB
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 128, 0',
        '--color-break-long': '255, 0, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    riograndedosul_dark: {
        name: 'RS Escuro',
        '--color-primary-rgb': '200, 16, 46',
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '220, 40, 70',
        '--color-bg-main': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(17, 17, 17, 0.75)',    // Original: #111111
        '--color-bg-panel': 'rgba(0, 0, 0, 0.7)',        // Original: #000000
        '--color-bg-input': 'rgba(34, 34, 34, 0.7)',     // Original: #222222
        '--color-bg-input-light': 'rgba(51, 51, 51, 0.7)', // Original: #333333
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '0, 128, 0',
        '--color-break-long': '255, 255, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    rondonia_dark: {
        name: 'RO Escuro',
        '--color-primary-rgb': '0, 128, 0',
        '--color-primary-focus-rgb': '0, 100, 0',
        '--color-primary-darker-rgb': '0, 70, 0',
        '--color-primary-light-rgb': '50, 180, 50',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(31, 41, 55, 0.75)',    // Original: #1F2937
        '--color-bg-panel': 'rgba(17, 24, 39, 0.7)',     // Original: #111827
        '--color-bg-input': 'rgba(55, 65, 81, 0.7)',     // Original: #374151
        '--color-bg-input-light': 'rgba(75, 85, 99, 0.7)', // Original: #4B5563
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 0',
        '--color-break-long': '0, 0, 139',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    roraima_light: {
        name: 'RR Claro',
        '--color-primary-rgb': '255, 204, 0',
        '--color-primary-focus-rgb': '230, 180, 0',
        '--color-primary-darker-rgb': '200, 150, 0',
        '--color-primary-light-rgb': '255, 220, 70',
        '--color-bg-main': '#F9FAFB',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(243, 244, 246, 0.7)',  // Original: #F3F4F6
        '--color-bg-input': 'rgba(255, 255, 255, 0.7)',  // Original: #FFFFFF
        '--color-bg-input-light': 'rgba(229, 231, 235, 0.7)', // Original: #E5E7EB
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 0, 255',
        '--color-break-long': '255, 0, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    santacatarina_light: {
        name: 'SC Claro',
        '--color-primary-rgb': '220, 20, 60',
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '240, 50, 90',
        '--color-bg-main': '#F0F8FF',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(248, 248, 255, 0.7)',  // Original: #F8F8FF
        '--color-bg-input': 'rgba(232, 240, 248, 0.7)',  // Original: #E8F0F8
        '--color-bg-input-light': 'rgba(220, 230, 240, 0.7)', // Original: #DCE6F0
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 255, 255',
        '--color-break-long': '0, 0, 139',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    saopaulo_dark: {
        name: 'SP Escuro',
        '--color-primary-rgb': '200, 16, 46',
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '220, 40, 70',
        '--color-bg-main': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(17, 17, 17, 0.75)',    // Original: #111111
        '--color-bg-panel': 'rgba(0, 0, 0, 0.7)',        // Original: #000000
        '--color-bg-input': 'rgba(34, 34, 34, 0.7)',     // Original: #222222
        '--color-bg-input-light': 'rgba(51, 51, 51, 0.7)', // Original: #333333
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 255',
        '--color-break-long': '0, 0, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    sergipe_dark: {
        name: 'SE Escuro',
        '--color-primary-rgb': '0, 128, 0',
        '--color-primary-focus-rgb': '0, 100, 0',
        '--color-primary-darker-rgb': '0, 70, 0',
        '--color-primary-light-rgb': '50, 180, 50',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': 'rgba(31, 41, 55, 0.75)',    // Original: #1F2937
        '--color-bg-panel': 'rgba(17, 24, 39, 0.7)',     // Original: #111827
        '--color-bg-input': 'rgba(55, 65, 81, 0.7)',     // Original: #374151
        '--color-bg-input-light': 'rgba(75, 85, 99, 0.7)', // Original: #4B5563
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 0',
        '--color-break-long': '0, 0, 255',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    tocantins_light: {
        name: 'TO Claro',
        '--color-primary-rgb': '255, 221, 0',
        '--color-primary-focus-rgb': '230, 199, 0',
        '--color-primary-darker-rgb': '200, 170, 0',
        '--color-primary-light-rgb': '255, 235, 77',
        '--color-bg-main': '#F0F8FF',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-bg-panel': 'rgba(248, 248, 255, 0.7)',  // Original: #F8F8FF
        '--color-bg-input': 'rgba(232, 240, 248, 0.7)',  // Original: #E8F0F8
        '--color-bg-input-light': 'rgba(220, 230, 240, 0.7)', // Original: #DCE6F0
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 0, 139',
        '--color-break-long': '255, 255, 255',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },

    // Coleção Paisagens Brasileiras
    natureza_floresta: {
        name: 'Floresta',
        '--color-primary-rgb': '34, 139, 34',
        '--color-primary-focus-rgb': '0, 100, 0',
        '--color-bg-main': '#2F4F4F',
        '--color-bg-shell': 'rgba(1, 50, 32, 0.75)',     // Original: #013220
        '--color-text-base': '#E0E0E0',
        '--color-text-header': '#FFFFFF',
        '--color-break-short': '255, 215, 0',
        '--color-break-long': '139, 69, 19',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    natureza_cerrado: {
        name: 'Cerrado',
        '--color-primary-rgb': '255, 140, 0',
        '--color-bg-main': '#FFF8E1',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-text-base': '#5D4037',
        '--color-text-header': '#4E342E',
        '--color-break-short': '76, 175, 80',
        '--color-break-long': '121, 85, 72',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    natureza_praias: {
        name: 'Praias',
        '--color-primary-rgb': '0, 191, 255',
        '--color-bg-main': '#E0FFFF',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-text-base': '#006064',
        '--color-text-header': '#004D40',
        '--color-break-short': '255, 238, 88',
        '--color-break-long': '255, 167, 38',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    natureza_pantanal: {
        name: 'Pantanal',
        '--color-primary-rgb': '100, 181, 246',
        '--color-bg-main': '#1B5E20',
        '--color-bg-shell': 'rgba(46, 125, 50, 0.75)',   // Original: #2E7D32
        '--color-text-base': '#C8E6C9',
        '--color-text-header': '#FFFFFF',
        '--color-break-short': '255, 241, 118',
        '--color-break-long': '121, 85, 72',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },

    // Coleção Abstratos & Minimalistas
    zen_light: {
        name: 'Zen',
        '--color-primary-rgb': '176, 190, 197',
        '--color-bg-main': '#ECEFF1',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-text-base': '#546E7A',
        '--color-text-header': '#37474F',
        '--color-break-short': '129, 212, 250',
        '--color-break-long': '165, 214, 167',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    abstrato_energia: {
        name: 'Energia',
        '--color-primary-rgb': '255, 64, 129',
        '--color-bg-main': 'linear-gradient(45deg, #FF4081, #F50057, #D500F9)',
        '--color-bg-shell': 'rgba(26, 26, 26, 0.75)',    // Original: #1A1A1A
        '--color-text-base': '#E0E0E0',
        '--color-text-header': '#FFFFFF',
        '--color-break-short': '100, 221, 23',
        '--color-break-long': '255, 171, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    abstrato_estrelas: {
        name: 'Estrelas',
        '--color-primary-rgb': '236, 239, 241',
        '--color-bg-main': 'radial-gradient(ellipse at bottom, #020111 0%, #191970 100%)',
        '--color-bg-shell': 'rgba(0, 0, 51, 0.75)',      // Original: #000033
        '--color-text-base': '#CFD8DC',
        '--color-text-header': '#FFFFFF',
        '--color-break-short': '173, 216, 230',
        '--color-break-long': '255, 250, 205',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    abstrato_aquarela: {
        name: 'Aquarela',
        '--color-primary-rgb': '126, 87, 194',
        '--color-bg-main': '#F3E5F5',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-text-base': '#6A1B9A',
        '--color-text-header': '#4A148C',
        '--color-break-short': '79, 195, 247',
        '--color-break-long': '255, 204, 128',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },

    // Coleção Tecnologia & Ficção Científica
    tech_matrix: {
        name: 'Matrix',
        '--color-primary-rgb': '57, 255, 20',
        '--color-bg-main': '#000000',
        '--color-bg-shell': 'rgba(13, 13, 13, 0.75)',    // Original: #0D0D0D
        '--color-text-base': '#39FF14',
        '--color-text-header': '#FFFFFF',
        '--color-break-short': '200, 200, 200',
        '--color-break-long': '100, 100, 100',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    tech_vaporwave: {
        name: 'Vaporwave',
        '--color-primary-rgb': '255, 105, 180',
        '--color-bg-main': 'linear-gradient(to bottom right, #2c003e, #5a004a)',
        '--color-bg-shell': 'rgba(26, 0, 36, 0.75)',     // Original: #1a0024
        '--color-text-base': '#f0e6ff',
        '--color-text-header': '#FFFFFF',
        '--color-break-short': '0, 255, 255',
        '--color-break-long': '255, 255, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    tech_hightech: {
        name: 'High-Tech',
        '--color-primary-rgb': '0, 123, 255',
        '--color-bg-main': '#F8F9FA',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-text-base': '#495057',
        '--color-text-header': '#212529',
        '--color-break-short': '40, 167, 69',
        '--color-break-long': '255, 193, 7',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    tech_cyberpunk: {
        name: 'Cyberpunk',
        '--color-primary-rgb': '255, 0, 255',
        '--color-bg-main': '#0c0c1c',
        '--color-bg-shell': 'rgba(20, 20, 60, 0.75)',    // Original: #14143c
        '--color-text-base': '#A0A0FF',
        '--color-text-header': '#FFFFFF',
        '--color-break-short': '0, 255, 255',
        '--color-break-long': '255, 255, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },

    // --- TEMAS SAZONAIS ---
    seasonal_carnaval: {
        name: 'Carnaval',
        '--color-primary-rgb': '255, 215, 0',
        '--color-bg-main': 'linear-gradient(45deg, #4CAF50, #2196F3, #F44336, #FFEB3B)',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.55)', // Original: #FFFFFF
        '--color-text-base': '#212121',
        '--color-text-header': '#000000',
        '--color-break-short': '3, 169, 244',
        '--color-break-long': '76, 175, 80',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    seasonal_festa_junina: {
        name: 'Festa Junina',
        '--color-primary-rgb': '255, 87, 34',
        '--color-bg-main': '#F5DEB3',
        '--color-bg-shell': 'rgba(255, 248, 220, 0.7)',  // Original: #FFF8DC
        '--color-text-base': '#8B4513',
        '--color-text-header': '#A0522D',
        '--color-break-short': '220, 20, 60',
        '--color-break-long': '34, 139, 34',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.6)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    seasonal_halloween: {
        name: 'Halloween',
        '--color-primary-rgb': '255, 152, 0',
        '--color-bg-main': '#212121',
        '--color-bg-shell': 'rgba(26, 26, 26, 0.75)',    // Original: #1A1A1A
        '--color-text-base': '#E0E0E0',
        '--color-text-header': '#FFFFFF',
        '--color-break-short': '103, 58, 183',
        '--color-break-long': '76, 175, 80',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
    seasonal_natal: {
        name: 'Natal',
        '--color-primary-rgb': '211, 47, 47',
        '--color-bg-main': '#1B5E20',
        '--color-bg-shell': 'rgba(46, 125, 50, 0.75)',   // Original: #2E7D32
        '--color-text-base': '#E8F5E9',
        '--color-text-header': '#FFFFFF',
        '--color-break-short': '255, 215, 0',
        '--color-break-long': '255, 255, 255',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(16px)',
    },

    // --- COLEÇÃO GLASS --- (Mantidos como originais)
    glass_dark: {
        name: 'Glass Escuro',
        '--color-primary-rgb': '0, 191, 255',
        '--color-primary-focus-rgb': '0, 160, 220',
        '--color-primary-darker-rgb': '0, 130, 180',
        '--color-primary-light-rgb': '80, 210, 255',
        '--color-bg-main': 'linear-gradient(135deg, #1D2B64 0%, #F8CDDA 100%)',
        '--color-bg-shell': 'rgba(25, 25, 40, 0.65)',
        '--color-bg-panel': 'rgba(17, 24, 39, 0.7)',
        '--color-bg-input': 'rgba(55, 65, 81, 0.7)',
        '--color-bg-input-light': 'rgba(75, 85, 99, 0.7)',
        '--color-text-base': '#F3F4F6',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#A0AEC0',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 221, 0',
        '--color-break-long': '255, 0, 0',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.15)',
        '--backdrop-filter-glass': 'blur(20px)',
    },
    glass_light: {
        name: 'Glass Claro',
        '--color-primary-rgb': '200, 16, 120',
        '--color-primary-focus-rgb': '180, 14, 100',
        '--color-primary-darker-rgb': '150, 10, 80',
        '--color-primary-light-rgb': '220, 50, 150',
        '--color-bg-main': 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
        '--color-bg-shell': 'rgba(255, 255, 255, 0.45)',
        '--color-bg-panel': 'rgba(248, 248, 255, 0.6)',
        '--color-bg-input': 'rgba(255, 255, 255, 0.6)',
        '--color-bg-input-light': 'rgba(229, 231, 235, 0.6)',
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#4A5568',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 0, 0',
        '--color-break-long': '0, 0, 139',
        '--border-glass': '1px solid rgba(255, 255, 255, 0.8)',
        '--backdrop-filter-glass': 'blur(16px)',
    },
};
