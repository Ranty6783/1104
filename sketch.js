/*
2023/01/01
#genuary1 "Perfect loop / Infinite loop / endless GIFs"
@senbaku
*/

let mover = [];
let num;
let rnum;
let points;
let count = 3;
let w;

let currentWork = 1; // 預設為 1，可根據需求切換

function setup() {
    rnum = random(100)
    // 全螢幕設定
    let sizes = min(windowWidth, windowHeight);
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    w = min(windowWidth, windowHeight) / count;
    let radius = w / 2;
    points = 4;
    num = 360 / points;

	for (let i = 0; i < 360; i += num) {
		for (let j = 0; j < points; j++) {
			let ex = radius * sin(i * j);
			let ey = radius * cos(i * j);
			let ex2 = radius * sin(i * (j + 1));
			let ey2 = radius * cos(i * (j + 1));
			mover[j] = new Mover(ex, ey, ex2, ey2, radius, j);
		}
	}
	//rain texture	
	pg = createGraphics(width, height);
	pg.noFill();
	for (let i = 0; i < 3000; i++) {
		let x = random(width);
		let y = random(height);
		let n = noise(x * 0.01, y * 0.01) * width * 0.01;
		pg.stroke(100);
		pg.line(x, y, x, y + n);
	}

}

function draw() {
    background(51);
    image(pg,0,0);
    randomSeed(rnum);
    tile();

    // ====== 顯示中央標題 ======
    push();
    textAlign(CENTER, CENTER);
    textSize(96); // 字體大小大兩倍
    stroke(0, 180);      // 黑色陰影
    strokeWeight(8);
    fill(255);           // 白色字
    text("彭禹軒\n414730852", width / 2, height / 2);
    pop();
    // =========================

    // 顯示選單（滑鼠靠近左上方或在選單／子選單區域時）
    if (isMouseNearMenu()) {
        showMenu();
    }
}

// 顯示選單
function showMenu() {
    push();
    fill(30, 180);
    noStroke();
    rect(0, 0, menuW, height);

    textSize(20);
    textAlign(LEFT, TOP);

    // 主選單項目
    let curY = menuY;
    for (let i = 0; i < menuItems.length; i++) {
        let y1 = curY;
        let y2 = y1 + menuH;

        // 滑鼠在這個選單項目上時，背景變灰色
        if (mouseX > menuX && mouseX < menuX + menuW && mouseY > y1 && mouseY < y2) {
            fill(180, 180, 180, 180);
            rect(menuX - 5, y1, menuW - 10, menuH, 5);
            fill(30);
        } else {
            fill(255);
        }
        text(menuItems[i], menuX, y1);

        // 子選單（淡江大學）
        let sub = submenuMap[i];
        if (sub) {
            let sx = menuX;
            let sy = y1 + menuH;
            let sw = menuW;
            let sh = menuH * sub.items.length;
            let overParent = (mouseX > menuX && mouseX < menuX + menuW && mouseY > y1 && mouseY < y2);
            let overSub = (mouseX > sx && mouseX < sx + sw && mouseY > sy && mouseY < sy + sh);
            if (overParent || overSub) {
                fill(30, 220);
                noStroke();
                rect(sx - 5, sy, sw + 10, sh, 5);
                for (let k = 0; k < sub.items.length; k++) {
                    let sy1 = sy + k * menuH;
                    let sy2 = sy1 + menuH;
                    if (mouseX > sx && mouseX < sx + sw && mouseY > sy1 && mouseY < sy2) {
                        fill(200);
                        rect(sx, sy1, sw, menuH, 5);
                        fill(30);
                    } else {
                        fill(255);
                    }
                    text(sub.items[k], sx + 10, sy1 + 4);
                }
                curY = y1 + menuH + sh;
                continue;
            }
        }
        curY = y1 + menuH;
    }

    // 獨立顯示「關閉作品」在選單最下方
    let closeY = height - menuH - 20;
    if (mouseX > menuX && mouseX < menuX + menuW && mouseY > closeY && mouseY < closeY + menuH) {
        fill(180, 180, 180, 180);
        rect(menuX - 5, closeY, menuW - 10, menuH, 5);
        fill(30);
    } else {
        fill(255);
    }
    text(closeItem, menuX, closeY);

    pop();
}

// 新增選單項目座標與高度
const menuX = 25;
const menuY = 25;
const menuW = 200;
const menuH = 30;
// 將 "關閉作品" 從主選單獨立出來
const menuItems = ["爆炸球球", "爆炸球球的講義", "測驗", "講義","淡江大學"];
const menuLinks = [
    "https://ranty6783.github.io/20251014_score/",
    "https://hackmd.io/@ySsZ9ROATrOTOSjBWMVqHQ/ryFxt_khee",
    "https://ranty6783.github.io/-/",
    "https://hackmd.io/@ySsZ9ROATrOTOSjBWMVqHQ/S1PQRJPyWx",
    "https://www.tku.edu.tw/"
];
const closeItem = "關閉作品";

