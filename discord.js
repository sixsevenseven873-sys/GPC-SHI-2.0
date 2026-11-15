// ดึงข้อมูลสาธารณะจาก Discord (ทำงานในตัวโปรแกรมหลัก จึงไม่ติดข้อจำกัด CORS ของเบราว์เซอร์)
const UA = 'DiscordBot (https://gpc.studio, 1.0)';
const API = 'https://discord.com/api/v10/';

async function call(path, headers) {
  try {
    const r = await fetch(API + path, { headers: Object.assign({ 'User-Agent': UA, 'Accept': 'application/json' }, headers || {}) });
    let json = null;
    try { json = await r.json(); } catch (e) { /* ไม่มีเนื้อหา */ }
    return { ok: r.ok, status: r.status, json: json };
  } catch (e) {
    return { ok: false, status: 0, error: String((e && e.message) || e) };
  }
}

// ข้อมูลเซิร์ฟเวอร์จากรหัสเชิญ (ไม่ต้องใช้ token)
function invite(code) {
  code = String(code || '');
  if (!/^[A-Za-z0-9-]{2,64}$/.test(code)) return Promise.resolve({ ok: false, status: 0, error: 'bad code' });
  return call('invites/' + code + '?with_counts=true&with_expiration=true');
}

// ข้อมูลโปรไฟล์ผู้ใช้จาก ID (ต้องใช้ Bot token ของผู้ใช้เอง ไม่เก็บและไม่บันทึกไว้ที่ไหน)
function user(id, token) {
  id = String(id || ''); token = String(token || '');
  if (!/^\d{15,21}$/.test(id)) return Promise.resolve({ ok: false, status: 0, error: 'bad id' });
  if (token.length < 20 || token.length > 200 || /\s/.test(token)) return Promise.resolve({ ok: false, status: 401, error: 'bad token' });
  return call('users/' + id, { 'Authorization': 'Bot ' + token });
}

module.exports = { invite, user };
