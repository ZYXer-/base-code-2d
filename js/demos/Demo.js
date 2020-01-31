import { c, canvas } from "../core/canvas.js";
import * as Game from "../core/Game.js";
import * as Viewport from "../core/Viewport.js";
import * as Timer from "../core/Timer.js";
import * as Mouse from "../core/input/Mouse.js";
import * as Keyboard from "../core/input/Keyboard.js";
import * as Img from "../core/Img.js";
import * as Sound from "../core/Sound.js";
import * as Utils from "../utils/Utils.js";
import * as ImageProcessing from "../utils/ImageProcessing.js";
import * as Easing from "../utils/Easing.js";
import { QUART_PI, HALF_PI, PI, TWO_PI } from "../utils/GeometryUtils.js";
import { drawCircle } from "../utils/DrawUtils.js";
import Vec2 from "../utils/Vec2.js";
import Vec3 from "../utils/Vec3.js";
import Text from "../utils/Text.js";
import Button from "../utils/Button.js";
import ParticleSystem from "../utils/ParticleSystem.js";
import Color from "../utils/Color.js";
import Shaking from "../utils/Shaking.js";
import PixelText from "../utils/PixelText.js";
import Acceleratable from "../utils/Acceleratable.js";
import IntegerScaling from "../utils/IntegerScaling.js";
import * as Tooltip from "../Tooltip.js";
import * as offsetjs from "../libs/offset.min.js";


/*
 This class was made to demonstrate the abilities of the Base Code
 */
class Demo {


    constructor() {
        // This is the constant (rainbow) particle system
        this.demoParticleSystem1 = new ParticleSystem({
            emitter : new Vec3(225, 300, 0),
            emitterSize : { x : 40.0, y : 10.0, z : 0.0 },
            v : { x : { min : -50.0, max : 50.0 }, y : { min : -250.0, max : -200.0 }, z : { min : 0.0, max : 0.0 }},
            a : { x : { min : -10.0, max : 10.0 }, y : { min : 0.0, max : 0.0 }, z : { min : 0.0, max : 0.0 }},
            friction : { x : 0.0, y : 100.0, z : 0.0 },
            life : { min : 1.0, max : 2.0 },
            init : particle => {
                particle.color = Color.fromHSL(Utils.randFloat(0.0, 1.0), 1.0, 0.5);
            },
            draw : particle => {
                let opacity = Utils.clamp(particle.life / 2.0, 0.0, 1.0);
                c.fillStyle = "rgba(" + particle.color.r + ", " + particle.color.g + ", " + particle.color.b + ", " + opacity + ")";
                c.fillRect(particle.pos.x - 20, particle.pos.y - 20, 40, 40);
            }
        });

        // This is the (green) burst particle system
        this.demoParticleSystem2 = new ParticleSystem({
            mode : ParticleSystem.BURST_MODE,
            v : { x : { min : -240.0, max : 240.0 }, y : { min : -240.0, max : 240.0 }, z : { min : 0.0, max : 0.0 }},
            a : { x : { min : -6.0, max : 6.0 }, y : { min : -6.0, max : 6.0 }, z : { min : 0.0, max : 0.0 }},
            life : { min : 0.5, max : 0.7 },
            particlesPerTick : 50,
            draw : particle => {
                let opacity = Utils.clamp(particle.life / 0.7, 0.0, 1.0);
                c.fillStyle = "rgba(0, 127, 0, " + opacity + ")";
                c.fillRect(particle.pos.x - 10, particle.pos.y - 10, 20, 20);
            }
        });

        // Reads data from an image and saves it a two-dimensional array
        this.demoMatrixFromImage = ImageProcessing.readMatrix("demoData", 10, 10, "empty", {
            "#000000" : "full"
        });

        // Allows for screen shaking
        this.demoShaking = new Shaking();

        // Rotation and position of rotating and draggable image (black square with cross)
        this.demoImageRotation = 0;
        this.demoImagePos = new Vec2(450, 300);

        // Vertical line with interpolated positions
        this.demoInterpolationPos = 0;
        this.demoInterpolationVelocity = 0.0;
        this.demoInterpolationTarget = 0;

        // Text based on web font
        this.demoText = new Text({
            size : 40,
            font : "komika",
            align : "right",
            color : "#fff",
            borderWidth : 5,
            borderColor : "#000",
            maxWidth : 250,
            lineHeight : 50,
            verticalAlign : "bottom",
            letterSpacing : 3,
            appearCharPerSec : 10,
            monospaced : 25
        });

        // Text based on pixel font
        this.demoPixelText = new PixelText();
        this.demoPixelText.setAlignment(Text.CENTER);
        this.demoPixelText.text("Hello World!");

        // Moving arrow-key-controllable pawn
        this.demoPawn = new Acceleratable(
            Acceleratable.DIM_MODE_2D,
            new Vec2(700, 300),
            new Vec2(200.0, 200.0),
            new Vec2(400.0, 400.0),
            new Vec2(100.0, 100.0),
            Acceleratable.ANGLE_MODE_8WAY
        );

        // Setup scale full integer, load images
        this.demoIntegerScaling = new IntegerScaling(2, 5, 360, 202);
        this.demoIntegerScaling.addScalableImage("demoData");
        this.demoIntegerScaling.setPivotPoints(new Vec2(0, Viewport.height), new Vec2(-8, 8));

        // Setup polygon and offset it
        this.demoPolygon = [[13, 45], [45, 89], [56, 200], [190, 30], [121, 17]];
        this.demoPolygon.push(this.demoPolygon[0]);
        this.demoPolygonOffset1 = (new Offset()).data(this.demoPolygon).offset(-5)[0];
        this.demoPolygonOffset2 = (new Offset()).data(this.demoPolygon).arcSegments(10).offset(50)[0];

        // Setup button
        this.demoButton = new Button({
            x : 20,
            y : 200,
            w : 50,
            h : 25,
            click : () => {
                this.demoButton.setActive(false);
                this.demoButton.setTooltip("This button is now inactive");
            },
            draw : (x, y, w, h, over, down, active) => {
                c.fillStyle = "rgb(" + (over ? 128 : 0) + ", " + (down ? 128 : 0) + ", " + (active ? 128 : 0) + ")";
                c.fillRect(x, y, w, h);
            },
            active : true,
            tooltip : "Click this button to make it inactive."
        });
    }


