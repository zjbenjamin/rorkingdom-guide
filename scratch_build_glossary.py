# -*- coding: utf-8 -*-
"""Build the translation glossary xlsx from project proper nouns."""
from openpyxl import load_workbook, Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from copy import copy

TEMPLATE = r'F:\用户\wzryq\Downloads\翻译词库模板.xlsx'
OUT = r'F:\rorkingdom-guide\翻译词库-洛克王国术语.xlsx'

# Locked proper-noun glossary. zh is the source; other columns are the locked
# translations that must replace machine-translated output.
# Order: 中文, zh-HK, zh-TW, en, id, ms, es, ko, it, ja, pt, ru, th, vi, ar, tr, de, fr
TERMS = [
    # —— 品牌 / 产品 ——
    ("洛手助手", "洛手助手", "洛手助手", "Roco Helper", "Roco Helper", "Roco Helper", "Roco Helper", "로코 헬퍼", "Roco Helper", "ロコヘルパー", "Roco Helper", "Roco Helper", "Roco Helper", "Roco Helper", "Roco Helper", "Roco Helper", "Roco Helper", "Roco Helper"),
    ("洛克王国", "洛克王國", "洛克王國", "Roco Kingdom", "Roco Kingdom", "Roco Kingdom", "Roco Kingdom", "로코 킹덤", "Roco Kingdom", "ロコ王国", "Roco Kingdom", "Roco Kingdom", "Roco Kingdom", "Roco Kingdom", "Roco Kingdom", "Roco Kingdom", "Roco Kingdom", "Roco Kingdom"),
    ("洛克王国手游", "洛克王國手遊", "洛克王國手遊", "Roco Kingdom Mobile", "Roco Kingdom Mobile", "Roco Kingdom Mobile", "Roco Kingdom Mobile", "로코 킹덤 모바일", "Roco Kingdom Mobile", "ロコ王国モバイル", "Roco Kingdom Mobile", "Roco Kingdom Mobile", "Roco Kingdom Mobile", "Roco Kingdom Mobile", "Roco Kingdom Mobile", "Roco Kingdom Mobile", "Roco Kingdom Mobile", "Roco Kingdom Mobile"),
    ("洛手地图", "洛手地圖", "洛手地圖", "Roco Map", "Roco Map", "Roco Map", "Roco Map", "로코 맵", "Roco Map", "ロコマップ", "Roco Map", "Roco Map", "Roco Map", "Roco Map", "Roco Map", "Roco Map", "Roco Map", "Roco Map"),

    # —— 货币 / 资产 ——
    ("洛克贝", "洛克貝", "洛克貝", "Roco Coins", "Roco Coins", "Roco Coins", "Roco Coins", "로코 코인", "Roco Coins", "ロココイン", "Roco Coins", "Roco Coins", "Roco Coins", "Roco Coins", "Roco Coins", "Roco Coins", "Roco Coins", "Roco Coins"),
    ("洛克钻", "洛克鑽", "洛克鑽", "Roco Gems", "Roco Gems", "Roco Gems", "Roco Gems", "로코 젬", "Roco Gems", "ロコジェム", "Roco Gems", "Roco Gems", "Roco Gems", "Roco Gems", "Roco Gems", "Roco Gems", "Roco Gems", "Roco Gems"),
    ("人民币", "人民幣", "人民幣", "RMB", "RMB", "RMB", "RMB", "위안", "RMB", "人民元", "RMB", "RMB", "RMB", "RMB", "RMB", "RMB", "RMB", "RMB"),

    # —— 核心玩法 ——
    ("咕噜球", "咕嚕球", "咕嚕球", "Gulu Ball", "Gulu Ball", "Gulu Ball", "Gulu Ball", "구루볼", "Gulu Ball", "グルボール", "Gulu Ball", "Gulu Ball", "Gulu Ball", "Gulu Ball", "Gulu Ball", "Gulu Ball", "Gulu Ball", "Gulu Ball"),
    ("购买球", "購買球", "購買球", "Buy Gulu Ball", "Beli Gulu Ball", "Beli Gulu Ball", "Comprar Gulu Ball", "구루볼 구매", "Compra Gulu Ball", "グルボール購入", "Comprar Gulu Ball", "Купить Gulu Ball", "ซื้อ Gulu Ball", "Mua Gulu Ball", "شراء Gulu Ball", "Gulu Ball Satın Al", "Gulu Ball kaufen", "Acheter Gulu Ball"),
    ("合成球", "合成球", "合成球", "Craft Gulu Ball", "Craft Gulu Ball", "Craft Gulu Ball", "Crear Gulu Ball", "구루볼 제작", "Crea Gulu Ball", "グルボールクラフト", "Criar Gulu Ball", "Создать Gulu Ball", "คราฟต์ Gulu Ball", "Chế tạo Gulu Ball", "تصنيع Gulu Ball", "Gulu Ball Üret", "Gulu Ball herstellen", "Fabriquer Gulu Ball"),
    ("合成", "合成", "合成", "Craft", "Craft", "Craft", "Crear", "제작", "Crea", "クラフト", "Criar", "Создание", "คราฟต์", "Chế tạo", "تصنيع", "Üretim", "Herstellen", "Fabrication"),
    ("大量出没", "大量出沒", "大量出沒", "Swarm", "Swarm", "Swarm", "Swarm", "스웜", "Swarm", "大量出現", "Swarm", "Swarm", "Swarm", "Swarm", "Swarm", "Swarm", "Schwarm", "Swarm"),
    ("出没中", "出沒中", "出沒中", "Active", "Aktif", "Aktif", "Activo", "활성", "Attivo", "出現中", "Ativo", "Активно", "กำลังเกิด", "Đang diễn ra", "نشط", "Aktif", "Aktiv", "Actif"),
    ("出没补货广播", "出沒補貨廣播", "出沒補貨廣播", "Spawn Broadcast", "Siaran Spawn", "Siaran Spawn", "Transmisión de Spawn", "스폰 브로드캐스트", "Broadcast Spawn", "出現放送", "Transmissão de Spawn", "Трансляция спавна", "ประกาศ Spawn", "Phát sóng Spawn", "بث الظهور", "Spawn Yayını", "Spawn-Broadcast", "Diffusion Spawn"),
    ("远行商人", "遠行商人", "遠行商人", "Traveling Merchant", "Pedagang Keliling", "Pedagang Pengembara", "Mercader Viajero", "행상인", "Mercante Viaggiatore", "旅商人", "Mercador Viajante", "Странствующий торговец", "พ่อค้าเร่", "Thương nhân lữ hành", "التاجر المتجول", "Gezgin Tüccar", "Reisender Händler", "Marchand itinérant"),
    ("精灵", "精靈", "精靈", "Pet", "Pet", "Pet", "Mascota", "펫", "Pet", "ペット", "Pet", "Питомец", "สัตว์เลี้ยง", "Thú cưng", "حيوان أليف", "Evcil Hayvan", "Haustier", "Familier"),
    ("精灵图鉴", "精靈圖鑑", "精靈圖鑑", "Pet Handbook", "Buku Pet", "Buku Pet", "Manual de Mascotas", "펫 도감", "Manuale Pet", "ペット図鑑", "Manual de Pets", "Справочник питомцев", "คู่มือสัตว์เลี้ยง", "Sổ tay thú cưng", "دليل الحيوانات الأليفة", "Evcil Hayvan Kılavuzu", "Pet-Handbuch", "Manuel des familiers"),
    ("道具图鉴", "道具圖鑑", "道具圖鑑", "Item Handbook", "Buku Item", "Buku Item", "Manual de Objetos", "아이템 도감", "Manuale Oggetti", "アイテム図鑑", "Manual de Itens", "Справочник предметов", "คู่มือไอเทม", "Sổ tay vật phẩm", "دليل العناصر", "Eşya Kılavuzu", "Item-Handbuch", "Manuel des objets"),
    ("技能图鉴", "技能圖鑑", "技能圖鑑", "Skill Handbook", "Buku Skill", "Buku Skill", "Manual de Habilidades", "스킬 도감", "Manuale Abilità", "スキル図鑑", "Manual de Habilidades", "Справочник навыков", "คู่มือสกิล", "Sổ tay kỹ năng", "دليل المهارات", "Beceri Kılavuzu", "Fähigkeits-Handbuch", "Manuel des compétences"),
    ("异色", "異色", "異色", "Shiny", "Shiny", "Shiny", "Variocolor", "색이 다른", "Cromatico", "色違い", "Shiny", "Блестящий", "ไชนี่", "Shiny", "لامع", "Parlak", "Schillernd", "Chromatique"),
    ("异色捕捉统计战报", "異色捕捉統計戰報", "異色捕捉統計戰報", "Shiny Catch Report", "Laporan Tangkapan Shiny", "Laporan Tangkapan Shiny", "Informe de Capturas Variocolor", "색이 다른 포획 전투 리포트", "Report Catture Cromatiche", "色違い捕獲レポート", "Relatório de Capturas Shiny", "Отчёт о блестящих поимках", "รายงานจับไชนี่", "Báo cáo bắt Shiny", "تقرير الالتقاط اللامع", "Parlak Yakalama Raporu", "Schillernd-Fangbericht", "Rapport de captures chromatiques"),
    ("捕捉统计", "捕捉統計", "捕捉統計", "Catch Stats", "Statistik Tangkapan", "Statistik Tangkapan", "Estadísticas de Captura", "포획 통계", "Statistiche Cattura", "捕獲統計", "Estatísticas de Captura", "Статистика поимок", "สถิติการจับ", "Thống kê bắt", "إحصاءات الالتقاط", "Yakalama İstatistikleri", "Fangstatistik", "Statistiques de capture"),
    ("捕捉", "捕捉", "捕捉", "Capture", "Tangkap", "Tangkap", "Capturar", "포획", "Cattura", "捕獲", "Capturar", "Поимка", "จับ", "Bắt", "التقاط", "Yakalama", "Fangen", "Capture"),
    ("捕获成功", "捕獲成功", "捕獲成功", "Capture Success", "Tangkapan Berhasil", "Tangkapan Berhasil", "Captura exitosa", "포획 성공", "Cattura riuscita", "捕獲成功", "Captura bem-sucedida", "Поимка удалась", "จับสำเร็จ", "Bắt thành công", "التقاط ناجح", "Yakalama Başarılı", "Fang erfolgreich", "Capture réussie"),
    ("奇遇事件", "奇遇事件", "奇遇事件", "Encounter", "Encounter", "Encounter", "Encuentro", "인카운터", "Incontro", "エンカウンター", "Encontro", "Встреча", "การเผชิญหน้า", "Gặp gỡ", "مواجهة", "Karşılaşma", "Begegnung", "Rencontre"),
    ("惊喜幸运盒", "驚喜幸運盒", "驚喜幸運盒", "Lucky Box", "Lucky Box", "Lucky Box", "Caja de la Suerte", "럭키 박스", "Lucky Box", "ラッキーボックス", "Lucky Box", "Lucky Box", "Lucky Box", "Lucky Box", "Lucky Box", "Lucky Box", "Lucky Box", "Lucky Box"),
    ("狂欢时刻", "狂歡時刻", "狂歡時刻", "Carnival", "Carnival", "Carnival", "Carnaval", "카니발", "Carnevale", "カーニバル", "Carnaval", "Карнавал", "คาร์นิวัล", "Lễ hội hóa trang", "كرنفال", "Karnaval", "Karneval", "Carnaval"),
    ("孵蛋查询", "孵蛋查詢", "孵蛋查詢", "Egg Query", "Kueri Telur", "Pertanyaan Telur", "Consulta de Huevos", "부화 검색", "Ricerca Uova", "タマゴ検索", "Consulta de Ovos", "Поиск яиц", "ค้นหาไข่", "Truy vấn trứng", "استعلام البيض", "Yumurta Sorgu", "Eier-Suche", "Recherche d'œufs"),
    ("兑换码", "兌換碼", "兌換碼", "Redeem Code", "Kode Redeem", "Kod Tebus", "Código de Canje", "교환 코드", "Codice Riscatto", "交換コード", "Código Resgate", "Код активации", "รหัสแลก", "Mã đổi quà", "رمز الاسترداد", "Kod Kullan", "Einlösecode", "Code d'échange"),
    ("活动日历", "活動日曆", "活動行事曆", "Activity Calendar", "Kalender Aktivitas", "Kalendar Aktiviti", "Calendario de Actividades", "활동 캘린더", "Calendario Attività", "イベントカレンダー", "Calendário de Atividades", "Календарь событив", "ปฏิทินกิจกรรม", "Lịch hoạt động", "تقويم الأنشطة", "Etkinlik Takvemi", "Aktivitätskalender", "Calendrier des activités"),
    ("攻略指南", "攻略指南", "攻略指南", "Guide Manual", "Panduan", "Panduan", "Guía", "공략 가이드", "Guida", "ガイドマニュアル", "Manual de Guia", "Руководство", "คู่มือแนะนำ", "Hướng dẫn", "دليل", "Rehber", "Anleitung", "Guide"),
    ("战报", "戰報", "戰報", "Report", "Laporan", "Laporan", "Informe", "전투 리포트", "Report", "レポート", "Relatório", "Отчёт", "รายงาน", "Báo cáo", "تقرير", "Rapor", "Bericht", "Rapport"),
    ("小洛克", "小洛克", "小洛克", "Rookie", "Rookie", "Rookie", "Novato", "루키", "Rookie", "ルーキー", "Novato", "Новичок", "มือใหม่", "Tân binh", "مبتدئ", "Çaylak", "Anfänger", "Débutant"),
    ("至尊洛克", "至尊洛克", "至尊洛克", "Supreme Roco", "Supreme Roco", "Supreme Roco", "Supremo Roco", "슈프림 로코", "Supremo Roco", "至尊ロコ", "Supremo Roco", "Верховный Roco", "สูงสุด Roco", "Tối thượng Roco", "Roco الأعلى", "Yüce Roco", "Supreme Roco", "Suprême Roco"),
    ("传说洛克", "傳說洛克", "傳說洛克", "Legend Roco", "Legend Roco", "Legend Roco", "Leyenda Roco", "레전드 로코", "Leggenda Roco", "レジェンドロコ", "Lenda Roco", "Легенда Roco", "ตำนาน Roco", "Huyền thoại Roco", "Roco الأسطوري", "Efsane Roco", "Legend Roco", "Légende Roco"),
    ("精灵研究员", "精靈研究員", "精靈研究員", "Pet Researcher", "Peneliti Pet", "Penyelidik Pet", "Investigador de Mascotas", "펫 연구원", "Ricercatore Pet", "ペット研究員", "Pesquisador de Pets", "Исследователь питомцев", "นักวิจัยสัตว์เลี้ยง", "Nghiên cứu viên thú cưng", "باحث الحيوانات الأليفة", "Evcil Hayvan Araştırmacısı", "Pet-Forscher", "Chercheur de familiers"),
    ("天赋", "天賦", "天賦", "Talent", "Talent", "Talent", "Talento", "재능", "Talento", "才能", "Talento", "Талант", "พรสวรรค์", "Thiên phú", "موهبة", "Yetenek", "Talent", "Talent"),
    ("炫彩粒子", "炫彩粒子", "炫彩粒子", "Sparkle Particles", "Partikel Sparkle", "Zarah Sparkle", "Partículas Brillantes", "스파클 파티클", "Particelle Scintillanti", "キラキラ粒子", "Partículas Brilhantes", "Искры", "อนุภาคประกาย", "Hạt lấp lánh", "جسيات لامعة", "Parıltı Parçacıkları", "Funkelpartikel", "Particules scintillantes"),
    ("赛季", "賽季", "賽季", "Season", "Season", "Season", "Temporada", "시즌", "Stagione", "シーズン", "Temporada", "Сезон", "ซีซัน", "Mùa", "موسم", "Sezon", "Saison", "Saison"),
    ("混刷", "混刷", "混刷", "Mixed Farm", "Farm Campur", "Farm Campur", "Granjero Mixto", "혼합 파밍", "Farm Mista", "混合周回", "Farm Misto", "Смешанный фарм", "ฟาร์มผสม", "Farm hỗn hợp", "مزج الزراعة", "Karışık Çiftlik", "Gemischtes Farming", "Farm mixte"),
    ("保底机制", "保底機制", "保底機制", "Pity System", "Sistem Pity", "Sistem Pity", "Sistema de Piedad", "천장 시스템", "Sistema Pity", "天井システム", "Sistema de Pity", "Система гарантированного дропа", "ระบบการันตี", "Hệ thống bảo hiểm", "نظام الضمان", "Pity Sistemi", "Pity-System", "Système de pitié"),
    ("UP主", "UP主", "UP主", "Content Creator", "Kreator Konten", "Pencipta Kandungan", "Creador de Contenido", "크리에이터", "Creatore di Contenuti", "クリエイター", "Criador de Conteúdo", "Автор контента", "ครีเอเตอร์", "Nhà sáng tạo", "صانع المحتوى", "İçerik Üreticisi", "Content-Ersteller", "Créateur de contenu"),
    ("UID", "UID", "UID", "UID", "UID", "UID", "UID", "UID", "UID", "UID", "UID", "UID", "UID", "UID", "UID", "UID", "UID", "UID"),
    ("洛克王国UID", "洛克王國UID", "洛克王國UID", "Roco Kingdom UID", "Roco Kingdom UID", "Roco Kingdom UID", "Roco Kingdom UID", "로코 킹덤 UID", "Roco Kingdom UID", "ロコ王国UID", "Roco Kingdom UID", "Roco Kingdom UID", "Roco Kingdom UID", "Roco Kingdom UID", "Roco Kingdom UID", "Roco Kingdom UID", "Roco Kingdom UID", "Roco Kingdom UID"),
]

