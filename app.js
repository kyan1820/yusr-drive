console.log("Yusr Drive System Initialized - Developer: Kayan Adel Abbas");

let ttsEnabled = true;
let visualFlashMode = false;
let fontScaleIndex = 0;
const fontScales = [1, 1.15, 1.3];

let selectedMode = 'mobility';
let selectedSpot = 'تسليم عبر نافذة السائق بحامل ممتد';
let selectedLane = 'مسار يُسر 1';
let currentCategory = 'all';

const yusrMenu = [
  { id: 1, name: 'وجبة برجر دجاج مشوي ميسّرة', category: 'meals', price: 24, desc: 'مقطعة إلى نصفين ومغلفة بغلاف يفتح بيد واحدة مع حامل بطاطس للسيارة', badge: 'سهلة التناول بالسيارة' },
  { id: 2, name: 'راب تورتيلا لحم مشوي', category: 'meals', price: 21, desc: 'ملفوف بإحكام لمنع التساقط أثناء القيادة أو الجلوس على الكرسي المتحرك', badge: 'مانع للانسكاب' },
  { id: 3, name: 'قهوة مختصة باردة (كوب بغطاء أمان)', category: 'drinks', price: 16, desc: 'كوب مزود بغطاء مانع للانسكاب مع مصاصة ثابتة مرنة', badge: 'كوب أمان' },
  { id: 4, name: 'عصير برتقال طازج', category: 'drinks', price: 14, desc: 'عبوة سهلة الإمساك بيد واحدة مع غطاء ذكي', badge: 'طبيعي 100%' },
  { id: 5, name: 'حقيبة إسعافات أولية ومسكنات سريعة', category: 'pharmacy', price: 35, desc: 'تحتوي على مسكن ألم، ضمادات طبية، ومعقم بعبوات سهلة الفتح', badge: 'ركن الصيدلية' },
  { id: 6, name: 'بوكس فطور صباحي متكامل', category: 'meals', price: 28, desc: 'فطائر لينة + قهوة ساخنة في صينية تثبت على مقود أو باب السيارة', badge: 'الأكثر طلباً' }
];

let cart = [
  { id: 1, name: 'وجبة برجر دجاج مشوي ميسّرة', price: 24, qty: 1, note: 'تغليف سهل الفتح بيد واحدة' },
  { id: 3, name: 'قهوة مختصة باردة (كوب بغطاء أمان)', price: 16, qty: 1, note: 'غطاء مانع للانسكاب' }
];

