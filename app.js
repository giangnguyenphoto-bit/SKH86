const KEY="shk86_hrm_v2";
let session=JSON.parse(sessionStorage.getItem("shk86_session")||"null");
const state=JSON.parse(localStorage.getItem(KEY)||"null")||{
  role:"HR1", user:"Nguyễn Minh HR",
  customDepts:["BGĐ","HR","MKT","Vận hành","Bếp"],
  customSubs:["MKT","Nhà hàng A","Bếp","Văn phòng"],
  deletedDepts:[],
  deletedSubs:[],
  accounts:[
    {id:"ACC001",username:"admin",name:"Quản trị SHK 86",role:"BGD",dept:"BGĐ",active:true,password:"SHK86@123"},
    {id:"ACC002",username:"hr1",name:"HR Kiểm duyệt",role:"HR1",dept:"HR",active:true,password:"SHK86@123"},
    {id:"ACC003",username:"hr2",name:"HR Báo cáo",role:"HR2",dept:"HR",active:true,password:"SHK86@123"},
    {id:"ACC004",username:"manager",name:"Trưởng bộ phận Demo",role:"MANAGER",dept:"MKT",active:true,password:"SHK86@123"},
    {id:"ACC005",username:"nv001",name:"Nguyễn Văn An",role:"EMP",dept:"MKT",employeeId:"NV001",active:true,password:"SHK86@123"}
  ],
  settings:{radius:50,maxAccuracy:150,grace:5,standardHours:8,routerIp:"192.168.1.1",checkRouterIp:false,otRules:{weekday:1.5,offday:2,holiday:3}},
  locations:[{id:"loc1",name:"1. Văn phòng SHK 86",lat:null,lng:null,radius:50,wifi:""}],
  employees:[
    {id:"annguyen0101",name:"Nguyễn Văn An",dob:"1995-01-01",dept:"MKT",sub:"MKT",salaryType:"month",base:18000000,allowance:2000000,kpi:0,ot:0,active:true,locations:["loc1"]},
    {id:"binhtran1505",name:"Trần Thị Bình",dob:"1998-05-15",dept:"Vận hành",sub:"Nhà hàng A",salaryType:"day",base:350000,allowance:500000,kpi:0,ot:0,active:true,locations:["loc1"]},
    {id:"cuongle2010",name:"Lê Văn Cường",dob:"1992-10-20",dept:"Bếp",sub:"Bếp",salaryType:"hour",base:35000,allowance:300000,kpi:0,ot:0,active:true,locations:["loc1"]}
  ],
  attendance:[],
  explanations:[],
  leave:[],
  payroll:{period:"01/09/2026 - 30/09/2026",closed:false}
};
if(!state.settings.maxAccuracy) state.settings.maxAccuracy=150;

function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function currentAccount(){return state.accounts?.find(a=>a.id===session?.accountId)||null}
function can(permission){const a=currentAccount(); if(!a)return false; return !!(PERMISSIONS[a.role]||[]).includes(permission)}

const PERMISSIONS = state.customPermissions || {
 BGD:["dashboard.view","attendance.view_all","employee.view_all","employee.manage","approval.view","approval.approve","leave.view_all","leave.approve","payroll.view_all","payroll.manage","report.view_all","settings.manage","account.manage"],
 HR1:["dashboard.view","attendance.view_all","employee.view_all","employee.manage","approval.view","approval.approve","leave.view_all","leave.approve","payroll.view_all","report.view_all","settings.manage"],
 HR2:["dashboard.view","attendance.view_all","employee.view_all","approval.view","leave.view_all","payroll.view_all","payroll.manage","report.view_all","report.export","account.view"],
 MANAGER:["dashboard.view","attendance.view_scope","approval.view","approval.approve","leave.view_scope","leave.approve","report.view_scope"],
 EMP:["dashboard.view_self","attendance.self","leave.self","payroll.view_self","approval.self"]
};

const ALL_PERMS_DICT = {
 "dashboard.view": "Xem Tổng quan toàn cty",
 "dashboard.view_self": "Xem Tổng quan cá nhân",
 "attendance.view_all": "Xem tất cả nhật ký chấm công",
 "attendance.view_scope": "Xem nhật ký công theo phạm vi",
 "attendance.self": "Thực hiện chấm công cá nhân",
 "employee.view_all": "Xem danh sách nhân sự",
 "employee.manage": "Thêm / Sửa / Quản lý nhân sự",
 "approval.view": "Xem danh sách giải trình",
 "approval.approve": "Phê duyệt giải trình",
 "approval.self": "Gửi giải trình cá nhân",
 "leave.view_all": "Xem tất cả đơn nghỉ phép",
 "leave.view_scope": "Xem đơn nghỉ phép theo phạm vi",
 "leave.approve": "Phê duyệt nghỉ phép",
 "leave.self": "Tạo đơn nghỉ phép cá nhân",
 "payroll.view_all": "Xem bảng lương toàn công ty",
 "payroll.view_self": "Xem phiếu lương cá nhân",
 "payroll.manage": "Tính lương & Chốt kỳ công",
 "report.view_all": "Xem tất cả báo cáo",
 "report.view_scope": "Xem báo cáo theo phạm vi",
 "report.export": "Xuất dữ liệu báo cáo (JSON/CSV)",
 "settings.manage": "Cấu hình quy định & địa điểm",
 "account.view": "Xem danh sách tài khoản",
 "account.manage": "Cấp & Quản lý tài khoản, phân quyền"
};

const ROLE_NAMES={BGD:"BGĐ",HR1:"HR Cấp 1",HR2:"HR Cấp 2",MANAGER:"Trưởng bộ phận",EMP:"Nhân sự"};

function getAvailableDepts(){
 const set=new Set([...(state.customDepts||["BGĐ","HR","MKT","Vận hành","Bếp"]), ...state.accounts.map(a=>a.dept).filter(Boolean), ...state.employees.map(e=>e.dept).filter(Boolean)]);
 const deleted=new Set(state.deletedDepts||[]);
 return Array.from(set).filter(d=>d&&!deleted.has(d));
}

function getAvailableSubs(){
 const set=new Set([...(state.customSubs||["MKT","Nhà hàng A","Bếp","Văn phòng"]), ...state.employees.map(e=>e.sub).filter(Boolean)]);
 const deleted=new Set(state.deletedSubs||[]);
 return Array.from(set).filter(s=>s&&!deleted.has(s));
}

function customDeptModal(oldName=null){
 const name=prompt(oldName?"Nhập tên bộ phận chính mới:":"Nhập tên bộ phận chính mới:", oldName||"");
 if(name===null) return;
 const trimmed=name.trim();
 if(!trimmed){toast("Tên bộ phận không được để trống.","bad");return;}
 if(!state.customDepts) state.customDepts=[];
 if(oldName){
  state.customDepts=state.customDepts.map(d=>d===oldName?trimmed:d);
  state.employees.forEach(e=>{if(e.dept===oldName) e.dept=trimmed;});
  state.accounts.forEach(a=>{if(a.dept===oldName) a.dept=trimmed;});
  toast(`Đã đổi tên bộ phận "${oldName}" thành "${trimmed}".`);
 } else {
  if(!state.customDepts.includes(trimmed)) state.customDepts.push(trimmed);
  toast(`Đã thêm bộ phận "${trimmed}".`);
 }
 save(); showPage("accounts");
}

function deleteCustomDept(deptName){
 if(!confirm(`Bạn có chắc muốn xóa bộ phận "${deptName}" khỏi danh sách?`)) return;
 if(!state.deletedDepts) state.deletedDepts=[];
 if(!state.deletedDepts.includes(deptName)) state.deletedDepts.push(deptName);
 save(); showPage("accounts"); toast(`Đã xóa bộ phận "${deptName}".`);
}

