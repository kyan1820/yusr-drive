console.log("Yusr Drive System v3 Initialized - Developer: Kayan Adel Abbas");

let currentLang = 'ar';
let ttsEnabled = true;
let visualFlashMode = false;
let fontScaleIndex = 0;
const fontScales = [1, 1.15, 1.3];

let selectedMode = 'mobility';
let selectedSpot = 'تسليم عبر نافذة السائق بحامل ممتد';
let selectedLane = 'مسار يُسر 1';
let currentCategory = 'all';
let currentView = 'customer';

// قناة المزامنة الفورية بين جوال العميل وشاشة الموظف
const SYNC_TOPIC = 'yusr_drive_kyan1820_live_v3';
let activeOrderId = null;
let lastEventStamp = 0;
const clientSessionId = 'sess_' + Math.random().toString(36).substring(2, 10);

const stepMessages = {
  ar: {
    1: 'المرحلة الأولى: تم استلام طلبك وتكييف المسار الذكي',
    2: 'المرحلة الثانية: جاري تجهيز طلبك بتغليف ميسّر سهل الفتح',
    3: 'المرحلة الثالثة: تم التعرف على وصول سيارتك في المسار الذكي',
    4: 'المرحلة الرابعة: الموظف في طريقه لباب سيارتك الآن لتسليم الطلب'
  },
  en: {
    1: 'Stage 1: Order received and smart lane adapted',
    2: 'Stage 2: Preparing your order with easy-open packaging',
    3: 'Stage 3: Your vehicle arrival has been detected in the smart lane',
    4: 'Stage 4: Staff member is on the way to your car door now'
  }
};

