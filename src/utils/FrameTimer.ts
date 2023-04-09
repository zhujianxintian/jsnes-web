const FPS = 60.098;

interface FrameTimerProps {
    onGenerateFrame: any;

    onWriteFrame: any;
}

class FrameTimer {
    onGenerateFrame: any;

    onWriteFrame: any;

    running: boolean;

    interval: number;

    lastFrameTime: any;

    private _requestID: number | null = null;

    constructor(props: FrameTimerProps) {
        // Run at 60 FPS
        this.onGenerateFrame = props.onGenerateFrame;
        // Run on animation frame
        this.onWriteFrame = props.onWriteFrame;
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
        this.running = true;
        this.interval = 1e3 / FPS;
        this.lastFrameTime = false;
    }

    start() {
        this.running = true;
        this.requestAnimationFrame();
    }

    stop() {
        this.running = false;
        if (this._requestID) {
            window.cancelAnimationFrame(this._requestID);
        }
        this.lastFrameTime = false;
    }

    requestAnimationFrame() {
        this._requestID = window.requestAnimationFrame(this.onAnimationFrame);
    }

    generateFrame() {
        this.onGenerateFrame();
        this.lastFrameTime += this.interval;
    }

    onAnimationFrame = (time: any) => {
        this.requestAnimationFrame();
        // how many ms after 60fps frame time
        const excess = time % this.interval;

        // newFrameTime is the current time aligned to 60fps intervals.
        // i.e. 16.6, 33.3, etc ...
        const newFrameTime = time - excess;

        // first frame, do nothing
        if (!this.lastFrameTime) {
            this.lastFrameTime = newFrameTime;
            return;
        }

        const numFrames = Math.round((newFrameTime - this.lastFrameTime) / this.interval);

        // This can happen a lot on a 144Hz display
        if (numFrames === 0) {
            // console.log("WOAH, no frames");
            return;
        }

        // update display on first frame only
        this.generateFrame();
        this.onWriteFrame();

        // we generate additional frames evenly before the next
        // onAnimationFrame call.
        // additional frames are generated but not displayed
        // until next frame draw
        const timeToNextFrame = this.interval - excess;
        for (let i = 1; i < numFrames; i++) {
            const timeout = (i * timeToNextFrame) / numFrames;
            setTimeout(() => this.generateFrame(), timeout);
        }
        if (numFrames > 1) {
            console.log('SKIP', numFrames - 1, this.lastFrameTime);
        }
    };
}

export default FrameTimer;
