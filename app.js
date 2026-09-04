
const KEY="shk86_hrm_v2";
let session=JSON.parse(sessionStorage.getItem("shk86_session")||"null");
const state=JSON.parse(localStorage.getItem(KEY)||"null")||{
  role:"HR1", user:"Nguyễn Minh HR",
  accounts:[
    {id:"ACC001",username:"admin",name:"Quản trị SHK 86",role:"BGD",dept:"BGĐ",active:true,password:"SHK86@123"},
    {id:"ACC002",username:"hr1",name:"HR Kiểm duyệt",role:"HR1",dept:"HR",active:true,password:"SHK86@123"},
    {id:"ACC003",username:"hr2",name:"HR Báo cáo",role:"HR2",dept:"HR",active:true,password:"SHK86@123"},
    {id:"ACC004",username:"manager",name:"Trưởng bộ phận Demo",role:"MANAGER",dept:"MKT",active:true,password:"SHK86@123"},
    {id:"ACC005",username:"nv001",name:"Nguyễn Văn An",role:"EMP",dept:"MKT",employeeId:"NV001",active:true,password:"SHK86@123"}
  ],
  settings:{radius:50,grace:5,standardHours:8,otRules:{weekday:1.5,offday:2,holiday:3}},
  locations:[{id:"loc1",name:"SHK 86 - 186 Hồ Bún Xáng, Cần Thơ",lat:null,lng:null,radius:50,wifi:""}],
  employees:[
    {id:"NV001",name:"Nguyễn Văn An",dept:"MKT",sub:"MKT",salaryType:"month",base:18000000,allowance:2000000,kpi:0,ot:0,active:true,locations:["loc1"]},
    {id:"NV002",name:"Trần Thị Bình",dept:"Vận hành",sub:"Nhà hàng A",salaryType:"day",base:350000,allowance:500000,kpi:0,ot:0,active:true,locations:["loc1"]},
    {id:"NV003",name:"Lê Văn Cường",dept:"Bếp",sub:"Bếp",salaryType:"hour",base:35000,allowance:300000,kpi:0,ot:0,active:true,locations:["loc1"]}
  ],
  attendance:[],
  explanations:[],
  leave:[],
  payroll:{period:"01/09/2026 - 30/09/2026",closed:false}
};
const DEFAULT_LOCATIONS = [
 {id:"loc1", name:"1. Văn phòng SHK 86", lat:10.0305, lng:105.7725, radius:50, wifiSSID:"TANG 1", wifiPassword:"68686868", wifiGateway:"192.168.1.1"},
 {id:"loc2", name:"2. Ẩm Thực Sông Quê", lat:10.0320, lng:105.7740, radius:50, wifiSSID:"AmThucSongQue_86", wifiPassword:"SongQue@86123", wifiGateway:"192.168.2.1"},
 {id:"loc3", name:"3. Bờ Kè 86", lat:10.0290, lng:105.7710, radius:50, wifiSSID:"BoKe86_Guest", wifiPassword:"BoKe86@123456", wifiGateway:"192.168.3.1"},
 {id:"loc4", name:"4. Bờ Sông 86", lat:10.0340, lng:105.7760, radius:50, wifiSSID:"BoSong86_WiFi", wifiPassword:"BoSong86@8888", wifiGateway:"192.168.4.1"}
];

if(!state.locations || state.locations.length < 4 || state.locations[0].wifiSSID !== "TANG 1" || !state.locations[0].wifiGateway){
 state.locations = DEFAULT_LOCATIONS;
 save();
}

if(!state.departments){
 state.departments = [
  {id:"DEP001", code:"BGD", name:"Ban Giám Đốc", managerId:"ACC001", parentId:null, description:"Hội đồng Ban Giám Đốc điều hành"},
  {id:"DEP002", code:"HR", name:"Phòng Nhân Sự", managerId:"ACC002", parentId:"DEP001", description:"Quản lý nhân sự, công & lương"},
  {id:"DEP003", code:"MKT", name:"Phòng Marketing", managerId:"ACC004", parentId:"DEP001", description:"Truyền thông & thương hiệu"},
  {id:"DEP004", code:"VH", name:"Khối Vận Hành", managerId:null, parentId:"DEP001", description:"Quản lý vận hành chuỗi nhà hàng"},
  {id:"DEP005", code:"BEP", name:"Bộ Phận Bếp", managerId:null, parentId:"DEP004", description:"Chế biến & Quản lý thực đơn bếp"}
 ];
 save();
}

function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function currentAccount(){return state.accounts?.find(a=>a.id===session?.accountId)||null}

const DEFAULT_PERMISSIONS={
 BGD:["dashboard.view","attendance.view_all","employee.view_all","employee.manage","approval.view","approval.approve","leave.view_all","leave.approve","payroll.view_all","payroll.manage","report.view_all","settings.manage","account.manage","orgchart.manage"],
 HR1:["dashboard.view","attendance.view_all","employee.view_all","employee.manage","approval.view","approval.approve","leave.view_all","leave.approve","payroll.view_all","report.view_all","settings.manage"],
 HR2:["dashboard.view","attendance.view_all","employee.view_all","approval.view","leave.view_all","payroll.view_all","payroll.manage","report.view_all","report.export","account.view"],
 MANAGER:["dashboard.view","attendance.view_scope","approval.view","approval.approve","leave.view_scope","leave.approve","report.view_scope"],
 EMP:["dashboard.view_self","attendance.self","leave.self","payroll.view_self","approval.self"]
};

const ROLE_NAMES={BGD:"BGĐ",HR1:"HR Cấp 1",HR2:"HR Cấp 2",MANAGER:"Trưởng bộ phận",EMP:"Nhân sự"};
function getRoleNames(){ return { ...ROLE_NAMES, ...(state.customRoleNames || {}) }; }

function getPermissions(){ return state.permissions || DEFAULT_PERMISSIONS; }
function can(permission){
 const a=currentAccount();
 if(!a)return false;
 if(a.customPermissions && Array.isArray(a.customPermissions)){
  if(a.customPermissions.includes(permission)) return true;
 }
 return !!(getPermissions()[a.role]||[]).includes(permission);
}

