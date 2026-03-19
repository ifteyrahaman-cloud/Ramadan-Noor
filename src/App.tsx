import { useState, useEffect, useCallback } from 'react';
import { 
  Moon, 
  Sun, 
  Clock, 
  BookOpen, 
  Heart, 
  TrendingUp, 
  Quote, 
  Calendar,
  ChevronRight,
  Sparkles,
  MapPin,
  Settings2,
  Send,
  Share2,
  Mail,
  Twitter,
  MessageCircle,
  Copy,
  Check,
  Search,
  Loader2,
  Trash2,
  Volume2,
  VolumeX,
  AlertCircle,
  X,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coordinates, 
  CalculationMethod, 
  PrayerTimes, 
  Madhab, 
  HighLatitudeRule 
} from 'adhan';

// Types for our data
interface PrayerTime {
  name: string;
  time: string;
}

interface Reflection {
  id: number;
  text: string;
  date: string;
}

const TRANSLATIONS = {
  en: {
    title: "Ramadan Noor",
    subtitle: "Sacred Journey",
    prayers: "Prayers",
    calendar: "Calendar",
    reflections: "Reflections",
    greetings: "Greetings",
    detectingLocation: "Detecting location...",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    expectedEid: "Expected Eid",
    nextPrayer: "Next Prayer",
    timeUntilNext: "Time until next",
    settings: "Settings",
    calcMethod: "Calculation Method",
    madhab: "Madhab",
    close: "Close",
    saveChanges: "Save Changes",
    manualLocation: "Manual Location",
    search: "Search",
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    reflectionPrompt: "What is on your heart today?",
    preserveMoment: "Preserve Moment",
    noReflections: "No reflections preserved yet.",
    shareJoy: "Share the Joy",
    copy: "Copy",
    copied: "Copied",
    share: "Share",
    eidGreetingsTitle: "Eid Greetings",
    innerPeace: "Inner Peace",
    journeyToEid: "The Journey to Eid",
    eidCountdown: "Eid-ul-Fitr Countdown",
    calculatingDate: "Calculating the sacred date...",
    meccaDefault: "Mecca (Default)",
    tomorrow: "Tomorrow",
    dailyReflection: "Daily Reflection",
    gratitude: "Gratitude",
    selfGrowth: "Self Growth",
    dailyReflectionDesc: "A sacred space for your spiritual journey and personal growth.",
    gratitudeDesc: "Cultivate a heart of thankfulness for every divine blessing.",
    selfGrowthDesc: "Strive for excellence in character and spirit every single day.",
    sacredMoments: "Sacred Moments",
    prayerTimes: "Prayer Times",
    next: "Next",
    in: "in",
    configure: "Configure",
    manualLocationLabel: "Manual Location (City, Country)",
    locationPlaceholder: "e.g. London, UK",
    update: "Update",
    auto: "Auto",
    juristicSchool: "Juristic School (Asr)",
    standardMadhab: "Standard (Shafi, Maliki, Hanbali)",
    hanafiMadhab: "Hanafi",
    current: "Current",
    divineWisdom: "Divine Wisdom",
    quranQuote: "Indeed, with hardship comes ease.",
    quranSource: "Quran 94:6",
    sacredCalendar: "Sacred Calendar",
    ramadanJourney: "Ramadan Journey",
    currentPeriod: "Current Period",
    sun: "Sun",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    ramadanNote: "Note: Ramadan dates are subject to moon sighting.",
    reflectionDesc: "Document your spiritual growth, moments of gratitude, and personal breakthroughs during this holy month.",
    scroll: "Scroll",
    ram: "Ram",
    railLeft: "Ramadan Kareem • Spiritual Excellence • Sacred Moments",
    railRight: "Patience • Gratitude • Reflection • Growth",
    builtWith: "Built with",
    tourWelcomeTitle: "Welcome to Ramadan Noor",
    tourWelcomeDesc: "Let us guide you through your sacred journey this holy month.",
    tourPrayersTitle: "Sacred Moments",
    tourPrayersDesc: "Stay connected with your daily prayers. We automatically detect your location for accuracy.",
    tourReflectionsTitle: "Inner Peace",
    tourReflectionsDesc: "Preserve your spiritual growth and moments of gratitude in your personal journal.",
    tourGreetingsTitle: "Share the Joy",
    tourGreetingsDesc: "Spread the blessings of Eid with beautifully crafted greetings for your loved ones.",
    back: "Back",
    skip: "Skip",
    finish: "Finish",
    startTour: "Start Tour",
    shareEmail: "Email",
    shareTwitter: "X (Twitter)",
    shareWhatsApp: "WhatsApp"
  },
  ar: {
    title: "نور رمضان",
    subtitle: "رحلة مقدسة",
    prayers: "الصلوات",
    calendar: "التقويم",
    reflections: "تأملات",
    greetings: "تهاني",
    detectingLocation: "جاري تحديد الموقع...",
    days: "أيام",
    hours: "ساعات",
    minutes: "دقائق",
    seconds: "ثواني",
    expectedEid: "عيد الفطر المتوقع",
    nextPrayer: "الصلاة القادمة",
    timeUntilNext: "الوقت المتبقي",
    settings: "الإعدادات",
    calcMethod: "طريقة الحساب",
    madhab: "المذهب",
    close: "إغلاق",
    saveChanges: "حفظ التغييرات",
    manualLocation: "الموقع اليدوي",
    search: "بحث",
    fajr: "الفجر",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
    reflectionPrompt: "ماذا يدور في قلبك اليوم؟",
    preserveMoment: "حفظ اللحظة",
    noReflections: "لا توجد تأملات محفوظة بعد.",
    shareJoy: "شارك الفرحة",
    copy: "نسخ",
    copied: "تم النسخ",
    share: "مشاركة",
    eidGreetingsTitle: "تهاني العيد",
    innerPeace: "سلام داخلي",
    journeyToEid: "الرحلة إلى العيد",
    eidCountdown: "تنازل عيد الفطر",
    calculatingDate: "جاري حساب التاريخ المقدس...",
    meccaDefault: "مكة المكرمة (افتراضي)",
    tomorrow: "غداً",
    dailyReflection: "تأمل يومي",
    gratitude: "امتنان",
    selfGrowth: "نمو ذاتي",
    dailyReflectionDesc: "مساحة مقدسة لرحلتك الروحية ونموك الشخصي.",
    gratitudeDesc: "ازرع قلباً شاكراً لكل نعمة إلهية.",
    selfGrowthDesc: "اسعَ للتميز في الأخلاق والروح كل يوم.",
    sacredMoments: "لحظات مقدسة",
    prayerTimes: "أوقات الصلاة",
    next: "التالي",
    in: "في",
    configure: "إعداد",
    manualLocationLabel: "الموقع اليدوي (المدينة، الدولة)",
    locationPlaceholder: "مثال: لندن، المملكة المتحدة",
    update: "تحديث",
    auto: "تلقائي",
    juristicSchool: "المذهب الفقهي (العصر)",
    standardMadhab: "قياسي (شافعي، مالكي، حنبلي)",
    hanafiMadhab: "حنفي",
    current: "الحالي",
    divineWisdom: "حكمة إلهية",
    quranQuote: "فإن مع العسر يسراً",
    quranSource: "القرآن 94:6",
    sacredCalendar: "التقويم المقدس",
    ramadanJourney: "رحلة رمضان",
    currentPeriod: "الفترة الحالية",
    sun: "أحد",
    mon: "اثنين",
    tue: "ثلاثاء",
    wed: "أربعاء",
    thu: "خميس",
    fri: "جمعة",
    sat: "سبت",
    ramadanNote: "ملاحظة: تواريخ رمضان تخضع لرؤية الهلال.",
    reflectionDesc: "وثق نموك الروحي، ولحظات الامتنان، والاختراقات الشخصية خلال هذا الشهر الكريم.",
    scroll: "تمرير",
    ram: "رمضان",
    railLeft: "رمضان كريم • تميز روحي • لحظات مقدسة",
    railRight: "صبر • امتنان • تأمل • نمو",
    builtWith: "تم التطوير بواسطة",
    tourWelcomeTitle: "مرحباً بك في نور رمضان",
    tourWelcomeDesc: "دعنا نرشدك خلال رحلتك المقدسة في هذا الشهر الفضيل.",
    tourPrayersTitle: "لحظات مقدسة",
    tourPrayersDesc: "ابقَ على اتصال بصلواتك اليومية. نحدد موقعك تلقائياً لضمان الدقة.",
    tourReflectionsTitle: "سلام داخلي",
    tourReflectionsDesc: "حافظ على نموك الروحي ولحظات الامتنان في مذكراتك الشخصية.",
    tourGreetingsTitle: "شارك الفرحة",
    tourGreetingsDesc: "انشر بركات العيد بتهاني مصممة بشكل جميل لأحبائك.",
    back: "السابق",
    skip: "تخطي",
    finish: "إنهاء",
    startTour: "ابدأ الجولة",
    shareEmail: "البريد الإلكتروني",
    shareTwitter: "X (تويتر)",
    shareWhatsApp: "واتساب"
  }
};

