/**
 * COFFEE CO. - Main Application JavaScript
 * Enterprise-grade modular JavaScript for interactive features
 */

// ============================================
// MODULE: Coffee Quiz Widget
// ============================================
const CoffeeQuiz = {
  currentStep: 0,
  answers: {},
  
  questions: [
    {
      id: 'taste',
      question: 'What flavor profile do you prefer?',
      options: [
        { value: 'fruity', label: 'Fruity & Floral', description: 'Bright acidity with berry notes' },
        { value: 'chocolatey', label: 'Chocolatey & Nutty', description: 'Rich, smooth, and comforting' },
        { value: 'balanced', label: 'Balanced & Classic', description: 'Well-rounded with subtle sweetness' }
      ]
    },
    {
      id: 'intensity',
      question: 'How strong do you like your coffee?',
      options: [
        { value: 'mild', label: 'Mild & Smooth', description: 'Light body, easy drinking' },
        { value: 'medium', label: 'Medium Body', description: 'Perfect balance of strength and flavor' },
        { value: 'bold', label: 'Bold & Intense', description: 'Full-bodied with powerful taste' }
      ]
    },
    {
      id: 'brewing',
      question: 'What\'s your preferred brewing method?',
      options: [
        { value: 'espresso', label: 'Espresso', description: 'Quick, concentrated shots' },
        { value: 'pour-over', label: 'Pour Over', description: 'Slow, deliberate extraction' },
        { value: 'french-press', label: 'French Press', description: 'Rich and full-bodied' }
      ]
    }
  ],

  recommendations: {
    'fruity-mild-pour-over': { name: 'Ethiopian Yirgacheffe', origin: 'Ethiopia', roast: 'Light', notes: 'Jasmine, Bergamot, Blueberry' },
    'fruity-medium-pour-over': { name: 'Kenya AA', origin: 'Kenya', roast: 'Medium-Light', notes: 'Blackcurrant, Wine, Citrus' },
    'fruity-bold-espresso': { name: 'Colombian Supremo', origin: 'Colombia', roast: 'Medium', notes: 'Caramel, Apple, Cherry' },
    'chocolatey-mild-french-press': { name: 'Brazilian Santos', origin: 'Brazil', roast: 'Medium', notes: 'Chocolate, Nuts, Caramel' },
    'chocolatey-medium-espresso': { name: 'Sumatra Mandheling', origin: 'Indonesia', roast: 'Dark', notes: 'Earth, Spice, Dark Chocolate' },
    'chocolatey-bold-french-press': { name: 'Guatemala Antigua', origin: 'Guatemala', roast: 'Dark', notes: 'Cocoa, Smoke, Spice' },
    'balanced-mild-pour-over': { name: 'Costa Rica Tarrazu', origin: 'Costa Rica', roast: 'Medium', notes: 'Honey, Orange, Brown Sugar' },
    'balanced-medium-espresso': { name: 'House Blend', origin: 'Multi-Origin', roast: 'Medium', notes: 'Balanced, Smooth, Versatile' },
    'balanced-bold-french-press': { name: 'Italian Roast Blend', origin: 'Multi-Origin', roast: 'Dark', notes: 'Bold, Smoky, Intense' }
  },

  init() {
    this.renderQuestion();
    this.attachEventListeners();
  },

  renderQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer || this.currentStep >= this.questions.length) return;

    const q = this.questions[this.currentStep];
    quizContainer.innerHTML = `
      <div class="quiz-step animate-fade-in">
        <div class="mb-2 text-amber-500 text-sm uppercase tracking-wider">Question ${this.currentStep + 1} of ${this.questions.length}</div>
        <h3 class="text-2xl md:text-3xl font-display mb-8">${q.question}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${q.options.map(opt => `
            <div class="quiz-option" data-value="${opt.value}" data-question="${q.id}">
              <div class="font-semibold text-lg mb-2">${opt.label}</div>
              <div class="text-sm text-gray-400">${opt.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.attachOptionListeners();
  },

  attachOptionListeners() {
    document.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const selected = e.currentTarget;
        const questionId = selected.dataset.question;
        const value = selected.dataset.value;

        // Remove previous selections
        document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        
        // Add selection
        selected.classList.add('selected');
        this.answers[questionId] = value;

        // Delay before next question
        setTimeout(() => {
          this.currentStep++;
          if (this.currentStep < this.questions.length) {
            this.renderQuestion();
          } else {
            this.showResult();
          }
        }, 400);
      });
    });
  },

  showResult() {
    const quizContainer = document.getElementById('quiz-container');
    const key = `${this.answers.taste}-${this.answers.intensity}-${this.answers.brewing}`;
    const recommendation = this.recommendations[key] || this.recommendations['balanced-medium-espresso'];

    quizContainer.innerHTML = `
      <div class="text-center animate-fade-in py-8">
        <div class="text-amber-500 text-sm uppercase tracking-wider mb-4">Your Perfect Match</div>
        <h3 class="text-4xl md:text-5xl font-display mb-6">${recommendation.name}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="bg-espresso-800 p-6 border border-espresso-700">
            <div class="text-amber-500 text-sm mb-2">Origin</div>
            <div class="text-xl">${recommendation.origin}</div>
          </div>
          <div class="bg-espresso-800 p-6 border border-espresso-700">
            <div class="text-amber-500 text-sm mb-2">Roast Level</div>
            <div class="text-xl">${recommendation.roast}</div>
          </div>
          <div class="bg-espresso-800 p-6 border border-espresso-700">
            <div class="text-amber-500 text-sm mb-2">Tasting Notes</div>
            <div class="text-xl">${recommendation.notes}</div>
          </div>
        </div>
        <button onclick="CoffeeQuiz.restart()" class="btn-secondary mt-8">
          Start Over
        </button>
      </div>
    `;
  },

  restart() {
    this.currentStep = 0;
    this.answers = {};
    this.renderQuestion();
  },

  attachEventListeners() {
    // Additional global listeners if needed
  }
};

