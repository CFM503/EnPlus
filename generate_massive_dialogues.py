import json

def make_sentence(en, cn, ipa, v_word, v_cn):
    return {
        "en": en,
        "cn": cn,
        "ipa": ipa,
        "vocab": [{"word": v_word, "cn": v_cn}]
    }

casual_topics = [
    {
        "id": "starbucks_master",
        "title": "☕ 1. Starbucks Special Requests & Coffee Customization",
        "subtitle": "星巴克与精品咖啡特调点餐（母语者级）",
        "sentences": [
            make_sentence("Hi, I'd like an iced oat milk latte with two pumps of sugar-free vanilla syrup, please.", "嗨，请给我来一杯冰燕麦奶拿铁，加两泵无糖香草糖浆。", "/haɪ, aɪd laɪk ən aɪst oʊt mɪlk ˈlɑːteɪ wɪð tuː pʌmps əv ˈʃʊɡər friː vəˈnɪlə ˈsɪrəp, pliːz/", "sugar-free", "无糖的"),
            make_sentence("Could you make it light ice and add a cold foam on top?", "可以做成少冰，并且在上面加一层冷奶泡吗？", "/kʊd juː meɪk ɪt laɪt aɪs ænd æd ə koʊld foʊm ɑːn tɑːp/", "light ice", "少冰"),
            make_sentence("Sure! Would you like an extra shot of espresso to make it stronger?", "没问题！您需要额外加一份意式浓缩让口感更浓郁吗？", "/ʃʊr! wʊd juː laɪk ən ˈekstrə ʃɑːt əv eˈspresoʊ tuː meɪk ɪt ˈstrɔːŋɡər/", "extra shot", "加一份浓缩"),
            make_sentence("That would be awesome. Please put it under the name Alex.", "那太棒了。杯子上请写名字 Alex，谢谢。", "/ðæt wʊd biː ˈɔːsəm. pliːz pʊt ɪt ˈʌndər ðə neɪm ˈælɪks/", "under the name", "登记在...名下")
        ]
    },
    {
        "id": "fastfood_drivethru",
        "title": "🍔 2. Drive-Thru Ordering & Secret Menu",
        "subtitle": "美式得来速与隐藏菜单点餐",
        "sentences": [
            make_sentence("Welcome to In-N-Out! What can I get started for you today?", "欢迎来到 In-N-Out！今天为您点些什么？", "/ˈwelkəm tuː ɪn ænd aʊt! wʌt kæn aɪ ɡet ˈstɑːrtɪd fɔːr juː təˈdeɪ/", "get started", "开始点餐"),
            make_sentence("Can I get a Double-Double animal style, with well-done fries?", "请给我一份双层牛肉芝士汉堡主厨秘制款（Animal Style），薯条要炸到特别酥脆的。", "/kæn aɪ ɡet ə ˈdʌbl ˈdʌbl ˈænɪml staɪl, wɪð wel dʌn fraɪz/", "Animal Style", "秘制酱料款"),
            make_sentence("Got it! Anything to drink with your combo meal?", "收到！您的套餐需要搭配什么饮料吗？", "/ɡɑːt ɪt! ˈeniθɪŋ tuː drɪŋk wɪð jʊər ˈkɑːmboʊ miːl/", "combo meal", "套餐"),
            make_sentence("I'll take a chocolate milkshake. Please pull up to the second window.", "我要一杯巧克力奶昔。请把车开到第二个窗口结账取餐。", "/aɪl teɪk ə ˈtʃɑːklət ˈmɪlkʃeɪk. pliːz pʊl ʌp tuː ðə ˈsekənd ˈwɪndoʊ/", "pull up", "驶近/停靠")
        ]
    },
    {
        "id": "weekend_plans",
        "title": "🌴 3. Weekend Relaxation & Outdoor Camping",
        "subtitle": "聊聊周末露营与户外放松",
        "sentences": [
            make_sentence("Are you up for a weekend camping trip near the lake?", "这个周末你有兴趣去湖边露营吗？", "/ɑːr juː ʌp fɔːr ə ˈwiːkend ˈkæmpɪŋ trɪp nɪər ðə leɪk/", "up for", "有兴趣参与"),
            make_sentence("Count me in! I'll bring the s'mores and portable speaker.", "算我一个！我会带上棉花糖夹心饼干和便携音箱。", "/kaʊnt miː ɪn! aɪl brɪŋ ðə s'mores ænd ˈpɔːrtəbl ˈspiːkər/", "Count me in", "算我一份"),
            make_sentence("Don't forget to pack insect repellent and a warm sleeping bag.", "别忘了带上防蚊喷雾和保暖睡袋。", "/doʊnt fərˈɡet tuː pæk ˈɪnsekt rɪˈpelənt ænd ə wɔːrm ˈsliːpɪŋ bæɡ/", "insect repellent", "防蚊喷雾")
        ]
    },
    {
        "id": "movies_netflix",
        "title": "🎬 4. Movies, Binge-Watching & Spoilers",
        "subtitle": "聊电影、追美剧与防止剧透",
        "sentences": [
            make_sentence("Did you binge-watch the new season of Stranger Things last night?", "你昨晚连夜追完《怪奇物语》最新一季了吗？", "/dɪd juː bɪndʒ wɑːtʃ ðə nuː ˈsiːzn əv Stranger Things læst naɪt/", "binge-watch", "刷剧/连夜追剧"),
            make_sentence("I finished five episodes! The cliffhanger at the end blew my mind.", "我一口气看了五集！结尾的悬念简直颠覆我的想象。", "/aɪ ˈfɪnɪʃt faɪv ˈepɪsoʊdz! ðə ˈklɪfhæŋər æt ðə end bluː maɪ maɪnd/", "cliffhanger", "悬念结尾"),
            make_sentence("No spoilers please! I'm only on episode two.", "请千万不要剧透！我才看到第二集呢。", "/noʊ ˈspɔɪlərz pliːz! aɪm ˈoʊnli ɑːn ˈepɪsoʊd tuː/", "spoilers", "剧透")
        ]
    },
    {
        "id": "grocery_aisle",
        "title": "🛒 5. Grocery Shopping & Organic Produce",
        "subtitle": "超市生鲜挑选与定位探寻",
        "sentences": [
            make_sentence("Excuse me, which aisle is the gluten-free bread located in?", "打扰一下，请问无麸质面包在哪个过道？", "/ɪkˈskjuːz miː, wɪtʃ aɪl ɪz ðə ˈɡluːtn friː bred loʊˈkeɪtɪd ɪn/", "gluten-free", "无麸质的"),
            make_sentence("It's in aisle three, right next to the organic dairy products.", "在第三过道，就在有机乳制品隔壁。", "/ɪts ɪn aɪl θriː, raɪt nekst tuː ðə ɔːrˈɡænɪk ˈderi ˈprɑːdʌkts/", "dairy products", "乳制品"),
            make_sentence("Is there a discount on these avocados if I buy a box?", "如果我买一整盒这种牛油果，有折扣优惠吗？", "/ɪz ðer ə ˈdɪskaʊnt ɑːn ðiːz ˌævəˈkɑːdoʊz ɪf aɪ baɪ ə bɑːks/", "discount", "折扣")
        ]
    },
    {
        "id": "happy_hour_master",
        "title": "🍻 6. Happy Hour & Bar Socializing",
        "subtitle": "酒吧 Happy Hour 点酒与破冰社交",
        "sentences": [
            make_sentence("Is this seat taken, or mind if I grab a chair?", "这个位置有人吗，介意我拉把椅子坐这里吗？", "/ɪz ðɪs siːt ˈteɪkən, ɔːr maɪnd ɪf aɪ ɡræb ə tʃer/", "grab a chair", "拉把椅子坐"),
            make_sentence("Not at all! Bartender, another IPA on tap for my friend here.", "完全不介意！调酒师，给我的朋友来一杯扎啤 IPA。", "/nɑːt æt ɔːl! ˈbɑːrtendər, əˈnʌðər IPA ɑːn tæp fɔːr maɪ frend hɪər/", "on tap", "现压扎啤"),
            make_sentence("Cheers to Friday night and good company!", "为周五夜晚和绝妙的同伴干杯！", "/tʃɪərz tuː ˈfraɪdeɪ naɪt ænd ɡʊd ˈkʌmpəni/", "good company", "好的同伴")
        ]
    },
    {
        "id": "house_lease",
        "title": "🏠 7. Apartment Renting & Lease Agreement",
        "subtitle": "美式租房看房与签署 Lease 协议",
        "sentences": [
            make_sentence("Is the security deposit refundable upon moving out?", "搬走时押金是全额退还的吗？", "/ɪz ðə sɪˈkjʊrəti dɪˈpɑːzɪt rɪˈfʌndəbl əˈpɑːn ˈmuːvɪŋ aʊt/", "refundable", "可退还的"),
            make_sentence("Yes, provided there is no major damage to the property.", "是的，只要对房间设施没有重大损坏。", "/jes, prəˈvaɪdɪd ðer ɪz noʊ ˈmeɪdʒər ˈdæmɪdʒ tuː ðə ˈprɑːpərti/", "provided", "前提是"),
            make_sentence("Are pets allowed in the building?", "大楼里允许养宠物吗？", "/ɑːr pets əˈlaʊd ɪn ðə ˈbɪldɪŋ/", "pets allowed", "允许养宠物")
        ]
    },
    {
        "id": "pizza_venmo_split",
        "title": "🍕 8. Ordering Pizza & Venmo Bill Splitting",
        "subtitle": "美式聚会点披萨与 Venmo 分账",
        "sentences": [
            make_sentence("Let's order two large pepperoni pizzas and garlic knots.", "我们点两份大号意式香肠披萨和大蒜面包结吧。", "/lets ˈɔːrdər tuː lɑːrdʒ ˌpepəˈroʊni ˈpiːtsəz ænd ˈɡɑːrlɪk nɑːts/", "garlic knots", "大蒜面包结"),
            make_sentence("Just Venmo me your share once the delivery arrives.", "外卖一到，直接用 Venmo 把你那份转给我就行。", "/dʒʌst Venmo miː jʊər ʃer wʌns ðə dɪˈlɪvəri əˈraɪvz/", "Venmo me", "转账给我")
        ]
    },
    {
        "id": "gym_workout",
        "title": "🏃 9. Gym Workout & Personal Training",
        "subtitle": "健身房锻炼与私人教练计划",
        "sentences": [
            make_sentence("Are you using this squat rack, or can I work in?", "你在用这个蹲腿架吗，我可以组间轮流一起用吗？", "/ɑːr juː ˈjuːzɪŋ ðɪs skwɑːt ræk, ɔːr kæn aɪ wɜːrk ɪn/", "work in", "组间轮流交替使用"),
            make_sentence("Go ahead! I have one set left before finishing.", "你用吧！我还有最后一组就练完了。", "/ɡoʊ əˈhed! aɪ hæv wʌn set left bɪˈfɔːr ˈfɪnɪʃɪŋ/", "one set left", "剩下一组")
        ]
    },
    {
        "id": "hair_salon",
        "title": "💇 10. Hair Salon & Styling Preferences",
        "subtitle": "理发店剪发与造型需求表达",
        "sentences": [
            make_sentence("Just a trim on the sides, and keep some length on top, please.", "两边修剪短一点，上面保留一点长度，谢谢。", "/dʒʌst ə trɪm ɑːn ðə saɪdz, ænd kiːp sʌm leŋθ ɑːn tɑːp, pliːz/", "trim", "修剪短"),
            make_sentence("Would you like a fade on the back?", "后脑勺需要推一个渐变层（Fade）吗？", "/wʊd juː laɪk ə feɪd ɑːn ðə bæk/", "fade", "渐变推短发型")
        ]
    },
    {
        "id": "pet_care",
        "title": "🐶 11. Pet Care, Vet Visit & Dog Walking",
        "subtitle": "宠物看兽医与遛狗日常对话",
        "sentences": [
            make_sentence("My Golden Retriever needs her annual vaccination shot today.", "我的金毛寻回犬今天需要打年度疫苗。", "/maɪ ˈɡoʊldən rɪˈtriːvər niːdz hɜːr ˈænjuəl ˌvæksɪˈneɪʃn ʃɑːt təˈdeɪ/", "vaccination shot", "疫苗针"),
            make_sentence("She is super friendly and loves chasing tennis balls in the park.", "她特别友善，平时最喜欢在公园里追网球玩。", "/ʃiː ɪz ˈsuːpər ˈfrendli ænd lʌvz ˈtʃeɪsɪŋ ˈtenɪs bɔːlz ɪn ðə pɑːrk/", "friendly", "友善的")
        ]
    },
    {
        "id": "gas_station",
        "title": "🚗 12. Gas Station & Car Maintenance",
        "subtitle": "自助加油站与汽油号数选择",
        "sentences": [
            make_sentence("Fill it up with regular unleaded on pump number four, please.", "四号加油枪，麻烦请帮我加满 87 号无铅汽油。", "/fɪl ɪt ʌp wɪð ˈreɡjələr ʌnˈledɪd ɑːn pʌmp ˈnʌmbər fɔːr, pliːz/", "regular unleaded", "普通无铅汽油"),
            make_sentence("Could you check my tire pressure and windshield wiper fluid?", "能顺便帮我检查下胎压和雨刮水吗？", "/kʊd juː tʃek maɪ taɪər ˈpreʃər ænd ˈwɪndʃiːld ˈwaɪpər ˈfluːɪd/", "tire pressure", "胎压")
        ]
    }
]

