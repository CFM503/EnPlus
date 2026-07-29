/**
 * VoiceTutor AI - Dynamic Stats & Complete Vocab Dataset Loader
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
            { word: "go", ipa: "/ɡoʊ/", pos: "v.", cn: "去；前往；行走", cat: "ops", exEn: "Let's go for a walk outside.", exCn: "我们去外面散散步吧。" },
            { word: "get", ipa: "/ɡet/", pos: "v.", cn: "获得；变得；到达", cat: "ops", exEn: "Did you get my message?", exCn: "你收到我的信息了吗？" },
            { word: "give", ipa: "/ɡɪv/", pos: "v.", cn: "给予；提供；交给", cat: "ops", exEn: "Could you give me a hand?", exCn: "你能帮我个忙吗？" },
            { word: "take", ipa: "/teɪk/", pos: "v.", cn: "拿取；带走；花费", cat: "ops", exEn: "Take your time, no rush.", exCn: "慢慢来，不着急。" },
            { word: "put", ipa: "/pʊt/", pos: "v.", cn: "放置；表达", cat: "ops", exEn: "Please put the keys on the table.", exCn: "请把钥匙放在桌上。" },
            { word: "keep", ipa: "/kiːp/", pos: "v.", cn: "保持；保留；继续", cat: "ops", exEn: "Keep up the good work!", exCn: "继续保持好状态！" },
            { word: "let", ipa: "/let/", pos: "v.", cn: "让；允许；出租", cat: "ops", exEn: "Let me check the schedule.", exCn: "让我查一下时间表。" },
            { word: "do", ipa: "/duː/", pos: "v.", cn: "做；执行；干", cat: "ops", exEn: "What do you do for fun?", exCn: "你平时有什么娱乐爱好？" },
            { word: "have", ipa: "/hæv/", pos: "v.", cn: "有；拥有；吃喝", cat: "ops", exEn: "Have a wonderful day!", exCn: "祝你有美好的一天！" },
            { word: "say", ipa: "/seɪ/", pos: "v.", cn: "说；讲；表明", cat: "ops", exEn: "What did you say?", exCn: "你刚才说了什么？" },
            { word: "see", ipa: "/siː/", pos: "v.", cn: "看见；明白；理解", cat: "ops", exEn: "I see what you mean.", exCn: "我明白你的意思了。" },
            { word: "send", ipa: "/send/", pos: "v.", cn: "发送；寄出", cat: "ops", exEn: "I'll send you an email soon.", exCn: "我很快会给你发邮件。" },
            { word: "account", ipa: "/əˈkaʊnt/", pos: "n.", cn: "账户；描述；解释", cat: "things", exEn: "I need to open a bank account.", exCn: "我需要开一个银行账户。" },
            { word: "agreement", ipa: "/əˈɡriːmənt/", pos: "n.", cn: "协议；同意；一致", cat: "things", exEn: "They reached a mutual agreement.", exCn: "他们达成了共同协议。" },
            { word: "amount", ipa: "/əˈmaʊnt/", pos: "n.", cn: "数量；总额", cat: "things", exEn: "A large amount of work remains.", exCn: "还有大量的工作要做。" },
            { word: "business", ipa: "/ˈbɪznəs/", pos: "n.", cn: "商业；生意；事务", cat: "things", exEn: "Mind your own business.", exCn: "管好你自己的事。" },
            { word: "company", ipa: "/ˈkʌmpəni/", pos: "n.", cn: "公司；陪伴；同伴", cat: "things", exEn: "She works for a tech company.", exCn: "她在一家科技公司工作。" },
            { word: "able", ipa: "/ˈeɪbl/", pos: "adj.", cn: "有能力的；能干的", cat: "qualities", exEn: "Will you be able to come tonight?", exCn: "你今晚能来吗？" },
            { word: "beautiful", ipa: "/ˈbjuːtɪfl/", pos: "adj.", cn: "美丽的；出色的", cat: "qualities", exEn: "What a beautiful sunset!", exCn: "多么迷人的日落啊！" },
            { word: "clear", ipa: "/klɪər/", pos: "adj.", cn: "清晰的；晴朗的；明白的", cat: "qualities", exEn: "Is the explanation clear to you?", exCn: "这个解释你听明白了吗？" },
            { word: "different", ipa: "/ˈdɪfrənt/", pos: "adj.", cn: "不同的；各种各样的", cat: "qualities", exEn: "We have completely different ideas.", exCn: "我们有截然不同的想法。" },
            { word: "important", ipa: "/ɪmˈpɔːrtnt/", pos: "adj.", cn: "重要的；重大的", cat: "qualities", exEn: "Health is the most important thing.", exCn: "健康是最重要的事情。" }
        ],

        vocab2000: [
            { word: "achieve", ipa: "/əˈtʃiːv/", pos: "v.", cn: "实现；达到", cat: "ops", exEn: "You can achieve your goal with persistence.", exCn: "坚持就能实现目标。" },
            { word: "advantage", ipa: "/ədˈvæntɪdʒ/", pos: "n.", cn: "优势；有利条件", cat: "things", exEn: "Taking initiative gives you a huge advantage.", exCn: "采取主动会给你带来巨大优势。" },
            { word: "advice", ipa: "/ədˈvaɪs/", pos: "n.", cn: "建议；忠告", cat: "things", exEn: "Thanks for your valuable advice.", exCn: "谢谢你宝贵的建议。" },
            { word: "afford", ipa: "/əˈfɔːrd/", pos: "v.", cn: "负担得起；买得起", cat: "ops", exEn: "We can afford to buy a new computer.", exCn: "我们买得起一台新电脑。" },
            { word: "allow", ipa: "/əˈlaʊ/", pos: "v.", cn: "允许；准许", cat: "ops", exEn: "Please allow me to introduce myself.", exCn: "请允许我自我介绍。" },
            { word: "apologize", ipa: "/əˈpɑːlədʒaɪz/", pos: "v.", cn: "道歉；谢罪", cat: "ops", exEn: "I sincerely apologize for the delay.", exCn: "我为延迟表示诚挚的歉意。" },
            { word: "attitude", ipa: "/ˈætɪtuːd/", pos: "n.", cn: "态度；看法", cat: "things", exEn: "A positive attitude changes everything.", exCn: "积极的态度改变一切。" },
            { word: "benefit", ipa: "/ˈbenɪfɪt/", pos: "n./v.", cn: "利益；好处", cat: "things", exEn: "Regular exercise has immense health benefits.", exCn: "规律运动对健康大有裨益。" },
            { word: "challenge", ipa: "/ˈtʃælɪndʒ/", pos: "n./v.", cn: "挑战；质疑", cat: "things", exEn: "Welcome every new challenge with courage.", exCn: "用勇气迎接入每一个新挑战。" },
            { word: "confident", ipa: "/ˈkɑːnfɪdənt/", pos: "adj.", cn: "自信的；确信的", cat: "qualities", exEn: "Speak loudly and stay confident.", exCn: "大声说话并保持自信。" }
        ],

        vocab3000: [
            { word: "approximate", ipa: "/əˈprɑːksɪmət/", pos: "adj.", cn: "近似的；大概的", cat: "qualities", exEn: "What is the approximate cost of this project?", exCn: "这个项目的预计大概成本是多少？" },
            { word: "collaborate", ipa: "/kəˈlæbəreɪt/", pos: "v.", cn: "合作；协作", cat: "ops", exEn: "Our teams collaborate closely to deliver results.", exCn: "我们团队密切合作以交付成果。" },
            { word: "demonstrate", ipa: "/ˈdemənstreɪt/", pos: "v.", cn: "演示；证明", cat: "ops", exEn: "She will demonstrate the new software feature.", exCn: "她将演示新的软件功能。" },
            { word: "efficient", ipa: "/ɪˈfɪʃnt/", pos: "adj.", cn: "高效的；有能力的", cat: "qualities", exEn: "An efficient workflow saves time and resources.", exCn: "高效的工作流程省时省资源。" },
            { word: "extraordinary", ipa: "/ɪkˈstrɔːrdəneri/", pos: "adj.", cn: "非凡的；特别的", cat: "qualities", exEn: "The speaker gave an extraordinary performance.", exCn: "演讲者带来了非凡的表现。" }
        ]
    };

    const SCENARIOS = {
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
                    },
                    {
                        en: "Sure thing! What size would you prefer: Tall, Grande, or Venti?",
                        cn: "没问题！您想要什么杯型：中杯、大杯还是超大杯？",
                        ipa: "/ʃʊr θɪŋ! wʌt saɪz wʊd juː prɪˈfɜːr/",
                        vocab: [{ word: "Grande", cn: "大杯" }, { word: "prefer", cn: "偏好" }]
                    },
                    {
                        en: "A Grande will be perfect. I'll pay with Apple Pay.",
                        cn: "大杯就好，谢谢。我用 Apple Pay 支付。",
                        ipa: "/ə ˈɡrɑːndeɪ wɪl biː ˈpɜːrfɪkt. aɪl peɪ wɪð ˈæpl peɪ/",
                        vocab: [{ word: "perfect", cn: "完美/正好" }]
                    }
                ]
            },
            {
                id: 'weekend',
                title: '🌴 Weekend Relaxation & Hobbies',
                subtitle: '聊聊周末休假与户外活动',
                sentences: [
                    {
                        en: "Do you have any exciting plans for the upcoming weekend?",
                        cn: "这个周末你有什么有趣的计划吗？",
                        ipa: "/duː juː hæv ˈeni ɪkˈsaɪtɪŋ plænz fɔːr ðə ˈʌpkʌmɪŋ ˈwiːkend/",
                        vocab: [{ word: "upcoming", cn: "即将来临的" }]
                    },
                    {
                        en: "I'm thinking about going hiking in the mountains to recharge.",
                        cn: "我打算去山里徒步，放松充会儿电。",
                        ipa: "/aɪm ˈθɪŋkɪŋ əˈbaʊt ˈɡoʊɪŋ ˈhaɪkɪŋ ɪn ðə ˈmaʊntnz tuː riːˈtʃɑːrdʒ/",
                        vocab: [{ word: "recharge", cn: "恢复精力" }]
                    }
                ]
            }
        ],

        workplace: [
            {
                id: 'interview',
                title: '💼 Job Interview Self-Introduction',
                subtitle: '求职面试高频自述句型',
                sentences: [
                    {
                        en: "Thank you for giving me this opportunity to introduce myself.",
                        cn: "感谢您给我这次自我介绍的机会。",
                        ipa: "/θæŋk juː fɔːr ˈɡɪvɪŋ miː ðɪs ˌɑːpərˈtuːnəti tuː ˌɪntrəˈduːs maɪˈself/",
                        vocab: [{ word: "opportunity", cn: "机会" }]
                    },
                    {
                        en: "I have over five years of experience in full-stack software engineering.",
                        cn: "我在全栈软件工程领域拥有超过五年的工作经验。",
                        ipa: "/aɪ hæv ˈoʊvər faɪv jɪərz əv ɪkˈspɪriəns ɪn fʊl stæk ˈsɔːftwer ˌendʒɪˈnɪrɪŋ/",
                        vocab: [{ word: "experience", cn: "经验" }]
                    },
                    {
                        en: "My key strength lies in solving complex technical problems under tight deadlines.",
                        cn: "我的核心优势在于能在紧迫的时间节点下解决复杂的技术问题。",
                        ipa: "/maɪ kiː streŋθ laɪz ɪn ˈsɑːlvɪŋ kəmˈpleks ˈteknɪkl ˈprɑːbləmz ˈʌndər taɪt ˈdedlaɪnz/",
                        vocab: [{ word: "tight deadlines", cn: "紧迫的截止日期" }]
                    }
                ]
            },
            {
                id: 'meeting',
                title: '📊 Project Status Meeting Update',
                subtitle: '团队例会中汇报项目进展',
                sentences: [
                    {
                        en: "I'd like to share a brief status update on our new feature release.",
                        cn: "我想就新功能发布进展做一个简要汇报。",
                        ipa: "/aɪd laɪk tuː ʃer ə briːf ˈstætəs ˌʌpˈdeɪt ɑːn aʊər nuː ˈfiːtʃər rɪˈliːs/",
                        vocab: [{ word: "status update", cn: "进展汇报" }]
                    },
                    {
                        en: "We are currently right on schedule to complete QA testing by Friday afternoon.",
                        cn: "目前进度正常，预计周五下午前完成质量测试。",
                        ipa: "/wiː ɑːr ˈkɜːrəntli raɪt ɑːn ˈskedʒuːl tuː kəmˈpliːt testɪŋ baɪ ˈfraɪdeɪ ˌæftərˈnuːn/",
                        vocab: [{ word: "on schedule", cn: "按计划" }]
                    }
                ]
            }
        ],

        travel: [
            {
                id: 'hotel',
                title: '🏨 Hotel Check-in & Requests',
                subtitle: '办理酒店入住与提出房间需求',
                sentences: [
                    {
                        en: "Good evening! I have a reservation under the name Alex Turner.",
                        cn: "晚上好！我有一份 Alex Turner 名下的预订。",
                        ipa: "/ɡʊd ˈiːvnɪŋ! aɪ hæv ə ˌrezərˈveɪʃn ˈʌndər ðə neɪm ˈælɪks ˈtɜːrnər/",
                        vocab: [{ word: "reservation", cn: "预订" }]
                    },
                    {
                        en: "Is it possible to upgrade to a room on a higher floor with an ocean view?",
                        cn: "可以帮我升房到带海景的高楼层房间吗？",
                        ipa: "/ɪz ɪt ˈpɑːsəbl tuː ˌʌpˈɡreɪd tuː ə ruːm ɑːn ə ˈhaɪər flɔːr wɪð ən ˈoʊʃn vjuː/",
                        vocab: [{ word: "ocean view", cn: "海景" }]
                    }
                ]
            }
        ],

        idioms: [
            {
                id: 'golden_phrases',
                title: '🌟 10 Gold Oral Idioms & Expressions',
                subtitle: '地道习惯用语与金句卡片',
                sentences: [
                    {
                        en: "Let's call it a day! We've made great progress today.",
                        cn: "今天就到此为止收工吧！我们今天进展很大。",
                        ipa: "/lets kɔːl ɪt ə deɪ! wiːv meɪd ɡreɪt ˈprɑːɡres təˈdeɪ/",
                        vocab: [{ word: "call it a day", cn: "收工/今日到此为止" }]
                    },
                    {
                        en: "You hit the nail on the head! That's exactly what I meant.",
                        cn: "你说得一针见血！我就是这个意思。",
                        ipa: "/juː hɪt ðə neɪl ɑːn ðə hed! ðæts ɪɡˈzæktli wʌt aɪ ment/",
                        vocab: [{ word: "hit the nail on the head", cn: "一针见血/彻底说对" }]
                    }
                ]
            }
        ]
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
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-info text-cyan"></i> ${msg}`;
        document.getElementById('toastContainer').appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    // Load External Vocab Dataset
    loadExternalVocabDataset();
    renderFlashcard();
});