const ALL_PERMISSIONS=[
 {key:"dashboard.view",label:"Xem Tổng quan hệ thống",cat:"Tổng quan"},
 {key:"dashboard.view_self",label:"Xem Tổng quan cá nhân",cat:"Tổng quan"},
 {key:"attendance.view_all",label:"Xem chấm công toàn công ty",cat:"Chấm công"},
 {key:"attendance.view_scope",label:"Xem chấm công phạm vi bộ phận",cat:"Chấm công"},
 {key:"attendance.self",label:"Chấm công cá nhân (GPS/Selfie)",cat:"Chấm công"},
 {key:"employee.view_all",label:"Xem danh sách nhân sự",cat:"Quản lý nhân sự"},
 {key:"employee.manage",label:"Thêm / Sửa / Khóa nhân sự",cat:"Quản lý nhân sự"},
 {key:"approval.view",label:"Xem danh sách giải trình",cat:"Giải trình & duyệt"},
 {key:"approval.approve",label:"Phê duyệt đơn giải trình công",cat:"Giải trình & duyệt"},
 {key:"approval.self",label:"Tạo giải trình cá nhân",cat:"Giải trình & duyệt"},
 {key:"leave.view_all",label:"Xem đơn nghỉ phép toàn công ty",cat:"Nghỉ phép"},
 {key:"leave.view_scope",label:"Xem đơn nghỉ phép bộ phận",cat:"Nghỉ phép"},
 {key:"leave.approve",label:"Duyệt đơn nghỉ phép",cat:"Nghỉ phép"},
 {key:"leave.self",label:"Tạo đơn nghỉ phép cá nhân",cat:"Nghỉ phép"},
 {key:"payroll.view_all",label:"Xem bảng lương toàn công ty",cat:"Tính lương"},
 {key:"payroll.manage",label:"Quản lý & chốt kỳ lương",cat:"Tính lương"},
 {key:"payroll.view_self",label:"Xem phiếu lương cá nhân",cat:"Tính lương"},
 {key:"report.view_all",label:"Xem báo cáo toàn công ty",cat:"Báo cáo"},
 {key:"report.view_scope",label:"Xem báo cáo phạm vi bộ phận",cat:"Báo cáo"},
 {key:"report.export",label:"Xuất dữ liệu báo cáo (CSV/JSON)",cat:"Báo cáo"},
 {key:"settings.manage",label:"Cấu hình quy định & địa điểm",cat:"Cấu hình"},
 {key:"account.manage",label:"Cấp & quản lý tài khoản",cat:"Tài khoản & Phân quyền"},
 {key:"account.view",label:"Xem danh sách tài khoản",cat:"Tài khoản & Phân quyền"},
 {key:"orgchart.manage",label:"Quản lý & setup sơ đồ tổ chức",cat:"Tài khoản & Phân quyền"}
];
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function money(n){return new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND",maximumFractionDigits:0}).format(n||0)}
function fmtDate(d=new Date()){return new Intl.DateTimeFormat("vi-VN",{dateStyle:"medium"}).format(d)}
function fmtTime(d=new Date()){return new Intl.DateTimeFormat("vi-VN",{timeStyle:"medium"}).format(d)}
function dist(a,b,c,d){
  const R=6371000, p=Math.PI/180, x=(c-a)*p, y=(d-b)*p;
  const h=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
function toast(msg,type="ok"){const e=document.createElement("div");e.className="toast "+type;e.textContent=msg;document.body.appendChild(e);setTimeout(()=>e.remove(),2600)}

function changePasswordModal(account, onSuccess){
 const html = `<div class="modal"><div class="modalbox">
  <div class="panelhead"><h3>🔐 Đổi mật khẩu lần đầu đăng nhập</h3></div>
  <div class="note" style="background:#fff3cd;border-color:#ffeeba;color:#856404;margin-bottom:12px">
   <b>⚠️ Yêu cầu bảo mật:</b> Tài khoản <b>${esc(account.username)}</b> đang sử dụng mật khẩu ban đầu. Bạn phải đổi mật khẩu mới để đăng nhập hệ thống.
  </div>
  <label>Mật khẩu mới<input id="newPassInput" type="password" placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)" required></label>
  <label>Xác nhận mật khẩu mới<input id="confirmPassInput" type="password" placeholder="Nhập lại mật khẩu mới" required></label>
  <button class="primary full" id="saveFirstPassBtn" style="margin-top:12px">Cập nhật mật khẩu & Đăng nhập</button>
 </div></div>`;

 document.body.insertAdjacentHTML("beforeend", html);
 document.getElementById("saveFirstPassBtn").onclick = () => {
  const newP = document.getElementById("newPassInput").value.trim();
  const confP = document.getElementById("confirmPassInput").value.trim();

  if(!newP || newP.length < 6){
   toast("Mật khẩu mới phải từ 6 ký tự trở lên.", "bad");
   return;
  }
  if(newP === "SHK86@123"){
   toast("Mật khẩu mới không được trùng với mật khẩu ban đầu.", "bad");
   return;
  }
  if(newP !== confP){
   toast("Mật khẩu xác nhận không trùng khớp.", "bad");
   return;
  }

  account.password = newP;
  account.mustChangePassword = false;
  save();
  document.querySelector(".modal").remove();
  toast("Đã đổi mật khẩu thành công!");
  if(onSuccess) onSuccess();
 };
}

function renderLogin(){
 document.getElementById("app").innerHTML=`<div class="login-page">
  <div class="login-card">
   <div class="login-brand"><img src="${window.SHK_LOGO}"><div><b>SHK 86</b><span>HRM • ATTENDANCE & PAYROLL</span></div></div>
   <h1>Đăng nhập hệ thống</h1>
   <p class="login-sub">Quản lý chấm công, phê duyệt và tiền lương</p>
   <form id="loginForm" autocomplete="off">
    <label>Tên đăng nhập<input id="loginUser" autocomplete="off" placeholder="Nhập tên đăng nhập" required></label>
    <label>Mật khẩu<input id="loginPass" type="password" autocomplete="new-password" placeholder="Nhập mật khẩu" required></label>
    <button class="primary login-btn">Đăng nhập</button>
   </form>
   <div style="margin-top:20px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:12px;color:var(--muted);text-align:center;line-height:1.6">
    <div>📍 <b>Địa chỉ:</b> 186 Hồ Bún Xáng, Cần Thơ</div>
    <div>📞 <b>Hotline:</b> 0932 454 245</div>
    <div style="margin-top:6px;font-weight:600;color:#0b3c91">© Bản quyền thuộc về SHK 86</div>
   </div>
  </div>
 </div>`;
 document.getElementById("loginForm").onsubmit=e=>{
  e.preventDefault();
  const u=document.getElementById("loginUser").value.trim(), p=document.getElementById("loginPass").value;
  const a=state.accounts.find(x=>x.username.toLowerCase()===u.toLowerCase()&&x.password===p&&x.active);
  if(!a){toast("Sai tài khoản/mật khẩu hoặc tài khoản đã khóa.","bad");return}

  const completeLogin = () => {
   session={accountId:a.id,loginAt:new Date().toISOString()};
   sessionStorage.setItem("shk86_session",JSON.stringify(session));
   state.role=a.role; state.user=a.name; save(); render();
  };

  const isAdmin = a.username.toLowerCase() === "admin" || a.role === "BGD";
  if(!isAdmin && (a.mustChangePassword || p === "SHK86@123")){
   changePasswordModal(a, completeLogin);
  } else {
   completeLogin();
  }
 };
}

function departmentModal(existing=null){
 const nextId = "DEP" + String((state.departments||[]).length + 1).padStart(3, "0");
 const d = existing || {id:nextId, code:"", name:"", managerId:"", parentId:"", description:""};
 const html = `<div class="modal"><div class="modalbox"><div class="panelhead"><h3>${existing?"Chỉnh sửa":"Thêm mới"} bộ phận / phòng ban</h3><button class="closeModal">×</button></div>
 <label>Mã bộ phận<input id="deptCode" value="${esc(d.code)}" placeholder="Ví dụ: MKT, HR, BEP"></label>
 <label>Tên phòng ban / bộ phận<input id="deptName" value="${esc(d.name)}" placeholder="Ví dụ: Phòng Marketing"></label>
 <label>Trưởng bộ phận phụ trách
   <select id="deptManager">
     <option value="">-- Chưa phân công --</option>
     ${state.accounts.map(a => `<option value="${a.id}" ${d.managerId === a.id ? "selected" : ""}>${esc(a.name)} (${esc(a.username)} - ${ROLE_NAMES[a.role]||a.role})</option>`).join("")}
   </select>
 </label>
 <label>Bộ phận cấp trên
   <select id="deptParent">
     <option value="">-- Cấp cao nhất (Root) --</option>
     ${(state.departments||[]).filter(x => !existing || x.id !== existing.id).map(x => `<option value="${x.id}" ${d.parentId === x.id ? "selected" : ""}>${esc(x.name)} (${esc(x.code)})</option>`).join("")}
   </select>
 </label>
 <label>Mô tả chức năng<input id="deptDesc" value="${esc(d.description||"")}" placeholder="Nhập ghi chú hoặc nhiệm vụ phòng ban"></label>
 <button class="primary full" id="saveDeptBtn">${existing ? "Lưu thay đổi" : "Tạo bộ phận"}</button></div></div>`;

 document.body.insertAdjacentHTML("beforeend", html);
 document.querySelector(".closeModal").onclick = () => document.querySelector(".modal").remove();
 document.getElementById("saveDeptBtn").onclick = () => {
  const code = document.getElementById("deptCode").value.trim().toUpperCase();
  const name = document.getElementById("deptName").value.trim();
  const managerId = document.getElementById("deptManager").value;
  const parentId = document.getElementById("deptParent").value || null;
  const description = document.getElementById("deptDesc").value.trim();

  if (!code || !name) {
   toast("Vui lòng nhập đủ mã và tên bộ phận.", "bad");
   return;
  }

  if (existing) {
   Object.assign(existing, { code, name, managerId, parentId, description });
  } else {
   if ((state.departments||[]).some(x => x.code.toLowerCase() === code.toLowerCase())) {
    toast("Mã bộ phận đã tồn tại.", "bad");
    return;
   }
   state.departments.push({ id: d.id, code, name, managerId, parentId, description });
  }

  save();
  document.querySelector(".modal").remove();
  showPage("accounts");
  toast(existing ? "Đã cập nhật phòng ban." : "Đã thêm bộ phận mới thành công.");
 };
}

function renderOrgTree(depts) {
 if (!depts || !depts.length) return `<div class="empty">Chưa có sơ đồ tổ chức.</div>`;
 const rootDepts = depts.filter(d => !d.parentId);

 function renderNode(d, isRoot = false) {
  const manager = state.accounts.find(a => a.id === d.managerId);
  const managerName = manager ? manager.name : "Chưa phân công";
  const empCount = state.employees.filter(e => 
   e.dept === d.code || e.dept === d.name || e.sub === d.name
  ).length;
  const canManage = can("account.manage") || can("orgchart.manage");
  const children = depts.filter(c => c.parentId === d.id);

  return `<div class="org-branch">
   <div class="org-node-card ${isRoot ? "root" : "sub"}">
    <span class="code">${esc(d.code)}</span>
    <h4>${esc(d.name)}</h4>
    <div class="manager">👤 Trưởng BP: <b>${esc(managerName)}</b></div>
    <span class="emp-cnt">${empCount} nhân sự</span>
    ${canManage ? `<div class="org-node-actions">
      <button class="small outline editDeptBtn" data-id="${d.id}">Sửa</button>
      ${!isRoot ? `<button class="small outline delDeptBtn" data-id="${d.id}">Xóa</button>` : ""}
    </div>` : ""}
   </div>
   ${children.length ? `<div class="org-children">${children.map(c => renderNode(c, false)).join("")}</div>` : ""}
  </div>`;
 }

 return `<div class="org-tree">${rootDepts.map(r => renderNode(r, true)).join("")}</div>`;
}

function customRoleModal(){
 const html = `<div class="modal"><div class="modalbox">
  <div class="panelhead"><h3>+ Thêm vai trò mới</h3><button class="closeModal">×</button></div>
  <label>Mã vai trò (Viết hoa không dấu, VD: KETOAN, TO_TRUONG)<input id="newRoleCode" placeholder="VD: KETOAN"></label>
  <label>Tên vai trò hiển thị<input id="newRoleName" placeholder="VD: Kế toán công nợ"></label>
  <button class="primary full" id="saveCustomRoleBtn" style="margin-top:12px">Tạo vai trò</button>
 </div></div>`;

 document.body.insertAdjacentHTML("beforeend", html);
 document.querySelector(".closeModal").onclick = () => document.querySelector(".modal").remove();
 document.getElementById("saveCustomRoleBtn").onclick = () => {
  const code = document.getElementById("newRoleCode").value.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "");
  const name = document.getElementById("newRoleName").value.trim();

  if(!code || !name){ toast("Vui lòng nhập đủ mã và tên vai trò.", "bad"); return; }
  if(getRoleNames()[code]){ toast("Mã vai trò này đã tồn tại.", "bad"); return; }

  if(!state.customRoleNames) state.customRoleNames = {};
  state.customRoleNames[code] = name;

  if(!state.permissions) state.permissions = { ...DEFAULT_PERMISSIONS };
  if(!state.permissions[code]) state.permissions[code] = ["dashboard.view_self"];

  save();
  document.querySelector(".modal").remove();
  showPage("accounts");
  toast(`✅ Đã thêm vai trò mới "${name}" (${code})!`);
 };
}

function userPermissionModal(account){
 const roleMap = getRoleNames();
 const currentRolePerms = getPermissions()[account.role] || [];
 const customPerms = account.customPermissions || [];

 const categories = {};
 ALL_PERMISSIONS.forEach(p => {
  if (!categories[p.cat]) categories[p.cat] = [];
  categories[p.cat].push(p);
 });

 const html = `<div class="modal"><div class="modalbox" style="max-width:650px">
  <div class="panelhead">
   <div>
    <h3>⚡ Phân quyền riêng cho nhân sự</h3>
    <div style="font-size:13px;color:var(--muted);margin-top:2px">
     Nhân sự: <b>${esc(account.name)}</b> (${esc(account.username)}) • Vai trò: <span class="tag blue">${esc(roleMap[account.role]||account.role)}</span>
    </div>
   </div>
   <button class="closeModal">×</button>
  </div>
  
  <div class="note" style="background:#eef6ff;border-color:#b6d4fe;color:#1c4080;margin-bottom:12px;font-size:12px">
   <b>💡 Phân quyền tùy chỉnh cá nhân:</b> Bật/tắt các quyền cụ thể cấp riêng cho nhân sự này mà không làm ảnh hưởng đến Vai trò chung.
  </div>

  <div style="max-height:360px;overflow-y:auto;padding-right:6px">
   ${Object.entries(categories).map(([cat, list]) => `
    <div style="margin-bottom:12px">
     <div style="font-weight:bold;color:#0b3c91;font-size:13px;padding:4px 0;border-bottom:1px solid #e0e0e0;margin-bottom:6px">${esc(cat)}</div>
     <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
      ${list.map(p => {
       const isRolePerm = currentRolePerms.includes(p.key);
       const isChecked = customPerms.includes(p.key) || isRolePerm;
       return `<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;background:#f8f9fa;padding:6px;border-radius:4px;border:1px solid #eee">
        <input type="checkbox" class="user-perm-cb" data-key="${p.key}" ${isChecked ? "checked" : ""}>
        <div>
         <b>${esc(p.label)}</b>
         ${isRolePerm ? `<span style="color:#0b3c91;font-size:10px;display:block">(Gốc Vai trò)</span>` : `<span style="color:#28a745;font-size:10px;display:block">(Quyền riêng)</span>`}
        </div>
       </label>`;
      }).join("")}
     </div>
    </div>
   `).join("")}
  </div>

  <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center">
   <button class="small outline" id="resetToRoleBtn">🔄 Đặt lại theo Vai trò gốc</button>
   <button class="primary" id="saveUserPermsBtn">✅ Lưu phân quyền riêng</button>
  </div>
 </div></div>`;

 document.body.insertAdjacentHTML("beforeend", html);
 document.querySelector(".closeModal").onclick = () => document.querySelector(".modal").remove();

 document.getElementById("resetToRoleBtn").onclick = () => {
  document.querySelectorAll(".user-perm-cb").forEach(cb => {
   cb.checked = currentRolePerms.includes(cb.dataset.key);
  });
  toast("Đã đặt lại các quyền theo Vai trò gốc.");
 };

 document.getElementById("saveUserPermsBtn").onclick = () => {
  const selectedKeys = [];
  document.querySelectorAll(".user-perm-cb:checked").forEach(cb => {
   selectedKeys.push(cb.dataset.key);
  });

  account.customPermissions = selectedKeys;
  save();
  document.querySelector(".modal").remove();
  showPage("accounts");
  toast(`✅ Đã lưu phân quyền riêng cho nhân sự ${account.name}!`);
 };
}

function renderPermissionMatrix() {
 const permsObj = getPermissions();
 const roleMap = getRoleNames();
 const roles = Object.keys(roleMap);
 const canManage = can("account.manage") || can("orgchart.manage");

 const categories = {};
 ALL_PERMISSIONS.forEach(p => {
  if (!categories[p.cat]) categories[p.cat] = [];
  categories[p.cat].push(p);
 });

 let rowsHtml = "";
 Object.entries(categories).forEach(([cat, list]) => {
  rowsHtml += `<tr><td colspan="${roles.length + 2}" class="cat-header">${esc(cat)}</td></tr>`;
  list.forEach(p => {
   rowsHtml += `<tr>
    <td><b>${esc(p.label)}</b></td>
    <td><small style="color:var(--muted)">${esc(p.key)}</small></td>
    ${roles.map(r => {
     const hasPerm = (permsObj[r] || []).includes(p.key);
     return `<td>
      <input type="checkbox" class="perm-cb" data-role="${r}" data-key="${p.key}" ${hasPerm ? "checked" : ""} ${canManage ? "" : "disabled"}>
     </td>`;
    }).join("")}
   </tr>`;
  });
 });

 return `<div class="panel">
  <div class="panelhead">
   <div>
    <h3>Ma trận phân quyền hệ thống & Vai trò</h3>
    <small style="color:var(--muted)">Ban Giám Đốc / Admin có quyền thiết lập ma trận vai trò và bổ sung vai trò mới.</small>
   </div>
   ${canManage ? `<div style="display:flex;gap:8px">
    <button class="outline" id="addRoleBtn">+ Thêm vai trò mới</button>
    <button class="primary" id="savePermsBtn">Lưu ma trận phân quyền</button>
    <button class="outline" id="resetPermsBtn">Khôi phục mặc định</button>
   </div>` : ""}
  </div>
  <div style="overflow-x:auto">
   <table class="perm-matrix-table">
    <thead>
     <tr>
      <th>Quyền hạn</th>
      <th>Mã quyền</th>
      ${roles.map(r => `<th><span class="tag blue">${esc(roleMap[r])}</span></th>`).join("")}
     </tr>
    </thead>
    <tbody>
     ${rowsHtml}
    </tbody>
   </table>
  </div>
 </div>`;
}

function accounts(){
 if(!can("account.manage") && !can("account.view") && !can("orgchart.manage")) return `<div class="panel"><h3>Không có quyền truy cập</h3><p>Bạn không có quyền quản lý tài khoản hoặc sơ đồ tổ chức.</p></div>`;
 const manage = can("account.manage") || can("orgchart.manage");
 const activeTab = window._currentAccTab || "accounts";

 const navTabs = `<div class="tab-container">
  <button class="tab-btn ${activeTab==="accounts"?"active":""}" data-tab="accounts">👥 Quản lý tài khoản (${state.accounts.length})</button>
  <button class="tab-btn ${activeTab==="orgchart"?"active":""}" data-tab="orgchart">🌳 Sơ đồ tổ chức (${(state.departments||[]).length} bộ phận)</button>
  <button class="tab-btn ${activeTab==="permissions"?"active":""}" data-tab="permissions">⚙️ Setup Ma trận phân quyền</button>
 </div>`;

 if(activeTab === "orgchart") {
  return navTabs + `
  <div class="toolbar">
   <div><span class="tag blue">Sơ đồ tổ chức • ${(state.departments||[]).length} bộ phận</span></div>
   ${manage ? `<button class="primary" id="addDept">+ Thêm bộ phận mới</button>` : ""}
  </div>
  <div class="panel">
   <div class="panelhead"><h3>Sơ đồ hình cây tổ chức (Org Tree)</h3><span class="tag green">Cấu trúc phân cấp</span></div>
   <div class="org-chart-wrapper">
    ${renderOrgTree(state.departments || [])}
   </div>
  </div>
  <div class="panel">
   <div class="panelhead"><h3>Bảng danh sách bộ phận / phòng ban</h3></div>
   <table><thead><tr><th>Mã</th><th>Tên phòng ban</th><th>Trưởng bộ phận</th><th>Cấp trên</th><th>Số nhân sự</th><th>Mô tả</th>${manage?"<th>Thao tác</th>":""}</tr></thead><tbody>
   ${(state.departments||[]).map(d => {
    const mgr = state.accounts.find(a => a.id === d.managerId);
    const parent = (state.departments||[]).find(p => p.id === d.parentId);
    const cnt = state.employees.filter(e => e.dept === d.code || e.dept === d.name || e.sub === d.name).length;
    return `<tr>
     <td><b>${esc(d.code)}</b></td>
     <td><b>${esc(d.name)}</b></td>
     <td>${mgr ? esc(mgr.name) : '<span style="color:var(--muted)">Chưa phân công</span>'}</td>
     <td>${parent ? esc(parent.name) : '<span class="tag blue">Cấp cao nhất</span>'}</td>
     <td><span class="tag green">${cnt} người</span></td>
     <td>${esc(d.description || "—")}</td>
     ${manage ? `<td><button class="small outline editDeptBtn" data-id="${d.id}">Sửa</button> <button class="small outline delDeptBtn" data-id="${d.id}">Xóa</button></td>` : ""}
    </tr>`;
   }).join("")}
   </tbody></table>
  </div>`;
 }

 if(activeTab === "permissions") {
  return navTabs + renderPermissionMatrix();
 }

 return navTabs + `<div class="toolbar"><div><span class="tag blue">RBAC • ${state.accounts.length} tài khoản</span></div>${manage?`<button class="primary" id="addAccount">+ Cấp tài khoản</button>`:""}</div>
 <div class="panel"><div class="panelhead"><h3>Danh sách tài khoản & Phân quyền cá nhân</h3><span class="tag">Quản lý phân cấp vai trò & quyền riêng</span></div>
 <table><thead><tr><th>Tài khoản</th><th>Người dùng</th><th>Vai trò</th><th>Phạm vi</th><th>Trạng thái</th><th>Quyền hạn</th>${manage?"<th>Thao tác</th>":""}</tr></thead><tbody>
 ${state.accounts.map(a => {
  const roleName = getRoleNames()[a.role] || a.role;
  const permCount = a.customPermissions ? a.customPermissions.length : (getPermissions()[a.role]||[]).length;
  const isCustom = !!(a.customPermissions && a.customPermissions.length);
  return `<tr>
   <td><b>${esc(a.username)}</b></td>
   <td>${esc(a.name)}</td>
   <td><span class="tag blue">${esc(roleName)}</span></td>
   <td>${esc(a.dept||"Toàn công ty")}</td>
   <td><span class="tag ${a.active?"green":"red"}">${a.active?"Hoạt động":"Đã khóa"}</span></td>
   <td>${permCount} quyền ${isCustom ? `<span class="tag orange">Riêng</span>` : `<span class="tag gray">Vai trò</span>`}</td>
   ${manage ? `<td>
    <button class="small outline editAccount" data-id="${a.id}">Sửa</button>
    <button class="small outline userPermsBtn" data-id="${a.id}">⚡ Quyền riêng</button>
    <button class="small ${a.active?"outline":"primary"} toggleAccount" data-id="${a.id}">${a.active?"Khóa":"Mở khóa"}</button>
   </td>` : ""}
  </tr>`;
 }).join("")}</tbody></table></div>
 <div class="two"><div class="panel"><div class="panelhead"><h3>Tóm tắt vai trò</h3></div>${Object.entries(getPermissions()).map(([r,ps])=>`<div class="permrole"><b>${esc(getRoleNames()[r]||r)}</b><span>${ps.length} quyền mặc định</span></div>`).join("")}</div>
 <div class="panel"><div class="panelhead"><h3>Nguyên tắc phân quyền</h3></div><ul class="rules"><li><b>BGĐ:</b> Admin hệ thống, setup sơ đồ tổ chức & ma trận phân quyền.</li><li><b>HR Cấp 1:</b> kiểm duyệt công và xử lý bất thường.</li><li><b>HR Cấp 2:</b> payroll, chốt dữ liệu, báo cáo.</li><li><b>Trưởng bộ phận:</b> chỉ phạm vi bộ phận phụ trách.</li><li><b>Nhân sự:</b> chỉ dữ liệu cá nhân.</li><li><b>Quyền riêng:</b> Phân cấp riêng cho từng nhân sự ghi đè vai trò mặc định.</li></ul></div></div>`;
}

function getAvailableDepts(){
 const set = new Set(["Toàn công ty", "BGĐ", "HR", "MKT", "VH", "BEP", "Vận hành", "Nhà hàng A", "Bếp"]);
 (state.departments||[]).forEach(d => {
  if(d.name) set.add(d.name);
  if(d.code) set.add(d.code);
 });
 (state.employees||[]).forEach(e => {
  if(e.dept) set.add(e.dept);
 });
 return Array.from(set);
}

function getAvailableSubs(){
 const set = new Set(["MKT", "Nhà hàng A", "Nhà hàng B", "Bếp", "Vận hành", "HR", "BGĐ"]);
 (state.departments||[]).forEach(d => {
  if(d.name) set.add(d.name);
  if(d.code) set.add(d.code);
 });
 (state.employees||[]).forEach(e => {
  if(e.sub) set.add(e.sub);
 });
 return Array.from(set);
}

function accountModal(existing=null){
 const a=existing||{username:"",name:"",role:"EMP",dept:"",password:"SHK86@123",active:true};
 const roleMap = getRoleNames();
 const availableDepts = getAvailableDepts();
 if(a.dept && !availableDepts.includes(a.dept)) availableDepts.push(a.dept);

 const html=`<div class="modal"><div class="modalbox"><div class="panelhead"><h3>${existing?"Chỉnh sửa":"Cấp"} tài khoản</h3><button class="closeModal">×</button></div>
 <label>Tên đăng nhập<input id="accUser" value="${esc(a.username)}" ${existing?"disabled":""}></label>
 <label>Họ tên<input id="accName" value="${esc(a.name)}"></label>
 <label>Vai trò hệ thống<select id="accRole">${Object.entries(roleMap).map(([k,v])=>`<option value="${k}" ${a.role===k?"selected":""}>${esc(v)} (${k})</option>`).join("")}</select></label>
 <label>Bộ phận / Phạm vi
  <select id="accDeptSelect">
    ${availableDepts.map(d => `<option value="${esc(d)}" ${a.dept===d?"selected":""}>${esc(d)}</option>`).join("")}
    <option value="__custom__">+ Thêm bộ phận/phạm vi mới...</option>
  </select>
  <input id="accDeptCustom" placeholder="Nhập tên bộ phận/phạm vi mới" style="display:none;margin-top:4px">
 </label>
 <label>Mật khẩu<input id="accPass" type="password" value="${esc(a.password||"")}"></label>
 <button class="primary full" id="saveAccount">${existing?"Lưu thay đổi":"Tạo tài khoản"}</button></div></div>`;
 
 document.body.insertAdjacentHTML("beforeend",html);
 document.querySelector(".closeModal").onclick=()=>document.querySelector(".modal").remove();

 const deptSelEl = document.getElementById("accDeptSelect");
 const deptCustEl = document.getElementById("accDeptCustom");
 deptSelEl.onchange = () => {
  deptCustEl.style.display = deptSelEl.value === "__custom__" ? "block" : "none";
  if(deptSelEl.value === "__custom__") deptCustEl.focus();
 };

 document.getElementById("saveAccount").onclick=()=>{
  const username=document.getElementById("accUser").value.trim(), name=document.getElementById("accName").value.trim(), role=document.getElementById("accRole").value;
  const rawDept = deptSelEl.value === "__custom__" ? deptCustEl.value.trim() : deptSelEl.value;
  const dept = rawDept || "Toàn công ty";
  const password=document.getElementById("accPass").value;

  if(!username||!name||!password){toast("Vui lòng nhập đủ tài khoản, họ tên và mật khẩu.","bad");return}
  if(existing){Object.assign(existing,{name,role,dept,password});}
  else {if(state.accounts.some(x=>x.username.toLowerCase()===username.toLowerCase())){toast("Tên đăng nhập đã tồn tại.","bad");return} state.accounts.push({id:"ACC"+String(Date.now()).slice(-8),username,name,role,dept,password,active:true});}
  save();document.querySelector(".modal").remove();showPage("accounts");toast(existing?"Đã cập nhật tài khoản.":"Đã cấp tài khoản.");
 };
}

function employeeModal(existing=null){
 const nextId = "NV" + String(state.employees.length + 1).padStart(3, "0");
 const e = existing || {id:nextId, name:"", dept:"MKT", sub:"MKT", salaryType:"month", base:10000000, allowance:0, active:true};
 
 const availableDepts = getAvailableDepts();
 if(e.dept && !availableDepts.includes(e.dept)) availableDepts.push(e.dept);

 const availableSubs = getAvailableSubs();
 if(e.sub && !availableSubs.includes(e.sub)) availableSubs.push(e.sub);

 const html = `<div class="modal"><div class="modalbox"><div class="panelhead"><h3>${existing?"Chỉnh sửa":"Thêm mới"} nhân sự</h3><button class="closeModal">×</button></div>
 <label>Mã nhân sự<input id="empId" value="${esc(e.id)}" ${existing?"disabled":""}></label>
 <label>Họ và tên<input id="empName" value="${esc(e.name)}" placeholder="Nhập họ tên nhân sự"></label>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
   <label>Bộ phận chính
     <select id="empDeptSelect">
       ${availableDepts.map(d => `<option value="${esc(d)}" ${e.dept===d?"selected":""}>${esc(d)}</option>`).join("")}
       <option value="__custom__">+ Thêm bộ phận mới...</option>
     </select>
     <input id="empDeptCustom" placeholder="Nhập tên bộ phận mới" style="display:none;margin-top:4px">
   </label>
   <label>Phân khu / Bộ phận phụ
     <select id="empSubSelect">
       ${availableSubs.map(s => `<option value="${esc(s)}" ${e.sub===s?"selected":""}>${esc(s)}</option>`).join("")}
       <option value="__custom__">+ Thêm phân khu mới...</option>
     </select>
     <input id="empSubCustom" placeholder="Nhập tên phân khu mới" style="display:none;margin-top:4px">
   </label>
 </div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
   <label>Hình thức lương
     <select id="empSalaryType">
       <option value="month" ${e.salaryType==="month"?"selected":""}>Tháng</option>
       <option value="day" ${e.salaryType==="day"?"selected":""}>Ngày</option>
       <option value="hour" ${e.salaryType==="hour"?"selected":""}>Giờ</option>
     </select>
   </label>
   <label>Lương cơ bản / Đơn giá (VND)<input id="empBase" type="number" value="${e.base||0}"></label>
 </div>
 <label>Phụ cấp (VND)<input id="empAllowance" type="number" value="${e.allowance||0}"></label>
 <button class="primary full" id="saveEmp">${existing?"Lưu thay đổi":"Tạo nhân sự"}</button></div></div>`;

 document.body.insertAdjacentHTML("beforeend", html);
 document.querySelector(".closeModal").onclick = () => document.querySelector(".modal").remove();

 const deptSelEl = document.getElementById("empDeptSelect");
 const deptCustEl = document.getElementById("empDeptCustom");
 deptSelEl.onchange = () => {
  deptCustEl.style.display = deptSelEl.value === "__custom__" ? "block" : "none";
  if(deptSelEl.value === "__custom__") deptCustEl.focus();
 };

 const subSelEl = document.getElementById("empSubSelect");
 const subCustEl = document.getElementById("empSubCustom");
 subSelEl.onchange = () => {
  subCustEl.style.display = subSelEl.value === "__custom__" ? "block" : "none";
  if(subSelEl.value === "__custom__") subCustEl.focus();
 };

 document.getElementById("saveEmp").onclick = () => {
  const id = document.getElementById("empId").value.trim();
  const name = document.getElementById("empName").value.trim();
  
  const rawDept = deptSelEl.value === "__custom__" ? deptCustEl.value.trim() : deptSelEl.value;
  const dept = rawDept || "Toàn công ty";

  const rawSub = subSelEl.value === "__custom__" ? subCustEl.value.trim() : subSelEl.value;
  const sub = rawSub || dept;

  const salaryType = document.getElementById("empSalaryType").value;
  const base = Number(document.getElementById("empBase").value) || 0;
  const allowance = Number(document.getElementById("empAllowance").value) || 0;

  if (!id || !name) {
   toast("Vui lòng nhập đủ mã nhân sự và họ tên.", "bad");
   return;
  }

  if (existing) {
   Object.assign(existing, { name, dept, sub, salaryType, base, allowance });
  } else {
   if (state.employees.some(x => x.id.toLowerCase() === id.toLowerCase())) {
    toast("Mã nhân sự đã tồn tại trong hệ thống.", "bad");
    return;
   }
   state.employees.push({
    id, name, dept, sub, salaryType, base, allowance,
    kpi: 0, ot: 0, active: true, locations: ["loc1"]
   });

   // Tự động tạo tài khoản đăng nhập hệ thống cho nhân sự mới
   const empUsername = id.toLowerCase();
   if (!state.accounts.some(a => a.username.toLowerCase() === empUsername)) {
    state.accounts.push({
     id: "ACC" + String(Date.now()).slice(-6),
     username: empUsername,
     name: name,
     role: "EMP",
     dept: dept,
     employeeId: id,
     active: true,
     password: "SHK86@123",
     mustChangePassword: true
    });
   }
  }

  save();
  document.querySelector(".modal").remove();
  showPage("employees");
  toast(existing ? "Đã cập nhật nhân sự." : `Đã thêm nhân sự thành công. TK mặc định: "${id.toLowerCase()}" / MK: SHK86@123`);
 };
}

function roleLabel(){return ROLE_NAMES[state.role]||state.role}
function navItems(){
 const common=[["dashboard","Tổng quan","▦"],["attendance","Chấm công","◷"],["employees","Nhân sự","♙"],["approvals","Giải trình & duyệt","✓"],["leave","Nghỉ phép","☷"],["payroll","Tính lương","₫"],["reports","Báo cáo","▤"],["accounts","Tổ chức & Phân quyền","♟"],["settings","Cấu hình","⚙"]];
 if(state.role==="EMP") return common.filter(x=>["dashboard","attendance","leave","payroll"].includes(x[0]));
 if(state.role==="MANAGER") return common.filter(x=>["dashboard","attendance","approvals","leave","reports"].includes(x[0]));
 if(state.role==="HR2") return common.filter(x=>["dashboard","attendance","employees","approvals","leave","payroll","reports","accounts"].includes(x[0]));
 return common;
}
function render(){
 if(!session){renderLogin();return}
 const a=currentAccount();
 state.role=a.role; state.user=a.name;
 document.getElementById("app").innerHTML=`<div class="shell">
 <aside class="side">
  <div class="brand"><img src="${window.SHK_LOGO}"><div><b>SHK 86</b><span>HRM • Attendance</span></div></div>
  <div class="rolebox"><small>Đang đăng nhập</small><strong>${esc(a.name)}</strong><span class="rolemini">${roleLabel()}</span><button class="logout" id="logout">Đăng xuất</button></div>
  <nav>${navItems().map((x,i)=>`<button class="nav ${i===0?"active":""}" data-page="${x[0]}"><i>${x[2]}</i>${x[1]}</button>`).join("")}</nav>
   <div class="sidefoot" style="font-size:11px;line-height:1.5;color:var(--muted)">
    <b style="color:var(--fg)">SHK 86 HRM</b><br>
    📍 186 Hồ Bún Xáng, Cần Thơ<br>
    📞 Hotline: 0932 454 245
    <div style="margin-top:4px;color:#0b3c91;font-weight:600;font-size:10px">Bản quyền thuộc về SHK 86</div>
   </div>
 </aside>
 <main class="main">
  <header><div><h1 id="title">Tổng quan</h1><p>${fmtDate()} • Hệ thống HRM SHK 86</p></div><div class="head-actions"><span class="sync">● Offline-first</span><button class="ghost" id="syncBtn">Đồng bộ</button></div></header>
  <section id="content"></section>
 </main>
 </div>`;
 document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
 document.getElementById("logout").onclick=()=>{sessionStorage.removeItem("shk86_session");session=null;render();};
 document.getElementById("syncBtn").onclick=()=>toast("Dữ liệu cục bộ đã sẵn sàng đồng bộ khi có mạng.");
 showPage("dashboard");
}
function roleLabelOf(r){return ({BGD:"BGĐ",HR1:"HR Cấp 1",HR2:"HR Cấp 2",MANAGER:"Trưởng bộ phận",EMP:"Nhân sự"})[r]}
function showPage(page){
 document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
 const titles={dashboard:"Tổng quan",attendance:"Chấm công",employees:"Nhân sự",approvals:"Giải trình & phê duyệt",leave:"Nghỉ phép",payroll:"Tính lương",reports:"Báo cáo",accounts:"Sơ đồ tổ chức & Phân quyền",settings:"Cấu hình HR"};
 document.getElementById("title").textContent=titles[page]||"SHK 86 HRM";
 const c=document.getElementById("content");
 c.innerHTML=({dashboard:dashboard,attendance,employees,approvals,leave,payroll,reports,accounts,settings}[page])();
 bind(page);
}
function card(label,value,sub=""){return `<div class="metric"><small>${label}</small><strong>${value}</strong><span>${sub}</span></div>`}
function dashboard(){
 const today=state.attendance.filter(a=>a.ts.slice(0,10)===new Date().toISOString().slice(0,10));
 const pending=state.explanations.filter(x=>x.status!=="approved").length;
 const totalHours=calcHours();
 return `<div class="hero"><div><span class="eyebrow">SHK 86 • ${roleLabel()}</span><h2>Quản lý công & lương<br><em>tập trung, minh bạch, có kiểm soát.</em></h2><p>GPS 50m • WiFi • Selfie • Offline sync • Phê duyệt đa cấp</p></div><div class="hero-logo"><img src="${window.SHK_LOGO}"></div></div>
 <div class="grid4">${card("Nhân sự",state.employees.length,"Đang quản lý")} ${card("Chấm hôm nay",today.length,"Sự kiện")} ${card("Chờ giải trình",pending,"Cần xử lý")} ${card("Tổng giờ ghi nhận",totalHours.toFixed(1)+"h","Dữ liệu hiện có")}</div>
 <div class="two"><div class="panel"><div class="panelhead"><h3>Trạng thái kiểm duyệt</h3><span class="tag blue">Workflow</span></div>
 ${approvalStats()}</div><div class="panel"><div class="panelhead"><h3>Quy tắc lõi</h3></div><ul class="rules"><li>Chuẩn <b>8h công/ngày</b></li><li>GPS trong bán kính <b>${state.settings.radius}m</b></li><li>Trễ từ <b>6 phút</b> trở lên</li><li>Selfie lưu để HR kiểm tra, <b>không nhận diện</b></li><li>OT và KPI <b>HR cấu hình</b></li></ul></div></div>`;
}
function approvalStats(){
 const all=state.explanations;
 return `<div class="progressrow"><span>Nhân sự gửi giải trình</span><b>${all.length}</b></div><div class="progressrow"><span>Chờ trưởng bộ phận</span><b>${all.filter(x=>x.status==="manager").length}</b></div><div class="progressrow"><span>Chờ HR Cấp 1</span><b>${all.filter(x=>x.status==="hr1").length}</b></div><div class="progressrow"><span>Đã duyệt</span><b>${all.filter(x=>x.status==="approved").length}</b></div>`;
}
async function testLiveNetworkPing() {
 const start = performance.now();
 try {
  await fetch("https://www.google.com/favicon.ico?_t=" + Date.now(), { mode: "no-cors", cache: "no-store" });
  const latency = Math.round(performance.now() - start);
  return { online: true, latency };
 } catch(e) {
  if (navigator.onLine) {
   return { online: true, latency: 15 };
  }
  return { online: false, latency: 0 };
 }
}

function getLocalIP() {
 return new Promise((resolve) => {
  try {
   const pc = new RTCPeerConnection({ iceServers: [] });
   pc.createDataChannel("");
   pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(() => resolve(null));
   pc.onicecandidate = (event) => {
    if (!event || !event.candidate) {
     resolve(null);
     return;
    }
    const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
    const match = ipRegex.exec(event.candidate.candidate);
    if (match) {
     const ip = match[1];
     if (ip !== "127.0.0.1" && !ip.startsWith("0.")) {
      resolve(ip);
      pc.close();
     }
    }
   };
   setTimeout(() => resolve(null), 1000);
  } catch(e) {
   resolve(null);
  }
 });
}

async function verifyVenueNetworkStrict(targetLoc) {
 const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
 
 if (conn?.type === "cellular") {
  return { valid: false, reason: `Thiết bị đang kết nối Mạng di động (4G/5G). Vui lòng tắt 4G và bắt đúng WiFi "${targetLoc.wifiSSID}" tại địa điểm!` };
 }

 const localIp = await getLocalIP();
 if (localIp && targetLoc.wifiGateway) {
  const expectedSubnet = targetLoc.wifiGateway.split(".").slice(0, 3).join(".");
  if (expectedSubnet && !localIp.startsWith(expectedSubnet)) {
   return { valid: false, reason: `Thiết bị đang truy cập mạng WiFi khác (IP nội bộ: ${localIp}, không thuộc dải IP ${expectedSubnet}.X của WiFi "${targetLoc.wifiSSID}").` };
  }
 }

 return { valid: true };
}

async function scanWifiModal(){
 const locPickEl = document.getElementById("locPick");
 const selectedId = locPickEl ? locPickEl.value : state.locations[0].id;
 const currentLoc = state.locations.find(l=>l.id===selectedId) || state.locations[0];

 const html = `<div class="modal"><div class="modalbox">
  <div class="panelhead">
   <h3>📶 Kiểm tra kết nối Internet & WiFi địa điểm</h3>
   <button class="closeModal">×</button>
  </div>
  <p style="font-size:13px;color:var(--muted);margin-bottom:10px">
   Danh sách Mạng WiFi quy định của 4 địa điểm làm việc. Nhập đúng mật khẩu WiFi để kết nối chấm công.
  </p>
  
  <div id="wifiDiagnosticBox" style="margin-bottom:12px">
   <div style="text-align:center;padding:16px;color:var(--muted)">
    <div style="font-size:24px;margin-bottom:4px">📡</div>
    Đang kiểm tra kết nối mạng Internet thực tế...
   </div>
  </div>

  <div style="font-weight:bold;margin-bottom:6px;font-size:13px">Danh sách 4 Mạng WiFi địa điểm:</div>
  <div class="wifi-venue-list" style="display:flex;flex-direction:column;gap:10px;max-height:260px;overflow-y:auto">
   ${state.locations.map(l => {
    const isTarget = l.id === currentLoc.id;
    return `<div class="wifi-venue-card note" style="margin:0;background:${isTarget ? "#eef6ff" : "#fff"};border-color:${isTarget ? "#b6d4fe" : "#dee2e6"};display:flex;flex-direction:column;gap:6px">
     <div style="display:flex;align-items:center;justify-content:space-between">
      <div>
       <b style="color:#0b3c91;font-size:15px">📶 Tên WiFi: ${esc(l.wifiSSID || "WiFi_DiaDiem")}</b>
       <div style="font-size:12px;color:#333;margin-top:2px">Địa điểm: <b>${esc(l.name)}</b></div>
      </div>
      <span class="tag ${isTarget?"blue":"gray"}" style="font-size:11px">${isTarget?"Địa điểm chọn":"Vị trí khác"}</span>
     </div>
     <div style="display:flex;gap:6px;align-items:center;margin-top:4px">
      <input type="password" class="wifiPassInput" data-id="${l.id}" placeholder="Nhập mật khẩu WiFi" autocomplete="off" style="flex:1;padding:6px 10px;font-size:13px">
      <button class="small ${isTarget ? "primary" : "dark"} connectWifiBtn" data-id="${l.id}" data-ssid="${esc(l.wifiSSID)}">
       Kết nối & Xác thực
      </button>
     </div>
    </div>`;
   }).join("")}
  </div>

  <button class="outline full" id="rescanNetBtn" style="margin-top:12px">🔄 Kiểm tra lại kết nối mạng Internet</button>
 </div></div>`;

 document.body.insertAdjacentHTML("beforeend", html);
 document.querySelector(".closeModal").onclick = () => document.querySelector(".modal").remove();

 const runDiagnostics = async () => {
  const box = document.getElementById("wifiDiagnosticBox");
  if(!box) return;
  box.innerHTML = `<div style="text-align:center;padding:12px;color:var(--muted)"><div style="font-size:18px;margin-bottom:4px">📡</div>Đang đọc địa chỉ IP thiết bị & đường truyền Internet...</div>`;
  
  const pingRes = await testLiveNetworkPing();
  const myLocalIp = await getLocalIP();
  const expectedSubnet = currentLoc.wifiGateway ? currentLoc.wifiGateway.split(".").slice(0, 3).join(".") : "192.168.1";

  if(pingRes.online){
   box.innerHTML = `
    <div class="note" style="background:#d4edda;border-color:#c3e6cb;color:#155724;margin-bottom:10px">
     <b>🟢 Đã kết nối Internet thực tế! (Ping: ~${pingRes.latency}ms)</b><br>
     - 💻 <b>IP thiết bị hiện tại:</b> <code style="background:#fff;padding:2px 6px;border-radius:4px;font-weight:bold;color:#0b3c91">${myLocalIp || "Đã kiểm tra Card Mạng"}</code><br>
     - 🏢 <b>Dải IP Router quy định (${esc(currentLoc.name)}):</b> <code>${expectedSubnet}.X</code> (Gateway: <code>${esc(currentLoc.wifiGateway||"192.168.1.1")}</code>)<br>
     - 📶 <b>Mạng WiFi quy định:</b> <b style="color:#0b3c91">${esc(currentLoc.wifiSSID)}</b>
    </div>`;
  } else {
   box.innerHTML = `
    <div class="note" style="background:#f8d7da;border-color:#f5c6cb;color:#721c24;margin-bottom:10px">
     <b>🔴 Mất kết nối Mạng / WiFi!</b><br>
     Vui lòng bật WiFi trên máy tính / điện thoại và kết nối Internet trước khi chấm công.
    </div>`;
  }
 };

 await runDiagnostics();
 document.getElementById("rescanNetBtn").onclick = runDiagnostics;

 document.querySelectorAll(".connectWifiBtn").forEach(btn => {
  btn.onclick = async () => {
   const locId = btn.dataset.id;
   const ssid = btn.dataset.ssid;
   const targetLoc = state.locations.find(l=>l.id===locId) || currentLoc;

   const passInput = document.querySelector(`.wifiPassInput[data-id="${locId}"]`);
   const enteredPass = passInput ? passInput.value.trim() : "";

   const pingRes = await testLiveNetworkPing();
   if(!pingRes.online){
    toast("Thiết bị chưa bật WiFi hoặc chưa kết nối Internet.", "bad");
    return;
   }

   if(!enteredPass){
    toast(`Vui lòng nhập mật khẩu cho WiFi "${ssid}"`, "bad");
    return;
   }

   if(enteredPass !== (targetLoc.wifiPassword || "")){
    toast(`❌ Mật khẩu WiFi "${ssid}" không đúng. Không thể chấp nhận mạng này.`, "bad");
    return;
   }

   const netCheck = await verifyVenueNetworkStrict(targetLoc);
   if(!netCheck.valid){
    toast(`❌ TỪ CHỐI CHẤM CÔNG: ${netCheck.reason}`, "bad");
    return;
   }

   if(locPickEl) locPickEl.value = locId;
   window._wifiVerified = true;
   window._verifiedSSID = targetLoc.wifiSSID;
   window._verifiedLocId = targetLoc.id;
   window._checkinMode = "WIFI";
   if(document.getElementById("wifiState")) document.getElementById("wifiState").textContent = "✓";
   if(document.getElementById("geoStatus")){
    document.getElementById("geoStatus").className = "tag green";
    document.getElementById("geoStatus").textContent = `WiFi Hợp lệ • ${ssid}`;
   }
   if(document.getElementById("placeText")){
    document.getElementById("placeText").textContent = `${targetLoc.name} • Đã xác thực đúng WiFi do Admin cài đặt (${ssid})`;
   }
   document.querySelector(".modal")?.remove();
   toast(`✅ Kết nối & xác thực thành công WiFi "${ssid}" chính thức của Admin!`);
  };
 });
}

function attendance(){
 const last=state.attendance.slice(-8).reverse();
 return `<div class="checkgrid"><div class="checkcard"><div class="checktop"><span class="eyebrow">CHẤM CÔNG NHÂN SỰ</span><span id="geoStatus" class="tag gray">Chưa kiểm tra</span></div><h2 id="clock">--:--:--</h2><p id="placeText">Hãy chọn địa điểm và xác thực vị trí (GPS hoặc WiFi).</p><div class="checkbuttons"><button class="primary" id="checkin">CHECK-IN</button><button class="dark" id="checkout">CHECK-OUT</button></div><div class="signals"><span>◉ GPS <b id="gpsState">—</b></span><span>📶 WiFi <b id="wifiState">—</b></span><span>📷 Selfie <b id="selfieState">—</b></span></div><button class="outline full" id="selfieBtn">Chụp selfie</button><video id="video" autoplay playsinline></video><canvas id="canvas" hidden></canvas></div>
 <div class="panel"><div class="panelhead"><h3>Địa điểm chấm công (${state.locations.length} điểm)</h3><span class="tag blue">GPS 50m / WiFi Fallback</span></div><label>Chọn vị trí làm việc<select id="locPick">${state.locations.map(l=>`<option value="${l.id}">${esc(l.name)}</option>`).join("")}</select></label><div class="locationbox" id="locationbox">Chưa xác thực vị trí.</div><button class="outline full" id="scanWifiBtn" style="margin-top:8px;margin-bottom:8px">🔍 Quét & Dò tìm WiFi địa điểm</button><div id="wifiFallbackBox"></div><div class="note"><b>💡 Cơ chế chấm công linh hoạt:</b><br>1. Hệ thống ưu tiên định vị GPS tự động trong bán kính 50m.<br>2. <b>Trường hợp không có tín hiệu GPS/lỗi định vị:</b> Tự động chuyển sang phương thức xác thực kết nối WiFi riêng của từng địa điểm (Văn phòng, Ẩm Thực Sông Quê, Bờ Kè 86, Bờ Sông 86).</div></div></div>
 <div class="panel"><div class="panelhead"><h3>Lịch sử chấm công gần đây</h3><span class="tag">${last.length} sự kiện</span></div><table><thead><tr><th>Thời gian</th><th>NV</th><th>Loại</th><th>Địa điểm</th><th>Phương thức</th><th>GPS / WiFi</th><th>Trạng thái</th></tr></thead><tbody>${last.map(a=>`<tr><td>${esc(a.time)}</td><td>${esc(a.emp)}</td><td><b>${a.type}</b></td><td>${esc(a.location)}</td><td><span class="tag ${a.method==="WIFI"?"orange":"blue"}">${a.method==="WIFI"?"📶 WiFi":"◉ GPS"}</span></td><td>${a.method==="WIFI"?esc(a.wifi||"—"):(a.distance==null?"—":a.distance.toFixed(1)+"m")}</td><td><span class="tag ${a.status==="valid"?"green":"red"}">${a.status==="valid"?"Hợp lệ":"Bất thường"}</span></td></tr>`).join("")||`<tr><td colspan="7" class="empty">Chưa có dữ liệu chấm công.</td></tr>`}</tbody></table></div>`;
}
let selfieData=null;
async function startCamera(){
 try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});const v=document.getElementById("video");v.srcObject=s;toast("Camera đã sẵn sàng.");}
 catch(e){toast("Không mở được camera. Hãy cấp quyền camera.","bad")}
}
function capture(){
 const v=document.getElementById("video"), c=document.getElementById("canvas");
 if(!v.videoWidth){toast("Hãy mở camera trước.","bad");return}
 c.width=v.videoWidth;c.height=v.videoHeight;c.getContext("2d").drawImage(v,0,0);
 selfieData=c.toDataURL("image/jpeg",.65);document.getElementById("selfieState").textContent="✓";toast("Đã chụp selfie.");
}
function doAttendance(type){
 const loc=state.locations.find(l=>l.id===document.getElementById("locPick").value) || state.locations[0];
 if(!selfieData){toast("Bắt buộc chụp selfie.","bad");return}
 
 if(window._checkinMode === "GPS"){
  if(!window._gps){toast("Chưa xác nhận vị trí GPS. Hãy kiểm tra định vị hoặc chuyển sang WiFi.","bad");return}
  if(window._gps.accuracy>20){toast("GPS Accuracy kém (>20m). Tự động chuyển qua WiFi.","bad");switchToWifiMode(loc,"Độ chính xác GPS kém.");return}
  if(window._gps.distance>(loc.radius||state.settings.radius)){toast(`Ngoài bán kính GPS ${loc.radius||state.settings.radius}m. Tự động chuyển qua WiFi.`,"bad");switchToWifiMode(loc,`Ngoài bán kính GPS (${window._gps.distance.toFixed(1)}m).`);return}
 } else if(window._checkinMode === "WIFI"){
  if(!window._wifiVerified || window._verifiedSSID !== loc.wifiSSID || window._verifiedLocId !== loc.id){
   toast(`❌ KHÔNG HỢP LỆ: Từ chối chấm công! Bạn bắt buộc phải kết nối ĐÚNG mạng WiFi "${loc.wifiSSID}" do Admin cài đặt cho địa điểm ${loc.name}.`, "bad");
   return;
  }
 } else {
  toast("Chưa xác thực vị trí (GPS hoặc WiFi).", "bad");
  return;
 }

 const d=new Date(), emp=state.employees[0];
 state.attendance.push({
  id:crypto.randomUUID(),
  emp:emp.name,
  empId:emp.id,
  type,
  ts:d.toISOString(),
  time:fmtTime(d),
  location:loc.name,
  distance:window._checkinMode==="GPS"?window._gps?.distance:null,
  accuracy:window._checkinMode==="GPS"?window._gps?.accuracy:null,
  method:window._checkinMode,
  wifi:loc.wifiSSID,
  selfie:selfieData,
  status:"valid"
 });

 save();
 selfieData=null;
 document.getElementById("selfieState").textContent="—";
 toast(`${type==="IN"?"Check-in":"Check-out"} thành công qua ${window._checkinMode==="GPS"?"GPS":"WiFi ("+loc.wifiSSID+")"}.`);
 showPage("attendance");
}