function subDeptModal(oldName=null){
 const name=prompt(oldName?"Nhập tên phân khu / bộ phận phụ mới:":"Nhập tên phân khu / bộ phận phụ mới:", oldName||"");
 if(name===null) return;
 const trimmed=name.trim();
 if(!trimmed){toast("Tên phân khu không được để trống.","bad");return;}
 if(!state.customSubs) state.customSubs=[];
 if(oldName){
  state.customSubs=state.customSubs.map(s=>s===oldName?trimmed:s);
  state.employees.forEach(e=>{if(e.sub===oldName) e.sub=trimmed;});
  toast(`Đã đổi tên phân khu "${oldName}" thành "${trimmed}".`);
 } else {
  if(!state.customSubs.includes(trimmed)) state.customSubs.push(trimmed);
  toast(`Đã thêm phân khu "${trimmed}".`);
 }
 save(); showPage("accounts");
}

function deleteSubDept(subName){
 if(!confirm(`Bạn có chắc muốn xóa phân khu "${subName}" khỏi danh sách?`)) return;
 if(!state.deletedSubs) state.deletedSubs=[];
 if(!state.deletedSubs.includes(subName)) state.deletedSubs.push(subName);
 save(); showPage("accounts"); toast(`Đã xóa phân khu "${subName}".`);
}

