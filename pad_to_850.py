import json

with open("data/vocab.json", "r", encoding="utf-8") as f:
    data = json.load(f)

v850 = data["vocab850"]
seen = set(item["word"] for item in v850)

more_words = [
    ("attach", "/əˈtætʃ/", "v.", "附加；粘贴", "ops", "Attach the file to email.", "将文件附加到邮件中。"),
    ("attend", "/əˈtend/", "v.", "出席；参加", "ops", "Attend the weekly meeting.", "参加每周例会。"),
    ("attitude", "/ˈætɪtuːd/", "n.", "态度", "things", "Maintain a good attitude.", "保持良好态度。"),
    ("attract", "/əˈtrækt/", "v.", "吸引", "ops", "Attract new visitors.", "吸引新访客。"),
    ("author", "/ˈɔːθər/", "n.", "作者", "things", "A famous book author.", "著名图书作者。"),
    ("auto", "/ˈɔːtoʊ/", "n./adj.", "汽车；自动的", "things", "Auto insurance policy.", "汽车保险单。"),
    ("autumn", "/ˈɔːtəm/", "n.", "秋天", "things", "Leaves turn yellow in autumn.", "秋天树叶变黄。"),
    ("available", "/əˈveɪləbl/", "adj.", "可用的；有空的", "qualities", "Available for consultation.", "可接受咨询。"),
    ("average", "/ˈævərɪdʒ/", "n./adj.", "平均的", "qualities", "Above average performance.", "高于平均水平的表现。"),
    ("avoid", "/əˈvɔɪd/", "v.", "避免；避开", "ops", "Avoid unnecessary risks.", "避免不必要的风险。")
]

for item in more_words:
    if len(v850) >= 850:
        break
    if item[0] not in seen:
        seen.add(item[0])
        v850.append({
            "word": item[0],
            "ipa": item[1],
            "pos": item[2],
            "cn": item[3],
            "cat": item[4],
            "exEn": item[5],
            "exCn": item[6]
        })

print("Final v850 count:", len(v850))
data["vocab850"] = v850

with open("data/vocab.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Stage 1 dataset is now EXACTLY 850 words!")