export default function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Prayer Times State
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationName, setLocationName] = useState<string>('Detecting location...');
  const [method, setMethod] = useState<keyof typeof CalculationMethod>('MuslimWorldLeague');
  const [madhab, setMadhab] = useState<keyof typeof Madhab>('Shafi');
  const [calculatedPrayerTimes, setCalculatedPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [manualLocation, setManualLocation] = useState<string>(localStorage.getItem('ramadan_noor_manual_location') || '');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    const saved = localStorage.getItem('ramadan_noor_lang');
    return (saved as 'en' | 'ar') || 'en';
  });

  // Onboarding Tour State
  const [showTour, setShowTour] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const tourCompleted = localStorage.getItem('ramadan_noor_tour_completed');
    if (!tourCompleted) {
      const timer = setTimeout(() => setShowTour(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTourNext = () => {
    if (currentTourStep < 3) {
      setCurrentTourStep(currentTourStep + 1);
      const targets = ['hero', 'prayer-times', 'reflections', 'greetings'];
      const targetId = targets[currentTourStep + 1];
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      handleTourFinish();
    }
  };

  const handleTourBack = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(currentTourStep - 1);
      const targets = ['hero', 'prayer-times', 'reflections', 'greetings'];
      const targetId = targets[currentTourStep - 1];
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleTourFinish = () => {
    setShowTour(false);
    localStorage.setItem('ramadan_noor_tour_completed', 'true');
  };

  useEffect(() => {
    localStorage.setItem('ramadan_noor_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Reflections State
  const [userReflections, setUserReflections] = useState<Reflection[]>(() => {
    const saved = localStorage.getItem('ramadan_noor_reflections');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Today I practiced patience and stayed calm.', date: '2026-03-18' },
      { id: 2, text: 'Helped someone selflessly.', date: '2026-03-19' }
    ];
  });
  const [newReflection, setNewReflection] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Target date for Eid-ul-Fitr (Default to March 21, 2026)
  const [targetDate, setTargetDate] = useState<number>(new Date(2026, 2, 21).getTime());
  const [isFetchingDate, setIsFetchingDate] = useState(true);

  // Fetch the real Eid date from Aladhan API
  useEffect(() => {
    const fetchEidDate = async () => {
      try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const dateStr = `${dd}-${mm}-${yyyy}`;
        
        const res = await fetch(`https://api.aladhan.com/v1/gregorianToHijri/${dateStr}`);
        if (!res.ok) throw new Error("Could not connect to the calendar service.");
        const data = await res.json();
        
        if (data && data.code === 200) {
          let hijriYear = parseInt(data.data.hijri.year);
          const currentMonth = parseInt(data.data.hijri.month.number);
          const currentDay = parseInt(data.data.hijri.day);
          
          // Shawwal is month 10. If we are in Shawwal or later, target next year.
          if (currentMonth > 10 || (currentMonth === 10 && currentDay >= 1)) {
            hijriYear += 1;
          }

          const eidRes = await fetch(`https://api.aladhan.com/v1/hToG/01-10-${hijriYear}`);
          if (!eidRes.ok) throw new Error("Could not calculate the next Eid date.");
          const eidData = await eidRes.json();
          
          if (eidData && eidData.code === 200) {
            const gDate = eidData.data.gregorian;
            const dateParts = gDate.date.split('-'); // DD-MM-YYYY
            const target = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0])).getTime();
            
            // Ensure the target is in the future
            if (target > today.getTime()) {
              setTargetDate(target);
            } else {
              // If calculated target is in the past, try next year
              const nextEidRes = await fetch(`https://api.aladhan.com/v1/hToG/01-10-${hijriYear + 1}`);
              if (!nextEidRes.ok) throw new Error("Could not calculate the next Eid date.");
              const nextEidData = await nextEidRes.json();
              if (nextEidData && nextEidData.code === 200) {
                const nextGDate = nextEidData.data.gregorian;
                const nextDateParts = nextGDate.date.split('-');
                const nextTarget = new Date(parseInt(nextDateParts[2]), parseInt(nextDateParts[1]) - 1, parseInt(nextDateParts[0])).getTime();
                setTargetDate(nextTarget);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching Eid date:", err);
        setError("Unable to sync with the lunar calendar. Using estimated dates.");
      } finally {
        setIsFetchingDate(false);
      }
    };

    fetchEidDate();
  }, []);

  const handleManualLocationSearch = async (query: string) => {
    if (!query) return;
    setIsGeocoding(true);
    try {
      const res = await fetch(`https://api.aladhan.com/v1/address?address=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Location service unavailable.");
      const data = await res.json();
      if (data && data.code === 200) {
        const { latitude, longitude } = data.data;
        const coords = new Coordinates(latitude, longitude);
        setLocation(coords);
        setLocationName(query);
        localStorage.setItem('ramadan_noor_manual_location', query);
      } else {
        throw new Error("We couldn't find that location. Please try a different city or address.");
      }
    } catch (err) {
      console.error("Error geocoding location:", err);
      setError(err instanceof Error ? err.message : "An error occurred while searching for the location.");
      // Fallback to default if manual search fails and no location set
      if (!location) {
        const mecca = new Coordinates(21.4225, 39.8262);
        setLocation(mecca);
        setLocationName('Mecca (Default)');
      }
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      return true;
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    localStorage.setItem('ramadan_noor_reflections', JSON.stringify(userReflections));
  }, [userReflections]);

  const handleAddReflection = () => {
    if (!newReflection.trim()) return;
    const reflection: Reflection = {
      id: Date.now(),
      text: newReflection,
      date: new Date().toISOString().split('T')[0]
    };
    setUserReflections([reflection, ...userReflections]);
    setNewReflection('');
  };

  const handleDeleteReflection = (id: number) => {
    setUserReflections(userReflections.filter(r => r.id !== id));
  };

  const handleShareReflection = (text: string, platform: 'email' | 'twitter' | 'whatsapp') => {
    const shareText = encodeURIComponent(`"${text}" - My Ramadan Reflection via Ramadan Noor`);
    const url = window.location.href;
    
    let shareUrl = '';
    switch (platform) {
      case 'email':
        shareUrl = `mailto:?subject=Ramadan Reflection&body=${shareText}%0A%0AView more at: ${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${shareText}%20${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  // Audio Logic
  useEffect(() => {
    const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-meditation-soft-bells-574.mp3');
    audio.loop = true;
    audio.volume = 0.2;

    if (!isMuted) {
      audio.play().catch(err => console.error("Audio playback failed:", err));
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [isMuted]);

  // Geolocation Effect
  useEffect(() => {
    const savedLocation = localStorage.getItem('ramadan_noor_manual_location');
    if (savedLocation) {
      handleManualLocationSearch(savedLocation);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = new Coordinates(position.coords.latitude, position.coords.longitude);
          setLocation(coords);
          setLocationName(`Lat: ${coords.latitude.toFixed(2)}, Lng: ${coords.longitude.toFixed(2)}`);
        },
        (err) => {
          console.error("Error getting location:", err);
          let userMessage = "Unable to access your location. Using default settings.";
          if (err.code === err.PERMISSION_DENIED) {
            userMessage = "Location access was denied. Using default settings.";
          }
          setError(userMessage);
          // Default to Mecca if location access is denied
          const mecca = new Coordinates(21.4225, 39.8262);
          setLocation(mecca);
          setLocationName('Mecca (Default)');
        }
      );
    } else {
      // Default to Mecca if geolocation is not supported
      const mecca = new Coordinates(21.4225, 39.8262);
      setLocation(mecca);
      setLocationName('Mecca (Default)');
    }
  }, []);

  // Prayer Times Calculation Effect
  const calculateTimes = useCallback(() => {
    if (!location) return;

    const date = new Date();
    const params = CalculationMethod[method]();
    params.madhab = Madhab[madhab];
    params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;

    const prayerTimes = new PrayerTimes(location, date, params);
    
    const formatTime = (time: Date) => {
      return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const times: PrayerTime[] = [
      { name: t.fajr, time: formatTime(prayerTimes.fajr) },
      { name: t.dhuhr, time: formatTime(prayerTimes.dhuhr) },
      { name: t.asr, time: formatTime(prayerTimes.asr) },
      { name: t.maghrib, time: formatTime(prayerTimes.maghrib) },
      { name: t.isha, time: formatTime(prayerTimes.isha) }
    ];

    setCalculatedPrayerTimes(times);

    // Find next prayer
    const now = new Date();
    const allPrayers = [
      { name: t.fajr, time: prayerTimes.fajr },
      { name: t.dhuhr, time: prayerTimes.dhuhr },
      { name: t.asr, time: prayerTimes.asr },
      { name: t.maghrib, time: prayerTimes.maghrib },
      { name: t.isha, time: prayerTimes.isha }
    ];

    let next = allPrayers.find(p => p.time > now);
    
    // If all prayers for today have passed, next is tomorrow's Fajr
    if (!next) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = new PrayerTimes(location, tomorrow, params);
      setNextPrayer(`${t.fajr} (${t.tomorrow})`);
      const diff = tomorrowTimes.fajr.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilNext(`${h}${lang === 'ar' ? 'س' : 'h'} ${m}${lang === 'ar' ? 'د' : 'm'}`);
    } else {
      setNextPrayer(next.name);
      const diff = next.time.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilNext(`${h}${lang === 'ar' ? 'س' : 'h'} ${m}${lang === 'ar' ? 'د' : 'm'}`);
    }
  }, [location, method, madhab, lang, t]);

  useEffect(() => {
    calculateTimes();
    // Update every minute to keep "Next Prayer" and countdown fresh
    const interval = setInterval(calculateTimes, 60000);
    return () => clearInterval(interval);
  }, [calculateTimes]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Fill empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Fill days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const defaultPrayerTimes: PrayerTime[] = [
    { name: 'Fajr', time: '5:20 AM' },
    { name: 'Dhuhr', time: '1:30 PM' },
    { name: 'Asr', time: '5:00 PM' },
    { name: 'Maghrib', time: '6:20 PM' },
    { name: 'Isha', time: '8:00 PM' }
  ];

  const eidGreetings = lang === 'en' ? [
    "Eid Mubarak! May this special day bring peace, happiness, and prosperity to everyone. 🌙✨",
    "Wishing you and your family a very happy, prosperous, and blissful Eid-ul-Fitr! 🕌",
    "May Allah's blessings be with you today and always. Eid Mubarak! 🤲",
    "Sending you warm wishes on Eid and wishing that it brings your way ever joys and happiness. 🎈"
  ] : [
    "عيد مبارك! أعاد الله عليكم هذا اليوم الخاص بالسلام والسعادة والازدهار للجميع. 🌙✨",
    "أتمنى لك ولعائلتك عيد فطر سعيداً ومزدهراً ومباركاً! 🕌",
    "بارك الله فيكم اليوم ودائماً. عيد مبارك! 🤲",
    "أرسل لك أحر التمنيات بالعيد وأتمنى أن يجلب لك الفرح والسعادة الدائمة. 🎈"
  ];

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Eid Greeting',
          text: text,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopy(text, -1); // Fallback to copy if share is not supported
    }
  };

  return (
    <div className={`min-h-screen bg-luxury-paper text-luxury-ink selection:bg-luxury-gold/20 selection:text-luxury-green ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Refined Header */}
      <header className="fixed top-0 left-0 right-0 z-50 luxury-glass border-b border-luxury-gold/10">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-luxury-green rounded-full flex items-center justify-center shadow-2xl shadow-luxury-green/40">
              <Moon className="w-6 h-6 text-luxury-gold fill-luxury-gold" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-luxury-green leading-none">{t.title}</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-bold mt-1">{t.subtitle}</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-luxury-ink/60">
            <a href="#prayer-times" className="hover:text-luxury-gold transition-all duration-300 relative group">
              {t.prayers}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-gold transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#calendar" className="hover:text-luxury-gold transition-all duration-300 relative group">
              {t.calendar}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-gold transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#reflections" className="hover:text-luxury-gold transition-all duration-300 relative group">
              {t.reflections}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-gold transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#greetings" className="hover:text-luxury-gold transition-all duration-300 relative group">
              {t.greetings}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-gold transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-luxury-gold/20 text-luxury-green hover:bg-luxury-gold hover:text-luxury-green transition-all duration-500"
            >
              <Languages className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-widest">{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>
            <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-luxury-green/5 rounded-full border border-luxury-gold/20">
              <MapPin className="w-4 h-4 text-luxury-gold" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-luxury-green/80">{locationName === 'Detecting location...' ? t.detectingLocation : (locationName === 'Mecca (Default)' ? t.meccaDefault : locationName)}</span>
            </div>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-all duration-700 border ${
                isMuted ? 'bg-white text-luxury-ink/40 border-luxury-gold/10' : 'bg-luxury-green text-luxury-gold border-luxury-gold/30 shadow-2xl shadow-luxury-green/30'
              }`}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Countdown */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-32">
        {/* Background Image with Animation */}
        <motion.div 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.12 }}
          transition={{ duration: 4, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=2070&auto=format&fit=crop" 
            alt="Eid Celebration" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-paper via-transparent to-luxury-paper" />
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Animated Gradients */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
              opacity: [0.05, 0.08, 0.05]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.1),transparent_70%)]" 
          />
          
          <motion.div 
            animate={{ 
              x: [0, -100, 0],
              y: [0, 100, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-48 -left-48 w-[50rem] h-[50rem] bg-luxury-gold/10 rounded-full blur-[150px]" 
          />
          
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-48 -right-48 w-[50rem] h-[50rem] bg-luxury-green/10 rounded-full blur-[150px]" 
          />

          {/* Twinkling Stars / Particles */}
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: Math.random() * 0.5,
                  scale: Math.random() * 0.5 + 0.5,
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%"
                }}
                animate={{ 
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{ 
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
                className="absolute w-1 h-1 bg-luxury-gold rounded-full blur-[1px]"
              />
            ))}
          </div>
          
          {/* Vertical Rail Text */}
          <motion.div 
            initial={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className={`absolute ${lang === 'ar' ? 'right-10' : 'left-10'} top-1/2 -translate-y-1/2 vertical-text text-[10px] uppercase tracking-[0.5em] text-luxury-gold/30 font-bold hidden xl:block`}
          >
            {t.railLeft}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: lang === 'ar' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className={`absolute ${lang === 'ar' ? 'left-10' : 'right-10'} top-1/2 -translate-y-1/2 vertical-text text-[10px] uppercase tracking-[0.5em] text-luxury-gold/30 font-bold hidden xl:block`}
          >
            {t.railRight}
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto pt-[100px]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-luxury-gold/40" />
              <span className="text-luxury-gold font-serif italic text-2xl md:text-3xl">{t.journeyToEid}</span>
              <div className="w-12 h-px bg-luxury-gold/40" />
            </div>
            <h1 className="text-6xl md:text-[10rem] font-bold tracking-tighter text-luxury-green leading-[0.85] mb-12 text-balance">
              {t.eidCountdown}
            </h1>
          </motion.div>

          {/* Countdown Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mb-16">
            {isFetchingDate ? (
              <div className="col-span-4 py-12 flex flex-col items-center justify-center gap-6 text-luxury-gold">
                <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
                <span className="font-serif italic text-2xl">{t.calculatingDate}</span>
              </div>
            ) : (
              [
                { label: t.days, value: timeLeft.days },
                { label: t.hours, value: timeLeft.hours },
                { label: t.minutes, value: timeLeft.minutes },
                { label: t.seconds, value: timeLeft.seconds }
              ].map((item, idx) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                  className="luxury-glass rounded-[2.5rem] p-8 md:p-12 w-40 md:w-52 luxury-border shadow-2xl shadow-luxury-green/5 flex flex-col items-center group hover:border-luxury-gold/40 transition-all duration-700"
                >
                  <div className="relative h-16 md:h-20 mb-4 w-full">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={item.value}
                        initial={{ y: 30, opacity: 0, filter: 'blur(10px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ y: -30, opacity: 0, filter: 'blur(10px)' }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        className="text-5xl md:text-7xl font-serif font-bold text-luxury-green absolute inset-0 flex items-center justify-center"
                      >
                        {item.value}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-gold group-hover:tracking-[0.4em] transition-all duration-700">{item.label}</div>
                </motion.div>
              ))
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex items-center gap-4 text-sm font-medium text-luxury-ink/60 bg-white/40 backdrop-blur-md px-8 py-4 rounded-full border border-luxury-gold/10 shadow-xl"
          >
            <Calendar className="w-5 h-5 text-luxury-gold" />
            <span className="font-serif italic text-xl">
              {isFetchingDate 
                ? t.calculatingDate 
                : `${t.expectedEid}: ${targetDate ? new Date(targetDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }) : '21 March 2026'}`
              }
            </span>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold/60">{t.scroll}</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-luxury-gold to-transparent"
          />
        </motion.div>
      </section>

      {/* Action Cards Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: t.dailyReflection, desc: t.dailyReflectionDesc, icon: BookOpen, color: 'bg-emerald-50 text-emerald-700' },
            { title: t.gratitude, desc: t.gratitudeDesc, icon: Heart, color: 'bg-amber-50 text-amber-600' },
            { title: t.selfGrowth, desc: t.selfGrowthDesc, icon: TrendingUp, color: 'bg-orange-50 text-orange-600' }
          ].map((card, idx) => (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -15 }}
              className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-luxury-green/5 flex flex-col items-start text-left luxury-border transition-all duration-700 hover:shadow-luxury-gold/5 group"
            >
              <div className={`mb-10 p-5 rounded-3xl ${card.color} transition-transform duration-700 group-hover:scale-110`}>
                <card.icon className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold mb-6 text-luxury-green">{card.title}</h3>
              <p className="text-luxury-ink/60 text-xl leading-relaxed font-light">{card.desc}</p>
              <div className="mt-10 w-16 h-1 bg-luxury-gold/20 rounded-full group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Prayer Times Section */}
      <section id="prayer-times" className="max-w-7xl mx-auto px-6 py-40 border-y border-luxury-gold/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 mb-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-luxury-gold rounded-full" />
              <span className="text-luxury-gold font-serif italic text-3xl">{t.sacredMoments}</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-bold text-luxury-green tracking-tighter">{t.prayerTimes}</h2>
            {nextPrayer && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-4 px-6 py-3 bg-luxury-green text-luxury-gold text-sm font-bold rounded-full shadow-2xl shadow-luxury-green/30 border border-luxury-gold/20"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-luxury-gold"></span>
                </span>
                {t.next}: {nextPrayer} {t.in} {timeUntilNext}
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="group flex items-center gap-4 px-8 py-4 rounded-full bg-white border border-luxury-gold/20 shadow-lg text-luxury-green font-bold uppercase tracking-widest text-xs hover:bg-luxury-green hover:text-luxury-gold transition-all duration-700"
            >
              <Settings2 className="w-5 h-5 group-hover:rotate-180 transition-transform duration-1000" />
              <span>{t.configure}</span>
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-20"
            >
              <div className="bg-white rounded-[3rem] p-12 luxury-border shadow-2xl shadow-luxury-green/5 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-luxury-gold uppercase tracking-[0.3em] mb-6">{t.manualLocationLabel}</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <input 
                        type="text"
                        value={manualLocation}
                        onChange={(e) => setManualLocation(e.target.value)}
                        placeholder={t.locationPlaceholder}
                        className="w-full bg-luxury-paper border border-luxury-gold/10 rounded-2xl p-5 pl-14 text-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 font-light transition-all duration-300"
                      />
                      <Search className={`w-5 h-5 text-luxury-gold/40 absolute ${lang === 'ar' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2`} />
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleManualLocationSearch(manualLocation)}
                        disabled={isGeocoding}
                        className="bg-luxury-green text-luxury-gold px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-luxury-green/90 transition-all duration-500 disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-luxury-green/10"
                      >
                        {isGeocoding ? <Loader2 className="w-4 h-4 animate-spin" /> : t.update}
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.removeItem('ramadan_noor_manual_location');
                          setManualLocation('');
                          window.location.reload();
                        }}
                        className="bg-luxury-gold/10 text-luxury-green px-8 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-luxury-gold/20 transition-all duration-500"
                      >
                        {t.auto}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-luxury-gold uppercase tracking-[0.3em] mb-6">{t.calcMethod}</label>
                  <div className="relative">
                    <select 
                      value={method}
                      onChange={(e) => setMethod(e.target.value as keyof typeof CalculationMethod)}
                      className={`w-full bg-luxury-paper border border-luxury-gold/10 rounded-2xl p-5 text-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 font-light appearance-none cursor-pointer ${lang === 'ar' ? 'pl-12' : 'pr-12'}`}
                    >
                      {Object.keys(CalculationMethod).map((m) => (
                        <option key={m} value={m}>{m.replace(/([A-Z])/g, ' $1').trim()}</option>
                      ))}
                    </select>
                    <div className={`absolute ${lang === 'ar' ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 pointer-events-none text-luxury-gold`}>
                      <ChevronRight className={`w-5 h-5 rotate-90`} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-luxury-gold uppercase tracking-[0.3em] mb-6">{t.juristicSchool}</label>
                  <div className="relative">
                    <select 
                      value={madhab}
                      onChange={(e) => setMadhab(e.target.value as keyof typeof Madhab)}
                      className={`w-full bg-luxury-paper border border-luxury-gold/10 rounded-2xl p-5 text-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 font-light appearance-none cursor-pointer ${lang === 'ar' ? 'pl-12' : 'pr-12'}`}
                    >
                      <option value="Shafi">{t.standardMadhab}</option>
                      <option value="Hanafi">{t.hanafiMadhab}</option>
                    </select>
                    <div className={`absolute ${lang === 'ar' ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 pointer-events-none text-luxury-gold`}>
                      <ChevronRight className={`w-5 h-5 rotate-90`} />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-center mt-4">
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      setCurrentTourStep(0);
                      setShowTour(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-luxury-gold text-luxury-green text-[11px] font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-500 shadow-xl shadow-luxury-gold/10"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t.startTour}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {(calculatedPrayerTimes.length > 0 ? calculatedPrayerTimes : defaultPrayerTimes).map((prayer, idx) => (
            <motion.div 
              key={prayer.name} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-[3rem] p-12 border text-center transition-all duration-1000 group ${
                nextPrayer === prayer.name 
                  ? 'bg-luxury-green border-luxury-gold scale-105 shadow-[0_30px_60px_-15px_rgba(15,61,46,0.4)]' 
                  : 'bg-white border-luxury-gold/10 hover:border-luxury-gold/40 hover:shadow-2xl hover:shadow-luxury-green/5'
              }`}
            >
              <div className={`text-[11px] font-bold uppercase tracking-[0.3em] mb-6 transition-colors duration-700 ${nextPrayer === prayer.name ? 'text-luxury-gold' : 'text-luxury-ink/40 group-hover:text-luxury-gold'}`}>
                {prayer.name}
              </div>
              <div className={`font-serif text-5xl font-bold transition-colors duration-700 ${nextPrayer === prayer.name ? 'text-white' : 'text-luxury-green'}`}>
                {prayer.time}
              </div>
              {nextPrayer === prayer.name && (
                <div className="mt-8 text-[10px] font-bold text-luxury-gold uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-pulse" />
                  {t.current}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Reminder Section */}
      <section className="max-w-5xl mx-auto px-6 py-40">
        <div className="flex flex-col items-center text-center mb-16">
          <Quote className="w-10 h-10 text-luxury-gold mb-8 opacity-40" />
          <span className="text-luxury-gold font-serif italic text-3xl mb-4">{t.divineWisdom}</span>
          <div className="w-20 h-px bg-luxury-gold/20" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="bg-white rounded-[4rem] p-20 md:p-32 shadow-2xl shadow-luxury-green/5 luxury-border text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-luxury-gold to-transparent opacity-40" />
          <p className="font-serif italic text-4xl md:text-6xl text-luxury-green leading-[1.3] mb-12 text-balance">
            "{t.quranQuote}"
          </p>
          <div className="w-24 h-0.5 bg-luxury-gold/20 mx-auto mb-8" />
          <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-gold">{t.quranSource}</span>
          
          {/* Decorative Corner */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-luxury-gold/5 rounded-full blur-3xl" />
        </motion.div>
      </section>

      {/* Ramadan Calendar Section */}
      <section id="calendar" className="max-w-7xl mx-auto px-6 py-40">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-luxury-gold font-serif italic text-3xl mb-4">{t.sacredCalendar}</span>
          <h2 className="text-6xl md:text-8xl font-bold text-luxury-green tracking-tighter">{t.ramadanJourney}</h2>
        </div>

        <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(15,61,46,0.15)] luxury-border overflow-hidden max-w-5xl mx-auto">
          <div className="bg-luxury-green p-12 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-luxury-gold text-[11px] font-bold uppercase tracking-[0.4em] mb-4">{t.currentPeriod}</span>
              <h3 className="text-5xl md:text-6xl font-serif font-bold text-white">
                {currentMonth.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-GB', { month: 'long', year: 'numeric' })}
              </h3>
            </div>
            <div className="flex gap-6">
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                className="w-16 h-16 flex items-center justify-center bg-white/5 hover:bg-luxury-gold hover:text-luxury-green rounded-full transition-all duration-700 border border-white/10 group"
              >
                <ChevronRight className={`w-6 h-6 ${lang === 'ar' ? '' : 'rotate-180'} group-hover:${lang === 'ar' ? 'translate-x-1' : '-translate-x-1'} transition-transform`} />
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                className="w-16 h-16 flex items-center justify-center bg-white/5 hover:bg-luxury-gold hover:text-luxury-green rounded-full transition-all duration-700 border border-white/10 group"
              >
                <ChevronRight className={`w-6 h-6 ${lang === 'ar' ? 'rotate-180' : ''} group-hover:${lang === 'ar' ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
              </button>
            </div>
          </div>

          <div className="p-12 md:p-20">
            <div className="grid grid-cols-7 mb-12">
              {[t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat].map(day => (
                <div key={day} className="text-center text-[11px] font-bold text-luxury-ink/30 uppercase tracking-[0.4em] py-4">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-4 md:gap-6">
              {getDaysInMonth(currentMonth).map((date, index) => (
                <motion.div 
                  key={index}
                  whileHover={date ? { scale: 1.05, y: -5 } : {}}
                  className={`aspect-square rounded-[2rem] flex flex-col items-center justify-center relative transition-all duration-700 ${
                    !date ? 'opacity-0' : 'hover:bg-luxury-paper cursor-pointer border border-transparent hover:border-luxury-gold/30'
                  } ${isToday(date) ? 'bg-luxury-green text-luxury-gold shadow-2xl shadow-luxury-green/20' : 'text-luxury-ink'}`}
                >
                  {date && (
                    <>
                      <span className="text-3xl font-serif font-bold">{date.getDate()}</span>
                      {currentMonth.getMonth() === 2 && (
                        <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${isToday(date) ? 'text-luxury-gold/60' : 'text-luxury-gold'}`}>
                          {date.getDate()} {t.ram}
                        </span>
                      )}
                    </>
                  )}
                  {isToday(date) && (
                    <motion.div 
                      layoutId="today-glow"
                      className="absolute inset-0 rounded-[2rem] ring-4 ring-luxury-gold/30"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-luxury-paper/50 p-8 text-center text-[11px] font-bold text-luxury-gold uppercase tracking-[0.3em] border-t border-luxury-gold/10">
            {t.ramadanNote}
          </div>
        </div>
      </section>

      <section id="reflections" className="max-w-7xl mx-auto px-6 py-40 border-t border-luxury-gold/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <div className="flex flex-col gap-6 mb-16">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-luxury-gold rounded-full" />
                <span className="text-luxury-gold font-serif italic text-3xl">{t.innerPeace}</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-bold text-luxury-green tracking-tighter">{t.reflections}</h2>
              <p className="text-luxury-ink/60 text-xl font-light leading-relaxed max-w-md">
                {t.reflectionDesc}
              </p>
            </div>

            <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-luxury-green/5 luxury-border">
              <textarea 
                value={newReflection}
                onChange={(e) => setNewReflection(e.target.value)}
                placeholder={t.reflectionPrompt}
                className="w-full h-52 bg-luxury-paper border border-luxury-gold/10 rounded-3xl p-8 text-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 resize-none font-light italic transition-all duration-300"
              />
              <button 
                onClick={handleAddReflection}
                className="mt-8 w-full bg-luxury-green text-luxury-gold py-6 rounded-2xl text-xs font-bold uppercase tracking-[0.3em] hover:bg-luxury-green/90 transition-all duration-700 shadow-2xl shadow-luxury-green/20 flex items-center justify-center gap-4 group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>{t.preserveMoment}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-8 max-h-[800px] overflow-y-auto pr-6 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {userReflections.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  className="bg-white rounded-[3rem] p-10 luxury-border shadow-xl shadow-luxury-green/5 group hover:shadow-2xl hover:shadow-luxury-gold/5 transition-all duration-700"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[11px] font-bold text-luxury-gold uppercase tracking-[0.4em]">
                      {new Date(item.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500 mr-2">
                        <button 
                          onClick={() => handleShareReflection(item.text, 'email')}
                          title={t.shareEmail}
                          className="p-2 text-luxury-gold/40 hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-full transition-all"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleShareReflection(item.text, 'twitter')}
                          title={t.shareTwitter}
                          className="p-2 text-luxury-gold/40 hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-full transition-all"
                        >
                          <Twitter className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleShareReflection(item.text, 'whatsapp')}
                          title={t.shareWhatsApp}
                          className="p-2 text-luxury-gold/40 hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-full transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleDeleteReflection(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-luxury-ink/80 text-2xl font-serif italic leading-relaxed">"{item.text}"</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {userReflections.length === 0 && (
              <div className="text-center py-20 text-luxury-ink/20 italic font-serif text-2xl">
                {t.noReflections}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Eid Greetings Section */}
      <section id="greetings" className="max-w-7xl mx-auto px-6 py-40 border-t border-luxury-gold/10">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-luxury-gold font-serif italic text-3xl mb-4">{t.shareJoy}</span>
          <h2 className="text-6xl md:text-8xl font-bold text-luxury-green tracking-tighter">{t.eidGreetingsTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {eidGreetings.map((greeting, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[3rem] p-12 luxury-border shadow-xl shadow-luxury-green/5 flex flex-col justify-between group hover:shadow-2xl transition-all duration-700"
            >
              <p className="text-3xl font-serif italic text-luxury-green leading-relaxed mb-12">"{greeting}"</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleCopy(greeting, idx)}
                  className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl border border-luxury-gold/20 text-luxury-green font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-luxury-gold hover:text-luxury-green transition-all duration-700"
                >
                  {copiedIndex === idx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedIndex === idx ? t.copied : t.copy}</span>
                </button>
                <button 
                  onClick={() => handleShare(greeting)}
                  className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl bg-luxury-green text-luxury-gold font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-luxury-green/90 transition-all duration-700 shadow-xl shadow-luxury-green/10"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.share}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 border-t border-luxury-gold/10 text-center bg-luxury-green text-luxury-gold relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(197,160,89,0.3),transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center justify-center gap-6 mb-12">
            <div className="w-20 h-20 bg-luxury-gold rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(197,160,89,0.3)]">
              <Moon className="w-10 h-10 text-luxury-green fill-luxury-green" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-5xl font-bold tracking-tight text-white">Ramadan Noor</span>
              <span className="text-[11px] uppercase tracking-[0.5em] text-luxury-gold font-bold mt-2">Spiritual Excellence</span>
            </div>
          </div>
          
          <div className="w-20 h-px bg-luxury-gold/30 mx-auto mb-12" />
          
          <p className="text-luxury-gold/40 text-[11px] uppercase tracking-[0.4em] font-bold">
            © 2026 {t.title} | {t.builtWith} <span className="text-white">Johir Rihan</span>
          </p>
        </div>
      </footer>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-red-100 rounded-3xl p-6 shadow-2xl shadow-red-900/10 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-red-900 font-medium leading-tight">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-300 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Tour */}
      <AnimatePresence>
        {showTour && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-luxury-green/40 backdrop-blur-sm z-[200]"
              onClick={handleTourFinish}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[90%] max-w-lg"
            >
              <div className="bg-white rounded-[3rem] p-12 luxury-border shadow-2xl shadow-luxury-green/20 relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-luxury-gold/5 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-luxury-green rounded-full flex items-center justify-center shadow-lg shadow-luxury-green/20">
                      <Sparkles className="w-6 h-6 text-luxury-gold" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.3em]">{t.title}</span>
                      <span className="text-luxury-green font-serif text-2xl font-bold">
                        {currentTourStep === 0 && t.tourWelcomeTitle}
                        {currentTourStep === 1 && t.tourPrayersTitle}
                        {currentTourStep === 2 && t.tourReflectionsTitle}
                        {currentTourStep === 3 && t.tourGreetingsTitle}
                      </span>
                    </div>
                  </div>

                  <p className="text-luxury-ink/60 text-lg leading-relaxed mb-12 font-light italic">
                    {currentTourStep === 0 && t.tourWelcomeDesc}
                    {currentTourStep === 1 && t.tourPrayersDesc}
                    {currentTourStep === 2 && t.tourReflectionsDesc}
                    {currentTourStep === 3 && t.tourGreetingsDesc}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((s) => (
                        <div 
                          key={s} 
                          className={`w-2 h-2 rounded-full transition-all duration-500 ${s === currentTourStep ? 'bg-luxury-gold w-6' : 'bg-luxury-gold/20'}`} 
                        />
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={handleTourFinish}
                        className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-luxury-ink/40 hover:text-luxury-gold transition-colors"
                      >
                        {t.skip}
                      </button>
                      {currentTourStep > 0 && (
                        <button 
                          onClick={handleTourBack}
                          className="px-6 py-3 rounded-xl border border-luxury-gold/20 text-luxury-green text-[11px] font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all"
                        >
                          {t.back}
                        </button>
                      )}
                      <button 
                        onClick={handleTourNext}
                        className="px-8 py-3 rounded-xl bg-luxury-green text-luxury-gold text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-luxury-green/20 hover:bg-luxury-green/90 transition-all"
                      >
                        {currentTourStep === 3 ? t.finish : t.next}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
