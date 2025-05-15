// ไฟล์ script.js

// ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือไม่ตอนเริ่มต้น
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('multispace_current_user'));
    
    if (currentUser) {
        // ถ้ามีข้อมูลผู้ใช้ใน localStorage แสดงหน้าหลักของแอป
        showAppPage(currentUser);
    } else {
        // แสดงหน้า login ถ้ายังไม่ได้ล็อกอิน
        document.getElementById('loginPage').classList.remove('hidden');
    }

    // เริ่มต้นระบบลงทะเบียนและล็อกอิน
    initLoginSystem();
    
    // เริ่มต้นส่วนการจองห้อง
    initBookingSystem();
});

// ฟังก์ชั่นสำหรับจัดการระบบ login และ register
function initLoginSystem() {
    // จัดการปุ่มไปหน้าลงทะเบียน
    document.getElementById('goToRegisterBtn').addEventListener('click', function() {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('registerPage').classList.remove('hidden');
    });
    
    // จัดการปุ่มกลับไปหน้าล็อกอิน
    document.getElementById('backToLoginBtn').addEventListener('click', function() {
        document.getElementById('registerPage').classList.add('hidden');
        document.getElementById('loginPage').classList.remove('hidden');
    });
    
    // จัดการฟอร์มล็อกอิน
    document.getElementById('loginBtn').addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // ตรวจสอบข้อมูลว่าง
        if (!username || !password) {
            alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
            return;
        }
        
        // ตรวจสอบผู้ใช้ admin
        if (username === 'admin' && password === 'admin123') {
            const adminUser = {
                studentId: 'admin',
                name: 'แอดมิน',
                role: 'admin'
            };
            
            // บันทึกข้อมูลการล็อกอิน
            localStorage.setItem('multispace_current_user', JSON.stringify(adminUser));
            
            // ไปยังหน้าแอดมิน (ถ้ามี)
            window.location.href = 'admin.html';
            return;
        }
        
        // ตรวจสอบผู้ใช้ทั่วไป
        const users = JSON.parse(localStorage.getItem('multispace_users')) || [];
        const user = users.find(user => user.studentId === username && user.password === password);
        
        if (!user) {
            alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            return;
        }
        
        // บันทึกข้อมูลการล็อกอิน
        localStorage.setItem('multispace_current_user', JSON.stringify(user));
        
        // แสดงหน้าหลักของแอป
        showAppPage(user);
    });
    
    // จัดการฟอร์มลงทะเบียน
    document.getElementById('confirmRegisterBtn').addEventListener('click', function() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const studentId = document.getElementById('studentId').value;
        const faculty = document.getElementById('faculty').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // ตรวจสอบข้อมูลว่าง
        if (!firstName || !lastName || !studentId || !faculty || !email || !password || !confirmPassword) {
            alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }
        
        // ตรวจสอบรหัสผ่านตรงกัน
        if (password !== confirmPassword) {
            alert('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
            return;
        }
        
        // ตรวจสอบว่ามีรหัสนักศึกษานี้ในระบบแล้วหรือไม่
        const users = JSON.parse(localStorage.getItem('multispace_users')) || [];
        if (users.some(user => user.studentId === studentId)) {
            alert('รหัสนักศึกษานี้มีในระบบแล้ว กรุณาใช้รหัสอื่น');
            return;
        }
        
        // สร้างข้อมูลผู้ใช้ใหม่
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            name: `${firstName} ${lastName}`,
            studentId: studentId,
            faculty: faculty,
            email: email,
            password: password
        };
        
        // เพิ่มผู้ใช้ใหม่ในระบบ
        users.push(newUser);
        localStorage.setItem('multispace_users', JSON.stringify(users));
        
        // แจ้งเตือนสำเร็จ
        alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสนักศึกษาและรหัสผ่านของคุณ');
        
        // กลับไปหน้าล็อกอิน
        document.getElementById('registerPage').classList.add('hidden');
        document.getElementById('loginPage').classList.remove('hidden');
        
        // เติมรหัสนักศึกษาในฟอร์มล็อกอิน
        document.getElementById('username').value = studentId;
    });
    
    // ปุ่มออกจากระบบ
    document.getElementById('logoutBtn').addEventListener('click', function() {
        // ลบข้อมูลผู้ใช้จาก localStorage
        localStorage.removeItem('multispace_current_user');
        
        // กลับไปหน้าล็อกอิน
        document.getElementById('appMain').classList.add('hidden');
        document.getElementById('loginPage').classList.remove('hidden');
    });
}

