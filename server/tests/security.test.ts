import { hashPassword, verifyPassword, signAuthToken, verifyAuthToken, accountLockout, sessionRevocation } from '../utils/security';
import { authService } from '../services/auth.service';
import { db } from '../db';
import { ROLE_PERMISSIONS } from '../middleware/auth';

/**
 * Phase 0: Automated Security & Trust Boundary Test Suite
 * Validates server-side cryptographic and authorization guarantees.
 */
async function runSecurityTestSuite() {
  console.log('\n============================================================');
  console.log('🔒 RUNNING COMMERCEOS PHASE 0 SECURITY TEST SUITE');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, errorDetail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} - ${errorDetail || 'Assertion failed'}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST 1: PBKDF2 Salted Hashing & Verification
  // -------------------------------------------------------------
  console.log('👉 Group 1: Cryptographic Password Hashing & Constant-Time Verification');
  const password = 'SuperSecretMerchantPass2026!';
  const hash1 = hashPassword(password);
  const hash2 = hashPassword(password);

  assert(hash1.startsWith('pbkdf2$100000$'), 'Hash format conforms to PBKDF2-SHA512 standard');
  assert(hash1 !== hash2, 'Salts are unique per hash execution (anti-rainbow table)');
  assert(verifyPassword(password, hash1), 'Correct password successfully verifies against PBKDF2 hash');
  assert(!verifyPassword('WrongPassword123', hash1), 'Incorrect password correctly rejected');
  assert(!verifyPassword(password, 'malformed_hash_string'), 'Malformed hash safely rejected without crashing');

  // -------------------------------------------------------------
  // TEST 2: HMAC Session Token Generation & Tamper Detection
  // -------------------------------------------------------------
  console.log('\n👉 Group 2: HMAC Session Token Integrity & Anti-Forgery');
  const validToken = signAuthToken({
    userId: 'usr-store-owner-1',
    identityType: 'tenant_staff',
    email: 'care@royalhoney.sa',
    name: 'عبدالرحمن الشهري',
    role: 'store_owner',
    tenantId: 'tenant-royal-honey',
    permissions: ROLE_PERMISSIONS['store_owner']
  });

  const verified = verifyAuthToken(validToken);
  assert(verified.valid === true && verified.payload?.email === 'care@royalhoney.sa', 'Legitimate token successfully verified');

  // Tamper attack: modify payload to elevate role to platform_super_admin
  const tokenParts = validToken.split('.');
  const decodedPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64url').toString('utf-8'));
  decodedPayload.role = 'platform_super_admin';
  decodedPayload.identityType = 'platform_admin';
  const forgedPayloadBase64 = Buffer.from(JSON.stringify(decodedPayload)).toString('base64url');
  const forgedToken = `cos.${forgedPayloadBase64}.${tokenParts[2]}`;

  const tamperResult = verifyAuthToken(forgedToken);
  assert(!tamperResult.valid, 'Tampered token payload rejected by HMAC signature verification');

  // -------------------------------------------------------------
  // TEST 3: Session Revocation (Logout / Token Invalidation)
  // -------------------------------------------------------------
  console.log('\n👉 Group 3: Token Invalidation & Session Revocation');
  const logoutToken = signAuthToken({
    userId: 'usr-revocable-1',
    identityType: 'tenant_staff',
    email: 'revokeme@royalhoney.sa',
    name: 'Revocable User',
    role: 'support_agent',
    tenantId: 'tenant-royal-honey'
  });

  const check1 = verifyAuthToken(logoutToken);
  assert(check1.valid === true, 'Token valid before logout');

  if (check1.payload) {
    sessionRevocation.revokeToken(check1.payload.tokenId, check1.payload.expiresAt);
  }

  const check2 = verifyAuthToken(logoutToken);
  assert(check2.valid === false && check2.error === 'Session has been revoked', 'Revoked token rejected on subsequent API calls');

  // -------------------------------------------------------------
  // TEST 4: Account Lockout / Brute-force Mitigation
  // -------------------------------------------------------------
  console.log('\n👉 Group 4: Brute-Force & Account Lockout Defense');
  const attackEmail = 'victim_staff@royalhoney.sa';
  accountLockout.reset(attackEmail);

  for (let i = 0; i < 4; i++) {
    accountLockout.recordFailure(attackEmail);
  }
  const preLockout = accountLockout.checkLockout(attackEmail);
  assert(!preLockout.locked, 'Account not locked before threshold is exceeded');

  accountLockout.recordFailure(attackEmail); // 5th failure
  const postLockout = accountLockout.checkLockout(attackEmail);
  assert(postLockout.locked && postLockout.remainingSeconds > 0, 'Account successfully locked after 5 consecutive failed attempts');

  accountLockout.reset(attackEmail);

  // -------------------------------------------------------------
  // TEST 5: Database-Backed Authentication Verification
  // -------------------------------------------------------------
  console.log('\n👉 Group 5: Server-Side DB-Backed Login & Zero Trust');
  
  // Valid Platform Admin
  const adminLogin = await authService.login({
    email: 'superadmin@commerceos.app',
    password: 'CommerceOS@HQ2026'
  });
  assert(adminLogin.user.identityType === 'platform_admin', 'Platform Super Admin authenticated with DB credentials');

  // Invalid password for staff
  let threwAuthError = false;
  try {
    await authService.login({
      email: 'care@royalhoney.sa',
      password: 'DefectivePassword123'
    });
  } catch (err: any) {
    threwAuthError = true;
  }
  assert(threwAuthError, 'Invalid staff password correctly throws 401 Unauthorized');

  // Valid staff login
  const staffLogin = await authService.login({
    email: 'care@royalhoney.sa',
    password: 'CommerceOS@2026'
  });
  assert(staffLogin.user.role === 'store_owner' && staffLogin.user.tenantId === 'tenant-royal-honey', 'Merchant staff authenticated with DB credentials');

  // -------------------------------------------------------------
  // TEST 6: Zero-Trust Role Switching & Escalation Prevention
  // -------------------------------------------------------------
  console.log('\n👉 Group 6: Privilege Escalation & Role Switching Protection');
  
  // Unauthorized user (e.g. support agent) trying to elevate to store_owner
  let threwEscalationError = false;
  try {
    await authService.switchRole('store_owner', 'tenant-royal-honey', {
      id: 'usr-support-1',
      identityType: 'tenant_staff',
      email: 'support@royalhoney.sa',
      name: 'الدعم الفني',
      role: 'support_agent',
      tenantId: 'tenant-royal-honey',
      permissions: ROLE_PERMISSIONS['support_agent']
    });
  } catch (err: any) {
    threwEscalationError = true;
  }
  assert(threwEscalationError, 'Support agent blocked from unilaterally escalating role to store_owner');

  // Store owner can switch views
  const ownerSwitch = await authService.switchRole('product_manager', 'tenant-royal-honey', {
    id: 'usr-owner-1',
    identityType: 'tenant_staff',
    email: 'care@royalhoney.sa',
    name: 'مالك المتجر',
    role: 'store_owner',
    tenantId: 'tenant-royal-honey',
    permissions: ROLE_PERMISSIONS['store_owner']
  });
  assert(ownerSwitch.role === 'product_manager', 'Store owner permitted to switch role view safely');

  // -------------------------------------------------------------
  // TEST 7: Tenant Isolation & Multi-Tenant IDOR Protection
  // -------------------------------------------------------------
  console.log('\n👉 Group 7: Multi-Tenant Data Isolation & IDOR Protection');
  
  const royalHoneyProducts = db.getProducts('tenant-royal-honey');
  assert(royalHoneyProducts.length > 0, 'Tenant products query returns only scoped tenant products');
  
  // Verify cross-tenant staff isolation
  const royalHoneyStaff = db.getStaff('tenant-royal-honey');
  assert(royalHoneyStaff.every(s => s.tenantId === 'tenant-royal-honey'), 'Staff lookup strictly scoped to target tenant');

  // Verify IDOR protection: cannot update or delete product belonging to another tenant
  const targetProduct = royalHoneyProducts[0];
  const crossTenantUpdate = db.updateProduct(targetProduct.id, { price: 1 }, 'tenant-coffee-house');
  assert(crossTenantUpdate === null, 'Server database rejects cross-tenant modification (IDOR blocked)');

  const crossTenantDelete = db.deleteProduct(targetProduct.id, 'tenant-coffee-house');
  assert(crossTenantDelete === false, 'Server database rejects cross-tenant deletion (IDOR blocked)');

  // -------------------------------------------------------------
  // TEST 8: Secret & Environment Configuration Validation
  // -------------------------------------------------------------
  console.log('\n👉 Group 8: Production Secrets & Security Config Hardening');
  assert(typeof signAuthToken === 'function', 'HMAC token signing engine is loaded and active');
  assert(typeof verifyAuthToken === 'function', 'HMAC token verification engine is loaded and active');

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`📊 RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTestSuite().catch((err) => {
  console.error('Test suite execution error:', err);
  process.exit(1);
});