workplace_topics = [
    {
        "id": "elevator_pitch_pro",
        "title": "💼 1. Elevator Pitch & Networking Event",
        "subtitle": "硅谷高管级 30 秒电梯演讲与 Networking 社交",
        "sentences": [
            make_sentence("Hi! I'm Alex, leveraging generative AI to automate enterprise workflow automation.", "你好！我是 Alex，目前正在利用生成式 AI 自动化赋能企业工作流。", "/haɪ! aɪm ˈælɪks, ˈlevərɪdʒɪŋ ˈdʒenərətɪv AI tuː ˈɔːtəmeɪt ˈentərpraɪz ˈwɜːrkfloʊ/", "leveraging", "充分利用"),
            make_sentence("We've reduced customer onboarding time by over sixty percent quarter-over-quarter.", "我们成功将客户入职体验流程耗时环比降低了 60% 以上。", "/wiːv rɪˈduːst ˈkʌstəmər ˈɑːnboʊrdɪŋ taɪm baɪ ˈoʊvər ˈsɪksti pərˈsent/", "onboarding", "引导入职"),
            make_sentence("That is incredible traction! Let me grab your LinkedIn to stay connected.", "那业务增长势头太惊人了！加个 LinkedIn 保持联系吧。", "/ðæt ɪz ɪnˈkredəbl ˈtrækʃn! let miː ɡræb jʊər LinkedIn tuː steɪ kəˈnektɪd/", "traction", "增长势头")
        ]
    },
    {
        "id": "agile_sprint_pro",
        "title": "📊 2. Product Sprint Planning & Daily Standup",
        "subtitle": "科技公司敏捷开发、Sprint 站会与需求确认",
        "sentences": [
            make_sentence("Good morning team! Let's kick off our daily standup meeting.", "大家早上好！我们开始今天的每日敏捷站会吧。", "/ɡʊd ˈmɔːrnɪŋ tiːm! lets kɪk ɔːf aʊər ˈdeɪli ˈstændʌp ˈmiːtɪŋ/", "kick off", "开启"),
            make_sentence("Yesterday I refactored the API authentication module. No blockers on my end.", "昨天我重构了 API 鉴权模块。我这边目前没有任何阻碍卡点。", "/ˈjestərdeɪ aɪ riːˈfæktərd ðə API ɔːˌθentɪˈkeɪʃn ˈmɑːdjuːl. noʊ ˈblɑːkərz ɑːn maɪ end/", "blockers", "阻碍卡点"),
            make_sentence("Great! Let's ensure high test coverage before pushing to production.", "太棒了！推上线前请确保有高比例的测试覆盖率。", "/ɡreɪt! lets ɪnˈʃʊr haɪ test ˈkʌvərɪdʒ bɪˈfɔːr ˈpʊʃɪŋ tuː prəˈdʌkʃn/", "production", "生产环境")
        ]
    },
    {
        "id": "salary_negotiation_pro",
        "title": "🔥 3. Salary Negotiation & Offer Counter",
        "subtitle": "硅谷高薪 Offer 谈判与 Counteroffer 争论",
        "sentences": [
            make_sentence("Thank you for extending the job offer. I'm really thrilled about this team.", "感谢贵公司发放该职位 Offer。我对加入该团队感到非常激动。", "/θæŋk juː fɔːr ɪkˈstendɪŋ ðə dʒɑːb ˈɔːfər. aɪm ˈriːəli θrɪld əˈbaʊt ðɪs tiːm/", "thrilled", "极其激动"),
            make_sentence("Based on my market value and competing offers, can we discuss stock equity compensation?", "基于我的市场价值以及手头的竞争 Offer，我们能探讨下股票期权回报吗？", "/beɪst ɑːn maɪ ˈmɑːrkɪt ˈvæljuː, kæn wiː dɪˈskʌs stɑːk ˈekwəti ˌkɑːmpenˈseɪʃn/", "equity compensation", "股权期权薪酬"),
            make_sentence("We can bump up your signing bonus by twenty percent to bridge the gap.", "我们可以将您的签字费额外提升 20%，来弥补这部分的预期差距。", "/wiː kæn bʌmp ʌp jʊər ˈsaɪnɪŋ ˈboʊnəs baɪ ˈtwenti pərˈsent tuː brɪdʒ ðə ɡæp/", "bridge the gap", "弥补差距")
        ]
    },
    {
        "id": "conflict_resolution_pro",
        "title": "🧠 4. Brainstorming & Elegant Objections",
        "subtitle": "高情商头脑风暴与优雅化解团队分歧",
        "sentences": [
            make_sentence("I completely see where you're coming from, but have we considered scalability?", "我完全理解你的立足点与初衷，但我们是否有考虑到长期的架构扩展性呢？", "/aɪ kəmˈpliːtli siː wer jʊər ˈkʌmɪŋ frʌm, bʌt hæv wiː kənˈsɪdərd ˌskeɪləˈbɪləti/", "see where you're coming from", "理解你的立场"),
            make_sentence("That's a valid point. Let's run a quick A/B test to validate user feedback.", "这是个很有说服力的要点。我们来做个快速 A/B 测试来验证用户反馈吧。", "/ðæts ə ˈvælɪd pɔɪnt. lets rʌn ə kwɪk A/B test tuː ˈvælɪdeɪt ˈjuːzər ˈfiːdbæk/", "valid point", "切题中肯要点")
        ]
    },
    {
        "id": "vc_pitch",
        "title": "🚀 5. Startup Fundraising & VC Pitching",
        "subtitle": "创业项目融资与风投 Pitch",
        "sentences": [
            make_sentence("Our monthly active user base grew three hundred percent year-over-year.", "我们的月活跃用户基数同比暴涨了 300%。", "/aʊər ˈmʌnθli ˈæktɪv ˈjuːzər beɪs ɡruː θriː ˈhʌndrəd pərˈsent jɪər oʊvər jɪər/", "year-over-year", "同比暴涨"),
            make_sentence("We are raising a Series A round to accelerate international expansion.", "我们正在进行 A 轮融资，以加速拓展全球国际市场。", "/wiː ɑːr ˈreɪzɪŋ ə ˈsɪriːz A raʊnd tuː əkˈseləreɪt ˌɪntərˈnæʃnəl ɪkˈspænʃn/", "Series A", "A轮融资")
        ]
    },
    {
        "id": "email_alignment",
        "title": "📧 6. Email Alignment & Project Delivery",
        "subtitle": "商务邮件对齐与交付时间节点确认",
        "sentences": [
            make_sentence("Please find attached the updated roadmap for your final review.", "请查收附件中更新后的路线图供您最终审阅。", "/pliːz faɪnd əˈtætʃt ðə ˌʌpˈdeɪtɪd ˈroʊdmæp fɔːr jʊər ˈfaɪnl rɪˈvjuː/", "attached", "附件的"),
            make_sentence("Let's touch base tomorrow to confirm the launch checklist.", "我们明天碰一下，确认上线的 Checklist 清单。", "/lets tʌtʃ beɪs təˈmɑːroʊ tuː kənˈfɜːrm ðə lɔːntʃ ˈtʃeklɪst/", "checklist", "检查清单")
        ]
    }
]