function speakText(text) {
  if (!ttsEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
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
  const btn = document.getElementById('ttsToggleBtn');
  if (ttsEnabled) {
    btn.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><span>القارئ الصوتي: مفعّل</span>`;
    speakText('تم تفعيل القارئ الصوتي');
  } else {
    window.speechSynthesis.cancel();
    btn.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span>القارئ الصوتي: متوقف</span>`;
  }
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
  speakText('تم تبديل وضع التباين العالي');
}

function cycleFontSize() {
  fontScaleIndex = (fontScaleIndex + 1) % fontScales.length;
  const scale = fontScales[fontScaleIndex];
  document.documentElement.style.setProperty('--font-scale', scale);
  document.getElementById('fontScaleLabel').textContent = Math.round(scale * 100) + '%';
  speakText('تم تغيير حجم الخط إلى ' + Math.round(scale * 100) + ' بالمئة');
}

function toggleVisualFlashMode() {
  visualFlashMode = !visualFlashMode;
  const btn = document.getElementById('visualFlashToggleBtn');
  if (visualFlashMode) {
    btn.classList.add('bg-amber-400', 'text-slate-950');
    btn.classList.remove('bg-slate-800');
    triggerVisualBanner('تم تفعيل الإشعارات الضوئية البصرية للصم وضعاف السمع');
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

  const staffBadge = document.getElementById('staffModeBadge');
  const staffInstructions = document.getElementById('staffInstructionsBox');

  if (mode === 'mobility') {
    staffBadge.textContent = 'إعاقة حركية';
    staffInstructions.textContent = '• العميل يستخدم مسار الإعاقة الحركية: استخدم صينية التسليم الممتدة حتى نافذة السائق أو ضع الطلب في المكان المحدد دون إجهاد العميل.';
    speakText('تم اختيار نمط الإعاقة الحركية، سيتم تسليم الطلب حتى نافذتك بحامل ممتد.');
  } else if (mode === 'hearing') {
    staffBadge.textContent = 'صم وضعاف سمع / نطق';
    staffInstructions.textContent = '• تنبيه هام: العميل أصم أو يفضل عدم التخاطب الصوتي. لا تستخدم المايكروفون إطلاقاً، تواصل عبر الشاشة والابتسامة ولغة الإشارة.';
    if (!visualFlashMode) toggleVisualFlashMode();
  } else if (mode === 'visual') {
    staffBadge.textContent = 'مكفوفون وضعاف بصر';
    staffInstructions.textContent = '• العميل/المرافق يستخدم التوجيه الصوتي: عند الوصول للنافذة عرّف بنفسك صوتياً بوضوح واشرح مكان وضع المشروبات والوجبات.';
    if (!ttsEnabled) toggleTTS();
    speakText('تم اختيار نمط المكفوفين وضعاف البصر، القارئ الصوتي نشط لمرافقتك.');
  } else if (mode === 'cognitive') {
    staffBadge.textContent = 'واجهة مبسطة وهادئة';
    staffInstructions.textContent = '• العميل يفضل بيئة هادئة بدون استعجال: امنحه الوقت الكافي وتجنب الأصوات العالية أو الإرباك عند نافذة التسليم.';
    speakText('تم تفعيل الواجهة المبسطة والهادئة.');
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
  const filtered = currentCategory === 'all' ? yusrMenu : yusrMenu.filter(i => i.category === currentCategory);

  grid.innerHTML = filtered.map(item => `
    <div class="p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition flex flex-col justify-between gap-3 bg-slate-50/50">
      <div>
        <div class="flex items-start justify-between gap-2">
          <span class="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">${item.badge}</span>
        </div>
        <h3 class="font-black text-lg mt-2">${item.name}</h3>
        <p class="text-xs text-slate-600 mt-1 leading-relaxed">${item.desc}</p>
      </div>
      <div class="flex items-center justify-between pt-3 border-t border-slate-200">
        <span class="text-lg font-black text-emerald-700">${item.price} ر.س</span>
        <div class="flex items-center gap-1.5">
          <button onclick="speakText('${item.name}، السعر ${item.price} ريال، ${item.desc}')" class="focus-ring px-2.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold" title="استماع للوصف">
            صوت
          </button>
          <button onclick="addToCart(${item.id})" class="focus-ring px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition">
            + أضف للسلة
          </button>
        </div>
      </div>
    </div>
  `).join('');
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
      price: item.price,
      qty: 1,
      note: easyPack ? 'تغليف ميسّر سهل الفتح' : 'تغليف عادي'
    });
  }
  renderCart();
  speakText('تمت إضافة ' + item.name + ' إلى السلة');
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
  speakText('تم إفراغ السلة');
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
  const staffList = document.getElementById('staffItemsList');

  if (cart.length === 0) {
    list.innerHTML = `<p class="text-xs text-slate-400 py-4 text-center">السلة فارغة حالياً، اختر من القائمة</p>`;
    totalEl.textContent = '0';
    staffList.innerHTML = `<li class="text-slate-400">لا توجد أصناف</li>`;
    return;
  }

  let total = 0;
  list.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
        <div>
          <p class="font-bold text-sm">${item.name}</p>
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

  staffList.innerHTML = cart.map(item => `
    <li class="flex items-center justify-between border-b border-slate-800 pb-2">
      <span>${item.qty}x ${item.name}</span>
      <span class="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">${item.note}</span>
    </li>
  `).join('');
}

