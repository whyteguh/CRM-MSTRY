import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  ThumbsUp, 
  Search, 
  User, 
  Send, 
  MessageCircle, 
  TrendingUp, 
  Compass, 
  BookOpen, 
  Filter,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatarColor: string;
  message: string;
  createdAt: string;
}

interface CommunityTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  avatarColor: string;
  category: 'Strategi & Pipeline' | 'Kualifikasi BANT' | 'LTV & Retensi' | 'Tanya Jawab Umum';
  likes: number;
  likedBy: string[]; // To track who clicked like
  createdAt: string;
  comments: Comment[];
  isCustom?: boolean;
}

const SEED_TOPICS: CommunityTopic[] = [
  {
    id: 'topic-1',
    title: 'Formulasi probabilitas penutupan transaksi pada simulator Pipeline',
    category: 'Strategi & Pipeline',
    author: 'budi.santoso@enterprise-corp.id',
    avatarColor: 'bg-indigo-550 bg-indigo-600',
    content: 'Rekan-rekan pembelajar CRM, bagaimanakah Anda sekalian menetapkan persentase kesuksesan di tahap akhir Negosiasi? Di perusahaan distribusi kami, kami sering memulai dengan estimasi konservatif 70% di atas kertas, namun simulator alur sering mencatatkan denda margin jika konversi riil meleset.',
    likes: 12,
    likedBy: ['reza.saputra@telco-group.com'],
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    comments: [
      {
        id: 'c-1-1',
        author: 'intan.cx@consulting.co.id',
        avatarColor: 'bg-rose-500',
        message: 'Hi Pak Budi! Berdasarkan praktik konsultan CX, jika Anda menyaring prospek dengan sangat ketat di tahap kualifikasi BANT terlebih dahulu (skor kelayakan > 80), nilai probabilitas di tahap Negosiasi sebenarnya bisa dinaikkan ke tingkat 85% dengan aman.',
        createdAt: new Date(Date.now() - 2.5 * 3600000).toISOString()
      },
      {
        id: 'c-1-2',
        author: 'mentor.crm@workshop.com',
        avatarColor: 'bg-emerald-600',
        message: 'Saran tambahan: Pastikan untuk mensinkronkan nilai probabilitas berdasarkan kriteria keluar (Exit Criteria) yang terbukti lulus ceklis penjualan secara riil, bukan semata-mata perkiraan intuisi tim sales.',
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
      }
    ]
  },
  {
    id: 'topic-2',
    title: 'Bobot parameter skor kualifikasi BANT untuk segmen B2B Enterprise',
    category: 'Kualifikasi BANT',
    author: 'reza.saputra@telco-group.com',
    avatarColor: 'bg-amber-500',
    content: 'Apakah menurut kalian kriteria "Timeline" (Urgensi Waktu) memiliki signifikansi bobot lebih tinggi daripada "Budget" saat kita mengidentifikasi hot leads? Pengalaman lapangan kami menunjukkan prospek dengan lini masa mendesak seringkali mampu melakukan re-alokasi anggaran mendadak.',
    likes: 8,
    likedBy: [],
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(), // 6 hours ago
    comments: [
      {
        id: 'c-2-1',
        author: 'diana.pohan@techcorp.id',
        avatarColor: 'bg-purple-500',
        message: 'Betul sekali! Di instansi kami, kami memberi penalti jika anggaran nihil sama sekali. Namun jika timeline-nya mendesak (< 1 bulan) dan pengambil keputusan (Authority) terlibat penuh, kami menyematkan pengali koefisien ekstra.',
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
      }
    ]
  },
  {
    id: 'topic-3',
    title: 'Studi kasus LTV dibanding CAC di industri FMCG & Retail',
    category: 'LTV & Retensi',
    author: 'amelia.haris@retail-indonesia.id',
    avatarColor: 'bg-cyan-500',
    content: 'Secara teoretis, kita menargetkan rasio LTV dibanding CAC minimal 3 banding 1. Namun, untuk skema program berlangganan kustom, tantangan terbesar kami adalah tren loyalitas tahun kedua yang merosot secara tajam. Apakah ada inisiatif retensi spesifik yang sukses menahan laju churn tahunan?',
    likes: 15,
    likedBy: ['budi.santoso@enterprise-corp.id', 'diana.pohan@techcorp.id'],
    createdAt: new Date(Date.now() - 10 * 3600000).toISOString(), // 10 hours ago
    comments: [
      {
        id: 'c-3-1',
        author: 'gunawan.w@fmcg-distributor.id',
        avatarColor: 'bg-blue-600',
        message: 'Halo Amelia, kami menyiasatinya dengan inisiatif "Ekspektasi Fleksibel" di kuartal ke-5 dengan menawarkan kustomisasi paket. Ini terbukti menekan angka Churn rate tahun kedua hingga 11%.',
        createdAt: new Date(Date.now() - 8 * 3600000).toISOString()
      }
    ]
  }
];

