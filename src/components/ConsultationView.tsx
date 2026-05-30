import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  ExternalLink, 
  User, 
  Mail, 
  MessageSquare, 
  MapPin, 
  UserCheck, 
  Compass,
  AlertCircle,
  FileText,
  Video
} from 'lucide-react';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseActive, handleFirestoreError, OperationType } from '../lib/firebase';

interface ConsultationSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string; // "Google Meet Link" or "Malang Class Area"
  isBooked: boolean;
  bookedBy?: {
    name: string;
    email: string;
    topic: string;
    contact: string;
    status: 'pending' | 'approved' | 'rejected';
    meetingLink?: string;
    speakerNotes?: string;
  };
}

const DEFAULT_SLOTS: ConsultationSlot[] = [];

export default function ConsultationView() {
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [isSpeakerMode, setIsSpeakerMode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  
  // User Booking Form Modal states
  const [activeSlotForBooking, setActiveSlotForBooking] = useState<ConsultationSlot | null>(null);
  const [formData, setFormData] = useState({
    name: 'Budiman Setyo',
    email: 'budiman.setyo@incentric.cx',
    contact: '+62 813-9090-1122',
    topic: 'Validasi model pipeline forecast kami setelah implementasi CRM Hub'
  });

  // Speaker Form states for adding new slots
  const [newSlot, setNewSlot] = useState({
    date: '2026-05-28',
    startTime: '09:00',
    endTime: '09:30',
    location: 'Remote Video Teleconference'
  });

  // Modal for editing meeting link/notes as Speaker
  const [activeRequestForAction, setActiveRequestForAction] = useState<ConsultationSlot | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionMeetingLink, setActionMeetingLink] = useState('https://meet.google.com/crm-mstr-one');

  // Load from database/localStorage or default
  useEffect(() => {
    if (isFirebaseActive) {
      console.log('Firebase Firestore is active. Synchronizing slots in real-time...');
      const unsub = onSnapshot(collection(db, 'consultation_slots'), (snapshot) => {
        const list: ConsultationSlot[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as ConsultationSlot);
        });

        // Sort chronologically
        list.sort((a, b) => {
          return (`${a.date}T${a.startTime}`).localeCompare(`${b.date}T${b.startTime}`);
        });

        if (list.length === 0) {
          // Seeds default slots on first clean Firestore initialization
          DEFAULT_SLOTS.forEach(async (slot) => {
            try {
              await setDoc(doc(db, 'consultation_slots', slot.id), slot);
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `consultation_slots/${slot.id}`);
            }
          });
        } else {
          setSlots(list);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'consultation_slots');
      });

      const savedSpeakerAuth = localStorage.getItem('crm_speaker_authorized');
      if (savedSpeakerAuth === 'true') {
        setIsSpeakerMode(true);
      }
      return () => unsub();
    } else {
      console.log('Running in Local Fallback mode using client-side localStorage.');
      const savedSlots = localStorage.getItem('crm_consultation_slots');
      if (savedSlots) {
        try {
          setSlots(JSON.parse(savedSlots));
        } catch (e) {
          setSlots(DEFAULT_SLOTS);
        }
      } else {
        setSlots(DEFAULT_SLOTS);
        localStorage.setItem('crm_consultation_slots', JSON.stringify(DEFAULT_SLOTS));
      }

      const savedSpeakerAuth = localStorage.getItem('crm_speaker_authorized');
      if (savedSpeakerAuth === 'true') {
        setIsSpeakerMode(true);
      }
    }
  }, []);

  const saveToLocalStorage = (newSlots: ConsultationSlot[]) => {
    setSlots(newSlots);
    localStorage.setItem('crm_consultation_slots', JSON.stringify(newSlots));
  };

  const handleSpeakerAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Secure hash comparison to avoid plain-text passcode in client bundle
      const msgBuffer = new TextEncoder().encode(passcode.trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashed = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (hashed === '9e78698c4c75649fcfdd7d85b9276bd3b2e8300e472cf24cb3a0ad354f145c05') {
        setIsSpeakerMode(true);
        setPasscodeError('');
        localStorage.setItem('crm_speaker_authorized', 'true');
      } else {
        setPasscodeError('Password speaker salah. Silakan coba lagi!');
      }
    } catch (err) {
      setPasscodeError('Proses verifikasi kriptografis gagal.');
    }
  };

  const handleExitSpeakerMode = () => {
    setIsSpeakerMode(false);
    setPasscode('');
    localStorage.removeItem('crm_speaker_authorized');
  };

  // Add new available slot (Speaker Action)
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: ConsultationSlot = {
      id: 'slot-' + Date.now(),
      date: newSlot.date,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      location: newSlot.location,
      isBooked: false
    };

    if (isFirebaseActive) {
      try {
        await setDoc(doc(db, 'consultation_slots', created.id), created);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `consultation_slots/${created.id}`);
      }
    } else {
      const updated = [...slots, created].sort((a, b) => {
        // Sort chronologically
        return (`${a.date}T${a.startTime}`).localeCompare(`${b.date}T${b.startTime}`);
      });
      saveToLocalStorage(updated);
    }
    
    // Reset inputs
    setNewSlot({
      date: '2026-05-28',
      startTime: '10:00',
      endTime: '10:30',
      location: 'Remote Video Teleconference'
    });
  };

  // Delete slot entirely (Speaker Action)
  const handleDeleteSlot = async (id: string) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus slot atau data janji temu ini?');
    if (!confirmed) return;

    if (isFirebaseActive) {
      try {
        await deleteDoc(doc(db, 'consultation_slots', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `consultation_slots/${id}`);
      }
    } else {
      const updated = slots.filter(s => s.id !== id);
      saveToLocalStorage(updated);
    }
  };

  // Open User Booking Modal
  const openBookingModal = (slot: ConsultationSlot) => {
    setActiveSlotForBooking(slot);
  };

  // Submit User Booking Form
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSlotForBooking) return;

    const bookingDetails = {
      name: formData.name,
      email: formData.email,
      topic: formData.topic,
      contact: formData.contact,
      status: 'pending' as const,
      meetingLink: 'https://meet.google.com/crm-mstr-' + Math.random().toString(36).substring(2, 8)
    };

    if (isFirebaseActive) {
      try {
        await setDoc(doc(db, 'consultation_slots', activeSlotForBooking.id), {
          ...activeSlotForBooking,
          isBooked: true,
          bookedBy: bookingDetails
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `consultation_slots/${activeSlotForBooking.id}`);
      }
    } else {
      const updated = slots.map(s => {
        if (s.id === activeSlotForBooking.id) {
          return {
            ...s,
            isBooked: true,
            bookedBy: bookingDetails
          };
        }
        return s;
      });
      saveToLocalStorage(updated);
    }

    setActiveSlotForBooking(null);
    alert('Booking berhasil dikirimkan! Menunggu konfirmasi/persetujuan dari pembicara.');
  };

  // Open Approval Modal for Speaker
  const openApprovalModal = (slot: ConsultationSlot) => {
    setActiveRequestForAction(slot);
    setActionNotes(slot.bookedBy?.speakerNotes || '');
    setActionMeetingLink(slot.bookedBy?.meetingLink || 'https://meet.google.com/crm-mstr-one');
  };

  // Speaker approves booking
  const handleApproveBooking = async () => {
    if (!activeRequestForAction || !activeRequestForAction.bookedBy) return;

    const updatedBookedBy = {
      ...activeRequestForAction.bookedBy,
      status: 'approved' as const,
      meetingLink: actionMeetingLink,
      speakerNotes: actionNotes
    };

    if (isFirebaseActive) {
      try {
        await setDoc(doc(db, 'consultation_slots', activeRequestForAction.id), {
          ...activeRequestForAction,
          bookedBy: updatedBookedBy
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `consultation_slots/${activeRequestForAction.id}`);
      }
    } else {
      const updated = slots.map(s => {
        if (s.id === activeRequestForAction.id && s.bookedBy) {
          return {
            ...s,
            bookedBy: updatedBookedBy
          };
        }
        return s;
      });
      saveToLocalStorage(updated);
    }
    setActiveRequestForAction(null);
  };

  // Speaker rejects booking
  const handleRejectBooking = async () => {
    if (!activeRequestForAction || !activeRequestForAction.bookedBy) return;

    const updatedBookedBy = {
      ...activeRequestForAction.bookedBy,
      status: 'rejected' as const,
      speakerNotes: actionNotes
    };

    if (isFirebaseActive) {
      try {
        await setDoc(doc(db, 'consultation_slots', activeRequestForAction.id), {
          ...activeRequestForAction,
          bookedBy: updatedBookedBy
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `consultation_slots/${activeRequestForAction.id}`);
      }
    } else {
      const updated = slots.map(s => {
        if (s.id === activeRequestForAction.id && s.bookedBy) {
          return {
            ...s,
            bookedBy: updatedBookedBy
          };
        }
        return s;
      });
      saveToLocalStorage(updated);
    }
    setActiveRequestForAction(null);
  };

  // Speaker resets a booked slot back to Available
  const handleResetSlotToAvailable = async (slotId: string) => {
    const confirmed = window.confirm('Kembalikan slot ini menjadi Tersedia & batalkan pendaftaran pengguna?');
    if (!confirmed) return;

    if (isFirebaseActive) {
      try {
        await setDoc(doc(db, 'consultation_slots', slotId), {
          id: slotId,
          ...slots.find(s => s.id === slotId)!,
          isBooked: false,
          bookedBy: undefined
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `consultation_slots/${slotId}`);
      }
    } else {
      const updated = slots.map(s => {
        if (s.id === slotId) {
          return {
            ...s,
            isBooked: false,
            bookedBy: undefined
          };
        }
        return s;
      });
      saveToLocalStorage(updated);
    }
  };

  return (
    <div id="consultation-view" className="p-6 lg:p-8 space-y-8 animate-fadeIn max-w-7xl mx-auto text-left select-none font-sans">
      
      {/* Title Header Section Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-505 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-80 h-80 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 text-xs font-bold font-mono px-3.5 py-1 rounded-full border border-indigo-400/20 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-400" />
            1-on-1 Consulting Clinic
          </div>
          <h1 className="text-2xl lg:text-3.5xl font-extrabold text-white tracking-tight leading-tight">
            Consultation Booking & <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-400 bg-clip-text text-transparent">Direct Strategic Alignment</span>
          </h1>
          <p className="text-slate-350 text-xs lg:text-sm max-w-2xl leading-relaxed">
            Miliki akses eksklusif tatap muka (virtual maupun offline) dengan pembicara/pakar digital kami. Validasi model CRM, formula RFM, blueprint kustom bisnis retail Anda agar siap dieksekusi secara nyata.
          </p>
        </div>

        {/* Action Toggle to highlight active mode status */}
        <div className="bg-slate-950/60 backdrop-blur-sm p-4 rounded-2xl border border-slate-800/80 shrink-0 w-full md:w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-slate-450 uppercase tracking-wider">STATUS AKSES</span>
            {isSpeakerMode ? (
              <span className="px-2 py-0.5 bg-rose-50/10 text-rose-300 border border-rose-500/20 text-[9px] font-bold rounded-full font-mono">
                SPEAKER ACTIVE
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[9px] font-bold rounded-full font-mono">
                PARTICIPANT VIEW
              </span>
            )}
          </div>
          {isSpeakerMode ? (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-400">Anda masuk dengan profil pembicara kustom.</p>
              <button
                type="button"
                onClick={handleExitSpeakerMode}
                className="w-full text-center py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white transition-all text-xs font-bold border border-rose-500/20 cursor-pointer"
              >
                Keluar Mode Pembicara
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-450">Ingin memanipulasi slot & menyetujui reservasi?</p>
              <form onSubmit={handleSpeakerAuthSubmit} className="flex gap-2">
                <input
                  type="password"
                  placeholder="Kode Speaker..."
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setPasscodeError('');
                  }}
                  className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs font-mono flex-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-full"
                />
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Masuk
                </button>
              </form>
              {passcodeError && (
                <p className="text-[10px] text-rose-400 font-mono mt-1">{passcodeError}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Speaker Configuration Dashboard Block */}
      {isSpeakerMode && (
        <div className="bg-white rounded-3xl border border-rose-200/60 shadow-lg shadow-rose-500/5 p-6 space-y-6">
          <div className="border-b border-rose-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-rose-950 flex items-center gap-2">
                <Unlock className="h-5 w-5 text-rose-600 animate-pulse" />
                Panel Kendali Pembicara (Speaker Control Console)
              </h2>
              <p className="text-xs text-slate-500">Formulir penambahan jadwal ketersediaan konsultasi dan persetujuan pengajuan janji temu.</p>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <span className="text-[10.5px] font-mono text-rose-700 bg-rose-50 border border-rose-150 px-2.5 py-1 rounded-lg font-bold">
                Authorized Speaker Profile Active
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Left: Input Create Slot */}
            <form onSubmit={handleAddSlot} className="md:col-span-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-600 flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                <Plus className="h-4 w-4 text-cyan-500" />
                Tambah Slot Baru
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10.5px] font-extrabold tracking-wide uppercase text-slate-500 mb-1">Tanggal Konsultasi</label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-extrabold tracking-wide uppercase text-slate-500 mb-1">Jam Mulai</label>
                    <input
                      type="text"
                      placeholder="e.g. 10:00"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 text-center"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-extrabold tracking-wide uppercase text-slate-500 mb-1">Jam Selesai</label>
                    <input
                      type="text"
                      placeholder="e.g. 10:45"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 text-center"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-extrabold tracking-wide uppercase text-slate-500 mb-1">Lokasi Sesi</label>
                  <input
                    type="text"
                    placeholder="e.g. Google Meet Link, Kelas Lounge"
                    value={newSlot.location}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Konfigurasikan Sebagai Tersedia
                </button>
              </div>
            </form>

            {/* Right: Manage Bookings Status Lists */}
            <div className="md:col-span-8 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <UserCheck className="h-4 w-4 text-rose-500" />
                Daftar Permintaan Masuk & Status Reservasi ({slots.filter(s => s.isBooked).length})
              </h3>

              {slots.filter(s => s.isBooked).length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                  <p className="text-xs text-slate-400 italic">Belum ada peserta yang melakukan reservasi pada slot yang disediakan.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {slots.filter(s => s.isBooked).map(slot => {
                    const info = slot.bookedBy!;
                    const isPending = info.status === 'pending';
                    const isApproved = info.status === 'approved';
                    const isRejected = info.status === 'rejected';

                    return (
                      <div key={slot.id} className="bg-white border border-slate-205 rounded-xl p-4 flex flex-col justify-between hover:border-rose-450 transition-all shadow-xs relative">
                        <div>
                          {/* Top Tag Header */}
                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-3">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                              {slot.date} @ {slot.startTime} - {slot.endTime}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              isRejected ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                              'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                            }`}>
                              {info.status}
                            </span>
                          </div>

                          {/* Booker Info details */}
                          <div className="space-y-2">
                            <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                              <User className="h-3 w-3 text-slate-400" />
                              {info.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {info.email} | {info.contact}
                            </p>
                            
                            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mt-2.5">
                              <span className="block text-[8.5px] font-mono text-slate-450 font-bold uppercase mb-0.5">Topik Diskusi / Goals</span>
                              <p className="text-[11px] font-semibold text-slate-700 leading-normal">
                                "{info.topic}"
                              </p>
                            </div>

                            {info.speakerNotes && (
                              <p className="text-[10px] bg-indigo-50/50 text-indigo-800 rounded-lg p-2 border border-indigo-100 font-medium">
                                📝 Notes: {info.speakerNotes}
                              </p>
                            )}

                            {info.meetingLink && isApproved && (
                              <div className="flex items-center gap-1 text-[10.5px] text-emerald-750 font-mono bg-emerald-50 w-fit px-2 py-0.5 rounded">
                                <Video className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{info.meetingLink}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Triggers */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 gap-2">
                          <button
                            type="button"
                            onClick={() => openApprovalModal(slot)}
                            className="text-xs text-indigo-650 hover:text-indigo-800 font-bold cursor-pointer"
                          >
                            Ubah Detail & Keputusan
                          </button>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleResetSlotToAvailable(slot.id)}
                              className="p-1.5 border border-slate-205 rounded-lg hover:bg-slate-100 text-slate-450 hover:text-slate-800 cursor-pointer"
                              title="Reset Slot ke Tersedia"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="p-1.5 border border-rose-100 rounded-lg hover:border-rose-450 text-rose-400 hover:text-rose-600 bg-rose-50/20 cursor-pointer animate-none"
                              title="Hapus Sesi"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid View Workarea for Participant */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Guidelines */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
            <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Compass className="h-4 w-4" />
              </span>
              Alur Pengajuan & Ketentuan
            </h3>

            <div className="space-y-4 font-sans text-slate-600 text-xs">
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold">
                  1
                </div>
                <div>
                  <strong className="text-slate-800">Pilih Slot Tersedia</strong>
                  <p className="text-slate-450 mt-1">Gunakan rincian slot waktu kosong di samping kanan untuk memilih jadwal yang cocok dengan kesibukan Anda.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold">
                  2
                </div>
                <div>
                  <strong className="text-slate-800">Isi Formulir Strategi</strong>
                  <p className="text-slate-450 mt-1 font-sans">Cantumkan rincian topik konkret atau tantangan CRM retail yang sedang Anda hadapi demi diskusi yang tajam.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold">
                  3
                </div>
                <div>
                  <strong className="text-slate-800">Persetujuan & Tautan</strong>
                  <p className="text-slate-450 mt-1 font-sans">Pembicara akan meninjau. Begitu disetujui, tautan Google Meet langsung aktif dalam detail jadwal reservasi Anda.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-indigo-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-950">
                <AlertCircle className="h-4 w-4 shrink-0 text-indigo-600" />
                Durasi 1-on-1 Sesi
              </div>
              <p className="text-indigo-850 leading-relaxed font-sans">
                Setiap sesi berdurasi ideal **30-45 menit**. Pastikan Anda telah menyelesaikan arsitektur CRM (Journey, Schema, RFM rules) di tab **Tools Architecting** dan menyalin draft prompt analisis untuk dibawa ke meja diskusi!
              </p>
            </div>
          </div>

          {/* Core Ticket/My Registered Consultations lists */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              Sesi Saya Terdaftar (My Bookings)
            </h3>

            {slots.filter(s => s.isBooked && s.bookedBy?.email === formData.email).length === 0 ? (
              <p className="text-xs text-slate-500 italic">Anda belum memiliki ajuan reservasi aktif saat ini.</p>
            ) : (
              <div className="space-y-3.5">
                {slots.filter(s => s.isBooked && s.bookedBy?.email === formData.email).map(s => {
                  const b = s.bookedBy!;
                  return (
                    <div key={s.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <span className="font-mono text-[10px] text-cyan-400 font-bold">{s.date} @ {s.startTime}</span>
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                          b.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          b.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-bold text-slate-200 truncate">{b.topic}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3 inline" />
                          {s.location}
                        </p>
                      </div>

                      {b.status === 'approved' && b.meetingLink && (
                        <a 
                          href={b.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-cyan-500 hover:bg-cyan-450 text-slate-950 font-bold rounded-lg tracking-wide transition-all font-mono text-[10.5px]"
                        >
                          <Video className="h-3.5 w-3.5" />
                          Gabung Google Meet
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}

                      {b.speakerNotes && (
                        <div className="text-[10px] text-slate-400 bg-slate-900 border border-slate-850 p-2 rounded-lg leading-relaxed">
                          <span className="font-bold text-slate-300 block mb-0.5">Catatan Speaker:</span>
                          "{b.speakerNotes}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Slots Grid Display */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Slot Pilihan Jadwal Ketersediaan Konsultasi
                </h3>
                <p className="text-xs text-slate-500">Dapatkan saran langsung dari professional consultant dengan cara memilih slot di bawah ini.</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-450 font-medium">Batas: 1 Peserta / 1 Sesi</span>
              </div>
            </div>

            {slots.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-16 text-center">
                <Calendar className="h-10 w-10 text-slate-350 mx-auto mb-4" />
                <h4 className="font-bold text-slate-800 mb-1">Seluruh Slot Kosong</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Belum ada slot ketersediaan waktu yang dikonfigurasikan oleh pembicara. Masuk dengan mode speaker untuk mengisi slot ketersediaan.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {slots.map(slot => {
                  const isBooked = slot.isBooked;
                  const isMineObj = isBooked && slot.bookedBy?.email === formData.email;
                  
                  return (
                    <div 
                      key={slot.id} 
                      className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                        isMineObj 
                          ? 'border-indigo-400 bg-indigo-50/15 shadow-sm' 
                          : isBooked 
                            ? 'border-slate-200 bg-slate-50 opacity-70 pointer-events-none' 
                            : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md cursor-pointer group'
                      }`}
                      onClick={() => !isBooked && openBookingModal(slot)}
                    >
                      <div>
                        {/* Time badges */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                          <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-indigo-600" />
                            {slot.startTime} - {slot.endTime}
                          </span>

                          {isBooked ? (
                            <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold ${
                              isMineObj ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isMineObj ? 'Reservasi Anda' : 'Terpesan'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-extrabold bg-emerald-50 text-emerald-700 font-mono group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              Tersedia
                            </span>
                          )}
                        </div>

                        {/* Location / notes */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-2.5">
                            <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase leading-none">TANGGAL</span>
                              <span className="text-xs font-semibold text-slate-800">{slot.date}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase leading-none">TEMPAT / MEDIA</span>
                              <span className="text-xs font-semibold text-slate-800 break-words">{slot.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Call-to-action button or reserved display info */}
                      <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
                        {isBooked ? (
                          <div className="text-[10.5px] text-slate-550 w-full">
                            {isMineObj ? (
                              <div className="flex items-center justify-between w-full">
                                <span className="text-indigo-600 font-bold">Reservasi Aktif</span>
                                <span className="text-xs font-semibold">Tinjau di menu kiri</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Dipesan oleh peserta lain</span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full group-hover:text-indigo-600 transition-colors">
                            <span className="text-xs font-extrabold">Ajukan Konsultasi</span>
                            <span className="text-xs font-bold leading-none">&rarr;</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Booking Modal Form Trigger Overlay */}
      {activeSlotForBooking && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-2 py-6 px-6 max-w-lg w-full shadow-2xl relative animate-scaleUp">
            <button
              type="button"
              onClick={() => setActiveSlotForBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-slot-100 pb-4 mb-4 text-left">
              <h3 className="font-display font-black text-slate-900 text-lg">
                Konfirmasi Booking Klinik CRM
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Jadwal: {activeSlotForBooking.date} pada {activeSlotForBooking.startTime} - {activeSlotForBooking.endTime}
              </p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-extrabold tracking-wide uppercase text-slate-500 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-slate-205 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="e.g. Adit Nugroho"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold tracking-wide uppercase text-slate-500 mb-1">
                  Email Korporat / Kontak Whatsapp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-slate-205 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="e.g. adit@retailindo.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold tracking-wide uppercase text-slate-500 mb-1">
                  Kontak WhatsApp (Nomor Telepon)
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-205 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="e.g. 0812-3456-7890"
                  required
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold tracking-wide uppercase text-slate-500 mb-1">
                  Spesifikasi Masalah / Goals Konsultasi
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 text-slate-400 pointer-events-none">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <textarea
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    rows={3}
                    className="w-full pl-9 pr-3 py-2 border border-slate-205 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="Terangkan masalah atau target yang ingin dicapai melalui interaksi ini secara spesifik..."
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSlotForBooking(null)}
                  className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-550 text-xs font-bold font-sans cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-sans shadow-md cursor-pointer"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Speaker Decisions / Request action Modal Overlay */}
      {activeRequestForAction && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-2 py-6 px-6 max-w-lg w-full shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setActiveRequestForAction(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display font-black text-rose-955 text-lg mb-1">
              Evaluasi Reservasi Masuk
            </h3>
            <p className="text-xs text-slate-500 pb-3 border-b border-slate-100 mb-4">
              Konfirmasi status janji temu dari peserta <strong>{activeRequestForAction.bookedBy?.name}</strong>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-extrabold tracking-wide uppercase text-slate-500 mb-1">
                  Google Meet Link / Detail Tautan Lokasi
                </label>
                <input
                  type="text"
                  value={actionMeetingLink}
                  onChange={(e) => setActionMeetingLink(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-255 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold tracking-wide uppercase text-slate-500 mb-1">
                  Catatan Tambahan untuk Peserta
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-255 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="e.g. Bawa data rata-rata transaksi bulanan Anda agar langsung disimulasikan."
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleRejectBooking}
                  className="py-2 px-4 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold cursor-pointer"
                >
                  Tolak / Reschedule
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveRequestForAction(null)}
                    className="py-2 px-4 rounded-xl border border-slate-205 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer font-sans"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleApproveBooking}
                    className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" />
                    Setujui & Publikasikan Sesi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