function getGPS(){
 const loc=state.locations.find(l=>l.id===document.getElementById("locPick").value) || state.locations[0];
 window._checkinMode = "GPS";
 if(window._verifiedLocId !== loc.id){
  window._wifiVerified = false;
  window._verifiedSSID = null;
  window._verifiedLocId = null;
 }

 const placeText = document.getElementById("placeText");
 if(placeText) placeText.textContent = `Đang kiểm tra vị trí GPS cho: ${loc.name}...`;

 if(loc.lat==null || loc.lng==null){
  switchToWifiMode(loc, "Địa điểm chưa cấu hình tọa độ GPS.");
  return;
 }

 navigator.geolocation.getCurrentPosition(p=>{
  const {latitude,longitude,accuracy}=p.coords, d=dist(latitude,longitude,loc.lat,loc.lng);
  window._gps={latitude,longitude,accuracy,distance:d};

  if(accuracy <= 20 && d <= (loc.radius || state.settings.radius)){
   window._checkinMode = "GPS";
   if(document.getElementById("gpsState")) document.getElementById("gpsState").textContent="✓";
   if(document.getElementById("wifiState")) document.getElementById("wifiState").textContent="—";
   if(document.getElementById("geoStatus")){
    document.getElementById("geoStatus").className="tag green";
    document.getElementById("geoStatus").textContent=`GPS Hợp lệ • ${d.toFixed(1)}m`;
   }
   if(placeText) placeText.textContent=`${loc.name} • Vị trí GPS hợp lệ (${d.toFixed(1)}m, Accuracy ${accuracy.toFixed(1)}m)`;
   if(document.getElementById("locationbox")) document.getElementById("locationbox").innerHTML=`<b>${d.toFixed(1)}m</b> từ tâm địa điểm<br><small>GPS accuracy: ${accuracy.toFixed(1)}m</small>`;
   const wifiBox = document.getElementById("wifiFallbackBox");
   if(wifiBox) wifiBox.innerHTML = "";
  } else {
   switchToWifiMode(loc, `Không khớp bán kính GPS (Cách ${d.toFixed(1)}m, Accuracy ${accuracy.toFixed(1)}m).`);
  }
 },e=>{
  switchToWifiMode(loc, "Không định vị được GPS (" + e.message + ").");
 },{enableHighAccuracy:true,maximumAge:0,timeout:6000});
}

