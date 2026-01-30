import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useAnimation, useInView } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Heart,
  Check, 
  Send,
  Loader2
} from 'lucide-react';

// --- CONFIGURATION START ---
// ԽՆԴՐՈՒՄ ԵՆՔ ԼՐԱՑՆԵԼ ԱՅՍ ՀԱՏՎԱԾԸ (Տես instructions.md)
const GOOGLE_FORM_CONFIG = {
  // Ձեր տրամադրած Form URL-ը (արդեն փոխված է formResponse-ի)
  FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSeaof8tAasaY9MacZQC0LT3cW_iSrsti7DIRfC_qqo5KG-eSg/formResponse", 
  
  // ԱՅՍՏԵՂ ՊԵՏՔ Է ԳՐԵՔ ՁԵՐ ID-ները (Entry IDs)
  ENTRY_IDS: {
    name: "entry.686102756",    // Full Name
    email: "entry.77866150",   // Email
    phone: "entry.1119664831",   // Phone Number
    guests: "entry.1683387477",  // Number of Guests
    message: "entry.325147504"  // Message
  }
};
// --- CONFIGURATION END ---

/**
 * CARD VARIANTS
 */
const fallingCardVariants = {
  hidden: {
    y: -80,
    opacity: 0,
    rotate: -4,
  },
  visible: (i) => ({
    y: 0, 
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 70, 
      damping: 18, 
      mass: 0.9,
      delay: 0.15 + (i * 0.12), 
    },
  }),
};

const lineVariants = {
  hidden: { width: 0, opacity: 0 },
  visible: { width: 0, opacity: 0 }, 
  hover: { 
    width: "60%", 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" } 
  }
};

const separatorVariants = {
  hidden: { width: "2.5rem", opacity: 0 },
  visible: { 
    width: "2.5rem", 
    opacity: 0.3,
    transition: { duration: 0.6 }
  },
  hover: { 
    width: "50%", 
    opacity: 0.8,
    transition: { duration: 0.4, ease: "easeOut" } 
  }
};

/**
 * TRANSLATIONS
 */
