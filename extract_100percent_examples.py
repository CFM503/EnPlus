import json

def extract_all_100percent():
    print("Loading vocab.json...")
    with open("data/vocab.json", "r", encoding="utf-8") as f:
        vocab_data = json.load(f)

    with open("data/scenarios.json", "r", encoding="utf-8") as f:
        scenarios_data = json.load(f)

    # 1. ALL 850 Examples
    v850_items = vocab_data.get("vocab850", [])
    sentences_850 = []
    for item in v850_items:
        if item.get("exEn") and item.get("exCn"):
            sentences_850.append({
                "en": item["exEn"],
                "cn": item["exCn"],
                "ipa": item.get("ipa", ""),
                "vocab": [{"word": item["word"], "cn": item["cn"]}]
            })

    topic_850 = {
        "id": "vocab_850_all_examples",
        "title": "📘 850核心词 (全部850例句)",
        "subtitle": f"100% 包含 Stage 1 全部 {len(sentences_850)} 句例句",
        "sentences": sentences_850
    }

    # 2. ALL 2000 Examples
    v2000_items = vocab_data.get("vocab2000", [])
    sentences_2000 = []
    for item in v2000_items:
        if item.get("exEn") and item.get("exCn"):
            sentences_2000.append({
                "en": item["exEn"],
                "cn": item["exCn"],
                "ipa": item.get("ipa", ""),
                "vocab": [{"word": item["word"], "cn": item["cn"]}]
            })

    topic_2000 = {
        "id": "vocab_2000_all_examples",
        "title": "📗 2000日常词 (全部2000例句)",
        "subtitle": f"100% 包含 Stage 2 全部 {len(sentences_2000)} 句例句",
        "sentences": sentences_2000
    }

    # 3. ALL 3000 Examples
    v3000_items = vocab_data.get("vocab3000", [])
    sentences_3000 = []
    for item in v3000_items:
        if item.get("exEn") and item.get("exCn"):
            sentences_3000.append({
                "en": item["exEn"],
                "cn": item["exCn"],
                "ipa": item.get("ipa", ""),
                "vocab": [{"word": item["word"], "cn": item["cn"]}]
            })

    topic_3000 = {
        "id": "vocab_3000_all_examples",
        "title": "📙 3000黄金词 (全部3000例句)",
        "subtitle": f"100% 包含 Stage 3 全部 {len(sentences_3000)} 句例句",
        "sentences": sentences_3000
    }

    # Update vocab_examples category in scenarios_data with 100% of all sentences
    scenarios_data["vocab_examples"] = [
        topic_850,
        topic_2000,
        topic_3000
    ]

    with open("data/scenarios.json", "w", encoding="utf-8") as f:
        json.dump(scenarios_data, f, ensure_ascii=False, indent=2)

    total_all = len(sentences_850) + len(sentences_2000) + len(sentences_3000)
    print(f"Successfully compiled 100% ALL example sentences: 850: {len(sentences_850)}, 2000: {len(sentences_2000)}, 3000: {len(sentences_3000)}. Total: {total_all}")

if __name__ == "__main__":
    extract_all_100percent()