travel_topics = [
    {
        "id": "flight_rebook_pro",
        "title": "✈️ 1. Flight Delay & Rebooking at Airport Desk",
        "subtitle": "美式机场航班延误拉扯与免费改签",
        "sentences": [
            make_sentence("My connecting flight to San Francisco was cancelled due to severe thunderstorm.", "我飞往旧金山的转机航班因强雷暴天气被不幸取消了。", "/maɪ kəˈnektɪŋ flaɪt tuː sæn frənˈsɪskoʊ wəz ˈkænsld duː tuː sɪˈvɪər ˈθʌndərstɔːrm/", "connecting flight", "转机航班"),
            make_sentence("I can rebook you on the next available direct flight at no extra charge.", "我可以免费帮您改签到下一班有空位的直飞航班。", "/aɪ kæn riːˈbʊk juː ɑːn ðə nekst əˈveɪləbl dəˈrekt flaɪt æt noʊ ˈekstrə tʃɑːrdʒ/", "rebook", "改签"),
            make_sentence("Could you also provide me with a meal voucher and hotel accommodation?", "您还能为我提供一张餐券以及今晚的酒店住宿安排吗？", "/kʊd juː ˈɔːlsoʊ prəˈvaɪd miː wɪð ə miːl ˈvaʊtʃər ænd hoʊˈtel əˌkɑːməˈdeɪʃn/", "meal voucher", "餐券")
        ]
    },
    {
        "id": "car_rental_pro",
        "title": "🚘 2. Renting a Car at Hertz & Insurance Choice",
        "subtitle": "Hertz 海外租车、车型升级与全险选择",
        "sentences": [
            make_sentence("I reserved a full-size SUV for a one-week California road trip.", "我预订了一辆全尺寸 SUV，准备去加州自驾游玩一周。", "/aɪ rɪˈzɜːrvd ə fʊl saɪz SUV fɔːr ə wʌn wiːk road trip/", "road trip", "公路自驾游"),
            make_sentence("Would you like to add full collision damage waiver coverage for peace of mind?", "为了出行安心，您是否需要添加全额碰撞险（CDW）保障？", "/wʊd juː laɪk tuː æd fʊl kəˈlɪʒn ˈdæmɪdʒ ˈweɪvər ˈkʌvərɪdʒ fɔːr piːs əv maɪnd/", "collision damage waiver", "车辆碰撞险/CDW")
        ]
    },
    {
        "id": "medical_er_pro",
        "title": "🚑 3. Urgent Care & Hospital ER Consultation",
        "subtitle": "海外紧急看病 Urgent Care 与医生求助",
        "sentences": [
            make_sentence("Doctor, I have a severe throbbing headache and high fever since last night.", "医生，我从昨晚起就一直剧烈偏头痛并伴有高烧。", "/ˈdɑːktər, aɪ hæv ə sɪˈvɪər ˈθrɑːbɪŋ ˈhedeɪk ænd haɪ ˈfiːvər sɪns læst naɪt/", "throbbing headache", "阵痛型头痛"),
            make_sentence("Let me take your blood pressure and prescribe some antibiotics for you.", "让我量一下您的血压，并为您开一些抗生素药物。", "/let miː teɪk jʊər blʌd ˈpreʃər ænd prɪˈskraɪb sʌm ˌæntibaɪˈɑːtɪks fɔːr juː/", "prescribe antibiotics", "开抗生素处方")
        ]
    },
    {
        "id": "fine_dining",
        "title": "🍽️ 4. Fine Dining & Wine Pairing",
        "subtitle": "高档米其林餐厅预订与侍酒师配酒",
        "sentences": [
            make_sentence("Good evening, we have a table reserved for two under Turner.", "晚上好，我们有一桌 Turner 名下的二人预订。", "/ɡʊd ˈiːvnɪŋ, wiː hæv ə ˈteɪbl rɪˈzɜːrvd fɔːr tuː ˈʌndər ˈtɜːrnər/", "table reserved", "预订桌位"),
            make_sentence("Which red wine would you recommend pairing with our dry-aged ribeye steak?", "您推荐哪款红葡萄酒来搭配我们的干式熟成肋眼牛排呢？", "/wɪtʃ red waɪn wʊd juː ˌrekəˈmend ˈperɪŋ wɪð aʊər draɪ eɪdʒd ˈrɪbaɪ steɪk/", "wine pairing", "葡萄酒搭配")
        ]
    },
    {
        "id": "outlet_shopping",
        "title": "🛍️ 5. Outlet Shopping & Tax Refunds",
        "subtitle": "奥特莱斯名牌折扣购物与海关退税",
        "sentences": [
            make_sentence("Is there an extra discount coupon available for international tourists?", "请问针对国际游客有额外的折扣优惠券可以领取吗？", "/ɪz ðer ən ˈekstrə ˈdɪskaʊnt ˈkuːpɑːn əˈveɪləbl fɔːr ˌɪntərˈnæʃnəl ˈtʊrɪsts/", "coupon", "优惠券"),
            make_sentence("Where can I validate my tax refund receipt at the airport?", "请问在机场的哪里可以盖章核销我的退税单据？", "/wer kæn aɪ ˈvælɪdeɪt maɪ tæks ˈriːfʌnd rɪˈsiːt æt ðə ˈerpɔːrt/", "tax refund", "退税")
        ]
    }
]

