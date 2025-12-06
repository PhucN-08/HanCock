import { useEffect, useState } from 'react';
import './chatbot.css';

const ChatBot = () => {

    const [showChatbot, setShowChatBot] = useState('');

    useEffect(() => {
        // const chatbotToggler = document.querySelector(".chatbot-toggler");
        const chatInput = document.querySelector(".chat-input textarea");
        const sendChatBtn = document.querySelector(".chat-input span");
        const chatbox = document.querySelector(".chatbox");

        let userMessage;
        const API_URL = "http://127.0.0.1:8000/chat"; // Thay bằng URL API của bạn

        // HÀM MỚI: Lấy hoặc tạo user_id duy nhất và lưu vào localStorage
        const getUserId = () => {
            let userId;
            if (localStorage.getItem("user")) {
                userId = JSON.parse(localStorage.getItem("user")).makh.toString();
            } else {
                userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem("chatbot_user_id", userId);
            }

            return userId;
        };

        const createChatLi = (message, className) => {
            // Tạo một thẻ <li> với message và class tương ứng
            const chatLi = document.createElement("li");
            chatLi.classList.add("chat", className);
            let chatContent = className === "outgoing"
                ? `<p>${message}</p>`
                : `<span class="material-symbols-outlined"><i class="bi bi-robot"></i></span><p>${message}</p>`;
            chatLi.innerHTML = chatContent;
            // Thêm thuộc tính để dễ dàng chọn phần tử <p> sau này
            if (className === "incoming") {
                chatLi.querySelector("p").setAttribute("data-role", "response");
            }
            return chatLi;
        }

        const generateResponse = (incomingChatLi) => {
            const messageElement = incomingChatLi.querySelector("p");

            // Lấy user_id
            const userId = getUserId();

            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // SỬA ĐỔI CHÍNH: Thêm user_id vào body của request
                body: JSON.stringify({
                    user_input: userMessage,
                    user_id: userId, // Thêm trường user_id ở đây
                })
            };

            // Gửi yêu cầu POST đến API
            fetch(API_URL, requestOptions)
                .then(res => res.json())
                .then(data => {
                    // Key 'system_output' phải khớp với class APIResponse Pydantic của bạn
                    messageElement.textContent = data.system_output.trim();
                })
                .catch((error) => {
                    messageElement.classList.add("error");
                    messageElement.textContent = "Oops! Đã có lỗi xảy ra. Vui lòng thử lại sau.";
                    console.error("Lỗi khi gọi API:", error);
                })
                .finally(() => {
                    chatbox.scrollTo(0, chatbox.scrollHeight);
                });
        }

        const handleChat = () => {
            userMessage = chatInput.value.trim();
            if (!userMessage) return;

            // Xóa nội dung textarea sau khi gửi
            chatInput.value = "";
            // Điều chỉnh lại chiều cao của textarea
            chatInput.style.height = "auto";


            // Thêm tin nhắn của người dùng vào chatbox
            chatbox.appendChild(createChatLi(userMessage, "outgoing"));
            chatbox.scrollTo(0, chatbox.scrollHeight);

            // Hiển thị tin nhắn "Đang suy nghĩ..." của bot
            setTimeout(() => {
                const incomingChatLi = createChatLi("Đang suy nghĩ...", "incoming");
                chatbox.appendChild(incomingChatLi);
                chatbox.scrollTo(0, chatbox.scrollHeight);
                generateResponse(incomingChatLi);
            }, 600);
        }
        // Bắt sự kiện click nút gửi
        sendChatBtn.addEventListener("click", handleChat);

        // Bắt sự kiện nhấn Enter để gửi và Shift+Enter để xuống dòng
        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleChat();
            }
        });

        // Tự động điều chỉnh chiều cao textarea
        chatInput.addEventListener("input", () => {
            chatInput.style.height = "auto";
            chatInput.style.height = `${chatInput.scrollHeight}px`;
        });


        // Bấm nút toggler để hiện/ẩn chatbot
        // chatbotToggler.addEventListener("click", () => {
        //     if (showChatbot) {
        //         console.log('test');
        //         setShowChatBot('show-chatbot');
        //     } else {
        //         setShowChatBot('');

        //     }
        // });


    }, [])
    // console.log(showChatbot);

    return (<div id='body' className={`${showChatbot}`}>
        <button class="chatbot-toggler"
            onClick={() => {
                if (showChatbot === '') {
                    setShowChatBot('show-chatbot');
                } else {
                    setShowChatBot('');

                }
            }}
        >
            <span class="material-symbols-outlined"><i class="bi bi-chat-left"></i></span>
            <span class="material-symbols-outlined"><i class="bi bi-x-lg"></i></span>
        </button>

        {/* <!-- Cửa sổ Chatbot --> */}

        <div class="chatbot">
            <header>
                <h2>Chatbot</h2>
                {/* <span class=" material-symbols-outlined">close</span> */}
            </header>
            <ul class="chatbox">
                {/* <!-- Tin nhắn của bot (mẫu) --> */}
                <li class="chat incoming">
                    <span class="material-symbols-outlined"><i class="bi bi-robot"></i></span>
                    <p>Xin chào! 👋<br />Tôi có thể giúp gì cho bạn?</p>
                </li>

                {/* <!-- <li class="chat outgoing">
                <p>Chào bạn, tôi cần tư vấn về sản phẩm.</p>
            </li> --> */}
            </ul>
            <div class="chat-input">
                <textarea placeholder="Nhập tin nhắn..." required></textarea>
                <span id="send-btn" class="material-symbols-outlined"><i class="bi bi-send"></i></span>
            </div>
        </div>

    </div>);
}

export default ChatBot;