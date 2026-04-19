export type AccessTier = "free" | "premium";
export type AuthorType = "agent" | "member" | "practitioner";

export interface ArticleAuthor {
  display_name: string;
  avatar_url: string;
  username?: string;
  is_verified?: boolean;
}

export interface ArticleCategory {
  name: string;
  slug: string;
  color_hex: string;
}

export interface MockArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_id: string;
  content_en: string | null;
  category_id: string;
  category: ArticleCategory;
  author_id: string;
  author: ArticleAuthor;
  author_type: AuthorType;
  status: "published" | "draft";
  access_tier: AccessTier;
  thumbnail_url: string;
  read_time_minutes: number;
  has_disclaimer: boolean;
  tags: string[];
  like_count: number;
  comment_count: number;
  view_count: number;
  published_at: string;
  created_at: string;
}

export const mockArticles: MockArticle[] = [
  {
    id: "art_001",
    title: "Mengenal Konsep Yin-Yang dalam Traditional Chinese Medicine",
    slug: "mengenal-konsep-yin-yang-tcm",
    excerpt: "Yin-Yang adalah fondasi terpenting dalam TCM. Pelajari bagaimana konsep ini menjelaskan keseimbangan tubuh, penyakit, dan penyembuhan secara holistik.",
    content_id: `## Mengenal Konsep Yin-Yang

Yin-Yang adalah salah satu fondasi terpenting dalam Traditional Chinese Medicine (TCM). Konsep ini menggambarkan dua kekuatan yang saling berlawanan namun saling melengkapi dalam alam semesta.

### Asal Usul Konsep

Konsep Yin-Yang berasal dari filsafat Taoisme kuno Tiongkok, pertama kali tercatat dalam teks klasik I Ching (Kitab Perubahan). Dalam konteks medis, konsep ini menjadi landasan untuk memahami fungsi tubuh, penyebab penyakit, dan prinsip pengobatan.

**Yin** secara tradisional diasosiasikan dengan:
- Sifat dingin, gelap, dan pasif
- Istirahat dan regenerasi
- Organ padat (zang): jantung, paru-paru, limpa, hati, ginjal
- Darah dan cairan tubuh

**Yang** secara tradisional diasosiasikan dengan:
- Sifat panas, terang, dan aktif
- Pergerakan dan transformasi
- Organ berongga (fu): usus besar, usus kecil, lambung, kandung kemih
- Qi (energi vital)

### Keseimbangan sebagai Kesehatan

Dalam TCM, kesehatan optimal terjadi ketika Yin dan Yang berada dalam keseimbangan dinamis. Bukan berarti keduanya selalu sama — melainkan terus beradaptasi satu sama lain sesuai kondisi tubuh, waktu, dan lingkungan.

Ketika keseimbangan ini terganggu, muncullah penyakit. Misalnya:

- **Defisiensi Yin**: Tubuh terasa panas berlebih, mulut kering, insomnia, berkeringat malam
- **Defisiensi Yang**: Tubuh terasa dingin, lelah, wajah pucat, anggota badan dingin
- **Kelebihan Yin**: Kedinginan ekstrem, pembengkakan, retensi cairan
- **Kelebihan Yang**: Demam tinggi, inflamasi, kemerahan, nyeri akut

### Penerapan dalam Diagnosis

Seorang praktisi TCM akan menilai kondisi pasien melalui empat metode diagnosis: melihat (wang), mendengar & mencium (wen), bertanya (wen), dan meraba (qie) — termasuk palpasi nadi.

Dari temuan ini, kondisi Yin-Yang pasien dipetakan untuk menentukan strategi terapi yang tepat: apakah perlu menguatkan Yin, menghangatkan Yang, atau menyeimbangkan keduanya.

### Kesimpulan

Memahami Yin-Yang bukan sekadar teori — ini adalah cara pandang holistik tentang kehidupan dan kesehatan. Dengan mengenali tanda-tanda ketidakseimbangan, kita bisa lebih peka terhadap kondisi tubuh dan mengambil langkah preventif sebelum penyakit berkembang.`,
    content_en: `## Understanding the Yin-Yang Concept in TCM

Yin-Yang is one of the most fundamental concepts in Traditional Chinese Medicine (TCM). This concept describes two opposing yet complementary forces that coexist in the universe.

### Origins of the Concept

The Yin-Yang concept originates from ancient Chinese Taoist philosophy, first recorded in the I Ching (Book of Changes). In the medical context, this concept forms the foundation for understanding bodily functions, causes of disease, and principles of treatment.

**Yin** is traditionally associated with:
- Cold, dark, and passive qualities
- Rest and regeneration
- Solid organs (zang): heart, lungs, spleen, liver, kidneys
- Blood and body fluids

**Yang** is traditionally associated with:
- Hot, bright, and active qualities
- Movement and transformation
- Hollow organs (fu): large intestine, small intestine, stomach, bladder
- Qi (vital energy)

### Balance as Health

In TCM, optimal health occurs when Yin and Yang are in dynamic balance. This doesn't mean they're always equal — rather, they continuously adapt to each other according to the body's condition, time, and environment.

When this balance is disrupted, illness arises. For example:
- **Yin Deficiency**: Excessive heat sensation, dry mouth, insomnia, night sweats
- **Yang Deficiency**: Cold sensation, fatigue, pale complexion, cold limbs

### Application in Diagnosis

A TCM practitioner assesses the patient's condition through four diagnostic methods: observation, listening & smelling, inquiry, and palpation — including pulse diagnosis.

From these findings, the patient's Yin-Yang condition is mapped to determine the appropriate treatment strategy.`,
    category_id: "cat_001",
    category: { name: "Edukasi TCM Dasar", slug: "edukasi-tcm-dasar", color_hex: "#1D9E75" },
    author_id: "usr_001",
    author: { display_name: "Admin TCM", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AdminTCM&backgroundColor=1D9E75&fontColor=ffffff" },
    author_type: "agent",
    status: "published",
    access_tier: "free",
    thumbnail_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop",
    read_time_minutes: 7,
    has_disclaimer: false,
    tags: ["yin-yang", "dasar-tcm", "filosofi"],
    like_count: 142,
    comment_count: 23,
    view_count: 1840,
    published_at: "2026-04-10T08:00:00Z",
    created_at: "2026-04-10T06:00:00Z",
  },
  {
    id: "art_002",
    title: "Protokol TCM untuk Insomnia: Panduan Lengkap dari Diagnosis hingga Terapi",
    slug: "protokol-tcm-insomnia-lengkap",
    excerpt: "Panduan komprehensif TCM untuk mengatasi insomnia: identifikasi pola ketidakseimbangan, pilihan herbal, titik akupuntur, dan perubahan gaya hidup.",
    content_id: `## Protokol TCM untuk Insomnia

Dalam TCM, insomnia atau gangguan tidur disebut **Shi Mian (失眠)**. Kondisi ini dipandang sebagai ketidakseimbangan yang melibatkan berbagai organ dan pola patologis.

### Memahami Insomnia dari Perspektif TCM

Berbeda dengan pendekatan konvensional yang berfokus pada gejala tidur, TCM menelusuri akar ketidakseimbangan yang menyebabkan gangguan tidur. Beberapa pola yang umum:

**1. Defisiensi Yin Jantung dan Ginjal**
Gejala: Sulit tertidur, berkeringat malam, detak jantung tidak teratur, telinga berdengung, pinggang lemah.
Prinsip terapi: Nourish Yin, tonifikasi Jantung dan Ginjal.

**2. Gangguan Shen oleh Api Jantung**
Gejala: Gelisah, pikiran tidak tenang, mulut/lidah merah dan sariawan, urin kuning pekat.
Prinsip terapi: Pindahkan Api, tenangkan Shen.

**3. Stagnasi Qi Hati**
Gejala: Sulit tertidur akibat overthinking, mudah marah, dada sesak, sering menghela napas.
Prinsip terapi: Regulasi Qi Hati, redakan stagnasi.

**4. Disharmoni Lambung**
Gejala: Tidur tidak nyenyak dengan banyak mimpi, perut kembung, bersendawa, nafsu makan terganggu.
Prinsip terapi: Harmonisasi Lambung.

### Formula Herbal untuk Insomnia

*Konsultasikan dengan praktisi sebelum menggunakan formula herbal apapun.*

**Suan Zao Ren Tang (酸棗仁湯)** — Formula klasik untuk defisiensi Yin Jantung:
- Suan Zao Ren (Ziziphus spinosa) — 15g: menenangkan Shen
- Fu Ling (Poria) — 6g: menguatkan Limpa, menenangkan pikiran
- Zhi Mu (Anemarrhena) — 6g: membersihkan panas
- Chuan Xiong (Ligusticum) — 6g: melancarkan Qi dan Darah
- Gan Cao (Licorice) — 3g: harmonisasi formula

### Titik Akupuntur

Titik utama untuk insomnia (konsultasi dengan akupunkturis berlisensi untuk needling):
- **HT7 (Shen Men)**: Menenangkan Shen, menguatkan Jantung
- **PC6 (Nei Guan)**: Meredakan kecemasan, menenangkan pikiran
- **KD6 (Zhao Hai)**: Menguatkan Yin Ginjal
- **SP6 (San Yin Jiao)**: Titik pertemuan 3 meridian Yin, multifungsi
- **GV24 (Shen Ting)**: Menenangkan pikiran

Untuk akupresur mandiri, tekan masing-masing titik dengan ibu jari selama 1-2 menit sebelum tidur.

### Rekomendasi Gaya Hidup

- Tidur dan bangun di jam yang sama setiap hari (termasuk akhir pekan)
- Hindari makanan berat 3 jam sebelum tidur
- Teh chamomile atau susu hangat dengan sedikit madu sebelum tidur
- Meditasi atau Qigong ringan sore hari`,
    content_en: null,
    category_id: "cat_004",
    category: { name: "Protokol Kondisi Spesifik", slug: "protokol-kondisi-spesifik", color_hex: "#BA7517" },
    author_id: "usr_001",
    author: { display_name: "Admin TCM", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AdminTCM&backgroundColor=1D9E75&fontColor=ffffff" },
    author_type: "agent",
    status: "published",
    access_tier: "premium",
    thumbnail_url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop",
    read_time_minutes: 15,
    has_disclaimer: true,
    tags: ["insomnia", "gangguan-tidur", "premium", "herbal", "akupuntur"],
    like_count: 89,
    comment_count: 41,
    view_count: 2100,
    published_at: "2026-04-12T08:00:00Z",
    created_at: "2026-04-12T06:00:00Z",
  },
  {
    id: "art_003",
    title: "5 Herbal TCM yang Mudah Ditemukan di Indonesia",
    slug: "5-herbal-tcm-mudah-ditemukan-indonesia",
    excerpt: "Jahe, kunyit, kayu manis — ternyata banyak herbal TCM yang tumbuh subur di Indonesia. Kenali manfaat dan cara penggunaannya.",
    content_id: `## 5 Herbal TCM yang Mudah Ditemukan di Indonesia

Indonesia sebagai negara tropis memiliki kekayaan herbal yang luar biasa. Banyak di antaranya juga digunakan dalam materia medika TCM dengan nama dan fungsi yang mirip atau identik.

### 1. Jahe (Sheng Jiang / 生薑)

Jahe adalah salah satu herbal paling serbaguna dalam TCM. Dalam kondisi segar (**Sheng Jiang**), jahe berfungsi untuk:
- Menghangatkan Lambung dan Limpa
- Merangsang keringat (diaphoretic) untuk kondisi wind-cold
- Meredakan mual dan muntah
- Menetralkan keracunan dari seafood dan herbal tertentu

**Cara penggunaan**: Iris 3-5 lembar jahe segar, rebus dengan air, minum hangat saat merasa masuk angin.

### 2. Kunyit (Jiang Huang / 姜黃)

Kunyit dalam TCM dikenal sebagai **Jiang Huang**, berfungsi untuk:
- Melancarkan peredaran darah dan Qi
- Meredakan nyeri (analgesik)
- Anti-inflamasi, terutama untuk kondisi arthritis dan nyeri sendi
- Membantu kelancaran menstruasi

**Cara penggunaan**: Susu kunyit (golden milk) hangat sebelum tidur adalah cara mudah mengonsumsi kunyit secara teratur.

### 3. Kayu Manis (Rou Gui / 肉桂)

**Rou Gui** adalah herbal yang sangat menghangatkan dalam TCM:
- Menghangatkan Ginjal dan Jantung
- Memperkuat api Ming Men (Gerbang Kehidupan)
- Membantu kondisi dingin kronis, extremitas dingin
- Menstimulasi sirkulasi

**Perhatian**: Kayu manis tidak cocok untuk kondisi panas atau defisiensi Yin. Konsultasikan dengan praktisi.

### 4. Lengkuas (Gao Liang Jiang / 高良薑)

Sering digunakan dalam masakan Indonesia, lengkuas dalam TCM berfungsi untuk:
- Menghangatkan dan meredakan nyeri lambung
- Mengatasi mual akibat dingin
- Membantu pencernaan

### 5. Temulawak (mirip Chen Pi / 陳皮)

Meskipun tidak identik, fungsi temulawak memiliki kesamaan dengan **Chen Pi** (kulit jeruk kering):
- Memperlancar Qi Limpa dan Lambung
- Mengatasi kembung dan gangguan pencernaan
- Anti-inflamasi dan hepatoprotektif`,
    content_en: `## 5 TCM Herbs Easily Found in Indonesia

Indonesia as a tropical country has extraordinary herbal wealth. Many of them are also used in TCM materia medica with similar or identical names and functions.

### 1. Ginger (Sheng Jiang / 生薑)

Ginger is one of the most versatile herbs in TCM. In fresh form (Sheng Jiang), ginger functions to:
- Warm the Stomach and Spleen
- Stimulate sweating (diaphoretic) for wind-cold conditions
- Relieve nausea and vomiting
- Neutralize toxicity from seafood and certain herbs

### 2. Turmeric (Jiang Huang / 姜黃)

Turmeric in TCM is known as Jiang Huang, functioning to:
- Invigorate blood circulation and Qi
- Relieve pain (analgesic)
- Anti-inflammatory, especially for arthritis and joint pain
- Help menstrual flow`,
    category_id: "cat_002",
    category: { name: "Herbal & Tanaman Obat", slug: "herbal-tanaman-obat", color_hex: "#3B6D11" },
    author_id: "usr_004",
    author: { display_name: "Rina Kusuma", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=RinaKusuma&backgroundColor=BA7517&fontColor=ffffff", username: "rina_herbs", is_verified: true },
    author_type: "practitioner",
    status: "published",
    access_tier: "free",
    thumbnail_url: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop",
    read_time_minutes: 8,
    has_disclaimer: false,
    tags: ["herbal", "indonesia", "jahe", "kunyit", "praktis"],
    like_count: 203,
    comment_count: 37,
    view_count: 3420,
    published_at: "2026-04-08T10:00:00Z",
    created_at: "2026-04-08T08:00:00Z",
  },
  {
    id: "art_004",
    title: "Panduan Lengkap Akupresur Mandiri untuk Sakit Kepala",
    slug: "akupresur-mandiri-sakit-kepala",
    excerpt: "Redakan sakit kepala tanpa obat dengan teknik akupresur yang bisa dilakukan sendiri di rumah. Lengkap dengan lokasi titik dan cara pijat yang benar.",
    content_id: `## Akupresur Mandiri untuk Sakit Kepala

Sakit kepala adalah keluhan yang sangat umum. TCM menawarkan pendekatan holistik melalui akupresur — stimulasi titik akupuntur menggunakan tekanan jari, tanpa jarum.

### Titik-Titik Penting

**LI4 (He Gu / 合谷)** — "Titik Seribu Penyakit"
Lokasi: Punggung tangan, lekukan antara ibu jari dan telunjuk.
Cara: Tekan dengan ibu jari tangan lain, putar perlahan 2-3 menit.
Manfaat: Sakit kepala frontal, nyeri wajah, stres.

*Perhatian: Kontraindikasi pada kehamilan.*

**GB20 (Feng Chi / 風池)**
Lokasi: Dua lekukan di pangkal tengkorak, kiri-kanan dari garis tengah.
Cara: Kedua ibu jari menekan ke atas dan ke dalam, tahan 1-2 menit.
Manfaat: Sakit kepala temporal, sakit kepala akibat angin, mata lelah.

**Tai Yang (太陽)** — Titik Extra
Lokasi: Pelipis, lekukan kecil di antara ujung alis dan sudut mata.
Cara: Tekanan melingkar lembut dengan ujung jari tengah.
Manfaat: Migrain, sakit kepala temporal, mata tegang.

**GV20 (Bai Hui / 百會)**
Lokasi: Puncak kepala, titik pertemuan garis dari kedua telinga.
Cara: Tekanan lembut ke bawah atau pijat melingkar.
Manfaat: Sakit kepala vertex, pusing, kelelahan mental.

### Teknik yang Benar

1. Duduk atau berbaring dengan nyaman
2. Tarik napas dalam beberapa kali
3. Temukan titik yang tepat (biasanya terasa sedikit lebih sensitif)
4. Berikan tekanan stabil — bukan menyakitkan, tapi terasa "kena"
5. Tahan atau pijat melingkar 1-3 menit per titik
6. Ulangi di sisi lain jika perlu`,
    content_en: `## Self-Acupressure for Headaches

Headache is a very common complaint. TCM offers a holistic approach through acupressure — stimulation of acupuncture points using finger pressure, without needles.

### Key Points

**LI4 (He Gu)** — "Point of Ten Thousand Diseases"
Location: Back of hand, webbing between thumb and index finger.
Method: Press with opposite thumb, rotate gently for 2-3 minutes.
Benefits: Frontal headaches, facial pain, stress relief.

**GB20 (Feng Chi)**
Location: Two depressions at the base of the skull.
Method: Both thumbs pressing upward and inward, hold 1-2 minutes.
Benefits: Temporal headaches, wind-induced headache, eye fatigue.`,
    category_id: "cat_003",
    category: { name: "Akupuntur & Meridian", slug: "akupuntur-meridian", color_hex: "#0C447C" },
    author_id: "usr_002",
    author: { display_name: "Dr. Sari Wijaya", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=SariWijaya&backgroundColor=3C3489&fontColor=ffffff", username: "dr_sari", is_verified: true },
    author_type: "practitioner",
    status: "published",
    access_tier: "free",
    thumbnail_url: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&auto=format&fit=crop",
    read_time_minutes: 6,
    has_disclaimer: false,
    tags: ["akupresur", "sakit-kepala", "mandiri", "praktis"],
    like_count: 318,
    comment_count: 54,
    view_count: 5200,
    published_at: "2026-04-06T09:00:00Z",
    created_at: "2026-04-06T07:00:00Z",
  },
  {
    id: "art_005",
    title: "Diet Musim Panas ala TCM: Makanan Pendingin yang Harus Kamu Tahu",
    slug: "diet-musim-panas-tcm-makanan-pendingin",
    excerpt: "Di musim panas atau cuaca panas, TCM menyarankan makanan berkualitas Yin dan pendingin untuk menjaga keseimbangan. Ini daftarnya.",
    content_id: `## Diet Musim Panas ala TCM

Dalam TCM, setiap musim memiliki karakteristik energetik yang mempengaruhi kesehatan kita. Musim panas (Xia) didominasi oleh energi Yang yang panas — sehingga tubuh perlu diseimbangkan dengan makanan berkualitas pendingin (Yin).

### Prinsip Dasar

Makanan dalam TCM dikategorikan berdasarkan sifat termal:
- **Panas/Hangat**: Menghangatkan tubuh (jahe, kayu manis, daging domba)
- **Netral**: Tidak mempengaruhi suhu tubuh secara signifikan
- **Sejuk/Dingin**: Mendinginkan dan membersihkan panas (mentimun, semangka, tahu)

Di cuaca panas Indonesia, tubuh cenderung terakumulasi panas berlebih. Konsumsi makanan sejuk membantu:
- Menurunkan panas internal
- Menghidrasi tubuh
- Mencegah heat stroke dari perspektif TCM

### Makanan yang Dianjurkan

**Buah-buahan:**
- Semangka — sangat mendinginkan, baik untuk panas musim panas
- Melon — mendinginkan, melembabkan
- Pir — mendinginkan Paru-paru, mengatasi tenggorokan kering
- Pisang — mendinginkan, melembabkan usus

**Sayuran:**
- Mentimun — sangat mendinginkan, diuretik ringan
- Bayam — mendinginkan, menguatkan darah
- Tofu — mendinginkan, protein nabati
- Selada — mendinginkan, melancarkan Qi

**Minuman:**
- Teh chrysanthemum (Ju Hua) — mendinginkan, baik untuk mata
- Teh hijau — mendinginkan, antioksidan
- Air barley (Yi Mi) — mendinginkan, membuang lembab

### Yang Perlu Dikurangi

- Makanan pedas berlebihan
- Alkohol
- Makanan berminyak dan berat
- Kafein berlebihan`,
    content_en: `## TCM Summer Diet: Cooling Foods You Should Know

In TCM, every season has energetic characteristics that affect our health. Summer (Xia) is dominated by hot Yang energy — so the body needs to be balanced with Yin-quality cooling foods.

### Basic Principles

Foods in TCM are categorized by thermal nature:
- **Hot/Warm**: Warms the body (ginger, cinnamon, lamb)
- **Neutral**: Doesn't significantly affect body temperature
- **Cool/Cold**: Cools and clears heat (cucumber, watermelon, tofu)

### Recommended Foods
- Watermelon — strongly cooling
- Cucumber — very cooling, mild diuretic
- Pear — cools the Lungs, soothes dry throat
- Chrysanthemum tea — cooling, good for eyes`,
    category_id: "cat_005",
    category: { name: "Gaya Hidup TCM", slug: "gaya-hidup-tcm", color_hex: "#534AB7" },
    author_id: "usr_001",
    author: { display_name: "Admin TCM", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AdminTCM&backgroundColor=1D9E75&fontColor=ffffff" },
    author_type: "agent",
    status: "published",
    access_tier: "free",
    thumbnail_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop",
    read_time_minutes: 5,
    has_disclaimer: false,
    tags: ["diet", "musim-panas", "makanan-sejuk", "gaya-hidup"],
    like_count: 178,
    comment_count: 28,
    view_count: 2890,
    published_at: "2026-04-05T10:00:00Z",
    created_at: "2026-04-05T08:00:00Z",
  },
  {
    id: "art_006",
    title: "Mengenal 5 Elemen (Wu Xing) dalam TCM",
    slug: "mengenal-5-elemen-wu-xing-tcm",
    excerpt: "Kayu, Api, Tanah, Logam, Air — teori 5 Elemen adalah sistem pemetaan komprehensif yang menghubungkan organ, emosi, musim, dan lebih banyak lagi.",
    content_id: `## Mengenal 5 Elemen (Wu Xing) dalam TCM

**Wu Xing (五行)** atau Teori Lima Elemen adalah salah satu sistem teoritis paling komprehensif dalam TCM. Tidak seperti unsur-unsur kimia, Lima Elemen dalam TCM menggambarkan fase-fase perubahan energi yang saling berhubungan.

### Lima Elemen dan Korespondensinya

**Kayu (Mu / 木)**
- Organ: Hati (Yin), Kandung Empedu (Yang)
- Emosi: Kemarahan, Frustrasi
- Musim: Musim Semi
- Arah: Timur
- Warna: Hijau
- Rasa: Asam

**Api (Huo / 火)**
- Organ: Jantung (Yin), Usus Kecil (Yang)
- Emosi: Kegembiraan, Kecemasan
- Musim: Musim Panas
- Arah: Selatan
- Warna: Merah
- Rasa: Pahit

**Tanah (Tu / 土)**
- Organ: Limpa/Pankreas (Yin), Lambung (Yang)
- Emosi: Kekuatiran, Ruminasi
- Musim: Akhir Musim Panas
- Arah: Tengah
- Warna: Kuning
- Rasa: Manis

**Logam (Jin / 金)**
- Organ: Paru-paru (Yin), Usus Besar (Yang)
- Emosi: Kesedihan, Duka
- Musim: Musim Gugur
- Arah: Barat
- Warna: Putih
- Rasa: Pedas/Pedas

**Air (Shui / 水)**
- Organ: Ginjal (Yin), Kandung Kemih (Yang)
- Emosi: Ketakutan
- Musim: Musim Dingin
- Arah: Utara
- Warna: Hitam/Biru Tua
- Rasa: Asin

### Siklus Generasi dan Kontrol

Lima Elemen tidak berdiri sendiri — mereka berinteraksi dalam dua siklus utama:

**Siklus Generasi (Sheng)**: Kayu → Api → Tanah → Logam → Air → Kayu
Setiap elemen "memberi makan" atau mendukung elemen berikutnya.

**Siklus Kontrol (Ke)**: Kayu → Tanah → Air → Api → Logam → Kayu
Setiap elemen "mengontrol" atau membatasi elemen tertentu agar tidak berlebihan.

### Aplikasi Klinis

Pemahaman Wu Xing membantu praktisi untuk:
- Memahami hubungan organ: mengapa masalah Hati bisa mempengaruhi Limpa
- Merancang terapi yang komprehensif
- Memilih makanan, herbal, dan aktivitas yang sesuai`,
    content_en: `## Understanding the 5 Elements (Wu Xing) in TCM

Wu Xing (五行) or the Five Elements Theory is one of the most comprehensive theoretical systems in TCM. Unlike chemical elements, the Five Elements in TCM describe phases of energetic change that are interconnected.

### The Five Elements and Their Correspondences

**Wood (Mu)**: Liver, Gallbladder, Anger, Spring, East, Green, Sour
**Fire (Huo)**: Heart, Small Intestine, Joy/Anxiety, Summer, South, Red, Bitter
**Earth (Tu)**: Spleen, Stomach, Worry, Late Summer, Center, Yellow, Sweet
**Metal (Jin)**: Lungs, Large Intestine, Grief, Autumn, West, White, Pungent
**Water (Shui)**: Kidneys, Bladder, Fear, Winter, North, Black, Salty`,
    category_id: "cat_001",
    category: { name: "Edukasi TCM Dasar", slug: "edukasi-tcm-dasar", color_hex: "#1D9E75" },
    author_id: "usr_001",
    author: { display_name: "Admin TCM", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AdminTCM&backgroundColor=1D9E75&fontColor=ffffff" },
    author_type: "agent",
    status: "published",
    access_tier: "free",
    thumbnail_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    read_time_minutes: 10,
    has_disclaimer: false,
    tags: ["wu-xing", "5-elemen", "dasar-tcm", "teori"],
    like_count: 95,
    comment_count: 18,
    view_count: 1650,
    published_at: "2026-04-03T08:00:00Z",
    created_at: "2026-04-03T06:00:00Z",
  },
  {
    id: "art_007",
    title: "Formula Herbal TCM untuk Meningkatkan Imunitas (Wei Qi)",
    slug: "formula-herbal-tcm-imunitas-wei-qi",
    excerpt: "Dalam TCM, sistem imun berkaitan erat dengan konsep Wei Qi. Pelajari formula herbal klasik yang terbukti memperkuat pertahanan tubuh.",
    content_id: `## Formula Herbal TCM untuk Meningkatkan Imunitas (Wei Qi)

**Wei Qi (衛氣)** atau Qi Pertahanan adalah konsep dalam TCM yang paling dekat dengan sistem imun dalam pengertian modern. Wei Qi beredar di bagian luar tubuh, melindungi dari patogen eksternal.

### Mengenal Wei Qi

Wei Qi bersifat yang, bergerak cepat, dan "kasar." Fungsinya adalah:
- Melindungi permukaan tubuh dari angin, dingin, dan patogen lain
- Mengatur pembukaan/penutupan pori-pori
- Menghangatkan otot dan kulit

Wei Qi bersumber dari Paru-paru dan Ginjal, serta didukung oleh Limpa. Sehingga untuk memperkuat imunitas, kita fokus pada tiga organ ini.

### Formula Kunci

**Yu Ping Feng San (玉屏風散)** — "Layar Batu Giok"
Formula klasik untuk memperkuat Wei Qi:
- Huang Qi (Astragalus) 30g — tonifikasi Qi, memperkuat Wei
- Bai Zhu (Atractylodes) 15g — menguatkan Limpa
- Fang Feng (Siler) 10g — mengusir angin, memperlancar Wei Qi

Tersedia dalam bentuk granul atau pil di apotek TCM.

**Enam Perpaduan Herbal Sehari-hari:**
1. Huang Qi (Astragalus) — tonifikasi Qi utama
2. Gou Qi Zi (Wolfberry/Goji) — menguatkan Yin dan darah
3. Da Zao (Jujube) — menguatkan Limpa
4. Shan Yao (Yam) — tonifikasi Limpa dan Ginjal
5. Bai Mu Er (Jamur Putih) — melembabkan Paru-paru
6. Ling Zhi (Reishi) — adaptogen kuat, anti-inflamasi

### Tips Praktis

- Konsumsi sup Astragalus secara berkala (rebus 10-15g Huang Qi dengan sup ayam)
- Minum teh Goji-Chrysanthemum di malam hari
- Tidur sebelum jam 23.00 (jam Kandung Empedu, penting untuk regenerasi)
- Olahraga sedang dan teratur — Qi Gong atau Tai Chi sangat dianjurkan`,
    content_en: null,
    category_id: "cat_002",
    category: { name: "Herbal & Tanaman Obat", slug: "herbal-tanaman-obat", color_hex: "#3B6D11" },
    author_id: "usr_002",
    author: { display_name: "Dr. Sari Wijaya", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=SariWijaya&backgroundColor=3C3489&fontColor=ffffff", username: "dr_sari", is_verified: true },
    author_type: "practitioner",
    status: "published",
    access_tier: "premium",
    thumbnail_url: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&auto=format&fit=crop",
    read_time_minutes: 12,
    has_disclaimer: true,
    tags: ["imunitas", "wei-qi", "herbal", "premium", "astragalus"],
    like_count: 124,
    comment_count: 33,
    view_count: 1980,
    published_at: "2026-04-01T09:00:00Z",
    created_at: "2026-04-01T07:00:00Z",
  },
  {
    id: "art_008",
    title: "Diagnosis Lidah dalam TCM: Cara Membaca Kondisi Kesehatan",
    slug: "diagnosis-lidah-tcm-cara-membaca",
    excerpt: "Lidah adalah cermin kondisi organ dalam. Pelajari dasar-dasar diagnosis lidah TCM yang digunakan praktisi untuk menilai kesehatan pasien.",
    content_id: `## Diagnosis Lidah dalam TCM

Pemeriksaan lidah (She Zhen / 舌診) adalah salah satu metode diagnosis paling penting dan visual dalam TCM. Berbeda dengan barat yang melihat lidah untuk kondisi infeksi saja, TCM membaca lidah secara komprehensif.

### Aspek yang Diamati

**1. Badan Lidah (She Zhi)**
- Warna: Merah muda normal. Pucat (defisiensi). Merah tua (panas). Ungu (stagnasi darah).
- Bentuk: Bengkak (kelembaban). Kurus (defisiensi). Retak (defisiensi Yin). Bergerigi tepi (defisiensi Limpa).
- Gerakan: Gemetar (defisiensi atau angin). Miring (stroke, angin).

**2. Selaput Lidah (She Tai)**
- Warna: Putih (normal atau dingin). Kuning (panas). Abu-abu/hitam (kondisi serius).
- Ketebalan: Tipis (normal atau awal penyakit). Tebal (faktor patogen kuat).
- Kelembaban: Lembab (normal). Kering (panas atau defisiensi Yin). Licin/berminyak (kelembaban-lendir).

**3. Pemetaan Organ**
Bagian lidah yang berbeda mencerminkan kondisi organ yang berbeda:
- Ujung lidah: Jantung dan Paru-paru
- Tengah: Limpa dan Lambung
- Tepi (kiri-kanan): Hati dan Kandung Empedu
- Pangkal: Ginjal

### Contoh Pola Umum

**Lidah merah, selaput kuning tebal**: Menunjukkan kondisi panas dan lembab (damp-heat), sering terlihat pada hepatitis atau infeksi saluran kemih.

**Lidah pucat, selaput putih tipis**: Menunjukkan defisiensi Qi dan Yang, sering pada kelelahan kronis atau anemia.

**Lidah merah tanpa selaput**: Menunjukkan defisiensi Yin dengan panas, sering pada sindrom menopause.

### Catatan Penting

Diagnosis lidah harus selalu dikombinasikan dengan diagnosis nadi, gejala, dan riwayat kesehatan. Jangan mendiagnosis diri sendiri hanya dari lidah.`,
    content_en: `## Tongue Diagnosis in TCM: How to Read Health Conditions

Tongue examination (She Zhen) is one of the most important and visual diagnostic methods in TCM. Unlike Western medicine that looks at the tongue mainly for infections, TCM reads the tongue comprehensively.

### Aspects Observed

**1. Tongue Body**: Color (pale=deficiency, red=heat, purple=blood stasis), Shape (swollen=dampness, thin=deficiency), Movement.

**2. Tongue Coating**: Color (white=normal/cold, yellow=heat), Thickness, Moisture.

**3. Organ Mapping**: Tip=Heart/Lungs, Middle=Spleen/Stomach, Edges=Liver/Gallbladder, Root=Kidneys.`,
    category_id: "cat_001",
    category: { name: "Edukasi TCM Dasar", slug: "edukasi-tcm-dasar", color_hex: "#1D9E75" },
    author_id: "usr_002",
    author: { display_name: "Dr. Sari Wijaya", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=SariWijaya&backgroundColor=3C3489&fontColor=ffffff", username: "dr_sari", is_verified: true },
    author_type: "practitioner",
    status: "published",
    access_tier: "free",
    thumbnail_url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop",
    read_time_minutes: 9,
    has_disclaimer: false,
    tags: ["diagnosis-lidah", "she-zhen", "diagnosis", "dasar-tcm"],
    like_count: 267,
    comment_count: 45,
    view_count: 4100,
    published_at: "2026-03-28T08:00:00Z",
    created_at: "2026-03-28T06:00:00Z",
  },
  {
    id: "art_009",
    title: "Protokol Akupuntur untuk Manajemen Stres dan Kecemasan",
    slug: "protokol-akupuntur-stres-kecemasan",
    excerpt: "Stres dan kecemasan kronis melemahkan Qi dan mengganggu aliran meridian. Temukan protokol akupuntur terkini yang didukung bukti klinis.",
    content_id: `## Protokol Akupuntur untuk Stres dan Kecemasan

Stres kronis dan kecemasan adalah salah satu kondisi yang paling banyak diatasi melalui akupuntur di seluruh dunia. Dalam TCM, kondisi ini sering berkaitan dengan stagnasi Qi Hati dan gangguan Shen (jiwa/kesadaran).

### Mekanisme TCM

**Stagnasi Qi Hati (Gan Qi Yu Jie)**:
Hati bertanggung jawab atas aliran Qi yang lancar di seluruh tubuh. Stres emosional yang berkepanjangan menyebabkan Qi Hati stagnan, menghasilkan gejala seperti: dada sesak, menghela napas sering, mudah marah, dan gangguan tidur.

**Gangguan Shen**:
Jantung dalam TCM adalah "tempat tinggal" Shen. Ketika Jantung tidak dapat "menyimpan" Shen dengan baik — akibat kekurangan darah atau panas berlebih — muncul gejala kecemasan, gelisah, dan insomnia.

### Protokol Titik Akupuntur

**Titik Utama:**
- LR3 (Tai Chong): Mengatur dan meregulasi Qi Hati
- PC6 (Nei Guan): Menenangkan Jantung dan Shen
- HT7 (Shen Men): Tonifikasi Jantung, menstabilkan Shen
- GV20 (Bai Hui): Mengangkat Yang, menenangkan pikiran
- SP6 (San Yin Jiao): Menguatkan tiga meridian Yin

**Titik Tambahan berdasarkan Pola:**
- Stagnasi Hati: LR14, GB34, GB21
- Defisiensi Jantung: BL15, RN14
- Kecemasan dengan gejala fisik: ST36, RN4

### Frekuensi dan Durasi

Untuk kondisi akut: 2x seminggu selama 4-6 minggu.
Untuk pemeliharaan: 1x seminggu atau 2x sebulan.
Hasil biasanya terlihat setelah 4-6 sesi.

### Bukti Klinis

Sebuah meta-analisis 2023 dari 30+ RCT menunjukkan akupuntur secara signifikan mengurangi skor kecemasan (HAM-A) dibandingkan kontrol sham, dengan profil keamanan yang baik.`,
    content_en: null,
    category_id: "cat_003",
    category: { name: "Akupuntur & Meridian", slug: "akupuntur-meridian", color_hex: "#0C447C" },
    author_id: "usr_002",
    author: { display_name: "Dr. Sari Wijaya", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=SariWijaya&backgroundColor=3C3489&fontColor=ffffff", username: "dr_sari", is_verified: true },
    author_type: "practitioner",
    status: "published",
    access_tier: "premium",
    thumbnail_url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop",
    read_time_minutes: 13,
    has_disclaimer: true,
    tags: ["akupuntur", "stres", "kecemasan", "premium", "protokol"],
    like_count: 76,
    comment_count: 22,
    view_count: 1340,
    published_at: "2026-03-25T08:00:00Z",
    created_at: "2026-03-25T06:00:00Z",
  },
  {
    id: "art_010",
    title: "Qi Gong untuk Pemula: Latihan 8 Helai Brokat (Ba Duan Jin)",
    slug: "qi-gong-pemula-ba-duan-jin",
    excerpt: "Ba Duan Jin adalah latihan Qi Gong klasik yang terdiri dari 8 gerakan. Cocok untuk semua usia, bisa dilakukan 15 menit setiap pagi.",
    content_id: `## Qi Gong untuk Pemula: Ba Duan Jin

**Ba Duan Jin (八段錦)** atau "Delapan Helai Brokat" adalah salah satu bentuk Qi Gong paling populer dan telah dipraktikkan selama ribuan tahun. Nama ini merujuk pada 8 gerakan yang "indah seperti brokat sutra."

### Manfaat yang Terdokumentasi

Penelitian modern menunjukkan Ba Duan Jin secara konsisten memberikan manfaat untuk:
- Fleksibilitas dan keseimbangan
- Tekanan darah dan kesehatan kardiovaskular
- Kualitas tidur
- Kecemasan dan depresi ringan
- Kondisi muskuloskeletal kronis

### 8 Gerakan Ba Duan Jin

**1. Dua Tangan Mengangkat Langit (Shuang Shou Tuo Tian)**
Manfaat: Meregangkan meridian triple warmer, membuka dada, meningkatkan sirkulasi
Gerakan: Rapatkan jari-jari, angkat perlahan ke atas, telapak menghadap ke atas, lihat ke atas. Tahan, lalu turunkan.

**2. Menarik Busur Kiri dan Kanan (Zuo You Kai Gong)**
Manfaat: Membuka dada, menguatkan Paru-paru, memperkuat lengan dan punggung
Gerakan: Posisi kuda-kuda rendah. Seolah menarik busur ke kiri, lalu ke kanan.

**3. Mengangkat Satu Tangan (Tiao Li Pi Wei)**
Manfaat: Meregulasi Limpa dan Lambung, memperlancar pencernaan
Gerakan: Satu tangan mendorong ke atas, tangan lain menekan ke bawah, bergantian.

**4. Menoleh ke Belakang (Wu Lao Qi Shang)**
Manfaat: Meredakan kelelahan dan penyakit kronis, menguatkan ginjal
Gerakan: Kepala perlahan menoleh maksimal ke kiri dan kanan.

**5. Menggoyang Kepala dan Pantat (Yao Tou Bai Wei)**
Manfaat: Mengurangi api jantung, mengurangi stres
Gerakan: Posisi kuda-kuda, tubuh membungkuk ke samping dengan kepala mengayun.

**6. Kedua Tangan Menyentuh Kaki (Liang Shou Pan Zu)**
Manfaat: Menguatkan Ginjal dan pinggang
Gerakan: Dari berdiri tegak, perlahan membungkuk ke depan, sentuh kaki.

**7. Memukul dengan Keduanya (Zan Quan Nu Mu)**
Manfaat: Menguatkan Qi dan vitalitas, mengeluarkan emosi terpendam
Gerakan: Posisi kuda-kuda, tinju memukul ke depan bergantian dengan tatapan tajam.

**8. Berjinjit Tujuh Kali (Bei Hou Qi Dian Bai Bing)**
Manfaat: Mengkonsolidasikan semua manfaat, mengakhiri latihan
Gerakan: Naik ke ujung jari kaki 7 kali, lalu turun mengentakkan tumit ke lantai.

### Cara Memulai

Mulai dengan 3-5 pengulangan setiap gerakan, 15 menit total. Lakukan setiap pagi sebelum sarapan untuk hasil optimal.`,
    content_en: `## Qi Gong for Beginners: Ba Duan Jin (Eight Pieces of Brocade)

Ba Duan Jin (八段錦) or "Eight Pieces of Brocade" is one of the most popular forms of Qi Gong, practiced for thousands of years.

### The 8 Movements

1. Two Hands Hold Up the Heavens — stretches the Triple Warmer meridian
2. Drawing the Bow — opens chest, strengthens Lungs
3. Separating Heaven and Earth — regulates Spleen/Stomach
4. Looking Backward — relieves chronic fatigue, strengthens Kidneys
5. Swaying Head and Tail — reduces Heart fire, relieves stress
6. Two Hands Touch the Feet — strengthens Kidneys and lower back
7. Punching with Angry Gaze — strengthens Qi and vitality
8. Rising on the Toes — consolidates all benefits`,
    category_id: "cat_005",
    category: { name: "Gaya Hidup TCM", slug: "gaya-hidup-tcm", color_hex: "#534AB7" },
    author_id: "usr_001",
    author: { display_name: "Admin TCM", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AdminTCM&backgroundColor=1D9E75&fontColor=ffffff" },
    author_type: "agent",
    status: "published",
    access_tier: "free",
    thumbnail_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    read_time_minutes: 11,
    has_disclaimer: false,
    tags: ["qi-gong", "ba-duan-jin", "latihan", "pemula", "gaya-hidup"],
    like_count: 231,
    comment_count: 61,
    view_count: 3870,
    published_at: "2026-03-20T09:00:00Z",
    created_at: "2026-03-20T07:00:00Z",
  },
];

export const getArticleBySlug = (slug: string) =>
  mockArticles.find((a) => a.slug === slug);

export const getArticlesByCategory = (categorySlug: string) =>
  mockArticles.filter((a) => a.category.slug === categorySlug);

export const getLatestArticles = (count: number = 6) =>
  [...mockArticles]
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, count);

export const getArticleById = (id: string) =>
  mockArticles.find((a) => a.id === id);
