// import amqp from 'amqplib';
// import 'dotenv/config';

// let channel = null;

// export const initRabbitMQ = async () => {
//     try {
//         const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
//         channel = await connection.createChannel();
        
//         // 2 Queue riêng biệt theo yêu cầu của bạn
//         await channel.assertQueue('leaf_processing_queue', { durable: true });
//         await channel.assertQueue('general_processing_queue', { durable: true }); // Cho thân, hoa
        
//         console.log('✅ RabbitMQ: Connected and Queues initialized.');
//     } catch (error) {
//         console.error('❌ RabbitMQ Error:', error);
//     }
// };

// export const pushToQueue = async (imageRecord) => {
//     if (!channel) return;

//     // Chọn queue dựa vào loại bộ phận
//     const queueName = imageRecord.part_type === 'Leaf' ? 'leaf_processing_queue' : 'general_processing_queue';
    
//     const payload = {
//         plant_image_id: imageRecord.plant_image_id,
//         object_key: imageRecord.url, // URL lưu trong DB chính là objectKey của MinIO
//         part_type: imageRecord.part_type
//     };

//     channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), { persistent: true });
//     console.log(`📩 Pushed to ${queueName}: Image ID ${imageRecord.plant_image_id}`);
// };

import amqp from 'amqplib';
import 'dotenv/config';

let channel = null;
let connection = null; // Thêm biến lưu trữ connection để dễ quản lý

export const initRabbitMQ = async () => {
    try {
        const mqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
        
        connection = await amqp.connect(mqUrl);
        channel = await connection.createChannel();
        
        // Khởi tạo 2 Queue riêng biệt
        await channel.assertQueue('leaf_processing_queue', { durable: true });
        await channel.assertQueue('general_processing_queue', { durable: true }); 
        
        console.log('✅ RabbitMQ: Connected and Queues initialized.');

        // --- XỬ LÝ SỰ KIỆN KHI BỊ ĐỨT KẾT NỐI GIỮA CHỪNG ---
        connection.on('error', (err) => {
            console.error('❌ RabbitMQ Connection Error:', err.message);
            // (Không cần gọi thử lại ở đây vì sự kiện 'close' luôn được gọi ngay sau 'error')
        });

        connection.on('close', () => {
            console.error('⚠️ RabbitMQ Connection Closed. Reconnecting in 10 seconds...');
            channel = null; // Reset lại channel để chặn pushToQueue
            setTimeout(initRabbitMQ, 10000); // Thử kết nối lại sau 10s
        });

    } catch (error) {
        console.error(`❌ RabbitMQ Connection Failed: ${error.message}`);
        console.log('⏳ Retrying RabbitMQ connection in 10 seconds...');
        
        // CƠ CHẾ CHỜ 10 GIÂY VÀ THỬ LẠI LÚC KHỞI ĐỘNG
        setTimeout(initRabbitMQ, 10000); 
    }
};

export const pushToQueue = async (imageRecord) => {
    // Chặn luồng nếu RabbitMQ đang sập hoặc đang trong quá trình reconnect 10s
    if (!channel) {
        console.error('⚠️ Cannot push to queue: RabbitMQ channel is not ready.');
        return; 
    }

    // Chọn queue dựa vào loại bộ phận
    const queueName = imageRecord.part_type === 'Leaf' ? 'leaf_processing_queue' : 'general_processing_queue';
    
    const payload = {
        plant_image_id: imageRecord.plant_image_id,
        object_key: imageRecord.url, // URL lưu trong DB chính là objectKey của MinIO
        part_type: imageRecord.part_type
    };

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), { persistent: true });
    console.log(`📩 Pushed to ${queueName}: Image ID ${imageRecord.plant_image_id}`);
};