async function main() {
    // แทนที่ 'YOUR_LIFF_ID' ด้วย LIFF ID ที่คุณจะได้รับจาก LINE Developers Console
    await liff.init({ liffId: 'YOUR_LIFF_ID' });

    // ตรวจสอบว่าผู้ใช้ Login ผ่าน LINE หรือยัง ถ้ายังให้ Redirect ไปหน้า Login
    if (!liff.isLoggedIn()) {
        window.location.href = "/"; // หรือ URL อื่นๆ ที่ต้องการให้ Redirect
        return;
    }

    // ดึง userId ของผู้ใช้ LINE
    const userId = liff.getContext().userId;
    console.log('LINE User ID:', userId);

    // เพิ่ม Event Listener ให้กับฟอร์มเมื่อมีการ Submit
    document.getElementById('reportForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // ป้องกันการ Submit แบบปกติ

        // ดึงค่าจากฟอร์ม
        const topic = document.getElementById('topic').value;
        const details = document.getElementById('details').value;
        const deviceType = document.getElementById('deviceType').value;
        const location = document.getElementById('location').value;
        const imageUrl = document.getElementById('image').value;

        // สร้าง Object สำหรับส่งไปยัง Power Automate
        const formData = {
            userId: userId,
            topic: topic,
            details: details,
            deviceType: deviceType,
            location: location,
            imageUrl: imageUrl
        };

        try {
            // แทนที่ 'YOUR_POWER_AUTOMATE_WEBHOOK_URL' ด้วย Webhook URL ที่คุณจะได้รับจาก Power Automate
            const response = await fetch('YOUR_POWER_AUTOMATE_WEBHOOK_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // ตรวจสอบสถานะการตอบกลับ
            if (response.ok) {
                alert('ส่งข้อมูลแจ้งซ่อมเรียบร้อยแล้ว');
                liff.closeWindow(); // ปิดหน้าต่าง LIFF
            } else {
                alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
                const errorData = await response.json();
                console.error('Error sending data:', errorData);
            }
        } catch (error) {
            console.error('Error sending data:', error);
            alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
        }
    });
}

// เรียกฟังก์ชัน main เมื่อ LIFF พร้อมใช้งาน
document.addEventListener('DOMContentLoaded', () => {
    main();
});