// ============================================
// MODULE: Product Filter & Search
// ============================================
const ProductFilter = {
  products: [],
  
  init() {
    this.loadProducts();
    this.attachEventListeners();
  },

  loadProducts() {
    // Sample product data
    this.products = [
      { id: 1, name: 'Ethiopian Yirgacheffe', origin: 'ethiopia', roast: 'light', price: 24.99, image: 'coffee-1.jpg', discount: 0 },
      { id: 2, name: 'Colombian Supremo', origin: 'colombia', roast: 'medium', price: 22.99, image: 'coffee-2.jpg', discount: 10 },
      { id: 3, name: 'Sumatra Mandheling', origin: 'indonesia', roast: 'dark', price: 26.99, image: 'coffee-3.jpg', discount: 0 },
      { id: 4, name: 'Brazilian Santos', origin: 'brazil', roast: 'medium', price: 19.99, image: 'coffee-4.jpg', discount: 15 },
      { id: 5, name: 'Kenya AA', origin: 'kenya', roast: 'light', price: 28.99, image: 'coffee-5.jpg', discount: 0 },
      { id: 6, name: 'Guatemala Antigua', origin: 'guatemala', roast: 'dark', price: 25.99, image: 'coffee-6.jpg', discount: 5 },
      { id: 7, name: 'Costa Rica Tarrazu', origin: 'costa-rica', roast: 'medium', price: 23.99, image: 'coffee-7.jpg', discount: 0 },
      { id: 8, name: 'House Blend', origin: 'blend', roast: 'medium', price: 21.99, image: 'coffee-8.jpg', discount: 0 },
    ];

    this.renderProducts(this.products);
  },

  renderProducts(productsToRender) {
    const container = document.getElementById('product-grid');
    if (!container) return;

    if (productsToRender.length === 0) {
      container.innerHTML = '<div class="col-span-full text-center py-12 text-gray-400">No products found matching your criteria.</div>';
      return;
    }

    container.innerHTML = productsToRender.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-card-image relative">
          <img src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop" 
               alt="${product.name}" 
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
          ${product.discount > 0 ? `<span class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-sm font-bold">-${product.discount}%</span>` : ''}
          <div class="absolute inset-0 bg-espresso-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button onclick="ProductFilter.quickView(${product.id})" class="btn-secondary px-4 py-2 text-sm">Quick View</button>
            <button onclick="ProductFilter.addToCart(${product.id})" class="btn-primary px-4 py-2 text-sm">Add to Cart</button>
          </div>
        </div>
        <div class="p-6">
          <div class="text-amber-500 text-xs uppercase tracking-wider mb-2">${product.origin} • ${product.roast} roast</div>
          <h3 class="text-xl font-display mb-3">${product.name}</h3>
          <div class="flex items-center justify-between">
            <div class="text-2xl">$${product.price.toFixed(2)}</div>
            <button onclick="ProductFilter.addToCart(${product.id})" class="text-amber-500 hover:text-amber-400 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  filterProducts() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const originFilter = document.getElementById('filter-origin')?.value || 'all';
    const roastFilter = document.getElementById('filter-roast')?.value || 'all';
    const priceFilter = document.getElementById('filter-price')?.value || 'all';

    const filtered = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      const matchesOrigin = originFilter === 'all' || product.origin === originFilter;
      const matchesRoast = roastFilter === 'all' || product.roast === roastFilter;
      const matchesPrice = priceFilter === 'all' || 
        (priceFilter === 'low' && product.price < 22) ||
        (priceFilter === 'mid' && product.price >= 22 && product.price < 26) ||
        (priceFilter === 'high' && product.price >= 26);

      return matchesSearch && matchesOrigin && matchesRoast && matchesPrice;
    });

    this.renderProducts(filtered);
  },

  quickView(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quick-view-modal');
    const modalContent = document.getElementById('quick-view-content');
    
    if (modal && modalContent) {
      modalContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop" 
               alt="${product.name}" 
               class="w-full aspect-square object-cover">
          <div>
            <div class="text-amber-500 text-sm uppercase tracking-wider mb-2">${product.origin} • ${product.roast} roast</div>
            <h3 class="text-3xl font-display mb-4">${product.name}</h3>
            <p class="text-gray-400 mb-6">Premium single-origin coffee beans sourced directly from sustainable farms. Roasted to perfection to bring out the unique characteristics of this exceptional origin.</p>
            <div class="text-3xl mb-6">$${product.price.toFixed(2)}</div>
            <div class="flex gap-4">
              <button onclick="ProductFilter.addToCart(${product.id}); document.getElementById('quick-view-modal').classList.add('hidden');" class="btn-primary flex-1">Add to Cart</button>
              <button onclick="document.getElementById('quick-view-modal').classList.add('hidden');" class="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      `;
      modal.classList.remove('hidden');
    }
  },

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    // Simple cart notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-amber-500 text-espresso-900 px-6 py-3 z-50 animate-slide-up';
    notification.innerHTML = `<strong>${product.name}</strong> added to cart!`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  },

  attachEventListeners() {
    const searchInput = document.getElementById('search-input');
    const filterOrigin = document.getElementById('filter-origin');
    const filterRoast = document.getElementById('filter-roast');
    const filterPrice = document.getElementById('filter-price');

    if (searchInput) searchInput.addEventListener('input', () => this.filterProducts());
    if (filterOrigin) filterOrigin.addEventListener('change', () => this.filterProducts());
    if (filterRoast) filterRoast.addEventListener('change', () => this.filterProducts());
    if (filterPrice) filterPrice.addEventListener('change', () => this.filterProducts());
  }
};

