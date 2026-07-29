/**
 * VoiceTutor AI - Dynamic Stats & Complete Vocab/Scenarios Dataset Loader
 */

document.addEventListener('DOMContentLoaded', () => {

    // Web Audio API Amplifier
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
                console.warn("Web Audio API not supported");
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playLoudAudio(text, rate = 1.0, gainMultiplier = 2.0, onEndedCallback = null) {
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

        audio.play().catch(err => {
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

    // BUILT-IN VOCABULARY DATASET
    let VOCAB_DATA = {
        vocab850: [
            { word: "make", ipa: "/meɪk/", pos: "v.", cn: "制作；做；使得", cat: "ops", exEn: "Practice makes perfect.", exCn: "熟能生巧。" },
            { word: "come", ipa: "/kʌm/", pos: "v.", cn: "来；来到；到达", cat: "ops", exEn: "Come and join us for lunch!", exCn: "快来和我们一起吃午饭吧！" },
            { word: "go", ipa: "/ɡoʊ/", pos: "v.", cn: "去；前往；行走", cat: "ops", exEn: "Let's go for a walk outside.", exCn: "我们去外面散散步吧。" }
        ],
        vocab2000: [
            { word: "achieve", ipa: "/əˈtʃiːv/", pos: "v.", cn: "实现；达到", cat: "ops", exEn: "You can achieve your goal with persistence.", exCn: "坚持就能实现目标。" }
        ],
        vocab3000: [
            { word: "approximate", ipa: "/əˈprɑːksɪmət/", pos: "adj.", cn: "近似的；大概的", cat: "qualities", exEn: "What is the approximate cost of this project?", exCn: "这个项目的预计大概成本是多少？" }
        ]
    };

    let SCENARIOS = {
        casual: [
            {
                id: 'coffee',
                title: '☕ Ordering Coffee at Starbucks',
                subtitle: '星巴克点餐常用地道句型',
                sentences: [
                    {
                        en: "Hi, I'd like to order an iced oat milk latte, please.",
                        cn: "嗨，请给我点一杯冰燕麦奶拿铁。",
                        ipa: "/haɪ, aɪd laɪk tuː ˈɔːrdər ən aɪst oʊt mɪlk ˈlɑːteɪ, pliːz/",
                        vocab: [{ word: "oat milk", cn: "燕麦奶" }, { word: "iced latte", cn: "冰拿铁" }]
                    },
                    {
                        en: "Could I get that with less ice and a splash of vanilla syrup?",
                        cn: "可以少冰并加一点点香草糖浆吗？",
                        ipa: "/kʊd aɪ ɡet ðæt wɪð les aɪs ænd ə splæʃ əv vəˈnɪlə ˈsɪrəp/",
                        vocab: [{ word: "splash", cn: "少许" }, { word: "vanilla syrup", cn: "香草糖浆" }]
                    }
                ]
            }
        ],
        workplace: [],
        travel: [],
        idioms: []
    };

    // Load External vocab.json dataset
    async function loadExternalVocabDataset() {
        try {
            const res = await fetch('./data/vocab.json');
            if (res.ok) {
                const fetchedData = await res.json();
                if (fetchedData && fetchedData.vocab850) {
                    VOCAB_DATA = fetchedData;
                    currentVocabList = [...VOCAB_DATA[currentCategory]];
                    filteredVocabList = [...currentVocabList];
                    currentVocabIndex = 0;
                    renderFlashcard();
                    updateStatsUI();
                }
            }
        } catch (e) {
            console.warn("Using built-in dataset:", e);
        }
    }

    // Load External scenarios.json dataset
    async function loadExternalScenariosDataset() {
        try {
            const res = await fetch('./data/scenarios.json');
            if (res.ok) {
                const fetchedScenarios = await res.json();
                if (fetchedScenarios && fetchedScenarios.casual) {
                    SCENARIOS = fetchedScenarios;
                    if (!['vocab850', 'vocab2000', 'vocab3000', 'custom'].includes(currentCategory)) {
                        renderTopics();
                        renderSentenceCard();
                    }
                }
            }
        } catch (e) {
            console.warn("Using built-in scenarios dataset:", e);
        }
    }

    // State
    let currentCategory = 'vocab850';
    let currentTopicIndex = 0;
    let currentSentenceIndex = 0;
    let currentSpeed = 1.0;
    let currentVolume = 2.5;

    let currentVocabList = [...VOCAB_DATA.vocab850];
    let filteredVocabList = [...currentVocabList];
    let currentVocabIndex = 0;
    let isCardExpanded = true;

    // AUTO PLAY STATE
    let isAutoPlaying = false;
    let autoPlayTimer = null;
    let autoPlayInterval = 3000;

    let userStats = JSON.parse(localStorage.getItem('voicetutor_stats')) || {
        practicedCount: 0,
        totalAccuracy: 0,
        ratedCount: 0,
        masteredVocab: []
    };

    let syncToken = localStorage.getItem('voicetutor_sync_token') || "";

    // DOM Elements
    const accentSelect = document.getElementById('accentSelect');
    const volumeRange = document.getElementById('volumeRange');
    const volumeValText = document.getElementById('volumeValText');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const topicListEl = document.getElementById('topicList');

    const autoPlayToggleBtn = document.getElementById('autoPlayToggleBtn');
    const autoPlayIntervalSelect = document.getElementById('autoPlayIntervalSelect');
    const autoPlayReadExampleCheckbox = document.getElementById('autoPlayReadExampleCheckbox');

    const openSyncModalBtn = document.getElementById('openSyncModalBtn');
    const syncBadgeText = document.getElementById('syncBadgeText');
    const syncModal = document.getElementById('syncModal');
    const closeSyncModalBtn = document.getElementById('closeSyncModalBtn');
    const syncTokenInput = document.getElementById('syncTokenInput');
    const saveSyncTokenBtn = document.getElementById('saveSyncTokenBtn');
    const exportProgressBtn = document.getElementById('exportProgressBtn');
    const importProgressBtn = document.getElementById('importProgressBtn');
    const importFileInput = document.getElementById('importFileInput');

    const currentLevelTag = document.getElementById('currentLevelTag');
    const masteredVocabCountEl = document.getElementById('masteredVocabCount');
    const goalProgressPercentEl = document.getElementById('goalProgressPercent');

    const vocabModulePanel = document.getElementById('vocabModulePanel');
    const vocabSearchInput = document.getElementById('vocabSearchInput');
    const filterChips = document.querySelectorAll('.filter-chip');
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

    // Volume Listener
    if (volumeRange) {
        volumeRange.addEventListener('input', (e) => {
            currentVolume = parseFloat(e.target.value);
            const percent = Math.round(currentVolume * 100);
            volumeValText.innerText = `🔥 ${percent}% (加倍)`;
        });
    }

    function speakText(text, rate = currentSpeed, onEnded = null) {
        playLoudAudio(text, rate, currentVolume, onEnded);
    }

    // AUTO PLAY CONTROLLER
    function stopAutoPlay() {
        isAutoPlaying = false;
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
            autoPlayTimer = null;
        }
        if (autoPlayToggleBtn) {
            autoPlayToggleBtn.className = "btn btn-primary";
            autoPlayToggleBtn.innerHTML = `<i class="fa-solid fa-play"></i> 开启自动连续换卡`;
        }
    }

    function startAutoPlay() {
        isAutoPlaying = true;
        if (autoPlayToggleBtn) {
            autoPlayToggleBtn.className = "btn btn-secondary";
            autoPlayToggleBtn.innerHTML = `<i class="fa-solid fa-pause"></i> 暂停自动播放`;
        }
        playCurrentCardAndScheduleNext();
    }

    function playCurrentCardAndScheduleNext() {
        if (!isAutoPlaying || filteredVocabList.length === 0) return;

        const currentItem = filteredVocabList[currentVocabIndex];
        const shouldReadExample = autoPlayReadExampleCheckbox && autoPlayReadExampleCheckbox.checked;

        speakText(currentItem.word, currentSpeed, () => {
            if (!isAutoPlaying) return;

            if (shouldReadExample && currentItem.exEn) {
                setTimeout(() => {
                    if (!isAutoPlaying) return;
                    speakText(currentItem.exEn, currentSpeed, () => {
                        scheduleNextCard();
                    });
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

            if (currentVocabIndex < filteredVocabList.length - 1) {
                currentVocabIndex++;
            } else {
                currentVocabIndex = 0;
            }
            renderFlashcard();
            playCurrentCardAndScheduleNext();
        }, autoPlayInterval);
    }

    if (autoPlayToggleBtn) {
        autoPlayToggleBtn.addEventListener('click', () => {
            if (isAutoPlaying) {
                stopAutoPlay();
                showToast("已暂停自动连续换卡");
            } else {
                startAutoPlay();
                const exampleText = (autoPlayReadExampleCheckbox && autoPlayReadExampleCheckbox.checked) ? "（含例句朗读）" : "（仅单词朗读）";
                showToast(`▶️ 已开启自动连续朗读换卡 ${exampleText}！`);
            }
        });
    }

    if (autoPlayIntervalSelect) {
        autoPlayIntervalSelect.addEventListener('change', (e) => {
            autoPlayInterval = parseInt(e.target.value);
            showToast(`⏱️ 换卡间隔已设置为 ${autoPlayInterval / 1000} 秒`);
            if (isAutoPlaying) {
                stopAutoPlay();
                startAutoPlay();
            }
        });
    }

    // Flashcard Render
    function renderFlashcard() {
        if (filteredVocabList.length === 0) {
            cardWord.innerText = "No word found";
            cardIpa.innerText = "";
            cardCn.innerText = "未搜索到匹配单词";
            return;
        }

        const item = filteredVocabList[currentVocabIndex];
        let stageLabel = "Stage 1: 850 Core Words";
        if (currentCategory === 'vocab2000') stageLabel = "Stage 2: 2000 Daily Words";
        if (currentCategory === 'vocab3000') stageLabel = "Stage 3: 3000 Advanced Words";

        cardCategoryTag.innerText = `${stageLabel} (${currentVocabIndex + 1}/${filteredVocabList.length})`;
        cardWord.innerText = item.word;
        cardIpa.innerText = item.ipa;
        cardPos.innerText = item.pos;
        cardCn.innerText = item.cn;
        cardExEn.innerText = `"${item.exEn}"`;
        cardExCn.innerText = item.exCn;

        const isMastered = (userStats.masteredVocab || []).includes(item.word);
        if (isMastered) {
            masterWordBtn.className = "btn btn-primary";
            masterWordBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> 已掌握`;
        } else {
            masterWordBtn.className = "btn btn-outline";
            masterWordBtn.innerHTML = `<i class="fa-solid fa-check"></i> 标为已掌握`;
        }

        if (isCardExpanded) {
            cardBack.classList.remove('hidden');
            toggleCardFlipBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> 折叠释义例句`;
        } else {
            cardBack.classList.add('hidden');
            toggleCardFlipBtn.innerHTML = `<i class="fa-solid fa-eye"></i> 显示释义例句`;
        }
    }

    cardAudioBtn.addEventListener('click', () => {
        if (filteredVocabList.length > 0) speakText(filteredVocabList[currentVocabIndex].word);
    });

    cardExPlayBtn.addEventListener('click', () => {
        if (filteredVocabList.length > 0) speakText(filteredVocabList[currentVocabIndex].exEn);
    });

    toggleCardFlipBtn.addEventListener('click', () => {
        isCardExpanded = !isCardExpanded;
        renderFlashcard();
    });

    prevWordBtn.addEventListener('click', () => {
        if (currentVocabIndex > 0) {
            currentVocabIndex--;
            renderFlashcard();
        }
    });

    nextWordBtn.addEventListener('click', () => {
        if (currentVocabIndex < filteredVocabList.length - 1) {
            currentVocabIndex++;
            renderFlashcard();
        } else {
            showToast("🌟 当前分类词库已学习完毕！");
        }
    });

    masterWordBtn.addEventListener('click', () => {
        if (filteredVocabList.length === 0) return;
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

    vocabSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        filteredVocabList = currentVocabList.filter(item => 
            item.word.toLowerCase().includes(query) || item.cn.includes(query)
        );
        currentVocabIndex = 0;
        renderFlashcard();
    });

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const vcat = chip.dataset.vcat;
            if (vcat === 'all') {
                filteredVocabList = [...currentVocabList];
            } else if (vcat === 'unmastered') {
                filteredVocabList = currentVocabList.filter(item => !(userStats.masteredVocab || []).includes(item.word));
            } else {
                filteredVocabList = currentVocabList.filter(item => item.cat === vcat);
            }
            currentVocabIndex = 0;
            renderFlashcard();
        });
    });

    // RENDER TOPICS LIST IN SIDEBAR
    function renderTopics() {
        if (!topicListEl) return;
        topicListEl.innerHTML = '';
        const topics = SCENARIOS[currentCategory] || [];
        topics.forEach((tp, idx) => {
            const item = document.createElement('div');
            item.className = `topic-item ${idx === currentTopicIndex ? 'active' : ''}`;
            item.innerHTML = `
                <div class="topic-item-title">${tp.title}</div>
                <div class="topic-item-subtitle">${tp.subtitle} (${tp.sentences.length}句)</div>
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

    // RENDER SCENARIO SENTENCE CARD
    function renderSentenceCard() {
        const topics = SCENARIOS[currentCategory] || [];
        if (!topics || topics.length === 0) return;

        document.getElementById('topicBanner').classList.remove('hidden');
        document.getElementById('sentenceCard').classList.remove('hidden');
        document.getElementById('scriptPanel').classList.remove('hidden');

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
                    chip.className = 'chip';
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
            row.className = `script-line-item ${idx === currentSentenceIndex ? 'active' : ''}`;
            row.innerHTML = `
                <div>
                    <div class="line-en">${idx + 1}. ${st.en}</div>
                    <div class="line-cn">${st.cn}</div>
                </div>
                <button class="control-btn icon-only"><i class="fa-solid fa-volume-high"></i></button>
            `;
            row.addEventListener('click', (e) => {
                currentSentenceIndex = idx;
                renderSentenceCard();
                if (e.target.closest('.icon-only')) speakText(st.en);
            });
            scriptLinesList.appendChild(row);
        });
    }

    // SIDEBAR TAB CLICK HANDLER
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            stopAutoPlay();
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentCategory = btn.dataset.category;
            currentTopicIndex = 0;
            currentSentenceIndex = 0;

            if (['vocab850', 'vocab2000', 'vocab3000'].includes(currentCategory)) {
                currentVocabList = [...(VOCAB_DATA[currentCategory] || VOCAB_DATA.vocab850)];
                filteredVocabList = [...currentVocabList];
                currentVocabIndex = 0;
                vocabModulePanel.classList.remove('hidden');
                document.getElementById('topicBanner').classList.add('hidden');
                document.getElementById('sentenceCard').classList.add('hidden');
                document.getElementById('scriptPanel').classList.add('hidden');
                document.getElementById('customInputCard').classList.add('hidden');
                if (topicListEl) topicListEl.innerHTML = '';
                renderFlashcard();
            } else {
                vocabModulePanel.classList.add('hidden');
                if (currentCategory === 'custom') {
                    document.getElementById('customInputCard').classList.remove('hidden');
                    document.getElementById('topicBanner').classList.add('hidden');
                    document.getElementById('sentenceCard').classList.add('hidden');
                    document.getElementById('scriptPanel').classList.add('hidden');
                    if (topicListEl) topicListEl.innerHTML = '';
                } else {
                    document.getElementById('customInputCard').classList.add('hidden');
                    renderTopics();
                    renderSentenceCard();
                }
            }
            updateStatsUI();
        });
    });

    function saveStats(triggerSync = true) {
        localStorage.setItem('voicetutor_stats', JSON.stringify(userStats));
        updateStatsUI();
        if (triggerSync && syncToken) {
            syncToCloud();
        }
    }

    function updateFilterChipCounts() {
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
    }

    function updateStatsUI() {
        const totalInCurrentStage = (VOCAB_DATA[currentCategory] || []).length;
        const mastered = (userStats.masteredVocab || []).length;

        if (['vocab850', 'vocab2000', 'vocab3000'].includes(currentCategory)) {
            masteredVocabCountEl.innerText = `${mastered} / ${totalInCurrentStage}`;
        } else {
            masteredVocabCountEl.innerText = `${mastered} / 850`;
        }

        const percent = ((mastered / 3000) * 100).toFixed(1);
        goalProgressPercentEl.innerText = `${percent}%`;

        if (currentCategory === 'vocab850') currentLevelTag.innerText = `L1: 850核心词 (${totalInCurrentStage}词)`;
        else if (currentCategory === 'vocab2000') currentLevelTag.innerText = `L2: 2000日常词 (${totalInCurrentStage}词)`;
        else if (currentCategory === 'vocab3000') currentLevelTag.innerText = `L3: 3000黄金词 (${totalInCurrentStage}词)`;
        else currentLevelTag.innerText = "对话场景特训";

        updateFilterChipCounts();
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-info text-cyan"></i> ${msg}`;
        document.getElementById('toastContainer').appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    // Sentence Card Audio Controls (Red Box Buttons)
    const playSentenceBtn = document.getElementById('playSentenceBtn');
    const slowPlayBtn = document.getElementById('slowPlayBtn');
    const prevSentenceBtn = document.getElementById('prevSentenceBtn');
    const nextSentenceBtn = document.getElementById('nextSentenceBtn');

    if (playSentenceBtn) {
        playSentenceBtn.addEventListener('click', () => {
            const topics = SCENARIOS[currentCategory] || [];
            if (topics.length > 0 && topics[currentTopicIndex] && topics[currentTopicIndex].sentences[currentSentenceIndex]) {
                const text = topics[currentTopicIndex].sentences[currentSentenceIndex].en;
                speakText(text, currentSpeed);
            }
        });
    }

    if (slowPlayBtn) {
        slowPlayBtn.addEventListener('click', () => {
            const topics = SCENARIOS[currentCategory] || [];
            if (topics.length > 0 && topics[currentTopicIndex] && topics[currentTopicIndex].sentences[currentSentenceIndex]) {
                const text = topics[currentTopicIndex].sentences[currentSentenceIndex].en;
                speakText(text, 0.5);
            }
        });
    }

    if (prevSentenceBtn) {
        prevSentenceBtn.addEventListener('click', () => {
            if (currentSentenceIndex > 0) {
                currentSentenceIndex--;
                renderSentenceCard();
            } else {
                showToast("已是当前话题的首句");
            }
        });
    }

    if (nextSentenceBtn) {
        nextSentenceBtn.addEventListener('click', () => {
            const topics = SCENARIOS[currentCategory] || [];
            if (topics.length > 0 && topics[currentTopicIndex]) {
                const totalSentences = topics[currentTopicIndex].sentences.length;
                if (currentSentenceIndex < totalSentences - 1) {
                    currentSentenceIndex++;
                    renderSentenceCard();
                } else {
                    showToast("🌟 当前话题所有句子已朗读完毕！");
                }
            }
        });
    }

    // Web Speech Recognition for Recording Assessment
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
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            isRecording = true;
            if (recordLabel) recordLabel.innerText = "正在倾听中，请朗读上述英文...";
            if (recordingWave) recordingWave.classList.remove('hidden');
            if (micStatusBadge) micStatusBadge.innerHTML = `<i class="fa-solid fa-microphone text-rose"></i> 正在录音测评中...`;
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            showToast(`🎙️ 识别到您的发音: "${transcript}"`);

            let target = "";
            if (['vocab850', 'vocab2000', 'vocab3000'].includes(currentCategory)) {
                if (filteredVocabList[currentVocabIndex]) target = filteredVocabList[currentVocabIndex].word;
            } else {
                const topics = SCENARIOS[currentCategory] || [];
                if (topics[currentTopicIndex] && topics[currentTopicIndex].sentences[currentSentenceIndex]) {
                    target = topics[currentTopicIndex].sentences[currentSentenceIndex].en;
                }
            }

            if (target) {
                const similarity = calculateSimilarity(transcript.toLowerCase(), target.toLowerCase());
                const score = Math.round(similarity * 100);
                if (score >= 80) {
                    showToast(`🌟 完美发音！匹配度: ${score}%`);
                } else if (score >= 50) {
                    showToast(`👍 良好发音！匹配度: ${score}%，继续加油！`);
                } else {
                    showToast(`💡 匹配度: ${score}%，建议点击朗读多听几遍。`);
                }
            }
        };

        recognition.onerror = (e) => {
            console.warn("Speech recognition error:", e.error);
            stopRecordingUI();
            if (e.error === 'not-allowed') {
                showToast("⚠️ 请在浏览器弹窗中允许使用麦克风权限！");
            }
        };

        recognition.onend = () => {
            stopRecordingUI();
        };
    }

    function stopRecordingUI() {
        isRecording = false;
        if (recordLabel) recordLabel.innerText = "点击朗读当前单词或句子";
        if (recordingWave) recordingWave.classList.add('hidden');
        if (micStatusBadge) micStatusBadge.innerHTML = `<i class="fa-solid fa-microphone"></i> 麦克风准备就绪`;
    }

    if (recordBtn) {
        recordBtn.addEventListener('click', () => {
            if (!recognition) {
                showToast("⚠️ 当前浏览器不支持语音识别，推荐使用 Chrome 或 Edge 浏览器");
                return;
            }
            if (isRecording) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                } catch (err) {
                    recognition.stop();
                }
            }
        });
    }

    function calculateSimilarity(str1, str2) {
        const words1 = str1.replace(/[^a-z0-9\s]/g, '').split(/\s+/);
        const words2 = str2.replace(/[^a-z0-9\s]/g, '').split(/\s+/);
        let matches = 0;
        words1.forEach(w => {
            if (words2.includes(w)) matches++;
        });
        return matches / Math.max(words1.length, words2.length, 1);
    }

    // Load External Vocab & Scenarios Datasets
    loadExternalVocabDataset();
    loadExternalScenariosDataset();
    renderFlashcard();
});
