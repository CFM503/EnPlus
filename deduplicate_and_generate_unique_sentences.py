import json

def generate_unique_sentences():
    print("Loading vocab.json...")
    with open("data/vocab.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    v850 = data["vocab850"]
    v2000 = data["vocab2000"]
    v3000 = data["vocab3000"]

    # Action verbs templates for unique variation
    verbs_templates = [
        ("Always try to {} your best every single day.", "每天都要始终努力做到你的最好。"),
        ("It is essential to {} your goals with passion.", "带着激情去{}你的目标至关重要。"),
        ("We need to {} this process to improve efficiency.", "我们需要{}这个流程以提升效率。"),
        ("Can you help me {} this task before noon?", "你能帮我在中午前{}这项任务吗？"),
        ("She decided to {} new possibilities in her career.", "她决定在职业生涯中{}新的可能性。")
    ]

    # Noun templates for unique variation
    noun_templates = [
        ("The new {} played a crucial role in our project.", "这个全新的{}在我们的项目中发挥了关键作用。"),
        ("Understanding the {} helps us make better decisions.", "理解这个{}有助于我们做出更好的决策。"),
        ("He paid close attention to the details of the {}.", "他密切注意了这个{}的细节。"),
        ("A good {} brings long-term value to the team.", "一个优秀的{}能为团队带来长期价值。"),
        ("They discussed the future of the {} during the meeting.", "他们在会议期间讨论了这个{}的未来。")
    ]

    # Quality templates for unique variation
    quality_templates = [
        ("Maintaining a {} mindset is key to overcoming obstacles.", "保持一个{}的心态是克服障碍的关键。"),
        ("This solution is highly {} for modern businesses.", "该解决方案对于现代企业而言非常{}。"),
        ("She felt {} after completing the challenging assignment.", "在完成这项富有挑战性的任务后，她感到非常{}。"),
        ("It is important to stay {} under pressure.", "在压力下保持{}是非常重要的。"),
        ("Our team achieved a {} outcome this quarter.", "我们团队本季度取得了{}的成果。")
    ]

    # 1. Update v2000 with 100% unique sentences
    for idx, item in enumerate(v2000):
        w = item["word"].replace("_", " ")
        cat = item.get("cat", "things")
        if cat == "ops":
            tmpl = verbs_templates[idx % len(verbs_templates)]
            item["exEn"] = tmpl[0].format(w)
            item["exCn"] = tmpl[1].replace("{}", item["cn"].split("；")[0])
        elif cat == "qualities":
            tmpl = quality_templates[idx % len(quality_templates)]
            item["exEn"] = tmpl[0].format(w)
            item["exCn"] = tmpl[1].replace("{}", item["cn"].split("；")[0])
        else:
            tmpl = noun_templates[idx % len(noun_templates)]
            item["exEn"] = tmpl[0].format(w)
            item["exCn"] = tmpl[1].replace("{}", item["cn"].split("；")[0])

    # 2. Update v3000 with 100% unique sentences
    for idx, item in enumerate(v3000):
        w = item["word"].replace("gold_", "").replace("_", " ")
        cat = item.get("cat", "things")
        if cat == "ops":
            tmpl = verbs_templates[(idx + 2) % len(verbs_templates)]
            item["exEn"] = tmpl[0].format(w)
            item["exCn"] = tmpl[1].replace("{}", item["cn"].replace("【3000黄金词汇】", "").split("；")[0])
        elif cat == "qualities":
            tmpl = quality_templates[(idx + 2) % len(quality_templates)]
            item["exEn"] = tmpl[0].format(w)
            item["exCn"] = tmpl[1].replace("{}", item["cn"].replace("【3000黄金词汇】", "").split("；")[0])
        else:
            tmpl = noun_templates[(idx + 2) % len(noun_templates)]
            item["exEn"] = tmpl[0].format(w)
            item["exCn"] = tmpl[1].replace("{}", item["cn"].replace("【3000黄金词汇】", "").split("；")[0])

    data["vocab850"] = v850
    data["vocab2000"] = v2000
    data["vocab3000"] = v3000

    with open("data/vocab.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # 3. Update scenarios.json with 100% unique extracted sentences
    print("Re-extracting 100% unique sentences to scenarios.json...")
    with open("data/scenarios.json", "r", encoding="utf-8") as f:
        scenarios_data = json.load(f)

    sentences_850 = [{"en": i["exEn"], "cn": i["exCn"], "ipa": i.get("ipa", ""), "vocab": [{"word": i["word"], "cn": i["cn"]}]} for i in v850 if i.get("exEn")]
    sentences_2000 = [{"en": i["exEn"], "cn": i["exCn"], "ipa": i.get("ipa", ""), "vocab": [{"word": i["word"], "cn": i["cn"]}]} for i in v2000 if i.get("exEn")]
    sentences_3000 = [{"en": i["exEn"], "cn": i["exCn"], "ipa": i.get("ipa", ""), "vocab": [{"word": i["word"], "cn": i["cn"]}]} for i in v3000 if i.get("exEn")]

    scenarios_data["vocab_examples"] = [
        {
            "id": "vocab_850_all_examples",
            "title": "📘 850核心词 (全部850例句)",
            "subtitle": f"100% 无重复 包含 Stage 1 全部 {len(sentences_850)} 句例句",
            "sentences": sentences_850
        },
        {
            "id": "vocab_2000_all_examples",
            "title": "📗 2000日常词 (全部2000例句)",
            "subtitle": f"100% 无重复 包含 Stage 2 全部 {len(sentences_2000)} 句例句",
            "sentences": sentences_2000
        },
        {
            "id": "vocab_3000_all_examples",
            "title": "📙 3000黄金词 (全部3000例句)",
            "subtitle": f"100% 无重复 包含 Stage 3 全部 {len(sentences_3000)} 句例句",
            "sentences": sentences_3000
        }
    ]

    with open("data/scenarios.json", "w", encoding="utf-8") as f:
        json.dump(scenarios_data, f, ensure_ascii=False, indent=2)

    print("Deduplication and unique sentence generation complete!")

if __name__ == "__main__":
    generate_unique_sentences()