HEADERS = ['中文', '繁體中文（香港）', '繁體中文（台灣）', 'English', 'Bahasa Indonesia',
           'Bahasa Melayu', 'Español', '한국어', 'Italiano', '日本語', 'Português',
           'Русский', 'ภาษาไทย', 'Tiếng Việt', 'العربية', 'Türkçe', 'Deutsch', 'Français']

# Load template to preserve its header exactly
wb = load_workbook(TEMPLATE)
ws = wb.active
ws.title = '词库'

# Verify header matches
tpl_headers = [c.value for c in ws[1]]
assert tpl_headers == HEADERS, f'header mismatch:\n{tpl_headers}\n{HEADERS}'

header_fill = PatternFill('solid', fgColor='1F4E79')
header_font = Font(name='Microsoft YaHei', size=11, bold=True, color='FFFFFF')
cell_font = Font(name='Microsoft YaHei', size=10)
zh_font = Font(name='Microsoft YaHei', size=10, bold=True)
thin = Side(style='thin', color='B0B0B0')
border = Border(left=thin, right=thin, top=thin, bottom=thin)
center = Alignment(horizontal='center', vertical='center', wrap_text=True)
left = Alignment(horizontal='left', vertical='center', wrap_text=True)

# Style header
for col, h in enumerate(HEADERS, 1):
    c = ws.cell(row=1, column=col, value=h)
    c.fill = header_fill
    c.font = header_font
    c.alignment = center
    c.border = border

