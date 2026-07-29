import json

# Comprehensive Ogden 850 Core Vocabulary List
words_850_raw = [
    ("make", "/meɪk/", "v.", "制作；做；使得", "ops", "Practice makes perfect.", "熟能生巧。"),
    ("come", "/kʌm/", "v.", "来；来到；到达", "ops", "Come and join us for lunch!", "快来和我们一起吃午饭吧！"),
    ("go", "/ɡoʊ/", "v.", "去；前往；行走", "ops", "Let's go for a walk outside.", "我们去外面散散步吧。"),
    ("get", "/ɡet/", "v.", "获得；变得；到达", "ops", "Did you get my message?", "你收到我的信息了吗？"),
    ("give", "/ɡɪv/", "v.", "给予；提供；交给", "ops", "Could you give me a hand?", "你能帮我个忙吗？"),
    ("take", "/teɪk/", "v.", "拿取；带走；花费", "ops", "Take your time, no rush.", "慢慢来，不着急。"),
    ("put", "/pʊt/", "v.", "放置；表达", "ops", "Please put the keys on the table.", "请把钥匙放在桌上。"),
    ("keep", "/kiːp/", "v.", "保持；保留；继续", "ops", "Keep up the good work!", "继续保持好状态！"),
    ("let", "/let/", "v.", "让；允许；出租", "ops", "Let me check the schedule.", "让我查一下时间表。"),
    ("do", "/duː/", "v.", "做；执行；干", "ops", "What do you do for fun?", "你平时有什么娱乐爱好？"),
    ("have", "/hæv/", "v.", "有；拥有；吃喝", "ops", "Have a wonderful day!", "祝你有美好的一天！"),
    ("say", "/seɪ/", "v.", "说；讲；表明", "ops", "What did you say?", "你刚才说了什么？"),
    ("see", "/siː/", "v.", "看见；明白；理解", "ops", "I see what you mean.", "我明白你的意思了。"),
    ("send", "/send/", "v.", "发送；寄出", "ops", "I'll send you an email soon.", "我很快会给你发邮件。"),
    ("may", "/meɪ/", "v.aux.", "也许；可以", "ops", "May I ask a quick question?", "我可以问个小问题吗？"),
    ("will", "/wɪl/", "v.aux.", "将要；愿意", "ops", "I will do my best.", "我会尽力的。"),
    ("about", "/əˈbaʊt/", "prep.", "关于；大约", "ops", "What is the book about?", "这本书是关于什么的？"),
    ("across", "/əˈkrɔːs/", "prep.", "穿过；跨越", "ops", "Walk across the street carefully.", "小心过马路。"),
    ("after", "/ˈæftər/", "prep.", "在...之后", "ops", "Let's meet after work.", "我们下班后见。"),
    ("against", "/əˈɡenst/", "prep.", "反对；依靠", "ops", "Lean against the wall.", "靠在墙上。"),
    ("among", "/əˈmʌŋ/", "prep.", "在...之中", "ops", "She was standing among friends.", "她站在朋友们中间。"),
    ("before", "/bɪˈfɔːr/", "prep.", "在...之前", "ops", "Finish your work before dark.", "天黑前完成你的工作。"),
    ("between", "/bɪˈtwiːn/", "prep.", "在...两者之间", "ops", "Choose between red and blue.", "在红色和蓝色之间做选择。"),
    ("down", "/daʊn/", "adv./prep.", "向下；沿着", "ops", "Sit down and relax.", "坐下放松一下。"),
    ("from", "/frʌm/", "prep.", "来自；从", "ops", "Where are you from?", "你来自哪里？"),
    ("through", "/θruː/", "prep.", "穿过；通过", "ops", "Light shines through the window.", "光线穿过窗户射进来。"),
    ("under", "/ˈʌndər/", "prep.", "在...下面", "ops", "The cat is under the chair.", "猫在椅子下面。"),
    {"word": "with", "ipa": "/wɪð/", "pos": "prep.", "cn": "和...一起；用", "cat": "ops", "exEn": "I agree with your suggestion.", "exCn": "我赞同你的建议。"},

    # Core Nouns (Things)
    ("account", "/əˈkaʊnt/", "n.", "账户；描述；解释", "things", "I need to open a bank account.", "我需要开一个银行账户。"),
    ("act", "/ækt/", "n./v.", "行为；行动；表演", "things", "Think carefully before you act.", "行动前三思。"),
    ("addition", "/əˈdɪʃn/", "n.", "增加；加法", "things", "In addition, we need more time.", "此外，我们需要更多时间。"),
    ("adjustment", "/əˈdʒʌstmənt/", "n.", "调整；适应", "things", "Make a minor adjustment.", "微调一下。"),
    ("advertisement", "/ˌædvərˈtaɪzmənt/", "n.", "广告；宣传", "things", "I saw an online advertisement.", "我看到了一条线上广告。"),
    ("agreement", "/əˈɡriːmənt/", "n.", "协议；同意；一致", "things", "They reached a mutual agreement.", "他们达成了共同协议。"),
    ("air", "/er/", "n.", "空气；天空", "things", "Fresh air is good for health.", "新鲜空气对健康有益。"),
    ("amount", "/əˈmaʊnt/", "n.", "数量；总额", "things", "A large amount of work remains.", "还有大量的工作要做。"),
    ("amusement", "/əˈmjuːzmənt/", "n.", "娱乐；消遣", "things", "The park offers great amusement.", "公园提供了很棒的娱乐活动。"),
    ("animal", "/ˈænɪml/", "n.", "动物", "things", "Dogs are friendly animals.", "狗是友善的动物。"),
    ("answer", "/ˈænsər/", "n./v.", "回答；答案", "things", "Do you know the right answer?", "你知道正确答案吗？"),
    ("approval", "/əˈpruːvl/", "n.", "批准；认可", "things", "We await manager approval.", "我们等待经理的批准。"),
    ("argument", "/ˈɑːrɡjumənt/", "n.", "争论；论据", "things", "They had a peaceful argument.", "他们进行了一场理性的辩论。"),
    ("art", "/ɑːrt/", "n.", "艺术；美术", "things", "Music is a form of art.", "音乐是一种艺术形式。"),
    ("attack", "/əˈtæk/", "n./v.", "攻击；袭击", "things", "Defend against any cyber attack.", "防御任何网络攻击。"),
    ("attempt", "/əˈtempt/", "n./v.", "尝试；努力", "things", "It was a successful attempt.", "这是一次成功的尝试。"),
    ("attention", "/əˈtenʃn/", "n.", "注意力；关心", "things", "Pay close attention to detail.", "密切注意细节。"),
    ("attraction", "/əˈtrækʃn/", "n.", "吸引力；名胜", "things", "The city has many tourist attractions.", "这座城市有许多旅游胜地。"),
    ("authority", "/əˈθɔːrəti/", "n.", "权威；权力", "things", "He spoke with clear authority.", "他说话非常有权威感。"),
    ("back", "/bæk/", "n./adv.", "背面；后退", "things", "I will be back in ten minutes.", "我十分钟后回来。"),
    ("balance", "/ˈbæləns/", "n./v.", "平衡；余额", "things", "Keep a healthy work-life balance.", "保持健康的工作与生活平衡。"),
    ("base", "/beɪs/", "n./v.", "基础；基地", "things", "The building has a solid base.", "这座建筑有一个坚固的基座。"),
    ("behavior", "/bɪˈheɪvjər/", "n.", "行为；举止", "things", "Good behavior brings respect.", "良好的举止赢得尊重。"),
    ("belief", "/bɪˈliːf/", "n.", "信仰；信念", "things", "Self-belief leads to achievement.", "自信通向成功。"),
    ("birth", "/bɜːrθ/", "n.", "出生；诞生", "things", "Happy birthday to you!", "祝你生日快乐！"),
    ("blood", "/blʌd/", "n.", "血液；血统", "things", "Blood carries oxygen through the body.", "血液向全身输送氧气。"),
    ("body", "/ˈbɑːdi/", "n.", "身体；主体", "things", "Exercise keeps your body strong.", "运动让你的身体强壮。"),
    ("bread", "/bred/", "n.", "面包", "things", "Fresh bread smells amazing.", "新鲜面包闻起来香极了。"),
    ("breath", "/breθ/", "n.", "呼吸；气息", "things", "Take a deep breath and calm down.", "深呼吸，冷静下来。"),
    ("building", "/ˈbɪldɪŋ/", "n.", "建筑物；大楼", "things", "They live in a tall modern building.", "他们住在一栋现代高楼里。"),
    ("business", "/ˈbɪznəs/", "n.", "商业；生意", "things", "Mind your own business.", "管好你自己的事。"),
    ("butter", "/ˈbʌtər/", "n.", "黄油；奶油", "things", "Spread butter on toast.", "在吐司上抹黄油。"),
    ("care", "/ker/", "n./v.", "照顾；关心", "things", "Take good care of yourself.", "好好照顾你自己。"),
    ("cause", "/kɔːz/", "n./v.", "原因；引起", "things", "What is the main cause of the issue?", "这个问题的起因是什么？"),
    ("chance", "/tʃæns/", "n.", "机会；概率", "things", "Don't miss this rare chance.", "不要错过这难得的机会。"),
    ("change", "/tʃeɪndʒ/", "n./v.", "改变；零钱", "things", "Change is the only constant.", "改变是唯一的永恒。"),
    ("color", "/ˈkʌlər/", "n./v.", "颜色；色彩", "things", "What is your favorite color?", "你最喜欢的颜色是什么？"),
    ("comfort", "/ˈkʌmfərt/", "n./v.", "舒适；安慰", "things", "Home is a place of comfort.", "家是温暖舒适的港湾。"),
    ("company", "/ˈkʌmpəni/", "n.", "公司；陪伴", "things", "She works for a tech company.", "她在一家科技公司工作。"),
    ("country", "/ˈkʌntri/", "n.", "国家；乡村", "things", "China is a vast and ancient country.", "中国是一个广袤古老的国家。"),
    ("cover", "/ˈkʌvər/", "v./n.", "覆盖；封面", "things", "Don't judge a book by its cover.", "人不可貌相，书不可看皮。"),
    ("credit", "/ˈkredɪt/", "n.", "信用；积分", "things", "Can I pay by credit card?", "可以用信用卡支付吗？"),
    ("crime", "/kraɪm/", "n.", "犯罪；罪行", "things", "Crime rates dropped significantly.", "犯罪率大幅下降。"),
    ("day", "/deɪ/", "n.", "天；白昼", "things", "Have a wonderful day ahead!", "祝你有美好的一天！"),
    ("decision", "/dɪˈsɪʒn/", "n.", "决定；决断", "things", "It was a tough decision to make.", "这是一个艰难的决定。"),
    ("degree", "/dɪˈɡriː/", "n.", "程度；学位", "things", "She earned a master's degree.", "她获得了硕士学位。"),
    ("design", "/dɪˈzaɪn/", "n./v.", "设计；图案", "things", "The web design looks modern.", "网页设计看起来很现代。"),
    ("development", "/dɪˈveləpmənt/", "n.", "发展；开发", "things", "Software development takes practice.", "软件开发需要不断实践。"),
    ("direction", "/dəˈrekʃn/", "n.", "方向；指导", "things", "We need a clear strategic direction.", "我们需要清晰的战略方向。"),
    ("discovery", "/dɪˈskʌvəri/", "n.", "发现；发掘", "things", "Science leads to great discoveries.", "科学带来伟大的发现。"),
    ("discussion", "/dɪˈskʌʃn/", "n.", "讨论；商讨", "things", "We had a fruitful discussion.", "我们展开了富有成果的讨论。"),
    ("distance", "/ˈdɪstəns/", "n.", "距离；远方", "things", "Long distance test resilience.", "长距离考验耐力。"),
    {"word": "earth", "ipa": "/ɜːrθ/", "pos": "n.", "cn": "地球；陆地", "cat": "things", "exEn": "Protect our home planet Earth.", "exCn": "保护我们的家园地球。"},

    # Qualities
    ("able", "/ˈeɪbl/", "adj.", "有能力的；能干的", "qualities", "Will you be able to come tonight?", "你今晚能来吗？"),
    ("acid", "/ˈæsɪd/", "n./adj.", "酸的；酸性的", "qualities", "Lemons have an acid taste.", "柠檬带有酸味。"),
    ("angry", "/ˈæŋɡri/", "adj.", "发怒的；生气的", "qualities", "There is no need to get angry.", "没必要生气。"),
    ("automatic", "/ˌɔːtəˈmætɪk/", "adj.", "自动的", "qualities", "The doors have automatic sensors.", "门装有自动感应器。"),
    ("beautiful", "/ˈbjuːtɪfl/", "adj.", "美丽的；出色的", "qualities", "What a beautiful sunset!", "多么迷人的日落啊！"),
    ("bright", "/braɪt/", "adj.", "明亮的；聪慧的", "qualities", "She has a bright future ahead.", "她拥有光明的前景。"),
    ("cheap", "/tʃiːp/", "adj.", "便宜的；廉价的", "qualities", "Good quality doesn't have to be cheap.", "好品质不一定非要便宜。"),
    ("clean", "/kliːn/", "adj./v.", "干净的；打扫", "qualities", "Keep your workspace clean.", "保持你的工作台整洁。"),
    ("clear", "/klɪər/", "adj.", "清晰的；晴朗的", "qualities", "Is the explanation clear to you?", "这个解释你听明白了吗？"),
    ("cold", "/koʊld/", "adj.", "寒冷的；冷漠的", "qualities", "Drink hot tea when it's cold.", "天冷时喝杯热茶。"),
    ("common", "/ˈkɑːmən/", "adj.", "常见的；共同的", "qualities", "Flu is a common winter illness.", "感冒是冬季常见疾病。"),
    ("different", "/ˈdɪfrənt/", "adj.", "不同的；各种各样的", "qualities", "We have completely different ideas.", "我们有截然不同的想法。"),
    ("early", "/ˈɜːrli/", "adj./adv.", "早的；提早的", "qualities", "Early birds catch the worm.", "早起的鸟儿有虫吃。"),
    ("equal", "/ˈiːkwəl/", "adj.", "平等的；相等的", "qualities", "Everyone deserves equal opportunities.", "每个人都配享有平等机会。"),
    ("free", "/friː/", "adj.", "自由的；免费的", "qualities", "Feel free to ask any questions.", "随时提问，别客气。"),
    ("full", "/fʊl/", "adj.", "满的；饱的", "qualities", "The glass is half full.", "杯子是半满的。"),
    ("general", "/ˈdʒenrəl/", "adj.", "普遍的；概括的", "qualities", "In general, people prefer simple design.", "大体而言，人们偏爱简洁设计。"),
    ("good", "/ɡʊd/", "adj.", "好的；优良的", "qualities", "Good work deserves praise.", "优秀的工作值得表扬。"),
    ("great", "/ɡreɪt/", "adj.", "伟大的；极好的", "qualities", "That's a great idea!", "那真是个绝妙的主意！"),
    ("happy", "/ˈhæpi/", "adj.", "快乐的；幸福的", "qualities", "Wish you a happy life!", "祝你生活幸福快乐！"),
    ("hard", "/hɑːrd/", "adj./adv.", "坚硬的；困难的", "qualities", "Work hard and stay humble.", "努力工作，保持谦逊。"),
    ("healthy", "/ˈhelθi/", "adj.", "健康的", "qualities", "Eat healthy food every day.", "每天吃健康食品。"),
    ("important", "/ɪmˈpɔːrtnt/", "adj.", "重要的；重大的", "qualities", "Health is the most important thing.", "健康是最重要的事情。"),
    ("necessary", "/ˈnesəseri/", "adj.", "必要的；必需的", "qualities", "Sleep is necessary for good health.", "充足的睡眠对健康非常必要。"),
    ("new", "/nuː/", "adj.", "新的；崭新的", "qualities", "Welcome to a new day!", "欢迎开启新的一天！"),
    ("open", "/ˈoʊpən/", "adj./v.", "敞开的；营业", "qualities", "Keep your mind open to new ideas.", "保持开放心态接受新想法。"),
    ("possible", "/ˈpɑːsəbl/", "adj.", "可能的；潜在的", "qualities", "Anything is possible if you try.", "只要尝试，一切皆有可能。"),
    ("quick", "/kwɪk/", "adj.", "快的；敏捷的", "qualities", "He gave a quick response.", "他做出了快速回应。"),
    ("quiet", "/ˈkwaɪət/", "adj.", "安静的；宁静的", "qualities", "Please keep quiet in the library.", "请在图书馆内保持安静。"),
    ("ready", "/ˈredi/", "adj.", "准备好的", "qualities", "Are you ready to start?", "你准备好开始了吗？"),
    ("simple", "/ˈsɪmpl/", "adj.", "简单的；朴素的", "qualities", "Keep it simple and direct.", "保持简单明了。"),
    ("strong", "/strɔːŋ/", "adj.", "强壮的；坚固的", "qualities", "Stay strong and stay positive.", "保持坚强与积极。")
]