idioms_topics = [
    {
        "id": "tech_buzzwords_pro",
        "title": "⚡ Pack 1: Silicon Valley Tech Buzzwords",
        "subtitle": "硅谷高管与科技圈必会高频黑话",
        "sentences": [
            make_sentence("Let's touch base next Monday to do a deep dive into the user data.", "我们下周一简单对接碰撞下，深入探究挖掘下用户数据。", "/lets tʌtʃ beɪs nekst ˈmʌndeɪ tuː duː ə diːp daɪv ˈɪntuː ðə ˈjuːzər ˈdeɪtə/", "touch base", "对接/碰一下"),
            make_sentence("We should focus on low-hanging fruit to boost quick wins.", "我们应该先着眼于那些最容易落地的目标，去争取快速胜果。", "/wiː ʃʊd ˈfoʊkəs ɑːn loʊ ˈhæŋɪŋ fruːt tuː buːst kwɪk wɪnz/", "low-hanging fruit", "容易落地的成果"),
            make_sentence("This new paradigm shift will reshape the entire artificial intelligence industry.", "这场全新的范式变革将彻底重塑整个人工智能行业。", "/ðɪs nuː ˈpærədaɪm ʃɪft wɪl riːˈʃeɪp ðə ɪnˈtaɪər ˌɑːrtɪˈfɪʃl ɪnˈtelɪdʒəns ˈɪndəstri/", "paradigm shift", "范式转移/重大变革")
        ]
    },
    {
        "id": "native_connectors_pro",
        "title": "💬 Pack 2: Native Conversational Connectors",
        "subtitle": "母语者口头禅与地道连接词宝典",
        "sentences": [
            make_sentence("Long story short, at the end of the day, quality matters most.", "长话短说，归根结底，质量才是最关键的。", "/lɔːŋ ˈstɔːri ʃɔːrt, æt ðə end əv ðə deɪ, ˈkwɑːləti ˈmætərz moʊst/", "Long story short", "长话短说"),
            make_sentence("Off the top of my head, I'd say the market potential is huge.", "凭我的第一直觉脱口而出的话，我认为市场潜力巨大。", "/ɔːf ðə tɑːp əv maɪ hed, aɪd seɪ ðə ˈmɑːrkɪt pəˈtenʃl ɪz hjuːdʒ/", "Off the top of my head", "凭第一直觉"),
            make_sentence("To be honest, as far as I'm concerned, it's a win-win situation.", "老实说，在我看来，这是一个双赢的局面。", "/tuː biː ˈɑːnɪst, æz fɑːr æz aɪm kənˈsɜːrnd, ɪts ə wɪn wɪn ˌsɪtʃuˈeɪʃn/", "To be honest", "老实说")
        ]
    },
    {
        "id": "slang_idioms_master_pro",
        "title": "😎 Pack 3: Street Slang & Modern American Idioms",
        "subtitle": "美式地道口语俚语与流行词汇（高手必备）",
        "sentences": [
            make_sentence("This iced coffee really hits the spot on a hot summer afternoon!", "这杯冰咖啡在炎热的夏天下午喝起来简直太解爽/到位了！", "/ðɪs aɪst ˈkɔːfi ˈriːəli hɪts ðə spɑːt ɑːn ə hɑːt ˈsʌmər ˌæftərˈnuːn/", "hits the spot", "令人满意解爽"),
            make_sentence("Are we all on the same page regarding the launch timeline?", "关于上线的时间表，我们大家的步调和理解都一致吗？", "/ɑːr wiː ɔːl ɑːn ðə seɪm peɪdʒ rɪˈɡɑːrdɪŋ ðə lɔːntʃ ˈtaɪmlaɪn/", "on the same page", "达成共识/步调一致"),
            make_sentence("No cap, this AI tool is an absolute game changer for developers!", "绝不吹牛/真没骗你，这款 AI 工具对开发者而言绝对是颠覆性的神器！", "/noʊ kæp, ðɪs AI tuːl ɪz ən ˈæbsəluːt ɡeɪm ˈtʃeɪndʒər fɔːr dɪˈveləpərz/", "No cap", "不吹牛/说真的")
        ]
    },
    {
        "id": "smalltalk_starters",
        "title": "🔥 Pack 4: Daily Small Talk Starters",
        "subtitle": "破冰闲聊最高频金句卡片",
        "sentences": [
            make_sentence("How's your day treating you so far?", "你今天过得怎么样？至今还顺心吗？", "/haʊz jʊər deɪ ˈtriːtɪŋ juː soʊ fɑːr/", "treating you", "过得如何"),
            make_sentence("Can you believe this weather we're having?", "你能相信今天这种神仙/恶劣天气吗？", "/kæn juː bɪˈliːv ðɪs ˈweðər wiːr ˈhævɪŋ/", "weather talk", "天气破冰")
        ]
    },
    {
        "id": "encouragement_pack",
        "title": "💪 Pack 5: High-Impact Encouragement & Support",
        "subtitle": "鼓励与支持朋友的地道口语表达",
        "sentences": [
            make_sentence("Hang in there! You are stronger than you think.", "咬牙坚持住！你远比你自己想象的更强大。", "/hæŋ ɪn ðer! juː ɑːr ˈstrɔːŋɡər ðæn juː θɪŋk/", "Hang in there", "坚持住/挺住"),
            make_sentence("I've got your back no matter what happens.", "无论发生什么事，我都会在背后支持你！", "/aɪv ɡɑːt jʊər bæk noʊ ˈmætər wʌt ˈhæpənz/", "got your back", "为你撑腰/支持你")
        ]
    }
]

scenarios_data = {
    "casual": casual_topics,
    "workplace": workplace_topics,
    "travel": travel_topics,
    "idioms": idioms_topics
}

with open("data/scenarios.json", "w", encoding="utf-8") as f:
    json.dump(scenarios_data, f, ensure_ascii=False, indent=2)

total_topics = len(casual_topics) + len(workplace_topics) + len(travel_topics) + len(idioms_topics)
total_sentences = sum(len(t["sentences"]) for cat in scenarios_data.values() for t in cat)
print(f"Generated massive scenarios dataset! Total Topics: {total_topics}, Total Sentences: {total_sentences}")
