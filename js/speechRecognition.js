import { showToast } from './utils.js';

let activeRecognition = null;
let lastInsertedText = '';

export function initSpeechRecognition(targetInputId, triggerButtonId) {
    const targetInput = document.getElementById(targetInputId);
    const triggerButton = document.getElementById(triggerButtonId);
    const livePreviewEl = document.getElementById(`live-preview-${targetInputId}`);
    const globalPreviewEl = document.getElementById('dictado-preview-global');

    const micIconSrc = 'assets/icons/mic.svg';
    const stopIconSrc = 'assets/icons/pause.svg';

    let isRecording = false;
    let silenceTimeout;
    const silenceDelay = 3000;

    if (!('webkitSpeechRecognition' in window)) {
        showToast('Tu navegador no soporta el reconocimiento de voz.', 'danger');
        triggerButton.style.display = 'none';
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    const setMicIcon = (isActive) => {
        triggerButton.innerHTML = `<img src="${isActive ? stopIconSrc : micIconSrc}" alt="${isActive ? 'Detener' : 'Micrófono'}" class="icon-btn">`;
        triggerButton.classList.toggle('recording', isActive);
    };

    const resetUI = () => {
        setMicIcon(false);
        triggerButton.disabled = false;
        isRecording = false;
        clearTimeout(silenceTimeout);
        if (livePreviewEl) livePreviewEl.textContent = '';
        if (globalPreviewEl) {
            globalPreviewEl.textContent = '';
            globalPreviewEl.classList.remove('visible');
        }
    };

    const stopRecording = (reason = '') => {
        if (!isRecording) return;
        recognition.stop();
        resetUI();
        showToast(`Grabación detenida${reason ? ' por ' + reason : ''}.`, 'info');
    };

    setMicIcon(false);

    triggerButton.addEventListener('click', () => {
        if (isRecording) {
            stopRecording('usuario');
        } else {
            if (activeRecognition && activeRecognition !== recognition) {
                activeRecognition.stop();
            }
            recognition.start();
            activeRecognition = recognition;
            setMicIcon(true);
            isRecording = true;
            showToast('Escuchando...', 'info');
        }
    });

    recognition.onaudiostart = () => clearTimeout(silenceTimeout);

    recognition.onaudioend = () => {
        silenceTimeout = setTimeout(() => stopRecording('silencio'), silenceDelay);
    };

    const formatText = (text, isTitle = false) => {
        text = text.trim();

        // Reemplazo de comandos por símbolos
        const replacements = {
            'signo de interrogación': '?',
            'signo de exclamación': '!',
            'punto y coma': ';',
            'punto': '.',
            'coma': ',',
            'dos puntos': ':',
            'abrir paréntesis': '(',
            'cerrar paréntesis': ')',
            'comillas': '"',
            'comillas simples': "'"
        };

        for (const [cmd, sym] of Object.entries(replacements)) {
            text = text.replace(new RegExp(cmd, 'gi'), sym);
        }

        // Detectar "nueva línea" y reemplazar por saltos reales
        text = text.replace(/nueva línea/gi, '\n');

        // Capitalizar letras después de punto o salto de línea
        text = text.replace(/(^|[\.\n]\s*)([a-zñáéíóú])/g, (match, prefix, char) => prefix + char.toUpperCase());

        if (!isTitle) {
            // Agregar viñetas y punto al final
            text = text.split('\n').map(line => {
                const clean = line.trim();
                if (!clean) return '';
                let capitalized = capitalizeFirst(clean);
                if (!capitalized.endsWith('.')) capitalized += '.';
                return `• ${capitalized}`;
            }).join('\n');
        } else {
            // Solo capitalizar el título
            text = capitalizeFirst(text);
        }

        return text.trim();
    };

    const capitalizeFirst = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };


    const capitalizeBullet = (line) => {
        return line.replace(/^(-\s*)([a-zñáéíóú])/, (_, dash, letter) => dash + letter.toUpperCase());
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript.trim();
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript + ' ';
            }
        }

        if (finalTranscript) {
            const isTitle = targetInputId.includes('title');
            const current = targetInput.value.trim();

            // Comando especial: "borrar último"
            if (finalTranscript.toLowerCase().includes('borrar último')) {
                if (lastInsertedText) {
                    targetInput.value = current.replace(lastInsertedText, '').trim();
                    targetInput.dispatchEvent(new Event('input'));
                    lastInsertedText = '';
                    showToast('Último fragmento borrado por voz.', 'warning');
                } else {
                    showToast('No hay fragmento anterior para borrar.', 'info');
                }
                return;
            }

            const formatted = formatText(finalTranscript.trim(), isTitle);
            const needsSpace = current.length > 0 && !current.endsWith('\n') && !current.endsWith(' ');
            const finalText = (current ? current + '\n' : '') + formatted;

            targetInput.value = finalText;
            lastInsertedText = formatted;
            targetInput.dispatchEvent(new Event('input'));
        }

        if (livePreviewEl) livePreviewEl.textContent = interimTranscript;

        if (globalPreviewEl) {
            globalPreviewEl.textContent = interimTranscript;
            globalPreviewEl.classList.toggle('visible', interimTranscript.trim().length > 0);
        }
    };

    recognition.onend = () => {
        if (isRecording) showToast('Grabación finalizada.', 'info');
        activeRecognition = null;
        resetUI();
    };

    recognition.onerror = (event) => {
        showToast(`Error en el reconocimiento de voz: ${event.error}`, 'danger');
        resetUI();
    };

    window.addEventListener('beforeunload', () => {
        if (isRecording) recognition.stop();
    });
}