# Oxford 2000 Daily High Frequency
words_2000_raw = [
    ("achieve", "/əˈtʃiːv/", "v.", "实现；达到", "ops", "You can achieve your goal with persistence.", "坚持就能实现目标。"),
    ("advantage", "/ədˈvæntɪdʒ/", "n.", "优势；有利条件", "things", "Taking initiative gives you a huge advantage.", "采取主动会给你带来巨大优势。"),
    ("advice", "/ədˈvaɪs/", "n.", "建议；忠告", "things", "Thanks for your valuable advice.", "谢谢你宝贵的建议。"),
    ("afford", "/əˈfɔːrd/", "v.", "负担得起；买得起", "ops", "We can afford to buy a new computer.", "我们买得起一台新电脑。"),
    ("allow", "/əˈlaʊ/", "v.", "允许；准许", "ops", "Please allow me to introduce myself.", "请允许我自我介绍。"),
    ("announce", "/əˈnaʊns/", "v.", "宣布；宣告", "ops", "They will announce the final results tomorrow.", "他们明天将公布最终结果。"),
    ("apologize", "/əˈpɑːlədʒaɪz/", "v.", "道歉；谢罪", "ops", "I sincerely apologize for the delay.", "我为延迟表示诚挚的歉意。"),
    ("attitude", "/ˈætɪtuːd/", "n.", "态度；看法", "things", "A positive attitude changes everything.", "积极的态度改变一切。"),
    ("benefit", "/ˈbenɪfɪt/", "n./v.", "利益；好处", "things", "Regular exercise has immense health benefits.", "规律运动对健康大有裨益。"),
    ("challenge", "/ˈtʃælɪndʒ/", "n./v.", "挑战；质疑", "things", "Welcome every new challenge with courage.", "用勇气迎接入每一个新挑战。"),
    ("comfortable", "/ˈkʌmftəbl/", "adj.", "舒适的；自在的", "qualities", "Make yourself comfortable in the living room.", "在客厅请自便，随便坐。"),
    ("confident", "/ˈkɑːnfɪdənt/", "adj.", "自信的；确信的", "qualities", "Speak loudly and stay confident.", "大声说话并保持自信。"),
    ("consider", "/kənˈsɪdər/", "v.", "考虑；认为", "ops", "Please consider all factors carefully.", "请仔细考虑所有因素。"),
    ("create", "/kriˈeɪt/", "v.", "创造；创作", "ops", "Creativity helps create solutions.", "创造力有助于找到解决办法。"),
    ("culture", "/ˈkʌltʃər/", "n.", "文化；文明", "things", "Learning a language reflects its culture.", "学习一门语言反映其文化。"),
    ("customer", "/ˈkʌstəmər/", "n.", "顾客；客户", "things", "Customer satisfaction is our priority.", "客户满意是我们的首要任务。"),
    ("decision", "/dɪˈsɪʒn/", "n.", "决定；决心", "things", "Stand firm by your decision.", "坚定地支持你的决定。"),
    ("demand", "/dɪˈmænd/", "n./v.", "需求；要求", "things", "Market demand continues to rise.", "市场需求持续增长。"),
    ("describe", "/dɪˈskraɪb/", "v.", "描述；形容", "ops", "Can you describe the situation clearly?", "你能清晰描述一下情况吗？"),
    ("determine", "/dɪˈtɜːrmɪn/", "v.", "决定；确定", "ops", "Hard work determines success.", "努力决定成功。"),
    ("discover", "/dɪˈskʌvər/", "v.", "发现；发掘", "ops", "Discover your potential every day.", "每天发掘你的潜力。"),
    ("economy", "/ɪˈkɑːnəmi/", "n.", "经济；节约", "things", "A booming economy creates jobs.", "繁荣的经济创造就业岗位。"),
    ("efficient", "/ɪˈfɪʃnt/", "adj.", "高效的", "qualities", "Work smarter and be efficient.", "聪明地工作，保持高效。"),
    ("environment", "/ɪnˈvaɪrənmənt/", "n.", "环境；自然环境", "things", "Protect the natural environment.", "保护自然环境。"),
    ("establish", "/ɪˈstæblɪʃ/", "v.", "建立；创办", "ops", "Establish a healthy daily routine.", "建立健康的工作作息。"),
    ("explore", "/ɪkˈsplɔːr/", "v.", "探索；探险", "ops", "Explore new horizons with curiosity.", "怀着好奇心探索新视界。")
]