const TRANSLATIONS = {
  en: {
    names: "Sedrak & Heghine",
    date: "June 20, 2026",
    saveTheDate: "Save the Date",
    countdownTitle: "Counting down to forever",
    ceremony: "The Ceremony",
    reception: "The Grand Celebration",
    locationCeremony: "Hovhannavank Monastery, Ohanavan",
    locationReception: "Lazur Restaurant, Ujan",
    navigate: "Navigate",
    contact: "Contact Us",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    inviteTitle: "You’re Invited!",
    inviteText: "With great happiness, we invite you to be part of a very special day as we begin our journey together. Join us in celebrating love, joy, and moments we’ll treasure forever.",
    inviteFooter: "Having you with us would mean so much.",
    rsvp: "Confirm Attendance",
    rsvpSectionTitle: "R.S.V.P.",
    rsvpSubtitle: "We would be honored to have you with us. Please let us know if you can make it.",
    nameLabel: "Full Name",
    emailLabel: "Email",
    phoneLabel: "Phone Number",
    guestsLabel: "Number of Guests",
    messageLabel: "Message (Names, Questions)",
    guestOptionCustom: "Custom (Specify in message)",
    submitButton: "Send Response",
    submitting: "Sending...",
    errorTitle: "Something went wrong",
    errorMessage: "Please try again later or contact us directly.",
    thankYouMessage: "Thank you! We can't wait to celebrate with you.",
    footerNote: "We’re so excited to celebrate our special day together with you!",
    copyright: "© Copyright 2026 Sedrak & Heghine All Rights Reserved",
    footerEmail: "Email",
    dressCodeTitle: "Dress code",
    dressCodeSubtitle: "We invite guests to wear an elegant yet comfortable look. Soft, pastel tones and light colors are especially lovely for the occasion. Ladies may choose dresses or jumpsuits, and gentlemen can opt for dress shirts and slacks. Of course, everyone is welcome to wear whatever makes them feel most comfortable and confident.",
    dressCodeNote: "Select a color for inspiration",
    sedrak: "Sedrak",
    heghine: "Heghine",
    whenWhereTitle: "When & Where ?",
    whenWhereSubtitle: "Click on the cards to see the location map",
    navInvitation: "Invitation",
    navDressCode: "Dress Code",
    navLocation: "Location",
    navRsvp: "RSVP",
    dressColors: [
      { name: "Olive Green", description: "A muted, earthy green shade resembling natural olive leaves." },
      { name: "Blush Pink", description: "A pale, dusty pink hue with a soft, warm undertone." },
      { name: "Champagne", description: "A creamy, golden beige tone that shimmers in the light." },
      { name: "Sky Blue", description: "A light, airy blue color reminiscent of a clear summer sky." },
      { name: "Lavender", description: "A soft, pale purple shade with delicate floral hues." },
      { name: "Navy Blue", description: "A rich, deep blue color providing strong contrast and elegance." },
      { name: "Black", description: "A solid, deep black tone for a sharp, timeless silhouette." }
    ]
  },
  hy: {
    names: "Սեդրակ և Հեղինե",
    date: "Հունիս 20, 2026",
    saveTheDate: "Պահպանեք ամսաթիվը",
    countdownTitle: "Մինչև մեր միությունը մնացել է",
    ceremony: "Պսակադրություն",
    reception: "Հարսանեկան Խնջույք",
    locationCeremony: "Հովհաննավանք, Օհանավան",
    locationReception: "Լազուր Ռեստորան, Ուջան",
    navigate: "Ուղղություն",
    contact: "Կապ մեզ հետ",
    days: "Օր",
    hours: "Ժամ",
    minutes: "Րոպե",
    seconds: "Վայրկյան",
    inviteTitle: "Դուք Հրավիրված եք!",
    inviteText: "Ուրախությամբ հրավիրում ենք ձեզ մասնակցելու մեր համատեղ կյանքի սկիզբը նշող այս գեղեցիկ օրվան։ Եկեք միասին ստեղծենք ջերմ, ուրախ և հիշարժան պահեր։",
    inviteFooter: "Ձեր ներկայությունը մեզ համար շատ թանկ է:",
    rsvp: "Հաստատել Մասնակցությունը",
    rsvpSectionTitle: "R.S.V.P.",
    rsvpSubtitle: "Մեզ համար մեծ պատիվ կլինի տեսնել Ձեզ: Խնդրում ենք հաստատել Ձեր մասնակցությունը:",
    nameLabel: "Անուն Ազգանուն",
    emailLabel: "Էլ. հասցե",
    phoneLabel: "Հեռախոսահամար",
    guestsLabel: "Հյուրերի քանակը",
    messageLabel: "Հաղորդագրություն (Անուններ, Հարցեր)",
    guestOptionCustom: "Այլ (Նշել հաղորդագրությունում)",
    submitButton: "Ուղարկել",
    submitting: "Ուղարկվում է...",
    errorTitle: "Ինչ-որ բան սխալ գնաց",
    errorMessage: "Խնդրում ենք փորձել կրկին կամ կապ հաստատել մեզ հետ:",
    thankYouMessage: "Շնորհակալություն: Անհամբեր սպասում ենք Ձեզ:",
    footerNote: "Մենք անչափ ուրախ ենք տոնելու մեր հատուկ օրը Ձեզ հետ:",
    copyright: "© 2026 Սեդրակ և Հեղինե: Բոլոր իրավունքները պաշտպանված են:",
    footerEmail: "Էլ․ հասցե",
    dressCodeTitle: "Հագուստի ոճ",
    dressCodeSubtitle: "Սիրով հրավիրում ենք կրել նրբագեղ և հարմարավետ հագուստ: Նուրբ, պաստելային երանգներն ու բաց գույները հատկապես գեղեցիկ կնայվեն մեր տոնին: Կանայք կարող են նախապատվությունը տալ զգեստներին կամ կոմբինեզոններին, իսկ տղամարդիկ՝ վերնաշապիկներին և տաբատներին: Իհարկե, կարևորն այն է, որ Դուք Ձեզ զգաք հարմարավետ և ինքնավստահ:",
    dressCodeNote: "Ընտրեք գույնը՝ ոգեշնչման համար",
    sedrak: "Սեդրակ",
    heghine: "Հեղինե",
    whenWhereTitle: "Երբ և Որտեղ ?",
    whenWhereSubtitle: "Սեղմեք քարտերի վրա՝ քարտեզը տեսնելու համար",
    navInvitation: "Հրավեր",
    navDressCode: "Հագուստ",
    navLocation: "Վայր",
    navRsvp: "RSVP",
    dressColors: [
      { name: "Ձիթապտղի Կանաչ", description: "Խամրած, հողեղեն կանաչ երանգ՝ ձիթենու տերևների բնական գույնով:" },
      { name: "Նուրբ Վարդագույն", description: "Գունատ, փոշոտ վարդագույն՝ մեղմ, ջերմ նրբերանգով:" },
      { name: "Շամպայն", description: "Սերուցքային, ոսկեգույն բեժ երանգ, որը շողում է լույսի ներքո:" },
      { name: "Երկնագույն", description: "Թեթև, եթերային կապույտ գույն՝ ամառային պարզ երկնքի նման:" },
      { name: "Լավանդա", description: "Մեղմ, գունատ մանուշակագույն՝ նուրբ ծաղկային երանգներով:" },
      { name: "Մուգ Կապույտ", description: "Հարուստ, մուգ կապույտ գույն՝ խորը հակադրությամբ և նրբագեղությամբ:" },
      { name: "Սև", description: "Խորը, միատոն սև երանգ՝ ընդգծված, անժամանակ ուրվագծի համար:" }
    ]
  }
};

const IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1920"
];