const translations = {
  ar: {
    dir: 'rtl',
    accBadgeTitle: 'شريط الوصول الشامل',
    changeLangBtn: 'تغيير اللغة (Language)',
    ttsActive: 'القارئ الصوتي: مفعّل',
    ttsMuted: 'القارئ الصوتي: متوقف',
    contrastBtn: 'تباين عالٍ',
    fontBtnLabel: 'حجم الخط:',
    flashBtnText: 'إشعارات ضوئية (للصم)',
    heroBadge: 'مبادرة المسار الذكي الميسّر لذوي الإعاقة',
    heroMainTitle: 'يُسْر درايف',
    heroSubTitle: 'اطلب من سيارتك باستقلالية تامة؛ بدون الحاجة للتحدث عبر المايكروفون التقليدي أو النزول من المركبة، مع تسليم مخصص لباب سيارتك.',
    tabCustomer: 'واجهة العميل (الطلب)',
    tabTracker: 'مسار الدرايف ثرو المباشر',
    tabStaff: 'شاشة الموظف (محاكاة)',
    step1Badge: 'الخطوة 1 من 3',
    step1Title: 'اختر نمط الخدمة وتكييف المسار',
    listenStep1Btn: 'استمع للشرح',
    modeMobilityTitle: 'إعاقة حركية',
    modeMobilityDesc: 'توصيل الطلب حتى نافذة السائق أو المقعد الخلفي دون الحاجة لمد اليد أو النزول.',
    modeHearingTitle: 'صم وضعاف سمع / نطق',
    modeHearingDesc: 'إلغاء التخاطب الصوتي تماماً، واستبداله بشاشة تفاعلية وتنبيهات ضوئية.',
    modeVisualTitle: 'مكفوفون وضعاف بصر',
    modeVisualDesc: 'قراءة صوتية تلقائية للأصناف والأسعار، وأزرار ضخمة عالية التباين.',
    modeCognitiveTitle: 'واجهة مبسطة وهادئة',
    modeCognitiveDesc: 'مناسبة لطيف التوحد وكبار السن؛ خطوات واضحة بدون ضوضاء أو استعجال.',
    step2Badge: 'الخطوة 2 من 3',
    step2Title: 'قائمة الطلبات الميسّرة',
    catAll: 'الكل',
    catMeals: 'الوجبات الساخنة',
    catDrinks: 'المشروبات والقهوة',
    catPharmacy: 'ركن الصيدلية السريع',
    easyPackTitle: 'تخصيص التغليف الميسّر (Easy-Open Packaging)',
    easyPackDesc: 'فتح العبوات مسبقاً أو وضعها في حامل مانع للانسكاب يسهل تناوله بيد واحدة',
    easyPackLabel: 'تفعيل التغليف الميسّر مجاناً',
    step3Badge: 'الخطوة 3 من 3',
    step3Title: 'بيانات المركبة وطريقة التسليم',
    carDetailsLabel: 'نوع ولون السيارة / رقم اللوحة',
    spotLabel: 'مكان تسليم الطلب في السيارة:',
    spotWindowText: 'تسليم عبر نافذة السائق بحامل ممتد',
    spotPassengerText: 'وضع الطلب على المقعد المجاور للسائق',
    spotTrunkText: 'وضع الطلب في الشنطة الخلفية للسيارة',
    laneLabel: 'رقم موقف أو مسار الانتظار الذكي:',
    cartHeaderTitle: 'سلة طلبك الحالية',
    clearCartBtn: 'إفراغ السلة',
    totalLabel: 'الإجمالي شامل الضريبة:',
    currency: 'ر.س',
    submitOrderBtnText: 'تأكيد الطلب وإشعار المسار الذكي',
    addBtn: '+ أضف للسلة',
    voiceBtn: 'صوت',
    welcomeSpeech: 'أهلاً بك في منصة يسر درايف. اختر أصنافك من القائمة لإرسال طلبك للمسار الذكي.'
  },
  en: {
    dir: 'ltr',
    accBadgeTitle: 'Universal Access Bar',
    changeLangBtn: 'Change Language (اللغة)',
    ttsActive: 'Voice Reader: ON',
    ttsMuted: 'Voice Reader: OFF',
    contrastBtn: 'High Contrast',
    fontBtnLabel: 'Font Size:',
    flashBtnText: 'Visual Flash (Deaf)',
    heroBadge: 'Smart Accessible Drive-Thru Initiative',
    heroMainTitle: 'Yusr Drive',
    heroSubTitle: 'Order independently from your vehicle without traditional speaker boxes or stepping out, with tailored delivery right to your car door.',
    tabCustomer: 'Customer Order View',
    tabTracker: 'Live Drive-Thru Tracker',
    tabStaff: 'Staff Screen (Simulation)',
    step1Badge: 'Step 1 of 3',
    step1Title: 'Select Accessibility & Service Mode',
    listenStep1Btn: 'Listen to Guide',
    modeMobilityTitle: 'Mobility Impairment',
    modeMobilityDesc: 'Extended tray delivery right to the driver window or back seat without reaching out.',
    modeHearingTitle: 'Deaf / Hard of Hearing',
    modeHearingDesc: '100% visual communication and screen alerts with zero microphone usage.',
    modeVisualTitle: 'Blind / Low Vision',
    modeVisualDesc: 'Automated voice reading for items and prices with large high-contrast buttons.',
    modeCognitiveTitle: 'Calm & Simple Mode',
    modeCognitiveDesc: 'Designed for autism spectrum & seniors; clear steps with no rush or noise.',
    step2Badge: 'Step 2 of 3',
    step2Title: 'Accessible Menu Items',
    catAll: 'All',
    catMeals: 'Hot Meals',
    catDrinks: 'Drinks & Coffee',
    catPharmacy: 'Quick Pharmacy',
    easyPackTitle: 'Easy-Open Packaging Customization',
    easyPackDesc: 'Pre-opened seals and spill-proof holders designed for single-handed use',
    easyPackLabel: 'Enable Free Easy-Open Packaging',
    step3Badge: 'Step 3 of 3',
    step3Title: 'Vehicle Info & Delivery Spot',
    carDetailsLabel: 'Car Model, Color & Plate Number',
    spotLabel: 'Where to place your order in the car:',
    spotWindowText: 'Driver window via extended tray',
    spotPassengerText: 'Place on front passenger seat',
    spotTrunkText: 'Place inside the rear trunk',
    laneLabel: 'Smart Waiting Lane / Spot:',
    cartHeaderTitle: 'Your Current Cart',
    clearCartBtn: 'Clear Cart',
    totalLabel: 'Total (VAT Included):',
    currency: 'SAR',
    submitOrderBtnText: 'Confirm Order & Notify Smart Lane',
    addBtn: '+ Add to Cart',
    voiceBtn: 'Audio',
    welcomeSpeech: 'Welcome to Yusr Drive. Please select your items to notify the smart lane.'
  }
};

