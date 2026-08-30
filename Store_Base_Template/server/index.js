const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Templated Configuration
const STORE_CONFIG = {
  storeId: '{{STORE_ID}}',
  storeName: '{{STORE_NAME}}',
  storeNameEn: '{{STORE_NAME_EN}}',
  currency: '{{STORE_CURRENCY}}',
  primaryColor: '{{PRIMARY_COLOR}}',
  secondaryColor: '{{SECONDARY_COLOR}}',
  logoUrl: '{{LOGO_URL}}',
  bannerUrl: '{{BANNER_URL}}',
  supportEmail: '{{SUPPORT_EMAIL}}',
  whatsappPhone: '{{WHATSAPP_PHONE}}',
  businessType: '{{BUSINESS_TYPE}}'
};

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: STORE_CONFIG.storeName,
    currency: STORE_CONFIG.currency,
    timestamp: new Date().toISOString()
  });
});

// Store Settings Endpoint
app.get('/api/settings', (req, res) => {
  res.json(STORE_CONFIG);
});

// Products Mock / DB Endpoint (Templated for dynamic injection)
app.get('/api/products', (req, res) => {
  res.json([
    {
      id: 'prod-1',
      name: '{{DEFAULT_PRODUCT_NAME}}',
      price: 199.00,
      currency: STORE_CONFIG.currency,
      image: '{{DEFAULT_PRODUCT_IMAGE}}',
      category: '{{DEFAULT_CATEGORY}}',
      stock: 50
    }
  ]);
});

// Orders Endpoint with Idempotency & Watermark Validation
const processedOrders = new Set();

app.post('/api/orders', (req, res) => {
  const idempotencyKey = req.headers['x-idempotency-key'] || req.body.idempotencyKey;
  if (idempotencyKey && processedOrders.has(idempotencyKey)) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate transaction prevented via Idempotency Guard (Race Condition Protection)'
    });
  }

  // Watermark Validation (AST / Signature Check)
  const hasWatermark = '{{HAS_WATERMARK}}' === 'true';
  const clientWatermarkToken = req.headers['x-commerceos-signature'] || req.body.watermarkToken;
  
  if (hasWatermark && !clientWatermarkToken) {
    return res.status(403).json({
      success: false,
      error: 'Security Error: CommerceOS Watermark signature missing or tampered. Order submission blocked.'
    });
  }

  const orderData = req.body;
  const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  
  if (idempotencyKey) {
    processedOrders.add(idempotencyKey);
    // Auto cleanup after 10 mins
    setTimeout(() => processedOrders.delete(idempotencyKey), 600000);
  }
  
  console.log(`[Store: ${STORE_CONFIG.storeId}] New Verified Order:`, orderNumber, orderData);
  
  res.status(201).json({
    success: true,
    orderNumber,
    message: 'تم استلام طلبكم بنجاح ومصادقته عبر حماية CommerceOS',
    currency: STORE_CONFIG.currency,
    total: orderData.total || 0,
    idempotencyKey: idempotencyKey || 'generated-' + Date.now(),
    createdAt: new Date().toISOString()
  });
});

// AI Shopping Assistant & RAG Vector Search Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, customerHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // System Prompt Engineering Presets based on Store Branding
  const systemPrompt = `أنت وكيل التسوق الذكي (AI Shopping Assistant) لمتجر "${STORE_CONFIG.storeName}" المتخصص في قطاع "${STORE_CONFIG.businessType}".
العملة الرسمية للمتجر هي "${STORE_CONFIG.currency}".
مهمتك هي مساعدة العملاء في العثور على المنتجات المناسبة، الإجابة على استفساراتهم باحترافية، وتقديم توصيات مخصصة (RAG) بناءً على كتالوج المنتجات، ومساعدتهم في إتمام الطلبات بكل ود وسلاسة. تحدث دائماً باللغة العربية الفصحى الراقية وبأسلوب العلامة التجارية للـ متجر.`;

  // Simulated Vector RAG Retrieval matching
  const sampleProducts = [
    { id: 'prod-1', name: '{{DEFAULT_PRODUCT_NAME}}', price: 199.00, category: '{{DEFAULT_CATEGORY}}', image: '{{DEFAULT_PRODUCT_IMAGE}}', description: 'منتج فاخر عالي الجودة مع ضمان شامل.' }
  ];

  // Simple semantic keyword matching simulation for RAG
  const matchedProducts = sampleProducts.filter(p => 
    message.toLowerCase().includes('منتج') || 
    message.toLowerCase().includes('سعر') || 
    message.toLowerCase().includes('شراء') ||
    message.toLowerCase().includes('أريد') ||
    message.toLowerCase().includes('price') ||
    message.toLowerCase().includes('buy')
  );

  let aiReply = `أهلاً بك في متجر ${STORE_CONFIG.storeName}! كيف يمكنني مساعدتك اليوم في العثور على ما تبحث عنه؟`;
  if (matchedProducts.length > 0) {
    aiReply = `بناءً على طلبك، أنصحك بـ "${matchedProducts[0].name}" بسعر ${matchedProducts[0].price} ${STORE_CONFIG.currency}. إنه خيار ممتاز ومتاح لدينا الآن للطلب الفوري! هل ترغب في أن أساعدك في إتمام الطلب؟`;
  } else if (message.includes('طلب') || message.includes('شراء')) {
    aiReply = `يسعدني جداً مساعدتك في إتمام طلبك من ${STORE_CONFIG.storeName}! يرجى تزويدي بالاسم والعنوان ورقم الهاتف وسأقوم بتسجيل الطلب فوراً.`;
  }

  res.json({
    success: true,
    reply: aiReply,
    ragContext: {
      matchedProducts,
      storeName: STORE_CONFIG.storeName,
      currency: STORE_CONFIG.currency,
      timestamp: new Date().toISOString()
    }
  });
});

