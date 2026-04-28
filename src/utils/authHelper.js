export const getAuthUser = () => {
    try {
        const meta = JSON.parse(localStorage.getItem("nexora_meta") || "{}");
        const user = JSON.parse(localStorage.getItem("nexora_user") || "{}");
        
        const name = meta.name || user.name || localStorage.getItem("userName") || "User";
        const email = meta.email || user.email || "";
        const avatar = meta.avatar || `https://ui-avatars.com/api/?name=${name}&background=random`;
        
        return { name, email, avatar };
    } catch (e) {
        return { name: "User", email: "", avatar: "https://ui-avatars.com/api/?name=U&background=random" };
    }
};

export const saveAuthUser = (data) => {
    localStorage.setItem("nexora_meta", JSON.stringify(data));
    localStorage.setItem("nexora_user", JSON.stringify({ name: data.name, email: data.email }));
    // Trigger storage event for other components to update if needed
    window.dispatchEvent(new Event("storage"));
};