// 子選單資料（key = 主選單索引）
const submenuMap = {
    4: {
        items: ["教育科技"],
        links: ["https://www.et.tku.edu.tw/"]
    }
};

// 新增滑鼠點擊偵測（改用與顯示一致的累積高度邏輯）
function mousePressed() {
    // 主選單
    if (mouseX < menuW + 20) {
        let curY = menuY;
        for (let i = 0; i < menuItems.length; i++) {
            let y1 = curY;
            let y2 = y1 + menuH;

            let sub = submenuMap[i];
            if (sub) {
                let sx = menuX;
                let sy = y1 + menuH;
                let sw = menuW;
                let sh = menuH * sub.items.length;
                let overParent = (mouseX > menuX && mouseX < menuX + menuW && mouseY > y1 && mouseY < y2);
                let overSub = (mouseX > sx && mouseX < sx + sw && mouseY > sy && mouseY < sy + sh);
                if (overParent || overSub) {
                    for (let k = 0; k < sub.items.length; k++) {
                        let sy1 = sy + k * menuH;
                        let sy2 = sy1 + menuH;
                        if (mouseX > sx && mouseX < sx + sw && mouseY > sy1 && mouseY < sy2) {
                            if (sub.links[k]) showIframe(sub.links[k]);
                            else hideIframe();
                            return;
                        }
                    }
                    curY = y1 + menuH + sh;
                    // 不 continue，讓主選單也能點擊
                } else {
                    curY = y1 + menuH;
                }
            } else {
                curY = y1 + menuH;
            }

            // 點主選單
            if (mouseX > menuX && mouseX < menuX + menuW && mouseY > y1 && mouseY < y2) {
                if (menuLinks[i]) {
                    showIframe(menuLinks[i]);
                } else {
                    hideIframe();
                }
                return;
            }
        }

        // 點擊「關閉作品」
        let closeY = height - menuH - 20;
        if (mouseX > menuX && mouseX < menuX + menuW && mouseY > closeY && mouseY < closeY + menuH) {
            hideIframe();
            return;
        }
    }
}

function tile() {
    // 讓 i, j 從 0 開始，直到畫布邊界（包含邊界）
    for (let i = 0; i <= width / w; i++) {
        for (let j = 0; j <= height / w; j++) {
            shape(i * w, j * w, w * 0.5);
        }
    }
}

function shape(x, y) {
    push();
    translate(x, y);
    for (let j = 0; j < points; j++) {
        // 作品二：所有排都顯示鬼魂
        mover[j].show(false);
        mover[j].update();
        mover[j].check();
    }
    pop();
}

class Mover {
    constructor(x, y, nx, ny, r, j) {
        this.radius = r; 
        this.x = x;
        this.y = y;
        this.nx = nx;
        this.ny = ny;
        this.pos1 = createVector(this.x, this.y);
        this.pos2 = createVector(this.nx, this.ny);
        this.vel = createVector(0.1, 0); 
        this.vel.mult(0.01);
        this.acc = createVector(0, 0); 
        this.acc.setMag(0.01);
        this.j = j;
    }
    update() {
        // 作品二：移動方式反過來（加速度方向反向）
        if (currentWork === 2) {
            this.acc = p5.Vector.sub(this.pos1, this.pos2); // 反向
        } else {
            this.acc = p5.Vector.sub(this.pos2, this.pos1); // 正常
        }
        this.d = int(dist(this.pos2.x, this.pos2.y, this.pos1.x, this.pos1.y));
        let length = map(this.d, 0, this.radius, 0, 10, true);
        this.vel.add(this.acc);
        this.vel.limit(length / 50);
        this.pos1.add(this.vel);
    }
    show(isTopRow) {
        noStroke();
        let eyecol = color('#594f4f');
        let ghostsize = this.radius * 1.5;
        let ghostcol;
        if (currentWork === 3) {
            ghostcol = color(255, 0, 0); // 作品三：紅色
        } else if (currentWork === 2) {
            // 作品二：顏色漸層反過來（黑→白）
            ghostcol = color(map(this.pos1.y, -this.radius, this.radius, 255, 51));
        } else {
            // 作品一：正常漸層（白→黑）
            ghostcol = color(map(this.pos1.y, -this.radius, this.radius, 51, 255));
        }
        // 顯示鬼魂
        if (currentWork !== 2 || isTopRow) { // 這行可移除，讓所有鬼魂都顯示
            if (this.j == 0) {
                ghost(this.pos1.x, this.pos1.y, ghostsize, ghostcol);
                fill(eyecol);
                ellipse(this.pos1.x - ghostsize * 0.13, this.pos1.y - ghostsize * 0.1, ghostsize * 0.04);
            }
            if (this.j == 1) {
                ghost(this.pos1.x, this.pos1.y, ghostsize, ghostcol);
                fill(eyecol)
                ellipse(this.pos1.x + ghostsize * 0.13, this.pos1.y - ghostsize * 0.1, ghostsize * 0.04);
            }
            if (this.j == 2) {
                ghost(this.pos1.x, this.pos1.y, ghostsize, ghostcol);
                fill(eyecol)
                ellipse(this.pos1.x + ghostsize * 0.13, this.pos1.y - ghostsize * 0.1, ghostsize * 0.04);
                ellipse(this.pos1.x, this.pos1.y - ghostsize * 0.1, ghostsize * 0.04);
            }
            if (this.j == 3) {
                ghost(this.pos1.x, this.pos1.y, ghostsize, ghostcol);
                fill(eyecol)
                ellipse(this.pos1.x - ghostsize * 0.13, this.pos1.y - ghostsize * 0.1, ghostsize * 0.04);
                ellipse(this.pos1.x, this.pos1.y - ghostsize * 0.1, ghostsize * 0.04);
            }
        }
    }
    check() {
        let distance = this.pos1.dist(this.pos2);
        if (distance < 1) {
            this.pos1.x = this.x;
            this.pos1.y = this.y;
        }
    }
}