const yusrMenu = [
  {
    id: 1,
    name: 'وجبة برجر دجاج مشوي ميسّرة',
    nameEn: 'Accessible Grilled Chicken Burger Meal',
    category: 'meals',
    price: 24,
    desc: 'مقطعة إلى نصفين ومغلفة بغلاف يفتح بيد واحدة مع حامل بطاطس للسيارة',
    descEn: 'Cut in half with single-hand easy-open wrap and car fry holder',
    badge: 'سهلة التناول بالسيارة',
    badgeEn: 'Car Friendly'
  },
  {
    id: 2,
    name: 'راب تورتيلا لحم مشوي',
    nameEn: 'Grilled Beef Tortilla Wrap',
    category: 'meals',
    price: 21,
    desc: 'ملفوف بإحكام لمنع التساقط أثناء القيادة أو الجلوس على الكرسي المتحرك',
    descEn: 'Tightly wrapped to prevent spills while driving or seated',
    badge: 'مانع للانسكاب',
    badgeEn: 'Spill-Proof'
  },
  {
    id: 3,
    name: 'قهوة مختصة باردة (كوب بغطاء أمان)',
    nameEn: 'Specialty Iced Coffee (Safety Lid)',
    category: 'drinks',
    price: 16,
    desc: 'كوب مزود بغطاء مانع للانسكاب مع مصاصة ثابتة مرنة',
    descEn: 'Equipped with anti-spill lid and fixed flexible straw',
    badge: 'كوب أمان',
    badgeEn: 'Safety Cup'
  },
  {
    id: 4,
    name: 'عصير برتقال طازج',
    nameEn: 'Fresh Orange Juice',
    category: 'drinks',
    price: 14,
    desc: 'عبوة سهلة الإمساك بيد واحدة مع غطاء ذكي',
    descEn: 'Easy one-hand grip bottle with smart cap',
    badge: 'طبيعي 100%',
    badgeEn: '100% Fresh'
  },
  {
    id: 5,
    name: 'حقيبة إسعافات أولية ومسكنات سريعة',
    nameEn: 'First Aid & Quick Pain Relief Kit',
    category: 'pharmacy',
    price: 35,
    desc: 'تحتوي على مسكن ألم، ضمادات طبية، ومعقم بعبوات سهلة الفتح',
    descEn: 'Includes pain relievers, bandages, and sanitizer in easy-open packs',
    badge: 'ركن الصيدلية',
    badgeEn: 'Pharmacy'
  },
  {
    id: 6,
    name: 'بوكس فطور صباحي متكامل',
    nameEn: 'Complete Morning Breakfast Box',
    category: 'meals',
    price: 28,
    desc: 'فطائر لينة + قهوة ساخنة في صينية تثبت على مقود أو باب السيارة',
    descEn: 'Soft pastries + hot coffee in a steering-wheel/door mountable tray',
    badge: 'الأكثر طلباً',
    badgeEn: 'Best Seller'
  }
];

let cart = [];

function getModeDetails(mode) {
  if (mode === 'mobility') {
    return {
      badge: 'إعاقة حركية',
      instructions: '• العميل يستخدم مسار الإعاقة الحركية: استخدم صينية التسليم الممتدة حتى نافذة السائق أو ضع الطلب في المكان المحدد دون إجهاد العميل.'
    };
  } else if (mode === 'hearing') {
    return {
      badge: 'صم وضعاف سمع / نطق',
      instructions: '• تنبيه هام: العميل أصم أو يفضل عدم التخاطب الصوتي. لا تستخدم المايكروفون إطلاقاً، تواصل عبر الشاشة والابتسامة ولغة الإشارة.'
    };
  } else if (mode === 'visual') {
    return {
      badge: 'مكفوفون وضعاف بصر',
      instructions: '• العميل/المرافق يستخدم التوجيه الصوتي: عند الوصول للنافذة عرّف بنفسك صوتياً بوضوح واشرح مكان وضع المشروبات والوجبات.'
    };
  } else {
    return {
      badge: 'واجهة مبسطة وهادئة',
      instructions: '• العميل يفضل بيئة هادئة بدون استعجال: امنحه الوقت الكافي وتجنب الأصوات العالية أو الإرباك عند نافذة التسليم.'
    };
  }
}

function resetStaffScreenToEmpty() {
  document.getElementById('staffOrderCode').textContent = 'لا يوجد طلب نشط';
  document.getElementById('staffModeBadge').textContent = 'بانتظار عميل...';
  document.getElementById('staffCarInfo').textContent = '—';
  document.getElementById('staffLaneInfo').textContent = '—';
  document.getElementById('staffSpotInfo').textContent = '—';
  document.getElementById('staffInstructionsBox').textContent = '• شاشة الاستقبال جاهزة؛ ستظهر هنا تفاصيل مركبة العميل والأصناف المطلوبة فور إرسال الطلب.';
  document.getElementById('staffItemsList').innerHTML = `<li class="text-slate-400">لا توجد طلبات مرسلة حتى الآن</li>`;
  document.getElementById('staffSignalsLog').innerHTML = `
    <div class="bg-slate-900 p-3 rounded-xl border border-slate-700 text-xs text-slate-300">
      بانتظار إشارات من شاشة سيارة العميل...
    </div>
  `;
}

