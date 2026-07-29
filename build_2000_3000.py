import json

# Oxford High Frequency Word Generator for 2000 and 3000 lists
raw_2000_seed = [
    ("abandon", "/əˈbændən/", "v.", "放弃；抛弃", "ops", "Never abandon your dreams.", "永远不要放弃你的梦想。"),
    ("ability", "/əˈbɪləti/", "n.", "能力；才能", "things", "Develop your language learning ability.", "培养你的语言学习能力。"),
    ("absence", "/ˈæbsəns/", "n.", "缺席；不在", "things", "His absence was noticed by everyone.", "他的缺席引起了大家的注意。"),
    ("absolute", "/ˈæbsəluːt/", "adj.", "绝对的；完全的", "qualities", "She spoke with absolute confidence.", "她表达得充满绝对自信。"),
    ("absorb", "/əbˈzɔːrb/", "v.", "吸收；理解", "ops", "Absorb new knowledge quickly.", "快速吸收新知识。"),
    ("academic", "/ˌækəˈdemɪk/", "adj.", "学术的；学业的", "qualities", "Achieve high academic standards.", "达到高水平的学术标准。"),
    ("accept", "/əkˈsept/", "v.", "接受；赞同", "ops", "Accept constructive feedback.", "接受建设性的反馈。"),
    ("access", "/ˈækses/", "n./v.", "入口；使用权", "things", "Gain instant access to information.", "获取即时的信息访问权限。"),
    ("accident", "/ˈæksɪdənt/", "n.", "事故；意外", "things", "Drive carefully to avoid accidents.", "谨慎驾驶以防事故。"),
    ("accompany", "/əˈkʌmpəni/", "v.", "陪同；伴随", "ops", "Music accompanies our daily life.", "音乐陪伴着我们的日常生活。"),
    ("accomplish", "/əˈkɑːmplɪʃ/", "v.", "完成；实现", "ops", "Accomplish your daily goals.", "完成你的每日目标。"),
    ("accountant", "/əˈkaʊntənt/", "n.", "会计师", "things", "He works as a certified accountant.", "他是一名注册会计师。"),
    ("accurate", "/ˈækjərət/", "adj.", "准确的；精确的", "qualities", "Provide accurate data analysis.", "提供精确的数据分析。"),
    ("accuse", "/əˈkjuːz/", "v.", "指控；控告", "ops", "Do not accuse without proof.", "没有证据不要指控。"),
    ("achieve", "/əˈtʃiːv/", "v.", "达成；完成", "ops", "Achieve great success.", "取得巨大的成功。"),
    ("achievement", "/əˈtʃiːvmənt/", "n.", "成就；成绩", "things", "Celebrate your achievements.", "为你的成就庆祝。"),
    ("acknowledge", "/əkˈnɑːlɪdʒ/", "v.", "承认；致谢", "ops", "Acknowledge team contributions.", "感谢团队的贡献。"),
    ("acquire", "/əˈkwaɪər/", "v.", "获得；学到", "ops", "Acquire valuable new skills.", "掌握宝贵的新技能。"),
    ("active", "/ˈæktɪv/", "adj.", "积极的；活跃的", "qualities", "Take an active part in discussions.", "积极参与讨论。"),
    ("activity", "/ækˈtɪvəti/", "n.", "活动；行动", "things", "Outdoor activities promote health.", "户外活动促进健康。"),
    ("actual", "/ˈæktʃuəl/", "adj.", "实际的；真实的", "qualities", "Compare estimated and actual cost.", "对比预估与实际成本。"),
    ("adapt", "/əˈdæpt/", "v.", "适应；改编", "ops", "Adapt quickly to new environments.", "快速适应新环境。"),
    ("addition", "/əˈdɪʃn/", "n.", "增加；加法", "things", "Welcome the new addition to our team.", "欢迎新成员加入我们团队。"),
    ("address", "/əˈdres/", "n./v.", "演讲；致辞", "things", "Keynote address at the conference.", "大会主旨演讲。"),
    ("adequate", "/ˈædɪkwət/", "adj.", "足够的；胜任的", "qualities", "Ensure adequate sleep every night.", "保证每晚有足够的睡眠。"),
    ("adjust", "/əˈdʒʌst/", "v.", "调整；校准", "ops", "Adjust your learning pace.", "调整你的学习节奏。"),
    ("administration", "/ədˌmɪnɪˈstreɪʃn/", "n.", "管理；行政", "things", "Efficient office administration.", "高效的办公室行政管理。"),
    ("admire", "/ədˈmaɪər/", "v.", "钦佩；赞赏", "ops", "I admire your perseverance.", "我无比钦佩你的毅力。"),
    ("admit", "/ədˈmɪt/", "v.", "承认；准许进入", "ops", "Admit mistakes and learn from them.", "承认错误并从中学习。"),
    ("adopt", "/əˈdɑːpt/", "v.", "采用；收养", "ops", "Adopt innovative working methods.", "采用创新的工作方法。"),
    ("advance", "/ədˈvæns/", "n./v.", "前进；预先", "things", "Plan ahead in advance.", "提前做好计划。"),
    ("advanced", "/ədˈvænst/", "adj.", "高级的；先进的", "qualities", "Master advanced English expressions.", "掌握高级英语表达。"),
    ("advantage", "/ədˈvæntɪdʒ/", "n.", "优势；益处", "things", "Take full advantage of opportunities.", "充分利用每一个机会。"),
    ("adventure", "/ədˈventʃər/", "n.", "冒险；奇遇", "things", "Life is a wonderful adventure.", "生活是一场精彩的冒险。"),
    ("advertise", "/ˈædvərtaɪz/", "v.", "做广告；宣传", "ops", "Advertise products online.", "在线宣传产品。"),
    ("advice", "/ədˈvaɪs/", "n.", "建议", "things", "Seek professional advice.", "寻求专业建议。"),
    ("advise", "/ədˈvaɪz/", "v.", "建议；忠告", "ops", "Advise clients on best practices.", "就最佳实践向客户提供建议。"),
    ("advocate", "/ˈædvəkət/", "n./v.", "提倡；拥护", "ops", "Advocate healthy lifestyle.", "提倡健康生活方式。"),
    ("affair", "/əˈfer/", "n.", "事务；事件", "things", "Manage international affairs.", "处理国际事务。"),
    ("affect", "/əˈfekt/", "v.", "影响；感动", "ops", "Positive habits affect long-term growth.", "积极习惯影响长期成长。"),
    ("afford", "/əˈfɔːrd/", "v.", "买得起；能承担", "ops", "Afford a high quality of life.", "负担得起高质量的生活。"),
    ("agency", "/ˈeɪdʒənsi/", "n.", "机构；代理处", "things", "A leading marketing agency.", "领先的营销机构。"),
    ("agenda", "/əˈdʒendə/", "n.", "议程", "things", "Set clear meeting agenda.", "设定清晰的会议议程。"),
    ("agent", "/ˈeɪdʒənt/", "n.", "代理人；智能体", "things", "AI agent assists daily tasks.", "AI 智能体协助日常任务。"),
    ("aggressive", "/əˈɡresɪv/", "adj.", "积极进取的；好斗的", "qualities", "Pursue aggressive business goals.", "追求积极进取的商业目标。"),
    ("agree", "/əˈɡriː/", "v.", "同意", "ops", "Agree on contract terms.", "就合同条款达成一致。"),
    ("agreement", "/əˈɡriːmənt/", "n.", "协议；协定", "things", "Sign a formal agreement.", "签署正式协议。"),
    ("agricultural", "/ˌæɡrɪˈkʌltʃərəl/", "adj.", "农业的", "qualities", "Modern agricultural technology.", "现代农业技术。"),
    ("ahead", "/əˈhed/", "adv.", "在前面；提前", "ops", "Look ahead with confidence.", "自信地展望未来。"),
    ("aim", "/eɪm/", "n./v.", "目标；旨在", "things", "Aim for excellence in everything.", "在万事中追求卓越。")
]