const COLORS = [
  'bg-cyan-600',
  'bg-emerald-600',
  'bg-indigo-600',
  'bg-pink-600',
  'bg-amber-600',
  'bg-violet-600',
  'bg-sky-600',
  'bg-teal-600'
];

interface CommunityViewProps {
  userEmail: string;
}

export default function CommunityView({ userEmail }: CommunityViewProps) {
  // Topics state (loaded from sync or seed)
  const [topics, setTopics] = useState<CommunityTopic[]>(() => {
    const saved = localStorage.getItem('crm_workshop_community_topics_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SEED_TOPICS;
      }
    }
    return SEED_TOPICS;
  });

  // Active filters and forms state
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected single topic detail focus (nullable since we can toggle / collapse)
  const [activeTopicId, setActiveTopicId] = useState<string | null>(SEED_TOPICS[0].id);

  // Form write state (inline toggle or modal feel)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityTopic['category']>('Tanya Jawab Umum');

  // Comment write state
  const [commentText, setCommentText] = useState('');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('crm_workshop_community_topics_v3', JSON.stringify(topics));
  }, [topics]);

  // Helper inside avatar initials
  const getInitials = (email: string) => {
    const clean = email.split('@')[0];
    if (clean.includes('.')) {
      const parts = clean.split('.');
      return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  // Upvote/Likes toggler
  const handleToggleLike = (topicId: string) => {
    setTopics(prev => prev.map(topic => {
      if (topic.id === topicId) {
        const hasLiked = topic.likedBy.includes(userEmail);
        let updatedLikedBy = [...topic.likedBy];
        let updatedLikes = topic.likes;

        if (hasLiked) {
          updatedLikedBy = updatedLikedBy.filter(email => email !== userEmail);
          updatedLikes = Math.max(0, updatedLikes - 1);
        } else {
          updatedLikedBy.push(userEmail);
          updatedLikes += 1;
        }

        return {
          ...topic,
          likes: updatedLikes,
          likedBy: updatedLikedBy
        };
      }
      return topic;
    }));
  };

  // Submit new topic post
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newTopic: CommunityTopic = {
      id: `topic-custom-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: userEmail,
      avatarColor: randomColor,
      category: newCategory,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      comments: [],
      isCustom: true
    };

    setTopics(prev => [newTopic, ...prev]);
    setActiveTopicId(newTopic.id);
    
    // Reset forms
    setNewTitle('');
    setNewContent('');
    setNewCategory('Tanya Jawab Umum');
    setShowCreateForm(false);
  };

  // Submit inline comment to a specific topic
  const handleCreateCommentInline = (topicId: string) => {
    if (!commentText.trim()) return;

    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newComment: Comment = {
      id: `c-custom-${Date.now()}`,
      author: userEmail,
      avatarColor: randomColor,
      message: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    setTopics(prev => prev.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          comments: [...topic.comments, newComment]
        };
      }
      return topic;
    }));

    setCommentText('');
  };

  // Delete own custom topics
  const handleDeleteTopic = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Apakah Anda yakin ingin menghapus topik diskusi Anda sendiri?")) return;

    const filtered = topics.filter(t => t.id !== topicId);
    setTopics(filtered);
    
    // Relocate active topic
    if (activeTopicId === topicId) {
      setActiveTopicId(null);
    }
  };

  // Delete own comment
  const handleDeleteComment = (topicId: string, commentId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus komentar Anda?")) return;

    setTopics(prev => prev.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          comments: topic.comments.filter(c => c.id !== commentId)
        };
      }
      return topic;
    }));
  };

  // Reset Forum to Seeds
  const handleResetForum = () => {
    if (window.confirm("Kembalikan data forum diskusi komunitas ke seed bawaan kelas?")) {
      setTopics(SEED_TOPICS);
      setActiveTopicId(SEED_TOPICS[0].id);
      setShowCreateForm(false);
    }
  };

  // Topic activation toggles
  const handleToggleTopic = (topicId: string) => {
    setActiveTopicId(prevId => prevId === topicId ? null : topicId);
  };

  // Filtering topics logic
  const filteredTopics = topics.filter(topic => {
    const matchCategory = selectedCategory === 'Semua' || topic.category === selectedCategory;
    const matchSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        topic.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-4 lg:p-8 space-y-8 select-none font-sans text-left max-w-4xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Forum Diskusi Komunitas Kelas
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tanyakan, bahas, dan bagikan masukan arsitektur CRM Anda. Klik pada topik diskusi untuk melihat detail & tanggapan.
          </p>
        </div>
        
        <button
          onClick={handleResetForum}
          className="text-[10px] text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all font-mono px-3 py-1.5 rounded-lg border border-slate-200 bg-white cursor-pointer w-fit shrink-0"
        >
          Reset Forum ke Semula
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Controls Box */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              className="w-full bg-slate-55/40 border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              placeholder="Cari kata kunci, topik, atau email peserta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category selection Filter pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 mr-1.5 flex items-center gap-1">
              <Filter className="h-3 w-3 text-slate-400" />
              Filter:
            </span>
            {['Semua', 'Strategi & Pipeline', 'Kualifikasi BANT', 'LTV & Retensi', 'Tanya Jawab Umum'].map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900 text-white border-transparent shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Create topic button toggle */}
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full py-2.5 bg-cyan-550 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-cyan-500/10 font-sans"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              Mulai Tulis Topik Diskusi Baru
            </button>
          )}
        </div>

        {/* New Topic Form Container (if open) */}
        {showCreateForm && (
          <form onSubmit={handleCreateTopic} className="bg-white p-5 rounded-2xl border-2 border-cyan-500/80 shadow-md space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-cyan-500" />
                <span>Tulis Diskusi Baru</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-slate-400 hover:text-slate-600 font-semibold text-xs cursor-pointer"
              >
                Batal
              </button>
            </div>

            {/* Title input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold">Judul Pertanyaan / Pengamatan</label>
              <input
                type="text"
                required
                placeholder="Contoh: Mengintegrasikan Lead Routing ke Tim Lapangan dengan SLA cepat"
                className="w-full bg-slate-55/30 border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-semibold"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            {/* Category selector & grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold">Kategori Diskusi</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none cursor-pointer"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                >
                  <option value="Strategi & Pipeline">Strategi & Pipeline</option>
                  <option value="Kualifikasi BANT">Kualifikasi BANT</option>
                  <option value="LTV & Retensi">LTV & Retensi</option>
                  <option value="Tanya Jawab Umum">Tanya Jawab Umum</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold">Identitas Penulis</label>
                <input
                  type="text"
                  disabled
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-mono"
                  value={`${userEmail.split('@')[0]} (Anda)`}
                />
              </div>
            </div>

            {/* Body Content */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold">Deskripsi Masalah / Catatan Detil</label>
              <textarea
                required
                rows={4}
                placeholder="Tuliskan tantangan CRM yang Anda alami secara mendalam, sertakan parameter yang sudah Anda uji..."
                className="w-full bg-slate-55/30 border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none leading-relaxed"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Tayangkan Topik Diskusi
            </button>
          </form>
        )}

        {/* Unified Expandable Topic Feed List */}
        <div className="space-y-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => {
              const isActive = topic.id === activeTopicId;
              const hasLiked = topic.likedBy.includes(userEmail);

              return (
                <div
                  key={topic.id}
                  onClick={() => handleToggleTopic(topic.id)}
                  className={`rounded-2xl border text-left transition-all overflow-hidden ${
                    isActive 
                      ? 'bg-white border-cyan-500 shadow-md ring-1 ring-cyan-500/20' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer'
                  }`}
                >
                  
                  {/* Topic Main Card Header Area */}
                  <div className="p-5">
                    {/* Status badges & categories */}
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono flex-wrap">
                      <span className="font-bold uppercase bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                        {topic.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">
                          {new Date(topic.createdAt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                        </span>
                        {isActive ? (
                          <ChevronUp className="h-4 w-4 text-cyan-600 stroke-[3]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400 stroke-[3]" />
                        )}
                      </div>
                    </div>

                    <h3 className="font-display font-black text-slate-900 text-sm md:text-base mt-2.5 leading-snug group-hover:text-cyan-900 transition-colors">
                      {topic.title}
                    </h3>

                    {/* Content text snippet (collapsed) or full scrollable card details (expanded) */}
                    {!isActive ? (
                      <p className="text-xs text-slate-505 text-slate-550 line-clamp-2 mt-2 leading-relaxed">
                        {topic.content}
                      </p>
                    ) : (
                      <div className="mt-4 pt-3.5 border-t border-slate-100 text-xs text-slate-705 text-slate-700 bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                        {topic.content}
                      </div>
                    )}

                    {/* Metadata, likes, quick comment indicators */}
                    <div className="flex items-center justify-between border-t border-slate-150 border-slate-100 pt-3.5 mt-4 flex-wrap gap-3">
                      <div className="flex items-center gap-1.5 text-slate-550 text-[11px]">
                        <div className={`h-5 w-5 rounded-full ${topic.avatarColor} text-white flex items-center justify-center font-bold text-[9px]`}>
                          {getInitials(topic.author)}
                        </div>
                        <span className="font-medium text-slate-600 block">{topic.author.split('@')[0]}</span>
                        {topic.author === userEmail && (
                          <span className="text-[9px] text-cyan-600 bg-cyan-50 border border-cyan-200 px-1.5 py-0.2 rounded font-mono font-semibold">(Anda)</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Upvote likes button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLike(topic.id);
                          }}
                          className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            hasLiked 
                              ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold' 
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          <ThumbsUp className={`h-3 w-3 ${hasLiked ? 'fill-rose-500 text-rose-600' : ''}`} />
                          <span>{topic.likes} upvotes</span>
                        </button>

                        {/* Comment counter indicator */}
                        <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-250 border-slate-200">
                          <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
                          <span>{topic.comments.length} komentar</span>
                        </span>

                        {topic.isCustom && topic.author === userEmail && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteTopic(topic.id, e)}
                            className="p-1 px-2.5 text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-250 hover:border-rose-200 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-colors"
                            title="Hapus topik kustom saya"
                          >
                            <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Comments Thread list rendering directly beneath the expanded active card item */}
                  {isActive && (
                    <div 
                      className="border-t border-slate-150 border-slate-100 bg-slate-55/35 bg-slate-50/50 p-5 space-y-4"
                      onClick={(e) => e.stopPropagation()} // Prevent clicking child comments region from closing the card
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">
                          Daftar Tanggapan ({topic.comments.length})
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">Moderasi Otomatis Kelas</span>
                      </div>

                      {topic.comments.length > 0 ? (
                        <div className="space-y-3">
                          {topic.comments.map((comment) => {
                            const isCommentAuthorMe = comment.author === userEmail;
                            return (
                              <div key={comment.id} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 relative shadow-xs">
                                <div className="flex items-center justify-between gap-2.5 flex-wrap">
                                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                                    <div className={`h-4.5 w-4.5 rounded-full ${comment.avatarColor} text-white flex items-center justify-center font-bold text-[8px]`}>
                                      {getInitials(comment.author)}
                                    </div>
                                    <span className="font-bold text-slate-700 truncate max-w-[170px]">{comment.author.split('@')[0]}</span>
                                    {comment.author === 'mentor.crm@workshop.com' && (
                                      <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded text-[7px] border border-emerald-200 font-bold uppercase">Mentor Class</span>
                                    )}
                                    {isCommentAuthorMe && (
                                      <span className="text-[8px] text-cyan-600 font-bold">(Anda)</span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[8.5px] text-slate-400 font-mono">
                                      {new Date(comment.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>

                                    {isCommentAuthorMe && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteComment(topic.id, comment.id)}
                                        className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                                        title="Hapus komentar saya"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <p className="text-xs text-slate-708 text-slate-700 font-normal leading-relaxed pl-1 whitespace-pre-wrap">
                                  {comment.message}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-6 text-center text-slate-400 text-xs bg-white border border-dashed border-slate-200 rounded-xl">
                          Belum ada tanggapan untuk topik ini. Jadilah yang pertama memberikan masukan!
                        </div>
                      )}

                      {/* Inline form to submit feedback for this topic */}
                      <div className="pt-2">
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateCommentInline(topic.id);
                          }}
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            required
                            maxLength={200}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Ketik balasan opini, tanggapan, atau tanya balik..."
                            className="flex-1 bg-white border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400"
                          />
                          <button
                            type="submit"
                            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all font-semibold flex items-center justify-center cursor-pointer shadow-sm"
                            title="Kirim Balasan"
                          >
                            <Send className="h-3.5 w-3.5 stroke-[2]" />
                          </button>
                        </form>
                      </div>

                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="py-12 bg-white border border-dashed border-slate-200 rounded-2xl flex flex-col items-center text-center p-6 justify-center">
              <AlertCircle className="h-8 w-8 text-slate-350 animate-bounce mb-2" />
              <span className="font-bold text-slate-800 text-sm block">Diskusi Tidak Ditemukan</span>
              <p className="text-slate-450 text-xs max-w-sm mt-1 leading-relaxed">
                Tidak ada kecocokan kriteria kategori filter atau kata kunci "{searchQuery}" dengan daftar topik di forum kelas saat ini.
              </p>
              <button
                onClick={() => { setSelectedCategory('Semua'); setSearchQuery(''); }}
                className="mt-3.5 text-xs font-bold text-cyan-600 hover:text-cyan-800 underline cursor-pointer font-sans"
              >
                Clear Pencarian & Tampilkan Semua
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
