import * as Keyboard from "../core/input/Keyboard.js";
import Vec2 from "./Vec2.js";


export function getArrowControls() {
    const moveUpPressed = Keyboard.isPressed(Keyboard.ARROW_UP) || Keyboard.isPressed(Keyboard.W) || Keyboard.isPressed(Keyboard.Z);
    const moveRightPressed = Keyboard.isPressed(Keyboard.ARROW_RIGHT) || Keyboard.isPressed(Keyboard.D);
    const moveDownPressed = Keyboard.isPressed(Keyboard.ARROW_DOWN) || Keyboard.isPressed(Keyboard.S);
    const moveLeftPressed = Keyboard.isPressed(Keyboard.ARROW_LEFT) || Keyboard.isPressed(Keyboard.A) || Keyboard.isPressed(Keyboard.Q);
    const vector = new Vec2(0.0, 0.0);
    if (moveUpPressed && !moveDownPressed) {
        vector.y -= 1.0;
    } else if (moveDownPressed && !moveUpPressed) {
        vector.y += 1.0;
    }
    if (moveRightPressed && !moveLeftPressed) {
        vector.x += 1.0;
    } else if (moveLeftPressed && !moveRightPressed) {
        vector.x -= 1.0;
    }
    return vector.normalize();
}