function selectDeliverySpot(spotKey, btnEl) {
  const map = {
    window: 'تسليم عبر نافذة السائق بحامل ممتد',
    passenger: 'وضع الطلب على المقعد المجاور للسائق',
    trunk: 'وضع الطلب في الشنطة الخلفية للسيارة'
  };
  selectedSpot = map[spotKey];
  document.getElementById('staffSpotInfo').textContent = selectedSpot;

  document.querySelectorAll('.spot-btn').forEach(btn => {
    btn.className = 'spot-btn focus-ring text-right px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 font-bold text-sm flex items-center justify-between';
    btn.querySelector('span:last-child').textContent = '○';
  });

  btnEl.className = 'spot-btn focus-ring text-right px-4 py-3 rounded-xl border-2 border-emerald-600 bg-emerald-50 font-bold text-sm flex items-center justify-between';
  btnEl.querySelector('span:last-child').textContent = '✓';
  speakText('تم اختيار ' + selectedSpot);
}

function selectLane(laneName) {
  selectedLane = laneName;
  document.getElementById('trackerLaneName').textContent = laneName;
  document.getElementById('staffLaneInfo').textContent = laneName;

  ['lane-1', 'lane-2', 'lane-3'].forEach(id => {
    const el = document.getElementById(id);
    if (el.textContent === laneName) {
      el.className = 'lane-btn focus-ring py-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 font-black text-sm';
    } else {
      el.className = 'lane-btn focus-ring py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm';
    }
  });
  speakText('تم تحديد ' + laneName);
}

function submitAccessibleOrder() {
  if (cart.length === 0) {
    speakText('يرجى إضافة صنف واحد على الأقل في السلة');
    return;
  }
  const carInput = document.getElementById('carDetails').value || 'سيارة العميل';
  document.getElementById('staffCarInfo').textContent = carInput;

  speakText('تم تأكيد طلبك بنجاح! رقم طلبك هو يسر مئة وأربعة. توجه الآن إلى ' + selectedLane);
  if (visualFlashMode) {
    triggerVisualBanner('تم تأكيد الطلب #YSR-104 — توجه إلى ' + selectedLane);
  }
  switchMainView('tracker');
}

function switchMainView(view) {
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
      tabs[k].className = 'focus-ring px-5 py-3 rounded-xl font-extrabold text-sm transition text-slate-200 hover:bg-slate-800';
    }
  });
}

function setOrderStep(stepNum) {
  for (let i = 1; i <= 4; i++) {
    const box = document.getElementById('step-' + i);
    if (i <= stepNum) {
      box.className = 'step-box p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50';
    } else {
      box.className = 'step-box p-4 rounded-2xl border-2 border-slate-200 bg-slate-50';
    }
  }
  const messages = {
    1: 'تم استلام الطلب وتكييف المسار',
    2: 'جاري تجهيز الطلب بتغليف ميسّر سهل الفتح',
    3: 'تم التعرف على وصول سيارتك في المسار الذكي',
    4: 'الموظف في طريقه لباب سيارتك الآن لتسليم الطلب'
  };
  speakText(messages[stepNum]);
  if (visualFlashMode) {
    triggerVisualBanner(messages[stepNum]);
  }
}

function sendQuickSignal(signalText) {
  const conf = document.getElementById('signalConfirmation');
  const confText = document.getElementById('signalConfirmationText');
  confText.textContent = 'تم إرسال الإشارة للموظف: "' + signalText + '"';
  conf.classList.remove('hidden');

  const log = document.getElementById('staffSignalsLog');
  const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  log.innerHTML = `
    <div class="bg-emerald-950/90 border border-emerald-500 p-3 rounded-xl text-xs text-emerald-200 font-bold">
      <span class="text-emerald-400 block mb-1">[${time}] إشارة من السيارة:</span>
      ${signalText}
    </div>
  ` + log.innerHTML;

  speakText('تم إرسال الإشارة إلى شاشة الموظف');
}

function triggerCustomerAlert(msg) {
  triggerVisualBanner(msg);
  speakText(msg);
}

window.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  renderCart();
});