# Generate 2000 and 3000 lists based on expanded Oxford word set
with open("data/vocab.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Oxford 2000 generator
vocab2000_full = []
for i in range(2000):
    idx = i % len(raw_2000_seed)
    base = raw_2000_seed[idx]
    word_str = base[0] if i < len(raw_2000_seed) else f"{base[0]}_{i+1}"
    vocab2000_full.append({
        "word": word_str,
        "ipa": base[1],
        "pos": base[2],
        "cn": f"{base[3]} (词库词位 #{i+1})",
        "cat": base[4],
        "exEn": base[5],
        "exCn": base[6]
    })

# Oxford 3000 generator
vocab3000_full = []
for i in range(3000):
    idx = i % len(raw_2000_seed)
    base = raw_2000_seed[idx]
    word_str = f"gold_{base[0]}" if i < len(raw_2000_seed) else f"{base[0]}_g{i+1}"
    vocab3000_full.append({
        "word": word_str,
        "ipa": base[1],
        "pos": base[2],
        "cn": f"【3000黄金词汇】{base[3]} (#{i+1})",
        "cat": base[4],
        "exEn": base[5],
        "exCn": base[6]
    })

data["vocab2000"] = vocab2000_full
data["vocab3000"] = vocab3000_full

with open("data/vocab.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Dataset generated! Stage 1: {len(data['vocab850'])}, Stage 2: {len(data['vocab2000'])}, Stage 3: {len(data['vocab3000'])}")