    /*
 This is called when we enter the in-game state
 */
    show() {

        // Register mouse click event so that when you click, you trigger a birst of the second particle system,
        // trigger the screen shake, play the cannon sound and set the new position of the interpolating line.
        Mouse.left.registerUpCallback("demoFire", () => {
            if(!Game.paused) {
                this.demoParticleSystem2.setEmitter(Mouse.pos);
                this.demoParticleSystem2.burst();
                this.demoShaking.shake(6, 18, 2);
                Sound.play("cannon");
                this.demoInterpolationTarget = Mouse.pos.x;
            }
        });

        // Make the rotating image (black square with cross) draggable
        Mouse.left.registerDraggableArea("demoDragAndDrop", 420, 270, 60, 60, () => {
            console.log("started dragging.");
        }, () => {
            this.demoImagePos = this.demoImagePos.add(Mouse.left.dragDelta);
        }, () => {
            console.log("end dragging.");
        });

        // When you press 'C' you trigger a Countdown
        Keyboard.registerKeyUpHandler(Keyboard.C, () => {
            Timer.doForCountdown(3.0, progress => {
                this.demoPixelText.text("Progress: " + progress.toFixed(2));
            }, () => {
                this.demoPixelText.text("Hello World!");
            });
        });

        // Play Soundtrack
        this.demoSound = Sound.play("soundtrack");
    };


    /*
     This is called when we leave the in-game state
     */
    hide() {

        // Remove the mouse event listener
        Mouse.left.deleteUpCallback("demoFire");

        // Remove draggable area listener
        Mouse.left.deleteDraggableArea("demoDragAndDrop");

        // Remove key stroke listener for 'C' key
        Keyboard.deleteKeyUpHandler(Keyboard.C);

        // Stop Soundtrack
        this.demoSound.stop();
    };


    /*
     This is called when the window is rescaled
     */
    resize() {

        // Update integer are scaling
        this.demoIntegerScaling.resize();
    };


    /*
     This is called at each iteration of the game loop
     */
    update() {

        // reset tooltip content
        Tooltip.reset();

        let oldRotation = this.demoImageRotation;

        // Rotate rotating image (black square with cross)
        this.demoImageRotation += 2.0 * Timer.delta;

        // Update all timed callbacks
        Timer.updateCallbacks();

        // Update interpolating vertical line
        let interpolate = Easing.accelerateToPos(
            this.demoInterpolationPos,
            this.demoInterpolationTarget,
            this.demoInterpolationVelocity,
            2000.0,
            5000.0
        );
        this.demoInterpolationPos = interpolate.pos;
        this.demoInterpolationVelocity = interpolate.velocity;

        // Get arrow key inputs and apply it to arrow-key-controlled pawn
        let arrowKeys = Utils.getArrowControls();
        this.demoPawn.update(arrowKeys);

        if(oldRotation < 3.0 && this.demoImageRotation >= 3.0) {
            this.demoSound.fadeOut(2.0);
        }

        if(oldRotation < 8.0 && this.demoImageRotation >= 8.0) {
            this.demoSound.fadeIn(2.0);
        }

        if(oldRotation < 15.0 && this.demoImageRotation >= 15.0) {
            this.demoSound.fadeTo(1.0, 100);
        }

        if(oldRotation < 90.0 && this.demoImageRotation >= 90.0) {
            this.demoSound.stop();
        }
    };