// ============================================
// MODULE: Brewing Timer
// ============================================
const BrewingTimer = {
  timer: null,
  seconds: 0,
  isRunning: false,
  currentMethod: null,

  methods: {
    'v60': {
      name: 'V60 Pour Over',
      ratio: '1:16',
      steps: [
        { time: 0, action: 'Start timer, pour 50g water (bloom)' },
        { time: 30, action: 'Continue pouring to 200g in circles' },
        { time: 60, action: 'Pour remaining water to target weight' },
        { time: 120, action: 'Gentle swirl' },
        { time: 180, action: 'Drawdown complete' }
      ]
    },
    'chemex': {
      name: 'Chemex',
      ratio: '1:17',
      steps: [
        { time: 0, action: 'Start timer, bloom with 100g water' },
        { time: 45, action: 'Pour in stages to 400g' },
        { time: 90, action: 'Final pour to target weight' },
        { time: 240, action: 'Complete drawdown' }
      ]
    },
    'french-press': {
      name: 'French Press',
      ratio: '1:15',
      steps: [
        { time: 0, action: 'Add all water, stir gently' },
        { time: 60, action: 'Break crust, skim foam' },
        { time: 240, action: 'Press slowly and serve' }
      ]
    },
    'espresso': {
      name: 'Espresso',
      ratio: '1:2',
      steps: [
        { time: 0, action: 'Start extraction' },
        { time: 5, action: 'First drops appear' },
        { time: 25, action: 'Target yield reached' },
        { time: 30, action: 'Stop extraction' }
      ]
    }
  },

  init() {
    this.attachEventListeners();
  },

  selectMethod(method) {
    this.currentMethod = method;
    const methodData = this.methods[method];
    
    document.getElementById('timer-method-name').textContent = methodData.name;
    document.getElementById('timer-ratio').textContent = `Ratio: ${methodData.ratio}`;
    document.getElementById('timer-steps').innerHTML = methodData.steps.map(step => `
      <div class="timer-step py-3 border-b border-espresso-700" data-time="${step.time}">
        <span class="text-amber-500 font-mono">${this.formatTime(step.time)}</span>
        <span class="ml-4">${step.action}</span>
      </div>
    `).join('');

    this.reset();
  },

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    document.getElementById('timer-btn-start').classList.add('hidden');
    document.getElementById('timer-btn-pause').classList.remove('hidden');

    this.timer = setInterval(() => {
      this.seconds++;
      this.updateDisplay();
      this.highlightCurrentStep();
    }, 1000);
  },

  pause() {
    if (!this.isRunning) return;
    
    clearInterval(this.timer);
    this.isRunning = false;
    document.getElementById('timer-btn-start').classList.remove('hidden');
    document.getElementById('timer-btn-pause').classList.add('hidden');
  },

  reset() {
    this.pause();
    this.seconds = 0;
    this.updateDisplay();
    document.getElementById('timer-btn-start').classList.remove('hidden');
    document.getElementById('timer-btn-pause').classList.add('hidden');
    this.highlightCurrentStep();
  },

  updateDisplay() {
    const display = document.getElementById('timer-display');
    if (display) {
      display.textContent = this.formatTime(this.seconds);
    }
  },

  highlightCurrentStep() {
    if (!this.currentMethod) return;
    
    const steps = this.methods[this.currentMethod].steps;
    let currentStepIndex = 0;
    
    for (let i = 0; i < steps.length; i++) {
      if (this.seconds >= steps[i].time) {
        currentStepIndex = i;
      }
    }

    document.querySelectorAll('.timer-step').forEach((step, index) => {
      if (index === currentStepIndex) {
        step.classList.add('text-amber-500', 'font-semibold');
      } else {
        step.classList.remove('text-amber-500', 'font-semibold');
      }
    });
  },

  formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  attachEventListeners() {
    const startBtn = document.getElementById('timer-btn-start');
    const pauseBtn = document.getElementById('timer-btn-pause');
    const resetBtn = document.getElementById('timer-btn-reset');

    if (startBtn) startBtn.addEventListener('click', () => this.start());
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

    // Method selection buttons
    document.querySelectorAll('[data-brew-method]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const method = e.currentTarget.dataset.brewMethod;
        this.selectMethod(method);
        
        // Update active state
        document.querySelectorAll('[data-brew-method]').forEach(b => {
          b.classList.remove('bg-amber-500', 'text-espresso-900');
          b.classList.add('bg-espresso-700', 'text-cream-100');
        });
        e.currentTarget.classList.remove('bg-espresso-700', 'text-cream-100');
        e.currentTarget.classList.add('bg-amber-500', 'text-espresso-900');
      });
    });
  }
};

// ============================================
// MODULE: Navigation & UI
// ============================================
const Navigation = {
  init() {
    this.handleScroll();
    this.handleMobileMenu();
    window.addEventListener('scroll', () => this.handleScroll());
  },

  handleScroll() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
      navbar.classList.add('glass-nav');
      navbar.classList.add('py-2');
      navbar.classList.remove('py-4');
    } else {
      navbar.classList.remove('glass-nav');
      navbar.classList.remove('py-2');
      navbar.classList.add('py-4');
    }
  },

  handleMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize modules based on page
  Navigation.init();

  if (document.getElementById('quiz-container')) {
    CoffeeQuiz.init();
  }

  if (document.getElementById('product-grid')) {
    ProductFilter.init();
  }

  if (document.getElementById('timer-display')) {
    BrewingTimer.init();
  }

  // Close modals on outside click
  document.querySelectorAll('[id$="-modal"]').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
});

// Global utility functions
window.CoffeeQuiz = CoffeeQuiz;
window.ProductFilter = ProductFilter;
window.BrewingTimer = BrewingTimer;
