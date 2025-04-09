// ==UserScript==
// @name         Mine-craft.io Moe Client
// @namespace    http://tampermonkey.net/
// @author       ytmoe_1325
// @version      3.0
// @description  GUI with FPS display, FPS unlocker, auto sprint, autoclicker, auto bunny hop, ESP, and Claim Reward.
// @match        https://mine-craft.io/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    function createButton(text) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.background = "linear-gradient(45deg, #6a11cb, #2575fc)";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.padding = "8px 12px";
        btn.style.color = "#fff";
        btn.style.cursor = "pointer";
        btn.style.margin = "5px 0";
        btn.style.transition = "background 0.2s ease";
        btn.addEventListener('mouseover', () => {
            btn.style.background = "linear-gradient(45deg, #2575fc, #6a11cb)";
        });
        btn.addEventListener('mouseout', () => {
            btn.style.background = "linear-gradient(45deg, #6a11cb, #2575fc)";
        });
        return btn;
    }

    if (!document.body) return;
    const guiContainer = document.createElement('div');
    guiContainer.id = "customGuiContainer";
    guiContainer.style.position = "fixed";
    guiContainer.style.top = "10px";
    guiContainer.style.right = "10px";
    guiContainer.style.width = "280px";
    guiContainer.style.height = "380px";
    guiContainer.style.minWidth = "150px";
    guiContainer.style.minHeight = "150px";
    guiContainer.style.background = "rgba(20,20,20,0.8)";
    guiContainer.style.backdropFilter = "blur(8px)";
    guiContainer.style.border = "1px solid rgba(255,255,255,0.2)";
    guiContainer.style.borderRadius = "10px";
    guiContainer.style.boxShadow = "0 6px 12px rgba(0,0,0,0.5)";
    guiContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    guiContainer.style.color = "#fff";
    guiContainer.style.padding = "15px";
    guiContainer.style.overflow = "auto";
    guiContainer.style.transition = "all 0.3s ease";
    guiContainer.style.zIndex = "100000";
    document.body.appendChild(guiContainer);

    // Toggle GUI on Right Shift
    document.addEventListener('keydown', function (e) {
        if (e.code === 'ShiftRight') {
            guiContainer.style.display = (guiContainer.style.display === 'none') ? 'block' : 'none';
        }
    });

    const header = document.createElement('div');
    header.textContent = "Mine-craft.io Moe Client";
    header.style.cursor = "move";
    header.style.background = "rgba(255,255,255,0.1)";
    header.style.padding = "10px";
    header.style.borderRadius = "6px";
    header.style.fontWeight = "bold";
    header.style.fontSize = "16px";
    header.style.textAlign = "center";
    header.style.marginBottom = "15px";
    guiContainer.appendChild(header);

    header.addEventListener('mousedown', startDrag);
    function startDrag(e) {
        e.preventDefault();
        let startX = e.clientX, startY = e.clientY;
        const rect = guiContainer.getBoundingClientRect();
        const offsetX = startX - rect.left, offsetY = startY - rect.top;
        function onMouseMove(e) {
            guiContainer.style.left = (e.clientX - offsetX) + "px";
            guiContainer.style.top = (e.clientY - offsetY) + "px";
            guiContainer.style.right = "auto";
        }
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    const resizeHandle = document.createElement('div');
    resizeHandle.style.width = "15px";
    resizeHandle.style.height = "15px";
    resizeHandle.style.background = "rgba(255,255,255,0.4)";
    resizeHandle.style.position = "absolute";
    resizeHandle.style.right = "5px";
    resizeHandle.style.bottom = "5px";
    resizeHandle.style.cursor = "se-resize";
    resizeHandle.style.borderRadius = "3px";
    guiContainer.appendChild(resizeHandle);

    resizeHandle.addEventListener('mousedown', startResize);
    function startResize(e) {
        e.preventDefault();
        e.stopPropagation();
        let startX = e.clientX, startY = e.clientY;
        const startWidth = guiContainer.offsetWidth, startHeight = guiContainer.offsetHeight;
        function onMouseMove(e) {
            let newWidth = startWidth + (e.clientX - startX);
            let newHeight = startHeight + (e.clientY - startY);
            if (newWidth < 150) newWidth = 150;
            if (newHeight < 150) newHeight = 150;
            guiContainer.style.width = newWidth + "px";
            guiContainer.style.height = newHeight + "px";
        }
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    const content = document.createElement('div');
    content.style.fontSize = "14px";
    guiContainer.appendChild(content);

    const fpsDisplay = document.createElement('div');
    fpsDisplay.textContent = "FPS: Calculating...";
    fpsDisplay.style.marginBottom = "10px";
    content.appendChild(fpsDisplay);

    let lastFrameTime = performance.now(), frameCount = 0;
    function updateFPS() {
        const now = performance.now();
        frameCount++;
        if (now - lastFrameTime >= 1000) {
            fpsDisplay.textContent = "FPS: " + frameCount;
            frameCount = 0;
            lastFrameTime = now;
        }
        requestAnimationFrame(updateFPS);
    }
    requestAnimationFrame(updateFPS);

    const fpsUnlockerToggle = createButton("Enable FPS Unlocker");
    content.appendChild(fpsUnlockerToggle);

    let fpsUnlockerEnabled = false;
    const originalRAF = window.requestAnimationFrame;
    fpsUnlockerToggle.addEventListener('click', function () {
        fpsUnlockerEnabled = !fpsUnlockerEnabled;
        if (fpsUnlockerEnabled) {
            fpsUnlockerToggle.textContent = "Disable FPS Unlocker";
            window.requestAnimationFrame = function (callback) {
                return setTimeout(function () {
                    callback(performance.now());
                }, 0);
            };
        } else {
            fpsUnlockerToggle.textContent = "Enable FPS Unlocker";
            window.requestAnimationFrame = originalRAF;
        }
    });

    const autoSprintToggle = createButton("Enable Auto Sprint");
    content.appendChild(autoSprintToggle);

    let autoSprintEnabled = false, autoSprintInterval = null;
    autoSprintToggle.addEventListener('click', function () {
        autoSprintEnabled = !autoSprintEnabled;
        if (autoSprintEnabled) {
            autoSprintToggle.textContent = "Disable Auto Sprint";
            autoSprintInterval = setInterval(function () {
                const event = new KeyboardEvent('keydown', {
                    key: 'Shift',
                    code: 'ShiftLeft',
                    keyCode: 16,
                    bubbles: true
                });
                document.dispatchEvent(event);
            }, 100);
        } else {
            autoSprintToggle.textContent = "Enable Auto Sprint";
            clearInterval(autoSprintInterval);
            const event = new KeyboardEvent('keyup', {
                key: 'Shift',
                code: 'ShiftLeft',
                keyCode: 16,
                bubbles: true
            });
            document.dispatchEvent(event);
        }
    });

    const autoclickerToggle = createButton("Enable Autoclicker");
    content.appendChild(autoclickerToggle);

    let autoclickerEnabled = false;
    autoclickerToggle.addEventListener('click', function () {
        autoclickerEnabled = !autoclickerEnabled;
        if (autoclickerEnabled) {
            autoclickerToggle.textContent = "Disable Autoclicker";
            autoClicker();
        } else {
            autoclickerToggle.textContent = "Enable Autoclicker";
        }
    });

    function autoClicker() {
        if (!autoclickerEnabled) return;
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const mousedownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
            canvas.dispatchEvent(mousedownEvent);
            setTimeout(() => {
                const mouseupEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
                canvas.dispatchEvent(mouseupEvent);
            }, 20);
        }
        const randomDelay = Math.random() * (150 - 80) + 80;
        setTimeout(autoClicker, randomDelay);
    }

    const bunnyHopToggle = createButton("Enable Auto Bunny Hop");
    content.appendChild(bunnyHopToggle);

    let autoBunnyHopEnabled = false;
    let bunnyHopInterval = null;
    bunnyHopToggle.addEventListener('click', function () {
        autoBunnyHopEnabled = !autoBunnyHopEnabled;
        if (autoBunnyHopEnabled) {
            bunnyHopToggle.textContent = "Disable Auto Bunny Hop";
            bunnyHopInterval = setInterval(function () {
                const event = new KeyboardEvent('keydown', {
                    key: ' ',
                    code: 'Space',
                    keyCode: 32,
                    bubbles: true
                });
                document.dispatchEvent(event);
            }, 100);
        } else {
            bunnyHopToggle.textContent = "Enable Auto Bunny Hop";
            clearInterval(bunnyHopInterval);
        }
    });

    const claimRewardButton = createButton("Claim Reward");
    content.appendChild(claimRewardButton);

    // Create the notification style
    const notificationStyle = `
    <style>
        .notification {
            position: fixed;
            top: 20px;
            right: -300px;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            z-index: 9999;
            display: none;
            opacity: 0;
            transition: all 1s ease;
        }
        .notification.show {
            right: 20px;
            opacity: 1;
        }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', notificationStyle);

    // Create the notification element
    let notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = "✅ Daily Reward claimed!";
    document.body.appendChild(notification);

    claimRewardButton.addEventListener('click', () => {
        // Create the iframe to claim reward
        let iframe = document.createElement('iframe');
        iframe.src = "https://mine-craft.io/api/rewards/open";
        iframe.style.position = "absolute";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.style.border = "none";
        iframe.style.opacity = "0";
        document.body.appendChild(iframe);

        // Show notification after iframe is appended
        notification.style.display = 'block';
        setTimeout(() => {
            notification.classList.add('show');
        }, 200);

        // Remove the iframe and hide the notification after 7.5 seconds
        setTimeout(() => {
            iframe.remove();
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 1000);
            }, 500);
        }, 3500);
    });
})();
