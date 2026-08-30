// CommerceOS Middleware Plugin Loader & Plugin Architecture
// Dynamically discovers and loads plugins from the /plugins directory for ERP/Accounting sync.

const fs = require('fs');
const path = require('path');

class PluginManager {
  constructor(pluginsDir = path.join(__dirname, '../plugins')) {
    this.pluginsDir = pluginsDir;
    this.loadedPlugins = [];
  }

  // Load all middleware plugins dynamically
  loadPlugins(app) {
    if (!fs.existsSync(this.pluginsDir)) {
      try {
        fs.mkdirSync(this.pluginsDir, { recursive: true });
        // Create an example ERP plugin stub
        const samplePluginCode = `
// Sample ERP Accounting Middleware Plugin
module.exports = {
  name: 'ERP-SAP-Bridge',
  version: '1.0.0',
  register(app) {
    console.log('[Plugin] ERP-SAP-Bridge middleware registered successfully.');
    app.post('/api/plugins/erp-sync', (req, res) => {
      res.json({ success: true, message: 'ERP data synchronized successfully via plugin middleware.' });
    });
  }
};
`;
        fs.writeFileSync(path.join(this.pluginsDir, 'erpBridge.js'), samplePluginCode);
      } catch (err) {
        console.error('[PluginManager] Failed to initialize plugins directory:', err);
      }
    }

    try {
      const files = fs.readdirSync(this.pluginsDir);
      for (const file of files) {
        if (file.endsWith('.js') || file.endsWith('.ts')) {
          const pluginPath = path.join(this.pluginsDir, file);
          const plugin = require(pluginPath);
          if (typeof plugin.register === 'function') {
            plugin.register(app);
            this.loadedPlugins.push({
              name: plugin.name || file,
              version: plugin.version || '1.0.0',
              file
            });
            console.log(`[PluginManager] Loaded plugin: ${plugin.name || file}`);
          }
        }
      }
    } catch (err) {
      console.error('[PluginManager] Error loading plugins:', err);
    }
  }

  getLoadedPlugins() {
    return this.loadedPlugins;
  }
}

// HMAC Webhook Dispatcher with cryptographic signature verification
const crypto = require('crypto');

class WebhookDispatcher {
  constructor(secret = 'commerceos_secret_hmac_2026') {
    this.secret = secret;
    this.subscribers = [
      { id: 'sub_1', url: 'https://api.erp-system.com/webhook', events: ['ORDER_CREATED', 'PAYMENT_FAILED', 'INVENTORY_LOW'], active: true }
    ];
  }

  // Generate HMAC SHA256 signature
  generateSignature(payload) {
    return crypto
      .createHmac('sha256', this.secret)
      .update(JSON.stringify(payload))
      .digest('hex');
  }

  // Dispatch webhook event to all registered endpoints with signature header
  dispatch(eventType, payload) {
    const eventPayload = {
      eventId: `whk_${Date.now()}`,
      eventType,
      timestamp: new Date().toISOString(),
      data: payload
    };

    const signature = this.generateSignature(eventPayload);

    const dispatchedResults = this.subscribers
      .filter(sub => sub.active && sub.events.includes(eventType))
      .map(sub => {
        // Simulated HTTP POST dispatch with X-CommerceOS-Signature
        return {
          subscriberId: sub.id,
          targetUrl: sub.url,
          status: 'Dispatched',
          signatureHeader: `sha256=${signature}`
        };
      });

    return {
      success: true,
      event: eventPayload,
      dispatches: dispatchedResults
    };
  }

  getSubscribers() {
    return this.subscribers;
  }

  addSubscriber(url, events) {
    const newSub = {
      id: `sub_${Date.now()}`,
      url,
      events: events || ['ORDER_CREATED'],
      active: true
    };
    this.subscribers.push(newSub);
    return newSub;
  }
}

module.exports = { PluginManager, WebhookDispatcher };