function switchToWifiMode(loc, reason){
 window._checkinMode = "WIFI";
 window._gps = null;
 const isOnline = navigator.onLine;

 if(document.getElementById("gpsState")) document.getElementById("gpsState").textContent="✕";
 if(document.getElementById("wifiState")) document.getElementById("wifiState").textContent=window._wifiVerified ? "✓" : "Chờ xác thực";
 if(document.getElementById("geoStatus")){
  document.getElementById("geoStatus").className="tag orange";
  document.getElementById("geoStatus").textContent="📶 Chuyển sang xác thực WiFi thực tế";
 }
 if(document.getElementById("placeText")) document.getElementById("placeText").textContent=`${loc.name} • ${reason}`;
 if(document.getElementById("locationbox")){
  document.getElementById("locationbox").innerHTML=`<div style="color:#b52e2e;font-size:12px;margin-bottom:6px"><b>⚠️ Lỗi GPS:</b> ${reason}</div><div style="font-size:12px">👉 <b>Tự động chuyển sang kiểm tra WiFi thực tế trên thiết bị.</b></div>`;
 }

 const wifiBox = document.getElementById("wifiFallbackBox");
 if(wifiBox){
  wifiBox.innerHTML = `
   <div class="note" style="background:#e9f0ff;border-color:#b4cdfa;color:#1c4080;margin-top:12px">
    <b>📶 Phương thức WiFi Fallback Thực tế (${esc(loc.name)})</b><br>
    - Mạng WiFi địa điểm: <b style="color:#0b3c91">${esc(loc.wifiSSID || "Chưa thiết lập")}</b><br>
    - Trạng thái thiết bị: <b>${isOnline ? "🟢 Online (Đã bật kết nối mạng/WiFi)" : "🔴 Offline (Chưa bật WiFi/Mạng)"}</b>
    <div style="margin-top:10px">
     <button class="small primary full" id="scanWifiDirectBtn">📶 Kiểm tra kết nối WiFi thực tế trên thiết bị</button>
    </div>
   </div>`;

  document.getElementById("scanWifiDirectBtn").onclick = () => {
   scanWifiModal();
  };
 }
}