# Write terms
for r, row in enumerate(TERMS, 2):
    for col, val in enumerate(row, 1):
        c = ws.cell(row=r, column=col, value=val)
        c.font = zh_font if col == 1 else cell_font
        c.alignment = left if col == 1 else center
        c.border = border
    # zebra
    if r % 2 == 0:
        fill = PatternFill('solid', fgColor='F2F7FB')
        for col in range(1, len(HEADERS) + 1):
            ws.cell(row=r, column=col).fill = fill

# Column widths
widths = [16, 16, 16, 18, 16, 16, 16, 14, 16, 14, 16, 16, 14, 14, 14, 16, 16, 16]
for i, w in enumerate(widths, 1):
    ws.column_dimensions[get_column_letter(i)].width = w

ws.freeze_panes = 'B2'
ws.auto_filter.ref = f'A1:R{len(TERMS) + 1}'
ws.row_dimensions[1].height = 22

# Sheet 2: usage notes
ws2 = wb.create_sheet('使用说明')
notes = [
    ['用途', '本表为平台机翻替换词库：命中「中文」列的名词时，必须使用本表对应语种译文，禁止机翻。'],
    ['覆盖语种', '18 种（与模板表头一致）：中/繁港/繁台/英/印尼/马来/西/韩/意/日/葡/俄/泰/越/阿拉伯/土/德/法'],
    ['收录原则', '只收专有名词与固定玩法术语（品牌、货币、道具、系统名），不收普通句子。'],
    ['品牌策略', 'Roco Helper / Roco Kingdom / Roco Coins / Roco Gems / Gulu Ball 等品牌词各语种保持拉丁写法，不意译。'],
    ['机翻替换顺序', '1) 先按最长匹配替换本表术语 → 2) 再跑平台机翻 → 3) 校对残留。'],
    ['示例', '「用100洛克贝买了咕噜球」→ en: "Bought a Gulu Ball for 100 Roco Coins"（不得出现 "Locke Shell" 等机翻）。'],
    ['词条数', str(len(TERMS))],
    ['来源', '从 utils/i18n.js 与项目文案中提取的固定术语，译法与现有 en/ja 文案对齐。'],
]
for r, (k, v) in enumerate(notes, 1):
    ws2.cell(row=r, column=1, value=k).font = Font(name='Microsoft YaHei', size=10, bold=True)
    ws2.cell(row=r, column=2, value=v).font = Font(name='Microsoft YaHei', size=10)
    ws2.cell(row=r, column=2).alignment = Alignment(wrap_text=True, vertical='center')
ws2.column_dimensions['A'].width = 16
ws2.column_dimensions['B'].width = 90

wb.save(OUT)
print('saved', OUT, 'terms=', len(TERMS))

# sanity
wb2 = load_workbook(OUT)
ws = wb2['词库']
print('sheets', wb2.sheetnames)
print('rows', ws.max_row, 'cols', ws.max_column)
print('row2', [ws.cell(2, i).value for i in range(1, 5)])
print('last', [ws.cell(ws.max_row, i).value for i in range(1, 5)])
