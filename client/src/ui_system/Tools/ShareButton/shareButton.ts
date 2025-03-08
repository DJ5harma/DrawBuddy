import { nanoid } from "nanoid";
import { SocketConn } from "../../../socket/socket_conn";

export class sharebutton {
    private static sharePanel: HTMLDivElement | null = null;

    public static init() {
        const element = document.querySelector<HTMLDivElement>("#share_button");

        const share_button = document.createElement("button");
        share_button.textContent = "Share";

        share_button.style.backgroundColor = "rgb(237, 238, 157)";
        share_button.style.color = "rgb(9, 9, 8)";
        share_button.style.position = "absolute";
        share_button.style.top = "5%";
        share_button.style.right = "5%";
        share_button.style.height = "40px";
        share_button.style.width = "70px";

        share_button.addEventListener("click", (e) => this.handleClick(e));

        element?.appendChild(share_button);
    }

    public static handleClick(e: MouseEvent) {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        let roomId = params.get("room");
        if (!roomId) roomId = nanoid();

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("room", roomId);
        window.history.pushState({}, "", currentUrl.toString());

        SocketConn.socket.emit("joinRoom",(roomId));

        if (this.sharePanel) {
            document.body.removeChild(this.sharePanel);
            this.sharePanel = null;
            return;
        }

        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.top = "20%";
        container.style.left = "50%";
        container.style.transform = "translateX(-50%)";
        container.style.width = "400px";
        container.style.backgroundColor = "white";
        container.style.padding = "20px";
        container.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
        container.style.borderRadius = "8px";
        container.style.zIndex = "999";

        const closeButton = document.createElement("button");
        closeButton.innerText = "✕";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.color = "rgb(0,0,0)";
        closeButton.style.right = "10px";
        closeButton.style.background = "transparent";
        closeButton.style.border = "none";
        closeButton.style.fontSize = "1.2rem";
        closeButton.style.cursor = "pointer";

        closeButton.addEventListener("click", () => {
            document.body.removeChild(container);
            this.sharePanel = null;
        });

        container.appendChild(closeButton);

        const title = document.createElement("h2");
        title.innerText = "Live collaboration";
        title.style.color = "rgb(0, 0, 0)";
        container.appendChild(title);

        const nameLabel = document.createElement("label");
        nameLabel.innerText = "Your name";
        nameLabel.style.display = "block";
        nameLabel.style.marginBottom = "5px";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = "Golden Bison";

        nameInput.style.height = "30px";
        nameInput.style.width = "100%";
        nameInput.style.marginBottom = "15px";

        container.appendChild(nameLabel);
        container.appendChild(nameInput);

        const linkLabel = document.createElement("label");
        linkLabel.innerText = "Link";
        linkLabel.style.display = "block";
        linkLabel.style.marginBottom = "5px";

        const linkWrapper = document.createElement("div");
        linkWrapper.style.display = "flex";
        linkWrapper.style.alignItems = "center";

        const linkInput = document.createElement("input");
        linkInput.type = "text";
        linkInput.style.height = "30px";
        linkInput.value = `${window.location.origin}?room=${roomId}`;
        linkInput.style.flex = "1";

        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy link";
        copyButton.style.marginLeft = "10px";
        copyButton.style.height = "30px";
        copyButton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(linkInput.value);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy text: ", err);
            }
        });

        linkWrapper.appendChild(linkInput);
        linkWrapper.appendChild(copyButton);

        container.appendChild(linkLabel);
        container.appendChild(linkWrapper);

        const note = document.createElement("p");
        note.style.margin = "15px 0";
        note.style.fontSize = "0.9rem";
        note.style.color = "#555";
        note.innerText =
            "Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what you draw. " +
            "Stopping the session will disconnect you from the room, but you'll be able to continue working with the scene locally. " +
            "Note that this won't affect other people, and they'll still be able to collaborate on their version.";
        container.appendChild(note);

        const stopSessionButton = document.createElement("button");
        stopSessionButton.textContent = "Stop session";
        stopSessionButton.style.backgroundColor = "#f44336";
        stopSessionButton.style.color = "white";
        stopSessionButton.style.border = "none";
        stopSessionButton.style.padding = "8px 16px";
        stopSessionButton.style.cursor = "pointer";
        stopSessionButton.style.borderRadius = "4px";

        stopSessionButton.addEventListener("click", () => {
            document.body.removeChild(container);
            const url = new URL(window.location.href);
            url.searchParams.delete("room");
            window.history.replaceState({}, "", url.toString());
            this.sharePanel = null;
        });

        container.appendChild(stopSessionButton);

        document.body.appendChild(container);

        this.sharePanel = container;
    }
}