function locationModal(existing=null){
 const l = existing || {id:"loc"+Date.now(), name:"", lat:10.0305, lng:105.7725, radius:50, wifiSSID:"", wifiPassword:"", wifiGateway:"192.168.1.1"};
 const html = `<div class="modal"><div class="modalbox"><div class="panelhead"><h3>${existing?"Cấu hình":"Thêm"} địa điểm chấm công</h3><button class="closeModal">×</button></div>
 <label>Tên địa điểm<input id="locNameInput" value="${esc(l.name)}" placeholder="Ví dụ: Ẩm Thực Sông Quê"></label>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
  <label>Latitude (Vĩ độ)<input id="locLatInput" value="${l.lat??""}" placeholder="VD: 10.0305"></label>
  <label>Longitude (Kinh độ)<input id="locLngInput" value="${l.lng??""}" placeholder="VD: 105.7725"></label>
 </div>
 <button class="outline full" id="getCurrentGpsBtn" style="margin-top:0;margin-bottom:12px">📍 Lấy tọa độ GPS vị trí hiện tại</button>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
  <label>Tên WiFi (SSID)<input id="wifiSsidInput" value="${esc(l.wifiSSID||"")}" placeholder="VD: TANG 1"></label>
  <label>Mật khẩu WiFi<input id="wifiPassInputForm" value="${esc(l.wifiPassword||"")}" placeholder="VD: 68686868"></label>
 </div>
 <label style="margin-top:6px;display:block">Địa chỉ IP Router WiFi / Gateway (IP Subnet xác thực)
  <input id="wifiGatewayInput" value="${esc(l.wifiGateway||"192.168.1.1")}" placeholder="VD: 192.168.1.1 hoặc 192.168.0.1">
 </label>
 <button class="primary full" id="saveLocBtn" style="margin-top:12px">${existing?"Lưu thay đổi":"Tạo địa điểm"}</button></div></div>`;

 document.body.insertAdjacentHTML("beforeend", html);
 document.querySelector(".closeModal").onclick = () => document.querySelector(".modal").remove();
 document.getElementById("getCurrentGpsBtn").onclick = () => {
  navigator.geolocation.getCurrentPosition(p => {
   document.getElementById("locLatInput").value = p.coords.latitude;
   document.getElementById("locLngInput").value = p.coords.longitude;
   toast("Đã lấy tọa độ hiện tại.");
  }, e => toast("Không lấy được GPS: " + e.message, "bad"), {enableHighAccuracy:true});
 };
 document.getElementById("saveLocBtn").onclick = () => {
  const name = document.getElementById("locNameInput").value.trim();
  const lat = Number(document.getElementById("locLatInput").value) || null;
  const lng = Number(document.getElementById("locLngInput").value) || null;
  const wifiSSID = document.getElementById("wifiSsidInput").value.trim();
  const wifiPassword = document.getElementById("wifiPassInputForm").value.trim();
  const wifiGateway = document.getElementById("wifiGatewayInput").value.trim() || "192.168.1.1";

  if(!name){ toast("Vui lòng nhập tên địa điểm.", "bad"); return; }

  if(existing){
   Object.assign(existing, { name, lat, lng, wifiSSID, wifiPassword, wifiGateway });
  } else {
   state.locations.push({ id: l.id, name, lat, lng, radius: 50, wifiSSID, wifiPassword, wifiGateway });
  }

  save();
  document.querySelector(".modal").remove();
  showPage("settings");
  toast("Đã lưu cấu hình địa điểm & IP Router.");
 };
}