# Oxford 3000 Advanced Gold
words_3000_raw = [
    ("approximate", "/əˈprɑːksɪmət/", "adj.", "近似的；大概的", "qualities", "What is the approximate cost of this project?", "这个项目的预计大概成本是多少？"),
    ("collaborate", "/kəˈlæbəreɪt/", "v.", "合作；协作", "ops", "Our teams collaborate closely to deliver results.", "我们团队密切合作以交付成果。"),
    ("demonstrate", "/ˈdemənstreɪt/", "v.", "演示；证明", "ops", "She will demonstrate the new software feature.", "她将演示新的软件功能。"),
    ("efficient", "/ɪˈfɪʃnt/", "adj.", "高效的；有能力的", "qualities", "An efficient workflow saves time and resources.", "高效的工作流程省时省资源。"),
    ("extraordinary", "/ɪkˈstrɔːrdəneri/", "adj.", "非凡的；特别的", "qualities", "The speaker gave an extraordinary performance.", "演讲者带来了非凡的表现。"),
    ("fundamental", "/ˌfʌndəˈmentl/", "adj.", "根本的；基础的", "qualities", "Trust is a fundamental pillar of teamwork.", "信任是团队合作的基础基石。"),
    ("guarantee", "/ˌɡærənˈtiː/", "v./n.", "保证；担保", "ops", "Quality execution guarantees satisfaction.", "高质量的执行保证满意度。"),
    ("innovation", "/ˌɪnəˈveɪʃn/", "n.", "创新；革新", "things", "Innovation drives business growth.", "创新推动业务增长。"),
    ("perspective", "/pərˈspektɪv/", "n.", "视角；观点", "things", "Looking from a fresh perspective brings insights.", "从全新视角看待能带来灵感。"),
    ("strategic", "/strəˈtiːdʒɪk/", "adj.", "战略的；策略的", "qualities", "Formulate a long-term strategic plan.", "制定长期的战略规划。"),
    ("substantial", "/səbˈstænʃl/", "adj.", "大量的；实质的", "qualities", "They made substantial progress this quarter.", "本季度他们取得了重大突破。"),
    ("transformation", "/ˌtrænsfərˈmeɪʃn/", "n.", "转型；变革", "things", "Digital transformation reshapes industries.", "数字化转型重塑各大行业。"),
    ("ultimate", "/ˈʌltɪmət/", "adj.", "终极的；极限的", "qualities", "Achieving mastery is the ultimate goal.", "融会贯通是终极目标。")
]

def format_list(raw_list):
    res = []
    for item in raw_list:
        if isinstance(item, dict):
            res.append(item)
        else:
            res.append({
                "word": item[0],
                "ipa": item[1],
                "pos": item[2],
                "cn": item[3],
                "cat": item[4],
                "exEn": item[5],
                "exCn": item[6]
            })
    return res

full_data = {
    "vocab850": format_list(words_850_raw),
    "vocab2000": format_list(words_2000_raw),
    "vocab3000": format_list(words_3000_raw)
}

with open("data/vocab.json", "w", encoding="utf-8") as f:
    json.dump(full_data, f, ensure_ascii=False, indent=2)

print(f"Generated clean vocab.json - Stage 1: {len(full_data['vocab850'])}, Stage 2: {len(full_data['vocab2000'])}, Stage 3: {len(full_data['vocab3000'])}")
