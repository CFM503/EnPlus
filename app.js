/**
 * VoiceTutor AI - Complete Sidebar Courses & 3000 Word Progression Engine
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

    function playLoudAudio(text, rate = 1.0, gainMultiplier = 2.0) {
        getAudioContext();

        if (currentAudioElement) {
            currentAudioElement.pause();
            currentAudioElement.currentTime = 0;
        }

        const sanitizedText = text.replace(/\[.*?\]|\/.*?\/|\(.*?\)/g, '').replace(/[^a-zA-Z0-9\s,'\.\!\?\-]/g, '').trim();
        if (!sanitizedText) return;

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

        audio.play().catch(err => {
            speakWebSpeechFallback(sanitizedText, rate, gainMultiplier);
        });
    }

    function speakWebSpeechFallback(text, rate, gainMultiplier) {
        const synth = window.speechSynthesis;
        if (synth.speaking) synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.volume = Math.min(1.0, gainMultiplier);
        utterance.lang = 'en-US';
        synth.speak(utterance);
    }

    // ==========================================
    // 1. DATASETS FOR VOCAB & ALL SIDEBAR MENUS
    // ==========================================
    const VOCAB_DATA = {
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
            { word: "achieve", ipa: "/əˈtʃiːv/", pos: "v.", cn: "实现；达到", cat: "ops", exEn: "You can achieve your goal.", exCn: "你能实现你的目标。" },
            { word: "advantage", ipa: "/ədˈvæntɪdʒ/", pos: "n.", cn: "优势；有利条件", cat: "things", exEn: "Taking initiative is a great advantage.", exCn: "采取主动是一个极大的优势。" },
            { word: "attitude", ipa: "/ˈætɪtuːd/", pos: "n.", cn: "态度；看法", cat: "things", exEn: "A positive attitude changes everything.", exCn: "积极的态度改变一切。" },
            { word: "confident", ipa: "/ˈkɑːnfɪdənt/", pos: "adj.", cn: "自信的；确信的", cat: "qualities", exEn: "Be confident when speaking English.", exCn: "说英语时要自信。" }
        ],

        vocab3000: [
            { word: "collaborate", ipa: "/kəˈlæbəreɪt/", pos: "v.", cn: "合作；协作", cat: "ops", exEn: "We need to collaborate on this project.", exCn: "我们需要在这个项目上展开合作。" },
            { word: "efficient", ipa: "/ɪˈfɪʃnt/", pos: "adj.", cn: "高效的；有能力的", cat: "qualities", exEn: "This tool makes learning efficient.", exCn: "这个工具使学习非常高效。" }
        ]
    };

    // COMPLETE RICH SCENARIOS FOR ALL SIDEBAR MENUS
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
                        vocab: [{ word: "recharge", cn: "充电/恢复精力" }]
                    },
                    {
                        en: "That sounds wonderful! Hopefully the weather stays sunny and clear.",
                        cn: "听起来太棒了！希望天气能一直保持晴朗。",
                        ipa: "/ðæt saʊndz ˈwʌndərfʊl! ˈhoʊpfəli ðə ˈweðər steɪz ˈsʌni ænd klɪər/",
                        vocab: [{ word: "sunny and clear", cn: "晴朗明亮" }]
                    }
                ]
            },
            {
                id: 'movie',
                title: '🎬 Recommending a Great Movie',
                subtitle: '分享好电影与观影感想',
                sentences: [
                    {
                        en: "Have you seen the latest sci-fi blockbuster in theaters?",
                        cn: "你看过电影院最近上映的那部科幻大片吗？",
                        ipa: "/hæv juː siːn ðə ˈleɪtɪst saɪ faɪ ˈblɑːkbʌstər ɪn ˈθiːətərz/",
                        vocab: [{ word: "blockbuster", cn: "大片/爆款电影" }]
                    },
                    {
                        en: "Not yet, but I heard the visual effects are absolutely mind-blowing!",
                        cn: "还没看，但我听说视觉特效简直令人震撼！",
                        ipa: "/nɑːt jet, bʌt aɪ hɜːrd ðə ˈvɪʒuəl ɪˈfekts ɑːr ˌæbsəˈluːtli maɪnd ˈbloʊɪŋ/",
                        vocab: [{ word: "mind-blowing", cn: "令人震惊/极度震撼" }]
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
            },
            {
                id: 'airport',
                title: '✈️ Airport Boarding & Customs Inspection',
                subtitle: '机场登机与海关入境问答',
                sentences: [
                    {
                        en: "May I see your passport and mobile boarding pass, please?",
                        cn: "请出示您的护照和电子登机牌。",
                        ipa: "/meɪ aɪ siː jɔːr ˈpæspɔːrt ænd ˈmoʊbl ˈbɔːrdɪŋ pæs, pliːz/",
                        vocab: [{ word: "boarding pass", cn: "登机牌" }]
                    },
                    {
                        en: "I am traveling for business and will be staying for five days.",
                        cn: "我因公差旅行，预计停留五天。",
                        ipa: "/aɪ æm ˈtrævlɪŋ fɔːr ˈbɪznəs ænd wɪl biː ˈsteɪɪŋ fɔːr faɪv deɪz/",
                        vocab: [{ word: "business trip", cn: "商务差旅" }]
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
                    },
                    {
                        en: "Don't worry, it's not rocket science! You will get the hang of it quickly.",
                        cn: "别担心，这并不难！你很快就能上手掌握要领的。",
                        ipa: "/doʊnt ˈwɜːri, ɪts nɑːt ˈrɑːkɪt ˈsaɪəns! juː wɪl ɡet ðə hæŋ əv ɪt ˈkwɪkli/",
                        vocab: [{ word: "get the hang of", cn: "掌握要领/上手" }]
                    }
                ]
            }
        ]
    };

    // State
    let currentCategory = 'vocab850';
    let currentTopicIndex = 0;
    let currentSentenceIndex = 0;
    let currentSpeed = 1.0;
    let currentVolume = 2.5; // Default 250% boosted
    let currentMode = 'vocab-card';

    let currentVocabList = [...VOCAB_DATA.vocab850];
    let filteredVocabList = [...currentVocabList];
    let currentVocabIndex = 0;
    let isCardFlipped = false;

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
    const speedBtns = document.querySelectorAll('.speed-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const modeBtns = document.querySelectorAll('.mode-btn');

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

    // Volume Range Listener
    if (volumeRange) {
        volumeRange.addEventListener('input', (e) => {
            currentVolume = parseFloat(e.target.value);
            const percent = Math.round(currentVolume * 100);
            volumeValText.innerText = `🔥 ${percent}% (硬件级暴音量)`;
        });
    }

    function speakText(text, rate = currentSpeed) {
        playLoudAudio(text, rate, currentVolume);
    }

    // Cloud Sync Engine
    async function syncToCloud() {
        if (!syncToken) return;

        syncBadgeText.innerText = "同步中...";
        try {
            const res = await fetch(`/api/sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: syncToken, data: userStats })
            });
            const result = await res.json();
            if (result.success) {
                openSyncModalBtn.className = "sync-badge synced";
                syncBadgeText.innerText = "☁️ 已同步到云端";
            }
        } catch (err) {
            console.warn("Cloud sync warning:", err);
            openSyncModalBtn.className = "sync-badge";
            syncBadgeText.innerText = "☁️ 本地保存";
        }
    }

    async function fetchFromCloud() {
        if (!syncToken) return;

        try {
            const res = await fetch(`/api/sync?token=${encodeURIComponent(syncToken)}`);
            const result = await res.json();
            if (result.success && result.data) {
                const cloudMastered = result.data.masteredVocab || [];
                const localMastered = userStats.masteredVocab || [];
                const merged = Array.from(new Set([...localMastered, ...cloudMastered]));

                userStats = {
                    ...userStats,
                    ...result.data,
                    masteredVocab: merged
                };
                saveStats(false);
                openSyncModalBtn.className = "sync-badge synced";
                syncBadgeText.innerText = "☁️ 已同步到云端";
                showToast("✅ 已成功同步手机/电脑端学习数据！");
            }
        } catch (err) {
            console.warn("Cloud fetch error:", err);
        }
    }

    function saveStats(triggerSync = true) {
        localStorage.setItem('voicetutor_stats', JSON.stringify(userStats));
        updateStatsUI();
        if (triggerSync && syncToken) {
            syncToCloud();
        }
    }

    function updateStatsUI() {
        const mastered = (userStats.masteredVocab || []).length;
        masteredVocabCountEl.innerText = `${mastered} / 850`;

        const percent = ((mastered / 3000) * 100).toFixed(1);
        goalProgressPercentEl.innerText = `${percent}%`;

        if (currentCategory === 'vocab850') currentLevelTag.innerText = "L1: 850核心词 (通关中)";
        else if (currentCategory === 'vocab2000') currentLevelTag.innerText = "L2: 2000日常词";
        else if (currentCategory === 'vocab3000') currentLevelTag.innerText = "L3: 3000黄金词";
        else currentLevelTag.innerText = "对话场景特训";
    }

    // Modal UI Listeners
    openSyncModalBtn.addEventListener('click', () => {
        syncTokenInput.value = syncToken;
        syncModal.classList.remove('hidden');
    });

    closeSyncModalBtn.addEventListener('click', () => syncModal.classList.add('hidden'));

    saveSyncTokenBtn.addEventListener('click', () => {
        const token = syncTokenInput.value.trim();
        if (!token) {
            showToast("请先输入自定的同步密钥！");
            return;
        }
        syncToken = token;
        localStorage.setItem('voicetutor_sync_token', syncToken);
        syncModal.classList.add('hidden');
        showToast("已设置同步密钥，正在与云端进行同步...");
        fetchFromCloud();
    });

    exportProgressBtn.addEventListener('click', () => {
        const jsonStr = JSON.stringify(userStats, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voicetutor_progress_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        showToast("已导出学习进度 JSON 备份文件！");
    });

    importProgressBtn.addEventListener('click', () => importFileInput.click());

    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (imported && Array.isArray(imported.masteredVocab)) {
                    userStats = imported;
                    saveStats();
                    showToast("🎉 学习进度成功导入！");
                    syncModal.classList.add('hidden');
                }
            } catch (err) {
                showToast("导入失败，文件格式有误。");
            }
        };
        reader.readAsText(file);
    });

    // Custom Text Processor
    const loadCustomTextBtn = document.getElementById('loadCustomTextBtn');
    const clearCustomTextBtn = document.getElementById('clearCustomTextBtn');
    const customTextInput = document.getElementById('customTextInput');

    if (loadCustomTextBtn) {
        loadCustomTextBtn.addEventListener('click', () => {
            const rawText = customTextInput.value.trim();
            if (!rawText) {
                showToast("请先在输入框中粘贴英文段落或文章！");
                return;
            }

            const rawSentences = rawText.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
            const customSentences = rawSentences.map(s => ({
                en: s,
                cn: "自定义短文句子",
                ipa: "",
                vocab: []
            }));

            SCENARIOS.custom = [
                {
                    id: 'custom_course',
                    title: '📝 自定义英文听读课件',
                    subtitle: `已成功解析 ${customSentences.length} 个训练句子`,
                    sentences: customSentences
                }
            ];

            currentTopicIndex = 0;
            currentSentenceIndex = 0;
            renderTopics();
            renderSentenceCard();
            showToast("✅ 自定义短文听读课件生成成功！");
        });
    }

    if (clearCustomTextBtn) {
        clearCustomTextBtn.addEventListener('click', () => {
            if (customTextInput) customTextInput.value = '';
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

        isCardFlipped = false;
        cardBack.classList.add('hidden');
        toggleCardFlipBtn.innerHTML = `<i class="fa-solid fa-eye"></i> 翻转显示释义`;
    }

    cardAudioBtn.addEventListener('click', () => {
        if (filteredVocabList.length > 0) speakText(filteredVocabList[currentVocabIndex].word);
    });

    cardExPlayBtn.addEventListener('click', () => {
        if (filteredVocabList.length > 0) speakText(filteredVocabList[currentVocabIndex].exEn);
    });

    toggleCardFlipBtn.addEventListener('click', () => {
        isCardFlipped = !isCardFlipped;
        if (isCardFlipped) {
            cardBack.classList.remove('hidden');
            toggleCardFlipBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> 隐藏释义`;
        } else {
            cardBack.classList.add('hidden');
            toggleCardFlipBtn.innerHTML = `<i class="fa-solid fa-eye"></i> 翻转显示释义`;
        }
    });

    mainFlashcard.addEventListener('click', (e) => {
        if (e.target.closest('#cardAudioBtn') || e.target.closest('#cardExPlayBtn')) return;
        toggleCardFlipBtn.click();
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

    // SIDEBAR TAB CLICK HANDLER FOR ALL MENUS
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
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
                renderFlashcard();
            } else {
                vocabModulePanel.classList.add('hidden');
                if (currentCategory === 'custom') {
                    document.getElementById('customInputCard').classList.remove('hidden');
                    document.getElementById('topicBanner').classList.add('hidden');
                    document.getElementById('sentenceCard').classList.add('hidden');
                    document.getElementById('scriptPanel').classList.add('hidden');
                } else {
                    document.getElementById('customInputCard').classList.add('hidden');
                    renderTopics();
                    renderSentenceCard();
                }
            }
            updateStatsUI();
        });
    });

    function renderTopics() {
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

    function renderSentenceCard() {
        if (['vocab850', 'vocab2000', 'vocab3000', 'custom'].includes(currentCategory) && !SCENARIOS[currentCategory]) return;

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
        vocabChips.innerHTML = '';
        if (sentence.vocab) {
            sentence.vocab.forEach(v => {
                const chip = document.createElement('span');
                chip.className = 'chip';
                chip.innerHTML = `<strong>${v.word}</strong> [${v.cn}]`;
                vocabChips.appendChild(chip);
            });
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

    // Sentence Card Audio Buttons
    const playSentenceBtn = document.getElementById('playSentenceBtn');
    const slowPlayBtn = document.getElementById('slowPlayBtn');
    const prevSentenceBtn = document.getElementById('prevSentenceBtn');
    const nextSentenceBtn = document.getElementById('nextSentenceBtn');

    if (playSentenceBtn) {
        playSentenceBtn.addEventListener('click', () => {
            const topics = SCENARIOS[currentCategory];
            if (topics && topics[currentTopicIndex]) {
                speakText(topics[currentTopicIndex].sentences[currentSentenceIndex].en, currentSpeed);
            }
        });
    }

    if (slowPlayBtn) {
        slowPlayBtn.addEventListener('click', () => {
            const topics = SCENARIOS[currentCategory];
            if (topics && topics[currentTopicIndex]) {
                speakText(topics[currentTopicIndex].sentences[currentSentenceIndex].en, 0.5);
            }
        });
    }

    if (prevSentenceBtn) {
        prevSentenceBtn.addEventListener('click', () => {
            if (currentSentenceIndex > 0) {
                currentSentenceIndex--;
                renderSentenceCard();
            }
        });
    }

    if (nextSentenceBtn) {
        nextSentenceBtn.addEventListener('click', () => {
            const topics = SCENARIOS[currentCategory];
            if (topics && topics[currentTopicIndex] && currentSentenceIndex < topics[currentTopicIndex].sentences.length - 1) {
                currentSentenceIndex++;
                renderSentenceCard();
            }
        });
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-info text-cyan"></i> ${msg}`;
        document.getElementById('toastContainer').appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    if (syncToken) {
        syncBadgeText.innerText = "☁️ 启用云同步";
        openSyncModalBtn.className = "sync-badge synced";
        fetchFromCloud();
    } else {
        updateStatsUI();
    }

    renderFlashcard();
});