function ghost(x, y, w, ghostcol) {
	let size = 5;
	let hW = w / size;
	let hH = w / (size - 1);
	let susonum = 3
	noStroke();
	push();
	//oscillation------

	translate(x, y);
	push();
	fill(ghostcol);
	beginShape();
	vertex(hW, 0);
	bezierVertex(hW * 1.1, -hH * 1.35, -hW * 1.1, -hH * 1.35, -hW, 0);
	vertex(-hW, hH);
	for (let i = -hW; i < hW + 1; i += 1) {
		let y = hH + hH / 10 * sin(i * susonum * 360/ (hW * 2) - 90);
		vertex(i, y);
	}
	vertex(hW, 0);
	endShape();
	pop();
	pop();
}

let myIframe = null;

function showIframe(url) {
    if (!myIframe) {
        myIframe = createElement('iframe');
        myIframe.style('position', 'absolute');
        myIframe.style('left', `${windowWidth * 0.1}px`);
        myIframe.style('top', '0px');
        myIframe.style('width', `${windowWidth * 0.8}px`);
        myIframe.style('height', `${windowHeight}px`);
        myIframe.style('border', 'none');
        myIframe.style('z-index', '10');
        myIframe.parent(document.body);
    }
    myIframe.attribute('src', url);
    myIframe.show();
}

function hideIframe() {
    if (myIframe) {
        myIframe.hide();
    }
}

// 顯示/隱藏 p5 畫布
function hideP5Canvas() {
    let cnv = document.querySelector('canvas');
    if (cnv) cnv.style.display = 'none';
}
function showP5Canvas() {
    let cnv = document.querySelector('canvas');
    if (cnv) cnv.style.display = '';
}

// 新增：判斷滑鼠是否在選單或子選單「接合區域」內，避免在移動時斷開
function getMaxSubmenuLength() {
    let maxLen = 0;
    for (let k in submenuMap) {
        if (submenuMap[k] && submenuMap[k].items && submenuMap[k].items.length > maxLen) {
            maxLen = submenuMap[k].items.length;
        }
    }
    return maxLen;
}
function isMouseNearMenu() {
    // 若滑鼠在主選單列範圍內，或在左側一定寬度 & 上方高度內，就顯示選單
    let extraGap = 20; // 水平延伸區，方便滑鼠移動
    let maxSub = getMaxSubmenuLength();
    let totalHeight = menuY + menuItems.length * menuH + maxSub * menuH + 10;

    // 修正：將「關閉作品」區域也納入選單顯示判斷
    let closeY = height - menuH - 20;
    let closeBottom = closeY + menuH;
    let mouseInClose = (mouseX >= menuX && mouseX < menuX + menuW && mouseY >= closeY && mouseY < closeBottom);

    if (
        (mouseX >= 0 && mouseX < menuW + extraGap && mouseY >= 0 && mouseY < totalHeight) ||
        mouseInClose
    ) return true;

    // 也保留原本在左上小範圍會顯示的行為
    if (mouseX < 120 && mouseY < 120) return true;
    return false;
}