// แสดงหน้าหลักของแอป
function showAppPage(user) {
    // ซ่อนหน้า login และ register
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('registerPage').classList.add('hidden');
    
    // แสดงหน้าหลักของแอป
    document.getElementById('appMain').classList.remove('hidden');
    
    // แสดงข้อมูลผู้ใช้ที่มุมขวาบน
    document.getElementById('studentIdDisplay').textContent = `นักศึกษา: ${user.studentId} - ${user.name}`;
    
    // โหลดข้อมูลแผนก
    loadDepartments();
}

// ฟังก์ชั่นสำหรับจัดการระบบจองห้อง
function initBookingSystem() {
    // เริ่มต้นโหลดข้อมูลแผนก
    const departments = [
        { id: 1, name: 'วิศวกรรมโยธา', icon: '🏗️', color: 'bg-blue-500' },
        { id: 2, name: 'วิศวกรรมไฟฟ้า', icon: '⚡', color: 'bg-yellow-500' },
        { id: 3, name: 'วิศวกรรมเครื่องกล', icon: '⚙️', color: 'bg-red-500' },
        { id: 4, name: 'วิศวกรรมคอมพิวเตอร์', icon: '💻', color: 'bg-green-500' },
        { id: 5, name: 'วิศวกรรมเคมี', icon: '🧪', color: 'bg-purple-500' },
        { id: 6, name: 'วิศวกรรมอุตสาหการ', icon: '🏭', color: 'bg-orange-500' }
    ];
    
    // กำหนดข้อมูลแผนกให้กับเมทอด loadDepartments()
    window.loadDepartments = function() {
        const departmentsGrid = document.getElementById('departmentsGrid');
        departmentsGrid.innerHTML = '';
        
        departments.forEach(dept => {
            const deptCard = document.createElement('div');
            deptCard.className = `department-card ${dept.color} text-white rounded-lg shadow-lg p-6 transition-transform hover:transform hover:scale-105`;
            deptCard.innerHTML = `
                <div class="text-4xl mb-4">${dept.icon}</div>
                <h3 class="text-xl font-bold">${dept.name}</h3>
                <div class="mt-4">
                    <button class="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-100 view-labs-btn" data-dept-id="${dept.id}">
                        ดูห้องแลป
                    </button>
                </div>
            `;
            departmentsGrid.appendChild(deptCard);
            
            // เพิ่ม event listener ให้ปุ่ม "ดูห้องแลป"
            deptCard.querySelector('.view-labs-btn').addEventListener('click', function() {
                const deptId = this.getAttribute('data-dept-id');
                showLabsForDepartment(deptId);
            });
        });
    };
    
    // แสดงห้องแลปตามแผนก
    function showLabsForDepartment(deptId) {
        const dept = departments.find(d => d.id == deptId);
        if (!dept) return;
        
        // สร้างข้อมูลห้องแลปตัวอย่าง
        const labs = [
            { id: `${dept.id}-1`, name: `${dept.name} Lab 1`, capacity: 30, equipment: 'Computer, Projector' },
            { id: `${dept.id}-2`, name: `${dept.name} Lab 2`, capacity: 25, equipment: 'Electronic Toolkits' },
            { id: `${dept.id}-3`, name: `${dept.name} Lab 3`, capacity: 20, equipment: 'Experimental Setup' },
            { id: `${dept.id}-4`, name: `${dept.name} Lab 4`, capacity: 15, equipment: 'Testing Equipment' }
        ];
        
        // ซ่อนรายการแผนก และแสดงรายการห้องแลป
        document.getElementById('departmentList').style.display = 'none';
        document.getElementById('labList').style.display = 'block';
        
        // ตั้งชื่อแผนก
        document.getElementById('deptTitle').textContent = dept.name;
        
        // แสดงรายการห้องแลป
        const labsGrid = document.getElementById('labsGrid');
        labsGrid.innerHTML = '';
        
        labs.forEach(lab => {
            const labCard = document.createElement('div');
            labCard.className = `bg-white rounded-lg shadow-lg p-6 transition-transform hover:transform hover:scale-105`;
            labCard.innerHTML = `
                <h3 class="text-xl font-bold mb-2">${lab.name}</h3>
                <p class="text-gray-600 mb-1">ความจุ: ${lab.capacity} คน</p>
                <p class="text-gray-600 mb-4">อุปกรณ์: ${lab.equipment}</p>
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded book-lab-btn" data-lab-id="${lab.id}" data-lab-name="${lab.name}">
                    จองห้อง
                </button>
            `;
            labsGrid.appendChild(labCard);
            
            // เพิ่ม event listener ให้ปุ่ม "จองห้อง"
            labCard.querySelector('.book-lab-btn').addEventListener('click', function() {
                const labId = this.getAttribute('data-lab-id');
                const labName = this.getAttribute('data-lab-name');
                openBookingModal(labId, labName);
            });
        });
        
        // เพิ่ม event listener ให้ปุ่ม "กลับไปหน้าแผนก"
        document.getElementById('backToDeptBtn').addEventListener('click', function() {
            document.getElementById('labList').style.display = 'none';
            document.getElementById('departmentList').style.display = 'block';
        });
    }
    
    // เปิด Modal สำหรับจองห้อง
    function openBookingModal(labId, labName) {
        const modal = document.getElementById('bookingModal');
        modal.classList.add('show');
        
        // ตั้งชื่อห้องในหัวข้อ Modal
        document.getElementById('modalTitle').textContent = `จองห้อง ${labName}`;
        
        // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
        const currentUser = JSON.parse(localStorage.getItem('multispace_current_user'));
        if (currentUser) {
            document.getElementById('bookingStudentId').value = currentUser.studentId;
        }
        
        // กำหนดวันที่ขั้นต่ำเป็นวันนี้
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('bookingDate').min = today;
        
        // เพิ่ม event listener ให้ปุ่ม "ยกเลิก"
        document.getElementById('cancelBookingBtn').addEventListener('click', function() {
            closeBookingModal();
        });
        
        // เพิ่ม event listener ให้ปุ่ม "ยืนยันการจอง"
        document.getElementById('confirmBookingBtn').addEventListener('click', function() {
            // ตรวจสอบข้อมูลการจอง
            const date = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;
            const studentId = document.getElementById('bookingStudentId').value;
            const details = document.getElementById('bookingDetails').value;
            
            if (!date || !time || !studentId || !details) {
                alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
                return;
            }
            
            // สร้างข้อมูลการจอง
            const booking = {
                id: Date.now(), // ใช้ timestamp เป็น id
                labId: labId,
                labName: labName,
                date: date,
                time: time,
                studentId: studentId,
                details: details,
                status: 'pending' // สถานะเริ่มต้น: รอการอนุมัติ
            };
            
            // บันทึกข้อมูลการจอง
            const bookings = JSON.parse(localStorage.getItem('multispace_bookings')) || [];
            bookings.push(booking);
            localStorage.setItem('multispace_bookings', JSON.stringify(bookings));
            
            // แจ้งเตือนสำเร็จ
            alert(`จองห้อง ${labName} สำเร็จ! กรุณารอการอนุมัติจากเจ้าหน้าที่`);
            
            // ปิด Modal
            closeBookingModal();
        });
    }
    
    // ปิด Modal จองห้อง
    function closeBookingModal() {
        const modal = document.getElementById('bookingModal');
        modal.classList.remove('show');
        
        // รีเซ็ตฟอร์ม
        document.getElementById('bookingDate').value = '';
        document.getElementById('bookingTime').value = '';
        document.getElementById('bookingDetails').value = '';
    }
}