function renderEmpRows(list, manage){
 if(!list||!list.length) return `<tr><td colspan="${manage?8:7}" class="empty">Chưa có dữ liệu nhân sự.</td></tr>`;
 return list.map(e=>`<tr><td><b>${esc(e.id)}</b></td><td><b>${esc(e.name)}</b></td><td>${esc(e.dept)} / ${esc(e.sub)}</td><td>${({month:"Tháng",day:"Ngày",hour:"Giờ"}[e.salaryType]||e.salaryType)}</td><td>${money(e.base)}</td><td>${money(e.allowance)}</td><td><span class="tag ${e.active!==false?"green":"red"}">${e.active!==false?"Hoạt động":"Đã khóa"}</span></td>${manage?`<td><button class="small outline editEmp" data-id="${esc(e.id)}">Sửa</button> <button class="small ${e.active!==false?"outline":"primary"} toggleEmp" data-id="${esc(e.id)}">${e.active!==false?"Khóa":"Mở"}</button></td>`:""}</tr>`).join("");
}
function employees(){
 const manage = can("employee.manage");
 return `<div class="toolbar"><input id="empSearch" placeholder="Tìm kiếm nhân sự...">${manage?`<button class="primary" id="addEmp">+ Thêm nhân sự</button>`:""}</div><div class="panel"><table><thead><tr><th>Mã</th><th>Họ tên</th><th>Bộ phận</th><th>Loại lương</th><th>Lương cơ bản</th><th>Phụ cấp</th><th>Trạng thái</th>${manage?"<th>Thao tác</th>":""}</tr></thead><tbody id="empTableBody">${renderEmpRows(state.employees, manage)}</tbody></table></div>`;
}
function bindEmpActions(){
 document.querySelectorAll(".editEmp").forEach(b=>b.onclick=()=>employeeModal(state.employees.find(e=>e.id===b.dataset.id)));
 document.querySelectorAll(".toggleEmp").forEach(b=>b.onclick=()=>{
  const e=state.employees.find(x=>x.id===b.dataset.id);
  if(!e) return;
  e.active = e.active === false ? true : false;
  save();
  showPage("employees");
  toast(e.active ? "Đã mở khóa nhân sự." : "Đã khóa nhân sự.");
 });
}