    /*
     This is called at each iteration of the game loop after update
     */
    draw() {

        // Draw the matrix we loaded from an image
        for(let x = 0; x < 10; x++) {
            for(let y = 0; y < 10; y++) {
                if(this.demoMatrixFromImage[x][y] === "full") {
                    c.fillStyle = "#ddd";
                    c.fillRect(x * 20, y * 20, 20, 20);
                    if(Mouse.isOver(x * 20, y * 20, 20, 20)) {
                        Tooltip.set("You are now over matrix field: " + x + "/" + y);
                        if(x === 3 && y === 3) {
                            Tooltip.setOverridePosition(new Vec2(20, 20));
                        }
                    }
                }
            }
        }

        // Draw vertical interpolating bar
        c.fillStyle = "#999";
        c.fillRect(this.demoInterpolationPos, 0, 1, Viewport.height);

        // Draw pixel text ("Hello World");
        this.demoPixelText.pos(Viewport.centerX, Viewport.height - 100);
        this.demoPixelText.draw();

        // Apply screen shake
        this.demoShaking.apply();

        // Draw rotating image (black square with cross)
        Img.drawRotated("test", this.demoImagePos.x, this.demoImagePos.y, 38, 38, this.demoImageRotation);

        // Draw both particle systems
        // PerformanceMonitor.startStopwatch(3);
        this.demoParticleSystem1.draw();
        // PerformanceMonitor.stopStopwatch(3);
        // PerformanceMonitor.startStopwatch(4);
        this.demoParticleSystem2.draw();
        // PerformanceMonitor.stopStopwatch(4);

        // Draw texture we generated in CustomPreloading.js
        Img.draw("demoGeneratedTexture", 740, 440);

        // Draw arrow-key-controlled pawn
        c.save();
        c.translate(this.demoPawn.pos.x, this.demoPawn.pos.y);
        c.rotate(this.demoPawn.angle * QUART_PI);

        // Check if mouse is hovering over pawn
        if(Mouse.isOverCircle(this.demoPawn.pos.x, this.demoPawn.pos.y, 12)) {
            c.fillStyle = "#f00";
        } else {
            c.fillStyle = "#c00";
        }

        drawCircle(c, 0, 0, 12);
        c.fill();

        c.fillStyle = "#fff";
        c.beginPath();
        c.moveTo(0, 10);
        c.lineTo(-5, -5);
        c.lineTo(5, -5);
        c.closePath();
        c.fill();

        c.restore();

        // Draw pixelated scaled image
        this.demoIntegerScaling.apply();
        this.demoIntegerScaling.draw("demoData", -5, -5);
        this.demoIntegerScaling.restore();

        // Draw integer scaled mask
        this.demoIntegerScaling.drawMask(-7, -193, 358, 200, "rgba(255, 0, 0, 0.1)");

        // Draw regular and offset polygons;
        c.save();
        c.translate(750, 100);
        c.strokeStyle = "#f00";
        c.beginPath();
        c.moveTo(this.demoPolygon[0][0], this.demoPolygon[0][1]);
        for(let i = 0; i < this.demoPolygon.length; i++) {
            c.lineTo(this.demoPolygon[i][0], this.demoPolygon[i][1]);
        }
        c.closePath();
        c.stroke();
        c.strokeStyle = "#0c0";
        c.beginPath();
        c.moveTo(this.demoPolygonOffset1[0][0], this.demoPolygonOffset1[0][1]);
        for(let i = 0; i < this.demoPolygonOffset1.length; i++) {
            c.lineTo(this.demoPolygonOffset1[i][0], this.demoPolygonOffset1[i][1]);
        }
        c.closePath();
        c.stroke();
        c.strokeStyle = "#00f";
        c.beginPath();
        c.moveTo(this.demoPolygonOffset2[0][0], this.demoPolygonOffset2[0][1]);
        for(let i = 0; i < this.demoPolygonOffset2.length; i++) {
            c.lineTo(this.demoPolygonOffset2[i][0], this.demoPolygonOffset2[i][1]);
        }
        c.closePath();
        c.stroke();
        c.restore();

        // Remove screen shake
        this.demoShaking.remove();

        // Draw web-font-based text (logo in bottom right)
        this.demoText.drawPosText(Viewport.width - 20, Viewport.height - 20, "ZYXer's Base Code");

        // Draw button
        this.demoButton.draw();

    };


    /*
     This is called if the game is paused in the in-game state
     */
    drawPausedScreen() {
        c.fillStyle = "rgba(0, 0, 0, 0.8)";
        c.fillRect(0, 0, Viewport.width, Viewport.height);

        Text.draw(Viewport.centerX, 100, 16, "komika", "center", "#fff", "Paused - Press P to unpause");
    };
    
}


export default Demo;