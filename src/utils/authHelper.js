export const getAuthUser = () => {
    try {
        const meta = JSON.parse(localStorage.getItem("nexora_meta") || "{}");
        const user = JSON.parse(localStorage.getItem("nexora_user") || "{}");
        
        const name = meta.name || user.name || localStorage.getItem("userName") || "User";
        const email = meta.email || user.email || "";
        const role = meta.role || user.role || (name.toLowerCase().includes("admin") ? "admin" : "user");
        
        let avatar = meta.avatar || user.avatar;
        
        if (role === "admin") {
            if (!avatar || avatar === "" || avatar === "/nexora-tab-logo.svg") {
                avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22c55e&color=fff&bold=true`;
            }
        } else {
            if (!avatar || avatar === "" || avatar === "null") {
                avatar = "/nexora-tab-logo.svg";
            }
        }
        
        return { name, email, avatar, role };
    } catch (e) {
        return { name: "User", email: "", avatar: "https://ui-avatars.com/api/?name=U&background=3b82f6&color=fff", role: "user" };
    }
};

export const saveAuthUser = (data) => {
    localStorage.setItem("nexora_meta", JSON.stringify(data));
    
    const oldUser = JSON.parse(localStorage.getItem("nexora_user") || "{}");
    localStorage.setItem("nexora_user", JSON.stringify({ 
        ...oldUser, 
        name: data.name, 
        email: data.email,
        role: data.role,
        avatar: data.avatar
    }));
    
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("userUpdate"));
};

export const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nexora_user");
    localStorage.removeItem("nexora_meta");
    localStorage.removeItem("userName");
    localStorage.removeItem("nexora_event_logs"); // Opsional, tapi lebih bersih
};
