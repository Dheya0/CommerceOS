// CommerceOS AST-Based Dynamic Rule Engine (Exported Runtime)
// Translates natural/structured merchant rules into lightning-fast JS evaluation functions

class CommerceRuleEngine {
  constructor(rulesDefinition = []) {
    this.rules = rulesDefinition;
  }

  // Evaluate cart & customer context against all active compiled AST rules
  evaluateCheckout(cart, customer, context = {}) {
    let totalDiscount = 0;
    const appliedRules = [];

    for (const rule of this.rules) {
      if (!rule.isActive) continue;

      try {
        const isMatched = this.matchConditions(rule.conditions, cart, customer, context);
        if (isMatched) {
          const discountAmount = this.calculateDiscount(rule.action, cart);
          if (discountAmount > 0) {
            totalDiscount += discountAmount;
            appliedRules.push({
              ruleId: rule.id,
              ruleName: rule.name,
              discount: discountAmount
            });
          }
        }
      } catch (err) {
        console.error(`[Rule Engine Error] Failed to evaluate rule ${rule.id}:`, err);
      }
    }

    return {
      totalDiscount,
      appliedRules
    };
  }

  matchConditions(conditions, cart, customer, context) {
    // AST condition evaluation tree
    if (!conditions || !conditions.all) return true;

    for (const cond of conditions.all) {
      const satisfied = this.evaluateSingleCondition(cond, cart, customer, context);
      if (!satisfied) return false;
    }

    return true;
  }

  evaluateSingleCondition(cond, cart, customer, context) {
    const { field, operator, value } = cond;

    let targetValue;
    if (field === 'customer.isVip') {
      targetValue = customer?.isVip || customer?.tier === 'VIP';
    } else if (field === 'cart.itemCount') {
      targetValue = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    } else if (field === 'cart.category') {
      targetValue = cart.items.some(item => item.category === value);
    } else if (field === 'context.dayOfWeek') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      targetValue = days[new Date().getDay()];
    } else if (field === 'cart.total') {
      targetValue = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    switch (operator) {
      case 'equals':
        return targetValue === value;
      case 'greater_than':
        return Number(targetValue) > Number(value);
      case 'contains':
        return String(targetValue).includes(value);
      case 'includes_category':
        return cart.items.some(item => item.category === value);
      default:
        return false;
    }
  }

  calculateDiscount(action, cart) {
    if (action.type === 'fixed_amount') {
      return Number(action.value) || 0;
    } else if (action.type === 'percentage') {
      const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return (subtotal * Number(action.value)) / 100;
    } else if (action.type === 'cheapest_item_free') {
      if (cart.items.length === 0) return 0;
      let minPrice = Infinity;
      for (const item of cart.items) {
        if (item.price < minPrice) minPrice = item.price;
      }
      return minPrice === Infinity ? 0 : minPrice;
    }
    return 0;
  }
}

module.exports = { CommerceRuleEngine };