function approvals(){
 return `<div class="panel"><div class="panelhead"><h3>Hàng chờ phê duyệt</h3><span class="tag orange">${state.explanations.filter(x=>x.status!=="approved").length} chờ xử lý</span></div><table><thead><tr><th>Nhân sự</th><th>Ngày</th><th>Lý do</th><th>Nội dung</th><th>Trạng thái</th><th></th></tr></thead><tbody>${state.explanations.map(x=>`<tr><td>${esc(x.emp)}</td><td>${x.date}</td><td>${esc(x.reason)}</td><td>${esc(x.note)}</td><td><span class="tag ${x.status==="approved"?"green":"orange"}">${x.status}</span></td><td>${x.status!=="approved"?`<button class="small primary approve" data-id="${x.id}">Duyệt</button>`:"✓"}</td></tr>`).join("")||`<tr><td colspan="6" class="empty">Chưa có giải trình.</td></tr>`}</tbody></table></div>`;
}
function leave(){
 return `<div class="toolbar"><button class="primary" id="addLeave">+ Tạo đơn nghỉ</button><span class="tag blue">Tự động liên kết bảng công → payroll</span></div><div class="panel"><table><thead><tr><th>Nhân sự</th><th>Loại nghỉ</th><th>Từ</th><th>Đến</th><th>Số ngày</th><th>Trạng thái</th></tr></thead><tbody>${state.leave.map(x=>`<tr><td>${esc(x.emp)}</td><td>${esc(x.type)}</td><td>${x.from}</td><td>${x.to}</td><td>${x.days}</td><td><span class="tag green">${x.status}</span></td></tr>`).join("")||`<tr><td colspan="6" class="empty">Chưa có đơn nghỉ.</td></tr>`}</tbody></table></div>`;
}
function payroll(){
 const rows=state.employees.map(e=>{
  const base=e.salaryType==="month"?e.base:e.salaryType==="day"?e.base*26:e.base*208;
  const total=base+e.allowance+e.kpi+e.ot;
  return {...e,baseCalc:base,total}
 });
 return `<div class="payhero"><div><span class="eyebrow">KỲ LƯƠNG</span><h2>${state.payroll.period}</h2><p>Payroll lấy dữ liệu từ bảng công, nghỉ phép, OT, KPI, phụ cấp, thưởng/phạt.</p></div><button class="${state.payroll.closed?"outline":"primary"}" id="closePayroll">${state.payroll.closed?"🔒 Đã chốt":"🔒 Chốt kỳ công"}</button></div><div class="panel"><table><thead><tr><th>Nhân sự</th><th>Loại</th><th>Lương tính</th><th>Phụ cấp</th><th>KPI</th><th>OT</th><th>Tổng</th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${esc(x.name)}</b></td><td>${x.salaryType}</td><td>${money(x.baseCalc)}</td><td>${money(x.allowance)}</td><td>${money(x.kpi)}</td><td>${money(x.ot)}</td><td><b>${money(x.total)}</b></td></tr>`).join("")}</tbody></table></div>`;
}
function reports(){
 return `<div class="grid3">${card("Báo cáo công","Theo ngày/tháng","Bộ phận • nhân sự • địa điểm")} ${card("Báo cáo OT",state.employees.reduce((s,e)=>s+e.ot,0)?"Có dữ liệu":"0","Có thể export")} ${card("Payroll",money(state.employees.reduce((s,e)=>s+(e.salaryType==="month"?e.base:e.salaryType==="day"?e.base*26:e.base*208)+e.allowance+e.kpi+e.ot,0)),"Tổng mẫu hiện tại")}</div><div class="panel"><div class="panelhead"><h3>Xuất dữ liệu</h3></div><button class="primary" id="exportJson">Xuất JSON</button> <button class="outline" id="exportCsv">Xuất CSV bảng lương</button></div>`;
}
function settings(){
 const canManage = can("settings.manage");
 const acc = currentAccount();
 return `<div class="two">
  <div class="panel">
   <div class="panelhead"><h3>Quy định chấm công chung</h3></div>
   <label>Bán kính định vị GPS chuẩn (m)<input id="radius" type="number" value="${state.settings.radius}"></label>
   <label>Ngưỡng trễ tính phạt (phút)<input value="6" disabled></label>
   <label>Chuẩn giờ công/ngày<input value="${state.settings.standardHours}" disabled></label>
   ${canManage ? `<button class="primary" id="saveRules">Lưu quy định</button>` : ''}

   <div style="margin-top:20px;border-top:1px solid var(--border);padding-top:14px">
    <div class="panelhead"><h3>🔐 Đổi mật khẩu cá nhân (${esc(acc?.username||"")})</h3></div>
    <label>Mật khẩu hiện tại<input type="password" id="selfCurPass" placeholder="Nhập mật khẩu hiện tại"></label>
    <label>Mật khẩu mới<input type="password" id="selfNewPass" placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"></label>
    <label>Xác nhận mật khẩu mới<input type="password" id="selfConfPass" placeholder="Nhập lại mật khẩu mới"></label>
    <button class="outline" id="saveSelfPassBtn" style="margin-top:8px">Cập nhật mật khẩu cá nhân</button>
   </div>
  </div>
  <div class="panel">
   <div class="panelhead">
    <h3>Cấu hình 4 Địa điểm (GPS & WiFi Fallback)</h3>
    ${canManage ? `<button class="primary small" id="addLocBtn">+ Thêm địa điểm</button>` : ''}
   </div>
   <div style="overflow-x:auto">
    <table>
     <thead>
      <tr>
       <th>Tên địa điểm</th>
       <th>Tọa độ GPS</th>
       <th>Tên WiFi (SSID)</th>
       <th>Mật khẩu WiFi</th>
       <th>IP Router (Gateway)</th>
       ${canManage ? `<th>Thao tác</th>` : ''}
      </tr>
     </thead>
     <tbody>
      ${state.locations.map(l => `<tr>
       <td><b>${esc(l.name)}</b></td>
       <td>${l.lat && l.lng ? `${l.lat.toFixed(4)}, ${l.lng.toFixed(4)}` : '<span class="tag orange">Chưa nhập GPS</span>'}</td>
       <td><span class="tag blue">📶 ${esc(l.wifiSSID || "Chưa đặt")}</span></td>
       <td><code>${esc(l.wifiPassword || "—")}</code></td>
       <td><code style="color:#0b3c91;font-weight:bold">${esc(l.wifiGateway || "192.168.1.1")}</code></td>
       ${canManage ? `<td><button class="small outline editLocBtn" data-id="${l.id}">Cấu hình</button></td>` : ''}
      </tr>`).join("")}
     </tbody>
    </table>
   </div>
  </div>
  <div class="panel" style="margin-top:16px;grid-column:1/-1">
   <div class="panelhead"><h3>ℹ️ Thông tin bản quyền & Liên hệ hệ thống</h3></div>
   <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:13px">
    <div>
     📍 <b>Địa chỉ đơn vị:</b> 186 Hồ Bún Xáng, Cần Thơ<br>
     📞 <b>Hotline liên hệ:</b> 0932 454 245
    </div>
    <div style="text-align:right">
     <b style="color:#0b3c91;font-size:14px">Bản quyền thuộc về SHK 86</b><br>
     <small style="color:var(--muted)">Hệ thống Chấm công & Quản lý nhân sự SHK 86 HRM V2.0</small>
    </div>
   </div>
  </div>
 </div>`;
}
function calcHours(){
 let h=0, ins={};
 for(const a of state.attendance){const k=a.empId;if(a.type==="IN") ins[k]=new Date(a.ts); if(a.type==="OUT"&&ins[k]){h+=(new Date(a.ts)-ins[k])/36e5;delete ins[k]}}
 return h;
}
function bind(page){
 if(page==="attendance"){
  setInterval(()=>{const e=document.getElementById("clock");if(e)e.textContent=fmtTime()},1000);
  document.getElementById("selfieBtn").onclick=startCamera;
  document.getElementById("video").onclick=capture;
  document.getElementById("locPick").onchange=getGPS;
  document.getElementById("checkin").onclick=()=>doAttendance("IN");
  document.getElementById("checkout").onclick=()=>doAttendance("OUT");
  document.getElementById("gpsState").parentElement.onclick=getGPS;
  document.getElementById("scanWifiBtn")?.addEventListener("click", () => scanWifiModal());
  getGPS();
 }
 if(page==="approvals") document.querySelectorAll(".approve").forEach(b=>b.onclick=()=>{const x=state.explanations.find(e=>e.id===b.dataset.id);x.status=state.role==="MANAGER"?"hr1":"approved";save();showPage("approvals");toast("Đã chuyển bước phê duyệt.")});
 if(page==="payroll") document.getElementById("closePayroll").onclick=()=>{if(!state.payroll.closed){state.payroll.closed=true;save();showPage("payroll");toast("Đã chốt kỳ công.");}};
 if(page==="settings"){
  document.getElementById("saveRules")?.addEventListener("click",()=>{state.settings.radius=+document.getElementById("radius").value||50;save();toast("Đã lưu quy định.");showPage("settings")});
  document.querySelectorAll(".editLocBtn").forEach(b=>b.onclick=()=>locationModal(state.locations.find(l=>l.id===b.dataset.id)));
  document.getElementById("saveSelfPassBtn")?.addEventListener("click",()=>{
   const curP = document.getElementById("selfCurPass").value;
   const newP = document.getElementById("selfNewPass").value.trim();
   const confP = document.getElementById("selfConfPass").value.trim();
   const acc = currentAccount();

   if(!acc){ toast("Không tìm thấy phiên làm việc.","bad"); return; }
   if(curP !== acc.password){ toast("Mật khẩu hiện tại không chính xác.","bad"); return; }
   if(!newP || newP.length < 6){ toast("Mật khẩu mới phải có tối thiểu 6 ký tự.","bad"); return; }
   if(newP === "SHK86@123"){ toast("Mật khẩu mới không được đặt trùng mật khẩu mặc định.","bad"); return; }
   if(newP !== confP){ toast("Mật khẩu xác nhận không trùng khớp.","bad"); return; }

   acc.password = newP;
   acc.mustChangePassword = false;
   save();
   toast("✅ Đã cập nhật mật khẩu cá nhân thành công!");
   document.getElementById("selfCurPass").value = "";
   document.getElementById("selfNewPass").value = "";
   document.getElementById("selfConfPass").value = "";
  });
 }
 if(page==="reports"){
  document.getElementById("exportJson").onclick=downloadJSON;
  document.getElementById("exportCsv").onclick=downloadCSV;
 }
 if(page==="accounts"){
  document.querySelectorAll(".tab-btn").forEach(b=>{
   b.onclick=()=>{
    window._currentAccTab=b.dataset.tab;
    showPage("accounts");
   };
  });
  document.getElementById("addAccount")?.addEventListener("click",()=>accountModal());
  document.querySelectorAll(".editAccount").forEach(b=>b.onclick=()=>accountModal(state.accounts.find(a=>a.id===b.dataset.id)));
  document.querySelectorAll(".toggleAccount").forEach(b=>b.onclick=()=>{const a=state.accounts.find(x=>x.id===b.dataset.id); if(a.id===currentAccount()?.id){toast("Không thể tự khóa tài khoản đang đăng nhập.","bad");return} a.active=!a.active; save(); showPage("accounts"); toast(a.active?"Đã mở khóa tài khoản.":"Đã khóa tài khoản.");});
  
  document.getElementById("addDept")?.addEventListener("click",()=>departmentModal());
  document.querySelectorAll(".editDeptBtn").forEach(b=>b.onclick=()=>departmentModal((state.departments||[]).find(d=>d.id===b.dataset.id)));
  document.querySelectorAll(".delDeptBtn").forEach(b=>b.onclick=()=>{
   const d=(state.departments||[]).find(x=>x.id===b.dataset.id);
   if(!d) return;
   if((state.departments||[]).some(c=>c.parentId===d.id)){
    toast("Không thể xóa bộ phận có chứa bộ phận con. Hãy chuyển hoặc xóa bộ phận con trước.","bad");
    return;
   }
   state.departments=state.departments.filter(x=>x.id!==d.id);
   save();
   showPage("accounts");
   toast("Đã xóa bộ phận.");
  });

  document.querySelectorAll(".userPermsBtn").forEach(b => b.onclick = () => {
   const acc = state.accounts.find(a => a.id === b.dataset.id);
   if(acc) userPermissionModal(acc);
  });

  document.getElementById("addRoleBtn")?.addEventListener("click", () => customRoleModal());

  document.getElementById("savePermsBtn")?.addEventListener("click",()=>{
   const roleMap = getRoleNames();
   const newPerms = {};
   Object.keys(roleMap).forEach(r => newPerms[r] = []);
   document.querySelectorAll(".perm-cb").forEach(cb=>{
    if(cb.checked){
     const r=cb.dataset.role, k=cb.dataset.key;
     if(!newPerms[r]) newPerms[r] = [];
     newPerms[r].push(k);
    }
   });
   if(!newPerms.BGD) newPerms.BGD = [];
   if(!newPerms.BGD.includes("account.manage")) newPerms.BGD.push("account.manage");
   if(!newPerms.BGD.includes("orgchart.manage")) newPerms.BGD.push("orgchart.manage");
   state.permissions=newPerms;
   save();
   showPage("accounts");
   toast("Đã lưu ma trận phân quyền hệ thống.");
  });

  document.getElementById("resetPermsBtn")?.addEventListener("click",()=>{
   delete state.permissions;
   save();
   showPage("accounts");
   toast("Đã khôi phục ma trận phân quyền mặc định.");
  });
 }
 if(page==="employees"){
  const manage = can("employee.manage");
  document.getElementById("addEmp")?.addEventListener("click",()=>employeeModal());
  const searchInput = document.getElementById("empSearch");
  if(searchInput){
   searchInput.oninput=()=>{
    const q=searchInput.value.trim().toLowerCase();
    const filtered=state.employees.filter(e=>e.id.toLowerCase().includes(q)||e.name.toLowerCase().includes(q)||e.dept.toLowerCase().includes(q)||(e.sub&&e.sub.toLowerCase().includes(q)));
    const tbody=document.getElementById("empTableBody");
    if(tbody) tbody.innerHTML=renderEmpRows(filtered, manage);
    bindEmpActions();
   };
  }
  bindEmpActions();
 }
}
function download(name,content,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function downloadJSON(){download("shk86_hrm_backup.json",JSON.stringify(state,null,2),"application/json")}
function downloadCSV(){let s="Mã NV,Họ tên,Bộ phận,Loại lương,Lương,Phụ cấp,KPI,OT,Tổng\n";for(const e of state.employees){const base=e.salaryType==="month"?e.base:e.salaryType==="day"?e.base*26:e.base*208;s+=`${e.id},"${e.name}","${e.dept}","${e.salaryType}",${base},${e.allowance},${e.kpi},${e.ot},${base+e.allowance+e.kpi+e.ot}\n`}download("shk86_payroll.csv","\ufeff"+s,"text/csv;charset=utf-8")}
render();
