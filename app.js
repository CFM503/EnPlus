/**
 * VoiceTutor AI v2.0 - Complete Interactive Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    // Web Audio API Hardware Volume Amplifier
    let audioCtx = null;
    let gainNode = null;
    let currentAudioElement = null;

    function getAudioContext() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                gainNode = audioCtx.createGain();
                gainNode.connect(audioCtx.destination);
            } catch (e) {
                console.warn("Web Audio API not supported:", e);
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playLoudAudio(text, rate = 1.0, gainMultiplier = 2.5, onEndedCallback = null) {
        getAudioContext();

        if (currentAudioElement) {
            currentAudioElement.pause();
            currentAudioElement.currentTime = 0;
        }

        const sanitizedText = text.replace(/\[.*?\]|\/.*?\/|\(.*?\)/g, '').replace(/[^a-zA-Z0-9\s,'\.\!\?\-]/g, '').trim();
        if (!sanitizedText) {
            if (onEndedCallback) onEndedCallback();
            return;
        }

        const accentSelect = document.getElementById('accentSelect');
        const accentType = (accentSelect && accentSelect.value === 'en-GB') ? '1' : '2';
        const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(sanitizedText)}&type=${accentType}`;

        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = audioUrl;
        audio.playbackRate = rate;
        currentAudioElement = audio;

        if (audioCtx && gainNode) {
            try {
                const source = audioCtx.createMediaElementSource(audio);
                source.connect(gainNode);
                gainNode.gain.setValueAtTime(gainMultiplier, audioCtx.currentTime);
            } catch (err) {}
        }

        if (onEndedCallback) {
            audio.onended = onEndedCallback;
        }

        audio.play().catch(() => {
            speakWebSpeechFallback(sanitizedText, rate, gainMultiplier, onEndedCallback);
        });
    }

    function speakWebSpeechFallback(text, rate, gainMultiplier, onEndedCallback = null) {
        const synth = window.speechSynthesis;
        if (synth.speaking) synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.volume = Math.min(1.0, gainMultiplier);
        utterance.lang = 'en-US';
        if (onEndedCallback) utterance.onend = onEndedCallback;
        synth.speak(utterance);
    }

    // STATE
    let VOCAB_DATA = { vocab850: [], vocab2000: [], vocab3000: [] };
    let SCENARIOS = { casual: [], workplace: [], travel: [], idioms: [], vocab_examples: [] };

    let currentCategory = 'vocab850';
    let currentTopicIndex = 0;
    let currentSentenceIndex = 0;
    let currentSpeed = 1.0;
    let currentVolume = 2.5;

    let currentVocabList = [];
    let filteredVocabList = [];
    let currentVocabIndex = 0;
    let isCardExpanded = true;

    let isAutoPlaying = false;
    let autoPlayTimer = null;
    let autoPlayInterval = 3000;

    let userStats = JSON.parse(localStorage.getItem('voicetutor_stats')) || {
        practicedCount: 0,
        masteredVocab: []
    };

    // DOM ELEMENTS
    const volumeRange = document.getElementById('volumeRange');
    const volumeValText = document.getElementById('volumeValText');

    const navBtns = document.querySelectorAll('.nav-btn');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const chipBtns = document.querySelectorAll('.chip-btn');

    const topicListEl = document.getElementById('topicList');
    const currentLevelTag = document.getElementById('currentLevelTag');

    const vocabModulePanel = document.getElementById('vocabModulePanel');
    const vocabSearchInput = document.getElementById('vocabSearchInput');

    const autoPlayToggleBtn = document.getElementById('autoPlayToggleBtn');
    const autoPlayIntervalSelect = document.getElementById('autoPlayIntervalSelect');
    const autoPlayReadExampleCheckbox = document.getElementById('autoPlayReadExampleCheckbox');

    const mainFlashcard = document.getElementById('mainFlashcard');
    const cardCategoryTag = document.getElementById('cardCategoryTag');
    const cardWord = document.getElementById('cardWord');
    const cardIpa = document.getElementById('cardIpa');
    const cardAudioBtn = document.getElementById('cardAudioBtn');
    const cardBack = document.getElementById('cardBack');
    const cardPos = document.getElementById('cardPos');
    const cardCn = document.getElementById('cardCn');
    const cardExEn = document.getElementById('cardExEn');
    const cardExCn = document.getElementById('cardExCn');
    const cardExPlayBtn = document.getElementById('cardExPlayBtn');

    const prevWordBtn = document.getElementById('prevWordBtn');
    const nextWordBtn = document.getElementById('nextWordBtn');
    const toggleCardFlipBtn = document.getElementById('toggleCardFlipBtn');
    const masterWordBtn = document.getElementById('masterWordBtn');

    const topicBanner = document.getElementById('topicBanner');
    const sentenceCard = document.getElementById('sentenceCard');
    const scriptPanel = document.getElementById('scriptPanel');
    const customInputCard = document.getElementById('customInputCard');

    const playSentenceBtn = document.getElementById('playSentenceBtn');
    const slowPlayBtn = document.getElementById('slowPlayBtn');
    const prevSentenceBtn = document.getElementById('prevSentenceBtn');
    const nextSentenceBtn = document.getElementById('nextSentenceBtn');

    // VOLUME AMPLIFIER LISTENER
    if (volumeRange) {
        volumeRange.addEventListener('input', (e) => {
            currentVolume = parseFloat(e.target.value);
            const percent = Math.round(currentVolume * 100);
            if (volumeValText) volumeValText.innerText = `🔥 ${percent}% (音量加倍)`;
        });
    }

    function speakText(text, rate = currentSpeed, onEnded = null) {
        playLoudAudio(text, rate, currentVolume, onEnded);
    }

    // LOAD EXTERNAL DATASETS
    async function loadExternalDatasets() {
        try {
            const [vRes, sRes] = await Promise.all([
                fetch('./data/vocab.json'),
                fetch('./data/scenarios.json')
            ]);

            if (vRes.ok) {
                VOCAB_DATA = await vRes.json();
                currentVocabList = [...(VOCAB_DATA[currentCategory] || [])];
                filteredVocabList = [...currentVocabList];
                currentVocabIndex = 0;
            }

            if (sRes.ok) {
                SCENARIOS = await sRes.json();
            }

            renderFlashcard();
            updateStatsAndChips();
        } catch (e) {
            console.warn("Dataset load error:", e);
        }
    }

    // FLASHCARD RENDER
    function renderFlashcard() {
        if (!filteredVocabList || filteredVocabList.length === 0) {
            if (cardWord) cardWord.innerText = "No word found";
            if (cardIpa) cardIpa.innerText = "";
            if (cardCn) cardCn.innerText = "未搜索到匹配单词";
            return;
        }

        const item = filteredVocabList[currentVocabIndex];
        let stageLabel = "Stage 1: 850 Core Words";
        if (currentCategory === 'vocab2000') stageLabel = "Stage 2: 2000 Daily Words";
        if (currentCategory === 'vocab3000') stageLabel = "Stage 3: 3000 Advanced Words";

        if (cardCategoryTag) cardCategoryTag.innerText = `${stageLabel} (${currentVocabIndex + 1}/${filteredVocabList.length})`;
        if (cardWord) cardWord.innerText = item.word;
        if (cardIpa) cardIpa.innerText = item.ipa || '';
        if (cardPos) cardPos.innerText = item.pos || '';
        if (cardCn) cardCn.innerText = item.cn || '';
        if (cardExEn) cardExEn.innerText = item.exEn ? `"${item.exEn}"` : '';
        if (cardExCn) cardExCn.innerText = item.exCn || '';

        const isMastered = (userStats.masteredVocab || []).includes(item.word);
        if (masterWordBtn) {
            if (isMastered) {
                masterWordBtn.className = "btn-action active";
                masterWordBtn.innerHTML = `<i class="fa-solid fa-circle-check text-emerald"></i> 已掌握`;
            } else {
                masterWordBtn.className = "btn-action";
                masterWordBtn.innerHTML = `<i class="fa-solid fa-check"></i> 标为已掌握`;
            }
        }

        if (cardBack) {
            if (isCardExpanded) {
                cardBack.classList.remove('hidden');
                if (toggleCardFlipBtn) toggleCardFlipBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> 折叠释义`;
            } else {
                cardBack.classList.add('hidden');
                if (toggleCardFlipBtn) toggleCardFlipBtn.innerHTML = `<i class="fa-solid fa-eye"></i> 显示释义`;
            }
        }
    }

    if (cardAudioBtn) cardAudioBtn.addEventListener('click', () => { if (filteredVocabList[currentVocabIndex]) speakText(filteredVocabList[currentVocabIndex].word); });
    if (cardExPlayBtn) cardExPlayBtn.addEventListener('click', () => { if (filteredVocabList[currentVocabIndex] && filteredVocabList[currentVocabIndex].exEn) speakText(filteredVocabList[currentVocabIndex].exEn); });

    if (toggleCardFlipBtn) toggleCardFlipBtn.addEventListener('click', () => { isCardExpanded = !isCardExpanded; renderFlashcard(); });
    if (prevWordBtn) prevWordBtn.addEventListener('click', () => { if (currentVocabIndex > 0) { currentVocabIndex--; renderFlashcard(); } });
    if (nextWordBtn) nextWordBtn.addEventListener('click', () => { if (currentVocabIndex < filteredVocabList.length - 1) { currentVocabIndex++; renderFlashcard(); } else showToast("🌟 当前分类词库已刷完！"); });

    if (masterWordBtn) {
        masterWordBtn.addEventListener('click', () => {
            if (!filteredVocabList[currentVocabIndex]) return;
            const word = filteredVocabList[currentVocabIndex].word;
            if (!userStats.masteredVocab) userStats.masteredVocab = [];

            if (userStats.masteredVocab.includes(word)) {
                userStats.masteredVocab = userStats.masteredVocab.filter(w => w !== word);
                showToast(`已取消 ${word} 的掌握标记`);
            } else {
                userStats.masteredVocab.push(word);
                showToast(`🎉 成功掌握核心词: ${word}`);
            }
            saveStats();
            renderFlashcard();
        });
    }

    // SEARCH & FILTER CHIPS
    if (vocabSearchInput) {
        vocabSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filteredVocabList = currentVocabList.filter(item => item.word.toLowerCase().includes(query) || (item.cn && item.cn.includes(query)));
            currentVocabIndex = 0;
            renderFlashcard();
        });
    }

    chipBtns.forEach(chip => {
        chip.addEventListener('click', () => {
            chipBtns.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const vcat = chip.dataset.vcat;
            if (vcat === 'all') filteredVocabList = [...currentVocabList];
            else if (vcat === 'unmastered') filteredVocabList = currentVocabList.filter(item => !(userStats.masteredVocab || []).includes(item.word));
            else filteredVocabList = currentVocabList.filter(item => item.cat === vcat);
            currentVocabIndex = 0;
            renderFlashcard();
        });
    });

    // AUTOPLAY CONTROLLER
    function stopAutoPlay() {
        isAutoPlaying = false;
        if (autoPlayTimer) { clearTimeout(autoPlayTimer); autoPlayTimer = null; }
        if (autoPlayToggleBtn) {
            autoPlayToggleBtn.innerHTML = `<i class="fa-solid fa-play"></i> 开启自动连续换卡`;
        }
    }

    function startAutoPlay() {
        isAutoPlaying = true;
        if (autoPlayToggleBtn) {
            autoPlayToggleBtn.innerHTML = `<i class="fa-solid fa-pause"></i> 暂停自动播放`;
        }
        playCurrentCardAndScheduleNext();
    }

    function playCurrentCardAndScheduleNext() {
        if (!isAutoPlaying || filteredVocabList.length === 0) return;
        const item = filteredVocabList[currentVocabIndex];
        const shouldReadExample = autoPlayReadExampleCheckbox && autoPlayReadExampleCheckbox.checked;

        speakText(item.word, currentSpeed, () => {
            if (!isAutoPlaying) return;
            if (shouldReadExample && item.exEn) {
                setTimeout(() => {
                    if (!isAutoPlaying) return;
                    speakText(item.exEn, currentSpeed, () => scheduleNextCard());
                }, 400);
            } else {
                scheduleNextCard();
            }
        });
    }

    function scheduleNextCard() {
        if (!isAutoPlaying) return;
        autoPlayTimer = setTimeout(() => {
            if (!isAutoPlaying) return;
            if (currentVocabIndex < filteredVocabList.length - 1) currentVocabIndex++;
            else currentVocabIndex = 0;
            renderFlashcard();
            playCurrentCardAndScheduleNext();
        }, autoPlayInterval);
    }

    if (autoPlayToggleBtn) {
        autoPlayToggleBtn.addEventListener('click', () => {
            if (isAutoPlaying) { stopAutoPlay(); showToast("已暂停自动播放"); }
            else { startAutoPlay(); showToast("▶️ 已开启自动连续换卡！"); }
        });
    }

    if (autoPlayIntervalSelect) {
        autoPlayIntervalSelect.addEventListener('change', (e) => {
            autoPlayInterval = parseInt(e.target.value);
            if (isAutoPlaying) { stopAutoPlay(); startAutoPlay(); }
        });
    }

    // SCENARIOS & SENTENCES RENDER
    function renderTopics() {
        if (!topicListEl) return;
        topicListEl.innerHTML = '';
        const topics = SCENARIOS[currentCategory] || [];
        topics.forEach((tp, idx) => {
            const item = document.createElement('div');
            item.className = `topic-item ${idx === currentTopicIndex ? 'active' : ''}`;
            item.innerHTML = `
                <div class="topic-item-title">${tp.title}</div>
                <div class="topic-item-sub">${tp.subtitle} (${tp.sentences.length}句)</div>
            `;
            item.addEventListener('click', () => {
                currentTopicIndex = idx;
                currentSentenceIndex = 0;
                renderTopics();
                renderSentenceCard();
            });
            topicListEl.appendChild(item);
        });
    }

    function renderSentenceCard() {
        const topics = SCENARIOS[currentCategory] || [];
        if (!topics || topics.length === 0) return;

        if (topicBanner) topicBanner.classList.remove('hidden');
        if (sentenceCard) sentenceCard.classList.remove('hidden');
        if (scriptPanel) scriptPanel.classList.remove('hidden');

        const topic = topics[currentTopicIndex];
        const sentence = topic.sentences[currentSentenceIndex];

        document.getElementById('currentTopicTitle').innerText = topic.title;
        document.getElementById('currentTopicDesc').innerText = topic.subtitle;
        document.getElementById('progressText').innerText = `句子 ${currentSentenceIndex + 1} / ${topic.sentences.length}`;
        document.getElementById('progressFill').style.width = `${((currentSentenceIndex + 1) / topic.sentences.length) * 100}%`;

        document.getElementById('ipaLine').innerText = sentence.ipa || '';
        document.getElementById('targetSentence').innerText = sentence.en;
        document.getElementById('cnTranslation').innerText = sentence.cn;

        const vocabChips = document.getElementById('vocabChips');
        if (vocabChips) {
            vocabChips.innerHTML = '';
            if (sentence.vocab) {
                sentence.vocab.forEach(v => {
                    const chip = document.createElement('span');
                    chip.style.cssText = "background: rgba(99, 102, 241, 0.15); color: var(--primary-indigo); padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700;";
                    chip.innerHTML = `<strong>${v.word}</strong> [${v.cn}]`;
                    vocabChips.appendChild(chip);
                });
            }
        }
        renderScriptList(topic);
    }

    function renderScriptList(topic) {
        const scriptLinesList = document.getElementById('scriptLinesList');
        if (!scriptLinesList) return;

        scriptLinesList.innerHTML = '';
        topic.sentences.forEach((st, idx) => {
            const row = document.createElement('div');
            row.style.cssText = `display: flex; align-items: center; justify-content: space-between; padding: 12px; border-radius: var(--radius-md); background: ${idx === currentSentenceIndex ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${idx === currentSentenceIndex ? 'var(--accent-cyan)' : 'var(--border-light)'}; cursor: pointer;`;
            row.innerHTML = `
                <div>
                    <div style="font-size: 14px; font-weight: 700; color: #fff;">${idx + 1}. ${st.en}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">${st.cn}</div>
                </div>
                <button class="btn-action" style="padding: 6px 12px;"><i class="fa-solid fa-volume-high text-cyan"></i></button>
            `;
            row.addEventListener('click', () => {
                currentSentenceIndex = idx;
                renderSentenceCard();
                speakText(st.en);
            });
            scriptLinesList.appendChild(row);
        });
    }

    // SENTENCE CONTROLS (RED BOX BUTTONS)
    if (playSentenceBtn) {
        playSentenceBtn.addEventListener('click', () => {
            const topics = SCENARIOS[currentCategory] || [];
            if (topics[currentTopicIndex] && topics[currentTopicIndex].sentences[currentSentenceIndex]) {
                speakText(topics[currentTopicIndex].sentences[currentSentenceIndex].en, currentSpeed);
            }
        });
    }

    if (slowPlayBtn) {
        slowPlayBtn.addEventListener('click', () => {
            const topics = SCENARIOS[currentCategory] || [];
            if (topics[currentTopicIndex] && topics[currentTopicIndex].sentences[currentSentenceIndex]) {
                speakText(topics[currentTopicIndex].sentences[currentSentenceIndex].en, 0.5);
            }
        });
    }

    if (prevSentenceBtn) {
        prevSentenceBtn.addEventListener('click', () => {
            if (currentSentenceIndex > 0) { currentSentenceIndex--; renderSentenceCard(); }
            else showToast("已是当前话题的首句");
        });
    }

    if (nextSentenceBtn) {
        nextSentenceBtn.addEventListener('click', () => {
            const topics = SCENARIOS[currentCategory] || [];
            if (topics[currentTopicIndex]) {
                if (currentSentenceIndex < topics[currentTopicIndex].sentences.length - 1) {
                    currentSentenceIndex++;
                    renderSentenceCard();
                } else showToast("🌟 当前话题所有句子已朗读完毕！");
            }
        });
    }

    // SIDEBAR NAV BUTTONS LISTENER
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            stopAutoPlay();
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentCategory = btn.dataset.category;
            currentTopicIndex = 0;
            currentSentenceIndex = 0;

            if (['vocab850', 'vocab2000', 'vocab3000'].includes(currentCategory)) {
                currentVocabList = [...(VOCAB_DATA[currentCategory] || [])];
                filteredVocabList = [...currentVocabList];
                currentVocabIndex = 0;

                vocabModulePanel.classList.remove('hidden');
                if (topicBanner) topicBanner.classList.add('hidden');
                if (sentenceCard) sentenceCard.classList.add('hidden');
                if (scriptPanel) scriptPanel.classList.add('hidden');
                if (customInputCard) customInputCard.classList.add('hidden');
                if (topicListEl) topicListEl.innerHTML = '';

                renderFlashcard();
            } else {
                vocabModulePanel.classList.add('hidden');
                if (currentCategory === 'custom') {
                    if (customInputCard) customInputCard.classList.remove('hidden');
                    if (topicBanner) topicBanner.classList.add('hidden');
                    if (sentenceCard) sentenceCard.classList.add('hidden');
                    if (scriptPanel) scriptPanel.classList.add('hidden');
                    if (topicListEl) topicListEl.innerHTML = '';
                } else {
                    if (customInputCard) customInputCard.classList.add('hidden');
                    renderTopics();
                    renderSentenceCard();
                }
            }
            updateStatsAndChips();
        });
    });

    // iOS Bottom Tab Bar Event Listener (Mobile Users)
    const mobileTabItems = document.querySelectorAll('.ios-tab-item');
    mobileTabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            stopAutoPlay();
            mobileTabItems.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const mcat = tab.dataset.mobileCategory;
            currentCategory = mcat;
            currentTopicIndex = 0;
            currentSentenceIndex = 0;

            navBtns.forEach(b => {
                if (b.dataset.category === mcat) b.classList.add('active');
                else b.classList.remove('active');
            });

            if (['vocab850', 'vocab2000', 'vocab3000'].includes(currentCategory)) {
                currentVocabList = [...(VOCAB_DATA[currentCategory] || [])];
                filteredVocabList = [...currentVocabList];
                currentVocabIndex = 0;

                vocabModulePanel.classList.remove('hidden');
                if (topicBanner) topicBanner.classList.add('hidden');
                if (sentenceCard) sentenceCard.classList.add('hidden');
                if (scriptPanel) scriptPanel.classList.add('hidden');
                if (customInputCard) customInputCard.classList.add('hidden');
                if (topicListEl) topicListEl.innerHTML = '';

                renderFlashcard();
            } else {
                vocabModulePanel.classList.add('hidden');
                if (currentCategory === 'custom') {
                    if (customInputCard) customInputCard.classList.remove('hidden');
                    if (topicBanner) topicBanner.classList.add('hidden');
                    if (sentenceCard) sentenceCard.classList.add('hidden');
                    if (scriptPanel) scriptPanel.classList.add('hidden');
                    if (topicListEl) topicListEl.innerHTML = '';
                } else {
                    if (customInputCard) customInputCard.classList.add('hidden');
                    renderTopics();
                    renderSentenceCard();
                }
            }
            updateStatsAndChips();
        });
    });

    // MODE BUTTONS LISTENER
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(m => m.classList.remove('active'));
            btn.classList.add('active');
            showToast(`已切换至 ${btn.innerText} 模式`);
        });
    });

    // STATS & FILTER CHIP COUNTS UPDATE
    function updateStatsAndChips() {
        const list = VOCAB_DATA[currentCategory] || [];
        const mastered = userStats.masteredVocab || [];

        const cntAll = list.length;
        const cntOps = list.filter(item => item.cat === 'ops').length;
        const cntThings = list.filter(item => item.cat === 'things').length;
        const cntQualities = list.filter(item => item.cat === 'qualities').length;
        const cntUnmastered = list.filter(item => !mastered.includes(item.word)).length;

        const elAll = document.getElementById('cntAll');
        const elOps = document.getElementById('cntOps');
        const elThings = document.getElementById('cntThings');
        const elQualities = document.getElementById('cntQualities');
        const elUnmastered = document.getElementById('cntUnmastered');

        if (elAll) elAll.innerText = cntAll;
        if (elOps) elOps.innerText = cntOps;
        if (elThings) elThings.innerText = cntThings;
        if (elQualities) elQualities.innerText = cntQualities;
        if (elUnmastered) elUnmastered.innerText = cntUnmastered;

        if (currentLevelTag) {
            if (currentCategory === 'vocab850') currentLevelTag.innerText = `L1: 850核心词 (${cntAll}词)`;
            else if (currentCategory === 'vocab2000') currentLevelTag.innerText = `L2: 2000日常词 (${cntAll}词)`;
            else if (currentCategory === 'vocab3000') currentLevelTag.innerText = `L3: 3000黄金词 (${cntAll}词)`;
            else currentLevelTag.innerText = "美式口语特训";
        }
    }

    function saveStats() {
        localStorage.setItem('voicetutor_stats', JSON.stringify(userStats));
        updateStatsAndChips();
    }

    function showToast(msg) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-info text-cyan"></i> ${msg}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    // SPEECH RECOGNITION STUDIO
    const recordBtn = document.getElementById('recordBtn');
    const recordLabel = document.getElementById('recordLabel');
    const recordingWave = document.getElementById('recordingWave');
    const micStatusBadge = document.getElementById('micStatusBadge');
    let recognition = null;
    let isRecording = false;

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
            isRecording = true;
            if (recordLabel) recordLabel.innerText = "正在倾听中，请朗读上述英文...";
            if (recordingWave) recordingWave.classList.remove('hidden');
            if (micStatusBadge) micStatusBadge.innerHTML = `<i class="fa-solid fa-microphone text-rose"></i> 正在录音测评中...`;
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            showToast(`🎙️ 识别发音: "${transcript}"`);
        };

        recognition.onerror = () => stopRecordingUI();
        recognition.onend = () => stopRecordingUI();
    }

    function stopRecordingUI() {
        isRecording = false;
        if (recordLabel) recordLabel.innerText = "点击朗读当前单词或句子";
        if (recordingWave) recordingWave.classList.add('hidden');
        if (micStatusBadge) micStatusBadge.innerHTML = `<i class="fa-solid fa-microphone"></i> 麦克风准备就绪`;
    }

    if (recordBtn) {
        recordBtn.addEventListener('click', () => {
            if (!recognition) { showToast("⚠️ 请使用 Chrome 或 Edge 浏览器体验完整发音测评功能"); return; }
            if (isRecording) recognition.stop();
            else try { recognition.start(); } catch (err) { recognition.stop(); }
        });
    }

    // INITIALIZE DATASETS
    loadExternalDatasets();
});