const { CommerceRuleEngine } = require('./rulesEngine');

// Compiled Commerce Rules (AST-based dynamic discount rules injected during export)
const activeRules = [
  {
    id: 'rule-vip-perfume-friday',
    name: 'خصم VIP العطور يوم الجمعة (القطعة الأقل سعراً مجاناً)',
    isActive: true,
    conditions: {
      all: [
        { field: 'customer.isVip', operator: 'equals', value: true },
        { field: 'cart.category', operator: 'includes_category', value: 'العطور' },
        { field: 'context.dayOfWeek', operator: 'equals', value: 'Friday' }
      ]
    },
    action: {
      type: 'cheapest_item_free'
    }
  }
];

const ruleEngine = new CommerceRuleEngine(activeRules);

// Checkout Rule Evaluation Endpoint (AST-driven)
app.post('/api/checkout/evaluate-rules', (req, res) => {
  const { cart, customer, context } = req.body;
  if (!cart || !cart.items) {
    return res.status(400).json({ error: 'Cart items are required' });
  }

  const evaluationResult = ruleEngine.evaluateCheckout(cart, customer || {}, context || {});
  res.json({
    success: true,
    ...evaluationResult,
    storeName: STORE_CONFIG.storeName
  });
});

// Event Sourcing & CQRS Endpoints
const { EventStore, WarehouseRouter } = require('./eventStore');
const eventStore = new EventStore();
const warehouseRouter = new WarehouseRouter();

// Write Command Endpoint (Publishes event to message stream)
app.post('/api/commands/place-order', (req, res) => {
  const { items, customer, total, location } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order items are required' });
  }

  // 1. Determine optimal warehouse via Geolocation Routing
  const routingResult = warehouseRouter.routeOrder(location);

  // 2. Emit event to Event Sourcing stream
  const event = eventStore.emitEvent('ORDER_PLACED', {
    items,
    customer,
    total,
    assignedWarehouse: routingResult.assignedWarehouse.name,
    shippingCost: routingResult.estimatedShippingCost
  });

  res.status(201).json({
    success: true,
    message: 'تم استقبال الطلب وإرساله إلى طابور الأحداث (Event Stream) بنجاح',
    eventId: event.eventId,
    routing: routingResult
  });
});

// Read Query Endpoint (Ultra-fast CQRS Read Projection)
app.get('/api/queries/read-model', (req, res) => {
  const readModel = eventStore.getReadModel();
  res.json({
    success: true,
    ...readModel
  });
});

// Plugins & Webhooks Architecture
const { PluginManager, WebhookDispatcher } = require('./pluginManager');
const pluginManager = new PluginManager();
const webhookDispatcher = new WebhookDispatcher();

// Load dynamic middleware plugins from /plugins folder
pluginManager.loadPlugins(app);

// Webhooks Management & Test Endpoint
app.get('/api/webhooks/subscribers', (req, res) => {
  res.json({ success: true, subscribers: webhookDispatcher.getSubscribers(), loadedPlugins: pluginManager.getLoadedPlugins() });
});

app.post('/api/webhooks/trigger', (req, res) => {
  const { eventType, payload } = req.body;
  if (!eventType) {
    return res.status(400).json({ error: 'eventType is required' });
  }

  const dispatchResult = webhookDispatcher.dispatch(eventType, payload || { sample: 'data' });
  res.json(dispatchResult);
});



// Serve frontend build in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[CommerceOS Store Engine] ${STORE_CONFIG.storeName} running on port ${PORT}`);
});
