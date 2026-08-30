// CommerceOS Event-Driven Architecture & CQRS Event Sourcing Engine
// Handles high-throughput event streaming (Redis Streams simulation) and CQRS projections.

class EventStore {
  constructor() {
    this.events = [];
    this.readProjections = {
      productViews: 0,
      totalOrdersPlaced: 0,
      inventoryStock: {
        'prod-1': 1500,
        'prod-2': 3200,
        'prod-3': 850
      }
    };
  }

  // Write side: Publish event to Event Stream
  emitEvent(eventType, payload) {
    const event = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventType,
      payload,
      timestamp: new Date().toISOString()
    };
    this.events.push(event);

    // Asynchronously project event to Read Models (CQRS Read Projection)
    this.projectEvent(event);

    return event;
  }

  // CQRS Projection Engine (Updates read-optimized models)
  projectEvent(event) {
    switch (event.eventType) {
      case 'ORDER_PLACED':
        this.readProjections.totalOrdersPlaced += 1;
        const items = event.payload.items || [];
        for (const item of items) {
          if (this.readProjections.inventoryStock[item.productId]) {
            this.readProjections.inventoryStock[item.productId] = Math.max(
              0,
              this.readProjections.inventoryStock[item.productId] - (item.quantity || 1)
            );
          }
        }
        break;
      case 'PRODUCT_VIEWED':
        this.readProjections.productViews += 1;
        break;
      default:
        break;
    }
  }

  // Read side: Lightning-fast read queries from CQRS projections
  getReadModel() {
    return {
      projections: this.readProjections,
      totalEventsRecorded: this.events.length,
      recentEvents: this.events.slice(-10).reverse()
    };
  }
}

// Multi-Warehouse Geolocation Routing Engine
class WarehouseRouter {
  constructor() {
    // Registered warehouses with GPS coordinates (lat, lng)
    this.warehouses = [
      { id: 'wh-riyadh', name: 'مستودع الرياض المركزي', lat: 24.7136, lng: 46.6753, capacity: 'High' },
      { id: 'wh-jeddah', name: 'مستودع جدة الغربي', lat: 21.5433, lng: 39.1728, capacity: 'Medium' },
      { id: 'wh-dubai', name: 'مستودع دبي الإقليمي', lat: 25.2048, lng: 55.2708, capacity: 'High' }
    ];
  }

  // Haversine formula to calculate distance between customer and warehouses
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in KM
  }

  // Route order to nearest optimal warehouse
  routeOrder(customerLocation) {
    // Default to Riyadh if no location provided
    const custLat = customerLocation?.lat || 24.7136;
    const custLng = customerLocation?.lng || 46.6753;

    let nearestWarehouse = this.warehouses[0];
    let minDistance = Infinity;

    for (const wh of this.warehouses) {
      const dist = this.calculateDistance(custLat, custLng, wh.lat, wh.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestWarehouse = wh;
      }
    }

    return {
      assignedWarehouse: nearestWarehouse,
      distanceKm: Math.round(minDistance),
      estimatedShippingCost: Math.round(minDistance * 0.5 + 15), // Dynamic shipping calculation
      routingTimestamp: new Date().toISOString()
    };
  }
}

module.exports = { EventStore, WarehouseRouter };