function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function money(n){const val=Math.round(Number(n)||0);return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")+" ₫"}
function fmtNumDots(n){const val=Math.round(Number(n)||0);return val?val.toString().replace(/\B(?=(\d{3})+(?!\d))/g,"."):""}
function parseMoneyInput(s){return Number(String(s||"").replace(/\D/g,""))||0}
function bindMoneyInput(el){
 if(!el) return;
 el.addEventListener("input",()=>{
  const raw=el.value.replace(/\D/g,"");
  el.value=raw?raw.replace(/\B(?=(\d{3})+(?!\d))/g,"."):"";
 });
}
function removeVietnameseTones(str){
 if(!str) return "";
 str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
 str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
 str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
 str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
 str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
 str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
 str = str.replace(/đ/g,"d");
 str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
 str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
 str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
 str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
 str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
 str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
 str = str.replace(/Đ/g, "D");
 return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function generateEmpId(name, dob){
 if(!name) return "";
 const words = name.trim().split(/\s+/).filter(Boolean);
 if(words.length === 0) return "";
 const ho = removeVietnameseTones(words[0]);
 const ten = removeVietnameseTones(words[words.length - 1]);
 const codeName = words.length === 1 ? ten : (ten + ho);
 let ddmm = "";
 if(dob){
  const parts = dob.split("-");
  if(parts.length === 3) ddmm = parts[2] + parts[1];
 }
 return codeName + ddmm;
}
function fmtDate(d=new Date()){return new Intl.DateTimeFormat("vi-VN",{dateStyle:"medium"}).format(d)}
function fmtTime(d=new Date()){return new Intl.DateTimeFormat("vi-VN",{timeStyle:"medium"}).format(d)}
function dist(a,b,c,d){
  const R=6371000, p=Math.PI/180, x=(c-a)*p, y=(d-b)*p;
  const h=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
function toast(msg,type="ok"){const e=document.createElement("div");e.className="toast "+type;e.textContent=msg;document.body.appendChild(e);setTimeout(()=>e.remove(),2600)}

function renderLogin(){
 document.getElementById("app").innerHTML=`<div class="login-page">
  <div class="login-card">
   <div class="login-brand"><img src="${window.SHK_LOGO}"><div><b>SHK 86</b><span>HRM • ATTENDANCE & PAYROLL</span></div></div>
   <h1>Đăng nhập hệ thống</h1>
   <p class="login-sub">Quản lý chấm công, phân quyền và tiền lương</p>
   <form id="loginForm" autocomplete="off">
    <label>Tên đăng nhập<input id="loginUser" autocomplete="new-password" placeholder="Nhập tài khoản" required></label>
    <label>Mật khẩu<input id="loginPass" type="password" autocomplete="new-password" placeholder="Nhập mật khẩu" required></label>
    <button class="primary login-btn">Đăng nhập</button>
   </form>
   <div class="demo-login"><b>Tài khoản demo</b><br>admin / SHK86@123 <span>•</span> hr1 / SHK86@123 <span>•</span> nv001 / SHK86@123</div>
   <small class="security-note">Bản quyền thuộc về <b>SHK 86</b> • 186 Hồ Bún Xáng, Cần Thơ • Hotline: 0932454245</small>
  </div>
 </div>`;
 document.getElementById("loginForm").onsubmit=e=>{
  e.preventDefault();
  const u=document.getElementById("loginUser").value.trim(), p=document.getElementById("loginPass").value;
  const a=state.accounts.find(x=>x.username.toLowerCase()===u.toLowerCase()&&x.password===p&&x.active);
  if(!a){toast("Sai tài khoản/mật khẩu hoặc tài khoản đã khóa.","bad");return}
  session={accountId:a.id,loginAt:new Date().toISOString()};
  sessionStorage.setItem("shk86_session",JSON.stringify(session));
  state.role=a.role; state.user=a.name; save(); render();
 };
}

function accounts(){
 if(!can("account.manage") && !can("account.view")) return `<div class="panel"><h3>Không có quyền truy cập</h3><p>Bạn không có quyền quản lý tài khoản.</p></div>`;
 const manage=can("account.manage");
 const depts=getAvailableDepts(), subs=getAvailableSubs();

 return `<div class="toolbar"><div><span class="tag blue">RBAC • ${state.accounts.length} tài khoản</span></div>${manage?`<button class="primary" id="addAccount">+ Cấp tài khoản mới</button>`:""}</div>
 <div class="panel"><div class="panelhead"><h3>Danh sách tài khoản hệ thống</h3><span class="tag">Phân quyền theo vai trò</span></div>
 <table><thead><tr><th>Tài khoản</th><th>Người dùng</th><th>Vai trò hiện tại</th><th>Phạm vi / Bộ phận</th><th>Trạng thái</th><th>Số quyền</th>${manage?"<th>Thao tác</th>":""}</tr></thead><tbody>
 ${state.accounts.map(a=>`<tr><td><b>${esc(a.username)}</b></td><td>${esc(a.name)}</td><td><span class="tag blue">${ROLE_NAMES[a.role]}</span></td><td>${esc(a.dept||"Toàn công ty")}</td><td><span class="tag ${a.active?"green":"red"}">${a.active?"Hoạt động":"Đã khóa"}</span></td><td><span class="tag">${(PERMISSIONS[a.role]||[]).length} quyền</span></td>${manage?`<td><button class="small outline editAccount" data-id="${a.id}">⚙️ Sửa vai trò/bộ phận</button> <button class="small ${a.active?"outline":"primary"} toggleAccount" data-id="${a.id}">${a.active?"Khóa":"Mở khóa"}</button></td>`:""}</tr>`).join("")}</tbody></table></div>
 
 <div class="two">
  <div class="panel">
   <div class="panelhead"><h3>🌳 Danh sách Bộ phận chính</h3>${manage?`<button class="small primary" id="addDeptBtn">+ Thêm bộ phận</button>`:""}</div>
   <table><thead><tr><th>Tên bộ phận</th><th>Số nhân sự</th>${manage?"<th>Thao tác</th>":""}</tr></thead><tbody>
   ${depts.map(d=>`<tr><td><b>${esc(d)}</b></td><td>${state.employees.filter(e=>e.dept===d).length} nhân sự</td>${manage?`<td><button class="small outline editDeptBtn" data-name="${esc(d)}">Sửa</button> <button class="small outline red deleteDeptBtn" data-name="${esc(d)}">Xóa</button></td>`:""}</tr>`).join("")}
   </tbody></table>
  </div>
  <div class="panel">
   <div class="panelhead"><h3>🏢 Danh sách Phân khu / Bộ phận phụ</h3>${manage?`<button class="small primary" id="addSubBtn">+ Thêm phân khu</button>`:""}</div>
   <table><thead><tr><th>Tên phân khu</th><th>Số nhân sự</th>${manage?"<th>Thao tác</th>":""}</tr></thead><tbody>
   ${subs.map(s=>`<tr><td><b>${esc(s)}</b></td><td>${state.employees.filter(e=>e.sub===s).length} nhân sự</td>${manage?`<td><button class="small outline editSubBtn" data-name="${esc(s)}">Sửa</button> <button class="small outline red deleteSubBtn" data-name="${esc(s)}">Xóa</button></td>`:""}</tr>`).join("")}
   </tbody></table>
  </div>
 </div>

 <div class="panel">
  <div class="panelhead">
   <h3>Ma trận vai trò & Danh sách quyền (Bảng tích chọn trực tiếp)</h3>
   <span class="tag blue">Tích chọn để cập nhật quyền</span>
  </div>
  <div style="overflow-x:auto;">
   <table>
    <thead>
     <tr>
      <th>Chức năng / Quyền hệ thống</th>
      ${Object.entries(ROLE_NAMES).map(([rKey, rName])=>`<th style="text-align:center;">${esc(rName)}</th>`).join("")}
     </tr>
    </thead>
    <tbody>
     ${Object.entries(ALL_PERMS_DICT).map(([pCode, pLabel])=>`
      <tr>
       <td>
        <b>${esc(pLabel)}</b>
        <br><small style="color:var(--muted);font-family:monospace;">${pCode}</small>
       </td>
       ${Object.keys(ROLE_NAMES).map(rKey=>{
        const isChecked = (PERMISSIONS[rKey]||[]).includes(pCode);
        return `<td style="text-align:center;">
         <input type="checkbox" class="role-perm-matrix-cb" data-role="${rKey}" data-perm="${pCode}" ${isChecked?"checked":""} ${!manage?"disabled":""} style="width:18px;height:18px;cursor:pointer;">
        </td>`;
       }).join("")}
      </tr>
     `).join("")}
    </tbody>
   </table>
  </div>
 </div>`;
}

function accountModal(existing=null){
 const a=existing||{username:"",name:"",role:"EMP",dept:"",password:"SHK86@123",active:true};
 const depts=getAvailableDepts();
 const html=`<div class="modal"><div class="modalbox"><div class="panelhead"><h3>${existing?"Chỉnh sửa vai trò & bộ phận":"Cấp"} tài khoản</h3><button class="closeModal">×</button></div>
 <label>Tên đăng nhập<input id="accUser" autocomplete="new-password" value="${esc(a.username)}" ${existing?"disabled":""}></label>
 <label>Họ tên người dùng<input id="accName" value="${esc(a.name)}"></label>
 <label>Chọn vai trò tài khoản<select id="accRole">${Object.entries(ROLE_NAMES).map(([k,v])=>`<option value="${k}" ${a.role===k?"selected":""}>${v}</option>`).join("")}</select></label>
 <label>Bộ phận / Phạm vi phụ trách
   <select id="accDept">
     <option value="">Toàn công ty (Tất cả bộ phận)</option>
     ${depts.map(d=>`<option value="${esc(d)}" ${a.dept===d?"selected":""}>${esc(d)}</option>`).join("")}
     <option value="__ADD_DEPT__">⚙️ Quản lý / Thêm bộ phận mới...</option>
   </select>
 </label>
 <label>Mật khẩu<input id="accPass" type="password" autocomplete="new-password" value="${esc(a.password||"")}"></label>
 <button class="primary full" id="saveAccount">${existing?"Lưu thay đổi":"Tạo tài khoản"}</button></div></div>`;
 document.body.insertAdjacentHTML("beforeend",html);
 document.querySelector(".closeModal").onclick=()=>document.querySelector(".modal").remove();
 document.getElementById("accDept").onchange=(ev)=>{
  if(ev.target.value==="__ADD_DEPT__"){
   document.querySelector(".modal").remove();
   showPage("accounts");
   customDeptModal();
  }
 };
 document.getElementById("saveAccount").onclick=()=>{
  const username=document.getElementById("accUser").value.trim(), name=document.getElementById("accName").value.trim(), role=document.getElementById("accRole").value, dept=document.getElementById("accDept").value, password=document.getElementById("accPass").value;
  if(!username||!name||!password){toast("Vui lòng nhập đủ tài khoản, họ tên và mật khẩu.","bad");return}
  if(existing){Object.assign(existing,{name,role,dept,password});}
  else {if(state.accounts.some(x=>x.username.toLowerCase()===username.toLowerCase())){toast("Tên đăng nhập đã tồn tại.","bad");return} state.accounts.push({id:"ACC"+String(Date.now()).slice(-8),username,name,role,dept,password,active:true});}
  save();document.querySelector(".modal").remove();showPage("accounts");toast(existing?"Đã cập nhật tài khoản.":"Đã cấp tài khoản.");
 };
}

function employeeModal(existing=null){
 const e=existing||{
  id:"",name:"",dob:"",gender:"",pob:"Cần Thơ",nationality:"Việt Nam",ethnicity:"Kinh",
  maritalStatus:"",phone:"",phone2:"",email:"",
  idCard:"",idCardDate:"",idCardPlace:"Cục Cảnh sát QLHC về TTXH",idCardExp:"",
  permAddress:"",tempAddress:"",emergencyContact:"",emergencyPhone:"",emergencyRelation:"",
  eduLevel:"",eduSchool:"",eduMajor:"",
  dept:getAvailableDepts()[0]||"MKT",sub:getAvailableSubs()[0]||"MKT",title:"",managerId:"",contractType:"Chính thức",contractNum:"",contractFrom:"",contractTo:"",probationEnd:"",shift:"",joinDate:"",leaveDate:"",status:"Đang làm việc",offLimit:2,
  base:10000000,hourlyRate:0,allowance:1000000,salaryType:"month",bankName:"Vietcombank",bankAcc:"",bankHolder:"",taxId:"",socialIns:"",healthIns:"",note:""
 };
 const depts=getAvailableDepts(), subs=getAvailableSubs();
 const html=`<div class="modal"><div class="modalbox large">
  <div class="emp-form-header">
   <h3>${existing?"Chỉnh sửa hồ sơ nhân sự":"Thêm nhân sự mới"}</h3>
   <div style="display:flex;align-items:center;gap:12px;">
    <span class="emp-req-note">Dấu <span class="req-star">•</span> là bắt buộc</span>
    <button class="closeModal" type="button">×</button>
   </div>
  </div>

  <!-- 1 - THÔNG TIN CÁ NHÂN -->
  <div class="emp-section">
   <div class="emp-section-title">1 - THÔNG TIN CÁ NHÂN</div>
   <div class="emp-grid-7">
    <label>Mã nhân viên <span class="req-star">*</span>
     <input id="empId" value="${esc(e.id)}" ${existing?"disabled":""} placeholder="MK19">
    </label>
    <label>Họ và tên <span class="req-star">*</span>
     <input id="empName" value="${esc(e.name)}" placeholder="Nguyễn Văn An">
    </label>
    <label>Ngày tháng năm sinh
     <input type="date" id="empDob" value="${e.dob||""}">
    </label>
    <label>Giới tính
     <select id="empGender">
      <option value="" ${!e.gender?"selected":""}>— Chưa chọn —</option>
      <option value="Nam" ${e.gender==="Nam"?"selected":""}>Nam</option>
      <option value="Nữ" ${e.gender==="Nữ"?"selected":""}>Nữ</option>
      <option value="Khác" ${e.gender==="Khác"?"selected":""}>Khác</option>
     </select>
    </label>
    <label>Nơi sinh
     <input id="empPob" value="${esc(e.pob||"Cần Thơ")}" placeholder="Cần Thơ">
    </label>
    <label>Quốc tịch
     <input id="empNationality" value="${esc(e.nationality||"Việt Nam")}" placeholder="Việt Nam">
    </label>
    <label>Dân tộc
     <input id="empEthnicity" value="${esc(e.ethnicity||"Kinh")}" placeholder="Kinh">
    </label>
   </div>
   <div class="emp-grid-4">
    <label>Tình trạng hôn nhân
     <select id="empMaritalStatus">
      <option value="" ${!e.maritalStatus?"selected":""}>— Chưa chọn —</option>
      <option value="Độc thân" ${e.maritalStatus==="Độc thân"?"selected":""}>Độc thân</option>
      <option value="Đã kết hôn" ${e.maritalStatus==="Đã kết hôn"?"selected":""}>Đã kết hôn</option>
      <option value="Khác" ${e.maritalStatus==="Khác"?"selected":""}>Khác</option>
     </select>
    </label>
    <label>Số điện thoại
     <input id="empPhone" value="${esc(e.phone||"")}" placeholder="09xx xxx xxx">
    </label>
    <label>Điện thoại phụ
     <input id="empPhone2" value="${esc(e.phone2||"")}">
    </label>
    <label>Email
     <input id="empEmail" type="email" value="${esc(e.email||"")}">
    </label>
   </div>
  </div>

  <!-- 2 - GIẤY TỜ TUỲ THÂN -->
  <div class="emp-section">
   <div class="emp-section-title">2 - GIẤY TỜ TUỲ THÂN</div>
   <div class="emp-grid-4">
    <label>Số CCCD / CMND
     <input id="empIdCard" value="${esc(e.idCard||"")}" placeholder="092xxxxxxxxxx">
     <span class="helper-text">9 đến 12 chữ số, không trùng giữa các nhân sự</span>
    </label>
    <label>Ngày cấp
     <input type="date" id="empIdCardDate" value="${e.idCardDate||""}">
    </label>
    <label>Nơi cấp
     <input id="empIdCardPlace" value="${esc(e.idCardPlace||"Cục Cảnh sát QLHC về TTXH")}" placeholder="Cục Cảnh sát QLHC về TTXH">
    </label>
    <label>Ngày hết hạn
     <input type="date" id="empIdCardExp" value="${e.idCardExp||""}">
    </label>
   </div>
  </div>

  <!-- 3 - ĐỊA CHỈ VÀ LIÊN HỆ KHẤN CẤP -->
  <div class="emp-section">
   <div class="emp-section-title">3 - ĐỊA CHỈ VÀ LIÊN HỆ KHẤN CẤP</div>
   <div class="emp-grid-1">
    <label>Địa chỉ thường trú
     <input id="empPermAddress" value="${esc(e.permAddress||"")}" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành">
    </label>
    <label>Địa chỉ tạm trú / nơi ở hiện tại
     <input id="empTempAddress" value="${esc(e.tempAddress||"")}">
    </label>
   </div>
   <div class="emp-grid-3">
    <label>Người liên hệ khi khẩn cấp
     <input id="empEmergencyContact" value="${esc(e.emergencyContact||"")}">
    </label>
    <label>Điện thoại người liên hệ
     <input id="empEmergencyPhone" value="${esc(e.emergencyPhone||"")}">
    </label>
    <label>Quan hệ
     <input id="empEmergencyRelation" value="${esc(e.emergencyRelation||"")}" placeholder="Cha / Mẹ / Vợ / Chồng">
    </label>
   </div>
  </div>

  <!-- 4 - HỌC VẤN -->
  <div class="emp-section">
   <div class="emp-section-title">4 - HỌC VẤN</div>
   <div class="emp-grid-3">
    <label>Trình độ
     <select id="empEduLevel">
      <option value="" ${!e.eduLevel?"selected":""}>— Chưa chọn —</option>
      <option value="Trung học" ${e.eduLevel==="Trung học"?"selected":""}>Trung học</option>
      <option value="Cao đẳng" ${e.eduLevel==="Cao đẳng"?"selected":""}>Cao đẳng</option>
      <option value="Đại học" ${e.eduLevel==="Đại học"?"selected":""}>Đại học</option>
      <option value="Thạc sĩ" ${e.eduLevel==="Thạc sĩ"?"selected":""}>Thạc sĩ</option>
      <option value="Tiến sĩ" ${e.eduLevel==="Tiến sĩ"?"selected":""}>Tiến sĩ</option>
      <option value="Khác" ${e.eduLevel==="Khác"?"selected":""}>Khác</option>
     </select>
    </label>
    <label>Trường
     <input id="empEduSchool" value="${esc(e.eduSchool||"")}">
    </label>
    <label>Chuyên ngành
     <input id="empEduMajor" value="${esc(e.eduMajor||"")}">
    </label>
   </div>
  </div>

  <!-- 5 - CÔNG VIỆC VÀ HỢP ĐỒNG -->
  <div class="emp-section">
   <div class="emp-section-title">5 - CÔNG VIỆC VÀ HỢP ĐỒNG</div>
   <div class="emp-grid-7">
    <label>Bộ phận <span class="req-star">*</span>
     <select id="empDept">
      ${depts.map(d=>`<option value="${esc(d)}" ${e.dept===d?"selected":""}>${esc(d)}</option>`).join("")}
      <option value="__ADD_DEPT__">⚙️ Quản lý / Thêm bộ phận...</option>
     </select>
    </label>
    <label>Vị trí / chức danh
     <input id="empTitle" value="${esc(e.title||"")}" placeholder="vd: Quay - dựng">
    </label>
    <label>Quản lý trực tiếp
     <select id="empManagerId">
      <option value="">— Không —</option>
      ${state.accounts.map(a=>`<option value="${a.id}" ${e.managerId===a.id?"selected":""}>${esc(a.name)} (${esc(ROLE_NAMES[a.role]||a.role)})</option>`).join("")}
     </select>
    </label>
    <label>Loại hợp đồng <span class="req-star">*</span>
     <select id="empContractType">
      <option value="Chính thức" ${e.contractType==="Chính thức"?"selected":""}>Chính thức</option>
      <option value="Thử việc" ${e.contractType==="Thử việc"?"selected":""}>Thử việc</option>
      <option value="Học việc" ${e.contractType==="Học việc"?"selected":""}>Học việc</option>
      <option value="Thỏa thuận" ${e.contractType==="Thỏa thuận"?"selected":""}>Thỏa thuận</option>
      <option value="Freelance" ${e.contractType==="Freelance"?"selected":""}>Freelance</option>
     </select>
    </label>
    <label>Số hợp đồng
     <input id="empContractNum" value="${esc(e.contractNum||"")}" placeholder="HDLD-2026-019">
    </label>
    <label>Hợp đồng từ ngày
     <input type="date" id="empContractFrom" value="${e.contractFrom||""}">
    </label>
    <label>Hợp đồng đến ngày
     <input type="date" id="empContractTo" value="${e.contractTo||""}">
     <span class="helper-text">Bỏ trống nếu hợp đồng không xác định thời hạn</span>
    </label>
   </div>

   <div class="emp-grid-6">
    <label>Hết thử việc
     <input type="date" id="empProbationEnd" value="${e.probationEnd||""}">
    </label>
    <label>Ca mặc định
     <select id="empShift">
      <option value="" ${!e.shift?"selected":""}>— Không —</option>
      <option value="Ca hành chính" ${e.shift==="Ca hành chính"?"selected":""}>Ca hành chính (8h-17h)</option>
      <option value="Ca sáng" ${e.shift==="Ca sáng"?"selected":""}>Ca sáng</option>
      <option value="Ca tối" ${e.shift==="Ca tối"?"selected":""}>Ca tối</option>
     </select>
    </label>
    <label>Ngày vào làm
     <input type="date" id="empJoinDate" value="${e.joinDate||""}">
    </label>
    <label>Ngày nghỉ việc
     <input type="date" id="empLeaveDate" value="${e.leaveDate||""}">
     <span class="helper-text">Điền khi nhân sự báo nghỉ</span>
    </label>
    <label>Trạng thái
     <select id="empStatus">
      <option value="Đang làm việc" ${e.status!=="Đã nghỉ việc"&&e.status!=="Tạm ngưng"?"selected":""}>Đang làm việc</option>
      <option value="Đã nghỉ việc" ${e.status==="Đã nghỉ việc"?"selected":""}>Đã nghỉ việc</option>
      <option value="Tạm ngưng" ${e.status==="Tạm ngưng"?"selected":""}>Tạm ngưng</option>
     </select>
    </label>
    <label>Giới hạn OFF / tháng
     <input type="number" id="empOffLimit" value="${e.offLimit??2}">
    </label>
   </div>
  </div>

  <!-- 6 - LƯƠNG, NGÂN HÀNG, BẢO HIỂM -->
  <div class="emp-section">
   <div class="emp-section-title">6 - LƯƠNG, NGÂN HÀNG, BẢO HIỂM</div>
   <div class="emp-grid-7">
    <label>Lương cơ bản (đ/tháng)
     <input type="text" inputmode="numeric" id="empBase" value="${fmtNumDots(e.base||0)}">
     <span class="helper-text">Để 0 nếu tính theo giờ</span>
    </label>
    <label>Đơn giá giờ (đ)
     <input type="text" inputmode="numeric" id="empHourlyRate" value="${fmtNumDots(e.hourlyRate||0)}">
     <span class="helper-text">Dùng cho freelancer và lương theo ca</span>
    </label>
    <label>Phụ cấp (VNĐ)
     <input type="text" inputmode="numeric" id="empAllowance" value="${fmtNumDots(e.allowance||0)}">
    </label>
    <label>Hình thức lương
     <select id="empSalaryType">
      <option value="month" ${e.salaryType==="month"?"selected":""}>Tháng (Lương cố định)</option>
      <option value="day" ${e.salaryType==="day"?"selected":""}>Ngày (Tính theo ngày công)</option>
      <option value="hour" ${e.salaryType==="hour"?"selected":""}>Giờ (Tính theo giờ làm)</option>
     </select>
    </label>
    <label>Ngân hàng
     <input id="empBankName" value="${esc(e.bankName||"Vietcombank")}" placeholder="Vietcombank">
    </label>
    <label>Số tài khoản
     <input id="empBankAcc" value="${esc(e.bankAcc||"")}">
    </label>
    <label>Chủ tài khoản
     <input id="empBankHolder" value="${esc(e.bankHolder||"")}" placeholder="Ghi đúng như trên thẻ, không dấu">
    </label>
   </div>

   <div class="emp-grid-3">
    <label>Mã số thuế cá nhân
     <input id="empTaxId" value="${esc(e.taxId||"")}">
    </label>
    <label>Số sổ BHXH
     <input id="empSocialIns" value="${esc(e.socialIns||"")}">
    </label>
    <label>Số thẻ BHYT
     <input id="empHealthIns" value="${esc(e.healthIns||"")}">
    </label>
   </div>

   <div class="emp-grid-1">
    <label>Ghi chú
     <input id="empNote" value="${esc(e.note||"")}">
    </label>
   </div>
  </div>

  <!-- 7 - TÀI KHOẢN ĐĂNG NHẬP -->
  <div class="emp-section" style="border-bottom:none;margin-bottom:10px;padding-bottom:0;">
   <div class="emp-section-title">7 - TÀI KHOẢN ĐĂNG NHẬP</div>
   <label style="flex-direction:row;align-items:center;gap:10px;cursor:pointer;">
    <input type="checkbox" id="empCreateAccount" ${state.accounts.some(a=>a.employeeId===e.id||a.username===e.id)?"checked":""}>
    <span>Tạo tài khoản đăng nhập cho nhân sự này</span>
   </label>
  </div>

  <!-- ACTIONS -->
  <div class="modal-actions">
   <button class="save-btn" id="saveEmp">Lưu hồ sơ</button>
   <button class="outline closeModal" type="button">Hủy</button>
  </div>
 </div></div>`;
 document.body.insertAdjacentHTML("beforeend",html);
 bindMoneyInput(document.getElementById("empBase"));
 bindMoneyInput(document.getElementById("empHourlyRate"));
 bindMoneyInput(document.getElementById("empAllowance"));

 const empNameEl = document.getElementById("empName");
 const empDobEl = document.getElementById("empDob");
 const empIdEl = document.getElementById("empId");
 const autoGen = () => {
  if(!existing) {
   empIdEl.value = generateEmpId(empNameEl.value, empDobEl.value);
  }
 };
 empNameEl.addEventListener("input", autoGen);
 empDobEl.addEventListener("input", autoGen);
 empDobEl.addEventListener("change", autoGen);

 document.querySelectorAll(".closeModal").forEach(b => b.onclick = () => document.querySelector(".modal")?.remove());
 document.getElementById("empDept").onchange=(ev)=>{
  if(ev.target.value==="__ADD_DEPT__"){ document.querySelector(".modal").remove(); showPage("accounts"); customDeptModal(); }
 };

 document.getElementById("saveEmp").onclick=()=>{
  const id=document.getElementById("empId").value.trim(), name=document.getElementById("empName").value.trim(), dob=document.getElementById("empDob").value;
  if(!id||!name){toast("Vui lòng nhập đủ Mã nhân viên và Họ tên.","bad");return}

  const empData = {
   id, name, dob,
   gender: document.getElementById("empGender").value,
   pob: document.getElementById("empPob").value.trim(),
   nationality: document.getElementById("empNationality").value.trim(),
   ethnicity: document.getElementById("empEthnicity").value.trim(),
   maritalStatus: document.getElementById("empMaritalStatus").value,
   phone: document.getElementById("empPhone").value.trim(),
   phone2: document.getElementById("empPhone2").value.trim(),
   email: document.getElementById("empEmail").value.trim(),

   idCard: document.getElementById("empIdCard").value.trim(),
   idCardDate: document.getElementById("empIdCardDate").value,
   idCardPlace: document.getElementById("empIdCardPlace").value.trim(),
   idCardExp: document.getElementById("empIdCardExp").value,

   permAddress: document.getElementById("empPermAddress").value.trim(),
   tempAddress: document.getElementById("empTempAddress").value.trim(),
   emergencyContact: document.getElementById("empEmergencyContact").value.trim(),
   emergencyPhone: document.getElementById("empEmergencyPhone").value.trim(),
   emergencyRelation: document.getElementById("empEmergencyRelation").value.trim(),

   eduLevel: document.getElementById("empEduLevel").value,
   eduSchool: document.getElementById("empEduSchool").value.trim(),
   eduMajor: document.getElementById("empEduMajor").value.trim(),

   dept: document.getElementById("empDept").value,
   sub: existing?.sub || getAvailableSubs()[0] || "MKT",
   title: document.getElementById("empTitle").value.trim(),
   managerId: document.getElementById("empManagerId").value,
   contractType: document.getElementById("empContractType").value,
   contractNum: document.getElementById("empContractNum").value.trim(),
   contractFrom: document.getElementById("empContractFrom").value,
   contractTo: document.getElementById("empContractTo").value,
   probationEnd: document.getElementById("empProbationEnd").value,
   shift: document.getElementById("empShift").value,
   joinDate: document.getElementById("empJoinDate").value,
   leaveDate: document.getElementById("empLeaveDate").value,
   status: document.getElementById("empStatus").value,
   offLimit: +document.getElementById("empOffLimit").value || 2,

   base: parseMoneyInput(document.getElementById("empBase").value),
   hourlyRate: parseMoneyInput(document.getElementById("empHourlyRate").value),
   allowance: parseMoneyInput(document.getElementById("empAllowance").value),
   salaryType: document.getElementById("empSalaryType").value,
   bankName: document.getElementById("empBankName").value.trim(),
   bankAcc: document.getElementById("empBankAcc").value.trim(),
   bankHolder: document.getElementById("empBankHolder").value.trim(),
   taxId: document.getElementById("empTaxId").value.trim(),
   socialIns: document.getElementById("empSocialIns").value.trim(),
   healthIns: document.getElementById("empHealthIns").value.trim(),
   note: document.getElementById("empNote").value.trim(),
   active: document.getElementById("empStatus").value === "Đang làm việc",
   locations: existing?.locations || ["loc1"]
  };

  if(existing){
   Object.assign(existing, empData);
  } else {
   if(state.employees.some(x=>x.id===id)){toast("Mã nhân viên đã tồn tại.","bad");return}
   state.employees.push(empData);
  }

  const createAcc = document.getElementById("empCreateAccount").checked;
  if(createAcc){
   let acc = state.accounts.find(a => a.employeeId === id || a.username.toLowerCase() === id.toLowerCase());
   if(!acc){
    state.accounts.push({
     id: "ACC" + String(Date.now()).slice(-8),
     username: id,
     name: name,
     role: "EMP",
     dept: empData.dept,
     employeeId: id,
     active: true,
     password: "SHK86@123"
    });
   } else {
    acc.name = name;
    acc.dept = empData.dept;
    acc.employeeId = id;
   }
  }

  save();
  document.querySelector(".modal")?.remove();
  showPage("employees");
  toast(existing?"Đã cập nhật hồ sơ nhân sự.":"Đã thêm nhân sự mới thành công.");
 };
}

function roleLabel(){return ROLE_NAMES[state.role]||state.role}
function navItems(){
 const common=[["dashboard","Tổng quan","▦"],["attendance","Chấm công","◷"],["employees","Nhân sự","♙"],["approvals","Giải trình & duyệt","✓"],["leave","Nghỉ phép","☷"],["payroll","Tính lương","₫"],["reports","Báo cáo","▤"],["accounts","Tài khoản & quyền","♟"],["settings","Cấu hình","⚙"]];
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
  <aside class="sidebar">
   <div class="brand"><img src="${window.SHK_LOGO}"><div><b>SHK 86</b><small>HRM System</small></div></div>
   <nav class="nav">${navItems().map(([id,lbl,icon])=>`<button class="navitem ${state.page===id?"active":""}" data-page="${id}"><span class="icon">${icon}</span><span>${lbl}</span></button>`).join("")}</nav>
   <div class="sidefoot">SHK 86 • 186 Hồ Bún Xáng, Cần Thơ<br>Hotline: 0932454245</div>
  </aside>
  <main class="content">
   <header class="topbar">
    <div class="topleft"><h2>${(navItems().find(x=>x[0]===state.page)||[,"Tổng quan"])[1]}</h2><span class="tag role">${roleLabel()}</span></div>
    <div class="topright"><span class="user">👤 ${esc(state.user)}</span><button class="outline small" id="logout">Đăng xuất</button></div>
   </header>
   <div class="page" id="pageContent"></div>
  </main>
 </div>`;
 document.querySelectorAll(".navitem").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
 document.getElementById("logout").onclick=()=>{sessionStorage.removeItem("shk86_session");session=null;renderLogin()};
 showPage(state.page||"dashboard");
}

function showPage(p){
 state.page=p;
 const el=document.getElementById("pageContent");
 if(!el)return;
 document.querySelectorAll(".navitem").forEach(b=>b.classList.toggle("active",b.dataset.page===p));
 if(p==="dashboard") el.innerHTML=dashboard();
 if(p==="attendance") el.innerHTML=attendance();
 if(p==="employees") el.innerHTML=employees();
 if(p==="approvals") el.innerHTML=approvals();
 if(p==="leave") el.innerHTML=leave();
 if(p==="payroll") el.innerHTML=payroll();
 if(p==="reports") el.innerHTML=reports();
 if(p==="accounts") el.innerHTML=accounts();
 if(p==="settings") el.innerHTML=settings();
 bind(p);
}

function card(title,val,sub){return `<div class="card"><h4>${title}</h4><div class="val">${val}</div><div class="sub">${sub}</div></div>`}
function dashboard(){
 return `<div class="grid4">${card("Nhân sự active",state.employees.length,"Đang làm việc")} ${card("Hôm nay đã check-in",state.attendance.filter(a=>a.type==="IN").length,"Check-in hợp lệ")} ${card("Đơn chờ duyệt",state.explanations.filter(x=>x.status!=="approved").length,"Giải trình & nghỉ phép")} ${card("Giờ công tích lũy",calcHours().toFixed(1)+"h","Tính từ check-in/out")}</div><div class="two"><div class="panel"><div class="panelhead"><h3>Hoạt động chấm công mới nhất</h3><span class="tag">Realtime demo</span></div><table><thead><tr><th>Nhân sự</th><th>Vị trí</th><th>Loại</th><th>Thời gian</th><th>Trạng thái</th></tr></thead><tbody>${state.attendance.slice(-5).reverse().map(a=>`<tr><td><b>${esc(a.emp)}</b></td><td>${esc(a.location)}</td><td><span class="tag ${a.type==="IN"?"green":"blue"}">${a.type}</span></td><td>${a.time}</td><td><span class="tag green">Valid</span></td></tr>`).join("")||`<tr><td colspan="5" class="empty">Chưa có dữ liệu chấm công.</td></tr>`}</tbody></table></div><div class="panel"><div class="panelhead"><h3>Thông báo hệ thống</h3></div><ul class="news"><li>Chính sách đi trễ: quá 6 phút tính đi trễ.</li><li>Cần bật GPS & camera khi chấm công.</li><li>Chức năng tính lương tự động cập nhật từ bảng công.</li></ul></div></div>`;
}

function attendance(){
 const loc=state.locations[0];
 return `<div class="atten-wrap"><div class="clockcard"><div class="clock" id="clock">${fmtTime()}</div><div class="date">${fmtDate()}</div><div class="place" id="placeText">Đang định vị GPS...</div></div><div class="two"><div class="panel"><div class="panelhead"><h3>Xác thực chấm công</h3></div><div class="formgrid"><label>Vị trí làm việc<select id="locPick">${state.locations.map(l=>`<option value="${l.id}">${esc(l.name)}</option>`).join("")}</select></label><div class="gpsbox" id="gpsState"><span>Chưa xác nhận GPS</span><button class="small outline" type="button">Lấy GPS</button></div></div><div class="statusrow"><span>GPS: <b id="geoStatus" class="tag gray">Chưa lấy</b></span><span>WiFi: <b class="tag blue">Đã kết nối</b></span></div><div class="camerabox"><video id="video" autoplay playsinline></video><canvas id="canvas" style="display:none"></canvas><div class="camcontrols"><button class="outline" id="selfieBtn">Mở camera</button><span id="selfieState">—</span></div></div><div class="btnrow"><button class="primary green" id="checkin">CHECK-IN</button><button class="primary blue" id="checkout">CHECK-OUT</button></div></div><div class="panel"><div class="panelhead"><h3>Nhật ký chấm công</h3></div><div class="locationbox" id="locationbox"><b>Chưa có tọa độ</b></div><table><thead><tr><th>Thời gian</th><th>Loại</th><th>Địa điểm</th><th>Khoảng cách</th><th>Tải ảnh</th></tr></thead><tbody>${state.attendance.map(a=>`<tr><td>${a.time}</td><td><span class="tag ${a.type==="IN"?"green":"blue"}">${a.type}</span></td><td>${esc(a.location)}</td><td>${a.distance?.toFixed(1)}m</td><td>${a.selfie?`<a href="${a.selfie}" target="_blank">Xem ảnh</a>`:"—"}</td></tr>`).join("")||`<tr><td colspan="5" class="empty">Chưa có nhật ký.</td></tr>`}</tbody></table></div></div></div>`;
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
 const loc=state.locations.find(l=>l.id===document.getElementById("locPick").value);
 if(!selfieData){toast("Bắt buộc chụp selfie.","bad");return}
 if(!window._gps){toast("Chưa xác nhận GPS.","bad");return}
 const maxAcc=state.settings.maxAccuracy||150;
 if(window._gps.accuracy>maxAcc){toast(`Độ chính xác GPS không đạt (${window._gps.accuracy.toFixed(0)}m > ${maxAcc}m).`,"bad");return}
 if(window._gps.distance>state.settings.radius){toast(`Ngoài bán kính ${state.settings.radius}m.`,"bad");return}
 const d=new Date(), emp=state.employees[0];
 state.attendance.push({id:crypto.randomUUID(),emp:emp.name,empId:emp.id,type,ts:d.toISOString(),time:fmtTime(d),location:loc.name,distance:window._gps.distance,accuracy:window._gps.accuracy,wifi:"configured",selfie:selfieData,status:"valid"});
 save();selfieData=null;document.getElementById("selfieState").textContent="—";toast(`${type==="IN"?"Check-in":"Check-out"} thành công.`);showPage("attendance");
}
async function getGPS(){
 const loc=state.locations.find(l=>l.id===document.getElementById("locPick").value);
 if(loc.lat==null||loc.lng==null){toast("HR chưa cấu hình tọa độ địa điểm. Vào Cấu hình → Địa điểm.","bad");return}
 navigator.geolocation.getCurrentPosition(p=>{
  const {latitude,longitude,accuracy}=p.coords,d=dist(latitude,longitude,loc.lat,loc.lng);
  window._gps={latitude,longitude,accuracy,distance:d};
  const maxAcc=state.settings.maxAccuracy||150;
  const isAccOk=accuracy<=maxAcc, isDistOk=d<=state.settings.radius;
  document.getElementById("gpsState").textContent=isAccOk&&isDistOk?"✓":"✕";
  document.getElementById("geoStatus").className="tag "+(isAccOk&&isDistOk?"green":"red");
  document.getElementById("geoStatus").textContent=isAccOk&&isDistOk?`Hợp lệ • ${d.toFixed(1)}m`:(!isDistOk?`Ngoài bán kính • ${d.toFixed(1)}m`:`Sai số GPS cao • ${accuracy.toFixed(0)}m`);
  document.getElementById("placeText").textContent=`${loc.name} • ${d.toFixed(1)}m • Accuracy ${accuracy.toFixed(1)}m`;
  document.getElementById("locationbox").innerHTML=`<b>${d.toFixed(1)}m</b> từ tâm địa điểm<br><small>GPS accuracy: ${accuracy.toFixed(1)}m (Tối đa cho phép: ${maxAcc}m)</small>`;
 },e=>toast("Không lấy được GPS: "+e.message,"bad"),{enableHighAccuracy:true,maximumAge:0,timeout:10000});
}
function employees(){
 const canManage = can("employee.manage");
 return `<div class="toolbar"><input id="empSearch" placeholder="Tìm nhân sự mới...">${canManage?`<button class="primary" id="addEmp">+ Thêm nhân sự mới</button>`:""}</div><div class="panel"><table><thead><tr><th>Mã NV</th><th>Họ tên</th><th>Ngày sinh</th><th>Số ĐT</th><th>Bộ phận</th><th>Vị trí / Chức danh</th><th>Loại HĐ</th><th>Lương CB</th><th>Trạng thái</th>${canManage?"<th>Thao tác</th>":""}</tr></thead><tbody>${state.employees.map(e=>`<tr><td><b>${esc(e.id)}</b></td><td><b>${esc(e.name)}</b></td><td>${e.dob?esc(e.dob.split("-").reverse().join("/")):"—"}</td><td>${esc(e.phone||"—")}</td><td><span class="tag blue">${esc(e.dept)}</span></td><td>${esc(e.title||"—")}</td><td><span class="tag">${esc(e.contractType||"Chính thức")}</span></td><td>${money(e.base)}</td><td><span class="tag ${e.status==="Đã nghỉ việc"?"red":e.status==="Tạm ngưng"?"orange":"green"}">${esc(e.status||"Đang làm việc")}</span></td>${canManage?`<td><button class="small outline editEmpBtn" data-id="${esc(e.id)}">Sửa hồ sơ</button></td>`:""}</tr>`).join("")}</tbody></table></div>`;
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
 return `<div class="payhero"><div><span class="eyebrow">KỲ LƯƠNG</span><h2>${state.payroll.period}</h2><p>Payroll lấy dữ liệu từ bảng công, nghỉ phép, OT, KPI, phụ cấp, thưởng/phạt.</p></div><button class="${state.payroll.closed?"outline":"primary"}" id="closePayroll">${state.payroll.closed?"🔒 Đã chốt":"🔒 Chốt kỳ công"}</button></div><div class="panel"><table><thead><tr><th>Nhân sự</th><th>Bộ phận</th><th>Loại</th><th>Lương tính</th><th>Phụ cấp</th><th>KPI</th><th>OT</th><th>Tổng</th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${esc(x.name)}</b></td><td>${esc(x.dept)} / ${esc(x.sub)}</td><td>${x.salaryType}</td><td>${money(x.baseCalc)}</td><td>${money(x.allowance)}</td><td>${money(x.kpi)}</td><td>${money(x.ot)}</td><td><b>${money(x.total)}</b></td></tr>`).join("")}</tbody></table></div>`;
}
function reports(){
 return `<div class="grid3">${card("Báo cáo công","Theo ngày/tháng","Bộ phận • nhân sự • địa điểm")} ${card("Báo cáo OT",state.employees.reduce((s,e)=>s+e.ot,0)?"Có dữ liệu":"0","Có thể export")} ${card("Payroll",money(state.employees.reduce((s,e)=>s+(e.salaryType==="month"?e.base:e.salaryType==="day"?e.base*26:e.base*208)+e.allowance+e.kpi+e.ot,0)),"Tổng mẫu hiện tại")}</div><div class="panel"><div class="panelhead"><h3>Xuất dữ liệu</h3></div><button class="primary" id="exportJson">Xuất JSON</button> <button class="outline" id="exportCsv">Xuất CSV bảng lương</button></div>`;
}
function settings(){
 const loc=state.locations[0];
 return `<div class="two">
  <div class="panel">
   <div class="panelhead"><h3>Quy định chấm công & Thiết bị</h3></div>
   <label>Bán kính GPS (m)<input id="radius" type="number" value="${state.settings.radius}"></label>
   <label>Độ sai số GPS cho phép (m)<input id="maxAccuracy" type="number" value="${state.settings.maxAccuracy||150}" placeholder="Mặc định 150m cho PC, 20m cho Mobile"></label>
   <label>IP Router / Gateway WiFi<input id="routerIp" value="${esc(state.settings.routerIp||"192.168.1.1")}" placeholder="VD: 192.168.1.1"></label>
   <label style="flex-direction:row;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="checkRouterIp" ${state.settings.checkRouterIp?"checked":""}> Kiểm tra IP thiết bị khi kết nối WiFi</label>
   <label>Ngưỡng đi trễ (phút)<input value="6" disabled></label>
   <label>Chuẩn giờ công/ngày<input value="${state.settings.standardHours}" disabled></label>
   <button class="primary" id="saveRules">Lưu quy định & IP Router</button>
  </div>
  <div class="panel">
   <div class="panelhead"><h3>Địa điểm làm việc</h3></div>
   <label>Tên địa điểm<input id="locName" value="${esc(loc.name)}"></label>
   <label>Latitude<input id="locLat" value="${loc.lat??""}" placeholder="Bấm lấy vị trí hiện tại"></label>
   <label>Longitude<input id="locLng" value="${loc.lng??""}"></label>
   <label>WiFi/BSSID cấu hình<input id="wifi" value="${esc(loc.wifi)}" placeholder="SSID/BSSID"></label>
   <button class="outline" id="getAdminGPS">Lấy tọa độ hiện tại</button> <button class="primary" id="saveLoc">Lưu địa điểm</button>
   <div class="note">Địa chỉ công ty: <b>186 Hồ Bún Xáng, Cần Thơ</b>. Bản quyền thuộc về <b>SHK 86</b> (SĐT: 0932454245).</div>
  </div>
 </div>
 <div class="panel"><div class="panelhead"><h3>Phân quyền vai trò</h3></div><div class="permission"><b>BGĐ</b><span>Xem toàn bộ • dashboard • báo cáo • phê duyệt cấp cao</span><b>Trưởng bộ phận</b><span>Nhân sự thuộc phạm vi • duyệt giải trình</span><b>HR Cấp 1</b><span>Kiểm duyệt công • xử lý bất thường</span><b>HR Cấp 2</b><span>Chốt dữ liệu • payroll • báo cáo</span><b>Nhân sự</b><span>Chấm công • nghỉ phép • giải trình • xem lương cá nhân</span></div></div>`;
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
  getGPS();
 }
 if(page==="employees"){
  document.getElementById("addEmp")?.addEventListener("click",()=>employeeModal());
  document.querySelectorAll(".editEmpBtn").forEach(b=>b.onclick=()=>employeeModal(state.employees.find(e=>e.id===b.dataset.id)));
  document.getElementById("empSearch")?.addEventListener("input",(ev)=>{
   const q=ev.target.value.toLowerCase().trim();
   document.querySelectorAll("tbody tr").forEach(row=>{
    const text=row.innerText.toLowerCase();
    row.style.display=text.includes(q)?"":"none";
   });
  });
 }
 if(page==="approvals") document.querySelectorAll(".approve").forEach(b=>b.onclick=()=>{const x=state.explanations.find(e=>e.id===b.dataset.id);x.status=state.role==="MANAGER"?"hr1":"approved";save();showPage("approvals");toast("Đã chuyển bước phê duyệt.")});
 if(page==="payroll") document.getElementById("closePayroll").onclick=()=>{if(!state.payroll.closed){state.payroll.closed=true;save();showPage("payroll");toast("Đã chốt kỳ công.");}};
 if(page==="settings"){
  document.getElementById("saveRules").onclick=()=>{
   state.settings.radius=+document.getElementById("radius").value||50;
   state.settings.maxAccuracy=+document.getElementById("maxAccuracy").value||150;
   state.settings.routerIp=document.getElementById("routerIp").value.trim();
   state.settings.checkRouterIp=document.getElementById("checkRouterIp").checked;
   save();toast("Đã lưu quy định & cấu hình IP Router.");showPage("settings");
  };
  document.getElementById("getAdminGPS").onclick=()=>navigator.geolocation.getCurrentPosition(p=>{locLat.value=p.coords.latitude;locLng.value=p.coords.longitude;toast("Đã lấy tọa độ hiện tại.")},e=>toast(e.message,"bad"),{enableHighAccuracy:true});
  document.getElementById("saveLoc").onclick=()=>{const l=state.locations[0];l.name=locName.value;l.lat=+locLat.value;l.lng=+locLng.value;l.wifi=wifi.value;l.radius=state.settings.radius;save();toast("Đã lưu địa điểm.");};
 }
 if(page==="reports"){
  document.getElementById("exportJson").onclick=downloadJSON;
  document.getElementById("exportCsv").onclick=downloadCSV;
 }
 if(page==="accounts"){
  document.getElementById("addAccount")?.addEventListener("click",()=>accountModal());
  document.querySelectorAll(".editAccount").forEach(b=>b.onclick=()=>accountModal(state.accounts.find(a=>a.id===b.dataset.id)));
  document.querySelectorAll(".toggleAccount").forEach(b=>b.onclick=()=>{const a=state.accounts.find(x=>x.id===b.dataset.id); if(a.id===currentAccount()?.id){toast("Không thể tự khóa tài khoản đang đăng nhập.","bad");return} a.active=!a.active; save(); showPage("accounts"); toast(a.active?"Đã mở khóa tài khoản.":"Đã khóa tài khoản.");});
  
  document.querySelectorAll(".role-perm-matrix-cb").forEach(cb=>{
   cb.onchange=()=>{
    const roleKey=cb.dataset.role;
    const permCode=cb.dataset.perm;
    if(!PERMISSIONS[roleKey]) PERMISSIONS[roleKey]=[];
    if(cb.checked){
     if(!PERMISSIONS[roleKey].includes(permCode)) PERMISSIONS[roleKey].push(permCode);
    } else {
     PERMISSIONS[roleKey]=PERMISSIONS[roleKey].filter(p=>p!==permCode);
    }
    state.customPermissions=PERMISSIONS;
    save();
    toast(`Đã cập nhật quyền cho vai trò ${ROLE_NAMES[roleKey]}.`);
   };
  });

  document.getElementById("addDeptBtn")?.addEventListener("click",()=>customDeptModal());
  document.getElementById("addSubBtn")?.addEventListener("click",()=>subDeptModal());
  document.querySelectorAll(".editDeptBtn").forEach(b=>b.onclick=()=>customDeptModal(b.dataset.name));
  document.querySelectorAll(".deleteDeptBtn").forEach(b=>b.onclick=()=>deleteCustomDept(b.dataset.name));
  document.querySelectorAll(".editSubBtn").forEach(b=>b.onclick=()=>subDeptModal(b.dataset.name));
  document.querySelectorAll(".deleteSubBtn").forEach(b=>b.onclick=()=>deleteSubDept(b.dataset.name));
 }
}
function download(name,content,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function downloadJSON(){download("shk86_hrm_backup.json",JSON.stringify(state,null,2),"application/json")}
function downloadCSV(){let s="Mã NV,Họ tên,Bộ phận,Loại lương,Lương,Phụ cấp,KPI,OT,Tổng\n";for(const e of state.employees){const base=e.salaryType==="month"?e.base:e.salaryType==="day"?e.base*26:e.base*208;s+=`${e.id},"${e.name}","${e.dept}","${e.salaryType}",${base},${e.allowance},${e.kpi},${e.ot},${base+e.allowance+e.kpi+e.ot}\n`}download("shk86_payroll.csv","\ufeff"+s,"text/csv;charset=utf-8")}
render();
