function handleOverlayClick(event, imgViewer) {
    const imgRect = imgViewer.getBoundingClientRect();

    if (
        event.clientX <= imgRect.x || event.clientX >= imgRect.right ||
        event.clientY <= imgRect.y || event.clientY >= imgRect.bottom
    ) {
        event.target.remove();
    }
}

/** @param {MouseEvent & {target: HTMLImageElement}} event */
function openImageView(event) {
    const overlay = document.createElement("div");
    const closeBtn = document.createElement("button");
    const viewerImg = document.createElement("img");

    viewerImg.src = event.target.src;

    let imgWidth = viewerImg.width;
    let imgHeight = viewerImg.height;

    if (imgWidth > window.innerWidth) {
        const maxWidth = window.innerWidth * 0.8;

        imgHeight = (maxWidth * imgHeight) / imgWidth;
        imgWidth = maxWidth;
    }

    if (imgHeight > window.innerHeight) {
        const maxHeight = window.innerHeight * 0.7;

        imgWidth = (maxHeight * imgWidth) / imgHeight;
        imgHeight = maxHeight;
    }

    viewerImg.style.width = imgWidth + "px";
    viewerImg.style.height = imgHeight + "px";

    let viewerImgX = window.innerWidth/2 - imgWidth/2;
    let viewerImgY = window.innerHeight/2 - imgHeight/2;

    viewerImg.style.maxWidth = "none";
    viewerImg.style.position = "absolute";
    viewerImg.style.left = viewerImgX + "px";
    viewerImg.style.top = viewerImgY + "px";

    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.75)";

    closeBtn.textContent = "X";
    closeBtn.title = "Close image";
    closeBtn.style.fontSize = "1.75rem";
    closeBtn.style.position = "fixed";
    closeBtn.style.top = "1.5rem";
    closeBtn.style.right = "1.5rem";
    closeBtn.style.width = "3rem";
    closeBtn.style.aspectRatio = "1/1";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.border = "2px solid grey";
    closeBtn.style.cursor = "pointer";

    overlay.appendChild(viewerImg);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", e => handleOverlayClick(e, viewerImg));
    closeBtn.addEventListener("click", () => overlay.remove());

    let mouseIsDown = false;
    // let startX = 0;
    // let startY = 0;

    viewerImg.addEventListener("mousedown", e => {
        e.preventDefault();
        mouseIsDown = true;
        // startX = e.clientX;
        // startY = e.clientY;
    });

    // let translateX = 0;
    // let translateY = 0;

    viewerImg.addEventListener("mousemove", e => {
        if (mouseIsDown) {
            // translateX += e.clientX - startX;
            // translateY += e.clientY - startY;
            // startX = e.clientX;
            // startY = e.clientY;

            const imgRect = e.target.getBoundingClientRect();

            const newPosX = e.movementX + imgRect.left;
            const newPosY = e.movementY + imgRect.top;

            e.target.style.left = newPosX + "px";
            e.target.style.top = newPosY + "px";

            e.target.style.cursor = "move";
        } else {
            e.target.style.cursor = "grab";
        }
    });

    viewerImg.addEventListener("mouseup", () => {
        mouseIsDown = false;
    });

    overlay.addEventListener("wheel", e => {
        e.preventDefault();

        const delta = e.deltaY * -1;
        const zoomFactor = 1.15;

        if (delta > 0) {
            imgWidth *= zoomFactor;
            imgHeight *= zoomFactor;
        } else {
            imgWidth /= zoomFactor;
            imgHeight /= zoomFactor;
        }

        viewerImg.style.width = imgWidth + "px";
        viewerImg.style.height = imgHeight + "px";

        // const imgRect = viewerImg.getBoundingClientRect();

        // const offsetX = e.clientX - imgRect.left;
        // const offsetY = e.clientY - imgRect.top;

        // viewerImgX += (offsetX - translateX) * (1 - zoomFactor);
        // viewerImgY += (offsetY - translateY) * (1 - zoomFactor);

        // viewerImg.style.left = viewerImgX + "px";
        // viewerImg.style.top = viewerImgY + "px";
    });
}

/** @type {NodeListOf<HTMLImageElement>} */
const imgs = document.querySelectorAll("img[posview]");

if (imgs.length === 0) throw new Error("There is no images to be viewed");

imgs.forEach(img => {
    img.addEventListener("click", openImageView);
    img.addEventListener("mouseover", e => e.target.style.cursor = "pointer");
});

// vim:ts=4:sw=4:sts=4