function renderOrderOnStaffScreen(orderData) {
  if (!orderData) {
    resetStaffScreenToEmpty();
    return;
  }
  const modeInfo = getModeDetails(orderData.mode);
  document.getElementById('staffOrderCode').textContent = orderData.code;
  document.getElementById('staffModeBadge').textContent = modeInfo.badge;
  document.getElementById('staffCarInfo').textContent = orderData.car;
  document.getElementById('staffLaneInfo').textContent = orderData.lane;
  document.getElementById('staffSpotInfo').textContent = orderData.spot;
  document.getElementById('staffInstructionsBox').textContent = modeInfo.instructions;

  const staffList = document.getElementById('staffItemsList');
  staffList.innerHTML = orderData.items.map(item => `
    <li class="flex items-center justify-between border-b border-slate-800 pb-2">
      <span>${item.qty}x ${item.name}</span>
      <span class="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">${item.note}</span>
    </li>
  `).join('');

  document.getElementById('orderNumberDisplay').textContent = orderData.code;
  document.getElementById('trackerLaneName').textContent = orderData.lane;
}

async function publishSyncEvent(payload) {
  payload.senderId = clientSessionId;
  payload.stamp = Date.now();
  localStorage.setItem('yusr_latest_event_v3', JSON.stringify(payload));
  try {
    await fetch(`https://ntfy.sh/${SYNC_TOPIC}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn('Local sync fallback');
  }
}

function startLiveCloudSync() {
  try {
    const eventSource = new EventSource(`https://ntfy.sh/${SYNC_TOPIC}/sse`);
    eventSource.onmessage = (event) => {
      try {
        const wrapper = JSON.parse(event.data);
        if (!wrapper.message) return;
        const data = JSON.parse(wrapper.message);
        handleIncomingSyncData(data);
      } catch (err) {}
    };
  } catch (e) {}

  window.addEventListener('storage', (e) => {
    if (e.key === 'yusr_latest_event_v3' && e.newValue) {
      try {
        handleIncomingSyncData(JSON.parse(e.newValue));
      } catch (err) {}
    }
  });
}

function handleIncomingSyncData(data) {
  if (!data || !data.type) return;
  if (data.stamp && data.stamp === lastEventStamp) return;
  lastEventStamp = data.stamp || Date.now();

  if (data.type === 'NEW_ORDER') {
    activeOrderId = data.order.code;
    renderOrderOnStaffScreen(data.order);
    updateStepUIOnly(1);
    if (currentView === 'staff') {
      triggerVisualBanner('وصل طلب جديد للمسار الذكي: ' + data.order.code);
    }
  } else if (data.type === 'SIGNAL') {
    appendSignalToStaffLog(data.signalText, data.time, 'customer');
    if (currentView === 'staff') {
      triggerVisualBanner('إشارة من السائق: ' + data.signalText);
    }
  } else if (data.type === 'STAFF_REPLY') {
    appendSignalToStaffLog(data.replyText, data.time, 'staff');
    appendReplyToCustomerScreen(data.replyText, data.time);
    // ينطق الرد عند العميل فقط
    if (currentView !== 'staff') {
      triggerVisualBanner('رد الموظف: ' + data.replyText);
      speakText('رد من موظف المسار: ' + data.replyText);
    }
  } else if (data.type === 'STAFF_ALERT') {
    if (currentView !== 'staff') {
      triggerVisualBanner(data.msg);
      speakText(data.msg);
    }
  } else if (data.type === 'STEP_UPDATE') {
    updateStepUIOnly(data.stepNum);
    // ينطق تحديث المرحلة عند الزائر/العميل فقط
    if (currentView !== 'staff') {
      const msg = (stepMessages[currentLang] && stepMessages[currentLang][data.stepNum]) || stepMessages.ar[data.stepNum];
      triggerVisualBanner(msg);
      speakText(msg);
    }
  } else if (data.type === 'COMPLETE_ORDER') {
    activeOrderId = null;
    resetStaffScreenToEmpty();
    updateStepUIOnly(1);
    document.getElementById('orderNumberDisplay').textContent = '—';
    document.getElementById('customerChatBox').classList.add('hidden');
    document.getElementById('customerRepliesList').innerHTML = '';
    if (currentView !== 'staff') {
      const doneMsg = currentLang === 'en'
        ? 'Your order has been delivered and completed. Thank you for using Yusr Drive!'
        : 'تم تسليم وإكمال طلبك بنجاح! شكراً لاستخدامك مسار يسر الذكي.';
      triggerVisualBanner(doneMsg);
      speakText(doneMsg);
      switchMainView('customer');
    }
  }
}

function startAppWithLanguage(langSelection) {
  const modal = document.getElementById('welcomeModal');
  modal.classList.add('hidden');

  if (langSelection === 'sign') {
    currentLang = 'ar';
    applyLanguage('ar');
    selectDisabilityMode('hearing');
    triggerVisualBanner('أهلاً بك! تم تفعيل نمط التواصل البصري ولغة الإشارة بدون صوت');
    return;
  }

  currentLang = langSelection;
  applyLanguage(langSelection);
  const t = translations[currentLang];
  speakText(t.welcomeSpeech);
}

function openLanguageModal() {
  document.getElementById('welcomeModal').classList.remove('hidden');
}

function applyLanguage(lang) {
  const t = translations[lang];
  const root = document.getElementById('htmlRoot');
  root.lang = lang;
  root.dir = t.dir;

  document.getElementById('accBadgeTitle').textContent = t.accBadgeTitle;
  document.getElementById('changeLangBtn').textContent = t.changeLangBtn;
  document.getElementById('ttsBtnText').textContent = ttsEnabled ? t.ttsActive : t.ttsMuted;
  document.getElementById('contrastBtn').textContent = t.contrastBtn;
  document.getElementById('fontBtnLabel').textContent = t.fontBtnLabel;
  document.getElementById('flashBtnText').textContent = t.flashBtnText;
  document.getElementById('heroBadge').textContent = t.heroBadge;
  document.getElementById('heroMainTitle').textContent = t.heroMainTitle;
  document.getElementById('heroSubTitle').textContent = t.heroSubTitle;
  document.getElementById('tabCustomer').textContent = t.tabCustomer;
  document.getElementById('tabTracker').textContent = t.tabTracker;
  document.getElementById('tabStaff').textContent = t.tabStaff;
  document.getElementById('step1Badge').textContent = t.step1Badge;
  document.getElementById('step1Title').textContent = t.step1Title;
  document.getElementById('listenStep1Btn').textContent = t.listenStep1Btn;
  document.getElementById('modeMobilityTitle').textContent = t.modeMobilityTitle;
  document.getElementById('modeMobilityDesc').textContent = t.modeMobilityDesc;
  document.getElementById('modeHearingTitle').textContent = t.modeHearingTitle;
  document.getElementById('modeHearingDesc').textContent = t.modeHearingDesc;
  document.getElementById('modeVisualTitle').textContent = t.modeVisualTitle;
  document.getElementById('modeVisualDesc').textContent = t.modeVisualDesc;
  document.getElementById('modeCognitiveTitle').textContent = t.modeCognitiveTitle;
  document.getElementById('modeCognitiveDesc').textContent = t.modeCognitiveDesc;
  document.getElementById('step2Badge').textContent = t.step2Badge;
  document.getElementById('step2Title').textContent = t.step2Title;
  document.getElementById('cat-all').textContent = t.catAll;
  document.getElementById('cat-meals').textContent = t.catMeals;
  document.getElementById('cat-drinks').textContent = t.catDrinks;
  document.getElementById('cat-pharmacy').textContent = t.catPharmacy;
  document.getElementById('easyPackTitle').textContent = t.easyPackTitle;
  document.getElementById('easyPackDesc').textContent = t.easyPackDesc;
  document.getElementById('easyPackLabel').textContent = t.easyPackLabel;
  document.getElementById('step3Badge').textContent = t.step3Badge;
  document.getElementById('step3Title').textContent = t.step3Title;
  document.getElementById('carDetailsLabel').textContent = t.carDetailsLabel;
  document.getElementById('spotLabel').textContent = t.spotLabel;
  document.getElementById('spotWindowText').textContent = t.spotWindowText;
  document.getElementById('spotPassengerText').textContent = t.spotPassengerText;
  document.getElementById('spotTrunkText').textContent = t.spotTrunkText;
  document.getElementById('laneLabel').textContent = t.laneLabel;
  document.getElementById('cartHeaderTitle').textContent = t.cartHeaderTitle;
  document.getElementById('clearCartBtn').textContent = t.clearCartBtn;
  document.getElementById('totalLabel').textContent = t.totalLabel;
  document.getElementById('currencyLabel').textContent = t.currency;
  document.getElementById('submitOrderBtnText').textContent = t.submitOrderBtnText;

  renderMenu();
  renderCart();
}

// دالة النطق الذكي: صامتة تماماً إذا كانت شاشة الموظف مفتوحة
function speakText(text) {
  if (currentView === 'staff') return;
  if (!ttsEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLang === 'en' ? 'en-US' : 'ar-SA';
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

function speakStep1() {
  if (currentLang === 'en') {
    speakText('Step 1: Select your accessibility mode so we can adapt the drive-thru lane for you.');
  } else {
    speakText('الخطوة الأولى: اختر نمط الخدمة وتكييف المسار حسب احتياجك');
  }
}

function triggerVisualBanner(message) {
  const banner = document.getElementById('visualAlertBanner');
  const textEl = document.getElementById('visualAlertText');
  textEl.textContent = message;
  banner.classList.remove('hidden');
  document.body.classList.add('visual-alert-active');
  setTimeout(() => {
    banner.classList.add('hidden');
    document.body.classList.remove('visual-alert-active');
  }, 4000);
}

function toggleTTS() {
  ttsEnabled = !ttsEnabled;
  const t = translations[currentLang];
  const btn = document.getElementById('ttsToggleBtn');
  if (ttsEnabled) {
    btn.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><span id="ttsBtnText">${t.ttsActive}</span>`;
    speakText(currentLang === 'en' ? 'Voice reader enabled' : 'تم تفعيل القارئ الصوتي');
  } else {
    window.speechSynthesis.cancel();
    btn.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span id="ttsBtnText">${t.ttsMuted}</span>`;
  }
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
  speakText(currentLang === 'en' ? 'High contrast mode toggled' : 'تم تبديل وضع التباين العالي');
}

function cycleFontSize() {
  fontScaleIndex = (fontScaleIndex + 1) % fontScales.length;
  const scale = fontScales[fontScaleIndex];
  document.documentElement.style.setProperty('--font-scale', scale);
  document.getElementById('fontScaleLabel').textContent = Math.round(scale * 100) + '%';
}

function toggleVisualFlashMode() {
  visualFlashMode = !visualFlashMode;
  const btn = document.getElementById('visualFlashToggleBtn');
  if (visualFlashMode) {
    btn.classList.add('bg-amber-400', 'text-slate-950');
    btn.classList.remove('bg-slate-800');
    triggerVisualBanner(currentLang === 'en' ? 'Visual Flash Alerts Enabled' : 'تم تفعيل الإشعارات الضوئية البصرية للصم وضعاف السمع');
  } else {
    btn.classList.remove('bg-amber-400', 'text-slate-950');
    btn.classList.add('bg-slate-800');
  }
}

function selectDisabilityMode(mode) {
  selectedMode = mode;
  const modes = ['mobility', 'hearing', 'visual', 'cognitive'];
  modes.forEach(m => {
    const card = document.getElementById('mode-' + m);
    if (m === mode) {
      card.className = 'mode-card focus-ring text-right p-5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/80 transition flex flex-col justify-between gap-3 shadow-sm';
    } else {
      card.className = 'mode-card focus-ring text-right p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition flex flex-col justify-between gap-3';
    }
  });

  if (mode === 'mobility') {
    speakText(currentLang === 'en' ? 'Mobility mode selected' : 'تم اختيار نمط الإعاقة الحركية');
  } else if (mode === 'hearing') {
    if (!visualFlashMode) toggleVisualFlashMode();
  } else if (mode === 'visual') {
    if (!ttsEnabled) toggleTTS();
    speakText(currentLang === 'en' ? 'Blind and low vision audio mode active' : 'تم اختيار نمط المكفوفين وضعاف البصر');
  } else if (mode === 'cognitive') {
    speakText(currentLang === 'en' ? 'Calm and simple mode enabled' : 'تم تفعيل الواجهة المبسطة والهادئة');
  }
}

function filterCategory(cat) {
  currentCategory = cat;
  ['all', 'meals', 'drinks', 'pharmacy'].forEach(c => {
    const btn = document.getElementById('cat-' + c);
    if (c === cat) {
      btn.className = 'cat-btn focus-ring px-4 py-2 rounded-xl font-bold text-sm bg-slate-900 text-white';
    } else {
      btn.className = 'cat-btn focus-ring px-4 py-2 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
  });
  renderMenu();
}

function renderMenu() {
  const grid = document.getElementById('menuGrid');
  const t = translations[currentLang];
  const filtered = currentCategory === 'all' ? yusrMenu : yusrMenu.filter(i => i.category === currentCategory);

  grid.innerHTML = filtered.map(item => {
    const title = currentLang === 'en' ? item.nameEn : item.name;
    const desc = currentLang === 'en' ? item.descEn : item.desc;
    const badge = currentLang === 'en' ? item.badgeEn : item.badge;
    return `
      <div class="p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition flex flex-col justify-between gap-3 bg-slate-50/50">
        <div>
          <div class="flex items-start justify-between gap-2">
            <span class="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">${badge}</span>
          </div>
          <h3 class="font-black text-lg mt-2">${title}</h3>
          <p class="text-xs text-slate-600 mt-1 leading-relaxed">${desc}</p>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-slate-200">
          <span class="text-lg font-black text-emerald-700">${item.price} ${t.currency}</span>
          <div class="flex items-center gap-1.5">
            <button onclick="speakText('${title}, ${item.price} ${t.currency}. ${desc}')" class="focus-ring px-2.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold">
              ${t.voiceBtn}
            </button>
            <button onclick="addToCart(${item.id})" class="focus-ring px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition">
              ${t.addBtn}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function addToCart(id) {
  const item = yusrMenu.find(i => i.id === id);
  const easyPack = document.getElementById('easyPackToggle').checked;
  const existing = cart.find(c => c.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      nameEn: item.nameEn,
      price: item.price,
      qty: 1,
      note: easyPack ? 'تغليف ميسّر سهل الفتح' : 'تغليف عادي'
    });
  }
  renderCart();
  const title = currentLang === 'en' ? item.nameEn : item.name;
  speakText(currentLang === 'en' ? 'Added ' + title : 'تمت إضافة ' + title + ' إلى السلة');
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
  speakText(currentLang === 'en' ? 'Cart cleared' : 'تم إفراغ السلة');
}

function updatePreferences() {
  const easyPack = document.getElementById('easyPackToggle').checked;
  cart.forEach(c => {
    c.note = easyPack ? 'تغليف ميسّر سهل الفتح' : 'تغليف عادي';
  });
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cartList');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    list.innerHTML = `<p class="text-xs text-slate-400 py-4 text-center">${currentLang === 'en' ? 'Your cart is empty — select items from the menu' : 'السلة فارغة حالياً، اختر أصنافك من القائمة'}</p>`;
    totalEl.textContent = '0';
    return;
  }

  let total = 0;
  list.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    const title = currentLang === 'en' ? (item.nameEn || item.name) : item.name;
    return `
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
        <div>
          <p class="font-bold text-sm">${title}</p>
          <span class="text-[11px] text-emerald-700 font-bold">${item.note}</span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 rounded-lg bg-slate-200 font-black">-</button>
          <span class="font-black text-sm">${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black">+</button>
        </div>
      </div>
    `;
  }).join('');

  totalEl.textContent = total;
}

function selectDeliverySpot(spotKey, btnEl) {
  const map = {
    window: 'تسليم عبر نافذة السائق بحامل ممتد',
    passenger: 'وضع الطلب على المقعد المجاور للسائق',
    trunk: 'وضع الطلب في الشنطة الخلفية للسيارة'
  };
  selectedSpot = map[spotKey];

  document.querySelectorAll('.spot-btn').forEach(btn => {
    btn.className = 'spot-btn focus-ring text-right px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 font-bold text-sm flex items-center justify-between';
    btn.querySelector('span:last-child').textContent = '○';
  });

  btnEl.className = 'spot-btn focus-ring text-right px-4 py-3 rounded-xl border-2 border-emerald-600 bg-emerald-50 font-bold text-sm flex items-center justify-between';
  btnEl.querySelector('span:last-child').textContent = '✓';
}

function selectLane(laneName) {
  selectedLane = laneName;
  document.getElementById('trackerLaneName').textContent = laneName;

  ['lane-1', 'lane-2', 'lane-3'].forEach(id => {
    const el = document.getElementById(id);
    if (el.textContent === laneName) {
      el.className = 'lane-btn focus-ring py-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 font-black text-sm';
    } else {
      el.className = 'lane-btn focus-ring py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm';
    }
  });
}

function submitAccessibleOrder() {
  if (cart.length === 0) {
    const alertMsg = currentLang === 'en' ? 'Please add at least one item to your cart first' : 'يرجى إضافة صنف واحد على الأقل إلى السلة قبل تأكيد الطلب';
    speakText(alertMsg);
    triggerVisualBanner(alertMsg);
    return;
  }

  const carInput = document.getElementById('carDetails').value.trim() || 'سيارة العميل (بدون لوحة مدخلة)';
  const randomNum = Math.floor(100 + Math.random() * 900);
  const orderCode = '#YSR-' + randomNum;

  const orderData = {
    code: orderCode,
    mode: selectedMode,
    car: carInput,
    lane: selectedLane,
    spot: selectedSpot,
    items: cart.map(i => ({ qty: i.qty, name: i.name, note: i.note })),
    timestamp: Date.now()
  };

  activeOrderId = orderCode;
  renderOrderOnStaffScreen(orderData);
  publishSyncEvent({ type: 'NEW_ORDER', order: orderData });

  speakText(currentLang === 'en' ? `Order confirmed! Your number is ${orderCode}` : `تم تأكيد طلبك وإرساله للموظف بنجاح! رقم طلبك هو ${orderCode}`);
  if (visualFlashMode) {
    triggerVisualBanner(`تم تأكيد الطلب ${orderCode} — توجه إلى ${selectedLane}`);
  }
  switchMainView('tracker');
}

function switchMainView(view) {
  currentView = view;
  if (view === 'staff' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // إيقاف أي صوت فوراً عند فتح شاشة الموظف
  }

  const views = {
    customer: document.getElementById('viewCustomer'),
    tracker: document.getElementById('viewTracker'),
    staff: document.getElementById('viewStaff')
  };
  const tabs = {
    customer: document.getElementById('tabCustomer'),
    tracker: document.getElementById('tabTracker'),
    staff: document.getElementById('tabStaff')
  };

  Object.keys(views).forEach(k => {
    if (k === view) {
      views[k].classList.remove('hidden');
      tabs[k].className = 'focus-ring px-5 py-3 rounded-xl font-extrabold text-sm transition bg-emerald-500 text-slate-950 shadow';
    } else {
      views[k].classList.add('hidden');
      if (k === 'staff' && tabs.staff.classList.contains('hidden')) {
        // إبقاء زر الموظف مخفياً للزوار
      } else {
        tabs[k].className = 'focus-ring px-5 py-3 rounded-xl font-extrabold text-sm transition text-slate-200 hover:bg-slate-800';
      }
    }
  });
}

function updateStepUIOnly(stepNum) {
  for (let i = 1; i <= 4; i++) {
    const box = document.getElementById('step-' + i);
    if (i <= stepNum) {
      box.className = 'step-box p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50';
    } else {
      box.className = 'step-box p-4 rounded-2xl border-2 border-slate-200 bg-slate-50';
    }
  }
}

// الموظف يحدث المرحلة -> ترسل للعميل فينطق جوال العميل فقط
function setOrderStep(stepNum) {
  updateStepUIOnly(stepNum);
  publishSyncEvent({ type: 'STEP_UPDATE', stepNum: stepNum });
  triggerVisualBanner('تم إرسال (المرحلة ' + stepNum + ') لجوال العميل بنجاح');
}

// اكتمال الطلب وحذفه نهائياً
function completeAndDeleteOrder() {
  activeOrderId = null;
  cart = [];
  renderCart();
  resetStaffScreenToEmpty();
  publishSyncEvent({ type: 'COMPLETE_ORDER' });
  triggerVisualBanner('تم إكمال الطلب وحذفه من لوحة الموظف بنجاح');
}

function appendSignalToStaffLog(text, timeStr, senderType) {
  const log = document.getElementById('staffSignalsLog');
  if (senderType === 'staff') {
    log.innerHTML = `
      <div class="bg-amber-950/80 border border-amber-400 p-3 rounded-xl text-xs text-amber-200 font-bold">
        <span class="text-amber-400 block mb-1">[${timeStr}] رد الموظف:</span>
        ${text}
      </div>
    ` + log.innerHTML;
  } else {
    log.innerHTML = `
      <div class="bg-emerald-950/90 border border-emerald-500 p-3 rounded-xl text-xs text-emerald-200 font-bold">
        <span class="text-emerald-400 block mb-1">[${timeStr}] إشارة من السيارة:</span>
        ${text}
      </div>
    ` + log.innerHTML;
  }
}

function appendReplyToCustomerScreen(replyText, timeStr) {
  const box = document.getElementById('customerChatBox');
  const list = document.getElementById('customerRepliesList');
  box.classList.remove('hidden');
  list.innerHTML = `
    <div class="bg-white p-3 rounded-xl border border-amber-300 flex items-center justify-between">
      <span>${replyText}</span>
      <span class="text-xs text-slate-500">${timeStr}</span>
    </div>
  ` + list.innerHTML;
}

function sendQuickSignal(signalText) {
  const conf = document.getElementById('signalConfirmation');
  const confText = document.getElementById('signalConfirmationText');
  confText.textContent = 'تم إرسال الإشارة للموظف: "' + signalText + '"';
  conf.classList.remove('hidden');

  const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  appendSignalToStaffLog(signalText, time, 'customer');
  publishSyncEvent({ type: 'SIGNAL', signalText: signalText, time: time });

  speakText(currentLang === 'en' ? 'Signal sent to staff' : 'تم إرسال إشارتك للموظف');
}

// إرسال رد جاهز من الموظف على محادثة العميل
function sendStaffQuickReply(replyText) {
  const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  appendSignalToStaffLog(replyText, time, 'staff');
  publishSyncEvent({ type: 'STAFF_REPLY', replyText: replyText, time: time });
  triggerVisualBanner('تم إرسال الرد لشاشة العميل: ' + replyText);
}

function triggerCustomerAlert(msg) {
  publishSyncEvent({ type: 'STAFF_ALERT', msg: msg });
  triggerVisualBanner('تم إرسال التنبيه لشاشة العميل بنجاح');
}

window.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  renderCart();
  resetStaffScreenToEmpty();
  startLiveCloudSync();
});