const DRESS_COLORS = [
  { 
    hex: "#B2AC88", 
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  { 
    hex: "#EBC7C2", 
    images: [
      "https://images.unsplash.com/photo-1549062572-544a64fb0c56?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  { 
    hex: "#F7E7CE", 
    images: [
      "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  { 
    hex: "#AED9E0", 
    images: [
      "https://images.unsplash.com/photo-1518933165971-611dbc9c412d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  { 
    hex: "#E6E6FA", 
    images: [
      "https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  { 
    hex: "#1B2431", 
    images: [
      "https://images.unsplash.com/photo-1594819047050-99defca82545?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  { 
    hex: "#000000", 
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?auto=format&fit=crop&q=80&w=1000"
    ]
  }
];

const WEDDING_DATE = new Date("2026-06-20T16:00:00").getTime();

const TypingText = ({ text, className = "", delay = 0 }) => {
  if (!text || typeof text !== 'string') return null;
  const words = text.split(" ");
  let charIndexCounter = 0;
  const child = {
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
        delay: delay + i * 0.03, 
      },
    }),
    hidden: { opacity: 0, y: 5 },
  };

  return (
    <motion.p
      key={text} 
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {words.map((word, wIndex) => {
        const currentBaseIndex = charIndexCounter;
        charIndexCounter += word.length;
        return (
          <span key={wIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
            {Array.from(word).map((char, cIndex) => (
              <motion.span
                key={`${wIndex}-${cIndex}`}
                custom={currentBaseIndex + cIndex}
                variants={child}
                className={`inline-block ${className.includes('drop-shadow') ? 'drop-shadow-sm' : ''}`}
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </motion.p>
  );
};

const Section = React.forwardRef(({ children, className = "", id = "" , ...props }, ref) => (
  <section id={id} ref={ref} className={`py-24 px-6 md:px-12 ${className}`} {...props}>
    <div className="max-w-6xl mx-auto">
      {children}
    </div>
  </section>
));

const FlipCard = ({ title, time, locationName, mapSrc, navigateUrl, imageSrc, t }) => {
  const [rotation, setRotation] = useState(0);
  const handleCardClick = () => setRotation(prev => prev + 180);

  return (
    <motion.div className="relative h-[650px] w-full perspective-1000 cursor-pointer group" whileHover={{ y: -12 }} transition={{ duration: 0.6, ease: "easeOut" }} onClick={handleCardClick}>
      <motion.div className="relative w-full h-full preserve-3d" animate={{ rotateY: rotation }} transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}>
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[2.5rem] shadow-xl border border-[#B4A38D]/10 p-4 flex flex-col group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-[#F7E7CE]/30 transition-all duration-1000 ease-in-out">
          <div className="relative h-64 overflow-hidden rounded-[2rem] mb-8 shadow-inner">
             <img src={imageSrc} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"/>
             <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-1000" />
          </div>
          <div className="px-4 pb-6 space-y-4 text-center flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner text-[#B4A38D]"><Clock size={28} /></div>
            <h3 className="text-2xl font-light tracking-wide text-[#4A4A4A] drop-shadow-sm">{title}</h3>
            <p className="text-[#4A4A4A] font-semibold text-xl elegant-number uppercase drop-shadow-sm">{time}</p>
            <div className="flex items-center justify-center gap-2 text-[#4A4A4A]/60 italic font-light"><MapPin size={16} /><span>{locationName}</span></div>
            <div className="pt-4 mt-auto">
              <a 
                href={navigateUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()} 
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#B4A38D]/30 text-[#B4A38D] text-sm uppercase tracking-[0.2em] group-hover:bg-[#B4A38D] group-hover:text-white transition-colors duration-500 shadow-md hover:shadow-lg"
              >
                <Navigation size={14} className="drop-shadow-sm" />{t.navigate}
              </a>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[2.5rem] shadow-xl border border-[#B4A38D]/10 p-4 flex flex-col rotate-y-180 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-[#F7E7CE]/30 transition-all duration-1000 ease-in-out">
          <div className="relative h-64 overflow-hidden rounded-[2rem] mb-8 shadow-inner" onClick={(e) => e.stopPropagation()}>
             <iframe src={mapSrc} className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000" title={`${title} Map`} allowFullScreen="" loading="lazy" />
          </div>
          <div className="px-4 pb-6 space-y-4 text-center flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner text-[#B4A38D]"><MapPin size={28} /></div>
            <h3 className="text-2xl font-light tracking-wide text-[#4A4A4A] drop-shadow-sm">{title}</h3>
            <p className="text-[#4A4A4A] font-semibold text-xl elegant-number uppercase drop-shadow-sm">{time}</p>
            <div className="flex items-center justify-center gap-2 text-[#4A4A4A]/60 italic font-light"><span>{locationName}</span></div>
            <div className="pt-4 mt-auto">
              <motion.a href={navigateUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#B4A38D] text-white text-sm uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all">
                <Navigation size={14} className="drop-shadow-sm" />{t.navigate}
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const calculateTimeLeft = () => {
  const now = Date.now();
  const distance = WEDDING_DATE - now;
  if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
};

const App = () => {
  const [lang, setLang] = useState('hy');
  const [currentHeroImg, setCurrentHeroImg] = useState(0);
  const [activeDressIndex, setActiveDressIndex] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isInviteHovered, setIsInviteHovered] = useState(false);
  const [isDressCodeHovered, setIsDressCodeHovered] = useState(false);
  const [isWhenWhereHovered, setIsWhenWhereHovered] = useState(false);
  
  const [isRsvpHovered, setIsRsvpHovered] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', guests: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
   
  const nextSectionRef = useRef(null);
  const countdownRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, restDelta: 0.001 });
  const expandingLineWidth = useTransform(smoothProgress, [0, 1], ["4rem", "18rem"]);
   
  const controls = useAnimation();
  const isCountdownInView = useInView(countdownRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isCountdownInView) controls.start("visible");
  }, [isCountdownInView, controls]);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const timer = setInterval(() => setCurrentHeroImg((prev) => (prev + 1) % IMAGES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setCurrentCarouselIndex(0);
  }, [activeDressIndex]);

  useEffect(() => {
    const images = DRESS_COLORS[activeDressIndex].images;
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeDressIndex, currentCarouselIndex]);

  const yParallax = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'hy' : 'en');
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const nextSlide = () => {
    const images = DRESS_COLORS[activeDressIndex].images;
    setCurrentCarouselIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    const images = DRESS_COLORS[activeDressIndex].images;
    setCurrentCarouselIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // --- GOOGLE FORM SUBMISSION LOGIC ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    const formData = new FormData();
    // Map our state fields to Google Form Entry IDs
    formData.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.name, formState.name);
    formData.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.email, formState.email);
    formData.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.phone, formState.phone);
    formData.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.guests, formState.guests);
    formData.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.message, formState.message);

    try {
      // mode: 'no-cors' is critical for client-side Google Form submission
      await fetch(GOOGLE_FORM_CONFIG.FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      
      // Artificial delay to show spinner and ensure UX smoothness
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1000);

    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      setSubmitError(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Adjust for fixed header height
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#4A4A4A] overflow-x-hidden" style={{ fontFamily: "'Playfair Display', serif" }}>
      
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 transition-all duration-500 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm">
        <motion.button 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          onClick={scrollToTop}
          className="text-xl tracking-widest font-light drop-shadow-sm hover:text-[#B4A38D] transition-colors cursor-pointer"
        >
          {t.names}
        </motion.button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase font-light text-[#4A4A4A]/80 drop-shadow-sm">
          <button onClick={() => scrollToSection('invitation')} className="hover:text-[#B4A38D] transition-colors">{t.navInvitation}</button>
          <button onClick={() => scrollToSection('dresscode')} className="hover:text-[#B4A38D] transition-colors">{t.navDressCode}</button>
          <button onClick={() => scrollToSection('location')} className="hover:text-[#B4A38D] transition-colors">{t.navLocation}</button>
          <button onClick={() => scrollToSection('rsvp')} className="hover:text-[#B4A38D] transition-colors">{t.navRsvp}</button>
        </div>

        <div className="flex items-center gap-6">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleLang} className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#B4A38D] text-sm tracking-widest hover:bg-[#B4A38D] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
            <Globe size={14} />{lang === 'en' ? 'ՀԱՅ' : 'ENG'}
          </motion.button>
        </div>
      </nav>

      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={currentHeroImg} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 2, ease: "easeInOut" }} className="absolute inset-0 z-0">
            <motion.div className="w-full h-full bg-cover bg-center" style={{ y: yParallax, backgroundImage: `url(${IMAGES[currentHeroImg]})` }} />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>
        <motion.div style={{ opacity: opacityFade }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5 }} className="relative z-20 text-center text-white px-4 pointer-events-none">
          <p className="uppercase tracking-[0.4em] mb-6 text-sm font-light drop-shadow-md">{t.saveTheDate}</p>
          <h1 className="text-6xl md:text-8xl font-light mb-8 leading-normal italic gradient-text transition-all duration-700 drop-shadow-lg pb-2">{t.names}</h1>
          {/* Hero Line: Added gradient fading edges */}
          <motion.div style={{ width: expandingLineWidth }} className="h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-8 rounded-full shadow-md" />
          <p className="text-2xl md:text-3xl font-light tracking-widest uppercase elegant-number gradient-text transition-all duration-700 drop-shadow-md">20.06.2026</p>
          <motion.button 
            onClick={() => scrollToSection('rsvp')} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.8, duration: 1 }} 
            className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 p-4 cursor-pointer focus:outline-none group pointer-events-auto" 
            aria-label="Confirm Attendance"
          >
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="px-8 py-3 border border-white/60 rounded-full group-hover:bg-white/10 transition-colors text-white uppercase tracking-[0.2em] text-sm backdrop-blur-sm shadow-lg hover:shadow-xl drop-shadow-md">
                {t.rsvp}
            </motion.div>
          </motion.button>
        </motion.div>
      </header>

      {/* Invitation Section - Added ID for navigation */}
      <Section id="invitation" ref={nextSectionRef} className="bg-white group/invite" onMouseEnter={() => setIsInviteHovered(true)} onMouseLeave={() => setIsInviteHovered(false)}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="rounded-[2.5rem] overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
            <img src="https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=1000" alt="Hands together" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"/>
          </motion.div>
          <div className="text-left space-y-6">
            <Heart className="text-[#B4A38D] mb-4 drop-shadow-sm" fill="#B4A38D" size={24} />
            <TypingText text={t.inviteTitle} className="text-4xl md:text-5xl font-light italic leading-tight drop-shadow-md" delay={0.3} />
            <div className="relative">
              {/* Invitation Active Line: Added gradient fading edges */}
              <motion.div animate={{ width: isInviteHovered ? "85%" : "0%", opacity: isInviteHovered ? 1 : 0 }} transition={{ duration: 1.2, ease: "easeInOut" }} className="absolute inset-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#B4A38D] to-transparent rounded-full z-10 shadow-sm" />
              {/* Invitation Passive Line: Added gradient fading edges */}
              <motion.div style={{ width: expandingLineWidth }} className="h-[2px] bg-gradient-to-r from-transparent via-[#B4A38D]/20 to-transparent rounded-full" />
            </div>
            <TypingText text={t.inviteText} className="text-xl md:text-2xl font-light leading-relaxed text-[#4A4A4A]/80 drop-shadow-sm" delay={0.8} />
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2.2, duration: 1.2 }} className="text-lg italic font-light text-[#B4A38D] drop-shadow-sm">{t.inviteFooter}</motion.p>
            {/* REMOVED uppercase class from here */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2.8, duration: 1 }} className="pt-4"><p className="text-sm tracking-[0.3em] font-bold text-[#4A4A4A] drop-shadow-sm"> — {t.names}</p></motion.div>
          </div>
        </div>
      </Section>

      {/* Countdown Section */}
      <div className="relative pt-32 pb-24 overflow-hidden border-t border-b border-[#B4A38D]/5 bg-[#FAF9F6]">
        <div className="absolute inset-0 -z-10 animate-gradient-slow bg-gradient-to-br from-[#F5E6E8] via-[#FAF9F6] to-[#E3E7D3] opacity-60" />
        <Section className="text-center relative !py-0 overflow-visible" ref={countdownRef}>
          <div className="mb-12">
            <motion.h3 initial={{ opacity: 0 }} animate={isCountdownInView ? { opacity: 1 } : {}} className="tracking-[0.4em] text-sm text-[#B4A38D] font-semibold drop-shadow-md">{t.countdownTitle}</motion.h3>
            <motion.h2 initial={{ opacity: 0 }} animate={isCountdownInView ? { opacity: 0.6 } : {}} className="italic text-3xl mt-3 drop-shadow-md">{t.date}</motion.h2>
          </div>
          
          <div className="relative min-h-[300px] flex flex-col items-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl relative z-10">
              {[
                { label: t.days, value: timeLeft.days, id: "days" },
                { label: t.hours, value: timeLeft.hours, id: "hours" },
                { label: t.minutes, value: timeLeft.minutes, id: "minutes" },
                { label: t.seconds, value: timeLeft.seconds, id: "seconds" }
              ].map((item, idx) => (
                <motion.div 
                  key={item.id} 
                  custom={idx}
                  variants={fallingCardVariants}
                  initial="hidden"
                  animate={controls}
                  whileHover="hover"
                  className="relative z-10"
                >
                  <motion.div
                    variants={{
                      hover: { 
                        y: -14, 
                        transition: { duration: 0.25, ease: "easeOut" } 
                      }
                    }}
                    className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/60 relative group cursor-default overflow-hidden flex flex-col items-center"
                  >
                    <span className="text-4xl md:text-6xl elegant-number mb-2 leading-none text-[#B4A38D] block z-10 drop-shadow-sm">
                      {item.value}
                    </span>

                    {/* Animated Separator Line */}
                    <motion.div 
                      variants={separatorVariants}
                      className="h-[1px] bg-[#B4A38D] my-2 z-10 shadow-sm" 
                    />

                    <div className="uppercase tracking-[0.2em] text-xs text-[#B4A38D]/60 z-10 drop-shadow-sm">
                      {item.label}
                    </div>
                    
                    {/* Fixed Animated Underline: appears on hover */}
                    {/* Updated to have fading edges */}
                    <motion.div 
                      variants={lineVariants}
                      initial="hidden" 
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#B4A38D] to-transparent rounded-full z-20 shadow-sm" 
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Refined Horizon Line */}
            <div className="absolute -bottom-16 w-full flex justify-center items-center pointer-events-none">
              <motion.div 
                style={{ width: expandingLineWidth }}
                initial={{ opacity: 0 }} 
                animate={isCountdownInView ? { opacity: 1 } : {}} 
                transition={{ delay: 1.5, duration: 2.5 }} 
                className="h-[1.2px] bg-gradient-to-r from-transparent via-[#B4A38D]/40 to-transparent rounded-full shadow-sm" 
              />
            </div>
          </div>
        </Section>
      </div>

      {/* Dress Code Section - Added ID for navigation */}
      <Section id="dresscode" className="bg-[#FAF9F6] overflow-hidden !pt-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            className="space-y-8"
            onMouseEnter={() => setIsDressCodeHovered(true)}
            onMouseLeave={() => setIsDressCodeHovered(false)}
          >
            <div>
              {/* Removed Palette Icon Container */}
              <h2 className="text-5xl md:text-6xl font-light mb-6 italic leading-tight text-[#4A4A4A] drop-shadow-md">{t.dressCodeTitle}</h2>
              <div className="relative w-full max-w-sm mb-6">
                 {/* Dress Code Active Line: Added gradient fading edges */}
                 <motion.div 
                   animate={{ width: isDressCodeHovered ? "100%" : "0%", opacity: isDressCodeHovered ? 1 : 0 }} 
                   transition={{ duration: 1.2, ease: "easeInOut" }} 
                   className="absolute inset-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#B4A38D] to-transparent rounded-full z-10 shadow-sm" 
                 />
                 {/* Dress Code Passive Line: Added gradient fading edges */}
                 <motion.div style={{ width: expandingLineWidth }} className="h-[2px] bg-gradient-to-r from-transparent via-[#B4A38D]/20 to-transparent rounded-full" />
              </div>
              <p className="text-lg text-[#4A4A4A]/80 font-light leading-relaxed mb-6 drop-shadow-sm">{t.dressCodeSubtitle}</p>
              <p className="text-sm tracking-widest text-[#B4A38D] uppercase drop-shadow-sm">{t.dressCodeNote}</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              {DRESS_COLORS.map((color, index) => (
                <motion.button key={index} onClick={() => setActiveDressIndex(index)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`w-14 h-14 rounded-full border-2 transition-all duration-500 shadow-md relative ${activeDressIndex === index ? 'border-[#B4A38D] p-1 scale-110 shadow-lg' : 'border-white'}`} style={{ backgroundColor: color.hex }}>
                  {activeDressIndex === index && <motion.div layoutId="activeCircle" className="absolute inset-0 rounded-full border-2 border-white pointer-events-none" />}
                </motion.button>
              ))}
            </div>
            {/* Updated to use translations */}
            <motion.div 
              key={`${activeDressIndex}-${lang}`} /* Added lang to key to trigger animation on language change */
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-6 text-left"
            >
              <p className="text-2xl font-light italic text-[#4A4A4A] mb-2 drop-shadow-sm">{t.dressColors[activeDressIndex].name}</p>
              <p className="text-sm font-sans tracking-wide text-[#4A4A4A]/60 leading-relaxed drop-shadow-sm">{t.dressColors[activeDressIndex].description}</p>
            </motion.div>
          </motion.div>
          <div className="relative h-[600px] w-full bg-[#E5E5E5] rounded-[40px] overflow-hidden shadow-2xl group/carousel">
            <AnimatePresence initial={false} mode="wait">
              <motion.div 
                key={`${activeDressIndex}-${currentCarouselIndex}`} 
                initial={{ opacity: 0, scale: 1.05 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.05 }} 
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }} 
                className="absolute inset-0"
              >
                <img 
                  src={DRESS_COLORS[activeDressIndex].images[currentCarouselIndex]} 
                  alt="Dress Inspiration" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
            
            {/* Carousel Navigation */}
            {DRESS_COLORS[activeDressIndex].images.length > 1 && (
              <>
                <motion.button 
                  onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-colors z-20 opacity-0 group-hover/carousel:opacity-100 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button 
                  onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-colors z-20 opacity-0 group-hover/carousel:opacity-100 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={20} />
                </motion.button>
                
                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {DRESS_COLORS[activeDressIndex].images.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${idx === currentCarouselIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Section>

      {/* Location Section - Added ID for navigation */}
      <Section id="location" className="bg-[#FAF9F6] text-center !pt-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="mb-16"
          onMouseEnter={() => setIsWhenWhereHovered(true)}
          onMouseLeave={() => setIsWhenWhereHovered(false)}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-4 italic drop-shadow-md">{t.whenWhereTitle}</h2>
          
          <div className="relative h-[4px] flex justify-center items-center mb-4">
             {/* Hover Fill Line - Added gradient fading edges */}
             <motion.div 
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: isWhenWhereHovered ? "18rem" : "0%", opacity: isWhenWhereHovered ? 1 : 0 }} 
               transition={{ duration: 1.2, ease: "easeInOut" }} 
               className="absolute h-[2.5px] bg-gradient-to-r from-transparent via-[#B4A38D] to-transparent rounded-full z-10 shadow-sm" 
             />
             
             {/* Scroll Progress Line - Background - Added gradient fading edges */}
             <motion.div 
               style={{ width: expandingLineWidth }} 
               className="h-[2px] bg-gradient-to-r from-transparent via-[#B4A38D]/30 to-transparent rounded-full" 
             />
          </div>

          <p className="text-lg text-[#4A4A4A]/70 font-light drop-shadow-sm">{t.whenWhereSubtitle}</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <FlipCard title={t.ceremony} time="04:00 PM | 16:00" locationName={t.locationCeremony} mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3043.431206148383!2d44.3861218!3d40.339488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40156372d8e3b3ef%3A0xc3c9489608d0a0d4!2sOhanavank!5e0!3m2!1sen!2sam!4v1700000000000!5m2!1sen!2sam" navigateUrl="https://maps.app.goo.gl/TpTfwyUMEfWHEJij7" imageSrc="https://images.unsplash.com/photo-1549112215-6091216791-a5360b5fc78a?auto=format&fit=crop&q=80&w=1000" t={t} />
          <FlipCard title={t.reception} time="05:30 PM | 17:30" locationName={t.locationReception} mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3045.2426466986514!2d44.183422476595854!3d40.2981081627376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4015629c490a604f%3A0xc6c7669d251d1020!2sLazur%20Restaurant!5e0!3m2!1sen!2sam!4v1700000000001!5m2!1sen!2sam" navigateUrl="https://maps.app.goo.gl/aN7tHkeDMxsKdRGf6" imageSrc="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000" t={t} />
        </div>
      </Section>

      {/* RSVP Section - Added ID for navigation */}
      <Section id="rsvp" className="text-center pt-10 pb-32">
        <motion.div 
          initial={{ y: 0 }}
          whileHover={{ y: -12 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-[#B4A38D]/10 hover:bg-gradient-to-br hover:from-white hover:to-[#F7E7CE]/30 transition-all duration-700"
        >
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              className="mb-12"
              onMouseEnter={() => setIsRsvpHovered(true)}
              onMouseLeave={() => setIsRsvpHovered(false)}
            >
              <h2 className="text-4xl md:text-5xl font-light mb-4 italic text-[#4A4A4A] drop-shadow-md">{t.rsvpSectionTitle}</h2>
              
              <div className="relative h-[4px] flex justify-center items-center mb-6">
                 {/* Hover Fill Line */}
                 <motion.div 
                   initial={{ width: 0, opacity: 0 }}
                   animate={{ width: isRsvpHovered ? "12rem" : "0%", opacity: isRsvpHovered ? 1 : 0 }} 
                   transition={{ duration: 1.2, ease: "easeInOut" }} 
                   className="absolute h-[2.5px] bg-gradient-to-r from-transparent via-[#B4A38D] to-transparent rounded-full z-10 shadow-sm" 
                 />
                 
                 {/* Static Line */}
                 <motion.div 
                   style={{ width: expandingLineWidth }} 
                   className="h-[2px] bg-gradient-to-r from-transparent via-[#B4A38D]/30 to-transparent rounded-full" 
                 />
              </div>

              <p className="text-[#4A4A4A]/70 font-light drop-shadow-sm">{t.rsvpSubtitle}</p>
            </motion.div>

            <AnimatePresence mode="wait">
                {isSubmitted ? (
                    <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12 space-y-6"
                    >
                        <div className="w-20 h-20 bg-[#F1F8E9] rounded-full flex items-center justify-center text-[#8E9775] mb-4 shadow-inner">
                            <Check size={40} />
                        </div>
                        <h3 className="text-2xl font-light italic drop-shadow-sm">{t.thankYouMessage}</h3>
                    </motion.div>
                ) : (
                    <motion.form 
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleFormSubmit} 
                        className="space-y-6 text-left"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <input 
                                    type="text" 
                                    name="name"
                                    required 
                                    placeholder={t.nameLabel}
                                    value={formState.name}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full bg-[#FAF9F6] border border-[#B4A38D]/20 rounded-full px-6 py-4 focus:outline-none focus:border-[#B4A38D] transition-colors placeholder-[#B4A38D]/70 text-[#4A4A4A] shadow-inner focus:shadow-md disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <input 
                                    type="tel" 
                                    name="phone"
                                    required 
                                    placeholder={t.phoneLabel}
                                    value={formState.phone}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full bg-[#FAF9F6] border border-[#B4A38D]/20 rounded-full px-6 py-4 focus:outline-none focus:border-[#B4A38D] transition-colors placeholder-[#B4A38D]/70 text-[#4A4A4A] shadow-inner focus:shadow-md disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <input 
                                    type="email" 
                                    name="email"
                                    required 
                                    placeholder={t.emailLabel}
                                    value={formState.email}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full bg-[#FAF9F6] border border-[#B4A38D]/20 rounded-full px-6 py-4 focus:outline-none focus:border-[#B4A38D] transition-colors placeholder-[#B4A38D]/70 text-[#4A4A4A] shadow-inner focus:shadow-md disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <select 
                                        name="guests"
                                        required
                                        value={formState.guests}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className={`w-full bg-[#FAF9F6] border border-[#B4A38D]/20 rounded-full px-6 py-4 appearance-none focus:outline-none focus:border-[#B4A38D] transition-colors cursor-pointer text-[#4A4A4A] ${formState.guests === '' ? 'text-[#B4A38D]/70' : ''} shadow-inner focus:shadow-md disabled:opacity-50`}
                                    >
                                        <option value="" disabled>{t.guestsLabel}</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="custom">{t.guestOptionCustom}</option>
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#B4A38D] pointer-events-none drop-shadow-sm" size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <textarea 
                                name="message"
                                rows="4"
                                placeholder={t.messageLabel}
                                value={formState.message}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                className="w-full bg-[#FAF9F6] border border-[#B4A38D]/20 rounded-[2rem] px-6 py-4 focus:outline-none focus:border-[#B4A38D] transition-colors resize-none placeholder-[#B4A38D]/70 text-[#4A4A4A] shadow-inner focus:shadow-md disabled:opacity-50"
                            ></textarea>
                        </div>
                        
                        {submitError && (
                          <div className="text-red-500 text-sm text-center">
                            {t.errorMessage}
                          </div>
                        )}

                        <div className="pt-4 text-center">
                            <motion.button 
                                whileHover={{ scale: 1.02 }} 
                                whileTap={{ scale: 0.98 }} 
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#B4A38D] text-white px-12 py-4 rounded-full text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#A4937D] shadow-lg hover:shadow-2xl inline-flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span className="drop-shadow-sm">{isSubmitting ? t.submitting : t.submitButton}</span>
                                {isSubmitting ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Send size={16} className="drop-shadow-sm" />
                                )}
                            </motion.button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
      </Section>

      <footer className="bg-white py-16 border-t border-[#B4A38D]/10">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left mb-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h5 className="uppercase text-xs tracking-widest text-[#B4A38D] mb-2 drop-shadow-sm">{t.contact}</h5>
            <div className="space-y-4">
              <div className="flex flex-col gap-1"><span className="text-xs uppercase tracking-widest opacity-40 drop-shadow-sm">{t.sedrak}</span><a href="tel:+37455656534" className="flex items-center gap-3 text-lg hover:text-[#B4A38D] transition-colors font-light elegant-number drop-shadow-sm"><Phone size={18} /> +374 55 65 65 34</a></div>
              <div className="flex flex-col gap-1"><span className="text-xs uppercase tracking-widest opacity-40 drop-shadow-sm">{t.heghine}</span><a href="tel:+37443566156" className="flex items-center gap-3 text-lg hover:text-[#B4A38D] transition-colors font-light elegant-number drop-shadow-sm"><Phone size={18} /> +374 43 56 61 56</a></div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center"><span className="text-4xl italic font-light mb-2 drop-shadow-sm">S & H</span><span className="text-xs tracking-[0.3em] opacity-40 elegant-number drop-shadow-sm">20.06.2026</span></div>
          <div className="flex flex-col items-center md:items-end gap-4"><h5 className="uppercase text-xs tracking-widest text-[#B4A38D] mb-2 drop-shadow-sm">{t.footerEmail}</h5><a href="mailto:sedrak.heghine@gmail.com" className="flex items-center gap-3 text-lg hover:text-[#B4A38D] transition-colors font-light drop-shadow-sm"><Mail size={18} /> sedrak.heghine@gmail.com</a></div>
        </div>

        {/* Bottom Banner */}
        <div className="max-w-4xl mx-auto px-6 pt-8 border-t border-[#B4A38D]/10 text-center space-y-3">
            <p className="text-lg italic font-light text-[#B4A38D] drop-shadow-sm">{t.footerNote}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#4A4A4A]/30 drop-shadow-sm">{t.copyright}</p>
        </div>
      </footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} whileHover={{ scale: 1.1, backgroundColor: "#B4A38D", color: "#fff" }} whileTap={{ scale: 0.9 }} onClick={scrollToTop} className="fixed bottom-8 right-8 z-[60] bg-white/80 backdrop-blur-md text-[#B4A38D] border border-[#B4A38D]/20 p-4 rounded-full shadow-lg transition-colors"><ChevronUp size={24} /></motion.button>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gradient-slow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient-slow { background-size: 200% 200%; animation: gradient-slow 16s ease infinite; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@200;300;400;600&display=swap');
        /* body rule kept for completeness, but the inline style on the div ensures it applies */
        body { font-family: 'Playfair Display', serif; }
        .elegant-number { font-family: 'Playfair Display', serif; font-variant-numeric: tabular-nums; letter-spacing: 0.05em; }
        .gradient-text { background: linear-gradient(135deg, #B4A38D 0%, #D4C3AD 50%, #B4A38D 100%); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; }
        .gradient-text:hover { background: linear-gradient(135deg, #8E9775 0%, #A4AF88 50%, #8E9775 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default App;